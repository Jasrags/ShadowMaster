/**
 * Character Validation Module
 *
 * Exports comprehensive character validation for creation and finalization.
 * Re-exports from the existing validation module for backwards compatibility.
 */

// New validation types
export type {
  ValidationMode,
  ValidationSeverity,
  ValidationIssue,
  StepCompleteness,
  BudgetCompleteness,
  CharacterValidationResult,
  CharacterValidationContext,
  CharacterValidator,
  ValidatorDefinition,
} from "./types";

// New validation functions
export {
  validateCharacter,
  validateForFinalization,
  isCharacterValid,
} from "./character-validator";

// Materialization
export { materializeFromCreationState } from "./materialize";

// Budget calculator types and functions
export type { NuyenBreakdown, KarmaBreakdown } from "./budget-calculator";
export {
  calculateNuyenSpent,
  calculateKarmaSpent,
  KARMA_TO_NUYEN_LIMIT,
  getKarmaToNuyenLimit,
  SR5_KARMA_BUDGET,
  getKarmaBudget,
  getContactMultiplier,
} from "./budget-calculator";

// Re-export from constraint validation module for backwards compatibility
export {
  type ValidationResult,
  type ValidationContext,
  type ConstraintValidator,
  validateConstraint,
  validateAllConstraints,
  validateCharacter as validateCharacterLegacy,
  validateStep,
  calculateRemainingBudget,
  validateBudgetsComplete,
  getMetatypeAttributeLimits,
  isAttributeWithinLimits,
} from "../constraint-validation";
