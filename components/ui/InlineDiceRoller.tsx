"use client";

import React, { useState, useCallback } from "react";
import { Dice5 } from "lucide-react";
import { executeRoll, type RollExecutionResult } from "@/lib/rules/action-resolution/dice-engine";

// =============================================================================
// DIE FACE (theme-aware)
// =============================================================================

export function DieFace({
  value,
  isHit,
  isOne,
}: {
  value: number;
  isHit: boolean;
  isOne: boolean;
}) {
  const color = isHit
    ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-600 dark:text-emerald-400"
    : isOne
      ? "bg-red-500/20 border-red-500/60 text-red-600 dark:text-red-400"
      : "bg-muted/50 border-border text-muted-foreground";

  return (
    <div
      className={`inline-flex items-center justify-center w-9 h-9 rounded-md border text-sm font-mono font-bold ${color}`}
      title={isHit ? "Hit!" : isOne ? "Glitch" : "Miss"}
    >
      {value}
    </div>
  );
}

// =============================================================================
// INLINE DICE ROLLER
// =============================================================================

export interface InlineDiceRollerProps {
  /** Total dice pool size */
  dicePool: number;
  /** Description of what makes up the pool (e.g. "Charisma 4 + Negotiation 3") */
  poolLabel: string;
  /** Called when hits change (from a roll) */
  onHitsChange: (hits: number) => void;
  /** Accent color class for pool display */
  accentColor?: string;
  /** Border color class for results container */
  borderColor?: string;
}

export function InlineDiceRoller({
  dicePool,
  poolLabel,
  onHitsChange,
  accentColor = "text-emerald-400",
  borderColor = "border-border",
}: InlineDiceRollerProps) {
  const [rollResult, setRollResult] = useState<RollExecutionResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = useCallback(() => {
    if (dicePool <= 0) return;
    setIsRolling(true);
    // Brief delay for visual feedback
    setTimeout(() => {
      const result = executeRoll(dicePool);
      setRollResult(result);
      onHitsChange(result.hits);
      setIsRolling(false);
    }, 150);
  }, [dicePool, onHitsChange]);

  return (
    <div className="space-y-3">
      {/* Pool Info */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-muted-foreground">
          <span className="uppercase">Dice Pool: </span>
          <span className={accentColor}>{dicePool}d6</span>
          <span className="ml-2 text-muted-foreground/70">({poolLabel})</span>
        </div>
      </div>

      {/* Roll Button */}
      <button
        type="button"
        onClick={handleRoll}
        disabled={dicePool <= 0 || isRolling}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border bg-muted/30 hover:bg-muted/50 text-foreground disabled:opacity-50 transition-colors font-mono text-sm"
      >
        <Dice5 className={`w-4 h-4 ${isRolling ? "animate-spin" : ""}`} />
        {isRolling ? "Rolling..." : rollResult ? "Roll Again" : `Roll ${dicePool}d6`}
      </button>

      {/* Results */}
      {rollResult && (
        <div className={`rounded-md border ${borderColor} overflow-hidden`}>
          {/* Hit Summary */}
          <div
            className={`px-3 py-2 flex items-center justify-between ${
              rollResult.isCriticalGlitch
                ? "bg-red-500/10"
                : rollResult.isGlitch
                  ? "bg-amber-500/10"
                  : rollResult.hits > 0
                    ? "bg-emerald-500/10"
                    : "bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-bold font-mono ${
                  rollResult.hits > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                }`}
              >
                {rollResult.hits}
              </span>
              <span className="text-sm text-muted-foreground">
                {rollResult.hits === 1 ? "hit" : "hits"}
              </span>
            </div>
            {rollResult.isCriticalGlitch && (
              <span className="text-xs font-mono font-bold text-red-500 animate-pulse">
                Critical Glitch!
              </span>
            )}
            {rollResult.isGlitch && !rollResult.isCriticalGlitch && (
              <span className="text-xs font-mono font-bold text-amber-500">Glitch!</span>
            )}
          </div>

          {/* Dice Faces */}
          <div className="px-3 py-3 flex flex-wrap gap-1.5 justify-center">
            {rollResult.dice.map((die, i) => (
              <DieFace key={i} value={die.value} isHit={die.isHit} isOne={die.isOne} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
