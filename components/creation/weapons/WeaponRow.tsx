"use client";

/**
 * WeaponRow
 *
 * Displays a purchased weapon in collapsed or expanded state.
 * Collapsed: Shows name, cost, conceal, wireless icon, remove button
 * Expanded: Shows full stats, wireless bonus, mods, ammo sections
 */

import { useState } from "react";
import type { Weapon } from "@/lib/types";
import {
  ChevronDown,
  ChevronRight,
  X,
  Wifi,
  Plus,
} from "lucide-react";

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

function formatModes(modes: string[] | undefined): string {
  if (!modes || modes.length === 0) return "-";
  return modes.join("/");
}

function getConcealability(weapon: Weapon): number {
  // Base concealability by weapon category
  // Smaller weapons are easier to conceal (positive or 0), larger are harder (negative)
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

  const subcategory = weapon.subcategory?.toLowerCase() || "";
  let conceal = baseConceal[subcategory] ?? -2;

  // Add modifier from modifications (holsters, etc.)
  if (weapon.modifications) {
    for (const mod of weapon.modifications) {
      if ("concealabilityModifier" in mod) {
        conceal += (mod as { concealabilityModifier?: number }).concealabilityModifier || 0;
      }
    }
  }

  return conceal;
}

// =============================================================================
// TYPES
// =============================================================================

interface WeaponRowProps {
  weapon: Weapon;
  onRemove: (id: string) => void;
  onAddMod?: (weaponId: string) => void;
  onRemoveMod?: (weaponId: string, modIndex: number) => void;
  onAddAmmo?: (weaponId: string) => void;
  onRemoveAmmo?: (weaponId: string, ammoIndex: number) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WeaponRow({
  weapon,
  onRemove,
  onAddMod,
  onRemoveMod,
  onAddAmmo,
  onRemoveAmmo,
}: WeaponRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const conceal = getConcealability(weapon);
  const hasWireless = true; // Most SR5 weapons are wireless-capable
  const modCost = weapon.modifications?.reduce((sum, m) => sum + m.cost, 0) || 0;
  const ammoCost = weapon.purchasedAmmunition?.reduce((sum, a) => sum + a.cost * a.quantity, 0) || 0;
  const totalCost = weapon.cost + modCost + ammoCost;

  // Count installed mods and ammo
  const modCount = weapon.modifications?.length || 0;
  const ammoCount = weapon.purchasedAmmunition?.length || 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Collapsed Header */}
      <div className="flex w-full items-center gap-3 p-3">
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-1 items-center gap-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded -m-2 p-2"
        >
          {/* Expand/Collapse Icon */}
          <div className="text-zinc-400">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>

          {/* Weapon Name & Quick Stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {weapon.name}
              </span>
              {hasWireless && (
                <Wifi className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
              )}
              {modCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-1.5 py-0.5 rounded">
                  {modCount} mod{modCount !== 1 ? "s" : ""}
                </span>
              )}
              {ammoCount > 0 && (
                <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded">
                  {ammoCount} ammo
                </span>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{weapon.damage}</span>
              <span>AP {weapon.ap}</span>
              <span>Conceal {conceal >= 0 ? `+${conceal}` : conceal}</span>
            </div>
          </div>

          {/* Cost */}
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex-shrink-0">
            {formatCurrency(totalCost)}¥
          </span>
        </button>

        {/* Remove Button (outside expand button) */}
        <button
          onClick={() => {
            if (weapon.id) onRemove(weapon.id);
          }}
          className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded Detail Flyout */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-4 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Damage</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {weapon.damage}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">AP</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {weapon.ap}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Mode</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formatModes(weapon.mode)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">RC</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {weapon.recoil || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Accuracy</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {weapon.accuracy || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Conceal</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {conceal >= 0 ? `+${conceal}` : conceal}
                </span>
              </div>
              {weapon.reach !== undefined && weapon.reach > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Reach</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {weapon.reach}
                  </span>
                </div>
              )}
            </div>

            {/* Wireless Bonus */}
            {hasWireless && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <Wifi className="h-4 w-4" />
                  Wireless Bonus
                </div>
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  Eject clip as a Free Action. +1 Accuracy when connected to a smartgun system.
                </p>
                <p className="mt-1 text-xs text-blue-500/70 dark:text-blue-500/50">
                  Warning: Can be targeted by hackers
                </p>
              </div>
            )}

            {/* Installed Modifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Modifications
                </span>
                {onAddMod && (
                  <button
                    onClick={() => weapon.id && onAddMod(weapon.id)}
                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    <Plus className="h-3 w-3" />
                    Add Mod
                  </button>
                )}
              </div>
              {weapon.modifications && weapon.modifications.length > 0 ? (
                <div className="space-y-1">
                  {weapon.modifications.map((mod, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-zinc-50 dark:bg-zinc-800 px-2 py-1.5 text-sm"
                    >
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {mod.name}
                        {mod.mount && (
                          <span className="ml-1.5 text-xs text-zinc-400">
                            ({mod.mount})
                          </span>
                        )}
                        {mod.isBuiltIn && (
                          <span className="ml-1.5 text-[10px] bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400 px-1 py-0.5 rounded">
                            built-in
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">
                          {formatCurrency(mod.cost)}¥
                        </span>
                        {!mod.isBuiltIn && onRemoveMod && (
                          <button
                            onClick={() => weapon.id && onRemoveMod(weapon.id, idx)}
                            className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                  No modifications installed
                </p>
              )}
            </div>

            {/* Ammunition */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Ammunition
                </span>
                {onAddAmmo && (
                  <button
                    onClick={() => weapon.id && onAddAmmo(weapon.id)}
                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    <Plus className="h-3 w-3" />
                    Add Ammo
                  </button>
                )}
              </div>
              {weapon.purchasedAmmunition && weapon.purchasedAmmunition.length > 0 ? (
                <div className="space-y-1">
                  {weapon.purchasedAmmunition.map((ammo, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-zinc-50 dark:bg-zinc-800 px-2 py-1.5 text-sm"
                    >
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {ammo.name}
                        <span className="ml-1.5 text-xs text-zinc-400">
                          ×{ammo.quantity}
                        </span>
                        {ammo.roundsPerBox && (
                          <span className="ml-1 text-[10px] text-zinc-400">
                            ({ammo.quantity * ammo.roundsPerBox} rounds)
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">
                          {formatCurrency(ammo.cost * ammo.quantity)}¥
                        </span>
                        {onRemoveAmmo && (
                          <button
                            onClick={() => weapon.id && onRemoveAmmo(weapon.id, idx)}
                            className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                  No ammunition purchased
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
