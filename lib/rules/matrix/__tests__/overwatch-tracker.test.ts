import { describe, it, expect } from "vitest";
import {
  startOverwatchSession,
  recordOverwatchEvent,
  endOverwatchSession,
  getCurrentScore,
  getScoreUntilConvergence,
  getConvergenceProgress,
  hasConverged,
  getSessionDuration,
  getSessionEvents,
  getLastEvent,
  calculateSessionStats,
  formatSessionSummary,
  exportSession,
  importSession,
  createSessionCollection,
  addSessionToCollection,
  updateSessionInCollection,
  getSessionById,
  getActiveSessionForCharacter,
  removeSessionFromCollection,
  getCompletedSessions,
} from "../overwatch-tracker";
import type { OverwatchSession } from "@/lib/types/matrix";
import type { ISODateString } from "@/lib/types";
import { OVERWATCH_THRESHOLD } from "@/lib/types/matrix";

// =============================================================================
// MOCK HELPERS
// =============================================================================

function createMockSession(overrides?: Partial<OverwatchSession>): OverwatchSession {
  return {
    sessionId: `os-${Date.now()}`,
    characterId: "char-123",
    startedAt: new Date().toISOString() as ISODateString,
    currentScore: 0,
    threshold: OVERWATCH_THRESHOLD,
    events: [],
    converged: false,
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("overwatch-tracker", () => {
  describe("startOverwatchSession", () => {
    it("should create a new session with default threshold", () => {
      const session = startOverwatchSession("char-123");

      expect(session.characterId).toBe("char-123");
      expect(session.currentScore).toBe(0);
      expect(session.threshold).toBe(OVERWATCH_THRESHOLD);
      expect(session.events).toEqual([]);
      expect(session.converged).toBe(false);
      expect(session.sessionId).toBeDefined();
      expect(session.startedAt).toBeDefined();
    });

    it("should accept custom threshold", () => {
      const session = startOverwatchSession("char-123", 50);

      expect(session.threshold).toBe(50);
    });

    it("should generate unique session IDs", () => {
      const session1 = startOverwatchSession("char-123");
      const session2 = startOverwatchSession("char-123");

      expect(session1.sessionId).not.toBe(session2.sessionId);
    });
  });

  describe("recordOverwatchEvent", () => {
    it("should add event and update score", () => {
      const session = createMockSession({ currentScore: 5 });

      const updated = recordOverwatchEvent(session, "Hack on the Fly", 7);

      expect(updated.currentScore).toBe(12);
      expect(updated.events).toHaveLength(1);
      expect(updated.events[0].action).toBe("Hack on the Fly");
      expect(updated.events[0].scoreAdded).toBe(7);
      expect(updated.events[0].totalScore).toBe(12);
    });

    it("should not record events after convergence", () => {
      const session = createMockSession({ converged: true, currentScore: 45 });

      const updated = recordOverwatchEvent(session, "Action", 5);

      expect(updated.events).toHaveLength(0);
      expect(updated.currentScore).toBe(45);
    });

    it("should set convergence when threshold reached", () => {
      const session = createMockSession({ currentScore: 35, threshold: 40 });

      const updated = recordOverwatchEvent(session, "Brute Force", 7);

      expect(updated.converged).toBe(true);
      expect(updated.convergedAt).toBeDefined();
      expect(updated.events[0].triggeredConvergence).toBe(true);
    });

    it("should not mutate original session", () => {
      const session = createMockSession();

      recordOverwatchEvent(session, "Action", 5);

      expect(session.currentScore).toBe(0);
      expect(session.events).toHaveLength(0);
    });

    it("should preserve existing events", () => {
      const session = createMockSession({
        events: [
          {
            timestamp: "2024-01-01T10:00:00.000Z" as ISODateString,
            action: "Previous Action",
            scoreAdded: 5,
            totalScore: 5,
          },
        ],
        currentScore: 5,
      });

      const updated = recordOverwatchEvent(session, "New Action", 3);

      expect(updated.events).toHaveLength(2);
      expect(updated.events[0].action).toBe("Previous Action");
      expect(updated.events[1].action).toBe("New Action");
    });
  });

  describe("endOverwatchSession", () => {
    it("should set end reason to jacked_out", () => {
      const session = createMockSession();

      const ended = endOverwatchSession(session, "jacked_out");

      expect(ended.endReason).toBe("jacked_out");
    });

    it("should set converged flag when ending with converged reason", () => {
      const session = createMockSession({ converged: false });

      const ended = endOverwatchSession(session, "converged");

      expect(ended.converged).toBe(true);
      expect(ended.convergedAt).toBeDefined();
    });

    it("should preserve existing convergedAt when already set", () => {
      const existingConvergedAt = "2024-01-01T10:00:00.000Z" as ISODateString;
      const session = createMockSession({
        converged: true,
        convergedAt: existingConvergedAt,
      });

      const ended = endOverwatchSession(session, "converged");

      expect(ended.convergedAt).toBe(existingConvergedAt);
    });

    it("should support all end reasons", () => {
      const reasons = ["jacked_out", "converged", "session_ended", "link_locked"] as const;

      for (const reason of reasons) {
        const session = createMockSession();
        const ended = endOverwatchSession(session, reason);
        expect(ended.endReason).toBe(reason);
      }
    });
  });

  describe("getCurrentScore", () => {
    it("should return current score", () => {
      const session = createMockSession({ currentScore: 25 });

      expect(getCurrentScore(session)).toBe(25);
    });
  });

  describe("getScoreUntilConvergence", () => {
    it("should return remaining score to threshold", () => {
      const session = createMockSession({ currentScore: 15, threshold: 40 });

      expect(getScoreUntilConvergence(session)).toBe(25);
    });

    it("should return 0 when at or above threshold", () => {
      const session = createMockSession({ currentScore: 45, threshold: 40 });

      expect(getScoreUntilConvergence(session)).toBe(0);
    });
  });

  describe("getConvergenceProgress", () => {
    it("should return percentage of threshold reached", () => {
      const session = createMockSession({ currentScore: 20, threshold: 40 });

      expect(getConvergenceProgress(session)).toBe(50);
    });

    it("should cap at 100%", () => {
      const session = createMockSession({ currentScore: 50, threshold: 40 });

      expect(getConvergenceProgress(session)).toBe(100);
    });

    it("should return 0 when score is 0", () => {
      const session = createMockSession({ currentScore: 0 });

      expect(getConvergenceProgress(session)).toBe(0);
    });
  });

  describe("hasConverged", () => {
    it("should return true when converged", () => {
      const session = createMockSession({ converged: true });

      expect(hasConverged(session)).toBe(true);
    });

    it("should return false when not converged", () => {
      const session = createMockSession({ converged: false });

      expect(hasConverged(session)).toBe(false);
    });
  });

  describe("getSessionDuration", () => {
    it("should calculate duration from start to now", () => {
      const startTime = new Date(Date.now() - 60000); // 1 minute ago
      const session = createMockSession({
        startedAt: startTime.toISOString() as ISODateString,
      });

      const duration = getSessionDuration(session);

      // Allow some tolerance for test execution time
      expect(duration).toBeGreaterThanOrEqual(59000);
      expect(duration).toBeLessThan(62000);
    });

    it("should calculate duration from start to convergedAt when converged", () => {
      const startTime = new Date("2024-01-01T10:00:00.000Z");
      const convergedTime = new Date("2024-01-01T10:05:00.000Z"); // 5 minutes later
      const session = createMockSession({
        startedAt: startTime.toISOString() as ISODateString,
        converged: true,
        convergedAt: convergedTime.toISOString() as ISODateString,
      });

      const duration = getSessionDuration(session);

      expect(duration).toBe(300000); // 5 minutes in ms
    });
  });

  describe("getSessionEvents", () => {
    it("should return copy of events array", () => {
      const session = createMockSession({
        events: [
          {
            timestamp: "2024-01-01T10:00:00.000Z" as ISODateString,
            action: "Test",
            scoreAdded: 5,
            totalScore: 5,
          },
        ],
      });

      const events = getSessionEvents(session);
      events.push({
        timestamp: "2024-01-01T10:01:00.000Z" as ISODateString,
        action: "New",
        scoreAdded: 3,
        totalScore: 8,
      });

      expect(session.events).toHaveLength(1);
    });

    it("should return empty array when no events", () => {
      const session = createMockSession();

      expect(getSessionEvents(session)).toEqual([]);
    });
  });

  describe("getLastEvent", () => {
    it("should return last event", () => {
      const session = createMockSession({
        events: [
          {
            timestamp: "2024-01-01T10:00:00.000Z" as ISODateString,
            action: "First",
            scoreAdded: 5,
            totalScore: 5,
          },
          {
            timestamp: "2024-01-01T10:01:00.000Z" as ISODateString,
            action: "Last",
            scoreAdded: 3,
            totalScore: 8,
          },
        ],
      });

      const lastEvent = getLastEvent(session);

      expect(lastEvent?.action).toBe("Last");
    });

    it("should return null when no events", () => {
      const session = createMockSession();

      expect(getLastEvent(session)).toBeNull();
    });
  });

  describe("calculateSessionStats", () => {
    it("should return zero stats for empty session", () => {
      const session = createMockSession();

      const stats = calculateSessionStats(session);

      expect(stats.totalEvents).toBe(0);
      expect(stats.totalScoreAccumulated).toBe(0);
      expect(stats.averageScorePerEvent).toBe(0);
      expect(stats.highestSingleIncrease).toBe(0);
    });

    it("should calculate correct statistics", () => {
      const session = createMockSession({
        events: [
          {
            timestamp: "2024-01-01T10:00:00.000Z" as ISODateString,
            action: "Hack on the Fly",
            scoreAdded: 5,
            totalScore: 5,
          },
          {
            timestamp: "2024-01-01T10:01:00.000Z" as ISODateString,
            action: "Brute Force",
            scoreAdded: 10,
            totalScore: 15,
          },
          {
            timestamp: "2024-01-01T10:02:00.000Z" as ISODateString,
            action: "Hack on the Fly",
            scoreAdded: 3,
            totalScore: 18,
          },
        ],
      });

      const stats = calculateSessionStats(session);

      expect(stats.totalEvents).toBe(3);
      expect(stats.totalScoreAccumulated).toBe(18);
      expect(stats.averageScorePerEvent).toBe(6);
      expect(stats.highestSingleIncrease).toBe(10);
    });

    it("should count events by action type", () => {
      const session = createMockSession({
        events: [
          {
            timestamp: "2024-01-01T10:00:00.000Z" as ISODateString,
            action: "Hack on the Fly",
            scoreAdded: 5,
            totalScore: 5,
          },
          {
            timestamp: "2024-01-01T10:01:00.000Z" as ISODateString,
            action: "Hack on the Fly",
            scoreAdded: 7,
            totalScore: 12,
          },
          {
            timestamp: "2024-01-01T10:02:00.000Z" as ISODateString,
            action: "Brute Force",
            scoreAdded: 8,
            totalScore: 20,
          },
        ],
      });

      const stats = calculateSessionStats(session);

      expect(stats.eventsByAction["Hack on the Fly"]).toBe(2);
      expect(stats.eventsByAction["Brute Force"]).toBe(1);
    });

    it("should include time to convergence when converged", () => {
      const session = createMockSession({
        startedAt: "2024-01-01T10:00:00.000Z" as ISODateString,
        converged: true,
        convergedAt: "2024-01-01T10:05:00.000Z" as ISODateString,
        events: [
          {
            timestamp: "2024-01-01T10:05:00.000Z" as ISODateString,
            action: "Final Action",
            scoreAdded: 10,
            totalScore: 40,
            triggeredConvergence: true,
          },
        ],
      });

      const stats = calculateSessionStats(session);

      expect(stats.timeToConvergence).toBe(300000); // 5 minutes
    });
  });

  describe("formatSessionSummary", () => {
    it("should include session ID and status", () => {
      const session = createMockSession({ sessionId: "os-test-123" });

      const summary = formatSessionSummary(session);

      expect(summary).toContain("os-test-123");
      expect(summary).toContain("Active");
    });

    it("should show CONVERGED status when converged", () => {
      const session = createMockSession({ converged: true });

      const summary = formatSessionSummary(session);

      expect(summary).toContain("CONVERGED");
    });

    it("should include character ID", () => {
      const session = createMockSession({ characterId: "char-456" });

      const summary = formatSessionSummary(session);

      expect(summary).toContain("char-456");
    });

    it("should include OS score", () => {
      const session = createMockSession({ currentScore: 25, threshold: 40 });

      const summary = formatSessionSummary(session);

      expect(summary).toContain("25/40");
    });

    it("should include event log", () => {
      const session = createMockSession({
        events: [
          {
            timestamp: "2024-01-01T10:00:00.000Z" as ISODateString,
            action: "Brute Force",
            scoreAdded: 7,
            totalScore: 7,
          },
        ],
      });

      const summary = formatSessionSummary(session);

      expect(summary).toContain("Brute Force");
      expect(summary).toContain("+7");
    });

    it("should mark convergence event", () => {
      const session = createMockSession({
        events: [
          {
            timestamp: "2024-01-01T10:00:00.000Z" as ISODateString,
            action: "Final Hack",
            scoreAdded: 10,
            totalScore: 40,
            triggeredConvergence: true,
          },
        ],
      });

      const summary = formatSessionSummary(session);

      expect(summary).toContain("CONVERGENCE");
    });
  });

  describe("exportSession / importSession", () => {
    it("should round-trip session data through JSON", () => {
      const session = createMockSession({
        sessionId: "os-export-test",
        characterId: "char-export",
        currentScore: 25,
        events: [
          {
            timestamp: "2024-01-01T10:00:00.000Z" as ISODateString,
            action: "Test Action",
            scoreAdded: 5,
            totalScore: 5,
          },
        ],
      });

      const exported = exportSession(session);
      const imported = importSession(exported);

      expect(imported.sessionId).toBe(session.sessionId);
      expect(imported.characterId).toBe(session.characterId);
      expect(imported.currentScore).toBe(session.currentScore);
      expect(imported.events).toHaveLength(1);
    });

    it("should throw error for invalid data", () => {
      expect(() => importSession("{}")).toThrow("Invalid session data");
      expect(() => importSession('{"sessionId": "test"}')).toThrow();
    });

    it("should produce valid JSON", () => {
      const session = createMockSession();

      const exported = exportSession(session);

      expect(() => JSON.parse(exported)).not.toThrow();
    });
  });

  describe("createSessionCollection", () => {
    it("should create empty collection", () => {
      const collection = createSessionCollection();

      expect(collection.sessions.size).toBe(0);
    });
  });

  describe("addSessionToCollection", () => {
    it("should add session to collection", () => {
      let collection = createSessionCollection();
      const session = createMockSession({ sessionId: "os-add-test" });

      collection = addSessionToCollection(collection, session);

      expect(collection.sessions.size).toBe(1);
      expect(collection.sessions.get("os-add-test")).toBeDefined();
    });

    it("should not mutate original collection", () => {
      const collection = createSessionCollection();
      const session = createMockSession();

      addSessionToCollection(collection, session);

      expect(collection.sessions.size).toBe(0);
    });
  });

  describe("updateSessionInCollection", () => {
    it("should update existing session", () => {
      const session = createMockSession({ sessionId: "os-update-test", currentScore: 10 });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, session);

      const updatedSession = { ...session, currentScore: 20 };
      collection = updateSessionInCollection(collection, updatedSession);

      const retrieved = collection.sessions.get("os-update-test");
      expect(retrieved?.currentScore).toBe(20);
    });

    it("should not add session if not found", () => {
      const collection = createSessionCollection();
      const session = createMockSession({ sessionId: "not-exists" });

      const updated = updateSessionInCollection(collection, session);

      expect(updated.sessions.size).toBe(0);
    });
  });

  describe("getSessionById", () => {
    it("should return session by ID", () => {
      const session = createMockSession({ sessionId: "os-get-test" });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, session);

      const retrieved = getSessionById(collection, "os-get-test");

      expect(retrieved).toBeDefined();
      expect(retrieved?.sessionId).toBe("os-get-test");
    });

    it("should return undefined for unknown ID", () => {
      const collection = createSessionCollection();

      expect(getSessionById(collection, "unknown")).toBeUndefined();
    });
  });

  describe("getActiveSessionForCharacter", () => {
    it("should return active session for character", () => {
      const activeSession = createMockSession({
        sessionId: "os-active",
        characterId: "char-123",
        converged: false,
      });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, activeSession);

      const retrieved = getActiveSessionForCharacter(collection, "char-123");

      expect(retrieved).toBeDefined();
      expect(retrieved?.sessionId).toBe("os-active");
    });

    it("should not return converged session", () => {
      const convergedSession = createMockSession({
        characterId: "char-123",
        converged: true,
      });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, convergedSession);

      expect(getActiveSessionForCharacter(collection, "char-123")).toBeUndefined();
    });

    it("should not return session with endReason", () => {
      const endedSession = createMockSession({
        characterId: "char-123",
        converged: false,
        endReason: "jacked_out",
      });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, endedSession);

      expect(getActiveSessionForCharacter(collection, "char-123")).toBeUndefined();
    });

    it("should return undefined for wrong character", () => {
      const session = createMockSession({ characterId: "char-123" });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, session);

      expect(getActiveSessionForCharacter(collection, "char-456")).toBeUndefined();
    });
  });

  describe("removeSessionFromCollection", () => {
    it("should remove session by ID", () => {
      const session = createMockSession({ sessionId: "os-remove-test" });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, session);

      collection = removeSessionFromCollection(collection, "os-remove-test");

      expect(collection.sessions.size).toBe(0);
    });

    it("should not fail when removing non-existent session", () => {
      const collection = createSessionCollection();

      const updated = removeSessionFromCollection(collection, "not-exists");

      expect(updated.sessions.size).toBe(0);
    });
  });

  describe("getCompletedSessions", () => {
    it("should return converged sessions", () => {
      const convergedSession = createMockSession({
        sessionId: "os-converged",
        converged: true,
      });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, convergedSession);

      const completed = getCompletedSessions(collection);

      expect(completed).toHaveLength(1);
      expect(completed[0].sessionId).toBe("os-converged");
    });

    it("should return sessions with endReason", () => {
      const endedSession = createMockSession({
        sessionId: "os-ended",
        converged: false,
        endReason: "jacked_out",
      });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, endedSession);

      const completed = getCompletedSessions(collection);

      expect(completed).toHaveLength(1);
    });

    it("should not return active sessions", () => {
      const activeSession = createMockSession({
        sessionId: "os-active",
        converged: false,
      });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, activeSession);

      const completed = getCompletedSessions(collection);

      expect(completed).toHaveLength(0);
    });

    it("should return multiple completed sessions", () => {
      const session1 = createMockSession({ sessionId: "os-1", converged: true });
      const session2 = createMockSession({ sessionId: "os-2", endReason: "session_ended" });
      const session3 = createMockSession({ sessionId: "os-3", converged: false });
      let collection = createSessionCollection();
      collection = addSessionToCollection(collection, session1);
      collection = addSessionToCollection(collection, session2);
      collection = addSessionToCollection(collection, session3);

      const completed = getCompletedSessions(collection);

      expect(completed).toHaveLength(2);
    });
  });
});
