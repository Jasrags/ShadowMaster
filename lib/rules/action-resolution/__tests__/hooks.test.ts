/**
 * Unit tests for hooks.ts
 *
 * Tests React hooks for action resolution, Edge management,
 * pool building, and action history.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { Character, ActionPool, ActionResult, PoolModifier } from "@/lib/types";

// Mock pool-builder (must be before imports)
vi.mock("../pool-builder", () => ({
  buildActionPool: vi.fn((character, options) => ({
    basePool: 8,
    totalDice:
      8 +
      (options.situationalModifiers?.reduce((s: number, m: PoolModifier) => s + m.value, 0) || 0),
    modifiers: options.situationalModifiers || [],
    limit: options.limit,
    limitSource: options.limitSource,
    attribute: options.attribute,
    skill: options.skill,
  })),
  calculateWoundModifier: vi.fn(() => 0),
  calculateLimit: vi.fn((character, type) => {
    if (type === "physical") return 5;
    if (type === "mental") return 4;
    if (type === "social") return 4;
    return 0;
  }),
}));

// Mock dice-engine
vi.mock("../dice-engine", () => ({
  DEFAULT_DICE_RULES: {
    hitThreshold: 5,
    glitchThreshold: 0.5,
    criticalGlitchRequiresZeroHits: true,
    woundModifiers: { boxesPerPenalty: 3, maxPenalty: -4 },
  },
  executeRoll: vi.fn(() => ({
    dice: [
      { value: 5, isHit: true, isOne: false },
      { value: 6, isHit: true, isOne: false },
      { value: 3, isHit: false, isOne: false },
    ],
    hits: 2,
    rawHits: 2,
    ones: 0,
    isGlitch: false,
    isCriticalGlitch: false,
    limitApplied: false,
    poolSize: 3,
  })),
  executeReroll: vi.fn(() => ({
    dice: [
      { value: 5, isHit: true, isOne: false },
      { value: 6, isHit: true, isOne: false },
      { value: 5, isHit: true, isOne: false, wasRerolled: true },
    ],
    hits: 3,
    rawHits: 3,
    ones: 0,
    isGlitch: false,
    isCriticalGlitch: false,
    limitApplied: false,
    poolSize: 3,
  })),
}));

import { useActionResolver, useEdge, usePoolBuilder, useActionHistory } from "../hooks";
import { executeRoll, executeReroll } from "../dice-engine";
import { buildActionPool, calculateWoundModifier, calculateLimit } from "../pool-builder";

// =============================================================================
// HELPERS
// =============================================================================

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    ownerId: "user-1",
    editionCode: "sr5",
    name: "Test Runner",
    status: "active",
    approvalStatus: "approved",
    karma: 0,
    totalKarma: 25,
    nuyen: 5000,
    totalNuyen: 10000,
    streetCred: 0,
    notoriety: 0,
    publicAwareness: 0,
    metatype: "human",
    attributes: {
      body: 4,
      agility: 5,
      reaction: 4,
      strength: 3,
      charisma: 3,
      intuition: 4,
      logic: 3,
      willpower: 4,
      edge: 3,
      magic: 0,
      resonance: 0,
      essence: 6,
    },
    skills: [],
    specializations: [],
    knowledgeSkills: [],
    languageSkills: [],
    positiveQualities: [],
    negativeQualities: [],
    contacts: [],
    lifestyles: [],
    weapons: [],
    armor: [],
    gear: [],
    vehicles: [],
    cyberware: [],
    bioware: [],
    spells: [],
    complexForms: [],
    adeptPowers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

function createMockPool(overrides: Partial<ActionPool> = {}): ActionPool {
  return {
    basePool: 8,
    totalDice: 8,
    modifiers: [],
    limit: 6,
    limitSource: "Physical",
    ...overrides,
  };
}

function createMockActionResult(overrides: Partial<ActionResult> = {}): ActionResult {
  return {
    id: "result-1",
    characterId: "char-1",
    userId: "user-1",
    pool: createMockPool(),
    dice: [
      { value: 5, isHit: true, isOne: false },
      { value: 6, isHit: true, isOne: false },
      { value: 3, isHit: false, isOne: false },
    ],
    hits: 2,
    rawHits: 2,
    ones: 0,
    isGlitch: false,
    isCriticalGlitch: false,
    edgeSpent: 0,
    rerollCount: 0,
    timestamp: new Date().toISOString(),
    ...overrides,
  } as ActionResult;
}

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: vi.fn(() => "test-uuid"),
    getRandomValues: vi.fn((arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
  },
  writable: true,
});

// =============================================================================
// useActionResolver TESTS
// =============================================================================

describe("useActionResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("initialization", () => {
    it("should initialize with null result and empty history", () => {
      const { result } = renderHook(() => useActionResolver());

      expect(result.current.currentResult).toBeNull();
      expect(result.current.history).toEqual([]);
      expect(result.current.isRolling).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("roll()", () => {
    it("should perform server-side roll when persistRolls is true", async () => {
      const mockResult = createMockActionResult();
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, result: mockResult }),
      });

      const { result } = renderHook(() =>
        useActionResolver({ characterId: "char-1", persistRolls: true })
      );

      await act(async () => {
        await result.current.roll(createMockPool());
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/characters/char-1/actions",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result.current.currentResult).toEqual(mockResult);
    });

    it("should perform client-side roll when persistRolls is false", async () => {
      const { result } = renderHook(() => useActionResolver({ persistRolls: false }));

      await act(async () => {
        await result.current.roll(createMockPool());
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(executeRoll).toHaveBeenCalled();
      expect(result.current.currentResult).not.toBeNull();
      expect(result.current.currentResult?.id).toBe("test-uuid");
    });

    it("should add result to history", async () => {
      const { result } = renderHook(() => useActionResolver({ persistRolls: false }));

      await act(async () => {
        await result.current.roll(createMockPool());
      });

      expect(result.current.history).toHaveLength(1);
    });

    it("should limit history to maxLocalHistory", async () => {
      const { result } = renderHook(() =>
        useActionResolver({ persistRolls: false, maxLocalHistory: 2 })
      );

      await act(async () => {
        await result.current.roll(createMockPool());
        await result.current.roll(createMockPool());
        await result.current.roll(createMockPool());
      });

      expect(result.current.history).toHaveLength(2);
    });

    it("should set error on fetch failure", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: "Server error" }),
      });

      const { result } = renderHook(() =>
        useActionResolver({ characterId: "char-1", persistRolls: true })
      );

      await act(async () => {
        await result.current.roll(createMockPool());
      });

      expect(result.current.error).toBe("Server error");
      expect(result.current.currentResult).toBeNull();
    });

    it("should handle PoolBuildOptions as input", async () => {
      const { result } = renderHook(() => useActionResolver({ persistRolls: false }));

      await act(async () => {
        await result.current.roll({
          manualPool: 10,
          limit: 6,
          limitSource: "Physical",
        });
      });

      expect(result.current.currentResult).not.toBeNull();
    });
  });

  describe("reroll()", () => {
    it("should return null and set error if no current result", async () => {
      const { result } = renderHook(() => useActionResolver({ persistRolls: false }));

      let rerollResult: ActionResult | null = null;
      await act(async () => {
        rerollResult = await result.current.reroll("second_chance");
      });

      expect(rerollResult).toBeNull();
      expect(result.current.error).toBe("No result to reroll");
    });

    it("should perform server-side reroll when persistRolls is true", async () => {
      const originalResult = createMockActionResult();
      const rerolledResult = createMockActionResult({
        hits: 3,
        rerollCount: 1,
        edgeAction: "second_chance",
      });

      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, result: originalResult }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, result: rerolledResult }),
        });

      const { result } = renderHook(() =>
        useActionResolver({ characterId: "char-1", persistRolls: true })
      );

      await act(async () => {
        await result.current.roll(createMockPool());
      });

      await act(async () => {
        await result.current.reroll("second_chance");
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result.current.currentResult?.rerollCount).toBe(1);
    });

    it("should perform client-side reroll when persistRolls is false", async () => {
      const { result } = renderHook(() => useActionResolver({ persistRolls: false }));

      await act(async () => {
        await result.current.roll(createMockPool());
      });

      await act(async () => {
        await result.current.reroll("second_chance");
      });

      expect(executeReroll).toHaveBeenCalled();
      expect(result.current.currentResult?.rerollCount).toBe(1);
    });

    it("should update history entry on reroll", async () => {
      const { result } = renderHook(() => useActionResolver({ persistRolls: false }));

      await act(async () => {
        await result.current.roll(createMockPool());
      });

      const originalId = result.current.currentResult?.id;

      await act(async () => {
        await result.current.reroll("second_chance");
      });

      // History should have same ID but updated result
      expect(result.current.history[0].id).toBe(originalId);
      expect(result.current.history[0].rerollCount).toBe(1);
    });
  });

  describe("clearResult()", () => {
    it("should clear current result", async () => {
      const { result } = renderHook(() => useActionResolver({ persistRolls: false }));

      await act(async () => {
        await result.current.roll(createMockPool());
      });

      expect(result.current.currentResult).not.toBeNull();

      act(() => {
        result.current.clearResult();
      });

      expect(result.current.currentResult).toBeNull();
    });

    it("should clear error", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: "Test error" }),
      });

      const { result } = renderHook(() =>
        useActionResolver({ characterId: "char-1", persistRolls: true })
      );

      await act(async () => {
        await result.current.roll(createMockPool());
      });

      expect(result.current.error).toBe("Test error");

      act(() => {
        result.current.clearResult();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("clearHistory()", () => {
    it("should clear all history", async () => {
      const { result } = renderHook(() => useActionResolver({ persistRolls: false }));

      await act(async () => {
        await result.current.roll(createMockPool());
        await result.current.roll(createMockPool());
      });

      expect(result.current.history).toHaveLength(2);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.history).toEqual([]);
    });
  });
});

// =============================================================================
// useEdge TESTS
// =============================================================================

describe("useEdge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("initialization", () => {
    it("should fetch edge status on mount", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, edgeCurrent: 2, edgeMaximum: 3 }),
      });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/characters/char-1/edge");
      expect(result.current.current).toBe(2);
      expect(result.current.maximum).toBe(3);
    });

    it("should set error on fetch failure", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: "Not found" }),
      });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Not found");
    });
  });

  describe("canSpend / canRestore", () => {
    it("should compute canSpend based on current edge", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, edgeCurrent: 2, edgeMaximum: 3 }),
      });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canSpend).toBe(true);
    });

    it("should return canSpend false when at 0", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, edgeCurrent: 0, edgeMaximum: 3 }),
      });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canSpend).toBe(false);
    });

    it("should compute canRestore based on edge vs maximum", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, edgeCurrent: 2, edgeMaximum: 3 }),
      });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canRestore).toBe(true);
    });

    it("should return canRestore false when at maximum", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, edgeCurrent: 3, edgeMaximum: 3 }),
      });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canRestore).toBe(false);
    });
  });

  describe("spend()", () => {
    it("should call API with spend action", async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, edgeCurrent: 3, edgeMaximum: 3 }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, edgeCurrent: 2, edgeMaximum: 3 }),
        });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.spend(1, "Push the Limit");
      });

      expect(success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/characters/char-1/edge",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ action: "spend", amount: 1, reason: "Push the Limit" }),
        })
      );
      expect(result.current.current).toBe(2);
    });

    it("should return false on failure", async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, edgeCurrent: 0, edgeMaximum: 3 }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: false, error: "Insufficient Edge" }),
        });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let success: boolean = false;
      await act(async () => {
        success = await result.current.spend();
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe("Insufficient Edge");
    });
  });

  describe("restore()", () => {
    it("should call API with restore action", async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, edgeCurrent: 1, edgeMaximum: 3 }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, edgeCurrent: 2, edgeMaximum: 3 }),
        });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.restore(1, "Scene start");
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/characters/char-1/edge",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ action: "restore", amount: 1, reason: "Scene start" }),
        })
      );
      expect(result.current.current).toBe(2);
    });
  });

  describe("restoreFull()", () => {
    it("should restore to maximum edge", async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, edgeCurrent: 1, edgeMaximum: 3 }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, edgeCurrent: 3, edgeMaximum: 3 }),
        });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.restoreFull("Session end");
      });

      expect(result.current.current).toBe(3);
    });
  });

  describe("refresh()", () => {
    it("should refetch edge status", async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, edgeCurrent: 1, edgeMaximum: 3 }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, edgeCurrent: 2, edgeMaximum: 3 }),
        });

      const { result } = renderHook(() => useEdge("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.current).toBe(1);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.current).toBe(2);
    });
  });
});

// =============================================================================
// usePoolBuilder TESTS
// =============================================================================

describe("usePoolBuilder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("with character", () => {
    it("should calculate wound modifier", () => {
      const character = createMockCharacter({
        condition: { physicalDamage: 6, stunDamage: 0 },
      });

      const { result } = renderHook(() => usePoolBuilder(character));

      expect(calculateWoundModifier).toHaveBeenCalledWith(6, 0, expect.anything());
    });

    it("should calculate limits", () => {
      const character = createMockCharacter();

      const { result } = renderHook(() => usePoolBuilder(character));

      expect(result.current.physicalLimit).toBe(5);
      expect(result.current.mentalLimit).toBe(4);
      expect(result.current.socialLimit).toBe(4);
    });

    it("should build pools using buildActionPool", () => {
      const character = createMockCharacter();

      const { result } = renderHook(() => usePoolBuilder(character));

      const pool = result.current.buildPool({
        attribute: "agility",
        skill: "firearms",
      });

      expect(buildActionPool).toHaveBeenCalled();
      expect(pool.basePool).toBe(8);
    });
  });

  describe("without character", () => {
    it("should return 0 for all values", () => {
      const { result } = renderHook(() => usePoolBuilder(null));

      expect(result.current.woundModifier).toBe(0);
      expect(result.current.physicalLimit).toBe(0);
      expect(result.current.mentalLimit).toBe(0);
      expect(result.current.socialLimit).toBe(0);
    });

    it("should return minimal pool when building", () => {
      const { result } = renderHook(() => usePoolBuilder(null));

      const pool = result.current.buildPool({ manualPool: 5 });

      expect(pool.basePool).toBe(5);
      expect(pool.totalDice).toBe(5);
    });
  });

  describe("modifier management", () => {
    it("should add modifier", () => {
      const character = createMockCharacter();
      const { result } = renderHook(() => usePoolBuilder(character));

      act(() => {
        result.current.addModifier({
          source: "environmental",
          value: -2,
          description: "Light cover",
        });
      });

      expect(result.current.modifiers).toHaveLength(1);
      expect(result.current.modifiers[0].source).toBe("environmental");
    });

    it("should remove modifier by index", () => {
      const character = createMockCharacter();
      const { result } = renderHook(() => usePoolBuilder(character));

      act(() => {
        result.current.addModifier({
          source: "environmental",
          value: -2,
          description: "Light cover",
        });
        result.current.addModifier({
          source: "equipment",
          value: 2,
          description: "Smartgun",
        });
      });

      expect(result.current.modifiers).toHaveLength(2);

      act(() => {
        result.current.removeModifier(0);
      });

      expect(result.current.modifiers).toHaveLength(1);
      expect(result.current.modifiers[0].source).toBe("equipment");
    });

    it("should clear all modifiers", () => {
      const character = createMockCharacter();
      const { result } = renderHook(() => usePoolBuilder(character));

      act(() => {
        result.current.addModifier({
          source: "environmental",
          value: -2,
          description: "Light cover",
        });
        result.current.addModifier({
          source: "equipment",
          value: 2,
          description: "Smartgun",
        });
      });

      expect(result.current.modifiers).toHaveLength(2);

      act(() => {
        result.current.clearModifiers();
      });

      expect(result.current.modifiers).toEqual([]);
    });

    it("should include tracked modifiers in buildPool", () => {
      const character = createMockCharacter();
      const { result } = renderHook(() => usePoolBuilder(character));

      act(() => {
        result.current.addModifier({
          source: "environmental",
          value: -2,
          description: "Light cover",
        });
      });

      const pool = result.current.buildPool({
        attribute: "agility",
        skill: "firearms",
      });

      expect(buildActionPool).toHaveBeenCalledWith(
        character,
        expect.objectContaining({
          situationalModifiers: expect.arrayContaining([
            expect.objectContaining({ source: "environmental" }),
          ]),
        }),
        expect.anything()
      );
    });
  });
});

// =============================================================================
// useActionHistory TESTS
// =============================================================================

describe("useActionHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("initialization", () => {
    it("should fetch history on mount", async () => {
      const mockActions = [createMockActionResult()];
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: true, actions: mockActions, total: 1 }),
      });

      const { result } = renderHook(() => useActionHistory("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/characters/char-1/actions")
      );
      expect(result.current.actions).toHaveLength(1);
      expect(result.current.total).toBe(1);
    });

    it("should include stats when requested", async () => {
      const mockStats = { totalRolls: 10, averageHits: 2.5 };
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            actions: [],
            total: 10,
            stats: mockStats,
          }),
      });

      const { result } = renderHook(() => useActionHistory("char-1", { includeStats: true }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("includeStats=true"));
      expect(result.current.stats).toEqual(mockStats);
    });

    it("should set error on fetch failure", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ success: false, error: "Not found" }),
      });

      const { result } = renderHook(() => useActionHistory("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Not found");
    });
  });

  describe("hasMore", () => {
    it("should return true when more actions available", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            actions: [createMockActionResult()],
            total: 5,
          }),
      });

      const { result } = renderHook(() => useActionHistory("char-1", { limit: 2 }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasMore).toBe(true);
    });

    it("should return false when all actions loaded", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            actions: [createMockActionResult()],
            total: 1,
          }),
      });

      const { result } = renderHook(() => useActionHistory("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasMore).toBe(false);
    });
  });

  describe("loadMore()", () => {
    it("should append more actions", async () => {
      const firstBatch = [createMockActionResult({ id: "action-1" })];
      const secondBatch = [createMockActionResult({ id: "action-2" })];

      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, actions: firstBatch, total: 2 }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, actions: secondBatch, total: 2 }),
        });

      const { result } = renderHook(() => useActionHistory("char-1", { limit: 1 }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.actions).toHaveLength(1);

      await act(async () => {
        await result.current.loadMore();
      });

      expect(result.current.actions).toHaveLength(2);
    });

    it("should not load if all loaded", async () => {
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            success: true,
            actions: [createMockActionResult()],
            total: 1,
          }),
      });

      const { result } = renderHook(() => useActionHistory("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.loadMore();
      });

      // Should only have called fetch once (initial load)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("refresh()", () => {
    it("should reset and refetch history", async () => {
      const firstBatch = [createMockActionResult({ id: "action-1" })];
      const refreshBatch = [createMockActionResult({ id: "action-new" })];

      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, actions: firstBatch, total: 1 }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, actions: refreshBatch, total: 1 }),
        });

      const { result } = renderHook(() => useActionHistory("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.actions[0].id).toBe("action-1");

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.actions[0].id).toBe("action-new");
    });

    it("should clear error on successful refresh", async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: false, error: "Initial error" }),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, actions: [], total: 0 }),
        });

      const { result } = renderHook(() => useActionHistory("char-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe("Initial error");

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
