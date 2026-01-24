/**
 * Integration tests for Rigging Action Validation API endpoint
 *
 * Tests:
 * - POST /api/rigging/validate - Validate vehicle/drone actions
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/users", () => ({
  getUserById: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
}));

vi.mock("@/lib/rules/rigging/action-validator", () => ({
  validateVehicleAction: vi.fn(),
  getTestTypeForAction: vi.fn(),
}));

vi.mock("@/lib/rules/rigging/dice-pool-calculator", () => ({
  calculateVehicleDicePool: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { validateVehicleAction, getTestTypeForAction } from "@/lib/rules/rigging/action-validator";
import { calculateVehicleDicePool } from "@/lib/rules/rigging/dice-pool-calculator";
import { POST } from "../route";
import type { Character, Vehicle, CharacterDrone, User } from "@/lib/types";
import type { RiggingState, VehicleActionType, ControlMode } from "@/lib/types/rigging";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";
const TEST_VEHICLE_ID = "vehicle-789";
const TEST_DRONE_ID = "drone-101";

function createMockUser(overrides?: Partial<User>): User {
  return {
    id: TEST_USER_ID,
    email: "test@example.com",
    username: "testuser",
    passwordHash: "mock-hash",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    sessionSecretHash: null,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    emailVerified: true,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    ...overrides,
  };
}

function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Runner",
    status: "active",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: {
      reaction: 4,
      intuition: 4,
      logic: 3,
      agility: 4,
    },
    skills: {
      piloting: 4,
      gunnery: 3,
    },
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    ...overrides,
  } as Character;
}

function createMockVehicle(overrides?: Partial<Vehicle>): Vehicle {
  return {
    id: TEST_VEHICLE_ID,
    name: "Westwind 3000",
    type: "ground",
    handling: 5,
    speed: 7,
    acceleration: 4,
    body: 10,
    armor: 6,
    pilot: 2,
    sensor: 3,
    ...overrides,
  };
}

function createMockDrone(overrides?: Partial<CharacterDrone>): CharacterDrone {
  return {
    id: TEST_DRONE_ID,
    catalogId: "rotodrone",
    name: "GM-Nissan Doberman",
    size: "medium",
    handling: 5,
    speed: 4,
    acceleration: 3,
    body: 4,
    armor: 4,
    pilot: 3,
    sensor: 3,
    cost: 5000,
    availability: 6,
    ...overrides,
  };
}

function createMockRiggingState(overrides?: Partial<RiggingState>): RiggingState {
  return {
    sessionId: "session-123",
    characterId: TEST_CHARACTER_ID,
    startedAt: new Date().toISOString(),
    biofeedbackDamageTaken: 0,
    biofeedbackDamageType: "stun",
    isActive: true,
    ...overrides,
  };
}

function createMockValidationResult(
  overrides?: Partial<{
    valid: boolean;
    errors: Array<{ code: string; message: string }>;
    warnings: Array<{ code: string; message: string }>;
    controlMode: ControlMode;
    applicableBonuses: Array<{ source: string; value: number }>;
    noisePenalty: number;
    requiresJumpedIn: boolean;
  }>
) {
  return {
    valid: true,
    errors: [],
    warnings: [],
    controlMode: "manual" as ControlMode,
    applicableBonuses: [],
    noisePenalty: 0,
    requiresJumpedIn: false,
    ...overrides,
  };
}

function createMockDicePoolResult(
  overrides?: Partial<{
    pool: number;
    formula: string;
    breakdown: Array<{ source: string; value: number }>;
    limit: number;
    limitType: "handling" | "speed" | "sensor";
    controlMode: ControlMode;
    penalties: Array<{ source: string; value: number }>;
  }>
) {
  return {
    pool: 8,
    formula: "Reaction 4 + Pilot (Ground Craft) 4",
    breakdown: [
      { source: "Reaction", value: 4 },
      { source: "Pilot (Ground Craft)", value: 4 },
    ],
    limit: 5,
    limitType: "handling" as const,
    controlMode: "manual" as ControlMode,
    penalties: [],
    ...overrides,
  };
}

function createMockRequest(body: Record<string, unknown>): NextRequest {
  const url = "http://localhost:3000/api/rigging/validate";
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// =============================================================================
// POST /api/rigging/validate
// =============================================================================

describe("POST /api/rigging/validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mocks
    vi.mocked(validateVehicleAction).mockReturnValue(createMockValidationResult());
    vi.mocked(getTestTypeForAction).mockReturnValue("control");
    vi.mocked(calculateVehicleDicePool).mockReturnValue(createMockDicePoolResult());
  });

  // ===========================================================================
  // Authentication Tests
  // ===========================================================================

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });
  });

  // ===========================================================================
  // Request Validation Tests
  // ===========================================================================

  describe("Request Validation", () => {
    it("should return 400 when characterId is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());

      const request = createMockRequest({
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields: characterId, vehicleId, actionType");
    });

    it("should return 400 when vehicleId is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields: characterId, vehicleId, actionType");
    });

    it("should return 400 when actionType is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields: characterId, vehicleId, actionType");
    });

    it("should return 400 when all required fields are missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());

      const request = createMockRequest({});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Missing required fields: characterId, vehicleId, actionType");
    });
  });

  // ===========================================================================
  // Authorization Tests
  // ===========================================================================

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user does not own character", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ ownerId: "other-user-id" }));

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to access this character");
    });
  });

  // ===========================================================================
  // Vehicle/Drone Lookup Tests
  // ===========================================================================

  describe("Vehicle/Drone Lookup", () => {
    it("should return 404 when vehicle not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({
          vehicles: [],
          drones: [],
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: "nonexistent-vehicle",
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Vehicle or drone not found");
    });

    it("should find vehicle by id", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(createMockValidationResult());

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
    });

    it("should find drone by id", async () => {
      const drone = createMockDrone();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: [drone] }));
      vi.mocked(validateVehicleAction).mockReturnValue(createMockValidationResult());

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_DRONE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
    });
  });

  // ===========================================================================
  // Control Mode Tests
  // ===========================================================================

  describe("Control Modes", () => {
    it("should return manual control mode", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({ controlMode: "manual" })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "turn",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.controlMode).toBe("manual");
    });

    it("should return remote control mode", async () => {
      const drone = createMockDrone();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: [drone] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({ controlMode: "remote" })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_DRONE_ID,
        actionType: "accelerate",
        riggingState: createMockRiggingState({
          rccConfig: {
            rccId: "rcc-1",
            name: "Proteus",
            deviceRating: 4,
            dataProcessing: 5,
            firewall: 4,
            maxSlavedDrones: 15,
            slavedDroneIds: [TEST_DRONE_ID],
            runningAutosofts: [],
            noiseReduction: 4,
            sharingBonus: 4,
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.controlMode).toBe("remote");
    });

    it("should return jumped-in control mode", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({ controlMode: "jumped-in" })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "stunt",
        riggingState: createMockRiggingState({
          vcr: {
            rating: 2,
            controlBonus: 2,
            initiativeDiceBonus: 2,
            essenceCost: 2.0,
          },
          jumpedInState: {
            isActive: true,
            targetId: TEST_VEHICLE_ID,
            targetType: "vehicle",
            targetName: "Westwind 3000",
            vrMode: "cold-sim",
            jumpedInAt: new Date().toISOString(),
            vcrRating: 2,
            controlBonus: 2,
            initiativeDiceBonus: 2,
            bodyVulnerable: true,
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.controlMode).toBe("jumped-in");
    });
  });

  // ===========================================================================
  // Actions Requiring Jumped-In Tests
  // ===========================================================================

  describe("Actions Requiring Jumped-In", () => {
    it("should validate stunt action requires jumped-in", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({
          valid: false,
          errors: [
            {
              code: "REQUIRES_JUMPED_IN",
              message: "Action 'stunt' requires jumped-in control mode",
            },
          ],
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "stunt",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(false);
      expect(data.errors).toContainEqual(expect.objectContaining({ code: "REQUIRES_JUMPED_IN" }));
    });

    it("should validate ram action requires jumped-in", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({
          valid: false,
          errors: [
            { code: "REQUIRES_JUMPED_IN", message: "Action 'ram' requires jumped-in control mode" },
          ],
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "ram",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(false);
      expect(data.errors).toContainEqual(expect.objectContaining({ code: "REQUIRES_JUMPED_IN" }));
    });

    it("should validate evasive_driving action requires jumped-in", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({
          valid: false,
          errors: [
            {
              code: "REQUIRES_JUMPED_IN",
              message: "Action 'evasive_driving' requires jumped-in control mode",
            },
          ],
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "evasive_driving",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(false);
      expect(data.errors).toContainEqual(expect.objectContaining({ code: "REQUIRES_JUMPED_IN" }));
    });
  });

  // ===========================================================================
  // Hardware Requirements Tests
  // ===========================================================================

  describe("Hardware Requirements", () => {
    it("should return error when VCR required but missing", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({
          valid: false,
          errors: [
            {
              code: "MISSING_VCR",
              message: "Vehicle Control Rig required for jumped-in control mode",
            },
          ],
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "stunt",
        riggingState: createMockRiggingState({
          jumpedInState: {
            isActive: true,
            targetId: TEST_VEHICLE_ID,
            targetType: "vehicle",
            targetName: "Westwind 3000",
            vrMode: "cold-sim",
            jumpedInAt: new Date().toISOString(),
            vcrRating: 0,
            controlBonus: 0,
            initiativeDiceBonus: 0,
            bodyVulnerable: true,
          },
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(false);
      expect(data.errors).toContainEqual(expect.objectContaining({ code: "MISSING_VCR" }));
    });

    it("should return error when RCC required but missing", async () => {
      const drone = createMockDrone();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: [drone] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({
          valid: false,
          errors: [
            {
              code: "MISSING_RCC",
              message: "Rigger Command Console required for remote control mode",
            },
          ],
          controlMode: "remote",
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_DRONE_ID,
        actionType: "accelerate",
        riggingState: createMockRiggingState(),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(false);
      expect(data.errors).toContainEqual(expect.objectContaining({ code: "MISSING_RCC" }));
    });
  });

  // ===========================================================================
  // Dice Pool Calculation Tests
  // ===========================================================================

  describe("Dice Pool Calculation", () => {
    it("should calculate dice pool when action is valid", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(createMockValidationResult());
      vi.mocked(getTestTypeForAction).mockReturnValue("control");
      vi.mocked(calculateVehicleDicePool).mockReturnValue(
        createMockDicePoolResult({
          pool: 8,
          formula: "Reaction 4 + Pilot (Ground Craft) 4",
          limit: 5,
          limitType: "handling",
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.dicePool).toBeDefined();
      expect(data.dicePool.pool).toBe(8);
      expect(data.dicePool.formula).toBe("Reaction 4 + Pilot (Ground Craft) 4");
      expect(data.dicePool.limit).toBe(5);
      expect(data.dicePool.limitType).toBe("handling");
    });

    it("should not calculate dice pool when action is invalid", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({
          valid: false,
          errors: [{ code: "REQUIRES_JUMPED_IN", message: "Action requires jumped-in" }],
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "stunt",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(false);
      expect(data.dicePool).toBeUndefined();
      expect(calculateVehicleDicePool).not.toHaveBeenCalled();
    });

    it("should calculate dice pool for sensor targeting", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(createMockValidationResult());
      vi.mocked(getTestTypeForAction).mockReturnValue("sensor");
      vi.mocked(calculateVehicleDicePool).mockReturnValue(
        createMockDicePoolResult({
          pool: 6,
          formula: "Logic 3 + Electronic Warfare 3",
          limit: 3,
          limitType: "sensor",
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "sensor_targeting",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.dicePool.limitType).toBe("sensor");
    });

    it("should calculate dice pool for fire weapon", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockReturnValue(createMockValidationResult());
      vi.mocked(getTestTypeForAction).mockReturnValue("gunnery");
      vi.mocked(calculateVehicleDicePool).mockReturnValue(
        createMockDicePoolResult({
          pool: 7,
          formula: "Agility 4 + Gunnery 3",
          limit: 3,
          limitType: "sensor",
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "fire_weapon",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.dicePool.pool).toBe(7);
    });
  });

  // ===========================================================================
  // Action Types Tests
  // ===========================================================================

  describe("Action Types", () => {
    const actionTypes: VehicleActionType[] = [
      "accelerate",
      "decelerate",
      "turn",
      "catch_up",
      "cut_off",
      "ram",
      "stunt",
      "fire_weapon",
      "sensor_targeting",
      "evasive_driving",
    ];

    actionTypes.forEach((actionType) => {
      it(`should accept ${actionType} action type`, async () => {
        const vehicle = createMockVehicle();
        vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
        vi.mocked(getUserById).mockResolvedValue(createMockUser());
        vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
        vi.mocked(validateVehicleAction).mockReturnValue(createMockValidationResult());

        const request = createMockRequest({
          characterId: TEST_CHARACTER_ID,
          vehicleId: TEST_VEHICLE_ID,
          actionType,
        });

        const response = await POST(request);

        expect(response.status).toBe(200);
        // Verify the action validator was called with correct action type and vehicle ID
        const mockCalls = vi.mocked(validateVehicleAction).mock.calls;
        expect(mockCalls.length).toBeGreaterThan(0);
        const lastCall = mockCalls[mockCalls.length - 1];
        expect(lastCall[2]).toBe(actionType);
        expect(lastCall[3]).toBe(TEST_VEHICLE_ID);
      });
    });
  });

  // ===========================================================================
  // Warnings Tests
  // ===========================================================================

  describe("Warnings", () => {
    it("should include warnings in response", async () => {
      const drone = createMockDrone();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: [drone] }));
      vi.mocked(validateVehicleAction).mockReturnValue(
        createMockValidationResult({
          valid: true,
          warnings: [
            { code: "NOISE_PENALTY", message: "Signal noise penalty: -3 dice" },
            { code: "NOT_SLAVED", message: "Target is not slaved to RCC network" },
          ],
        })
      );

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_DRONE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.warnings).toHaveLength(2);
      expect(data.warnings).toContainEqual(expect.objectContaining({ code: "NOISE_PENALTY" }));
    });
  });

  // ===========================================================================
  // Error Handling Tests
  // ===========================================================================

  describe("Error Handling", () => {
    it("should return 500 when getSession throws", async () => {
      vi.mocked(getSession).mockRejectedValue(new Error("Session error"));

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to validate action");
    });

    it("should return 500 when getUserById throws", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockRejectedValue(new Error("User lookup error"));

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to validate action");
    });

    it("should return 500 when getCharacter throws", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockRejectedValue(new Error("Character lookup error"));

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to validate action");
    });

    it("should return 500 when validateVehicleAction throws", async () => {
      const vehicle = createMockVehicle();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: [vehicle] }));
      vi.mocked(validateVehicleAction).mockImplementation(() => {
        throw new Error("Validation error");
      });

      const request = createMockRequest({
        characterId: TEST_CHARACTER_ID,
        vehicleId: TEST_VEHICLE_ID,
        actionType: "accelerate",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to validate action");
    });
  });
});
