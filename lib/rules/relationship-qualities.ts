/**
 * Relationship Quality Mechanics (Run Faster pp. 177-178)
 *
 * Relationship qualities modify how the chip economy and social mechanics
 * work for specific contacts.
 *
 * Blackmail (+2 Karma): Favors are free, requires Intimidation, contact
 * cannot leave. Loyalty represents leverage, not friendship.
 *
 * Family (+1 Karma): +1 Loyalty for tests, −1 chip to improve loyalty,
 * but −1 Loyalty for actual job performance (they worry about you).
 *
 * NOTE: This module is a standalone rules layer. The SocialContact type does
 * not yet have `relationshipQualities` or `loyaltyImprovementBlocked` fields.
 * Those will be added when the integration layer wires these rules to the
 * storage/API layer. Callers must manage persistence of returned flags
 * (e.g., IntimidationResult.loyaltyImprovementBlocked) in their own state
 * until the type extension lands.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

// =============================================================================
// TYPES
// =============================================================================

/** Relationship quality types from Run Faster */
export type RelationshipQuality = "blackmail" | "family";

/** Modifiers applied by the Blackmail relationship quality */
export interface BlackmailModifiers {
  /** Favors cost 0 chips (free) */
  favorChipCostOverride: number;
  /** Must use Intimidation for interactions */
  requiredSkill: string;
  /** Contact cannot voluntarily leave the relationship */
  contactCanLeave: boolean;
  /** Karma cost to acquire this quality */
  karmaCost: number;
}

/** Modifiers applied by the Family relationship quality */
export interface FamilyModifiers {
  /** Bonus to loyalty when rolling tests */
  loyaltyTestBonus: number;
  /** Discount on chips required to improve loyalty */
  loyaltyImprovementChipDiscount: number;
  /** Penalty to loyalty for actual job performance */
  jobPerformanceLoyaltyPenalty: number;
  /** Karma cost to acquire this quality */
  karmaCost: number;
}

/** Result of a social mechanic resolution */
export interface SocialMechanicResult {
  /** Whether the action succeeded */
  success: boolean;
  /** Change to loyalty */
  loyaltyChange: number;
  /** New loyalty value */
  newLoyalty: number;
  /** Whether the contact is lost (loyalty 0) */
  contactLost: boolean;
}

/** Result of an intimidation action */
export interface IntimidationResult {
  /** Change to loyalty (always -1) */
  loyaltyChange: number;
  /** New loyalty value (clamped to 0 minimum) */
  newLoyalty: number;
  /** Whether loyalty improvement is permanently blocked */
  loyaltyImprovementBlocked: boolean;
  /** Whether the contact is lost (loyalty 0) */
  contactLost: boolean;
}

/** Result of adjusting chip cost based on qualities */
export interface ChipCostAdjustment {
  /** The adjusted chip cost */
  adjustedCost: number;
  /** Explanation of the adjustment */
  reason: string;
}

/** Reputation-based loyalty improvement cost modifier */
export interface ReputationCostModifier {
  /** Extra karma required */
  extraKarma: number;
  /** Extra chips required (alternative to karma) */
  extraChips: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum loyalty rating in SR5 */
const MAX_LOYALTY = 6;

// =============================================================================
// QUALITY MODIFIERS
// =============================================================================

/**
 * Get the mechanical modifiers for the Blackmail relationship quality.
 *
 * Blackmail contacts provide free favors but require Intimidation
 * and cannot voluntarily leave the relationship.
 */
export function getBlackmailModifiers(): BlackmailModifiers {
  return {
    favorChipCostOverride: 0,
    requiredSkill: "intimidation",
    contactCanLeave: false,
    karmaCost: 2,
  };
}

/**
 * Get the mechanical modifiers for the Family relationship quality.
 *
 * Family contacts are more loyal in tests (+1) and cheaper to improve
 * (−1 chip), but perform worse on actual jobs (−1 Loyalty).
 */
export function getFamilyModifiers(): FamilyModifiers {
  return {
    loyaltyTestBonus: 1,
    loyaltyImprovementChipDiscount: 1,
    jobPerformanceLoyaltyPenalty: -1,
    karmaCost: 1,
  };
}

// =============================================================================
// EFFECTIVE LOYALTY
// =============================================================================

/**
 * Calculate effective loyalty for dice tests, applying quality bonuses.
 *
 * Family quality grants +1 to loyalty for all tests, capped at 6.
 *
 * @param baseLoyalty - Contact's base loyalty rating
 * @param qualities - Relationship qualities on the contact
 * @returns Effective loyalty for test purposes
 */
export function getEffectiveLoyaltyForTest(
  baseLoyalty: number,
  qualities: readonly RelationshipQuality[]
): number {
  let effective = baseLoyalty;

  if (qualities.includes("family")) {
    effective += 1;
  }

  return Math.min(effective, MAX_LOYALTY);
}

// =============================================================================
// CHIP COST MODIFIER
// =============================================================================

/**
 * Calculate adjusted chip cost based on relationship qualities.
 *
 * - Blackmail: favors are free (cost = 0)
 * - Family: −1 chip discount on loyalty improvement costs
 *
 * Blackmail takes priority if both are present.
 *
 * @param baseCost - Original chip cost
 * @param qualities - Relationship qualities on the contact
 * @returns Adjusted cost with explanation
 */
export function getChipCostModifier(
  baseCost: number,
  qualities: readonly RelationshipQuality[]
): ChipCostAdjustment {
  if (qualities.includes("blackmail")) {
    return {
      adjustedCost: 0,
      reason: "Favors are free due to blackmail leverage",
    };
  }

  if (qualities.includes("family")) {
    return {
      adjustedCost: Math.max(0, baseCost - 1),
      reason: "Family discount: −1 chip",
    };
  }

  return {
    adjustedCost: baseCost,
    reason: "No quality modifier",
  };
}

// =============================================================================
// REPUTATION MODIFIER
// =============================================================================

/**
 * Calculate extra loyalty improvement cost from bad reputation.
 *
 * When Notoriety exceeds Street Cred, improving Loyalty costs extra:
 * +1 Karma or +2 chips per 2 points of excess Notoriety.
 *
 * @param streetCred - Character's Street Cred
 * @param notoriety - Character's Notoriety
 * @returns Extra karma and chip costs
 */
export function calculateReputationLoyaltyCostModifier(
  streetCred: number,
  notoriety: number
): ReputationCostModifier {
  const excess = notoriety - streetCred;

  if (excess <= 0) {
    return { extraKarma: 0, extraChips: 0 };
  }

  // +1 karma or +2 chips per 2 points excess
  const increments = Math.floor(excess / 2);

  return {
    extraKarma: increments,
    extraChips: increments * 2,
  };
}

// =============================================================================
// SOCIAL MECHANICS
// =============================================================================

/**
 * Resolve an intimidation action against a contact.
 *
 * Intimidation immediately reduces Loyalty by 1 and permanently blocks
 * any future loyalty improvement for this contact.
 *
 * @param currentLoyalty - Contact's current loyalty (must be >= 1)
 * @returns Result with loyalty change and permanent block flag
 * @throws Error if currentLoyalty < 1
 */
export function resolveIntimidation(currentLoyalty: number): IntimidationResult {
  if (currentLoyalty < 1) {
    throw new Error(`resolveIntimidation: currentLoyalty must be >= 1, got ${currentLoyalty}`);
  }

  const newLoyalty = Math.max(0, currentLoyalty - 1);

  return {
    loyaltyChange: -1,
    newLoyalty,
    loyaltyImprovementBlocked: true,
    contactLost: newLoyalty <= 0,
  };
}

/**
 * Resolve a Con or Seduction opposed test during downtime.
 *
 * Success (character hits > contact hits) maintains current Loyalty.
 * Failure or tie reduces Loyalty by 1.
 *
 * @param currentLoyalty - Contact's current loyalty (must be >= 1)
 * @param characterHits - Hits from the character's roll (must be >= 0)
 * @param contactHits - Hits from the contact's opposing roll (must be >= 0)
 * @returns Result with success/failure and loyalty change
 * @throws Error if currentLoyalty < 1 or hits < 0
 */
export function resolveConSeduction(
  currentLoyalty: number,
  characterHits: number,
  contactHits: number
): SocialMechanicResult {
  if (currentLoyalty < 1) {
    throw new Error(`resolveConSeduction: currentLoyalty must be >= 1, got ${currentLoyalty}`);
  }
  if (characterHits < 0 || contactHits < 0) {
    throw new Error(
      `resolveConSeduction: hits must be >= 0, got character=${characterHits}, contact=${contactHits}`
    );
  }

  const success = characterHits > contactHits;

  if (success) {
    return {
      success: true,
      loyaltyChange: 0,
      newLoyalty: currentLoyalty,
      contactLost: false,
    };
  }

  const newLoyalty = Math.max(0, currentLoyalty - 1);

  return {
    success: false,
    loyaltyChange: -1,
    newLoyalty,
    contactLost: newLoyalty <= 0,
  };
}
