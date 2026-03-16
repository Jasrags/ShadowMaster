"use client";

/**
 * CreationBudgetContext
 *
 * React context that provides budget state management for character creation.
 * Calculates totals from priority selections, tracks spent amounts, and
 * provides validation state with debounced updates.
 *
 * Used by both wizard and sheet-driven creation modes.
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import type { CreationState, ValidationError } from "../types/creation";
import type { PriorityTableData } from "../rules/RulesetContext";
import { useSkills, useGameplayLevelModifiers } from "../rules/RulesetContext";
import { buildSkillCategoriesMap } from "../rules/skills/utils";
import {
  getQualityBudgetModifiers,
  type QualityBudgetModifiers,
  FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER,
} from "../rules/qualities/budget-modifiers";
import type { LifeModuleSelection } from "../types";
import {
  resolveLifeModuleGrants,
  EMPTY_GRANTS,
  type ResolvedLifeModuleGrants,
} from "../rules/life-modules/grant-resolver";
import { useLifeModules } from "../rules/RulesetContext";
import {
  calculateBudgetTotals,
  calculateLifeModulesBudgetTotals,
  calculatePointBuyBudgetTotals,
} from "../rules/creation/budget-totals";
import { extractSpentValues } from "../rules/creation/budget-spent";
import { validateBudgets } from "../rules/creation/budget-validation";

// =============================================================================
// TYPES
// =============================================================================

/**
 * State for a single budget category
 */
export interface BudgetState {
  /** Total available (from priority selection or fixed value) */
  total: number;
  /** Amount spent so far */
  spent: number;
  /** Remaining = total - spent */
  remaining: number;
  /** Display format for UI */
  displayFormat?: "number" | "currency" | "percentage" | "decimal";
  /** Human-readable label */
  label: string;
}

/**
 * All budget categories tracked during creation
 */
export type BudgetId =
  | "karma"
  | "nuyen"
  | "attribute-points"
  | "special-attribute-points"
  | "skill-points"
  | "skill-group-points"
  | "knowledge-points"
  | "contact-points"
  | "spell-slots"
  | "power-points";

/**
 * Context value provided to consumers
 */
export interface CreationBudgetContextValue {
  /** All budget states keyed by budget ID */
  budgets: Record<string, BudgetState>;

  /** Update the spent amount for a budget */
  updateSpent: (budgetId: string, spent: number) => void;

  /** Current validation errors (must fix before finalize) */
  errors: ValidationError[];

  /** Current validation warnings (advisory, can proceed) */
  warnings: ValidationError[];

  /** True if no validation errors exist */
  isValid: boolean;

  /** True if character can be finalized (isValid + all required selections made) */
  canFinalize: boolean;

  /** Get a specific budget state */
  getBudget: (budgetId: string) => BudgetState | undefined;

  /** Check if a budget has remaining capacity */
  hasRemaining: (budgetId: string) => boolean;

  /** Check if a budget is overspent */
  isOverspent: (budgetId: string) => boolean;

  /** Quality-derived budget modifiers (karma cap, knowledge cost multipliers, etc.) */
  qualityModifiers: QualityBudgetModifiers;

  /** Resolved grants from life module selections (empty if not using life modules) */
  resolvedLifeModuleGrants: ResolvedLifeModuleGrants;
}

/**
 * Props for the provider component
 */
export interface CreationBudgetProviderProps {
  children: React.ReactNode;
  /** Current creation state */
  creationState: CreationState;
  /** Priority table for budget calculations (SR5) */
  priorityTable: PriorityTableData | null;
  /** Callback when spent values change */
  onSpentChange?: (budgetId: string, spent: number) => void;
  /** Custom validation function */
  customValidation?: (
    budgets: Record<string, BudgetState>,
    state: CreationState
  ) => ValidationError[];
  /** Validation debounce delay in ms (default: 300) */
  validationDebounceMs?: number;
}

// =============================================================================
// CONTEXT
// =============================================================================

const CreationBudgetContext = createContext<CreationBudgetContextValue | null>(null);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export function CreationBudgetProvider({
  children,
  creationState,
  priorityTable,
  onSpentChange,
  customValidation,
  validationDebounceMs = 300,
}: CreationBudgetProviderProps) {
  // Track validation state with debounce
  const [validationState, setValidationState] = useState<{
    errors: ValidationError[];
    warnings: ValidationError[];
  }>({ errors: [], warnings: [] });

  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get skill data from ruleset for category lookups and group definitions
  const { activeSkills, skillGroups: skillGroupDefs } = useSkills();
  const skillCategories = useMemo(() => buildSkillCategoriesMap(activeSkills), [activeSkills]);

  // Get gameplay level modifiers for budget calculations
  const gameplayModifiers = useGameplayLevelModifiers(creationState.gameplayLevel);

  // Resolve life module grants from selections + catalog
  const lifeModulesCatalog = useLifeModules();
  const resolvedGrants = useMemo(() => {
    if (creationState.creationMethodId !== "life-modules" || !lifeModulesCatalog) {
      return EMPTY_GRANTS;
    }
    const lifeModules = (creationState.selections.lifeModules ||
      []) as readonly LifeModuleSelection[];
    return resolveLifeModuleGrants(lifeModules, lifeModulesCatalog);
  }, [creationState.creationMethodId, creationState.selections.lifeModules, lifeModulesCatalog]);

  // Compute quality-driven budget modifiers from selections
  const qualityModifiers = useMemo(
    () =>
      getQualityBudgetModifiers(
        creationState.selections as import("@/lib/types/creation-selections").CreationSelections
      ),
    [creationState.selections]
  );

  // Calculate budget totals from priorities
  const baseBudgetTotals = useMemo(
    () =>
      calculateBudgetTotals(
        creationState.priorities,
        creationState.selections,
        priorityTable,
        creationState.budgets,
        gameplayModifiers,
        creationState.creationMethodId
      ),
    [
      creationState.priorities,
      creationState.selections,
      priorityTable,
      creationState.budgets,
      gameplayModifiers,
      creationState.creationMethodId,
    ]
  );

  // Add quality-driven budget totals (Friends in High Places high-connection pool)
  const budgetTotals = useMemo(() => {
    const totals = { ...baseBudgetTotals };
    if (qualityModifiers.friendsInHighPlaces) {
      const attrs = creationState.selections.attributes as Record<string, number> | undefined;
      const charisma = attrs?.charisma || 1;
      totals["high-connection-contact-points"] = {
        total: charisma * FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER,
        label: "High-Connection Contact Points",
        displayFormat: "number",
      };
    }
    return totals;
  }, [baseBudgetTotals, qualityModifiers.friendsInHighPlaces, creationState.selections.attributes]);

  // Extract spent values from state and selections
  const spentValues = useMemo(
    () =>
      extractSpentValues(
        creationState.budgets,
        creationState.selections,
        budgetTotals,
        priorityTable,
        creationState.priorities,
        skillCategories,
        skillGroupDefs,
        qualityModifiers,
        creationState.creationMethodId
      ),
    [
      creationState.budgets,
      creationState.selections,
      budgetTotals,
      priorityTable,
      creationState.priorities,
      skillCategories,
      skillGroupDefs,
      qualityModifiers,
      creationState.creationMethodId,
    ]
  );

  // Get karma-to-nuyen conversion (2000¥ per karma)
  const karmaSpentGear = (creationState.budgets?.["karma-spent-gear"] as number) || 0;
  const KARMA_TO_NUYEN_RATE = 2000;
  // Life Modules and Point Buy budget totals already include karma-to-nuyen conversion
  const methodIncludesKarmaConversion =
    creationState.creationMethodId === "life-modules" ||
    creationState.creationMethodId === "point-buy";

  // Combine into full budget states
  const budgets = useMemo(() => {
    const result: Record<string, BudgetState> = {};

    for (const [budgetId, totalData] of Object.entries(budgetTotals)) {
      const spent = spentValues[budgetId] || 0;
      let total = totalData.total;

      // Add karma-to-nuyen conversion to nuyen total.
      // Life Modules and Point Buy already include this in their budget totals,
      // so only add it for Priority and Sum-to-Ten methods.
      if (budgetId === "nuyen" && !methodIncludesKarmaConversion) {
        total += karmaSpentGear * KARMA_TO_NUYEN_RATE;
      }

      result[budgetId] = {
        total,
        spent,
        remaining: total - spent,
        label: totalData.label,
        displayFormat: totalData.displayFormat,
      };
    }

    return result;
  }, [budgetTotals, spentValues, karmaSpentGear, methodIncludesKarmaConversion]);

  // Debounced validation
  useEffect(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(() => {
      let { errors, warnings } = validateBudgets(
        budgets,
        creationState,
        priorityTable,
        skillCategories,
        qualityModifiers
      );

      // Add custom validation if provided
      if (customValidation) {
        const customErrors = customValidation(budgets, creationState);
        errors = [...errors, ...customErrors.filter((e) => e.severity === "error")];
        warnings = [...warnings, ...customErrors.filter((e) => e.severity === "warning")];
      }

      setValidationState({ errors, warnings });
    }, validationDebounceMs);

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [
    budgets,
    creationState,
    customValidation,
    validationDebounceMs,
    priorityTable,
    skillCategories,
    qualityModifiers,
  ]);

  // Update spent callback - this notifies parent to update CreationState
  const updateSpent = useCallback(
    (budgetId: string, spent: number) => {
      if (onSpentChange) {
        onSpentChange(budgetId, spent);
      }
    },
    [onSpentChange]
  );

  // Helper functions
  const getBudget = useCallback(
    (budgetId: string): BudgetState | undefined => budgets[budgetId],
    [budgets]
  );

  const hasRemaining = useCallback(
    (budgetId: string): boolean => {
      const budget = budgets[budgetId];
      return budget ? budget.remaining > 0 : false;
    },
    [budgets]
  );

  const isOverspent = useCallback(
    (budgetId: string): boolean => {
      const budget = budgets[budgetId];
      return budget ? budget.remaining < 0 : false;
    },
    [budgets]
  );

  // Derived state
  const isValid = validationState.errors.length === 0;

  // Can finalize if valid and has required selections per method type
  const canFinalize = useMemo(() => {
    if (!isValid) return false;

    // Check required selections
    const hasMetatype = !!creationState.selections.metatype;

    // Life Modules doesn't use priorities — check for module selections instead
    if (creationState.creationMethodId === "life-modules") {
      const lifeModules = creationState.selections.lifeModules;
      const hasModules = Array.isArray(lifeModules) && lifeModules.length > 0;
      return hasMetatype && hasModules;
    }

    // Point Buy doesn't use priorities — only requires metatype
    if (creationState.creationMethodId === "point-buy") {
      return hasMetatype;
    }

    // Sum-to-Ten uses priorities (5 categories, can duplicate)
    // Priority uses priorities (5 unique categories A-E)
    const hasPriorities = Object.keys(creationState.priorities || {}).length === 5;
    return hasMetatype && hasPriorities;
  }, [
    isValid,
    creationState.selections.metatype,
    creationState.priorities,
    creationState.creationMethodId,
    creationState.selections.lifeModules,
  ]);

  // Context value
  const value: CreationBudgetContextValue = useMemo(
    () => ({
      budgets,
      updateSpent,
      errors: validationState.errors,
      warnings: validationState.warnings,
      isValid,
      canFinalize,
      getBudget,
      hasRemaining,
      isOverspent,
      qualityModifiers,
      resolvedLifeModuleGrants: resolvedGrants,
    }),
    [
      budgets,
      updateSpent,
      validationState.errors,
      validationState.warnings,
      isValid,
      canFinalize,
      getBudget,
      hasRemaining,
      isOverspent,
      qualityModifiers,
      resolvedGrants,
    ]
  );

  return <CreationBudgetContext.Provider value={value}>{children}</CreationBudgetContext.Provider>;
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Access the full budget context
 */
export function useCreationBudgets(): CreationBudgetContextValue {
  const context = useContext(CreationBudgetContext);
  if (!context) {
    throw new Error("useCreationBudgets must be used within a CreationBudgetProvider");
  }
  return context;
}

/**
 * Access a specific budget by ID
 */
export function useBudget(budgetId: string): BudgetState | undefined {
  const { getBudget } = useCreationBudgets();
  return getBudget(budgetId);
}

/**
 * Access validation state only
 */
export function useCreationValidation(): {
  errors: ValidationError[];
  warnings: ValidationError[];
  isValid: boolean;
  canFinalize: boolean;
} {
  const { errors, warnings, isValid, canFinalize } = useCreationBudgets();
  return { errors, warnings, isValid, canFinalize };
}

/**
 * Check if creation is valid and can be finalized
 */
export function useCanFinalize(): boolean {
  const { canFinalize } = useCreationBudgets();
  return canFinalize;
}
