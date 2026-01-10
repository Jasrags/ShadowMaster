"use client";

/**
 * FociCard
 *
 * Compact card for managing magical foci during character creation.
 * Features:
 * - List of owned foci with force, cost, bonding karma
 * - Inline bonding toggle
 * - Add Focus button opening modal
 * - Total cost and karma tracking
 */

import { useMemo, useCallback, useState } from "react";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "../shared";
import { FocusModal, type FocusSelection } from "./FocusModal";
import { Plus, X, Sparkles, Sword, BookOpen, Ghost, Wand2, Zap, Check, Square } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const FOCUS_ICONS: Record<string, typeof Sparkles> = {
  power: Sparkles,
  weapon: Sword,
  spell: BookOpen,
  spirit: Ghost,
  enchanting: Wand2,
  metamagic: Zap,
  qi: Sparkles,
};

// =============================================================================
// TYPES
// =============================================================================

interface OwnedFocus extends FocusSelection {
  bonded: boolean;
}

interface FociCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// FOCUS ITEM COMPONENT
// =============================================================================

function FocusItem({
  focus,
  onToggleBonded,
  onRemove,
}: {
  focus: OwnedFocus;
  onToggleBonded: () => void;
  onRemove: () => void;
}) {
  const Icon = FOCUS_ICONS[focus.type] || Sparkles;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Main row */}
      <div className="flex items-center gap-3">
        {/* Icon and info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 p-1.5 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
              <Icon className="h-4 w-4" />
            </div>
            <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
              {focus.name}
            </span>
            <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              F{focus.force}
            </span>
          </div>
        </div>

        {/* Cost */}
        <div className="shrink-0 text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {focus.cost.toLocaleString()}¥
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Bonding row */}
      <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Bonding: {focus.karmaToBond} karma
        </span>
        <button
          onClick={onToggleBonded}
          className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
            focus.bonded
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          {focus.bonded ? (
            <>
              <Check className="h-3 w-3" />
              Bonded
            </>
          ) : (
            <>
              <Square className="h-3 w-3" />
              Not Bonded
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FociCard({ state, updateState }: FociCardProps) {
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get character's magical path
  const magicPath = state.selections["magical-path"] as string | undefined;
  const hasMagic =
    magicPath && ["magician", "aspected-mage", "mystic-adept", "adept"].includes(magicPath);
  const isAdept = magicPath === "adept" || magicPath === "mystic-adept";

  // Get character's known spells for spell focus linking
  const characterSpells = useMemo(() => {
    const spells = (state.selections.spells || []) as Array<{
      id: string;
      name: string;
    }>;
    return spells;
  }, [state.selections.spells]);

  // Get current foci from state
  const foci = useMemo(() => {
    return (state.selections.foci || []) as OwnedFocus[];
  }, [state.selections.foci]);

  // Calculate totals
  const totalCost = useMemo(() => {
    return foci.reduce((sum, f) => sum + f.cost, 0);
  }, [foci]);

  const totalBondingKarma = useMemo(() => {
    return foci.reduce((sum, f) => sum + f.karmaToBond, 0);
  }, [foci]);

  const bondedKarma = useMemo(() => {
    return foci.filter((f) => f.bonded).reduce((sum, f) => sum + f.karmaToBond, 0);
  }, [foci]);

  // Handle adding a focus
  const handleAddFocus = useCallback(
    (focus: FocusSelection) => {
      const newFocus: OwnedFocus = {
        ...focus,
        bonded: false,
      };

      updateState({
        selections: {
          ...state.selections,
          foci: [...foci, newFocus],
        },
      });
    },
    [foci, state.selections, updateState]
  );

  // Handle toggling bonded status
  const handleToggleBonded = useCallback(
    (index: number) => {
      const newFoci = [...foci];
      newFoci[index] = { ...newFoci[index], bonded: !newFoci[index].bonded };

      updateState({
        selections: {
          ...state.selections,
          foci: newFoci,
        },
      });
    },
    [foci, state.selections, updateState]
  );

  // Handle removing a focus
  const handleRemoveFocus = useCallback(
    (index: number) => {
      const newFoci = foci.filter((_, i) => i !== index);

      updateState({
        selections: {
          ...state.selections,
          foci: newFoci,
        },
      });
    },
    [foci, state.selections, updateState]
  );

  // Get validation status
  const validationStatus = useMemo(() => {
    if (foci.length === 0) return "pending";
    return "valid";
  }, [foci]);

  // Check if character has magic
  if (!hasMagic) {
    return (
      <CreationCard title="Foci" description="Requires magical tradition" status="pending">
        <div className="rounded-lg border-2 border-dashed border-zinc-200 p-6 text-center dark:border-zinc-700">
          <Sparkles className="mx-auto h-8 w-8 text-zinc-400" />
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Foci are only available to magical characters
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <>
      <CreationCard
        title="Foci"
        description={
          foci.length > 0
            ? `${foci.length} ${foci.length === 1 ? "focus" : "foci"}, ${bondedKarma} karma bonded`
            : "Optional magical enhancements"
        }
        status={validationStatus}
      >
        <div className="space-y-4">
          {/* Karma Summary */}
          {foci.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-purple-50 px-3 py-2 dark:bg-purple-900/20">
              <span className="text-sm text-purple-700 dark:text-purple-300">Bonding Karma</span>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {bondedKarma} / {totalBondingKarma} karma
              </span>
            </div>
          )}

          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-purple-300 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:border-purple-400 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:border-purple-600 dark:hover:bg-purple-900/30"
          >
            <Plus className="h-4 w-4" />
            Add Focus
          </button>

          {/* Foci List */}
          {foci.length > 0 && (
            <div className="space-y-2">
              {foci.map((focus, index) => (
                <FocusItem
                  key={`${focus.catalogId}-${focus.force}-${index}`}
                  focus={focus}
                  onToggleBonded={() => handleToggleBonded(index)}
                  onRemove={() => handleRemoveFocus(index)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {foci.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Foci enhance your magical abilities but require karma to bond
              </p>
            </div>
          )}

          {/* Total */}
          {foci.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Cost</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {totalCost.toLocaleString()}¥
              </span>
            </div>
          )}
        </div>
      </CreationCard>

      {/* Modal */}
      <FocusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddFocus}
        characterSpells={characterSpells}
        isAdept={!!isAdept}
        maxAvailability={12}
      />
    </>
  );
}
