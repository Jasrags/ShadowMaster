/**
 * Concealment System Tests
 *
 * @see lib/rules/inventory/concealment.ts
 */

import { describe, it, expect } from "vitest";
import type { Character, GearItem, Weapon } from "@/lib/types";
import {
  getConcealmentModifier,
  calculateConcealmentCheck,
  getConcealedItems,
  CONCEALMENT_BY_READINESS,
} from "../concealment";

// =============================================================================
// TEST HELPERS
// =============================================================================

function createCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "test-char",
    ownerId: "test-user",
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    rulesetSnapshotId: "snapshot-1",
    name: "Test Character",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attributes: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 3,
      intuition: 3,
      charisma: 3,
      edge: 2,
    },
    gear: [],
    weapons: [],
    armor: [],
    ...overrides,
  } as Character;
}

// =============================================================================
// TESTS
// =============================================================================

describe("Concealment System", () => {
  describe("getConcealmentModifier", () => {
    it("should return correct modifier for each readiness state", () => {
      expect(getConcealmentModifier("stashed")).toBe(0);
      expect(getConcealmentModifier("carried")).toBe(-4);
      expect(getConcealmentModifier("stored")).toBe(-4); // same as carried
      expect(getConcealmentModifier("pocketed")).toBe(-2);
      expect(getConcealmentModifier("holstered")).toBe(0);
      expect(getConcealmentModifier("worn")).toBe(2);
      expect(getConcealmentModifier("readied")).toBe(4);
    });
  });

  describe("calculateConcealmentCheck", () => {
    it("should combine base modifier with location modifier", () => {
      const item = {
        concealability: -2,
        state: { readiness: "holstered" as const, wirelessEnabled: true },
      };

      const check = calculateConcealmentCheck(item);
      expect(check.baseModifier).toBe(-2);
      expect(check.locationModifier).toBe(0); // holstered = 0
      expect(check.totalModifier).toBe(-2);
    });

    it("should handle items with no concealability", () => {
      const item = {
        state: { readiness: "readied" as const, wirelessEnabled: true },
      };

      const check = calculateConcealmentCheck(item);
      expect(check.baseModifier).toBe(0);
      expect(check.locationModifier).toBe(4); // readied = +4
      expect(check.totalModifier).toBe(4);
    });

    it("should use carried as default for items without state", () => {
      const item = {};
      const check = calculateConcealmentCheck(item);
      expect(check.locationModifier).toBe(-4); // carried default
    });

    it("should stack concealability with pocketed bonus", () => {
      const item = {
        concealability: -4,
        state: { readiness: "pocketed" as const, wirelessEnabled: false },
      };

      const check = calculateConcealmentCheck(item);
      expect(check.totalModifier).toBe(-6); // -4 base + -2 pocketed
    });
  });

  describe("getConcealedItems", () => {
    it("should return all non-stashed items with checks", () => {
      const character = createCharacter({
        weapons: [
          {
            id: "wpn-1",
            name: "Holdout Pistol",
            category: "ranged",
            subcategory: "holdout",
            damage: "6P",
            ap: 0,
            mode: ["SA"],
            quantity: 1,
            cost: 200,
            concealability: -4,
            state: { readiness: "pocketed", wirelessEnabled: false },
          } as Weapon,
          {
            id: "wpn-2",
            name: "Assault Rifle",
            category: "ranged",
            subcategory: "assault-rifle",
            damage: "11P",
            ap: -2,
            mode: ["SA", "BF", "FA"],
            quantity: 1,
            cost: 2500,
            concealability: 6,
            state: { readiness: "readied", wirelessEnabled: true },
          } as Weapon,
        ],
      });

      const items = getConcealedItems(character);
      expect(items).toHaveLength(2);

      const pistol = items.find((i) => i.item.id === "wpn-1");
      expect(pistol?.check.totalModifier).toBe(-6); // -4 base + -2 pocketed

      const rifle = items.find((i) => i.item.id === "wpn-2");
      expect(rifle?.check.totalModifier).toBe(10); // 6 base + 4 readied
    });

    it("should exclude stashed items", () => {
      const character = createCharacter({
        weapons: [
          {
            id: "wpn-stashed",
            name: "Stashed Gun",
            category: "ranged",
            subcategory: "heavy-pistol",
            damage: "8P",
            ap: -1,
            mode: ["SA"],
            quantity: 1,
            cost: 800,
            state: { readiness: "stashed", wirelessEnabled: false },
          } as Weapon,
        ],
      });

      expect(getConcealedItems(character)).toHaveLength(0);
    });

    it("should return empty for character with no gear", () => {
      const character = createCharacter();
      expect(getConcealedItems(character)).toHaveLength(0);
    });
  });

  describe("Constants", () => {
    it("should have negative modifiers for hidden states", () => {
      expect(CONCEALMENT_BY_READINESS.carried).toBeLessThan(0);
      expect(CONCEALMENT_BY_READINESS.pocketed).toBeLessThan(0);
    });

    it("should have positive modifiers for visible states", () => {
      expect(CONCEALMENT_BY_READINESS.worn).toBeGreaterThan(0);
      expect(CONCEALMENT_BY_READINESS.readied).toBeGreaterThan(0);
    });
  });
});
