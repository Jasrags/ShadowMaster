"use client";

/**
 * AdeptPowersCard
 *
 * Card for adept power selection in sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - Progress bar for power point budget
 * - Power list grouped by activation type with compact rows
 * - Mystic Adept PP allocation slider
 * - Karma purchase for additional PP
 * - Modal-style power selection with search
 * - Inline level controls for rated powers
 */

import { useMemo, useCallback, useState } from "react";
import { useAdeptPowers, usePriorityTable } from "@/lib/rules";
import type { CreationState, AdeptPower } from "@/lib/types";
import type { AdeptPowerCatalogItem } from "@/lib/rules/loader-types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator, SummaryFooter } from "./shared";
import { AdeptPowerModal, AdeptPowerListItem } from "./adept-powers";
import { Lock, Plus, AlertTriangle } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const POWER_POINT_KARMA_COST = 5;

// Paths that can have adept powers
const ADEPT_PATHS = ["adept", "mystic-adept"];

/** Display order for activation types */
const ACTIVATION_ORDER = ["free", "simple", "complex", "interrupt", "other"] as const;

/** Human-readable activation type labels */
const ACTIVATION_LABELS: Record<string, string> = {
  free: "Free Action",
  simple: "Simple Action",
  complex: "Complex Action",
  interrupt: "Interrupt Action",
  other: "Passive / Other",
};

// =============================================================================
// TYPES
// =============================================================================

interface AdeptPowersCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AdeptPowersCard({ state, updateState }: AdeptPowersCardProps) {
  const adeptPowersCatalog = useAdeptPowers();
  const priorityTable = usePriorityTable();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  const [showAddModal, setShowAddModal] = useState(false);

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
    ? (state.selections["power-points-allocation"] as number) || 0
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

  // Get power by ID
  const getPowerById = useCallback(
    (id: string) => adeptPowersCatalog.find((p) => p.id === id),
    [adeptPowersCatalog]
  );

  // Calculate cost for power at level
  const calculateCost = useCallback((power: AdeptPowerCatalogItem, level: number): number => {
    // New unified ratings approach - check ratings table first
    if (power.hasRating && power.ratings) {
      const ratingData = power.ratings[level];
      return ratingData?.powerPointCost || 0;
    }
    // Non-rated power - use top-level powerPointCost
    return power.powerPointCost || 0;
  }, []);

  // Check if power is already selected
  const isPowerSelected = useCallback(
    (powerId: string) => selectedPowers.some((p) => p.catalogId === powerId),
    [selectedPowers]
  );

  // Add power (called from modal)
  const handleAddPower = useCallback(
    (powerId: string, level: number, spec?: string) => {
      const power = getPowerById(powerId);
      if (!power) return;

      const cost = calculateCost(power, level);
      if (cost > ppRemaining) return;

      // Check if already selected (for non-multiple powers)
      if (isPowerSelected(powerId) && !power.requiresSkill && !power.requiresAttribute) {
        return;
      }

      const newPower: AdeptPower = {
        id: `${powerId}-${Date.now()}`,
        catalogId: powerId,
        name: power.name,
        rating: power.hasRating ? level : undefined,
        powerPointCost: cost,
        specification: spec,
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
    },
    [
      getPowerById,
      calculateCost,
      ppRemaining,
      isPowerSelected,
      selectedPowers,
      ppSpent,
      state.selections,
      state.budgets,
      updateState,
    ]
  );

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
      if (newLevel < 1 || (catalogPower.maxRating && newLevel > catalogPower.maxRating)) return;

      const oldCost = power.powerPointCost;
      const newCost = calculateCost(catalogPower, newLevel);
      const costDiff = newCost - oldCost;

      if (costDiff > ppRemaining) return;

      const updatedPowers = selectedPowers.map((p) =>
        p.id === powerId ? { ...p, rating: newLevel, powerPointCost: newCost } : p
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
    [
      selectedPowers,
      getPowerById,
      calculateCost,
      ppRemaining,
      ppSpent,
      state.selections,
      state.budgets,
      updateState,
    ]
  );

  // Update power specification (attribute or skill)
  const handleUpdateSpec = useCallback(
    (powerId: string, spec: string) => {
      const updatedPowers = selectedPowers.map((p) =>
        p.id === powerId ? { ...p, specification: spec || undefined } : p
      );

      updateState({
        selections: {
          ...state.selections,
          adeptPowers: updatedPowers,
        },
      });
    },
    [selectedPowers, state.selections, updateState]
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

  // Minimum PP allocation required to cover spent power points (for mystic adepts)
  const minPPAllocation = useMemo(() => {
    // Need at least enough whole PP to cover what's been spent
    // Subtract karma-purchased PP since those don't come from allocation
    const ppFromAllocationSpent = Math.max(0, ppSpent - karmaPurchasedPP);
    return Math.ceil(ppFromAllocationSpent);
  }, [ppSpent, karmaPurchasedPP]);

  // Group selected powers by activation type
  const powersGroupedByActivation = useMemo(() => {
    const groups: Record<string, Array<{ power: AdeptPower; catalog: AdeptPowerCatalogItem }>> = {};

    selectedPowers.forEach((power) => {
      const catalog = getPowerById(power.catalogId);
      if (!catalog) return;

      const activation = catalog.activation || "other";
      if (!groups[activation]) groups[activation] = [];
      groups[activation].push({ power, catalog });
    });

    return groups;
  }, [selectedPowers, getPowerById]);

  // Check if any powers are missing required specification
  const hasIncompletePowers = useMemo(() => {
    return selectedPowers.some((power) => {
      const catalog = getPowerById(power.catalogId);
      if (!catalog) return false;
      const needsSpec = catalog.requiresAttribute || catalog.requiresSkill;
      return needsSpec && !power.specification;
    });
  }, [selectedPowers, getPowerById]);

  // Handle mystic adept PP allocation
  const handleAllocationChange = useCallback(
    (value: number) => {
      // Don't allow reducing below what's needed for spent powers
      const clampedValue = Math.max(value, minPPAllocation);
      updateState({
        selections: {
          ...state.selections,
          "power-points-allocation": clampedValue,
        },
      });
    },
    [state.selections, updateState, minPPAllocation]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (!canHaveAdeptPowers) return "pending";
    if (hasIncompletePowers) return "warning";
    if (selectedPowers.length > 0) return "valid";
    if (powerPointBudget > 0) return "warning";
    return "pending";
  }, [canHaveAdeptPowers, hasIncompletePowers, selectedPowers.length, powerPointBudget]);

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
      headerAction={
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      }
    >
      <div className="space-y-4">
        {/* Power Point Budget */}
        <BudgetIndicator
          label="Power Points"
          tooltip={budgetSource}
          spent={ppSpent}
          total={powerPointBudget}
          mode="compact"
          displayFormat="decimal2"
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
                min={minPPAllocation}
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
              {minPPAllocation > 0 && (
                <div className="mt-1 text-[10px] text-amber-500 dark:text-amber-500">
                  Minimum {minPPAllocation} PP required for purchased powers
                </div>
              )}
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

        {/* Incomplete powers warning */}
        {hasIncompletePowers && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Selection Required
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Some powers require you to select which attribute or skill they affect.
            </p>
          </div>
        )}

        {/* Selected powers grouped by activation type */}
        {selectedPowers.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Selected Powers ({selectedPowers.length})
            </h4>

            {ACTIVATION_ORDER.filter((act) => powersGroupedByActivation[act]?.length > 0).map(
              (activation) => (
                <div key={activation}>
                  <h5 className="mb-2 text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
                    {ACTIVATION_LABELS[activation]}
                  </h5>
                  <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
                    {powersGroupedByActivation[activation].map(({ power, catalog }) => {
                      const isLeveled = catalog.hasRating === true;
                      const needsSpec = !!(
                        (catalog.requiresAttribute || catalog.requiresSkill) &&
                        !power.specification
                      );
                      const specType = catalog.requiresSkill
                        ? "skill"
                        : catalog.requiresAttribute
                          ? "attribute"
                          : undefined;
                      const validSpecs = catalog.requiresSkill
                        ? catalog.validSkills
                        : catalog.requiresAttribute
                          ? catalog.validAttributes
                          : undefined;

                      // Calculate if level can be changed
                      const canIncrease =
                        isLeveled &&
                        power.rating !== undefined &&
                        catalog.maxRating !== undefined &&
                        power.rating < catalog.maxRating &&
                        calculateCost(catalog, power.rating + 1) - power.powerPointCost <=
                          ppRemaining;
                      const canDecrease =
                        isLeveled && power.rating !== undefined && power.rating > 1;

                      return (
                        <AdeptPowerListItem
                          key={power.id}
                          displayName={power.name}
                          activation={activation}
                          powerPointCost={power.powerPointCost}
                          isLeveled={isLeveled}
                          level={power.rating}
                          maxLevel={catalog.maxRating}
                          canIncrease={canIncrease}
                          canDecrease={canDecrease}
                          onIncrease={() => handleUpdateLevel(power.id, 1)}
                          onDecrease={() => handleUpdateLevel(power.id, -1)}
                          needsSpec={needsSpec}
                          specification={power.specification}
                          specType={specType}
                          validSpecs={validSpecs}
                          onSpecChange={(spec) => handleUpdateSpec(power.id, spec)}
                          onRemove={() => handleRemovePower(power.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Empty state */}
        {selectedPowers.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">No adept powers selected</p>
          </div>
        )}

        {/* Footer Summary */}
        <SummaryFooter
          count={selectedPowers.length}
          total={`${ppSpent.toFixed(2)} PP`}
          label="power"
        />

        {/* Add Power Modal */}
        <AdeptPowerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPower}
          allPowers={adeptPowersCatalog}
          ppRemaining={ppRemaining}
          selectedPowers={selectedPowers}
          isPowerSelected={isPowerSelected}
          calculateCost={calculateCost}
        />
      </div>
    </CreationCard>
  );
}
