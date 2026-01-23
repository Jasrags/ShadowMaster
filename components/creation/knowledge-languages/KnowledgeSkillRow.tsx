"use client";

import { X, Book } from "lucide-react";
import { Stepper } from "../shared";
import { MAX_SKILL_RATING, CATEGORY_LABELS, CATEGORY_ABBREVS } from "./constants";
import type { KnowledgeSkillRowProps, KnowledgeCategory } from "./types";

export function KnowledgeSkillRow({ skill, onRatingChange, onRemove }: KnowledgeSkillRowProps) {
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
        <Stepper
          value={skill.rating}
          min={1}
          max={MAX_SKILL_RATING}
          onChange={(newValue) => onRatingChange(newValue - skill.rating)}
          name={`${skill.name} rating`}
          accentColor="amber"
          showMaxBadge={true}
        />
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
