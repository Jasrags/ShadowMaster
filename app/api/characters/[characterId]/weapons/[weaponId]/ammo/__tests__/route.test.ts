/**
 * Tests for /api/characters/[characterId]/weapons/[weaponId]/ammo endpoint
 *
 * Tests ammunition loading, unloading, and magazine swapping.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST, DELETE, PATCH } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as characterStorageModule from "@/lib/storage/characters";
import * as authorizationModule from "@/lib/auth/character-authorization";

import type { Character, Weapon } from "@/lib/types";
import type { AmmunitionItem, MagazineItem } from "@/lib/types/gear-state";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/auth/character-authorization");

// Helper to create a NextRequest
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

// Create mock character
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
    ammunition: [],
    karmaCurrent: 10,
    karmaTotal: 10,
    nuyen: 1000,
    startingNuyen: 5000,
    ...overrides,
  } as Character;
}

describe("GET /api/characters/[characterId]/weapons/[weaponId]/ammo", () => {
  const userId = "test-user-id";
  const characterId = "test-char-id";
  const weaponId = "weapon-1";
  let mockCharacter: Character;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
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
          ammoCapacity: 15,
          currentAmmo: 10,
          ammoState: {
            loadedAmmoTypeId: "9mm-regular",
            currentRounds: 10,
            magazineCapacity: 15,
          },
        } as Weapon,
      ],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(authorizationModule.authorizeOwnerAccess).mockResolvedValue({
      authorized: true,
      character: mockCharacter,
      campaign: null,
      role: "owner",
      permissions: ["view", "edit"],
      status: 200,
    });
  });

  it("should return weapon ammo state", async () => {
    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`
    );

    const response = await GET(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.ammoState).toBeDefined();
    expect(data.ammoState.currentRounds).toBe(10);
    expect(data.ammoState.magazineCapacity).toBe(15);
    expect(data.ammoState.loadedAmmoTypeId).toBe("9mm-regular");
    expect(data.ammoState.usesAmmo).toBe(true);
  });

  it("should return 404 for non-existent weapon", async () => {
    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/non-existent/ammo`
    );

    const response = await GET(request, {
      params: Promise.resolve({ characterId, weaponId: "non-existent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`
    );

    const response = await GET(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });
});

describe("POST /api/characters/[characterId]/weapons/[weaponId]/ammo", () => {
  const userId = "test-user-id";
  const characterId = "test-char-id";
  const weaponId = "weapon-1";
  let mockCharacter: Character;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
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
          ammoCapacity: 15,
          currentAmmo: 0,
          ammoState: {
            loadedAmmoTypeId: null,
            currentRounds: 0,
            magazineCapacity: 15,
          },
        } as Weapon,
      ],
      ammunition: [
        {
          id: "ammo-1",
          catalogId: "9mm-regular",
          name: "Regular Rounds",
          caliber: "heavy-pistol",
          ammoType: "regular",
          quantity: 50,
          damageModifier: 0,
          apModifier: 0,
          cost: 20,
          availability: 2,
        } as AmmunitionItem,
      ],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(authorizationModule.authorizeOwnerAccess).mockResolvedValue({
      authorized: true,
      character: mockCharacter,
      campaign: null,
      role: "owner",
      permissions: ["view", "edit"],
      status: 200,
    });
    vi.mocked(characterStorageModule.updateCharacter).mockResolvedValue(mockCharacter);
  });

  it("should load ammunition into weapon", async () => {
    const requestBody = {
      ammoItemId: "ammo-1",
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`,
      requestBody,
      "POST"
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.roundsLoaded).toBe(15); // Full magazine
    expect(data.remainingAmmo).toBe(35); // 50 - 15
  });

  it("should load specified quantity of ammunition", async () => {
    const requestBody = {
      ammoItemId: "ammo-1",
      quantity: 10,
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`,
      requestBody,
      "POST"
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.roundsLoaded).toBe(10);
    expect(data.remainingAmmo).toBe(40);
  });

  it("should return 400 for missing ammoItemId", async () => {
    const requestBody = {};

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`,
      requestBody,
      "POST"
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("should return 404 for non-existent ammunition", async () => {
    const requestBody = {
      ammoItemId: "non-existent",
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`,
      requestBody,
      "POST"
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });
});

describe("DELETE /api/characters/[characterId]/weapons/[weaponId]/ammo", () => {
  const userId = "test-user-id";
  const characterId = "test-char-id";
  const weaponId = "weapon-1";
  let mockCharacter: Character;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
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
          ammoCapacity: 15,
          currentAmmo: 10,
          ammoState: {
            loadedAmmoTypeId: "9mm-regular",
            currentRounds: 10,
            magazineCapacity: 15,
          },
        } as Weapon,
      ],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(authorizationModule.authorizeOwnerAccess).mockResolvedValue({
      authorized: true,
      character: mockCharacter,
      campaign: null,
      role: "owner",
      permissions: ["view", "edit"],
      status: 200,
    });
    vi.mocked(characterStorageModule.updateCharacter).mockResolvedValue(mockCharacter);
  });

  it("should unload ammunition from weapon", async () => {
    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`,
      undefined,
      "DELETE"
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.roundsUnloaded).toBe(10);
    expect(data.returnedAmmo).toBeDefined();
  });

  it("should handle unloading empty weapon", async () => {
    mockCharacter = createMockCharacter({
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
          ammoCapacity: 15,
          currentAmmo: 0,
          ammoState: {
            loadedAmmoTypeId: null,
            currentRounds: 0,
            magazineCapacity: 15,
          },
        } as Weapon,
      ],
    });

    vi.mocked(authorizationModule.authorizeOwnerAccess).mockResolvedValue({
      authorized: true,
      character: mockCharacter,
      campaign: null,
      role: "owner",
      permissions: ["view", "edit"],
      status: 200,
    });

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`,
      undefined,
      "DELETE"
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.roundsUnloaded).toBe(0);
  });
});

describe("PATCH /api/characters/[characterId]/weapons/[weaponId]/ammo", () => {
  const userId = "test-user-id";
  const characterId = "test-char-id";
  const weaponId = "weapon-1";
  let mockCharacter: Character;

  beforeEach(() => {
    vi.clearAllMocks();

    const spareMagazine: MagazineItem = {
      id: "mag-1",
      weaponCompatibility: ["heavy-pistol"],
      capacity: 15,
      loadedAmmoTypeId: "9mm-apds",
      currentRounds: 15,
      cost: 5,
    };

    mockCharacter = createMockCharacter({
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
          ammoCapacity: 15,
          currentAmmo: 3,
          ammoState: {
            loadedAmmoTypeId: "9mm-regular",
            currentRounds: 3,
            magazineCapacity: 15,
          },
          spareMagazines: [spareMagazine],
        } as Weapon,
      ],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(authorizationModule.authorizeOwnerAccess).mockResolvedValue({
      authorized: true,
      character: mockCharacter,
      campaign: null,
      role: "owner",
      permissions: ["view", "edit"],
      status: 200,
    });
    vi.mocked(characterStorageModule.updateCharacter).mockResolvedValue(mockCharacter);
  });

  it("should swap magazine", async () => {
    const requestBody = {
      magazineId: "mag-1",
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`,
      requestBody,
      "PATCH"
    );

    const response = await PATCH(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.oldMagazine).toBeDefined();
    expect(data.oldMagazine.currentRounds).toBe(3);
    expect(data.oldMagazine.loadedAmmoTypeId).toBe("9mm-regular");
  });

  it("should return 400 for missing magazineId", async () => {
    const requestBody = {};

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`,
      requestBody,
      "PATCH"
    );

    const response = await PATCH(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("should return 404 for non-existent magazine", async () => {
    const requestBody = {
      magazineId: "non-existent",
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/weapons/${weaponId}/ammo`,
      requestBody,
      "PATCH"
    );

    const response = await PATCH(request, {
      params: Promise.resolve({ characterId, weaponId }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });
});
