"use client";

/**
 * KnowledgeLanguageModal
 *
 * Unified two-column modal for adding languages and knowledge skills during character creation.
 * Combines AddLanguageModal and AddKnowledgeSkillModal into a single modal with mode toggle.
 *
 * Features:
 * - Mode toggle: Language | Knowledge (pill buttons)
 * - Two-column layout: left (available items), right (configuration panel)
 * - Bulk-add workflow (modal stays open after add)
 * - Session counter feedback
 * - "Already Added" section shows existing items grayed out
 * - Native language support with Bilingual quality check
 *
 * Follows the MatrixGearModal/WeaponPurchaseModal pattern from PRs #198-199.
 */

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useSkills } from "@/lib/rules";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Globe, BookOpen, Star, Minus, Plus, X } from "lucide-react";
import type { KnowledgeLanguageModalProps, KnowledgeCategory } from "./types";
import { MAX_SKILL_RATING, SPEC_KNOWLEDGE_POINT_COST, CATEGORY_LABELS } from "./constants";

// =============================================================================
// CONSTANTS
// =============================================================================

type ModalMode = "language" | "knowledge";

const MODE_OPTIONS = [
  { id: "language" as const, label: "Languages", icon: Globe },
  { id: "knowledge" as const, label: "Knowledge", icon: BookOpen },
];

const KNOWLEDGE_CATEGORIES: { id: KnowledgeCategory; label: string }[] = [
  { id: "academic", label: "Academic" },
  { id: "interests", label: "Interests" },
  { id: "professional", label: "Professional" },
  { id: "street", label: "Street" },
];

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function LanguageListItem({
  name,
  region,
  isSelected,
  isExisting,
  onClick,
}: {
  name: string;
  region?: string;
  isSelected: boolean;
  isExisting: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isExisting}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isExisting
          ? "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
          : isSelected
            ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30"
            : "border-zinc-200 bg-white hover:border-amber-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-amber-500"
      }`}
    >
      <div className="flex items-center gap-2">
        <Globe className="h-3.5 w-3.5 text-amber-500" />
        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {name}
        </span>
        {region && <span className="text-xs text-zinc-500 dark:text-zinc-400">({region})</span>}
        {isExisting && (
          <span className="ml-auto text-[10px] text-zinc-400 dark:text-zinc-500">Added</span>
        )}
      </div>
    </button>
  );
}

function KnowledgeListItem({
  name,
  category,
  isSelected,
  isExisting,
  onClick,
}: {
  name: string;
  category: string;
  isSelected: boolean;
  isExisting: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isExisting}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isExisting
          ? "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
          : isSelected
            ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30"
            : "border-zinc-200 bg-white hover:border-amber-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-amber-500"
      }`}
    >
      <div className="flex items-center gap-2">
        <BookOpen className="h-3.5 w-3.5 text-amber-500" />
        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {name}
        </span>
        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {CATEGORY_LABELS[category as KnowledgeCategory] || category}
        </span>
        {isExisting && (
          <span className="ml-auto text-[10px] text-zinc-400 dark:text-zinc-500">Added</span>
        )}
      </div>
    </button>
  );
}

function RatingSelector({
  value,
  min,
  max,
  onChange,
  disabled = false,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function KnowledgeLanguageModal({
  isOpen,
  onClose,
  onAddLanguage,
  onAddKnowledgeSkill,
  existingLanguages,
  existingKnowledgeSkills,
  // hasNativeLanguage is calculated internally from existingLanguages
  hasBilingualQuality,
  pointsRemaining,
  defaultMode = "language",
}: KnowledgeLanguageModalProps) {
  // Catalog data from ruleset
  const { exampleLanguages, exampleKnowledgeSkills, knowledgeCategories } = useSkills();

  // Mode state
  const [mode, setMode] = useState<ModalMode>(defaultMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | KnowledgeCategory>("all");

  // Selection state
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<string | null>(null);

  // Language config
  const [isNative, setIsNative] = useState(false);
  const [languageRating, setLanguageRating] = useState(1);

  // Knowledge config
  const [knowledgeCategory, setKnowledgeCategory] = useState<KnowledgeCategory>("academic");
  const [knowledgeRating, setKnowledgeRating] = useState(1);
  const [specialization, setSpecialization] = useState("");

  // Custom input state
  const [customName, setCustomName] = useState("");

  // Bulk-add tracking
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Sync mode with defaultMode when modal opens
  // Track previous isOpen to detect when modal opens
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    // Only update mode when the modal transitions from closed to open
    if (isOpen && !prevIsOpenRef.current && mode !== defaultMode) {
      setMode(defaultMode);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, defaultMode, mode]);

  // Calculate max native languages (2 if Bilingual, 1 otherwise)
  const nativeLanguageCount = existingLanguages.filter((l) => l.isNative).length;
  const maxNativeLanguages = hasBilingualQuality ? 2 : 1;
  const canAddNative = nativeLanguageCount < maxNativeLanguages;

  // Get category options from ruleset or fallback
  const categoryOptions = useMemo(() => {
    if (knowledgeCategories?.length > 0) {
      return knowledgeCategories.map((cat) => ({
        id: cat.id as KnowledgeCategory,
        label: cat.name,
      }));
    }
    return KNOWLEDGE_CATEGORIES;
  }, [knowledgeCategories]);

  // Reset state on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("all");
    setSelectedLanguage(null);
    setSelectedKnowledge(null);
    setIsNative(false);
    setLanguageRating(1);
    setKnowledgeCategory("academic");
    setKnowledgeRating(1);
    setSpecialization("");
    setCustomName("");
    setAddedThisSession(0);
  }, []);

  // Partial reset after add (preserves search/filters/mode)
  const resetForNextItem = useCallback(() => {
    setSelectedLanguage(null);
    setSelectedKnowledge(null);
    setIsNative(false);
    setLanguageRating(1);
    setKnowledgeCategory("academic");
    setKnowledgeRating(1);
    setSpecialization("");
    setCustomName("");
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Filter languages
  const { availableLanguages, existingLanguagesList } = useMemo(() => {
    const existingNames = new Set(existingLanguages.map((l) => l.name.toLowerCase()));
    let available = exampleLanguages || [];
    let existing = exampleLanguages?.filter((l) => existingNames.has(l.name.toLowerCase())) || [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      available = available.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          (l.region && l.region.toLowerCase().includes(query))
      );
      existing = existing.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          (l.region && l.region.toLowerCase().includes(query))
      );
    }

    // Remove existing from available
    available = available.filter((l) => !existingNames.has(l.name.toLowerCase()));

    return {
      availableLanguages: available.sort((a, b) => a.name.localeCompare(b.name)),
      existingLanguagesList: existing.sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [exampleLanguages, existingLanguages, searchQuery]);

  // Filter knowledge skills
  const { availableKnowledge, existingKnowledgeList } = useMemo(() => {
    const existingNames = new Set(existingKnowledgeSkills.map((s) => s.name.toLowerCase()));
    let available = exampleKnowledgeSkills || [];
    let existing =
      exampleKnowledgeSkills?.filter((s) => existingNames.has(s.name.toLowerCase())) || [];

    // Apply category filter
    if (categoryFilter !== "all") {
      available = available.filter((s) => s.category === categoryFilter);
      existing = existing.filter((s) => s.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      available = available.filter((s) => s.name.toLowerCase().includes(query));
      existing = existing.filter((s) => s.name.toLowerCase().includes(query));
    }

    // Remove existing from available
    available = available.filter((s) => !existingNames.has(s.name.toLowerCase()));

    return {
      availableKnowledge: available.sort((a, b) => a.name.localeCompare(b.name)),
      existingKnowledgeList: existing.sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [exampleKnowledgeSkills, existingKnowledgeSkills, searchQuery, categoryFilter]);

  // Get selected language data
  const selectedLanguageData = useMemo(() => {
    if (!selectedLanguage) return null;
    return exampleLanguages?.find((l) => l.name === selectedLanguage) || null;
  }, [exampleLanguages, selectedLanguage]);

  // Calculate cost
  const calculateLanguageCost = useCallback(() => {
    if (isNative) return 0;
    return languageRating;
  }, [isNative, languageRating]);

  const calculateKnowledgeCost = useCallback(() => {
    const specCost = specialization.trim() ? SPEC_KNOWLEDGE_POINT_COST : 0;
    return knowledgeRating + specCost;
  }, [knowledgeRating, specialization]);

  const currentCost = mode === "language" ? calculateLanguageCost() : calculateKnowledgeCost();
  const canAfford = currentCost <= pointsRemaining;

  // Get the effective name (selected or custom)
  const effectiveName = useMemo(() => {
    if (mode === "language") {
      return selectedLanguage || customName.trim();
    }
    return selectedKnowledge || customName.trim();
  }, [mode, selectedLanguage, selectedKnowledge, customName]);

  // Check if can add
  const canAdd = useMemo(() => {
    if (!effectiveName) return false;
    if (mode === "language" && isNative && !canAddNative) return false;
    if (!canAfford && !isNative) return false;
    return true;
  }, [effectiveName, mode, isNative, canAddNative, canAfford]);

  // Handle select language
  const handleSelectLanguage = useCallback((name: string) => {
    setSelectedLanguage(name);
    setCustomName("");
    setIsNative(false);
    setLanguageRating(1);
  }, []);

  // Handle select knowledge
  const handleSelectKnowledge = useCallback((name: string, category: KnowledgeCategory) => {
    setSelectedKnowledge(name);
    setCustomName("");
    setKnowledgeCategory(category);
    setKnowledgeRating(1);
    setSpecialization("");
  }, []);

  // Handle custom input
  const handleCustomInput = useCallback(
    (value: string) => {
      setCustomName(value);
      if (mode === "language") {
        setSelectedLanguage(null);
      } else {
        setSelectedKnowledge(null);
      }
    },
    [mode]
  );

  // Handle add
  const handleAdd = useCallback(() => {
    if (!canAdd || !effectiveName) return;

    if (mode === "language") {
      onAddLanguage(effectiveName, isNative ? 0 : languageRating, isNative);
    } else {
      const spec = specialization.trim() || undefined;
      onAddKnowledgeSkill(effectiveName, knowledgeCategory, knowledgeRating, spec);
    }

    setAddedThisSession((prev) => prev + 1);
    resetForNextItem();
  }, [
    canAdd,
    effectiveName,
    mode,
    isNative,
    languageRating,
    knowledgeCategory,
    knowledgeRating,
    specialization,
    onAddLanguage,
    onAddKnowledgeSkill,
    resetForNextItem,
  ]);

  // Handle mode change
  const handleModeChange = useCallback((newMode: ModalMode) => {
    setMode(newMode);
    setSelectedLanguage(null);
    setSelectedKnowledge(null);
    setCustomName("");
    setIsNative(false);
    setLanguageRating(1);
    setKnowledgeCategory("academic");
    setKnowledgeRating(1);
    setSpecialization("");
  }, []);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Knowledge / Language" onClose={close} />

          {/* Mode Toggle & Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Mode Toggle Pills */}
            <div className="flex gap-2">
              {MODE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleModeChange(opt.id)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      mode === opt.id
                        ? "bg-amber-500 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Category Filter (Knowledge mode only) */}
            {mode === "knowledge" && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                    categoryFilter === "all"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  All
                </button>
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                      categoryFilter === cat.id
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={
                  mode === "language"
                    ? "Search or type custom language..."
                    : "Search or type custom skill..."
                }
                value={searchQuery || customName}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  handleCustomInput(value);
                }}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane: Item List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 p-4 dark:border-zinc-700">
                {mode === "language" ? (
                  <>
                    {availableLanguages.length === 0 && existingLanguagesList.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-zinc-500">
                          {searchQuery ? "No languages found" : "No languages available"}
                        </p>
                        {searchQuery && (
                          <p className="mt-1 text-xs text-zinc-400">
                            Type a custom language name above
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Available languages */}
                        {availableLanguages.map((lang) => (
                          <LanguageListItem
                            key={lang.name}
                            name={lang.name}
                            region={lang.region}
                            isSelected={selectedLanguage === lang.name}
                            isExisting={false}
                            onClick={() => handleSelectLanguage(lang.name)}
                          />
                        ))}

                        {/* Already Added section */}
                        {existingLanguagesList.length > 0 && (
                          <>
                            <div className="my-3 flex items-center gap-2">
                              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                                Already Added
                              </span>
                              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                            </div>
                            {existingLanguagesList.map((lang) => (
                              <LanguageListItem
                                key={lang.name}
                                name={lang.name}
                                region={lang.region}
                                isSelected={false}
                                isExisting={true}
                                onClick={() => {}}
                              />
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {availableKnowledge.length === 0 && existingKnowledgeList.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-zinc-500">
                          {searchQuery || categoryFilter !== "all"
                            ? "No knowledge skills found"
                            : "No knowledge skills available"}
                        </p>
                        {searchQuery && (
                          <p className="mt-1 text-xs text-zinc-400">
                            Type a custom skill name above
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Available knowledge skills */}
                        {availableKnowledge.map((skill) => (
                          <KnowledgeListItem
                            key={skill.name}
                            name={skill.name}
                            category={skill.category}
                            isSelected={selectedKnowledge === skill.name}
                            isExisting={false}
                            onClick={() =>
                              handleSelectKnowledge(skill.name, skill.category as KnowledgeCategory)
                            }
                          />
                        ))}

                        {/* Already Added section */}
                        {existingKnowledgeList.length > 0 && (
                          <>
                            <div className="my-3 flex items-center gap-2">
                              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                                Already Added
                              </span>
                              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                            </div>
                            {existingKnowledgeList.map((skill) => (
                              <KnowledgeListItem
                                key={skill.name}
                                name={skill.name}
                                category={skill.category}
                                isSelected={false}
                                isExisting={true}
                                onClick={() => {}}
                              />
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Pane: Configuration Panel */}
              <div className="w-1/2 overflow-y-auto p-6">
                {/* Language Configuration */}
                {mode === "language" && effectiveName && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {effectiveName}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Language</p>
                      {selectedLanguageData?.region && (
                        <p className="text-xs text-zinc-400">
                          Region: {selectedLanguageData.region}
                        </p>
                      )}
                    </div>

                    {/* Native / Rated Toggle */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Type
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsNative(true)}
                          disabled={!canAddNative}
                          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            isNative
                              ? "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
                              : canAddNative
                                ? "border-zinc-200 bg-white text-zinc-600 hover:border-amber-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                                : "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
                          }`}
                        >
                          Native (Free)
                          {!canAddNative && (
                            <span className="block text-[10px] text-zinc-400">(max reached)</span>
                          )}
                        </button>
                        <button
                          onClick={() => setIsNative(false)}
                          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                            !isNative
                              ? "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
                              : "border-zinc-200 bg-white text-zinc-600 hover:border-amber-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                          }`}
                        >
                          Rated
                        </button>
                      </div>
                    </div>

                    {/* Rating Selector (only for non-native) */}
                    {!isNative && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Rating
                        </label>
                        <RatingSelector
                          value={languageRating}
                          min={1}
                          max={MAX_SKILL_RATING}
                          onChange={setLanguageRating}
                        />
                      </div>
                    )}

                    {/* Cost */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Cost
                        </span>
                        <span
                          className={`font-semibold ${
                            isNative || calculateLanguageCost() <= pointsRemaining
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {isNative
                            ? "Free"
                            : `${calculateLanguageCost()} pt${calculateLanguageCost() !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Knowledge Configuration */}
                {mode === "knowledge" && effectiveName && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {effectiveName}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Knowledge Skill</p>
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Category
                      </label>
                      <select
                        value={knowledgeCategory}
                        onChange={(e) => setKnowledgeCategory(e.target.value as KnowledgeCategory)}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      >
                        {categoryOptions.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Rating
                      </label>
                      <RatingSelector
                        value={knowledgeRating}
                        min={1}
                        max={MAX_SKILL_RATING}
                        onChange={setKnowledgeRating}
                      />
                    </div>

                    {/* Specialization */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Specialization (optional)
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">+1 pt</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter specialization..."
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          disabled={pointsRemaining < knowledgeRating + SPEC_KNOWLEDGE_POINT_COST}
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-500"
                        />
                        {specialization && (
                          <button
                            onClick={() => setSpecialization("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      {specialization.trim() && (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                            <Star className="h-3 w-3" />
                            {specialization.trim()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cost */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Cost
                        </span>
                        <span
                          className={`font-semibold ${
                            calculateKnowledgeCost() <= pointsRemaining
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {calculateKnowledgeCost()} pt{calculateKnowledgeCost() !== 1 ? "s" : ""}
                          {specialization.trim() && (
                            <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
                              ({knowledgeRating} skill + 1 spec)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!effectiveName && (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    {mode === "language" ? (
                      <Globe className="h-12 w-12" />
                    ) : (
                      <BookOpen className="h-12 w-12" />
                    )}
                    <p className="mt-4 text-sm">
                      Select an item from the list or type a custom name
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span className="mr-2 text-emerald-600 dark:text-emerald-400">
                  {addedThisSession} added
                </span>
              )}
              <span>
                Available:{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {pointsRemaining} pts
                </span>
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
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add {mode === "language" ? "Language" : "Skill"}
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
