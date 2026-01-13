"use client";

/**
 * Interactive Condition Monitor Component
 *
 * A clickable condition monitor that allows players to apply/heal damage
 * by clicking individual boxes. Shows wound modifier penalties.
 *
 * Satisfies:
 * - Requirement: "Condition monitors MUST visually track physical and stun damage,
 *   including the automatic identification of associated penalties"
 * - Requirement: "integrated tools for rapid gameplay actions"
 */

import { useState, useCallback, useRef } from "react";
import { THEMES, DEFAULT_THEME, type Theme } from "@/lib/themes";
import type { ID } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

export interface InteractiveConditionMonitorProps {
  characterId: ID;
  type: "physical" | "stun" | "overflow";
  current: number;
  max: number;
  penaltyInterval?: number; // Boxes per -1 penalty (default: 3)
  theme?: Theme;
  onDamageApplied?: (newValue: number, woundModifier: number) => void;
  readonly?: boolean; // True for finalized characters without edit permission
}

interface DamageResponse {
  success: boolean;
  character: {
    condition: {
      physicalDamage: number;
      stunDamage: number;
      overflowDamage: number;
    };
    woundModifier: number;
  };
  overflow?: {
    physical: number;
    stun: number;
  };
  error?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function InteractiveConditionMonitor({
  characterId,
  type,
  current,
  max,
  penaltyInterval = 3,
  theme,
  onDamageApplied,
  readonly = false,
}: InteractiveConditionMonitorProps) {
  const t = theme || THEMES[DEFAULT_THEME];
  const [localCurrent, setLocalCurrent] = useState(current);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with external changes
  if (current !== localCurrent && !isLoading) {
    setLocalCurrent(current);
  }

  // Calculate wound modifier for display
  const woundModifier = type !== "overflow" ? -Math.floor(localCurrent / penaltyInterval) : 0;

  // Color classes based on type
  const colorClasses = {
    physical: {
      filled: "bg-red-500 border-red-400 shadow-red-500/50",
      empty:
        t.id === "modern-card"
          ? "border-red-200 bg-red-50 hover:bg-red-100"
          : "border-red-900/50 bg-red-950/30 hover:bg-red-900/50",
      text: "text-red-500 dark:text-red-400",
      penalty: "text-red-400",
    },
    stun: {
      filled: "bg-amber-500 border-amber-400 shadow-amber-500/50",
      empty:
        t.id === "modern-card"
          ? "border-amber-200 bg-amber-50 hover:bg-amber-100"
          : "border-amber-900/50 bg-amber-950/30 hover:bg-amber-900/50",
      text: "text-amber-600 dark:text-amber-400",
      penalty: "text-amber-400",
    },
    overflow: {
      filled: "bg-zinc-500 border-zinc-400 shadow-zinc-500/50",
      empty:
        t.id === "modern-card"
          ? "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
          : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800",
      text: "text-zinc-500 dark:text-zinc-400",
      penalty: "text-zinc-400",
    },
  };
  const colors = colorClasses[type];

  // Apply damage via API
  const applyDamage = useCallback(
    async (newValue: number) => {
      if (readonly) return;
      if (newValue === localCurrent) return;

      const amount = newValue - localCurrent;
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/characters/${characterId}/damage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            amount,
            source: "condition monitor interaction",
          }),
        });

        const data: DamageResponse = await response.json();

        if (data.success) {
          const updatedValue =
            type === "physical"
              ? data.character.condition.physicalDamage
              : type === "stun"
                ? data.character.condition.stunDamage
                : data.character.condition.overflowDamage;

          setLocalCurrent(updatedValue);
          onDamageApplied?.(updatedValue, data.character.woundModifier);
        } else {
          setError(data.error || "Failed to apply damage");
          // Revert optimistic update
          setLocalCurrent(current);
        }
      } catch {
        setError("Network error");
        setLocalCurrent(current);
      } finally {
        setIsLoading(false);
      }
    },
    [characterId, type, localCurrent, current, onDamageApplied, readonly]
  );

  // Handle single box click
  const handleBoxClick = useCallback(
    (boxIndex: number) => {
      if (readonly || isLoading) return;

      // Toggle: if clicking a filled box, heal to that point
      // If clicking an empty box, apply damage to that point
      const newValue = boxIndex < localCurrent ? boxIndex : boxIndex + 1;
      applyDamage(newValue);
    },
    [localCurrent, applyDamage, readonly, isLoading]
  );

  // Drag handlers for multi-box selection
  const handleDragStart = useCallback(
    (boxIndex: number) => {
      if (readonly || isLoading) return;
      setDragStart(boxIndex);
      setDragEnd(boxIndex);
    },
    [readonly, isLoading]
  );

  const handleDragOver = useCallback(
    (boxIndex: number) => {
      if (dragStart !== null) {
        setDragEnd(boxIndex);
      }
    },
    [dragStart]
  );

  const handleDragEnd = useCallback(() => {
    if (dragStart !== null && dragEnd !== null) {
      const minIndex = Math.min(dragStart, dragEnd);
      const maxIndex = Math.max(dragStart, dragEnd);

      // If starting from a filled box, we're healing
      // If starting from an empty box, we're applying damage
      const isFilledAtStart = dragStart < localCurrent;
      const newValue = isFilledAtStart ? minIndex : maxIndex + 1;

      applyDamage(newValue);
    }
    setDragStart(null);
    setDragEnd(null);
  }, [dragStart, dragEnd, localCurrent, applyDamage]);

  // Check if box is in drag selection
  const isInDragSelection = (boxIndex: number): boolean => {
    if (dragStart === null || dragEnd === null) return false;
    const minIndex = Math.min(dragStart, dragEnd);
    const maxIndex = Math.max(dragStart, dragEnd);
    return boxIndex >= minIndex && boxIndex <= maxIndex;
  };

  // Build label
  const labelMap = {
    physical: "Physical",
    stun: "Stun",
    overflow: "Overflow",
  };
  const label = labelMap[type];

  // Render boxes in rows of 3 (with penalty markers) for physical/stun
  // Render in a single row for overflow
  const isStandard = type === "physical" || type === "stun";

  let content;
  if (isStandard) {
    const rows = [];
    for (let i = 0; i < max; i += penaltyInterval) {
      const boxesInRow = [];
      for (let j = 0; j < penaltyInterval; j++) {
        const boxIndex = i + j;
        if (boxIndex >= max) break;

        const isFilled = boxIndex < localCurrent;
        const isSelected = isInDragSelection(boxIndex);

        boxesInRow.push(
          <button
            key={boxIndex}
            type="button"
            disabled={readonly || isLoading}
            onClick={() => handleBoxClick(boxIndex)}
            onMouseDown={() => handleDragStart(boxIndex)}
            onMouseEnter={() => handleDragOver(boxIndex)}
            onMouseUp={handleDragEnd}
            className={`
              h-6 w-6 border-2 transition-all cursor-pointer
              ${isFilled ? `${colors.filled} shadow-sm` : colors.empty}
              ${isSelected ? "ring-2 ring-white ring-offset-1" : ""}
              ${readonly || isLoading ? "cursor-not-allowed opacity-50" : ""}
              ${t.id === "modern-card" ? "rounded-sm" : ""}
            `}
            style={
              t.id === "neon-rain"
                ? {
                    clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)",
                  }
                : undefined
            }
            aria-label={`${label} damage box ${boxIndex + 1} of ${max}${isFilled ? " (filled)" : ""}`}
            data-testid={`${type}-box-${boxIndex}`}
          />
        );
      }

      const penalty = Math.floor((i + penaltyInterval) / penaltyInterval);
      rows.push(
        <div key={i} className="flex items-center gap-1.5">
          <div className="flex gap-1">{boxesInRow}</div>
          <span className={`text-[9px] font-bold ${colors.penalty} tabular-nums w-5 text-right`}>
            -{penalty}
          </span>
        </div>
      );
    }
    content = <div className="flex flex-col gap-2">{rows}</div>;
  } else {
    // Overflow - single row
    const boxes = [];
    for (let i = 0; i < max; i++) {
      const isFilled = i < localCurrent;
      const isSelected = isInDragSelection(i);

      boxes.push(
        <button
          key={i}
          type="button"
          disabled={readonly || isLoading}
          onClick={() => handleBoxClick(i)}
          onMouseDown={() => handleDragStart(i)}
          onMouseEnter={() => handleDragOver(i)}
          onMouseUp={handleDragEnd}
          className={`
            h-6 w-6 border-2 transition-all cursor-pointer
            ${isFilled ? `${colors.filled} shadow-sm` : colors.empty}
            ${isSelected ? "ring-2 ring-white ring-offset-1" : ""}
            ${readonly || isLoading ? "cursor-not-allowed opacity-50" : ""}
            ${t.id === "modern-card" ? "rounded-sm" : ""}
          `}
          style={
            t.id === "neon-rain"
              ? {
                  clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)",
                }
              : undefined
          }
          aria-label={`${label} damage box ${i + 1} of ${max}${isFilled ? " (filled)" : ""}`}
          data-testid={`${type}-box-${i}`}
        />
      );
    }
    content = <div className="flex flex-wrap gap-2 items-start">{boxes}</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseLeave={handleDragEnd}
      className={`
        p-3 rounded transition-colors group
        ${t.id === "modern-card" ? "bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800" : "hover:bg-muted/30"}
        ${isLoading ? "animate-pulse" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border/10">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] ${t.fonts.mono} font-bold uppercase tracking-wider text-muted-foreground group-hover:${colors.text} transition-colors`}
          >
            {label}
          </span>
          <span
            className={`text-[10px] ${t.fonts.mono} font-bold text-muted-foreground/40 tabular-nums`}
          >
            [{localCurrent}/{max}]
          </span>
        </div>

        {/* Wound modifier display (only for physical/stun) */}
        {type !== "overflow" && woundModifier !== 0 && (
          <span
            className={`text-xs font-bold ${colors.penalty} tabular-nums`}
            data-testid="wound-modifier"
          >
            Wound: {woundModifier}
          </span>
        )}
      </div>

      {/* Boxes */}
      {content}

      {/* Error display */}
      {error && <div className="mt-2 text-xs text-red-500 font-medium">{error}</div>}
    </div>
  );
}
