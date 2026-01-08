"use client";

/**
 * MagicPathCard
 *
 * Modal-based magic/resonance path selection for sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
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
import type { CreationState } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";
import { CreationCard } from "./shared";
import { Lock, Check, X, ChevronRight, ChevronDown, Sparkles, Zap, User } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

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

// Path descriptions and features for the modal
const PATH_INFO: Record<string, { description: string; features: string[] }> = {
  magician: {
    description: "Full spellcaster with summoning and enchanting",
    features: ["5 free spells", "Requires tradition selection", "All magical skills available"],
  },
  "mystic-adept": {
    description: "Blend of adept powers and spellcasting",
    features: ["Split Magic between powers and spells", "Requires tradition", "No counterspelling"],
  },
  adept: {
    description: "Physical magic channeled through the body",
    features: ["Power Points = Magic Rating", "No spells", "No tradition needed"],
  },
  "aspected-mage": {
    description: "Specialist in one magical discipline only",
    features: ["Choose: Sorcery, Conjuring, or Enchanting", "Requires tradition"],
  },
  technomancer: {
    description: "Living interface with the Matrix",
    features: ["Complex forms", "Compile sprites", "Living Persona"],
  },
  mundane: {
    description: "Focus your build on physical, technical, or social strengths",
    features: ["No essence concerns for cyberware/bioware", "Street Samurai, Rigger, Decker, Face archetypes"],
  },
};

// Awakened paths (magic-based)
const AWAKENED_PATHS = ["magician", "mystic-adept", "adept", "aspected-mage"];

// Emerged paths (resonance-based)
const EMERGED_PATHS = ["technomancer"];

// =============================================================================
// TYPES
// =============================================================================

interface MagicPathCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

interface PathOption {
  path: string;
  magicRating?: number;
  resonanceRating?: number;
}

interface MagicPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pathId: string) => void;
  availableOptions: PathOption[];
  priorityLevel: string;
  currentSelection: string | null;
  magicPaths: Array<{ id: string; name: string; hasResonance?: boolean }>;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

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

// =============================================================================
// PATH SELECTION MODAL
// =============================================================================

function MagicPathModal({
  isOpen,
  onClose,
  onConfirm,
  availableOptions,
  priorityLevel,
  currentSelection,
  magicPaths,
}: MagicPathModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentSelection);

  // Reset selection when modal closes
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

  // Group available paths
  const groupedPaths = useMemo(() => {
    const awakened: PathOption[] = [];
    const emerged: PathOption[] = [];

    availableOptions.forEach((opt) => {
      if (AWAKENED_PATHS.includes(opt.path)) {
        awakened.push(opt);
      } else if (EMERGED_PATHS.includes(opt.path)) {
        emerged.push(opt);
      }
    });

    return { awakened, emerged };
  }, [availableOptions]);

  if (!isOpen) return null;

  const renderPathOption = (option: PathOption, isResonance: boolean) => {
    const pathInfo = magicPaths.find((p) => p.id === option.path);
    if (!pathInfo) return null;

    const info = PATH_INFO[option.path];
    const isSelected = selectedId === option.path;
    const rating = option.magicRating || option.resonanceRating || 0;

    return (
      <button
        key={option.path}
        onClick={() => setSelectedId(option.path)}
        className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
          isSelected
            ? isResonance
              ? "border-cyan-500 bg-cyan-50 dark:border-cyan-500 dark:bg-cyan-900/20"
              : "border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20"
            : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80"
        }`}
      >
        {/* Header row */}
        <div className="flex items-center gap-3">
          {/* Radio indicator */}
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              isSelected
                ? isResonance
                  ? "border-cyan-500 bg-cyan-500 text-white"
                  : "border-purple-500 bg-purple-500 text-white"
                : "border-zinc-300 dark:border-zinc-600"
            }`}
          >
            {isSelected && <Check className="h-3 w-3" />}
          </div>

          <span
            className={`text-base font-semibold uppercase ${
              isSelected
                ? isResonance
                  ? "text-cyan-900 dark:text-cyan-100"
                  : "text-purple-900 dark:text-purple-100"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {pathInfo.name}
          </span>

          {/* Rating badge */}
          <span
            className={`ml-auto rounded px-2 py-0.5 text-xs font-medium ${
              isResonance
                ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
            }`}
          >
            {isResonance ? "Resonance" : "Magic"} {rating}
          </span>
        </div>

        {/* Description */}
        {info && (
          <>
            <p className="mt-2 pl-8 text-sm text-zinc-600 dark:text-zinc-400">
              {info.description}
            </p>
            <p className="mt-1 pl-8 text-xs text-zinc-500 dark:text-zinc-500">
              {info.features.join(" • ")}
            </p>
          </>
        )}
      </button>
    );
  };

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
            SELECT MAGICAL PATH
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
            Available at Priority {priorityLevel}
          </p>
        </div>

        {/* Path list */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <div className="space-y-4">
            {/* AWAKENED section */}
            {groupedPaths.awakened.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Awakened
                  </span>
                </div>
                <div className="space-y-2">
                  {groupedPaths.awakened.map((opt) => renderPathOption(opt, false))}
                </div>
              </div>
            )}

            {/* EMERGED section */}
            {groupedPaths.emerged.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    Emerged
                  </span>
                </div>
                <div className="space-y-2">
                  {groupedPaths.emerged.map((opt) => renderPathOption(opt, true))}
                </div>
              </div>
            )}

            {/* MUNDANE section */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-zinc-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Mundane
                </span>
              </div>
              <button
                onClick={() => setSelectedId("mundane")}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  selectedId === "mundane"
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      selectedId === "mundane"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {selectedId === "mundane" && <Check className="h-3 w-3" />}
                  </div>
                  <span
                    className={`text-base font-semibold uppercase ${
                      selectedId === "mundane"
                        ? "text-emerald-900 dark:text-emerald-100"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    No Magical Abilities
                  </span>
                </div>
                <p className="mt-2 pl-8 text-sm text-zinc-600 dark:text-zinc-400">
                  {PATH_INFO.mundane.description}
                </p>
                <p className="mt-1 pl-8 text-xs text-zinc-500 dark:text-zinc-500">
                  {PATH_INFO.mundane.features.join(" • ")}
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set Magic priority first
          </p>
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
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              (auto)
            </span>
          </div>

          {/* Info text */}
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No magical or resonance abilities available at Priority E.
            Move Magic/Resonance to a higher priority for awakened options.
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
              {pathInfo && (
                <div className="text-sm">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {selectedPath === "mundane" ? "Build Focus" : "Abilities"}
                  </span>
                  <ul className="mt-1 space-y-0.5">
                    {pathInfo.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="text-zinc-400">
                          {index === pathInfo.features.length - 1 ? "└─" : "├─"}
                        </span>
                        {feature}
                      </li>
                    ))}
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
                <span className="text-zinc-500 dark:text-zinc-400">
                  Choose path...
                </span>
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
