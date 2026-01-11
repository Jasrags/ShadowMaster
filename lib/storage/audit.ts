/**
 * Audit log management for characters
 *
 * Provides functions for querying and managing audit entries.
 * Audit entries are stored inline within character JSON files.
 *
 * Satisfies:
 * - Guarantee: "All character state modifications MUST be persistent and recoverable"
 * - Requirement: "The system MUST maintain a record of which ruleset version and bundles
 *   were active at the time of any character state change"
 */

import type { AuditEntry, AuditQueryOptions, AuditAction, AuditActor } from "../types/audit";
import type { Character } from "../types/character";
import type { ID } from "../types/core";

// =============================================================================
// AUDIT LOG QUERIES
// =============================================================================

/**
 * Query audit entries from a character's audit log
 */
export function queryAuditLog(character: Character, options: AuditQueryOptions = {}): AuditEntry[] {
  const auditLog = character.auditLog || [];

  let entries = [...auditLog];

  // Filter by actions
  if (options.actions && options.actions.length > 0) {
    entries = entries.filter((e) => options.actions!.includes(e.action));
  }

  // Filter by actor
  if (options.actorId) {
    entries = entries.filter((e) => e.actor.userId === options.actorId);
  }

  // Filter by date range
  if (options.fromDate) {
    const from = new Date(options.fromDate).getTime();
    entries = entries.filter((e) => new Date(e.timestamp).getTime() >= from);
  }

  if (options.toDate) {
    const to = new Date(options.toDate).getTime();
    entries = entries.filter((e) => new Date(e.timestamp).getTime() <= to);
  }

  // Sort
  const sortOrder = options.order || "desc";
  entries.sort((a, b) => {
    const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return sortOrder === "asc" ? diff : -diff;
  });

  // Limit
  if (options.limit && options.limit > 0) {
    entries = entries.slice(0, options.limit);
  }

  return entries;
}

/**
 * Get the most recent audit entry for a character
 */
export function getLatestAuditEntry(character: Character): AuditEntry | undefined {
  const auditLog = character.auditLog || [];
  if (auditLog.length === 0) return undefined;

  return [...auditLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
}

/**
 * Get audit entries for a specific action type
 */
export function getAuditEntriesByAction(character: Character, action: AuditAction): AuditEntry[] {
  return queryAuditLog(character, { actions: [action] });
}

/**
 * Get the count of audit entries for a character
 */
export function getAuditLogCount(character: Character): number {
  return (character.auditLog || []).length;
}

/**
 * Check if character has been modified since a given date
 */
export function hasModificationsSince(character: Character, since: string): boolean {
  const sinceTime = new Date(since).getTime();
  return (character.auditLog || []).some(
    (entry) => new Date(entry.timestamp).getTime() > sinceTime
  );
}

// =============================================================================
// AUDIT SUMMARY
// =============================================================================

/**
 * Summary of a character's audit log
 */
export interface AuditLogSummary {
  totalEntries: number;
  createdAt?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: AuditActor;
  stateTransitions: number;
  advancementEvents: number;
  campaignEvents: number;
}

/**
 * Get a summary of the character's audit log
 */
export function getAuditLogSummary(character: Character): AuditLogSummary {
  const auditLog = character.auditLog || [];

  const stateTransitions = auditLog.filter(
    (e) =>
      e.action === "finalized" ||
      e.action === "retired" ||
      e.action === "reactivated" ||
      e.action === "deceased"
  ).length;

  const advancementEvents = auditLog.filter(
    (e) =>
      e.action === "advancement_requested" ||
      e.action === "advancement_applied" ||
      e.action === "advancement_approved" ||
      e.action === "advancement_rejected"
  ).length;

  const campaignEvents = auditLog.filter(
    (e) =>
      e.action === "campaign_joined" ||
      e.action === "campaign_left" ||
      e.action === "approval_requested" ||
      e.action === "approval_granted" ||
      e.action === "approval_rejected"
  ).length;

  const sortedByTime = [...auditLog].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const created = sortedByTime.find((e) => e.action === "created");
  const latest = sortedByTime.length > 0 ? sortedByTime[sortedByTime.length - 1] : undefined;

  return {
    totalEntries: auditLog.length,
    createdAt: created?.timestamp,
    lastModifiedAt: latest?.timestamp,
    lastModifiedBy: latest?.actor,
    stateTransitions,
    advancementEvents,
    campaignEvents,
  };
}

// =============================================================================
// AUDIT-AWARE UPDATE CONTEXT
// =============================================================================

/**
 * Context for audit-aware updates
 */
export interface AuditUpdateContext {
  action: AuditAction;
  actorId: ID;
  actorRole: AuditActor["role"];
  details?: Record<string, unknown>;
  note?: string;
}

/**
 * Build an AuditActor from context
 */
export function buildAuditActor(actorId: ID, role: AuditActor["role"]): AuditActor {
  return { userId: actorId, role };
}
