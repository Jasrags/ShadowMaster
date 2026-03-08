"use client";

import { useState, useMemo } from "react";
import type { Character, CharacterDrone, CharacterRCC } from "@/lib/types";
import type { DroneCommandType } from "@/lib/types/rigging";
import { DisplayCard } from "./DisplayCard";
import { Radio, ChevronDown, ChevronRight, Link2, Unlink, Terminal } from "lucide-react";
import { getOwnedDrones, getActiveRCC, calculateMaxSlavedDrones } from "@/lib/rules/rigging";
import { AUTOSOFT_CATEGORY_BADGE, COMMAND_TYPE_BADGE } from "./rigging-helpers";
import { useRiggingSession, useDroneNetwork } from "@/lib/rigging";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DRONE_COMMANDS: { type: DroneCommandType; label: string }[] = [
  { type: "watch", label: "Watch" },
  { type: "defend", label: "Defend" },
  { type: "attack", label: "Attack" },
  { type: "pursue", label: "Pursue" },
  { type: "return", label: "Return" },
  { type: "hold", label: "Hold" },
];

// ---------------------------------------------------------------------------
// DroneRow
// ---------------------------------------------------------------------------

interface DroneRowProps {
  drone: CharacterDrone;
  index: number;
  isSlaved: boolean;
  isSessionActive: boolean;
  editable: boolean;
  onSlave: (drone: CharacterDrone) => void;
  onRelease: (droneId: string) => void;
  onCommand: (droneId: string, command: DroneCommandType) => void;
  currentCommand?: DroneCommandType;
  noisePenalty?: number;
  effectiveFirewall?: number;
  isNetworkFull: boolean;
}

function DroneRow({
  drone,
  isSlaved,
  isSessionActive,
  editable,
  onSlave,
  onRelease,
  onCommand,
  currentCommand,
  noisePenalty,
  effectiveFirewall,
  isNetworkFull,
}: DroneRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommands, setShowCommands] = useState(false);

  const displayName = drone.customName ?? drone.name;
  const sizeLabel = drone.size.charAt(0).toUpperCase() + drone.size.slice(1);
  const droneId = drone.id ?? drone.catalogId;
  const commandBadge = currentCommand ? COMMAND_TYPE_BADGE[currentCommand] : null;

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

        {/* Slaved indicator */}
        {isSlaved && (
          <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            Slaved
          </span>
        )}

        {/* Command badge */}
        {commandBadge && (
          <span
            data-testid="command-badge"
            className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${commandBadge.style}`}
          >
            {commandBadge.label}
          </span>
        )}

        <span className="ml-auto" />

        {/* Noise penalty */}
        {isSlaved && noisePenalty !== undefined && noisePenalty > 0 && (
          <span className="shrink-0 rounded bg-amber-100 px-1 py-0.5 font-mono text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            -{noisePenalty} Noise
          </span>
        )}

        {/* Effective firewall */}
        {isSlaved && effectiveFirewall !== undefined && (
          <span className="shrink-0 rounded bg-blue-100 px-1 py-0.5 font-mono text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            FW {effectiveFirewall}
          </span>
        )}

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

          {/* Slave/Release buttons */}
          {isSessionActive && editable && (
            <div className="flex items-center gap-2">
              {!isSlaved ? (
                <button
                  data-testid="slave-button"
                  disabled={isNetworkFull}
                  onClick={() => onSlave(drone)}
                  className="flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 dark:text-emerald-400"
                >
                  <Link2 className="h-3 w-3" />
                  Slave
                </button>
              ) : (
                <button
                  data-testid="release-button"
                  onClick={() => onRelease(droneId)}
                  className="flex items-center gap-1 rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-500/20 dark:text-red-400"
                >
                  <Unlink className="h-3 w-3" />
                  Release
                </button>
              )}

              {/* Command dropdown */}
              {isSlaved && (
                <div className="relative">
                  <button
                    data-testid="command-button"
                    onClick={() => setShowCommands(!showCommands)}
                    className="flex items-center gap-1 rounded border border-zinc-300 bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    <Terminal className="h-3 w-3" />
                    Command
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showCommands && (
                    <div
                      data-testid="command-dropdown"
                      className="absolute left-0 top-full z-10 mt-1 w-32 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      {DRONE_COMMANDS.map((cmd) => (
                        <button
                          key={cmd.type}
                          data-testid={`command-${cmd.type}`}
                          onClick={() => {
                            onCommand(droneId, cmd.type);
                            setShowCommands(false);
                          }}
                          className="block w-full px-3 py-1.5 text-left text-[12px] text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          {cmd.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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

export function DroneNetworkDisplay({ character, editable = false }: DroneNetworkDisplayProps) {
  const drones = useMemo(() => getOwnedDrones(character), [character]);
  const rcc = useMemo(() => getActiveRCC(character), [character]);

  const {
    isSessionActive,
    slaveDrone,
    releaseDrone,
    issueDroneCommand: issueCmd,
    issueNetworkCommand: issueNetCmd,
    rccConfig,
  } = useRiggingSession();
  const { network, slavedCount, remainingCapacity, isFull } = useDroneNetwork();

  const maxSlaved = useMemo(() => (rcc ? calculateMaxSlavedDrones(rcc.dataProcessing) : 0), [rcc]);

  // Build set of slaved drone IDs for quick lookup
  const slavedDroneIds = useMemo(() => {
    if (!network) return new Set<string>();
    return new Set(network.slavedDrones.map((d) => d.droneId));
  }, [network]);

  // Build map of slaved drone metadata
  const slavedDroneMap = useMemo(() => {
    if (!network)
      return new Map<string, { command?: DroneCommandType; noise: number; firewall: number }>();
    const map = new Map<string, { command?: DroneCommandType; noise: number; firewall: number }>();
    for (const d of network.slavedDrones) {
      map.set(d.droneId, {
        command: d.currentCommand,
        noise: d.noisePenalty,
        firewall: rccConfig ? Math.max(d.pilotRating, rccConfig.firewall) : d.pilotRating,
      });
    }
    return map;
  }, [network, rccConfig]);

  if (drones.length === 0 && !rcc) return null;

  const runningAutosofts = rcc?.runningAutosofts ?? [];
  const displaySlavedCount = isSessionActive ? slavedCount : 0;

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
              {isSessionActive && (
                <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              )}
            </div>
            <span
              data-testid="capacity-badge"
              className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                isFull && isSessionActive
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
              }`}
            >
              {displaySlavedCount} / {maxSlaved} Slaved
            </span>
          </div>
        )}

        {/* Network Command (when drones are slaved) */}
        {isSessionActive && editable && slavedCount > 0 && (
          <div data-testid="network-commands" className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              All Drones:
            </span>
            {DRONE_COMMANDS.map((cmd) => (
              <button
                key={cmd.type}
                data-testid={`network-cmd-${cmd.type}`}
                onClick={() => issueNetCmd(cmd.type)}
                className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                {cmd.label}
              </button>
            ))}
          </div>
        )}

        {/* Drone List */}
        {drones.length > 0 && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Drones ({drones.length})
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {drones.map((drone, idx) => {
                const droneId = drone.id ?? drone.catalogId;
                const isSlaved = slavedDroneIds.has(droneId);
                const meta = slavedDroneMap.get(droneId);
                return (
                  <DroneRow
                    key={`${drone.name}-${idx}`}
                    drone={drone}
                    index={idx}
                    isSlaved={isSlaved}
                    isSessionActive={isSessionActive}
                    editable={editable}
                    onSlave={slaveDrone}
                    onRelease={releaseDrone}
                    onCommand={issueCmd}
                    currentCommand={meta?.command}
                    noisePenalty={meta?.noise}
                    effectiveFirewall={meta?.firewall}
                    isNetworkFull={isFull}
                  />
                );
              })}
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
