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
} from "../types";
import { getModule } from "./merge";

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
}

/**
 * A validator function that checks a specific constraint
 */
type ConstraintValidator = (
  constraint: CreationConstraint,
  context: ValidationContext
) => ValidationError | null;

// =============================================================================
// CONSTRAINT VALIDATORS
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
  custom: validateCustom,
};

/**
 * Validate attribute limits (e.g., only one attribute at max)
 */
function validateAttributeLimit(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { character, ruleset } = context;
  const params = constraint.params as {
    maxAtMax?: number;
    attributeId?: string;
    maxValue?: number;
  };

  // Get metatype limits from ruleset
  const metatypesModule = getModule<{
    metatypes: Array<{
      id: string;
      attributes: Record<string, { min: number; max: number }>;
    }>;
  }>(ruleset, "metatypes");

  if (!metatypesModule) return null;

  const metatype = metatypesModule.metatypes.find(
    (m) => m.id === character.metatype?.toLowerCase()
  );

  if (!metatype) return null;

  // Check "only one attribute at max" constraint
  if (params.maxAtMax !== undefined) {
    let atMaxCount = 0;

    for (const [attrId, value] of Object.entries(character.attributes || {})) {
      const limit = metatype.attributes[attrId];
      if (limit && "max" in limit && value >= limit.max) {
        atMaxCount++;
      }
    }

    if (atMaxCount > params.maxAtMax) {
      return {
        constraintId: constraint.id,
        message: constraint.errorMessage || `Only ${params.maxAtMax} attribute(s) can be at natural maximum`,
        severity: constraint.severity,
      };
    }
  }

  // Check specific attribute max value
  if (params.attributeId && params.maxValue !== undefined) {
    const value = character.attributes?.[params.attributeId] || 0;
    if (value > params.maxValue) {
      return {
        constraintId: constraint.id,
        field: params.attributeId,
        message: constraint.errorMessage || `${params.attributeId} cannot exceed ${params.maxValue}`,
        severity: constraint.severity,
      };
    }
  }

  return null;
}

/**
 * Validate skill limits
 */
function validateSkillLimit(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { character } = context;
  const params = constraint.params as {
    max?: number;
    maxWithAptitude?: number;
  };

  const hasAptitude = character.positiveQualities?.some(q => q.id === "aptitude");
  const maxRating = hasAptitude ? (params.maxWithAptitude || 7) : (params.max || 6);

  for (const [skillId, rating] of Object.entries(character.skills || {})) {
    if (rating > maxRating) {
      return {
        constraintId: constraint.id,
        field: skillId,
        message: constraint.errorMessage || `Skill rating cannot exceed ${maxRating} at creation`,
        severity: constraint.severity,
      };
    }
  }

  return null;
}

/**
 * Validate budget balance (must be >= min, usually 0)
 */
function validateBudgetBalance(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { creationState } = context;
  const params = constraint.params as {
    budgetId: string;
    min?: number;
    max?: number;
  };

  if (!creationState?.budgets) return null;

  const budgetValue = creationState.budgets[params.budgetId];
  if (budgetValue === undefined) return null;

  const minValue = params.min ?? 0;

  if (budgetValue < minValue) {
    return {
      constraintId: constraint.id,
      field: params.budgetId,
      message: constraint.errorMessage || `Budget "${params.budgetId}" cannot go below ${minValue}`,
      severity: constraint.severity,
    };
  }

  if (params.max !== undefined && budgetValue > params.max) {
    return {
      constraintId: constraint.id,
      field: params.budgetId,
      message: constraint.errorMessage || `Budget "${params.budgetId}" cannot exceed ${params.max}`,
      severity: constraint.severity,
    };
  }

  return null;
}

/**
 * Validate required selection (must select at least N items)
 */
function validateRequiredSelection(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { character, creationState } = context;
  const params = constraint.params as {
    target: string;
    minCount?: number;
  };

  const minCount = params.minCount ?? 1;
  let actualCount = 0;

  switch (params.target) {
    case "metatype":
      actualCount = character.metatype ? 1 : 0;
      break;
    case "magical-path":
      actualCount = character.magicalPath ? 1 : 0;
      break;
    case "qualities":
      actualCount =
        (character.positiveQualities?.length || 0) +
        (character.negativeQualities?.length || 0);
      break;
    case "priorities":
      actualCount = Object.keys(creationState?.priorities || {}).length;
      break;
    default:
      // Check in creationState selections
      const selection = creationState?.selections?.[params.target];
      if (Array.isArray(selection)) {
        actualCount = selection.length;
      } else if (selection) {
        actualCount = 1;
      }
  }

  if (actualCount < minCount) {
    return {
      constraintId: constraint.id,
      field: params.target,
      message: constraint.errorMessage || `Must select at least ${minCount} ${params.target}`,
      severity: constraint.severity,
    };
  }

  return null;
}

/**
 * Validate forbidden combinations (cannot have X and Y together)
 */
function validateForbiddenCombination(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { character } = context;
  const params = constraint.params as {
    items: string[];
    type?: "quality" | "metatype" | "skill";
  };

  const type = params.type || "quality";
  let presentItems: string[] = [];

  switch (type) {
    case "quality":
      presentItems = [
        ...(character.positiveQualities || []),
        ...(character.negativeQualities || []),
      ].map(q => q.id);
      break;
    case "skill":
      presentItems = Object.keys(character.skills || {});
      break;
  }

  const forbidden = params.items.filter((item) =>
    presentItems.map((i) => i.toLowerCase()).includes(item.toLowerCase())
  );

  if (forbidden.length > 1) {
    return {
      constraintId: constraint.id,
      message:
        constraint.errorMessage ||
        `Cannot have these together: ${forbidden.join(", ")}`,
      severity: constraint.severity,
    };
  }

  return null;
}

/**
 * Validate required combinations (must have X if you have Y)
 */
function validateRequiredCombination(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { character } = context;
  const params = constraint.params as {
    ifHas: string;
    mustHave: string;
    type?: "quality" | "attribute";
  };

  const type = params.type || "quality";

  if (type === "quality") {
    const allQualities = [
      ...(character.positiveQualities || []),
      ...(character.negativeQualities || []),
    ].map((q) => q.id.toLowerCase());

    if (
      allQualities.includes(params.ifHas.toLowerCase()) &&
      !allQualities.includes(params.mustHave.toLowerCase())
    ) {
      return {
        constraintId: constraint.id,
        message:
          constraint.errorMessage ||
          `Having "${params.ifHas}" requires "${params.mustHave}"`,
        severity: constraint.severity,
      };
    }
  }

  return null;
}

/**
 * Validate essence minimum
 */
function validateEssenceMinimum(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { character } = context;
  const params = constraint.params as { min: number };

  const essence = character.specialAttributes?.essence ?? 6;
  const minEssence = params.min ?? 0;

  if (essence < minEssence) {
    return {
      constraintId: constraint.id,
      field: "essence",
      message: constraint.errorMessage || `Essence cannot drop below ${minEssence}`,
      severity: constraint.severity,
    };
  }

  return null;
}

/**
 * Custom validation - placeholder for extensibility
 */
function validateCustom(
): ValidationError | null {
  // Custom validators would be registered and looked up by name
  // For now, this is a placeholder that always passes
  // const params = _constraint.params as { validatorName?: string };

  // In the future, we could have a registry of custom validators:
  // const validator = customValidators[params.validatorName];
  // if (validator) return validator(constraint, context);

  return null;
}

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
    console.warn(`No validator for constraint type: ${constraint.type}`);
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
  const { character } = context;

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

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a specific step in the creation process
 */
export function validateStep(
  stepId: string,
  context: ValidationContext
): ValidationResult {
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
  // If we have creation state with tracked budgets, use that
  if (creationState?.budgets?.[budgetId] !== undefined) {
    return creationState.budgets[budgetId];
  }

  // Otherwise, calculate from character data
  // This is a simplified calculation - real implementation would be more complex
  return 0;
}

/**
 * Validate that all points/resources have been spent appropriately
 */
export function validateBudgetsComplete(
  context: ValidationContext
): ValidationResult {
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

