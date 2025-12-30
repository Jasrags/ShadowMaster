import { describe, it, expect } from "vitest";
import {
  requiresJumpedIn,
  canPerformRemotely,
  getTestTypeForAction,
  getSkillForAction,
  getAutosoftCategoriesForAction,
  validateVehicleAction,
  getControlModeBonus,
  getApplicableAutosofts,
  validateDroneCommand,
  getLimitTypeForTest,
  getControlModeDescription,
  getActionTypeDescription,
} from "../action-validator";
import type { Character } from "@/lib/types/character";
import type {
  RiggingState,
  SlavedDrone,
  SharedAutosoft,
  VehicleControlRig,
  DroneNetwork,
  RCCConfiguration,
  JumpedInState,
} from "@/lib/types/rigging";

// =============================================================================
// TEST FIXTURES
// =============================================================================

/**
 * Create a minimal test character
 */
function createTestCharacter(options: {
  hasVCR?: boolean;
  vcrRating?: number;
  hasRCC?: boolean;
} = {}): Character {
  const char: Character = {
    id: "test-char-1",
    ownerId: "test-user-1",
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    attachedBookIds: ["core"],
    name: "Test Rigger",
    metatype: "Human",
    status: "active",
    attributes: {
      body: 3,
      agility: 4,
      reaction: 5,
      strength: 3,
      willpower: 3,
      logic: 4,
      intuition: 4,
      charisma: 3,
    },
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    skills: {
      pilot_ground_craft: 4,
      pilot_aircraft: 3,
      gunnery: 3,
      perception: 4,
    },
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: { physicalDamage: 0, stunDamage: 0 },
    karmaTotal: 0,
    karmaCurrent: 0,
    karmaSpentAtCreation: 0,
    createdAt: new Date().toISOString(),
    cyberware: [],
    rccs: [],
    drones: [],
  };

  // Add VCR if requested
  if (options.hasVCR) {
    char.cyberware = [
      {
        catalogId: "vehicle-control-rig",
        name: "Vehicle Control Rig",
        category: "headware",
        grade: "standard",
        baseEssenceCost: 1,
        essenceCost: 1,
        cost: 40000,
        availability: 4,
        rating: options.vcrRating || 1,
      },
    ];
  }

  // Add RCC if requested
  if (options.hasRCC) {
    char.rccs = [
      {
        id: "rcc-1",
        catalogId: "compuforce-taskmaster",
        name: "Compuforce Taskmaster",
        deviceRating: 4,
        dataProcessing: 4,
        firewall: 3,
        cost: 10000,
        availability: 8,
      },
    ];
  }

  return char;
}

/**
 * Create a test rigging state
 */
function createTestRiggingState(options: {
  hasVCR?: boolean;
  vcrRating?: number;
  hasRCC?: boolean;
  isJumpedIn?: boolean;
  jumpedIntoId?: string;
  droneIds?: string[];
} = {}): RiggingState {
  const state: RiggingState = {
    sessionId: "test-session-1",
    characterId: "test-char-1",
    startedAt: new Date().toISOString(),
    biofeedbackDamageTaken: 0,
    biofeedbackDamageType: "stun",
    isActive: true,
  };

  // Add VCR
  if (options.hasVCR) {
    const vcr: VehicleControlRig = {
      rating: options.vcrRating || 1,
      controlBonus: options.vcrRating || 1,
      initiativeDiceBonus: options.vcrRating || 1,
      essenceCost: 1,
    };
    state.vcr = vcr;
  }

  // Add RCC config
  if (options.hasRCC) {
    const rccConfig: RCCConfiguration = {
      rccId: "rcc-1",
      name: "Compuforce Taskmaster",
      deviceRating: 4,
      dataProcessing: 4,
      firewall: 3,
      maxSlavedDrones: 12,
      slavedDroneIds: options.droneIds || [],
      runningAutosofts: [],
      noiseReduction: 2,
      sharingBonus: 1,
    };
    state.rccConfig = rccConfig;
  }

  // Add drone network
  if (options.droneIds && options.droneIds.length > 0) {
    const slavedDrones: SlavedDrone[] = options.droneIds.map((id, index) => ({
      droneId: id,
      catalogId: `drone-catalog-${index}`,
      name: `Test Drone ${index + 1}`,
      pilotRating: 3,
      controlMode: "remote" as const,
      isJumpedIn: false,
      conditionDamageTaken: 0,
      conditionMonitorMax: 8,
      distanceFromRigger: 100,
      noisePenalty: 0,
      installedAutosofts: [],
    }));

    const network: DroneNetwork = {
      networkId: "network-1",
      rccId: "rcc-1",
      slavedDrones,
      maxDrones: 12,
      sharedAutosofts: [],
      baseNoise: 0,
    };
    state.droneNetwork = network;
  }

  // Add jumped-in state
  if (options.isJumpedIn && options.jumpedIntoId) {
    const jumpedIn: JumpedInState = {
      isActive: true,
      targetId: options.jumpedIntoId,
      targetType: "drone",
      targetName: "Test Drone",
      vrMode: "cold-sim",
      jumpedInAt: new Date().toISOString(),
      vcrRating: options.vcrRating || 1,
      controlBonus: options.vcrRating || 1,
      initiativeDiceBonus: options.vcrRating || 1,
      bodyVulnerable: true,
    };
    state.jumpedInState = jumpedIn;
  }

  return state;
}

/**
 * Create a test slaved drone
 */
function createTestDrone(id: string, options: {
  noisePenalty?: number;
  autosofts?: SharedAutosoft[];
} = {}): SlavedDrone {
  return {
    droneId: id,
    catalogId: "test-drone-catalog",
    name: "Test Drone",
    pilotRating: 3,
    controlMode: "remote",
    isJumpedIn: false,
    conditionDamageTaken: 0,
    conditionMonitorMax: 8,
    distanceFromRigger: 100,
    noisePenalty: options.noisePenalty || 0,
    installedAutosofts: options.autosofts?.map(a => ({
      autosoftId: a.autosoftId,
      name: a.name,
      rating: a.rating,
      category: a.category,
      target: a.target,
    })) || [],
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("action-validator", () => {
  describe("requiresJumpedIn", () => {
    it("should return true for stunt action", () => {
      expect(requiresJumpedIn("stunt")).toBe(true);
    });

    it("should return true for ram action", () => {
      expect(requiresJumpedIn("ram")).toBe(true);
    });

    it("should return true for evasive_driving action", () => {
      expect(requiresJumpedIn("evasive_driving")).toBe(true);
    });

    it("should return false for accelerate action", () => {
      expect(requiresJumpedIn("accelerate")).toBe(false);
    });

    it("should return false for fire_weapon action", () => {
      expect(requiresJumpedIn("fire_weapon")).toBe(false);
    });
  });

  describe("canPerformRemotely", () => {
    it("should return true for accelerate action", () => {
      expect(canPerformRemotely("accelerate")).toBe(true);
    });

    it("should return true for fire_weapon action", () => {
      expect(canPerformRemotely("fire_weapon")).toBe(true);
    });

    it("should return false for stunt action", () => {
      expect(canPerformRemotely("stunt")).toBe(false);
    });
  });

  describe("getTestTypeForAction", () => {
    it("should return control for accelerate", () => {
      expect(getTestTypeForAction("accelerate")).toBe("control");
    });

    it("should return chase for catch_up", () => {
      expect(getTestTypeForAction("catch_up")).toBe("chase");
    });

    it("should return stunt for stunt", () => {
      expect(getTestTypeForAction("stunt")).toBe("stunt");
    });

    it("should return gunnery for fire_weapon", () => {
      expect(getTestTypeForAction("fire_weapon")).toBe("gunnery");
    });

    it("should return sensor for sensor_targeting", () => {
      expect(getTestTypeForAction("sensor_targeting")).toBe("sensor");
    });
  });

  describe("getSkillForAction", () => {
    it("should return pilot for accelerate", () => {
      expect(getSkillForAction("accelerate")).toBe("pilot");
    });

    it("should return gunnery for fire_weapon", () => {
      expect(getSkillForAction("fire_weapon")).toBe("gunnery");
    });

    it("should return perception for sensor_targeting", () => {
      expect(getSkillForAction("sensor_targeting")).toBe("perception");
    });
  });

  describe("getAutosoftCategoriesForAction", () => {
    it("should return movement for accelerate", () => {
      expect(getAutosoftCategoriesForAction("accelerate")).toEqual(["movement"]);
    });

    it("should return combat for fire_weapon", () => {
      expect(getAutosoftCategoriesForAction("fire_weapon")).toEqual(["combat"]);
    });

    it("should return movement and defense for evasive_driving", () => {
      expect(getAutosoftCategoriesForAction("evasive_driving")).toEqual(["movement", "defense"]);
    });
  });

  describe("getControlModeBonus", () => {
    it("should return 0 for manual mode", () => {
      expect(getControlModeBonus("manual")).toBe(0);
    });

    it("should return 0 for remote mode", () => {
      expect(getControlModeBonus("remote")).toBe(0);
    });

    it("should return VCR rating for jumped-in mode", () => {
      expect(getControlModeBonus("jumped-in", 2)).toBe(2);
      expect(getControlModeBonus("jumped-in", 3)).toBe(3);
    });

    it("should return 0 for jumped-in mode without VCR rating", () => {
      expect(getControlModeBonus("jumped-in")).toBe(0);
    });
  });

  describe("getLimitTypeForTest", () => {
    it("should return handling for control tests", () => {
      expect(getLimitTypeForTest("control")).toBe("handling");
    });

    it("should return handling for stunt tests", () => {
      expect(getLimitTypeForTest("stunt")).toBe("handling");
    });

    it("should return speed for ramming tests", () => {
      expect(getLimitTypeForTest("ramming")).toBe("speed");
    });

    it("should return sensor for sensor tests", () => {
      expect(getLimitTypeForTest("sensor")).toBe("sensor");
    });

    it("should return sensor for gunnery tests", () => {
      expect(getLimitTypeForTest("gunnery")).toBe("sensor");
    });
  });

  describe("getControlModeDescription", () => {
    it("should describe manual mode", () => {
      expect(getControlModeDescription("manual")).toBe("Manual Control");
    });

    it("should describe remote mode", () => {
      expect(getControlModeDescription("remote")).toBe("Remote Control (AR)");
    });

    it("should describe jumped-in mode", () => {
      expect(getControlModeDescription("jumped-in")).toBe("Jumped In (VR)");
    });
  });

  describe("getActionTypeDescription", () => {
    it("should describe accelerate", () => {
      expect(getActionTypeDescription("accelerate")).toBe("Accelerate");
    });

    it("should describe ram", () => {
      expect(getActionTypeDescription("ram")).toBe("Ram");
    });

    it("should describe fire_weapon", () => {
      expect(getActionTypeDescription("fire_weapon")).toBe("Fire Vehicle Weapon");
    });
  });

  describe("validateVehicleAction", () => {
    it("should validate action without rigging state for non-jumped-in action", () => {
      const character = createTestCharacter();
      const result = validateVehicleAction(
        character,
        undefined,
        "accelerate",
        "vehicle-1"
      );

      expect(result.valid).toBe(true);
      expect(result.controlMode).toBe("manual");
      expect(result.requiresJumpedIn).toBe(false);
    });

    it("should reject jumped-in required action without rigging state", () => {
      const character = createTestCharacter();
      const result = validateVehicleAction(
        character,
        undefined,
        "stunt",
        "vehicle-1"
      );

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe("NO_RIGGING_STATE");
    });

    it("should validate jumped-in action when character is jumped in", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 2 });
      const riggingState = createTestRiggingState({
        hasVCR: true,
        vcrRating: 2,
        isJumpedIn: true,
        jumpedIntoId: "drone-1",
      });

      const result = validateVehicleAction(
        character,
        riggingState,
        "stunt",
        "drone-1"
      );

      expect(result.valid).toBe(true);
      expect(result.controlMode).toBe("jumped-in");
    });

    it("should reject jumped-in action when character is not jumped in", () => {
      const character = createTestCharacter({ hasVCR: true, hasRCC: true });
      const riggingState = createTestRiggingState({
        hasVCR: true,
        hasRCC: true,
        droneIds: ["drone-1"],
      });

      const result = validateVehicleAction(
        character,
        riggingState,
        "stunt",
        "drone-1"
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === "REQUIRES_JUMPED_IN")).toBe(true);
    });

    it("should include VCR control bonus when jumped in", () => {
      const character = createTestCharacter({ hasVCR: true, vcrRating: 3 });
      const riggingState = createTestRiggingState({
        hasVCR: true,
        vcrRating: 3,
        isJumpedIn: true,
        jumpedIntoId: "drone-1",
      });

      const result = validateVehicleAction(
        character,
        riggingState,
        "accelerate",
        "drone-1"
      );

      expect(result.valid).toBe(true);
      expect(result.applicableBonuses.some(b => b.source === "Vehicle Control Rig")).toBe(true);
      expect(result.applicableBonuses.find(b => b.source === "Vehicle Control Rig")?.value).toBe(3);
    });

    it("should use remote control mode when not jumped in but has RCC", () => {
      const character = createTestCharacter({ hasRCC: true });
      const riggingState = createTestRiggingState({
        hasRCC: true,
        droneIds: ["drone-1"],
      });

      const result = validateVehicleAction(
        character,
        riggingState,
        "accelerate",
        "drone-1"
      );

      expect(result.valid).toBe(true);
      expect(result.controlMode).toBe("remote");
    });
  });

  describe("validateDroneCommand", () => {
    it("should reject command without rigging state", () => {
      const character = createTestCharacter();
      const result = validateDroneCommand(
        character,
        undefined,
        "drone-1",
        "attack"
      );

      expect(result.valid).toBe(false);
      expect(result.errors[0].code).toBe("NO_RIGGING_STATE");
    });

    it("should reject command without drone network", () => {
      const character = createTestCharacter({ hasRCC: true });
      const riggingState = createTestRiggingState({ hasRCC: true });
      // No drone network

      const result = validateDroneCommand(
        character,
        riggingState,
        "drone-1",
        "attack"
      );

      expect(result.valid).toBe(false);
      expect(result.errors[0].code).toBe("NO_DRONE_NETWORK");
    });

    it("should reject command to drone not in network", () => {
      const character = createTestCharacter({ hasRCC: true });
      const riggingState = createTestRiggingState({
        hasRCC: true,
        droneIds: ["drone-1"],
      });

      const result = validateDroneCommand(
        character,
        riggingState,
        "drone-2", // Not in network
        "attack"
      );

      expect(result.valid).toBe(false);
      expect(result.errors[0].code).toBe("DRONE_NOT_SLAVED");
    });

    it("should validate command to slaved drone", () => {
      const character = createTestCharacter({ hasRCC: true });
      const riggingState = createTestRiggingState({
        hasRCC: true,
        droneIds: ["drone-1"],
      });

      const result = validateDroneCommand(
        character,
        riggingState,
        "drone-1",
        "attack"
      );

      expect(result.valid).toBe(true);
    });
  });

  describe("getApplicableAutosofts", () => {
    it("should return empty array when no autosofts match", () => {
      const drone = createTestDrone("drone-1");
      const result = getApplicableAutosofts("accelerate", drone, []);

      expect(result).toHaveLength(0);
    });

    it("should return matching autosofts from drone", () => {
      const autosofts: SharedAutosoft[] = [
        {
          autosoftId: "maneuvering-1",
          name: "Maneuvering",
          rating: 4,
          category: "movement",
        },
      ];
      const drone = createTestDrone("drone-1", { autosofts });
      const result = getApplicableAutosofts("accelerate", drone, []);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("movement");
    });

    it("should return matching autosofts from shared RCC", () => {
      const drone = createTestDrone("drone-1");
      const sharedAutosofts: SharedAutosoft[] = [
        {
          autosoftId: "maneuvering-1",
          name: "Maneuvering",
          rating: 4,
          category: "movement",
        },
      ];
      const result = getApplicableAutosofts("accelerate", drone, sharedAutosofts);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("movement");
    });

    it("should use higher rating when duplicate categories exist", () => {
      const droneAutosofts: SharedAutosoft[] = [
        {
          autosoftId: "maneuvering-low",
          name: "Maneuvering",
          rating: 2,
          category: "movement",
        },
      ];
      const drone = createTestDrone("drone-1", { autosofts: droneAutosofts });
      const sharedAutosofts: SharedAutosoft[] = [
        {
          autosoftId: "maneuvering-high",
          name: "Maneuvering",
          rating: 5,
          category: "movement",
        },
      ];
      const result = getApplicableAutosofts("accelerate", drone, sharedAutosofts);

      expect(result).toHaveLength(1);
      expect(result[0].rating).toBe(5);
    });
  });
});
