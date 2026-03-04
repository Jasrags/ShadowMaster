/**
 * Tests for /api/characters/[characterId]/inventory/containers endpoint
 *
 * Tests container operations: add, remove, and move items.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, DELETE, PATCH } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as characterStorageModule from "@/lib/storage/characters";
import * as authorizationModule from "@/lib/auth/character-authorization";

import type { Character, GearItem } from "@/lib/types";

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
    gear: [
      {
        id: "backpack-1",
        name: "Backpack",
        category: "gear",
        quantity: 1,
        cost: 50,
        weight: 1,
        containerProperties: {
          weightCapacity: 20,
          slotCapacity: 10,
        },
        state: { readiness: "carried", wirelessEnabled: false },
      } as GearItem,
      {
        id: "medkit-1",
        name: "Medkit",
        category: "gear",
        quantity: 1,
        cost: 500,
        weight: 3,
        state: { readiness: "carried", wirelessEnabled: true },
      } as GearItem,
      {
        id: "tool-1",
        name: "Tool Kit",
        category: "gear",
        quantity: 1,
        cost: 200,
        weight: 5,
        state: {
          readiness: "carried",
          wirelessEnabled: false,
          containedIn: { containerId: "backpack-1" },
        },
      } as GearItem,
    ],
    karmaCurrent: 10,
    karmaTotal: 10,
    nuyen: 1000,
    startingNuyen: 5000,
    ...overrides,
  } as Character;
}

const userId = "test-user-id";
const characterId = "test-char-id";
const baseUrl = `http://localhost:3000/api/characters/${characterId}/inventory/containers`;

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
// POST - Add item to container
// =============================================================================

describe("POST /api/characters/[characterId]/inventory/containers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      baseUrl,
      { itemId: "medkit-1", containerId: "backpack-1" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    expect(response.status).toBe(401);
  });

  it("should return 400 when missing required fields", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, { itemId: "medkit-1" }, "POST");
    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  it("should add item to container successfully", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(
      baseUrl,
      { itemId: "medkit-1", containerId: "backpack-1", slot: "main" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.container).toEqual({ containerId: "backpack-1", slot: "main" });
    expect(characterStorageModule.updateCharacter).toHaveBeenCalledWith(
      userId,
      characterId,
      expect.objectContaining({ gear: expect.any(Array) })
    );
  });

  it("should return 400 when container does not exist", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(
      baseUrl,
      { itemId: "medkit-1", containerId: "nonexistent" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it("should return 400 for circular containment", async () => {
    // backpack-1 contains tool-1; trying to put backpack-1 into tool-1 is not possible
    // since tool-1 is not a container. Let's test self-containment instead.
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(
      baseUrl,
      { itemId: "backpack-1", containerId: "backpack-1" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});

// =============================================================================
// DELETE - Remove item from container
// =============================================================================

describe("DELETE /api/characters/[characterId]/inventory/containers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(baseUrl, { itemId: "tool-1" }, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });
    expect(response.status).toBe(401);
  });

  it("should return 400 when missing itemId", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, {}, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required field");
  });

  it("should remove item from container successfully", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, { itemId: "tool-1" }, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.removedFrom).toEqual({ containerId: "backpack-1", slot: undefined });
    expect(characterStorageModule.updateCharacter).toHaveBeenCalled();
  });

  it("should return 400 when item is not in a container", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, { itemId: "medkit-1" }, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("not in a container");
  });

  it("should return 400 when item does not exist", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, { itemId: "nonexistent" }, "DELETE");
    const response = await DELETE(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});

// =============================================================================
// PATCH - Move item between containers
// =============================================================================

describe("PATCH /api/characters/[characterId]/inventory/containers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      baseUrl,
      { itemId: "tool-1", newContainerId: "backpack-1" },
      "PATCH"
    );
    const response = await PATCH(request, { params: Promise.resolve({ characterId }) });
    expect(response.status).toBe(401);
  });

  it("should return 400 when missing required fields", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(baseUrl, { itemId: "tool-1" }, "PATCH");
    const response = await PATCH(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required fields");
  });

  it("should move item between containers successfully", async () => {
    // Add a second container and move tool-1 from backpack-1 to duffel-1
    const character = createMockCharacter({
      gear: [
        {
          id: "backpack-1",
          name: "Backpack",
          category: "gear",
          quantity: 1,
          cost: 50,
          weight: 1,
          containerProperties: { weightCapacity: 20, slotCapacity: 10 },
          state: { readiness: "carried", wirelessEnabled: false },
        } as GearItem,
        {
          id: "duffel-1",
          name: "Duffel Bag",
          category: "gear",
          quantity: 1,
          cost: 30,
          weight: 0.5,
          containerProperties: { weightCapacity: 30, slotCapacity: 15 },
          state: { readiness: "carried", wirelessEnabled: false },
        } as GearItem,
        {
          id: "tool-1",
          name: "Tool Kit",
          category: "gear",
          quantity: 1,
          cost: 200,
          weight: 5,
          state: {
            readiness: "carried",
            wirelessEnabled: false,
            containedIn: { containerId: "backpack-1" },
          },
        } as GearItem,
      ],
    });
    mockAuthorized(character);

    const request = createMockRequest(
      baseUrl,
      { itemId: "tool-1", newContainerId: "duffel-1", slot: "side-pocket" },
      "PATCH"
    );
    const response = await PATCH(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.container).toEqual({ containerId: "duffel-1", slot: "side-pocket" });
    expect(characterStorageModule.updateCharacter).toHaveBeenCalled();
  });

  it("should return 400 when target container does not exist", async () => {
    const character = createMockCharacter();
    mockAuthorized(character);

    const request = createMockRequest(
      baseUrl,
      { itemId: "tool-1", newContainerId: "nonexistent" },
      "PATCH"
    );
    const response = await PATCH(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
