/**
 * Tests for quality effect type handlers.
 *
 * Covers the handler registry, default handler registrations,
 * and processEffect behavior for each effect type.
 */

import { describe, it, expect } from "vitest";
import type { QualityEffect } from "@/lib/types";
import type { ResolvedEffect } from "@/lib/types/gameplay";
import {
  getEffectHandler,
  processEffect,
  registerEffectHandler,
} from "@/lib/rules/qualities/effects/handlers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeResolvedEffect(overrides: Partial<ResolvedEffect> = {}): ResolvedEffect {
  return {
    effect: {
      id: "test-effect",
      type: "dice-pool-modifier",
      trigger: "always",
      target: {},
      value: 1,
      description: "Test effect",
    } as QualityEffect,
    value: 1,
    target: {},
    quality: {} as ResolvedEffect["quality"],
    selection: {} as ResolvedEffect["selection"],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Default handler registration
// ---------------------------------------------------------------------------

describe("default handler registration", () => {
  const registeredTypes = [
    "dice-pool-modifier",
    "limit-modifier",
    "threshold-modifier",
    "wound-modifier",
    "attribute-modifier",
    "attribute-maximum",
    "resistance-modifier",
    "initiative-modifier",
    "healing-modifier",
    "karma-cost-modifier",
    "nuyen-cost-modifier",
    "time-modifier",
    "signature-modifier",
    "glitch-modifier",
    "special",
  ] as const;

  it.each(registeredTypes)("has a registered handler for %s", (type) => {
    expect(getEffectHandler(type)).toBeDefined();
  });

  it("returns undefined for unknown types before custom registration", () => {
    // Cast to bypass type checking for an unregistered type
    expect(getEffectHandler("nonexistent-type" as never)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// processEffect - simple modifiers
// ---------------------------------------------------------------------------

describe("processEffect - simple modifiers", () => {
  it("returns numeric value for dice-pool-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: 2,
      } as QualityEffect,
      value: 2,
    });
    expect(processEffect(resolved)).toBe(2);
  });

  it("returns numeric value for limit-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "limit-modifier",
        trigger: "always",
        target: {},
        value: 1,
      } as QualityEffect,
      value: 1,
    });
    expect(processEffect(resolved)).toBe(1);
  });

  it("returns numeric value for threshold-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "threshold-modifier",
        trigger: "always",
        target: {},
        value: -1,
      } as QualityEffect,
      value: -1,
    });
    expect(processEffect(resolved)).toBe(-1);
  });

  it("returns numeric value for attribute-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "attribute-modifier",
        trigger: "always",
        target: {},
        value: 1,
      } as QualityEffect,
      value: 1,
    });
    expect(processEffect(resolved)).toBe(1);
  });

  it("returns numeric value for attribute-maximum", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "attribute-maximum",
        trigger: "always",
        target: {},
        value: 1,
      } as QualityEffect,
      value: 1,
    });
    expect(processEffect(resolved)).toBe(1);
  });

  it("returns numeric value for resistance-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "resistance-modifier",
        trigger: "always",
        target: {},
        value: 2,
      } as QualityEffect,
      value: 2,
    });
    expect(processEffect(resolved)).toBe(2);
  });

  it("returns numeric value for healing-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "healing-modifier",
        trigger: "always",
        target: {},
        value: 1,
      } as QualityEffect,
      value: 1,
    });
    expect(processEffect(resolved)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// processEffect - wound-modifier
// ---------------------------------------------------------------------------

describe("processEffect - wound-modifier", () => {
  it('returns { type: "boxes-ignored", value } for wound-boxes-ignored target', () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "wound-modifier",
        trigger: "always",
        target: { stat: "wound-boxes-ignored" },
        value: 1,
      } as QualityEffect,
      value: 1,
      target: { stat: "wound-boxes-ignored" },
    });
    const result = processEffect(resolved);
    expect(result).toEqual({ type: "boxes-ignored", value: 1 });
  });

  it('returns { type: "penalty-interval", value } for wound-penalty-interval target', () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "wound-modifier",
        trigger: "always",
        target: { stat: "wound-penalty-interval" },
        value: 1,
      } as QualityEffect,
      value: 1,
      target: { stat: "wound-penalty-interval" },
    });
    const result = processEffect(resolved);
    expect(result).toEqual({ type: "penalty-interval", value: 1 });
  });

  it("returns numeric value for generic wound-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "wound-modifier",
        trigger: "always",
        target: {},
        value: -1,
      } as QualityEffect,
      value: -1,
      target: {},
    });
    expect(processEffect(resolved)).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// processEffect - initiative-modifier
// ---------------------------------------------------------------------------

describe("processEffect - initiative-modifier", () => {
  it('returns { type: "initiative-dice", value } for initiative target', () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "initiative-modifier",
        trigger: "always",
        target: { stat: "initiative" },
        value: 1,
      } as QualityEffect,
      value: 1,
      target: { stat: "initiative" },
    });
    const result = processEffect(resolved);
    expect(result).toEqual({ type: "initiative-dice", value: 1 });
  });

  it("returns numeric value for non-initiative target", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "initiative-modifier",
        trigger: "always",
        target: {},
        value: 2,
      } as QualityEffect,
      value: 2,
      target: {},
    });
    expect(processEffect(resolved)).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// processEffect - karma-cost-modifier
// ---------------------------------------------------------------------------

describe("processEffect - karma-cost-modifier", () => {
  it("returns { multiplier, target } for karma-cost-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "karma-cost-modifier",
        trigger: "always",
        target: {},
        value: 2,
      } as QualityEffect,
      value: 2,
      target: { testCategory: "magic" },
    });
    const result = processEffect(resolved) as Record<string, unknown>;
    expect(result.multiplier).toBe(2);
    expect(result.target).toBe("magic");
  });
});

// ---------------------------------------------------------------------------
// processEffect - nuyen-cost-modifier
// ---------------------------------------------------------------------------

describe("processEffect - nuyen-cost-modifier", () => {
  it("returns { modifier, target } for nuyen-cost-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "nuyen-cost-modifier",
        trigger: "always",
        target: {},
        value: -500,
      } as QualityEffect,
      value: -500,
      target: { stat: "cyberware" },
    });
    const result = processEffect(resolved) as Record<string, unknown>;
    expect(result.modifier).toBe(-500);
    expect(result.target).toBe("cyberware");
  });
});

// ---------------------------------------------------------------------------
// processEffect - time-modifier
// ---------------------------------------------------------------------------

describe("processEffect - time-modifier", () => {
  it("returns { multiplier } for time-modifier", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "time-modifier",
        trigger: "always",
        target: {},
        value: 0.5,
      } as QualityEffect,
      value: 0.5,
      target: {},
    });
    const result = processEffect(resolved) as Record<string, unknown>;
    expect(result.multiplier).toBe(0.5);
  });
});

// ---------------------------------------------------------------------------
// processEffect - default fallback
// ---------------------------------------------------------------------------

describe("processEffect - default fallback", () => {
  it("returns default value when no handler exists", () => {
    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "nonexistent-type" as never,
        trigger: "always",
        target: {},
        value: 42,
      } as QualityEffect,
      value: 42,
    });
    expect(processEffect(resolved)).toBe(42);
  });
});

// ---------------------------------------------------------------------------
// registerEffectHandler
// ---------------------------------------------------------------------------

describe("registerEffectHandler", () => {
  it("can register a custom handler", () => {
    registerEffectHandler("special", (_effect, resolvedEffect) => {
      return { custom: true, val: resolvedEffect.value * 10 };
    });

    const handler = getEffectHandler("special");
    expect(handler).toBeDefined();

    const resolved = makeResolvedEffect({
      effect: {
        id: "e1",
        type: "special",
        trigger: "always",
        target: {},
        value: 3,
      } as QualityEffect,
      value: 3,
    });
    const result = processEffect(resolved) as Record<string, unknown>;
    expect(result.custom).toBe(true);
    expect(result.val).toBe(30);
  });
});
