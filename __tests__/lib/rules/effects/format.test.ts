import { describe, it, expect } from "vitest";
import {
  formatEffectBadge,
  isUnifiedEffect,
  resolveRatingBasedValue,
} from "@/lib/rules/effects/format";
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

  // --- Trigger suffix ---

  it("omits trigger for always-trigger effects", () => {
    const badge = formatEffectBadge(makeEffect({ triggers: ["always"] }));

    expect(badge).not.toBeNull();
    expect(badge!.trigger).toBeUndefined();
  });

  it("includes trigger suffix for withdrawal-triggered effects", () => {
    const badge = formatEffectBadge(makeEffect({ triggers: ["withdrawal"], value: -4 }));

    expect(badge).not.toBeNull();
    expect(badge!.trigger).toBe("withdrawal");
  });

  it("formats kebab-case triggers as readable text", () => {
    const badge = formatEffectBadge(makeEffect({ triggers: ["first-meeting"], value: 1 }));

    expect(badge).not.toBeNull();
    expect(badge!.trigger).toBe("first meeting");
  });

  // --- Context: resolvedValue override ---

  it("uses resolvedValue from context instead of effect value", () => {
    const effect = makeEffect({
      value: "rating-based" as unknown as number,
      triggers: ["withdrawal"],
      target: { attributeCategory: "physical" } as Effect["target"],
    });

    const badge = formatEffectBadge(effect, { resolvedValue: -4 });

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("-4 Physical Tests");
    expect(badge!.trigger).toBe("withdrawal");
  });

  it("returns null for rating-based value without resolvedValue", () => {
    const effect = makeEffect({
      value: "rating-based" as unknown as number,
    });

    const badge = formatEffectBadge(effect);

    expect(badge).toBeNull();
  });

  // --- Context: condition filtering ---

  it("hides badge when rating is below minRating", () => {
    const effect = makeEffect({
      value: -2,
      condition: { minRating: 3 } as Effect["condition"],
    });

    const badge = formatEffectBadge(effect, { rating: 2 });

    expect(badge).toBeNull();
  });

  it("shows badge when rating meets minRating", () => {
    const effect = makeEffect({
      value: -2,
      condition: { minRating: 3 } as Effect["condition"],
    });

    const badge = formatEffectBadge(effect, { rating: 3 });

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("-2 Dice Pool");
  });

  it("hides badge when dependencyType does not match", () => {
    const effect = makeEffect({
      value: -4,
      condition: { dependencyType: "psychological" } as Effect["condition"],
    });

    const badge = formatEffectBadge(effect, { dependencyType: "physiological" });

    expect(badge).toBeNull();
  });

  it("shows badge when dependencyType matches", () => {
    const effect = makeEffect({
      value: -4,
      condition: { dependencyType: "physiological" } as Effect["condition"],
    });

    const badge = formatEffectBadge(effect, { dependencyType: "physiological" });

    expect(badge).not.toBeNull();
  });

  // --- Category-level targets ---

  it("formats attributeCategory target", () => {
    const effect = makeEffect({
      target: { attributeCategory: "mental" } as unknown as Effect["target"],
      value: -4,
    });

    const badge = formatEffectBadge(effect);

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("-4 Mental Tests");
  });

  it("formats skillCategory target", () => {
    const effect = makeEffect({
      target: { skillCategory: "social" } as unknown as Effect["target"],
      value: -2,
    });

    const badge = formatEffectBadge(effect);

    expect(badge).not.toBeNull();
    expect(badge!.label).toBe("-2 Social Tests");
  });
});

describe("resolveRatingBasedValue", () => {
  it("resolves withdrawalPenalty for withdrawal-triggered effect", () => {
    const effect = makeEffect({
      triggers: ["withdrawal"],
      target: { attributeCategory: "physical" } as unknown as Effect["target"],
      value: "rating-based" as unknown as number,
    });

    const result = resolveRatingBasedValue(effect, {
      withdrawalPenalty: -4,
      socialPenalty: 0,
    });

    expect(result).toBe(-4);
  });

  it("resolves socialPenalty for social skillCategory target", () => {
    const effect = makeEffect({
      triggers: ["always"],
      target: { skillCategory: "social" } as unknown as Effect["target"],
      value: "rating-based" as unknown as number,
    });

    const result = resolveRatingBasedValue(effect, {
      withdrawalPenalty: -4,
      socialPenalty: -2,
    });

    expect(result).toBe(-2);
  });

  it("returns null when ratingEntry is undefined", () => {
    const effect = makeEffect({ triggers: ["withdrawal"] });

    expect(resolveRatingBasedValue(effect, undefined)).toBeNull();
  });

  it("returns null when no matching field in ratingEntry", () => {
    const effect = makeEffect({
      triggers: ["always"],
      target: { skill: "sneaking" },
    });

    const result = resolveRatingBasedValue(effect, { cost: 100 });

    expect(result).toBeNull();
  });

  it("skips zero socialPenalty (returns 0, not null)", () => {
    const effect = makeEffect({
      triggers: ["always"],
      target: { skillCategory: "social" } as unknown as Effect["target"],
      value: "rating-based" as unknown as number,
    });

    const result = resolveRatingBasedValue(effect, { socialPenalty: 0 });

    expect(result).toBe(0);
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
