/**
 * Modifier Templates
 *
 * Pre-built situational modifier definitions for common SR5 scenarios.
 * GMs can apply these directly or use them as starting points for custom modifiers.
 *
 * @see Issue #114
 */

import type { Effect, EffectType, EffectTrigger } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Categories for grouping modifier templates in the UI.
 */
export type ModifierCategory =
  | "cover"
  | "visibility"
  | "environmental"
  | "social"
  | "combat"
  | "magic";

/**
 * Duration presets for modifier expiration.
 */
export type DurationPreset = "combat-turn" | "minute" | "scene" | "hour" | "permanent";

/**
 * A pre-built modifier template that GMs can apply to characters.
 */
export interface ModifierTemplate {
  /** Unique template identifier (kebab-case) */
  id: string;

  /** Display name */
  name: string;

  /** Template category for UI grouping */
  category: ModifierCategory;

  /** Suggested source for the modifier */
  source: "gm" | "environment" | "condition" | "temporary";

  /** The effect definition to apply */
  effect: Effect;

  /** Default duration preset */
  defaultDuration: DurationPreset;

  /** Human-readable description with SR5 page reference */
  description: string;
}

// =============================================================================
// HELPER
// =============================================================================

function createEffect(
  id: string,
  type: EffectType,
  triggers: EffectTrigger[],
  value: number,
  description: string
): Effect {
  return {
    id,
    type,
    triggers,
    target: {},
    value,
    description,
  };
}

// =============================================================================
// TEMPLATES
// =============================================================================

export const MODIFIER_TEMPLATES: ModifierTemplate[] = [
  // ── Cover ──────────────────────────────────────────────────────────────
  {
    id: "partial-cover",
    name: "Partial Cover",
    category: "cover",
    source: "environment",
    effect: createEffect(
      "partial-cover-effect",
      "dice-pool-modifier",
      ["ranged-attack"],
      -2,
      "Target behind partial cover"
    ),
    defaultDuration: "scene",
    description: "Target is behind partial cover (-2 to ranged attacks). SR5 p.192",
  },
  {
    id: "good-cover",
    name: "Good Cover",
    category: "cover",
    source: "environment",
    effect: createEffect(
      "good-cover-effect",
      "dice-pool-modifier",
      ["ranged-attack"],
      -4,
      "Target behind good cover"
    ),
    defaultDuration: "scene",
    description: "Target is behind good cover (-4 to ranged attacks). SR5 p.192",
  },

  // ── Visibility ─────────────────────────────────────────────────────────
  {
    id: "light-rain-fog",
    name: "Light Rain/Fog",
    category: "visibility",
    source: "environment",
    effect: createEffect(
      "light-rain-fog-effect",
      "dice-pool-modifier",
      ["ranged-attack", "perception-visual"],
      -1,
      "Light rain, fog, or smoke"
    ),
    defaultDuration: "scene",
    description:
      "Light rain, fog, or smoke (-1 to visual perception and ranged attacks). SR5 p.175",
  },
  {
    id: "heavy-rain-fog",
    name: "Heavy Rain/Fog",
    category: "visibility",
    source: "environment",
    effect: createEffect(
      "heavy-rain-fog-effect",
      "dice-pool-modifier",
      ["ranged-attack", "perception-visual"],
      -3,
      "Heavy rain, fog, or smoke"
    ),
    defaultDuration: "scene",
    description:
      "Heavy rain, fog, or smoke (-3 to visual perception and ranged attacks). SR5 p.175",
  },
  {
    id: "total-darkness",
    name: "Total Darkness",
    category: "visibility",
    source: "environment",
    effect: createEffect(
      "total-darkness-effect",
      "dice-pool-modifier",
      ["ranged-attack", "perception-visual"],
      -6,
      "Total darkness"
    ),
    defaultDuration: "scene",
    description: "Total darkness (-6 to visual perception and ranged attacks). SR5 p.175",
  },

  // ── Environmental ──────────────────────────────────────────────────────
  {
    id: "background-count-1",
    name: "Background Count (1)",
    category: "environmental",
    source: "environment",
    effect: createEffect(
      "background-count-1-effect",
      "dice-pool-modifier",
      ["magic-use"],
      -1,
      "Mild background count"
    ),
    defaultDuration: "scene",
    description: "Mild astral background count (-1 to magic tests). SR5 p.174",
  },
  {
    id: "background-count-2",
    name: "Background Count (2)",
    category: "environmental",
    source: "environment",
    effect: createEffect(
      "background-count-2-effect",
      "dice-pool-modifier",
      ["magic-use"],
      -2,
      "Moderate background count"
    ),
    defaultDuration: "scene",
    description: "Moderate astral background count (-2 to magic tests). SR5 p.174",
  },
  {
    id: "loud-noise",
    name: "Loud Noise",
    category: "environmental",
    source: "environment",
    effect: createEffect(
      "loud-noise-effect",
      "dice-pool-modifier",
      ["perception-audio"],
      -2,
      "Loud ambient noise"
    ),
    defaultDuration: "scene",
    description: "Loud ambient noise (-2 to audio perception tests). SR5 p.174",
  },

  // ── Combat ─────────────────────────────────────────────────────────────
  {
    id: "running-target",
    name: "Running Target",
    category: "combat",
    source: "temporary",
    effect: createEffect(
      "running-target-effect",
      "dice-pool-modifier",
      ["ranged-attack"],
      -2,
      "Target is running"
    ),
    defaultDuration: "combat-turn",
    description: "Target is running (-2 to ranged attacks against them). SR5 p.178",
  },
  {
    id: "called-shot",
    name: "Called Shot",
    category: "combat",
    source: "temporary",
    effect: createEffect(
      "called-shot-effect",
      "dice-pool-modifier",
      ["combat-action"],
      -4,
      "Called shot penalty"
    ),
    defaultDuration: "combat-turn",
    description: "Called shot penalty (-4 to the attack test). SR5 p.178",
  },
  {
    id: "blind-fire",
    name: "Blind Fire",
    category: "combat",
    source: "temporary",
    effect: createEffect(
      "blind-fire-effect",
      "dice-pool-modifier",
      ["ranged-attack"],
      -6,
      "Firing without seeing target"
    ),
    defaultDuration: "combat-turn",
    description: "Firing without seeing the target (-6 to ranged attacks). SR5 p.178",
  },

  // ── Social ─────────────────────────────────────────────────────────────
  {
    id: "positive-reputation",
    name: "Positive Reputation",
    category: "social",
    source: "condition",
    effect: createEffect(
      "positive-reputation-effect",
      "dice-pool-modifier",
      ["social-test"],
      2,
      "Positive street reputation"
    ),
    defaultDuration: "scene",
    description: "Character has a positive reputation (+2 to social tests). SR5 p.140",
  },
  {
    id: "negative-reputation",
    name: "Negative Reputation",
    category: "social",
    source: "condition",
    effect: createEffect(
      "negative-reputation-effect",
      "dice-pool-modifier",
      ["social-test"],
      -2,
      "Negative street reputation"
    ),
    defaultDuration: "scene",
    description: "Character has a negative reputation (-2 to social tests). SR5 p.140",
  },

  // ── Magic ──────────────────────────────────────────────────────────────
  {
    id: "sustained-spell",
    name: "Sustained Spell",
    category: "magic",
    source: "condition",
    effect: createEffect(
      "sustained-spell-effect",
      "dice-pool-modifier",
      ["always"],
      -2,
      "Sustaining a spell"
    ),
    defaultDuration: "permanent",
    description: "Penalty for sustaining a spell (-2 to all tests per sustained spell). SR5 p.281",
  },
  {
    id: "aspected-domain",
    name: "Aspected Domain",
    category: "magic",
    source: "environment",
    effect: createEffect(
      "aspected-domain-effect",
      "dice-pool-modifier",
      ["magic-use"],
      2,
      "Aspected astral domain"
    ),
    defaultDuration: "scene",
    description: "Aspected astral domain aligned with caster (+2 to magic tests). SR5 p.281",
  },
];

/**
 * Look up a modifier template by ID.
 */
export function getModifierTemplate(id: string): ModifierTemplate | undefined {
  return MODIFIER_TEMPLATES.find((t) => t.id === id);
}
