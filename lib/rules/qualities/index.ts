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

