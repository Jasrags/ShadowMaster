"use client";

import { useMemo } from "react";
import type { Character } from "@/lib/types";
import { getEquipmentStateSummary } from "@/lib/rules/inventory";
import { calculateEncumbrance } from "@/lib/rules/encumbrance/calculator";
import { DisplayCard } from "./DisplayCard";
import { Package } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LoadoutSummaryDisplayProps {
  character: Character;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoadoutSummaryDisplay({ character }: LoadoutSummaryDisplayProps) {
  const activeLoadout = useMemo(() => {
    if (!character.activeLoadoutId || !character.loadouts) return null;
    return character.loadouts.find((l) => l.id === character.activeLoadoutId) ?? null;
  }, [character.activeLoadoutId, character.loadouts]);

  const summary = useMemo(() => getEquipmentStateSummary(character), [character]);
  const encumbrance = useMemo(() => calculateEncumbrance(character), [character]);

  const pct =
    encumbrance.maxCapacity > 0
      ? Math.min((encumbrance.currentWeight / encumbrance.maxCapacity) * 100, 100)
      : 0;

  const barColor = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <DisplayCard
      id="sheet-loadout-summary"
      title="Loadout"
      icon={<Package className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="space-y-2">
        {/* Active loadout name */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Active
          </span>
          <span
            data-testid="active-loadout-name"
            className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            {activeLoadout ? activeLoadout.name : "Manual Configuration"}
          </span>
        </div>

        {/* Mini encumbrance bar */}
        <div data-testid="encumbrance-mini" className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">
            {encumbrance.currentWeight.toFixed(1)}kg
          </span>
        </div>

        {/* Stats summary */}
        <div data-testid="loadout-stats" className="flex flex-wrap gap-x-3 gap-y-1">
          {summary.readiedWeapons > 0 && (
            <StatBadge label="Readied" value={summary.readiedWeapons} color="emerald" />
          )}
          {summary.holsteredWeapons > 0 && (
            <StatBadge label="Holstered" value={summary.holsteredWeapons} color="amber" />
          )}
          {summary.wornArmor > 0 && (
            <StatBadge label="Worn" value={summary.wornArmor} color="blue" />
          )}
          {summary.pocketedItems > 0 && (
            <StatBadge label="Pocketed" value={summary.pocketedItems} color="cyan" />
          )}
          {summary.carriedWeapons + summary.carriedArmor > 0 && (
            <StatBadge
              label="Carried"
              value={summary.carriedWeapons + summary.carriedArmor}
              color="orange"
            />
          )}
        </div>
      </div>
    </DisplayCard>
  );
}

// ---------------------------------------------------------------------------
// StatBadge
// ---------------------------------------------------------------------------

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span
      data-testid={`stat-${label.toLowerCase()}`}
      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium text-${color}-400 bg-${color}-500/10 border-${color}-500/30`}
    >
      {value} {label}
    </span>
  );
}
