/**
 * Gameplay Rating Utilities
 *
 * Functions for calculating effective ratings and rating-based gameplay effects
 * during actual play (as opposed to character creation).
 */

// =============================================================================
// EFFECTIVE RATING CALCULATIONS
// =============================================================================

/**
 * Parse wireless bonus from description string
 * Common patterns: "+Rating", "+X" (where X is a number), "+Rating to Y"
 * This is a basic parser - more complex bonuses may need item-specific handling
 */
function parseWirelessBonus(bonusDescription: string): number {
  // Common pattern: "+Rating" or "+Rating to Perception"
  if (bonusDescription.toLowerCase().includes('+rating')) {
    // Assume +Rating means +1 per rating (or could be item-specific)
    // For now, return 1 as a placeholder - this would need item context
    return 1;
  }

  // Pattern: "+X" where X is a number
  const numericMatch = bonusDescription.match(/\+\s*(\d+)/);
  if (numericMatch) {
    return parseInt(numericMatch[1], 10);
  }

  // Default: no numeric bonus parsed
  return 0;
}

/**
 * Context for calculating effective rating during gameplay
 */
export interface EffectiveRatingContext {
  /** Whether wireless is enabled for this item */
  wirelessEnabled?: boolean;

  /** Matrix damage the item has taken (reduces rating) */
  matrixDamage?: number;

  /** Environmental modifier (e.g., signal interference, -1 to +1) */
  environmentalModifier?: number;

  /** Custom wireless bonus value (if known, overrides parsing) */
  wirelessBonusValue?: number;
}

/**
 * Calculate effective rating for an item during gameplay
 * Considers wireless bonuses, damage, environmental factors
 */
export function getEffectiveRating(
  item: { rating?: number; wirelessBonus?: string },
  context: EffectiveRatingContext = {}
): number {
  let rating = item.rating ?? 0;

  // Apply wireless bonus if enabled and applicable
  if (context.wirelessEnabled && item.wirelessBonus) {
    const bonus = context.wirelessBonusValue ?? parseWirelessBonus(item.wirelessBonus);
    rating += bonus;
  }

  // Reduce rating if item has Matrix damage (optional rule)
  if (context.matrixDamage && context.matrixDamage > 0) {
    rating = Math.max(0, rating - Math.floor(context.matrixDamage / 3));
  }

  // Apply environmental modifiers
  if (context.environmentalModifier) {
    rating = Math.max(0, rating + context.environmentalModifier);
  }

  return Math.max(0, rating); // Ensure rating never goes below 0
}

// =============================================================================
// DICE POOL BONUSES
// =============================================================================

/**
 * Type of dice pool bonus from rated equipment
 */
export type RatingBonusType =
  | 'perception'  // Perception dice pools
  | 'defense'     // Defense dice pools
  | 'attack'      // Attack dice pools
  | 'limit';      // Limit bonuses

/**
 * Get dice pool bonus from rated equipment
 * Most rated equipment adds its rating to relevant dice pools
 * @param _bonusType Reserved for future item-specific bonus formulas
 */
export function getRatingDiceBonus(
  item: { rating?: number },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _bonusType: RatingBonusType
): number {
  const rating = item.rating ?? 0;

  // Most rated equipment adds its rating to relevant dice pools
  // Specific items may have different formulas (could be extended with item-specific rules)
  // For example, Vision Enhancement adds to Perception, Smartgun adds to Attack, etc.
  // bonusType parameter reserved for future item-specific bonus formulas
  return rating;
}

/**
 * Get dice pool bonus with item-specific handling
 * Extend this function for items with special bonus formulas
 */
export function getItemDiceBonus(
  item: { rating?: number; name?: string; wirelessBonus?: string },
  bonusType: RatingBonusType,
  context?: EffectiveRatingContext
): number {
  // Use effective rating if context provided
  const rating = context
    ? getEffectiveRating(item, context)
    : item.rating ?? 0;

  // Item-specific handling could go here
  // For now, use generic rating bonus
  return getRatingDiceBonus({ rating }, bonusType);
}

// =============================================================================
// TEST THRESHOLDS
// =============================================================================

/**
 * Type of test threshold
 */
export type TestThresholdType =
  | 'detect'   // Detection tests (threshold = rating)
  | 'analyze'  // Analysis/extended tests (threshold = rating × 2)
  | 'bypass';  // Bypass tests (threshold = rating + 2)

/**
 * Calculate test threshold based on item rating
 * Used for detection tests, hacking attempts, etc.
 */
export function getRatingThreshold(
  item: { rating?: number },
  testType: TestThresholdType
): number {
  const rating = item.rating ?? 0;

  switch (testType) {
    case 'detect':
      // Threshold equals rating for detection tests
      return rating;

    case 'analyze':
      // Extended test, rating × 2 hits needed
      return rating * 2;

    case 'bypass':
      // Rating + 2 to bypass
      return rating + 2;

    default:
      return rating;
  }
}

/**
 * Calculate test threshold using effective rating
 */
export function getEffectiveThreshold(
  item: { rating?: number; wirelessBonus?: string },
  testType: TestThresholdType,
  context?: EffectiveRatingContext
): number {
  const effectiveRating = getEffectiveRating(item, context);
  return getRatingThreshold({ rating: effectiveRating }, testType);
}

// =============================================================================
// CONVENIENCE HELPERS
// =============================================================================

/**
 * Get perception bonus from vision/audio enhancements
 */
export function getPerceptionBonus(
  item: { rating?: number; wirelessBonus?: string; name?: string },
  context?: EffectiveRatingContext
): number {
  return getItemDiceBonus(item, 'perception', context);
}

/**
 * Get defense bonus from equipment
 */
export function getDefenseBonus(
  item: { rating?: number; wirelessBonus?: string },
  context?: EffectiveRatingContext
): number {
  return getItemDiceBonus(item, 'defense', context);
}

/**
 * Get attack bonus from smartgun/smartlink
 */
export function getAttackBonus(
  item: { rating?: number; wirelessBonus?: string },
  context?: EffectiveRatingContext
): number {
  return getItemDiceBonus(item, 'attack', context);
}

