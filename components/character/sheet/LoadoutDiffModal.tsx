"use client";

import { useMemo } from "react";
import type { Character } from "@/lib/types";
import { getLoadoutDiff, applyLoadout, findGearItemById } from "@/lib/rules/inventory";
import { BaseModal } from "@/components/ui/BaseModal";

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
    diff.itemsToStash.length > 0 || diff.itemsToBring.length > 0 || diff.itemsToMove.length > 0;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Apply: ${loadout.name}`} size="md">
      <div className="space-y-4">
        {!hasChanges && (
          <p data-testid="no-changes" className="text-sm text-zinc-500 dark:text-zinc-400 italic">
            No changes needed — gear already matches this loadout.
          </p>
        )}

        {/* Items to Stash */}
        {diff.itemsToStash.length > 0 && (
          <div data-testid="items-to-stash">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-1">
              Stash ({diff.itemsToStash.length})
            </h3>
            <ul className="space-y-0.5">
              {diff.itemsToStash.map((id) => (
                <li
                  key={id}
                  className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
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
          <div data-testid="items-to-bring">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              Bring ({diff.itemsToBring.length})
            </h3>
            <ul className="space-y-0.5">
              {diff.itemsToBring.map((id) => (
                <li
                  key={id}
                  className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
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
          <div data-testid="items-to-move">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 mb-1">
              Move ({diff.itemsToMove.length})
            </h3>
            <ul className="space-y-0.5">
              {diff.itemsToMove.map((m) => (
                <li
                  key={m.itemId}
                  className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  {resolveItemName(m.itemId)}
                  <span className="text-[10px] text-zinc-500">
                    {m.from} → {m.to}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Encumbrance change */}
        {diff.encumbranceChange !== 0 && (
          <div
            data-testid="encumbrance-change"
            className={`text-xs font-mono ${diff.encumbranceChange > 0 ? "text-amber-400" : "text-emerald-400"}`}
          >
            {diff.encumbranceChange > 0 ? "+" : ""}
            {diff.encumbranceChange.toFixed(1)} kg
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
