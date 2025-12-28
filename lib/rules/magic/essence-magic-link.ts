/**
 * Essence-Magic Link Service
 *
 * Handles the relationship between Essence loss and Magic rating degradation.
 * This is a read-only service - it calculates the impact but does not
 * modify character state directly.
 */

import type { Character } from "@/lib/types/character";
import type { EssenceMagicState } from "@/lib/types/magic";
import type { AugmentationRulesData, TraditionData } from "../loader-types";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default maximum essence for metahumans */
const DEFAULT_MAX_ESSENCE = 6.0;

/** Default Magic reduction formula */
const DEFAULT_REDUCTION_FORMULA: "roundUp" | "roundDown" | "exact" = "roundUp";

// =============================================================================
// CORE CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculate effective Magic rating based on essence loss
 *
 * Per SR5: Magic is reduced by 1 for each full point of Essence lost.
 * The reduction formula determines how partial points are handled.
 *
 * @param baseMagicRating - The character's base Magic rating
 * @param essenceLost - Total essence lost (e.g., from augmentations)
 * @param editionRules - Optional rules for the formula
 * @returns The effective Magic rating after essence loss
 */
export function calculateEffectiveMagic(
  baseMagicRating: number,
  essenceLost: number,
  editionRules?: AugmentationRulesData
): number {
  const formula = editionRules?.magicReductionFormula ?? DEFAULT_REDUCTION_FORMULA;

  let magicLoss: number;
  switch (formula) {
    case "roundUp":
      // Most punishing: any essence loss rounds up to a full point of Magic loss
      magicLoss = Math.ceil(essenceLost);
      break;
    case "roundDown":
      // More lenient: only full points of essence lost reduce Magic
      magicLoss = Math.floor(essenceLost);
      break;
    case "exact":
      // Precise tracking (some house rules)
      magicLoss = essenceLost;
      break;
    default:
      magicLoss = Math.ceil(essenceLost);
  }

  const effectiveMagic = Math.max(0, baseMagicRating - magicLoss);
  return effectiveMagic;
}

/**
 * Check if character can still use magic
 *
 * A character can use magic if:
 * - They have a magical path (not mundane or technomancer)
 * - Their effective Magic rating is > 0
 * - Their essence supports their tradition (if applicable)
 *
 * @param character - The character to check
 * @returns True if the character can use magic
 */
export function canStillUseMagic(character: Partial<Character>): boolean {
  // Check magical path
  const magicalPath = character.magicalPath;
  if (!magicalPath || magicalPath === "mundane" || magicalPath === "technomancer") {
    return false;
  }

  // Check Magic rating
  const magic = character.specialAttributes?.magic ?? 0;
  if (magic <= 0) {
    return false;
  }

  // Character can use magic
  return true;
}

/**
 * Check if character's current essence supports their tradition
 *
 * Some traditions or house rules may impose minimum essence requirements.
 * By default, any essence > 0 is sufficient.
 *
 * @param character - The character to check
 * @param tradition - The tradition to validate against
 * @returns True if essence supports the tradition
 */
export function validateEssenceForTradition(
  character: Partial<Character>,
  _tradition: TraditionData
): boolean {
  const currentEssence = character.specialAttributes?.essence ?? DEFAULT_MAX_ESSENCE;

  // Standard rule: essence must be > 0
  if (currentEssence <= 0) {
    return false;
  }

  // Note: Tradition-specific minimum essence requirements could be added
  // to TraditionData in the future. For now, only the > 0 check applies.

  return true;
}

// =============================================================================
// STATE CALCULATION
// =============================================================================

/**
 * Get the full essence-magic state for a character
 *
 * @param character - The character
 * @param editionRules - Optional augmentation rules
 * @returns Complete essence-magic state
 */
export function getEssenceMagicState(
  character: Partial<Character>,
  editionRules?: AugmentationRulesData
): EssenceMagicState {
  const baseEssence = DEFAULT_MAX_ESSENCE;
  const currentEssence = character.specialAttributes?.essence ?? baseEssence;
  const essenceLost = Math.max(0, baseEssence - currentEssence);

  // Essence hole tracks permanent essence loss beyond augmentation costs
  // This is currently not tracked separately in the character type
  const essenceHole = 0;

  const baseMagicRating = getBaseMagicRating(character);
  const magicLostToEssence = calculateMagicLoss(essenceLost, editionRules);
  const effectiveMagicRating = Math.max(0, baseMagicRating - magicLostToEssence);

  return {
    baseEssence,
    currentEssence,
    essenceLost,
    essenceHole,
    baseMagicRating,
    effectiveMagicRating,
    magicLostToEssence,
  };
}

/**
 * Preview impact of proposed augmentation on magic rating
 *
 * This allows the UI to show the player what will happen to their
 * Magic rating if they install a proposed augmentation.
 *
 * @param character - The current character state
 * @param proposedEssenceCost - The essence cost of the proposed augmentation
 * @param editionRules - Optional augmentation rules
 * @returns Projected essence-magic state after the augmentation
 */
export function previewAugmentationMagicImpact(
  character: Partial<Character>,
  proposedEssenceCost: number,
  editionRules?: AugmentationRulesData
): EssenceMagicState {
  const baseEssence = DEFAULT_MAX_ESSENCE;
  const currentEssence = character.specialAttributes?.essence ?? baseEssence;
  const projectedEssence = Math.max(0, currentEssence - proposedEssenceCost);
  const projectedEssenceLost = baseEssence - projectedEssence;

  const baseMagicRating = getBaseMagicRating(character);
  const projectedMagicLoss = calculateMagicLoss(projectedEssenceLost, editionRules);
  const projectedEffectiveMagic = Math.max(0, baseMagicRating - projectedMagicLoss);

  return {
    baseEssence,
    currentEssence: projectedEssence,
    essenceLost: projectedEssenceLost,
    essenceHole: 0,
    baseMagicRating,
    effectiveMagicRating: projectedEffectiveMagic,
    magicLostToEssence: projectedMagicLoss,
  };
}

// =============================================================================
// AUGMENTATION VALIDATION
// =============================================================================

/**
 * Validation result for proposed augmentation
 */
export interface AugmentationMagicValidation {
  /** Whether the augmentation is advisable */
  advisable: boolean;

  /** Warnings for the player to consider */
  warnings: string[];

  /** Current Magic rating */
  currentMagic: number;

  /** Projected Magic rating after augmentation */
  projectedMagic: number;

  /** Magic rating lost due to this augmentation */
  magicLost: number;

  /** Whether this would burn out (lose all magic) */
  wouldBurnOut: boolean;
}

/**
 * Validate proposed augmentation's impact on magic
 *
 * Returns warnings and projections to help the player make an informed decision.
 *
 * @param character - The character
 * @param proposedEssenceCost - The essence cost of the proposed augmentation
 * @param editionRules - Optional augmentation rules
 * @returns Validation result with warnings and projections
 */
export function validateAugmentationForMagic(
  character: Partial<Character>,
  proposedEssenceCost: number,
  editionRules?: AugmentationRulesData
): AugmentationMagicValidation {
  const currentState = getEssenceMagicState(character, editionRules);
  const projectedState = previewAugmentationMagicImpact(
    character,
    proposedEssenceCost,
    editionRules
  );

  const warnings: string[] = [];
  const wouldBurnOut = projectedState.effectiveMagicRating === 0;
  const magicLost = currentState.effectiveMagicRating - projectedState.effectiveMagicRating;

  // Generate warnings
  if (wouldBurnOut) {
    warnings.push(
      "This augmentation would reduce your Magic to 0, permanently burning out your magical abilities."
    );
  } else if (magicLost > 0) {
    warnings.push(
      `This augmentation would reduce your Magic rating by ${magicLost} (from ${currentState.effectiveMagicRating} to ${projectedState.effectiveMagicRating}).`
    );
  }

  if (projectedState.currentEssence <= 1) {
    warnings.push(
      "Warning: Your essence would drop to 1 or below, leaving minimal room for future augmentations."
    );
  }

  const advisable = !wouldBurnOut && magicLost <= 1;

  return {
    advisable,
    warnings,
    currentMagic: currentState.effectiveMagicRating,
    projectedMagic: projectedState.effectiveMagicRating,
    magicLost,
    wouldBurnOut,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the base Magic rating for a character
 * This is the rating before essence-based reductions
 */
function getBaseMagicRating(character: Partial<Character>): number {
  // In a full implementation, this would track the character's
  // "purchased" Magic rating separately from reductions.
  // For now, we use the current value as the base.
  return character.specialAttributes?.magic ?? 0;
}

/**
 * Calculate Magic loss based on essence lost
 */
function calculateMagicLoss(
  essenceLost: number,
  editionRules?: AugmentationRulesData
): number {
  const formula = editionRules?.magicReductionFormula ?? DEFAULT_REDUCTION_FORMULA;

  switch (formula) {
    case "roundUp":
      return Math.ceil(essenceLost);
    case "roundDown":
      return Math.floor(essenceLost);
    case "exact":
      return essenceLost;
    default:
      return Math.ceil(essenceLost);
  }
}

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Format essence-magic state for display
 */
export function formatEssenceMagicState(state: EssenceMagicState): string {
  const essenceStr = state.currentEssence.toFixed(2);
  const magicStr =
    state.effectiveMagicRating !== state.baseMagicRating
      ? `${state.effectiveMagicRating} (base ${state.baseMagicRating})`
      : `${state.effectiveMagicRating}`;

  return `Essence: ${essenceStr} | Magic: ${magicStr}`;
}

/**
 * Get a summary of magic degradation
 */
export function getMagicDegradationSummary(
  character: Partial<Character>,
  editionRules?: AugmentationRulesData
): string {
  const state = getEssenceMagicState(character, editionRules);

  if (state.magicLostToEssence === 0) {
    return "No magic degradation from essence loss.";
  }

  return `Magic degraded by ${state.magicLostToEssence} due to ${state.essenceLost.toFixed(2)} essence lost.`;
}
