"use client";

/**
 * SkillSpecModal
 *
 * Simple modal for adding a specialization to an individual skill.
 * Unlike SkillCustomizeModal (which handles group breaking), this is
 * focused only on specialization for skills already added individually.
 *
 * Features:
 * - Skill name display
 * - Suggested specializations list
 * - Custom specialization input
 * - Cost display (1 skill point OR 7 karma when skill points exhausted)
 * - Amber styling for karma mode
 */

import { useState, useCallback } from "react";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Plus, Star, X, Sparkles } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const SPEC_SKILL_POINT_COST = 1;
const SPEC_KARMA_COST = 7;

// =============================================================================
// TYPES
// =============================================================================

/**
 * Purchase mode for specializations:
 * - 'skill-points': Use skill points (normal mode)
 * - 'karma': Use karma when skill points exhausted
 * - 'disabled': Cannot afford either
 */
type SpecPurchaseMode = "skill-points" | "karma" | "disabled";

interface SkillSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when adding a spec. karmaSpent is set if purchased with karma. */
  onAdd: (spec: string, karmaSpent?: number) => void;
  skillName: string;
  suggestedSpecializations: string[];
  availableSkillPoints: number;
  /** Available karma for purchasing specialization when skill points exhausted */
  availableKarma?: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillSpecModal({
  isOpen,
  onClose,
  onAdd,
  skillName,
  suggestedSpecializations,
  availableSkillPoints,
  availableKarma = 0,
}: SkillSpecModalProps) {
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [customSpecInput, setCustomSpecInput] = useState("");

  // Determine purchase mode
  const purchaseMode: SpecPurchaseMode =
    availableSkillPoints >= SPEC_SKILL_POINT_COST
      ? "skill-points"
      : availableKarma >= SPEC_KARMA_COST
        ? "karma"
        : "disabled";

  const canAfford = purchaseMode !== "disabled";
  const isKarmaMode = purchaseMode === "karma";

  // Reset state when modal closes
  const handleClose = useCallback(() => {
    setSelectedSpec(null);
    setCustomSpecInput("");
    onClose();
  }, [onClose]);

  // Handle selecting a suggested specialization
  const handleSelectSuggested = useCallback((spec: string) => {
    setSelectedSpec(spec);
    setCustomSpecInput("");
  }, []);

  // Handle custom spec input change
  const handleCustomInputChange = useCallback((value: string) => {
    setCustomSpecInput(value);
    if (value.trim()) {
      setSelectedSpec(null); // Clear selected suggestion when typing custom
    }
  }, []);

  // Handle add button click
  const handleAdd = useCallback(() => {
    const specToAdd = customSpecInput.trim() || selectedSpec;
    if (specToAdd && canAfford) {
      // Pass karma cost if in karma mode
      onAdd(specToAdd, isKarmaMode ? SPEC_KARMA_COST : undefined);
      handleClose();
    }
  }, [customSpecInput, selectedSpec, canAfford, isKarmaMode, onAdd, handleClose]);

  const hasSelection = selectedSpec || customSpecInput.trim();

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="sm">
      {({ close }) => (
        <>
          <ModalHeader title={`Add Specialization - ${skillName}`} onClose={close} showCloseButton />

          <ModalBody className="p-4">
            <div className="space-y-4">
              {/* Budget warning if can't afford */}
              {purchaseMode === "disabled" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                  No skill points available. Need {SPEC_SKILL_POINT_COST} skill point or{" "}
                  {SPEC_KARMA_COST} karma.
                </div>
              )}

              {/* Karma mode notice */}
              {isKarmaMode && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>
                    No skill points available. Using <strong>{SPEC_KARMA_COST} karma</strong>{" "}
                    instead.
                  </span>
                </div>
              )}

              {/* Suggested specializations */}
              {suggestedSpecializations.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Suggested Specializations
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedSpecializations.map((spec) => {
                      const isSelected = selectedSpec === spec;
                      return (
                        <button
                          key={spec}
                          onClick={() => handleSelectSuggested(spec)}
                          disabled={!canAfford}
                          className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                            isSelected
                              ? "bg-amber-500 text-white"
                              : canAfford
                                ? "bg-zinc-100 text-zinc-700 hover:bg-amber-100 hover:text-amber-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-amber-900/30 dark:hover:text-amber-300"
                                : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                          }`}
                        >
                          {spec}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom specialization input */}
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Or enter custom
                </p>
                <input
                  type="text"
                  value={customSpecInput}
                  onChange={(e) => handleCustomInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && hasSelection && canAfford && handleAdd()}
                  placeholder="Custom specialization..."
                  disabled={!canAfford}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-500"
                />
              </div>

              {/* Selected preview */}
              {hasSelection && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Selected:</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    <Star className="h-3 w-3" />
                    {customSpecInput.trim() || selectedSpec}
                    <button
                      onClick={() => {
                        setSelectedSpec(null);
                        setCustomSpecInput("");
                      }}
                      className="ml-0.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                </div>
              )}

              {/* Cost display */}
              <div
                className={`rounded-lg p-2 text-xs ${
                  isKarmaMode
                    ? "bg-amber-50 dark:bg-amber-900/20"
                    : "bg-zinc-100 dark:bg-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      isKarmaMode
                        ? "text-amber-700 dark:text-amber-300"
                        : "text-zinc-600 dark:text-zinc-400"
                    }
                  >
                    Cost
                  </span>
                  <span
                    className={
                      canAfford
                        ? isKarmaMode
                          ? "flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400"
                          : "font-medium text-zinc-900 dark:text-zinc-100"
                        : "font-medium text-red-600 dark:text-red-400"
                    }
                  >
                    {isKarmaMode ? (
                      <>
                        <Sparkles className="h-3 w-3" />
                        {SPEC_KARMA_COST} karma
                      </>
                    ) : (
                      <>{SPEC_SKILL_POINT_COST} skill point</>
                    )}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span
                    className={
                      isKarmaMode
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-zinc-500 dark:text-zinc-400"
                    }
                  >
                    Available
                  </span>
                  <span
                    className={
                      canAfford
                        ? isKarmaMode
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-zinc-500 dark:text-zinc-400"
                        : "text-red-500 dark:text-red-400"
                    }
                  >
                    {isKarmaMode
                      ? `${availableKarma} karma`
                      : `${availableSkillPoints} skill points`}
                  </span>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!hasSelection || !canAfford}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  hasSelection && canAfford
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "cursor-not-allowed bg-zinc-300 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-500"
                }`}
              >
                {isKarmaMode ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Add ({SPEC_KARMA_COST} Karma)
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </>
                )}
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
