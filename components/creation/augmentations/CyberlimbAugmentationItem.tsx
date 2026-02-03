"use client";

/**
 * CyberlimbAugmentationItem
 *
 * Displays a cyberlimb with expandable details showing enhancements, accessories, and weapons.
 * Handles the complex structure of cyberlimbs with their three subsections.
 */

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Shield, X } from "lucide-react";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";
import { formatCurrency, formatEssence, GRADE_DISPLAY } from "./utils";

export interface CyberlimbAugmentationItemProps {
  item: CyberlimbItem;
  onRemove: () => void;
  onAddEnhancement?: () => void;
  onRemoveEnhancement?: (enhancementIndex: number) => void;
  onAddAccessory?: () => void;
  onRemoveAccessory?: (accessoryIndex: number) => void;
  onAddWeapon?: () => void;
  onRemoveWeapon?: (weaponIndex: number) => void;
}

export function CyberlimbAugmentationItem({
  item,
  onRemove,
  onAddEnhancement,
  onRemoveEnhancement,
  onAddAccessory,
  onRemoveAccessory,
  onAddWeapon,
  onRemoveWeapon,
}: CyberlimbAugmentationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate derived values - handle missing base values gracefully
  // Cyberlimbs have base 3 STR/AGI by SR5 rules
  // Formula: base (3) + custom (default 0) + enhancement rating
  const baseStr = item.baseStrength ?? 3;
  const baseAgi = item.baseAgility ?? 3;
  const customStr = item.customStrength ?? 0;
  const customAgi = item.customAgility ?? 0;

  // Find enhancement bonuses from the enhancements array
  const strEnhancement = item.enhancements?.find((e) => e.enhancementType === "strength");
  const agiEnhancement = item.enhancements?.find((e) => e.enhancementType === "agility");
  const armorEnhancement = item.enhancements?.find((e) => e.enhancementType === "armor");

  const effectiveStr = baseStr + customStr + (strEnhancement?.rating ?? 0);
  const effectiveAgi = baseAgi + customAgi + (agiEnhancement?.rating ?? 0);
  const armorBonus = armorEnhancement?.rating ?? 0;
  const remainingCapacity = (item.baseCapacity || item.capacity || 0) - (item.capacityUsed || 0);
  const totalCapacity = item.baseCapacity || item.capacity || 0;

  // Count mods
  const enhancementCount = item.enhancements?.length || 0;
  const accessoryCount = item.accessories?.length || 0;
  const weaponCount = item.weapons?.length || 0;
  const totalMods = enhancementCount + accessoryCount + weaponCount;

  // Format location display
  const locationDisplay = useMemo(() => {
    const loc = item.location.replace(/-/g, " ");
    return loc.charAt(0).toUpperCase() + loc.slice(1);
  }, [item.location]);

  return (
    <div>
      {/* Compact Single-Line Header */}
      <div className="flex items-center gap-1.5 py-2">
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Name */}
        <span
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate flex-1"
          title={item.name}
        >
          {item.name}
        </span>

        {/* Essence */}
        <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400 shrink-0">
          {formatEssence(item.essenceCost)} ESS
        </span>

        {/* Cost */}
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 shrink-0">
          ¥{formatCurrency(item.cost)}
        </span>

        {/* Mod count badge (only if has mods) */}
        {totalMods > 0 && (
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 shrink-0">
            [{totalMods} mod{totalMods !== 1 ? "s" : ""}]
          </span>
        )}

        {/* Separator */}
        <div className="mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded Detail View */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800 py-3 ml-6 space-y-3">
          {/* Grade & Location */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {GRADE_DISPLAY[item.grade]} • {locationDisplay} •{" "}
            {item.appearance === "synthetic" ? "Synthetic" : "Obvious"}
          </div>

          {/* Limb Attributes - inline */}
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              STR {effectiveStr}
            </span>
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              AGI {effectiveAgi}
            </span>
            {armorBonus > 0 && (
              <span className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                <Shield className="h-3 w-3" />+{armorBonus} Armor
              </span>
            )}
          </div>

          {/* Enhancements */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Enhancements ({enhancementCount})
              </span>
              {remainingCapacity > 0 && onAddEnhancement && (
                <button
                  onClick={onAddEnhancement}
                  className="flex items-center gap-0.5 text-[10px] text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              )}
            </div>
            {item.enhancements && item.enhancements.length > 0 ? (
              <div className="space-y-1">
                {item.enhancements.map((enh, idx) => (
                  <div
                    key={`${enh.catalogId}-${idx}`}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-600 dark:text-zinc-400">
                      • {enh.name}
                      <span className="text-zinc-400 dark:text-zinc-500">
                        {" "}
                        +{enh.rating} [{enh.capacityUsed}]
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-400">¥{formatCurrency(enh.cost)}</span>
                      {onRemoveEnhancement && (
                        <button
                          onClick={() => onRemoveEnhancement(idx)}
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

          {/* Accessories */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Accessories ({accessoryCount})
              </span>
              {remainingCapacity > 0 && onAddAccessory && (
                <button
                  onClick={onAddAccessory}
                  className="flex items-center gap-0.5 text-[10px] text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              )}
            </div>
            {item.accessories && item.accessories.length > 0 ? (
              <div className="space-y-1">
                {item.accessories.map((acc, idx) => (
                  <div
                    key={`${acc.catalogId}-${idx}`}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-600 dark:text-zinc-400">
                      • {acc.name}
                      {acc.rating && (
                        <span className="text-zinc-400 dark:text-zinc-500"> R{acc.rating}</span>
                      )}
                      <span className="text-zinc-400 dark:text-zinc-500">
                        {" "}
                        [{acc.capacityUsed}]
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-400">¥{formatCurrency(acc.cost)}</span>
                      {onRemoveAccessory && (
                        <button
                          onClick={() => onRemoveAccessory(idx)}
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

          {/* Weapons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Implant Weapons ({weaponCount})
              </span>
              {remainingCapacity > 0 && onAddWeapon && (
                <button
                  onClick={onAddWeapon}
                  className="flex items-center gap-0.5 text-[10px] text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              )}
            </div>
            {item.weapons && item.weapons.length > 0 ? (
              <div className="space-y-1">
                {item.weapons.map((wpn, idx) => (
                  <div
                    key={`${wpn.catalogId}-${idx}`}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-600 dark:text-zinc-400">
                      • {wpn.name}
                      <span className="text-zinc-400 dark:text-zinc-500">
                        {" "}
                        ({wpn.damage}/{wpn.ap}AP) [{wpn.capacityUsed}]
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-400">¥{formatCurrency(wpn.cost)}</span>
                      {onRemoveWeapon && (
                        <button
                          onClick={() => onRemoveWeapon(idx)}
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

          {/* Capacity summary */}
          <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
            Capacity: {item.capacityUsed || 0}/{totalCapacity} used ({remainingCapacity} remaining)
          </div>
        </div>
      )}
    </div>
  );
}
