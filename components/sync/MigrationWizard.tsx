"use client";

/**
 * Migration Wizard Component
 *
 * A step-by-step wizard for guiding users through character migration.
 * Handles breaking changes that require user decisions.
 *
 * Steps:
 * 1. Review - Overview of all changes
 * 2. Resolve - One step per breaking change requiring decision
 * 3. Confirm - Preview final state and apply
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 */

import { useState } from "react";
import { useMigrationWizard } from "@/lib/rules/sync/hooks";
import type { ID, DriftChange, MigrationOption } from "@/lib/types";
import type { UserSelection } from "@/lib/rules/sync/migration-engine";

// =============================================================================
// TYPES
// =============================================================================

interface MigrationWizardProps {
  /** Character ID to migrate */
  characterId: ID;
  /** Called when wizard is closed */
  onClose: () => void;
  /** Called when migration completes successfully */
  onComplete?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MigrationWizard({ characterId, onClose, onComplete }: MigrationWizardProps) {
  const wizard = useMigrationWizard(characterId);
  const [isApplying, setIsApplying] = useState(false);

  // Get breaking changes that need decisions
  const breakingChanges = wizard.report?.changes.filter((c) => c.severity === "breaking") || [];

  // Current breaking change (if on a resolve step)
  const currentChangeIndex = wizard.currentStep - 1; // Step 0 is review
  const currentChange =
    currentChangeIndex >= 0 && currentChangeIndex < breakingChanges.length
      ? breakingChanges[currentChangeIndex]
      : null;

  const handleApply = async () => {
    setIsApplying(true);
    const result = await wizard.applyMigration();
    setIsApplying(false);

    if (result?.success) {
      onComplete?.();
      onClose();
    }
  };

  if (!wizard.report) {
    return (
      <WizardContainer onClose={onClose}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading migration data...</div>
        </div>
      </WizardContainer>
    );
  }

  return (
    <WizardContainer onClose={onClose}>
      {/* Progress indicator */}
      <WizardProgress
        currentStep={wizard.currentStep}
        totalSteps={wizard.totalSteps}
        breakingChanges={breakingChanges.length}
      />

      {/* Content area */}
      <div className="p-6">
        {wizard.currentStep === 0 && (
          <ReviewStep report={wizard.report} breakingCount={breakingChanges.length} />
        )}

        {currentChange && (
          <ResolveStep
            change={currentChange}
            changeIndex={currentChangeIndex}
            totalChanges={breakingChanges.length}
            onSelect={(option, action) => wizard.makeSelection(currentChange.id, option, action)}
            currentSelection={wizard.plan?.steps.find((s) => s.changeId === currentChange.id)}
          />
        )}

        {wizard.currentStep === wizard.totalSteps - 1 && (
          <ConfirmStep plan={wizard.plan} canApply={wizard.canApply} error={wizard.error} />
        )}
      </div>

      {/* Footer with navigation */}
      <WizardFooter
        currentStep={wizard.currentStep}
        totalSteps={wizard.totalSteps}
        canApply={wizard.canApply}
        isApplying={isApplying}
        onPrev={wizard.prevStep}
        onNext={wizard.nextStep}
        onApply={handleApply}
        onCancel={onClose}
      />
    </WizardContainer>
  );
}

// =============================================================================
// WIZARD CONTAINER
// =============================================================================

interface WizardContainerProps {
  children: React.ReactNode;
  onClose: () => void;
}

function WizardContainer({ children, onClose }: WizardContainerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Migration Wizard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// =============================================================================
// PROGRESS INDICATOR
// =============================================================================

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  breakingChanges: number;
}

function WizardProgress({ currentStep, totalSteps, breakingChanges }: WizardProgressProps) {
  const steps = [
    { label: "Review", description: "Review all changes" },
    ...Array.from({ length: breakingChanges }, (_, i) => ({
      label: `Resolve ${i + 1}`,
      description: `Resolve breaking change ${i + 1}`,
    })),
    { label: "Confirm", description: "Apply migration" },
  ];

  return (
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }
              `}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 ${
                  index < currentStep ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Step {currentStep + 1} of {totalSteps}: {steps[currentStep]?.label}
      </div>
    </div>
  );
}

// =============================================================================
// REVIEW STEP
// =============================================================================

interface ReviewStepProps {
  report: { changes: DriftChange[] };
  breakingCount: number;
}

function ReviewStep({ report, breakingCount }: ReviewStepProps) {
  const nonBreaking = report.changes.filter((c) => c.severity !== "breaking");
  const breaking = report.changes.filter((c) => c.severity === "breaking");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Changes Detected</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review the changes between your character&apos;s ruleset and the current version.
        </p>
      </div>

      {/* Non-breaking changes */}
      {nonBreaking.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">
            Safe Changes ({nonBreaking.length})
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300 mb-2">
            These changes will be applied automatically.
          </p>
          <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
            {nonBreaking.slice(0, 5).map((change) => (
              <li key={change.id} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {change.description}
              </li>
            ))}
            {nonBreaking.length > 5 && (
              <li className="text-green-500">...and {nonBreaking.length - 5} more</li>
            )}
          </ul>
        </div>
      )}

      {/* Breaking changes */}
      {breaking.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
            Changes Requiring Decision ({breaking.length})
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
            You&apos;ll need to make decisions about these changes.
          </p>
          <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
            {breaking.map((change) => (
              <li key={change.id} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {change.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {breakingCount > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click &quot;Next&quot; to review each change that requires your decision.
        </p>
      )}
    </div>
  );
}

// =============================================================================
// RESOLVE STEP
// =============================================================================

interface ResolveStepProps {
  change: DriftChange;
  changeIndex: number;
  totalChanges: number;
  onSelect: (option: MigrationOption, action: UserSelection["action"]) => void;
  currentSelection?: { action: string; after: unknown };
}

function ResolveStep({
  change,
  changeIndex,
  totalChanges,
  onSelect,
  currentSelection,
}: ResolveStepProps) {
  // Generate options for this change
  const options = generateOptionsForChange(change);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Change {changeIndex + 1} of {totalChanges}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-1">
          {change.description}
        </h3>
      </div>

      {/* Change details */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Previous Value
            </div>
            <div className="text-sm text-gray-900 dark:text-white">
              {formatValue(change.affectedItems[0]?.previousValue)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              New Value
            </div>
            <div className="text-sm text-gray-900 dark:text-white">
              {formatValue(change.affectedItems[0]?.currentValue)}
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Choose an action:
        </div>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option, option.id.startsWith("remove") ? "remove" : "update")}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-colors
              ${
                currentSelection?.action === (option.id.startsWith("remove") ? "remove" : "update")
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
          >
            <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {option.description}
            </div>
            {option.karmaDelta !== undefined && option.karmaDelta !== 0 && (
              <div
                className={`text-sm mt-1 ${option.karmaDelta > 0 ? "text-green-600" : "text-red-600"}`}
              >
                Karma: {option.karmaDelta > 0 ? "+" : ""}
                {option.karmaDelta}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// CONFIRM STEP
// =============================================================================

interface ConfirmStepProps {
  plan: { steps: Array<{ action: string; before: unknown; after: unknown }> } | null;
  canApply: boolean;
  error?: string;
}

function ConfirmStep({ plan, canApply, error }: ConfirmStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Confirm Migration
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review your selections before applying the migration.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-4">
          {error}
        </div>
      )}

      {!canApply && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg p-4">
          Please complete all required decisions before applying.
        </div>
      )}

      {plan && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Summary ({plan.steps.length} changes)
          </h4>
          <ul className="space-y-2 text-sm">
            {plan.steps.map((step, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="capitalize">{step.action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This migration will update your character to the latest ruleset version. A backup of your
          current state will be saved for rollback if needed.
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// WIZARD FOOTER
// =============================================================================

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  canApply: boolean;
  isApplying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onApply: () => void;
  onCancel: () => void;
}

function WizardFooter({
  currentStep,
  totalSteps,
  canApply,
  isApplying,
  onPrev,
  onNext,
  onApply,
  onCancel,
}: WizardFooterProps) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        Cancel
      </button>

      <div className="flex gap-3">
        {!isFirstStep && (
          <button
            onClick={onPrev}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </button>
        )}

        {isLastStep ? (
          <button
            onClick={onApply}
            disabled={!canApply || isApplying}
            className={`
              px-4 py-2 text-sm font-medium text-white rounded-lg
              ${
                canApply && !isApplying
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            {isApplying ? "Applying..." : "Apply Migration"}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function generateOptionsForChange(change: DriftChange): MigrationOption[] {
  const options: MigrationOption[] = [];
  const itemId = change.affectedItems[0]?.itemId || change.id;
  const itemName = String(itemId);

  if (change.changeType === "removed") {
    options.push({
      id: `remove-${itemId}`,
      label: "Remove",
      description: `Remove ${itemName} from your character`,
      karmaDelta: 0,
    });
    options.push({
      id: `archive-${itemId}`,
      label: "Keep as Legacy",
      description: `Keep ${itemName} but mark as legacy (no longer supported)`,
      karmaDelta: 0,
    });
  } else {
    options.push({
      id: `update-${itemId}`,
      label: "Accept Update",
      description: "Update to the new value",
      karmaDelta: 0,
    });
    options.push({
      id: `keep-${itemId}`,
      label: "Keep Current",
      description: "Keep your current value (may cause validation warnings)",
      karmaDelta: 0,
    });
  }

  return options;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "(none)";
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}
