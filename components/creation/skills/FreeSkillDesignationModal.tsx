"use client";

/**
 * FreeSkillDesignationModal
 *
 * Modal for selecting which skills should receive free allocation
 * from magic priority. Shows eligible skills based on the free skill
 * type (magical, resonance, or any for active).
 *
 * Features:
 * - Filter to show only eligible skills
 * - Current rating display for each skill
 * - Checkbox selection for designation
 * - "X slots remaining" indicator
 * - Warns about skills below free rating
 */

import { useMemo, useState, useCallback } from "react";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Check, AlertTriangle, Gift } from "lucide-react";
import type { SkillData } from "@/lib/rules";
import { canDesignateForFreeSkill } from "@/lib/rules/skills/free-skills";

// =============================================================================
// TYPES
// =============================================================================

interface FreeSkillDesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when user confirms designation changes */
  onConfirm: (selectedSkillIds: string[]) => void;
  /** The free skill type being designated (magical, resonance, active) */
  freeSkillType: string;
  /** Human-readable label for the type */
  typeLabel: string;
  /** The free rating granted */
  freeRating: number;
  /** Total slots available for this type */
  totalSlots: number;
  /** Currently designated skill IDs for this type */
  currentDesignations: string[];
  /** All active skills from ruleset */
  availableSkills: SkillData[];
  /** Map of skill ID to category */
  skillCategories: Record<string, string | undefined>;
  /** Current skill ratings (to show which skills are purchased) */
  currentSkillRatings: Record<string, number>;
  /** Whether character has magic (for filtering magical skills) */
  hasMagic: boolean;
  /** Whether character has resonance (for filtering resonance skills) */
  hasResonance: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FreeSkillDesignationModal({
  isOpen,
  onClose,
  onConfirm,
  freeSkillType,
  typeLabel,
  freeRating,
  totalSlots,
  currentDesignations,
  availableSkills,
  skillCategories,
  currentSkillRatings,
  hasMagic,
  hasResonance,
}: FreeSkillDesignationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(currentDesignations);

  // Reset when modal opens
  const handleClose = useCallback(() => {
    setSearchQuery("");
    setSelectedIds(currentDesignations);
    onClose();
  }, [currentDesignations, onClose]);

  // Filter skills to show only eligible ones
  const eligibleSkills = useMemo(() => {
    return availableSkills.filter((skill) => {
      // Filter by magic/resonance requirements
      if (skill.requiresMagic && !hasMagic) return false;
      if (skill.requiresResonance && !hasResonance) return false;

      // Check if skill qualifies for this free skill type
      const category = skillCategories[skill.id];
      const { canDesignate } = canDesignateForFreeSkill(
        skill.id,
        category,
        freeSkillType,
        [], // Empty array - we check duplicates separately
        totalSlots
      );

      // For "active" type, all skills qualify
      // For "magical" or "resonance", check the category
      if (freeSkillType === "active") return true;
      if (freeSkillType === "magical" && category === "magical") return true;
      if (freeSkillType === "resonance" && category === "resonance") return true;

      return canDesignate && category === freeSkillType;
    });
  }, [availableSkills, freeSkillType, hasMagic, hasResonance, skillCategories, totalSlots]);

  // Apply search filter
  const filteredSkills = useMemo(() => {
    if (!searchQuery) return eligibleSkills;

    const query = searchQuery.toLowerCase();
    return eligibleSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(query) ||
        skill.linkedAttribute.toLowerCase().includes(query)
    );
  }, [eligibleSkills, searchQuery]);

  // Sort skills: selected first, then by rating (descending), then alphabetically
  const sortedSkills = useMemo(() => {
    return [...filteredSkills].sort((a, b) => {
      const aSelected = selectedIds.includes(a.id);
      const bSelected = selectedIds.includes(b.id);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      const aRating = currentSkillRatings[a.id] || 0;
      const bRating = currentSkillRatings[b.id] || 0;

      if (aRating !== bRating) return bRating - aRating;

      return a.name.localeCompare(b.name);
    });
  }, [filteredSkills, selectedIds, currentSkillRatings]);

  // Toggle skill selection
  const toggleSkill = useCallback(
    (skillId: string) => {
      setSelectedIds((prev) => {
        if (prev.includes(skillId)) {
          return prev.filter((id) => id !== skillId);
        }
        if (prev.length >= totalSlots) {
          return prev; // Can't add more
        }
        return [...prev, skillId];
      });
    },
    [totalSlots]
  );

  // Handle confirm
  const handleConfirm = useCallback(() => {
    onConfirm(selectedIds);
    setSearchQuery("");
    onClose();
  }, [selectedIds, onConfirm, onClose]);

  const slotsRemaining = totalSlots - selectedIds.length;
  const hasChanges =
    selectedIds.length !== currentDesignations.length ||
    selectedIds.some((id) => !currentDesignations.includes(id));

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="md">
      {({ close }) => (
        <>
          <ModalHeader title={`Designate Free ${typeLabel}`} onClose={close} />

          {/* Info banner */}
          <div className="border-b border-zinc-200 bg-indigo-50 px-6 py-3 dark:border-zinc-700 dark:bg-indigo-900/20">
            <div className="text-sm text-indigo-700 dark:text-indigo-300">
              Select {totalSlots} skill{totalSlots !== 1 ? "s" : ""} to receive{" "}
              <strong>Rating {freeRating} free</strong>. These skills won't cost skill points for
              the first {freeRating} rating points.
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-indigo-600 dark:text-indigo-400">
                {selectedIds.length} of {totalSlots} designated
              </span>
              {slotsRemaining > 0 && (
                <span className="rounded bg-indigo-200 px-2 py-0.5 font-medium text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300">
                  {slotsRemaining} slot{slotsRemaining !== 1 ? "s" : ""} remaining
                </span>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={`Search ${typeLabel}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <ModalBody scrollable className="max-h-96">
            {sortedSkills.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                {searchQuery
                  ? `No ${typeLabel} match "${searchQuery}"`
                  : `No eligible ${typeLabel} available`}
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {sortedSkills.map((skill) => {
                  const isSelected = selectedIds.includes(skill.id);
                  const currentRating = currentSkillRatings[skill.id] || 0;
                  const isBelowFreeRating = isSelected && currentRating < freeRating;
                  const isAtFreeRating = currentRating >= freeRating;
                  const canSelect = isSelected || selectedIds.length < totalSlots;

                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      disabled={!canSelect}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-900/30"
                          : canSelect
                            ? "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Checkbox indicator */}
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500"
                              : "border-zinc-300 dark:border-zinc-600"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              {skill.name}
                            </span>
                            <span className="text-xs text-zinc-400">
                              ({skill.linkedAttribute.toUpperCase().slice(0, 3)})
                            </span>
                          </div>
                          {skill.description && (
                            <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                              {skill.description.slice(0, 60)}
                              {skill.description.length > 60 ? "..." : ""}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Current rating badge */}
                        {currentRating > 0 ? (
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                              isAtFreeRating
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            Rating {currentRating}
                          </span>
                        ) : (
                          <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                            Not purchased
                          </span>
                        )}

                        {/* Warning for below free rating */}
                        {isBelowFreeRating && (
                          <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="h-3 w-3" />
                            Below free
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {selectedIds.length > 0 && (
                <span>
                  <strong>{selectedIds.length}</strong> skill
                  {selectedIds.length !== 1 ? "s" : ""} selected
                </span>
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
                onClick={handleConfirm}
                disabled={!hasChanges}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  hasChanges
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Confirm Selection
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
