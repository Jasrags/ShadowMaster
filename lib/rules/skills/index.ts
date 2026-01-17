/**
 * Skills Module
 *
 * Exports for skill-related rules and utilities.
 */

export {
  // Types
  type NormalizedGroupValue,
  // Normalization
  normalizeGroupValue,
  getGroupRating,
  isGroupBroken,
  createBrokenGroup,
  createRestoredGroup,
  // Karma costs
  SPECIALIZATION_KARMA_COST,
  calculateSkillRaiseKarmaCost,
  calculateSpecializationKarmaCost,
  // Restoration
  canRestoreGroup,
  // Budget helpers
  calculateGroupPointsSpent,
  getActiveGroups,
  getBrokenGroups,
} from "./group-utils";
