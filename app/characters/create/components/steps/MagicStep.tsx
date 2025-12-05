"use client";

import { useMagicPaths, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

export function MagicStep({ state, updateState }: StepProps) {
  const magicPaths = useMagicPaths();
  const priorityTable = usePriorityTable();
  const selectedPath = state.selections["magical-path"] as string | undefined;
  const magicPriority = state.priorities?.magic;

  // Get available magic options based on priority
  const availableOptions = (() => {
    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return [];
    }
    const magicData = priorityTable.table[magicPriority].magic as {
      options: Array<{ path: string; magicRating?: number; resonanceRating?: number }>;
    };
    return magicData?.options || [];
  })();

  // Handle path selection
  const handleSelect = (pathId: string) => {
    updateState({
      selections: {
        ...state.selections,
        "magical-path": pathId,
      },
    });
  };

  // Check if mundane is the only option
  const isMundaneOnly = availableOptions.length === 0;

  if (isMundaneOnly) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Your Magic priority ({magicPriority}) does not allow magical or technomancer abilities.
          Your character will be mundane.
        </p>

        <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 p-6 dark:bg-emerald-900/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Mundane</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                No magical or resonance abilities. You rely on skill, gear, and augmentations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Select your character&apos;s magical or resonance path. Your Magic priority ({magicPriority})
        determines which options are available.
      </p>

      {/* Path Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Mundane option */}
        <button
          onClick={() => handleSelect("mundane")}
          className={`group relative rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-black ${
            selectedPath === "mundane"
              ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
              : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
          }`}
        >
          {selectedPath === "mundane" && (
            <div className="absolute right-3 top-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Mundane</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            No magical or resonance abilities. Focus on skills, gear, and cyberware.
          </p>
        </button>

        {/* Available magical paths */}
        {availableOptions.map((option) => {
          const pathInfo = magicPaths.find((p) => p.id === option.path);
          if (!pathInfo) return null;

          const isSelected = selectedPath === option.path;
          const rating = option.magicRating || option.resonanceRating || 0;

          return (
            <button
              key={option.path}
              onClick={() => handleSelect(option.path)}
              className={`group relative rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-black ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
              }`}
            >
              {isSelected && (
                <div className="absolute right-3 top-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {pathInfo.name}
              </h3>
              <div className="mt-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                {pathInfo.hasResonance ? "Resonance" : "Magic"} {rating}
              </div>
              {pathInfo.description && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {pathInfo.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

