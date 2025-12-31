/**
 * Encumbrance Calculator Tests
 *
 * @see lib/rules/encumbrance/calculator.ts
 */

import { describe, it, expect } from "vitest";
import type { Character, Weapon, ArmorItem, GearItem } from "@/lib/types";
import {
  calculateEncumbrance,
  calculateMaxCapacity,
  calculateEncumbrancePenalty,
  isItemCarried,
  getEncumbranceStatus,
  STRENGTH_CAPACITY_MULTIPLIER,
  MAX_ENCUMBRANCE_PENALTY,
} from "../calculator";

// =============================================================================
// TEST HELPERS
// =============================================================================

// Note: Using type assertions for simplified test objects.
// Tests focus on encumbrance logic, not full type compliance.

function createTestCharacter(overrides: Partial<Character> = {}): Character {
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
      strength: 4, // Default strength = 40 kg capacity
      willpower: 3,
      logic: 3,
      intuition: 3,
      charisma: 3,
      edge: 2,
    },
    weapons: [],
    armor: [],
    gear: [],
    ...overrides,
  } as Character;
}

function createWeapon(weight: number, stored = false): Weapon {
  return {
    id: `weapon-${Date.now()}-${Math.random()}`,
    name: "Test Weapon",
    damage: "8P",
    ap: -2,
    mode: ["SA"],
    subcategory: "heavy-pistol",
    category: "ranged",
    quantity: 1,
    cost: 1000,
    weight,
    state: {
      readiness: stored ? "stored" : "holstered",
      wirelessEnabled: true,
    },
  } as Weapon;
}

function createArmor(weight: number, stored = false): ArmorItem {
  return {
    id: `armor-${Date.now()}-${Math.random()}`,
    name: "Test Armor",
    armorRating: 12,
    equipped: !stored,
    category: "armor",
    quantity: 1,
    cost: 500,
    weight,
    state: {
      readiness: stored ? "stored" : "worn",
      wirelessEnabled: true,
    },
  } as ArmorItem;
}

function createGear(weight: number, stored = false): GearItem {
  return {
    id: `gear-${Date.now()}-${Math.random()}`,
    name: "Test Gear",
    category: "gear",
    quantity: 1,
    cost: 100,
    weight,
  } as GearItem;
}

// =============================================================================
// TESTS
// =============================================================================

describe("Encumbrance Calculator", () => {
  describe("calculateMaxCapacity", () => {
    it("should calculate capacity as Strength × 10", () => {
      const character = createTestCharacter({ attributes: { ...createTestCharacter().attributes!, strength: 4 } });
      expect(calculateMaxCapacity(character)).toBe(40);
    });

    it("should handle high strength", () => {
      const character = createTestCharacter({ attributes: { ...createTestCharacter().attributes!, strength: 10 } });
      expect(calculateMaxCapacity(character)).toBe(100);
    });

    it("should handle minimum strength", () => {
      const character = createTestCharacter({ attributes: { ...createTestCharacter().attributes!, strength: 1 } });
      expect(calculateMaxCapacity(character)).toBe(10);
    });

    it("should default to 0 if no attributes", () => {
      const character = createTestCharacter({ attributes: undefined });
      expect(calculateMaxCapacity(character)).toBe(0);
    });
  });

  describe("isItemCarried", () => {
    it("should return true for holstered weapons", () => {
      const weapon = createWeapon(2);
      weapon.state = { readiness: "holstered", wirelessEnabled: true };
      expect(isItemCarried(weapon)).toBe(true);
    });

    it("should return true for readied weapons", () => {
      const weapon = createWeapon(2);
      weapon.state = { readiness: "readied", wirelessEnabled: true };
      expect(isItemCarried(weapon)).toBe(true);
    });

    it("should return false for stored items", () => {
      const weapon = createWeapon(2, true);
      expect(isItemCarried(weapon)).toBe(false);
    });

    it("should return true for worn armor", () => {
      const armor = createArmor(8);
      armor.state = { readiness: "worn", wirelessEnabled: true };
      expect(isItemCarried(armor)).toBe(true);
    });

    it("should return true for legacy items without state", () => {
      const weapon = {
        id: "legacy",
        name: "Legacy Weapon",
        damage: "6P",
        ap: 0,
        mode: ["SA"],
        subcategory: "light-pistol",
        category: "ranged",
        quantity: 1,
        cost: 500,
        weight: 1,
        // No state property - legacy item
      } as Weapon;
      expect(isItemCarried(weapon)).toBe(true);
    });
  });

  describe("calculateEncumbrancePenalty", () => {
    it("should return 0 when under capacity", () => {
      expect(calculateEncumbrancePenalty(20, 40)).toBe(0);
    });

    it("should return 0 when at capacity", () => {
      expect(calculateEncumbrancePenalty(40, 40)).toBe(0);
    });

    it("should return -1 per kg over capacity", () => {
      expect(calculateEncumbrancePenalty(41, 40)).toBe(-1);
      expect(calculateEncumbrancePenalty(42, 40)).toBe(-2);
      expect(calculateEncumbrancePenalty(45, 40)).toBe(-5);
    });

    it("should floor partial kg overages", () => {
      // 40.5 - 40 = 0.5, floor(0.5) = 0, so penalty is 0
      // Note: Math.floor can produce -0 which is equal to 0 in loose comparison
      expect(calculateEncumbrancePenalty(40.5, 40) >= 0).toBe(true);
      expect(calculateEncumbrancePenalty(41.9, 40)).toBe(-1);
    });

    it("should cap penalty at maximum", () => {
      expect(calculateEncumbrancePenalty(100, 40)).toBe(MAX_ENCUMBRANCE_PENALTY);
    });
  });

  describe("calculateEncumbrance", () => {
    it("should calculate total weight from all carried items", () => {
      const character = createTestCharacter({
        weapons: [createWeapon(3)],
        armor: [createArmor(8)],
        gear: [createGear(2)],
      });

      const result = calculateEncumbrance(character);
      expect(result.currentWeight).toBe(13);
      expect(result.maxCapacity).toBe(40);
      expect(result.isEncumbered).toBe(false);
      expect(result.overweightPenalty).toBe(0);
    });

    it("should exclude stored items from weight", () => {
      const character = createTestCharacter({
        weapons: [createWeapon(10), createWeapon(15, true)], // Only 10kg counted
        armor: [createArmor(5, true)], // Not counted
        gear: [createGear(3)],
      });

      const result = calculateEncumbrance(character);
      expect(result.currentWeight).toBe(13); // 10 + 3
    });

    it("should detect encumbrance when over capacity", () => {
      const character = createTestCharacter({
        weapons: [createWeapon(25)],
        armor: [createArmor(20)],
      });

      const result = calculateEncumbrance(character);
      expect(result.currentWeight).toBe(45);
      expect(result.maxCapacity).toBe(40);
      expect(result.isEncumbered).toBe(true);
      expect(result.overweightPenalty).toBe(-5);
    });

    it("should handle empty inventory", () => {
      const character = createTestCharacter();
      const result = calculateEncumbrance(character);

      expect(result.currentWeight).toBe(0);
      expect(result.isEncumbered).toBe(false);
      expect(result.overweightPenalty).toBe(0);
    });

    it("should round weight to 2 decimal places", () => {
      const character = createTestCharacter({
        gear: [
          { id: "g1", name: "Gear 1", category: "gear", quantity: 1, cost: 10, weight: 0.333 } as GearItem,
          { id: "g2", name: "Gear 2", category: "gear", quantity: 1, cost: 10, weight: 0.333 } as GearItem,
          { id: "g3", name: "Gear 3", category: "gear", quantity: 1, cost: 10, weight: 0.333 } as GearItem,
        ],
      });

      const result = calculateEncumbrance(character);
      // 0.333 * 3 = 0.999, should round to 1.00
      expect(result.currentWeight).toBe(1);
    });
  });

  describe("getEncumbranceStatus", () => {
    it("should return 'light' for low encumbrance (<=50%)", () => {
      const encumbrance = {
        currentWeight: 10,
        maxCapacity: 40,
        overweightPenalty: 0,
        isEncumbered: false,
      };

      const result = getEncumbranceStatus(encumbrance);
      expect(result.status).toBe("light");
      expect(result.color).toBe("green");
    });

    it("should return 'normal' for moderate encumbrance (50-75%)", () => {
      const encumbrance = {
        currentWeight: 25,
        maxCapacity: 40,
        overweightPenalty: 0,
        isEncumbered: false,
      };

      const result = getEncumbranceStatus(encumbrance);
      expect(result.status).toBe("normal");
      expect(result.color).toBe("blue");
    });

    it("should return 'heavy' for near-max encumbrance (75-100%)", () => {
      const encumbrance = {
        currentWeight: 38,
        maxCapacity: 40,
        overweightPenalty: 0,
        isEncumbered: false,
      };

      const result = getEncumbranceStatus(encumbrance);
      expect(result.status).toBe("heavy");
      expect(result.color).toBe("yellow");
    });

    it("should return 'overloaded' when encumbered (>100%)", () => {
      const encumbrance = {
        currentWeight: 45,
        maxCapacity: 40,
        overweightPenalty: -5,
        isEncumbered: true,
      };

      const result = getEncumbranceStatus(encumbrance);
      expect(result.status).toBe("overloaded");
      expect(result.color).toBe("red");
      expect(result.description).toContain("-5");
    });
  });

  describe("constants", () => {
    it("should have correct capacity multiplier", () => {
      expect(STRENGTH_CAPACITY_MULTIPLIER).toBe(10);
    });

    it("should have correct max penalty", () => {
      expect(MAX_ENCUMBRANCE_PENALTY).toBe(-10);
    });
  });
});
