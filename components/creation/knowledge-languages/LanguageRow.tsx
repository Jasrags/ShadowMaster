"use client";

import { Minus, Plus, X, Languages } from "lucide-react";
import { MAX_SKILL_RATING } from "./constants";
import type { LanguageRowProps } from "./types";

export function LanguageRow({ language, onRatingChange, onRemove }: LanguageRowProps) {
  const isNative = language.isNative;
  const canIncrease = !isNative && language.rating < MAX_SKILL_RATING;
  const canDecrease = !isNative && language.rating > 1;

  return (
    <div className="flex items-center justify-between py-1.5">
      {/* Language info */}
      <div className="flex items-center gap-1.5">
        <Languages className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {language.name}
        </span>
        {isNative && (
          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-semibold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
            Native
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {isNative ? (
          <>
            <div className="flex h-7 w-8 items-center justify-center rounded bg-purple-100 text-sm font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              N
            </div>
            {/* Separator */}
            <div className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
            <button
              onClick={onRemove}
              aria-label={`Remove ${language.name}`}
              className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              title="Remove native language"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onRatingChange(-1)}
              disabled={!canDecrease}
              aria-label={`Decrease ${language.name} rating`}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                canDecrease
                  ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Minus className="h-3 w-3" aria-hidden="true" />
            </button>
            <div className="flex h-7 w-8 items-center justify-center rounded bg-zinc-100 text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              {language.rating}
            </div>
            <button
              onClick={() => onRatingChange(1)}
              disabled={!canIncrease}
              aria-label={`Increase ${language.name} rating`}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                canIncrease
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
            </button>
            {/* Separator */}
            <div className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
            <button
              onClick={onRemove}
              aria-label={`Remove ${language.name}`}
              className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              title="Remove language"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
