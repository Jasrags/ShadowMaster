/**
 * Essence Hole Management
 *
 * Tracks the "essence hole" for characters with magical or resonance paths.
 * When a magic user installs augmentations and loses Magic, that Magic loss
 * becomes permanent even if the augmentations are later removed.
 *
 * @satisfies Requirement: Essence hole mechanism for characters with magical or resonance paths
 * @satisfies Guarantee #2: Permanent link between Essence loss and Magic/Resonance reduction
 */

import type { Character, EssenceHole } from "@/lib/types/character";
import type { AugmentationRules } from "@/lib/types/edition";
import type { MagicalPath } from "@/lib/types/core";
import { roundEssence, MAX_ESSENCE } from "./essence";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Magical paths that are affected by essence holes */
const AFFECTED_MAGICAL_PATHS: MagicalPath[] = [
  "full-mage",
  "aspected-mage",
  "mystic-adept",
  "adept",
  "technomancer",
];

/** Default magic reduction formula (SR5 standard) */
const DEFAULT_MAGIC_REDUCTION_FORMULA: "roundUp" | "roundDown" | "exact" = "roundUp";

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * Result of updating essence hole state
 */
export interface EssenceHoleUpdateResult {
  /** Updated essence hole state */
  essenceHole: EssenceHole;
  /** Whether magic/resonance was permanently lost */
  hadPermanentLoss: boolean;
  /** Amount of additional magic/resonance lost (if any) */
  additionalMagicLost: number;
}

/**
 * Summary of a character's essence-magic state
 */
export interface EssenceMagicSummary {
  /** Current essence value */
  currentEssence: number;
  /** Total essence lost to augmentations */
  totalEssenceLoss: number;
  /** Peak essence ever lost (for hole calculation) */
  peakEssenceLoss: number;
  /** Current essence hole (magic lost permanently) */
  essenceHole: number;
  /** Base magic/resonance before any reductions */
  baseMagic: number;
  /** Effective magic/resonance after essence-based reduction */
  effectiveMagic: number;
  /** Whether this character tracks essence holes */
  tracksEssenceHole: boolean;
}

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Determine if a character should track essence holes
 * Only characters with magical or resonance abilities are affected
 *
 * @param character - The character to check
 * @returns True if the character should track essence holes
 */
export function shouldTrackEssenceHole(character: Partial<Character>): boolean {
  const magicalPath = character.magicalPath;

  if (!magicalPath) {
    return false;
  }

  return AFFECTED_MAGICAL_PATHS.includes(magicalPath);
}

/**
 * Calculate the essence hole value
 * The hole is the difference between peak essence loss and current loss
 *
 * @param peakLoss - The highest essence loss ever recorded
 * @param currentLoss - The current essence loss
 * @returns The essence hole value
 */
export function calculateEssenceHole(peakLoss: number, currentLoss: number): number {
  // The hole is how much essence was recovered after peak loss
  // This represents the "scar" in the character's metaphysical being
  const hole = Math.max(0, peakLoss - currentLoss);
  return roundEssence(hole);
}

/**
 * Calculate Magic/Resonance loss from essence based on edition formula
 *
 * @param essenceLost - Total essence lost (including hole)
 * @param formula - The reduction formula to use
 * @returns Magic points lost
 */
export function calculateMagicLoss(
  essenceLost: number,
  formula: "roundUp" | "roundDown" | "exact" = DEFAULT_MAGIC_REDUCTION_FORMULA
): number {
  switch (formula) {
    case "roundUp":
      // SR5 standard: Any essence loss rounds up to magic loss
      return Math.ceil(essenceLost);
    case "roundDown":
      // More lenient: Only full points of essence reduce magic
      return Math.floor(essenceLost);
    case "exact":
      // Precise tracking (some house rules, typically not used)
      return essenceLost;
    default:
      return Math.ceil(essenceLost);
  }
}

/**
 * Get the effective essence loss for magic reduction
 * This is the HIGHER of current loss or the essence hole
 *
 * @param currentLoss - Current essence lost to augmentations
 * @param essenceHole - The permanent essence hole
 * @returns The effective loss for magic calculation
 */
export function getEffectiveEssenceLoss(currentLoss: number, essenceHole: number): number {
  // The hole represents the peak loss that determined magic reduction
  // So effective loss for magic is always at least as high as the hole ever was
  // This is calculated as: current loss + hole (which equals peak loss)
  return roundEssence(currentLoss + essenceHole);
}

// =============================================================================
// ESSENCE HOLE STATE MANAGEMENT
// =============================================================================

/**
 * Create a new essence hole tracking state
 *
 * @param initialEssenceLoss - Initial essence loss (default: 0)
 * @param formula - Magic reduction formula
 * @returns New EssenceHole state
 */
export function createEssenceHole(
  initialEssenceLoss: number = 0,
  formula: "roundUp" | "roundDown" | "exact" = DEFAULT_MAGIC_REDUCTION_FORMULA
): EssenceHole {
  const loss = roundEssence(initialEssenceLoss);
  return {
    peakEssenceLoss: loss,
    currentEssenceLoss: loss,
    essenceHole: 0,
    magicLost: calculateMagicLoss(loss, formula),
  };
}

/**
 * Update essence hole state when augmentation is installed
 *
 * @param current - Current essence hole state (or undefined for new tracking)
 * @param newEssenceLoss - The essence cost of the new augmentation
 * @param formula - Magic reduction formula
 * @returns Updated essence hole state with change details
 */
export function updateEssenceHoleOnInstall(
  current: EssenceHole | undefined,
  newEssenceLoss: number,
  formula: "roundUp" | "roundDown" | "exact" = DEFAULT_MAGIC_REDUCTION_FORMULA
): EssenceHoleUpdateResult {
  // If no existing state, create new one
  if (!current) {
    const essenceHole = createEssenceHole(newEssenceLoss, formula);
    return {
      essenceHole,
      hadPermanentLoss: essenceHole.magicLost > 0,
      additionalMagicLost: essenceHole.magicLost,
    };
  }

  // Calculate new total essence loss
  const newCurrentLoss = roundEssence(current.currentEssenceLoss + newEssenceLoss);

  // Peak loss is always the higher of previous peak or new total
  const newPeakLoss = roundEssence(Math.max(current.peakEssenceLoss, newCurrentLoss));

  // Essence hole is the difference (essence that was recovered but still "counts")
  const newHole = calculateEssenceHole(newPeakLoss, newCurrentLoss);

  // Calculate magic loss based on peak (which includes the hole)
  const previousMagicLost = current.magicLost;
  const newMagicLost = calculateMagicLoss(newPeakLoss, formula);
  const additionalMagicLost = Math.max(0, newMagicLost - previousMagicLost);

  return {
    essenceHole: {
      peakEssenceLoss: newPeakLoss,
      currentEssenceLoss: newCurrentLoss,
      essenceHole: newHole,
      magicLost: newMagicLost,
    },
    hadPermanentLoss: additionalMagicLost > 0,
    additionalMagicLost,
  };
}

/**
 * Update essence hole state when augmentation is removed
 *
 * @param current - Current essence hole state
 * @param removedEssenceCost - The essence cost of the removed augmentation
 * @param formula - Magic reduction formula
 * @returns Updated essence hole state
 */
export function updateEssenceHoleOnRemoval(
  current: EssenceHole,
  removedEssenceCost: number,
  formula: "roundUp" | "roundDown" | "exact" = DEFAULT_MAGIC_REDUCTION_FORMULA
): EssenceHoleUpdateResult {
  // Current loss decreases when augmentation is removed
  const newCurrentLoss = roundEssence(
    Math.max(0, current.currentEssenceLoss - removedEssenceCost)
  );

  // Peak loss NEVER decreases - this is the key to essence holes
  const peakLoss = current.peakEssenceLoss;

  // The hole grows as current loss decreases below peak
  const newHole = calculateEssenceHole(peakLoss, newCurrentLoss);

  // Magic loss is based on peak, so it doesn't decrease when augmentations are removed
  // This is the permanent nature of the essence hole
  const magicLost = calculateMagicLoss(peakLoss, formula);

  return {
    essenceHole: {
      peakEssenceLoss: peakLoss,
      currentEssenceLoss: newCurrentLoss,
      essenceHole: newHole,
      magicLost,
    },
    hadPermanentLoss: false, // Removal never causes additional magic loss
    additionalMagicLost: 0,
  };
}

/**
 * Update essence hole state when grade is upgraded
 * Grade upgrade reduces essence cost but doesn't affect peak (and thus magic loss)
 *
 * @param current - Current essence hole state
 * @param oldEssenceCost - Previous essence cost of the augmentation
 * @param newEssenceCost - New essence cost after grade upgrade
 * @param formula - Magic reduction formula
 * @returns Updated essence hole state
 */
export function updateEssenceHoleOnGradeUpgrade(
  current: EssenceHole,
  oldEssenceCost: number,
  newEssenceCost: number,
  formula: "roundUp" | "roundDown" | "exact" = DEFAULT_MAGIC_REDUCTION_FORMULA
): EssenceHoleUpdateResult {
  // Grade upgrade reduces current essence cost
  const essenceDiff = oldEssenceCost - newEssenceCost;
  const newCurrentLoss = roundEssence(
    Math.max(0, current.currentEssenceLoss - essenceDiff)
  );

  // Peak stays the same - the original install still happened
  const peakLoss = current.peakEssenceLoss;

  // Hole may grow if upgrade significantly reduces current loss
  const newHole = calculateEssenceHole(peakLoss, newCurrentLoss);

  // Magic loss is still based on peak
  const magicLost = calculateMagicLoss(peakLoss, formula);

  return {
    essenceHole: {
      peakEssenceLoss: peakLoss,
      currentEssenceLoss: newCurrentLoss,
      essenceHole: newHole,
      magicLost,
    },
    hadPermanentLoss: false, // Grade upgrade never causes additional magic loss
    additionalMagicLost: 0,
  };
}

// =============================================================================
// CHARACTER INTEGRATION
// =============================================================================

/**
 * Get essence hole state for a character, creating if needed
 *
 * @param character - The character
 * @returns The character's essence hole state
 */
export function getCharacterEssenceHole(character: Partial<Character>): EssenceHole {
  if (character.essenceHole) {
    return character.essenceHole;
  }

  // Calculate from current augmentations if no tracked state
  const currentEssence = character.specialAttributes?.essence ?? MAX_ESSENCE;
  const currentLoss = roundEssence(MAX_ESSENCE - currentEssence);

  return createEssenceHole(currentLoss);
}

/**
 * Get a complete summary of a character's essence-magic state
 *
 * @param character - The character
 * @param rules - Optional augmentation rules for the edition
 * @returns Complete essence-magic summary
 */
export function getEssenceMagicSummary(
  character: Partial<Character>,
  rules?: AugmentationRules
): EssenceMagicSummary {
  const tracksHole = shouldTrackEssenceHole(character);
  const currentEssence = character.specialAttributes?.essence ?? MAX_ESSENCE;
  const totalEssenceLoss = roundEssence(MAX_ESSENCE - currentEssence);

  const essenceHoleState = getCharacterEssenceHole(character);
  const formula = rules?.magicReductionFormula ?? DEFAULT_MAGIC_REDUCTION_FORMULA;

  // For magic calculation, use peak essence loss (includes hole)
  const effectiveEssenceLoss = tracksHole
    ? essenceHoleState.peakEssenceLoss
    : totalEssenceLoss;

  const baseMagic = character.specialAttributes?.magic ??
    character.specialAttributes?.resonance ?? 0;

  const magicLoss = tracksHole ? calculateMagicLoss(effectiveEssenceLoss, formula) : 0;
  const effectiveMagic = Math.max(0, baseMagic - magicLoss);

  return {
    currentEssence,
    totalEssenceLoss,
    peakEssenceLoss: essenceHoleState.peakEssenceLoss,
    essenceHole: essenceHoleState.essenceHole,
    baseMagic,
    effectiveMagic,
    tracksEssenceHole: tracksHole,
  };
}

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * Format essence hole state for display
 *
 * @param essenceHole - The essence hole state
 * @returns Human-readable string
 */
export function formatEssenceHole(essenceHole: EssenceHole): string {
  if (essenceHole.essenceHole === 0) {
    return "No essence hole";
  }

  return `Essence hole: ${roundEssence(essenceHole.essenceHole).toFixed(2)} (${essenceHole.magicLost} Magic lost permanently)`;
}

/**
 * Get a warning message if installing an augmentation would cause magic loss
 *
 * @param character - The character
 * @param proposedEssenceCost - The essence cost of the proposed augmentation
 * @param rules - Optional augmentation rules
 * @returns Warning message or null if no magic would be lost
 */
export function getMagicLossWarning(
  character: Partial<Character>,
  proposedEssenceCost: number,
  rules?: AugmentationRules
): string | null {
  if (!shouldTrackEssenceHole(character)) {
    return null;
  }

  const currentState = getCharacterEssenceHole(character);
  const formula = rules?.magicReductionFormula ?? DEFAULT_MAGIC_REDUCTION_FORMULA;

  // Simulate the installation
  const { additionalMagicLost, essenceHole: newState } = updateEssenceHoleOnInstall(
    currentState,
    proposedEssenceCost,
    formula
  );

  if (additionalMagicLost === 0) {
    return null;
  }

  const magicType = character.magicalPath === "technomancer" ? "Resonance" : "Magic";
  const currentMagic = character.specialAttributes?.magic ??
    character.specialAttributes?.resonance ?? 0;
  const newEffectiveMagic = Math.max(0, currentMagic - newState.magicLost);

  if (newEffectiveMagic === 0) {
    return `WARNING: Installing this augmentation would reduce your ${magicType} to 0, permanently burning out your abilities!`;
  }

  return `Installing this augmentation will permanently reduce your ${magicType} by ${additionalMagicLost} (from ${currentMagic - currentState.magicLost} to ${newEffectiveMagic}).`;
}
