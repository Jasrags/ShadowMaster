/**
 * Tests for equipment readiness gating in effect gathering.
 *
 * Verifies that gatherEffectSources() only collects effects from items
 * whose readiness state indicates they are actively in use.
 *
 * @see Issue #487
 */

import { describe, it, expect } from "vitest";
import type { Character, GearItem, Weapon, ArmorItem } from "@/lib/types";
import type { MergedRuleset } from "@/lib/types/edition";
import type { GearState, EquipmentReadiness } from "@/lib/types/gear-state";
import type { Effect } from "@/lib/types/effects";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import { gatherEffectSources } from "@/lib/rules/effects";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TEST_EFFECT: Effect = {
  id: "test-effect",
  type: "dice-pool-modifier",
  triggers: ["always"],
  target: {},
  value: 1,
};

function makeRuleset(modules: Record<string, unknown> = {}): MergedRuleset {
  return {
    snapshotId: "test-snapshot",
    editionId: "test-edition",
    editionCode: "sr5",
    bookIds: ["sr5-core"],
    modules: modules as MergedRuleset["modules"],
    createdAt: new Date().toISOString(),
  };
}

function makeGearModule(itemId: string) {
  return {
    gear: {
      items: [{ id: itemId, name: "Test Item", effects: [TEST_EFFECT] }],
    },
  };
}

function makeModificationsModule(modId: string) {
  return {
    modifications: {
      items: [{ id: modId, name: "Test Mod", effects: [TEST_EFFECT] }],
    },
  };
}

function makeState(readiness: EquipmentReadiness): GearState {
  return { readiness, wirelessEnabled: true };
}

function makeGearItem(overrides: Partial<GearItem> = {}): GearItem {
  return {
    id: "test-gear",
    name: "Test Gear",
    category: "gear",
    quantity: 1,
    cost: 100,
    ...overrides,
  } as GearItem;
}

function makeWeapon(overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: "test-weapon",
    catalogId: "test-weapon-catalog",
    name: "Test Weapon",
    type: "ranged",
    subcategory: "pistols",
    damage: "5P",
    ap: -1,
    accuracy: 5,
    ...overrides,
  } as Weapon;
}

function makeArmor(overrides: Partial<ArmorItem> = {}): ArmorItem {
  return {
    id: "test-armor",
    catalogId: "test-armor-catalog",
    name: "Test Armor",
    armorRating: 12,
    ...overrides,
  } as ArmorItem;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Equipment readiness gating", () => {
  describe("weapon readiness", () => {
    const ruleset = makeRuleset(makeGearModule("test-weapon-catalog"));

    it("should gather effects from readied weapons", () => {
      const char = createMockCharacter({
        weapons: [makeWeapon({ state: makeState("readied") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-weapon-catalog")).toBe(true);
    });

    it("should gather effects from holstered weapons", () => {
      const char = createMockCharacter({
        weapons: [makeWeapon({ state: makeState("holstered") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-weapon-catalog")).toBe(true);
    });

    it("should NOT gather effects from stashed weapons", () => {
      const char = createMockCharacter({
        weapons: [makeWeapon({ state: makeState("stashed") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-weapon-catalog")).toBe(false);
    });

    it("should NOT gather effects from carried weapons", () => {
      const char = createMockCharacter({
        weapons: [makeWeapon({ state: makeState("carried") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-weapon-catalog")).toBe(false);
    });

    it("should NOT gather effects from stored weapons", () => {
      const char = createMockCharacter({
        weapons: [makeWeapon({ state: makeState("stored") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-weapon-catalog")).toBe(false);
    });
  });

  describe("armor readiness", () => {
    const ruleset = makeRuleset(makeGearModule("test-armor-catalog"));

    it("should gather effects from worn armor", () => {
      const char = createMockCharacter({
        armor: [makeArmor({ state: makeState("worn") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-armor-catalog")).toBe(true);
    });

    it("should NOT gather effects from carried armor", () => {
      const char = createMockCharacter({
        armor: [makeArmor({ state: makeState("carried") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-armor-catalog")).toBe(false);
    });

    it("should NOT gather effects from stashed armor", () => {
      const char = createMockCharacter({
        armor: [makeArmor({ state: makeState("stashed") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-armor-catalog")).toBe(false);
    });
  });

  describe("gear readiness", () => {
    const ruleset = makeRuleset(makeGearModule("test-gear"));

    it.each(["worn", "holstered", "pocketed", "carried"] as EquipmentReadiness[])(
      "should gather effects from %s gear",
      (readiness) => {
        const char = createMockCharacter({
          gear: [makeGearItem({ state: makeState(readiness) })],
        });
        const effects = gatherEffectSources(char, ruleset);
        expect(effects.some((e) => e.source.id === "test-gear")).toBe(true);
      }
    );

    it("should NOT gather effects from stashed gear", () => {
      const char = createMockCharacter({
        gear: [makeGearItem({ state: makeState("stashed") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-gear")).toBe(false);
    });
  });

  describe("weapon mods inherit parent readiness", () => {
    const ruleset = makeRuleset(makeModificationsModule("test-mod"));

    it("should gather weapon mod effects when weapon is readied", () => {
      const char = createMockCharacter({
        weapons: [
          makeWeapon({
            state: makeState("readied"),
            modifications: [
              {
                catalogId: "test-mod",
                name: "Test Mod",
                cost: 0,
                availability: 0,
                capacityUsed: 0,
              },
            ],
          }),
        ],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-mod")).toBe(true);
    });

    it("should NOT gather weapon mod effects when weapon is stashed", () => {
      const char = createMockCharacter({
        weapons: [
          makeWeapon({
            state: makeState("stashed"),
            modifications: [
              {
                catalogId: "test-mod",
                name: "Test Mod",
                cost: 0,
                availability: 0,
                capacityUsed: 0,
              },
            ],
          }),
        ],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-mod")).toBe(false);
    });
  });

  describe("gear mods inherit parent readiness", () => {
    const ruleset = makeRuleset(makeGearModule("test-mod"));

    it("should gather gear mod effects when gear is carried", () => {
      const char = createMockCharacter({
        gear: [
          makeGearItem({
            state: makeState("carried"),
            modifications: [
              {
                catalogId: "test-mod",
                name: "Test Mod",
                rating: 1,
                capacityUsed: 0,
                cost: 0,
                availability: 0,
              },
            ],
          }),
        ],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-mod")).toBe(true);
    });

    it("should NOT gather gear mod effects when gear is stashed", () => {
      const char = createMockCharacter({
        gear: [
          makeGearItem({
            state: makeState("stashed"),
            modifications: [
              {
                catalogId: "test-mod",
                name: "Test Mod",
                rating: 1,
                capacityUsed: 0,
                cost: 0,
                availability: 0,
              },
            ],
          }),
        ],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-mod")).toBe(false);
    });
  });

  describe("backward compatibility (undefined readiness)", () => {
    it("should gather effects from weapons with no state", () => {
      const ruleset = makeRuleset(makeGearModule("test-weapon-catalog"));
      const char = createMockCharacter({
        weapons: [makeWeapon({ state: undefined })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-weapon-catalog")).toBe(true);
    });

    it("should gather effects from armor with no state", () => {
      const ruleset = makeRuleset(makeGearModule("test-armor-catalog"));
      const char = createMockCharacter({
        armor: [makeArmor({ state: undefined })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-armor-catalog")).toBe(true);
    });

    it("should gather effects from gear with no state", () => {
      const ruleset = makeRuleset(makeGearModule("test-gear"));
      const char = createMockCharacter({
        gear: [makeGearItem({ state: undefined })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-gear")).toBe(true);
    });
  });

  describe("active modifier expiry with injectable now", () => {
    const emptyRuleset = makeRuleset();

    const MODIFIER_EFFECT: Effect = {
      id: "mod-effect",
      type: "dice-pool-modifier",
      triggers: ["always"],
      target: {},
      value: 2,
    };

    it("should include non-expired active modifiers when now is before expiresAt", () => {
      const char = createMockCharacter({
        activeModifiers: [
          {
            id: "mod-1",
            name: "Combat Drug",
            source: "temporary",
            effect: MODIFIER_EFFECT,
            expiresAt: "2099-01-01T00:00:00.000Z",
            appliedAt: "2020-01-01T00:00:00.000Z",
          },
        ],
      });
      const effects = gatherEffectSources(char, emptyRuleset, {
        now: new Date("2025-06-01T00:00:00.000Z"),
      });
      expect(effects.some((e) => e.source.id === "mod-1")).toBe(true);
    });

    it("should exclude expired active modifiers when now is after expiresAt", () => {
      const char = createMockCharacter({
        activeModifiers: [
          {
            id: "mod-2",
            name: "Expired Drug",
            source: "temporary",
            effect: MODIFIER_EFFECT,
            expiresAt: "2020-01-01T00:00:00.000Z",
            appliedAt: "2019-01-01T00:00:00.000Z",
          },
        ],
      });
      const effects = gatherEffectSources(char, emptyRuleset, {
        now: new Date("2025-06-01T00:00:00.000Z"),
      });
      expect(effects.some((e) => e.source.id === "mod-2")).toBe(false);
    });

    it("should default now to current time when not provided", () => {
      const char = createMockCharacter({
        activeModifiers: [
          {
            id: "mod-3",
            name: "Far Future Drug",
            source: "temporary",
            effect: MODIFIER_EFFECT,
            expiresAt: "2099-12-31T23:59:59.999Z",
            appliedAt: "2020-01-01T00:00:00.000Z",
          },
        ],
      });
      // No now parameter — should use current time, and modifier expires far in future
      const effects = gatherEffectSources(char, emptyRuleset);
      expect(effects.some((e) => e.source.id === "mod-3")).toBe(true);
    });
  });

  describe("stored readiness normalization", () => {
    it("should NOT gather effects from stored weapons (weapon category)", () => {
      const ruleset = makeRuleset(makeGearModule("test-weapon-catalog"));
      const char = createMockCharacter({
        weapons: [makeWeapon({ state: makeState("stored") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      expect(effects.some((e) => e.source.id === "test-weapon-catalog")).toBe(false);
    });

    it("should gather effects from stored gear (normalized to carried)", () => {
      const ruleset = makeRuleset(makeGearModule("test-gear"));
      const char = createMockCharacter({
        gear: [makeGearItem({ state: makeState("stored") })],
      });
      const effects = gatherEffectSources(char, ruleset);
      // "stored" normalizes to "carried", which is in gear's active list
      expect(effects.some((e) => e.source.id === "test-gear")).toBe(true);
    });
  });
});
