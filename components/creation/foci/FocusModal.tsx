"use client";

/**
 * FocusModal
 *
 * Modal for adding magical foci with:
 * - Focus type selection with cost/karma info
 * - Force rating selection (1-6)
 * - Spell/Spirit selection for specific focus types
 * - Cost and bonding karma preview
 *
 * Uses BaseModal for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import { useFoci, useSpells } from "@/lib/rules";
import type { FocusCatalogItemData } from "@/lib/rules/loader-types";
import { SpiritType } from "@/lib/types/edition";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Plus, Minus, Sparkles, Sword, BookOpen, Ghost, Wand2, Zap } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_FORCE = 6;

const FOCUS_ICONS: Record<string, typeof Sparkles> = {
  power: Sparkles,
  weapon: Sword,
  spell: BookOpen,
  spirit: Ghost,
  enchanting: Wand2,
  metamagic: Zap,
  qi: Sparkles,
};

const SPIRIT_TYPES = [
  { id: SpiritType.Air, name: "Air" },
  { id: SpiritType.Beasts, name: "Beasts" },
  { id: SpiritType.Earth, name: "Earth" },
  { id: SpiritType.Fire, name: "Fire" },
  { id: SpiritType.Man, name: "Man" },
  { id: SpiritType.Water, name: "Water" },
  { id: SpiritType.Guardian, name: "Guardian" },
  { id: SpiritType.Guidance, name: "Guidance" },
  { id: SpiritType.Plant, name: "Plant" },
  { id: SpiritType.Task, name: "Task" },
];

// =============================================================================
// TYPES
// =============================================================================

export interface FocusSelection {
  catalogId: string;
  name: string;
  type: string;
  force: number;
  cost: number;
  karmaToBond: number;
  availability: number;
  legality?: string;
  linkedSpellId?: string;
  linkedSpellName?: string;
  linkedSpiritType?: string;
}

interface FocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (focus: FocusSelection) => void;
  characterSpells?: { id: string; name: string }[];
  isAdept: boolean;
  maxAvailability?: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FocusModal({
  isOpen,
  onClose,
  onAdd,
  characterSpells = [],
  isAdept,
  maxAvailability = 12,
}: FocusModalProps) {
  const fociCatalog = useFoci();
  const spellsCatalog = useSpells();

  const [selectedFocusId, setSelectedFocusId] = useState<string | null>(null);
  const [force, setForce] = useState(1);
  const [linkedSpellId, setLinkedSpellId] = useState<string | null>(null);
  const [linkedSpiritType, setLinkedSpiritType] = useState<string | null>(null);

  // Reset state when modal closes
  const resetState = useCallback(() => {
    setSelectedFocusId(null);
    setForce(1);
    setLinkedSpellId(null);
    setLinkedSpiritType(null);
  }, []);

  // Filter foci based on character type
  const availableFoci = useMemo(() => {
    return fociCatalog.filter((focus) => {
      // Qi Focus only for adepts
      if (focus.type === "qi" && !isAdept) return false;
      return true;
    });
  }, [fociCatalog, isAdept]);

  // Get selected focus data
  const selectedFocus = useMemo(() => {
    if (!selectedFocusId) return null;
    return fociCatalog.find((f) => f.id === selectedFocusId) || null;
  }, [fociCatalog, selectedFocusId]);

  // Calculate costs
  const cost = useMemo(() => {
    if (!selectedFocus) return 0;
    return force * selectedFocus.costMultiplier;
  }, [selectedFocus, force]);

  const karmaToBond = useMemo(() => {
    if (!selectedFocus) return 0;
    return force * selectedFocus.bondingKarmaMultiplier;
  }, [selectedFocus, force]);

  const availability = useMemo(() => {
    if (!selectedFocus) return 0;
    return force * 2 + selectedFocus.availability;
  }, [selectedFocus, force]);

  // Check if selection is complete
  const isSelectionComplete = useMemo(() => {
    if (!selectedFocus) return false;
    if (selectedFocus.type === "spell" && !linkedSpellId) return false;
    if (selectedFocus.type === "spirit" && !linkedSpiritType) return false;
    return true;
  }, [selectedFocus, linkedSpellId, linkedSpiritType]);

  // Check availability limit
  const exceedsAvailability = availability > maxAvailability;

  // Get spell name
  const linkedSpellName = useMemo(() => {
    if (!linkedSpellId || !spellsCatalog) return null;
    for (const category of Object.values(spellsCatalog)) {
      if (Array.isArray(category)) {
        const spell = category.find((s: { id: string }) => s.id === linkedSpellId);
        if (spell) return spell.name;
      }
    }
    // Also check character's known spells
    const charSpell = characterSpells.find((s) => s.id === linkedSpellId);
    return charSpell?.name || null;
  }, [linkedSpellId, spellsCatalog, characterSpells]);

  // Handle add
  const handleAdd = useCallback(() => {
    if (!selectedFocus || !isSelectionComplete) return;

    let focusName = selectedFocus.name;
    if (selectedFocus.type === "spell" && linkedSpellName) {
      focusName = `${selectedFocus.name} (${linkedSpellName})`;
    } else if (selectedFocus.type === "spirit" && linkedSpiritType) {
      const spiritName = SPIRIT_TYPES.find((s) => s.id === linkedSpiritType)?.name;
      focusName = `${selectedFocus.name} (${spiritName})`;
    }

    onAdd({
      catalogId: selectedFocus.id,
      name: focusName,
      type: selectedFocus.type,
      force,
      cost,
      karmaToBond,
      availability,
      legality: selectedFocus.legality,
      linkedSpellId: linkedSpellId || undefined,
      linkedSpellName: linkedSpellName || undefined,
      linkedSpiritType: linkedSpiritType || undefined,
    });

    resetState();
    onClose();
  }, [
    selectedFocus,
    isSelectionComplete,
    force,
    cost,
    karmaToBond,
    availability,
    linkedSpellId,
    linkedSpellName,
    linkedSpiritType,
    onAdd,
    resetState,
    onClose,
  ]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="lg">
      {({ close }) => (
        <>
          <ModalHeader title="Add Focus" onClose={close} />

          <ModalBody className="p-6">
            <div className="space-y-6">
              {/* Focus Type Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Focus Type
                </label>
                <div className="space-y-2">
                  {availableFoci.map((focus) => {
                    const Icon = FOCUS_ICONS[focus.type] || Sparkles;
                    const isSelected = selectedFocusId === focus.id;

                    return (
                      <button
                        key={focus.id}
                        onClick={() => {
                          setSelectedFocusId(focus.id);
                          setLinkedSpellId(null);
                          setLinkedSpiritType(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                          isSelected
                            ? "border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20"
                            : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-lg p-2 ${
                              isSelected
                                ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
                                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span
                            className={`font-medium ${
                              isSelected
                                ? "text-purple-700 dark:text-purple-300"
                                : "text-zinc-900 dark:text-zinc-100"
                            }`}
                          >
                            {focus.name}
                          </span>
                        </div>
                        <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
                          <div>{focus.costMultiplier.toLocaleString()}¥/F</div>
                          <div>{focus.bondingKarmaMultiplier} karma/F</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Force Selection */}
              {selectedFocus && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Force Rating
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setForce(Math.max(1, force - 1))}
                      disabled={force <= 1}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        force > 1
                          ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                      }`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-zinc-100 text-xl font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                      {force}
                    </div>
                    <button
                      onClick={() => setForce(Math.min(MAX_FORCE, force + 1))}
                      disabled={force >= MAX_FORCE}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                        force < MAX_FORCE
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="text-xs text-zinc-400">Max: {MAX_FORCE}</span>
                  </div>
                </div>
              )}

              {/* Spell Selection (for Spell Focus) */}
              {selectedFocus?.type === "spell" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Linked Spell
                  </label>
                  {characterSpells.length > 0 ? (
                    <select
                      value={linkedSpellId || ""}
                      onChange={(e) => setLinkedSpellId(e.target.value || null)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      <option value="">Select a spell...</option>
                      {characterSpells.map((spell) => (
                        <option key={spell.id} value={spell.id}>
                          {spell.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                      You need to learn spells first before purchasing a Spell Focus.
                    </div>
                  )}
                </div>
              )}

              {/* Spirit Type Selection (for Spirit Focus) */}
              {selectedFocus?.type === "spirit" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Spirit Type
                  </label>
                  <select
                    value={linkedSpiritType || ""}
                    onChange={(e) => setLinkedSpiritType(e.target.value || null)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="">Select a spirit type...</option>
                    {SPIRIT_TYPES.map((spirit) => (
                      <option key={spirit.id} value={spirit.id}>
                        {spirit.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Cost Preview */}
              {selectedFocus && (
                <div
                  className={`rounded-lg p-4 ${
                    exceedsAvailability
                      ? "bg-red-50 dark:bg-red-900/20"
                      : "bg-zinc-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Cost</div>
                      <div className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {cost.toLocaleString()}¥
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Bonding</div>
                      <div className="mt-1 text-lg font-bold text-purple-600 dark:text-purple-400">
                        {karmaToBond} karma
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Availability</div>
                      <div
                        className={`mt-1 text-lg font-bold ${
                          exceedsAvailability
                            ? "text-red-600 dark:text-red-400"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {availability}
                        {selectedFocus.legality === "restricted" && "R"}
                        {selectedFocus.legality === "forbidden" && "F"}
                      </div>
                    </div>
                  </div>
                  {exceedsAvailability && (
                    <div className="mt-2 text-center text-xs text-red-600 dark:text-red-400">
                      Exceeds availability limit ({maxAvailability})
                    </div>
                  )}
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter className="justify-end gap-3">
            <button
              onClick={close}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!isSelectionComplete || exceedsAvailability}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isSelectionComplete && !exceedsAvailability
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
              }`}
            >
              Add Focus
            </button>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
