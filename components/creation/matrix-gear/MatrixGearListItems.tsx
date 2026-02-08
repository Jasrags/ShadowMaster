"use client";

/**
 * MatrixGearListItems
 *
 * Virtualized list item components for commlinks, cyberdecks, and software
 * in the matrix gear purchase modal.
 */

import {
  Smartphone,
  Cpu,
  Database,
  Map,
  ShoppingCart,
  GraduationCap,
  Minus,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  CommlinkData,
  CyberdeckData,
  DataSoftwareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import {
  formatCurrency,
  getAvailabilityDisplay,
  formatAttributeArray,
  SOFTWARE_SUBCATEGORIES,
  type SoftwareSubcategory,
} from "./matrixGearHelpers";

/** Icon mapping for software subcategories */
const SOFTWARE_ICONS: Record<SoftwareSubcategory, LucideIcon> = {
  datasoft: Database,
  mapsoft: Map,
  shopsoft: ShoppingCart,
  tutorsoft: GraduationCap,
};

// =============================================================================
// COMMLINK LIST ITEM
// =============================================================================

/** Props for CommlinkListItem */
export interface CommlinkListItemProps {
  /** Commlink catalog data */
  commlink: CommlinkData;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Whether the character can afford this item */
  canAfford: boolean;
  /** Click handler for selection */
  onClick: () => void;
}

export function CommlinkListItem({
  commlink,
  isSelected,
  canAfford,
  onClick,
}: CommlinkListItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? "border-cyan-400 bg-cyan-50 dark:border-cyan-600 dark:bg-cyan-900/30"
          : canAfford
            ? "border-zinc-200 bg-white hover:border-cyan-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-cyan-500"
            : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-cyan-500" />
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {commlink.name}
            </span>
            <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[10px] font-medium text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400">
              DR {commlink.deviceRating}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Avail: {getAvailabilityDisplay(commlink.availability, commlink.legality)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(commlink.cost)}¥
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// CYBERDECK LIST ITEM
// =============================================================================

/** Props for CyberdeckListItem */
export interface CyberdeckListItemProps {
  /** Cyberdeck catalog data */
  cyberdeck: CyberdeckData;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Whether the character can afford this item */
  canAfford: boolean;
  /** Click handler for selection */
  onClick: () => void;
}

export function CyberdeckListItem({
  cyberdeck,
  isSelected,
  canAfford,
  onClick,
}: CyberdeckListItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? "border-purple-400 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/30"
          : canAfford
            ? "border-zinc-200 bg-white hover:border-purple-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-purple-500"
            : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-purple-500" />
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {cyberdeck.name}
            </span>
            <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
              DR {cyberdeck.deviceRating}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>ASDF: {formatAttributeArray(cyberdeck)}</span>
            <span>Programs: {cyberdeck.programs}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(cyberdeck.cost)}¥
          </div>
          <div className="text-xs text-zinc-500">
            {getAvailabilityDisplay(cyberdeck.availability, cyberdeck.legality)}
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// SOFTWARE LIST ITEM
// =============================================================================

/** Props for SoftwareListItem */
export interface SoftwareListItemProps {
  /** Software catalog data */
  item: DataSoftwareCatalogItemData;
  /** Active software subcategory */
  subcategory: SoftwareSubcategory;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Click handler for selection */
  onClick: () => void;
}

export function SoftwareListItem({
  item,
  subcategory,
  isSelected,
  onClick,
}: SoftwareListItemProps) {
  const config = SOFTWARE_SUBCATEGORIES.find((s) => s.id === subcategory)!;
  const Icon = SOFTWARE_ICONS[subcategory];

  const costDisplay = item.hasRating
    ? `${formatCurrency(item.ratings?.["1"]?.cost || 400)}¥ - ${formatCurrency(item.ratings?.["6"]?.cost || 2400)}¥`
    : `${formatCurrency(item.cost || 0)}¥`;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? `${config.bgColor} border-zinc-300 dark:border-zinc-600`
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Icon className={`h-3.5 w-3.5 ${config.color}`} />
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {item.name}
            </span>
            {item.hasRating && (
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                R{item.minRating || 1}-{item.maxRating || 6}
              </span>
            )}
          </div>
          {item.effects && (
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {item.effects}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {costDisplay}
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// RATING SELECTOR
// =============================================================================

/** Props for RatingSelector */
export interface RatingSelectorProps {
  /** Current rating value */
  value: number;
  /** Minimum allowed rating */
  min: number;
  /** Maximum allowed rating */
  max: number;
  /** Callback when rating changes */
  onChange: (rating: number) => void;
}

export function RatingSelector({ value, min, max, onChange }: RatingSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
