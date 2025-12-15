"use client";

import { useState, useMemo } from "react";
import type { CreationState, GearItem } from "@/lib/types";
import type { FocusItem } from "@/lib/types/character";
import type { FocusType } from "@/lib/types/edition";
import {
  useGear,
  useFoci,
  type GearItemData,
  type WeaponData,
  type ArmorData,
  type FocusCatalogItemData,
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
  | "ammunition"
  | "foci";

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
  const fociCatalog = useFoci();

  const [selectedCategory, setSelectedCategory] = useState<GearCategory>("all");
  const [weaponSubcategory, setWeaponSubcategory] = useState<WeaponSubcategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailable, setShowUnavailable] = useState(false);

  // Get selections from state
  const selectedGear: GearItem[] = (state.selections?.gear as GearItem[]) || [];
  const selectedFoci: FocusItem[] = (state.selections?.foci as FocusItem[]) || [];
  
  // Check if character is magical
  const magicPath = (state.selections?.["magical-path"] as string) || "mundane";
  const isMagical = ["magician", "mystic-adept", "aspected-mage"].includes(magicPath);

  // Karma-to-nuyen conversion is tracked globally in CreationState budgets
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;

  const karmaAvailableForConversion = useMemo(() => {
    const karmaBase = budgetValues["karma"] || 0;
    const karmaGainedNegative = (state.budgets?.["karma-gained-negative"] as number) || 0;

    // Total spent excluding the conversion itself (so we can clamp correctly)
    const karmaSpentPositive = (state.budgets?.["karma-spent-positive"] as number) || 0;
    const karmaSpentSpells = (state.budgets?.["karma-spent-spells"] as number) || 0;
    const karmaSpentComplexForms = (state.budgets?.["karma-spent-complex-forms"] as number) || 0;
    const karmaSpentPowerPoints = (state.budgets?.["karma-spent-power-points"] as number) || 0;
    const karmaSpentFociBonding = (state.budgets?.["karma-spent-foci-bonding"] as number) || 0;

    const available =
      karmaBase +
      karmaGainedNegative -
      (karmaSpentPositive + karmaSpentSpells + karmaSpentComplexForms + karmaSpentPowerPoints + karmaSpentFociBonding);

    // Allow reducing conversion back down even if available is low/negative
    return Math.max(0, available + karmaConversion);
  }, [
    budgetValues,
    state.budgets,
    karmaConversion,
  ]);

  // Calculate budget
  const baseNuyen = budgetValues["nuyen"] || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate spent
  const gearSpent = selectedGear.reduce((sum, item) => sum + item.cost * item.quantity, 0);
  const fociSpent = selectedFoci.reduce((sum, focus) => sum + focus.cost, 0);
  const augmentationSpent = (state.budgets["nuyen-spent-augmentations"] as number) || 0;
  const lifestyleSpent = (state.budgets["nuyen-spent-lifestyle"] as number) || 0;
  const identitySpent = (state.budgets["nuyen-spent-identities"] as number) || 0;
  const totalSpent = gearSpent + fociSpent + augmentationSpent + lifestyleSpent + identitySpent;
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



  // Helper to add focus
  const addFocus = (focusCatalogItem: FocusCatalogItemData, force: number, bonded: boolean) => {
    const cost = force * focusCatalogItem.costMultiplier;
    const karmaToBond = bonded ? force * focusCatalogItem.bondingKarmaMultiplier : 0;
    const availability = force * 4; // Availability is Force × 4R for foci
    
    const newFocus: FocusItem = {
      catalogId: focusCatalogItem.id,
      name: `${focusCatalogItem.name} (Force ${force})`,
      type: focusCatalogItem.type as FocusType,
      force,
      bonded,
      karmaToBond,
      cost,
      availability,
      restricted: focusCatalogItem.restricted,
    };
    
    const updatedFoci = [...selectedFoci, newFocus];
    
    // Update karma budget for bonding
    const newFociBondingKarma = updatedFoci.reduce((sum, f) => sum + (f.bonded ? f.karmaToBond : 0), 0);
    
    updateState({
      selections: {
        ...state.selections,
        foci: updatedFoci,
      },
      budgets: {
        ...state.budgets,
        "karma-spent-foci-bonding": newFociBondingKarma,
      },
    });
  };
  
  // Helper to remove focus
  const removeFocus = (index: number) => {
    const updatedFoci = selectedFoci.filter((_, i) => i !== index);
    const newFociBondingKarma = updatedFoci.reduce((sum, f) => sum + (f.bonded ? f.karmaToBond : 0), 0);
    
    updateState({
      selections: {
        ...state.selections,
        foci: updatedFoci,
      },
      budgets: {
        ...state.budgets,
        "karma-spent-foci-bonding": newFociBondingKarma,
      },
    });
  };

  // Handle karma conversion
  const handleKarmaConversion = (value: number) => {
    const maxAllowed = Math.min(MAX_KARMA_CONVERSION, karmaAvailableForConversion);
    const clampedValue = Math.max(0, Math.min(value, maxAllowed));
    updateState({
      budgets: {
        ...state.budgets,
        "karma-spent-gear": clampedValue,
      },
    });
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
              className={`text-lg font-semibold ${remaining < 0
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
          nuyen per Karma. Available Karma: {karmaAvailableForConversion}
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max={Math.min(MAX_KARMA_CONVERSION, karmaAvailableForConversion)}
            value={karmaConversion}
            onChange={(e) => handleKarmaConversion(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="w-20 text-sm">
            {karmaConversion} Karma = ¥{formatCurrency(convertedNuyen)}
          </span>
        </div>
      </div>


      {/* Gear Catalog */}
      <div className="space-y-4">
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
            ...(isMagical ? [{ id: "foci", label: "Foci" }] : []),
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as GearCategory);
                if (cat.id !== "weapons") setWeaponSubcategory("all");
              }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${selectedCategory === cat.id
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
                className={`rounded-full px-2 py-1 text-xs transition-colors ${weaponSubcategory === sub.id
                    ? "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-100"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                  }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Foci Selection */}
        {selectedCategory === "foci" && (
          <div className="space-y-4">
            {/* Selected Foci */}
            {selectedFoci.length > 0 && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                <h3 className="mb-2 text-sm font-semibold">Selected Foci</h3>
                <div className="space-y-2">
                  {selectedFoci.map((focus, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded border border-zinc-200 bg-white p-2 dark:border-zinc-600 dark:bg-zinc-800"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{focus.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          ¥{formatCurrency(focus.cost)}
                          {focus.bonded && ` | Bonded (${focus.karmaToBond} Karma)`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFocus(index)}
                        className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Foci Catalog */}
            <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                  <tr>
                    <th className="px-3 py-2 text-left">Focus</th>
                    <th className="px-3 py-2 text-center">Force</th>
                    <th className="px-3 py-2 text-center">Bond</th>
                    <th className="px-3 py-2 text-right">Cost</th>
                    <th className="px-3 py-2 text-center">Karma</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                  {fociCatalog.map((focus) => {
                    return [1, 2, 3, 4, 5, 6].map((force) => {
                      const cost = force * focus.costMultiplier;
                      const bondingKarma = force * focus.bondingKarmaMultiplier;
                      const canAfford = cost <= remaining;

                      return (
                        <tr
                          key={`${focus.id}-${force}`}
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        >
                          <td className="px-3 py-2">
                            <p className="font-medium">{focus.name}</p>
                            {focus.description && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                                {focus.description}
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">{force}</td>
                          <td className="px-3 py-2 text-center">
                            <label className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={false}
                                readOnly
                                className="rounded"
                              />
                            </label>
                          </td>
                          <td className="px-3 py-2 text-right">¥{formatCurrency(cost)}</td>
                          <td className="px-3 py-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
                            {bondingKarma}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex gap-1">
                              <button
                                onClick={() => addFocus(focus, force, false)}
                                disabled={!canAfford}
                                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${canAfford
                                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                                  }`}
                              >
                                Add
                              </button>
                              <button
                                onClick={() => addFocus(focus, force, true)}
                                disabled={!canAfford}
                                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${canAfford
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                                  }`}
                                title={`Add and bond (costs ${bondingKarma} Karma)`}
                              >
                                +Bond
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })}
                  {fociCatalog.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                        No foci available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Item List */}
        {selectedCategory !== "foci" && (
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
                        className={`${item.restricted
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
                        className={`rounded px-2 py-1 text-xs font-medium transition-colors ${available && canAfford
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
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Maximum availability at creation: {MAX_AVAILABILITY}. Restricted (R) items require a
        license. Forbidden (F) items are not available at creation.
      </p>
    </div>
  );
}
