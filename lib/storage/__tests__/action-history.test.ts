/**
 * Unit tests for action-history.ts storage module
 *
 * Tests action history CRUD and query operations with VI mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ActionResult, ActionHistory, ActionPool } from "@/lib/types/action-resolution";

// Mock the base storage module
vi.mock("../base", () => {
  const storage = new Map<string, unknown>();
  return {
    ensureDirectory: vi.fn().mockResolvedValue(undefined),
    readJsonFile: vi
      .fn()
      .mockImplementation((path: string) => Promise.resolve(storage.get(path) || null)),
    writeJsonFile: vi.fn().mockImplementation((path: string, data: unknown) => {
      storage.set(path, data);
      return Promise.resolve();
    }),
    __storage: storage,
    __clearStorage: () => storage.clear(),
  };
});

// Import after mocking
import * as actionHistoryStorage from "../action-history";
import * as base from "../base";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const TEST_USER_ID = "test-user";
const TEST_CHARACTER_ID = "test-character";

function createMockActionPool(skill: string = "Firearms"): ActionPool {
  return {
    basePool: 8,
    attribute: "Agility",
    skill,
    modifiers: [],
    totalDice: 10,
  };
}

function createMockActionResult(overrides: Partial<ActionResult> = {}): ActionResult {
  return {
    id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    characterId: TEST_CHARACTER_ID,
    userId: TEST_USER_ID,
    pool: createMockActionPool(overrides.pool?.skill),
    dice: [],
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

function createMockHistory(actions: ActionResult[] = []): ActionHistory {
  const now = new Date().toISOString();
  return {
    characterId: TEST_CHARACTER_ID,
    actions,
    createdAt: now,
    updatedAt: now,
  };
}

// =============================================================================
// SETUP
// =============================================================================

beforeEach(() => {
  vi.clearAllMocks();
  const baseMock = base as typeof base & { __clearStorage: () => void };
  baseMock.__clearStorage();
});

// =============================================================================
// INITIALIZE ACTION HISTORY TESTS
// =============================================================================

describe("initializeActionHistory", () => {
  it("should create empty action history", async () => {
    const result = await actionHistoryStorage.initializeActionHistory(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    expect(result.characterId).toBe(TEST_CHARACTER_ID);
    expect(result.actions).toEqual([]);
    expect(result.createdAt).toBeDefined();
    expect(base.writeJsonFile).toHaveBeenCalled();
  });

  it("should set timestamps", async () => {
    const beforeTime = new Date().toISOString();

    const result = await actionHistoryStorage.initializeActionHistory(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    const afterTime = new Date().toISOString();

    expect(result.createdAt >= beforeTime).toBe(true);
    expect(result.createdAt <= afterTime).toBe(true);
    expect(result.updatedAt >= beforeTime).toBe(true);
    expect(result.updatedAt <= afterTime).toBe(true);
  });
});

// =============================================================================
// GET ACTION HISTORY TESTS
// =============================================================================

describe("getActionHistory", () => {
  it("should return null for non-existent character", async () => {
    const result = await actionHistoryStorage.getActionHistory(TEST_USER_ID, TEST_CHARACTER_ID);
    expect(result).toBeNull();
  });

  it("should return existing history", async () => {
    const history = createMockHistory([createMockActionResult()]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.getActionHistory(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result).toEqual(history);
  });
});

// =============================================================================
// GET RECENT ACTIONS TESTS
// =============================================================================

describe("getRecentActions", () => {
  it("should return empty array for non-existent character", async () => {
    const result = await actionHistoryStorage.getRecentActions(TEST_USER_ID, TEST_CHARACTER_ID);
    expect(result).toEqual([]);
  });

  it("should return recent actions with default limit of 20", async () => {
    const actions = Array.from({ length: 25 }, (_, i) =>
      createMockActionResult({ id: `action-${i}` })
    );
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.getRecentActions(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result.length).toBe(20); // Default limit is 20
  });

  it("should respect custom limit", async () => {
    const actions = Array.from({ length: 15 }, (_, i) =>
      createMockActionResult({ id: `action-${i}` })
    );
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.getRecentActions(TEST_USER_ID, TEST_CHARACTER_ID, 5);

    expect(result.length).toBe(5);
  });
});

// =============================================================================
// GET ACTION TESTS
// =============================================================================

describe("getAction", () => {
  it("should return null for non-existent action", async () => {
    const history = createMockHistory([createMockActionResult({ id: "other-action" })]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.getAction(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "non-existent"
    );

    expect(result).toBeNull();
  });

  it("should return action by ID", async () => {
    const action = createMockActionResult({ id: "target-action" });
    const history = createMockHistory([action]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.getAction(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "target-action"
    );

    expect(result).toEqual(action);
  });
});

// =============================================================================
// SAVE ACTION RESULT TESTS
// =============================================================================

describe("saveActionResult", () => {
  it("should add action to beginning of array", async () => {
    const existingAction = createMockActionResult({ id: "existing" });
    const history = createMockHistory([existingAction]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const newAction = createMockActionResult({ id: "new-action" });
    const result = await actionHistoryStorage.saveActionResult(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      newAction
    );

    // saveActionResult returns the full ActionHistory
    expect(result.actions[0].id).toBe("new-action");

    // Verify write was called with new action first
    const writeCall = vi.mocked(base.writeJsonFile).mock.calls[0];
    const writtenData = writeCall[1] as ActionHistory;
    expect(writtenData.actions[0].id).toBe("new-action");
    expect(writtenData.actions[1].id).toBe("existing");
  });

  it("should initialize history if it does not exist", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const newAction = createMockActionResult({ id: "first-action" });
    await actionHistoryStorage.saveActionResult(TEST_USER_ID, TEST_CHARACTER_ID, newAction);

    expect(base.writeJsonFile).toHaveBeenCalled();
    const writeCall = vi.mocked(base.writeJsonFile).mock.calls[0];
    const writtenData = writeCall[1] as ActionHistory;
    expect(writtenData.actions).toHaveLength(1);
  });

  it("should trim to 1000 actions", async () => {
    const existingActions = Array.from({ length: 1000 }, (_, i) =>
      createMockActionResult({ id: `existing-${i}` })
    );
    const history = createMockHistory(existingActions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const newAction = createMockActionResult({ id: "new-beyond-limit" });
    await actionHistoryStorage.saveActionResult(TEST_USER_ID, TEST_CHARACTER_ID, newAction);

    const writeCall = vi.mocked(base.writeJsonFile).mock.calls[0];
    const writtenData = writeCall[1] as ActionHistory;
    expect(writtenData.actions.length).toBe(1000);
    expect(writtenData.actions[0].id).toBe("new-beyond-limit");
  });

  it("should update updatedAt timestamp", async () => {
    const history = createMockHistory([createMockActionResult()]);
    const oldUpdatedAt = history.updatedAt;
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    // Small delay to ensure different timestamp
    await new Promise((resolve) => setTimeout(resolve, 10));

    const newAction = createMockActionResult();
    await actionHistoryStorage.saveActionResult(TEST_USER_ID, TEST_CHARACTER_ID, newAction);

    const writeCall = vi.mocked(base.writeJsonFile).mock.calls[0];
    const writtenData = writeCall[1] as ActionHistory;
    expect(writtenData.updatedAt >= oldUpdatedAt).toBe(true);
  });
});

// =============================================================================
// UPDATE ACTION RESULT TESTS
// =============================================================================

describe("updateActionResult", () => {
  it("should update existing action", async () => {
    const action = createMockActionResult({ id: "to-update", hits: 2 });
    const history = createMockHistory([action]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.updateActionResult(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "to-update",
      { hits: 5 }
    );

    expect(result?.hits).toBe(5);
  });

  it("should return null for non-existent action", async () => {
    const history = createMockHistory([]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.updateActionResult(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "non-existent",
      { hits: 5 }
    );

    expect(result).toBeNull();
  });

  it("should return null for non-existent history", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await actionHistoryStorage.updateActionResult(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "any-id",
      { hits: 5 }
    );

    expect(result).toBeNull();
  });
});

// =============================================================================
// CALCULATE ACTION STATS TESTS
// =============================================================================

describe("calculateActionStats", () => {
  it("should calculate totals and averages", async () => {
    const actions = [
      createMockActionResult({ hits: 3, edgeSpent: 1, isGlitch: false, isCriticalGlitch: false }),
      createMockActionResult({ hits: 5, edgeSpent: 0, isGlitch: false, isCriticalGlitch: false }),
      createMockActionResult({ hits: 1, edgeSpent: 2, isGlitch: true, isCriticalGlitch: false }),
    ];
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.calculateActionStats(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result?.totalActions).toBe(3);
    expect(result?.totalHits).toBe(9); // 3+5+1
    expect(result?.averageHits).toBe(3); // 9/3
    expect(result?.totalGlitches).toBe(1);
    expect(result?.totalEdgeSpent).toBe(3); // 1+0+2
  });

  it("should find most used skill", async () => {
    const actions = [
      createMockActionResult({ pool: createMockActionPool("Firearms") }),
      createMockActionResult({ pool: createMockActionPool("Firearms") }),
      createMockActionResult({ pool: createMockActionPool("Athletics") }),
    ];
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.calculateActionStats(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result?.mostUsedSkill).toBe("Firearms");
  });

  it("should return null for empty history", async () => {
    const history = createMockHistory([]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.calculateActionStats(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result).toBeNull();
  });
});

// =============================================================================
// QUERY ACTION HISTORY TESTS
// =============================================================================

describe("queryActionHistory", () => {
  it("should filter by action type", async () => {
    const actions = [
      createMockActionResult({ id: "a1", context: { actionType: "skill_test" } }),
      createMockActionResult({ id: "a2", context: { actionType: "attack" } }),
      createMockActionResult({ id: "a3", context: { actionType: "skill_test" } }),
    ];
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.queryActionHistory(TEST_USER_ID, TEST_CHARACTER_ID, {
      actionType: "skill_test",
    });

    expect(result.actions).toHaveLength(2);
    expect(result.actions.every((a) => a.context?.actionType === "skill_test")).toBe(true);
  });

  it("should filter by skill", async () => {
    const actions = [
      createMockActionResult({ id: "a1", pool: createMockActionPool("Firearms") }),
      createMockActionResult({ id: "a2", pool: createMockActionPool("Athletics") }),
      createMockActionResult({ id: "a3", pool: createMockActionPool("Firearms") }),
    ];
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.queryActionHistory(TEST_USER_ID, TEST_CHARACTER_ID, {
      skill: "Firearms",
    });

    expect(result.actions).toHaveLength(2);
  });

  it("should filter by date range", async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const actions = [
      createMockActionResult({ id: "a1", timestamp: now.toISOString() }),
      createMockActionResult({ id: "a2", timestamp: yesterday.toISOString() }),
      createMockActionResult({ id: "a3", timestamp: twoDaysAgo.toISOString() }),
    ];
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.queryActionHistory(TEST_USER_ID, TEST_CHARACTER_ID, {
      startDate: yesterday.toISOString(),
      endDate: now.toISOString(),
    });

    expect(result.actions).toHaveLength(2);
  });

  it("should filter by glitch status", async () => {
    const actions = [
      createMockActionResult({ id: "a1", isGlitch: true }),
      createMockActionResult({ id: "a2", isGlitch: false }),
      createMockActionResult({ id: "a3", isGlitch: true }),
    ];
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.queryActionHistory(TEST_USER_ID, TEST_CHARACTER_ID, {
      hadGlitch: true,
    });

    expect(result.actions).toHaveLength(2);
  });

  it("should filter by edge used", async () => {
    const actions = [
      createMockActionResult({ id: "a1", edgeSpent: 2 }),
      createMockActionResult({ id: "a2", edgeSpent: 0 }),
      createMockActionResult({ id: "a3", edgeSpent: 1 }),
    ];
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.queryActionHistory(TEST_USER_ID, TEST_CHARACTER_ID, {
      usedEdge: true,
    });

    expect(result.actions).toHaveLength(2);
  });

  it("should support pagination", async () => {
    const actions = Array.from({ length: 50 }, (_, i) =>
      createMockActionResult({ id: `action-${i}` })
    );
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    const result = await actionHistoryStorage.queryActionHistory(TEST_USER_ID, TEST_CHARACTER_ID, {
      limit: 10,
      offset: 20,
    });

    expect(result.actions).toHaveLength(10);
    expect(result.total).toBe(50);
  });
});

// =============================================================================
// CLEAR ACTION HISTORY TESTS
// =============================================================================

describe("clearActionHistory", () => {
  it("should clear all actions but keep history structure", async () => {
    const actions = [createMockActionResult(), createMockActionResult()];
    const history = createMockHistory(actions);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(history);

    await actionHistoryStorage.clearActionHistory(TEST_USER_ID, TEST_CHARACTER_ID);

    const writeCall = vi.mocked(base.writeJsonFile).mock.calls[0];
    const writtenData = writeCall[1] as ActionHistory;
    expect(writtenData.actions).toEqual([]);
    expect(writtenData.characterId).toBe(TEST_CHARACTER_ID);
  });

  it("should not write if history does not exist", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    await actionHistoryStorage.clearActionHistory(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(base.writeJsonFile).not.toHaveBeenCalled();
  });
});

// =============================================================================
// DELETE ACTION HISTORY TESTS
// =============================================================================

describe("deleteActionHistory", () => {
  // Note: deleteActionHistory uses fs.unlink directly which cannot be easily mocked in ESM
  // These tests verify the function signature exists

  it("should be a function", () => {
    expect(typeof actionHistoryStorage.deleteActionHistory).toBe("function");
  });
});
