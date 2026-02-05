"use client";

/**
 * DrugsPanel
 *
 * Card for drugs and toxins purchasing in sheet-driven creation.
 * Combines both categories into a single panel with:
 * - Separate drug and toxin sections
 * - Combined purchase modal with tab switching
 * - Shared nuyen budget via useCreationBudgets()
 * - Karma-to-nuyen conversion for budget overflow
 */

import { useMemo, useCallback, useState } from "react";
import { type DrugCatalogItemData, type ToxinCatalogItemData } from "@/lib/rules/RulesetContext";
import type { CreationState, GearItem } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  EmptyState,
  SummaryFooter,
  KarmaConversionModal,
  useKarmaConversionPrompt,
  LegalityWarnings,
} from "../shared";
import { DrugRow } from "./DrugRow";
import { ToxinRow } from "./ToxinRow";
import { DrugsPurchaseModal } from "./DrugsPurchaseModal";
import { Lock, Plus, Pill, FlaskConical } from "lucide-react";
import { InfoTooltip } from "@/components/ui";

// =============================================================================
// CONSTANTS
// =============================================================================

const KARMA_TO_NUYEN_RATE = 2000;

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// =============================================================================
// TYPES
// =============================================================================

interface DrugsPanelProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DrugsPanel({ state, updateState }: DrugsPanelProps) {
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // Get selected items from state
  const selectedDrugs = useMemo(
    () => (state.selections?.drugs || []) as GearItem[],
    [state.selections?.drugs]
  );

  const selectedToxins = useMemo(
    () => (state.selections?.toxins || []) as GearItem[],
    [state.selections?.toxins]
  );

  const totalItems = selectedDrugs.length + selectedToxins.length;

  // Karma-to-nuyen conversion
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const karmaRemaining = karmaBudget?.remaining || 0;

  // Calculate budget (shared with other panels)
  const baseNuyen = nuyenBudget?.total || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Use centralized nuyen spent from budget context
  const totalSpent = nuyenBudget?.spent || 0;
  const remaining = totalNuyen - totalSpent;
  const isOverBudget = remaining < 0;

  // Local cost for footer
  const drugsSpent = selectedDrugs.reduce((sum, d) => sum + d.cost * d.quantity, 0);
  const toxinsSpent = selectedToxins.reduce((sum, t) => sum + t.cost * t.quantity, 0);
  const localSpent = drugsSpent + toxinsSpent;

  // Karma conversion hook
  const handleKarmaConvert = useCallback(
    (newTotalConversion: number) => {
      updateState({
        budgets: {
          ...state.budgets,
          "karma-spent-gear": newTotalConversion,
        },
      });
    },
    [state.budgets, updateState]
  );

  const karmaConversionPrompt = useKarmaConversionPrompt({
    remaining,
    karmaRemaining,
    currentConversion: karmaConversion,
    onConvert: handleKarmaConvert,
  });

  // Add drug (actual implementation)
  const actuallyAddDrug = useCallback(
    (drugData: DrugCatalogItemData, quantity: number) => {
      const newDrug: GearItem = {
        id: `${drugData.id}-${Date.now()}`,
        name: drugData.name,
        category: "drug",
        cost: drugData.cost,
        availability: drugData.availability,
        legality: drugData.legality,
        quantity,
        capacityUsed: 0,
        modifications: [],
        metadata: {
          vector: drugData.vector,
          speed: drugData.speed,
          duration: drugData.duration,
          addictionType: drugData.addictionType,
          addictionRating: drugData.addictionRating,
          addictionThreshold: drugData.addictionThreshold,
          activeEffects: drugData.effects.active,
          crashEffects: drugData.effects.crash,
          description: drugData.description,
        },
      };

      updateState({
        selections: {
          ...state.selections,
          drugs: [...selectedDrugs, newDrug],
        },
      });
    },
    [selectedDrugs, state.selections, updateState]
  );

  // Add drug with karma conversion prompt
  const addDrug = useCallback(
    (drugData: DrugCatalogItemData, quantity: number) => {
      const totalCost = drugData.cost * quantity;

      if (totalCost <= remaining) {
        actuallyAddDrug(drugData, quantity);
        return;
      }

      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemName = quantity > 1 ? `${drugData.name} x${quantity}` : drugData.name;
        karmaConversionPrompt.promptConversion(itemName, totalCost, () => {
          actuallyAddDrug(drugData, quantity);
        });
        return;
      }
    },
    [remaining, actuallyAddDrug, karmaConversionPrompt]
  );

  // Add toxin (actual implementation)
  const actuallyAddToxin = useCallback(
    (toxinData: ToxinCatalogItemData, quantity: number) => {
      const newToxin: GearItem = {
        id: `${toxinData.id}-${Date.now()}`,
        name: toxinData.name,
        category: "toxin",
        cost: toxinData.cost,
        availability: toxinData.availability,
        legality: toxinData.legality,
        quantity,
        capacityUsed: 0,
        modifications: [],
        metadata: {
          vector: toxinData.vector,
          speed: toxinData.speed,
          power: toxinData.power,
          penetration: toxinData.penetration,
          effects: toxinData.effects,
          duration: toxinData.duration,
          description: toxinData.description,
        },
      };

      updateState({
        selections: {
          ...state.selections,
          toxins: [...selectedToxins, newToxin],
        },
      });
    },
    [selectedToxins, state.selections, updateState]
  );

  // Add toxin with karma conversion prompt
  const addToxin = useCallback(
    (toxinData: ToxinCatalogItemData, quantity: number) => {
      const totalCost = toxinData.cost * quantity;

      if (totalCost <= remaining) {
        actuallyAddToxin(toxinData, quantity);
        return;
      }

      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemName = quantity > 1 ? `${toxinData.name} x${quantity}` : toxinData.name;
        karmaConversionPrompt.promptConversion(itemName, totalCost, () => {
          actuallyAddToxin(toxinData, quantity);
        });
        return;
      }
    },
    [remaining, actuallyAddToxin, karmaConversionPrompt]
  );

  // Remove handlers
  const removeDrug = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          drugs: selectedDrugs.filter((d) => d.id !== id),
        },
      });
    },
    [selectedDrugs, state.selections, updateState]
  );

  const removeToxin = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          toxins: selectedToxins.filter((t) => t.id !== id),
        },
      });
    },
    [selectedToxins, state.selections, updateState]
  );

  // Combine for legality warnings
  const allItems = useMemo(
    () => [...selectedDrugs, ...selectedToxins],
    [selectedDrugs, selectedToxins]
  );

  // Purchased catalog IDs for strikethrough display
  const purchasedDrugIds = useMemo(
    () =>
      selectedDrugs.map((d) => {
        const id = d.id || "";
        const lastHyphen = id.lastIndexOf("-");
        return lastHyphen > 0 ? id.slice(0, lastHyphen) : id;
      }),
    [selectedDrugs]
  );

  const purchasedToxinIds = useMemo(
    () =>
      selectedToxins.map((t) => {
        const id = t.id || "";
        const lastHyphen = id.lastIndexOf("-");
        return lastHyphen > 0 ? id.slice(0, lastHyphen) : id;
      }),
    [selectedToxins]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (isOverBudget) return "error";
    if (totalItems > 0) return "valid";
    return "pending";
  }, [isOverBudget, totalItems]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard title="Drugs & Toxins" description="Purchase consumables" status="pending">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
            <Lock className="h-5 w-5 text-zinc-400" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Set priorities first</p>
          </div>
        </div>
      </CreationCard>
    );
  }

  return (
    <>
      <CreationCard
        title="Drugs & Toxins"
        status={validationStatus}
        headerAction={
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        }
      >
        <div className="space-y-3">
          {/* Nuyen Budget Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                <span>Nuyen</span>
                <InfoTooltip content="Total nuyen spent on all gear" label="Nuyen budget info" />
                {karmaConversion > 0 && (
                  <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                    (+{(karmaConversion * KARMA_TO_NUYEN_RATE).toLocaleString()}¥ karma)
                  </span>
                )}
              </span>
              <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(totalSpent)} / {formatCurrency(totalNuyen)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-full transition-all ${isOverBudget ? "bg-red-500" : "bg-emerald-500"}`}
                style={{
                  width: `${Math.min(100, (totalSpent / totalNuyen) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Legality Warnings */}
          <LegalityWarnings items={allItems} />

          {/* Selected Items */}
          {totalItems > 0 ? (
            <div className="space-y-4">
              {/* Drugs Section */}
              {selectedDrugs.length > 0 && (
                <div>
                  <h5 className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
                    <Pill className="h-3.5 w-3.5" />
                    Drugs ({selectedDrugs.length})
                  </h5>
                  <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
                    {selectedDrugs.map((drug) => (
                      <DrugRow key={drug.id} drug={drug} onRemove={removeDrug} />
                    ))}
                  </div>
                </div>
              )}

              {/* Toxins Section */}
              {selectedToxins.length > 0 && (
                <div>
                  <h5 className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
                    <FlaskConical className="h-3.5 w-3.5" />
                    Toxins ({selectedToxins.length})
                  </h5>
                  <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
                    {selectedToxins.map((toxin) => (
                      <ToxinRow key={toxin.id} toxin={toxin} onRemove={removeToxin} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState message="No drugs or toxins purchased" />
          )}

          {/* Footer Summary */}
          <SummaryFooter count={totalItems} total={localSpent} format="currency" />
        </div>
      </CreationCard>

      {/* Purchase Modal */}
      <DrugsPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        remaining={remaining}
        onPurchaseDrug={addDrug}
        onPurchaseToxin={addToxin}
        purchasedDrugIds={purchasedDrugIds}
        purchasedToxinIds={purchasedToxinIds}
      />

      {/* Karma Conversion Modal */}
      <KarmaConversionModal
        isOpen={karmaConversionPrompt.modalState.isOpen}
        onClose={karmaConversionPrompt.closeModal}
        onConfirm={karmaConversionPrompt.confirmConversion}
        itemName={karmaConversionPrompt.modalState.itemName}
        itemCost={karmaConversionPrompt.modalState.itemCost}
        currentRemaining={karmaConversionPrompt.currentRemaining}
        karmaToConvert={karmaConversionPrompt.modalState.karmaToConvert}
        karmaAvailable={karmaConversionPrompt.karmaAvailable}
        currentKarmaConversion={karmaConversionPrompt.currentKarmaConversion}
        maxKarmaConversion={karmaConversionPrompt.maxKarmaConversion}
      />
    </>
  );
}
