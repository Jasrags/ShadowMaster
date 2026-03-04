/**
 * Tests for /api/characters/[characterId]/loadouts endpoint
 *
 * Tests loadout listing and creation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
const baseUrl = `http://localhost:3000/api/characters/${characterId}/loadouts`;

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
// GET - List loadouts
// =============================================================================

describe("GET /api/characters/[characterId]/loadouts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(baseUrl);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });
    expect(response.status).toBe(401);
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(authorizationModule.authorizeOwnerAccess).mockResolvedValue({
      authorized: false,
      character: null,
      campaign: null,
      role: "owner",
      permissions: [],
      error: "Character not found",
      status: 404,
    });

    const request = createMockRequest(baseUrl);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });
    expect(response.status).toBe(404);
  });

  it("should return loadouts and activeLoadoutId", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.loadouts).toHaveLength(1);
    expect(data.loadouts[0].name).toBe("Street Run");
    expect(data.activeLoadoutId).toBe("loadout-1");
  });

  it("should return empty loadouts for character without any", async () => {
    const character = createMockCharacter({ loadouts: undefined, activeLoadoutId: undefined });
    mockAuthorized(character);

    const request = createMockRequest(baseUrl);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.loadouts).toEqual([]);
    expect(data.activeLoadoutId).toBeUndefined();
  });
});

// =============================================================================
// POST - Create loadout
// =============================================================================

describe("POST /api/characters/[characterId]/loadouts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      baseUrl,
      { name: "Test", defaultReadiness: "stashed", gearAssignments: {} },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    expect(response.status).toBe(401);
  });

  it("should return 400 when missing name", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(
      baseUrl,
      { defaultReadiness: "stashed", gearAssignments: {} },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  it("should return 400 when missing defaultReadiness", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, { name: "Test", gearAssignments: {} }, "POST");
    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  it("should create loadout successfully", async () => {
    const character = createMockCharacter({ loadouts: [] });
    mockAuthorized(character);

    const request = createMockRequest(
      baseUrl,
      {
        name: "Combat Ready",
        description: "Full combat gear",
        defaultReadiness: "stashed",
        gearAssignments: { "weapon-1": "readied" },
      },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.loadout).toBeDefined();
    expect(data.loadout.name).toBe("Combat Ready");
    expect(data.loadout.description).toBe("Full combat gear");
    expect(data.loadout.id).toMatch(/^loadout-/);
    expect(characterStorageModule.updateCharacter).toHaveBeenCalledWith(
      userId,
      characterId,
      expect.objectContaining({ loadouts: expect.any(Array) })
    );
  });
});
