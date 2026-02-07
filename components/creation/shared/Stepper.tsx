"use client";

/**
 * Stepper Component
 *
 * Reusable +/- stepper for incrementing/decrementing numeric values.
 * Used for attributes, skill ratings, language ratings, etc.
 *
 * Features:
 * - Increment/decrement buttons with consistent sizing (h-6 w-6)
 * - Configurable accent color for increment button
 * - Optional min/max range display
 * - Optional MAX badge when at maximum
 * - Keyboard navigation (arrow keys)
 * - Full accessibility support (aria labels, focus visible)
 * - Dark mode support
 */

import { useCallback } from "react";
import { Minus, Plus } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

type AccentColor = "emerald" | "purple" | "blue" | "amber" | "cyan" | "violet";

interface StepperProps {
  /** Current value */
  value: number;
  /** Minimum allowed value */
  min: number;
  /** Maximum allowed value */
  max: number;
  /** Callback when value changes */
  onChange: (newValue: number) => void;
  /** Whether increment is allowed (overrides max check if provided) */
  canIncrement?: boolean;
  /** Whether decrement is allowed (overrides min check if provided) */
  canDecrement?: boolean;
  /** Accent color for increment button (default: emerald) */
  accentColor?: AccentColor;
  /** Color for value display (default: neutral) */
  valueColor?: AccentColor | "neutral";
  /** Show min-max range label */
  showRange?: boolean;
  /** Show MAX badge when at maximum */
  showMaxBadge?: boolean;
  /** Accessible name for the control (used in aria-labels) */
  name: string;
  /** Disable the entire control */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

// =============================================================================
// STYLES
// =============================================================================

const ACCENT_BUTTON_CLASSES: Record<AccentColor, string> = {
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  purple: "bg-purple-500 text-white hover:bg-purple-600",
  blue: "bg-blue-500 text-white hover:bg-blue-600",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
  cyan: "bg-cyan-500 text-white hover:bg-cyan-600",
  violet: "bg-violet-500 text-white hover:bg-violet-600",
};

const VALUE_DISPLAY_CLASSES: Record<AccentColor | "neutral", string> = {
  neutral: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
  emerald: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100",
  purple: "bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-100",
  blue: "bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-100",
  amber: "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100",
  cyan: "bg-cyan-100 text-cyan-900 dark:bg-cyan-900/50 dark:text-cyan-100",
  violet: "bg-violet-100 text-violet-900 dark:bg-violet-900/50 dark:text-violet-100",
};

const MAX_BADGE_CLASSES: Record<AccentColor, string> = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
};

const DISABLED_BUTTON_CLASSES =
  "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600";

const DECREMENT_ENABLED_CLASSES =
  "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600";

// =============================================================================
// COMPONENT
// =============================================================================

export function Stepper({
  value,
  min,
  max,
  onChange,
  canIncrement,
  canDecrement,
  accentColor = "emerald",
  valueColor = "neutral",
  showRange = false,
  showMaxBadge = true,
  name,
  disabled = false,
  className = "",
}: StepperProps) {
  // Determine if buttons should be enabled
  const isIncrementEnabled = canIncrement ?? (!disabled && value < max);
  const isDecrementEnabled = canDecrement ?? (!disabled && value > min);
  const isAtMax = value >= max;

  // Handle increment
  const handleIncrement = useCallback(() => {
    if (isIncrementEnabled) {
      onChange(Math.min(value + 1, max));
    }
  }, [isIncrementEnabled, onChange, value, max]);

  // Handle decrement
  const handleDecrement = useCallback(() => {
    if (isDecrementEnabled) {
      onChange(Math.max(value - 1, min));
    }
  }, [isDecrementEnabled, onChange, value, min]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        handleDecrement();
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        handleIncrement();
      }
    },
    [handleDecrement, handleIncrement]
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Range display */}
      {showRange && (
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
          {min}-{max}
        </span>
      )}

      {/* Stepper controls */}
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label={`${name} controls`}
        onKeyDown={handleKeyDown}
      >
        {/* Decrement button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!isDecrementEnabled}
          aria-label={`Decrease ${name}`}
          className={`flex h-6 w-6 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
            isDecrementEnabled ? DECREMENT_ENABLED_CLASSES : DISABLED_BUTTON_CLASSES
          }`}
        >
          <Minus className="h-3 w-3" aria-hidden="true" />
        </button>

        {/* Value display */}
        <div
          className={`flex h-7 w-8 items-center justify-center rounded text-sm font-mono font-bold ${VALUE_DISPLAY_CLASSES[valueColor]}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {value}
        </div>

        {/* Increment button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={!isIncrementEnabled}
          aria-label={`Increase ${name}`}
          className={`flex h-6 w-6 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
            isIncrementEnabled ? ACCENT_BUTTON_CLASSES[accentColor] : DISABLED_BUTTON_CLASSES
          }`}
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>

      {/* MAX badge */}
      {showMaxBadge && isAtMax && (
        <span
          className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${MAX_BADGE_CLASSES[accentColor]}`}
        >
          MAX
        </span>
      )}
    </div>
  );
}
