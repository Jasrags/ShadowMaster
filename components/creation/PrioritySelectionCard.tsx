"use client";

/**
 * PrioritySelectionCard
 *
 * Compact card for priority assignment in sheet-driven creation.
 * Shows all 5 categories with priority level selectors.
 * Swaps priorities when assigning a level already in use.
 *
 * Features:
 * - Compact inline priority grid
 * - Shows derived budgets for each priority
 * - Validation state indicator
 * - Reuses logic from PriorityStep.tsx
 */

import { useMemo, useCallback } from "react";
import { usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { CreationCard } from "./shared";
import { Check, ChevronDown } from "lucide-react";

const PRIORITY_LEVELS = ["A", "B", "C", "D", "E"] as const;
type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

const PRIORITY_CATEGORIES = [
  { id: "metatype", label: "Metatype", shortLabel: "Meta" },
  { id: "attributes", label: "Attributes", shortLabel: "Attr" },
  { id: "magic", label: "Magic/Resonance", shortLabel: "Magic" },
  { id: "skills", label: "Skills", shortLabel: "Skills" },
  { id: "resources", label: "Resources", shortLabel: "Nuyen" },
] as const;

interface PrioritySelectionCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function PrioritySelectionCard({
  state,
  updateState,
}: PrioritySelectionCardProps) {
  const priorityTable = usePriorityTable();
  const priorities = useMemo(() => state.priorities || {}, [state.priorities]);

  // Count how many priorities are set
  const prioritiesSet = Object.keys(priorities).length;
  const isComplete = prioritiesSet === 5;

  // Get validation status
  const validationStatus = useMemo(() => {
    if (isComplete) return "valid";
    if (prioritiesSet > 0) return "warning";
    return "pending";
  }, [isComplete, prioritiesSet]);

  // Check if a priority level is already assigned
  const getLevelCategory = useCallback(
    (level: string): string | null => {
      const entry = Object.entries(priorities).find(([, l]) => l === level);
      return entry ? entry[0] : null;
    },
    [priorities]
  );

  // Get the priority level for a category
  const getCategoryLevel = useCallback(
    (category: string): PriorityLevel | null => {
      return (priorities[category] as PriorityLevel) || null;
    },
    [priorities]
  );

  // Handle priority selection - swap if level already assigned
  const handlePrioritySelect = useCallback(
    (category: string, level: string) => {
      const existingCategory = getLevelCategory(level);
      const newPriorities = { ...priorities };

      if (existingCategory && existingCategory !== category) {
        // Swap: give the existing category the current category's level
        const currentLevel = priorities[category];
        if (currentLevel) {
          newPriorities[existingCategory] = currentLevel;
        } else {
          delete newPriorities[existingCategory];
        }
      }

      newPriorities[category] = level;
      updateState({ priorities: newPriorities });
    },
    [priorities, getLevelCategory, updateState]
  );

  // Get preview text for a priority level in a category
  const getPreviewText = useCallback(
    (category: string, level: string): string => {
      if (!priorityTable?.table[level]) return "";
      const data = priorityTable.table[level];

      switch (category) {
        case "metatype": {
          const metatypeData = data.metatype as {
            available: string[];
            specialAttributePoints: Record<string, number>;
          };
          if (!metatypeData?.available) return "";
          // Show first few metatypes
          const count = metatypeData.available.length;
          if (count <= 3) return metatypeData.available.join(", ");
          return `${metatypeData.available.slice(0, 2).join(", ")}... +${count - 2}`;
        }
        case "attributes":
          return `${data.attributes} pts`;
        case "magic": {
          const magicData = data.magic as { options: Array<{ path: string }> };
          if (!magicData?.options?.length) return "Mundane";
          return magicData.options.map((o) => o.path).slice(0, 2).join(", ");
        }
        case "skills": {
          const skillData = data.skills as {
            skillPoints: number;
            skillGroupPoints: number;
          };
          return `${skillData?.skillPoints || 0}/${skillData?.skillGroupPoints || 0}`;
        }
        case "resources":
          return `${((data.resources as number) || 0).toLocaleString()}¥`;
        default:
          return "";
      }
    },
    [priorityTable]
  );

  // Render dropdown for a category
  const renderCategorySelect = (category: { id: string; label: string; shortLabel: string }) => {
    const currentLevel = getCategoryLevel(category.id);
    const previewText = currentLevel
      ? getPreviewText(category.id, currentLevel)
      : "Select...";

    return (
      <div key={category.id} className="flex items-center gap-2">
        <span className="w-20 shrink-0 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {category.shortLabel}
        </span>
        <div className="relative flex-1">
          <select
            value={currentLevel || ""}
            onChange={(e) => handlePrioritySelect(category.id, e.target.value)}
            className={`w-full appearance-none rounded-lg border px-3 py-2 pr-8 text-sm transition-colors ${
              currentLevel
                ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100"
                : "border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            <option value="">Select priority...</option>
            {PRIORITY_LEVELS.map((level) => {
              const usedBy = getLevelCategory(level);
              const isUsedElsewhere = usedBy && usedBy !== category.id;
              const preview = getPreviewText(category.id, level);
              return (
                <option key={level} value={level}>
                  {level}: {preview}
                  {isUsedElsewhere ? ` (swap with ${usedBy})` : ""}
                </option>
              );
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
        {currentLevel && (
          <span className="hidden w-32 text-xs text-zinc-500 sm:block">
            {previewText}
          </span>
        )}
      </div>
    );
  };

  // Get derived budgets summary
  const budgetsSummary = useMemo(() => {
    if (!priorityTable || !isComplete) return null;

    const attrPriority = priorities.attributes;
    const skillPriority = priorities.skills;
    const resourcePriority = priorities.resources;

    const budgets: Array<{ label: string; value: string }> = [];

    if (attrPriority && priorityTable.table[attrPriority]) {
      budgets.push({
        label: "Attributes",
        value: `${priorityTable.table[attrPriority].attributes} pts`,
      });
    }

    if (skillPriority && priorityTable.table[skillPriority]) {
      const skillData = priorityTable.table[skillPriority].skills as {
        skillPoints: number;
        skillGroupPoints: number;
      };
      budgets.push({
        label: "Skills",
        value: `${skillData.skillPoints}/${skillData.skillGroupPoints}`,
      });
    }

    if (resourcePriority && priorityTable.table[resourcePriority]) {
      const nuyen = priorityTable.table[resourcePriority].resources as number;
      budgets.push({
        label: "Nuyen",
        value: `${nuyen.toLocaleString()}¥`,
      });
    }

    return budgets;
  }, [priorityTable, priorities, isComplete]);

  return (
    <CreationCard
      title="Priorities"
      description="Assign A-E to each category (higher = better)"
      status={validationStatus}
      warningCount={isComplete ? 0 : 5 - prioritiesSet}
    >
      <div className="space-y-3">
        {PRIORITY_CATEGORIES.map(renderCategorySelect)}

        {/* Summary when complete */}
        {isComplete && budgetsSummary && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <Check className="h-4 w-4" />
              Priorities Set
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-emerald-600 dark:text-emerald-400">
              {budgetsSummary.map((b) => (
                <span key={b.label}>
                  {b.label}: <strong>{b.value}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Help text when incomplete */}
        {!isComplete && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {prioritiesSet === 0
              ? "Each priority level (A-E) can only be used once."
              : `${5 - prioritiesSet} more ${5 - prioritiesSet === 1 ? "priority" : "priorities"} to assign.`}
          </p>
        )}
      </div>
    </CreationCard>
  );
}
