"use client";

import { useMemo } from "react";
import type { Character } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { PlugZap, AlertTriangle } from "lucide-react";
import {
  hasVehicleControlRig,
  getVehicleControlRig,
  calculateJumpedInInitiative,
  getHotSimRiskDescription,
  getColdSimBenefitsDescription,
  getOwnedDrones,
} from "@/lib/rules/rigging";
import { VR_MODE_BADGE } from "./rigging-helpers";

interface JumpInControlDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

export function JumpInControlDisplay({ character }: JumpInControlDisplayProps) {
  const hasVCR = useMemo(() => hasVehicleControlRig(character), [character]);
  const vcr = useMemo(() => getVehicleControlRig(character), [character]);
  const drones = useMemo(() => getOwnedDrones(character), [character]);

  const coldSimInit = useMemo(() => {
    if (!vcr) return null;
    const reaction = character.attributes?.reaction ?? 1;
    const intuition = character.attributes?.intuition ?? 1;
    return calculateJumpedInInitiative(reaction, intuition, vcr.rating, "cold-sim");
  }, [vcr, character.attributes?.reaction, character.attributes?.intuition]);

  const hotSimInit = useMemo(() => {
    if (!vcr) return null;
    const reaction = character.attributes?.reaction ?? 1;
    const intuition = character.attributes?.intuition ?? 1;
    return calculateJumpedInInitiative(reaction, intuition, vcr.rating, "hot-sim");
  }, [vcr, character.attributes?.reaction, character.attributes?.intuition]);

  const hotSimRisk = useMemo(() => getHotSimRiskDescription(), []);
  const coldSimBenefits = useMemo(() => getColdSimBenefitsDescription(), []);

  if (!hasVCR || !vcr) return null;

  const vehicles = character.vehicles ?? [];
  const jumpTargets = [
    ...vehicles.map((v) => ({
      id: v.catalogId ?? v.name,
      name: v.name,
      type: "Vehicle" as const,
      pilot: v.pilot,
    })),
    ...drones.map((d) => ({
      id: d.catalogId ?? d.name,
      name: d.customName ?? d.name,
      type: "Drone" as const,
      pilot: d.pilot,
    })),
  ];

  return (
    <DisplayCard
      id="sheet-jump-in"
      title="Jump-In Control"
      icon={<PlugZap className="h-4 w-4 text-emerald-400" />}
      collapsible
    >
      <div className="space-y-3">
        {/* VCR Info */}
        <div data-testid="vcr-info">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Vehicle Control Rig
          </div>
          <div className="flex items-center gap-2">
            <span
              data-testid="vcr-rating"
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
            >
              Rating {vcr.rating}
            </span>
            {vcr.grade && vcr.grade !== "standard" && (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {vcr.grade}
              </span>
            )}
            <span className="ml-auto" />
            <span
              data-testid="control-bonus"
              className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
            >
              +{vcr.controlBonus} to vehicle tests
            </span>
          </div>
        </div>

        {/* Jumpable Targets */}
        {jumpTargets.length > 0 && (
          <div data-testid="jump-targets">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Available Targets ({jumpTargets.length})
            </div>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              {jumpTargets.map((target, idx) => (
                <div
                  key={`${target.id}-${idx}`}
                  data-testid="jump-target-row"
                  className="flex items-center gap-1.5 px-3 py-1.5 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
                >
                  <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                    {target.name}
                  </span>
                  <span
                    className={`shrink-0 rounded border border-zinc-400/20 bg-zinc-400/10 px-1 text-[9px] font-bold uppercase text-zinc-500 dark:text-zinc-400`}
                  >
                    {target.type}
                  </span>
                  <span className="ml-auto" />
                  <span className="shrink-0 rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                    Pilot {target.pilot}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VR Mode Preview */}
        <div data-testid="vr-modes">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            VR Mode
          </div>
          <div className="space-y-2">
            {/* Cold-Sim */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${VR_MODE_BADGE["cold-sim"].style}`}
                >
                  {VR_MODE_BADGE["cold-sim"].label}
                </span>
                {coldSimInit && (
                  <span className="ml-auto font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    Init {coldSimInit.initiative}+{coldSimInit.initiativeDice}D6
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">{coldSimBenefits}</p>
            </div>

            {/* Hot-Sim */}
            <div className="rounded-lg border border-red-200 bg-red-50/50 p-2.5 dark:border-red-900/40 dark:bg-red-950/30">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${VR_MODE_BADGE["hot-sim"].style}`}
                >
                  {VR_MODE_BADGE["hot-sim"].label}
                </span>
                {hotSimInit && (
                  <span className="ml-auto font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                    Init {hotSimInit.initiative}+{hotSimInit.initiativeDice}D6
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-start gap-1">
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
                <p
                  data-testid="hotsim-warning"
                  className="text-[11px] text-red-600 dark:text-red-400"
                >
                  {hotSimRisk}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DisplayCard>
  );
}
