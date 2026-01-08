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
  RatingTable,
  RatingTableValue,
  UnifiedRatingConfig,
} from '../types/ratings';
import { hasUnifiedRatings, getRatingTableValue, getAvailableRatings } from '../types/ratings';

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

// =============================================================================
// UNIFIED RATINGS TABLE UTILITIES
// =============================================================================

// Re-export type guard and utilities from types for convenience
export { hasUnifiedRatings, getRatingTableValue, getAvailableRatings };

/**
 * Unified type for any rated item (supports both legacy and unified formats)
 */
export type RatedItem = {
  hasRating?: boolean;
  minRating?: number;
  maxRating?: number;
  ratings?: RatingTable;
  ratingSpec?: CatalogItemRatingSpec;
  // Base values for non-rated items
  cost?: number;
  availability?: number;
  essenceCost?: number;
  capacity?: number;
  capacityCost?: number;
};

/**
 * Get cost at a specific rating for any rated item
 * Works with both unified ratings tables and legacy ratingSpec
 */
export function getItemCostAtRating(item: RatedItem, rating: number): number {
  // Check for unified ratings table first (preferred)
  if (hasUnifiedRatings(item)) {
    const ratingValue = getRatingTableValue(item, rating);
    return ratingValue?.cost ?? 0;
  }

  // Fall back to legacy ratingSpec calculation
  if (item.ratingSpec?.costScaling) {
    return calculateRatedValue(item.ratingSpec.costScaling, rating);
  }

  // Fall back to base cost
  return item.cost ?? 0;
}

/**
 * Get essence cost at a specific rating for any rated item
 */
export function getItemEssenceAtRating(item: RatedItem, rating: number): number | undefined {
  // Check for unified ratings table first
  if (hasUnifiedRatings(item)) {
    const ratingValue = getRatingTableValue(item, rating);
    return ratingValue?.essenceCost;
  }

  // Fall back to legacy ratingSpec calculation
  if (item.ratingSpec?.essenceScaling) {
    return calculateRatedValue(item.ratingSpec.essenceScaling, rating);
  }

  // Fall back to base essence cost
  return item.essenceCost;
}

/**
 * Get availability at a specific rating for any rated item
 */
export function getItemAvailabilityAtRating(
  item: RatedItem,
  rating: number
): { value: number; suffix?: "R" | "F" } {
  // Check for unified ratings table first
  if (hasUnifiedRatings(item)) {
    const ratingValue = getRatingTableValue(item, rating);
    return {
      value: ratingValue?.availability ?? 0,
      suffix: ratingValue?.availabilitySuffix,
    };
  }

  // Fall back to legacy ratingSpec calculation
  if (item.ratingSpec?.availabilityScaling) {
    return {
      value: calculateRatedValue(item.ratingSpec.availabilityScaling, rating),
    };
  }

  // Fall back to base availability
  return { value: item.availability ?? 0 };
}

/**
 * Get capacity at a specific rating for any rated item
 */
export function getItemCapacityAtRating(item: RatedItem, rating: number): number | undefined {
  // Check for unified ratings table first
  if (hasUnifiedRatings(item)) {
    const ratingValue = getRatingTableValue(item, rating);
    return ratingValue?.capacity;
  }

  // Fall back to legacy ratingSpec calculation
  if (item.ratingSpec?.capacityScaling) {
    return calculateRatedValue(item.ratingSpec.capacityScaling, rating);
  }

  // Fall back to base capacity
  return item.capacity;
}

/**
 * Get capacity cost at a specific rating for any rated item
 */
export function getItemCapacityCostAtRating(item: RatedItem, rating: number): number | undefined {
  // Check for unified ratings table first
  if (hasUnifiedRatings(item)) {
    const ratingValue = getRatingTableValue(item, rating);
    return ratingValue?.capacityCost;
  }

  // Fall back to legacy ratingSpec calculation
  if (item.ratingSpec?.capacityCostScaling) {
    return calculateRatedValue(item.ratingSpec.capacityCostScaling, rating);
  }

  // Fall back to base capacity cost
  return item.capacityCost;
}

/**
 * Get power point cost at a specific rating (adept powers)
 */
export function getItemPowerPointCostAtRating(item: RatedItem & { powerPointCost?: number }, rating: number): number | undefined {
  // Check for unified ratings table first
  if (hasUnifiedRatings(item)) {
    const ratingValue = getRatingTableValue(item, rating);
    return ratingValue?.powerPointCost;
  }

  // Fall back to base power point cost
  return (item as { powerPointCost?: number }).powerPointCost;
}

/**
 * Get karma cost at a specific rating (qualities, foci)
 */
export function getItemKarmaCostAtRating(item: RatedItem, rating: number): number | undefined {
  // Check for unified ratings table first
  if (hasUnifiedRatings(item)) {
    const ratingValue = getRatingTableValue(item, rating);
    return ratingValue?.karmaCost;
  }

  // Fall back to legacy ratingSpec calculation
  if (item.ratingSpec?.karmaScaling) {
    return calculateRatedValue(item.ratingSpec.karmaScaling, rating);
  }

  return undefined;
}

/**
 * Check if a rating is valid for an item
 */
export function isRatingValid(item: RatedItem, rating: number): boolean {
  if (!item.hasRating) {
    return false;
  }

  const min = item.minRating ?? 1;
  const max = item.maxRating ?? 1;

  if (rating < min || rating > max) {
    return false;
  }

  // For unified tables, also check that the rating exists in the table
  if (item.ratings) {
    return item.ratings[rating] !== undefined;
  }

  return true;
}

/**
 * Get all rating values for a unified rated item
 */
export function getAllRatingValues(item: RatedItem): Array<{ rating: number; values: RatingTableValue }> {
  if (!hasUnifiedRatings(item)) {
    return [];
  }

  const ratings = getAvailableRatings(item);
  return ratings.map(rating => ({
    rating,
    values: getRatingTableValue(item, rating)!,
  }));
}

/**
 * Get complete calculation result for any rated item at a rating
 * Works with both unified and legacy formats
 */
export function getRatedItemValuesUnified(
  item: RatedItem,
  rating: number
): RatingCalculationResult {
  // For unified ratings, build result from table
  if (hasUnifiedRatings(item)) {
    const ratingValue = getRatingTableValue(item, rating);
    if (!ratingValue) {
      return { rating, cost: 0, availability: 0 };
    }

    return {
      rating,
      cost: ratingValue.cost,
      availability: ratingValue.availability,
      essence: ratingValue.essenceCost,
      capacity: ratingValue.capacity,
      capacityCost: ratingValue.capacityCost,
      karmaCost: ratingValue.karmaCost,
      attributeBonuses: ratingValue.effects?.attributeBonuses,
    };
  }

  // Fall back to legacy calculation
  if (item.ratingSpec) {
    return calculateRatedItemValues(item.ratingSpec, rating);
  }

  // Non-rated item
  return {
    rating,
    cost: item.cost ?? 0,
    availability: item.availability ?? 0,
    essence: item.essenceCost,
    capacity: item.capacity,
    capacityCost: item.capacityCost,
  };
}

/**
 * Get rating options with values for UI display
 * Works with both unified and legacy formats
 */
export function getRatingOptionsUnified(
  item: RatedItem,
  context?: RatingValidationContext
): Array<{
  rating: number;
  values: RatingCalculationResult;
  valid: boolean;
  error?: string;
}> {
  if (!item.hasRating) {
    return [];
  }

  const min = item.minRating ?? 1;
  const max = item.maxRating ?? 1;
  const options: Array<{
    rating: number;
    values: RatingCalculationResult;
    valid: boolean;
    error?: string;
  }> = [];

  for (let rating = min; rating <= max; rating++) {
    if (!isRatingValid(item, rating)) {
      continue;
    }

    const values = getRatedItemValuesUnified(item, rating);
    let valid = true;
    let error: string | undefined;

    // Check availability constraint
    if (context?.maxAvailability !== undefined && values.availability > context.maxAvailability) {
      valid = false;
      error = `Availability ${values.availability} exceeds maximum ${context.maxAvailability}`;
    }

    options.push({ rating, values, valid, error });
  }

  return options;
}

