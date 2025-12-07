"use client";

import { useMetatypes, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

export function MetatypeStep({ state, updateState }: StepProps) {
  const metatypes = useMetatypes();
  const priorityTable = usePriorityTable();
  const selectedMetatype = state.selections.metatype as string | undefined;
  const metatypePriority = state.priorities?.metatype;

  // Get available metatypes based on priority
  const availableMetatypes = (() => {
    if (!metatypePriority || !priorityTable?.table[metatypePriority]) {
      return [];
    }
    const metatypeData = priorityTable.table[metatypePriority].metatype as {
      available: string[];
      specialAttributePoints: Record<string, number>;
    };
    return metatypeData?.available || [];
  })();

  // Get special attribute points for a metatype
  const getSpecialAttrPoints = (metatypeId: string) => {
    if (!metatypePriority || !priorityTable?.table[metatypePriority]) {
      return 0;
    }
    const metatypeData = priorityTable.table[metatypePriority].metatype as {
      specialAttributePoints: Record<string, number>;
    };
    return metatypeData?.specialAttributePoints?.[metatypeId] || 0;
  };

  // Handle metatype selection
  const handleSelect = (metatypeId: string) => {
    // Find the metatype to get its racial traits
    const selectedMeta = metatypes.find((m) => m.id === metatypeId);
    const racialTraits = selectedMeta?.racialTraits || [];

    updateState({
      selections: {
        ...state.selections,
        metatype: metatypeId,
        // Store racial traits as racial qualities (separate from user-selected qualities)
        racialQualities: racialTraits,
      },
    });
  };

  if (!metatypePriority) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
        <div className="text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Please assign priorities first to see available metatypes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Select your character&apos;s metatype. Your Metatype priority ({metatypePriority})
        determines which metatypes are available and how many special attribute points you receive.
      </p>

      {/* Metatype Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metatypes
          .filter((m) => availableMetatypes.includes(m.id))
          .map((metatype) => {
            const isSelected = selectedMetatype === metatype.id;
            const specialPoints = getSpecialAttrPoints(metatype.id);

            return (
              <button
                key={metatype.id}
                onClick={() => handleSelect(metatype.id)}
                className={`group relative rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-black ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                }`}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute right-3 top-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Metatype name */}
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {metatype.name}
                </h3>

                {/* Special attribute points badge */}
                <div className="mt-2 inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {specialPoints} Special Attr Points
                </div>

                {/* Description */}
                {metatype.description && (
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {metatype.description}
                  </p>
                )}

                {/* Racial traits */}
                {metatype.racialTraits && metatype.racialTraits.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Racial Traits:
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {metatype.racialTraits.map((trait, index) => (
                        <span
                          key={index}
                          className="inline-flex rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attribute limits preview */}
                <div className="mt-4 grid grid-cols-4 gap-1 text-center">
                  {["body", "agility", "strength", "charisma"].map((attr) => {
                    const limits = metatype.attributes[attr];
                    if (!limits || !("min" in limits)) return null;
                    return (
                      <div key={attr} className="rounded bg-zinc-50 p-1 dark:bg-zinc-800/50">
                        <div className="text-[10px] uppercase text-zinc-400">
                          {attr.slice(0, 3)}
                        </div>
                        <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {limits.min}/{limits.max}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </button>
            );
          })}
      </div>

      {/* Unavailable metatypes notice */}
      {metatypes.filter((m) => !availableMetatypes.includes(m.id)).length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium">Not available at Priority {metatypePriority}:</span>{" "}
            {metatypes
              .filter((m) => !availableMetatypes.includes(m.id))
              .map((m) => m.name)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

