/**
 * Ruleset Snapshot Storage
 *
 * Handles creation, retrieval, and comparison of ruleset snapshots.
 * Snapshots are immutable records that capture the exact state of
 * an edition and its books at a specific point in time.
 *
 * Storage structure:
 *   data/ruleset-snapshots/{snapshotId}.json
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 * @see ADR-004 (Hybrid Snapshot Model)
 * @see ADR-006 (File-Based Persistence)
 */

import path from "path";
import { v4 as uuidv4 } from "uuid";
import type {
  ID,
  EditionCode,
  MergedRuleset,
  RulesetVersionRef,
  DriftReport,
  DriftChange,
  DriftSeverity,
  DriftChangeType,
  AffectedItem,
  MigrationRecommendation,
  MigrationStrategy,
  RuleModuleType,
} from "../types";
import {
  readJsonFile,
  writeJsonFile,
  ensureDirectory,
  fileExists,
  listJsonFiles,
} from "./base";
import { loadRuleset } from "../rules/loader";
import { produceMergedRuleset } from "../rules/merge";
import type { RulesetLoadConfig } from "../rules/loader-types";

const SNAPSHOTS_DIR = path.join(process.cwd(), "data", "ruleset-snapshots");
const CURRENT_SNAPSHOTS_INDEX = path.join(SNAPSHOTS_DIR, "_current-snapshots.json");

/**
 * Index file storing the current snapshot for each edition
 * This avoids expensive directory scans to find the most recent snapshot
 */
type CurrentSnapshotsIndex = Partial<Record<EditionCode, RulesetVersionRef>>;

/**
 * Update the current snapshots index with a new snapshot
 * Called after creating a new snapshot to keep the index up to date
 */
async function updateCurrentSnapshotIndex(
  editionCode: EditionCode,
  versionRef: RulesetVersionRef
): Promise<void> {
  await ensureDirectory(SNAPSHOTS_DIR);

  let index: CurrentSnapshotsIndex = {};

  // Read existing index if it exists
  if (await fileExists(CURRENT_SNAPSHOTS_INDEX)) {
    const existing = await readJsonFile<CurrentSnapshotsIndex>(CURRENT_SNAPSHOTS_INDEX);
    if (existing) {
      index = existing;
    }
  }

  // Update the index for this edition
  index[editionCode] = versionRef;

  // Write updated index
  await writeJsonFile(CURRENT_SNAPSHOTS_INDEX, index);
}

/**
 * Get the current snapshots index (for fast lookups)
 */
async function readCurrentSnapshotIndex(): Promise<CurrentSnapshotsIndex | null> {
  if (!(await fileExists(CURRENT_SNAPSHOTS_INDEX))) {
    return null;
  }
  return readJsonFile<CurrentSnapshotsIndex>(CURRENT_SNAPSHOTS_INDEX);
}

/**
 * Stored snapshot file format
 */
interface StoredSnapshot {
  /** Unique snapshot identifier */
  id: ID;
  /** When the snapshot was created */
  createdAt: string;
  /** The merged ruleset data */
  ruleset: MergedRuleset;
  /** Version reference for this snapshot */
  versionRef: RulesetVersionRef;
}

// =============================================================================
// SNAPSHOT CREATION
// =============================================================================

/**
 * Capture and store a new ruleset snapshot for an edition
 *
 * @param editionCode - The edition to snapshot
 * @param bookIds - Optional specific book IDs to include (defaults to all enabled)
 * @returns The version reference for the created snapshot
 */
export async function captureRulesetSnapshot(
  editionCode: EditionCode,
  bookIds?: ID[]
): Promise<RulesetVersionRef> {
  // Ensure snapshots directory exists
  await ensureDirectory(SNAPSHOTS_DIR);

  // Build config for ruleset loading
  const config: RulesetLoadConfig = {
    editionCode,
    bookIds,
    includeCore: true,
  };

  // Load the current ruleset
  const loadResult = await loadRuleset(config);
  if (!loadResult.success || !loadResult.ruleset) {
    throw new Error(
      loadResult.error || `Failed to load ruleset for edition: ${editionCode}`
    );
  }

  const loadedRuleset = loadResult.ruleset;

  // Merge the ruleset to get final state
  const mergeResult = produceMergedRuleset(loadedRuleset);
  if (!mergeResult.success || !mergeResult.ruleset) {
    throw new Error(
      mergeResult.error || `Failed to merge ruleset for edition: ${editionCode}`
    );
  }

  const mergedRuleset = mergeResult.ruleset;

  // Create version reference
  const snapshotId = uuidv4();
  const now = new Date().toISOString();

  const bookVersions: Record<ID, string> = {};
  for (const book of loadedRuleset.books) {
    // Get version from payload metadata or default to "1.0.0"
    bookVersions[book.id] = book.payload?.meta?.version || "1.0.0";
  }

  const versionRef: RulesetVersionRef = {
    editionCode,
    editionVersion: loadedRuleset.edition.version,
    bookVersions,
    snapshotId,
    createdAt: now,
  };

  // Store the snapshot
  const storedSnapshot: StoredSnapshot = {
    id: snapshotId,
    createdAt: now,
    ruleset: { ...mergedRuleset, snapshotId },
    versionRef,
  };

  const filePath = path.join(SNAPSHOTS_DIR, `${snapshotId}.json`);
  await writeJsonFile(filePath, storedSnapshot);

  // Update the current snapshot index for fast lookups
  await updateCurrentSnapshotIndex(editionCode, versionRef);

  return versionRef;
}

// =============================================================================
// SNAPSHOT RETRIEVAL
// =============================================================================

/**
 * Result of reading a complete snapshot with both ruleset and version ref
 */
export interface SnapshotWithVersionRef {
  ruleset: MergedRuleset;
  versionRef: RulesetVersionRef;
}

/**
 * Get both ruleset and version ref from a snapshot in a single read
 *
 * OPTIMIZATION: This avoids reading the same file twice when both
 * the ruleset and version ref are needed.
 *
 * @param snapshotId - The snapshot ID to retrieve
 * @returns The ruleset and version ref, or null if not found
 */
export async function getSnapshotWithVersionRef(
  snapshotId: ID
): Promise<SnapshotWithVersionRef | null> {
  const filePath = path.join(SNAPSHOTS_DIR, `${snapshotId}.json`);

  if (!(await fileExists(filePath))) {
    return null;
  }

  const stored = await readJsonFile<StoredSnapshot>(filePath);
  if (!stored?.ruleset || !stored?.versionRef) {
    return null;
  }

  return {
    ruleset: stored.ruleset,
    versionRef: stored.versionRef,
  };
}

/**
 * Get a ruleset snapshot by its ID
 *
 * @param snapshotId - The snapshot ID to retrieve
 * @returns The merged ruleset from the snapshot, or null if not found
 */
export async function getRulesetSnapshot(
  snapshotId: ID
): Promise<MergedRuleset | null> {
  const filePath = path.join(SNAPSHOTS_DIR, `${snapshotId}.json`);

  if (!(await fileExists(filePath))) {
    return null;
  }

  const stored = await readJsonFile<StoredSnapshot>(filePath);
  return stored?.ruleset || null;
}

/**
 * Get the version reference for a snapshot
 *
 * @param snapshotId - The snapshot ID
 * @returns The version reference, or null if not found
 */
export async function getSnapshotVersionRef(
  snapshotId: ID
): Promise<RulesetVersionRef | null> {
  const filePath = path.join(SNAPSHOTS_DIR, `${snapshotId}.json`);

  if (!(await fileExists(filePath))) {
    return null;
  }

  const stored = await readJsonFile<StoredSnapshot>(filePath);
  return stored?.versionRef || null;
}

/**
 * Get the most recent (current) snapshot for an edition
 *
 * @param editionCode - The edition code
 * @returns The current version reference, or null if no snapshots exist
 */
export async function getCurrentSnapshot(
  editionCode: EditionCode
): Promise<RulesetVersionRef | null> {
  // OPTIMIZATION: Try the index first (single file read vs directory scan)
  const index = await readCurrentSnapshotIndex();
  if (index && index[editionCode]) {
    return index[editionCode];
  }

  // Fallback: scan all snapshots (needed for legacy data or first run)
  const snapshots = await listAllSnapshots(editionCode);

  if (snapshots.length === 0) {
    return null;
  }

  // Sort by creation date descending and return the most recent
  snapshots.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const currentSnapshot = snapshots[0];

  // Update the index for next time
  await updateCurrentSnapshotIndex(editionCode, currentSnapshot);

  return currentSnapshot;
}

/**
 * List all snapshots for an edition
 *
 * @param editionCode - The edition code to filter by
 * @returns Array of version references for all snapshots of this edition
 */
export async function listAllSnapshots(
  editionCode: EditionCode
): Promise<RulesetVersionRef[]> {
  if (!(await fileExists(SNAPSHOTS_DIR))) {
    return [];
  }

  const snapshotIds = await listJsonFiles(SNAPSHOTS_DIR);
  const versionRefs: RulesetVersionRef[] = [];

  for (const snapshotId of snapshotIds) {
    const versionRef = await getSnapshotVersionRef(snapshotId);
    if (versionRef && versionRef.editionCode === editionCode) {
      versionRefs.push(versionRef);
    }
  }

  return versionRefs;
}

// =============================================================================
// SNAPSHOT COMPARISON (DRIFT DETECTION)
// =============================================================================

/**
 * Compare two snapshots to detect drift between them
 *
 * @param baseSnapshotId - The base/character's snapshot ID
 * @param targetSnapshotId - The target/current snapshot ID
 * @param characterId - The character ID for the report
 * @returns A drift report detailing all changes
 */
export async function compareSnapshots(
  baseSnapshotId: ID,
  targetSnapshotId: ID,
  characterId: ID
): Promise<DriftReport> {
  const baseRuleset = await getRulesetSnapshot(baseSnapshotId);
  const targetRuleset = await getRulesetSnapshot(targetSnapshotId);

  if (!baseRuleset) {
    throw new Error(`Base snapshot not found: ${baseSnapshotId}`);
  }
  if (!targetRuleset) {
    throw new Error(`Target snapshot not found: ${targetSnapshotId}`);
  }

  const baseVersionRef = await getSnapshotVersionRef(baseSnapshotId);
  const targetVersionRef = await getSnapshotVersionRef(targetSnapshotId);

  if (!baseVersionRef || !targetVersionRef) {
    throw new Error("Failed to get version references for snapshots");
  }

  const changes: DriftChange[] = [];

  // Compare each module type
  const moduleTypes = Object.keys({
    ...baseRuleset.modules,
    ...targetRuleset.modules,
  }) as RuleModuleType[];

  for (const moduleType of moduleTypes) {
    const baseModule = baseRuleset.modules[moduleType];
    const targetModule = targetRuleset.modules[moduleType];

    const moduleChanges = compareModule(
      moduleType,
      baseModule || {},
      targetModule || {}
    );
    changes.push(...moduleChanges);
  }

  // Determine overall severity
  const overallSeverity = classifyOverallSeverity(changes);

  // Generate recommendations
  const recommendations = generateRecommendations(changes);

  return {
    id: uuidv4(),
    characterId,
    generatedAt: new Date().toISOString(),
    currentVersion: baseVersionRef,
    targetVersion: targetVersionRef,
    overallSeverity,
    changes,
    recommendations,
  };
}

/**
 * Compare a single module between two snapshots
 */
function compareModule(
  moduleType: RuleModuleType,
  baseModule: Record<string, unknown>,
  targetModule: Record<string, unknown>
): DriftChange[] {
  const changes: DriftChange[] = [];

  const baseKeys = Object.keys(baseModule);
  const targetKeys = Object.keys(targetModule);
  const allKeys = new Set([...baseKeys, ...targetKeys]);

  for (const key of allKeys) {
    const baseValue = baseModule[key];
    const targetValue = targetModule[key];

    // Check for additions
    if (baseValue === undefined && targetValue !== undefined) {
      changes.push(createDriftChange(moduleType, "added", key, null, targetValue));
    }
    // Check for removals
    else if (baseValue !== undefined && targetValue === undefined) {
      changes.push(
        createDriftChange(moduleType, "removed", key, baseValue, null)
      );
    }
    // Check for modifications
    else if (!deepEqual(baseValue, targetValue)) {
      changes.push(
        createDriftChange(moduleType, "modified", key, baseValue, targetValue)
      );
    }
  }

  return changes;
}

/**
 * Create a drift change entry
 */
function createDriftChange(
  module: RuleModuleType,
  changeType: DriftChangeType,
  key: string,
  previousValue: unknown,
  currentValue: unknown
): DriftChange {
  const severity = classifyChangeSeverity(changeType, previousValue, currentValue);

  const affectedItems: AffectedItem[] = [
    {
      itemId: key,
      itemType: module,
      previousValue,
      currentValue,
    },
  ];

  return {
    id: uuidv4(),
    module,
    changeType,
    severity,
    affectedItems,
    description: generateChangeDescription(changeType, module, key),
  };
}

/**
 * Classify the severity of a single change
 */
function classifyChangeSeverity(
  changeType: DriftChangeType,
  _previousValue: unknown,
  _currentValue: unknown
): DriftSeverity {
  switch (changeType) {
    case "added":
      // New items are always non-breaking
      return "non-breaking";

    case "removed":
      // Removals are always breaking
      return "breaking";

    case "renamed":
    case "restructured":
      // Structural changes are breaking
      return "breaking";

    case "deprecated":
      // Deprecations are warnings, not breaking yet
      return "non-breaking";

    case "modified":
      // For now, treat all modifications as potentially breaking
      // A more sophisticated analysis could check if values increased/decreased
      return "breaking";

    default:
      return "non-breaking";
  }
}

/**
 * Classify overall severity from all changes
 */
function classifyOverallSeverity(changes: DriftChange[]): DriftSeverity {
  if (changes.length === 0) {
    return "none";
  }

  const hasBreaking = changes.some((c) => c.severity === "breaking");
  return hasBreaking ? "breaking" : "non-breaking";
}

/**
 * Generate human-readable description for a change
 */
function generateChangeDescription(
  changeType: DriftChangeType,
  module: RuleModuleType,
  key: string
): string {
  switch (changeType) {
    case "added":
      return `New ${module} item added: ${key}`;
    case "removed":
      return `${module} item removed: ${key}`;
    case "renamed":
      return `${module} item renamed: ${key}`;
    case "modified":
      return `${module} item modified: ${key}`;
    case "restructured":
      return `${module} structure changed: ${key}`;
    case "deprecated":
      return `${module} item deprecated: ${key}`;
    default:
      return `${module} change detected: ${key}`;
  }
}

/**
 * Generate migration recommendations for detected changes
 */
function generateRecommendations(
  changes: DriftChange[]
): MigrationRecommendation[] {
  return changes.map((change) => {
    const strategy = determineStrategy(change);
    const autoApplicable = strategy === "auto-update";
    const requiresUserChoice = strategy === "manual-select";

    return {
      changeId: change.id,
      strategy,
      description: generateRecommendationDescription(change, strategy),
      autoApplicable,
      requiresUserChoice,
    };
  });
}

/**
 * Determine the migration strategy for a change
 */
function determineStrategy(change: DriftChange): MigrationStrategy {
  switch (change.changeType) {
    case "added":
      // No action needed for new items
      return "auto-update";

    case "removed":
      // User must decide what to do with removed items
      return "manual-select";

    case "renamed":
      // User might want to select the renamed item
      return "manual-select";

    case "modified":
      // Depends on severity
      return change.severity === "breaking" ? "manual-select" : "auto-update";

    case "deprecated":
      // Warn but don't require action yet
      return "auto-update";

    case "restructured":
      // Major changes need user attention
      return "manual-select";

    default:
      return "auto-update";
  }
}

/**
 * Generate description for a migration recommendation
 */
function generateRecommendationDescription(
  change: DriftChange,
  strategy: MigrationStrategy
): string {
  switch (strategy) {
    case "auto-update":
      return `This change can be applied automatically: ${change.description}`;
    case "manual-select":
      return `User action required: ${change.description}`;
    case "archive":
      return `This item will be moved to legacy storage: ${change.description}`;
    case "remove":
      return `This item will be removed: ${change.description}`;
    default:
      return change.description;
  }
}

/**
 * Deep equality check for objects
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === "object" && typeof b === "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
      if (!deepEqual(aObj[key], bObj[key])) return false;
    }
    return true;
  }

  return false;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a snapshot exists
 */
export async function snapshotExists(snapshotId: ID): Promise<boolean> {
  const filePath = path.join(SNAPSHOTS_DIR, `${snapshotId}.json`);
  return fileExists(filePath);
}

/**
 * Delete a snapshot (for cleanup/testing purposes)
 */
export async function deleteSnapshot(snapshotId: ID): Promise<boolean> {
  const filePath = path.join(SNAPSHOTS_DIR, `${snapshotId}.json`);
  if (await fileExists(filePath)) {
    const fs = await import("fs/promises");
    await fs.unlink(filePath);
    return true;
  }
  return false;
}
