/**
 * Integration tests for Networking API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/social-actions/networking - Perform networking action
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
  getCharacter: vi.fn(),
  saveCharacter: vi.fn(),
}));

vi.mock("@/lib/storage/social-capital", () => ({
  getSocialCapital: vi.fn(),
}));

vi.mock("@/lib/rules/social-actions", () => ({
  calculateSocialDicePool: vi.fn(),
  resolveNetworking: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { getSocialCapital } from "@/lib/storage/social-capital";
import { calculateSocialDicePool, resolveNetworking } from "@/lib/rules/social-actions";
import { POST } from "../route";
import type { Character, User } from "@/lib/types";
import type { SocialCapital } from "@/lib/types/contacts";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: TEST_USER_ID,
    username: "testuser",
    email: "test@example.com",
    passwordHash: "hashedpassword",
    role: "player",
    createdAt: new Date().toISOString(),
    ...overrides,
  } as User;
}

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Runner",
    status: "active",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: { cha: 4 },
    skills: { etiquette: 3 },
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    karmaCurrent: 10,
    karmaTotal: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    contacts: [],
    ...overrides,
  } as Character;
}

function createMockSocialCapital(overrides: Partial<SocialCapital> = {}): SocialCapital {
  return {
    characterId: TEST_CHARACTER_ID,
    maxContactPoints: 25,
    usedContactPoints: 5,
    availableContactPoints: 20,
    totalContacts: 1,
    activeContacts: 1,
    burnedContacts: 0,
    inactiveContacts: 0,
    networkingBonus: 2,
    socialLimitModifier: 0,
    loyaltyBonus: 0,
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockDicePoolInfo(overrides = {}) {
  return {
    dicePool: 7,
    basePool: 7,
    modifiers: [],
    skill: "etiquette",
    attribute: "cha",
    ...overrides,
  };
}

function createMockNetworkingResult(overrides = {}) {
  return {
    success: true,
    contactFound: true,
    suggestedConnection: 3,
    suggestedLoyalty: 2,
    timeSpent: "1 day",
    nuyenSpent: 500,
    bonusFromNuyen: 1,
    ...overrides,
  };
}

function createMockRequest(options: { method?: string; body?: unknown; url?: string }) {
  const baseUrl =
    options.url ||
    `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/social-actions/networking`;
  const url = new URL(baseUrl);
  const request = new NextRequest(url, {
    method: options.method || "POST",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  return request;
}

// =============================================================================
// POST /api/characters/[characterId]/social-actions/networking
// =============================================================================

describe("POST /api/characters/[characterId]/social-actions/networking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 3 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(null);

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 3 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(null);

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 3 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 400 when targetArchetype missing", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest({
      method: "POST",
      body: { diceRoll: 3 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Target archetype is required");
  });

  it("should return 400 when diceRoll missing", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Dice roll must be a non-negative number");
  });

  it("should return 400 when diceRoll is negative", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: -5 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Dice roll must be a non-negative number");
  });

  it("should return 400 when diceRoll is not a number", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: "three" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Dice roll must be a non-negative number");
  });

  it("should return 400 when insufficient nuyen", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ nuyen: 100 }));

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 3, nuyenBudget: 500 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Insufficient nuyen");
  });

  it("should return success when contact found (returns suggestedContact)", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockResolvedValue(createMockSocialCapital());
    vi.mocked(calculateSocialDicePool).mockReturnValue(createMockDicePoolInfo());
    vi.mocked(resolveNetworking).mockReturnValue(
      createMockNetworkingResult({ contactFound: true })
    );

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 4, nuyenBudget: 500 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contactFound).toBe(true);
    expect(data.suggestedContact).toBeDefined();
  });

  it("should return suggestedContact with correct structure", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockResolvedValue(createMockSocialCapital());
    vi.mocked(calculateSocialDicePool).mockReturnValue(createMockDicePoolInfo());
    vi.mocked(resolveNetworking).mockReturnValue(
      createMockNetworkingResult({
        contactFound: true,
        suggestedConnection: 4,
        suggestedLoyalty: 3,
      })
    );

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Street Doc", diceRoll: 5, location: "Downtown" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(data.suggestedContact).toMatchObject({
      name: "",
      archetype: "Street Doc",
      connection: 4,
      loyalty: 3,
      location: "Downtown",
      group: "personal",
    });
  });

  it("should deduct nuyen via saveCharacter", async () => {
    const mockCharacter = createMockCharacter({ nuyen: 2000 });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(getSocialCapital).mockResolvedValue(createMockSocialCapital());
    vi.mocked(calculateSocialDicePool).mockReturnValue(createMockDicePoolInfo());
    vi.mocked(resolveNetworking).mockReturnValue(createMockNetworkingResult({ nuyenSpent: 500 }));
    vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 3, nuyenBudget: 500 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await POST(request, { params });

    expect(saveCharacter).toHaveBeenCalledWith(
      expect.objectContaining({
        nuyen: 1500, // 2000 - 500
      })
    );
  });

  it("should not call saveCharacter when nuyenSpent=0", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockResolvedValue(createMockSocialCapital());
    vi.mocked(calculateSocialDicePool).mockReturnValue(createMockDicePoolInfo());
    vi.mocked(resolveNetworking).mockReturnValue(createMockNetworkingResult({ nuyenSpent: 0 }));

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 3, nuyenBudget: 0 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await POST(request, { params });

    expect(saveCharacter).not.toHaveBeenCalled();
  });

  it("should return contactFound: false when networking fails", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockResolvedValue(createMockSocialCapital());
    vi.mocked(calculateSocialDicePool).mockReturnValue(createMockDicePoolInfo());
    vi.mocked(resolveNetworking).mockReturnValue(
      createMockNetworkingResult({ contactFound: false, success: false })
    );

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 0 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contactFound).toBe(false);
    expect(data.suggestedContact).toBeUndefined();
  });

  it("should return dicePool information", async () => {
    const dicePoolInfo = createMockDicePoolInfo({
      dicePool: 9,
      basePool: 7,
      modifiers: [{ source: "Networking Bonus", modifier: 2, category: "quality" }],
      skill: "etiquette",
      attribute: "cha",
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockResolvedValue(createMockSocialCapital());
    vi.mocked(calculateSocialDicePool).mockReturnValue(dicePoolInfo);
    vi.mocked(resolveNetworking).mockReturnValue(createMockNetworkingResult());

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 3 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(data.dicePool).toMatchObject({
      base: 7,
      total: 9,
      skill: "etiquette",
      attribute: "cha",
    });
    expect(data.dicePool.modifiers).toHaveLength(1);
  });

  it("should return 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({
      method: "POST",
      body: { targetArchetype: "Fixer", diceRoll: 3 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to perform networking action");
  });
});
