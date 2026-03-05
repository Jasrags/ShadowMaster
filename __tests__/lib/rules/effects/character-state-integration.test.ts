/**
 * Integration tests for character state flags in the unified effect system.
 *
 * Verifies that state-dependent triggers (withdrawal, on-exposure, first-meeting)
 * are correctly resolved through the unified pipeline when character state flags
 * are present in the resolution context.
 *
 * @see Issue #485
 */

import { describe, it, expect } from "vitest";
import type { Effect, EffectResolutionContext, EffectSource } from "@/lib/types/effects";
import { matchesTrigger, effectApplies, resolveFromSources } from "@/lib/rules/effects";
import { EffectContextBuilder } from "@/lib/rules/effects";
import { buildCharacterStateFlags } from "@/lib/rules/effects/character-state";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import type { SourcedEffect } from "@/lib/rules/effects";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeWithdrawalEffect(value: number = -2): Effect {
  return {
    id: "withdrawal-penalty",
    type: "dice-pool-modifier",
    triggers: ["withdrawal"],
    target: { attribute: "body" },
    value,
  };
}

function makeExposureEffect(value: number = -1): Effect {
  return {
    id: "exposure-penalty",
    type: "dice-pool-modifier",
    triggers: ["on-exposure"],
    target: {},
    value,
  };
}

function makeFirstMeetingEffect(value: number = 2): Effect {
  return {
    id: "first-impression",
    type: "dice-pool-modifier",
    triggers: ["first-meeting"],
    target: { testCategory: "social" },
    value,
  };
}

function makeSource(id: string = "test-quality"): EffectSource {
  return { type: "quality", id, name: "Test Quality" };
}

// ---------------------------------------------------------------------------
// matchesTrigger with character state
// ---------------------------------------------------------------------------

describe("matchesTrigger with character state flags", () => {
  it("matches withdrawal trigger when withdrawalActive is set", () => {
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test", skill: "pistols" },
      characterState: { withdrawalActive: true },
    };
    expect(matchesTrigger(["withdrawal"], ctx)).toBe(true);
  });

  it("does not match withdrawal without characterState", () => {
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test", skill: "pistols" },
    };
    expect(matchesTrigger(["withdrawal"], ctx)).toBe(false);
  });

  it("does not match withdrawal when withdrawalActive is false", () => {
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test" },
      characterState: { withdrawalActive: false },
    };
    expect(matchesTrigger(["withdrawal"], ctx)).toBe(false);
  });

  it("matches on-exposure trigger when exposureActive is set", () => {
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test" },
      characterState: { exposureActive: true },
    };
    expect(matchesTrigger(["on-exposure"], ctx)).toBe(true);
  });

  it("matches first-meeting trigger when firstMeeting is set", () => {
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test" },
      characterState: { firstMeeting: true },
    };
    expect(matchesTrigger(["first-meeting"], ctx)).toBe(true);
  });

  it("backward compatible: still accepts plain EffectActionContext", () => {
    expect(matchesTrigger(["skill-test"], { type: "skill-test" })).toBe(true);
    expect(matchesTrigger(["withdrawal"], { type: "skill-test" })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// effectApplies with character state
// ---------------------------------------------------------------------------

describe("effectApplies with character state", () => {
  it("withdrawal effect applies when character state has withdrawalActive", () => {
    const effect = makeWithdrawalEffect();
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test", attribute: "body" },
      characterState: { withdrawalActive: true },
    };
    expect(effectApplies(effect, ctx)).toBe(true);
  });

  it("withdrawal effect does not apply without character state", () => {
    const effect = makeWithdrawalEffect();
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test", attribute: "body" },
    };
    expect(effectApplies(effect, ctx)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// resolveFromSources with character state
// ---------------------------------------------------------------------------

describe("resolveFromSources with character state", () => {
  it("resolves withdrawal dice pool penalty when withdrawalActive", () => {
    const sources: SourcedEffect[] = [
      { effect: makeWithdrawalEffect(-3), source: makeSource("addiction") },
    ];
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test", skill: "pistols" },
      characterState: { withdrawalActive: true },
    };
    const result = resolveFromSources(sources, ctx);
    expect(result.totalDicePoolModifier).toBe(-3);
    expect(result.dicePoolModifiers).toHaveLength(1);
  });

  it("does not resolve withdrawal penalty when state is inactive", () => {
    const sources: SourcedEffect[] = [
      { effect: makeWithdrawalEffect(-3), source: makeSource("addiction") },
    ];
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test", skill: "pistols" },
      characterState: { withdrawalActive: false },
    };
    const result = resolveFromSources(sources, ctx);
    expect(result.totalDicePoolModifier).toBe(0);
    expect(result.dicePoolModifiers).toHaveLength(0);
  });

  it("resolves exposure penalty when exposureActive", () => {
    const sources: SourcedEffect[] = [
      { effect: makeExposureEffect(-2), source: makeSource("allergy") },
    ];
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test" },
      characterState: { exposureActive: true },
    };
    const result = resolveFromSources(sources, ctx);
    expect(result.totalDicePoolModifier).toBe(-2);
  });

  it("resolves first-meeting bonus when firstMeeting active", () => {
    const sources: SourcedEffect[] = [
      { effect: makeFirstMeetingEffect(2), source: makeSource("first-impression") },
    ];
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test", skill: "etiquette" },
      characterState: { firstMeeting: true },
    };
    const result = resolveFromSources(sources, ctx);
    expect(result.totalDicePoolModifier).toBe(2);
  });

  it("does not resolve state-dependent effects for creation-mode character", () => {
    const sources: SourcedEffect[] = [
      { effect: makeWithdrawalEffect(-3), source: makeSource("addiction") },
      { effect: makeExposureEffect(-2), source: makeSource("allergy") },
    ];
    // No characterState = creation mode / no dynamic state
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test" },
    };
    const result = resolveFromSources(sources, ctx);
    expect(result.totalDicePoolModifier).toBe(0);
    expect(result.dicePoolModifiers).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// EffectContextBuilder with character state
// ---------------------------------------------------------------------------

describe("EffectContextBuilder.withCharacterState", () => {
  it("includes character state in built context", () => {
    const ctx = EffectContextBuilder.forSkillTest("pistols")
      .withCharacterState({ withdrawalActive: true })
      .build();
    expect(ctx.characterState).toEqual({ withdrawalActive: true });
  });

  it("merges multiple withCharacterState calls", () => {
    const ctx = EffectContextBuilder.forSkillTest("pistols")
      .withCharacterState({ withdrawalActive: true })
      .withCharacterState({ firstMeeting: true })
      .build();
    expect(ctx.characterState).toEqual({ withdrawalActive: true, firstMeeting: true });
  });

  it("omits characterState when not set", () => {
    const ctx = EffectContextBuilder.forSkillTest("pistols").build();
    expect(ctx.characterState).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// buildCharacterStateFlags integration
// ---------------------------------------------------------------------------

describe("buildCharacterStateFlags → resolveFromSources integration", () => {
  it("character with active withdrawal produces state flags that activate effects", () => {
    const character = createMockCharacter({
      negativeQualities: [
        {
          qualityId: "addiction",
          source: "creation" as const,
          dynamicState: {
            type: "addiction",
            state: {
              substance: "Novacoke",
              substanceType: "physiological",
              severity: "moderate",
              originalSeverity: "moderate",
              lastDose: new Date().toISOString(),
              nextCravingCheck: new Date().toISOString(),
              cravingActive: false,
              withdrawalActive: true,
              withdrawalPenalty: 2,
              daysClean: 0,
              recoveryAttempts: 0,
            },
          },
        },
      ],
    });

    const flags = buildCharacterStateFlags(character);
    expect(flags.withdrawalActive).toBe(true);

    const sources: SourcedEffect[] = [
      { effect: makeWithdrawalEffect(-2), source: makeSource("addiction") },
    ];
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test", skill: "pistols" },
      characterState: flags,
    };
    const result = resolveFromSources(sources, ctx);
    expect(result.totalDicePoolModifier).toBe(-2);
  });

  it("character without active states produces empty flags", () => {
    const character = createMockCharacter();
    const flags = buildCharacterStateFlags(character);
    expect(flags).toEqual({});

    const sources: SourcedEffect[] = [
      { effect: makeWithdrawalEffect(-2), source: makeSource("addiction") },
    ];
    const ctx: EffectResolutionContext = {
      action: { type: "skill-test" },
      characterState: flags,
    };
    const result = resolveFromSources(sources, ctx);
    expect(result.totalDicePoolModifier).toBe(0);
  });
});
