/**
 * Overwatch Session Tracker
 *
 * Manages session-level Overwatch Score tracking.
 * OS is ephemeral - it resets when the decker jacks out.
 * This service tracks the history of OS events for audit purposes.
 */

import type { ID, ISODateString } from "@/lib/types";
import type { OverwatchEvent, OverwatchSession } from "@/lib/types/matrix";
import { OVERWATCH_THRESHOLD } from "@/lib/types/matrix";
import { checkConvergence } from "./overwatch-calculator";

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `os-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new Overwatch tracking session
 *
 * Called when a decker connects to the Matrix with intent to hack.
 * Session tracks all OS events until disconnect or convergence.
 *
 * @param characterId - The character's ID
 * @param threshold - Custom threshold (optional, default: 40)
 * @returns New overwatch session
 */
export function startOverwatchSession(
  characterId: ID,
  threshold: number = OVERWATCH_THRESHOLD
): OverwatchSession {
  return {
    sessionId: generateSessionId(),
    characterId,
    startedAt: new Date().toISOString() as ISODateString,
    currentScore: 0,
    threshold,
    events: [],
    converged: false,
  };
}

/**
 * Record an Overwatch event in the session
 *
 * Adds an event to the session history and updates the current score.
 * Returns a new session object (immutable update).
 *
 * @param session - Current session
 * @param action - Description of the action that caused the increase
 * @param scoreAdded - Amount of OS added
 * @returns Updated session with new event
 */
export function recordOverwatchEvent(
  session: OverwatchSession,
  action: string,
  scoreAdded: number
): OverwatchSession {
  // Don't record events after convergence
  if (session.converged) {
    return session;
  }

  const newScore = session.currentScore + scoreAdded;
  const triggeredConvergence = checkConvergence(newScore, session.threshold);

  const event: OverwatchEvent = {
    timestamp: new Date().toISOString() as ISODateString,
    action,
    scoreAdded,
    totalScore: newScore,
    triggeredConvergence,
  };

  return {
    ...session,
    currentScore: newScore,
    events: [...session.events, event],
    converged: triggeredConvergence,
    convergedAt: triggeredConvergence
      ? (new Date().toISOString() as ISODateString)
      : session.convergedAt,
  };
}

/**
 * End an Overwatch session
 *
 * Called when the decker jacks out, converges, or the GM ends the session.
 * Sets the end reason for audit purposes.
 *
 * @param session - Current session
 * @param reason - Why the session ended
 * @returns Finalized session
 */
export function endOverwatchSession(
  session: OverwatchSession,
  reason: "jacked_out" | "converged" | "session_ended" | "link_locked"
): OverwatchSession {
  return {
    ...session,
    endReason: reason,
    // If converging, make sure the flag is set
    converged: reason === "converged" ? true : session.converged,
    convergedAt:
      reason === "converged" && !session.convergedAt
        ? (new Date().toISOString() as ISODateString)
        : session.convergedAt,
  };
}

// =============================================================================
// SESSION QUERIES
// =============================================================================

/**
 * Get the current Overwatch Score
 *
 * @param session - The overwatch session
 * @returns Current OS value
 */
export function getCurrentScore(session: OverwatchSession): number {
  return session.currentScore;
}

/**
 * Get the remaining score before convergence
 *
 * @param session - The overwatch session
 * @returns Points remaining until threshold
 */
export function getScoreUntilConvergence(session: OverwatchSession): number {
  return Math.max(0, session.threshold - session.currentScore);
}

/**
 * Get the convergence progress as a percentage
 *
 * @param session - The overwatch session
 * @returns Percentage (0-100) toward convergence
 */
export function getConvergenceProgress(session: OverwatchSession): number {
  return Math.min((session.currentScore / session.threshold) * 100, 100);
}

/**
 * Check if the session has converged
 *
 * @param session - The overwatch session
 * @returns True if convergence has occurred
 */
export function hasConverged(session: OverwatchSession): boolean {
  return session.converged;
}

/**
 * Get the session duration in milliseconds
 *
 * @param session - The overwatch session
 * @returns Duration in ms (0 if session not started)
 */
export function getSessionDuration(session: OverwatchSession): number {
  const startTime = new Date(session.startedAt).getTime();
  const endTime = session.convergedAt
    ? new Date(session.convergedAt).getTime()
    : Date.now();
  return endTime - startTime;
}

/**
 * Get all events in the session
 *
 * @param session - The overwatch session
 * @returns Array of all OS events
 */
export function getSessionEvents(session: OverwatchSession): OverwatchEvent[] {
  return [...session.events];
}

/**
 * Get the last event in the session
 *
 * @param session - The overwatch session
 * @returns Most recent event, or null if none
 */
export function getLastEvent(session: OverwatchSession): OverwatchEvent | null {
  if (session.events.length === 0) {
    return null;
  }
  return session.events[session.events.length - 1];
}

// =============================================================================
// SESSION STATISTICS
// =============================================================================

/**
 * Statistics about an overwatch session
 */
export interface OverwatchSessionStats {
  totalEvents: number;
  totalScoreAccumulated: number;
  averageScorePerEvent: number;
  highestSingleIncrease: number;
  timeToConvergence?: number; // ms, only if converged
  eventsByAction: Record<string, number>;
}

/**
 * Calculate statistics for an overwatch session
 *
 * @param session - The overwatch session
 * @returns Session statistics
 */
export function calculateSessionStats(
  session: OverwatchSession
): OverwatchSessionStats {
  const events = session.events;

  if (events.length === 0) {
    return {
      totalEvents: 0,
      totalScoreAccumulated: 0,
      averageScorePerEvent: 0,
      highestSingleIncrease: 0,
      eventsByAction: {},
    };
  }

  const totalScore = events.reduce((sum, e) => sum + e.scoreAdded, 0);
  const maxIncrease = Math.max(...events.map((e) => e.scoreAdded));

  // Count events by action type
  const eventsByAction: Record<string, number> = {};
  for (const event of events) {
    eventsByAction[event.action] = (eventsByAction[event.action] ?? 0) + 1;
  }

  const stats: OverwatchSessionStats = {
    totalEvents: events.length,
    totalScoreAccumulated: totalScore,
    averageScorePerEvent: totalScore / events.length,
    highestSingleIncrease: maxIncrease,
    eventsByAction,
  };

  // Add time to convergence if session converged
  if (session.converged && session.convergedAt) {
    const startTime = new Date(session.startedAt).getTime();
    const convergeTime = new Date(session.convergedAt).getTime();
    stats.timeToConvergence = convergeTime - startTime;
  }

  return stats;
}

// =============================================================================
// AUDIT & EXPORT
// =============================================================================

/**
 * Format session for display/logging
 *
 * @param session - The overwatch session
 * @returns Formatted session summary
 */
export function formatSessionSummary(session: OverwatchSession): string {
  const stats = calculateSessionStats(session);
  const status = session.converged ? "CONVERGED" : "Active";
  const duration = Math.floor(getSessionDuration(session) / 60000);

  let summary = `=== Overwatch Session ${session.sessionId} ===\n`;
  summary += `Status: ${status}\n`;
  summary += `Character: ${session.characterId}\n`;
  summary += `Duration: ${duration} minutes\n`;
  summary += `Current OS: ${session.currentScore}/${session.threshold}\n`;
  summary += `Events: ${stats.totalEvents}\n`;

  if (session.converged) {
    summary += `Converged at: ${session.convergedAt}\n`;
  }

  if (session.endReason) {
    summary += `End reason: ${session.endReason}\n`;
  }

  summary += `\n--- Event Log ---\n`;
  for (const event of session.events) {
    const time = new Date(event.timestamp).toLocaleTimeString();
    summary += `[${time}] ${event.action}: +${event.scoreAdded} (Total: ${event.totalScore})`;
    if (event.triggeredConvergence) {
      summary += " ** CONVERGENCE **";
    }
    summary += "\n";
  }

  return summary;
}

/**
 * Export session data for external storage
 *
 * @param session - The overwatch session
 * @returns Serializable session data
 */
export function exportSession(session: OverwatchSession): string {
  return JSON.stringify(session, null, 2);
}

/**
 * Import session data from external storage
 *
 * @param data - JSON string of session data
 * @returns Parsed overwatch session
 * @throws Error if data is invalid
 */
export function importSession(data: string): OverwatchSession {
  const parsed = JSON.parse(data) as OverwatchSession;

  // Validate required fields
  if (!parsed.sessionId || !parsed.characterId || !parsed.startedAt) {
    throw new Error("Invalid session data: missing required fields");
  }

  return parsed;
}

// =============================================================================
// SESSION COLLECTION MANAGEMENT
// =============================================================================

/**
 * Collection of active overwatch sessions
 */
export interface OverwatchSessionCollection {
  sessions: Map<string, OverwatchSession>;
}

/**
 * Create a new session collection
 */
export function createSessionCollection(): OverwatchSessionCollection {
  return {
    sessions: new Map(),
  };
}

/**
 * Add a session to the collection
 *
 * @param collection - The session collection
 * @param session - Session to add
 * @returns Updated collection
 */
export function addSessionToCollection(
  collection: OverwatchSessionCollection,
  session: OverwatchSession
): OverwatchSessionCollection {
  const newSessions = new Map(collection.sessions);
  newSessions.set(session.sessionId, session);
  return { sessions: newSessions };
}

/**
 * Update a session in the collection
 *
 * @param collection - The session collection
 * @param session - Updated session
 * @returns Updated collection
 */
export function updateSessionInCollection(
  collection: OverwatchSessionCollection,
  session: OverwatchSession
): OverwatchSessionCollection {
  if (!collection.sessions.has(session.sessionId)) {
    return collection;
  }

  const newSessions = new Map(collection.sessions);
  newSessions.set(session.sessionId, session);
  return { sessions: newSessions };
}

/**
 * Get a session by ID
 *
 * @param collection - The session collection
 * @param sessionId - Session ID to find
 * @returns The session or undefined
 */
export function getSessionById(
  collection: OverwatchSessionCollection,
  sessionId: string
): OverwatchSession | undefined {
  return collection.sessions.get(sessionId);
}

/**
 * Get a session by character ID
 *
 * Returns the active (non-converged, no end reason) session for a character.
 *
 * @param collection - The session collection
 * @param characterId - Character ID to find
 * @returns The active session or undefined
 */
export function getActiveSessionForCharacter(
  collection: OverwatchSessionCollection,
  characterId: ID
): OverwatchSession | undefined {
  for (const session of collection.sessions.values()) {
    if (
      session.characterId === characterId &&
      !session.converged &&
      !session.endReason
    ) {
      return session;
    }
  }
  return undefined;
}

/**
 * Remove a session from the collection
 *
 * @param collection - The session collection
 * @param sessionId - Session ID to remove
 * @returns Updated collection
 */
export function removeSessionFromCollection(
  collection: OverwatchSessionCollection,
  sessionId: string
): OverwatchSessionCollection {
  const newSessions = new Map(collection.sessions);
  newSessions.delete(sessionId);
  return { sessions: newSessions };
}

/**
 * Get all completed sessions (converged or ended)
 *
 * @param collection - The session collection
 * @returns Array of completed sessions
 */
export function getCompletedSessions(
  collection: OverwatchSessionCollection
): OverwatchSession[] {
  const completed: OverwatchSession[] = [];

  for (const session of collection.sessions.values()) {
    if (session.converged || session.endReason) {
      completed.push(session);
    }
  }

  return completed;
}
