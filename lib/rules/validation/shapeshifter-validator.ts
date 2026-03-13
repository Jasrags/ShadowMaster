/**
 * Shapeshifter Validator
 *
 * Validates shapeshifter-specific creation rules:
 * - Metahuman form must be selected
 * - Metahuman form must be valid (human, dwarf, elf, ork, troll)
 * - Technomancer path is forbidden (no Resonance for shapeshifters)
 *
 * Based on Run Faster pp. 101-107.
 */

import type { ValidatorDefinition, ValidationIssue } from "./types";
import { isShapeshifterMetatype, VALID_METAHUMAN_FORM_IDS } from "../shapeshifter";

// =============================================================================
// ERROR CODES
// =============================================================================

export const SHAPESHIFTER_ERROR_CODES = {
  NO_METAHUMAN_FORM: "SHAPESHIFTER_NO_METAHUMAN_FORM",
  INVALID_METAHUMAN_FORM: "SHAPESHIFTER_INVALID_METAHUMAN_FORM",
  RESONANCE_FORBIDDEN: "SHAPESHIFTER_RESONANCE_FORBIDDEN",
  TECHNOMANCER_FORBIDDEN: "SHAPESHIFTER_TECHNOMANCER_FORBIDDEN",
} as const;

// =============================================================================
// VALIDATOR
// =============================================================================

export const shapeshifterValidator: ValidatorDefinition = {
  id: "shapeshifter",
  name: "Shapeshifter Rules",
  description: "Validates shapeshifter metahuman form selection and path restrictions",
  modes: ["creation", "finalization"],
  priority: 15,
  validate: (context) => {
    const issues: ValidationIssue[] = [];
    const metatypeId = context.character.metatype;

    // Skip if not a shapeshifter
    if (!metatypeId || !isShapeshifterMetatype(metatypeId)) {
      return issues;
    }

    // Check for technomancer path (forbidden for shapeshifters)
    const magicalPath =
      context.creationState?.selections?.["magical-path"] ??
      (context.character as Record<string, unknown>).magicalPath;

    if (magicalPath === "technomancer") {
      issues.push({
        code: SHAPESHIFTER_ERROR_CODES.TECHNOMANCER_FORBIDDEN,
        message: "Shapeshifters cannot be Technomancers. They lack the ability to use Resonance.",
        field: "magical-path",
        severity: "error",
      });
    }

    // Check for Resonance attribute (should not exist for shapeshifters)
    const attributes = context.character.attributes as Record<string, unknown> | undefined;
    const resonance = attributes?.resonance;
    if (resonance !== undefined && resonance !== null && resonance !== 0) {
      issues.push({
        code: SHAPESHIFTER_ERROR_CODES.RESONANCE_FORBIDDEN,
        message: "Shapeshifters cannot have a Resonance attribute.",
        field: "attributes.resonance",
        severity: "error",
      });
    }

    // Check metahuman form selection
    const shapeshifterMetahumanForm =
      context.creationState?.selections?.shapeshifterMetahumanForm ??
      (context.character as Record<string, unknown>).shapeshifterMetahumanForm;

    if (!shapeshifterMetahumanForm) {
      issues.push({
        code: SHAPESHIFTER_ERROR_CODES.NO_METAHUMAN_FORM,
        message:
          "Shapeshifters must select a metahuman form (Human, Dwarf, Elf, Ork, or Troll).",
        field: "shapeshifterMetahumanForm",
        severity: "error",
        suggestion: "Select a metahuman form in the Metatype section.",
      });
    } else if (!VALID_METAHUMAN_FORM_IDS.includes(shapeshifterMetahumanForm as string)) {
      issues.push({
        code: SHAPESHIFTER_ERROR_CODES.INVALID_METAHUMAN_FORM,
        message: `Invalid metahuman form "${shapeshifterMetahumanForm}". Must be one of: ${VALID_METAHUMAN_FORM_IDS.join(", ")}.`,
        field: "shapeshifterMetahumanForm",
        severity: "error",
      });
    }

    return issues;
  },
};
