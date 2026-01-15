"use client";

import { Minus, Plus, X, Book } from "lucide-react";
import { MAX_SKILL_RATING, CATEGORY_LABELS, CATEGORY_ABBREVS } from "./constants";
import type { KnowledgeSkillRowProps, KnowledgeCategory } from "./types";

export function KnowledgeSkillRow({ skill, onRatingChange, onRemove }: KnowledgeSkillRowProps) {
  const canIncrease = skill.rating < MAX_SKILL_RATING;
  const canDecrease = skill.rating > 1;
  const isAtMax = skill.rating >= MAX_SKILL_RATING;

  return (
    <div className="flex items-center justify-between py-1.5">
      {/* Skill info */}
      <div className="flex items-center gap-1.5">
        <Book className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{skill.name}</span>
        <span
          className="text-[10px] text-zinc-400 dark:text-zinc-500"
          title={CATEGORY_LABELS[skill.category as KnowledgeCategory]}
        >
          {CATEGORY_ABBREVS[skill.category as KnowledgeCategory]}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {isAtMax && (
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
            MAX
          </span>
        )}
        <button
          onClick={() => onRatingChange(-1)}
          disabled={!canDecrease}
          aria-label={`Decrease ${skill.name} rating`}
          className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
            canDecrease
              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
        >
          <Minus className="h-3 w-3" aria-hidden="true" />
        </button>
        <div className="flex h-7 w-8 items-center justify-center rounded bg-zinc-100 text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
          {skill.rating}
        </div>
        <button
          onClick={() => onRatingChange(1)}
          disabled={!canIncrease}
          aria-label={`Increase ${skill.name} rating`}
          className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
            canIncrease
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
        </button>
        {/* Separator */}
        <div className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
        <button
          onClick={onRemove}
          aria-label={`Remove ${skill.name}`}
          className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          title="Remove skill"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
