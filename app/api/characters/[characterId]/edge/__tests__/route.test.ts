/**
 * Integration tests for Edge API endpoint
 *
 * Tests:
 * - GET /api/characters/[characterId]/edge - Get current Edge status
 * - POST /api/characters/[characterId]/edge - Spend or restore Edge
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
  spendEdge: vi.fn(),
  restoreEdge: vi.fn(),
  restoreFullEdge: vi.fn(),
  getCurrentEdge: vi.fn(),
  getMaxEdge: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import {
  getCharacter,
  spendEdge,
  restoreEdge,
  restoreFullEdge,
  getCurrentEdge,
  getMaxEdge,
} from "@/lib/storage/characters";
import { GET, POST } from "../route";
import type { User, Character } from "@/lib/types";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-789";

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: TEST_USER_ID,
    username: "testrunner",
    email: "test@example.com",
    passwordHash: "hashed_password",
    role: ["user"],
    preferences: { theme: "dark", navigationCollapsed: false },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    characters: [TEST_CHARACTER_ID],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
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

function createMockCharacter(overrides: Partial<Character> = {}): Character {
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
      body: 4,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 4,
      logic: 3,
      intuition: 3,
      charisma: 3,
    },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 4,
      essence: 6,
    },
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
      overflowDamage: 0,
    },
    ...overrides,
  } as Character;
}

function createMockGetRequest(): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/edge`;
  return new NextRequest(url, {
    method: "GET",
  });
}

function createMockPostRequest(body: Record<string, unknown>): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/edge`;
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const mockUser = createMockUser();
const mockCharacter = createMockCharacter();

// =============================================================================
// GET TESTS
// =============================================================================

describe("GET /api/characters/[characterId]/edge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  describe("Success", () => {
    it("should return Edge status when character exists", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(3);
      vi.mocked(getMaxEdge).mockReturnValue(4);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.edgeCurrent).toBe(3);
      expect(data.edgeMaximum).toBe(4);
      expect(data.canSpend).toBe(true);
      expect(data.canRestore).toBe(true);
    });

    it("should show canSpend as false when Edge is 0", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(0);
      vi.mocked(getMaxEdge).mockReturnValue(4);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.canSpend).toBe(false);
      expect(data.canRestore).toBe(true);
    });

    it("should show canRestore as false when Edge is at max", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(4);
      vi.mocked(getMaxEdge).mockReturnValue(4);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.canSpend).toBe(true);
      expect(data.canRestore).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockRejectedValue(new Error("Database error"));

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });
});

// =============================================================================
// POST TESTS
// =============================================================================

describe("POST /api/characters/[characterId]/edge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockPostRequest({ action: "spend", amount: 1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = createMockPostRequest({ action: "spend", amount: 1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockPostRequest({ action: "spend", amount: 1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  describe("Validation", () => {
    it("should return 400 when action is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockPostRequest({ amount: 1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Action is required (spend or restore)");
    });

    it("should return 400 when amount is less than 1", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      // Use negative number since 0 defaults to 1 via `body.amount || 1`
      const request = createMockPostRequest({ action: "spend", amount: -1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Amount must be at least 1");
    });

    it("should return 400 for invalid action", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockPostRequest({ action: "invalid", amount: 1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid action. Use 'spend' or 'restore'");
    });
  });

  describe("Spend Edge", () => {
    it("should return 400 when insufficient Edge", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(1);

      const request = createMockPostRequest({ action: "spend", amount: 2 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Insufficient Edge. Have: 1, Need: 2");
    });

    it("should spend Edge successfully", async () => {
      const updatedCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(4).mockReturnValueOnce(4);
      vi.mocked(getMaxEdge).mockReturnValue(4);
      vi.mocked(spendEdge).mockResolvedValue(updatedCharacter);
      // After spend, current should be 3
      vi.mocked(getCurrentEdge).mockReturnValueOnce(4).mockReturnValue(3);

      const request = createMockPostRequest({ action: "spend", amount: 1, reason: "Blitz" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.action).toBe("spent");
      expect(data.amount).toBe(1);
      expect(data.reason).toBe("Blitz");
      expect(spendEdge).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 1);
    });

    it("should default amount to 1 when not specified", async () => {
      const updatedCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(4);
      vi.mocked(getMaxEdge).mockReturnValue(4);
      vi.mocked(spendEdge).mockResolvedValue(updatedCharacter);

      const request = createMockPostRequest({ action: "spend" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.amount).toBe(1);
      expect(spendEdge).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 1);
    });
  });

  describe("Restore Edge", () => {
    it("should restore Edge successfully", async () => {
      const updatedCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(2);
      vi.mocked(getMaxEdge).mockReturnValue(4);
      vi.mocked(restoreEdge).mockResolvedValue(updatedCharacter);

      const request = createMockPostRequest({
        action: "restore",
        amount: 1,
        reason: "Scene ended",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.action).toBe("restored");
      expect(data.amount).toBe(1);
      expect(data.reason).toBe("Scene ended");
      expect(restoreEdge).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 1);
    });

    it("should call restoreFullEdge when amount equals max", async () => {
      const updatedCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(0);
      vi.mocked(getMaxEdge).mockReturnValue(4);
      vi.mocked(restoreFullEdge).mockResolvedValue(updatedCharacter);

      const request = createMockPostRequest({ action: "restore", amount: 4 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.action).toBe("restored");
      expect(restoreFullEdge).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    });

    it("should call restoreFullEdge when amount is undefined", async () => {
      const updatedCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(0);
      vi.mocked(getMaxEdge).mockReturnValue(4);
      vi.mocked(restoreFullEdge).mockResolvedValue(updatedCharacter);

      const request = createMockPostRequest({ action: "restore" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(restoreFullEdge).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    });
  });

  describe("Error handling", () => {
    it("should return 500 on unexpected error during spend", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(4);
      vi.mocked(spendEdge).mockRejectedValue(new Error("Storage error"));

      const request = createMockPostRequest({ action: "spend", amount: 1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Storage error");
    });

    it("should return 500 on unexpected error during restore", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCurrentEdge).mockReturnValue(2);
      vi.mocked(getMaxEdge).mockReturnValue(4);
      vi.mocked(restoreEdge).mockRejectedValue(new Error("Storage error"));

      const request = createMockPostRequest({ action: "restore", amount: 1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Storage error");
    });
  });
});
