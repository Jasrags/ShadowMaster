"use client";

import { useMemo } from "react";
import type { Character } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Wifi, WifiOff } from "lucide-react";
import { isGlobalWirelessEnabled, getWirelessBonusSummary } from "@/lib/rules/wireless";
import { getEquipmentStateSummary } from "@/lib/rules/inventory";

interface WirelessDisplayProps {
  character: Character;
  onCharacterUpdate?: (character: Character) => void;
  editable?: boolean;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function WirelessDisplay({ character, onCharacterUpdate, editable }: WirelessDisplayProps) {
  const globalWireless = useMemo(() => isGlobalWirelessEnabled(character), [character]);

  const equipmentSummary = useMemo(() => getEquipmentStateSummary(character), [character]);

  const bonusSummary = useMemo(
    () => (globalWireless ? getWirelessBonusSummary(character) : []),
    [character, globalWireless]
  );

  const handleToggle = () => {
    if (!onCharacterUpdate) return;
    onCharacterUpdate({ ...character, wirelessBonusesEnabled: !globalWireless });
  };

  return (
    <DisplayCard
      id="sheet-wireless"
      title="Wireless"
      icon={
        globalWireless ? (
          <Wifi className="h-4 w-4 text-cyan-400" />
        ) : (
          <WifiOff className="h-4 w-4 text-zinc-400" />
        )
      }
      collapsible
    >
      <div className="space-y-3">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {globalWireless ? (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400">
                Wireless Active
              </span>
            ) : (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
                Wireless Silent
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500">
              {equipmentSummary.wirelessEnabled} on / {equipmentSummary.wirelessDisabled} off
            </span>
            {editable && (
              <button
                onClick={handleToggle}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                  globalWireless ? "bg-cyan-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
                role="switch"
                aria-checked={globalWireless}
                aria-label="Toggle global wireless"
              >
                <span
                  className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                    globalWireless ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Bonus breakdown (only when wireless ON) */}
        {globalWireless && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Active Bonuses
            </div>
            {bonusSummary.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {bonusSummary.map((bonus, i) => (
                  <div
                    key={`${bonus.category}-${i}`}
                    className="flex items-center justify-between px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                        {bonus.category}
                      </span>
                      <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                        {bonus.description}
                      </span>
                    </div>
                    <span className="rounded bg-cyan-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                      {bonus.modifier}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">No active wireless bonuses</p>
            )}
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
