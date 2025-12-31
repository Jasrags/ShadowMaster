/**
 * Request-Scoped Snapshot Cache
 *
 * Caches ruleset snapshots and version references for the duration of a single
 * API request to avoid redundant file reads. Each request should create a new
 * instance of this cache.
 *
 * @example
 * // In an API route:
 * const cache = new SnapshotCache();
 * const report = await analyzeCharacterDrift(character, cache);
 *
 * @see docs/capabilities/plans/ruleset.sync-performance-optimization.implementation-plan.md
 */

import type { ID, EditionCode, MergedRuleset, RulesetVersionRef } from "../types";
import {
  getRulesetSnapshot as getRulesetSnapshotFromDisk,
  getCurrentSnapshot as getCurrentSnapshotFromDisk,
  getSnapshotVersionRef as getSnapshotVersionRefFromDisk,
  getSnapshotWithVersionRef as getSnapshotWithVersionRefFromDisk,
} from "./ruleset-snapshots";

/**
 * Request-scoped cache for ruleset snapshots
 *
 * Prevents redundant disk reads when the same snapshot is accessed
 * multiple times during a single request (e.g., during drift analysis).
 */
export class SnapshotCache {
  private rulesetCache = new Map<ID, MergedRuleset>();
  private versionRefCache = new Map<ID, RulesetVersionRef>();
  private currentSnapshotCache = new Map<EditionCode, RulesetVersionRef>();

  /**
   * Get a ruleset snapshot by ID, using cache if available
   */
  async getRulesetSnapshot(snapshotId: ID): Promise<MergedRuleset | null> {
    // Check cache first
    if (this.rulesetCache.has(snapshotId)) {
      return this.rulesetCache.get(snapshotId)!;
    }

    // Load from disk
    const ruleset = await getRulesetSnapshotFromDisk(snapshotId);
    if (ruleset) {
      this.rulesetCache.set(snapshotId, ruleset);
    }
    return ruleset;
  }

  /**
   * Get a version ref by snapshot ID, using cache if available
   */
  async getSnapshotVersionRef(snapshotId: ID): Promise<RulesetVersionRef | null> {
    // Check cache first
    if (this.versionRefCache.has(snapshotId)) {
      return this.versionRefCache.get(snapshotId)!;
    }

    // Load from disk
    const versionRef = await getSnapshotVersionRefFromDisk(snapshotId);
    if (versionRef) {
      this.versionRefCache.set(snapshotId, versionRef);
    }
    return versionRef;
  }

  /**
   * Get both ruleset and version ref in a single operation
   *
   * OPTIMIZATION: This reads the snapshot file once and caches both pieces,
   * avoiding separate reads when both are needed (e.g., during drift analysis).
   */
  async getSnapshotWithVersionRef(
    snapshotId: ID
  ): Promise<{ ruleset: MergedRuleset; versionRef: RulesetVersionRef } | null> {
    // Check if we already have both cached
    const cachedRuleset = this.rulesetCache.get(snapshotId);
    const cachedVersionRef = this.versionRefCache.get(snapshotId);

    if (cachedRuleset && cachedVersionRef) {
      return { ruleset: cachedRuleset, versionRef: cachedVersionRef };
    }

    // Load both from disk in a single read
    const result = await getSnapshotWithVersionRefFromDisk(snapshotId);
    if (result) {
      this.rulesetCache.set(snapshotId, result.ruleset);
      this.versionRefCache.set(snapshotId, result.versionRef);
    }
    return result;
  }

  /**
   * Get the current snapshot for an edition, using cache if available
   */
  async getCurrentSnapshot(editionCode: EditionCode): Promise<RulesetVersionRef | null> {
    // Check cache first
    if (this.currentSnapshotCache.has(editionCode)) {
      return this.currentSnapshotCache.get(editionCode)!;
    }

    // Load from disk (or index)
    const versionRef = await getCurrentSnapshotFromDisk(editionCode);
    if (versionRef) {
      this.currentSnapshotCache.set(editionCode, versionRef);
      // Also cache the version ref by snapshot ID for later lookups
      this.versionRefCache.set(versionRef.snapshotId, versionRef);
    }
    return versionRef;
  }

  /**
   * Pre-warm the cache with a ruleset snapshot
   * Useful when you've already loaded a snapshot and want to cache it
   */
  cacheRuleset(snapshotId: ID, ruleset: MergedRuleset): void {
    this.rulesetCache.set(snapshotId, ruleset);
  }

  /**
   * Pre-warm the cache with a version ref
   */
  cacheVersionRef(snapshotId: ID, versionRef: RulesetVersionRef): void {
    this.versionRefCache.set(snapshotId, versionRef);
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.rulesetCache.clear();
    this.versionRefCache.clear();
    this.currentSnapshotCache.clear();
  }

  /**
   * Get cache statistics for debugging
   */
  getStats(): { rulesets: number; versionRefs: number; currentSnapshots: number } {
    return {
      rulesets: this.rulesetCache.size,
      versionRefs: this.versionRefCache.size,
      currentSnapshots: this.currentSnapshotCache.size,
    };
  }
}
