"use client";

/**
 * GearCard
 *
 * Card for gear purchasing in sheet-driven creation.
 * Compact single-line rows following the WeaponRow pattern.
 *
 * Features:
 * - Progress bar for nuyen budget
 * - Category tabs (weapons, armor, gear, foci)
 * - Search and filter
 * - Compact purchased items with expand/collapse
 * - Compact catalog items with inline rating picker
 * - Footer summary matching WeaponsPanel
 */

import { useMemo, useCallback, useState } from "react";
import {
  useGear,
  useFoci,
  type GearItemData,
  type WeaponData,
  type ArmorData,
  type GearCatalogData,
} from "@/lib/rules/RulesetContext";
import type { FocusCatalogItemData } from "@/lib/rules/loader-types";
import type { CreationState, GearItem, Weapon, ArmorItem, ItemLegality } from "@/lib/types";
import type { FocusItem } from "@/lib/types/character";
import { hasUnifiedRatings } from "@/lib/types/ratings";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "./shared";
import { getRatedItemValuesUnified, type RatedItem } from "@/lib/rules/ratings";
import {
  Lock,
  Search,
  X,
  Plus,
  Minus,
  Sword,
  Shield,
  Backpack,
  Gem,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react";
import { InfoTooltip } from "@/components/ui";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;
const KARMA_TO_NUYEN_RATE = 2000;
const MAX_KARMA_CONVERSION = 10;

type GearTab = "weapons" | "armor" | "gear" | "foci";

const GEAR_TABS: Array<{ id: GearTab; label: string; icon: React.ElementType }> = [
  { id: "weapons", label: "Weapons", icon: Sword },
  { id: "armor", label: "Armor", icon: Shield },
  { id: "gear", label: "Gear", icon: Backpack },
  { id: "foci", label: "Foci", icon: Gem },
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

function isItemAvailable(availability: number): boolean {
  return availability <= MAX_AVAILABILITY;
}

// Extract all weapons from catalog into flat array
function getAllWeapons(catalog: GearCatalogData | null): WeaponData[] {
  if (!catalog?.weapons) return [];
  const weapons = catalog.weapons;
  return [
    ...weapons.melee,
    ...weapons.pistols,
    ...weapons.smgs,
    ...weapons.rifles,
    ...weapons.shotguns,
    ...weapons.sniperRifles,
    ...weapons.throwingWeapons,
    ...weapons.grenades,
  ];
}

// =============================================================================
// TYPES
// =============================================================================

interface GearCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// COMPACT CATALOG ITEM ROW (single-line, WeaponRow pattern)
// =============================================================================

function CompactCatalogRow({
  name,
  category,
  cost,
  availability,
  canAfford,
  onAdd,
}: {
  name: string;
  category: string;
  cost: number;
  availability: string;
  canAfford: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      {/* Spacer for alignment with purchased items */}
      <div className="w-4 shrink-0" />

      {/* Name */}
      <span className="flex-1 truncate text-sm text-zinc-900 dark:text-zinc-100" title={name}>
        {name}
      </span>

      {/* Category */}
      <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 w-20 truncate text-right">
        {category}
      </span>

      {/* Availability */}
      <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 w-8 text-right">
        {availability}
      </span>

      {/* Cost */}
      <span className="shrink-0 text-xs font-medium text-zinc-700 dark:text-zinc-300 w-16 text-right">
        ¥{formatCurrency(cost)}
      </span>

      {/* Add Button */}
      <button
        onClick={onAdd}
        disabled={!canAfford}
        className={`shrink-0 rounded p-1 transition-colors ${
          canAfford
            ? "text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
            : "cursor-not-allowed text-zinc-300 dark:text-zinc-600"
        }`}
        title={canAfford ? "Add to cart" : "Cannot afford"}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

// =============================================================================
// COMPACT RATED CATALOG ROW (inline rating picker on expand)
// =============================================================================

function CompactRatedCatalogRow({
  item,
  legality,
  remaining,
  onAdd,
}: {
  item: GearItemData;
  legality?: ItemLegality;
  remaining: number;
  onAdd: (rating: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const minRating = item.minRating ?? item.ratingSpec?.rating?.minRating ?? 1;
  const maxRating = item.maxRating ?? item.ratingSpec?.rating?.maxRating ?? 6;
  const [selectedRating, setSelectedRating] = useState(minRating);

  // Calculate cost and availability based on rating
  const { cost, availability } = useMemo(() => {
    if (hasUnifiedRatings(item)) {
      const values = getRatedItemValuesUnified(item as RatedItem, selectedRating);
      return {
        cost: values.cost,
        availability: values.availability,
      };
    }

    // Legacy formula-based calculation
    const baseCost = item.ratingSpec?.costScaling?.baseValue ?? item.cost;
    const baseAvail = item.ratingSpec?.availabilityScaling?.baseValue ?? item.availability;
    const costPerRating = item.ratingSpec?.costScaling?.perRating ?? 1;
    const availPerRating = item.ratingSpec?.availabilityScaling?.perRating ?? 1;

    return {
      cost: baseCost * (costPerRating ? selectedRating : 1),
      availability: baseAvail * (availPerRating ? selectedRating : 1),
    };
  }, [item, selectedRating]);

  const canAfford = cost <= remaining && availability <= MAX_AVAILABILITY;

  return (
    <div>
      {/* Compact Header Row */}
      <div className="flex items-center gap-2 py-1.5">
        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Name with rating badge */}
        <span
          className="flex-1 truncate text-sm text-zinc-900 dark:text-zinc-100"
          title={item.name}
        >
          {item.name}
        </span>

        {/* Rating badge */}
        <span className="shrink-0 flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400">
          <Settings className="h-3 w-3" />R{minRating}-{maxRating}
        </span>

        {/* Category */}
        <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 w-20 truncate text-right">
          {item.category}
        </span>

        {/* Per-rating indicator */}
        <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 w-16 text-right">
          ¥{formatCurrency(item.cost)}×R
        </span>

        {/* Settings button to expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 rounded p-1 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
          title="Configure rating"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded Rating Picker */}
      {isExpanded && (
        <div className="ml-6 mb-2 flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
          {/* Rating selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Rating:</span>
            <button
              onClick={() => setSelectedRating(Math.max(minRating, selectedRating - 1))}
              disabled={selectedRating <= minRating}
              aria-label={`Decrease ${item.name} rating`}
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                selectedRating > minRating
                  ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Minus className="h-3 w-3" aria-hidden="true" />
            </button>
            <div className="flex h-5 w-6 items-center justify-center rounded bg-white text-xs font-bold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              {selectedRating}
            </div>
            <button
              onClick={() => setSelectedRating(Math.min(maxRating, selectedRating + 1))}
              disabled={selectedRating >= maxRating}
              aria-label={`Increase ${item.name} rating`}
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                selectedRating < maxRating
                  ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          {/* Calculated values */}
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Cost:{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              ¥{formatCurrency(cost)}
            </span>
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Avail:{" "}
            <span
              className={`font-medium ${availability > MAX_AVAILABILITY ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"}`}
            >
              {getAvailabilityDisplay(availability, legality)}
            </span>
          </span>

          {/* Add button */}
          <button
            onClick={() => {
              onAdd(selectedRating);
              setIsExpanded(false);
            }}
            disabled={!canAfford}
            aria-label={`Add ${item.name} to cart`}
            className={`ml-auto flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
              canAfford
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
            Add
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPACT STACKABLE CATALOG ROW (inline quantity picker for stackable items)
// =============================================================================

function CompactStackableCatalogRow({
  item,
  remaining,
  onAdd,
}: {
  item: GearItemData;
  remaining: number;
  onAdd: (quantity: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Calculate total cost based on quantity
  const unitCost = item.cost;
  const totalCost = unitCost * selectedQuantity;
  const canAfford = totalCost <= remaining && item.availability <= MAX_AVAILABILITY;

  // Units per purchase (e.g., "sold per 10")
  const unitsPerPurchase = item.quantity || 1;

  return (
    <div>
      {/* Compact Header Row */}
      <div className="flex items-center gap-2 py-1.5">
        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Name */}
        <span
          className="flex-1 truncate text-sm text-zinc-900 dark:text-zinc-100"
          title={item.name}
        >
          {item.name}
        </span>

        {/* Stackable badge */}
        <span className="shrink-0 flex items-center gap-0.5 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          ×{unitsPerPurchase}
        </span>

        {/* Category */}
        <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 w-20 truncate text-right">
          {item.category}
        </span>

        {/* Cost per unit */}
        <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 w-16 text-right">
          ¥{formatCurrency(unitCost)}/ea
        </span>

        {/* Quick add button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 rounded p-1 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30"
          title="Select quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded Quantity Picker */}
      {isExpanded && (
        <div className="ml-6 mb-2 flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
          {/* Quantity selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Qty:</span>
            <button
              onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
              disabled={selectedQuantity <= 1}
              aria-label={`Decrease ${item.name} quantity`}
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                selectedQuantity > 1
                  ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Minus className="h-3 w-3" aria-hidden="true" />
            </button>
            <div className="flex h-5 w-8 items-center justify-center rounded bg-white text-xs font-bold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              {selectedQuantity}
            </div>
            <button
              onClick={() => setSelectedQuantity(selectedQuantity + 1)}
              disabled={unitCost * (selectedQuantity + 1) > remaining}
              aria-label={`Increase ${item.name} quantity`}
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                unitCost * (selectedQuantity + 1) <= remaining
                  ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          {/* Units info */}
          {unitsPerPurchase > 1 && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              ({selectedQuantity * unitsPerPurchase} units)
            </span>
          )}

          {/* Total cost */}
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Total:{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              ¥{formatCurrency(totalCost)}
            </span>
          </span>

          {/* Add button */}
          <button
            onClick={() => {
              onAdd(selectedQuantity);
              setIsExpanded(false);
              setSelectedQuantity(1);
            }}
            disabled={!canAfford}
            aria-label={`Add ${item.name} to cart`}
            className={`ml-auto flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
              canAfford
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
            Add
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPACT PURCHASED ITEM ROW (with expand/collapse like WeaponRow)
// =============================================================================

function CompactPurchasedRow({
  name,
  category,
  cost,
  quantity,
  unitCost,
  isStackable,
  details,
  onRemove,
  onQuantityChange,
}: {
  name: string;
  category: string;
  cost: number;
  quantity?: number;
  unitCost?: number;
  isStackable?: boolean;
  details?: React.ReactNode;
  onRemove: () => void;
  onQuantityChange?: (newQuantity: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = !!details || (isStackable && quantity && quantity > 1);

  return (
    <div>
      {/* Compact Header Row */}
      <div className="flex items-center gap-2 py-1.5">
        {/* Expand/Collapse */}
        {hasDetails ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-4 shrink-0" />
        )}

        {/* Name with quantity badge for stackable items */}
        <span
          className="flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100"
          title={name}
        >
          {name}
          {isStackable && quantity && quantity > 1 && (
            <span className="ml-1.5 inline-flex items-center rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              ×{quantity}
            </span>
          )}
        </span>

        {/* Category */}
        <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 w-20 truncate text-right">
          {category}
        </span>

        {/* Cost (total for stackable items) */}
        <span className="shrink-0 text-xs font-medium text-zinc-700 dark:text-zinc-300 w-16 text-right">
          ¥{formatCurrency(cost)}
        </span>

        {/* Separator */}
        <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600 shrink-0" />

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          title="Remove"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && hasDetails && (
        <div className="ml-6 mb-2 space-y-2">
          {/* Quantity adjuster for stackable items */}
          {isStackable && quantity && unitCost && onQuantityChange && (
            <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Qty:</span>
                <button
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                    quantity > 1
                      ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                      : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                  }`}
                >
                  <Minus className="h-3 w-3" aria-hidden="true" />
                </button>
                <div className="flex h-5 w-8 items-center justify-center rounded bg-white text-xs font-bold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                  {quantity}
                </div>
                <button
                  onClick={() => onQuantityChange(quantity + 1)}
                  aria-label="Increase quantity"
                  className="flex h-5 w-5 items-center justify-center rounded bg-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                @ ¥{formatCurrency(unitCost)}/ea
              </span>
            </div>
          )}
          {/* Other details */}
          {details && <div className="text-xs text-zinc-500 dark:text-zinc-400">{details}</div>}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GearCard({ state, updateState }: GearCardProps) {
  const gearCatalog = useGear();
  const fociCatalog = useFoci();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  const [activeTab, setActiveTab] = useState<GearTab>("gear");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract weapons and armor from gear catalog
  const allWeapons = useMemo(() => getAllWeapons(gearCatalog), [gearCatalog]);
  const allArmor = useMemo(() => gearCatalog?.armor || [], [gearCatalog]);
  const allGear = useMemo(() => {
    if (!gearCatalog) return [];
    return [
      ...gearCatalog.electronics,
      ...gearCatalog.tools,
      ...gearCatalog.survival,
      ...gearCatalog.medical,
      ...gearCatalog.security,
      ...gearCatalog.miscellaneous,
      ...(gearCatalog.rfidTags || []),
      ...(gearCatalog.industrialChemicals || []),
      ...(gearCatalog.ammunition || []),
    ];
  }, [gearCatalog]);

  // Get selections from state
  const selectedGear = useMemo(
    () => (state.selections?.gear || []) as GearItem[],
    [state.selections?.gear]
  );
  const selectedWeapons = useMemo(
    () => (state.selections?.weapons || []) as Weapon[],
    [state.selections?.weapons]
  );
  const selectedArmor = useMemo(
    () => (state.selections?.armor || []) as ArmorItem[],
    [state.selections?.armor]
  );
  const selectedFoci = useMemo(
    () => (state.selections?.foci || []) as FocusItem[],
    [state.selections?.foci]
  );

  // Check if character is magical (for foci)
  const magicPath = (state.selections?.["magical-path"] as string) || "mundane";
  const isMagical = ["magician", "mystic-adept", "aspected-mage", "adept"].includes(magicPath);

  // Karma-to-nuyen conversion
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const karmaRemaining = karmaBudget?.remaining || 0;

  // Calculate budget
  const baseNuyen = nuyenBudget?.total || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Local category costs (for card-specific displays)
  const weaponsSpent = selectedWeapons.reduce((sum, w) => sum + w.cost * w.quantity, 0);
  const armorSpent = selectedArmor.reduce((sum, a) => sum + a.cost * a.quantity, 0);
  const gearSpent = selectedGear.reduce((sum, g) => sum + g.cost * g.quantity, 0);
  const fociSpent = selectedFoci.reduce((sum, f) => sum + f.cost, 0);

  // Use centralized nuyen spent from budget context for global budget tracker
  const totalSpent = nuyenBudget?.spent || 0;
  const remaining = totalNuyen - totalSpent;
  const isOverBudget = remaining < 0;

  // Total item count
  const totalItems =
    selectedWeapons.length + selectedArmor.length + selectedGear.length + selectedFoci.length;

  // Priority source
  const prioritySource = useMemo(() => {
    const resourcePriority = state.priorities?.resources;
    if (!resourcePriority) return "";
    return `${formatCurrency(baseNuyen)}¥ from Priority ${resourcePriority}${convertedNuyen > 0 ? ` + ${formatCurrency(convertedNuyen)}¥ from karma` : ""}`;
  }, [state.priorities?.resources, baseNuyen, convertedNuyen]);

  // Handle karma conversion
  const handleKarmaConversion = useCallback(
    (delta: number) => {
      const newConversion = Math.max(0, Math.min(MAX_KARMA_CONVERSION, karmaConversion + delta));
      // Check if we have enough karma for increase
      if (delta > 0 && karmaRemaining + karmaConversion < newConversion) return;

      updateState({
        budgets: {
          ...state.budgets,
          "karma-spent-gear": newConversion,
        },
      });
    },
    [karmaConversion, karmaRemaining, state.budgets, updateState]
  );

  // Filter items based on search
  const filteredWeapons = useMemo(() => {
    let items = [...allWeapons];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((w) => w.name.toLowerCase().includes(query));
    }
    return items.filter((w) => isItemAvailable(w.availability)).slice(0, 20);
  }, [allWeapons, searchQuery]);

  const filteredArmor = useMemo(() => {
    let items = [...allArmor];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((a) => a.name.toLowerCase().includes(query));
    }
    return items.filter((a) => isItemAvailable(a.availability)).slice(0, 20);
  }, [allArmor, searchQuery]);

  const filteredGear = useMemo(() => {
    let items = [...allGear];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((g) => g.name.toLowerCase().includes(query));
    }
    return items.filter((g) => isItemAvailable(g.availability)).slice(0, 20);
  }, [allGear, searchQuery]);

  const filteredFoci = useMemo(() => {
    if (!fociCatalog || !isMagical) return [];
    let items = [...fociCatalog];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((f) => f.name.toLowerCase().includes(query));
    }
    return items.filter((f) => isItemAvailable(f.availability || 0)).slice(0, 20);
  }, [fociCatalog, searchQuery, isMagical]);

  // Add weapon
  const addWeapon = useCallback(
    (weapon: WeaponData) => {
      if (weapon.cost > remaining) return;

      const newWeapon: Weapon = {
        id: `${weapon.id}-${Date.now()}`,
        catalogId: weapon.id,
        name: weapon.name,
        category: weapon.category,
        subcategory: weapon.subcategory || weapon.category,
        damage: weapon.damage,
        ap: weapon.ap,
        mode: weapon.mode || [],
        recoil: weapon.rc,
        reach: weapon.reach,
        accuracy: weapon.accuracy,
        cost: weapon.cost,
        availability: weapon.availability,
        quantity: 1,
        modifications: [],
        occupiedMounts: [],
      };

      updateState({
        selections: {
          ...state.selections,
          weapons: [...selectedWeapons, newWeapon],
        },
      });
    },
    [remaining, selectedWeapons, state.selections, updateState]
  );

  // Add armor
  const addArmor = useCallback(
    (armor: ArmorData) => {
      if (armor.cost > remaining) return;

      const newArmor: ArmorItem = {
        id: `${armor.id}-${Date.now()}`,
        catalogId: armor.id,
        name: armor.name,
        category: armor.category,
        armorRating: armor.armorRating,
        cost: armor.cost,
        availability: armor.availability,
        quantity: 1,
        equipped: false,
        modifications: [],
      };

      updateState({
        selections: {
          ...state.selections,
          armor: [...selectedArmor, newArmor],
        },
      });
    },
    [remaining, selectedArmor, state.selections, updateState]
  );

  // Add gear (with optional rating for rated items, and quantity for stackable items)
  const addGear = useCallback(
    (gear: GearItemData, selectedRating?: number, purchaseQuantity?: number) => {
      // Determine if item has rating support
      const isRated = gear.hasRating === true;
      const isStackable = gear.stackable === true;
      const rating = isRated ? (selectedRating ?? gear.minRating ?? 1) : (gear.rating ?? 1);
      const quantity = isStackable ? (purchaseQuantity ?? 1) : 1;

      // Calculate unit cost and availability based on rating
      // Use unified ratings table if available, otherwise fall back to legacy formula
      let unitCost: number;
      let availability: number;

      if (hasUnifiedRatings(gear)) {
        const values = getRatedItemValuesUnified(gear as RatedItem, rating);
        unitCost = values.cost;
        availability = values.availability;
      } else if (isRated && gear.ratingSpec) {
        // Legacy formula-based calculation
        const baseCost = gear.ratingSpec.costScaling?.baseValue ?? gear.cost;
        const baseAvail = gear.ratingSpec.availabilityScaling?.baseValue ?? gear.availability;
        unitCost = baseCost * rating;
        availability = baseAvail * rating;
      } else {
        // Non-rated item
        unitCost = gear.cost;
        availability = gear.availability;
      }

      const totalCost = unitCost * quantity;
      if (totalCost > remaining) return;

      // For stackable items, check if we already have this item and merge quantities
      // Items are matched by catalog ID (gear.id)
      if (isStackable) {
        const existingIndex = selectedGear.findIndex((g) => g.metadata?.catalogId === gear.id);

        if (existingIndex !== -1) {
          // Merge: increase quantity of existing item
          const existingItem = selectedGear[existingIndex];
          const updatedGear = [...selectedGear];
          updatedGear[existingIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
          };
          updateState({
            selections: {
              ...state.selections,
              gear: updatedGear,
            },
          });
          return;
        }
      }

      const newGear: GearItem = {
        id: `${gear.id}-${Date.now()}`,
        name: isRated ? `${gear.name} (Rating ${rating})` : gear.name,
        category: gear.category,
        cost: unitCost, // Store unit cost; total is calculated as cost * quantity
        availability,
        quantity,
        rating: isRated ? rating : gear.rating,
        modifications: [],
        metadata: isStackable ? { catalogId: gear.id, stackable: true } : undefined,
      };

      updateState({
        selections: {
          ...state.selections,
          gear: [...selectedGear, newGear],
        },
      });
    },
    [remaining, selectedGear, state.selections, updateState]
  );

  // Add focus
  const addFocus = useCallback(
    (focus: FocusCatalogItemData) => {
      const force = 1;
      const cost = force * focus.costMultiplier;
      const bondingCost = force * focus.bondingKarmaMultiplier;

      if (cost > remaining) return;

      const newFocus: FocusItem = {
        id: `${focus.id}-${Date.now()}`,
        catalogId: focus.id,
        name: focus.name,
        type: focus.type as FocusItem["type"],
        force,
        cost,
        availability: focus.availability || 0,
        karmaToBond: bondingCost,
        bonded: false,
      };

      updateState({
        selections: {
          ...state.selections,
          foci: [...selectedFoci, newFocus],
        },
      });
    },
    [remaining, selectedFoci, state.selections, updateState]
  );

  // Remove item from cart
  const removeWeapon = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          weapons: selectedWeapons.filter((w) => w.id !== id),
        },
      });
    },
    [selectedWeapons, state.selections, updateState]
  );

  const removeArmor = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          armor: selectedArmor.filter((a) => a.id !== id),
        },
      });
    },
    [selectedArmor, state.selections, updateState]
  );

  const removeGear = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          gear: selectedGear.filter((g) => g.id !== id),
        },
      });
    },
    [selectedGear, state.selections, updateState]
  );

  // Update quantity for stackable gear items
  const updateGearQuantity = useCallback(
    (id: string, newQuantity: number) => {
      if (newQuantity < 1) return;

      const updatedGear = selectedGear.map((g) => {
        if (g.id === id) {
          return { ...g, quantity: newQuantity };
        }
        return g;
      });

      updateState({
        selections: {
          ...state.selections,
          gear: updatedGear,
        },
      });
    },
    [selectedGear, state.selections, updateState]
  );

  const removeFocus = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          foci: selectedFoci.filter((f) => f.id !== id),
        },
      });
    },
    [selectedFoci, state.selections, updateState]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (isOverBudget) return "error";
    if (totalItems > 0) return "valid";
    return "pending";
  }, [isOverBudget, totalItems]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard title="Gear" description="Purchase equipment" status="pending">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
            <Lock className="h-5 w-5 text-zinc-400" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Set priorities first</p>
          </div>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Gear"
      description={`${formatCurrency(remaining)}¥ remaining`}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Nuyen bar - compact style */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
              <span>Nuyen</span>
              <InfoTooltip
                content="Total nuyen spent across all gear categories"
                label="Nuyen budget info"
              />
              {karmaConversion > 0 && (
                <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                  (+{formatCurrency(convertedNuyen)}¥ karma)
                </span>
              )}
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatCurrency(totalSpent)} / {formatCurrency(totalNuyen)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full transition-all ${isOverBudget ? "bg-red-500" : "bg-blue-500"}`}
              style={{ width: `${Math.min(100, (totalSpent / totalNuyen) * 100)}%` }}
            />
          </div>
        </div>

        {/* Karma conversion - compact */}
        <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-amber-800 dark:text-amber-200">Karma → Nuyen</span>
            <span className="text-amber-600 dark:text-amber-400">
              ({formatCurrency(KARMA_TO_NUYEN_RATE)}¥/karma)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleKarmaConversion(-1)}
              disabled={karmaConversion <= 0}
              aria-label="Decrease karma to nuyen conversion"
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                karmaConversion > 0
                  ? "bg-amber-200 text-amber-700 hover:bg-amber-300 dark:bg-amber-900/60 dark:text-amber-300"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Minus className="h-3 w-3" aria-hidden="true" />
            </button>
            <div className="flex h-6 w-8 items-center justify-center rounded bg-white text-sm font-bold text-amber-700 dark:bg-zinc-800 dark:text-amber-300">
              {karmaConversion}
            </div>
            <button
              onClick={() => handleKarmaConversion(1)}
              disabled={karmaConversion >= MAX_KARMA_CONVERSION || karmaRemaining <= 0}
              aria-label="Increase karma to nuyen conversion"
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                karmaConversion < MAX_KARMA_CONVERSION && karmaRemaining > 0
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Category tabs - clean without counts */}
        <div className="flex gap-1">
          {GEAR_TABS.map((tab) => {
            // Hide foci tab for non-magical characters
            if (tab.id === "foci" && !isMagical) return null;

            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery("");
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Item list with purchased at top, catalog below */}
        <div className="max-h-72 overflow-y-auto">
          {/* Weapons Tab */}
          {activeTab === "weapons" && (
            <>
              {/* Purchased Weapons */}
              {selectedWeapons.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Purchased
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {selectedWeapons.map((w) => (
                      <CompactPurchasedRow
                        key={w.id}
                        name={w.name}
                        category={w.subcategory || w.category}
                        cost={w.cost}
                        details={
                          <span>
                            DMG {w.damage} • AP {w.ap} • Avail {w.availability}
                          </span>
                        }
                        onRemove={() => w.id && removeWeapon(w.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Catalog Weapons */}
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Catalog
              </div>
              {filteredWeapons.length > 0 ? (
                <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredWeapons.map((weapon) => (
                    <CompactCatalogRow
                      key={weapon.id}
                      name={weapon.name}
                      category={weapon.subcategory || weapon.category}
                      cost={weapon.cost}
                      availability={getAvailabilityDisplay(weapon.availability, weapon.legality)}
                      canAfford={weapon.cost <= remaining}
                      onAdd={() => addWeapon(weapon)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">No weapons found</p>
                </div>
              )}
            </>
          )}

          {/* Armor Tab */}
          {activeTab === "armor" && (
            <>
              {/* Purchased Armor */}
              {selectedArmor.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Purchased
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {selectedArmor.map((a) => (
                      <CompactPurchasedRow
                        key={a.id}
                        name={a.name}
                        category={a.category}
                        cost={a.cost}
                        details={
                          <span>
                            Rating {a.armorRating} • Avail {a.availability}
                          </span>
                        }
                        onRemove={() => a.id && removeArmor(a.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Catalog Armor */}
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Catalog
              </div>
              {filteredArmor.length > 0 ? (
                <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredArmor.map((armor) => (
                    <CompactCatalogRow
                      key={armor.id}
                      name={armor.name}
                      category={`R${armor.armorRating}`}
                      cost={armor.cost}
                      availability={getAvailabilityDisplay(armor.availability, armor.legality)}
                      canAfford={armor.cost <= remaining}
                      onAdd={() => addArmor(armor)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">No armor found</p>
                </div>
              )}
            </>
          )}

          {/* Gear Tab */}
          {activeTab === "gear" && (
            <>
              {/* Purchased Gear */}
              {selectedGear.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Purchased
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {selectedGear.map((g) => {
                      const isStackable = g.metadata?.stackable === true;
                      return (
                        <CompactPurchasedRow
                          key={g.id}
                          name={g.name}
                          category={g.category}
                          cost={g.cost * g.quantity}
                          quantity={g.quantity}
                          unitCost={g.cost}
                          isStackable={isStackable}
                          details={
                            g.rating ? (
                              <span>
                                Rating {g.rating} • Avail {g.availability}
                              </span>
                            ) : undefined
                          }
                          onRemove={() => g.id && removeGear(g.id)}
                          onQuantityChange={
                            isStackable && g.id
                              ? (newQty) => updateGearQuantity(g.id!, newQty)
                              : undefined
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Catalog Gear */}
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Catalog
              </div>
              {filteredGear.length > 0 ? (
                <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredGear.map((gear) => {
                    // Use rated row for items with hasRating
                    if (gear.hasRating === true) {
                      return (
                        <CompactRatedCatalogRow
                          key={gear.id}
                          item={gear}
                          legality={gear.legality}
                          remaining={remaining}
                          onAdd={(rating) => addGear(gear, rating)}
                        />
                      );
                    }

                    // Use stackable row for stackable items
                    if (gear.stackable === true) {
                      return (
                        <CompactStackableCatalogRow
                          key={gear.id}
                          item={gear}
                          remaining={remaining}
                          onAdd={(quantity) => addGear(gear, undefined, quantity)}
                        />
                      );
                    }

                    return (
                      <CompactCatalogRow
                        key={gear.id}
                        name={gear.name}
                        category={gear.category}
                        cost={gear.cost}
                        availability={getAvailabilityDisplay(gear.availability, gear.legality)}
                        canAfford={gear.cost <= remaining}
                        onAdd={() => addGear(gear)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">No gear found</p>
                </div>
              )}
            </>
          )}

          {/* Foci Tab */}
          {activeTab === "foci" && (
            <>
              {/* Purchased Foci */}
              {selectedFoci.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Purchased
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {selectedFoci.map((f) => (
                      <CompactPurchasedRow
                        key={f.id}
                        name={f.name}
                        category={f.type}
                        cost={f.cost}
                        details={
                          <span>
                            Force {f.force} • Bond {f.karmaToBond} karma
                          </span>
                        }
                        onRemove={() => f.id && removeFocus(f.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Catalog Foci */}
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Catalog
              </div>
              {filteredFoci.length > 0 ? (
                <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-2 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredFoci.map((focus) => {
                    const focusCost = focus.costMultiplier;
                    return (
                      <CompactCatalogRow
                        key={focus.id}
                        name={focus.name}
                        category={focus.type}
                        cost={focusCost}
                        availability={getAvailabilityDisplay(
                          focus.availability || 0,
                          focus.legality
                        )}
                        canAfford={focusCost <= remaining}
                        onAdd={() => addFocus(focus)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {isMagical ? "No foci found" : "Foci require a magical tradition"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Summary - matching WeaponsPanel */}
        <div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-700">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Total: {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
          <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(gearSpent + weaponsSpent + armorSpent + fociSpent)}¥
          </span>
        </div>
      </div>
    </CreationCard>
  );
}
