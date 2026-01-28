"use client";

/**
 * ContactKarmaConfirmModal
 *
 * Confirmation modal for spending general karma on contacts when the free
 * contact points pool (CHA × 3) is exceeded. Shows the contact details,
 * karma cost, and remaining karma after purchase.
 *
 * Features:
 * - Amber-themed styling to indicate karma spending
 * - Shows contact name, connection, and loyalty ratings
 * - Displays karma cost and remaining karma after purchase
 * - Confirm/Cancel actions
 */

import { BaseModalRoot, ModalBody, ModalFooter } from "@/components/ui";
import { Sparkles, User, X } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

export interface ContactKarmaConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contactName: string;
  connection: number;
  loyalty: number;
  /** Total karma cost for this contact (connection + loyalty) */
  contactKarmaCost: number;
  /** Amount of karma that will come from general karma pool */
  karmaFromGeneral: number;
  /** Current remaining general karma before this purchase */
  karmaRemaining: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ContactKarmaConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  contactName,
  connection,
  loyalty,
  contactKarmaCost,
  karmaFromGeneral,
  karmaRemaining,
}: ContactKarmaConfirmModalProps) {
  const karmaAfterPurchase = karmaRemaining - karmaFromGeneral;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={onClose} size="sm">
      {({ close }) => (
        <>
          {/* Custom amber-themed header */}
          <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-6 py-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                Spend Karma on Contact
              </h2>
            </div>
            <button
              onClick={close}
              aria-label="Close modal"
              className="rounded-lg p-2 text-amber-400 transition-colors hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-800 dark:hover:text-amber-300"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <ModalBody className="p-5">
            <div className="space-y-4">
              {/* Contact info */}
              <div className="text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  This contact exceeds your free contact points
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <User className="h-5 w-5 text-zinc-500" />
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {contactName || "New Contact"}
                  </h3>
                </div>
              </div>

              {/* Connection and Loyalty display */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Connection</span>
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    {connection}
                  </div>
                </div>
                <span className="text-xl text-zinc-300 dark:text-zinc-600">+</span>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Loyalty</span>
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-lg font-bold text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                    {loyalty}
                  </div>
                </div>
                <span className="text-xl text-zinc-300 dark:text-zinc-600">=</span>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Total</span>
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-lg font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {contactKarmaCost}
                  </div>
                </div>
              </div>

              {/* Karma cost breakdown */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">General Karma Required</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    {karmaFromGeneral} karma
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

              {/* Explanation note */}
              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                Free contact points = Charisma × 3. Any excess costs 1 general karma per point.
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
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Spend {karmaFromGeneral} Karma
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
