import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAugmentedAttributes } from "@/components/creation/hooks/useAugmentedAttributes";
import type { CreationState } from "@/lib/types";

// Mock the rules module
vi.mock("@/lib/rules", () => ({
  useMetatypes: vi.fn(() => [
    {
      id: "human",
      name: "Human",
      attributes: {
        body: { min: 1, max: 6 },
        agility: { min: 1, max: 6 },
        reaction: { min: 1, max: 6 },
        strength: { min: 1, max: 6 },
        willpower: { min: 1, max: 6 },
        logic: { min: 1, max: 6 },
        intuition: { min: 1, max: 6 },
        charisma: { min: 1, max: 6 },
        edge: { min: 2, max: 7 },
      },
    },
  ]),
  useRuleset: vi.fn(() => ({ ruleset: null })),
  usePriorityTable: vi.fn(() => null),
  useMagicPaths: vi.fn(() => []),
}));

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

// Helper to create a minimal state
function makeState(
  overrides: Record<string, unknown> = {},
  priorities: Record<string, string> = {}
): CreationState {
  return {
    editionCode: "sr5",
    method: "priority",
    priorities,
    selections: {
      metatype: "human",
      ...overrides,
    },
  } as unknown as CreationState;
}

describe("useAugmentedAttributes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns base attribute values with no augmentations", () => {
    const state = makeState({
      attributes: {
        body: 3,
        agility: 5,
        reaction: 4,
        strength: 2,
        willpower: 3,
        logic: 4,
        intuition: 3,
        charisma: 2,
      },
    });

    const { result } = renderHook(() => useAugmentedAttributes(state));

    expect(result.current.attributes.body).toBe(3);
    expect(result.current.attributes.agility).toBe(5);
    expect(result.current.attributes.reaction).toBe(4);
    expect(result.current.attributes.strength).toBe(2);
    expect(result.current.attributes.willpower).toBe(3);
    expect(result.current.attributes.logic).toBe(4);
    expect(result.current.attributes.intuition).toBe(3);
    expect(result.current.attributes.charisma).toBe(2);
  });

  it("falls back to metatype minimums when no attributes set", () => {
    const state = makeState({ attributes: {} });

    const { result } = renderHook(() => useAugmentedAttributes(state));

    // Human metatype minimums are all 1
    expect(result.current.attributes.body).toBe(1);
    expect(result.current.attributes.agility).toBe(1);
    expect(result.current.attributes.reaction).toBe(1);
  });

  it("includes cyberware attribute bonuses", () => {
    const state = makeState({
      attributes: { agility: 4 },
      cyberware: [
        {
          id: "muscle-toner",
          name: "Muscle Toner",
          essenceCost: 0.5,
          attributeBonuses: { agility: 2 },
          catalogId: "muscle-toner",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.5,
          rating: 2,
          availability: 12,
        },
      ],
    });

    const { result } = renderHook(() => useAugmentedAttributes(state));

    expect(result.current.attributes.agility).toBe(6); // 4 + 2
    expect(result.current.augmentationEffects.essenceLoss).toBe(0.5);
    expect(result.current.augmentationEffects.remainingEssence).toBe(5.5);
  });

  it("includes bioware attribute bonuses", () => {
    const state = makeState({
      attributes: { agility: 3 },
      bioware: [
        {
          id: "muscle-augmentation",
          name: "Muscle Augmentation",
          essenceCost: 0.2,
          attributeBonuses: { agility: 1, strength: 1 },
          catalogId: "muscle-augmentation",
          category: "bioware",
          grade: "standard",
          baseEssenceCost: 0.2,
          rating: 1,
          availability: 8,
        },
      ],
    });

    const { result } = renderHook(() => useAugmentedAttributes(state));

    expect(result.current.attributes.agility).toBe(4); // 3 + 1
    // strength falls back to metatype min (1) + bonus (1) = 2
    expect(result.current.attributes.strength).toBe(2);
  });

  it("includes special attributes when allocated", () => {
    const state = makeState({
      specialAttributes: { edge: 3 },
    });

    const { result } = renderHook(() => useAugmentedAttributes(state));

    // edge: metatype base (2) + allocated (3) = 5
    expect(result.current.attributes.edge).toBe(5);
  });

  it("includes magic attribute from priority table", async () => {
    // Mock priority table with magic rating
    const { usePriorityTable } = await import("@/lib/rules");
    (usePriorityTable as ReturnType<typeof vi.fn>).mockReturnValue({
      table: {
        A: {
          magic: {
            options: [{ path: "magician", magicRating: 6 }],
          },
        },
      },
    });

    const state = makeState(
      {
        "magical-path": "magician",
        specialAttributes: { magic: 1 },
      },
      { magic: "A" }
    );

    const { result } = renderHook(() => useAugmentedAttributes(state));

    // magic: base (6) + allocated (1) = 7
    expect(result.current.attributes.magic).toBe(7);
  });

  it("tracks initiative dice bonuses from cyberware", () => {
    const state = makeState({
      cyberware: [
        {
          id: "wired-reflexes-1",
          name: "Wired Reflexes 1",
          essenceCost: 2.0,
          initiativeDiceBonus: 1,
          catalogId: "wired-reflexes-1",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 2.0,
          rating: 1,
          availability: 8,
        },
      ],
    });

    const { result } = renderHook(() => useAugmentedAttributes(state));

    expect(result.current.augmentationEffects.initiativeDiceBonus).toBe(1);
  });

  it("returns effect sources from creation effects", () => {
    const state = makeState();

    const { result } = renderHook(() => useAugmentedAttributes(state));

    expect(result.current.effectSources).toEqual([]);
    expect(result.current.passiveEffects).toBeNull();
  });

  it("does not include magic attribute when value is zero", () => {
    const state = makeState({
      specialAttributes: {},
    });

    const { result } = renderHook(() => useAugmentedAttributes(state));

    // magic should not be in the result since base + allocated = 0
    expect(result.current.attributes.magic).toBeUndefined();
  });
});
