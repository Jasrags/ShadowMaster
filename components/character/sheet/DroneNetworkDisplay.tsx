"use client";

import { useState, useMemo } from "react";
import type { Character, CharacterDrone, CharacterRCC } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Radio, ChevronDown, ChevronRight } from "lucide-react";
import { getOwnedDrones, getActiveRCC, calculateMaxSlavedDrones } from "@/lib/rules/rigging";
import { AUTOSOFT_CATEGORY_BADGE } from "./rigging-helpers";

// ---------------------------------------------------------------------------
// DroneRow
// ---------------------------------------------------------------------------

interface DroneRowProps {
  drone: CharacterDrone;
  index: number;
}

function DroneRow({ drone }: DroneRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayName = drone.customName ?? drone.name;
  const sizeLabel = drone.size.charAt(0).toUpperCase() + drone.size.slice(1);

  return (
    <div
      data-testid="drone-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span
          title={displayName}
          className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200"
        >
          {displayName}
        </span>
        <span
          data-testid="size-badge"
          className="shrink-0 rounded border border-zinc-400/20 bg-zinc-400/10 px-1 text-[9px] font-bold uppercase text-zinc-500 dark:text-zinc-400"
        >
          {sizeLabel}
        </span>
        <span className="ml-auto" />
        <span
          data-testid="pilot-badge"
          className="shrink-0 rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
        >
          Pilot {drone.pilot}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span data-testid="stat-body">
              Body{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {drone.body}
              </span>
            </span>
            <span data-testid="stat-armor">
              Armor{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {drone.armor}
              </span>
            </span>
            <span data-testid="stat-handling">
              Handling{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {drone.handling}
              </span>
            </span>
            <span data-testid="stat-speed">
              Speed{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {drone.speed}
              </span>
            </span>
            <span data-testid="stat-sensor">
              Sensor{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {drone.sensor}
              </span>
            </span>
          </div>

          {/* Condition Monitor */}
          <div className="flex items-center gap-x-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span data-testid="stat-condition">
              Condition Monitor{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {Math.ceil(drone.body / 2) + 8}
              </span>
            </span>
          </div>

          {/* Installed Autosofts */}
          {drone.installedAutosofts && drone.installedAutosofts.length > 0 && (
            <div data-testid="installed-autosofts">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Installed Autosofts
              </div>
              <div className="space-y-0.5">
                {drone.installedAutosofts.map((soft, idx) => (
                  <div
                    key={`${soft}-${idx}`}
                    data-testid="autosoft-row"
                    className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {soft}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {drone.notes && (
            <div data-testid="notes" className="text-xs italic text-zinc-500 dark:text-zinc-400">
              {drone.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DroneNetworkDisplay
// ---------------------------------------------------------------------------

interface DroneNetworkDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

export function DroneNetworkDisplay({ character }: DroneNetworkDisplayProps) {
  const drones = useMemo(() => getOwnedDrones(character), [character]);
  const rcc = useMemo(() => getActiveRCC(character), [character]);

  const maxSlaved = useMemo(() => (rcc ? calculateMaxSlavedDrones(rcc.dataProcessing) : 0), [rcc]);

  if (drones.length === 0 && !rcc) return null;

  const runningAutosofts = rcc?.runningAutosofts ?? [];

  return (
    <DisplayCard
      id="sheet-drone-network"
      title="Drone Network"
      icon={<Radio className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="space-y-3">
        {/* Network Header */}
        {rcc && (
          <div data-testid="network-header" className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                {rcc.customName ?? rcc.name}
              </span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
                RCC
              </span>
            </div>
            <span
              data-testid="capacity-badge"
              className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
            >
              0 / {maxSlaved} Slaved
            </span>
          </div>
        )}

        {/* Drone List */}
        {drones.length > 0 && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Drones ({drones.length})
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {drones.map((drone, idx) => (
                <DroneRow key={`${drone.name}-${idx}`} drone={drone} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Shared Autosofts from RCC */}
        {runningAutosofts.length > 0 && (
          <div data-testid="shared-autosofts">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Shared Autosofts (RCC)
            </div>
            <div className="space-y-1">
              {runningAutosofts.map((soft, idx) => (
                <div
                  key={`${soft}-${idx}`}
                  data-testid="shared-autosoft-row"
                  className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  <span>{soft}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
