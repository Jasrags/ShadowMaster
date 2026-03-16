/**
 * Required Selection Constraint Validator
 *
 * Validates that at least N items have been selected for a given target.
 */

import type { CreationConstraint, ValidationError } from "@/lib/types";
import type { ValidationContext } from "../constraint-validation";

/**
 * Validate required selection (must select at least N items)
 */
export function validateRequiredSelection(
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
        (character.positiveQualities?.length || 0) + (character.negativeQualities?.length || 0);
      break;
    case "priorities":
      actualCount = Object.keys(creationState?.priorities || {}).length;
      break;
    default: {
      // Check in creationState selections
      const selection = creationState?.selections?.[params.target];
      if (Array.isArray(selection)) {
        actualCount = selection.length;
      } else if (selection) {
        actualCount = 1;
      }
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
