"use client";

/**
 * GearCard
 *
 * Compact card for gear purchasing in sheet-driven creation.
 * Handles weapons, armor, and general equipment.
 *
 * Features:
 * - Category tabs (weapons, armor, gear, foci)
 * - Search and filter
 * - Nuyen budget tracking
 * - Karma-to-nuyen conversion
 * - Shopping cart display
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
import type { CreationState, GearItem, Weapon, ArmorItem } from "@/lib/types";
import type { FocusItem } from "@/lib/types/character";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Search, X, Plus, Minus, ShoppingCart, Sword, Shield, Backpack, Gem } from "lucide-react";

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

function isItemAvailable(availability: number, forbidden?: boolean): boolean {
  return availability <= MAX_AVAILABILITY && !forbidden;
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
    ((state.selections?.cyberware as Array<{ cost: number }>) || []).reduce((s, i) => s + i.cost, 0) +
    ((state.selections?.bioware as Array<{ cost: number }>) || []).reduce((s, i) => s + i.cost, 0);
  const lifestyleSpent = (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;
  const totalSpent = weaponsSpent + armorSpent + gearSpent + fociSpent + augmentationSpent + lifestyleSpent;
  const remaining = totalNuyen - totalSpent;

  // Total item count
  const totalItems = selectedWeapons.length + selectedArmor.length + selectedGear.length + selectedFoci.length;

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
    return items.filter((w) => isItemAvailable(w.availability, w.forbidden)).slice(0, 20);
  }, [allWeapons, searchQuery]);

  const filteredArmor = useMemo(() => {
    let items = [...allArmor];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((a) => a.name.toLowerCase().includes(query));
    }
    return items.filter((a) => isItemAvailable(a.availability, a.forbidden)).slice(0, 20);
  }, [allArmor, searchQuery]);

  const filteredGear = useMemo(() => {
    let items = [...allGear];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((g) => g.name.toLowerCase().includes(query));
    }
    return items.filter((g) => isItemAvailable(g.availability, g.forbidden)).slice(0, 20);
  }, [allGear, searchQuery]);

  const filteredFoci = useMemo(() => {
    if (!fociCatalog || !isMagical) return [];
    let items = [...fociCatalog];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((f) => f.name.toLowerCase().includes(query));
    }
    return items.filter((f) => isItemAvailable(f.availability || 0, f.forbidden)).slice(0, 20);
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

  // Add gear
  const addGear = useCallback(
    (gear: GearItemData) => {
      if (gear.cost > remaining) return;

      const newGear: GearItem = {
        id: `${gear.id}-${Date.now()}`,
        name: gear.name,
        category: gear.category,
        cost: gear.cost,
        availability: gear.availability,
        quantity: 1,
        rating: gear.rating,
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

  // Add focus - calculate cost from multipliers
  const addFocus = useCallback(
    (focus: FocusCatalogItemData) => {
      // For foci, cost = force × costMultiplier, we'll use force 1 by default
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
    if (remaining < 0) return "error";
    if (totalItems > 0) return "valid";
    return "pending";
  }, [remaining, totalItems]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard title="Gear" description="Purchase equipment" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set priorities first
          </p>
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
          className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {totalItems}
        </button>
      }
    >
      <div className="space-y-4">
        {/* Budget indicator */}
        <BudgetIndicator
          label="Nuyen"
          remaining={remaining}
          total={totalNuyen}
          displayFormat="currency"
          compact
        />

        {/* Karma conversion */}
        <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/50">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            Karma → Nuyen ({KARMA_TO_NUYEN_RATE}¥ each)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleKarmaConversion(-1)}
              disabled={karmaConversion <= 0}
              className={`flex h-5 w-5 items-center justify-center rounded text-xs ${
                karmaConversion > 0
                  ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-medium">{karmaConversion}</span>
            <button
              onClick={() => handleKarmaConversion(1)}
              disabled={karmaConversion >= MAX_KARMA_CONVERSION || karmaRemaining <= 0}
              className={`flex h-5 w-5 items-center justify-center rounded text-xs ${
                karmaConversion < MAX_KARMA_CONVERSION && karmaRemaining > 0
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Plus className="h-3 w-3" />
            </button>
            <span className="ml-1 text-xs text-zinc-500">
              (+{formatCurrency(convertedNuyen)}¥)
            </span>
          </div>
        </div>

        {/* Shopping cart (collapsible) */}
        {showCart && totalItems > 0 && (
          <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Cart ({totalItems} items)
            </h4>
            <div className="max-h-32 space-y-1 overflow-y-auto text-xs">
              {selectedWeapons.map((w) => (
                <div key={w.id} className="flex items-center justify-between">
                  <span className="truncate">{w.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatCurrency(w.cost)}¥</span>
                    <button onClick={() => w.id && removeWeapon(w.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {selectedArmor.map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <span className="truncate">{a.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatCurrency(a.cost)}¥</span>
                    <button onClick={() => a.id && removeArmor(a.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {selectedGear.map((g) => (
                <div key={g.id} className="flex items-center justify-between">
                  <span className="truncate">{g.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatCurrency(g.cost)}¥</span>
                    <button onClick={() => g.id && removeGear(g.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {selectedFoci.map((f) => (
                <div key={f.id} className="flex items-center justify-between">
                  <span className="truncate">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatCurrency(f.cost)}¥</span>
                    <button onClick={() => f.id && removeFocus(f.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-2 dark:border-zinc-700">
              <div className="flex justify-between text-xs font-medium">
                <span>Total Spent:</span>
                <span>{formatCurrency(weaponsSpent + armorSpent + gearSpent + fociSpent)}¥</span>
              </div>
            </div>
          </div>
        )}

        {/* Category tabs */}
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
                className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Item list */}
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {/* Weapons Tab */}
          {activeTab === "weapons" &&
            filteredWeapons.map((weapon) => {
              const canAfford = weapon.cost <= remaining;
              return (
                <button
                  key={weapon.id}
                  onClick={() => canAfford && addWeapon(weapon)}
                  disabled={!canAfford}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                    canAfford
                      ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{weapon.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span>DMG: {weapon.damage}</span>
                      <span>AP: {weapon.ap}</span>
                      <span>Avail: {getAvailabilityDisplay(weapon.availability, weapon.restricted, weapon.forbidden)}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(weapon.cost)}¥
                  </span>
                </button>
              );
            })}

          {/* Armor Tab */}
          {activeTab === "armor" &&
            filteredArmor.map((armor) => {
              const canAfford = armor.cost <= remaining;
              return (
                <button
                  key={armor.id}
                  onClick={() => canAfford && addArmor(armor)}
                  disabled={!canAfford}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                    canAfford
                      ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{armor.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span>Rating: {armor.armorRating}</span>
                      <span>Avail: {getAvailabilityDisplay(armor.availability, armor.restricted, armor.forbidden)}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(armor.cost)}¥
                  </span>
                </button>
              );
            })}

          {/* Gear Tab */}
          {activeTab === "gear" &&
            filteredGear.map((gear) => {
              const canAfford = gear.cost <= remaining;
              return (
                <button
                  key={gear.id}
                  onClick={() => canAfford && addGear(gear)}
                  disabled={!canAfford}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                    canAfford
                      ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{gear.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span>{gear.category}</span>
                      <span>Avail: {getAvailabilityDisplay(gear.availability, gear.restricted, gear.forbidden)}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(gear.cost)}¥
                  </span>
                </button>
              );
            })}

          {/* Foci Tab */}
          {activeTab === "foci" &&
            filteredFoci.map((focus) => {
              const focusCost = focus.costMultiplier; // Force 1
              const canAfford = focusCost <= remaining;
              return (
                <button
                  key={focus.id}
                  onClick={() => canAfford && addFocus(focus)}
                  disabled={!canAfford}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                    canAfford
                      ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{focus.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span>Force 1</span>
                      <span>Bond: {focus.bondingKarmaMultiplier} karma</span>
                      <span>Avail: {getAvailabilityDisplay(focus.availability || 0, focus.restricted, focus.forbidden)}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(focusCost)}¥
                  </span>
                </button>
              );
            })}

          {/* Empty states */}
          {activeTab === "weapons" && filteredWeapons.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No weapons found
            </div>
          )}
          {activeTab === "armor" && filteredArmor.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No armor found
            </div>
          )}
          {activeTab === "gear" && filteredGear.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No gear found
            </div>
          )}
          {activeTab === "foci" && filteredFoci.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
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
