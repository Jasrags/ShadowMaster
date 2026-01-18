/**
 * Tests for migration engine module
 *
 * Tests migration plan generation, validation, and execution.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateMigrationPlan,
  validateMigrationPlan,
  executeMigration,
  createMigrationAuditEntry,
  hasPendingMigration,
  getPendingDecisionCount,
  getPendingSteps,
  updatePlanWithSelection,
  createRemovalOptions,
} from "../migration-engine";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import type {
  Character,
  DriftReport,
  DriftChange,
  MigrationPlan,
  MigrationStep,
  MigrationResult,
  MigrationRecommendation,
  RulesetVersionRef,
} from "@/lib/types";

// Mock uuid for predictable IDs
vi.mock("uuid", () => ({
  v4: vi.fn(() => "mock-uuid-123"),
}));

// Mock storage module
vi.mock("@/lib/storage/characters", () => ({
  applyMigration: vi.fn(),
  updateSyncStatus: vi.fn().mockResolvedValue(undefined),
}));

import { applyMigration, updateSyncStatus } from "@/lib/storage/characters";

// =============================================================================
// MOCK FACTORIES
// =============================================================================

function createMockVersionRef(overrides?: Partial<RulesetVersionRef>): RulesetVersionRef {
  return {
    editionCode: "sr5",
    editionVersion: "1.0.0",
    bookVersions: { core: "1.0.0" },
    snapshotId: "snapshot-123",
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

function createMockDriftChange(overrides?: Partial<DriftChange>): DriftChange {
  return {
    id: "change-123",
    module: "skills",
    changeType: "modified",
    severity: "non-breaking",
    affectedItems: [
      {
        itemId: "item-123",
        itemType: "skills",
        previousValue: { value: 1 },
        currentValue: { value: 2 },
      },
    ],
    description: "Test change",
    ...overrides,
  };
}

function createMockRecommendation(
  overrides?: Partial<MigrationRecommendation>
): MigrationRecommendation {
  return {
    changeId: "change-123",
    strategy: "auto-update",
    description: "Auto update recommendation",
    autoApplicable: true,
    requiresUserChoice: false,
    ...overrides,
  };
}

function createMockDriftReport(overrides?: Partial<DriftReport>): DriftReport {
  return {
    id: "drift-report-123",
    characterId: "char-123",
    generatedAt: "2024-01-01T00:00:00Z",
    currentVersion: createMockVersionRef({ snapshotId: "old-snapshot" }),
    targetVersion: createMockVersionRef({ snapshotId: "new-snapshot" }),
    overallSeverity: "non-breaking",
    changes: [],
    recommendations: [],
    ...overrides,
  };
}

function createMockMigrationPlan(overrides?: Partial<MigrationPlan>): MigrationPlan {
  return {
    id: "plan-123",
    characterId: "char-123",
    sourceVersion: createMockVersionRef({ snapshotId: "old-snapshot" }),
    targetVersion: createMockVersionRef({ snapshotId: "new-snapshot" }),
    steps: [],
    isComplete: true,
    estimatedKarmaDelta: 0,
    ...overrides,
  };
}

function createMockMigrationStep(overrides?: Partial<MigrationStep>): MigrationStep {
  return {
    changeId: "change-123",
    action: "update",
    before: { value: 1 },
    after: { value: 2 },
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("Migration Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(applyMigration).mockResolvedValue(createMockCharacter());
  });

  // ===========================================================================
  // generateMigrationPlan
  // ===========================================================================

  describe("generateMigrationPlan", () => {
    it("should generate empty plan for report with no changes", () => {
      const report = createMockDriftReport({ changes: [] });

      const plan = generateMigrationPlan(report);

      expect(plan.id).toBe("mock-uuid-123");
      expect(plan.characterId).toBe("char-123");
      expect(plan.steps).toEqual([]);
      expect(plan.isComplete).toBe(true);
      expect(plan.estimatedKarmaDelta).toBe(0);
    });

    it("should copy version refs from report", () => {
      const report = createMockDriftReport({
        currentVersion: createMockVersionRef({ snapshotId: "source" }),
        targetVersion: createMockVersionRef({ snapshotId: "target" }),
      });

      const plan = generateMigrationPlan(report);

      expect(plan.sourceVersion.snapshotId).toBe("source");
      expect(plan.targetVersion.snapshotId).toBe("target");
    });

    it("should create auto-update step for auto-applicable changes", () => {
      const change = createMockDriftChange({
        id: "change-1",
        changeType: "added",
        affectedItems: [{ itemId: "new-skill", itemType: "skills", currentValue: { rating: 0 } }],
      });
      const recommendation = createMockRecommendation({
        changeId: "change-1",
        autoApplicable: true,
      });
      const report = createMockDriftReport({
        changes: [change],
        recommendations: [recommendation],
      });

      const plan = generateMigrationPlan(report);

      expect(plan.steps).toHaveLength(1);
      expect(plan.steps[0].action).toBe("update");
      expect(plan.steps[0].after).toEqual({ rating: 0 });
      expect(plan.isComplete).toBe(true);
    });

    it("should create placeholder step for changes requiring user choice", () => {
      const change = createMockDriftChange({
        id: "change-1",
        changeType: "removed",
        severity: "breaking",
      });
      const recommendation = createMockRecommendation({
        changeId: "change-1",
        autoApplicable: false,
        requiresUserChoice: true,
      });
      const report = createMockDriftReport({
        changes: [change],
        recommendations: [recommendation],
      });

      const plan = generateMigrationPlan(report);

      expect(plan.steps).toHaveLength(1);
      expect(plan.steps[0].after).toBeNull();
      expect(plan.isComplete).toBe(false);
    });

    it("should apply user selections when provided", () => {
      const change = createMockDriftChange({ id: "change-1" });
      const recommendation = createMockRecommendation({
        changeId: "change-1",
        autoApplicable: false,
      });
      const report = createMockDriftReport({
        changes: [change],
        recommendations: [recommendation],
      });

      const userSelections = new Map([
        [
          "change-1",
          {
            option: { id: "opt-1", label: "Replace", description: "Replace item" },
            action: "replace" as const,
            newValue: { replacement: true },
          },
        ],
      ]);

      const plan = generateMigrationPlan(report, userSelections);

      expect(plan.steps[0].action).toBe("replace");
      expect(plan.steps[0].after).toEqual({ replacement: true });
      expect(plan.isComplete).toBe(true);
    });

    it("should accumulate karma delta from user selections", () => {
      const changes = [
        createMockDriftChange({ id: "change-1" }),
        createMockDriftChange({ id: "change-2" }),
      ];
      const recommendations = changes.map((c) =>
        createMockRecommendation({ changeId: c.id, autoApplicable: false })
      );
      const report = createMockDriftReport({ changes, recommendations });

      const userSelections = new Map([
        [
          "change-1",
          {
            option: { id: "opt-1", label: "Remove", description: "Remove", karmaDelta: 5 },
            action: "remove" as const,
          },
        ],
        [
          "change-2",
          {
            option: { id: "opt-2", label: "Replace", description: "Replace", karmaDelta: -3 },
            action: "replace" as const,
            newValue: { new: true },
          },
        ],
      ]);

      const plan = generateMigrationPlan(report, userSelections);

      expect(plan.estimatedKarmaDelta).toBe(2); // 5 + (-3)
    });

    it("should calculate karma delta for remove action with karmaCost", () => {
      const change = createMockDriftChange({
        id: "change-1",
        affectedItems: [
          { itemId: "quality-1", itemType: "qualities", previousValue: { karmaCost: 10 } },
        ],
      });
      const recommendation = createMockRecommendation({
        changeId: "change-1",
        autoApplicable: true,
        strategy: "remove",
      });
      const report = createMockDriftReport({
        changes: [change],
        recommendations: [recommendation],
      });

      // Simulate removed change type for auto-action to be "remove"
      change.changeType = "removed";

      const plan = generateMigrationPlan(report);

      // Karma delta should include refund from karmaCost
      expect(plan.estimatedKarmaDelta).toBe(10);
    });
  });

  // ===========================================================================
  // validateMigrationPlan
  // ===========================================================================

  describe("validateMigrationPlan", () => {
    it("should validate plan for correct character", () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan({ characterId: "char-123" });

      const result = validateMigrationPlan(character, plan);

      expect(result.errors.filter((e) => e.field === "characterId")).toHaveLength(0);
    });

    it("should error if plan is for different character", () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan({ characterId: "different-char" });

      const result = validateMigrationPlan(character, plan);

      expect(result.isValid).toBe(false);
      const error = result.errors.find((e) => e.field === "characterId");
      expect(error).toBeDefined();
      expect(error?.message).toContain("different character");
    });

    it("should error if plan has incomplete steps", () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        isComplete: false,
        steps: [
          createMockMigrationStep({ changeId: "c1", after: null }),
          createMockMigrationStep({ changeId: "c2", after: { value: 1 } }),
        ],
      });

      const result = validateMigrationPlan(character, plan);

      expect(result.isValid).toBe(false);
      const error = result.errors.find((e) => e.field === "steps");
      expect(error).toBeDefined();
      expect(error?.message).toContain("1 step(s)");
    });

    it("should error if migration would result in negative karma", () => {
      const character = createMockCharacter({
        id: "char-123",
        karmaCurrent: 5,
      });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        estimatedKarmaDelta: -10,
      });

      const result = validateMigrationPlan(character, plan);

      expect(result.isValid).toBe(false);
      const error = result.errors.find((e) => e.field === "karma");
      expect(error).toBeDefined();
      expect(error?.message).toContain("negative karma");
    });

    it("should allow zero karma result", () => {
      const character = createMockCharacter({
        id: "char-123",
        karmaCurrent: 10,
      });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        estimatedKarmaDelta: -10,
      });

      const result = validateMigrationPlan(character, plan);

      // Should not have karma error (result is 0, not negative)
      const karmaError = result.errors.find((e) => e.field === "karma");
      expect(karmaError).toBeUndefined();
    });

    it("should warn if character snapshot differs from plan source", () => {
      const character = createMockCharacter({
        id: "char-123",
        rulesetSnapshotId: "different-snapshot",
      });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        sourceVersion: createMockVersionRef({ snapshotId: "plan-source-snapshot" }),
      });

      const result = validateMigrationPlan(character, plan);

      const warning = result.warnings.find((w) => w.field === "sourceVersion");
      expect(warning).toBeDefined();
    });

    it("should be valid when all checks pass", () => {
      const character = createMockCharacter({
        id: "char-123",
        rulesetSnapshotId: "source-snapshot",
        karmaCurrent: 50,
      });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        sourceVersion: createMockVersionRef({ snapshotId: "source-snapshot" }),
        isComplete: true,
        steps: [createMockMigrationStep()],
        estimatedKarmaDelta: -10,
      });

      const result = validateMigrationPlan(character, plan);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  // ===========================================================================
  // executeMigration
  // ===========================================================================

  describe("executeMigration", () => {
    it("should fail if validation fails", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan({
        characterId: "different-char", // Wrong character
      });

      const result = await executeMigration("user-123", character, plan);

      expect(result.success).toBe(false);
      expect(result.error).toContain("different character");
      expect(result.appliedSteps).toEqual([]);
    });

    it("should update sync status to migrating at start", async () => {
      const character = createMockCharacter({
        id: "char-123",
        legalityStatus: "rules-legal",
      });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        steps: [createMockMigrationStep()],
      });

      await executeMigration("user-123", character, plan);

      expect(updateSyncStatus).toHaveBeenCalledWith(
        "user-123",
        "char-123",
        "migrating",
        "rules-legal"
      );
    });

    it("should apply migration to storage on success", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        steps: [createMockMigrationStep()],
      });

      await executeMigration("user-123", character, plan);

      expect(applyMigration).toHaveBeenCalledWith(
        "user-123",
        "char-123",
        expect.objectContaining({
          plan,
          appliedBy: "user-123",
          canRollback: true,
        })
      );
    });

    it("should update sync status to synchronized on success", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        steps: [createMockMigrationStep()],
      });

      await executeMigration("user-123", character, plan);

      // Second call should be to synchronized
      expect(updateSyncStatus).toHaveBeenCalledWith(
        "user-123",
        "char-123",
        "synchronized",
        "rules-legal"
      );
    });

    it("should return success result with applied steps", async () => {
      const updatedCharacter = createMockCharacter({ id: "char-123", name: "Updated" });
      vi.mocked(applyMigration).mockResolvedValue(updatedCharacter);

      const character = createMockCharacter({ id: "char-123" });
      const steps = [
        createMockMigrationStep({ changeId: "c1" }),
        createMockMigrationStep({ changeId: "c2" }),
      ];
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        steps,
      });

      const result = await executeMigration("user-123", character, plan);

      expect(result.success).toBe(true);
      expect(result.character).toBe(updatedCharacter);
      expect(result.appliedSteps).toHaveLength(2);
      expect(result.rollbackAvailable).toBe(true);
    });

    it("should revert sync status on error", async () => {
      vi.mocked(applyMigration).mockRejectedValue(new Error("Storage error"));

      const character = createMockCharacter({
        id: "char-123",
        legalityStatus: "legacy",
      });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        steps: [createMockMigrationStep()],
      });

      await executeMigration("user-123", character, plan);

      // Should revert to outdated status
      expect(updateSyncStatus).toHaveBeenCalledWith("user-123", "char-123", "outdated", "legacy");
    });

    it("should return error result on failure", async () => {
      vi.mocked(applyMigration).mockRejectedValue(new Error("Something went wrong"));

      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        steps: [createMockMigrationStep()],
      });

      const result = await executeMigration("user-123", character, plan);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Something went wrong");
      expect(result.appliedSteps).toHaveLength(1); // Step was applied before error
      expect(result.rollbackAvailable).toBe(true);
    });

    it("should handle replace action with undefined after value", async () => {
      const character = createMockCharacter({ id: "char-123" });
      const plan = createMockMigrationPlan({
        characterId: "char-123",
        steps: [
          createMockMigrationStep({
            action: "replace",
            after: undefined,
          }),
        ],
      });

      const result = await executeMigration("user-123", character, plan);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Replace action requires a new value");
    });
  });

  // ===========================================================================
  // createMigrationAuditEntry
  // ===========================================================================

  describe("createMigrationAuditEntry", () => {
    it("should create audit entry for migration_started", () => {
      const plan = createMockMigrationPlan();
      const result: MigrationResult = {
        success: true,
        appliedSteps: [createMockMigrationStep()],
        rollbackAvailable: true,
      };

      const entry = createMigrationAuditEntry("migration_started", plan, result, "user-123");

      expect(entry.id).toBe("mock-uuid-123");
      expect(entry.eventType).toBe("migration_started");
      expect(entry.sourceVersion).toEqual(plan.sourceVersion);
      expect(entry.actor.userId).toBe("user-123");
      expect(entry.actor.type).toBe("user");
      expect(entry.actor.description).toBe("User user-123");
    });

    it("should create audit entry for migration_completed", () => {
      const plan = createMockMigrationPlan();
      const result: MigrationResult = {
        success: true,
        appliedSteps: [
          createMockMigrationStep({ changeId: "c1" }),
          createMockMigrationStep({ changeId: "c2" }),
        ],
        rollbackAvailable: true,
      };

      const entry = createMigrationAuditEntry("migration_completed", plan, result);

      expect(entry.eventType).toBe("migration_completed");
      expect(entry.targetVersion).toEqual(plan.targetVersion);
      expect(entry.changes).toHaveLength(2);
    });

    it("should not include target version on failed migration", () => {
      const plan = createMockMigrationPlan();
      const result: MigrationResult = {
        success: false,
        error: "Failed",
        appliedSteps: [],
        rollbackAvailable: false,
      };

      const entry = createMigrationAuditEntry("migration_rolled_back", plan, result);

      expect(entry.targetVersion).toBeUndefined();
    });

    it("should convert steps to applied changes", () => {
      const plan = createMockMigrationPlan();
      const result: MigrationResult = {
        success: true,
        appliedSteps: [
          createMockMigrationStep({
            changeId: "skill-change",
            before: { rating: 3 },
            after: { rating: 4 },
          }),
        ],
        rollbackAvailable: true,
      };

      const entry = createMigrationAuditEntry("migration_completed", plan, result);

      expect(entry.changes).toHaveLength(1);
      expect(entry.changes[0].itemId).toBe("skill-change");
      expect(entry.changes[0].before).toEqual({ rating: 3 });
      expect(entry.changes[0].after).toEqual({ rating: 4 });
    });

    it("should set actor type to system when no userId", () => {
      const plan = createMockMigrationPlan();
      const result: MigrationResult = { success: true, appliedSteps: [], rollbackAvailable: false };

      const entry = createMigrationAuditEntry("migration_completed", plan, result);

      expect(entry.actor.type).toBe("system");
      expect(entry.actor.description).toBe("System migration");
    });
  });

  // ===========================================================================
  // hasPendingMigration
  // ===========================================================================

  describe("hasPendingMigration", () => {
    it("should return true when pendingMigration exists", () => {
      const character = createMockCharacter({
        pendingMigration: "migration-plan-123", // ID reference to MigrationPlan
      });

      expect(hasPendingMigration(character)).toBe(true);
    });

    it("should return false when no pendingMigration", () => {
      const character = createMockCharacter();
      delete (character as Partial<Character>).pendingMigration;

      expect(hasPendingMigration(character)).toBe(false);
    });

    it("should return false when pendingMigration is undefined", () => {
      const character = createMockCharacter({
        pendingMigration: undefined,
      });

      expect(hasPendingMigration(character)).toBe(false);
    });
  });

  // ===========================================================================
  // getPendingDecisionCount
  // ===========================================================================

  describe("getPendingDecisionCount", () => {
    it("should return 0 for plan with no steps", () => {
      const plan = createMockMigrationPlan({ steps: [] });

      expect(getPendingDecisionCount(plan)).toBe(0);
    });

    it("should return 0 for plan with all complete steps", () => {
      const plan = createMockMigrationPlan({
        steps: [
          createMockMigrationStep({ after: { value: 1 } }),
          createMockMigrationStep({ after: { value: 2 } }),
        ],
      });

      expect(getPendingDecisionCount(plan)).toBe(0);
    });

    it("should count steps with null after value", () => {
      const plan = createMockMigrationPlan({
        steps: [
          createMockMigrationStep({ after: null }),
          createMockMigrationStep({ after: { value: 1 } }),
          createMockMigrationStep({ after: null }),
        ],
      });

      expect(getPendingDecisionCount(plan)).toBe(2);
    });
  });

  // ===========================================================================
  // getPendingSteps
  // ===========================================================================

  describe("getPendingSteps", () => {
    it("should return empty array for plan with no steps", () => {
      const plan = createMockMigrationPlan({ steps: [] });

      expect(getPendingSteps(plan)).toEqual([]);
    });

    it("should return empty array for plan with all complete steps", () => {
      const plan = createMockMigrationPlan({
        steps: [
          createMockMigrationStep({ after: { value: 1 } }),
          createMockMigrationStep({ after: { value: 2 } }),
        ],
      });

      expect(getPendingSteps(plan)).toEqual([]);
    });

    it("should return only steps with null after value", () => {
      const pendingStep1 = createMockMigrationStep({ changeId: "c1", after: null });
      const completeStep = createMockMigrationStep({ changeId: "c2", after: { value: 1 } });
      const pendingStep2 = createMockMigrationStep({ changeId: "c3", after: null });

      const plan = createMockMigrationPlan({
        steps: [pendingStep1, completeStep, pendingStep2],
      });

      const pending = getPendingSteps(plan);

      expect(pending).toHaveLength(2);
      expect(pending[0].changeId).toBe("c1");
      expect(pending[1].changeId).toBe("c3");
    });
  });

  // ===========================================================================
  // updatePlanWithSelection
  // ===========================================================================

  describe("updatePlanWithSelection", () => {
    it("should update step with matching changeId", () => {
      const plan = createMockMigrationPlan({
        steps: [
          createMockMigrationStep({ changeId: "c1", action: "update", after: null }),
          createMockMigrationStep({ changeId: "c2", action: "update", after: { value: 1 } }),
        ],
      });

      const selection = {
        option: { id: "opt-1", label: "Replace", description: "Replace item" },
        action: "replace" as const,
        newValue: { replacement: true },
      };

      const updated = updatePlanWithSelection(plan, "c1", selection);

      expect(updated.steps[0].action).toBe("replace");
      expect(updated.steps[0].after).toEqual({ replacement: true });
      expect(updated.steps[1]).toEqual(plan.steps[1]); // Unchanged
    });

    it("should not mutate original plan", () => {
      const originalStep = createMockMigrationStep({ changeId: "c1", after: null });
      const plan = createMockMigrationPlan({ steps: [originalStep] });

      const selection = {
        option: { id: "opt-1", label: "Remove", description: "Remove" },
        action: "remove" as const,
        newValue: null,
      };

      const updated = updatePlanWithSelection(plan, "c1", selection);

      expect(plan.steps[0].after).toBeNull();
      expect(updated.steps[0].after).toBeNull();
      expect(updated).not.toBe(plan);
    });

    it("should update isComplete when all steps have after values", () => {
      const plan = createMockMigrationPlan({
        isComplete: false,
        steps: [
          createMockMigrationStep({ changeId: "c1", after: null }),
          createMockMigrationStep({ changeId: "c2", after: { value: 1 } }),
        ],
      });

      const selection = {
        option: { id: "opt-1", label: "Update", description: "Update" },
        action: "update" as const,
        newValue: { value: 2 },
      };

      const updated = updatePlanWithSelection(plan, "c1", selection);

      expect(updated.isComplete).toBe(true);
    });

    it("should keep isComplete false when some steps still pending", () => {
      const plan = createMockMigrationPlan({
        isComplete: false,
        steps: [
          createMockMigrationStep({ changeId: "c1", after: null }),
          createMockMigrationStep({ changeId: "c2", after: null }),
        ],
      });

      const selection = {
        option: { id: "opt-1", label: "Update", description: "Update" },
        action: "update" as const,
        newValue: { value: 1 },
      };

      const updated = updatePlanWithSelection(plan, "c1", selection);

      expect(updated.isComplete).toBe(false);
    });

    it("should accumulate karma delta from selection", () => {
      const plan = createMockMigrationPlan({
        estimatedKarmaDelta: 5,
        steps: [createMockMigrationStep({ changeId: "c1", after: null })],
      });

      const selection = {
        option: { id: "opt-1", label: "Replace", description: "Replace", karmaDelta: 3 },
        action: "replace" as const,
        newValue: { new: true },
      };

      const updated = updatePlanWithSelection(plan, "c1", selection);

      expect(updated.estimatedKarmaDelta).toBe(8); // 5 + 3
    });

    it("should not change karma delta when option has no karmaDelta", () => {
      const plan = createMockMigrationPlan({
        estimatedKarmaDelta: 5,
        steps: [createMockMigrationStep({ changeId: "c1", after: null })],
      });

      const selection = {
        option: { id: "opt-1", label: "Update", description: "Update" },
        action: "update" as const,
        newValue: { value: 1 },
      };

      const updated = updatePlanWithSelection(plan, "c1", selection);

      expect(updated.estimatedKarmaDelta).toBe(5);
    });
  });

  // ===========================================================================
  // createRemovalOptions
  // ===========================================================================

  describe("createRemovalOptions", () => {
    it("should create remove and archive options", () => {
      const options = createRemovalOptions("item-123", "Test Item", []);

      expect(options).toHaveLength(2);
      expect(options[0].id).toBe("remove-item-123");
      expect(options[0].label).toBe("Remove");
      expect(options[0].description).toContain("Test Item");

      expect(options[1].id).toBe("archive-item-123");
      expect(options[1].label).toBe("Archive");
    });

    it("should add replacement options for alternatives", () => {
      const alternatives = [
        { id: "alt-1", name: "Alternative 1", karmaDelta: 2 },
        { id: "alt-2", name: "Alternative 2" },
      ];

      const options = createRemovalOptions("item-123", "Test Item", alternatives);

      expect(options).toHaveLength(4); // remove, archive, 2 replacements
      expect(options[2].id).toBe("replace-item-123-with-alt-1");
      expect(options[2].label).toContain("Alternative 1");
      expect(options[2].targetItemId).toBe("alt-1");
      expect(options[2].karmaDelta).toBe(2);

      expect(options[3].id).toBe("replace-item-123-with-alt-2");
      expect(options[3].targetItemId).toBe("alt-2");
      expect(options[3].karmaDelta).toBeUndefined();
    });

    it("should set karmaDelta to 0 for remove and archive", () => {
      const options = createRemovalOptions("item-123", "Test", []);

      expect(options[0].karmaDelta).toBe(0);
      expect(options[1].karmaDelta).toBe(0);
    });

    it("should include item name in descriptions", () => {
      const options = createRemovalOptions("skill-1", "Firearms", [
        { id: "skill-2", name: "Pistols" },
      ]);

      expect(options[0].description).toContain("Firearms");
      expect(options[1].description).toContain("Firearms");
      expect(options[2].description).toContain("Firearms");
      expect(options[2].description).toContain("Pistols");
    });
  });
});
