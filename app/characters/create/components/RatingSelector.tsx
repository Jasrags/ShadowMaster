'use client';

import { useMemo } from 'react';
import {
  getRatingOptions,
  formatRating,
} from '@/lib/rules/ratings';
import type {
  CatalogItemRatingSpec,
  RatingValidationContext,
} from '@/lib/types/ratings';

interface RatingSelectorProps {
  /** Item specification with rating config */
  itemSpec: CatalogItemRatingSpec;

  /** Currently selected rating */
  selectedRating: number;

  /** Callback when rating changes */
  onRatingChange: (rating: number) => void;

  /** Validation context (e.g., max availability) */
  validationContext?: RatingValidationContext;

  /** Whether to show calculated cost */
  showCost?: boolean;

  /** Whether to show availability */
  showAvailability?: boolean;

  /** Whether selector is disabled */
  disabled?: boolean;

  /** Custom label for the rating */
  label?: string;
}

export function RatingSelector({
  itemSpec,
  selectedRating,
  onRatingChange,
  validationContext,
  showCost = true,
  showAvailability = true,
  disabled = false,
  label,
}: RatingSelectorProps) {
  const options = useMemo(
    () => getRatingOptions(itemSpec, validationContext),
    [itemSpec, validationContext]
  );

  if (!itemSpec.rating?.hasRating) {
    return null;
  }

  const ratingLabel =
    label ??
    formatRating(0, itemSpec.rating, { showLabel: true }).split(' ')[0];

  return (
    <div className="rating-selector">
      <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {ratingLabel}
      </label>

      <div className="flex gap-2">
        {options.map(({ rating, values, valid, error }) => (
          <button
            key={rating}
            type="button"
            disabled={disabled || !valid}
            onClick={() => onRatingChange(rating)}
            className={`
              flex-1 px-3 py-2 rounded border text-sm transition-colors
              ${
                selectedRating === rating
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-200'
              }
              ${
                !valid
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }
            `}
            title={error}
          >
            <div className="font-medium">{rating}</div>
            {showCost && (
              <div className="text-xs opacity-75">
                ¥{values.cost.toLocaleString()}
              </div>
            )}
            {showAvailability && (
              <div className="text-xs opacity-75">
                Avail {values.availability}
              </div>
            )}
          </button>
        ))}
      </div>
      {options.some((opt) => !opt.valid) && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Some ratings exceed availability limits
        </p>
      )}
    </div>
  );
}

