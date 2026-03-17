/**
 * Character State Flags Builder
 *
 * Pure function that scans a character's quality selections for active
 * dynamic states and builds the CharacterStateFlags used by the unified
 * effect resolver for state-dependent trigger matching.
 *
 * @see Issue #485
 */

import type { Character, CharacterStateFlags } from "@/lib/types";

/**
 * Build character state flags from quality dynamic state.
 *
 * Scans positive and negative qualities for active dynamic states:
 * - Addiction with `withdrawalActive: true` → `{ withdrawalActive: true }`
 * - Allergy with `currentlyExposed: true` → `{ exposureActive: true }`
 *
 * Returns `{}` for characters without dynamic state (safe for creation adapter).
 */
export function buildCharacterStateFlags(character: Character): CharacterStateFlags {
  const flags: CharacterStateFlags = {};
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  for (const selection of allQualities) {
    if (!selection.dynamicState) continue;

    switch (selection.dynamicState.type) {
      case "addiction":
        if (selection.dynamicState.state.withdrawalActive) {
          flags.withdrawalActive = true;
        }
        break;
      case "allergy":
        if (selection.dynamicState.state.currentlyExposed) {
          flags.exposureActive = true;
        }
        break;
    }
  }

  return flags;
}
