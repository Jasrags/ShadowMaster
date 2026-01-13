"use client";

/**
 * GearCard
 *
 * Card for gear purchasing in sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - Progress bar for nuyen budget
 * - Category tabs (weapons, armor, gear, foci)
 * - Search and filter
 * - Karma-to-nuyen conversion
 * - Shopping cart with item display
 * - Modal-style gear selection
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
import { hasUnifiedRatings, getRatingTableValue } from "@/lib/types/ratings";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, RatingSelector } from "./shared";
import { getRatedItemValuesUnified, type RatedItem } from "@/lib/rules/ratings";
import {
  Lock,
  Search,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Sword,
  Shield,
  Backpack,
  Gem,
  AlertTriangle,
  Info,
} from "lucide-react";

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
// GEAR ITEM ROW COMPONENT
// =============================================================================

function GearItemRow({
  name,
  stats,
  cost,
  availability,
  canAfford,
  onAdd,
}: {
  name: string;
  stats?: React.ReactNode;
  cost: number;
  availability: string;
  canAfford: boolean;
  onAdd: () => void;
}) {
  return (
    <button
      onClick={onAdd}
      disabled={!canAfford}
      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
        canAfford
          ? "border-zinc-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20"
          : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium text-zinc-900 dark:text-zinc-100">{name}</div>
        <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          {stats}
          <span>Avail: {availability}</span>
        </div>
      </div>
      <div className="ml-3 flex flex-col items-end gap-1">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {formatCurrency(cost)}¥
        </span>
        {canAfford && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
            <Plus className="h-3 w-3" />
            Add
          </span>
        )}
      </div>
    </button>
  );
}

// =============================================================================
// RATED GEAR ITEM ROW COMPONENT (supports unified ratings tables)
// =============================================================================

function RatedGearItemRow({
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
  const minRating = item.minRating ?? item.ratingSpec?.rating?.minRating ?? 1;
  const maxRating = item.maxRating ?? item.ratingSpec?.rating?.maxRating ?? 6;
  const [selectedRating, setSelectedRating] = useState(minRating);

  // Calculate cost and availability based on rating
  // Use unified ratings table if available, otherwise fall back to legacy formula
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
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-zinc-900 dark:text-zinc-100">
            {item.name}
            <span className="ml-1.5 text-xs text-zinc-500">
              (R{minRating}-{maxRating})
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{item.category}</span>
            <span>Avail: {getAvailabilityDisplay(availability, legality)}</span>
          </div>
        </div>
        <div className="ml-3 text-right">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(cost)}¥
          </span>
        </div>
      </div>

      {/* Rating selector */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Rating:</span>
          <button
            onClick={() => setSelectedRating(Math.max(minRating, selectedRating - 1))}
            disabled={selectedRating <= minRating}
            aria-label={`Decrease ${item.name} rating`}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              selectedRating > minRating
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Minus className="h-3 w-3" aria-hidden="true" />
          </button>
          <div className="flex h-6 w-8 items-center justify-center rounded bg-zinc-100 text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            {selectedRating}
          </div>
          <button
            onClick={() => setSelectedRating(Math.min(maxRating, selectedRating + 1))}
            disabled={selectedRating >= maxRating}
            aria-label={`Increase ${item.name} rating`}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              selectedRating < maxRating
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
        <button
          onClick={() => onAdd(selectedRating)}
          disabled={!canAfford}
          aria-label={`Add ${item.name} to cart`}
          className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
            canAfford
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
          Add
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// CART ITEM ROW COMPONENT
// =============================================================================

function CartItemRow({
  name,
  cost,
  onRemove,
}: {
  name: string;
  cost: number;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">{name}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">{formatCurrency(cost)}¥</span>
        <button
          onClick={onRemove}
          className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
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

  const [activeTab, setActiveTab] = useState<GearTab>("weapons");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);

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

  // Calculate spent
  const weaponsSpent = selectedWeapons.reduce((sum, w) => sum + w.cost * w.quantity, 0);
  const armorSpent = selectedArmor.reduce((sum, a) => sum + a.cost * a.quantity, 0);
  const gearSpent = selectedGear.reduce((sum, g) => sum + g.cost * g.quantity, 0);
  const fociSpent = selectedFoci.reduce((sum, f) => sum + f.cost, 0);
  const augmentationSpent =
    ((state.selections?.cyberware as Array<{ cost: number }>) || []).reduce(
      (s, i) => s + i.cost,
      0
    ) +
    ((state.selections?.bioware as Array<{ cost: number }>) || []).reduce((s, i) => s + i.cost, 0);
  const lifestyleSpent = (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;
  const totalSpent =
    weaponsSpent + armorSpent + gearSpent + fociSpent + augmentationSpent + lifestyleSpent;
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

  // Add gear (with optional rating for rated items)
  const addGear = useCallback(
    (gear: GearItemData, selectedRating?: number) => {
      // Determine if item has rating support
      const isRated = gear.hasRating === true;
      const rating = isRated ? (selectedRating ?? gear.minRating ?? 1) : (gear.rating ?? 1);

      // Calculate cost and availability based on rating
      // Use unified ratings table if available, otherwise fall back to legacy formula
      let cost: number;
      let availability: number;

      if (hasUnifiedRatings(gear)) {
        const values = getRatedItemValuesUnified(gear as RatedItem, rating);
        cost = values.cost;
        availability = values.availability;
      } else if (isRated && gear.ratingSpec) {
        // Legacy formula-based calculation
        const baseCost = gear.ratingSpec.costScaling?.baseValue ?? gear.cost;
        const baseAvail = gear.ratingSpec.availabilityScaling?.baseValue ?? gear.availability;
        cost = baseCost * rating;
        availability = baseAvail * rating;
      } else {
        // Non-rated item
        cost = gear.cost;
        availability = gear.availability;
      }

      if (cost > remaining) return;

      const newGear: GearItem = {
        id: `${gear.id}-${Date.now()}`,
        name: isRated ? `${gear.name} (Rating ${rating})` : gear.name,
        category: gear.category,
        cost,
        availability,
        quantity: 1,
        rating: isRated ? rating : gear.rating,
        modifications: [],
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
      headerAction={
        <button
          onClick={() => setShowCart(!showCart)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            showCart
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {totalItems}
        </button>
      }
    >
      <div className="space-y-4">
        {/* Nuyen bar - compact style */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
              <span>Nuyen</span>
              <span className="group relative">
                <Info className="h-3 w-3 cursor-help text-zinc-400" />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-[10px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
                  Total nuyen spent across all gear categories
                </span>
              </span>
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

        {/* Shopping cart */}
        {showCart && totalItems > 0 && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Shopping Cart ({totalItems})
              </h4>
              <span className="text-xs text-zinc-500">
                {formatCurrency(weaponsSpent + armorSpent + gearSpent + fociSpent)}¥
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-700">
              {selectedWeapons.map((w) => (
                <CartItemRow
                  key={w.id}
                  name={w.name}
                  cost={w.cost}
                  onRemove={() => w.id && removeWeapon(w.id)}
                />
              ))}
              {selectedArmor.map((a) => (
                <CartItemRow
                  key={a.id}
                  name={a.name}
                  cost={a.cost}
                  onRemove={() => a.id && removeArmor(a.id)}
                />
              ))}
              {selectedGear.map((g) => (
                <CartItemRow
                  key={g.id}
                  name={g.name}
                  cost={g.cost}
                  onRemove={() => g.id && removeGear(g.id)}
                />
              ))}
              {selectedFoci.map((f) => (
                <CartItemRow
                  key={f.id}
                  name={f.name}
                  cost={f.cost}
                  onRemove={() => f.id && removeFocus(f.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-1">
          {GEAR_TABS.map((tab) => {
            // Hide foci tab for non-magical characters
            if (tab.id === "foci" && !isMagical) return null;

            const Icon = tab.icon;
            const count =
              tab.id === "weapons"
                ? selectedWeapons.length
                : tab.id === "armor"
                  ? selectedArmor.length
                  : tab.id === "gear"
                    ? selectedGear.length
                    : tab.id === "foci"
                      ? selectedFoci.length
                      : 0;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery("");
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-white"
                    : count > 0
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                      activeTab === tab.id ? "bg-white/20" : "bg-amber-200/50 dark:bg-amber-800/50"
                    }`}
                  >
                    {count}
                  </span>
                )}
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

        {/* Item list */}
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {/* Weapons Tab */}
          {activeTab === "weapons" &&
            filteredWeapons.map((weapon) => (
              <GearItemRow
                key={weapon.id}
                name={weapon.name}
                stats={
                  <>
                    <span>DMG: {weapon.damage}</span>
                    <span>AP: {weapon.ap}</span>
                  </>
                }
                cost={weapon.cost}
                availability={getAvailabilityDisplay(weapon.availability, weapon.legality)}
                canAfford={weapon.cost <= remaining}
                onAdd={() => addWeapon(weapon)}
              />
            ))}

          {/* Armor Tab */}
          {activeTab === "armor" &&
            filteredArmor.map((armor) => (
              <GearItemRow
                key={armor.id}
                name={armor.name}
                stats={<span>Rating: {armor.armorRating}</span>}
                cost={armor.cost}
                availability={getAvailabilityDisplay(armor.availability, armor.legality)}
                canAfford={armor.cost <= remaining}
                onAdd={() => addArmor(armor)}
              />
            ))}

          {/* Gear Tab */}
          {activeTab === "gear" &&
            filteredGear.map((gear) => {
              // Use rated row for items with hasRating (unified or legacy)
              if (gear.hasRating === true) {
                return (
                  <RatedGearItemRow
                    key={gear.id}
                    item={gear}
                    legality={gear.legality}
                    remaining={remaining}
                    onAdd={(rating) => addGear(gear, rating)}
                  />
                );
              }

              return (
                <GearItemRow
                  key={gear.id}
                  name={gear.name}
                  stats={<span>{gear.category}</span>}
                  cost={gear.cost}
                  availability={getAvailabilityDisplay(gear.availability, gear.legality)}
                  canAfford={gear.cost <= remaining}
                  onAdd={() => addGear(gear)}
                />
              );
            })}

          {/* Foci Tab */}
          {activeTab === "foci" &&
            filteredFoci.map((focus) => {
              const focusCost = focus.costMultiplier;
              return (
                <GearItemRow
                  key={focus.id}
                  name={focus.name}
                  stats={
                    <>
                      <span>Force 1</span>
                      <span>Bond: {focus.bondingKarmaMultiplier} karma</span>
                    </>
                  }
                  cost={focusCost}
                  availability={getAvailabilityDisplay(focus.availability || 0, focus.legality)}
                  canAfford={focusCost <= remaining}
                  onAdd={() => addFocus(focus)}
                />
              );
            })}

          {/* Empty states */}
          {activeTab === "weapons" && filteredWeapons.length === 0 && (
            <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No weapons found
            </div>
          )}
          {activeTab === "armor" && filteredArmor.length === 0 && (
            <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No armor found
            </div>
          )}
          {activeTab === "gear" && filteredGear.length === 0 && (
            <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No gear found
            </div>
          )}
          {activeTab === "foci" && filteredFoci.length === 0 && (
            <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {isMagical ? "No foci found" : "Foci require a magical tradition"}
            </div>
          )}
        </div>

        {/* Help text */}
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
          Max availability: {MAX_AVAILABILITY}. Convert up to {MAX_KARMA_CONVERSION} karma to nuyen.
        </p>
      </div>
    </CreationCard>
  );
}
