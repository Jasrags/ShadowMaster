/**
 * Constants for the unified effect system.
 *
 * Canonical sets of all valid EffectTrigger and EffectType values,
 * used by data validation tests and runtime code.
 */

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

/** All 18 EffectType values from the unified type system (including "special"). */
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
