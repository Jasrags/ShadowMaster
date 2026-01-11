/**
 * Sync Audit Trail
 *
 * Provides append-only audit logging for synchronization events.
 * Records all sync operations for compliance, debugging, and history.
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 * @see ADR-009 (Append-Only Ledger)
 */

import { v4 as uuidv4 } from "uuid";
import type {
  ID,
  Character,
  SyncAuditEntry,
  SyncEventType,
  RulesetVersionRef,
  AppliedChange,
  DriftReport,
  MigrationPlan,
  MigrationResult,
  DriftChangeType,
  RuleModuleType,
} from "@/lib/types";
import { recordSyncEvent } from "@/lib/storage/characters";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Options for creating sync audit entries
 */
export interface CreateAuditEntryOptions {
  /** Type of sync event */
  eventType: SyncEventType;
  /** Source ruleset version */
  sourceVersion: RulesetVersionRef;
  /** Target ruleset version (if changing) */
  targetVersion?: RulesetVersionRef;
  /** Changes that occurred */
  changes?: AppliedChange[];
  /** User who initiated (if any) */
  userId?: ID;
  /** Description of the action */
  description?: string;
}

/**
 * Query options for retrieving audit entries
 */
export interface AuditQueryOptions {
  /** Filter by event types */
  eventTypes?: SyncEventType[];
  /** Filter from this date */
  fromDate?: string;
  /** Filter to this date */
  toDate?: string;
  /** Maximum number of entries to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Summary of sync audit activity
 */
export interface SyncAuditSummary {
  /** Total number of sync events */
  totalEvents: number;
  /** Events by type */
  eventsByType: Record<SyncEventType, number>;
  /** Last drift detection date */
  lastDriftCheck?: string;
  /** Last migration date */
  lastMigration?: string;
  /** Number of successful migrations */
  successfulMigrations: number;
  /** Number of rolled back migrations */
  rolledBackMigrations: number;
}

// =============================================================================
// AUDIT ENTRY CREATION
// =============================================================================

/**
 * Create a sync audit entry
 *
 * Creates a new audit entry for a synchronization event.
 *
 * @param options - Options for the audit entry
 * @returns The created audit entry
 */
export function createSyncAuditEntry(options: CreateAuditEntryOptions): SyncAuditEntry {
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    eventType: options.eventType,
    sourceVersion: options.sourceVersion,
    targetVersion: options.targetVersion,
    changes: options.changes || [],
    actor: {
      type: options.userId ? "user" : "system",
      userId: options.userId,
      description: options.description || getDefaultDescription(options.eventType),
    },
  };
}

/**
 * Record a drift detection event
 *
 * Creates an audit entry when drift is detected between
 * a character's snapshot and the current ruleset.
 *
 * @param userId - Owner of the character
 * @param character - The character that was checked
 * @param report - The drift report
 */
export async function recordDriftDetection(
  userId: ID,
  character: Character,
  report: DriftReport
): Promise<void> {
  const changes: AppliedChange[] = report.changes.map((change) => ({
    type: change.changeType,
    module: change.module,
    itemId: change.affectedItems[0]?.itemId || change.id,
    before: change.affectedItems[0]?.previousValue,
    after: change.affectedItems[0]?.currentValue,
  }));

  const entry = createSyncAuditEntry({
    eventType: "drift_detected",
    sourceVersion: report.currentVersion,
    targetVersion: report.targetVersion,
    changes,
    description: `Detected ${report.changes.length} change(s) - severity: ${report.overallSeverity}`,
  });

  await recordSyncEvent(userId, character.id, entry);
}

/**
 * Record a migration start event
 *
 * Creates an audit entry when a migration begins.
 *
 * @param userId - User initiating the migration
 * @param character - The character being migrated
 * @param plan - The migration plan
 */
export async function recordMigrationStart(
  userId: ID,
  character: Character,
  plan: MigrationPlan
): Promise<void> {
  const changes: AppliedChange[] = plan.steps.map((step) => ({
    type: "modified" as DriftChangeType,
    module: "skills" as RuleModuleType, // Would need to track from drift report
    itemId: step.changeId,
    before: step.before,
    after: step.after,
  }));

  const entry = createSyncAuditEntry({
    eventType: "migration_started",
    sourceVersion: plan.sourceVersion,
    targetVersion: plan.targetVersion,
    changes,
    userId,
    description: `Started migration with ${plan.steps.length} step(s)`,
  });

  await recordSyncEvent(userId, character.id, entry);
}

/**
 * Record a migration completion event
 *
 * Creates an audit entry when a migration completes successfully.
 *
 * @param userId - User who initiated the migration
 * @param character - The character that was migrated
 * @param plan - The migration plan
 * @param result - The migration result
 */
export async function recordMigrationComplete(
  userId: ID,
  character: Character,
  plan: MigrationPlan,
  result: MigrationResult
): Promise<void> {
  const changes: AppliedChange[] = result.appliedSteps.map((step) => ({
    type: "modified" as DriftChangeType,
    module: "skills" as RuleModuleType,
    itemId: step.changeId,
    before: step.before,
    after: step.after,
  }));

  const entry = createSyncAuditEntry({
    eventType: "migration_completed",
    sourceVersion: plan.sourceVersion,
    targetVersion: plan.targetVersion,
    changes,
    userId,
    description: `Completed migration - ${result.appliedSteps.length} step(s) applied`,
  });

  await recordSyncEvent(userId, character.id, entry);
}

/**
 * Record a migration rollback event
 *
 * Creates an audit entry when a migration is rolled back.
 *
 * @param userId - User who initiated the rollback
 * @param character - The character that was rolled back
 * @param plan - The migration plan that was rolled back
 * @param reason - Reason for the rollback
 */
export async function recordMigrationRollback(
  userId: ID,
  character: Character,
  plan: MigrationPlan,
  reason: string
): Promise<void> {
  const entry = createSyncAuditEntry({
    eventType: "migration_rolled_back",
    sourceVersion: plan.targetVersion, // Rolling back FROM target
    targetVersion: plan.sourceVersion, // Rolling back TO source
    changes: [],
    userId,
    description: `Rolled back migration: ${reason}`,
  });

  await recordSyncEvent(userId, character.id, entry);
}

/**
 * Record a legality status change event
 *
 * Creates an audit entry when a character's legality status changes.
 *
 * @param userId - Owner of the character
 * @param character - The character
 * @param previousStatus - Previous legality status
 * @param newStatus - New legality status
 * @param reason - Reason for the change
 */
export async function recordLegalityChange(
  userId: ID,
  character: Character,
  previousStatus: string,
  newStatus: string,
  reason: string
): Promise<void> {
  const currentVersion = character.rulesetVersion || {
    editionCode: character.editionCode,
    editionVersion: "1.0.0",
    bookVersions: {},
    snapshotId: character.rulesetSnapshotId,
    createdAt: character.createdAt,
  };

  const entry = createSyncAuditEntry({
    eventType: "legality_changed",
    sourceVersion: currentVersion,
    changes: [
      {
        type: "modified",
        module: "creation" as RuleModuleType,
        itemId: "legalityStatus",
        before: previousStatus,
        after: newStatus,
      },
    ],
    description: `Legality changed from ${previousStatus} to ${newStatus}: ${reason}`,
  });

  await recordSyncEvent(userId, character.id, entry);
}

/**
 * Record a manual resync event
 *
 * Creates an audit entry when a user manually triggers a resync.
 *
 * @param userId - User who triggered the resync
 * @param character - The character that was resynced
 * @param newVersion - The new ruleset version
 */
export async function recordManualResync(
  userId: ID,
  character: Character,
  newVersion: RulesetVersionRef
): Promise<void> {
  const currentVersion = character.rulesetVersion || {
    editionCode: character.editionCode,
    editionVersion: "1.0.0",
    bookVersions: {},
    snapshotId: character.rulesetSnapshotId,
    createdAt: character.createdAt,
  };

  const entry = createSyncAuditEntry({
    eventType: "manual_resync",
    sourceVersion: currentVersion,
    targetVersion: newVersion,
    changes: [],
    userId,
    description: "User triggered manual resync to latest ruleset",
  });

  await recordSyncEvent(userId, character.id, entry);
}

// =============================================================================
// AUDIT QUERIES
// =============================================================================

/**
 * Get sync audit summary for a character
 *
 * Provides aggregated statistics about sync events.
 *
 * @param character - The character to summarize
 * @returns Audit summary
 */
export function getSyncAuditSummary(character: Character): SyncAuditSummary {
  const auditLog = character.auditLog || [];

  // Filter to sync-related events
  const syncEvents = auditLog.filter((entry) => isSyncEvent(entry.action as SyncEventType));

  // Count by type
  const eventsByType: Record<SyncEventType, number> = {
    drift_detected: 0,
    migration_started: 0,
    migration_completed: 0,
    migration_rolled_back: 0,
    legality_changed: 0,
    manual_resync: 0,
  };

  for (const event of syncEvents) {
    const eventType = event.action as SyncEventType;
    if (eventType in eventsByType) {
      eventsByType[eventType]++;
    }
  }

  // Find last events
  const driftEvents = syncEvents.filter((e) => e.action === "drift_detected");
  const migrationEvents = syncEvents.filter((e) => e.action === "migration_completed");

  const lastDriftCheck =
    driftEvents.length > 0
      ? driftEvents.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]?.timestamp
      : undefined;

  const lastMigration =
    migrationEvents.length > 0
      ? migrationEvents.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]?.timestamp
      : undefined;

  return {
    totalEvents: syncEvents.length,
    eventsByType,
    lastDriftCheck,
    lastMigration,
    successfulMigrations: eventsByType.migration_completed,
    rolledBackMigrations: eventsByType.migration_rolled_back,
  };
}

/**
 * Get recent sync events for a character
 *
 * @param character - The character to query
 * @param options - Query options
 * @returns Filtered audit entries
 */
export function getRecentSyncEvents(
  character: Character,
  options: AuditQueryOptions = {}
): SyncAuditEntry[] {
  const auditLog = character.auditLog || [];

  // Filter to sync events
  let events = auditLog.filter((entry) => isSyncEvent(entry.action as SyncEventType));

  // Apply event type filter
  if (options.eventTypes && options.eventTypes.length > 0) {
    events = events.filter((e) => options.eventTypes!.includes(e.action as SyncEventType));
  }

  // Apply date filters
  if (options.fromDate) {
    const fromTime = new Date(options.fromDate).getTime();
    events = events.filter((e) => new Date(e.timestamp).getTime() >= fromTime);
  }

  if (options.toDate) {
    const toTime = new Date(options.toDate).getTime();
    events = events.filter((e) => new Date(e.timestamp).getTime() <= toTime);
  }

  // Sort by timestamp descending (most recent first)
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Apply pagination
  const offset = options.offset || 0;
  const limit = options.limit || events.length;

  events = events.slice(offset, offset + limit);

  // Convert to SyncAuditEntry format
  return events.map((entry) => ({
    id: entry.id,
    timestamp: entry.timestamp,
    eventType: entry.action as SyncEventType,
    sourceVersion: (entry.details as { sourceVersion?: RulesetVersionRef })?.sourceVersion || {
      editionCode: character.editionCode,
      editionVersion: "1.0.0",
      bookVersions: {},
      snapshotId: character.rulesetSnapshotId,
      createdAt: character.createdAt,
    },
    targetVersion: (entry.details as { targetVersion?: RulesetVersionRef })?.targetVersion,
    changes: (entry.details as { changes?: AppliedChange[] })?.changes || [],
    actor: {
      type: entry.actor.role === "system" ? "system" : "user",
      userId: entry.actor.userId,
      description: entry.actor.userId,
    },
  }));
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Check if an action is a sync event type
 */
function isSyncEvent(action: SyncEventType | string): boolean {
  const syncEventTypes: SyncEventType[] = [
    "drift_detected",
    "migration_started",
    "migration_completed",
    "migration_rolled_back",
    "legality_changed",
    "manual_resync",
  ];
  return syncEventTypes.includes(action as SyncEventType);
}

/**
 * Get default description for an event type
 */
function getDefaultDescription(eventType: SyncEventType): string {
  switch (eventType) {
    case "drift_detected":
      return "System detected drift from ruleset";
    case "migration_started":
      return "Migration initiated";
    case "migration_completed":
      return "Migration completed successfully";
    case "migration_rolled_back":
      return "Migration was rolled back";
    case "legality_changed":
      return "Character legality status changed";
    case "manual_resync":
      return "Manual resync triggered";
    default:
      return "Sync event occurred";
  }
}

/**
 * Format a sync event for display
 */
export function formatSyncEvent(entry: SyncAuditEntry): string {
  const date = new Date(entry.timestamp).toLocaleString();
  const actor = entry.actor.userId ? `by ${entry.actor.userId}` : "by system";

  switch (entry.eventType) {
    case "drift_detected":
      return `[${date}] Drift detected - ${entry.changes.length} change(s) found`;

    case "migration_started":
      return `[${date}] Migration started ${actor}`;

    case "migration_completed":
      return `[${date}] Migration completed ${actor}`;

    case "migration_rolled_back":
      return `[${date}] Migration rolled back ${actor}`;

    case "legality_changed":
      return `[${date}] Legality status changed ${actor}`;

    case "manual_resync":
      return `[${date}] Manual resync ${actor}`;

    default:
      return `[${date}] ${entry.eventType} ${actor}`;
  }
}
