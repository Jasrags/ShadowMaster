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
import type { CyberwareGrade, BiowareGrade, ItemLegality, CyberwareItem } from "@/lib/types";
import {
  type CyberlimbLocation,
  type CyberlimbType,
  type CyberlimbAppearance,
  LIMB_TYPE_LOCATIONS,
  LOCATION_SIDE,
  LOCATION_LIMB_TYPE,
  wouldReplaceExisting,
  isBlockedByExisting,
} from "@/lib/types/cyberlimb";
import { hasUnifiedRatings, getRatingTableValue } from "@/lib/types/ratings";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Cpu, Heart, AlertTriangle, Zap, Plus, Ban } from "lucide-react";
import { RatingSelector } from "../shared";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

const GRADE_DISPLAY: Record<string, string> = {
  used: "Used",
  standard: "Standard",
  alpha: "Alpha",
  beta: "Beta",
  delta: "Delta",
};

const CYBERWARE_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "headware", name: "Headware" },
  { id: "eyeware", name: "Eyeware" },
  { id: "earware", name: "Earware" },
  { id: "bodyware", name: "Bodyware" },
  { id: "cyberlimb", name: "Cyberlimbs" },
  { id: "cybernetic-weapon", name: "Weapons" },
];

const BIOWARE_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "basic", name: "Basic" },
  { id: "cultured", name: "Cultured" },
  { id: "cosmetic", name: "Cosmetic" },
];

/** Human-readable category labels for sticky headers */
const CATEGORY_LABELS: Record<string, string> = {
  headware: "Headware",
  eyeware: "Eyeware",
  earware: "Earware",
  bodyware: "Bodyware",
  cyberlimb: "Cyberlimbs",
  "cybernetic-weapon": "Cybernetic Weapons",
  basic: "Basic Bioware",
  cultured: "Cultured Bioware",
  cosmetic: "Cosmetic Bioware",
  other: "Other",
};

// =============================================================================
// TYPES
// =============================================================================

export type AugmentationType = "cyberware" | "bioware";

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
  legality?: ItemLegality;
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

/** Simplified cyberlimb info for conflict checking */
export interface InstalledCyberlimb {
  id: string;
  name: string;
  location: CyberlimbLocation;
  limbType: CyberlimbType;
}

/** Installed skill-linked bioware for duplicate checking */
export interface InstalledSkillLinkedBioware {
  catalogId: string;
  targetSkill: string;
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
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatEssence(value: number): string {
  return value.toFixed(2);
}

function getAvailabilityDisplay(availability: number, legality?: ItemLegality): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

/** Human-readable location labels */
const LOCATION_LABELS: Record<CyberlimbLocation, string> = {
  "left-arm": "Left Arm",
  "right-arm": "Right Arm",
  "left-leg": "Left Leg",
  "right-leg": "Right Leg",
  "left-hand": "Left Hand",
  "right-hand": "Right Hand",
  "left-foot": "Left Foot",
  "right-foot": "Right Foot",
  "left-lower-arm": "Left Lower Arm",
  "right-lower-arm": "Right Lower Arm",
  "left-lower-leg": "Left Lower Leg",
  "right-lower-leg": "Right Lower Leg",
  torso: "Torso",
  skull: "Skull",
};

/** Get conflict status for a location */
function getLocationConflict(
  location: CyberlimbLocation,
  limbType: CyberlimbType,
  installedCyberlimbs: InstalledCyberlimb[]
): {
  type: "blocked" | "replaces" | "none";
  by?: InstalledCyberlimb;
  replaces?: InstalledCyberlimb[];
} {
  const side = LOCATION_SIDE[location];

  // Check each installed cyberlimb on the same side
  for (const installed of installedCyberlimbs) {
    const installedSide = LOCATION_SIDE[installed.location];
    if (installedSide !== side) continue;

    // Check if this location is blocked by an existing larger limb
    if (isBlockedByExisting(limbType, installed.limbType)) {
      return { type: "blocked", by: installed };
    }
  }

  // Check what would be replaced
  const wouldReplace: InstalledCyberlimb[] = [];
  for (const installed of installedCyberlimbs) {
    const installedSide = LOCATION_SIDE[installed.location];
    if (installedSide !== side) continue;

    // Same location = direct replacement
    if (installed.location === location) {
      wouldReplace.push(installed);
      continue;
    }

    // Check hierarchy replacement
    if (wouldReplaceExisting(limbType, installed.limbType)) {
      wouldReplace.push(installed);
    }
  }

  if (wouldReplace.length > 0) {
    return { type: "replaces", replaces: wouldReplace };
  }

  return { type: "none" };
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AugmentationModal({
  isOpen,
  onClose,
  onAdd,
  augmentationType,
  maxAvailability = MAX_AVAILABILITY,
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
  const TypeIcon = isCyberware ? Cpu : Heart;

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
    // Get creation-available grade IDs
    const creationGradeIds = isCyberware
      ? getCreationAvailableCyberwareGrades()
      : getCreationAvailableBiowareGrades();

    // Filter ruleset grades to only those available at creation
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

    // Filter by category
    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)
      );
    }

    // Filter by availability (exclude forbidden)
    // For unified ratings, check minimum rating's availability
    items = items.filter((item) => {
      if (item.legality === "forbidden") return false;

      // For unified ratings items, check the minimum rating's availability
      if (hasUnifiedRatings(item)) {
        const minRating = item.minRating ?? 1;
        const ratingValue = getRatingTableValue(item, minRating);
        const minAvailability = ratingValue?.availability ?? 0;
        return minAvailability <= maxAvailability;
      }

      // Legacy items - check top-level availability
      return (item.availability ?? 0) <= maxAvailability;
    });

    return items;
  }, [isCyberware, cyberwareCatalog, biowareCatalog, category, searchQuery, maxAvailability]);

  // Group items by category for sticky header display
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredItems> = {};
    for (const item of filteredItems) {
      const cat = item.category || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }
    // Sort items within each category alphabetically
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
      // Skip forbidden items
      if (item.legality === "forbidden") return;

      // For unified ratings items, check the minimum rating's availability
      let availability = item.availability ?? 0;
      if (hasUnifiedRatings(item)) {
        const minRating = item.minRating ?? 1;
        const ratingValue = getRatingTableValue(item, minRating);
        availability = ratingValue?.availability ?? 0;
      }

      if (availability <= maxAvailability) {
        counts.all++;
        if (counts[item.category] !== undefined) {
          counts[item.category]++;
        }
      }
    });

    return counts;
  }, [isCyberware, cyberwareCatalog, biowareCatalog, categories, maxAvailability]);

  // Get the raw catalog item (for checking hasRating)
  const rawSelectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    const catalog = isCyberware ? cyberwareCatalog?.catalog : biowareCatalog?.catalog;
    return catalog?.find((i) => i.id === selectedItemId) ?? null;
  }, [selectedItemId, isCyberware, cyberwareCatalog, biowareCatalog]);

  // Reset item-specific state when selected item changes (batched to avoid cascading renders)
  useEffect(() => {
    // Only reset when the item ID actually changes
    if (selectedItemId === prevItemIdRef.current) return;
    prevItemIdRef.current = selectedItemId;

    // Reset rating based on new item
    if (rawSelectedItem && hasUnifiedRatings(rawSelectedItem)) {
      setSelectedRating(rawSelectedItem.minRating ?? 1);
    } else {
      setSelectedRating(1);
    }

    // Reset location (will be handled by validation below if needed)
    setSelectedLocation(null);

    // Reset skill selection
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

  // Validate location when limb type changes (location is reset on item change above)
  useEffect(() => {
    if (selectedLocation && !validLocations.includes(selectedLocation)) {
      // Reset if current location is not valid for new limb type
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

    // Filter by linked attribute if specified
    if (attributeFilter.length > 0) {
      skills = skills.filter((skill) =>
        attributeFilter.includes(skill.linkedAttribute.toLowerCase())
      );
    }

    // Exclude skills already taken by the same bioware type
    // (e.g., can't have two Reflex Recorders for Pistols)
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

    // Check if item uses unified ratings table
    if (hasUnifiedRatings(rawSelectedItem)) {
      const ratingValue = getRatingTableValue(rawSelectedItem, selectedRating);
      if (!ratingValue) {
        // Fall back to first available rating
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
        // Extract rating-specific effects, fall back to top-level values
        attributeBonuses =
          ratingValue.effects?.attributeBonuses ?? rawSelectedItem.attributeBonuses;
        initiativeDiceBonus =
          ratingValue.effects?.initiativeDice ??
          (isCyberware
            ? (rawSelectedItem as CyberwareCatalogItemData).initiativeDiceBonus
            : undefined);
      }
    } else {
      // Legacy item without unified ratings
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

    // Default formula: floor(essenceLoss)
    // Uses augmentationRules.magicReductionFormula for rule variations
    return Math.floor(selectedItem.essenceCost);
  }, [selectedItem, isAwakened, isTechnomancer]);

  // Validation checks
  const canAfford = selectedItem ? selectedItem.cost <= remainingNuyen : true;
  const hasEssence = selectedItem ? selectedItem.essenceCost <= remainingEssence : true;
  const meetsAvailability = selectedItem ? selectedItem.availability <= maxAvailability : true;
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

    // Build the display name - include rating if rated item
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
      // Use rating-specific effects if available, otherwise fall back to top-level
      attributeBonuses = ratingValue?.effects?.attributeBonuses ?? rawSelectedItem.attributeBonuses;
      initiativeDiceBonus =
        ratingValue?.effects?.initiativeDice ??
        (isCyberware
          ? (rawSelectedItem as CyberwareCatalogItemData).initiativeDiceBonus
          : undefined);
    } else {
      // Non-rated items use top-level values
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
      // Add skill name to display for skill-linked bioware
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
    // Stay open for bulk adding - do NOT close
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

  // Helper function to render an item button (extracted for reuse in both flat and grouped views)
  const renderItemButton = (item: CyberwareCatalogItemData | BiowareCatalogItemData) => {
    const isSelected = selectedItemId === item.id;
    const isRatedItem = hasUnifiedRatings(item);

    // Get base values - for rated items, show minimum rating values
    let baseEssence: number;
    let baseCost: number;
    let baseAvail: number;

    if (isRatedItem) {
      const minRating = item.minRating ?? 1;
      const ratingValue = getRatingTableValue(item, minRating);
      baseEssence = ratingValue?.essenceCost ?? 0;
      baseCost = ratingValue?.cost ?? 0;
      baseAvail = ratingValue?.availability ?? 0;
    } else {
      baseEssence = item.essenceCost ?? 0;
      baseCost = item.cost ?? 0;
      baseAvail = item.availability ?? 0;
    }

    // Calculate display values with grade modifiers
    let displayEssence: number;
    let displayCost: number;
    let displayAvail: number;

    if (isCyberware) {
      displayEssence = calculateCyberwareEssenceCost(
        baseEssence,
        grade as CyberwareGrade,
        cyberwareGrades
      );
      displayCost = calculateCyberwareCost(baseCost, grade as CyberwareGrade, cyberwareGrades);
      displayAvail = calculateCyberwareAvailability(
        baseAvail,
        grade as CyberwareGrade,
        cyberwareGrades
      );
    } else {
      displayEssence = calculateBiowareEssenceCost(
        baseEssence,
        grade as BiowareGrade,
        biowareGrades
      );
      displayCost = calculateBiowareCost(baseCost, grade as BiowareGrade, biowareGrades);
      displayAvail = calculateBiowareAvailability(baseAvail, grade as BiowareGrade, biowareGrades);
    }

    const affordable = displayCost <= remainingNuyen;
    const fitsEssence = displayEssence <= remainingEssence;
    const isDisabled = !affordable || !fitsEssence;

    return (
      <button
        key={item.id}
        onClick={() => setSelectedItemId(item.id)}
        disabled={isDisabled}
        className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
          isSelected
            ? isCyberware
              ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
              : "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
            : isDisabled
              ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
              : isCyberware
                ? "text-zinc-700 hover:outline hover:outline-1 hover:outline-cyan-400 dark:text-zinc-300 dark:hover:outline-cyan-500"
                : "text-zinc-700 hover:outline hover:outline-1 hover:outline-pink-400 dark:text-zinc-300 dark:hover:outline-pink-500"
        }`}
      >
        <div className="min-w-0 flex-1">
          <span className="block truncate font-medium">
            {item.name}
            {isRatedItem && (
              <span className="ml-1 font-normal text-zinc-500 dark:text-zinc-400">
                (R{item.minRating}-{item.maxRating})
              </span>
            )}
          </span>
          <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
            <span
              className={
                isCyberware
                  ? "text-cyan-600 dark:text-cyan-400"
                  : "text-pink-600 dark:text-pink-400"
              }
            >
              {formatEssence(displayEssence)}
              {isRatedItem ? "+" : ""} ESS
            </span>
            <span>
              {formatCurrency(displayCost)}
              {isRatedItem ? "+" : ""}¥
            </span>
            <span>
              Avail {getAvailabilityDisplay(displayAvail, item.legality)}
              {isRatedItem ? "+" : ""}
            </span>
          </div>
        </div>
      </button>
    );
  };

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
            <div
              className={`ml-2 rounded-lg p-1.5 ${
                isCyberware
                  ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300"
                  : "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300"
              }`}
            >
              <TypeIcon className="h-4 w-4" />
            </div>
          </ModalHeader>

          {/* Type Toggle - Cyberware / Bioware */}
          <div className="flex gap-2 border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            <button
              onClick={() => handleTypeChange("cyberware")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeType === "cyberware"
                  ? "bg-cyan-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <Cpu className="h-4 w-4" />
              Cyberware
            </button>
            <button
              onClick={() => handleTypeChange("bioware")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeType === "bioware"
                  ? "bg-pink-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <Heart className="h-4 w-4" />
              Bioware
            </button>
          </div>

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={`Search ${isCyberware ? "cyberware" : "bioware"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
                  isCyberware
                    ? "focus:border-cyan-500 focus:ring-cyan-500"
                    : "focus:border-pink-500 focus:ring-pink-500"
                }`}
              />
            </div>

            {/* Category Filter with counts */}
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    category === cat.id
                      ? isCyberware
                        ? "bg-cyan-500 text-white"
                        : "bg-pink-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.name}
                  {categoryCounts[cat.id] > 0 && (
                    <span className="ml-1 opacity-70">({categoryCounts[cat.id]})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Grade Selector */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Grade:</span>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as CyberwareGrade | BiowareGrade)}
                className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {availableGrades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {GRADE_DISPLAY[g.id]} ({g.essenceMultiplier}x ESS, {g.costMultiplier}x cost)
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                      {items.map((item) => renderItemButton(item))}
                    </div>
                  ))
                ) : (
                  // Flat view when filtered by specific category
                  filteredItems.map((item) => renderItemButton(item))
                )}
              </div>

              {/* Right Pane - Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedItem ? (
                  <div className="space-y-4">
                    {/* Item Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedItem.name}
                      </h3>
                      {selectedItem.description && (
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {selectedItem.description}
                        </p>
                      )}
                    </div>

                    {/* Rating Selector for rated items */}
                    {rawSelectedItem && hasUnifiedRatings(rawSelectedItem) && (
                      <RatingSelector
                        item={rawSelectedItem}
                        selectedRating={selectedRating}
                        onRatingChange={setSelectedRating}
                        maxAvailability={maxAvailability}
                        showCostPreview={false}
                        showEssencePreview={false}
                        label="Rating"
                      />
                    )}

                    {/* Location Selector for cyberlimbs */}
                    {isCyberlimb && validLocations.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Installation Location <span className="text-red-500">*</span>
                        </h4>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {validLocations.map((location) => {
                            const conflict = getLocationConflict(
                              location,
                              selectedLimbType!,
                              installedCyberlimbs
                            );
                            const isSelected = selectedLocation === location;
                            const isBlocked = conflict.type === "blocked";
                            const willReplace = conflict.type === "replaces";

                            return (
                              <button
                                key={location}
                                onClick={() => !isBlocked && setSelectedLocation(location)}
                                disabled={isBlocked}
                                className={`relative flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                                  isSelected
                                    ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-400 dark:bg-cyan-900/30 dark:text-cyan-300"
                                    : isBlocked
                                      ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500"
                                      : willReplace
                                        ? "border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-400 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-300"
                                        : "border-zinc-200 text-zinc-700 hover:border-cyan-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-cyan-500"
                                }`}
                              >
                                <span>{LOCATION_LABELS[location]}</span>
                                {isBlocked && <Ban className="h-4 w-4 text-zinc-400" />}
                                {willReplace && !isSelected && (
                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Conflict Messages */}
                        {locationConflict.type === "blocked" && locationConflict.by && (
                          <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 p-2 text-xs dark:bg-red-900/20">
                            <Ban className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                            <span className="text-red-700 dark:text-red-300">
                              Blocked by existing {locationConflict.by.name}. Remove it first to
                              install here.
                            </span>
                          </div>
                        )}
                        {locationConflict.type === "replaces" && locationConflict.replaces && (
                          <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                            <span className="text-amber-700 dark:text-amber-300">
                              Will replace:{" "}
                              {locationConflict.replaces.map((l) => l.name).join(", ")}
                            </span>
                          </div>
                        )}
                        {!selectedLocation && (
                          <p className="mt-2 text-xs text-red-500">
                            Please select where to install this cyberlimb
                          </p>
                        )}
                      </div>
                    )}

                    {/* Skill Selector for skill-linked bioware (e.g., Reflex Recorder) */}
                    {requiresSkillSelection && filteredSkills.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Target Skill <span className="text-red-500">*</span>
                        </h4>
                        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                          Select the skill this bioware will enhance
                        </p>
                        <select
                          value={selectedSkill ?? ""}
                          onChange={(e) => setSelectedSkill(e.target.value || null)}
                          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        >
                          <option value="">Select a skill...</option>
                          {filteredSkills.map((skill) => (
                            <option key={skill.id} value={skill.id}>
                              {skill.name} ({skill.linkedAttribute})
                            </option>
                          ))}
                        </select>
                        {!selectedSkill && (
                          <p className="mt-2 text-xs text-red-500">
                            Please select a target skill for this bioware
                          </p>
                        )}
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Essence</div>
                        <div
                          className={`mt-1 text-xl font-mono font-bold ${
                            hasEssence
                              ? isCyberware
                                ? "text-cyan-600 dark:text-cyan-400"
                                : "text-pink-600 dark:text-pink-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatEssence(selectedItem.essenceCost)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Cost</div>
                        <div
                          className={`mt-1 text-xl font-mono font-bold ${
                            canAfford
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(selectedItem.cost)}¥
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Availability</div>
                        <div
                          className={`mt-1 text-xl font-mono font-bold ${
                            meetsAvailability
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {getAvailabilityDisplay(selectedItem.availability, selectedItem.legality)}
                        </div>
                      </div>
                    </div>

                    {/* Capacity info for cyberware */}
                    {isCyberware && (selectedItem as CyberwareCatalogItemData).capacity && (
                      <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-blue-700 dark:text-blue-300">
                          Capacity: {(selectedItem as CyberwareCatalogItemData).capacity} - Can
                          install enhancements
                        </span>
                      </div>
                    )}

                    {/* Attribute bonuses and Initiative dice */}
                    {((selectedItem.attributeBonuses &&
                      Object.keys(selectedItem.attributeBonuses).length > 0) ||
                      selectedItem.initiativeDiceBonus) && (
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Bonuses
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedItem.attributeBonuses &&
                            Object.entries(selectedItem.attributeBonuses).map(([attr, bonus]) => (
                              <span
                                key={attr}
                                className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                              >
                                {attr}: +{bonus}
                              </span>
                            ))}
                          {selectedItem.initiativeDiceBonus && (
                            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                              +{selectedItem.initiativeDiceBonus}D6 Initiative
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Wireless bonus */}
                    {isCyberware && (selectedItem as CyberwareCatalogItemData).wirelessBonus && (
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Wireless Bonus
                        </h4>
                        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                          {(selectedItem as CyberwareCatalogItemData).wirelessBonus}
                        </p>
                      </div>
                    )}

                    {/* Magic/Resonance warning */}
                    {(isAwakened || isTechnomancer) && projectedMagicLoss > 0 && (
                      <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div className="text-xs text-amber-800 dark:text-amber-200">
                          <p className="font-medium">
                            {isAwakened ? "Magic" : "Resonance"} will be reduced by{" "}
                            {projectedMagicLoss}
                          </p>
                          <p className="mt-0.5">
                            New rating:{" "}
                            {Math.max(
                              0,
                              (isAwakened ? currentMagic : currentResonance) - projectedMagicLoss
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Validation errors */}
                    {!canAfford && (
                      <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        Not enough nuyen ({formatCurrency(remainingNuyen)}¥ remaining)
                      </div>
                    )}
                    {!hasEssence && (
                      <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        Not enough essence ({formatEssence(remainingEssence)} remaining)
                      </div>
                    )}
                    {!meetsAvailability && (
                      <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        Exceeds availability limit ({maxAvailability})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    <TypeIcon className="h-12 w-12" />
                    <p className="mt-4 text-sm">
                      Select {isCyberware ? "cyberware" : "bioware"} from the list
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
