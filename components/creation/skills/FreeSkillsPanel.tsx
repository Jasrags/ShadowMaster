"use client";

/**
 * FreeSkillsPanel
 *
 * Status panel showing free skill designation progress.
 * Displays for magicians, technomancers, adepts, etc. who receive
 * free skills from their magic priority selection.
 *
 * Features:
 * - Shows progress for each free skill type (magical, resonance, active)
 * - Lists designated skills with their current ratings
 * - Provides "Designate" button to open selection modal
 * - Warnings for skills below free rating
 */

import { Gift, AlertTriangle, Check, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { FreeSkillAllocationStatus } from "@/lib/rules/skills/free-skills";

// =============================================================================
// TYPES
// =============================================================================

interface FreeSkillsPanelProps {
  /** Status for each free skill allocation type */
  allocationStatuses: FreeSkillAllocationStatus[];
  /** Map of skill ID to skill name for display */
  skillNames: Record<string, string>;
  /** Callback when user clicks to designate skills for a type */
  onDesignate: (type: string) => void;
  /** Callback when user clicks to undesignate a skill */
  onUndesignate: (skillId: string, type: string) => void;
  /** Whether any free skill configs exist (hide panel if none) */
  hasFreeSkills: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FreeSkillsPanel({
  allocationStatuses,
  skillNames,
  onDesignate,
  onUndesignate,
  hasFreeSkills,
}: FreeSkillsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't render if no free skills available
  if (!hasFreeSkills || allocationStatuses.length === 0) {
    return null;
  }

  // Calculate overall status
  const totalSlots = allocationStatuses.reduce((sum, s) => sum + s.totalSlots, 0);
  const usedSlots = allocationStatuses.reduce((sum, s) => sum + s.usedSlots, 0);
  const allComplete = allocationStatuses.every((s) => s.isComplete);
  const hasWarnings = allocationStatuses.some((s) => s.belowFreeRating.length > 0);

  // Get status badge
  const getStatusBadge = () => {
    if (allComplete && !hasWarnings) {
      return (
        <span className="flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
          <Check className="h-3 w-3" />
          Complete
        </span>
      );
    }
    if (hasWarnings) {
      return (
        <span className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
          <AlertTriangle className="h-3 w-3" />
          Warnings
        </span>
      );
    }
    return (
      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
        {usedSlots}/{totalSlots} designated
      </span>
    );
  };

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-900/20">
      {/* Header - collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          )}
          <Gift className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
            Free Skills from Magic Priority
          </span>
        </div>
        {getStatusBadge()}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-3 border-t border-indigo-200 px-3 pb-3 pt-2 dark:border-indigo-800">
          {allocationStatuses.map((status) => (
            <FreeSkillTypeSection
              key={status.type}
              status={status}
              skillNames={skillNames}
              onDesignate={onDesignate}
              onUndesignate={onUndesignate}
            />
          ))}

          {/* Help text */}
          <p className="text-[11px] text-indigo-600/70 dark:text-indigo-400/70">
            Designate which skills receive free rating points. First{" "}
            {allocationStatuses[0]?.freeRating || 0} points of each designated skill are free.
          </p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface FreeSkillTypeSectionProps {
  status: FreeSkillAllocationStatus;
  skillNames: Record<string, string>;
  onDesignate: (type: string) => void;
  onUndesignate: (skillId: string, type: string) => void;
}

function FreeSkillTypeSection({
  status,
  skillNames,
  onDesignate,
  onUndesignate,
}: FreeSkillTypeSectionProps) {
  const {
    type,
    label,
    freeRating,
    totalSlots,
    usedSlots,
    designatedSkillIds,
    designatedSkillRatings,
    belowFreeRating,
    isComplete,
  } = status;

  // Progress bar percentage
  const progressPercent = totalSlots > 0 ? (usedSlots / totalSlots) * 100 : 0;

  return (
    <div className="space-y-2">
      {/* Type header with progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium capitalize text-indigo-800 dark:text-indigo-200">
            {label}
          </span>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400">
            ({usedSlots}/{totalSlots} at Rating {freeRating})
          </span>
        </div>
        {!isComplete && (
          <button
            onClick={() => onDesignate(type)}
            className="rounded bg-indigo-500 px-2 py-0.5 text-[10px] font-medium text-white transition-colors hover:bg-indigo-600"
          >
            Designate
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-800">
        <div
          className={`h-full transition-all ${isComplete ? "bg-emerald-500" : "bg-indigo-500"}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Designated skills list */}
      {designatedSkillIds.length > 0 && (
        <div className="space-y-1">
          {designatedSkillIds.map((skillId) => {
            const rating = designatedSkillRatings[skillId] || 0;
            const isBelow = belowFreeRating.some((b) => b.skillId === skillId);

            return (
              <div
                key={skillId}
                className="flex items-center justify-between rounded bg-white/50 px-2 py-1 dark:bg-zinc-800/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-700 dark:text-zinc-300">
                    {skillNames[skillId] || skillId}
                  </span>
                  {isBelow && (
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      Rating {rating}/{freeRating}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${
                      isBelow
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {rating >= freeRating ? (
                      <>FREE ({freeRating} pts)</>
                    ) : (
                      <>
                        FREE ({rating}/{freeRating} pts)
                      </>
                    )}
                  </span>
                  <button
                    onClick={() => onUndesignate(skillId, type)}
                    className="rounded px-1.5 py-0.5 text-[10px] text-zinc-500 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {designatedSkillIds.length === 0 && (
        <div className="rounded border-2 border-dashed border-indigo-200 p-2 text-center text-[11px] text-indigo-400 dark:border-indigo-700 dark:text-indigo-500">
          No skills designated yet
        </div>
      )}
    </div>
  );
}
