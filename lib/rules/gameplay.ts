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

// =============================================================================
// ARMOR CALCULATIONS (SR5 Core p.169-170)
// =============================================================================

/**
 * Result of armor calculation including encumbrance penalties
 */
export interface ArmorCalculationResult {
  /** Total armor value for damage resistance tests */
  totalArmor: number;
  /** Highest base armor piece rating */
  baseArmor: number;
  /** Total accessory bonus (before Strength cap) */
  rawAccessoryBonus: number;
  /** Accessory bonus after Strength cap */
  effectiveAccessoryBonus: number;
  /** Amount by which accessory bonus exceeds Strength (if any) */
  excessOverStrength: number;
  /** Agility penalty from encumbrance (-1 per 2 full points over Strength) */
  agilityPenalty: number;
  /** Reaction penalty from encumbrance (-1 per 2 full points over Strength) */
  reactionPenalty: number;
  /** Whether character is encumbered */
  isEncumbered: boolean;
  /** Base armor item name (for display) */
  baseArmorName?: string;
  /** Names of worn accessories */
  accessoryNames: string[];
}

/**
 * Minimal armor item interface for calculation
 */
interface ArmorItemInput {
  armorRating: number;
  armorModifier?: boolean;
  name?: string;
  state?: { readiness?: string };
  equipped?: boolean;
}

/**
 * Check if an armor item is currently worn
 */
function isArmorWorn(item: ArmorItemInput): boolean {
  // Check new state system first
  if (item.state?.readiness) {
    return item.state.readiness === 'worn';
  }
  // Fall back to legacy equipped field
  return item.equipped === true;
}

/**
 * Calculate total armor with SR5 stacking rules
 *
 * Rules (SR5 Core p.169-170):
 * - Only the highest base armor piece applies
 * - Armor accessories (armorModifier: true) add to the total
 * - Accessory bonus is capped at the character's Strength attribute
 * - For every 2 full points the accessory bonus exceeds Strength,
 *   the character suffers -1 to Agility and Reaction
 *
 * @param armorItems - Array of armor items (worn and stored)
 * @param strength - Character's Strength attribute
 * @returns Detailed armor calculation result
 */
export function calculateArmorTotal(
  armorItems: ArmorItemInput[],
  strength: number
): ArmorCalculationResult {
  // Filter to only worn armor
  const wornArmor = armorItems.filter(isArmorWorn);

  // Separate base armor from accessories
  const baseArmorPieces = wornArmor.filter(a => !a.armorModifier);
  const accessories = wornArmor.filter(a => a.armorModifier === true);

  // Find highest base armor
  let baseArmor = 0;
  let baseArmorName: string | undefined;
  for (const piece of baseArmorPieces) {
    if (piece.armorRating > baseArmor) {
      baseArmor = piece.armorRating;
      baseArmorName = piece.name;
    }
  }

  // Sum accessory bonuses
  const rawAccessoryBonus = accessories.reduce(
    (sum, acc) => sum + (acc.armorRating || 0),
    0
  );
  const accessoryNames = accessories
    .map(a => a.name)
    .filter((n): n is string => !!n);

  // Cap accessory bonus at Strength
  const effectiveAccessoryBonus = Math.min(rawAccessoryBonus, strength);

  // Calculate encumbrance
  const excessOverStrength = Math.max(0, rawAccessoryBonus - strength);
  const encumbrancePenalty = Math.floor(excessOverStrength / 2);

  return {
    totalArmor: baseArmor + effectiveAccessoryBonus,
    baseArmor,
    rawAccessoryBonus,
    effectiveAccessoryBonus,
    excessOverStrength,
    agilityPenalty: -encumbrancePenalty,
    reactionPenalty: -encumbrancePenalty,
    isEncumbered: encumbrancePenalty > 0,
    baseArmorName,
    accessoryNames,
  };
}

/**
 * Quick helper to get just the total armor value
 */
export function getTotalArmorValue(
  armorItems: ArmorItemInput[],
  strength: number
): number {
  return calculateArmorTotal(armorItems, strength).totalArmor;
}

// =============================================================================
// WOUND MODIFIERS
// =============================================================================

/**
 * Calculate wound modifier for a character
 * 
 * Base calculation: every 3 boxes = -1 modifier
 * Modified by qualities like High Pain Tolerance (boxes ignored)
 * and Low Pain Tolerance (interval change)
 * 
 * @param damage - Current damage boxes
 * @param boxesIgnored - Boxes ignored before penalties apply (from High Pain Tolerance, etc.)
 * @param penaltyInterval - Boxes per -1 modifier (default 3, modified by Low Pain Tolerance)
 * @returns Wound modifier (negative number, e.g., -2)
 */
export function calculateWoundModifier(
  damage: number,
  boxesIgnored: number = 0,
  penaltyInterval: number = 3
): number {
  const effectiveDamage = Math.max(0, damage - boxesIgnored);
  return -Math.floor(effectiveDamage / penaltyInterval);
}

