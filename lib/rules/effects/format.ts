/**
 * Effect Badge Formatter
 *
 * Converts Effect objects into human-readable badge data for display
 * in character creation UI components.
 *
 * @see Issue #448
 */

import type { Effect, CharacterStateFlags } from "@/lib/types/effects";

export interface EffectBadge {
  /** Compact display text, e.g., "+2 Sneaking" */
  label: string;
  /** Tailwind color classes for the badge */
  colorClass: string;
  /** Trigger context for non-"always" effects, e.g., "withdrawal" */
  trigger?: string;
  /** Whether the trigger is currently active (for state-dependent styling) */
  triggerActive?: boolean;
}

/**
 * Optional context for resolving rating-based values and filtering conditions.
 */
export interface EffectBadgeContext {
  /** Pre-resolved numeric value (for "rating-based" effects) */
  resolvedValue?: number;
  /** Character's rating for this quality */
  rating?: number;
  /** Character's dependency type (for addiction condition filtering) */
  dependencyType?: string;
  /** Active character state flags for trigger-active styling */
  activeCharacterStates?: CharacterStateFlags;
}

/**
 * Effect type display configuration.
 */
const EFFECT_TYPE_CONFIG: Record<string, { name: string; colorClass: string } | undefined> = {
  "dice-pool-modifier": {
    name: "Dice Pool",
    colorClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  "limit-modifier": {
    name: "Limit",
    colorClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  "attribute-modifier": {
    name: "Attribute",
    colorClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  "initiative-modifier": {
    name: "Initiative",
    colorClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  },
  "armor-modifier": {
    name: "Armor",
    colorClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  "accuracy-modifier": {
    name: "Accuracy",
    colorClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  },
  "recoil-compensation": {
    name: "Recoil Comp",
    colorClass: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  },
  "wound-modifier": {
    name: "Wound",
    colorClass: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  },
  "resistance-modifier": {
    name: "Resistance",
    colorClass: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  },
  "threshold-modifier": {
    name: "Threshold",
    colorClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  },
  "damage-resistance-modifier": {
    name: "Damage Resist",
    colorClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  },
  "karma-cost-modifier": {
    name: "Karma Cost",
    colorClass: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  },
  "signature-modifier": {
    name: "Astral Signature",
    colorClass: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-300",
  },
  "glitch-modifier": {
    name: "Glitch",
    colorClass: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
  },
};

/**
 * Derive a short target name from an effect's target.
 */
function getTargetName(effect: Effect): string {
  const { target } = effect;
  if (!target) return "";

  if (target.skill) return capitalize(target.skill);
  if (target.skillGroup) return `${capitalize(target.skillGroup)} Group`;
  if (target.attribute) return capitalize(target.attribute);
  if (target.limit) return `${capitalize(target.limit)} Limit`;
  if (target.perceptionType) return `${capitalize(target.perceptionType)} Perception`;
  if (target.specificAction) return capitalize(target.specificAction.replace(/-/g, " "));
  if (target.testCategory) return capitalize(target.testCategory);
  if (target.weaponCategory?.length) return target.weaponCategory.map(capitalize).join(", ");
  if (target.stat) return capitalize(target.stat);

  // Category-level targets (e.g., addiction effects)
  const raw = target as Record<string, unknown>;
  if (typeof raw.attributeCategory === "string")
    return `${capitalize(raw.attributeCategory)} Tests`;
  if (typeof raw.skillCategory === "string") return `${capitalize(raw.skillCategory)} Tests`;

  return "";
}

/**
 * Format a numeric value with sign prefix.
 * Returns null for non-numeric values (e.g., "rating-based", "halved").
 */
function formatValue(value: number | { perRating: number }): string | null {
  if (typeof value === "number") {
    return value >= 0 ? `+${value}` : `${value}`;
  }
  if (typeof value === "object" && value !== null && typeof value.perRating === "number") {
    return value.perRating >= 0 ? `+${value.perRating}` : `${value.perRating}`;
  }
  return null;
}

/**
 * Capitalize a string, converting kebab-case to Title Case.
 */
function capitalize(str: string): string {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Format a trigger name for display (kebab-case to lowercase words).
 * Returns undefined for "always" trigger.
 */
function formatTrigger(triggers: string[]): string | undefined {
  // If all triggers are "always", no suffix needed
  if (triggers.every((t) => t === "always")) return undefined;

  // Use the first non-"always" trigger for display
  const trigger = triggers.find((t) => t !== "always");
  if (!trigger) return undefined;

  return trigger.replace(/-/g, " ");
}

/**
 * Check if an effect's conditions are met by the given context.
 * Returns false if the effect should be hidden.
 */
function matchesContext(effect: Effect, context?: EffectBadgeContext): boolean {
  if (!context) return true;

  const condition = effect.condition as Record<string, unknown> | undefined;
  if (!condition) return true;

  // minRating: hide if character's rating is below threshold
  if (typeof condition.minRating === "number" && context.rating !== undefined) {
    if (context.rating < condition.minRating) return false;
  }

  // dependencyType: hide if character's dependency type doesn't match
  if (typeof condition.dependencyType === "string" && context.dependencyType !== undefined) {
    if (condition.dependencyType !== context.dependencyType) return false;
  }

  return true;
}

/**
 * Resolve a "rating-based" effect value from the quality's rating table.
 *
 * Looks for known penalty fields based on effect triggers and target:
 * - Withdrawal-triggered effects → `withdrawalPenalty`
 * - Social category target → `socialPenalty`
 *
 * @param effect - The effect with "rating-based" value
 * @param ratingEntry - The quality's rating table entry for the character's rating
 * @returns Resolved numeric value, or null if not resolvable
 */
export function resolveRatingBasedValue(
  effect: Effect,
  ratingEntry: Record<string, unknown> | undefined
): number | null {
  if (!ratingEntry) return null;

  // Withdrawal effects → withdrawalPenalty
  if (effect.triggers.includes("withdrawal") && typeof ratingEntry.withdrawalPenalty === "number") {
    return ratingEntry.withdrawalPenalty;
  }

  // Social penalty effects → socialPenalty
  const target = effect.target as Record<string, unknown>;
  if (target.skillCategory === "social" && typeof ratingEntry.socialPenalty === "number") {
    return ratingEntry.socialPenalty;
  }

  return null;
}

/**
 * Format an Effect into a compact displayable badge.
 *
 * Produces short labels like "+2 Sneaking", "+1 Physical Limit", "+3 Initiative".
 * Falls back to type name when no target is available (e.g., "+2 Dice Pool").
 *
 * When context is provided:
 * - `resolvedValue` overrides the effect's value (for "rating-based" effects)
 * - `rating` + `dependencyType` are used for condition filtering
 * - Non-"always" triggers get a `trigger` suffix on the badge
 *
 * Returns null for effect types that don't translate to a meaningful badge
 * (e.g., "special" type or types without display config), or for effects
 * whose conditions are not met.
 */
export function formatEffectBadge(
  effect: Effect,
  context?: EffectBadgeContext
): EffectBadge | null {
  const config = EFFECT_TYPE_CONFIG[effect.type as string];
  if (!config) return null;

  // Check conditions against context
  if (!matchesContext(effect, context)) return null;

  // Resolve value: use context override, then effect.value
  let valueStr: string | null = null;
  if (context?.resolvedValue !== undefined) {
    const v = context.resolvedValue;
    valueStr = v >= 0 ? `+${v}` : `${v}`;
  } else {
    valueStr = formatValue(effect.value);
  }

  // Skip effects with non-numeric values and no resolved override
  if (valueStr === null) return null;

  const target = getTargetName(effect);
  const trigger = formatTrigger(effect.triggers);

  // Determine if the trigger is currently active based on character state
  let triggerActive: boolean | undefined;
  if (trigger && context?.activeCharacterStates) {
    const states = context.activeCharacterStates;
    const stateTriggers = effect.triggers.filter((t) => t !== "always");
    triggerActive = stateTriggers.some((t) => {
      switch (t) {
        case "withdrawal":
          return states.withdrawalActive;
        case "on-exposure":
          return states.exposureActive;
        case "first-meeting":
          return states.firstMeeting;
        default:
          return false;
      }
    });
  }

  return {
    label: target ? `${valueStr} ${target}` : `${valueStr} ${config.name}`,
    colorClass: config.colorClass,
    ...(trigger ? { trigger } : {}),
    ...(triggerActive !== undefined ? { triggerActive } : {}),
  };
}

/**
 * Check if an effect object is a unified effect (has `triggers` array).
 */
export function isUnifiedEffect(effect: unknown): effect is Effect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "triggers" in effect &&
    Array.isArray((effect as Record<string, unknown>).triggers)
  );
}
