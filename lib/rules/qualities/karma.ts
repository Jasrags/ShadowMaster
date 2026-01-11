/**
 * Karma accounting for qualities
 *
 * Functions for calculating karma costs and tracking karma spent/gained on qualities.
 */

import type { Character } from "@/lib/types";
import type { Quality, MergedRuleset } from "@/lib/types";
import { getQualityDefinition } from "./utils";

/**
 * Calculate the karma cost for a quality at a specific rating
 */
export function calculateQualityCost(
  quality: Quality,
  rating?: number,
  isPostCreation = false
): number {
  // For per-rating qualities with levels
  if (quality.levels && quality.levels.length > 0) {
    const levelData = rating ? quality.levels.find((l) => l.level === rating) : quality.levels[0];

    if (levelData) {
      const baseCost = Math.abs(levelData.karma);
      return isPostCreation ? baseCost * 2 : baseCost;
    }
  }

  // For per-rating qualities without explicit levels (scale by rating)
  if (rating && quality.maxRating) {
    const baseCost = quality.karmaCost || quality.karmaBonus || 0;
    const cost = Math.abs(baseCost) * rating;
    return isPostCreation ? cost * 2 : cost;
  }

  // Base cost for non-rating qualities
  const baseCost = quality.karmaCost || quality.karmaBonus || 0;
  return isPostCreation ? Math.abs(baseCost) * 2 : Math.abs(baseCost);
}

/**
 * Calculate total karma spent on positive qualities
 */
export function calculatePositiveQualityKarma(
  character: Character,
  ruleset?: MergedRuleset,
  isPostCreation = false
): number {
  if (!character.positiveQualities || character.positiveQualities.length === 0) {
    return 0;
  }

  if (!ruleset) {
    // Fallback: sum originalKarma values if available
    return character.positiveQualities.reduce((sum, q) => {
      return sum + (q.originalKarma || 0);
    }, 0);
  }

  // Calculate from quality definitions
  return character.positiveQualities.reduce((sum, selection) => {
    const qualityId = selection.qualityId || selection.id;
    if (!qualityId) return sum;

    const quality = getQualityDefinition(ruleset, qualityId);
    if (!quality) return sum;

    const cost = calculateQualityCost(quality, selection.rating, isPostCreation);
    return sum + cost;
  }, 0);
}

/**
 * Calculate total karma gained from negative qualities
 */
export function calculateNegativeQualityKarma(
  character: Character,
  ruleset?: MergedRuleset,
  isPostCreation = false
): number {
  if (!character.negativeQualities || character.negativeQualities.length === 0) {
    return 0;
  }

  if (!ruleset) {
    // Fallback: sum originalKarma values if available
    return character.negativeQualities.reduce((sum, q) => {
      return sum + Math.abs(q.originalKarma || 0);
    }, 0);
  }

  // Calculate from quality definitions
  return character.negativeQualities.reduce((sum, selection) => {
    const qualityId = selection.qualityId || selection.id;
    if (!qualityId) return sum;

    const quality = getQualityDefinition(ruleset, qualityId);
    if (!quality) return sum;

    const cost = calculateQualityCost(quality, selection.rating, isPostCreation);
    return sum + cost;
  }, 0);
}

/**
 * Calculate available karma for other purchases
 */
export function getAvailableKarma(
  character: Character,
  startingKarma: number,
  ruleset?: MergedRuleset
): number {
  const positiveSpent = calculatePositiveQualityKarma(character, ruleset);
  const negativeGained = calculateNegativeQualityKarma(character, ruleset);
  return startingKarma + negativeGained - positiveSpent;
}

/**
 * Validate karma limits for qualities (25 max for positive, 25 max for negative)
 */
export function validateKarmaLimits(
  character: Character,
  ruleset?: MergedRuleset
): {
  valid: boolean;
  positiveExceeded: boolean;
  negativeExceeded: boolean;
  positiveTotal: number;
  negativeTotal: number;
  errors: Array<{ message: string; field?: string }>;
} {
  const MAX_POSITIVE_KARMA = 25;
  const MAX_NEGATIVE_KARMA = 25;

  const positiveTotal = calculatePositiveQualityKarma(character, ruleset);
  const negativeTotal = calculateNegativeQualityKarma(character, ruleset);

  const positiveExceeded = positiveTotal > MAX_POSITIVE_KARMA;
  const negativeExceeded = negativeTotal > MAX_NEGATIVE_KARMA;

  const errors: Array<{ message: string; field?: string }> = [];

  if (positiveExceeded) {
    errors.push({
      message: `Positive qualities exceed ${MAX_POSITIVE_KARMA} Karma limit (${positiveTotal})`,
      field: "positiveQualities",
    });
  }

  if (negativeExceeded) {
    errors.push({
      message: `Negative qualities exceed ${MAX_NEGATIVE_KARMA} Karma bonus limit (${negativeTotal})`,
      field: "negativeQualities",
    });
  }

  return {
    valid: !positiveExceeded && !negativeExceeded,
    positiveExceeded,
    negativeExceeded,
    positiveTotal,
    negativeTotal,
    errors,
  };
}
