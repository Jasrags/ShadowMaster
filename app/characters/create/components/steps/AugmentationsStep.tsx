"use client";

/**
 * AugmentationsStep - Character creation step for selecting augmentations
 *
 * Features:
 * - Browse and install cyberware/bioware
 * - Essence tracking with magic/resonance impact
 * - Grade selection and cost calculation
 * - Cyberlimb enhancement management
 * - Budget tracking integration
 */

import { useState, useMemo, useCallback } from "react";
import type { CreationState, CyberwareItem, BiowareItem, CyberwareGrade, BiowareGrade } from "@/lib/types";
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
  calculateMagicLoss,
  type CyberwareCatalogItemData,
  type BiowareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import { EssenceDisplay, EssenceCostBadge } from "@/components/EssenceDisplay";
import { AugmentationModal } from "../AugmentationModal";
import { RatingSelector } from "../RatingSelector";
import { convertLegacyRatingSpec } from "@/lib/rules/ratings";

// =============================================================================
// TYPES
// =============================================================================

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

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

export function AugmentationsStep({ state, updateState, budgetValues }: StepProps) {
  // Catalog data
  const cyberwareCatalog = useCyberware({ excludeForbidden: false });
  const biowareCatalog = useBioware({ excludeForbidden: false });
  const cyberwareGrades = useCyberwareGrades();
  const biowareGrades = useBiowareGrades();
  const augmentationRules = useAugmentationRules();

  // Local state
  const [activeTab, setActiveTab] = useState<AugmentationType>("cyberware");
  const [cyberwareCategory, setCyberwareCategory] = useState<CyberwareCategory>("all");
  const [biowareCategory, setBiowareCategory] = useState<BiowareCategory>("all");
  const [selectedGrade, setSelectedGrade] = useState<CyberwareGrade | BiowareGrade>("standard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Get selected augmentations from state
  const selectedCyberware = useMemo(
    () => (state.selections.cyberware || []) as CyberwareItem[],
    [state.selections.cyberware]
  );
  const selectedBioware = useMemo(
    () => (state.selections.bioware || []) as BiowareItem[],
    [state.selections.bioware]
  );

  // Get character info for magic/resonance tracking
  const magicalPath = state.selections.magicalPath as string | undefined;
  const specialAttributes = state.selections.specialAttributes as Record<string, number> | undefined;
  const magicRating = specialAttributes?.magic;
  const resonanceRating = specialAttributes?.resonance;
  const isAwakened = magicalPath && magicalPath !== "mundane" && magicalPath !== "technomancer";
  const isTechnomancer = magicalPath === "technomancer";

  // Calculate budget values
  const totalNuyen = budgetValues.nuyen || 0;
  const nuyenSpentGear = (state.budgets?.["nuyen-spent-gear"] || 0) as number;
  const nuyenSpentLifestyle = (state.budgets?.["nuyen-spent-lifestyle"] || 0) as number;

  // Calculate augmentation costs
  const cyberwareSpent = selectedCyberware.reduce((sum, item) => sum + item.cost, 0);
  const biowareSpent = selectedBioware.reduce((sum, item) => sum + item.cost, 0);
  const augmentationSpent = cyberwareSpent + biowareSpent;

  // Calculate total spent (gear + augmentations + lifestyle)
  const totalSpent = nuyenSpentGear + augmentationSpent + nuyenSpentLifestyle;
  const remainingNuyen = totalNuyen - totalSpent;

  // Calculate essence values
  const maxEssence = augmentationRules.maxEssence;
  const cyberwareEssence = selectedCyberware.reduce((sum, item) => sum + item.essenceCost, 0);
  const biowareEssence = selectedBioware.reduce((sum, item) => sum + item.essenceCost, 0);
  const totalEssenceLoss = Math.round((cyberwareEssence + biowareEssence) * 100) / 100;
  const currentEssence = Math.round((maxEssence - totalEssenceLoss) * 100) / 100;

  // Calculate magic loss for awakened characters
  const magicLoss = isAwakened ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula) : 0;
  const resonanceLoss = isTechnomancer ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula) : 0;

  // Calculate attribute bonuses from all augmentations
  const attributeBonuses = useMemo(() => {
    const bonuses: Record<string, number> = {};
    for (const item of selectedCyberware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    for (const item of selectedBioware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    return bonuses;
  }, [selectedCyberware, selectedBioware]);

  // Available grades based on tab
  const availableGrades = useMemo(() => {
    if (activeTab === "cyberware") {
      return cyberwareGrades;
    }
    // Bioware doesn't have "used" grade
    return biowareGrades.filter((g) => g.id !== "used");
  }, [activeTab, cyberwareGrades, biowareGrades]);

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

  // Check if an augmentation can be added
  const canAddAugmentation = useCallback(
    (
      cost: number,
      essenceCost: number,
      availability: number,
      itemBonuses: Record<string, number> | undefined,
      forbidden?: boolean
    ): { allowed: boolean; reason?: string } => {
      if (forbidden) {
        return { allowed: false, reason: "Forbidden at character creation" };
      }
      if (availability > augmentationRules.maxAvailabilityAtCreation) {
        return {
          allowed: false,
          reason: `Availability ${availability} exceeds ${augmentationRules.maxAvailabilityAtCreation}`,
        };
      }
      if (cost > remainingNuyen) {
        return { allowed: false, reason: "Insufficient nuyen" };
      }
      if (essenceCost > currentEssence) {
        return { allowed: false, reason: "Insufficient essence" };
      }
      if (itemBonuses) {
        for (const [attr, bonus] of Object.entries(itemBonuses)) {
          const currentBonus = attributeBonuses[attr] || 0;
          if (currentBonus + bonus > augmentationRules.maxAttributeBonus) {
            return {
              allowed: false,
              reason: `${attr} bonus would exceed +${augmentationRules.maxAttributeBonus}`,
            };
          }
        }
      }
      return { allowed: true };
    },
    [augmentationRules, remainingNuyen, currentEssence, attributeBonuses]
  );

  // Add cyberware
  const handleAddCyberware = useCallback(
    (item: CyberwareCatalogItemData, grade: CyberwareGrade, rating?: number) => {
      const essenceCost = calculateCyberwareEssenceCost(
        item.essenceCost,
        grade,
        cyberwareGrades,
        rating,
        item.essencePerRating
      );
      const cost = calculateCyberwareCost(item.cost, grade, cyberwareGrades, rating);
      const availability = calculateCyberwareAvailability(item.availability, grade, cyberwareGrades);

      const check = canAddAugmentation(cost, essenceCost, availability, item.attributeBonuses, item.forbidden);
      if (!check.allowed) {
        return;
      }

      const newItem: CyberwareItem = {
        id: `${item.id}-${Date.now()}`,
        catalogId: item.id,
        name: item.name,
        category: item.category as CyberwareItem["category"],
        grade,
        rating,
        essenceCost,
        baseEssenceCost: item.essenceCost,
        cost,
        availability,
        capacity: item.capacity,
        capacityUsed: 0,
        enhancements: [],
        wirelessBonus: item.wirelessBonus,
        attributeBonuses: item.attributeBonuses,
        initiativeDiceBonus: item.initiativeDiceBonus,
      };

      updateState({
        selections: {
          ...state.selections,
          cyberware: [...selectedCyberware, newItem],
        },
      });
    },
    [cyberwareGrades, canAddAugmentation, selectedCyberware, state.selections, updateState]
  );

  // Add bioware
  const handleAddBioware = useCallback(
    (item: BiowareCatalogItemData, grade: BiowareGrade, rating?: number) => {
      const essenceCost = calculateBiowareEssenceCost(
        item.essenceCost,
        grade,
        biowareGrades,
        rating,
        item.essencePerRating
      );
      const cost = calculateBiowareCost(item.cost, grade, biowareGrades, rating);
      const availability = calculateBiowareAvailability(item.availability, grade, biowareGrades);

      const check = canAddAugmentation(cost, essenceCost, availability, item.attributeBonuses, item.forbidden);
      if (!check.allowed) {
        return;
      }

      const newItem: BiowareItem = {
        id: `${item.id}-${Date.now()}`,
        catalogId: item.id,
        name: item.name,
        category: item.category as BiowareItem["category"],
        grade,
        rating,
        essenceCost,
        baseEssenceCost: item.essenceCost,
        cost,
        availability,
        attributeBonuses: item.attributeBonuses,
      };

      updateState({
        selections: {
          ...state.selections,
          bioware: [...selectedBioware, newItem],
        },
      });
    },
    [biowareGrades, canAddAugmentation, selectedBioware, state.selections, updateState]
  );

  // Remove cyberware
  const handleRemoveCyberware = useCallback(
    (index: number) => {
      const updatedCyberware = selectedCyberware.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Remove bioware
  const handleRemoveBioware = useCallback(
    (index: number) => {
      const updatedBioware = selectedBioware.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          bioware: updatedBioware,
        },
      });
    },
    [selectedBioware, state.selections, updateState]
  );

  // Handle modal install callbacks
  const handleModalInstallCyberware = useCallback(
    (item: CyberwareItem) => {
      updateState({
        selections: {
          ...state.selections,
          cyberware: [...selectedCyberware, item],
        },
      });
      setShowModal(false);
    },
    [selectedCyberware, state.selections, updateState]
  );

  const handleModalInstallBioware = useCallback(
    (item: BiowareItem) => {
      updateState({
        selections: {
          ...state.selections,
          bioware: [...selectedBioware, item],
        },
      });
      setShowModal(false);
    },
    [selectedBioware, state.selections, updateState]
  );

  const catalogItems = activeTab === "cyberware" ? filteredCyberware : filteredBioware;

  return (
    <div className="augmentations-step">
      <div className="augmentations-step__header">
        <h2 className="augmentations-step__title">Augmentations</h2>
        <p className="augmentations-step__description">
          Enhance your character with cyberware and bioware. Be mindful of essence costs,
          especially if you have magical or resonance abilities.
        </p>
      </div>

      {/* Essence and Budget Summary */}
      <div className="augmentations-step__summary">
        <div className="augmentations-step__essence-section">
          <EssenceDisplay
            currentEssence={currentEssence}
            maxEssence={maxEssence}
            essenceLoss={totalEssenceLoss}
            magicRating={magicRating}
            magicLoss={magicLoss}
            resonanceRating={resonanceRating}
            resonanceLoss={resonanceLoss}
          />
        </div>

        <div className="augmentations-step__budget-section">
          <h4>Budget</h4>
          <div className="augmentations-step__budget-row">
            <span>Total Nuyen:</span>
            <span>{formatCurrency(totalNuyen)}¥</span>
          </div>
          <div className="augmentations-step__budget-row">
            <span>Augmentations:</span>
            <span>{formatCurrency(augmentationSpent)}¥</span>
          </div>
          <div className="augmentations-step__budget-row augmentations-step__budget-row--remaining">
            <span>Remaining:</span>
            <span className={remainingNuyen < 0 ? "augmentations-step__budget--negative" : ""}>
              {formatCurrency(remainingNuyen)}¥
            </span>
          </div>
        </div>
      </div>

      {/* Installed Augmentations */}
      <div className="augmentations-step__installed">
        <div className="augmentations-step__installed-header">
          <h3>Installed Augmentations</h3>
          <button
            className="augmentations-step__add-button"
            onClick={() => setShowModal(true)}
          >
            + Add Augmentation
          </button>
        </div>

        {selectedCyberware.length === 0 && selectedBioware.length === 0 ? (
          <p className="augmentations-step__empty">No augmentations installed yet.</p>
        ) : (
          <div className="augmentations-step__lists">
            {/* Cyberware List */}
            {selectedCyberware.length > 0 && (
              <div className="augmentations-step__list">
                <h4 className="augmentations-step__list-title">Cyberware</h4>
                {selectedCyberware.map((item, index) => (
                  <div key={item.id} className="augmentations-step__item">
                    <div className="augmentations-step__item-info">
                      <span className="augmentations-step__item-name">{item.name}</span>
                      <span className="augmentations-step__item-grade">
                        {getGradeDisplayName(item.grade)}
                        {item.rating && ` R${item.rating}`}
                      </span>
                    </div>
                    <div className="augmentations-step__item-stats">
                      <EssenceCostBadge cost={item.essenceCost} />
                      <span className="augmentations-step__item-cost">
                        {formatCurrency(item.cost)}¥
                      </span>
                    </div>
                    <button
                      className="augmentations-step__remove-button"
                      onClick={() => handleRemoveCyberware(index)}
                      aria-label={`Remove ${item.name}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Bioware List */}
            {selectedBioware.length > 0 && (
              <div className="augmentations-step__list">
                <h4 className="augmentations-step__list-title">Bioware</h4>
                {selectedBioware.map((item, index) => (
                  <div key={item.id} className="augmentations-step__item">
                    <div className="augmentations-step__item-info">
                      <span className="augmentations-step__item-name">{item.name}</span>
                      <span className="augmentations-step__item-grade">
                        {getGradeDisplayName(item.grade)}
                        {item.rating && ` R${item.rating}`}
                      </span>
                    </div>
                    <div className="augmentations-step__item-stats">
                      <EssenceCostBadge cost={item.essenceCost} />
                      <span className="augmentations-step__item-cost">
                        {formatCurrency(item.cost)}¥
                      </span>
                    </div>
                    <button
                      className="augmentations-step__remove-button"
                      onClick={() => handleRemoveBioware(index)}
                      aria-label={`Remove ${item.name}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attribute Bonuses Summary */}
      {Object.keys(attributeBonuses).length > 0 && (
        <div className="augmentations-step__bonuses">
          <h4>Attribute Bonuses from Augmentations</h4>
          <div className="augmentations-step__bonus-list">
            {Object.entries(attributeBonuses).map(([attr, bonus]) => (
              <span key={attr} className="augmentations-step__bonus">
                {attr}: +{bonus}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Magic/Resonance Warning */}
      {(isAwakened && magicLoss > 0) && (
        <div className="augmentations-step__warning">
          <strong>Warning:</strong> Your augmentations have reduced your Magic by {magicLoss}.
          This reduction is permanent even if augmentations are later removed (Essence Hole).
        </div>
      )}
      {(isTechnomancer && resonanceLoss > 0) && (
        <div className="augmentations-step__warning">
          <strong>Warning:</strong> Your augmentations have reduced your Resonance by {resonanceLoss}.
          This reduction is permanent even if augmentations are later removed (Essence Hole).
        </div>
      )}

      {/* Quick Add Section - Inline Catalog Browser */}
      <div className="augmentations-step__quick-add">
        <h3>Browse Catalog</h3>

        {/* Type Tabs */}
        <div className="augmentations-step__tabs">
          <button
            className={`augmentations-step__tab ${activeTab === "cyberware" ? "augmentations-step__tab--active" : ""}`}
            onClick={() => {
              setActiveTab("cyberware");
              setSelectedGrade("standard");
              setSearchQuery("");
            }}
          >
            Cyberware
          </button>
          <button
            className={`augmentations-step__tab ${activeTab === "bioware" ? "augmentations-step__tab--active" : ""}`}
            onClick={() => {
              setActiveTab("bioware");
              setSelectedGrade("standard");
              setSearchQuery("");
            }}
          >
            Bioware
          </button>
        </div>

        {/* Controls */}
        <div className="augmentations-step__controls">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="augmentations-step__search"
          />

          {/* Category Filter */}
          {activeTab === "cyberware" ? (
            <select
              value={cyberwareCategory}
              onChange={(e) => setCyberwareCategory(e.target.value as CyberwareCategory)}
              className="augmentations-step__category-select"
            >
              {CYBERWARE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={biowareCategory}
              onChange={(e) => setBiowareCategory(e.target.value as BiowareCategory)}
              className="augmentations-step__category-select"
            >
              {BIOWARE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          )}

          {/* Grade Selector */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as CyberwareGrade | BiowareGrade)}
            className="augmentations-step__grade-select"
          >
            {availableGrades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {getGradeDisplayName(grade.id as CyberwareGrade | BiowareGrade)}
              </option>
            ))}
          </select>
        </div>

        {/* Catalog Grid */}
        <div className="augmentations-step__catalog">
          {catalogItems.length === 0 ? (
            <p className="augmentations-step__catalog-empty">No items found</p>
          ) : (
            catalogItems.slice(0, 20).map((item) => {
              const isAvailable = item.availability <= MAX_AVAILABILITY && !item.forbidden;

              // Calculate costs with current grade
              let essenceCost: number, cost: number, availability: number;
              if (activeTab === "cyberware") {
                essenceCost = calculateCyberwareEssenceCost(
                  item.essenceCost,
                  selectedGrade as CyberwareGrade,
                  cyberwareGrades
                );
                cost = calculateCyberwareCost(
                  item.cost,
                  selectedGrade as CyberwareGrade,
                  cyberwareGrades
                );
                availability = calculateCyberwareAvailability(
                  item.availability,
                  selectedGrade as CyberwareGrade,
                  cyberwareGrades
                );
              } else {
                essenceCost = calculateBiowareEssenceCost(
                  item.essenceCost,
                  selectedGrade as BiowareGrade,
                  biowareGrades
                );
                cost = calculateBiowareCost(
                  item.cost,
                  selectedGrade as BiowareGrade,
                  biowareGrades
                );
                availability = calculateBiowareAvailability(
                  item.availability,
                  selectedGrade as BiowareGrade,
                  biowareGrades
                );
              }

              const check = canAddAugmentation(cost, essenceCost, availability, item.attributeBonuses, item.forbidden);

              return (
                <div
                  key={item.id}
                  className={`augmentations-step__catalog-item ${!isAvailable ? "augmentations-step__catalog-item--unavailable" : ""}`}
                >
                  <div className="augmentations-step__catalog-item-header">
                    <span className="augmentations-step__catalog-item-name">{item.name}</span>
                    <span className="augmentations-step__catalog-item-avail">
                      {getAvailabilityDisplay(availability, item.restricted, item.forbidden)}
                    </span>
                  </div>
                  <div className="augmentations-step__catalog-item-stats">
                    <span>{formatEssence(essenceCost)} ESS</span>
                    <span>{formatCurrency(cost)}¥</span>
                  </div>
                  <button
                    className="augmentations-step__catalog-item-add"
                    onClick={() => {
                      if (activeTab === "cyberware") {
                        handleAddCyberware(item as CyberwareCatalogItemData, selectedGrade as CyberwareGrade);
                      } else {
                        handleAddBioware(item as BiowareCatalogItemData, selectedGrade as BiowareGrade);
                      }
                    }}
                    disabled={!check.allowed}
                    title={check.reason}
                  >
                    Add
                  </button>
                </div>
              );
            })
          )}
        </div>
        {catalogItems.length > 20 && (
          <p className="augmentations-step__catalog-more">
            Showing first 20 of {catalogItems.length} items.{" "}
            <button onClick={() => setShowModal(true)} className="augmentations-step__view-all">
              View all in modal
            </button>
          </p>
        )}
      </div>

      {/* Augmentation Modal */}
      <AugmentationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentEssence={currentEssence}
        maxEssence={maxEssence}
        remainingNuyen={remainingNuyen}
        currentAttributeBonuses={attributeBonuses}
        magicRating={magicRating}
        resonanceRating={resonanceRating}
        onInstallCyberware={handleModalInstallCyberware}
        onInstallBioware={handleModalInstallBioware}
        initialType={activeTab}
      />
    </div>
  );
}
