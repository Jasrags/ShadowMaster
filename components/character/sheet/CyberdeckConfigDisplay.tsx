"use client";

import { useState, useMemo, useCallback } from "react";
import type { Character } from "@/lib/types";
import type { CyberdeckAttributeConfig } from "@/lib/types/matrix";
import { DisplayCard } from "./DisplayCard";
import { Cpu, ArrowUpDown } from "lucide-react";
import {
  getActiveCyberdeck,
  swapAttributes,
  validateCyberdeckConfig,
  createDefaultConfig,
  createOffensiveConfig,
  createStealthyConfig,
} from "@/lib/rules/matrix/cyberdeck-validator";

interface CyberdeckConfigDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

const ASDF_ROWS: { key: keyof CyberdeckAttributeConfig; label: string }[] = [
  { key: "attack", label: "Attack" },
  { key: "sleaze", label: "Sleaze" },
  { key: "dataProcessing", label: "Data Processing" },
  { key: "firewall", label: "Firewall" },
];

const PRESETS: { label: string; factory: (arr: number[]) => CyberdeckAttributeConfig }[] = [
  { label: "Defensive", factory: createDefaultConfig },
  { label: "Offensive", factory: createOffensiveConfig },
  { label: "Stealth", factory: createStealthyConfig },
];

export function CyberdeckConfigDisplay({
  character,
  onCharacterUpdate,
  editable,
}: CyberdeckConfigDisplayProps) {
  const activeDeck = useMemo(() => getActiveCyberdeck(character), [character]);

  const [pendingConfig, setPendingConfig] = useState<CyberdeckAttributeConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentConfig = pendingConfig ?? activeDeck?.currentConfig ?? null;
  const hasPendingChanges =
    pendingConfig !== null &&
    activeDeck?.currentConfig !== undefined &&
    JSON.stringify(pendingConfig) !== JSON.stringify(activeDeck.currentConfig);

  const handleSwap = useCallback(
    (attr1: keyof CyberdeckAttributeConfig, attr2: keyof CyberdeckAttributeConfig) => {
      if (!currentConfig) return;
      const swapped = swapAttributes(currentConfig, attr1, attr2);
      setPendingConfig(swapped);
      setError(null);
    },
    [currentConfig]
  );

  const handlePreset = useCallback(
    (factory: (arr: number[]) => CyberdeckAttributeConfig) => {
      if (!activeDeck) return;
      const config = factory(activeDeck.attributeArray);
      setPendingConfig(config);
      setError(null);
    },
    [activeDeck]
  );

  const handleApply = useCallback(async () => {
    if (!pendingConfig || !activeDeck || !onCharacterUpdate) return;

    const validation = validateCyberdeckConfig(pendingConfig, activeDeck.attributeArray);
    if (!validation.valid) {
      setError(validation.errors.map((e) => e.message).join("; "));
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/characters/${character.id}/matrix`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deckConfig: pendingConfig }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update configuration");
        return;
      }

      // Update local character state
      const updatedDecks = (character.cyberdecks ?? []).map((deck) =>
        deck.id === activeDeck.id || deck.catalogId === activeDeck.catalogId
          ? { ...deck, currentConfig: pendingConfig }
          : deck
      );
      onCharacterUpdate({ ...character, cyberdecks: updatedDecks });
      setPendingConfig(null);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [pendingConfig, activeDeck, character, onCharacterUpdate]);

  const handleCancel = useCallback(() => {
    setPendingConfig(null);
    setError(null);
  }, []);

  if (!activeDeck || !currentConfig) return null;

  const slotsUsed = activeDeck.loadedPrograms.length;
  const slotsMax = activeDeck.programSlots;

  return (
    <DisplayCard
      id="sheet-cyberdeck-config"
      title="Deck Configuration"
      icon={<Cpu className="h-4 w-4 text-emerald-400" />}
      headerAction={
        <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
          {slotsUsed}/{slotsMax} slots
        </span>
      }
      collapsible
    >
      <div className="space-y-3">
        {/* Attribute array reference */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Attribute Array
          </span>
          <span className="font-mono text-xs text-zinc-500">
            [{activeDeck.attributeArray.sort((a, b) => b - a).join(", ")}]
          </span>
        </div>

        {/* ASDF Grid with swap controls */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          {ASDF_ROWS.map(({ key, label }, index) => (
            <div
              key={key}
              className="flex items-center justify-between px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
            >
              <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                {label}
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-sm font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {currentConfig[key]}
                </span>
                {editable && (
                  <div className="flex flex-col gap-0.5">
                    {index > 0 && (
                      <button
                        onClick={() => handleSwap(key, ASDF_ROWS[index - 1].key)}
                        className="rounded p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 transition-colors"
                        aria-label={`Swap ${label} with ${ASDF_ROWS[index - 1].label}`}
                        disabled={saving}
                      >
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Presets */}
        {editable && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Presets
            </div>
            <div className="flex gap-1.5">
              {PRESETS.map(({ label, factory }) => (
                <button
                  key={label}
                  onClick={() => handlePreset(factory)}
                  disabled={saving}
                  className="rounded border border-zinc-200 bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-600 hover:border-emerald-500/30 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}

        {/* Apply / Cancel */}
        {editable && hasPendingChanges && (
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              disabled={saving}
              className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Apply"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="rounded border border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
