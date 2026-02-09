"use client";

/**
 * VehicleSystemItemButton
 *
 * List item button for the vehicle system modal left pane.
 * Renders a single item with name, cost, legality badge, and ownership indicator.
 */

import { Check, AlertTriangle, Plane, Waves } from "lucide-react";
import type {
  VehicleCatalogItemData,
  DroneCatalogItemData,
  RCCCatalogItemData,
  AutosoftCatalogItemData,
} from "@/lib/rules/RulesetContext";
import { LegalityBadge } from "../shared/LegalityBadge";
import { formatCurrency, getTypeColor, type VehicleSystemType } from "./vehicleSystemHelpers";

// =============================================================================
// TYPES
// =============================================================================

export interface VehicleSystemItemButtonProps {
  /** The catalog item to render */
  item:
    | VehicleCatalogItemData
    | DroneCatalogItemData
    | RCCCatalogItemData
    | AutosoftCatalogItemData;
  /** Active vehicle system type */
  activeType: VehicleSystemType;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** IDs of items already owned by the character */
  ownedIds: string[];
  /** Remaining nuyen budget */
  remainingNuyen: number;
  /** Click handler for selection */
  onSelect: (id: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function VehicleSystemItemButton({
  item,
  activeType,
  isSelected,
  ownedIds,
  remainingNuyen,
  onSelect,
}: VehicleSystemItemButtonProps) {
  const activeColor = getTypeColor(activeType);
  const isOwned = ownedIds.includes(item.id);

  let displayCost = 0;
  switch (activeType) {
    case "vehicle":
      displayCost = (item as VehicleCatalogItemData).cost;
      break;
    case "drone":
      displayCost = (item as DroneCatalogItemData).cost;
      break;
    case "rcc":
      displayCost = (item as RCCCatalogItemData).cost;
      break;
    case "autosoft":
      displayCost = (item as AutosoftCatalogItemData).costPerRating;
      break;
  }

  const canAfford = displayCost <= remainingNuyen;
  const isDisabled = isOwned;

  // Legality and availability (autosofts don't have legality)
  const itemLegality =
    activeType === "autosoft"
      ? undefined
      : (item as VehicleCatalogItemData | DroneCatalogItemData | RCCCatalogItemData).legality;
  const itemAvailability =
    activeType === "autosoft"
      ? (item as AutosoftCatalogItemData).availabilityPerRating
      : (item as VehicleCatalogItemData | DroneCatalogItemData | RCCCatalogItemData).availability;

  return (
    <button
      key={item.id}
      onClick={() => !isDisabled && onSelect(item.id)}
      disabled={isDisabled}
      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
        isSelected
          ? `bg-${activeColor}-50 text-${activeColor}-700 dark:bg-${activeColor}-900/30 dark:text-${activeColor}-300`
          : isOwned
            ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
            : !canAfford
              ? "text-red-400 dark:text-red-500"
              : `rounded-md text-zinc-700 hover:outline hover:outline-1 hover:outline-${activeColor}-400 dark:text-zinc-300 dark:hover:outline-${activeColor}-500`
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={isOwned ? "line-through" : ""}>{item.name}</span>
        <LegalityBadge legality={itemLegality} availability={itemAvailability} />
        {activeType === "drone" && (item as DroneCatalogItemData).canFly && (
          <span title="Can fly">
            <Plane className="h-3 w-3 text-sky-400" />
          </span>
        )}
        {activeType === "drone" && (item as DroneCatalogItemData).isAquatic && (
          <span title="Aquatic">
            <Waves className="h-3 w-3 text-cyan-400" />
          </span>
        )}
        {activeType === "rcc" && (
          <span className="text-xs text-zinc-400">
            R{(item as RCCCatalogItemData).deviceRating}
          </span>
        )}
        {activeType === "autosoft" && (item as AutosoftCatalogItemData).requiresTarget && (
          <span className="text-[10px] text-amber-500">
            ({(item as AutosoftCatalogItemData).targetType})
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs ${!canAfford && !isOwned ? "text-red-400" : "text-zinc-400"}`}>
          {formatCurrency(displayCost)}¥{activeType === "autosoft" ? "/R" : ""}
        </span>
        {isOwned && <Check className="h-4 w-4 text-emerald-500" />}
        {!canAfford && !isOwned && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
      </div>
    </button>
  );
}
