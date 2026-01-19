/**
 * Tests for sync hooks
 *
 * Tests both API hooks (with fetch mocking) and pure helper hooks
 * for character synchronization, drift analysis, and migration workflows.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import type {
  Character,
  SyncStatus,
  LegalityStatus,
  DriftReport,
  DriftChange,
  MigrationPlan,
} from "@/lib/types";
import {
  useSyncStatus,
  useStabilityShield,
  useDriftAnalysis,
  useMigrationWizard,
  useHasPendingUpdates,
  useSyncStatusMessage,
  useLegalityStatusMessage,
} from "../hooks";

// =============================================================================
// TEST HELPERS
// =============================================================================

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    userId: "user-1",
    editionCode: "sr5",
    name: "Test Runner",
    status: "active",
    metatype: "human",
    syncStatus: "synchronized",
    legalityStatus: "rules-legal",
    ...overrides,
  } as Character;
}

function createMockDriftReport(overrides: Partial<DriftReport> = {}): DriftReport {
  const versionRef = {
    editionCode: "sr5" as const,
    editionVersion: "1.0.0",
    bookVersions: {},
    snapshotId: "snapshot-1",
    createdAt: new Date().toISOString(),
  };
  return {
    id: "report-1",
    characterId: "char-1",
    generatedAt: new Date().toISOString(),
    currentVersion: versionRef,
    targetVersion: versionRef,
    overallSeverity: "none",
    changes: [],
    recommendations: [],
    ...overrides,
  } as DriftReport;
}

function createMockDriftChange(
  id: string,
  severity: "none" | "non-breaking" | "breaking" = "breaking"
): DriftChange {
  return {
    id,
    module: "skills",
    changeType: "modified",
    severity,
    affectedItems: [],
    description: `Change ${id}`,
  } as DriftChange;
}

function createMockMigrationPlan(overrides: Partial<MigrationPlan> = {}): MigrationPlan {
  return {
    id: "plan-1",
    characterId: "char-1",
    sourceVersion: {
      editionCode: "sr5" as const,
      editionVersion: "1.0.0",
      bookVersions: {},
      snapshotId: "snapshot-1",
      createdAt: new Date().toISOString(),
    },
    targetVersion: {
      editionCode: "sr5" as const,
      editionVersion: "1.0.1",
      bookVersions: {},
      snapshotId: "snapshot-2",
      createdAt: new Date().toISOString(),
    },
    steps: [],
    isComplete: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  } as MigrationPlan;
}

// =============================================================================
// HELPER HOOKS (Pure functions)
// =============================================================================

describe("useHasPendingUpdates", () => {
  it("should return false for null character", () => {
    const { result } = renderHook(() => useHasPendingUpdates(null));
    expect(result.current).toBe(false);
  });

  it("should return false for synchronized character", () => {
    const character = createMockCharacter({ syncStatus: "synchronized" });
    const { result } = renderHook(() => useHasPendingUpdates(character));
    expect(result.current).toBe(false);
  });

  it("should return true for outdated character", () => {
    const character = createMockCharacter({ syncStatus: "outdated" });
    const { result } = renderHook(() => useHasPendingUpdates(character));
    expect(result.current).toBe(true);
  });

  it("should return true for invalid character", () => {
    const character = createMockCharacter({ syncStatus: "invalid" });
    const { result } = renderHook(() => useHasPendingUpdates(character));
    expect(result.current).toBe(true);
  });

  it("should return true for character with pending migration", () => {
    const character = createMockCharacter({
      syncStatus: "synchronized",
      pendingMigration: "plan-1",
    });
    const { result } = renderHook(() => useHasPendingUpdates(character));
    expect(result.current).toBe(true);
  });

  it("should return false for migrating character without pending migration", () => {
    const character = createMockCharacter({ syncStatus: "migrating" });
    const { result } = renderHook(() => useHasPendingUpdates(character));
    expect(result.current).toBe(false);
  });
});

describe("useSyncStatusMessage", () => {
  it("should return message for synchronized status", () => {
    const { result } = renderHook(() => useSyncStatusMessage("synchronized"));
    expect(result.current).toBe("Character is up to date with current rules");
  });

  it("should return message for outdated status", () => {
    const { result } = renderHook(() => useSyncStatusMessage("outdated"));
    expect(result.current).toBe("Updates are available for this character");
  });

  it("should return message for invalid status", () => {
    const { result } = renderHook(() => useSyncStatusMessage("invalid"));
    expect(result.current).toBe("Character has validation errors that need resolution");
  });

  it("should return message for migrating status", () => {
    const { result } = renderHook(() => useSyncStatusMessage("migrating"));
    expect(result.current).toBe("Character is currently being migrated");
  });

  it("should return unknown message for unrecognized status", () => {
    const { result } = renderHook(() => useSyncStatusMessage("unknown" as SyncStatus));
    expect(result.current).toBe("Unknown sync status");
  });
});

describe("useLegalityStatusMessage", () => {
  it("should return message for rules-legal status", () => {
    const { result } = renderHook(() => useLegalityStatusMessage("rules-legal"));
    expect(result.current).toBe("Character follows all rules");
  });

  it("should return message for draft status", () => {
    const { result } = renderHook(() => useLegalityStatusMessage("draft"));
    expect(result.current).toBe("Character creation is in progress");
  });

  it("should return message for invalid status", () => {
    const { result } = renderHook(() => useLegalityStatusMessage("invalid"));
    expect(result.current).toBe("Character has rule violations");
  });

  it("should return message for legacy status", () => {
    const { result } = renderHook(() => useLegalityStatusMessage("legacy"));
    expect(result.current).toBe("Character was created under older rules");
  });

  it("should return unknown message for unrecognized status", () => {
    const { result } = renderHook(() => useLegalityStatusMessage("unknown" as LegalityStatus));
    expect(result.current).toBe("Unknown legality status");
  });
});

// =============================================================================
// API HOOKS (Require fetch mocking)
// =============================================================================

describe("useSyncStatus", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  it("should fetch sync status on mount", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        syncStatus: "synchronized",
        legalityStatus: "rules-legal",
        driftReport: null,
      }),
    } as Response);

    const { result } = renderHook(() => useSyncStatus("char-1"));

    // Initially checking
    expect(result.current.isChecking).toBe(true);

    await waitFor(() => expect(result.current.isChecking).toBe(false));

    expect(result.current.status).toBe("synchronized");
    expect(result.current.legalityStatus).toBe("rules-legal");
    expect(result.current.error).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith("/api/characters/char-1/sync");
  });

  it("should update state with drift report when available", async () => {
    const driftReport = createMockDriftReport({ overallSeverity: "breaking" });
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        syncStatus: "outdated",
        legalityStatus: "legacy",
        driftReport,
      }),
    } as Response);

    const { result } = renderHook(() => useSyncStatus("char-1"));

    await waitFor(() => expect(result.current.isChecking).toBe(false));

    expect(result.current.status).toBe("outdated");
    expect(result.current.legalityStatus).toBe("legacy");
    expect(result.current.driftReport).toEqual(driftReport);
  });

  it("should handle fetch error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useSyncStatus("char-1"));

    await waitFor(() => expect(result.current.isChecking).toBe(false));

    expect(result.current.error).toBe("Network error");
  });

  it("should handle non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useSyncStatus("char-1"));

    await waitFor(() => expect(result.current.isChecking).toBe(false));

    expect(result.current.error).toBe("Failed to fetch sync status");
  });

  it("should refresh on callback", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          syncStatus: "synchronized",
          legalityStatus: "rules-legal",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          syncStatus: "outdated",
          legalityStatus: "legacy",
        }),
      } as Response);

    const { result } = renderHook(() => useSyncStatus("char-1"));

    await waitFor(() => expect(result.current.isChecking).toBe(false));
    expect(result.current.status).toBe("synchronized");

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.status).toBe("outdated");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe("useStabilityShield", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  it("should fetch shield status on mount", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "green",
        label: "Stable",
        tooltip: "Character is up to date",
      }),
    } as Response);

    const { result } = renderHook(() => useStabilityShield("char-1"));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.status).toBe("green");
    expect(result.current.label).toBe("Stable");
    expect(result.current.tooltip).toBe("Character is up to date");
    expect(fetch).toHaveBeenCalledWith("/api/characters/char-1/sync/shield");
  });

  it("should skip fetch when skip is true", async () => {
    const { result } = renderHook(() => useStabilityShield("char-1", true));

    expect(result.current.isLoading).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should handle fetch error with fallback shield", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useStabilityShield("char-1"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.status).toBe("yellow");
    expect(result.current.label).toBe("Unknown");
    expect(result.current.tooltip).toBe("Unable to determine status");
  });

  it("should handle non-ok response with fallback shield", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useStabilityShield("char-1"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.status).toBe("yellow");
    expect(result.current.label).toBe("Unknown");
  });

  it("should show loading state initially", () => {
    vi.mocked(fetch).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useStabilityShield("char-1"));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.label).toBe("Loading...");
  });
});

describe("useDriftAnalysis", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  it("should start with no report and not analyzing", () => {
    const { result } = renderHook(() => useDriftAnalysis("char-1"));

    expect(result.current.report).toBeUndefined();
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should analyze drift on callback", async () => {
    const driftReport = createMockDriftReport({ overallSeverity: "non-breaking" });
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ report: driftReport }),
    } as Response);

    const { result } = renderHook(() => useDriftAnalysis("char-1"));

    let analyzeResult: DriftReport | null = null;
    await act(async () => {
      analyzeResult = await result.current.analyze();
    });

    expect(analyzeResult).toEqual(driftReport);
    expect(result.current.report).toEqual(driftReport);
    expect(result.current.isAnalyzing).toBe(false);
    expect(fetch).toHaveBeenCalledWith("/api/characters/char-1/sync", { method: "POST" });
  });

  it("should handle analysis error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Analysis failed"));

    const { result } = renderHook(() => useDriftAnalysis("char-1"));

    let analyzeResult: DriftReport | null = null;
    await act(async () => {
      analyzeResult = await result.current.analyze();
    });

    expect(analyzeResult).toBeNull();
    expect(result.current.error).toBe("Analysis failed");
  });

  it("should handle non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useDriftAnalysis("char-1"));

    let analyzeResult: DriftReport | null = null;
    await act(async () => {
      analyzeResult = await result.current.analyze();
    });

    expect(analyzeResult).toBeNull();
    expect(result.current.error).toBe("Failed to analyze drift");
  });

  it("should set isAnalyzing during analysis", async () => {
    let resolvePromise: (value: Response) => void;
    const promise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(fetch).mockReturnValueOnce(promise);

    const { result } = renderHook(() => useDriftAnalysis("char-1"));

    let analyzePromise: Promise<DriftReport | null>;
    act(() => {
      analyzePromise = result.current.analyze();
    });

    expect(result.current.isAnalyzing).toBe(true);

    await act(async () => {
      resolvePromise!({
        ok: true,
        json: async () => ({ report: createMockDriftReport() }),
      } as Response);
      await analyzePromise;
    });

    expect(result.current.isAnalyzing).toBe(false);
  });
});

describe("useMigrationWizard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  it("should initialize with default state", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ report: null, plan: null }),
    } as Response);

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    // Before load completes
    expect(result.current.currentStep).toBe(0);
    expect(result.current.selections.size).toBe(0);
    expect(result.current.isApplying).toBe(false);
    expect(result.current.canApply).toBe(false);
  });

  it("should load drift report on mount", async () => {
    const driftReport = createMockDriftReport({
      overallSeverity: "breaking",
      changes: [createMockDriftChange("change-1")],
    });
    const plan = createMockMigrationPlan();

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ report: driftReport, plan }),
    } as Response);

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    await waitFor(() => expect(result.current.report).not.toBeNull());

    expect(result.current.report).toEqual(driftReport);
    expect(result.current.plan).toEqual(plan);
  });

  it("should navigate steps with nextStep and prevStep", async () => {
    const driftReport = createMockDriftReport({
      changes: [createMockDriftChange("change-1"), createMockDriftChange("change-2")],
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ report: driftReport }),
    } as Response);

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    await waitFor(() => expect(result.current.report).not.toBeNull());

    expect(result.current.currentStep).toBe(0);
    expect(result.current.totalSteps).toBe(4); // 1 + 2 breaking + 1

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(1);

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(2);

    act(() => {
      result.current.prevStep();
    });
    expect(result.current.currentStep).toBe(1);

    act(() => {
      result.current.prevStep();
    });
    expect(result.current.currentStep).toBe(0);

    // Cannot go below 0
    act(() => {
      result.current.prevStep();
    });
    expect(result.current.currentStep).toBe(0);
  });

  it("should not exceed total steps", async () => {
    const driftReport = createMockDriftReport({ changes: [] });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ report: driftReport }),
    } as Response);

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    await waitFor(() => expect(result.current.report).not.toBeNull());

    expect(result.current.totalSteps).toBe(2); // 1 + 0 breaking + 1

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(1);

    // Cannot exceed totalSteps - 1
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(1);
  });

  it("should make selection and update plan", async () => {
    const driftReport = createMockDriftReport({
      changes: [createMockDriftChange("change-1")],
    });
    const plan = createMockMigrationPlan({
      steps: [{ changeId: "change-1", action: "update", before: null, after: null }],
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ report: driftReport, plan }),
    } as Response);

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    await waitFor(() => expect(result.current.plan).not.toBeNull());

    const option = { targetItemId: "new-item-1" };
    act(() => {
      result.current.makeSelection("change-1", option as never, "replace");
    });

    expect(result.current.selections.get("change-1")).toEqual({
      option,
      action: "replace",
      newValue: "new-item-1",
    });

    // Plan should be updated
    expect(result.current.plan?.steps[0].action).toBe("replace");
    expect(result.current.plan?.steps[0].after).toBe("new-item-1");
    expect(result.current.plan?.isComplete).toBe(true);
    expect(result.current.canApply).toBe(true);
  });

  it("should apply migration when plan is complete", async () => {
    const plan = createMockMigrationPlan({
      steps: [],
      isComplete: true,
    });

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ report: createMockDriftReport(), plan }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          characterId: "char-1",
        }),
      } as Response);

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    await waitFor(() => expect(result.current.plan?.isComplete).toBe(true));

    let migrationResult: unknown;
    await act(async () => {
      migrationResult = await result.current.applyMigration();
    });

    expect(migrationResult).toEqual({ success: true, characterId: "char-1" });
    expect(fetch).toHaveBeenLastCalledWith(
      "/api/characters/char-1/sync/migrate",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("should not apply migration when plan is incomplete", async () => {
    const plan = createMockMigrationPlan({ isComplete: false });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ report: createMockDriftReport(), plan }),
    } as Response);

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    await waitFor(() => expect(result.current.plan).not.toBeNull());

    let migrationResult: unknown;
    await act(async () => {
      migrationResult = await result.current.applyMigration();
    });

    expect(migrationResult).toBeNull();
    expect(result.current.error).toBe("Migration plan is not complete");
    // Should not have made a second fetch call
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should handle migration apply error", async () => {
    const plan = createMockMigrationPlan({ isComplete: true });

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ report: createMockDriftReport(), plan }),
      } as Response)
      .mockRejectedValueOnce(new Error("Migration failed"));

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    await waitFor(() => expect(result.current.plan?.isComplete).toBe(true));

    let migrationResult: unknown;
    await act(async () => {
      migrationResult = await result.current.applyMigration();
    });

    expect(migrationResult).toBeNull();
    expect(result.current.error).toBe("Migration failed");
  });

  it("should reset wizard state", async () => {
    const driftReport = createMockDriftReport({ overallSeverity: "breaking" });
    const plan = createMockMigrationPlan();

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ report: driftReport, plan }),
    } as Response);

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    await waitFor(() => expect(result.current.report).not.toBeNull());

    // Navigate and make a selection
    act(() => {
      result.current.nextStep();
      result.current.makeSelection("change-1", { targetItemId: "item-1" } as never, "replace");
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.selections.size).toBe(1);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.report).toBeNull();
    expect(result.current.plan).toBeNull();
    expect(result.current.currentStep).toBe(0);
    expect(result.current.selections.size).toBe(0);
    expect(result.current.error).toBeUndefined();
  });

  it("should set isApplying during migration", async () => {
    const plan = createMockMigrationPlan({ isComplete: true });

    let resolvePromise: (value: Response) => void;
    const migrationPromise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ report: createMockDriftReport(), plan }),
      } as Response)
      .mockReturnValueOnce(migrationPromise);

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    await waitFor(() => expect(result.current.plan?.isComplete).toBe(true));

    let applyPromise: Promise<unknown>;
    act(() => {
      applyPromise = result.current.applyMigration();
    });

    expect(result.current.isApplying).toBe(true);

    await act(async () => {
      resolvePromise!({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);
      await applyPromise;
    });

    expect(result.current.isApplying).toBe(false);
  });

  it("should silently handle initial load failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Load failed"));

    const { result } = renderHook(() => useMigrationWizard("char-1"));

    // Wait a tick for the effect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should not set error for initial load failure
    expect(result.current.error).toBeUndefined();
    expect(result.current.report).toBeNull();
  });
});
