import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCreationEffects } from "@/components/creation/hooks/useCreationEffects";
import type { CreationSelections } from "@/lib/types/creation-selections";
import type { MergedRuleset } from "@/lib/types/edition";

// Mock the effects module
vi.mock("@/lib/rules/effects", () => ({
  buildCreationCharacter: vi.fn(() => ({
    positiveQualities: [],
    negativeQualities: [],
    cyberware: [],
    bioware: [],
    adeptPowers: [],
    gear: [],
    weapons: [],
    armor: [],
    wirelessBonusesEnabled: true,
  })),
  gatherEffectSources: vi.fn(() => []),
  resolveFromSources: vi.fn(() => ({
    dicePoolModifiers: [],
    limitModifiers: [],
    thresholdModifiers: [],
    accuracyModifiers: [],
    initiativeModifiers: [],
    totalDicePoolModifier: 0,
    totalLimitModifier: 0,
    totalThresholdModifier: 0,
    totalAccuracyModifier: 0,
    totalInitiativeModifier: 0,
    excludedByStacking: [],
  })),
  EffectContextBuilder: {
    forInitiative: vi.fn(() => ({
      build: vi.fn(() => ({ action: { type: "initiative" } })),
    })),
  },
}));

describe("useCreationEffects", () => {
  const emptySelections: CreationSelections = {};

  it("returns empty sources when ruleset is null", () => {
    const { result } = renderHook(() => useCreationEffects(emptySelections, null));

    expect(result.current.sources).toEqual([]);
    expect(result.current.passiveEffects).toBeNull();
    expect(typeof result.current.resolve).toBe("function");
  });

  it("returns a resolve callback that returns empty result with no sources", () => {
    const { result } = renderHook(() => useCreationEffects(emptySelections, null));

    const resolved = result.current.resolve({
      action: { type: "skill-test", skill: "firearms" },
    });

    expect(resolved.totalDicePoolModifier).toBe(0);
    expect(resolved.dicePoolModifiers).toEqual([]);
  });

  it("calls gatherEffectSources with ruleset", async () => {
    const { gatherEffectSources } = await import("@/lib/rules/effects");
    const mockRuleset = { modules: {} } as MergedRuleset;

    renderHook(() => useCreationEffects(emptySelections, mockRuleset));

    expect(gatherEffectSources).toHaveBeenCalled();
  });

  it("returns passiveEffects as null when sources are empty", () => {
    const mockRuleset = { modules: {} } as MergedRuleset;
    const { result } = renderHook(() => useCreationEffects(emptySelections, mockRuleset));

    // gatherEffectSources mock returns [], so passiveEffects should be null
    expect(result.current.passiveEffects).toBeNull();
  });
});
