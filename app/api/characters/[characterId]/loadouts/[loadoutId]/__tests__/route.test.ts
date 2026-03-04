/**
 * Tests for /api/characters/[characterId]/loadouts/[loadoutId] endpoint
 *
 * Tests loadout update and deletion.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH, DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as characterStorageModule from "@/lib/storage/characters";
import * as authorizationModule from "@/lib/auth/character-authorization";

import type { Character } from "@/lib/types";
import type { Loadout } from "@/lib/types/gear-state";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/auth/character-authorization");

function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
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

const mockLoadout: Loadout = {
  id: "loadout-1",
  name: "Street Run",
  gearAssignments: { "weapon-1": "holstered", "armor-1": "worn" },
  defaultReadiness: "stashed",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "test-char-id",
    ownerId: "test-user-id",
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    rulesetSnapshotId: "snapshot-1",
    name: "Test Character",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attributes: { strength: 4 },
    weapons: [],
    armor: [],
    gear: [],
    loadouts: [mockLoadout],
    activeLoadoutId: "loadout-1",
    karmaCurrent: 10,
    karmaTotal: 10,
    nuyen: 1000,
    startingNuyen: 5000,
    ...overrides,
  } as Character;
}

const userId = "test-user-id";
const characterId = "test-char-id";
const loadoutId = "loadout-1";
const baseUrl = `http://localhost:3000/api/characters/${characterId}/loadouts/${loadoutId}`;

function mockAuthorized(character: Character) {
  vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
  vi.mocked(authorizationModule.authorizeOwnerAccess).mockResolvedValue({
    authorized: true,
    character,
    campaign: null,
    role: "owner",
    permissions: ["view", "edit"],
    status: 200,
  });
  vi.mocked(characterStorageModule.updateCharacter).mockResolvedValue(character);
}

// =============================================================================
// PATCH - Update loadout
// =============================================================================

describe("PATCH /api/characters/[characterId]/loadouts/[loadoutId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(baseUrl, { name: "Updated" }, "PATCH");
    const response = await PATCH(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    expect(response.status).toBe(401);
  });

  it("should return 404 when loadout does not exist", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, { name: "Updated" }, "PATCH");
    const response = await PATCH(request, {
      params: Promise.resolve({ characterId, loadoutId: "nonexistent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Loadout not found");
  });

  it("should return 400 when no update fields provided", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, {}, "PATCH");
    const response = await PATCH(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("At least one field");
  });

  it("should update loadout name successfully", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, { name: "Stealth Mission" }, "PATCH");
    const response = await PATCH(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.loadout.name).toBe("Stealth Mission");
    expect(data.loadout.id).toBe(loadoutId);
    expect(characterStorageModule.updateCharacter).toHaveBeenCalled();
  });

  it("should update loadout description to empty string", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, { description: "" }, "PATCH");
    const response = await PATCH(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.loadout.description).toBe("");
  });

  it("should update multiple fields at once", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(
      baseUrl,
      { name: "Combat", defaultReadiness: "carried" },
      "PATCH"
    );
    const response = await PATCH(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.loadout.name).toBe("Combat");
    expect(data.loadout.defaultReadiness).toBe("carried");
  });
});

// =============================================================================
// DELETE - Delete loadout
// =============================================================================

describe("DELETE /api/characters/[characterId]/loadouts/[loadoutId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(baseUrl, undefined, "DELETE");
    const response = await DELETE(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    expect(response.status).toBe(401);
  });

  it("should return 404 when loadout does not exist", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, undefined, "DELETE");
    const response = await DELETE(request, {
      params: Promise.resolve({ characterId, loadoutId: "nonexistent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Loadout not found");
  });

  it("should delete loadout successfully", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, undefined, "DELETE");
    const response = await DELETE(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.deletedLoadoutId).toBe(loadoutId);
    expect(characterStorageModule.updateCharacter).toHaveBeenCalledWith(
      userId,
      characterId,
      expect.objectContaining({
        loadouts: [],
        activeLoadoutId: undefined,
      })
    );
  });

  it("should preserve activeLoadoutId when deleting a different loadout", async () => {
    const otherLoadout: Loadout = {
      id: "loadout-2",
      name: "Other",
      gearAssignments: {},
      defaultReadiness: "stashed",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    };
    const character = createMockCharacter({
      loadouts: [mockLoadout, otherLoadout],
      activeLoadoutId: "loadout-1",
    });
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, undefined, "DELETE");
    const response = await DELETE(request, {
      params: Promise.resolve({ characterId, loadoutId: "loadout-2" }),
    });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(characterStorageModule.updateCharacter).toHaveBeenCalledWith(
      userId,
      characterId,
      expect.objectContaining({
        activeLoadoutId: "loadout-1",
      })
    );
  });
});
