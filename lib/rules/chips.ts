/**
 * Chip Economy Mechanics (Run Faster pp. 177-178)
 *
 * Chips represent mutual obligations between characters and contacts.
 * When a character requests a favor, the contact gains chips (the character
 * owes them). When a character does work for a contact, the character gains chips.
 *
 * Key mechanics:
 * - Repayment costs 2× the chip value
 * - Debt timeframes decrease with larger amounts owed
 * - Chips can be spent for negotiation dice bonuses (+1 per chip, max +4)
 * - Chips can be spent to improve Loyalty (chips + downtime weeks = target level)
 * - Using a contact for a secondary service type counts as a favor (generates chips)
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import type { SocialContact, FavorServiceDefinition } from "../types/contacts";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum dice bonus from spending chips on a negotiation roll */
const MAX_CHIP_DICE_BONUS = 4;

/** Repayment multiplier — contacts demand 2× value when repaying debt */
const REPAYMENT_MULTIPLIER = 2;

/** Maximum loyalty rating in SR5 */
const MAX_LOYALTY = 6;

/**
 * Debt timeframe table (Run Faster p. 177)
 * Maps owed nuyen amount to weeks allowed for repayment.
 * Larger debts have shorter deadlines.
 */
const DEBT_TIMEFRAME_TABLE: ReadonlyArray<{ maxAmount: number; weeks: number }> = [
  { maxAmount: 100, weeks: 4 },
  { maxAmount: 1_000, weeks: 3 },
  { maxAmount: 10_000, weeks: 2 },
  { maxAmount: Infinity, weeks: 1 },
];

// =============================================================================
// CHIP GAIN/LOSS
// =============================================================================

/**
 * Calculate chip change from a favor interaction.
 *
 * When a character requests a favor, they owe chips (negative balance change).
 * When a character provides work, they gain chips (positive balance change).
 *
 * @param params.favorRating - The rating/weight of the favor
 * @param params.direction - Who is requesting the favor
 * @returns Change to the character's chip balance (negative = character owes)
 */
export function calculateChipGain(params: {
  favorRating: number;
  direction: "character-requests" | "character-provides";
}): number {
  const { favorRating, direction } = params;

  if (favorRating <= 0) {
    return 0;
  }

  return direction === "character-requests" ? -favorRating : favorRating;
}

// =============================================================================
// REPAYMENT COST (2× MULTIPLIER)
// =============================================================================

/**
 * Calculate the cost to repay chip debt.
 *
 * Contacts demand 2× the value when being repaid. This can be in chips
 * (doing work worth 2× the debt) or in cash (paying 2× market value).
 *
 * @param chipsOwed - Number of chips owed (absolute value used)
 * @param options.marketValuePerChip - If provided, returns nuyen cost instead of chip cost
 * @returns Repayment cost (in chips, or nuyen if marketValuePerChip provided)
 */
export function calculateRepaymentCost(
  chipsOwed: number,
  options?: { marketValuePerChip?: number }
): number {
  const absoluteOwed = Math.abs(chipsOwed);

  if (options?.marketValuePerChip !== undefined && options.marketValuePerChip > 0) {
    return absoluteOwed * options.marketValuePerChip * REPAYMENT_MULTIPLIER;
  }

  return absoluteOwed * REPAYMENT_MULTIPLIER;
}

// =============================================================================
// DEBT TIMEFRAMES
// =============================================================================

/**
 * Get the repayment deadline in weeks based on amount owed.
 *
 * Larger debts have shorter timeframes:
 * - ≤100¥: 4 weeks
 * - 101–1,000¥: 3 weeks
 * - 1,001–10,000¥: 2 weeks
 * - 10,001+¥: 1 week
 *
 * @param amountOwed - Nuyen amount owed
 * @returns Number of weeks to repay
 */
export function getDebtTimeframe(amountOwed: number): number {
  const amount = Math.abs(amountOwed);

  for (const tier of DEBT_TIMEFRAME_TABLE) {
    if (amount <= tier.maxAmount) {
      return tier.weeks;
    }
  }

  // Fallback (should not reach due to Infinity in table)
  return 1;
}

// =============================================================================
// CHIP DICE BONUS
// =============================================================================

/**
 * Calculate dice bonus from spending chips on a negotiation roll.
 *
 * Each chip spent grants +1 die, up to a maximum of +4.
 *
 * @param chipsSpent - Number of chips to spend
 * @returns Dice pool bonus (0 to MAX_CHIP_DICE_BONUS)
 */
export function calculateChipDiceBonus(chipsSpent: number): number {
  if (chipsSpent <= 0) {
    return 0;
  }

  return Math.min(chipsSpent, MAX_CHIP_DICE_BONUS);
}

// =============================================================================
// LOYALTY IMPROVEMENT VIA CHIPS
// =============================================================================

/**
 * Result of calculating loyalty improvement cost via chips
 */
export interface LoyaltyImprovementCost {
  /** Whether the improvement is valid */
  valid: boolean;
  /** Number of chips required */
  chipsRequired: number;
  /** Number of downtime weeks required */
  downtimeWeeks: number;
  /** Reason if invalid */
  reason?: string;
}

/**
 * Calculate the cost to improve a contact's Loyalty by one level via chips.
 *
 * Per Run Faster p. 177, loyalty is improved one level at a time.
 * Cost = target Loyalty level in both chips and downtime weeks.
 * For example, improving from Loyalty 3 → 4 costs 4 chips + 4 weeks of downtime.
 *
 * To improve multiple levels, call this function once per step.
 *
 * @param currentLoyalty - Current loyalty rating (minimum 1)
 * @param targetLoyalty - Desired loyalty rating (must be currentLoyalty + 1)
 * @returns Cost breakdown or validation error
 */
export function calculateLoyaltyImprovementCost(
  currentLoyalty: number,
  targetLoyalty: number
): LoyaltyImprovementCost {
  if (currentLoyalty < 1) {
    return {
      valid: false,
      chipsRequired: 0,
      downtimeWeeks: 0,
      reason: `Current loyalty (${currentLoyalty}) must be at least 1`,
    };
  }

  if (targetLoyalty <= currentLoyalty) {
    return {
      valid: false,
      chipsRequired: 0,
      downtimeWeeks: 0,
      reason: `Target loyalty (${targetLoyalty}) must be higher than current loyalty (${currentLoyalty})`,
    };
  }

  if (targetLoyalty !== currentLoyalty + 1) {
    return {
      valid: false,
      chipsRequired: 0,
      downtimeWeeks: 0,
      reason: `Loyalty can only be improved one level at a time (${currentLoyalty} → ${currentLoyalty + 1})`,
    };
  }

  if (targetLoyalty > MAX_LOYALTY) {
    return {
      valid: false,
      chipsRequired: 0,
      downtimeWeeks: 0,
      reason: `Target loyalty (${targetLoyalty}) exceeds maximum loyalty (${MAX_LOYALTY})`,
    };
  }

  return {
    valid: true,
    chipsRequired: targetLoyalty,
    downtimeWeeks: targetLoyalty,
  };
}

// =============================================================================
// SECONDARY SERVICE USE
// =============================================================================

/**
 * Determine if a service request is a "secondary use" for a contact.
 *
 * Using a contact for a service outside their primary archetype counts
 * as a personal favor and generates additional chips (debt).
 *
 * @param contact - The contact being asked
 * @param service - The service being requested
 * @returns True if this is a secondary (non-primary) service use
 */
export function isSecondaryServiceUse(
  contact: SocialContact,
  service: FavorServiceDefinition
): boolean {
  // No archetype restriction on service means it's always primary
  if (!service.archetypeIds || service.archetypeIds.length === 0) {
    return false;
  }

  // Check if the contact's archetype is in the service's archetype list
  if (!contact.archetypeId) {
    return true; // No archetype = always secondary
  }

  return !service.archetypeIds.includes(contact.archetypeId);
}
