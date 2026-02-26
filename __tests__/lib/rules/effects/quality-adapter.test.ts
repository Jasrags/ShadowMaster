/**
 * Tests for the quality effect adapter (Issue #110).
 *
 * Covers:
 * - adaptQualityEffect() unit tests (conversions, rejections, field handling)
 * - Integration with gathering pipeline
 * - Full pipeline resolution of adapted effects
 */

import { describe, it, expect } from "vitest";
import type { MergedRuleset } from "@/lib/types/edition";
import type { Effect } from "@/lib/types/effects";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import { adaptQualityEffect, UNIFIED_TRIGGERS } from "@/lib/rules/effects/quality-adapter";
import { gatherEffectSources, resolveEffects } from "@/lib/rules/effects";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockRuleset(modules: Record<string, unknown> = {}): MergedRuleset {
  return {
    snapshotId: "test-snapshot",
    editionId: "test-edition",
    editionCode: "sr5",
    bookIds: ["sr5-core"],
    modules: modules as MergedRuleset["modules"],
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// ADAPTER UNIT TESTS
// ---------------------------------------------------------------------------

describe("adaptQualityEffect", () => {
  describe("successful conversions", () => {
    it("should adapt standard trigger + numeric value to unified Effect", () => {
      const old = {
        id: "test-1",
        type: "dice-pool-modifier",
        trigger: "skill-test",
        target: { skill: "firearms" },
        value: 2,
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      expect(result!.id).toBe("test-1");
      expect(result!.type).toBe("dice-pool-modifier");
      expect(result!.triggers).toEqual(["skill-test"]);
      expect(result!.target).toEqual({ skill: "firearms" });
      expect(result!.value).toBe(2);
    });

    it('should convert "rating" value to { perRating: 1 }', () => {
      const old = {
        id: "rated-1",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: "rating",
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      expect(result!.value).toEqual({ perRating: 1 });
    });

    it("should preserve negative numeric values", () => {
      const old = {
        id: "negative-1",
        type: "dice-pool-modifier",
        trigger: "social-test",
        target: { affectsOthers: true },
        value: -2,
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      expect(result!.value).toBe(-2);
    });

    it("should pass through compatible target fields and strip non-standard ones", () => {
      const old = {
        id: "target-test",
        type: "dice-pool-modifier",
        trigger: "skill-test",
        target: {
          skill: "hacking",
          matrixAction: "hack-on-the-fly",
          affectsOthers: false,
          // Non-standard fields that should be stripped
          action: "data-spike",
          choice: "persona",
          test: "opposed",
        },
        value: 1,
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      expect(result!.target.skill).toBe("hacking");
      expect(result!.target.matrixAction).toBe("hack-on-the-fly");
      expect(result!.target.affectsOthers).toBe(false);
      // Verify stripped fields
      expect((result!.target as Record<string, unknown>).action).toBeUndefined();
      expect((result!.target as Record<string, unknown>).choice).toBeUndefined();
      expect((result!.target as Record<string, unknown>).test).toBeUndefined();
    });

    it("should pass through compatible condition fields", () => {
      const old = {
        id: "condition-test",
        type: "dice-pool-modifier",
        trigger: "skill-test",
        target: {},
        value: 1,
        condition: {
          environment: ["urban"],
          targetType: ["spirit"],
          opposedBy: "willpower",
        },
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      expect(result!.condition).toBeDefined();
      expect(result!.condition!.environment).toEqual(["urban"]);
      expect(result!.condition!.targetType).toEqual(["spirit"]);
      expect(result!.condition!.opposedBy).toBe("willpower");
    });

    it("should omit condition when no recognized fields present", () => {
      const old = {
        id: "no-condition-fields",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: 1,
        condition: {
          nonStandardField: "something",
          anotherUnknown: true,
        },
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      expect(result!.condition).toBeUndefined();
    });

    it("should strip extra non-standard fields from output", () => {
      const old = {
        id: "extra-fields",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: 1,
        negates: "some-quality",
        duration: "sustained",
        oncePerSession: true,
        alwaysActive: true,
        cost: { karma: 5 },
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      const resultObj = result as unknown as Record<string, unknown>;
      expect(resultObj.negates).toBeUndefined();
      expect(resultObj.duration).toBeUndefined();
      expect(resultObj.oncePerSession).toBeUndefined();
      expect(resultObj.alwaysActive).toBeUndefined();
      expect(resultObj.cost).toBeUndefined();
    });

    it("should accept all 21 unified trigger values", () => {
      for (const trigger of UNIFIED_TRIGGERS) {
        const old = {
          id: `trigger-${trigger}`,
          type: "dice-pool-modifier",
          trigger,
          target: {},
          value: 1,
        };

        const result = adaptQualityEffect(old);
        expect(result).not.toBeNull();
        expect(result!.triggers).toEqual([trigger]);
      }
    });
  });

  describe("returns null for non-adaptable effects", () => {
    it("should return null for non-standard trigger", () => {
      const old = {
        id: "bad-trigger",
        type: "dice-pool-modifier",
        trigger: "vehicle-operation",
        target: {},
        value: 1,
      };
      expect(adaptQualityEffect(old)).toBeNull();
    });

    it("should return null for non-standard type", () => {
      const old = {
        id: "bad-type",
        type: "vehicle-modifier",
        trigger: "skill-test",
        target: {},
        value: 1,
      };
      expect(adaptQualityEffect(old)).toBeNull();
    });

    it('should return null for non-standard string value (e.g., "backfire-chance")', () => {
      const old = {
        id: "bad-value-string",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: "backfire-chance",
      };
      expect(adaptQualityEffect(old)).toBeNull();
    });

    it('should return null for non-standard string value (e.g., "immune")', () => {
      const old = {
        id: "bad-value-immune",
        type: "special",
        trigger: "always",
        target: {},
        value: "immune",
      };
      expect(adaptQualityEffect(old)).toBeNull();
    });

    it("should return null for null input", () => {
      expect(adaptQualityEffect(null)).toBeNull();
    });

    it("should return null for non-object input", () => {
      expect(adaptQualityEffect("not-an-object")).toBeNull();
      expect(adaptQualityEffect(42)).toBeNull();
      expect(adaptQualityEffect(undefined)).toBeNull();
    });

    it("should return null when trigger field is missing", () => {
      const old = {
        id: "no-trigger",
        type: "dice-pool-modifier",
        target: {},
        value: 1,
      };
      expect(adaptQualityEffect(old)).toBeNull();
    });

    it("should return null for already-unified effect (has triggers array)", () => {
      const unified: Effect = {
        id: "already-unified",
        type: "dice-pool-modifier",
        triggers: ["skill-test"],
        target: {},
        value: 2,
      };
      expect(adaptQualityEffect(unified)).toBeNull();
    });

    it("should return null for object/dict value", () => {
      const old = {
        id: "dict-value",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: { speed: "20%", handling: 1 },
      };
      expect(adaptQualityEffect(old)).toBeNull();
    });

    it("should return null for null value", () => {
      const old = {
        id: "null-value",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: null,
      };
      expect(adaptQualityEffect(old)).toBeNull();
    });

    it("should return null for undefined value", () => {
      const old = {
        id: "undef-value",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
      };
      expect(adaptQualityEffect(old)).toBeNull();
    });
  });

  describe("optional field handling", () => {
    it("should omit description when absent", () => {
      const old = {
        id: "no-desc",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: 1,
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      expect(result!.description).toBeUndefined();
    });

    it("should include description when present", () => {
      const old = {
        id: "with-desc",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: 1,
        description: "+1 to all tests",
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      expect(result!.description).toBe("+1 to all tests");
    });

    it("should omit condition when absent", () => {
      const old = {
        id: "no-cond",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: 1,
      };

      const result = adaptQualityEffect(old);
      expect(result).not.toBeNull();
      expect(result!.condition).toBeUndefined();
    });
  });
});

// ---------------------------------------------------------------------------
// GATHERING INTEGRATION TESTS
// ---------------------------------------------------------------------------

describe("Gathering integration with adapter", () => {
  it("should include adapted old-format quality effect in gatherEffectSources()", () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "adapted-quality", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "adapted-quality",
            name: "Adapted Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [
              {
                id: "old-effect",
                type: "dice-pool-modifier",
                trigger: "skill-test",
                target: { skill: "firearms" },
                value: 2,
              },
            ],
          },
        ],
        negative: [],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].effect.triggers).toEqual(["skill-test"]);
    expect(sources[0].effect.value).toBe(2);
    expect(sources[0].source.type).toBe("quality");
    expect(sources[0].source.name).toBe("Adapted Quality");
  });

  it('should gather "rating" value effect with { perRating: 1 } and preserve source rating', () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "rated-quality", source: "creation", rating: 3 }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "rated-quality",
            name: "Rated Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [
              {
                id: "rated-effect",
                type: "dice-pool-modifier",
                trigger: "always",
                target: {},
                value: "rating",
              },
            ],
          },
        ],
        negative: [],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].effect.value).toEqual({ perRating: 1 });
    expect(sources[0].source.rating).toBe(3);
  });

  it("should still skip non-adaptable old-format effects", () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "vehicle-quality", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "vehicle-quality",
            name: "Vehicle Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [
              {
                id: "vehicle-effect",
                type: "vehicle-modifier",
                trigger: "vehicle-operation",
                target: {},
                value: 1,
              },
            ],
          },
        ],
        negative: [],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(0);
  });

  it("should gather both unified and old-format effects from same quality", () => {
    const unifiedEffect: Effect = {
      id: "unified-1",
      type: "initiative-modifier",
      triggers: ["always"],
      target: {},
      value: 1,
    };
    const oldFormatEffect = {
      id: "old-1",
      type: "dice-pool-modifier",
      trigger: "skill-test",
      target: {},
      value: 2,
    };

    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "mixed-quality", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "mixed-quality",
            name: "Mixed Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [unifiedEffect, oldFormatEffect],
          },
        ],
        negative: [],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(2);
    expect(sources[0].effect.id).toBe("unified-1");
    expect(sources[1].effect.id).toBe("old-1");
    expect(sources[1].effect.triggers).toEqual(["skill-test"]);
  });

  it("should still gather pure unified-format effects unchanged", () => {
    const unifiedEffect: Effect = {
      id: "pure-unified",
      type: "dice-pool-modifier",
      triggers: ["skill-test", "combat-action"],
      target: { skill: "firearms" },
      value: 3,
    };

    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "unified-quality", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "unified-quality",
            name: "Unified Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [unifiedEffect],
          },
        ],
        negative: [],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].effect).toBe(unifiedEffect); // Same reference — not adapted
  });
});

// ---------------------------------------------------------------------------
// FULL PIPELINE TESTS
// ---------------------------------------------------------------------------

describe("Full pipeline with adapted effects", () => {
  it("should resolve adapted effect through resolveEffects() pipeline", () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "pipeline-quality", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "pipeline-quality",
            name: "Pipeline Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [
              {
                id: "pipeline-effect",
                type: "dice-pool-modifier",
                trigger: "skill-test",
                target: { skill: "firearms" },
                value: 2,
              },
            ],
          },
        ],
        negative: [],
      },
    });

    const result = resolveEffects(
      character,
      { action: { type: "skill-test", skill: "firearms" } },
      ruleset
    );
    expect(result.totalDicePoolModifier).toBe(2);
    expect(result.dicePoolModifiers).toHaveLength(1);
  });

  it("should resolve per-rating adapted effect correctly", () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "per-rating-quality", source: "creation", rating: 4 }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "per-rating-quality",
            name: "Per Rating Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [
              {
                id: "per-rating-effect",
                type: "dice-pool-modifier",
                trigger: "always",
                target: {},
                value: "rating",
              },
            ],
          },
        ],
        negative: [],
      },
    });

    const result = resolveEffects(character, { action: { type: "skill-test" } }, ruleset);
    // perRating: 1 * rating: 4 = 4
    expect(result.totalDicePoolModifier).toBe(4);
  });

  it("should filter adapted effect when trigger does not match context", () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "ranged-only-quality", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "ranged-only-quality",
            name: "Ranged Only",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [
              {
                id: "ranged-effect",
                type: "dice-pool-modifier",
                trigger: "ranged-attack",
                target: {},
                value: 2,
              },
            ],
          },
        ],
        negative: [],
      },
    });

    // Should not apply for a skill test
    const result = resolveEffects(character, { action: { type: "skill-test" } }, ruleset);
    expect(result.totalDicePoolModifier).toBe(0);

    // Should apply for a ranged attack
    const rangedResult = resolveEffects(
      character,
      { action: { type: "attack", attackType: "ranged" } },
      ruleset
    );
    expect(rangedResult.totalDicePoolModifier).toBe(2);
  });
});
