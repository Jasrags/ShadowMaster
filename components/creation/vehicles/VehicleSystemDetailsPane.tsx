"use client";

/**
 * VehicleSystemDetailsPane
 *
 * Right-pane detail preview for the vehicle system purchase modal.
 * Shows type-specific details (vehicle stats, drone stats, RCC features,
 * autosoft rating selector) plus cost card and validation warnings.
 */

import {
  Car,
  Bot,
  Wifi,
  Cpu,
  Check,
  AlertTriangle,
  Plus,
  Minus,
  Info,
  Plane,
  Waves,
} from "lucide-react";
import {
  formatHandlingRating,
  type VehicleCatalogItemData,
  type DroneCatalogItemData,
  type RCCCatalogItemData,
  type AutosoftCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { LucideIcon } from "lucide-react";
import {
  formatCurrency,
  getAvailabilityDisplay,
  CATEGORY_DISPLAY_NAMES,
  TYPE_TABS,
  type VehicleSystemType,
} from "./vehicleSystemHelpers";

// =============================================================================
// ICON MAPPING
// =============================================================================

const TYPE_ICONS: Record<VehicleSystemType, LucideIcon> = {
  vehicle: Car,
  drone: Bot,
  rcc: Wifi,
  autosoft: Cpu,
};

// =============================================================================
// TYPES
// =============================================================================

export interface VehicleSystemDetailsPaneProps {
  /** Active vehicle system type */
  activeType: VehicleSystemType;
  /** Currently selected catalog item (null if none) */
  selectedItem:
    | VehicleCatalogItemData
    | DroneCatalogItemData
    | RCCCatalogItemData
    | AutosoftCatalogItemData
    | null;
  /** Current cost of the selected item */
  currentCost: number;
  /** Whether the character can afford the selected item */
  canAffordSelected: boolean;
  /** Whether the selected item is already owned */
  isAlreadyOwned: boolean;
  /** Remaining nuyen budget */
  remainingNuyen: number;
  /** Current autosoft rating selection */
  selectedRating: number;
  /** Maximum available rating for autosoft */
  maxAvailableRating: number;
  /** Rating change handler */
  onRatingChange: (delta: number) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function VehicleSystemDetailsPane({
  activeType,
  selectedItem,
  currentCost,
  canAffordSelected,
  isAlreadyOwned,
  remainingNuyen,
  selectedRating,
  maxAvailableRating,
  onRatingChange,
}: VehicleSystemDetailsPaneProps) {
  if (!selectedItem) {
    const ActiveIcon = TYPE_ICONS[activeType];
    return (
      <div className="flex h-full flex-col items-center justify-center text-zinc-400">
        <ActiveIcon className="h-12 w-12" />
        <p className="mt-4 text-sm">
          Select {activeType === "rcc" ? "an RCC" : `a ${activeType}`} from the list
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Item Header */}
      <div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {selectedItem.name}
        </h3>
        <Subtitle activeType={activeType} selectedItem={selectedItem} />
      </div>

      {/* Type-specific content */}
      {activeType === "vehicle" && (
        <VehicleDetails vehicle={selectedItem as VehicleCatalogItemData} />
      )}
      {activeType === "drone" && <DroneDetails drone={selectedItem as DroneCatalogItemData} />}
      {activeType === "rcc" && <RCCDetails rcc={selectedItem as RCCCatalogItemData} />}
      {activeType === "autosoft" && (
        <AutosoftDetails
          autosoft={selectedItem as AutosoftCatalogItemData}
          selectedRating={selectedRating}
          maxAvailableRating={maxAvailableRating}
          remainingNuyen={remainingNuyen}
          onRatingChange={onRatingChange}
        />
      )}

      {/* Description */}
      {selectedItem.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{selectedItem.description}</p>
      )}

      {/* Cost Card */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Cost{activeType === "autosoft" ? ` (Rating ${selectedRating})` : ""}
          </span>
          <span
            className={`text-lg font-semibold ${
              !canAffordSelected
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {formatCurrency(currentCost)}¥
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Remaining</span>
          <span
            className={`font-medium ${
              remainingNuyen - currentCost < 0
                ? "text-red-600 dark:text-red-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {formatCurrency(remainingNuyen - currentCost)}¥
          </span>
        </div>
      </div>

      {/* Warnings */}
      {isAlreadyOwned && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
          <Check className="h-4 w-4" />
          <span>You already own this {activeType === "rcc" ? "RCC" : activeType}</span>
        </div>
      )}

      {!canAffordSelected && !isAlreadyOwned && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <span>Insufficient funds</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SUBTITLE
// =============================================================================

function Subtitle({
  activeType,
  selectedItem,
}: {
  activeType: VehicleSystemType;
  selectedItem:
    | VehicleCatalogItemData
    | DroneCatalogItemData
    | RCCCatalogItemData
    | AutosoftCatalogItemData;
}) {
  switch (activeType) {
    case "vehicle": {
      const vehicle = selectedItem as VehicleCatalogItemData;
      return (
        <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {CATEGORY_DISPLAY_NAMES[vehicle.category] || vehicle.category}
        </div>
      );
    }
    case "drone": {
      const drone = selectedItem as DroneCatalogItemData;
      return (
        <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="capitalize">{drone.size}</span>
          <span>•</span>
          <span className="capitalize">{drone.droneType}</span>
          {drone.canFly && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-sky-500">
                <Plane className="h-3.5 w-3.5" />
                Aerial
              </span>
            </>
          )}
          {drone.isAquatic && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-500">
                <Waves className="h-3.5 w-3.5" />
                Aquatic
              </span>
            </>
          )}
        </div>
      );
    }
    case "rcc":
      return (
        <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Rigger Command Console</div>
      );
    case "autosoft": {
      const autosoft = selectedItem as AutosoftCatalogItemData;
      return (
        <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {CATEGORY_DISPLAY_NAMES[autosoft.category] || autosoft.category}
        </div>
      );
    }
  }
}

// =============================================================================
// VEHICLE DETAILS
// =============================================================================

function VehicleDetails({ vehicle }: { vehicle: VehicleCatalogItemData }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <StatBox label="Handling" value={formatHandlingRating(vehicle.handling)} />
        <StatBox label="Speed / Accel" value={`${vehicle.speed} / ${vehicle.acceleration}`} />
        <StatBox label="Body / Armor" value={`${vehicle.body} / ${vehicle.armor}`} />
        <StatBox label="Pilot / Sensor" value={`${vehicle.pilot} / ${vehicle.sensor}`} />
      </div>
      <div className="space-y-2">
        {vehicle.seats && <InfoRow label="Seats" value={String(vehicle.seats)} />}
        <InfoRow
          label="Availability"
          value={getAvailabilityDisplay(vehicle.availability, vehicle.legality)}
        />
      </div>
    </>
  );
}

// =============================================================================
// DRONE DETAILS
// =============================================================================

function DroneDetails({ drone }: { drone: DroneCatalogItemData }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <StatBox label="Handling" value={String(drone.handling)} />
        <StatBox label="Speed / Accel" value={`${drone.speed} / ${drone.acceleration}`} />
        <StatBox label="Body / Armor" value={`${drone.body} / ${drone.armor}`} />
        <StatBox label="Pilot / Sensor" value={`${drone.pilot} / ${drone.sensor}`} />
      </div>
      <div className="space-y-2">
        <InfoRow
          label="Availability"
          value={getAvailabilityDisplay(drone.availability, drone.legality)}
        />
      </div>
    </>
  );
}

// =============================================================================
// RCC DETAILS
// =============================================================================

function RCCDetails({ rcc }: { rcc: RCCCatalogItemData }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Device Rating</div>
          <div className="mt-1 font-mono text-2xl font-bold text-purple-600 dark:text-purple-400">
            {rcc.deviceRating}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Data Processing
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {rcc.dataProcessing}
          </div>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Firewall</div>
          <div className="mt-1 font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {rcc.firewall}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <InfoRow
          label="Availability"
          value={getAvailabilityDisplay(rcc.availability, rcc.legality)}
        />
      </div>

      <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
        <div className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          RCC Features
        </div>
        <ul className="mt-2 space-y-1 text-sm text-purple-700 dark:text-purple-300">
          <li>• Share up to {rcc.deviceRating} autosofts with drones</li>
          <li>• Control up to {rcc.deviceRating * 3} drones simultaneously</li>
          <li>• Noise reduction: {rcc.deviceRating}</li>
        </ul>
      </div>
    </>
  );
}

// =============================================================================
// AUTOSOFT DETAILS
// =============================================================================

function AutosoftDetails({
  autosoft,
  selectedRating,
  maxAvailableRating,
  remainingNuyen,
  onRatingChange,
}: {
  autosoft: AutosoftCatalogItemData;
  selectedRating: number;
  maxAvailableRating: number;
  remainingNuyen: number;
  onRatingChange: (delta: number) => void;
}) {
  const currentAvailability = autosoft.availabilityPerRating * selectedRating;

  return (
    <>
      {/* Target Requirement Warning */}
      {autosoft.requiresTarget && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>
            This autosoft requires a specific {autosoft.targetType} target. You&apos;ll specify this
            when assigning to a drone.
          </span>
        </div>
      )}

      {/* Rating Selector */}
      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Rating</label>
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => onRatingChange(-1)}
            disabled={selectedRating <= 1}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              selectedRating > 1
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-zinc-100 font-mono text-xl font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            {selectedRating}
          </div>
          <button
            onClick={() => onRatingChange(1)}
            disabled={
              selectedRating >= maxAvailableRating ||
              autosoft.costPerRating * (selectedRating + 1) > remainingNuyen
            }
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              selectedRating < maxAvailableRating &&
              autosoft.costPerRating * (selectedRating + 1) <= remainingNuyen
                ? "bg-cyan-500 text-white hover:bg-cyan-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="text-xs text-zinc-400">Max: {maxAvailableRating}</span>
        </div>
      </div>

      {/* Stats at current rating */}
      <div className="grid grid-cols-2 gap-3">
        <StatBox label="Availability" value={String(currentAvailability)} />
        <StatBox label="Cost per Rating" value={`${formatCurrency(autosoft.costPerRating)}¥`} />
      </div>
    </>
  );
}

// =============================================================================
// SHARED PRIMITIVES
// =============================================================================

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <span className="font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
  );
}
