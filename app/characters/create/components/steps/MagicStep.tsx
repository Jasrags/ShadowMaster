"use client";

import { useMagicPaths, usePriorityTable } from "@/lib/rules";
import type { CreationState } from "@/lib/types";

// Aspected mage can choose ONE of these skill groups
const ASPECTED_MAGE_GROUPS = [
  {
    id: "sorcery",
    name: "Sorcery",
    description: "Spellcasting, Counterspelling, and Ritual Spellcasting. Cast spells and perform magical rituals.",
    skills: ["Spellcasting", "Counterspelling", "Ritual Spellcasting"],
  },
  {
    id: "conjuring",
    name: "Conjuring",
    description: "Summoning, Banishing, and Binding. Call forth and control spirits.",
    skills: ["Summoning", "Banishing", "Binding"],
  },
  {
    id: "enchanting",
    name: "Enchanting",
    description: "Alchemy, Artificing, and Disenchanting. Create magical preparations and foci.",
    skills: ["Alchemy", "Artificing", "Disenchanting"],
  },
];

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

export function MagicStep({ state, updateState }: StepProps) {
  const magicPaths = useMagicPaths();
  const priorityTable = usePriorityTable();
  const selectedPath = state.selections["magical-path"] as string | undefined;
  const selectedAspectedGroup = state.selections["aspected-mage-group"] as string | undefined;
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
    // Clear aspected mage group if switching away from aspected-mage
    const updates: Record<string, unknown> = {
      ...state.selections,
      "magical-path": pathId,
    };

    // Clear the aspected mage group selection if not aspected mage
    if (pathId !== "aspected-mage") {
      delete updates["aspected-mage-group"];
    }

    updateState({
      selections: updates,
    });
  };

  // Handle aspected mage skill group selection
  const handleAspectedGroupSelect = (groupId: string) => {
    updateState({
      selections: {
        ...state.selections,
        "aspected-mage-group": groupId,
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

      {/* Aspected Mage Skill Group Selection */}
      {selectedPath === "aspected-mage" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100">
              Choose Your Magical Focus
            </h4>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              As an Aspected Magician, you must specialize in <strong>one</strong> magical skill group.
              You will only be able to use skills from this group—this choice is permanent.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {ASPECTED_MAGE_GROUPS.map((group) => {
              const isGroupSelected = selectedAspectedGroup === group.id;

              return (
                <button
                  key={group.id}
                  onClick={() => handleAspectedGroupSelect(group.id)}
                  className={`relative rounded-lg border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-black ${
                    isGroupSelected
                      ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/30"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                  }`}
                >
                  {isGroupSelected && (
                    <div className="absolute right-2 top-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <h5 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {group.name}
                  </h5>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {group.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {!selectedAspectedGroup && (
            <p className="text-center text-sm text-amber-600 dark:text-amber-400">
              Please select a skill group to continue.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

