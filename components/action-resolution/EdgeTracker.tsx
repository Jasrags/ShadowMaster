"use client";

import React from "react";
import { Button } from "react-aria-components";
import { Zap, Plus, Minus, RotateCcw } from "lucide-react";

interface EdgeTrackerProps {
  /** Current Edge points */
  current: number;
  /** Maximum Edge points */
  maximum: number;
  /** Whether operations are loading */
  isLoading?: boolean;
  /** Callback when Edge is spent */
  onSpend?: (amount: number) => void;
  /** Callback when Edge is restored */
  onRestore?: (amount: number) => void;
  /** Callback when Edge is fully restored */
  onRestoreFull?: () => void;
  /** Whether to show controls */
  showControls?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether component is in compact mode */
  compact?: boolean;
}

export function EdgeTracker({
  current,
  maximum,
  isLoading = false,
  onSpend,
  onRestore,
  onRestoreFull,
  showControls = true,
  size = "md",
  compact = false,
}: EdgeTrackerProps) {
  const canSpend = current > 0 && !isLoading;
  const canRestore = current < maximum && !isLoading;

  // Size classes
  const sizeClasses = {
    sm: {
      container: "p-2",
      icon: "w-4 h-4",
      pip: "w-3 h-3",
      text: "text-xs",
      button: "w-6 h-6",
    },
    md: {
      container: "p-3",
      icon: "w-5 h-5",
      pip: "w-4 h-4",
      text: "text-sm",
      button: "w-8 h-8",
    },
    lg: {
      container: "p-4",
      icon: "w-6 h-6",
      pip: "w-5 h-5",
      text: "text-base",
      button: "w-10 h-10",
    },
  };

  const s = sizeClasses[size];

  // Render Edge pips
  const renderPips = () => {
    const pips = [];
    for (let i = 0; i < maximum; i++) {
      const isFilled = i < current;
      pips.push(
        <div
          key={i}
          className={`
            ${s.pip} rounded-full border-2 transition-all duration-200
            ${
              isFilled
                ? "bg-rose-500 border-rose-400 shadow-lg shadow-rose-500/30"
                : "bg-muted border-border"
            }
          `}
        />
      );
    }
    return pips;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Zap className={`${s.icon} text-rose-500 dark:text-rose-400`} />
        <span className={`font-mono font-bold text-rose-500 dark:text-rose-400 ${s.text}`}>
          {current}/{maximum}
        </span>
        {showControls && (
          <>
            <Button
              onPress={() => onSpend?.(1)}
              isDisabled={!canSpend}
              className={`
                ${s.button} rounded flex items-center justify-center
                bg-muted border border-border text-foreground
                hover:bg-muted/80
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Button
              onPress={() => onRestore?.(1)}
              isDisabled={!canRestore}
              className={`
                ${s.button} rounded flex items-center justify-center
                bg-muted border border-border text-foreground
                hover:bg-muted/80
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-lg border border-border bg-card/50
        ${s.container} relative
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className={`${s.icon} text-rose-500 dark:text-rose-400`} />
          <span className={`font-mono text-muted-foreground uppercase ${s.text}`}>
            Edge
          </span>
        </div>
        <span className={`font-mono font-bold text-rose-500 dark:text-rose-400 ${s.text}`}>
          {current} / {maximum}
        </span>
      </div>

      {/* Pips */}
      <div className="flex items-center gap-1.5 mb-3">{renderPips()}</div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center gap-2">
          <Button
            onPress={() => onSpend?.(1)}
            isDisabled={!canSpend}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              px-3 py-1.5 rounded
              bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30
              hover:bg-rose-500/30
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors ${s.text}
            `}
          >
            <Minus className="w-3 h-3" />
            Spend
          </Button>
          <Button
            onPress={() => onRestore?.(1)}
            isDisabled={!canRestore}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              px-3 py-1.5 rounded
              bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30
              hover:bg-emerald-500/30
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors ${s.text}
            `}
          >
            <Plus className="w-3 h-3" />
            Restore
          </Button>
          {onRestoreFull && (
            <Button
              onPress={onRestoreFull}
              isDisabled={current >= maximum || isLoading}
              className={`
                ${s.button} rounded flex items-center justify-center
                bg-muted border border-border text-muted-foreground
                hover:bg-muted/80 hover:text-foreground
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
              aria-label="Restore all Edge"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
