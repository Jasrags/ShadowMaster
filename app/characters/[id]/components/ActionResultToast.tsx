"use client";

/**
 * Action Result Toast Component
 *
 * Displays the results of combat actions in a toast notification.
 * Shows dice rolls, hits, glitches, and outcome status.
 *
 * Phase 5.3.4: Action Result Display
 */

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "react-aria-components";
import { X, Check, AlertTriangle, Skull, Dice6, Swords, Shield, Target, Zap } from "lucide-react";
import type { Theme } from "@/lib/themes";

export interface ActionResult {
  /** Unique ID for this result */
  id: string;
  /** Type of action performed */
  actionType: "attack" | "defense" | "resistance" | "test" | "initiative";
  /** Name/description of the action */
  actionName: string;
  /** Actor who performed the action */
  actorName: string;
  /** Target of the action (if any) */
  targetName?: string;
  /** Dice pool used */
  dicePool: number;
  /** Individual die results */
  diceResults: number[];
  /** Number of hits (5s and 6s) */
  hits: number;
  /** Number of 1s rolled */
  ones: number;
  /** Whether this is a glitch */
  isGlitch: boolean;
  /** Whether this is a critical glitch */
  isCriticalGlitch: boolean;
  /** Limit applied (if any) */
  limit?: number;
  /** Hits after limit applied */
  limitedHits?: number;
  /** Outcome description */
  outcome?: string;
  /** Timestamp */
  timestamp: number;
}

interface ActionResultToastProps {
  /** Action result to display */
  result: ActionResult;
  /** Current theme */
  theme: Theme;
  /** Callback when toast is dismissed */
  onDismiss: (id: string) => void;
  /** Auto-dismiss timeout in ms (0 to disable) */
  autoCloseMs?: number;
  /** Position on screen */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

/**
 * Get icon for action type
 */
function getActionIcon(type: ActionResult["actionType"]): React.ReactNode {
  switch (type) {
    case "attack":
      return <Swords className="w-5 h-5" />;
    case "defense":
      return <Shield className="w-5 h-5" />;
    case "resistance":
      return <Shield className="w-5 h-5" />;
    case "initiative":
      return <Zap className="w-5 h-5" />;
    default:
      return <Dice6 className="w-5 h-5" />;
  }
}

/**
 * Get color scheme based on result
 */
function getResultColors(result: ActionResult): {
  border: string;
  bg: string;
  accent: string;
  icon: string;
} {
  if (result.isCriticalGlitch) {
    return {
      border: "border-red-500",
      bg: "bg-red-500/10",
      accent: "text-red-500",
      icon: "bg-red-500",
    };
  }
  if (result.isGlitch) {
    return {
      border: "border-amber-500",
      bg: "bg-amber-500/10",
      accent: "text-amber-500",
      icon: "bg-amber-500",
    };
  }
  if (result.hits >= 4) {
    return {
      border: "border-emerald-500",
      bg: "bg-emerald-500/10",
      accent: "text-emerald-500",
      icon: "bg-emerald-500",
    };
  }
  if (result.hits >= 1) {
    return {
      border: "border-blue-500",
      bg: "bg-blue-500/10",
      accent: "text-blue-500",
      icon: "bg-blue-500",
    };
  }
  return {
    border: "border-muted",
    bg: "bg-muted/30",
    accent: "text-muted-foreground",
    icon: "bg-muted",
  };
}

/**
 * Render dice as colored pips
 */
function DiceDisplay({ dice, theme }: { dice: number[]; theme: Theme }) {
  return (
    <div className="flex flex-wrap gap-1">
      {dice.map((value, index) => {
        const isHit = value >= 5;
        const isOne = value === 1;

        return (
          <div
            key={index}
            className={`
              w-6 h-6 rounded flex items-center justify-center text-xs font-bold
              ${theme.fonts.mono}
              ${
                isHit
                  ? "bg-emerald-500 text-white"
                  : isOne
                    ? "bg-red-500/30 text-red-500 border border-red-500/50"
                    : "bg-muted text-muted-foreground"
              }
            `}
          >
            {value}
          </div>
        );
      })}
    </div>
  );
}

export function ActionResultToast({
  result,
  theme,
  onDismiss,
  autoCloseMs = 8000,
  position = "bottom-right",
}: ActionResultToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(100);

  const colors = getResultColors(result);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onDismiss(result.id), 300);
  }, [onDismiss, result.id]);

  // Auto-close timer
  useEffect(() => {
    if (autoCloseMs <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / autoCloseMs) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        handleDismiss();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [autoCloseMs, handleDismiss]);

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed ${positionClasses[position]} z-50
        w-80 rounded-lg border overflow-hidden shadow-xl
        ${colors.border} ${colors.bg}
        animate-in slide-in-from-right duration-300
      `}
    >
      {/* Progress bar */}
      {autoCloseMs > 0 && (
        <div className={`h-0.5 ${colors.icon}`} style={{ width: `${progress}%` }} />
      )}

      {/* Header */}
      <div className="flex items-start gap-3 p-3">
        {/* Action Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${colors.icon}`}
        >
          {result.isCriticalGlitch ? (
            <Skull className="w-5 h-5" />
          ) : result.isGlitch ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            getActionIcon(result.actionType)
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`font-bold ${theme.colors.heading}`}>{result.actionName}</span>
            <Button
              onPress={handleDismiss}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          <div className={`text-xs ${theme.colors.muted} mt-0.5`}>
            {result.actorName}
            {result.targetName && (
              <>
                <Target className="w-3 h-3 inline mx-1" />
                {result.targetName}
              </>
            )}
          </div>

          {/* Hits Summary */}
          <div className="flex items-center gap-3 mt-2">
            <div className={`text-lg font-bold ${theme.fonts.mono} ${colors.accent}`}>
              {result.limitedHits ?? result.hits} hits
            </div>
            {result.limit && result.hits > result.limit && (
              <span className={`text-xs ${theme.colors.muted}`}>(limited from {result.hits})</span>
            )}
            <span className={`text-xs ${theme.fonts.mono} ${theme.colors.muted}`}>
              {result.dicePool}d6
            </span>
          </div>

          {/* Glitch Warning */}
          {(result.isGlitch || result.isCriticalGlitch) && (
            <div
              className={`
              flex items-center gap-1.5 mt-2 text-xs font-bold
              ${result.isCriticalGlitch ? "text-red-500" : "text-amber-500"}
            `}
            >
              <AlertTriangle className="w-4 h-4" />
              {result.isCriticalGlitch ? "CRITICAL GLITCH!" : "Glitch!"}
            </div>
          )}

          {/* Outcome */}
          {result.outcome && (
            <div className={`text-sm mt-2 ${theme.colors.muted}`}>{result.outcome}</div>
          )}
        </div>
      </div>

      {/* Expandable dice display */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full px-3 py-1.5 text-xs border-t flex items-center justify-between
          ${theme.colors.border} hover:bg-muted/30 transition-colors
        `}
      >
        <span className={theme.colors.muted}>{isExpanded ? "Hide dice" : "Show dice"}</span>
        <span className={`${theme.fonts.mono} ${theme.colors.muted}`}>
          {result.ones > 0 && <span className="text-red-400 mr-2">1s: {result.ones}</span>}
          5s & 6s: {result.hits}
        </span>
      </button>

      {isExpanded && (
        <div className="p-3 border-t border-border/50 bg-background/50">
          <DiceDisplay dice={result.diceResults} theme={theme} />
        </div>
      )}
    </div>
  );
}

/**
 * Container for managing multiple action result toasts
 */
interface ActionResultToastContainerProps {
  /** Results to display */
  results: ActionResult[];
  /** Current theme */
  theme: Theme;
  /** Callback when a result is dismissed */
  onDismiss: (id: string) => void;
  /** Max results to show at once */
  maxVisible?: number;
}

export function ActionResultToastContainer({
  results,
  theme,
  onDismiss,
  maxVisible = 3,
}: ActionResultToastContainerProps) {
  // Sort by timestamp and limit
  const visibleResults = results.sort((a, b) => b.timestamp - a.timestamp).slice(0, maxVisible);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {visibleResults.map((result, index) => (
        <div key={result.id} style={{ transform: `translateY(${index * -8}px)` }}>
          <ActionResultToast
            result={result}
            theme={theme}
            onDismiss={onDismiss}
            autoCloseMs={8000 + index * 1000}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Hook for managing action results
 */
export function useActionResults() {
  const [results, setResults] = useState<ActionResult[]>([]);

  const addResult = useCallback((result: Omit<ActionResult, "id" | "timestamp">) => {
    const newResult: ActionResult = {
      ...result,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setResults((prev) => [...prev, newResult]);
    return newResult.id;
  }, []);

  const dismissResult = useCallback((id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    addResult,
    dismissResult,
    clearAll,
  };
}
