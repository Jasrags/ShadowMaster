"use client";

/**
 * SpellsCard
 *
 * Card for spell selection in sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - Progress bar for free spells budget
 * - Karma spend indicator for extra spells
 * - Category tabs with spell counts
 * - Modal-style spell selection with search
 * - Spell rows grouped by category
 * - Remove button for selected spells
 */

import { useMemo, useCallback, useState } from "react";
import { useSpells, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { SpellData } from "@/lib/rules";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Check, Search, X, Plus, Sparkles } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

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

// =============================================================================
// TYPES
// =============================================================================

interface SpellsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// SPELL ROW COMPONENT
// =============================================================================

function SpellRow({
  spell,
  isSelected,
  canSelect,
  isFree,
  onToggle,
  onRemove,
  showRemove,
}: {
  spell: SpellData;
  isSelected: boolean;
  canSelect: boolean;
  isFree: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  showRemove: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 transition-all ${
        isSelected
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
          : canSelect
            ? "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
            : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          disabled={!canSelect && !isSelected}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
            isSelected
              ? "border-emerald-500 bg-emerald-500 text-white"
              : canSelect
                ? "border-zinc-300 hover:border-emerald-400 dark:border-zinc-600"
                : "border-zinc-200 dark:border-zinc-700"
          }`}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </button>

        {/* Spell info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {spell.name}
            </span>

            {/* Badges */}
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${
              spell.type === "mana"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            }`}>
              {spell.type}
            </span>

            {isFree && isSelected && (
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                FREE
              </span>
            )}

            {!isFree && isSelected && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                {SPELL_KARMA_COST} KARMA
              </span>
            )}
          </div>

          {/* Spell stats */}
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Type: {spell.type === "mana" ? "M" : "P"}</span>
            <span>Range: {spell.range}</span>
            {spell.damage && <span>Damage: {spell.damage}</span>}
            <span>Duration: {spell.duration?.charAt(0).toUpperCase() || "I"}</span>
            <span>Drain: {spell.drain}</span>
          </div>

          {/* Description */}
          {spell.description && (
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {spell.description}
            </div>
          )}
        </div>

        {/* Remove button */}
        {showRemove && isSelected && (
          <button
            onClick={onRemove}
            className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SpellsCard({ state, updateState }: SpellsCardProps) {
  const spellsCatalog = useSpells();
  const priorityTable = usePriorityTable();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SpellCategory | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Get selected magical path
  const magicalPath = (state.selections["magical-path"] as string) || "mundane";
  const canHaveSpells = SPELL_PATHS.includes(magicalPath);

  // For aspected mages, check if they have sorcery
  const aspectedGroup = state.selections["aspected-mage-group"] as string | undefined;
  const isBlockedAspected = magicalPath === "aspected-mage" && aspectedGroup && aspectedGroup !== "sorcery";

  // Get magic priority and free spell count
  const { freeSpells } = useMemo(() => {
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

  // Get selected spell objects grouped by category
  const selectedSpellsGrouped = useMemo(() => {
    const groups: Record<string, SpellData[]> = {};

    selectedSpells.forEach((spellId) => {
      const spell = allSpells.find((s) => s.id === spellId);
      if (spell) {
        const cat = spell.category || "other";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(spell);
      }
    });

    return groups;
  }, [selectedSpells, allSpells]);

  // Toggle spell selection
  const toggleSpell = useCallback(
    (spellId: string) => {
      const isSelected = selectedSpells.includes(spellId);
      let newSpells: string[];

      if (isSelected) {
        newSpells = selectedSpells.filter((id) => id !== spellId);
      } else {
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
      freeSpells,
      karmaRemaining,
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
  const freeRemaining = Math.max(0, freeSpells - selectedSpells.length);
  const isOverFree = selectedSpells.length > freeSpells;

  // Validation status
  const validationStatus = useMemo(() => {
    if (!canHaveSpells || isBlockedAspected) return "pending";
    if (selectedSpells.length >= freeSpells) return "valid";
    if (selectedSpells.length > 0) return "warning";
    if (freeSpells > 0) return "warning";
    return "pending";
  }, [canHaveSpells, isBlockedAspected, selectedSpells.length, freeSpells]);

  // Magic priority source
  const prioritySource = useMemo(() => {
    const magicPriority = state.priorities?.magic;
    if (!magicPriority) return "";
    const pathName = magicalPath.charAt(0).toUpperCase() + magicalPath.slice(1).replace("-", " ");
    return `From Magic Priority ${magicPriority} (${pathName})`;
  }, [state.priorities?.magic, magicalPath]);

  // Check if path supports spells
  if (!canHaveSpells) {
    return (
      <CreationCard title="Spells" description="Not available" status="pending">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
            <Lock className="h-5 w-5 text-zinc-400" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No spells available — Mundane character
            </p>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Change your Magic/Resonance path to unlock spells.
          </p>
        </div>
      </CreationCard>
    );
  }

  // Aspected mage without sorcery
  if (isBlockedAspected) {
    return (
      <CreationCard title="Spells" description="Not available" status="pending">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            No spells available — {aspectedGroup} Aspected Mage
          </p>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            As a {aspectedGroup} aspected mage, you cannot learn spells.
          </p>
        </div>
      </CreationCard>
    );
  }

  // Adept check
  if (magicalPath === "adept") {
    return (
      <CreationCard title="Spells" description="Not available" status="pending">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No spells available — Adept
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Adepts channel magic through their bodies as Adept Powers, not spells.
            See the Adept Powers section to allocate your Power Points.
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Spells"
      description={
        selectedSpells.length === 0
          ? `${freeSpells} free spells available`
          : freeRemaining > 0
            ? `${selectedSpells.length}/${freeSpells} free spells`
            : isOverFree
              ? `${selectedSpells.length} spells (+${karmaSpentOnSpells} karma)`
              : "All free spells used"
      }
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Free Spells Budget */}
        <BudgetIndicator
          label="Free Spells"
          description="Spells from your Magic priority"
          spent={Math.min(selectedSpells.length, freeSpells)}
          total={freeSpells}
          source={prioritySource}
          mode="card"
          karmaRequired={isOverFree ? karmaSpentOnSpells : undefined}
          karmaCostPerUnit={SPELL_KARMA_COST}
          unitName="spell"
        />

        {/* Karma spend indicator */}
        {karmaSpentOnSpells > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Spells via Karma
              </div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                {karmaSpentOnSpells} karma
              </div>
            </div>
            <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              {spellsBeyondFree} additional spell{spellsBeyondFree !== 1 ? "s" : ""} at {SPELL_KARMA_COST} karma each
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            All
          </button>
          {SPELL_CATEGORIES.map((cat) => {
            const count = spellsPerCategory[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-emerald-600 text-white"
                    : count > 0
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {cat.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Add button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 py-3 text-sm font-medium text-zinc-600 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
        >
          <Plus className="h-4 w-4" />
          Add Spell
        </button>

        {/* Selected spells grouped by category */}
        {selectedSpells.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Selected Spells ({selectedSpells.length})
              </h4>
            </div>

            {Object.entries(selectedSpellsGrouped).map(([category, spells]) => (
              <div key={category}>
                <h5 className="mb-2 text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
                  {category}
                </h5>
                <div className="space-y-2">
                  {spells.map((spell) => {
                    const spellIndex = selectedSpells.indexOf(spell.id);
                    const isFree = spellIndex < freeSpells;

                    return (
                      <SpellRow
                        key={spell.id}
                        spell={spell}
                        isSelected={true}
                        canSelect={true}
                        isFree={isFree}
                        onToggle={() => removeSpell(spell.id)}
                        onRemove={() => removeSpell(spell.id)}
                        showRemove={true}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary footer */}
        {selectedSpells.length > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {selectedSpells.length} spell{selectedSpells.length !== 1 ? "s" : ""} selected
            </span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {freeRemaining > 0 ? `${freeRemaining} free remaining` :
               isOverFree ? `${karmaSpentOnSpells} karma spent` : "All free spells used"}
            </span>
          </div>
        )}

        {/* Add Spell Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />

            {/* Modal */}
            <div className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    ADD SPELL
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Budget info */}
              <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {freeRemaining > 0 ? (
                    <>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {freeRemaining} free spell{freeRemaining !== 1 ? "s" : ""} remaining
                      </span>
                      <span className="mx-2">•</span>
                      Additional spells: {SPELL_KARMA_COST} karma each
                    </>
                  ) : (
                    <>
                      All free spells used
                      <span className="mx-2">•</span>
                      <span className="text-amber-600 dark:text-amber-400">
                        Additional spells: {SPELL_KARMA_COST} karma each
                      </span>
                    </>
                  )}
                </p>
              </div>

              {/* Search */}
              <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search spells..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Spell list */}
              <div className="max-h-[50vh] overflow-y-auto p-4">
                <div className="space-y-2">
                  {filteredSpells.map((spell) => {
                    const isSelected = selectedSpells.includes(spell.id);
                    const willBeFree = selectedSpells.length < freeSpells;
                    const canSelect = isSelected || willBeFree || karmaRemaining >= SPELL_KARMA_COST;
                    const spellIndex = selectedSpells.indexOf(spell.id);
                    const isFree = isSelected && spellIndex < freeSpells;

                    return (
                      <SpellRow
                        key={spell.id}
                        spell={spell}
                        isSelected={isSelected}
                        canSelect={canSelect}
                        isFree={isFree || (!isSelected && willBeFree)}
                        onToggle={() => toggleSpell(spell.id)}
                        showRemove={false}
                      />
                    );
                  })}

                  {filteredSpells.length === 0 && (
                    <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      No spells found matching your search
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {selectedSpells.length} spell{selectedSpells.length !== 1 ? "s" : ""} selected
                </span>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CreationCard>
  );
}
