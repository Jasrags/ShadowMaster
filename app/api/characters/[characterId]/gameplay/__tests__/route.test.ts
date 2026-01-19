/**
 * Integration tests for Gameplay API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/gameplay - Apply gameplay actions
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  applyDamage: vi.fn(),
  healCharacter: vi.fn(),
  spendKarma: vi.fn(),
  awardKarma: vi.fn(),
  retireCharacter: vi.fn(),
  killCharacter: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import {
  getCharacter,
  applyDamage,
  healCharacter,
  spendKarma,
  awardKarma,
  retireCharacter,
  killCharacter,
} from "@/lib/storage/characters";
import { POST } from "../route";
import type { Character } from "@/lib/types";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-789";

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
      edge: 4,
      essence: 6,
    },
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
      overflowDamage: 0,
    },
    karma: 10,
    totalKarma: 50,
    ...overrides,
  } as Character;
}

function createMockRequest(body: Record<string, unknown>): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/gameplay`;
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// =============================================================================
// AUTHENTICATION TESTS
// =============================================================================

describe("POST /api/characters/[characterId]/gameplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({ action: "damage", physical: 3, stun: 0 });
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
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest({ action: "damage", physical: 3, stun: 0 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });

    it("should return 400 when character is not active", async () => {
      const draftCharacter = createMockCharacter({ status: "draft" });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(draftCharacter);

      const request = createMockRequest({ action: "damage", physical: 3, stun: 0 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character must be active for gameplay actions");
    });

    it("should return 400 when character is retired", async () => {
      const retiredCharacter = createMockCharacter({ status: "retired" });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(retiredCharacter);

      const request = createMockRequest({ action: "damage", physical: 3, stun: 0 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character must be active for gameplay actions");
    });
  });

  // ===========================================================================
  // DAMAGE ACTION TESTS
  // ===========================================================================

  describe("Damage action", () => {
    it("should apply damage successfully", async () => {
      const mockCharacter = createMockCharacter();
      const damagedCharacter = createMockCharacter({
        condition: { physicalDamage: 3, stunDamage: 2, overflowDamage: 0 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(applyDamage).mockResolvedValue(damagedCharacter);

      const request = createMockRequest({ action: "damage", physical: 3, stun: 2 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.physicalDamage).toBe(3);
      expect(data.character.condition.stunDamage).toBe(2);
      expect(applyDamage).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 3, 2);
    });

    it("should default missing damage values to 0", async () => {
      const mockCharacter = createMockCharacter();
      const damagedCharacter = createMockCharacter({
        condition: { physicalDamage: 3, stunDamage: 0, overflowDamage: 0 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(applyDamage).mockResolvedValue(damagedCharacter);

      const request = createMockRequest({ action: "damage", physical: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });

      expect(response.status).toBe(200);
      expect(applyDamage).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 3, 0);
    });
  });

  // ===========================================================================
  // HEAL ACTION TESTS
  // ===========================================================================

  describe("Heal action", () => {
    it("should heal character successfully", async () => {
      const mockCharacter = createMockCharacter({
        condition: { physicalDamage: 5, stunDamage: 4, overflowDamage: 0 },
      });
      const healedCharacter = createMockCharacter({
        condition: { physicalDamage: 2, stunDamage: 1, overflowDamage: 0 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(healCharacter).mockResolvedValue(healedCharacter);

      const request = createMockRequest({ action: "heal", physical: 3, stun: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(healCharacter).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 3, 3);
    });

    it("should default missing heal values to 0", async () => {
      const mockCharacter = createMockCharacter({
        condition: { physicalDamage: 5, stunDamage: 4, overflowDamage: 0 },
      });
      const healedCharacter = createMockCharacter({
        condition: { physicalDamage: 5, stunDamage: 1, overflowDamage: 0 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(healCharacter).mockResolvedValue(healedCharacter);

      const request = createMockRequest({ action: "heal", stun: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });

      expect(response.status).toBe(200);
      expect(healCharacter).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 0, 3);
    });
  });

  // ===========================================================================
  // KARMA ACTION TESTS
  // ===========================================================================

  describe("spendKarma action", () => {
    it("should spend karma successfully", async () => {
      const mockCharacter = createMockCharacter({ karmaTotal: 60, karmaCurrent: 10 });
      const updatedCharacter = createMockCharacter({ karmaTotal: 60, karmaCurrent: 5 });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(spendKarma).mockResolvedValue(updatedCharacter);

      const request = createMockRequest({ action: "spendKarma", amount: 5 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(spendKarma).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 5);
    });

    it("should return 400 when karma amount is missing", async () => {
      const mockCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest({ action: "spendKarma" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Amount must be positive");
    });

    it("should return 400 when karma amount is zero", async () => {
      const mockCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest({ action: "spendKarma", amount: 0 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Amount must be positive");
    });

    it("should return 400 when karma amount is negative", async () => {
      const mockCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest({ action: "spendKarma", amount: -5 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Amount must be positive");
    });
  });

  describe("awardKarma action", () => {
    it("should award karma successfully", async () => {
      const mockCharacter = createMockCharacter({ karmaTotal: 50, karmaCurrent: 5 });
      const updatedCharacter = createMockCharacter({ karmaTotal: 60, karmaCurrent: 15 });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(awardKarma).mockResolvedValue(updatedCharacter);

      const request = createMockRequest({ action: "awardKarma", amount: 10 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(awardKarma).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 10);
    });

    it("should return 400 when karma amount is missing", async () => {
      const mockCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest({ action: "awardKarma" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Amount must be positive");
    });

    it("should return 400 when karma amount is zero", async () => {
      const mockCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest({ action: "awardKarma", amount: 0 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Amount must be positive");
    });
  });

  // ===========================================================================
  // RETIRE/KILL ACTION TESTS
  // ===========================================================================

  describe("retire action", () => {
    it("should retire character successfully", async () => {
      const mockCharacter = createMockCharacter();
      const retiredCharacter = createMockCharacter({ status: "retired" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(retireCharacter).mockResolvedValue(retiredCharacter);

      const request = createMockRequest({ action: "retire" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.status).toBe("retired");
      expect(retireCharacter).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    });
  });

  describe("kill action", () => {
    it("should kill character successfully", async () => {
      const mockCharacter = createMockCharacter();
      const deceasedCharacter = createMockCharacter({ status: "deceased" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(killCharacter).mockResolvedValue(deceasedCharacter);

      const request = createMockRequest({ action: "kill" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.status).toBe("deceased");
      expect(killCharacter).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    });
  });

  // ===========================================================================
  // VALIDATION TESTS
  // ===========================================================================

  describe("Validation", () => {
    it("should return 400 for unknown action", async () => {
      const mockCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest({ action: "invalid" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unknown action");
    });
  });

  // ===========================================================================
  // ERROR HANDLING TESTS
  // ===========================================================================

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockRejectedValue(new Error("Storage error"));

      const request = createMockRequest({ action: "damage", physical: 3, stun: 0 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Storage error");
    });

    it("should return 500 when applyDamage fails", async () => {
      const mockCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(applyDamage).mockRejectedValue(new Error("Failed to apply damage"));

      const request = createMockRequest({ action: "damage", physical: 3, stun: 0 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to apply damage");
    });
  });
});
