"use client";

/**
 * AdeptPowersCard
 *
 * Compact card for adept power selection in sheet-driven creation.
 * Supports power point allocation and karma-purchased power points.
 *
 * Features:
 * - Power point budget display
 * - Power list with levels
 * - Mystic Adept PP allocation slider
 * - Karma purchase for additional PP
 * - Search and add powers
 */

import { useMemo, useCallback, useState } from "react";
import { useAdeptPowers, usePriorityTable } from "@/lib/rules";
import type { CreationState, AdeptPower } from "@/lib/types";
import type { AdeptPowerCatalogItem } from "@/lib/rules/loader-types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Search, Plus, Minus, X, Zap } from "lucide-react";

const POWER_POINT_KARMA_COST = 5;

// Paths that can have adept powers
const ADEPT_PATHS = ["adept", "mystic-adept"];

interface AdeptPowersCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function AdeptPowersCard({ state, updateState }: AdeptPowersCardProps) {
  const adeptPowersCatalog = useAdeptPowers();
  const priorityTable = usePriorityTable();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPowerId, setSelectedPowerId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedSpec, setSelectedSpec] = useState<string>("");

  // Get magic rating
  const magicRating = useMemo(() => {
    const magicPriority = state.priorities?.magic;
    const magicalPath = (state.selections["magical-path"] as string) || "mundane";

    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return 0;
    }

    const magicData = priorityTable.table[magicPriority].magic as {
      options?: Array<{ path: string; magicRating?: number }>;
    };

    const option = magicData?.options?.find((o) => o.path === magicalPath);
    return option?.magicRating || 0;
  }, [state.priorities?.magic, priorityTable, state.selections]);

  const magicalPath = (state.selections["magical-path"] as string) || "mundane";
  const canHaveAdeptPowers = ADEPT_PATHS.includes(magicalPath);
  const isMysticAdept = magicalPath === "mystic-adept";

  // Calculate power points
  const karmaSpentPowerPoints = (state.budgets["karma-spent-power-points"] as number) || 0;
  const karmaPurchasedPP = Math.floor(karmaSpentPowerPoints / POWER_POINT_KARMA_COST);

  const basePowerPointBudget = isMysticAdept
    ? ((state.selections["power-points-allocation"] as number) || 0)
    : magicRating;

  const powerPointBudget = basePowerPointBudget + karmaPurchasedPP;

  // Karma remaining
  const karmaRemaining = karmaBudget?.remaining || 0;

  // Get current adept powers
  const selectedPowers = useMemo(
    () => (state.selections.adeptPowers || []) as AdeptPower[],
    [state.selections.adeptPowers]
  );

  // Calculate PP spent
  const ppSpent = useMemo(
    () => selectedPowers.reduce((sum, p) => sum + p.powerPointCost, 0),
    [selectedPowers]
  );

  const ppRemaining = Math.round((powerPointBudget - ppSpent) * 100) / 100;

  // Filter powers
  const filteredPowers = useMemo(() => {
    if (!searchQuery.trim()) return adeptPowersCatalog;
    const search = searchQuery.toLowerCase();
    return adeptPowersCatalog.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }, [adeptPowersCatalog, searchQuery]);

  // Get power by ID
  const getPowerById = useCallback(
    (id: string) => adeptPowersCatalog.find((p) => p.id === id),
    [adeptPowersCatalog]
  );

  // Calculate cost for power at level
  const calculateCost = useCallback(
    (power: AdeptPowerCatalogItem, level: number): number => {
      if (power.costType === "table" && power.levels) {
        const levelData = power.levels.find((l) => l.level === level);
        return levelData?.cost || 0;
      }
      if (power.costType === "perLevel") {
        return (power.cost || 0) * level;
      }
      return power.cost || 0;
    },
    []
  );

  // Check if power is already selected
  const isPowerSelected = useCallback(
    (powerId: string) => selectedPowers.some((p) => p.catalogId === powerId),
    [selectedPowers]
  );

  // Add power
  const handleAddPower = useCallback(() => {
    if (!selectedPowerId) return;

    const power = getPowerById(selectedPowerId);
    if (!power) return;

    const cost = calculateCost(power, selectedLevel);
    if (cost > ppRemaining) return;

    // Check if already selected (for non-multiple powers)
    if (isPowerSelected(selectedPowerId) && !power.requiresSkill && !power.requiresAttribute) {
      return;
    }

    const newPower: AdeptPower = {
      id: `${selectedPowerId}-${Date.now()}`,
      catalogId: selectedPowerId,
      name: power.name,
      rating: power.costType === "perLevel" || power.costType === "table" ? selectedLevel : undefined,
      powerPointCost: cost,
      specification: selectedSpec || undefined,
    };

    const updatedPowers = [...selectedPowers, newPower];

    updateState({
      selections: {
        ...state.selections,
        adeptPowers: updatedPowers,
      },
      budgets: {
        ...state.budgets,
        "power-points-spent": ppSpent + cost,
      },
    });

    setSelectedPowerId(null);
    setSelectedLevel(1);
    setSelectedSpec("");
  }, [
    selectedPowerId,
    selectedLevel,
    selectedSpec,
    getPowerById,
    calculateCost,
    ppRemaining,
    isPowerSelected,
    selectedPowers,
    ppSpent,
    state.selections,
    state.budgets,
    updateState,
  ]);

  // Remove power
  const handleRemovePower = useCallback(
    (powerId: string) => {
      const power = selectedPowers.find((p) => p.id === powerId);
      if (!power) return;

      const updatedPowers = selectedPowers.filter((p) => p.id !== powerId);

      updateState({
        selections: {
          ...state.selections,
          adeptPowers: updatedPowers,
        },
        budgets: {
          ...state.budgets,
          "power-points-spent": ppSpent - power.powerPointCost,
        },
      });
    },
    [selectedPowers, ppSpent, state.selections, state.budgets, updateState]
  );

  // Purchase power point with karma (mystic adepts only)
  const handlePurchasePowerPoint = useCallback(() => {
    if (!isMysticAdept) return;
    if (karmaRemaining < POWER_POINT_KARMA_COST) return;
    if (powerPointBudget >= magicRating) return;

    const newKarmaSpent = karmaSpentPowerPoints + POWER_POINT_KARMA_COST;

    updateState({
      budgets: {
        ...state.budgets,
        "karma-spent-power-points": newKarmaSpent,
      },
    });
  }, [
    isMysticAdept,
    karmaRemaining,
    powerPointBudget,
    magicRating,
    karmaSpentPowerPoints,
    state.budgets,
    updateState,
  ]);

  // Handle mystic adept PP allocation
  const handleAllocationChange = useCallback(
    (value: number) => {
      updateState({
        selections: {
          ...state.selections,
          "power-points-allocation": value,
        },
      });
    },
    [state.selections, updateState]
  );

  // Get selected power data
  const selectedPowerData = selectedPowerId ? getPowerById(selectedPowerId) : null;
  const selectedCost = selectedPowerData ? calculateCost(selectedPowerData, selectedLevel) : 0;

  // Validation status
  const validationStatus = useMemo(() => {
    if (!canHaveAdeptPowers) return "pending";
    if (selectedPowers.length > 0) return "valid";
    if (powerPointBudget > 0) return "warning";
    return "pending";
  }, [canHaveAdeptPowers, selectedPowers.length, powerPointBudget]);

  // Check if path supports adept powers
  if (!canHaveAdeptPowers) {
    return (
      <CreationCard title="Adept Powers" description="Select powers" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select Adept or Mystic Adept path first
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Adept Powers"
      description={`${ppRemaining.toFixed(1)} / ${powerPointBudget} PP remaining`}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Power Point Budget */}
        <BudgetIndicator
          label="Power Points"
          remaining={ppRemaining}
          total={powerPointBudget}
          compact
        />

        {/* Mystic Adept Allocation */}
        {isMysticAdept && (
          <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-amber-800 dark:text-amber-200">
                PP Allocation
              </span>
              <span className="text-amber-600 dark:text-amber-400">
                {basePowerPointBudget} / {magicRating}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={magicRating}
              step={1}
              value={basePowerPointBudget}
              onChange={(e) => handleAllocationChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-amber-600 dark:text-amber-400">
              <span>Spells</span>
              <span>Powers</span>
            </div>

            {/* Karma purchase */}
            {karmaPurchasedPP > 0 && (
              <div className="text-xs text-amber-600 dark:text-amber-400">
                +{karmaPurchasedPP} PP from karma ({karmaSpentPowerPoints} karma)
              </div>
            )}
            {powerPointBudget < magicRating && karmaRemaining >= POWER_POINT_KARMA_COST && (
              <button
                onClick={handlePurchasePowerPoint}
                className="flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300"
              >
                <Plus className="h-3 w-3" />
                +1 PP ({POWER_POINT_KARMA_COST} karma)
              </button>
            )}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search powers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Power list */}
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {filteredPowers.slice(0, 20).map((power) => {
            const isSelected = selectedPowerId === power.id;
            const alreadyHas = isPowerSelected(power.id);
            const baseCost =
              power.costType === "table"
                ? power.levels?.[0]?.cost || 0
                : power.cost || 0;

            return (
              <button
                key={power.id}
                onClick={() => {
                  setSelectedPowerId(isSelected ? null : power.id);
                  setSelectedLevel(1);
                  setSelectedSpec("");
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                  isSelected
                    ? "bg-violet-50 ring-1 ring-violet-300 dark:bg-violet-900/30 dark:ring-violet-700"
                    : alreadyHas
                    ? "bg-emerald-50/50 dark:bg-emerald-900/20"
                    : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                }`}
              >
                <div>
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">{power.name}</span>
                  {power.activation && (
                    <span className="ml-1 text-[10px] text-zinc-400">({power.activation})</span>
                  )}
                </div>
                <span className="rounded bg-violet-100 px-1.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  {power.costType === "perLevel" ? `${baseCost}/lvl` : `${baseCost} PP`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected power config */}
        {selectedPowerData && (
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-900/20">
            <div className="mb-2 font-medium text-violet-900 dark:text-violet-100">
              {selectedPowerData.name}
            </div>

            {/* Level selector */}
            {(selectedPowerData.costType === "perLevel" ||
              selectedPowerData.costType === "table") && (
              <div className="mb-2">
                <div className="mb-1 text-xs text-violet-700 dark:text-violet-300">Level</div>
                <div className="flex gap-1">
                  {Array.from(
                    { length: selectedPowerData.maxLevel || 1 },
                    (_, i) => i + 1
                  ).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`flex h-6 w-6 items-center justify-center rounded text-xs font-medium ${
                        selectedLevel >= lvl
                          ? "bg-violet-500 text-white"
                          : "bg-white text-zinc-600 hover:bg-violet-100 dark:bg-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Attribute/Skill selector */}
            {selectedPowerData.requiresAttribute && selectedPowerData.validAttributes && (
              <div className="mb-2">
                <div className="mb-1 text-xs text-violet-700 dark:text-violet-300">Attribute</div>
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                >
                  <option value="">Select...</option>
                  {selectedPowerData.validAttributes.map((attr) => (
                    <option key={attr} value={attr}>
                      {attr.charAt(0).toUpperCase() + attr.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedPowerData.requiresSkill && selectedPowerData.validSkills && (
              <div className="mb-2">
                <div className="mb-1 text-xs text-violet-700 dark:text-violet-300">Skill</div>
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                >
                  <option value="">Select...</option>
                  {selectedPowerData.validSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Cost and add button */}
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  selectedCost > ppRemaining
                    ? "text-red-600 dark:text-red-400"
                    : "text-violet-700 dark:text-violet-300"
                }`}
              >
                {selectedCost} PP
              </span>
              <button
                onClick={handleAddPower}
                disabled={
                  selectedCost > ppRemaining ||
                  (selectedPowerData.requiresAttribute && !selectedSpec) ||
                  (selectedPowerData.requiresSkill && !selectedSpec)
                }
                className="flex items-center gap-1 rounded bg-violet-500 px-3 py-1 text-sm font-medium text-white hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
          </div>
        )}

        {/* Selected powers */}
        {selectedPowers.length > 0 && (
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Selected Powers ({selectedPowers.length})
            </h4>
            <div className="mt-2 space-y-1">
              {selectedPowers.map((power) => (
                <div
                  key={power.id}
                  className="flex items-center justify-between rounded bg-white px-2 py-1 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-violet-500" />
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">
                      {power.name}
                      {power.rating && ` ${power.rating}`}
                      {power.specification && ` (${power.specification})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">
                      {power.powerPointCost} PP
                    </span>
                    <button
                      onClick={() => handleRemovePower(power.id)}
                      className="text-zinc-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CreationCard>
  );
}
