"use client";

/**
 * SkillListItem
 *
 * Unified component for displaying skills in the skills list.
 * Handles both individual skills and skills from groups with
 * visual distinction and appropriate controls.
 *
 * Individual skills: Blue styling, full +/- controls, removable
 * Group skills: Purple styling, read-only rating, shows group name
 */

import { Minus, Plus, X, BookOpen, Users, Star } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface SkillListItemProps {
  skillName: string;
  linkedAttribute: string;
  rating: number;
  maxRating: number;
  specializations: string[];
  // Group skill props
  isGroupSkill: boolean;
  groupName?: string;
  // Control props (only used for individual skills)
  canIncrease?: boolean;
  onRatingChange?: (delta: number) => void;
  onRemove?: () => void;
  onRemoveSpecialization?: (spec: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillListItem({
  skillName,
  linkedAttribute,
  rating,
  maxRating,
  specializations,
  isGroupSkill,
  groupName,
  canIncrease = false,
  onRatingChange,
  onRemove,
  onRemoveSpecialization,
}: SkillListItemProps) {
  const isAtMax = rating >= maxRating;
  const hasSpecs = specializations.length > 0;

  // Color scheme based on skill type
  const iconColor = isGroupSkill ? "text-purple-500" : "text-blue-500";
  const ratingBgColor = isGroupSkill
    ? "bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-100"
    : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100";
  const increaseButtonColor = isGroupSkill
    ? "bg-purple-500 text-white hover:bg-purple-600"
    : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <div className="py-1.5">
      {/* Line 1: Skill name and controls */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          {isGroupSkill ? (
            <Users className={`h-3.5 w-3.5 shrink-0 ${iconColor}`} />
          ) : (
            <BookOpen className={`h-3.5 w-3.5 shrink-0 ${iconColor}`} />
          )}
          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {skillName}
          </span>
          {hasSpecs && (
            <span title="Has specializations" className="shrink-0">
              <Star className="h-3 w-3 text-amber-500" />
            </span>
          )}
        </div>

        {/* Controls - different for group vs individual */}
        <div className="flex shrink-0 items-center gap-1">
          {isAtMax && (
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              MAX
            </span>
          )}

          {isGroupSkill ? (
            // Group skill: read-only rating display
            <>
              <div
                className={`flex h-7 w-8 items-center justify-center rounded text-sm font-bold ${ratingBgColor}`}
              >
                {rating}
              </div>
              {/* Placeholder for future "Customize" button */}
              <div className="w-[76px]" /> {/* Same width as +/- buttons + separator */}
            </>
          ) : (
            // Individual skill: full controls
            <>
              <button
                onClick={() => onRatingChange?.(-1)}
                disabled={rating <= 1}
                className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                  rating > 1
                    ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
              >
                <Minus className="h-3 w-3" />
              </button>
              <div
                className={`flex h-7 w-8 items-center justify-center rounded text-sm font-bold ${ratingBgColor}`}
              >
                {rating}
              </div>
              <button
                onClick={() => onRatingChange?.(1)}
                disabled={!canIncrease || isAtMax}
                className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                  canIncrease && !isAtMax
                    ? increaseButtonColor
                    : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
              >
                <Plus className="h-3 w-3" />
              </button>
              {/* Separator */}
              <div className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
              <button
                onClick={onRemove}
                className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Line 2: Linked attribute and group name */}
      <div className="ml-5 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
        {linkedAttribute.toUpperCase().slice(0, 3)}
        {groupName && <span className="text-purple-500 dark:text-purple-400"> • {groupName}</span>}
      </div>

      {/* Line 3: Specializations (if any) */}
      {hasSpecs && (
        <div className="ml-5 mt-1 flex flex-wrap gap-1">
          {specializations.map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
            >
              {spec}
              {onRemoveSpecialization && (
                <button
                  onClick={() => onRemoveSpecialization(spec)}
                  className="rounded-full hover:bg-amber-200 dark:hover:bg-amber-800"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
