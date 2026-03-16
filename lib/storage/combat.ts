/**
 * Combat Session Storage Layer
 *
 * Handles persistent storage of combat sessions for server-side
 * action economy enforcement and multiplayer campaign support.
 *
 * Combat sessions are stored in data/combat/{sessionId}.json
 * Active sessions are indexed in data/combat/_index.json
 */

import path from "path";
import { randomUUID } from "crypto";
import type {
  ID,
  CombatSession,
  CombatSessionStatus,
  CombatParticipant,
  ActionAllocation,
  EnvironmentConditions,
  ActiveCondition,
  PendingInterrupt,
  OpposedTest,
  DEFAULT_ACTION_ALLOCATION,
} from "../types";
import {
  ensureDirectory,
  readJsonFile,
  writeJsonFile,
  deleteFile,
  listJsonFiles,
  withFileLock,
} from "./base";

// =============================================================================
// CONSTANTS
// =============================================================================

const COMBAT_DIR = path.join(process.cwd(), "data", "combat");
const INDEX_FILE = "_index.json";
const MAX_COMPLETED_SESSIONS = 100; // Max completed sessions to keep

// =============================================================================
// TYPES
// =============================================================================

/**
 * Index of combat sessions for quick lookup
 */
interface CombatSessionIndex {
  /** Active session IDs by owner */
  byOwner: Record<ID, ID[]>;
  /** Active session IDs by campaign */
  byCampaign: Record<ID, ID[]>;
  /** All active session IDs */
  active: ID[];
  /** Recently completed session IDs (for reference) */
  completed: ID[];
  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Query options for listing sessions
 */
export interface CombatSessionQuery {
  /** Filter by owner */
  ownerId?: ID;
  /** Filter by campaign */
  campaignId?: ID;
  /** Filter by status */
  status?: CombatSessionStatus;
  /** Include completed sessions */
  includeCompleted?: boolean;
  /** Maximum results */
  limit?: number;
}

// =============================================================================
// PATH HELPERS
// =============================================================================

function getSessionPath(sessionId: ID): string {
  return path.join(COMBAT_DIR, `${sessionId}.json`);
}

function getIndexPath(): string {
  return path.join(COMBAT_DIR, INDEX_FILE);
}

// =============================================================================
// INDEX MANAGEMENT
// =============================================================================

/**
 * Read the session index
 */
async function readIndex(): Promise<CombatSessionIndex> {
  await ensureDirectory(COMBAT_DIR);
  const index = await readJsonFile<CombatSessionIndex>(getIndexPath());

  if (!index) {
    return {
      byOwner: {},
      byCampaign: {},
      active: [],
      completed: [],
      updatedAt: new Date().toISOString(),
    };
  }

  return index;
}

/**
 * Write the session index
 */
async function writeIndex(index: CombatSessionIndex): Promise<void> {
  const timestamped: CombatSessionIndex = { ...index, updatedAt: new Date().toISOString() };
  await writeJsonFile(getIndexPath(), timestamped);
}

/**
 * Add a session to the index
 */
async function addToIndex(session: CombatSession): Promise<void> {
  await withFileLock(getIndexPath(), async () => {
    const index = await readIndex();

    const ownerList = index.byOwner[session.ownerId] || [];
    const campaignList = session.campaignId ? index.byCampaign[session.campaignId] || [] : [];

    const updatedIndex: CombatSessionIndex = {
      ...index,
      active: index.active.includes(session.id) ? index.active : [...index.active, session.id],
      byOwner: {
        ...index.byOwner,
        [session.ownerId]: ownerList.includes(session.id) ? ownerList : [...ownerList, session.id],
      },
      byCampaign: session.campaignId
        ? {
            ...index.byCampaign,
            [session.campaignId]: campaignList.includes(session.id)
              ? campaignList
              : [...campaignList, session.id],
          }
        : index.byCampaign,
    };

    await writeIndex(updatedIndex);
  });
}

/**
 * Move a session from active to completed in the index
 */
async function moveToCompleted(sessionId: ID, ownerId: ID, campaignId?: ID): Promise<void> {
  await withFileLock(getIndexPath(), async () => {
    const index = await readIndex();

    // Build updated owner index - remove sessionId, drop empty entries
    const updatedByOwner = Object.fromEntries(
      Object.entries({ ...index.byOwner })
        .map(([key, ids]) => [key, key === ownerId ? ids.filter((id) => id !== sessionId) : ids])
        .filter(([, ids]) => (ids as ID[]).length > 0)
    );

    // Build updated campaign index - remove sessionId, drop empty entries
    const updatedByCampaign = campaignId
      ? Object.fromEntries(
          Object.entries({ ...index.byCampaign })
            .map(([key, ids]) => [
              key,
              key === campaignId ? ids.filter((id) => id !== sessionId) : ids,
            ])
            .filter(([, ids]) => (ids as ID[]).length > 0)
        )
      : index.byCampaign;

    // Add to completed (newest first)
    const newCompleted = [sessionId, ...index.completed];
    const trimmedCompleted = newCompleted.slice(0, MAX_COMPLETED_SESSIONS);
    const toRemove = newCompleted.slice(MAX_COMPLETED_SESSIONS);

    const updatedIndex: CombatSessionIndex = {
      ...index,
      active: index.active.filter((id) => id !== sessionId),
      byOwner: updatedByOwner,
      byCampaign: updatedByCampaign,
      completed: trimmedCompleted,
    };

    // Write index first — orphaned files on disk are harmless,
    // but index referencing deleted files causes silent data loss.
    await writeIndex(updatedIndex);

    // Then delete old session files
    for (const id of toRemove) {
      await deleteFile(getSessionPath(id));
    }
  });
}

/**
 * Remove a session from the index entirely
 */
async function removeFromIndex(sessionId: ID, ownerId: ID, campaignId?: ID): Promise<void> {
  await withFileLock(getIndexPath(), async () => {
    const index = await readIndex();

    // Build updated owner index - remove sessionId, drop empty entries
    const updatedByOwner = Object.fromEntries(
      Object.entries(index.byOwner)
        .map(([key, ids]) => [key, key === ownerId ? ids.filter((id) => id !== sessionId) : ids])
        .filter(([, ids]) => (ids as ID[]).length > 0)
    );

    // Build updated campaign index - remove sessionId, drop empty entries
    const updatedByCampaign = campaignId
      ? Object.fromEntries(
          Object.entries(index.byCampaign)
            .map(([key, ids]) => [
              key,
              key === campaignId ? ids.filter((id) => id !== sessionId) : ids,
            ])
            .filter(([, ids]) => (ids as ID[]).length > 0)
        )
      : index.byCampaign;

    const updatedIndex: CombatSessionIndex = {
      ...index,
      active: index.active.filter((id) => id !== sessionId),
      completed: index.completed.filter((id) => id !== sessionId),
      byOwner: updatedByOwner,
      byCampaign: updatedByCampaign,
    };

    await writeIndex(updatedIndex);
  });
}

// =============================================================================
// CREATE OPERATIONS
// =============================================================================

/**
 * Create a new combat session
 */
export async function createCombatSession(
  data: Omit<CombatSession, "id" | "createdAt" | "updatedAt">
): Promise<CombatSession> {
  await ensureDirectory(COMBAT_DIR);

  const now = new Date().toISOString();
  const session: CombatSession = {
    ...data,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  await writeJsonFile(getSessionPath(session.id), session);
  await addToIndex(session);

  return session;
}

// =============================================================================
// READ OPERATIONS
// =============================================================================

/**
 * Get a combat session by ID
 */
export async function getCombatSession(sessionId: ID): Promise<CombatSession | null> {
  return readJsonFile<CombatSession>(getSessionPath(sessionId));
}

/**
 * List combat sessions with optional filters
 */
export async function listCombatSessions(query: CombatSessionQuery = {}): Promise<CombatSession[]> {
  const index = await readIndex();
  let sessionIds: ID[] = [];

  // Determine which session IDs to load
  if (query.ownerId) {
    sessionIds = index.byOwner[query.ownerId] || [];
  } else if (query.campaignId) {
    sessionIds = index.byCampaign[query.campaignId] || [];
  } else {
    sessionIds = [...index.active];
  }

  // Include completed if requested
  if (query.includeCompleted) {
    sessionIds = [...sessionIds, ...index.completed];
  }

  // Load sessions
  const sessions: CombatSession[] = [];
  for (const id of sessionIds) {
    const session = await getCombatSession(id);
    if (session) {
      // Apply status filter
      if (query.status && session.status !== query.status) {
        continue;
      }
      sessions.push(session);
    }
  }

  // Sort by most recent first
  sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Apply limit
  if (query.limit && sessions.length > query.limit) {
    return sessions.slice(0, query.limit);
  }

  return sessions;
}

/**
 * Get active sessions for a user
 */
export async function getActiveSessionsForUser(userId: ID): Promise<CombatSession[]> {
  return listCombatSessions({ ownerId: userId, status: "active" });
}

/**
 * Get active sessions for a campaign
 */
export async function getActiveSessionsForCampaign(campaignId: ID): Promise<CombatSession[]> {
  return listCombatSessions({ campaignId, status: "active" });
}

// =============================================================================
// UPDATE OPERATIONS
// =============================================================================

/**
 * Update a combat session
 */
export async function updateCombatSession(
  sessionId: ID,
  updates: Partial<Omit<CombatSession, "id" | "createdAt">>
): Promise<CombatSession | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  const wasActive = session.status === "active" || session.status === "paused";

  // Apply updates
  const updated: CombatSession = {
    ...session,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Handle status changes
  if (updates.status && (updates.status === "completed" || updates.status === "abandoned")) {
    if (wasActive) {
      updated.endedAt = new Date().toISOString();
      await moveToCompleted(sessionId, session.ownerId, session.campaignId);
    }
  }

  await writeJsonFile(getSessionPath(sessionId), updated);

  return updated;
}

/**
 * Update environment conditions
 */
export async function updateEnvironment(
  sessionId: ID,
  environment: EnvironmentConditions
): Promise<CombatSession | null> {
  return updateCombatSession(sessionId, { environment });
}

// =============================================================================
// PARTICIPANT MANAGEMENT
// =============================================================================

/**
 * Add a participant to a combat session
 */
export async function addParticipant(
  sessionId: ID,
  participant: Omit<CombatParticipant, "id">
): Promise<CombatSession | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  const newParticipant: CombatParticipant = {
    ...participant,
    id: randomUUID(),
  };

  const updated: CombatSession = {
    ...session,
    participants: [...session.participants, newParticipant],
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(getSessionPath(sessionId), updated);

  return updated;
}

/**
 * Remove a participant from a combat session
 */
export async function removeParticipant(
  sessionId: ID,
  participantId: ID
): Promise<CombatSession | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  const updated: CombatSession = {
    ...session,
    participants: session.participants.filter((p) => p.id !== participantId),
    initiativeOrder: session.initiativeOrder.filter((id) => id !== participantId),
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(getSessionPath(sessionId), updated);

  return updated;
}

/**
 * Update a participant's data
 */
export async function updateParticipant(
  sessionId: ID,
  participantId: ID,
  updates: Partial<Omit<CombatParticipant, "id">>
): Promise<CombatParticipant | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  const participantIndex = session.participants.findIndex((p) => p.id === participantId);
  if (participantIndex === -1) {
    return null;
  }

  const updatedParticipant: CombatParticipant = {
    ...session.participants[participantIndex],
    ...updates,
  };

  const updated: CombatSession = {
    ...session,
    participants: session.participants.map((p, i) =>
      i === participantIndex ? updatedParticipant : p
    ),
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(getSessionPath(sessionId), updated);

  return updatedParticipant;
}

/**
 * Update a participant's action allocation
 */
export async function updateParticipantActions(
  sessionId: ID,
  participantId: ID,
  actions: ActionAllocation
): Promise<CombatParticipant | null> {
  return updateParticipant(sessionId, participantId, { actionsRemaining: actions });
}

/**
 * Add a condition to a participant
 */
export async function addCondition(
  sessionId: ID,
  participantId: ID,
  condition: ActiveCondition
): Promise<CombatParticipant | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  const participant = session.participants.find((p) => p.id === participantId);
  if (!participant) {
    return null;
  }

  return updateParticipant(sessionId, participantId, {
    conditions: [...participant.conditions, condition],
  });
}

/**
 * Remove a condition from a participant
 */
export async function removeCondition(
  sessionId: ID,
  participantId: ID,
  conditionId: string
): Promise<CombatParticipant | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  const participant = session.participants.find((p) => p.id === participantId);
  if (!participant) {
    return null;
  }

  return updateParticipant(sessionId, participantId, {
    conditions: participant.conditions.filter((c) => c.id !== conditionId),
  });
}

// =============================================================================
// INITIATIVE MANAGEMENT
// =============================================================================

/**
 * Set initiative score for a participant
 */
export async function setInitiativeScore(
  sessionId: ID,
  participantId: ID,
  score: number,
  dice?: number[]
): Promise<CombatSession | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  const participantIndex = session.participants.findIndex((p) => p.id === participantId);
  if (participantIndex === -1) {
    return null;
  }

  const updatedParticipant: CombatParticipant = {
    ...session.participants[participantIndex],
    initiativeScore: score,
    ...(dice ? { initiativeDice: dice } : {}),
  };

  const updatedParticipants = session.participants.map((p, i) =>
    i === participantIndex ? updatedParticipant : p
  );

  // Re-sort initiative order
  const updatedInitiativeOrder = updatedParticipants
    .filter((p) => p.status === "active" || p.status === "delayed")
    .sort((a, b) => b.initiativeScore - a.initiativeScore)
    .map((p) => p.id);

  const updated: CombatSession = {
    ...session,
    participants: updatedParticipants,
    initiativeOrder: updatedInitiativeOrder,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(getSessionPath(sessionId), updated);

  return updated;
}

/**
 * Update initiative order (for manual reordering or after initiative changes)
 */
export async function updateInitiativeOrder(
  sessionId: ID,
  order: ID[]
): Promise<CombatSession | null> {
  return updateCombatSession(sessionId, { initiativeOrder: order });
}

// =============================================================================
// TURN MANAGEMENT
// =============================================================================

/**
 * Advance to the next turn in initiative order
 */
export async function advanceTurn(sessionId: ID): Promise<CombatSession | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  // Find active participants in initiative order
  const activeOrder = session.initiativeOrder.filter((id) => {
    const p = session.participants.find((part) => part.id === id);
    return p && (p.status === "active" || p.status === "waiting");
  });

  if (activeOrder.length === 0) {
    return session;
  }

  // Move to next turn
  const nextTurn = (session.currentTurn + 1) % activeOrder.length;
  const wrappedAround = nextTurn === 0;

  // If we wrapped around, advance the round and reset action allocations
  const updatedParticipants = wrappedAround
    ? session.participants.map((p) =>
        p.status === "active"
          ? { ...p, actionsRemaining: { free: 999, simple: 2, complex: 1, interrupt: true } }
          : p
      )
    : session.participants;

  const updated: CombatSession = {
    ...session,
    currentTurn: nextTurn,
    round: wrappedAround ? session.round + 1 : session.round,
    participants: updatedParticipants,
    currentPhase: "action",
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(getSessionPath(sessionId), updated);

  return updated;
}

/**
 * Advance to the next round
 */
export async function advanceRound(sessionId: ID): Promise<CombatSession | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  // Reset action allocations and decrement condition durations
  const updatedParticipants = session.participants.map((participant) => {
    const updatedConditions = participant.conditions
      .map((c) =>
        c.roundsRemaining !== undefined ? { ...c, roundsRemaining: c.roundsRemaining - 1 } : c
      )
      .filter((c) => c.roundsRemaining === undefined || c.roundsRemaining > 0);

    return participant.status === "active"
      ? {
          ...participant,
          actionsRemaining: { free: 999, simple: 2, complex: 1, interrupt: true },
          conditions: updatedConditions,
        }
      : { ...participant, conditions: updatedConditions };
  });

  const updated: CombatSession = {
    ...session,
    round: session.round + 1,
    currentTurn: 0,
    currentPhase: "initiative",
    participants: updatedParticipants,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(getSessionPath(sessionId), updated);

  return updated;
}

/**
 * Get the current participant (whose turn it is)
 */
export async function getCurrentParticipant(sessionId: ID): Promise<CombatParticipant | null> {
  const session = await getCombatSession(sessionId);
  if (!session || session.initiativeOrder.length === 0) {
    return null;
  }

  const currentId = session.initiativeOrder[session.currentTurn];
  return session.participants.find((p) => p.id === currentId) || null;
}

// =============================================================================
// INTERRUPT MANAGEMENT
// =============================================================================

/**
 * Declare an interrupt action
 */
export async function declareInterrupt(
  sessionId: ID,
  participantId: ID,
  interrupt: Omit<PendingInterrupt, "id" | "declaredAt" | "resolved">
): Promise<CombatSession | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  const participantIndex = session.participants.findIndex((p) => p.id === participantId);
  if (participantIndex === -1) {
    return null;
  }

  const participant = session.participants[participantIndex];

  const pendingInterrupt: PendingInterrupt = {
    ...interrupt,
    id: randomUUID(),
    declaredAt: new Date().toISOString(),
    resolved: false,
  };

  const updatedParticipant: CombatParticipant = {
    ...participant,
    interruptsPending: [...participant.interruptsPending, pendingInterrupt],
    actionsRemaining: { ...participant.actionsRemaining, interrupt: false },
  };

  const updated: CombatSession = {
    ...session,
    participants: session.participants.map((p, i) =>
      i === participantIndex ? updatedParticipant : p
    ),
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(getSessionPath(sessionId), updated);

  return updated;
}

/**
 * Resolve a pending interrupt
 */
export async function resolveInterrupt(
  sessionId: ID,
  participantId: ID,
  interruptId: ID
): Promise<CombatSession | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  const participantIndex = session.participants.findIndex((p) => p.id === participantId);
  if (participantIndex === -1) {
    return null;
  }

  const participant = session.participants[participantIndex];
  const interrupt = participant.interruptsPending.find((i) => i.id === interruptId);
  if (!interrupt) {
    return null;
  }

  const updatedParticipant: CombatParticipant = {
    ...participant,
    initiativeScore: participant.initiativeScore - interrupt.initiativeCost,
    interruptsPending: participant.interruptsPending.filter((i) => i.id !== interruptId),
  };

  const updated: CombatSession = {
    ...session,
    participants: session.participants.map((p, i) =>
      i === participantIndex ? updatedParticipant : p
    ),
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(getSessionPath(sessionId), updated);

  return updated;
}

// =============================================================================
// DELETE OPERATIONS
// =============================================================================

/**
 * Delete a combat session
 */
export async function deleteCombatSession(sessionId: ID): Promise<boolean> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return false;
  }

  await removeFromIndex(sessionId, session.ownerId, session.campaignId);
  await deleteFile(getSessionPath(sessionId));

  return true;
}

/**
 * End a combat session (mark as completed)
 */
export async function endCombatSession(
  sessionId: ID,
  status: "completed" | "abandoned" = "completed"
): Promise<CombatSession | null> {
  return updateCombatSession(sessionId, { status });
}

// =============================================================================
// OPPOSED TEST STORAGE
// =============================================================================

const OPPOSED_TESTS_DIR = path.join(COMBAT_DIR, "opposed-tests");
const OPPOSED_INDEX_FILE = path.join(OPPOSED_TESTS_DIR, "_index.json");

/**
 * Opposed test index: maps sessionId → testId[] for quick lookup
 */
type OpposedTestIndex = Record<ID, ID[]>;

async function readOpposedIndex(): Promise<OpposedTestIndex> {
  return (await readJsonFile<OpposedTestIndex>(OPPOSED_INDEX_FILE)) ?? {};
}

async function writeOpposedIndex(index: OpposedTestIndex): Promise<void> {
  await writeJsonFile(OPPOSED_INDEX_FILE, index);
}

/**
 * Create an opposed test record
 */
export async function createOpposedTest(
  test: Omit<OpposedTest, "id" | "initiatedAt">
): Promise<OpposedTest> {
  await ensureDirectory(OPPOSED_TESTS_DIR);

  const opposedTest: OpposedTest = {
    ...test,
    id: randomUUID(),
    initiatedAt: new Date().toISOString(),
  };

  const filePath = path.join(OPPOSED_TESTS_DIR, `${opposedTest.id}.json`);
  await writeJsonFile(filePath, opposedTest);

  // Update the session→tests index
  await withFileLock(OPPOSED_INDEX_FILE, async () => {
    const index = await readOpposedIndex();
    const sessionTests = index[opposedTest.combatSessionId] ?? [];
    await writeOpposedIndex({
      ...index,
      [opposedTest.combatSessionId]: [...sessionTests, opposedTest.id],
    });
  });

  return opposedTest;
}

/**
 * Get an opposed test by ID
 */
export async function getOpposedTest(testId: ID): Promise<OpposedTest | null> {
  const filePath = path.join(OPPOSED_TESTS_DIR, `${testId}.json`);
  return readJsonFile<OpposedTest>(filePath);
}

/**
 * Update an opposed test. Removes resolved tests from the index.
 */
export async function updateOpposedTest(
  testId: ID,
  updates: Partial<Omit<OpposedTest, "id" | "initiatedAt">>
): Promise<OpposedTest | null> {
  const test = await getOpposedTest(testId);
  if (!test) {
    return null;
  }

  const updated: OpposedTest = {
    ...test,
    ...updates,
  };

  // Test file write is outside the index lock — individual test files have
  // no concurrent-write risk under single-caller semantics. The lock only
  // guards index consistency for the session→testId[] mapping.
  const filePath = path.join(OPPOSED_TESTS_DIR, `${testId}.json`);
  await writeJsonFile(filePath, updated);

  // If the test was just resolved, remove it from the index
  if (updated.state === "resolved" && test.state !== "resolved") {
    await withFileLock(OPPOSED_INDEX_FILE, async () => {
      const index = await readOpposedIndex();
      const sessionTests = index[test.combatSessionId] ?? [];
      await writeOpposedIndex({
        ...index,
        [test.combatSessionId]: sessionTests.filter((id) => id !== testId),
      });
    });
  }

  return updated;
}

/**
 * Get pending opposed tests for a combat session using the index.
 */
export async function getPendingOpposedTests(sessionId: ID): Promise<OpposedTest[]> {
  const index = await readOpposedIndex();
  const testIds = index[sessionId] ?? [];

  const pendingTests: OpposedTest[] = [];
  for (const id of testIds) {
    const test = await getOpposedTest(id);
    if (test && test.state !== "resolved") {
      pendingTests.push(test);
    }
  }

  return pendingTests;
}
