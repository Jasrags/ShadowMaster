"use client";

/**
 * Synchronization React Hooks
 *
 * Provides React hooks for managing character synchronization state,
 * drift analysis, and migration workflows in the UI.
 *
 * @see docs/capabilities/ruleset.system-synchronization.md
 */

import { useState, useCallback, useEffect } from "react";
import type {
  ID,
  Character,
  SyncStatus,
  LegalityStatus,
  DriftReport,
  MigrationPlan,
  MigrationResult,
  MigrationOption,
  StabilityShield,
} from "@/lib/types";
import type { UserSelection } from "./migration-engine";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of the useSyncStatus hook
 */
export interface SyncStatusResult {
  /** Current sync status */
  status: SyncStatus;
  /** Current legality status */
  legalityStatus: LegalityStatus;
  /** Drift report if available */
  driftReport?: DriftReport;
  /** Whether status is being checked */
  isChecking: boolean;
  /** Error if check failed */
  error?: string;
  /** Refresh the status */
  refresh: () => Promise<void>;
}

/**
 * Result of the useDriftAnalysis hook
 */
export interface DriftAnalysisResult {
  /** Trigger drift analysis */
  analyze: () => Promise<DriftReport | null>;
  /** Latest drift report */
  report?: DriftReport;
  /** Whether analysis is in progress */
  isAnalyzing: boolean;
  /** Error if analysis failed */
  error?: string;
}

/**
 * Result of the useMigrationWizard hook
 */
export interface MigrationWizardResult {
  /** Current drift report */
  report: DriftReport | null;
  /** Current migration plan */
  plan: MigrationPlan | null;
  /** Current wizard step */
  currentStep: number;
  /** Total wizard steps */
  totalSteps: number;
  /** User selections for breaking changes */
  selections: Map<ID, UserSelection>;
  /** Make a selection for a change */
  makeSelection: (changeId: ID, option: MigrationOption, action: UserSelection["action"]) => void;
  /** Apply the migration */
  applyMigration: () => Promise<MigrationResult | null>;
  /** Whether migration can be applied */
  canApply: boolean;
  /** Whether migration is being applied */
  isApplying: boolean;
  /** Error if migration failed */
  error?: string;
  /** Go to next step */
  nextStep: () => void;
  /** Go to previous step */
  prevStep: () => void;
  /** Reset the wizard */
  reset: () => void;
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to check and monitor sync status for a character
 *
 * @param characterId - The character ID to check
 * @returns Sync status result
 */
export function useSyncStatus(characterId: ID): SyncStatusResult {
  const [status, setStatus] = useState<SyncStatus>("synchronized");
  const [legalityStatus, setLegalityStatus] = useState<LegalityStatus>("rules-legal");
  const [driftReport, setDriftReport] = useState<DriftReport | undefined>();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    setIsChecking(true);
    setError(undefined);

    try {
      const response = await fetch(`/api/characters/${characterId}/sync`);
      if (!response.ok) {
        throw new Error("Failed to fetch sync status");
      }

      const data = await response.json();
      setStatus(data.syncStatus);
      setLegalityStatus(data.legalityStatus);
      setDriftReport(data.driftReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsChecking(false);
    }
  }, [characterId]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    status,
    legalityStatus,
    driftReport,
    isChecking,
    error,
    refresh,
  };
}

/**
 * Hook to get stability shield status for a character
 *
 * @param characterId - The character ID
 * @param skip - If true, skip the API call (use when status is derived from props)
 * @returns Stability shield status
 */
export function useStabilityShield(
  characterId: ID,
  skip = false
): StabilityShield & { isLoading: boolean } {
  const [shield, setShield] = useState<StabilityShield>({
    status: "green",
    label: "Loading...",
    tooltip: "Checking character status",
  });
  const [isLoading, setIsLoading] = useState(!skip);

  useEffect(() => {
    // Skip API call if requested
    if (skip) {
      setIsLoading(false);
      return;
    }

    async function fetchShield() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/characters/${characterId}/sync/shield`);
        if (!response.ok) {
          throw new Error("Failed to fetch shield status");
        }

        const data = await response.json();
        setShield(data);
      } catch {
        setShield({
          status: "yellow",
          label: "Unknown",
          tooltip: "Unable to determine status",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchShield();
  }, [characterId, skip]);

  return { ...shield, isLoading };
}

/**
 * Hook to trigger and manage drift analysis
 *
 * @param characterId - The character ID
 * @returns Drift analysis controls and result
 */
export function useDriftAnalysis(characterId: ID): DriftAnalysisResult {
  const [report, setReport] = useState<DriftReport | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const analyze = useCallback(async (): Promise<DriftReport | null> => {
    setIsAnalyzing(true);
    setError(undefined);

    try {
      const response = await fetch(`/api/characters/${characterId}/sync`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to analyze drift");
      }

      const data = await response.json();
      setReport(data.report);
      return data.report;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [characterId]);

  return {
    analyze,
    report,
    isAnalyzing,
    error,
  };
}

/**
 * Hook to manage the migration wizard workflow
 *
 * @param characterId - The character ID
 * @returns Migration wizard controls and state
 */
export function useMigrationWizard(characterId: ID): MigrationWizardResult {
  const [report, setReport] = useState<DriftReport | null>(null);
  const [plan, setPlan] = useState<MigrationPlan | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [selections, setSelections] = useState<Map<ID, UserSelection>>(new Map());

  // Calculate total steps (1 for review + 1 per breaking change + 1 for confirm)
  const breakingChanges = report?.changes.filter((c) => c.severity === "breaking") || [];
  const totalSteps = 1 + breakingChanges.length + 1;

  // Whether all required selections are made
  const canApply = plan?.isComplete ?? false;

  const makeSelection = useCallback(
    (changeId: ID, option: MigrationOption, action: UserSelection["action"]) => {
      setSelections((prev) => {
        const next = new Map(prev);
        next.set(changeId, { option, action, newValue: option.targetItemId });
        return next;
      });

      // Update plan with selection
      setPlan((prev) => {
        if (!prev) return null;

        const updatedSteps = prev.steps.map((step) => {
          if (step.changeId === changeId) {
            return { ...step, action, after: option.targetItemId };
          }
          return step;
        });

        const isComplete = updatedSteps.every((s) => s.after !== null);

        return { ...prev, steps: updatedSteps, isComplete };
      });
    },
    []
  );

  const applyMigration = useCallback(async (): Promise<MigrationResult | null> => {
    if (!plan || !canApply) {
      setError("Migration plan is not complete");
      return null;
    }

    setIsApplying(true);
    setError(undefined);

    try {
      const response = await fetch(`/api/characters/${characterId}/sync/migrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error("Failed to apply migration");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return null;
    } finally {
      setIsApplying(false);
    }
  }, [characterId, plan, canApply]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setReport(null);
    setPlan(null);
    setCurrentStep(0);
    setSelections(new Map());
    setError(undefined);
  }, []);

  // Load initial drift report
  useEffect(() => {
    async function loadReport() {
      try {
        const response = await fetch(`/api/characters/${characterId}/sync`, {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          setReport(data.report);

          // Generate initial plan
          if (data.plan) {
            setPlan(data.plan);
          }
        }
      } catch {
        // Silently fail on initial load
      }
    }

    loadReport();
  }, [characterId]);

  return {
    report,
    plan,
    currentStep,
    totalSteps,
    selections,
    makeSelection,
    applyMigration,
    canApply,
    isApplying,
    error,
    nextStep,
    prevStep,
    reset,
  };
}

// =============================================================================
// HELPER HOOKS
// =============================================================================

/**
 * Hook to check if a character has pending sync updates
 *
 * @param character - The character to check
 * @returns Whether updates are pending
 */
export function useHasPendingUpdates(character: Character | null): boolean {
  if (!character) return false;

  return (
    character.syncStatus === "outdated" ||
    character.syncStatus === "invalid" ||
    !!character.pendingMigration
  );
}

/**
 * Hook to get a human-readable sync status message
 *
 * @param status - The sync status
 * @returns Human-readable message
 */
export function useSyncStatusMessage(status: SyncStatus): string {
  switch (status) {
    case "synchronized":
      return "Character is up to date with current rules";
    case "outdated":
      return "Updates are available for this character";
    case "invalid":
      return "Character has validation errors that need resolution";
    case "migrating":
      return "Character is currently being migrated";
    default:
      return "Unknown sync status";
  }
}

/**
 * Hook to get a human-readable legality status message
 *
 * @param status - The legality status
 * @returns Human-readable message
 */
export function useLegalityStatusMessage(status: LegalityStatus): string {
  switch (status) {
    case "rules-legal":
      return "Character follows all rules";
    case "draft":
      return "Character creation is in progress";
    case "invalid":
      return "Character has rule violations";
    case "legacy":
      return "Character was created under older rules";
    default:
      return "Unknown legality status";
  }
}
