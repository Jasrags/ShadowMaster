/**
 * Migration Engine
 *
 * Handles atomic migration of characters from one ruleset version to another.
 * Generates migration plans from drift reports and executes them safely
 * with rollback support.
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 * @see ADR-004 (Hybrid Snapshot Model)
 */

import { v4 as uuidv4 } from "uuid";
import type {
  ID,
  Character,
  DriftReport,
  DriftChange,
  MigrationPlan,
  MigrationStep,
  MigrationResult,
  MigrationOption,
  MigrationAction,
  AppliedMigration,
  SyncAuditEntry,
  AppliedChange,
  RuleModuleType,
  DriftChangeType,
} from "@/lib/types";
import { applyMigration, updateSyncStatus } from "@/lib/storage/characters";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of validating a migration plan
 */
export interface ValidationResult {
  /** Is the plan valid and ready to execute */
  isValid: boolean;
  /** Validation errors that prevent execution */
  errors: ValidationError[];
  /** Warnings that don't prevent execution */
  warnings: ValidationWarning[];
}

/**
 * A validation error
 */
interface ValidationError {
  field: string;
  message: string;
}

/**
 * A validation warning
 */
interface ValidationWarning {
  field: string;
  message: string;
}

/**
 * User selection for a migration step
 */
export interface UserSelection {
  /** The migration option chosen */
  option: MigrationOption;
  /** The action to take based on the option */
  action: MigrationAction;
  /** The new value to use (if replacing) */
  newValue?: unknown;
}

// =============================================================================
// MIGRATION PLAN GENERATION
// =============================================================================

/**
 * Generate a migration plan from a drift report
 *
 * Creates a plan that describes all steps needed to migrate a character
 * from their current ruleset version to the target version.
 *
 * @param report - The drift report to generate a plan from
 * @param userSelections - Optional user choices for manual-select changes
 * @returns A migration plan
 */
export function generateMigrationPlan(
  report: DriftReport,
  userSelections?: Map<ID, UserSelection>
): MigrationPlan {
  const steps: MigrationStep[] = [];
  let isComplete = true;
  let estimatedKarmaDelta = 0;

  for (const change of report.changes) {
    const recommendation = report.recommendations.find(
      (r) => r.changeId === change.id
    );

    // Determine the action for this change
    let action: MigrationAction;
    let after: unknown = null;

    if (recommendation?.autoApplicable) {
      // Auto-applicable changes get automatic actions
      action = getAutoAction(change);
      after = change.affectedItems[0]?.currentValue;
    } else if (userSelections?.has(change.id)) {
      // User has made a selection
      const selection = userSelections.get(change.id)!;
      action = selection.action;
      after = selection.newValue ?? change.affectedItems[0]?.currentValue;
      if (selection.option.karmaDelta) {
        estimatedKarmaDelta += selection.option.karmaDelta;
      }
    } else {
      // Requires user choice but none provided - use a placeholder
      // We'll track completion separately
      action = "update";
      after = null;
      isComplete = false;
    }

    // Calculate karma delta for this step
    const stepKarmaDelta = calculateKarmaDelta(change, action);
    estimatedKarmaDelta += stepKarmaDelta;

    steps.push({
      changeId: change.id,
      action,
      before: change.affectedItems[0]?.previousValue,
      after,
    });
  }

  return {
    id: uuidv4(),
    characterId: report.characterId,
    sourceVersion: report.currentVersion,
    targetVersion: report.targetVersion,
    steps,
    isComplete,
    estimatedKarmaDelta,
  };
}

/**
 * Get the automatic action for a change
 */
function getAutoAction(change: DriftChange): MigrationAction {
  switch (change.changeType) {
    case "added":
      return "update"; // Update to include new items
    case "modified":
      return "update"; // Update to new values
    case "deprecated":
      return "update"; // Keep using (update metadata)
    case "removed":
      return "remove"; // Remove deprecated items
    default:
      return "update";
  }
}

/**
 * Calculate karma delta for a migration step
 */
function calculateKarmaDelta(
  change: DriftChange,
  action: MigrationAction
): number {
  // Basic karma calculation - can be expanded based on change type
  if (action === "remove") {
    // Removing items might refund karma
    const previousValue = change.affectedItems[0]?.previousValue;
    if (previousValue && typeof previousValue === "object") {
      const karmaCost = (previousValue as { karmaCost?: number }).karmaCost;
      if (karmaCost) {
        return karmaCost; // Refund karma
      }
    }
  }

  if (action === "replace") {
    // Replacement might have karma difference
    const previousValue = change.affectedItems[0]?.previousValue;
    const currentValue = change.affectedItems[0]?.currentValue;

    if (previousValue && currentValue) {
      const prevCost = (previousValue as { karmaCost?: number }).karmaCost || 0;
      const currCost = (currentValue as { karmaCost?: number }).karmaCost || 0;
      return currCost - prevCost;
    }
  }

  return 0;
}

// =============================================================================
// MIGRATION VALIDATION
// =============================================================================

/**
 * Validate a migration plan before execution
 *
 * Checks that the plan is complete, valid, and can be applied
 * to the character safely.
 *
 * @param character - The character to validate against
 * @param plan - The migration plan to validate
 * @returns Validation result
 */
export function validateMigrationPlan(
  character: Character,
  plan: MigrationPlan
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check that plan is for this character
  if (plan.characterId !== character.id) {
    errors.push({
      field: "characterId",
      message: "Migration plan is for a different character",
    });
  }

  // Check that all steps have been decided
  if (!plan.isComplete) {
    const incompleteSteps = plan.steps.filter((s) => s.after === null);
    if (incompleteSteps.length > 0) {
      errors.push({
        field: "steps",
        message: `${incompleteSteps.length} step(s) require user decisions`,
      });
    }
  }

  // Check karma balance
  if (plan.estimatedKarmaDelta !== 0) {
    const newKarma = character.karmaCurrent + plan.estimatedKarmaDelta;
    if (newKarma < 0) {
      errors.push({
        field: "karma",
        message: `Migration would result in negative karma (${newKarma})`,
      });
    }
  }

  // Warn if migrating from an older snapshot
  if (character.rulesetSnapshotId !== plan.sourceVersion.snapshotId) {
    warnings.push({
      field: "sourceVersion",
      message: "Character snapshot does not match migration source version",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// MIGRATION EXECUTION
// =============================================================================

/**
 * Execute a migration plan atomically
 *
 * Applies all migration steps to the character. If any step fails,
 * the entire migration is rolled back.
 *
 * @param userId - The user ID who owns the character
 * @param character - The character to migrate
 * @param plan - The migration plan to execute
 * @returns Migration result
 */
export async function executeMigration(
  userId: ID,
  character: Character,
  plan: MigrationPlan
): Promise<MigrationResult> {
  // Validate first
  const validation = validateMigrationPlan(character, plan);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.map((e) => e.message).join("; "),
      appliedSteps: [],
      rollbackAvailable: false,
    };
  }

  const appliedSteps: MigrationStep[] = [];

  try {
    // Update sync status to migrating
    await updateSyncStatus(
      userId,
      character.id,
      "migrating",
      character.legalityStatus || "draft"
    );

    // Apply each step
    for (const step of plan.steps) {
      // Apply the step
      await applyMigrationStep(character, step);
      appliedSteps.push(step);
    }

    // Create applied migration record
    const appliedMigrationRecord: AppliedMigration = {
      plan: plan,
      appliedAt: new Date().toISOString(),
      appliedBy: userId,
      previousState: { ...character }, // Snapshot of previous state
      canRollback: true,
    };

    // Apply the migration to storage
    const updatedCharacter = await applyMigration(userId, character.id, appliedMigrationRecord);

    // Update sync status to synchronized
    await updateSyncStatus(userId, character.id, "synchronized", "rules-legal");

    return {
      success: true,
      character: updatedCharacter,
      appliedSteps,
      rollbackAvailable: true,
    };
  } catch (error) {
    // Rollback on error
    await updateSyncStatus(
      userId,
      character.id,
      "outdated",
      character.legalityStatus || "draft"
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Migration failed",
      appliedSteps,
      rollbackAvailable: appliedSteps.length > 0,
    };
  }
}

/**
 * Apply a single migration step to a character
 */
async function applyMigrationStep(
  _character: Character,
  step: MigrationStep
): Promise<void> {
  // In a full implementation, this would modify the character
  // based on the step's action and the affected item type.
  // For now, we just validate the step can be applied.

  switch (step.action) {
    case "update":
      // Update to new value
      break;

    case "replace":
      // Replace with a user-selected alternative
      if (step.after === undefined) {
        throw new Error(`Replace action requires a new value`);
      }
      break;

    case "remove":
      // Remove the item from the character
      break;

    case "archive":
      // Move to legacy storage
      break;

    case "adjust-karma":
      // Apply karma adjustment
      break;

    default:
      throw new Error(`Unknown migration action: ${step.action}`);
  }
}

// =============================================================================
// MIGRATION HELPERS
// =============================================================================

/**
 * Create a sync audit entry for a migration event
 */
export function createMigrationAuditEntry(
  eventType: "migration_started" | "migration_completed" | "migration_rolled_back",
  plan: MigrationPlan,
  result: MigrationResult,
  userId?: ID
): SyncAuditEntry {
  // Convert steps to applied changes
  const changes: AppliedChange[] = result.appliedSteps.map((step) => ({
    type: "modified" as DriftChangeType,
    module: "skills" as RuleModuleType, // Would need to track this from drift report
    itemId: step.changeId,
    before: step.before,
    after: step.after,
  }));

  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    eventType,
    sourceVersion: plan.sourceVersion,
    targetVersion: result.success ? plan.targetVersion : undefined,
    changes,
    actor: {
      type: userId ? "user" : "system",
      userId,
      description: userId ? `User ${userId}` : "System migration",
    },
  };
}

/**
 * Check if a character has pending migrations
 */
export function hasPendingMigration(character: Character): boolean {
  return !!character.pendingMigration;
}

/**
 * Get the number of steps that require user decisions
 */
export function getPendingDecisionCount(plan: MigrationPlan): number {
  return plan.steps.filter((s) => s.after === null).length;
}

/**
 * Get steps that require user decisions
 */
export function getPendingSteps(plan: MigrationPlan): MigrationStep[] {
  return plan.steps.filter((s) => s.after === null);
}

/**
 * Update a migration plan with a user selection
 */
export function updatePlanWithSelection(
  plan: MigrationPlan,
  changeId: ID,
  selection: UserSelection
): MigrationPlan {
  const updatedSteps = plan.steps.map((step) => {
    if (step.changeId === changeId) {
      return {
        ...step,
        action: selection.action,
        after: selection.newValue,
      };
    }
    return step;
  });

  const isComplete = updatedSteps.every((s) => s.after !== null);

  // Recalculate karma delta
  let estimatedKarmaDelta = plan.estimatedKarmaDelta;
  if (selection.option.karmaDelta) {
    estimatedKarmaDelta += selection.option.karmaDelta;
  }

  return {
    ...plan,
    steps: updatedSteps,
    isComplete,
    estimatedKarmaDelta,
  };
}

/**
 * Create migration options for a removed item
 */
export function createRemovalOptions(
  itemId: ID,
  itemName: string,
  alternatives: Array<{ id: ID; name: string; karmaDelta?: number }>
): MigrationOption[] {
  const options: MigrationOption[] = [
    {
      id: `remove-${itemId}`,
      label: "Remove",
      description: `Remove ${itemName} from character`,
      karmaDelta: 0,
    },
    {
      id: `archive-${itemId}`,
      label: "Archive",
      description: `Keep ${itemName} as legacy item (read-only)`,
      karmaDelta: 0,
    },
  ];

  // Add replacement options
  for (const alt of alternatives) {
    options.push({
      id: `replace-${itemId}-with-${alt.id}`,
      label: `Replace with ${alt.name}`,
      description: `Replace ${itemName} with ${alt.name}`,
      targetItemId: alt.id,
      karmaDelta: alt.karmaDelta,
    });
  }

  return options;
}
