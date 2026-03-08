"use client";

import { useState, useMemo } from "react";
import type { Character } from "@/lib/types";
import type { RiggerVRMode } from "@/lib/types/rigging";
import { DisplayCard } from "./DisplayCard";
import { PlugZap, AlertTriangle, ShieldAlert, LogOut, Zap } from "lucide-react";
import {
  hasVehicleControlRig,
  getVehicleControlRig,
  calculateJumpedInInitiative,
  getHotSimRiskDescription,
  getColdSimBenefitsDescription,
  getOwnedDrones,
} from "@/lib/rules/rigging";
import { VR_MODE_BADGE } from "./rigging-helpers";
import { useRiggingSession, useJumpedInState } from "@/lib/rigging";

// ---------------------------------------------------------------------------
// Warning level colors
// ---------------------------------------------------------------------------

const WARNING_LEVEL_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  safe: {
    bg: "bg-emerald-100 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "Safe",
  },
  caution: {
    bg: "bg-amber-100 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    label: "Caution",
  },
  danger: {
    bg: "bg-red-100 dark:bg-red-500/15",
    text: "text-red-600 dark:text-red-400",
    label: "Danger",
  },
  critical: {
    bg: "bg-red-200 dark:bg-red-500/25",
    text: "text-red-700 dark:text-red-300",
    label: "Critical",
  },
};

interface JumpInControlDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
}

export function JumpInControlDisplay({ character, editable = false }: JumpInControlDisplayProps) {
  const hasVCR = useMemo(() => hasVehicleControlRig(character), [character]);
  const vcr = useMemo(() => getVehicleControlRig(character), [character]);
  const drones = useMemo(() => getOwnedDrones(character), [character]);

  const {
    isSessionActive,
    jumpIn,
    jumpOut,
    switchVRMode,
    handleForcedEjection,
    biofeedbackWarningLevel,
    riggingState,
  } = useRiggingSession();

  const { isJumpedIn, isBodyVulnerable, jumpedInState, targetName, vrMode } = useJumpedInState();

  const [selectedVRMode, setSelectedVRMode] = useState<RiggerVRMode>("cold-sim");
  const [lastEjectionResult, setLastEjectionResult] = useState<{
    damage: number;
    damageType: string;
    target: string | null;
  } | null>(null);

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
      id: v.id ?? v.catalogId ?? v.name,
      name: v.name,
      type: "vehicle" as const,
      pilot: v.pilot,
    })),
    ...drones.map((d) => ({
      id: d.id ?? d.catalogId ?? d.name,
      name: d.customName ?? d.name,
      type: "drone" as const,
      pilot: d.pilot,
    })),
  ];

  const handleJumpIn = (
    targetId: string,
    targetType: "vehicle" | "drone",
    targetNameStr: string
  ) => {
    jumpIn(targetId, targetType, targetNameStr, selectedVRMode);
    setLastEjectionResult(null);
  };

  const handleJumpOut = () => {
    jumpOut();
    setLastEjectionResult(null);
  };

  const handleForceEject = () => {
    const result = handleForcedEjection("link_severed");
    if (result) {
      setLastEjectionResult({
        damage: result.dumpshockDamage,
        damageType: result.damageType,
        target: result.previousTarget,
      });
    }
  };

  const biofeedbackStyle =
    WARNING_LEVEL_STYLES[biofeedbackWarningLevel] ?? WARNING_LEVEL_STYLES.safe;
  const biofeedbackDamage = riggingState?.biofeedbackDamageTaken ?? 0;

  return (
    <DisplayCard
      id="sheet-jump-in"
      title="Jump-In Control"
      icon={<PlugZap className="h-4 w-4 text-emerald-400" />}
      collapsible
    >
      <div className="space-y-3">
        {/* Body Vulnerable Warning */}
        {isJumpedIn && isBodyVulnerable && (
          <div
            data-testid="body-vulnerable-warning"
            className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-2.5 dark:border-red-900/50 dark:bg-red-950/40"
          >
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-500" />
            <div>
              <p className="text-[12px] font-semibold text-red-700 dark:text-red-400">
                Body Vulnerable
              </p>
              <p className="text-[11px] text-red-600 dark:text-red-400/80">
                Physical body is defenseless while jumped in to {targetName}
              </p>
            </div>
          </div>
        )}

        {/* Active Jump-In Status */}
        {isJumpedIn && jumpedInState && (
          <div data-testid="jumped-in-status" className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Jumped In
                </span>
                <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                  {targetName}
                </span>
              </div>
              {editable && (
                <button
                  data-testid="jump-out-button"
                  onClick={handleJumpOut}
                  className="flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-700 hover:bg-amber-500/20 dark:text-amber-400"
                >
                  <LogOut className="h-3 w-3" />
                  Jump Out
                </button>
              )}
            </div>

            {/* VR Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                VR Mode:
              </span>
              {vrMode && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${VR_MODE_BADGE[vrMode].style}`}
                >
                  {VR_MODE_BADGE[vrMode].label}
                </span>
              )}
              {editable && vrMode && (
                <button
                  data-testid="toggle-vr-mode"
                  onClick={() => switchVRMode(vrMode === "cold-sim" ? "hot-sim" : "cold-sim")}
                  className="rounded border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Switch to {vrMode === "cold-sim" ? "Hot-Sim" : "Cold-Sim"}
                </button>
              )}
              {vrMode === "hot-sim" && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
            </div>

            {/* Biofeedback Tracker */}
            <div data-testid="biofeedback-tracker" className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Biofeedback:
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${biofeedbackStyle.bg} ${biofeedbackStyle.text}`}
              >
                {biofeedbackStyle.label}
              </span>
              {biofeedbackDamage > 0 && (
                <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  {biofeedbackDamage}{" "}
                  {riggingState?.biofeedbackDamageType === "physical" ? "P" : "S"} taken
                </span>
              )}
            </div>

            {/* Forced Ejection (GM Tool) */}
            {editable && (
              <button
                data-testid="force-eject-button"
                onClick={handleForceEject}
                className="flex items-center gap-1 rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-500/20 dark:text-red-400"
              >
                <Zap className="h-3 w-3" />
                Force Ejection (Dumpshock)
              </button>
            )}
          </div>
        )}

        {/* Dumpshock Result */}
        {lastEjectionResult && (
          <div
            data-testid="dumpshock-result"
            className="rounded-lg border border-red-300 bg-red-50 p-2.5 dark:border-red-900/50 dark:bg-red-950/40"
          >
            <p className="text-[12px] font-semibold text-red-700 dark:text-red-400">Dumpshock!</p>
            <p className="text-[11px] text-red-600 dark:text-red-400/80">
              {lastEjectionResult.damage}
              {lastEjectionResult.damageType === "physical" ? "P" : "S"} damage
              {lastEjectionResult.target && ` — ejected from ${lastEjectionResult.target}`}
            </p>
          </div>
        )}

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

        {/* Jumpable Targets (when not jumped in) */}
        {!isJumpedIn && jumpTargets.length > 0 && (
          <div data-testid="jump-targets">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Available Targets ({jumpTargets.length})
            </div>

            {/* VR Mode Selection */}
            {isSessionActive && editable && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Mode:
                </span>
                <button
                  data-testid="select-cold-sim"
                  onClick={() => setSelectedVRMode("cold-sim")}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    selectedVRMode === "cold-sim"
                      ? VR_MODE_BADGE["cold-sim"].style
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                  }`}
                >
                  Cold-Sim
                </button>
                <button
                  data-testid="select-hot-sim"
                  onClick={() => setSelectedVRMode("hot-sim")}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    selectedVRMode === "hot-sim"
                      ? VR_MODE_BADGE["hot-sim"].style
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                  }`}
                >
                  Hot-Sim
                </button>
              </div>
            )}

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
                    {target.type === "vehicle" ? "Vehicle" : "Drone"}
                  </span>
                  <span className="ml-auto" />
                  <span className="shrink-0 rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                    Pilot {target.pilot}
                  </span>
                  {isSessionActive && editable && (
                    <button
                      data-testid={`jump-in-${target.id}`}
                      onClick={() => handleJumpIn(target.id, target.type, target.name)}
                      className="shrink-0 flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
                    >
                      <PlugZap className="h-3 w-3" />
                      Jump In
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VR Mode Preview (when not in session) */}
        {!isSessionActive && (
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
                <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {coldSimBenefits}
                </p>
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
        )}
      </div>
    </DisplayCard>
  );
}
