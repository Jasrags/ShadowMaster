"use client";

/**
 * VehicleSystemModal
 *
 * Unified two-column modal for adding vehicles, drones, RCCs, and autosofts
 * during character creation. Features:
 * - Top-level type tabs for switching between item types
 * - Subcategory filtering with item counts
 * - Search functionality
 * - Type-specific details panes
 * - Bulk-add support (stays open after adding)
 *
 * Uses BaseModal for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import {
  useVehicles,
  useDrones,
  useRCCs,
  useAutosofts,
  type VehicleCatalogItemData,
  type DroneCatalogItemData,
  type RCCCatalogItemData,
  type AutosoftCatalogItemData,
  type HandlingRatingData,
} from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import {
  formatCurrency,
  isItemAvailable,
  getRatingTier,
  getMaxAvailableRating,
  getTypeColor,
  CATEGORY_DISPLAY_NAMES,
  type VehicleSystemType,
} from "./vehicleSystemHelpers";
import { VehicleSystemItemButton } from "./VehicleSystemItemButton";
import { VehicleSystemDetailsPane } from "./VehicleSystemDetailsPane";
import { VehicleSystemFilters, VehicleSystemHeaderIcon } from "./VehicleSystemFilters";

// =============================================================================
// TYPES
// =============================================================================

export { type VehicleSystemType } from "./vehicleSystemHelpers";

export interface VehicleSelection {
  catalogId: string;
  name: string;
  category: string;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  handling: HandlingRatingData;
  speed: number;
  acceleration: number;
  body: number;
  armor: number;
  pilot: number;
  sensor: number;
  seats?: number;
}

export interface DroneSelection {
  catalogId: string;
  name: string;
  size: string;
  droneType: string;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  handling: number;
  speed: number;
  acceleration: number;
  body: number;
  armor: number;
  pilot: number;
  sensor: number;
  canFly?: boolean;
  isAquatic?: boolean;
}

export interface RCCSelection {
  catalogId: string;
  name: string;
  deviceRating: number;
  dataProcessing: number;
  firewall: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
}

export interface AutosoftSelection {
  catalogId: string;
  name: string;
  category: string;
  rating: number;
  cost: number;
  availability: number;
  requiresTarget?: boolean;
  targetType?: "weapon" | "vehicle";
  target?: string;
}

/** Discriminated union for all selection types */
export type VehicleSystemSelection =
  | { type: "vehicle"; selection: VehicleSelection }
  | { type: "drone"; selection: DroneSelection }
  | { type: "rcc"; selection: RCCSelection }
  | { type: "autosoft"; selection: AutosoftSelection };

interface VehicleSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selection: VehicleSystemSelection) => void;
  initialType?: VehicleSystemType;
  remainingNuyen: number;
  ownedItems?: {
    vehicleIds?: string[];
    droneIds?: string[];
    rccIds?: string[];
    autosoftIds?: string[];
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

export function VehicleSystemModal({
  isOpen,
  onClose,
  onAdd,
  initialType = "vehicle",
  remainingNuyen,
  ownedItems = {},
}: VehicleSystemModalProps) {
  // Catalog hooks
  const vehicles = useVehicles();
  const drones = useDrones();
  const rccs = useRCCs();
  const autosofts = useAutosofts();

  // State
  const [activeType, setActiveType] = useState<VehicleSystemType>(initialType);
  const [subcategory, setSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(1);
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Get owned IDs for current type (memoized to avoid dependency issues)
  const ownedVehicleIds = useMemo(() => ownedItems.vehicleIds ?? [], [ownedItems.vehicleIds]);
  const ownedDroneIds = useMemo(() => ownedItems.droneIds ?? [], [ownedItems.droneIds]);
  const ownedRCCIds = useMemo(() => ownedItems.rccIds ?? [], [ownedItems.rccIds]);
  const ownedAutosoftIds = useMemo(() => ownedItems.autosoftIds ?? [], [ownedItems.autosoftIds]);

  // Track previous isOpen state to detect when modal opens
  const prevIsOpenRef = useRef(isOpen);
  const prevInitialTypeRef = useRef(initialType);

  // Reset state when modal opens or initial type changes
  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;
    const typeChanged = initialType !== prevInitialTypeRef.current;

    if (justOpened || (isOpen && typeChanged)) {
      setActiveType(initialType);
      setSubcategory("all");
      setSelectedItemId(null);
      setSelectedRating(1);
    }

    prevIsOpenRef.current = isOpen;
    prevInitialTypeRef.current = initialType;
  }, [isOpen, initialType]);

  // Reset state when modal closes
  const resetState = useCallback(() => {
    setActiveType(initialType);
    setSubcategory("all");
    setSearchQuery("");
    setSelectedItemId(null);
    setSelectedRating(1);
    setAddedThisSession(0);
  }, [initialType]);

  // Reset for next item (preserves filters)
  const resetForNextItem = useCallback(() => {
    setSelectedItemId(null);
    setSelectedRating(1);
  }, []);

  // Handle type change
  const handleTypeChange = useCallback((newType: VehicleSystemType) => {
    setActiveType(newType);
    setSubcategory("all");
    setSelectedItemId(null);
    setSelectedRating(1);
  }, []);

  // Filter items based on current type and filters
  const filteredItems = useMemo(() => {
    let items: (
      | VehicleCatalogItemData
      | DroneCatalogItemData
      | RCCCatalogItemData
      | AutosoftCatalogItemData
    )[] = [];

    switch (activeType) {
      case "vehicle":
        items = [...vehicles].filter((v) => isItemAvailable(v.availability));
        if (subcategory !== "all") {
          items = items.filter((v) => (v as VehicleCatalogItemData).category === subcategory);
        }
        break;
      case "drone":
        items = [...drones].filter((d) => isItemAvailable(d.availability));
        if (subcategory !== "all") {
          items = items.filter((d) => (d as DroneCatalogItemData).size === subcategory);
        }
        break;
      case "rcc":
        items = [...rccs].filter((r) => isItemAvailable(r.availability));
        if (subcategory !== "all") {
          items = items.filter(
            (r) => getRatingTier((r as RCCCatalogItemData).deviceRating) === subcategory
          );
        }
        break;
      case "autosoft":
        items = [...autosofts].filter(
          (a) => getMaxAvailableRating(a.availabilityPerRating, a.maxRating) >= 1
        );
        if (subcategory !== "all") {
          items = items.filter((a) => (a as AutosoftCatalogItemData).category === subcategory);
        }
        break;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(query));
    }

    return items;
  }, [activeType, subcategory, searchQuery, vehicles, drones, rccs, autosofts]);

  // Group items by subcategory
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredItems> = {};

    filteredItems.forEach((item) => {
      let cat: string;
      switch (activeType) {
        case "vehicle":
          cat = (item as VehicleCatalogItemData).category || "other";
          break;
        case "drone":
          cat = (item as DroneCatalogItemData).size || "other";
          break;
        case "rcc":
          cat = getRatingTier((item as RCCCatalogItemData).deviceRating);
          break;
        case "autosoft":
          cat = (item as AutosoftCatalogItemData).category || "other";
          break;
      }

      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    // Sort items within each category
    Object.values(grouped).forEach((itemList) => {
      itemList.sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [filteredItems, activeType]);

  // Get selected item
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;

    switch (activeType) {
      case "vehicle":
        return vehicles.find((v) => v.id === selectedItemId) || null;
      case "drone":
        return drones.find((d) => d.id === selectedItemId) || null;
      case "rcc":
        return rccs.find((r) => r.id === selectedItemId) || null;
      case "autosoft":
        return autosofts.find((a) => a.id === selectedItemId) || null;
    }
  }, [selectedItemId, activeType, vehicles, drones, rccs, autosofts]);

  // Calculate cost for autosofts (rating-based)
  const autosoftCost = useMemo(() => {
    if (activeType !== "autosoft" || !selectedItem) return 0;
    const autosoft = selectedItem as AutosoftCatalogItemData;
    return autosoft.costPerRating * selectedRating;
  }, [activeType, selectedItem, selectedRating]);

  // Get max available rating for autosofts
  const maxAvailableRating = useMemo(() => {
    if (activeType !== "autosoft" || !selectedItem) return 6;
    const autosoft = selectedItem as AutosoftCatalogItemData;
    return getMaxAvailableRating(autosoft.availabilityPerRating, autosoft.maxRating);
  }, [activeType, selectedItem]);

  // Get current cost based on type
  const getCurrentCost = useCallback(() => {
    if (!selectedItem) return 0;
    if (activeType === "autosoft") return autosoftCost;
    return (selectedItem as VehicleCatalogItemData | DroneCatalogItemData | RCCCatalogItemData)
      .cost;
  }, [selectedItem, activeType, autosoftCost]);

  // Validation
  const canAffordSelected = getCurrentCost() <= remainingNuyen;

  const isAlreadyOwned = useMemo(() => {
    if (!selectedItem) return false;
    switch (activeType) {
      case "vehicle":
        return ownedVehicleIds.includes(selectedItem.id);
      case "drone":
        return ownedDroneIds.includes(selectedItem.id);
      case "rcc":
        return ownedRCCIds.includes(selectedItem.id);
      case "autosoft":
        return ownedAutosoftIds.includes(selectedItem.id);
    }
  }, [selectedItem, activeType, ownedVehicleIds, ownedDroneIds, ownedRCCIds, ownedAutosoftIds]);

  // Handle rating change for autosofts
  const handleRatingChange = useCallback(
    (delta: number) => {
      const newRating = Math.max(1, Math.min(maxAvailableRating, selectedRating + delta));
      setSelectedRating(newRating);
    },
    [maxAvailableRating, selectedRating]
  );

  // Handle add
  const handleAdd = useCallback(() => {
    if (!selectedItem || !canAffordSelected || isAlreadyOwned) return;

    let selection: VehicleSystemSelection;

    switch (activeType) {
      case "vehicle": {
        const vehicle = selectedItem as VehicleCatalogItemData;
        selection = {
          type: "vehicle",
          selection: {
            catalogId: vehicle.id,
            name: vehicle.name,
            category: vehicle.category,
            cost: vehicle.cost,
            availability: vehicle.availability,
            legality: vehicle.legality,
            handling: vehicle.handling,
            speed: vehicle.speed,
            acceleration: vehicle.acceleration,
            body: vehicle.body,
            armor: vehicle.armor,
            pilot: vehicle.pilot,
            sensor: vehicle.sensor,
            seats: vehicle.seats,
          },
        };
        break;
      }
      case "drone": {
        const drone = selectedItem as DroneCatalogItemData;
        selection = {
          type: "drone",
          selection: {
            catalogId: drone.id,
            name: drone.name,
            size: drone.size,
            droneType: drone.droneType,
            cost: drone.cost,
            availability: drone.availability,
            legality: drone.legality,
            handling: drone.handling,
            speed: drone.speed,
            acceleration: drone.acceleration,
            body: drone.body,
            armor: drone.armor,
            pilot: drone.pilot,
            sensor: drone.sensor,
            canFly: drone.canFly,
            isAquatic: drone.isAquatic,
          },
        };
        break;
      }
      case "rcc": {
        const rcc = selectedItem as RCCCatalogItemData;
        selection = {
          type: "rcc",
          selection: {
            catalogId: rcc.id,
            name: rcc.name,
            deviceRating: rcc.deviceRating,
            dataProcessing: rcc.dataProcessing,
            firewall: rcc.firewall,
            cost: rcc.cost,
            availability: rcc.availability,
            legality: rcc.legality,
          },
        };
        break;
      }
      case "autosoft": {
        const autosoft = selectedItem as AutosoftCatalogItemData;
        selection = {
          type: "autosoft",
          selection: {
            catalogId: autosoft.id,
            name: autosoft.name,
            category: autosoft.category,
            rating: selectedRating,
            cost: autosoftCost,
            availability: autosoft.availabilityPerRating * selectedRating,
            requiresTarget: autosoft.requiresTarget,
            targetType: autosoft.targetType,
          },
        };
        break;
      }
    }

    onAdd(selection);
    setAddedThisSession((prev) => prev + 1);
    resetForNextItem();
  }, [
    selectedItem,
    activeType,
    selectedRating,
    autosoftCost,
    canAffordSelected,
    isAlreadyOwned,
    onAdd,
    resetForNextItem,
  ]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Get owned IDs for the current type
  const currentOwnedIds = useMemo(() => {
    switch (activeType) {
      case "vehicle":
        return ownedVehicleIds;
      case "drone":
        return ownedDroneIds;
      case "rcc":
        return ownedRCCIds;
      case "autosoft":
        return ownedAutosoftIds;
    }
  }, [activeType, ownedVehicleIds, ownedDroneIds, ownedRCCIds, ownedAutosoftIds]);

  const activeColor = getTypeColor(activeType);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Vehicle/Drone" onClose={close}>
            <VehicleSystemHeaderIcon activeType={activeType} />
          </ModalHeader>

          <VehicleSystemFilters
            activeType={activeType}
            onTypeChange={handleTypeChange}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            subcategory={subcategory}
            onSubcategoryChange={setSubcategory}
          />

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - Item List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {Object.entries(itemsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <div className="sticky top-0 z-10 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {CATEGORY_DISPLAY_NAMES[category] || category}
                    </div>
                    {items.map((item) => (
                      <VehicleSystemItemButton
                        key={item.id}
                        item={item}
                        activeType={activeType}
                        isSelected={selectedItemId === item.id}
                        ownedIds={currentOwnedIds}
                        remainingNuyen={remainingNuyen}
                        onSelect={setSelectedItemId}
                      />
                    ))}
                  </div>
                ))}
                {Object.keys(itemsByCategory).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">
                    No {activeType === "rcc" ? "RCCs" : activeType + "s"} found
                  </div>
                )}
              </div>

              {/* Right Pane - Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                <VehicleSystemDetailsPane
                  activeType={activeType}
                  selectedItem={selectedItem}
                  currentCost={getCurrentCost()}
                  canAffordSelected={canAffordSelected}
                  isAlreadyOwned={isAlreadyOwned}
                  remainingNuyen={remainingNuyen}
                  selectedRating={selectedRating}
                  maxAvailableRating={maxAvailableRating}
                  onRatingChange={handleRatingChange}
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span
                  className={`mr-2 ${
                    activeType === "vehicle"
                      ? "text-blue-600 dark:text-blue-400"
                      : activeType === "drone"
                        ? "text-green-600 dark:text-green-400"
                        : activeType === "rcc"
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-cyan-600 dark:text-cyan-400"
                  }`}
                >
                  {addedThisSession} added
                </span>
              )}
              <span>
                Budget:{" "}
                <span
                  className={`font-medium ${remainingNuyen < 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}
                >
                  {formatCurrency(remainingNuyen)}¥
                </span>{" "}
                remaining
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Done
              </button>
              <button
                onClick={handleAdd}
                disabled={!selectedItem || !canAffordSelected || isAlreadyOwned}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedItem && canAffordSelected && !isAlreadyOwned
                    ? activeType === "vehicle"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : activeType === "drone"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : activeType === "rcc"
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "bg-cyan-500 text-white hover:bg-cyan-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                <Plus className="h-4 w-4" />
                Add{" "}
                {activeType === "rcc"
                  ? "RCC"
                  : activeType.charAt(0).toUpperCase() + activeType.slice(1)}
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
