"use client";

import { usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

const PRIORITY_LEVELS = ["A", "B", "C", "D", "E"] as const;
const PRIORITY_CATEGORIES = [
  { id: "metatype", label: "Metatype" },
  { id: "attributes", label: "Attributes" },
  { id: "magic", label: "Magic/Resonance" },
  { id: "skills", label: "Skills" },
  { id: "resources", label: "Resources" },
] as const;

export function PriorityStep({ state, updateState }: StepProps) {
  const priorityTable = usePriorityTable();
  const priorities = state.priorities || {};

  // Check if a priority level is already assigned
  const isLevelUsed = (level: string) => {
    return Object.values(priorities).includes(level);
  };

  // Check if a category already has a priority
  const getCategoryLevel = (category: string) => {
    return priorities[category] || null;
  };

  // Handle priority selection
  const handlePrioritySelect = (category: string, level: string) => {
    // If this level is already assigned to another category, swap them
    const existingCategory = Object.entries(priorities).find(
      ([, l]) => l === level
    )?.[0];

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
  };

  // Get preview data for a priority level
  const getPreviewData = (category: string, level: string) => {
    if (!priorityTable?.table[level]) return null;
    const data = priorityTable.table[level];

    switch (category) {
      case "metatype":
        const metatypeData = data.metatype as {
          available: string[];
          specialAttributePoints: Record<string, number>;
        };
        return metatypeData?.available?.join(", ") || "";
      case "attributes":
        return `${data.attributes} points`;
      case "magic":
        const magicData = data.magic as { options: Array<{ path: string }> };
        if (!magicData?.options?.length) return "Mundane only";
        return magicData.options.map((o) => o.path).join(", ");
      case "skills":
        const skillData = data.skills as {
          skillPoints: number;
          skillGroupPoints: number;
        };
        return `${skillData?.skillPoints || 0} / ${skillData?.skillGroupPoints || 0}`;
      case "resources":
        return `¥${(data.resources as number)?.toLocaleString() || 0}`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Assign each priority level (A-E) to one category. Each level can only be used once.
        Higher priorities give better options in that category.
      </p>

      {/* Priority Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b border-zinc-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                Category
              </th>
              {PRIORITY_LEVELS.map((level) => (
                <th
                  key={level}
                  className="border-b border-zinc-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                >
                  {level}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRIORITY_CATEGORIES.map((category) => (
              <tr key={category.id}>
                <td className="border-b border-zinc-100 px-4 py-3 text-sm font-medium text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
                  {category.label}
                </td>
                {PRIORITY_LEVELS.map((level) => {
                  const isSelected = getCategoryLevel(category.id) === level;
                  const isUsedElsewhere = isLevelUsed(level) && !isSelected;
                  const preview = getPreviewData(category.id, level);

                  return (
                    <td
                      key={level}
                      className="border-b border-zinc-100 px-2 py-2 dark:border-zinc-800"
                    >
                      <button
                        onClick={() => handlePrioritySelect(category.id, level)}
                        className={`w-full rounded-lg p-3 text-left transition-all ${
                          isSelected
                            ? "bg-emerald-100 ring-2 ring-emerald-500 dark:bg-emerald-900/50"
                            : isUsedElsewhere
                            ? "bg-zinc-100 opacity-50 hover:opacity-75 dark:bg-zinc-800"
                            : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <div
                          className={`text-xs font-medium ${
                            isSelected
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {preview}
                        </div>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {Object.keys(priorities).length === 5 && (
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              All priorities assigned! You can proceed to the next step.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

