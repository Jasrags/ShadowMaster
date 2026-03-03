/**
 * Container Manager Tests
 *
 * @see lib/rules/inventory/container-manager.ts
 */

import { describe, it, expect } from "vitest";
import type { Character, GearItem, Weapon } from "@/lib/types";
import {
  findGearItemById,
  isContainer,
  getContainerContents,
  getContainerChain,
  isCircularContainment,
  getContainmentDepth,
  getEffectiveReadiness,
  getContainerContentWeight,
  validateContainerCapacity,
  canAddToContainer,
  addItemToContainer,
  removeItemFromContainer,
  moveItemBetweenContainers,
  MAX_CONTAINER_DEPTH,
  READINESS_RESTRICTION_ORDER,
} from "../container-manager";

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

function createBackpack(id: string, weightCapacity = 20, slotCapacity?: number): GearItem {
  return {
    id,
    name: "Backpack",
    category: "gear",
    quantity: 1,
    cost: 50,
    weight: 1,
    state: { readiness: "carried", wirelessEnabled: false },
    containerProperties: {
      weightCapacity,
      slotCapacity,
    },
  };
}

function createGearItem(id: string, weight = 1, containerId?: string, category = "gear"): GearItem {
  return {
    id,
    name: `Gear ${id}`,
    category,
    quantity: 1,
    cost: 100,
    weight,
    state: {
      readiness: "carried",
      wirelessEnabled: false,
      ...(containerId ? { containedIn: { containerId } } : {}),
    },
  };
}

function createWeapon(id: string, weight = 2, containerId?: string): Weapon {
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
    weight,
    state: {
      readiness: "holstered",
      wirelessEnabled: true,
      ...(containerId ? { containedIn: { containerId } } : {}),
    },
  } as Weapon;
}

// =============================================================================
// TESTS
// =============================================================================

describe("Container Manager", () => {
  describe("findGearItemById", () => {
    it("should find items in gear array", () => {
      const character = createCharacter({
        gear: [createGearItem("item-1")],
      });
      expect(findGearItemById(character, "item-1")).toBeDefined();
      expect(findGearItemById(character, "item-1")!.id).toBe("item-1");
    });

    it("should find items in weapons array", () => {
      const character = createCharacter({
        weapons: [createWeapon("wpn-1")],
      });
      expect(findGearItemById(character, "wpn-1")).toBeDefined();
    });

    it("should return undefined for missing items", () => {
      const character = createCharacter();
      expect(findGearItemById(character, "nonexistent")).toBeUndefined();
    });
  });

  describe("isContainer", () => {
    it("should return true for items with containerProperties", () => {
      const backpack = createBackpack("bp-1");
      expect(isContainer(backpack)).toBe(true);
    });

    it("should return false for regular items", () => {
      const item = createGearItem("item-1");
      expect(isContainer(item)).toBe(false);
    });
  });

  describe("getContainerContents", () => {
    it("should find all items in a container", () => {
      const character = createCharacter({
        gear: [
          createBackpack("bp-1"),
          createGearItem("item-1", 1, "bp-1"),
          createGearItem("item-2", 1, "bp-1"),
          createGearItem("item-3"), // Not in container
        ],
      });

      const contents = getContainerContents(character, "bp-1");
      expect(contents).toHaveLength(2);
      expect(contents.map((c) => c.id)).toContain("item-1");
      expect(contents.map((c) => c.id)).toContain("item-2");
    });

    it("should search across gear and weapons arrays", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1"), createGearItem("item-1", 1, "bp-1")],
        weapons: [createWeapon("wpn-1", 2, "bp-1")],
      });

      const contents = getContainerContents(character, "bp-1");
      expect(contents).toHaveLength(2);
    });

    it("should return empty array for empty container", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1")],
      });
      expect(getContainerContents(character, "bp-1")).toHaveLength(0);
    });
  });

  describe("getContainerChain", () => {
    it("should return empty array for top-level items", () => {
      const character = createCharacter({
        gear: [createGearItem("item-1")],
      });
      expect(getContainerChain(character, "item-1")).toEqual([]);
    });

    it("should return single container for directly contained item", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1"), createGearItem("item-1", 1, "bp-1")],
      });
      expect(getContainerChain(character, "item-1")).toEqual(["bp-1"]);
    });

    it("should return full chain for nested containment", () => {
      const outerBag = createBackpack("outer", 50);
      const innerBag = createBackpack("inner", 10);
      innerBag.state = {
        readiness: "carried",
        wirelessEnabled: false,
        containedIn: { containerId: "outer" },
      };
      const item = createGearItem("item-1", 1, "inner");

      const character = createCharacter({
        gear: [outerBag, innerBag, item],
      });

      expect(getContainerChain(character, "item-1")).toEqual(["inner", "outer"]);
    });
  });

  describe("isCircularContainment", () => {
    it("should detect self-containment", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1")],
      });
      expect(isCircularContainment(character, "bp-1", "bp-1")).toBe(true);
    });

    it("should detect indirect cycles", () => {
      const bag1 = createBackpack("bag-1", 50);
      const bag2 = createBackpack("bag-2", 50);
      bag2.state = {
        readiness: "carried",
        wirelessEnabled: false,
        containedIn: { containerId: "bag-1" },
      };

      const character = createCharacter({
        gear: [bag1, bag2],
      });

      // Trying to put bag-1 into bag-2 (which is already in bag-1) = cycle
      expect(isCircularContainment(character, "bag-1", "bag-2")).toBe(true);
    });

    it("should allow valid containment", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1"), createGearItem("item-1")],
      });
      expect(isCircularContainment(character, "item-1", "bp-1")).toBe(false);
    });
  });

  describe("getContainmentDepth", () => {
    it("should return 0 for top-level items", () => {
      const character = createCharacter({
        gear: [createGearItem("item-1")],
      });
      expect(getContainmentDepth(character, "item-1")).toBe(0);
    });

    it("should return 1 for directly contained items", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1"), createGearItem("item-1", 1, "bp-1")],
      });
      expect(getContainmentDepth(character, "item-1")).toBe(1);
    });

    it("should return correct depth for nested items", () => {
      const outerBag = createBackpack("outer", 50);
      const innerBag = createBackpack("inner", 10);
      innerBag.state = {
        readiness: "carried",
        wirelessEnabled: false,
        containedIn: { containerId: "outer" },
      };
      const item = createGearItem("item-1", 1, "inner");

      const character = createCharacter({ gear: [outerBag, innerBag, item] });
      expect(getContainmentDepth(character, "item-1")).toBe(2);
    });
  });

  describe("getEffectiveReadiness", () => {
    it("should return item readiness for top-level items", () => {
      const character = createCharacter({
        weapons: [createWeapon("wpn-1")],
      });
      expect(getEffectiveReadiness(character, "wpn-1")).toBe("holstered");
    });

    it("should return most restricted state in chain", () => {
      const backpack = createBackpack("bp-1");
      backpack.state = { readiness: "stashed", wirelessEnabled: false };
      const item = createGearItem("item-1", 1, "bp-1");
      item.state = {
        readiness: "carried",
        wirelessEnabled: false,
        containedIn: { containerId: "bp-1" },
      };

      const character = createCharacter({ gear: [backpack, item] });

      // Item is "carried" but container is "stashed" — effective is "stashed"
      expect(getEffectiveReadiness(character, "item-1")).toBe("stashed");
    });

    it("should return stashed for unknown items", () => {
      const character = createCharacter();
      expect(getEffectiveReadiness(character, "nonexistent")).toBe("stashed");
    });
  });

  describe("getContainerContentWeight", () => {
    it("should sum weights of contained items", () => {
      const character = createCharacter({
        gear: [
          createBackpack("bp-1"),
          createGearItem("item-1", 3, "bp-1"),
          createGearItem("item-2", 5, "bp-1"),
        ],
      });
      expect(getContainerContentWeight(character, "bp-1")).toBe(8);
    });

    it("should include nested container contents recursively", () => {
      const outerBag = createBackpack("outer", 50);
      const innerBag = createBackpack("inner", 10);
      innerBag.state = {
        readiness: "carried",
        wirelessEnabled: false,
        containedIn: { containerId: "outer" },
      };
      innerBag.weight = 0.5;
      const item = createGearItem("item-1", 2, "inner");

      const character = createCharacter({ gear: [outerBag, innerBag, item] });

      // outer contains: inner bag (0.5kg) + item (2kg inside inner)
      expect(getContainerContentWeight(character, "outer")).toBe(2.5);
    });

    it("should return 0 for empty container", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1")],
      });
      expect(getContainerContentWeight(character, "bp-1")).toBe(0);
    });
  });

  describe("validateContainerCapacity", () => {
    it("should validate within capacity", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1", 20), createGearItem("item-1", 5, "bp-1")],
      });

      const result = validateContainerCapacity(character, "bp-1");
      expect(result.withinWeight).toBe(true);
      expect(result.currentWeight).toBe(5);
      expect(result.maxWeight).toBe(20);
    });

    it("should detect over-weight", () => {
      const character = createCharacter({
        gear: [
          createBackpack("bp-1", 5),
          createGearItem("item-1", 3, "bp-1"),
          createGearItem("item-2", 4, "bp-1"),
        ],
      });

      const result = validateContainerCapacity(character, "bp-1");
      expect(result.withinWeight).toBe(false);
      expect(result.currentWeight).toBe(7);
    });

    it("should check slot capacity", () => {
      const character = createCharacter({
        gear: [
          createBackpack("bp-1", 100, 2), // 2 slot max
          createGearItem("item-1", 1, "bp-1"),
          createGearItem("item-2", 1, "bp-1"),
          createGearItem("item-3", 1, "bp-1"), // 3rd item
        ],
      });

      const result = validateContainerCapacity(character, "bp-1");
      expect(result.withinSlots).toBe(false);
      expect(result.currentSlots).toBe(3);
      expect(result.maxSlots).toBe(2);
    });
  });

  describe("canAddToContainer", () => {
    it("should allow adding item to valid container", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1", 20), createGearItem("item-1", 5)],
      });

      const result = canAddToContainer(character, "item-1", "bp-1");
      expect(result.allowed).toBe(true);
    });

    it("should reject non-container target", () => {
      const character = createCharacter({
        gear: [createGearItem("not-a-bag"), createGearItem("item-1")],
      });

      const result = canAddToContainer(character, "item-1", "not-a-bag");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("not a container");
    });

    it("should reject circular containment", () => {
      const bag1 = createBackpack("bag-1", 50);
      const bag2 = createBackpack("bag-2", 50);
      bag2.state = {
        readiness: "carried",
        wirelessEnabled: false,
        containedIn: { containerId: "bag-1" },
      };

      const character = createCharacter({ gear: [bag1, bag2] });

      const result = canAddToContainer(character, "bag-1", "bag-2");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("Circular");
    });

    it("should reject exceeding weight capacity", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1", 5), createGearItem("heavy-item", 10)],
      });

      const result = canAddToContainer(character, "heavy-item", "bp-1");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("weight capacity");
    });

    it("should reject exceeding slot capacity", () => {
      const character = createCharacter({
        gear: [
          createBackpack("bp-1", 100, 1), // only 1 slot
          createGearItem("item-1", 1, "bp-1"), // already fills it
          createGearItem("item-2", 1),
        ],
      });

      const result = canAddToContainer(character, "item-2", "bp-1");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("slot capacity");
    });

    it("should reject wrong category", () => {
      const restrictedBag: GearItem = {
        id: "ammo-case",
        name: "Ammo Case",
        category: "gear",
        quantity: 1,
        cost: 25,
        weight: 0.5,
        state: { readiness: "carried", wirelessEnabled: false },
        containerProperties: {
          weightCapacity: 10,
          allowedCategories: ["ammunition"],
        },
      };

      const character = createCharacter({
        gear: [restrictedBag, createGearItem("item-1", 1, undefined, "electronics")],
      });

      const result = canAddToContainer(character, "item-1", "ammo-case");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("not allowed");
    });

    it("should reject exceeding max nesting depth", () => {
      // Build a chain at max depth
      const bag1 = createBackpack("bag-1", 100);
      const bag2 = createBackpack("bag-2", 100);
      bag2.state = {
        readiness: "carried",
        wirelessEnabled: false,
        containedIn: { containerId: "bag-1" },
      };
      // bag-2 is already at depth 1, adding a new container at depth 2
      // item would be at depth 3 = MAX_CONTAINER_DEPTH, which exceeds
      const bag3 = createBackpack("bag-3", 100);
      bag3.state = {
        readiness: "carried",
        wirelessEnabled: false,
        containedIn: { containerId: "bag-2" },
      };

      const item = createGearItem("item-1");

      const character = createCharacter({ gear: [bag1, bag2, bag3, item] });

      // bag-3 is at depth 2. Adding item to bag-3 would put item at depth 3 = MAX_CONTAINER_DEPTH
      const result = canAddToContainer(character, "item-1", "bag-3");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("nesting depth");
    });

    it("should reject items without ID", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1")],
      });

      const result = canAddToContainer(character, "", "bp-1");
      expect(result.allowed).toBe(false);
    });
  });

  describe("addItemToContainer", () => {
    it("should add item to container and return updated character", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1"), createGearItem("item-1")],
      });

      const result = addItemToContainer(character, "item-1", "bp-1");
      expect(result.success).toBe(true);
      expect(result.character).toBeDefined();

      const updatedItem = result.character!.gear!.find((g) => g.id === "item-1");
      expect(updatedItem?.state?.containedIn?.containerId).toBe("bp-1");
    });

    it("should support slot assignment", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1"), createGearItem("item-1")],
      });

      const result = addItemToContainer(character, "item-1", "bp-1", "main-pocket");
      expect(result.success).toBe(true);

      const updatedItem = result.character!.gear!.find((g) => g.id === "item-1");
      expect(updatedItem?.state?.containedIn?.slot).toBe("main-pocket");
    });

    it("should fail for invalid operations", () => {
      const character = createCharacter({
        gear: [createGearItem("not-a-bag"), createGearItem("item-1")],
      });

      const result = addItemToContainer(character, "item-1", "not-a-bag");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("removeItemFromContainer", () => {
    it("should remove item from container", () => {
      const character = createCharacter({
        gear: [createBackpack("bp-1"), createGearItem("item-1", 1, "bp-1")],
      });

      const result = removeItemFromContainer(character, "item-1");
      expect(result.success).toBe(true);

      const updatedItem = result.character!.gear!.find((g) => g.id === "item-1");
      expect(updatedItem?.state?.containedIn).toBeUndefined();
    });

    it("should fail for items not in a container", () => {
      const character = createCharacter({
        gear: [createGearItem("item-1")],
      });

      const result = removeItemFromContainer(character, "item-1");
      expect(result.success).toBe(false);
    });

    it("should fail for nonexistent items", () => {
      const character = createCharacter();
      const result = removeItemFromContainer(character, "nonexistent");
      expect(result.success).toBe(false);
    });
  });

  describe("moveItemBetweenContainers", () => {
    it("should move item from one container to another", () => {
      const character = createCharacter({
        gear: [
          createBackpack("bp-1", 20),
          createBackpack("bp-2", 20),
          createGearItem("item-1", 1, "bp-1"),
        ],
      });

      const result = moveItemBetweenContainers(character, "item-1", "bp-2");
      expect(result.success).toBe(true);

      const updatedItem = result.character!.gear!.find((g) => g.id === "item-1");
      expect(updatedItem?.state?.containedIn?.containerId).toBe("bp-2");
    });
  });

  describe("Constants", () => {
    it("should have correct MAX_CONTAINER_DEPTH", () => {
      expect(MAX_CONTAINER_DEPTH).toBe(3);
    });

    it("should have readiness restriction order from least to most restricted", () => {
      expect(READINESS_RESTRICTION_ORDER[0]).toBe("readied");
      expect(READINESS_RESTRICTION_ORDER[READINESS_RESTRICTION_ORDER.length - 1]).toBe("stashed");
    });
  });
});
