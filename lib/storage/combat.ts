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
import { ensureDirectory, readJsonFile, writeJsonFile, deleteFile, listJsonFiles } from "./base";

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
  index.updatedAt = new Date().toISOString();
  await writeJsonFile(getIndexPath(), index);
}

/**
 * Add a session to the index
 */
async function addToIndex(session: CombatSession): Promise<void> {
  const index = await readIndex();

  // Add to active list
  if (!index.active.includes(session.id)) {
    index.active.push(session.id);
  }

  // Add to owner index
  if (!index.byOwner[session.ownerId]) {
    index.byOwner[session.ownerId] = [];
  }
  if (!index.byOwner[session.ownerId].includes(session.id)) {
    index.byOwner[session.ownerId].push(session.id);
  }

  // Add to campaign index if applicable
  if (session.campaignId) {
    if (!index.byCampaign[session.campaignId]) {
      index.byCampaign[session.campaignId] = [];
    }
    if (!index.byCampaign[session.campaignId].includes(session.id)) {
      index.byCampaign[session.campaignId].push(session.id);
    }
  }

  await writeIndex(index);
}

/**
 * Move a session from active to completed in the index
 */
async function moveToCompleted(sessionId: ID, ownerId: ID, campaignId?: ID): Promise<void> {
  const index = await readIndex();

  // Remove from active
  index.active = index.active.filter((id) => id !== sessionId);

  // Remove from owner index
  if (index.byOwner[ownerId]) {
    index.byOwner[ownerId] = index.byOwner[ownerId].filter((id) => id !== sessionId);
    if (index.byOwner[ownerId].length === 0) {
      delete index.byOwner[ownerId];
    }
  }

  // Remove from campaign index
  if (campaignId && index.byCampaign[campaignId]) {
    index.byCampaign[campaignId] = index.byCampaign[campaignId].filter((id) => id !== sessionId);
    if (index.byCampaign[campaignId].length === 0) {
      delete index.byCampaign[campaignId];
    }
  }

  // Add to completed
  index.completed.unshift(sessionId);

  // Trim completed list
  if (index.completed.length > MAX_COMPLETED_SESSIONS) {
    const toRemove = index.completed.slice(MAX_COMPLETED_SESSIONS);
    index.completed = index.completed.slice(0, MAX_COMPLETED_SESSIONS);

    // Delete old session files
    for (const id of toRemove) {
      await deleteFile(getSessionPath(id));
    }
  }

  await writeIndex(index);
}

/**
 * Remove a session from the index entirely
 */
async function removeFromIndex(sessionId: ID, ownerId: ID, campaignId?: ID): Promise<void> {
  const index = await readIndex();

  // Remove from all lists
  index.active = index.active.filter((id) => id !== sessionId);
  index.completed = index.completed.filter((id) => id !== sessionId);

  if (index.byOwner[ownerId]) {
    index.byOwner[ownerId] = index.byOwner[ownerId].filter((id) => id !== sessionId);
    if (index.byOwner[ownerId].length === 0) {
      delete index.byOwner[ownerId];
    }
  }

  if (campaignId && index.byCampaign[campaignId]) {
    index.byCampaign[campaignId] = index.byCampaign[campaignId].filter((id) => id !== sessionId);
    if (index.byCampaign[campaignId].length === 0) {
      delete index.byCampaign[campaignId];
    }
  }

  await writeIndex(index);
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

  session.participants.push(newParticipant);
  session.updatedAt = new Date().toISOString();

  await writeJsonFile(getSessionPath(sessionId), session);

  return session;
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

  session.participants = session.participants.filter((p) => p.id !== participantId);
  session.initiativeOrder = session.initiativeOrder.filter((id) => id !== participantId);
  session.updatedAt = new Date().toISOString();

  await writeJsonFile(getSessionPath(sessionId), session);

  return session;
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

  const index = session.participants.findIndex((p) => p.id === participantId);
  if (index === -1) {
    return null;
  }

  session.participants[index] = {
    ...session.participants[index],
    ...updates,
  };
  session.updatedAt = new Date().toISOString();

  await writeJsonFile(getSessionPath(sessionId), session);

  return session.participants[index];
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

  participant.conditions.push(condition);

  return updateParticipant(sessionId, participantId, { conditions: participant.conditions });
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

  participant.conditions = participant.conditions.filter((c) => c.id !== conditionId);

  return updateParticipant(sessionId, participantId, { conditions: participant.conditions });
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

  const participant = session.participants.find((p) => p.id === participantId);
  if (!participant) {
    return null;
  }

  participant.initiativeScore = score;
  if (dice) {
    participant.initiativeDice = dice;
  }

  // Re-sort initiative order
  session.initiativeOrder = session.participants
    .filter((p) => p.status === "active" || p.status === "delayed")
    .sort((a, b) => b.initiativeScore - a.initiativeScore)
    .map((p) => p.id);

  session.updatedAt = new Date().toISOString();

  await writeJsonFile(getSessionPath(sessionId), session);

  return session;
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
  session.currentTurn = (session.currentTurn + 1) % activeOrder.length;

  // If we wrapped around, advance the round
  if (session.currentTurn === 0) {
    session.round++;
    // Reset action allocations for all participants
    for (const participant of session.participants) {
      if (participant.status === "active") {
        participant.actionsRemaining = {
          free: 999,
          simple: 2,
          complex: 1,
          interrupt: true,
        };
      }
    }
  }

  session.currentPhase = "action";
  session.updatedAt = new Date().toISOString();

  await writeJsonFile(getSessionPath(sessionId), session);

  return session;
}

/**
 * Advance to the next round
 */
export async function advanceRound(sessionId: ID): Promise<CombatSession | null> {
  const session = await getCombatSession(sessionId);
  if (!session) {
    return null;
  }

  session.round++;
  session.currentTurn = 0;
  session.currentPhase = "initiative";

  // Reset action allocations and decrement condition durations
  for (const participant of session.participants) {
    if (participant.status === "active") {
      participant.actionsRemaining = {
        free: 999,
        simple: 2,
        complex: 1,
        interrupt: true,
      };
    }

    // Decrement condition durations
    participant.conditions = participant.conditions.filter((c) => {
      if (c.roundsRemaining !== undefined) {
        c.roundsRemaining--;
        return c.roundsRemaining > 0;
      }
      return true;
    });
  }

  session.updatedAt = new Date().toISOString();

  await writeJsonFile(getSessionPath(sessionId), session);

  return session;
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

  const participant = session.participants.find((p) => p.id === participantId);
  if (!participant) {
    return null;
  }

  const pendingInterrupt: PendingInterrupt = {
    ...interrupt,
    id: randomUUID(),
    declaredAt: new Date().toISOString(),
    resolved: false,
  };

  participant.interruptsPending.push(pendingInterrupt);
  participant.actionsRemaining.interrupt = false;

  session.updatedAt = new Date().toISOString();

  await writeJsonFile(getSessionPath(sessionId), session);

  return session;
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

  const participant = session.participants.find((p) => p.id === participantId);
  if (!participant) {
    return null;
  }

  const interrupt = participant.interruptsPending.find((i) => i.id === interruptId);
  if (!interrupt) {
    return null;
  }

  interrupt.resolved = true;

  // Apply initiative cost
  participant.initiativeScore -= interrupt.initiativeCost;

  // Remove resolved interrupts
  participant.interruptsPending = participant.interruptsPending.filter((i) => !i.resolved);

  session.updatedAt = new Date().toISOString();

  await writeJsonFile(getSessionPath(sessionId), session);

  return session;
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
 * Update an opposed test
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

  const filePath = path.join(OPPOSED_TESTS_DIR, `${testId}.json`);
  await writeJsonFile(filePath, updated);

  return updated;
}

/**
 * Get pending opposed tests for a combat session
 */
export async function getPendingOpposedTests(sessionId: ID): Promise<OpposedTest[]> {
  await ensureDirectory(OPPOSED_TESTS_DIR);
  const testIds = await listJsonFiles(OPPOSED_TESTS_DIR);

  const pendingTests: OpposedTest[] = [];
  for (const id of testIds) {
    const test = await getOpposedTest(id);
    if (test && test.combatSessionId === sessionId && test.state !== "resolved") {
      pendingTests.push(test);
    }
  }

  return pendingTests;
}
