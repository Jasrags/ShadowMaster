"use client";

import React, { useMemo, useCallback } from "react";
import { Button } from "react-aria-components";
import {
  Heart,
  Brain,
  Skull,
  AlertTriangle,
  Moon,
  Shield,
  Zap,
  MinusCircle,
  PlusCircle,
  RotateCcw,
} from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface ConditionMonitorProps {
  /** Character name for display */
  characterName: string;
  /** Physical track maximum (8 + ceil(Body/2)) */
  physicalMax: number;
  /** Stun track maximum (8 + ceil(Willpower/2)) */
  stunMax: number;
  /** Current physical damage */
  physicalDamage: number;
  /** Current stun damage */
  stunDamage: number;
  /** Overflow damage (physical only, after track filled) */
  overflowDamage?: number;
  /** Overflow maximum (Body attribute) */
  overflowMax?: number;
  /** Whether editing is allowed */
  editable?: boolean;
  /** Callback when damage changes */
  onDamageChange?: (type: "physical" | "stun" | "overflow", newValue: number) => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show wound modifier calculation */
  showWoundModifier?: boolean;
  /** Custom wound modifier (if calculated externally) */
  woundModifier?: number;
  /** Layout orientation */
  layout?: "horizontal" | "vertical" | "compact";
}

// =============================================================================
// BOX GRID
// =============================================================================

interface DamageBoxProps {
  filled: boolean;
  isOverflow?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size: "sm" | "md" | "lg";
  showWoundThreshold?: boolean;
}

function DamageBox({
  filled,
  isOverflow = false,
  onClick,
  disabled = false,
  size,
  showWoundThreshold = false,
}: DamageBoxProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const baseClass = sizeClasses[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      className={`
        ${baseClass} rounded border-2 transition-all duration-150
        ${
          filled
            ? isOverflow
              ? "bg-rose-600 border-rose-500 shadow-rose-500/30 shadow-sm"
              : "bg-rose-500 border-rose-400"
            : isOverflow
              ? "bg-zinc-900 border-zinc-700 hover:border-zinc-600"
              : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
        }
        ${showWoundThreshold ? "ring-2 ring-amber-500/50 ring-offset-1 ring-offset-zinc-900" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : onClick ? "cursor-pointer" : "cursor-default"}
      `}
    />
  );
}

interface BoxGridProps {
  label: string;
  icon: React.ReactNode;
  max: number;
  current: number;
  isOverflow?: boolean;
  editable?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onSetValue?: (value: number) => void;
  size: "sm" | "md" | "lg";
  color: string;
  showWoundThresholds?: boolean;
}

function BoxGrid({
  label,
  icon,
  max,
  current,
  isOverflow = false,
  editable = false,
  onIncrement,
  onDecrement,
  onSetValue,
  size,
  color,
  showWoundThresholds = false,
}: BoxGridProps) {
  const sizeClasses = {
    sm: { text: "text-xs", heading: "text-sm", gap: "gap-1", rows: 6 },
    md: { text: "text-sm", heading: "text-base", gap: "gap-1.5", rows: 5 },
    lg: { text: "text-base", heading: "text-lg", gap: "gap-2", rows: 4 },
  };

  const s = sizeClasses[size];

  // Calculate wound thresholds (every 3 boxes)
  const woundThresholds = useMemo(() => {
    const thresholds: number[] = [];
    for (let i = 3; i <= max; i += 3) {
      thresholds.push(i);
    }
    return thresholds;
  }, [max]);

  // Group boxes into rows
  const rows = useMemo(() => {
    const boxesPerRow = s.rows;
    const result: number[][] = [];
    for (let i = 0; i < max; i += boxesPerRow) {
      result.push(
        Array.from({ length: Math.min(boxesPerRow, max - i) }, (_, j) => i + j + 1)
      );
    }
    return result;
  }, [max, s.rows]);

  const handleBoxClick = useCallback(
    (boxNumber: number) => {
      if (!editable || !onSetValue) return;
      // If clicking a filled box, reduce damage to box-1
      // If clicking an empty box, set damage to that box
      if (boxNumber <= current) {
        onSetValue(boxNumber - 1);
      } else {
        onSetValue(boxNumber);
      }
    },
    [current, editable, onSetValue]
  );

  const isFull = current >= max;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <span className={`font-medium text-zinc-200 ${s.heading}`}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-mono ${isFull ? "text-rose-400" : "text-zinc-400"} ${s.text}`}>
            {current}/{max}
          </span>
          {editable && (
            <div className="flex items-center gap-1">
              <Button
                onPress={onDecrement}
                isDisabled={current <= 0}
                className={`
                  p-1 rounded text-zinc-400 hover:text-zinc-200
                  disabled:text-zinc-600 disabled:cursor-not-allowed
                  transition-colors
                `}
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              <Button
                onPress={onIncrement}
                isDisabled={current >= max}
                className={`
                  p-1 rounded text-zinc-400 hover:text-zinc-200
                  disabled:text-zinc-600 disabled:cursor-not-allowed
                  transition-colors
                `}
              >
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Box grid */}
      <div className={`space-y-${s.gap === "gap-1" ? "1" : s.gap === "gap-1.5" ? "1.5" : "2"}`}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex ${s.gap}`}>
            {row.map((boxNumber) => (
              <DamageBox
                key={boxNumber}
                filled={boxNumber <= current}
                isOverflow={isOverflow}
                onClick={editable ? () => handleBoxClick(boxNumber) : undefined}
                disabled={!editable}
                size={size}
                showWoundThreshold={showWoundThresholds && woundThresholds.includes(boxNumber)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// STATUS INDICATORS
// =============================================================================

function StatusIndicator({
  condition,
  icon,
  label,
  color,
  size,
}: {
  condition: boolean;
  icon: React.ReactNode;
  label: string;
  color: string;
  size: "sm" | "md" | "lg";
}) {
  if (!condition) return null;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <div
      className={`
        flex items-center gap-1.5 rounded ${sizeClasses[size]}
        ${color}
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

// =============================================================================
// CONDITION MONITOR
// =============================================================================

export function ConditionMonitor({
  characterName,
  physicalMax,
  stunMax,
  physicalDamage,
  stunDamage,
  overflowDamage = 0,
  overflowMax = 0,
  editable = false,
  onDamageChange,
  size = "md",
  showWoundModifier = true,
  woundModifier,
  layout = "horizontal",
}: ConditionMonitorProps) {
  const sizeClasses = {
    sm: { text: "text-xs", heading: "text-sm", padding: "p-2" },
    md: { text: "text-sm", heading: "text-base", padding: "p-3" },
    lg: { text: "text-base", heading: "text-lg", padding: "p-4" },
  };

  const s = sizeClasses[size];

  // Calculate wound modifier (every 3 boxes = -1)
  const calculatedWoundModifier = useMemo(() => {
    if (woundModifier !== undefined) return woundModifier;
    const physicalWounds = Math.floor(physicalDamage / 3);
    const stunWounds = Math.floor(stunDamage / 3);
    return -(physicalWounds + stunWounds);
  }, [physicalDamage, stunDamage, woundModifier]);

  // Determine character states
  const isUnconscious = stunDamage >= stunMax;
  const isIncapacitated = physicalDamage >= physicalMax;
  const isDead = isIncapacitated && overflowDamage >= overflowMax && overflowMax > 0;

  // Handlers
  const handlePhysicalChange = useCallback(
    (newValue: number) => {
      onDamageChange?.("physical", Math.max(0, Math.min(physicalMax, newValue)));
    },
    [onDamageChange, physicalMax]
  );

  const handleStunChange = useCallback(
    (newValue: number) => {
      onDamageChange?.("stun", Math.max(0, Math.min(stunMax, newValue)));
    },
    [onDamageChange, stunMax]
  );

  const handleOverflowChange = useCallback(
    (newValue: number) => {
      onDamageChange?.("overflow", Math.max(0, Math.min(overflowMax, newValue)));
    },
    [onDamageChange, overflowMax]
  );

  const handleReset = useCallback(() => {
    onDamageChange?.("physical", 0);
    onDamageChange?.("stun", 0);
    onDamageChange?.("overflow", 0);
  }, [onDamageChange]);

  const layoutClasses = {
    horizontal: "flex gap-6",
    vertical: "space-y-4",
    compact: "flex flex-wrap gap-4",
  };

  return (
    <div className={`rounded-lg border border-zinc-700 bg-zinc-900/50 ${s.padding}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-400" />
          <span className={`font-medium text-zinc-200 ${s.heading}`}>{characterName}</span>
        </div>

        {/* Wound modifier */}
        {showWoundModifier && calculatedWoundModifier !== 0 && (
          <div
            className={`
              flex items-center gap-1 px-2 py-0.5 rounded ${s.text}
              ${
                calculatedWoundModifier <= -3
                  ? "bg-rose-500/20 text-rose-400"
                  : calculatedWoundModifier <= -1
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-zinc-700 text-zinc-400"
              }
            `}
          >
            <AlertTriangle className="w-3 h-3" />
            <span className="font-mono">{calculatedWoundModifier}</span>
            <span>Wound Mod</span>
          </div>
        )}

        {/* Reset button */}
        {editable && (physicalDamage > 0 || stunDamage > 0 || overflowDamage > 0) && (
          <Button
            onPress={handleReset}
            className={`
              flex items-center gap-1 px-2 py-1 rounded ${s.text}
              bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700
              transition-colors
            `}
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Status indicators */}
      {(isUnconscious || isIncapacitated || isDead) && (
        <div className="flex flex-wrap gap-2 mb-4">
          <StatusIndicator
            condition={isUnconscious && !isDead}
            icon={<Moon className="w-4 h-4" />}
            label="Unconscious"
            color="bg-blue-500/20 text-blue-400"
            size={size}
          />
          <StatusIndicator
            condition={isIncapacitated && !isDead}
            icon={<AlertTriangle className="w-4 h-4" />}
            label="Incapacitated"
            color="bg-amber-500/20 text-amber-400"
            size={size}
          />
          <StatusIndicator
            condition={isDead}
            icon={<Skull className="w-4 h-4" />}
            label="Dead"
            color="bg-rose-500/20 text-rose-400"
            size={size}
          />
        </div>
      )}

      {/* Condition monitors */}
      <div className={layoutClasses[layout]}>
        {/* Physical */}
        <div className="flex-1">
          <BoxGrid
            label="Physical"
            icon={<Heart className="w-4 h-4" />}
            max={physicalMax}
            current={physicalDamage}
            editable={editable}
            onIncrement={() => handlePhysicalChange(physicalDamage + 1)}
            onDecrement={() => handlePhysicalChange(physicalDamage - 1)}
            onSetValue={handlePhysicalChange}
            size={size}
            color="text-rose-400"
            showWoundThresholds={showWoundModifier}
          />
        </div>

        {/* Stun */}
        <div className="flex-1">
          <BoxGrid
            label="Stun"
            icon={<Brain className="w-4 h-4" />}
            max={stunMax}
            current={stunDamage}
            editable={editable}
            onIncrement={() => handleStunChange(stunDamage + 1)}
            onDecrement={() => handleStunChange(stunDamage - 1)}
            onSetValue={handleStunChange}
            size={size}
            color="text-violet-400"
            showWoundThresholds={showWoundModifier}
          />
        </div>

        {/* Overflow (only shown if physical is full or has overflow damage) */}
        {overflowMax > 0 && (isIncapacitated || overflowDamage > 0) && (
          <div className={layout === "vertical" ? "" : "flex-shrink-0"}>
            <BoxGrid
              label="Overflow"
              icon={<Skull className="w-4 h-4" />}
              max={overflowMax}
              current={overflowDamage}
              isOverflow
              editable={editable}
              onIncrement={() => handleOverflowChange(overflowDamage + 1)}
              onDecrement={() => handleOverflowChange(overflowDamage - 1)}
              onSetValue={handleOverflowChange}
              size={size}
              color="text-rose-500"
            />
          </div>
        )}
      </div>

      {/* Legend for wound thresholds */}
      {showWoundModifier && (
        <div className={`mt-3 pt-3 border-t border-zinc-700/50 flex items-center gap-4 ${s.text} text-zinc-500`}>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-zinc-700 bg-zinc-800 ring-2 ring-amber-500/50" />
            <span>Wound threshold (-1 per 3 boxes)</span>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPACT VERSION
// =============================================================================

interface CompactConditionMonitorProps {
  physicalMax: number;
  stunMax: number;
  physicalDamage: number;
  stunDamage: number;
  overflowDamage?: number;
  size?: "sm" | "md" | "lg";
}

export function CompactConditionMonitor({
  physicalMax,
  stunMax,
  physicalDamage,
  stunDamage,
  overflowDamage = 0,
  size = "sm",
}: CompactConditionMonitorProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const physicalPercent = (physicalDamage / physicalMax) * 100;
  const stunPercent = (stunDamage / stunMax) * 100;

  const isUnconscious = stunDamage >= stunMax;
  const isIncapacitated = physicalDamage >= physicalMax;

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      {/* Physical bar */}
      <div className="flex items-center gap-1">
        <Heart className="w-3 h-3 text-rose-400" />
        <div className="w-16 h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              physicalPercent >= 100 ? "bg-rose-500" : physicalPercent >= 75 ? "bg-orange-500" : "bg-rose-400"
            }`}
            style={{ width: `${Math.min(100, physicalPercent)}%` }}
          />
        </div>
        <span className={`font-mono ${isIncapacitated ? "text-rose-400" : "text-zinc-400"}`}>
          {physicalDamage}/{physicalMax}
        </span>
      </div>

      {/* Stun bar */}
      <div className="flex items-center gap-1">
        <Brain className="w-3 h-3 text-violet-400" />
        <div className="w-16 h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              stunPercent >= 100 ? "bg-violet-500" : stunPercent >= 75 ? "bg-violet-400" : "bg-violet-300"
            }`}
            style={{ width: `${Math.min(100, stunPercent)}%` }}
          />
        </div>
        <span className={`font-mono ${isUnconscious ? "text-violet-400" : "text-zinc-400"}`}>
          {stunDamage}/{stunMax}
        </span>
      </div>

      {/* Overflow indicator */}
      {overflowDamage > 0 && (
        <div className="flex items-center gap-1 text-rose-500">
          <Skull className="w-3 h-3" />
          <span className="font-mono">+{overflowDamage}</span>
        </div>
      )}

      {/* Status badges */}
      {isUnconscious && !isIncapacitated && (
        <span title="Unconscious">
          <Moon className="w-3 h-3 text-blue-400" />
        </span>
      )}
      {isIncapacitated && (
        <span title="Incapacitated">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
        </span>
      )}
    </div>
  );
}
