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

import { X, BookOpen, Users, Star, Sparkles, Gift, Plus } from "lucide-react";
import { Stepper } from "../shared";
import { Tooltip } from "@/components/ui";

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
  canIncreaseWithKarma?: boolean;
  onRatingChange?: (delta: number) => void;
  onKarmaIncrease?: () => void;
  onRemove?: () => void;
  onRemoveSpecialization?: (spec: string) => void;
  // Specialization props (only used for individual skills without spec)
  onAddSpecialization?: () => void;
  canAddSpecialization?: boolean;
  /** True when spec would be purchased with karma (skill points exhausted) */
  specRequiresKarma?: boolean;
  // Customization props (only used for group skills)
  onCustomize?: () => void;
  canCustomize?: boolean;
  // Disabled state with reason (for tooltip)
  disabledReason?: string;
  /** @deprecated Use isDesignated instead for explicit designation system */
  isFreeAllocation?: boolean;
  // Free skill designation props (new explicit system)
  /** True when this skill is explicitly designated for free allocation */
  isDesignated?: boolean;
  /** The free rating granted (e.g., 5 for magician at Priority A) */
  freeRating?: number;
  /** Whether this skill can be designated (has available slots and matches type) */
  canDesignate?: boolean;
  /** Callback when user wants to designate this skill */
  onDesignate?: () => void;
  /** Callback when user wants to undesignate this skill */
  onUndesignate?: () => void;
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
  canIncreaseWithKarma = false,
  onRatingChange,
  onKarmaIncrease,
  onRemove,
  onRemoveSpecialization,
  onAddSpecialization,
  canAddSpecialization = false,
  specRequiresKarma = false,
  onCustomize,
  canCustomize = false,
  disabledReason,
  isFreeAllocation = false,
  isDesignated = false,
  freeRating,
  canDesignate = false,
  onDesignate,
  onUndesignate,
}: SkillListItemProps) {
  const isAtMax = rating >= maxRating;
  const hasSpecs = specializations.length > 0;

  // Color scheme based on skill type
  const iconColor = isGroupSkill ? "text-purple-500" : "text-blue-500";
  const ratingBgColor = isGroupSkill
    ? "bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-100"
    : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100";

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
          {/* Designated free skill badge (new explicit system) */}
          {isDesignated && freeRating && (
            <Tooltip
              content={
                rating >= freeRating
                  ? `Designated: First ${freeRating} points free`
                  : `Designated: ${rating}/${freeRating} free points (raise to ${freeRating} for full benefit)`
              }
              placement="top"
              delay={300}
            >
              <span className="flex items-center gap-0.5 rounded bg-indigo-100 px-1 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                <Gift className="h-2.5 w-2.5" />
                {rating >= freeRating ? (
                  <>FREE ({freeRating} pts)</>
                ) : (
                  <>
                    FREE ({rating}/{freeRating})
                  </>
                )}
              </span>
            </Tooltip>
          )}
          {/* Legacy free allocation badge (automatic system) */}
          {isFreeAllocation && !isDesignated && (
            <span className="rounded bg-indigo-100 px-1 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              FREE
            </span>
          )}
          {/* Designate button for eligible skills */}
          {canDesignate && onDesignate && !isDesignated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDesignate();
              }}
              className="flex items-center gap-0.5 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
              title="Designate as free skill"
            >
              <Plus className="h-2.5 w-2.5" />
              Designate
            </button>
          )}
          {isAtMax && (
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              MAX
            </span>
          )}

          {isGroupSkill ? (
            // Group skill: read-only rating display with customize button
            <>
              <div
                className={`flex h-7 w-8 items-center justify-center rounded text-sm font-mono font-bold ${ratingBgColor}`}
              >
                {rating}
              </div>
              {/* Customize button - uses karma to customize group skill */}
              <button
                onClick={onCustomize}
                disabled={!canCustomize}
                title={canCustomize ? "Customize with karma" : "No karma available"}
                className={`ml-1 flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                  canCustomize
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                Customize
              </button>
            </>
          ) : (
            // Individual skill: full controls
            <>
              {(() => {
                // Determine stepper accent color and behavior based on purchase mode
                const canIncrement = canIncrease || canIncreaseWithKarma;
                const accentColor = canIncreaseWithKarma && !canIncrease ? "amber" : "blue";
                const isDisabled = !canIncrement && isAtMax;

                // Custom increment handler for karma mode
                const handleChange = (newValue: number) => {
                  const delta = newValue - rating;
                  if (delta > 0 && canIncreaseWithKarma && !canIncrease) {
                    // Karma purchase mode - open confirmation modal
                    onKarmaIncrease?.();
                  } else {
                    // Normal skill point mode
                    onRatingChange?.(delta);
                  }
                };

                const stepper = (
                  <Stepper
                    value={rating}
                    min={1}
                    max={maxRating}
                    onChange={handleChange}
                    canIncrement={canIncrement && !isAtMax}
                    accentColor={accentColor}
                    showMaxBadge={false}
                    name={`${skillName} skill`}
                  />
                );

                // Wrap in tooltip if disabled with a reason
                if (isDisabled && disabledReason) {
                  return (
                    <Tooltip content={disabledReason} placement="top" delay={300}>
                      <div>{stepper}</div>
                    </Tooltip>
                  );
                }

                return stepper;
              })()}
              {/* Add specialization button - only for individual skills without specs */}
              {!hasSpecs && onAddSpecialization && (
                <button
                  onClick={canAddSpecialization ? onAddSpecialization : undefined}
                  title={
                    canAddSpecialization
                      ? specRequiresKarma
                        ? "Add specialization (7 karma)"
                        : "Add specialization (1 skill pt)"
                      : "No skill points or karma available"
                  }
                  aria-label={
                    canAddSpecialization
                      ? "Add specialization"
                      : "Cannot add specialization - no skill points or karma"
                  }
                  className={`relative flex h-5 w-5 items-center justify-center rounded transition-colors ${
                    canAddSpecialization
                      ? specRequiresKarma
                        ? "bg-amber-200 text-amber-700 hover:bg-amber-300 dark:bg-amber-800/50 dark:text-amber-300 dark:hover:bg-amber-800/70"
                        : "bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                      : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                  }`}
                >
                  {specRequiresKarma && canAddSpecialization ? (
                    <Sparkles className="h-3 w-3" />
                  ) : (
                    <Star className="h-3 w-3" />
                  )}
                  <span
                    className={`absolute -right-0.5 -top-0.5 flex h-2 w-2 items-center justify-center rounded-full text-[6px] font-bold text-white ${
                      canAddSpecialization ? "bg-amber-500" : "bg-zinc-400 dark:bg-zinc-600"
                    }`}
                  >
                    +
                  </span>
                </button>
              )}
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
