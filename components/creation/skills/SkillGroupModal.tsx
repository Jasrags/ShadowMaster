"use client";

/**
 * SkillGroupModal
 *
 * Modal for adding skill groups with:
 * - Search functionality
 * - Category filter pills
 * - Split-pane design (list left, details right)
 * - Rating selection
 * - Shows skills in the group
 *
 * Uses BaseModal for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import { useSkills } from "@/lib/rules";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Plus, Minus, Check, Users, AlertTriangle } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_GROUP_RATING = 6;

const GROUP_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "combat", label: "Combat" },
  { id: "physical", label: "Physical" },
  { id: "social", label: "Social" },
  { id: "technical", label: "Technical" },
  { id: "magical", label: "Magic" },
  { id: "resonance", label: "Resonance" },
] as const;

type GroupCategory = (typeof GROUP_CATEGORIES)[number]["id"];

// Map skill group IDs to categories
const GROUP_CATEGORY_MAP: Record<string, GroupCategory> = {
  // Combat
  firearms: "combat",
  "close-combat": "combat",
  // Physical
  athletics: "physical",
  stealth: "physical",
  outdoors: "physical",
  // Social
  acting: "social",
  influence: "social",
  // Technical
  engineering: "technical",
  electronics: "technical",
  biotech: "technical",
  cracking: "technical",
  // Magic
  sorcery: "magical",
  conjuring: "magical",
  enchanting: "magical",
  // Resonance
  tasking: "resonance",
};

// Category display names for headers
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  combat: "COMBAT",
  physical: "PHYSICAL",
  social: "SOCIAL",
  technical: "TECHNICAL",
  magical: "MAGIC",
  resonance: "RESONANCE",
  other: "OTHER",
};

// =============================================================================
// TYPES
// =============================================================================

interface SkillGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (groupId: string, rating: number) => void;
  existingGroupIds: string[];
  existingSkillIds: string[];
  hasMagic: boolean;
  hasResonance: boolean;
  remainingGroupPoints: number;
  incompetentGroupId?: string; // Skill group the character is incompetent in
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillGroupModal({
  isOpen,
  onClose,
  onAdd,
  existingGroupIds,
  existingSkillIds,
  hasMagic,
  hasResonance,
  remainingGroupPoints,
  incompetentGroupId,
}: SkillGroupModalProps) {
  const { skillGroups, activeSkills } = useSkills();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GroupCategory>("all");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [rating, setRating] = useState(1);

  // Reset state when modal opens/closes
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedGroupId(null);
    setRating(1);
  }, []);

  // Filter available groups
  const filteredGroups = useMemo(() => {
    return skillGroups.filter((group) => {
      // Filter magic/resonance groups based on character capabilities
      if (["sorcery", "conjuring", "enchanting"].includes(group.id) && !hasMagic) {
        return false;
      }
      if (group.id === "tasking" && !hasResonance) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== "all") {
        const groupCat = GROUP_CATEGORY_MAP[group.id] || "other";
        if (groupCat !== selectedCategory) return false;
      }

      // Filter by search
      if (searchQuery) {
        return group.name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }, [skillGroups, hasMagic, hasResonance, selectedCategory, searchQuery]);

  // Group by category for display with sticky headers
  const groupsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredGroups> = {};
    filteredGroups.forEach((group) => {
      const cat = GROUP_CATEGORY_MAP[group.id] || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(group);
    });
    // Sort groups within each category
    Object.values(grouped).forEach((groups) => {
      groups.sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredGroups]);

  // Get selected group data
  const selectedGroup = useMemo(() => {
    if (!selectedGroupId) return null;
    return skillGroups.find((g) => g.id === selectedGroupId) || null;
  }, [skillGroups, selectedGroupId]);

  // Get skills in the selected group
  const groupSkills = useMemo(() => {
    if (!selectedGroup) return [];
    return activeSkills.filter((s) => selectedGroup.skills.includes(s.id));
  }, [selectedGroup, activeSkills]);

  // Check if any skills in group are already individually allocated
  const conflictingSkills = useMemo(() => {
    if (!selectedGroup) return [];
    return selectedGroup.skills.filter((skillId) => existingSkillIds.includes(skillId));
  }, [selectedGroup, existingSkillIds]);

  // Calculate cost
  const groupCost = rating;
  const canAfford = groupCost <= remainingGroupPoints;
  const hasConflicts = conflictingSkills.length > 0;

  // Handle add group
  const handleAddGroup = useCallback(() => {
    if (!selectedGroupId || !canAfford || hasConflicts) return;
    onAdd(selectedGroupId, rating);
    resetState();
    onClose();
  }, [selectedGroupId, rating, canAfford, hasConflicts, onAdd, resetState, onClose]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="2xl" className="max-w-3xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Skill Group" onClose={close} />

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search skill groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              {GROUP_CATEGORIES.map((cat) => (
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
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - Group List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {Object.entries(groupsByCategory).map(([category, groups]) => (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="sticky top-0 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {CATEGORY_DISPLAY_NAMES[category] || category.toUpperCase()}
                    </div>

                    {/* Groups in category */}
                    {groups.map((group) => {
                      const isSelected = selectedGroupId === group.id;
                      const isAlreadyAdded = existingGroupIds.includes(group.id);
                      const isIncompetent = group.id === incompetentGroupId;
                      const isDisabled = isAlreadyAdded || isIncompetent;

                      return (
                        <button
                          key={group.id}
                          onClick={() => !isDisabled && setSelectedGroupId(group.id)}
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
                              {group.name}
                            </span>
                            <span className="text-xs text-zinc-400">
                              ({group.skills.length} skills)
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
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
                {Object.keys(groupsByCategory).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">No skill groups found</div>
                )}
              </div>

              {/* Right Pane - Group Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedGroup ? (
                  <div className="space-y-6">
                    {/* Group Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedGroup.name}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Adding this group sets all skills to the same rating. More efficient than
                        buying skills individually.
                      </p>
                    </div>

                    {/* Skills in Group */}
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Skills in Group
                      </label>
                      <div className="mt-2 space-y-1">
                        {groupSkills.map((skill) => {
                          const hasConflict = existingSkillIds.includes(skill.id);
                          return (
                            <div
                              key={skill.id}
                              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                                hasConflict
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
                                  : "bg-zinc-50 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300"
                              }`}
                            >
                              <span>{skill.name}</span>
                              <span className="text-xs text-zinc-400">
                                {skill.linkedAttribute.toUpperCase().slice(0, 3)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Conflict Warning */}
                    {hasConflicts && (
                      <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                        <strong>Warning:</strong> You already have individual ratings for{" "}
                        {conflictingSkills.length} skill{conflictingSkills.length !== 1 ? "s" : ""}{" "}
                        in this group. Remove them first to add the group.
                      </div>
                    )}

                    {/* Rating Selection */}
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Group Rating
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
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-zinc-100 text-xl font-mono font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                          {rating}
                        </div>
                        <button
                          onClick={() => setRating(Math.min(MAX_GROUP_RATING, rating + 1))}
                          disabled={rating >= MAX_GROUP_RATING}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                            rating < MAX_GROUP_RATING
                              ? "bg-purple-500 text-white hover:bg-purple-600"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-zinc-400">Max: {MAX_GROUP_RATING}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    <Users className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select a skill group from the list</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {selectedGroup && (
                <>
                  Cost:{" "}
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {groupCost} group point{groupCost !== 1 ? "s" : ""}
                  </span>
                  <span className="ml-2 text-zinc-400">
                    ({groupSkills.length} skills at rating {rating})
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGroup}
                disabled={!selectedGroup || !canAfford || hasConflicts}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedGroup && canAfford && !hasConflicts
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add Skill Group
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
