"use client";

import { useMemo, useState, useCallback } from "react";
import { useAdeptPowers, usePriorityTable } from "@/lib/rules";
import type { CreationState, AdeptPower } from "@/lib/types";
import type { AdeptPowerCatalogItem } from "@/lib/rules/loader";

interface StepProps {
    state: CreationState;
    updateState: (updates: Partial<CreationState>) => void;
    budgetValues: Record<string, number>;
}

export function AdeptPowersStep({ state, updateState, budgetValues }: StepProps) {
    const adeptPowersCatalog = useAdeptPowers();
    const priorityTable = usePriorityTable();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPowerId, setSelectedPowerId] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [selectedSpec, setSelectedSpec] = useState<string>("");

    // Get magic rating for PP budget
    const magicRating = useMemo(() => {
        const magicPriority = state.priorities?.magic;
        const magicalPath = (state.selections["magical-path"] as string) || "mundane";

        if (!magicPriority || !priorityTable?.table[magicPriority]) {
            return 0;
        }

        const magicData = priorityTable.table[magicPriority].magic as {
            options?: Array<{
                path: string;
                magicRating?: number;
            }>;
        };

        const option = magicData?.options?.find((o) => o.path === magicalPath);
        return option?.magicRating || 0;
    }, [state.priorities?.magic, priorityTable, state.selections]);

    // Mystic Adepts allocate a portion of their Magic to PP
    // For now, assume full Magic = PP for adepts
    const isMysticAdept = (state.selections["magical-path"] as string) === "mystic-adept";
    const powerPointBudget = isMysticAdept
        ? ((state.selections["power-points-allocation"] as number) || 0)
        : magicRating;

    // Get current adept powers from state
    const selectedPowers = useMemo(() => {
        return (state.selections.adeptPowers || []) as AdeptPower[];
    }, [state.selections.adeptPowers]);

    // Calculate total PP spent
    const ppSpent = useMemo(() => {
        return selectedPowers.reduce((sum, p) => sum + p.powerPointCost, 0);
    }, [selectedPowers]);

    const ppRemaining = Math.round((powerPointBudget - ppSpent) * 100) / 100;

    // Filter powers
    const filteredPowers = useMemo(() => {
        if (!searchQuery.trim()) return adeptPowersCatalog;
        const search = searchQuery.toLowerCase();
        return adeptPowersCatalog.filter(
            (p) =>
                p.name.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search)
        );
    }, [adeptPowersCatalog, searchQuery]);

    // Get power by ID
    const getPowerById = useCallback(
        (id: string) => adeptPowersCatalog.find((p) => p.id === id),
        [adeptPowersCatalog]
    );

    // Calculate cost for a power at a given level
    const calculateCost = useCallback((power: AdeptPowerCatalogItem, level: number): number => {
        if (power.costType === "table" && power.levels) {
            const levelData = power.levels.find((l) => l.level === level);
            return levelData?.cost || 0;
        }
        if (power.costType === "perLevel") {
            return (power.cost || 0) * level;
        }
        return power.cost || 0;
    }, []);

    // Check if power is already selected
    const isPowerSelected = useCallback(
        (powerId: string, spec?: string) => {
            return selectedPowers.some(
                (p) => p.catalogId === powerId && (spec ? p.specification === spec : true)
            );
        },
        [selectedPowers]
    );

    // Add power
    const handleAddPower = useCallback(() => {
        if (!selectedPowerId) return;

        const power = getPowerById(selectedPowerId);
        if (!power) return;

        const cost = calculateCost(power, selectedLevel);
        if (cost > ppRemaining) return;

        // Check if already selected (for non-multiple powers)
        if (isPowerSelected(selectedPowerId, selectedSpec) && !power.requiresSkill && !power.requiresAttribute) {
            return;
        }

        const newPower: AdeptPower = {
            id: `${selectedPowerId}-${Date.now()}`,
            catalogId: selectedPowerId,
            name: power.name,
            rating: power.costType === "perLevel" || power.costType === "table" ? selectedLevel : undefined,
            powerPointCost: cost,
            specification: selectedSpec || undefined,
        };

        const updatedPowers = [...selectedPowers, newPower];

        updateState({
            selections: {
                ...state.selections,
                adeptPowers: updatedPowers,
            },
            budgets: {
                ...state.budgets,
                "power-points-spent": ppSpent + cost,
            },
        });

        // Reset form
        setSelectedPowerId(null);
        setSelectedLevel(1);
        setSelectedSpec("");
    }, [selectedPowerId, selectedLevel, selectedSpec, getPowerById, calculateCost, ppRemaining, isPowerSelected, selectedPowers, ppSpent, state.selections, state.budgets, updateState]);

    // Remove power
    const handleRemovePower = useCallback((powerId: string) => {
        const power = selectedPowers.find((p) => p.id === powerId);
        if (!power) return;

        const updatedPowers = selectedPowers.filter((p) => p.id !== powerId);

        updateState({
            selections: {
                ...state.selections,
                adeptPowers: updatedPowers,
            },
            budgets: {
                ...state.budgets,
                "power-points-spent": ppSpent - power.powerPointCost,
            },
        });
    }, [selectedPowers, ppSpent, state.selections, state.budgets, updateState]);

    // Get selected power for detail view
    const selectedPowerData = selectedPowerId ? getPowerById(selectedPowerId) : null;
    const selectedCost = selectedPowerData ? calculateCost(selectedPowerData, selectedLevel) : 0;

    return (
        <div className="space-y-6">
            {/* Power Point Budget */}
            <div className="rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-violet-800 dark:text-violet-200">Power Points</div>
                        <div className="text-xs text-violet-600 dark:text-violet-400">
                            {isMysticAdept ? "Allocated from Magic rating" : `Magic Rating ${magicRating}`}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-violet-700 dark:text-violet-300">{ppRemaining}</div>
                        <div className="text-xs text-violet-600 dark:text-violet-400">/ {powerPointBudget} PP</div>
                    </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-violet-200 dark:bg-violet-800">
                    <div
                        className="h-full rounded-full bg-violet-500 transition-all duration-300"
                        style={{ width: `${powerPointBudget > 0 ? (ppSpent / powerPointBudget) * 100 : 0}%` }}
                    />
                </div>
            </div>

            {/* Mystic Adept PP Allocation */}
            {isMysticAdept && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                    <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                        Power Points Allocation (Magic Rating: {magicRating})
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={magicRating}
                        step={1}
                        value={powerPointBudget}
                        onChange={(e) =>
                            updateState({
                                selections: {
                                    ...state.selections,
                                    "power-points-allocation": parseInt(e.target.value),
                                },
                            })
                        }
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-amber-600 dark:text-amber-400 mt-1">
                        <span>0 PP (Full Spellcasting)</span>
                        <span className="font-bold">{powerPointBudget} PP</span>
                        <span>{magicRating} PP (Full Adept)</span>
                    </div>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left: Power Catalog */}
                <div className="lg:col-span-2 space-y-4">
                    <input
                        type="text"
                        placeholder="Search powers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                        {filteredPowers.map((power) => {
                            const isSelected = selectedPowerId === power.id;
                            const alreadyHas = isPowerSelected(power.id);
                            const baseCost = power.costType === "table"
                                ? (power.levels?.[0]?.cost || 0)
                                : power.cost || 0;

                            return (
                                <button
                                    key={power.id}
                                    onClick={() => {
                                        setSelectedPowerId(isSelected ? null : power.id);
                                        setSelectedLevel(1);
                                        setSelectedSpec("");
                                    }}
                                    className={`relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-all ${isSelected
                                            ? "border-violet-500 bg-violet-50 ring-1 ring-violet-500 dark:border-violet-400 dark:bg-violet-900/30"
                                            : alreadyHas && !power.requiresSkill && !power.requiresAttribute
                                                ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-900/20"
                                                : "border-zinc-200 bg-white hover:border-violet-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-violet-700"
                                        }`}
                                >
                                    <div className="flex w-full items-start justify-between gap-2">
                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                            {power.name}
                                        </div>
                                        <div className="flex-shrink-0 rounded bg-violet-100 px-1.5 py-0.5 text-xs font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                                            {power.costType === "perLevel" ? `${baseCost}/lvl` : `${baseCost} PP`}
                                        </div>
                                    </div>

                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                        {power.description}
                                    </p>

                                    {power.activation && (
                                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] uppercase text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                                            {power.activation} action
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Selected Power Config + Current Powers */}
                <div className="space-y-4">
                    {/* Power Configuration */}
                    {selectedPowerData && (
                        <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-900/20">
                            <h3 className="font-medium text-violet-900 dark:text-violet-100 mb-3">
                                {selectedPowerData.name}
                            </h3>

                            {/* Level Selector */}
                            {(selectedPowerData.costType === "perLevel" || selectedPowerData.costType === "table") && (
                                <div className="mb-3">
                                    <label className="block text-sm text-violet-700 dark:text-violet-300 mb-1">
                                        Level
                                    </label>
                                    <div className="flex gap-1">
                                        {Array.from(
                                            { length: selectedPowerData.maxLevel || 1 },
                                            (_, i) => i + 1
                                        ).map((lvl) => (
                                            <button
                                                key={lvl}
                                                onClick={() => setSelectedLevel(lvl)}
                                                className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${selectedLevel >= lvl
                                                        ? "bg-violet-500 text-white"
                                                        : "bg-white text-zinc-600 hover:bg-violet-100 dark:bg-zinc-700 dark:text-zinc-300"
                                                    }`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Attribute Selector */}
                            {selectedPowerData.requiresAttribute && selectedPowerData.validAttributes && (
                                <div className="mb-3">
                                    <label className="block text-sm text-violet-700 dark:text-violet-300 mb-1">
                                        Attribute
                                    </label>
                                    <select
                                        value={selectedSpec}
                                        onChange={(e) => setSelectedSpec(e.target.value)}
                                        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                                    >
                                        <option value="">Select attribute...</option>
                                        {selectedPowerData.validAttributes.map((attr) => (
                                            <option key={attr} value={attr}>
                                                {attr.charAt(0).toUpperCase() + attr.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Skill Selector */}
                            {selectedPowerData.requiresSkill && selectedPowerData.validSkills && (
                                <div className="mb-3">
                                    <label className="block text-sm text-violet-700 dark:text-violet-300 mb-1">
                                        Skill
                                    </label>
                                    <select
                                        value={selectedSpec}
                                        onChange={(e) => setSelectedSpec(e.target.value)}
                                        className="w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                                    >
                                        <option value="">Select skill...</option>
                                        {selectedPowerData.validSkills.map((skill) => (
                                            <option key={skill} value={skill}>
                                                {skill.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Cost Preview */}
                            <div className="flex items-center justify-between rounded bg-white p-2 dark:bg-zinc-800 mb-3">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Cost:</span>
                                <span className={`font-bold ${selectedCost > ppRemaining ? "text-red-600" : "text-violet-600 dark:text-violet-400"}`}>
                                    {selectedCost} PP
                                </span>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={handleAddPower}
                                disabled={
                                    selectedCost > ppRemaining ||
                                    (selectedPowerData.requiresAttribute && !selectedSpec) ||
                                    (selectedPowerData.requiresSkill && !selectedSpec)
                                }
                                className="w-full rounded-lg bg-violet-500 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
                            >
                                Add Power
                            </button>
                        </div>
                    )}

                    {/* Current Powers */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-800/30">
                        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Selected Powers ({selectedPowers.length})
                        </h3>

                        {selectedPowers.length === 0 ? (
                            <p className="py-4 text-center text-xs text-zinc-500 italic">
                                No powers selected yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {selectedPowers.map((power) => (
                                    <div
                                        key={power.id}
                                        className="flex items-center justify-between rounded bg-white p-2 shadow-sm dark:bg-zinc-800"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                    {power.name}
                                                    {power.rating && ` ${power.rating}`}
                                                    {power.specification && ` (${power.specification})`}
                                                </span>
                                                <span className="flex-shrink-0 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                                                    {power.powerPointCost} PP
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemovePower(power.id)}
                                            className="ml-2 rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                            title="Remove power"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
