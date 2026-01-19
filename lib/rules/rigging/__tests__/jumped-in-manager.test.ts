import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  validateJumpIn,
  jumpIn,
  jumpOut,
  calculateJumpedInInitiative,
  getInitiativeDice,
  isJumpedIn,
  getJumpedInTarget,
  getCurrentVRMode,
  getJumpedInControlBonus,
  isBodyVulnerable,
  getJumpedInDuration,
  switchVRMode,
  isHotSim,
  isColdSim,
} from "../jumped-in-manager";
import {
  createTestCharacter,
  createTestRiggingState,
  createTestDroneNetwork,
  createTestSlavedDrone,
  createTestRCCConfiguration,
  createTestJumpedInState,
} from "./fixtures";
import { JUMPED_IN_INITIATIVE_BONUS, JUMPED_IN_HOTSIM_INITIATIVE_BONUS } from "@/lib/types/rigging";

// =============================================================================
// JUMP-IN VALIDATION TESTS
// =============================================================================

describe("jumped-in-manager", () => {
  describe("validateJumpIn", () => {
    it("should return valid for character with VCR and no issues", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      const result = validateJumpIn(character, riggingState, "vehicle-1", "vehicle");

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return invalid for character without VCR", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      const result = validateJumpIn(character, riggingState, "vehicle-1", "vehicle");

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "NO_VCR")).toBe(true);
    });

    it("should return invalid when already jumped in", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        targetName: "Current Vehicle",
      });

      const result = validateJumpIn(character, riggingState, "vehicle-2", "vehicle");

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "ALREADY_JUMPED_IN")).toBe(true);
      expect(result.errors[0].message).toContain("Current Vehicle");
    });

    it("should return invalid when drone is not slaved to network", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({
        isJumpedIn: false,
        droneNetwork: createTestDroneNetwork({
          slavedDrones: [createTestSlavedDrone("drone-1")],
        }),
      });

      const result = validateJumpIn(character, riggingState, "drone-2", "drone");

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "DRONE_NOT_SLAVED")).toBe(true);
    });

    it("should return valid when drone is slaved to network", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({
        isJumpedIn: false,
        droneNetwork: createTestDroneNetwork({
          slavedDrones: [createTestSlavedDrone("drone-1")],
        }),
      });

      const result = validateJumpIn(character, riggingState, "drone-1", "drone");

      expect(result.valid).toBe(true);
    });

    it("should warn when jumping into drone without RCC", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({
        isJumpedIn: false,
        rccConfig: undefined,
        droneNetwork: undefined,
      });

      const result = validateJumpIn(character, riggingState, "drone-1", "drone");

      expect(result.valid).toBe(true);
      expect(result.warnings.some((w) => w.code === "NO_RCC_FOR_DRONE")).toBe(true);
    });

    it("should not warn when targeting a vehicle", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({
        isJumpedIn: false,
        rccConfig: undefined,
      });

      const result = validateJumpIn(character, riggingState, "vehicle-1", "vehicle");

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it("should return multiple errors when multiple issues exist", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        targetName: "Current Vehicle",
      });

      const result = validateJumpIn(character, riggingState, "vehicle-2", "vehicle");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(result.errors.some((e) => e.code === "NO_VCR")).toBe(true);
      expect(result.errors.some((e) => e.code === "ALREADY_JUMPED_IN")).toBe(true);
    });
  });

  // =============================================================================
  // JUMP-IN OPERATION TESTS
  // =============================================================================

  describe("jumpIn", () => {
    it("should successfully jump into a vehicle", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      const result = jumpIn(
        character,
        riggingState,
        "vehicle-1",
        "vehicle",
        "Test Vehicle",
        "cold-sim"
      );

      expect(result.success).toBe(true);
      expect(result.jumpedInState).not.toBeNull();
      expect(result.jumpedInState!.isActive).toBe(true);
      expect(result.jumpedInState!.targetId).toBe("vehicle-1");
      expect(result.jumpedInState!.targetType).toBe("vehicle");
      expect(result.jumpedInState!.targetName).toBe("Test Vehicle");
      expect(result.jumpedInState!.vrMode).toBe("cold-sim");
      expect(result.errors).toHaveLength(0);
    });

    it("should successfully jump into a drone and update network", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({
        isJumpedIn: false,
        droneNetwork: createTestDroneNetwork({
          slavedDrones: [
            createTestSlavedDrone("drone-1", { isJumpedIn: false, controlMode: "remote" }),
          ],
        }),
      });

      const result = jumpIn(character, riggingState, "drone-1", "drone", "Test Drone", "hot-sim");

      expect(result.success).toBe(true);
      expect(result.jumpedInState!.targetType).toBe("drone");
      expect(result.jumpedInState!.vrMode).toBe("hot-sim");

      // Check drone network was updated
      const drone = result.riggingState.droneNetwork!.slavedDrones.find(
        (d) => d.droneId === "drone-1"
      );
      expect(drone).toBeDefined();
      expect(drone!.isJumpedIn).toBe(true);
      expect(drone!.controlMode).toBe("jumped-in");
    });

    it("should fail to jump in without VCR", () => {
      const character = createTestCharacter({ hasVCR: false });
      character.cyberware = [];
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      const result = jumpIn(
        character,
        riggingState,
        "vehicle-1",
        "vehicle",
        "Test Vehicle",
        "cold-sim"
      );

      expect(result.success).toBe(false);
      expect(result.jumpedInState).toBeNull();
      expect(result.errors.some((e) => e.code === "NO_VCR")).toBe(true);
    });

    it("should fail when already jumped in", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({ isJumpedIn: true });

      const result = jumpIn(
        character,
        riggingState,
        "vehicle-2",
        "vehicle",
        "New Vehicle",
        "cold-sim"
      );

      expect(result.success).toBe(false);
      expect(result.jumpedInState).toBeNull();
      expect(result.errors.some((e) => e.code === "ALREADY_JUMPED_IN")).toBe(true);
    });

    it("should set biofeedback damage type based on VR mode", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingStateCold = createTestRiggingState({ isJumpedIn: false });
      const riggingStateHot = createTestRiggingState({ isJumpedIn: false });

      const coldResult = jumpIn(
        character,
        riggingStateCold,
        "vehicle-1",
        "vehicle",
        "Test",
        "cold-sim"
      );
      const hotResult = jumpIn(
        character,
        riggingStateHot,
        "vehicle-2",
        "vehicle",
        "Test",
        "hot-sim"
      );

      expect(coldResult.riggingState.biofeedbackDamageType).toBe("stun");
      expect(hotResult.riggingState.biofeedbackDamageType).toBe("physical");
    });

    it("should set body vulnerable when jumping in", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      const result = jumpIn(character, riggingState, "vehicle-1", "vehicle", "Test", "cold-sim");

      expect(result.jumpedInState!.bodyVulnerable).toBe(true);
    });

    it("should use VCR rating for control bonus", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 3 });
      const riggingState = createTestRiggingState({ isJumpedIn: false, vcrRating: 3 });

      const result = jumpIn(character, riggingState, "vehicle-1", "vehicle", "Test", "cold-sim");

      expect(result.jumpedInState!.vcrRating).toBe(3);
      expect(result.jumpedInState!.controlBonus).toBe(3);
    });

    it("should set initiative dice bonus based on VR mode", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingStateCold = createTestRiggingState({ isJumpedIn: false });
      const riggingStateHot = createTestRiggingState({ isJumpedIn: false });

      const coldResult = jumpIn(character, riggingStateCold, "v1", "vehicle", "Test", "cold-sim");
      const hotResult = jumpIn(character, riggingStateHot, "v2", "vehicle", "Test", "hot-sim");

      expect(coldResult.jumpedInState!.initiativeDiceBonus).toBe(JUMPED_IN_INITIATIVE_BONUS);
      expect(hotResult.jumpedInState!.initiativeDiceBonus).toBe(JUMPED_IN_HOTSIM_INITIATIVE_BONUS);
    });

    it("should record timestamp when jumping in", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      const before = new Date().toISOString();
      const result = jumpIn(character, riggingState, "vehicle-1", "vehicle", "Test", "cold-sim");
      const after = new Date().toISOString();

      expect(result.jumpedInState!.jumpedInAt).toBeDefined();
      expect(result.jumpedInState!.jumpedInAt >= before).toBe(true);
      expect(result.jumpedInState!.jumpedInAt <= after).toBe(true);
    });

    it("should include warnings in successful result", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({
        isJumpedIn: false,
        rccConfig: undefined,
        droneNetwork: undefined,
      });

      const result = jumpIn(character, riggingState, "drone-1", "drone", "Test Drone", "cold-sim");

      expect(result.success).toBe(true);
      expect(result.warnings.some((w) => w.code === "NO_RCC_FOR_DRONE")).toBe(true);
    });
  });

  // =============================================================================
  // JUMP-OUT OPERATION TESTS
  // =============================================================================

  describe("jumpOut", () => {
    it("should successfully jump out of vehicle", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        targetType: "vehicle",
        targetName: "Test Vehicle",
      });

      const result = jumpOut(riggingState);

      expect(result.success).toBe(true);
      expect(result.riggingState.jumpedInState).toBeUndefined();
    });

    it("should return previous state when jumping out", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        targetId: "vehicle-1",
        targetType: "vehicle",
        targetName: "Test Vehicle",
      });

      const result = jumpOut(riggingState);

      expect(result.previousState).not.toBeNull();
      expect(result.previousState!.targetId).toBe("vehicle-1");
      expect(result.previousState!.targetName).toBe("Test Vehicle");
    });

    it("should update drone network when jumping out of drone", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        targetId: "drone-1",
        targetType: "drone",
        targetName: "Test Drone",
        droneNetwork: createTestDroneNetwork({
          slavedDrones: [
            createTestSlavedDrone("drone-1", { isJumpedIn: true, controlMode: "jumped-in" }),
          ],
        }),
      });

      const result = jumpOut(riggingState);

      const drone = result.riggingState.droneNetwork!.slavedDrones.find(
        (d) => d.droneId === "drone-1"
      );
      expect(drone).toBeDefined();
      expect(drone!.isJumpedIn).toBe(false);
      expect(drone!.controlMode).toBe("remote");
    });

    it("should reset biofeedback damage on clean exit", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        biofeedbackDamageTaken: 5,
      });

      const result = jumpOut(riggingState);

      expect(result.riggingState.biofeedbackDamageTaken).toBe(0);
    });

    it("should handle jump out when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      const result = jumpOut(riggingState);

      expect(result.success).toBe(true);
      expect(result.previousState).toBeNull();
    });

    it("should not modify other drones in network when jumping out", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        targetId: "drone-1",
        targetType: "drone",
        droneNetwork: createTestDroneNetwork({
          slavedDrones: [
            createTestSlavedDrone("drone-1", { isJumpedIn: true, controlMode: "jumped-in" }),
            createTestSlavedDrone("drone-2", { isJumpedIn: false, controlMode: "remote" }),
          ],
        }),
      });

      const result = jumpOut(riggingState);

      const drone2 = result.riggingState.droneNetwork!.slavedDrones.find(
        (d) => d.droneId === "drone-2"
      );
      expect(drone2!.isJumpedIn).toBe(false);
      expect(drone2!.controlMode).toBe("remote");
    });
  });

  // =============================================================================
  // INITIATIVE CALCULATION TESTS
  // =============================================================================

  describe("calculateJumpedInInitiative", () => {
    it("should calculate initiative for cold-sim", () => {
      const result = calculateJumpedInInitiative(4, 5, 2, "cold-sim");

      expect(result.initiative).toBe(11); // 4 + 5 + 2
      expect(result.initiativeDice).toBe(1 + JUMPED_IN_INITIATIVE_BONUS);
      expect(result.breakdown.reactionBonus).toBe(4);
      expect(result.breakdown.intuitionBonus).toBe(5);
      expect(result.breakdown.vcrBonus).toBe(2);
      expect(result.breakdown.vrModeBonus).toBe(JUMPED_IN_INITIATIVE_BONUS);
    });

    it("should calculate initiative for hot-sim", () => {
      const result = calculateJumpedInInitiative(4, 5, 2, "hot-sim");

      expect(result.initiative).toBe(11); // 4 + 5 + 2
      expect(result.initiativeDice).toBe(1 + JUMPED_IN_HOTSIM_INITIATIVE_BONUS);
      expect(result.breakdown.vrModeBonus).toBe(JUMPED_IN_HOTSIM_INITIATIVE_BONUS);
    });

    it("should scale with VCR rating", () => {
      const result1 = calculateJumpedInInitiative(4, 4, 1, "cold-sim");
      const result2 = calculateJumpedInInitiative(4, 4, 2, "cold-sim");
      const result3 = calculateJumpedInInitiative(4, 4, 3, "cold-sim");

      expect(result1.initiative).toBe(9);
      expect(result2.initiative).toBe(10);
      expect(result3.initiative).toBe(11);
    });

    it("should scale with reaction attribute", () => {
      const result1 = calculateJumpedInInitiative(3, 4, 2, "cold-sim");
      const result2 = calculateJumpedInInitiative(6, 4, 2, "cold-sim");

      expect(result2.initiative - result1.initiative).toBe(3);
    });

    it("should scale with intuition attribute", () => {
      const result1 = calculateJumpedInInitiative(4, 3, 2, "cold-sim");
      const result2 = calculateJumpedInInitiative(4, 6, 2, "cold-sim");

      expect(result2.initiative - result1.initiative).toBe(3);
    });

    it("should provide correct breakdown", () => {
      const result = calculateJumpedInInitiative(5, 6, 3, "hot-sim");

      expect(result.breakdown.base).toBe(14);
      expect(result.breakdown.reactionBonus).toBe(5);
      expect(result.breakdown.intuitionBonus).toBe(6);
      expect(result.breakdown.vcrBonus).toBe(3);
    });
  });

  describe("getInitiativeDice", () => {
    it("should return 2D6 for cold-sim (1 base + 1 bonus)", () => {
      expect(getInitiativeDice("cold-sim")).toBe(1 + JUMPED_IN_INITIATIVE_BONUS);
    });

    it("should return 3D6 for hot-sim (1 base + 2 bonus)", () => {
      expect(getInitiativeDice("hot-sim")).toBe(1 + JUMPED_IN_HOTSIM_INITIATIVE_BONUS);
    });
  });

  // =============================================================================
  // STATE QUERY TESTS
  // =============================================================================

  describe("isJumpedIn", () => {
    it("should return true when jumped in and active", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: true });

      expect(isJumpedIn(riggingState)).toBe(true);
    });

    it("should return false when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      expect(isJumpedIn(riggingState)).toBe(false);
    });

    it("should return false when jumpedInState is undefined", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });
      riggingState.jumpedInState = undefined;

      expect(isJumpedIn(riggingState)).toBe(false);
    });

    it("should return false when isActive is false", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: true });
      riggingState.jumpedInState!.isActive = false;

      expect(isJumpedIn(riggingState)).toBe(false);
    });
  });

  describe("getJumpedInTarget", () => {
    it("should return target info when jumped in", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        targetId: "vehicle-1",
        targetType: "vehicle",
        targetName: "Test Vehicle",
      });

      const target = getJumpedInTarget(riggingState);

      expect(target).not.toBeNull();
      expect(target!.targetId).toBe("vehicle-1");
      expect(target!.targetType).toBe("vehicle");
      expect(target!.targetName).toBe("Test Vehicle");
    });

    it("should return null when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      expect(getJumpedInTarget(riggingState)).toBeNull();
    });

    it("should return null when isActive is false", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: true });
      riggingState.jumpedInState!.isActive = false;

      expect(getJumpedInTarget(riggingState)).toBeNull();
    });
  });

  describe("getCurrentVRMode", () => {
    it("should return cold-sim when in cold-sim mode", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vrMode: "cold-sim",
      });

      expect(getCurrentVRMode(riggingState)).toBe("cold-sim");
    });

    it("should return hot-sim when in hot-sim mode", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vrMode: "hot-sim",
      });

      expect(getCurrentVRMode(riggingState)).toBe("hot-sim");
    });

    it("should return null when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      expect(getCurrentVRMode(riggingState)).toBeNull();
    });
  });

  describe("getJumpedInControlBonus", () => {
    it("should return control bonus when jumped in", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vcrRating: 2,
      });

      expect(getJumpedInControlBonus(riggingState)).toBe(2);
    });

    it("should return 0 when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      expect(getJumpedInControlBonus(riggingState)).toBe(0);
    });

    it("should return VCR rating as control bonus", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vcrRating: 3,
      });

      expect(getJumpedInControlBonus(riggingState)).toBe(3);
    });
  });

  describe("isBodyVulnerable", () => {
    it("should return true when jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: true });

      expect(isBodyVulnerable(riggingState)).toBe(true);
    });

    it("should return false when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      expect(isBodyVulnerable(riggingState)).toBe(false);
    });
  });

  describe("getJumpedInDuration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return 0 when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      expect(getJumpedInDuration(riggingState)).toBe(0);
    });

    it("should return duration in milliseconds", () => {
      vi.setSystemTime(new Date("2024-01-01T12:00:00Z"));
      const riggingState = createTestRiggingState({ isJumpedIn: true });
      riggingState.jumpedInState!.jumpedInAt = "2024-01-01T12:00:00Z";

      // Advance time by 5 seconds
      vi.setSystemTime(new Date("2024-01-01T12:00:05Z"));

      expect(getJumpedInDuration(riggingState)).toBe(5000);
    });

    it("should return correct duration after longer period", () => {
      vi.setSystemTime(new Date("2024-01-01T12:00:00Z"));
      const riggingState = createTestRiggingState({ isJumpedIn: true });
      riggingState.jumpedInState!.jumpedInAt = "2024-01-01T12:00:00Z";

      // Advance time by 1 hour
      vi.setSystemTime(new Date("2024-01-01T13:00:00Z"));

      expect(getJumpedInDuration(riggingState)).toBe(3600000);
    });

    it("should return 0 when jumpedInAt is missing", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: true });
      riggingState.jumpedInState!.jumpedInAt = undefined as unknown as string;

      expect(getJumpedInDuration(riggingState)).toBe(0);
    });
  });

  // =============================================================================
  // VR MODE UTILITIES TESTS
  // =============================================================================

  describe("switchVRMode", () => {
    it("should switch from cold-sim to hot-sim", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vrMode: "cold-sim",
      });

      const result = switchVRMode(riggingState, "hot-sim");

      expect(result.jumpedInState!.vrMode).toBe("hot-sim");
      expect(result.biofeedbackDamageType).toBe("physical");
      expect(result.jumpedInState!.initiativeDiceBonus).toBe(JUMPED_IN_HOTSIM_INITIATIVE_BONUS);
    });

    it("should switch from hot-sim to cold-sim", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vrMode: "hot-sim",
      });

      const result = switchVRMode(riggingState, "cold-sim");

      expect(result.jumpedInState!.vrMode).toBe("cold-sim");
      expect(result.biofeedbackDamageType).toBe("stun");
      expect(result.jumpedInState!.initiativeDiceBonus).toBe(JUMPED_IN_INITIATIVE_BONUS);
    });

    it("should return unchanged state when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      const result = switchVRMode(riggingState, "hot-sim");

      expect(result).toEqual(riggingState);
    });

    it("should preserve other state when switching", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vrMode: "cold-sim",
        targetId: "vehicle-1",
        targetName: "Test Vehicle",
      });

      const result = switchVRMode(riggingState, "hot-sim");

      expect(result.jumpedInState!.targetId).toBe("vehicle-1");
      expect(result.jumpedInState!.targetName).toBe("Test Vehicle");
    });
  });

  describe("isHotSim", () => {
    it("should return true when in hot-sim mode", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vrMode: "hot-sim",
      });

      expect(isHotSim(riggingState)).toBe(true);
    });

    it("should return false when in cold-sim mode", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vrMode: "cold-sim",
      });

      expect(isHotSim(riggingState)).toBe(false);
    });

    it("should return false when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      expect(isHotSim(riggingState)).toBe(false);
    });
  });

  describe("isColdSim", () => {
    it("should return true when in cold-sim mode", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vrMode: "cold-sim",
      });

      expect(isColdSim(riggingState)).toBe(true);
    });

    it("should return false when in hot-sim mode", () => {
      const riggingState = createTestRiggingState({
        isJumpedIn: true,
        vrMode: "hot-sim",
      });

      expect(isColdSim(riggingState)).toBe(false);
    });

    it("should return false when not jumped in", () => {
      const riggingState = createTestRiggingState({ isJumpedIn: false });

      expect(isColdSim(riggingState)).toBe(false);
    });
  });
});
