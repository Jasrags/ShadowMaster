/**
 * Integration tests for Character Clone API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/clone - Clone a character as a new draft
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  importCharacter: vi.fn(),
  updateCharacter: vi.fn(),
}));

vi.mock("@/lib/auth/character-authorization", () => ({
  authorizeOwnerAccess: vi.fn(),
}));

vi.mock("@/lib/rules/character/state-machine", () => ({
  createAuditEntry: vi.fn().mockReturnValue({
    timestamp: new Date().toISOString(),
    action: "created",
    actor: { userId: "test-user-123", role: "owner" },
    details: {},
  }),
}));

vi.mock("uuid", () => ({
  v4: vi.fn().mockReturnValue("mock-uuid-123"),
}));

import { getSession } from "@/lib/auth/session";
import { importCharacter, updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import { POST } from "../route";
import type { Character } from "@/lib/types";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-789";
const TEST_CAMPAIGN_ID = "test-campaign-456";

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Original Runner",
    status: "active",
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
    skills: { automatics: 4, pistols: 3 },
    skillSpecializations: { pistols: ["Semi-Automatics"] },
    knowledgeSkills: [{ name: "Seattle Gangs", category: "street", rating: 3 }],
    languages: [{ name: "English", rating: "N" }],
    positiveQualities: [{ id: "ambidextrous", name: "Ambidextrous", cost: 4 }],
    negativeQualities: [{ id: "bad-rep", name: "Bad Rep", cost: -7 }],
    magicalPath: "mundane",
    nuyen: 2000,
    startingNuyen: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 4,
      essence: 6,
    },
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
      overflowDamage: 0,
    },
    gear: [{ id: "gear-1", catalogId: "commlink-basic", quantity: 1 }],
    weapons: [{ id: "weapon-1", catalogId: "ares-predator", quantity: 1 }],
    armor: [{ id: "armor-1", catalogId: "armored-jacket", quantity: 1 }],
    contacts: [
      { id: "contact-1", name: "Fixer", loyalty: 3, connection: 4 },
      { id: "contact-2", name: "Street Doc", loyalty: 2, connection: 3 },
    ],
    karmaSpentAtCreation: 25,
    derivedStats: { physicalLimit: 5, mentalLimit: 5, socialLimit: 5 },
    identities: [{ id: "id-1", name: "John Doe", rating: 4 }],
    lifestyles: [{ id: "ls-1", name: "Low", months: 1 }],
    ...overrides,
  } as Character;
}

function createMockRequest(body?: Record<string, unknown>): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/clone`;
  if (body !== undefined) {
    return new NextRequest(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  return new NextRequest(url, { method: "POST" });
}

function createMockAuthResult(
  authorized: boolean,
  character: Character | null = null,
  error?: string,
  status: number = 200
) {
  return {
    authorized,
    character,
    campaign: null,
    role: "owner" as const,
    permissions: ["view" as const, "edit" as const, "delete" as const],
    error,
    status,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("POST /api/characters/[characterId]/clone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(false, null, "Character not found", 404)
      );

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user is not authorized", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(false, null, "You do not have permission to clone this character", 403)
      );

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe("Default clone behavior", () => {
    it("should clone character with default options", async () => {
      const sourceCharacter = createMockCharacter();
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        name: "Original Runner (Copy)",
        status: "draft",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockResolvedValue(clonedCharacter);

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character).toBeDefined();
      expect(data.message).toContain("cloned");
    });

    it("should create character as draft status", async () => {
      const sourceCharacter = createMockCharacter({ status: "active" });
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockResolvedValue(clonedCharacter);

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.character.status).toBe("draft");
    });
  });

  describe("Custom name", () => {
    it("should use custom name when provided", async () => {
      const sourceCharacter = createMockCharacter();
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        name: "My New Character",
        status: "draft",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockResolvedValue(clonedCharacter);

      const request = createMockRequest({ name: "My New Character" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.character.name).toBe("My New Character");
    });
  });

  describe("Gear inclusion", () => {
    it("should include gear by default", async () => {
      const sourceCharacter = createMockCharacter();
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockImplementation(async (userId, charData) => {
        expect(charData.gear).toBeDefined();
        expect(charData.gear!.length).toBeGreaterThan(0);
        return clonedCharacter;
      });

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });
    });

    it("should exclude gear when includeGear is false", async () => {
      const sourceCharacter = createMockCharacter();
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
        gear: [],
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockImplementation(async (userId, charData) => {
        expect(charData.gear).toEqual([]);
        expect(charData.weapons).toBeUndefined();
        expect(charData.armor).toBeUndefined();
        return clonedCharacter;
      });

      const request = createMockRequest({ includeGear: false });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      expect(response.status).toBe(200);
    });
  });

  describe("Contacts inclusion", () => {
    it("should include contacts by default", async () => {
      const sourceCharacter = createMockCharacter();
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockImplementation(async (userId, charData) => {
        expect(charData.contacts).toBeDefined();
        expect(charData.contacts!.length).toBe(2);
        return clonedCharacter;
      });

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });
    });

    it("should exclude contacts when includeContacts is false", async () => {
      const sourceCharacter = createMockCharacter();
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
        contacts: [],
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockImplementation(async (userId, charData) => {
        expect(charData.contacts).toEqual([]);
        return clonedCharacter;
      });

      const request = createMockRequest({ includeContacts: false });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      expect(response.status).toBe(200);
    });
  });

  describe("Campaign association", () => {
    it("should associate with campaign when campaignId is provided", async () => {
      const sourceCharacter = createMockCharacter();
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
      });
      const updatedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
        campaignId: TEST_CAMPAIGN_ID,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockResolvedValue(clonedCharacter);
      vi.mocked(updateCharacter).mockResolvedValue(updatedCharacter);

      const request = createMockRequest({ campaignId: TEST_CAMPAIGN_ID });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(updateCharacter).toHaveBeenCalledWith(TEST_USER_ID, "cloned-char-123", {
        campaignId: TEST_CAMPAIGN_ID,
      });
      expect(data.character.campaignId).toBe(TEST_CAMPAIGN_ID);
    });

    it("should not call updateCharacter when campaignId is not provided", async () => {
      const sourceCharacter = createMockCharacter();
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockResolvedValue(clonedCharacter);

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(updateCharacter).not.toHaveBeenCalled();
    });
  });

  describe("Resource reset", () => {
    it("should reset nuyen to starting value", async () => {
      const sourceCharacter = createMockCharacter({
        nuyen: 2000,
        startingNuyen: 5000,
      });
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockImplementation(async (userId, charData) => {
        expect(charData.nuyen).toBe(5000);
        return clonedCharacter;
      });

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });
    });

    it("should reset condition to undamaged state", async () => {
      const sourceCharacter = createMockCharacter({
        condition: { physicalDamage: 5, stunDamage: 3, overflowDamage: 0 },
      });
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockImplementation(async (userId, charData) => {
        expect(charData.condition?.physicalDamage).toBe(0);
        expect(charData.condition?.stunDamage).toBe(0);
        return clonedCharacter;
      });

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });
    });
  });

  describe("Empty body handling", () => {
    it("should handle request with empty body", async () => {
      const sourceCharacter = createMockCharacter();
      const clonedCharacter = createMockCharacter({
        id: "cloned-char-123",
        status: "draft",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockResolvedValue(clonedCharacter);

      // Create request with empty object body
      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockRejectedValue(new Error("Database error"));

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to clone character");
    });

    it("should return 500 when importCharacter fails", async () => {
      const sourceCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createMockAuthResult(true, sourceCharacter)
      );
      vi.mocked(importCharacter).mockRejectedValue(new Error("Import failed"));

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to clone character");
    });
  });
});
