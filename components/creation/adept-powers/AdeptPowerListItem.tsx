"use client";

/**
 * AdeptPowerListItem
 *
 * Compact row component for displaying selected adept powers in the powers list.
 * Follows the SpellListItem pattern for visual consistency.
 *
 * Features:
 * - Single-line compact layout with power name, activation badge, and PP cost
 * - Inline [-] N [+] level controls for rated powers
 * - Skill/Attribute dropdown for powers requiring specification
 * - X button for removal with red hover states
 * - Activation type badges (F/S/C/I/P)
 */

import { X, Zap, Minus, Plus, ChevronDown } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Activation badge config: letter + colors */
const ACTIVATION_BADGES: Record<string, { letter: string; bg: string; text: string }> = {
  free: {
    letter: "F",
    bg: "bg-violet-100 dark:bg-violet-900/50",
    text: "text-violet-700 dark:text-violet-300",
  },
  simple: {
    letter: "S",
    bg: "bg-blue-100 dark:bg-blue-900/50",
    text: "text-blue-700 dark:text-blue-300",
  },
  complex: {
    letter: "C",
    bg: "bg-amber-100 dark:bg-amber-900/50",
    text: "text-amber-700 dark:text-amber-300",
  },
  interrupt: {
    letter: "I",
    bg: "bg-red-100 dark:bg-red-900/50",
    text: "text-red-700 dark:text-red-300",
  },
  other: {
    letter: "P",
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-600 dark:text-zinc-400",
  },
};

/** Attribute display names */
const ATTRIBUTE_NAMES: Record<string, string> = {
  body: "Body",
  agility: "Agility",
  reaction: "Reaction",
  strength: "Strength",
  willpower: "Willpower",
  logic: "Logic",
  intuition: "Intuition",
  charisma: "Charisma",
};

// =============================================================================
// TYPES
// =============================================================================

export interface AdeptPowerListItemProps {
  /** Power name (without level) */
  displayName: string;
  /** Activation type: "free" | "simple" | "complex" | "interrupt" | "other" */
  activation: string;
  /** Power point cost (already calculated for current level) */
  powerPointCost: number;
  /** Whether this power has levels */
  isLeveled: boolean;
  /** Current level (1, 2, 3...) for rated powers */
  level?: number;
  /** Maximum allowed level */
  maxLevel?: number;
  /** Whether increase button should be enabled */
  canIncrease?: boolean;
  /** Whether decrease button should be enabled */
  canDecrease?: boolean;
  /** Callback when level is increased */
  onIncrease?: () => void;
  /** Callback when level is decreased */
  onDecrease?: () => void;
  /** Whether spec selection is needed (missing required spec) */
  needsSpec: boolean;
  /** Currently selected specification (attribute or skill ID) */
  specification?: string;
  /** Type of specification: "attribute" or "skill" */
  specType?: "attribute" | "skill";
  /** Valid specifications for dropdown */
  validSpecs?: string[];
  /** Callback when specification is changed */
  onSpecChange?: (spec: string) => void;
  /** Callback when power is removed */
  onRemove: () => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format a skill ID to display name (kebab-case to Title Case)
 */
function formatSkillName(skillId: string): string {
  return skillId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AdeptPowerListItem({
  displayName,
  activation,
  powerPointCost,
  isLeveled,
  level,
  maxLevel,
  canIncrease,
  canDecrease,
  onIncrease,
  onDecrease,
  needsSpec,
  specification,
  specType,
  validSpecs,
  onSpecChange,
  onRemove,
}: AdeptPowerListItemProps) {
  const badge = ACTIVATION_BADGES[activation] || ACTIVATION_BADGES.other;

  return (
    <div className="py-1.5">
      {/* Line 1: Power name and controls */}
      <div className="flex items-center justify-between">
        {/* Left side: icon + name + level controls + badges */}
        <div className="flex min-w-0 items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 shrink-0 text-violet-500" />
          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {displayName}
          </span>

          {/* Inline level controls for rated powers */}
          {isLeveled && level !== undefined && (
            <div className="ml-1 flex shrink-0 items-center gap-0.5">
              <button
                onClick={onDecrease}
                disabled={!canDecrease}
                aria-label={`Decrease ${displayName} level`}
                className={`flex h-5 w-5 items-center justify-center rounded text-xs transition-colors ${
                  canDecrease
                    ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
              >
                <Minus className="h-2.5 w-2.5" aria-hidden="true" />
              </button>
              <div className="flex h-5 w-6 items-center justify-center rounded bg-zinc-100 text-xs font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {level}
              </div>
              <button
                onClick={onIncrease}
                disabled={!canIncrease}
                aria-label={`Increase ${displayName} level`}
                className={`flex h-5 w-5 items-center justify-center rounded text-xs transition-colors ${
                  canIncrease
                    ? "bg-violet-500 text-white hover:bg-violet-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
              >
                <Plus className="h-2.5 w-2.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Activation badge (F/S/C/I/P) */}
          <span
            className={`shrink-0 rounded px-1 py-0.5 text-[10px] font-medium uppercase ${badge.bg} ${badge.text}`}
          >
            {badge.letter}
          </span>
        </div>

        {/* Right side: PP cost badge + remove */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Needs spec warning or PP cost */}
          {needsSpec ? (
            <span className="rounded bg-amber-200 px-1 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-800 dark:text-amber-200">
              SELECT {specType === "skill" ? "SKILL" : "ATTRIBUTE"}
            </span>
          ) : (
            <span className="rounded bg-violet-100 px-1 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
              {powerPointCost.toFixed(2)} PP
            </span>
          )}

          {/* Separator */}
          <div className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />

          {/* Remove button */}
          <button
            onClick={onRemove}
            aria-label={`Remove ${displayName}`}
            className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Line 2: Spec selector for powers requiring attribute/skill */}
      {validSpecs && validSpecs.length > 0 && (
        <div className="ml-5 mt-1 flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {specType === "skill" ? "Skill" : "Attribute"}:
          </span>
          <div className="relative">
            <select
              value={specification || ""}
              onChange={(e) => onSpecChange?.(e.target.value)}
              className={`appearance-none rounded border py-0.5 pl-2 pr-6 text-xs focus:outline-none focus:ring-1 ${
                specification
                  ? "border-violet-300 bg-violet-50 text-violet-900 focus:border-violet-500 focus:ring-violet-500 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-100"
                  : "border-amber-300 bg-amber-50 text-amber-900 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-100"
              }`}
            >
              <option value="">-- Select --</option>
              {validSpecs.map((spec) => (
                <option key={spec} value={spec}>
                  {specType === "skill" ? formatSkillName(spec) : ATTRIBUTE_NAMES[spec] || spec}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>
      )}
    </div>
  );
}
