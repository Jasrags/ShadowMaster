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
export { advanceSkill, type AdvanceSkillOptions, type AdvanceSkillResult } from "./skills";

// Edge advancement
export { advanceEdge, type AdvanceEdgeOptions, type AdvanceEdgeResult } from "./edge";

// Specialization advancement
export {
  advanceSpecialization,
  type AdvanceSpecializationOptions,
  type AdvanceSpecializationResult,
} from "./specializations";

// Training completion
export {
  completeTraining,
  getActiveTraining,
  getCompletedTraining,
  type CompleteTrainingResult,
} from "./completion";

// Training interruption/resumption
export {
  interruptTraining,
  resumeTraining,
  type InterruptTrainingResult,
  type ResumeTrainingResult,
} from "./interruption";

// Campaign downtime integration
export {
  getDowntimeEvents,
  getDowntimeEventById,
  countDowntimeAdvancements,
  validateDowntimeLimits,
  getDowntimeTraining,
  getDowntimeAdvancements,
} from "./downtime";

// GM approval workflow
export {
  approveAdvancement,
  rejectAdvancement,
  isCampaignGM,
  requiresGMApproval,
  type ApproveAdvancementResult,
} from "./approval";

// Magic advancement
export {
  calculateSpellLearningCost,
  validateSpellAdvancement,
  calculateInitiationKarmaCost,
  validateInitiationAdvancement,
  calculateAdeptPowerKarmaCost,
  validateAdeptPowerAdvancement,
  calculateRitualLearningCost,
  validateRitualAdvancement,
  getAvailableMetamagics,
  type MagicAdvancementValidationResult,
  type AdeptPowerAdvancement,
} from "./magic-advancement";
