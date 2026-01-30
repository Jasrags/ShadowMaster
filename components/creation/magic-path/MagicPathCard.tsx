"use client";

/**
 * MagicPathCard
 *
 * Modal-based magic/resonance path selection for sheet-driven creation.
 *
 * Features:
 * - Modal-based path selection (per UI mocks)
 * - Auto-selection for Priority E (Mundane only)
 * - Grouped paths: AWAKENED, EMERGED, MUNDANE
 * - Selected state with tree formatting (├─ └─)
 * - Tradition selection for applicable paths
 * - Aspected mage skill group selection
 * - Mentor spirit selection (optional quality)
 */

import { useMemo, useCallback, useState } from "react";
import {
  useMagicPaths,
  usePriorityTable,
  useTraditions,
  useMentorSpirits,
  useQualities,
} from "@/lib/rules";
import { CreationCard } from "../shared";
import { Lock, ChevronRight, ChevronDown } from "lucide-react";
import {
  ASPECTED_MAGE_GROUPS,
  TRADITION_PATHS,
  MENTOR_SPIRIT_PATHS,
  MENTOR_SPIRIT_QUALITY_ID,
  MENTOR_SPIRIT_KARMA_COST,
  PATH_INFO,
  FREE_SKILL_TYPE_LABELS,
} from "./constants";
import { calculatePositiveKarmaSpent, type QualitySelection } from "./utils";
import { MagicPathModal } from "./MagicPathModal";
import type { MagicPathCardProps } from "./types";

export function MagicPathCard({ state, updateState }: MagicPathCardProps) {
  const magicPaths = useMagicPaths();
  const priorityTable = usePriorityTable();
  const traditions = useTraditions();
  const mentorSpirits = useMentorSpirits();
  const { positive: positiveQualitiesData } = useQualities();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTraditions, setShowTraditions] = useState(false);
  const [showMentors, setShowMentors] = useState(false);

  const selectedPath = state.selections["magical-path"] as string | undefined;
  const selectedAspectedGroup = state.selections["aspected-mage-group"] as string | undefined;
  const selectedTradition = state.selections["tradition"] as string | undefined;
  const selectedMentorSpiritId = state.selections["mentor-spirit"] as string | undefined;
  const magicPriority = state.priorities?.magic;

  // Get current positive qualities and specifications
  const positiveQualities = useMemo(
    () => (state.selections.positiveQualities || []) as QualitySelection[],
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

  // Check if mentor spirit quality is already selected (handles both string and object formats)
  const hasMentorSpiritQuality = positiveQualities.some(
    (q) =>
      (typeof q === "string" && q === MENTOR_SPIRIT_QUALITY_ID) ||
      (typeof q === "object" && q.id === MENTOR_SPIRIT_QUALITY_ID)
  );

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

  // Get selected path's rating and free skills
  const selectedOption = useMemo(() => {
    if (!selectedPath || selectedPath === "mundane") return null;
    return availableOptions.find((o) => o.path === selectedPath) as
      | {
          path: string;
          magicRating?: number;
          resonanceRating?: number;
          freeSkills?: Array<{ type: string; rating: number; count: number }>;
          spells?: number;
          complexForms?: number;
        }
      | undefined;
  }, [selectedPath, availableOptions]);

  const pathRating = useMemo(() => {
    if (!selectedOption) return 0;
    return selectedOption.magicRating || selectedOption.resonanceRating || 0;
  }, [selectedOption]);

  // Format free skills for display
  const freeSkillsDisplay = useMemo(() => {
    if (!selectedOption?.freeSkills) return [];
    return selectedOption.freeSkills.map((fs) => {
      const typeInfo = FREE_SKILL_TYPE_LABELS[fs.type];
      const label = typeInfo?.label || fs.type;
      return `${fs.count} ${label} at rating ${fs.rating}`;
    });
  }, [selectedOption]);

  // Get selected path data
  const selectedPathData = useMemo(() => {
    if (!selectedPath) return null;
    if (selectedPath === "mundane") {
      return { id: "mundane", name: "Mundane", hasResonance: false };
    }
    return magicPaths.find((p) => p.id === selectedPath);
  }, [selectedPath, magicPaths]);

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
        // Remove mentor spirit quality (handles both string and object formats)
        const currentQualities =
          (updates.positiveQualities as QualitySelection[]) || positiveQualities;
        const newPositiveQualities = currentQualities.filter(
          (q) =>
            (typeof q === "string" && q !== MENTOR_SPIRIT_QUALITY_ID) ||
            (typeof q === "object" && q.id !== MENTOR_SPIRIT_QUALITY_ID)
        );
        updates.positiveQualities = newPositiveQualities;
        // Also clean up legacy qualitySpecifications for backwards compatibility
        const newQualitySpecs = {
          ...((updates.qualitySpecifications as Record<string, string>) || qualitySpecifications),
        };
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

      // Filter out existing mentor spirit quality (handles both string and object formats)
      let newPositiveQualities: QualitySelection[] = positiveQualities.filter(
        (q) =>
          (typeof q === "string" && q !== MENTOR_SPIRIT_QUALITY_ID) ||
          (typeof q === "object" && q.id !== MENTOR_SPIRIT_QUALITY_ID)
      );

      // Also maintain legacy qualitySpecifications for backwards compatibility
      const newQualitySpecs = { ...qualitySpecifications };

      if (mentorId && mentor) {
        // Add mentor spirit quality using new object format with embedded specification
        newPositiveQualities = [
          ...newPositiveQualities,
          {
            id: MENTOR_SPIRIT_QUALITY_ID,
            specification: mentor.name,
            karma: MENTOR_SPIRIT_KARMA_COST,
          },
        ];
        // Also write to legacy qualitySpecifications for backwards compatibility
        newQualitySpecs[MENTOR_SPIRIT_QUALITY_ID] = mentor.name;
        newSelections["mentor-spirit"] = mentorId;
      } else {
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
  const canAffordMentorSpirit =
    hasMentorSpiritQuality || availableKarma >= MENTOR_SPIRIT_KARMA_COST;

  // UI helpers
  const canSelectTradition = selectedPath && TRADITION_PATHS.includes(selectedPath);
  const canSelectMentorSpirit = selectedPath && MENTOR_SPIRIT_PATHS.includes(selectedPath);
  const selectedTraditionData = traditions.find((t) => t.id === selectedTradition);
  const selectedMentorData = mentorSpirits.find((m) => m.id === selectedMentorSpiritId);

  // Validation status
  const validationStatus = useMemo(() => {
    if (!magicPriority) return "pending";
    if (!selectedPath) return "warning";
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Set Magic priority first</p>
        </div>
      </CreationCard>
    );
  }

  // Mundane only (Priority E)
  const isMundaneOnly = availableOptions.length === 0;
  if (isMundaneOnly) {
    return (
      <CreationCard
        title="Magic / Resonance"
        description={`Priority ${magicPriority} - Mundane`}
        status="valid"
      >
        <div className="space-y-3">
          {/* Auto-selected Mundane */}
          <div className="flex items-center justify-between rounded-lg border-2 border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
            <span className="font-semibold uppercase text-emerald-900 dark:text-emerald-100">
              Mundane
            </span>
            <span className="text-sm text-emerald-600 dark:text-emerald-400">(auto)</span>
          </div>

          {/* Info text */}
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No magical or resonance abilities available at Priority E. Move Magic/Resonance to a
            higher priority for awakened options.
          </p>
        </div>
      </CreationCard>
    );
  }

  // Get path info for selected state
  const pathInfo = selectedPath ? PATH_INFO[selectedPath] : null;
  const isResonancePath = selectedPathData?.hasResonance;

  return (
    <>
      <CreationCard
        title="Magic / Resonance"
        description={
          selectedPathData
            ? `${selectedPathData.name}${pathRating > 0 ? ` • ${isResonancePath ? "RES" : "MAG"} ${pathRating}` : ""}`
            : `Priority ${magicPriority} - ${availableOptions.length + 1} options`
        }
        status={validationStatus}
      >
        <div className="space-y-3">
          {/* Selection trigger / Selected display */}
          {selectedPathData ? (
            // Selected state
            <div className="space-y-3">
              {/* Selected path button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-colors ${
                  selectedPath === "mundane"
                    ? "border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30"
                    : isResonancePath
                      ? "border-cyan-200 bg-cyan-50 hover:border-cyan-300 hover:bg-cyan-100 dark:border-cyan-800 dark:bg-cyan-900/20 dark:hover:border-cyan-700 dark:hover:bg-cyan-900/30"
                      : "border-purple-200 bg-purple-50 hover:border-purple-300 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-900/20 dark:hover:border-purple-700 dark:hover:bg-purple-900/30"
                }`}
              >
                <span
                  className={`font-semibold uppercase ${
                    selectedPath === "mundane"
                      ? "text-emerald-900 dark:text-emerald-100"
                      : isResonancePath
                        ? "text-cyan-900 dark:text-cyan-100"
                        : "text-purple-900 dark:text-purple-100"
                  }`}
                >
                  {selectedPathData.name}
                </span>
                <span
                  className={`text-sm ${
                    selectedPath === "mundane"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isResonancePath
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-purple-600 dark:text-purple-400"
                  }`}
                >
                  Change
                </span>
              </button>

              {/* Path stats */}
              {selectedPath !== "mundane" && pathRating > 0 && (
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {isResonancePath ? "Resonance" : "Magic"} Rating:
                  </span>{" "}
                  {pathRating}
                  {selectedPath === "adept" && (
                    <span className="ml-3">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        Power Points:
                      </span>{" "}
                      {pathRating}.0 PP
                    </span>
                  )}
                </div>
              )}

              {/* Abilities with tree formatting */}
              {(pathInfo || freeSkillsDisplay.length > 0 || selectedOption) && (
                <div className="text-sm">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {selectedPath === "mundane" ? "Build Focus" : "Abilities"}
                  </span>
                  <ul className="mt-1 space-y-0.5">
                    {/* Priority benefits: rating, free spells/forms */}
                    {selectedPath !== "mundane" && pathRating > 0 && (
                      <li className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                        <span className="text-zinc-400">├─</span>
                        {isResonancePath ? "Resonance" : "Magic"} {pathRating}
                      </li>
                    )}
                    {selectedOption?.spells && selectedOption.spells > 0 && (
                      <li className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                        <span className="text-zinc-400">├─</span>
                        {selectedOption.spells} free spells
                      </li>
                    )}
                    {selectedOption?.complexForms && selectedOption.complexForms > 0 && (
                      <li className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                        <span className="text-zinc-400">├─</span>
                        {selectedOption.complexForms} free complex forms
                      </li>
                    )}
                    {/* Free skills from priority */}
                    {freeSkillsDisplay.map((skillDisplay, index) => (
                      <li
                        key={`skill-${index}`}
                        className="flex items-start gap-2 font-medium text-indigo-600 dark:text-indigo-400"
                      >
                        <span className="text-indigo-400 dark:text-indigo-500">├─</span>
                        {skillDisplay}
                      </li>
                    ))}
                    {/* Static path features */}
                    {pathInfo?.features.map((feature, index) => {
                      const isLast =
                        index === pathInfo.features.length - 1 &&
                        freeSkillsDisplay.length === 0 &&
                        !selectedOption?.spells &&
                        !selectedOption?.complexForms;
                      return (
                        <li
                          key={`feature-${index}`}
                          className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400"
                        >
                          <span className="text-zinc-400">{isLast ? "└─" : "├─"}</span>
                          {feature}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

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
                        <div className="mt-0.5 text-[9px] text-zinc-400 dark:text-zinc-500">
                          {group.skills.join(" • ")}
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
                        Tradition {!selectedTradition && "(required)"}
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
                              : "hover:outline hover:outline-1 hover:outline-purple-400 dark:hover:outline-purple-500"
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
                            : "hover:outline hover:outline-1 hover:outline-indigo-400 dark:hover:outline-indigo-500"
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
                                  ? "hover:outline hover:outline-1 hover:outline-indigo-400 dark:hover:outline-indigo-500"
                                  : "cursor-not-allowed opacity-50"
                            }`}
                          >
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {mentor.name}
                            </div>
                            <div className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                              {mentor.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // No selection state
            <div className="space-y-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-between rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
              >
                <span className="text-zinc-500 dark:text-zinc-400">Choose path...</span>
                <span className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  Select
                  <ChevronRight className="h-4 w-4" />
                </span>
              </button>

              {/* Warning if opened modal but closed without selection */}
              {validationStatus === "warning" && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  ⚠ A magical path must be selected to continue
                </p>
              )}
            </div>
          )}
        </div>
      </CreationCard>

      {/* Selection Modal */}
      <MagicPathModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSelect}
        availableOptions={availableOptions}
        priorityLevel={magicPriority}
        currentSelection={selectedPath || null}
        magicPaths={magicPaths}
      />
    </>
  );
}
