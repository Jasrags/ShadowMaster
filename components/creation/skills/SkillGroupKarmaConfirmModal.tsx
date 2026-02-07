"use client";

/**
 * SkillGroupKarmaConfirmModal
 *
 * Confirmation modal for purchasing skill group points with karma when group points
 * budget is exhausted. Shows the karma cost and remaining karma after purchase.
 *
 * Features:
 * - Purple/amber-themed styling to indicate karma spending for groups
 * - Shows group name, current -> new rating
 * - Displays karma cost and remaining karma after purchase
 * - Confirm/Cancel actions
 */

import { BaseModalRoot, ModalBody, ModalFooter } from "@/components/ui";
import { Sparkles, ArrowRight, X, Users } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

export interface SkillGroupKarmaConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  skillCount: number;
  currentRating: number;
  newRating: number;
  karmaCost: number;
  karmaRemaining: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillGroupKarmaConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  skillCount,
  currentRating,
  newRating,
  karmaCost,
  karmaRemaining,
}: SkillGroupKarmaConfirmModalProps) {
  const karmaAfterPurchase = karmaRemaining - karmaCost;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={onClose} size="sm">
      {({ close }) => (
        <>
          {/* Custom amber/purple-themed header */}
          <div className="flex items-center justify-between border-b border-purple-200 bg-purple-50 px-6 py-4 dark:border-purple-800 dark:bg-purple-900/20">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                Purchase Group with Karma
              </h2>
            </div>
            <button
              onClick={close}
              aria-label="Close modal"
              className="rounded-lg p-2 text-purple-400 transition-colors hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-800 dark:hover:text-purple-300"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <ModalBody className="p-5">
            <div className="space-y-4">
              {/* Group info */}
              <div className="text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Increase skill group rating using karma
                </p>
                <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {groupName}
                </h3>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {skillCount} skills in group
                </p>
              </div>

              {/* Rating change display */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-xl font-mono font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {currentRating}
                </div>
                <ArrowRight className="h-5 w-5 text-amber-500" />
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-xl font-mono font-bold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                  {newRating}
                </div>
              </div>

              {/* Karma cost breakdown */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Karma Cost</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    {karmaCost} karma
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 text-sm dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400">Remaining after purchase</span>
                  <span
                    className={`font-medium ${
                      karmaAfterPurchase < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {karmaAfterPurchase} karma
                  </span>
                </div>
              </div>

              {/* Formula note */}
              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                Cost formula: New Rating x 5 = {newRating} x 5 = {karmaCost} karma
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-end gap-2">
              <button
                onClick={close}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  close();
                }}
                disabled={karmaAfterPurchase < 0}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  karmaAfterPurchase >= 0
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "cursor-not-allowed bg-zinc-300 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-500"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Purchase for {karmaCost} Karma
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
