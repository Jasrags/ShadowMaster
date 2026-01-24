/**
 * Integration tests for Drone List API endpoint
 *
 * Tests:
 * - GET /api/characters/[characterId]/rigging/drones - List owned drones
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

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { GET } from "../route";
import type { Character, CharacterDrone, User } from "@/lib/types";

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

function createMockDrone(overrides?: Partial<CharacterDrone>): CharacterDrone {
  return {
    id: "drone-1",
    catalogId: "mct-fly-spy",
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
    ...overrides,
  };
}

function createMockRequest(): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/rigging/drones`;
  return new NextRequest(url, { method: "GET" });
}

// =============================================================================
// GET /api/characters/[characterId]/rigging/drones
// =============================================================================

describe("GET /api/characters/[characterId]/rigging/drones", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  // Drone Retrieval Tests
  // ===========================================================================

  describe("Drone Retrieval", () => {
    it("should return empty list when character has no drones", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: [] }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.drones).toEqual([]);
      expect(data.count).toBe(0);
    });

    it("should return single drone", async () => {
      const drone = createMockDrone();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: [drone] }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.drones).toHaveLength(1);
      expect(data.count).toBe(1);
      expect(data.drones[0].name).toBe("MCT Fly-Spy");
    });

    it("should return multiple drones", async () => {
      const drones = [
        createMockDrone({ id: "drone-1", name: "MCT Fly-Spy" }),
        createMockDrone({
          id: "drone-2",
          name: "Ares Duelist",
          catalogId: "ares-duelist",
          size: "medium",
        }),
        createMockDrone({
          id: "drone-3",
          name: "Steel Lynx",
          catalogId: "steel-lynx",
          size: "large",
        }),
      ];
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.drones).toHaveLength(3);
      expect(data.count).toBe(3);
    });

    it("should include all CharacterDrone fields", async () => {
      const drone = createMockDrone({
        id: "drone-full",
        catalogId: "rotodrone",
        name: "GM-Nissan Doberman",
        customName: "Fido",
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
        legality: "restricted",
        installedAutosofts: ["clearsight-3", "targeting-rifles-3"],
        notes: "My favorite combat drone",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: [drone] }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.drones).toHaveLength(1);
      const returnedDrone = data.drones[0];
      expect(returnedDrone.id).toBe("drone-full");
      expect(returnedDrone.catalogId).toBe("rotodrone");
      expect(returnedDrone.name).toBe("GM-Nissan Doberman");
      expect(returnedDrone.customName).toBe("Fido");
      expect(returnedDrone.size).toBe("medium");
      expect(returnedDrone.handling).toBe(5);
      expect(returnedDrone.speed).toBe(4);
      expect(returnedDrone.acceleration).toBe(3);
      expect(returnedDrone.body).toBe(4);
      expect(returnedDrone.armor).toBe(4);
      expect(returnedDrone.pilot).toBe(3);
      expect(returnedDrone.sensor).toBe(3);
      expect(returnedDrone.cost).toBe(5000);
      expect(returnedDrone.availability).toBe(6);
      expect(returnedDrone.legality).toBe("restricted");
      expect(returnedDrone.installedAutosofts).toEqual(["clearsight-3", "targeting-rifles-3"]);
      expect(returnedDrone.notes).toBe("My favorite combat drone");
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe("Edge Cases", () => {
    it("should handle undefined drones array", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: undefined }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.drones).toEqual([]);
      expect(data.count).toBe(0);
    });

    it("should handle drones with minimal fields", async () => {
      const minimalDrone: CharacterDrone = {
        catalogId: "basic-drone",
        name: "Basic Drone",
        size: "small",
        handling: 3,
        speed: 2,
        acceleration: 1,
        body: 2,
        armor: 0,
        pilot: 1,
        sensor: 1,
        cost: 500,
        availability: 4,
      };

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones: [minimalDrone] }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.drones).toHaveLength(1);
      expect(data.count).toBe(1);
      expect(data.drones[0].id).toBeUndefined();
      expect(data.drones[0].customName).toBeUndefined();
      expect(data.drones[0].legality).toBeUndefined();
      expect(data.drones[0].installedAutosofts).toBeUndefined();
      expect(data.drones[0].notes).toBeUndefined();
    });

    it("should return drones with all size categories", async () => {
      const drones = [
        createMockDrone({ id: "d1", name: "Micro Drone", size: "micro" }),
        createMockDrone({ id: "d2", name: "Mini Drone", size: "mini" }),
        createMockDrone({ id: "d3", name: "Small Drone", size: "small" }),
        createMockDrone({ id: "d4", name: "Medium Drone", size: "medium" }),
        createMockDrone({ id: "d5", name: "Large Drone", size: "large" }),
        createMockDrone({ id: "d6", name: "Huge Drone", size: "huge" }),
      ];

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ drones }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.drones).toHaveLength(6);
      expect(data.count).toBe(6);
      expect(data.drones.map((d: CharacterDrone) => d.size)).toEqual([
        "micro",
        "mini",
        "small",
        "medium",
        "large",
        "huge",
      ]);
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
      expect(data.error).toBe("Failed to get drones");
    });

    it("should return 500 when getUserById throws", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockRejectedValue(new Error("User lookup error"));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to get drones");
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
      expect(data.error).toBe("Failed to get drones");
    });
  });
});
