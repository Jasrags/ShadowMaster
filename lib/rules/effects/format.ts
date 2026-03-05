/**
 * Effect Badge Formatter
 *
 * Converts Effect objects into human-readable badge data for display
 * in character creation UI components.
 *
 * @see Issue #448
 */

import type { Effect } from "@/lib/types/effects";

export interface EffectBadge {
  /** Compact display text, e.g., "+2 Sneaking" */
  label: string;
  /** Tailwind color classes for the badge */
  colorClass: string;
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

  return "";
}

/**
 * Format a numeric value with sign prefix.
 */
function formatValue(value: number | { perRating: number }): string {
  const num = typeof value === "number" ? value : value.perRating;
  return num >= 0 ? `+${num}` : `${num}`;
}

/**
 * Capitalize first letter of a string.
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format an Effect into a compact displayable badge.
 *
 * Produces short labels like "+2 Sneaking", "+1 Physical Limit", "+3 Initiative".
 * Falls back to type name when no target is available (e.g., "+2 Dice Pool").
 *
 * Returns null for effect types that don't translate to a meaningful badge
 * (e.g., "special" type or types without display config).
 */
export function formatEffectBadge(effect: Effect): EffectBadge | null {
  const config = EFFECT_TYPE_CONFIG[effect.type as string];
  if (!config) return null;

  const valueStr = formatValue(effect.value);
  const target = getTargetName(effect);

  return {
    label: target ? `${valueStr} ${target}` : `${valueStr} ${config.name}`,
    colorClass: config.colorClass,
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
