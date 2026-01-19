/**
 * Integration tests for Character Import API endpoint
 *
 * Tests:
 * - POST /api/characters/import - Import a character from JSON
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
  importCharacter: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { importCharacter } from "@/lib/storage/characters";
import { POST } from "../route";
import type { User, Character } from "@/lib/types";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "imported-char-456";

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
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    ...overrides,
  };
}

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Imported Runner",
    status: "draft",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 3,
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
      edge: 2,
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

function createMockRequest(body: Record<string, unknown>): NextRequest {
  const url = "http://localhost:3000/api/characters/import";
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const mockUser = createMockUser();

// =============================================================================
// AUTHENTICATION TESTS
// =============================================================================

describe("POST /api/characters/import", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({ character: createMockCharacter() });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = createMockRequest({ character: createMockCharacter() });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  // ===========================================================================
  // VALIDATION TESTS
  // ===========================================================================

  describe("Validation", () => {
    it("should return 400 when character data is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);

      const request = createMockRequest({});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Missing character data");
    });

    it("should return 400 when character is null", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);

      const request = createMockRequest({ character: null });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Missing character data");
    });

    it("should return 400 when editionCode is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);

      const characterWithoutEdition = createMockCharacter();
      // @ts-expect-error - Intentionally removing required field
      delete characterWithoutEdition.editionCode;

      const request = createMockRequest({ character: characterWithoutEdition });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid character: missing edition code");
    });
  });

  // ===========================================================================
  // SUCCESS TESTS
  // ===========================================================================

  describe("Successful import", () => {
    it("should import character and return 201", async () => {
      const mockCharacter = createMockCharacter();
      const importedCharacter = { ...mockCharacter, id: "new-imported-id" };

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(importCharacter).mockResolvedValue(importedCharacter);

      const request = createMockRequest({ character: mockCharacter });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.character).toBeDefined();
      expect(data.character.id).toBe("new-imported-id");
    });

    it("should call importCharacter with correct arguments", async () => {
      const mockCharacter = createMockCharacter();
      const importedCharacter = { ...mockCharacter, id: "new-imported-id" };

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(importCharacter).mockResolvedValue(importedCharacter);

      const request = createMockRequest({ character: mockCharacter });

      await POST(request);

      expect(importCharacter).toHaveBeenCalledWith(TEST_USER_ID, mockCharacter);
    });

    it("should handle character with minimal required fields", async () => {
      const minimalCharacter = {
        name: "Minimal Runner",
        editionCode: "sr5" as const,
        metatype: "Human",
      };
      const importedCharacter = createMockCharacter({
        ...minimalCharacter,
        id: "new-imported-id",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(importCharacter).mockResolvedValue(importedCharacter);

      const request = createMockRequest({ character: minimalCharacter });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });
  });

  // ===========================================================================
  // ERROR HANDLING TESTS
  // ===========================================================================

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(importCharacter).mockRejectedValue(new Error("Storage error"));

      const request = createMockRequest({ character: createMockCharacter() });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to import character");
    });

    it("should return 500 when importCharacter throws", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(importCharacter).mockRejectedValue(new Error("Invalid character format"));

      const request = createMockRequest({ character: createMockCharacter() });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });
});
