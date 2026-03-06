/**
 * Tests for the EffectContextBuilder.
 *
 * Covers factory methods, modifier chaining, validation,
 * immutability, and integration with the resolver pipeline.
 *
 * @see Issue #109
 */

import { describe, it, expect } from "vitest";
import type { Character } from "@/lib/types";
import type { MergedRuleset } from "@/lib/types/edition";
import type { Effect, EffectResolutionContext } from "@/lib/types/effects";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import { EffectContextBuilder, resolveEffects } from "@/lib/rules/effects";

// ---------------------------------------------------------------------------
// Helpers (reused from resolver.test.ts patterns)
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
// FACTORY METHOD TESTS
// ---------------------------------------------------------------------------

describe("EffectContextBuilder — Factory Methods", () => {
  it("forSkillTest sets skill-test action with skill", () => {
    const ctx = EffectContextBuilder.forSkillTest("firearms").build();
    expect(ctx.action).toEqual({ type: "skill-test", skill: "firearms" });
  });

  it("forPerception sets skill-test with perception fields", () => {
    const ctx = EffectContextBuilder.forPerception("audio").build();
    expect(ctx.action).toEqual({
      type: "skill-test",
      skill: "perception",
      perceptionType: "audio",
      specificAction: undefined,
    });
  });

  it("forPerception with specificAction includes it", () => {
    const ctx = EffectContextBuilder.forPerception("visual", "spot-hidden").build();
    expect(ctx.action).toEqual({
      type: "skill-test",
      skill: "perception",
      perceptionType: "visual",
      specificAction: "spot-hidden",
    });
  });

  it("forRangedAttack sets ranged attack with weaponId", () => {
    const ctx = EffectContextBuilder.forRangedAttack("weapon-1").build();
    expect(ctx.action).toEqual({
      type: "attack",
      attackType: "ranged",
      weaponId: "weapon-1",
    });
  });

  it("forMeleeAttack sets melee attack with weaponId", () => {
    const ctx = EffectContextBuilder.forMeleeAttack("weapon-2").build();
    expect(ctx.action).toEqual({
      type: "attack",
      attackType: "melee",
      weaponId: "weapon-2",
    });
  });

  it("forDefense sets defense action", () => {
    const ctx = EffectContextBuilder.forDefense().build();
    expect(ctx.action).toEqual({
      type: "defense",
      specificAction: undefined,
    });
  });

  it("forDefense with specificAction sets it", () => {
    const ctx = EffectContextBuilder.forDefense("full-auto").build();
    expect(ctx.action).toEqual({
      type: "defense",
      specificAction: "full-auto",
    });
  });

  it("forInitiative sets initiative action", () => {
    const ctx = EffectContextBuilder.forInitiative().build();
    expect(ctx.action).toEqual({ type: "initiative" });
  });
});

// ---------------------------------------------------------------------------
// MODIFIER METHOD TESTS
// ---------------------------------------------------------------------------

describe("EffectContextBuilder — Modifier Methods", () => {
  it("withEnvironment sets environment", () => {
    const ctx = EffectContextBuilder.forSkillTest("firearms")
      .withEnvironment({ lighting: "dark" })
      .build();
    expect(ctx.environment).toEqual({ lighting: "dark" });
  });

  it("withEnvironment called twice merges values", () => {
    const ctx = EffectContextBuilder.forSkillTest("firearms")
      .withEnvironment({ lighting: "dim" })
      .withEnvironment({ noise: "loud" })
      .build();
    expect(ctx.environment).toEqual({ lighting: "dim", noise: "loud" });
  });

  it("withAttribute sets attribute on action", () => {
    const ctx = EffectContextBuilder.forSkillTest("firearms").withAttribute("agility").build();
    expect(ctx.action.attribute).toBe("agility");
  });

  it("withSpecificAction sets specificAction on action", () => {
    const ctx = EffectContextBuilder.forSkillTest("firearms")
      .withSpecificAction("called-shot")
      .build();
    expect(ctx.action.specificAction).toBe("called-shot");
  });

  it("withSkillCategory sets skillCategory on action", () => {
    const ctx = EffectContextBuilder.forSkillTest("leadership").withSkillCategory("social").build();
    expect(ctx.action.skillCategory).toBe("social");
  });

  it("supports full chaining", () => {
    const ctx = EffectContextBuilder.forSkillTest("firearms")
      .withEnvironment({ lighting: "dim" })
      .withAttribute("agility")
      .withSpecificAction("called-shot")
      .build();

    expect(ctx.action.type).toBe("skill-test");
    expect(ctx.action.skill).toBe("firearms");
    expect(ctx.action.attribute).toBe("agility");
    expect(ctx.action.specificAction).toBe("called-shot");
    expect(ctx.environment).toEqual({ lighting: "dim" });
  });
});

// ---------------------------------------------------------------------------
// VALIDATION TESTS
// ---------------------------------------------------------------------------

describe("EffectContextBuilder — Validation", () => {
  it("throws when build() is called without a factory method", () => {
    const builder = new EffectContextBuilder();
    expect(() => builder.build()).toThrow(
      "EffectContextBuilder: action context is required — use a static factory method"
    );
  });
});

// ---------------------------------------------------------------------------
// IMMUTABILITY TESTS
// ---------------------------------------------------------------------------

describe("EffectContextBuilder — Immutability", () => {
  it("build() returns separate objects on each call", () => {
    const builder = EffectContextBuilder.forSkillTest("firearms").withEnvironment({
      lighting: "dark",
    });

    const ctx1 = builder.build();
    const ctx2 = builder.build();

    expect(ctx1).toEqual(ctx2);
    expect(ctx1).not.toBe(ctx2);
    expect(ctx1.action).not.toBe(ctx2.action);
  });
});

// ---------------------------------------------------------------------------
// INTEGRATION WITH RESOLVER
// ---------------------------------------------------------------------------

describe("EffectContextBuilder — Resolver Integration", () => {
  const dicePoolEffect: Effect = {
    id: "dice-pool-1",
    type: "dice-pool-modifier",
    triggers: ["skill-test"],
    target: { skill: "firearms" },
    value: 2,
  };

  function makeCharacterWithQuality(): Character {
    return createMockCharacter({
      positiveQualities: [{ qualityId: "sharp-shooter", source: "creation" }],
    });
  }

  function makeRulesetWithQuality(): MergedRuleset {
    return makeMockRuleset({
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
  }

  it("builder-created context works with resolveEffects", () => {
    const character = makeCharacterWithQuality();
    const ruleset = makeRulesetWithQuality();
    const ctx = EffectContextBuilder.forSkillTest("firearms").build();

    const result = resolveEffects(character, ctx, ruleset);
    expect(result.totalDicePoolModifier).toBe(2);
    expect(result.dicePoolModifiers).toHaveLength(1);
  });

  it("builder-created context produces same result as manually constructed context", () => {
    const character = makeCharacterWithQuality();
    const ruleset = makeRulesetWithQuality();

    const builderCtx = EffectContextBuilder.forSkillTest("firearms")
      .withEnvironment({ lighting: "dim" })
      .build();

    const manualCtx: EffectResolutionContext = {
      action: { type: "skill-test", skill: "firearms" },
      environment: { lighting: "dim" },
    };

    const builderResult = resolveEffects(character, builderCtx, ruleset);
    const manualResult = resolveEffects(character, manualCtx, ruleset);

    expect(builderResult.totalDicePoolModifier).toBe(manualResult.totalDicePoolModifier);
    expect(builderResult.dicePoolModifiers).toHaveLength(manualResult.dicePoolModifiers.length);
  });
});
