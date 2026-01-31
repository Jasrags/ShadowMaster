"use client";

import { X, Book, Star } from "lucide-react";
import { Stepper } from "../shared";
import { MAX_SKILL_RATING, CATEGORY_LABELS, CATEGORY_ABBREVS } from "./constants";
import type { KnowledgeSkillRowProps, KnowledgeCategory } from "./types";

export function KnowledgeSkillRow({
  skill,
  onRatingChange,
  onRemove,
  onAddSpecialization,
  onRemoveSpecialization,
  canAddSpecialization,
}: KnowledgeSkillRowProps) {
  return (
    <div className="py-1.5">
      {/* Main row */}
      <div className="flex items-center justify-between">
        {/* Skill info */}
        <div className="flex items-center gap-1.5">
          <Book className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{skill.name}</span>
          {skill.specialization && <Star className="h-3 w-3 text-amber-500" />}
          <span
            className="text-[10px] text-zinc-400 dark:text-zinc-500"
            title={CATEGORY_LABELS[skill.category as KnowledgeCategory]}
          >
            {CATEGORY_ABBREVS[skill.category as KnowledgeCategory]}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <Stepper
            value={skill.rating}
            min={1}
            max={MAX_SKILL_RATING}
            onChange={(newValue) => onRatingChange(newValue - skill.rating)}
            name={`${skill.name} rating`}
            accentColor="amber"
            showMaxBadge={true}
          />

          {/* Add specialization button (only shown when no spec exists) */}
          {!skill.specialization && onAddSpecialization && (
            <button
              onClick={canAddSpecialization ? onAddSpecialization : undefined}
              disabled={!canAddSpecialization}
              title={canAddSpecialization ? "Add specialization (1 pt)" : "No points available"}
              className={`flex h-5 w-5 items-center justify-center rounded ${
                canAddSpecialization
                  ? "bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
              }`}
            >
              <Star className="h-3 w-3" />
            </button>
          )}

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

      {/* Specialization badge row */}
      {skill.specialization && (
        <div className="ml-5 mt-1 flex gap-1">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            {skill.specialization}
            {onRemoveSpecialization && (
              <button
                onClick={onRemoveSpecialization}
                className="rounded-full hover:bg-amber-200 dark:hover:bg-amber-800"
                aria-label={`Remove ${skill.specialization} specialization`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
