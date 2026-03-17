/**
 * Creation-to-Character Adapter
 *
 * Converts CreationSelections into a Partial<Character> shape so that
 * gatherEffectSources() can collect unified effects during character creation.
 *
 * @see Issue #448
 */

import type { Character, CreationSelections, QualitySelectionValue } from "@/lib/types";

/**
 * Extract quality ID from a selection value (string or SelectedQuality object).
 */
function toQualityId(selection: QualitySelectionValue): string {
  return typeof selection === "string" ? selection : selection.id;
}

/**
 * Extract rating from a selection value.
 */
function toQualityRating(selection: QualitySelectionValue): number | undefined {
  return typeof selection === "string" ? undefined : selection.level;
}

/**
 * Build a Partial<Character> from CreationSelections for effect gathering.
 *
 * Maps selection shapes to the Character interface fields that
 * gatherEffectSources() reads. Only populates fields relevant to
 * effect resolution — not a full Character object.
 */
export function buildCreationCharacter(selections: CreationSelections): Partial<Character> {
  return {
    // Qualities: convert QualitySelectionValue[] to QualitySelection[] shape
    positiveQualities: (selections.positiveQualities || []).map((sel) => ({
      qualityId: toQualityId(sel),
      rating: toQualityRating(sel),
      source: "creation" as const,
    })),
    negativeQualities: (selections.negativeQualities || []).map((sel) => ({
      qualityId: toQualityId(sel),
      rating: toQualityRating(sel),
      source: "creation" as const,
    })),

    // Augmentations: direct pass-through (same shape)
    cyberware: selections.cyberware || [],
    bioware: selections.bioware || [],

    // Adept powers: direct pass-through
    adeptPowers: selections.adeptPowers || [],

    // Gear, weapons, armor: direct pass-through
    gear: selections.gear || [],
    weapons: selections.weapons || [],
    armor: selections.armor || [],

    // Default wireless to enabled during creation
    wirelessBonusesEnabled: true,
  };
}
