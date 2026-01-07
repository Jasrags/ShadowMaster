"use client";

/**
 * EncumbranceBar - Visual display of character carrying capacity
 *
 * Displays:
 * - Current weight / max capacity progress bar
 * - Color-coded status (green/yellow/red)
 * - Penalty display when encumbered
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import { useMemo } from "react";
import { Weight, AlertTriangle } from "lucide-react";
import type { EncumbranceState } from "@/lib/types/gear-state";

// =============================================================================
// TYPES
// =============================================================================

interface EncumbranceBarProps {
  /** Encumbrance state from character */
  encumbrance: EncumbranceState;
  /** Show detailed breakdown */
  showDetails?: boolean;
  /** Compact mode for inline display */
  compact?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatWeight(kg: number): string {
  if (kg < 1) {
    return `${Math.round(kg * 1000)}g`;
  }
  return `${kg.toFixed(1)}kg`;
}

function getStatusColor(encumbrance: EncumbranceState): {
  bar: string;
  text: string;
  border: string;
} {
  const { currentWeight, maxCapacity } = encumbrance;
  const percentage = (currentWeight / maxCapacity) * 100;

  if (percentage > 100) {
    // Encumbered - red
    return {
      bar: "bg-red-500",
      text: "text-red-400",
      border: "border-l-red-500",
    };
  }
  if (percentage > 75) {
    // Warning - yellow
    return {
      bar: "bg-yellow-500",
      text: "text-yellow-400",
      border: "border-l-yellow-500",
    };
  }
  // Good - green/emerald
  return {
    bar: "bg-emerald-500",
    text: "text-emerald-400",
    border: "border-l-emerald-500",
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EncumbranceBar({
  encumbrance,
  showDetails = false,
  compact = false,
}: EncumbranceBarProps) {
  const { currentWeight, maxCapacity, overweightPenalty, isEncumbered } = encumbrance;

  const percentage = useMemo(() => {
    return Math.min((currentWeight / maxCapacity) * 100, 100);
  }, [currentWeight, maxCapacity]);

  const overflowPercentage = useMemo(() => {
    if (currentWeight <= maxCapacity) return 0;
    return Math.min(((currentWeight - maxCapacity) / maxCapacity) * 100, 50);
  }, [currentWeight, maxCapacity]);

  const colors = getStatusColor(encumbrance);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Weight className={`w-3 h-3 ${colors.text}`} />
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs font-mono ${colors.text}`}>
          {formatWeight(currentWeight)}
        </span>
        {isEncumbered && (
          <span className="text-xs text-red-400 font-mono">-{overweightPenalty}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg border border-zinc-800 border-l-2 ${colors.border} bg-zinc-900`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Weight className={`w-4 h-4 ${colors.text}`} />
          <span className="text-sm font-medium text-zinc-300">Encumbrance</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-mono ${colors.text}`}>
            {formatWeight(currentWeight)} / {formatWeight(maxCapacity)}
          </span>
          {isEncumbered && (
            <span className="flex items-center gap-1 text-xs text-red-400 font-medium">
              <AlertTriangle className="w-3 h-3" />
              -{overweightPenalty} pool
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
        {/* Main fill */}
        <div
          className={`absolute left-0 top-0 h-full ${colors.bar} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
        {/* Overflow indicator */}
        {overflowPercentage > 0 && (
          <div
            className="absolute top-0 h-full bg-red-500/50 animate-pulse"
            style={{ left: "100%", width: `${overflowPercentage}%`, marginLeft: "-2px" }}
          />
        )}
      </div>

      {/* Capacity markers */}
      {showDetails && (
        <div className="flex justify-between mt-1 text-[10px] text-zinc-600">
          <span>0</span>
          <span>{formatWeight(maxCapacity * 0.5)}</span>
          <span>{formatWeight(maxCapacity)}</span>
        </div>
      )}

      {/* Encumbered warning */}
      {isEncumbered && showDetails && (
        <div className="mt-2 p-2 rounded bg-red-500/10 border border-red-500/20">
          <p className="text-xs text-red-400">
            Carrying {formatWeight(currentWeight - maxCapacity)} over capacity.
            All physical dice pools suffer a -{overweightPenalty} penalty.
          </p>
        </div>
      )}
    </div>
  );
}
