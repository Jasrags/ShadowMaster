/**
 * Complex Form Validation Service
 *
 * Provides validation for complex form allocation for technomancer characters.
 * Mirrors the spell-validator.ts pattern.
 */

import type { Character } from "@/lib/types/character";
import type {
  SpellValidationResult,
  MagicValidationError,
  MagicValidationWarning,
} from "@/lib/types/magic";
import type { LoadedRuleset, ComplexFormData } from "../loader-types";
import { extractComplexForms } from "../loader";

// =============================================================================
// COMPLEX FORM VALIDATION
// =============================================================================

/**
 * Check if a character can use complex forms (must be a technomancer).
 *
 * @param character - The character to check
 * @returns True if character can use complex forms
 */
export function canUseComplexForms(character: Partial<Character>): boolean {
  return character.magicalPath === "technomancer";
}

/**
 * Validate complex form allocation against character's form budget.
 *
 * @param character - The character to validate
 * @param formIds - Array of complex form IDs to validate
 * @param formLimit - Maximum number of complex forms allowed
 * @param ruleset - The loaded ruleset containing complex form data
 * @returns Validation result
 */
export function validateComplexFormAllocation(
  character: Partial<Character>,
  formIds: string[],
  formLimit: number,
  ruleset: LoadedRuleset
): SpellValidationResult {
  const errors: MagicValidationError[] = [];
  const warnings: MagicValidationWarning[] = [];

  // Check character can use complex forms
  if (!canUseComplexForms(character)) {
    errors.push({
      code: "CF_CANNOT_USE",
      message: "Character's magical path does not allow complex forms (must be technomancer)",
      field: "magicalPath",
    });
    return {
      valid: false,
      errors,
      warnings,
      budgetRemaining: 0,
      budgetTotal: 0,
    };
  }

  // Check form limit
  if (formIds.length > formLimit) {
    errors.push({
      code: "CF_LIMIT_EXCEEDED",
      message: `Cannot select more than ${formLimit} complex forms (selected: ${formIds.length})`,
      field: "complexForms",
    });
  }

  // Validate each form exists in ruleset
  const formsCatalog = extractComplexForms(ruleset);
  const invalidForms: string[] = [];
  const duplicateForms: string[] = [];
  const seenForms = new Set<string>();

  for (const formId of formIds) {
    // Check for duplicates
    if (seenForms.has(formId)) {
      duplicateForms.push(formId);
    } else {
      seenForms.add(formId);
    }

    // Check form exists in catalog
    const form = formsCatalog.find((f) => f.id === formId);
    if (!form) {
      invalidForms.push(formId);
    }
  }

  if (invalidForms.length > 0) {
    errors.push({
      code: "CF_NOT_FOUND",
      message: `Complex forms not found in ruleset: ${invalidForms.join(", ")}`,
      field: "complexForms",
    });
  }

  if (duplicateForms.length > 0) {
    errors.push({
      code: "CF_DUPLICATE",
      message: `Duplicate complex forms selected: ${duplicateForms.join(", ")}`,
      field: "complexForms",
    });
  }

  const uniqueFormCount = seenForms.size;
  const budgetRemaining = Math.max(0, formLimit - uniqueFormCount);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    budgetRemaining,
    budgetTotal: formLimit,
  };
}

/**
 * Get complex form definition from ruleset.
 *
 * @param formId - The form ID to look up
 * @param ruleset - The loaded ruleset
 * @returns Complex form data or null if not found
 */
export function getComplexFormDefinition(
  formId: string,
  ruleset: LoadedRuleset
): ComplexFormData | null {
  const formsCatalog = extractComplexForms(ruleset);
  return formsCatalog.find((f) => f.id === formId) ?? null;
}

/**
 * Get all complex forms from the ruleset.
 */
export function getAllComplexForms(ruleset: LoadedRuleset): ComplexFormData[] {
  return extractComplexForms(ruleset);
}
