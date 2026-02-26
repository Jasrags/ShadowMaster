"use client";

/**
 * ActiveModifiersPanel
 *
 * Displays all active modifiers on a character and allows adding/removing them.
 * Follows the DisplayCard pattern from EffectsSummaryDisplay.
 *
 * @see Issue #114
 */

import { useState } from "react";
import type { Character } from "@/lib/types";
import type { ActiveModifier } from "@/lib/types/effects";
import { DisplayCard } from "./DisplayCard";
import { Sliders, Plus, X, Clock } from "lucide-react";
import { AddModifierModal } from "./AddModifierModal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActiveModifiersPanelProps {
  character: Character;
  editable?: boolean;
  onCharacterUpdate?: (character: Character) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSource(source: string): string {
  return source.charAt(0).toUpperCase() + source.slice(1);
}

function formatEffectType(type: string): string {
  return type.replace(/-/g, " ");
}

function getExpirationLabel(modifier: ActiveModifier): string | null {
  if (modifier.remainingUses !== undefined) {
    return `${modifier.remainingUses} use${modifier.remainingUses !== 1 ? "s" : ""} left`;
  }
  if (modifier.expiresAt) {
    const expires = new Date(modifier.expiresAt);
    const now = new Date();
    if (expires <= now) return "Expired";
    const diffMs = expires.getTime() - now.getTime();
    if (diffMs < 60_000) return `${Math.ceil(diffMs / 1000)}s`;
    if (diffMs < 3_600_000) return `${Math.ceil(diffMs / 60_000)}m`;
    return `${Math.round(diffMs / 3_600_000)}h`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ModifierRow({
  modifier,
  editable,
  onRemove,
}: {
  modifier: ActiveModifier;
  editable: boolean;
  onRemove: () => void;
}) {
  const value = typeof modifier.effect.value === "number" ? modifier.effect.value : 0;
  const expiration = getExpirationLabel(modifier);

  return (
    <div className="flex min-w-0 items-center gap-1.5 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50">
      {/* Name */}
      <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
        {modifier.name}
      </span>

      {/* Source badge */}
      <span className="shrink-0 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-1.5 py-px font-mono text-[9px] uppercase text-zinc-400">
        {formatSource(modifier.source)}
      </span>

      {/* Effect type badge */}
      <span className="shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-1.5 py-px font-mono text-[9px] uppercase text-blue-400">
        {formatEffectType(modifier.effect.type)}
      </span>

      {/* Expiration indicator */}
      {expiration && (
        <span
          className="flex shrink-0 items-center gap-0.5 text-[10px] text-amber-500"
          title="Time remaining"
        >
          <Clock className="h-2.5 w-2.5" />
          {expiration}
        </span>
      )}

      {/* Value pill */}
      <span
        className={`ml-auto shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
          value > 0
            ? "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300"
            : value < 0
              ? "border-red-500/20 bg-red-500/12 text-red-600 dark:text-red-300"
              : "border-zinc-500/20 bg-zinc-500/12 text-zinc-500"
        }`}
      >
        {value > 0 ? "+" : ""}
        {value}
      </span>

      {/* Remove button */}
      {editable && (
        <button
          onClick={onRemove}
          className="shrink-0 rounded p-0.5 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          title="Remove modifier"
          aria-label={`Remove ${modifier.name}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ActiveModifiersPanel({
  character,
  editable = false,
  onCharacterUpdate,
}: ActiveModifiersPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const modifiers = character.activeModifiers ?? [];

  async function handleRemove(modifierId: string) {
    setIsRemoving(modifierId);
    try {
      const res = await fetch(`/api/characters/${character.id}/modifiers/${modifierId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const updated: Character = {
          ...character,
          activeModifiers: modifiers.filter((m) => m.id !== modifierId),
        };
        onCharacterUpdate?.(updated);
      }
    } finally {
      setIsRemoving(null);
    }
  }

  function handleModifierAdded(modifier: ActiveModifier) {
    const updated: Character = {
      ...character,
      activeModifiers: [...modifiers, modifier],
    };
    onCharacterUpdate?.(updated);
  }

  return (
    <>
      <DisplayCard
        id="sheet-active-modifiers"
        title="Active Modifiers"
        icon={<Sliders className="h-4 w-4 text-zinc-400" />}
        collapsible
        defaultCollapsed={modifiers.length === 0}
        collapsedSummary={
          <span className="text-xs text-zinc-500 font-mono">
            {modifiers.length} modifier{modifiers.length !== 1 ? "s" : ""}
          </span>
        }
        headerAction={
          editable ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded p-1 text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
              title="Add modifier"
              aria-label="Add modifier"
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : undefined
        }
      >
        {modifiers.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-zinc-500">No active modifiers</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            {modifiers.map((m) => (
              <ModifierRow
                key={m.id}
                modifier={m}
                editable={editable}
                onRemove={() => handleRemove(m.id)}
              />
            ))}
          </div>
        )}
      </DisplayCard>

      {isModalOpen && (
        <AddModifierModal
          characterId={character.id}
          onClose={() => setIsModalOpen(false)}
          onModifierAdded={handleModifierAdded}
        />
      )}
    </>
  );
}
