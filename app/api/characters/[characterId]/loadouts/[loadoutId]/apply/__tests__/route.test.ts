/**
 * Tests for /api/characters/[characterId]/loadouts/[loadoutId]/apply endpoint
 *
 * Tests loadout application.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as characterStorageModule from "@/lib/storage/characters";
import * as authorizationModule from "@/lib/auth/character-authorization";

import type { Character, Weapon, ArmorItem } from "@/lib/types";
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
  name: "Combat Ready",
  gearAssignments: { "weapon-1": "readied", "armor-1": "worn" },
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
    weapons: [
      {
        id: "weapon-1",
        name: "Ares Predator V",
        damage: "8P",
        ap: -1,
        mode: ["SA"],
        subcategory: "heavy-pistol",
        category: "ranged",
        quantity: 1,
        cost: 725,
        weight: 1.5,
        state: { readiness: "stashed", wirelessEnabled: true },
      } as Weapon,
    ],
    armor: [
      {
        id: "armor-1",
        name: "Armor Jacket",
        armorRating: 12,
        equipped: false,
        category: "armor",
        quantity: 1,
        cost: 1000,
        weight: 2,
        state: { readiness: "stashed", wirelessEnabled: true },
      } as ArmorItem,
    ],
    gear: [],
    loadouts: [mockLoadout],
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
const baseUrl = `http://localhost:3000/api/characters/${characterId}/loadouts/${loadoutId}/apply`;

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

describe("POST /api/characters/[characterId]/loadouts/[loadoutId]/apply", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(baseUrl, {}, "POST");
    const response = await POST(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    expect(response.status).toBe(401);
  });

  it("should return 404 when loadout does not exist", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, {}, "POST");
    const response = await POST(request, {
      params: Promise.resolve({ characterId, loadoutId: "nonexistent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Loadout not found");
  });

  it("should apply loadout successfully", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, {}, "POST");
    const response = await POST(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.activeLoadoutId).toBe(loadoutId);
    expect(data.diff).toBeDefined();
    expect(data.diff.itemsToBring).toContain("weapon-1");
    expect(data.diff.itemsToBring).toContain("armor-1");
    expect(data.errors).toBeUndefined();
    expect(characterStorageModule.updateCharacter).toHaveBeenCalledWith(
      userId,
      characterId,
      expect.objectContaining({
        activeLoadoutId: loadoutId,
        gear: expect.any(Array),
        weapons: expect.any(Array),
        armor: expect.any(Array),
      })
    );
  });

  it("should apply loadout with no changes when gear already matches", async () => {
    const character = createMockCharacter({
      weapons: [
        {
          id: "weapon-1",
          name: "Ares Predator V",
          damage: "8P",
          ap: -1,
          mode: ["SA"],
          subcategory: "heavy-pistol",
          category: "ranged",
          quantity: 1,
          cost: 725,
          weight: 1.5,
          state: { readiness: "readied", wirelessEnabled: true },
        } as Weapon,
      ],
      armor: [
        {
          id: "armor-1",
          name: "Armor Jacket",
          armorRating: 12,
          equipped: true,
          category: "armor",
          quantity: 1,
          cost: 1000,
          weight: 2,
          state: { readiness: "worn", wirelessEnabled: true },
        } as ArmorItem,
      ],
    });
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, {}, "POST");
    const response = await POST(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.diff.itemsToBring).toHaveLength(0);
    expect(data.diff.itemsToStash).toHaveLength(0);
    expect(data.diff.itemsToMove).toHaveLength(0);
  });

  it("should return 404 for character not found", async () => {
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

    const request = createMockRequest(baseUrl, {}, "POST");
    const response = await POST(request, {
      params: Promise.resolve({ characterId, loadoutId }),
    });
    expect(response.status).toBe(404);
  });
});
