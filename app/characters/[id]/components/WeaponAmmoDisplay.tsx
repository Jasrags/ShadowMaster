"use client";

/**
 * WeaponAmmoDisplay - Ammunition display and management for weapons
 *
 * Displays:
 * - Current ammo count / capacity
 * - Loaded ammo type with effects
 * - Reload button
 * - Spare magazine selector
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Crosshair, RotateCcw, Package, ChevronDown, AlertCircle } from "lucide-react";
import type { Weapon } from "@/lib/types";
import type { WeaponAmmoState, MagazineItem, AmmunitionItem } from "@/lib/types/gear-state";

// =============================================================================
// TYPES
// =============================================================================

interface WeaponAmmoDisplayProps {
  /** The weapon to display ammo for */
  weapon: Weapon;
  /** Available ammunition in inventory */
  availableAmmo?: AmmunitionItem[];
  /** Callback when reload is requested */
  onReload?: (ammoItemId: string, quantity?: number) => void;
  /** Callback when magazine swap is requested */
  onSwapMagazine?: (magazineId: string) => void;
  /** Callback when unload is requested */
  onUnload?: () => void;
  /** Whether actions are disabled */
  disabled?: boolean;
  /** Compact display mode */
  compact?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

function getAmmoState(weapon: Weapon): WeaponAmmoState {
  // Use explicit ammoState if available, otherwise construct from legacy fields
  if (weapon.ammoState) {
    return weapon.ammoState;
  }

  return {
    loadedAmmoTypeId: null,
    currentRounds: weapon.currentAmmo ?? 0,
    magazineCapacity: weapon.ammoCapacity ?? 0,
  };
}

function getAmmoBarColor(current: number, max: number): string {
  if (max === 0) return "bg-muted";
  const percentage = (current / max) * 100;
  if (percentage <= 0) return "bg-red-500";
  if (percentage <= 25) return "bg-orange-500";
  if (percentage <= 50) return "bg-yellow-500";
  return "bg-emerald-500";
}

function getAmmoTypeLabel(ammoType: string | null, ammoList?: AmmunitionItem[]): string {
  if (!ammoType) return "Empty";

  // Try to find the ammo name from the list
  const ammoItem = ammoList?.find(a => a.catalogId === ammoType);
  if (ammoItem) {
    return ammoItem.name;
  }

  // Format the ID as a readable name
  return ammoType
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getAmmoModifiers(ammoType: string | null, ammoList?: AmmunitionItem[]): { damage: number; ap: number } | null {
  if (!ammoType || !ammoList) return null;

  const ammoItem = ammoList.find(a => a.catalogId === ammoType);
  if (!ammoItem || (ammoItem.damageModifier === 0 && ammoItem.apModifier === 0)) {
    return null;
  }

  return {
    damage: ammoItem.damageModifier,
    ap: ammoItem.apModifier,
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WeaponAmmoDisplay({
  weapon,
  availableAmmo = [],
  onReload,
  onSwapMagazine,
  onUnload,
  disabled = false,
  compact = false,
}: WeaponAmmoDisplayProps) {
  const [showReloadMenu, setShowReloadMenu] = useState(false);
  const [showMagazineMenu, setShowMagazineMenu] = useState(false);
  const [reloadMenuPosition, setReloadMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [magazineMenuPosition, setMagazineMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const reloadButtonRef = useRef<HTMLButtonElement>(null);
  const magazineButtonRef = useRef<HTMLButtonElement>(null);

  // Update reload menu position when showing
  // Note: Using position:fixed, so coordinates are relative to viewport (no scroll offset needed)
  useEffect(() => {
    if (showReloadMenu && reloadButtonRef.current) {
      const rect = reloadButtonRef.current.getBoundingClientRect();
      setReloadMenuPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 150),
      });
    }
  }, [showReloadMenu]);

  // Update magazine menu position when showing
  // Note: Using position:fixed, so coordinates are relative to viewport (no scroll offset needed)
  useEffect(() => {
    if (showMagazineMenu && magazineButtonRef.current) {
      const rect = magazineButtonRef.current.getBoundingClientRect();
      setMagazineMenuPosition({
        top: rect.bottom + 4, // Just below the button
        left: rect.right - 192, // 192px = w-48, align to right edge
        width: 192,
      });
    }
  }, [showMagazineMenu]);

  // Close menus when clicking outside
  useEffect(() => {
    if (!showReloadMenu && !showMagazineMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideReloadButton = reloadButtonRef.current?.contains(target);
      const isInsideMagazineButton = magazineButtonRef.current?.contains(target);
      const isInsidePortalMenu = (e.target as HTMLElement).closest?.('.fixed.z-\\[9999\\]');

      if (!isInsideReloadButton && !isInsideMagazineButton && !isInsidePortalMenu) {
        setShowReloadMenu(false);
        setShowMagazineMenu(false);
      }
    };

    // Use setTimeout to avoid the click that opened the menu from immediately closing it
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReloadMenu, showMagazineMenu]);

  const ammoState = getAmmoState(weapon);
  const { currentRounds, magazineCapacity, loadedAmmoTypeId } = ammoState;

  // Filter compatible ammo (based on weapon subcategory) - must be called before any early returns
  const compatibleAmmo = useMemo(() => {
    if (!weapon.subcategory) return availableAmmo;
    return availableAmmo.filter(a => a.caliber === weapon.subcategory);
  }, [availableAmmo, weapon.subcategory]);

  // Check if weapon uses ammo
  const usesAmmo = magazineCapacity > 0;
  if (!usesAmmo) {
    return null;
  }

  // Calculate percentage
  const ammoPercentage = magazineCapacity > 0 ? (currentRounds / magazineCapacity) * 100 : 0;
  const isEmpty = currentRounds === 0;
  const isFull = currentRounds >= magazineCapacity;

  // Get spare magazines
  const spareMagazines = weapon.spareMagazines || [];
  const hasSpares = spareMagazines.length > 0;

  // Ammo modifiers
  const modifiers = getAmmoModifiers(loadedAmmoTypeId, availableAmmo);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Crosshair className="w-3 h-3 text-muted-foreground" />
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getAmmoBarColor(currentRounds, magazineCapacity)}`}
            style={{ width: `${ammoPercentage}%` }}
          />
        </div>
        <span className={`text-xs font-mono ${isEmpty ? "text-red-400" : "text-muted-foreground"}`}>
          {currentRounds}/{magazineCapacity}
        </span>
        {modifiers && (
          <span className="text-[10px] text-amber-400">
            {modifiers.damage !== 0 && `${modifiers.damage > 0 ? "+" : ""}${modifiers.damage}DV`}
            {modifiers.ap !== 0 && ` ${modifiers.ap > 0 ? "+" : ""}${modifiers.ap}AP`}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg border border-border bg-card/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-foreground">Ammunition</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-mono ${isEmpty ? "text-red-400" : "text-foreground"}`}>
            {currentRounds} / {magazineCapacity}
          </span>
        </div>
      </div>

      {/* Ammo bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-300 ${getAmmoBarColor(currentRounds, magazineCapacity)}`}
          style={{ width: `${ammoPercentage}%` }}
        />
      </div>

      {/* Loaded ammo type and modifiers */}
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="text-muted-foreground">
          {getAmmoTypeLabel(loadedAmmoTypeId, availableAmmo)}
        </span>
        {modifiers && (
          <div className="flex gap-2 text-amber-400">
            {modifiers.damage !== 0 && (
              <span>{modifiers.damage > 0 ? "+" : ""}{modifiers.damage} DV</span>
            )}
            {modifiers.ap !== 0 && (
              <span>{modifiers.ap > 0 ? "+" : ""}{modifiers.ap} AP</span>
            )}
          </div>
        )}
      </div>

      {/* Empty warning */}
      {isEmpty && (
        <div className="flex items-center gap-2 p-2 mb-3 rounded bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-xs text-red-400">Weapon empty - reload required</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {/* Reload button */}
        {onReload && compatibleAmmo.length > 0 && (
          <div className="flex-1">
            <button
              ref={reloadButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowReloadMenu(!showReloadMenu);
              }}
              disabled={disabled || isFull}
              className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                disabled || isFull
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              Reload
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Reload menu - rendered via portal to avoid overflow clipping */}
            {/* Only render portal when position is calculated (width > 0) */}
            {showReloadMenu && typeof document !== "undefined" && reloadMenuPosition.width > 0 && createPortal(
              <div
                className="fixed z-[9999] p-1 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl"
                style={{
                  top: reloadMenuPosition.top,
                  left: reloadMenuPosition.left,
                  minWidth: reloadMenuPosition.width,
                }}
              >
                {compatibleAmmo.map(ammo => (
                  <button
                    key={ammo.id}
                    onClick={() => {
                      onReload(ammo.id);
                      setShowReloadMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded text-left hover:bg-zinc-800 transition-colors"
                  >
                    <div>
                      <div className="text-xs text-zinc-100">{ammo.name}</div>
                      <div className="text-[10px] text-zinc-400">
                        {ammo.quantity} rounds
                        {ammo.damageModifier !== 0 && ` | ${ammo.damageModifier > 0 ? "+" : ""}${ammo.damageModifier} DV`}
                        {ammo.apModifier !== 0 && ` | ${ammo.apModifier > 0 ? "+" : ""}${ammo.apModifier} AP`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>,
              document.body
            )}
          </div>
        )}

        {/* Magazine swap button */}
        {onSwapMagazine && hasSpares && (
          <div>
            <button
              ref={magazineButtonRef}
              onClick={() => setShowMagazineMenu(!showMagazineMenu)}
              disabled={disabled}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                disabled
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              <Package className="w-3 h-3" />
              Swap
              <span className="text-[10px] text-muted-foreground">({spareMagazines.length})</span>
            </button>

            {/* Magazine menu - rendered via portal to avoid overflow clipping */}
            {showMagazineMenu && typeof document !== "undefined" && magazineMenuPosition.width > 0 && createPortal(
              <div
                className="fixed z-[9999] w-48 p-1 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl"
                style={{
                  top: magazineMenuPosition.top,
                  left: magazineMenuPosition.left,
                }}
              >
                {spareMagazines.map(mag => (
                  <button
                    key={mag.id}
                    onClick={() => {
                      onSwapMagazine(mag.id);
                      setShowMagazineMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded text-left hover:bg-zinc-800 transition-colors"
                  >
                    <div className="text-xs text-zinc-100">
                      {mag.name || "Spare Magazine"}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {mag.currentRounds}/{mag.capacity}
                    </div>
                  </button>
                ))}
              </div>,
              document.body
            )}
          </div>
        )}

        {/* Unload button */}
        {onUnload && currentRounds > 0 && (
          <button
            onClick={onUnload}
            disabled={disabled}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              disabled
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border"
            }`}
          >
            Unload
          </button>
        )}
      </div>

      {/* No compatible ammo warning */}
      {onReload && compatibleAmmo.length === 0 && (
        <p className="text-[10px] text-muted-foreground mt-2">
          No compatible ammunition in inventory
        </p>
      )}
    </div>
  );
}
