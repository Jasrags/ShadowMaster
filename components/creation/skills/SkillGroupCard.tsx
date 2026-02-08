"use client";

/**
 * SkillGroupCard
 *
 * Displays a skill group with rating controls, broken state indicator,
 * and restore capability.
 */

import { Users, X, RefreshCw } from "lucide-react";
import { Stepper } from "../shared";

// =============================================================================
// TYPES
// =============================================================================

export interface SkillGroupCardProps {
  /** Group display name */
  groupName: string;
  /** Skills in this group */
  skills: { id: string; name: string; linkedAttribute: string }[];
  /** Current group rating */
  rating: number;
  /** Maximum allowed rating */
  maxRating: number;
  /** Whether the group can be increased with group points */
  canIncrease: boolean;
  /** Whether the group can be increased with karma */
  canIncreaseWithKarma?: boolean;
  /** Whether the group is broken (skills managed individually) */
  isBroken: boolean;
  /** Whether the group can be restored */
  canRestore: boolean;
  /** Rating change handler */
  onRatingChange: (delta: number) => void;
  /** Karma increase handler */
  onKarmaIncrease?: () => void;
  /** Remove handler */
  onRemove: () => void;
  /** Restore handler */
  onRestore?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SkillGroupCard({
  groupName,
  skills,
  rating,
  maxRating,
  canIncrease,
  canIncreaseWithKarma,
  isBroken,
  canRestore,
  onRatingChange,
  onKarmaIncrease,
  onRemove,
  onRestore,
}: SkillGroupCardProps) {
  const isAtMax = rating >= maxRating;
  const canIncrement = canIncrease || canIncreaseWithKarma;
  const isKarmaMode = canIncreaseWithKarma && !canIncrease;

  return (
    <div className={`py-1.5 ${isBroken ? "opacity-60" : ""}`}>
      {/* Line 1: Group name and controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users className={`h-3.5 w-3.5 ${isBroken ? "text-zinc-400" : "text-purple-500"}`} />
          <span
            className={`text-sm font-medium ${isBroken ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}
          >
            {groupName}
          </span>
          {isBroken && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              Broken
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Show MAX badge only for non-broken groups */}
          {!isBroken && isAtMax && (
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              MAX
            </span>
          )}

          {/* Rating controls - hidden for broken groups */}
          {!isBroken && (
            <Stepper
              value={rating}
              min={1}
              max={maxRating}
              onChange={(newValue) => {
                const delta = newValue - rating;
                if (delta > 0 && isKarmaMode) {
                  onKarmaIncrease?.();
                } else {
                  onRatingChange(delta);
                }
              }}
              canIncrement={canIncrement && !isAtMax}
              accentColor={isKarmaMode ? "amber" : "purple"}
              valueColor="purple"
              showMaxBadge={false}
              name={`${groupName} skill group`}
            />
          )}

          {/* Show rating badge for broken groups (read-only) */}
          {isBroken && (
            <div className="flex h-7 w-8 items-center justify-center rounded bg-zinc-200 font-mono text-sm font-bold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
              {rating}
            </div>
          )}

          {/* Restore button for broken groups that can be restored */}
          {isBroken && canRestore && onRestore && (
            <button
              onClick={onRestore}
              className="flex items-center gap-1 rounded bg-emerald-500 px-2 py-1 text-[10px] font-medium text-white transition-colors hover:bg-emerald-600"
            >
              <RefreshCw className="h-3 w-3" />
              Restore
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
        </div>
      </div>

      {/* Line 2: Skills in group (always visible) */}
      <div
        className={`ml-5 mt-0.5 text-xs ${isBroken ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-500 dark:text-zinc-400"}`}
      >
        {isBroken ? (
          <span className="italic">Skills managed individually</span>
        ) : (
          skills.map((skill) => skill.name).join(" • ")
        )}
      </div>
    </div>
  );
}
