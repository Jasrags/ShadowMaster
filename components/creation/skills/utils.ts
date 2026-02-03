/**
 * Skills Card Utilities
 *
 * Helper functions for skill management in character creation.
 */

/**
 * Updates the skillKarmaSpent tracking object with new values.
 * Used when modifying skill ratings or specializations purchased with karma.
 */
export function updateKarmaSpent(
  current: {
    skillRaises: Record<string, number>;
    skillRatingPoints: number;
    specializations: number;
    groupRaises?: Record<string, number>;
    groupRatingPoints?: number;
  },
  updates: Partial<{
    skillRaises: Record<string, number>;
    skillRatingPoints: number;
    specializations: number;
    groupRaises: Record<string, number>;
    groupRatingPoints: number;
  }>
): {
  skillRaises: Record<string, number>;
  skillRatingPoints: number;
  specializations: number;
  groupRaises?: Record<string, number>;
  groupRatingPoints?: number;
} {
  return {
    ...current,
    ...updates,
    skillRaises: updates.skillRaises ?? current.skillRaises,
    skillRatingPoints: updates.skillRatingPoints ?? current.skillRatingPoints,
    specializations: updates.specializations ?? current.specializations,
    ...(updates.groupRaises !== undefined && { groupRaises: updates.groupRaises }),
    ...(updates.groupRatingPoints !== undefined && {
      groupRatingPoints: updates.groupRatingPoints,
    }),
  };
}

/**
 * Updates free skill designations by type.
 */
export function updateDesignationsByType(
  designations: {
    magical?: string[];
    resonance?: string[];
    active?: string[];
  },
  type: string,
  skillIds: string[]
): {
  magical?: string[];
  resonance?: string[];
  active?: string[];
} {
  const newDesignations = { ...designations };

  switch (type) {
    case "magical":
      newDesignations.magical = skillIds;
      break;
    case "resonance":
      newDesignations.resonance = skillIds;
      break;
    case "active":
      newDesignations.active = skillIds;
      break;
  }

  return newDesignations;
}

/**
 * Removes a skill from designations by type.
 */
export function removeFromDesignations(
  designations: {
    magical?: string[];
    resonance?: string[];
    active?: string[];
  },
  skillId: string,
  type: string
): {
  magical?: string[];
  resonance?: string[];
  active?: string[];
} {
  const newDesignations = { ...designations };

  switch (type) {
    case "magical":
      newDesignations.magical = (newDesignations.magical || []).filter((id) => id !== skillId);
      break;
    case "resonance":
      newDesignations.resonance = (newDesignations.resonance || []).filter((id) => id !== skillId);
      break;
    case "active":
      newDesignations.active = (newDesignations.active || []).filter((id) => id !== skillId);
      break;
  }

  return newDesignations;
}

/**
 * Adds a skill to designations by type.
 */
export function addToDesignations(
  designations: {
    magical?: string[];
    resonance?: string[];
    active?: string[];
  },
  skillId: string,
  type: string
): {
  magical?: string[];
  resonance?: string[];
  active?: string[];
} {
  const newDesignations = { ...designations };

  switch (type) {
    case "magical":
      newDesignations.magical = [...(newDesignations.magical || []), skillId];
      break;
    case "resonance":
      newDesignations.resonance = [...(newDesignations.resonance || []), skillId];
      break;
    case "active":
      newDesignations.active = [...(newDesignations.active || []), skillId];
      break;
  }

  return newDesignations;
}

/**
 * Type for karma spent tracking.
 */
export interface SkillKarmaSpent {
  skillRaises: Record<string, number>;
  skillRatingPoints: number;
  specializations: number;
  groupRaises?: Record<string, number>;
  groupRatingPoints?: number;
}

/**
 * Default empty karma spent object.
 */
export const EMPTY_KARMA_SPENT: SkillKarmaSpent = {
  skillRaises: {},
  skillRatingPoints: 0,
  specializations: 0,
};

/**
 * Gets the current karma spent object from selections, with defaults.
 */
export function getKarmaSpent(selections: Record<string, unknown>): SkillKarmaSpent {
  return (selections.skillKarmaSpent as SkillKarmaSpent | undefined) || EMPTY_KARMA_SPENT;
}
