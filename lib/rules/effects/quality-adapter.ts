/**
 * Quality effect adapter for the unified effect system.
 *
 * Converts old-format quality effects (singular `trigger` string) to
 * unified Effect format (multi-trigger array) at runtime. Only effects
 * with standard triggers, types, and numeric/"rating" values are adapted;
 * non-standard effects are left for the old quality effect system.
 *
 * @see Issue #110
 */

import type { Effect, EffectTarget, EffectCondition } from "@/lib/types/effects";

// =============================================================================
// CONSTANTS — All valid values from EffectTrigger and EffectType
// =============================================================================

/** All 21 EffectTrigger values from the unified type system. */
export const UNIFIED_TRIGGERS: ReadonlySet<string> = new Set([
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

/** All 18 EffectType values from the unified type system (excluding "special"). */
export const UNIFIED_TYPES: ReadonlySet<string> = new Set([
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

// =============================================================================
// ADAPTER
// =============================================================================

/**
 * Attempt to adapt an old-format quality effect to unified Effect format.
 *
 * Returns null if the effect cannot be adapted (non-standard trigger,
 * type, value, or already in unified format).
 */
export function adaptQualityEffect(oldEffect: unknown): Effect | null {
  // Gate 1: Must be a non-null object with singular `trigger` string
  if (typeof oldEffect !== "object" || oldEffect === null) return null;

  const raw = oldEffect as Record<string, unknown>;

  // Gate: Already unified format (has triggers array) — skip
  if ("triggers" in raw && Array.isArray(raw.triggers)) return null;

  // Gate: Must have singular `trigger` string
  if (typeof raw.trigger !== "string") return null;

  // Gate 2: Trigger must be in unified set
  if (!UNIFIED_TRIGGERS.has(raw.trigger)) return null;

  // Gate 3: Type must be in unified set
  if (typeof raw.type !== "string" || !UNIFIED_TYPES.has(raw.type)) return null;

  // Gate 4: Value must be number or string "rating"
  let value: Effect["value"];
  if (typeof raw.value === "number") {
    value = raw.value;
  } else if (raw.value === "rating") {
    value = { perRating: 1 };
  } else {
    return null;
  }

  // Build target — explicit field-by-field copy of recognized EffectTarget fields
  const target: EffectTarget = {};
  if (typeof raw.target === "object" && raw.target !== null) {
    const rawTarget = raw.target as Record<string, unknown>;
    if (typeof rawTarget.stat === "string") target.stat = rawTarget.stat;
    if (typeof rawTarget.limit === "string")
      target.limit = rawTarget.limit as EffectTarget["limit"];
    if (typeof rawTarget.attribute === "string") target.attribute = rawTarget.attribute;
    if (typeof rawTarget.skill === "string") target.skill = rawTarget.skill;
    if (typeof rawTarget.skillGroup === "string") target.skillGroup = rawTarget.skillGroup;
    if (typeof rawTarget.testCategory === "string") target.testCategory = rawTarget.testCategory;
    if (typeof rawTarget.matrixAction === "string") target.matrixAction = rawTarget.matrixAction;
    if (typeof rawTarget.affectsOthers === "boolean")
      target.affectsOthers = rawTarget.affectsOthers;
  }

  // Build condition — explicit field-by-field copy of recognized EffectCondition fields
  let condition: EffectCondition | undefined;
  if (typeof raw.condition === "object" && raw.condition !== null) {
    const rawCondition = raw.condition as Record<string, unknown>;
    const built: EffectCondition = {};
    let hasRecognized = false;

    if (Array.isArray(rawCondition.environment)) {
      built.environment = rawCondition.environment as string[];
      hasRecognized = true;
    }
    if (Array.isArray(rawCondition.targetType)) {
      built.targetType = rawCondition.targetType as string[];
      hasRecognized = true;
    }
    if (Array.isArray(rawCondition.characterState)) {
      built.characterState = rawCondition.characterState as string[];
      hasRecognized = true;
    }
    if (typeof rawCondition.opposedBy === "string") {
      built.opposedBy = rawCondition.opposedBy;
      hasRecognized = true;
    }
    if (typeof rawCondition.customCondition === "string") {
      built.customCondition = rawCondition.customCondition;
      hasRecognized = true;
    }

    if (hasRecognized) {
      condition = built;
    }
  }

  // Build the unified effect
  const adapted: Effect = {
    id: typeof raw.id === "string" ? raw.id : "adapted-effect",
    type: raw.type as Effect["type"],
    triggers: [raw.trigger as Effect["triggers"][number]],
    target,
    value,
  };

  if (typeof raw.description === "string") {
    adapted.description = raw.description;
  }

  if (condition) {
    adapted.condition = condition;
  }

  return adapted;
}
