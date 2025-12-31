/**
 * Tests for /api/characters/[characterId]/wireless endpoint
 *
 * Tests wireless state retrieval and toggling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as characterStorageModule from "@/lib/storage/characters";
import * as authorizationModule from "@/lib/auth/character-authorization";

import type { Character, Weapon, CyberwareItem } from "@/lib/types";

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
    wirelessBonusesEnabled: true,
    weapons: [],
    armor: [],
    gear: [],
    cyberware: [],
    bioware: [],
    karmaCurrent: 10,
    karmaTotal: 10,
    nuyen: 1000,
    startingNuyen: 5000,
    ...overrides,
  } as Character;
}

describe("GET /api/characters/[characterId]/wireless", () => {
  const userId = "test-user-id";
  const characterId = "test-char-id";
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
          state: { readiness: "holstered", wirelessEnabled: true },
        } as Weapon,
      ],
      cyberware: [
        {
          id: "cyber-1",
          catalogId: "wired-reflexes-1",
          name: "Wired Reflexes 1",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 2,
          essenceCost: 2,
          cost: 39000,
          availability: 8,
          wirelessEnabled: true,
          wirelessEffects: [
            { type: "initiative", modifier: 1 },
          ],
        } as CyberwareItem,
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

  it("should return wireless state for character", async () => {
    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`
    );

    const response = await GET(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.wirelessState).toBeDefined();
    expect(data.wirelessState.globalEnabled).toBe(true);
    expect(data.wirelessState.items.weapons).toHaveLength(1);
    expect(data.wirelessState.items.cyberware).toHaveLength(1);
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`
    );

    const response = await GET(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });
});

describe("PATCH /api/characters/[characterId]/wireless", () => {
  const userId = "test-user-id";
  const characterId = "test-char-id";
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
          state: { readiness: "holstered", wirelessEnabled: true },
        } as Weapon,
      ],
      cyberware: [
        {
          id: "cyber-1",
          catalogId: "wired-reflexes-1",
          name: "Wired Reflexes 1",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 2,
          essenceCost: 2,
          cost: 39000,
          availability: 8,
          wirelessEnabled: true,
        } as CyberwareItem,
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

  it("should toggle global wireless state", async () => {
    const requestBody = {
      global: true,
      enabled: false,
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`,
      requestBody,
      "PATCH"
    );

    const response = await PATCH(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.previousState).toBe(true);
    expect(data.newState).toBe(false);
  });

  it("should toggle individual weapon wireless", async () => {
    const requestBody = {
      itemId: "weapon-1",
      itemType: "weapon",
      enabled: false,
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`,
      requestBody,
      "PATCH"
    );

    const response = await PATCH(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.previousState).toBe(true);
    expect(data.newState).toBe(false);
  });

  it("should toggle individual cyberware wireless", async () => {
    const requestBody = {
      itemId: "cyber-1",
      itemType: "cyberware",
      enabled: false,
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`,
      requestBody,
      "PATCH"
    );

    const response = await PATCH(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.previousState).toBe(true);
    expect(data.newState).toBe(false);
  });

  it("should return 404 for non-existent item", async () => {
    const requestBody = {
      itemId: "non-existent",
      itemType: "weapon",
      enabled: false,
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`,
      requestBody,
      "PATCH"
    );

    const response = await PATCH(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });

  it("should return 400 for missing required fields", async () => {
    const requestBody = {
      enabled: false,
      // Missing itemId and itemType without global flag
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`,
      requestBody,
      "PATCH"
    );

    const response = await PATCH(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});

describe("POST /api/characters/[characterId]/wireless", () => {
  const userId = "test-user-id";
  const characterId = "test-char-id";
  let mockCharacter: Character;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      wirelessBonusesEnabled: true,
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

  it("should toggle all wireless off", async () => {
    const requestBody = {
      enabled: false,
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`,
      requestBody,
      "POST"
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.globalEnabled).toBe(false);
  });

  it("should toggle all wireless on", async () => {
    mockCharacter = createMockCharacter({
      wirelessBonusesEnabled: false,
    });

    vi.mocked(authorizationModule.authorizeOwnerAccess).mockResolvedValue({
      authorized: true,
      character: mockCharacter,
      campaign: null,
      role: "owner",
      permissions: ["view", "edit"],
      status: 200,
    });

    const requestBody = {
      enabled: true,
    };

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`,
      requestBody,
      "POST"
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.globalEnabled).toBe(true);
  });

  it("should return 400 for missing enabled field", async () => {
    const requestBody = {};

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${characterId}/wireless`,
      requestBody,
      "POST"
    );

    const response = await POST(request, { params: Promise.resolve({ characterId }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
