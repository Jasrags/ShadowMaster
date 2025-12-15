"use client";

import { useState, useMemo, useCallback } from "react";
import type { CreationState, CharacterProgram } from "@/lib/types";
import {
  usePrograms,
  useProgramsByCategory,
  calculateAgentCost,
  calculateAgentAvailability,
  type ProgramCatalogItemData,
} from "@/lib/rules/RulesetContext";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

type ProgramTab = "common" | "hacking" | "agents";

const MAX_AVAILABILITY = 12;

// Counter for generating unique IDs
let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getAvailabilityDisplay(
  availability: number,
  restricted?: boolean,
  forbidden?: boolean
): string {
  let display = String(availability);
  if (restricted) display += "R";
  if (forbidden) display += "F";
  return display;
}

function isItemAvailable(availability: number, forbidden?: boolean): boolean {
  return availability <= MAX_AVAILABILITY && !forbidden;
}

export function ProgramsStep({ state, updateState, budgetValues }: StepProps) {
  const programsByCategory = useProgramsByCategory();

  const [activeTab, setActiveTab] = useState<ProgramTab>("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [agentRating, setAgentRating] = useState<Record<string, number>>({});

  // Get selections from state
  const selectedPrograms: CharacterProgram[] =
    (state.selections?.programs as CharacterProgram[]) || [];

  // Calculate budget from gear step (programs share nuyen budget with gear)
  const baseNuyen = budgetValues["nuyen"] || 0;
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const convertedNuyen = karmaConversion * 2000;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate total spent across gear, vehicles, and programs
  const gearSpent = (
    (state.selections?.gear as Array<{ cost: number; quantity: number }>) || []
  ).reduce((sum, item) => sum + item.cost * item.quantity, 0);

  const lifestyleCost = (state.selections?.lifestyle as { monthlyCost: number })?.monthlyCost || 0;
  const augmentationSpent = (state.budgets?.["nuyen-spent-augmentations"] as number) || 0;
  const vehiclesSpent =
    ((state.selections?.vehicles as Array<{ cost: number }>) || []).reduce((sum, v) => sum + v.cost, 0) +
    ((state.selections?.drones as Array<{ cost: number }>) || []).reduce((sum, d) => sum + d.cost, 0) +
    ((state.selections?.rccs as Array<{ cost: number }>) || []).reduce((sum, r) => sum + r.cost, 0) +
    ((state.selections?.autosofts as Array<{ cost: number }>) || []).reduce((sum, a) => sum + a.cost, 0);

  const identitySpent = (state.budgets?.["nuyen-spent-identities"] as number) || 0;
  const programsSpent = selectedPrograms.reduce((sum, program) => sum + program.cost, 0);
  const totalSpent = gearSpent + lifestyleCost + augmentationSpent + vehiclesSpent + identitySpent + programsSpent;
  const remaining = totalNuyen - totalSpent;

  // Filter programs based on tab and search
  const filteredCommon = useMemo(() => {
    let items = programsByCategory.common;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.effects?.toLowerCase().includes(query)
      );
    }

    if (!showUnavailable) {
      items = items.filter((item) => isItemAvailable(item.availability, item.forbidden));
    }

    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [programsByCategory.common, searchQuery, showUnavailable]);

  const filteredHacking = useMemo(() => {
    let items = programsByCategory.hacking;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.effects?.toLowerCase().includes(query)
      );
    }

    if (!showUnavailable) {
      items = items.filter((item) => isItemAvailable(item.availability, item.forbidden));
    }

    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [programsByCategory.hacking, searchQuery, showUnavailable]);

  const filteredAgents = useMemo(() => {
    let items = programsByCategory.agents;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.effects?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [programsByCategory.agents, searchQuery]);

  // Get current filtered items based on active tab
  const currentFilteredItems = useMemo(() => {
    switch (activeTab) {
      case "common":
        return filteredCommon;
      case "hacking":
        return filteredHacking;
      case "agents":
        return filteredAgents;
    }
  }, [activeTab, filteredCommon, filteredHacking, filteredAgents]);

  // Add program
  const addProgram = useCallback(
    (program: ProgramCatalogItemData, rating?: number) => {
      const cost =
        program.category === "agent" && program.costPerRating && rating
          ? calculateAgentCost(program.costPerRating, rating)
          : program.cost;

      const availability =
        program.category === "agent" && rating
          ? calculateAgentAvailability(rating)
          : program.availability;

      const newProgram: CharacterProgram = {
        id: generateId("program"),
        catalogId: program.id,
        name: program.name,
        category: program.category,
        rating: rating,
        cost,
        availability,
      };

      updateState({
        selections: {
          ...state.selections,
          programs: [...selectedPrograms, newProgram],
        },
      });
    },
    [state.selections, selectedPrograms, updateState]
  );

  // Remove program
  const removeProgram = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          programs: selectedPrograms.filter((p) => p.id !== id),
        },
      });
    },
    [state.selections, selectedPrograms, updateState]
  );

  // Check if a program is already owned
  const isProgramOwned = (catalogId: string) => {
    return selectedPrograms.some((p) => p.catalogId === catalogId);
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Budget</p>
            <p className="text-lg font-semibold">¥{formatCurrency(totalNuyen)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Programs</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              ¥{formatCurrency(programsSpent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Spent</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              ¥{formatCurrency(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Remaining</p>
            <p
              className={`text-lg font-semibold ${
                remaining < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              ¥{formatCurrency(remaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700">
        {[
          { id: "common", label: "Common", count: filteredCommon.length },
          { id: "hacking", label: "Hacking", count: filteredHacking.length },
          { id: "agents", label: "Agents", count: filteredAgents.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProgramTab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs dark:bg-emerald-900">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder={`Search ${activeTab} programs...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-48 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showUnavailable}
            onChange={(e) => setShowUnavailable(e.target.checked)}
            className="rounded"
          />
          Show unavailable
        </label>
      </div>

      {/* Program List */}
      <div className="max-h-80 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-3 py-2 text-left">Program</th>
              <th className="px-3 py-2 text-center">Category</th>
              <th className="px-3 py-2 text-center">Rating</th>
              <th className="px-3 py-2 text-right">Cost</th>
              <th className="px-3 py-2 text-center">Avail</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
            {currentFilteredItems.map((program) => {
              const isAgent = program.category === "agent";
              const rating = agentRating[program.id] || program.minRating || 1;
              const displayCost = isAgent
                ? calculateAgentCost(program.costPerRating || 1000, rating)
                : program.cost;
              const displayAvailability = isAgent
                ? calculateAgentAvailability(rating)
                : program.availability;
              const available = isItemAvailable(displayAvailability, program.forbidden);
              const canAfford = displayCost <= remaining;
              const isOwned = isProgramOwned(program.id);

              return (
                <tr
                  key={program.id}
                  className={`${!available ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                >
                  <td className="px-3 py-2">
                    <p className="font-medium">{program.name}</p>
                    {program.effects && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                        {program.effects}
                      </p>
                    )}
                    {program.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                        {program.description}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center capitalize">{program.category}</td>
                  <td className="px-3 py-2 text-center">
                    {isAgent ? (
                      <select
                        value={rating}
                        onChange={(e) =>
                          setAgentRating({ ...agentRating, [program.id]: parseInt(e.target.value) })
                        }
                        className="w-16 rounded border border-zinc-300 bg-white px-1 py-0.5 text-center text-xs dark:border-zinc-600 dark:bg-zinc-800"
                      >
                        {Array.from(
                          { length: (program.maxRating || 6) - (program.minRating || 1) + 1 },
                          (_, i) => (program.minRating || 1) + i
                        ).map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">¥{formatCurrency(displayCost)}</td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`${
                        program.restricted
                          ? "text-amber-600 dark:text-amber-400"
                          : program.forbidden
                            ? "text-red-600 dark:text-red-400"
                            : ""
                      }`}
                    >
                      {getAvailabilityDisplay(displayAvailability, program.restricted, program.forbidden)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {isOwned ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">Owned</span>
                    ) : (
                      <button
                        onClick={() => addProgram(program, isAgent ? rating : undefined)}
                        disabled={!available || !canAfford}
                        className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                          available && canAfford
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                        }`}
                      >
                        Add
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {currentFilteredItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                  No {activeTab} programs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Programs */}
      {selectedPrograms.length > 0 && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
          <h4 className="mb-2 text-sm font-medium">Selected Programs ({selectedPrograms.length})</h4>
          <div className="space-y-1">
            {selectedPrograms.map((program) => (
              <div key={program.id} className="flex items-center justify-between text-sm">
                <span>
                  {program.name}
                  {program.rating && <span className="ml-1 text-zinc-500">R{program.rating}</span>}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">¥{formatCurrency(program.cost)}</span>
                  <button
                    onClick={() => removeProgram(program.id!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Maximum availability at creation: {MAX_AVAILABILITY}. Restricted (R) items require a license.
        Forbidden (F) items are not available at creation. Programs are installed on cyberdecks or
        commlinks and count against device program capacity.
      </p>
    </div>
  );
}
