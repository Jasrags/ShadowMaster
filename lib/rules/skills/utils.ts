/**
 * Skill Utilities
 *
 * Shared helper functions for skill-related operations.
 */

/**
 * Build a map of skill ID to category from skill data.
 * Used for determining which skills qualify for free skill allocations.
 */
export function buildSkillCategoriesMap(
  activeSkills: ReadonlyArray<{ id: string; category?: string | null }>
): Record<string, string | undefined> {
  const categories: Record<string, string | undefined> = {};
  for (const skill of activeSkills) {
    categories[skill.id] = skill.category ?? undefined;
  }
  return categories;
}
