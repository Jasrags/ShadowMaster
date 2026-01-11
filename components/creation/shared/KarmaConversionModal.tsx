"use client";

/**
 * KarmaConversionModal
 *
 * Confirmation modal shown when a user tries to purchase an item
 * they can't afford with current nuyen, but could afford by
 * converting karma to nuyen.
 *
 * Uses React Aria for accessibility.
 */

import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { X, AlertCircle, ArrowRight } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const KARMA_TO_NUYEN_RATE = 2000;

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// =============================================================================
// TYPES
// =============================================================================

export interface KarmaConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemCost: number;
  currentRemaining: number;
  karmaToConvert: number;
  karmaAvailable: number;
  currentKarmaConversion: number;
  maxKarmaConversion: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function KarmaConversionModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemCost,
  currentRemaining,
  karmaToConvert,
  karmaAvailable,
  currentKarmaConversion,
  maxKarmaConversion,
}: KarmaConversionModalProps) {
  const shortfall = itemCost - currentRemaining;
  const nuyenGained = karmaToConvert * KARMA_TO_NUYEN_RATE;
  const karmaAfterConversion = karmaAvailable - karmaToConvert;
  const newTotalConversion = currentKarmaConversion + karmaToConvert;
  const isAtMaxConversion = currentKarmaConversion >= maxKarmaConversion;
  const wouldExceedMax = newTotalConversion > maxKarmaConversion;

  // Calculate if conversion is possible
  const canConvert =
    karmaToConvert > 0 && karmaToConvert <= karmaAvailable && !wouldExceedMax && !isAtMaxConversion;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
    >
      <Modal className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        <Dialog className="outline-none">
          {({ close }) => (
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
                <Heading
                  slot="title"
                  className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  Convert Karma to Nuyen?
                </Heading>
                <button
                  onClick={close}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4 p-6">
                {/* Item info */}
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    You don&apos;t have enough nuyen to purchase:
                  </p>
                  <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{itemName}</div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Cost: {formatCurrency(itemCost)}¥
                    </div>
                  </div>
                </div>

                {/* Balance info */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Current Balance:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(currentRemaining)}¥
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Shortfall:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(shortfall)}¥
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-zinc-200 dark:border-zinc-700" />

                {/* Conversion info */}
                {canConvert ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                      <span className="font-medium">Convert {karmaToConvert} karma</span>
                      <ArrowRight className="h-4 w-4" />
                      <span className="font-medium">{formatCurrency(nuyenGained)}¥</span>
                    </div>
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      {karmaAfterConversion} karma remaining after conversion
                      {currentKarmaConversion > 0 && (
                        <>
                          {" "}
                          ({newTotalConversion}/{maxKarmaConversion} total converted)
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          Cannot convert karma
                        </p>
                        <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">
                          {isAtMaxConversion
                            ? `Already at maximum conversion (${maxKarmaConversion} karma)`
                            : wouldExceedMax
                              ? `Would exceed maximum conversion (${maxKarmaConversion} karma)`
                              : `Not enough karma available (need ${karmaToConvert}, have ${karmaAvailable})`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
                <button
                  onClick={close}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    close();
                  }}
                  disabled={!canConvert}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    canConvert
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                  }`}
                >
                  Convert & Purchase
                </button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
