"use client";

/**
 * GearTabsCard
 *
 * Phase 6.3: Consolidated tabbed interface for all gear-related sections.
 * Combines: Gear, Weapons, Armor, Augmentations, and Vehicles into a single
 * card with tabs for better organization and reduced visual clutter.
 */

import { useState, useMemo, useCallback } from "react";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import {
  Package,
  Sword,
  Shield,
  Cpu,
  Car,
  FlaskConical,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Import individual panels
import { GearPanel } from "./gear/GearPanel";
import { WeaponsPanel } from "./WeaponsPanel";
import { ArmorPanel } from "./armor";
import { DrugsPanel } from "./drugs-toxins";
import { AugmentationsCard } from "./AugmentationsCard";
import { VehiclesCard } from "./VehiclesCard";

// =============================================================================
// TYPES
// =============================================================================

interface GearTabsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

type TabId = "gear" | "weapons" | "armor" | "drugs-toxins" | "augmentations" | "vehicles";

interface TabConfig {
  id: TabId;
  label: string;
  icon: typeof Package;
  getBadge: (state: CreationState) => { count: number; hasError?: boolean };
}

// =============================================================================
// TAB CONFIGURATION
// =============================================================================

const TABS: TabConfig[] = [
  {
    id: "gear",
    label: "Gear",
    icon: Package,
    getBadge: (state) => {
      const gear = (state.selections.gear || []) as unknown[];
      return { count: gear.length };
    },
  },
  {
    id: "weapons",
    label: "Weapons",
    icon: Sword,
    getBadge: (state) => {
      const weapons = (state.selections.weapons || []) as unknown[];
      return { count: weapons.length };
    },
  },
  {
    id: "armor",
    label: "Armor",
    icon: Shield,
    getBadge: (state) => {
      const armor = (state.selections.armor || []) as unknown[];
      return { count: armor.length };
    },
  },
  {
    id: "drugs-toxins",
    label: "Drugs",
    icon: FlaskConical,
    getBadge: (state) => {
      const drugs = (state.selections.drugs || []) as unknown[];
      const toxins = (state.selections.toxins || []) as unknown[];
      return { count: drugs.length + toxins.length };
    },
  },
  {
    id: "augmentations",
    label: "Augmentations",
    icon: Cpu,
    getBadge: (state) => {
      const cyberware = (state.selections.cyberware || []) as unknown[];
      const bioware = (state.selections.bioware || []) as unknown[];
      return { count: cyberware.length + bioware.length };
    },
  },
  {
    id: "vehicles",
    label: "Vehicles",
    icon: Car,
    getBadge: (state) => {
      const vehicles = (state.selections.vehicles || []) as unknown[];
      const drones = (state.selections.drones || []) as unknown[];
      return { count: vehicles.length + drones.length };
    },
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function GearTabsCard({ state, updateState }: GearTabsCardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("gear");
  const { budgets } = useCreationBudgets();

  // Get budget status for nuyen
  const nuyenBudget = budgets["nuyen"];
  const isOverBudget = nuyenBudget && nuyenBudget.remaining < 0;

  // Calculate totals for summary
  const totals = useMemo(() => {
    const gear = (state.selections.gear || []) as unknown[];
    const weapons = (state.selections.weapons || []) as unknown[];
    const armor = (state.selections.armor || []) as unknown[];
    const drugs = (state.selections.drugs || []) as unknown[];
    const toxins = (state.selections.toxins || []) as unknown[];
    const cyberware = (state.selections.cyberware || []) as unknown[];
    const bioware = (state.selections.bioware || []) as unknown[];
    const vehicles = (state.selections.vehicles || []) as unknown[];
    const drones = (state.selections.drones || []) as unknown[];

    return {
      items:
        gear.length +
        weapons.length +
        armor.length +
        drugs.length +
        toxins.length +
        cyberware.length +
        bioware.length +
        vehicles.length +
        drones.length,
    };
  }, [state.selections]);

  // Handle tab change
  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  // Render current tab content
  // Note: Individual panels render with their own styling; the tab container
  // provides the unified navigation. In a future refactor, panels could support
  // an `embedded` prop to render without their CreationCard wrapper.
  const renderTabContent = () => {
    switch (activeTab) {
      case "gear":
        return <GearPanel state={state} updateState={updateState} />;
      case "weapons":
        return <WeaponsPanel state={state} updateState={updateState} />;
      case "armor":
        return <ArmorPanel state={state} updateState={updateState} />;
      case "drugs-toxins":
        return <DrugsPanel state={state} updateState={updateState} />;
      case "augmentations":
        return <AugmentationsCard state={state} updateState={updateState} />;
      case "vehicles":
        return <VehiclesCard state={state} updateState={updateState} />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Equipment & Gear</h3>
          {isOverBudget ? (
            <span className="flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="h-3 w-3" />
              Over Budget
            </span>
          ) : totals.items > 0 ? (
            <span className="flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              {totals.items} item{totals.items !== 1 ? "s" : ""}
            </span>
          ) : null}
        </div>

        {/* Nuyen remaining */}
        {nuyenBudget && (
          <div
            className={`text-sm font-medium ${
              isOverBudget ? "text-red-600 dark:text-red-400" : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {nuyenBudget.remaining.toLocaleString()}¥ remaining
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-800">
        {TABS.map((tab) => {
          const badge = tab.getBadge(state);
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {badge.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {badge.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">{renderTabContent()}</div>
    </div>
  );
}
