"use client";

/**
 * CyberlimbDetailPanel - Detailed view of a single cyberlimb
 *
 * Shows:
 * - Full limb information (name, location, grade, appearance)
 * - Attribute breakdown (base + custom + enhancements)
 * - Capacity visualization with breakdown
 * - List of enhancements with remove option
 * - List of accessories with remove option
 * - List of weapons with remove option
 * - Wireless toggle
 * - Installation date and modification history
 */

import { useMemo } from "react";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";
import type { CyberwareGrade } from "@/lib/types";
import {
  Cpu,
  Wifi,
  WifiOff,
  Trash2,
  Plus,
  Target,
  Zap,
  Shield,
  Clock,
  ChevronRight,
} from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface CyberlimbDetailPanelProps {
  /** The cyberlimb to display */
  limb: CyberlimbItem;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Whether the character is in active play */
  isActive?: boolean;
  /** Callback when wireless is toggled */
  onToggleWireless?: (enabled: boolean) => void;
  /** Callback when add enhancement is clicked */
  onAddEnhancement?: () => void;
  /** Callback when remove enhancement is clicked */
  onRemoveEnhancement?: (enhancementId: string) => void;
  /** Callback when add accessory is clicked */
  onAddAccessory?: () => void;
  /** Callback when remove accessory is clicked */
  onRemoveAccessory?: (accessoryId: string) => void;
  /** Callback when remove limb is clicked */
  onRemoveLimb?: () => void;
  /** Callback when close/back is clicked */
  onClose?: () => void;
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

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoString;
  }
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
    used: "text-stone-400",
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
    "left-lower-arm": "Left Lower Arm",
    "right-lower-arm": "Right Lower Arm",
    "left-lower-leg": "Left Lower Leg",
    "right-lower-leg": "Right Lower Leg",
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
// COMPONENT
// =============================================================================

export function CyberlimbDetailPanel({
  limb,
  showActions = false,
  isActive = false,
  onToggleWireless,
  onAddEnhancement,
  onRemoveEnhancement,
  onAddAccessory,
  onRemoveAccessory,
  onRemoveLimb,
  onClose,
  className = "",
}: CyberlimbDetailPanelProps) {
  // Calculate capacity breakdown
  const capacityBreakdown = useMemo(() => {
    const enhancements = limb.enhancements.reduce((sum, e) => sum + e.capacityUsed, 0);
    const accessories = limb.accessories.reduce((sum, a) => sum + a.capacityUsed, 0);
    const weapons = limb.weapons.reduce((sum, w) => sum + w.capacityUsed, 0);
    const total = enhancements + accessories + weapons;
    const remaining = limb.baseCapacity - total;
    return { enhancements, accessories, weapons, total, remaining };
  }, [limb]);

  // Calculate effective attributes
  const attributes = useMemo(() => {
    const strengthEnh = limb.enhancements.find((e) => e.enhancementType === "strength");
    const agilityEnh = limb.enhancements.find((e) => e.enhancementType === "agility");
    const armorEnh = limb.enhancements.find((e) => e.enhancementType === "armor");

    return {
      strength: {
        base: limb.baseStrength,
        custom: limb.customStrength,
        enhancement: strengthEnh?.rating ?? 0,
        total: limb.baseStrength + limb.customStrength + (strengthEnh?.rating ?? 0),
      },
      agility: {
        base: limb.baseAgility,
        custom: limb.customAgility,
        enhancement: agilityEnh?.rating ?? 0,
        total: limb.baseAgility + limb.customAgility + (agilityEnh?.rating ?? 0),
      },
      armor: armorEnh?.rating ?? 0,
    };
  }, [limb]);

  return (
    <div className={`flex flex-col bg-zinc-900/80 rounded-lg border border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          )}
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">{limb.name}</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className={getGradeColor(limb.grade)}>{getGradeDisplayName(limb.grade)}</span>
              <span>•</span>
              <span>{getLocationDisplayName(limb.location)}</span>
              <span>•</span>
              <span>{getAppearanceDisplayName(limb.appearance)}</span>
            </div>
          </div>
        </div>

        {/* Wireless Toggle */}
        {showActions && isActive && onToggleWireless && (
          <button
            onClick={() => onToggleWireless(!limb.wirelessEnabled)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              limb.wirelessEnabled
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-zinc-800 text-zinc-500 border border-zinc-700"
            }`}
          >
            {limb.wirelessEnabled ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : (
              <WifiOff className="w-3.5 h-3.5" />
            )}
            {limb.wirelessEnabled ? "Wireless On" : "Wireless Off"}
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 p-4 border-b border-zinc-800 bg-zinc-900/50">
        {/* Essence */}
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase">Essence</div>
          <div className="text-xl font-bold font-mono text-red-400">
            {formatEssence(limb.essenceCost)}
          </div>
        </div>
        {/* Cost */}
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase">Cost</div>
          <div className="text-xl font-bold font-mono text-zinc-200">
            {formatCurrency(limb.cost)}¥
          </div>
        </div>
        {/* Availability */}
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase">Avail</div>
          <div className="text-xl font-bold font-mono text-zinc-200">{limb.availability}</div>
        </div>
        {/* Capacity */}
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase">Capacity</div>
          <div className="text-xl font-bold font-mono">
            <span className={capacityBreakdown.remaining <= 0 ? "text-red-400" : "text-cyan-400"}>
              {capacityBreakdown.remaining}
            </span>
            <span className="text-zinc-600">/{limb.baseCapacity}</span>
          </div>
        </div>
      </div>

      {/* Attributes Section */}
      <div className="p-4 border-b border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
          Attributes
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {/* Strength */}
          <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Strength</span>
            </div>
            <div className="text-2xl font-bold font-mono text-orange-400 mb-1">
              {attributes.strength.total}
            </div>
            <div className="text-[10px] text-zinc-500">
              {attributes.strength.base} base
              {attributes.strength.custom > 0 && ` + ${attributes.strength.custom} custom`}
              {attributes.strength.enhancement > 0 && ` + ${attributes.strength.enhancement} enh`}
            </div>
          </div>

          {/* Agility */}
          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Agility</span>
            </div>
            <div className="text-2xl font-bold font-mono text-green-400 mb-1">
              {attributes.agility.total}
            </div>
            <div className="text-[10px] text-zinc-500">
              {attributes.agility.base} base
              {attributes.agility.custom > 0 && ` + ${attributes.agility.custom} custom`}
              {attributes.agility.enhancement > 0 && ` + ${attributes.agility.enhancement} enh`}
            </div>
          </div>

          {/* Armor */}
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Armor</span>
            </div>
            <div className="text-2xl font-bold font-mono text-blue-400 mb-1">
              +{attributes.armor}
            </div>
            <div className="text-[10px] text-zinc-500">
              {attributes.armor > 0 ? "From enhancement" : "No armor enhancement"}
            </div>
          </div>
        </div>
      </div>

      {/* Enhancements Section */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Enhancements
            <span className="text-zinc-600 ml-1">({limb.enhancements.length})</span>
          </h4>
          {showActions && isActive && onAddEnhancement && (
            <button
              onClick={onAddEnhancement}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded
                bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          )}
        </div>

        {limb.enhancements.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No enhancements installed</p>
        ) : (
          <div className="space-y-2">
            {limb.enhancements.map((enh) => (
              <div
                key={enh.id}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50 border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <div>
                    <span className="text-sm text-zinc-200">{enh.name}</span>
                    <span className="ml-2 text-xs text-amber-400">R{enh.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">[{enh.capacityUsed}]</span>
                  {showActions && isActive && onRemoveEnhancement && (
                    <button
                      onClick={() => onRemoveEnhancement(enh.id)}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accessories Section */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Accessories
            <span className="text-zinc-600 ml-1">({limb.accessories.length})</span>
          </h4>
          {showActions && isActive && onAddAccessory && (
            <button
              onClick={onAddAccessory}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded
                bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          )}
        </div>

        {limb.accessories.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No accessories installed</p>
        ) : (
          <div className="space-y-2">
            {limb.accessories.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50 border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <span className="text-sm text-zinc-200">{acc.name}</span>
                    {acc.rating && (
                      <span className="ml-2 text-xs text-amber-400">R{acc.rating}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">[{acc.capacityUsed}]</span>
                  {showActions && isActive && onRemoveAccessory && (
                    <button
                      onClick={() => onRemoveAccessory(acc.id)}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weapons Section */}
      {limb.weapons.length > 0 && (
        <div className="p-4 border-b border-zinc-800">
          <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
            Weapons
            <span className="text-zinc-600 ml-1">({limb.weapons.length})</span>
          </h4>
          <div className="space-y-2">
            {limb.weapons.map((wpn) => (
              <div
                key={wpn.id}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/50 border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <div>
                    <span className="text-sm text-zinc-200">{wpn.name}</span>
                    <span className="ml-2 text-xs text-zinc-500">
                      {wpn.damage} | AP {wpn.ap}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-zinc-500">[{wpn.capacityUsed}]</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer with metadata and remove action */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <Clock className="w-3 h-3" />
          <span>Installed {formatDate(limb.installedAt)}</span>
          {limb.modificationHistory.length > 0 && (
            <span className="text-zinc-600">• {limb.modificationHistory.length} modifications</span>
          )}
        </div>

        {showActions && isActive && onRemoveLimb && (
          <button
            onClick={onRemoveLimb}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg
              bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Cyberlimb
          </button>
        )}
      </div>
    </div>
  );
}
