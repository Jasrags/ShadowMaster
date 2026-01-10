/**
 * Essence Calculation Utilities
 *
 * Core functions for calculating essence costs of augmentations.
 * All essence values are rounded to 2 decimal places for consistency
 * with rulebook notation (e.g., 5.73).
 *
 * @satisfies Capability Guarantee #1: Verifiable Essence reduction
 * @satisfies Requirement: Essence and Metaphysical Integrity
 */

import type {
  CyberwareItem,
  BiowareItem,
  CyberwareGrade,
  BiowareGrade,
} from "@/lib/types/character";
import type { CyberwareCatalogItem, BiowareCatalogItem } from "@/lib/types/edition";
import { getCyberwareGradeMultiplier, getBiowareGradeMultiplier } from "./grades";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Number of decimal places for essence precision */
export const ESSENCE_PRECISION = 2;

/** Maximum essence for metahumans */
export const MAX_ESSENCE = 6.0;

/** Minimum viable essence threshold - character dies below this */
export const ESSENCE_MIN_VIABLE = 0.01;

// =============================================================================
// PRECISION UTILITIES
// =============================================================================

/**
 * Round essence value to 2 decimal places using banker's rounding
 * This ensures consistent precision across all calculations.
 *
 * @param value - The essence value to round
 * @returns The value rounded to 2 decimal places
 */
export function roundEssence(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Format essence value for display with exactly 2 decimal places
 *
 * @param value - The essence value to format
 * @returns String representation with 2 decimal places (e.g., "5.70")
 */
export function formatEssence(value: number): string {
  return roundEssence(value).toFixed(ESSENCE_PRECISION);
}

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * Result of an essence calculation with all relevant values
 */
export interface EssenceCalculation {
  /** Base essence cost before grade multiplier */
  baseEssenceCost: number;
  /** Grade multiplier applied */
  gradeMultiplier: number;
  /** Final essence cost after grade multiplier (rounded to 2 decimals) */
  finalEssenceCost: number;
  /** Current essence before this augmentation */
  currentEssence: number;
  /** New essence after this augmentation (rounded to 2 decimals) */
  newEssence: number;
  /** Whether character remains viable (essence >= 0.01) */
  isViable: boolean;
}

/**
 * Validation result for essence operations
 */
export interface EssenceValidationResult {
  valid: boolean;
  error?: string;
  currentEssence: number;
  projectedEssence: number;
}

// =============================================================================
// CYBERWARE ESSENCE CALCULATIONS
// =============================================================================

/**
 * Calculate the essence cost of a cyberware item at a specific grade and rating
 *
 * @param item - The cyberware catalog item
 * @param grade - The grade of cyberware (used, standard, alpha, beta, delta)
 * @param rating - Optional rating for rated items
 * @returns The calculated essence cost (rounded to 2 decimals)
 */
export function calculateCyberwareEssence(
  item: CyberwareCatalogItem,
  grade: CyberwareGrade,
  rating?: number
): number {
  let baseCost = item.essenceCost;

  // Handle rating-based scaling
  if (rating !== undefined && rating > 0) {
    // Check for new ratingSpec system first
    if (item.ratingSpec?.essenceScaling?.perRating) {
      const scaling = item.ratingSpec.essenceScaling;
      switch (scaling.scalingType) {
        case "linear":
        default:
          baseCost = scaling.baseValue * rating;
          break;
        case "table":
          if (scaling.valueLookup && scaling.valueLookup[rating] !== undefined) {
            baseCost = scaling.valueLookup[rating];
          }
          break;
      }
    } else if (item.essencePerRating) {
      // Legacy property support
      baseCost = item.essenceCost * rating;
    }
  }

  // Apply grade multiplier
  const gradeMultiplier = getCyberwareGradeMultiplier(grade);
  const finalCost = baseCost * gradeMultiplier;

  return roundEssence(finalCost);
}

/**
 * Get the base essence cost from a cyberware catalog item
 * (before grade or rating modifications)
 */
export function getCyberwareBaseEssence(item: CyberwareCatalogItem): number {
  return item.essenceCost;
}

// =============================================================================
// BIOWARE ESSENCE CALCULATIONS
// =============================================================================

/**
 * Calculate the essence cost of a bioware item at a specific grade and rating
 *
 * @param item - The bioware catalog item
 * @param grade - The grade of bioware (standard, alpha, beta, delta)
 * @param rating - Optional rating for rated items
 * @returns The calculated essence cost (rounded to 2 decimals)
 */
export function calculateBiowareEssence(
  item: BiowareCatalogItem,
  grade: BiowareGrade,
  rating?: number
): number {
  let baseCost = item.essenceCost;

  // Handle rating-based scaling
  if (rating !== undefined && rating > 0) {
    // Check for new ratingSpec system first
    if (item.ratingSpec?.essenceScaling?.perRating) {
      const scaling = item.ratingSpec.essenceScaling;
      switch (scaling.scalingType) {
        case "linear":
        default:
          baseCost = scaling.baseValue * rating;
          break;
        case "table":
          if (scaling.valueLookup && scaling.valueLookup[rating] !== undefined) {
            baseCost = scaling.valueLookup[rating];
          }
          break;
      }
    } else if (item.essencePerRating) {
      // Legacy property support
      baseCost = item.essenceCost * rating;
    }
  }

  // Apply grade multiplier
  const gradeMultiplier = getBiowareGradeMultiplier(grade);
  const finalCost = baseCost * gradeMultiplier;

  return roundEssence(finalCost);
}

/**
 * Get the base essence cost from a bioware catalog item
 * (before grade or rating modifications)
 */
export function getBiowareBaseEssence(item: BiowareCatalogItem): number {
  return item.essenceCost;
}

// =============================================================================
// TOTAL ESSENCE CALCULATIONS
// =============================================================================

/**
 * Calculate total essence loss from all installed cyberware
 *
 * @param cyberware - Array of installed cyberware items
 * @returns Total essence lost (rounded to 2 decimals)
 */
export function calculateCyberwareEssenceLoss(cyberware: CyberwareItem[]): number {
  if (!cyberware || cyberware.length === 0) {
    return 0;
  }

  const total = cyberware.reduce((sum, item) => {
    // Use the pre-calculated essenceCost which includes grade multiplier
    return sum + (item.essenceCost || 0);
  }, 0);

  return roundEssence(total);
}

/**
 * Calculate total essence loss from all installed bioware
 *
 * @param bioware - Array of installed bioware items
 * @returns Total essence lost (rounded to 2 decimals)
 */
export function calculateBiowareEssenceLoss(bioware: BiowareItem[]): number {
  if (!bioware || bioware.length === 0) {
    return 0;
  }

  const total = bioware.reduce((sum, item) => {
    // Use the pre-calculated essenceCost which includes grade multiplier
    return sum + (item.essenceCost || 0);
  }, 0);

  return roundEssence(total);
}

/**
 * Calculate total essence loss from all augmentations (cyberware + bioware)
 *
 * @param cyberware - Array of installed cyberware items
 * @param bioware - Array of installed bioware items
 * @returns Total essence lost (rounded to 2 decimals)
 */
export function calculateTotalEssenceLoss(
  cyberware: CyberwareItem[],
  bioware: BiowareItem[]
): number {
  const cyberwareLoss = calculateCyberwareEssenceLoss(cyberware);
  const biowareLoss = calculateBiowareEssenceLoss(bioware);

  return roundEssence(cyberwareLoss + biowareLoss);
}

/**
 * Calculate remaining essence after losses
 *
 * @param baseEssence - Starting essence (typically 6.0)
 * @param essenceLoss - Total essence lost to augmentations
 * @returns Remaining essence (rounded to 2 decimals, minimum 0)
 */
export function calculateRemainingEssence(baseEssence: number, essenceLoss: number): number {
  const remaining = Math.max(0, baseEssence - essenceLoss);
  return roundEssence(remaining);
}

/**
 * Get current essence for a character
 *
 * @param cyberware - Array of installed cyberware items
 * @param bioware - Array of installed bioware items
 * @param baseEssence - Starting essence (default: 6.0)
 * @returns Current essence value (rounded to 2 decimals)
 */
export function getCurrentEssence(
  cyberware: CyberwareItem[],
  bioware: BiowareItem[],
  baseEssence: number = MAX_ESSENCE
): number {
  const totalLoss = calculateTotalEssenceLoss(cyberware, bioware);
  return calculateRemainingEssence(baseEssence, totalLoss);
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate that a character's essence is still viable
 *
 * @param newEssence - The essence value to validate
 * @returns Validation result
 */
export function validateEssenceViability(newEssence: number): EssenceValidationResult {
  // Check negative first (before rounding)
  if (newEssence < 0) {
    return {
      valid: false,
      error: "Essence cannot be negative.",
      currentEssence: 0,
      projectedEssence: 0,
    };
  }

  // Check raw value against threshold before rounding
  // This prevents 0.009 from rounding up to 0.01 and passing
  if (newEssence < ESSENCE_MIN_VIABLE) {
    const roundedEssence = roundEssence(Math.max(0, newEssence));
    return {
      valid: false,
      error: `Essence ${formatEssence(roundedEssence)} is below minimum viable threshold of ${formatEssence(ESSENCE_MIN_VIABLE)}. Character would die.`,
      currentEssence: roundedEssence,
      projectedEssence: roundedEssence,
    };
  }

  const roundedEssence = roundEssence(newEssence);
  return {
    valid: true,
    currentEssence: roundedEssence,
    projectedEssence: roundedEssence,
  };
}

/**
 * Validate that an augmentation can be installed without killing the character
 *
 * @param currentEssence - Current essence before augmentation
 * @param augmentationEssenceCost - Essence cost of the proposed augmentation
 * @returns Validation result with projected essence
 */
export function validateAugmentationEssence(
  currentEssence: number,
  augmentationEssenceCost: number
): EssenceValidationResult {
  const projected = roundEssence(currentEssence - augmentationEssenceCost);

  if (projected < ESSENCE_MIN_VIABLE) {
    return {
      valid: false,
      error: `Installing this augmentation would reduce essence from ${formatEssence(currentEssence)} to ${formatEssence(Math.max(0, projected))}, which is below the minimum viable threshold.`,
      currentEssence: roundEssence(currentEssence),
      projectedEssence: Math.max(0, projected),
    };
  }

  return {
    valid: true,
    currentEssence: roundEssence(currentEssence),
    projectedEssence: projected,
  };
}

// =============================================================================
// FULL CALCULATION
// =============================================================================

/**
 * Calculate complete essence impact of installing an augmentation
 *
 * @param currentEssence - Current essence before augmentation
 * @param baseEssenceCost - Base essence cost of the augmentation
 * @param gradeMultiplier - Grade multiplier to apply
 * @returns Complete essence calculation result
 */
export function calculateEssenceImpact(
  currentEssence: number,
  baseEssenceCost: number,
  gradeMultiplier: number
): EssenceCalculation {
  const finalEssenceCost = roundEssence(baseEssenceCost * gradeMultiplier);
  const newEssence = roundEssence(Math.max(0, currentEssence - finalEssenceCost));
  const isViable = newEssence >= ESSENCE_MIN_VIABLE;

  return {
    baseEssenceCost,
    gradeMultiplier,
    finalEssenceCost,
    currentEssence: roundEssence(currentEssence),
    newEssence,
    isViable,
  };
}
