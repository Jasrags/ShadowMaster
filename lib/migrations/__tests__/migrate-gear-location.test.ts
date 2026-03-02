/**
 * Gear Location Migration Tests
 *
 * @see lib/migrations/migrate-gear-location.ts
 */

import { describe, it, expect } from "vitest";
import type { Character, GearItem, Weapon, ArmorItem } from "@/lib/types";
import {
  needsLocationMigration,
  migrateGearLocation,
  migrateGearLocations,
} from "../migrate-gear-location";

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

describe("Gear Location Migration", () => {
  describe("needsLocationMigration", () => {
    it("should return true for items with stored readiness", () => {
      const character = createCharacter({
        gear: [
          {
            id: "g1",
            name: "Item",
            category: "gear",
            quantity: 1,
            cost: 10,
            state: { readiness: "stored", wirelessEnabled: false },
          } as GearItem,
        ],
      });
      expect(needsLocationMigration(character)).toBe(true);
    });

    it("should return true for weapons with stored readiness", () => {
      const character = createCharacter({
        weapons: [
          {
            id: "w1",
            name: "Pistol",
            category: "ranged",
            subcategory: "heavy-pistol",
            damage: "8P",
            ap: -1,
            mode: ["SA"],
            quantity: 1,
            cost: 800,
            state: { readiness: "stored", wirelessEnabled: true },
          } as Weapon,
        ],
      });
      expect(needsLocationMigration(character)).toBe(true);
    });

    it("should return true for old containedIn format", () => {
      const character = createCharacter({
        gear: [
          {
            id: "g1",
            name: "Item",
            category: "gear",
            quantity: 1,
            cost: 10,
            state: {
              readiness: "carried",
              wirelessEnabled: false,
              containedIn: { itemId: "bp-1", slotType: "main" } as unknown as {
                containerId: string;
              },
            },
          } as GearItem,
        ],
      });
      expect(needsLocationMigration(character)).toBe(true);
    });

    it("should return false for already-migrated characters", () => {
      const character = createCharacter({
        gear: [
          {
            id: "g1",
            name: "Item",
            category: "gear",
            quantity: 1,
            cost: 10,
            state: { readiness: "carried", wirelessEnabled: false },
          } as GearItem,
        ],
        weapons: [
          {
            id: "w1",
            name: "Pistol",
            category: "ranged",
            subcategory: "heavy-pistol",
            damage: "8P",
            ap: -1,
            mode: ["SA"],
            quantity: 1,
            cost: 800,
            state: { readiness: "holstered", wirelessEnabled: true },
          } as Weapon,
        ],
      });
      expect(needsLocationMigration(character)).toBe(false);
    });

    it("should return false for character with no gear", () => {
      const character = createCharacter();
      expect(needsLocationMigration(character)).toBe(false);
    });
  });

  describe("migrateGearLocation", () => {
    it("should convert stored to carried in gear", () => {
      const character = createCharacter({
        gear: [
          {
            id: "g1",
            name: "Medkit",
            category: "gear",
            quantity: 1,
            cost: 750,
            state: { readiness: "stored", wirelessEnabled: true },
          } as GearItem,
        ],
      });

      const { character: migrated, result } = migrateGearLocation(character);
      expect(result.success).toBe(true);
      expect(result.changes).toHaveLength(1);
      expect(result.changes[0].field).toBe("readiness");
      expect(result.changes[0].oldValue).toBe("stored");
      expect(result.changes[0].newValue).toBe("carried");
      expect(migrated.gear![0].state!.readiness).toBe("carried");
    });

    it("should convert stored to carried in weapons", () => {
      const character = createCharacter({
        weapons: [
          {
            id: "w1",
            name: "Pistol",
            category: "ranged",
            subcategory: "heavy-pistol",
            damage: "8P",
            ap: -1,
            mode: ["SA"],
            quantity: 1,
            cost: 800,
            state: { readiness: "stored", wirelessEnabled: true },
          } as Weapon,
        ],
      });

      const { character: migrated } = migrateGearLocation(character);
      expect(migrated.weapons![0].state!.readiness).toBe("carried");
    });

    it("should convert stored to carried in armor", () => {
      const character = createCharacter({
        armor: [
          {
            id: "a1",
            name: "Armor Jacket",
            armorRating: 12,
            category: "armor",
            equipped: false,
            quantity: 1,
            cost: 1000,
            state: { readiness: "stored", wirelessEnabled: true },
          } as ArmorItem,
        ],
      });

      const { character: migrated } = migrateGearLocation(character);
      expect(migrated.armor![0].state!.readiness).toBe("carried");
    });

    it("should normalize old containedIn format", () => {
      const character = createCharacter({
        gear: [
          {
            id: "g1",
            name: "Item",
            category: "gear",
            quantity: 1,
            cost: 10,
            state: {
              readiness: "carried",
              wirelessEnabled: false,
              containedIn: { itemId: "bp-1", slotType: "side-pocket" } as unknown as {
                containerId: string;
              },
            },
          } as GearItem,
        ],
      });

      const { character: migrated, result } = migrateGearLocation(character);
      expect(result.changes.length).toBeGreaterThan(0);

      const containedIn = migrated.gear![0].state!.containedIn;
      expect(containedIn?.containerId).toBe("bp-1");
      expect(containedIn?.slot).toBe("side-pocket");
    });

    it("should skip already-migrated items", () => {
      const character = createCharacter({
        gear: [
          {
            id: "g1",
            name: "Already Migrated",
            category: "gear",
            quantity: 1,
            cost: 10,
            state: { readiness: "carried", wirelessEnabled: false },
          } as GearItem,
        ],
      });

      const { result } = migrateGearLocation(character);
      expect(result.changes).toHaveLength(0);
    });

    it("should handle items without state", () => {
      const character = createCharacter({
        gear: [
          {
            id: "g1",
            name: "No State",
            category: "gear",
            quantity: 1,
            cost: 10,
          } as GearItem,
        ],
      });

      const { result } = migrateGearLocation(character);
      expect(result.success).toBe(true);
      expect(result.changes).toHaveLength(0);
    });

    it("should migrate multiple items across arrays", () => {
      const character = createCharacter({
        gear: [
          {
            id: "g1",
            name: "Gear",
            category: "gear",
            quantity: 1,
            cost: 10,
            state: { readiness: "stored", wirelessEnabled: false },
          } as GearItem,
        ],
        weapons: [
          {
            id: "w1",
            name: "Weapon",
            category: "ranged",
            subcategory: "pistol",
            damage: "6P",
            ap: 0,
            mode: ["SA"],
            quantity: 1,
            cost: 500,
            state: { readiness: "stored", wirelessEnabled: true },
          } as Weapon,
        ],
        armor: [
          {
            id: "a1",
            name: "Armor",
            armorRating: 6,
            category: "armor",
            equipped: false,
            quantity: 1,
            cost: 300,
            state: { readiness: "stored", wirelessEnabled: true },
          } as ArmorItem,
        ],
      });

      const { result } = migrateGearLocation(character);
      expect(result.changes).toHaveLength(3);
      expect(result.changes.map((c) => c.type)).toContain("gear");
      expect(result.changes.map((c) => c.type)).toContain("weapon");
      expect(result.changes.map((c) => c.type)).toContain("armor");
    });
  });

  describe("migrateGearLocations (batch)", () => {
    it("should migrate multiple characters", () => {
      const characters = [
        createCharacter({
          id: "char-1",
          name: "Needs Migration",
          gear: [
            {
              id: "g1",
              name: "Item",
              category: "gear",
              quantity: 1,
              cost: 10,
              state: { readiness: "stored", wirelessEnabled: false },
            } as GearItem,
          ],
        }),
        createCharacter({
          id: "char-2",
          name: "Already Done",
          gear: [
            {
              id: "g2",
              name: "Item",
              category: "gear",
              quantity: 1,
              cost: 10,
              state: { readiness: "carried", wirelessEnabled: false },
            } as GearItem,
          ],
        }),
      ];

      const result = migrateGearLocations(characters);
      expect(result.total).toBe(2);
      expect(result.migrated).toBe(1);
      expect(result.skipped).toBe(1);
      expect(result.failed).toBe(0);
    });

    it("should handle empty array", () => {
      const result = migrateGearLocations([]);
      expect(result.total).toBe(0);
      expect(result.migrated).toBe(0);
    });
  });
});
