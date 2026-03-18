/**
 * Quality system modules
 *
 * Barrel export for all quality-related functions.
 */

// Validation functions
export {
  validatePrerequisites,
  checkIncompatibilities,
  canTakeQuality,
  validateQualitySelection,
  validateAllQualities,
  type PrerequisiteValidationResult,
} from "./validation";

// Utility functions
export {
  getQualityDefinition,
  getAllQualitiesWithDefinitions,
  findQualitySelection,
  characterHasQuality,
  countQualityInstances,
  getAllQualityIds,
} from "./utils";

// Karma accounting functions
export {
  calculateQualityCost,
  calculatePositiveQualityKarma,
  calculateNegativeQualityKarma,
  getAvailableKarma,
  validateKarmaLimits,
} from "./karma";

// Creation helper functions
export { buildCharacterFromCreationState } from "./creation-helper";

// Effects system functions
export {
  resolveTemplateVariable,
  resolveEffectValue,
  resolveEffectTarget,
  matchesCondition,
  matchesTrigger,
  shouldApplyEffect,
  getActiveEffects,
  filterEffectsByTrigger,
  filterEffectsByTarget,
} from "./effects";

export { registerEffectHandler, getEffectHandler, processEffect } from "./effects/handlers";

// Legacy integration functions removed in #741 Phase 2+3.
// All gameplay-integration functions now use the unified effects pipeline
// (lib/rules/effects/) instead of the legacy quality-only integration.

// Dynamic state management functions
export {
  initializeDynamicState,
  updateDynamicState,
  getDynamicState,
  validateDynamicState,
} from "./dynamic-state";

export {
  checkAddictionCraving,
  makeCravingTest,
  beginWithdrawal,
  recordDose,
} from "./dynamic-state/addiction";

export {
  checkExposure,
  beginExposure,
  endExposure,
  calculateAllergyPenalties,
} from "./dynamic-state/allergy";

export {
  updateDependentStatus,
  calculateLifestyleModifier,
  calculateTotalLifestyleModifier,
  calculateTimeCommitment,
} from "./dynamic-state/dependents";

// Gameplay integration functions
export {
  calculateWoundModifier,
  calculateSkillDicePool,
  calculateLimit,
  calculateLifestyleCost,
  calculateHealingDicePool,
  calculateAttributeValue,
  calculateAttributeMaximum,
} from "./gameplay-integration";

// Advancement functions (post-creation quality management)
export {
  validateQualityAcquisition,
  validateQualityRemoval,
  acquireQuality,
  removeQuality,
  calculatePostCreationCost,
  calculateBuyOffCost,
  type AcquireQualityOptions,
  type AcquisitionValidationResult,
  type RemovalValidationResult,
} from "./advancement";
