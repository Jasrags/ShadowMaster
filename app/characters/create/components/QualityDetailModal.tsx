"use client";

import { useMemo } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import type { QualityData } from "@/lib/rules/loader-types";
import type { Quality } from "@/lib/types/qualities";
import type { Character } from "@/lib/types";
import { validatePrerequisites, checkIncompatibilities } from "@/lib/rules/qualities/validation";
import type { MergedRuleset } from "@/lib/types";

interface QualityDetailModalProps {
  quality: QualityData | Quality;
  isPositive: boolean;
  character?: Partial<Character>;
  ruleset?: MergedRuleset;
  selectedQualityIds?: string[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function QualityDetailModal({
  quality,
  isPositive,
  character,
  ruleset,
  selectedQualityIds = [],
  isOpen,
  onOpenChange,
}: QualityDetailModalProps) {
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

  // Check prerequisites
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
  const incompatibleSelected = useMemo(() => {
    if (!qualityForValidation?.incompatibilities) return [];
    return selectedQualityIds.filter((id) =>
      qualityForValidation.incompatibilities?.some(
        (incomp) => incomp.toLowerCase() === id.toLowerCase()
      )
    );
  }, [qualityForValidation, selectedQualityIds]);

  const prerequisites = qualityForValidation?.prerequisites;
  const incompatibilities = qualityForValidation?.incompatibilities || [];

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <Modal className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        <Dialog className="flex flex-col outline-none">
          {({ close }) => (
            <>
              {/* Header */}
              <div
                className={`flex items-center justify-between border-b p-6 ${
                  isPositive
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                    : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                }`}
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {quality.name}
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        isPositive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                      }`}
                    >
                      {isPositive ? "Positive Quality" : "Negative Quality"}
                    </span>
                    {quality.tags && quality.tags.length > 0 && (
                      <div className="flex gap-1">
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
                </div>
                <button
                  onClick={close}
                  className="ml-4 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6 p-6">
                {/* Summary */}
                {quality.summary && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Summary
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{quality.summary}</p>
                  </div>
                )}

                {/* Description */}
                {quality.description && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Description
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {quality.description}
                    </p>
                  </div>
                )}

                {/* Prerequisites */}
                {prerequisites && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Prerequisites
                    </h3>
                    <div className="space-y-2">
                      {prerequisiteCheck && (
                        <div
                          className={`rounded-lg border p-3 ${
                            prerequisiteCheck.allowed
                              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                              : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {prerequisiteCheck.allowed ? (
                              <>
                                <svg
                                  className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
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
                                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                  Prerequisites met
                                </span>
                              </>
                            ) : (
                              <>
                                <svg
                                  className="h-5 w-5 text-amber-600 dark:text-amber-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                  {prerequisiteCheck.reason || "Prerequisites not met"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Prerequisite details */}
                      <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {prerequisites.metatypes && prerequisites.metatypes.length > 0 && (
                          <div>
                            <span className="font-medium">Metatype:</span>{" "}
                            {prerequisites.metatypes.join(", ")}
                          </div>
                        )}
                        {prerequisites.metatypesExcluded &&
                          prerequisites.metatypesExcluded.length > 0 && (
                            <div>
                              <span className="font-medium">Not available to:</span>{" "}
                              {prerequisites.metatypesExcluded.join(", ")}
                            </div>
                          )}
                        {prerequisites.hasMagic && (
                          <div>
                            <span className="font-medium">Requires:</span> Magic attribute
                          </div>
                        )}
                        {prerequisites.hasResonance && (
                          <div>
                            <span className="font-medium">Requires:</span> Resonance attribute
                          </div>
                        )}
                        {prerequisites.attributes &&
                          Object.entries(prerequisites.attributes).map(([attr, req]) => (
                            <div key={attr}>
                              <span className="font-medium">{attr}:</span>{" "}
                              {req.min !== undefined && `Min ${req.min}`}
                              {req.min !== undefined && req.max !== undefined && ", "}
                              {req.max !== undefined && `Max ${req.max}`}
                            </div>
                          ))}
                        {prerequisites.skills &&
                          Object.entries(prerequisites.skills).map(([skill, req]) => (
                            <div key={skill}>
                              <span className="font-medium">{skill}:</span>{" "}
                              {req.min !== undefined && `Min ${req.min}`}
                            </div>
                          ))}
                        {prerequisites.requiredQualities &&
                          prerequisites.requiredQualities.length > 0 && (
                            <div>
                              <span className="font-medium">Requires qualities:</span>{" "}
                              {prerequisites.requiredQualities.join(", ")}
                            </div>
                          )}
                        {prerequisites.requiredAnyQualities &&
                          prerequisites.requiredAnyQualities.length > 0 && (
                            <div>
                              <span className="font-medium">Requires any of:</span>{" "}
                              {prerequisites.requiredAnyQualities.join(", ")}
                            </div>
                          )}
                        {prerequisites.magicalPaths && prerequisites.magicalPaths.length > 0 && (
                          <div>
                            <span className="font-medium">Magical path:</span>{" "}
                            {prerequisites.magicalPaths.join(", ")}
                          </div>
                        )}
                        {prerequisites.magicalPathsExcluded &&
                          prerequisites.magicalPathsExcluded.length > 0 && (
                            <div>
                              <span className="font-medium">Not available to:</span>{" "}
                              {prerequisites.magicalPathsExcluded.join(", ")}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Incompatibilities */}
                {incompatibilities.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Incompatibilities
                    </h3>
                    <div className="space-y-2">
                      {incompatibilityCheck && !incompatibilityCheck.allowed && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-5 w-5 text-red-600 dark:text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span className="text-sm font-medium text-red-700 dark:text-red-300">
                              {incompatibilityCheck.reason || "Incompatible quality selected"}
                            </span>
                          </div>
                        </div>
                      )}
                      {incompatibleSelected.length > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                          <div className="text-sm text-red-700 dark:text-red-300">
                            <span className="font-medium">Incompatible with selected:</span>{" "}
                            {incompatibleSelected.join(", ")}
                          </div>
                        </div>
                      )}
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Cannot be taken with: {incompatibilities.join(", ")}
                      </div>
                    </div>
                  </div>
                )}

                {/* Levels/Ratings */}
                {quality.levels && quality.levels.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Rating Levels
                    </h3>
                    <div className="space-y-2">
                      {quality.levels.map((level) => (
                        <div
                          key={level.level}
                          className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{level.name}</span>
                              {level.effects && level.effects.length > 0 && (
                                <span className="ml-2 text-xs text-zinc-500">
                                  ({level.effects.length} effect{level.effects.length !== 1 ? "s" : ""})
                                </span>
                              )}
                            </div>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                isPositive
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                              }`}
                            >
                              {isPositive
                                ? `-${Math.abs(level.karma)}`
                                : `+${Math.abs(level.karma)}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specification requirements */}
                {quality.requiresSpecification && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Specification Required
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      This quality requires a specification:{" "}
                      {quality.specificationLabel || "Specify details"}
                    </p>
                    {quality.specificationOptions && (
                      <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Valid options: {quality.specificationOptions.join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {/* Source reference */}
                {quality.source && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Source
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {quality.source.book}, page {quality.source.page}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
                <button
                  onClick={close}
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

