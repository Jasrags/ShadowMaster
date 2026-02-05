"use client";

/**
 * ToxinRow
 *
 * Compact display for a purchased toxin item.
 * Line 1: Name, qty badge, legality badge, cost, remove
 * Line 2: Vector • Power • Penetration
 * Expandable for full effects and description.
 */

import { useState } from "react";
import type { GearItem } from "@/lib/types";
import { LegalityBadge } from "@/components/creation/shared/LegalityBadge";
import { ChevronDown, ChevronRight, X } from "lucide-react";

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// =============================================================================
// TYPES
// =============================================================================

interface ToxinRowProps {
  toxin: GearItem;
  onRemove: (id: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ToxinRow({ toxin, onRemove }: ToxinRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalCost = toxin.cost * toxin.quantity;

  // Extract toxin-specific metadata stored during purchase
  const meta = (toxin as GearItem & { metadata?: Record<string, unknown> }).metadata;
  const vector = (meta?.vector as string[]) || [];
  const speed = (meta?.speed as string) || "";
  const power = (meta?.power as number) ?? 0;
  const penetration = (meta?.penetration as number) ?? 0;
  const effects = (meta?.effects as string[]) || [];
  const duration = (meta?.duration as string) || "";
  const description = (meta?.description as string) || toxin.notes || "";

  return (
    <div className="py-1.5">
      {/* Line 1: Name and controls */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>

          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {toxin.name}
          </span>

          {toxin.quantity > 1 && (
            <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              x{toxin.quantity}
            </span>
          )}
          <LegalityBadge legality={toxin.legality} availability={toxin.availability} />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(totalCost)}¥
          </span>
          <div className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
          <button
            onClick={() => toxin.id && onRemove(toxin.id)}
            className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            title="Remove toxin"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Line 2: Vector, power, penetration */}
      <div className="ml-5 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
        {vector.length > 0 && vector.join(", ")}
        {power > 0 && ` • Power ${power}`}
        {penetration !== 0 && ` • Pen ${penetration}`}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {speed && (
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Speed</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{speed}</span>
              </div>
            )}
            {duration && (
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Duration</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{duration}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Cost/dose</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatCurrency(toxin.cost)}¥
              </span>
            </div>
          </div>

          {/* Effects */}
          {effects.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Effects
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {effects.map((effect) => (
                  <span
                    key={effect}
                    className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    {effect.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {description && <p className="text-xs text-zinc-600 dark:text-zinc-400">{description}</p>}
        </div>
      )}
    </div>
  );
}
