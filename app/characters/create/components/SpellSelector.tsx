"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, Sparkles, Eye, Heart, Brain, Hand, Zap } from "lucide-react";
import type { SpellData, SpellsCatalogData } from "@/lib/rules/RulesetContext";

// =============================================================================
// TYPES
// =============================================================================

export interface SpellSelectorProps {
  /** Available spells catalog */
  spells: SpellsCatalogData | null;
  /** Maximum number of spells allowed */
  spellLimit: number;
  /** Currently selected spell IDs */
  selectedSpells: string[];
  /** Callback when selection changes */
  onSpellsChange: (spells: string[]) => void;
  /** Whether the selector is in readonly mode */
  readonly?: boolean;
}

type SpellCategory = "combat" | "detection" | "health" | "illusion" | "manipulation";

const CATEGORY_CONFIG: Record<SpellCategory, { label: string; icon: typeof Sparkles; color: string }> = {
  combat: { label: "Combat", icon: Zap, color: "text-red-500" },
  detection: { label: "Detection", icon: Eye, color: "text-blue-500" },
  health: { label: "Health", icon: Heart, color: "text-green-500" },
  illusion: { label: "Illusion", icon: Brain, color: "text-purple-500" },
  manipulation: { label: "Manipulation", icon: Hand, color: "text-amber-500" },
};

// =============================================================================
// SPELL CARD
// =============================================================================

function SpellCard({
  spell,
  isSelected,
  onToggle,
  disabled,
}: {
  spell: SpellData;
  isSelected: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled && !isSelected}
      className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
        isSelected
          ? "border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/30"
          : disabled
            ? "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-800 dark:bg-zinc-900"
            : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
            {spell.name}
          </h4>
          <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
            <span className={`rounded px-1.5 py-0.5 ${spell.type === "mana" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"}`}>
              {spell.type}
            </span>
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              {spell.range}
            </span>
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              {spell.duration}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
            Drain: {spell.drain}
          </span>
          {isSelected && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
      {spell.description && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {spell.description}
        </p>
      )}
    </button>
  );
}

// =============================================================================
// SPELL SELECTOR
// =============================================================================

export function SpellSelector({
  spells,
  spellLimit,
  selectedSpells,
  onSpellsChange,
  readonly = false,
}: SpellSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<SpellCategory>("combat");
  const [searchQuery, setSearchQuery] = useState("");

  const remainingSlots = spellLimit - selectedSpells.length;
  const isAtLimit = remainingSlots <= 0;

  // Get all spells as a flat array for selection lookup
  const allSpells = useMemo(() => {
    if (!spells) return [];
    return [
      ...spells.combat,
      ...spells.detection,
      ...spells.health,
      ...spells.illusion,
      ...spells.manipulation,
    ];
  }, [spells]);

  // Get spells for active category with search filter
  const filteredSpells = useMemo(() => {
    if (!spells) return [];
    const categorySpells = spells[activeCategory] || [];
    
    if (!searchQuery) return categorySpells;
    
    const query = searchQuery.toLowerCase();
    return categorySpells.filter(
      (spell) =>
        spell.name.toLowerCase().includes(query) ||
        spell.description?.toLowerCase().includes(query)
    );
  }, [spells, activeCategory, searchQuery]);

  // Handle spell toggle
  const handleSpellToggle = useCallback(
    (spellId: string) => {
      if (readonly) return;

      if (selectedSpells.includes(spellId)) {
        onSpellsChange(selectedSpells.filter((id) => id !== spellId));
      } else if (!isAtLimit) {
        onSpellsChange([...selectedSpells, spellId]);
      }
    },
    [selectedSpells, onSpellsChange, isAtLimit, readonly]
  );

  // Get counts per category
  const categoryCounts = useMemo(() => {
    if (!spells) return {};
    return {
      combat: selectedSpells.filter((id) => spells.combat.some((s) => s.id === id)).length,
      detection: selectedSpells.filter((id) => spells.detection.some((s) => s.id === id)).length,
      health: selectedSpells.filter((id) => spells.health.some((s) => s.id === id)).length,
      illusion: selectedSpells.filter((id) => spells.illusion.some((s) => s.id === id)).length,
      manipulation: selectedSpells.filter((id) => spells.manipulation.some((s) => s.id === id)).length,
    };
  }, [spells, selectedSpells]);

  if (!spells) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-400">No spells available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with budget */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Spell Selection
        </h3>
        <div className={`rounded-full px-3 py-1 text-sm font-medium ${
          remainingSlots > 0
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        }`}>
          {selectedSpells.length} / {spellLimit} spells
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search spells..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {(Object.keys(CATEGORY_CONFIG) as SpellCategory[]).map((category) => {
          const config = CATEGORY_CONFIG[category];
          const Icon = config.icon;
          const count = categoryCounts[category] || 0;
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? config.color : ""}`} />
              {config.label}
              {count > 0 && (
                <span className="ml-1 rounded-full bg-purple-500 px-1.5 py-0.5 text-xs text-white">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Spell grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredSpells.map((spell) => (
          <SpellCard
            key={spell.id}
            spell={spell}
            isSelected={selectedSpells.includes(spell.id)}
            onToggle={() => handleSpellToggle(spell.id)}
            disabled={isAtLimit || readonly}
          />
        ))}
        {filteredSpells.length === 0 && (
          <div className="col-span-2 py-8 text-center text-zinc-500 dark:text-zinc-400">
            {searchQuery ? "No spells match your search" : "No spells in this category"}
          </div>
        )}
      </div>

      {/* Selected spells summary */}
      {selectedSpells.length > 0 && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
          <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
            Selected Spells ({selectedSpells.length}):
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedSpells.map((spellId) => {
              const spell = allSpells.find((s) => s.id === spellId);
              if (!spell) return null;
              return (
                <span
                  key={spellId}
                  className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                >
                  {spell.name}
                  {!readonly && (
                    <button
                      onClick={() => handleSpellToggle(spellId)}
                      className="ml-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
