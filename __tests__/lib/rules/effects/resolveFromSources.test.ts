/**
 * Tests for resolveFromSources — resolves effects from pre-gathered sources.
 *
 * Verifies that the function correctly filters, resolves, and stacks effects
 * given pre-gathered SourcedEffect[] and a resolution context.
 *
 * @see Issue #113
 */

import { describe, it, expect } from "vitest";
import type { Effect, EffectSource, EffectResolutionContext } from "@/lib/types/effects";
import type { SourcedEffect } from "@/lib/rules/effects";
import { resolveFromSources } from "@/lib/rules/effects";
import { EffectContextBuilder } from "@/lib/rules/effects";

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

function makeSourcedEffect(
  effectOverrides: Partial<Effect> = {},
  sourceOverrides: Partial<EffectSource> = {}
): SourcedEffect {
  return {
    effect: makeEffect(effectOverrides),
    source: makeSource(sourceOverrides),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("resolveFromSources", () => {
  it("should return empty result for empty sources", () => {
    const ctx = EffectContextBuilder.forSkillTest("pistols").build();
    const result = resolveFromSources([], ctx);

    expect(result.totalDicePoolModifier).toBe(0);
    expect(result.dicePoolModifiers).toHaveLength(0);
    expect(result.excludedByStacking).toHaveLength(0);
  });

  it("should resolve effects that match the context", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        { id: "catlike", value: 2, triggers: ["always"], type: "dice-pool-modifier" },
        { name: "Catlike" }
      ),
    ];
    const ctx = EffectContextBuilder.forSkillTest("sneaking").build();
    const result = resolveFromSources(sources, ctx);

    expect(result.totalDicePoolModifier).toBe(2);
    expect(result.dicePoolModifiers).toHaveLength(1);
    expect(result.dicePoolModifiers[0].source.name).toBe("Catlike");
  });

  it("should filter out effects that do not match the context", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        {
          id: "perception-only",
          value: 1,
          triggers: ["perception-audio"],
          type: "dice-pool-modifier",
        },
        { name: "Audio Enhancement" }
      ),
    ];
    // Skill test for pistols should NOT match perception-audio trigger
    const ctx = EffectContextBuilder.forSkillTest("pistols").build();
    const result = resolveFromSources(sources, ctx);

    expect(result.totalDicePoolModifier).toBe(0);
    expect(result.dicePoolModifiers).toHaveLength(0);
  });

  it("should resolve per-rating values", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        {
          id: "per-rating",
          value: { perRating: 1 },
          triggers: ["always"],
          type: "dice-pool-modifier",
        },
        { name: "Wired Reflexes", rating: 3 }
      ),
    ];
    const ctx = EffectContextBuilder.forSkillTest("pistols").build();
    const result = resolveFromSources(sources, ctx);

    expect(result.totalDicePoolModifier).toBe(3);
  });

  it("should apply wireless variant when source has wireless enabled", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        {
          id: "wireless-bonus",
          value: 1,
          triggers: ["always"],
          type: "dice-pool-modifier",
          wirelessOverride: { bonusValue: 1 },
        },
        { name: "Cybereyes", wirelessEnabled: true }
      ),
    ];
    const ctx = EffectContextBuilder.forSkillTest("perception").build();
    const result = resolveFromSources(sources, ctx);

    // Base 1 + wireless bonus 1 = 2
    expect(result.totalDicePoolModifier).toBe(2);
    expect(result.dicePoolModifiers[0].appliedVariant).toBe("wireless");
  });

  it("should zero out requiresWireless effects when wireless is off", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        {
          id: "wireless-required",
          value: 2,
          triggers: ["always"],
          type: "dice-pool-modifier",
          requiresWireless: true,
        },
        { name: "Wireless Gear", wirelessEnabled: false }
      ),
    ];
    const ctx = EffectContextBuilder.forSkillTest("perception").build();
    const result = resolveFromSources(sources, ctx);

    expect(result.totalDicePoolModifier).toBe(0);
  });

  it("should resolve initiative modifiers", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        {
          id: "init-bonus",
          value: 2,
          triggers: ["always"],
          type: "initiative-modifier",
        },
        { name: "Wired Reflexes" }
      ),
    ];
    const ctx = EffectContextBuilder.forInitiative().build();
    const result = resolveFromSources(sources, ctx);

    expect(result.totalInitiativeModifier).toBe(2);
    expect(result.initiativeModifiers).toHaveLength(1);
  });

  it("should resolve limit modifiers", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        {
          id: "limit-bonus",
          value: 1,
          triggers: ["always"],
          type: "limit-modifier",
          target: { limit: "physical" },
        },
        { name: "Catlike", type: "quality" }
      ),
    ];
    const ctx = EffectContextBuilder.forSkillTest("sneaking").build();
    const result = resolveFromSources(sources, ctx);

    expect(result.totalLimitModifier).toBe(1);
    expect(result.limitModifiers).toHaveLength(1);
  });

  it("should apply stacking rules (highest per source-type for limit modifiers)", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        {
          id: "limit-1",
          value: 2,
          triggers: ["always"],
          type: "limit-modifier",
          target: { limit: "physical" },
        },
        { name: "Quality A", type: "quality", id: "quality-a" }
      ),
      makeSourcedEffect(
        {
          id: "limit-2",
          value: 1,
          triggers: ["always"],
          type: "limit-modifier",
          target: { limit: "physical" },
        },
        { name: "Quality B", type: "quality", id: "quality-b" }
      ),
    ];
    const ctx = EffectContextBuilder.forSkillTest("sneaking").build();
    const result = resolveFromSources(sources, ctx);

    // Limit modifiers use "highest" per source-type → only the +2 quality wins
    expect(result.totalLimitModifier).toBe(2);
    expect(result.limitModifiers).toHaveLength(1);
    expect(result.excludedByStacking).toHaveLength(1);
  });

  it("should stack dice pool modifiers from different sources", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        { id: "quality-bonus", value: 2, triggers: ["always"], type: "dice-pool-modifier" },
        { name: "Catlike", type: "quality" }
      ),
      makeSourcedEffect(
        { id: "gear-bonus", value: 1, triggers: ["always"], type: "dice-pool-modifier" },
        { name: "Audio Enhancement", type: "gear" }
      ),
    ];
    const ctx = EffectContextBuilder.forSkillTest("sneaking").build();
    const result = resolveFromSources(sources, ctx);

    // Dice pool modifiers stack: 2 + 1 = 3
    expect(result.totalDicePoolModifier).toBe(3);
    expect(result.dicePoolModifiers).toHaveLength(2);
  });

  it("should work with defense context", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        {
          id: "defense-bonus",
          value: 1,
          triggers: ["defense-test"],
          type: "dice-pool-modifier",
        },
        { name: "Bone Lacing" }
      ),
      makeSourcedEffect(
        {
          id: "attack-only",
          value: 2,
          triggers: ["ranged-attack"],
          type: "dice-pool-modifier",
        },
        { name: "Smartgun" }
      ),
    ];
    const ctx = EffectContextBuilder.forDefense().build();
    const result = resolveFromSources(sources, ctx);

    // Only defense-test matches, not ranged-attack
    expect(result.totalDicePoolModifier).toBe(1);
    expect(result.dicePoolModifiers).toHaveLength(1);
    expect(result.dicePoolModifiers[0].source.name).toBe("Bone Lacing");
  });

  it("should produce same result as multiple invocations on same sources", () => {
    const sources: SourcedEffect[] = [
      makeSourcedEffect(
        { id: "always-bonus", value: 1, triggers: ["always"], type: "dice-pool-modifier" },
        { name: "Quality" }
      ),
    ];

    const ctx1 = EffectContextBuilder.forSkillTest("pistols").build();
    const ctx2 = EffectContextBuilder.forSkillTest("sneaking").build();

    const result1 = resolveFromSources(sources, ctx1);
    const result2 = resolveFromSources(sources, ctx2);

    expect(result1.totalDicePoolModifier).toBe(1);
    expect(result2.totalDicePoolModifier).toBe(1);
  });
});
