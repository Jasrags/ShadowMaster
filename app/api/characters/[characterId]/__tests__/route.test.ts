/**
 * Tests for Character API endpoint
 *
 * Tests:
 * - GET /api/characters/[characterId] - Get a specific character
 * - PATCH /api/characters/[characterId] - Update a character
 * - DELETE /api/characters/[characterId] - Delete a character
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/auth/character-authorization", () => ({
  authorizeOwnerAccess: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  updateCharacter: vi.fn(),
  deleteCharacter: vi.fn(),
}));

vi.mock("@/lib/rules/character/state-machine", () => ({
  createAuditEntry: vi.fn(),
  appendAuditEntry: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import { updateCharacter, deleteCharacter } from "@/lib/storage/characters";
import { createAuditEntry, appendAuditEntry } from "@/lib/rules/character/state-machine";
import { GET, PATCH, DELETE } from "../route";
import type { Character } from "@/lib/types";
import type { CharacterAuthResult, CharacterPermission } from "@/lib/auth/character-authorization";
import type { ActorRole, AuditEntry } from "@/lib/types/audit";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-789";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createMockRequest(
  options: {
    method?: string;
    body?: Record<string, unknown>;
  } = {}
): NextRequest {
  const { method = "GET", body } = options;
  const url = new URL(`http://localhost:3000/api/characters/${TEST_CHARACTER_ID}`);
  const headers = new Headers();
  if (body) headers.set("Content-Type", "application/json");

  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  // Mock the json method for body parsing
  if (body) (request as { json: () => Promise<unknown> }).json = async () => body;

  return request;
}

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Runner",
    status: "draft",
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
      edge: 3,
      essence: 6,
    },
    auditLog: [],
    ...overrides,
  } as Character;
}

function createAuthResult(overrides: Partial<CharacterAuthResult> = {}): CharacterAuthResult {
  const character = overrides.character ?? createMockCharacter();
  return {
    authorized: true,
    character,
    campaign: null,
    role: "owner" as ActorRole,
    permissions: ["view", "edit", "delete"] as CharacterPermission[],
    status: 200,
    ...overrides,
  };
}

// =============================================================================
// GET HANDLER TESTS
// =============================================================================

describe("GET /api/characters/[characterId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest();
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 403 when not authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({
        authorized: false,
        character: null,
        error: "Permission denied: view",
        status: 403,
      })
    );

    const request = createMockRequest();
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Permission denied: view");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({
        authorized: false,
        character: null,
        error: "Character not found",
        status: 404,
      })
    );

    const request = createMockRequest();
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 200 with character data on success", async () => {
    const mockCharacter = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );

    const request = createMockRequest();
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.character.id).toBe(TEST_CHARACTER_ID);
    expect(data.character.name).toBe("Test Runner");
  });

  it("should return 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockRejectedValue(new Error("Storage error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = createMockRequest();
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get character");

    consoleSpy.mockRestore();
  });
});

// =============================================================================
// PATCH HANDLER TESTS
// =============================================================================

describe("PATCH /api/characters/[characterId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({ method: "PATCH", body: { name: "New Name" } });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 403 when not authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({
        authorized: false,
        character: null,
        error: "Permission denied: edit",
        status: 403,
      })
    );

    const request = createMockRequest({ method: "PATCH", body: { name: "New Name" } });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Permission denied: edit");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({
        authorized: false,
        character: null,
        error: "Character not found",
        status: 404,
      })
    );

    const request = createMockRequest({ method: "PATCH", body: { name: "New Name" } });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 400 when attempting status change", async () => {
    const mockCharacter = createMockCharacter({ status: "draft" });
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );

    const request = createMockRequest({
      method: "PATCH",
      body: { status: "active" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Status changes not allowed via PATCH");
  });

  it("should allow same status in updates (status deleted before save)", async () => {
    const mockCharacter = createMockCharacter({ status: "draft" });
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockResolvedValue(mockCharacter);

    const request = createMockRequest({
      method: "PATCH",
      body: { status: "draft", name: "Updated Name" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should return 400 when creationState characterId mismatches", async () => {
    const mockCharacter = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );

    const request = createMockRequest({
      method: "PATCH",
      body: {
        metadata: {
          creationState: {
            characterId: "different-character-id",
          },
        },
      },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("characterId mismatch");
  });

  it("should allow creationState when characterId matches", async () => {
    const mockCharacter = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockResolvedValue(mockCharacter);

    const request = createMockRequest({
      method: "PATCH",
      body: {
        metadata: {
          creationState: {
            characterId: TEST_CHARACTER_ID,
            step: "attributes",
          },
        },
      },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should update character name successfully", async () => {
    const mockCharacter = createMockCharacter();
    const updatedCharacter = { ...mockCharacter, name: "New Runner Name" };
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockResolvedValue(updatedCharacter);
    vi.mocked(createAuditEntry).mockReturnValue({
      id: "audit-1",
      timestamp: new Date().toISOString(),
      action: "name_changed",
      actor: { userId: TEST_USER_ID, role: "owner" },
      details: { previousName: "Test Runner", newName: "New Runner Name" },
    });
    vi.mocked(appendAuditEntry).mockImplementation((char, entry) => ({
      ...char,
      auditLog: [...(char.auditLog || []), entry],
    }));

    const request = createMockRequest({
      method: "PATCH",
      body: { name: "New Runner Name" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.character.name).toBe("New Runner Name");
  });

  it("should update multiple fields successfully", async () => {
    const mockCharacter = createMockCharacter();
    const updatedCharacter = {
      ...mockCharacter,
      name: "New Name",
      nuyen: 10000,
    };
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockResolvedValue(updatedCharacter);
    vi.mocked(createAuditEntry).mockReturnValue({
      id: "audit-1",
      timestamp: new Date().toISOString(),
      action: "name_changed",
      actor: { userId: TEST_USER_ID, role: "owner" },
      details: {},
    });
    vi.mocked(appendAuditEntry).mockImplementation((char) => char);

    const request = createMockRequest({
      method: "PATCH",
      body: { name: "New Name", nuyen: 10000 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.character.name).toBe("New Name");
    expect(data.character.nuyen).toBe(10000);
  });

  it("should strip protected field 'id' from updates", async () => {
    const mockCharacter = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockImplementation(async (_, __, updates) => ({
      ...mockCharacter,
      ...updates,
    }));

    const request = createMockRequest({
      method: "PATCH",
      body: { id: "hacked-id", nuyen: 9999 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await PATCH(request, { params });

    // Verify updateCharacter was called with original ID preserved
    expect(updateCharacter).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.objectContaining({ id: TEST_CHARACTER_ID })
    );
  });

  it("should strip protected field 'ownerId' from updates", async () => {
    const mockCharacter = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockImplementation(async (_, __, updates) => ({
      ...mockCharacter,
      ...updates,
    }));

    const request = createMockRequest({
      method: "PATCH",
      body: { ownerId: "hacked-owner", nuyen: 9999 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await PATCH(request, { params });

    // Verify updateCharacter was called with original ownerId preserved
    expect(updateCharacter).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.objectContaining({ ownerId: TEST_USER_ID })
    );
  });

  it("should strip protected field 'createdAt' from updates", async () => {
    const originalCreatedAt = "2024-01-01T00:00:00.000Z";
    const mockCharacter = createMockCharacter({ createdAt: originalCreatedAt });
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockImplementation(async (_, __, updates) => ({
      ...mockCharacter,
      ...updates,
    }));

    const request = createMockRequest({
      method: "PATCH",
      body: { createdAt: "2025-01-01T00:00:00.000Z", nuyen: 9999 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await PATCH(request, { params });

    // Verify updateCharacter was called with original createdAt preserved
    expect(updateCharacter).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.objectContaining({ createdAt: originalCreatedAt })
    );
  });

  it("should strip protected field 'auditLog' from updates", async () => {
    const originalAuditLog: AuditEntry[] = [
      {
        id: "original-audit",
        timestamp: "2024-01-01T00:00:00.000Z",
        action: "created",
        actor: { userId: TEST_USER_ID, role: "owner" },
        details: {},
      },
    ];
    const mockCharacter = createMockCharacter({ auditLog: originalAuditLog });
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockImplementation(async (_, __, updates) => ({
      ...mockCharacter,
      ...updates,
    }));

    const request = createMockRequest({
      method: "PATCH",
      body: { auditLog: [], nuyen: 9999 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await PATCH(request, { params });

    // Verify updateCharacter was called with original auditLog preserved
    expect(updateCharacter).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.objectContaining({ auditLog: originalAuditLog })
    );
  });

  it("should create audit entry when name changes", async () => {
    const mockCharacter = createMockCharacter({ name: "Old Name" });
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter, role: "owner" })
    );
    vi.mocked(updateCharacter).mockResolvedValue({ ...mockCharacter, name: "New Name" });
    vi.mocked(createAuditEntry).mockReturnValue({
      id: "audit-1",
      timestamp: new Date().toISOString(),
      action: "name_changed",
      actor: { userId: TEST_USER_ID, role: "owner" },
      details: { previousName: "Old Name", newName: "New Name" },
    });
    vi.mocked(appendAuditEntry).mockImplementation((char) => char);

    const request = createMockRequest({
      method: "PATCH",
      body: { name: "New Name" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await PATCH(request, { params });

    expect(createAuditEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "name_changed",
        actor: { userId: TEST_USER_ID, role: "owner" },
        details: {
          previousName: "Old Name",
          newName: "New Name",
        },
      })
    );
  });

  it("should NOT create audit entry when name stays the same", async () => {
    const mockCharacter = createMockCharacter({ name: "Same Name" });
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockResolvedValue(mockCharacter);

    const request = createMockRequest({
      method: "PATCH",
      body: { name: "Same Name" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await PATCH(request, { params });

    expect(createAuditEntry).not.toHaveBeenCalled();
  });

  it("should return 500 on storage error", async () => {
    const mockCharacter = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(updateCharacter).mockRejectedValue(new Error("Storage error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = createMockRequest({
      method: "PATCH",
      body: { nuyen: 10000 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to update character");

    consoleSpy.mockRestore();
  });
});

// =============================================================================
// DELETE HANDLER TESTS
// =============================================================================

describe("DELETE /api/characters/[characterId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 403 when not authorized", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({
        authorized: false,
        character: null,
        error: "Permission denied: delete",
        status: 403,
      })
    );

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Permission denied: delete");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({
        authorized: false,
        character: null,
        error: "Character not found",
        status: 404,
      })
    );

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 200 with success message on delete", async () => {
    const mockCharacter = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(deleteCharacter).mockResolvedValue(true);

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Character deleted");
    expect(deleteCharacter).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
  });

  it("should return 500 on storage error", async () => {
    const mockCharacter = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(authorizeOwnerAccess).mockResolvedValue(
      createAuthResult({ character: mockCharacter })
    );
    vi.mocked(deleteCharacter).mockRejectedValue(new Error("Storage error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete character");

    consoleSpy.mockRestore();
  });
});
