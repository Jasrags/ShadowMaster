/**
 * Violation Record Storage
 *
 * Provides persistent storage for validation rejection audit trail.
 *
 * Satisfies Ruleset Integrity Capability:
 * - "Any attempt to use content or mechanics from a disabled or
 *    incompatible bundle MUST be rejected with a clear violation record."
 *
 * Design Decision: Violations are stored indefinitely for full audit trail.
 *
 * @see docs/capabilities/ruleset.integrity.md
 */

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { ID } from "../types";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Type of violation that occurred.
 */
export type ViolationType =
  | "creation" // During character creation
  | "advancement" // During character advancement
  | "content_access" // Attempting to access disabled content
  | "edition_mismatch" // Edition compatibility violation
  | "book_restriction" // Book not enabled in campaign
  | "optional_rule"; // Optional rule violation

/**
 * Severity of the violation.
 */
export type ViolationSeverity = "error" | "warning";

/**
 * A record of a validation rejection for audit purposes.
 */
export interface ViolationRecord {
  /** Unique ID for this violation record */
  id: ID;

  /** Character that triggered the violation */
  characterId: ID;

  /** Campaign context (if applicable) */
  campaignId?: ID;

  /** User who triggered the violation */
  userId?: ID;

  /** When the violation occurred */
  timestamp: string;

  /** Type of violation */
  violationType: ViolationType;

  /** Severity level */
  severity: ViolationSeverity;

  /** The specific constraint that was violated */
  constraintId: string;

  /** Detailed information about the violation */
  details: {
    /** What action was attempted */
    attemptedAction: string;

    /** Why it was rejected */
    rejectReason: string;

    /** Ruleset snapshot ID at time of violation */
    rulesetSnapshotId?: string;

    /** Book IDs that were active */
    enabledBookIds?: string[];

    /** Additional context */
    context?: Record<string, unknown>;
  };
}

/**
 * Input for creating a new violation record.
 */
export type ViolationRecordInput = Omit<ViolationRecord, "id" | "timestamp">;

/**
 * Query options for retrieving violations.
 */
export interface ViolationQueryOptions {
  /** Filter by character ID */
  characterId?: ID;

  /** Filter by campaign ID */
  campaignId?: ID;

  /** Filter by user ID */
  userId?: ID;

  /** Filter by violation type */
  violationType?: ViolationType;

  /** Filter by severity */
  severity?: ViolationSeverity;

  /** Only violations after this date */
  after?: string;

  /** Only violations before this date */
  before?: string;

  /** Maximum number of records to return */
  limit?: number;

  /** Offset for pagination */
  offset?: number;
}

// =============================================================================
// DATA DIRECTORY
// =============================================================================

const DATA_DIR = path.join(process.cwd(), "data", "violations");

/**
 * Ensure the violations directory exists.
 */
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Get the file path for a violation record.
 */
function getViolationFilePath(id: ID): string {
  return path.join(DATA_DIR, `${id}.json`);
}

/**
 * Get the index file path.
 */
function getIndexFilePath(): string {
  return path.join(DATA_DIR, "_index.json");
}

// =============================================================================
// INDEX MANAGEMENT
// =============================================================================

/**
 * Index entry for quick lookups.
 */
interface ViolationIndexEntry {
  id: ID;
  characterId: ID;
  campaignId?: ID;
  userId?: ID;
  violationType: ViolationType;
  severity: ViolationSeverity;
  timestamp: string;
}

/**
 * Read the violations index.
 */
async function readIndex(): Promise<ViolationIndexEntry[]> {
  try {
    const content = await fs.readFile(getIndexFilePath(), "utf-8");
    return JSON.parse(content) as ViolationIndexEntry[];
  } catch {
    return [];
  }
}

/**
 * Write the violations index.
 */
async function writeIndex(entries: ViolationIndexEntry[]): Promise<void> {
  await fs.writeFile(getIndexFilePath(), JSON.stringify(entries, null, 2) + "\n");
}

/**
 * Add an entry to the index.
 */
async function addToIndex(record: ViolationRecord): Promise<void> {
  const index = await readIndex();
  index.push({
    id: record.id,
    characterId: record.characterId,
    campaignId: record.campaignId,
    userId: record.userId,
    violationType: record.violationType,
    severity: record.severity,
    timestamp: record.timestamp,
  });
  await writeIndex(index);
}

// =============================================================================
// CRUD OPERATIONS
// =============================================================================

/**
 * Record a new violation.
 *
 * @param input - Violation data (without id and timestamp)
 * @returns The created violation record
 */
export async function recordViolation(input: ViolationRecordInput): Promise<ViolationRecord> {
  await ensureDataDir();

  const record: ViolationRecord = {
    ...input,
    id: randomUUID(),
    timestamp: new Date().toISOString(),
  };

  // Write the full record
  await fs.writeFile(getViolationFilePath(record.id), JSON.stringify(record, null, 2));

  // Update index for efficient queries
  await addToIndex(record);

  return record;
}

/**
 * Get a violation record by ID.
 *
 * @param id - Violation ID
 * @returns The violation record or null if not found
 */
export async function getViolationById(id: ID): Promise<ViolationRecord | null> {
  try {
    const content = await fs.readFile(getViolationFilePath(id), "utf-8");
    return JSON.parse(content) as ViolationRecord;
  } catch {
    return null;
  }
}

/**
 * Get all violations for a character.
 *
 * @param characterId - Character ID
 * @returns Array of violation records
 */
export async function getViolationsByCharacter(characterId: ID): Promise<ViolationRecord[]> {
  const index = await readIndex();
  const matchingIds = index.filter((e) => e.characterId === characterId).map((e) => e.id);

  const records: ViolationRecord[] = [];
  for (const id of matchingIds) {
    const record = await getViolationById(id);
    if (record) {
      records.push(record);
    }
  }

  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Get all violations for a campaign.
 *
 * @param campaignId - Campaign ID
 * @returns Array of violation records
 */
export async function getViolationsByCampaign(campaignId: ID): Promise<ViolationRecord[]> {
  const index = await readIndex();
  const matchingIds = index.filter((e) => e.campaignId === campaignId).map((e) => e.id);

  const records: ViolationRecord[] = [];
  for (const id of matchingIds) {
    const record = await getViolationById(id);
    if (record) {
      records.push(record);
    }
  }

  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Query violations with filters.
 *
 * @param options - Query options
 * @returns Array of matching violation records
 */
export async function queryViolations(
  options: ViolationQueryOptions = {}
): Promise<ViolationRecord[]> {
  const index = await readIndex();

  // Apply filters to index
  let filtered = index;

  if (options.characterId) {
    filtered = filtered.filter((e) => e.characterId === options.characterId);
  }

  if (options.campaignId) {
    filtered = filtered.filter((e) => e.campaignId === options.campaignId);
  }

  if (options.userId) {
    filtered = filtered.filter((e) => e.userId === options.userId);
  }

  if (options.violationType) {
    filtered = filtered.filter((e) => e.violationType === options.violationType);
  }

  if (options.severity) {
    filtered = filtered.filter((e) => e.severity === options.severity);
  }

  if (options.after) {
    const afterDate = new Date(options.after);
    filtered = filtered.filter((e) => new Date(e.timestamp) > afterDate);
  }

  if (options.before) {
    const beforeDate = new Date(options.before);
    filtered = filtered.filter((e) => new Date(e.timestamp) < beforeDate);
  }

  // Sort by timestamp descending (newest first)
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Apply pagination
  const offset = options.offset ?? 0;
  const limit = options.limit ?? 100;
  filtered = filtered.slice(offset, offset + limit);

  // Load full records
  const records: ViolationRecord[] = [];
  for (const entry of filtered) {
    const record = await getViolationById(entry.id);
    if (record) {
      records.push(record);
    }
  }

  return records;
}

/**
 * Get violation count by type for a character.
 *
 * @param characterId - Character ID
 * @returns Map of violation type to count
 */
export async function getViolationCountsByType(
  characterId: ID
): Promise<Record<ViolationType, number>> {
  const index = await readIndex();
  const characterViolations = index.filter((e) => e.characterId === characterId);

  const counts: Record<ViolationType, number> = {
    creation: 0,
    advancement: 0,
    content_access: 0,
    edition_mismatch: 0,
    book_restriction: 0,
    optional_rule: 0,
  };

  for (const entry of characterViolations) {
    counts[entry.violationType]++;
  }

  return counts;
}

// =============================================================================
// HELPER FOR VALIDATION INTEGRATION
// =============================================================================

/**
 * Create and record a violation from validation context.
 *
 * Convenience function for use in validation code.
 *
 * @param params - Violation parameters
 * @returns The recorded violation
 */
export async function createViolationFromValidation(params: {
  characterId: ID;
  campaignId?: ID;
  userId?: ID;
  violationType: ViolationType;
  constraintId: string;
  attemptedAction: string;
  rejectReason: string;
  rulesetSnapshotId?: string;
  enabledBookIds?: string[];
}): Promise<ViolationRecord> {
  return recordViolation({
    characterId: params.characterId,
    campaignId: params.campaignId,
    userId: params.userId,
    violationType: params.violationType,
    severity: "error",
    constraintId: params.constraintId,
    details: {
      attemptedAction: params.attemptedAction,
      rejectReason: params.rejectReason,
      rulesetSnapshotId: params.rulesetSnapshotId,
      enabledBookIds: params.enabledBookIds,
    },
  });
}
