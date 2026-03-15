/**
 * Essence Minimum Constraint Validator
 *
 * Validates that a character's Essence does not drop below the minimum threshold.
 */

import type { CreationConstraint, ValidationError } from "@/lib/types";
import type { ValidationContext } from "../constraint-validation";

/**
 * Validate essence minimum
 */
export function validateEssenceMinimum(
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
