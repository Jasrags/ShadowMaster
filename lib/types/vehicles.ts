/**
 * Vehicle & Drone Types for Shadowrun 5E
 *
 * Based on SR5 Core Rulebook Chapter 11 (Vehicles) and Chapter 8 (Riggers)
 *
 * Note: These are CATALOG types for ruleset data. Character-owned items
 * use the simpler interfaces in character.ts
 */

import type { ID, ItemLegality } from "./core";

// =============================================================================
// VEHICLE TYPES
// =============================================================================

/**
 * Vehicle category types
 */
export type VehicleCategory =
  | "bikes"
  | "cars"
  | "trucks"
  | "boats"
  | "submarines"
  | "fixed-wing"
  | "rotorcraft"
  | "vtol"
  | "lav"
  | "walkers";

/**
 * Handling rating - can be single value or on-road/off-road pair
 */
export type HandlingRating = number | { onRoad: number; offRoad: number };

/**
 * Base vehicle interface matching SR5 CRB p.462
 */
export interface Vehicle {
  id: ID;
  name: string;
  category: VehicleCategory;

  /** Handling rating (single or on-road/off-road) */
  handling: HandlingRating;

  /** Maximum speed rating */
  speed: number;

  /** Acceleration rating */
  acceleration: number;

  /** Body (structural integrity) */
  body: number;

  /** Armor rating */
  armor: number;

  /** Pilot/autopilot rating */
  pilot: number;

  /** Sensor array rating */
  sensor: number;

  /** Number of passenger seats (not applicable to drones) */
  seats?: number;

  /** Device rating for Matrix integration */
  deviceRating?: number;

  /** Cost in nuyen */
  cost: number;

  /** Availability rating */
  availability: number;

  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;

  /** Description */
  description?: string;

  /** Source book reference */
  source?: string;

  /** Page number reference */
  page?: number;
}

/**
 * Vehicle catalog item (from ruleset data)
 */
export interface VehicleCatalogItem extends Vehicle {
  /** Standard modifications included */
  standardMods?: string[];

  /** Available modification slots by type */
  modSlots?: {
    powertrain?: number;
    protection?: number;
    weapons?: number;
    body?: number;
    electromagnetic?: number;
    cosmetic?: number;
  };
}

// =============================================================================
// DRONE TYPES
// =============================================================================

/**
 * Drone size categories per SR5 CRB p.465
 */
export type DroneSize = "micro" | "mini" | "small" | "medium" | "large" | "huge";

/**
 * Drone interface extending Vehicle
 */
export interface Drone extends Omit<Vehicle, "category" | "seats"> {
  /** Drone size category */
  size: DroneSize;

  /** Drone type/category */
  droneType: "surveillance" | "combat" | "utility" | "anthroform" | "aquatic" | "ground" | "aerial";

  /** Whether drone can fly */
  canFly?: boolean;

  /** Whether drone can operate underwater */
  isAquatic?: boolean;

  /** Weapon mount information */
  weaponMounts?: {
    standard?: number;
    heavy?: number;
  };
}

/**
 * Drone catalog item (from ruleset data)
 */
export interface DroneCatalogItem extends Drone {
  /** Standard equipment included */
  standardEquipment?: string[];
}

// =============================================================================
// RCC (RIGGER COMMAND CONSOLE) TYPES
// =============================================================================

/**
 * Rigger Command Console interface per SR5 CRB p.267
 */
export interface RCC {
  id: ID;
  name: string;

  /** Device rating (1-6) */
  deviceRating: number;

  /** Data processing attribute */
  dataProcessing: number;

  /** Firewall attribute */
  firewall: number;

  /** Cost in nuyen */
  cost: number;

  /** Availability rating */
  availability: number;

  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;

  /** Description */
  description?: string;

  /** Source book reference */
  source?: string;
}

/**
 * RCC catalog item (from ruleset data)
 */
export interface RCCCatalogItem extends RCC {
  /** Number of program slots */
  programSlots?: number;

  /** Special features */
  features?: string[];
}

// =============================================================================
// AUTOSOFT TYPES
// =============================================================================

/**
 * Autosoft categories
 */
export type AutosoftCategory =
  | "perception"
  | "defense"
  | "movement"
  | "combat"
  | "electronic-warfare"
  | "stealth";

/**
 * Autosoft interface per SR5 CRB p.269
 */
export interface Autosoft {
  id: ID;
  name: string;

  /** Autosoft category */
  category: AutosoftCategory;

  /** Maximum rating available */
  maxRating: number;

  /** Cost per rating in nuyen */
  costPerRating: number;

  /** Availability per rating */
  availabilityPerRating: number;

  /** Whether this autosoft targets a specific weapon/vehicle type */
  requiresTarget?: boolean;

  /** Target type (e.g., "weapon" for Targeting, "vehicle" for Maneuvering) */
  targetType?: "weapon" | "vehicle";

  /** Description */
  description?: string;

  /** Source book reference */
  source?: string;
}

/**
 * Autosoft catalog item (from ruleset data)
 */
export interface AutosoftCatalogItem extends Autosoft {
  /** Example targets */
  exampleTargets?: string[];
}

// =============================================================================
// VEHICLE MODIFICATION TYPES
// =============================================================================

/**
 * Vehicle modification categories
 */
export type VehicleModCategory =
  | "powertrain"
  | "protection"
  | "weapons"
  | "body"
  | "electromagnetic"
  | "cosmetic";

/**
 * Vehicle modification interface
 */
export interface VehicleModification {
  id: ID;
  name: string;
  category: VehicleModCategory;

  /** Modification slot cost */
  slotCost: number;

  /** Cost in nuyen (can be formula like "Body × 1000") */
  cost: number | string;

  /** Availability */
  availability: number;

  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;

  /** Effect description */
  effect: string;

  /** Stat modifications */
  statModifiers?: {
    handling?: number;
    speed?: number;
    acceleration?: number;
    body?: number;
    armor?: number;
    pilot?: number;
    sensor?: number;
  };

  /** Description */
  description?: string;

  /** Source book reference */
  source?: string;
}

// =============================================================================
// OWNED ITEM TYPES (for Character interface)
// =============================================================================

/**
 * Vehicle owned by a character
 */
export interface OwnedVehicle {
  /** Reference to catalog vehicle ID */
  vehicleId: ID;

  /** Custom name given by player */
  customName?: string;

  /** Installed modifications */
  modifications?: Array<{
    modId: ID;
    rating?: number;
  }>;

  /** Current condition (for gameplay) */
  condition?: {
    damage: number;
    matrix: number;
  };

  /** Notes */
  notes?: string;
}

/**
 * Drone owned by a character
 */
export interface OwnedDrone {
  /** Reference to catalog drone ID */
  droneId: ID;

  /** Custom name given by player */
  customName?: string;

  /** Installed autosofts */
  autosofts?: Array<{
    autosoftId: ID;
    rating: number;
    target?: string;
  }>;

  /** Installed modifications */
  modifications?: Array<{
    modId: ID;
    rating?: number;
  }>;

  /** Current condition (for gameplay) */
  condition?: {
    damage: number;
    matrix: number;
  };

  /** Notes */
  notes?: string;
}

/**
 * RCC owned by a character
 */
export interface OwnedRCC {
  /** Reference to catalog RCC ID */
  rccId: ID;

  /** Custom name given by player */
  customName?: string;

  /** Currently running autosofts (shared to all slaved drones) */
  runningAutosofts?: Array<{
    autosoftId: ID;
    rating: number;
    target?: string;
  }>;

  /** Notes */
  notes?: string;
}

/**
 * Autosoft owned by a character (not installed on a specific drone)
 */
export interface OwnedAutosoft {
  /** Reference to catalog autosoft ID */
  autosoftId: ID;

  /** Purchased rating */
  rating: number;

  /** Target for Maneuvering/Targeting autosofts */
  target?: string;
}

// =============================================================================
// CATALOG DATA STRUCTURES (for ruleset JSON)
// =============================================================================

/**
 * Complete vehicles module data structure
 */
export interface VehiclesModuleData {
  /** Vehicle categories metadata */
  categories: Array<{
    id: VehicleCategory;
    name: string;
    description?: string;
  }>;

  /** Drone size categories metadata */
  droneSizes: Array<{
    id: DroneSize;
    name: string;
    bodyRange: string;
    description?: string;
  }>;

  /** Vehicle catalog by category */
  vehicles: {
    bikes: VehicleCatalogItem[];
    cars: VehicleCatalogItem[];
    trucks: VehicleCatalogItem[];
    boats: VehicleCatalogItem[];
    submarines: VehicleCatalogItem[];
    fixedWing: VehicleCatalogItem[];
    rotorcraft: VehicleCatalogItem[];
    vtol: VehicleCatalogItem[];
    lav: VehicleCatalogItem[];
    walkers: VehicleCatalogItem[];
  };

  /** Drone catalog */
  drones: DroneCatalogItem[];

  /** RCC catalog */
  rccs: RCCCatalogItem[];

  /** Autosoft catalog */
  autosofts: AutosoftCatalogItem[];

  /** Vehicle modifications catalog */
  modifications?: VehicleModification[];
}
