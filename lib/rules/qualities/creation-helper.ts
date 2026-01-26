/**
 * Helper functions for validating qualities during character creation
 *
 * Builds a partial character object from CreationState for validation purposes.
 */

import type { CreationState, Character, EditionCode } from "@/lib/types";

/**
 * Quality selection can be either a string ID or an object with embedded data.
 * Object format supports embedded specification and karma values (new format).
 * String format reads specification from qualitySpecifications record (legacy format).
 */
type QualitySelection = string | { id: string; specification?: string; karma?: number };

/**
 * Build a partial character object from creation state for validation
 */
export function buildCharacterFromCreationState(
  state: CreationState,
  editionCode: string
): Partial<Character> {
  // Get legacy qualitySpecifications for backwards compatibility
  const qualitySpecifications = (state.selections.qualitySpecifications || {}) as Record<
    string,
    string
  >;
  const qualityLevels = (state.selections.qualityLevels || {}) as Record<string, number>;

  // Helper to normalize quality selection (supports both string and object formats)
  const normalizeQuality = (quality: QualitySelection) => {
    if (typeof quality === "string") {
      // Legacy string format - look up specification from qualitySpecifications
      return {
        qualityId: quality,
        id: quality,
        rating: qualityLevels[quality],
        specification: qualitySpecifications[quality],
        source: "creation" as const,
        active: true,
      };
    } else {
      // New object format - use embedded specification (with legacy fallback)
      return {
        qualityId: quality.id,
        id: quality.id,
        rating: qualityLevels[quality.id],
        specification: quality.specification || qualitySpecifications[quality.id],
        source: "creation" as const,
        active: true,
      };
    }
  };

  const positiveQualitySelections = (state.selections.positiveQualities ||
    []) as QualitySelection[];
  const negativeQualitySelections = (state.selections.negativeQualities ||
    []) as QualitySelection[];

  return {
    id: state.characterId || "",
    editionCode: editionCode as EditionCode,
    metatype: state.selections.metatype as string | undefined,
    attributes: state.selections.attributes as Record<string, number> | undefined,
    specialAttributes: {
      edge: (state.selections.attributes as Record<string, number>)?.["edg"] || 1,
      essence: 6, // Default, will be calculated properly elsewhere
      magic:
        state.selections["magical-path"] === "mundane"
          ? undefined
          : state.selections["magical-path"]
            ? 1
            : undefined,
      resonance: state.selections["magical-path"] === "technomancer" ? 1 : undefined,
    },
    magicalPath: (state.selections["magical-path"] as Character["magicalPath"]) || "mundane",
    skills: state.selections.skills as Record<string, number> | undefined,
    positiveQualities: positiveQualitySelections.map(normalizeQuality),
    negativeQualities: negativeQualitySelections.map(normalizeQuality),
    status: "draft" as const,
  };
}
