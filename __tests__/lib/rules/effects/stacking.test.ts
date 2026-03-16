/**
 * Tests for effect stacking rules.
 *
 * Covers getStackingRule lookups and applyStackingRules behavior
 * for stacking, highest-per-source-type, and highest-overall modes.
 *
 * @see Issue #108
 */

import { describe, it, expect } from "vitest";
import type { Effect, EffectSource, EffectType, UnifiedResolvedEffect } from "@/lib/types/effects";
import { STACKING_RULES, getStackingRule, applyStackingRules } from "@/lib/rules/effects/stacking";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEffect(overrides: Partial<Effect> = {}): Effect {
  return {
    id: "test-effect",
    type: "dice-pool-modifier",
    triggers: ["always"],
    target: {},
    value: 1,
    ...overrides,
  };
}

function makeSource(overrides: Partial<EffectSource> = {}): EffectSource {
  return {
    type: "quality",
    id: "test-source",
    name: "Test Source",
    ...overrides,
  };
}

function makeResolved(overrides: Partial<UnifiedResolvedEffect> = {}): UnifiedResolvedEffect {
  return {
    effect: makeEffect(),
    source: makeSource(),
    resolvedValue: 1,
    appliedVariant: "standard",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// getStackingRule
// ---------------------------------------------------------------------------

describe("getStackingRule", () => {
  it("returns stack/none for dice-pool-modifier", () => {
    const rule = getStackingRule("dice-pool-modifier");
    expect(rule.behavior).toBe("stack");
    expect(rule.groupBy).toBe("none");
  });

  it("returns highest/source-type for limit-modifier", () => {
    const rule = getStackingRule("limit-modifier");
    expect(rule.behavior).toBe("highest");
    expect(rule.groupBy).toBe("source-type");
  });

  it("returns highest/none for accuracy-modifier", () => {
    const rule = getStackingRule("accuracy-modifier");
    expect(rule.behavior).toBe("highest");
    expect(rule.groupBy).toBe("none");
  });

  it("returns highest/source-type for attribute-modifier", () => {
    const rule = getStackingRule("attribute-modifier");
    expect(rule.behavior).toBe("highest");
    expect(rule.groupBy).toBe("source-type");
  });

  it("returns stack/none for initiative-modifier", () => {
    const rule = getStackingRule("initiative-modifier");
    expect(rule.behavior).toBe("stack");
    expect(rule.groupBy).toBe("none");
  });

  it("returns stack/none for armor-modifier", () => {
    const rule = getStackingRule("armor-modifier");
    expect(rule.behavior).toBe("stack");
    expect(rule.groupBy).toBe("none");
  });

  it("returns stack/none for wound-modifier", () => {
    const rule = getStackingRule("wound-modifier");
    expect(rule.behavior).toBe("stack");
    expect(rule.groupBy).toBe("none");
  });

  it("returns stack/none for recoil-compensation", () => {
    const rule = getStackingRule("recoil-compensation");
    expect(rule.behavior).toBe("stack");
    expect(rule.groupBy).toBe("none");
  });

  it("returns default stack/none for unknown effect types", () => {
    const rule = getStackingRule("unknown-type" as EffectType);
    expect(rule.behavior).toBe("stack");
    expect(rule.groupBy).toBe("none");
  });

  it("has a rule for every entry in STACKING_RULES", () => {
    for (const rule of STACKING_RULES) {
      const looked = getStackingRule(rule.effectType);
      expect(looked.effectType).toBe(rule.effectType);
      expect(looked.behavior).toBe(rule.behavior);
      expect(looked.groupBy).toBe(rule.groupBy);
    }
  });
});

// ---------------------------------------------------------------------------
// applyStackingRules
// ---------------------------------------------------------------------------

describe("applyStackingRules", () => {
  it("returns empty result for empty array", () => {
    const result = applyStackingRules([]);
    expect(result.dicePoolModifiers).toEqual([]);
    expect(result.totalDicePoolModifier).toBe(0);
    expect(result.excludedByStacking).toEqual([]);
  });

  it("stacks all dice-pool-modifiers (behavior=stack)", () => {
    const a = makeResolved({ resolvedValue: 2 });
    const b = makeResolved({
      resolvedValue: 3,
      source: makeSource({ id: "src-2", name: "Source 2" }),
    });

    const result = applyStackingRules([a, b]);
    expect(result.dicePoolModifiers).toHaveLength(2);
    expect(result.totalDicePoolModifier).toBe(5);
    expect(result.excludedByStacking).toHaveLength(0);
  });

  it("takes highest limit-modifier per source-type (behavior=highest, groupBy=source-type)", () => {
    const qualityHigh = makeResolved({
      resolvedValue: 3,
      effect: makeEffect({ type: "limit-modifier" }),
      source: makeSource({ type: "quality", id: "q1", name: "Quality High" }),
    });
    const qualityLow = makeResolved({
      resolvedValue: 1,
      effect: makeEffect({ type: "limit-modifier" }),
      source: makeSource({ type: "quality", id: "q2", name: "Quality Low" }),
    });
    const gearEffect = makeResolved({
      resolvedValue: 2,
      effect: makeEffect({ type: "limit-modifier" }),
      source: makeSource({ type: "gear", id: "g1", name: "Gear" }),
    });

    const result = applyStackingRules([qualityHigh, qualityLow, gearEffect]);

    // Highest per source-type: qualityHigh (3) from quality, gearEffect (2) from gear
    expect(result.limitModifiers).toHaveLength(2);
    expect(result.totalLimitModifier).toBe(5);
    // qualityLow excluded
    expect(result.excludedByStacking).toHaveLength(1);
    expect(result.excludedByStacking[0].source.id).toBe("q2");
  });

  it("takes highest accuracy-modifier overall (behavior=highest, groupBy=none)", () => {
    const high = makeResolved({
      resolvedValue: 4,
      effect: makeEffect({ type: "accuracy-modifier" }),
      source: makeSource({ id: "a1" }),
    });
    const low = makeResolved({
      resolvedValue: 1,
      effect: makeEffect({ type: "accuracy-modifier" }),
      source: makeSource({ id: "a2" }),
    });

    const result = applyStackingRules([high, low]);
    expect(result.accuracyModifiers).toHaveLength(1);
    expect(result.totalAccuracyModifier).toBe(4);
    expect(result.excludedByStacking).toHaveLength(1);
    expect(result.excludedByStacking[0].source.id).toBe("a2");
  });

  it("correctly populates totalXModifier fields for each type", () => {
    const dicePool = makeResolved({
      resolvedValue: 2,
      effect: makeEffect({ type: "dice-pool-modifier" }),
    });
    const initiative = makeResolved({
      resolvedValue: 3,
      effect: makeEffect({ type: "initiative-modifier" }),
    });
    const armor = makeResolved({
      resolvedValue: 1,
      effect: makeEffect({ type: "armor-modifier" }),
    });

    const result = applyStackingRules([dicePool, initiative, armor]);
    expect(result.totalDicePoolModifier).toBe(2);
    expect(result.totalInitiativeModifier).toBe(3);
    expect(result.totalArmorModifier).toBe(1);
    expect(result.totalLimitModifier).toBe(0);
    expect(result.totalThresholdModifier).toBe(0);
    expect(result.totalAccuracyModifier).toBe(0);
    expect(result.totalWoundModifier).toBe(0);
  });

  it("correctly populates excludedByStacking for non-winners", () => {
    const winner = makeResolved({
      resolvedValue: 5,
      effect: makeEffect({ type: "accuracy-modifier" }),
      source: makeSource({ id: "winner" }),
    });
    const loserA = makeResolved({
      resolvedValue: 2,
      effect: makeEffect({ type: "accuracy-modifier" }),
      source: makeSource({ id: "loser-a" }),
    });
    const loserB = makeResolved({
      resolvedValue: 1,
      effect: makeEffect({ type: "accuracy-modifier" }),
      source: makeSource({ id: "loser-b" }),
    });

    const result = applyStackingRules([winner, loserA, loserB]);
    expect(result.excludedByStacking).toHaveLength(2);
    const excludedIds = result.excludedByStacking.map((e) => e.source.id);
    expect(excludedIds).toContain("loser-a");
    expect(excludedIds).toContain("loser-b");
  });

  it("handles multiple effect types in the same call", () => {
    const dice1 = makeResolved({
      resolvedValue: 2,
      effect: makeEffect({ type: "dice-pool-modifier" }),
    });
    const dice2 = makeResolved({
      resolvedValue: 3,
      effect: makeEffect({ type: "dice-pool-modifier" }),
      source: makeSource({ id: "src-2" }),
    });
    const accHigh = makeResolved({
      resolvedValue: 4,
      effect: makeEffect({ type: "accuracy-modifier" }),
      source: makeSource({ id: "acc-high" }),
    });
    const accLow = makeResolved({
      resolvedValue: 1,
      effect: makeEffect({ type: "accuracy-modifier" }),
      source: makeSource({ id: "acc-low" }),
    });
    const wound = makeResolved({
      resolvedValue: 1,
      effect: makeEffect({ type: "wound-modifier" }),
    });

    const result = applyStackingRules([dice1, dice2, accHigh, accLow, wound]);

    // dice-pool stacks
    expect(result.dicePoolModifiers).toHaveLength(2);
    expect(result.totalDicePoolModifier).toBe(5);
    // accuracy takes highest
    expect(result.accuracyModifiers).toHaveLength(1);
    expect(result.totalAccuracyModifier).toBe(4);
    // wound stacks
    expect(result.woundModifiers).toHaveLength(1);
    expect(result.totalWoundModifier).toBe(1);
    // one accuracy excluded
    expect(result.excludedByStacking).toHaveLength(1);
  });
});
