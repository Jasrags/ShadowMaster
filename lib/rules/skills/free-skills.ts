/**
 * Free Skills from Magic Priority
 *
 * Helper functions for calculating and tracking free skill points
 * granted by the Magic priority selection during character creation.
 *
 * SR5 Rules Reference:
 * - Magic Priority A/B grants free skills at specified ratings
 * - Magician/Mystic Adept: 2 free magical skills (category: "magical")
 * - Technomancer: 2 free resonance skills (category: "resonance")
 * - Adept: 1 free active skill (any category)
 * - Aspected Mage: 1 free skill group
 *
 * Free skills work as follows:
 * - User EXPLICITLY designates which skills receive the free allocation
 * - Each designated skill gets its FIRST N rating points free (up to the free rating)
 * - Example: "Two Rating 4 Magical skills" means 2 skills get first 4 points free
 * - A skill at rating 6 with free rating 4 = 4 free points (ratings 5-6 cost skill points)
 * - A skill at rating 2 with free rating 4 = 2 free points (only 2 points purchased)
 * - Only skills of the correct category (magical/resonance) can be designated
 *
 * Skill categories are determined dynamically from ruleset data, not hardcoded lists.
 */

import type { PriorityTableData } from "@/lib/rules/RulesetContext";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Configuration for a free skill allocation from magic priority
 */
export interface FreeSkillConfig {
  /** Type of skill that qualifies: magical, resonance, active, or magicalGroup */
  type: string;
  /** The rating granted for free */
  rating: number;
  /** Number of skills that get this free allocation */
  count: number;
}

/**
 * Result of checking how skills qualify for free allocation
 */
export interface FreeSkillAllocationResult {
  /** Number of skills successfully allocated as free */
  allocated: number;
  /** Total skill points that are free (sum of min(skillRating, freeRating) for allocated skills) */
  freePoints: number;
  /** Number of free slots that aren't being used */
  unusedCount: number;
  /** Skill IDs that are receiving free allocation */
  allocatedSkillIds: string[];
}

/**
 * User's explicit designations for free skill allocations.
 * Maps free skill type to array of designated skill IDs.
 */
export interface FreeSkillDesignations {
  /** Skill IDs designated for magical free allocation */
  magical?: string[];
  /** Skill IDs designated for resonance free allocation */
  resonance?: string[];
  /** Skill IDs designated for active (any) free allocation */
  active?: string[];
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if a skill qualifies for a given free skill type based on its category.
 *
 * @param skillCategory - The skill's category from ruleset data (e.g., "magical", "resonance", "combat")
 * @param freeSkillType - The free skill type from priority data (e.g., "magical", "resonance", "active")
 * @returns true if the skill qualifies for this free skill type
 */
function skillQualifiesForType(skillCategory: string | undefined, freeSkillType: string): boolean {
  switch (freeSkillType) {
    case "magical":
      // Only skills with category "magical" qualify
      return skillCategory === "magical";
    case "resonance":
      // Only skills with category "resonance" qualify
      return skillCategory === "resonance";
    case "active":
      // Any active skill qualifies (all skills in the activeSkills list)
      return true;
    case "magicalGroup":
      // Skill groups are handled separately - this function is for individual skills
      return false;
    default:
      // Unknown type - check if the category matches the type directly
      return skillCategory === freeSkillType;
  }
}

// =============================================================================
// MAIN FUNCTIONS
// =============================================================================

/**
 * Get the free skill configurations from the magic priority selection.
 *
 * Looks up the selected magic priority level and magical path to determine
 * what free skills are granted.
 *
 * @param priorityTable - The priority table data
 * @param magicPriority - The selected magic priority level (A, B, C, D, E)
 * @param magicalPath - The selected magical path (magician, technomancer, etc.)
 * @returns Array of free skill configurations, empty if none granted
 */
export function getFreeSkillsFromMagicPriority(
  priorityTable: PriorityTableData | null,
  magicPriority: string | undefined,
  magicalPath: string | undefined
): FreeSkillConfig[] {
  if (!priorityTable || !magicPriority || !magicalPath) {
    return [];
  }

  const priorityLevel = priorityTable.table[magicPriority];
  if (!priorityLevel) {
    return [];
  }

  const magicData = priorityLevel.magic as {
    options?: Array<{
      path: string;
      freeSkills?: Array<{ type: string; rating: number; count: number }>;
    }>;
  };

  if (!magicData?.options) {
    return [];
  }

  // Find the option for the selected magical path
  const pathOption = magicData.options.find((opt) => opt.path === magicalPath);
  if (!pathOption?.freeSkills) {
    return [];
  }

  return pathOption.freeSkills;
}

/**
 * Calculate how many skill points are covered by free skill allocations.
 *
 * This function:
 * 1. Filters skills by the qualifying category (magical, resonance, or any for active)
 * 2. Finds skills at or above the required rating
 * 3. Takes the first N skills (sorted by rating descending to maximize free points)
 * 4. Calculates total free points: min(skillRating, freeRating) for each
 *
 * @param skills - Map of skill ID to rating
 * @param freeSkillConfigs - Array of free skill configurations
 * @param skillCategories - Map of skill ID to category (from ruleset data)
 * @returns Total skill points covered by free allocations
 */
export function calculateFreeSkillPointsUsed(
  skills: Record<string, number>,
  freeSkillConfigs: FreeSkillConfig[],
  skillCategories: Record<string, string | undefined>
): number {
  let totalFreePoints = 0;

  for (const config of freeSkillConfigs) {
    // Skip skill group allocations - those are handled separately
    if (config.type === "magicalGroup") {
      continue;
    }

    const result = countQualifyingSkillsForFreeAllocation(skills, config, skillCategories);
    totalFreePoints += result.freePoints;
  }

  return totalFreePoints;
}

/**
 * Count how many skills qualify for a specific free skill allocation.
 *
 * Returns detailed information about which skills are using the free allocation
 * and how many slots remain unused.
 *
 * @param skills - Map of skill ID to rating
 * @param freeSkillConfig - Single free skill configuration
 * @param skillCategories - Map of skill ID to category (from ruleset data)
 * @returns Allocation result with counts and skill IDs
 */
export function countQualifyingSkillsForFreeAllocation(
  skills: Record<string, number>,
  freeSkillConfig: FreeSkillConfig,
  skillCategories: Record<string, string | undefined>
): FreeSkillAllocationResult {
  const { type, rating: freeRating, count: freeCount } = freeSkillConfig;

  // Build list of qualifying skills with their ratings
  const qualifyingSkills: Array<{ skillId: string; rating: number }> = [];

  for (const [skillId, skillRating] of Object.entries(skills)) {
    // Skip skills below the free rating - they don't qualify
    if (skillRating < freeRating) {
      continue;
    }

    // Check if skill's category qualifies for this free skill type
    const skillCategory = skillCategories[skillId];
    if (skillQualifiesForType(skillCategory, type)) {
      qualifyingSkills.push({ skillId, rating: skillRating });
    }
  }

  // Sort by rating descending to maximize free points
  qualifyingSkills.sort((a, b) => b.rating - a.rating);

  // Take up to freeCount skills
  const allocatedSkills = qualifyingSkills.slice(0, freeCount);

  // Calculate free points: min(skillRating, freeRating) for each
  // Note: Since we filtered for skills >= freeRating, min will always be freeRating
  const freePoints = allocatedSkills.length * freeRating;

  return {
    allocated: allocatedSkills.length,
    freePoints,
    unusedCount: freeCount - allocatedSkills.length,
    allocatedSkillIds: allocatedSkills.map((s) => s.skillId),
  };
}

/**
 * Calculate free skill group points from magic priority.
 *
 * For aspected mages, this handles the free skill group allocation.
 *
 * @param skillGroups - Map of group ID to rating/value
 * @param freeSkillConfigs - Array of free skill configurations
 * @returns Total skill group points covered by free allocations
 */
export function calculateFreeSkillGroupPointsUsed(
  skillGroups: Record<string, number | { rating: number; isBroken: boolean }>,
  freeSkillConfigs: FreeSkillConfig[]
): number {
  let totalFreePoints = 0;

  for (const config of freeSkillConfigs) {
    if (config.type !== "magicalGroup") {
      continue;
    }

    // For aspected mages: check if any skill group is at or above the free rating
    // Aspected mages can only have one magical skill group (sorcery, conjuring, or enchanting)
    // We'll count the first group that qualifies up to the free count

    const qualifyingGroupIds = ["sorcery", "conjuring", "enchanting"];
    let allocatedCount = 0;

    for (const groupId of qualifyingGroupIds) {
      if (allocatedCount >= config.count) break;

      const groupValue = skillGroups[groupId];
      if (!groupValue) continue;

      const groupRating = typeof groupValue === "number" ? groupValue : groupValue.rating;

      if (groupRating >= config.rating) {
        // This group qualifies - add the free rating to points
        totalFreePoints += config.rating;
        allocatedCount++;
      }
    }
  }

  return totalFreePoints;
}

/**
 * Get detailed information about which skills are receiving free allocation.
 *
 * Useful for UI display (showing "FREE" badges on skills).
 *
 * @param skills - Map of skill ID to rating
 * @param freeSkillConfigs - Array of free skill configurations
 * @param skillCategories - Map of skill ID to category (from ruleset data)
 * @returns Set of skill IDs receiving free allocation
 */
export function getSkillsWithFreeAllocation(
  skills: Record<string, number>,
  freeSkillConfigs: FreeSkillConfig[],
  skillCategories: Record<string, string | undefined>
): Set<string> {
  const freeSkillIds = new Set<string>();

  for (const config of freeSkillConfigs) {
    if (config.type === "magicalGroup") {
      continue;
    }

    const result = countQualifyingSkillsForFreeAllocation(skills, config, skillCategories);
    for (const skillId of result.allocatedSkillIds) {
      freeSkillIds.add(skillId);
    }
  }

  return freeSkillIds;
}

// =============================================================================
// DESIGNATION-BASED FUNCTIONS (Explicit User Designation)
// =============================================================================

/**
 * Status information for a free skill allocation type.
 */
export interface FreeSkillAllocationStatus {
  /** Free skill type (magical, resonance, active) */
  type: string;
  /** Human-readable label */
  label: string;
  /** Free rating granted for this type */
  freeRating: number;
  /** Total slots available */
  totalSlots: number;
  /** Number of slots used (designated) */
  usedSlots: number;
  /** Number of slots remaining */
  remainingSlots: number;
  /** Designated skill IDs */
  designatedSkillIds: string[];
  /** Map of designated skill ID to current rating */
  designatedSkillRatings: Record<string, number>;
  /** Whether all slots are filled */
  isComplete: boolean;
  /** Skills designated below the free rating (warnings) */
  belowFreeRating: Array<{ skillId: string; currentRating: number; freeRating: number }>;
}

/**
 * Check if a skill can be designated for a specific free skill type.
 *
 * @param skillId - The skill ID to check
 * @param skillCategory - The skill's category from ruleset data
 * @param freeSkillType - The free skill type (magical, resonance, active)
 * @param currentDesignations - Currently designated skill IDs for this type
 * @param maxSlots - Maximum slots allowed for this type
 * @returns Object with canDesignate boolean and reason if cannot
 */
export function canDesignateForFreeSkill(
  skillId: string,
  skillCategory: string | undefined,
  freeSkillType: string,
  currentDesignations: string[],
  maxSlots: number
): { canDesignate: boolean; reason?: string } {
  // Check if already designated
  if (currentDesignations.includes(skillId)) {
    return { canDesignate: false, reason: "Already designated" };
  }

  // Check if slots are full
  if (currentDesignations.length >= maxSlots) {
    return { canDesignate: false, reason: "All slots filled" };
  }

  // Check if skill type matches
  if (!skillQualifiesForType(skillCategory, freeSkillType)) {
    return { canDesignate: false, reason: `Skill must be ${freeSkillType} type` };
  }

  return { canDesignate: true };
}

/**
 * Calculate free skill points from explicit designations.
 *
 * This function uses the user's explicit designations rather than
 * automatically picking the highest-rated skills.
 *
 * @param skills - Map of skill ID to rating
 * @param freeSkillConfigs - Array of free skill configurations
 * @param designations - User's explicit free skill designations
 * @returns Total skill points covered by free allocations
 */
export function calculateFreePointsFromDesignations(
  skills: Record<string, number>,
  freeSkillConfigs: FreeSkillConfig[],
  designations: FreeSkillDesignations | undefined
): number {
  if (!designations) {
    return 0;
  }

  let totalFreePoints = 0;

  for (const config of freeSkillConfigs) {
    // Skip skill group allocations - those are handled separately
    if (config.type === "magicalGroup") {
      continue;
    }

    // Get designated skills for this type
    const designatedIds = getDesignationsForType(designations, config.type);

    for (const skillId of designatedIds) {
      const skillRating = skills[skillId] || 0;
      // Free points = min(skillRating, freeRating)
      // If skill is at rating 3 and free is 5, we get 3 free points
      // If skill is at rating 6 and free is 5, we get 5 free points
      totalFreePoints += Math.min(skillRating, config.rating);
    }
  }

  return totalFreePoints;
}

/**
 * Get the set of explicitly designated free skill IDs.
 *
 * @param designations - User's explicit free skill designations
 * @returns Set of all designated skill IDs across all types
 */
export function getDesignatedFreeSkills(
  designations: FreeSkillDesignations | undefined
): Set<string> {
  const designated = new Set<string>();

  if (!designations) {
    return designated;
  }

  if (designations.magical) {
    designations.magical.forEach((id) => designated.add(id));
  }
  if (designations.resonance) {
    designations.resonance.forEach((id) => designated.add(id));
  }
  if (designations.active) {
    designations.active.forEach((id) => designated.add(id));
  }

  return designated;
}

/**
 * Get free skill allocation status for all types.
 *
 * Provides detailed status information for UI display including:
 * - Progress (slots used/total)
 * - Designated skills with ratings
 * - Warnings for skills below free rating
 *
 * @param skills - Map of skill ID to rating
 * @param freeSkillConfigs - Array of free skill configurations
 * @param designations - User's explicit free skill designations
 * @param typeLabels - Map of type to human-readable label
 * @returns Array of status objects for each free skill type
 */
export function getFreeSkillAllocationStatus(
  skills: Record<string, number>,
  freeSkillConfigs: FreeSkillConfig[],
  designations: FreeSkillDesignations | undefined,
  typeLabels: Record<string, { label: string }> = {}
): FreeSkillAllocationStatus[] {
  const statuses: FreeSkillAllocationStatus[] = [];

  for (const config of freeSkillConfigs) {
    // Skip skill group allocations
    if (config.type === "magicalGroup") {
      continue;
    }

    const designatedIds = getDesignationsForType(designations, config.type);
    const designatedSkillRatings: Record<string, number> = {};
    const belowFreeRating: Array<{
      skillId: string;
      currentRating: number;
      freeRating: number;
    }> = [];

    for (const skillId of designatedIds) {
      const rating = skills[skillId] || 0;
      designatedSkillRatings[skillId] = rating;

      if (rating < config.rating) {
        belowFreeRating.push({
          skillId,
          currentRating: rating,
          freeRating: config.rating,
        });
      }
    }

    statuses.push({
      type: config.type,
      label: typeLabels[config.type]?.label || config.type,
      freeRating: config.rating,
      totalSlots: config.count,
      usedSlots: designatedIds.length,
      remainingSlots: config.count - designatedIds.length,
      designatedSkillIds: designatedIds,
      designatedSkillRatings,
      isComplete: designatedIds.length >= config.count,
      belowFreeRating,
    });
  }

  return statuses;
}

/**
 * Get the free rating for a designated skill.
 *
 * @param skillId - The skill ID to check
 * @param freeSkillConfigs - Array of free skill configurations
 * @param designations - User's explicit free skill designations
 * @returns The free rating if skill is designated, undefined otherwise
 */
export function getDesignatedSkillFreeRating(
  skillId: string,
  freeSkillConfigs: FreeSkillConfig[],
  designations: FreeSkillDesignations | undefined
): number | undefined {
  if (!designations) {
    return undefined;
  }

  for (const config of freeSkillConfigs) {
    if (config.type === "magicalGroup") {
      continue;
    }

    const designatedIds = getDesignationsForType(designations, config.type);
    if (designatedIds.includes(skillId)) {
      return config.rating;
    }
  }

  return undefined;
}

// =============================================================================
// HELPER FUNCTIONS (Internal)
// =============================================================================

/**
 * Get designated skill IDs for a specific free skill type.
 */
function getDesignationsForType(
  designations: FreeSkillDesignations | undefined,
  type: string
): string[] {
  if (!designations) {
    return [];
  }

  switch (type) {
    case "magical":
      return designations.magical || [];
    case "resonance":
      return designations.resonance || [];
    case "active":
      return designations.active || [];
    default:
      return [];
  }
}
