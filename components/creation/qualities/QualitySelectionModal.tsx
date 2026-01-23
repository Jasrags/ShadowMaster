"use client";

import { useMemo, useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { QualityData } from "@/lib/rules/loader-types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, AlertTriangle, Check, ChevronDown } from "lucide-react";
import { QUALITY_CATEGORIES, CATEGORY_LABELS, type QualityCategory } from "./constants";
import { getQualityCategory, getQualityCost, hasLevels, getQualityLevels } from "./utils";
import type { QualitySelectionModalProps } from "./types";

export function QualitySelectionModal({
  isOpen,
  onClose,
  isPositive,
  qualities,
  selectedIds,
  usedKarma,
  maxKarma,
  karmaBalance,
  onAdd,
  skillGroups,
  existingSkillIds,
  existingSkillGroupIds,
}: QualitySelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQualityId, setSelectedQualityId] = useState<string | null>(null);
  const [specification, setSpecification] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);

  const selectedQuality = selectedQualityId
    ? qualities.find((q) => q.id === selectedQualityId)
    : null;

  // Filter and group qualities by category
  const filteredQualities = useMemo(() => {
    let filtered = qualities.filter((q) => !q.isRacial && !selectedIds.includes(q.id));
    if (searchQuery) {
      filtered = filtered.filter((q) => q.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [qualities, selectedIds, searchQuery]);

  const qualitiesByCategory = useMemo(() => {
    const grouped: Record<QualityCategory, QualityData[]> = {
      physical: [],
      mental: [],
      social: [],
      magical: [],
      other: [],
    };
    filteredQualities.forEach((q) => {
      const category = getQualityCategory(q);
      grouped[category].push(q);
    });
    return grouped;
  }, [filteredQualities]);

  // Flatten qualities with category headers for virtualization
  type VirtualItem =
    | { type: "header"; category: QualityCategory }
    | { type: "quality"; quality: QualityData };

  const virtualItems = useMemo((): VirtualItem[] => {
    const items: VirtualItem[] = [];
    QUALITY_CATEGORIES.forEach((category) => {
      const categoryQualities = qualitiesByCategory[category];
      if (categoryQualities.length > 0) {
        items.push({ type: "header", category });
        categoryQualities.forEach((quality) => {
          items.push({ type: "quality", quality });
        });
      }
    });
    return items;
  }, [qualitiesByCategory]);

  // Virtualization setup
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: virtualItems.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: (index) => {
      // Headers are smaller than quality items
      return virtualItems[index].type === "header" ? 32 : 88;
    },
    overscan: 5,
  });

  const remainingKarma = maxKarma - usedKarma;

  // Check for conflicts when selecting Incompetent quality with a skill group
  const incompetentConflictInfo = useMemo(() => {
    if (!selectedQuality || selectedQuality.id !== "incompetent" || !specification) {
      return null;
    }

    // Find skills in the selected group
    const selectedGroup = skillGroups.find((g) => g.id === specification);
    if (!selectedGroup) return null;

    const skillsInGroup = new Set(selectedGroup.skills);

    // Check if user has the skill group selected
    const hasGroupSelected = existingSkillGroupIds.includes(specification);

    // Check if user has any individual skills from the group
    const conflictingSkills = existingSkillIds.filter((skillId) => skillsInGroup.has(skillId));

    if (hasGroupSelected || conflictingSkills.length > 0) {
      return {
        groupName: selectedGroup.name,
        hasGroupSelected,
        conflictingSkillCount: conflictingSkills.length,
      };
    }

    return null;
  }, [selectedQuality, specification, skillGroups, existingSkillIds, existingSkillGroupIds]);

  const handleSelectQuality = (qualityId: string) => {
    const quality = qualities.find((q) => q.id === qualityId);
    setSelectedQualityId(qualityId);
    setSpecification("");
    setSelectedLevel(1);

    // If no specification or levels needed, we can add immediately
    if (quality && !quality.requiresSpecification && !hasLevels(quality)) {
      // Will add on confirm
    }
  };

  const handleAdd = () => {
    if (!selectedQuality) return;

    const needsSpec = selectedQuality.requiresSpecification && !specification;
    if (needsSpec) return;

    onAdd(
      selectedQuality.id,
      specification || undefined,
      hasLevels(selectedQuality) ? selectedLevel : undefined
    );
    // Reset selection but keep modal open for adding more qualities
    setSelectedQualityId(null);
    setSpecification("");
    setSelectedLevel(1);
  };

  const canAdd = useMemo(() => {
    if (!selectedQuality) return false;
    if (selectedQuality.requiresSpecification && !specification) return false;

    const cost = getQualityCost(selectedQuality, selectedLevel);
    if (isPositive) {
      return usedKarma + cost <= maxKarma && karmaBalance >= cost;
    }
    return usedKarma + cost <= maxKarma;
  }, [
    selectedQuality,
    specification,
    selectedLevel,
    isPositive,
    usedKarma,
    maxKarma,
    karmaBalance,
  ]);

  const selectedCost = selectedQuality ? getQualityCost(selectedQuality, selectedLevel) : 0;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={onClose} size="2xl">
      {({ close }) => (
        <>
          <ModalHeader
            title={`Add ${isPositive ? "Positive" : "Negative"} Quality`}
            onClose={close}
          />

          <ModalBody className="flex flex-col p-0">
            {/* Search and budget info */}
            <div className="shrink-0 border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search qualities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {remainingKarma} karma available for {isPositive ? "positive" : "negative"}{" "}
                qualities ({usedKarma} of {maxKarma} max used)
              </p>
            </div>

            {/* Quality list - virtualized scrollable container */}
            <div
              ref={scrollContainerRef}
              className="min-h-0 flex-1 overflow-y-auto px-6 py-4"
              style={{ height: "400px" }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const item = virtualItems[virtualRow.index];

                  if (item.type === "header") {
                    return (
                      <div
                        key={`header-${item.category}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <h4 className="border-b border-zinc-200 pb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                          {CATEGORY_LABELS[item.category]}
                        </h4>
                      </div>
                    );
                  }

                  const quality = item.quality;
                  const cost = getQualityCost(quality, 1);
                  const canAfford = isPositive
                    ? usedKarma + cost <= maxKarma && karmaBalance >= cost
                    : usedKarma + cost <= maxKarma;
                  const isSelected = selectedQualityId === quality.id;

                  return (
                    <div
                      key={quality.id}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                        padding: "4px 0",
                      }}
                    >
                      <button
                        onClick={() => handleSelectQuality(quality.id)}
                        disabled={!canAfford && !isSelected}
                        className={`h-full w-full rounded-lg border p-3 text-left transition-all ${
                          isSelected
                            ? isPositive
                              ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30"
                              : "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30"
                            : canAfford
                              ? "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                              : "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                                isSelected
                                  ? isPositive
                                    ? "border-blue-500 bg-blue-500 text-white"
                                    : "border-amber-500 bg-amber-500 text-white"
                                  : "border-zinc-300 dark:border-zinc-600"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {quality.name}
                            </span>
                            {hasLevels(quality) && (
                              <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                                levels
                              </span>
                            )}
                            {quality.requiresSpecification && (
                              <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                                requires choice
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isPositive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {isPositive ? `${cost} karma` : `+${cost} karma`}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 pl-7 text-xs text-zinc-500 dark:text-zinc-400">
                          {quality.summary}
                        </p>
                        {!canAfford && !isSelected && (
                          <p className="mt-1 pl-7 text-xs text-amber-600 dark:text-amber-400">
                            Exceeds budget
                          </p>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Specification/Level selection (if needed) */}
            {selectedQuality &&
              (selectedQuality.requiresSpecification || hasLevels(selectedQuality)) && (
                <div className="shrink-0 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
                  {selectedQuality.requiresSpecification && (
                    <div className="mb-3">
                      <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {selectedQuality.specificationLabel || "Specification"}
                      </label>
                      {selectedQuality.specificationOptions ? (
                        // Static options from quality definition
                        <div className="relative">
                          <select
                            value={specification}
                            onChange={(e) => setSpecification(e.target.value)}
                            className="w-full appearance-none rounded-lg border border-zinc-200 py-2 pl-3 pr-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                          >
                            <option value="">Select {selectedQuality.specificationLabel}...</option>
                            {selectedQuality.specificationOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        </div>
                      ) : selectedQuality.specificationSource === "skillGroups" ? (
                        // Dynamic options from skill groups
                        <>
                          <div className="relative">
                            <select
                              value={specification}
                              onChange={(e) => setSpecification(e.target.value)}
                              className="w-full appearance-none rounded-lg border border-zinc-200 py-2 pl-3 pr-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                            >
                              <option value="">
                                Select {selectedQuality.specificationLabel}...
                              </option>
                              {skillGroups.map((group) => (
                                <option key={group.id} value={group.id}>
                                  {group.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                          </div>
                          {/* Warning for Incompetent quality conflicting with existing skills */}
                          {incompetentConflictInfo && (
                            <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                              <div className="text-sm text-amber-700 dark:text-amber-300">
                                <strong>Warning:</strong> You have skills from the{" "}
                                <strong>{incompetentConflictInfo.groupName}</strong> group selected.
                                {incompetentConflictInfo.hasGroupSelected && (
                                  <span> You have the entire skill group selected.</span>
                                )}
                                {incompetentConflictInfo.conflictingSkillCount > 0 && (
                                  <span>
                                    {" "}
                                    You have {incompetentConflictInfo.conflictingSkillCount}{" "}
                                    individual skill
                                    {incompetentConflictInfo.conflictingSkillCount !== 1
                                      ? "s"
                                      : ""}{" "}
                                    from this group.
                                  </span>
                                )}
                                <div className="mt-1 text-xs">
                                  These skills will need to be removed if you add this quality.
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        // Free-form text input
                        <input
                          type="text"
                          value={specification}
                          onChange={(e) => setSpecification(e.target.value)}
                          placeholder={`Enter ${selectedQuality.specificationLabel || "specification"}...`}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      )}
                    </div>
                  )}

                  {hasLevels(selectedQuality) &&
                    (() => {
                      const levels = getQualityLevels(selectedQuality);
                      const hasNamedLevels = levels.some((l) => l.name);

                      return (
                        <div>
                          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {/* Use "Option" for qualities with named levels, "Rating" otherwise */}
                            {hasNamedLevels ? "Option" : "Rating"}
                          </label>
                          {/* Use dropdown for qualities with named levels or many levels */}
                          {hasNamedLevels || levels.length > 4 ? (
                            <div className="relative">
                              <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                                className="w-full appearance-none rounded-lg border border-zinc-200 py-2 pl-3 pr-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                              >
                                {levels.map((level) => {
                                  const levelCost = Math.abs(level.karma);
                                  const canAffordLevel = isPositive
                                    ? usedKarma + levelCost <= maxKarma && karmaBalance >= levelCost
                                    : usedKarma + levelCost <= maxKarma;

                                  return (
                                    <option
                                      key={level.level}
                                      value={level.level}
                                      disabled={!canAffordLevel}
                                    >
                                      {level.name || `Rating ${level.level}`} (
                                      {isPositive ? levelCost : `+${levelCost}`} karma)
                                      {!canAffordLevel ? " - cannot afford" : ""}
                                    </option>
                                  );
                                })}
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              {levels.map((level) => {
                                const levelCost = Math.abs(level.karma);
                                const canAffordLevel = isPositive
                                  ? usedKarma + levelCost <= maxKarma && karmaBalance >= levelCost
                                  : usedKarma + levelCost <= maxKarma;

                                return (
                                  <button
                                    key={level.level}
                                    onClick={() => setSelectedLevel(level.level)}
                                    disabled={!canAffordLevel}
                                    className={`flex-1 rounded-lg border px-3 py-2 text-center transition-colors ${
                                      selectedLevel === level.level
                                        ? isPositive
                                          ? "border-blue-400 bg-blue-100 text-blue-700 dark:border-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                                          : "border-amber-400 bg-amber-100 text-amber-700 dark:border-amber-600 dark:bg-amber-900/50 dark:text-amber-300"
                                        : canAffordLevel
                                          ? "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                                          : "cursor-not-allowed border-zinc-200 opacity-50 dark:border-zinc-700"
                                    }`}
                                  >
                                    <div className="text-sm font-medium">{level.level}</div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                      {isPositive ? `${levelCost}` : `+${levelCost}`} karma
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                </div>
              )}
          </ModalBody>

          <ModalFooter>
            <div className="text-sm">
              {selectedQuality ? (
                <div className="space-y-1">
                  <div className="text-zinc-600 dark:text-zinc-400">
                    Selected: {selectedQuality.name} (
                    {isPositive ? `${selectedCost} karma` : `+${selectedCost} karma`})
                  </div>
                  {/* Show validation error when specification is required but missing */}
                  {selectedQuality.requiresSpecification && !specification && (
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      Please enter a{" "}
                      {selectedQuality.specificationLabel?.toLowerCase() || "specification"} above
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-zinc-600 dark:text-zinc-400">Select a quality to add</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Done
              </button>
              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  canAdd
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                }`}
              >
                Add
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
