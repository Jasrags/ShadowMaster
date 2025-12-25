/**
 * User Audit Storage Layer
 *
 * Provides CRUD operations for user management audit entries.
 * Stores audit logs in /data/audit/users/{userId}.json
 *
 * This module is server-only and should never be imported in client components.
 */

import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  ensureDirectory,
  readJsonFile,
  writeJsonFile,
  readAllJsonFiles,
  listJsonFiles,
} from "./base";
import type {
  UserAuditEntry,
  CreateUserAuditEntryParams,
  UserAuditQueryOptions,
  ISODateString,
} from "../types";

const AUDIT_DIR = path.join(process.cwd(), "data", "audit", "users");

/**
 * Get the file path for a user's audit log
 */
function getUserAuditFilePath(userId: string): string {
  return path.join(AUDIT_DIR, `${userId}.json`);
}

/**
 * Get audit entries for a specific user
 */
async function getUserAuditEntries(userId: string): Promise<UserAuditEntry[]> {
  const filePath = getUserAuditFilePath(userId);
  const entries = await readJsonFile<UserAuditEntry[]>(filePath);
  return entries || [];
}

/**
 * Save audit entries for a specific user
 */
async function saveUserAuditEntries(
  userId: string,
  entries: UserAuditEntry[]
): Promise<void> {
  await ensureDirectory(AUDIT_DIR);
  const filePath = getUserAuditFilePath(userId);
  await writeJsonFile(filePath, entries);
}

/**
 * Create a new user audit entry
 *
 * @param params - Audit entry parameters (action, actor, targetUserId, details)
 * @returns The created audit entry with generated id and timestamp
 */
export async function createUserAuditEntry(
  params: CreateUserAuditEntryParams
): Promise<UserAuditEntry> {
  const entry: UserAuditEntry = {
    id: uuidv4(),
    timestamp: new Date().toISOString() as ISODateString,
    action: params.action,
    actor: params.actor,
    targetUserId: params.targetUserId,
    details: params.details || {},
  };

  // Get existing entries and append the new one
  const entries = await getUserAuditEntries(params.targetUserId);
  entries.push(entry);

  // Save back to file
  await saveUserAuditEntries(params.targetUserId, entries);

  return entry;
}

/**
 * Get audit log for a specific user
 *
 * @param userId - The user ID to get audit log for
 * @param options - Query options (limit, offset, order)
 * @returns Array of audit entries and total count
 */
export async function getUserAuditLog(
  userId: string,
  options: Pick<UserAuditQueryOptions, "limit" | "offset" | "order"> = {}
): Promise<{ entries: UserAuditEntry[]; total: number }> {
  const { limit = 50, offset = 0, order = "desc" } = options;

  let entries = await getUserAuditEntries(userId);
  const total = entries.length;

  // Sort by timestamp
  entries.sort((a, b) => {
    const comparison =
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return order === "asc" ? comparison : -comparison;
  });

  // Apply pagination
  entries = entries.slice(offset, offset + limit);

  return { entries, total };
}

/**
 * Get all user audit entries across all users
 *
 * @param options - Query options for filtering and pagination
 * @returns Array of audit entries and total count
 */
export async function getAllUserAuditEntries(
  options: UserAuditQueryOptions = {}
): Promise<{ entries: UserAuditEntry[]; total: number }> {
  const {
    actions,
    actorId,
    targetUserId,
    fromDate,
    toDate,
    limit = 50,
    offset = 0,
    order = "desc",
  } = options;

  // If targetUserId is specified, only get that user's entries
  let allEntries: UserAuditEntry[] = [];

  if (targetUserId) {
    allEntries = await getUserAuditEntries(targetUserId);
  } else {
    // Get all user IDs with audit logs
    const userIds = await listJsonFiles(AUDIT_DIR);

    // Collect all entries from all users
    for (const userId of userIds) {
      const entries = await getUserAuditEntries(userId);
      allEntries.push(...entries);
    }
  }

  // Apply filters
  let filteredEntries = allEntries;

  if (actions && actions.length > 0) {
    filteredEntries = filteredEntries.filter((e) => actions.includes(e.action));
  }

  if (actorId) {
    filteredEntries = filteredEntries.filter((e) => e.actor.userId === actorId);
  }

  if (fromDate) {
    const fromTime = new Date(fromDate).getTime();
    filteredEntries = filteredEntries.filter(
      (e) => new Date(e.timestamp).getTime() >= fromTime
    );
  }

  if (toDate) {
    const toTime = new Date(toDate).getTime();
    filteredEntries = filteredEntries.filter(
      (e) => new Date(e.timestamp).getTime() <= toTime
    );
  }

  const total = filteredEntries.length;

  // Sort by timestamp
  filteredEntries.sort((a, b) => {
    const comparison =
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return order === "asc" ? comparison : -comparison;
  });

  // Apply pagination
  filteredEntries = filteredEntries.slice(offset, offset + limit);

  return { entries: filteredEntries, total };
}

/**
 * Delete all audit entries for a user
 * Called when user is deleted to clean up audit logs
 *
 * @param userId - The user ID whose audit log should be deleted
 * @returns true if deleted, false if no audit log existed
 */
export async function deleteUserAuditLog(userId: string): Promise<boolean> {
  const { deleteFile } = await import("./base");
  const filePath = getUserAuditFilePath(userId);
  return deleteFile(filePath);
}

/**
 * Archive audit entries for a deleted user
 * Preserves audit trail by moving to archive with deletion metadata
 *
 * @param userId - The user ID being deleted
 * @param deletedByUserId - The admin who deleted the user
 * @param userMetadata - Metadata about the deleted user to preserve
 */
export async function archiveUserAuditLog(
  userId: string,
  deletedByUserId: string,
  userMetadata: { email: string; username: string }
): Promise<void> {
  const entries = await getUserAuditEntries(userId);

  // Create a deletion entry to mark the end of the audit trail
  const deletionEntry: UserAuditEntry = {
    id: uuidv4(),
    timestamp: new Date().toISOString() as ISODateString,
    action: "user_deleted",
    actor: { userId: deletedByUserId, role: "admin" },
    targetUserId: userId,
    details: {
      archivedUser: userMetadata,
      reason: "User account deleted",
    },
  };

  entries.push(deletionEntry);

  // Save to archive location
  const archiveDir = path.join(process.cwd(), "data", "audit", "users-archived");
  await ensureDirectory(archiveDir);
  const archivePath = path.join(
    archiveDir,
    `${userId}-${Date.now()}.json`
  );
  await writeJsonFile(archivePath, entries);

  // Remove the active audit log
  await deleteUserAuditLog(userId);
}

/**
 * Count admins in the system (helper for last-admin protection)
 * This is imported from users.ts to avoid circular dependency
 */
export async function countAdmins(): Promise<number> {
  const { getAllUsers } = await import("./users");
  const users = await getAllUsers();
  return users.filter((u) => u.role.includes("administrator")).length;
}
