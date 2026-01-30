"use client";

/**
 * SkillModal
 *
 * Modal for adding individual skills with:
 * - Search and category filtering
 * - Split-pane design (list left, details right)
 * - Rating selection
 * - Multi-specialization support (suggestions + custom)
 * - Duplicate prevention
 *
 * Uses BaseModal for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import { useSkills, type SkillData, type SkillGroupData } from "@/lib/rules";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Plus, Minus, Info, Check, AlertTriangle, X, Sparkles } from "lucide-react";
import { calculateSkillRaiseKarmaCost } from "@/lib/rules/skills/group-utils";

// =============================================================================
// CONSTANTS
// =============================================================================

const SKILL_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "combat", label: "Combat" },
  { id: "physical", label: "Physical" },
  { id: "social", label: "Social" },
  { id: "technical", label: "Technical" },
  { id: "vehicle", label: "Vehicle" },
  { id: "magical", label: "Magic" },
  { id: "resonance", label: "Resonance" },
] as const;

type SkillCategory = (typeof SKILL_CATEGORIES)[number]["id"];

const MAX_SKILL_RATING = 6;
const MAX_SKILL_RATING_WITH_APTITUDE = 7;
const SPEC_SKILL_POINT_COST = 1;
const MAX_SPECS_PER_SKILL = 1;

// =============================================================================
// TYPES
// =============================================================================

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (skillId: string, rating: number, specializations: string[], karmaSpent?: number) => void;
  existingSkillIds: string[];
  existingGroupIds: string[];
  skillGroups: SkillGroupData[];
  hasMagic: boolean;
  hasResonance: boolean;
  remainingPoints: number;
  karmaRemaining: number;
  incompetentGroupId?: string; // Skill group the character is incompetent in
  aptitudeSkillId?: string; // Skill that can reach rating 7 (from Aptitude quality)
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillModal({
  isOpen,
  onClose,
  onAdd,
  existingSkillIds,
  existingGroupIds,
  skillGroups,
  hasMagic,
  hasResonance,
  remainingPoints,
  karmaRemaining,
  incompetentGroupId,
  aptitudeSkillId,
}: SkillModalProps) {
  const { activeSkills } = useSkills();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>("all");
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [rating, setRating] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [customSpecInput, setCustomSpecInput] = useState("");

  // Reset state when modal opens/closes
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSkillId(null);
    setRating(1);
    setSelectedSpecs([]);
    setCustomSpecInput("");
  }, []);

  // Reset for adding another skill - preserves search/filter
  const resetForNextSkill = useCallback(() => {
    setSelectedSkillId(null);
    setRating(1);
    setSelectedSpecs([]);
    setCustomSpecInput("");
  }, []);

  // Get skills that are part of already-added groups
  const skillsInGroups = useMemo(() => {
    const inGroup = new Set<string>();
    existingGroupIds.forEach((groupId) => {
      const group = skillGroups.find((g) => g.id === groupId);
      if (group) {
        group.skills.forEach((s) => inGroup.add(s));
      }
    });
    return inGroup;
  }, [existingGroupIds, skillGroups]);

  // Get skills in the incompetent group (character cannot use these)
  const incompetentSkills = useMemo(() => {
    if (!incompetentGroupId) return new Set<string>();
    const group = skillGroups.find((g) => g.id === incompetentGroupId);
    return group ? new Set(group.skills) : new Set<string>();
  }, [incompetentGroupId, skillGroups]);

  // Get incompetent group name for display
  const incompetentGroupName = useMemo(() => {
    if (!incompetentGroupId) return null;
    const group = skillGroups.find((g) => g.id === incompetentGroupId);
    return group?.name || null;
  }, [incompetentGroupId, skillGroups]);

  // Filter available skills
  const filteredSkills = useMemo(() => {
    return activeSkills.filter((skill) => {
      // Filter by magic/resonance requirements
      if (skill.requiresMagic && !hasMagic) return false;
      if (skill.requiresResonance && !hasResonance) return false;

      // Filter by category
      if (selectedCategory !== "all" && skill.category !== selectedCategory) return false;

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          skill.name.toLowerCase().includes(query) ||
          skill.linkedAttribute.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [activeSkills, hasMagic, hasResonance, selectedCategory, searchQuery]);

  // Group skills by category for display
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, SkillData[]> = {};
    filteredSkills.forEach((skill) => {
      const cat = skill.category || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill);
    });
    // Sort skills within each category
    Object.values(grouped).forEach((skills) => {
      skills.sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredSkills]);

  // Get selected skill data
  const selectedSkill = useMemo(() => {
    if (!selectedSkillId) return null;
    return activeSkills.find((s) => s.id === selectedSkillId) || null;
  }, [activeSkills, selectedSkillId]);

  // Get group name if skill is in a group
  const skillGroupName = useMemo(() => {
    if (!selectedSkill?.group) return null;
    const group = skillGroups.find((g) => g.id === selectedSkill.group);
    return group?.name || null;
  }, [selectedSkill, skillGroups]);

  // Get max rating for the selected skill (considering Aptitude quality)
  const selectedSkillMaxRating = useMemo(() => {
    if (selectedSkillId && aptitudeSkillId === selectedSkillId) {
      return MAX_SKILL_RATING_WITH_APTITUDE;
    }
    return MAX_SKILL_RATING;
  }, [selectedSkillId, aptitudeSkillId]);

  // Check if a specialization already exists (case-insensitive)
  const isSpecDuplicate = useCallback(
    (spec: string) => {
      const normalized = spec.trim().toLowerCase();
      return selectedSpecs.some((s) => s.toLowerCase() === normalized);
    },
    [selectedSpecs]
  );

  // Add a specialization (max 1 per skill)
  const addSpec = useCallback(
    (spec: string) => {
      const trimmed = spec.trim();
      if (!trimmed || isSpecDuplicate(trimmed) || selectedSpecs.length >= MAX_SPECS_PER_SKILL)
        return;
      setSelectedSpecs((prev) => [...prev, trimmed]);
    },
    [isSpecDuplicate, selectedSpecs.length]
  );

  // Remove a specialization
  const removeSpec = useCallback((spec: string) => {
    setSelectedSpecs((prev) => prev.filter((s) => s !== spec));
  }, []);

  // Handle custom spec submission
  const handleAddCustomSpec = useCallback(() => {
    const trimmed = customSpecInput.trim();
    if (trimmed && !isSpecDuplicate(trimmed)) {
      addSpec(trimmed);
      setCustomSpecInput("");
    }
  }, [customSpecInput, isSpecDuplicate, addSpec]);

  // Calculate cost
  // Specializations cost skill points during creation (1 each, max 1 per skill)
  const specSkillPointCost = selectedSpecs.length * SPEC_SKILL_POINT_COST;
  const skillPointCost = rating + specSkillPointCost;
  const skillKarmaCost = calculateSkillRaiseKarmaCost(0, rating); // Karma cost for skill rating only

  // Calculate karma cost for the next rating level (for disabling plus button)
  const nextLevelKarmaCost = calculateSkillRaiseKarmaCost(0, rating + 1);

  // Determine purchase mode
  // Skill points mode: have enough skill points for rating + specs
  const canAffordWithPoints = skillPointCost <= remainingPoints;
  // Karma mode: specs must still use skill points, only rating can use karma
  // So we need at least specSkillPointCost skill points, plus karma for rating
  const canAffordWithKarma =
    !canAffordWithPoints &&
    specSkillPointCost <= remainingPoints &&
    skillKarmaCost <= karmaRemaining;
  const usingKarma = !canAffordWithPoints && canAffordWithKarma;
  const canAfford = canAffordWithPoints || canAffordWithKarma;

  // Can we afford the next level?
  const canAffordNextWithKarma =
    !canAffordWithPoints &&
    specSkillPointCost <= remainingPoints &&
    nextLevelKarmaCost <= karmaRemaining;

  // Handle add skill
  const handleAddSkill = useCallback(() => {
    if (!selectedSkillId || !canAfford) return;
    // Pass karma cost if using karma for the skill rating
    const karmaSpent = usingKarma ? skillKarmaCost : undefined;
    onAdd(selectedSkillId, rating, selectedSpecs, karmaSpent);
    resetForNextSkill();
  }, [
    selectedSkillId,
    rating,
    selectedSpecs,
    canAfford,
    usingKarma,
    skillKarmaCost,
    onAdd,
    resetForNextSkill,
  ]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Skill" onClose={close} />

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Category Filter */}
            <div className="mt-3 flex flex-wrap gap-2">
              {SKILL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-blue-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Incompetent Group Warning */}
            {incompetentGroupName && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>Incompetent:</strong> Skills in the {incompetentGroupName} group are
                  unavailable.
                </span>
              </div>
            )}
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - Skill List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <div className="sticky top-0 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {category}
                    </div>
                    {skills.map((skill) => {
                      const isSelected = selectedSkillId === skill.id;
                      const isAlreadyAdded = existingSkillIds.includes(skill.id);
                      const isInGroup = skillsInGroups.has(skill.id);
                      const isIncompetent = incompetentSkills.has(skill.id);
                      const isDisabled = isAlreadyAdded || isIncompetent;

                      return (
                        <button
                          key={skill.id}
                          onClick={() => !isDisabled && setSelectedSkillId(skill.id)}
                          disabled={isDisabled}
                          className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : isIncompetent
                                ? "cursor-not-allowed bg-red-50 text-red-400 dark:bg-red-900/20 dark:text-red-500"
                                : isAlreadyAdded
                                  ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
                                  : "text-zinc-700 rounded-md hover:outline hover:outline-1 hover:outline-blue-400 dark:text-zinc-300 dark:hover:outline-blue-500"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={isAlreadyAdded ? "line-through" : ""}>
                              {skill.name}
                            </span>
                            <span className="text-xs text-zinc-400">
                              ({skill.linkedAttribute.toUpperCase().slice(0, 3)})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {isAlreadyAdded && <Check className="h-4 w-4 text-emerald-500" />}
                            {isIncompetent && (
                              <span className="flex items-center gap-0.5 text-[10px] text-red-500">
                                <AlertTriangle className="h-3 w-3" />
                                incompetent
                              </span>
                            )}
                            {isInGroup && !isAlreadyAdded && !isIncompetent && (
                              <span className="text-[10px] text-amber-500">in group</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
                {Object.keys(skillsByCategory).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">No skills found</div>
                )}
              </div>

              {/* Right Pane - Skill Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedSkill ? (
                  <div className="space-y-6">
                    {/* Skill Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedSkill.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                        <span>Linked: {selectedSkill.linkedAttribute}</span>
                        {skillGroupName && <span>Group: {skillGroupName}</span>}
                        <span>Default: {selectedSkill.canDefault ? "Yes" : "No"}</span>
                      </div>
                      {selectedSkill.description && (
                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                          {selectedSkill.description}
                        </p>
                      )}
                    </div>

                    {/* Rating Selection */}
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Starting Rating
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => setRating(Math.max(1, rating - 1))}
                          disabled={rating <= 1}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                            rating > 1
                              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div
                          className={`flex h-10 w-14 items-center justify-center rounded-lg text-xl font-bold ${
                            usingKarma
                              ? "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100"
                              : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                          }`}
                        >
                          {rating}
                        </div>
                        <button
                          onClick={() => setRating(Math.min(selectedSkillMaxRating, rating + 1))}
                          disabled={
                            rating >= selectedSkillMaxRating ||
                            (!canAffordWithPoints && !canAffordNextWithKarma)
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                            rating < selectedSkillMaxRating &&
                            (canAffordWithPoints || canAffordNextWithKarma)
                              ? usingKarma
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-zinc-400">
                          Max: {selectedSkillMaxRating}
                          {selectedSkillMaxRating > MAX_SKILL_RATING && (
                            <span className="ml-1 text-emerald-500">(Aptitude)</span>
                          )}
                        </span>
                      </div>
                      {/* Show karma cost breakdown when in karma mode */}
                      {usingKarma && (
                        <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-600 dark:text-zinc-400">
                              Karma Cost (rating)
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                              <Sparkles className="h-3.5 w-3.5" />
                              {skillKarmaCost} karma
                            </span>
                          </div>
                          {specSkillPointCost > 0 && (
                            <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 text-sm dark:border-zinc-700">
                              <span className="text-zinc-600 dark:text-zinc-400">
                                Skill Points (spec)
                              </span>
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                {specSkillPointCost} skill pt
                              </span>
                            </div>
                          )}
                          <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 text-sm dark:border-zinc-700">
                            <span className="text-zinc-600 dark:text-zinc-400">
                              Karma remaining
                            </span>
                            <span
                              className={`font-medium ${
                                karmaRemaining - skillKarmaCost < 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-zinc-900 dark:text-zinc-100"
                              }`}
                            >
                              {karmaRemaining - skillKarmaCost}
                            </span>
                          </div>
                          <p className="mt-2 border-t border-zinc-200 pt-2 text-center text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                            Cost formula: 2+4{rating > 2 ? "+6" : ""}
                            {rating > 3 ? "+8" : ""}
                            {rating > 4 ? "+10" : ""}
                            {rating > 5 ? "+12" : ""} = {skillKarmaCost} karma
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Specializations */}
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Specialization
                        <span className="ml-2 font-normal text-zinc-400">
                          ({SPEC_SKILL_POINT_COST} skill point, max {MAX_SPECS_PER_SKILL})
                        </span>
                      </label>

                      {/* Selected Specs */}
                      {selectedSpecs.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedSpecs.map((spec) => (
                            <span
                              key={spec}
                              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            >
                              {spec}
                              <button
                                onClick={() => removeSpec(spec)}
                                className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Suggested Specs */}
                      {selectedSkill.suggestedSpecializations &&
                        selectedSkill.suggestedSpecializations.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Suggestions
                            </div>
                            <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                              {selectedSkill.suggestedSpecializations.map((spec) => {
                                const isAdded = selectedSpecs.some(
                                  (s) => s.toLowerCase() === spec.toLowerCase()
                                );
                                const isAtMaxSpecs =
                                  selectedSpecs.length >= MAX_SPECS_PER_SKILL && !isAdded;
                                return (
                                  <button
                                    key={spec}
                                    onClick={() => (isAdded ? removeSpec(spec) : addSpec(spec))}
                                    disabled={isAtMaxSpecs}
                                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-sm transition-colors ${
                                      isAdded
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                        : isAtMaxSpecs
                                          ? "cursor-not-allowed text-zinc-400 dark:text-zinc-500"
                                          : "text-zinc-700 rounded-md hover:outline hover:outline-1 hover:outline-blue-400 dark:text-zinc-300 dark:hover:outline-blue-500"
                                    }`}
                                  >
                                    <span>{spec}</span>
                                    {isAdded && <Check className="h-4 w-4" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      {/* Custom Spec Input */}
                      <div className="mt-3">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Add Custom
                        </div>
                        <div className="mt-1 flex gap-2">
                          <input
                            type="text"
                            value={customSpecInput}
                            onChange={(e) => setCustomSpecInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              selectedSpecs.length < MAX_SPECS_PER_SKILL &&
                              handleAddCustomSpec()
                            }
                            placeholder={
                              selectedSpecs.length >= MAX_SPECS_PER_SKILL
                                ? "Maximum reached"
                                : "Type custom specialization..."
                            }
                            disabled={selectedSpecs.length >= MAX_SPECS_PER_SKILL}
                            className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-500"
                          />
                          <button
                            onClick={handleAddCustomSpec}
                            disabled={
                              !customSpecInput.trim() ||
                              isSpecDuplicate(customSpecInput) ||
                              selectedSpecs.length >= MAX_SPECS_PER_SKILL
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                              customSpecInput.trim() &&
                              !isSpecDuplicate(customSpecInput) &&
                              selectedSpecs.length < MAX_SPECS_PER_SKILL
                                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                            }`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {customSpecInput.trim() && isSpecDuplicate(customSpecInput) && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="h-3 w-3" />
                            Already added
                          </div>
                        )}
                      </div>

                      {/* Spec Info */}
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
                        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span>
                          Specializations provide +2 dice when applicable. Each costs{" "}
                          {SPEC_SKILL_POINT_COST} skill point during character creation. Maximum{" "}
                          {MAX_SPECS_PER_SKILL} per skill.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    <Search className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select a skill from the list</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {selectedSkill && (
                <>
                  Cost:{" "}
                  {usingKarma ? (
                    // Karma mode - skill rating uses karma, specs still use skill points
                    <>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                        {skillKarmaCost} karma
                      </span>
                      {specSkillPointCost > 0 && (
                        <>
                          {" + "}
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {specSkillPointCost} skill pt
                          </span>
                          <span className="text-zinc-400"> (spec)</span>
                        </>
                      )}
                    </>
                  ) : (
                    // Skill points mode - everything uses skill points
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {skillPointCost} skill point{skillPointCost !== 1 ? "s" : ""}
                      {specSkillPointCost > 0 && (
                        <span className="font-normal text-zinc-400">
                          {" "}
                          ({rating} rating + {specSkillPointCost} spec)
                        </span>
                      )}
                    </span>
                  )}
                  {/* Show karma mode indicator */}
                  {usingKarma && (
                    <span className="ml-2 text-xs text-amber-500">(skill points exhausted)</span>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Done
              </button>
              <button
                onClick={handleAddSkill}
                disabled={!selectedSkill || !canAfford}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSkill && canAfford
                    ? usingKarma
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                {usingKarma && <Sparkles className="h-4 w-4" />}
                Add Skill
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
