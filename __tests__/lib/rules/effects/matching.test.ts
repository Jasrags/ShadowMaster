/**
 * Tests for trigger, target, and condition matching in the unified effect system.
 *
 * @see Issue #108
 */

import { describe, it, expect } from "vitest";
import type {
  Effect,
  EffectActionContext,
  EffectCondition,
  EffectResolutionContext,
  EffectTarget,
  EffectTrigger,
} from "@/lib/types/effects";
import {
  matchesTrigger,
  matchesTarget,
  matchesCondition,
  effectApplies,
} from "@/lib/rules/effects/matching";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeAction(overrides: Partial<EffectActionContext> = {}): EffectActionContext {
  return {
    type: "skill-test",
    ...overrides,
  };
}

function makeContext(overrides: Partial<EffectResolutionContext> = {}): EffectResolutionContext {
  return {
    action: makeAction(),
    ...overrides,
  };
}

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

// ---------------------------------------------------------------------------
// matchesTrigger
// ---------------------------------------------------------------------------

describe("matchesTrigger", () => {
  it('matches "always" for any action type', () => {
    expect(matchesTrigger(["always"], makeAction({ type: "skill-test" }))).toBe(true);
    expect(matchesTrigger(["always"], makeAction({ type: "attack" }))).toBe(true);
    expect(matchesTrigger(["always"], makeAction({ type: "defense" }))).toBe(true);
    expect(matchesTrigger(["always"], makeAction({ type: "initiative" }))).toBe(true);
  });

  it('matches "skill-test" for skill-test actions', () => {
    expect(matchesTrigger(["skill-test"], makeAction({ type: "skill-test" }))).toBe(true);
  });

  it('matches "ranged-attack" for attack with ranged attackType', () => {
    expect(
      matchesTrigger(["ranged-attack"], makeAction({ type: "attack", attackType: "ranged" }))
    ).toBe(true);
  });

  it('matches "melee-attack" for attack with melee attackType', () => {
    expect(
      matchesTrigger(["melee-attack"], makeAction({ type: "attack", attackType: "melee" }))
    ).toBe(true);
  });

  it('matches "combat-action" for attack and defense actions', () => {
    expect(matchesTrigger(["combat-action"], makeAction({ type: "attack" }))).toBe(true);
    expect(matchesTrigger(["combat-action"], makeAction({ type: "defense" }))).toBe(true);
  });

  it('matches "defense-test" for defense actions', () => {
    expect(matchesTrigger(["defense-test"], makeAction({ type: "defense" }))).toBe(true);
  });

  it('matches "perception-audio" for skill-test with perceptionType "audio"', () => {
    expect(
      matchesTrigger(
        ["perception-audio"],
        makeAction({ type: "skill-test", perceptionType: "audio" })
      )
    ).toBe(true);
  });

  it('matches "social-test" for negotiate/intimidate/con specificAction', () => {
    expect(
      matchesTrigger(
        ["social-test"],
        makeAction({ type: "skill-test", specificAction: "negotiate" })
      )
    ).toBe(true);
    expect(
      matchesTrigger(
        ["social-test"],
        makeAction({ type: "skill-test", specificAction: "intimidate" })
      )
    ).toBe(true);
    expect(
      matchesTrigger(["social-test"], makeAction({ type: "skill-test", specificAction: "con" }))
    ).toBe(true);
  });

  it('matches "matrix-action" for hack-on-the-fly/brute-force', () => {
    expect(
      matchesTrigger(
        ["matrix-action"],
        makeAction({ type: "skill-test", specificAction: "hack-on-the-fly" })
      )
    ).toBe(true);
    expect(
      matchesTrigger(
        ["matrix-action"],
        makeAction({ type: "skill-test", specificAction: "brute-force" })
      )
    ).toBe(true);
  });

  it("does not match unrelated triggers", () => {
    expect(matchesTrigger(["ranged-attack"], makeAction({ type: "skill-test" }))).toBe(false);
    expect(matchesTrigger(["defense-test"], makeAction({ type: "attack" }))).toBe(false);
    expect(matchesTrigger(["social-test"], makeAction({ type: "defense" }))).toBe(false);
  });

  it("matches state-derived triggers (withdrawal, on-exposure, first-meeting)", () => {
    const ctx = makeContext({ characterState: { withdrawalActive: true } });
    expect(matchesTrigger(["withdrawal"], ctx)).toBe(true);

    const ctx2 = makeContext({ characterState: { exposureActive: true } });
    expect(matchesTrigger(["on-exposure"], ctx2)).toBe(true);

    const ctx3 = makeContext({ characterState: { firstMeeting: true } });
    expect(matchesTrigger(["first-meeting"], ctx3)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// matchesTarget
// ---------------------------------------------------------------------------

describe("matchesTarget", () => {
  it("returns true when target is empty", () => {
    expect(matchesTarget({}, makeAction())).toBe(true);
  });

  it("returns true when target matches action skill", () => {
    const target: EffectTarget = { skill: "perception" };
    expect(matchesTarget(target, makeAction({ skill: "perception" }))).toBe(true);
  });

  it("returns false when skill does not match", () => {
    const target: EffectTarget = { skill: "perception" };
    expect(matchesTarget(target, makeAction({ skill: "sneaking" }))).toBe(false);
  });

  it("returns false when attribute does not match", () => {
    const target: EffectTarget = { attribute: "agility" };
    expect(matchesTarget(target, makeAction({ attribute: "body" }))).toBe(false);
  });

  it("returns true when attribute matches", () => {
    const target: EffectTarget = { attribute: "agility" };
    expect(matchesTarget(target, makeAction({ attribute: "agility" }))).toBe(true);
  });

  it("returns false when perceptionType does not match", () => {
    const target: EffectTarget = { perceptionType: "audio" };
    expect(
      matchesTarget(target, makeAction({ type: "skill-test", perceptionType: "visual" }))
    ).toBe(false);
  });

  it("returns true when perceptionType matches", () => {
    const target: EffectTarget = { perceptionType: "audio" };
    expect(matchesTarget(target, makeAction({ type: "skill-test", perceptionType: "audio" }))).toBe(
      true
    );
  });
});

// ---------------------------------------------------------------------------
// matchesCondition
// ---------------------------------------------------------------------------

describe("matchesCondition", () => {
  it("returns true when no condition is set", () => {
    expect(matchesCondition(undefined, makeContext())).toBe(true);
  });

  it("returns false when lighting does not match", () => {
    const condition: EffectCondition = { lightingCondition: "dark" };
    const ctx = makeContext({ environment: { lighting: "bright" } });
    expect(matchesCondition(condition, ctx)).toBe(false);
  });

  it("returns true when lighting matches", () => {
    const condition: EffectCondition = { lightingCondition: "dark" };
    const ctx = makeContext({ environment: { lighting: "dark" } });
    expect(matchesCondition(condition, ctx)).toBe(true);
  });

  it("returns false when lighting is required but environment is missing", () => {
    const condition: EffectCondition = { lightingCondition: "dim" };
    expect(matchesCondition(condition, makeContext())).toBe(false);
  });

  it("checks noise conditions", () => {
    const condition: EffectCondition = { noiseCondition: "loud" };
    expect(matchesCondition(condition, makeContext({ environment: { noise: "loud" } }))).toBe(true);
    expect(matchesCondition(condition, makeContext({ environment: { noise: "quiet" } }))).toBe(
      false
    );
  });

  it("checks environment conditions", () => {
    const condition: EffectCondition = { environment: ["urban"] };
    expect(matchesCondition(condition, makeContext({ environment: { terrain: "urban" } }))).toBe(
      true
    );
    expect(matchesCondition(condition, makeContext({ environment: { terrain: "forest" } }))).toBe(
      false
    );
  });
});

// ---------------------------------------------------------------------------
// effectApplies
// ---------------------------------------------------------------------------

describe("effectApplies", () => {
  it("returns true when all checks pass", () => {
    const effect = makeEffect({
      triggers: ["always"],
      target: {},
    });
    expect(effectApplies(effect, makeContext())).toBe(true);
  });

  it("returns false when trigger does not match", () => {
    const effect = makeEffect({
      triggers: ["ranged-attack"],
      target: {},
    });
    expect(effectApplies(effect, makeContext())).toBe(false);
  });

  it("returns false when target does not match", () => {
    const effect = makeEffect({
      triggers: ["always"],
      target: { skill: "perception" },
    });
    const ctx = makeContext({ action: makeAction({ skill: "sneaking" }) });
    expect(effectApplies(effect, ctx)).toBe(false);
  });

  it("returns false when condition does not match", () => {
    const effect = makeEffect({
      triggers: ["always"],
      target: {},
      condition: { lightingCondition: "dark" },
    });
    const ctx = makeContext({ environment: { lighting: "bright" } });
    expect(effectApplies(effect, ctx)).toBe(false);
  });
});
