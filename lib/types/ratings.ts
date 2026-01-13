/**
 * Equipment Rating System Types
 *
 * Provides unified type definitions for handling equipment ratings
 * across character creation and gameplay.
 *
 * Supports two patterns:
 * 1. Formula-based scaling (legacy): Uses RatingScalingConfig for computed values
 * 2. Unified ratings tables (preferred): Uses RatingTableValue for explicit per-rating values
 *
 * The unified ratings table approach is preferred because:
 * - Source books print tables, not formulas
 * - Non-linear scaling is common (e.g., Wired Reflexes costs don't follow a formula)
 * - Explicit values are easier to audit and maintain
 * - Single code path for all item types
 *
 * @see docs/plans/unified-ratings-tables-migration.md
 */

// =============================================================================
// UNIFIED RATINGS TABLE (Preferred Approach)
// =============================================================================

/**
 * Explicit values for a single rating level.
 * Contains all rating-dependent properties for that specific rating.
 */
export interface RatingTableValue {
  /** Cost in nuyen at this rating */
  cost?: number;

  /** Base availability at this rating */
  availability?: number;

  /** Availability suffix: "R" (Restricted) or "F" (Forbidden) */
  availabilitySuffix?: "R" | "F";

  /** Essence cost at this rating (cyberware/bioware) */
  essenceCost?: number;

  /** Capacity provided at this rating (cyberlimbs, cybereyes, etc.) */
  capacity?: number;

  /** Capacity slots consumed at this rating (enhancements) */
  capacityCost?: number;

  /** Karma cost at this rating (qualities, foci bonding) */
  karmaCost?: number;

  /** Power point cost at this rating (adept powers) */
  powerPointCost?: number;

  /** Mechanical effects at this rating */
  effects?: RatingEffects;
}

/**
 * Mechanical effects that vary by rating.
 * Covers common effect types across augmentations, gear, and powers.
 */
export interface RatingEffects {
  /** Attribute bonuses (e.g., +2 STR, +1 AGI) */
  attributeBonuses?: Record<string, number>;

  /** Initiative dice bonus */
  initiativeDice?: number;

  /** Initiative score bonus */
  initiativeScore?: number;

  /** Limit bonus (Physical, Mental, Social, or specific) */
  limitBonus?: number;

  /** Armor bonus */
  armorBonus?: number;

  /** Damage resistance bonus */
  damageResist?: number;

  /** Noise reduction (for signal equipment) */
  noiseReduction?: number;

  /** Dice pool modifier for specific tests */
  dicePoolModifier?: number;

  /** Allow extensibility for edition-specific effects */
  [key: string]: unknown;
}

/**
 * Complete ratings table mapping rating numbers to their values.
 * Keys are rating numbers (1, 2, 3, etc.) as strings for JSON compatibility.
 */
export type RatingTable = Record<number, RatingTableValue>;

/**
 * Configuration for items using the unified ratings table approach.
 * This is the preferred pattern for all rated items.
 */
export interface UnifiedRatingConfig {
  /** Whether this item has selectable ratings */
  hasRating: true;

  /** Minimum rating (defaults to 1) */
  minRating: number;

  /** Maximum rating */
  maxRating: number;

  /**
   * Explicit values for each rating level.
   * Keys are rating numbers (1, 2, 3, etc.).
   */
  ratings: RatingTable;

  /** Semantic type for display purposes */
  semanticType?: RatingSemanticType;
}

/**
 * Type guard to check if an item uses the unified ratings table approach.
 */
export function hasUnifiedRatings(item: unknown): item is UnifiedRatingConfig {
  return (
    typeof item === "object" &&
    item !== null &&
    "hasRating" in item &&
    (item as UnifiedRatingConfig).hasRating === true &&
    "ratings" in item &&
    typeof (item as UnifiedRatingConfig).ratings === "object"
  );
}

/**
 * Get the value for a specific rating from a unified ratings table.
 * Returns undefined if the rating is not valid for this item or if
 * the item doesn't have a unified ratings table.
 */
export function getRatingTableValue(
  item: Partial<UnifiedRatingConfig>,
  rating: number
): RatingTableValue | undefined {
  // Check if ratings table exists
  if (!item.ratings) {
    return undefined;
  }
  // Check bounds
  const minRating = item.minRating ?? 1;
  const maxRating = item.maxRating ?? 6;
  if (rating < minRating || rating > maxRating) {
    return undefined;
  }
  return item.ratings[rating];
}

/**
 * Get all available ratings for an item.
 * For unified ratings, returns the ratings that exist in the table.
 * For legacy items, returns range from minRating to maxRating.
 */
export function getAvailableRatings(item: Partial<UnifiedRatingConfig>): number[] {
  const minRating = item.minRating ?? 1;
  const maxRating = item.maxRating ?? 6;
  const ratings: number[] = [];

  // If unified ratings table exists, return ratings that are in the table
  if (item.ratings) {
    for (let r = minRating; r <= maxRating; r++) {
      if (item.ratings[r]) {
        ratings.push(r);
      }
    }
    return ratings;
  }

  // For legacy items, return range from minRating to maxRating
  if (item.hasRating) {
    for (let r = minRating; r <= maxRating; r++) {
      ratings.push(r);
    }
  }
  return ratings;
}

// =============================================================================
// LEGACY RATING CONFIGURATION (Formula-Based)
// =============================================================================

/**
 * Semantic type of rating for display and rule purposes
 */
export type RatingSemanticType =
  | "rating" // Standard equipment rating
  | "capacity" // Enhancement slot capacity
  | "deviceRating" // Matrix device rating
  | "force"; // Magical force rating

/**
 * Base configuration for any rated item in the catalog
 */
export interface RatingConfig {
  /** Whether this item has a selectable rating */
  hasRating: boolean;

  /** Semantic type of this rating (for display/rules) */
  semanticType?: RatingSemanticType;

  /** Minimum rating (defaults to 1) */
  minRating?: number;

  /** Maximum rating (required if hasRating is true) */
  maxRating: number;

  /** Default rating if not specified */
  defaultRating?: number;

  /** Whether rating must be whole numbers (default true) */
  integerOnly?: boolean;
}

/**
 * Scaling type for how values change with rating
 */
export type ScalingType =
  | "linear" // value = base × rating
  | "squared" // value = base × rating²
  | "flat" // value = base (no scaling)
  | "table" // value = lookup[rating] (for non-linear)
  | "formula"; // value = custom formula

/**
 * Configuration for how a value scales with rating
 */
export interface RatingScalingConfig {
  /** Base value before rating multiplier */
  baseValue: number;

  /** Whether value scales with rating */
  perRating: boolean;

  /** How the value scales (default: 'linear') */
  scalingType?: ScalingType;

  /** For 'table' scaling: rating -> value mapping */
  valueLookup?: Record<number, number>;

  /** For 'formula' scaling: formula string (future use) */
  formula?: string;

  /** Minimum value after scaling */
  minValue?: number;

  /** Maximum value after scaling */
  maxValue?: number;
}

/**
 * Complete rating specification for catalog items
 * Extend this interface for specific equipment types
 */
export interface CatalogItemRatingSpec {
  /** Rating configuration (if item supports ratings) */
  rating?: RatingConfig;

  /** How cost scales with rating */
  costScaling?: RatingScalingConfig;

  /** How availability scales with rating */
  availabilityScaling?: RatingScalingConfig;

  /** How essence scales with rating (cyberware/bioware) */
  essenceScaling?: RatingScalingConfig;

  /** How capacity provided scales with rating (containers) */
  capacityScaling?: RatingScalingConfig;

  /** How capacity cost scales with rating (enhancements) */
  capacityCostScaling?: RatingScalingConfig;

  /** How attribute bonuses scale with rating */
  attributeBonusScaling?: Record<string, RatingScalingConfig>;

  /** How karma cost scales with rating (foci bonding) */
  karmaScaling?: RatingScalingConfig;
}

// =============================================================================
// OWNED ITEM RATINGS (Character Items)
// =============================================================================

/**
 * Rating information for an owned/installed item
 */
export interface OwnedItemRating {
  /** Selected rating value */
  value: number;

  /** Calculated cost at this rating */
  calculatedCost: number;

  /** Calculated availability at this rating */
  calculatedAvailability: number;

  /** Calculated essence cost at this rating (if applicable) */
  calculatedEssence?: number;

  /** Calculated capacity at this rating (if applicable) */
  calculatedCapacity?: number;

  /** Calculated capacity cost at this rating (if applicable) */
  calculatedCapacityCost?: number;
}

/**
 * Result of rating calculation with all derived values
 */
export interface RatingCalculationResult {
  /** The rating value used for calculation */
  rating: number;

  /** Cost at this rating */
  cost: number;

  /** Availability at this rating */
  availability: number;

  /** Essence cost at this rating (cyberware/bioware) */
  essence?: number;

  /** Capacity provided at this rating (containers) */
  capacity?: number;

  /** Capacity cost at this rating (enhancements) */
  capacityCost?: number;

  /** Attribute bonuses at this rating */
  attributeBonuses?: Record<string, number>;

  /** Karma cost at this rating (foci bonding) */
  karmaCost?: number;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Result of rating validation
 */
export interface RatingValidationResult {
  valid: boolean;
  error?: string;
  suggestedValue?: number;
}

/**
 * Context for rating validation during character creation
 */
export interface RatingValidationContext {
  /** Maximum availability allowed (typically 12 at creation) */
  maxAvailability?: number;

  /** Maximum rating allowed for this item type */
  maxRatingOverride?: number;

  /** Whether forbidden items are allowed */
  allowForbidden?: boolean;

  /** Whether restricted items are allowed */
  allowRestricted?: boolean;
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

/**
 * Options for formatting rating for display
 */
export interface RatingDisplayOptions {
  /** Show the semantic type label (e.g., "Force 3" vs "Rating 3") */
  showLabel?: boolean;

  /** Show the range (e.g., "Rating 3 (1-6)") */
  showRange?: boolean;

  /** Show calculated cost */
  showCost?: boolean;

  /** Custom label override */
  customLabel?: string;
}
