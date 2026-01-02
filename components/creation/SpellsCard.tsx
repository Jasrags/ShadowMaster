"use client";

/**
 * SpellsCard
 *
 * Compact card for spell selection in sheet-driven creation.
 * Shows spell list with categories, free spells, and karma costs.
 *
 * Features:
 * - Spell list with categories
 * - Free spells from priority
 * - Karma cost for additional spells
 * - Category limits (Magic × 2 per category)
 * - Search and filter
 */

import { useMemo, useCallback, useState } from "react";
import { useSpells, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { SpellData } from "@/lib/rules";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Check, Search, X } from "lucide-react";

const SPELL_KARMA_COST = 5;

type SpellCategory = "combat" | "detection" | "health" | "illusion" | "manipulation";

const SPELL_CATEGORIES: { id: SpellCategory; name: string }[] = [
  { id: "combat", name: "Combat" },
  { id: "detection", name: "Detection" },
  { id: "health", name: "Health" },
  { id: "illusion", name: "Illusion" },
  { id: "manipulation", name: "Manipulation" },
];

// Paths that can have spells
const SPELL_PATHS = ["magician", "mystic-adept", "aspected-mage"];

interface SpellsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function SpellsCard({ state, updateState }: SpellsCardProps) {
  const spellsCatalog = useSpells();
  const priorityTable = usePriorityTable();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SpellCategory | "all">("all");

  // Get selected magical path
  const magicalPath = (state.selections["magical-path"] as string) || "mundane";
  const canHaveSpells = SPELL_PATHS.includes(magicalPath);

  // For aspected mages, check if they have sorcery
  const aspectedGroup = state.selections["aspected-mage-group"] as string | undefined;
  const isSorceryAspected = magicalPath === "aspected-mage" && aspectedGroup === "sorcery";
  const isBlockedAspected = magicalPath === "aspected-mage" && aspectedGroup && aspectedGroup !== "sorcery";

  // Get magic priority and free spell count
  const { freeSpells, magicRating } = useMemo(() => {
    const magicPriority = state.priorities?.magic;
    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return { freeSpells: 0, magicRating: 0 };
    }

    const magicData = priorityTable.table[magicPriority].magic as {
      options?: Array<{
        path: string;
        spells?: number;
        magicRating?: number;
      }>;
    };

    const option = magicData?.options?.find((o) => o.path === magicalPath);
    return {
      freeSpells: option?.spells || 0,
      magicRating: option?.magicRating || 0,
    };
  }, [state.priorities?.magic, priorityTable, magicalPath]);

  // Max spells per category = Magic × 2
  const maxPerCategory = magicRating * 2;

  // Get current selections
  const selectedSpells = useMemo(
    () => (state.selections.spells || []) as string[],
    [state.selections.spells]
  );

  // Get karma tracking
  const karmaRemaining = karmaBudget?.remaining || 0;

  // Flatten spell catalog
  const allSpells = useMemo(() => {
    if (!spellsCatalog) return [];
    const spells: SpellData[] = [];
    for (const category of SPELL_CATEGORIES) {
      if (spellsCatalog[category.id]) {
        spells.push(...spellsCatalog[category.id]);
      }
    }
    return spells;
  }, [spellsCatalog]);

  // Calculate spells per category
  const spellsPerCategory = useMemo(() => {
    const counts: Record<SpellCategory, number> = {
      combat: 0,
      detection: 0,
      health: 0,
      illusion: 0,
      manipulation: 0,
    };

    selectedSpells.forEach((spellId) => {
      const spell = allSpells.find((s) => s.id === spellId);
      if (spell && spell.category in counts) {
        counts[spell.category as SpellCategory]++;
      }
    });

    return counts;
  }, [selectedSpells, allSpells]);

  // Check if category at limit
  const isCategoryAtLimit = useCallback(
    (category: SpellCategory) => spellsPerCategory[category] >= maxPerCategory,
    [spellsPerCategory, maxPerCategory]
  );

  // Filter spells
  const filteredSpells = useMemo(() => {
    let spells = allSpells;

    if (activeCategory !== "all") {
      spells = spells.filter((s) => s.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      spells = spells.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.description?.toLowerCase().includes(search)
      );
    }

    return spells;
  }, [allSpells, activeCategory, searchQuery]);

  // Toggle spell selection
  const toggleSpell = useCallback(
    (spellId: string) => {
      const isSelected = selectedSpells.includes(spellId);
      const spell = allSpells.find((s) => s.id === spellId);
      let newSpells: string[];

      if (isSelected) {
        newSpells = selectedSpells.filter((id) => id !== spellId);
      } else {
        // Check category limit
        if (spell && isCategoryAtLimit(spell.category as SpellCategory)) return;

        // Check cost
        const willBeFree = selectedSpells.length < freeSpells;
        if (!willBeFree && karmaRemaining < SPELL_KARMA_COST) return;

        newSpells = [...selectedSpells, spellId];
      }

      // Calculate new karma cost
      const newSpellsBeyondFree = Math.max(0, newSpells.length - freeSpells);
      const newKarmaSpentOnSpells = newSpellsBeyondFree * SPELL_KARMA_COST;

      updateState({
        selections: {
          ...state.selections,
          spells: newSpells,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-spells": newKarmaSpentOnSpells,
        },
      });
    },
    [
      selectedSpells,
      allSpells,
      freeSpells,
      karmaRemaining,
      isCategoryAtLimit,
      state.selections,
      state.budgets,
      updateState,
    ]
  );

  // Remove spell
  const removeSpell = useCallback(
    (spellId: string) => {
      const newSpells = selectedSpells.filter((id) => id !== spellId);
      const newSpellsBeyondFree = Math.max(0, newSpells.length - freeSpells);
      const newKarmaSpentOnSpells = newSpellsBeyondFree * SPELL_KARMA_COST;

      updateState({
        selections: {
          ...state.selections,
          spells: newSpells,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-spells": newKarmaSpentOnSpells,
        },
      });
    },
    [selectedSpells, freeSpells, state.selections, state.budgets, updateState]
  );

  const spellsBeyondFree = Math.max(0, selectedSpells.length - freeSpells);
  const karmaSpentOnSpells = spellsBeyondFree * SPELL_KARMA_COST;

  // Validation status
  const validationStatus = useMemo(() => {
    if (!canHaveSpells || isBlockedAspected) return "pending";
    if (selectedSpells.length > 0) return "valid";
    if (freeSpells > 0) return "warning";
    return "pending";
  }, [canHaveSpells, isBlockedAspected, selectedSpells.length, freeSpells]);

  // Check if path supports spells
  if (!canHaveSpells) {
    return (
      <CreationCard title="Spells" description="Select spells" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select a magical path first
          </p>
        </div>
      </CreationCard>
    );
  }

  // Aspected mage without sorcery
  if (isBlockedAspected) {
    return (
      <CreationCard title="Spells" description="Not available" status="pending">
        <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            As a {aspectedGroup} aspected mage, you cannot learn spells.
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Spells"
      description={`${selectedSpells.length}/${freeSpells} free spells${spellsBeyondFree > 0 ? ` (+${spellsBeyondFree} karma)` : ""}`}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Budget indicators */}
        <div className="grid gap-2 sm:grid-cols-2">
          <BudgetIndicator
            label="Free Spells"
            remaining={Math.max(0, freeSpells - selectedSpells.length)}
            total={freeSpells}
            compact
          />
          {spellsBeyondFree > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-zinc-500">Karma spent:</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {karmaSpentOnSpells}
              </span>
            </div>
          )}
        </div>

        {/* Category limits */}
        <div className="flex flex-wrap gap-1">
          {SPELL_CATEGORIES.map((cat) => {
            const count = spellsPerCategory[cat.id];
            const isAtLimit = count >= maxPerCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-emerald-600 text-white"
                    : isAtLimit
                    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    : count > 0
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                }`}
              >
                {cat.name}: {count}/{maxPerCategory}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search spells..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Spell list */}
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {filteredSpells.map((spell) => {
            const isSelected = selectedSpells.includes(spell.id);
            const categoryAtLimit = isCategoryAtLimit(spell.category as SpellCategory);
            const willBeFree = selectedSpells.length < freeSpells;
            const canSelect =
              isSelected ||
              (!categoryAtLimit && (willBeFree || karmaRemaining >= SPELL_KARMA_COST));

            return (
              <button
                key={spell.id}
                onClick={() => canSelect && toggleSpell(spell.id)}
                disabled={!canSelect}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                  isSelected
                    ? "bg-emerald-50 ring-1 ring-emerald-300 dark:bg-emerald-900/30 dark:ring-emerald-700"
                    : canSelect
                    ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                    : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{spell.name}</span>
                    <div className="flex gap-1 text-[10px] uppercase">
                      <span
                        className={`rounded px-1 py-0.5 ${
                          spell.type === "mana"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                            : "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
                        }`}
                      >
                        {spell.type}
                      </span>
                      <span className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                        {spell.category}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {spell.drain}
                </span>
              </button>
            );
          })}

          {filteredSpells.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No spells found
            </div>
          )}
        </div>

        {/* Selected spells summary */}
        {selectedSpells.length > 0 && (
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Selected Spells ({selectedSpells.length})
            </h4>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedSpells.map((id) => {
                const spell = allSpells.find((s) => s.id === id);
                return spell ? (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                  >
                    {spell.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSpell(id);
                      }}
                      className="hover:text-emerald-900 dark:hover:text-emerald-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </CreationCard>
  );
}
