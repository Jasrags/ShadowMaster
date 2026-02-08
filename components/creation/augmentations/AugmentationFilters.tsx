"use client";

/**
 * AugmentationFilters
 *
 * Type toggle, search input, category pills, and grade selector
 * for the augmentation modal.
 */

import { Search, Cpu, Heart } from "lucide-react";
import type { CyberwareGrade, BiowareGrade } from "@/lib/types";
import {
  GRADE_LABELS,
  CYBERWARE_CATEGORIES,
  BIOWARE_CATEGORIES,
  type AugmentationType,
} from "./augmentationModalHelpers";

// =============================================================================
// TYPES
// =============================================================================

export interface AugmentationFiltersProps {
  /** Active augmentation type */
  activeType: AugmentationType;
  /** Type change handler */
  onTypeChange: (type: AugmentationType) => void;
  /** Current search query */
  searchQuery: string;
  /** Search query change handler */
  onSearchQueryChange: (value: string) => void;
  /** Active category filter */
  category: string;
  /** Category change handler */
  onCategoryChange: (value: string) => void;
  /** Item counts per category */
  categoryCounts: Record<string, number>;
  /** Currently selected grade */
  grade: CyberwareGrade | BiowareGrade;
  /** Grade change handler */
  onGradeChange: (value: CyberwareGrade | BiowareGrade) => void;
  /** Available grades from ruleset */
  availableGrades: { id: string; essenceMultiplier: number; costMultiplier: number }[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AugmentationFilters({
  activeType,
  onTypeChange,
  searchQuery,
  onSearchQueryChange,
  category,
  onCategoryChange,
  categoryCounts,
  grade,
  onGradeChange,
  availableGrades,
}: AugmentationFiltersProps) {
  const isCyberware = activeType === "cyberware";
  const categories = isCyberware ? CYBERWARE_CATEGORIES : BIOWARE_CATEGORIES;

  return (
    <>
      {/* Type Toggle - Cyberware / Bioware */}
      <div className="flex gap-2 border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
        <button
          onClick={() => onTypeChange("cyberware")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeType === "cyberware"
              ? "bg-cyan-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          <Cpu className="h-4 w-4" />
          Cyberware
        </button>
        <button
          onClick={() => onTypeChange("bioware")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeType === "bioware"
              ? "bg-pink-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          <Heart className="h-4 w-4" />
          Bioware
        </button>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={`Search ${isCyberware ? "cyberware" : "bioware"}...`}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className={`w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
              isCyberware
                ? "focus:border-cyan-500 focus:ring-cyan-500"
                : "focus:border-pink-500 focus:ring-pink-500"
            }`}
          />
        </div>

        {/* Category Filter with counts */}
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                category === cat.id
                  ? isCyberware
                    ? "bg-cyan-500 text-white"
                    : "bg-pink-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {cat.name}
              {categoryCounts[cat.id] > 0 && (
                <span className="ml-1 opacity-70">({categoryCounts[cat.id]})</span>
              )}
            </button>
          ))}
        </div>

        {/* Grade Selector */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Grade:</span>
          <select
            value={grade}
            onChange={(e) => onGradeChange(e.target.value as CyberwareGrade | BiowareGrade)}
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {availableGrades.map((g) => (
              <option key={g.id} value={g.id}>
                {GRADE_LABELS[g.id]} ({g.essenceMultiplier}x ESS, {g.costMultiplier}x cost)
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

/** Returns the header icon element for the active augmentation type. */
export function AugmentationHeaderIcon({ activeType }: { activeType: AugmentationType }) {
  const TypeIcon = activeType === "cyberware" ? Cpu : Heart;
  return (
    <div
      className={`ml-2 rounded-lg p-1.5 ${
        activeType === "cyberware"
          ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300"
          : "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300"
      }`}
    >
      <TypeIcon className="h-4 w-4" />
    </div>
  );
}
