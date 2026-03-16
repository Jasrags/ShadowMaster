/**
 * Budget Balance Constraint Validator
 *
 * Validates that budgets are within their allowed min/max range.
 */

import type { CreationConstraint, ValidationError } from "@/lib/types";
import type { ValidationContext } from "../constraint-validation";

/**
 * Validate budget balance (must be >= min, usually 0)
 */
export function validateBudgetBalance(
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
