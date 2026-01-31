"use client";

/**
 * WeaponPurchaseModal
 *
 * Split-pane modal for browsing and purchasing weapons.
 * Left side: Category list with weapon items
 * Right side: Detail preview of selected weapon
 *
 * Supports initialCategory prop to pre-filter by weapon category
 * when opened from a specific category section.
 */

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { WeaponData, WeaponModificationCatalogItemData } from "@/lib/rules/RulesetContext";
import { useWeaponModifications } from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { BulkQuantitySelector } from "@/components/creation/shared/BulkQuantitySelector";
import { Search, Wifi, AlertTriangle, Wrench, Crosshair } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

const WEAPON_CATEGORIES = [
  { id: "all", label: "All Weapons" },
  { id: "melee", label: "Melee" },
  { id: "pistols", label: "Pistols" },
  { id: "smgs", label: "SMGs" },
  { id: "rifles", label: "Rifles" },
  { id: "shotguns", label: "Shotguns" },
  { id: "sniperRifles", label: "Sniper Rifles" },
  { id: "throwingWeapons", label: "Throwing" },
  { id: "grenades", label: "Grenades" },
] as const;

type WeaponCategory = (typeof WEAPON_CATEGORIES)[number]["id"];

// Map from WeaponsPanel category keys to modal categories
type WeaponPanelCategoryKey = "ranged" | "melee" | "throwing";

const PANEL_CATEGORY_TO_MODAL: Record<WeaponPanelCategoryKey, WeaponCategory> = {
  ranged: "pistols", // Default to pistols for ranged
  melee: "melee",
  throwing: "throwingWeapons",
};

// Categories that belong to each panel category
const PANEL_CATEGORY_GROUPS: Record<WeaponPanelCategoryKey, WeaponCategory[]> = {
  ranged: ["pistols", "smgs", "rifles", "shotguns", "sniperRifles"],
  melee: ["melee"],
  throwing: ["throwingWeapons", "grenades"],
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

function getAvailabilityDisplay(availability: number, legality?: ItemLegality): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

function formatModes(modes: string[] | undefined): string {
  if (!modes || modes.length === 0) return "-";
  return modes.join("/");
}

function getBaseConcealability(subcategory: string): number {
  const baseConceal: Record<string, number> = {
    holdout: 4,
    "light-pistol": 2,
    "heavy-pistol": 0,
    "machine-pistol": 0,
    taser: 2,
    smg: -2,
    "assault-rifle": -6,
    rifle: -6,
    shotgun: -4,
    "sniper-rifle": -6,
    "light-machine-gun": -6,
    "medium-machine-gun": -6,
    "heavy-machine-gun": -6,
    "assault-cannon": -6,
    "grenade-launcher": -4,
    "missile-launcher": -6,
    blade: -2,
    club: -2,
    "exotic-melee": -2,
    unarmed: 4,
  };
  return baseConceal[subcategory.toLowerCase()] ?? -2;
}

// =============================================================================
// TYPES
// =============================================================================

interface WeaponPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  weapons: {
    melee: WeaponData[];
    pistols: WeaponData[];
    smgs: WeaponData[];
    rifles: WeaponData[];
    shotguns: WeaponData[];
    sniperRifles: WeaponData[];
    throwingWeapons: WeaponData[];
    grenades: WeaponData[];
  };
  remaining: number;
  onPurchase: (weapon: WeaponData, quantity?: number) => void;
  /** Optional initial category from WeaponsPanel (ranged, melee, throwing) */
  initialCategory?: WeaponPanelCategoryKey | null;
}

// =============================================================================
// WEAPON LIST ITEM
// =============================================================================

function WeaponListItem({
  weapon,
  isSelected,
  canAfford,
  onClick,
}: {
  weapon: WeaponData;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
}) {
  const conceal = getBaseConcealability(weapon.subcategory || "");
  const hasBuiltInMods = weapon.builtInModifications && weapon.builtInModifications.length > 0;

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full text-left p-2.5 rounded-lg border transition-all ${
        isSelected
          ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
          : canAfford
            ? "border-zinc-200 bg-white hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-500/50"
            : "border-zinc-200 bg-zinc-100 opacity-50 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm truncate">
              {weapon.name}
            </span>
            {weapon.wirelessBonus && <Wifi className="h-3 w-3 text-blue-500 flex-shrink-0" />}
            {hasBuiltInMods && (
              <span
                className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex-shrink-0"
                title="Has built-in modifications"
              >
                <Wrench className="h-3 w-3" />
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{weapon.damage}</span>
            <span>AP {weapon.ap}</span>
            <span>C{conceal >= 0 ? `+${conceal}` : conceal}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(weapon.cost)}¥
          </div>
          <div className="text-xs text-zinc-500">
            {getAvailabilityDisplay(weapon.availability, weapon.legality)}
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WeaponPurchaseModal({
  isOpen,
  onClose,
  weapons,
  remaining,
  onPurchase,
  initialCategory,
}: WeaponPurchaseModalProps) {
  const weaponModsCatalog = useWeaponModifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<WeaponCategory>("all");
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponData | null>(null);
  const [selectedPacks, setSelectedPacks] = useState(1);
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Helper to look up modification names from built-in mod IDs
  const getBuiltInModDetails = useMemo(() => {
    const modMap = new Map<string, WeaponModificationCatalogItemData>();
    for (const mod of weaponModsCatalog) {
      modMap.set(mod.id, mod);
    }
    return (builtInMods: NonNullable<WeaponData["builtInModifications"]>) => {
      return builtInMods.map((builtIn) => {
        const catalogMod = modMap.get(builtIn.modificationId);
        return {
          id: builtIn.modificationId,
          name: catalogMod?.name || builtIn.modificationId,
          mount: builtIn.mount,
          rating: builtIn.rating,
        };
      });
    };
  }, [weaponModsCatalog]);

  // Set initial category when modal opens with a category specified
  useEffect(() => {
    if (isOpen && initialCategory) {
      setSelectedCategory(PANEL_CATEGORY_TO_MODAL[initialCategory]);
    } else if (!isOpen) {
      // Reset to "all" when closing
      setSelectedCategory("all");
    }
  }, [isOpen, initialCategory]);

  // Reset selectedPacks when weapon changes
  useEffect(() => {
    setSelectedPacks(1);
  }, [selectedWeapon?.id]);

  // Stackable/consumable item calculations
  const isStackable = selectedWeapon?.stackable === true;
  const unitLabel = selectedWeapon?.subcategory === "grenades" ? "grenades" : "items";
  const totalCost = isStackable ? selectedWeapon.cost * selectedPacks : (selectedWeapon?.cost ?? 0);

  // Flatten all weapons into a single array with category info
  const allWeapons = useMemo(() => {
    return [
      ...weapons.melee.map((w) => ({ ...w, categoryGroup: "melee" })),
      ...weapons.pistols.map((w) => ({ ...w, categoryGroup: "pistols" })),
      ...weapons.smgs.map((w) => ({ ...w, categoryGroup: "smgs" })),
      ...weapons.rifles.map((w) => ({ ...w, categoryGroup: "rifles" })),
      ...weapons.shotguns.map((w) => ({ ...w, categoryGroup: "shotguns" })),
      ...weapons.sniperRifles.map((w) => ({ ...w, categoryGroup: "sniperRifles" })),
      ...weapons.throwingWeapons.map((w) => ({ ...w, categoryGroup: "throwingWeapons" })),
      ...weapons.grenades.map((w) => ({ ...w, categoryGroup: "grenades" })),
    ];
  }, [weapons]);

  // Filter weapons by category and search
  const filteredWeapons = useMemo(() => {
    let items = allWeapons;

    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter((w) => w.categoryGroup === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((w) => w.name.toLowerCase().includes(query));
    }

    // Filter by availability
    items = items.filter((w) => w.availability <= MAX_AVAILABILITY);

    return items;
  }, [allWeapons, selectedCategory, searchQuery]);

  // Virtualization setup for weapon list
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredWeapons.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 68, // Approximate height of WeaponListItem
    overscan: 5,
  });

  // Full reset on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedWeapon(null);
    setSelectedPacks(1);
    setAddedThisSession(0);
  }, []);

  // Partial reset after adding (preserves search/filters)
  const resetForNextWeapon = useCallback(() => {
    setSelectedWeapon(null);
    setSelectedPacks(1);
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handlePurchase = useCallback(() => {
    if (selectedWeapon && totalCost <= remaining) {
      const quantity = isStackable ? selectedPacks : 1;
      onPurchase(selectedWeapon, quantity);
      setAddedThisSession((prev) => prev + 1);
      resetForNextWeapon();
    }
  }, [
    selectedWeapon,
    totalCost,
    remaining,
    isStackable,
    selectedPacks,
    onPurchase,
    resetForNextWeapon,
  ]);

  const conceal = selectedWeapon ? getBaseConcealability(selectedWeapon.subcategory || "") : 0;
  const canAffordSelected = selectedWeapon ? totalCost <= remaining : false;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Select Weapon" onClose={close} />

          {/* Search & Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search weapons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Category Pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              {WEAPON_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-amber-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane: Weapon List - Virtualized */}
              <div
                ref={scrollContainerRef}
                className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700"
              >
                {filteredWeapons.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-8">No weapons found</p>
                ) : (
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const weapon = filteredWeapons[virtualRow.index];
                      return (
                        <div
                          key={weapon.id}
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
                          <WeaponListItem
                            weapon={weapon}
                            isSelected={selectedWeapon?.id === weapon.id}
                            canAfford={weapon.cost <= remaining}
                            onClick={() => setSelectedWeapon(weapon)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Pane: Detail Preview */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedWeapon ? (
                  <div className="space-y-4">
                    {/* Weapon Name */}
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedWeapon.name}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
                        {selectedWeapon.subcategory?.replace("-", " ") || selectedWeapon.category}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="text-zinc-500 dark:text-zinc-400">Damage</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedWeapon.damage}
                          </span>
                        </div>
                        <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="text-zinc-500 dark:text-zinc-400">AP</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedWeapon.ap}
                          </span>
                        </div>
                        <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="text-zinc-500 dark:text-zinc-400">Accuracy</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedWeapon.accuracy || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="text-zinc-500 dark:text-zinc-400">Mode</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {formatModes(selectedWeapon.mode)}
                          </span>
                        </div>
                        <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="text-zinc-500 dark:text-zinc-400">RC</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedWeapon.rc || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="text-zinc-500 dark:text-zinc-400">Ammo</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedWeapon.ammo || "-"}
                          </span>
                        </div>
                        {selectedWeapon.reach !== undefined && (
                          <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                            <span className="text-zinc-500 dark:text-zinc-400">Reach</span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              {selectedWeapon.reach}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Physical Stats */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Physical
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="text-zinc-500 dark:text-zinc-400">Conceal</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {conceal >= 0 ? `+${conceal}` : conceal}
                          </span>
                        </div>
                        <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                          <span
                            className={`font-medium ${
                              selectedWeapon.legality === "forbidden"
                                ? "text-red-600 dark:text-red-400"
                                : selectedWeapon.legality === "restricted"
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-zinc-900 dark:text-zinc-100"
                            }`}
                          >
                            {getAvailabilityDisplay(
                              selectedWeapon.availability,
                              selectedWeapon.legality
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Built-in Modifications - only show if weapon has any */}
                    {selectedWeapon.builtInModifications &&
                      selectedWeapon.builtInModifications.length > 0 && (
                        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                            <Wrench className="h-4 w-4" />
                            Built-in Modifications
                          </div>
                          <p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                            Included at no extra cost
                          </p>
                          <ul className="mt-2 space-y-1">
                            {getBuiltInModDetails(selectedWeapon.builtInModifications).map(
                              (mod) => (
                                <li
                                  key={mod.id}
                                  className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1"
                                >
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                  {mod.name}
                                  {mod.rating && ` (Rating ${mod.rating})`}
                                  {mod.mount && (
                                    <span className="text-emerald-500 dark:text-emerald-500 text-[10px]">
                                      [{mod.mount}]
                                    </span>
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Wireless Bonus - only show if weapon has one */}
                    {selectedWeapon.wirelessBonus && (
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                          <Wifi className="h-4 w-4" />
                          Wireless Bonus
                        </div>
                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                          {selectedWeapon.wirelessBonus}
                        </p>
                      </div>
                    )}

                    {/* Legality Warning */}
                    {(selectedWeapon.legality === "restricted" ||
                      selectedWeapon.legality === "forbidden") && (
                      <div
                        className={`rounded-lg p-3 ${
                          selectedWeapon.legality === "forbidden"
                            ? "bg-red-50 dark:bg-red-900/20"
                            : "bg-amber-50 dark:bg-amber-900/20"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 text-sm font-medium ${
                            selectedWeapon.legality === "forbidden"
                              ? "text-red-700 dark:text-red-300"
                              : "text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          {selectedWeapon.legality === "forbidden" ? "Forbidden" : "Restricted"}
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            selectedWeapon.legality === "forbidden"
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {selectedWeapon.legality === "forbidden"
                            ? "Illegal to own. Possession triggers serious legal consequences."
                            : "Requires a license. May draw law enforcement attention."}
                        </p>
                      </div>
                    )}

                    {/* Quantity Selector for stackable items */}
                    {isStackable && (
                      <BulkQuantitySelector
                        packSize={1}
                        unitLabel={unitLabel}
                        pricePerPack={selectedWeapon.cost}
                        remaining={remaining}
                        selectedPacks={selectedPacks}
                        onPacksChange={setSelectedPacks}
                        packLabel="unit"
                      />
                    )}

                    {/* Cost Indicator */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Cost
                        </span>
                        <span
                          className={`font-semibold ${
                            canAffordSelected
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(totalCost)}¥
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    <Crosshair className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select a weapon from the list</p>
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
                disabled={!selectedWeapon || !canAffordSelected}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedWeapon && canAffordSelected
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add Weapon
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
