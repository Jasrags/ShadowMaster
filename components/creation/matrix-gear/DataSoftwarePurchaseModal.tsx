"use client";

/**
 * DataSoftwarePurchaseModal
 *
 * Modal for browsing and purchasing data software (Datasoft, Mapsoft, Shopsoft, Tutorsoft)
 * during character creation.
 *
 * Features:
 * - Category tabs to switch between software types
 * - Search/filter
 * - Virtualized list with detail panel
 * - Specific details input (for Datasoft/Mapsoft/Shopsoft)
 * - Skill selector + rating controls (for Tutorsoft)
 * - Device warning banner if no commlink/cyberdeck owned
 */

import { useState, useMemo, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useDataSoftwareCatalog,
  useSkills,
  type DataSoftwareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { CharacterDataSoftware } from "@/lib/types";
import { BaseModalRoot } from "@/components/ui";
import {
  Search,
  X,
  Database,
  Map,
  ShoppingCart,
  GraduationCap,
  AlertTriangle,
  Minus,
  Plus,
} from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

type DataSoftwareCategory = "datasoft" | "mapsoft" | "shopsoft" | "tutorsoft";

const CATEGORY_CONFIG: Record<
  DataSoftwareCategory,
  { label: string; icon: typeof Database; color: string; bgColor: string }
> = {
  datasoft: {
    label: "Datasoft",
    icon: Database,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  mapsoft: {
    label: "Mapsoft",
    icon: Map,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  shopsoft: {
    label: "Shopsoft",
    icon: ShoppingCart,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  tutorsoft: {
    label: "Tutorsoft",
    icon: GraduationCap,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
};

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

// =============================================================================
// TYPES
// =============================================================================

interface DataSoftwarePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
  onPurchase: (software: CharacterDataSoftware) => void;
  /** Whether the character has a commlink or cyberdeck to run software */
  hasCompatibleDevice: boolean;
}

// =============================================================================
// CATEGORY TAB
// =============================================================================

function CategoryTab({
  category,
  isActive,
  onClick,
}: {
  category: DataSoftwareCategory;
  isActive: boolean;
  onClick: () => void;
}) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
        isActive
          ? `${config.bgColor} ${config.color}`
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      }`}
    >
      <Icon className="h-4 w-4" />
      {config.label}
    </button>
  );
}

// =============================================================================
// SOFTWARE LIST ITEM
// =============================================================================

function SoftwareListItem({
  item,
  category,
  isSelected,
  onClick,
}: {
  item: DataSoftwareCatalogItemData;
  category: DataSoftwareCategory;
  isSelected: boolean;
  onClick: () => void;
}) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  // For items with ratings, show range
  const costDisplay = item.hasRating
    ? `${formatCurrency(item.ratings?.["1"]?.cost || 400)}¥ - ${formatCurrency(item.ratings?.["6"]?.cost || 2400)}¥`
    : `${formatCurrency(item.cost || 0)}¥`;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? `border-${config.color.replace("text-", "")}/40 ${config.bgColor}`
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Icon className={`h-3.5 w-3.5 ${config.color}`} />
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {item.name}
            </span>
            {item.hasRating && (
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                R{item.minRating || 1}-{item.maxRating || 6}
              </span>
            )}
          </div>
          {item.effects && (
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {item.effects}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{costDisplay}</div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// RATING SELECTOR
// =============================================================================

function RatingSelector({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DataSoftwarePurchaseModal({
  isOpen,
  onClose,
  remaining,
  onPurchase,
  hasCompatibleDevice,
}: DataSoftwarePurchaseModalProps) {
  const dataSoftware = useDataSoftwareCatalog();
  const { activeSkills } = useSkills();

  const [selectedCategory, setSelectedCategory] = useState<DataSoftwareCategory>("datasoft");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<DataSoftwareCatalogItemData | null>(null);

  // Form state for purchase
  const [specificDetails, setSpecificDetails] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [rating, setRating] = useState(1);

  // Get items for current category
  const categoryItems = useMemo(() => {
    if (!dataSoftware) return [];

    let items: DataSoftwareCatalogItemData[] = [];
    switch (selectedCategory) {
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
        // Check if any rating is available at creation
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
  }, [dataSoftware, selectedCategory, searchQuery]);

  // Filter skills for tutorsoft (exclude magic/resonance skills)
  const eligibleSkills = useMemo(() => {
    return activeSkills.filter(
      (skill) => !skill.requiresMagic && !skill.requiresResonance && skill.category !== "magic"
    );
  }, [activeSkills]);

  // Virtualization setup
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: categoryItems.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  // Calculate cost for current selection
  const calculateCost = useCallback(() => {
    if (!selectedItem) return 0;

    if (selectedItem.hasRating && selectedItem.ratings) {
      return selectedItem.ratings[String(rating)]?.cost || 0;
    }
    return selectedItem.cost || 0;
  }, [selectedItem, rating]);

  // Calculate availability for current selection
  const calculateAvailability = useCallback(() => {
    if (!selectedItem) return 0;

    if (selectedItem.hasRating && selectedItem.ratings) {
      return selectedItem.ratings[String(rating)]?.availability || 0;
    }
    return selectedItem.availability || 0;
  }, [selectedItem, rating]);

  const currentCost = calculateCost();
  const currentAvailability = calculateAvailability();
  const canAfford = currentCost <= remaining;

  // Validate purchase requirements
  const isValid = useMemo(() => {
    if (!selectedItem) return false;

    // Check specific details requirement
    if (selectedItem.requiresSpecificDetails && !specificDetails.trim()) {
      return false;
    }

    // Check skill selection for tutorsofts
    if (selectedItem.requiresSkillSelection && !selectedSkillId) {
      return false;
    }

    return true;
  }, [selectedItem, specificDetails, selectedSkillId]);

  const canPurchase = canAfford && isValid;

  // Reset form when item changes
  const handleSelectItem = useCallback((item: DataSoftwareCatalogItemData) => {
    setSelectedItem(item);
    setSpecificDetails("");
    setSelectedSkillId("");
    setRating(item.minRating || 1);
  }, []);

  // Reset when category changes
  const handleCategoryChange = useCallback((category: DataSoftwareCategory) => {
    setSelectedCategory(category);
    setSelectedItem(null);
    setSpecificDetails("");
    setSelectedSkillId("");
    setRating(1);
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    setSearchQuery("");
    setSelectedItem(null);
    setSpecificDetails("");
    setSelectedSkillId("");
    setRating(1);
    onClose();
  }, [onClose]);

  // Handle purchase
  const handlePurchase = useCallback(() => {
    if (!selectedItem || !canPurchase) return;

    const selectedSkill = eligibleSkills.find((s) => s.id === selectedSkillId);

    // Build display name
    let displayName = selectedItem.name;
    if (selectedItem.requiresSpecificDetails && specificDetails) {
      displayName = `${selectedItem.name} (${specificDetails})`;
    } else if (selectedItem.requiresSkillSelection && selectedSkill) {
      displayName = `${selectedItem.name} (${selectedSkill.name}) R${rating}`;
    }

    const software: CharacterDataSoftware = {
      id: `${selectedItem.id}-${Date.now()}`,
      catalogId: selectedItem.id,
      type: selectedCategory,
      name: selectedItem.name,
      displayName,
      rating: selectedItem.hasRating ? rating : undefined,
      specificDetails: selectedItem.requiresSpecificDetails ? specificDetails : undefined,
      selectedSkillId: selectedItem.requiresSkillSelection ? selectedSkillId : undefined,
      selectedSkillName: selectedSkill?.name,
      cost: currentCost,
      availability: currentAvailability,
    };

    onPurchase(software);
    handleClose();
  }, [
    selectedItem,
    canPurchase,
    selectedCategory,
    specificDetails,
    selectedSkillId,
    rating,
    currentCost,
    currentAvailability,
    eligibleSkills,
    onPurchase,
    handleClose,
  ]);

  const config = CATEGORY_CONFIG[selectedCategory];

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="2xl">
      {({ close }) => (
        <div className="flex max-h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Data Software
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {formatCurrency(remaining)}¥ remaining
              </p>
            </div>
            <button
              onClick={close}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            {(["datasoft", "mapsoft", "shopsoft", "tutorsoft"] as DataSoftwareCategory[]).map(
              (category) => (
                <CategoryTab
                  key={category}
                  category={category}
                  isActive={selectedCategory === category}
                  onClick={() => handleCategoryChange(category)}
                />
              )
            )}
          </div>

          {/* Device Warning */}
          {!hasCompatibleDevice && (
            <div className="mx-6 mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div className="text-sm">
                <span className="font-medium text-amber-700 dark:text-amber-300">
                  Data software requires a commlink or cyberdeck to run.
                </span>
                <span className="text-amber-600 dark:text-amber-400">
                  {" "}
                  You can still purchase software for later use.
                </span>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={`Search ${config.label.toLowerCase()}s...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Content - Split Pane */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Item List - Virtualized */}
            <div
              ref={scrollContainerRef}
              className="w-1/2 overflow-y-auto border-r border-zinc-100 p-4 dark:border-zinc-800"
            >
              {categoryItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No items found</p>
              ) : (
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const item = categoryItems[virtualRow.index];
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
                          category={selectedCategory}
                          isSelected={selectedItem?.id === item.id}
                          onClick={() => handleSelectItem(item)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Detail Panel */}
            <div className="w-1/2 overflow-y-auto p-4">
              {selectedItem ? (
                <div className="space-y-4">
                  {/* Item Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedItem.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{config.label}</p>
                  </div>

                  {/* Description */}
                  {selectedItem.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedItem.description}
                    </p>
                  )}

                  {/* Effects */}
                  {selectedItem.effects && (
                    <div className="space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Effect
                      </span>
                      <p className="rounded bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {selectedItem.effects}
                      </p>
                    </div>
                  )}

                  {/* Specific Details Input */}
                  {selectedItem.requiresSpecificDetails && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {selectedItem.specificDetailsLabel || "Details"} *
                      </label>
                      <input
                        type="text"
                        value={specificDetails}
                        onChange={(e) => setSpecificDetails(e.target.value)}
                        placeholder={selectedItem.specificDetailsPlaceholder || "Enter details..."}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                    </div>
                  )}

                  {/* Skill Selection (for Tutorsoft) */}
                  {selectedItem.requiresSkillSelection && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Skill *
                      </label>
                      <select
                        value={selectedSkillId}
                        onChange={(e) => setSelectedSkillId(e.target.value)}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      >
                        <option value="">Select a skill...</option>
                        {eligibleSkills.map((skill) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Rating Selector (for Tutorsoft) */}
                  {selectedItem.hasRating && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Rating
                      </label>
                      <RatingSelector
                        value={rating}
                        min={selectedItem.minRating || 1}
                        max={Math.min(
                          selectedItem.maxRating || 6,
                          // Filter to max available rating at creation
                          Math.max(
                            ...Object.entries(selectedItem.ratings || {})
                              .filter(([, data]) => data.availability <= MAX_AVAILABILITY)
                              .map(([r]) => parseInt(r, 10))
                          )
                        )}
                        onChange={setRating}
                      />
                    </div>
                  )}

                  {/* Cost & Availability */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Purchase Info
                    </span>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Cost</span>
                      <span
                        className={`font-medium ${
                          !canAfford
                            ? "text-red-600 dark:text-red-400"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {formatCurrency(currentCost)}¥{!canAfford && " (over budget)"}
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {currentAvailability}
                      </span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <div className="pt-2">
                    <button
                      onClick={handlePurchase}
                      disabled={!canPurchase}
                      className={`w-full rounded-lg py-3 text-sm font-medium transition-colors ${
                        canPurchase
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                      }`}
                    >
                      {!canAfford
                        ? `Cannot Afford (${formatCurrency(currentCost)}¥)`
                        : !isValid
                          ? "Complete Required Fields"
                          : `Purchase - ${formatCurrency(currentCost)}¥`}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <p className="text-sm">Select an item to see details</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 dark:border-zinc-700">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""} available
            </div>
            <button
              onClick={close}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </BaseModalRoot>
  );
}
