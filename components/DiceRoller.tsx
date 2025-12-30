"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "react-aria-components";

// =============================================================================
// TYPES
// =============================================================================

export interface DiceResult {
  value: number;
  isHit: boolean;
  isOne: boolean;
}

export interface RollResult {
  dice: DiceResult[];
  hits: number;
  ones: number;
  isGlitch: boolean;
  isCriticalGlitch: boolean;
  poolSize: number;
  timestamp: number;
}

// =============================================================================
// DICE FACE COMPONENT
// =============================================================================

interface DiceFaceProps {
  value: number;
  isHit: boolean;
  isOne: boolean;
  isAnimating?: boolean;
  size?: "sm" | "md" | "lg";
}

function DiceFace({ value, isHit, isOne, isAnimating, size = "md" }: DiceFaceProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  const baseClasses = `
    relative font-mono font-bold rounded-lg border-2 flex items-center justify-center
    transition-all duration-300
    ${sizeClasses[size]}
    ${isAnimating ? "animate-bounce" : ""}
  `;

  const colorClasses = isHit
    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20"
    : isOne
      ? "bg-red-500/20 border-red-500 text-red-400 shadow-lg shadow-red-500/20"
      : "bg-zinc-800 border-zinc-600 text-zinc-300";

  // Dot patterns for each die face (classic d6 style)
  const dotPatterns: Record<number, React.JSX.Element> = {
    1: (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`rounded-full ${isOne ? "bg-red-400" : "bg-zinc-400"} ${size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : "w-3 h-3"}`} />
      </div>
    ),
    2: (
      <div className="absolute inset-2 flex flex-col justify-between">
        <div className="flex justify-end">
          <div className={`rounded-full bg-zinc-400 ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        </div>
        <div className="flex justify-start">
          <div className={`rounded-full bg-zinc-400 ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        </div>
      </div>
    ),
    3: (
      <div className="absolute inset-2 flex flex-col justify-between">
        <div className="flex justify-end">
          <div className={`rounded-full bg-zinc-400 ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        </div>
        <div className="flex justify-center">
          <div className={`rounded-full bg-zinc-400 ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        </div>
        <div className="flex justify-start">
          <div className={`rounded-full bg-zinc-400 ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        </div>
      </div>
    ),
    4: (
      <div className="absolute inset-2 grid grid-cols-2 gap-1">
        <div className={`rounded-full bg-zinc-400 ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full bg-zinc-400 justify-self-end ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full bg-zinc-400 self-end ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full bg-zinc-400 justify-self-end self-end ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
      </div>
    ),
    5: (
      <div className="absolute inset-2 grid grid-cols-2 gap-1">
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} justify-self-end ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} col-span-2 justify-self-center self-center ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} self-end ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} justify-self-end self-end ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
      </div>
    ),
    6: (
      <div className="absolute inset-2 grid grid-cols-2 gap-1">
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} justify-self-end ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} justify-self-end ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
        <div className={`rounded-full ${isHit ? "bg-emerald-400" : "bg-zinc-400"} justify-self-end ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
      </div>
    ),
  };

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      {dotPatterns[value] || <span>{value}</span>}
    </div>
  );
}

// =============================================================================
// ROLL HISTORY ITEM
// =============================================================================

interface RollHistoryItemProps {
  result: RollResult;
  compact?: boolean;
}

function RollHistoryItem({ result, compact }: RollHistoryItemProps) {
  const time = new Date(result.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (compact) {
    return (
      <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-zinc-800/50 transition-colors text-sm">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-mono">{time}</span>
          <span className="text-zinc-400">{result.poolSize}d6</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-emerald-400">{result.hits} hits</span>
          {result.isCriticalGlitch && (
            <span className="text-xs font-bold text-red-500 animate-pulse">CRIT GLITCH</span>
          )}
          {result.isGlitch && !result.isCriticalGlitch && (
            <span className="text-xs font-bold text-amber-500">GLITCH</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500 font-mono">{time}</span>
        <span className="text-xs text-zinc-400">{result.poolSize}d6</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {result.dice.map((die, idx) => (
          <DiceFace key={idx} value={die.value} isHit={die.isHit} isOne={die.isOne} size="sm" />
        ))}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="font-mono font-bold text-emerald-400">{result.hits} hits</span>
        <span className="text-zinc-500">{result.ones} ones</span>
        {result.isCriticalGlitch && (
          <span className="font-bold text-red-500">CRITICAL GLITCH!</span>
        )}
        {result.isGlitch && !result.isCriticalGlitch && (
          <span className="font-bold text-amber-500">GLITCH!</span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// DICE ROLLER COMPONENT
// =============================================================================

export interface DiceRollerProps {
  /** Initial dice pool size */
  initialPool?: number;
  /** Minimum pool size */
  minPool?: number;
  /** Maximum pool size */
  maxPool?: number;
  /** Called when a roll is made */
  onRoll?: (result: RollResult) => void;
  /** Whether to show roll history */
  showHistory?: boolean;
  /** Maximum history items to show */
  maxHistory?: number;
  /** Compact mode - smaller UI */
  compact?: boolean;
  /** Label for the dice pool input */
  label?: string;
  /** Label for the current operation (e.g. "Pistols Roll") */
  contextLabel?: string;
  /** Character ID for persisting rolls to the server */
  characterId?: string;
  /** Whether to persist rolls to the server (requires characterId) */
  persistRolls?: boolean;
}

export function DiceRoller({
  initialPool = 6,
  minPool = 1,
  maxPool = 50,
  onRoll,
  showHistory = true,
  maxHistory = 5,
  compact = false,
  label = "Dice Pool",
  contextLabel,
  characterId,
  persistRolls = false,
}: DiceRollerProps) {
  const [basePoolSize, setBasePoolSize] = useState(initialPool);
  const [modifier, setModifier] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<RollResult | null>(null);
  const [history, setHistory] = useState<RollResult[]>([]);
  const [persistError, setPersistError] = useState<string | null>(null);

  // Calculate total pool
  const totalPoolSize = Math.max(minPool, Math.min(maxPool, basePoolSize + modifier));

  // Update base pool when initialPool prop changes (Context Awareness)
  React.useEffect(() => {
    setBasePoolSize(initialPool);
    // Optional: reset modifier when context changes? 
    // Usually a good idea so a previous situational mod doesn't apply to a new skill roll automatically.
    setModifier(0);
  }, [initialPool]);

  // Roll dice
  const rollDice = useCallback(async () => {
    setIsRolling(true);
    setPersistError(null);

    // If persisting to server, use the API
    if (persistRolls && characterId) {
      try {
        const response = await fetch(`/api/characters/${characterId}/actions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pool: {
              basePool: totalPoolSize,
              modifiers: modifier !== 0 ? [{ source: "modifier", value: modifier }] : [],
              totalDice: totalPoolSize,
            },
            context: contextLabel ? { actionType: contextLabel } : undefined,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Roll failed");
        }

        // Convert API result to RollResult format
        const apiResult = data.result;
        // API returns DiceResult[] - convert to our local format and sort
        const dice: DiceResult[] = (apiResult.dice as Array<{ value: number; isHit?: boolean; isOne?: boolean } | number>).map((d) => {
          // Handle both object format (from API) and number format
          if (typeof d === "number") {
            return { value: d, isHit: d >= 5, isOne: d === 1 };
          }
          return { value: d.value, isHit: d.value >= 5, isOne: d.value === 1 };
        });

        // Sort dice: hits first, then by value descending
        dice.sort((a, b) => {
          if (a.isHit && !b.isHit) return -1;
          if (!a.isHit && b.isHit) return 1;
          if (a.isOne && !b.isOne) return 1;
          if (!a.isOne && b.isOne) return -1;
          return b.value - a.value;
        });

        const result: RollResult = {
          dice,
          hits: apiResult.hits,
          ones: apiResult.ones,
          isGlitch: apiResult.isGlitch,
          isCriticalGlitch: apiResult.isCriticalGlitch,
          poolSize: totalPoolSize,
          timestamp: Date.now(),
        };

        setCurrentResult(result);
        setHistory((prev) => [result, ...prev].slice(0, maxHistory));
        setIsRolling(false);
        onRoll?.(result);
      } catch (err) {
        setPersistError(err instanceof Error ? err.message : "Roll failed");
        setIsRolling(false);
      }
    } else {
      // Client-side only rolling with animation delay
      setTimeout(() => {
        const dice: DiceResult[] = [];
        let hits = 0;
        let ones = 0;

        for (let i = 0; i < totalPoolSize; i++) {
          const value = Math.floor(Math.random() * 6) + 1;
          const isHit = value >= 5;
          const isOne = value === 1;

          if (isHit) hits++;
          if (isOne) ones++;

          dice.push({ value, isHit, isOne });
        }

        // Sort dice: hits first, then by value descending
        dice.sort((a, b) => {
          if (a.isHit && !b.isHit) return -1;
          if (!a.isHit && b.isHit) return 1;
          if (a.isOne && !b.isOne) return 1;
          if (!a.isOne && b.isOne) return -1;
          return b.value - a.value;
        });

        // Check for glitch (more 1s than half the dice pool)
        const isGlitch = ones > totalPoolSize / 2;
        const isCriticalGlitch = isGlitch && hits === 0;

        const result: RollResult = {
          dice,
          hits,
          ones,
          isGlitch,
          isCriticalGlitch,
          poolSize: totalPoolSize,
          timestamp: Date.now(),
        };

        setCurrentResult(result);
        setHistory((prev) => [result, ...prev].slice(0, maxHistory));
        setIsRolling(false);
        onRoll?.(result);
      }, 300);
    }
  }, [totalPoolSize, maxHistory, onRoll, persistRolls, characterId, modifier, contextLabel]);

  // Handle base pool size change
  const handleBasePoolChange = (delta: number) => {
    setBasePoolSize((prev) => Math.max(minPool, Math.min(maxPool, prev + delta)));
  };

  // Quick pool presets
  const poolPresets = useMemo(() => [4, 8, 12, 16, 20], []);

  return (
    <div className={`${compact ? "space-y-3" : "space-y-4"}`}>
      {/* Pool Size Input and Modifiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
            {label} {contextLabel && <span className="text-emerald-500">({contextLabel})</span>}
          </label>
          <div className="flex items-center gap-2">
            <Button
              onPress={() => handleBasePoolChange(-1)}
              isDisabled={basePoolSize <= minPool}
              className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
            >
              −
            </Button>
            <input
              type="number"
              value={basePoolSize}
              onChange={(e) => setBasePoolSize(Math.max(minPool, Math.min(maxPool, parseInt(e.target.value) || minPool)))}
              min={minPool}
              max={maxPool}
              className="w-20 h-10 text-center font-mono text-xl font-bold bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none placeholder-zinc-700"
            />
            <Button
              onPress={() => handleBasePoolChange(1)}
              isDisabled={basePoolSize >= maxPool}
              className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
            >
              +
            </Button>
            <span className="text-zinc-500 font-mono">base</span>
          </div>

          {/* Quick Presets */}
          {!compact && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {poolPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setBasePoolSize(preset)}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${basePoolSize === preset
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
                    }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modifiers Section */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Modifiers
          </label>
          <div className="flex items-center gap-2">
            <Button
              onPress={() => setModifier(prev => prev - 1)}
              className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-colors font-bold text-xl"
            >
              −
            </Button>
            <div className={`w-20 h-10 flex items-center justify-center font-mono text-xl font-bold rounded-lg border ${modifier > 0 ? "text-emerald-400 border-emerald-500/50 bg-emerald-500/10" : modifier < 0 ? "text-red-400 border-red-500/50 bg-red-500/10" : "text-zinc-400 border-zinc-700 bg-zinc-900"}`}>
              {modifier > 0 ? `+${modifier}` : modifier}
            </div>
            <Button
              onPress={() => setModifier(prev => prev + 1)}
              className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-colors font-bold text-xl"
            >
              +
            </Button>
            <span className="text-zinc-500 font-mono">mod</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[-2, -1, 1, 2].map((val) => (
              <button
                key={val}
                onClick={() => setModifier(prev => prev + val)}
                className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300 transition-colors"
              >
                {val > 0 ? `+${val}` : val}
              </button>
            ))}
            <button
              onClick={() => setModifier(0)}
              className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-800 text-zinc-400 hover:bg-red-900/40 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Roll Button */}
      <Button
        onPress={rollDice}
        isDisabled={isRolling}
        className={`w-full font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${compact ? "py-2 text-sm" : "py-3 text-lg"
          } ${isRolling
            ? "bg-zinc-700 text-zinc-400 cursor-wait"
            : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          }`}
      >
        {isRolling ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Rolling...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z" />
            </svg>
            Roll {totalPoolSize}d6
            {modifier !== 0 && (
              <span className="text-xs font-mono opacity-80">
                ({basePoolSize}{modifier > 0 ? "+" : ""}{modifier})
              </span>
            )}
          </span>
        )}
      </Button>

      {/* Error Display */}
      {persistError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {persistError}
        </div>
      )}

      {/* Current Result */}
      {currentResult && (
        <div className={`rounded-lg border overflow-hidden ${currentResult.isCriticalGlitch
          ? "border-red-500/50 bg-red-950/30"
          : currentResult.isGlitch
            ? "border-amber-500/50 bg-amber-950/30"
            : currentResult.hits > 0
              ? "border-emerald-500/50 bg-emerald-950/30"
              : "border-zinc-700 bg-zinc-800/50"
          }`}>
          {/* Result Header */}
          <div className={`px-4 py-2 border-b ${currentResult.isCriticalGlitch
            ? "border-red-500/30 bg-red-900/20"
            : currentResult.isGlitch
              ? "border-amber-500/30 bg-amber-900/20"
              : "border-zinc-700 bg-zinc-800/30"
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-bold font-mono ${currentResult.hits > 0 ? "text-emerald-400" : "text-zinc-400"
                  }`}>
                  {currentResult.hits}
                </span>
                <span className="text-sm text-zinc-400">
                  {currentResult.hits === 1 ? "hit" : "hits"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentResult.isCriticalGlitch && (
                  <span className="px-2 py-1 text-xs font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30 rounded animate-pulse">
                    Critical Glitch!
                  </span>
                )}
                {currentResult.isGlitch && !currentResult.isCriticalGlitch && (
                  <span className="px-2 py-1 text-xs font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                    Glitch!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Dice Display */}
          <div className="p-4">
            <div className={`flex flex-wrap gap-2 justify-center ${compact ? "gap-1.5" : "gap-2"}`}>
              {currentResult.dice.map((die, idx) => (
                <DiceFace
                  key={idx}
                  value={die.value}
                  isHit={die.isHit}
                  isOne={die.isOne}
                  size={compact ? "sm" : "md"}
                  isAnimating={isRolling}
                />
              ))}
            </div>

            {/* Stats Summary */}
            <div className="flex justify-center gap-6 mt-4 pt-3 border-t border-zinc-700/50">
              <div className="text-center">
                <span className="block text-xs text-zinc-500 uppercase">Hits</span>
                <span className="text-lg font-mono font-bold text-emerald-400">{currentResult.hits}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-zinc-500 uppercase">Ones</span>
                <span className="text-lg font-mono font-bold text-red-400">{currentResult.ones}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-zinc-500 uppercase">Pool</span>
                <span className="text-lg font-mono font-bold text-zinc-400">{currentResult.poolSize}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roll History */}
      {showHistory && history.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">History</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <div className="space-y-1.5">
            {history.slice(1).map((result) => (
              <RollHistoryItem key={result.timestamp} result={result} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// EDGE REROLL BUTTON
// =============================================================================

export interface EdgeRerollProps {
  result: RollResult;
  edgeAvailable: number;
  onReroll: (newResult: RollResult, edgeSpent: number) => void;
}

export function EdgeRerollButton({ result, edgeAvailable, onReroll }: EdgeRerollProps) {
  const [isRerolling, setIsRerolling] = useState(false);

  // Count non-hits that can be rerolled
  const rerollableCount = result.dice.filter(d => !d.isHit).length;

  const handleReroll = () => {
    if (edgeAvailable <= 0 || rerollableCount === 0) return;

    setIsRerolling(true);

    setTimeout(() => {
      const newDice: DiceResult[] = result.dice.map(d => {
        if (d.isHit) return d; // Keep hits

        // Reroll non-hits
        const value = Math.floor(Math.random() * 6) + 1;
        return {
          value,
          isHit: value >= 5,
          isOne: value === 1,
        };
      });

      const hits = newDice.filter(d => d.isHit).length;
      const ones = newDice.filter(d => d.isOne).length;
      const isGlitch = ones > result.poolSize / 2;
      const isCriticalGlitch = isGlitch && hits === 0;

      // Sort dice
      newDice.sort((a, b) => {
        if (a.isHit && !b.isHit) return -1;
        if (!a.isHit && b.isHit) return 1;
        if (a.isOne && !b.isOne) return 1;
        if (!a.isOne && b.isOne) return -1;
        return b.value - a.value;
      });

      const newResult: RollResult = {
        dice: newDice,
        hits,
        ones,
        isGlitch,
        isCriticalGlitch,
        poolSize: result.poolSize,
        timestamp: Date.now(),
      };

      setIsRerolling(false);
      onReroll(newResult, 1);
    }, 300);
  };

  if (edgeAvailable <= 0 || rerollableCount === 0) {
    return null;
  }

  return (
    <Button
      onPress={handleReroll}
      isDisabled={isRerolling}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors disabled:opacity-50"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
      </svg>
      {isRerolling ? "Rerolling..." : `Spend Edge (${edgeAvailable})`}
    </Button>
  );
}


