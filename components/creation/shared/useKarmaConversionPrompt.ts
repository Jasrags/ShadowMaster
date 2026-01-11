"use client";

/**
 * useKarmaConversionPrompt
 *
 * Hook that manages karma-to-nuyen conversion prompts during gear purchases.
 * When a user tries to buy something they can't afford, this hook:
 * 1. Checks if converting karma would cover the cost
 * 2. Opens a confirmation modal
 * 3. Handles the conversion + purchase flow
 */

import { useState, useCallback, useRef } from "react";

// =============================================================================
// CONSTANTS
// =============================================================================

export const KARMA_TO_NUYEN_RATE = 2000;
export const MAX_KARMA_CONVERSION = 10;

// =============================================================================
// TYPES
// =============================================================================

export interface KarmaConversionInfo {
  /** Number of karma points needed to convert */
  karmaNeeded: number;
  /** Nuyen gained from conversion */
  nuyenGained: number;
  /** Whether conversion is possible */
  canConvert: boolean;
  /** Reason conversion is not possible (if applicable) */
  reason?: string;
}

export interface UseKarmaConversionPromptOptions {
  /** Current nuyen remaining */
  remaining: number;
  /** Karma available to convert (from karma budget) */
  karmaRemaining: number;
  /** Already converted karma (state.budgets["karma-spent-gear"]) */
  currentConversion: number;
  /** Callback to update karma conversion in state */
  onConvert: (newTotalConversion: number) => void;
}

export interface KarmaConversionModalState {
  isOpen: boolean;
  itemName: string;
  itemCost: number;
  karmaToConvert: number;
}

export interface UseKarmaConversionPromptReturn {
  /**
   * Check if a purchase would need karma conversion.
   * Returns conversion info or null if purchase is affordable.
   */
  checkPurchase: (cost: number) => KarmaConversionInfo | null;

  /**
   * Open the conversion prompt modal for a specific purchase.
   * @param itemName - Display name of the item
   * @param cost - Total cost of the item
   * @param onSuccess - Callback to execute the actual purchase after conversion
   */
  promptConversion: (itemName: string, cost: number, onSuccess: () => void) => void;

  /** Current modal state */
  modalState: KarmaConversionModalState;

  /** Close the modal without converting */
  closeModal: () => void;

  /** Confirm the conversion and execute the pending purchase */
  confirmConversion: () => void;

  /** Current nuyen remaining (for modal display) */
  currentRemaining: number;

  /** Karma available to convert (for modal display) */
  karmaAvailable: number;

  /** Current karma already converted (for modal display) */
  currentKarmaConversion: number;

  /** Maximum karma that can be converted (for modal display) */
  maxKarmaConversion: number;
}

// =============================================================================
// HOOK
// =============================================================================

export function useKarmaConversionPrompt({
  remaining,
  karmaRemaining,
  currentConversion,
  onConvert,
}: UseKarmaConversionPromptOptions): UseKarmaConversionPromptReturn {
  // Modal state
  const [modalState, setModalState] = useState<KarmaConversionModalState>({
    isOpen: false,
    itemName: "",
    itemCost: 0,
    karmaToConvert: 0,
  });

  // Store the pending purchase callback
  const pendingPurchaseRef = useRef<(() => void) | null>(null);

  /**
   * Calculate how much karma needs to be converted to afford a purchase.
   * Returns null if the purchase is already affordable.
   */
  const checkPurchase = useCallback(
    (cost: number): KarmaConversionInfo | null => {
      // Already affordable - no conversion needed
      if (cost <= remaining) {
        return null;
      }

      const shortfall = cost - remaining;
      const karmaNeeded = Math.ceil(shortfall / KARMA_TO_NUYEN_RATE);
      const nuyenGained = karmaNeeded * KARMA_TO_NUYEN_RATE;

      // Check if already at max conversion
      if (currentConversion >= MAX_KARMA_CONVERSION) {
        return {
          karmaNeeded,
          nuyenGained,
          canConvert: false,
          reason: `Already at maximum conversion (${MAX_KARMA_CONVERSION} karma)`,
        };
      }

      // Check if would exceed max conversion
      const newTotal = currentConversion + karmaNeeded;
      if (newTotal > MAX_KARMA_CONVERSION) {
        // Calculate max additional karma we can convert
        const maxAdditional = MAX_KARMA_CONVERSION - currentConversion;
        const maxAdditionalNuyen = maxAdditional * KARMA_TO_NUYEN_RATE;

        // Check if max additional would be enough
        if (remaining + maxAdditionalNuyen >= cost) {
          // We can afford it with max allowed conversion
          const actualKarmaNeeded = Math.ceil(shortfall / KARMA_TO_NUYEN_RATE);
          return {
            karmaNeeded: Math.min(actualKarmaNeeded, maxAdditional),
            nuyenGained: Math.min(actualKarmaNeeded, maxAdditional) * KARMA_TO_NUYEN_RATE,
            canConvert: Math.min(actualKarmaNeeded, maxAdditional) <= karmaRemaining,
            reason:
              Math.min(actualKarmaNeeded, maxAdditional) > karmaRemaining
                ? `Not enough karma (need ${Math.min(actualKarmaNeeded, maxAdditional)}, have ${karmaRemaining})`
                : undefined,
          };
        }

        return {
          karmaNeeded,
          nuyenGained,
          canConvert: false,
          reason: `Would exceed maximum conversion (${MAX_KARMA_CONVERSION} karma)`,
        };
      }

      // Check if enough karma available
      if (karmaNeeded > karmaRemaining) {
        return {
          karmaNeeded,
          nuyenGained,
          canConvert: false,
          reason: `Not enough karma (need ${karmaNeeded}, have ${karmaRemaining})`,
        };
      }

      // Conversion is possible
      return {
        karmaNeeded,
        nuyenGained,
        canConvert: true,
      };
    },
    [remaining, karmaRemaining, currentConversion]
  );

  /**
   * Open the conversion prompt modal
   */
  const promptConversion = useCallback(
    (itemName: string, cost: number, onSuccess: () => void) => {
      const info = checkPurchase(cost);
      if (!info) {
        // Already affordable - shouldn't happen but handle gracefully
        onSuccess();
        return;
      }

      // Store the purchase callback
      pendingPurchaseRef.current = onSuccess;

      // Open modal with conversion info
      setModalState({
        isOpen: true,
        itemName,
        itemCost: cost,
        karmaToConvert: info.karmaNeeded,
      });
    },
    [checkPurchase]
  );

  /**
   * Close the modal without converting
   */
  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    pendingPurchaseRef.current = null;
  }, []);

  /**
   * Confirm the conversion and execute the pending purchase
   */
  const confirmConversion = useCallback(() => {
    const { karmaToConvert } = modalState;

    // Update karma conversion in state
    const newTotal = currentConversion + karmaToConvert;
    onConvert(newTotal);

    // Execute the pending purchase
    // Use setTimeout to ensure state update has propagated
    setTimeout(() => {
      if (pendingPurchaseRef.current) {
        pendingPurchaseRef.current();
        pendingPurchaseRef.current = null;
      }
    }, 0);

    // Close modal
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, [modalState, currentConversion, onConvert]);

  return {
    checkPurchase,
    promptConversion,
    modalState,
    closeModal,
    confirmConversion,
    currentRemaining: remaining,
    karmaAvailable: karmaRemaining,
    currentKarmaConversion: currentConversion,
    maxKarmaConversion: MAX_KARMA_CONVERSION,
  };
}
