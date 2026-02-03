"use client";

/**
 * AdeptPowerModal
 *
 * Modal for adding adept powers during character creation.
 * Features:
 * - Search/filter power list
 * - Level selection for rated powers
 * - Attribute/skill selection for powers that require it
 * - PP cost display with budget awareness
 * - Duplicate prevention
 *
 * Uses BaseModalRoot for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import type { AdeptPower } from "@/lib/types";
import type { AdeptPowerCatalogItem } from "@/lib/rules/loader-types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Plus, Zap } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

export interface AdeptPowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (powerId: string, level: number, spec?: string) => void;
  allPowers: AdeptPowerCatalogItem[];
  ppRemaining: number;
  selectedPowers: AdeptPower[];
  isPowerSelected: (id: string) => boolean;
  calculateCost: (power: AdeptPowerCatalogItem, level: number) => number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AdeptPowerModal({
  isOpen,
  onClose,
  onAdd,
  allPowers,
  ppRemaining,
  selectedPowers,
  isPowerSelected,
  calculateCost,
}: AdeptPowerModalProps) {
  // Modal-local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPowerId, setSelectedPowerId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedSpec, setSelectedSpec] = useState<string>("");

  // Reset state on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedPowerId(null);
    setSelectedLevel(1);
    setSelectedSpec("");
  }, []);

  // Handle close with reset
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Filter powers
  const filteredPowers = useMemo(() => {
    if (!searchQuery.trim()) return allPowers;
    const search = searchQuery.toLowerCase();
    return allPowers.filter(
      (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)
    );
  }, [allPowers, searchQuery]);

  // Get power by ID
  const getPowerById = useCallback((id: string) => allPowers.find((p) => p.id === id), [allPowers]);

  // Get selected power data
  const selectedPowerData = selectedPowerId ? getPowerById(selectedPowerId) : null;
  const selectedCost = selectedPowerData ? calculateCost(selectedPowerData, selectedLevel) : 0;

  // Handle add power
  const handleAddPower = useCallback(() => {
    if (!selectedPowerId) return;

    const power = getPowerById(selectedPowerId);
    if (!power) return;

    const cost = calculateCost(power, selectedLevel);
    if (cost > ppRemaining) return;

    // Check if already selected (for non-multiple powers)
    if (isPowerSelected(selectedPowerId) && !power.requiresSkill && !power.requiresAttribute) {
      return;
    }

    onAdd(selectedPowerId, selectedLevel, selectedSpec || undefined);

    // Reset selection state for next add
    setSelectedPowerId(null);
    setSelectedLevel(1);
    setSelectedSpec("");
  }, [
    selectedPowerId,
    selectedLevel,
    selectedSpec,
    getPowerById,
    calculateCost,
    ppRemaining,
    isPowerSelected,
    onAdd,
  ]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="2xl" className="max-w-2xl">
      {({ close }) => (
        <>
          <ModalHeader title="ADD ADEPT POWER" onClose={close}>
            <Zap className="h-5 w-5 text-violet-500" />
          </ModalHeader>

          {/* Budget info */}
          <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium text-violet-600 dark:text-violet-400">
                {ppRemaining.toFixed(2)} PP remaining
              </span>
            </p>
          </div>

          {/* Search */}
          <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search powers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <ModalBody className="p-4">
            {/* Power list */}
            <div className="max-h-[40vh] overflow-y-auto">
              <div className="space-y-2">
                {filteredPowers.slice(0, 30).map((power) => {
                  const isSelected = selectedPowerId === power.id;
                  const alreadyHas = isPowerSelected(power.id);
                  // Get base cost from unified ratings table or top-level powerPointCost
                  const baseCost =
                    power.hasRating && power.ratings
                      ? power.ratings[1]?.powerPointCost || 0
                      : power.powerPointCost || 0;
                  const costDisplay = power.hasRating
                    ? `${baseCost.toFixed(2)}/level`
                    : `${baseCost.toFixed(2)} PP`;

                  return (
                    <button
                      key={power.id}
                      onClick={() => {
                        setSelectedPowerId(isSelected ? null : power.id);
                        setSelectedLevel(1);
                        setSelectedSpec("");
                      }}
                      disabled={alreadyHas && !power.requiresSkill && !power.requiresAttribute}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-all ${
                        isSelected
                          ? "bg-violet-50 ring-2 ring-violet-300 dark:bg-violet-900/30 dark:ring-violet-700"
                          : alreadyHas
                            ? "cursor-not-allowed bg-zinc-100 opacity-50 dark:bg-zinc-800"
                            : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {power.name}
                          </span>
                          {alreadyHas && (
                            <span className="text-[10px] text-zinc-400">(already added)</span>
                          )}
                        </div>
                        <div className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {power.description}
                        </div>
                      </div>
                      <span className="shrink-0 rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                        {costDisplay}
                      </span>
                    </button>
                  );
                })}

                {filteredPowers.length === 0 && (
                  <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No powers found matching your search
                  </div>
                )}
              </div>
            </div>

            {/* Selected power configuration */}
            {selectedPowerData && (
              <div className="mt-4 rounded-lg border border-zinc-200 bg-violet-50 p-4 dark:border-zinc-700 dark:bg-violet-900/20">
                <div className="mb-3 font-medium text-violet-900 dark:text-violet-100">
                  Configure: {selectedPowerData.name}
                </div>

                {/* Level selector */}
                {selectedPowerData.hasRating && (
                  <div className="mb-3">
                    <div className="mb-1.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                      Level
                    </div>
                    <div className="flex gap-1">
                      {Array.from(
                        { length: selectedPowerData.maxRating || 4 },
                        (_, i) => i + 1
                      ).map((lvl) => {
                        const lvlCost = calculateCost(selectedPowerData, lvl);
                        const canAfford = lvlCost <= ppRemaining;
                        return (
                          <button
                            key={lvl}
                            onClick={() => setSelectedLevel(lvl)}
                            disabled={!canAfford}
                            className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition-colors ${
                              selectedLevel === lvl
                                ? "bg-violet-500 text-white"
                                : canAfford
                                  ? "bg-white text-zinc-600 hover:bg-violet-100 dark:bg-zinc-700 dark:text-zinc-300"
                                  : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                            }`}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Attribute selector */}
                {selectedPowerData.requiresAttribute && selectedPowerData.validAttributes && (
                  <div className="mb-3">
                    <div className="mb-1.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                      Attribute
                    </div>
                    <select
                      value={selectedSpec}
                      onChange={(e) => setSelectedSpec(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
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

                {/* Skill selector */}
                {selectedPowerData.requiresSkill && selectedPowerData.validSkills && (
                  <div className="mb-3">
                    <div className="mb-1.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                      Skill
                    </div>
                    <select
                      value={selectedSpec}
                      onChange={(e) => setSelectedSpec(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                    >
                      <option value="">Select skill...</option>
                      {selectedPowerData.validSkills.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill
                            .split("-")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Cost and add button */}
                <div className="flex items-center justify-between pt-2">
                  <span
                    className={`text-sm font-medium ${
                      selectedCost > ppRemaining
                        ? "text-red-600 dark:text-red-400"
                        : "text-violet-700 dark:text-violet-300"
                    }`}
                  >
                    Cost: {selectedCost.toFixed(2)} PP
                    {selectedCost > ppRemaining && " (insufficient PP)"}
                  </span>
                  <button
                    onClick={handleAddPower}
                    disabled={
                      selectedCost > ppRemaining ||
                      (selectedPowerData.requiresAttribute && !selectedSpec) ||
                      (selectedPowerData.requiresSkill && !selectedSpec)
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
                  >
                    <Plus className="h-4 w-4" />
                    Add Power
                  </button>
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {selectedPowers.length} power{selectedPowers.length !== 1 ? "s" : ""} selected
            </div>
            <button
              onClick={close}
              className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              Done
            </button>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
