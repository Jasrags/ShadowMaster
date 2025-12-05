"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button, Link } from "react-aria-components";
import {
  useRuleset,
  useCreationMethod,
  usePriorityTable,
  useMetatypes,
} from "@/lib/rules";
import { StepperSidebar } from "./StepperSidebar";
import { ValidationPanel } from "./ValidationPanel";
import type { CreationState, ID, ValidationError } from "@/lib/types";

// Step components
import { PriorityStep } from "./steps/PriorityStep";
import { MetatypeStep } from "./steps/MetatypeStep";
import { AttributesStep } from "./steps/AttributesStep";
import { MagicStep } from "./steps/MagicStep";
import { SkillsStep } from "./steps/SkillsStep";
import { QualitiesStep } from "./steps/QualitiesStep";
import { GearStep } from "./steps/GearStep";
import { ReviewStep } from "./steps/ReviewStep";

interface CreationWizardProps {
  onCancel: () => void;
  onComplete: (characterId: ID) => void;
}

// Local storage key for draft saving
const DRAFT_STORAGE_KEY = "shadowmaster-character-draft";

// Initial creation state
function createInitialState(): CreationState {
  return {
    characterId: crypto.randomUUID(),
    creationMethodId: "priority",
    currentStep: 0,
    completedSteps: [],
    budgets: {},
    selections: {},
    priorities: {},
    errors: [],
    warnings: [],
    updatedAt: new Date().toISOString(),
  };
}

// Load draft from local storage
function loadDraft(): CreationState | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate it's a valid state
      if (parsed.characterId && parsed.creationMethodId) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

// Save draft to local storage
function saveDraft(state: CreationState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

// Clear draft from local storage
function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function CreationWizard({ onCancel, onComplete }: CreationWizardProps) {
  const { ruleset, editionCode } = useRuleset();
  const creationMethod = useCreationMethod();
  const priorityTable = usePriorityTable();
  const metatypes = useMetatypes();

  // Creation state - load draft if available
  const [state, setState] = useState<CreationState>(() => {
    const draft = loadDraft();
    return draft || createInitialState();
  });

  // Track if we have a draft
  const [hasDraft, setHasDraft] = useState(false);

  // Check for existing draft on mount
  useEffect(() => {
    const draft = loadDraft();
    setHasDraft(!!draft);
  }, []);

  // Auto-save draft on state changes
  useEffect(() => {
    if (Object.keys(state.priorities || {}).length > 0) {
      saveDraft(state);
    }
  }, [state]);

  // Get steps from creation method
  const steps = useMemo(() => {
    return creationMethod?.steps || [];
  }, [creationMethod]);

  // Current step
  const currentStep = steps[state.currentStep];

  // Validate current step completion
  const validateCurrentStep = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];
    const stepId = currentStep?.id;

    switch (stepId) {
      case "priorities":
        // All 5 priorities must be assigned
        if (Object.keys(state.priorities || {}).length < 5) {
          errors.push({
            constraintId: "priorities-complete",
            stepId,
            message: "All five priorities must be assigned before continuing.",
            severity: "error",
          });
        }
        break;

      case "metatype":
        // Metatype must be selected
        if (!state.selections.metatype) {
          errors.push({
            constraintId: "metatype-selected",
            stepId,
            message: "Please select a metatype.",
            severity: "error",
          });
        }
        break;

      case "attributes":
        // Check if all attribute points are spent (allow 0-2 unspent)
        const attrSpent = (state.budgets["attribute-points-spent"] as number) || 0;
        const attrTotal = (state.budgets["attribute-points-total"] as number) || 0;
        if (attrTotal > 0 && attrSpent < attrTotal - 2) {
          errors.push({
            constraintId: "attributes-spent",
            stepId,
            message: `You have ${attrTotal - attrSpent} attribute points remaining.`,
            severity: "warning",
          });
        }
        break;

      case "magic":
        // Magic path must be selected if available
        const magicPriority = state.priorities?.magic;
        if (magicPriority && magicPriority !== "E" && !state.selections["magical-path"]) {
          errors.push({
            constraintId: "magic-selected",
            stepId,
            message: "Please select a magical path or choose to be mundane.",
            severity: "warning",
          });
        }
        break;

      // Skills, qualities, gear - show warnings but allow continuing
      case "skills":
        const skillSpent = (state.budgets["skill-points-spent"] as number) || 0;
        const skillTotal = (state.budgets["skill-points-total"] as number) || 0;
        if (skillTotal > 0 && skillSpent < skillTotal * 0.5) {
          errors.push({
            constraintId: "skills-low",
            stepId,
            message: "You still have skill points to spend.",
            severity: "warning",
          });
        }
        break;
    }

    return errors;
  }, [currentStep?.id, state.priorities, state.selections, state.budgets]);

  // Check if current step can proceed
  const canProceed = useMemo(() => {
    const errors = validateCurrentStep();
    return !errors.some((e) => e.severity === "error");
  }, [validateCurrentStep]);

  // Navigation handlers
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setState((prev) => ({
        ...prev,
        currentStep: stepIndex,
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [steps.length]);

  const goNext = useCallback(() => {
    if (state.currentStep < steps.length - 1 && canProceed) {
      setState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: prev.completedSteps.includes(currentStep?.id || "")
          ? prev.completedSteps
          : [...prev.completedSteps, currentStep?.id || ""],
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [state.currentStep, steps.length, currentStep?.id, canProceed]);

  const goBack = useCallback(() => {
    if (state.currentStep > 0) {
      setState((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        updatedAt: new Date().toISOString(),
      }));
    }
  }, [state.currentStep]);

  // Update state handler
  const updateState = useCallback((updates: Partial<CreationState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Handle cancel with draft clearing option
  const handleCancel = useCallback(() => {
    if (Object.keys(state.priorities || {}).length > 0) {
      // Show confirmation? For now just clear and cancel
      clearDraft();
    }
    onCancel();
  }, [state.priorities, onCancel]);

  // Start fresh (clear draft)
  const startFresh = useCallback(() => {
    clearDraft();
    setState(createInitialState());
    setHasDraft(false);
  }, []);

  // Calculate budget values based on priorities
  const budgetValues = useMemo(() => {
    if (!priorityTable || !state.priorities) return {};

    const values: Record<string, number> = {
      karma: 25, // Starting karma
    };

    // Get attribute points from priority
    const attrPriority = state.priorities.attributes;
    if (attrPriority && priorityTable.table[attrPriority]) {
      values["attribute-points"] = priorityTable.table[attrPriority].attributes as number;
    }

    // Get skill points from priority
    const skillPriority = state.priorities.skills;
    if (skillPriority && priorityTable.table[skillPriority]) {
      const skillData = priorityTable.table[skillPriority].skills as {
        skillPoints: number;
        skillGroupPoints: number;
      };
      values["skill-points"] = skillData?.skillPoints || 0;
      values["skill-group-points"] = skillData?.skillGroupPoints || 0;
    }

    // Get resources from priority
    const resourcePriority = state.priorities.resources;
    if (resourcePriority && priorityTable.table[resourcePriority]) {
      values["nuyen"] = priorityTable.table[resourcePriority].resources as number;
    }

    // Get special attribute points from metatype priority
    const metatypePriority = state.priorities.metatype;
    const selectedMetatype = state.selections.metatype as string;
    if (metatypePriority && selectedMetatype && priorityTable.table[metatypePriority]) {
      const metatypeData = priorityTable.table[metatypePriority].metatype as {
        specialAttributePoints: Record<string, number>;
      };
      values["special-attribute-points"] =
        metatypeData?.specialAttributePoints?.[selectedMetatype] || 0;
    }

    return values;
  }, [priorityTable, state.priorities, state.selections.metatype]);

  // Render step content
  const renderStepContent = () => {
    if (!currentStep) return null;

    const stepProps = {
      state,
      updateState,
      budgetValues,
    };

    switch (currentStep.id) {
      case "priorities":
        return <PriorityStep {...stepProps} />;
      case "metatype":
        return <MetatypeStep {...stepProps} />;
      case "attributes":
        return <AttributesStep {...stepProps} />;
      case "magic":
        return <MagicStep {...stepProps} />;
      case "skills":
        return <SkillsStep {...stepProps} />;
      case "qualities":
        return <QualitiesStep {...stepProps} />;
      case "gear":
        return <GearStep {...stepProps} />;
      case "review":
        return <ReviewStep {...stepProps} onComplete={onComplete} />;
      default:
        return (
          <div className="p-8 text-center text-zinc-500">
            Step not implemented: {currentStep.id}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-[600px] rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Sidebar */}
      <StepperSidebar
        steps={steps}
        currentStepIndex={state.currentStep}
        completedSteps={state.completedSteps}
        onStepClick={goToStep}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Step Header */}
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {currentStep?.title || "Loading..."}
              </h2>
              {currentStep?.description && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {currentStep.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {editionCode?.toUpperCase()}
              </span>
              <span>•</span>
              <span>
                Step {state.currentStep + 1} of {steps.length}
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">{renderStepContent()}</div>

        {/* Footer Navigation */}
        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                onPress={handleCancel}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </Button>
              {state.currentStep > 0 && (
                <Button
                  onPress={goBack}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Validation indicator */}
              {!canProceed && (
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  Complete required selections to continue
                </span>
              )}
              {state.currentStep < steps.length - 1 ? (
                <Button
                  onPress={goNext}
                  isDisabled={!canProceed}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    canProceed
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500"
                      : "cursor-not-allowed bg-zinc-300 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onPress={() => {
                    clearDraft();
                    onComplete(state.characterId);
                  }}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Create Character
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Panel */}
      <ValidationPanel state={state} budgetValues={budgetValues} />
    </div>
  );
}

