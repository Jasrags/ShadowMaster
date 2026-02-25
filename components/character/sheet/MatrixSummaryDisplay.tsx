"use client";

import { useMemo } from "react";
import type { Character } from "@/lib/types";
import type { CyberdeckAttributeConfig } from "@/lib/types/matrix";
import { DisplayCard } from "./DisplayCard";
import { Monitor, AlertTriangle } from "lucide-react";
import {
  getActiveCyberdeck,
  getCharacterCommlinks,
  calculateMatrixConditionMonitor,
  getInitiativeDiceBonus,
} from "@/lib/rules/matrix/cyberdeck-validator";
import { getOverwatchWarningLevel } from "@/lib/rules/matrix/overwatch-calculator";

interface MatrixSummaryDisplayProps {
  character: Character;
  onCharacterUpdate?: (updated: Character) => void;
  editable?: boolean;
  /** Current connection mode (from combat session). Defaults to "ar". */
  connectionMode?: "ar" | "cold-sim-vr" | "hot-sim-vr";
  /** Current overwatch score (from combat session). Defaults to 0. */
  overwatchScore?: number;
}

// ASDF attribute display order and labels
const ASDF_ATTRIBUTES: { key: keyof CyberdeckAttributeConfig; label: string; abbr: string }[] = [
  { key: "attack", label: "Attack", abbr: "ATK" },
  { key: "sleaze", label: "Sleaze", abbr: "SLZ" },
  { key: "dataProcessing", label: "Data Proc.", abbr: "DP" },
  { key: "firewall", label: "Firewall", abbr: "FW" },
];

const CONNECTION_MODE_DISPLAY: Record<string, { label: string; style: string }> = {
  ar: {
    label: "AR",
    style: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  "cold-sim-vr": {
    label: "Cold-Sim VR",
    style: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  "hot-sim-vr": {
    label: "Hot-Sim VR",
    style: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
};

const OS_WARNING_COLORS: Record<string, { bar: string; text: string }> = {
  safe: { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  caution: { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  warning: { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  danger: { bar: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  critical: { bar: "bg-red-600", text: "text-red-600 dark:text-red-400" },
};

export function MatrixSummaryDisplay({
  character,
  connectionMode: connectionModeProp,
  overwatchScore: overwatchScoreProp,
}: MatrixSummaryDisplayProps) {
  const activeDeck = useMemo(() => getActiveCyberdeck(character), [character]);
  const commlinks = useMemo(() => getCharacterCommlinks(character), [character]);

  // Determine the active device info
  const activeDevice = useMemo(() => {
    if (activeDeck) {
      return {
        name: activeDeck.customName || activeDeck.name,
        type: "cyberdeck" as const,
        deviceRating: activeDeck.deviceRating,
        config: activeDeck.currentConfig,
      };
    }
    // Fallback to first commlink
    const commlink = commlinks[0];
    if (commlink) {
      return {
        name: commlink.name,
        type: "commlink" as const,
        deviceRating: commlink.deviceRating,
        config: null,
      };
    }
    return null;
  }, [activeDeck, commlinks]);

  const conditionMonitor = useMemo(
    () => (activeDevice ? calculateMatrixConditionMonitor(activeDevice.deviceRating) : 0),
    [activeDevice]
  );

  const connectionMode = connectionModeProp ?? "ar";
  const initiativeBonus = useMemo(() => getInitiativeDiceBonus(connectionMode), [connectionMode]);

  const overwatchScore = overwatchScoreProp ?? 0;
  const osWarningLevel = useMemo(() => getOverwatchWarningLevel(overwatchScore), [overwatchScore]);

  // Find highest ASDF attribute for highlighting
  const highestAsdf = useMemo(() => {
    if (!activeDevice?.config) return null;
    const config = activeDevice.config;
    let maxKey: keyof CyberdeckAttributeConfig = "attack";
    let maxVal = 0;
    for (const { key } of ASDF_ATTRIBUTES) {
      if (config[key] > maxVal) {
        maxVal = config[key];
        maxKey = key;
      }
    }
    return maxKey;
  }, [activeDevice]);

  if (!activeDevice) return null;

  const modeDisplay = CONNECTION_MODE_DISPLAY[connectionMode] ?? CONNECTION_MODE_DISPLAY.ar;
  const osColors = OS_WARNING_COLORS[osWarningLevel] ?? OS_WARNING_COLORS.safe;
  const osPercentage = Math.min((overwatchScore / 40) * 100, 100);

  const deviceTypeBadge: Record<string, { label: string; style: string }> = {
    cyberdeck: {
      label: "Cyberdeck",
      style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    commlink: {
      label: "Commlink",
      style: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    },
    rcc: {
      label: "RCC",
      style: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
    },
  };

  const typeBadge = deviceTypeBadge[activeDevice.type] ?? deviceTypeBadge.commlink;

  return (
    <DisplayCard
      id="sheet-matrix-summary"
      title="Matrix"
      icon={<Monitor className="h-4 w-4 text-emerald-400" />}
      collapsible
    >
      <div className="space-y-3">
        {/* Active Device */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
              {activeDevice.name}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeBadge.style}`}
            >
              {typeBadge.label}
            </span>
          </div>
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
            DR {activeDevice.deviceRating}
          </span>
        </div>

        {/* ASDF Stats (cyberdeck only) */}
        {activeDevice.config && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              ASDF Configuration
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {ASDF_ATTRIBUTES.map(({ key, abbr }) => {
                const value = activeDevice.config![key];
                const isHighest = key === highestAsdf;
                return (
                  <div key={key} className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                      {abbr}
                    </span>
                    <span
                      className={`w-full rounded px-1.5 py-1 text-center font-mono text-sm font-bold ${
                        isHighest
                          ? "border border-emerald-500/30 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                          : "border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Condition Monitor */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Matrix Condition Monitor</span>
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
            {conditionMonitor} boxes
          </span>
        </div>

        {/* Connection Mode */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Connection Mode</span>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${modeDisplay.style}`}
            >
              {modeDisplay.label}
            </span>
            {initiativeBonus > 0 && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                +{initiativeBonus}d6 Init
              </span>
            )}
          </div>
        </div>

        {/* Overwatch Score (cyberdeck only) */}
        {activeDevice.type === "cyberdeck" && overwatchScore > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <AlertTriangle className={`h-3 w-3 ${osColors.text}`} />
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${osColors.text}`}
                >
                  Overwatch Score
                </span>
              </div>
              <span className={`font-mono text-[10px] font-semibold ${osColors.text}`}>
                {overwatchScore} / 40
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${osColors.bar}`}
                style={{ width: `${osPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
