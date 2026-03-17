/**
 * Life Modules Negative Quality Buy-Off
 *
 * Per Run Faster p.67, characters can spend remaining karma to buy off
 * negative qualities gained from life modules. The cost is the quality's
 * karmaBonus value (1x at creation).
 *
 * Pure functions — no side effects, no mutations.
 */

import type { LifeModuleQualityGrant } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";

// =============================================================================
// RESULT TYPES
// =============================================================================

/**
 * Breakdown of negative quality karma after buy-offs.
 */
export interface NegativeQualityKarmaBreakdown {
  /** Total karma from all module-granted negative qualities (before buy-offs) */
  readonly totalNegativeKarma: number;
  /** Karma spent buying off negative qualities */
  readonly boughtOffKarma: number;
  /** Effective negative quality karma (totalNegativeKarma - boughtOffKarma) */
  readonly effectiveNegativeKarma: number;
}

// =============================================================================
// FUNCTIONS
// =============================================================================

/**
 * Extract negative qualities from module grants, optionally excluding bought-off ones.
 *
 * @param grantedQualities - All quality grants from resolved life modules
 * @param boughtOffIds - Quality IDs already bought off (excluded from result)
 * @returns Only the negative quality grants, minus any bought-off ones
 */
export function getModuleGrantedNegativeQualities(
  grantedQualities: readonly LifeModuleQualityGrant[],
  boughtOffIds: readonly string[] = []
): readonly LifeModuleQualityGrant[] {
  const boughtOff = new Set(boughtOffIds);
  return grantedQualities.filter((q) => q.type === "negative" && !boughtOff.has(q.id));
}

/**
 * Calculate the karma cost to buy off a negative quality at creation.
 * Per Run Faster p.67, this is 1x the quality's karmaBonus (not 2x like post-creation).
 *
 * @param quality - The quality catalog entry
 * @returns Karma cost to buy off (0 if quality has no karmaBonus)
 */
export function calculateBuyOffCost(quality: QualityData): number {
  return quality.karmaBonus ?? 0;
}

/**
 * Calculate the effective negative quality karma after buy-offs.
 *
 * @param grantedQualities - All quality grants from resolved life modules
 * @param boughtOffIds - Quality IDs that have been bought off
 * @param qualityCatalog - Full quality catalog for karma lookups
 * @returns Breakdown of total, bought-off, and effective negative karma
 */
export function getEffectiveNegativeQualityKarma(
  grantedQualities: readonly LifeModuleQualityGrant[],
  boughtOffIds: readonly string[],
  qualityCatalog: readonly QualityData[]
): NegativeQualityKarmaBreakdown {
  const catalogMap = new Map(qualityCatalog.map((q) => [q.id, q]));
  const boughtOffSet = new Set(boughtOffIds);

  const negatives = grantedQualities.filter((q) => q.type === "negative");

  let totalNegativeKarma = 0;
  let boughtOffKarma = 0;

  for (const grant of negatives) {
    const catalogEntry = catalogMap.get(grant.id);
    if (!catalogEntry) continue;

    const karma = catalogEntry.karmaBonus ?? 0;
    totalNegativeKarma += karma;

    if (boughtOffSet.has(grant.id)) {
      boughtOffKarma += karma;
    }
  }

  return {
    totalNegativeKarma,
    boughtOffKarma,
    effectiveNegativeKarma: totalNegativeKarma - boughtOffKarma,
  };
}
