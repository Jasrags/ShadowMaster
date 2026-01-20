"use client";

/**
 * AmmunitionModal
 *
 * Modal for purchasing ammunition for a specific weapon.
 * Shows compatible ammunition types with damage/AP modifiers,
 * legality warnings, and quantity selection.
 */

import { useMemo, useState } from "react";
import { useGear, useRuleset, type GearItemData } from "@/lib/rules/RulesetContext";
import { isMountBased, type ModifiableItem } from "@/lib/rules/modifications";
import type { Weapon } from "@/lib/types";
import { BaseModalRoot } from "@/components/ui";
import { ShieldAlert, AlertTriangle, Package, X, Ban } from "lucide-react";
import { BulkQuantitySelector } from "@/components/creation/shared/BulkQuantitySelector";

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

/**
 * Get rounds per box from ammo data (default 10)
 */
function getRoundsPerBox(ammo: GearItemData): number {
  return "quantity" in ammo && typeof ammo.quantity === "number" ? ammo.quantity : 10;
}

/**
 * Map weapon subcategories to compatible ammunition categories.
 * In SR5, most ammunition is caliber-generic but some are restricted.
 */
function getCompatibleAmmoTypes(subcategory: string): string[] {
  const subcat = subcategory.toLowerCase();

  // Taser only uses taser darts
  if (subcat === "taser") {
    return ["taser-dart"];
  }

  // Assault cannons use their own ammo
  if (subcat === "assault-cannon") {
    return ["assault-cannon", "apds", "explosive-rounds", "tracer"];
  }

  // Grenade launchers use grenades (handled separately)
  if (subcat === "grenade-launcher") {
    return [];
  }

  // Missile/rocket launchers (handled separately)
  if (subcat === "rocket-launcher" || subcat === "missile-launcher") {
    return [];
  }

  // Bows and crossbows use arrows
  if (subcat === "bow" || subcat === "crossbow") {
    return [];
  }

  // Melee weapons don't use ammo
  if (["blade", "club", "exotic-melee", "unarmed"].includes(subcat)) {
    return [];
  }

  // Standard firearms use regular ammo types
  return [
    "apds",
    "explosive-rounds",
    "flechette-rounds",
    "gel-rounds",
    "hollow-points",
    "injection-darts",
    "regular-ammo",
    "stick-n-shock",
    "tracer",
  ];
}

/**
 * Check if ammo is compatible with a weapon subcategory
 */
function isAmmoCompatible(ammo: GearItemData, subcategory: string): boolean {
  const compatibleTypes = getCompatibleAmmoTypes(subcategory);

  // No compatible types means no ammo for this weapon
  if (compatibleTypes.length === 0) return false;

  // Check if ammo id matches any compatible type
  return compatibleTypes.some((type) => ammo.id.includes(type));
}

// =============================================================================
// TYPES
// =============================================================================

interface AmmunitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  weapon: Weapon;
  remaining: number;
  onPurchase: (ammo: GearItemData, quantity: number) => void;
}

// =============================================================================
// PURCHASED AMMUNITION TYPE (for display)
// =============================================================================

export interface PurchasedAmmunition {
  catalogId: string;
  name: string;
  quantity: number;
  cost: number;
  damageModifier?: string;
  apModifier?: number;
  availability: number;
  legality?: "restricted" | "forbidden";
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AmmunitionModal({
  isOpen,
  onClose,
  weapon,
  remaining,
  onPurchase,
}: AmmunitionModalProps) {
  const gearCatalog = useGear();
  const { ruleset } = useRuleset();
  const [selectedAmmo, setSelectedAmmo] = useState<GearItemData | null>(null);
  const [selectedPacks, setSelectedPacks] = useState(1);

  // Create modifiable item for capability system
  const modifiableItem: ModifiableItem = useMemo(
    () => ({ subcategory: weapon.subcategory || "" }),
    [weapon.subcategory]
  );

  // Check if weapon supports ammunition using capability system
  // Mount-based weapons (firearms) use ammunition
  const supportsAmmunition = useMemo(() => {
    if (!ruleset) return false;
    return isMountBased(modifiableItem, ruleset);
  }, [modifiableItem, ruleset]);

  // Get ammunition from catalog
  const ammunition = useMemo(() => {
    if (!gearCatalog?.ammunition) return [];
    if (!supportsAmmunition) return [];

    // Filter to ammunition with subcategory "ammunition"
    return gearCatalog.ammunition.filter(
      (ammo) => ammo.subcategory === "ammunition" && isAmmoCompatible(ammo, weapon.subcategory)
    );
  }, [gearCatalog, weapon.subcategory, supportsAmmunition]);

  // Calculate derived values
  const roundsPerBox = selectedAmmo ? getRoundsPerBox(selectedAmmo) : 10;
  const totalRounds = selectedAmmo ? selectedPacks * roundsPerBox : 0;
  const totalCost = selectedAmmo ? selectedPacks * selectedAmmo.cost : 0;
  const canAfford = totalCost <= remaining;

  // Handle purchase
  const handlePurchase = () => {
    if (!selectedAmmo || !canAfford) return;
    // Pass the number of boxes to the parent
    onPurchase(selectedAmmo, selectedPacks);
    setSelectedAmmo(null);
    setSelectedPacks(1);
  };

  // Reset selection when modal opens
  const handleClose = () => {
    setSelectedAmmo(null);
    setSelectedPacks(1);
    onClose();
  };

  // Check if weapon uses ammo - now using capability system
  const usesAmmo = supportsAmmunition;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="lg">
      {({ close }) => (
        <div className="flex max-h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Purchase Ammunition
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">For: {weapon.name}</p>
            </div>
            <button
              onClick={close}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!usesAmmo ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  This weapon doesn&apos;t use ammunition
                </p>
              </div>
            ) : ammunition.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  No compatible ammunition available
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Ammunition List */}
                <div className="space-y-2">
                  {ammunition.map((ammo) => {
                    const isSelected = selectedAmmo?.id === ammo.id;
                    const tooExpensive = ammo.cost > remaining;
                    const ammoRoundsPerBox = getRoundsPerBox(ammo);

                    return (
                      <div
                        key={ammo.id}
                        className={`rounded-lg border transition-all ${
                          isSelected
                            ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500 dark:bg-amber-900/20"
                            : tooExpensive
                              ? "border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800/50"
                              : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
                        }`}
                      >
                        {/* Ammo Header - Clickable */}
                        <button
                          onClick={() => {
                            if (isSelected) {
                              // Clicking again deselects
                              setSelectedAmmo(null);
                              setSelectedPacks(1);
                            } else {
                              setSelectedAmmo(ammo);
                              setSelectedPacks(1);
                            }
                          }}
                          disabled={tooExpensive}
                          className={`w-full p-3 text-left ${tooExpensive ? "cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                  {ammo.name}
                                </span>
                                {ammo.legality === "forbidden" && (
                                  <span className="flex items-center gap-0.5 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                                    <ShieldAlert className="h-3 w-3" />
                                    Forbidden
                                  </span>
                                )}
                                {ammo.legality === "restricted" && (
                                  <span className="flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                    <AlertTriangle className="h-3 w-3" />
                                    Restricted
                                  </span>
                                )}
                              </div>

                              {/* Stats */}
                              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                {(() => {
                                  const dmg = "damageModifier" in ammo ? ammo.damageModifier : null;
                                  return dmg ? <span>DV: {String(dmg)}</span> : null;
                                })()}
                                {(() => {
                                  const ap = "apModifier" in ammo ? ammo.apModifier : null;
                                  if (ap === null || ap === undefined) return null;
                                  return (
                                    <span>
                                      AP: {Number(ap) >= 0 ? "+" : ""}
                                      {String(ap)}
                                    </span>
                                  );
                                })()}
                                <span>Avail: {ammo.availability}</span>
                              </div>

                              {/* Description */}
                              {ammo.description && (
                                <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                  {ammo.description}
                                </p>
                              )}
                            </div>

                            {/* Price per box */}
                            <div className="ml-4 text-right">
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {formatCurrency(ammo.cost)}¥
                              </span>
                              <p className="text-[10px] text-zinc-400">
                                per {ammoRoundsPerBox} rounds
                              </p>
                            </div>
                          </div>
                        </button>

                        {/* Expanded Quantity Selector */}
                        {isSelected && (
                          <div
                            className="border-t border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-900/10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BulkQuantitySelector
                              packSize={ammoRoundsPerBox}
                              unitLabel="rounds"
                              pricePerPack={ammo.cost}
                              remaining={remaining}
                              selectedPacks={selectedPacks}
                              onPacksChange={setSelectedPacks}
                              packLabel="box"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Budget remaining:{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(remaining)}¥
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={!selectedAmmo || !canAfford}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
              >
                {selectedAmmo
                  ? `Purchase ${selectedPacks}× (${totalRounds} rounds) - ${formatCurrency(totalCost)}¥`
                  : "Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseModalRoot>
  );
}
