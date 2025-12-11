"use client";

import { useMemo, useState, useCallback } from "react";
import { useSpells, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { SpellData } from "@/lib/rules";

interface StepProps {
    state: CreationState;
    updateState: (updates: Partial<CreationState>) => void;
    budgetValues: Record<string, number>;
}

const SPELL_KARMA_COST = 5;

type SpellCategory = "combat" | "detection" | "health" | "illusion" | "manipulation";

const SPELL_CATEGORIES: { id: SpellCategory; name: string }[] = [
    { id: "combat", name: "Combat" },
    { id: "detection", name: "Detection" },
    { id: "health", name: "Health" },
    { id: "illusion", name: "Illusion" },
    { id: "manipulation", name: "Manipulation" },
];

export function SpellsStep({ state, updateState, budgetValues }: StepProps) {
    const spellsCatalog = useSpells();
    const priorityTable = usePriorityTable();

    const [spellFilter, setSpellFilter] = useState<SpellCategory | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Get selected magical path
    const magicalPath = (state.selections["magical-path"] as string) || "mundane";

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

    // Max spells = Magic × 2 (total limit)
    const maxTotalSpells = magicRating * 2;
    // Max spells per category = Magic × 2 (formula limit)
    const maxPerCategory = magicRating * 2;

    // Get current selections
    const selectedSpells = (state.selections.spells || []) as string[];

    // Calculate Karma
    // Note: Karma budget updates are handled by updating 'karma-spent-spells' in budget
    const karmaRemaining = budgetValues["karma"] || 0; // This is remaining karma available
    const currentKarmaSpentOnSpells = (state.budgets["karma-spent-spells"] as number) || 0;

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

    // Calculate spells per category for selected spells
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

    // Check if a category is at or over limit
    const isCategoryAtLimit = useCallback(
        (category: SpellCategory) => {
            return spellsPerCategory[category] >= maxPerCategory;
        },
        [spellsPerCategory, maxPerCategory]
    );

    // Check if adding a spell would exceed its category limit
    const wouldExceedCategoryLimit = useCallback(
        (spellId: string) => {
            const spell = allSpells.find((s) => s.id === spellId);
            if (!spell) return false;
            return isCategoryAtLimit(spell.category as SpellCategory);
        },
        [allSpells, isCategoryAtLimit]
    );

    // Filter spells
    const filteredSpells = useMemo(() => {
        let spells = allSpells;

        if (spellFilter !== "all") {
            spells = spells.filter((s) => s.category === spellFilter);
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
    }, [allSpells, spellFilter, searchQuery]);

    const getSpellById = useCallback((id: string) => allSpells.find(s => s.id === id), [allSpells]);

    const toggleSpell = useCallback(
        (spellId: string) => {
            const isSelected = selectedSpells.includes(spellId);
            let newSpells: string[];

            if (isSelected) {
                newSpells = selectedSpells.filter((id) => id !== spellId);
            } else {
                // Check total limit
                if (selectedSpells.length >= maxTotalSpells) return;

                // Check category limit (formula limit)
                if (wouldExceedCategoryLimit(spellId)) return;

                // Check cost (if beyond free)
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
        [selectedSpells, maxTotalSpells, wouldExceedCategoryLimit, freeSpells, karmaRemaining, state.selections, state.budgets, updateState]
    );

    const spellsBeyondFree = Math.max(0, selectedSpells.length - freeSpells);

    // Get categories that are at or over limit
    const categoriesAtLimit = useMemo(() => {
        return SPELL_CATEGORIES.filter((cat) => isCategoryAtLimit(cat.id));
    }, [isCategoryAtLimit]);

    return (
        <div className="space-y-6">
            {/* Header / Summary */}
            <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Spell Selection</h2>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                            Select spells for your character. You have <span className="font-bold">{freeSpells} free spells</span>.
                            Additional spells cost <span className="font-bold">{SPELL_KARMA_COST} Karma</span> each.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        {spellsBeyondFree > 0 && (
                            <div className="text-xs text-amber-600 dark:text-amber-400">
                                {spellsBeyondFree} purchased with Karma (-{spellsBeyondFree * SPELL_KARMA_COST})
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900/50">
                    <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${freeSpells > 0 ? Math.min(100, (Math.min(selectedSpells.length, freeSpells) / freeSpells) * 100) : 0}%` }}
                    />
                </div>

                {/* Category Limits Display */}
                {magicRating > 0 && (
                    <div className="mt-4 space-y-2">
                        <div className="text-xs font-medium text-emerald-800 dark:text-emerald-200">
                            Formula Limits (Max {maxPerCategory} per category):
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {SPELL_CATEGORIES.map((cat) => {
                                const count = spellsPerCategory[cat.id];
                                const isAtLimit = count >= maxPerCategory;
                                return (
                                    <div
                                        key={cat.id}
                                        className={`rounded px-2 py-1 text-xs font-medium ${
                                            isAtLimit
                                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                                : count > 0
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                                        }`}
                                    >
                                        {cat.name}: {count}/{maxPerCategory}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column: Search & List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="sticky top-0 z-10 space-y-2 bg-white pb-2 dark:bg-zinc-900">
                        <input
                            type="text"
                            placeholder="Search spells..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                        <div className="flex flex-wrap gap-1">
                            <button
                                onClick={() => setSpellFilter("all")}
                                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${spellFilter === "all"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                    }`}
                            >
                                All
                            </button>
                            {SPELL_CATEGORIES.map((cat) => {
                                const count = spellsPerCategory[cat.id];
                                const isAtLimit = count >= maxPerCategory;
                                return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSpellFilter(cat.id)}
                                        className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                            spellFilter === cat.id
                                            ? "bg-emerald-600 text-white"
                                                : isAtLimit
                                                    ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                        }`}
                                        title={isAtLimit ? `Category limit reached (${count}/${maxPerCategory})` : `${count}/${maxPerCategory} spells`}
                                >
                                        {cat.name} {isAtLimit && "⚠️"}
                                </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {filteredSpells.map((spell) => {
                            const isSelected = selectedSpells.includes(spell.id);
                            const categoryCount = spellsPerCategory[spell.category as SpellCategory];
                            const categoryAtLimit = categoryCount >= maxPerCategory;
                            const canSelect = isSelected || (
                                selectedSpells.length < maxTotalSpells &&
                                !categoryAtLimit &&
                                (selectedSpells.length < freeSpells || karmaRemaining >= SPELL_KARMA_COST)
                            );

                            return (
                                <button
                                    key={spell.id}
                                    onClick={() => canSelect && toggleSpell(spell.id)}
                                    disabled={!canSelect}
                                    className={`relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all ${isSelected
                                            ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:border-emerald-400 dark:bg-emerald-900/30"
                                            : canSelect
                                                ? "border-zinc-200 bg-white hover:border-emerald-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-emerald-700"
                                                : "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800/30"
                                        }`}
                                    title={!canSelect && !isSelected && categoryAtLimit ? `Category limit reached: ${categoryCount}/${maxPerCategory} ${spell.category} spells` : undefined}
                                >
                                    <div className="flex w-full items-start justify-between gap-2">
                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                            {spell.name}
                                        </div>
                                        {isSelected && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1 text-[10px] uppercase tracking-wider">
                                        <span className={`rounded px-1.5 py-0.5 font-medium ${spell.type === "mana"
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                            }`}>
                                            {spell.type}
                                        </span>
                                        <span className={`rounded px-1.5 py-0.5 font-medium ${
                                            categoryAtLimit && !isSelected
                                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                                        }`}>
                                            {spell.category}
                                        </span>
                                    </div>

                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                        {spell.description}
                                    </p>

                                    <div className="mt-auto flex w-full flex-wrap gap-x-3 gap-y-1 border-t border-zinc-100 pt-2 text-[10px] text-zinc-500 dark:border-zinc-700/50 dark:text-zinc-400">
                                        <span>Range: <span className="font-medium text-zinc-700 dark:text-zinc-300">{spell.range}</span></span>
                                        <span>Dur: <span className="font-medium text-zinc-700 dark:text-zinc-300">{spell.duration}</span></span>
                                        <span>Drain: <span className="font-medium text-zinc-700 dark:text-zinc-300">{spell.drain}</span></span>
                                    </div>
                                </button>
                            );
                        })}

                        {filteredSpells.length === 0 && (
                            <div className="col-span-full py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                                No spells found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Selected Spells */}
                <div className="space-y-4">
                    <div className="sticky top-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/30">
                        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Selected Spells ({selectedSpells.length})
                        </h3>

                        {selectedSpells.length === 0 ? (
                            <p className="py-4 text-center text-xs text-zinc-500 italic">
                                No spells selected yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {selectedSpells.map((id, index) => {
                                    const spell = getSpellById(id);
                                    const isFree = index < freeSpells;

                                    return (
                                        <div key={id} className="flex items-center justify-between rounded bg-white p-2 shadow-sm dark:bg-zinc-800">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                        {spell?.name || id}
                                                    </span>
                                                    {!isFree && (
                                                        <span className="flex-shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                            {SPELL_KARMA_COST}K
                                                        </span>
                                                    )}
                                                    {isFree && (
                                                        <span className="flex-shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                            FREE
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleSpell(id)}
                                                className="ml-2 rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                                title="Remove spell"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Validation Messages */}
                        {selectedSpells.length > maxTotalSpells && (
                            <div className="mt-4 rounded bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                You have exceeded the maximum of {maxTotalSpells} spells (Magic × 2).
                            </div>
                        )}

                        {categoriesAtLimit.length > 0 && (
                            <div className="mt-4 rounded bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                <div className="font-medium mb-1">Category limits reached:</div>
                                <ul className="list-disc list-inside space-y-0.5">
                                    {categoriesAtLimit.map((cat) => (
                                        <li key={cat.id}>
                                            {cat.name}: {spellsPerCategory[cat.id]}/{maxPerCategory} (Magic × 2)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
