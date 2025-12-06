"use client";

import { useState, useMemo } from "react";
import type { CreationState, GearItem, Lifestyle } from "@/lib/types";
import {
  useGear,
  useLifestyles,
  useLifestyleModifiers,
  type GearItemData,
  type WeaponData,
  type ArmorData,
} from "@/lib/rules/RulesetContext";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

type GearCategory =
  | "all"
  | "weapons"
  | "armor"
  | "commlinks"
  | "cyberdecks"
  | "electronics"
  | "tools"
  | "survival"
  | "medical"
  | "security"
  | "miscellaneous"
  | "ammunition";

type WeaponSubcategory =
  | "all"
  | "melee"
  | "pistols"
  | "smgs"
  | "rifles"
  | "shotguns"
  | "sniperRifles"
  | "throwingWeapons"
  | "grenades";

const MAX_AVAILABILITY = 12;
const MAX_NUYEN_CARRYOVER = 5000;
const KARMA_TO_NUYEN_RATE = 2000; // 1 Karma = 2,000 nuyen
const MAX_KARMA_CONVERSION = 10;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getAvailabilityDisplay(item: GearItemData): string {
  let display = String(item.availability);
  if (item.restricted) display += "R";
  if (item.forbidden) display += "F";
  return display;
}

function isItemAvailable(item: GearItemData): boolean {
  return item.availability <= MAX_AVAILABILITY && !item.forbidden;
}

export function GearStep({ state, updateState, budgetValues }: StepProps) {
  const gearCatalog = useGear();
  const lifestyles = useLifestyles();
  const lifestyleModifiers = useLifestyleModifiers();

  const [selectedCategory, setSelectedCategory] = useState<GearCategory>("all");
  const [weaponSubcategory, setWeaponSubcategory] = useState<WeaponSubcategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [karmaConversion, setKarmaConversion] = useState(0);

  // Get selections from state
  const selectedGear: GearItem[] = (state.selections?.gear as GearItem[]) || [];
  const selectedLifestyle: Lifestyle | null = (state.selections?.lifestyle as Lifestyle) || null;

  // Get metatype for lifestyle modifier
  const metatype = (state.selections?.metatype as string) || "human";
  const lifestyleModifier = lifestyleModifiers[metatype] || 1;

  // Calculate budget
  const baseNuyen = budgetValues["nuyen"] || 0;
  const karmaAvailable = budgetValues["karma"] || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate spent
  const gearSpent = selectedGear.reduce((sum, item) => sum + item.cost * item.quantity, 0);
  const lifestyleCost = selectedLifestyle
    ? Math.floor(selectedLifestyle.monthlyCost * lifestyleModifier)
    : 0;
  const totalSpent = gearSpent + lifestyleCost;
  const remaining = totalNuyen - totalSpent;

  // Helper to add gear item
  const addGearItem = (item: GearItemData) => {
    const existingIndex = selectedGear.findIndex((g) => g.name === item.name);
    let updatedGear: GearItem[];

    if (existingIndex >= 0) {
      updatedGear = selectedGear.map((g, i) =>
        i === existingIndex ? { ...g, quantity: g.quantity + 1 } : g
      );
    } else {
      const newItem: GearItem = {
        name: item.name,
        category: item.category,
        quantity: 1,
        cost: item.cost,
        availability: item.availability,
        rating: item.rating,
      };
      updatedGear = [...selectedGear, newItem];
    }

    updateState({
      selections: {
        ...state.selections,
        gear: updatedGear,
      },
    });
  };

  // Helper to remove gear item
  const removeGearItem = (index: number) => {
    const item = selectedGear[index];
    let updatedGear: GearItem[];

    if (item.quantity > 1) {
      updatedGear = selectedGear.map((g, i) =>
        i === index ? { ...g, quantity: g.quantity - 1 } : g
      );
    } else {
      updatedGear = selectedGear.filter((_, i) => i !== index);
    }

    updateState({
      selections: {
        ...state.selections,
        gear: updatedGear,
      },
    });
  };

  // Helper to select lifestyle
  const selectLifestyle = (lifestyle: typeof lifestyles[0] | null) => {
    const newLifestyle: Lifestyle | null = lifestyle
      ? {
          type: lifestyle.name,
          monthlyCost: lifestyle.monthlyCost,
          prepaidMonths: 1,
        }
      : null;

    updateState({
      selections: {
        ...state.selections,
        lifestyle: newLifestyle,
      },
    });
  };

  // Handle karma conversion
  const handleKarmaConversion = (value: number) => {
    const clampedValue = Math.max(0, Math.min(value, Math.min(MAX_KARMA_CONVERSION, karmaAvailable)));
    setKarmaConversion(clampedValue);
  };

  // Flatten gear catalog for searching
  const allGearItems = useMemo(() => {
    if (!gearCatalog) return [];

    const items: (GearItemData | WeaponData | ArmorData)[] = [];

    // Add weapons
    if (gearCatalog.weapons) {
      Object.entries(gearCatalog.weapons).forEach(([subcategory, weapons]) => {
        (weapons as WeaponData[]).forEach((weapon) => {
          items.push({ ...weapon, category: "weapons", subcategory });
        });
      });
    }

    // Add armor
    if (gearCatalog.armor) {
      gearCatalog.armor.forEach((item) => {
        items.push({ ...item, category: "armor" });
      });
    }

    // Add commlinks
    if (gearCatalog.commlinks) {
      gearCatalog.commlinks.forEach((item) => {
        items.push({ ...item, category: "commlinks" });
      });
    }

    // Add cyberdecks
    if (gearCatalog.cyberdecks) {
      gearCatalog.cyberdecks.forEach((item) => {
        items.push({ ...item, category: "cyberdecks" });
      });
    }

    // Add electronics
    if (gearCatalog.electronics) {
      gearCatalog.electronics.forEach((item) => {
        items.push({ ...item, category: "electronics" });
      });
    }

    // Add tools
    if (gearCatalog.tools) {
      gearCatalog.tools.forEach((item) => {
        items.push({ ...item, category: "tools" });
      });
    }

    // Add survival
    if (gearCatalog.survival) {
      gearCatalog.survival.forEach((item) => {
        items.push({ ...item, category: "survival" });
      });
    }

    // Add medical
    if (gearCatalog.medical) {
      gearCatalog.medical.forEach((item) => {
        items.push({ ...item, category: "medical" });
      });
    }

    // Add security
    if (gearCatalog.security) {
      gearCatalog.security.forEach((item) => {
        items.push({ ...item, category: "security" });
      });
    }

    // Add miscellaneous
    if (gearCatalog.miscellaneous) {
      gearCatalog.miscellaneous.forEach((item) => {
        items.push({ ...item, category: "miscellaneous" });
      });
    }

    // Add ammunition
    if (gearCatalog.ammunition) {
      gearCatalog.ammunition.forEach((item) => {
        items.push({ ...item, category: "ammunition" });
      });
    }

    return items;
  }, [gearCatalog]);

  // Filter gear items
  const filteredGearItems = useMemo(() => {
    let items = allGearItems;

    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Filter weapons by subcategory
    if (selectedCategory === "weapons" && weaponSubcategory !== "all") {
      items = items.filter((item) => item.subcategory === weaponSubcategory);
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

    // Filter by availability
    if (!showUnavailable) {
      items = items.filter(isItemAvailable);
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [allGearItems, selectedCategory, weaponSubcategory, searchQuery, showUnavailable]);

  if (!gearCatalog) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-amber-800 dark:text-amber-200">Loading gear catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Base Nuyen</p>
            <p className="text-lg font-semibold">¥{formatCurrency(baseNuyen)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Converted</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              +¥{formatCurrency(convertedNuyen)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Spent</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              ¥{formatCurrency(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Remaining</p>
            <p
              className={`text-lg font-semibold ${
                remaining < 0
                  ? "text-red-600 dark:text-red-400"
                  : remaining > MAX_NUYEN_CARRYOVER
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              ¥{formatCurrency(remaining)}
            </p>
          </div>
        </div>
        {remaining > MAX_NUYEN_CARRYOVER && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            Warning: Maximum ¥{formatCurrency(MAX_NUYEN_CARRYOVER)} can be carried over after
            creation.
          </p>
        )}
      </div>

      {/* Karma to Nuyen Conversion */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-2 text-sm font-medium">Karma to Nuyen Conversion</h3>
        <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
          Convert up to {MAX_KARMA_CONVERSION} Karma to Nuyen at {formatCurrency(KARMA_TO_NUYEN_RATE)}{" "}
          nuyen per Karma. Available Karma: {karmaAvailable}
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max={Math.min(MAX_KARMA_CONVERSION, karmaAvailable)}
            value={karmaConversion}
            onChange={(e) => handleKarmaConversion(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="w-20 text-sm">
            {karmaConversion} Karma = ¥{formatCurrency(convertedNuyen)}
          </span>
        </div>
      </div>

      {/* Lifestyle Selection */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <h3 className="mb-3 text-sm font-medium">
          Lifestyle{" "}
          <span className="text-xs font-normal text-zinc-500">(Required - 1 month prepaid)</span>
        </h3>
        {lifestyleModifier !== 1 && (
          <p className="mb-2 text-xs text-amber-600 dark:text-amber-400">
            {metatype.charAt(0).toUpperCase() + metatype.slice(1)} modifier: ×{lifestyleModifier}
          </p>
        )}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {lifestyles.map((lifestyle) => {
            const adjustedCost = Math.floor(lifestyle.monthlyCost * lifestyleModifier);
            const isSelected = selectedLifestyle?.type === lifestyle.name;
            const canAfford = adjustedCost <= remaining + (selectedLifestyle?.monthlyCost || 0) * lifestyleModifier;

            return (
              <button
                key={lifestyle.id}
                onClick={() => selectLifestyle(isSelected ? null : lifestyle)}
                disabled={!canAfford && !isSelected}
                className={`rounded-lg border p-2 text-left transition-colors ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/20"
                    : canAfford
                    ? "border-zinc-200 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
                    : "cursor-not-allowed border-zinc-200 opacity-50 dark:border-zinc-700"
                }`}
              >
                <p className="text-xs font-medium">{lifestyle.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  ¥{formatCurrency(adjustedCost)}
                </p>
              </button>
            );
          })}
        </div>
        {selectedLifestyle && (
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Selected: {selectedLifestyle.type} (¥{formatCurrency(lifestyleCost)}/month)
          </p>
        )}
      </div>

      {/* Gear Catalog */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column: Catalog */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-48 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showUnavailable}
                onChange={(e) => setShowUnavailable(e.target.checked)}
                className="rounded"
              />
              Show unavailable
            </label>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-700">
            {[
              { id: "all", label: "All" },
              { id: "weapons", label: "Weapons" },
              { id: "armor", label: "Armor" },
              { id: "commlinks", label: "Commlinks" },
              { id: "cyberdecks", label: "Cyberdecks" },
              { id: "electronics", label: "Electronics" },
              { id: "tools", label: "Tools" },
              { id: "survival", label: "Survival" },
              { id: "medical", label: "Medical" },
              { id: "miscellaneous", label: "Misc" },
              { id: "ammunition", label: "Ammo" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as GearCategory);
                  if (cat.id !== "weapons") setWeaponSubcategory("all");
                }}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Weapon Subcategory Tabs */}
          {selectedCategory === "weapons" && (
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "All" },
                { id: "melee", label: "Melee" },
                { id: "pistols", label: "Pistols" },
                { id: "smgs", label: "SMGs" },
                { id: "rifles", label: "Rifles" },
                { id: "shotguns", label: "Shotguns" },
                { id: "sniperRifles", label: "Sniper" },
                { id: "throwingWeapons", label: "Throwing" },
                { id: "grenades", label: "Grenades" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setWeaponSubcategory(sub.id as WeaponSubcategory)}
                  className={`rounded-full px-2 py-1 text-xs transition-colors ${
                    weaponSubcategory === sub.id
                      ? "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-100"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {/* Item List */}
          <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-center">Avail</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {filteredGearItems.map((item, index) => {
                  const available = isItemAvailable(item);
                  const canAfford = item.cost <= remaining;

                  return (
                    <tr
                      key={`${item.id}-${index}`}
                      className={`${!available ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                    >
                      <td className="px-3 py-2">
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                            {item.description}
                          </p>
                        )}
                        {(item as WeaponData).damage && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            DMG: {(item as WeaponData).damage} | AP: {(item as WeaponData).ap}
                          </p>
                        )}
                        {(item as ArmorData).armorRating && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Armor: {(item as ArmorData).armorRating}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">¥{formatCurrency(item.cost)}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`${
                            item.restricted
                              ? "text-amber-600 dark:text-amber-400"
                              : item.forbidden
                              ? "text-red-600 dark:text-red-400"
                              : ""
                          }`}
                        >
                          {getAvailabilityDisplay(item)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => addGearItem(item)}
                          disabled={!available || !canAfford}
                          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                            available && canAfford
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                          }`}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredGearItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-zinc-500">
                      No items found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Shopping Cart */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-3 text-sm font-medium">Shopping Cart</h3>

            {selectedGear.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No items added yet.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {selectedGear.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 dark:bg-zinc-700/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        ¥{formatCurrency(item.cost)} × {item.quantity} = ¥
                        {formatCurrency(item.cost * item.quantity)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeGearItem(index)}
                      className="ml-2 rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label="Remove item"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Cart Totals */}
            <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-600">
              <div className="flex justify-between text-sm">
                <span>Gear Total:</span>
                <span>¥{formatCurrency(gearSpent)}</span>
              </div>
              {selectedLifestyle && (
                <div className="flex justify-between text-sm">
                  <span>Lifestyle:</span>
                  <span>¥{formatCurrency(lifestyleCost)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between text-sm font-semibold">
                <span>Grand Total:</span>
                <span>¥{formatCurrency(totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Maximum availability at creation: {MAX_AVAILABILITY}. Restricted (R) items require a
        license. Forbidden (F) items are not available at creation.
      </p>
    </div>
  );
}
