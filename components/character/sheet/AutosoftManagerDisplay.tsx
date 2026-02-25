"use client";

import { useState, useMemo } from "react";
import type { Character, CharacterAutosoft } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Cpu, ChevronDown, ChevronRight } from "lucide-react";
import { getOwnedAutosofts, getOwnedDrones, getActiveRCC } from "@/lib/rules/rigging";
import { AUTOSOFT_CATEGORY_BADGE } from "./rigging-helpers";

// ---------------------------------------------------------------------------
// AutosoftRow
// ---------------------------------------------------------------------------

interface AutosoftRowProps {
  autosoft: CharacterAutosoft;
}

function AutosoftRow({ autosoft }: AutosoftRowProps) {
  const catBadge = AUTOSOFT_CATEGORY_BADGE[autosoft.category] ?? AUTOSOFT_CATEGORY_BADGE.stealth;

  return (
    <div
      data-testid="autosoft-row"
      className="flex items-center gap-2 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
        {autosoft.name}
      </span>
      <span
        data-testid="category-badge"
        className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${catBadge.style}`}
      >
        {catBadge.label}
      </span>
      <span
        data-testid="rating-pill"
        className="shrink-0 rounded border border-indigo-500/20 bg-indigo-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-600 dark:text-indigo-300"
      >
        R{autosoft.rating}
      </span>
      {autosoft.target && (
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">({autosoft.target})</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AutosoftManagerDisplay
// ---------------------------------------------------------------------------

interface AutosoftManagerDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

export function AutosoftManagerDisplay({ character }: AutosoftManagerDisplayProps) {
  const [showAvailable, setShowAvailable] = useState(false);
  const autosofts = useMemo(() => getOwnedAutosofts(character), [character]);
  const drones = useMemo(() => getOwnedDrones(character), [character]);
  const rcc = useMemo(() => getActiveRCC(character), [character]);

  const runningAutosofts = rcc?.runningAutosofts ?? [];

  // Drones with installed autosofts
  const dronesWithAutosofts = useMemo(
    () => drones.filter((d) => d.installedAutosofts && d.installedAutosofts.length > 0),
    [drones]
  );

  const hasContent =
    autosofts.length > 0 || runningAutosofts.length > 0 || dronesWithAutosofts.length > 0;

  if (!hasContent) return null;

  return (
    <DisplayCard
      id="sheet-autosofts"
      title="Autosofts"
      icon={<Cpu className="h-4 w-4 text-zinc-400" />}
      collapsible
      defaultCollapsed
    >
      <div className="space-y-3">
        {/* RCC Running Autosofts */}
        {runningAutosofts.length > 0 && (
          <div data-testid="rcc-running-section">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Running on RCC ({runningAutosofts.length})
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {runningAutosofts.map((soft, idx) => (
                <div
                  key={`${soft}-${idx}`}
                  data-testid="rcc-autosoft-row"
                  className="flex items-center gap-2 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
                >
                  <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                    {soft}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
                    Shared
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-Drone Installed Autosofts */}
        {dronesWithAutosofts.map((drone, droneIdx) => (
          <div key={`drone-${drone.name}-${droneIdx}`} data-testid="drone-autosofts-section">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {drone.customName ?? drone.name}
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {drone.installedAutosofts!.map((soft, idx) => (
                <div
                  key={`${soft}-${idx}`}
                  data-testid="drone-autosoft-row"
                  className="flex items-center gap-2 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
                >
                  <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                    {soft}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    Installed
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Available (Owned) Autosofts */}
        {autosofts.length > 0 && (
          <div data-testid="available-section">
            <button
              data-testid="available-toggle"
              onClick={() => setShowAvailable(!showAvailable)}
              className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {showAvailable ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              Owned ({autosofts.length})
            </button>
            {showAvailable && (
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {autosofts.map((soft, idx) => (
                  <AutosoftRow key={`${soft.catalogId}-${idx}`} autosoft={soft} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
