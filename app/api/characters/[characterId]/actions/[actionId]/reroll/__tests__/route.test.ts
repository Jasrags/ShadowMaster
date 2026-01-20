/**
 * Integration tests for Action Reroll API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/actions/[actionId]/reroll - Reroll using Edge
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
  spendEdge: vi.fn(),
}));

vi.mock("@/lib/storage/action-history", () => ({
  getAction: vi.fn(),
  updateActionResult: vi.fn(),
}));

vi.mock("@/lib/rules/action-resolution", () => ({
  executeReroll: vi.fn(),
  executeCloseCall: vi.fn(),
  DEFAULT_DICE_RULES: {
    hitThreshold: 5,
    glitchThreshold: 0.5,
    criticalGlitchRequiresZeroHits: true,
  },
  getCurrentEdge: vi.fn(),
  getMaxEdge: vi.fn(),
  canSpendEdge: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, spendEdge } from "@/lib/storage/characters";
import { getAction, updateActionResult } from "@/lib/storage/action-history";
import {
  executeReroll,
  getCurrentEdge,
  getMaxEdge,
  canSpendEdge,
} from "@/lib/rules/action-resolution";
import { POST } from "../route";
import type { Character, User } from "@/lib/types";
import type { ActionResult, ActionPool, DiceResult } from "@/lib/types/action-resolution";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";
const TEST_ACTION_ID = "test-action-789";

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
    attributes: {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 3,
      intuition: 3,
      charisma: 3,
    },
    skills: {
      firearms: { rating: 4 },
      stealth: { rating: 3 },
    },
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
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
      edgeCurrent: 3,
    },
    contacts: [],
    ...overrides,
  } as Character;
}

function createMockDice(values: number[]): DiceResult[] {
  return values.map((value) => ({
    value,
    isHit: value >= 5,
    isOne: value === 1,
  }));
}

function createMockActionPool(overrides: Partial<ActionPool> = {}): ActionPool {
  return {
    basePool: 8,
    attribute: "agility",
    skill: "firearms",
    modifiers: [],
    totalDice: 8,
    limit: 6,
    limitSource: "Physical",
    ...overrides,
  };
}

function createMockActionResult(overrides: Partial<ActionResult> = {}): ActionResult {
  return {
    id: TEST_ACTION_ID,
    characterId: TEST_CHARACTER_ID,
    userId: TEST_USER_ID,
    pool: createMockActionPool(),
    dice: createMockDice([5, 6, 3, 2, 4, 1, 5, 2]),
    hits: 3,
    rawHits: 3,
    ones: 1,
    isGlitch: false,
    isCriticalGlitch: false,
    edgeSpent: 0,
    rerollCount: 0,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function createMockRequest(options: { method?: string; body?: unknown; url?: string }) {
  const baseUrl =
    options.url ||
    `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/actions/${TEST_ACTION_ID}/reroll`;
  const url = new URL(baseUrl);
  const request = new NextRequest(url, {
    method: options.method || "POST",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  Object.defineProperty(request, "nextUrl", { value: url, writable: false });
  return request;
}

// =============================================================================
// POST /api/characters/[characterId]/actions/[actionId]/reroll
// =============================================================================

describe("POST /api/characters/[characterId]/actions/[actionId]/reroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("authentication", () => {
    it("should return 401 when no session", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "second-chance" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

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
        body: { edgeAction: "second-chance" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

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
        body: { edgeAction: "second-chance" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });

    it("should return 404 when action not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(null);

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "second-chance" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Action not found");
    });
  });

  describe("validation", () => {
    it("should return 400 when edgeAction is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(createMockActionResult());

      const request = createMockRequest({
        method: "POST",
        body: {},
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Edge action is required");
    });

    it("should return 400 when edgeAction is not a post-roll type (push-the-limit)", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(createMockActionResult());

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "push-the-limit" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid Edge action for reroll");
    });

    it("should return 400 when edgeAction is not a post-roll type (blitz)", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(createMockActionResult());

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "blitz" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid Edge action for reroll");
    });
  });

  describe("second-chance", () => {
    it("should return 400 when insufficient Edge", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(createMockActionResult());
      vi.mocked(canSpendEdge).mockReturnValue(false);

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "second-chance" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Insufficient Edge");
    });

    it("should return 400 when already used (rerollCount > 0)", async () => {
      const actionWithReroll = createMockActionResult({ rerollCount: 1 });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(actionWithReroll);
      vi.mocked(canSpendEdge).mockReturnValue(true);

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "second-chance" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Already used Second Chance on this roll");
    });

    it("should succeed - rerolls misses, increments rerollCount, spends Edge", async () => {
      const originalAction = createMockActionResult({
        dice: createMockDice([5, 6, 3, 2, 4, 1, 5, 2]),
        hits: 3,
        rawHits: 3,
        ones: 1,
        rerollCount: 0,
        edgeSpent: 0,
      });
      const rerollResult = {
        dice: createMockDice([5, 6, 5, 5, 4, 1, 5, 4]),
        hits: 5,
        rawHits: 5,
        ones: 1,
        isGlitch: false,
        isCriticalGlitch: false,
        limitApplied: false,
        poolSize: 8,
      };
      const updatedAction = createMockActionResult({
        dice: rerollResult.dice,
        hits: 5,
        rawHits: 5,
        rerollCount: 1,
        edgeSpent: 1,
        edgeAction: "second-chance",
        previousResultId: TEST_ACTION_ID,
      });
      const updatedCharacter = createMockCharacter({
        specialAttributes: { edge: 3, essence: 6 },
        condition: { physicalDamage: 0, stunDamage: 0, edgeCurrent: 2 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(originalAction);
      vi.mocked(canSpendEdge).mockReturnValue(true);
      vi.mocked(executeReroll).mockReturnValue(rerollResult);
      vi.mocked(spendEdge).mockResolvedValue(updatedCharacter);
      vi.mocked(updateActionResult).mockResolvedValue(updatedAction);
      vi.mocked(getCurrentEdge).mockReturnValue(2);
      vi.mocked(getMaxEdge).mockReturnValue(3);

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "second-chance" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toBeDefined();
      expect(data.result.hits).toBe(5);
      expect(data.result.rerollCount).toBe(1);
      expect(data.result.edgeSpent).toBe(1);
      expect(data.result.edgeAction).toBe("second-chance");
      expect(data.edgeCurrent).toBe(2);
      expect(data.edgeMaximum).toBe(3);
      expect(executeReroll).toHaveBeenCalledWith(
        originalAction.dice,
        expect.any(Object),
        originalAction.pool.limit
      );
      expect(spendEdge).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 1);
      expect(updateActionResult).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        TEST_ACTION_ID,
        {
          dice: rerollResult.dice,
          hits: rerollResult.hits,
          rawHits: rerollResult.rawHits,
          ones: rerollResult.ones,
          isGlitch: rerollResult.isGlitch,
          isCriticalGlitch: rerollResult.isCriticalGlitch,
          edgeSpent: 1,
          edgeAction: "second-chance",
          rerollCount: 1,
          previousResultId: TEST_ACTION_ID,
        }
      );
    });
  });

  describe("close-call", () => {
    it("should return 400 when no glitch to negate", async () => {
      const actionWithoutGlitch = createMockActionResult({
        isGlitch: false,
        isCriticalGlitch: false,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(actionWithoutGlitch);
      vi.mocked(canSpendEdge).mockReturnValue(true);

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "close-call" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("No glitch to negate");
    });

    it("should succeed on regular glitch - negates glitch flags", async () => {
      const actionWithGlitch = createMockActionResult({
        dice: createMockDice([1, 1, 1, 1, 1, 5, 6, 2]),
        hits: 2,
        rawHits: 2,
        ones: 5,
        isGlitch: true,
        isCriticalGlitch: false,
        edgeSpent: 0,
      });
      const updatedAction = createMockActionResult({
        dice: actionWithGlitch.dice,
        hits: 2,
        rawHits: 2,
        ones: 5,
        isGlitch: false,
        isCriticalGlitch: false,
        edgeSpent: 1,
        edgeAction: "close-call",
      });
      const updatedCharacter = createMockCharacter({
        specialAttributes: { edge: 3, essence: 6 },
        condition: { physicalDamage: 0, stunDamage: 0, edgeCurrent: 2 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(actionWithGlitch);
      vi.mocked(canSpendEdge).mockReturnValue(true);
      vi.mocked(spendEdge).mockResolvedValue(updatedCharacter);
      vi.mocked(updateActionResult).mockResolvedValue(updatedAction);
      vi.mocked(getCurrentEdge).mockReturnValue(2);
      vi.mocked(getMaxEdge).mockReturnValue(3);

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "close-call" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toBeDefined();
      expect(data.result.isGlitch).toBe(false);
      expect(data.result.isCriticalGlitch).toBe(false);
      expect(data.result.edgeSpent).toBe(1);
      expect(data.result.edgeAction).toBe("close-call");
      expect(data.glitchNegated).toBe(true);
      expect(data.edgeCurrent).toBe(2);
      expect(data.edgeMaximum).toBe(3);
      expect(spendEdge).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 1);
      expect(updateActionResult).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        TEST_ACTION_ID,
        {
          isGlitch: false,
          isCriticalGlitch: false,
          edgeSpent: 1,
          edgeAction: "close-call",
        }
      );
    });

    it("should succeed on critical glitch - negates glitch flags", async () => {
      const actionWithCriticalGlitch = createMockActionResult({
        dice: createMockDice([1, 1, 1, 1, 1, 2, 3, 4]),
        hits: 0,
        rawHits: 0,
        ones: 5,
        isGlitch: true,
        isCriticalGlitch: true,
        edgeSpent: 0,
      });
      const updatedAction = createMockActionResult({
        dice: actionWithCriticalGlitch.dice,
        hits: 0,
        rawHits: 0,
        ones: 5,
        isGlitch: false,
        isCriticalGlitch: false,
        edgeSpent: 1,
        edgeAction: "close-call",
      });
      const updatedCharacter = createMockCharacter({
        specialAttributes: { edge: 3, essence: 6 },
        condition: { physicalDamage: 0, stunDamage: 0, edgeCurrent: 2 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(actionWithCriticalGlitch);
      vi.mocked(canSpendEdge).mockReturnValue(true);
      vi.mocked(spendEdge).mockResolvedValue(updatedCharacter);
      vi.mocked(updateActionResult).mockResolvedValue(updatedAction);
      vi.mocked(getCurrentEdge).mockReturnValue(2);
      vi.mocked(getMaxEdge).mockReturnValue(3);

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "close-call" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toBeDefined();
      expect(data.result.isGlitch).toBe(false);
      expect(data.result.isCriticalGlitch).toBe(false);
      expect(data.glitchNegated).toBe(true);
    });

    it("should return 400 when insufficient Edge for close-call", async () => {
      const actionWithGlitch = createMockActionResult({
        isGlitch: true,
        isCriticalGlitch: false,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(actionWithGlitch);
      vi.mocked(canSpendEdge).mockReturnValue(false);

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "close-call" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Insufficient Edge");
    });
  });

  describe("error handling", () => {
    it("should return 500 on storage error", async () => {
      const originalAction = createMockActionResult();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getAction).mockResolvedValue(originalAction);
      vi.mocked(canSpendEdge).mockReturnValue(true);
      vi.mocked(executeReroll).mockReturnValue({
        dice: createMockDice([5, 6, 5, 5, 4, 1, 5, 4]),
        hits: 5,
        rawHits: 5,
        ones: 1,
        isGlitch: false,
        isCriticalGlitch: false,
        limitApplied: false,
        poolSize: 8,
      });
      vi.mocked(spendEdge).mockRejectedValue(new Error("Storage error"));

      const request = createMockRequest({
        method: "POST",
        body: { edgeAction: "second-chance" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, actionId: TEST_ACTION_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Storage error");
    });
  });
});
