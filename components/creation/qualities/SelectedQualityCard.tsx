"use client";

import { X } from "lucide-react";
import type { SelectedQualityCardProps } from "./types";
import { formatEffectBadge, isUnifiedEffect, resolveRatingBasedValue } from "@/lib/rules/effects";
import type { EffectBadgeContext } from "@/lib/rules/effects";

export function SelectedQualityCard({
  quality,
  selection,
  isPositive,
  cost,
  onRemove,
}: SelectedQualityCardProps) {
  // Get level name if quality has named levels (legacy format only)
  // Unified ratings don't have named levels, just numeric ratings
  const levelName =
    selection.level && quality.levels
      ? quality.levels.find((l) => l.level === selection.level)?.name
      : null;

  // Extract unified effects from quality data for badge display
  const charRating = selection.level;
  const ratingEntry =
    quality.ratings && charRating !== undefined
      ? (quality.ratings as Record<string, Record<string, unknown>>)[String(charRating)]
      : undefined;

  const effectBadges =
    (quality.effects as unknown[] | undefined)
      ?.filter(isUnifiedEffect)
      .map((effect) => {
        const ctx: EffectBadgeContext = { rating: charRating };
        if (typeof effect.value === "string" && ratingEntry) {
          const resolved = resolveRatingBasedValue(effect, ratingEntry);
          if (resolved !== null) ctx.resolvedValue = resolved;
        }
        return formatEffectBadge(effect, ctx);
      })
      .filter((b): b is NonNullable<typeof b> => b !== null) ?? [];

  const displayName = selection.specification
    ? `${quality.name} (${selection.specification})`
    : selection.level
      ? `${quality.name} (${levelName || `Rating ${selection.level}`})`
      : quality.name;

  return (
    <div className="py-1.5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              isPositive ? "bg-blue-500" : "bg-amber-500"
            }`}
          />
          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {displayName}
          </span>
          <span
            className={`shrink-0 text-xs font-medium ${
              isPositive ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {isPositive ? `${cost}` : `+${cost}`}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {/* Separator */}
          <div className="mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
          <button
            onClick={onRemove}
            className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            title="Remove quality"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
      {/* Description */}
      <p className="ml-3 text-xs text-zinc-500 dark:text-zinc-400">{quality.summary}</p>
      {/* Effect Badges */}
      {effectBadges.length > 0 && (
        <div className="ml-3 mt-1 flex flex-wrap gap-1">
          {effectBadges.map((badge, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${badge.colorClass}`}
            >
              {badge.label}
              {badge.trigger && <span className="opacity-50">· {badge.trigger}</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
