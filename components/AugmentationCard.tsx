"use client";

/**
 * AugmentationCard - Individual augmentation display for character sheet
 *
 * Shows:
 * - Name, grade, and rating
 * - Essence cost
 * - Attribute bonuses
 * - Wireless bonus indicator
 * - Enhancement slots (for cyberlimbs)
 * - Remove/upgrade actions (post-creation)
 */

import { useState } from "react";
import type { CyberwareItem, BiowareItem, CyberwareGrade, BiowareGrade } from "@/lib/types";
import { Cpu, Heart, Wifi, WifiOff, ChevronDown, ChevronUp, Trash2, ArrowUpCircle } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface AugmentationCardProps {
  /** The augmentation item to display */
  item: CyberwareItem | BiowareItem;
  /** Type of augmentation */
  type: "cyberware" | "bioware";
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Whether the character is in active play (allows removal/upgrade) */
  isActive?: boolean;
  /** Callback when remove is clicked */
  onRemove?: () => void;
  /** Callback when upgrade is clicked */
  onUpgrade?: (newGrade: CyberwareGrade | BiowareGrade) => void;
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

function getGradeDisplayName(grade: CyberwareGrade | BiowareGrade): string {
  const names: Record<string, string> = {
    used: "Used",
    standard: "Standard",
    alpha: "Alphaware",
    beta: "Betaware",
    delta: "Deltaware",
  };
  return names[grade] || grade;
}

function getGradeColor(grade: CyberwareGrade | BiowareGrade): string {
  const colors: Record<string, string> = {
    used: "text-stone-500",
    standard: "text-zinc-400",
    alpha: "text-blue-400",
    beta: "text-purple-400",
    delta: "text-amber-400",
  };
  return colors[grade] || "text-zinc-400";
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    headware: "Headware",
    eyeware: "Eyeware",
    earware: "Earware",
    bodyware: "Bodyware",
    cyberlimb: "Cyberlimb",
    "cyberlimb-enhancement": "Enhancement",
    "cyberlimb-accessory": "Accessory",
    basic: "Basic",
    cultured: "Cultured",
    cosmetic: "Cosmetic",
    "bio-weapons": "Bio-Weapon",
    "chemical-gland": "Chemical Gland",
    organ: "Organ",
  };
  return labels[category] || category;
}

function isCyberware(item: CyberwareItem | BiowareItem): item is CyberwareItem {
  return "enhancements" in item || "capacity" in item;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AugmentationCard({
  item,
  type,
  showActions = false,
  isActive = false,
  onRemove,
  onUpgrade,
  className = "",
}: AugmentationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);

  const isCyberwareItem = type === "cyberware" && isCyberware(item);
  const hasEnhancements = isCyberwareItem && item.enhancements && item.enhancements.length > 0;
  const hasCapacity = isCyberwareItem && item.capacity && item.capacity > 0;
  const hasWirelessBonus = isCyberwareItem && item.wirelessBonus;
  const hasAttributeBonuses = item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0;

  // Available upgrade grades (only higher grades)
  const upgradeGrades: (CyberwareGrade | BiowareGrade)[] = [];
  const gradeOrder = type === "cyberware"
    ? ["used", "standard", "alpha", "beta", "delta"]
    : ["standard", "alpha", "beta", "delta"];
  const currentIndex = gradeOrder.indexOf(item.grade);
  for (let i = currentIndex + 1; i < gradeOrder.length; i++) {
    upgradeGrades.push(gradeOrder[i] as CyberwareGrade | BiowareGrade);
  }

  return (
    <div
      className={`group relative flex flex-col p-3 rounded-lg border transition-all
        bg-zinc-900/50 border-zinc-800 hover:border-zinc-700
        ${type === "cyberware" ? "hover:border-cyan-500/30" : "hover:border-emerald-500/30"}
        ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Type Icon */}
          <div
            className={`flex-shrink-0 p-1.5 rounded ${
              type === "cyberware" ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {type === "cyberware" ? <Cpu className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
          </div>

          {/* Name and Grade */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-100 truncate">{item.name}</span>
              {item.rating && (
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-1.5 rounded">
                  R{item.rating}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className={`font-medium ${getGradeColor(item.grade)}`}>
                {getGradeDisplayName(item.grade)}
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500">{getCategoryLabel(item.category)}</span>
            </div>
          </div>
        </div>

        {/* Essence Cost */}
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-mono text-red-400">{formatEssence(item.essenceCost)}</div>
          <div className="text-[10px] text-zinc-500">ESS</div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="flex items-center gap-3 mt-2 text-[10px]">
        {/* Cost */}
        <span className="text-zinc-400">
          <span className="text-zinc-500">Cost:</span> {formatCurrency(item.cost)}¥
        </span>

        {/* Availability */}
        <span className="text-zinc-400">
          <span className="text-zinc-500">Avail:</span> {item.availability}
          {item.legality === "restricted" && "R"}
          {item.legality === "forbidden" && "F"}
        </span>

        {/* Capacity for cyberlimbs */}
        {hasCapacity && (
          <span className="text-zinc-400">
            <span className="text-zinc-500">Cap:</span> {item.capacityUsed || 0}/{item.capacity}
          </span>
        )}

        {/* Wireless indicator */}
        {hasWirelessBonus && (
          <span className="text-cyan-400" title={item.wirelessBonus}>
            <Wifi className="w-3 h-3 inline" />
          </span>
        )}
      </div>

      {/* Attribute Bonuses */}
      {hasAttributeBonuses && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {Object.entries(item.attributeBonuses!).map(([attr, bonus]) => (
            <span
              key={attr}
              className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono"
            >
              {attr.toUpperCase()} +{bonus}
            </span>
          ))}
          {isCyberwareItem && item.initiativeDiceBonus && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              INIT +{item.initiativeDiceBonus}D6
            </span>
          )}
        </div>
      )}

      {/* Expandable Section */}
      {(hasEnhancements || hasWirelessBonus || item.notes) && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-2 text-[10px] text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? "Less" : "More details"}
          </button>

          {expanded && (
            <div className="mt-2 pt-2 border-t border-zinc-800 space-y-2">
              {/* Wireless Bonus */}
              {hasWirelessBonus && (
                <div className="text-[10px]">
                  <span className="text-cyan-400 font-medium flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Wireless Bonus:
                  </span>
                  <p className="text-zinc-400 mt-0.5">{item.wirelessBonus}</p>
                </div>
              )}

              {/* Enhancements */}
              {hasEnhancements && (
                <div className="text-[10px]">
                  <span className="text-purple-400 font-medium">Installed Enhancements:</span>
                  <ul className="mt-1 space-y-1">
                    {item.enhancements!.map((enh, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-zinc-400">
                        <span className="w-1 h-1 rounded-full bg-purple-500" />
                        {enh.name}
                        {enh.rating && <span className="text-amber-400">R{enh.rating}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <div className="text-[10px]">
                  <span className="text-zinc-500 font-medium">Notes:</span>
                  <p className="text-zinc-400 mt-0.5">{item.notes}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      {showActions && isActive && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-zinc-800">
          {/* Upgrade Button */}
          {upgradeGrades.length > 0 && onUpgrade && (
            <div className="relative">
              <button
                onClick={() => setShowUpgradeOptions(!showUpgradeOptions)}
                className="flex items-center gap-1 px-2 py-1 text-[10px] rounded
                  bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                <ArrowUpCircle className="w-3 h-3" />
                Upgrade
              </button>
              {showUpgradeOptions && (
                <div className="absolute bottom-full left-0 mb-1 p-1 rounded bg-zinc-800 border border-zinc-700 shadow-lg z-10">
                  {upgradeGrades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => {
                        onUpgrade(grade);
                        setShowUpgradeOptions(false);
                      }}
                      className={`block w-full text-left px-2 py-1 text-[10px] rounded hover:bg-zinc-700 transition-colors ${getGradeColor(grade)}`}
                    >
                      {getGradeDisplayName(grade)}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
export function AugmentationCardCompact({
  item,
  type,
  onRemove,
  className = "",
}: {
  item: CyberwareItem | BiowareItem;
  type: "cyberware" | "bioware";
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between p-2 rounded border
        bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 transition-colors
        ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`p-1 rounded ${
            type === "cyberware" ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {type === "cyberware" ? <Cpu className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
        </div>
        <span className="text-xs text-zinc-200 truncate">{item.name}</span>
        <span className={`text-[10px] ${getGradeColor(item.grade)}`}>
          {getGradeDisplayName(item.grade)}
        </span>
        {item.rating && (
          <span className="text-[10px] text-amber-400">R{item.rating}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-red-400">{formatEssence(item.essenceCost)}</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
