"use client";

/**
 * RatingSelector Component
 *
 * Reusable rating selector for items that support multiple ratings.
 * Works with both unified ratings tables and legacy ratingSpec formats.
 *
 * Features:
 * - Dropdown for rating selection
 * - Shows cost/essence/availability for each rating option
 * - Disables ratings that exceed availability limits
 * - Compact design for integration in modals and cards
 */

import { useMemo, useCallback } from "react";
import type { RatingCalculationResult, RatingValidationContext } from "@/lib/types/ratings";
import {
  getRatingOptionsUnified,
  isRatingValid,
  getRatedItemValuesUnified,
  type RatedItem,
} from "@/lib/rules/ratings";

// =============================================================================
// TYPES
// =============================================================================

interface RatingSelectorProps {
  /** The item to select a rating for */
  item: RatedItem;
  /** Currently selected rating */
  selectedRating: number;
  /** Callback when rating changes */
  onRatingChange: (rating: number) => void;
  /** Maximum availability allowed (for character creation) */
  maxAvailability?: number;
  /** Show cost preview next to each option */
  showCostPreview?: boolean;
  /** Show essence preview (for augmentations) */
  showEssencePreview?: boolean;
  /** Show power point cost (for adept powers) */
  showPowerPointPreview?: boolean;
  /** Show karma cost (for qualities) */
  showKarmaPreview?: boolean;
  /** Disable the selector */
  disabled?: boolean;
  /** Custom label (default: "Rating") */
  label?: string;
  /** Compact mode for inline use */
  compact?: boolean;
  /** Additional class names */
  className?: string;
}

interface RatingOption {
  rating: number;
  values: RatingCalculationResult;
  valid: boolean;
  error?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value.toLocaleString();
}

function formatEssence(value: number): string {
  return value.toFixed(2);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function RatingSelector({
  item,
  selectedRating,
  onRatingChange,
  maxAvailability,
  showCostPreview = true,
  showEssencePreview = false,
  showPowerPointPreview = false,
  showKarmaPreview = false,
  disabled = false,
  label = "Rating",
  compact = false,
  className = "",
}: RatingSelectorProps) {
  // Get all valid rating options with calculated values
  const options = useMemo(() => {
    const context: RatingValidationContext = {};
    if (maxAvailability !== undefined) {
      context.maxAvailability = maxAvailability;
    }
    return getRatingOptionsUnified(item, context);
  }, [item, maxAvailability]);

  // Get current selection values
  const currentValues = useMemo(() => {
    return getRatedItemValuesUnified(item, selectedRating);
  }, [item, selectedRating]);

  // Handle rating change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const rating = parseInt(e.target.value, 10);
      if (!isNaN(rating) && isRatingValid(item, rating)) {
        onRatingChange(rating);
      }
    },
    [item, onRatingChange]
  );

  // If no rating options, don't render
  if (!item.hasRating || options.length === 0) {
    return null;
  }

  // Build option label
  const getOptionLabel = (opt: RatingOption): string => {
    const parts: string[] = [`${label} ${opt.rating}`];

    if (showCostPreview && opt.values.cost > 0) {
      parts.push(`${formatCurrency(opt.values.cost)}¥`);
    }

    if (showEssencePreview && opt.values.essence !== undefined) {
      parts.push(`${formatEssence(opt.values.essence)} ESS`);
    }

    if (showPowerPointPreview && opt.values.karmaCost !== undefined) {
      // For adept powers, karmaCost field holds PP cost in the unified format
      const ppCost =
        (opt.values as { powerPointCost?: number }).powerPointCost ?? opt.values.karmaCost;
      if (ppCost !== undefined) {
        parts.push(`${ppCost.toFixed(2)} PP`);
      }
    }

    if (showKarmaPreview && opt.values.karmaCost !== undefined) {
      parts.push(`${opt.values.karmaCost} karma`);
    }

    if (!opt.valid && opt.error) {
      parts.push(`(${opt.error})`);
    }

    return parts.join(" - ");
  };

  // Compact inline variant
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}:</label>
        <select
          value={selectedRating}
          onChange={handleChange}
          disabled={disabled}
          className="h-7 rounded border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
        >
          {options.map((opt) => (
            <option key={opt.rating} value={opt.rating} disabled={!opt.valid}>
              {opt.rating}
              {!opt.valid && " (unavailable)"}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Full variant with value preview
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
      <select
        value={selectedRating}
        onChange={handleChange}
        disabled={disabled}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
          disabled:cursor-not-allowed disabled:bg-zinc-100
          dark:border-zinc-700 dark:bg-zinc-800 dark:text-white
          dark:disabled:bg-zinc-900"
      >
        {options.map((opt) => (
          <option key={opt.rating} value={opt.rating} disabled={!opt.valid}>
            {getOptionLabel(opt)}
          </option>
        ))}
      </select>

      {/* Current selection summary */}
      <div className="flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        {showCostPreview && currentValues.cost > 0 && (
          <span>Cost: {formatCurrency(currentValues.cost)}¥</span>
        )}
        {showEssencePreview && currentValues.essence !== undefined && (
          <span>Essence: {formatEssence(currentValues.essence)}</span>
        )}
        {currentValues.availability > 0 && <span>Avail: {currentValues.availability}</span>}
        {currentValues.capacity !== undefined && <span>Capacity: {currentValues.capacity}</span>}
      </div>
    </div>
  );
}

// =============================================================================
// HOOK FOR RATING STATE MANAGEMENT
// =============================================================================

/**
 * Hook for managing rating selection state for a rated item
 */
export function useRatingSelection(item: RatedItem, initialRating?: number) {
  const defaultRating = initialRating ?? item.minRating ?? 1;

  // Get initial valid rating
  const validInitialRating = useMemo(() => {
    if (isRatingValid(item, defaultRating)) {
      return defaultRating;
    }
    // Fall back to minimum rating
    return item.minRating ?? 1;
  }, [item, defaultRating]);

  return {
    initialRating: validInitialRating,
    isRated: item.hasRating === true,
    minRating: item.minRating ?? 1,
    maxRating: item.maxRating ?? 1,
  };
}
