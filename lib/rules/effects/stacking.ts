/**
 * Stacking rules for the unified effect system.
 *
 * Defines how effects of each type combine (stack, take highest, etc.)
 * and applies those rules to produce a final EffectResolutionResult.
 *
 * @see Issue #108
 */

import type {
  EffectType,
  StackingRule,
  UnifiedResolvedEffect,
  EffectResolutionResult,
} from "@/lib/types";

/**
 * Per-type stacking rules from the effects plan document.
 */
export const STACKING_RULES: StackingRule[] = [
  { effectType: "dice-pool-modifier", behavior: "stack", groupBy: "none" },
  { effectType: "limit-modifier", behavior: "highest", groupBy: "source-type" },
  { effectType: "accuracy-modifier", behavior: "highest", groupBy: "none" },
  { effectType: "recoil-compensation", behavior: "stack", groupBy: "none" },
  { effectType: "attribute-modifier", behavior: "highest", groupBy: "source-type" },
  { effectType: "initiative-modifier", behavior: "stack", groupBy: "none" },
  { effectType: "armor-modifier", behavior: "stack", groupBy: "none" },
  { effectType: "wound-modifier", behavior: "stack", groupBy: "none" },
];

const DEFAULT_STACKING_RULE: StackingRule = {
  effectType: "special",
  behavior: "stack",
  groupBy: "none",
};

/**
 * Look up the stacking rule for a given effect type.
 * Falls back to stack/none for unknown types.
 */
export function getStackingRule(effectType: EffectType): StackingRule {
  return STACKING_RULES.find((r) => r.effectType === effectType) ?? DEFAULT_STACKING_RULE;
}

/**
 * Create an empty EffectResolutionResult.
 */
function emptyResult(): EffectResolutionResult {
  return {
    dicePoolModifiers: [],
    limitModifiers: [],
    thresholdModifiers: [],
    accuracyModifiers: [],
    initiativeModifiers: [],
    armorModifiers: [],
    woundModifiers: [],
    totalDicePoolModifier: 0,
    totalLimitModifier: 0,
    totalThresholdModifier: 0,
    totalAccuracyModifier: 0,
    totalInitiativeModifier: 0,
    totalArmorModifier: 0,
    totalWoundModifier: 0,
    excludedByStacking: [],
  };
}

/**
 * Apply stacking behavior to a group of effects, returning included/excluded.
 */
function applyBehavior(
  effects: UnifiedResolvedEffect[],
  rule: StackingRule
): { included: UnifiedResolvedEffect[]; excluded: UnifiedResolvedEffect[] } {
  if (effects.length === 0) return { included: [], excluded: [] };

  if (rule.behavior === "stack") {
    // All effects contribute
    return { included: [...effects], excluded: [] };
  }

  if (rule.behavior === "highest") {
    if (rule.groupBy === "none") {
      // Take the single highest value
      const sorted = [...effects].sort((a, b) => b.resolvedValue - a.resolvedValue);
      return {
        included: [sorted[0]],
        excluded: sorted.slice(1),
      };
    }

    if (rule.groupBy === "source-type") {
      // Within each source type, take highest; then include all "winners"
      const bySourceType = new Map<string, UnifiedResolvedEffect[]>();
      for (const e of effects) {
        const key = e.source.type;
        if (!bySourceType.has(key)) bySourceType.set(key, []);
        bySourceType.get(key)!.push(e);
      }

      const included: UnifiedResolvedEffect[] = [];
      const excluded: UnifiedResolvedEffect[] = [];

      for (const group of bySourceType.values()) {
        const sorted = [...group].sort((a, b) => b.resolvedValue - a.resolvedValue);
        included.push(sorted[0]);
        excluded.push(...sorted.slice(1));
      }

      return { included, excluded };
    }

    if (rule.groupBy === "stacking-group") {
      // Within each stacking group, take highest priority (then value as tiebreaker)
      const byGroup = new Map<string, UnifiedResolvedEffect[]>();
      for (const e of effects) {
        const key = e.effect.stackingGroup ?? "default";
        if (!byGroup.has(key)) byGroup.set(key, []);
        byGroup.get(key)!.push(e);
      }

      const included: UnifiedResolvedEffect[] = [];
      const excluded: UnifiedResolvedEffect[] = [];

      for (const group of byGroup.values()) {
        const sorted = [...group].sort((a, b) => {
          const priDiff = (b.effect.stackingPriority ?? 0) - (a.effect.stackingPriority ?? 0);
          if (priDiff !== 0) return priDiff;
          return b.resolvedValue - a.resolvedValue;
        });
        included.push(sorted[0]);
        excluded.push(...sorted.slice(1));
      }

      return { included, excluded };
    }
  }

  if (rule.behavior === "lowest") {
    if (rule.groupBy === "none") {
      const sorted = [...effects].sort((a, b) => a.resolvedValue - b.resolvedValue);
      return {
        included: [sorted[0]],
        excluded: sorted.slice(1),
      };
    }
  }

  // Fallback: stack all
  return { included: [...effects], excluded: [] };
}

/**
 * Apply stacking rules to a flat array of resolved effects.
 * Groups by effect type, applies per-type stacking behavior, and
 * populates the typed arrays in EffectResolutionResult.
 */
export function applyStackingRules(effects: UnifiedResolvedEffect[]): EffectResolutionResult {
  const result = emptyResult();

  if (effects.length === 0) return result;

  // Group all effects by type
  const byType = new Map<string, UnifiedResolvedEffect[]>();
  for (const e of effects) {
    const type = e.effect.type;
    if (!byType.has(type)) byType.set(type, []);
    byType.get(type)!.push(e);
  }

  // Process each type group
  for (const [type, group] of byType) {
    const rule = getStackingRule(type as EffectType);
    const { included, excluded } = applyBehavior(group, rule);

    result.excludedByStacking.push(...excluded);

    const total = included.reduce((sum, e) => sum + e.resolvedValue, 0);

    // Populate typed arrays for the 5 supported types
    switch (type) {
      case "dice-pool-modifier":
        result.dicePoolModifiers.push(...included);
        result.totalDicePoolModifier = total;
        break;
      case "limit-modifier":
        result.limitModifiers.push(...included);
        result.totalLimitModifier = total;
        break;
      case "threshold-modifier":
        result.thresholdModifiers.push(...included);
        result.totalThresholdModifier = total;
        break;
      case "accuracy-modifier":
        result.accuracyModifiers.push(...included);
        result.totalAccuracyModifier = total;
        break;
      case "initiative-modifier":
        result.initiativeModifiers.push(...included);
        result.totalInitiativeModifier = total;
        break;
      case "armor-modifier":
        result.armorModifiers.push(...included);
        result.totalArmorModifier = total;
        break;
      case "wound-modifier":
        result.woundModifiers.push(...included);
        result.totalWoundModifier = total;
        break;
    }
  }

  return result;
}
