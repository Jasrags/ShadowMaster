"use client";

/**
 * QualityReplacementModal
 *
 * When a life module grants a quality the character already has (non-stackable),
 * Run Faster p.67 says they may pick a replacement quality of the same karma value.
 * This modal lets the player browse and pick that replacement.
 */

import { useState, useMemo, useCallback } from "react";
import { Search, ArrowRightLeft } from "lucide-react";
import { Heading } from "react-aria-components";
import { BaseModalRoot, ModalFooter } from "@/components/ui/BaseModal";
import type { QualityData } from "@/lib/rules/loader-types";
import { getQualityCost } from "@/components/creation/qualities/utils";
import type { QualityReplacementModalProps } from "./types";

export function QualityReplacementModal({
  isOpen,
  onClose,
  onSelect,
  duplicateQualityId,
  duplicateQualityType,
  availableQualities,
  alreadySelectedIds,
}: QualityReplacementModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Find the duplicate quality in the catalog
  const duplicateQuality = useMemo(
    () => availableQualities.find((q) => q.id === duplicateQualityId),
    [availableQualities, duplicateQualityId]
  );

  const targetCost = duplicateQuality ? getQualityCost(duplicateQuality, 1) : 0;

  // Filter qualities: same type, same karma cost, not already selected, not the duplicate itself
  const filteredQualities = useMemo(() => {
    const excludeIds = new Set([duplicateQualityId, ...(alreadySelectedIds ?? [])]);

    return availableQualities.filter((q) => {
      if (excludeIds.has(q.id)) return false;

      // Must match the type (positive/negative) — infer from karmaCost vs karmaBonus
      const isPositive = (q.karmaCost ?? 0) > 0 || (!q.karmaBonus && !q.karmaCost);
      const wantPositive = duplicateQualityType === "positive";
      if (isPositive !== wantPositive && !q.karmaCost && !q.karmaBonus) return false;
      if (wantPositive && q.karmaBonus && !q.karmaCost) return false;
      if (!wantPositive && q.karmaCost && !q.karmaBonus) return false;

      // Must match cost
      const cost = getQualityCost(q, 1);
      if (cost !== targetCost) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!q.name.toLowerCase().includes(query) && !q.summary?.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [
    availableQualities,
    duplicateQualityId,
    duplicateQualityType,
    targetCost,
    alreadySelectedIds,
    searchQuery,
  ]);

  const selectedQuality = useMemo(
    () => (selectedId ? filteredQualities.find((q) => q.id === selectedId) : null),
    [filteredQualities, selectedId]
  );

  const handleConfirm = useCallback(() => {
    if (!selectedId) return;
    onSelect(selectedId);
    setSelectedId(null);
    setSearchQuery("");
  }, [selectedId, onSelect]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={onClose} size="lg" className="bg-zinc-900">
      {({ close }) => (
        <>
          {/* Header */}
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <Heading
              slot="title"
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
            >
              REPLACE DUPLICATE QUALITY
            </Heading>
            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <ArrowRightLeft className="h-3 w-3" />
              <span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {duplicateQuality?.name ?? duplicateQualityId}
                </span>{" "}
                is already granted. Pick a{" "}
                {duplicateQualityType === "positive" ? "positive" : "negative"} quality worth{" "}
                <span className="font-mono font-medium">{targetCost}</span> Karma.
              </span>
            </div>
          </div>

          {/* Body: two-panel */}
          <div className="flex min-h-0 flex-1" style={{ minHeight: "300px" }}>
            {/* Left: quality list */}
            <div className="flex w-1/2 flex-col border-r border-zinc-200 dark:border-zinc-700">
              {/* Search */}
              <div className="border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search qualities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded bg-zinc-100 py-1 pl-7 pr-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto">
                {filteredQualities.length === 0 ? (
                  <p className="p-4 text-center text-xs text-zinc-400">
                    No matching qualities found at {targetCost} Karma.
                  </p>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredQualities.map((q) => {
                      const isSelected = selectedId === q.id;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setSelectedId(q.id)}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors ${
                            isSelected
                              ? "bg-amber-50 dark:bg-amber-900/20"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                              {q.name}
                            </span>
                            <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                              {q.summary}
                            </p>
                          </div>
                          <span className="ml-2 flex-shrink-0 text-[10px] font-mono text-zinc-400">
                            {getQualityCost(q, 1)}K
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: detail panel */}
            <div className="flex w-1/2 flex-col p-4">
              {selectedQuality ? (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedQuality.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-mono text-zinc-400">
                    {getQualityCost(selectedQuality, 1)} Karma ·{" "}
                    {duplicateQualityType === "positive" ? "Positive" : "Negative"}
                  </p>
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
                    {selectedQuality.summary}
                  </p>
                  {selectedQuality.description && (
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {selectedQuality.description}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-xs text-zinc-400">
                    Select a replacement quality to see details.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <ModalFooter>
            <p className="text-[10px] text-zinc-400">
              Run Faster p.67: duplicate non-stackable qualities must be replaced with same-cost
              alternatives.
            </p>
            <div className="flex gap-2">
              <button
                onClick={close}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedId}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Replace Quality
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
