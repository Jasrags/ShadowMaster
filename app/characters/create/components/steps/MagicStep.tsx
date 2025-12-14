"use client";

import { useMagicPaths, usePriorityTable, useTraditions, useMentorSpirits, useQualities } from "@/lib/rules";
import type { TraditionData } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader";

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

// Helper to format drain attributes for display
function formatDrainAttributes(attrs: [string, string]): string {
  const attrNames: Record<string, string> = {
    LOG: "Logic",
    WIL: "Willpower",
    CHA: "Charisma",
    INT: "Intuition",
  };
  return attrs.map(a => attrNames[a] || a).join(" + ");
}

// Helper to format spirit types for display
function formatSpiritTypes(spiritTypes: TraditionData["spiritTypes"]): string {
  return Object.entries(spiritTypes)
    .map(([category, spirit]) => `${category.charAt(0).toUpperCase() + category.slice(1)}: ${spirit.charAt(0).toUpperCase() + spirit.slice(1)}`)
    .join(", ");
}

// Paths that can select a tradition
const TRADITION_PATHS = ["magician", "mystic-adept", "aspected-mage"];

// Paths that can select a mentor spirit (any Awakened character with Magic attribute)
const MENTOR_SPIRIT_PATHS = ["magician", "mystic-adept", "aspected-mage", "adept"];

const MENTOR_SPIRIT_QUALITY_ID = "mentor-spirit";
const MENTOR_SPIRIT_KARMA_COST = 5;

// Helper to calculate karma spent on positive qualities
function calculatePositiveKarmaSpent(
  selectedQualities: string[],
  qualitiesData: QualityData[],
  qualityLevels: Record<string, number>
): number {
  return selectedQualities.reduce((sum, id) => {
    const q = qualitiesData.find(x => x.id === id);
    if (!q) return sum;
    let cost = q.karmaCost || 0;
    if (q.levels) {
      const lvl = qualityLevels[id] || 1;
      const lData = q.levels.find(l => l.level === lvl);
      if (lData) cost = Math.abs(lData.karma);
    }
    return sum + cost;
  }, 0);
}

export function MagicStep({ state, updateState, budgetValues }: StepProps) {
  const magicPaths = useMagicPaths();
  const priorityTable = usePriorityTable();
  const traditions = useTraditions();
  const mentorSpirits = useMentorSpirits();
  const { positive: positiveQualitiesData } = useQualities();
  const selectedPath = state.selections["magical-path"] as string | undefined;
  const selectedAspectedGroup = state.selections["aspected-mage-group"] as string | undefined;
  const selectedTradition = state.selections["tradition"] as string | undefined;
  const selectedMentorSpiritId = state.selections["mentor-spirit"] as string | undefined;
  const magicPriority = state.priorities?.magic;

  // Get current positive qualities and specifications
  const positiveQualities = (state.selections.positiveQualities || []) as string[];
  const qualitySpecifications = (state.selections.qualitySpecifications || {}) as Record<string, string>;
  const qualityLevels = (state.selections.qualityLevels || {}) as Record<string, number>;

  // Check if mentor spirit quality is already selected
  const hasMentorSpiritQuality = positiveQualities.includes(MENTOR_SPIRIT_QUALITY_ID);

  // Calculate available karma using the same pattern as other steps
  const karmaBase = budgetValues["karma"] || 25;
  const karmaSpentPositive = (state.budgets["karma-spent-positive"] as number) || 0;
  const karmaGainedNegative = (state.budgets["karma-gained-negative"] as number) || 0;
  const karmaToNuyen = (state.selections["karma-to-nuyen"] as number) || 0;
  const karmaSpentOnSkills = (state.budgets["karma-spent-skills"] as number) || 0;
  const karmaSpentOnAttributes = (state.budgets["karma-spent-attributes"] as number) || 0;
  const totalKarmaSpent = karmaSpentPositive + karmaToNuyen + karmaSpentOnSkills + karmaSpentOnAttributes;
  const availableKarma = karmaBase + karmaGainedNegative - totalKarmaSpent;

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
    // Build new selections
    const updates: Record<string, unknown> = {
      ...state.selections,
      "magical-path": pathId,
    };

    // Clear the aspected mage group selection if not aspected mage
    if (pathId !== "aspected-mage") {
      delete updates["aspected-mage-group"];
    }

    // Clear tradition and mentor spirit if switching to a non-magic path
    if (!TRADITION_PATHS.includes(pathId)) {
      delete updates["tradition"];
      delete updates["mentor-spirit"];
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

  // Handle tradition selection
  const handleTraditionSelect = (traditionId: string) => {
    updateState({
      selections: {
        ...state.selections,
        tradition: traditionId,
      },
    });
  };

  // Handle mentor spirit selection - adds/removes the quality and tracks karma
  const handleMentorSpiritSelect = (mentorId: string | null) => {
    const mentor = mentorId ? mentorSpirits.find(m => m.id === mentorId) : null;

    // Build new selections
    const newSelections: Record<string, unknown> = {
      ...state.selections,
    };

    // Update positive qualities list
    let newPositiveQualities = [...positiveQualities];
    const newQualitySpecs = { ...qualitySpecifications };

    if (mentorId && mentor) {
      // Add mentor spirit quality if not already present
      if (!newPositiveQualities.includes(MENTOR_SPIRIT_QUALITY_ID)) {
        newPositiveQualities = [...newPositiveQualities, MENTOR_SPIRIT_QUALITY_ID];
      }
      // Set the specification to the mentor spirit name
      newQualitySpecs[MENTOR_SPIRIT_QUALITY_ID] = mentor.name;
      newSelections["mentor-spirit"] = mentorId;
    } else {
      // Remove mentor spirit quality
      newPositiveQualities = newPositiveQualities.filter(q => q !== MENTOR_SPIRIT_QUALITY_ID);
      delete newQualitySpecs[MENTOR_SPIRIT_QUALITY_ID];
      delete newSelections["mentor-spirit"];
    }

    newSelections.positiveQualities = newPositiveQualities;
    newSelections.qualitySpecifications = newQualitySpecs;

    // Calculate the new karma spent on positive qualities
    const newKarmaSpent = calculatePositiveKarmaSpent(newPositiveQualities, positiveQualitiesData, qualityLevels);

    updateState({
      selections: newSelections,
      budgets: {
        ...state.budgets,
        "karma-spent-positive": newKarmaSpent,
      },
    });
  };

  // Check if user can afford the mentor spirit quality
  const canAffordMentorSpirit = !hasMentorSpiritQuality
    ? availableKarma >= MENTOR_SPIRIT_KARMA_COST
    : true; // Already have it, so "can afford" to keep it

  // Check if the selected path can have a tradition
  const canSelectTradition = selectedPath && TRADITION_PATHS.includes(selectedPath);

  // Check if the selected path can have a mentor spirit (any Awakened with Magic attribute)
  const canSelectMentorSpirit = selectedPath && MENTOR_SPIRIT_PATHS.includes(selectedPath);

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

      {/* Tradition Selection */}
      {canSelectTradition && traditions.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">
              Choose Your Magical Tradition
            </h4>
            <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
              Your tradition determines how you perceive and interact with magic, including your drain resistance attributes
              and the types of spirits you can summon.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {traditions.map((tradition) => {
              const isSelected = selectedTradition === tradition.id;

              return (
                <button
                  key={tradition.id}
                  onClick={() => handleTraditionSelect(tradition.id)}
                  className={`relative rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-black ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/30"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-3 top-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <h5 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {tradition.name}
                  </h5>
                  <div className="mt-2 inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                    Drain: {formatDrainAttributes(tradition.drainAttributes)}
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {tradition.description}
                  </p>
                  <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
                    <strong>Spirit Types:</strong> {formatSpiritTypes(tradition.spiritTypes)}
                  </div>
                </button>
              );
            })}
          </div>

          {!selectedTradition && (
            <p className="text-center text-sm text-purple-600 dark:text-purple-400">
              Please select a tradition to continue.
            </p>
          )}
        </div>
      )}

      {/* Mentor Spirit Selection (Optional) */}
      {canSelectMentorSpirit && mentorSpirits.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">
              Mentor Spirit Quality (Optional)
            </h4>
            <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
              Any Awakened character with a Magic attribute can take a mentor spirit. This is purchased as a positive quality
              that provides guidance and bonuses, but also comes with a disadvantage you must roleplay.
              You may only have one mentor spirit.
            </p>
            <p className="mt-2 text-sm font-medium text-indigo-800 dark:text-indigo-200">
              Cost: 5 Karma
            </p>
          </div>

          {/* Option to have no mentor spirit */}
          <button
            onClick={() => handleMentorSpiritSelect(null)}
            className={`w-full rounded-lg border-2 p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-black ${
              !selectedMentorSpiritId
                ? "border-indigo-500 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/30"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
            }`}
          >
            <div className="flex items-center gap-2">
              {!selectedMentorSpiritId && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <span className="font-medium text-zinc-900 dark:text-zinc-50">No Mentor Spirit</span>
            </div>
          </button>

          {/* Show warning if not enough karma */}
          {!canAffordMentorSpirit && !selectedMentorSpiritId && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Not enough karma available. You need {MENTOR_SPIRIT_KARMA_COST} karma to purchase a mentor spirit.
            </p>
          )}

          <div className="grid gap-3">
            {mentorSpirits.map((mentor) => {
              const isSelected = selectedMentorSpiritId === mentor.id;
              const canSelect = isSelected || canAffordMentorSpirit;

              return (
                <button
                  key={mentor.id}
                  onClick={() => canSelect && handleMentorSpiritSelect(mentor.id)}
                  disabled={!canSelect}
                  className={`relative rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-black ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/30"
                      : !canSelect
                        ? "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
                        : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-3 top-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {mentor.name}
                      </h5>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {mentor.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                      <p className="text-xs font-medium text-green-700 dark:text-green-300">Advantages:</p>
                      <p className="mt-0.5 text-xs text-green-600 dark:text-green-400">
                        <strong>All:</strong> {mentor.advantages.all}
                      </p>
                      {mentor.advantages.magician && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          <strong>Magician:</strong> {mentor.advantages.magician}
                        </p>
                      )}
                      {mentor.advantages.adept && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          <strong>Adept:</strong> {mentor.advantages.adept}
                        </p>
                      )}
                    </div>
                    <div className="rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                      <p className="text-xs font-medium text-red-700 dark:text-red-300">Disadvantage:</p>
                      <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">
                        {mentor.disadvantage}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

