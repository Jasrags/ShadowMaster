"use client";

/**
 * MetatypeCard
 *
 * Compact card for metatype selection in sheet-driven creation.
 * Opens a modal for selection, shows summary when selected.
 *
 * Features:
 * - Modal-based selection (per UI mock)
 * - Shows metatype description, SAP, and racial traits in modal
 * - Compact summary display when selected
 * - [Select] / [Change] button pattern
 *
 * UI Mock Reference: docs/prompts/design/character-sheet-creation-mode.md
 */

import { useMemo, useCallback, useState } from "react";
import { useMetatypes, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { CreationCard } from "./shared";
import { Check, X, Lock, ChevronRight } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface MetatypeCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

interface MetatypeOption {
  id: string;
  name: string;
  description?: string;
  specialAttributePoints: number;
  racialTraits: string[];
  attributes: Record<string, { min: number; max: number }>;
}

// =============================================================================
// METATYPE DESCRIPTIONS (SR5 flavor text)
// =============================================================================

const METATYPE_DESCRIPTIONS: Record<string, string> = {
  human:
    "Adaptable and ambitious, humans are the most common metatype in the Sixth World. Their versatility makes them suited to any role.",
  elf: "Graceful and long-lived, elves are known for their keen senses and natural charisma. Many gravitate toward social or magical roles.",
  dwarf:
    "Stout and resilient, dwarves possess natural resistance to toxins and magic. Their determination is legendary.",
  ork: "Strong and tough, orks mature quickly and often form tight-knit communities. They excel in physical confrontations.",
  troll:
    "Massive and powerful, trolls possess natural dermal armor and extended reach. Their size commands respect and fear.",
};

// =============================================================================
// SELECTION MODAL COMPONENT
// =============================================================================

interface MetatypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metatypeId: string) => void;
  metatypes: MetatypeOption[];
  priorityLevel: string;
  currentSelection: string | null;
}

function MetatypeModal({
  isOpen,
  onClose,
  onConfirm,
  metatypes,
  priorityLevel,
  currentSelection,
}: MetatypeModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentSelection);

  // Reset selection when modal opens
  const handleClose = useCallback(() => {
    setSelectedId(currentSelection);
    onClose();
  }, [currentSelection, onClose]);

  const handleConfirm = useCallback(() => {
    if (selectedId) {
      onConfirm(selectedId);
      onClose();
    }
  }, [selectedId, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            SELECT METATYPE
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Priority info */}
        <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Available at Priority {priorityLevel}:{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {metatypes.length === 5
                ? "All metatypes"
                : `${metatypes.length} metatype${metatypes.length !== 1 ? "s" : ""}`}
            </span>
          </p>
        </div>

        {/* Metatype list */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <div className="space-y-2">
            {metatypes.map((metatype) => {
              const isSelected = selectedId === metatype.id;
              const description =
                METATYPE_DESCRIPTIONS[metatype.id] || metatype.description || "";

              return (
                <button
                  key={metatype.id}
                  onClick={() => setSelectedId(metatype.id)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
                      : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80"
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-3">
                    {/* Radio indicator */}
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>

                    <span
                      className={`text-base font-semibold uppercase ${
                        isSelected
                          ? "text-emerald-900 dark:text-emerald-100"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {metatype.name}
                    </span>
                  </div>

                  {/* Description */}
                  {description && (
                    <p className="mt-2 pl-8 text-sm text-zinc-600 dark:text-zinc-400">
                      {description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="mt-3 space-y-1 pl-8 text-sm">
                    <div className="text-zinc-700 dark:text-zinc-300">
                      <span className="font-medium">Special Attribute Points:</span>{" "}
                      {metatype.specialAttributePoints}
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-300">
                      <span className="font-medium">Racial Traits:</span>{" "}
                      {metatype.racialTraits.length > 0
                        ? metatype.racialTraits.join(", ")
                        : "None"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <button
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedId
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MetatypeCard({ state, updateState }: MetatypeCardProps) {
  const metatypes = useMetatypes();
  const priorityTable = usePriorityTable();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedMetatype = state.selections.metatype as string | undefined;
  const metatypePriority = state.priorities?.metatype;

  // Get available metatypes based on priority
  const availableMetatypes = useMemo((): MetatypeOption[] => {
    if (!metatypePriority || !priorityTable?.table[metatypePriority]) {
      return [];
    }
    const priorityData = priorityTable.table[metatypePriority].metatype as {
      available: string[];
      specialAttributePoints: Record<string, number>;
    };
    const availableIds = priorityData?.available || [];

    return metatypes
      .filter((m) => availableIds.includes(m.id))
      .map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        specialAttributePoints: priorityData.specialAttributePoints?.[m.id] || 0,
        racialTraits: m.racialTraits || [],
        attributes: m.attributes as Record<string, { min: number; max: number }>,
      }));
  }, [metatypePriority, priorityTable, metatypes]);

  // Get selected metatype data
  const selectedMetatypeData = useMemo(() => {
    return availableMetatypes.find((m) => m.id === selectedMetatype);
  }, [availableMetatypes, selectedMetatype]);

  // Handle metatype selection
  const handleSelect = useCallback(
    (metatypeId: string) => {
      const meta = metatypes.find((m) => m.id === metatypeId);
      const racialTraits = meta?.racialTraits || [];

      updateState({
        selections: {
          ...state.selections,
          metatype: metatypeId,
          racialQualities: racialTraits,
        },
      });
    },
    [metatypes, state.selections, updateState]
  );

  // Get validation status
  const validationStatus = useMemo(() => {
    if (!metatypePriority) return "pending";
    if (selectedMetatype) return "valid";
    return "warning";
  }, [metatypePriority, selectedMetatype]);

  // If no priority assigned, show locked state
  if (!metatypePriority) {
    return (
      <CreationCard
        title="Metatype"
        description="Select your character's species"
        status="pending"
      >
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set Metatype priority first
          </p>
        </div>
      </CreationCard>
    );
  }

  // Summary for collapsed state
  const collapsedSummary = selectedMetatypeData ? (
    <span className="text-sm">
      <span className="font-medium">{selectedMetatypeData.name}</span>
      <span className="text-zinc-400"> • </span>
      <span>{selectedMetatypeData.specialAttributePoints} SAP</span>
      {selectedMetatypeData.racialTraits.length > 0 && (
        <>
          <span className="text-zinc-400"> • </span>
          <span className="text-zinc-500 dark:text-zinc-400">
            {selectedMetatypeData.racialTraits.length} trait{selectedMetatypeData.racialTraits.length !== 1 ? "s" : ""}
          </span>
        </>
      )}
    </span>
  ) : null;

  return (
    <>
      <CreationCard
        id="metatype"
        title="Metatype"
        description={
          selectedMetatypeData
            ? `${selectedMetatypeData.name} • ${selectedMetatypeData.specialAttributePoints} SAP`
            : `Priority ${metatypePriority} - ${availableMetatypes.length} option${availableMetatypes.length !== 1 ? "s" : ""}`
        }
        status={validationStatus}
        collapsible={!!selectedMetatypeData}
        collapsedSummary={collapsedSummary}
        autoCollapseOnValid
      >
        <div className="space-y-3">
          {/* Selection trigger / Selected display */}
          {selectedMetatypeData ? (
            // Selected state
            <div className="space-y-3">
              {/* Selected metatype button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-between rounded-lg border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30"
              >
                <span className="font-semibold uppercase text-emerald-900 dark:text-emerald-100">
                  {selectedMetatypeData.name}
                </span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  Change
                </span>
              </button>

              {/* Special Attribute Points */}
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  Special Attribute Points:
                </span>{" "}
                {selectedMetatypeData.specialAttributePoints}
              </div>

              {/* Racial Traits */}
              {selectedMetatypeData.racialTraits.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    Racial Traits
                  </span>
                  <ul className="mt-1 space-y-0.5">
                    {selectedMetatypeData.racialTraits.map((trait, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="text-zinc-400">└─</span>
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // No selection state
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex w-full items-center justify-between rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
            >
              <span className="text-zinc-500 dark:text-zinc-400">
                Choose metatype...
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Select
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          )}

          {/* Unavailable metatypes hint */}
          {metatypes.filter((m) => !availableMetatypes.find((am) => am.id === m.id))
            .length > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">Higher priority needed:</span>{" "}
              {metatypes
                .filter((m) => !availableMetatypes.find((am) => am.id === m.id))
                .map((m) => m.name)
                .join(", ")}
            </p>
          )}
        </div>
      </CreationCard>

      {/* Selection Modal */}
      <MetatypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSelect}
        metatypes={availableMetatypes}
        priorityLevel={metatypePriority}
        currentSelection={selectedMetatype || null}
      />
    </>
  );
}
