"use client";

/**
 * CyberlimbList - List of all cyberlimbs for a character
 *
 * Displays:
 * - All installed cyberlimbs with cards
 * - Total essence cost from cyberlimbs
 * - Add new cyberlimb button
 * - Empty state with explanation
 */

import { useMemo, useCallback, useState } from "react";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";
import { CyberlimbCard } from "./CyberlimbCard";
import { Cpu, Plus, Wifi, WifiOff } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface CyberlimbListProps {
  /** Array of cyberlimbs to display */
  cyberlimbs: CyberlimbItem[];
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Whether the character is in active play */
  isActive?: boolean;
  /** Callback when add new cyberlimb is clicked */
  onAddCyberlimb?: () => void;
  /** Callback when wireless is toggled on a limb */
  onToggleWireless?: (limbId: string, enabled: boolean) => void;
  /** Callback when remove is clicked on a limb */
  onRemoveLimb?: (limbId: string) => void;
  /** Callback when add enhancement is clicked on a limb */
  onAddEnhancement?: (limbId: string) => void;
  /** Callback when add accessory is clicked on a limb */
  onAddAccessory?: (limbId: string) => void;
  /** Callback when view details is clicked on a limb */
  onViewDetails?: (limbId: string) => void;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatEssence(value: number): string {
  return value.toFixed(2);
}

// Group cyberlimbs by body region for organized display
function groupByRegion(cyberlimbs: CyberlimbItem[]): Map<string, CyberlimbItem[]> {
  const groups = new Map<string, CyberlimbItem[]>();
  const regionOrder = ["left-arm", "right-arm", "left-leg", "right-leg", "torso", "skull", "other"];

  // Initialize groups in order
  for (const region of regionOrder) {
    groups.set(region, []);
  }

  for (const limb of cyberlimbs) {
    // Determine region from location
    let region = "other";
    if (limb.location.includes("arm") || limb.location.includes("hand")) {
      region = limb.location.includes("left") ? "left-arm" : "right-arm";
    } else if (limb.location.includes("leg") || limb.location.includes("foot")) {
      region = limb.location.includes("left") ? "left-leg" : "right-leg";
    } else if (limb.location === "torso") {
      region = "torso";
    } else if (limb.location === "skull") {
      region = "skull";
    }

    const group = groups.get(region) || [];
    group.push(limb);
    groups.set(region, group);
  }

  // Remove empty groups
  for (const [key, value] of groups.entries()) {
    if (value.length === 0) {
      groups.delete(key);
    }
  }

  return groups;
}

function getRegionDisplayName(region: string): string {
  const names: Record<string, string> = {
    "left-arm": "Left Arm",
    "right-arm": "Right Arm",
    "left-leg": "Left Leg",
    "right-leg": "Right Leg",
    torso: "Torso",
    skull: "Skull",
    other: "Other",
  };
  return names[region] || region;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CyberlimbList({
  cyberlimbs,
  showActions = false,
  isActive = false,
  onAddCyberlimb,
  onToggleWireless,
  onRemoveLimb,
  onAddEnhancement,
  onAddAccessory,
  onViewDetails,
  className = "",
}: CyberlimbListProps) {
  const [groupByLocation, setGroupByLocation] = useState(false);

  // Calculate totals
  const totals = useMemo(() => {
    const essence = cyberlimbs.reduce((sum, limb) => sum + limb.essenceCost, 0);
    const cost = cyberlimbs.reduce((sum, limb) => sum + limb.cost, 0);
    const enhancements = cyberlimbs.reduce((sum, limb) => sum + limb.enhancements.length, 0);
    const accessories = cyberlimbs.reduce((sum, limb) => sum + limb.accessories.length, 0);
    const wirelessCount = cyberlimbs.filter((limb) => limb.wirelessEnabled).length;
    return { essence, cost, enhancements, accessories, wirelessCount };
  }, [cyberlimbs]);

  // Group limbs by region if enabled
  const groupedLimbs = useMemo(() => {
    if (!groupByLocation) return null;
    return groupByRegion(cyberlimbs);
  }, [cyberlimbs, groupByLocation]);

  // Handlers that pass limbId
  const handleToggleWireless = useCallback(
    (limbId: string) => (enabled: boolean) => {
      onToggleWireless?.(limbId, enabled);
    },
    [onToggleWireless]
  );

  const handleRemove = useCallback(
    (limbId: string) => () => {
      onRemoveLimb?.(limbId);
    },
    [onRemoveLimb]
  );

  const handleAddEnhancement = useCallback(
    (limbId: string) => () => {
      onAddEnhancement?.(limbId);
    },
    [onAddEnhancement]
  );

  const handleAddAccessory = useCallback(
    (limbId: string) => () => {
      onAddAccessory?.(limbId);
    },
    [onAddAccessory]
  );

  const handleViewDetails = useCallback(
    (limbId: string) => () => {
      onViewDetails?.(limbId);
    },
    [onViewDetails]
  );

  // Empty state
  if (cyberlimbs.length === 0) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="p-6 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/30 text-center">
          <Cpu className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
          <p className="text-sm text-zinc-400">No cyberlimbs installed</p>
          <p className="text-[10px] text-zinc-500 mt-1">
            Cyberlimbs replace natural limbs with mechanical prosthetics
          </p>
          {showActions && onAddCyberlimb && (
            <button
              onClick={onAddCyberlimb}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 mx-auto text-xs rounded
                bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors border border-cyan-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Install Cyberlimb
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header with summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-zinc-200">Cyberlimbs</span>
          <span className="text-xs text-zinc-500">({cyberlimbs.length})</span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          {/* Wireless count */}
          <span className="flex items-center gap-1 text-zinc-400">
            {totals.wirelessCount > 0 ? (
              <Wifi className="w-3 h-3 text-cyan-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-zinc-600" />
            )}
            {totals.wirelessCount}/{cyberlimbs.length}
          </span>

          {/* Total essence */}
          <span className="text-zinc-400">
            <span className="text-zinc-500">ESS:</span>{" "}
            <span className="text-red-400 font-mono">{formatEssence(totals.essence)}</span>
          </span>

          {/* Group toggle */}
          <button
            onClick={() => setGroupByLocation(!groupByLocation)}
            className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
              groupByLocation
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-zinc-800 text-zinc-500 hover:text-zinc-400"
            }`}
          >
            {groupByLocation ? "Grouped" : "List"}
          </button>
        </div>
      </div>

      {/* Cyberlimb list */}
      {groupByLocation && groupedLimbs ? (
        // Grouped view
        <div className="space-y-4">
          {Array.from(groupedLimbs.entries()).map(([region, limbs]) => (
            <div key={region}>
              <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
                {getRegionDisplayName(region)}
              </div>
              <div className="space-y-2">
                {limbs.map((limb) => (
                  <CyberlimbCard
                    key={limb.id || limb.catalogId}
                    limb={limb}
                    showActions={showActions}
                    isActive={isActive}
                    onToggleWireless={onToggleWireless ? handleToggleWireless(limb.id!) : undefined}
                    onRemove={onRemoveLimb && limb.id ? handleRemove(limb.id) : undefined}
                    onAddEnhancement={
                      onAddEnhancement && limb.id ? handleAddEnhancement(limb.id) : undefined
                    }
                    onAddAccessory={
                      onAddAccessory && limb.id ? handleAddAccessory(limb.id) : undefined
                    }
                    onViewDetails={
                      onViewDetails && limb.id ? handleViewDetails(limb.id) : undefined
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Flat list view
        <div className="space-y-2">
          {cyberlimbs.map((limb) => (
            <CyberlimbCard
              key={limb.id || limb.catalogId}
              limb={limb}
              showActions={showActions}
              isActive={isActive}
              onToggleWireless={onToggleWireless ? handleToggleWireless(limb.id!) : undefined}
              onRemove={onRemoveLimb && limb.id ? handleRemove(limb.id) : undefined}
              onAddEnhancement={
                onAddEnhancement && limb.id ? handleAddEnhancement(limb.id) : undefined
              }
              onAddAccessory={onAddAccessory && limb.id ? handleAddAccessory(limb.id) : undefined}
              onViewDetails={onViewDetails && limb.id ? handleViewDetails(limb.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Add button */}
      {showActions && onAddCyberlimb && (
        <button
          onClick={onAddCyberlimb}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-dashed
            border-zinc-700 text-xs text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/30
            bg-zinc-900/30 hover:bg-cyan-500/5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Install New Cyberlimb
        </button>
      )}

      {/* Summary footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] text-zinc-500">
        <div className="flex items-center gap-3">
          <span>
            <span className="text-purple-400">{totals.enhancements}</span> enhancements
          </span>
          <span>
            <span className="text-blue-400">{totals.accessories}</span> accessories
          </span>
        </div>
        <span>
          Total:{" "}
          <span className="text-zinc-400">{new Intl.NumberFormat().format(totals.cost)}¥</span>
        </span>
      </div>
    </div>
  );
}
