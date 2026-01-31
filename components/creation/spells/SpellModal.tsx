"use client";

/**
 * SpellModal
 *
 * Two-column modal for adding spells during character creation.
 * Follows the SkillModal pattern with:
 * - Search and category filtering
 * - Split-pane design (list left, details right)
 * - Attribute selection for parameterized spells
 * - Multi-add workflow (stays open after adding)
 * - Duplicate prevention
 *
 * Uses BaseModal for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import type { SpellData } from "@/lib/rules";
import type { SpellSelection } from "@/lib/types";
import { getSpellId, isSpellSelectionObject } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Check, ChevronDown, Sparkles } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const SPELL_KARMA_COST = 5;

type SpellCategory = "combat" | "detection" | "health" | "illusion" | "manipulation";

const SPELL_CATEGORIES: { id: SpellCategory | "all"; name: string }[] = [
  { id: "all", name: "All" },
  { id: "combat", name: "Combat" },
  { id: "detection", name: "Detection" },
  { id: "health", name: "Health" },
  { id: "illusion", name: "Illusion" },
  { id: "manipulation", name: "Manipulation" },
];

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

export interface SpellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (spellId: string, selectedAttribute?: string) => void;
  allSpells: SpellData[];
  existingSelections: SpellSelection[];
  freeSpells: number;
  karmaRemaining: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the display name for a spell, accounting for attribute selection
 */
function getSpellDisplayName(spell: SpellData, selectedAttribute?: string): string {
  if (spell.requiresAttributeSelection && selectedAttribute) {
    const attrName = ATTRIBUTE_NAMES[selectedAttribute] || selectedAttribute;
    return spell.name.replace("[Attribute]", `[${attrName}]`);
  }
  return spell.name;
}

/**
 * Check if a spell selection exists for a catalog ID
 */
function hasSelectionForCatalogId(selections: SpellSelection[], catalogId: string): boolean {
  return selections.some((s) => getSpellId(s) === catalogId);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SpellModal({
  isOpen,
  onClose,
  onAdd,
  allSpells,
  existingSelections,
  freeSpells,
  karmaRemaining,
}: SpellModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SpellCategory | "all">("all");
  const [selectedSpellId, setSelectedSpellId] = useState<string | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");

  // Track how many spells were added in this session
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Full reset on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSpellId(null);
    setSelectedAttribute("");
    setAddedThisSession(0);
  }, []);

  // Reset for adding another spell - preserves search/filter
  const resetForNextSpell = useCallback(() => {
    setSelectedSpellId(null);
    setSelectedAttribute("");
  }, []);

  // Filter spells
  const filteredSpells = useMemo(() => {
    let spells = allSpells;

    if (selectedCategory !== "all") {
      spells = spells.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      spells = spells.filter(
        (s) =>
          s.name.toLowerCase().includes(search) || s.description?.toLowerCase().includes(search)
      );
    }

    return spells;
  }, [allSpells, selectedCategory, searchQuery]);

  // Group spells by category for display
  const spellsByCategory = useMemo(() => {
    const grouped: Record<string, SpellData[]> = {};
    filteredSpells.forEach((spell) => {
      const cat = spell.category || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(spell);
    });
    // Sort spells within each category
    Object.values(grouped).forEach((spells) => {
      spells.sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredSpells]);

  // Get selected spell data
  const selectedSpell = useMemo(() => {
    if (!selectedSpellId) return null;
    return allSpells.find((s) => s.id === selectedSpellId) || null;
  }, [allSpells, selectedSpellId]);

  // Calculate costs
  const totalSelected = existingSelections.length;
  const freeRemaining = Math.max(0, freeSpells - totalSelected);
  const willBeFree = totalSelected < freeSpells;
  const canAfford = willBeFree || karmaRemaining >= SPELL_KARMA_COST;

  // Check if selected spell requires attribute and has one selected
  const needsAttribute = selectedSpell?.requiresAttributeSelection && !selectedAttribute;
  const canAdd = selectedSpell && canAfford && !needsAttribute;

  // Handle add spell
  const handleAddSpell = useCallback(() => {
    if (!selectedSpellId || !canAdd) return;
    const attr = selectedSpell?.requiresAttributeSelection ? selectedAttribute : undefined;
    onAdd(selectedSpellId, attr);
    setAddedThisSession((prev) => prev + 1);
    resetForNextSpell();
  }, [selectedSpellId, selectedSpell, selectedAttribute, canAdd, onAdd, resetForNextSpell]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Category display order
  const categoryOrder = ["combat", "detection", "health", "illusion", "manipulation", "other"];

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Spell" onClose={close}>
            <Sparkles className="h-5 w-5 text-emerald-500" />
          </ModalHeader>

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search spells..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Category Filter */}
            <div className="mt-3 flex flex-wrap gap-2">
              {SPELL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - Spell List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {categoryOrder
                  .filter((cat) => spellsByCategory[cat]?.length > 0)
                  .map((category) => (
                    <div key={category}>
                      <div className="sticky top-0 z-10 bg-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {category}
                      </div>
                      {spellsByCategory[category].map((spell) => {
                        const isSelected = selectedSpellId === spell.id;
                        const isAlreadyAdded = hasSelectionForCatalogId(
                          existingSelections,
                          spell.id
                        );
                        // Get the selected attribute if this spell was previously added with one
                        const existingSelection = existingSelections.find(
                          (s) => getSpellId(s) === spell.id
                        );
                        const existingAttr =
                          existingSelection && isSpellSelectionObject(existingSelection)
                            ? existingSelection.selectedAttribute
                            : undefined;

                        return (
                          <button
                            key={spell.id}
                            onClick={() => !isAlreadyAdded && setSelectedSpellId(spell.id)}
                            disabled={isAlreadyAdded}
                            className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                              isSelected
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                : isAlreadyAdded
                                  ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
                                  : "rounded-md text-zinc-700 hover:outline hover:outline-1 hover:outline-emerald-400 dark:text-zinc-300 dark:hover:outline-emerald-500"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={isAlreadyAdded ? "line-through" : ""}>
                                {getSpellDisplayName(spell, existingAttr)}
                              </span>
                              <span
                                className={`rounded px-1 py-0.5 text-[10px] font-medium uppercase ${
                                  spell.type === "mana"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                                }`}
                              >
                                {spell.type === "mana" ? "M" : "P"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {isAlreadyAdded && <Check className="h-4 w-4 text-emerald-500" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                {Object.keys(spellsByCategory).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">No spells found</div>
                )}
              </div>

              {/* Right Pane - Spell Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedSpell ? (
                  <div className="space-y-6">
                    {/* Spell Header */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {getSpellDisplayName(selectedSpell, selectedAttribute)}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium uppercase ${
                            selectedSpell.type === "mana"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                          }`}
                        >
                          {selectedSpell.type === "mana" ? "Mana (M)" : "Physical (P)"}
                        </span>
                      </div>
                    </div>

                    {/* Spell Stats */}
                    <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Range</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {selectedSpell.range}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Duration</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {selectedSpell.duration || "Instant"}
                        </span>
                      </div>
                      {selectedSpell.damage && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500 dark:text-zinc-400">Damage</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedSpell.damage}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Drain</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {selectedSpell.drain}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedSpell.description && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Description
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {selectedSpell.description}
                        </p>
                      </div>
                    )}

                    {/* Attribute Selector for Parameterized Spells */}
                    {selectedSpell.requiresAttributeSelection && selectedSpell.validAttributes && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                        <label className="block text-sm font-medium text-amber-800 dark:text-amber-200">
                          {selectedSpell.attributeSelectionLabel || "Select Attribute"}
                        </label>
                        <div className="relative mt-2">
                          <select
                            value={selectedAttribute}
                            onChange={(e) => setSelectedAttribute(e.target.value)}
                            className={`w-full appearance-none rounded-lg border py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                              selectedAttribute
                                ? "border-emerald-300 bg-emerald-50 text-emerald-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100"
                                : "border-amber-300 bg-white text-zinc-900 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-700 dark:bg-zinc-800 dark:text-zinc-100"
                            }`}
                          >
                            <option value="">-- Select --</option>
                            {selectedSpell.validAttributes.map((attr) => (
                              <option key={attr} value={attr}>
                                {ATTRIBUTE_NAMES[attr] || attr}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        </div>
                        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                          Valid attributes:{" "}
                          {selectedSpell.validAttributes
                            .map((a) => ATTRIBUTE_NAMES[a] || a)
                            .join(", ")}
                        </p>
                      </div>
                    )}

                    {/* Cost Indicator */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Cost
                        </span>
                        {willBeFree ? (
                          <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            FREE
                            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                              ({freeRemaining} free remaining)
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                            <Sparkles className="h-3.5 w-3.5" />
                            {SPELL_KARMA_COST} karma
                          </span>
                        )}
                      </div>
                      {!willBeFree && karmaRemaining < SPELL_KARMA_COST && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          Insufficient karma ({karmaRemaining} available)
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    <Sparkles className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select a spell from the list</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span className="mr-2 text-emerald-600 dark:text-emerald-400">
                  {addedThisSession} spell{addedThisSession !== 1 ? "s" : ""} added
                </span>
              )}
              {freeRemaining > 0 ? (
                <span>{freeRemaining} free remaining</span>
              ) : (
                <span>All free spells used</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Done
              </button>
              <button
                onClick={handleAddSpell}
                disabled={!canAdd}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  canAdd
                    ? willBeFree
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                {!willBeFree && canAdd && <Sparkles className="h-4 w-4" />}
                Add Spell
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
