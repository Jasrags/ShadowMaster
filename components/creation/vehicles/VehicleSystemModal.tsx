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
import {
  useVehicles,
  useDrones,
  useRCCs,
  useAutosofts,
  formatHandlingRating,
  type VehicleCatalogItemData,
  type DroneCatalogItemData,
  type RCCCatalogItemData,
  type AutosoftCatalogItemData,
  type HandlingRatingData,
} from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { LegalityBadge } from "../shared/LegalityBadge";
import {
  Search,
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

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

/** Vehicle system types */
export type VehicleSystemType = "vehicle" | "drone" | "rcc" | "autosoft";

/** Tab configuration for each type */
const TYPE_TABS: {
  id: VehicleSystemType;
  label: string;
  icon: typeof Car;
  color: string;
  activeColor: string;
}[] = [
  {
    id: "vehicle",
    label: "Vehicles",
    icon: Car,
    color: "text-blue-500",
    activeColor: "bg-blue-500 text-white",
  },
  {
    id: "drone",
    label: "Drones",
    icon: Bot,
    color: "text-green-500",
    activeColor: "bg-green-500 text-white",
  },
  {
    id: "rcc",
    label: "RCCs",
    icon: Wifi,
    color: "text-purple-500",
    activeColor: "bg-purple-500 text-white",
  },
  {
    id: "autosoft",
    label: "Autosofts",
    icon: Cpu,
    color: "text-cyan-500",
    activeColor: "bg-cyan-500 text-white",
  },
];

/** Vehicle subcategories */
const VEHICLE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "bikes", label: "Bikes" },
  { id: "cars", label: "Cars" },
  { id: "trucks", label: "Trucks" },
  { id: "boats", label: "Boats" },
  { id: "submarines", label: "Subs" },
  { id: "fixed-wing", label: "Fixed-Wing" },
  { id: "rotorcraft", label: "Rotorcraft" },
  { id: "vtol", label: "VTOL" },
  { id: "walkers", label: "Walkers" },
] as const;

/** Drone size categories */
const DRONE_SIZES = [
  { id: "all", label: "All" },
  { id: "micro", label: "Micro" },
  { id: "mini", label: "Mini" },
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
] as const;

/** RCC tier categories */
const RCC_TIERS = [
  { id: "all", label: "All" },
  { id: "entry", label: "Entry (1-2)" },
  { id: "professional", label: "Professional (3-4)" },
  { id: "elite", label: "Elite (5-6)" },
] as const;

/** Autosoft category filter */
const AUTOSOFT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "combat", label: "Combat" },
  { id: "perception", label: "Perception" },
  { id: "movement", label: "Movement" },
  { id: "defense", label: "Defense" },
  { id: "stealth", label: "Stealth" },
  { id: "electronic-warfare", label: "EW" },
] as const;

/** Display names for category headers */
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  // Vehicles
  bikes: "Bikes",
  cars: "Cars",
  trucks: "Trucks & Vans",
  boats: "Boats",
  submarines: "Submarines",
  "fixed-wing": "Fixed-Wing Aircraft",
  rotorcraft: "Rotorcraft",
  vtol: "VTOL/LAV",
  walkers: "Walkers",
  // Drones
  micro: "Micro Drones",
  mini: "Mini Drones",
  small: "Small Drones",
  medium: "Medium Drones",
  large: "Large Drones",
  // RCCs
  entry: "Entry Level (Rating 1-2)",
  professional: "Professional (Rating 3-4)",
  elite: "Elite Grade (Rating 5-6)",
  // Autosofts
  combat: "Combat",
  perception: "Perception",
  movement: "Movement",
  defense: "Defense",
  stealth: "Stealth",
  "electronic-warfare": "Electronic Warfare",
};

// =============================================================================
// TYPES
// =============================================================================

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
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getAvailabilityDisplay(availability: number, legality?: ItemLegality): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

function isItemAvailable(availability: number): boolean {
  return availability <= MAX_AVAILABILITY;
}

function getRatingTier(rating: number): string {
  if (rating <= 2) return "entry";
  if (rating <= 4) return "professional";
  return "elite";
}

function getMaxAvailableRating(availabilityPerRating: number, maxRating: number): number {
  if (availabilityPerRating === 0) return maxRating;
  const maxByAvailability = Math.floor(MAX_AVAILABILITY / availabilityPerRating);
  return Math.min(maxRating, maxByAvailability);
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

  // Get subcategories for current type
  const subcategories = useMemo(() => {
    switch (activeType) {
      case "vehicle":
        return VEHICLE_CATEGORIES;
      case "drone":
        return DRONE_SIZES;
      case "rcc":
        return RCC_TIERS;
      case "autosoft":
        return AUTOSOFT_CATEGORIES;
    }
  }, [activeType]);

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
    // Cast to types that have cost property
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

  // Get type-specific colors
  const getTypeColor = (type: VehicleSystemType) => {
    switch (type) {
      case "vehicle":
        return "blue";
      case "drone":
        return "green";
      case "rcc":
        return "purple";
      case "autosoft":
        return "cyan";
    }
  };

  const activeColor = getTypeColor(activeType);

  // Render item button
  const renderItemButton = (
    item:
      | VehicleCatalogItemData
      | DroneCatalogItemData
      | RCCCatalogItemData
      | AutosoftCatalogItemData
  ) => {
    const isSelected = selectedItemId === item.id;
    let isOwned = false;
    let canAfford = true;
    let displayCost = 0;

    switch (activeType) {
      case "vehicle":
        isOwned = ownedVehicleIds.includes(item.id);
        displayCost = (item as VehicleCatalogItemData).cost;
        break;
      case "drone":
        isOwned = ownedDroneIds.includes(item.id);
        displayCost = (item as DroneCatalogItemData).cost;
        break;
      case "rcc":
        isOwned = ownedRCCIds.includes(item.id);
        displayCost = (item as RCCCatalogItemData).cost;
        break;
      case "autosoft":
        isOwned = ownedAutosoftIds.includes(item.id);
        displayCost = (item as AutosoftCatalogItemData).costPerRating; // Show per-rating cost
        break;
    }

    canAfford = displayCost <= remainingNuyen;
    const isDisabled = isOwned;

    // Get legality and availability for the badge (autosofts don't have legality)
    const itemLegality =
      activeType === "autosoft"
        ? undefined
        : (item as VehicleCatalogItemData | DroneCatalogItemData | RCCCatalogItemData).legality;
    // Autosofts have availabilityPerRating, other items have availability
    const itemAvailability =
      activeType === "autosoft"
        ? (item as AutosoftCatalogItemData).availabilityPerRating
        : (item as VehicleCatalogItemData | DroneCatalogItemData | RCCCatalogItemData).availability;

    return (
      <button
        key={item.id}
        onClick={() => !isDisabled && setSelectedItemId(item.id)}
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
  };

  // Render details pane
  const renderDetails = () => {
    if (!selectedItem) {
      const ActiveIcon = TYPE_TABS.find((t) => t.id === activeType)?.icon || Car;
      return (
        <div className="flex h-full flex-col items-center justify-center text-zinc-400">
          <ActiveIcon className="h-12 w-12" />
          <p className="mt-4 text-sm">
            Select {activeType === "rcc" ? "an RCC" : `a ${activeType}`} from the list
          </p>
        </div>
      );
    }

    const cost = getCurrentCost();

    return (
      <div className="space-y-6">
        {/* Item Header */}
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {selectedItem.name}
          </h3>
          {renderSubtitle()}
        </div>

        {/* Type-specific content */}
        {renderTypeSpecificContent()}

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
              {formatCurrency(cost)}¥
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Remaining</span>
            <span
              className={`font-medium ${
                remainingNuyen - cost < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatCurrency(remainingNuyen - cost)}¥
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
  };

  // Render subtitle based on type
  const renderSubtitle = () => {
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
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Rigger Command Console
          </div>
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
  };

  // Render type-specific content
  const renderTypeSpecificContent = () => {
    switch (activeType) {
      case "vehicle":
        return renderVehicleDetails();
      case "drone":
        return renderDroneDetails();
      case "rcc":
        return renderRCCDetails();
      case "autosoft":
        return renderAutosoftDetails();
    }
  };

  const renderVehicleDetails = () => {
    const vehicle = selectedItem as VehicleCatalogItemData;
    return (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Handling</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {formatHandlingRating(vehicle.handling)}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Speed / Accel
            </div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {vehicle.speed} / {vehicle.acceleration}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Body / Armor</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {vehicle.body} / {vehicle.armor}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Pilot / Sensor
            </div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {vehicle.pilot} / {vehicle.sensor}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2">
          {vehicle.seats && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Seats</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{vehicle.seats}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Availability</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {getAvailabilityDisplay(vehicle.availability, vehicle.legality)}
            </span>
          </div>
        </div>
      </>
    );
  };

  const renderDroneDetails = () => {
    const drone = selectedItem as DroneCatalogItemData;
    return (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Handling</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {drone.handling}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Speed / Accel
            </div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {drone.speed} / {drone.acceleration}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Body / Armor</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {drone.body} / {drone.armor}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Pilot / Sensor
            </div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {drone.pilot} / {drone.sensor}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Availability</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {getAvailabilityDisplay(drone.availability, drone.legality)}
            </span>
          </div>
        </div>
      </>
    );
  };

  const renderRCCDetails = () => {
    const rcc = selectedItem as RCCCatalogItemData;
    return (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Device Rating
            </div>
            <div className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
              {rcc.deviceRating}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Data Processing
            </div>
            <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {rcc.dataProcessing}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Firewall</div>
            <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {rcc.firewall}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Availability</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {getAvailabilityDisplay(rcc.availability, rcc.legality)}
            </span>
          </div>
        </div>

        {/* Features Info */}
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
  };

  const renderAutosoftDetails = () => {
    const autosoft = selectedItem as AutosoftCatalogItemData;
    const currentAvailability = autosoft.availabilityPerRating * selectedRating;

    return (
      <>
        {/* Target Requirement Warning */}
        {autosoft.requiresTarget && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              This autosoft requires a specific {autosoft.targetType} target. You&apos;ll specify
              this when assigning to a drone.
            </span>
          </div>
        )}

        {/* Rating Selector */}
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Rating</label>
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => handleRatingChange(-1)}
              disabled={selectedRating <= 1}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                selectedRating > 1
                  ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-zinc-100 text-xl font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              {selectedRating}
            </div>
            <button
              onClick={() => handleRatingChange(1)}
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
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Availability</div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {currentAvailability}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Cost per Rating
            </div>
            <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {formatCurrency(autosoft.costPerRating)}¥
            </div>
          </div>
        </div>
      </>
    );
  };

  // Get active tab info
  const activeTab = TYPE_TABS.find((t) => t.id === activeType)!;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Vehicle/Drone" onClose={close}>
            <div
              className={`ml-2 rounded-lg p-1.5 ${
                activeType === "vehicle"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                  : activeType === "drone"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300"
                    : activeType === "rcc"
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
                      : "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300"
              }`}
            >
              <activeTab.icon className="h-4 w-4" />
            </div>
          </ModalHeader>

          {/* Type Tabs */}
          <div className="flex gap-2 border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {TYPE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTypeChange(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? tab.activeColor
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={`Search ${activeType === "rcc" ? "RCCs" : activeType + "s"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 ${
                  activeType === "vehicle"
                    ? "focus:border-blue-500 focus:ring-blue-500"
                    : activeType === "drone"
                      ? "focus:border-green-500 focus:ring-green-500"
                      : activeType === "rcc"
                        ? "focus:border-purple-500 focus:ring-purple-500"
                        : "focus:border-cyan-500 focus:ring-cyan-500"
                }`}
              />
            </div>

            {/* Subcategory Filter */}
            <div className="mt-3 flex flex-wrap gap-2">
              {subcategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSubcategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    subcategory === cat.id
                      ? activeType === "vehicle"
                        ? "bg-blue-500 text-white"
                        : activeType === "drone"
                          ? "bg-green-500 text-white"
                          : activeType === "rcc"
                            ? "bg-purple-500 text-white"
                            : "bg-cyan-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

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
                    {items.map((item) => renderItemButton(item))}
                  </div>
                ))}
                {Object.keys(itemsByCategory).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">
                    No {activeType === "rcc" ? "RCCs" : activeType + "s"} found
                  </div>
                )}
              </div>

              {/* Right Pane - Details */}
              <div className="w-1/2 overflow-y-auto p-6">{renderDetails()}</div>
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
