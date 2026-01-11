# Sync Performance Optimization Implementation Plan

## Overview

This plan addresses the ~30 second drift check times in the System Synchronization feature. The optimizations are divided into three phases, targeting duplicate I/O operations, redundant computations, and caching strategies.

**Current State:** Each shield/drift check takes ~30 seconds
**Target State:** Reduce to ~3-5 seconds for most cases

---

## Phase 1: Quick Wins (High Impact, Low Risk)

**Estimated Improvement:** 15-20 seconds
**Effort:** 1-2 days

### 1.1 Early Exit for Matching Snapshot IDs

**Problem:** Full drift analysis runs even when character uses the current ruleset snapshot.

**Solution:** Add early exit check in `analyzeCharacterDrift()`.

**Files to modify:**

- `lib/rules/sync/drift-analyzer.ts`

**Implementation:**

```typescript
// In analyzeCharacterDrift(), after getting currentVersionRef:
if (character.rulesetSnapshotId === currentVersionRef.snapshotId) {
  // Character is already on current snapshot - no drift possible
  return {
    id: uuidv4(),
    characterId: character.id,
    analyzedAt: new Date().toISOString(),
    baseVersion: currentVersionRef,
    currentVersion: currentVersionRef,
    changes: [],
    overallSeverity: "non-breaking",
    recommendations: [],
  };
}
```

**Expected Impact:** Eliminates ~25 seconds for characters already synchronized.

---

### 1.2 Current Snapshot Metadata Index

**Problem:** `getCurrentSnapshot()` scans ALL snapshot files to find the current one.

**Solution:** Maintain a `_current-snapshots.json` index file.

**Files to modify:**

- `lib/storage/ruleset-snapshots.ts`

**Implementation:**

```typescript
// New file structure: data/ruleset-snapshots/_current-snapshots.json
{
  "sr5": {
    "snapshotId": "uuid-xxx",
    "editionCode": "sr5",
    "editionVersion": "1.0.0",
    "createdAt": "2025-12-31T10:00:00Z"
  }
}

// Update getCurrentSnapshot():
export async function getCurrentSnapshot(editionCode: EditionCode): Promise<RulesetVersionRef | null> {
  const indexPath = path.join(SNAPSHOTS_DIR, "_current-snapshots.json");

  if (await fileExists(indexPath)) {
    const index = await readJsonFile<Record<EditionCode, RulesetVersionRef>>(indexPath);
    if (index?.[editionCode]) {
      return index[editionCode];
    }
  }

  // Fallback to scan (and rebuild index)
  const versionRef = await getCurrentSnapshotScan(editionCode);
  if (versionRef) {
    await updateCurrentSnapshotIndex(editionCode, versionRef);
  }
  return versionRef;
}

// Update captureRulesetSnapshot() to also update the index
```

**Expected Impact:** Eliminates directory scan (~2-3 seconds).

---

### 1.3 Request-Scoped Snapshot Cache

**Problem:** Same snapshot files are read 3-5 times during a single API request.

**Solution:** Create a cache class that lives for the duration of one request.

**Files to create:**

- `lib/storage/snapshot-cache.ts`

**Files to modify:**

- `lib/rules/sync/drift-analyzer.ts`
- `lib/rules/sync/legality-validator.ts`
- `app/api/characters/[characterId]/sync/route.ts`
- `app/api/characters/[characterId]/sync/shield/route.ts`

**Implementation:**

```typescript
// lib/storage/snapshot-cache.ts
export class SnapshotCache {
  private rulesetCache = new Map<ID, MergedRuleset>();
  private versionRefCache = new Map<ID, RulesetVersionRef>();
  private currentSnapshotCache = new Map<EditionCode, RulesetVersionRef>();

  async getRulesetSnapshot(snapshotId: ID): Promise<MergedRuleset | null> {
    if (this.rulesetCache.has(snapshotId)) {
      return this.rulesetCache.get(snapshotId)!;
    }
    const ruleset = await getRulesetSnapshotFromDisk(snapshotId);
    if (ruleset) this.rulesetCache.set(snapshotId, ruleset);
    return ruleset;
  }

  async getCurrentSnapshot(editionCode: EditionCode): Promise<RulesetVersionRef | null> {
    if (this.currentSnapshotCache.has(editionCode)) {
      return this.currentSnapshotCache.get(editionCode)!;
    }
    const versionRef = await getCurrentSnapshotFromDisk(editionCode);
    if (versionRef) this.currentSnapshotCache.set(editionCode, versionRef);
    return versionRef;
  }
}

// In API routes:
const cache = new SnapshotCache();
const report = await analyzeCharacterDrift(character, cache);
```

**Expected Impact:** Eliminates 3-5 duplicate disk reads (~5-10 seconds).

---

### 1.4 Combined Snapshot + VersionRef Read

**Problem:** `getRulesetSnapshot()` and `getSnapshotVersionRef()` read the same file twice.

**Solution:** Create a single function that returns both.

**Files to modify:**

- `lib/storage/ruleset-snapshots.ts`

**Implementation:**

```typescript
export interface SnapshotWithRef {
  ruleset: MergedRuleset;
  versionRef: RulesetVersionRef;
}

export async function getSnapshotWithRef(snapshotId: ID): Promise<SnapshotWithRef | null> {
  const filePath = path.join(SNAPSHOTS_DIR, `${snapshotId}.json`);
  if (!(await fileExists(filePath))) {
    return null;
  }

  const stored = await readJsonFile<StoredSnapshot>(filePath);
  if (!stored) return null;

  return {
    ruleset: stored.ruleset,
    versionRef: stored.versionRef,
  };
}
```

**Expected Impact:** Saves 1-2 disk reads per snapshot (~1-2 seconds).

---

## Phase 2: Medium Effort Optimizations

**Estimated Improvement:** Additional 5-10 seconds
**Effort:** 2-3 days

### 2.1 Lazy Drift Analysis in Shield Endpoint

**Problem:** Shield endpoint runs full drift analysis even when not needed.

**Solution:** Only run drift analysis when `syncStatus` is unknown or outdated.

**Files to modify:**

- `lib/rules/sync/legality-validator.ts`

**Implementation:**

```typescript
export async function getLegalityShield(
  character: Character,
  cache?: SnapshotCache
): Promise<StabilityShield> {
  // Quick checks first (no I/O needed)
  if (character.status === "draft") {
    return { status: "yellow", label: "Draft", tooltip: "..." };
  }

  if (character.status === "retired") {
    return { status: "yellow", label: "Retired", tooltip: "..." };
  }

  if (character.syncStatus === "synchronized") {
    return { status: "green", label: "Valid", tooltip: "..." };
  }

  if (character.syncStatus === "invalid") {
    return { status: "red", label: "Invalid", tooltip: "..." };
  }

  // Only run expensive validation if status is unknown
  if (character.syncStatus === undefined) {
    const validation = await validateRulesLegality(character, cache);
    // ... rest of validation logic
  }

  // Default for unknown states
  return { status: "yellow", label: "Unknown", tooltip: "..." };
}
```

**Expected Impact:** Skips ~25 seconds for characters with known status.

---

### 2.2 Structural Hash Comparison

**Problem:** `compareRulesetModules()` does deep equality checks on entire module trees.

**Solution:** Use SHA256 hashes to quickly detect unchanged modules.

**Files to create:**

- `lib/rules/sync/structural-hash.ts`

**Files to modify:**

- `lib/storage/ruleset-snapshots.ts`

**Implementation:**

```typescript
// lib/rules/sync/structural-hash.ts
import crypto from "crypto";

export function getStructuralHash(obj: unknown): string {
  const json = JSON.stringify(obj, Object.keys(obj as object).sort());
  return crypto.createHash("sha256").update(json).digest("hex");
}

// In compareSnapshots():
function compareModuleWithHash(
  moduleType: RuleModuleType,
  baseModule: unknown,
  targetModule: unknown
): DriftChange[] {
  const baseHash = getStructuralHash(baseModule);
  const targetHash = getStructuralHash(targetModule);

  if (baseHash === targetHash) {
    return []; // No changes - skip detailed comparison
  }

  // Only do key-by-key comparison if hashes differ
  return compareModuleKeys(moduleType, baseModule, targetModule);
}
```

**Expected Impact:** Eliminates deep traversal for unchanged modules (~3-5 seconds).

---

### 2.3 Drift Analysis Memoization

**Problem:** Same character's drift is analyzed multiple times in one request.

**Solution:** Memoize results within request scope.

**Files to modify:**

- `lib/storage/snapshot-cache.ts` (extend with drift cache)

**Implementation:**

```typescript
export class SnapshotCache {
  // ... existing caches ...
  private driftCache = new Map<ID, DriftReport>();

  async getDriftReport(character: Character): Promise<DriftReport> {
    if (this.driftCache.has(character.id)) {
      return this.driftCache.get(character.id)!;
    }

    const report = await analyzeCharacterDrift(character, this);
    this.driftCache.set(character.id, report);
    return report;
  }
}
```

**Expected Impact:** Eliminates duplicate analysis (~2-3 seconds on redundant calls).

---

## Phase 3: Long-term Optimizations

**Estimated Improvement:** Additional 5 seconds + better scalability
**Effort:** 1-2 weeks

### 3.1 Global In-Memory Cache with TTL

**Problem:** Snapshot data is reloaded from disk on every request.

**Solution:** Implement a global cache with 5-minute TTL.

**Files to create:**

- `lib/storage/global-snapshot-cache.ts`

**Implementation:**

```typescript
interface CacheEntry<T> {
  data: T;
  loadedAt: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class GlobalSnapshotCache {
  private static instance: GlobalSnapshotCache;
  private cache = new Map<string, CacheEntry<unknown>>();

  static getInstance(): GlobalSnapshotCache {
    if (!this.instance) {
      this.instance = new GlobalSnapshotCache();
    }
    return this.instance;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.loadedAt > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, loadedAt: Date.now() });
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}
```

**Expected Impact:** Near-instant responses for repeated requests (~10-15 seconds saved on cache hits).

---

### 3.2 Parallel Drift Analysis

**Problem:** Metatype, skill, and quality drift are analyzed sequentially.

**Solution:** Run analyses in parallel using `Promise.all()`.

**Files to modify:**

- `lib/rules/sync/drift-analyzer.ts`

**Implementation:**

```typescript
export async function analyzeCharacterDrift(
  character: Character,
  cache?: SnapshotCache
): Promise<DriftReport> {
  // ... snapshot loading ...

  // Run analyses in parallel
  const [metatypeChanges, skillChanges, qualityChanges] = await Promise.all([
    analyzeMetatypeDrift(character, characterSnapshot, currentRuleset),
    analyzeSkillDrift(character, characterSnapshot, currentRuleset),
    analyzeQualityDrift(character, characterSnapshot, currentRuleset),
  ]);

  const changes = [...metatypeChanges, ...skillChanges, ...qualityChanges];
  // ... rest of function
}
```

**Expected Impact:** ~1-2 seconds (parallelizes CPU-bound operations).

---

### 3.3 Snapshot Edition Index

**Problem:** No way to quickly find snapshots for a specific edition.

**Solution:** Organize snapshots by edition in the file structure.

**Current structure:**

```
data/ruleset-snapshots/
  uuid-1.json
  uuid-2.json
  ...
```

**Proposed structure:**

```
data/ruleset-snapshots/
  _current-snapshots.json
  sr5/
    uuid-1.json
    uuid-2.json
  sr6/
    uuid-3.json
```

**Expected Impact:** O(1) edition lookup instead of O(n) directory scan.

---

## Testing Strategy

### Performance Benchmarks

Create a test file to measure improvement:

```typescript
// __tests__/performance/sync-performance.test.ts
describe("Sync Performance", () => {
  it("should complete drift analysis in under 5 seconds", async () => {
    const start = Date.now();
    await analyzeCharacterDrift(testCharacter);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000);
  });

  it("should return shield status in under 1 second with cache", async () => {
    const cache = new SnapshotCache();
    const start = Date.now();
    await getLegalityShield(testCharacter, cache);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000);
  });
});
```

### Regression Tests

- Ensure drift detection still catches all change types
- Verify shield colors match expected states
- Test cache invalidation on snapshot updates

---

## Summary

| Phase | Optimization                 | Expected Savings | Effort    |
| ----- | ---------------------------- | ---------------- | --------- |
| 1.1   | Early exit for matching IDs  | 15-25s           | 1 hour    |
| 1.2   | Current snapshot index       | 2-3s             | 2-3 hours |
| 1.3   | Request-scoped cache         | 5-10s            | 4-6 hours |
| 1.4   | Combined snapshot read       | 1-2s             | 1-2 hours |
| 2.1   | Lazy drift analysis          | 5-10s            | 2-3 hours |
| 2.2   | Structural hash comparison   | 3-5s             | 4-6 hours |
| 2.3   | Drift memoization            | 2-3s             | 2-3 hours |
| 3.1   | Global cache with TTL        | 10-15s (repeat)  | 1 day     |
| 3.2   | Parallel analysis            | 1-2s             | 2-3 hours |
| 3.3   | Edition-based file structure | O(1) lookup      | 1 day     |

**Total Expected Improvement:** ~30s → ~3-5s (Phase 1-2), with sub-second responses on cache hits (Phase 3).
