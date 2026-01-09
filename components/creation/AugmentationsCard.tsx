"use client";

/**
 * AugmentationsCard
 *
 * Compact card for augmentation selection in sheet-driven creation.
 * Option A: Unified List with Type Badges
 *
 * Features:
 * - Unified list showing both cyberware and bioware with type badges
 * - Two add buttons: [+ Add Cyberware] [+ Add Bioware]
 * - Essence bar with magic/resonance loss warnings
 * - Items with capacity show capacity usage and enhancement button
 * - Modal-driven item selection
 */

import { useMemo, useCallback, useState } from "react";
import {
  useAugmentationRules,
  calculateMagicLoss,
} from "@/lib/rules/RulesetContext";
import type { CreationState, CyberwareItem, BiowareItem } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  KarmaConversionModal,
  useKarmaConversionPrompt,
} from "./shared";
import {
  AugmentationModal,
  CyberwareEnhancementModal,
  CyberlimbAccessoryModal,
  CyberlimbWeaponModal,
  type AugmentationSelection,
  type AugmentationType,
  type CyberwareEnhancementSelection,
  type CyberlimbAccessorySelection,
  type CyberlimbWeaponSelection,
  type InstalledCyberlimb,
} from "./augmentations";
import {
  type CyberlimbLocation,
  type CyberlimbType,
  type CyberlimbItem,
  LOCATION_SIDE,
  wouldReplaceExisting,
  isCyberlimb,
} from "@/lib/types/cyberlimb";
import {
  Lock,
  X,
  AlertTriangle,
  Cpu,
  Heart,
  Plus,
  Zap,
  ChevronDown,
  ChevronRight,
  Shield,
  Crosshair,
  Settings,
  Wrench,
} from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const GRADE_DISPLAY: Record<string, string> = {
  used: "Used",
  standard: "Std",
  alpha: "Alpha",
  beta: "Beta",
  delta: "Delta",
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

function formatEssence(value: number): string {
  return value.toFixed(2);
}

// =============================================================================
// TYPES
// =============================================================================

interface AugmentationsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// AUGMENTATION ITEM COMPONENT
// =============================================================================

function AugmentationItem({
  item,
  type,
  onRemove,
  onAddEnhancement,
  onRemoveEnhancement,
}: {
  item: CyberwareItem | BiowareItem;
  type: "cyberware" | "bioware";
  onRemove: () => void;
  onAddEnhancement?: () => void;
  onRemoveEnhancement?: (enhancementIndex: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCyberware = type === "cyberware";
  const cyberItem = item as CyberwareItem;
  const hasCapacity = isCyberware && cyberItem.capacity && cyberItem.capacity > 0;
  const remainingCapacity = hasCapacity
    ? (cyberItem.capacity || 0) - (cyberItem.capacityUsed || 0)
    : 0;
  const enhancementCount = cyberItem.enhancements?.length || 0;

  // Format item name with rating
  const displayName = useMemo(() => {
    // Check if name already contains rating info like "(Rating X)" and convert to RX
    const ratingMatch = item.name.match(/\(Rating (\d+)\)/);
    if (ratingMatch) {
      return item.name.replace(/\s*\(Rating (\d+)\)/, ` R${ratingMatch[1]}`);
    }
    return item.name;
  }, [item.name]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Collapsed Header */}
      <div className="flex w-full items-center gap-2 p-3">
        {/* Expand/Collapse Button - spacer for non-expandable items maintains alignment */}
        {(hasCapacity || enhancementCount > 0 || (item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0) || item.armorBonus) ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0 text-zinc-400"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          /* Spacer for non-expandable items to maintain alignment */
          <div className="w-4 shrink-0" />
        )}

        {/* Type badge */}
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
            isCyberware
              ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400"
              : "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400"
          }`}
        >
          {isCyberware ? <Cpu className="h-3.5 w-3.5" /> : <Heart className="h-3.5 w-3.5" />}
        </div>

        {/* Name, grade, and quick stats */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span
              className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100"
              title={displayName}
            >
              {displayName}
            </span>
            <span className="shrink-0 rounded bg-zinc-100 px-1 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {GRADE_DISPLAY[item.grade]}
            </span>
            {enhancementCount > 0 && (
              <span className="shrink-0 rounded bg-blue-100 px-1 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                {enhancementCount} mod{enhancementCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {hasCapacity && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Zap className="h-3 w-3" />
              <span>Cap {cyberItem.capacityUsed || 0}/{cyberItem.capacity}</span>
            </div>
          )}
        </div>

        {/* Essence and cost */}
        <div className="shrink-0 text-right">
          <div
            className={`text-xs font-medium ${
              isCyberware
                ? "text-cyan-600 dark:text-cyan-400"
                : "text-pink-600 dark:text-pink-400"
            }`}
          >
            {formatEssence(item.essenceCost)} ESS
          </div>
          <div className="text-[10px] text-zinc-400">{formatCurrency(item.cost)}¥</div>
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Collapsed preview: bonuses shown inline */}
      {!isExpanded && ((item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0) || item.armorBonus) && (
        <div className="flex flex-wrap gap-1.5 border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
          {item.armorBonus && (
            <span className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              <Shield className="h-3 w-3" />
              +{item.armorBonus} Armor
            </span>
          )}
          {item.attributeBonuses && Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
            <span
              key={attr}
              className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
            >
              {attr.toUpperCase()}: +{bonus}
            </span>
          ))}
        </div>
      )}

      {/* Collapsed preview: enhancements shown as tags */}
      {!isExpanded && hasCapacity && cyberItem.enhancements && cyberItem.enhancements.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
          {cyberItem.enhancements.map((enh, idx) => (
            <span
              key={`${enh.catalogId}-${idx}`}
              className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {enh.name}
              {enh.rating && ` R${enh.rating}`}
            </span>
          ))}
        </div>
      )}

      {/* Expanded Detail View */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="space-y-3 p-3">
            {/* Bonuses (Armor and Attributes) */}
            {((item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0) || item.armorBonus) && (
              <div>
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Bonuses
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.armorBonus && (
                    <span className="flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                      <Shield className="h-3.5 w-3.5" />
                      +{item.armorBonus} Armor
                    </span>
                  )}
                  {item.attributeBonuses && Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
                    <span
                      key={attr}
                      className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                    >
                      {attr.toUpperCase()}: +{bonus}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Capacity Bar */}
            {hasCapacity && (
              <div className="rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Modification Capacity
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {cyberItem.capacityUsed || 0} / {cyberItem.capacity} used
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className={`h-full rounded-full transition-all ${
                      remainingCapacity === 0
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(100, ((cyberItem.capacityUsed || 0) / (cyberItem.capacity || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                  {remainingCapacity} capacity remaining
                </div>
              </div>
            )}

            {/* Enhancements List */}
            {hasCapacity && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Modifications
                  </span>
                  {remainingCapacity > 0 && onAddEnhancement && (
                    <button
                      onClick={onAddEnhancement}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3 w-3" />
                      Add Mod
                    </button>
                  )}
                </div>
                {cyberItem.enhancements && cyberItem.enhancements.length > 0 ? (
                  <div className="space-y-1">
                    {cyberItem.enhancements.map((enh, idx) => (
                      <div
                        key={`${enh.catalogId}-${idx}`}
                        className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1.5 text-sm dark:bg-zinc-800"
                      >
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {enh.name}
                          {enh.rating && (
                            <span className="ml-1 text-xs text-zinc-400">R{enh.rating}</span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">
                            {formatCurrency(enh.cost)}¥
                          </span>
                          {onRemoveEnhancement && (
                            <button
                              onClick={() => onRemoveEnhancement(idx)}
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
                  <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
                    No modifications installed
                  </p>
                )}
                {remainingCapacity === 0 && (
                  <p className="mt-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                    No capacity remaining for additional modifications
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// CYBERLIMB AUGMENTATION ITEM COMPONENT
// =============================================================================

function CyberlimbAugmentationItem({
  item,
  onRemove,
  onAddEnhancement,
  onRemoveEnhancement,
  onAddAccessory,
  onRemoveAccessory,
  onAddWeapon,
  onRemoveWeapon,
}: {
  item: CyberlimbItem;
  onRemove: () => void;
  onAddEnhancement?: () => void;
  onRemoveEnhancement?: (enhancementIndex: number) => void;
  onAddAccessory?: () => void;
  onRemoveAccessory?: (accessoryIndex: number) => void;
  onAddWeapon?: () => void;
  onRemoveWeapon?: (weaponIndex: number) => void;
}) {
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
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Collapsed Header */}
      <div className="flex w-full items-center gap-2 p-3">
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 text-zinc-400"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {/* Cyberlimb badge */}
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400">
          <Cpu className="h-3.5 w-3.5" />
        </div>

        {/* Name, location, and stats */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span
              className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100"
              title={item.name}
            >
              {item.name}
            </span>
            <span className="shrink-0 rounded bg-zinc-100 px-1 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {GRADE_DISPLAY[item.grade]}
            </span>
            {totalMods > 0 && (
              <span className="shrink-0 rounded bg-blue-100 px-1 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                {totalMods} mod{totalMods !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
            {locationDisplay} • {item.appearance === "synthetic" ? "Synthetic" : "Obvious"}
          </div>
        </div>

        {/* Essence and cost */}
        <div className="shrink-0 text-right">
          <div className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
            {formatEssence(item.essenceCost)} ESS
          </div>
          <div className="text-[10px] text-zinc-400">{formatCurrency(item.cost)}¥</div>
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Collapsed preview: Limb attributes as inline stats */}
      {!isExpanded && (
        <div className="flex items-center gap-3 border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
          {/* Limb Attributes */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              STR {effectiveStr}
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">|</span>
            <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              AGI {effectiveAgi}
            </span>
            {armorBonus > 0 && (
              <>
                <span className="text-zinc-300 dark:text-zinc-600">|</span>
                <span className="flex items-center gap-1 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <Shield className="h-3 w-3" />
                  +{armorBonus}
                </span>
              </>
            )}
          </div>
          <div className="flex-1" />
          {/* Capacity indicator */}
          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Zap className="h-3 w-3" />
            <span className="font-mono">{item.capacityUsed || 0}/{totalCapacity}</span>
          </div>
        </div>
      )}

      {/* Expanded Detail View */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="space-y-4 p-3">
            {/* LIMB ATTRIBUTES Section */}
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Limb Attributes
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {effectiveStr}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    STR
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {effectiveAgi}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    AGI
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                    {armorBonus > 0 ? `+${armorBonus}` : "—"}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Armor
                  </div>
                </div>
              </div>
            </div>

            {/* ENHANCEMENTS Section */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Settings className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Enhancements
                  </span>
                  <span className="rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {enhancementCount}
                  </span>
                </div>
                {remainingCapacity > 0 && onAddEnhancement && (
                  <button
                    onClick={onAddEnhancement}
                    className="flex items-center gap-1 text-[10px] font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
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
                      className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1.5 text-sm dark:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {enh.name}
                        </span>
                        <span className="rounded bg-emerald-100 px-1 py-0.5 text-[9px] font-mono text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          +{enh.rating}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          [{enh.capacityUsed}]
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-500">
                          {formatCurrency(enh.cost)}¥
                        </span>
                        {onRemoveEnhancement && (
                          <button
                            onClick={() => onRemoveEnhancement(idx)}
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
                <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
                  No enhancements installed
                </p>
              )}
            </div>

            {/* ACCESSORIES Section */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Wrench className="h-3 w-3 text-sky-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Accessories
                  </span>
                  <span className="rounded bg-sky-100 px-1 py-0.5 text-[9px] font-medium text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                    {accessoryCount}
                  </span>
                </div>
                {remainingCapacity > 0 && onAddAccessory && (
                  <button
                    onClick={onAddAccessory}
                    className="flex items-center gap-1 text-[10px] font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
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
                      className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1.5 text-sm dark:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {acc.name}
                        </span>
                        {acc.rating && (
                          <span className="rounded bg-sky-100 px-1 py-0.5 text-[9px] font-mono text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                            R{acc.rating}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-400">
                          [{acc.capacityUsed}]
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-500">
                          {formatCurrency(acc.cost)}¥
                        </span>
                        {onRemoveAccessory && (
                          <button
                            onClick={() => onRemoveAccessory(idx)}
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
                <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
                  No accessories installed
                </p>
              )}
            </div>

            {/* WEAPONS Section */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Crosshair className="h-3 w-3 text-red-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Implant Weapons
                  </span>
                  <span className="rounded bg-red-100 px-1 py-0.5 text-[9px] font-medium text-red-700 dark:bg-red-900/50 dark:text-red-300">
                    {weaponCount}
                  </span>
                </div>
                {remainingCapacity > 0 && onAddWeapon && (
                  <button
                    onClick={onAddWeapon}
                    className="flex items-center gap-1 text-[10px] font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
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
                      className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1.5 text-sm dark:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {wpn.name}
                        </span>
                        <span className="rounded bg-red-100 px-1 py-0.5 text-[9px] font-mono text-red-700 dark:bg-red-900/40 dark:text-red-300">
                          {wpn.damage} / {wpn.ap}AP
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          [{wpn.capacityUsed}]
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-500">
                          {formatCurrency(wpn.cost)}¥
                        </span>
                        {onRemoveWeapon && (
                          <button
                            onClick={() => onRemoveWeapon(idx)}
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
                <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
                  No implant weapons installed
                </p>
              )}
            </div>

            {/* Capacity Bar */}
            <div className="rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Modification Capacity
                </span>
                <span className="font-mono text-zinc-500 dark:text-zinc-400">
                  {item.capacityUsed || 0} / {totalCapacity}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    remainingCapacity === 0
                      ? "bg-amber-500"
                      : "bg-cyan-500"
                  }`}
                  style={{
                    width: `${Math.min(100, ((item.capacityUsed || 0) / totalCapacity) * 100)}%`,
                  }}
                />
              </div>
              <div className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                {remainingCapacity} capacity remaining
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AugmentationsCard({ state, updateState }: AugmentationsCardProps) {
  const augmentationRules = useAugmentationRules();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  const [isAugModalOpen, setIsAugModalOpen] = useState(false);
  const [augModalType, setAugModalType] = useState<AugmentationType>("cyberware");
  const [enhancementModalCyberware, setEnhancementModalCyberware] = useState<CyberwareItem | null>(
    null
  );
  const [accessoryModalCyberlimb, setAccessoryModalCyberlimb] = useState<CyberlimbItem | null>(null);
  const [weaponModalCyberlimb, setWeaponModalCyberlimb] = useState<CyberlimbItem | null>(null);

  // Get selections from state
  const selectedCyberware = useMemo(
    () => (state.selections?.cyberware || []) as CyberwareItem[],
    [state.selections?.cyberware]
  );
  const selectedBioware = useMemo(
    () => (state.selections?.bioware || []) as BiowareItem[],
    [state.selections?.bioware]
  );

  // Extract installed cyberlimbs for conflict checking
  const installedCyberlimbs = useMemo((): InstalledCyberlimb[] => {
    return selectedCyberware
      .filter((item) => item.category === "cyberlimb" && "location" in item && "limbType" in item)
      .map((item) => ({
        id: item.id || item.catalogId,
        name: item.name,
        location: (item as CyberwareItem & { location: CyberlimbLocation }).location,
        limbType: (item as CyberwareItem & { limbType: CyberlimbType }).limbType,
      }));
  }, [selectedCyberware]);

  // Check if character is magical or technomancer
  const magicPath = (state.selections?.["magical-path"] as string) || "mundane";
  const isAwakened = ["magician", "mystic-adept", "aspected-mage", "adept"].includes(magicPath);
  const isTechnomancer = magicPath === "technomancer";

  // Get special attribute values
  const specialAttributes = (state.selections?.specialAttributes || {}) as Record<string, number>;
  const magicRating = specialAttributes.magic || 0;
  const resonanceRating = specialAttributes.resonance || 0;

  // Calculate nuyen budget
  const baseNuyen = nuyenBudget?.total || 0;
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const convertedNuyen = karmaConversion * 2000;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate total spent across all gear categories
  const gearSpent =
    ((state.selections?.weapons as Array<{ cost: number; quantity: number }>) || []).reduce(
      (s, i) => s + i.cost * i.quantity,
      0
    ) +
    ((state.selections?.armor as Array<{ cost: number; quantity: number }>) || []).reduce(
      (s, i) => s + i.cost * i.quantity,
      0
    ) +
    ((state.selections?.gear as Array<{ cost: number; quantity: number }>) || []).reduce(
      (s, i) => s + i.cost * i.quantity,
      0
    ) +
    ((state.selections?.foci as Array<{ cost: number }>) || []).reduce((s, i) => s + i.cost, 0);
  const cyberwareSpent = selectedCyberware.reduce((sum, item) => sum + item.cost, 0);
  const biowareSpent = selectedBioware.reduce((sum, item) => sum + item.cost, 0);
  const lifestyleSpent = (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;
  const totalSpent = gearSpent + cyberwareSpent + biowareSpent + lifestyleSpent;
  const remainingNuyen = totalNuyen - totalSpent;

  // Karma conversion hook for purchase prompts
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
    remaining: remainingNuyen,
    karmaRemaining,
    currentConversion: karmaConversion,
    onConvert: handleKarmaConvert,
  });

  // Calculate essence
  const maxEssence = augmentationRules.maxEssence;
  const cyberwareEssence = selectedCyberware.reduce((sum, item) => sum + item.essenceCost, 0);
  const biowareEssence = selectedBioware.reduce((sum, item) => sum + item.essenceCost, 0);
  const totalEssenceLoss = Math.round((cyberwareEssence + biowareEssence) * 100) / 100;
  const remainingEssence = Math.round((maxEssence - totalEssenceLoss) * 100) / 100;

  // Calculate magic/resonance loss
  const magicLoss = isAwakened
    ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula)
    : 0;
  const resonanceLoss = isTechnomancer
    ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula)
    : 0;

  // Calculate attribute bonuses
  const attributeBonuses = useMemo(() => {
    const bonuses: Record<string, number> = {};
    for (const item of selectedCyberware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    for (const item of selectedBioware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    return bonuses;
  }, [selectedCyberware, selectedBioware]);

  // Open augmentation modal
  const openAugModal = useCallback((type: AugmentationType) => {
    setAugModalType(type);
    setIsAugModalOpen(true);
  }, []);

  // Add augmentation (actual implementation)
  const actuallyAddAugmentation = useCallback(
    (selection: AugmentationSelection) => {
      // Build the base item
      const baseItem = {
        id: `${selection.catalogId}-${Date.now()}`,
        catalogId: selection.catalogId,
        name: selection.name,
        category: selection.category,
        grade: selection.grade,
        baseEssenceCost: selection.baseEssenceCost,
        essenceCost: selection.essenceCost,
        cost: selection.cost,
        availability: selection.availability,
        legality: selection.legality,
        attributeBonuses: selection.attributeBonuses,
        armorBonus: selection.armorBonus,
      };

      const newItem =
        selection.type === "cyberware"
          ? ({
              ...baseItem,
              capacity: selection.capacity,
              capacityUsed: 0,
              enhancements: [],
              initiativeDiceBonus: selection.initiativeDiceBonus,
              wirelessBonus: selection.wirelessBonus,
              // Add cyberlimb-specific fields if present
              ...(selection.location && { location: selection.location }),
              ...(selection.limbType && { limbType: selection.limbType }),
              ...(selection.appearance && { appearance: selection.appearance }),
              ...(selection.baseStrength && { baseStrength: selection.baseStrength }),
              ...(selection.baseAgility && { baseAgility: selection.baseAgility }),
            } as CyberwareItem)
          : (baseItem as BiowareItem);

      if (selection.type === "cyberware") {
        // For cyberlimbs, remove any limbs that would be replaced
        let updatedCyberware = [...selectedCyberware];

        if (selection.location && selection.limbType) {
          const newSide = LOCATION_SIDE[selection.location];

          // Filter out any cyberlimbs that would be replaced
          updatedCyberware = updatedCyberware.filter((item) => {
            // Skip non-cyberlimbs
            if (item.category !== "cyberlimb" || !("location" in item) || !("limbType" in item)) {
              return true;
            }

            const existingItem = item as CyberwareItem & { location: CyberlimbLocation; limbType: CyberlimbType };
            const existingSide = LOCATION_SIDE[existingItem.location];

            // Only check items on the same side
            if (existingSide !== newSide) {
              return true;
            }

            // Check if the new limb would replace this one
            // Same location = direct replacement
            if (existingItem.location === selection.location) {
              return false;
            }

            // Hierarchy replacement (e.g., full-arm replaces lower-arm and hand)
            if (selection.limbType && wouldReplaceExisting(selection.limbType, existingItem.limbType)) {
              return false;
            }

            return true;
          });
        }

        updateState({
          selections: {
            ...state.selections,
            cyberware: [...updatedCyberware, newItem as CyberwareItem],
          },
        });
      } else {
        updateState({
          selections: {
            ...state.selections,
            bioware: [...selectedBioware, newItem as BiowareItem],
          },
        });
      }
    },
    [selectedCyberware, selectedBioware, state.selections, updateState]
  );

  // Add augmentation (with karma conversion prompt if needed)
  const handleAddAugmentation = useCallback(
    (selection: AugmentationSelection) => {
      // Check if already affordable
      if (selection.cost <= remainingNuyen) {
        actuallyAddAugmentation(selection);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(selection.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(selection.name, selection.cost, () => {
          actuallyAddAugmentation(selection);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remainingNuyen, actuallyAddAugmentation, karmaConversionPrompt]
  );

  // Remove cyberware
  const removeCyberware = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          cyberware: selectedCyberware.filter((item) => item.id !== id),
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Remove bioware
  const removeBioware = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          bioware: selectedBioware.filter((item) => item.id !== id),
        },
      });
    },
    [selectedBioware, state.selections, updateState]
  );

  // Remove enhancement from cyberware
  const removeEnhancement = useCallback(
    (cyberwareId: string, enhancementIndex: number) => {
      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== cyberwareId) return item;

        const enhancements = item.enhancements || [];
        const removedEnhancement = enhancements[enhancementIndex] as CyberwareItem & { capacityCost?: number };
        if (!removedEnhancement) return item;

        // Get the capacity cost that was used by this enhancement
        // Use stored capacityCost, fall back to rating for legacy data
        const capacityToRestore = removedEnhancement.capacityCost ?? removedEnhancement.rating ?? 1;

        return {
          ...item,
          capacityUsed: Math.max(0, (item.capacityUsed || 0) - capacityToRestore),
          enhancements: enhancements.filter((_, idx) => idx !== enhancementIndex),
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Add enhancements to cyberware (actual implementation - handles batch)
  const actuallyAddEnhancements = useCallback(
    (enhancements: CyberwareEnhancementSelection[]) => {
      if (!enhancementModalCyberware || enhancements.length === 0) return;

      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== enhancementModalCyberware.id) return item;

        // Build all new enhancements
        const newEnhancements = enhancements.map((enhancement) => ({
          catalogId: enhancement.catalogId,
          name: enhancement.name,
          category: enhancement.category as CyberwareItem["category"],
          grade: item.grade, // Inherit parent grade
          baseEssenceCost: 0,
          essenceCost: 0,
          cost: enhancement.cost,
          availability: enhancement.availability,
          legality: enhancement.legality,
          rating: enhancement.rating,
          capacityCost: enhancement.capacityCost, // Store for removal
        } as CyberwareItem));

        // Calculate total capacity used
        const totalCapacityCost = enhancements.reduce((sum, e) => sum + e.capacityCost, 0);

        return {
          ...item,
          capacityUsed: (item.capacityUsed || 0) + totalCapacityCost,
          enhancements: [...(item.enhancements || []), ...newEnhancements],
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });

      setEnhancementModalCyberware(null);
    },
    [enhancementModalCyberware, selectedCyberware, state.selections, updateState]
  );

  // Add enhancements to cyberware (with karma conversion prompt if needed)
  const handleAddEnhancements = useCallback(
    (enhancements: CyberwareEnhancementSelection[]) => {
      if (!enhancementModalCyberware || enhancements.length === 0) return;

      // Calculate total cost
      const totalCost = enhancements.reduce((sum, e) => sum + e.cost, 0);

      // Check if already affordable
      if (totalCost <= remainingNuyen) {
        actuallyAddEnhancements(enhancements);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemNames = enhancements.map((e) => e.name).join(", ");
        karmaConversionPrompt.promptConversion(itemNames, totalCost, () => {
          actuallyAddEnhancements(enhancements);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [enhancementModalCyberware, remainingNuyen, actuallyAddEnhancements, karmaConversionPrompt]
  );

  // Get remaining capacity for enhancement modal
  const enhancementRemainingCapacity = useMemo(() => {
    if (!enhancementModalCyberware) return 0;
    return (
      (enhancementModalCyberware.capacity || 0) - (enhancementModalCyberware.capacityUsed || 0)
    );
  }, [enhancementModalCyberware]);

  // Get remaining capacity for accessory modal
  const accessoryRemainingCapacity = useMemo(() => {
    if (!accessoryModalCyberlimb) return 0;
    return (
      (accessoryModalCyberlimb.capacity || 0) - (accessoryModalCyberlimb.capacityUsed || 0)
    );
  }, [accessoryModalCyberlimb]);

  // Get remaining capacity for weapon modal
  const weaponRemainingCapacity = useMemo(() => {
    if (!weaponModalCyberlimb) return 0;
    return (
      (weaponModalCyberlimb.capacity || 0) - (weaponModalCyberlimb.capacityUsed || 0)
    );
  }, [weaponModalCyberlimb]);

  // Add accessories to cyberlimb (actual implementation - handles batch)
  const actuallyAddAccessories = useCallback(
    (accessories: CyberlimbAccessorySelection[]) => {
      if (!accessoryModalCyberlimb || accessories.length === 0) return;

      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== accessoryModalCyberlimb.id || !isCyberlimb(item)) return item;

        // Build all new accessories
        const newAccessories = accessories.map((accessory) => ({
          id: `acc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          catalogId: accessory.catalogId,
          name: accessory.name,
          capacityUsed: accessory.capacityCost,
          rating: accessory.rating,
        }));

        // Calculate total capacity used
        const totalCapacityCost = accessories.reduce((sum, a) => sum + a.capacityCost, 0);

        return {
          ...item,
          capacityUsed: (item.capacityUsed || 0) + totalCapacityCost,
          accessories: [...(item.accessories || []), ...newAccessories],
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });

      setAccessoryModalCyberlimb(null);
    },
    [accessoryModalCyberlimb, selectedCyberware, state.selections, updateState]
  );

  // Add accessories to cyberlimb (with karma conversion prompt if needed)
  const handleAddAccessories = useCallback(
    (accessories: CyberlimbAccessorySelection[]) => {
      if (!accessoryModalCyberlimb || accessories.length === 0) return;

      // Calculate total cost
      const totalCost = accessories.reduce((sum, a) => sum + a.cost, 0);

      // Check if already affordable
      if (totalCost <= remainingNuyen) {
        actuallyAddAccessories(accessories);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemNames = accessories.map((a) => a.name).join(", ");
        karmaConversionPrompt.promptConversion(itemNames, totalCost, () => {
          actuallyAddAccessories(accessories);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [accessoryModalCyberlimb, remainingNuyen, actuallyAddAccessories, karmaConversionPrompt]
  );

  // Add weapons to cyberlimb (actual implementation - handles batch)
  const actuallyAddWeapons = useCallback(
    (weapons: CyberlimbWeaponSelection[]) => {
      if (!weaponModalCyberlimb || weapons.length === 0) return;

      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== weaponModalCyberlimb.id || !isCyberlimb(item)) return item;

        // Build all new weapons
        const newWeapons = weapons.map((weapon) => ({
          id: `wpn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          catalogId: weapon.catalogId,
          name: weapon.name,
          capacityUsed: weapon.capacityCost,
          essenceCost: 0,
          cost: weapon.cost,
          availability: weapon.availability,
          legality: weapon.legality,
          damage: weapon.damage || "",
          ap: weapon.ap || 0,
        }));

        // Calculate total capacity used
        const totalCapacityCost = weapons.reduce((sum, w) => sum + w.capacityCost, 0);

        return {
          ...item,
          capacityUsed: (item.capacityUsed || 0) + totalCapacityCost,
          weapons: [...(item.weapons || []), ...newWeapons],
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });

      setWeaponModalCyberlimb(null);
    },
    [weaponModalCyberlimb, selectedCyberware, state.selections, updateState]
  );

  // Add weapons to cyberlimb (with karma conversion prompt if needed)
  const handleAddWeapons = useCallback(
    (weapons: CyberlimbWeaponSelection[]) => {
      if (!weaponModalCyberlimb || weapons.length === 0) return;

      // Calculate total cost
      const totalCost = weapons.reduce((sum, w) => sum + w.cost, 0);

      // Check if already affordable
      if (totalCost <= remainingNuyen) {
        actuallyAddWeapons(weapons);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemNames = weapons.map((w) => w.name).join(", ");
        karmaConversionPrompt.promptConversion(itemNames, totalCost, () => {
          actuallyAddWeapons(weapons);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [weaponModalCyberlimb, remainingNuyen, actuallyAddWeapons, karmaConversionPrompt]
  );

  // Remove accessory from cyberlimb
  const removeAccessory = useCallback(
    (cyberlimbId: string, accessoryIndex: number) => {
      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== cyberlimbId || !isCyberlimb(item)) return item;
        if (!item.accessories || item.accessories.length <= accessoryIndex) return item;

        const removedAccessory = item.accessories[accessoryIndex];
        const capacityToRestore = removedAccessory.capacityUsed || 0;

        return {
          ...item,
          capacityUsed: Math.max(0, (item.capacityUsed || 0) - capacityToRestore),
          accessories: item.accessories.filter((_, i) => i !== accessoryIndex),
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Remove weapon from cyberlimb
  const removeWeapon = useCallback(
    (cyberlimbId: string, weaponIndex: number) => {
      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== cyberlimbId || !isCyberlimb(item)) return item;
        if (!item.weapons || item.weapons.length <= weaponIndex) return item;

        const removedWeapon = item.weapons[weaponIndex];
        const capacityToRestore = removedWeapon.capacityUsed || 0;

        return {
          ...item,
          capacityUsed: Math.max(0, (item.capacityUsed || 0) - capacityToRestore),
          weapons: item.weapons.filter((_, i) => i !== weaponIndex),
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (remainingEssence < 0) return "error";
    if (remainingNuyen < 0) return "error";
    if ((isAwakened && magicLoss > 0) || (isTechnomancer && resonanceLoss > 0)) return "warning";
    if (selectedCyberware.length > 0 || selectedBioware.length > 0) return "valid";
    return "pending";
  }, [
    remainingEssence,
    remainingNuyen,
    isAwakened,
    isTechnomancer,
    magicLoss,
    resonanceLoss,
    selectedCyberware.length,
    selectedBioware.length,
  ]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard
        title="Augmentations"
        description="Install cyberware and bioware"
        status="pending"
      >
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Set priorities first</p>
        </div>
      </CreationCard>
    );
  }

  const totalAugmentations = selectedCyberware.length + selectedBioware.length;

  return (
    <>
      <CreationCard
        title="Augmentations"
        status={validationStatus}
      >
        <div className="space-y-4">
          {/* Essence bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-400">Essence</span>
              <span
                className={`font-medium ${
                  remainingEssence < 1
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {formatEssence(remainingEssence)} / {maxEssence}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-full transition-all ${
                  remainingEssence < 1 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.max(0, (remainingEssence / maxEssence) * 100)}%` }}
              />
            </div>
          </div>

          {/* Magic/Resonance warning */}
          {isAwakened && magicLoss > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-amber-800 dark:text-amber-200">
                Magic reduced by {magicLoss} (now {Math.max(0, magicRating - magicLoss)})
              </div>
            </div>
          )}
          {isTechnomancer && resonanceLoss > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-amber-800 dark:text-amber-200">
                Resonance reduced by {resonanceLoss} (now{" "}
                {Math.max(0, resonanceRating - resonanceLoss)})
              </div>
            </div>
          )}

          {/* Total attribute bonuses */}
          {Object.keys(attributeBonuses).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(attributeBonuses).map(([attr, bonus]) => (
                <span
                  key={attr}
                  className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                >
                  {attr.toUpperCase()}: +{bonus}
                </span>
              ))}
            </div>
          )}

          {/* Add buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => openAugModal("cyberware")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-cyan-300 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 transition-colors hover:border-cyan-400 hover:bg-cyan-100 dark:border-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300 dark:hover:border-cyan-600 dark:hover:bg-cyan-900/30"
            >
              <Cpu className="h-3.5 w-3.5" />
              Add Cyberware
            </button>
            <button
              onClick={() => openAugModal("bioware")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-pink-300 bg-pink-50 px-3 py-2 text-xs font-medium text-pink-700 transition-colors hover:border-pink-400 hover:bg-pink-100 dark:border-pink-700 dark:bg-pink-900/20 dark:text-pink-300 dark:hover:border-pink-600 dark:hover:bg-pink-900/30"
            >
              <Heart className="h-3.5 w-3.5" />
              Add Bioware
            </button>
          </div>

          {/* Unified augmentation list */}
          {totalAugmentations > 0 && (
            <div className="space-y-2">
              {selectedCyberware.map((item) => {
                // Check if this is a cyberlimb using the type guard
                if (isCyberlimb(item)) {
                  return (
                    <CyberlimbAugmentationItem
                      key={item.id}
                      item={item}
                      onRemove={() => item.id && removeCyberware(item.id)}
                      onAddEnhancement={() => setEnhancementModalCyberware(item)}
                      onRemoveEnhancement={(idx) => removeEnhancement(item.id!, idx)}
                      onAddAccessory={() => setAccessoryModalCyberlimb(item)}
                      onRemoveAccessory={(idx) => removeAccessory(item.id!, idx)}
                      onAddWeapon={() => setWeaponModalCyberlimb(item)}
                      onRemoveWeapon={(idx) => removeWeapon(item.id!, idx)}
                    />
                  );
                }

                // Regular cyberware
                return (
                  <AugmentationItem
                    key={item.id}
                    item={item}
                    type="cyberware"
                    onRemove={() => item.id && removeCyberware(item.id)}
                    onAddEnhancement={
                      item.capacity && item.capacity > 0
                        ? () => setEnhancementModalCyberware(item)
                        : undefined
                    }
                    onRemoveEnhancement={
                      item.id && item.capacity && item.capacity > 0
                        ? (idx) => removeEnhancement(item.id!, idx)
                        : undefined
                    }
                  />
                );
              })}
              {selectedBioware.map((item) => (
                <AugmentationItem
                  key={item.id}
                  item={item}
                  type="bioware"
                  onRemove={() => item.id && removeBioware(item.id)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {totalAugmentations === 0 && (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Augmentations reduce Essence. Each point lost reduces Magic/Resonance by 1.
              </p>
            </div>
          )}

          {/* Summary */}
          {totalAugmentations > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Total: {totalAugmentations} augmentation
                {totalAugmentations !== 1 ? "s" : ""}
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(cyberwareSpent + biowareSpent)}¥
              </span>
            </div>
          )}
        </div>
      </CreationCard>

      {/* Augmentation Modal */}
      <AugmentationModal
        isOpen={isAugModalOpen}
        onClose={() => setIsAugModalOpen(false)}
        onAdd={handleAddAugmentation}
        augmentationType={augModalType}
        remainingEssence={remainingEssence}
        remainingNuyen={remainingNuyen}
        isAwakened={isAwakened}
        isTechnomancer={isTechnomancer}
        currentMagic={magicRating}
        currentResonance={resonanceRating}
        installedCyberlimbs={installedCyberlimbs}
      />

      {/* Enhancement Modal */}
      {enhancementModalCyberware && (
        <CyberwareEnhancementModal
          isOpen={!!enhancementModalCyberware}
          onClose={() => setEnhancementModalCyberware(null)}
          onAdd={handleAddEnhancements}
          parentCyberware={enhancementModalCyberware}
          remainingCapacity={enhancementRemainingCapacity}
          remainingNuyen={remainingNuyen}
        />
      )}

      {/* Cyberlimb Accessory Modal */}
      {accessoryModalCyberlimb && (
        <CyberlimbAccessoryModal
          isOpen={!!accessoryModalCyberlimb}
          onClose={() => setAccessoryModalCyberlimb(null)}
          onAdd={handleAddAccessories}
          parentCyberlimb={accessoryModalCyberlimb}
          remainingCapacity={accessoryRemainingCapacity}
          remainingNuyen={remainingNuyen}
        />
      )}

      {/* Cyberlimb Weapon Modal */}
      {weaponModalCyberlimb && (
        <CyberlimbWeaponModal
          isOpen={!!weaponModalCyberlimb}
          onClose={() => setWeaponModalCyberlimb(null)}
          onAdd={handleAddWeapons}
          parentCyberlimb={weaponModalCyberlimb}
          remainingCapacity={weaponRemainingCapacity}
          remainingNuyen={remainingNuyen}
        />
      )}

      {/* Karma Conversion Modal */}
      {karmaConversionPrompt.modalState && (
        <KarmaConversionModal
          isOpen={karmaConversionPrompt.modalState.isOpen}
          onClose={karmaConversionPrompt.closeModal}
          onConfirm={karmaConversionPrompt.confirmConversion}
          itemName={karmaConversionPrompt.modalState.itemName}
          itemCost={karmaConversionPrompt.modalState.itemCost}
          currentRemaining={remainingNuyen}
          karmaToConvert={karmaConversionPrompt.modalState.karmaToConvert}
          karmaAvailable={karmaRemaining}
          currentKarmaConversion={karmaConversion}
          maxKarmaConversion={10}
        />
      )}
    </>
  );
}
