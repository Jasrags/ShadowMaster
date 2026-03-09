"use client";

/**
 * CyberlimbEnhancementModal - Modal for adding enhancements to a cyberlimb
 *
 * Features:
 * - Select enhancement type (Strength, Agility, Armor)
 * - Select rating (1-3 for most, up to augmented max for attributes)
 * - Capacity tracking
 * - Cost preview
 * - Validation against existing enhancements
 */

import { useMemo, useState, useCallback } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import type { CyberlimbItem, CyberlimbEnhancementType } from "@/lib/types/cyberlimb";
import type { CyberwareGrade } from "@/lib/types";
import { X, Plus, Minus, Target, Zap, Shield, AlertTriangle } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const ENHANCEMENT_TYPES: {
  type: CyberlimbEnhancementType;
  name: string;
  icon: typeof Target;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}[] = [
  {
    type: "strength",
    name: "Enhanced Strength",
    icon: Target,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    description: "Increases the limb's Strength attribute",
  },
  {
    type: "agility",
    name: "Enhanced Agility",
    icon: Zap,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description: "Increases the limb's Agility attribute",
  },
  {
    type: "armor",
    name: "Armor Enhancement",
    icon: Shield,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Adds armor bonus from this limb",
  },
];

// Base cost per rating point
const ENHANCEMENT_COST_PER_RATING = 6500;
// Capacity per rating point
const ENHANCEMENT_CAPACITY_PER_RATING = 1;
// Base availability
const ENHANCEMENT_BASE_AVAILABILITY = 12;
// Availability per rating
const ENHANCEMENT_AVAILABILITY_PER_RATING = 2;
// Max armor rating
const MAX_ARMOR_RATING = 3;

// Grade cost multipliers
const GRADE_COST_MULTIPLIERS: Record<CyberwareGrade, number> = {
  used: 0.75,
  standard: 1.0,
  alpha: 1.2,
  beta: 1.5,
  delta: 2.5,
};

// =============================================================================
// TYPES
// =============================================================================

export interface CyberlimbEnhancementSelection {
  enhancementType: CyberlimbEnhancementType;
  rating: number;
  capacityCost: number;
  cost: number;
  availability: number;
}

interface CyberlimbEnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selection: CyberlimbEnhancementSelection) => void;
  /** The cyberlimb to add enhancement to */
  limb: CyberlimbItem;
  /** Character's natural STR maximum (for attribute cap) */
  naturalMaxStrength?: number;
  /** Character's natural AGI maximum (for attribute cap) */
  naturalMaxAgility?: number;
  /** Available nuyen */
  availableNuyen: number;
  /** Max availability allowed */
  maxAvailability?: number;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CyberlimbEnhancementModal({
  isOpen,
  onClose,
  onAdd,
  limb,
  naturalMaxStrength = 6,
  naturalMaxAgility = 6,
  availableNuyen,
  maxAvailability = 12,
}: CyberlimbEnhancementModalProps) {
  const [selectedType, setSelectedType] = useState<CyberlimbEnhancementType>("strength");
  const [rating, setRating] = useState(1);

  // Calculate remaining capacity
  const remainingCapacity = useMemo(() => {
    const used =
      limb.enhancements.reduce((sum, e) => sum + e.capacityUsed, 0) +
      limb.accessories.reduce((sum, a) => sum + a.capacityUsed, 0) +
      limb.weapons.reduce((sum, w) => sum + w.capacityUsed, 0);
    return limb.baseCapacity - used;
  }, [limb]);

  // Check which enhancement types are already installed
  const installedTypes = useMemo(() => {
    return new Set(limb.enhancements.map((e) => e.enhancementType));
  }, [limb]);

  // Get max rating for selected type
  const maxRating = useMemo(() => {
    if (selectedType === "armor") {
      return MAX_ARMOR_RATING;
    }
    // For STR/AGI, max is augmented max (natural max + 4) minus current value
    const augmentedMax =
      selectedType === "strength" ? naturalMaxStrength + 4 : naturalMaxAgility + 4;
    const currentValue =
      selectedType === "strength"
        ? limb.baseStrength + limb.customStrength
        : limb.baseAgility + limb.customAgility;
    return Math.max(1, augmentedMax - currentValue);
  }, [selectedType, naturalMaxStrength, naturalMaxAgility, limb]);

  // Calculate costs for current selection
  const calculations = useMemo(() => {
    const capacityCost = rating * ENHANCEMENT_CAPACITY_PER_RATING;
    const baseCost = rating * ENHANCEMENT_COST_PER_RATING;
    const gradeMult = GRADE_COST_MULTIPLIERS[limb.grade] || 1;
    const cost = Math.round(baseCost * gradeMult);
    const availability =
      ENHANCEMENT_BASE_AVAILABILITY + rating * ENHANCEMENT_AVAILABILITY_PER_RATING;

    return { capacityCost, cost, availability };
  }, [rating, limb.grade]);

  // Validation
  const validation = useMemo(() => {
    const errors: string[] = [];

    if (installedTypes.has(selectedType)) {
      errors.push(
        `${ENHANCEMENT_TYPES.find((t) => t.type === selectedType)?.name} already installed`
      );
    }
    if (calculations.capacityCost > remainingCapacity) {
      errors.push(
        `Not enough capacity (need ${calculations.capacityCost}, have ${remainingCapacity})`
      );
    }
    if (calculations.cost > availableNuyen) {
      errors.push(`Not enough nuyen (need ${formatCurrency(calculations.cost)}¥)`);
    }
    if (calculations.availability > maxAvailability) {
      errors.push(`Exceeds availability limit (${calculations.availability} > ${maxAvailability})`);
    }

    return { valid: errors.length === 0, errors };
  }, [
    selectedType,
    installedTypes,
    calculations,
    remainingCapacity,
    availableNuyen,
    maxAvailability,
  ]);

  // Reset rating when type changes
  const handleTypeChange = useCallback((type: CyberlimbEnhancementType) => {
    setSelectedType(type);
    setRating(1);
  }, []);

  // Handle add
  const handleAdd = useCallback(() => {
    if (!validation.valid) return;

    onAdd({
      enhancementType: selectedType,
      rating,
      capacityCost: calculations.capacityCost,
      cost: calculations.cost,
      availability: calculations.availability,
    });
    onClose();
  }, [validation.valid, selectedType, rating, calculations, onAdd, onClose]);

  // Reset state on close
  const handleClose = useCallback(() => {
    setSelectedType("strength");
    setRating(1);
    onClose();
  }, [onClose]);

  const selectedTypeData = ENHANCEMENT_TYPES.find((t) => t.type === selectedType)!;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <Modal className="flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <Dialog className="flex max-h-[90vh] flex-col outline-none">
          {({ close }) => (
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Add Enhancement
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {limb.name} — [{remainingCapacity}] capacity remaining
                  </p>
                </div>
                <button
                  onClick={close}
                  aria-label="Close modal"
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Enhancement Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    Enhancement Type
                  </label>
                  <div className="space-y-2">
                    {ENHANCEMENT_TYPES.map((type) => {
                      const isInstalled = installedTypes.has(type.type);
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.type}
                          onClick={() => !isInstalled && handleTypeChange(type.type)}
                          disabled={isInstalled}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            selectedType === type.type && !isInstalled
                              ? `${type.bgColor} ${type.borderColor} ${type.color}`
                              : isInstalled
                                ? "bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800/30 dark:border-zinc-700/50 dark:text-zinc-600"
                                : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">{type.name}</div>
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                              {type.description}
                            </div>
                          </div>
                          {isInstalled && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                              Installed
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating Selection */}
                {!installedTypes.has(selectedType) && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                      Rating
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-2">
                        (max {maxRating})
                      </span>
                    </label>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setRating(Math.max(1, rating - 1))}
                        disabled={rating <= 1}
                        className={`p-2 rounded-lg ${
                          rating > 1
                            ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600"
                        }`}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div
                        className={`w-20 h-16 flex items-center justify-center rounded-lg ${selectedTypeData.bgColor}`}
                      >
                        <span className={`text-3xl font-bold font-mono ${selectedTypeData.color}`}>
                          {rating}
                        </span>
                      </div>
                      <button
                        onClick={() => setRating(Math.min(maxRating, rating + 1))}
                        disabled={rating >= maxRating}
                        className={`p-2 rounded-lg ${
                          rating < maxRating
                            ? `${selectedTypeData.bgColor} ${selectedTypeData.color} hover:opacity-80`
                            : "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600"
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Attribute preview for STR/AGI */}
                    {(selectedType === "strength" || selectedType === "agility") && (
                      <div className="mt-3 text-center text-xs text-zinc-500">
                        {selectedType === "strength" ? "Strength" : "Agility"} will be:{" "}
                        <span className={selectedTypeData.color}>
                          {(selectedType === "strength"
                            ? limb.baseStrength + limb.customStrength
                            : limb.baseAgility + limb.customAgility) + rating}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cost Summary */}
                {!installedTypes.has(selectedType) && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-center dark:bg-zinc-800/50 dark:border-zinc-700">
                      <div className="text-[10px] text-zinc-500 uppercase">Capacity</div>
                      <div
                        className={`text-xl font-bold font-mono ${
                          calculations.capacityCost > remainingCapacity
                            ? "text-red-400"
                            : "text-cyan-600 dark:text-cyan-400"
                        }`}
                      >
                        [{calculations.capacityCost}]
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-center dark:bg-zinc-800/50 dark:border-zinc-700">
                      <div className="text-[10px] text-zinc-500 uppercase">Cost</div>
                      <div
                        className={`text-xl font-bold font-mono ${
                          calculations.cost > availableNuyen
                            ? "text-red-400"
                            : "text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        {formatCurrency(calculations.cost)}¥
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-center dark:bg-zinc-800/50 dark:border-zinc-700">
                      <div className="text-[10px] text-zinc-500 uppercase">Avail</div>
                      <div
                        className={`text-xl font-bold font-mono ${
                          calculations.availability > maxAvailability
                            ? "text-red-400"
                            : "text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        {calculations.availability}
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Errors */}
                {!validation.valid && (
                  <div className="space-y-1">
                    {validation.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30"
                      >
                        <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
                        <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-200 px-6 py-4 flex gap-3 dark:border-zinc-800">
                <button
                  onClick={close}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                    bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors
                    dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!validation.valid}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    validation.valid
                      ? "bg-purple-500 text-white hover:bg-purple-600"
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Enhancement
                </button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
