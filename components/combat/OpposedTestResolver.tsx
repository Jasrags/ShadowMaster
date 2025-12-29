"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "react-aria-components";
import {
  Swords,
  Shield,
  Dices,
  RotateCcw,
  ChevronRight,
  Trophy,
  Skull,
  Minus,
  Zap,
  AlertTriangle,
} from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface DieResult {
  value: number;
  isHit: boolean;
  isOne: boolean;
}

interface RollResult {
  dice: DieResult[];
  hits: number;
  ones: number;
  isGlitch: boolean;
  isCriticalGlitch: boolean;
}

interface PoolInfo {
  name: string;
  totalDice: number;
  limit?: number;
  breakdown?: {
    attribute?: { name: string; value: number };
    skill?: { name: string; value: number };
    modifiers?: { name: string; value: number }[];
  };
}

interface OpposedTestResolverProps {
  /** Attacker/initiator pool info */
  attackerPool: PoolInfo;
  /** Defender pool info */
  defenderPool: PoolInfo;
  /** Pre-rolled attacker result (if already rolled) */
  attackerResult?: RollResult;
  /** Pre-rolled defender result (if already rolled) */
  defenderResult?: RollResult;
  /** Callback when rolls are completed */
  onResolved?: (result: {
    attackerHits: number;
    defenderHits: number;
    netHits: number;
    attackerGlitch: boolean;
    defenderGlitch: boolean;
    attackerCriticalGlitch: boolean;
    defenderCriticalGlitch: boolean;
  }) => void;
  /** Callback when user wants to reroll */
  onReroll?: () => void;
  /** Whether resolution is disabled */
  isDisabled?: boolean;
  /** Whether to auto-roll on mount */
  autoRoll?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Labels for attacker/defender */
  labels?: {
    attacker?: string;
    defender?: string;
  };
}

type RollPhase = "ready" | "rolling" | "resolved";

// =============================================================================
// DICE ANIMATION
// =============================================================================

const ROLL_DURATION = 1500; // ms
const DIE_ROLL_FRAMES = 8;

function AnimatedDie({
  finalValue,
  delay,
  isRolling,
  size,
}: {
  finalValue: number;
  delay: number;
  isRolling: boolean;
  size: "sm" | "md" | "lg";
}) {
  const [displayValue, setDisplayValue] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isRolling) {
      setDisplayValue(finalValue);
      setIsAnimating(false);
      return;
    }

    // Delay start of this die's animation
    const startTimer = setTimeout(() => {
      setIsAnimating(true);
      let frame = 0;
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
        frame++;
        if (frame >= DIE_ROLL_FRAMES) {
          clearInterval(interval);
          setDisplayValue(finalValue);
          setIsAnimating(false);
        }
      }, 80);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [isRolling, finalValue, delay]);

  const isHit = displayValue >= 5;
  const isOne = displayValue === 1;

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded flex items-center justify-center font-mono font-bold
        transition-all duration-150
        ${isAnimating ? "scale-110" : "scale-100"}
        ${
          isHit
            ? "bg-emerald-500/30 text-emerald-400 border border-emerald-500/50"
            : isOne
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              : "bg-zinc-700 text-zinc-300 border border-zinc-600"
        }
      `}
    >
      {displayValue}
    </div>
  );
}

// =============================================================================
// POOL DISPLAY
// =============================================================================

function PoolDisplay({
  pool,
  result,
  isRolling,
  side,
  size,
  label,
}: {
  pool: PoolInfo;
  result?: RollResult;
  isRolling: boolean;
  side: "attacker" | "defender";
  size: "sm" | "md" | "lg";
  label: string;
}) {
  const sizeClasses = {
    sm: { text: "text-xs", heading: "text-sm", padding: "p-2" },
    md: { text: "text-sm", heading: "text-base", padding: "p-3" },
    lg: { text: "text-base", heading: "text-lg", padding: "p-4" },
  };

  const s = sizeClasses[size];
  const isAttacker = side === "attacker";
  const Icon = isAttacker ? Swords : Shield;
  const color = isAttacker ? "text-rose-400" : "text-blue-400";
  const bgColor = isAttacker ? "bg-rose-500/10" : "bg-blue-500/10";
  const borderColor = isAttacker ? "border-rose-500/30" : "border-blue-500/30";

  // Generate dice array for display
  const diceCount = pool.totalDice;
  const diceResults = result?.dice || Array(diceCount).fill({ value: 1, isHit: false, isOne: false });

  return (
    <div className={`flex-1 rounded-lg border ${borderColor} ${bgColor} ${s.padding}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <span className={`font-medium text-zinc-200 ${s.heading}`}>{label}</span>
        </div>
        <div className={`font-mono font-bold ${color} ${s.heading}`}>
          {pool.totalDice}d6
          {pool.limit && <span className="text-zinc-500 font-normal"> (L{pool.limit})</span>}
        </div>
      </div>

      {/* Pool breakdown */}
      {pool.breakdown && (
        <div className={`mb-3 space-y-1 ${s.text} text-zinc-400`}>
          {pool.breakdown.attribute && (
            <div className="flex justify-between">
              <span>{pool.breakdown.attribute.name}</span>
              <span className="font-mono">{pool.breakdown.attribute.value}</span>
            </div>
          )}
          {pool.breakdown.skill && (
            <div className="flex justify-between">
              <span>{pool.breakdown.skill.name}</span>
              <span className="font-mono">+{pool.breakdown.skill.value}</span>
            </div>
          )}
          {pool.breakdown.modifiers?.map((mod, i) => (
            <div key={i} className="flex justify-between">
              <span>{mod.name}</span>
              <span className={`font-mono ${mod.value >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {mod.value >= 0 ? "+" : ""}
                {mod.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Dice grid */}
      <div className="flex flex-wrap gap-1 mb-3">
        {diceResults.slice(0, Math.min(diceCount, 20)).map((die, i) => (
          <AnimatedDie
            key={i}
            finalValue={die.value}
            delay={i * 50}
            isRolling={isRolling}
            size={size}
          />
        ))}
        {diceCount > 20 && (
          <div className={`${s.text} text-zinc-500 self-center ml-2`}>
            +{diceCount - 20} more
          </div>
        )}
      </div>

      {/* Result summary */}
      {result && !isRolling && (
        <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className={`${s.text} text-zinc-400`}>Hits:</span>
              <span className={`font-mono font-bold text-emerald-400 ${s.heading}`}>
                {result.hits}
              </span>
            </div>
            {result.ones > 0 && (
              <div className="flex items-center gap-1">
                <span className={`${s.text} text-zinc-400`}>Ones:</span>
                <span className={`font-mono text-rose-400 ${s.text}`}>{result.ones}</span>
              </div>
            )}
          </div>

          {/* Glitch indicators */}
          {(result.isGlitch || result.isCriticalGlitch) && (
            <div
              className={`
                flex items-center gap-1 px-2 py-0.5 rounded ${s.text}
                ${result.isCriticalGlitch ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"}
              `}
            >
              <AlertTriangle className="w-3 h-3" />
              {result.isCriticalGlitch ? "Critical Glitch!" : "Glitch!"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// RESULT DISPLAY
// =============================================================================

function ResultDisplay({
  attackerHits,
  defenderHits,
  attackerGlitch,
  defenderGlitch,
  attackerCriticalGlitch,
  defenderCriticalGlitch,
  size,
  attackerLabel,
  defenderLabel,
}: {
  attackerHits: number;
  defenderHits: number;
  attackerGlitch: boolean;
  defenderGlitch: boolean;
  attackerCriticalGlitch: boolean;
  defenderCriticalGlitch: boolean;
  size: "sm" | "md" | "lg";
  attackerLabel: string;
  defenderLabel: string;
}) {
  const netHits = attackerHits - defenderHits;

  const sizeClasses = {
    sm: { text: "text-sm", heading: "text-lg", icon: "w-6 h-6", padding: "p-3" },
    md: { text: "text-base", heading: "text-xl", icon: "w-8 h-8", padding: "p-4" },
    lg: { text: "text-lg", heading: "text-2xl", icon: "w-10 h-10", padding: "p-5" },
  };

  const s = sizeClasses[size];

  // Determine outcome
  let outcome: "attacker_wins" | "defender_wins" | "tie";
  let outcomeText: string;
  let outcomeColor: string;
  let OutcomeIcon: typeof Trophy;

  if (attackerCriticalGlitch && !defenderCriticalGlitch) {
    outcome = "defender_wins";
    outcomeText = `${attackerLabel} Critical Glitch!`;
    outcomeColor = "text-rose-400";
    OutcomeIcon = Skull;
  } else if (defenderCriticalGlitch && !attackerCriticalGlitch) {
    outcome = "attacker_wins";
    outcomeText = `${defenderLabel} Critical Glitch!`;
    outcomeColor = "text-emerald-400";
    OutcomeIcon = Trophy;
  } else if (netHits > 0) {
    outcome = "attacker_wins";
    outcomeText = `${attackerLabel} Succeeds!`;
    outcomeColor = "text-emerald-400";
    OutcomeIcon = Trophy;
  } else if (netHits < 0) {
    outcome = "defender_wins";
    outcomeText = `${defenderLabel} Defends!`;
    outcomeColor = "text-blue-400";
    OutcomeIcon = Shield;
  } else {
    outcome = "tie";
    outcomeText = "Tie - Attacker Fails";
    outcomeColor = "text-amber-400";
    OutcomeIcon = Minus;
  }

  return (
    <div
      className={`
        rounded-lg border border-zinc-700 bg-zinc-800/50 ${s.padding}
        flex flex-col items-center gap-3
      `}
    >
      {/* Main outcome */}
      <div className="flex items-center gap-3">
        <OutcomeIcon className={`${s.icon} ${outcomeColor}`} />
        <span className={`font-bold ${outcomeColor} ${s.heading}`}>{outcomeText}</span>
      </div>

      {/* Net hits display */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className={`font-mono font-bold text-rose-400 ${s.heading}`}>{attackerHits}</div>
          <div className={`text-zinc-500 ${s.text}`}>Attack</div>
        </div>

        <div className={`text-zinc-500 ${s.text}`}>vs</div>

        <div className="text-center">
          <div className={`font-mono font-bold text-blue-400 ${s.heading}`}>{defenderHits}</div>
          <div className={`text-zinc-500 ${s.text}`}>Defense</div>
        </div>

        <div className={`text-zinc-500 ${s.text}`}>=</div>

        <div className="text-center">
          <div
            className={`font-mono font-bold ${s.heading} ${
              netHits > 0 ? "text-emerald-400" : netHits < 0 ? "text-rose-400" : "text-zinc-400"
            }`}
          >
            {netHits > 0 ? "+" : ""}
            {netHits}
          </div>
          <div className={`text-zinc-500 ${s.text}`}>Net Hits</div>
        </div>
      </div>

      {/* Glitch warnings */}
      {(attackerGlitch || defenderGlitch) && !attackerCriticalGlitch && !defenderCriticalGlitch && (
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <span className={s.text}>
            {attackerGlitch && defenderGlitch
              ? "Both sides glitched!"
              : attackerGlitch
                ? `${attackerLabel} glitched!`
                : `${defenderLabel} glitched!`}
          </span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// OPPOSED TEST RESOLVER
// =============================================================================

export function OpposedTestResolver({
  attackerPool,
  defenderPool,
  attackerResult: preRolledAttacker,
  defenderResult: preRolledDefender,
  onResolved,
  onReroll,
  isDisabled = false,
  autoRoll = false,
  size = "md",
  labels = {},
}: OpposedTestResolverProps) {
  const attackerLabel = labels.attacker || attackerPool.name;
  const defenderLabel = labels.defender || defenderPool.name;

  const [phase, setPhase] = useState<RollPhase>(
    preRolledAttacker && preRolledDefender ? "resolved" : "ready"
  );
  const [attackerRoll, setAttackerRoll] = useState<RollResult | undefined>(preRolledAttacker);
  const [defenderRoll, setDefenderRoll] = useState<RollResult | undefined>(preRolledDefender);

  const sizeClasses = {
    sm: { text: "text-xs", padding: "p-3" },
    md: { text: "text-sm", padding: "p-4" },
    lg: { text: "text-base", padding: "p-5" },
  };

  const s = sizeClasses[size];

  // Roll dice
  const rollDice = useCallback((count: number, limit?: number): RollResult => {
    const dice: DieResult[] = [];
    let ones = 0;

    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * 6) + 1;
      const isHit = value >= 5;
      const isOne = value === 1;
      if (isOne) ones++;
      dice.push({ value, isHit, isOne });
    }

    let hits = dice.filter((d) => d.isHit).length;
    if (limit !== undefined && hits > limit) {
      hits = limit;
    }

    const isGlitch = ones > count / 2;
    const isCriticalGlitch = isGlitch && hits === 0;

    return { dice, hits, ones, isGlitch, isCriticalGlitch };
  }, []);

  // Execute rolls
  const executeRolls = useCallback(() => {
    if (isDisabled) return;

    setPhase("rolling");

    // Generate results immediately but animate display
    const attackResult = rollDice(attackerPool.totalDice, attackerPool.limit);
    const defenseResult = rollDice(defenderPool.totalDice, defenderPool.limit);

    setAttackerRoll(attackResult);
    setDefenderRoll(defenseResult);

    // After animation, resolve
    setTimeout(() => {
      setPhase("resolved");
      onResolved?.({
        attackerHits: attackResult.hits,
        defenderHits: defenseResult.hits,
        netHits: attackResult.hits - defenseResult.hits,
        attackerGlitch: attackResult.isGlitch,
        defenderGlitch: defenseResult.isGlitch,
        attackerCriticalGlitch: attackResult.isCriticalGlitch,
        defenderCriticalGlitch: defenseResult.isCriticalGlitch,
      });
    }, ROLL_DURATION);
  }, [attackerPool, defenderPool, isDisabled, onResolved, rollDice]);

  // Handle reroll
  const handleReroll = useCallback(() => {
    setPhase("ready");
    setAttackerRoll(undefined);
    setDefenderRoll(undefined);
    onReroll?.();
  }, [onReroll]);

  // Auto-roll on mount if requested
  useEffect(() => {
    if (autoRoll && phase === "ready") {
      // Use requestAnimationFrame to defer setState outside the effect's synchronous execution
      const frameId = requestAnimationFrame(() => {
        executeRolls();
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [autoRoll, phase, executeRolls]);

  const isRolling = phase === "rolling";
  const isResolved = phase === "resolved";

  return (
    <div className={`rounded-lg border border-zinc-700 bg-zinc-900/50 ${s.padding}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-rose-400" />
          <span className={`font-medium text-zinc-200 ${s.text}`}>Opposed Test</span>
        </div>

        {/* Roll button or status */}
        {phase === "ready" && (
          <Button
            onPress={executeRolls}
            isDisabled={isDisabled}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              bg-violet-600 text-white hover:bg-violet-500
              disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed
              transition-colors ${s.text}
            `}
          >
            <Dices className="w-4 h-4" />
            Roll Both
          </Button>
        )}
        {isRolling && (
          <div className="flex items-center gap-2 text-amber-400">
            <Dices className="w-4 h-4 animate-bounce" />
            <span className={s.text}>Rolling...</span>
          </div>
        )}
        {isResolved && onReroll && (
          <Button
            onPress={handleReroll}
            isDisabled={isDisabled}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700
              disabled:text-zinc-600 disabled:cursor-not-allowed
              transition-colors ${s.text}
            `}
          >
            <RotateCcw className="w-4 h-4" />
            Reroll
          </Button>
        )}
      </div>

      {/* Pool displays side by side */}
      <div className="flex gap-4 mb-4">
        <PoolDisplay
          pool={attackerPool}
          result={attackerRoll}
          isRolling={isRolling}
          side="attacker"
          size={size}
          label={attackerLabel}
        />
        <div className="flex items-center">
          <ChevronRight className="w-6 h-6 text-zinc-600" />
        </div>
        <PoolDisplay
          pool={defenderPool}
          result={defenderRoll}
          isRolling={isRolling}
          side="defender"
          size={size}
          label={defenderLabel}
        />
      </div>

      {/* Result display */}
      {isResolved && attackerRoll && defenderRoll && (
        <ResultDisplay
          attackerHits={attackerRoll.hits}
          defenderHits={defenderRoll.hits}
          attackerGlitch={attackerRoll.isGlitch}
          defenderGlitch={defenderRoll.isGlitch}
          attackerCriticalGlitch={attackerRoll.isCriticalGlitch}
          defenderCriticalGlitch={defenderRoll.isCriticalGlitch}
          size={size}
          attackerLabel={attackerLabel}
          defenderLabel={defenderLabel}
        />
      )}
    </div>
  );
}
