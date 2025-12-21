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
export {
  buildCharacterFromCreationState,
} from "./creation-helper";

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

export {
  registerEffectHandler,
  getEffectHandler,
  processEffect,
} from "./effects/handlers";

export {
  getAllCharacterEffects,
  getDicePoolModifiers,
  getLimitModifiers,
  getWoundModifierModifiers,
  getAttributeModifiers,
  getAttributeMaximumModifiers,
  getLifestyleCostModifiers,
  getHealingModifiers,
} from "./effects/integration";

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
  attemptRecovery,
  calculateWithdrawalPenalties,
} from "./dynamic-state/addiction";

export {
  checkExposure,
  beginExposure,
  endExposure,
  calculateAllergyPenalties,
  applyAllergyDamage,
} from "./dynamic-state/allergy";

export {
  updateDependentStatus,
  calculateLifestyleModifier,
  calculateTotalLifestyleModifier,
  calculateTimeCommitment,
  calculateTotalTimeCommitment,
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

