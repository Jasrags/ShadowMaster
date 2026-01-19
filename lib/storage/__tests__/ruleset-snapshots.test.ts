/**
 * Unit tests for ruleset-snapshots.ts storage module
 *
 * Tests ruleset snapshot capture, retrieval, and comparison with VI mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MergedRuleset, RulesetVersionRef, EditionCode } from "@/lib/types";

// Mock the base storage module
vi.mock("../base", () => {
  const storage = new Map<string, unknown>();
  return {
    ensureDirectory: vi.fn().mockResolvedValue(undefined),
    readJsonFile: vi
      .fn()
      .mockImplementation((path: string) => Promise.resolve(storage.get(path) || null)),
    writeJsonFile: vi.fn().mockImplementation((path: string, data: unknown) => {
      storage.set(path, data);
      return Promise.resolve();
    }),
    fileExists: vi.fn().mockImplementation((path: string) => Promise.resolve(storage.has(path))),
    listJsonFiles: vi.fn().mockResolvedValue([]),
    __storage: storage,
    __clearStorage: () => storage.clear(),
    __setData: (path: string, data: unknown) => storage.set(path, data),
  };
});

// Mock the ruleset loader and merge modules
vi.mock("../../rules/loader", () => ({
  loadRuleset: vi.fn(),
}));

vi.mock("../../rules/merge", () => ({
  produceMergedRuleset: vi.fn(),
}));

// Import after mocking
import * as rulesetSnapshotsStorage from "../ruleset-snapshots";
import * as base from "../base";
import * as loader from "../../rules/loader";
import * as merge from "../../rules/merge";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockRuleset(snapshotId: string = "test-snapshot"): MergedRuleset {
  return {
    snapshotId,
    editionId: "sr5-edition",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {
      metatypes: { human: { id: "human", name: "Human" } },
      skills: { firearms: { id: "firearms", name: "Firearms" } },
    },
    createdAt: new Date().toISOString(),
  };
}

function createMockVersionRef(snapshotId: string = "test-snapshot"): RulesetVersionRef {
  return {
    editionCode: "sr5",
    editionVersion: "1.0.0",
    bookVersions: { "core-rulebook": "1.0.0" },
    snapshotId,
    createdAt: new Date().toISOString(),
  };
}

interface StoredSnapshot {
  id: string;
  createdAt: string;
  ruleset: MergedRuleset;
  versionRef: RulesetVersionRef;
}

function createStoredSnapshot(snapshotId: string = "test-snapshot"): StoredSnapshot {
  return {
    id: snapshotId,
    createdAt: new Date().toISOString(),
    ruleset: createMockRuleset(snapshotId),
    versionRef: createMockVersionRef(snapshotId),
  };
}

// =============================================================================
// SETUP
// =============================================================================

beforeEach(() => {
  // resetAllMocks clears both call history AND mock implementation queues
  vi.resetAllMocks();
  const baseMock = base as typeof base & {
    __clearStorage: () => void;
    __setData: (path: string, data: unknown) => void;
  };
  baseMock.__clearStorage();

  // Re-establish default mock implementations after reset
  vi.mocked(base.ensureDirectory).mockResolvedValue(undefined);
  vi.mocked(base.readJsonFile).mockImplementation((path: string) => {
    const storage = (base as typeof base & { __storage: Map<string, unknown> }).__storage;
    return Promise.resolve(storage.get(path) || null);
  });
  vi.mocked(base.writeJsonFile).mockImplementation((path: string, data: unknown) => {
    const storage = (base as typeof base & { __storage: Map<string, unknown> }).__storage;
    storage.set(path, data);
    return Promise.resolve();
  });
  vi.mocked(base.fileExists).mockImplementation((path: string) => {
    const storage = (base as typeof base & { __storage: Map<string, unknown> }).__storage;
    return Promise.resolve(storage.has(path));
  });
  vi.mocked(base.listJsonFiles).mockResolvedValue([]);
});

// =============================================================================
// CAPTURE RULESET SNAPSHOT TESTS
// =============================================================================

describe("captureRulesetSnapshot", () => {
  it("should create snapshot with generated ID", async () => {
    // Setup mocks for successful capture
    vi.mocked(loader.loadRuleset).mockResolvedValueOnce({
      success: true,
      ruleset: {
        edition: {
          id: "sr5-edition",
          shortCode: "sr5" as EditionCode,
          version: "1.0.0",
          name: "SR5",
          bookIds: ["core-rulebook"],
          creationMethodIds: [],
          releaseYear: 2013,
          createdAt: new Date().toISOString(),
        },
        books: [
          {
            id: "core-rulebook",
            title: "Core Rulebook",
            isCore: true,
            loadOrder: 0,
            payload: {
              meta: {
                bookId: "core-rulebook",
                title: "Core",
                version: "1.0.0",
                category: "core",
                edition: "sr5" as EditionCode,
              },
              modules: {},
            },
          },
        ],
        creationMethods: [],
      },
    });

    vi.mocked(merge.produceMergedRuleset).mockReturnValueOnce({
      success: true,
      ruleset: createMockRuleset(),
    });

    const result = await rulesetSnapshotsStorage.captureRulesetSnapshot("sr5");

    expect(result.snapshotId).toBeDefined();
    expect(result.editionCode).toBe("sr5");
    expect(result.editionVersion).toBe("1.0.0");
    expect(result.createdAt).toBeDefined();
    expect(base.writeJsonFile).toHaveBeenCalled();
  });

  it("should throw error if ruleset loading fails", async () => {
    vi.mocked(loader.loadRuleset).mockResolvedValueOnce({
      success: false,
      error: "Failed to load edition",
    });

    await expect(
      rulesetSnapshotsStorage.captureRulesetSnapshot("non-existent" as EditionCode)
    ).rejects.toThrow(/Failed to load/);
  });

  it("should throw error if merge fails", async () => {
    vi.mocked(loader.loadRuleset).mockResolvedValueOnce({
      success: true,
      ruleset: {
        edition: {
          id: "sr5-edition",
          shortCode: "sr5" as EditionCode,
          version: "1.0.0",
          name: "SR5",
          bookIds: [],
          creationMethodIds: [],
          releaseYear: 2013,
          createdAt: new Date().toISOString(),
        },
        books: [],
        creationMethods: [],
      },
    });

    vi.mocked(merge.produceMergedRuleset).mockReturnValueOnce({
      success: false,
      error: "Merge failed",
    });

    await expect(rulesetSnapshotsStorage.captureRulesetSnapshot("sr5")).rejects.toThrow(
      /Merge failed|Failed to merge/
    );
  });

  it("should update current snapshot index", async () => {
    vi.mocked(loader.loadRuleset).mockResolvedValueOnce({
      success: true,
      ruleset: {
        edition: {
          id: "sr5-edition",
          shortCode: "sr5" as EditionCode,
          version: "1.0.0",
          name: "SR5",
          bookIds: ["core-rulebook"],
          creationMethodIds: [],
          releaseYear: 2013,
          createdAt: new Date().toISOString(),
        },
        books: [
          {
            id: "core-rulebook",
            title: "Core Rulebook",
            isCore: true,
            loadOrder: 0,
            payload: {
              meta: {
                bookId: "core-rulebook",
                title: "Core",
                version: "1.0.0",
                category: "core",
                edition: "sr5" as EditionCode,
              },
              modules: {},
            },
          },
        ],
        creationMethods: [],
      },
    });

    vi.mocked(merge.produceMergedRuleset).mockReturnValueOnce({
      success: true,
      ruleset: createMockRuleset(),
    });

    await rulesetSnapshotsStorage.captureRulesetSnapshot("sr5");

    // Should have written both the snapshot and the index
    expect(base.writeJsonFile).toHaveBeenCalledTimes(2);
  });
});

// =============================================================================
// GET RULESET SNAPSHOT TESTS
// =============================================================================

describe("getRulesetSnapshot", () => {
  it("should return ruleset from snapshot", async () => {
    const stored = createStoredSnapshot("snapshot-123");
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(stored);

    const result = await rulesetSnapshotsStorage.getRulesetSnapshot("snapshot-123");

    expect(result).toEqual(stored.ruleset);
  });

  it("should return null for non-existent snapshot", async () => {
    vi.mocked(base.fileExists).mockResolvedValueOnce(false);

    const result = await rulesetSnapshotsStorage.getRulesetSnapshot("non-existent");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET SNAPSHOT VERSION REF TESTS
// =============================================================================

describe("getSnapshotVersionRef", () => {
  it("should return version ref from snapshot", async () => {
    const stored = createStoredSnapshot("snapshot-123");
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(stored);

    const result = await rulesetSnapshotsStorage.getSnapshotVersionRef("snapshot-123");

    expect(result).toEqual(stored.versionRef);
  });

  it("should return null for non-existent snapshot", async () => {
    vi.mocked(base.fileExists).mockResolvedValueOnce(false);

    const result = await rulesetSnapshotsStorage.getSnapshotVersionRef("non-existent");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET SNAPSHOT WITH VERSION REF TESTS
// =============================================================================

describe("getSnapshotWithVersionRef", () => {
  it("should return both ruleset and version ref", async () => {
    const stored = createStoredSnapshot("snapshot-123");
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(stored);

    const result = await rulesetSnapshotsStorage.getSnapshotWithVersionRef("snapshot-123");

    expect(result?.ruleset).toEqual(stored.ruleset);
    expect(result?.versionRef).toEqual(stored.versionRef);
  });

  it("should return null for non-existent snapshot", async () => {
    vi.mocked(base.fileExists).mockResolvedValueOnce(false);

    const result = await rulesetSnapshotsStorage.getSnapshotWithVersionRef("non-existent");

    expect(result).toBeNull();
  });

  it("should return null if stored data is invalid", async () => {
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce({ id: "invalid" }); // Missing ruleset/versionRef

    const result = await rulesetSnapshotsStorage.getSnapshotWithVersionRef("invalid");

    expect(result).toBeNull();
  });
});

// =============================================================================
// GET CURRENT SNAPSHOT TESTS
// =============================================================================

describe("getCurrentSnapshot", () => {
  it("should return version ref from index", async () => {
    const versionRef = createMockVersionRef("current-snapshot");
    const index = { sr5: versionRef };

    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(index);

    const result = await rulesetSnapshotsStorage.getCurrentSnapshot("sr5");

    expect(result).toEqual(versionRef);
  });

  it("should return null if no snapshot exists for edition", async () => {
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce({ sr6: createMockVersionRef() });

    // No snapshots in fallback scan either
    vi.mocked(base.fileExists).mockResolvedValueOnce(false); // listAllSnapshots checks dir exists
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce([]);

    const result = await rulesetSnapshotsStorage.getCurrentSnapshot("sr5");

    expect(result).toBeNull();
  });

  it("should scan snapshots as fallback if index doesn't have edition", async () => {
    const snapshot = createStoredSnapshot("fallback-snapshot");

    // First: read index file (empty)
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce({});

    // Fallback: listAllSnapshots
    vi.mocked(base.fileExists).mockResolvedValueOnce(true); // Dir exists
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["fallback-snapshot"]);
    vi.mocked(base.fileExists).mockResolvedValueOnce(true); // Snapshot exists for getSnapshotVersionRef
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(snapshot);

    const result = await rulesetSnapshotsStorage.getCurrentSnapshot("sr5");

    expect(result?.snapshotId).toBe("fallback-snapshot");
  });
});

// =============================================================================
// LIST ALL SNAPSHOTS TESTS
// =============================================================================

describe("listAllSnapshots", () => {
  it("should return all snapshots for edition", async () => {
    const snapshot1 = createStoredSnapshot("snap-1");
    const snapshot2 = createStoredSnapshot("snap-2");

    vi.mocked(base.fileExists).mockResolvedValueOnce(true); // Dir exists
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["snap-1", "snap-2"]);
    vi.mocked(base.fileExists).mockResolvedValueOnce(true); // snap-1 exists
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(snapshot1);
    vi.mocked(base.fileExists).mockResolvedValueOnce(true); // snap-2 exists
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(snapshot2);

    const result = await rulesetSnapshotsStorage.listAllSnapshots("sr5");

    expect(result).toHaveLength(2);
  });

  it("should filter to only matching edition", async () => {
    const sr5Snapshot = createStoredSnapshot("sr5-snap");
    const sr6Snapshot = {
      ...createStoredSnapshot("sr6-snap"),
      versionRef: { ...createMockVersionRef("sr6-snap"), editionCode: "sr6" as EditionCode },
    };

    vi.mocked(base.fileExists).mockResolvedValueOnce(true); // Dir exists
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["sr5-snap", "sr6-snap"]);
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(sr5Snapshot);
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(sr6Snapshot);

    const result = await rulesetSnapshotsStorage.listAllSnapshots("sr5");

    expect(result).toHaveLength(1);
    expect(result[0].editionCode).toBe("sr5");
  });

  it("should return empty array if snapshots directory doesn't exist", async () => {
    vi.mocked(base.fileExists).mockResolvedValueOnce(false);

    const result = await rulesetSnapshotsStorage.listAllSnapshots("sr5");

    expect(result).toEqual([]);
  });
});

// =============================================================================
// COMPARE SNAPSHOTS TESTS
// =============================================================================

describe("compareSnapshots", () => {
  it("should detect added items", async () => {
    const baseSnapshot = createStoredSnapshot("base");
    const targetSnapshot = {
      ...createStoredSnapshot("target"),
      ruleset: {
        ...createMockRuleset("target"),
        modules: {
          metatypes: {
            human: { id: "human", name: "Human" },
            elf: { id: "elf", name: "Elf" }, // New
          },
          skills: { firearms: { id: "firearms", name: "Firearms" } },
        },
      },
    };

    // getRulesetSnapshot for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getRulesetSnapshot for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);
    // getSnapshotVersionRef for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getSnapshotVersionRef for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);

    const result = await rulesetSnapshotsStorage.compareSnapshots("base", "target", "char-1");

    const addedChange = result.changes.find(
      (c) => c.changeType === "added" && c.module === "metatypes"
    );
    expect(addedChange).toBeDefined();
  });

  it("should detect removed items", async () => {
    const baseSnapshot = {
      ...createStoredSnapshot("base"),
      ruleset: {
        ...createMockRuleset("base"),
        modules: {
          metatypes: {
            human: { id: "human", name: "Human" },
            elf: { id: "elf", name: "Elf" },
          },
          skills: { firearms: { id: "firearms", name: "Firearms" } },
        },
      },
    };
    const targetSnapshot = createStoredSnapshot("target"); // Only has human

    // getRulesetSnapshot for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getRulesetSnapshot for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);
    // getSnapshotVersionRef for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getSnapshotVersionRef for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);

    const result = await rulesetSnapshotsStorage.compareSnapshots("base", "target", "char-1");

    const removedChange = result.changes.find(
      (c) => c.changeType === "removed" && c.module === "metatypes"
    );
    expect(removedChange).toBeDefined();
    expect(removedChange?.severity).toBe("breaking");
  });

  it("should detect modified items", async () => {
    const baseSnapshot = createStoredSnapshot("base");
    const targetSnapshot = {
      ...createStoredSnapshot("target"),
      ruleset: {
        ...createMockRuleset("target"),
        modules: {
          metatypes: { human: { id: "human", name: "Human (Updated)" } }, // Modified
          skills: { firearms: { id: "firearms", name: "Firearms" } },
        },
      },
    };

    // getRulesetSnapshot for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getRulesetSnapshot for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);
    // getSnapshotVersionRef for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getSnapshotVersionRef for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);

    const result = await rulesetSnapshotsStorage.compareSnapshots("base", "target", "char-1");

    const modifiedChange = result.changes.find(
      (c) => c.changeType === "modified" && c.module === "metatypes"
    );
    expect(modifiedChange).toBeDefined();
  });

  it("should classify overall severity", async () => {
    const baseSnapshot = {
      ...createStoredSnapshot("base"),
      ruleset: {
        ...createMockRuleset("base"),
        modules: {
          metatypes: { human: { id: "human", name: "Human" }, elf: { id: "elf" } },
          skills: {},
        },
      },
    };
    const targetSnapshot = createStoredSnapshot("target"); // elf removed - breaking

    // getRulesetSnapshot for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getRulesetSnapshot for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);
    // getSnapshotVersionRef for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getSnapshotVersionRef for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);

    const result = await rulesetSnapshotsStorage.compareSnapshots("base", "target", "char-1");

    expect(result.overallSeverity).toBe("breaking");
  });

  it("should throw error if base snapshot not found", async () => {
    // getRulesetSnapshot for base returns null
    vi.mocked(base.fileExists).mockResolvedValueOnce(false);
    // getRulesetSnapshot for target returns data
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(createStoredSnapshot("target"));

    await expect(
      rulesetSnapshotsStorage.compareSnapshots("non-existent", "target", "char-1")
    ).rejects.toThrow(/not found/);
  });

  it("should generate recommendations for changes", async () => {
    const baseSnapshot = {
      ...createStoredSnapshot("base"),
      ruleset: {
        ...createMockRuleset("base"),
        modules: {
          metatypes: { human: { id: "human", name: "Human" }, elf: { id: "elf" } },
          skills: {},
        },
      },
    };
    const targetSnapshot = createStoredSnapshot("target");

    // getRulesetSnapshot for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getRulesetSnapshot for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);
    // getSnapshotVersionRef for base
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(baseSnapshot);
    // getSnapshotVersionRef for target
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(targetSnapshot);

    const result = await rulesetSnapshotsStorage.compareSnapshots("base", "target", "char-1");

    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].changeId).toBeDefined();
    expect(result.recommendations[0].strategy).toBeDefined();
  });
});

// =============================================================================
// SNAPSHOT EXISTS TESTS
// =============================================================================

describe("snapshotExists", () => {
  it("should return true when snapshot exists", async () => {
    vi.mocked(base.fileExists).mockResolvedValueOnce(true);

    const result = await rulesetSnapshotsStorage.snapshotExists("existing-snapshot");

    expect(result).toBe(true);
  });

  it("should return false when snapshot does not exist", async () => {
    vi.mocked(base.fileExists).mockResolvedValueOnce(false);

    const result = await rulesetSnapshotsStorage.snapshotExists("non-existent");

    expect(result).toBe(false);
  });
});

// =============================================================================
// DELETE SNAPSHOT TESTS
// =============================================================================

describe("deleteSnapshot", () => {
  // Note: deleteSnapshot uses fs.unlink directly which cannot be easily mocked in ESM
  // Test the function exists and the early return path

  it("should be a function", () => {
    expect(typeof rulesetSnapshotsStorage.deleteSnapshot).toBe("function");
  });

  it("should return false if snapshot does not exist", async () => {
    vi.mocked(base.fileExists).mockResolvedValueOnce(false);

    const result = await rulesetSnapshotsStorage.deleteSnapshot("non-existent");

    expect(result).toBe(false);
  });
});
