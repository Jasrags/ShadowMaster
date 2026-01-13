/**
 * Cyberlimb Capacity, Customization, and Location Management
 *
 * Manages cyberlimb mechanics including:
 * - Internal capacity constraints for enhancements and accessories
 * - STR/AGI customization (set at purchase, immutable)
 * - Location tracking with hierarchical replacement rules
 * - Physical Condition Monitor bonuses
 * - Effective attribute calculations (single limb, averaging, weakest)
 *
 * @satisfies Requirement: Cybernetic limbs MUST manage internal capacity constraints
 * @satisfies Decision: Full STR/AGI per-limb customization in Phase 1
 * @satisfies ADR-010: Wireless state, device condition
 * @see docs/rules/5e/game-mechanics/cyberlimbs.md
 * @see docs/capabilities/character.augmentation-systems.md
 */

import type { Character, CyberwareGrade } from "@/lib/types/character";
import type { CyberwareCatalogItem, CyberlimbCatalogItem } from "@/lib/types/edition";
import type {
  CyberlimbItem,
  CyberlimbLocation,
  CyberlimbType,
  CyberlimbAppearance,
  CyberlimbEnhancement,
  CyberlimbAccessory,
  CyberlimbModificationEntry,
} from "@/lib/types/cyberlimb";
import {
  LIMB_HIERARCHY,
  LIMB_CM_BONUS,
  LOCATION_SIDE,
  LOCATION_LIMB_TYPE,
  LIMB_TYPE_LOCATIONS,
  getCyberlimbStrength as getStrengthFromType,
  getCyberlimbAgility as getAgilityFromType,
  getCyberlimbAvailableCapacity,
  calculateCyberlimbCapacityUsed,
  wouldReplaceExisting,
  isBlockedByExisting,
  getAffectedLocations,
} from "@/lib/types/cyberlimb";
import { roundEssence } from "./essence";
import { getCyberwareGradeMultiplier, applyGradeToCost, applyGradeToAvailability } from "./grades";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Cost per point of attribute customization (above base 3) */
const CUSTOMIZATION_COST_PER_POINT = 5000;

/** Availability increase per point of customization */
const CUSTOMIZATION_AVAILABILITY_PER_POINT = 1;

/** Default attributes for all cyberlimbs before customization */
const DEFAULT_CYBERLIMB_ATTRIBUTES = {
  strength: 3,
  agility: 3,
} as const;

/** Maximum enhancement rating for STR/AGI/Armor enhancements */
const MAX_ENHANCEMENT_RATING = 3;

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * Validation result for cyberlimb operations
 */
export interface CyberlimbValidationResult {
  valid: boolean;
  error?: string;
  details?: Record<string, unknown>;
}

/**
 * Breakdown of how capacity is used in a cyberlimb
 */
export interface CyberlimbCapacityBreakdown {
  /** Total capacity available */
  totalCapacity: number;
  /** Capacity used by enhancements */
  usedByEnhancements: number;
  /** Capacity used by accessories */
  usedByAccessories: number;
  /** Capacity used by weapons */
  usedByWeapons: number;
  /** Remaining available capacity */
  remainingCapacity: number;
}

/**
 * Customization options when creating a cyberlimb
 */
export interface CyberlimbCustomizationOptions {
  /** STR customization above base 3 (0 to racial max - 3) */
  strengthCustomization?: number;
  /** AGI customization above base 3 (0 to racial max - 3) */
  agilityCustomization?: number;
}

/**
 * Result of a location conflict check
 */
export interface LocationConflictResult {
  hasConflict: boolean;
  /** Existing limbs that would be replaced (with user confirmation) */
  limbsToReplace: CyberlimbItem[];
  /** Existing limb that blocks installation (higher-level limb exists) */
  blockingLimb?: CyberlimbItem;
  error?: string;
}

/**
 * Result of installing a cyberlimb
 */
export interface CyberlimbInstallResult {
  success: boolean;
  limb?: CyberlimbItem;
  removedLimbs?: CyberlimbItem[];
  error?: string;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Check if a catalog item is a cyberlimb
 */
export function isCyberlimbCatalogItem(item: CyberwareCatalogItem): item is CyberlimbCatalogItem {
  return item.category === "cyberlimb" && "limbType" in item;
}

/**
 * Check if a cyberware item is a cyberlimb (legacy compatibility)
 * @deprecated Use isCyberlimb from @/lib/types/cyberlimb instead
 */
export function isCyberlimb(item: { category: string }): boolean {
  return item.category === "cyberlimb";
}

// =============================================================================
// LOCATION & HIERARCHY VALIDATION
// =============================================================================

/**
 * Check for location conflicts when installing a new cyberlimb
 *
 * @param character - The character
 * @param location - Target installation location
 * @param limbType - Type of limb being installed
 * @returns Conflict information
 */
export function checkLocationConflicts(
  character: Partial<Character>,
  location: CyberlimbLocation,
  limbType: CyberlimbType
): LocationConflictResult {
  const existingLimbs = character.cyberlimbs ?? [];
  const limbsToReplace: CyberlimbItem[] = [];
  let blockingLimb: CyberlimbItem | undefined;

  // Get the side of the target location
  const targetSide = LOCATION_SIDE[location];

  for (const existing of existingLimbs) {
    const existingSide = LOCATION_SIDE[existing.location];

    // Only check limbs on the same side (or center for torso/skull)
    if (existingSide !== targetSide && existingSide !== "center" && targetSide !== "center") {
      continue;
    }

    // Check if the new limb would replace the existing one
    if (wouldReplaceExisting(limbType, existing.limbType)) {
      limbsToReplace.push(existing);
    }

    // Check if the existing limb blocks the new one
    if (isBlockedByExisting(limbType, existing.limbType)) {
      // Only block if on the same side
      if (existingSide === targetSide || location === existing.location) {
        blockingLimb = existing;
      }
    }

    // Check for exact location match (can't have two limbs in same location)
    if (existing.location === location) {
      // If same type, this is a replacement scenario handled above
      // If different type at same location, block
      if (existing.limbType !== limbType && !wouldReplaceExisting(limbType, existing.limbType)) {
        blockingLimb = existing;
      }
    }
  }

  if (blockingLimb) {
    return {
      hasConflict: true,
      limbsToReplace: [],
      blockingLimb,
      error: `Cannot install ${limbType} at ${location}: ${blockingLimb.name} already exists at ${blockingLimb.location}. Remove the existing ${blockingLimb.limbType} first.`,
    };
  }

  return {
    hasConflict: limbsToReplace.length > 0,
    limbsToReplace,
  };
}

/**
 * Validate that a location is valid for a limb type
 *
 * @param location - Target location
 * @param limbType - Type of limb
 * @returns Validation result
 */
export function validateLocationForLimbType(
  location: CyberlimbLocation,
  limbType: CyberlimbType
): CyberlimbValidationResult {
  const validLocations = LIMB_TYPE_LOCATIONS[limbType];

  if (!validLocations.includes(location)) {
    return {
      valid: false,
      error: `${limbType} cannot be installed at ${location}. Valid locations: ${validLocations.join(", ")}`,
      details: { limbType, location, validLocations },
    };
  }

  return { valid: true };
}

// =============================================================================
// CUSTOMIZATION VALIDATION
// =============================================================================

/**
 * Get the maximum customization allowed for a character based on metatype
 *
 * @param character - The character
 * @param attribute - "strength" or "agility"
 * @returns Maximum customization points (racial max - 3)
 */
export function getMaxCustomization(
  character: Partial<Character>,
  attribute: "strength" | "agility"
): number {
  // TODO: Get actual racial maximums from metatype data
  // For now, use defaults (6 for humans = max custom of 3)
  const racialMaximums: Record<string, Record<string, number>> = {
    human: { strength: 6, agility: 6 },
    elf: { strength: 6, agility: 7 },
    dwarf: { strength: 8, agility: 6 },
    ork: { strength: 8, agility: 6 },
    troll: { strength: 10, agility: 5 },
  };

  const metatype = character.metatype?.toLowerCase() ?? "human";
  const maxAttr = racialMaximums[metatype]?.[attribute] ?? 6;

  return maxAttr - DEFAULT_CYBERLIMB_ATTRIBUTES[attribute];
}

/**
 * Validate customization values for a cyberlimb
 *
 * @param character - The character
 * @param customization - Customization options
 * @returns Validation result
 */
export function validateCustomization(
  character: Partial<Character>,
  customization: CyberlimbCustomizationOptions
): CyberlimbValidationResult {
  const strCustom = customization.strengthCustomization ?? 0;
  const agiCustom = customization.agilityCustomization ?? 0;

  if (strCustom < 0 || agiCustom < 0) {
    return {
      valid: false,
      error: "Customization cannot be negative.",
    };
  }

  const maxStr = getMaxCustomization(character, "strength");
  const maxAgi = getMaxCustomization(character, "agility");

  if (strCustom > maxStr) {
    return {
      valid: false,
      error: `STR customization ${strCustom} exceeds maximum of ${maxStr} for ${character.metatype ?? "human"}.`,
      details: { strengthCustomization: strCustom, maxAllowed: maxStr },
    };
  }

  if (agiCustom > maxAgi) {
    return {
      valid: false,
      error: `AGI customization ${agiCustom} exceeds maximum of ${maxAgi} for ${character.metatype ?? "human"}.`,
      details: { agilityCustomization: agiCustom, maxAllowed: maxAgi },
    };
  }

  return { valid: true };
}

// =============================================================================
// CAPACITY MANAGEMENT
// =============================================================================

/**
 * Get detailed capacity breakdown for a cyberlimb
 *
 * @param limb - The cyberlimb to analyze
 * @returns Detailed capacity breakdown
 */
export function getCapacityBreakdown(limb: CyberlimbItem): CyberlimbCapacityBreakdown {
  const usedByEnhancements = limb.enhancements.reduce((sum, e) => sum + e.capacityUsed, 0);
  const usedByAccessories = limb.accessories.reduce((sum, a) => sum + a.capacityUsed, 0);
  const usedByWeapons = limb.weapons.reduce((sum, w) => sum + w.capacityUsed, 0);
  const totalUsed = usedByEnhancements + usedByAccessories + usedByWeapons;

  return {
    totalCapacity: limb.baseCapacity,
    usedByEnhancements,
    usedByAccessories,
    usedByWeapons,
    remainingCapacity: Math.max(0, limb.baseCapacity - totalUsed),
  };
}

/**
 * Validate that an item fits in the remaining capacity
 *
 * @param limb - The cyberlimb
 * @param capacityCost - Capacity required
 * @returns Validation result
 */
export function validateCapacityAvailable(
  limb: CyberlimbItem,
  capacityCost: number
): CyberlimbValidationResult {
  const breakdown = getCapacityBreakdown(limb);

  if (capacityCost > breakdown.remainingCapacity) {
    return {
      valid: false,
      error: `Requires ${capacityCost} capacity but only ${breakdown.remainingCapacity} available.`,
      details: { required: capacityCost, available: breakdown.remainingCapacity, breakdown },
    };
  }

  return { valid: true };
}

// =============================================================================
// ENHANCEMENT MANAGEMENT
// =============================================================================

/**
 * Validate that an enhancement can be installed
 *
 * @param limb - The cyberlimb
 * @param enhancement - The enhancement catalog item
 * @param rating - Rating for the enhancement
 * @returns Validation result
 */
export function validateEnhancementInstall(
  limb: CyberlimbItem,
  enhancement: CyberwareCatalogItem,
  rating: number
): CyberlimbValidationResult {
  // Check category
  if (enhancement.category !== "cyberlimb-enhancement") {
    return {
      valid: false,
      error: `${enhancement.name} is not a cyberlimb enhancement.`,
    };
  }

  // Check rating
  const maxRating = enhancement.maxRating ?? MAX_ENHANCEMENT_RATING;
  if (rating < 1 || rating > maxRating) {
    return {
      valid: false,
      error: `Rating ${rating} is invalid. Valid range: 1-${maxRating}.`,
    };
  }

  // Check for duplicate enhancement type
  const enhancementType = (enhancement as { enhancementType?: string }).enhancementType;
  if (enhancementType) {
    const existing = limb.enhancements.find((e) => e.enhancementType === enhancementType);
    if (existing) {
      return {
        valid: false,
        error: `This limb already has a ${enhancementType} enhancement (${existing.name}). Only one per type allowed.`,
        details: { existingEnhancement: existing.name, type: enhancementType },
      };
    }
  }

  // Check capacity
  const capacityCost = (enhancement.capacityCost ?? 1) * rating;
  return validateCapacityAvailable(limb, capacityCost);
}

/**
 * Add an enhancement to a cyberlimb
 *
 * @param limb - The cyberlimb
 * @param enhancement - The enhancement catalog item
 * @param rating - Rating for the enhancement
 * @param grade - Grade (for cost calculation)
 * @returns Updated cyberlimb
 */
export function addEnhancement(
  limb: CyberlimbItem,
  enhancement: CyberwareCatalogItem,
  rating: number,
  grade: CyberwareGrade = "standard"
): CyberlimbItem {
  const capacityCost = (enhancement.capacityCost ?? 1) * rating;
  const cost = applyGradeToCost(enhancement.cost * rating, grade, true);
  const availability = applyGradeToAvailability(
    (enhancement.availability ?? 0) * rating,
    grade,
    true
  );

  const newEnhancement: CyberlimbEnhancement = {
    id: `${enhancement.id}-${Date.now()}`,
    catalogId: enhancement.id,
    name: enhancement.name,
    enhancementType: (enhancement as { enhancementType?: string }).enhancementType as
      | "agility"
      | "strength"
      | "armor",
    rating,
    capacityUsed: capacityCost,
    cost,
    availability,
    legality: enhancement.legality,
    wirelessEnabled: limb.wirelessEnabled,
    wirelessEffects: enhancement.wirelessEffects,
  };

  const modEntry: CyberlimbModificationEntry = {
    id: `mod-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "enhancement_added",
    targetId: newEnhancement.id,
    targetName: enhancement.name,
    newValue: { rating, cost },
  };

  return {
    ...limb,
    enhancements: [...limb.enhancements, newEnhancement],
    capacityUsed: limb.capacityUsed + capacityCost,
    modificationHistory: [...limb.modificationHistory, modEntry],
  };
}

/**
 * Remove an enhancement from a cyberlimb
 *
 * @param limb - The cyberlimb
 * @param enhancementId - ID of enhancement to remove
 * @returns Updated cyberlimb
 */
export function removeEnhancement(limb: CyberlimbItem, enhancementId: string): CyberlimbItem {
  const enhancement = limb.enhancements.find((e) => e.id === enhancementId);
  if (!enhancement) {
    return limb;
  }

  const modEntry: CyberlimbModificationEntry = {
    id: `mod-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "enhancement_removed",
    targetId: enhancementId,
    targetName: enhancement.name,
    previousValue: { rating: enhancement.rating },
  };

  return {
    ...limb,
    enhancements: limb.enhancements.filter((e) => e.id !== enhancementId),
    capacityUsed: Math.max(0, limb.capacityUsed - enhancement.capacityUsed),
    modificationHistory: [...limb.modificationHistory, modEntry],
  };
}

// =============================================================================
// ACCESSORY MANAGEMENT
// =============================================================================

/**
 * Validate that an accessory can be installed
 *
 * @param limb - The cyberlimb
 * @param accessory - The accessory catalog item
 * @param character - The character (for pair validation)
 * @returns Validation result
 */
export function validateAccessoryInstall(
  limb: CyberlimbItem,
  accessory: CyberwareCatalogItem,
  character?: Partial<Character>
): CyberlimbValidationResult {
  // Check category
  if (accessory.category !== "cyberlimb-accessory") {
    return {
      valid: false,
      error: `${accessory.name} is not a cyberlimb accessory.`,
    };
  }

  // Check compatible limbs
  const compatibleLimbs = (accessory as { compatibleLimbs?: string[] }).compatibleLimbs;
  if (compatibleLimbs && !compatibleLimbs.includes(limb.limbType)) {
    return {
      valid: false,
      error: `${accessory.name} is not compatible with ${limb.limbType}. Compatible: ${compatibleLimbs.join(", ")}`,
    };
  }

  // Check pair requirement (e.g., hydraulic jacks need both legs)
  const requiresPair = (accessory as { requiresPair?: boolean }).requiresPair;
  const pairLocation = (accessory as { pairLocation?: string }).pairLocation;
  if (requiresPair && pairLocation && character) {
    // This is validated at a higher level when installing
    // Here we just check if this limb is valid for the pair
    if (pairLocation === "legs" && !limb.limbType.includes("leg")) {
      return {
        valid: false,
        error: `${accessory.name} requires cybernetic legs.`,
      };
    }
  }

  // Check capacity
  const rating = (accessory as { hasRating?: boolean }).hasRating ? 1 : undefined;
  const capacityCost = rating
    ? (accessory.capacityCost ?? 1) * rating
    : (accessory.capacityCost ?? 1);
  return validateCapacityAvailable(limb, capacityCost);
}

/**
 * Add an accessory to a cyberlimb
 *
 * @param limb - The cyberlimb
 * @param accessory - The accessory catalog item
 * @param rating - Optional rating
 * @returns Updated cyberlimb
 */
export function addAccessory(
  limb: CyberlimbItem,
  accessory: CyberwareCatalogItem,
  rating?: number
): CyberlimbItem {
  const effectiveRating = rating ?? 1;
  const hasRating = (accessory as { hasRating?: boolean }).hasRating;
  const capacityCost = hasRating
    ? (accessory.capacityCost ?? 1) * effectiveRating
    : (accessory.capacityCost ?? 1);
  const cost = hasRating ? accessory.cost * effectiveRating : accessory.cost;

  const newAccessory: CyberlimbAccessory = {
    id: `${accessory.id}-${Date.now()}`,
    catalogId: accessory.id,
    name: accessory.name,
    rating: hasRating ? effectiveRating : undefined,
    capacityUsed: capacityCost,
    cost,
    availability: accessory.availability,
    legality: accessory.legality,
    wirelessEnabled: limb.wirelessEnabled,
    wirelessEffects: accessory.wirelessEffects,
    wirelessBonus: accessory.wirelessBonus,
  };

  const modEntry: CyberlimbModificationEntry = {
    id: `mod-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "accessory_added",
    targetId: newAccessory.id,
    targetName: accessory.name,
    newValue: { rating: hasRating ? effectiveRating : undefined, cost },
  };

  return {
    ...limb,
    accessories: [...limb.accessories, newAccessory],
    capacityUsed: limb.capacityUsed + capacityCost,
    modificationHistory: [...limb.modificationHistory, modEntry],
  };
}

/**
 * Remove an accessory from a cyberlimb
 *
 * @param limb - The cyberlimb
 * @param accessoryId - ID of accessory to remove
 * @returns Updated cyberlimb
 */
export function removeAccessory(limb: CyberlimbItem, accessoryId: string): CyberlimbItem {
  const accessory = limb.accessories.find((a) => a.id === accessoryId);
  if (!accessory) {
    return limb;
  }

  const modEntry: CyberlimbModificationEntry = {
    id: `mod-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "accessory_removed",
    targetId: accessoryId,
    targetName: accessory.name,
    previousValue: { rating: accessory.rating },
  };

  return {
    ...limb,
    accessories: limb.accessories.filter((a) => a.id !== accessoryId),
    capacityUsed: Math.max(0, limb.capacityUsed - accessory.capacityUsed),
    modificationHistory: [...limb.modificationHistory, modEntry],
  };
}

// =============================================================================
// PHYSICAL CONDITION MONITOR BONUS
// =============================================================================

/**
 * Calculate total Physical CM bonus from all installed cyberlimbs
 *
 * @param character - The character
 * @returns Total CM bonus (floored)
 */
export function calculateTotalCMBonus(character: Partial<Character>): number {
  const cyberlimbs = character.cyberlimbs ?? [];

  const totalBonus = cyberlimbs.reduce((sum, limb) => {
    return sum + LIMB_CM_BONUS[limb.limbType];
  }, 0);

  return Math.floor(totalBonus);
}

/**
 * Get CM bonus for a specific limb type
 *
 * @param limbType - The limb type
 * @returns CM bonus (1, 0.5, or 0)
 */
export function getLimbCMBonus(limbType: CyberlimbType): number {
  return LIMB_CM_BONUS[limbType];
}

// =============================================================================
// EFFECTIVE ATTRIBUTE CALCULATIONS
// =============================================================================

/**
 * Get the effective STR of a cyberlimb (base + custom + enhancement)
 *
 * @param limb - The cyberlimb
 * @returns Effective STR
 */
export function getCyberlimbStrength(limb: CyberlimbItem): number {
  return getStrengthFromType(limb);
}

/**
 * Get the effective AGI of a cyberlimb (base + custom + enhancement)
 *
 * @param limb - The cyberlimb
 * @returns Effective AGI
 */
export function getCyberlimbAgility(limb: CyberlimbItem): number {
  return getAgilityFromType(limb);
}

/**
 * Calculate effective attribute for an action involving cyberlimbs
 *
 * SR5 Rules:
 * - Single limb action: Use limb's attribute
 * - Multiple limbs (e.g., melee attack): Average all involved limbs + meat
 * - Coordinated action: Use the weakest limb
 *
 * @param character - The character
 * @param attribute - "strength" or "agility"
 * @param involvedLimbs - Locations of limbs involved in the action
 * @param mode - Calculation mode
 * @returns Effective attribute value
 */
export function calculateEffectiveAttribute(
  character: Partial<Character>,
  attribute: "strength" | "agility",
  involvedLimbs: CyberlimbLocation[],
  mode: "single" | "average" | "weakest" = "average"
): number {
  // Get natural attribute
  const naturalAttr =
    character.attributes?.[attribute === "strength" ? "str" : "agi"] ??
    character.attributes?.[attribute === "strength" ? "bod" : "agi"] ??
    3;

  const cyberlimbs = character.cyberlimbs ?? [];
  if (cyberlimbs.length === 0) {
    return naturalAttr;
  }

  // Find cyberlimbs at the involved locations
  const involvedCyberlimbs = cyberlimbs.filter((limb) => involvedLimbs.includes(limb.location));

  if (involvedCyberlimbs.length === 0) {
    return naturalAttr;
  }

  // Get attribute values from involved cyberlimbs
  const limbValues = involvedCyberlimbs.map((limb) =>
    attribute === "strength" ? getCyberlimbStrength(limb) : getCyberlimbAgility(limb)
  );

  switch (mode) {
    case "single":
      // Use the first (or only) limb's value
      return limbValues[0];

    case "weakest":
      // Use the lowest value among involved limbs
      return Math.min(...limbValues);

    case "average":
    default: {
      // Average all limbs (cyber + meat for uninvolved slots)
      // For simplicity, average the cyber limbs
      // Full implementation would weight by limb coverage
      const sum = limbValues.reduce((a, b) => a + b, 0);
      return Math.floor(sum / limbValues.length);
    }
  }
}

/**
 * Calculate average attribute across all limbs (SR5 averaging rule)
 *
 * @param character - The character
 * @param attribute - "strength" or "agility"
 * @returns Averaged attribute value
 */
export function calculateAverageAttribute(
  character: Partial<Character>,
  attribute: "strength" | "agility"
): number {
  const naturalAttr =
    character.attributes?.[attribute === "strength" ? "str" : "agi"] ??
    character.attributes?.[attribute === "strength" ? "bod" : "agi"] ??
    3;

  const cyberlimbs = character.cyberlimbs ?? [];
  if (cyberlimbs.length === 0) {
    return naturalAttr;
  }

  // Count total limbs (4 for full set: 2 arms + 2 legs)
  const totalLimbSlots = 4;
  let cyberLimbCount = 0;
  let cyberLimbTotal = 0;

  for (const limb of cyberlimbs) {
    const limbValue =
      attribute === "strength" ? getCyberlimbStrength(limb) : getCyberlimbAgility(limb);

    // Weight by limb type
    if (limb.limbType === "full-arm" || limb.limbType === "full-leg") {
      cyberLimbCount += 1;
      cyberLimbTotal += limbValue;
    } else if (limb.limbType === "lower-arm" || limb.limbType === "lower-leg") {
      cyberLimbCount += 0.75;
      cyberLimbTotal += limbValue * 0.75;
    } else if (limb.limbType === "hand" || limb.limbType === "foot") {
      cyberLimbCount += 0.5;
      cyberLimbTotal += limbValue * 0.5;
    }
    // Torso and skull don't contribute to limb averaging
  }

  // Calculate weighted average
  const naturalLimbCount = Math.max(0, totalLimbSlots - cyberLimbCount);
  const naturalTotal = naturalAttr * naturalLimbCount;
  const average = (naturalTotal + cyberLimbTotal) / totalLimbSlots;

  return Math.floor(average);
}

// =============================================================================
// CYBERLIMB CREATION
// =============================================================================

/**
 * Create a new cyberlimb from a catalog item
 *
 * @param catalogItem - The cyberlimb catalog item
 * @param location - Installation location
 * @param grade - Grade to install at
 * @param customization - Optional customization
 * @returns New cyberlimb item
 */
export function createCyberlimb(
  catalogItem: CyberlimbCatalogItem,
  location: CyberlimbLocation,
  grade: CyberwareGrade,
  customization?: CyberlimbCustomizationOptions
): CyberlimbItem {
  const strCustom = customization?.strengthCustomization ?? 0;
  const agiCustom = customization?.agilityCustomization ?? 0;
  const customizationCost = (strCustom + agiCustom) * CUSTOMIZATION_COST_PER_POINT;

  const gradeMultiplier = getCyberwareGradeMultiplier(grade);
  const essenceCost = roundEssence(catalogItem.essenceCost * gradeMultiplier);
  const baseCost = applyGradeToCost(catalogItem.cost, grade, true);
  const totalCost = baseCost + customizationCost;

  const baseAvailability = catalogItem.availability;
  const customizationAvailability = (strCustom + agiCustom) * CUSTOMIZATION_AVAILABILITY_PER_POINT;
  const gradeAvailability = applyGradeToAvailability(baseAvailability, grade, true);
  const totalAvailability = gradeAvailability + customizationAvailability;

  const now = new Date().toISOString();

  const limb: CyberlimbItem = {
    // Base cyberware fields
    catalogId: catalogItem.id,
    name: catalogItem.name,
    category: "cyberlimb",
    grade,
    baseEssenceCost: catalogItem.essenceCost,
    essenceCost,
    cost: totalCost,
    availability: totalAvailability,
    legality: catalogItem.legality,
    wirelessBonus: catalogItem.wirelessBonus,
    wirelessEffects: catalogItem.wirelessEffects,
    notes: catalogItem.description,

    // Cyberlimb-specific fields
    location,
    limbType: catalogItem.limbType,
    appearance: catalogItem.appearance,
    baseStrength: 3,
    baseAgility: 3,
    customStrength: strCustom,
    customAgility: agiCustom,
    baseCapacity: catalogItem.capacity ?? 15,
    capacityUsed: 0,
    enhancements: [],
    accessories: [],
    weapons: [],
    wirelessEnabled: true,
    condition: "working",
    installedAt: now,
    modificationHistory: [
      {
        id: `mod-${Date.now()}`,
        timestamp: now,
        action: "installed",
        notes: `Installed ${catalogItem.name} at ${location} with ${grade} grade. Customization: STR +${strCustom}, AGI +${agiCustom}`,
      },
    ],
  };

  return limb;
}

/**
 * Calculate installation costs for a cyberlimb
 *
 * @param catalogItem - The catalog item
 * @param grade - Grade to install at
 * @param customization - Customization options
 * @returns Cost breakdown
 */
export function calculateCyberlimbCosts(
  catalogItem: CyberlimbCatalogItem,
  grade: CyberwareGrade,
  customization?: CyberlimbCustomizationOptions
): {
  essenceCost: number;
  nuyenCost: number;
  availability: number;
  breakdown: {
    baseEssence: number;
    gradedEssence: number;
    baseCost: number;
    gradedCost: number;
    customizationCost: number;
    baseAvailability: number;
    gradedAvailability: number;
    customizationAvailability: number;
  };
} {
  const strCustom = customization?.strengthCustomization ?? 0;
  const agiCustom = customization?.agilityCustomization ?? 0;
  const customizationCost = (strCustom + agiCustom) * CUSTOMIZATION_COST_PER_POINT;
  const customizationAvailability = (strCustom + agiCustom) * CUSTOMIZATION_AVAILABILITY_PER_POINT;

  const gradeMultiplier = getCyberwareGradeMultiplier(grade);
  const gradedEssence = roundEssence(catalogItem.essenceCost * gradeMultiplier);
  const gradedCost = applyGradeToCost(catalogItem.cost, grade, true);
  const gradedAvailability = applyGradeToAvailability(catalogItem.availability, grade, true);

  return {
    essenceCost: gradedEssence,
    nuyenCost: gradedCost + customizationCost,
    availability: gradedAvailability + customizationAvailability,
    breakdown: {
      baseEssence: catalogItem.essenceCost,
      gradedEssence,
      baseCost: catalogItem.cost,
      gradedCost,
      customizationCost,
      baseAvailability: catalogItem.availability,
      gradedAvailability,
      customizationAvailability,
    },
  };
}

// =============================================================================
// FULL INSTALLATION VALIDATION
// =============================================================================

/**
 * Validate complete cyberlimb installation
 *
 * @param character - The character
 * @param catalogItem - The catalog item
 * @param location - Installation location
 * @param grade - Grade to install at
 * @param customization - Customization options
 * @param context - Validation context
 * @returns Validation result
 */
export function validateCyberlimbInstallation(
  character: Partial<Character>,
  catalogItem: CyberlimbCatalogItem,
  location: CyberlimbLocation,
  grade: CyberwareGrade,
  customization?: CyberlimbCustomizationOptions,
  context?: { lifecycleStage?: "creation" | "active"; maxAvailability?: number }
): CyberlimbValidationResult {
  // 1. Validate location is valid for limb type
  const locationResult = validateLocationForLimbType(location, catalogItem.limbType);
  if (!locationResult.valid) {
    return locationResult;
  }

  // 2. Check for location conflicts
  const conflicts = checkLocationConflicts(character, location, catalogItem.limbType);
  if (conflicts.blockingLimb) {
    return {
      valid: false,
      error: conflicts.error,
      details: { blockingLimb: conflicts.blockingLimb.name },
    };
  }

  // 3. Validate customization
  if (customization) {
    const customResult = validateCustomization(character, customization);
    if (!customResult.valid) {
      return customResult;
    }
  }

  // 4. Calculate costs and check availability at creation
  const costs = calculateCyberlimbCosts(catalogItem, grade, customization);
  const maxAvail = context?.maxAvailability ?? 12;

  if (context?.lifecycleStage === "creation" && costs.availability > maxAvail) {
    return {
      valid: false,
      error: `Availability ${costs.availability} exceeds maximum of ${maxAvail} at character creation.`,
      details: { availability: costs.availability, maxAllowed: maxAvail },
    };
  }

  // 5. Check essence (would need current essence from character)
  // This is typically done at a higher level with the full validation engine

  return {
    valid: true,
    details: {
      limbsToReplace: conflicts.limbsToReplace.map((l) => l.name),
      costs,
    },
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get a summary of a cyberlimb for display
 *
 * @param limb - The cyberlimb
 * @returns Human-readable summary
 */
export function getCyberlimbSummary(limb: CyberlimbItem): string {
  const str = getCyberlimbStrength(limb);
  const agi = getCyberlimbAgility(limb);
  const breakdown = getCapacityBreakdown(limb);
  const enhCount = limb.enhancements.length;
  const accCount = limb.accessories.length;

  return `${limb.name} (${limb.grade}) @ ${limb.location} - STR ${str}/AGI ${agi} - Capacity: ${breakdown.remainingCapacity}/${breakdown.totalCapacity} - ${enhCount} enhancements, ${accCount} accessories`;
}

/**
 * Toggle wireless enabled state for a cyberlimb and all its contents
 *
 * @param limb - The cyberlimb
 * @param enabled - New wireless state
 * @returns Updated cyberlimb
 */
export function toggleCyberlimbWireless(limb: CyberlimbItem, enabled: boolean): CyberlimbItem {
  const modEntry: CyberlimbModificationEntry = {
    id: `mod-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: "wireless_toggled",
    previousValue: limb.wirelessEnabled,
    newValue: enabled,
  };

  return {
    ...limb,
    wirelessEnabled: enabled,
    enhancements: limb.enhancements.map((e) => ({
      ...e,
      wirelessEnabled: enabled,
    })),
    accessories: limb.accessories.map((a) => ({
      ...a,
      wirelessEnabled: enabled,
    })),
    modificationHistory: [...limb.modificationHistory, modEntry],
  };
}

// Re-export types for convenience
export type {
  CyberlimbItem,
  CyberlimbLocation,
  CyberlimbType,
  CyberlimbAppearance,
  CyberlimbEnhancement,
  CyberlimbAccessory,
  CyberlimbModificationEntry,
};

// Re-export constants
export {
  LIMB_HIERARCHY,
  LIMB_CM_BONUS,
  LOCATION_SIDE,
  LOCATION_LIMB_TYPE,
  LIMB_TYPE_LOCATIONS,
  getCyberlimbAvailableCapacity,
  calculateCyberlimbCapacityUsed,
  wouldReplaceExisting,
  isBlockedByExisting,
  getAffectedLocations,
};
