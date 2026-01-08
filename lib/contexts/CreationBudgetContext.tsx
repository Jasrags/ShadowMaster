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
import type {
  CreationState,
  ValidationError,
} from "../types/creation";
import type { PriorityTableData } from "../rules/RulesetContext";

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
  displayFormat?: "number" | "currency" | "percentage";
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

const CreationBudgetContext = createContext<CreationBudgetContextValue | null>(
  null
);

// =============================================================================
// BUDGET CALCULATION HELPERS
// =============================================================================

/**
 * Calculate total budget values from priority selections
 */
function calculateBudgetTotals(
  priorities: Record<string, string> | undefined,
  selections: Record<string, unknown>,
  priorityTable: PriorityTableData | null
): Record<string, { total: number; label: string; displayFormat?: "number" | "currency" }> {
  const totals: Record<string, { total: number; label: string; displayFormat?: "number" | "currency" }> = {
    karma: { total: 25, label: "Karma", displayFormat: "number" },
  };

  if (!priorityTable || !priorities) {
    return totals;
  }

  // Attribute points from priority
  const attrPriority = priorities.attributes;
  if (attrPriority && priorityTable.table[attrPriority]) {
    const attrPoints = priorityTable.table[attrPriority].attributes as number;
    totals["attribute-points"] = {
      total: attrPoints || 0,
      label: "Attribute Points",
      displayFormat: "number",
    };
  }

  // Skill points from priority
  const skillPriority = priorities.skills;
  if (skillPriority && priorityTable.table[skillPriority]) {
    const skillData = priorityTable.table[skillPriority].skills as {
      skillPoints: number;
      skillGroupPoints: number;
    };
    totals["skill-points"] = {
      total: skillData?.skillPoints || 0,
      label: "Skill Points",
      displayFormat: "number",
    };
    totals["skill-group-points"] = {
      total: skillData?.skillGroupPoints || 0,
      label: "Skill Group Points",
      displayFormat: "number",
    };
  }

  // Resources (nuyen) from priority
  const resourcePriority = priorities.resources;
  if (resourcePriority && priorityTable.table[resourcePriority]) {
    const nuyen = priorityTable.table[resourcePriority].resources as number;
    totals["nuyen"] = {
      total: nuyen || 0,
      label: "Nuyen",
      displayFormat: "currency",
    };
  }

  // Special attribute points from metatype priority + selected metatype
  const metatypePriority = priorities.metatype;
  const selectedMetatype = selections.metatype as string;
  if (metatypePriority && selectedMetatype && priorityTable.table[metatypePriority]) {
    const metatypeData = priorityTable.table[metatypePriority].metatype as {
      specialAttributePoints: Record<string, number>;
    };
    const specialPoints = metatypeData?.specialAttributePoints?.[selectedMetatype] || 0;
    totals["special-attribute-points"] = {
      total: specialPoints,
      label: "Special Attribute Points",
      displayFormat: "number",
    };
  }

  // Contact points = CHA × 3 (calculated from attributes)
  const attributes = selections.attributes as Record<string, number> | undefined;
  const charisma = attributes?.charisma || 1;
  totals["contact-points"] = {
    total: charisma * 3,
    label: "Contact Points",
    displayFormat: "number",
  };

  // Knowledge points = (INT + LOG) × 2 (calculated from attributes)
  const intuition = attributes?.intuition || 1;
  const logic = attributes?.logic || 1;
  totals["knowledge-points"] = {
    total: (intuition + logic) * 2,
    label: "Knowledge Points",
    displayFormat: "number",
  };

  // Spell slots from magic priority (if magician/mystic adept)
  const magicPriority = priorities.magic;
  const magicPath = selections["magical-path"] as string;
  if (magicPriority && priorityTable.table[magicPriority] && magicPath) {
    const magicData = priorityTable.table[magicPriority].magic as {
      spells?: number;
      powers?: number;
    };
    if (["magician", "mystic-adept", "aspected-mage"].includes(magicPath)) {
      totals["spell-slots"] = {
        total: magicData?.spells || 0,
        label: "Free Spells",
        displayFormat: "number",
      };
    }
    if (["adept", "mystic-adept"].includes(magicPath)) {
      // Power points = Magic rating (from special attributes)
      const magicRating = (selections["special-attributes"] as Record<string, number>)?.magic || 0;
      totals["power-points"] = {
        total: magicRating,
        label: "Power Points",
        displayFormat: "number",
      };
    }
  }

  return totals;
}

/**
 * Extract spent values from creation state budgets
 */
function extractSpentValues(
  stateBudgets: Record<string, number>
): Record<string, number> {
  const spent: Record<string, number> = {};

  // Map state budget keys to our budget IDs
  const spentMappings: Record<string, string> = {
    "attribute-points-spent": "attribute-points",
    "special-attribute-points-spent": "special-attribute-points",
    "skill-points-spent": "skill-points",
    "skill-group-points-spent": "skill-group-points",
    "knowledge-points-spent": "knowledge-points",
    "nuyen-spent": "nuyen",
    "contact-points-spent": "contact-points",
    "spell-slots-spent": "spell-slots",
    "power-points-spent": "power-points",
  };

  for (const [stateKey, budgetId] of Object.entries(spentMappings)) {
    if (stateKey in stateBudgets) {
      spent[budgetId] = stateBudgets[stateKey] as number;
    }
  }

  // Karma is special - calculate from multiple sources
  const karmaGainedNegative = (stateBudgets["karma-gained-negative"] as number) || 0;
  const karmaSpentPositive = (stateBudgets["karma-spent-positive"] as number) || 0;
  const karmaSpentGear = (stateBudgets["karma-spent-gear"] as number) || 0;
  const karmaSpentSpells = (stateBudgets["karma-spent-spells"] as number) || 0;
  const karmaSpentPowers = (stateBudgets["karma-spent-power-points"] as number) || 0;
  const karmaSpentAttributes = (stateBudgets["karma-spent-attributes"] as number) || 0;
  const karmaSpentSkills = (stateBudgets["karma-spent-skills"] as number) || 0;
  const karmaSpentContacts = (stateBudgets["karma-spent-contacts"] as number) || 0;

  // Net karma spent = positive qualities + other spends - negative qualities gained
  spent["karma"] =
    karmaSpentPositive +
    karmaSpentGear +
    karmaSpentSpells +
    karmaSpentPowers +
    karmaSpentAttributes +
    karmaSpentSkills +
    karmaSpentContacts -
    karmaGainedNegative;

  return spent;
}

/**
 * Run validation on budgets
 */
function validateBudgets(
  budgets: Record<string, BudgetState>,
  state: CreationState
): { errors: ValidationError[]; warnings: ValidationError[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check for overspent budgets
  for (const [budgetId, budget] of Object.entries(budgets)) {
    if (budget.remaining < 0) {
      errors.push({
        constraintId: `${budgetId}-overspent`,
        message: `${budget.label} is overspent by ${Math.abs(budget.remaining)}`,
        severity: "error",
      });
    }
  }

  // Nuyen carryover limit (max 5,000)
  const nuyenBudget = budgets["nuyen"];
  if (nuyenBudget && nuyenBudget.remaining > 5000) {
    warnings.push({
      constraintId: "nuyen-carryover",
      message: `You can only carry over 5,000¥ to gameplay. ${nuyenBudget.remaining - 5000}¥ will be lost.`,
      severity: "warning",
    });
  }

  // Karma carryover limit (max 7)
  const karmaBudget = budgets["karma"];
  if (karmaBudget && karmaBudget.remaining > 7) {
    warnings.push({
      constraintId: "karma-carryover",
      message: `You can only carry over 7 karma to gameplay. ${karmaBudget.remaining - 7} karma will be lost.`,
      severity: "warning",
    });
  }

  // Check positive quality limit (max 25 karma)
  const positiveKarmaSpent = (state.budgets["karma-spent-positive"] as number) || 0;
  if (positiveKarmaSpent > 25) {
    errors.push({
      constraintId: "positive-quality-limit",
      message: `Positive qualities cannot exceed 25 karma (currently ${positiveKarmaSpent})`,
      severity: "error",
    });
  }

  // Check negative quality limit (max 25 karma gained)
  const negativeKarmaGained = (state.budgets["karma-gained-negative"] as number) || 0;
  if (negativeKarmaGained > 25) {
    errors.push({
      constraintId: "negative-quality-limit",
      message: `Negative qualities cannot exceed 25 karma (currently ${negativeKarmaGained})`,
      severity: "error",
    });
  }

  return { errors, warnings };
}

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

  // Calculate budget totals from priorities
  const budgetTotals = useMemo(
    () =>
      calculateBudgetTotals(
        creationState.priorities,
        creationState.selections,
        priorityTable
      ),
    [creationState.priorities, creationState.selections, priorityTable]
  );

  // Extract spent values from state
  const spentValues = useMemo(
    () => extractSpentValues(creationState.budgets),
    [creationState.budgets]
  );

  // Combine into full budget states
  const budgets = useMemo(() => {
    const result: Record<string, BudgetState> = {};

    for (const [budgetId, totalData] of Object.entries(budgetTotals)) {
      const spent = spentValues[budgetId] || 0;
      result[budgetId] = {
        total: totalData.total,
        spent,
        remaining: totalData.total - spent,
        label: totalData.label,
        displayFormat: totalData.displayFormat,
      };
    }

    return result;
  }, [budgetTotals, spentValues]);

  // Debounced validation
  useEffect(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(() => {
      let { errors, warnings } = validateBudgets(budgets, creationState);

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
  }, [budgets, creationState, customValidation, validationDebounceMs]);

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

  // Can finalize if valid and has required selections
  const canFinalize = useMemo(() => {
    if (!isValid) return false;

    // Check required selections
    const hasMetatype = !!creationState.selections.metatype;
    const hasPriorities = Object.keys(creationState.priorities || {}).length === 5;

    return hasMetatype && hasPriorities;
  }, [isValid, creationState.selections.metatype, creationState.priorities]);

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
    ]
  );

  return (
    <CreationBudgetContext.Provider value={value}>
      {children}
    </CreationBudgetContext.Provider>
  );
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
    throw new Error(
      "useCreationBudgets must be used within a CreationBudgetProvider"
    );
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
