"use client";

/**
 * AugmentationModal
 *
 * Split-pane modal for adding cyberware or bioware during character creation.
 * Features:
 * - Category filtering
 * - Grade selection with cost/essence multipliers
 * - Search functionality
 * - Real-time cost, essence, availability preview
 * - Magic/Resonance loss warning for awakened characters
 */

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import {
  useCyberware,
  useBioware,
  useCyberwareGrades,
  useBiowareGrades,
  useSkills,
  calculateCyberwareEssenceCost,
  calculateCyberwareCost,
  calculateCyberwareAvailability,
  calculateBiowareEssenceCost,
  calculateBiowareCost,
  calculateBiowareAvailability,
  type CyberwareCatalogItemData,
  type BiowareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import {
  getCreationAvailableCyberwareGrades,
  getCreationAvailableBiowareGrades,
} from "@/lib/rules/augmentations/grades";
import type { CyberwareGrade, BiowareGrade } from "@/lib/types";
import {
  type CyberlimbLocation,
  type CyberlimbType,
  type CyberlimbAppearance,
  LIMB_TYPE_LOCATIONS,
} from "@/lib/types/cyberlimb";
import { hasUnifiedRatings, getRatingTableValue } from "@/lib/types/ratings";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Plus } from "lucide-react";
import {
  MAX_AVAILABILITY,
  CATEGORY_LABELS,
  CYBERWARE_CATEGORIES,
  BIOWARE_CATEGORIES,
  LOCATION_LABELS,
  getLocationConflict,
  formatCurrency,
  formatEssence,
  type AugmentationType,
  type InstalledCyberlimb,
  type InstalledSkillLinkedBioware,
} from "./augmentationModalHelpers";
import { AugmentationFilters, AugmentationHeaderIcon } from "./AugmentationFilters";
import { AugmentationItemButton } from "./AugmentationItemButton";
import { AugmentationDetailsPane } from "./AugmentationDetailsPane";

// Re-export types for barrel export compatibility
export type { AugmentationType, InstalledCyberlimb, InstalledSkillLinkedBioware };

// =============================================================================
// TYPES
// =============================================================================

export interface AugmentationSelection {
  type: AugmentationType;
  catalogId: string;
  name: string;
  category: string;
  grade: CyberwareGrade | BiowareGrade;
  baseEssenceCost: number;
  essenceCost: number;
  cost: number;
  availability: number;
  legality?: import("@/lib/types").ItemLegality;
  capacity?: number;
  rating?: number;
  attributeBonuses?: Record<string, number>;
  initiativeDiceBonus?: number;
  wirelessBonus?: string;
  armorBonus?: number;
  // Cyberlimb-specific fields
  location?: CyberlimbLocation;
  limbType?: CyberlimbType;
  appearance?: CyberlimbAppearance;
  baseStrength?: number;
  baseAgility?: number;
  // Skill-linked bioware fields
  targetSkill?: string;
}

interface AugmentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (augmentation: AugmentationSelection) => void;
  augmentationType: AugmentationType;
  maxAvailability?: number;
  remainingEssence: number;
  remainingNuyen: number;
  isAwakened?: boolean;
  isTechnomancer?: boolean;
  currentMagic?: number;
  currentResonance?: number;
  /** Installed cyberlimbs for conflict checking */
  installedCyberlimbs?: InstalledCyberlimb[];
  /** Installed skill-linked bioware for duplicate skill checking */
  installedSkillLinkedBioware?: InstalledSkillLinkedBioware[];
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AugmentationModal({
  isOpen,
  onClose,
  onAdd,
  augmentationType,
  maxAvailability: maxAvail = MAX_AVAILABILITY,
  remainingEssence,
  remainingNuyen,
  isAwakened,
  isTechnomancer,
  currentMagic = 0,
  currentResonance = 0,
  installedCyberlimbs = [],
  installedSkillLinkedBioware = [],
}: AugmentationModalProps) {
  const cyberwareCatalog = useCyberware({ excludeForbidden: false });
  const biowareCatalog = useBioware({ excludeForbidden: false });
  const cyberwareGrades = useCyberwareGrades();
  const biowareGrades = useBiowareGrades();
  const { activeSkills } = useSkills();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [grade, setGrade] = useState<CyberwareGrade | BiowareGrade>("standard");
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<number>(1);
  const [selectedLocation, setSelectedLocation] = useState<CyberlimbLocation | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Internal type state for unified modal - allows switching between cyberware/bioware
  const [activeType, setActiveType] = useState<AugmentationType>(augmentationType);

  // Track previous values to avoid cascading renders from setState in effects
  const prevItemIdRef = useRef<string | null>(null);

  const isCyberware = activeType === "cyberware";
  const categories = isCyberware ? CYBERWARE_CATEGORIES : BIOWARE_CATEGORIES;

  // Reset state when modal opens/closes or type changes
  const resetState = useCallback(() => {
    setSelectedItemId(null);
    setGrade("standard");
    setCategory("all");
    setSearchQuery("");
    setSelectedRating(1);
    setSelectedLocation(null);
    setSelectedSkill(null);
    setAddedThisSession(0);
    setActiveType(augmentationType);
  }, [augmentationType]);

  // Reset to initial type when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveType(augmentationType);
      setCategory("all");
      setSelectedItemId(null);
    }
  }, [isOpen, augmentationType]);

  // Partial reset for bulk-add flow - preserves search, category, and grade
  const resetForNextItem = useCallback(() => {
    setSelectedItemId(null);
    setSelectedRating(1);
    setSelectedLocation(null);
    setSelectedSkill(null);
  }, []);

  // Available grades based on type, filtered by creation restrictions
  const availableGrades = useMemo(() => {
    const creationGradeIds = isCyberware
      ? getCreationAvailableCyberwareGrades()
      : getCreationAvailableBiowareGrades();

    const allGrades = isCyberware ? cyberwareGrades : biowareGrades;
    return allGrades.filter((g) =>
      creationGradeIds.includes(g.id as (typeof creationGradeIds)[number])
    );
  }, [isCyberware, cyberwareGrades, biowareGrades]);

  // Filter catalog items
  const filteredItems = useMemo(() => {
    const catalog = isCyberware ? cyberwareCatalog?.catalog : biowareCatalog?.catalog;
    if (!catalog) return [];

    let items = [...catalog];

    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)
      );
    }

    items = items.filter((item) => {
      if (item.legality === "forbidden") return false;

      if (hasUnifiedRatings(item)) {
        const minRating = item.minRating ?? 1;
        const ratingValue = getRatingTableValue(item, minRating);
        const minAvailability = ratingValue?.availability ?? 0;
        return minAvailability <= maxAvail;
      }

      return (item.availability ?? 0) <= maxAvail;
    });

    return items;
  }, [isCyberware, cyberwareCatalog, biowareCatalog, category, searchQuery, maxAvail]);

  // Group items by category for sticky header display
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredItems> = {};
    for (const item of filteredItems) {
      const cat = item.category || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }
    Object.values(grouped).forEach((items) => {
      items.sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredItems]);

  // Calculate item counts per category for display in tabs
  const categoryCounts = useMemo(() => {
    const catalog = isCyberware ? cyberwareCatalog?.catalog : biowareCatalog?.catalog;
    const counts: Record<string, number> = { all: 0 };

    for (const cat of categories) {
      counts[cat.id] = 0;
    }

    catalog?.forEach((item) => {
      if (item.legality === "forbidden") return;

      let availability = item.availability ?? 0;
      if (hasUnifiedRatings(item)) {
        const minRating = item.minRating ?? 1;
        const ratingValue = getRatingTableValue(item, minRating);
        availability = ratingValue?.availability ?? 0;
      }

      if (availability <= maxAvail) {
        counts.all++;
        if (counts[item.category] !== undefined) {
          counts[item.category]++;
        }
      }
    });

    return counts;
  }, [isCyberware, cyberwareCatalog, biowareCatalog, categories, maxAvail]);

  // Get the raw catalog item (for checking hasRating)
  const rawSelectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    const catalog = isCyberware ? cyberwareCatalog?.catalog : biowareCatalog?.catalog;
    return catalog?.find((i) => i.id === selectedItemId) ?? null;
  }, [selectedItemId, isCyberware, cyberwareCatalog, biowareCatalog]);

  // Reset item-specific state when selected item changes
  useEffect(() => {
    if (selectedItemId === prevItemIdRef.current) return;
    prevItemIdRef.current = selectedItemId;

    if (rawSelectedItem && hasUnifiedRatings(rawSelectedItem)) {
      setSelectedRating(rawSelectedItem.minRating ?? 1);
    } else {
      setSelectedRating(1);
    }

    setSelectedLocation(null);
    setSelectedSkill(null);
  }, [selectedItemId, rawSelectedItem]);

  // Check if selected item is a cyberlimb
  const isCyberlimb = useMemo(() => {
    if (!rawSelectedItem) return false;
    return rawSelectedItem.category === "cyberlimb" && "limbType" in rawSelectedItem;
  }, [rawSelectedItem]);

  // Get the limb type of the selected cyberlimb
  const selectedLimbType = useMemo((): CyberlimbType | null => {
    if (!isCyberlimb || !rawSelectedItem) return null;
    return (
      (rawSelectedItem as CyberwareCatalogItemData & { limbType?: CyberlimbType }).limbType ?? null
    );
  }, [isCyberlimb, rawSelectedItem]);

  // Get valid locations for the selected cyberlimb
  const validLocations = useMemo((): CyberlimbLocation[] => {
    if (!selectedLimbType) return [];
    return LIMB_TYPE_LOCATIONS[selectedLimbType] || [];
  }, [selectedLimbType]);

  // Validate location when limb type changes
  useEffect(() => {
    if (selectedLocation && !validLocations.includes(selectedLocation)) {
      setSelectedLocation(null);
    }
  }, [validLocations, selectedLocation]);

  // Get conflict status for the selected location
  const locationConflict = useMemo(() => {
    if (!selectedLocation || !selectedLimbType) {
      return { type: "none" as const };
    }
    return getLocationConflict(selectedLocation, selectedLimbType, installedCyberlimbs);
  }, [selectedLocation, selectedLimbType, installedCyberlimbs]);

  // Check if selected bioware requires skill selection
  const requiresSkillSelection = useMemo(() => {
    if (!rawSelectedItem || isCyberware) return false;
    return (rawSelectedItem as BiowareCatalogItemData).requiresSkillTarget === true;
  }, [rawSelectedItem, isCyberware]);

  // Get skills already taken by this specific bioware type
  const takenSkillsForBioware = useMemo(() => {
    if (!rawSelectedItem) return new Set<string>();
    return new Set(
      installedSkillLinkedBioware
        .filter((b) => b.catalogId === rawSelectedItem.id)
        .map((b) => b.targetSkill)
    );
  }, [rawSelectedItem, installedSkillLinkedBioware]);

  // Get valid skills filtered by attribute filter (excludes already-taken skills)
  const filteredSkills = useMemo(() => {
    if (!requiresSkillSelection || !rawSelectedItem) return [];
    const biowareItem = rawSelectedItem as BiowareCatalogItemData;
    const attributeFilter = biowareItem.skillAttributeFilter ?? [];

    let skills = activeSkills;

    if (attributeFilter.length > 0) {
      skills = skills.filter((skill) =>
        attributeFilter.includes(skill.linkedAttribute.toLowerCase())
      );
    }

    skills = skills.filter((skill) => !takenSkillsForBioware.has(skill.id));

    return skills;
  }, [requiresSkillSelection, rawSelectedItem, activeSkills, takenSkillsForBioware]);

  // Selected item with calculated values (including rating-based values)
  const selectedItem = useMemo(() => {
    if (!rawSelectedItem) return null;

    let baseEssenceCost: number;
    let baseCost: number;
    let baseAvailability: number;
    let capacity: number | undefined;
    let attributeBonuses: Record<string, number> | undefined;
    let initiativeDiceBonus: number | undefined;

    if (hasUnifiedRatings(rawSelectedItem)) {
      const ratingValue = getRatingTableValue(rawSelectedItem, selectedRating);
      if (!ratingValue) {
        const firstRating = rawSelectedItem.minRating ?? 1;
        const firstValue = getRatingTableValue(rawSelectedItem, firstRating);
        baseEssenceCost = firstValue?.essenceCost ?? 0;
        baseCost = firstValue?.cost ?? 0;
        baseAvailability = firstValue?.availability ?? 0;
        capacity = firstValue?.capacity;
        attributeBonuses =
          firstValue?.effects?.attributeBonuses ?? rawSelectedItem.attributeBonuses;
        initiativeDiceBonus =
          firstValue?.effects?.initiativeDice ??
          (isCyberware
            ? (rawSelectedItem as CyberwareCatalogItemData).initiativeDiceBonus
            : undefined);
      } else {
        baseEssenceCost = ratingValue.essenceCost ?? 0;
        baseCost = ratingValue.cost ?? 0;
        baseAvailability = ratingValue.availability ?? 0;
        capacity = ratingValue.capacity;
        attributeBonuses =
          ratingValue.effects?.attributeBonuses ?? rawSelectedItem.attributeBonuses;
        initiativeDiceBonus =
          ratingValue.effects?.initiativeDice ??
          (isCyberware
            ? (rawSelectedItem as CyberwareCatalogItemData).initiativeDiceBonus
            : undefined);
      }
    } else {
      baseEssenceCost = rawSelectedItem.essenceCost ?? 0;
      baseCost = rawSelectedItem.cost ?? 0;
      baseAvailability = rawSelectedItem.availability ?? 0;
      capacity = isCyberware ? (rawSelectedItem as CyberwareCatalogItemData).capacity : undefined;
      attributeBonuses = rawSelectedItem.attributeBonuses;
      initiativeDiceBonus = isCyberware
        ? (rawSelectedItem as CyberwareCatalogItemData).initiativeDiceBonus
        : undefined;
    }

    // Apply grade modifiers
    let essenceCost: number;
    let cost: number;
    let availability: number;

    if (isCyberware) {
      essenceCost = calculateCyberwareEssenceCost(
        baseEssenceCost,
        grade as CyberwareGrade,
        cyberwareGrades
      );
      cost = calculateCyberwareCost(baseCost, grade as CyberwareGrade, cyberwareGrades);
      availability = calculateCyberwareAvailability(
        baseAvailability,
        grade as CyberwareGrade,
        cyberwareGrades
      );
    } else {
      essenceCost = calculateBiowareEssenceCost(
        baseEssenceCost,
        grade as BiowareGrade,
        biowareGrades
      );
      cost = calculateBiowareCost(baseCost, grade as BiowareGrade, biowareGrades);
      availability = calculateBiowareAvailability(
        baseAvailability,
        grade as BiowareGrade,
        biowareGrades
      );
    }

    return {
      ...rawSelectedItem,
      essenceCost,
      cost,
      availability,
      capacity,
      baseEssenceCost,
      attributeBonuses,
      initiativeDiceBonus,
    };
  }, [rawSelectedItem, selectedRating, grade, isCyberware, cyberwareGrades, biowareGrades]);

  // Calculate magic/resonance loss
  const projectedMagicLoss = useMemo(() => {
    if (!selectedItem) return 0;
    if (!isAwakened && !isTechnomancer) return 0;
    return Math.floor(selectedItem.essenceCost);
  }, [selectedItem, isAwakened, isTechnomancer]);

  // Validation checks
  const canAfford = selectedItem ? selectedItem.cost <= remainingNuyen : true;
  const hasEssence = selectedItem ? selectedItem.essenceCost <= remainingEssence : true;
  const meetsAvailability = selectedItem ? selectedItem.availability <= maxAvail : true;
  const hasRequiredLocation = isCyberlimb ? selectedLocation !== null : true;
  const hasRequiredSkill = requiresSkillSelection ? selectedSkill !== null : true;
  const isNotBlocked = locationConflict.type !== "blocked";
  const canAdd =
    selectedItem &&
    canAfford &&
    hasEssence &&
    meetsAvailability &&
    hasRequiredLocation &&
    hasRequiredSkill &&
    isNotBlocked;

  // Handle add
  const handleAdd = useCallback(() => {
    if (!selectedItem || !canAdd || !rawSelectedItem) return;

    const isRatedItem = hasUnifiedRatings(rawSelectedItem);
    const displayName = isRatedItem
      ? `${rawSelectedItem.name} (Rating ${selectedRating})`
      : rawSelectedItem.name;

    // Extract effects from rating table if applicable
    let armorBonus: number | undefined;
    let attributeBonuses: Record<string, number> | undefined;
    let initiativeDiceBonus: number | undefined;
    if (isRatedItem) {
      const ratingValue = getRatingTableValue(rawSelectedItem, selectedRating);
      armorBonus = ratingValue?.effects?.armorBonus;
      attributeBonuses = ratingValue?.effects?.attributeBonuses ?? rawSelectedItem.attributeBonuses;
      initiativeDiceBonus =
        ratingValue?.effects?.initiativeDice ??
        (isCyberware
          ? (rawSelectedItem as CyberwareCatalogItemData).initiativeDiceBonus
          : undefined);
    } else {
      attributeBonuses = rawSelectedItem.attributeBonuses;
      initiativeDiceBonus = isCyberware
        ? (rawSelectedItem as CyberwareCatalogItemData).initiativeDiceBonus
        : undefined;
    }

    // Extract cyberlimb-specific fields
    const cyberlimbData = isCyberlimb
      ? (rawSelectedItem as CyberwareCatalogItemData & {
          limbType?: CyberlimbType;
          appearance?: CyberlimbAppearance;
          baseStrength?: number;
          baseAgility?: number;
        })
      : null;

    // Build display name with location for cyberlimbs or skill for skill-linked bioware
    let finalDisplayName = displayName;
    if (isCyberlimb && selectedLocation) {
      finalDisplayName = `${displayName} (${LOCATION_LABELS[selectedLocation]})`;
    } else if (requiresSkillSelection && selectedSkill) {
      const skillData = activeSkills.find((s) => s.id === selectedSkill);
      if (skillData) {
        finalDisplayName = `${displayName} (${skillData.name})`;
      }
    }

    const selection: AugmentationSelection = {
      type: activeType,
      catalogId: rawSelectedItem.id,
      name: finalDisplayName,
      category: rawSelectedItem.category,
      grade,
      baseEssenceCost: selectedItem.baseEssenceCost,
      essenceCost: selectedItem.essenceCost,
      cost: selectedItem.cost,
      availability: selectedItem.availability,
      legality: rawSelectedItem.legality,
      capacity: selectedItem.capacity,
      rating: isRatedItem ? selectedRating : undefined,
      attributeBonuses,
      initiativeDiceBonus,
      wirelessBonus: isCyberware
        ? (rawSelectedItem as CyberwareCatalogItemData).wirelessBonus
        : undefined,
      armorBonus,
      // Cyberlimb-specific fields
      location: isCyberlimb ? (selectedLocation ?? undefined) : undefined,
      limbType: cyberlimbData?.limbType,
      appearance: cyberlimbData?.appearance,
      baseStrength: cyberlimbData?.baseStrength,
      baseAgility: cyberlimbData?.baseAgility,
      // Skill-linked bioware fields
      targetSkill: requiresSkillSelection ? (selectedSkill ?? undefined) : undefined,
    };

    onAdd(selection);
    setAddedThisSession((prev) => prev + 1);
    resetForNextItem();
  }, [
    selectedItem,
    rawSelectedItem,
    canAdd,
    isCyberware,
    isCyberlimb,
    selectedRating,
    selectedLocation,
    requiresSkillSelection,
    selectedSkill,
    activeSkills,
    activeType,
    grade,
    onAdd,
    resetForNextItem,
  ]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Handle type change - reset category and selection
  const handleTypeChange = useCallback((newType: AugmentationType) => {
    setActiveType(newType);
    setCategory("all");
    setSelectedItemId(null);
    setSelectedRating(1);
    setSelectedLocation(null);
    setSelectedSkill(null);
  }, []);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Augmentation" onClose={close}>
            <AugmentationHeaderIcon activeType={activeType} />
          </ModalHeader>

          <AugmentationFilters
            activeType={activeType}
            onTypeChange={handleTypeChange}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            category={category}
            onCategoryChange={setCategory}
            categoryCounts={categoryCounts}
            grade={grade}
            onGradeChange={setGrade}
            availableGrades={availableGrades}
          />

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - Item List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-sm text-zinc-500">
                    No {isCyberware ? "cyberware" : "bioware"} found
                  </div>
                ) : category === "all" ? (
                  // Grouped view with sticky headers when showing all categories
                  Object.entries(itemsByCategory).map(([cat, items]) => (
                    <div key={cat}>
                      <div className="sticky top-0 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {CATEGORY_LABELS[cat] || cat}
                      </div>
                      {items.map((item) => (
                        <AugmentationItemButton
                          key={item.id}
                          item={item}
                          isCyberware={isCyberware}
                          grade={grade}
                          cyberwareGrades={cyberwareGrades}
                          biowareGrades={biowareGrades}
                          remainingNuyen={remainingNuyen}
                          remainingEssence={remainingEssence}
                          isSelected={selectedItemId === item.id}
                          onSelect={setSelectedItemId}
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  // Flat view when filtered by specific category
                  filteredItems.map((item) => (
                    <AugmentationItemButton
                      key={item.id}
                      item={item}
                      isCyberware={isCyberware}
                      grade={grade}
                      cyberwareGrades={cyberwareGrades}
                      biowareGrades={biowareGrades}
                      remainingNuyen={remainingNuyen}
                      remainingEssence={remainingEssence}
                      isSelected={selectedItemId === item.id}
                      onSelect={setSelectedItemId}
                    />
                  ))
                )}
              </div>

              {/* Right Pane - Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                <AugmentationDetailsPane
                  activeType={activeType}
                  selectedItem={selectedItem}
                  rawSelectedItem={rawSelectedItem}
                  canAfford={canAfford}
                  hasEssence={hasEssence}
                  meetsAvailability={meetsAvailability}
                  maxAvailability={maxAvail}
                  selectedRating={selectedRating}
                  onRatingChange={setSelectedRating}
                  isCyberlimb={isCyberlimb}
                  validLocations={validLocations}
                  selectedLocation={selectedLocation}
                  onLocationChange={setSelectedLocation}
                  selectedLimbType={selectedLimbType}
                  locationConflict={locationConflict}
                  installedCyberlimbs={installedCyberlimbs}
                  requiresSkillSelection={requiresSkillSelection}
                  filteredSkills={filteredSkills}
                  selectedSkill={selectedSkill}
                  onSkillChange={setSelectedSkill}
                  isAwakened={isAwakened}
                  isTechnomancer={isTechnomancer}
                  projectedMagicLoss={projectedMagicLoss}
                  currentMagic={currentMagic}
                  currentResonance={currentResonance}
                  remainingNuyen={remainingNuyen}
                  remainingEssence={remainingEssence}
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span
                  className={`mr-2 ${isCyberware ? "text-cyan-600 dark:text-cyan-400" : "text-pink-600 dark:text-pink-400"}`}
                >
                  {addedThisSession} added
                </span>
              )}
              <span>
                Essence: <span className="font-medium">{formatEssence(remainingEssence)}</span>
                {" | "}
                Budget:{" "}
                <span className="font-mono font-medium">{formatCurrency(remainingNuyen)}¥</span>
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
                    ? isCyberware
                      ? "bg-cyan-500 text-white hover:bg-cyan-600"
                      : "bg-pink-500 text-white hover:bg-pink-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                <Plus className="h-4 w-4" />
                Add {isCyberware ? "Cyberware" : "Bioware"}
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
