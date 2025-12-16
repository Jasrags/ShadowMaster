"use client";

import { useState, useMemo } from "react";
import type { Weapon, ArmorItem, InstalledWeaponMod, InstalledArmorMod, WeaponMount } from "@/lib/types";
import {
  useWeaponModifications,
  useArmorModifications,
  type WeaponModificationCatalogItemData,
  type ArmorModificationCatalogItemData,
} from "@/lib/rules/RulesetContext";

const MAX_AVAILABILITY = 12;

interface ModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Weapon | ArmorItem;
  itemType: "weapon" | "armor";
  remainingNuyen: number;
  onInstallWeaponMod?: (mod: InstalledWeaponMod) => void;
  onInstallArmorMod?: (mod: InstalledArmorMod) => void;
}

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

// Calculate weapon mod cost - moved outside component for stable reference
function calculateWeaponModCost(
  mod: WeaponModificationCatalogItemData,
  weapon: Weapon,
  rating: number
): number {
  if (mod.costMultiplier) {
    return weapon.cost * mod.costMultiplier;
  }
  if (mod.costPerRating && mod.cost) {
    return mod.cost * rating;
  }
  return mod.cost || 0;
}

// Calculate armor mod cost - moved outside component for stable reference
function calculateArmorModCost(
  mod: ArmorModificationCatalogItemData,
  rating: number
): number {
  if (mod.costPerRating) {
    return mod.cost * rating;
  }
  return mod.cost;
}

export function ModificationModal({
  isOpen,
  onClose,
  item,
  itemType,
  remainingNuyen,
  onInstallWeaponMod,
  onInstallArmorMod,
}: ModificationModalProps) {
  const weaponMods = useWeaponModifications({
    maxAvailability: MAX_AVAILABILITY,
    excludeForbidden: true,
  });
  const armorMods = useArmorModifications({
    maxAvailability: MAX_AVAILABILITY,
    excludeForbidden: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMountFilter, setSelectedMountFilter] = useState<WeaponMount | "all">("all");
  const [selectedRating, setSelectedRating] = useState<number>(1);

  // Get occupied mounts for weapon
  const occupiedMounts = useMemo(() => {
    if (itemType !== "weapon") return [];
    const weapon = item as Weapon;
    return weapon.occupiedMounts || [];
  }, [item, itemType]);

  // Get used capacity for armor
  const armorCapacityInfo = useMemo(() => {
    if (itemType !== "armor") return { total: 0, used: 0 };
    const armor = item as ArmorItem;
    return {
      total: armor.capacity || armor.armorRating,
      used: armor.capacityUsed || 0,
    };
  }, [item, itemType]);

  // Filter weapon modifications
  const filteredWeaponMods = useMemo(() => {
    if (itemType !== "weapon") return [];

    let mods = weaponMods;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      mods = mods.filter(
        (mod) =>
          mod.name.toLowerCase().includes(query) ||
          mod.description?.toLowerCase().includes(query)
      );
    }

    // Filter by mount type
    if (selectedMountFilter !== "all") {
      mods = mods.filter(
        (mod) => mod.mount === selectedMountFilter || !mod.mount
      );
    }

    // Filter out mods for occupied mounts
    mods = mods.filter((mod) => {
      if (!mod.mount) return true;
      return !occupiedMounts.includes(mod.mount as WeaponMount);
    });

    // Filter by cost
    mods = mods.filter((mod) => {
      const cost = calculateWeaponModCost(mod, item as Weapon, selectedRating);
      return cost <= remainingNuyen;
    });

    return mods;
  }, [weaponMods, searchQuery, selectedMountFilter, occupiedMounts, remainingNuyen, item, itemType, selectedRating]);

  // Filter armor modifications
  const filteredArmorMods = useMemo(() => {
    if (itemType !== "armor") return [];

    let mods = armorMods;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      mods = mods.filter(
        (mod) =>
          mod.name.toLowerCase().includes(query) ||
          mod.description?.toLowerCase().includes(query)
      );
    }

    // Filter by available capacity
    const availableCapacity = armorCapacityInfo.total - armorCapacityInfo.used;
    mods = mods.filter((mod) => {
      const capacityNeeded = mod.capacityPerRating
        ? mod.capacityCost * selectedRating
        : mod.capacityCost;
      return capacityNeeded <= availableCapacity;
    });

    // Filter by cost
    mods = mods.filter((mod) => {
      const cost = calculateArmorModCost(mod, selectedRating);
      return cost <= remainingNuyen;
    });

    return mods;
  }, [armorMods, searchQuery, armorCapacityInfo, remainingNuyen, itemType, selectedRating]);


  // Calculate armor mod capacity
  function calculateArmorModCapacity(
    mod: ArmorModificationCatalogItemData,
    rating: number
  ): number {
    if (mod.noCapacityCost) return 0;
    if (mod.capacityPerRating) {
      return mod.capacityCost * rating;
    }
    return mod.capacityCost;
  }

  // Handle installing weapon mod
  const handleInstallWeaponMod = (mod: WeaponModificationCatalogItemData) => {
    if (!onInstallWeaponMod) return;

    const weapon = item as Weapon;
    const cost = calculateWeaponModCost(mod, weapon, selectedRating);
    const rating = mod.hasRating ? selectedRating : undefined;

    const installedMod: InstalledWeaponMod = {
      catalogId: mod.id,
      name: mod.hasRating ? `${mod.name} (R${selectedRating})` : mod.name,
      mount: mod.mount as WeaponMount | undefined,
      rating,
      cost,
      availability: mod.availability * (rating || 1),
      restricted: mod.restricted,
      forbidden: mod.forbidden,
    };

    onInstallWeaponMod(installedMod);
    onClose();
  };

  // Handle installing armor mod
  const handleInstallArmorMod = (mod: ArmorModificationCatalogItemData) => {
    if (!onInstallArmorMod) return;

    const cost = calculateArmorModCost(mod, selectedRating);
    const capacityUsed = calculateArmorModCapacity(mod, selectedRating);
    const rating = mod.hasRating ? selectedRating : undefined;

    const installedMod: InstalledArmorMod = {
      catalogId: mod.id,
      name: mod.hasRating ? `${mod.name} (R${selectedRating})` : mod.name,
      rating,
      capacityUsed,
      cost,
      availability: mod.availability * (rating || 1),
      restricted: mod.restricted,
      forbidden: mod.forbidden,
    };

    onInstallArmorMod(installedMod);
    onClose();
  };

  if (!isOpen) return null;

  const mountTypes: (WeaponMount | "all")[] = ["all", "top", "under", "side", "barrel", "stock", "internal"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-800">
        {/* Header */}
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {itemType === "weapon" ? "Weapon Modifications" : "Armor Modifications"}
            </h2>
            <button
              onClick={onClose}
              className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Item info */}
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium">{item.name}</span>
            {itemType === "armor" && (
              <span className="ml-2">
                (Capacity: {armorCapacityInfo.used}/{armorCapacityInfo.total})
              </span>
            )}
            {itemType === "weapon" && occupiedMounts.length > 0 && (
              <span className="ml-2">
                (Occupied: {occupiedMounts.join(", ")})
              </span>
            )}
          </div>

          {/* Budget */}
          <div className="mt-1 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Budget: </span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              ¥{formatCurrency(remainingNuyen)}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-700">
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search modifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-600 dark:bg-zinc-700"
              />
            </div>

            {/* Mount filter (weapon only) */}
            {itemType === "weapon" && (
              <select
                value={selectedMountFilter}
                onChange={(e) => setSelectedMountFilter(e.target.value as WeaponMount | "all")}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-600 dark:bg-zinc-700"
              >
                {mountTypes.map((mount) => (
                  <option key={mount} value={mount} disabled={mount !== "all" && occupiedMounts.includes(mount as WeaponMount)}>
                    {mount === "all" ? "All Mounts" : `${mount.charAt(0).toUpperCase() + mount.slice(1)} Mount`}
                    {mount !== "all" && occupiedMounts.includes(mount as WeaponMount) && " (Occupied)"}
                  </option>
                ))}
              </select>
            )}

            {/* Rating selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Rating:</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-600 dark:bg-zinc-700"
              >
                {[1, 2, 3, 4, 5, 6].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modifications list */}
        <div className="max-h-[400px] overflow-y-auto p-4">
          {itemType === "weapon" ? (
            filteredWeaponMods.length === 0 ? (
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                No compatible modifications available.
              </p>
            ) : (
              <div className="space-y-2">
                {filteredWeaponMods.map((mod) => {
                  const cost = calculateWeaponModCost(mod, item as Weapon, selectedRating);
                  const effectiveRating = mod.hasRating ? selectedRating : undefined;

                  return (
                    <div
                      key={mod.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                            {mod.name}
                            {mod.hasRating && ` (R${selectedRating})`}
                          </span>
                          {mod.mount && (
                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                              {mod.mount.toUpperCase()}
                            </span>
                          )}
                          {mod.restricted && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                              R
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {mod.description}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>Avail: {getAvailabilityDisplay(mod.availability * (effectiveRating || 1), mod.restricted, mod.forbidden)}</span>
                          {mod.recoilCompensation && <span>RC: +{mod.recoilCompensation}</span>}
                          {mod.accuracyModifier && <span>Acc: +{mod.accuracyModifier}</span>}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          ¥{formatCurrency(cost)}
                        </span>
                        <button
                          onClick={() => handleInstallWeaponMod(mod)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                          Install
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            filteredArmorMods.length === 0 ? (
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                No compatible modifications available.
              </p>
            ) : (
              <div className="space-y-2">
                {filteredArmorMods.map((mod) => {
                  const cost = calculateArmorModCost(mod, selectedRating);
                  const capacity = calculateArmorModCapacity(mod, selectedRating);
                  const effectiveRating = mod.hasRating ? selectedRating : undefined;

                  return (
                    <div
                      key={mod.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                            {mod.name}
                            {mod.hasRating && ` (R${selectedRating})`}
                          </span>
                          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                            {capacity} Cap
                          </span>
                          {mod.restricted && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                              R
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {mod.description}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>Avail: {getAvailabilityDisplay(mod.availability * (effectiveRating || 1), mod.restricted, mod.forbidden)}</span>
                          {mod.armorBonus && <span>Armor: +{mod.armorBonus}</span>}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          ¥{formatCurrency(cost)}
                        </span>
                        <button
                          onClick={() => handleInstallArmorMod(mod)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                          Install
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
