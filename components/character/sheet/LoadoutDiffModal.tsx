"use client";

import { useMemo } from "react";
import type { Character } from "@/lib/types";
import { getLoadoutDiff, applyLoadout, findGearItemById } from "@/lib/rules/inventory";
import { getReadinessLabel } from "./readiness-helpers";
import { BaseModal } from "@/components/ui/BaseModal";
import { Package, ArrowUpDown, CheckCircle2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LoadoutDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  loadoutId: string;
  onConfirm: (updatedCharacter: Character) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoadoutDiffModal({
  isOpen,
  onClose,
  character,
  loadoutId,
  onConfirm,
}: LoadoutDiffModalProps) {
  const diff = useMemo(() => {
    if (!isOpen) return null;
    return getLoadoutDiff(character, loadoutId);
  }, [isOpen, character, loadoutId]);

  const loadout = character.loadouts?.find((l) => l.id === loadoutId);

  function resolveItemName(itemId: string): string {
    const item = findGearItemById(character, itemId);
    return item?.name ?? itemId;
  }

  function handleConfirm() {
    const result = applyLoadout(character, loadoutId);
    if (result.success && result.character) {
      onConfirm(result.character);
    }
    onClose();
  }

  if (!diff || !loadout) return null;

  const hasChanges =
    diff.itemsToStash.length > 0 ||
    diff.itemsToBring.length > 0 ||
    diff.itemsToMove.length > 0 ||
    diff.containerChanges.length > 0;

  const totalChanges =
    diff.itemsToStash.length +
    diff.itemsToBring.length +
    diff.itemsToMove.length +
    diff.containerChanges.length;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Apply: ${loadout.name}`} size="md">
      <div className="space-y-3 p-4">
        {/* No-changes state */}
        {!hasChanges && (
          <div
            data-testid="no-changes"
            className="flex flex-col items-center gap-2 py-6 text-zinc-500 dark:text-zinc-400"
          >
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            <p className="text-sm font-medium">
              No changes needed — gear already matches this loadout.
            </p>
          </div>
        )}

        {/* Summary */}
        {hasChanges && (
          <p data-testid="change-summary" className="text-xs text-zinc-500 dark:text-zinc-400">
            {totalChanges} change{totalChanges !== 1 ? "s" : ""} will be applied
          </p>
        )}

        {/* Items to Stash */}
        {diff.itemsToStash.length > 0 && (
          <div
            data-testid="items-to-stash"
            className="rounded-lg bg-red-50/50 p-3 dark:bg-red-900/20"
          >
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
              <Package className="h-3 w-3" />
              Stash ({diff.itemsToStash.length})
            </h3>
            <ul className="space-y-0.5">
              {diff.itemsToStash.map((id) => (
                <li
                  key={id}
                  className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                  {resolveItemName(id)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Items to Bring */}
        {diff.itemsToBring.length > 0 && (
          <div
            data-testid="items-to-bring"
            className="rounded-lg bg-emerald-50/50 p-3 dark:bg-emerald-900/20"
          >
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
              <Package className="h-3 w-3" />
              Bring ({diff.itemsToBring.length})
            </h3>
            <ul className="space-y-0.5">
              {diff.itemsToBring.map((id) => (
                <li
                  key={id}
                  className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {resolveItemName(id)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Items to Move */}
        {diff.itemsToMove.length > 0 && (
          <div
            data-testid="items-to-move"
            className="rounded-lg bg-blue-50/50 p-3 dark:bg-blue-900/20"
          >
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
              <ArrowUpDown className="h-3 w-3" />
              Move ({diff.itemsToMove.length})
            </h3>
            <ul className="space-y-0.5">
              {diff.itemsToMove.map((m) => (
                <li
                  key={m.itemId}
                  className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  {resolveItemName(m.itemId)}
                  <span className="text-[10px] text-zinc-500">
                    {getReadinessLabel(m.from)} → {getReadinessLabel(m.to)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Container Changes */}
        {diff.containerChanges.length > 0 && (
          <div
            data-testid="container-changes"
            className="rounded-lg bg-amber-50/50 p-3 dark:bg-amber-900/20"
          >
            <h3 className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
              <Package className="h-3 w-3" />
              Container ({diff.containerChanges.length})
            </h3>
            <ul className="space-y-0.5">
              {diff.containerChanges.map((c) => (
                <li
                  key={c.itemId}
                  className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                  {resolveItemName(c.itemId)}
                  <span className="text-[10px] text-zinc-500">
                    {c.fromContainer && c.toContainer
                      ? `${c.fromContainer} → ${c.toContainer}`
                      : c.toContainer
                        ? `→ ${c.toContainer}`
                        : c.fromContainer
                          ? `${c.fromContainer} → loose`
                          : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Encumbrance change */}
        {diff.encumbranceChange !== 0 && (
          <div className="flex items-center gap-2">
            <span
              data-testid="encumbrance-change"
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${
                diff.encumbranceChange > 0
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}
            >
              {diff.encumbranceChange > 0 ? "+" : ""}
              {diff.encumbranceChange.toFixed(1)} kg
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <button
            data-testid="cancel-button"
            onClick={onClose}
            className="rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            data-testid="apply-button"
            onClick={handleConfirm}
            className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Apply Loadout
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
