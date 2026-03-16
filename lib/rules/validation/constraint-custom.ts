/**
 * Custom Constraint Validator
 *
 * Placeholder for extensibility - custom validators would be registered
 * and looked up by name.
 */

import type { CreationConstraint, ValidationError } from "@/lib/types";
import type { ValidationContext } from "../constraint-validation";

/**
 * Custom validation - placeholder for extensibility
 */
export function validateCustom(
  _constraint: CreationConstraint,
  _context: ValidationContext
): ValidationError | null {
  // Custom validators would be registered and looked up by name
  // For now, this is a placeholder that always passes
  // const params = _constraint.params as { validatorName?: string };

  // In the future, we could have a registry of custom validators:
  // const validator = customValidators[params.validatorName];
  // if (validator) return validator(_constraint, _context);

  return null;
}
