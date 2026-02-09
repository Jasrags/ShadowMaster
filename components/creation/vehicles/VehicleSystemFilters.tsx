"use client";

/**
 * VehicleSystemFilters
 *
 * Type tabs, search input, and subcategory filter pills for the vehicle system modal.
 */

import { Search, Car, Bot, Wifi, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  TYPE_TABS,
  VEHICLE_CATEGORIES,
  DRONE_SIZES,
  RCC_TIERS,
  AUTOSOFT_CATEGORIES,
  type VehicleSystemType,
} from "./vehicleSystemHelpers";

// =============================================================================
// ICON MAPPING
// =============================================================================

const TYPE_ICONS: Record<VehicleSystemType, LucideIcon> = {
  vehicle: Car,
  drone: Bot,
  rcc: Wifi,
  autosoft: Cpu,
};

// =============================================================================
// TYPES
// =============================================================================

export interface VehicleSystemFiltersProps {
  /** Active vehicle system type */
  activeType: VehicleSystemType;
  /** Type change handler */
  onTypeChange: (type: VehicleSystemType) => void;
  /** Current search query */
  searchQuery: string;
  /** Search query change handler */
  onSearchQueryChange: (value: string) => void;
  /** Active subcategory filter */
  subcategory: string;
  /** Subcategory change handler */
  onSubcategoryChange: (value: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function VehicleSystemFilters({
  activeType,
  onTypeChange,
  searchQuery,
  onSearchQueryChange,
  subcategory,
  onSubcategoryChange,
}: VehicleSystemFiltersProps) {
  // Get subcategories for current type
  const subcategories = (() => {
    switch (activeType) {
      case "vehicle":
        return VEHICLE_CATEGORIES;
      case "drone":
        return DRONE_SIZES;
      case "rcc":
        return RCC_TIERS;
      case "autosoft":
        return AUTOSOFT_CATEGORIES;
    }
  })();

  // Get the active tab info for the header icon
  const activeTab = TYPE_TABS.find((t) => t.id === activeType)!;
  const ActiveIcon = TYPE_ICONS[activeType];

  return (
    <>
      {/* Type Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
        {TYPE_TABS.map((tab) => {
          const Icon = TYPE_ICONS[tab.id];
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTypeChange(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? tab.activeColor
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Subcategory Filters */}
      <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={`Search ${activeType === "rcc" ? "RCCs" : activeType + "s"}...`}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className={`w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
              activeType === "vehicle"
                ? "focus:border-blue-500 focus:ring-blue-500"
                : activeType === "drone"
                  ? "focus:border-green-500 focus:ring-green-500"
                  : activeType === "rcc"
                    ? "focus:border-purple-500 focus:ring-purple-500"
                    : "focus:border-cyan-500 focus:ring-cyan-500"
            }`}
          />
        </div>

        {/* Subcategory Filter */}
        <div className="mt-3 flex flex-wrap gap-2">
          {subcategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSubcategoryChange(cat.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                subcategory === cat.id
                  ? activeType === "vehicle"
                    ? "bg-blue-500 text-white"
                    : activeType === "drone"
                      ? "bg-green-500 text-white"
                      : activeType === "rcc"
                        ? "bg-purple-500 text-white"
                        : "bg-cyan-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/** Returns the header icon element for the active type (used by modal header). */
export function VehicleSystemHeaderIcon({ activeType }: { activeType: VehicleSystemType }) {
  const ActiveIcon = TYPE_ICONS[activeType];
  return (
    <div
      className={`ml-2 rounded-lg p-1.5 ${
        activeType === "vehicle"
          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
          : activeType === "drone"
            ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300"
            : activeType === "rcc"
              ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
              : "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300"
      }`}
    >
      <ActiveIcon className="h-4 w-4" />
    </div>
  );
}
