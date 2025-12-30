/**
 * Augmentation Management Functions
 *
 * Handles installation, removal, and management of cyberware and bioware
 * augmentations on characters. Integrates with essence calculations,
 * validation, and wireless bonus systems.
 *
 * @satisfies Requirement: Post-creation management MUST support addition, removal, and grade-level upgrading
 * @satisfies Guarantee #4: Auditable record of modifications
 */

import type {
  Character,
  CyberwareItem,
  BiowareItem,
  CyberwareGrade,
  BiowareGrade,
} from "@/lib/types/character";
import type { CyberwareCatalogItem, BiowareCatalogItem, AugmentationRules } from "@/lib/types/edition";
import {
  calculateCyberwareEssence,
  calculateBiowareEssence,
  roundEssence,
  calculateTotalEssenceLoss,
} from "./essence";
import {
  getCyberwareGradeMultiplier,
  getBiowareGradeMultiplier,
  applyGradeToCost,
  applyGradeToAvailability,
  isValidGradeUpgrade,
  calculateGradeUpgradeEssenceRefund,
} from "./grades";
import {
  shouldTrackEssenceHole,
  updateEssenceHoleOnInstall,
  updateEssenceHoleOnRemoval,
  updateEssenceHoleOnGradeUpgrade,
  getCharacterEssenceHole,
} from "./essence-hole";
import {
  validateAugmentationInstall,
  DEFAULT_AUGMENTATION_RULES,
  type ValidationContext,
  type AugmentationValidationResult,
} from "./validation";
import { createCyberlimb, isCyberlimb, type CyberlimbItem } from "./cyberlimb";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of an augmentation installation
 */
export interface InstallResult {
  success: true;
  character: Character;
  installedItem: CyberwareItem | BiowareItem;
  essenceChange: number;
  magicLoss?: number;
}

/**
 * Error result for failed operations
 */
export interface OperationError {
  success: false;
  error: string;
  code: string;
  validationResult?: AugmentationValidationResult;
}

/**
 * Result of an augmentation removal
 */
export interface RemovalResult {
  success: true;
  character: Character;
  removedItem: CyberwareItem | BiowareItem;
  essenceRestored: number;
}

/**
 * Result of a grade upgrade
 */
export interface UpgradeResult {
  success: true;
  character: Character;
  upgradedItem: CyberwareItem | BiowareItem;
  essenceRefund: number;
  costDifference: number;
}

/**
 * Aggregated wireless bonuses when enabled
 */
export interface WirelessBonusAggregate {
  enabled: boolean;
  bonuses: WirelessBonus[];
  totalAttributeBonuses: Record<string, number>;
  totalInitiativeDiceBonus: number;
  descriptions: string[];
}

export interface WirelessBonus {
  sourceId: string;
  sourceName: string;
  description: string;
  attributeBonuses?: Record<string, number>;
  initiativeDiceBonus?: number;
}

/**
 * Aggregated bonuses from all augmentations
 */
export interface AugmentationBonuses {
  attributes: Record<string, number>;
  initiativeDice: number;
  limits: Record<string, number>;
  armorBonus: number;
  specialBonuses: Record<string, number>;
}

// =============================================================================
// INSTALLATION FUNCTIONS
// =============================================================================

/**
 * Install cyberware on a character
 *
 * @param character - The character to modify
 * @param catalogItem - The cyberware to install
 * @param grade - The grade of the cyberware
 * @param rating - Optional rating for rated items
 * @param context - Optional validation context
 * @returns Result with updated character and installed item, or error
 */
export function installCyberware(
  character: Character,
  catalogItem: CyberwareCatalogItem,
  grade: CyberwareGrade = "standard",
  rating?: number,
  context?: Partial<ValidationContext>
): InstallResult | OperationError {
  // Build validation context
  const validationContext: ValidationContext = {
    lifecycleStage: context?.lifecycleStage ?? (character.status === "draft" ? "creation" : "active"),
    rules: context?.rules ?? DEFAULT_AUGMENTATION_RULES,
    allowRestricted: context?.allowRestricted,
    allowForbidden: context?.allowForbidden,
  };

  // Validate the installation
  const validationResult = validateAugmentationInstall(
    character,
    catalogItem,
    grade,
    rating,
    validationContext
  );

  if (!validationResult.valid) {
    return {
      success: false,
      error: validationResult.errors.map(e => e.message).join(" "),
      code: validationResult.errors[0]?.code ?? "VALIDATION_FAILED",
      validationResult,
    };
  }

  // Calculate essence cost
  const essenceCost = calculateCyberwareEssence(catalogItem, grade, rating);

  // Create the installed item
  let installedItem: CyberwareItem;

  if (isCyberlimb(catalogItem as CyberwareItem)) {
    // Use special cyberlimb creation
    installedItem = createCyberlimb(catalogItem, grade, character) as CyberwareItem;
  } else {
    installedItem = createCyberwareItem(catalogItem, grade, rating);
  }

  // Generate unique ID if not present
  if (!installedItem.id) {
    installedItem.id = generateAugmentationId();
  }

  // Update character cyberware array
  const updatedCyberware = [...(character.cyberware ?? []), installedItem];

  // Calculate new essence
  const totalEssenceLoss = calculateTotalEssenceLoss(updatedCyberware, character.bioware ?? []);
  const newEssence = roundEssence(6 - totalEssenceLoss);

  // Update essence hole for magical characters
  let updatedEssenceHole = character.essenceHole;
  let magicLoss: number | undefined;

  if (shouldTrackEssenceHole(character)) {
    const holeResult = updateEssenceHoleOnInstall(
      getCharacterEssenceHole(character),
      essenceCost
    );
    updatedEssenceHole = holeResult.essenceHole;
    if (holeResult.additionalMagicLost > 0) {
      magicLoss = holeResult.additionalMagicLost;
    }
  }

  // Build updated character
  const updatedCharacter: Character = {
    ...character,
    cyberware: updatedCyberware,
    specialAttributes: {
      ...character.specialAttributes,
      essence: newEssence,
      // Reduce magic/resonance if applicable
      ...(magicLoss && character.specialAttributes.magic !== undefined && {
        magic: Math.max(0, character.specialAttributes.magic - magicLoss),
      }),
      ...(magicLoss && character.specialAttributes.resonance !== undefined && {
        resonance: Math.max(0, character.specialAttributes.resonance - magicLoss),
      }),
    },
    essenceHole: updatedEssenceHole,
  };

  return {
    success: true,
    character: updatedCharacter,
    installedItem,
    essenceChange: -essenceCost,
    magicLoss,
  };
}

/**
 * Install bioware on a character
 *
 * @param character - The character to modify
 * @param catalogItem - The bioware to install
 * @param grade - The grade of the bioware
 * @param rating - Optional rating for rated items
 * @param context - Optional validation context
 * @returns Result with updated character and installed item, or error
 */
export function installBioware(
  character: Character,
  catalogItem: BiowareCatalogItem,
  grade: BiowareGrade = "standard",
  rating?: number,
  context?: Partial<ValidationContext>
): InstallResult | OperationError {
  // Build validation context
  const validationContext: ValidationContext = {
    lifecycleStage: context?.lifecycleStage ?? (character.status === "draft" ? "creation" : "active"),
    rules: context?.rules ?? DEFAULT_AUGMENTATION_RULES,
    allowRestricted: context?.allowRestricted,
    allowForbidden: context?.allowForbidden,
  };

  // Validate the installation
  const validationResult = validateAugmentationInstall(
    character,
    catalogItem,
    grade,
    rating,
    validationContext
  );

  if (!validationResult.valid) {
    return {
      success: false,
      error: validationResult.errors.map(e => e.message).join(" "),
      code: validationResult.errors[0]?.code ?? "VALIDATION_FAILED",
      validationResult,
    };
  }

  // Calculate essence cost
  const essenceCost = calculateBiowareEssence(catalogItem, grade, rating);

  // Create the installed item
  const installedItem = createBiowareItem(catalogItem, grade, rating);

  // Generate unique ID if not present
  if (!installedItem.id) {
    installedItem.id = generateAugmentationId();
  }

  // Update character bioware array
  const updatedBioware = [...(character.bioware ?? []), installedItem];

  // Calculate new essence
  const totalEssenceLoss = calculateTotalEssenceLoss(character.cyberware ?? [], updatedBioware);
  const newEssence = roundEssence(6 - totalEssenceLoss);

  // Update essence hole for magical characters
  let updatedEssenceHole = character.essenceHole;
  let magicLoss: number | undefined;

  if (shouldTrackEssenceHole(character)) {
    const holeResult = updateEssenceHoleOnInstall(
      getCharacterEssenceHole(character),
      essenceCost
    );
    updatedEssenceHole = holeResult.essenceHole;
    if (holeResult.additionalMagicLost > 0) {
      magicLoss = holeResult.additionalMagicLost;
    }
  }

  // Build updated character
  const updatedCharacter: Character = {
    ...character,
    bioware: updatedBioware,
    specialAttributes: {
      ...character.specialAttributes,
      essence: newEssence,
      ...(magicLoss && character.specialAttributes.magic !== undefined && {
        magic: Math.max(0, character.specialAttributes.magic - magicLoss),
      }),
      ...(magicLoss && character.specialAttributes.resonance !== undefined && {
        resonance: Math.max(0, character.specialAttributes.resonance - magicLoss),
      }),
    },
    essenceHole: updatedEssenceHole,
  };

  return {
    success: true,
    character: updatedCharacter,
    installedItem,
    essenceChange: -essenceCost,
    magicLoss,
  };
}

// =============================================================================
// REMOVAL FUNCTIONS
// =============================================================================

/**
 * Remove cyberware from a character
 *
 * @param character - The character to modify
 * @param itemId - The ID of the cyberware to remove (can be id or catalogId)
 * @returns Result with updated character and removed item, or error
 */
export function removeCyberware(
  character: Character,
  itemId: string
): RemovalResult | OperationError {
  const cyberware = character.cyberware ?? [];
  const itemIndex = cyberware.findIndex(
    item => item.id === itemId || item.catalogId === itemId
  );

  if (itemIndex === -1) {
    return {
      success: false,
      error: `Cyberware with ID "${itemId}" not found on character.`,
      code: "NOT_FOUND",
    };
  }

  const removedItem = cyberware[itemIndex];
  const essenceRestored = removedItem.essenceCost;

  // Update cyberware array
  const updatedCyberware = cyberware.filter((_, i) => i !== itemIndex);

  // Calculate new essence
  const totalEssenceLoss = calculateTotalEssenceLoss(updatedCyberware, character.bioware ?? []);
  const newEssence = roundEssence(6 - totalEssenceLoss);

  // Update essence hole (peak stays, current decreases)
  let updatedEssenceHole = character.essenceHole;
  if (shouldTrackEssenceHole(character) && character.essenceHole) {
    const holeResult = updateEssenceHoleOnRemoval(character.essenceHole, essenceRestored);
    updatedEssenceHole = holeResult.essenceHole;
  }

  // Build updated character
  const updatedCharacter: Character = {
    ...character,
    cyberware: updatedCyberware,
    specialAttributes: {
      ...character.specialAttributes,
      essence: newEssence,
      // Note: Magic/Resonance stays reduced due to essence hole
    },
    essenceHole: updatedEssenceHole,
  };

  return {
    success: true,
    character: updatedCharacter,
    removedItem,
    essenceRestored,
  };
}

/**
 * Remove bioware from a character
 *
 * @param character - The character to modify
 * @param itemId - The ID of the bioware to remove (can be id or catalogId)
 * @returns Result with updated character and removed item, or error
 */
export function removeBioware(
  character: Character,
  itemId: string
): RemovalResult | OperationError {
  const bioware = character.bioware ?? [];
  const itemIndex = bioware.findIndex(
    item => item.id === itemId || item.catalogId === itemId
  );

  if (itemIndex === -1) {
    return {
      success: false,
      error: `Bioware with ID "${itemId}" not found on character.`,
      code: "NOT_FOUND",
    };
  }

  const removedItem = bioware[itemIndex];
  const essenceRestored = removedItem.essenceCost;

  // Update bioware array
  const updatedBioware = bioware.filter((_, i) => i !== itemIndex);

  // Calculate new essence
  const totalEssenceLoss = calculateTotalEssenceLoss(character.cyberware ?? [], updatedBioware);
  const newEssence = roundEssence(6 - totalEssenceLoss);

  // Update essence hole (peak stays, current decreases)
  let updatedEssenceHole = character.essenceHole;
  if (shouldTrackEssenceHole(character) && character.essenceHole) {
    const holeResult = updateEssenceHoleOnRemoval(character.essenceHole, essenceRestored);
    updatedEssenceHole = holeResult.essenceHole;
  }

  // Build updated character
  const updatedCharacter: Character = {
    ...character,
    bioware: updatedBioware,
    specialAttributes: {
      ...character.specialAttributes,
      essence: newEssence,
    },
    essenceHole: updatedEssenceHole,
  };

  return {
    success: true,
    character: updatedCharacter,
    removedItem,
    essenceRestored,
  };
}

// =============================================================================
// GRADE UPGRADE FUNCTIONS
// =============================================================================

/**
 * Upgrade the grade of an installed augmentation
 *
 * @param character - The character to modify
 * @param itemId - The ID of the augmentation to upgrade
 * @param newGrade - The new grade to upgrade to
 * @param isCyberwareType - Whether the item is cyberware (true) or bioware (false)
 * @returns Result with updated character and upgraded item, or error
 */
export function upgradeAugmentationGrade(
  character: Character,
  itemId: string,
  newGrade: CyberwareGrade | BiowareGrade,
  isCyberwareType: boolean = true
): UpgradeResult | OperationError {
  if (isCyberwareType) {
    return upgradeCyberwareGrade(character, itemId, newGrade as CyberwareGrade);
  } else {
    return upgradeBiowareGrade(character, itemId, newGrade as BiowareGrade);
  }
}

function upgradeCyberwareGrade(
  character: Character,
  itemId: string,
  newGrade: CyberwareGrade
): UpgradeResult | OperationError {
  const cyberware = character.cyberware ?? [];
  const itemIndex = cyberware.findIndex(
    item => item.id === itemId || item.catalogId === itemId
  );

  if (itemIndex === -1) {
    return {
      success: false,
      error: `Cyberware with ID "${itemId}" not found on character.`,
      code: "NOT_FOUND",
    };
  }

  const item = cyberware[itemIndex];
  const currentGrade = item.grade;

  // Validate grade upgrade
  if (!isValidGradeUpgrade(currentGrade, newGrade)) {
    return {
      success: false,
      error: `Cannot upgrade from ${currentGrade} to ${newGrade}. Grade must improve (reduce essence cost).`,
      code: "INVALID_GRADE_UPGRADE",
    };
  }

  // Calculate essence change
  const oldEssenceCost = item.essenceCost;
  const newEssenceCost = roundEssence(item.baseEssenceCost * getCyberwareGradeMultiplier(newGrade));
  const essenceRefund = roundEssence(oldEssenceCost - newEssenceCost);

  // Calculate cost difference (use base essence cost as proxy for base nuyen cost ratio)
  const baseCostEstimate = item.cost / (getCyberwareGradeMultiplier(currentGrade) === 1 ? 1 : 2); // Simplified
  const newCost = applyGradeToCost(baseCostEstimate, newGrade, true);
  const costDifference = newCost - item.cost;

  // Create upgraded item
  const upgradedItem: CyberwareItem = {
    ...item,
    grade: newGrade,
    essenceCost: newEssenceCost,
    cost: newCost,
    availability: applyGradeToAvailability(item.availability, newGrade, true),
  };

  // Update cyberware array
  const updatedCyberware = [...cyberware];
  updatedCyberware[itemIndex] = upgradedItem;

  // Calculate new essence
  const totalEssenceLoss = calculateTotalEssenceLoss(updatedCyberware, character.bioware ?? []);
  const newEssence = roundEssence(6 - totalEssenceLoss);

  // Update essence hole for grade upgrade
  let updatedEssenceHole = character.essenceHole;
  if (shouldTrackEssenceHole(character) && character.essenceHole) {
    const holeResult = updateEssenceHoleOnGradeUpgrade(
      character.essenceHole,
      oldEssenceCost,
      newEssenceCost
    );
    updatedEssenceHole = holeResult.essenceHole;
  }

  // Build updated character
  const updatedCharacter: Character = {
    ...character,
    cyberware: updatedCyberware,
    specialAttributes: {
      ...character.specialAttributes,
      essence: newEssence,
    },
    essenceHole: updatedEssenceHole,
  };

  return {
    success: true,
    character: updatedCharacter,
    upgradedItem,
    essenceRefund,
    costDifference,
  };
}

function upgradeBiowareGrade(
  character: Character,
  itemId: string,
  newGrade: BiowareGrade
): UpgradeResult | OperationError {
  const bioware = character.bioware ?? [];
  const itemIndex = bioware.findIndex(
    item => item.id === itemId || item.catalogId === itemId
  );

  if (itemIndex === -1) {
    return {
      success: false,
      error: `Bioware with ID "${itemId}" not found on character.`,
      code: "NOT_FOUND",
    };
  }

  const item = bioware[itemIndex];
  const currentGrade = item.grade;

  // Validate grade upgrade
  if (!isValidGradeUpgrade(currentGrade, newGrade)) {
    return {
      success: false,
      error: `Cannot upgrade from ${currentGrade} to ${newGrade}. Grade must improve (reduce essence cost).`,
      code: "INVALID_GRADE_UPGRADE",
    };
  }

  // Calculate essence change
  const oldEssenceCost = item.essenceCost;
  const newEssenceCost = roundEssence(item.baseEssenceCost * getBiowareGradeMultiplier(newGrade));
  const essenceRefund = roundEssence(oldEssenceCost - newEssenceCost);

  // Calculate cost difference (use base essence cost as proxy for base nuyen cost ratio)
  const baseCostEstimate = item.cost / (getBiowareGradeMultiplier(currentGrade) === 1 ? 1 : 2); // Simplified
  const newCost = applyGradeToCost(baseCostEstimate, newGrade, false);
  const costDifference = newCost - item.cost;

  // Create upgraded item
  const upgradedItem: BiowareItem = {
    ...item,
    grade: newGrade,
    essenceCost: newEssenceCost,
    cost: newCost,
  };

  // Update bioware array
  const updatedBioware = [...bioware];
  updatedBioware[itemIndex] = upgradedItem;

  // Calculate new essence
  const totalEssenceLoss = calculateTotalEssenceLoss(character.cyberware ?? [], updatedBioware);
  const newEssence = roundEssence(6 - totalEssenceLoss);

  // Update essence hole for grade upgrade
  let updatedEssenceHole = character.essenceHole;
  if (shouldTrackEssenceHole(character) && character.essenceHole) {
    const holeResult = updateEssenceHoleOnGradeUpgrade(
      character.essenceHole,
      oldEssenceCost,
      newEssenceCost
    );
    updatedEssenceHole = holeResult.essenceHole;
  }

  // Build updated character
  const updatedCharacter: Character = {
    ...character,
    bioware: updatedBioware,
    specialAttributes: {
      ...character.specialAttributes,
      essence: newEssence,
    },
    essenceHole: updatedEssenceHole,
  };

  return {
    success: true,
    character: updatedCharacter,
    upgradedItem,
    essenceRefund,
    costDifference,
  };
}

// =============================================================================
// WIRELESS BONUS FUNCTIONS
// =============================================================================

/**
 * Toggle the global wireless bonus setting
 *
 * @param character - The character to modify
 * @param enabled - Whether wireless bonuses should be enabled
 * @returns Updated character
 */
export function toggleGlobalWirelessBonus(
  character: Character,
  enabled: boolean
): Character {
  return {
    ...character,
    wirelessBonusesEnabled: enabled,
  };
}

/**
 * Get the current wireless bonus state
 *
 * @param character - The character to check
 * @returns Whether wireless bonuses are enabled (default: true)
 */
export function getWirelessBonusState(character: Partial<Character>): boolean {
  return character.wirelessBonusesEnabled ?? true;
}

/**
 * Aggregate all active wireless bonuses from augmentations
 * Only returns bonuses when wireless is globally enabled
 *
 * @param character - The character to check
 * @returns Aggregated wireless bonuses
 */
export function aggregateActiveWirelessBonuses(character: Partial<Character>): WirelessBonusAggregate {
  const enabled = getWirelessBonusState(character);

  if (!enabled) {
    return {
      enabled: false,
      bonuses: [],
      totalAttributeBonuses: {},
      totalInitiativeDiceBonus: 0,
      descriptions: [],
    };
  }

  const bonuses: WirelessBonus[] = [];
  const descriptions: string[] = [];

  // Collect from cyberware (wirelessBonus is a string description)
  for (const item of character.cyberware ?? []) {
    if (item.wirelessBonus) {
      bonuses.push({
        sourceId: item.id ?? item.catalogId,
        sourceName: item.name,
        description: item.wirelessBonus,
      });

      descriptions.push(`${item.name}: ${item.wirelessBonus}`);
    }
  }

  // Note: BiowareItem doesn't have wirelessBonus field in the type definition
  // If bioware wireless bonuses are needed, the type should be extended

  return {
    enabled: true,
    bonuses,
    totalAttributeBonuses: {}, // Would need extended type for numeric wireless bonuses
    totalInitiativeDiceBonus: 0, // Would need extended type for numeric wireless bonuses
    descriptions,
  };
}

// =============================================================================
// DERIVED STATS INTEGRATION
// =============================================================================

/**
 * Aggregate all bonuses from installed augmentations
 *
 * @param character - The character to analyze
 * @returns Aggregated bonuses from all augmentations
 */
export function aggregateAugmentationBonuses(character: Partial<Character>): AugmentationBonuses {
  const bonuses: AugmentationBonuses = {
    attributes: {},
    initiativeDice: 0,
    limits: {},
    armorBonus: 0,
    specialBonuses: {},
  };

  // Aggregate from cyberware
  for (const item of character.cyberware ?? []) {
    // Attribute bonuses
    if (item.attributeBonuses) {
      for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
        bonuses.attributes[attr] = (bonuses.attributes[attr] ?? 0) + bonus;
      }
    }

    // Initiative dice
    if (item.initiativeDiceBonus) {
      bonuses.initiativeDice += item.initiativeDiceBonus;
    }

    // Note: Armor bonuses from cyberware (bone lacing, orthoskin, etc.)
    // would come from the catalog item's effects, not stored on CyberwareItem directly
  }

  // Aggregate from bioware
  for (const item of character.bioware ?? []) {
    // Attribute bonuses
    if (item.attributeBonuses) {
      for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
        bonuses.attributes[attr] = (bonuses.attributes[attr] ?? 0) + bonus;
      }
    }

    // Note: Some bioware provides initiative dice (synaptic booster),
    // but BiowareItem doesn't have initiativeDiceBonus - would need catalog lookup
  }

  // Add wireless bonuses if enabled
  const wirelessBonuses = aggregateActiveWirelessBonuses(character);
  if (wirelessBonuses.enabled) {
    for (const [attr, bonus] of Object.entries(wirelessBonuses.totalAttributeBonuses)) {
      bonuses.attributes[attr] = (bonuses.attributes[attr] ?? 0) + bonus;
    }
    bonuses.initiativeDice += wirelessBonuses.totalInitiativeDiceBonus;
  }

  return bonuses;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate a unique ID for an augmentation
 */
function generateAugmentationId(): string {
  return `aug_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a CyberwareItem from a catalog item
 */
function createCyberwareItem(
  catalogItem: CyberwareCatalogItem,
  grade: CyberwareGrade,
  rating?: number
): CyberwareItem {
  const gradeMultiplier = getCyberwareGradeMultiplier(grade);
  const essenceCost = calculateCyberwareEssence(catalogItem, grade, rating);
  const cost = applyGradeToCost(catalogItem.cost * (rating ?? 1), grade, true);
  const availability = applyGradeToAvailability(catalogItem.availability, grade, true);

  return {
    catalogId: catalogItem.id,
    name: catalogItem.name,
    category: catalogItem.category,
    grade,
    rating,
    baseEssenceCost: catalogItem.essenceCost,
    essenceCost,
    cost,
    availability,
    restricted: catalogItem.restricted,
    forbidden: catalogItem.forbidden,
    attributeBonuses: catalogItem.attributeBonuses,
    initiativeDiceBonus: catalogItem.initiativeDiceBonus,
    wirelessBonus: catalogItem.wirelessBonus,
    notes: catalogItem.description,
  };
}

/**
 * Create a BiowareItem from a catalog item
 */
function createBiowareItem(
  catalogItem: BiowareCatalogItem,
  grade: BiowareGrade,
  rating?: number
): BiowareItem {
  const essenceCost = calculateBiowareEssence(catalogItem, grade, rating);
  const cost = applyGradeToCost(catalogItem.cost * (rating ?? 1), grade, false);

  return {
    catalogId: catalogItem.id,
    name: catalogItem.name,
    category: catalogItem.category,
    grade,
    rating,
    baseEssenceCost: catalogItem.essenceCost,
    essenceCost,
    cost,
    availability: catalogItem.availability,
    restricted: catalogItem.restricted,
    forbidden: catalogItem.forbidden,
    attributeBonuses: catalogItem.attributeBonuses,
    notes: catalogItem.description,
  };
}
