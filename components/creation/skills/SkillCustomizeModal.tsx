"use client";

/**
 * SkillCustomizeModal
 *
 * Modal for customizing a skill that belongs to a skill group using karma.
 * This triggers the group breaking flow.
 *
 * Features:
 * - Rating increase section with karma cost
 * - Specialization section with suggested and custom options
 * - Real-time karma cost calculation
 * - Budget validation
 */

import { useState, useCallback, useMemo } from "react";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import {
  calculateSkillRaiseKarmaCost,
  SPECIALIZATION_KARMA_COST,
} from "@/lib/rules/skills/group-utils";
import { Plus, Minus, Star, X, AlertTriangle, Sparkles } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

export interface SkillCustomizeChanges {
  /** New rating for the skill (if raising) */
  newRating?: number;
  /** Specializations being added */
  specializations?: string[];
  /** Total karma cost for all changes */
  karmaCost: number;
}

interface SkillCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when user confirms - this will trigger the break confirmation flow */
  onApply: (changes: SkillCustomizeChanges) => void;
  /** Skill being customized */
  skillId: string;
  skillName: string;
  /** Current rating (from group) */
  currentRating: number;
  /** Maximum rating allowed (6 during creation, 7 with Aptitude) */
  maxRating: number;
  /** Suggested specializations from skill data */
  suggestedSpecializations: string[];
  /** Available karma budget */
  availableKarma: number;
  /** Group context */
  groupId: string;
  groupName: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillCustomizeModal({
  isOpen,
  onClose,
  onApply,
  skillName,
  currentRating,
  maxRating,
  suggestedSpecializations,
  availableKarma,
  groupName,
}: SkillCustomizeModalProps) {
  // State
  const [targetRating, setTargetRating] = useState(currentRating);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [customSpecInput, setCustomSpecInput] = useState("");

  // Reset state when modal opens
  const handleClose = useCallback(() => {
    setTargetRating(currentRating);
    setSelectedSpecs([]);
    setCustomSpecInput("");
    onClose();
  }, [currentRating, onClose]);

  // Calculate karma costs
  const ratingKarmaCost = useMemo(() => {
    if (targetRating <= currentRating) return 0;
    return calculateSkillRaiseKarmaCost(currentRating, targetRating);
  }, [currentRating, targetRating]);

  const specKarmaCost = selectedSpecs.length * SPECIALIZATION_KARMA_COST;
  const totalKarmaCost = ratingKarmaCost + specKarmaCost;
  const isOverBudget = totalKarmaCost > availableKarma;

  // Check if any changes were made
  const hasChanges = targetRating > currentRating || selectedSpecs.length > 0;

  // Handle rating changes
  const handleRatingIncrease = useCallback(() => {
    if (targetRating < maxRating) {
      setTargetRating((r) => r + 1);
    }
  }, [targetRating, maxRating]);

  const handleRatingDecrease = useCallback(() => {
    if (targetRating > currentRating) {
      setTargetRating((r) => r - 1);
    }
  }, [targetRating, currentRating]);

  // Handle specialization selection
  const handleSpecToggle = useCallback((spec: string) => {
    setSelectedSpecs((current) =>
      current.includes(spec) ? current.filter((s) => s !== spec) : [...current, spec]
    );
  }, []);

  const handleAddCustomSpec = useCallback(() => {
    const trimmed = customSpecInput.trim();
    if (trimmed && !selectedSpecs.includes(trimmed)) {
      setSelectedSpecs((current) => [...current, trimmed]);
      setCustomSpecInput("");
    }
  }, [customSpecInput, selectedSpecs]);

  const handleRemoveSpec = useCallback((spec: string) => {
    setSelectedSpecs((current) => current.filter((s) => s !== spec));
  }, []);

  // Handle apply
  const handleApply = useCallback(() => {
    if (!hasChanges || isOverBudget) return;

    const changes: SkillCustomizeChanges = {
      karmaCost: totalKarmaCost,
    };

    if (targetRating > currentRating) {
      changes.newRating = targetRating;
    }

    if (selectedSpecs.length > 0) {
      changes.specializations = selectedSpecs;
    }

    onApply(changes);
  }, [
    hasChanges,
    isOverBudget,
    targetRating,
    currentRating,
    selectedSpecs,
    totalKarmaCost,
    onApply,
  ]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="md">
      {({ close }) => (
        <>
          <ModalHeader title={`Customize ${skillName}`} onClose={close} showCloseButton>
            <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {groupName}
            </span>
          </ModalHeader>

          <ModalBody className="p-6">
            <div className="space-y-5">
              {/* Warning about breaking */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Customizing this skill will <strong>break the {groupName} skill group</strong>.
                    All group skills will become individual skills at rating {currentRating}.
                  </p>
                </div>
              </div>

              {/* Rating Section */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Increase Rating
                  <span className="text-xs font-normal text-zinc-500">
                    (Current: {currentRating}, Max: {maxRating})
                  </span>
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRatingDecrease}
                    disabled={targetRating <= currentRating}
                    className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                      targetRating > currentRating
                        ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                        : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {targetRating}
                    </span>
                    {targetRating > currentRating && (
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">
                        (+{targetRating - currentRating})
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleRatingIncrease}
                    disabled={targetRating >= maxRating}
                    className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                      targetRating < maxRating
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  {ratingKarmaCost > 0 && (
                    <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
                      = {ratingKarmaCost} karma
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Cost: New Rating x 2 karma per level
                </p>
              </div>

              {/* Specializations Section */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <Star className="h-4 w-4 text-amber-500" />
                  Add Specializations
                  <span className="text-xs font-normal text-zinc-500">
                    ({SPECIALIZATION_KARMA_COST} karma each)
                  </span>
                </h3>

                {/* Selected specializations */}
                {selectedSpecs.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {selectedSpecs.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      >
                        {spec}
                        <button
                          onClick={() => handleRemoveSpec(spec)}
                          className="rounded-full hover:bg-amber-200 dark:hover:bg-amber-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested specializations */}
                {suggestedSpecializations.length > 0 && (
                  <div className="mb-2">
                    <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">Suggested:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedSpecializations.map((spec) => (
                        <button
                          key={spec}
                          onClick={() => handleSpecToggle(spec)}
                          disabled={selectedSpecs.includes(spec)}
                          className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                            selectedSpecs.includes(spec)
                              ? "cursor-not-allowed bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom specialization input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSpecInput}
                    onChange={(e) => setCustomSpecInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCustomSpec()}
                    placeholder="Add custom specialization..."
                    className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                  />
                  <button
                    onClick={handleAddCustomSpec}
                    disabled={!customSpecInput.trim()}
                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      customSpecInput.trim()
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Cost Summary
                </h4>
                <div className="space-y-1 text-sm">
                  {ratingKarmaCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Rating {currentRating} → {targetRating}
                      </span>
                      <span className="text-zinc-900 dark:text-zinc-100">
                        {ratingKarmaCost} karma
                      </span>
                    </div>
                  )}
                  {specKarmaCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {selectedSpecs.length} specialization{selectedSpecs.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-zinc-900 dark:text-zinc-100">
                        {specKarmaCost} karma
                      </span>
                    </div>
                  )}
                  <div className="mt-2 flex justify-between border-t border-zinc-300 pt-2 dark:border-zinc-600">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Total</span>
                    <span
                      className={`font-bold ${
                        isOverBudget
                          ? "text-red-600 dark:text-red-400"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {totalKarmaCost} karma
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">Available</span>
                    <span
                      className={
                        isOverBudget
                          ? "text-red-600 dark:text-red-400"
                          : "text-zinc-600 dark:text-zinc-400"
                      }
                    >
                      {availableKarma} karma
                    </span>
                  </div>
                </div>
                {isOverBudget && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    Not enough karma available for these changes.
                  </p>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!hasChanges || isOverBudget}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  hasChanges && !isOverBudget
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "cursor-not-allowed bg-zinc-300 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-500"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Continue
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
