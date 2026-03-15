/**
 * Forbidden Combination Constraint Validator
 *
 * Validates that certain items cannot coexist on a character.
 */

import type { CreationConstraint, ValidationError } from "@/lib/types";
import type { ValidationContext } from "../constraint-validation";

/**
 * Validate forbidden combinations (cannot have X and Y together)
 */
export function validateForbiddenCombination(
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
      ]
        .map((q) => q.qualityId || q.id)
        .filter((id): id is string => !!id);
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
      message: constraint.errorMessage || `Cannot have these together: ${forbidden.join(", ")}`,
      severity: constraint.severity,
    };
  }

  return null;
}
