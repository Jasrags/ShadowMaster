"use client";

/**
 * AdeptPowerModal
 *
 * Two-column modal for adding adept powers during character creation.
 * Follows the SpellModal pattern with:
 * - Split-pane design (power list left, details right)
 * - Sticky category headers (grouped by activation type)
 * - Level selection for rated powers
 * - Attribute/skill selection for powers that require it
 * - PP cost display with budget awareness
 * - Session tracking with "X added" indicator
 * - Multi-add workflow (stays open after adding, preserves search)
 * - Duplicate prevention with checkmarks
 *
 * Uses BaseModalRoot for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import type { AdeptPower } from "@/lib/types";
import type { AdeptPowerCatalogItem } from "@/lib/rules/loader-types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Check, ChevronDown, Zap } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Display order for activation types */
const ACTIVATION_ORDER = ["free", "simple", "complex", "interrupt", "other"] as const;

/** Human-readable activation type labels */
const ACTIVATION_LABELS: Record<string, string> = {
  free: "Free Action",
  simple: "Simple Action",
  complex: "Complex Action",
  interrupt: "Interrupt Action",
  other: "Passive / Other",
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
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the display name for a power, accounting for attribute/skill selection
 */
function getPowerDisplayName(power: AdeptPowerCatalogItem, selectedSpec?: string): string {
  if (selectedSpec) {
    if (power.requiresAttribute) {
      const attrName = ATTRIBUTE_NAMES[selectedSpec] || selectedSpec;
      return `${power.name} (${attrName})`;
    }
    if (power.requiresSkill) {
      const skillName = selectedSpec
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return `${power.name} (${skillName})`;
    }
  }
  return power.name;
}

/**
 * Check if a power is already selected (by ID)
 * For powers that require attribute/skill, allows multiple selections
 */
function hasSelectionForPower(selectedPowers: AdeptPower[], powerId: string): boolean {
  return selectedPowers.some((p) => p.id === powerId);
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

  // Track how many powers were added in this session
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Full reset on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedPowerId(null);
    setSelectedLevel(1);
    setSelectedSpec("");
    setAddedThisSession(0);
  }, []);

  // Reset for adding another power - preserves search
  const resetForNextPower = useCallback(() => {
    setSelectedPowerId(null);
    setSelectedLevel(1);
    setSelectedSpec("");
  }, []);

  // Handle close with reset
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Filter powers by search
  const filteredPowers = useMemo(() => {
    if (!searchQuery.trim()) return allPowers;
    const search = searchQuery.toLowerCase();
    return allPowers.filter(
      (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)
    );
  }, [allPowers, searchQuery]);

  // Group powers by activation type for display
  const powersByActivation = useMemo(() => {
    const grouped: Record<string, AdeptPowerCatalogItem[]> = {};
    filteredPowers.forEach((power) => {
      const act = power.activation || "other";
      if (!grouped[act]) grouped[act] = [];
      grouped[act].push(power);
    });
    // Sort powers within each group
    Object.values(grouped).forEach((powers) => {
      powers.sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredPowers]);

  // Get power by ID
  const getPowerById = useCallback((id: string) => allPowers.find((p) => p.id === id), [allPowers]);

  // Get selected power data
  const selectedPowerData = selectedPowerId ? getPowerById(selectedPowerId) : null;
  const selectedCost = selectedPowerData ? calculateCost(selectedPowerData, selectedLevel) : 0;

  // Check if we can add the selected power
  const needsSpec =
    selectedPowerData &&
    (selectedPowerData.requiresAttribute || selectedPowerData.requiresSkill) &&
    !selectedSpec;
  const canAfford = selectedCost <= ppRemaining;
  const canAdd = selectedPowerData && canAfford && !needsSpec;

  // Handle add power
  const handleAddPower = useCallback(() => {
    if (!selectedPowerId || !canAdd) return;

    const power = getPowerById(selectedPowerId);
    if (!power) return;

    // Check if already selected (for non-multiple powers)
    if (isPowerSelected(selectedPowerId) && !power.requiresSkill && !power.requiresAttribute) {
      return;
    }

    onAdd(selectedPowerId, selectedLevel, selectedSpec || undefined);
    setAddedThisSession((prev) => prev + 1);
    resetForNextPower();
  }, [
    selectedPowerId,
    selectedLevel,
    selectedSpec,
    canAdd,
    getPowerById,
    isPowerSelected,
    onAdd,
    resetForNextPower,
  ]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Adept Power" onClose={close}>
            <Zap className="h-5 w-5 text-violet-500" />
          </ModalHeader>

          {/* Search */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search powers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - Power List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {ACTIVATION_ORDER.filter((act) => powersByActivation[act]?.length > 0).map(
                  (activation) => (
                    <div key={activation}>
                      <div className="sticky top-0 z-10 bg-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {ACTIVATION_LABELS[activation] || activation}
                      </div>
                      {powersByActivation[activation].map((power) => {
                        const isSelected = selectedPowerId === power.id;
                        const isAlreadyAdded = hasSelectionForPower(selectedPowers, power.id);
                        // For powers requiring attribute/skill, allow multiple selections
                        const allowMultiple = power.requiresAttribute || power.requiresSkill;
                        const isDisabled = isAlreadyAdded && !allowMultiple;

                        // Get base cost display
                        const baseCost =
                          power.hasRating && power.ratings
                            ? power.ratings[1]?.powerPointCost || 0
                            : power.powerPointCost || 0;
                        const costDisplay = power.hasRating
                          ? `${baseCost.toFixed(2)}/lvl`
                          : `${baseCost.toFixed(2)} PP`;

                        return (
                          <button
                            key={power.id}
                            onClick={() => !isDisabled && setSelectedPowerId(power.id)}
                            disabled={isDisabled}
                            className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                              isSelected
                                ? "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                                : isDisabled
                                  ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
                                  : "rounded-md text-zinc-700 hover:outline hover:outline-1 hover:outline-violet-400 dark:text-zinc-300 dark:hover:outline-violet-500"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={isAlreadyAdded && !allowMultiple ? "line-through" : ""}
                              >
                                {power.name}
                              </span>
                              <span className="rounded bg-violet-100 px-1 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                                {costDisplay}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {isAlreadyAdded && !allowMultiple && (
                                <Check className="h-4 w-4 text-violet-500" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )
                )}
                {Object.keys(powersByActivation).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">No powers found</div>
                )}
              </div>

              {/* Right Pane - Power Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedPowerData ? (
                  <div className="space-y-6">
                    {/* Power Header */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {getPowerDisplayName(selectedPowerData, selectedSpec)}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPowerData.activation && (
                          <span className="rounded bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                            {ACTIVATION_LABELS[selectedPowerData.activation]}
                          </span>
                        )}
                        {selectedPowerData.hasRating && (
                          <span className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            Leveled
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {selectedPowerData.description && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Description
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {selectedPowerData.description}
                        </p>
                      </div>
                    )}

                    {/* Level Selector */}
                    {selectedPowerData.hasRating && (
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Level
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(
                            { length: selectedPowerData.maxRating || 4 },
                            (_, i) => i + 1
                          ).map((lvl) => {
                            const lvlCost = calculateCost(selectedPowerData, lvl);
                            const canAffordLevel = lvlCost <= ppRemaining;
                            return (
                              <button
                                key={lvl}
                                onClick={() => setSelectedLevel(lvl)}
                                disabled={!canAffordLevel}
                                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                  selectedLevel === lvl
                                    ? "bg-violet-500 text-white"
                                    : canAffordLevel
                                      ? "bg-white text-zinc-600 hover:bg-violet-100 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
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

                    {/* Attribute Selector */}
                    {selectedPowerData.requiresAttribute && selectedPowerData.validAttributes && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                        <label className="block text-sm font-medium text-amber-800 dark:text-amber-200">
                          Select Attribute
                        </label>
                        <div className="relative mt-2">
                          <select
                            value={selectedSpec}
                            onChange={(e) => setSelectedSpec(e.target.value)}
                            className={`w-full appearance-none rounded-lg border py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                              selectedSpec
                                ? "border-violet-300 bg-violet-50 text-violet-900 focus:border-violet-500 focus:ring-violet-500 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-100"
                                : "border-amber-300 bg-white text-zinc-900 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-700 dark:bg-zinc-800 dark:text-zinc-100"
                            }`}
                          >
                            <option value="">-- Select Attribute --</option>
                            {selectedPowerData.validAttributes.map((attr) => (
                              <option key={attr} value={attr}>
                                {ATTRIBUTE_NAMES[attr] || attr}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        </div>
                        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                          Valid attributes:{" "}
                          {selectedPowerData.validAttributes
                            .map((a) => ATTRIBUTE_NAMES[a] || a)
                            .join(", ")}
                        </p>
                      </div>
                    )}

                    {/* Skill Selector */}
                    {selectedPowerData.requiresSkill && selectedPowerData.validSkills && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                        <label className="block text-sm font-medium text-amber-800 dark:text-amber-200">
                          Select Skill
                        </label>
                        <div className="relative mt-2">
                          <select
                            value={selectedSpec}
                            onChange={(e) => setSelectedSpec(e.target.value)}
                            className={`w-full appearance-none rounded-lg border py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 ${
                              selectedSpec
                                ? "border-violet-300 bg-violet-50 text-violet-900 focus:border-violet-500 focus:ring-violet-500 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-100"
                                : "border-amber-300 bg-white text-zinc-900 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-700 dark:bg-zinc-800 dark:text-zinc-100"
                            }`}
                          >
                            <option value="">-- Select Skill --</option>
                            {selectedPowerData.validSkills.map((skill) => (
                              <option key={skill} value={skill}>
                                {skill
                                  .split("-")
                                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                  .join(" ")}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        </div>
                      </div>
                    )}

                    {/* Cost Indicator */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Cost
                        </span>
                        <span
                          className={`font-semibold ${
                            !canAfford
                              ? "text-red-600 dark:text-red-400"
                              : "text-violet-600 dark:text-violet-400"
                          }`}
                        >
                          {selectedCost.toFixed(2)} PP
                        </span>
                      </div>
                      {!canAfford && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          Insufficient PP ({ppRemaining.toFixed(2)} available)
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    <Zap className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select a power from the list</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span className="mr-2 text-violet-600 dark:text-violet-400">
                  {addedThisSession} power{addedThisSession !== 1 ? "s" : ""} added
                </span>
              )}
              <span>{ppRemaining.toFixed(2)} PP remaining</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Done
              </button>
              <button
                onClick={handleAddPower}
                disabled={!canAdd}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  canAdd
                    ? "bg-violet-500 text-white hover:bg-violet-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add Power
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
