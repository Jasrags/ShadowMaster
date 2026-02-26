/**
 * Modifiers module barrel export
 *
 * @see Issue #114
 */

export { MODIFIER_TEMPLATES, getModifierTemplate } from "./templates";
export type { ModifierTemplate, ModifierCategory, DurationPreset } from "./templates";

export { validateAddModifier } from "./validation";
export type {
  AddModifierRequest,
  ModifierValidationResult,
  ModifierValidationError,
} from "./validation";

export { computeExpiresAt } from "./duration";
