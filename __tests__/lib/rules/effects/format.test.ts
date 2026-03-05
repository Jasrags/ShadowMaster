import { describe, it, expect } from "vitest";
import { formatEffectBadge, isUnifiedEffect } from "@/lib/rules/effects/format";
import type { Effect } from "@/lib/types/effects";

function makeEffect(overrides: Partial<Effect> = {}): Effect {
  return {
    id: "test-effect",
    type: "dice-pool-modifier",
    triggers: ["always"],
    target: {},
    value: 2,
    ...overrides,
  };
}

describe("formatEffectBadge", () => {
  it("formats dice-pool-modifier with positive value", () => {
    const badge = formatEffectBadge(makeEffect({ value: 2 }));

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("+2 Dice Pool");
    expect(badge!.colorClass).toContain("emerald");
  });

  it("formats negative value with minus sign", () => {
    const badge = formatEffectBadge(makeEffect({ value: -1 }));

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("-1 Dice Pool");
  });

  it("formats limit-modifier with target in label", () => {
    const badge = formatEffectBadge(
      makeEffect({
        type: "limit-modifier",
        target: { limit: "physical" },
        value: 1,
      })
    );

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("+1 Physical Limit");
    expect(badge!.colorClass).toContain("blue");
  });

  it("formats attribute-modifier with target in label", () => {
    const badge = formatEffectBadge(
      makeEffect({
        type: "attribute-modifier",
        target: { attribute: "agility" },
        value: 1,
      })
    );

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("+1 Agility");
    expect(badge!.colorClass).toContain("purple");
  });

  it("formats initiative-modifier", () => {
    const badge = formatEffectBadge(makeEffect({ type: "initiative-modifier", value: 3 }));

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("+3 Initiative");
    expect(badge!.colorClass).toContain("cyan");
  });

  it("formats armor-modifier", () => {
    const badge = formatEffectBadge(makeEffect({ type: "armor-modifier", value: 2 }));

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("+2 Armor");
    expect(badge!.colorClass).toContain("amber");
  });

  it("uses target name in label for skill target", () => {
    const badge = formatEffectBadge(makeEffect({ target: { skill: "sneaking" } }));

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("+2 Sneaking");
  });

  it("uses target name in label for skillGroup target", () => {
    const badge = formatEffectBadge(makeEffect({ target: { skillGroup: "stealth" } }));

    expect(badge!.label).toBe("+2 Stealth Group");
  });

  it("falls back to type name when no target", () => {
    const badge = formatEffectBadge(makeEffect({ target: {} }));

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("+2 Dice Pool");
  });

  it("handles perRating value format", () => {
    const badge = formatEffectBadge(makeEffect({ value: { perRating: 1 } }));

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("+1 Dice Pool");
  });

  it("returns null for special effect type", () => {
    const badge = formatEffectBadge(makeEffect({ type: "special" as Effect["type"] }));

    expect(badge).toBeNull();
  });

  it("returns null for unknown effect types", () => {
    const badge = formatEffectBadge(makeEffect({ type: "unknown-type" as Effect["type"] }));

    expect(badge).toBeNull();
  });
});

describe("isUnifiedEffect", () => {
  it("returns true for unified effect with triggers array", () => {
    expect(
      isUnifiedEffect({
        id: "test",
        type: "dice-pool-modifier",
        triggers: ["always"],
        target: {},
        value: 1,
      })
    ).toBe(true);
  });

  it("returns false for legacy effect with singular trigger", () => {
    expect(
      isUnifiedEffect({
        id: "test",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: 1,
      })
    ).toBe(false);
  });

  it("returns false for null", () => {
    expect(isUnifiedEffect(null)).toBe(false);
  });

  it("returns false for non-object", () => {
    expect(isUnifiedEffect("string")).toBe(false);
  });
});
