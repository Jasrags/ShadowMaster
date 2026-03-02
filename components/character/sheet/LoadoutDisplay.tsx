"use client";

import { useState, useCallback } from "react";
import type { Character } from "@/lib/types";
import type { EquipmentReadiness } from "@/lib/types/gear-state";
import { saveCurrentAsLoadout, deleteLoadout, updateLoadout } from "@/lib/rules/inventory";
import { DisplayCard } from "./DisplayCard";
import { LoadoutDiffModal } from "./LoadoutDiffModal";
import { getReadinessLabel, READINESS_BY_EQUIPMENT } from "./readiness-helpers";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LoadoutDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoadoutDisplay({ character, onCharacterUpdate, editable }: LoadoutDisplayProps) {
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDefaultReadiness, setNewDefaultReadiness] = useState<EquipmentReadiness>("carried");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [applyingLoadoutId, setApplyingLoadoutId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadouts = character.loadouts || [];

  const handleSaveCurrent = useCallback(() => {
    if (!onCharacterUpdate || !newName.trim()) return;
    const result = saveCurrentAsLoadout(
      character,
      newName.trim(),
      newDescription.trim() || undefined
    );
    onCharacterUpdate(result.character);
    setNewName("");
    setNewDescription("");
    setShowNew(false);
  }, [character, newName, newDescription, onCharacterUpdate]);

  const handleDelete = useCallback(
    (loadoutId: string) => {
      if (!onCharacterUpdate) return;
      const updated = deleteLoadout(character, loadoutId);
      onCharacterUpdate(updated);
      setConfirmDeleteId(null);
    },
    [character, onCharacterUpdate]
  );

  const handleRename = useCallback(
    (loadoutId: string) => {
      if (!onCharacterUpdate || !editName.trim()) return;
      const updated = updateLoadout(character, loadoutId, { name: editName.trim() });
      onCharacterUpdate(updated);
      setEditingId(null);
      setEditName("");
    },
    [character, editName, onCharacterUpdate]
  );

  const handleApplyConfirm = useCallback(
    (updatedCharacter: Character) => {
      if (!onCharacterUpdate) return;
      onCharacterUpdate(updatedCharacter);
      setApplyingLoadoutId(null);
    },
    [onCharacterUpdate]
  );

  return (
    <>
      <DisplayCard
        id="sheet-loadouts"
        title="Loadouts"
        icon={<Package className="h-4 w-4 text-zinc-400" />}
        collapsible
        headerAction={
          editable && onCharacterUpdate ? (
            <button
              data-testid="new-loadout-button"
              onClick={() => setShowNew(!showNew)}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              <Plus className="h-3 w-3" />
              New
            </button>
          ) : undefined
        }
      >
        <div className="space-y-2">
          {/* New loadout form */}
          {showNew && editable && onCharacterUpdate && (
            <div
              data-testid="new-loadout-form"
              className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <input
                data-testid="new-loadout-name"
                type="text"
                placeholder="Loadout name…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                onKeyDown={(e) => e.key === "Enter" && handleSaveCurrent()}
              />
              <input
                data-testid="new-loadout-description"
                type="text"
                placeholder="Description (optional)…"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">Default:</span>
                <select
                  data-testid="new-loadout-default-readiness"
                  value={newDefaultReadiness}
                  onChange={(e) => setNewDefaultReadiness(e.target.value as EquipmentReadiness)}
                  className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[11px] text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {READINESS_BY_EQUIPMENT.gear.map((s) => (
                    <option key={s} value={s}>
                      {getReadinessLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  data-testid="save-current-button"
                  onClick={handleSaveCurrent}
                  disabled={!newName.trim()}
                  className="rounded bg-emerald-600 px-2 py-1 text-[10px] font-medium text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                >
                  Save Current
                </button>
                <button
                  data-testid="cancel-new-button"
                  onClick={() => setShowNew(false)}
                  className="rounded border border-zinc-300 px-2 py-1 text-[10px] text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Loadout list */}
          {loadouts.length === 0 && !showNew && (
            <p className="text-xs italic text-zinc-500 dark:text-zinc-400">No loadouts saved</p>
          )}

          {loadouts.map((loadout) => (
            <div
              key={loadout.id}
              data-testid="loadout-row"
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              {editingId === loadout.id ? (
                <input
                  data-testid="edit-loadout-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(loadout.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={() => handleRename(loadout.id)}
                  autoFocus
                  className="flex-1 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                />
              ) : (
                <span className="flex-1 truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {loadout.name}
                </span>
              )}

              {character.activeLoadoutId === loadout.id && (
                <span
                  data-testid="active-badge"
                  className="shrink-0 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-emerald-400"
                >
                  Active
                </span>
              )}

              {editable && onCharacterUpdate && editingId !== loadout.id && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    data-testid="apply-loadout-button"
                    onClick={() => setApplyingLoadoutId(loadout.id)}
                    className="rounded px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    data-testid="edit-loadout-button"
                    onClick={() => {
                      setEditingId(loadout.id);
                      setEditName(loadout.name);
                    }}
                    className="rounded p-0.5 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700/30 transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  {confirmDeleteId === loadout.id ? (
                    <button
                      data-testid="confirm-delete-button"
                      onClick={() => handleDelete(loadout.id)}
                      className="rounded px-1.5 py-0.5 text-[10px] font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      data-testid="delete-loadout-button"
                      onClick={() => setConfirmDeleteId(loadout.id)}
                      className="rounded p-0.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </DisplayCard>

      {/* Apply loadout confirmation modal */}
      {applyingLoadoutId && (
        <LoadoutDiffModal
          isOpen={!!applyingLoadoutId}
          onClose={() => setApplyingLoadoutId(null)}
          character={character}
          loadoutId={applyingLoadoutId}
          onConfirm={handleApplyConfirm}
        />
      )}
    </>
  );
}
