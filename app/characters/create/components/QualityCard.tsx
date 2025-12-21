"use client";

import { useMemo } from "react";
import type { QualityData } from "@/lib/rules/loader";
import type { Quality } from "@/lib/types/qualities";
import type { Character } from "@/lib/types";
import { validatePrerequisites, checkIncompatibilities } from "@/lib/rules/qualities/validation";
import type { MergedRuleset } from "@/lib/types";

interface QualityCardProps {
  quality: QualityData | Quality;
  isPositive: boolean;
  isSelected: boolean;
  canSelect: boolean;
  cost: number;
  character?: Partial<Character>;
  ruleset?: MergedRuleset;
  onToggle: () => void;
  onViewDetails?: () => void;
  selectedQualityIds?: string[];
}

export function QualityCard({
  quality,
  isPositive,
  isSelected,
  canSelect,
  cost,
  character,
  ruleset,
  onToggle,
  onViewDetails,
  selectedQualityIds = [],
}: QualityCardProps) {
  // Convert QualityData to Quality format for validation if needed
  const qualityForValidation = useMemo((): Quality | null => {
    if ("type" in quality) {
      return quality as Quality;
    }
    // Convert QualityData to Quality
    const q = quality as QualityData;
    // Convert legacy requiresMagic field to prerequisites.hasMagic
    const existingPrerequisites = q.prerequisites as Quality["prerequisites"] || {};
    const prerequisites: Quality["prerequisites"] = q.requiresMagic && !existingPrerequisites.hasMagic
      ? { ...existingPrerequisites, hasMagic: true }
      : existingPrerequisites;
    return {
      id: q.id,
      name: q.name,
      type: isPositive ? "positive" : "negative",
      karmaCost: q.karmaCost,
      karmaBonus: q.karmaBonus,
      summary: q.summary,
      description: q.description,
      prerequisites: Object.keys(prerequisites).length > 0 ? prerequisites : undefined,
      incompatibilities: q.incompatibilities,
      tags: q.tags,
      levels: q.levels?.map((l) => ({
        level: l.level,
        name: l.name,
        karma: l.karma,
      })),
      maxRating: q.maxRating,
      limit: q.limit,
      requiresSpecification: q.requiresSpecification,
      specificationLabel: q.specificationLabel,
      specificationSource: q.specificationSource,
      specificationOptions: q.specificationOptions,
      source: q.source,
    };
  }, [quality, isPositive]);

  // Check prerequisites if we have character and ruleset
  const prerequisiteCheck = useMemo(() => {
    if (!character || !ruleset || !qualityForValidation) {
      return null;
    }
    return validatePrerequisites(qualityForValidation, character as Character, ruleset);
  }, [character, ruleset, qualityForValidation]);

  // Check incompatibilities
  const incompatibilityCheck = useMemo(() => {
    if (!character || !qualityForValidation) {
      return null;
    }
    return checkIncompatibilities(qualityForValidation, character as Character);
  }, [character, qualityForValidation]);

  // Check if any selected qualities are incompatible
  const hasIncompatibility = useMemo(() => {
    if (!qualityForValidation?.incompatibilities) return false;
    return selectedQualityIds.some((id) =>
      qualityForValidation.incompatibilities?.some(
        (incomp) => incomp.toLowerCase() === id.toLowerCase()
      )
    );
  }, [qualityForValidation, selectedQualityIds]);

  const isUnavailable = prerequisiteCheck?.allowed === false;
  const hasIncompatibilityWarning = incompatibilityCheck?.allowed === false || hasIncompatibility;
  const isDisabled = !canSelect || isUnavailable || hasIncompatibilityWarning;

  return (
    <div
      className={`group relative w-full rounded-lg border-2 p-4 transition-all ${
        isSelected
          ? isPositive
            ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/30"
            : "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/30"
          : isDisabled
            ? "border-zinc-200 bg-zinc-50 opacity-70 dark:border-zinc-700 dark:bg-zinc-800/50"
            : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
      }`}
    >
      <div className={isDisabled && !isSelected ? "cursor-not-allowed" : "cursor-pointer"} onClick={isDisabled && !isSelected ? undefined : onToggle}>
        {/* Selection indicator */}
        {isSelected && (
          <div
            className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full ${
              isPositive ? "bg-emerald-500" : "bg-amber-500"
            }`}
          >
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {/* Quality name and cost */}
        <div className="flex items-start justify-between pr-8">
          <div className="flex-1">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-50">{quality.name}</h4>
            {/* Tags */}
            {quality.tags && quality.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {quality.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span
            className={`ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
              isPositive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            }`}
          >
            {isPositive ? `-${cost}` : `+${cost}`}
          </span>
        </div>

        {/* Summary */}
        {quality.summary && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{quality.summary}</p>
        )}

        {/* Prerequisite status indicators - only show when prerequisites are NOT met */}
        {prerequisiteCheck && !prerequisiteCheck.allowed && (
          <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{prerequisiteCheck.reason || "Prerequisites not met"}</span>
          </div>
        )}

        {/* Incompatibility warning */}
        {hasIncompatibilityWarning && (
          <div className="mt-2 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              {incompatibilityCheck?.reason ||
                (hasIncompatibility ? "Incompatible with selected quality" : "")}
            </span>
          </div>
        )}
      </div>

      {/* View details button */}
      {onViewDetails && (
        <div className="mt-3 border-t border-zinc-200/50 pt-3 dark:border-zinc-700/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View details →
          </button>
        </div>
      )}
    </div>
  );
}

