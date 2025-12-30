import { describe, it, expect } from "vitest";
import {
  calculateVehicleLimit,
  calculateVehicleDicePool,
  calculateDroneDicePool,
  applyControlModeBonus,
  applySensorBonus,
  formatDicePoolResult,
  getPoolSummary,
  getEffectivePool,
  estimateSuccessChance,
} from "../dice-pool-calculator";
import type { Character } from "@/lib/types/character";
import type {
  RiggingState,
  SlavedDrone,
  SharedAutosoft,
  VehicleControlRig,
  JumpedInState,
} from "@/lib/types/rigging";
import type { VehicleCatalogItem, DroneCatalogItem } from "@/lib/types/vehicles";
import type { VehicleActionValidation, ActionBonus } from "../action-validator";

// =============================================================================
// TEST FIXTURES
// =============================================================================

/**
 * Create a minimal test character with skills
 */
function createTestCharacter(options: {
  reaction?: number;
  agility?: number;
  logic?: number;
  pilotSkill?: number;
  gunnerySkill?: number;
} = {}): Character {
  return {
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
      agility: options.agility || 4,
      reaction: options.reaction || 5,
      strength: 3,
      willpower: 3,
      logic: options.logic || 4,
      intuition: 4,
      charisma: 3,
    },
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    skills: {
      pilot_ground_craft: options.pilotSkill || 4,
      pilot_aircraft: 3,
      gunnery: options.gunnerySkill || 3,
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
}

/**
 * Create a test rigging state with VCR
 */
function createTestRiggingState(vcrRating: number = 2, isJumpedIn: boolean = false): RiggingState {
  const vcr: VehicleControlRig = {
    rating: vcrRating,
    controlBonus: vcrRating,
    initiativeDiceBonus: vcrRating,
    essenceCost: 1,
  };

  const state: RiggingState = {
    sessionId: "test-session-1",
    characterId: "test-char-1",
    startedAt: new Date().toISOString(),
    vcr,
    biofeedbackDamageTaken: 0,
    biofeedbackDamageType: "stun",
    isActive: true,
  };

  if (isJumpedIn) {
    const jumpedIn: JumpedInState = {
      isActive: true,
      targetId: "vehicle-1",
      targetType: "vehicle",
      targetName: "Test Vehicle",
      vrMode: "cold-sim",
      jumpedInAt: new Date().toISOString(),
      vcrRating,
      controlBonus: vcrRating,
      initiativeDiceBonus: vcrRating,
      bodyVulnerable: true,
    };
    state.jumpedInState = jumpedIn;
  }

  return state;
}

/**
 * Create a test vehicle catalog item
 */
function createTestVehicle(options: {
  handling?: number;
  speed?: number;
  sensor?: number;
  category?: string;
} = {}): VehicleCatalogItem {
  return {
    id: "test-vehicle-1",
    name: "Test Vehicle",
    category: (options.category || "cars") as VehicleCatalogItem["category"],
    handling: options.handling || 5,
    speed: options.speed || 4,
    acceleration: 3,
    body: 12,
    armor: 6,
    pilot: 1,
    sensor: options.sensor || 3,
    cost: 25000,
    availability: 8,
  };
}

/**
 * Create a test drone catalog item
 */
function createTestDroneCatalog(options: {
  handling?: number;
  speed?: number;
  sensor?: number;
  pilot?: number;
} = {}): DroneCatalogItem {
  return {
    id: "test-drone-1",
    name: "Test Drone",
    size: "small",
    droneType: "surveillance",
    handling: options.handling || 4,
    speed: options.speed || 3,
    acceleration: 2,
    body: 4,
    armor: 2,
    pilot: options.pilot || 3,
    sensor: options.sensor || 3,
    cost: 5000,
    availability: 6,
  };
}

/**
 * Create a test slaved drone
 */
function createTestSlavedDrone(options: {
  pilotRating?: number;
  noisePenalty?: number;
  damage?: number;
  autosofts?: SharedAutosoft[];
} = {}): SlavedDrone {
  return {
    droneId: "drone-1",
    catalogId: "test-drone-1",
    name: "Test Drone",
    pilotRating: options.pilotRating || 3,
    controlMode: "remote",
    isJumpedIn: false,
    conditionDamageTaken: options.damage || 0,
    conditionMonitorMax: 10,
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

/**
 * Create a test validation result
 */
function createTestValidation(options: {
  controlMode?: "manual" | "remote" | "jumped-in";
  noisePenalty?: number;
  bonuses?: ActionBonus[];
} = {}): VehicleActionValidation {
  return {
    valid: true,
    errors: [],
    warnings: [],
    controlMode: options.controlMode || "manual",
    applicableBonuses: options.bonuses || [],
    noisePenalty: options.noisePenalty || 0,
    requiresJumpedIn: false,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("dice-pool-calculator", () => {
  describe("calculateVehicleLimit", () => {
    it("should return handling for control tests", () => {
      const vehicle = createTestVehicle({ handling: 6 });
      const limit = calculateVehicleLimit(vehicle, "control");
      expect(limit).toBe(6);
    });

    it("should return handling for stunt tests", () => {
      const vehicle = createTestVehicle({ handling: 5 });
      const limit = calculateVehicleLimit(vehicle, "stunt");
      expect(limit).toBe(5);
    });

    it("should return speed for ramming tests", () => {
      const vehicle = createTestVehicle({ speed: 7 });
      const limit = calculateVehicleLimit(vehicle, "ramming");
      expect(limit).toBe(7);
    });

    it("should return sensor for sensor tests", () => {
      const vehicle = createTestVehicle({ sensor: 4 });
      const limit = calculateVehicleLimit(vehicle, "sensor");
      expect(limit).toBe(4);
    });

    it("should return sensor for gunnery tests", () => {
      const vehicle = createTestVehicle({ sensor: 5 });
      const limit = calculateVehicleLimit(vehicle, "gunnery");
      expect(limit).toBe(5);
    });

    it("should handle drone catalog items", () => {
      const drone = createTestDroneCatalog({ handling: 4 });
      const limit = calculateVehicleLimit(drone, "control");
      expect(limit).toBe(4);
    });
  });

  describe("calculateVehicleDicePool", () => {
    it("should calculate basic pool from reaction + skill", () => {
      const character = createTestCharacter({ reaction: 5, pilotSkill: 4 });
      const vehicle = createTestVehicle({ category: "cars" });
      const validation = createTestValidation({ controlMode: "manual" });

      const result = calculateVehicleDicePool(
        character,
        undefined,
        "control",
        vehicle,
        validation
      );

      // Reaction 5 + Pilot Ground Craft 4 = 9
      expect(result.pool).toBe(9);
      expect(result.controlMode).toBe("manual");
    });

    it("should add VCR bonus when jumped in", () => {
      const character = createTestCharacter({ reaction: 5, pilotSkill: 4 });
      const riggingState = createTestRiggingState(2, true);
      const vehicle = createTestVehicle();
      const validation = createTestValidation({ controlMode: "jumped-in" });

      const result = calculateVehicleDicePool(
        character,
        riggingState,
        "control",
        vehicle,
        validation
      );

      // Reaction 5 + Pilot 4 + VCR 2 = 11
      expect(result.pool).toBe(11);
      expect(result.breakdown.some(b => b.source === "Vehicle Control Rig")).toBe(true);
    });

    it("should apply noise penalty", () => {
      const character = createTestCharacter({ reaction: 5, pilotSkill: 4 });
      const vehicle = createTestVehicle();
      const validation = createTestValidation({ 
        controlMode: "remote",
        noisePenalty: 3,
      });

      const result = calculateVehicleDicePool(
        character,
        undefined,
        "control",
        vehicle,
        validation
      );

      // Reaction 5 + Pilot 4 - Noise 3 = 6
      expect(result.pool).toBe(6);
      expect(result.penalties.some(p => p.source === "Signal Noise")).toBe(true);
    });

    it("should use agility for gunnery tests", () => {
      const character = createTestCharacter({ agility: 6, gunnerySkill: 5 });
      const vehicle = createTestVehicle();
      const validation = createTestValidation({ controlMode: "manual" });

      const result = calculateVehicleDicePool(
        character,
        undefined,
        "gunnery",
        vehicle,
        validation
      );

      // Agility 6 + Gunnery 5 = 11
      expect(result.pool).toBe(11);
    });

    it("should apply defaulting penalty when skill is missing", () => {
      const character = createTestCharacter({ reaction: 5 });
      character.skills = {}; // No skills
      const vehicle = createTestVehicle();
      const validation = createTestValidation({ controlMode: "manual" });

      const result = calculateVehicleDicePool(
        character,
        undefined,
        "control",
        vehicle,
        validation
      );

      // Reaction 5 - Defaulting 1 = 4
      expect(result.pool).toBe(4);
      expect(result.penalties.some(p => p.source === "Defaulting")).toBe(true);
    });

    it("should include correct limit", () => {
      const character = createTestCharacter();
      const vehicle = createTestVehicle({ handling: 7 });
      const validation = createTestValidation({ controlMode: "manual" });

      const result = calculateVehicleDicePool(
        character,
        undefined,
        "control",
        vehicle,
        validation
      );

      expect(result.limit).toBe(7);
      expect(result.limitType).toBe("handling");
    });
  });

  describe("calculateDroneDicePool", () => {
    it("should calculate pool from pilot + autosoft", () => {
      const autosofts: SharedAutosoft[] = [
        {
          autosoftId: "maneuvering-1",
          name: "Maneuvering",
          rating: 4,
          category: "movement",
        },
      ];
      const drone = createTestSlavedDrone({ pilotRating: 3, autosofts });
      const droneCatalog = createTestDroneCatalog();

      const result = calculateDroneDicePool(
        drone,
        "control",
        [],
        droneCatalog
      );

      // Pilot 3 + Autosoft 4 = 7
      expect(result.pool).toBe(7);
    });

    it("should use shared autosofts from RCC", () => {
      const drone = createTestSlavedDrone({ pilotRating: 3 });
      const sharedAutosofts: SharedAutosoft[] = [
        {
          autosoftId: "maneuvering-1",
          name: "Maneuvering",
          rating: 5,
          category: "movement",
        },
      ];
      const droneCatalog = createTestDroneCatalog();

      const result = calculateDroneDicePool(
        drone,
        "control",
        sharedAutosofts,
        droneCatalog
      );

      // Pilot 3 + Shared Autosoft 5 = 8
      expect(result.pool).toBe(8);
    });

    it("should apply noise penalty", () => {
      const autosofts: SharedAutosoft[] = [
        {
          autosoftId: "maneuvering-1",
          name: "Maneuvering",
          rating: 4,
          category: "movement",
        },
      ];
      const drone = createTestSlavedDrone({ 
        pilotRating: 3, 
        noisePenalty: 2,
        autosofts,
      });
      const droneCatalog = createTestDroneCatalog();

      const result = calculateDroneDicePool(
        drone,
        "control",
        [],
        droneCatalog
      );

      // Pilot 3 + Autosoft 4 - Noise 2 = 5
      expect(result.pool).toBe(5);
      expect(result.penalties.some(p => p.source === "Signal Noise")).toBe(true);
    });

    it("should apply damage modifier", () => {
      const autosofts: SharedAutosoft[] = [
        {
          autosoftId: "maneuvering-1",
          name: "Maneuvering",
          rating: 4,
          category: "movement",
        },
      ];
      const drone = createTestSlavedDrone({ 
        pilotRating: 3, 
        damage: 4, // 4 boxes = -2 modifier (4/3 rounded up)
        autosofts,
      });
      const droneCatalog = createTestDroneCatalog();

      const result = calculateDroneDicePool(
        drone,
        "control",
        [],
        droneCatalog
      );

      // Pilot 3 + Autosoft 4 - Damage 2 = 5
      expect(result.pool).toBe(5);
      expect(result.penalties.some(p => p.source === "Damage")).toBe(true);
    });

    it("should return pool with no autosoft", () => {
      const drone = createTestSlavedDrone({ pilotRating: 3 });
      const droneCatalog = createTestDroneCatalog();

      const result = calculateDroneDicePool(
        drone,
        "control",
        [],
        droneCatalog
      );

      // Pilot 3 only (no autosoft)
      expect(result.pool).toBe(3);
      expect(result.penalties.some(p => p.source === "No Autosoft")).toBe(true);
    });
  });

  describe("applyControlModeBonus", () => {
    it("should add VCR rating for jumped-in mode", () => {
      const pool = 8;
      const result = applyControlModeBonus(pool, "jumped-in", 3);
      expect(result).toBe(11);
    });

    it("should not add bonus for remote mode", () => {
      const pool = 8;
      const result = applyControlModeBonus(pool, "remote", 3);
      expect(result).toBe(8);
    });

    it("should not add bonus for manual mode", () => {
      const pool = 8;
      const result = applyControlModeBonus(pool, "manual");
      expect(result).toBe(8);
    });
  });

  describe("applySensorBonus", () => {
    it("should add sensor rating when targeting autosoft is present", () => {
      const pool = 8;
      const result = applySensorBonus(pool, 4, true);
      expect(result).toBe(12);
    });

    it("should not add sensor rating without targeting autosoft", () => {
      const pool = 8;
      const result = applySensorBonus(pool, 4, false);
      expect(result).toBe(8);
    });
  });

  describe("formatDicePoolResult", () => {
    it("should format pool result as string", () => {
      const result = {
        pool: 10,
        formula: "REA 5 + Pilot 4 + VCR 1",
        breakdown: [],
        limit: 6,
        limitType: "handling" as const,
        controlMode: "jumped-in" as const,
        penalties: [],
      };

      const formatted = formatDicePoolResult(result);

      expect(formatted).toContain("Pool: 10 dice");
      expect(formatted).toContain("Limit: 6 (handling)");
      expect(formatted).toContain("Formula: REA 5 + Pilot 4 + VCR 1");
    });

    it("should include penalties when present", () => {
      const result = {
        pool: 7,
        formula: "REA 5 + Pilot 4 - Noise 2",
        breakdown: [],
        limit: 6,
        limitType: "handling" as const,
        controlMode: "remote" as const,
        penalties: [
          { source: "Signal Noise", value: -2 },
        ],
      };

      const formatted = formatDicePoolResult(result);

      expect(formatted).toContain("Penalties:");
      expect(formatted).toContain("Signal Noise: -2");
    });
  });

  describe("getPoolSummary", () => {
    it("should return correct summary values", () => {
      const result = {
        pool: 10,
        formula: "REA 5 + Pilot 4 + VCR 1",
        breakdown: [
          { source: "Attribute", value: 5 },
          { source: "Skill", value: 4 },
          { source: "VCR", value: 1 },
        ],
        limit: 6,
        limitType: "handling" as const,
        controlMode: "jumped-in" as const,
        penalties: [],
      };

      const summary = getPoolSummary(result);

      expect(summary.pool).toBe(10);
      expect(summary.limit).toBe(6);
      expect(summary.limitType).toBe("handling");
      expect(summary.hasBonus).toBe(true); // More than 2 breakdown items
      expect(summary.hasPenalty).toBe(false);
    });

    it("should detect penalties", () => {
      const result = {
        pool: 7,
        formula: "REA 5 + Pilot 4 - Noise 2",
        breakdown: [
          { source: "Attribute", value: 5 },
          { source: "Skill", value: 4 },
        ],
        limit: 6,
        limitType: "handling" as const,
        controlMode: "remote" as const,
        penalties: [
          { source: "Signal Noise", value: -2 },
        ],
      };

      const summary = getPoolSummary(result);

      expect(summary.hasPenalty).toBe(true);
    });
  });

  describe("getEffectivePool", () => {
    it("should return the pool value", () => {
      const result = {
        pool: 10,
        formula: "",
        breakdown: [],
        limit: 6,
        limitType: "handling" as const,
        controlMode: "manual" as const,
        penalties: [],
      };

      expect(getEffectivePool(result)).toBe(10);
    });
  });

  describe("estimateSuccessChance", () => {
    it("should return Very Likely for high pool vs low threshold", () => {
      const result = estimateSuccessChance(12, 1);
      expect(result.description).toBe("Very Likely");
      expect(result.chance).toBeGreaterThan(0.9);
    });

    it("should return Likely for good pool vs moderate threshold", () => {
      // ratio = 12/3 / 2 = 2, which is >= 2 => Likely
      const result = estimateSuccessChance(12, 2);
      expect(result.description).toBe("Likely");
    });

    it("should return Uncertain for equal pool/threshold averages", () => {
      const result = estimateSuccessChance(6, 2);
      expect(result.description).toBe("Uncertain");
    });

    it("should return Unlikely for low pool vs high threshold", () => {
      // ratio = 6/3 / 4 = 0.5, which is >= 0.5 => Unlikely
      const result = estimateSuccessChance(6, 4);
      expect(result.description).toBe("Unlikely");
    });

    it("should return Very Unlikely for very low pool", () => {
      const result = estimateSuccessChance(1, 3);
      expect(result.description).toBe("Very Unlikely");
    });
  });
});
