"use client";

/**
 * CyberlimbCard - Individual cyberlimb display for character sheet
 *
 * Shows:
 * - Name, location, appearance, grade
 * - Essence cost
 * - STR/AGI attributes (base + customized)
 * - Capacity bar with breakdown
 * - Wireless indicator with toggle
 * - Expandable enhancements/accessories list
 * - Remove/manage actions (post-creation)
 */

import { useState } from "react";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";
import type { CyberwareGrade } from "@/lib/types";
import {
  Cpu,
  Wifi,
  WifiOff,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Zap,
  Target,
  Settings,
} from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface CyberlimbCardProps {
  /** The cyberlimb item to display */
  limb: CyberlimbItem;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Whether the character is in active play (allows removal/upgrade) */
  isActive?: boolean;
  /** Callback when wireless toggle is clicked */
  onToggleWireless?: (enabled: boolean) => void;
  /** Callback when remove is clicked */
  onRemove?: () => void;
  /** Callback when add enhancement is clicked */
  onAddEnhancement?: () => void;
  /** Callback when add accessory is clicked */
  onAddAccessory?: () => void;
  /** Callback when view details is clicked */
  onViewDetails?: () => void;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatEssence(value: number): string {
  return value.toFixed(2);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getGradeDisplayName(grade: CyberwareGrade): string {
  const names: Record<string, string> = {
    used: "Used",
    standard: "Standard",
    alpha: "Alphaware",
    beta: "Betaware",
    delta: "Deltaware",
  };
  return names[grade] || grade;
}

function getGradeColor(grade: CyberwareGrade): string {
  const colors: Record<string, string> = {
    used: "text-stone-500",
    standard: "text-zinc-400",
    alpha: "text-blue-400",
    beta: "text-purple-400",
    delta: "text-amber-400",
  };
  return colors[grade] || "text-zinc-400";
}

function getLocationDisplayName(location: string): string {
  const names: Record<string, string> = {
    "left-arm": "Left Arm",
    "right-arm": "Right Arm",
    "left-leg": "Left Leg",
    "right-leg": "Right Leg",
    "left-hand": "Left Hand",
    "right-hand": "Right Hand",
    "left-foot": "Left Foot",
    "right-foot": "Right Foot",
    torso: "Torso",
    skull: "Skull",
  };
  return names[location] || location;
}

function getAppearanceDisplayName(appearance: string): string {
  const names: Record<string, string> = {
    obvious: "Obvious",
    synthetic: "Synthetic",
    "synthetic-realistic": "Realistic Synthetic",
  };
  return names[appearance] || appearance;
}

function getLimbTypeDisplayName(limbType: string): string {
  const names: Record<string, string> = {
    "full-arm": "Full Arm",
    "full-leg": "Full Leg",
    "lower-arm": "Lower Arm",
    "lower-leg": "Lower Leg",
    hand: "Hand",
    foot: "Foot",
    torso: "Torso",
    skull: "Skull",
  };
  return names[limbType] || limbType;
}

// =============================================================================
// CAPACITY BAR COMPONENT
// =============================================================================

interface CapacityBarProps {
  total: number;
  used: number;
  showBreakdown?: boolean;
  enhancementUsed?: number;
  accessoryUsed?: number;
  weaponUsed?: number;
}

function CapacityBar({
  total,
  used,
  showBreakdown = false,
  enhancementUsed = 0,
  accessoryUsed = 0,
  weaponUsed = 0,
}: CapacityBarProps) {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const remaining = total - used;

  // Color based on capacity usage
  const getBarColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-cyan-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-zinc-500">Capacity</span>
        <span className="font-mono">
          <span className={percentage >= 90 ? "text-red-400" : "text-cyan-400"}>
            {used}
          </span>
          <span className="text-zinc-500">/{total}</span>
          <span className="text-zinc-600 ml-1">({remaining} free)</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getBarColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showBreakdown && (enhancementUsed > 0 || accessoryUsed > 0 || weaponUsed > 0) && (
        <div className="flex gap-2 text-[9px] text-zinc-500">
          {enhancementUsed > 0 && (
            <span>
              <span className="text-purple-400">{enhancementUsed}</span> enh
            </span>
          )}
          {accessoryUsed > 0 && (
            <span>
              <span className="text-blue-400">{accessoryUsed}</span> acc
            </span>
          )}
          {weaponUsed > 0 && (
            <span>
              <span className="text-red-400">{weaponUsed}</span> wpn
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CyberlimbCard({
  limb,
  showActions = false,
  isActive = false,
  onToggleWireless,
  onRemove,
  onAddEnhancement,
  onAddAccessory,
  onViewDetails,
  className = "",
}: CyberlimbCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate capacity breakdown
  const enhancementCapacity = limb.enhancements.reduce((sum, e) => sum + e.capacityUsed, 0);
  const accessoryCapacity = limb.accessories.reduce((sum, a) => sum + a.capacityUsed, 0);
  const weaponCapacity = limb.weapons.reduce((sum, w) => sum + w.capacityUsed, 0);
  const totalUsed = enhancementCapacity + accessoryCapacity + weaponCapacity;

  // Calculate effective attributes
  const effectiveStrength = limb.baseStrength + limb.customStrength +
    limb.enhancements
      .filter((e) => e.enhancementType === "strength")
      .reduce((sum, e) => sum + e.rating, 0);
  const effectiveAgility = limb.baseAgility + limb.customAgility +
    limb.enhancements
      .filter((e) => e.enhancementType === "agility")
      .reduce((sum, e) => sum + e.rating, 0);

  const hasEnhancements = limb.enhancements.length > 0;
  const hasAccessories = limb.accessories.length > 0;
  const hasWeapons = limb.weapons.length > 0;
  const hasExpandableContent = hasEnhancements || hasAccessories || hasWeapons;

  return (
    <div
      className={`group relative flex flex-col p-3 rounded-lg border transition-all
        bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:border-cyan-500/30
        ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Type Icon */}
          <div className="flex-shrink-0 p-1.5 rounded bg-cyan-500/10 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>

          {/* Name and Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-100 truncate">{limb.name}</span>
              {/* Wireless indicator */}
              {limb.wirelessEnabled ? (
                <Wifi className="w-3 h-3 text-cyan-400" />
              ) : (
                <WifiOff className="w-3 h-3 text-zinc-600" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className={`font-medium ${getGradeColor(limb.grade)}`}>
                {getGradeDisplayName(limb.grade)}
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500">{getLocationDisplayName(limb.location)}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500">{getAppearanceDisplayName(limb.appearance)}</span>
            </div>
          </div>
        </div>

        {/* Essence Cost */}
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-mono text-red-400">{formatEssence(limb.essenceCost)}</div>
          <div className="text-[10px] text-zinc-500">ESS</div>
        </div>
      </div>

      {/* Attributes Row */}
      <div className="flex items-center gap-3 mt-2">
        {/* STR */}
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20">
          <Target className="w-3 h-3 text-orange-400" />
          <span className="text-[10px] text-zinc-400">STR</span>
          <span className="text-xs font-mono font-bold text-orange-400">{effectiveStrength}</span>
          {limb.customStrength > 0 && (
            <span className="text-[9px] text-zinc-500">
              ({limb.baseStrength}+{limb.customStrength})
            </span>
          )}
        </div>
        {/* AGI */}
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 border border-green-500/20">
          <Zap className="w-3 h-3 text-green-400" />
          <span className="text-[10px] text-zinc-400">AGI</span>
          <span className="text-xs font-mono font-bold text-green-400">{effectiveAgility}</span>
          {limb.customAgility > 0 && (
            <span className="text-[9px] text-zinc-500">
              ({limb.baseAgility}+{limb.customAgility})
            </span>
          )}
        </div>
        {/* Cost */}
        <span className="text-[10px] text-zinc-400 ml-auto">
          {formatCurrency(limb.cost)}¥
        </span>
      </div>

      {/* Capacity Bar */}
      <div className="mt-2">
        <CapacityBar
          total={limb.baseCapacity}
          used={totalUsed}
          showBreakdown={expanded}
          enhancementUsed={enhancementCapacity}
          accessoryUsed={accessoryCapacity}
          weaponUsed={weaponCapacity}
        />
      </div>

      {/* Expandable Section */}
      {hasExpandableContent && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-2 text-[10px] text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? "Less" : "Show installed"} ({limb.enhancements.length + limb.accessories.length + limb.weapons.length})
          </button>

          {expanded && (
            <div className="mt-2 pt-2 border-t border-zinc-800 space-y-2">
              {/* Enhancements */}
              {hasEnhancements && (
                <div className="text-[10px]">
                  <span className="text-purple-400 font-medium">Enhancements:</span>
                  <ul className="mt-1 space-y-1">
                    {limb.enhancements.map((enh) => (
                      <li key={enh.id} className="flex items-center justify-between text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-purple-500" />
                          {enh.name}
                          <span className="text-amber-400">R{enh.rating}</span>
                        </div>
                        <span className="text-zinc-600">[{enh.capacityUsed}]</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Accessories */}
              {hasAccessories && (
                <div className="text-[10px]">
                  <span className="text-blue-400 font-medium">Accessories:</span>
                  <ul className="mt-1 space-y-1">
                    {limb.accessories.map((acc) => (
                      <li key={acc.id} className="flex items-center justify-between text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-blue-500" />
                          {acc.name}
                          {acc.rating && <span className="text-amber-400">R{acc.rating}</span>}
                        </div>
                        <span className="text-zinc-600">[{acc.capacityUsed}]</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weapons */}
              {hasWeapons && (
                <div className="text-[10px]">
                  <span className="text-red-400 font-medium">Weapons:</span>
                  <ul className="mt-1 space-y-1">
                    {limb.weapons.map((wpn) => (
                      <li key={wpn.id} className="flex items-center justify-between text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-red-500" />
                          {wpn.name}
                          <span className="text-zinc-500">
                            {wpn.damage} | AP {wpn.ap}
                          </span>
                        </div>
                        <span className="text-zinc-600">[{wpn.capacityUsed}]</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      {showActions && isActive && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-zinc-800">
          {/* Add Enhancement */}
          {onAddEnhancement && (
            <button
              onClick={onAddEnhancement}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded
                bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Enhancement
            </button>
          )}

          {/* Add Accessory */}
          {onAddAccessory && (
            <button
              onClick={onAddAccessory}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded
                bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Accessory
            </button>
          )}

          {/* Wireless Toggle */}
          {onToggleWireless && (
            <button
              onClick={() => onToggleWireless(!limb.wirelessEnabled)}
              className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded transition-colors ${
                limb.wirelessEnabled
                  ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                  : "bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {limb.wirelessEnabled ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              {limb.wirelessEnabled ? "On" : "Off"}
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* View Details */}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded
                bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700 transition-colors"
            >
              <Settings className="w-3 h-3" />
              Details
            </button>
          )}

          {/* Remove Button */}
          {onRemove && (
            <button
              onClick={onRemove}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded
                bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for lists
 */
export function CyberlimbCardCompact({
  limb,
  onClick,
  className = "",
}: {
  limb: CyberlimbItem;
  onClick?: () => void;
  className?: string;
}) {
  const effectiveStrength = limb.baseStrength + limb.customStrength +
    limb.enhancements
      .filter((e) => e.enhancementType === "strength")
      .reduce((sum, e) => sum + e.rating, 0);
  const effectiveAgility = limb.baseAgility + limb.customAgility +
    limb.enhancements
      .filter((e) => e.enhancementType === "agility")
      .reduce((sum, e) => sum + e.rating, 0);

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-2 rounded border text-left
        bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 hover:border-cyan-500/30 transition-colors
        ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
          <Cpu className="w-3 h-3" />
        </div>
        <div className="min-w-0">
          <span className="text-xs text-zinc-200 truncate block">{limb.name}</span>
          <span className="text-[10px] text-zinc-500">
            {getLocationDisplayName(limb.location)}
          </span>
        </div>
        <span className={`text-[10px] ${getGradeColor(limb.grade)}`}>
          {getGradeDisplayName(limb.grade)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono">
          <span className="text-orange-400">S{effectiveStrength}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-green-400">A{effectiveAgility}</span>
        </span>
        <span className="text-xs font-mono text-red-400">{formatEssence(limb.essenceCost)}</span>
        {limb.wirelessEnabled ? (
          <Wifi className="w-3 h-3 text-cyan-400" />
        ) : (
          <WifiOff className="w-3 h-3 text-zinc-600" />
        )}
      </div>
    </button>
  );
}
