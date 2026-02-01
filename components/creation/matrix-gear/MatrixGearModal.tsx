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
import type {
  CharacterCommlink,
  CharacterCyberdeck,
  CharacterDataSoftware,
  ItemLegality,
} from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import {
  Search,
  Smartphone,
  Cpu,
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

type MatrixGearCategory = "commlinks" | "cyberdecks" | "software";
type SoftwareSubcategory = "datasoft" | "mapsoft" | "shopsoft" | "tutorsoft";

const MATRIX_CATEGORIES = [
  { id: "commlinks" as const, label: "Commlinks", icon: Smartphone },
  { id: "cyberdecks" as const, label: "Cyberdecks", icon: Cpu },
  { id: "software" as const, label: "Software", icon: Database },
];

const SOFTWARE_SUBCATEGORIES = [
  {
    id: "datasoft" as const,
    label: "Datasoft",
    icon: Database,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: "mapsoft" as const,
    label: "Mapsoft",
    icon: Map,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    id: "shopsoft" as const,
    label: "Shopsoft",
    icon: ShoppingCart,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    id: "tutorsoft" as const,
    label: "Tutorsoft",
    icon: GraduationCap,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
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

function getAvailabilityDisplay(availability: number, legality?: ItemLegality): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

function formatAttributeArray(deck: CyberdeckData): string {
  const attrs = deck.attributes;
  return `${attrs.attack}/${attrs.sleaze}/${attrs.dataProcessing}/${attrs.firewall}`;
}

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
// COMMLINK LIST ITEM
// =============================================================================

function CommlinkListItem({
  commlink,
  isSelected,
  canAfford,
  onClick,
}: {
  commlink: CommlinkData;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? "border-cyan-400 bg-cyan-50 dark:border-cyan-600 dark:bg-cyan-900/30"
          : canAfford
            ? "border-zinc-200 bg-white hover:border-cyan-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-cyan-500"
            : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-cyan-500" />
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {commlink.name}
            </span>
            <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[10px] font-medium text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400">
              DR {commlink.deviceRating}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Avail: {getAvailabilityDisplay(commlink.availability, commlink.legality)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(commlink.cost)}¥
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// CYBERDECK LIST ITEM
// =============================================================================

function CyberdeckListItem({
  cyberdeck,
  isSelected,
  canAfford,
  onClick,
}: {
  cyberdeck: CyberdeckData;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? "border-purple-400 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/30"
          : canAfford
            ? "border-zinc-200 bg-white hover:border-purple-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-purple-500"
            : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-purple-500" />
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {cyberdeck.name}
            </span>
            <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
              DR {cyberdeck.deviceRating}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>ASDF: {formatAttributeArray(cyberdeck)}</span>
            <span>Programs: {cyberdeck.programs}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(cyberdeck.cost)}¥
          </div>
          <div className="text-xs text-zinc-500">
            {getAvailabilityDisplay(cyberdeck.availability, cyberdeck.legality)}
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// SOFTWARE LIST ITEM
// =============================================================================

function SoftwareListItem({
  item,
  subcategory,
  isSelected,
  onClick,
}: {
  item: DataSoftwareCatalogItemData;
  subcategory: SoftwareSubcategory;
  isSelected: boolean;
  onClick: () => void;
}) {
  const config = SOFTWARE_SUBCATEGORIES.find((s) => s.id === subcategory)!;
  const Icon = config.icon;

  const costDisplay = item.hasRating
    ? `${formatCurrency(item.ratings?.["1"]?.cost || 400)}¥ - ${formatCurrency(item.ratings?.["6"]?.cost || 2400)}¥`
    : `${formatCurrency(item.cost || 0)}¥`;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? `${config.bgColor} border-zinc-300 dark:border-zinc-600`
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
          <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {costDisplay}
          </div>
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

  // Filter commlinks
  const filteredCommlinks = useMemo(() => {
    let items = [...commlinks];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(query));
    }
    return items.sort((a, b) => a.deviceRating - b.deviceRating || a.name.localeCompare(b.name));
  }, [commlinks, searchQuery]);

  // Filter cyberdecks
  const filteredCyberdecks = useMemo(() => {
    let items = [...cyberdecks];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(query));
    }
    return items.sort((a, b) => a.deviceRating - b.deviceRating || a.name.localeCompare(b.name));
  }, [cyberdecks, searchQuery]);

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

          {/* Search & Category Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={`Search ${selectedCategory}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Category Pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              {MATRIX_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedCommlinkId(null);
                      setSelectedCyberdeckId(null);
                      setSelectedSoftwareId(null);
                    }}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? cat.id === "commlinks"
                          ? "bg-cyan-500 text-white"
                          : cat.id === "cyberdecks"
                            ? "bg-purple-500 text-white"
                            : "bg-blue-500 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Software Sub-Pills */}
            {selectedCategory === "software" && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SOFTWARE_SUBCATEGORIES.map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedSoftwareType(sub.id);
                        setSelectedSoftwareId(null);
                      }}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                        selectedSoftwareType === sub.id
                          ? `${sub.bgColor} ${sub.color}`
                          : "bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {sub.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Device Warning for Software */}
            {selectedCategory === "software" && !hasCompatibleDevice && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 dark:bg-amber-900/20">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div className="text-xs">
                  <span className="font-medium text-amber-700 dark:text-amber-300">
                    Software requires a commlink or cyberdeck.
                  </span>
                  <span className="text-amber-600 dark:text-amber-400">
                    {" "}
                    You can still purchase for later use.
                  </span>
                </div>
              </div>
            )}
          </div>

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
                {/* Commlink Detail */}
                {selectedCategory === "commlinks" && selectedCommlink && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedCommlink.name}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Commlink</p>
                    </div>

                    {selectedCommlink.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedCommlink.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400">Device Rating</span>
                          <span className="font-medium text-cyan-600 dark:text-cyan-400">
                            {selectedCommlink.deviceRating}
                          </span>
                        </div>
                        <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400">Data Processing</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedCommlink.deviceRating}
                          </span>
                        </div>
                        <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400">Firewall</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedCommlink.deviceRating}
                          </span>
                        </div>
                        <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                          <span
                            className={`font-medium ${
                              selectedCommlink.legality === "forbidden"
                                ? "text-red-600 dark:text-red-400"
                                : selectedCommlink.legality === "restricted"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-zinc-900 dark:text-zinc-100"
                            }`}
                          >
                            {getAvailabilityDisplay(
                              selectedCommlink.availability,
                              selectedCommlink.legality
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Cost
                        </span>
                        <span
                          className={`font-semibold ${
                            selectedCommlink.cost <= remaining
                              ? "text-cyan-600 dark:text-cyan-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(selectedCommlink.cost)}¥
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cyberdeck Detail */}
                {selectedCategory === "cyberdecks" && selectedCyberdeck && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedCyberdeck.name}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Cyberdeck</p>
                    </div>

                    {selectedCyberdeck.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedCyberdeck.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Device Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400">Device Rating</span>
                          <span className="font-medium text-purple-600 dark:text-purple-400">
                            {selectedCyberdeck.deviceRating}
                          </span>
                        </div>
                        <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400">Program Slots</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedCyberdeck.programs}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Matrix Attributes (ASDF)
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between rounded bg-red-50 px-3 py-2 text-sm dark:bg-red-900/20">
                          <span className="text-red-600 dark:text-red-400">Attack</span>
                          <span className="font-medium text-red-700 dark:text-red-300">
                            {selectedCyberdeck.attributes.attack}
                          </span>
                        </div>
                        <div className="flex justify-between rounded bg-yellow-50 px-3 py-2 text-sm dark:bg-yellow-900/20">
                          <span className="text-yellow-600 dark:text-yellow-400">Sleaze</span>
                          <span className="font-medium text-yellow-700 dark:text-yellow-300">
                            {selectedCyberdeck.attributes.sleaze}
                          </span>
                        </div>
                        <div className="flex justify-between rounded bg-blue-50 px-3 py-2 text-sm dark:bg-blue-900/20">
                          <span className="text-blue-600 dark:text-blue-400">Data Proc</span>
                          <span className="font-medium text-blue-700 dark:text-blue-300">
                            {selectedCyberdeck.attributes.dataProcessing}
                          </span>
                        </div>
                        <div className="flex justify-between rounded bg-green-50 px-3 py-2 text-sm dark:bg-green-900/20">
                          <span className="text-green-600 dark:text-green-400">Firewall</span>
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {selectedCyberdeck.attributes.firewall}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Legality Warning */}
                    {(selectedCyberdeck.legality === "restricted" ||
                      selectedCyberdeck.legality === "forbidden") && (
                      <div
                        className={`rounded-lg p-3 ${
                          selectedCyberdeck.legality === "forbidden"
                            ? "bg-red-50 dark:bg-red-900/20"
                            : "bg-amber-50 dark:bg-amber-900/20"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 text-sm font-medium ${
                            selectedCyberdeck.legality === "forbidden"
                              ? "text-red-700 dark:text-red-300"
                              : "text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          {selectedCyberdeck.legality === "forbidden"
                            ? "Forbidden - Illegal to possess"
                            : "Restricted - Requires license"}
                        </div>
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
                            selectedCyberdeck.cost <= remaining
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(selectedCyberdeck.cost)}¥
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Software Detail */}
                {selectedCategory === "software" && selectedSoftware && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedSoftware.name}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {SOFTWARE_SUBCATEGORIES.find((s) => s.id === selectedSoftwareType)?.label}
                      </p>
                    </div>

                    {selectedSoftware.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedSoftware.description}
                      </p>
                    )}

                    {selectedSoftware.effects && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Effect
                        </span>
                        <p className="rounded bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {selectedSoftware.effects}
                        </p>
                      </div>
                    )}

                    {/* Specific Details Input */}
                    {selectedSoftware.requiresSpecificDetails && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          {selectedSoftware.specificDetailsLabel || "Details"} *
                        </label>
                        <input
                          type="text"
                          value={specificDetails}
                          onChange={(e) => setSpecificDetails(e.target.value)}
                          placeholder={
                            selectedSoftware.specificDetailsPlaceholder || "Enter details..."
                          }
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />
                      </div>
                    )}

                    {/* Skill Selection (for Tutorsoft) */}
                    {selectedSoftware.requiresSkillSelection && (
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

                    {/* Rating Selector */}
                    {selectedSoftware.hasRating && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Rating
                        </label>
                        <RatingSelector
                          value={rating}
                          min={selectedSoftware.minRating || 1}
                          max={Math.min(
                            selectedSoftware.maxRating || 6,
                            Math.max(
                              ...Object.entries(selectedSoftware.ratings || {})
                                .filter(([, data]) => data.availability <= MAX_AVAILABILITY)
                                .map(([r]) => parseInt(r, 10))
                            )
                          )}
                          onChange={setRating}
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
                            calculateSoftwareCost() <= remaining
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(calculateSoftwareCost())}¥
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {((selectedCategory === "commlinks" && !selectedCommlink) ||
                  (selectedCategory === "cyberdecks" && !selectedCyberdeck) ||
                  (selectedCategory === "software" && !selectedSoftware)) && (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    {selectedCategory === "commlinks" && <Smartphone className="h-12 w-12" />}
                    {selectedCategory === "cyberdecks" && <Cpu className="h-12 w-12" />}
                    {selectedCategory === "software" && <Database className="h-12 w-12" />}
                    <p className="mt-4 text-sm">Select an item from the list</p>
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
