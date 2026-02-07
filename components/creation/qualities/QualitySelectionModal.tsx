"use client";

/**
 * QualitySelectionModal
 *
 * Unified split-pane modal for adding positive or negative qualities during character creation.
 * Features:
 * - Top-level type toggle (Positive/Negative)
 * - Two-column layout (list left, details right)
 * - Category filter pills with counts
 * - Blue theme for positive, orange theme for negative
 * - Specification and level selection for applicable qualities
 * - Bulk-add flow with session counter
 */

import { useMemo, useState, useCallback, useEffect } from "react";
import type { QualityData } from "@/lib/rules/loader-types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import {
  Search,
  AlertTriangle,
  Check,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Plus,
} from "lucide-react";
import { QUALITY_CATEGORIES, CATEGORY_LABELS, type QualityCategory } from "./constants";
import { getQualityCategory, getQualityCost, hasLevels, getQualityLevels } from "./utils";
import type { QualitySelectionModalProps } from "./types";

export function QualitySelectionModal({
  isOpen,
  onClose,
  defaultType = "positive",
  positiveQualities,
  negativeQualities,
  selectedPositiveIds,
  selectedNegativeIds,
  positiveKarmaUsed,
  negativeKarmaUsed,
  maxPositiveKarma,
  maxNegativeKarma,
  karmaBalance,
  onAdd,
  skillGroups,
  skills,
  existingSkillIds,
  existingSkillGroupIds,
}: QualitySelectionModalProps) {
  // Internal state
  const [activeType, setActiveType] = useState<"positive" | "negative">(defaultType);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<QualityCategory | "all">("all");
  const [selectedQualityId, setSelectedQualityId] = useState<string | null>(null);
  const [specification, setSpecification] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Derive values based on active type
  const isPositive = activeType === "positive";
  const qualities = isPositive ? positiveQualities : negativeQualities;
  const selectedIds = isPositive ? selectedPositiveIds : selectedNegativeIds;
  const usedKarma = isPositive ? positiveKarmaUsed : negativeKarmaUsed;
  const maxKarma = isPositive ? maxPositiveKarma : maxNegativeKarma;
  const remainingKarma = maxKarma - usedKarma;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveType(defaultType);
      setSearchQuery("");
      setActiveCategory("all");
      setSelectedQualityId(null);
      setSpecification("");
      setSelectedLevel(1);
      setAddedThisSession(0);
    }
  }, [isOpen, defaultType]);

  // Reset selection when type changes
  const handleTypeChange = useCallback((newType: "positive" | "negative") => {
    setActiveType(newType);
    setSelectedQualityId(null);
    setSpecification("");
    setSelectedLevel(1);
    setActiveCategory("all");
  }, []);

  // Find the selected quality
  const selectedQuality = selectedQualityId
    ? qualities.find((q) => q.id === selectedQualityId)
    : null;

  // Filter qualities (exclude racial, but keep already-selected for strikethrough display)
  const filteredQualities = useMemo(() => {
    let filtered = qualities.filter((q) => !q.isRacial);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) => q.name.toLowerCase().includes(query) || q.summary?.toLowerCase().includes(query)
      );
    }
    if (activeCategory !== "all") {
      filtered = filtered.filter((q) => getQualityCategory(q) === activeCategory);
    }
    return filtered;
  }, [qualities, selectedIds, searchQuery, activeCategory]);

  // Group by category for display
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
    // Sort within each category
    Object.values(grouped).forEach((items) => {
      items.sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredQualities]);

  // Count items per category (including selected qualities which show as strikethrough)
  const categoryCounts = useMemo(() => {
    const counts: Record<QualityCategory | "all", number> = {
      all: 0,
      physical: 0,
      mental: 0,
      social: 0,
      magical: 0,
      other: 0,
    };

    qualities
      .filter((q) => !q.isRacial)
      .forEach((q) => {
        counts.all++;
        const category = getQualityCategory(q);
        counts[category]++;
      });

    return counts;
  }, [qualities]);

  // Check for conflicts when selecting Incompetent quality with a skill group
  const incompetentConflictInfo = useMemo(() => {
    if (!selectedQuality || selectedQuality.id !== "incompetent" || !specification) {
      return null;
    }

    const selectedGroup = skillGroups.find((g) => g.id === specification);
    if (!selectedGroup) return null;

    const skillsInGroup = new Set(selectedGroup.skills);
    const hasGroupSelected = existingSkillGroupIds.includes(specification);
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

  // Check for warning when selecting Aptitude for a skill the character doesn't have
  const aptitudeWarningInfo = useMemo(() => {
    if (!selectedQuality || selectedQuality.id !== "aptitude" || !specification) {
      return null;
    }

    // Check if the character has this skill selected
    const hasSkill = existingSkillIds.includes(specification);
    if (hasSkill) {
      return null;
    }

    // Find the skill name for display
    const selectedSkill = skills.find((s) => s.id === specification);
    return {
      skillName: selectedSkill?.name || specification,
    };
  }, [selectedQuality, specification, existingSkillIds, skills]);

  // Select a quality
  const handleSelectQuality = useCallback(
    (qualityId: string) => {
      const quality = qualities.find((q) => q.id === qualityId);
      setSelectedQualityId(qualityId);
      setSpecification("");
      // Set initial level based on quality
      if (quality && hasLevels(quality)) {
        const levels = getQualityLevels(quality);
        setSelectedLevel(levels[0]?.level ?? 1);
      } else {
        setSelectedLevel(1);
      }
    },
    [qualities]
  );

  // Can add the selected quality?
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

  // Add the quality
  const handleAdd = useCallback(() => {
    if (!selectedQuality || !canAdd) return;

    onAdd(
      selectedQuality.id,
      isPositive,
      specification || undefined,
      hasLevels(selectedQuality) ? selectedLevel : undefined
    );

    setAddedThisSession((prev) => prev + 1);
    // Reset for next selection
    setSelectedQualityId(null);
    setSpecification("");
    setSelectedLevel(1);
  }, [selectedQuality, canAdd, onAdd, isPositive, specification, selectedLevel]);

  // Close handler
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Check if a quality can be afforded
  const canAffordQuality = useCallback(
    (quality: QualityData): boolean => {
      const cost = getQualityCost(quality, 1);
      if (isPositive) {
        return usedKarma + cost <= maxKarma && karmaBalance >= cost;
      }
      return usedKarma + cost <= maxKarma;
    },
    [isPositive, usedKarma, maxKarma, karmaBalance]
  );

  const selectedCost = selectedQuality ? getQualityCost(selectedQuality, selectedLevel) : 0;

  // Render a quality button in the list
  const renderQualityButton = (quality: QualityData) => {
    const isSelected = selectedQualityId === quality.id;
    const isAlreadyAdded = selectedIds.includes(quality.id);
    const canAfford = canAffordQuality(quality);
    const cost = getQualityCost(quality, 1);
    const qualityHasLevels = hasLevels(quality);

    return (
      <button
        key={quality.id}
        onClick={() => handleSelectQuality(quality.id)}
        disabled={isAlreadyAdded || !canAfford}
        className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
          isSelected
            ? isPositive
              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
            : isAlreadyAdded
              ? "cursor-not-allowed bg-zinc-50 text-zinc-400 line-through dark:bg-zinc-800/50 dark:text-zinc-500"
              : !canAfford
                ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
                : isPositive
                  ? "text-zinc-700 hover:outline hover:outline-1 hover:outline-blue-400 dark:text-zinc-300 dark:hover:outline-blue-500"
                  : "text-zinc-700 hover:outline hover:outline-1 hover:outline-orange-400 dark:text-zinc-300 dark:hover:outline-orange-500"
        }`}
      >
        <div className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className={`block truncate font-medium ${isAlreadyAdded ? "line-through" : ""}`}>
              {quality.name}
            </span>
            {isAlreadyAdded && <Check className="h-3.5 w-3.5 text-emerald-500" />}
            {qualityHasLevels && !isAlreadyAdded && (
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                levels
              </span>
            )}
            {quality.requiresSpecification && !isAlreadyAdded && (
              <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                choice
              </span>
            )}
          </span>
          {quality.summary && (
            <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">
              {quality.summary}
            </span>
          )}
        </div>
        <span
          className={`ml-2 shrink-0 text-xs font-medium ${
            isPositive ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
          } ${isAlreadyAdded || !canAfford ? "opacity-50" : ""}`}
        >
          {isPositive ? `${cost}` : `+${cost}`}
          {qualityHasLevels ? "+" : ""}
        </span>
      </button>
    );
  };

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Quality" onClose={close}>
            <div
              className={`ml-2 rounded-lg p-1.5 ${
                isPositive
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                  : "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300"
              }`}
            >
              {isPositive ? <Sparkles className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            </div>
          </ModalHeader>

          {/* Type Toggle - Positive / Negative */}
          <div className="flex gap-2 border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            <button
              onClick={() => handleTypeChange("positive")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeType === "positive"
                  ? "bg-blue-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Positive
            </button>
            <button
              onClick={() => handleTypeChange("negative")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeType === "negative"
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              Negative
            </button>
          </div>

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={`Search ${isPositive ? "positive" : "negative"} qualities...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
                  isPositive
                    ? "focus:border-blue-500 focus:ring-blue-500"
                    : "focus:border-orange-500 focus:ring-orange-500"
                }`}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === "all"
                    ? isPositive
                      ? "bg-blue-500 text-white"
                      : "bg-orange-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                All
                {categoryCounts.all > 0 && (
                  <span className="ml-1 opacity-70">({categoryCounts.all})</span>
                )}
              </button>
              {QUALITY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? isPositive
                        ? "bg-blue-500 text-white"
                        : "bg-orange-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                  {categoryCounts[cat] > 0 && (
                    <span className="ml-1 opacity-70">({categoryCounts[cat]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - Quality List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {filteredQualities.length === 0 ? (
                  <div className="p-8 text-center text-sm text-zinc-500">
                    No {isPositive ? "positive" : "negative"} qualities found
                  </div>
                ) : activeCategory === "all" ? (
                  // Grouped view with sticky headers
                  QUALITY_CATEGORIES.map((cat) => {
                    const items = qualitiesByCategory[cat];
                    if (items.length === 0) return null;
                    return (
                      <div key={cat}>
                        <div className="sticky top-0 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          {CATEGORY_LABELS[cat]}
                        </div>
                        {items.map((quality) => renderQualityButton(quality))}
                      </div>
                    );
                  })
                ) : (
                  // Flat view when filtered by category
                  filteredQualities
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((quality) => renderQualityButton(quality))
                )}
              </div>

              {/* Right Pane - Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedQuality ? (
                  <div className="space-y-4">
                    {/* Quality Name and Summary */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedQuality.name}
                      </h3>
                      {selectedQuality.summary && (
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {selectedQuality.summary}
                        </p>
                      )}
                    </div>

                    {/* Full Description */}
                    {selectedQuality.description && (
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Description
                        </h4>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {selectedQuality.description}
                        </p>
                      </div>
                    )}

                    {/* Specification Selector */}
                    {selectedQuality.requiresSpecification && (
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          {selectedQuality.specificationLabel || "Specification"}{" "}
                          <span className="text-red-500">*</span>
                        </h4>
                        {selectedQuality.specificationOptions ? (
                          // Static options from quality definition
                          <div className="relative mt-2">
                            <select
                              value={specification}
                              onChange={(e) => setSpecification(e.target.value)}
                              className={`w-full appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
                                isPositive
                                  ? "focus:border-blue-500 focus:ring-blue-500"
                                  : "focus:border-orange-500 focus:ring-orange-500"
                              }`}
                            >
                              <option value="">
                                Select {selectedQuality.specificationLabel}...
                              </option>
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
                            <div className="relative mt-2">
                              <select
                                value={specification}
                                onChange={(e) => setSpecification(e.target.value)}
                                className={`w-full appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
                                  isPositive
                                    ? "focus:border-blue-500 focus:ring-blue-500"
                                    : "focus:border-orange-500 focus:ring-orange-500"
                                }`}
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
                                  <strong>{incompetentConflictInfo.groupName}</strong> group
                                  selected.
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
                        ) : selectedQuality.specificationSource === "skills" ? (
                          // Dynamic options from skills
                          <>
                            <div className="relative mt-2">
                              <select
                                value={specification}
                                onChange={(e) => setSpecification(e.target.value)}
                                className={`w-full appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
                                  isPositive
                                    ? "focus:border-blue-500 focus:ring-blue-500"
                                    : "focus:border-orange-500 focus:ring-orange-500"
                                }`}
                              >
                                <option value="">
                                  Select {selectedQuality.specificationLabel}...
                                </option>
                                {skills.map((skill) => (
                                  <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            </div>
                            {/* Warning for Aptitude quality when skill not selected */}
                            {aptitudeWarningInfo && (
                              <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                                <div className="text-sm text-amber-700 dark:text-amber-300">
                                  <strong>Note:</strong> You don&apos;t have{" "}
                                  <strong>{aptitudeWarningInfo.skillName}</strong> selected as a
                                  skill yet. Aptitude increases a skill&apos;s maximum rating, so
                                  you&apos;ll want to add this skill to benefit from this quality.
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
                            className={`mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
                              isPositive
                                ? "focus:border-blue-500 focus:ring-blue-500"
                                : "focus:border-orange-500 focus:ring-orange-500"
                            }`}
                          />
                        )}
                        {!specification && (
                          <p className="mt-2 text-xs text-red-500">
                            Please select a{" "}
                            {selectedQuality.specificationLabel?.toLowerCase() || "specification"}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Level Selector */}
                    {hasLevels(selectedQuality) &&
                      (() => {
                        const levels = getQualityLevels(selectedQuality);
                        const hasNamedLevels = levels.some((l) => l.name);

                        return (
                          <div>
                            <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              {hasNamedLevels ? "Option" : "Rating"}
                            </h4>
                            {hasNamedLevels || levels.length > 4 ? (
                              // Dropdown for named levels or many levels
                              <div className="relative mt-2">
                                <select
                                  value={selectedLevel}
                                  onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                                  className={`w-full appearance-none rounded-lg border border-zinc-200 bg-white py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
                                    isPositive
                                      ? "focus:border-blue-500 focus:ring-blue-500"
                                      : "focus:border-orange-500 focus:ring-orange-500"
                                  }`}
                                >
                                  {levels.map((level) => {
                                    const levelCost = Math.abs(level.karma);
                                    const canAffordLevel = isPositive
                                      ? usedKarma + levelCost <= maxKarma &&
                                        karmaBalance >= levelCost
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
                              // Button grid for few levels
                              <div className="mt-2 flex gap-2">
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
                                            : "border-orange-400 bg-orange-100 text-orange-700 dark:border-orange-600 dark:bg-orange-900/50 dark:text-orange-300"
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

                    {/* Cost Display Box */}
                    <div
                      className={`rounded-lg p-4 ${
                        isPositive
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "bg-orange-50 dark:bg-orange-900/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          Karma {isPositive ? "Cost" : "Gain"}
                        </span>
                        <span
                          className={`text-2xl font-mono font-bold ${
                            isPositive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {isPositive ? selectedCost : `+${selectedCost}`}
                        </span>
                      </div>
                      {!canAdd && selectedQuality && (
                        <p className="mt-2 text-xs text-red-500">
                          {selectedQuality.requiresSpecification && !specification
                            ? `Please select a ${selectedQuality.specificationLabel?.toLowerCase() || "specification"}`
                            : "Cannot afford this quality"}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  // Empty state
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    {isPositive ? (
                      <Sparkles className="h-12 w-12" />
                    ) : (
                      <AlertCircle className="h-12 w-12" />
                    )}
                    <p className="mt-4 text-sm">
                      Select a {isPositive ? "positive" : "negative"} quality from the list
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span
                  className={`mr-2 ${
                    isPositive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-orange-600 dark:text-orange-400"
                  }`}
                >
                  {addedThisSession} added
                </span>
              )}
              <span>
                {isPositive ? "Positive" : "Negative"}:{" "}
                <span className="font-medium">
                  {remainingKarma} of {maxKarma}
                </span>{" "}
                karma remaining
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Done
              </button>
              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  canAdd
                    ? isPositive
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                <Plus className="h-4 w-4" />
                Add Quality
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
