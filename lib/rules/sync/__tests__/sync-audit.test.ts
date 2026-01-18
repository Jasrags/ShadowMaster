/**
 * Tests for sync audit trail module
 *
 * Tests all exported functions for sync event logging and querying.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSyncAuditEntry,
  recordDriftDetection,
  recordMigrationStart,
  recordMigrationComplete,
  recordMigrationRollback,
  recordLegalityChange,
  recordManualResync,
  getSyncAuditSummary,
  getRecentSyncEvents,
  formatSyncEvent,
} from "../sync-audit";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import type {
  DriftReport,
  MigrationPlan,
  MigrationResult,
  RulesetVersionRef,
  SyncAuditEntry,
  Character,
} from "@/lib/types";

// Mock uuid for predictable IDs
vi.mock("uuid", () => ({
  v4: vi.fn(() => "mock-uuid-123"),
}));

// Mock the storage module
vi.mock("@/lib/storage/characters", () => ({
  recordSyncEvent: vi.fn().mockResolvedValue(undefined),
}));

import { recordSyncEvent } from "@/lib/storage/characters";

// =============================================================================
// MOCK FACTORIES
// =============================================================================

function createMockVersionRef(overrides?: Partial<RulesetVersionRef>): RulesetVersionRef {
  return {
    editionCode: "sr5",
    editionVersion: "1.0.0",
    bookVersions: { core: "1.0.0" },
    snapshotId: "snapshot-123",
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

function createMockDriftReport(overrides?: Partial<DriftReport>): DriftReport {
  return {
    id: "drift-report-123",
    characterId: "char-123",
    generatedAt: "2024-01-01T00:00:00Z",
    currentVersion: createMockVersionRef({ snapshotId: "old-snapshot" }),
    targetVersion: createMockVersionRef({ snapshotId: "new-snapshot" }),
    overallSeverity: "non-breaking",
    changes: [],
    recommendations: [],
    ...overrides,
  };
}

function createMockMigrationPlan(overrides?: Partial<MigrationPlan>): MigrationPlan {
  return {
    id: "plan-123",
    characterId: "char-123",
    sourceVersion: createMockVersionRef({ snapshotId: "old-snapshot" }),
    targetVersion: createMockVersionRef({ snapshotId: "new-snapshot" }),
    steps: [],
    isComplete: true,
    estimatedKarmaDelta: 0,
    ...overrides,
  };
}

function createMockMigrationResult(overrides?: Partial<MigrationResult>): MigrationResult {
  return {
    success: true,
    appliedSteps: [],
    rollbackAvailable: true,
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("Sync Audit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // createSyncAuditEntry
  // ===========================================================================

  describe("createSyncAuditEntry", () => {
    it("should create audit entry with required fields", () => {
      const entry = createSyncAuditEntry({
        eventType: "drift_detected",
        sourceVersion: createMockVersionRef(),
      });

      expect(entry.id).toBe("mock-uuid-123");
      expect(entry.timestamp).toBeDefined();
      expect(entry.eventType).toBe("drift_detected");
      expect(entry.sourceVersion).toBeDefined();
      expect(entry.changes).toEqual([]);
      expect(entry.actor.type).toBe("system");
    });

    it("should set actor type to user when userId provided", () => {
      const entry = createSyncAuditEntry({
        eventType: "manual_resync",
        sourceVersion: createMockVersionRef(),
        userId: "user-123",
      });

      expect(entry.actor.type).toBe("user");
      expect(entry.actor.userId).toBe("user-123");
    });

    it("should include target version when provided", () => {
      const targetVersion = createMockVersionRef({ snapshotId: "new-snapshot" });
      const entry = createSyncAuditEntry({
        eventType: "migration_completed",
        sourceVersion: createMockVersionRef(),
        targetVersion,
      });

      expect(entry.targetVersion).toEqual(targetVersion);
    });

    it("should include changes when provided", () => {
      const changes = [
        {
          type: "modified" as const,
          module: "skills" as const,
          itemId: "skill-123",
          before: { rating: 3 },
          after: { rating: 4 },
        },
      ];

      const entry = createSyncAuditEntry({
        eventType: "migration_completed",
        sourceVersion: createMockVersionRef(),
        changes,
      });

      expect(entry.changes).toEqual(changes);
    });

    it("should use provided description", () => {
      const entry = createSyncAuditEntry({
        eventType: "drift_detected",
        sourceVersion: createMockVersionRef(),
        description: "Custom description",
      });

      expect(entry.actor.description).toBe("Custom description");
    });

    it("should use default description when not provided", () => {
      const entry = createSyncAuditEntry({
        eventType: "drift_detected",
        sourceVersion: createMockVersionRef(),
      });

      expect(entry.actor.description).toBe("System detected drift from ruleset");
    });

    it("should generate correct default descriptions for each event type", () => {
      const eventTypes: Array<{
        type:
          | "drift_detected"
          | "migration_started"
          | "migration_completed"
          | "migration_rolled_back"
          | "legality_changed"
          | "manual_resync";
        expected: string;
      }> = [
        { type: "drift_detected", expected: "System detected drift from ruleset" },
        { type: "migration_started", expected: "Migration initiated" },
        { type: "migration_completed", expected: "Migration completed successfully" },
        { type: "migration_rolled_back", expected: "Migration was rolled back" },
        { type: "legality_changed", expected: "Character legality status changed" },
        { type: "manual_resync", expected: "Manual resync triggered" },
      ];

      for (const { type, expected } of eventTypes) {
        const entry = createSyncAuditEntry({
          eventType: type,
          sourceVersion: createMockVersionRef(),
        });
        expect(entry.actor.description).toBe(expected);
      }
    });
  });

  // ===========================================================================
  // recordDriftDetection
  // ===========================================================================

  describe("recordDriftDetection", () => {
    it("should record drift detection event", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const report = createMockDriftReport({
        changes: [
          {
            id: "change-1",
            module: "skills",
            changeType: "modified",
            severity: "non-breaking",
            affectedItems: [
              { itemId: "skill-1", itemType: "skills", previousValue: 3, currentValue: 4 },
            ],
            description: "Skill modified",
          },
        ],
        overallSeverity: "non-breaking",
      });

      await recordDriftDetection("user-123", character, report);

      expect(recordSyncEvent).toHaveBeenCalledWith(
        "user-123",
        "char-123",
        expect.objectContaining({
          eventType: "drift_detected",
        })
      );
    });

    it("should convert drift changes to applied changes", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const report = createMockDriftReport({
        changes: [
          {
            id: "change-1",
            module: "skills",
            changeType: "modified",
            severity: "breaking",
            affectedItems: [
              { itemId: "firearms", itemType: "skills", previousValue: 5, currentValue: null },
            ],
            description: "Skill removed",
          },
        ],
      });

      await recordDriftDetection("user-123", character, report);

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.changes).toHaveLength(1);
      expect(entry.changes[0].type).toBe("modified");
      expect(entry.changes[0].module).toBe("skills");
    });

    it("should include severity in description", async () => {
      const character = createMockCharacter();
      const report = createMockDriftReport({
        changes: [
          {
            id: "change-1",
            module: "skills",
            changeType: "removed",
            severity: "breaking",
            affectedItems: [{ itemId: "skill-1", itemType: "skills" }],
            description: "Skill removed",
          },
        ],
        overallSeverity: "breaking",
      });

      await recordDriftDetection("user-123", character, report);

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.actor.description).toContain("breaking");
    });
  });

  // ===========================================================================
  // recordMigrationStart
  // ===========================================================================

  describe("recordMigrationStart", () => {
    it("should record migration start event", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan({
        steps: [{ changeId: "change-1", action: "update", before: "old", after: "new" }],
      });

      await recordMigrationStart("user-123", character, plan);

      expect(recordSyncEvent).toHaveBeenCalledWith(
        "user-123",
        "char-123",
        expect.objectContaining({
          eventType: "migration_started",
        })
      );
    });

    it("should include step count in description", async () => {
      const character = createMockCharacter();
      const plan = createMockMigrationPlan({
        steps: [
          { changeId: "c1", action: "update", before: "a", after: "b" },
          { changeId: "c2", action: "remove", before: "x", after: null },
        ],
      });

      await recordMigrationStart("user-123", character, plan);

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.actor.description).toContain("2 step(s)");
    });

    it("should set userId as actor", async () => {
      const character = createMockCharacter();
      const plan = createMockMigrationPlan();

      await recordMigrationStart("user-456", character, plan);

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.actor.userId).toBe("user-456");
    });
  });

  // ===========================================================================
  // recordMigrationComplete
  // ===========================================================================

  describe("recordMigrationComplete", () => {
    it("should record migration complete event", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan();
      const result = createMockMigrationResult({
        appliedSteps: [{ changeId: "c1", action: "update", before: "a", after: "b" }],
      });

      await recordMigrationComplete("user-123", character, plan, result);

      expect(recordSyncEvent).toHaveBeenCalledWith(
        "user-123",
        "char-123",
        expect.objectContaining({
          eventType: "migration_completed",
        })
      );
    });

    it("should convert applied steps to changes", async () => {
      const character = createMockCharacter();
      const plan = createMockMigrationPlan();
      const result = createMockMigrationResult({
        appliedSteps: [
          { changeId: "c1", action: "update", before: { val: 1 }, after: { val: 2 } },
          { changeId: "c2", action: "remove", before: "x", after: null },
        ],
      });

      await recordMigrationComplete("user-123", character, plan, result);

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.changes).toHaveLength(2);
    });

    it("should include applied step count in description", async () => {
      const character = createMockCharacter();
      const plan = createMockMigrationPlan();
      const result = createMockMigrationResult({
        appliedSteps: [
          { changeId: "c1", action: "update", before: "a", after: "b" },
          { changeId: "c2", action: "update", before: "c", after: "d" },
          { changeId: "c3", action: "update", before: "e", after: "f" },
        ],
      });

      await recordMigrationComplete("user-123", character, plan, result);

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.actor.description).toContain("3 step(s)");
    });
  });

  // ===========================================================================
  // recordMigrationRollback
  // ===========================================================================

  describe("recordMigrationRollback", () => {
    it("should record migration rollback event", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan();

      await recordMigrationRollback("user-123", character, plan, "Error occurred");

      expect(recordSyncEvent).toHaveBeenCalledWith(
        "user-123",
        "char-123",
        expect.objectContaining({
          eventType: "migration_rolled_back",
        })
      );
    });

    it("should swap source and target versions for rollback", async () => {
      const sourceVersion = createMockVersionRef({ snapshotId: "source-snap" });
      const targetVersion = createMockVersionRef({ snapshotId: "target-snap" });
      const character = createMockCharacter();
      const plan = createMockMigrationPlan({ sourceVersion, targetVersion });

      await recordMigrationRollback("user-123", character, plan, "Failed");

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      // Rollback: FROM target back TO source
      expect(entry.sourceVersion.snapshotId).toBe("target-snap");
      expect(entry.targetVersion?.snapshotId).toBe("source-snap");
    });

    it("should include reason in description", async () => {
      const character = createMockCharacter();
      const plan = createMockMigrationPlan();

      await recordMigrationRollback("user-123", character, plan, "Validation failed");

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.actor.description).toContain("Validation failed");
    });

    it("should have empty changes array", async () => {
      const character = createMockCharacter();
      const plan = createMockMigrationPlan();

      await recordMigrationRollback("user-123", character, plan, "Error");

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.changes).toEqual([]);
    });
  });

  // ===========================================================================
  // recordLegalityChange
  // ===========================================================================

  describe("recordLegalityChange", () => {
    it("should record legality change event", async () => {
      const character = createMockCharacter({ id: "char-123" });

      await recordLegalityChange("user-123", character, "rules-legal", "legacy", "Ruleset changed");

      expect(recordSyncEvent).toHaveBeenCalledWith(
        "user-123",
        "char-123",
        expect.objectContaining({
          eventType: "legality_changed",
        })
      );
    });

    it("should include status change in changes array", async () => {
      const character = createMockCharacter();

      await recordLegalityChange("user-123", character, "rules-legal", "invalid", "Missing skill");

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.changes).toHaveLength(1);
      expect(entry.changes[0].before).toBe("rules-legal");
      expect(entry.changes[0].after).toBe("invalid");
      expect(entry.changes[0].itemId).toBe("legalityStatus");
    });

    it("should include previous and new status in description", async () => {
      const character = createMockCharacter();

      await recordLegalityChange(
        "user-123",
        character,
        "draft",
        "rules-legal",
        "Creation complete"
      );

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.actor.description).toContain("draft");
      expect(entry.actor.description).toContain("rules-legal");
    });

    it("should use character rulesetVersion when available", async () => {
      const character = createMockCharacter({
        rulesetVersion: createMockVersionRef({ snapshotId: "char-snapshot" }),
      });

      await recordLegalityChange("user-123", character, "legal", "invalid", "Test");

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.sourceVersion.snapshotId).toBe("char-snapshot");
    });

    it("should construct version ref when rulesetVersion not available", async () => {
      const character = createMockCharacter({
        editionCode: "sr6",
        rulesetSnapshotId: "fallback-snapshot",
        createdAt: "2024-06-01T00:00:00Z",
      });
      delete (character as Partial<Character>).rulesetVersion;

      await recordLegalityChange("user-123", character, "a", "b", "Test");

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.sourceVersion.editionCode).toBe("sr6");
      expect(entry.sourceVersion.snapshotId).toBe("fallback-snapshot");
    });
  });

  // ===========================================================================
  // recordManualResync
  // ===========================================================================

  describe("recordManualResync", () => {
    it("should record manual resync event", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const newVersion = createMockVersionRef({ snapshotId: "new-snapshot" });

      await recordManualResync("user-123", character, newVersion);

      expect(recordSyncEvent).toHaveBeenCalledWith(
        "user-123",
        "char-123",
        expect.objectContaining({
          eventType: "manual_resync",
        })
      );
    });

    it("should include user ID as actor", async () => {
      const character = createMockCharacter();
      const newVersion = createMockVersionRef();

      await recordManualResync("user-789", character, newVersion);

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.actor.userId).toBe("user-789");
      expect(entry.actor.type).toBe("user");
    });

    it("should set target version to new version", async () => {
      const character = createMockCharacter();
      const newVersion = createMockVersionRef({ snapshotId: "latest-snapshot" });

      await recordManualResync("user-123", character, newVersion);

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.targetVersion?.snapshotId).toBe("latest-snapshot");
    });

    it("should have empty changes array", async () => {
      const character = createMockCharacter();
      const newVersion = createMockVersionRef();

      await recordManualResync("user-123", character, newVersion);

      const call = vi.mocked(recordSyncEvent).mock.calls[0];
      const entry = call[2] as SyncAuditEntry;
      expect(entry.changes).toEqual([]);
    });
  });

  // ===========================================================================
  // getSyncAuditSummary
  // ===========================================================================

  describe("getSyncAuditSummary", () => {
    it("should return empty summary for character without auditLog", () => {
      const character = createMockCharacter();
      delete (character as Partial<Character>).auditLog;

      const summary = getSyncAuditSummary(character);

      expect(summary.totalEvents).toBe(0);
      expect(summary.successfulMigrations).toBe(0);
      expect(summary.rolledBackMigrations).toBe(0);
    });

    it("should return empty summary for empty auditLog", () => {
      const character = createMockCharacter({ auditLog: [] });

      const summary = getSyncAuditSummary(character);

      expect(summary.totalEvents).toBe(0);
    });

    it("should count sync events by type", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "drift_detected",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "2",
            action: "drift_detected",
            timestamp: "2024-01-02T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "3",
            action: "migration_completed",
            timestamp: "2024-01-03T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
          {
            id: "4",
            action: "migration_rolled_back",
            timestamp: "2024-01-04T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
        ],
      });

      const summary = getSyncAuditSummary(character);

      expect(summary.eventsByType.drift_detected).toBe(2);
      expect(summary.eventsByType.migration_completed).toBe(1);
      expect(summary.eventsByType.migration_rolled_back).toBe(1);
      expect(summary.eventsByType.migration_started).toBe(0);
    });

    it("should exclude non-sync events", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "created",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
          {
            id: "2",
            action: "drift_detected",
            timestamp: "2024-01-02T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "3",
            action: "updated",
            timestamp: "2024-01-03T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
        ],
      });

      const summary = getSyncAuditSummary(character);

      expect(summary.totalEvents).toBe(1);
    });

    it("should find last drift check date", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "drift_detected",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "2",
            action: "drift_detected",
            timestamp: "2024-01-15T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "3",
            action: "drift_detected",
            timestamp: "2024-01-10T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
        ],
      });

      const summary = getSyncAuditSummary(character);

      expect(summary.lastDriftCheck).toBe("2024-01-15T00:00:00Z");
    });

    it("should find last migration date", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "migration_completed",
            timestamp: "2024-02-01T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
          {
            id: "2",
            action: "migration_completed",
            timestamp: "2024-03-01T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
        ],
      });

      const summary = getSyncAuditSummary(character);

      expect(summary.lastMigration).toBe("2024-03-01T00:00:00Z");
    });

    it("should return undefined for dates when no events exist", () => {
      const character = createMockCharacter({ auditLog: [] });

      const summary = getSyncAuditSummary(character);

      expect(summary.lastDriftCheck).toBeUndefined();
      expect(summary.lastMigration).toBeUndefined();
    });
  });

  // ===========================================================================
  // getRecentSyncEvents
  // ===========================================================================

  describe("getRecentSyncEvents", () => {
    it("should return empty array for character without auditLog", () => {
      const character = createMockCharacter();
      delete (character as Partial<Character>).auditLog;

      const events = getRecentSyncEvents(character);

      expect(events).toEqual([]);
    });

    it("should filter to only sync events", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "created",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
          {
            id: "2",
            action: "drift_detected",
            timestamp: "2024-01-02T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "3",
            action: "updated",
            timestamp: "2024-01-03T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
          {
            id: "4",
            action: "migration_completed",
            timestamp: "2024-01-04T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
        ],
      });

      const events = getRecentSyncEvents(character);

      expect(events).toHaveLength(2);
      expect(events.map((e) => e.eventType)).toEqual(["migration_completed", "drift_detected"]);
    });

    it("should sort by timestamp descending", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "drift_detected",
            timestamp: "2024-01-15T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "2",
            action: "drift_detected",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "3",
            action: "drift_detected",
            timestamp: "2024-01-10T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
        ],
      });

      const events = getRecentSyncEvents(character);

      expect(events[0].timestamp).toBe("2024-01-15T00:00:00Z");
      expect(events[1].timestamp).toBe("2024-01-10T00:00:00Z");
      expect(events[2].timestamp).toBe("2024-01-01T00:00:00Z");
    });

    it("should filter by event types", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "drift_detected",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "2",
            action: "migration_completed",
            timestamp: "2024-01-02T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
          {
            id: "3",
            action: "migration_rolled_back",
            timestamp: "2024-01-03T00:00:00Z",
            actor: { userId: "u1", role: "owner" },
            details: {},
          },
        ],
      });

      const events = getRecentSyncEvents(character, {
        eventTypes: ["drift_detected", "migration_completed"],
      });

      expect(events).toHaveLength(2);
      expect(events.map((e) => e.eventType)).toContain("drift_detected");
      expect(events.map((e) => e.eventType)).toContain("migration_completed");
      expect(events.map((e) => e.eventType)).not.toContain("migration_rolled_back");
    });

    it("should filter by fromDate", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "drift_detected",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "2",
            action: "drift_detected",
            timestamp: "2024-01-15T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "3",
            action: "drift_detected",
            timestamp: "2024-01-20T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
        ],
      });

      const events = getRecentSyncEvents(character, { fromDate: "2024-01-10T00:00:00Z" });

      expect(events).toHaveLength(2);
      expect(events.every((e) => new Date(e.timestamp) >= new Date("2024-01-10T00:00:00Z"))).toBe(
        true
      );
    });

    it("should filter by toDate", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "drift_detected",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "2",
            action: "drift_detected",
            timestamp: "2024-01-15T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "3",
            action: "drift_detected",
            timestamp: "2024-01-20T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
        ],
      });

      const events = getRecentSyncEvents(character, { toDate: "2024-01-16T00:00:00Z" });

      expect(events).toHaveLength(2);
      expect(events.every((e) => new Date(e.timestamp) <= new Date("2024-01-16T00:00:00Z"))).toBe(
        true
      );
    });

    it("should apply limit", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "drift_detected",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "2",
            action: "drift_detected",
            timestamp: "2024-01-02T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "3",
            action: "drift_detected",
            timestamp: "2024-01-03T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "4",
            action: "drift_detected",
            timestamp: "2024-01-04T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
        ],
      });

      const events = getRecentSyncEvents(character, { limit: 2 });

      expect(events).toHaveLength(2);
      // Should get the 2 most recent (sorted desc)
      expect(events[0].timestamp).toBe("2024-01-04T00:00:00Z");
      expect(events[1].timestamp).toBe("2024-01-03T00:00:00Z");
    });

    it("should apply offset", () => {
      const character = createMockCharacter({
        auditLog: [
          {
            id: "1",
            action: "drift_detected",
            timestamp: "2024-01-01T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "2",
            action: "drift_detected",
            timestamp: "2024-01-02T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "3",
            action: "drift_detected",
            timestamp: "2024-01-03T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
          {
            id: "4",
            action: "drift_detected",
            timestamp: "2024-01-04T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {},
          },
        ],
      });

      const events = getRecentSyncEvents(character, { offset: 1, limit: 2 });

      expect(events).toHaveLength(2);
      // Skip first (most recent), get next 2
      expect(events[0].timestamp).toBe("2024-01-03T00:00:00Z");
      expect(events[1].timestamp).toBe("2024-01-02T00:00:00Z");
    });

    it("should convert audit entries to SyncAuditEntry format", () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "snap-123",
        createdAt: "2024-01-01T00:00:00Z",
        auditLog: [
          {
            id: "entry-1",
            action: "drift_detected",
            timestamp: "2024-01-15T00:00:00Z",
            actor: { userId: "system", role: "system" },
            details: {
              sourceVersion: createMockVersionRef(),
              changes: [
                { type: "modified", module: "skills", itemId: "test", before: 1, after: 2 },
              ],
            },
          },
        ],
      });

      const events = getRecentSyncEvents(character);

      expect(events[0]).toMatchObject({
        id: "entry-1",
        timestamp: "2024-01-15T00:00:00Z",
        eventType: "drift_detected",
        actor: expect.objectContaining({ type: "system" }),
      });
    });
  });

  // ===========================================================================
  // formatSyncEvent
  // ===========================================================================

  describe("formatSyncEvent", () => {
    function createTestEntry(
      eventType: SyncAuditEntry["eventType"],
      overrides?: Partial<SyncAuditEntry>
    ): SyncAuditEntry {
      return {
        id: "entry-123",
        timestamp: "2024-01-15T10:30:00Z",
        eventType,
        sourceVersion: createMockVersionRef(),
        changes: [],
        actor: { type: "system", description: "System" },
        ...overrides,
      };
    }

    it("should format drift_detected event", () => {
      const entry = createTestEntry("drift_detected", {
        changes: [
          { type: "modified", module: "skills", itemId: "s1", before: 1, after: 2 },
          { type: "removed", module: "qualities", itemId: "q1", before: "x", after: null },
        ],
      });

      const formatted = formatSyncEvent(entry);

      expect(formatted).toContain("Drift detected");
      expect(formatted).toContain("2 change(s)");
    });

    it("should format migration_started event with user actor", () => {
      const entry = createTestEntry("migration_started", {
        actor: { type: "user", userId: "user-456", description: "User action" },
      });

      const formatted = formatSyncEvent(entry);

      expect(formatted).toContain("Migration started");
      expect(formatted).toContain("by user-456");
    });

    it("should format migration_completed event", () => {
      const entry = createTestEntry("migration_completed", {
        actor: { type: "user", userId: "user-789", description: "User action" },
      });

      const formatted = formatSyncEvent(entry);

      expect(formatted).toContain("Migration completed");
      expect(formatted).toContain("by user-789");
    });

    it("should format migration_rolled_back event", () => {
      const entry = createTestEntry("migration_rolled_back", {
        actor: { type: "user", userId: "admin-1", description: "Admin action" },
      });

      const formatted = formatSyncEvent(entry);

      expect(formatted).toContain("Migration rolled back");
      expect(formatted).toContain("by admin-1");
    });

    it("should format legality_changed event", () => {
      const entry = createTestEntry("legality_changed");

      const formatted = formatSyncEvent(entry);

      expect(formatted).toContain("Legality status changed");
    });

    it("should format manual_resync event", () => {
      const entry = createTestEntry("manual_resync", {
        actor: { type: "user", userId: "user-abc", description: "User action" },
      });

      const formatted = formatSyncEvent(entry);

      expect(formatted).toContain("Manual resync");
      expect(formatted).toContain("by user-abc");
    });

    it("should show 'by system' when no userId", () => {
      // Note: drift_detected specifically doesn't include the actor in its format
      // Use a different event type to test actor formatting
      const entry = createTestEntry("legality_changed", {
        actor: { type: "system", description: "System action" },
      });

      const formatted = formatSyncEvent(entry);

      expect(formatted).toContain("by system");
    });

    it("should include formatted date", () => {
      const entry = createTestEntry("drift_detected");

      const formatted = formatSyncEvent(entry);

      // Should contain some date formatting
      expect(formatted).toMatch(/\[.+\]/);
    });
  });
});
