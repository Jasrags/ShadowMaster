/**
 * Integration tests for Character Actions API endpoints
 *
 * Tests:
 * - GET /api/characters/[characterId]/actions - Get action history with filters
 * - POST /api/characters/[characterId]/actions - Roll dice and record action result
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
  getActionHistory: vi.fn(),
  saveActionResult: vi.fn(),
  calculateActionStats: vi.fn(),
  queryActionHistory: vi.fn(),
}));

vi.mock("@/lib/rules/action-resolution", () => ({
  executeRoll: vi.fn(),
  buildActionPool: vi.fn(),
  DEFAULT_DICE_RULES: {
    hitThreshold: 5,
    glitchThreshold: 0.5,
    criticalGlitchRequiresZeroHits: true,
  },
  executePushTheLimit: vi.fn(),
  getCurrentEdge: vi.fn(),
  getMaxEdge: vi.fn(),
}));

vi.mock("uuid", () => ({
  v4: vi.fn(() => "mock-uuid-123"),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, spendEdge } from "@/lib/storage/characters";
import {
  queryActionHistory,
  saveActionResult,
  calculateActionStats,
} from "@/lib/storage/action-history";
import {
  executeRoll,
  buildActionPool,
  executePushTheLimit,
  getCurrentEdge,
  getMaxEdge,
} from "@/lib/rules/action-resolution";
import { GET, POST } from "../route";
import type { Character, User } from "@/lib/types";
import type {
  ActionResult,
  ActionPool,
  ActionHistoryStats,
  DiceResult,
} from "@/lib/types/action-resolution";

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

function createMockStats(overrides: Partial<ActionHistoryStats> = {}): ActionHistoryStats {
  return {
    totalActions: 10,
    totalHits: 25,
    totalGlitches: 1,
    totalCriticalGlitches: 0,
    totalEdgeSpent: 3,
    averageHits: 2.5,
    mostUsedSkill: "firearms",
    ...overrides,
  };
}

function createMockRequest(options: {
  method?: string;
  body?: unknown;
  url?: string;
  searchParams?: Record<string, string>;
}) {
  const baseUrl =
    options.url || `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/actions`;
  const url = new URL(baseUrl);
  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  const request = new NextRequest(url, {
    method: options.method || "GET",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  Object.defineProperty(request, "nextUrl", { value: url, writable: false });
  return request;
}

// =============================================================================
// GET /api/characters/[characterId]/actions
// =============================================================================

describe("GET /api/characters/[characterId]/actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("authentication", () => {
    it("should return 401 when no session", async () => {
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
  });

  describe("success cases", () => {
    it("should return action history with defaults (limit=20, offset=0)", async () => {
      const mockActions = [createMockActionResult(), createMockActionResult({ id: "action-2" })];

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: mockActions, total: 2 });

      const request = createMockRequest({ method: "GET" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.actions).toHaveLength(2);
      expect(data.total).toBe(2);
      expect(data.limit).toBe(20);
      expect(data.offset).toBe(0);
      expect(data.hasMore).toBe(false);
      expect(queryActionHistory).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
        limit: 20,
        offset: 0,
        skill: undefined,
        actionType: undefined,
        hadGlitch: undefined,
        usedEdge: undefined,
      });
    });

    it("should return action history with pagination params", async () => {
      const mockActions = [createMockActionResult()];

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: mockActions, total: 50 });

      const request = createMockRequest({
        method: "GET",
        searchParams: { limit: "10", offset: "20" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.limit).toBe(10);
      expect(data.offset).toBe(20);
      expect(data.hasMore).toBe(true);
      expect(queryActionHistory).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
        limit: 10,
        offset: 20,
        skill: undefined,
        actionType: undefined,
        hadGlitch: undefined,
        usedEdge: undefined,
      });
    });

    it("should return stats when includeStats=true", async () => {
      const mockActions = [createMockActionResult()];
      const mockStats = createMockStats();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: mockActions, total: 1 });
      vi.mocked(calculateActionStats).mockResolvedValue(mockStats);

      const request = createMockRequest({
        method: "GET",
        searchParams: { includeStats: "true" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.stats).toBeDefined();
      expect(data.stats.totalActions).toBe(10);
      expect(data.stats.averageHits).toBe(2.5);
      expect(calculateActionStats).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    });

    it("should not include stats when includeStats is not true", async () => {
      const mockActions = [createMockActionResult()];

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: mockActions, total: 1 });

      const request = createMockRequest({ method: "GET" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.stats).toBeNull();
      expect(calculateActionStats).not.toHaveBeenCalled();
    });
  });

  describe("filters", () => {
    it("should filter by skill name", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: [], total: 0 });

      const request = createMockRequest({
        method: "GET",
        searchParams: { skill: "firearms" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await GET(request, { params });

      expect(queryActionHistory).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
        limit: 20,
        offset: 0,
        skill: "firearms",
        actionType: undefined,
        hadGlitch: undefined,
        usedEdge: undefined,
      });
    });

    it("should filter by action type", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: [], total: 0 });

      const request = createMockRequest({
        method: "GET",
        searchParams: { actionType: "attack" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await GET(request, { params });

      expect(queryActionHistory).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
        limit: 20,
        offset: 0,
        skill: undefined,
        actionType: "attack",
        hadGlitch: undefined,
        usedEdge: undefined,
      });
    });

    it("should filter by hadGlitch=true", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: [], total: 0 });

      const request = createMockRequest({
        method: "GET",
        searchParams: { hadGlitch: "true" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await GET(request, { params });

      expect(queryActionHistory).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
        limit: 20,
        offset: 0,
        skill: undefined,
        actionType: undefined,
        hadGlitch: true,
        usedEdge: undefined,
      });
    });

    it("should filter by hadGlitch=false", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: [], total: 0 });

      const request = createMockRequest({
        method: "GET",
        searchParams: { hadGlitch: "false" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await GET(request, { params });

      expect(queryActionHistory).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
        limit: 20,
        offset: 0,
        skill: undefined,
        actionType: undefined,
        hadGlitch: false,
        usedEdge: undefined,
      });
    });

    it("should filter by usedEdge=true", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: [], total: 0 });

      const request = createMockRequest({
        method: "GET",
        searchParams: { usedEdge: "true" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await GET(request, { params });

      expect(queryActionHistory).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
        limit: 20,
        offset: 0,
        skill: undefined,
        actionType: undefined,
        hadGlitch: undefined,
        usedEdge: true,
      });
    });

    it("should filter by usedEdge=false", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: [], total: 0 });

      const request = createMockRequest({
        method: "GET",
        searchParams: { usedEdge: "false" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await GET(request, { params });

      expect(queryActionHistory).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
        limit: 20,
        offset: 0,
        skill: undefined,
        actionType: undefined,
        hadGlitch: undefined,
        usedEdge: false,
      });
    });

    it("should apply multiple combined filters", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockResolvedValue({ actions: [], total: 0 });

      const request = createMockRequest({
        method: "GET",
        searchParams: {
          skill: "firearms",
          actionType: "attack",
          hadGlitch: "false",
          usedEdge: "true",
          limit: "5",
          offset: "10",
        },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await GET(request, { params });

      expect(queryActionHistory).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
        limit: 5,
        offset: 10,
        skill: "firearms",
        actionType: "attack",
        hadGlitch: false,
        usedEdge: true,
      });
    });
  });

  describe("error handling", () => {
    it("should return 500 on storage error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(queryActionHistory).mockRejectedValue(new Error("Storage error"));

      const request = createMockRequest({ method: "GET" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Storage error");
    });
  });
});

// =============================================================================
// POST /api/characters/[characterId]/actions
// =============================================================================

describe("POST /api/characters/[characterId]/actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("authentication", () => {
    it("should return 401 when no session", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({
        method: "POST",
        body: { pool: { totalDice: 8 } },
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
        body: { pool: { totalDice: 8 } },
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
        body: { pool: { totalDice: 8 } },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  describe("validation", () => {
    it("should return 400 when pool is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest({
        method: "POST",
        body: {},
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Pool configuration is required");
    });

    it("should return 400 when pool size < 1", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest({
        method: "POST",
        body: { pool: { totalDice: 0, basePool: 0, modifiers: [] } },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Pool must have at least 1 die");
    });
  });

  describe("success cases", () => {
    it("should create action with PoolBuildOptions (builds pool)", async () => {
      const mockCharacter = createMockCharacter();
      const mockPool = createMockActionPool();
      const mockRollResult = {
        dice: createMockDice([5, 6, 3, 2, 4, 1, 5, 2]),
        hits: 3,
        rawHits: 3,
        ones: 1,
        isGlitch: false,
        isCriticalGlitch: false,
        limitApplied: false,
        poolSize: 8,
      };

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(buildActionPool).mockReturnValue(mockPool);
      vi.mocked(executeRoll).mockReturnValue(mockRollResult);
      vi.mocked(saveActionResult).mockResolvedValue({} as never);
      vi.mocked(getCurrentEdge).mockReturnValue(3);
      vi.mocked(getMaxEdge).mockReturnValue(3);

      const request = createMockRequest({
        method: "POST",
        body: {
          pool: { attribute: "agility", skill: "firearms" },
        },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toBeDefined();
      expect(data.result.hits).toBe(3);
      expect(data.edgeCurrent).toBe(3);
      expect(data.edgeMaximum).toBe(3);
      expect(buildActionPool).toHaveBeenCalledWith(
        mockCharacter,
        { attribute: "agility", skill: "firearms" },
        expect.any(Object)
      );
      expect(executeRoll).toHaveBeenCalledWith(8, expect.any(Object), { limit: 6 });
      expect(saveActionResult).toHaveBeenCalled();
    });

    it("should create action with pre-built ActionPool", async () => {
      const mockCharacter = createMockCharacter();
      const mockRollResult = {
        dice: createMockDice([5, 6, 3, 2, 4]),
        hits: 2,
        rawHits: 2,
        ones: 0,
        isGlitch: false,
        isCriticalGlitch: false,
        limitApplied: false,
        poolSize: 5,
      };

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(executeRoll).mockReturnValue(mockRollResult);
      vi.mocked(saveActionResult).mockResolvedValue({} as never);
      vi.mocked(getCurrentEdge).mockReturnValue(3);
      vi.mocked(getMaxEdge).mockReturnValue(3);

      const preBuiltPool: ActionPool = {
        basePool: 5,
        totalDice: 5,
        modifiers: [],
        limit: 4,
      };

      const request = createMockRequest({
        method: "POST",
        body: { pool: preBuiltPool },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result.hits).toBe(2);
      expect(buildActionPool).not.toHaveBeenCalled();
      expect(executeRoll).toHaveBeenCalledWith(5, expect.any(Object), { limit: 4 });
    });

    it("should create action with context", async () => {
      const mockCharacter = createMockCharacter();
      const mockPool = createMockActionPool();
      const mockRollResult = {
        dice: createMockDice([5, 6, 3, 2, 4, 1, 5, 2]),
        hits: 3,
        rawHits: 3,
        ones: 1,
        isGlitch: false,
        isCriticalGlitch: false,
        limitApplied: false,
        poolSize: 8,
      };

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(buildActionPool).mockReturnValue(mockPool);
      vi.mocked(executeRoll).mockReturnValue(mockRollResult);
      vi.mocked(saveActionResult).mockResolvedValue({} as never);
      vi.mocked(getCurrentEdge).mockReturnValue(3);
      vi.mocked(getMaxEdge).mockReturnValue(3);

      const context = {
        actionType: "attack",
        skillUsed: "firearms",
        description: "Shooting a ganger",
        targetName: "Ganger",
      };

      const request = createMockRequest({
        method: "POST",
        body: {
          pool: { attribute: "agility", skill: "firearms" },
          context,
        },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result.context).toEqual(context);
      expect(saveActionResult).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({ context })
      );
    });
  });

  describe("edge actions", () => {
    it("should return 400 when insufficient Edge for push_the_limit", async () => {
      const mockCharacter = createMockCharacter();
      const mockPool = createMockActionPool();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(buildActionPool).mockReturnValue(mockPool);
      vi.mocked(getCurrentEdge).mockReturnValue(0);

      const request = createMockRequest({
        method: "POST",
        body: {
          pool: { attribute: "agility", skill: "firearms" },
          edgeAction: "push_the_limit",
        },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Insufficient Edge");
    });

    it("should succeed with push_the_limit (spends Edge, uses executePushTheLimit)", async () => {
      const mockCharacter = createMockCharacter();
      const mockPool = createMockActionPool();
      const modifiedPool = createMockActionPool({ totalDice: 11 });
      const mockRollResult = {
        dice: createMockDice([5, 6, 6, 5, 4, 1, 5, 2, 6, 5, 3]),
        hits: 6,
        rawHits: 6,
        ones: 1,
        isGlitch: false,
        isCriticalGlitch: false,
        limitApplied: false,
        poolSize: 11,
      };
      const updatedCharacter = createMockCharacter({
        specialAttributes: { edge: 3, essence: 6 },
        condition: { physicalDamage: 0, stunDamage: 0, edgeCurrent: 2 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(buildActionPool).mockReturnValue(mockPool);
      vi.mocked(getCurrentEdge).mockReturnValue(3);
      vi.mocked(getMaxEdge).mockReturnValue(3);
      vi.mocked(executePushTheLimit).mockReturnValue({
        success: true,
        rollResult: mockRollResult,
        modifiedPool: modifiedPool,
        edgeSpent: 1,
        newEdgeCurrent: 2,
      });
      vi.mocked(spendEdge).mockResolvedValue(updatedCharacter);
      vi.mocked(saveActionResult).mockResolvedValue({} as never);

      const request = createMockRequest({
        method: "POST",
        body: {
          pool: { attribute: "agility", skill: "firearms" },
          edgeAction: "push_the_limit",
        },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result.edgeSpent).toBe(1);
      expect(data.result.edgeAction).toBe("push_the_limit");
      expect(data.result.hits).toBe(6);
      expect(executePushTheLimit).toHaveBeenCalledWith(mockCharacter, mockPool, expect.any(Object));
      expect(spendEdge).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, 1);
      expect(executeRoll).not.toHaveBeenCalled();
    });

    it("should return 400 when push_the_limit fails", async () => {
      const mockCharacter = createMockCharacter();
      const mockPool = createMockActionPool();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(buildActionPool).mockReturnValue(mockPool);
      vi.mocked(getCurrentEdge).mockReturnValue(3);
      vi.mocked(executePushTheLimit).mockReturnValue({
        success: false,
        error: "Push the Limit failed",
        edgeSpent: 0,
        newEdgeCurrent: 3,
      });

      const request = createMockRequest({
        method: "POST",
        body: {
          pool: { attribute: "agility", skill: "firearms" },
          edgeAction: "push_the_limit",
        },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Push the Limit failed");
    });
  });

  describe("error handling", () => {
    it("should return 500 on storage error", async () => {
      const mockCharacter = createMockCharacter();
      const mockPool = createMockActionPool();
      const mockRollResult = {
        dice: createMockDice([5, 6, 3, 2, 4, 1, 5, 2]),
        hits: 3,
        rawHits: 3,
        ones: 1,
        isGlitch: false,
        isCriticalGlitch: false,
        limitApplied: false,
        poolSize: 8,
      };

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(buildActionPool).mockReturnValue(mockPool);
      vi.mocked(executeRoll).mockReturnValue(mockRollResult);
      vi.mocked(saveActionResult).mockRejectedValue(new Error("Storage error"));

      const request = createMockRequest({
        method: "POST",
        body: { pool: { attribute: "agility", skill: "firearms" } },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Storage error");
    });
  });
});
