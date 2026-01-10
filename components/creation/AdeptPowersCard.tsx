"use client";

/**
 * AdeptPowersCard
 *
 * Card for adept power selection in sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - Progress bar for power point budget
 * - Power list with levels and PP costs
 * - Mystic Adept PP allocation slider
 * - Karma purchase for additional PP
 * - Modal-style power selection with search
 * - Power rows with +/- level controls
 */

import { useMemo, useCallback, useState } from "react";
import { useAdeptPowers, usePriorityTable } from "@/lib/rules";
import type { CreationState, AdeptPower } from "@/lib/types";
import type { AdeptPowerCatalogItem } from "@/lib/rules/loader-types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "./shared";
import { Lock, Search, Plus, Minus, X, Zap, AlertTriangle } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const POWER_POINT_KARMA_COST = 5;

// Paths that can have adept powers
const ADEPT_PATHS = ["adept", "mystic-adept"];

// =============================================================================
// TYPES
// =============================================================================

interface AdeptPowersCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// BUDGET PROGRESS BAR COMPONENT
// =============================================================================

function BudgetProgressBar({
  label,
  description,
  spent,
  total,
  source,
  displayFormat = "decimal",
}: {
  label: string;
  description: string;
  spent: number;
  total: number;
  source: string;
  displayFormat?: "decimal" | "integer";
}) {
  const remaining = total - spent;
  const percentage = Math.min(100, (spent / total) * 100);
  const isComplete = remaining <= 0;

  const formatValue = (value: number) => {
    return displayFormat === "decimal" ? value.toFixed(2) : Math.round(value).toString();
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </div>
        <div className={`text-lg font-bold ${
          isComplete
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-zinc-900 dark:text-zinc-100"
        }`}>
          {formatValue(remaining)}
        </div>
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {description}
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {source}
        <span className="float-right">
          of {formatValue(total)} remaining
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all ${
            isComplete
              ? "bg-emerald-500"
              : "bg-violet-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// POWER ROW COMPONENT
// =============================================================================

function PowerRow({
  power,
  rating,
  specification,
  powerPointCost,
  maxLevel,
  isLeveled,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  power: AdeptPowerCatalogItem;
  rating?: number;
  specification?: string;
  powerPointCost: number;
  maxLevel?: number;
  isLeveled: boolean;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove: () => void;
}) {
  const canIncrease = isLeveled && rating !== undefined && maxLevel !== undefined && rating < maxLevel;
  const canDecrease = isLeveled && rating !== undefined && rating > 1;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-violet-500" />
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {power.name}
              {rating && isLeveled && ` ${rating}`}
              {specification && ` (${specification})`}
            </span>
          </div>

          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {power.description}
          </div>

          {power.activation && (
            <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Activation: {power.activation}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* PP Cost badge */}
          <span className="rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
            {powerPointCost.toFixed(2)} PP
          </span>

          {/* Level controls for leveled powers */}
          {isLeveled && rating !== undefined && (
            <div className="flex items-center gap-1">
              <button
                onClick={onDecrease}
                disabled={!canDecrease}
                aria-label={`Decrease ${power.name} level`}
                className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                  canDecrease
                    ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
              >
                <Minus className="h-3 w-3" aria-hidden="true" />
              </button>
              <div className="flex h-6 w-8 items-center justify-center rounded bg-zinc-100 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {rating}
              </div>
              <button
                onClick={onIncrease}
                disabled={!canIncrease}
                aria-label={`Increase ${power.name} level`}
                className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                  canIncrease
                    ? "bg-violet-500 text-white hover:bg-violet-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Remove button */}
          <button
            onClick={onRemove}
            aria-label={`Remove ${power.name}`}
            className="text-xs text-zinc-400 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AdeptPowersCard({ state, updateState }: AdeptPowersCardProps) {
  const adeptPowersCatalog = useAdeptPowers();
  const priorityTable = usePriorityTable();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
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
    setShowAddModal(false);
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

  // Update power level
  const handleUpdateLevel = useCallback(
    (powerId: string, delta: number) => {
      const power = selectedPowers.find((p) => p.id === powerId);
      if (!power || power.rating === undefined) return;

      const catalogPower = getPowerById(power.catalogId);
      if (!catalogPower) return;

      const newLevel = power.rating + delta;
      if (newLevel < 1 || (catalogPower.maxLevel && newLevel > catalogPower.maxLevel)) return;

      const oldCost = power.powerPointCost;
      const newCost = calculateCost(catalogPower, newLevel);
      const costDiff = newCost - oldCost;

      if (costDiff > ppRemaining) return;

      const updatedPowers = selectedPowers.map((p) =>
        p.id === powerId
          ? { ...p, rating: newLevel, powerPointCost: newCost }
          : p
      );

      updateState({
        selections: {
          ...state.selections,
          adeptPowers: updatedPowers,
        },
        budgets: {
          ...state.budgets,
          "power-points-spent": ppSpent + costDiff,
        },
      });
    },
    [selectedPowers, getPowerById, calculateCost, ppRemaining, ppSpent, state.selections, state.budgets, updateState]
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

  // Power budget source
  const budgetSource = useMemo(() => {
    if (isMysticAdept) {
      return `${basePowerPointBudget} PP allocated${karmaPurchasedPP > 0 ? ` + ${karmaPurchasedPP} from karma` : ""}`;
    }
    return `From Magic ${magicRating}`;
  }, [isMysticAdept, basePowerPointBudget, karmaPurchasedPP, magicRating]);

  // Check if path supports adept powers
  if (!canHaveAdeptPowers) {
    return (
      <CreationCard title="Adept Powers" description="Not available" status="pending">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
            <Lock className="h-5 w-5 text-zinc-400" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No adept powers available — not an Adept or Mystic Adept
            </p>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Change your Magic/Resonance path to Adept or Mystic Adept to unlock Adept Powers.
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Adept Powers"
      description={`${ppRemaining.toFixed(2)} / ${powerPointBudget.toFixed(2)} PP remaining`}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Power Point Budget */}
        <BudgetProgressBar
          label="Power Points"
          description="Allocate power points to adept powers"
          spent={ppSpent}
          total={powerPointBudget}
          source={budgetSource}
          displayFormat="decimal"
        />

        {/* Mystic Adept Allocation */}
        {isMysticAdept && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  PP Allocation
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  Split Magic between spells and powers
                </div>
              </div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {basePowerPointBudget} / {magicRating}
              </div>
            </div>

            <div className="mt-3">
              <input
                type="range"
                min={0}
                max={magicRating}
                step={1}
                value={basePowerPointBudget}
                onChange={(e) => handleAllocationChange(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="mt-1 flex justify-between text-xs text-amber-600 dark:text-amber-400">
                <span>Spells ({magicRating - basePowerPointBudget})</span>
                <span>Powers ({basePowerPointBudget})</span>
              </div>
            </div>

            {/* Karma purchase */}
            {karmaPurchasedPP > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>
                  +{karmaPurchasedPP} PP from karma ({karmaSpentPowerPoints} karma spent)
                </span>
              </div>
            )}

            {powerPointBudget < magicRating && karmaRemaining >= POWER_POINT_KARMA_COST && (
              <button
                onClick={handlePurchasePowerPoint}
                className="mt-3 flex items-center gap-1 rounded bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-900/60"
              >
                <Plus className="h-3 w-3" />
                Purchase +1 PP ({POWER_POINT_KARMA_COST} karma)
              </button>
            )}
          </div>
        )}

        {/* Add button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 py-3 text-sm font-medium text-zinc-600 transition-colors hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-violet-600 dark:hover:bg-violet-900/20 dark:hover:text-violet-400"
        >
          <Plus className="h-4 w-4" />
          Add Adept Power
        </button>

        {/* Selected powers */}
        {selectedPowers.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Selected Powers ({selectedPowers.length})
            </h4>

            <div className="space-y-2">
              {selectedPowers.map((power) => {
                const catalogPower = getPowerById(power.catalogId);
                if (!catalogPower) return null;

                const isLeveled = catalogPower.costType === "perLevel" || catalogPower.costType === "table";

                return (
                  <PowerRow
                    key={power.id}
                    power={catalogPower}
                    rating={power.rating}
                    specification={power.specification}
                    powerPointCost={power.powerPointCost}
                    maxLevel={catalogPower.maxLevel}
                    isLeveled={isLeveled}
                    onIncrease={() => handleUpdateLevel(power.id, 1)}
                    onDecrease={() => handleUpdateLevel(power.id, -1)}
                    onRemove={() => handleRemovePower(power.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Summary footer */}
        {selectedPowers.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {ppSpent.toFixed(2)} PP spent
            </span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {ppRemaining.toFixed(2)} PP remaining
            </span>
          </div>
        )}

        {/* Add Power Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowAddModal(false);
                setSelectedPowerId(null);
                setSelectedLevel(1);
                setSelectedSpec("");
              }}
            />

            {/* Modal */}
            <div className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-violet-500" />
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    ADD ADEPT POWER
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedPowerId(null);
                    setSelectedLevel(1);
                    setSelectedSpec("");
                  }}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Budget info */}
              <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-violet-600 dark:text-violet-400">
                    {ppRemaining.toFixed(2)} PP remaining
                  </span>
                </p>
              </div>

              {/* Search */}
              <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search powers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Power list */}
              <div className="max-h-[40vh] overflow-y-auto p-4">
                <div className="space-y-2">
                  {filteredPowers.slice(0, 30).map((power) => {
                    const isSelected = selectedPowerId === power.id;
                    const alreadyHas = isPowerSelected(power.id);
                    const baseCost =
                      power.costType === "table"
                        ? power.levels?.[0]?.cost || 0
                        : power.cost || 0;
                    const costDisplay =
                      power.costType === "perLevel"
                        ? `${baseCost.toFixed(2)}/level`
                        : `${baseCost.toFixed(2)} PP`;

                    return (
                      <button
                        key={power.id}
                        onClick={() => {
                          setSelectedPowerId(isSelected ? null : power.id);
                          setSelectedLevel(1);
                          setSelectedSpec("");
                        }}
                        disabled={alreadyHas && !power.requiresSkill && !power.requiresAttribute}
                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all ${
                          isSelected
                            ? "bg-violet-50 ring-2 ring-violet-300 dark:bg-violet-900/30 dark:ring-violet-700"
                            : alreadyHas
                              ? "cursor-not-allowed bg-zinc-100 opacity-50 dark:bg-zinc-800"
                              : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              {power.name}
                            </span>
                            {alreadyHas && (
                              <span className="text-[10px] text-zinc-400">(already added)</span>
                            )}
                          </div>
                          <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                            {power.description}
                          </div>
                        </div>
                        <span className="shrink-0 rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                          {costDisplay}
                        </span>
                      </button>
                    );
                  })}

                  {filteredPowers.length === 0 && (
                    <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      No powers found matching your search
                    </div>
                  )}
                </div>
              </div>

              {/* Selected power configuration */}
              {selectedPowerData && (
                <div className="border-t border-zinc-200 bg-violet-50 p-4 dark:border-zinc-700 dark:bg-violet-900/20">
                  <div className="mb-3 font-medium text-violet-900 dark:text-violet-100">
                    Configure: {selectedPowerData.name}
                  </div>

                  {/* Level selector */}
                  {(selectedPowerData.costType === "perLevel" || selectedPowerData.costType === "table") && (
                    <div className="mb-3">
                      <div className="mb-1.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                        Level
                      </div>
                      <div className="flex gap-1">
                        {Array.from(
                          { length: selectedPowerData.maxLevel || 4 },
                          (_, i) => i + 1
                        ).map((lvl) => {
                          const lvlCost = calculateCost(selectedPowerData, lvl);
                          const canAfford = lvlCost <= ppRemaining;
                          return (
                            <button
                              key={lvl}
                              onClick={() => setSelectedLevel(lvl)}
                              disabled={!canAfford}
                              className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${
                                selectedLevel === lvl
                                  ? "bg-violet-500 text-white"
                                  : canAfford
                                    ? "bg-white text-zinc-600 hover:bg-violet-100 dark:bg-zinc-700 dark:text-zinc-300"
                                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                              }`}
                            >
                              {lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Attribute selector */}
                  {selectedPowerData.requiresAttribute && selectedPowerData.validAttributes && (
                    <div className="mb-3">
                      <div className="mb-1.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                        Attribute
                      </div>
                      <select
                        value={selectedSpec}
                        onChange={(e) => setSelectedSpec(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                      >
                        <option value="">Select attribute...</option>
                        {selectedPowerData.validAttributes.map((attr) => (
                          <option key={attr} value={attr}>
                            {attr.charAt(0).toUpperCase() + attr.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Skill selector */}
                  {selectedPowerData.requiresSkill && selectedPowerData.validSkills && (
                    <div className="mb-3">
                      <div className="mb-1.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                        Skill
                      </div>
                      <select
                        value={selectedSpec}
                        onChange={(e) => setSelectedSpec(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                      >
                        <option value="">Select skill...</option>
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
                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-sm font-medium ${
                      selectedCost > ppRemaining
                        ? "text-red-600 dark:text-red-400"
                        : "text-violet-700 dark:text-violet-300"
                    }`}>
                      Cost: {selectedCost.toFixed(2)} PP
                      {selectedCost > ppRemaining && " (insufficient PP)"}
                    </span>
                    <button
                      onClick={handleAddPower}
                      disabled={
                        selectedCost > ppRemaining ||
                        (selectedPowerData.requiresAttribute && !selectedSpec) ||
                        (selectedPowerData.requiresSkill && !selectedSpec)
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
                    >
                      <Plus className="h-4 w-4" />
                      Add Power
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              {!selectedPowerData && (
                <div className="flex items-center justify-end border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedPowerId(null);
                    }}
                    className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CreationCard>
  );
}
