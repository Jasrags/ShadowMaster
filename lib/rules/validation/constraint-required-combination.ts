/**
 * Required Combination Constraint Validator
 *
 * Validates that if a character has item X, they must also have item Y.
 */

import type { CreationConstraint, ValidationError } from "@/lib/types";
import type { ValidationContext } from "../constraint-validation";

/**
 * Validate required combinations (must have X if you have Y)
 */
export function validateRequiredCombination(
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
    ]
      .map((q) => (q.qualityId || q.id || "").toLowerCase())
      .filter((id) => id);

    if (
      allQualities.includes(params.ifHas.toLowerCase()) &&
      !allQualities.includes(params.mustHave.toLowerCase())
    ) {
      return {
        constraintId: constraint.id,
        message:
          constraint.errorMessage || `Having "${params.ifHas}" requires "${params.mustHave}"`,
        severity: constraint.severity,
      };
    }
  }

  return null;
}
