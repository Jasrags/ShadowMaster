/**
 * Skill Group Utilities
 *
 * Helper functions for working with skill groups that support both
 * legacy (number) and new ({ rating, isBroken }) formats.
 *
 * SR5 Rules Reference:
 * - If a single member is advanced independently, mark `isBroken` and treat
 *   skills as individual entries at the former rating.
 * - To restore a group, all member skills must reach an equal rating; only
 *   then can the group rating increase again.
 * - In character creation, you cannot separate skill levels from the skill
 *   group level using skill points. That must be done using karma.
 */

import type { SkillGroupValue } from "@/lib/types/creation-selections";

// =============================================================================
// TYPE HELPERS
// =============================================================================

/**
 * Normalized skill group value (always the object format)
 */
export interface NormalizedGroupValue {
  rating: number;
  isBroken: boolean;
}

// =============================================================================
// NORMALIZATION FUNCTIONS
// =============================================================================

/**
 * Normalize a skill group value to the new object format.
 *
 * Handles both legacy (number) and new ({ rating, isBroken }) formats.
 * - Legacy: `4` → `{ rating: 4, isBroken: false }`
 * - New: `{ rating: 4, isBroken: true }` → `{ rating: 4, isBroken: true }`
 */
export function normalizeGroupValue(value: SkillGroupValue): NormalizedGroupValue {
  if (typeof value === "number") {
    return { rating: value, isBroken: false };
  }
  return value;
}

/**
 * Get the rating from a skill group value, regardless of format.
 *
 * @param value - The skill group value (number or object)
 * @returns The rating value
 */
export function getGroupRating(value: SkillGroupValue): number {
  return typeof value === "number" ? value : value.rating;
}

/**
 * Check if a skill group is broken.
 *
 * @param value - The skill group value (number or object)
 * @returns true if the group is broken, false otherwise
 */
export function isGroupBroken(value: SkillGroupValue): boolean {
  return typeof value === "number" ? false : value.isBroken;
}

/**
 * Create a broken group value from an existing value.
 *
 * @param value - The original skill group value
 * @returns A new value marked as broken
 */
export function createBrokenGroup(value: SkillGroupValue): NormalizedGroupValue {
  const rating = getGroupRating(value);
  return { rating, isBroken: true };
}

/**
 * Create a restored (non-broken) group value.
 *
 * @param rating - The rating for the restored group
 * @returns A new value marked as not broken
 */
export function createRestoredGroup(rating: number): NormalizedGroupValue {
  return { rating, isBroken: false };
}

// =============================================================================
// KARMA COST CALCULATIONS
// =============================================================================

/**
 * Calculate karma cost to raise a skill rating.
 *
 * SR5 Rule: New Rating × 2
 * Cost to go from 3 to 4 = 4 × 2 = 8 karma
 *
 * @param fromRating - Current skill rating
 * @param toRating - Target skill rating
 * @returns Total karma cost for the increase
 */
export function calculateSkillRaiseKarmaCost(fromRating: number, toRating: number): number {
  if (toRating <= fromRating) return 0;

  let totalCost = 0;
  for (let r = fromRating + 1; r <= toRating; r++) {
    totalCost += r * 2;
  }
  return totalCost;
}

/**
 * Calculate karma cost to raise a skill group rating.
 *
 * SR5 Rule: New Rating × 5
 * Cost to go from 3 to 4 = 4 × 5 = 20 karma
 *
 * @param fromRating - Current group rating
 * @param toRating - Target group rating
 * @returns Total karma cost for the increase
 */
export function calculateSkillGroupRaiseKarmaCost(fromRating: number, toRating: number): number {
  if (toRating <= fromRating) return 0;

  let totalCost = 0;
  for (let r = fromRating + 1; r <= toRating; r++) {
    totalCost += r * 5;
  }
  return totalCost;
}

/**
 * Karma cost for a specialization during character creation.
 * SR5 Rule: 7 karma per specialization
 */
export const SPECIALIZATION_KARMA_COST = 7;

/**
 * Calculate total karma cost for specializations.
 *
 * @param count - Number of specializations
 * @returns Total karma cost
 */
export function calculateSpecializationKarmaCost(count: number): number {
  return count * SPECIALIZATION_KARMA_COST;
}

// =============================================================================
// RESTORATION DETECTION
// =============================================================================

/**
 * Check if a broken skill group can be restored.
 *
 * A group can be restored when all member skills have the same rating.
 *
 * @param memberSkillIds - Array of skill IDs that belong to the group
 * @param skillRatings - Map of skill ID to current rating
 * @returns Object with canRestore boolean and the common rating (if restorable)
 */
export function canRestoreGroup(
  memberSkillIds: string[],
  skillRatings: Record<string, number>
): { canRestore: boolean; commonRating?: number } {
  // All member skills must exist
  const ratings = memberSkillIds.map((id) => skillRatings[id]);
  const allExist = ratings.every((r) => r !== undefined && r > 0);

  if (!allExist) {
    return { canRestore: false };
  }

  // All ratings must be equal
  const firstRating = ratings[0];
  const allEqual = ratings.every((r) => r === firstRating);

  if (!allEqual) {
    return { canRestore: false };
  }

  return { canRestore: true, commonRating: firstRating };
}

// =============================================================================
// BUDGET HELPERS
// =============================================================================

/**
 * Calculate the skill rating points from broken groups that are already
 * funded by skill group points and should be subtracted from the
 * skill-points budget.
 *
 * When a group is broken, its member skills are added to `selections.skills`
 * at their full ratings. But the base ratings (up to the group rating) were
 * already paid for by skill-group-points. This function calculates that
 * overlap so the budget calculation can subtract it.
 *
 * @param skillGroups - Map of group ID to skill group value (from selections)
 * @param skills - Map of skill ID to rating (from selections)
 * @param skillGroupDefs - Skill group definitions with member skill IDs (from ruleset)
 * @returns Total skill rating points already funded by group points
 */
export function calculateBrokenGroupSkillPointOffset(
  skillGroups: Record<string, SkillGroupValue>,
  skills: Record<string, number>,
  skillGroupDefs: { id: string; skills: string[] }[]
): number {
  if (skillGroupDefs.length === 0) return 0;

  let offset = 0;

  for (const [groupId, value] of Object.entries(skillGroups)) {
    if (!isGroupBroken(value)) continue;

    const groupRating = getGroupRating(value);
    if (groupRating === 0) continue;

    // Find the group definition to get member skill IDs
    const groupDef = skillGroupDefs.find((def) => def.id === groupId);
    if (!groupDef) continue;

    for (const memberSkillId of groupDef.skills) {
      const memberRating = skills[memberSkillId];
      if (memberRating === undefined || memberRating === 0) continue;

      // The base portion (up to groupRating) is funded by group points
      offset += Math.min(memberRating, groupRating);
    }
  }

  return offset;
}

/**
 * Calculate total skill group points spent.
 *
 * Only counts non-broken groups toward the budget.
 * Broken groups still "use" their original rating in group points,
 * but their member skills are tracked separately as individual skills.
 *
 * @param skillGroups - Map of group ID to skill group value
 * @returns Total group points spent
 */
export function calculateGroupPointsSpent(skillGroups: Record<string, SkillGroupValue>): number {
  return Object.values(skillGroups).reduce<number>((sum, value) => {
    // Count rating for both broken and non-broken groups
    // The group points were already spent when the group was created
    return sum + getGroupRating(value);
  }, 0);
}

/**
 * Get all active (non-broken) skill groups.
 *
 * @param skillGroups - Map of group ID to skill group value
 * @returns Map of only active (non-broken) groups
 */
export function getActiveGroups(
  skillGroups: Record<string, SkillGroupValue>
): Record<string, NormalizedGroupValue> {
  const active: Record<string, NormalizedGroupValue> = {};

  for (const [groupId, value] of Object.entries(skillGroups)) {
    const normalized = normalizeGroupValue(value);
    if (!normalized.isBroken) {
      active[groupId] = normalized;
    }
  }

  return active;
}

/**
 * Get all broken skill groups.
 *
 * @param skillGroups - Map of group ID to skill group value
 * @returns Map of only broken groups
 */
export function getBrokenGroups(
  skillGroups: Record<string, SkillGroupValue>
): Record<string, NormalizedGroupValue> {
  const broken: Record<string, NormalizedGroupValue> = {};

  for (const [groupId, value] of Object.entries(skillGroups)) {
    const normalized = normalizeGroupValue(value);
    if (normalized.isBroken) {
      broken[groupId] = normalized;
    }
  }

  return broken;
}
