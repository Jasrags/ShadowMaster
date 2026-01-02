"use client";

/**
 * MagicPathCard
 *
 * Compact card for magic/resonance path selection in sheet-driven creation.
 * Supports path selection, tradition, aspected mage groups, and mentor spirits.
 *
 * Features:
 * - Path selection (Magician, Adept, Mystic Adept, Aspected, Technomancer, Mundane)
 * - Tradition selection (for magicians)
 * - Aspected mage skill group selection
 * - Mentor spirit selection (optional quality)
 * - Magic/Resonance rating display
 */

import { useMemo, useCallback, useState } from "react";
import {
  useMagicPaths,
  usePriorityTable,
  useTraditions,
  useMentorSpirits,
  useQualities,
} from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";
import { CreationCard } from "./shared";
import { Lock, Check, ChevronDown, Sparkles, Zap, User } from "lucide-react";

// Aspected mage can choose ONE of these skill groups
const ASPECTED_MAGE_GROUPS = [
  {
    id: "sorcery",
    name: "Sorcery",
    description: "Cast spells and rituals",
    skills: ["Spellcasting", "Counterspelling", "Ritual Spellcasting"],
  },
  {
    id: "conjuring",
    name: "Conjuring",
    description: "Summon and control spirits",
    skills: ["Summoning", "Banishing", "Binding"],
  },
  {
    id: "enchanting",
    name: "Enchanting",
    description: "Create preparations and foci",
    skills: ["Alchemy", "Artificing", "Disenchanting"],
  },
];

// Paths that can select a tradition
const TRADITION_PATHS = ["magician", "mystic-adept", "aspected-mage"];

// Paths that can select a mentor spirit
const MENTOR_SPIRIT_PATHS = ["magician", "mystic-adept", "aspected-mage", "adept"];

const MENTOR_SPIRIT_QUALITY_ID = "mentor-spirit";
const MENTOR_SPIRIT_KARMA_COST = 5;

interface MagicPathCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// Helper to calculate karma spent on positive qualities
function calculatePositiveKarmaSpent(
  selectedQualities: string[],
  qualitiesData: QualityData[],
  qualityLevels: Record<string, number>
): number {
  return selectedQualities.reduce((sum, id) => {
    const q = qualitiesData.find((x) => x.id === id);
    if (!q) return sum;
    let cost = q.karmaCost || 0;
    if (q.levels) {
      const lvl = qualityLevels[id] || 1;
      const lData = q.levels.find((l) => l.level === lvl);
      if (lData) cost = Math.abs(lData.karma);
    }
    return sum + cost;
  }, 0);
}

export function MagicPathCard({ state, updateState }: MagicPathCardProps) {
  const magicPaths = useMagicPaths();
  const priorityTable = usePriorityTable();
  const traditions = useTraditions();
  const mentorSpirits = useMentorSpirits();
  const { positive: positiveQualitiesData } = useQualities();

  const [showTraditions, setShowTraditions] = useState(false);
  const [showMentors, setShowMentors] = useState(false);

  const selectedPath = state.selections["magical-path"] as string | undefined;
  const selectedAspectedGroup = state.selections["aspected-mage-group"] as string | undefined;
  const selectedTradition = state.selections["tradition"] as string | undefined;
  const selectedMentorSpiritId = state.selections["mentor-spirit"] as string | undefined;
  const magicPriority = state.priorities?.magic;

  // Get current positive qualities and specifications
  const positiveQualities = useMemo(
    () => (state.selections.positiveQualities || []) as string[],
    [state.selections.positiveQualities]
  );
  const qualitySpecifications = useMemo(
    () => (state.selections.qualitySpecifications || {}) as Record<string, string>,
    [state.selections.qualitySpecifications]
  );
  const qualityLevels = useMemo(
    () => (state.selections.qualityLevels || {}) as Record<string, number>,
    [state.selections.qualityLevels]
  );

  // Check if mentor spirit quality is already selected
  const hasMentorSpiritQuality = positiveQualities.includes(MENTOR_SPIRIT_QUALITY_ID);

  // Get available magic options based on priority
  const availableOptions = useMemo(() => {
    if (!magicPriority || !priorityTable?.table[magicPriority]) {
      return [];
    }
    const magicData = priorityTable.table[magicPriority].magic as {
      options: Array<{ path: string; magicRating?: number; resonanceRating?: number }>;
    };
    return magicData?.options || [];
  }, [magicPriority, priorityTable]);

  // Get selected path's rating
  const pathRating = useMemo(() => {
    if (!selectedPath || selectedPath === "mundane") return 0;
    const option = availableOptions.find((o) => o.path === selectedPath);
    return option?.magicRating || option?.resonanceRating || 0;
  }, [selectedPath, availableOptions]);

  // Handle path selection
  const handleSelect = useCallback(
    (pathId: string) => {
      const updates: Record<string, unknown> = {
        ...state.selections,
        "magical-path": pathId,
      };

      // Clear aspected group if not aspected mage
      if (pathId !== "aspected-mage") {
        delete updates["aspected-mage-group"];
      }

      // Clear tradition and mentor spirit if non-magic path
      if (!TRADITION_PATHS.includes(pathId)) {
        delete updates["tradition"];
        delete updates["mentor-spirit"];
      }

      // Clear mentor spirit if path doesn't support it
      if (!MENTOR_SPIRIT_PATHS.includes(pathId)) {
        delete updates["mentor-spirit"];
        // Remove mentor spirit quality
        const newPositiveQualities = (updates.positiveQualities as string[] || positiveQualities)
          .filter((q: string) => q !== MENTOR_SPIRIT_QUALITY_ID);
        updates.positiveQualities = newPositiveQualities;
        const newQualitySpecs = { ...(updates.qualitySpecifications as Record<string, string> || qualitySpecifications) };
        delete newQualitySpecs[MENTOR_SPIRIT_QUALITY_ID];
        updates.qualitySpecifications = newQualitySpecs;
      }

      updateState({ selections: updates });
    },
    [state.selections, positiveQualities, qualitySpecifications, updateState]
  );

  // Handle aspected mage group selection
  const handleAspectedGroupSelect = useCallback(
    (groupId: string) => {
      updateState({
        selections: {
          ...state.selections,
          "aspected-mage-group": groupId,
        },
      });
    },
    [state.selections, updateState]
  );

  // Handle tradition selection
  const handleTraditionSelect = useCallback(
    (traditionId: string) => {
      updateState({
        selections: {
          ...state.selections,
          tradition: traditionId,
        },
      });
      setShowTraditions(false);
    },
    [state.selections, updateState]
  );

  // Handle mentor spirit selection
  const handleMentorSpiritSelect = useCallback(
    (mentorId: string | null) => {
      const mentor = mentorId ? mentorSpirits.find((m) => m.id === mentorId) : null;

      const newSelections: Record<string, unknown> = {
        ...state.selections,
      };

      let newPositiveQualities = [...positiveQualities];
      const newQualitySpecs = { ...qualitySpecifications };

      if (mentorId && mentor) {
        if (!newPositiveQualities.includes(MENTOR_SPIRIT_QUALITY_ID)) {
          newPositiveQualities = [...newPositiveQualities, MENTOR_SPIRIT_QUALITY_ID];
        }
        newQualitySpecs[MENTOR_SPIRIT_QUALITY_ID] = mentor.name;
        newSelections["mentor-spirit"] = mentorId;
      } else {
        newPositiveQualities = newPositiveQualities.filter((q) => q !== MENTOR_SPIRIT_QUALITY_ID);
        delete newQualitySpecs[MENTOR_SPIRIT_QUALITY_ID];
        delete newSelections["mentor-spirit"];
      }

      newSelections.positiveQualities = newPositiveQualities;
      newSelections.qualitySpecifications = newQualitySpecs;

      const newKarmaSpent = calculatePositiveKarmaSpent(
        newPositiveQualities,
        positiveQualitiesData,
        qualityLevels
      );

      updateState({
        selections: newSelections,
        budgets: {
          ...state.budgets,
          "karma-spent-positive": newKarmaSpent,
        },
      });
      setShowMentors(false);
    },
    [
      mentorSpirits,
      positiveQualities,
      qualitySpecifications,
      positiveQualitiesData,
      qualityLevels,
      state.selections,
      state.budgets,
      updateState,
    ]
  );

  // Check affordability of mentor spirit
  const karmaBase = 25;
  const karmaSpentPositive = (state.budgets["karma-spent-positive"] as number) || 0;
  const karmaGainedNegative = (state.budgets["karma-gained-negative"] as number) || 0;
  const availableKarma = karmaBase + karmaGainedNegative - karmaSpentPositive;
  const canAffordMentorSpirit = hasMentorSpiritQuality || availableKarma >= MENTOR_SPIRIT_KARMA_COST;

  // UI helpers
  const canSelectTradition = selectedPath && TRADITION_PATHS.includes(selectedPath);
  const canSelectMentorSpirit = selectedPath && MENTOR_SPIRIT_PATHS.includes(selectedPath);
  const selectedTraditionData = traditions.find((t) => t.id === selectedTradition);
  const selectedMentorData = mentorSpirits.find((m) => m.id === selectedMentorSpiritId);

  // Validation status
  const validationStatus = useMemo(() => {
    if (!magicPriority) return "pending";
    if (!selectedPath) return "pending";
    if (selectedPath === "aspected-mage" && !selectedAspectedGroup) return "warning";
    if (canSelectTradition && !selectedTradition) return "warning";
    return "valid";
  }, [magicPriority, selectedPath, selectedAspectedGroup, canSelectTradition, selectedTradition]);

  // Check if priority is set
  if (!magicPriority) {
    return (
      <CreationCard title="Magic / Resonance" description="Select magical path" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set Magic priority first
          </p>
        </div>
      </CreationCard>
    );
  }

  // Mundane only
  const isMundaneOnly = availableOptions.length === 0;
  if (isMundaneOnly) {
    return (
      <CreationCard
        title="Magic / Resonance"
        description={`Priority ${magicPriority} - Mundane`}
        status="valid"
      >
        <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700">
              <User className="h-5 w-5 text-zinc-500" />
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Mundane</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No magical or resonance abilities
              </p>
            </div>
          </div>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Magic / Resonance"
      description={selectedPath ? `${magicPaths.find((p) => p.id === selectedPath)?.name || selectedPath}${pathRating > 0 ? ` (${pathRating})` : ""}` : "Select path"}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Path Selection */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {/* Mundane option */}
          <button
            onClick={() => handleSelect("mundane")}
            className={`relative rounded-lg border-2 p-3 text-left transition-all ${
              selectedPath === "mundane"
                ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
            }`}
          >
            {selectedPath === "mundane" && (
              <div className="absolute right-2 top-2">
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
            )}
            <User className="mb-1 h-4 w-4 text-zinc-500" />
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Mundane</div>
          </button>

          {/* Magic/Resonance paths */}
          {availableOptions.map((option) => {
            const pathInfo = magicPaths.find((p) => p.id === option.path);
            if (!pathInfo) return null;

            const isSelected = selectedPath === option.path;
            const rating = option.magicRating || option.resonanceRating || 0;
            const isResonance = pathInfo.hasResonance;

            return (
              <button
                key={option.path}
                onClick={() => handleSelect(option.path)}
                className={`relative rounded-lg border-2 p-3 text-left transition-all ${
                  isSelected
                    ? isResonance
                      ? "border-cyan-500 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-900/20"
                      : "border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20"
                    : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                }`}
              >
                {isSelected && (
                  <div className="absolute right-2 top-2">
                    <Check className={`h-4 w-4 ${isResonance ? "text-cyan-500" : "text-purple-500"}`} />
                  </div>
                )}
                {isResonance ? (
                  <Zap className="mb-1 h-4 w-4 text-cyan-500" />
                ) : (
                  <Sparkles className="mb-1 h-4 w-4 text-purple-500" />
                )}
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {pathInfo.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isResonance ? "RES" : "MAG"} {rating}
                </div>
              </button>
            );
          })}
        </div>

        {/* Aspected Mage Skill Group */}
        {selectedPath === "aspected-mage" && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Choose magical focus (required)
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ASPECTED_MAGE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleAspectedGroupSelect(group.id)}
                  className={`rounded-lg border-2 p-2 text-center transition-all ${
                    selectedAspectedGroup === group.id
                      ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/20"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                  }`}
                >
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {group.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {group.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tradition Selection */}
        {canSelectTradition && traditions.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setShowTraditions(!showTraditions)}
              className="flex w-full items-center justify-between rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-left dark:border-purple-800 dark:bg-purple-900/20"
            >
              <div>
                <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                  Tradition
                </div>
                <div className="text-sm text-purple-900 dark:text-purple-100">
                  {selectedTraditionData?.name || "Select tradition..."}
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-purple-500 transition-transform ${
                  showTraditions ? "rotate-180" : ""
                }`}
              />
            </button>

            {showTraditions && (
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800">
                {traditions.map((tradition) => (
                  <button
                    key={tradition.id}
                    onClick={() => handleTraditionSelect(tradition.id)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                      selectedTradition === tradition.id
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {tradition.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Drain: {tradition.drainAttributes.join(" + ")}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mentor Spirit Selection (Optional) */}
        {canSelectMentorSpirit && mentorSpirits.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setShowMentors(!showMentors)}
              className="flex w-full items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-left dark:border-indigo-800 dark:bg-indigo-900/20"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    Mentor Spirit
                  </span>
                  <span className="rounded bg-indigo-100 px-1 py-0.5 text-[10px] text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                    Optional • 5 Karma
                  </span>
                </div>
                <div className="text-sm text-indigo-900 dark:text-indigo-100">
                  {selectedMentorData?.name || "None"}
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-indigo-500 transition-transform ${
                  showMentors ? "rotate-180" : ""
                }`}
              />
            </button>

            {showMentors && (
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800">
                <button
                  onClick={() => handleMentorSpiritSelect(null)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                    !selectedMentorSpiritId
                      ? "bg-indigo-100 dark:bg-indigo-900/30"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  }`}
                >
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    No Mentor Spirit
                  </div>
                </button>
                {mentorSpirits.map((mentor) => {
                  const isSelected = selectedMentorSpiritId === mentor.id;
                  const canSelect = isSelected || canAffordMentorSpirit;
                  return (
                    <button
                      key={mentor.id}
                      onClick={() => canSelect && handleMentorSpiritSelect(mentor.id)}
                      disabled={!canSelect}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? "bg-indigo-100 dark:bg-indigo-900/30"
                          : canSelect
                          ? "hover:bg-zinc-50 dark:hover:bg-zinc-700"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {mentor.name}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        {mentor.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {selectedPath && selectedPath !== "mundane" && (
          <div className="rounded-lg bg-zinc-50 p-3 text-xs dark:bg-zinc-800/50">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {pathRating > 0 && (
                <span className="text-zinc-600 dark:text-zinc-400">
                  {magicPaths.find((p) => p.id === selectedPath)?.hasResonance ? "Resonance" : "Magic"}: <strong className="text-zinc-900 dark:text-zinc-100">{pathRating}</strong>
                </span>
              )}
              {selectedTraditionData && (
                <span className="text-zinc-600 dark:text-zinc-400">
                  Tradition: <strong className="text-zinc-900 dark:text-zinc-100">{selectedTraditionData.name}</strong>
                </span>
              )}
              {selectedMentorData && (
                <span className="text-zinc-600 dark:text-zinc-400">
                  Mentor: <strong className="text-zinc-900 dark:text-zinc-100">{selectedMentorData.name}</strong>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </CreationCard>
  );
}
