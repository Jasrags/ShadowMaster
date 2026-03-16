/**
 * Validation Engine
 *
 * Validates character data against ruleset constraints during creation
 * and advancement. Provides both per-step and full character validation.
 */

import type {
  Character,
  CharacterDraft,
  MergedRuleset,
  CreationMethod,
  CreationConstraint,
  CreationState,
  ValidationError,
  ConstraintType,
  Campaign,
} from "../types";
import { getModule } from "./merge";
import { validateAllQualities, validateKarmaLimits } from "./qualities";
import { validateSumToTenBudget } from "./sum-to-ten-validation";
import { validatePointBuyBudget } from "./point-buy-validation";
import { validateLifeModulesBudget, validateLifeModulesSkillCap } from "./life-modules-validation";

// Extracted constraint validators
import { validateAttributeLimit } from "./validation/constraint-attribute-limit";
import { validateSkillLimit } from "./validation/constraint-skill-limit";
import { validateSpecialAttributeInit } from "./validation/constraint-special-attribute-init";
import { validateBudgetBalance } from "./validation/constraint-budget-balance";
import { validateRequiredSelection } from "./validation/constraint-required-selection";
import { validateForbiddenCombination } from "./validation/constraint-forbidden-combination";
import { validateRequiredCombination } from "./validation/constraint-required-combination";
import { validateEssenceMinimum } from "./validation/constraint-essence-minimum";
import { validateEquipmentRatings } from "./validation/constraint-equipment-rating";
import { validateCustom } from "./validation/constraint-custom";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Context for validation - contains all data needed to validate
 */
export interface ValidationContext {
  character: Character | CharacterDraft;
  ruleset: MergedRuleset;
  creationMethod?: CreationMethod;
  creationState?: CreationState;
  campaign?: Campaign;
}

/**
 * A validator function that checks a specific constraint
 */
export type ConstraintValidator = (
  constraint: CreationConstraint,
  context: ValidationContext
) => ValidationError | null;

// =============================================================================
// CONSTRAINT VALIDATOR REGISTRY
// =============================================================================

/**
 * Registry of constraint validators by type
 */
const constraintValidators: Record<ConstraintType, ConstraintValidator> = {
  "attribute-limit": validateAttributeLimit,
  "skill-limit": validateSkillLimit,
  "budget-balance": validateBudgetBalance,
  "required-selection": validateRequiredSelection,
  "forbidden-combination": validateForbiddenCombination,
  "required-combination": validateRequiredCombination,
  "essence-minimum": validateEssenceMinimum,
  "equipment-rating": validateEquipmentRatings,
  "special-attribute-init": validateSpecialAttributeInit,
  "sum-to-ten-budget": validateSumToTenBudget,
  "point-buy-budget": validatePointBuyBudget,
  "life-modules-budget": validateLifeModulesBudget,
  "life-modules-skill-cap": validateLifeModulesSkillCap,
  custom: validateCustom,
};

// =============================================================================
// MAIN VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate a single constraint
 */
export function validateConstraint(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const validator = constraintValidators[constraint.type];

  if (!validator) {
    // Unknown constraint type — return null rather than logging in production.
    // All supported types are registered in constraintValidators above.
    return null;
  }

  return validator(constraint, context);
}

/**
 * Validate all constraints from a creation method
 */
export function validateAllConstraints(
  constraints: CreationConstraint[],
  context: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  for (const constraint of constraints) {
    const result = validateConstraint(constraint, context);

    if (result) {
      if (result.severity === "error") {
        errors.push(result);
      } else {
        warnings.push(result);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a character against the ruleset and creation method
 */
export function validateCharacter(context: ValidationContext): ValidationResult {
  const { creationMethod } = context;

  if (!creationMethod) {
    // Without a creation method, we can only do basic validation
    return validateBasicCharacter(context);
  }

  return validateAllConstraints(creationMethod.constraints, context);
}

/**
 * Basic character validation without creation method constraints
 */
function validateBasicCharacter(context: ValidationContext): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const { character, ruleset } = context;

  // Check metatype exists
  if (!character.metatype) {
    errors.push({
      constraintId: "basic-metatype",
      field: "metatype",
      message: "Character must have a metatype",
      severity: "error",
    });
  }

  // Check name exists
  if (!character.name || character.name.trim() === "") {
    errors.push({
      constraintId: "basic-name",
      field: "name",
      message: "Character must have a name",
      severity: "error",
    });
  }

  // Check essence is valid
  const essence = character.specialAttributes?.essence ?? 6;
  if (essence < 0 || essence > 6) {
    errors.push({
      constraintId: "basic-essence",
      field: "essence",
      message: "Essence must be between 0 and 6",
      severity: "error",
    });
  }

  // Validate qualities if ruleset is available and character is not a draft
  if (ruleset && character.status !== "draft") {
    const qualityValidation = validateAllQualities(character as Character, ruleset);
    for (const error of qualityValidation.errors) {
      errors.push({
        constraintId: "quality-validation",
        field: `qualities.${error.qualityId}`,
        message: error.message,
        severity: "error",
      });
    }

    // Validate karma limits
    const karmaValidation = validateKarmaLimits(character as Character, ruleset);
    for (const error of karmaValidation.errors) {
      errors.push({
        constraintId: "quality-karma-limit",
        field: error.field,
        message: error.message,
        severity: "error",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a specific step in the creation process
 */
export function validateStep(stepId: string, context: ValidationContext): ValidationResult {
  const { creationMethod } = context;

  if (!creationMethod) {
    return { valid: true, errors: [], warnings: [] };
  }

  const step = creationMethod.steps.find((s) => s.id === stepId);
  if (!step) {
    return { valid: true, errors: [], warnings: [] };
  }

  // Get step-specific constraints
  const stepConstraints = step.constraints || [];

  return validateAllConstraints(stepConstraints, context);
}

// =============================================================================
// BUDGET VALIDATION HELPERS
// =============================================================================

/**
 * Calculate remaining budget based on character data
 */
export function calculateRemainingBudget(
  budgetId: string,
  _character: Character | CharacterDraft,
  creationState?: CreationState
): number {
  if (!creationState) {
    throw new Error(
      `calculateRemainingBudget: creationState is required but was ${String(creationState)}. ` +
        `Cannot determine budget "${budgetId}" without creation state.`
    );
  }

  if (creationState.budgets[budgetId] === undefined) {
    throw new Error(
      `calculateRemainingBudget: budget "${budgetId}" not found in creationState. ` +
        `Available budgets: ${Object.keys(creationState.budgets).join(", ") || "(none)"}`
    );
  }

  return creationState.budgets[budgetId];
}

/**
 * Validate that all points/resources have been spent appropriately
 */
export function validateBudgetsComplete(context: ValidationContext): ValidationResult {
  const { creationMethod, creationState } = context;
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!creationMethod || !creationState) {
    return { valid: true, errors, warnings };
  }

  for (const budget of creationMethod.budgets) {
    const remaining = creationState.budgets[budget.id] ?? 0;
    const min = budget.min ?? 0;

    // Check if budget is overspent
    if (remaining < min) {
      errors.push({
        constraintId: `budget-${budget.id}-overspent`,
        field: budget.id,
        message: `${budget.label} is overspent by ${Math.abs(remaining - min)}`,
        severity: "error",
      });
    }

    // Warn if budget has remaining points (optional - might be intended)
    if (remaining > 0 && budget.id !== "nuyen" && budget.id !== "karma") {
      warnings.push({
        constraintId: `budget-${budget.id}-remaining`,
        field: budget.id,
        message: `${budget.label} has ${remaining} points remaining`,
        severity: "warning",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// ATTRIBUTE VALIDATION HELPERS
// =============================================================================

/**
 * Get metatype attribute limits
 */
export function getMetatypeAttributeLimits(
  metatypeId: string,
  ruleset: MergedRuleset
): Record<string, { min: number; max: number }> | null {
  const metatypesModule = getModule<{
    metatypes: Array<{
      id: string;
      attributes: Record<string, { min: number; max: number } | { base: number }>;
    }>;
  }>(ruleset, "metatypes");

  if (!metatypesModule) return null;

  const metatype = metatypesModule.metatypes.find(
    (m) => m.id.toLowerCase() === metatypeId.toLowerCase()
  );

  if (!metatype) return null;

  // Convert to consistent format
  const limits: Record<string, { min: number; max: number }> = {};
  for (const [attrId, value] of Object.entries(metatype.attributes)) {
    if ("min" in value && "max" in value) {
      limits[attrId] = { min: value.min, max: value.max };
    }
  }

  return limits;
}

/**
 * Check if an attribute value is within metatype limits
 */
export function isAttributeWithinLimits(
  attributeId: string,
  value: number,
  metatypeId: string,
  ruleset: MergedRuleset
): boolean {
  const limits = getMetatypeAttributeLimits(metatypeId, ruleset);
  if (!limits || !limits[attributeId]) return true;

  const { min, max } = limits[attributeId];
  return value >= min && value <= max;
}
