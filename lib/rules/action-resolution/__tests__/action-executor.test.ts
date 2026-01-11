/**
 * Unit tests for action-executor.ts
 *
 * Tests the core action execution, reroll, opposed tests, and state management.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  Character,
  ActionDefinition,
  ActionAllocation,
  CombatSession,
  CombatParticipant,
  ActionResult,
  ActionPool,
  DiceResult,
  StateChange,
} from "@/lib/types";
import {
  consumeAction,
  executeAction,
  executeActionReroll,
  executeCombatAction,
  executeGeneralAction,
  executeOpposedTest,
  applyStateChanges,
  rollbackStateChanges,
  canExecuteAction,
  getAvailableActions,
  ExecutionRequest,
  RerollRequest,
} from "../action-executor";

// Helper to create DiceResult objects
function makeDice(values: number[]): DiceResult[] {
  return values.map((value) => ({
    value,
    isHit: value >= 5,
    isOne: value === 1,
  }));
}

// Mock the dependencies
vi.mock("@/lib/storage/action-history", () => ({
  saveActionResult: vi.fn().mockResolvedValue(undefined),
  getAction: vi.fn(),
  updateActionResult: vi.fn(),
}));

vi.mock("@/lib/storage/combat", () => ({
  getCombatSession: vi.fn(),
  updateParticipantActions: vi.fn().mockResolvedValue(undefined),
  createOpposedTest: vi.fn().mockResolvedValue({ id: "opposed-test-1" }),
}));

vi.mock("../dice-engine", () => ({
  executeRoll: vi.fn(() => ({
    dice: makeDice([1, 2, 3, 4, 5, 6]),
    hits: 2,
    rawHits: 2,
    ones: 1,
    isGlitch: false,
    isCriticalGlitch: false,
  })),
  executeReroll: vi.fn(() => ({
    dice: makeDice([3, 4, 5, 6, 5, 6]),
    hits: 4,
    rawHits: 4,
    ones: 0,
    isGlitch: false,
    isCriticalGlitch: false,
  })),
  DEFAULT_DICE_RULES: {
    hitThreshold: 5,
    glitchThreshold: 1,
    explodingSixes: false,
    ruleOfSix: false,
  },
}));

vi.mock("../action-validator", () => ({
  validateAction: vi.fn(() => ({
    valid: true,
    errors: [],
    warnings: [],
    modifiedPool: {
      basePool: 6,
      totalDice: 6,
      modifiers: [],
      limit: 6,
      limitSource: "physical",
    },
  })),
  validateActionEconomy: vi.fn(() => ({
    valid: true,
    errors: [],
    warnings: [],
  })),
  ValidationResult: {},
  ValidationError: {},
}));

vi.mock("../pool-builder", () => ({
  buildActionPool: vi.fn(() => ({
    basePool: 6,
    totalDice: 6,
    modifiers: [],
    limit: 6,
    limitSource: "physical",
  })),
}));

// Import mocks to access them
import * as actionHistoryStorage from "@/lib/storage/action-history";
import * as combatStorage from "@/lib/storage/combat";
import { executeRoll, executeReroll } from "../dice-engine";
import { validateAction } from "../action-validator";

// =============================================================================
// TEST FIXTURES
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
    conditionMonitor: {
      physical: {
        current: 0,
        max: 10,
      },
      stun: {
        current: 0,
        max: 10,
      },
      overflow: 0,
    },
    skills: [
      { skillId: "firearms", rating: 4 },
      { skillId: "stealth", rating: 3 },
      { skillId: "perception", rating: 3 },
    ],
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

function createMockAction(overrides: Partial<ActionDefinition> = {}): ActionDefinition {
  return {
    id: "action-fire-weapon",
    name: "Fire Weapon",
    description: "Fire a ranged weapon at a target",
    domain: "combat",
    subcategory: "ranged",
    type: "complex",
    cost: {
      primary: { type: "action", subtype: "complex", amount: 1 },
    },
    prerequisites: [],
    effects: [],
    rollConfig: {
      attribute: "agility",
      skill: "firearms",
      defaultLimit: "physical",
    },
    tags: ["ranged", "combat"],
    source: { book: "CRB", page: 173 },
    ...overrides,
  } as ActionDefinition;
}

function createMockCombatSession(overrides: Partial<CombatSession> = {}): CombatSession {
  return {
    id: "combat-1",
    campaignId: "campaign-1",
    ownerId: "user-1",
    name: "Test Combat",
    status: "active",
    phase: "initiative",
    round: 1,
    currentTurn: 0,
    currentPhase: "initiative",
    initiativeOrder: ["participant-1"],
    participants: [
      {
        id: "participant-1",
        type: "character",
        entityId: "char-1",
        name: "Test Runner",
        status: "active",
        initiativeScore: 10,
        initiativeDice: [],
        actionsRemaining: {
          free: 1,
          simple: 2,
          complex: 1,
          interrupt: true,
        },
        conditions: [],
        interruptsPending: [],
        notes: "",
        controlledBy: "user-1",
        isGMControlled: false,
        woundModifier: 0,
      } as CombatParticipant,
    ],
    environment: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as CombatSession;
}

function createMockActionResult(overrides: Partial<ActionResult> = {}): ActionResult {
  return {
    id: "result-1",
    characterId: "char-1",
    userId: "user-1",
    pool: {
      basePool: 6,
      totalDice: 6,
      modifiers: [],
      limit: 6,
      limitSource: "physical",
    } as ActionPool,
    dice: makeDice([1, 2, 3, 4, 5, 6]),
    hits: 2,
    rawHits: 2,
    ones: 1,
    isGlitch: false,
    isCriticalGlitch: false,
    edgeSpent: 0,
    rerollCount: 0,
    timestamp: new Date().toISOString(),
    context: {
      actionType: "combat",
      description: "Fire Weapon",
    },
    ...overrides,
  } as ActionResult;
}

// =============================================================================
// CONSUME ACTION TESTS
// =============================================================================

describe("consumeAction", () => {
  describe("free actions", () => {
    it("should decrement free action count", () => {
      const current: ActionAllocation = {
        free: 3,
        simple: 2,
        complex: 1,
        interrupt: true,
      };

      const result = consumeAction(current, "free");

      expect(result.free).toBe(2);
      expect(result.simple).toBe(2);
      expect(result.complex).toBe(1);
    });

    it("should not go below zero for free actions", () => {
      const current: ActionAllocation = {
        free: 0,
        simple: 2,
        complex: 1,
        interrupt: true,
      };

      const result = consumeAction(current, "free");

      expect(result.free).toBe(0);
    });
  });

  describe("simple actions", () => {
    it("should decrement simple action count", () => {
      const current: ActionAllocation = {
        free: 1,
        simple: 2,
        complex: 1,
        interrupt: true,
      };

      const result = consumeAction(current, "simple");

      expect(result.simple).toBe(1);
      expect(result.complex).toBe(1);
    });

    it("should not go below zero for simple actions", () => {
      const current: ActionAllocation = {
        free: 1,
        simple: 0,
        complex: 1,
        interrupt: true,
      };

      const result = consumeAction(current, "simple");

      expect(result.simple).toBe(0);
    });
  });

  describe("complex actions", () => {
    it("should consume complex and both simple actions", () => {
      const current: ActionAllocation = {
        free: 1,
        simple: 2,
        complex: 1,
        interrupt: true,
      };

      const result = consumeAction(current, "complex");

      expect(result.complex).toBe(0);
      expect(result.simple).toBe(0);
    });

    it("should consume two simple actions if no complex remaining", () => {
      const current: ActionAllocation = {
        free: 1,
        simple: 2,
        complex: 0,
        interrupt: true,
      };

      const result = consumeAction(current, "complex");

      expect(result.simple).toBe(0);
      expect(result.complex).toBe(0);
    });

    it("should not change if neither complex nor two simple available", () => {
      const current: ActionAllocation = {
        free: 1,
        simple: 1,
        complex: 0,
        interrupt: true,
      };

      const result = consumeAction(current, "complex");

      expect(result.simple).toBe(1);
      expect(result.complex).toBe(0);
    });
  });

  describe("interrupt actions", () => {
    it("should set interrupt to false", () => {
      const current: ActionAllocation = {
        free: 1,
        simple: 2,
        complex: 1,
        interrupt: true,
      };

      const result = consumeAction(current, "interrupt");

      expect(result.interrupt).toBe(false);
    });
  });
});

// =============================================================================
// EXECUTE ACTION TESTS
// =============================================================================

describe("executeAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should execute a valid action successfully", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
    };

    const result = await executeAction(request);

    expect(result.success).toBe(true);
    expect(result.actionResult).toBeDefined();
    expect(result.actionResult?.hits).toBe(2);
    expect(actionHistoryStorage.saveActionResult).toHaveBeenCalled();
  });

  it("should fail if combat session not found", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    vi.mocked(combatStorage.getCombatSession).mockResolvedValueOnce(null);

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      combatSessionId: "nonexistent-session",
    };

    const result = await executeAction(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Combat session not found");
  });

  it("should fail if validation fails", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    vi.mocked(validateAction).mockReturnValueOnce({
      valid: false,
      errors: [
        {
          code: "PREREQUISITE_NOT_MET",
          message: "Missing required skill",
          field: "skill",
        },
      ],
      warnings: [],
    });

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
    };

    const result = await executeAction(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Missing required skill");
  });

  it("should add additional modifiers to the pool", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      additionalModifiers: [
        { source: "situational", value: 2, description: "High ground advantage" },
      ],
    };

    const result = await executeAction(request);

    expect(result.success).toBe(true);
    expect(result.actionResult?.pool.modifiers).toContainEqual(
      expect.objectContaining({ source: "situational", value: 2 })
    );
  });

  it("should handle Push the Limit edge action", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      edgeAction: "push_the_limit",
    };

    const result = await executeAction(request);

    expect(result.success).toBe(true);
    expect(result.actionResult?.edgeSpent).toBe(1);
    expect(result.actionResult?.edgeAction).toBe("push_the_limit");
    expect(executeRoll).toHaveBeenCalledWith(
      expect.any(Number),
      expect.anything(),
      expect.objectContaining({ explodingSixes: true })
    );
  });

  it("should fail Push the Limit if no edge available", async () => {
    const character = createMockCharacter({
      attributes: {
        body: 4,
        agility: 5,
        reaction: 4,
        strength: 3,
        charisma: 3,
        intuition: 4,
        logic: 3,
        willpower: 4,
        edge: 0,
        magic: 0,
        resonance: 0,
        essence: 6,
      },
    });
    const action = createMockAction();

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      edgeAction: "push_the_limit",
    };

    const result = await executeAction(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Insufficient Edge for Push the Limit");
  });

  it("should update combat session when in combat", async () => {
    const character = createMockCharacter();
    const action = createMockAction();
    const combatSession = createMockCombatSession();

    vi.mocked(combatStorage.getCombatSession).mockResolvedValueOnce(combatSession);

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      combatSessionId: combatSession.id,
      participantId: "participant-1",
    };

    const result = await executeAction(request);

    expect(result.success).toBe(true);
    expect(combatStorage.updateParticipantActions).toHaveBeenCalledWith(
      combatSession.id,
      "participant-1",
      expect.any(Object)
    );
    expect(result.stateChanges.length).toBeGreaterThan(0);
  });

  it("should track effect state changes when action has hits", async () => {
    const character = createMockCharacter();
    const action = createMockAction({
      effects: [
        {
          type: "damage",
          targetType: "target",
          calculation: { formula: "hits + 2" },
          description: "Weapon damage",
        },
      ],
    });

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      targetId: "target-1",
    };

    const result = await executeAction(request);

    expect(result.success).toBe(true);
    expect(result.stateChanges).toContainEqual(
      expect.objectContaining({
        entityId: "target-1",
        field: "damage",
      })
    );
  });
});

// =============================================================================
// EXECUTE ACTION REROLL TESTS
// =============================================================================

describe("executeActionReroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail if original action not found", async () => {
    vi.mocked(actionHistoryStorage.getAction).mockResolvedValueOnce(null);

    const request: RerollRequest = {
      characterId: "char-1",
      userId: "user-1",
      actionId: "nonexistent-action",
      edgeAction: "second_chance",
    };

    const result = await executeActionReroll(request);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Original action not found");
  });

  it("should fail with invalid edge action for reroll", async () => {
    const originalAction = createMockActionResult();
    vi.mocked(actionHistoryStorage.getAction).mockResolvedValueOnce(originalAction);

    const request: RerollRequest = {
      characterId: "char-1",
      userId: "user-1",
      actionId: originalAction.id,
      edgeAction: "push_the_limit" as "second_chance",
    };

    const result = await executeActionReroll(request);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid Edge action for reroll");
  });

  describe("Second Chance", () => {
    it("should reroll non-hits and update action", async () => {
      const originalAction = createMockActionResult();
      vi.mocked(actionHistoryStorage.getAction).mockResolvedValueOnce(originalAction);
      vi.mocked(actionHistoryStorage.updateActionResult).mockResolvedValueOnce({
        ...originalAction,
        hits: 4,
        rawHits: 4,
        dice: makeDice([3, 4, 5, 6, 5, 6]),
        edgeSpent: 1,
        edgeAction: "second_chance",
        rerollCount: 1,
      });

      const request: RerollRequest = {
        characterId: "char-1",
        userId: "user-1",
        actionId: originalAction.id,
        edgeAction: "second_chance",
      };

      const result = await executeActionReroll(request);

      expect(result.success).toBe(true);
      expect(result.actionResult?.hits).toBe(4);
      expect(result.actionResult?.rerollCount).toBe(1);
      expect(executeReroll).toHaveBeenCalledWith(
        originalAction.dice,
        expect.anything(),
        originalAction.pool.limit
      );
    });

    it("should track state changes for second chance", async () => {
      const originalAction = createMockActionResult({ hits: 2 });
      vi.mocked(actionHistoryStorage.getAction).mockResolvedValueOnce(originalAction);
      vi.mocked(actionHistoryStorage.updateActionResult).mockResolvedValueOnce({
        ...originalAction,
        hits: 4,
        edgeSpent: 1,
        edgeAction: "second_chance",
        rerollCount: 1,
      });

      const request: RerollRequest = {
        characterId: "char-1",
        userId: "user-1",
        actionId: originalAction.id,
        edgeAction: "second_chance",
      };

      const result = await executeActionReroll(request);

      expect(result.stateChanges).toContainEqual(
        expect.objectContaining({
          field: "edge",
          description: expect.stringContaining("Second Chance"),
        })
      );
      expect(result.stateChanges).toContainEqual(
        expect.objectContaining({
          field: "actionResult.hits",
          previousValue: 2,
          newValue: 4,
        })
      );
    });
  });

  describe("Close Call", () => {
    it("should fail if action is not a glitch", async () => {
      const originalAction = createMockActionResult({
        isGlitch: false,
        isCriticalGlitch: false,
      });
      vi.mocked(actionHistoryStorage.getAction).mockResolvedValueOnce(originalAction);

      const request: RerollRequest = {
        characterId: "char-1",
        userId: "user-1",
        actionId: originalAction.id,
        edgeAction: "close_call",
      };

      const result = await executeActionReroll(request);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Close Call can only be used on a glitch");
    });

    it("should negate glitch without rerolling", async () => {
      const originalAction = createMockActionResult({
        isGlitch: true,
        isCriticalGlitch: false,
        hits: 1,
      });
      vi.mocked(actionHistoryStorage.getAction).mockResolvedValueOnce(originalAction);
      vi.mocked(actionHistoryStorage.updateActionResult).mockResolvedValueOnce({
        ...originalAction,
        isGlitch: false,
        isCriticalGlitch: false,
        edgeSpent: 1,
        edgeAction: "close_call",
      });

      const request: RerollRequest = {
        characterId: "char-1",
        userId: "user-1",
        actionId: originalAction.id,
        edgeAction: "close_call",
      };

      const result = await executeActionReroll(request);

      expect(result.success).toBe(true);
      expect(result.actionResult?.isGlitch).toBe(false);
      expect(executeReroll).not.toHaveBeenCalled();
    });

    it("should negate critical glitch", async () => {
      const originalAction = createMockActionResult({
        isGlitch: true,
        isCriticalGlitch: true,
        hits: 0,
      });
      vi.mocked(actionHistoryStorage.getAction).mockResolvedValueOnce(originalAction);
      vi.mocked(actionHistoryStorage.updateActionResult).mockResolvedValueOnce({
        ...originalAction,
        isGlitch: false,
        isCriticalGlitch: false,
        edgeSpent: 1,
        edgeAction: "close_call",
      });

      const request: RerollRequest = {
        characterId: "char-1",
        userId: "user-1",
        actionId: originalAction.id,
        edgeAction: "close_call",
      };

      const result = await executeActionReroll(request);

      expect(result.success).toBe(true);
      expect(result.actionResult?.isCriticalGlitch).toBe(false);
    });
  });
});

// =============================================================================
// COMBAT ACTION TESTS
// =============================================================================

describe("executeCombatAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail without combat session ID", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      participantId: "participant-1",
    };

    const result = await executeCombatAction(request);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Combat session and participant ID required");
  });

  it("should fail without participant ID", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      combatSessionId: "combat-1",
    };

    const result = await executeCombatAction(request);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Combat session and participant ID required");
  });

  it("should delegate to executeAction with combat context", async () => {
    const character = createMockCharacter();
    const action = createMockAction();
    const combatSession = createMockCombatSession();

    vi.mocked(combatStorage.getCombatSession).mockResolvedValueOnce(combatSession);

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      combatSessionId: combatSession.id,
      participantId: "participant-1",
    };

    const result = await executeCombatAction(request);

    expect(result.success).toBe(true);
    expect(combatStorage.getCombatSession).toHaveBeenCalledWith(combatSession.id);
  });
});

// =============================================================================
// GENERAL ACTION TESTS
// =============================================================================

describe("executeGeneralAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should execute without combat context", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    const request: ExecutionRequest = {
      characterId: character.id,
      userId: character.ownerId,
      action,
      character,
      combatSessionId: "should-be-removed",
      participantId: "should-be-removed",
    };

    const result = await executeGeneralAction(request);

    expect(result.success).toBe(true);
    expect(combatStorage.getCombatSession).not.toHaveBeenCalled();
  });
});

// =============================================================================
// OPPOSED TEST TESTS
// =============================================================================

describe("executeOpposedTest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return defender win if attacker fails", async () => {
    const attacker = createMockCharacter({ id: "attacker-1" });
    const defender = createMockCharacter({ id: "defender-1" });
    const action = createMockAction();

    vi.mocked(validateAction).mockReturnValueOnce({
      valid: false,
      errors: [{ code: "VALIDATION_FAILED", message: "Attacker failed" }],
      warnings: [],
    });

    const result = await executeOpposedTest(
      { characterId: attacker.id, userId: attacker.ownerId, action, character: attacker },
      { characterId: defender.id, userId: defender.ownerId, action, character: defender }
    );

    expect(result.winner).toBe("defender");
    expect(result.attackerResult.success).toBe(false);
  });

  it("should return attacker win if defender fails", async () => {
    const attacker = createMockCharacter({ id: "attacker-1" });
    const defender = createMockCharacter({ id: "defender-1" });
    const action = createMockAction();

    // First call for attacker succeeds
    vi.mocked(validateAction)
      .mockReturnValueOnce({
        valid: true,
        errors: [],
        warnings: [],
        modifiedPool: {
          basePool: 6,
          totalDice: 6,
          modifiers: [],
          limit: 6,
          limitSource: "physical",
        },
      })
      // Second call for defender fails
      .mockReturnValueOnce({
        valid: false,
        errors: [{ code: "VALIDATION_FAILED", message: "Defender failed" }],
        warnings: [],
      });

    const result = await executeOpposedTest(
      { characterId: attacker.id, userId: attacker.ownerId, action, character: attacker },
      { characterId: defender.id, userId: defender.ownerId, action, character: defender }
    );

    expect(result.winner).toBe("attacker");
    expect(result.netHits).toBe(2); // Attacker's hits
  });

  it("should calculate net hits correctly", async () => {
    const attacker = createMockCharacter({ id: "attacker-1" });
    const defender = createMockCharacter({ id: "defender-1" });
    const action = createMockAction();

    // Attacker gets 4 hits, defender gets 2 hits
    vi.mocked(executeRoll)
      .mockReturnValueOnce({
        dice: makeDice([5, 5, 5, 5, 3, 2]),
        hits: 4,
        rawHits: 4,
        ones: 0,
        isGlitch: false,
        isCriticalGlitch: false,
        limitApplied: false,
        poolSize: 6,
      })
      .mockReturnValueOnce({
        dice: makeDice([5, 5, 3, 3, 2, 2]),
        hits: 2,
        rawHits: 2,
        ones: 0,
        isGlitch: false,
        isCriticalGlitch: false,
        limitApplied: false,
        poolSize: 6,
      });

    const result = await executeOpposedTest(
      { characterId: attacker.id, userId: attacker.ownerId, action, character: attacker },
      { characterId: defender.id, userId: defender.ownerId, action, character: defender }
    );

    expect(result.winner).toBe("attacker");
    expect(result.netHits).toBe(2); // 4 - 2 = 2
  });

  it("should handle tie correctly", async () => {
    const attacker = createMockCharacter({ id: "attacker-1" });
    const defender = createMockCharacter({ id: "defender-1" });
    const action = createMockAction();

    // Both get same hits
    vi.mocked(executeRoll).mockReturnValue({
      dice: makeDice([5, 5, 3, 3, 2, 2]),
      hits: 2,
      rawHits: 2,
      ones: 0,
      isGlitch: false,
      isCriticalGlitch: false,
      limitApplied: false,
      poolSize: 6,
    });

    const result = await executeOpposedTest(
      { characterId: attacker.id, userId: attacker.ownerId, action, character: attacker },
      { characterId: defender.id, userId: defender.ownerId, action, character: defender }
    );

    expect(result.winner).toBe("tie");
    expect(result.netHits).toBe(0);
  });

  it("should record opposed test in combat session", async () => {
    const attacker = createMockCharacter({ id: "attacker-1" });
    const defender = createMockCharacter({ id: "defender-1" });
    const action = createMockAction();
    const combatSessionId = "combat-1";

    await executeOpposedTest(
      {
        characterId: attacker.id,
        userId: attacker.ownerId,
        action,
        character: attacker,
        participantId: "participant-1",
      },
      {
        characterId: defender.id,
        userId: defender.ownerId,
        action,
        character: defender,
        participantId: "participant-2",
      },
      combatSessionId
    );

    expect(combatStorage.createOpposedTest).toHaveBeenCalledWith(
      expect.objectContaining({
        combatSessionId,
        attackerId: "participant-1",
        defenderId: "participant-2",
        mode: "synchronous",
        state: "resolved",
      })
    );
  });
});

// =============================================================================
// STATE CHANGE TESTS
// =============================================================================

describe("applyStateChanges", () => {
  it("should group changes by entity", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const changes: StateChange[] = [
      {
        entityId: "char-1",
        entityType: "character",
        field: "edge",
        previousValue: 3,
        newValue: 2,
        description: "Spent Edge",
      },
      {
        entityId: "char-1",
        entityType: "character",
        field: "karma",
        previousValue: 10,
        newValue: 8,
        description: "Spent karma",
      },
      {
        entityId: "char-2",
        entityType: "character",
        field: "edge",
        previousValue: 2,
        newValue: 1,
        description: "Spent Edge",
      },
    ];

    await applyStateChanges(changes);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("2 changes to character char-1")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("1 changes to character char-2")
    );

    consoleSpy.mockRestore();
  });
});

describe("rollbackStateChanges", () => {
  it("should reverse changes and swap values", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const changes: StateChange[] = [
      {
        entityId: "char-1",
        entityType: "character",
        field: "edge",
        previousValue: 3,
        newValue: 2,
        description: "Spent Edge",
      },
      {
        entityId: "char-1",
        entityType: "character",
        field: "karma",
        previousValue: 10,
        newValue: 8,
        description: "Spent karma",
      },
    ];

    await rollbackStateChanges(changes);

    // Should be called with rollback prefix
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("2 changes to character char-1")
    );

    consoleSpy.mockRestore();
  });
});

// =============================================================================
// CAN EXECUTE ACTION TESTS
// =============================================================================

describe("canExecuteAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return true for valid action", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    const result = await canExecuteAction({
      characterId: character.id,
      action,
      character,
    });

    expect(result.canExecute).toBe(true);
    expect(result.validation.valid).toBe(true);
  });

  it("should return false for invalid action", async () => {
    const character = createMockCharacter();
    const action = createMockAction();

    vi.mocked(validateAction).mockReturnValueOnce({
      valid: false,
      errors: [{ code: "PREREQUISITE_NOT_MET", message: "Missing skill" }],
      warnings: [],
    });

    const result = await canExecuteAction({
      characterId: character.id,
      action,
      character,
    });

    expect(result.canExecute).toBe(false);
    expect(result.validation.errors[0].message).toBe("Missing skill");
  });

  it("should fetch combat session if provided", async () => {
    const character = createMockCharacter();
    const action = createMockAction();
    const combatSession = createMockCombatSession();

    vi.mocked(combatStorage.getCombatSession).mockResolvedValueOnce(combatSession);

    await canExecuteAction({
      characterId: character.id,
      action,
      character,
      combatSessionId: combatSession.id,
    });

    expect(combatStorage.getCombatSession).toHaveBeenCalledWith(combatSession.id);
  });
});

// =============================================================================
// GET AVAILABLE ACTIONS TESTS
// =============================================================================

describe("getAvailableActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should categorize actions into eligible and ineligible", async () => {
    const character = createMockCharacter();
    const actions = [
      createMockAction({ id: "action-1", name: "Action 1" }),
      createMockAction({ id: "action-2", name: "Action 2" }),
      createMockAction({ id: "action-3", name: "Action 3" }),
    ];

    // First action valid, second invalid, third valid
    vi.mocked(validateAction)
      .mockReturnValueOnce({ valid: true, errors: [], warnings: [] })
      .mockReturnValueOnce({
        valid: false,
        errors: [{ code: "PREREQUISITE_NOT_MET", message: "Missing skill for Action 2" }],
        warnings: [],
      })
      .mockReturnValueOnce({ valid: true, errors: [], warnings: [] });

    const result = await getAvailableActions(character, actions);

    expect(result.eligible).toHaveLength(2);
    expect(result.eligible.map((a) => a.id)).toContain("action-1");
    expect(result.eligible.map((a) => a.id)).toContain("action-3");

    expect(result.ineligible).toHaveLength(1);
    expect(result.ineligible[0].action.id).toBe("action-2");
    expect(result.ineligible[0].reasons).toContain("Missing skill for Action 2");
  });

  it("should handle empty action catalog", async () => {
    const character = createMockCharacter();

    const result = await getAvailableActions(character, []);

    expect(result.eligible).toHaveLength(0);
    expect(result.ineligible).toHaveLength(0);
  });

  it("should include combat session context in validation", async () => {
    const character = createMockCharacter();
    const action = createMockAction();
    const combatSession = createMockCombatSession();

    vi.mocked(combatStorage.getCombatSession).mockResolvedValueOnce(combatSession);

    await getAvailableActions(character, [action], combatSession.id, "participant-1");

    expect(combatStorage.getCombatSession).toHaveBeenCalledWith(combatSession.id);
    expect(validateAction).toHaveBeenCalledWith(character, action, combatSession, "participant-1");
  });
});
