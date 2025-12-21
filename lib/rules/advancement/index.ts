/**
 * Character advancement module
 *
 * Exports all advancement-related functions and types.
 */

// Cost calculations
export {
  calculateAttributeCost,
  calculateActiveSkillCost,
  calculateKnowledgeSkillCost,
  calculateSkillGroupCost,
  calculateSpecializationCost,
  calculateEdgeCost,
  calculateNewKnowledgeSkillCost,
  calculateSpellCost,
  calculateComplexFormCost,
  calculateAdvancementCost,
} from "./costs";

// Training time calculations
export {
  calculateAttributeTrainingTime,
  calculateActiveSkillTrainingTime,
  calculateKnowledgeSkillTrainingTime,
  calculateSkillGroupTrainingTime,
  calculateSpecializationTrainingTime,
  applyInstructorBonus,
  applyTimeModifier,
  calculateFinalTrainingTime,
  calculateAdvancementTrainingTime,
} from "./training";

// Validation
export {
  validateKarmaAvailability,
  getAttributeMaximum,
  validateAttributeAdvancement,
  getSkillMaximum,
  validateSkillAdvancement,
  validateSpecializationAdvancement,
  validateCharacterNotDraft,
  validateAdvancement,
  type AdvancementValidationResult,
} from "./validation";

// Attribute advancement
export {
  advanceAttribute,
  type AdvanceAttributeOptions,
  type AdvanceAttributeResult,
} from "./attributes";

// Skill advancement
export {
  advanceSkill,
  type AdvanceSkillOptions,
  type AdvanceSkillResult,
} from "./skills";

