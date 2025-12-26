/**
 * Unit tests for combat.ts storage module
 *
 * Tests combat session CRUD, participant management, initiative,
 * turn management, interrupts, and opposed tests.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type {
  CombatSession,
  CombatParticipant,
  ActionAllocation,
  ActiveCondition,
  PendingInterrupt,
  OpposedTest,
  EnvironmentConditions,
} from "@/lib/types";

// Mock the base storage module
vi.mock("../base", () => {
  const storage = new Map<string, unknown>();
  return {
    ensureDirectory: vi.fn().mockResolvedValue(undefined),
    readJsonFile: vi.fn().mockImplementation((path: string) => {
      return Promise.resolve(storage.get(path) || null);
    }),
    writeJsonFile: vi.fn().mockImplementation((path: string, data: unknown) => {
      storage.set(path, data);
      return Promise.resolve();
    }),
    deleteFile: vi.fn().mockImplementation((path: string) => {
      storage.delete(path);
      return Promise.resolve();
    }),
    listJsonFiles: vi.fn().mockResolvedValue([]),
    __storage: storage,
    __clearStorage: () => storage.clear(),
  };
});

// Import after mocking
import * as combatStorage from "../combat";
import * as base from "../base";

// Type assertion for mock access
const mockBase = base as typeof base & {
  __storage: Map<string, unknown>;
  __clearStorage: () => void;
};

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockSession(overrides: Partial<CombatSession> = {}): Omit<CombatSession, "id" | "createdAt" | "updatedAt"> {
  return {
    campaignId: "campaign-1",
    ownerId: "user-1",
    name: "Test Combat",
    status: "active",
    phase: "initiative",
    round: 1,
    currentTurn: 0,
    currentPhase: "initiative",
    initiativeOrder: [],
    participants: [],
    environment: {},
    ...overrides,
  } as Omit<CombatSession, "id" | "createdAt" | "updatedAt">;
}

function createMockParticipant(overrides: Partial<CombatParticipant> = {}): Omit<CombatParticipant, "id"> {
  return {
    type: "character",
    entityId: "char-1",
    name: "Test Runner",
    status: "active",
    actionsRemaining: {
      free: 999,
      simple: 2,
      complex: 1,
      interrupt: true,
    },
    initiativeScore: 0,
    initiativeDice: [],
    conditions: [],
    interruptsPending: [],
    notes: "",
    controlledBy: "user-1",
    isGMControlled: false,
    woundModifier: 0,
    ...overrides,
  } as Omit<CombatParticipant, "id">;
}

// =============================================================================
// SETUP
// =============================================================================

beforeEach(() => {
  vi.clearAllMocks();
  mockBase.__clearStorage();
});

afterEach(() => {
  mockBase.__clearStorage();
});

// =============================================================================
// CREATE OPERATIONS
// =============================================================================

describe("createCombatSession", () => {
  it("should create a new combat session with generated id", async () => {
    const sessionData = createMockSession();

    const session = await combatStorage.createCombatSession(sessionData);

    expect(session.id).toBeDefined();
    expect(session.name).toBe("Test Combat");
    expect(session.status).toBe("active");
    expect(session.createdAt).toBeDefined();
    expect(session.updatedAt).toBeDefined();
  });

  it("should write session to storage", async () => {
    const sessionData = createMockSession();

    await combatStorage.createCombatSession(sessionData);

    expect(base.writeJsonFile).toHaveBeenCalled();
    expect(base.ensureDirectory).toHaveBeenCalled();
  });

  it("should index session by owner", async () => {
    const sessionData = createMockSession({ ownerId: "user-123" });

    const session = await combatStorage.createCombatSession(sessionData);

    // The index should be updated - verify by checking writeJsonFile calls
    const writeFileCalls = vi.mocked(base.writeJsonFile).mock.calls;
    const indexWrite = writeFileCalls.find((call) => call[0].includes("_index.json"));
    expect(indexWrite).toBeDefined();
    const indexData = indexWrite?.[1] as { byOwner: Record<string, string[]> };
    expect(indexData.byOwner["user-123"]).toContain(session.id);
  });

  it("should index session by campaign when provided", async () => {
    const sessionData = createMockSession({ campaignId: "campaign-456" });

    const session = await combatStorage.createCombatSession(sessionData);

    const writeFileCalls = vi.mocked(base.writeJsonFile).mock.calls;
    const indexWrite = writeFileCalls.find((call) => call[0].includes("_index.json"));
    const indexData = indexWrite?.[1] as { byCampaign: Record<string, string[]> };
    expect(indexData.byCampaign["campaign-456"]).toContain(session.id);
  });
});

// =============================================================================
// READ OPERATIONS
// =============================================================================

describe("getCombatSession", () => {
  it("should return session by ID", async () => {
    const sessionData = createMockSession();
    const created = await combatStorage.createCombatSession(sessionData);

    const retrieved = await combatStorage.getCombatSession(created.id);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.name).toBe("Test Combat");
  });

  it("should return null for non-existent session", async () => {
    const result = await combatStorage.getCombatSession("non-existent-id");
    expect(result).toBeNull();
  });
});

describe("listCombatSessions", () => {
  beforeEach(async () => {
    // Create some test sessions
    await combatStorage.createCombatSession(
      createMockSession({ ownerId: "user-1", campaignId: "campaign-1" })
    );
    await combatStorage.createCombatSession(
      createMockSession({ ownerId: "user-1", campaignId: "campaign-2" })
    );
    await combatStorage.createCombatSession(
      createMockSession({ ownerId: "user-2", campaignId: "campaign-1" })
    );
  });

  it("should list all active sessions by default", async () => {
    const sessions = await combatStorage.listCombatSessions();
    expect(sessions).toBeDefined();
  });

  it("should filter by owner ID", async () => {
    const sessions = await combatStorage.listCombatSessions({ ownerId: "user-1" });
    expect(sessions.every((s) => s.ownerId === "user-1")).toBe(true);
  });

  it("should filter by campaign ID", async () => {
    const sessions = await combatStorage.listCombatSessions({ campaignId: "campaign-1" });
    expect(sessions.every((s) => s.campaignId === "campaign-1")).toBe(true);
  });

  it("should respect limit parameter", async () => {
    const sessions = await combatStorage.listCombatSessions({ limit: 2 });
    expect(sessions.length).toBeLessThanOrEqual(2);
  });
});

describe("getActiveSessionsForUser", () => {
  it("should return only active sessions for user", async () => {
    await combatStorage.createCombatSession(
      createMockSession({ ownerId: "user-active", status: "active" })
    );
    await combatStorage.createCombatSession(
      createMockSession({ ownerId: "user-active", status: "paused" })
    );

    const sessions = await combatStorage.getActiveSessionsForUser("user-active");
    expect(sessions.every((s) => s.status === "active")).toBe(true);
  });
});

describe("getActiveSessionsForCampaign", () => {
  it("should return only active sessions for campaign", async () => {
    await combatStorage.createCombatSession(
      createMockSession({ campaignId: "camp-test", status: "active" })
    );

    const sessions = await combatStorage.getActiveSessionsForCampaign("camp-test");
    expect(sessions.every((s) => s.campaignId === "camp-test")).toBe(true);
  });
});

// =============================================================================
// UPDATE OPERATIONS
// =============================================================================

describe("updateCombatSession", () => {
  it("should update session properties", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());

    const updated = await combatStorage.updateCombatSession(session.id, {
      name: "Updated Combat Name",
    });

    expect(updated?.name).toBe("Updated Combat Name");
    expect(updated?.updatedAt).toBeDefined();
  });

  it("should return null for non-existent session", async () => {
    const result = await combatStorage.updateCombatSession("fake-id", { name: "Test" });
    expect(result).toBeNull();
  });

  it("should move session to completed when status changes to completed", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());

    const updated = await combatStorage.updateCombatSession(session.id, {
      status: "completed",
    });

    expect(updated?.status).toBe("completed");
    expect(updated?.endedAt).toBeDefined();
  });

  it("should move session to completed when status changes to abandoned", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());

    const updated = await combatStorage.updateCombatSession(session.id, {
      status: "abandoned",
    });

    expect(updated?.status).toBe("abandoned");
    expect(updated?.endedAt).toBeDefined();
  });
});

describe("updateEnvironment", () => {
  it("should update environment conditions", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const newEnvironment: EnvironmentConditions = {
      visibility: "dim",
      weather: "rain",
      terrain: "urban",
    };

    const updated = await combatStorage.updateEnvironment(session.id, newEnvironment);

    expect(updated?.environment).toEqual(newEnvironment);
  });
});

// =============================================================================
// PARTICIPANT MANAGEMENT
// =============================================================================

describe("addParticipant", () => {
  it("should add a participant with generated id", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const participantData = createMockParticipant();

    const updated = await combatStorage.addParticipant(session.id, participantData);

    expect(updated?.participants.length).toBe(1);
    expect(updated?.participants[0].id).toBeDefined();
    expect(updated?.participants[0].name).toBe("Test Runner");
  });

  it("should return null for non-existent session", async () => {
    const result = await combatStorage.addParticipant("fake-id", createMockParticipant());
    expect(result).toBeNull();
  });
});

describe("removeParticipant", () => {
  it("should remove a participant from session", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const withParticipant = await combatStorage.addParticipant(session.id, createMockParticipant());
    const participantId = withParticipant!.participants[0].id;

    const updated = await combatStorage.removeParticipant(session.id, participantId);

    expect(updated?.participants.length).toBe(0);
  });

  it("should remove participant from initiative order", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({ initiativeOrder: ["p1", "p2"] })
    );

    const updated = await combatStorage.removeParticipant(session.id, "p1");

    expect(updated?.initiativeOrder).not.toContain("p1");
  });
});

describe("updateParticipant", () => {
  it("should update participant properties", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const withParticipant = await combatStorage.addParticipant(session.id, createMockParticipant());
    const participantId = withParticipant!.participants[0].id;

    const updated = await combatStorage.updateParticipant(session.id, participantId, {
      name: "Updated Runner Name",
      status: "delayed",
    });

    expect(updated?.name).toBe("Updated Runner Name");
    expect(updated?.status).toBe("delayed");
  });

  it("should return null for non-existent participant", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());

    const result = await combatStorage.updateParticipant(session.id, "fake-participant", {
      name: "Test",
    });

    expect(result).toBeNull();
  });
});

describe("updateParticipantActions", () => {
  it("should update action allocation", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const withParticipant = await combatStorage.addParticipant(session.id, createMockParticipant());
    const participantId = withParticipant!.participants[0].id;

    const newActions: ActionAllocation = {
      free: 2,
      simple: 1,
      complex: 0,
      interrupt: false,
    };

    const updated = await combatStorage.updateParticipantActions(session.id, participantId, newActions);

    expect(updated?.actionsRemaining).toEqual(newActions);
  });
});

describe("addCondition", () => {
  it("should add a condition to participant", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const withParticipant = await combatStorage.addParticipant(session.id, createMockParticipant());
    const participantId = withParticipant!.participants[0].id;

    const condition: ActiveCondition = {
      id: "cond-1",
      name: "Stunned",
      description: "Cannot take actions",
      roundsRemaining: 2,
      source: "attack",
    };

    const updated = await combatStorage.addCondition(session.id, participantId, condition);

    expect(updated?.conditions.length).toBe(1);
    expect(updated?.conditions[0].name).toBe("Stunned");
  });
});

describe("removeCondition", () => {
  it("should remove a condition from participant", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const participant = createMockParticipant({
      conditions: [
        { id: "cond-1", name: "Stunned", description: "Cannot take actions", source: "attack" },
      ],
    });
    const withParticipant = await combatStorage.addParticipant(session.id, participant);
    const participantId = withParticipant!.participants[0].id;

    const updated = await combatStorage.removeCondition(session.id, participantId, "cond-1");

    expect(updated?.conditions.length).toBe(0);
  });
});

// =============================================================================
// INITIATIVE MANAGEMENT
// =============================================================================

describe("setInitiativeScore", () => {
  it("should set initiative score for participant", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const withParticipant = await combatStorage.addParticipant(session.id, createMockParticipant());
    const participantId = withParticipant!.participants[0].id;

    const updated = await combatStorage.setInitiativeScore(session.id, participantId, 15, [5, 4, 3, 3]);

    const participant = updated?.participants.find((p) => p.id === participantId);
    expect(participant?.initiativeScore).toBe(15);
    expect(participant?.initiativeDice).toEqual([5, 4, 3, 3]);
  });

  it("should update initiative order based on scores", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());

    // Add two participants
    let updated = await combatStorage.addParticipant(
      session.id,
      createMockParticipant({ name: "Slow Runner" })
    );
    const slowId = updated!.participants[0].id;

    updated = await combatStorage.addParticipant(
      updated!.id,
      createMockParticipant({ name: "Fast Runner" })
    );
    const fastId = updated!.participants[1].id;

    // Set initiative scores
    await combatStorage.setInitiativeScore(session.id, slowId, 10);
    updated = await combatStorage.setInitiativeScore(session.id, fastId, 20);

    // Fast should be first in initiative order
    expect(updated?.initiativeOrder[0]).toBe(fastId);
    expect(updated?.initiativeOrder[1]).toBe(slowId);
  });
});

describe("updateInitiativeOrder", () => {
  it("should update initiative order manually", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const newOrder = ["p3", "p1", "p2"];

    const updated = await combatStorage.updateInitiativeOrder(session.id, newOrder);

    expect(updated?.initiativeOrder).toEqual(newOrder);
  });
});

// =============================================================================
// TURN MANAGEMENT
// =============================================================================

describe("advanceTurn", () => {
  it("should advance to next participant", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({
        currentTurn: 0,
        initiativeOrder: ["p1", "p2", "p3"],
        participants: [
          { ...createMockParticipant(), id: "p1", status: "active" },
          { ...createMockParticipant(), id: "p2", status: "active" },
          { ...createMockParticipant(), id: "p3", status: "active" },
        ] as CombatParticipant[],
      })
    );

    const updated = await combatStorage.advanceTurn(session.id);

    expect(updated?.currentTurn).toBe(1);
  });

  it("should advance round when wrapping around", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({
        currentTurn: 2,
        round: 1,
        initiativeOrder: ["p1", "p2", "p3"],
        participants: [
          { ...createMockParticipant(), id: "p1", status: "active" },
          { ...createMockParticipant(), id: "p2", status: "active" },
          { ...createMockParticipant(), id: "p3", status: "active" },
        ] as CombatParticipant[],
      })
    );

    const updated = await combatStorage.advanceTurn(session.id);

    expect(updated?.currentTurn).toBe(0);
    expect(updated?.round).toBe(2);
  });

  it("should reset action allocations at round start", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({
        currentTurn: 2,
        round: 1,
        initiativeOrder: ["p1", "p2", "p3"],
        participants: [
          {
            ...createMockParticipant(),
            id: "p1",
            status: "active",
            actionsRemaining: { free: 0, simple: 0, complex: 0, interrupt: false },
          },
          { ...createMockParticipant(), id: "p2", status: "active" },
          { ...createMockParticipant(), id: "p3", status: "active" },
        ] as CombatParticipant[],
      })
    );

    const updated = await combatStorage.advanceTurn(session.id);

    const p1 = updated?.participants.find((p) => p.id === "p1");
    expect(p1?.actionsRemaining.simple).toBe(2);
    expect(p1?.actionsRemaining.complex).toBe(1);
  });
});

describe("advanceRound", () => {
  it("should increment round counter", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({ round: 1 })
    );

    const updated = await combatStorage.advanceRound(session.id);

    expect(updated?.round).toBe(2);
  });

  it("should reset turn to 0", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({ currentTurn: 3 })
    );

    const updated = await combatStorage.advanceRound(session.id);

    expect(updated?.currentTurn).toBe(0);
  });

  it("should set phase to initiative", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({ currentPhase: "action" })
    );

    const updated = await combatStorage.advanceRound(session.id);

    expect(updated?.currentPhase).toBe("initiative");
  });

  it("should decrement condition durations and remove expired", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({
        participants: [
          {
            ...createMockParticipant(),
            id: "p1",
            status: "active",
            conditions: [
              { id: "c1", name: "Stun", description: "Stunned", roundsRemaining: 1, source: "test" },
              { id: "c2", name: "Blind", description: "Blinded", roundsRemaining: 3, source: "test" },
            ],
          },
        ] as CombatParticipant[],
      })
    );

    const updated = await combatStorage.advanceRound(session.id);

    const p1 = updated?.participants.find((p) => p.id === "p1");
    // c1 should be removed (was 1, decremented to 0)
    // c2 should remain (was 3, decremented to 2)
    expect(p1?.conditions.length).toBe(1);
    expect(p1?.conditions[0].id).toBe("c2");
    expect(p1?.conditions[0].roundsRemaining).toBe(2);
  });
});

describe("getCurrentParticipant", () => {
  it("should return current participant", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({
        currentTurn: 1,
        initiativeOrder: ["p1", "p2", "p3"],
        participants: [
          { ...createMockParticipant(), id: "p1", name: "First" },
          { ...createMockParticipant(), id: "p2", name: "Second" },
          { ...createMockParticipant(), id: "p3", name: "Third" },
        ] as CombatParticipant[],
      })
    );

    const current = await combatStorage.getCurrentParticipant(session.id);

    expect(current?.id).toBe("p2");
    expect(current?.name).toBe("Second");
  });

  it("should return null for empty initiative order", async () => {
    const session = await combatStorage.createCombatSession(
      createMockSession({ initiativeOrder: [] })
    );

    const current = await combatStorage.getCurrentParticipant(session.id);

    expect(current).toBeNull();
  });
});

// =============================================================================
// INTERRUPT MANAGEMENT
// =============================================================================

describe("declareInterrupt", () => {
  it("should add interrupt to participant", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const withParticipant = await combatStorage.addParticipant(session.id, createMockParticipant());
    const participantId = withParticipant!.participants[0].id;

    const interrupt: Omit<PendingInterrupt, "id" | "declaredAt" | "resolved"> = {
      interruptType: "dodge",
      triggeredBy: "enemy-1",
      triggeringActionId: "action-1",
      initiativeCost: 5,
    };

    const updated = await combatStorage.declareInterrupt(session.id, participantId, interrupt);

    const participant = updated?.participants.find((p) => p.id === participantId);
    expect(participant?.interruptsPending.length).toBe(1);
    expect(participant?.interruptsPending[0].interruptType).toBe("dodge");
    expect(participant?.interruptsPending[0].resolved).toBe(false);
  });

  it("should consume interrupt action", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const withParticipant = await combatStorage.addParticipant(session.id, createMockParticipant());
    const participantId = withParticipant!.participants[0].id;

    const interrupt: Omit<PendingInterrupt, "id" | "declaredAt" | "resolved"> = {
      interruptType: "block",
      triggeredBy: "enemy-1",
      triggeringActionId: "action-1",
      initiativeCost: 5,
    };

    const updated = await combatStorage.declareInterrupt(session.id, participantId, interrupt);

    const participant = updated?.participants.find((p) => p.id === participantId);
    expect(participant?.actionsRemaining.interrupt).toBe(false);
  });
});

describe("resolveInterrupt", () => {
  it("should resolve and remove interrupt", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());
    const participantWithInterrupt = createMockParticipant({
      initiativeScore: 20,
      interruptsPending: [
        {
          id: "int-1",
          interruptType: "dodge",
          triggeredBy: "enemy-1",
          triggeringActionId: "action-1",
          initiativeCost: 5,
          declaredAt: new Date().toISOString(),
          resolved: false,
        },
      ],
    });
    const withParticipant = await combatStorage.addParticipant(session.id, participantWithInterrupt);
    const participantId = withParticipant!.participants[0].id;

    const updated = await combatStorage.resolveInterrupt(session.id, participantId, "int-1");

    const participant = updated?.participants.find((p) => p.id === participantId);
    expect(participant?.interruptsPending.length).toBe(0);
    expect(participant?.initiativeScore).toBe(15); // 20 - 5 cost
  });
});

// =============================================================================
// DELETE OPERATIONS
// =============================================================================

describe("deleteCombatSession", () => {
  it("should delete session and remove from index", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());

    const deleted = await combatStorage.deleteCombatSession(session.id);

    expect(deleted).toBe(true);
    expect(base.deleteFile).toHaveBeenCalled();
  });

  it("should return false for non-existent session", async () => {
    const deleted = await combatStorage.deleteCombatSession("fake-id");
    expect(deleted).toBe(false);
  });
});

describe("endCombatSession", () => {
  it("should mark session as completed", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());

    const ended = await combatStorage.endCombatSession(session.id);

    expect(ended?.status).toBe("completed");
  });

  it("should mark session as abandoned when specified", async () => {
    const session = await combatStorage.createCombatSession(createMockSession());

    const ended = await combatStorage.endCombatSession(session.id, "abandoned");

    expect(ended?.status).toBe("abandoned");
  });
});

// =============================================================================
// OPPOSED TEST STORAGE
// =============================================================================

describe("createOpposedTest", () => {
  it("should create opposed test with generated id", async () => {
    const testData: Omit<OpposedTest, "id" | "initiatedAt"> = {
      combatSessionId: "combat-1",
      attackerId: "p1",
      defenderId: "p2",
      mode: "synchronous",
      state: "resolved",
      attackerHits: 3,
      defenderHits: 2,
      netHits: 1,
    };

    const test = await combatStorage.createOpposedTest(testData);

    expect(test.id).toBeDefined();
    expect(test.initiatedAt).toBeDefined();
    expect(test.attackerId).toBe("p1");
    expect(test.defenderId).toBe("p2");
  });
});

describe("getOpposedTest", () => {
  it("should retrieve opposed test by id", async () => {
    const created = await combatStorage.createOpposedTest({
      combatSessionId: "combat-1",
      attackerId: "p1",
      defenderId: "p2",
      mode: "synchronous",
      state: "resolved",
      attackerHits: 4,
      defenderHits: 1,
      netHits: 3,
    });

    const retrieved = await combatStorage.getOpposedTest(created.id);

    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.netHits).toBe(3);
  });

  it("should return null for non-existent test", async () => {
    const result = await combatStorage.getOpposedTest("fake-id");
    expect(result).toBeNull();
  });
});

describe("updateOpposedTest", () => {
  it("should update opposed test properties", async () => {
    const created = await combatStorage.createOpposedTest({
      combatSessionId: "combat-1",
      attackerId: "p1",
      defenderId: "p2",
      mode: "asynchronous",
      state: "pending_defender",
    });

    const updated = await combatStorage.updateOpposedTest(created.id, {
      state: "resolved",
      attackerHits: 5,
      defenderHits: 3,
      netHits: 2,
      resolvedAt: new Date().toISOString(),
    });

    expect(updated?.state).toBe("resolved");
    expect(updated?.netHits).toBe(2);
    expect(updated?.resolvedAt).toBeDefined();
  });
});

describe("getPendingOpposedTests", () => {
  it("should return pending tests for session", async () => {
    // Create pending test
    await combatStorage.createOpposedTest({
      combatSessionId: "combat-pending",
      attackerId: "p1",
      defenderId: "p2",
      mode: "asynchronous",
      state: "pending_defender",
    });

    // Create resolved test (should not be returned)
    await combatStorage.createOpposedTest({
      combatSessionId: "combat-pending",
      attackerId: "p3",
      defenderId: "p4",
      mode: "synchronous",
      state: "resolved",
    });

    // Mock listJsonFiles to return test IDs
    const createdTests = Array.from(mockBase.__storage.entries())
      .filter(([key]) => key.includes("opposed-tests"))
      .map(([key]) => key.split("/").pop()?.replace(".json", ""))
      .filter(Boolean) as string[];

    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(createdTests);

    const pending = await combatStorage.getPendingOpposedTests("combat-pending");

    expect(pending.every((t) => t.state !== "resolved")).toBe(true);
    expect(pending.every((t) => t.combatSessionId === "combat-pending")).toBe(true);
  });
});
