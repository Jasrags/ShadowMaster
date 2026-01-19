/**
 * Integration tests for Social Capital API endpoints
 *
 * Tests:
 * - GET /api/characters/[characterId]/social-capital - Get character's social capital
 * - POST /api/characters/[characterId]/social-capital - Recalculate social capital
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
}));

vi.mock("@/lib/storage/social-capital", () => ({
  getSocialCapital: vi.fn(),
  recalculateSocialCapital: vi.fn(),
  updateSocialCapital: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import {
  getSocialCapital,
  recalculateSocialCapital,
  updateSocialCapital,
} from "@/lib/storage/social-capital";
import { GET, POST } from "../route";
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
    attributes: {},
    skills: {},
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
    networkingBonus: 0,
    socialLimitModifier: 0,
    loyaltyBonus: 0,
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockRequest(options: { method?: string; body?: unknown; url?: string }) {
  const baseUrl =
    options.url || `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/social-capital`;
  const url = new URL(baseUrl);
  const request = new NextRequest(url, {
    method: options.method || "GET",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  return request;
}

// =============================================================================
// GET /api/characters/[characterId]/social-capital
// =============================================================================

describe("GET /api/characters/[characterId]/social-capital", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(null);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(null);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return social capital with availablePoints calculated", async () => {
    const mockSocialCapital = createMockSocialCapital({
      maxContactPoints: 30,
      usedContactPoints: 10,
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockResolvedValue(mockSocialCapital);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.socialCapital).toBeDefined();
    expect(data.availablePoints).toBe(20); // 30 - 10
  });

  it("should return null when social capital not initialized", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockResolvedValue(null);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.socialCapital).toBeNull();
    expect(data.availablePoints).toBeNull();
  });

  it("should calculate availablePoints correctly (max - used)", async () => {
    const mockSocialCapital = createMockSocialCapital({
      maxContactPoints: 50,
      usedContactPoints: 35,
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockResolvedValue(mockSocialCapital);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.availablePoints).toBe(15); // 50 - 35
  });

  it("should return 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get social capital");
  });

  it("should verify storage called with correct args", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getSocialCapital).mockResolvedValue(createMockSocialCapital());

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await GET(request, { params });

    expect(getCharacter).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    expect(getSocialCapital).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
  });
});

// =============================================================================
// POST /api/characters/[characterId]/social-capital
// =============================================================================

describe("POST /api/characters/[characterId]/social-capital", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({ method: "POST" });
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

    const request = createMockRequest({ method: "POST" });
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

    const request = createMockRequest({ method: "POST" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should recalculate without body", async () => {
    const recalculatedCapital = createMockSocialCapital({
      maxContactPoints: 25,
      usedContactPoints: 10,
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(recalculateSocialCapital).mockResolvedValue(recalculatedCapital);

    // Create request without body
    const url = new URL(`http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/social-capital`);
    const request = new NextRequest(url, { method: "POST" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.socialCapital).toBeDefined();
    expect(recalculateSocialCapital).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    expect(updateSocialCapital).not.toHaveBeenCalled();
  });

  it("should handle invalid JSON gracefully", async () => {
    const recalculatedCapital = createMockSocialCapital();

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(recalculateSocialCapital).mockResolvedValue(recalculatedCapital);

    // Create request with invalid JSON body
    const url = new URL(`http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/social-capital`);
    const request = new NextRequest(url, {
      method: "POST",
      body: "not valid json",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    // Should succeed (invalid JSON is treated as no body)
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(recalculateSocialCapital).toHaveBeenCalled();
    expect(updateSocialCapital).not.toHaveBeenCalled();
  });

  it("should apply updates when body provided", async () => {
    const recalculatedCapital = createMockSocialCapital();
    const updatedCapital = createMockSocialCapital({
      campaignMaxConnection: 6,
      networkingBonus: 2,
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(recalculateSocialCapital).mockResolvedValue(recalculatedCapital);
    vi.mocked(updateSocialCapital).mockResolvedValue(updatedCapital);

    const updates = { campaignMaxConnection: 6, networkingBonus: 2 };
    const request = createMockRequest({ method: "POST", body: updates });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(updateSocialCapital).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, updates);
  });

  it("should call updateSocialCapital only when updates exist", async () => {
    const recalculatedCapital = createMockSocialCapital();

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(recalculateSocialCapital).mockResolvedValue(recalculatedCapital);

    // Empty object body should not trigger update
    const request = createMockRequest({ method: "POST", body: {} });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });

    expect(response.status).toBe(200);
    expect(recalculateSocialCapital).toHaveBeenCalled();
    expect(updateSocialCapital).not.toHaveBeenCalled();
  });

  it("should return updated availablePoints", async () => {
    const updatedCapital = createMockSocialCapital({
      maxContactPoints: 40,
      usedContactPoints: 15,
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(recalculateSocialCapital).mockResolvedValue(updatedCapital);

    const request = createMockRequest({ method: "POST" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.availablePoints).toBe(25); // 40 - 15
  });

  it("should return 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(recalculateSocialCapital).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({ method: "POST" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to recalculate social capital");
  });
});
