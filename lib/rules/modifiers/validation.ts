/**
 * Modifier Validation
 *
 * Validates requests to add active modifiers to characters.
 * Follows the pattern from augmentation validation.
 *
 * @see Issue #114
 */

import type { EffectType, EffectTrigger } from "@/lib/types/effects";
import type { DurationPreset } from "./templates";
import { getModifierTemplate } from "./templates";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Request body for adding a modifier via API.
 * Either templateId (to apply a pre-built template) or name+effect (for custom).
 */
export interface AddModifierRequest {
  /** Template ID to apply (mutually exclusive with name+effect) */
  templateId?: string;

  /** Custom modifier name (required if no templateId) */
  name?: string;

  /** Source of the modifier */
  source: "gm" | "environment" | "condition" | "temporary";

  /** Custom effect definition (required if no templateId) */
  effect?: {
    type: EffectType;
    triggers: EffectTrigger[];
    value: number;
  };

  /** Duration preset */
  duration: DurationPreset;

  /** Optional notes */
  notes?: string;

  /** Number of uses before expiration */
  expiresAfterUses?: number;
}

export interface ModifierValidationError {
  field: string;
  message: string;
}

export interface ModifierValidationResult {
  valid: boolean;
  errors: ModifierValidationError[];
}

// =============================================================================
// VALID VALUES
// =============================================================================

const VALID_SOURCES = new Set(["gm", "environment", "condition", "temporary"]);

const VALID_DURATIONS = new Set(["combat-turn", "minute", "scene", "hour", "permanent"]);

const VALID_EFFECT_TYPES = new Set<EffectType>([
  "dice-pool-modifier",
  "limit-modifier",
  "threshold-modifier",
  "attribute-modifier",
  "attribute-maximum",
  "initiative-modifier",
  "wound-modifier",
  "resistance-modifier",
  "healing-modifier",
  "karma-cost-modifier",
  "nuyen-cost-modifier",
  "time-modifier",
  "signature-modifier",
  "glitch-modifier",
  "accuracy-modifier",
  "recoil-compensation",
  "damage-resistance-modifier",
  "armor-modifier",
  "special",
]);

const VALID_TRIGGERS = new Set<EffectTrigger>([
  "always",
  "skill-test",
  "attribute-test",
  "combat-action",
  "defense-test",
  "resistance-test",
  "social-test",
  "magic-use",
  "matrix-action",
  "healing",
  "perception-audio",
  "perception-visual",
  "ranged-attack",
  "melee-attack",
  "damage-resistance",
  "full-defense",
  "first-meeting",
  "damage-taken",
  "fear-intimidation",
  "withdrawal",
  "on-exposure",
]);

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate an AddModifierRequest.
 */
export function validateAddModifier(body: AddModifierRequest): ModifierValidationResult {
  const errors: ModifierValidationError[] = [];

  // Source is always required
  if (!body.source) {
    errors.push({ field: "source", message: "Source is required" });
  } else if (!VALID_SOURCES.has(body.source)) {
    errors.push({ field: "source", message: `Invalid source: ${body.source}` });
  }

  // Duration is always required
  if (!body.duration) {
    errors.push({ field: "duration", message: "Duration is required" });
  } else if (!VALID_DURATIONS.has(body.duration)) {
    errors.push({ field: "duration", message: `Invalid duration: ${body.duration}` });
  }

  // Template mode vs custom mode
  if (body.templateId) {
    const template = getModifierTemplate(body.templateId);
    if (!template) {
      errors.push({ field: "templateId", message: `Unknown template: ${body.templateId}` });
    }
  } else {
    // Custom mode: name and effect are required
    if (!body.name || body.name.trim().length === 0) {
      errors.push({ field: "name", message: "Name is required for custom modifiers" });
    }

    if (!body.effect) {
      errors.push({ field: "effect", message: "Effect is required for custom modifiers" });
    } else {
      if (!body.effect.type || !VALID_EFFECT_TYPES.has(body.effect.type)) {
        errors.push({
          field: "effect.type",
          message: `Invalid effect type: ${body.effect.type}`,
        });
      }

      if (
        !body.effect.triggers ||
        !Array.isArray(body.effect.triggers) ||
        body.effect.triggers.length === 0
      ) {
        errors.push({
          field: "effect.triggers",
          message: "At least one trigger is required",
        });
      } else {
        for (const trigger of body.effect.triggers) {
          if (!VALID_TRIGGERS.has(trigger)) {
            errors.push({
              field: "effect.triggers",
              message: `Invalid trigger: ${trigger}`,
            });
          }
        }
      }

      if (typeof body.effect.value !== "number") {
        errors.push({
          field: "effect.value",
          message: "Effect value must be a number",
        });
      }
    }
  }

  // Optional: expiresAfterUses must be positive integer
  if (body.expiresAfterUses !== undefined) {
    if (!Number.isInteger(body.expiresAfterUses) || body.expiresAfterUses < 1) {
      errors.push({
        field: "expiresAfterUses",
        message: "expiresAfterUses must be a positive integer",
      });
    }
  }

  return { valid: errors.length === 0, errors };
}
