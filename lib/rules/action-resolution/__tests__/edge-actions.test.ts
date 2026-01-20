/**
 * Unit tests for edge-actions.ts
 *
 * Tests Edge availability checks, Edge action execution,
 * and Edge restoration mechanics.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Character, ActionPool, ActionResult, DiceResult, EdgeActionType } from "@/lib/types";

// Mock the dice-engine
vi.mock("../dice-engine", () => ({
  DEFAULT_DICE_RULES: {
    hitThreshold: 5,
    glitchThreshold: 0.5,
    criticalGlitchRequiresZeroHits: true,
    allowExplodingSixes: false,
    maxDicePool: 50,
    minDicePool: 1,
    edgeActions: {
      "push-the-limit": {
        name: "Push the Limit",
        description: "Add Edge to your dice pool, roll, and any 6s explode.",
        cost: 1,
        preRoll: true,
        postRoll: false,
        addsDice: true,
        explodingSixes: true,
      },
      "second-chance": {
        name: "Second Chance",
        description: "Reroll all dice that did not score a hit.",
        cost: 1,
        preRoll: false,
        postRoll: true,
        allowsReroll: true,
      },
      "seize-the-initiative": {
        name: "Seize the Initiative",
        description: "Go first in an Initiative Pass.",
        cost: 1,
        preRoll: false,
        postRoll: false,
      },
      blitz: {
        name: "Blitz",
        description: "Roll 5d6 for Initiative.",
        cost: 1,
        preRoll: true,
        postRoll: false,
        addsDice: true,
      },
      "close-call": {
        name: "Close Call",
        description: "Negate a glitch or critical glitch.",
        cost: 1,
        preRoll: false,
        postRoll: true,
      },
      "dead-mans-trigger": {
        name: "Dead Man's Trigger",
        description: "Act when incapacitated.",
        cost: 1,
        preRoll: false,
        postRoll: false,
      },
    },
    woundModifiers: {
      boxesPerPenalty: 3,
      maxPenalty: -4,
    },
  },
  executeRoll: vi.fn().mockReturnValue({
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
  }),
  executeReroll: vi.fn().mockReturnValue({
    dice: [
      { value: 5, isHit: true, isOne: false },
      { value: 6, isHit: true, isOne: false },
      { value: 5, isHit: true, isOne: false, wasRerolled: true, originalValue: 3 },
    ],
    hits: 3,
    rawHits: 3,
    ones: 0,
    isGlitch: false,
    isCriticalGlitch: false,
    limitApplied: false,
    poolSize: 3,
  }),
  rollDiceExploding: vi.fn(),
  calculateHitsWithLimit: vi.fn(),
  calculateGlitch: vi.fn(),
  sortDiceForDisplay: vi.fn(),
}));

// Mock pool-builder
vi.mock("../pool-builder", () => ({
  getAttributeValue: vi.fn((character: Character, attr: string) => {
    if (attr === "edge") return character.attributes?.edge ?? 0;
    return 0;
  }),
  addModifiersToPool: vi.fn((pool: ActionPool, modifier) => ({
    ...pool,
    modifiers: [...pool.modifiers, modifier],
    totalDice: pool.totalDice + modifier.value,
  })),
}));

import {
  getCurrentEdge,
  getMaxEdge,
  canSpendEdge,
  canUseEdgeAction,
  executePushTheLimit,
  executeSecondChance,
  executeCloseCall,
  executeBlitz,
  executeEdgeAction,
  calculateRestorableEdge,
  canRestoreEdge,
} from "../edge-actions";
import { executeRoll, executeReroll, DEFAULT_DICE_RULES } from "../dice-engine";
import { getAttributeValue, addModifiersToPool } from "../pool-builder";

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

// =============================================================================
// getCurrentEdge TESTS
// =============================================================================

describe("getCurrentEdge", () => {
  it("should return edgeCurrent from condition if set", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 2, physicalDamage: 0, stunDamage: 0 },
    });
    expect(getCurrentEdge(character)).toBe(2);
  });

  it("should return edge attribute if condition.edgeCurrent not set", () => {
    const character = createMockCharacter();
    expect(getCurrentEdge(character)).toBe(3);
  });

  it("should return 0 if no edge attribute", () => {
    const character = createMockCharacter();
    delete (character as Partial<Character>).attributes;
    expect(getCurrentEdge(character)).toBe(0);
  });

  it("should return 0 for edgeCurrent of 0", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });
    expect(getCurrentEdge(character)).toBe(0);
  });
});

// =============================================================================
// getMaxEdge TESTS
// =============================================================================

describe("getMaxEdge", () => {
  it("should return edge attribute value", () => {
    const character = createMockCharacter();
    expect(getMaxEdge(character)).toBe(3);
  });

  it("should return 0 if no attributes", () => {
    const character = createMockCharacter();
    delete (character as Partial<Character>).attributes;
    expect(getMaxEdge(character)).toBe(0);
  });
});

// =============================================================================
// canSpendEdge TESTS
// =============================================================================

describe("canSpendEdge", () => {
  it("should return true when current edge >= amount", () => {
    const character = createMockCharacter();
    expect(canSpendEdge(character, 1)).toBe(true);
    expect(canSpendEdge(character, 3)).toBe(true);
  });

  it("should return false when current edge < amount", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 1, physicalDamage: 0, stunDamage: 0 },
    });
    expect(canSpendEdge(character, 2)).toBe(false);
  });

  it("should default to checking 1 edge", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 1, physicalDamage: 0, stunDamage: 0 },
    });
    expect(canSpendEdge(character)).toBe(true);
  });

  it("should return false when no edge available", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });
    expect(canSpendEdge(character)).toBe(false);
  });
});

// =============================================================================
// canUseEdgeAction TESTS
// =============================================================================

describe("canUseEdgeAction", () => {
  it("should allow push-the-limit when pre-roll with sufficient edge", () => {
    const character = createMockCharacter();
    const result = canUseEdgeAction(character, "push-the-limit", {
      isPreRoll: true,
    });

    expect(result.canUse).toBe(true);
  });

  it("should reject push-the-limit when post-roll", () => {
    const character = createMockCharacter();
    const result = canUseEdgeAction(character, "push-the-limit", {
      isPostRoll: true,
    });

    expect(result.canUse).toBe(false);
    expect(result.reason).toContain("cannot be used after rolling");
  });

  it("should reject when insufficient edge", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });
    const result = canUseEdgeAction(character, "push-the-limit", {
      isPreRoll: true,
    });

    expect(result.canUse).toBe(false);
    expect(result.reason).toContain("Insufficient Edge");
  });

  it("should allow second-chance when post-roll with result", () => {
    const character = createMockCharacter();
    const result = canUseEdgeAction(character, "second-chance", {
      isPostRoll: true,
      currentResult: createMockActionResult(),
    });

    expect(result.canUse).toBe(true);
  });

  it("should reject second-chance without result", () => {
    const character = createMockCharacter();
    const result = canUseEdgeAction(character, "second-chance", {
      isPostRoll: true,
    });

    expect(result.canUse).toBe(false);
    expect(result.reason).toContain("No result to reroll");
  });

  it("should reject second-chance if already rerolled", () => {
    const character = createMockCharacter();
    const result = canUseEdgeAction(character, "second-chance", {
      isPostRoll: true,
      currentResult: createMockActionResult({ rerollCount: 1 }),
    });

    expect(result.canUse).toBe(false);
    expect(result.reason).toContain("Already used Second Chance");
  });

  it("should allow close-call when there is a glitch", () => {
    const character = createMockCharacter();
    const result = canUseEdgeAction(character, "close-call", {
      isPostRoll: true,
      hasGlitch: true,
    });

    expect(result.canUse).toBe(true);
  });

  it("should reject close-call when no glitch", () => {
    const character = createMockCharacter();
    const result = canUseEdgeAction(character, "close-call", {
      isPostRoll: true,
      hasGlitch: false,
    });

    expect(result.canUse).toBe(false);
    expect(result.reason).toContain("No glitch to negate");
  });

  it("should reject unknown edge action", () => {
    const character = createMockCharacter();
    const result = canUseEdgeAction(character, "unknown_action" as EdgeActionType, {
      isPreRoll: true,
    });

    expect(result.canUse).toBe(false);
    expect(result.reason).toContain("not available");
  });
});

// =============================================================================
// executePushTheLimit TESTS
// =============================================================================

describe("executePushTheLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail with insufficient edge", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });
    const pool = createMockPool();

    const result = executePushTheLimit(character, pool);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Insufficient Edge");
    expect(result.edgeSpent).toBe(0);
  });

  it("should add edge rating to pool", () => {
    const character = createMockCharacter();
    const pool = createMockPool();

    const result = executePushTheLimit(character, pool);

    expect(result.success).toBe(true);
    expect(addModifiersToPool).toHaveBeenCalledWith(
      pool,
      expect.objectContaining({ source: "edge", value: 3 })
    );
  });

  it("should remove limit from pool", () => {
    const character = createMockCharacter();
    const pool = createMockPool({ limit: 5, limitSource: "Physical" });

    const result = executePushTheLimit(character, pool);

    expect(result.success).toBe(true);
    expect(result.modifiedPool?.limit).toBeUndefined();
    expect(result.modifiedPool?.limitSource).toBeUndefined();
  });

  it("should roll with exploding sixes", () => {
    const character = createMockCharacter();
    const pool = createMockPool();

    const result = executePushTheLimit(character, pool);

    expect(result.success).toBe(true);
    expect(executeRoll).toHaveBeenCalledWith(
      expect.any(Number),
      expect.anything(),
      expect.objectContaining({ explodingSixes: true })
    );
  });

  it("should spend edge and return updated count", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 2, physicalDamage: 0, stunDamage: 0 },
    });
    const pool = createMockPool();

    const result = executePushTheLimit(character, pool);

    expect(result.success).toBe(true);
    expect(result.edgeSpent).toBe(1);
    expect(result.newEdgeCurrent).toBe(1);
  });

  it("should return roll result", () => {
    const character = createMockCharacter();
    const pool = createMockPool();

    const result = executePushTheLimit(character, pool);

    expect(result.success).toBe(true);
    expect(result.rollResult).toBeDefined();
    expect(result.rollResult?.hits).toBe(2);
  });
});

// =============================================================================
// executeSecondChance TESTS
// =============================================================================

describe("executeSecondChance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail with insufficient edge", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });
    const originalResult = createMockActionResult();

    const result = executeSecondChance(character, originalResult);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Insufficient Edge");
    expect(result.edgeSpent).toBe(0);
  });

  it("should fail if already rerolled", () => {
    const character = createMockCharacter();
    const originalResult = createMockActionResult({ rerollCount: 1 });

    const result = executeSecondChance(character, originalResult);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Already used Second Chance");
  });

  it("should reroll original dice", () => {
    const character = createMockCharacter();
    const originalResult = createMockActionResult();

    const result = executeSecondChance(character, originalResult);

    expect(result.success).toBe(true);
    expect(executeReroll).toHaveBeenCalledWith(
      originalResult.dice,
      expect.anything(),
      originalResult.pool.limit
    );
  });

  it("should preserve original limit", () => {
    const character = createMockCharacter();
    const originalResult = createMockActionResult({
      pool: createMockPool({ limit: 4 }),
    });

    executeSecondChance(character, originalResult);

    expect(executeReroll).toHaveBeenCalledWith(expect.anything(), expect.anything(), 4);
  });

  it("should spend edge and return updated count", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 2, physicalDamage: 0, stunDamage: 0 },
    });
    const originalResult = createMockActionResult();

    const result = executeSecondChance(character, originalResult);

    expect(result.success).toBe(true);
    expect(result.edgeSpent).toBe(1);
    expect(result.newEdgeCurrent).toBe(1);
  });
});

// =============================================================================
// executeCloseCall TESTS
// =============================================================================

describe("executeCloseCall", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail with insufficient edge", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });
    const glitchResult = createMockActionResult({ isGlitch: true });

    const result = executeCloseCall(character, glitchResult);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Insufficient Edge");
  });

  it("should fail if no glitch to negate", () => {
    const character = createMockCharacter();
    const normalResult = createMockActionResult({
      isGlitch: false,
      isCriticalGlitch: false,
    });

    const result = executeCloseCall(character, normalResult);

    expect(result.success).toBe(false);
    expect(result.error).toBe("No glitch to negate");
  });

  it("should succeed on glitch", () => {
    const character = createMockCharacter();
    const glitchResult = createMockActionResult({ isGlitch: true });

    const result = executeCloseCall(character, glitchResult);

    expect(result.success).toBe(true);
    expect(result.glitchNegated).toBe(true);
  });

  it("should succeed on critical glitch", () => {
    const character = createMockCharacter();
    const critGlitchResult = createMockActionResult({
      isGlitch: true,
      isCriticalGlitch: true,
    });

    const result = executeCloseCall(character, critGlitchResult);

    expect(result.success).toBe(true);
    expect(result.glitchNegated).toBe(true);
  });

  it("should not call reroll (close call doesn't reroll)", () => {
    const character = createMockCharacter();
    const glitchResult = createMockActionResult({ isGlitch: true });

    executeCloseCall(character, glitchResult);

    expect(executeReroll).not.toHaveBeenCalled();
  });

  it("should spend edge and return updated count", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 2, physicalDamage: 0, stunDamage: 0 },
    });
    const glitchResult = createMockActionResult({ isGlitch: true });

    const result = executeCloseCall(character, glitchResult);

    expect(result.success).toBe(true);
    expect(result.edgeSpent).toBe(1);
    expect(result.newEdgeCurrent).toBe(1);
  });
});

// =============================================================================
// executeBlitz TESTS
// =============================================================================

describe("executeBlitz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail with insufficient edge", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });

    const result = executeBlitz(character);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Insufficient Edge");
  });

  it("should roll 5d6 for initiative", () => {
    const character = createMockCharacter();

    const result = executeBlitz(character);

    expect(result.success).toBe(true);
    expect(executeRoll).toHaveBeenCalledWith(5, expect.anything());
  });

  it("should spend edge and return updated count", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 2, physicalDamage: 0, stunDamage: 0 },
    });

    const result = executeBlitz(character);

    expect(result.success).toBe(true);
    expect(result.edgeSpent).toBe(1);
    expect(result.newEdgeCurrent).toBe(1);
  });

  it("should return roll result", () => {
    const character = createMockCharacter();

    const result = executeBlitz(character);

    expect(result.success).toBe(true);
    expect(result.rollResult).toBeDefined();
  });
});

// =============================================================================
// executeEdgeAction TESTS
// =============================================================================

describe("executeEdgeAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should dispatch push-the-limit correctly", () => {
    const character = createMockCharacter();
    const pool = createMockPool();

    const result = executeEdgeAction("push-the-limit", character, { pool });

    expect(result.success).toBe(true);
    expect(executeRoll).toHaveBeenCalled();
  });

  it("should fail push-the-limit without pool", () => {
    const character = createMockCharacter();

    const result = executeEdgeAction("push-the-limit", character, {});

    expect(result.success).toBe(false);
    expect(result.error).toContain("requires a pool");
  });

  it("should dispatch second-chance correctly", () => {
    const character = createMockCharacter();
    const actionResult = createMockActionResult();

    const result = executeEdgeAction("second-chance", character, {
      result: actionResult,
    });

    expect(result.success).toBe(true);
    expect(executeReroll).toHaveBeenCalled();
  });

  it("should fail second-chance without result", () => {
    const character = createMockCharacter();

    const result = executeEdgeAction("second-chance", character, {});

    expect(result.success).toBe(false);
    expect(result.error).toContain("requires a result");
  });

  it("should dispatch close-call correctly", () => {
    const character = createMockCharacter();
    const glitchResult = createMockActionResult({ isGlitch: true });

    const result = executeEdgeAction("close-call", character, {
      result: glitchResult,
    });

    expect(result.success).toBe(true);
    expect(result.glitchNegated).toBe(true);
  });

  it("should fail close-call without result", () => {
    const character = createMockCharacter();

    const result = executeEdgeAction("close-call", character, {});

    expect(result.success).toBe(false);
    expect(result.error).toContain("requires a result");
  });

  it("should dispatch blitz correctly", () => {
    const character = createMockCharacter();

    const result = executeEdgeAction("blitz", character, {});

    expect(result.success).toBe(true);
    expect(executeRoll).toHaveBeenCalled();
  });

  it("should handle seize-the-initiative (no dice)", () => {
    const character = createMockCharacter();

    const result = executeEdgeAction("seize-the-initiative", character, {});

    expect(result.success).toBe(true);
    expect(result.edgeSpent).toBe(1);
    expect(result.rollResult).toBeUndefined();
  });

  it("should handle dead-mans-trigger (no dice)", () => {
    const character = createMockCharacter();

    const result = executeEdgeAction("dead-mans-trigger", character, {});

    expect(result.success).toBe(true);
    expect(result.edgeSpent).toBe(1);
    expect(result.rollResult).toBeUndefined();
  });

  it("should fail unknown edge action", () => {
    const character = createMockCharacter();

    const result = executeEdgeAction("unknown_action" as EdgeActionType, character, {});

    expect(result.success).toBe(false);
    expect(result.error).toContain("Unknown Edge action");
  });

  it("should fail seize-the-initiative with no edge", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });

    const result = executeEdgeAction("seize-the-initiative", character, {});

    expect(result.success).toBe(false);
    expect(result.error).toBe("Insufficient Edge");
  });
});

// =============================================================================
// calculateRestorableEdge TESTS
// =============================================================================

describe("calculateRestorableEdge", () => {
  it("should return difference between max and current", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 1, physicalDamage: 0, stunDamage: 0 },
    });
    // Max is 3 (from attributes.edge), current is 1
    expect(calculateRestorableEdge(character)).toBe(2);
  });

  it("should return 0 when at max edge", () => {
    const character = createMockCharacter();
    // No condition.edgeCurrent, so current = max = 3
    expect(calculateRestorableEdge(character)).toBe(0);
  });

  it("should return max edge when at 0", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });
    expect(calculateRestorableEdge(character)).toBe(3);
  });

  it("should not return negative", () => {
    // This shouldn't happen in practice, but test the safety
    const character = createMockCharacter({
      condition: { edgeCurrent: 5, physicalDamage: 0, stunDamage: 0 }, // More than max
    });
    // Max 0 from mock, current 5 -> would be -2, but max(0, -2) = 0
    expect(calculateRestorableEdge(character)).toBe(0);
  });
});

// =============================================================================
// canRestoreEdge TESTS
// =============================================================================

describe("canRestoreEdge", () => {
  it("should return true when edge below max", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 1, physicalDamage: 0, stunDamage: 0 },
    });
    expect(canRestoreEdge(character)).toBe(true);
  });

  it("should return false when at max edge", () => {
    const character = createMockCharacter();
    // No condition.edgeCurrent, so current = max
    expect(canRestoreEdge(character)).toBe(false);
  });

  it("should return true when at 0 edge", () => {
    const character = createMockCharacter({
      condition: { edgeCurrent: 0, physicalDamage: 0, stunDamage: 0 },
    });
    expect(canRestoreEdge(character)).toBe(true);
  });
});
