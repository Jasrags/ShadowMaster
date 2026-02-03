"use client";

/**
 * AugmentationItem
 *
 * Displays a non-cyberlimb augmentation (cyberware or bioware) with expandable details.
 * Shows essence cost, nuyen cost, grade, and any installed enhancements.
 */

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Shield, X, Zap } from "lucide-react";
import type { CyberwareItem, BiowareItem } from "@/lib/types";
import { formatCurrency, formatEssence, GRADE_DISPLAY } from "./utils";

export interface AugmentationItemProps {
  item: CyberwareItem | BiowareItem;
  type: "cyberware" | "bioware";
  onRemove: () => void;
  onAddEnhancement?: () => void;
  onRemoveEnhancement?: (enhancementIndex: number) => void;
}

export function AugmentationItem({
  item,
  type,
  onRemove,
  onAddEnhancement,
  onRemoveEnhancement,
}: AugmentationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCyberware = type === "cyberware";
  const cyberItem = item as CyberwareItem;
  const hasCapacity = isCyberware && cyberItem.capacity && cyberItem.capacity > 0;
  const remainingCapacity = hasCapacity
    ? (cyberItem.capacity || 0) - (cyberItem.capacityUsed || 0)
    : 0;
  const enhancementCount = cyberItem.enhancements?.length || 0;

  // Check if expandable (has bonuses, capacity, or enhancements)
  const hasExpandableContent =
    hasCapacity ||
    enhancementCount > 0 ||
    (item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0) ||
    item.armorBonus ||
    (item as CyberwareItem).initiativeDiceBonus;

  // Format item name with rating
  const displayName = useMemo(() => {
    // Check if name already contains rating info like "(Rating X)" and convert to RX
    const ratingMatch = item.name.match(/\(Rating (\d+)\)/);
    if (ratingMatch) {
      return item.name.replace(/\s*\(Rating (\d+)\)/, ` R${ratingMatch[1]}`);
    }
    return item.name;
  }, [item.name]);

  // Format category display
  const categoryDisplay = useMemo(() => {
    if (!item.category) return "";
    return item.category.charAt(0).toUpperCase() + item.category.slice(1).replace(/-/g, " ");
  }, [item.category]);

  return (
    <div>
      {/* Compact Single-Line Header */}
      <div className="flex items-center gap-1.5 py-2">
        {/* Expand/Collapse Button */}
        {hasExpandableContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={
              isExpanded ? `Collapse ${displayName} details` : `Expand ${displayName} details`
            }
            aria-expanded={isExpanded}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}

        {/* Name */}
        <span
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate flex-1"
          title={displayName}
        >
          {displayName}
        </span>

        {/* Essence */}
        <span
          className={`text-sm font-medium shrink-0 ${
            isCyberware ? "text-cyan-600 dark:text-cyan-400" : "text-pink-600 dark:text-pink-400"
          }`}
        >
          {formatEssence(item.essenceCost)} ESS
        </span>

        {/* Cost */}
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 shrink-0">
          ¥{formatCurrency(item.cost)}
        </span>

        {/* Mod count badge (only if has mods) */}
        {enhancementCount > 0 && (
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 shrink-0">
            [{enhancementCount} mod{enhancementCount !== 1 ? "s" : ""}]
          </span>
        )}

        {/* Separator */}
        <div className="mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />

        {/* Remove Button */}
        <button
          onClick={onRemove}
          aria-label={`Remove ${displayName}`}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800 py-3 ml-6 space-y-3">
          {/* Grade & Category */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {GRADE_DISPLAY[item.grade]} • {categoryDisplay}
          </div>

          {/* Bonuses (Armor, Attributes, Initiative) */}
          {((item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0) ||
            item.armorBonus ||
            (item as CyberwareItem).initiativeDiceBonus) && (
            <div className="flex flex-wrap gap-1">
              {item.armorBonus && (
                <span className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                  <Shield className="h-3 w-3" />+{item.armorBonus} Armor
                </span>
              )}
              {(item as CyberwareItem).initiativeDiceBonus && (
                <span className="flex items-center gap-1 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  <Zap className="h-3 w-3" />+{(item as CyberwareItem).initiativeDiceBonus}D6 Init
                </span>
              )}
              {item.attributeBonuses &&
                Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
                  <span
                    key={attr}
                    className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                  >
                    {attr.toUpperCase()}: +{bonus}
                  </span>
                ))}
            </div>
          )}

          {/* Modifications */}
          {hasCapacity && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Mods ({cyberItem.capacityUsed || 0}/{cyberItem.capacity} cap)
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
              {cyberItem.enhancements && cyberItem.enhancements.length > 0 ? (
                <div className="space-y-1">
                  {cyberItem.enhancements.map((enh, idx) => (
                    <div
                      key={`${enh.catalogId}-${idx}`}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-600 dark:text-zinc-400">
                        • {enh.name}
                        {enh.rating && (
                          <span className="text-zinc-400 dark:text-zinc-500"> R{enh.rating}</span>
                        )}
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
          )}
        </div>
      )}
    </div>
  );
}
