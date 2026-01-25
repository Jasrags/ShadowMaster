"use client";

/**
 * WeaponsPanel
 *
 * Card for weapon purchasing in sheet-driven creation.
 * Follows the Augmentations pattern with:
 * - Nuyen budget bar at top
 * - Category sections (Ranged, Melee, Throwing/Grenades)
 * - Type badges and icon tags for stats
 * - Per-category add buttons
 * - Legality warnings
 * - Modal-driven weapon selection
 *
 * Shares budget with GearCard via state.budgets["nuyen"]
 */

import { useMemo, useCallback, useState } from "react";
import {
  useGear,
  useWeaponModifications,
  useRuleset,
  type WeaponData,
  type GearCatalogData,
  type WeaponModificationCatalogItemData,
} from "@/lib/rules/RulesetContext";
import { applyBuiltInModifications } from "@/lib/rules/gear/weapon-customization";
import type {
  CreationState,
  Weapon,
  InstalledWeaponMod,
  WeaponMount,
  PurchasedAmmunitionItem,
  MergedRuleset,
} from "@/lib/types";
import type { GearItemData } from "@/lib/rules/RulesetContext";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  EmptyState,
  SummaryFooter,
  KarmaConversionModal,
  useKarmaConversionPrompt,
} from "./shared";
import {
  WeaponRow,
  WeaponPurchaseModal,
  WeaponModificationModal,
  AmmunitionModal,
} from "./weapons";
import {
  Lock,
  Plus,
  Sword,
  Crosshair,
  Target,
  Bomb,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { InfoTooltip } from "@/components/ui";

// =============================================================================
// CONSTANTS
// =============================================================================

const KARMA_TO_NUYEN_RATE = 2000;

// Weapon category configuration
const WEAPON_CATEGORIES = {
  ranged: {
    label: "Ranged Weapons",
    icon: Crosshair,
    color: "blue",
    subcategories: ["pistols", "smgs", "rifles", "shotguns", "sniperRifles"],
  },
  melee: {
    label: "Melee Weapons",
    icon: Sword,
    color: "amber",
    subcategories: ["melee"],
  },
  throwing: {
    label: "Throwing & Grenades",
    icon: Bomb,
    color: "red",
    subcategories: ["throwingWeapons", "grenades"],
  },
} as const;

type WeaponCategoryKey = keyof typeof WEAPON_CATEGORIES;

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

// Extract weapon catalog organized by category
function getWeaponsCatalog(catalog: GearCatalogData | null) {
  if (!catalog?.weapons) {
    return {
      melee: [],
      pistols: [],
      smgs: [],
      rifles: [],
      shotguns: [],
      sniperRifles: [],
      throwingWeapons: [],
      grenades: [],
    };
  }
  return catalog.weapons;
}

// Categorize a weapon based on its subcategory
function getWeaponCategory(weapon: Weapon): WeaponCategoryKey {
  const subcategory = weapon.subcategory?.toLowerCase() || weapon.category?.toLowerCase() || "";

  // Check melee categories
  if (["blade", "club", "exotic-melee", "unarmed", "melee"].includes(subcategory)) {
    return "melee";
  }

  // Check throwing/grenades
  if (
    ["grenade", "throwing", "throwing-weapon", "grenades", "throwingweapons"].includes(subcategory)
  ) {
    return "throwing";
  }

  // Default to ranged
  return "ranged";
}

// =============================================================================
// TYPES
// =============================================================================

interface WeaponsPanelProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// WEAPON CATEGORY SECTION COMPONENT
// =============================================================================

interface WeaponCategorySectionProps {
  categoryKey: WeaponCategoryKey;
  weapons: Weapon[];
  ruleset: MergedRuleset | null;
  onAddClick: () => void;
  onRemove: (id: string) => void;
  onAddMod: (weaponId: string) => void;
  onRemoveMod: (weaponId: string, modIndex: number) => void;
  onAddAmmo: (weaponId: string) => void;
  onRemoveAmmo: (weaponId: string, ammoIndex: number) => void;
}

function WeaponCategorySection({
  categoryKey,
  weapons,
  ruleset,
  onAddClick,
  onRemove,
  onAddMod,
  onRemoveMod,
  onAddAmmo,
  onRemoveAmmo,
}: WeaponCategorySectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const category = WEAPON_CATEGORIES[categoryKey];
  const Icon = category.icon;

  const colorClasses = {
    blue: {
      icon: "text-blue-500",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    },
    amber: {
      icon: "text-amber-500",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    },
    red: {
      icon: "text-red-500",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    },
  }[category.color];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 hover:opacity-80"
        >
          <div className="text-zinc-400">
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </div>
          <Icon className={`h-3.5 w-3.5 ${colorClasses.icon}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {category.label}
          </span>
          {weapons.length > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${colorClasses.badge}`}
            >
              {weapons.length}
            </span>
          )}
        </button>
        <button
          onClick={onAddClick}
          className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      {!isCollapsed && (
        <>
          {weapons.length > 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 px-3 divide-y divide-zinc-100 dark:divide-zinc-800">
              {weapons.map((weapon) => (
                <WeaponRow
                  key={weapon.id}
                  weapon={weapon}
                  ruleset={ruleset}
                  onRemove={onRemove}
                  onAddMod={onAddMod}
                  onRemoveMod={onRemoveMod}
                  onAddAmmo={onAddAmmo}
                  onRemoveAmmo={onRemoveAmmo}
                />
              ))}
            </div>
          ) : (
            <EmptyState message={`No ${category.label.toLowerCase()} purchased`} />
          )}
        </>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function WeaponsPanel({ state, updateState }: WeaponsPanelProps) {
  const { ruleset } = useRuleset();
  const gearCatalog = useGear();
  const weaponModsCatalog = useWeaponModifications();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseCategory, setPurchaseCategory] = useState<WeaponCategoryKey | null>(null);
  const [modifyingWeaponId, setModifyingWeaponId] = useState<string | null>(null);
  const [ammoWeaponId, setAmmoWeaponId] = useState<string | null>(null);

  // Get weapons catalog
  const weaponsCatalog = useMemo(() => getWeaponsCatalog(gearCatalog), [gearCatalog]);

  // Get selected weapons from state
  const selectedWeapons = useMemo(
    () => (state.selections?.weapons || []) as Weapon[],
    [state.selections?.weapons]
  );

  // Group weapons by category
  const weaponsByCategory = useMemo(() => {
    const grouped: Record<WeaponCategoryKey, Weapon[]> = {
      ranged: [],
      melee: [],
      throwing: [],
    };

    for (const weapon of selectedWeapons) {
      const category = getWeaponCategory(weapon);
      grouped[category].push(weapon);
    }

    return grouped;
  }, [selectedWeapons]);

  // Calculate budget (shared with GearCard)
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const baseNuyen = nuyenBudget?.total || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate total spent across all gear categories
  const selectedGear = (state.selections?.gear || []) as Array<{
    cost: number;
    quantity: number;
  }>;
  const selectedArmor = (state.selections?.armor || []) as Array<{
    cost: number;
    quantity: number;
  }>;
  const selectedFoci = (state.selections?.foci || []) as Array<{
    cost: number;
  }>;
  const selectedCyberware = (state.selections?.cyberware || []) as Array<{
    cost: number;
  }>;
  const selectedBioware = (state.selections?.bioware || []) as Array<{
    cost: number;
  }>;

  const weaponsSpent = selectedWeapons.reduce((sum, w) => {
    const baseCost = w.cost * w.quantity;
    const modCost = w.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    const ammoCost =
      w.purchasedAmmunition?.reduce((a, ammo) => a + ammo.cost * ammo.quantity, 0) || 0;
    return sum + baseCost + modCost + ammoCost;
  }, 0);
  const armorSpent = selectedArmor.reduce((sum, a) => sum + a.cost * a.quantity, 0);
  const gearSpent = selectedGear.reduce((sum, g) => sum + g.cost * g.quantity, 0);
  const fociSpent = selectedFoci.reduce((sum, f) => sum + f.cost, 0);
  const augmentationSpent =
    selectedCyberware.reduce((s, i) => s + i.cost, 0) +
    selectedBioware.reduce((s, i) => s + i.cost, 0);
  const lifestyleSpent = (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;
  const vehiclesSpent =
    ((state.selections?.vehicles as Array<{ cost: number }>) || []).reduce(
      (s, i) => s + i.cost,
      0
    ) +
    ((state.selections?.drones as Array<{ cost: number }>) || []).reduce((s, i) => s + i.cost, 0) +
    ((state.selections?.rccs as Array<{ cost: number }>) || []).reduce((s, i) => s + i.cost, 0) +
    ((state.selections?.autosofts as Array<{ cost: number }>) || []).reduce(
      (s, i) => s + i.cost,
      0
    );

  const totalSpent =
    weaponsSpent +
    armorSpent +
    gearSpent +
    fociSpent +
    augmentationSpent +
    lifestyleSpent +
    vehiclesSpent;
  const remaining = totalNuyen - totalSpent;
  const isOverBudget = remaining < 0;

  // Calculate legality warnings
  const legalityWarnings = useMemo(() => {
    const restricted: Weapon[] = [];
    const forbidden: Weapon[] = [];

    for (const weapon of selectedWeapons) {
      // Check weapon legality
      const legality = (weapon as Weapon & { legality?: string }).legality;
      if (legality === "restricted") {
        restricted.push(weapon);
      } else if (legality === "forbidden") {
        forbidden.push(weapon);
      }

      // Check mod legality
      for (const mod of weapon.modifications || []) {
        if (mod.legality === "restricted" && !restricted.includes(weapon)) {
          restricted.push(weapon);
        } else if (mod.legality === "forbidden" && !forbidden.includes(weapon)) {
          forbidden.push(weapon);
        }
      }
    }

    return { restricted, forbidden };
  }, [selectedWeapons]);

  // Karma conversion hook
  const karmaRemaining = karmaBudget?.remaining ?? 0;

  const handleKarmaConvert = useCallback(
    (newTotalConversion: number) => {
      updateState({
        budgets: {
          ...state.budgets,
          "karma-spent-gear": newTotalConversion,
        },
      });
    },
    [state.budgets, updateState]
  );

  const karmaConversionPrompt = useKarmaConversionPrompt({
    remaining,
    karmaRemaining,
    currentConversion: karmaConversion,
    onConvert: handleKarmaConvert,
  });

  // Open purchase modal for a specific category
  const openPurchaseModal = useCallback((category: WeaponCategoryKey) => {
    setPurchaseCategory(category);
    setIsPurchaseModalOpen(true);
  }, []);

  // Add weapon (actual implementation - called after affordability check)
  const actuallyAddWeapon = useCallback(
    (weapon: WeaponData, quantity: number = 1) => {
      let newWeapon: Weapon = {
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
        quantity,
        wirelessBonus: weapon.wirelessBonus,
        modifications: [],
        occupiedMounts: [],
      };

      // Apply built-in modifications if the weapon has any
      if (weapon.builtInModifications && weapon.builtInModifications.length > 0) {
        const builtInMods: WeaponModificationCatalogItemData[] = [];
        for (const builtIn of weapon.builtInModifications) {
          const catalogMod = weaponModsCatalog.find((m) => m.id === builtIn.modificationId);
          if (catalogMod) {
            // Override mount with the weapon-specific mount if provided
            builtInMods.push({
              ...catalogMod,
              mount: builtIn.mount || catalogMod.mount,
            });
          }
        }

        if (builtInMods.length > 0) {
          newWeapon = applyBuiltInModifications(
            newWeapon,
            builtInMods as unknown as Parameters<typeof applyBuiltInModifications>[1]
          );
        }
      }

      updateState({
        selections: {
          ...state.selections,
          weapons: [...selectedWeapons, newWeapon],
        },
      });

      // Close modal after purchase
      setIsPurchaseModalOpen(false);
      setPurchaseCategory(null);
    },
    [selectedWeapons, state.selections, updateState, weaponModsCatalog]
  );

  // Add weapon (with karma conversion prompt if needed)
  const addWeapon = useCallback(
    (weapon: WeaponData, quantity: number = 1) => {
      const totalCost = weapon.cost * quantity;

      // Check if already affordable
      if (totalCost <= remaining) {
        actuallyAddWeapon(weapon, quantity);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemName = quantity > 1 ? `${weapon.name} (x${quantity})` : weapon.name;
        karmaConversionPrompt.promptConversion(itemName, totalCost, () => {
          actuallyAddWeapon(weapon, quantity);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remaining, actuallyAddWeapon, karmaConversionPrompt]
  );

  // Remove weapon
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

  // Get the weapon being modified
  const modifyingWeapon = useMemo(
    () => selectedWeapons.find((w) => w.id === modifyingWeaponId) || null,
    [selectedWeapons, modifyingWeaponId]
  );

  // Open modification modal for a weapon
  const handleAddMod = useCallback((weaponId: string) => {
    setModifyingWeaponId(weaponId);
  }, []);

  // Install a modification on a weapon (actual implementation)
  const actuallyInstallMod = useCallback(
    (mod: WeaponModificationCatalogItemData, rating?: number) => {
      if (!modifyingWeaponId) return;

      const weaponIndex = selectedWeapons.findIndex((w) => w.id === modifyingWeaponId);
      if (weaponIndex === -1) return;

      const weapon = selectedWeapons[weaponIndex];

      // Calculate cost
      let cost = mod.cost || 0;
      if (mod.costMultiplier) {
        cost = Math.round(weapon.cost * mod.costMultiplier);
      } else if (rating && (mod.costPerRating || mod.ratingSpec?.costScaling?.perRating)) {
        cost = (mod.ratingSpec?.costScaling?.baseValue || mod.cost || 0) * rating;
      }

      // Calculate availability
      let availability = mod.availability || 0;
      if (rating && mod.ratingSpec?.availabilityScaling?.perRating) {
        availability =
          (mod.ratingSpec.availabilityScaling.baseValue || mod.availability || 0) * rating;
      }

      // Create installed mod
      const installedMod: InstalledWeaponMod = {
        catalogId: mod.id,
        name: rating ? `${mod.name} (Rating ${rating})` : mod.name,
        mount: mod.mount as WeaponMount | undefined,
        rating,
        cost,
        availability,
        legality: mod.legality,
        isBuiltIn: false,
        capacityUsed: 0, // Weapon mods don't use capacity like armor mods
      };

      // Update occupied mounts
      const newOccupiedMounts = [...(weapon.occupiedMounts || [])];
      if (mod.mount) {
        newOccupiedMounts.push(mod.mount as WeaponMount);
      }
      if (mod.occupiedMounts) {
        newOccupiedMounts.push(...(mod.occupiedMounts as WeaponMount[]));
      }

      // Create updated weapon
      const updatedWeapon: Weapon = {
        ...weapon,
        modifications: [...(weapon.modifications || []), installedMod],
        occupiedMounts: newOccupiedMounts,
      };

      // Update weapons array
      const newWeapons = [...selectedWeapons];
      newWeapons[weaponIndex] = updatedWeapon;

      updateState({
        selections: {
          ...state.selections,
          weapons: newWeapons,
        },
      });

      setModifyingWeaponId(null);
    },
    [modifyingWeaponId, selectedWeapons, state.selections, updateState]
  );

  // Install a modification (with karma conversion prompt if needed)
  const handleInstallMod = useCallback(
    (mod: WeaponModificationCatalogItemData, rating?: number) => {
      if (!modifyingWeaponId) return;

      const weaponIndex = selectedWeapons.findIndex((w) => w.id === modifyingWeaponId);
      if (weaponIndex === -1) return;

      const weapon = selectedWeapons[weaponIndex];

      // Calculate cost for the mod
      let cost = mod.cost || 0;
      if (mod.costMultiplier) {
        cost = Math.round(weapon.cost * mod.costMultiplier);
      } else if (rating && (mod.costPerRating || mod.ratingSpec?.costScaling?.perRating)) {
        cost = (mod.ratingSpec?.costScaling?.baseValue || mod.cost || 0) * rating;
      }

      // Check if already affordable
      if (cost <= remaining) {
        actuallyInstallMod(mod, rating);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(cost);
      if (conversionInfo?.canConvert) {
        const modName = rating ? `${mod.name} (Rating ${rating})` : mod.name;
        karmaConversionPrompt.promptConversion(modName, cost, () => {
          actuallyInstallMod(mod, rating);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [modifyingWeaponId, selectedWeapons, remaining, actuallyInstallMod, karmaConversionPrompt]
  );

  // Remove a modification from a weapon
  const handleRemoveMod = useCallback(
    (weaponId: string, modIndex: number) => {
      const weaponIndex = selectedWeapons.findIndex((w) => w.id === weaponId);
      if (weaponIndex === -1) return;

      const weapon = selectedWeapons[weaponIndex];
      const mods = weapon.modifications || [];
      const modToRemove = mods[modIndex];

      // Don't allow removing built-in mods
      if (modToRemove?.isBuiltIn) return;

      // Update occupied mounts - remove the mount(s) used by this mod
      let newOccupiedMounts = [...(weapon.occupiedMounts || [])];
      if (modToRemove?.mount) {
        const mountIndex = newOccupiedMounts.indexOf(modToRemove.mount);
        if (mountIndex !== -1) {
          newOccupiedMounts = newOccupiedMounts.filter((_, i) => i !== mountIndex);
        }
      }

      // Create updated weapon
      const updatedWeapon: Weapon = {
        ...weapon,
        modifications: mods.filter((_, i) => i !== modIndex),
        occupiedMounts: newOccupiedMounts,
      };

      // Update weapons array
      const newWeapons = [...selectedWeapons];
      newWeapons[weaponIndex] = updatedWeapon;

      updateState({
        selections: {
          ...state.selections,
          weapons: newWeapons,
        },
      });
    },
    [selectedWeapons, state.selections, updateState]
  );

  // Get the weapon for ammunition modal
  const ammoWeapon = useMemo(
    () => selectedWeapons.find((w) => w.id === ammoWeaponId) || null,
    [selectedWeapons, ammoWeaponId]
  );

  // Open ammunition modal for a weapon
  const handleAddAmmo = useCallback((weaponId: string) => {
    setAmmoWeaponId(weaponId);
  }, []);

  // Purchase ammunition for a weapon (actual implementation)
  const actuallyPurchaseAmmo = useCallback(
    (ammo: GearItemData, quantity: number) => {
      if (!ammoWeaponId) return;

      const weaponIndex = selectedWeapons.findIndex((w) => w.id === ammoWeaponId);
      if (weaponIndex === -1) return;

      const weapon = selectedWeapons[weaponIndex];

      // Create purchased ammo item
      const purchasedAmmo: PurchasedAmmunitionItem = {
        catalogId: ammo.id,
        name: ammo.name,
        quantity,
        cost: ammo.cost,
        roundsPerBox: "quantity" in ammo ? Number(ammo.quantity) : 10,
        damageModifier: "damageModifier" in ammo ? String(ammo.damageModifier) : undefined,
        apModifier: "apModifier" in ammo ? Number(ammo.apModifier) : undefined,
        availability: ammo.availability,
        legality: ammo.legality,
      };

      // Update weapon with purchased ammunition
      const updatedWeapon: Weapon = {
        ...weapon,
        purchasedAmmunition: [...(weapon.purchasedAmmunition || []), purchasedAmmo],
      };

      // Update weapons array
      const newWeapons = [...selectedWeapons];
      newWeapons[weaponIndex] = updatedWeapon;

      updateState({
        selections: {
          ...state.selections,
          weapons: newWeapons,
        },
      });

      setAmmoWeaponId(null);
    },
    [ammoWeaponId, selectedWeapons, state.selections, updateState]
  );

  // Purchase ammunition (with karma conversion prompt if needed)
  const handlePurchaseAmmo = useCallback(
    (ammo: GearItemData, quantity: number) => {
      const totalCost = ammo.cost * quantity;

      // Check if already affordable
      if (totalCost <= remaining) {
        actuallyPurchaseAmmo(ammo, quantity);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const ammoName = quantity > 1 ? `${ammo.name} (x${quantity})` : ammo.name;
        karmaConversionPrompt.promptConversion(ammoName, totalCost, () => {
          actuallyPurchaseAmmo(ammo, quantity);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remaining, actuallyPurchaseAmmo, karmaConversionPrompt]
  );

  // Remove ammunition from a weapon
  const handleRemoveAmmo = useCallback(
    (weaponId: string, ammoIndex: number) => {
      const weaponIndex = selectedWeapons.findIndex((w) => w.id === weaponId);
      if (weaponIndex === -1) return;

      const weapon = selectedWeapons[weaponIndex];
      const ammoList = weapon.purchasedAmmunition || [];

      // Create updated weapon
      const updatedWeapon: Weapon = {
        ...weapon,
        purchasedAmmunition: ammoList.filter((_, i) => i !== ammoIndex),
      };

      // Update weapons array
      const newWeapons = [...selectedWeapons];
      newWeapons[weaponIndex] = updatedWeapon;

      updateState({
        selections: {
          ...state.selections,
          weapons: newWeapons,
        },
      });
    },
    [selectedWeapons, state.selections, updateState]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (isOverBudget) return "error";
    if (selectedWeapons.length > 0) return "valid";
    return "pending";
  }, [isOverBudget, selectedWeapons.length]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard title="Weapons" description="Purchase weapons" status="pending">
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
    <>
      <CreationCard title="Weapons" status={validationStatus}>
        <div className="space-y-4">
          {/* Nuyen Budget Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                <span>Nuyen</span>
                <InfoTooltip content="Total nuyen spent on all gear" label="Nuyen budget info" />
                {karmaConversion > 0 && (
                  <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                    (+{(karmaConversion * KARMA_TO_NUYEN_RATE).toLocaleString()}¥ karma)
                  </span>
                )}
              </span>
              <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(totalSpent)} / {formatCurrency(totalNuyen)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-full transition-all ${isOverBudget ? "bg-red-500" : "bg-emerald-500"}`}
                style={{
                  width: `${Math.min(100, (totalSpent / totalNuyen) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Legality Warnings */}
          {(legalityWarnings.restricted.length > 0 || legalityWarnings.forbidden.length > 0) && (
            <div className="space-y-2">
              {legalityWarnings.forbidden.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-medium text-red-700 dark:text-red-300">
                      {legalityWarnings.forbidden.length} forbidden item
                      {legalityWarnings.forbidden.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-red-600 dark:text-red-400"> - illegal to possess</span>
                  </div>
                </div>
              )}
              {legalityWarnings.restricted.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-medium text-amber-700 dark:text-amber-300">
                      {legalityWarnings.restricted.length} restricted item
                      {legalityWarnings.restricted.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400"> - requires license</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weapon Category Sections */}
          <WeaponCategorySection
            categoryKey="ranged"
            weapons={weaponsByCategory.ranged}
            ruleset={ruleset}
            onAddClick={() => openPurchaseModal("ranged")}
            onRemove={removeWeapon}
            onAddMod={handleAddMod}
            onRemoveMod={handleRemoveMod}
            onAddAmmo={handleAddAmmo}
            onRemoveAmmo={handleRemoveAmmo}
          />

          <WeaponCategorySection
            categoryKey="melee"
            weapons={weaponsByCategory.melee}
            ruleset={ruleset}
            onAddClick={() => openPurchaseModal("melee")}
            onRemove={removeWeapon}
            onAddMod={handleAddMod}
            onRemoveMod={handleRemoveMod}
            onAddAmmo={handleAddAmmo}
            onRemoveAmmo={handleRemoveAmmo}
          />

          <WeaponCategorySection
            categoryKey="throwing"
            weapons={weaponsByCategory.throwing}
            ruleset={ruleset}
            onAddClick={() => openPurchaseModal("throwing")}
            onRemove={removeWeapon}
            onAddMod={handleAddMod}
            onRemoveMod={handleRemoveMod}
            onAddAmmo={handleAddAmmo}
            onRemoveAmmo={handleRemoveAmmo}
          />

          {/* Footer Summary */}
          <SummaryFooter count={selectedWeapons.length} total={weaponsSpent} format="currency" />
        </div>
      </CreationCard>

      {/* Purchase Modal */}
      <WeaponPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setPurchaseCategory(null);
        }}
        weapons={weaponsCatalog}
        remaining={remaining}
        onPurchase={addWeapon}
        initialCategory={purchaseCategory}
      />

      {/* Modification Modal */}
      {modifyingWeapon && (
        <WeaponModificationModal
          isOpen={!!modifyingWeaponId}
          onClose={() => setModifyingWeaponId(null)}
          weapon={modifyingWeapon}
          remaining={remaining}
          onInstall={handleInstallMod}
        />
      )}

      {/* Ammunition Modal */}
      {ammoWeapon && (
        <AmmunitionModal
          isOpen={!!ammoWeaponId}
          onClose={() => setAmmoWeaponId(null)}
          weapon={ammoWeapon}
          remaining={remaining}
          onPurchase={handlePurchaseAmmo}
        />
      )}

      {/* Karma Conversion Modal */}
      <KarmaConversionModal
        isOpen={karmaConversionPrompt.modalState.isOpen}
        onClose={karmaConversionPrompt.closeModal}
        onConfirm={karmaConversionPrompt.confirmConversion}
        itemName={karmaConversionPrompt.modalState.itemName}
        itemCost={karmaConversionPrompt.modalState.itemCost}
        currentRemaining={karmaConversionPrompt.currentRemaining}
        karmaToConvert={karmaConversionPrompt.modalState.karmaToConvert}
        karmaAvailable={karmaConversionPrompt.karmaAvailable}
        currentKarmaConversion={karmaConversionPrompt.currentKarmaConversion}
        maxKarmaConversion={karmaConversionPrompt.maxKarmaConversion}
      />
    </>
  );
}
