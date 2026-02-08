"use client";

/**
 * MatrixGearFilters
 *
 * Search, category, and filter controls for the matrix gear purchase modal.
 * Includes search input, legal-only toggle, category pills, software sub-pills,
 * and device compatibility warning.
 */

import {
  Search,
  Smartphone,
  Cpu,
  Database,
  Map,
  ShoppingCart,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  MATRIX_CATEGORIES,
  SOFTWARE_SUBCATEGORIES,
  type MatrixGearCategory,
  type SoftwareSubcategory,
} from "./matrixGearHelpers";

// =============================================================================
// ICON MAPPINGS
// =============================================================================

const CATEGORY_ICONS: Record<MatrixGearCategory, LucideIcon> = {
  commlinks: Smartphone,
  cyberdecks: Cpu,
  software: Database,
};

const SOFTWARE_ICONS: Record<SoftwareSubcategory, LucideIcon> = {
  datasoft: Database,
  mapsoft: Map,
  shopsoft: ShoppingCart,
  tutorsoft: GraduationCap,
};

// =============================================================================
// TYPES
// =============================================================================

export interface MatrixGearFiltersProps {
  /** Current search query */
  searchQuery: string;
  /** Search query change handler */
  onSearchQueryChange: (value: string) => void;
  /** Whether to show only legal items */
  showOnlyLegal: boolean;
  /** Legal-only toggle handler */
  onShowOnlyLegalChange: (value: boolean) => void;
  /** Active gear category */
  selectedCategory: MatrixGearCategory;
  /** Category selection handler — also clears item selections */
  onCategoryChange: (category: MatrixGearCategory) => void;
  /** Active software subcategory */
  selectedSoftwareType: SoftwareSubcategory;
  /** Software subcategory change handler */
  onSoftwareTypeChange: (type: SoftwareSubcategory) => void;
  /** Whether character has a device to run software */
  hasCompatibleDevice: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MatrixGearFilters({
  searchQuery,
  onSearchQueryChange,
  showOnlyLegal,
  onShowOnlyLegalChange,
  selectedCategory,
  onCategoryChange,
  selectedSoftwareType,
  onSoftwareTypeChange,
  hasCompatibleDevice,
}: MatrixGearFiltersProps) {
  return (
    <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
      {/* Search + Legal Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={`Search ${selectedCategory}...`}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={showOnlyLegal}
            onChange={(e) => onShowOnlyLegalChange(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600"
          />
          Legal only
        </label>
      </div>

      {/* Category Pills */}
      <div className="mt-3 flex flex-wrap gap-2">
        {MATRIX_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? cat.id === "commlinks"
                    ? "bg-cyan-500 text-white"
                    : cat.id === "cyberdecks"
                      ? "bg-purple-500 text-white"
                      : "bg-blue-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Software Sub-Pills */}
      {selectedCategory === "software" && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SOFTWARE_SUBCATEGORIES.map((sub) => {
            const Icon = SOFTWARE_ICONS[sub.id];
            return (
              <button
                key={sub.id}
                onClick={() => onSoftwareTypeChange(sub.id)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                  selectedSoftwareType === sub.id
                    ? `${sub.bgColor} ${sub.color}`
                    : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="h-3 w-3" />
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Device Warning for Software */}
      {selectedCategory === "software" && !hasCompatibleDevice && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="text-xs">
            <span className="font-medium text-amber-700 dark:text-amber-300">
              Software requires a commlink or cyberdeck.
            </span>
            <span className="text-amber-600 dark:text-amber-400">
              {" "}
              You can still purchase for later use.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
