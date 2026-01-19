/**
 * Unit tests for snapshot-cache.ts storage module
 *
 * Tests the request-scoped snapshot cache using VI mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MergedRuleset, RulesetVersionRef, EditionCode } from "@/lib/types";

// Mock the ruleset-snapshots module
vi.mock("../ruleset-snapshots", () => ({
  getRulesetSnapshot: vi.fn(),
  getCurrentSnapshot: vi.fn(),
  getSnapshotVersionRef: vi.fn(),
  getSnapshotWithVersionRef: vi.fn(),
}));

// Import after mocking
import { SnapshotCache } from "../snapshot-cache";
import * as rulesetSnapshots from "../ruleset-snapshots";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockRuleset(snapshotId: string): MergedRuleset {
  return {
    snapshotId,
    editionId: "sr5-edition",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {},
    createdAt: new Date().toISOString(),
  };
}

function createMockVersionRef(snapshotId: string): RulesetVersionRef {
  return {
    editionCode: "sr5",
    editionVersion: "1.0.0",
    bookVersions: { "core-rulebook": "1.0.0" },
    snapshotId,
    createdAt: new Date().toISOString(),
  };
}

// =============================================================================
// SETUP
// =============================================================================

beforeEach(() => {
  vi.clearAllMocks();
});

// =============================================================================
// GET RULESET SNAPSHOT TESTS
// =============================================================================

describe("getRulesetSnapshot", () => {
  it("should return cached ruleset on cache hit", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "snapshot-1";
    const ruleset = createMockRuleset(snapshotId);

    // Pre-warm the cache
    cache.cacheRuleset(snapshotId, ruleset);

    const result = await cache.getRulesetSnapshot(snapshotId);

    expect(result).toBe(ruleset);
    expect(rulesetSnapshots.getRulesetSnapshot).not.toHaveBeenCalled();
  });

  it("should load from disk on cache miss", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "snapshot-2";
    const ruleset = createMockRuleset(snapshotId);

    vi.mocked(rulesetSnapshots.getRulesetSnapshot).mockResolvedValueOnce(ruleset);

    const result = await cache.getRulesetSnapshot(snapshotId);

    expect(result).toEqual(ruleset);
    expect(rulesetSnapshots.getRulesetSnapshot).toHaveBeenCalledWith(snapshotId);
  });

  it("should cache ruleset after loading from disk", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "snapshot-3";
    const ruleset = createMockRuleset(snapshotId);

    vi.mocked(rulesetSnapshots.getRulesetSnapshot).mockResolvedValueOnce(ruleset);

    // First call - loads from disk
    await cache.getRulesetSnapshot(snapshotId);

    // Second call - should be cached
    await cache.getRulesetSnapshot(snapshotId);

    expect(rulesetSnapshots.getRulesetSnapshot).toHaveBeenCalledTimes(1);
  });

  it("should return null for non-existent snapshot", async () => {
    const cache = new SnapshotCache();

    vi.mocked(rulesetSnapshots.getRulesetSnapshot).mockResolvedValueOnce(null);

    const result = await cache.getRulesetSnapshot("non-existent");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET SNAPSHOT VERSION REF TESTS
// =============================================================================

describe("getSnapshotVersionRef", () => {
  it("should return cached version ref on cache hit", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "snapshot-1";
    const versionRef = createMockVersionRef(snapshotId);

    // Pre-warm the cache
    cache.cacheVersionRef(snapshotId, versionRef);

    const result = await cache.getSnapshotVersionRef(snapshotId);

    expect(result).toBe(versionRef);
    expect(rulesetSnapshots.getSnapshotVersionRef).not.toHaveBeenCalled();
  });

  it("should load from disk on cache miss", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "snapshot-2";
    const versionRef = createMockVersionRef(snapshotId);

    vi.mocked(rulesetSnapshots.getSnapshotVersionRef).mockResolvedValueOnce(versionRef);

    const result = await cache.getSnapshotVersionRef(snapshotId);

    expect(result).toEqual(versionRef);
    expect(rulesetSnapshots.getSnapshotVersionRef).toHaveBeenCalledWith(snapshotId);
  });

  it("should return null for non-existent snapshot", async () => {
    const cache = new SnapshotCache();

    vi.mocked(rulesetSnapshots.getSnapshotVersionRef).mockResolvedValueOnce(null);

    const result = await cache.getSnapshotVersionRef("non-existent");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET SNAPSHOT WITH VERSION REF TESTS
// =============================================================================

describe("getSnapshotWithVersionRef", () => {
  it("should return both cached ruleset and version ref", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "snapshot-1";
    const ruleset = createMockRuleset(snapshotId);
    const versionRef = createMockVersionRef(snapshotId);

    // Pre-warm both caches
    cache.cacheRuleset(snapshotId, ruleset);
    cache.cacheVersionRef(snapshotId, versionRef);

    const result = await cache.getSnapshotWithVersionRef(snapshotId);

    expect(result).toEqual({ ruleset, versionRef });
    expect(rulesetSnapshots.getSnapshotWithVersionRef).not.toHaveBeenCalled();
  });

  it("should load both from disk on cache miss", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "snapshot-2";
    const ruleset = createMockRuleset(snapshotId);
    const versionRef = createMockVersionRef(snapshotId);

    vi.mocked(rulesetSnapshots.getSnapshotWithVersionRef).mockResolvedValueOnce({
      ruleset,
      versionRef,
    });

    const result = await cache.getSnapshotWithVersionRef(snapshotId);

    expect(result).toEqual({ ruleset, versionRef });
    expect(rulesetSnapshots.getSnapshotWithVersionRef).toHaveBeenCalledWith(snapshotId);
  });

  it("should cache both after loading from disk", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "snapshot-3";
    const ruleset = createMockRuleset(snapshotId);
    const versionRef = createMockVersionRef(snapshotId);

    vi.mocked(rulesetSnapshots.getSnapshotWithVersionRef).mockResolvedValueOnce({
      ruleset,
      versionRef,
    });

    // First call - loads from disk
    await cache.getSnapshotWithVersionRef(snapshotId);

    // Verify both are now cached - subsequent calls to individual getters shouldn't hit disk
    vi.mocked(rulesetSnapshots.getRulesetSnapshot).mockClear();
    vi.mocked(rulesetSnapshots.getSnapshotVersionRef).mockClear();

    await cache.getRulesetSnapshot(snapshotId);
    await cache.getSnapshotVersionRef(snapshotId);

    expect(rulesetSnapshots.getRulesetSnapshot).not.toHaveBeenCalled();
    expect(rulesetSnapshots.getSnapshotVersionRef).not.toHaveBeenCalled();
  });

  it("should return null for non-existent snapshot", async () => {
    const cache = new SnapshotCache();

    vi.mocked(rulesetSnapshots.getSnapshotWithVersionRef).mockResolvedValueOnce(null);

    const result = await cache.getSnapshotWithVersionRef("non-existent");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET CURRENT SNAPSHOT TESTS
// =============================================================================

describe("getCurrentSnapshot", () => {
  it("should return cached current snapshot on cache hit", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "current-snapshot";
    const versionRef = createMockVersionRef(snapshotId);

    // Pre-load the cache using getCurrentSnapshot
    vi.mocked(rulesetSnapshots.getCurrentSnapshot).mockResolvedValueOnce(versionRef);
    await cache.getCurrentSnapshot("sr5");

    // Clear mock to verify cache hit
    vi.mocked(rulesetSnapshots.getCurrentSnapshot).mockClear();

    const result = await cache.getCurrentSnapshot("sr5");

    expect(result).toEqual(versionRef);
    expect(rulesetSnapshots.getCurrentSnapshot).not.toHaveBeenCalled();
  });

  it("should load from disk on cache miss", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "current-snapshot";
    const versionRef = createMockVersionRef(snapshotId);

    vi.mocked(rulesetSnapshots.getCurrentSnapshot).mockResolvedValueOnce(versionRef);

    const result = await cache.getCurrentSnapshot("sr5");

    expect(result).toEqual(versionRef);
    expect(rulesetSnapshots.getCurrentSnapshot).toHaveBeenCalledWith("sr5");
  });

  it("should also cache version ref by snapshot ID", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "current-snapshot";
    const versionRef = createMockVersionRef(snapshotId);

    vi.mocked(rulesetSnapshots.getCurrentSnapshot).mockResolvedValueOnce(versionRef);

    await cache.getCurrentSnapshot("sr5");

    // The version ref should also be cached by snapshot ID
    vi.mocked(rulesetSnapshots.getSnapshotVersionRef).mockClear();
    const result = await cache.getSnapshotVersionRef(snapshotId);

    expect(result).toEqual(versionRef);
    expect(rulesetSnapshots.getSnapshotVersionRef).not.toHaveBeenCalled();
  });

  it("should return null for non-existent edition", async () => {
    const cache = new SnapshotCache();

    vi.mocked(rulesetSnapshots.getCurrentSnapshot).mockResolvedValueOnce(null);

    const result = await cache.getCurrentSnapshot("non-existent" as EditionCode);

    expect(result).toBeNull();
  });
});

// =============================================================================
// CACHE RULESET / CACHE VERSION REF TESTS
// =============================================================================

describe("cacheRuleset", () => {
  it("should pre-warm the cache with a ruleset", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "pre-warmed";
    const ruleset = createMockRuleset(snapshotId);

    cache.cacheRuleset(snapshotId, ruleset);

    const result = await cache.getRulesetSnapshot(snapshotId);

    expect(result).toBe(ruleset);
    expect(rulesetSnapshots.getRulesetSnapshot).not.toHaveBeenCalled();
  });
});

describe("cacheVersionRef", () => {
  it("should pre-warm the cache with a version ref", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "pre-warmed";
    const versionRef = createMockVersionRef(snapshotId);

    cache.cacheVersionRef(snapshotId, versionRef);

    const result = await cache.getSnapshotVersionRef(snapshotId);

    expect(result).toBe(versionRef);
    expect(rulesetSnapshots.getSnapshotVersionRef).not.toHaveBeenCalled();
  });
});

// =============================================================================
// CLEAR TESTS
// =============================================================================

describe("clear", () => {
  it("should clear all caches", async () => {
    const cache = new SnapshotCache();
    const snapshotId = "cached-data";
    const ruleset = createMockRuleset(snapshotId);
    const versionRef = createMockVersionRef(snapshotId);

    // Pre-warm all caches
    cache.cacheRuleset(snapshotId, ruleset);
    cache.cacheVersionRef(snapshotId, versionRef);

    // Verify data is cached
    expect(cache.getStats().rulesets).toBe(1);
    expect(cache.getStats().versionRefs).toBe(1);

    // Clear
    cache.clear();

    // Verify cache is empty
    const stats = cache.getStats();
    expect(stats.rulesets).toBe(0);
    expect(stats.versionRefs).toBe(0);
    expect(stats.currentSnapshots).toBe(0);
  });
});

// =============================================================================
// GET STATS TESTS
// =============================================================================

describe("getStats", () => {
  it("should return accurate statistics", async () => {
    const cache = new SnapshotCache();

    // Initially empty
    expect(cache.getStats()).toEqual({
      rulesets: 0,
      versionRefs: 0,
      currentSnapshots: 0,
    });

    // Add some data
    cache.cacheRuleset("snapshot-1", createMockRuleset("snapshot-1"));
    cache.cacheRuleset("snapshot-2", createMockRuleset("snapshot-2"));
    cache.cacheVersionRef("snapshot-1", createMockVersionRef("snapshot-1"));

    // Load current snapshot
    vi.mocked(rulesetSnapshots.getCurrentSnapshot).mockResolvedValueOnce(
      createMockVersionRef("current")
    );
    await cache.getCurrentSnapshot("sr5");

    const stats = cache.getStats();

    expect(stats.rulesets).toBe(2);
    expect(stats.versionRefs).toBe(2); // snapshot-1 and current (added by getCurrentSnapshot)
    expect(stats.currentSnapshots).toBe(1);
  });
});
