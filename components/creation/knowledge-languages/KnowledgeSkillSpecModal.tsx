"use client";

/**
 * KnowledgeSkillSpecModal
 *
 * Modal for adding a specialization to a knowledge skill.
 * Knowledge skills are freeform, so only custom input is supported
 * (no suggested specializations list).
 *
 * Features:
 * - Custom specialization input only
 * - Cost display (1 knowledge point)
 * - Available points indicator
 * - Amber styling consistent with knowledge skills
 */

import { useState, useCallback } from "react";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Plus, Star, X } from "lucide-react";
import { SPEC_KNOWLEDGE_POINT_COST } from "./constants";
import type { KnowledgeSkillSpecModalProps } from "./types";

export function KnowledgeSkillSpecModal({
  isOpen,
  onClose,
  onAdd,
  skillName,
  pointsRemaining,
}: KnowledgeSkillSpecModalProps) {
  const [customSpecInput, setCustomSpecInput] = useState("");

  const canAfford = pointsRemaining >= SPEC_KNOWLEDGE_POINT_COST;

  // Reset state when modal closes
  const handleClose = useCallback(() => {
    setCustomSpecInput("");
    onClose();
  }, [onClose]);

  // Handle add button click
  const handleAdd = useCallback(() => {
    const specToAdd = customSpecInput.trim();
    if (specToAdd && canAfford) {
      onAdd(specToAdd);
      handleClose();
    }
  }, [customSpecInput, canAfford, onAdd, handleClose]);

  const hasSelection = customSpecInput.trim().length > 0;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="sm">
      {({ close }) => (
        <>
          <ModalHeader
            title={`Add Specialization - ${skillName}`}
            onClose={close}
            showCloseButton
          />

          <ModalBody className="p-4">
            <div className="space-y-4">
              {/* Budget warning if can't afford */}
              {!canAfford && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                  No knowledge points available. Need {SPEC_KNOWLEDGE_POINT_COST} knowledge point.
                </div>
              )}

              {/* Custom specialization input */}
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Enter specialization
                </p>
                <input
                  type="text"
                  value={customSpecInput}
                  onChange={(e) => setCustomSpecInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && hasSelection && canAfford && handleAdd()}
                  placeholder="Enter specialization..."
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
                    {customSpecInput.trim()}
                    <button
                      onClick={() => setCustomSpecInput("")}
                      className="ml-0.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                </div>
              )}

              {/* Cost display */}
              <div className="rounded-lg bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Cost</span>
                  <span
                    className={
                      canAfford
                        ? "font-medium text-zinc-900 dark:text-zinc-100"
                        : "font-medium text-red-600 dark:text-red-400"
                    }
                  >
                    {SPEC_KNOWLEDGE_POINT_COST} knowledge point
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500 dark:text-zinc-400">Available</span>
                  <span
                    className={
                      canAfford
                        ? "text-zinc-500 dark:text-zinc-400"
                        : "text-red-500 dark:text-red-400"
                    }
                  >
                    {pointsRemaining} pts
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
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
