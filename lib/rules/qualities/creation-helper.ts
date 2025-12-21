/**
 * Helper functions for validating qualities during character creation
 *
 * Builds a partial character object from CreationState for validation purposes.
 */

import type { CreationState, Character, EditionCode } from "@/lib/types";

/**
 * Build a partial character object from creation state for validation
 */
export function buildCharacterFromCreationState(
  state: CreationState,
  editionCode: string
): Partial<Character> {
  return {
    id: state.characterId || "",
    editionCode: editionCode as EditionCode,
    metatype: state.selections.metatype as string | undefined,
    attributes: state.selections.attributes as Record<string, number> | undefined,
    specialAttributes: {
      edge: (state.selections.attributes as Record<string, number>)?.["edg"] || 1,
      essence: 6, // Default, will be calculated properly elsewhere
      magic: state.selections["magical-path"] === "mundane" 
        ? undefined 
        : (state.selections["magical-path"] ? 1 : undefined),
      resonance: state.selections["magical-path"] === "technomancer"
        ? 1
        : undefined,
    },
    magicalPath: (state.selections["magical-path"] as Character["magicalPath"]) || "mundane",
    skills: state.selections.skills as Record<string, number> | undefined,
    positiveQualities: ((state.selections.positiveQualities as string[]) || []).map(id => ({
      qualityId: id,
      id: id, // For backward compatibility
      rating: (state.selections.qualityLevels as Record<string, number>)?.[id],
      specification: (state.selections.qualitySpecifications as Record<string, string>)?.[id],
      source: "creation" as const,
      active: true,
    })),
    negativeQualities: ((state.selections.negativeQualities as string[]) || []).map(id => ({
      qualityId: id,
      id: id, // For backward compatibility
      rating: (state.selections.qualityLevels as Record<string, number>)?.[id],
      specification: (state.selections.qualitySpecifications as Record<string, string>)?.[id],
      source: "creation" as const,
      active: true,
    })),
    status: "draft" as const,
  };
}

