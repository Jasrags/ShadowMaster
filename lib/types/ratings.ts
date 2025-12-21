/**
 * Equipment Rating System Types
 *
 * Provides unified type definitions for handling equipment ratings
 * across character creation and gameplay.
 */

// =============================================================================
// RATING CONFIGURATION (Catalog Items)
// =============================================================================

/**
 * Semantic type of rating for display and rule purposes
 */
export type RatingSemanticType =
  | 'rating'        // Standard equipment rating
  | 'capacity'      // Enhancement slot capacity
  | 'deviceRating'  // Matrix device rating
  | 'force';        // Magical force rating

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
  | 'linear'    // value = base × rating
  | 'squared'   // value = base × rating²
  | 'flat'      // value = base (no scaling)
  | 'table'     // value = lookup[rating] (for non-linear)
  | 'formula';  // value = custom formula

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

