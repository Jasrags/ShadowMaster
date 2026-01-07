"use client";

/**
 * WeaponsPanel
 *
 * Card for weapon purchasing in sheet-driven creation.
 * Provides enhanced weapon management with:
 * - Expandable weapon rows with full stats
 * - Split-pane purchase modal
 * - Wireless bonus display
 * - Modification slots (Phase 3)
 * - Ammunition tracking (Phase 4)
 *
 * Shares budget with GearCard via state.budgets["nuyen"]
 */

import { useMemo, useCallback, useState } from "react";
import {
  useGear,
  type WeaponData,
  type GearCatalogData,
  type WeaponModificationCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { CreationState, Weapon, InstalledWeaponMod, WeaponMount, PurchasedAmmunitionItem } from "@/lib/types";
import type { GearItemData } from "@/lib/rules/RulesetContext";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  KarmaConversionModal,
  useKarmaConversionPrompt,
  MAX_KARMA_CONVERSION,
} from "./shared";
import { WeaponRow, WeaponPurchaseModal, WeaponModificationModal, AmmunitionModal } from "./weapons";
import { Lock, Plus, Sword } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const KARMA_TO_NUYEN_RATE = 2000;

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

// =============================================================================
// TYPES
// =============================================================================

interface WeaponsPanelProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// BUDGET DISPLAY COMPONENT
// =============================================================================

function BudgetDisplay({
  spent,
  total,
  remaining,
  isOver,
}: {
  spent: number;
  total: number;
  remaining: number;
  isOver: boolean;
}) {
  const percentage = Math.min(100, (spent / total) * 100);

  return (
    <div className={`rounded-lg border p-3 ${
      isOver
        ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
        : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
    }`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Weapons Budget</span>
        <span className={`font-bold ${
          isOver
            ? "text-red-600 dark:text-red-400"
            : remaining === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-900 dark:text-zinc-100"
        }`}>
          {formatCurrency(remaining)}¥
          <span className="font-normal text-zinc-400"> remaining</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all ${
            isOver
              ? "bg-red-500"
              : remaining === 0
                ? "bg-emerald-500"
                : "bg-amber-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WeaponsPanel({ state, updateState }: WeaponsPanelProps) {
  const gearCatalog = useGear();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [modifyingWeaponId, setModifyingWeaponId] = useState<string | null>(null);
  const [ammoWeaponId, setAmmoWeaponId] = useState<string | null>(null);

  // Get weapons catalog
  const weaponsCatalog = useMemo(
    () => getWeaponsCatalog(gearCatalog),
    [gearCatalog]
  );

  // Get selected weapons from state
  const selectedWeapons = useMemo(
    () => (state.selections?.weapons || []) as Weapon[],
    [state.selections?.weapons]
  );

  // Calculate budget (shared with GearCard)
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const baseNuyen = nuyenBudget?.total || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate total spent across all gear categories
  const selectedGear = (state.selections?.gear || []) as Array<{ cost: number; quantity: number }>;
  const selectedArmor = (state.selections?.armor || []) as Array<{ cost: number; quantity: number }>;
  const selectedFoci = (state.selections?.foci || []) as Array<{ cost: number }>;
  const selectedCyberware = (state.selections?.cyberware || []) as Array<{ cost: number }>;
  const selectedBioware = (state.selections?.bioware || []) as Array<{ cost: number }>;

  const weaponsSpent = selectedWeapons.reduce((sum, w) => {
    const baseCost = w.cost * w.quantity;
    const modCost = w.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    const ammoCost = w.purchasedAmmunition?.reduce((a, ammo) => a + ammo.cost * ammo.quantity, 0) || 0;
    return sum + baseCost + modCost + ammoCost;
  }, 0);
  const armorSpent = selectedArmor.reduce((sum, a) => sum + a.cost * a.quantity, 0);
  const gearSpent = selectedGear.reduce((sum, g) => sum + g.cost * g.quantity, 0);
  const fociSpent = selectedFoci.reduce((sum, f) => sum + f.cost, 0);
  const augmentationSpent =
    selectedCyberware.reduce((s, i) => s + i.cost, 0) +
    selectedBioware.reduce((s, i) => s + i.cost, 0);
  const lifestyleSpent = (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;

  const totalSpent = weaponsSpent + armorSpent + gearSpent + fociSpent + augmentationSpent + lifestyleSpent;
  const remaining = totalNuyen - totalSpent;
  const isOverBudget = remaining < 0;

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

  // Add weapon (actual implementation - called after affordability check)
  const actuallyAddWeapon = useCallback(
    (weapon: WeaponData) => {
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

      // Close modal after purchase
      setIsPurchaseModalOpen(false);
    },
    [selectedWeapons, state.selections, updateState]
  );

  // Add weapon (with karma conversion prompt if needed)
  const addWeapon = useCallback(
    (weapon: WeaponData) => {
      // Check if already affordable
      if (weapon.cost <= remaining) {
        actuallyAddWeapon(weapon);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(weapon.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(weapon.name, weapon.cost, () => {
          actuallyAddWeapon(weapon);
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
        availability = (mod.ratingSpec.availabilityScaling.baseValue || mod.availability || 0) * rating;
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
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Set priorities first
            </p>
          </div>
        </div>
      </CreationCard>
    );
  }

  return (
    <>
      <CreationCard
        title="Weapons"
        description={`${selectedWeapons.length} weapon${selectedWeapons.length !== 1 ? "s" : ""}`}
        status={validationStatus}
        headerAction={
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Weapon
          </button>
        }
      >
        <div className="space-y-4">
          {/* Budget Display */}
          <BudgetDisplay
            spent={weaponsSpent}
            total={totalNuyen}
            remaining={remaining}
            isOver={isOverBudget}
          />

          {/* Weapon List */}
          {selectedWeapons.length > 0 ? (
            <div className="space-y-2">
              {selectedWeapons.map((weapon) => (
                <WeaponRow
                  key={weapon.id}
                  weapon={weapon}
                  onRemove={removeWeapon}
                  onAddMod={handleAddMod}
                  onRemoveMod={handleRemoveMod}
                  onAddAmmo={handleAddAmmo}
                  onRemoveAmmo={handleRemoveAmmo}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 p-8 dark:border-zinc-700">
              <Sword className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                No weapons purchased
              </p>
              <button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                <Plus className="h-4 w-4" />
                Add your first weapon
              </button>
            </div>
          )}

          {/* Weapon Spent Summary */}
          {selectedWeapons.length > 0 && (
            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span>Total spent on weapons</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(weaponsSpent)}¥
              </span>
            </div>
          )}
        </div>
      </CreationCard>

      {/* Purchase Modal */}
      <WeaponPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        weapons={weaponsCatalog}
        remaining={remaining}
        onPurchase={addWeapon}
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
