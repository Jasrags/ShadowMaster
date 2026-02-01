"use client";

/**
 * MatrixGearCard
 *
 * Card for purchasing matrix gear (commlinks, cyberdecks, software) during character creation.
 * Follows the WeaponsPanel category grouping pattern with:
 * - Nuyen budget bar at top
 * - Single Add button opening unified modal
 * - Items grouped by category (Commlinks, Cyberdecks, Software)
 * - Legality warnings
 * - Modal-driven selection with bulk-add support
 *
 * Shares budget with other gear panels via state.budgets["nuyen"]
 */

import { useMemo, useCallback, useState } from "react";
import {
  useCommlinks,
  useCyberdecks,
  type CommlinkData,
  type CyberdeckData,
} from "@/lib/rules/RulesetContext";
import type {
  CreationState,
  CharacterCommlink,
  CharacterCyberdeck,
  CharacterDataSoftware,
} from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, KarmaConversionModal, useKarmaConversionPrompt } from "../shared";
import { MatrixGearModal } from "./MatrixGearModal";
import {
  Lock,
  Plus,
  Smartphone,
  Cpu,
  Database,
  Map,
  ShoppingCart,
  GraduationCap,
  AlertTriangle,
  X,
} from "lucide-react";
import { InfoTooltip } from "@/components/ui";

type MatrixGearCategory = "commlinks" | "cyberdecks" | "software";

// =============================================================================
// CONSTANTS
// =============================================================================

const KARMA_TO_NUYEN_RATE = 2000;

// Category labels for grouped display
const MATRIX_CATEGORY_LABELS: Record<MatrixGearCategory, string> = {
  commlinks: "Commlinks",
  cyberdecks: "Cyberdecks",
  software: "Software",
};

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

interface MatrixGearCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// COMMLINK ROW
// =============================================================================

function CommlinkRow({
  commlink,
  onRemove,
}: {
  commlink: CharacterCommlink;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 py-2">
      <Smartphone className="h-4 w-4 shrink-0 text-cyan-500" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {commlink.customName || commlink.name}
          </span>
          <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[10px] font-medium text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400">
            DR {commlink.deviceRating}
          </span>
        </div>
      </div>
      <span className="shrink-0 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {formatCurrency(commlink.cost)}¥
      </span>
      <button
        onClick={() => onRemove(commlink.id || commlink.catalogId)}
        className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// =============================================================================
// CYBERDECK ROW
// =============================================================================

function CyberdeckRow({
  cyberdeck,
  onRemove,
}: {
  cyberdeck: CharacterCyberdeck;
  onRemove: (id: string) => void;
}) {
  const attrs = cyberdeck.currentConfig;
  const asdf = `${attrs.attack}/${attrs.sleaze}/${attrs.dataProcessing}/${attrs.firewall}`;

  return (
    <div className="flex items-center gap-2 py-2">
      <Cpu className="h-4 w-4 shrink-0 text-purple-500" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {cyberdeck.customName || cyberdeck.name}
          </span>
          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
            DR {cyberdeck.deviceRating}
          </span>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          ASDF: {asdf} | Programs: {cyberdeck.programSlots}
        </div>
      </div>
      <span className="shrink-0 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {formatCurrency(cyberdeck.cost)}¥
      </span>
      <button
        onClick={() => onRemove(cyberdeck.id || cyberdeck.catalogId)}
        className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// =============================================================================
// DATA SOFTWARE ROW
// =============================================================================

const SOFTWARE_ICONS = {
  datasoft: Database,
  mapsoft: Map,
  shopsoft: ShoppingCart,
  tutorsoft: GraduationCap,
} as const;

const SOFTWARE_COLORS = {
  datasoft: "text-blue-500",
  mapsoft: "text-green-500",
  shopsoft: "text-amber-500",
  tutorsoft: "text-purple-500",
} as const;

function DataSoftwareRow({
  software,
  onRemove,
}: {
  software: CharacterDataSoftware;
  onRemove: (id: string) => void;
}) {
  const Icon = SOFTWARE_ICONS[software.type];
  const color = SOFTWARE_COLORS[software.type];

  return (
    <div className="flex items-center gap-2 py-2">
      <Icon className={`h-4 w-4 shrink-0 ${color}`} />
      <div className="min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {software.displayName}
        </span>
      </div>
      <span className="shrink-0 text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {formatCurrency(software.cost)}¥
      </span>
      <button
        onClick={() => onRemove(software.id)}
        className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MatrixGearCard({ state, updateState }: MatrixGearCardProps) {
  const commlinksCatalog = useCommlinks();
  const cyberdecksCatalog = useCyberdecks();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  const [isMatrixGearModalOpen, setIsMatrixGearModalOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState<MatrixGearCategory>("commlinks");

  // Get selected items from state
  const selectedCommlinks = useMemo(
    () => (state.selections?.commlinks || []) as CharacterCommlink[],
    [state.selections?.commlinks]
  );

  const selectedCyberdecks = useMemo(
    () => (state.selections?.cyberdecks || []) as CharacterCyberdeck[],
    [state.selections?.cyberdecks]
  );

  const selectedSoftware = useMemo(
    () => (state.selections?.software || []) as CharacterDataSoftware[],
    [state.selections?.software]
  );

  // Group items by category for display
  const matrixGearByCategory = useMemo(
    () => ({
      commlinks: selectedCommlinks,
      cyberdecks: selectedCyberdecks,
      software: selectedSoftware,
    }),
    [selectedCommlinks, selectedCyberdecks, selectedSoftware]
  );

  // Total items across all categories
  const totalItems = selectedCommlinks.length + selectedCyberdecks.length + selectedSoftware.length;

  // Check if character has a device to run software
  const hasCompatibleDevice = selectedCommlinks.length > 0 || selectedCyberdecks.length > 0;

  // Calculate budget (shared with other gear panels)
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const baseNuyen = nuyenBudget?.total || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate total spent across all gear categories
  const selectedGear = (state.selections?.gear || []) as Array<{ cost: number; quantity: number }>;
  const selectedWeapons = (state.selections?.weapons || []) as Array<{
    cost: number;
    quantity: number;
    modifications?: Array<{ cost: number }>;
    purchasedAmmunition?: Array<{ cost: number; quantity: number }>;
  }>;
  const selectedArmor = (state.selections?.armor || []) as Array<{
    cost: number;
    quantity: number;
  }>;
  const selectedFoci = (state.selections?.foci || []) as Array<{ cost: number }>;
  const selectedCyberware = (state.selections?.cyberware || []) as Array<{ cost: number }>;
  const selectedBioware = (state.selections?.bioware || []) as Array<{ cost: number }>;

  // Local category cost (for card-specific footer display)
  const commlinksSpent = selectedCommlinks.reduce((sum, c) => sum + c.cost, 0);
  const cyberdecksSpent = selectedCyberdecks.reduce((sum, d) => sum + d.cost, 0);
  const softwareSpent = selectedSoftware.reduce((sum, s) => sum + s.cost, 0);
  const matrixSpent = commlinksSpent + cyberdecksSpent + softwareSpent;

  // Use centralized nuyen spent from budget context for global budget tracker
  const totalSpent = nuyenBudget?.spent || 0;
  const remaining = totalNuyen - totalSpent;
  const isOverBudget = remaining < 0;

  // Calculate legality warnings
  const legalityWarnings = useMemo(() => {
    const restricted: Array<{ name: string }> = [];
    const forbidden: Array<{ name: string }> = [];

    for (const commlink of selectedCommlinks) {
      if (commlink.legality === "restricted") {
        restricted.push(commlink);
      } else if (commlink.legality === "forbidden") {
        forbidden.push(commlink);
      }
    }

    for (const cyberdeck of selectedCyberdecks) {
      if (cyberdeck.legality === "restricted") {
        restricted.push(cyberdeck);
      } else if (cyberdeck.legality === "forbidden") {
        forbidden.push(cyberdeck);
      }
    }

    return { restricted, forbidden };
  }, [selectedCommlinks, selectedCyberdecks]);

  // Karma conversion hook
  const karmaRemaining = karmaBudget?.remaining ?? 0;

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

  // Add commlink (actual implementation) - modal stays open for bulk-add
  const actuallyAddCommlink = useCallback(
    (commlink: CommlinkData) => {
      const newCommlink: CharacterCommlink = {
        id: `${commlink.id}-${Date.now()}`,
        catalogId: commlink.id,
        name: commlink.name,
        deviceRating: commlink.deviceRating,
        dataProcessing: commlink.deviceRating,
        firewall: commlink.deviceRating,
        cost: commlink.cost,
        availability: commlink.availability,
        legality: commlink.legality,
      };

      updateState({
        selections: {
          ...state.selections,
          commlinks: [...selectedCommlinks, newCommlink],
        },
      });
    },
    [selectedCommlinks, state.selections, updateState]
  );

  // Add commlink (with karma conversion prompt if needed)
  const addCommlink = useCallback(
    (commlink: CommlinkData) => {
      if (commlink.cost <= remaining) {
        actuallyAddCommlink(commlink);
        return;
      }

      const conversionInfo = karmaConversionPrompt.checkPurchase(commlink.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(commlink.name, commlink.cost, () => {
          actuallyAddCommlink(commlink);
        });
        return;
      }
    },
    [remaining, actuallyAddCommlink, karmaConversionPrompt]
  );

  // Remove commlink
  const removeCommlink = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          commlinks: selectedCommlinks.filter((c) => (c.id || c.catalogId) !== id),
        },
      });
    },
    [selectedCommlinks, state.selections, updateState]
  );

  // Add cyberdeck (actual implementation) - modal stays open for bulk-add
  const actuallyAddCyberdeck = useCallback(
    (cyberdeck: CyberdeckData) => {
      const newCyberdeck: CharacterCyberdeck = {
        id: `${cyberdeck.id}-${Date.now()}`,
        catalogId: cyberdeck.id,
        name: cyberdeck.name,
        deviceRating: cyberdeck.deviceRating,
        attributeArray: [
          cyberdeck.attributes.attack,
          cyberdeck.attributes.sleaze,
          cyberdeck.attributes.dataProcessing,
          cyberdeck.attributes.firewall,
        ],
        currentConfig: {
          attack: cyberdeck.attributes.attack,
          sleaze: cyberdeck.attributes.sleaze,
          dataProcessing: cyberdeck.attributes.dataProcessing,
          firewall: cyberdeck.attributes.firewall,
        },
        programSlots: cyberdeck.programs,
        loadedPrograms: [],
        cost: cyberdeck.cost,
        availability: cyberdeck.availability,
        legality: cyberdeck.legality,
      };

      updateState({
        selections: {
          ...state.selections,
          cyberdecks: [...selectedCyberdecks, newCyberdeck],
        },
      });
    },
    [selectedCyberdecks, state.selections, updateState]
  );

  // Add cyberdeck (with karma conversion prompt if needed)
  const addCyberdeck = useCallback(
    (cyberdeck: CyberdeckData) => {
      if (cyberdeck.cost <= remaining) {
        actuallyAddCyberdeck(cyberdeck);
        return;
      }

      const conversionInfo = karmaConversionPrompt.checkPurchase(cyberdeck.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(cyberdeck.name, cyberdeck.cost, () => {
          actuallyAddCyberdeck(cyberdeck);
        });
        return;
      }
    },
    [remaining, actuallyAddCyberdeck, karmaConversionPrompt]
  );

  // Remove cyberdeck
  const removeCyberdeck = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          cyberdecks: selectedCyberdecks.filter((d) => (d.id || d.catalogId) !== id),
        },
      });
    },
    [selectedCyberdecks, state.selections, updateState]
  );

  // Add data software (actual implementation) - modal stays open for bulk-add
  const actuallyAddSoftware = useCallback(
    (software: CharacterDataSoftware) => {
      updateState({
        selections: {
          ...state.selections,
          software: [...selectedSoftware, software],
        },
      });
    },
    [selectedSoftware, state.selections, updateState]
  );

  // Add data software (with karma conversion prompt if needed)
  const addSoftware = useCallback(
    (software: CharacterDataSoftware) => {
      if (software.cost <= remaining) {
        actuallyAddSoftware(software);
        return;
      }

      const conversionInfo = karmaConversionPrompt.checkPurchase(software.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(software.displayName, software.cost, () => {
          actuallyAddSoftware(software);
        });
        return;
      }
    },
    [remaining, actuallyAddSoftware, karmaConversionPrompt]
  );

  // Remove data software
  const removeSoftware = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          software: selectedSoftware.filter((s) => s.id !== id),
        },
      });
    },
    [selectedSoftware, state.selections, updateState]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (isOverBudget) return "error";
    if (
      selectedCommlinks.length > 0 ||
      selectedCyberdecks.length > 0 ||
      selectedSoftware.length > 0
    )
      return "valid";
    return "pending";
  }, [isOverBudget, selectedCommlinks.length, selectedCyberdecks.length, selectedSoftware.length]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard
        title="Matrix Gear"
        description="Purchase commlinks and cyberdecks"
        status="pending"
      >
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
        title="Matrix Gear"
        status={validationStatus}
        headerAction={
          <button
            onClick={() => {
              setInitialCategory("commlinks");
              setIsMatrixGearModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        }
      >
        <div className="space-y-4">
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
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(totalSpent)} / {formatCurrency(totalNuyen)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-full transition-all ${isOverBudget ? "bg-red-500" : "bg-blue-500"}`}
                style={{
                  width: `${Math.min(100, (totalSpent / totalNuyen) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Legality Warnings */}
          {(legalityWarnings.restricted.length > 0 || legalityWarnings.forbidden.length > 0) && (
            <div className="space-y-2">
              {legalityWarnings.forbidden.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-medium text-red-700 dark:text-red-300">
                      {legalityWarnings.forbidden.length} forbidden item
                      {legalityWarnings.forbidden.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-red-600 dark:text-red-400"> - illegal to possess</span>
                  </div>
                </div>
              )}
              {legalityWarnings.restricted.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-medium text-amber-700 dark:text-amber-300">
                      {legalityWarnings.restricted.length} restricted item
                      {legalityWarnings.restricted.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400"> - requires license</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selected matrix gear grouped by category */}
          {totalItems > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Selected Matrix Gear ({totalItems})
              </h4>

              {/* Commlinks */}
              {matrixGearByCategory.commlinks.length > 0 && (
                <div>
                  <h5 className="mb-2 text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
                    {MATRIX_CATEGORY_LABELS.commlinks}
                  </h5>
                  <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
                    {matrixGearByCategory.commlinks.map((commlink) => (
                      <CommlinkRow
                        key={commlink.id || commlink.catalogId}
                        commlink={commlink}
                        onRemove={removeCommlink}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Cyberdecks */}
              {matrixGearByCategory.cyberdecks.length > 0 && (
                <div>
                  <h5 className="mb-2 text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
                    {MATRIX_CATEGORY_LABELS.cyberdecks}
                  </h5>
                  <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
                    {matrixGearByCategory.cyberdecks.map((cyberdeck) => (
                      <CyberdeckRow
                        key={cyberdeck.id || cyberdeck.catalogId}
                        cyberdeck={cyberdeck}
                        onRemove={removeCyberdeck}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Software */}
              {matrixGearByCategory.software.length > 0 && (
                <div>
                  <h5 className="mb-2 text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
                    {MATRIX_CATEGORY_LABELS.software}
                  </h5>
                  <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
                    {matrixGearByCategory.software.map((software) => (
                      <DataSoftwareRow
                        key={software.id}
                        software={software}
                        onRemove={removeSoftware}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {totalItems === 0 && (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No matrix gear selected</p>
            </div>
          )}

          {/* Footer Summary */}
          <div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-700">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Total: {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
              {formatCurrency(matrixSpent)}¥
            </span>
          </div>
        </div>
      </CreationCard>

      {/* Matrix Gear Purchase Modal */}
      <MatrixGearModal
        isOpen={isMatrixGearModalOpen}
        onClose={() => setIsMatrixGearModalOpen(false)}
        initialCategory={initialCategory}
        remaining={remaining}
        onPurchaseCommlink={addCommlink}
        onPurchaseCyberdeck={addCyberdeck}
        onPurchaseSoftware={addSoftware}
        existingCommlinks={selectedCommlinks}
        existingCyberdecks={selectedCyberdecks}
        existingSoftware={selectedSoftware}
        hasCompatibleDevice={hasCompatibleDevice}
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
