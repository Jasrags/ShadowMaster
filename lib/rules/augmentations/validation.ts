/**
 * Augmentation Validation Engine
 *
 * Validates augmentation installations against ruleset constraints including:
 * - Essence viability
 * - Availability restrictions (creation vs active play)
 * - Attribute bonus limits
 * - Mutual exclusivity rules
 *
 * @satisfies Constraints: max limits, availability, mutual exclusivity
 */

import type { Character, CyberwareItem, BiowareItem, CyberwareGrade, BiowareGrade, ItemLegality } from "@/lib/types";
import type { CyberwareCatalogItem, BiowareCatalogItem, AugmentationRules } from "@/lib/types/edition";
import {
  calculateCyberwareEssence,
  calculateBiowareEssence,
  getCurrentEssence,
  validateAugmentationEssence,
  formatEssence,
  ESSENCE_MIN_VIABLE,
} from "./essence";
import { applyGradeToAvailability } from "./grades";

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * Error codes for augmentation validation failures
 */
export type AugmentationValidationErrorCode =
  | "ESSENCE_INSUFFICIENT"
  | "ESSENCE_WOULD_KILL"
  | "AVAILABILITY_EXCEEDED"
  | "AVAILABILITY_FORBIDDEN"
  | "AVAILABILITY_RESTRICTED"
  | "ATTRIBUTE_BONUS_EXCEEDED"
  | "MUTUAL_EXCLUSION"
  | "DUPLICATE_AUGMENTATION"
  | "INVALID_GRADE"
  | "INVALID_RATING"
  | "CAPACITY_EXCEEDED";

/**
 * Warning codes for augmentation validation
 */
export type AugmentationValidationWarningCode =
  | "MAGIC_LOSS"
  | "LOW_ESSENCE"
  | "HIGH_AVAILABILITY"
  | "EXPENSIVE";

/**
 * Validation error with details
 */
export interface AugmentationValidationError {
  code: AugmentationValidationErrorCode;
  message: string;
  field?: string;
  augmentationId?: string;
  details?: Record<string, unknown>;
}

/**
 * Validation warning with details
 */
export interface AugmentationValidationWarning {
  code: AugmentationValidationWarningCode;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Complete validation result
 */
export interface AugmentationValidationResult {
  valid: boolean;
  errors: AugmentationValidationError[];
  warnings: AugmentationValidationWarning[];
}

/**
 * Context for validation (lifecycle stage, rules, etc.)
 */
export interface ValidationContext {
  /** Character's current lifecycle stage */
  lifecycleStage: "creation" | "active";
  /** Edition-specific augmentation rules */
  rules: AugmentationRules;
  /** Whether to allow restricted items */
  allowRestricted?: boolean;
  /** Whether to allow forbidden items (typically never at creation) */
  allowForbidden?: boolean;
}

/**
 * Simple validation result for individual checks
 */
export interface SimpleValidationResult {
  valid: boolean;
  error?: string;
}

// =============================================================================
// DEFAULT RULES
// =============================================================================

/**
 * Default augmentation rules (SR5 standard)
 */
export const DEFAULT_AUGMENTATION_RULES: AugmentationRules = {
  maxEssence: 6,
  maxAttributeBonus: 4,
  maxAvailabilityAtCreation: 12,
  trackEssenceHoles: true,
  magicReductionFormula: "roundUp",
};

// =============================================================================
// MAIN VALIDATION FUNCTION
// =============================================================================

/**
 * Validate that an augmentation can be installed on a character
 *
 * @param character - The character to validate against
 * @param augmentation - The catalog item to install
 * @param grade - The grade to install at
 * @param rating - Optional rating for rated items
 * @param context - Validation context (lifecycle, rules)
 * @returns Complete validation result with errors and warnings
 */
export function validateAugmentationInstall(
  character: Partial<Character>,
  augmentation: CyberwareCatalogItem | BiowareCatalogItem,
  grade: CyberwareGrade | BiowareGrade,
  rating: number | undefined,
  context: ValidationContext
): AugmentationValidationResult {
  const errors: AugmentationValidationError[] = [];
  const warnings: AugmentationValidationWarning[] = [];

  const isCyberware = "category" in augmentation &&
    ["headware", "eyeware", "earware", "bodyware", "cyberlimb", "cyberlimb-enhancement", "cyberlimb-accessory", "hand-blade", "hand-razor", "spur", "cybernetic-weapon", "nanocyber"].includes(augmentation.category);

  // 1. Validate essence
  const essenceResult = validateEssenceForInstall(
    character,
    augmentation,
    grade as CyberwareGrade,
    rating,
    isCyberware
  );
  if (!essenceResult.valid && essenceResult.error) {
    errors.push(essenceResult.error);
  }
  if (essenceResult.warnings) {
    warnings.push(...essenceResult.warnings);
  }

  // 2. Validate availability
  const availResult = validateAvailabilityConstraint(
    augmentation.availability,
    grade,
    augmentation.legality,
    context.lifecycleStage,
    context.rules.maxAvailabilityAtCreation,
    context.allowRestricted,
    context.allowForbidden,
    isCyberware
  );
  if (!availResult.valid && availResult.error) {
    errors.push(availResult.error);
  }

  // 3. Validate attribute bonuses
  if (augmentation.attributeBonuses) {
    const bonusResult = validateAttributeBonusLimit(
      character,
      augmentation.attributeBonuses,
      context.rules.maxAttributeBonus
    );
    if (!bonusResult.valid && bonusResult.error) {
      errors.push(bonusResult.error);
    }
  }

  // 4. Check for duplicates
  const duplicateResult = validateNoDuplicate(
    character,
    augmentation.id,
    isCyberware
  );
  if (!duplicateResult.valid && duplicateResult.error) {
    errors.push(duplicateResult.error);
  }

  // 5. Check mutual exclusions
  const exclusionResult = validateMutualExclusion(
    character,
    augmentation
  );
  if (!exclusionResult.valid && exclusionResult.error) {
    errors.push(exclusionResult.error);
  }

  // 6. Validate rating if applicable
  if (rating !== undefined) {
    const ratingResult = validateRating(augmentation, rating);
    if (!ratingResult.valid && ratingResult.error) {
      errors.push(ratingResult.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// ESSENCE VALIDATION
// =============================================================================

interface EssenceValidationDetailedResult {
  valid: boolean;
  error?: AugmentationValidationError;
  warnings?: AugmentationValidationWarning[];
}

/**
 * Validate essence for augmentation installation
 */
function validateEssenceForInstall(
  character: Partial<Character>,
  augmentation: CyberwareCatalogItem | BiowareCatalogItem,
  grade: CyberwareGrade | BiowareGrade,
  rating: number | undefined,
  isCyberware: boolean
): EssenceValidationDetailedResult {
  const warnings: AugmentationValidationWarning[] = [];

  // Calculate essence cost
  const essenceCost = isCyberware
    ? calculateCyberwareEssence(augmentation as CyberwareCatalogItem, grade as CyberwareGrade, rating)
    : calculateBiowareEssence(augmentation as BiowareCatalogItem, grade as BiowareGrade, rating);

  // Get current essence
  const currentEssence = getCurrentEssence(
    character.cyberware ?? [],
    character.bioware ?? []
  );

  // Validate
  const result = validateAugmentationEssence(currentEssence, essenceCost);

  if (!result.valid) {
    return {
      valid: false,
      error: {
        code: result.projectedEssence < ESSENCE_MIN_VIABLE ? "ESSENCE_WOULD_KILL" : "ESSENCE_INSUFFICIENT",
        message: result.error ?? "Insufficient essence",
        field: "essence",
        augmentationId: augmentation.id,
        details: {
          currentEssence,
          essenceCost,
          projectedEssence: result.projectedEssence,
        },
      },
    };
  }

  // Add warnings for low essence
  if (result.projectedEssence <= 1) {
    warnings.push({
      code: "LOW_ESSENCE",
      message: `Installing this augmentation would leave you with only ${formatEssence(result.projectedEssence)} essence.`,
      details: { projectedEssence: result.projectedEssence },
    });
  }

  return { valid: true, warnings };
}

// =============================================================================
// AVAILABILITY VALIDATION
// =============================================================================

/**
 * Validate availability constraints based on lifecycle stage
 *
 * @param baseAvailability - Base availability of the item
 * @param grade - Grade being installed
 * @param restricted - Whether the item is restricted
 * @param forbidden - Whether the item is forbidden
 * @param lifecycleStage - Creation or active play
 * @param maxAtCreation - Maximum availability allowed at creation
 * @param allowRestricted - Override to allow restricted items
 * @param allowForbidden - Override to allow forbidden items
 * @param isCyberware - Whether this is cyberware
 * @returns Validation result
 */
export function validateAvailabilityConstraint(
  baseAvailability: number,
  grade: CyberwareGrade | BiowareGrade,
  legality: ItemLegality | undefined,
  lifecycleStage: "creation" | "active",
  maxAtCreation: number = 12,
  allowRestricted?: boolean,
  allowForbidden?: boolean,
  isCyberware: boolean = true
): { valid: boolean; error?: AugmentationValidationError } {
  // Calculate final availability with grade modifier
  const finalAvailability = applyGradeToAvailability(baseAvailability, grade, isCyberware);

  // Check forbidden first
  if (legality === "forbidden" && !allowForbidden) {
    return {
      valid: false,
      error: {
        code: "AVAILABILITY_FORBIDDEN",
        message: "This augmentation is forbidden and cannot be acquired through normal means.",
        field: "availability",
        details: { availability: finalAvailability, forbidden: true },
      },
    };
  }

  // Check restricted at creation (unless explicitly allowed)
  if (legality === "restricted" && lifecycleStage === "creation" && !allowRestricted) {
    return {
      valid: false,
      error: {
        code: "AVAILABILITY_RESTRICTED",
        message: "Restricted items cannot be purchased during character creation without GM approval.",
        field: "availability",
        details: { availability: finalAvailability, restricted: true },
      },
    };
  }

  // Check max availability at creation
  if (lifecycleStage === "creation" && finalAvailability > maxAtCreation) {
    return {
      valid: false,
      error: {
        code: "AVAILABILITY_EXCEEDED",
        message: `Availability ${finalAvailability} exceeds maximum of ${maxAtCreation} allowed during character creation.`,
        field: "availability",
        details: {
          availability: finalAvailability,
          maxAllowed: maxAtCreation,
        },
      },
    };
  }

  return { valid: true };
}

// =============================================================================
// ATTRIBUTE BONUS VALIDATION
// =============================================================================

/**
 * Validate that attribute bonuses don't exceed limits
 *
 * @param character - The character
 * @param newBonuses - Attribute bonuses from the new augmentation
 * @param maxBonus - Maximum allowed bonus per attribute
 * @returns Validation result
 */
export function validateAttributeBonusLimit(
  character: Partial<Character>,
  newBonuses: Record<string, number>,
  maxBonus: number = 4
): { valid: boolean; error?: AugmentationValidationError } {
  // Calculate current bonuses from existing augmentations
  const currentBonuses = aggregateAttributeBonuses(character);

  // Check each new bonus
  for (const [attr, bonus] of Object.entries(newBonuses)) {
    const currentBonus = currentBonuses[attr] ?? 0;
    const totalBonus = currentBonus + bonus;

    if (totalBonus > maxBonus) {
      return {
        valid: false,
        error: {
          code: "ATTRIBUTE_BONUS_EXCEEDED",
          message: `Total ${attr.toUpperCase()} bonus of ${totalBonus} would exceed maximum of ${maxBonus}.`,
          field: "attributeBonuses",
          details: {
            attribute: attr,
            currentBonus,
            newBonus: bonus,
            totalBonus,
            maxAllowed: maxBonus,
          },
        },
      };
    }
  }

  return { valid: true };
}

/**
 * Aggregate all attribute bonuses from installed augmentations
 */
export function aggregateAttributeBonuses(
  character: Partial<Character>
): Record<string, number> {
  const bonuses: Record<string, number> = {};

  // Sum cyberware bonuses
  for (const item of character.cyberware ?? []) {
    if (item.attributeBonuses) {
      for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
        bonuses[attr] = (bonuses[attr] ?? 0) + bonus;
      }
    }
  }

  // Sum bioware bonuses
  for (const item of character.bioware ?? []) {
    if (item.attributeBonuses) {
      for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
        bonuses[attr] = (bonuses[attr] ?? 0) + bonus;
      }
    }
  }

  return bonuses;
}

// =============================================================================
// MUTUAL EXCLUSION VALIDATION
// =============================================================================

/**
 * Known mutually exclusive augmentation pairs
 * Key is the item ID, value is array of item IDs it conflicts with
 */
const MUTUAL_EXCLUSIONS: Record<string, string[]> = {
  // Muscle augmentations
  "muscle-replacement": ["muscle-toner", "muscle-augmentation"],
  "muscle-toner": ["muscle-replacement"],
  "muscle-augmentation": ["muscle-replacement"],

  // Bone augmentations
  "bone-lacing-plastic": ["bone-lacing-aluminum", "bone-lacing-titanium", "bone-density-augmentation"],
  "bone-lacing-aluminum": ["bone-lacing-plastic", "bone-lacing-titanium", "bone-density-augmentation"],
  "bone-lacing-titanium": ["bone-lacing-plastic", "bone-lacing-aluminum", "bone-density-augmentation"],
  "bone-density-augmentation": ["bone-lacing-plastic", "bone-lacing-aluminum", "bone-lacing-titanium"],

  // Reaction enhancers
  "wired-reflexes": ["synaptic-booster", "move-by-wire"],
  "synaptic-booster": ["wired-reflexes", "move-by-wire"],
  "move-by-wire": ["wired-reflexes", "synaptic-booster"],
};

/**
 * Validate that the new augmentation doesn't conflict with existing ones
 *
 * @param character - The character
 * @param augmentation - The augmentation to install
 * @returns Validation result
 */
export function validateMutualExclusion(
  character: Partial<Character>,
  augmentation: CyberwareCatalogItem | BiowareCatalogItem
): { valid: boolean; error?: AugmentationValidationError } {
  const conflictsWith = MUTUAL_EXCLUSIONS[augmentation.id];

  if (!conflictsWith) {
    return { valid: true };
  }

  // Check cyberware
  for (const item of character.cyberware ?? []) {
    if (conflictsWith.includes(item.catalogId)) {
      return {
        valid: false,
        error: {
          code: "MUTUAL_EXCLUSION",
          message: `${augmentation.name} cannot be installed with ${item.name}. These augmentations are mutually exclusive.`,
          field: "mutualExclusion",
          augmentationId: augmentation.id,
          details: {
            conflictingAugmentation: item.catalogId,
            conflictingName: item.name,
          },
        },
      };
    }
  }

  // Check bioware
  for (const item of character.bioware ?? []) {
    if (conflictsWith.includes(item.catalogId)) {
      return {
        valid: false,
        error: {
          code: "MUTUAL_EXCLUSION",
          message: `${augmentation.name} cannot be installed with ${item.name}. These augmentations are mutually exclusive.`,
          field: "mutualExclusion",
          augmentationId: augmentation.id,
          details: {
            conflictingAugmentation: item.catalogId,
            conflictingName: item.name,
          },
        },
      };
    }
  }

  return { valid: true };
}

// =============================================================================
// DUPLICATE VALIDATION
// =============================================================================

/**
 * Validate that the augmentation isn't already installed
 * (Some augmentations like datajacks can only be installed once)
 */
function validateNoDuplicate(
  character: Partial<Character>,
  augmentationId: string,
  isCyberware: boolean
): { valid: boolean; error?: AugmentationValidationError } {
  const items = isCyberware ? character.cyberware : character.bioware;

  const existing = (items ?? []).find(item => item.catalogId === augmentationId);

  if (existing) {
    // Some items can have multiples (like cyberlimbs)
    const allowMultiples = [
      "cyberarm", "cyberleg", "cyberhand", "cyberfoot",
      "cybereye", "cyberear",
    ];

    if (!allowMultiples.some(m => augmentationId.includes(m))) {
      return {
        valid: false,
        error: {
          code: "DUPLICATE_AUGMENTATION",
          message: `${existing.name} is already installed. This augmentation cannot be installed multiple times.`,
          field: "duplicate",
          augmentationId,
        },
      };
    }
  }

  return { valid: true };
}

// =============================================================================
// RATING VALIDATION
// =============================================================================

/**
 * Validate that the rating is valid for the augmentation
 */
function validateRating(
  augmentation: CyberwareCatalogItem | BiowareCatalogItem,
  rating: number
): { valid: boolean; error?: AugmentationValidationError } {
  // Check if item supports ratings
  const hasRating = augmentation.ratingSpec?.rating?.hasRating ?? augmentation.hasRating;

  if (!hasRating) {
    return {
      valid: false,
      error: {
        code: "INVALID_RATING",
        message: `${augmentation.name} does not have a rating.`,
        field: "rating",
        augmentationId: augmentation.id,
      },
    };
  }

  // Check rating bounds
  const minRating = augmentation.ratingSpec?.rating?.minRating ?? 1;
  const maxRating = augmentation.ratingSpec?.rating?.maxRating ?? augmentation.maxRating ?? 6;

  if (rating < minRating || rating > maxRating) {
    return {
      valid: false,
      error: {
        code: "INVALID_RATING",
        message: `Rating ${rating} is invalid for ${augmentation.name}. Valid range is ${minRating}-${maxRating}.`,
        field: "rating",
        augmentationId: augmentation.id,
        details: { rating, minRating, maxRating },
      },
    };
  }

  return { valid: true };
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Quick check if an augmentation can be installed (without full details)
 */
export function canInstallAugmentation(
  character: Partial<Character>,
  augmentation: CyberwareCatalogItem | BiowareCatalogItem,
  grade: CyberwareGrade | BiowareGrade,
  rating: number | undefined,
  context: ValidationContext
): boolean {
  const result = validateAugmentationInstall(
    character,
    augmentation,
    grade,
    rating,
    context
  );
  return result.valid;
}

/**
 * Get a human-readable summary of validation errors
 */
export function getValidationErrorSummary(
  result: AugmentationValidationResult
): string {
  if (result.valid) {
    return "Installation is valid.";
  }

  return result.errors.map(e => e.message).join(" ");
}
