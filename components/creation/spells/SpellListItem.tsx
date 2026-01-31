"use client";

/**
 * SpellListItem
 *
 * Compact row component for displaying selected spells in the spells list.
 * Matches the SkillListItem pattern for visual consistency.
 *
 * Features:
 * - Single-line compact layout with spell name, type, category, and drain
 * - FREE/KARMA badges based on spell position
 * - Attribute dropdown for parameterized spells (Increase/Decrease [Attribute])
 * - Remove button with red hover states
 */

import { X, Sparkles, ChevronDown } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

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

export interface SpellListItemProps {
  /** Spell name with attribute substitution applied */
  displayName: string;
  /** Spell type: mana or physical */
  spellType: "mana" | "physical";
  /** Spell category (combat, detection, etc.) */
  category: string;
  /** Drain value (e.g., "F-3") */
  drain: string;
  /** Whether this spell is free (from priority) */
  isFree: boolean;
  /** Karma cost when not free */
  karmaCost?: number;
  /** Whether attribute selection is needed */
  needsAttribute: boolean;
  /** Currently selected attribute */
  selectedAttribute?: string;
  /** Valid attributes for selection */
  validAttributes?: string[];
  /** Label for attribute selection dropdown */
  attributeLabel?: string;
  /** Callback when attribute is changed */
  onAttributeChange?: (attr: string) => void;
  /** Callback when spell is removed */
  onRemove: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SpellListItem({
  displayName,
  spellType,
  category,
  drain,
  isFree,
  karmaCost,
  needsAttribute,
  selectedAttribute,
  validAttributes,
  attributeLabel,
  onAttributeChange,
  onRemove,
}: SpellListItemProps) {
  return (
    <div className="py-1.5">
      {/* Line 1: Spell name and controls */}
      <div className="flex items-center justify-between">
        {/* Left side: icon + name + badges */}
        <div className="flex min-w-0 items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {displayName}
          </span>
          {/* Type badge (M/P) */}
          <span
            className={`shrink-0 rounded px-1 py-0.5 text-[10px] font-medium uppercase ${
              spellType === "mana"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            }`}
          >
            {spellType === "mana" ? "M" : "P"}
          </span>
          {/* Category and drain */}
          <span className="shrink-0 text-[10px] text-zinc-500 dark:text-zinc-400">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          <span className="shrink-0 text-[10px] text-zinc-500 dark:text-zinc-400">{drain}</span>
        </div>

        {/* Right side: cost badge + remove */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Cost badge */}
          {needsAttribute ? (
            <span className="rounded bg-amber-200 px-1 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-800 dark:text-amber-200">
              SELECT ATTRIBUTE
            </span>
          ) : isFree ? (
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              FREE
            </span>
          ) : (
            <span className="rounded bg-amber-100 px-1 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              {karmaCost} KARMA
            </span>
          )}

          {/* Separator */}
          <div className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />

          {/* Remove button */}
          <button
            onClick={onRemove}
            className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Line 2: Attribute selector for parameterized spells */}
      {validAttributes && validAttributes.length > 0 && (
        <div className="ml-5 mt-1 flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {attributeLabel || "Attribute"}:
          </span>
          <div className="relative">
            <select
              value={selectedAttribute || ""}
              onChange={(e) => onAttributeChange?.(e.target.value)}
              className={`appearance-none rounded border py-0.5 pl-2 pr-6 text-xs focus:outline-none focus:ring-1 ${
                selectedAttribute
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100"
                  : "border-amber-300 bg-amber-50 text-amber-900 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-100"
              }`}
            >
              <option value="">-- Select --</option>
              {validAttributes.map((attr) => (
                <option key={attr} value={attr}>
                  {ATTRIBUTE_NAMES[attr] || attr}
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
