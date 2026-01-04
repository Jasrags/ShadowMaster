/**
 * Cyberlimb Capacity and Customization
 *
 * Manages cyberlimb internal capacity constraints and attribute customization.
 * Cyberlimbs can have STR/AGI customized and can contain enhancements
 * that use capacity slots.
 *
 * @satisfies Requirement: Cybernetic limbs MUST manage internal capacity constraints
 * @satisfies Decision: Full STR/AGI per-limb customization in Phase 1
 */

import type { CyberwareItem, CyberwareGrade, Character } from "@/lib/types/character";
import type { CyberwareCatalogItem } from "@/lib/types/edition";
import { roundEssence } from "./essence";
import { getCyberwareGradeMultiplier, applyGradeToCost } from "./grades";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Base capacity for standard cyberlimbs */
const BASE_CYBERLIMB_CAPACITY: Record<string, number> = {
  "cyberarm": 15,
  "cyberleg": 20,
  "cyberhand": 4,
  "cyberfoot": 4,
  "cybertorso": 10,
  "cyberskull": 4,
};

/** Capacity cost per +1 to STR or AGI */
const CUSTOMIZATION_CAPACITY_COST = 1;

/** Default attributes for a cyberlimb before customization */
const DEFAULT_CYBERLIMB_ATTRIBUTES = {
  strength: 3,
  agility: 3,
};

/** Maximum attribute bonus from customization (racial max + this) */
const MAX_CUSTOMIZATION_BONUS = 3;

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * Cyberlimb attribute customization state
 */
export interface CyberlimbCustomization {
  /** Current STR value for this limb */
  strength: number;
  /** Current AGI value for this limb */
  agility: number;
  /** Character's natural STR (starting point) */
  baseStrength: number;
  /** Character's natural AGI (starting point) */
  baseAgility: number;
  /** Additional STR purchased (costs capacity) */
  strengthBonus: number;
  /** Additional AGI purchased (costs capacity) */
  agilityBonus: number;
  /** Maximum allowed STR (racial max + 3) */
  maxStrength: number;
  /** Maximum allowed AGI (racial max + 3) */
  maxAgility: number;
}

/**
 * Breakdown of how capacity is used
 */
export interface CyberlimbCapacityBreakdown {
  /** Total capacity available */
  totalCapacity: number;
  /** Capacity used by installed enhancements */
  usedByEnhancements: number;
  /** Capacity used by attribute customization (1 per +1 STR or AGI) */
  usedByCustomization: number;
  /** Remaining available capacity */
  remainingCapacity: number;
}

/**
 * Validation result for cyberlimb operations
 */
export interface CyberlimbValidationResult {
  valid: boolean;
  error?: string;
  details?: Record<string, unknown>;
}

/**
 * Enhanced cyberware item with cyberlimb-specific fields
 */
export interface CyberlimbItem extends CyberwareItem {
  /** Cyberlimb STR value */
  limbStrength?: number;
  /** Cyberlimb AGI value */
  limbAgility?: number;
  /** Customization bonus to STR (above base 3) */
  strengthCustomization?: number;
  /** Customization bonus to AGI (above base 3) */
  agilityCustomization?: number;
}

// =============================================================================
// CAPACITY FUNCTIONS
// =============================================================================

/**
 * Check if an item is a cyberlimb
 */
export function isCyberlimb(item: CyberwareItem | CyberwareCatalogItem): boolean {
  const category = item.category;
  return category === "cyberlimb";
}

/**
 * Get the base capacity for a cyberlimb type
 *
 * @param limbType - The type of cyberlimb (e.g., "cyberarm", "cyberleg")
 * @returns Base capacity for that limb type
 */
export function getBaseCyberlimbCapacity(limbType: string): number {
  // Normalize the limb type
  const normalized = limbType.toLowerCase().replace(/[-_\s]/g, "");

  for (const [key, capacity] of Object.entries(BASE_CYBERLIMB_CAPACITY)) {
    if (normalized.includes(key.replace("cyber", ""))) {
      return capacity;
    }
  }

  // Default to arm capacity if unknown
  return BASE_CYBERLIMB_CAPACITY["cyberarm"];
}

/**
 * Calculate total capacity of a cyberlimb
 *
 * @param limb - The installed cyberlimb
 * @returns Total capacity
 */
export function calculateCyberlimbCapacity(limb: CyberwareItem): number {
  // If capacity is explicitly set, use it
  if (limb.capacity !== undefined && limb.capacity > 0) {
    return limb.capacity;
  }

  // Otherwise derive from limb name/catalogId
  return getBaseCyberlimbCapacity(limb.catalogId || limb.name);
}

/**
 * Calculate capacity used by installed enhancements
 *
 * @param limb - The cyberlimb to check
 * @returns Capacity used by enhancements
 */
export function calculateEnhancementCapacityUsed(limb: CyberwareItem): number {
  if (!limb.enhancements || limb.enhancements.length === 0) {
    return 0;
  }

  return limb.enhancements.reduce((total, enhancement) => {
    return total + (enhancement.capacityUsed ?? enhancement.baseEssenceCost ?? 1);
  }, 0);
}

/**
 * Calculate capacity used by attribute customization
 *
 * @param limb - The cyberlimb to check
 * @returns Capacity used by customization
 */
export function calculateCustomizationCapacityCost(limb: CyberlimbItem): number {
  const strBonus = limb.strengthCustomization ?? 0;
  const agiBonus = limb.agilityCustomization ?? 0;

  return (strBonus + agiBonus) * CUSTOMIZATION_CAPACITY_COST;
}

/**
 * Get complete capacity breakdown for a cyberlimb
 *
 * @param limb - The cyberlimb to analyze
 * @returns Detailed capacity breakdown
 */
export function calculateUsedCapacity(limb: CyberlimbItem): CyberlimbCapacityBreakdown {
  const totalCapacity = calculateCyberlimbCapacity(limb);
  const usedByEnhancements = calculateEnhancementCapacityUsed(limb);
  const usedByCustomization = calculateCustomizationCapacityCost(limb);
  const remainingCapacity = Math.max(0, totalCapacity - usedByEnhancements - usedByCustomization);

  return {
    totalCapacity,
    usedByEnhancements,
    usedByCustomization,
    remainingCapacity,
  };
}

// =============================================================================
// ENHANCEMENT MANAGEMENT
// =============================================================================

/**
 * Validate that an enhancement fits in a cyberlimb
 *
 * @param limb - The cyberlimb
 * @param enhancement - The enhancement to install
 * @param rating - Optional rating for rated enhancements
 * @returns Validation result
 */
export function validateEnhancementFits(
  limb: CyberlimbItem,
  enhancement: CyberwareCatalogItem,
  rating?: number
): CyberlimbValidationResult {
  // Check if it's an enhancement type
  if (enhancement.category !== "cyberlimb-enhancement" && enhancement.category !== "cyberlimb-accessory") {
    return {
      valid: false,
      error: `${enhancement.name} is not a cyberlimb enhancement or accessory.`,
      details: { category: enhancement.category },
    };
  }

  // Calculate capacity cost
  let capacityCost = enhancement.capacityCost ?? 1;
  if (rating && (enhancement.ratingSpec?.capacityCostScaling?.perRating || enhancement.capacityPerRating)) {
    capacityCost = capacityCost * rating;
  }

  // Check available capacity
  const breakdown = calculateUsedCapacity(limb);

  if (capacityCost > breakdown.remainingCapacity) {
    return {
      valid: false,
      error: `${enhancement.name} requires ${capacityCost} capacity but only ${breakdown.remainingCapacity} is available.`,
      details: {
        required: capacityCost,
        available: breakdown.remainingCapacity,
        breakdown,
      },
    };
  }

  return { valid: true };
}

/**
 * Add an enhancement to a cyberlimb
 *
 * @param limb - The cyberlimb to modify
 * @param enhancement - The enhancement catalog item
 * @param grade - Grade of the enhancement
 * @param rating - Optional rating
 * @returns Updated cyberlimb with enhancement installed
 */
export function addEnhancementToLimb(
  limb: CyberlimbItem,
  enhancement: CyberwareCatalogItem,
  grade: CyberwareGrade = "standard",
  rating?: number
): CyberlimbItem {
  // Calculate costs
  let capacityCost = enhancement.capacityCost ?? 1;
  if (rating && (enhancement.ratingSpec?.capacityCostScaling?.perRating || enhancement.capacityPerRating)) {
    capacityCost = capacityCost * rating;
  }

  let essenceCost = enhancement.essenceCost;
  if (rating && (enhancement.ratingSpec?.essenceScaling?.perRating || enhancement.essencePerRating)) {
    essenceCost = essenceCost * rating;
  }
  essenceCost = roundEssence(essenceCost * getCyberwareGradeMultiplier(grade));

  const cost = applyGradeToCost(enhancement.cost * (rating ?? 1), grade, true);

  // Create the installed enhancement
  const installedEnhancement: CyberwareItem = {
    catalogId: enhancement.id,
    name: enhancement.name,
    category: enhancement.category,
    grade,
    baseEssenceCost: enhancement.essenceCost,
    essenceCost,
    rating,
    capacityUsed: capacityCost,
    cost,
    availability: enhancement.availability,
    legality: enhancement.legality,
    attributeBonuses: enhancement.attributeBonuses,
    initiativeDiceBonus: enhancement.initiativeDiceBonus,
    wirelessBonus: enhancement.wirelessBonus,
    notes: enhancement.description,
  };

  // Add to limb
  const updatedEnhancements = [...(limb.enhancements ?? []), installedEnhancement];
  const newCapacityUsed = (limb.capacityUsed ?? 0) + capacityCost;

  return {
    ...limb,
    enhancements: updatedEnhancements,
    capacityUsed: newCapacityUsed,
  };
}

/**
 * Remove an enhancement from a cyberlimb
 *
 * @param limb - The cyberlimb to modify
 * @param enhancementId - ID of the enhancement to remove (catalogId or id)
 * @returns Updated cyberlimb with enhancement removed
 */
export function removeEnhancementFromLimb(
  limb: CyberlimbItem,
  enhancementId: string
): CyberlimbItem {
  const enhancements = limb.enhancements ?? [];
  const enhancementIndex = enhancements.findIndex(
    e => e.catalogId === enhancementId || e.id === enhancementId
  );

  if (enhancementIndex === -1) {
    return limb; // Enhancement not found, return unchanged
  }

  const removedEnhancement = enhancements[enhancementIndex];
  const updatedEnhancements = enhancements.filter((_, i) => i !== enhancementIndex);
  const newCapacityUsed = Math.max(0, (limb.capacityUsed ?? 0) - (removedEnhancement.capacityUsed ?? 0));

  return {
    ...limb,
    enhancements: updatedEnhancements,
    capacityUsed: newCapacityUsed,
  };
}

// =============================================================================
// ATTRIBUTE CUSTOMIZATION
// =============================================================================

/**
 * Get the customization limits for a cyberlimb based on character
 *
 * @param limb - The cyberlimb
 * @param character - The character (for racial limits)
 * @returns Complete customization state and limits
 */
export function getCyberlimbCustomizationLimits(
  limb: CyberlimbItem,
  character: Partial<Character>
): CyberlimbCustomization {
  // Get character's natural attributes
  const baseStrength = character.attributes?.["bod"] ?? 3; // Use BOD as proxy for STR base
  const baseAgility = character.attributes?.["agi"] ?? 3;

  // Get racial maximums (typically 6 for humans)
  // In a full implementation, this would come from metatype data
  const racialMaxStr = 6; // TODO: Get from metatype
  const racialMaxAgi = 6;

  // Calculate maximums (racial max + 3)
  const maxStrength = racialMaxStr + MAX_CUSTOMIZATION_BONUS;
  const maxAgility = racialMaxAgi + MAX_CUSTOMIZATION_BONUS;

  // Get current customization
  const strengthBonus = limb.strengthCustomization ?? 0;
  const agilityBonus = limb.agilityCustomization ?? 0;

  // Calculate current values
  const strength = DEFAULT_CYBERLIMB_ATTRIBUTES.strength + strengthBonus;
  const agility = DEFAULT_CYBERLIMB_ATTRIBUTES.agility + agilityBonus;

  return {
    strength,
    agility,
    baseStrength,
    baseAgility,
    strengthBonus,
    agilityBonus,
    maxStrength,
    maxAgility,
  };
}

/**
 * Validate a cyberlimb attribute customization
 *
 * @param limb - The cyberlimb
 * @param character - The character
 * @returns Validation result
 */
export function validateCyberlimbCustomization(
  limb: CyberlimbItem,
  character: Partial<Character>
): CyberlimbValidationResult {
  const limits = getCyberlimbCustomizationLimits(limb, character);
  const breakdown = calculateUsedCapacity(limb);

  // Check STR within limits
  if (limits.strength > limits.maxStrength) {
    return {
      valid: false,
      error: `Cyberlimb STR ${limits.strength} exceeds maximum of ${limits.maxStrength}.`,
      details: { strength: limits.strength, maxStrength: limits.maxStrength },
    };
  }

  // Check AGI within limits
  if (limits.agility > limits.maxAgility) {
    return {
      valid: false,
      error: `Cyberlimb AGI ${limits.agility} exceeds maximum of ${limits.maxAgility}.`,
      details: { agility: limits.agility, maxAgility: limits.maxAgility },
    };
  }

  // Check capacity for customization
  if (breakdown.usedByCustomization > breakdown.totalCapacity - breakdown.usedByEnhancements) {
    return {
      valid: false,
      error: `Customization requires ${breakdown.usedByCustomization} capacity but only ${breakdown.totalCapacity - breakdown.usedByEnhancements} is available after enhancements.`,
      details: { breakdown },
    };
  }

  return { valid: true };
}

/**
 * Set a cyberlimb attribute value
 *
 * @param limb - The cyberlimb to modify
 * @param attribute - 'strength' or 'agility'
 * @param value - The new value (base is 3)
 * @param character - The character (for validation)
 * @returns Updated cyberlimb or error
 */
export function setCyberlimbAttribute(
  limb: CyberlimbItem,
  attribute: "strength" | "agility",
  value: number,
  character: Partial<Character>
): { success: true; limb: CyberlimbItem } | { success: false; error: string } {
  // Calculate the bonus needed
  const bonus = value - DEFAULT_CYBERLIMB_ATTRIBUTES[attribute];

  if (bonus < 0) {
    return {
      success: false,
      error: `Cannot set ${attribute} below base value of ${DEFAULT_CYBERLIMB_ATTRIBUTES[attribute]}.`,
    };
  }

  // Create updated limb
  const updatedLimb: CyberlimbItem = {
    ...limb,
    [attribute === "strength" ? "strengthCustomization" : "agilityCustomization"]: bonus,
    [attribute === "strength" ? "limbStrength" : "limbAgility"]: value,
  };

  // Validate the change
  const validation = validateCyberlimbCustomization(updatedLimb, character);

  if (!validation.valid) {
    return { success: false, error: validation.error ?? "Invalid customization" };
  }

  return { success: true, limb: updatedLimb };
}

/**
 * Get the effective attributes for a cyberlimb
 *
 * @param limb - The cyberlimb
 * @returns Current STR and AGI values
 */
export function getCyberlimbEffectiveAttributes(limb: CyberlimbItem): {
  strength: number;
  agility: number;
} {
  return {
    strength: limb.limbStrength ?? DEFAULT_CYBERLIMB_ATTRIBUTES.strength + (limb.strengthCustomization ?? 0),
    agility: limb.limbAgility ?? DEFAULT_CYBERLIMB_ATTRIBUTES.agility + (limb.agilityCustomization ?? 0),
  };
}

// =============================================================================
// CYBERLIMB AVERAGING (SR5 Rules)
// =============================================================================

/**
 * Calculate average attribute when character has partial cyberlimbs
 * SR5 uses limb averaging for physical actions
 *
 * @param character - The character
 * @param attribute - 'strength' or 'agility'
 * @returns Average attribute considering all limbs
 */
export function calculateCyberlimbAverageAttribute(
  character: Partial<Character>,
  attribute: "strength" | "agility"
): number {
  const naturalValue = character.attributes?.[attribute === "strength" ? "bod" : "agi"] ?? 3;

  // Get all cyberlimbs
  const cyberlimbs = (character.cyberware ?? []).filter(isCyberlimb) as CyberlimbItem[];

  if (cyberlimbs.length === 0) {
    return naturalValue;
  }

  // Count limbs (arms = 2 each, legs = 2 each, hands/feet = 1 each)
  // Full body = all natural limbs replaced
  const totalLimbs = 4; // 2 arms + 2 legs for simplicity
  let cyberLimbCount = 0;
  let cyberLimbTotal = 0;

  for (const limb of cyberlimbs) {
    const attrs = getCyberlimbEffectiveAttributes(limb);
    const limbValue = attribute === "strength" ? attrs.strength : attrs.agility;

    // Count based on limb type
    const catalogId = limb.catalogId?.toLowerCase() ?? "";
    if (catalogId.includes("arm") || catalogId.includes("leg")) {
      cyberLimbCount += 1;
      cyberLimbTotal += limbValue;
    } else if (catalogId.includes("hand") || catalogId.includes("foot")) {
      cyberLimbCount += 0.5;
      cyberLimbTotal += limbValue * 0.5;
    }
  }

  // Calculate weighted average
  const naturalLimbCount = Math.max(0, totalLimbs - cyberLimbCount);
  const naturalTotal = naturalValue * naturalLimbCount;
  const average = (naturalTotal + cyberLimbTotal) / totalLimbs;

  return Math.round(average * 10) / 10; // Round to 1 decimal
}

// =============================================================================
// CYBERLIMB CREATION
// =============================================================================

/**
 * Create a new cyberlimb from a catalog item
 *
 * @param catalogItem - The cyberlimb catalog item
 * @param grade - The grade to install
 * @param character - The character (for customization limits)
 * @returns A new cyberlimb item
 */
export function createCyberlimb(
  catalogItem: CyberwareCatalogItem,
  grade: CyberwareGrade,
  character: Partial<Character>
): CyberlimbItem {
  const gradeMultiplier = getCyberwareGradeMultiplier(grade);
  const essenceCost = roundEssence(catalogItem.essenceCost * gradeMultiplier);
  const cost = applyGradeToCost(catalogItem.cost, grade, true);

  const limb: CyberlimbItem = {
    catalogId: catalogItem.id,
    name: catalogItem.name,
    category: catalogItem.category,
    grade,
    baseEssenceCost: catalogItem.essenceCost,
    essenceCost,
    cost,
    availability: catalogItem.availability,
    legality: catalogItem.legality,
    capacity: catalogItem.capacity ?? getBaseCyberlimbCapacity(catalogItem.id),
    capacityUsed: 0,
    enhancements: [],
    limbStrength: DEFAULT_CYBERLIMB_ATTRIBUTES.strength,
    limbAgility: DEFAULT_CYBERLIMB_ATTRIBUTES.agility,
    strengthCustomization: 0,
    agilityCustomization: 0,
    wirelessBonus: catalogItem.wirelessBonus,
    notes: catalogItem.description,
  };

  return limb;
}

/**
 * Get a summary of a cyberlimb for display
 */
export function getCyberlimbSummary(limb: CyberlimbItem): string {
  const attrs = getCyberlimbEffectiveAttributes(limb);
  const capacity = calculateUsedCapacity(limb);
  const enhancementCount = limb.enhancements?.length ?? 0;

  return `${limb.name} (${limb.grade}) - STR ${attrs.strength}/AGI ${attrs.agility} - Capacity: ${capacity.remainingCapacity}/${capacity.totalCapacity} - ${enhancementCount} enhancements`;
}
