"use client";

/**
 * MetatypeCard
 *
 * Compact card for metatype selection in sheet-driven creation.
 * Shows available metatypes based on priority with key stats.
 *
 * Features:
 * - Compact metatype grid based on priority
 * - Shows special attribute points per metatype
 * - Preview of attribute limits
 * - Racial traits display
 */

import { useMemo, useCallback } from "react";
import { useMetatypes, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { CreationCard } from "./shared";
import { Check, Lock } from "lucide-react";

interface MetatypeCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function MetatypeCard({ state, updateState }: MetatypeCardProps) {
  const metatypes = useMetatypes();
  const priorityTable = usePriorityTable();
  const selectedMetatype = state.selections.metatype as string | undefined;
  const metatypePriority = state.priorities?.metatype;

  // Get available metatypes based on priority
  const availableMetatypes = useMemo(() => {
    if (!metatypePriority || !priorityTable?.table[metatypePriority]) {
      return [];
    }
    const metatypeData = priorityTable.table[metatypePriority].metatype as {
      available: string[];
      specialAttributePoints: Record<string, number>;
    };
    return metatypeData?.available || [];
  }, [metatypePriority, priorityTable]);

  // Get special attribute points for a metatype
  const getSpecialAttrPoints = useCallback(
    (metatypeId: string) => {
      if (!metatypePriority || !priorityTable?.table[metatypePriority]) {
        return 0;
      }
      const metatypeData = priorityTable.table[metatypePriority].metatype as {
        specialAttributePoints: Record<string, number>;
      };
      return metatypeData?.specialAttributePoints?.[metatypeId] || 0;
    },
    [metatypePriority, priorityTable]
  );

  // Handle metatype selection
  const handleSelect = useCallback(
    (metatypeId: string) => {
      const selectedMeta = metatypes.find((m) => m.id === metatypeId);
      const racialTraits = selectedMeta?.racialTraits || [];

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

  // Get selected metatype data
  const selectedMetatypeData = useMemo(() => {
    return metatypes.find((m) => m.id === selectedMetatype);
  }, [metatypes, selectedMetatype]);

  // If no priority assigned, show message
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

  return (
    <CreationCard
      title="Metatype"
      description={`Priority ${metatypePriority} - ${availableMetatypes.length} option${availableMetatypes.length !== 1 ? "s" : ""}`}
      status={validationStatus}
    >
      <div className="space-y-3">
        {/* Metatype selection grid */}
        <div className="grid gap-2 sm:grid-cols-2">
          {metatypes
            .filter((m) => availableMetatypes.includes(m.id))
            .map((metatype) => {
              const isSelected = selectedMetatype === metatype.id;
              const specialPoints = getSpecialAttrPoints(metatype.id);

              return (
                <button
                  key={metatype.id}
                  onClick={() => handleSelect(metatype.id)}
                  className={`group relative flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                  }`}
                >
                  {/* Selection indicator */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          isSelected
                            ? "text-emerald-900 dark:text-emerald-100"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {metatype.name}
                      </span>
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                        {specialPoints} SAP
                      </span>
                    </div>

                    {/* Compact attribute preview */}
                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                      {["body", "agility", "strength", "charisma"].map((attr) => {
                        const limits = metatype.attributes[attr];
                        if (!limits || !("min" in limits)) return null;
                        return (
                          <span key={attr} className="uppercase whitespace-nowrap">
                            {attr.slice(0, 3)}:{limits.min}/{limits.max}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        {/* Selected metatype details */}
        {selectedMetatypeData && (
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Selected:
                </span>
                <span className="ml-2 font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedMetatypeData.name}
                </span>
              </div>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                {getSpecialAttrPoints(selectedMetatypeData.id)} Special Attr Points
              </span>
            </div>

            {/* Racial traits */}
            {selectedMetatypeData.racialTraits &&
              selectedMetatypeData.racialTraits.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Racial Traits:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedMetatypeData.racialTraits.map((trait, index) => (
                      <span
                        key={index}
                        className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Unavailable metatypes */}
        {metatypes.filter((m) => !availableMetatypes.includes(m.id)).length > 0 && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium">Higher priority needed:</span>{" "}
            {metatypes
              .filter((m) => !availableMetatypes.includes(m.id))
              .map((m) => m.name)
              .join(", ")}
          </p>
        )}
      </div>
    </CreationCard>
  );
}
