/**
 * Equipment Rating Calculator Utilities
 *
 * Centralized functions for calculating rating-dependent values
 * for equipment across the application.
 */

import type {
  RatingConfig,
  RatingScalingConfig,
  CatalogItemRatingSpec,
  RatingCalculationResult,
  RatingValidationResult,
  RatingValidationContext,
  RatingDisplayOptions,
  RatingSemanticType,
} from '../types/ratings';

// =============================================================================
// CORE CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculate a scaled value based on rating
 */
export function calculateRatedValue(
  scaling: RatingScalingConfig,
  rating: number
): number {
  // If not scaling with rating, return base value
  if (!scaling.perRating) {
    return scaling.baseValue;
  }

  let value: number;

  switch (scaling.scalingType) {
    case 'squared':
      value = scaling.baseValue * rating * rating;
      break;

    case 'flat':
      value = scaling.baseValue;
      break;

    case 'table':
      if (scaling.valueLookup && scaling.valueLookup[rating] !== undefined) {
        value = scaling.valueLookup[rating];
      } else {
        // Fallback to linear if rating not in table
        value = scaling.baseValue * rating;
      }
      break;

    case 'formula':
      // Future: implement formula parser
      // For now, fall through to linear
      value = scaling.baseValue * rating;
      break;

    case 'linear':
    default:
      value = scaling.baseValue * rating;
      break;
  }

  // Apply min/max bounds
  if (scaling.minValue !== undefined && value < scaling.minValue) {
    value = scaling.minValue;
  }
  if (scaling.maxValue !== undefined && value > scaling.maxValue) {
    value = scaling.maxValue;
  }

  return value;
}

/**
 * Calculate all derived values for a rated item at a specific rating
 */
export function calculateRatedItemValues(
  spec: CatalogItemRatingSpec,
  rating: number
): RatingCalculationResult {
  const result: RatingCalculationResult = {
    rating,
    cost: 0,
    availability: 0,
  };

  // Calculate cost
  if (spec.costScaling) {
    result.cost = calculateRatedValue(spec.costScaling, rating);
  }

  // Calculate availability
  if (spec.availabilityScaling) {
    result.availability = calculateRatedValue(spec.availabilityScaling, rating);
  }

  // Calculate essence (cyberware/bioware)
  if (spec.essenceScaling) {
    result.essence = calculateRatedValue(spec.essenceScaling, rating);
  }

  // Calculate capacity provided (containers like cybereyes)
  if (spec.capacityScaling) {
    result.capacity = calculateRatedValue(spec.capacityScaling, rating);
  }

  // Calculate capacity cost (enhancements)
  if (spec.capacityCostScaling) {
    result.capacityCost = calculateRatedValue(spec.capacityCostScaling, rating);
  }

  // Calculate attribute bonuses
  if (spec.attributeBonusScaling) {
    result.attributeBonuses = {};
    for (const [attr, scaling] of Object.entries(spec.attributeBonusScaling)) {
      result.attributeBonuses[attr] = calculateRatedValue(scaling, rating);
    }
  }

  // Calculate karma cost (foci bonding)
  if (spec.karmaScaling) {
    result.karmaCost = calculateRatedValue(spec.karmaScaling, rating);
  }

  return result;
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate that a rating is within allowed range
 */
export function validateRating(
  rating: number,
  ratingConfig: RatingConfig,
  context?: RatingValidationContext
): RatingValidationResult {
  // Check if item supports ratings
  if (!ratingConfig.hasRating) {
    return {
      valid: false,
      error: 'Item does not support ratings',
    };
  }

  const min = ratingConfig.minRating ?? 1;
  const max = context?.maxRatingOverride ?? ratingConfig.maxRating;

  // Check minimum
  if (rating < min) {
    return {
      valid: false,
      error: `Rating must be at least ${min}`,
      suggestedValue: min,
    };
  }

  // Check maximum
  if (rating > max) {
    return {
      valid: false,
      error: `Rating cannot exceed ${max}`,
      suggestedValue: max,
    };
  }

  // Check integer constraint
  if (ratingConfig.integerOnly !== false && !Number.isInteger(rating)) {
    return {
      valid: false,
      error: 'Rating must be a whole number',
      suggestedValue: Math.round(rating),
    };
  }

  return { valid: true };
}

/**
 * Validate rating against availability constraints (character creation)
 */
export function validateRatingAvailability(
  spec: CatalogItemRatingSpec,
  rating: number,
  context: RatingValidationContext
): RatingValidationResult {
  if (!spec.availabilityScaling || context.maxAvailability === undefined) {
    return { valid: true };
  }

  const availability = calculateRatedValue(spec.availabilityScaling, rating);

  if (availability > context.maxAvailability) {
    // Find the maximum rating that meets availability constraint
    let suggestedRating = rating;

    for (let r = rating - 1; r >= (spec.rating?.minRating ?? 1); r--) {
      const avail = calculateRatedValue(spec.availabilityScaling, r);
      if (avail <= context.maxAvailability) {
        suggestedRating = r;
        break;
      }
    }

    return {
      valid: false,
      error: `Rating ${rating} has availability ${availability}, which exceeds maximum ${context.maxAvailability}`,
      suggestedValue: suggestedRating,
    };
  }

  return { valid: true };
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

/**
 * Get the display label for a rating semantic type
 */
export function getRatingLabel(semanticType?: RatingSemanticType): string {
  switch (semanticType) {
    case 'force':
      return 'Force';
    case 'deviceRating':
      return 'Device Rating';
    case 'capacity':
      return 'Capacity';
    case 'rating':
    default:
      return 'Rating';
  }
}

/**
 * Format a rating value for display
 */
export function formatRating(
  rating: number,
  config?: RatingConfig,
  options?: RatingDisplayOptions
): string {
  const label = options?.customLabel ?? getRatingLabel(config?.semanticType);

  let result = '';

  if (options?.showLabel !== false) {
    result = `${label} ${rating}`;
  } else {
    result = String(rating);
  }

  if (options?.showRange && config) {
    const min = config.minRating ?? 1;
    const max = config.maxRating;
    result += ` (${min}-${max})`;
  }

  return result;
}

/**
 * Format rating with cost for selection UI
 */
export function formatRatingWithCost(
  rating: number,
  spec: CatalogItemRatingSpec,
  options?: { showAvailability?: boolean }
): string {
  const values = calculateRatedItemValues(spec, rating);
  const label = getRatingLabel(spec.rating?.semanticType);

  let result = `${label} ${rating}: ${values.cost.toLocaleString()}¥`;

  if (options?.showAvailability) {
    result += ` (Avail ${values.availability})`;
  }

  return result;
}

// =============================================================================
// CONVERSION HELPERS (for migration)
// =============================================================================

/**
 * Convert legacy flat rating properties to CatalogItemRatingSpec
 * Used for migrating existing data format
 */
export function convertLegacyRatingSpec(legacy: {
  hasRating?: boolean;
  maxRating?: number;
  minRating?: number;
  cost?: number;
  costPerRating?: boolean;
  availability?: number;
  availabilityPerRating?: boolean;
  essenceCost?: number;
  essencePerRating?: boolean;
  capacityCost?: number;
  capacityPerRating?: boolean;
}): CatalogItemRatingSpec {
  const spec: CatalogItemRatingSpec = {};

  // Rating config
  if (legacy.hasRating) {
    spec.rating = {
      hasRating: true,
      minRating: legacy.minRating ?? 1,
      maxRating: legacy.maxRating ?? 6,
    };
  }

  // Cost scaling
  if (legacy.cost !== undefined) {
    spec.costScaling = {
      baseValue: legacy.cost,
      perRating: legacy.costPerRating ?? false,
    };
  }

  // Availability scaling
  if (legacy.availability !== undefined) {
    spec.availabilityScaling = {
      baseValue: legacy.availability,
      perRating: legacy.availabilityPerRating ?? false,
    };
  }

  // Essence scaling
  if (legacy.essenceCost !== undefined) {
    spec.essenceScaling = {
      baseValue: legacy.essenceCost,
      perRating: legacy.essencePerRating ?? false,
    };
  }

  // Capacity cost scaling
  if (legacy.capacityCost !== undefined) {
    spec.capacityCostScaling = {
      baseValue: legacy.capacityCost,
      perRating: legacy.capacityPerRating ?? false,
    };
  }

  return spec;
}

// =============================================================================
// RANGE HELPERS
// =============================================================================

/**
 * Get array of valid rating values for an item
 */
export function getRatingRange(config: RatingConfig): number[] {
  const min = config.minRating ?? 1;
  const max = config.maxRating;
  const range: number[] = [];

  for (let r = min; r <= max; r++) {
    range.push(r);
  }

  return range;
}

/**
 * Get rating options with calculated values for UI selection
 */
export function getRatingOptions(
  spec: CatalogItemRatingSpec,
  context?: RatingValidationContext
): Array<{
  rating: number;
  values: RatingCalculationResult;
  valid: boolean;
  error?: string;
}> {
  if (!spec.rating?.hasRating) {
    return [];
  }

  const range = getRatingRange(spec.rating);

  return range.map(rating => {
    const values = calculateRatedItemValues(spec, rating);
    const validation = validateRatingAvailability(spec, rating, context ?? {});

    return {
      rating,
      values,
      valid: validation.valid,
      error: validation.error,
    };
  });
}

