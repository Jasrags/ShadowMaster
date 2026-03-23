"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { X, AlertTriangle } from "lucide-react";
import type {
  LifestyleModification,
  LifestyleSubscription,
  LifestyleComponentSelections,
  LifestyleEntertainmentOption,
} from "@/lib/types";
import { LifestyleModificationSelector } from "../shared/LifestyleModificationSelector";
import { LifestyleSubscriptionSelector } from "../shared/LifestyleSubscriptionSelector";
import { EntertainmentOptionSelector } from "../shared/EntertainmentOptionSelector";
import { Modal } from "./Modal";
import {
  useLifestyles,
  useEntertainmentOptions,
  useLifestyleModifications,
} from "@/lib/rules/RulesetContext";
import { calculateComponentLevelCost } from "@/lib/rules/lifestyle/cost";
import { calculatePointsSpent, validateComponentLevels } from "@/lib/rules/lifestyle/validation";
import type { LifestyleModalProps, NewLifestyleState } from "./types";

// =============================================================================
// COMPONENT LEVEL SLIDER
// =============================================================================

interface ComponentSliderProps {
  label: string;
  value: number;
  base: number;
  limit: number;
  onChange: (value: number) => void;
}

function ComponentSlider({ label, value, base, limit, onChange }: ComponentSliderProps) {
  const isAtLimit = value >= limit;
  const isAboveBase = value > base;

  return (
    <div className="flex items-center gap-3">
      <span className="w-32 text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
      <input
        type="range"
        min={base}
        max={limit}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-amber-500 dark:bg-zinc-700"
      />
      <span
        className={`min-w-[2.5rem] rounded px-1.5 py-0.5 text-center text-xs font-medium ${
          isAtLimit
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            : isAboveBase
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        }`}
      >
        {value}/{limit}
      </span>
    </div>
  );
}

// =============================================================================
// POINT BUDGET DISPLAY
// =============================================================================

interface PointBudgetProps {
  available: number;
  spent: number;
  basePoints: number;
  isDiceRoll: boolean;
}

function PointBudgetDisplay({ available, spent, basePoints, isDiceRoll }: PointBudgetProps) {
  const remaining = available - spent;
  const isOverBudget = remaining < 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Point Budget</span>
        {isDiceRoll && (
          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
            Base: {basePoints} (roll at play)
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="text-zinc-600 dark:text-zinc-400">
          Available:{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{available}</span>
        </div>
        <div className="text-zinc-600 dark:text-zinc-400">
          Spent: <span className="font-medium text-zinc-900 dark:text-zinc-100">{spent}</span>
        </div>
        <div
          className={`font-medium ${
            isOverBudget
              ? "text-red-600 dark:text-red-400"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          Remaining: {remaining}
        </div>
      </div>
      {isOverBudget && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertTriangle className="h-3 w-3" />
          Point budget exceeded
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN MODAL
// =============================================================================

export function LifestyleModal({
  isOpen,
  onClose,
  onSave,
  nuyenRemaining,
  initialData,
  isEditMode,
}: LifestyleModalProps) {
  const lifestyleCatalog = useLifestyles();
  const entertainmentCatalog = useEntertainmentOptions();
  const modificationsCatalog = useLifestyleModifications();

  const defaultFormState: NewLifestyleState = {
    type: "",
    location: "",
    customExpenses: 0,
    customIncome: 0,
    notes: "",
    modifications: [],
    subscriptions: [],
    prepaidMonths: 0,
  };

  const [formState, setFormState] = useState<NewLifestyleState>(initialData || defaultFormState);

  // Reset form when modal opens with initialData (for edit mode)
  const resetFormOnOpen = useCallback(() => {
    if (isOpen && initialData) {
      setFormState(initialData);
    } else if (isOpen && !initialData) {
      setFormState(defaultFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  useEffect(() => {
    resetFormOnOpen();
  }, [resetFormOnOpen]);

  const selectedLifestyle = lifestyleCatalog.find((l) => l.id === formState.type);
  const hasComponents = !!selectedLifestyle?.components;
  const hasPoints = selectedLifestyle?.points !== undefined;
  const isDiceRollPoints = typeof selectedLifestyle?.points === "string";
  const basePoints = typeof selectedLifestyle?.points === "number" ? selectedLifestyle.points : 0;

  // Initialize component selections when lifestyle type changes
  useEffect(() => {
    if (selectedLifestyle?.components && !formState.components) {
      setFormState((prev) => ({
        ...prev,
        components: {
          comfortsAndNecessities: selectedLifestyle.components!.comfortsAndNecessities.base,
          security: selectedLifestyle.components!.security.base,
          neighborhood: selectedLifestyle.components!.neighborhood.base,
        },
      }));
    } else if (!selectedLifestyle?.components && formState.components) {
      setFormState((prev) => ({
        ...prev,
        components: undefined,
        entertainmentOptions: undefined,
      }));
    }
  }, [selectedLifestyle, formState.components]);

  // Calculate costs using the expanded function
  const costBreakdown = useMemo(() => {
    if (!selectedLifestyle)
      return {
        baseCost: 0,
        componentCost: 0,
        entertainmentCost: 0,
        modificationCost: 0,
        subscriptionsCost: 0,
        totalCost: 0,
      };

    const baseCost = selectedLifestyle.monthlyCost;

    const componentCost =
      formState.components && selectedLifestyle.components
        ? calculateComponentLevelCost(selectedLifestyle, formState.components)
        : 0;

    const entertainmentCost = (formState.entertainmentOptions || []).reduce((sum, opt) => {
      const catalogItem = entertainmentCatalog.find((c) => c.id === opt.catalogId);
      return sum + (catalogItem?.monthlyCost ?? 0) * opt.quantity;
    }, 0);

    const modificationCost = formState.modifications.reduce((sum, mod) => {
      if (mod.modifierType === "percentage") {
        return sum + ((baseCost * mod.modifier) / 100) * (mod.type === "positive" ? 1 : -1);
      }
      return sum + mod.modifier * (mod.type === "positive" ? 1 : -1);
    }, 0);

    const subscriptionsCost = (formState.subscriptions || []).reduce(
      (sum, sub) => sum + sub.monthlyCost,
      0
    );

    const totalCost = Math.max(
      0,
      baseCost +
        componentCost +
        entertainmentCost +
        modificationCost +
        subscriptionsCost +
        formState.customExpenses -
        formState.customIncome
    );

    return {
      baseCost,
      componentCost,
      entertainmentCost,
      modificationCost,
      subscriptionsCost,
      totalCost,
    };
  }, [selectedLifestyle, formState, entertainmentCatalog]);

  // Point budget calculations
  const pointBudget = useMemo(() => {
    if (!selectedLifestyle || !hasPoints) return null;

    const selectedModCatalogItems = modificationsCatalog.filter((mc) =>
      formState.modifications.some((m) => m.catalogId === mc.id)
    );

    const pointsFromNegatives = selectedModCatalogItems.reduce(
      (sum, mod) => sum + (mod.pointsGranted ?? 0),
      0
    );
    const maxNegativePoints = basePoints * 2;
    const cappedNegativePoints = Math.min(pointsFromNegatives, maxNegativePoints);
    const pointsConsumedByPositives = selectedModCatalogItems.reduce(
      (sum, mod) => sum + (mod.pointsCost ?? 0),
      0
    );

    const available = basePoints + cappedNegativePoints - pointsConsumedByPositives;
    const spent = calculatePointsSpent({
      lifestyleData: selectedLifestyle,
      components: formState.components,
      entertainmentOptions: formState.entertainmentOptions,
      entertainmentCatalog,
    });
    const negativeCapExceeded = pointsFromNegatives > maxNegativePoints;

    return { available, spent, negativeCapExceeded };
  }, [
    selectedLifestyle,
    hasPoints,
    basePoints,
    formState,
    entertainmentCatalog,
    modificationsCatalog,
  ]);

  // Validation
  const componentValidation = useMemo(() => {
    if (!selectedLifestyle || !formState.components) return { valid: true, errors: [] };
    return validateComponentLevels(selectedLifestyle, formState.components);
  }, [selectedLifestyle, formState.components]);

  const canAfford = costBreakdown.totalCost <= nuyenRemaining;
  const pointsValid = !pointBudget || pointBudget.spent <= pointBudget.available;
  const canSave = formState.type && canAfford && componentValidation.valid && pointsValid;

  // Handlers
  const handleAddModification = (mod: LifestyleModification) => {
    setFormState({ ...formState, modifications: [...formState.modifications, mod] });
  };

  const handleRemoveModification = (index: number) => {
    setFormState({
      ...formState,
      modifications: formState.modifications.filter((_, i) => i !== index),
    });
  };

  const handleAddSubscription = (sub: LifestyleSubscription) => {
    setFormState({
      ...formState,
      subscriptions: [...(formState.subscriptions || []), sub],
    });
  };

  const handleRemoveSubscription = (index: number) => {
    setFormState({
      ...formState,
      subscriptions: (formState.subscriptions || []).filter((_, i) => i !== index),
    });
  };

  const handleComponentChange = (component: keyof LifestyleComponentSelections, value: number) => {
    if (!formState.components) return;
    setFormState({
      ...formState,
      components: { ...formState.components, [component]: value },
    });
  };

  const handleEntertainmentUpdate = (options: LifestyleEntertainmentOption[]) => {
    setFormState({ ...formState, entertainmentOptions: options });
  };

  const handleSave = () => {
    if (canSave) {
      onSave(formState);
      setFormState(defaultFormState);
      onClose();
    }
  };

  const handleClose = () => {
    setFormState(defaultFormState);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Lifestyle" : "New Lifestyle"}
    >
      <div className="space-y-5">
        {/* Lifestyle Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Lifestyle Type *
          </label>
          <select
            value={formState.type}
            onChange={(e) =>
              setFormState({
                ...formState,
                type: e.target.value,
                components: undefined,
                entertainmentOptions: undefined,
              })
            }
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="">Select a lifestyle...</option>
            {lifestyleCatalog.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.monthlyCost === 0 ? "Free" : `${l.monthlyCost.toLocaleString()}/month`}
                )
              </option>
            ))}
          </select>
          {/* Traveler note */}
          {formState.type === "traveler" && (
            <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
              Traveler lifestyle: points determined by 1D6+2 roll at play.
            </p>
          )}
          {/* Commercial note */}
          {formState.type === "commercial" && (
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              Commercial lifestyle: monthly cost may be reduced by Charisma + Etiquette.
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Location (Optional)
          </label>
          <input
            type="text"
            value={formState.location}
            onChange={(e) => setFormState({ ...formState, location: e.target.value })}
            placeholder="e.g., Downtown Seattle, Redmond Barrens"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Component Level Selectors (Run Faster expanded system) */}
        {hasComponents && selectedLifestyle?.components && formState.components && (
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Component Levels
            </label>
            <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
              <ComponentSlider
                label="Comforts & Necessities"
                value={formState.components.comfortsAndNecessities}
                base={selectedLifestyle.components.comfortsAndNecessities.base}
                limit={selectedLifestyle.components.comfortsAndNecessities.limit}
                onChange={(v) => handleComponentChange("comfortsAndNecessities", v)}
              />
              <ComponentSlider
                label="Security"
                value={formState.components.security}
                base={selectedLifestyle.components.security.base}
                limit={selectedLifestyle.components.security.limit}
                onChange={(v) => handleComponentChange("security", v)}
              />
              <ComponentSlider
                label="Neighborhood"
                value={formState.components.neighborhood}
                base={selectedLifestyle.components.neighborhood.base}
                limit={selectedLifestyle.components.neighborhood.limit}
                onChange={(v) => handleComponentChange("neighborhood", v)}
              />
            </div>
            {!componentValidation.valid && (
              <div className="mt-1 space-y-0.5">
                {componentValidation.errors.map((err) => (
                  <p key={err} className="text-xs text-red-600 dark:text-red-400">
                    {err}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Point Budget Display */}
        {hasPoints && pointBudget && (
          <PointBudgetDisplay
            available={pointBudget.available}
            spent={pointBudget.spent}
            basePoints={basePoints}
            isDiceRoll={isDiceRollPoints}
          />
        )}

        {/* Entertainment Options (only for expanded lifestyles) */}
        {hasComponents && formState.type && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Entertainment Options
              </label>
              <EntertainmentOptionSelector
                lifestyleId={formState.type}
                selectedOptions={formState.entertainmentOptions || []}
                onUpdate={handleEntertainmentUpdate}
              />
            </div>
            {(formState.entertainmentOptions || []).length > 0 ? (
              <div className="space-y-2">
                {(formState.entertainmentOptions || []).map((opt) => {
                  const catalogItem = entertainmentCatalog.find((c) => c.id === opt.catalogId);
                  return (
                    <div
                      key={opt.catalogId}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-900 dark:text-zinc-100">{opt.name}</span>
                        {opt.quantity > 1 && (
                          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                            ×{opt.quantity}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                          {catalogItem?.points ?? 0}pt | ¥
                          {((catalogItem?.monthlyCost ?? 0) * opt.quantity).toLocaleString()}/mo
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleEntertainmentUpdate(
                            (formState.entertainmentOptions || []).filter(
                              (o) => o.catalogId !== opt.catalogId
                            )
                          )
                        }
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No entertainment options added. Click &quot;+ Add Entertainment&quot; to browse
                available options.
              </p>
            )}
          </div>
        )}

        {/* Negative points cap warning */}
        {pointBudget?.negativeCapExceeded && (
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 dark:border-amber-700 dark:bg-amber-900/20">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-amber-700 dark:text-amber-300">
              Negative options exceed 2× starting points cap. Excess points are ignored.
            </span>
          </div>
        )}

        {/* Modifications */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Modifications
            </label>
            <LifestyleModificationSelector
              onAdd={handleAddModification}
              existingModifications={formState.modifications}
            />
          </div>
          {formState.modifications.length > 0 ? (
            <div className="space-y-2">
              {formState.modifications.map((mod, index) => (
                <div
                  key={mod.catalogId || index}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{mod.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        mod.type === "positive"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                      }`}
                    >
                      {mod.type === "positive" ? "+" : "-"}
                      {mod.modifierType === "percentage"
                        ? `${mod.modifier}%`
                        : `${mod.modifier.toLocaleString()}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveModification(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No modifications added. Click &quot;+ Add Modification&quot; to add lifestyle
              modifications.
            </p>
          )}
        </div>

        {/* Subscriptions */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Subscriptions
            </label>
            <LifestyleSubscriptionSelector
              onAdd={handleAddSubscription}
              existingSubscriptions={formState.subscriptions || []}
            />
          </div>
          {(formState.subscriptions || []).length > 0 ? (
            <div className="space-y-2">
              {(formState.subscriptions || []).map((sub, index) => (
                <div
                  key={sub.catalogId || index}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{sub.name}</span>
                    {sub.level && (
                      <span className="rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-300">
                        {sub.level}
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {sub.monthlyCost.toLocaleString()}/mo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubscription(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No subscriptions added. Click &quot;+ Add&quot; to add subscriptions like DocWagon or
              food service.
            </p>
          )}
        </div>

        {/* Prepaid Months */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Prepaid Months (Optional)
          </label>
          <input
            type="number"
            min="0"
            max="12"
            value={formState.prepaidMonths || 0}
            onChange={(e) =>
              setFormState({
                ...formState,
                prepaidMonths: Math.max(0, Math.min(12, parseInt(e.target.value) || 0)),
              })
            }
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Number of months paid in advance (0-12)
          </p>
        </div>

        {/* Custom Expenses / Income */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Custom Expenses (/month)
            </label>
            <input
              type="number"
              min="0"
              value={formState.customExpenses}
              onChange={(e) =>
                setFormState({ ...formState, customExpenses: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Custom Income (/month)
            </label>
            <input
              type="number"
              min="0"
              value={formState.customIncome}
              onChange={(e) =>
                setFormState({ ...formState, customIncome: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Notes (Optional)
          </label>
          <textarea
            value={formState.notes}
            onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
            placeholder="Additional notes about this lifestyle..."
            rows={2}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Cost Summary */}
        {formState.type && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Monthly Cost Summary
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Base ({selectedLifestyle?.name})</span>
                <span>{costBreakdown.baseCost.toLocaleString()}</span>
              </div>
              {costBreakdown.componentCost > 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Component Upgrades</span>
                  <span className="text-red-600 dark:text-red-400">
                    +{costBreakdown.componentCost.toLocaleString()}
                  </span>
                </div>
              )}
              {costBreakdown.entertainmentCost > 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Entertainment</span>
                  <span className="text-red-600 dark:text-red-400">
                    +{costBreakdown.entertainmentCost.toLocaleString()}
                  </span>
                </div>
              )}
              {costBreakdown.modificationCost !== 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Modifications</span>
                  <span
                    className={
                      costBreakdown.modificationCost > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {costBreakdown.modificationCost > 0 ? "+" : ""}
                    {costBreakdown.modificationCost.toLocaleString()}
                  </span>
                </div>
              )}
              {costBreakdown.subscriptionsCost > 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subscriptions</span>
                  <span className="text-red-600 dark:text-red-400">
                    +{costBreakdown.subscriptionsCost.toLocaleString()}
                  </span>
                </div>
              )}
              {formState.customExpenses > 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Custom Expenses</span>
                  <span className="text-red-600 dark:text-red-400">
                    +{formState.customExpenses.toLocaleString()}
                  </span>
                </div>
              )}
              {formState.customIncome > 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Custom Income</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    -{formState.customIncome.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-zinc-200 pt-1 font-medium text-zinc-900 dark:border-zinc-700 dark:text-zinc-100">
                <span>Total</span>
                <span className={!canAfford ? "text-red-600 dark:text-red-400" : ""}>
                  {costBreakdown.totalCost.toLocaleString()}/month
                </span>
              </div>
              {!canAfford && (
                <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Exceeds available budget ({nuyenRemaining.toLocaleString()} remaining)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              canSave
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            {isEditMode ? "Save Changes" : "Save Lifestyle"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
