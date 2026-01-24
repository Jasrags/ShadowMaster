/**
 * Integration tests for Rigging Equipment Summary API endpoint
 *
 * Tests:
 * - GET /api/characters/[characterId]/rigging - Get rigging equipment summary
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

vi.mock("@/lib/rules/rigging/vcr-validator", () => ({
  hasVehicleControlRig: vi.fn(),
  getVehicleControlRig: vi.fn(),
}));

vi.mock("@/lib/rules/rigging/rcc-validator", () => ({
  hasRCC: vi.fn(),
  getActiveRCC: vi.fn(),
  buildRCCConfiguration: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { hasVehicleControlRig, getVehicleControlRig } from "@/lib/rules/rigging/vcr-validator";
import { hasRCC, getActiveRCC, buildRCCConfiguration } from "@/lib/rules/rigging/rcc-validator";
import { GET } from "../route";
import type {
  Character,
  CharacterRCC,
  Vehicle,
  CharacterDrone,
  CharacterAutosoft,
  User,
} from "@/lib/types";
import type { VehicleControlRig, RCCConfiguration } from "@/lib/types/rigging";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";

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
    attributes: {},
    skills: {},
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

function createMockRCC(overrides?: Partial<CharacterRCC>): CharacterRCC {
  return {
    catalogId: "proteus-4",
    name: "Proteus Rating 4",
    deviceRating: 4,
    dataProcessing: 5,
    firewall: 4,
    cost: 22000,
    availability: 12,
    runningAutosofts: [],
    ...overrides,
  };
}

function createMockVCR(overrides?: Partial<VehicleControlRig>): VehicleControlRig {
  return {
    rating: 2,
    controlBonus: 2,
    initiativeDiceBonus: 2,
    essenceCost: 2.0,
    grade: "standard",
    catalogId: "vehicle-control-rig-2",
    ...overrides,
  };
}

function createMockRequest(): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/rigging`;
  return new NextRequest(url, { method: "GET" });
}

// =============================================================================
// GET /api/characters/[characterId]/rigging
// =============================================================================

describe("GET /api/characters/[characterId]/rigging", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mocks for rigging validators
    vi.mocked(hasVehicleControlRig).mockReturnValue(false);
    vi.mocked(getVehicleControlRig).mockReturnValue(null);
    vi.mocked(hasRCC).mockReturnValue(false);
    vi.mocked(getActiveRCC).mockReturnValue(null);
    vi.mocked(buildRCCConfiguration).mockReturnValue({
      rccId: "test-rcc",
      name: "Test RCC",
      deviceRating: 4,
      dataProcessing: 5,
      firewall: 4,
      maxSlavedDrones: 15,
      slavedDroneIds: [],
      runningAutosofts: [],
      noiseReduction: 4,
      sharingBonus: 4,
    });
  });

  // ===========================================================================
  // Authentication Tests
  // ===========================================================================

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
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

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user does not own character", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ ownerId: "other-user-id" }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to view this character");
    });
  });

  // ===========================================================================
  // Equipment Count Tests
  // ===========================================================================

  describe("Equipment Counts", () => {
    it("should return zero counts for character with no equipment", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({
          vehicles: [],
          drones: [],
          rccs: [],
          autosofts: [],
        })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.vehicleCount).toBe(0);
      expect(data.droneCount).toBe(0);
      expect(data.rccCount).toBe(0);
      expect(data.autosoftCount).toBe(0);
    });

    it("should return correct vehicle count", async () => {
      const vehicles: Partial<Vehicle>[] = [
        { id: "v1", name: "Westwind 3000", type: "ground" },
        { id: "v2", name: "Ford Americar", type: "ground" },
      ];
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({ vehicles: vehicles as Vehicle[] })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.vehicleCount).toBe(2);
    });

    it("should return correct drone count", async () => {
      const drones: Partial<CharacterDrone>[] = [
        {
          id: "d1",
          catalogId: "fly-spy",
          name: "MCT Fly-Spy",
          size: "micro",
          handling: 4,
          speed: 3,
          acceleration: 2,
          body: 1,
          armor: 0,
          pilot: 3,
          sensor: 3,
          cost: 2000,
          availability: 8,
        },
        {
          id: "d2",
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
        },
        {
          id: "d3",
          catalogId: "steel-lynx",
          name: "Steel Lynx",
          size: "large",
          handling: 5,
          speed: 4,
          acceleration: 2,
          body: 6,
          armor: 12,
          pilot: 3,
          sensor: 3,
          cost: 25000,
          availability: 10,
        },
      ];
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({ drones: drones as CharacterDrone[] })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.droneCount).toBe(3);
    });

    it("should return correct RCC count", async () => {
      const rccs: CharacterRCC[] = [
        createMockRCC({ catalogId: "proteus-4", name: "Proteus Rating 4" }),
      ];
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ rccs }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.rccCount).toBe(1);
    });

    it("should return correct autosoft count", async () => {
      const autosofts: Partial<CharacterAutosoft>[] = [
        {
          id: "a1",
          catalogId: "clearsight-3",
          name: "Clearsight 3",
          rating: 3,
          category: "perception",
        },
        {
          id: "a2",
          catalogId: "targeting-rifles-3",
          name: "Targeting (Rifles) 3",
          rating: 3,
          category: "combat",
        },
        {
          id: "a3",
          catalogId: "maneuvering-rotodrone-3",
          name: "Maneuvering (Rotodrone) 3",
          rating: 3,
          category: "movement",
        },
        { id: "a4", catalogId: "evasion-3", name: "Evasion 3", rating: 3, category: "defense" },
      ];
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({ autosofts: autosofts as CharacterAutosoft[] })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.autosoftCount).toBe(4);
    });
  });

  // ===========================================================================
  // VCR Detection Tests
  // ===========================================================================

  describe("VCR Detection", () => {
    it("should return hasVCR false when no VCR installed", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(hasVehicleControlRig).mockReturnValue(false);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.hasVCR).toBe(false);
      expect(data.vcrRating).toBeUndefined();
    });

    it("should return hasVCR true with rating when VCR installed", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(hasVehicleControlRig).mockReturnValue(true);
      vi.mocked(getVehicleControlRig).mockReturnValue(createMockVCR({ rating: 2 }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.hasVCR).toBe(true);
      expect(data.vcrRating).toBe(2);
    });

    it("should return correct VCR rating 1", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(hasVehicleControlRig).mockReturnValue(true);
      vi.mocked(getVehicleControlRig).mockReturnValue(createMockVCR({ rating: 1 }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.vcrRating).toBe(1);
    });

    it("should return correct VCR rating 3", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(hasVehicleControlRig).mockReturnValue(true);
      vi.mocked(getVehicleControlRig).mockReturnValue(createMockVCR({ rating: 3 }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.vcrRating).toBe(3);
    });
  });

  // ===========================================================================
  // RCC Detection Tests
  // ===========================================================================

  describe("RCC Detection", () => {
    it("should return hasActiveRCC false when no RCC", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ rccs: [] }));
      vi.mocked(hasRCC).mockReturnValue(false);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.hasActiveRCC).toBe(false);
      expect(data.maxSlavedDrones).toBe(0);
    });

    it("should return hasActiveRCC true with max drones when RCC active", async () => {
      const rcc = createMockRCC({ dataProcessing: 5 });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ rccs: [rcc] }));
      vi.mocked(hasRCC).mockReturnValue(true);
      vi.mocked(getActiveRCC).mockReturnValue(rcc);
      vi.mocked(buildRCCConfiguration).mockReturnValue({
        rccId: "proteus-4",
        name: "Proteus Rating 4",
        deviceRating: 4,
        dataProcessing: 5,
        firewall: 4,
        maxSlavedDrones: 15, // DP 5 * 3 = 15
        slavedDroneIds: [],
        runningAutosofts: [],
        noiseReduction: 4,
        sharingBonus: 4,
      });

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.hasActiveRCC).toBe(true);
      expect(data.maxSlavedDrones).toBe(15);
    });

    it("should calculate maxSlavedDrones correctly (DP 3 = 9 drones)", async () => {
      const rcc = createMockRCC({ dataProcessing: 3 });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ rccs: [rcc] }));
      vi.mocked(hasRCC).mockReturnValue(true);
      vi.mocked(getActiveRCC).mockReturnValue(rcc);
      vi.mocked(buildRCCConfiguration).mockReturnValue({
        rccId: "basic-rcc",
        name: "Basic RCC",
        deviceRating: 3,
        dataProcessing: 3,
        firewall: 3,
        maxSlavedDrones: 9, // DP 3 * 3 = 9
        slavedDroneIds: [],
        runningAutosofts: [],
        noiseReduction: 3,
        sharingBonus: 3,
      });

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.maxSlavedDrones).toBe(9);
    });

    it("should calculate maxSlavedDrones correctly (DP 6 = 18 drones)", async () => {
      const rcc = createMockRCC({ dataProcessing: 6 });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ rccs: [rcc] }));
      vi.mocked(hasRCC).mockReturnValue(true);
      vi.mocked(getActiveRCC).mockReturnValue(rcc);
      vi.mocked(buildRCCConfiguration).mockReturnValue({
        rccId: "high-end-rcc",
        name: "High-End RCC",
        deviceRating: 6,
        dataProcessing: 6,
        firewall: 6,
        maxSlavedDrones: 18, // DP 6 * 3 = 18
        slavedDroneIds: [],
        runningAutosofts: [],
        noiseReduction: 6,
        sharingBonus: 6,
      });

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.maxSlavedDrones).toBe(18);
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("Edge Cases", () => {
    it("should handle undefined vehicles array", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ vehicles: undefined }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.vehicleCount).toBe(0);
    });

    it("should handle undefined drones array", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: undefined }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.droneCount).toBe(0);
    });

    it("should handle undefined rccs array", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ rccs: undefined }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.rccCount).toBe(0);
    });

    it("should handle undefined autosofts array", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ autosofts: undefined }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.autosoftCount).toBe(0);
    });
  });

  // ===========================================================================
  // Error Handling
  // ===========================================================================

  describe("Error Handling", () => {
    it("should return 500 when getSession throws", async () => {
      vi.mocked(getSession).mockRejectedValue(new Error("Session error"));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to get rigging equipment");
    });

    it("should return 500 when getUserById throws", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockRejectedValue(new Error("User lookup error"));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to get rigging equipment");
    });

    it("should return 500 when getCharacter throws", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockRejectedValue(new Error("Character lookup error"));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to get rigging equipment");
    });
  });
});
