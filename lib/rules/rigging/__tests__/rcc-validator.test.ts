import { describe, it, expect } from "vitest";
import {
  calculateMaxSlavedDrones,
  calculateNoiseReduction,
  calculateSharingBonus,
  hasRCC,
  getActiveRCC,
  buildRCCConfiguration,
  validateRCCConfig,
  validateDroneSlaving,
  validateAutosoftOnRCC,
  getOwnedDrones,
  getOwnedAutosofts,
  hasDrone,
  hasAutosoft,
  canRemoteControl,
  getEffectiveFirewall,
  isRCCAtCapacity,
} from "../rcc-validator";
import {
  createTestCharacter,
  createTestCharacterRCC,
  createTestCharacterDrone,
  createTestCharacterAutosoft,
} from "./fixtures";
import type { CharacterRCC, CharacterAutosoft } from "@/lib/types/character";

// =============================================================================
// RCC CALCULATION TESTS
// =============================================================================

describe("rcc-validator", () => {
  describe("calculateMaxSlavedDrones", () => {
    it("should return DP × 3 for data processing of 1", () => {
      expect(calculateMaxSlavedDrones(1)).toBe(3);
    });

    it("should return DP × 3 for data processing of 4", () => {
      expect(calculateMaxSlavedDrones(4)).toBe(12);
    });

    it("should return DP × 3 for data processing of 6", () => {
      expect(calculateMaxSlavedDrones(6)).toBe(18);
    });

    it("should handle 0 data processing", () => {
      expect(calculateMaxSlavedDrones(0)).toBe(0);
    });
  });

  describe("calculateNoiseReduction", () => {
    it("should return device rating as noise reduction", () => {
      expect(calculateNoiseReduction(1)).toBe(1);
      expect(calculateNoiseReduction(3)).toBe(3);
      expect(calculateNoiseReduction(6)).toBe(6);
    });
  });

  describe("calculateSharingBonus", () => {
    it("should return firewall as sharing bonus", () => {
      expect(calculateSharingBonus(1)).toBe(1);
      expect(calculateSharingBonus(4)).toBe(4);
      expect(calculateSharingBonus(6)).toBe(6);
    });
  });

  // =============================================================================
  // RCC DETECTION TESTS
  // =============================================================================

  describe("hasRCC", () => {
    it("should return false for character with no RCCs", () => {
      const character = createTestCharacter({ hasRCC: false });
      character.rccs = [];
      expect(hasRCC(character)).toBe(false);
    });

    it("should return false for undefined rccs", () => {
      const character = createTestCharacter({ hasRCC: false });
      character.rccs = undefined as unknown as CharacterRCC[];
      expect(hasRCC(character)).toBe(false);
    });

    it("should return true for character with RCC", () => {
      const character = createTestCharacter({ hasRCC: true });
      expect(hasRCC(character)).toBe(true);
    });
  });

  describe("getActiveRCC", () => {
    it("should return null for character with no RCCs", () => {
      const character = createTestCharacter({ hasRCC: false });
      character.rccs = [];
      expect(getActiveRCC(character)).toBeNull();
    });

    it("should return null for undefined rccs", () => {
      const character = createTestCharacter({ hasRCC: false });
      character.rccs = undefined as unknown as CharacterRCC[];
      expect(getActiveRCC(character)).toBeNull();
    });

    it("should return first RCC as active", () => {
      const character = createTestCharacter({ hasRCC: true });
      const rcc = getActiveRCC(character);

      expect(rcc).not.toBeNull();
      expect(rcc!.name).toBe("MCT Drone Web");
    });

    it("should return first RCC when multiple exist", () => {
      const character = createTestCharacter();
      character.rccs = [
        createTestCharacterRCC("rcc-1", { name: "First RCC" }),
        createTestCharacterRCC("rcc-2", { name: "Second RCC" }),
      ];
      const rcc = getActiveRCC(character);

      expect(rcc).not.toBeNull();
      expect(rcc!.name).toBe("First RCC");
    });
  });

  // =============================================================================
  // RCC CONFIGURATION TESTS
  // =============================================================================

  describe("buildRCCConfiguration", () => {
    it("should build configuration from character RCC", () => {
      const rcc = createTestCharacterRCC("rcc-1", {
        deviceRating: 4,
        dataProcessing: 4,
        firewall: 3,
      });
      const config = buildRCCConfiguration(rcc);

      expect(config.rccId).toBe("mct-drone-web");
      expect(config.name).toBe("MCT Drone Web");
      expect(config.deviceRating).toBe(4);
      expect(config.dataProcessing).toBe(4);
      expect(config.firewall).toBe(3);
      expect(config.maxSlavedDrones).toBe(12); // 4 × 3
      expect(config.noiseReduction).toBe(4);
      expect(config.sharingBonus).toBe(3);
    });

    it("should use custom name if provided", () => {
      const rcc = createTestCharacterRCC("rcc-1", { customName: "My Custom RCC" });
      const config = buildRCCConfiguration(rcc);

      expect(config.name).toBe("My Custom RCC");
    });

    it("should resolve running autosofts from character data", () => {
      const autosofts: CharacterAutosoft[] = [
        createTestCharacterAutosoft("autosoft-1", {
          catalogId: "maneuvering-4",
          name: "Maneuvering",
          rating: 4,
          category: "movement",
        }),
      ];
      const rcc = createTestCharacterRCC("rcc-1", {
        runningAutosofts: ["autosoft-1"],
      });
      const config = buildRCCConfiguration(rcc, autosofts);

      expect(config.runningAutosofts).toHaveLength(1);
      expect(config.runningAutosofts[0].name).toBe("Maneuvering");
      expect(config.runningAutosofts[0].rating).toBe(4);
    });

    it("should create placeholder for unknown autosoft", () => {
      const rcc = createTestCharacterRCC("rcc-1", {
        runningAutosofts: ["unknown-autosoft"],
      });
      const config = buildRCCConfiguration(rcc, []);

      expect(config.runningAutosofts).toHaveLength(1);
      expect(config.runningAutosofts[0].autosoftId).toBe("unknown-autosoft");
      expect(config.runningAutosofts[0].rating).toBe(1);
    });

    it("should resolve autosoft by catalogId", () => {
      const autosofts: CharacterAutosoft[] = [
        createTestCharacterAutosoft("autosoft-1", {
          catalogId: "targeting-5",
          name: "Targeting",
          rating: 5,
          category: "combat",
          target: "Ares Predator",
        }),
      ];
      const rcc = createTestCharacterRCC("rcc-1", {
        runningAutosofts: ["targeting-5"],
      });
      const config = buildRCCConfiguration(rcc, autosofts);

      expect(config.runningAutosofts[0].name).toBe("Targeting");
      expect(config.runningAutosofts[0].target).toBe("Ares Predator");
    });
  });

  // =============================================================================
  // RCC VALIDATION TESTS
  // =============================================================================

  describe("validateRCCConfig", () => {
    it("should return valid for proper configuration", () => {
      const rcc = createTestCharacterRCC("rcc-1", {
        deviceRating: 4,
        dataProcessing: 4,
        firewall: 3,
      });
      const result = validateRCCConfig(rcc, 0);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.maxDrones).toBe(12);
      expect(result.noiseReduction).toBe(4);
    });

    it("should warn about unusual device rating", () => {
      const rcc = createTestCharacterRCC("rcc-1", { deviceRating: 7 });
      const result = validateRCCConfig(rcc, 0);

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0].code).toBe("INVALID_DEVICE_RATING");
    });

    it("should error on data processing below 1", () => {
      const rcc = createTestCharacterRCC("rcc-1", { dataProcessing: 0 });
      const result = validateRCCConfig(rcc, 0);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "INVALID_DATA_PROCESSING")).toBe(true);
    });

    it("should error on firewall below 1", () => {
      const rcc = createTestCharacterRCC("rcc-1", { firewall: 0 });
      const result = validateRCCConfig(rcc, 0);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "INVALID_FIREWALL")).toBe(true);
    });

    it("should error when slaved drones exceed limit", () => {
      const rcc = createTestCharacterRCC("rcc-1", { dataProcessing: 2 }); // max 6
      const result = validateRCCConfig(rcc, 7);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "EXCEEDED_SLAVE_LIMIT")).toBe(true);
    });

    it("should return correct current drone count", () => {
      const rcc = createTestCharacterRCC("rcc-1");
      const result = validateRCCConfig(rcc, 5);

      expect(result.currentDrones).toBe(5);
    });
  });

  // =============================================================================
  // DRONE SLAVING VALIDATION TESTS
  // =============================================================================

  describe("validateDroneSlaving", () => {
    it("should return valid when under capacity", () => {
      const result = validateDroneSlaving(4, [], "drone-1");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.maxCount).toBe(12); // 4 × 3
      expect(result.remainingSlots).toBe(12);
    });

    it("should warn when drone is already slaved", () => {
      const result = validateDroneSlaving(4, ["drone-1"], "drone-1");

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0].code).toBe("ALREADY_SLAVED");
    });

    it("should error when at capacity", () => {
      const slavedIds = ["d1", "d2", "d3", "d4", "d5", "d6"];
      const result = validateDroneSlaving(2, slavedIds, "drone-new"); // max 6

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "SLAVE_LIMIT_REACHED")).toBe(true);
      expect(result.remainingSlots).toBe(0);
    });

    it("should calculate remaining slots correctly", () => {
      const slavedIds = ["d1", "d2", "d3"];
      const result = validateDroneSlaving(4, slavedIds, "drone-new"); // max 12

      expect(result.currentCount).toBe(3);
      expect(result.maxCount).toBe(12);
      expect(result.remainingSlots).toBe(9);
    });
  });

  // =============================================================================
  // AUTOSOFT VALIDATION TESTS
  // =============================================================================

  describe("validateAutosoftOnRCC", () => {
    it("should return valid when autosoft rating <= device rating", () => {
      const autosoft = createTestCharacterAutosoft("a1", { rating: 4 });
      const result = validateAutosoftOnRCC(autosoft, 4);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should error when autosoft rating exceeds device rating", () => {
      const autosoft = createTestCharacterAutosoft("a1", { rating: 5 });
      const result = validateAutosoftOnRCC(autosoft, 4);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "RATING_EXCEEDS_DEVICE")).toBe(true);
    });

    it("should allow autosoft rating equal to device rating", () => {
      const autosoft = createTestCharacterAutosoft("a1", { rating: 6 });
      const result = validateAutosoftOnRCC(autosoft, 6);

      expect(result.valid).toBe(true);
    });
  });

  // =============================================================================
  // OWNERSHIP HELPER TESTS
  // =============================================================================

  describe("getOwnedDrones", () => {
    it("should return empty array for character with no drones", () => {
      const character = createTestCharacter({ hasDrones: false });
      character.drones = [];
      expect(getOwnedDrones(character)).toEqual([]);
    });

    it("should return drones for character with drones", () => {
      const character = createTestCharacter({ hasDrones: true });
      const drones = getOwnedDrones(character);

      expect(drones.length).toBe(2);
    });

    it("should return empty array for undefined drones", () => {
      const character = createTestCharacter();
      character.drones = undefined as unknown as typeof character.drones;
      expect(getOwnedDrones(character)).toEqual([]);
    });
  });

  describe("getOwnedAutosofts", () => {
    it("should return empty array for character with no autosofts", () => {
      const character = createTestCharacter();
      character.autosofts = [];
      expect(getOwnedAutosofts(character)).toEqual([]);
    });

    it("should return autosofts for character", () => {
      const character = createTestCharacter();
      character.autosofts = [createTestCharacterAutosoft("a1"), createTestCharacterAutosoft("a2")];
      const autosofts = getOwnedAutosofts(character);

      expect(autosofts.length).toBe(2);
    });

    it("should return empty array for undefined autosofts", () => {
      const character = createTestCharacter();
      character.autosofts = undefined as unknown as CharacterAutosoft[];
      expect(getOwnedAutosofts(character)).toEqual([]);
    });
  });

  describe("hasDrone", () => {
    it("should return false when drone not found", () => {
      const character = createTestCharacter({ hasDrones: true });
      expect(hasDrone(character, "nonexistent")).toBe(false);
    });

    it("should find drone by id", () => {
      const character = createTestCharacter();
      character.drones = [createTestCharacterDrone("drone-1")];
      expect(hasDrone(character, "drone-1")).toBe(true);
    });

    it("should find drone by catalogId", () => {
      const character = createTestCharacter();
      character.drones = [createTestCharacterDrone("drone-1", { catalogId: "mct-fly-spy" })];
      expect(hasDrone(character, "mct-fly-spy")).toBe(true);
    });
  });

  describe("hasAutosoft", () => {
    it("should return false when autosoft not found", () => {
      const character = createTestCharacter();
      character.autosofts = [];
      expect(hasAutosoft(character, "nonexistent")).toBe(false);
    });

    it("should find autosoft by id", () => {
      const character = createTestCharacter();
      character.autosofts = [createTestCharacterAutosoft("autosoft-1")];
      expect(hasAutosoft(character, "autosoft-1")).toBe(true);
    });

    it("should find autosoft by catalogId", () => {
      const character = createTestCharacter();
      character.autosofts = [createTestCharacterAutosoft("a1", { catalogId: "maneuvering-4" })];
      expect(hasAutosoft(character, "maneuvering-4")).toBe(true);
    });
  });

  // =============================================================================
  // CAPABILITY CHECK TESTS
  // =============================================================================

  describe("canRemoteControl", () => {
    it("should return false when no drones slaved", () => {
      expect(canRemoteControl(4, 0)).toBe(false);
    });

    it("should return true when at least one drone slaved", () => {
      expect(canRemoteControl(4, 1)).toBe(true);
      expect(canRemoteControl(4, 5)).toBe(true);
    });
  });

  describe("getEffectiveFirewall", () => {
    it("should return drone device rating when higher than RCC firewall", () => {
      expect(getEffectiveFirewall(5, 3)).toBe(5);
    });

    it("should return RCC firewall when higher than drone device rating", () => {
      expect(getEffectiveFirewall(2, 4)).toBe(4);
    });

    it("should return same value when equal", () => {
      expect(getEffectiveFirewall(4, 4)).toBe(4);
    });
  });

  describe("isRCCAtCapacity", () => {
    it("should return false when under capacity", () => {
      expect(isRCCAtCapacity(4, 5)).toBe(false); // max 12
    });

    it("should return true when at capacity", () => {
      expect(isRCCAtCapacity(4, 12)).toBe(true); // max 12
    });

    it("should return true when over capacity", () => {
      expect(isRCCAtCapacity(4, 15)).toBe(true); // max 12
    });

    it("should handle small data processing", () => {
      expect(isRCCAtCapacity(1, 3)).toBe(true); // max 3
      expect(isRCCAtCapacity(1, 2)).toBe(false);
    });
  });
});
