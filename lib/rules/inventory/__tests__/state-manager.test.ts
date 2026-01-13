/**
 * Equipment State Manager Tests
 *
 * @see lib/rules/inventory/state-manager.ts
 */

import { describe, it, expect } from "vitest";
import type { Weapon, ArmorItem, Character } from "@/lib/types";
import type { DeviceCondition } from "@/lib/types/gear-state";
import {
  getDefaultState,
  getValidTransitions,
  getTransitionActionCost,
  isValidTransition,
  setEquipmentReadiness,
  toggleWireless,
  toggleAugmentationWireless,
  setAllWireless,
  setDeviceCondition,
  brickDevice,
  repairDevice,
  isDeviceUsable,
  readyAllWeapons,
  holsterAllWeapons,
  getEquipmentStateSummary,
  STATE_TRANSITION_COSTS,
  VALID_STATES,
} from "../state-manager";

// =============================================================================
// TEST HELPERS
// =============================================================================

// Note: Using type assertions for simplified test objects.
// Tests focus on state management logic, not full type compliance.

function createWeapon(readiness: "readied" | "holstered" | "stored" = "holstered"): Weapon {
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
    state: {
      readiness,
      wirelessEnabled: true,
    },
  } as Weapon;
}

function createArmor(readiness: "worn" | "stored" = "worn"): ArmorItem {
  return {
    id: `armor-${Date.now()}-${Math.random()}`,
    name: "Test Armor",
    armorRating: 12,
    equipped: readiness === "worn",
    category: "armor",
    quantity: 1,
    cost: 500,
    state: {
      readiness,
      wirelessEnabled: true,
    },
  } as ArmorItem;
}

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
    weapons: [],
    armor: [],
    cyberware: [],
    ...overrides,
  } as Character;
}

// =============================================================================
// TESTS
// =============================================================================

describe("Equipment State Manager", () => {
  describe("getDefaultState", () => {
    it("should return holstered state for weapons", () => {
      const state = getDefaultState("weapon");
      expect(state.readiness).toBe("holstered");
      expect(state.wirelessEnabled).toBe(true);
    });

    it("should return worn state for armor", () => {
      const state = getDefaultState("armor");
      expect(state.readiness).toBe("worn");
      expect(state.wirelessEnabled).toBe(true);
    });

    it("should return worn state for augmentations", () => {
      const state = getDefaultState("augmentation");
      expect(state.readiness).toBe("worn");
      expect(state.wirelessEnabled).toBe(true);
    });

    it("should return stored state for electronics with condition", () => {
      const state = getDefaultState("electronics");
      expect(state.readiness).toBe("stored");
      expect(state.wirelessEnabled).toBe(true);
      expect(state.condition).toBe("functional");
    });

    it("should return stored state for unknown gear types", () => {
      const state = getDefaultState("unknown");
      expect(state.readiness).toBe("stored");
    });
  });

  describe("getValidTransitions", () => {
    it("should return valid transitions for holstered weapons", () => {
      const transitions = getValidTransitions("holstered", "weapon");
      expect(transitions).toContain("readied");
      expect(transitions).toContain("stored");
      expect(transitions).toContain("holstered");
    });

    it("should return valid transitions for worn armor", () => {
      const transitions = getValidTransitions("worn", "armor");
      expect(transitions).toContain("stored");
      expect(transitions).toContain("worn");
      expect(transitions).not.toContain("readied");
    });

    it("should return only worn for augmentations", () => {
      const transitions = getValidTransitions("worn", "augmentation");
      expect(transitions).toEqual(["worn"]);
    });
  });

  describe("getTransitionActionCost", () => {
    it("should return simple action for holstered to readied", () => {
      expect(getTransitionActionCost("holstered", "readied")).toBe("simple");
    });

    it("should return free action for readied to holstered", () => {
      expect(getTransitionActionCost("readied", "holstered")).toBe("free");
    });

    it("should return complex action for stored to readied", () => {
      expect(getTransitionActionCost("stored", "readied")).toBe("complex");
    });

    it("should return complex action for armor worn/stored transitions", () => {
      expect(getTransitionActionCost("stored", "worn")).toBe("complex");
      expect(getTransitionActionCost("worn", "stored")).toBe("complex");
    });

    it("should return none for same state", () => {
      expect(getTransitionActionCost("readied", "readied")).toBe("none");
      expect(getTransitionActionCost("holstered", "holstered")).toBe("none");
    });

    it("should default to complex for unknown transitions", () => {
      expect(getTransitionActionCost("readied", "worn")).toBe("complex");
    });
  });

  describe("isValidTransition", () => {
    it("should validate weapon transitions", () => {
      expect(isValidTransition("holstered", "readied", "weapon")).toBe(true);
      expect(isValidTransition("readied", "holstered", "weapon")).toBe(true);
      expect(isValidTransition("holstered", "worn", "weapon")).toBe(false);
    });

    it("should validate armor transitions", () => {
      expect(isValidTransition("stored", "worn", "armor")).toBe(true);
      expect(isValidTransition("worn", "stored", "armor")).toBe(true);
      expect(isValidTransition("stored", "readied", "armor")).toBe(false);
    });

    it("should reject invalid augmentation transitions", () => {
      expect(isValidTransition("worn", "stored", "augmentation")).toBe(false);
      expect(isValidTransition("worn", "worn", "augmentation")).toBe(true);
    });
  });

  describe("setEquipmentReadiness", () => {
    it("should successfully transition weapon from holstered to readied", () => {
      const weapon = createWeapon("holstered");
      const result = setEquipmentReadiness(weapon, "readied", "weapon");

      expect(result.success).toBe(true);
      expect(result.newState).toBe("readied");
      expect(result.previousState).toBe("holstered");
      expect(result.actionCost).toBe("simple");
    });

    it("should fail for invalid transitions", () => {
      const armor = createArmor("worn");
      const result = setEquipmentReadiness(armor, "readied", "armor");

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle items without state", () => {
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
      } as Weapon;

      const result = setEquipmentReadiness(weapon, "readied", "weapon");
      expect(result.success).toBe(true);
    });
  });

  describe("toggleWireless", () => {
    it("should toggle wireless off", () => {
      const weapon = createWeapon();
      const { item, result } = toggleWireless(weapon, false);

      expect(result.success).toBe(true);
      expect(result.previousState).toBe(true);
      expect(result.newState).toBe(false);
      expect(result.actionCost).toBe("free");
      expect(item.state?.wirelessEnabled).toBe(false);
    });

    it("should toggle wireless on", () => {
      const weapon = createWeapon();
      weapon.state!.wirelessEnabled = false;
      const { item, result } = toggleWireless(weapon, true);

      expect(result.newState).toBe(true);
      expect(item.state?.wirelessEnabled).toBe(true);
    });
  });

  describe("toggleAugmentationWireless", () => {
    it("should toggle cyberware wireless", () => {
      const cyber = { id: "cyber-1", wirelessEnabled: true };
      const { item, result } = toggleAugmentationWireless(cyber, false);

      expect(result.success).toBe(true);
      expect(result.previousState).toBe(true);
      expect(result.newState).toBe(false);
      expect(item.wirelessEnabled).toBe(false);
    });

    it("should default to true if not set", () => {
      const cyber: { wirelessEnabled?: boolean } = {};
      const { result } = toggleAugmentationWireless(cyber, false);

      expect(result.previousState).toBe(true);
    });
  });

  describe("setAllWireless", () => {
    it("should set global wireless flag", () => {
      const character = createCharacter({ wirelessBonusesEnabled: true });
      const updated = setAllWireless(character, false);

      expect(updated.wirelessBonusesEnabled).toBe(false);
    });
  });

  describe("Device Condition", () => {
    describe("setDeviceCondition", () => {
      it("should set device condition", () => {
        const device = { id: "device-1", condition: "functional" as const };
        const { device: updated, result } = setDeviceCondition(device, "bricked");

        expect(result.success).toBe(true);
        expect(result.previousCondition).toBe("functional");
        expect(result.newCondition).toBe("bricked");
        expect(updated.condition).toBe("bricked");
      });
    });

    describe("brickDevice", () => {
      it("should set condition to bricked", () => {
        const device = { id: "device-1", condition: "functional" as const };
        const { device: updated, result } = brickDevice(device);

        expect(result.newCondition).toBe("bricked");
        expect(updated.condition).toBe("bricked");
      });
    });

    describe("repairDevice", () => {
      it("should repair bricked device", () => {
        const device = { id: "device-1", condition: "bricked" as const };
        const { device: updated, result } = repairDevice(device);

        expect(result.success).toBe(true);
        expect(result.newCondition).toBe("functional");
        expect(updated.condition).toBe("functional");
      });

      it("should fail to repair destroyed device", () => {
        const device = { id: "device-1", condition: "destroyed" as const };
        const { result } = repairDevice(device);

        expect(result.success).toBe(false);
        expect(result.newCondition).toBe("destroyed");
      });
    });

    describe("isDeviceUsable", () => {
      it("should return true for functional devices", () => {
        expect(isDeviceUsable({ condition: "functional" })).toBe(true);
      });

      it("should return false for bricked devices", () => {
        expect(isDeviceUsable({ condition: "bricked" })).toBe(false);
      });

      it("should return false for destroyed devices", () => {
        expect(isDeviceUsable({ condition: "destroyed" })).toBe(false);
      });

      it("should default to functional if not set", () => {
        expect(isDeviceUsable({})).toBe(true);
      });
    });
  });

  describe("Bulk Operations", () => {
    describe("readyAllWeapons", () => {
      it("should ready all holstered weapons", () => {
        const weapons = [
          createWeapon("holstered"),
          createWeapon("holstered"),
          createWeapon("stored"),
        ];

        const { weapons: updated, totalActionCost } = readyAllWeapons(weapons);

        expect(updated[0].state?.readiness).toBe("readied");
        expect(updated[1].state?.readiness).toBe("readied");
        expect(updated[2].state?.readiness).toBe("stored"); // Not changed
        expect(totalActionCost).toBe(2); // 2 simple actions
      });

      it("should not change already readied weapons", () => {
        const weapons = [createWeapon("readied")];
        const { weapons: updated, totalActionCost } = readyAllWeapons(weapons);

        expect(updated[0].state?.readiness).toBe("readied");
        expect(totalActionCost).toBe(0);
      });
    });

    describe("holsterAllWeapons", () => {
      it("should holster all readied weapons", () => {
        const weapons = [
          createWeapon("readied"),
          createWeapon("readied"),
          createWeapon("holstered"),
        ];

        const updated = holsterAllWeapons(weapons);

        expect(updated[0].state?.readiness).toBe("holstered");
        expect(updated[1].state?.readiness).toBe("holstered");
        expect(updated[2].state?.readiness).toBe("holstered");
      });
    });
  });

  describe("getEquipmentStateSummary", () => {
    it("should count equipment states", () => {
      const character = createCharacter({
        weapons: [createWeapon("readied"), createWeapon("holstered"), createWeapon("stored")],
        armor: [createArmor("worn"), createArmor("stored")],
        cyberware: [
          {
            id: "cyber-1",
            catalogId: "c1",
            name: "Cyberarm",
            category: "cyberlimbs",
            grade: "standard",
            baseEssenceCost: 1,
            essenceCost: 1,
            cost: 1000,
            availability: 5,
            wirelessEnabled: true,
          },
          {
            id: "cyber-2",
            catalogId: "c2",
            name: "Cybereyes",
            category: "eyeware",
            grade: "standard",
            baseEssenceCost: 0.5,
            essenceCost: 0.5,
            cost: 500,
            availability: 3,
            wirelessEnabled: false,
          },
        ] as Character["cyberware"],
      });

      const summary = getEquipmentStateSummary(character);

      expect(summary.readiedWeapons).toBe(1);
      expect(summary.holsteredWeapons).toBe(1);
      expect(summary.storedWeapons).toBe(1);
      expect(summary.wornArmor).toBe(1);
      expect(summary.storedArmor).toBe(1);
      expect(summary.wirelessEnabled).toBe(4); // 3 weapons + 1 cyberware
      expect(summary.wirelessDisabled).toBe(1); // 1 cyberware disabled
    });

    it("should count bricked devices", () => {
      // Create character with minimal cyberdeck/commlink properties needed for test
      const character = createCharacter({
        cyberdecks: [
          {
            id: "deck-1",
            catalogId: "deck-1",
            name: "Deck 1",
            deviceRating: 3,
            attributeArray: [1, 2, 3, 4],
            currentConfig: { attack: 1, sleaze: 2, dataProcessing: 3, firewall: 4 },
            programSlots: 3,
            loadedPrograms: [],
            cost: 10000,
            availability: 8,
            condition: "bricked" as DeviceCondition,
          },
          {
            id: "deck-2",
            catalogId: "deck-2",
            name: "Deck 2",
            deviceRating: 3,
            attributeArray: [1, 2, 3, 4],
            currentConfig: { attack: 1, sleaze: 2, dataProcessing: 3, firewall: 4 },
            programSlots: 3,
            loadedPrograms: [],
            cost: 10000,
            availability: 8,
            condition: "functional" as DeviceCondition,
          },
        ] as Character["cyberdecks"],
        commlinks: [
          {
            id: "link-1",
            catalogId: "link-1",
            name: "Link 1",
            deviceRating: 3,
            dataProcessing: 3,
            firewall: 3,
            cost: 500,
            availability: 4,
            loadedPrograms: [],
            condition: "bricked" as DeviceCondition,
          },
        ] as Character["commlinks"],
      });

      const summary = getEquipmentStateSummary(character);
      expect(summary.brickedDevices).toBe(2);
    });

    it("should handle empty character", () => {
      const character = createCharacter();
      const summary = getEquipmentStateSummary(character);

      expect(summary.readiedWeapons).toBe(0);
      expect(summary.holsteredWeapons).toBe(0);
      expect(summary.storedWeapons).toBe(0);
      expect(summary.wornArmor).toBe(0);
      expect(summary.brickedDevices).toBe(0);
    });
  });

  describe("Constants", () => {
    it("should have correct transition costs defined", () => {
      expect(STATE_TRANSITION_COSTS["holstered->readied"]).toBe("simple");
      expect(STATE_TRANSITION_COSTS["readied->holstered"]).toBe("free");
      expect(STATE_TRANSITION_COSTS["stored->readied"]).toBe("complex");
    });

    it("should have correct valid states for each gear type", () => {
      expect(VALID_STATES.weapon).toContain("readied");
      expect(VALID_STATES.weapon).toContain("holstered");
      expect(VALID_STATES.weapon).not.toContain("worn");

      expect(VALID_STATES.armor).toContain("worn");
      expect(VALID_STATES.armor).toContain("stored");
      expect(VALID_STATES.armor).not.toContain("holstered");

      expect(VALID_STATES.augmentation).toEqual(["worn"]);
    });
  });
});
