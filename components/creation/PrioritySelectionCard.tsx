"use client";

/**
 * PrioritySelectionCard
 *
 * Drag-and-drop priority assignment for sheet-driven creation.
 * Shows all 5 categories in a reorderable list with priority letters A-E.
 *
 * Features:
 * - Drag-and-drop reordering (priority swaps automatically) [Standard Priority]
 * - Per-category dropdown selectors with duplicate levels [Sum to Ten]
 * - Shows derived budgets for each priority level
 * - Status indicator for each category
 * - Default order: A-Metatype, B-Attributes, C-Magic, D-Skills, E-Resources
 *
 * UI Mock Reference: docs/prompts/design/character-sheet-creation-mode.md
 */

import { useMemo, useCallback, useEffect, useState } from "react";
import { usePriorityTable } from "@/lib/rules";
import { useCreationMethod } from "@/lib/rules/RulesetContext";
import { useCreationBudgets } from "@/lib/contexts";
import type { CreationState, PriorityStepPayload } from "@/lib/types";
import { CreationCard, BudgetIndicator } from "./shared";
import { GripVertical, Check, Circle, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const PRIORITY_LEVELS = ["A", "B", "C", "D", "E"] as const;

// Map character magical path values to priority table path names
// Duplicated from character-validator.ts to avoid importing server-only module
const CHARACTER_TO_PRIORITY_PATH: Record<string, string> = {
  "full-mage": "magician",
};
type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

// Categories in their default order (A-E)
const DEFAULT_PRIORITY_ORDER = ["metatype", "attributes", "magic", "skills", "resources"] as const;

const CATEGORY_CONFIG: Record<
  string,
  { label: string; displayName: string; needsSelection: boolean }
> = {
  metatype: {
    label: "METATYPE",
    displayName: "Metatype",
    needsSelection: true,
  },
  attributes: {
    label: "ATTRIBUTES",
    displayName: "Attributes",
    needsSelection: false,
  },
  magic: {
    label: "MAGIC / RESONANCE",
    displayName: "Magic/Resonance",
    needsSelection: true,
  },
  skills: {
    label: "SKILLS",
    displayName: "Skills",
    needsSelection: false,
  },
  resources: {
    label: "RESOURCES",
    displayName: "Resources",
    needsSelection: false,
  },
};

// =============================================================================
// TYPES
// =============================================================================

interface PrioritySelectionCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

interface CategoryRowProps {
  category: string;
  priorityLevel: PriorityLevel;
  isComplete: boolean;
  hasConflict: boolean;
  description: string;
  conflictMessage?: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDragStart: (e: React.DragEvent, category: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, category: string) => void;
}

// =============================================================================
// CATEGORY ROW COMPONENT
// =============================================================================

function CategoryRow({
  category,
  priorityLevel,
  isComplete,
  hasConflict,
  description,
  conflictMessage,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
}: CategoryRowProps) {
  const config = CATEGORY_CONFIG[category];

  // Determine status
  const status = hasConflict ? "conflict" : isComplete ? "complete" : "pending";

  const statusIcon = {
    complete: <Check className="h-3.5 w-3.5 text-emerald-500" />,
    pending: <Circle className="h-3.5 w-3.5 text-zinc-400" />,
    conflict: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
  };

  const borderColor = {
    complete: "border-emerald-200 dark:border-emerald-800",
    pending: "border-zinc-200 dark:border-zinc-700",
    conflict: "border-amber-200 dark:border-amber-800",
  };

  return (
    <div
      draggable
      tabIndex={0}
      role="listitem"
      aria-label={`${config.label} at priority ${priorityLevel}. ${description}`}
      onDragStart={(e) => onDragStart(e, category)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, category)}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" && canMoveUp) {
          e.preventDefault();
          onMoveUp();
        } else if (e.key === "ArrowDown" && canMoveDown) {
          e.preventDefault();
          onMoveDown();
        }
      }}
      className={`group rounded-lg border bg-white px-2 py-1.5 transition-all hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:bg-zinc-900 ${borderColor[status]}`}
    >
      {/* Row 1: Handle, Badge, Label, Status, Move */}
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div
          className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing dark:text-zinc-500 dark:hover:text-zinc-300"
          aria-hidden="true"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Priority Letter Badge */}
        <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-white dark:bg-zinc-200 dark:text-zinc-900">
          {priorityLevel}
        </span>

        {/* Category Label */}
        <span className="flex-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {config.label}
        </span>

        {/* Status Icon */}
        <div
          className="flex items-center"
          title={
            status === "complete"
              ? "Complete"
              : status === "conflict"
                ? "Conflict"
                : "Selection needed"
          }
        >
          {statusIcon[status]}
        </div>

        {/* Move Buttons */}
        <div className="flex flex-col opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            tabIndex={-1}
            className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label={`Move ${config.label} priority up`}
            title="Move up"
          >
            <ChevronUp className="h-3 w-3" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            tabIndex={-1}
            className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label={`Move ${config.label} priority down`}
            title="Move down"
          >
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Row 2: Description (indented to align with label) */}
      <p className="ml-11 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>

      {/* Row 3: Conflict message (if any) */}
      {conflictMessage && (
        <p className="ml-11 text-xs font-medium text-amber-600 dark:text-amber-400">
          {conflictMessage}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// SUM TO TEN CATEGORY ROW
// =============================================================================

interface SumToTenCategoryRowProps {
  category: string;
  priorityLevel: PriorityLevel;
  isComplete: boolean;
  hasConflict: boolean;
  description: string;
  conflictMessage?: string;
  pointValues: Record<string, number>;
  onLevelChange: (level: PriorityLevel) => void;
}

function SumToTenCategoryRow({
  category,
  priorityLevel,
  isComplete,
  hasConflict,
  description,
  conflictMessage,
  pointValues,
  onLevelChange,
}: SumToTenCategoryRowProps) {
  const config = CATEGORY_CONFIG[category];
  const status = hasConflict ? "conflict" : isComplete ? "complete" : "pending";

  const statusIcon = {
    complete: <Check className="h-3.5 w-3.5 text-emerald-500" />,
    pending: <Circle className="h-3.5 w-3.5 text-zinc-400" />,
    conflict: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
  };

  const borderColor = {
    complete: "border-emerald-200 dark:border-emerald-800",
    pending: "border-zinc-200 dark:border-zinc-700",
    conflict: "border-amber-200 dark:border-amber-800",
  };

  return (
    <div
      className={`rounded-lg border bg-white px-2 py-1.5 dark:bg-zinc-900 ${borderColor[status]}`}
    >
      <div className="flex items-center gap-2">
        {/* Priority Level Dropdown */}
        <select
          value={priorityLevel}
          onChange={(e) => onLevelChange(e.target.value as PriorityLevel)}
          className="h-5 w-12 rounded bg-zinc-800 text-center text-[10px] font-bold text-white appearance-none cursor-pointer dark:bg-zinc-200 dark:text-zinc-900"
          aria-label={`Priority level for ${config.label}`}
        >
          {PRIORITY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level} ({pointValues[level] ?? 0}pt)
            </option>
          ))}
        </select>

        {/* Category Label */}
        <span className="flex-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {config.label}
        </span>

        {/* Points for this level */}
        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
          {pointValues[priorityLevel] ?? 0}pt
        </span>

        {/* Status Icon */}
        <div
          className="flex items-center"
          title={
            status === "complete"
              ? "Complete"
              : status === "conflict"
                ? "Conflict"
                : "Selection needed"
          }
        >
          {statusIcon[status]}
        </div>
      </div>

      {/* Description */}
      <p className="ml-14 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>

      {/* Conflict message */}
      {conflictMessage && (
        <p className="ml-14 text-xs font-medium text-amber-600 dark:text-amber-400">
          {conflictMessage}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PrioritySelectionCard({ state, updateState }: PrioritySelectionCardProps) {
  const priorityTable = usePriorityTable();
  const currentCreationMethod = useCreationMethod();
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);

  // Detect Sum to Ten mode from creation method
  const isSumToTen = currentCreationMethod?.type === "sum-to-ten";
  const priorityStepPayload = useMemo((): PriorityStepPayload | null => {
    if (!isSumToTen || !currentCreationMethod) return null;
    const priorityStep = currentCreationMethod.steps.find((s) => s.payload.type === "priority");
    return (priorityStep?.payload as PriorityStepPayload) ?? null;
  }, [isSumToTen, currentCreationMethod]);
  const pointValues = priorityStepPayload?.pointValues ?? { A: 4, B: 3, C: 2, D: 1, E: 0 };
  const totalBudget = priorityStepPayload?.totalBudget ?? 10;

  // Initialize priorities from state or use defaults
  const priorities = useMemo(() => {
    return state.priorities || {};
  }, [state.priorities]);

  // Set default priorities if none exist
  useEffect(() => {
    if (Object.keys(priorities).length === 0) {
      const defaultPriorities: Record<string, string> = {};
      if (isSumToTen) {
        // Sum to Ten: default all to C (2pt each = 10 total)
        DEFAULT_PRIORITY_ORDER.forEach((category) => {
          defaultPriorities[category] = "C";
        });
      } else {
        // Standard Priority: A-E in default order
        DEFAULT_PRIORITY_ORDER.forEach((category, index) => {
          defaultPriorities[category] = PRIORITY_LEVELS[index];
        });
      }
      updateState({ priorities: defaultPriorities });
    }
  }, [priorities, updateState, isSumToTen]);

  // Sum to Ten: calculate current point total
  const currentPointTotal = useMemo(() => {
    if (!isSumToTen) return 0;
    return DEFAULT_PRIORITY_ORDER.reduce((sum, cat) => {
      const level = priorities[cat] ?? "E";
      return sum + (pointValues[level] ?? 0);
    }, 0);
  }, [isSumToTen, priorities, pointValues]);

  // Get ordered list of categories based on their priority levels
  const orderedCategories = useMemo((): string[] => {
    if (Object.keys(priorities).length === 0) {
      return [...DEFAULT_PRIORITY_ORDER];
    }

    // Sort categories by their priority level (A, B, C, D, E)
    return [...DEFAULT_PRIORITY_ORDER].sort((a, b) => {
      const levelA = priorities[a] || "E";
      const levelB = priorities[b] || "E";
      return (
        PRIORITY_LEVELS.indexOf(levelA as PriorityLevel) -
        PRIORITY_LEVELS.indexOf(levelB as PriorityLevel)
      );
    });
  }, [priorities]);

  // Check if all priorities are set
  const isComplete = Object.keys(priorities).length === 5;

  // Get priority level for a category
  const getCategoryLevel = useCallback(
    (category: string): PriorityLevel => {
      return (priorities[category] as PriorityLevel) || "E";
    },
    [priorities]
  );

  // Check if a category needs selection (metatype, magic path)
  const isCategoryComplete = useCallback(
    (category: string): boolean => {
      const config = CATEGORY_CONFIG[category];
      if (!config.needsSelection) return true;

      if (category === "metatype") {
        return !!state.selections.metatype;
      }
      if (category === "magic") {
        // Magic is "complete" if either a path is selected OR priority is E (mundane)
        const level = getCategoryLevel("magic");
        if (level === "E") return true; // Mundane at E
        return !!state.selections["magical-path"];
      }
      return true;
    },
    [state.selections, getCategoryLevel]
  );

  // Budget context for detecting overspent allocations
  const { budgets } = useCreationBudgets();

  // Check for conflicts (e.g., metatype not available at priority, budget overspent)
  const hasConflict = useCallback(
    (category: string): boolean => {
      switch (category) {
        case "metatype": {
          const selected = state.selections.metatype as string | undefined;
          if (!selected) return false;
          const level = getCategoryLevel("metatype");
          const data = priorityTable?.table[level]?.metatype as { available: string[] } | undefined;
          return data ? !data.available.includes(selected) : false;
        }
        case "magic": {
          const raw = state.selections["magical-path"] as string | undefined;
          if (!raw || raw === "mundane") return false;
          const level = getCategoryLevel("magic");
          const data = priorityTable?.table[level]?.magic as
            | { options: Array<{ path: string }> }
            | undefined;
          if (!data?.options?.length) return true; // E priority = no options
          const priorityPath = CHARACTER_TO_PRIORITY_PATH[raw] ?? raw;
          return !data.options.some((o) => o.path === priorityPath);
        }
        case "attributes":
          return (budgets["attribute-points"]?.remaining ?? 0) < 0;
        case "skills":
          return (
            (budgets["skill-points"]?.remaining ?? 0) < 0 ||
            (budgets["skill-group-points"]?.remaining ?? 0) < 0
          );
        case "resources":
          return (budgets["nuyen"]?.remaining ?? 0) < 0;
        default:
          return false;
      }
    },
    [state.selections, getCategoryLevel, priorityTable, budgets]
  );

  // Get specific conflict message for a category
  const getConflictMessage = useCallback(
    (category: string): string | undefined => {
      if (!hasConflict(category)) return undefined;

      switch (category) {
        case "metatype": {
          const selected = state.selections.metatype as string;
          const level = getCategoryLevel("metatype");
          const data = priorityTable?.table[level]?.metatype as { available: string[] } | undefined;
          const available = data?.available?.join(", ") ?? "";
          return `${selected} is not available at Priority ${level} (${available})`;
        }
        case "magic": {
          const raw = state.selections["magical-path"] as string;
          const level = getCategoryLevel("magic");
          return `${raw} is not available at Priority ${level}`;
        }
        case "attributes": {
          const budget = budgets["attribute-points"];
          if (!budget) return undefined;
          return `Overspent by ${Math.abs(budget.remaining)} attribute points`;
        }
        case "skills": {
          const sp = budgets["skill-points"];
          const sgp = budgets["skill-group-points"];
          const parts: string[] = [];
          if (sp && sp.remaining < 0) parts.push(`${Math.abs(sp.remaining)} skill pts over`);
          if (sgp && sgp.remaining < 0) parts.push(`${Math.abs(sgp.remaining)} group pts over`);
          return parts.join(", ");
        }
        case "resources": {
          const budget = budgets["nuyen"];
          if (!budget) return undefined;
          return `Overspent by ${Math.abs(budget.remaining).toLocaleString()}¥`;
        }
        default:
          return undefined;
      }
    },
    [hasConflict, state.selections, getCategoryLevel, priorityTable, budgets]
  );

  // Get description for a category at its current priority
  const getDescription = useCallback(
    (category: string): string => {
      const level = getCategoryLevel(category);
      if (!priorityTable?.table[level]) return "";
      const data = priorityTable.table[level];

      switch (category) {
        case "metatype": {
          const metatypeData = data.metatype as {
            available: string[];
            specialAttributePoints: Record<string, number>;
          };
          if (!metatypeData?.available) return "";
          const count = metatypeData.available.length;
          const metatypes =
            count <= 3 ? metatypeData.available.join(", ") : `${count} metatypes available`;

          // Get special attribute points for the selected metatype or show range
          const sapValues = Object.values(metatypeData.specialAttributePoints || {});
          const sapRange =
            sapValues.length > 0
              ? sapValues.every((v) => v === sapValues[0])
                ? `${sapValues[0]} special attribute pts`
                : `${Math.min(...sapValues)}-${Math.max(...sapValues)} special attribute pts`
              : "";

          return `${metatypes}${sapRange ? ` • ${sapRange}` : ""}`;
        }
        case "attributes":
          return `${data.attributes} points to distribute`;
        case "magic": {
          const magicData = data.magic as {
            options: Array<{ path: string; magicRating?: number; resonance?: number }>;
          };
          if (!magicData?.options?.length) return "Mundane only";
          const paths = magicData.options.map((o) => o.path);
          const rating = magicData.options[0]?.magicRating || magicData.options[0]?.resonance;
          const pathsStr = paths.length <= 2 ? paths.join(", ") : `${paths.length} paths`;
          return rating ? `${pathsStr} • Magic/Resonance ${rating}` : pathsStr;
        }
        case "skills": {
          const skillData = data.skills as {
            skillPoints: number;
            skillGroupPoints: number;
          };
          return `${skillData?.skillPoints || 0} skill pts • ${skillData?.skillGroupPoints || 0} group pts`;
        }
        case "resources":
          return `${((data.resources as number) || 0).toLocaleString()}¥ starting nuyen`;
        default:
          return "";
      }
    },
    [priorityTable, getCategoryLevel]
  );

  // Swap two categories' priority levels
  const swapPriorities = useCallback(
    (category1: string, category2: string) => {
      const level1 = priorities[category1];
      const level2 = priorities[category2];
      updateState({
        priorities: {
          ...priorities,
          [category1]: level2,
          [category2]: level1,
        },
      });
    },
    [priorities, updateState]
  );

  // Move a category up in the list
  const moveUp = useCallback(
    (category: string) => {
      const currentIndex = orderedCategories.indexOf(category);
      if (currentIndex <= 0) return;
      const targetCategory = orderedCategories[currentIndex - 1];
      swapPriorities(category, targetCategory);
    },
    [orderedCategories, swapPriorities]
  );

  // Move a category down in the list
  const moveDown = useCallback(
    (category: string) => {
      const currentIndex = orderedCategories.indexOf(category);
      if (currentIndex >= orderedCategories.length - 1) return;
      const targetCategory = orderedCategories[currentIndex + 1];
      swapPriorities(category, targetCategory);
    },
    [orderedCategories, swapPriorities]
  );

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, category: string) => {
    setDraggedCategory(category);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetCategory: string) => {
      e.preventDefault();
      if (draggedCategory && draggedCategory !== targetCategory) {
        swapPriorities(draggedCategory, targetCategory);
      }
      setDraggedCategory(null);
    },
    [draggedCategory, swapPriorities]
  );

  // Sum to Ten: change a single category's level
  const handleLevelChange = useCallback(
    (category: string, level: PriorityLevel) => {
      updateState({
        priorities: {
          ...priorities,
          [category]: level,
        },
      });
    },
    [priorities, updateState]
  );

  // Determine validation status
  const validationStatus = useMemo(() => {
    // Check for conflicts
    const hasAnyConflict = orderedCategories.some(hasConflict);
    if (hasAnyConflict) return "error";

    // Sum to Ten: check point budget
    if (isSumToTen && currentPointTotal !== totalBudget) return "error";

    // Check if all selections are complete
    const allComplete = orderedCategories.every(isCategoryComplete);
    if (allComplete) return "valid";

    return "warning";
  }, [
    orderedCategories,
    hasConflict,
    isCategoryComplete,
    isSumToTen,
    currentPointTotal,
    totalBudget,
  ]);

  // Count incomplete selections
  const incompleteCount = useMemo(() => {
    return orderedCategories.filter((c) => !isCategoryComplete(c)).length;
  }, [orderedCategories, isCategoryComplete]);

  const cardTitle = isSumToTen ? "Sum to Ten" : "Priorities";
  const cardDescription = isSumToTen
    ? currentPointTotal === totalBudget
      ? incompleteCount === 0
        ? "All priorities set"
        : `${incompleteCount} selection${incompleteCount !== 1 ? "s" : ""} needed`
      : `Assign levels totaling ${totalBudget} points`
    : isComplete
      ? incompleteCount === 0
        ? "All priorities set"
        : `${incompleteCount} selection${incompleteCount !== 1 ? "s" : ""} needed`
      : "Drag to reorder";

  return (
    <CreationCard title={cardTitle} description={cardDescription} status={validationStatus}>
      <div className="space-y-1.5">
        {/* Sum to Ten: Point budget indicator */}
        {isSumToTen && (
          <BudgetIndicator
            label="Priority Points"
            spent={currentPointTotal}
            total={totalBudget}
            showProgressBar
            tooltip={`Assign priority levels so point values sum to exactly ${totalBudget}`}
          />
        )}

        {/* Priority Rows */}
        <div className="space-y-1" role="list" aria-label="Priority categories">
          {isSumToTen
            ? DEFAULT_PRIORITY_ORDER.map((category) => (
                <SumToTenCategoryRow
                  key={category}
                  category={category}
                  priorityLevel={getCategoryLevel(category)}
                  isComplete={isCategoryComplete(category)}
                  hasConflict={hasConflict(category)}
                  description={getDescription(category)}
                  conflictMessage={getConflictMessage(category)}
                  pointValues={pointValues}
                  onLevelChange={(level) => handleLevelChange(category, level)}
                />
              ))
            : orderedCategories.map((category, index) => (
                <CategoryRow
                  key={category}
                  category={category}
                  priorityLevel={getCategoryLevel(category)}
                  isComplete={isCategoryComplete(category)}
                  hasConflict={hasConflict(category)}
                  description={getDescription(category)}
                  conflictMessage={getConflictMessage(category)}
                  onMoveUp={() => moveUp(category)}
                  onMoveDown={() => moveDown(category)}
                  canMoveUp={index > 0}
                  canMoveDown={index < orderedCategories.length - 1}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))}
        </div>

        {/* Sum to Ten: budget warning */}
        {isSumToTen && currentPointTotal !== totalBudget && (
          <div
            className={`rounded-md px-3 py-2 text-xs ${
              currentPointTotal > totalBudget
                ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            }`}
          >
            {currentPointTotal > totalBudget
              ? `Over budget by ${currentPointTotal - totalBudget} point${currentPointTotal - totalBudget !== 1 ? "s" : ""}. Lower some priority levels.`
              : `${totalBudget - currentPointTotal} point${totalBudget - currentPointTotal !== 1 ? "s" : ""} remaining. Raise some priority levels.`}
          </div>
        )}

        {/* Help text */}
        {incompleteCount > 0 && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Select metatype and magic path below.
          </p>
        )}
      </div>
    </CreationCard>
  );
}
