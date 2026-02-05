"use client";

/**
 * WeaponRow
 *
 * Compact single-line weapon display following the skills pattern.
 * Collapsed: Icon, name, subcategory, key stats inline, cost, remove
 * Expanded: Full stats, wireless bonus, mods, ammo sections
 */

import { useState, useMemo } from "react";
import type { Weapon, ItemLegality, MergedRuleset } from "@/lib/types";
import {
  canAcceptModifications,
  isMountBased,
  type ModifiableItem,
} from "@/lib/rules/modifications";
import { LegalityBadge } from "@/components/creation/shared/LegalityBadge";
import { ChevronDown, ChevronRight, X, Wifi, Plus } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

// Subcategory display names
const SUBCATEGORY_LABELS: Record<string, string> = {
  holdout: "Holdout",
  "light-pistol": "Lt. Pistol",
  "heavy-pistol": "Hvy. Pistol",
  "machine-pistol": "Machine Pistol",
  taser: "Taser",
  smg: "SMG",
  "assault-rifle": "Assault Rifle",
  rifle: "Rifle",
  shotgun: "Shotgun",
  "sniper-rifle": "Sniper",
  "light-machine-gun": "LMG",
  "medium-machine-gun": "MMG",
  "heavy-machine-gun": "HMG",
  "assault-cannon": "Assault Cannon",
  "grenade-launcher": "Grenade Launcher",
  "missile-launcher": "Missile Launcher",
  blade: "Blade",
  club: "Club",
  "exotic-melee": "Exotic",
  unarmed: "Unarmed",
  grenade: "Grenade",
  throwing: "Throwing",
};

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

  if (weapon.modifications) {
    for (const mod of weapon.modifications) {
      if ("concealabilityModifier" in mod) {
        conceal += (mod as { concealabilityModifier?: number }).concealabilityModifier || 0;
      }
    }
  }

  return conceal;
}

function getSubcategoryLabel(subcategory: string | undefined): string {
  if (!subcategory) return "";
  const key = subcategory.toLowerCase();
  return SUBCATEGORY_LABELS[key] || subcategory.replace(/-/g, " ");
}

function getAvailabilityDisplay(availability: number, legality?: ItemLegality): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

// =============================================================================
// TYPES
// =============================================================================

interface WeaponRowProps {
  weapon: Weapon;
  ruleset: MergedRuleset | null;
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
  ruleset,
  onRemove,
  onAddMod,
  onRemoveMod,
  onAddAmmo,
  onRemoveAmmo,
}: WeaponRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const conceal = getConcealability(weapon);

  // Create modifiable item for capability system
  const modifiableItem: ModifiableItem = useMemo(
    () => ({ subcategory: weapon.subcategory || "" }),
    [weapon.subcategory]
  );

  // Use capability system to determine if weapon supports mods and ammo
  const supportsMods = useMemo(() => {
    if (!ruleset) return false;
    return canAcceptModifications(modifiableItem, ruleset);
  }, [modifiableItem, ruleset]);

  const supportsAmmo = useMemo(() => {
    if (!ruleset) return false;
    // Mount-based weapons (firearms) use ammunition
    return isMountBased(modifiableItem, ruleset);
  }, [modifiableItem, ruleset]);

  // Check if weapon has smartgun modification installed
  const smartgunMod = weapon.modifications?.find(
    (mod) => mod.catalogId === "smartgun-internal" || mod.catalogId === "smartgun-external"
  );

  // Weapon has wireless if it has its own wireless bonus OR has a smartgun mod
  const hasWireless = Boolean(weapon.wirelessBonus) || Boolean(smartgunMod);
  const modCost = weapon.modifications?.reduce((sum, m) => sum + m.cost, 0) || 0;
  const ammoCost =
    weapon.purchasedAmmunition?.reduce((sum, a) => sum + a.cost * a.quantity, 0) || 0;
  const totalCost = weapon.cost * weapon.quantity + modCost + ammoCost;

  // Counts
  const modCount = weapon.modifications?.length || 0;
  const ammoCount = weapon.purchasedAmmunition?.length || 0;
  const totalRounds =
    weapon.purchasedAmmunition?.reduce((sum, a) => sum + a.quantity * (a.roundsPerBox || 10), 0) ||
    0;

  // Check if expandable - all weapons have stats to show
  const hasExpandableContent = true;

  // Legality
  const legality = weapon.legality;

  return (
    <div>
      {/* Compact Single-Line Header */}
      <div className="flex items-center gap-2 py-2">
        {/* Expand/Collapse Button */}
        {hasExpandableContent ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-4 shrink-0" />
        )}

        {/* Weapon Name */}
        <span
          className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate flex-1 min-w-0"
          title={weapon.name}
        >
          {weapon.name}
        </span>

        {/* Quantity Badge */}
        {weapon.quantity > 1 && (
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
            x{weapon.quantity}
          </span>
        )}

        {/* Wireless indicator */}
        {hasWireless && <Wifi className="h-3.5 w-3.5 shrink-0 text-blue-500" />}

        {/* Cost */}
        <span className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100 shrink-0">
          ¥{formatCurrency(totalCost)}
        </span>

        {/* Mod count badge (only if has mods) */}
        {modCount > 0 && (
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 shrink-0">
            [{modCount} mod{modCount !== 1 ? "s" : ""}]
          </span>
        )}

        {/* Ammo badge (only if has ammo) */}
        {ammoCount > 0 && (
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 shrink-0">
            [{totalRounds} rds]
          </span>
        )}

        {/* Legality badge */}
        <LegalityBadge legality={legality} availability={weapon.availability} />

        {/* Separator */}
        <div className="mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-600 shrink-0" />

        {/* Remove Button */}
        <button
          onClick={() => weapon.id && onRemove(weapon.id)}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          title="Remove weapon"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800 py-3 ml-6 space-y-3">
          {/* Type */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {getSubcategoryLabel(weapon.subcategory)}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span>
              <span className="text-zinc-400 dark:text-zinc-500">Dmg</span>{" "}
              <span className="text-zinc-700 dark:text-zinc-300">{weapon.damage}</span>
            </span>
            <span>
              <span className="text-zinc-400 dark:text-zinc-500">AP</span>{" "}
              <span className="text-zinc-700 dark:text-zinc-300">{weapon.ap}</span>
            </span>
            <span>
              <span className="text-zinc-400 dark:text-zinc-500">Mode</span>{" "}
              <span className="text-zinc-700 dark:text-zinc-300">{formatModes(weapon.mode)}</span>
            </span>
            <span>
              <span className="text-zinc-400 dark:text-zinc-500">RC</span>{" "}
              <span className="text-zinc-700 dark:text-zinc-300">{weapon.recoil || "-"}</span>
            </span>
            <span>
              <span className="text-zinc-400 dark:text-zinc-500">Acc</span>{" "}
              <span className="text-zinc-700 dark:text-zinc-300">{weapon.accuracy || "-"}</span>
            </span>
            <span>
              <span className="text-zinc-400 dark:text-zinc-500">Conceal</span>{" "}
              <span className="text-zinc-700 dark:text-zinc-300">
                {conceal >= 0 ? `+${conceal}` : conceal}
              </span>
            </span>
            <span>
              <span className="text-zinc-400 dark:text-zinc-500">Avail</span>{" "}
              <span
                className={
                  legality === "forbidden"
                    ? "text-red-600 dark:text-red-400"
                    : legality === "restricted"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-zinc-700 dark:text-zinc-300"
                }
              >
                {getAvailabilityDisplay(weapon.availability || 0, legality)}
              </span>
            </span>
          </div>

          {/* Wireless Bonus */}
          {hasWireless && (
            <div className="flex items-start gap-2 text-xs">
              <Wifi className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-zinc-500 dark:text-zinc-400">
                {weapon.wirelessBonus ||
                  (smartgunMod
                    ? "+1/+2 dice pool (gear/cyberware smartlink). Eject clip and change fire modes as Free Actions."
                    : "")}
              </span>
            </div>
          )}

          {/* Modifications */}
          {supportsMods && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Mods
                </span>
                {onAddMod && (
                  <button
                    onClick={() => weapon.id && onAddMod(weapon.id)}
                    className="flex items-center gap-0.5 text-[10px] text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                )}
              </div>
              {modCount > 0 ? (
                <div className="space-y-1">
                  {weapon.modifications?.map((mod, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        • {mod.name}
                        {mod.mount && (
                          <span className="text-zinc-400 dark:text-zinc-500"> ({mod.mount})</span>
                        )}
                        {mod.isBuiltIn && (
                          <span className="text-zinc-400 dark:text-zinc-500 italic"> built-in</span>
                        )}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-400">¥{formatCurrency(mod.cost)}</span>
                        {!mod.isBuiltIn && onRemoveMod && (
                          <button
                            onClick={() => weapon.id && onRemoveMod(weapon.id, idx)}
                            className="p-0.5 text-zinc-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">None</p>
              )}
            </div>
          )}

          {/* Ammunition */}
          {supportsAmmo && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Ammo
                </span>
                {onAddAmmo && (
                  <button
                    onClick={() => weapon.id && onAddAmmo(weapon.id)}
                    className="flex items-center gap-0.5 text-[10px] text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                )}
              </div>
              {ammoCount > 0 ? (
                <div className="space-y-1">
                  {weapon.purchasedAmmunition?.map((ammo, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        • {ammo.name}
                        <span className="text-zinc-400 dark:text-zinc-500">
                          {" "}
                          ({ammo.quantity * (ammo.roundsPerBox || 10)} rds)
                        </span>
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-400">
                          ¥{formatCurrency(ammo.cost * ammo.quantity)}
                        </span>
                        {onRemoveAmmo && (
                          <button
                            onClick={() => weapon.id && onRemoveAmmo(weapon.id, idx)}
                            className="p-0.5 text-zinc-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">None</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
