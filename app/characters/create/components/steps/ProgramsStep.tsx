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

  const vehiclesSpent = (
    (state.selections?.vehicles as Array<{ cost: number }>) || []
  ).reduce((sum, item) => sum + item.cost, 0);

  const dronesSpent = (
    (state.selections?.drones as Array<{ cost: number }>) || []
  ).reduce((sum, item) => sum + item.cost, 0);

  const rccsSpent = (
    (state.selections?.rccs as Array<{ cost: number }>) || []
  ).reduce((sum, item) => sum + item.cost, 0);

  const autosoftsSpent = (
    (state.selections?.autosofts as Array<{ cost: number }>) || []
  ).reduce((sum, item) => sum + item.cost, 0);

  const programsSpent = selectedPrograms.reduce(
    (sum, program) => sum + program.cost,
    0
  );

  const totalSpent =
    gearSpent +
    vehiclesSpent +
    dronesSpent +
    rccsSpent +
    autosoftsSpent +
    programsSpent;
  const remaining = totalNuyen - totalSpent;

  // Filter programs based on tab and search
  const filteredCommon = useMemo(() => {
    let items = programsByCategory.common;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    if (!showUnavailable) {
      items = items.filter((item) =>
        isItemAvailable(item.availability, item.forbidden)
      );
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
          item.description?.toLowerCase().includes(query)
      );
    }

    if (!showUnavailable) {
      items = items.filter((item) =>
        isItemAvailable(item.availability, item.forbidden)
      );
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
          item.description?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [programsByCategory.agents, searchQuery]);

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

  // Render program item
  const renderProgramItem = (program: ProgramCatalogItemData) => {
    const isOwned = isProgramOwned(program.id);
    const isAgent = program.category === "agent";
    const rating = agentRating[program.id] || program.minRating || 1;

    const displayCost = isAgent
      ? calculateAgentCost(program.costPerRating || 1000, rating)
      : program.cost;

    const displayAvailability = isAgent
      ? calculateAgentAvailability(rating)
      : program.availability;

    const canAfford = displayCost <= remaining;
    const isAvailable = isItemAvailable(displayAvailability, program.forbidden);

    return (
      <div
        key={program.id}
        className={`p-3 rounded-lg border ${
          !isAvailable
            ? "border-red-500/30 bg-red-950/20"
            : isOwned
            ? "border-green-500/50 bg-green-950/20"
            : "border-zinc-700 bg-zinc-800/50"
        }`}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <div className="font-medium text-white flex items-center gap-2">
              {program.name}
              {program.restricted && (
                <span className="text-xs text-yellow-500">(R)</span>
              )}
              {program.forbidden && (
                <span className="text-xs text-red-500">(F)</span>
              )}
            </div>
            {program.effects && (
              <div className="text-sm text-zinc-400 mt-1">{program.effects}</div>
            )}
            {program.description && (
              <div className="text-xs text-zinc-500 mt-1">
                {program.description}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm text-zinc-300">
              {formatCurrency(displayCost)}¥
            </div>
            <div className="text-xs text-zinc-500">
              Avail: {getAvailabilityDisplay(displayAvailability, program.restricted, program.forbidden)}
            </div>
          </div>
        </div>

        {isAgent && (
          <div className="mt-2 flex items-center gap-2">
            <label className="text-sm text-zinc-400">Rating:</label>
            <select
              value={rating}
              onChange={(e) =>
                setAgentRating((prev) => ({
                  ...prev,
                  [program.id]: parseInt(e.target.value),
                }))
              }
              className="bg-zinc-700 text-white text-sm rounded px-2 py-1"
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
            <span className="text-xs text-zinc-500">
              Cost: {formatCurrency(calculateAgentCost(program.costPerRating || 1000, rating))}¥
            </span>
          </div>
        )}

        <div className="mt-2 flex justify-end">
          {isOwned ? (
            <span className="text-sm text-green-400">Owned</span>
          ) : (
            <button
              onClick={() => addProgram(program, isAgent ? rating : undefined)}
              disabled={!canAfford || (!showUnavailable && !isAvailable)}
              className={`px-3 py-1 text-sm rounded ${
                canAfford && (showUnavailable || isAvailable)
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {!canAfford ? "Can't Afford" : "Add"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Matrix Programs</h2>
        <p className="text-zinc-400 mt-1">
          Select Matrix programs for your cyberdeck or commlink. Common programs
          provide utility functions, hacking programs are needed for illegal
          Matrix operations, and agents can act autonomously.
        </p>
      </div>

      {/* Budget Summary */}
      <div className="bg-zinc-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-zinc-300 mb-2">Nuyen Budget</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-zinc-500">Total:</span>
            <span className="ml-2 text-white">{formatCurrency(totalNuyen)}¥</span>
          </div>
          <div>
            <span className="text-zinc-500">Spent:</span>
            <span className="ml-2 text-white">{formatCurrency(totalSpent)}¥</span>
          </div>
          <div>
            <span className="text-zinc-500">Programs:</span>
            <span className="ml-2 text-cyan-400">
              {formatCurrency(programsSpent)}¥
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Remaining:</span>
            <span
              className={`ml-2 ${
                remaining >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatCurrency(remaining)}¥
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-700">
        {(["common", "hacking", "agents"] as ProgramTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab}
            <span className="ml-1 text-xs text-zinc-500">
              (
              {tab === "common"
                ? filteredCommon.length
                : tab === "hacking"
                ? filteredHacking.length
                : filteredAgents.length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search programs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-2 text-sm border border-zinc-700 focus:border-blue-500 focus:outline-none"
        />
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={showUnavailable}
            onChange={(e) => setShowUnavailable(e.target.checked)}
            className="rounded bg-zinc-700 border-zinc-600"
          />
          Show unavailable (Avail &gt; 12)
        </label>
      </div>

      {/* Program List */}
      <div className="grid gap-3">
        {activeTab === "common" && (
          <>
            {filteredCommon.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                No common programs found
              </div>
            ) : (
              filteredCommon.map(renderProgramItem)
            )}
          </>
        )}

        {activeTab === "hacking" && (
          <>
            {filteredHacking.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                No hacking programs found
              </div>
            ) : (
              filteredHacking.map(renderProgramItem)
            )}
          </>
        )}

        {activeTab === "agents" && (
          <>
            {filteredAgents.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                No agent programs found
              </div>
            ) : (
              filteredAgents.map(renderProgramItem)
            )}
          </>
        )}
      </div>

      {/* Selected Programs */}
      {selectedPrograms.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white mb-3">
            Selected Programs ({selectedPrograms.length})
          </h3>
          <div className="space-y-2">
            {selectedPrograms.map((program) => (
              <div
                key={program.id}
                className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg border border-zinc-700"
              >
                <div>
                  <span className="text-white">{program.name}</span>
                  {program.rating && (
                    <span className="ml-2 text-sm text-zinc-400">
                      Rating {program.rating}
                    </span>
                  )}
                  <span className="ml-2 text-xs text-zinc-500 capitalize">
                    ({program.category})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-zinc-300">
                    {formatCurrency(program.cost)}¥
                  </span>
                  <button
                    onClick={() => removeProgram(program.id!)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
