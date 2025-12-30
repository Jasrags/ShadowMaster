"use client";

/**
 * AugmentationModal - Modal for browsing and selecting augmentations
 *
 * Features:
 * - Category filtering (cyberware/bioware subcategories)
 * - Grade selector with cost/essence preview
 * - Rating selector for rated items
 * - Augmentation details (description, wireless bonus, page ref)
 * - Install preview (essence cost, stats impact)
 */

import { useState, useMemo, useCallback } from "react";
import type { CyberwareGrade, BiowareGrade, CyberwareItem, BiowareItem } from "@/lib/types";
import {
  useCyberware,
  useBioware,
  useCyberwareGrades,
  useBiowareGrades,
  useAugmentationRules,
  calculateCyberwareEssenceCost,
  calculateCyberwareCost,
  calculateCyberwareAvailability,
  calculateBiowareEssenceCost,
  calculateBiowareCost,
  calculateBiowareAvailability,
  type CyberwareCatalogItemData,
  type BiowareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import { EssenceDisplay, EssenceCostBadge } from "@/components/EssenceDisplay";
import { RatingSelector } from "./RatingSelector";
import { convertLegacyRatingSpec, calculateRatedItemValues } from "@/lib/rules/ratings";

// =============================================================================
// TYPES
// =============================================================================

type AugmentationType = "cyberware" | "bioware";

type CyberwareCategory =
  | "all"
  | "headware"
  | "eyeware"
  | "earware"
  | "bodyware"
  | "cyberlimb"
  | "cyberlimb-enhancement"
  | "cyberlimb-accessory";

type BiowareCategory = "all" | "basic" | "cultured" | "cosmetic" | "bio-weapons" | "chemical-gland" | "organ";

interface AugmentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current essence value */
  currentEssence: number;
  /** Maximum essence */
  maxEssence?: number;
  /** Remaining nuyen budget */
  remainingNuyen: number;
  /** Current attribute bonuses from installed augmentations */
  currentAttributeBonuses: Record<string, number>;
  /** Magic rating (for awakened characters) */
  magicRating?: number;
  /** Resonance rating (for technomancers) */
  resonanceRating?: number;
  /** Callback when cyberware is installed */
  onInstallCyberware?: (item: CyberwareItem) => void;
  /** Callback when bioware is installed */
  onInstallBioware?: (item: BiowareItem) => void;
  /** Initial type to show */
  initialType?: AugmentationType;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

const CYBERWARE_CATEGORIES: Array<{ id: CyberwareCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "headware", label: "Headware" },
  { id: "eyeware", label: "Eyeware" },
  { id: "earware", label: "Earware" },
  { id: "bodyware", label: "Bodyware" },
  { id: "cyberlimb", label: "Cyberlimbs" },
  { id: "cyberlimb-enhancement", label: "Enhancements" },
  { id: "cyberlimb-accessory", label: "Accessories" },
];

const BIOWARE_CATEGORIES: Array<{ id: BiowareCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "basic", label: "Basic" },
  { id: "cultured", label: "Cultured" },
  { id: "cosmetic", label: "Cosmetic" },
  { id: "bio-weapons", label: "Bio-Weapons" },
  { id: "chemical-gland", label: "Chemical Glands" },
  { id: "organ", label: "Organs" },
];

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

function getAvailabilityDisplay(
  availability: number,
  restricted?: boolean,
  forbidden?: boolean
): string {
  let display = String(availability);
  if (restricted) display += "R";
  if (forbidden) display += "F";
  return display;
}

function getGradeDisplayName(grade: CyberwareGrade | BiowareGrade): string {
  const names: Record<string, string> = {
    used: "Used",
    standard: "Standard",
    alpha: "Alphaware",
    beta: "Betaware",
    delta: "Deltaware",
  };
  return names[grade] || grade;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AugmentationModal({
  isOpen,
  onClose,
  currentEssence,
  maxEssence = 6,
  remainingNuyen,
  currentAttributeBonuses,
  magicRating,
  resonanceRating,
  onInstallCyberware,
  onInstallBioware,
  initialType = "cyberware",
}: AugmentationModalProps) {
  // Catalog data
  const cyberwareCatalog = useCyberware({ excludeForbidden: false });
  const biowareCatalog = useBioware({ excludeForbidden: false });
  const cyberwareGrades = useCyberwareGrades();
  const biowareGrades = useBiowareGrades();
  const augmentationRules = useAugmentationRules();

  // State
  const [augmentationType, setAugmentationType] = useState<AugmentationType>(initialType);
  const [cyberwareCategory, setCyberwareCategory] = useState<CyberwareCategory>("all");
  const [biowareCategory, setBiowareCategory] = useState<BiowareCategory>("all");
  const [selectedGrade, setSelectedGrade] = useState<CyberwareGrade | BiowareGrade>("standard");
  const [selectedItem, setSelectedItem] = useState<CyberwareCatalogItemData | BiowareCatalogItemData | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Available grades based on type
  const availableGrades = useMemo(() => {
    if (augmentationType === "cyberware") {
      return cyberwareGrades;
    }
    // Bioware doesn't have "used" grade
    return biowareGrades.filter((g) => g.id !== "used");
  }, [augmentationType, cyberwareGrades, biowareGrades]);

  // Filter catalog items
  const filteredCyberware = useMemo(() => {
    if (!cyberwareCatalog) return [];
    let items = [...cyberwareCatalog.catalog];

    // Filter by category
    if (cyberwareCategory !== "all") {
      items = items.filter((item) => item.category === cyberwareCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [cyberwareCatalog, cyberwareCategory, searchQuery]);

  const filteredBioware = useMemo(() => {
    if (!biowareCatalog) return [];
    let items = [...biowareCatalog.catalog];

    // Filter by category
    if (biowareCategory !== "all") {
      items = items.filter((item) => item.category === biowareCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [biowareCatalog, biowareCategory, searchQuery]);

  // Calculate costs for selected item
  const selectedItemCosts = useMemo(() => {
    if (!selectedItem) return null;

    const rating = selectedItem.hasRating ? selectedRating : undefined;

    if (augmentationType === "cyberware") {
      const item = selectedItem as CyberwareCatalogItemData;
      const essenceCost = calculateCyberwareEssenceCost(
        item.essenceCost,
        selectedGrade as CyberwareGrade,
        cyberwareGrades,
        rating,
        item.essencePerRating
      );
      const cost = calculateCyberwareCost(item.cost, selectedGrade as CyberwareGrade, cyberwareGrades, rating);
      const availability = calculateCyberwareAvailability(
        item.availability,
        selectedGrade as CyberwareGrade,
        cyberwareGrades
      );
      return { essenceCost, cost, availability };
    } else {
      const item = selectedItem as BiowareCatalogItemData;
      const essenceCost = calculateBiowareEssenceCost(
        item.essenceCost,
        selectedGrade as BiowareGrade,
        biowareGrades,
        rating,
        item.essencePerRating
      );
      const cost = calculateBiowareCost(item.cost, selectedGrade as BiowareGrade, biowareGrades, rating);
      const availability = calculateBiowareAvailability(
        item.availability,
        selectedGrade as BiowareGrade,
        biowareGrades
      );
      return { essenceCost, cost, availability };
    }
  }, [selectedItem, selectedGrade, selectedRating, augmentationType, cyberwareGrades, biowareGrades]);

  // Projected essence after installation
  const projectedEssence = useMemo(() => {
    if (!selectedItemCosts) return currentEssence;
    return Math.round((currentEssence - selectedItemCosts.essenceCost) * 100) / 100;
  }, [currentEssence, selectedItemCosts]);

  // Validation
  const validationResult = useMemo(() => {
    if (!selectedItem || !selectedItemCosts) {
      return { canInstall: false, errors: [] as string[] };
    }

    const errors: string[] = [];

    // Check availability
    if (selectedItemCosts.availability > augmentationRules.maxAvailabilityAtCreation) {
      errors.push(
        `Availability ${selectedItemCosts.availability} exceeds maximum ${augmentationRules.maxAvailabilityAtCreation}`
      );
    }

    // Check forbidden
    if (selectedItem.forbidden) {
      errors.push("This item is forbidden at character creation");
    }

    // Check essence
    if (selectedItemCosts.essenceCost > currentEssence) {
      errors.push("Insufficient essence");
    }

    if (projectedEssence < 0.01) {
      errors.push("Would reduce essence below minimum viable (0.01)");
    }

    // Check cost
    if (selectedItemCosts.cost > remainingNuyen) {
      errors.push("Insufficient nuyen");
    }

    // Check attribute bonuses
    if (selectedItem.attributeBonuses) {
      for (const [attr, bonus] of Object.entries(selectedItem.attributeBonuses)) {
        const currentBonus = currentAttributeBonuses[attr] || 0;
        if (currentBonus + bonus > augmentationRules.maxAttributeBonus) {
          errors.push(
            `${attr} bonus would exceed maximum +${augmentationRules.maxAttributeBonus}`
          );
        }
      }
    }

    return { canInstall: errors.length === 0, errors };
  }, [
    selectedItem,
    selectedItemCosts,
    augmentationRules,
    currentEssence,
    projectedEssence,
    remainingNuyen,
    currentAttributeBonuses,
  ]);

  // Handle item selection
  const handleSelectItem = useCallback(
    (item: CyberwareCatalogItemData | BiowareCatalogItemData) => {
      setSelectedItem(item);
      // Reset rating to minimum if item has rating
      if (item.hasRating) {
        setSelectedRating(1);
      }
    },
    []
  );

  // Handle installation
  const handleInstall = useCallback(() => {
    if (!selectedItem || !selectedItemCosts || !validationResult.canInstall) return;

    const rating = selectedItem.hasRating ? selectedRating : undefined;

    if (augmentationType === "cyberware" && onInstallCyberware) {
      const item = selectedItem as CyberwareCatalogItemData;
      const cyberwareItem: CyberwareItem = {
        id: `${item.id}-${Date.now()}`,
        catalogId: item.id,
        name: item.name,
        category: item.category as CyberwareItem["category"],
        grade: selectedGrade as CyberwareGrade,
        rating,
        essenceCost: selectedItemCosts.essenceCost,
        baseEssenceCost: item.essenceCost,
        cost: selectedItemCosts.cost,
        availability: selectedItemCosts.availability,
        capacity: item.capacity,
        capacityUsed: 0,
        enhancements: [],
        wirelessBonus: item.wirelessBonus,
        attributeBonuses: item.attributeBonuses,
        initiativeDiceBonus: item.initiativeDiceBonus,
      };
      onInstallCyberware(cyberwareItem);
    } else if (augmentationType === "bioware" && onInstallBioware) {
      const item = selectedItem as BiowareCatalogItemData;
      const biowareItem: BiowareItem = {
        id: `${item.id}-${Date.now()}`,
        catalogId: item.id,
        name: item.name,
        category: item.category as BiowareItem["category"],
        grade: selectedGrade as BiowareGrade,
        rating,
        essenceCost: selectedItemCosts.essenceCost,
        baseEssenceCost: item.essenceCost,
        cost: selectedItemCosts.cost,
        availability: selectedItemCosts.availability,
        attributeBonuses: item.attributeBonuses,
      };
      onInstallBioware(biowareItem);
    }

    // Reset selection
    setSelectedItem(null);
    setSelectedRating(1);
  }, [
    selectedItem,
    selectedItemCosts,
    validationResult.canInstall,
    augmentationType,
    selectedGrade,
    selectedRating,
    onInstallCyberware,
    onInstallBioware,
  ]);

  // Handle type change
  const handleTypeChange = useCallback((type: AugmentationType) => {
    setAugmentationType(type);
    setSelectedItem(null);
    setSelectedGrade("standard");
    setSearchQuery("");
  }, []);

  if (!isOpen) return null;

  const catalogItems = augmentationType === "cyberware" ? filteredCyberware : filteredBioware;

  return (
    <div className="augmentation-modal__overlay" onClick={onClose}>
      <div className="augmentation-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="augmentation-modal__header">
          <h2 className="augmentation-modal__title">Select Augmentation</h2>
          <button className="augmentation-modal__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Type Tabs */}
        <div className="augmentation-modal__tabs">
          <button
            className={`augmentation-modal__tab ${augmentationType === "cyberware" ? "augmentation-modal__tab--active" : ""}`}
            onClick={() => handleTypeChange("cyberware")}
          >
            Cyberware
          </button>
          <button
            className={`augmentation-modal__tab ${augmentationType === "bioware" ? "augmentation-modal__tab--active" : ""}`}
            onClick={() => handleTypeChange("bioware")}
          >
            Bioware
          </button>
        </div>

        <div className="augmentation-modal__content">
          {/* Left Panel - Catalog Browser */}
          <div className="augmentation-modal__catalog">
            {/* Search */}
            <div className="augmentation-modal__search">
              <input
                type="text"
                placeholder="Search augmentations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="augmentation-modal__search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="augmentation-modal__categories">
              {augmentationType === "cyberware"
                ? CYBERWARE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`augmentation-modal__category ${cyberwareCategory === cat.id ? "augmentation-modal__category--active" : ""}`}
                      onClick={() => setCyberwareCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))
                : BIOWARE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`augmentation-modal__category ${biowareCategory === cat.id ? "augmentation-modal__category--active" : ""}`}
                      onClick={() => setBiowareCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
            </div>

            {/* Item List */}
            <div className="augmentation-modal__list">
              {catalogItems.length === 0 ? (
                <p className="augmentation-modal__empty">No items found</p>
              ) : (
                catalogItems.map((item) => {
                  const isAvailable =
                    item.availability <= MAX_AVAILABILITY && !item.forbidden;
                  return (
                    <div
                      key={item.id}
                      className={`augmentation-modal__item ${selectedItem?.id === item.id ? "augmentation-modal__item--selected" : ""} ${!isAvailable ? "augmentation-modal__item--unavailable" : ""}`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="augmentation-modal__item-header">
                        <span className="augmentation-modal__item-name">{item.name}</span>
                        <span className="augmentation-modal__item-avail">
                          {getAvailabilityDisplay(item.availability, item.restricted, item.forbidden)}
                        </span>
                      </div>
                      <div className="augmentation-modal__item-stats">
                        <span className="augmentation-modal__item-essence">
                          {formatEssence(item.essenceCost)} ESS
                        </span>
                        <span className="augmentation-modal__item-cost">
                          {formatCurrency(item.cost)}¥
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel - Details & Configuration */}
          <div className="augmentation-modal__details">
            {selectedItem ? (
              <>
                {/* Item Details */}
                <div className="augmentation-modal__item-details">
                  <h3 className="augmentation-modal__item-title">{selectedItem.name}</h3>
                  {selectedItem.description && (
                    <p className="augmentation-modal__item-description">
                      {selectedItem.description}
                    </p>
                  )}

                  {/* Attribute Bonuses */}
                  {selectedItem.attributeBonuses && Object.keys(selectedItem.attributeBonuses).length > 0 && (
                    <div className="augmentation-modal__bonuses">
                      <strong>Attribute Bonuses:</strong>
                      <ul>
                        {Object.entries(selectedItem.attributeBonuses).map(([attr, bonus]) => (
                          <li key={attr}>
                            {attr}: +{bonus}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Wireless Bonus */}
                  {augmentationType === "cyberware" && (selectedItem as CyberwareCatalogItemData).wirelessBonus && (
                    <div className="augmentation-modal__wireless">
                      <strong>Wireless Bonus:</strong>{" "}
                      {(selectedItem as CyberwareCatalogItemData).wirelessBonus}
                    </div>
                  )}

                  {/* Capacity (for cyberlimbs) */}
                  {augmentationType === "cyberware" && (selectedItem as CyberwareCatalogItemData).capacity && (
                    <div className="augmentation-modal__capacity">
                      <strong>Capacity:</strong>{" "}
                      {(selectedItem as CyberwareCatalogItemData).capacity}
                    </div>
                  )}
                </div>

                {/* Configuration */}
                <div className="augmentation-modal__config">
                  {/* Grade Selector */}
                  <div className="augmentation-modal__grade">
                    <label className="augmentation-modal__label">Grade</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value as CyberwareGrade | BiowareGrade)}
                      className="augmentation-modal__select"
                    >
                      {availableGrades.map((grade) => (
                        <option key={grade.id} value={grade.id}>
                          {getGradeDisplayName(grade.id as CyberwareGrade | BiowareGrade)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Selector */}
                  {selectedItem.hasRating && (
                    <div className="augmentation-modal__rating">
                      <label className="augmentation-modal__label">Rating</label>
                      <RatingSelector
                        itemSpec={convertLegacyRatingSpec({
                          hasRating: true,
                          minRating: 1,
                          maxRating: selectedItem.maxRating || 6,
                        })}
                        selectedRating={selectedRating}
                        onRatingChange={setSelectedRating}
                      />
                    </div>
                  )}

                  {/* Cost Preview */}
                  {selectedItemCosts && (
                    <div className="augmentation-modal__preview">
                      <div className="augmentation-modal__preview-row">
                        <span>Essence Cost:</span>
                        <EssenceCostBadge
                          cost={selectedItemCosts.essenceCost}
                          grade={getGradeDisplayName(selectedGrade)}
                        />
                      </div>
                      <div className="augmentation-modal__preview-row">
                        <span>Cost:</span>
                        <span>{formatCurrency(selectedItemCosts.cost)}¥</span>
                      </div>
                      <div className="augmentation-modal__preview-row">
                        <span>Availability:</span>
                        <span>
                          {getAvailabilityDisplay(
                            selectedItemCosts.availability,
                            selectedItem.restricted,
                            selectedItem.forbidden
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Essence Preview */}
                <div className="augmentation-modal__essence-preview">
                  <EssenceDisplay
                    currentEssence={currentEssence}
                    maxEssence={maxEssence}
                    projectedEssence={projectedEssence}
                    magicRating={magicRating}
                    resonanceRating={resonanceRating}
                    compact
                  />
                </div>

                {/* Validation Errors */}
                {validationResult.errors.length > 0 && (
                  <div className="augmentation-modal__errors">
                    {validationResult.errors.map((error, idx) => (
                      <p key={idx} className="augmentation-modal__error">
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                {/* Install Button */}
                <button
                  className="augmentation-modal__install"
                  onClick={handleInstall}
                  disabled={!validationResult.canInstall}
                >
                  Install {selectedItem.name}
                </button>
              </>
            ) : (
              <div className="augmentation-modal__placeholder">
                <p>Select an augmentation to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Budget Info */}
        <div className="augmentation-modal__footer">
          <div className="augmentation-modal__budget">
            <span>
              <strong>Nuyen:</strong> {formatCurrency(remainingNuyen)}¥ remaining
            </span>
            <span>
              <strong>Essence:</strong> {formatEssence(currentEssence)} / {maxEssence}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
