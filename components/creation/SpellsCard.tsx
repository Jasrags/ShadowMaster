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
 * - Two-column modal for spell selection (via SpellModal)
 * - Spell rows grouped by category
 * - Remove button for selected spells
 * - Attribute selection for parameterized spells (Increase/Decrease [Attribute])
 */

import { useMemo, useCallback, useState } from "react";
import { useSpells, usePriorityTable } from "@/lib/rules";
import type { CreationState, SpellSelection } from "@/lib/types";
import { getSpellId, isSpellSelectionObject } from "@/lib/types";
import type { SpellData } from "@/lib/rules";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator, SummaryFooter } from "./shared";
import { SpellModal, SpellListItem } from "./spells";
import { Lock, Plus, Sparkles } from "lucide-react";

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

// Attribute display names
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

interface SpellsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the display name for a spell, accounting for attribute selection
 */
function getSpellDisplayName(spell: SpellData, selectedAttribute?: string): string {
  if (spell.requiresAttributeSelection && selectedAttribute) {
    // Replace [Attribute] with the selected attribute name
    const attrName = ATTRIBUTE_NAMES[selectedAttribute] || selectedAttribute;
    return spell.name.replace("[Attribute]", `[${attrName}]`);
  }
  return spell.name;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SpellsCard({ state, updateState }: SpellsCardProps) {
  const spellsCatalog = useSpells();
  const priorityTable = usePriorityTable();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  const [showAddModal, setShowAddModal] = useState(false);

  // Get selected magical path
  const magicalPath = (state.selections["magical-path"] as string) || "mundane";
  const canHaveSpells = SPELL_PATHS.includes(magicalPath);

  // For aspected mages, check if they have sorcery
  const aspectedGroup = state.selections["aspected-mage-group"] as string | undefined;
  const isBlockedAspected =
    magicalPath === "aspected-mage" && aspectedGroup && aspectedGroup !== "sorcery";

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

  // Get current selections - supports both legacy string[] and new SpellSelection[]
  const selectedSpells = useMemo(
    () => (state.selections.spells || []) as SpellSelection[],
    [state.selections.spells]
  );

  // Get spell IDs for counting/checking
  const selectedSpellIds = useMemo(() => selectedSpells.map(getSpellId), [selectedSpells]);

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

  // Get selected spell objects grouped by category
  const selectedSpellsGrouped = useMemo(() => {
    const groups: Record<string, Array<{ spell: SpellData; selection: SpellSelection }>> = {};

    selectedSpells.forEach((selection) => {
      const spellId = getSpellId(selection);
      const spell = allSpells.find((s) => s.id === spellId);
      if (spell) {
        const cat = spell.category || "other";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push({ spell, selection });
      }
    });

    return groups;
  }, [selectedSpells, allSpells]);

  // Add spell from modal
  const addSpell = useCallback(
    (spellId: string, selectedAttribute?: string) => {
      const spell = allSpells.find((s) => s.id === spellId);
      if (!spell) return;

      // Check cost
      const willBeFree = selectedSpells.length < freeSpells;
      if (!willBeFree && karmaRemaining < SPELL_KARMA_COST) return;

      // Create new selection - object form if parameterized, string otherwise
      const newSelection: SpellSelection =
        spell.requiresAttributeSelection && selectedAttribute
          ? { id: spellId, selectedAttribute }
          : spell.requiresAttributeSelection
            ? { id: spellId }
            : spellId;

      const newSpells = [...selectedSpells, newSelection];

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
      allSpells,
      selectedSpells,
      freeSpells,
      karmaRemaining,
      state.selections,
      state.budgets,
      updateState,
    ]
  );

  // Update attribute selection for a spell
  const updateSpellAttribute = useCallback(
    (spellId: string, attribute: string) => {
      const newSpells = selectedSpells.map((s): SpellSelection => {
        if (getSpellId(s) === spellId) {
          return { id: spellId, selectedAttribute: attribute || undefined };
        }
        return s;
      });

      updateState({
        selections: {
          ...state.selections,
          spells: newSpells,
        },
      });
    },
    [selectedSpells, state.selections, updateState]
  );

  // Remove spell
  const removeSpell = useCallback(
    (spellId: string) => {
      const newSpells = selectedSpells.filter((s) => getSpellId(s) !== spellId);
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

  // Check if any parameterized spells are missing attribute selection
  const hasIncompleteSpells = useMemo(() => {
    return selectedSpells.some((selection) => {
      const spellId = getSpellId(selection);
      const spell = allSpells.find((s) => s.id === spellId);
      if (!spell?.requiresAttributeSelection) return false;
      const selectedAttr = isSpellSelectionObject(selection)
        ? selection.selectedAttribute
        : undefined;
      return !selectedAttr;
    });
  }, [selectedSpells, allSpells]);

  // Validation status
  const validationStatus = useMemo(() => {
    if (!canHaveSpells || isBlockedAspected) return "pending";
    if (hasIncompleteSpells) return "warning";
    if (selectedSpells.length >= freeSpells) return "valid";
    if (selectedSpells.length > 0) return "warning";
    if (freeSpells > 0) return "warning";
    return "pending";
  }, [canHaveSpells, isBlockedAspected, hasIncompleteSpells, selectedSpells.length, freeSpells]);

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
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No spells available — Adept</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Adepts channel magic through their bodies as Adept Powers, not spells. See the Adept
            Powers section to allocate your Power Points.
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard title="Spells" status={validationStatus}>
      <div className="space-y-4">
        {/* Spells Budget */}
        <BudgetIndicator
          label="Spells"
          spent={Math.min(selectedSpells.length, freeSpells)}
          total={freeSpells}
          tooltip={`Spells from your Magic priority. ${prioritySource}`}
          mode="compact"
          note={isOverFree ? `+${karmaSpentOnSpells} via karma` : undefined}
          noteStyle="warning"
        />

        {/* Incomplete spells warning */}
        {hasIncompleteSpells && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Attribute Selection Required
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Some spells require you to select which attribute they affect.
            </p>
          </div>
        )}

        {/* Category Header with Add Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Spells
            </span>
            {selectedSpells.length > 0 && (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                {selectedSpells.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        {/* Selected spells grouped by category */}
        {selectedSpells.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Selected Spells ({selectedSpells.length})
              </h4>
            </div>

            {Object.entries(selectedSpellsGrouped).map(([category, items]) => (
              <div key={category}>
                <h5 className="mb-2 text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
                  {category}
                </h5>
                <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
                  {items.map(({ spell, selection }) => {
                    const spellIndex = selectedSpellIds.indexOf(spell.id);
                    const isFree = spellIndex < freeSpells;
                    const selectedAttribute = isSpellSelectionObject(selection)
                      ? selection.selectedAttribute
                      : undefined;
                    const needsAttribute = !!(
                      spell.requiresAttributeSelection && !selectedAttribute
                    );

                    return (
                      <SpellListItem
                        key={spell.id}
                        displayName={getSpellDisplayName(spell, selectedAttribute)}
                        spellType={spell.type === "mana" ? "mana" : "physical"}
                        category={spell.category || "other"}
                        drain={spell.drain}
                        isFree={isFree}
                        karmaCost={isFree ? undefined : SPELL_KARMA_COST}
                        needsAttribute={needsAttribute}
                        selectedAttribute={selectedAttribute}
                        validAttributes={
                          spell.requiresAttributeSelection ? spell.validAttributes : undefined
                        }
                        attributeLabel={spell.attributeSelectionLabel}
                        onAttributeChange={(attr) => updateSpellAttribute(spell.id, attr)}
                        onRemove={() => removeSpell(spell.id)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {selectedSpells.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">No spells selected</p>
          </div>
        )}

        {/* Footer Summary */}
        <SummaryFooter
          count={selectedSpells.length}
          total={
            freeRemaining > 0
              ? `${freeRemaining} free remaining`
              : isOverFree
                ? `${karmaSpentOnSpells} karma`
                : "0 karma"
          }
          label="spell"
        />

        {/* Add Spell Modal */}
        <SpellModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={addSpell}
          allSpells={allSpells}
          existingSelections={selectedSpells}
          freeSpells={freeSpells}
          karmaRemaining={karmaRemaining}
        />
      </div>
    </CreationCard>
  );
}
