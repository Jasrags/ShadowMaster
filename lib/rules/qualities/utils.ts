/**
 * Quality utility functions
 *
 * Helper functions for working with qualities on characters and rulesets.
 */

import type { Character, QualitySelection } from "@/lib/types";
import type { Quality, MergedRuleset } from "@/lib/types";

/**
 * Get quality definition from ruleset catalog
 */
export function getQualityDefinition(ruleset: MergedRuleset, qualityId: string): Quality | null {
  // Access modules directly to avoid importing from merge.ts (which imports server-only code)
  const qualitiesModule = ruleset.modules.qualities as
    | {
        positive: Quality[];
        negative: Quality[];
      }
    | undefined;

  if (!qualitiesModule) return null;

  const allQualities = [...(qualitiesModule.positive || []), ...(qualitiesModule.negative || [])];

  return allQualities.find((q) => q.id === qualityId) || null;
}

/**
 * Get all quality selections on a character with their definitions
 */
export function getAllQualitiesWithDefinitions(
  character: Character,
  ruleset: MergedRuleset
): Array<{ selection: QualitySelection; definition: Quality | null }> {
  const allSelections = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  return allSelections.map((selection) => ({
    selection,
    definition: getQualityDefinition(ruleset, selection.qualityId || selection.id || ""),
  }));
}

/**
 * Find a specific quality selection on a character
 */
export function findQualitySelection(
  character: Character,
  qualityId: string
): QualitySelection | null {
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  return (
    allQualities.find((q) => (q.qualityId || q.id)?.toLowerCase() === qualityId.toLowerCase()) ||
    null
  );
}

/**
 * Check if character has a specific quality
 */
export function characterHasQuality(character: Character, qualityId: string): boolean {
  return findQualitySelection(character, qualityId) !== null;
}

/**
 * Count how many times a quality has been taken on a character
 */
export function countQualityInstances(character: Character, qualityId: string): number {
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  return allQualities.filter(
    (q) => (q.qualityId || q.id)?.toLowerCase() === qualityId.toLowerCase()
  ).length;
}

/**
 * Get all quality IDs from a character (positive and negative)
 */
export function getAllQualityIds(character: Character): string[] {
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  return allQualities.map((q) => q.qualityId || q.id).filter((id): id is string => !!id);
}
