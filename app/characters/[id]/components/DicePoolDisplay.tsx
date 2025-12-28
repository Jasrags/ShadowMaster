"use client";

/**
 * DicePoolDisplay Component
 *
 * Displays a dice pool with full modifier breakdown, showing how the
 * final pool is calculated from base values, modifiers, and penalties.
 *
 * Satisfies:
 * - Requirement: "Dice pools MUST show a breakdown of contributing factors"
 * - Requirement: "Wound modifiers MUST be reflected in all dice pool displays"
 */

import { useMemo } from "react";
import { THEMES, DEFAULT_THEME, type Theme } from "@/lib/themes";

// =============================================================================
// TYPES
// =============================================================================

export interface PoolModifier {
  label: string;
  value: number;
  type: "attribute" | "skill" | "quality" | "wound" | "gear" | "situational" | "other";
  color?: string;
}

export interface DicePoolDisplayProps {
  label: string;
  basePool: number;
  modifiers?: PoolModifier[];
  woundModifier?: number;
  limit?: {
    value: number;
    type: "physical" | "mental" | "social" | "weapon" | "other";
  };
  specialization?: string;
  theme?: Theme;
  onClick?: () => void;
  compact?: boolean; // Minimal display for tables
}

// =============================================================================
// HELPERS
// =============================================================================

const LIMIT_COLORS = {
  physical: "text-red-400",
  mental: "text-blue-400",
  social: "text-pink-400",
  weapon: "text-orange-400",
  other: "text-zinc-400",
};

const MODIFIER_TYPE_COLORS: Record<PoolModifier["type"], string> = {
  attribute: "text-blue-400",
  skill: "text-emerald-400",
  quality: "text-violet-400",
  wound: "text-red-400",
  gear: "text-amber-400",
  situational: "text-cyan-400",
  other: "text-zinc-400",
};

// =============================================================================
// COMPONENT
// =============================================================================

export function DicePoolDisplay({
  label,
  basePool,
  modifiers = [],
  woundModifier = 0,
  limit,
  specialization,
  theme,
  onClick,
  compact = false,
}: DicePoolDisplayProps) {
  const t = theme || THEMES[DEFAULT_THEME];

  // Calculate total pool
  const totalPool = useMemo(() => {
    const modifierSum = modifiers.reduce((sum, m) => sum + m.value, 0);
    const specBonus = specialization ? 2 : 0;
    return Math.max(0, basePool + modifierSum + woundModifier + specBonus);
  }, [basePool, modifiers, woundModifier, specialization]);

  // Determine if pool is limited
  const isLimited = limit && totalPool > limit.value;
  const effectivePool = isLimited ? limit.value : totalPool;

  // Compact mode for table cells
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          inline-flex items-center gap-1 px-2 py-1 rounded transition-colors
          hover:bg-muted/50 cursor-pointer group
          ${t.fonts.mono}
        `}
      >
        <span
          className={`font-bold tabular-nums ${
            woundModifier < 0 ? "text-amber-400" : t.colors.accent
          }`}
        >
          {effectivePool}
        </span>
        {isLimited && (
          <span className={`text-[10px] ${LIMIT_COLORS[limit.type]}`}>
            [{limit.value}]
          </span>
        )}
        {woundModifier < 0 && (
          <span className="text-[10px] text-red-400 opacity-70">
            ({woundModifier})
          </span>
        )}
      </button>
    );
  }

  // Full display mode
  return (
    <div
      onClick={onClick}
      className={`
        p-3 rounded border transition-all
        ${onClick ? "cursor-pointer hover:border-emerald-500/50" : ""}
        ${t.colors.card} ${t.colors.border}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {/* Final Pool */}
          <span
            className={`text-xl font-bold ${t.fonts.mono} tabular-nums ${
              woundModifier < 0 ? "text-amber-400" : t.colors.accent
            }`}
          >
            {effectivePool}
          </span>
          {/* Limit indicator */}
          {limit && (
            <span
              className={`text-xs ${t.fonts.mono} ${LIMIT_COLORS[limit.type]}`}
            >
              [{limit.value}]
            </span>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className={`text-xs ${t.fonts.mono} space-y-1`}>
        {/* Base pool line */}
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Base</span>
          <span className="tabular-nums">{basePool}</span>
        </div>

        {/* Modifiers */}
        {modifiers.map((mod, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between ${
              mod.color || MODIFIER_TYPE_COLORS[mod.type]
            }`}
          >
            <span className="truncate max-w-[150px]">{mod.label}</span>
            <span className="tabular-nums">
              {mod.value >= 0 ? "+" : ""}
              {mod.value}
            </span>
          </div>
        ))}

        {/* Specialization bonus */}
        {specialization && (
          <div className="flex items-center justify-between text-violet-400">
            <span className="truncate max-w-[150px]">{specialization}</span>
            <span className="tabular-nums">+2</span>
          </div>
        )}

        {/* Wound modifier */}
        {woundModifier !== 0 && (
          <div className="flex items-center justify-between text-red-400">
            <span>Wound Penalty</span>
            <span className="tabular-nums">{woundModifier}</span>
          </div>
        )}

        {/* Divider and total */}
        <div className="border-t border-border/30 pt-1 mt-1">
          <div className="flex items-center justify-between font-bold">
            <span className="text-muted-foreground">Total</span>
            <span
              className={`tabular-nums ${
                isLimited ? "text-amber-400 line-through" : ""
              }`}
            >
              {totalPool}
            </span>
          </div>
          {isLimited && (
            <div className="flex items-center justify-between font-bold text-amber-400">
              <span>Limited to</span>
              <span className="tabular-nums">{limit.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

