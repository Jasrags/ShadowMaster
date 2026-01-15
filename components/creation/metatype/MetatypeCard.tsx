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
 */

import { useMemo, useCallback, useState } from "react";
import { useMetatypes, usePriorityTable } from "@/lib/rules";
import { CreationCard } from "../shared";
import { Lock, ChevronRight } from "lucide-react";
import { MetatypeModal } from "./MetatypeModal";
import type { MetatypeCardProps, MetatypeOption } from "./types";

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
      <CreationCard title="Metatype" description="Select your character's species" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Set Metatype priority first</p>
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
            {selectedMetatypeData.racialTraits.length} trait
            {selectedMetatypeData.racialTraits.length !== 1 ? "s" : ""}
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
                <span className="text-sm text-emerald-600 dark:text-emerald-400">Change</span>
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
              <span className="text-zinc-500 dark:text-zinc-400">Choose metatype...</span>
              <span className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                Select
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          )}

          {/* Unavailable metatypes hint */}
          {metatypes.filter((m) => !availableMetatypes.find((am) => am.id === m.id)).length > 0 && (
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
