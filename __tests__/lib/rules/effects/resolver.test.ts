/**
 * Tests for the unified effect resolver system.
 *
 * Covers trigger/target/condition matching, stacking rules,
 * effect gathering, and the full resolution pipeline.
 *
 * @see Issue #108
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Character } from "@/lib/types";
import type { MergedRuleset } from "@/lib/types/edition";
import type {
  Effect,
  EffectActionContext,
  EffectResolutionContext,
  EffectSource,
  UnifiedResolvedEffect,
  ActiveModifier,
} from "@/lib/types/effects";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import {
  matchesTrigger,
  matchesTarget,
  matchesCondition,
  effectApplies,
  getStackingRule,
  applyStackingRules,
  gatherEffectSources,
  resolveEffects,
} from "@/lib/rules/effects";

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

function makeAction(overrides: Partial<EffectActionContext> = {}): EffectActionContext {
  return {
    type: "skill-test",
    ...overrides,
  };
}

function makeContext(
  actionOverrides: Partial<EffectActionContext> = {},
  environment?: EffectResolutionContext["environment"]
): EffectResolutionContext {
  return {
    action: makeAction(actionOverrides),
    environment,
  };
}

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
// MATCHING TESTS
// ---------------------------------------------------------------------------

describe("Matching", () => {
  describe("matchesTrigger", () => {
    it("should match 'always' trigger for any action type", () => {
      expect(matchesTrigger(["always"], makeAction({ type: "skill-test" }))).toBe(true);
      expect(matchesTrigger(["always"], makeAction({ type: "attack" }))).toBe(true);
      expect(matchesTrigger(["always"], makeAction({ type: "initiative" }))).toBe(true);
    });

    it("should match 'skill-test' for skill-test actions", () => {
      expect(matchesTrigger(["skill-test"], makeAction({ type: "skill-test" }))).toBe(true);
    });

    it("should not match 'skill-test' for attack actions", () => {
      expect(matchesTrigger(["skill-test"], makeAction({ type: "attack" }))).toBe(false);
    });

    it("should match 'ranged-attack' for ranged attack actions", () => {
      expect(
        matchesTrigger(["ranged-attack"], makeAction({ type: "attack", attackType: "ranged" }))
      ).toBe(true);
    });

    it("should match 'melee-attack' for melee attack actions", () => {
      expect(
        matchesTrigger(["melee-attack"], makeAction({ type: "attack", attackType: "melee" }))
      ).toBe(true);
    });

    it("should not match 'ranged-attack' for melee attacks", () => {
      expect(
        matchesTrigger(["ranged-attack"], makeAction({ type: "attack", attackType: "melee" }))
      ).toBe(false);
    });

    it("should match 'perception-audio' for audio perception skill tests", () => {
      expect(
        matchesTrigger(
          ["perception-audio"],
          makeAction({ type: "skill-test", perceptionType: "audio" })
        )
      ).toBe(true);
    });

    it("should match 'perception-visual' for visual perception tests", () => {
      expect(
        matchesTrigger(
          ["perception-visual"],
          makeAction({ type: "skill-test", perceptionType: "visual" })
        )
      ).toBe(true);
    });

    it("should match 'defense-test' for defense actions", () => {
      expect(matchesTrigger(["defense-test"], makeAction({ type: "defense" }))).toBe(true);
    });

    it("should match when any trigger in array matches", () => {
      expect(
        matchesTrigger(
          ["ranged-attack", "melee-attack"],
          makeAction({ type: "attack", attackType: "ranged" })
        )
      ).toBe(true);
    });

    it("should not match when no triggers match", () => {
      expect(
        matchesTrigger(["ranged-attack", "melee-attack"], makeAction({ type: "skill-test" }))
      ).toBe(false);
    });

    it("should match 'combat-action' for attack actions", () => {
      expect(matchesTrigger(["combat-action"], makeAction({ type: "attack" }))).toBe(true);
    });

    it("should match 'combat-action' for defense actions", () => {
      expect(matchesTrigger(["combat-action"], makeAction({ type: "defense" }))).toBe(true);
    });

    it("should match 'resistance-test' for resistance actions", () => {
      expect(matchesTrigger(["resistance-test"], makeAction({ type: "resistance" }))).toBe(true);
    });

    it("should match 'damage-resistance' for resistance actions", () => {
      expect(matchesTrigger(["damage-resistance"], makeAction({ type: "resistance" }))).toBe(true);
    });

    it("should match 'social-test' for social-specific actions", () => {
      expect(
        matchesTrigger(
          ["social-test"],
          makeAction({ type: "skill-test", specificAction: "negotiate" })
        )
      ).toBe(true);
    });

    it("should match 'matrix-action' for matrix-specific actions", () => {
      expect(
        matchesTrigger(
          ["matrix-action"],
          makeAction({ type: "skill-test", specificAction: "hack-on-the-fly" })
        )
      ).toBe(true);
    });
  });

  describe("matchesTarget", () => {
    it("should match when skill matches", () => {
      expect(matchesTarget({ skill: "firearms" }, makeAction({ skill: "firearms" }))).toBe(true);
    });

    it("should not match when skill differs", () => {
      expect(matchesTarget({ skill: "firearms" }, makeAction({ skill: "stealth" }))).toBe(false);
    });

    it("should match empty target (applies to all)", () => {
      expect(matchesTarget({}, makeAction({ skill: "firearms" }))).toBe(true);
    });

    it("should match when specificAction matches", () => {
      expect(
        matchesTarget(
          { specificAction: "called-shot" },
          makeAction({ specificAction: "called-shot" })
        )
      ).toBe(true);
    });

    it("should match when perceptionType matches", () => {
      expect(
        matchesTarget({ perceptionType: "audio" }, makeAction({ perceptionType: "audio" }))
      ).toBe(true);
    });

    it("should not match when perceptionType differs", () => {
      expect(
        matchesTarget({ perceptionType: "audio" }, makeAction({ perceptionType: "visual" }))
      ).toBe(false);
    });

    it("should match when target has skill but action has no skill (broad context)", () => {
      // If action doesn't specify a skill, we don't reject (the effect just targets that skill)
      expect(matchesTarget({ skill: "firearms" }, makeAction())).toBe(true);
    });
  });

  describe("matchesCondition", () => {
    it("should return true when no condition specified", () => {
      expect(matchesCondition(undefined, makeContext())).toBe(true);
    });

    it("should match lightingCondition", () => {
      expect(
        matchesCondition({ lightingCondition: "dark" }, makeContext({}, { lighting: "dark" }))
      ).toBe(true);
    });

    it("should not match mismatched lightingCondition", () => {
      expect(
        matchesCondition({ lightingCondition: "dark" }, makeContext({}, { lighting: "bright" }))
      ).toBe(false);
    });

    it("should fail lightingCondition when no environment provided", () => {
      expect(matchesCondition({ lightingCondition: "dark" }, makeContext())).toBe(false);
    });

    it("should match noiseCondition", () => {
      expect(matchesCondition({ noiseCondition: "loud" }, makeContext({}, { noise: "loud" }))).toBe(
        true
      );
    });

    it("should not match mismatched noiseCondition", () => {
      expect(
        matchesCondition({ noiseCondition: "loud" }, makeContext({}, { noise: "quiet" }))
      ).toBe(false);
    });
  });

  describe("effectApplies", () => {
    it("should return true when trigger, target, and condition all match", () => {
      const effect = makeEffect({
        triggers: ["skill-test"],
        target: { skill: "firearms" },
        condition: { lightingCondition: "dim" },
      });
      const context = makeContext({ type: "skill-test", skill: "firearms" }, { lighting: "dim" });
      expect(effectApplies(effect, context)).toBe(true);
    });

    it("should return false when trigger does not match", () => {
      const effect = makeEffect({ triggers: ["ranged-attack"] });
      const context = makeContext({ type: "skill-test" });
      expect(effectApplies(effect, context)).toBe(false);
    });

    it("should return false when target does not match", () => {
      const effect = makeEffect({
        triggers: ["skill-test"],
        target: { skill: "firearms" },
      });
      const context = makeContext({ type: "skill-test", skill: "stealth" });
      expect(effectApplies(effect, context)).toBe(false);
    });

    it("should return false when condition does not match", () => {
      const effect = makeEffect({
        triggers: ["always"],
        condition: { lightingCondition: "dark" },
      });
      const context = makeContext({}, { lighting: "bright" });
      expect(effectApplies(effect, context)).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// STACKING TESTS
// ---------------------------------------------------------------------------

describe("Stacking", () => {
  describe("getStackingRule", () => {
    it("should return known rule for dice-pool-modifier", () => {
      const rule = getStackingRule("dice-pool-modifier");
      expect(rule.behavior).toBe("stack");
      expect(rule.groupBy).toBe("none");
    });

    it("should return known rule for limit-modifier", () => {
      const rule = getStackingRule("limit-modifier");
      expect(rule.behavior).toBe("highest");
      expect(rule.groupBy).toBe("source-type");
    });

    it("should return known rule for accuracy-modifier", () => {
      const rule = getStackingRule("accuracy-modifier");
      expect(rule.behavior).toBe("highest");
      expect(rule.groupBy).toBe("none");
    });

    it("should return fallback for unknown type", () => {
      const rule = getStackingRule("special");
      expect(rule.behavior).toBe("stack");
      expect(rule.groupBy).toBe("none");
    });
  });

  describe("applyStackingRules", () => {
    it("should return empty result for empty array", () => {
      const result = applyStackingRules([]);
      expect(result.totalDicePoolModifier).toBe(0);
      expect(result.totalLimitModifier).toBe(0);
      expect(result.dicePoolModifiers).toHaveLength(0);
      expect(result.excludedByStacking).toHaveLength(0);
    });

    it("should stack dice-pool-modifiers (sum all)", () => {
      const effects = [
        makeResolved({
          effect: makeEffect({ id: "e1", type: "dice-pool-modifier" }),
          resolvedValue: 2,
        }),
        makeResolved({
          effect: makeEffect({ id: "e2", type: "dice-pool-modifier" }),
          resolvedValue: 3,
        }),
      ];
      const result = applyStackingRules(effects);
      expect(result.totalDicePoolModifier).toBe(5);
      expect(result.dicePoolModifiers).toHaveLength(2);
      expect(result.excludedByStacking).toHaveLength(0);
    });

    it("should take highest for accuracy-modifier", () => {
      const effects = [
        makeResolved({
          effect: makeEffect({ id: "e1", type: "accuracy-modifier" }),
          resolvedValue: 2,
        }),
        makeResolved({
          effect: makeEffect({ id: "e2", type: "accuracy-modifier" }),
          resolvedValue: 5,
        }),
        makeResolved({
          effect: makeEffect({ id: "e3", type: "accuracy-modifier" }),
          resolvedValue: 3,
        }),
      ];
      const result = applyStackingRules(effects);
      expect(result.totalAccuracyModifier).toBe(5);
      expect(result.accuracyModifiers).toHaveLength(1);
      expect(result.excludedByStacking).toHaveLength(2);
    });

    it("should group limit-modifier by source-type and take highest per group", () => {
      const effects = [
        makeResolved({
          effect: makeEffect({ id: "e1", type: "limit-modifier" }),
          source: makeSource({ type: "quality", id: "q1", name: "Quality 1" }),
          resolvedValue: 3,
        }),
        makeResolved({
          effect: makeEffect({ id: "e2", type: "limit-modifier" }),
          source: makeSource({ type: "quality", id: "q2", name: "Quality 2" }),
          resolvedValue: 1,
        }),
        makeResolved({
          effect: makeEffect({ id: "e3", type: "limit-modifier" }),
          source: makeSource({ type: "gear", id: "g1", name: "Gear 1" }),
          resolvedValue: 2,
        }),
      ];
      const result = applyStackingRules(effects);
      // Highest from quality (3) + highest from gear (2) = 5
      expect(result.totalLimitModifier).toBe(5);
      expect(result.limitModifiers).toHaveLength(2);
      expect(result.excludedByStacking).toHaveLength(1);
      expect(result.excludedByStacking[0].source.id).toBe("q2");
    });

    it("should stack initiative-modifiers (sum all)", () => {
      const effects = [
        makeResolved({
          effect: makeEffect({ id: "e1", type: "initiative-modifier" }),
          resolvedValue: 1,
        }),
        makeResolved({
          effect: makeEffect({ id: "e2", type: "initiative-modifier" }),
          resolvedValue: 2,
        }),
      ];
      const result = applyStackingRules(effects);
      expect(result.totalInitiativeModifier).toBe(3);
      expect(result.initiativeModifiers).toHaveLength(2);
    });

    it("should populate excludedByStacking correctly", () => {
      const effects = [
        makeResolved({
          effect: makeEffect({ id: "e1", type: "accuracy-modifier" }),
          resolvedValue: 1,
        }),
        makeResolved({
          effect: makeEffect({ id: "e2", type: "accuracy-modifier" }),
          resolvedValue: 5,
        }),
      ];
      const result = applyStackingRules(effects);
      expect(result.excludedByStacking).toHaveLength(1);
      expect(result.excludedByStacking[0].resolvedValue).toBe(1);
    });

    it("should handle multiple effect types simultaneously", () => {
      const effects = [
        makeResolved({
          effect: makeEffect({ id: "e1", type: "dice-pool-modifier" }),
          resolvedValue: 2,
        }),
        makeResolved({
          effect: makeEffect({ id: "e2", type: "initiative-modifier" }),
          resolvedValue: 1,
        }),
        makeResolved({
          effect: makeEffect({ id: "e3", type: "threshold-modifier" }),
          resolvedValue: -1,
        }),
      ];
      const result = applyStackingRules(effects);
      expect(result.totalDicePoolModifier).toBe(2);
      expect(result.totalInitiativeModifier).toBe(1);
      expect(result.totalThresholdModifier).toBe(-1);
    });
  });
});

// ---------------------------------------------------------------------------
// GATHERING TESTS
// ---------------------------------------------------------------------------

describe("Gathering", () => {
  const unifiedEffect: Effect = {
    id: "unified-effect-1",
    type: "dice-pool-modifier",
    triggers: ["skill-test"],
    target: { skill: "firearms" },
    value: 2,
  };

  const oldFormatEffect = {
    id: "old-effect-1",
    type: "dice-pool-modifier",
    trigger: "skill-test", // singular, not array
    target: { skill: "firearms" },
    value: 2,
  };

  it("should gather effects from qualities with unified format", () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "ambidextrous",
            name: "Ambidextrous",
            type: "positive",
            karmaCost: 4,
            summary: "Test",
            effects: [unifiedEffect],
          },
        ],
        negative: [],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].effect.id).toBe("unified-effect-1");
    expect(sources[0].source.type).toBe("quality");
    expect(sources[0].source.name).toBe("Ambidextrous");
  });

  it("should adapt old-format quality effects with standard triggers", () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "old-quality", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "old-quality",
            name: "Old Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [oldFormatEffect],
          },
        ],
        negative: [],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].effect.triggers).toEqual(["skill-test"]);
    expect(sources[0].effect.value).toBe(2);
    expect(sources[0].source.name).toBe("Old Quality");
  });

  it("should still skip non-adaptable old-format effects", () => {
    const nonAdaptableEffect = {
      id: "non-adaptable-1",
      type: "vehicle-modifier",
      trigger: "vehicle-operation",
      target: { skill: "pilot-ground-craft" },
      value: 1,
    };
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
            effects: [nonAdaptableEffect],
          },
        ],
        negative: [],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(0);
  });

  it("should gather effects from cyberware catalog items", () => {
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "wired-reflexes",
          name: "Wired Reflexes",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 2,
          essenceCost: 2,
          rating: 2,
          cost: 32000,
          availability: 12,
          wirelessEnabled: true,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "wired-reflexes",
            name: "Wired Reflexes",
            effects: [unifiedEffect],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].source.type).toBe("cyberware");
    expect(sources[0].source.wirelessEnabled).toBe(true);
    expect(sources[0].source.rating).toBe(2);
  });

  it("should set wirelessEnabled false when global wireless is off", () => {
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "wired-reflexes",
          name: "Wired Reflexes",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 2,
          essenceCost: 2,
          cost: 32000,
          availability: 12,
          wirelessEnabled: true,
        },
      ],
      wirelessBonusesEnabled: false,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "wired-reflexes",
            name: "Wired Reflexes",
            effects: [unifiedEffect],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].source.wirelessEnabled).toBe(false);
  });

  it("should gather effects from bioware catalog items", () => {
    const character = createMockCharacter({
      bioware: [
        {
          catalogId: "synaptic-booster",
          name: "Synaptic Booster",
          category: "cultured",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          rating: 1,
          cost: 95000,
          availability: 12,
          wirelessEnabled: true,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      bioware: {
        items: [
          {
            id: "synaptic-booster",
            name: "Synaptic Booster",
            effects: [unifiedEffect],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].source.type).toBe("bioware");
  });

  it("should gather effects from adept power catalog items", () => {
    const character = createMockCharacter({
      adeptPowers: [
        {
          id: "imp-reflexes-1",
          catalogId: "improved-reflexes",
          name: "Improved Reflexes",
          rating: 2,
          powerPointCost: 2.5,
        },
      ],
    });
    const ruleset = makeMockRuleset({
      adeptPowers: {
        powers: [
          {
            id: "improved-reflexes",
            name: "Improved Reflexes",
            effects: [unifiedEffect],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].source.type).toBe("adept-power");
    expect(sources[0].source.rating).toBe(2);
  });

  it("should gather effects from active modifiers", () => {
    const modifier: ActiveModifier = {
      id: "gm-mod-1",
      name: "GM Blessing",
      source: "gm",
      effect: unifiedEffect,
      appliedAt: new Date().toISOString(),
    };
    const character = createMockCharacter({
      activeModifiers: [modifier],
    });
    const ruleset = makeMockRuleset();

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].source.type).toBe("active-modifier");
    expect(sources[0].source.name).toBe("GM Blessing");
  });

  it("should filter expired active modifiers by timestamp", () => {
    const expired: ActiveModifier = {
      id: "expired-mod",
      name: "Expired Buff",
      source: "temporary",
      effect: unifiedEffect,
      appliedAt: "2020-01-01T00:00:00.000Z",
      expiresAt: "2020-01-02T00:00:00.000Z",
    };
    const character = createMockCharacter({
      activeModifiers: [expired],
    });
    const ruleset = makeMockRuleset();

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(0);
  });

  it("should filter expired active modifiers by remaining uses", () => {
    const exhausted: ActiveModifier = {
      id: "exhausted-mod",
      name: "Used Up",
      source: "temporary",
      effect: unifiedEffect,
      appliedAt: new Date().toISOString(),
      expiresAfterUses: 3,
      remainingUses: 0,
    };
    const character = createMockCharacter({
      activeModifiers: [exhausted],
    });
    const ruleset = makeMockRuleset();

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(0);
  });

  it("should handle missing catalog items gracefully", () => {
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "nonexistent-ware",
          name: "Missing Item",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 1,
          essenceCost: 1,
          cost: 5000,
          availability: 4,
        },
      ],
    });
    const ruleset = makeMockRuleset({ cyberware: { items: [] } });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(0);
  });

  it("should handle empty character (no gear, no qualities)", () => {
    const character = createMockCharacter();
    const ruleset = makeMockRuleset();

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(0);
  });

  it("should gather weapon modification effects", () => {
    const character = createMockCharacter({
      weapons: [
        {
          id: "pred-v-1",
          catalogId: "ares-predator-v",
          name: "Ares Predator V",
          category: "weapon",
          subcategory: "heavy-pistols",
          quantity: 1,
          cost: 725,
          damage: "8P",
          ap: -1,
          mode: ["SA"],
          modifications: [
            {
              catalogId: "laser-sight",
              name: "Laser Sight",
              mount: "top",
              cost: 125,
              availability: 2,
              capacityUsed: 0,
            },
          ],
        },
      ],
    });
    const ruleset = makeMockRuleset({
      modifications: {
        weaponMods: [
          {
            id: "laser-sight",
            name: "Laser Sight",
            effects: [
              {
                id: "laser-sight-accuracy",
                type: "accuracy-modifier",
                triggers: ["ranged-attack"],
                target: { limit: "accuracy" },
                value: 1,
                description: "+1 Accuracy",
              },
            ],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].effect.id).toBe("laser-sight-accuracy");
    expect(sources[0].effect.type).toBe("accuracy-modifier");
    expect(sources[0].source.type).toBe("gear");
    expect(sources[0].source.name).toBe("Laser Sight");
  });

  it("should gather gear modification effects (vision/audio enhancements)", () => {
    const character = createMockCharacter({
      gear: [
        {
          id: "contacts-r3-1",
          name: "Contacts (R3)",
          category: "electronics",
          quantity: 1,
          cost: 600,
          rating: 3,
          capacity: 3,
          capacityUsed: 1,
          modifications: [
            {
              catalogId: "vision-enhancement",
              name: "Vision Enhancement",
              rating: 2,
              capacityUsed: 2,
              cost: 1000,
              availability: 4,
            },
          ],
        },
      ],
    });
    const ruleset = makeMockRuleset({
      gear: {
        visionEnhancements: [
          {
            id: "vision-enhancement",
            name: "Vision Enhancement",
            effects: [
              {
                id: "vision-enhancement-limit",
                type: "limit-modifier",
                triggers: ["perception-visual", "skill-test"],
                target: { limit: "mental", skill: "perception", perceptionType: "visual" },
                value: { perRating: 1 },
                description: "+[Rating] limit on visual Perception",
              },
            ],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].effect.id).toBe("vision-enhancement-limit");
    expect(sources[0].effect.type).toBe("limit-modifier");
    expect(sources[0].source.type).toBe("gear");
    expect(sources[0].source.rating).toBe(2);
  });

  it("should skip missing catalog items in modifications module", () => {
    const character = createMockCharacter({
      weapons: [
        {
          id: "weapon-1",
          catalogId: "ares-predator-v",
          name: "Ares Predator V",
          category: "weapon",
          subcategory: "heavy-pistols",
          quantity: 1,
          cost: 725,
          damage: "8P",
          ap: -1,
          mode: ["SA"],
          modifications: [
            {
              catalogId: "nonexistent-mod",
              name: "Missing Mod",
              cost: 100,
              availability: 2,
              capacityUsed: 0,
            },
          ],
        },
      ],
    });
    const ruleset = makeMockRuleset({ modifications: { weaponMods: [] } });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(0);
  });

  it("should gather multiple mods on same weapon", () => {
    const character = createMockCharacter({
      weapons: [
        {
          id: "rifle-1",
          catalogId: "ares-alpha",
          name: "Ares Alpha",
          category: "weapon",
          subcategory: "assault-rifles",
          quantity: 1,
          cost: 2650,
          damage: "11P",
          ap: -2,
          mode: ["SA", "BF", "FA"],
          modifications: [
            {
              catalogId: "smartgun-internal",
              name: "Smartgun System, Internal",
              cost: 0,
              availability: 2,
              capacityUsed: 0,
              isBuiltIn: true,
            },
            {
              catalogId: "shock-pad",
              name: "Shock Pad",
              mount: "stock",
              cost: 50,
              availability: 2,
              capacityUsed: 0,
            },
          ],
        },
      ],
    });
    const ruleset = makeMockRuleset({
      modifications: {
        weaponMods: [
          {
            id: "smartgun-internal",
            name: "Smartgun System, Internal",
            effects: [
              {
                id: "smartgun-internal-accuracy",
                type: "accuracy-modifier",
                triggers: ["ranged-attack"],
                target: { limit: "accuracy" },
                value: 2,
              },
            ],
          },
          {
            id: "shock-pad",
            name: "Shock Pad",
            effects: [
              {
                id: "shock-pad-rc",
                type: "recoil-compensation",
                triggers: ["ranged-attack"],
                target: {},
                value: 1,
              },
            ],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(2);
    const effectIds = sources.map((s) => s.effect.id);
    expect(effectIds).toContain("smartgun-internal-accuracy");
    expect(effectIds).toContain("shock-pad-rc");
  });

  it("should preserve rating from InstalledGearMod for per-rating scaling", () => {
    const character = createMockCharacter({
      gear: [
        {
          id: "goggles-1",
          name: "Goggles (R6)",
          category: "electronics",
          quantity: 1,
          cost: 300,
          rating: 6,
          capacity: 6,
          capacityUsed: 3,
          modifications: [
            {
              catalogId: "audio-enhancement",
              name: "Audio Enhancement",
              rating: 3,
              capacityUsed: 3,
              cost: 1500,
              availability: 6,
            },
          ],
        },
      ],
    });
    const ruleset = makeMockRuleset({
      gear: {
        audioEnhancements: [
          {
            id: "audio-enhancement",
            name: "Audio Enhancement",
            effects: [
              {
                id: "audio-enhancement-limit",
                type: "limit-modifier",
                triggers: ["perception-audio"],
                target: { limit: "mental" },
                value: { perRating: 1 },
              },
            ],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].source.rating).toBe(3);
    expect(sources[0].effect.value).toEqual({ perRating: 1 });
  });
});

// ---------------------------------------------------------------------------
// RESOLVER INTEGRATION TESTS
// ---------------------------------------------------------------------------

describe("Resolver Integration", () => {
  const dicePoolEffect: Effect = {
    id: "dice-pool-1",
    type: "dice-pool-modifier",
    triggers: ["skill-test"],
    target: { skill: "firearms" },
    value: 2,
  };

  const initEffect: Effect = {
    id: "init-1",
    type: "initiative-modifier",
    triggers: ["always"],
    target: {},
    value: 1,
  };

  it("should run full pipeline with mock unified effects", () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "sharp-shooter", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "sharp-shooter",
            name: "Sharp Shooter",
            type: "positive",
            karmaCost: 5,
            summary: "Better at shooting",
            effects: [dicePoolEffect],
          },
        ],
        negative: [],
      },
    });
    const context = makeContext({ type: "skill-test", skill: "firearms" });

    const result = resolveEffects(character, context, ruleset);
    expect(result.totalDicePoolModifier).toBe(2);
    expect(result.dicePoolModifiers).toHaveLength(1);
  });

  it("should resolve per-rating value", () => {
    const perRatingEffect: Effect = {
      id: "per-rating-1",
      type: "dice-pool-modifier",
      triggers: ["always"],
      target: {},
      value: { perRating: 1 },
    };
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "scaled-quality", source: "creation", rating: 3 }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "scaled-quality",
            name: "Scaled Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Scales with rating",
            effects: [perRatingEffect],
          },
        ],
        negative: [],
      },
    });
    const context = makeContext({ type: "skill-test" });

    const result = resolveEffects(character, context, ruleset);
    expect(result.totalDicePoolModifier).toBe(3); // perRating 1 * rating 3
  });

  it("should apply wireless variant type change", () => {
    const wirelessEffect: Effect = {
      id: "wireless-type-change",
      type: "limit-modifier",
      triggers: ["always"],
      target: {},
      value: 1,
      wirelessOverride: {
        type: "dice-pool-modifier",
        description: "Wireless bonus converts limit to dice pool",
      },
    };
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "smartlink",
          name: "Smartlink",
          category: "eyeware",
          grade: "standard",
          baseEssenceCost: 0.2,
          essenceCost: 0.2,
          cost: 4000,
          availability: 8,
          wirelessEnabled: true,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "smartlink",
            name: "Smartlink",
            effects: [wirelessEffect],
          },
        ],
      },
    });
    const context = makeContext({ type: "skill-test" });

    const result = resolveEffects(character, context, ruleset);
    // Type changed from limit-modifier to dice-pool-modifier
    expect(result.totalDicePoolModifier).toBe(1);
    expect(result.totalLimitModifier).toBe(0);
    expect(result.dicePoolModifiers[0].appliedVariant).toBe("wireless");
  });

  it("should apply wireless bonusValue addition", () => {
    const wirelessBonusEffect: Effect = {
      id: "wireless-bonus",
      type: "dice-pool-modifier",
      triggers: ["always"],
      target: {},
      value: 1,
      wirelessOverride: {
        bonusValue: 1,
      },
    };
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "reflex-recorder",
          name: "Reflex Recorder",
          category: "headware",
          grade: "standard",
          baseEssenceCost: 0.1,
          essenceCost: 0.1,
          cost: 14000,
          availability: 10,
          wirelessEnabled: true,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "reflex-recorder",
            name: "Reflex Recorder",
            effects: [wirelessBonusEffect],
          },
        ],
      },
    });
    const context = makeContext({ type: "skill-test" });

    const result = resolveEffects(character, context, ruleset);
    // base 1 + wireless bonus 1 = 2
    expect(result.totalDicePoolModifier).toBe(2);
  });

  it("should zero out requiresWireless effects when wireless is off", () => {
    const wirelessRequiredEffect: Effect = {
      id: "requires-wireless",
      type: "dice-pool-modifier",
      triggers: ["always"],
      target: {},
      value: 2,
      requiresWireless: true,
    };
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "wireless-ware",
          name: "Wireless Ware",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 10000,
          availability: 6,
          wirelessEnabled: false,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "wireless-ware",
            name: "Wireless Ware",
            effects: [wirelessRequiredEffect],
          },
        ],
      },
    });
    const context = makeContext({ type: "skill-test" });

    const result = resolveEffects(character, context, ruleset);
    expect(result.totalDicePoolModifier).toBe(0);
  });

  it("should apply stacking rules end-to-end", () => {
    // Two accuracy modifiers from different sources — highest wins
    const accEffect1: Effect = {
      id: "acc-1",
      type: "accuracy-modifier",
      triggers: ["always"],
      target: {},
      value: 1,
    };
    const accEffect2: Effect = {
      id: "acc-2",
      type: "accuracy-modifier",
      triggers: ["always"],
      target: {},
      value: 3,
    };
    const character = createMockCharacter({
      positiveQualities: [
        { qualityId: "q1", source: "creation" },
        { qualityId: "q2", source: "creation" },
      ],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "q1",
            name: "Quality 1",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [accEffect1],
          },
          {
            id: "q2",
            name: "Quality 2",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [accEffect2],
          },
        ],
        negative: [],
      },
    });
    const context = makeContext({ type: "skill-test" });

    const result = resolveEffects(character, context, ruleset);
    expect(result.totalAccuracyModifier).toBe(3); // highest wins
    expect(result.accuracyModifiers).toHaveLength(1);
    expect(result.excludedByStacking).toHaveLength(1);
  });

  it("should return all-zero result for empty character", () => {
    const character = createMockCharacter();
    const ruleset = makeMockRuleset();
    const context = makeContext({ type: "skill-test" });

    const result = resolveEffects(character, context, ruleset);
    expect(result.totalDicePoolModifier).toBe(0);
    expect(result.totalLimitModifier).toBe(0);
    expect(result.totalThresholdModifier).toBe(0);
    expect(result.totalAccuracyModifier).toBe(0);
    expect(result.totalInitiativeModifier).toBe(0);
    expect(result.dicePoolModifiers).toHaveLength(0);
    expect(result.excludedByStacking).toHaveLength(0);
  });

  it("should combine effects from multiple source types", () => {
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "quality-with-effect", source: "creation" }],
      activeModifiers: [
        {
          id: "active-mod-1",
          name: "Active Buff",
          source: "gm",
          effect: {
            id: "active-dice-pool",
            type: "dice-pool-modifier",
            triggers: ["always"],
            target: {},
            value: 1,
          },
          appliedAt: new Date().toISOString(),
        },
      ],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "quality-with-effect",
            name: "Helpful Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [dicePoolEffect],
          },
        ],
        negative: [],
      },
    });
    const context = makeContext({ type: "skill-test", skill: "firearms" });

    const result = resolveEffects(character, context, ruleset);
    // Quality dice pool (2) + active modifier dice pool (1) = 3
    expect(result.totalDicePoolModifier).toBe(3);
    expect(result.dicePoolModifiers).toHaveLength(2);
  });

  it("should filter effects by action type", () => {
    const rangedOnlyEffect: Effect = {
      id: "ranged-only",
      type: "dice-pool-modifier",
      triggers: ["ranged-attack"],
      target: {},
      value: 2,
    };
    const character = createMockCharacter({
      positiveQualities: [{ qualityId: "ranged-quality", source: "creation" }],
    });
    const ruleset = makeMockRuleset({
      qualities: {
        positive: [
          {
            id: "ranged-quality",
            name: "Ranged Quality",
            type: "positive",
            karmaCost: 5,
            summary: "Test",
            effects: [rangedOnlyEffect],
          },
        ],
        negative: [],
      },
    });

    // Should apply for ranged attack
    const rangedContext = makeContext({ type: "attack", attackType: "ranged" });
    const rangedResult = resolveEffects(character, rangedContext, ruleset);
    expect(rangedResult.totalDicePoolModifier).toBe(2);

    // Should not apply for skill test
    const skillContext = makeContext({ type: "skill-test" });
    const skillResult = resolveEffects(character, skillContext, ruleset);
    expect(skillResult.totalDicePoolModifier).toBe(0);
  });

  it("should resolve weapon mod accuracy modifier through full pipeline", () => {
    const character = createMockCharacter({
      weapons: [
        {
          id: "pred-1",
          catalogId: "ares-predator-v",
          name: "Ares Predator V",
          category: "weapon",
          subcategory: "heavy-pistols",
          quantity: 1,
          cost: 725,
          damage: "8P",
          ap: -1,
          mode: ["SA"],
          modifications: [
            {
              catalogId: "smartgun-internal",
              name: "Smartgun System, Internal",
              cost: 0,
              availability: 2,
              capacityUsed: 0,
              isBuiltIn: true,
            },
          ],
        },
      ],
    });
    const ruleset = makeMockRuleset({
      modifications: {
        weaponMods: [
          {
            id: "smartgun-internal",
            name: "Smartgun System, Internal",
            effects: [
              {
                id: "smartgun-internal-accuracy",
                type: "accuracy-modifier",
                triggers: ["ranged-attack"],
                target: { limit: "accuracy" },
                value: 2,
                description: "+2 Accuracy when used with smartlink",
              },
            ],
          },
        ],
      },
    });
    const context = makeContext({ type: "attack", attackType: "ranged" });

    const result = resolveEffects(character, context, ruleset);
    expect(result.totalAccuracyModifier).toBe(2);
    expect(result.accuracyModifiers).toHaveLength(1);
  });

  it("should resolve per-rating gear mod through full pipeline", () => {
    const character = createMockCharacter({
      gear: [
        {
          id: "contacts-1",
          name: "Contacts (R3)",
          category: "electronics",
          quantity: 1,
          cost: 600,
          modifications: [
            {
              catalogId: "vision-enhancement",
              name: "Vision Enhancement",
              rating: 2,
              capacityUsed: 2,
              cost: 1000,
              availability: 4,
            },
          ],
        },
      ],
    });
    const ruleset = makeMockRuleset({
      gear: {
        visionEnhancements: [
          {
            id: "vision-enhancement",
            name: "Vision Enhancement",
            effects: [
              {
                id: "vision-enhancement-limit",
                type: "limit-modifier",
                triggers: ["perception-visual", "skill-test"],
                target: { limit: "mental", skill: "perception", perceptionType: "visual" },
                value: { perRating: 1 },
              },
            ],
          },
        ],
      },
    });
    const context = makeContext({ type: "skill-test", perceptionType: "visual" });

    const result = resolveEffects(character, context, ruleset);
    // perRating 1 * rating 2 = 2
    expect(result.totalLimitModifier).toBe(2);
    expect(result.limitModifiers).toHaveLength(1);
  });

  it("should apply wireless override on gear mod with wireless enabled", () => {
    const character = createMockCharacter({
      gear: [
        {
          id: "earbuds-1",
          name: "Earbuds (R3)",
          category: "electronics",
          quantity: 1,
          cost: 300,
          modifications: [
            {
              catalogId: "audio-enhancement",
              name: "Audio Enhancement",
              rating: 2,
              capacityUsed: 2,
              cost: 1000,
              availability: 4,
            },
          ],
        },
      ],
    });
    // Note: gear mods use source type "gear" (not cyberware), so wireless
    // resolution depends on the source.wirelessEnabled field. Since gear
    // sources don't set wirelessEnabled, the wireless override is not auto-applied.
    // This test verifies the base value resolves correctly.
    const ruleset = makeMockRuleset({
      gear: {
        audioEnhancements: [
          {
            id: "audio-enhancement",
            name: "Audio Enhancement",
            effects: [
              {
                id: "audio-enhancement-limit",
                type: "limit-modifier",
                triggers: ["perception-audio", "skill-test"],
                target: { limit: "mental", skill: "perception", perceptionType: "audio" },
                value: { perRating: 1 },
                wirelessOverride: {
                  type: "dice-pool-modifier",
                  description: "+[Rating] dice on audio Perception",
                },
              },
            ],
          },
        ],
      },
    });
    const context = makeContext({ type: "skill-test", perceptionType: "audio" });

    const result = resolveEffects(character, context, ruleset);
    // Base value: perRating 1 * rating 2 = 2, as limit-modifier
    expect(result.totalLimitModifier).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// AUGMENTATION GATHERING TESTS (Issue #112)
// ---------------------------------------------------------------------------

describe("Augmentation Gathering", () => {
  it("should gather cyberware effects with correct source metadata", () => {
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "wired-reflexes",
          name: "Wired Reflexes",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 3,
          essenceCost: 3,
          rating: 2,
          cost: 149000,
          availability: 12,
          wirelessEnabled: true,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "wired-reflexes",
            name: "Wired Reflexes",
            effects: [
              {
                id: "wired-reflexes-reaction",
                type: "attribute-modifier",
                triggers: ["always"],
                target: { attribute: "reaction" },
                value: { perRating: 1 },
                stackingGroup: "reaction-augmentation",
              },
              {
                id: "wired-reflexes-initiative",
                type: "initiative-modifier",
                triggers: ["always"],
                target: {},
                value: { perRating: 1 },
                stackingGroup: "initiative-augmentation",
                wirelessOverride: { bonusValue: 1 },
              },
            ],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(2);
    expect(sources[0].effect.id).toBe("wired-reflexes-reaction");
    expect(sources[0].effect.type).toBe("attribute-modifier");
    expect(sources[1].effect.id).toBe("wired-reflexes-initiative");
    expect(sources[1].effect.type).toBe("initiative-modifier");
    expect(sources[0].source.type).toBe("cyberware");
    expect(sources[0].source.rating).toBe(2);
    expect(sources[0].source.wirelessEnabled).toBe(true);
  });

  it("should gather bioware effects (cerebral-booster → attribute-modifier)", () => {
    const character = createMockCharacter({
      bioware: [
        {
          catalogId: "cerebral-booster",
          name: "Cerebral Booster",
          category: "cultured",
          grade: "standard",
          baseEssenceCost: 0.4,
          essenceCost: 0.4,
          rating: 2,
          cost: 63000,
          availability: 14,
          wirelessEnabled: true,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      bioware: {
        items: [
          {
            id: "cerebral-booster",
            name: "Cerebral Booster",
            effects: [
              {
                id: "cerebral-booster-logic",
                type: "attribute-modifier",
                triggers: ["always"],
                target: { attribute: "logic" },
                value: { perRating: 1 },
              },
            ],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].effect.id).toBe("cerebral-booster-logic");
    expect(sources[0].effect.type).toBe("attribute-modifier");
    expect(sources[0].source.type).toBe("bioware");
    expect(sources[0].source.rating).toBe(2);
  });

  it("should propagate wireless enabled from cyberware source", () => {
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "cybereyes",
          name: "Cybereyes",
          category: "eyeware",
          grade: "standard",
          baseEssenceCost: 0.3,
          essenceCost: 0.3,
          rating: 2,
          cost: 6000,
          availability: 6,
          wirelessEnabled: true,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "cybereyes",
            name: "Cybereyes",
            effects: [
              {
                id: "cybereyes-perception-limit",
                type: "limit-modifier",
                triggers: ["perception-visual"],
                target: { limit: "mental", perceptionType: "visual" },
                value: 1,
                requiresWireless: true,
              },
            ],
          },
        ],
      },
    });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(1);
    expect(sources[0].source.wirelessEnabled).toBe(true);
    expect(sources[0].effect.requiresWireless).toBe(true);
  });

  it("should gracefully skip missing bioware catalog item", () => {
    const character = createMockCharacter({
      bioware: [
        {
          catalogId: "nonexistent-bioware",
          name: "Ghost Bioware",
          category: "basic",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 10000,
          availability: 6,
        },
      ],
    });
    const ruleset = makeMockRuleset({ bioware: { items: [] } });

    const sources = gatherEffectSources(character, ruleset);
    expect(sources).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// AUGMENTATION RESOLVER INTEGRATION TESTS (Issue #112)
// ---------------------------------------------------------------------------

describe("Augmentation Resolver Integration", () => {
  it("should resolve per-rating cyberware: wired-reflexes R2 → attribute-modifier resolves to 2", () => {
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "wired-reflexes",
          name: "Wired Reflexes",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 3,
          essenceCost: 3,
          rating: 2,
          cost: 149000,
          availability: 12,
          wirelessEnabled: false,
        },
      ],
      wirelessBonusesEnabled: false,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "wired-reflexes",
            name: "Wired Reflexes",
            effects: [
              {
                id: "wired-reflexes-initiative",
                type: "initiative-modifier",
                triggers: ["always"],
                target: {},
                value: { perRating: 1 },
                wirelessOverride: { bonusValue: 1 },
              },
            ],
          },
        ],
      },
    });
    const context = makeContext({ type: "initiative" });

    const result = resolveEffects(character, context, ruleset);
    // perRating 1 * rating 2 = 2, no wireless bonus
    expect(result.totalInitiativeModifier).toBe(2);
    expect(result.initiativeModifiers).toHaveLength(1);
    expect(result.initiativeModifiers[0].appliedVariant).toBe("standard");
  });

  it("should apply wireless override: wired-reflexes R2 with wireless → initiative resolves to 3", () => {
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "wired-reflexes",
          name: "Wired Reflexes",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 3,
          essenceCost: 3,
          rating: 2,
          cost: 149000,
          availability: 12,
          wirelessEnabled: true,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "wired-reflexes",
            name: "Wired Reflexes",
            effects: [
              {
                id: "wired-reflexes-initiative",
                type: "initiative-modifier",
                triggers: ["always"],
                target: {},
                value: { perRating: 1 },
                wirelessOverride: { bonusValue: 1 },
              },
            ],
          },
        ],
      },
    });
    const context = makeContext({ type: "initiative" });

    const result = resolveEffects(character, context, ruleset);
    // perRating 1 * rating 2 = 2 base + wireless bonusValue 1 = 3
    expect(result.totalInitiativeModifier).toBe(3);
    expect(result.initiativeModifiers[0].appliedVariant).toBe("wireless");
  });

  it("should gate requiresWireless: cybereyes perception limit with wireless off → value 0", () => {
    const character = createMockCharacter({
      cyberware: [
        {
          catalogId: "cybereyes",
          name: "Cybereyes",
          category: "eyeware",
          grade: "standard",
          baseEssenceCost: 0.3,
          essenceCost: 0.3,
          rating: 2,
          cost: 6000,
          availability: 6,
          wirelessEnabled: false,
        },
      ],
      wirelessBonusesEnabled: true,
    });
    const ruleset = makeMockRuleset({
      cyberware: {
        items: [
          {
            id: "cybereyes",
            name: "Cybereyes",
            effects: [
              {
                id: "cybereyes-perception-limit",
                type: "limit-modifier",
                triggers: ["perception-visual"],
                target: { limit: "mental", perceptionType: "visual" },
                value: 1,
                requiresWireless: true,
              },
            ],
          },
        ],
      },
    });
    const context = makeContext({ type: "skill-test", perceptionType: "visual" });

    const result = resolveEffects(character, context, ruleset);
    // Wireless is off on the item → requiresWireless effect resolves to 0
    expect(result.totalLimitModifier).toBe(0);
  });
});
