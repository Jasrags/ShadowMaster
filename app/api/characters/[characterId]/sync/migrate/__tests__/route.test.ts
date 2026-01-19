/**
 * Tests for /api/characters/[characterId]/sync/migrate endpoint
 *
 * Tests migration application (POST) and rollback (DELETE) including
 * authentication, ownership verification, plan validation, and audit trails.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST, DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as characterStorageModule from "@/lib/storage/characters";
import * as migrationEngineModule from "@/lib/rules/sync/migration-engine";
import * as syncAuditModule from "@/lib/rules/sync/sync-audit";

import type { Character, MigrationPlan, MigrationResult, RulesetVersionRef } from "@/lib/types";
import type { ValidationResult } from "@/lib/rules/sync/migration-engine";
import { createMockCharacter } from "@/__tests__/mocks/storage";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/sync/migration-engine");
vi.mock("@/lib/rules/sync/sync-audit");

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = "POST"): NextRequest {
  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { "Content-Type": "application/json" } : undefined,
  });

  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

// Mock data factories
function createMockVersionRef(overrides?: Partial<RulesetVersionRef>): RulesetVersionRef {
  return {
    editionCode: "sr5",
    editionVersion: "1.0.0",
    bookVersions: { "sr5-core": "1.0.0" },
    snapshotId: "snapshot-123",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockMigrationPlan(overrides?: Partial<MigrationPlan>): MigrationPlan {
  return {
    id: "plan-123",
    characterId: "test-character-id",
    sourceVersion: createMockVersionRef(),
    targetVersion: createMockVersionRef({ snapshotId: "snapshot-456" }),
    steps: [],
    isComplete: true,
    estimatedKarmaDelta: 0,
    ...overrides,
  };
}

function createMockValidationResult(
  isValid: boolean,
  errors: Array<{ field: string; message: string }> = [],
  warnings: Array<{ field: string; message: string }> = []
): ValidationResult {
  return {
    isValid,
    errors,
    warnings,
  };
}

function createMockMigrationResult(
  success: boolean,
  character?: Character,
  error?: string
): MigrationResult {
  return {
    success,
    character,
    error,
    appliedSteps: [],
    rollbackAvailable: !success,
  };
}

describe("POST /api/characters/[characterId]/sync/migrate", () => {
  const userId = "test-user-id";
  const characterId = "test-character-id";
  let mockCharacter: Character;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: userId,
      status: "active",
      rulesetVersion: createMockVersionRef(),
      rulesetSnapshotId: "snapshot-123",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(characterStorageModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(migrationEngineModule.validateMigrationPlan).mockReturnValue(
      createMockValidationResult(true)
    );
    vi.mocked(syncAuditModule.recordMigrationStart).mockResolvedValue(undefined);
    vi.mocked(syncAuditModule.recordMigrationComplete).mockResolvedValue(undefined);
  });

  afterEach(() => {
    if (consoleSpy) {
      consoleSpy.mockRestore();
    }
  });

  it("should return 401 when unauthenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {
      plan: createMockMigrationPlan(),
    });
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(characterStorageModule.getCharacterById).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {
      plan: createMockMigrationPlan(),
    });
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Character not found");
  });

  it("should return 403 when not owner", async () => {
    const otherUserCharacter = {
      ...mockCharacter,
      ownerId: "other-user-id",
    };
    vi.mocked(characterStorageModule.getCharacterById).mockResolvedValue(otherUserCharacter);

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {
      plan: createMockMigrationPlan(),
    });
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Forbidden");
  });

  it("should return 400 when plan missing", async () => {
    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {});
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Migration plan is required");
  });

  it("should return 400 when validation fails", async () => {
    vi.mocked(migrationEngineModule.validateMigrationPlan).mockReturnValue(
      createMockValidationResult(
        false,
        [{ field: "steps", message: "Invalid step configuration" }],
        [{ field: "plan", message: "Some warning" }]
      )
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {
      plan: createMockMigrationPlan(),
    });
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Invalid migration plan");
    expect(data.errors).toContainEqual({ field: "steps", message: "Invalid step configuration" });
  });

  it("should successfully apply migration", async () => {
    const updatedCharacter: Character = {
      ...mockCharacter,
      rulesetSnapshotId: "snapshot-456",
    };
    vi.mocked(migrationEngineModule.executeMigration).mockResolvedValue(
      createMockMigrationResult(true, updatedCharacter)
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {
      plan: createMockMigrationPlan(),
    });
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.character).toBeDefined();
    expect(data.appliedSteps).toBe(0);
  });

  it("should record audit on success", async () => {
    const updatedCharacter: Character = {
      ...mockCharacter,
      rulesetSnapshotId: "snapshot-456",
    };
    vi.mocked(migrationEngineModule.executeMigration).mockResolvedValue(
      createMockMigrationResult(true, updatedCharacter)
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {
      plan: createMockMigrationPlan(),
    });
    await POST(request, { params: Promise.resolve({ characterId }) });

    expect(syncAuditModule.recordMigrationStart).toHaveBeenCalled();
    expect(syncAuditModule.recordMigrationComplete).toHaveBeenCalled();
  });

  it("should return 500 on execution failure", async () => {
    vi.mocked(migrationEngineModule.executeMigration).mockResolvedValue(
      createMockMigrationResult(false, undefined, "Migration step failed")
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {
      plan: createMockMigrationPlan(),
    });
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Migration step failed");
    expect(data.rollbackAvailable).toBe(true);
  });

  it("should return 500 on internal error", async () => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(migrationEngineModule.executeMigration).mockRejectedValue(
      new Error("Unexpected error")
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {
      plan: createMockMigrationPlan(),
    });
    const response = await POST(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Failed to apply migration");
  });
});

describe("DELETE /api/characters/[characterId]/sync/migrate", () => {
  const userId = "test-user-id";
  const characterId = "test-character-id";
  let mockCharacter: Character;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: userId,
      status: "active",
      rulesetVersion: createMockVersionRef(),
      rulesetSnapshotId: "snapshot-456",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(characterStorageModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(syncAuditModule.recordMigrationRollback).mockResolvedValue(undefined);
  });

  afterEach(() => {
    if (consoleSpy) {
      consoleSpy.mockRestore();
    }
  });

  it("should return 401 when unauthenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {}, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(characterStorageModule.getCharacterById).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {}, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Character not found");
  });

  it("should return 403 when not owner", async () => {
    const otherUserCharacter = {
      ...mockCharacter,
      ownerId: "other-user-id",
    };
    vi.mocked(characterStorageModule.getCharacterById).mockResolvedValue(otherUserCharacter);

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {}, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Forbidden");
  });

  it("should return 400 when no rollback available", async () => {
    vi.mocked(characterStorageModule.rollbackMigration).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {}, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("No rollback available");
  });

  it("should successfully roll back migration", async () => {
    const rolledBackCharacter: Character = {
      ...mockCharacter,
      rulesetSnapshotId: "snapshot-123",
    };
    vi.mocked(characterStorageModule.rollbackMigration).mockResolvedValue(rolledBackCharacter);

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {}, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.character).toBeDefined();
  });

  it("should record audit on rollback", async () => {
    const rolledBackCharacter: Character = {
      ...mockCharacter,
      rulesetSnapshotId: "snapshot-123",
    };
    vi.mocked(characterStorageModule.rollbackMigration).mockResolvedValue(rolledBackCharacter);

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {}, "DELETE");
    await DELETE(request, { params: Promise.resolve({ characterId }) });

    expect(syncAuditModule.recordMigrationRollback).toHaveBeenCalled();
  });

  it("should return 500 on internal error", async () => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(characterStorageModule.rollbackMigration).mockRejectedValue(
      new Error("Rollback error")
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/migrate`, {}, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Failed to rollback migration");
  });
});
