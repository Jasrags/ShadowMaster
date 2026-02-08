"use client";

/**
 * MatrixGearModal
 *
 * Unified two-column modal for purchasing matrix gear during character creation.
 * Combines commlinks, cyberdecks, and software into a single modal with category tabs.
 *
 * Features:
 * - Category tabs: Commlinks | Cyberdecks | Software
 * - Software sub-tabs: Datasoft | Mapsoft | Shopsoft | Tutorsoft
 * - Bulk-add workflow (modal stays open after purchase)
 * - Session counter feedback
 * - Virtualized lists for performance
 * - Detail preview panel
 *
 * Follows the WeaponPurchaseModal/ArmorPurchaseModal pattern from PRs #198-199.
 */

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useCommlinks,
  useCyberdecks,
  useDataSoftwareCatalog,
  useSkills,
  type CommlinkData,
  type CyberdeckData,
  type DataSoftwareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { CharacterCommlink, CharacterCyberdeck, CharacterDataSoftware } from "@/lib/types";
import { isLegalAtCreation } from "@/lib/rules/gear/validation";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import {
  formatCurrency,
  MAX_AVAILABILITY,
  SOFTWARE_SUBCATEGORIES,
  type MatrixGearCategory,
  type SoftwareSubcategory,
} from "./matrixGearHelpers";
import { CommlinkListItem, CyberdeckListItem, SoftwareListItem } from "./MatrixGearListItems";
import { MatrixGearDetailsPane } from "./MatrixGearDetailsPane";
import { MatrixGearFilters } from "./MatrixGearFilters";

// =============================================================================
// TYPES
// =============================================================================

export interface MatrixGearModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Initial category to open the modal to */
  initialCategory?: MatrixGearCategory;
  /** Remaining nuyen budget */
  remaining: number;
  /** Callbacks for purchasing items */
  onPurchaseCommlink: (commlink: CommlinkData) => void;
  onPurchaseCyberdeck: (cyberdeck: CyberdeckData) => void;
  onPurchaseSoftware: (software: CharacterDataSoftware) => void;
  /** Existing items (for duplicate detection if needed) */
  existingCommlinks?: CharacterCommlink[];
  existingCyberdecks?: CharacterCyberdeck[];
  existingSoftware?: CharacterDataSoftware[];
  /** Whether character has a device to run software */
  hasCompatibleDevice: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MatrixGearModal({
  isOpen,
  onClose,
  initialCategory = "commlinks",
  remaining,
  onPurchaseCommlink,
  onPurchaseCyberdeck,
  onPurchaseSoftware,
  hasCompatibleDevice,
}: MatrixGearModalProps) {
  // Catalog data
  const commlinks = useCommlinks({ maxAvailability: MAX_AVAILABILITY });
  const cyberdecks = useCyberdecks({ maxAvailability: MAX_AVAILABILITY });
  const dataSoftware = useDataSoftwareCatalog();
  const { activeSkills } = useSkills();

  // Category state
  const [selectedCategory, setSelectedCategory] = useState<MatrixGearCategory>(initialCategory);
  const [selectedSoftwareType, setSelectedSoftwareType] = useState<SoftwareSubcategory>("datasoft");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyLegal, setShowOnlyLegal] = useState(false);

  // Selection state
  const [selectedCommlinkId, setSelectedCommlinkId] = useState<string | null>(null);
  const [selectedCyberdeckId, setSelectedCyberdeckId] = useState<string | null>(null);
  const [selectedSoftwareId, setSelectedSoftwareId] = useState<string | null>(null);

  // Software form state
  const [specificDetails, setSpecificDetails] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [rating, setRating] = useState(1);

  // Bulk-add tracking
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Sync category with initialCategory when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(initialCategory);
    }
  }, [isOpen, initialCategory]);

  // Full reset on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setShowOnlyLegal(false);
    setSelectedCategory("commlinks");
    setSelectedSoftwareType("datasoft");
    setSelectedCommlinkId(null);
    setSelectedCyberdeckId(null);
    setSelectedSoftwareId(null);
    setSpecificDetails("");
    setSelectedSkillId("");
    setRating(1);
    setAddedThisSession(0);
  }, []);

  // Partial reset after add (preserves search/category)
  const resetForNextItem = useCallback(() => {
    setSelectedCommlinkId(null);
    setSelectedCyberdeckId(null);
    setSelectedSoftwareId(null);
    setSpecificDetails("");
    setSelectedSkillId("");
    setRating(1);
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Handle category change (also clears selections)
  const handleCategoryChange = useCallback((category: MatrixGearCategory) => {
    setSelectedCategory(category);
    setSelectedCommlinkId(null);
    setSelectedCyberdeckId(null);
    setSelectedSoftwareId(null);
  }, []);

  // Handle software type change (also clears software selection)
  const handleSoftwareTypeChange = useCallback((type: SoftwareSubcategory) => {
    setSelectedSoftwareType(type);
    setSelectedSoftwareId(null);
  }, []);

  // Filter commlinks
  const filteredCommlinks = useMemo(() => {
    let items = [...commlinks];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(query));
    }
    if (showOnlyLegal) {
      items = items.filter((c) => isLegalAtCreation(c.availability, c.legality));
    }
    return items.sort((a, b) => a.deviceRating - b.deviceRating || a.name.localeCompare(b.name));
  }, [commlinks, searchQuery, showOnlyLegal]);

  // Filter cyberdecks
  const filteredCyberdecks = useMemo(() => {
    let items = [...cyberdecks];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(query));
    }
    if (showOnlyLegal) {
      items = items.filter((c) => isLegalAtCreation(c.availability, c.legality));
    }
    return items.sort((a, b) => a.deviceRating - b.deviceRating || a.name.localeCompare(b.name));
  }, [cyberdecks, searchQuery, showOnlyLegal]);

  // Get software items for current subcategory
  const filteredSoftware = useMemo(() => {
    if (!dataSoftware) return [];

    let items: DataSoftwareCatalogItemData[] = [];
    switch (selectedSoftwareType) {
      case "datasoft":
        items = dataSoftware.datasofts || [];
        break;
      case "mapsoft":
        items = dataSoftware.mapsofts || [];
        break;
      case "shopsoft":
        items = dataSoftware.shopsofts || [];
        break;
      case "tutorsoft":
        items = dataSoftware.tutorsofts || [];
        break;
    }

    // Filter by availability
    items = items.filter((item) => {
      if (item.hasRating) {
        const availableRating = Object.entries(item.ratings || {}).some(
          ([, data]) => data.availability <= MAX_AVAILABILITY
        );
        return availableRating;
      }
      return (item.availability || 0) <= MAX_AVAILABILITY;
    });

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(query));
    }

    return items;
  }, [dataSoftware, selectedSoftwareType, searchQuery]);

  // Filter skills for tutorsoft
  const eligibleSkills = useMemo(() => {
    return activeSkills.filter(
      (skill) => !skill.requiresMagic && !skill.requiresResonance && skill.category !== "magic"
    );
  }, [activeSkills]);

  // Get selected items from catalog
  const selectedCommlink = useMemo(
    () => commlinks.find((c) => c.id === selectedCommlinkId) || null,
    [commlinks, selectedCommlinkId]
  );

  const selectedCyberdeck = useMemo(
    () => cyberdecks.find((c) => c.id === selectedCyberdeckId) || null,
    [cyberdecks, selectedCyberdeckId]
  );

  const selectedSoftware = useMemo(
    () => filteredSoftware.find((s) => s.id === selectedSoftwareId) || null,
    [filteredSoftware, selectedSoftwareId]
  );

  // Calculate software cost for current selection
  const calculateSoftwareCost = useCallback(() => {
    if (!selectedSoftware) return 0;
    if (selectedSoftware.hasRating && selectedSoftware.ratings) {
      return selectedSoftware.ratings[String(rating)]?.cost || 0;
    }
    return selectedSoftware.cost || 0;
  }, [selectedSoftware, rating]);

  const calculateSoftwareAvailability = useCallback(() => {
    if (!selectedSoftware) return 0;
    if (selectedSoftware.hasRating && selectedSoftware.ratings) {
      return selectedSoftware.ratings[String(rating)]?.availability || 0;
    }
    return selectedSoftware.availability || 0;
  }, [selectedSoftware, rating]);

  // Get current cost/affordability based on category
  const getCurrentCost = useCallback(() => {
    switch (selectedCategory) {
      case "commlinks":
        return selectedCommlink?.cost || 0;
      case "cyberdecks":
        return selectedCyberdeck?.cost || 0;
      case "software":
        return calculateSoftwareCost();
    }
  }, [selectedCategory, selectedCommlink, selectedCyberdeck, calculateSoftwareCost]);

  const currentCost = getCurrentCost();
  const canAfford = currentCost > 0 && currentCost <= remaining;

  // Validate software form
  const isSoftwareValid = useMemo(() => {
    if (!selectedSoftware) return false;
    if (selectedSoftware.requiresSpecificDetails && !specificDetails.trim()) return false;
    if (selectedSoftware.requiresSkillSelection && !selectedSkillId) return false;
    return true;
  }, [selectedSoftware, specificDetails, selectedSkillId]);

  // Can purchase check
  const canPurchase = useMemo(() => {
    if (!canAfford) return false;
    switch (selectedCategory) {
      case "commlinks":
        return !!selectedCommlink;
      case "cyberdecks":
        return !!selectedCyberdeck;
      case "software":
        return !!selectedSoftware && isSoftwareValid;
    }
  }, [
    canAfford,
    selectedCategory,
    selectedCommlink,
    selectedCyberdeck,
    selectedSoftware,
    isSoftwareValid,
  ]);

  // Handle purchase
  const handlePurchase = useCallback(() => {
    if (!canPurchase) return;

    switch (selectedCategory) {
      case "commlinks":
        if (selectedCommlink) {
          onPurchaseCommlink(selectedCommlink);
          setAddedThisSession((prev) => prev + 1);
          resetForNextItem();
        }
        break;

      case "cyberdecks":
        if (selectedCyberdeck) {
          onPurchaseCyberdeck(selectedCyberdeck);
          setAddedThisSession((prev) => prev + 1);
          resetForNextItem();
        }
        break;

      case "software":
        if (selectedSoftware) {
          const selectedSkill = eligibleSkills.find((s) => s.id === selectedSkillId);

          // Build display name
          let displayName = selectedSoftware.name;
          if (selectedSoftware.requiresSpecificDetails && specificDetails) {
            displayName = `${selectedSoftware.name} (${specificDetails})`;
          } else if (selectedSoftware.requiresSkillSelection && selectedSkill) {
            displayName = `${selectedSoftware.name} (${selectedSkill.name}) R${rating}`;
          }

          const software: CharacterDataSoftware = {
            id: `${selectedSoftware.id}-${Date.now()}`,
            catalogId: selectedSoftware.id,
            type: selectedSoftwareType,
            name: selectedSoftware.name,
            displayName,
            rating: selectedSoftware.hasRating ? rating : undefined,
            specificDetails: selectedSoftware.requiresSpecificDetails ? specificDetails : undefined,
            selectedSkillId: selectedSoftware.requiresSkillSelection ? selectedSkillId : undefined,
            selectedSkillName: selectedSkill?.name,
            cost: calculateSoftwareCost(),
            availability: calculateSoftwareAvailability(),
          };

          onPurchaseSoftware(software);
          setAddedThisSession((prev) => prev + 1);
          resetForNextItem();
        }
        break;
    }
  }, [
    canPurchase,
    selectedCategory,
    selectedCommlink,
    selectedCyberdeck,
    selectedSoftware,
    selectedSoftwareType,
    specificDetails,
    selectedSkillId,
    rating,
    eligibleSkills,
    onPurchaseCommlink,
    onPurchaseCyberdeck,
    onPurchaseSoftware,
    calculateSoftwareCost,
    calculateSoftwareAvailability,
    resetForNextItem,
  ]);

  // Reset software form when item changes
  const handleSelectSoftware = useCallback((item: DataSoftwareCatalogItemData) => {
    setSelectedSoftwareId(item.id);
    setSpecificDetails("");
    setSelectedSkillId("");
    setRating(item.minRating || 1);
  }, []);

  // Get item type label for button
  const getItemTypeLabel = () => {
    switch (selectedCategory) {
      case "commlinks":
        return "Commlink";
      case "cyberdecks":
        return "Cyberdeck";
      case "software":
        return (
          SOFTWARE_SUBCATEGORIES.find((s) => s.id === selectedSoftwareType)?.label || "Software"
        );
    }
  };

  // Virtualization for commlinks
  const commlinkScrollRef = useRef<HTMLDivElement>(null);
  const commlinkVirtualizer = useVirtualizer({
    count: filteredCommlinks.length,
    getScrollElement: () => commlinkScrollRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  // Virtualization for cyberdecks
  const cyberdeckScrollRef = useRef<HTMLDivElement>(null);
  const cyberdeckVirtualizer = useVirtualizer({
    count: filteredCyberdecks.length,
    getScrollElement: () => cyberdeckScrollRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  // Virtualization for software
  const softwareScrollRef = useRef<HTMLDivElement>(null);
  const softwareVirtualizer = useVirtualizer({
    count: filteredSoftware.length,
    getScrollElement: () => softwareScrollRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Matrix Gear" onClose={close} />

          <MatrixGearFilters
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            showOnlyLegal={showOnlyLegal}
            onShowOnlyLegalChange={setShowOnlyLegal}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedSoftwareType={selectedSoftwareType}
            onSoftwareTypeChange={handleSoftwareTypeChange}
            hasCompatibleDevice={hasCompatibleDevice}
          />

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane: Item List */}
              {selectedCategory === "commlinks" && (
                <div
                  ref={commlinkScrollRef}
                  className="w-1/2 overflow-y-auto border-r border-zinc-200 p-4 dark:border-zinc-700"
                >
                  {filteredCommlinks.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-500">No commlinks found</p>
                  ) : (
                    <div
                      style={{
                        height: `${commlinkVirtualizer.getTotalSize()}px`,
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      {commlinkVirtualizer.getVirtualItems().map((virtualRow) => {
                        const commlink = filteredCommlinks[virtualRow.index];
                        return (
                          <div
                            key={commlink.id}
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
                            <CommlinkListItem
                              commlink={commlink}
                              isSelected={selectedCommlinkId === commlink.id}
                              canAfford={commlink.cost <= remaining}
                              onClick={() => setSelectedCommlinkId(commlink.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedCategory === "cyberdecks" && (
                <div
                  ref={cyberdeckScrollRef}
                  className="w-1/2 overflow-y-auto border-r border-zinc-200 p-4 dark:border-zinc-700"
                >
                  {filteredCyberdecks.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-500">No cyberdecks found</p>
                  ) : (
                    <div
                      style={{
                        height: `${cyberdeckVirtualizer.getTotalSize()}px`,
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      {cyberdeckVirtualizer.getVirtualItems().map((virtualRow) => {
                        const cyberdeck = filteredCyberdecks[virtualRow.index];
                        return (
                          <div
                            key={cyberdeck.id}
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
                            <CyberdeckListItem
                              cyberdeck={cyberdeck}
                              isSelected={selectedCyberdeckId === cyberdeck.id}
                              canAfford={cyberdeck.cost <= remaining}
                              onClick={() => setSelectedCyberdeckId(cyberdeck.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedCategory === "software" && (
                <div
                  ref={softwareScrollRef}
                  className="w-1/2 overflow-y-auto border-r border-zinc-200 p-4 dark:border-zinc-700"
                >
                  {filteredSoftware.length === 0 ? (
                    <p className="py-8 text-center text-sm text-zinc-500">No software found</p>
                  ) : (
                    <div
                      style={{
                        height: `${softwareVirtualizer.getTotalSize()}px`,
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      {softwareVirtualizer.getVirtualItems().map((virtualRow) => {
                        const item = filteredSoftware[virtualRow.index];
                        return (
                          <div
                            key={item.id}
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
                            <SoftwareListItem
                              item={item}
                              subcategory={selectedSoftwareType}
                              isSelected={selectedSoftwareId === item.id}
                              onClick={() => handleSelectSoftware(item)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Right Pane: Detail Preview */}
              <div className="w-1/2 overflow-y-auto p-6">
                <MatrixGearDetailsPane
                  selectedCategory={selectedCategory}
                  selectedSoftwareType={selectedSoftwareType}
                  remaining={remaining}
                  selectedCommlink={selectedCommlink}
                  selectedCyberdeck={selectedCyberdeck}
                  selectedSoftware={selectedSoftware}
                  specificDetails={specificDetails}
                  onSpecificDetailsChange={setSpecificDetails}
                  selectedSkillId={selectedSkillId}
                  onSelectedSkillIdChange={setSelectedSkillId}
                  rating={rating}
                  onRatingChange={setRating}
                  eligibleSkills={eligibleSkills}
                  calculateSoftwareCost={calculateSoftwareCost}
                />
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
                Budget:{" "}
                <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(remaining)}¥
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
                onClick={handlePurchase}
                disabled={!canPurchase}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  canPurchase
                    ? selectedCategory === "commlinks"
                      ? "bg-cyan-500 text-white hover:bg-cyan-600"
                      : selectedCategory === "cyberdecks"
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add {getItemTypeLabel()}
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
