"use client";

/**
 * WeaponPurchaseModal
 *
 * Split-pane modal for browsing and purchasing weapons.
 * Left side: Category list with weapon items
 * Right side: Detail preview of selected weapon
 */

import { useState, useMemo } from "react";
import type { WeaponData } from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { X, Search, Wifi, AlertTriangle } from "lucide-react";

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
  legality?: ItemLegality
): string {
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
  onPurchase: (weapon: WeaponData) => void;
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

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full text-left p-2.5 rounded-lg border transition-all ${
        isSelected
          ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30"
          : canAfford
            ? "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
            : "border-zinc-200 bg-zinc-100 opacity-50 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm truncate">
              {weapon.name}
            </span>
            <Wifi className="h-3 w-3 text-blue-500 flex-shrink-0" />
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{weapon.damage}</span>
            <span>AP {weapon.ap}</span>
            <span>C{conceal >= 0 ? `+${conceal}` : conceal}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
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
}: WeaponPurchaseModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<WeaponCategory>("all");
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponData | null>(null);

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

  // Reset selection when modal opens
  const handleClose = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedWeapon(null);
    onClose();
  };

  const handlePurchase = () => {
    if (selectedWeapon && selectedWeapon.cost <= remaining) {
      onPurchase(selectedWeapon);
      setSelectedWeapon(null);
    }
  };

  if (!isOpen) return null;

  const conceal = selectedWeapon
    ? getBaseConcealability(selectedWeapon.subcategory || "")
    : 0;
  const canAffordSelected = selectedWeapon ? selectedWeapon.cost <= remaining : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Select Weapon
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search weapons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {WEAPON_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
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

        {/* Content - Split Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Weapon List */}
          <div className="w-1/2 border-r border-zinc-100 dark:border-zinc-800 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredWeapons.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">
                  No weapons found
                </p>
              ) : (
                filteredWeapons.map((weapon) => (
                  <WeaponListItem
                    key={weapon.id}
                    weapon={weapon}
                    isSelected={selectedWeapon?.id === weapon.id}
                    canAfford={weapon.cost <= remaining}
                    onClick={() => setSelectedWeapon(weapon)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right: Detail Preview */}
          <div className="w-1/2 overflow-y-auto p-4">
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
                      <span className={`font-medium ${
                        selectedWeapon.legality === "forbidden"
                          ? "text-red-600 dark:text-red-400"
                          : selectedWeapon.legality === "restricted"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-zinc-900 dark:text-zinc-100"
                      }`}>
                        {getAvailabilityDisplay(selectedWeapon.availability, selectedWeapon.legality)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wireless Bonus */}
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                    <Wifi className="h-4 w-4" />
                    Wireless Bonus
                  </div>
                  <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    Eject clip as a Free Action. +1 Accuracy when connected to a smartgun system.
                  </p>
                </div>

                {/* Legality Warning */}
                {(selectedWeapon.legality === "restricted" || selectedWeapon.legality === "forbidden") && (
                  <div className={`rounded-lg p-3 ${
                    selectedWeapon.legality === "forbidden"
                      ? "bg-red-50 dark:bg-red-900/20"
                      : "bg-amber-50 dark:bg-amber-900/20"
                  }`}>
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      selectedWeapon.legality === "forbidden"
                        ? "text-red-700 dark:text-red-300"
                        : "text-amber-700 dark:text-amber-300"
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                      {selectedWeapon.legality === "forbidden" ? "Forbidden" : "Restricted"}
                    </div>
                    <p className={`mt-1 text-xs ${
                      selectedWeapon.legality === "forbidden"
                        ? "text-red-600 dark:text-red-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {selectedWeapon.legality === "forbidden"
                        ? "Illegal to own. Possession triggers serious legal consequences."
                        : "Requires a license. May draw law enforcement attention."}
                    </p>
                  </div>
                )}

                {/* Purchase Button */}
                <div className="pt-2">
                  <button
                    onClick={handlePurchase}
                    disabled={!canAffordSelected}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                      canAffordSelected
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500"
                    }`}
                  >
                    {canAffordSelected
                      ? `Purchase - ${formatCurrency(selectedWeapon.cost)}¥`
                      : `Cannot Afford (${formatCurrency(selectedWeapon.cost)}¥)`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
                <p className="text-sm">Select a weapon to see details</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Budget: <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatCurrency(remaining)}¥</span> remaining
          </div>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
