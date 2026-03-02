/**
 * Loadout Manager Tests
 *
 * @see lib/rules/inventory/loadout-manager.ts
 */

import { describe, it, expect } from "vitest";
import type { Character, GearItem, Weapon, ArmorItem } from "@/lib/types";
import {
  createLoadout,
  saveCurrentAsLoadout,
  applyLoadout,
  getLoadoutDiff,
  updateLoadout,
  deleteLoadout,
} from "../loadout-manager";

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
      strength: 4,
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

function createGear(id: string, readiness = "carried"): GearItem {
  return {
    id,
    name: `Gear ${id}`,
    category: "gear",
    quantity: 1,
    cost: 100,
    weight: 2,
    state: {
      readiness: readiness as import("@/lib/types").EquipmentReadiness,
      wirelessEnabled: false,
    },
  } as GearItem;
}

function createWeapon(id: string, readiness = "holstered"): Weapon {
  return {
    id,
    name: `Weapon ${id}`,
    category: "ranged",
    subcategory: "heavy-pistol",
    damage: "8P",
    ap: -2,
    mode: ["SA"],
    quantity: 1,
    cost: 1000,
    weight: 1.5,
    state: {
      readiness: readiness as import("@/lib/types").EquipmentReadiness,
      wirelessEnabled: true,
    },
  } as Weapon;
}

function createArmorItem(id: string, readiness = "worn"): ArmorItem {
  return {
    id,
    name: `Armor ${id}`,
    armorRating: 12,
    category: "armor",
    equipped: readiness === "worn",
    quantity: 1,
    cost: 500,
    weight: 4,
    state: {
      readiness: readiness as import("@/lib/types").EquipmentReadiness,
      wirelessEnabled: true,
    },
  } as ArmorItem;
}

// =============================================================================
// TESTS
// =============================================================================

describe("Loadout Manager", () => {
  describe("createLoadout", () => {
    it("should create a new loadout and add to character", () => {
      const character = createCharacter();

      const { character: updated, loadout } = createLoadout(character, {
        name: "Combat",
        description: "Full combat loadout",
        gearAssignments: { "wpn-1": "readied", "armor-1": "worn" },
        defaultReadiness: "stashed",
      });

      expect(loadout.name).toBe("Combat");
      expect(loadout.description).toBe("Full combat loadout");
      expect(loadout.id).toBeTruthy();
      expect(loadout.createdAt).toBeTruthy();
      expect(updated.loadouts).toHaveLength(1);
      expect(updated.loadouts![0].id).toBe(loadout.id);
    });

    it("should append to existing loadouts", () => {
      const character = createCharacter({
        loadouts: [
          {
            id: "existing",
            name: "Existing",
            gearAssignments: {},
            defaultReadiness: "stashed",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
        ],
      });

      const { character: updated } = createLoadout(character, {
        name: "New",
        gearAssignments: {},
        defaultReadiness: "stashed",
      });

      expect(updated.loadouts).toHaveLength(2);
    });
  });

  describe("saveCurrentAsLoadout", () => {
    it("should capture current gear states as a loadout", () => {
      const character = createCharacter({
        weapons: [createWeapon("wpn-1", "readied"), createWeapon("wpn-2", "holstered")],
        armor: [createArmorItem("armor-1", "worn")],
        gear: [createGear("gear-1", "carried")],
      });

      const { loadout } = saveCurrentAsLoadout(character, "My Loadout", "Test");

      expect(loadout.name).toBe("My Loadout");
      expect(loadout.gearAssignments["wpn-1"]).toBe("readied");
      expect(loadout.gearAssignments["wpn-2"]).toBe("holstered");
      expect(loadout.gearAssignments["armor-1"]).toBe("worn");
      expect(loadout.gearAssignments["gear-1"]).toBe("carried");
    });
  });

  describe("updateLoadout", () => {
    it("should update loadout properties", () => {
      const char = createCharacter({
        loadouts: [
          {
            id: "existing-loadout",
            name: "Old Name",
            gearAssignments: {},
            defaultReadiness: "stashed",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
          },
        ],
      });

      const updated = updateLoadout(char, "existing-loadout", { name: "New Name" });

      expect(updated.loadouts![0].name).toBe("New Name");
      expect(updated.loadouts![0].updatedAt).not.toBe("2024-01-01T00:00:00.000Z");
    });

    it("should return unchanged character for nonexistent loadout", () => {
      const character = createCharacter();
      const result = updateLoadout(character, "nonexistent", { name: "X" });
      expect(result).toBe(character);
    });
  });

  describe("deleteLoadout", () => {
    it("should remove a loadout", () => {
      const { character } = createLoadout(createCharacter(), {
        name: "To Delete",
        gearAssignments: {},
        defaultReadiness: "stashed",
      });

      const loadoutId = character.loadouts![0].id;
      const updated = deleteLoadout(character, loadoutId);

      expect(updated.loadouts).toHaveLength(0);
    });

    it("should clear activeLoadoutId if deleting active loadout", () => {
      const { character, loadout } = createLoadout(createCharacter(), {
        name: "Active",
        gearAssignments: {},
        defaultReadiness: "stashed",
      });
      const withActive = { ...character, activeLoadoutId: loadout.id };

      const updated = deleteLoadout(withActive, loadout.id);
      expect(updated.activeLoadoutId).toBeUndefined();
    });

    it("should preserve activeLoadoutId if deleting different loadout", () => {
      const char1 = createCharacter();
      const { character: char2, loadout: l1 } = createLoadout(char1, {
        name: "First",
        gearAssignments: {},
        defaultReadiness: "stashed",
      });
      const { character: char3, loadout: l2 } = createLoadout(char2, {
        name: "Second",
        gearAssignments: {},
        defaultReadiness: "stashed",
      });
      const withActive = { ...char3, activeLoadoutId: l1.id };

      const updated = deleteLoadout(withActive, l2.id);
      expect(updated.activeLoadoutId).toBe(l1.id);
    });
  });

  describe("getLoadoutDiff", () => {
    it("should calculate items to stash", () => {
      const character = createCharacter({
        weapons: [createWeapon("wpn-1", "readied")],
        loadouts: [
          {
            id: "social",
            name: "Social",
            gearAssignments: { "wpn-1": "stashed" },
            defaultReadiness: "stashed",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
        ],
      });

      const diff = getLoadoutDiff(character, "social");
      expect(diff.itemsToStash).toContain("wpn-1");
      expect(diff.encumbranceChange).toBeLessThan(0);
    });

    it("should calculate items to bring", () => {
      const character = createCharacter({
        weapons: [createWeapon("wpn-1", "stashed")],
        loadouts: [
          {
            id: "combat",
            name: "Combat",
            gearAssignments: { "wpn-1": "readied" },
            defaultReadiness: "stashed",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
        ],
      });

      const diff = getLoadoutDiff(character, "combat");
      expect(diff.itemsToBring).toContain("wpn-1");
      expect(diff.encumbranceChange).toBeGreaterThan(0);
    });

    it("should calculate items that move between non-stash states", () => {
      const character = createCharacter({
        weapons: [createWeapon("wpn-1", "holstered")],
        loadouts: [
          {
            id: "ready",
            name: "Ready",
            gearAssignments: { "wpn-1": "readied" },
            defaultReadiness: "stashed",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
        ],
      });

      const diff = getLoadoutDiff(character, "ready");
      expect(diff.itemsToMove).toHaveLength(1);
      expect(diff.itemsToMove[0]).toEqual({
        itemId: "wpn-1",
        from: "holstered",
        to: "readied",
      });
    });

    it("should return empty diff for nonexistent loadout", () => {
      const character = createCharacter();
      const diff = getLoadoutDiff(character, "nonexistent");
      expect(diff.itemsToStash).toHaveLength(0);
      expect(diff.itemsToBring).toHaveLength(0);
    });
  });

  describe("applyLoadout", () => {
    it("should apply loadout to character gear", () => {
      const character = createCharacter({
        weapons: [createWeapon("wpn-1", "holstered"), createWeapon("wpn-2", "holstered")],
        armor: [createArmorItem("armor-1", "stashed")],
        loadouts: [
          {
            id: "combat",
            name: "Combat",
            gearAssignments: {
              "wpn-1": "readied",
              "wpn-2": "stashed",
              "armor-1": "worn",
            },
            defaultReadiness: "stashed",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
        ],
      });

      const result = applyLoadout(character, "combat");
      expect(result.success).toBe(true);
      expect(result.character).toBeDefined();

      const wpn1 = result.character!.weapons!.find((w) => w.id === "wpn-1");
      expect(wpn1?.state?.readiness).toBe("readied");

      const wpn2 = result.character!.weapons!.find((w) => w.id === "wpn-2");
      expect(wpn2?.state?.readiness).toBe("stashed");

      const armor = result.character!.armor!.find((a) => a.id === "armor-1");
      expect(armor?.state?.readiness).toBe("worn");

      expect(result.character!.activeLoadoutId).toBe("combat");
    });

    it("should use defaultReadiness for unassigned items", () => {
      const character = createCharacter({
        gear: [createGear("unassigned-item", "carried")],
        loadouts: [
          {
            id: "minimal",
            name: "Minimal",
            gearAssignments: {}, // No explicit assignments
            defaultReadiness: "stashed",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
        ],
      });

      const result = applyLoadout(character, "minimal");
      expect(result.success).toBe(true);

      const item = result.character!.gear!.find((g) => g.id === "unassigned-item");
      expect(item?.state?.readiness).toBe("stashed");
    });

    it("should fail for nonexistent loadout", () => {
      const character = createCharacter();
      const result = applyLoadout(character, "nonexistent");
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it("should round-trip: save → apply produces same state", () => {
      const character = createCharacter({
        weapons: [createWeapon("wpn-1", "readied"), createWeapon("wpn-2", "holstered")],
        armor: [createArmorItem("armor-1", "worn")],
      });

      // Save current state as loadout
      const { character: withLoadout, loadout } = saveCurrentAsLoadout(character, "Saved");

      // Change all weapons to stashed
      const modified: Character = {
        ...withLoadout,
        weapons: withLoadout.weapons!.map((w) => ({
          ...w,
          state: { ...w.state!, readiness: "stashed" as const },
        })),
      };

      // Apply the saved loadout — should restore original state
      const result = applyLoadout(modified, loadout.id);
      expect(result.success).toBe(true);

      const wpn1 = result.character!.weapons!.find((w) => w.id === "wpn-1");
      expect(wpn1?.state?.readiness).toBe("readied");

      const wpn2 = result.character!.weapons!.find((w) => w.id === "wpn-2");
      expect(wpn2?.state?.readiness).toBe("holstered");
    });
  });
});
