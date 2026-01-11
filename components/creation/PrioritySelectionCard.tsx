"use client";

/**
 * PrioritySelectionCard
 *
 * Drag-and-drop priority assignment for sheet-driven creation.
 * Shows all 5 categories in a reorderable list with priority letters A-E.
 *
 * Features:
 * - Drag-and-drop reordering (priority swaps automatically)
 * - Shows derived budgets for each priority level
 * - Status indicator for each category
 * - Default order: A-Metatype, B-Attributes, C-Magic, D-Skills, E-Resources
 *
 * UI Mock Reference: docs/prompts/design/character-sheet-creation-mode.md
 */

import { useMemo, useCallback, useEffect, useState } from "react";
import { usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { CreationCard } from "./shared";
import { GripVertical, Check, Circle, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const PRIORITY_LEVELS = ["A", "B", "C", "D", "E"] as const;
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
    complete: <Check className="h-4 w-4 text-emerald-500" />,
    pending: <Circle className="h-4 w-4 text-zinc-400" />,
    conflict: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  };

  const statusText = {
    complete: "Complete",
    pending: "Selection needed",
    conflict: "Conflict",
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
      className={`group relative rounded-lg border-2 bg-white p-3 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-zinc-900 ${borderColor[status]}`}
    >
      {/* Priority Letter Badge */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 rounded bg-zinc-800 px-2 py-1 text-xs font-bold text-white dark:bg-zinc-200 dark:text-zinc-900">
        {priorityLevel}
      </div>

      <div className="flex items-center gap-3 pl-4">
        {/* Drag Handle */}
        <div
          className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing dark:text-zinc-500 dark:hover:text-zinc-300"
          aria-hidden="true"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {config.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 truncate">{description}</p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 text-xs">
          {statusIcon[status]}
          <span
            className={`hidden sm:inline ${
              status === "complete"
                ? "text-emerald-600 dark:text-emerald-400"
                : status === "conflict"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {statusText[status]}
          </span>
        </div>

        {/* Move Buttons (visible on hover/focus) */}
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
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
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
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PrioritySelectionCard({ state, updateState }: PrioritySelectionCardProps) {
  const priorityTable = usePriorityTable();
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);

  // Initialize priorities from state or use defaults
  const priorities = useMemo(() => {
    return state.priorities || {};
  }, [state.priorities]);

  // Set default priorities if none exist
  useEffect(() => {
    if (Object.keys(priorities).length === 0) {
      const defaultPriorities: Record<string, string> = {};
      DEFAULT_PRIORITY_ORDER.forEach((category, index) => {
        defaultPriorities[category] = PRIORITY_LEVELS[index];
      });
      updateState({ priorities: defaultPriorities });
    }
  }, [priorities, updateState]);

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

  // Check for conflicts (e.g., metatype not available at priority)
  const hasConflict = useCallback((_category: string): boolean => {
    // TODO: Implement conflict detection for metatype/magic priority requirements
    return false;
  }, []);

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
                ? `${sapValues[0]} special attribute points`
                : `${Math.min(...sapValues)}-${Math.max(...sapValues)} special attribute points`
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
          return `${skillData?.skillPoints || 0} skill points • ${skillData?.skillGroupPoints || 0} skill group points`;
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

  // Determine validation status
  const validationStatus = useMemo(() => {
    // Check for conflicts
    const hasAnyConflict = orderedCategories.some(hasConflict);
    if (hasAnyConflict) return "error";

    // Check if all selections are complete
    const allComplete = orderedCategories.every(isCategoryComplete);
    if (allComplete) return "valid";

    return "warning";
  }, [orderedCategories, hasConflict, isCategoryComplete]);

  // Count incomplete selections
  const incompleteCount = useMemo(() => {
    return orderedCategories.filter((c) => !isCategoryComplete(c)).length;
  }, [orderedCategories, isCategoryComplete]);

  return (
    <CreationCard
      title="Priorities"
      description={
        isComplete
          ? incompleteCount === 0
            ? "All priorities set"
            : `${incompleteCount} selection${incompleteCount !== 1 ? "s" : ""} needed`
          : "Drag to reorder"
      }
      status={validationStatus}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Drag or use arrow keys to reorder</span>
          <span className="flex items-center gap-1" aria-hidden="true">
            <GripVertical className="h-3 w-3" />
          </span>
        </div>

        {/* Priority Rows */}
        <div className="space-y-2" role="list" aria-label="Priority categories">
          {orderedCategories.map((category, index) => (
            <CategoryRow
              key={category}
              category={category}
              priorityLevel={getCategoryLevel(category)}
              isComplete={isCategoryComplete(category)}
              hasConflict={hasConflict(category)}
              description={getDescription(category)}
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

        {/* Help text */}
        {incompleteCount > 0 && (
          <p className="pt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Select metatype and magic path in their respective sections below.
          </p>
        )}
      </div>
    </CreationCard>
  );
}
