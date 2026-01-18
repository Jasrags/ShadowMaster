import { describe, it, expect } from "vitest";
import {
  getBiofeedbackDamageType,
  getCurrentBiofeedbackType,
  calculateBiofeedbackFromVehicleDamage,
  calculateDumpshockDamage,
  applyBiofeedbackDamage,
  trackBiofeedbackDamage,
  handleForcedEjection,
  createDumpshockResult,
  calculateBiofeedbackResistancePool,
  reduceBiofeedbackDamage,
  getTotalBiofeedbackDamage,
  isBiofeedbackDangerous,
  getBiofeedbackWarningLevel,
  shouldWarnAboutHotSim,
  getHotSimRiskDescription,
  getColdSimBenefitsDescription,
} from "../biofeedback-handler";
import {
  createTestCharacter,
  createTestRiggingState,
  createTestDroneNetwork,
  createTestSlavedDrone,
  createTestJumpedInState,
} from "./fixtures";
import type { Character } from "@/lib/types/character";

// =============================================================================
// DAMAGE TYPE TESTS
// =============================================================================

describe("biofeedback-handler", () => {
  describe("getBiofeedbackDamageType", () => {
    it("should return stun for cold-sim", () => {
      expect(getBiofeedbackDamageType("cold-sim")).toBe("stun");
    });

    it("should return physical for hot-sim", () => {
      expect(getBiofeedbackDamageType("hot-sim")).toBe("physical");
    });
  });

  describe("getCurrentBiofeedbackType", () => {
    it("should return current damage type from rigging state", () => {
      const state = createTestRiggingState({ biofeedbackDamageType: "stun" });
      expect(getCurrentBiofeedbackType(state)).toBe("stun");
    });

    it("should return physical for hot-sim rigging state", () => {
      const state = createTestRiggingState({
        vrMode: "hot-sim",
        biofeedbackDamageType: "physical",
      });
      expect(getCurrentBiofeedbackType(state)).toBe("physical");
    });
  });

  // =============================================================================
  // BIOFEEDBACK DAMAGE CALCULATION TESTS
  // =============================================================================

  describe("calculateBiofeedbackFromVehicleDamage", () => {
    it("should calculate half vehicle damage rounded down", () => {
      const result = calculateBiofeedbackFromVehicleDamage(6, "cold-sim");
      expect(result.damage).toBe(3);
    });

    it("should round down odd damage values", () => {
      const result = calculateBiofeedbackFromVehicleDamage(5, "cold-sim");
      expect(result.damage).toBe(2);
    });

    it("should return stun damage for cold-sim", () => {
      const result = calculateBiofeedbackFromVehicleDamage(6, "cold-sim");
      expect(result.damageType).toBe("stun");
    });

    it("should return physical damage for hot-sim", () => {
      const result = calculateBiofeedbackFromVehicleDamage(6, "hot-sim");
      expect(result.damageType).toBe("physical");
    });

    it("should set source to vehicle_damage", () => {
      const result = calculateBiofeedbackFromVehicleDamage(6, "cold-sim");
      expect(result.source).toBe("vehicle_damage");
    });

    it("should handle 0 vehicle damage", () => {
      const result = calculateBiofeedbackFromVehicleDamage(0, "cold-sim");
      expect(result.damage).toBe(0);
    });

    it("should handle 1 vehicle damage (rounds down to 0)", () => {
      const result = calculateBiofeedbackFromVehicleDamage(1, "cold-sim");
      expect(result.damage).toBe(0);
    });
  });

  describe("calculateDumpshockDamage", () => {
    it("should always return 6 damage", () => {
      expect(calculateDumpshockDamage("cold-sim").damage).toBe(6);
      expect(calculateDumpshockDamage("hot-sim").damage).toBe(6);
    });

    it("should return stun for cold-sim", () => {
      const result = calculateDumpshockDamage("cold-sim");
      expect(result.damageType).toBe("stun");
    });

    it("should return physical for hot-sim", () => {
      const result = calculateDumpshockDamage("hot-sim");
      expect(result.damageType).toBe("physical");
    });

    it("should set source to dumpshock", () => {
      const result = calculateDumpshockDamage("cold-sim");
      expect(result.source).toBe("dumpshock");
    });
  });

  // =============================================================================
  // DAMAGE APPLICATION TESTS
  // =============================================================================

  describe("applyBiofeedbackDamage", () => {
    it("should apply stun damage to character", () => {
      const character = createTestCharacter({ willpower: 4, body: 4 });
      const result = applyBiofeedbackDamage(character, 3, "stun", "test");

      expect(result.damage).toBe(3);
      expect(result.damageType).toBe("stun");
      expect(result.characterStunDamage).toBe(3);
      expect(result.characterPhysicalDamage).toBe(0);
      expect(result.unconscious).toBe(false);
    });

    it("should apply physical damage to character", () => {
      const character = createTestCharacter({ willpower: 4, body: 4 });
      const result = applyBiofeedbackDamage(character, 4, "physical", "test");

      expect(result.characterStunDamage).toBe(0);
      expect(result.characterPhysicalDamage).toBe(4);
    });

    it("should overflow stun to physical", () => {
      const character = createTestCharacter({ willpower: 4, body: 4 });
      // Stun max = ceil(4/2) + 8 = 10
      const result = applyBiofeedbackDamage(character, 12, "stun", "test");

      expect(result.characterStunDamage).toBe(10); // Max stun
      expect(result.characterPhysicalDamage).toBe(2); // Overflow
    });

    it("should track overflow damage for physical", () => {
      const character = createTestCharacter({ body: 4 });
      // Physical max = ceil(4/2) + 8 = 10
      const result = applyBiofeedbackDamage(character, 12, "physical", "test");

      expect(result.characterPhysicalDamage).toBe(10);
      expect(result.overflow).toBe(2);
    });

    it("should detect unconsciousness at max stun", () => {
      const character = createTestCharacter({ willpower: 4 });
      // Stun max = ceil(4/2) + 8 = 10
      const result = applyBiofeedbackDamage(character, 10, "stun", "test");

      expect(result.unconscious).toBe(true);
    });

    it("should detect unconsciousness at max physical", () => {
      const character = createTestCharacter({ body: 4 });
      // Physical max = ceil(4/2) + 8 = 10
      const result = applyBiofeedbackDamage(character, 10, "physical", "test");

      expect(result.unconscious).toBe(true);
    });

    it("should detect death when overflow >= body", () => {
      const character = createTestCharacter({ body: 4 });
      // Physical max = 10, overflow needs to be >= body (4)
      const result = applyBiofeedbackDamage(character, 14, "physical", "test");

      expect(result.overflow).toBe(4);
      expect(result.dead).toBe(true);
    });

    it("should not be dead when overflow < body", () => {
      const character = createTestCharacter({ body: 5 });
      // Physical max = ceil(5/2) + 8 = 11
      const result = applyBiofeedbackDamage(character, 14, "physical", "test");

      expect(result.overflow).toBe(3);
      expect(result.dead).toBe(false);
    });

    it("should accumulate with existing damage", () => {
      const character = createTestCharacter({ willpower: 4 }) as Character;
      character.condition = { stunDamage: 5, physicalDamage: 0 };
      const result = applyBiofeedbackDamage(character, 3, "stun", "test");

      expect(result.characterStunDamage).toBe(8);
    });
  });

  describe("trackBiofeedbackDamage", () => {
    it("should add damage to rigging state", () => {
      const state = createTestRiggingState({ biofeedbackDamageTaken: 2 });
      const updated = trackBiofeedbackDamage(state, 3);

      expect(updated.biofeedbackDamageTaken).toBe(5);
    });
  });

  // =============================================================================
  // FORCED EJECTION TESTS
  // =============================================================================

  describe("handleForcedEjection", () => {
    it("should clear jumped-in state", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [createTestSlavedDrone("d1", { isJumpedIn: true })],
      });
      const state = createTestRiggingState({
        isJumpedIn: true,
        targetId: "d1",
        targetType: "drone",
        targetName: "Test Drone",
        droneNetwork: network,
      });
      const result = handleForcedEjection(state, "vehicle_destroyed");

      expect(result.riggingState.jumpedInState).toBeUndefined();
      expect(result.riggingState.isActive).toBe(false);
    });

    it("should apply dumpshock damage (6)", () => {
      const state = createTestRiggingState({ isJumpedIn: true, vrMode: "cold-sim" });
      const result = handleForcedEjection(state, "vehicle_destroyed");

      expect(result.dumpshockDamage).toBe(6);
    });

    it("should return stun damage for cold-sim", () => {
      const state = createTestRiggingState({ isJumpedIn: true, vrMode: "cold-sim" });
      const result = handleForcedEjection(state, "link_severed");

      expect(result.damageType).toBe("stun");
    });

    it("should return physical damage for hot-sim", () => {
      const state = createTestRiggingState({ isJumpedIn: true, vrMode: "hot-sim" });
      const result = handleForcedEjection(state, "jammed");

      expect(result.damageType).toBe("physical");
    });

    it("should mark rigger as disoriented", () => {
      const state = createTestRiggingState({ isJumpedIn: true });
      const result = handleForcedEjection(state, "ic_attack");

      expect(result.disoriented).toBe(true);
    });

    it("should track previous target", () => {
      const state = createTestRiggingState({
        isJumpedIn: true,
        targetName: "My Drone",
      });
      const result = handleForcedEjection(state, "vehicle_destroyed");

      expect(result.previousTarget).toBe("My Drone");
    });

    it("should update drone network to clear jumped-in flag", () => {
      const network = createTestDroneNetwork({
        slavedDrones: [createTestSlavedDrone("d1", { isJumpedIn: true, controlMode: "jumped-in" })],
      });
      const state = createTestRiggingState({
        isJumpedIn: true,
        targetId: "d1",
        targetType: "drone",
        droneNetwork: network,
      });
      const result = handleForcedEjection(state, "vehicle_destroyed");

      const drone = result.riggingState.droneNetwork?.slavedDrones.find((d) => d.droneId === "d1");
      expect(drone?.isJumpedIn).toBe(false);
      expect(drone?.controlMode).toBe("remote");
    });

    it("should preserve reason in result", () => {
      const state = createTestRiggingState({ isJumpedIn: true });
      const result = handleForcedEjection(state, "ic_attack");

      expect(result.reason).toBe("ic_attack");
    });
  });

  describe("createDumpshockResult", () => {
    it("should create dumpshock result for cold-sim", () => {
      const state = createTestRiggingState();
      const result = createDumpshockResult("cold-sim", state);

      expect(result.damage).toBe(6);
      expect(result.damageType).toBe("stun");
      expect(result.disoriented).toBe(true);
    });

    it("should create dumpshock result for hot-sim", () => {
      const state = createTestRiggingState();
      const result = createDumpshockResult("hot-sim", state);

      expect(result.damage).toBe(6);
      expect(result.damageType).toBe("physical");
    });
  });

  // =============================================================================
  // RESISTANCE CALCULATION TESTS
  // =============================================================================

  describe("calculateBiofeedbackResistancePool", () => {
    it("should return willpower + device rating", () => {
      expect(calculateBiofeedbackResistancePool(4, 3)).toBe(7);
      expect(calculateBiofeedbackResistancePool(6, 4)).toBe(10);
    });
  });

  describe("reduceBiofeedbackDamage", () => {
    it("should reduce damage by resistance hits", () => {
      expect(reduceBiofeedbackDamage(6, 2)).toBe(4);
      expect(reduceBiofeedbackDamage(6, 4)).toBe(2);
    });

    it("should not reduce below 0", () => {
      expect(reduceBiofeedbackDamage(3, 5)).toBe(0);
    });

    it("should handle 0 resistance hits", () => {
      expect(reduceBiofeedbackDamage(6, 0)).toBe(6);
    });
  });

  // =============================================================================
  // QUERY TESTS
  // =============================================================================

  describe("getTotalBiofeedbackDamage", () => {
    it("should return current biofeedback damage", () => {
      const state = createTestRiggingState({ biofeedbackDamageTaken: 7 });
      expect(getTotalBiofeedbackDamage(state)).toBe(7);
    });

    it("should return 0 for no damage", () => {
      const state = createTestRiggingState({ biofeedbackDamageTaken: 0 });
      expect(getTotalBiofeedbackDamage(state)).toBe(0);
    });
  });

  describe("isBiofeedbackDangerous", () => {
    it("should return true when stun damage >= 75% of max", () => {
      const character = createTestCharacter({ willpower: 4 }); // stun max = 10
      const state = createTestRiggingState({
        biofeedbackDamageTaken: 8,
        biofeedbackDamageType: "stun",
      });
      // 0 current + 8 = 8 >= 7.5 (75% of 10)
      expect(isBiofeedbackDangerous(state, character)).toBe(true);
    });

    it("should return false when stun damage < 75% of max", () => {
      const character = createTestCharacter({ willpower: 4 }); // stun max = 10
      const state = createTestRiggingState({
        biofeedbackDamageTaken: 6,
        biofeedbackDamageType: "stun",
      });
      expect(isBiofeedbackDangerous(state, character)).toBe(false);
    });

    it("should check physical when in hot-sim", () => {
      const character = createTestCharacter({ body: 4 }); // physical max = 10
      const state = createTestRiggingState({
        biofeedbackDamageTaken: 8,
        biofeedbackDamageType: "physical",
      });
      expect(isBiofeedbackDangerous(state, character)).toBe(true);
    });
  });

  describe("getBiofeedbackWarningLevel", () => {
    it("should return safe for < 25%", () => {
      const character = createTestCharacter({ willpower: 4 }); // stun max = 10
      const state = createTestRiggingState({
        biofeedbackDamageTaken: 2,
        biofeedbackDamageType: "stun",
      });
      expect(getBiofeedbackWarningLevel(state, character)).toBe("safe");
    });

    it("should return caution for 25-50%", () => {
      const character = createTestCharacter({ willpower: 4 }); // stun max = 10
      const state = createTestRiggingState({
        biofeedbackDamageTaken: 3,
        biofeedbackDamageType: "stun",
      });
      expect(getBiofeedbackWarningLevel(state, character)).toBe("caution");
    });

    it("should return danger for 50-75%", () => {
      const character = createTestCharacter({ willpower: 4 }); // stun max = 10
      const state = createTestRiggingState({
        biofeedbackDamageTaken: 6,
        biofeedbackDamageType: "stun",
      });
      expect(getBiofeedbackWarningLevel(state, character)).toBe("danger");
    });

    it("should return critical for >= 75%", () => {
      const character = createTestCharacter({ willpower: 4 }); // stun max = 10
      const state = createTestRiggingState({
        biofeedbackDamageTaken: 8,
        biofeedbackDamageType: "stun",
      });
      expect(getBiofeedbackWarningLevel(state, character)).toBe("critical");
    });
  });

  // =============================================================================
  // HOT-SIM WARNING TESTS
  // =============================================================================

  describe("shouldWarnAboutHotSim", () => {
    it("should return true when jumped in with hot-sim", () => {
      const state = createTestRiggingState({ isJumpedIn: true, vrMode: "hot-sim" });
      expect(shouldWarnAboutHotSim(state)).toBe(true);
    });

    it("should return false when jumped in with cold-sim", () => {
      const state = createTestRiggingState({ isJumpedIn: true, vrMode: "cold-sim" });
      expect(shouldWarnAboutHotSim(state)).toBe(false);
    });

    it("should return false when not jumped in", () => {
      const state = createTestRiggingState({ isJumpedIn: false });
      expect(shouldWarnAboutHotSim(state)).toBe(false);
    });
  });

  describe("getHotSimRiskDescription", () => {
    it("should return a warning about hot-sim", () => {
      const description = getHotSimRiskDescription();
      expect(description).toContain("PHYSICAL");
      expect(description).toContain("6P");
    });
  });

  describe("getColdSimBenefitsDescription", () => {
    it("should return description of cold-sim benefits", () => {
      const description = getColdSimBenefitsDescription();
      expect(description).toContain("stun");
      expect(description).toContain("6S");
    });
  });
});
