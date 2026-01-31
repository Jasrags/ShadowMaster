"use client";

/**
 * AmmunitionModal
 *
 * Two-column modal for purchasing ammunition for a specific weapon.
 * Left pane: Ammo list sorted by name
 * Right pane: Selected ammo details with quantity selector
 *
 * Follows the SkillModal/SpellModal pattern for consistent UX.
 */

import { useMemo, useState, useCallback } from "react";
import { useGear, useRuleset, type GearItemData } from "@/lib/rules/RulesetContext";
import { isMountBased, type ModifiableItem } from "@/lib/rules/modifications";
import type { Weapon } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { ShieldAlert, AlertTriangle, Package, Check } from "lucide-react";
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
    return ["taser-rounds"];
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
    "hollow-point",
    "injection-rounds",
    "regular-rounds",
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
// AMMO LIST ITEM
// =============================================================================

function AmmoListItem({
  ammo,
  isSelected,
  canAfford,
  onClick,
}: {
  ammo: GearItemData;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
}) {
  const roundsPerBox = getRoundsPerBox(ammo);

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
        isSelected
          ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          : !canAfford
            ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
            : "rounded-md text-zinc-700 hover:outline hover:outline-1 hover:outline-amber-400 dark:text-zinc-300 dark:hover:outline-amber-500"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={!canAfford ? "line-through" : ""}>{ammo.name}</span>
        {ammo.legality === "forbidden" && (
          <span className="flex items-center gap-0.5 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
            F
          </span>
        )}
        {ammo.legality === "restricted" && (
          <span className="flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            R
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          {formatCurrency(ammo.cost)}¥/{roundsPerBox}
        </span>
        {!canAfford && <Check className="h-4 w-4 text-emerald-500" />}
      </div>
    </button>
  );
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
  const [selectedAmmoId, setSelectedAmmoId] = useState<string | null>(null);
  const [selectedPacks, setSelectedPacks] = useState(1);
  const [addedThisSession, setAddedThisSession] = useState(0);

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
    return gearCatalog.ammunition
      .filter(
        (ammo) => ammo.subcategory === "ammunition" && isAmmoCompatible(ammo, weapon.subcategory)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gearCatalog, weapon.subcategory, supportsAmmunition]);

  // Get selected ammo data
  const selectedAmmo = useMemo(() => {
    if (!selectedAmmoId) return null;
    return ammunition.find((a) => a.id === selectedAmmoId) || null;
  }, [ammunition, selectedAmmoId]);

  // Calculate derived values
  const roundsPerBox = selectedAmmo ? getRoundsPerBox(selectedAmmo) : 10;
  const totalRounds = selectedAmmo ? selectedPacks * roundsPerBox : 0;
  const totalCost = selectedAmmo ? selectedPacks * selectedAmmo.cost : 0;
  const canAfford = totalCost <= remaining;

  // Full reset on close
  const resetState = useCallback(() => {
    setSelectedAmmoId(null);
    setSelectedPacks(1);
    setAddedThisSession(0);
  }, []);

  // Partial reset after adding (preserves nothing since there's no filtering)
  const resetForNextAmmo = useCallback(() => {
    setSelectedAmmoId(null);
    setSelectedPacks(1);
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Handle purchase
  const handlePurchase = useCallback(() => {
    if (!selectedAmmo || !canAfford) return;
    // Pass the number of boxes to the parent
    onPurchase(selectedAmmo, selectedPacks);
    setAddedThisSession((prev) => prev + 1);
    resetForNextAmmo();
  }, [selectedAmmo, canAfford, selectedPacks, onPurchase, resetForNextAmmo]);

  // Check if weapon uses ammo - now using capability system
  const usesAmmo = supportsAmmunition;

  // If weapon doesn't use ammo, show a simplified modal
  if (!usesAmmo) {
    return (
      <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="md">
        {({ close }) => (
          <>
            <ModalHeader title="Purchase Ammunition" onClose={close}>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{weapon.name}</span>
            </ModalHeader>

            <ModalBody>
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  No Ammunition Required
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  This weapon doesn&apos;t use ammunition.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <div />
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Close
              </button>
            </ModalFooter>
          </>
        )}
      </BaseModalRoot>
    );
  }

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Purchase Ammunition" onClose={close}>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{weapon.name}</span>
          </ModalHeader>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane: Ammo List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {ammunition.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                      No compatible ammunition available
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {/* Sticky category header */}
                    <div className="sticky top-0 z-10 bg-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      Available Ammunition
                    </div>
                    {ammunition.map((ammo) => (
                      <AmmoListItem
                        key={ammo.id}
                        ammo={ammo}
                        isSelected={selectedAmmoId === ammo.id}
                        canAfford={ammo.cost <= remaining}
                        onClick={() => {
                          setSelectedAmmoId(ammo.id);
                          setSelectedPacks(1);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Pane: Ammo Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedAmmo ? (
                  <div className="space-y-6">
                    {/* Ammo Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedAmmo.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                        <span>{roundsPerBox} rounds per box</span>
                        <span>Avail: {selectedAmmo.availability}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedAmmo.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedAmmo.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Modifiers
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400">Damage</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {"damageModifier" in selectedAmmo
                              ? String(selectedAmmo.damageModifier)
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                          <span className="text-zinc-500 dark:text-zinc-400">AP</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {"apModifier" in selectedAmmo
                              ? `${Number(selectedAmmo.apModifier) >= 0 ? "+" : ""}${selectedAmmo.apModifier}`
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Legality Warning */}
                    {(selectedAmmo.legality === "restricted" ||
                      selectedAmmo.legality === "forbidden") && (
                      <div
                        className={`rounded-lg p-3 ${
                          selectedAmmo.legality === "forbidden"
                            ? "bg-red-50 dark:bg-red-900/20"
                            : "bg-amber-50 dark:bg-amber-900/20"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 text-sm font-medium ${
                            selectedAmmo.legality === "forbidden"
                              ? "text-red-700 dark:text-red-300"
                              : "text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {selectedAmmo.legality === "forbidden" ? (
                            <ShieldAlert className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          {selectedAmmo.legality === "forbidden" ? "Forbidden" : "Restricted"}
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            selectedAmmo.legality === "forbidden"
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {selectedAmmo.legality === "forbidden"
                            ? "Illegal to own. Possession triggers serious legal consequences."
                            : "Requires a license. May draw law enforcement attention."}
                        </p>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <BulkQuantitySelector
                      packSize={roundsPerBox}
                      unitLabel="rounds"
                      pricePerPack={selectedAmmo.cost}
                      remaining={remaining}
                      selectedPacks={selectedPacks}
                      onPacksChange={setSelectedPacks}
                      packLabel="box"
                    />

                    {/* Cost Indicator */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Total Cost
                        </span>
                        <span
                          className={`font-semibold ${
                            canAfford
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(totalCost)}¥
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {totalRounds} rounds ({selectedPacks}{" "}
                        {selectedPacks === 1 ? "box" : "boxes"})
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    <Package className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select ammunition from the list</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span className="mr-2 text-emerald-600 dark:text-emerald-400">
                  {addedThisSession} purchased
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
                disabled={!selectedAmmo || !canAfford}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedAmmo && canAfford
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add Ammo
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
