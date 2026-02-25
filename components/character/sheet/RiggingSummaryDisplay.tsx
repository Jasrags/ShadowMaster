"use client";

import { useMemo } from "react";
import type { Character } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Gamepad2 } from "lucide-react";
import {
  hasVehicleControlRig,
  getVehicleControlRig,
  hasRCC,
  getActiveRCC,
  calculateMaxSlavedDrones,
  calculateNoiseReduction,
  getOwnedDrones,
  getOwnedAutosofts,
} from "@/lib/rules/rigging";
import { hasRiggingAccess } from "./rigging-helpers";

interface RiggingSummaryDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

export function RiggingSummaryDisplay({ character }: RiggingSummaryDisplayProps) {
  const hasAccess = useMemo(() => hasRiggingAccess(character), [character]);
  const vcr = useMemo(() => getVehicleControlRig(character), [character]);
  const hasVCR = useMemo(() => hasVehicleControlRig(character), [character]);
  const rcc = useMemo(() => getActiveRCC(character), [character]);
  const hasRCCDevice = useMemo(() => hasRCC(character), [character]);
  const drones = useMemo(() => getOwnedDrones(character), [character]);
  const autosofts = useMemo(() => getOwnedAutosofts(character), [character]);

  const maxSlaved = useMemo(() => (rcc ? calculateMaxSlavedDrones(rcc.dataProcessing) : 0), [rcc]);
  const noiseReduction = useMemo(
    () => (rcc ? calculateNoiseReduction(rcc.deviceRating) : 0),
    [rcc]
  );

  if (!hasAccess) return null;

  const vehicleCount = character.vehicles?.length ?? 0;
  const droneCount = drones.length;
  const autosoftCount = autosofts.length;

  return (
    <DisplayCard
      id="sheet-rigging-summary"
      title="Rigging"
      icon={<Gamepad2 className="h-4 w-4 text-emerald-400" />}
      collapsible
    >
      <div className="space-y-3">
        {/* VCR Info */}
        {hasVCR && vcr && (
          <div data-testid="vcr-section">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Vehicle Control Rig
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                Control Rig
              </span>
              <span
                data-testid="vcr-rating"
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
              >
                R{vcr.rating}
              </span>
              <span className="ml-auto" />
              <span
                data-testid="vcr-control-bonus"
                className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
              >
                +{vcr.controlBonus} Control
              </span>
              <span
                data-testid="vcr-init-dice"
                className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                +{vcr.initiativeDiceBonus}D6 Init
              </span>
            </div>
          </div>
        )}

        {/* Active RCC */}
        {hasRCCDevice && rcc && (
          <div data-testid="rcc-section">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Rigger Command Console
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                  {rcc.customName ?? rcc.name}
                </span>
                <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                  DR {rcc.deviceRating}
                </span>
              </div>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span data-testid="rcc-dp" className="font-mono">
                DP{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {rcc.dataProcessing}
                </span>
              </span>
              <span>·</span>
              <span data-testid="rcc-fw" className="font-mono">
                FW{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {rcc.firewall}
                </span>
              </span>
              <span>·</span>
              <span data-testid="rcc-noise-reduction" className="font-mono">
                NR{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {noiseReduction}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Network Capacity */}
        {hasRCCDevice && rcc && (
          <div data-testid="network-capacity" className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Drone Slots</span>
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
              0 / {maxSlaved}
            </span>
          </div>
        )}

        {/* Equipment Counts */}
        <div
          data-testid="equipment-counts"
          className="flex flex-wrap gap-x-2 text-[11px] text-zinc-500 dark:text-zinc-400"
        >
          {vehicleCount > 0 && (
            <span>
              {vehicleCount} Vehicle{vehicleCount !== 1 ? "s" : ""}
            </span>
          )}
          {vehicleCount > 0 && droneCount > 0 && <span>·</span>}
          {droneCount > 0 && (
            <span>
              {droneCount} Drone{droneCount !== 1 ? "s" : ""}
            </span>
          )}
          {(vehicleCount > 0 || droneCount > 0) && autosoftCount > 0 && <span>·</span>}
          {autosoftCount > 0 && (
            <span>
              {autosoftCount} Autosoft{autosoftCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </DisplayCard>
  );
}
