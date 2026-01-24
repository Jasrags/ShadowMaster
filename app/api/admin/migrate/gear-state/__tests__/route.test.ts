/**
 * Integration tests for Admin Gear State Migration API endpoint
 *
 * Tests:
 * - GET /api/admin/migrate/gear-state - Preview migration
 * - POST /api/admin/migrate/gear-state - Execute migration
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
  getAllCharacters: vi.fn(),
  getCharacterById: vi.fn(),
  updateCharacter: vi.fn(),
}));

vi.mock("@/lib/migrations/add-gear-state", () => ({
  needsGearStateMigration: vi.fn(),
  migrateCharacterGearState: vi.fn(),
  migrateCharactersGearState: vi.fn(),
  getMigrationSummary: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getAllCharacters, getCharacterById, updateCharacter } from "@/lib/storage/characters";
import {
  needsGearStateMigration,
  migrateCharacterGearState,
  migrateCharactersGearState,
  getMigrationSummary,
} from "@/lib/migrations/add-gear-state";
import { GET, POST } from "../route";
import type { User, Character } from "@/lib/types";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_ADMIN_ID = "admin-user-123";
const TEST_USER_ID = "regular-user-456";
const TEST_CHARACTER_ID_1 = "char-001";
const TEST_CHARACTER_ID_2 = "char-002";

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: TEST_USER_ID,
    username: "regularuser",
    email: "user@example.com",
    passwordHash: "hashed_password",
    role: ["user"],
    preferences: { theme: "dark", navigationCollapsed: false },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    sessionSecretHash: null,
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    // Email verification fields
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

const mockAdminUser = createMockUser({
  id: TEST_ADMIN_ID,
  username: "admin",
  email: "admin@example.com",
  role: ["administrator"],
});

const mockRegularUser = createMockUser();

function createMockCharacter(id: string, overrides: Partial<Character> = {}): Character {
  return {
    id,
    ownerId: TEST_USER_ID,
    name: `Test Character ${id}`,
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
    gear: [{ id: "gear-1", catalogId: "commlink", quantity: 1 }],
    ...overrides,
  } as Character;
}

const mockCharacter1 = createMockCharacter(TEST_CHARACTER_ID_1);
const mockCharacter2 = createMockCharacter(TEST_CHARACTER_ID_2);

// =============================================================================
// GET TESTS
// =============================================================================

describe("GET /api/admin/migrate/gear-state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication & Authorization", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should return 403 when user is not administrator", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockRegularUser);

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Administrator access required");
    });
  });

  describe("Preview all characters", () => {
    it("should return migration preview for all characters", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockResolvedValue([mockCharacter1, mockCharacter2]);
      vi.mocked(needsGearStateMigration).mockReturnValueOnce(true).mockReturnValueOnce(false);

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.total).toBe(2);
      expect(data.needingMigration).toBe(1);
      expect(data.alreadyMigrated).toBe(1);
      expect(data.characters).toHaveLength(2);
    });

    it("should indicate which characters need migration", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockResolvedValue([mockCharacter1]);
      vi.mocked(needsGearStateMigration).mockReturnValue(true);

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.characters[0]).toEqual({
        characterId: TEST_CHARACTER_ID_1,
        characterName: mockCharacter1.name,
        ownerId: mockCharacter1.ownerId,
        needsMigration: true,
      });
    });
  });

  describe("Preview specific characters", () => {
    it("should return migration preview for specific characters", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getCharacterById).mockResolvedValue(mockCharacter1);
      vi.mocked(needsGearStateMigration).mockReturnValue(true);

      const request = new NextRequest(
        `http://localhost:3000/api/admin/migrate/gear-state?characterIds=${TEST_CHARACTER_ID_1}`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.total).toBe(1);
      expect(getCharacterById).toHaveBeenCalledWith(TEST_CHARACTER_ID_1);
    });

    it("should handle comma-separated character IDs", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getCharacterById)
        .mockResolvedValueOnce(mockCharacter1)
        .mockResolvedValueOnce(mockCharacter2);
      vi.mocked(needsGearStateMigration).mockReturnValue(false);

      const request = new NextRequest(
        `http://localhost:3000/api/admin/migrate/gear-state?characterIds=${TEST_CHARACTER_ID_1},${TEST_CHARACTER_ID_2}`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.total).toBe(2);
    });

    it("should filter out null results from character lookup", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getCharacterById).mockResolvedValueOnce(mockCharacter1).mockResolvedValueOnce(null); // Non-existent character
      vi.mocked(needsGearStateMigration).mockReturnValue(true);

      const request = new NextRequest(
        `http://localhost:3000/api/admin/migrate/gear-state?characterIds=${TEST_CHARACTER_ID_1},nonexistent`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.total).toBe(1);
    });
  });

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockRejectedValue(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to preview migration");
    });
  });
});

// =============================================================================
// POST TESTS
// =============================================================================

describe("POST /api/admin/migrate/gear-state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication & Authorization", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 403 when user is not administrator", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockRegularUser);

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Administrator access required");
    });
  });

  describe("Dry run mode", () => {
    it("should perform dry run when dryRun is true", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockResolvedValue([mockCharacter1]);
      vi.mocked(migrateCharactersGearState).mockReturnValue({
        total: 1,
        migrated: 1,
        skipped: 0,
        failed: 0,
        results: [
          {
            characterId: TEST_CHARACTER_ID_1,
            characterName: mockCharacter1.name,
            success: true,
            changes: [
              {
                type: "gear",
                itemName: "Commlink",
                field: "readinessState",
                oldValue: undefined,
                newValue: "ready",
              },
            ],
          },
        ],
      });
      vi.mocked(getMigrationSummary).mockReturnValue(
        "Migration complete: 1 total, 1 migrated, 0 skipped, 0 failed"
      );

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({ dryRun: true }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.dryRun).toBe(true);
      expect(data.message).toContain("Dry run complete");
      expect(updateCharacter).not.toHaveBeenCalled();
    });

    it("should return migration analysis in dry run", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockResolvedValue([mockCharacter1, mockCharacter2]);
      vi.mocked(migrateCharactersGearState).mockReturnValue({
        total: 2,
        migrated: 2,
        skipped: 0,
        failed: 0,
        results: [
          {
            characterId: TEST_CHARACTER_ID_1,
            characterName: mockCharacter1.name,
            success: true,
            changes: [
              {
                type: "gear",
                itemName: "Commlink",
                field: "readinessState",
                oldValue: undefined,
                newValue: "ready",
              },
            ],
          },
          {
            characterId: TEST_CHARACTER_ID_2,
            characterName: mockCharacter2.name,
            success: true,
            changes: [],
          },
        ],
      });
      vi.mocked(getMigrationSummary).mockReturnValue(
        "Migration complete: 2 total, 2 migrated, 0 skipped, 0 failed"
      );

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({ dryRun: true }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.results).toHaveLength(2);
      expect(data.summary).toBeDefined();
    });
  });

  describe("Execute migration", () => {
    it("should execute migration when dryRun is false", async () => {
      const migratedCharacter = {
        ...mockCharacter1,
        gear: [{ ...mockCharacter1.gear[0], readinessState: "ready" }],
      };
      const mockMigrationResult = {
        characterId: TEST_CHARACTER_ID_1,
        characterName: mockCharacter1.name,
        success: true,
        changes: [
          {
            type: "gear" as const,
            itemName: "Commlink",
            field: "readinessState",
            oldValue: undefined,
            newValue: "ready",
          },
        ],
      };

      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockResolvedValue([mockCharacter1]);
      vi.mocked(migrateCharactersGearState).mockReturnValue({
        total: 1,
        migrated: 1,
        skipped: 0,
        failed: 0,
        results: [mockMigrationResult],
      });
      vi.mocked(migrateCharacterGearState).mockReturnValue({
        character: migratedCharacter,
        result: mockMigrationResult,
      });
      vi.mocked(updateCharacter).mockResolvedValue(migratedCharacter);
      vi.mocked(getMigrationSummary).mockReturnValue(
        "Migration complete: 1 total, 1 migrated, 0 skipped, 0 failed"
      );

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({ dryRun: false }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.dryRun).toBe(false);
      expect(data.saveResults).toBeDefined();
      expect(updateCharacter).toHaveBeenCalled();
    });

    it("should track save results for each character", async () => {
      const migratedCharacter = { ...mockCharacter1 };
      const mockMigrationResult = {
        characterId: TEST_CHARACTER_ID_1,
        characterName: mockCharacter1.name,
        success: true,
        changes: [
          {
            type: "gear" as const,
            itemName: "Commlink",
            field: "readinessState",
            oldValue: undefined,
            newValue: "ready",
          },
        ],
      };

      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockResolvedValue([mockCharacter1]);
      vi.mocked(migrateCharactersGearState).mockReturnValue({
        total: 1,
        migrated: 1,
        skipped: 0,
        failed: 0,
        results: [mockMigrationResult],
      });
      vi.mocked(migrateCharacterGearState).mockReturnValue({
        character: migratedCharacter,
        result: mockMigrationResult,
      });
      vi.mocked(updateCharacter).mockResolvedValue(migratedCharacter);
      vi.mocked(getMigrationSummary).mockReturnValue(
        "Migration complete: 1 total, 1 migrated, 0 skipped, 0 failed"
      );

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({ dryRun: false }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.saveResults).toContainEqual({
        characterId: TEST_CHARACTER_ID_1,
        saved: true,
      });
    });

    it("should handle save errors gracefully", async () => {
      const migratedCharacter = { ...mockCharacter1 };
      const mockMigrationResult = {
        characterId: TEST_CHARACTER_ID_1,
        characterName: mockCharacter1.name,
        success: true,
        changes: [
          {
            type: "gear" as const,
            itemName: "Commlink",
            field: "readinessState",
            oldValue: undefined,
            newValue: "ready",
          },
        ],
      };

      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockResolvedValue([mockCharacter1]);
      vi.mocked(migrateCharactersGearState).mockReturnValue({
        total: 1,
        migrated: 1,
        skipped: 0,
        failed: 0,
        results: [mockMigrationResult],
      });
      vi.mocked(migrateCharacterGearState).mockReturnValue({
        character: migratedCharacter,
        result: mockMigrationResult,
      });
      vi.mocked(updateCharacter).mockRejectedValue(new Error("Write failed"));
      vi.mocked(getMigrationSummary).mockReturnValue(
        "Migration complete: 1 total, 1 migrated, 0 skipped, 0 failed"
      );

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({ dryRun: false }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.saveResults).toContainEqual({
        characterId: TEST_CHARACTER_ID_1,
        saved: false,
        error: "Write failed",
      });
    });

    it("should skip characters with no changes", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockResolvedValue([mockCharacter1]);
      vi.mocked(migrateCharactersGearState).mockReturnValue({
        total: 1,
        migrated: 0,
        skipped: 1,
        failed: 0,
        results: [
          {
            characterId: TEST_CHARACTER_ID_1,
            characterName: mockCharacter1.name,
            success: true,
            changes: [],
          },
        ],
      });
      vi.mocked(getMigrationSummary).mockReturnValue(
        "Migration complete: 1 total, 0 migrated, 1 skipped, 0 failed"
      );

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({ dryRun: false }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(updateCharacter).not.toHaveBeenCalled();
      expect(data.saveResults).toEqual([]);
    });
  });

  describe("Specific character migration", () => {
    it("should migrate specific characters when characterIds provided", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getCharacterById).mockResolvedValue(mockCharacter1);
      vi.mocked(migrateCharactersGearState).mockReturnValue({
        total: 1,
        migrated: 1,
        skipped: 0,
        failed: 0,
        results: [
          {
            characterId: TEST_CHARACTER_ID_1,
            characterName: mockCharacter1.name,
            success: true,
            changes: [
              {
                type: "gear",
                itemName: "Commlink",
                field: "readinessState",
                oldValue: undefined,
                newValue: "ready",
              },
            ],
          },
        ],
      });
      vi.mocked(getMigrationSummary).mockReturnValue(
        "Migration complete: 1 total, 1 migrated, 0 skipped, 0 failed"
      );

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({ characterIds: [TEST_CHARACTER_ID_1], dryRun: true }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(getCharacterById).toHaveBeenCalledWith(TEST_CHARACTER_ID_1);
      expect(getAllCharacters).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockRejectedValue(new Error("Database error"));

      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to execute migration");
    });

    it("should handle empty object body gracefully", async () => {
      const migratedCharacter = { ...mockCharacter1 };
      const mockMigrationResult = {
        characterId: TEST_CHARACTER_ID_1,
        characterName: mockCharacter1.name,
        success: true,
        changes: [
          {
            type: "gear" as const,
            itemName: "Commlink",
            field: "readinessState",
            oldValue: undefined,
            newValue: "ready",
          },
        ],
      };

      vi.mocked(getSession).mockResolvedValue(TEST_ADMIN_ID);
      vi.mocked(getUserById).mockResolvedValue(mockAdminUser);
      vi.mocked(getAllCharacters).mockResolvedValue([mockCharacter1]);
      vi.mocked(migrateCharactersGearState).mockReturnValue({
        total: 1,
        migrated: 1,
        skipped: 0,
        failed: 0,
        results: [mockMigrationResult],
      });
      vi.mocked(migrateCharacterGearState).mockReturnValue({
        character: migratedCharacter,
        result: mockMigrationResult,
      });
      vi.mocked(updateCharacter).mockResolvedValue(migratedCharacter);
      vi.mocked(getMigrationSummary).mockReturnValue(
        "Migration complete: 1 total, 1 migrated, 0 skipped, 0 failed"
      );

      // Send empty object body - dryRun defaults to false
      const request = new NextRequest("http://localhost:3000/api/admin/migrate/gear-state", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.dryRun).toBe(false); // Default is false
    });
  });
});
