/**
 * Gear State Types
 *
 * Types for tracking equipment operational state including readiness,
 * wireless connectivity, device condition, and ammunition.
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import type { ID, ItemLegality } from "./core";

// =============================================================================
// EQUIPMENT READINESS
// =============================================================================

/**
 * Readiness state for equipment items.
 * Not all states apply to all gear types.
 *
 * - readied: In hand, immediately usable (weapons)
 * - holstered: Accessible, Simple Action to ready (weapons, some gear)
 * - worn: Currently worn (armor, clothing)
 * - pocketed: Small items in pockets, Free Action access
 * - carried: In bag/backpack, Complex Action to retrieve (encumbering)
 * - stored: Legacy synonym for "carried" — kept for backward compatibility
 * - stashed: Off-site storage (safehouse, vehicle trunk); narrative time to retrieve
 */
export type EquipmentReadiness =
  | "readied"
  | "holstered"
  | "worn"
  | "pocketed"
  | "carried"
  | "stored"
  | "stashed";

/**
 * Valid readiness states by gear category.
 * Used for validation during state transitions.
 */
export const VALID_READINESS_STATES: Record<string, EquipmentReadiness[]> = {
  weapon: ["readied", "holstered", "carried", "stored", "stashed"],
  armor: ["worn", "carried", "stored", "stashed"],
  clothing: ["worn", "pocketed", "carried", "stored", "stashed"],
  gear: ["worn", "holstered", "pocketed", "carried", "stored", "stashed"],
  electronics: ["worn", "holstered", "pocketed", "carried", "stored", "stashed"],
};

/**
 * Action cost for equipment state transitions.
 * null means the transition is not valid.
 */
export type TransitionActionCost = "free" | "simple" | "complex" | "narrative" | null;

/**
 * Map of valid state transitions and their action costs.
 * Format: [fromState][toState] = actionCost
 */
export const STATE_TRANSITION_COSTS: Record<
  EquipmentReadiness,
  Partial<Record<EquipmentReadiness, TransitionActionCost>>
> = {
  readied: {
    holstered: "simple",
    pocketed: "free",
    carried: "complex",
    stored: "complex",
    stashed: "narrative",
  },
  holstered: {
    readied: "simple",
    pocketed: "simple",
    carried: "simple",
    stored: "simple",
    stashed: "narrative",
  },
  worn: {
    carried: "complex",
    stored: "complex",
    stashed: "narrative",
  },
  pocketed: {
    readied: "free",
    holstered: "free",
    carried: "simple",
    stored: "simple",
    stashed: "narrative",
  },
  carried: {
    readied: "complex",
    holstered: "simple",
    worn: "complex",
    pocketed: "simple",
    stored: "free",
    stashed: "narrative",
  },
  stored: {
    readied: "complex",
    holstered: "simple",
    worn: "complex",
    pocketed: "simple",
    carried: "free",
    stashed: "narrative",
  },
  stashed: {
    carried: "narrative",
    stored: "narrative",
  },
};

// =============================================================================
// DEVICE CONDITION
// =============================================================================

/**
 * Condition state for Matrix-capable devices.
 *
 * - functional: Operating normally
 * - bricked: Disabled by Matrix damage, repairable
 * - destroyed: Permanently disabled, not repairable
 */
export type DeviceCondition = "functional" | "bricked" | "destroyed";

/**
 * Devices that can have condition tracked.
 */
export type MatrixCapableDevice =
  | "cyberdeck"
  | "commlink"
  | "rcc"
  | "drone"
  | "vehicle"
  | "smartgun"
  | "cyberware";

// =============================================================================
// STASH LOCATIONS
// =============================================================================

/**
 * Where stashed gear is stored off-site.
 */
export type StashLocationType = "home" | "safehouse" | "vehicle" | "storage" | "custom";

/**
 * Details about a stash location.
 */
export interface StashLocationInfo {
  type: StashLocationType;
  /** Custom location name (required when type is "custom") */
  customName?: string;
}

// =============================================================================
// CONTAINMENT
// =============================================================================

/**
 * Reference to a containing item (e.g., item inside a backpack or vehicle trunk).
 */
export interface ContainmentRef {
  /** ID of the container item */
  containerId: string;
  /** Named slot within the container (optional) */
  slot?: string;
}

/**
 * Properties that make a gear item act as a container.
 * Any GearItem with containerProperties can hold other items.
 */
export interface ContainerProperties {
  /** Maximum weight the container can hold (kg) */
  weightCapacity: number;
  /** Maximum number of item slots (optional) */
  slotCapacity?: number;
  /** Restrict which gear categories can be stored (optional, all if undefined) */
  allowedCategories?: string[];
  /** Whether the container is rigid (prevents flexible packing) */
  rigid?: boolean;
}

// =============================================================================
// UNIFIED GEAR STATE
// =============================================================================

/**
 * Unified state for all gear items.
 * Contains common state properties applicable across gear types.
 */
export interface GearState {
  /** Current readiness state */
  readiness: EquipmentReadiness;

  /** Whether wireless is enabled for this item (if applicable) */
  wirelessEnabled: boolean;

  /** Device condition for Matrix-capable devices (if applicable) */
  condition?: DeviceCondition;

  /** Device power state; absent for non-electronic items, defaults true for electronics */
  active?: boolean;

  /** Reference to containing item (e.g., weapon in holster, gear in backpack) */
  containedIn?: ContainmentRef;

  /** Where stashed gear is located (only meaningful when readiness is "stashed") */
  stashLocation?: StashLocationInfo;
}

/**
 * Normalize a readiness value, mapping the deprecated "stored" to "carried"
 * for internal use. External APIs can still accept "stored".
 */
export function normalizeReadiness(readiness: EquipmentReadiness): EquipmentReadiness {
  return readiness === "stored" ? "carried" : readiness;
}

/**
 * Default gear state for new items.
 */
export const DEFAULT_GEAR_STATE: GearState = {
  readiness: "carried",
  wirelessEnabled: true,
};

/**
 * Default state by gear category.
 */
export const DEFAULT_STATE_BY_CATEGORY: Record<string, Partial<GearState>> = {
  weapon: { readiness: "holstered", wirelessEnabled: true },
  armor: { readiness: "worn", wirelessEnabled: true },
  clothing: { readiness: "worn", wirelessEnabled: false },
  cyberdeck: { readiness: "worn", wirelessEnabled: true, condition: "functional", active: true },
  commlink: { readiness: "worn", wirelessEnabled: true, condition: "functional", active: true },
  rcc: { readiness: "carried", wirelessEnabled: true, condition: "functional", active: true },
  drone: { readiness: "carried", wirelessEnabled: true, condition: "functional", active: true },
};

// =============================================================================
// AMMUNITION & MAGAZINES
// =============================================================================

/**
 * Standard ammunition calibers in SR5.
 */
export type AmmunitionCaliber =
  | "holdout"
  | "light-pistol"
  | "heavy-pistol"
  | "smg"
  | "assault-rifle"
  | "sniper-rifle"
  | "shotgun"
  | "assault-cannon"
  | "grenade-launcher"
  | "rocket-launcher"
  | "bow"
  | "crossbow"
  | "taser";

/**
 * Ammunition type variants.
 */
export type AmmunitionType =
  | "regular"
  | "apds"
  | "explosive"
  | "ex-explosive"
  | "flechette"
  | "gel"
  | "hollow-point"
  | "tracer"
  | "stick-n-shock"
  | "capsule"
  | "injection";

/**
 * Ammunition state for a weapon.
 * Tracks what's currently loaded and how much.
 */
export interface WeaponAmmoState {
  /** Catalog ID of loaded ammo type (null if empty) */
  loadedAmmoTypeId: string | null;

  /** Current rounds in weapon/magazine */
  currentRounds: number;

  /** Maximum magazine capacity */
  magazineCapacity: number;
}

/**
 * Spare magazine as inventory item.
 */
export interface MagazineItem {
  /** Unique instance ID */
  id: ID;

  /** Weapon subcategory IDs this magazine is compatible with */
  weaponCompatibility: string[];

  /** Maximum capacity */
  capacity: number;

  /** Catalog ID of loaded ammo type (null if empty) */
  loadedAmmoTypeId: string | null;

  /** Current rounds in magazine */
  currentRounds: number;

  /** Cost in nuyen */
  cost: number;

  /** Custom name/label */
  name?: string;
}

/**
 * Ammunition as inventory item (box of ammo).
 */
export interface AmmunitionItem {
  /** Unique instance ID */
  id: ID;

  /** Reference to catalog ammo ID */
  catalogId: string;

  /** Display name */
  name: string;

  /** Caliber category (determines weapon compatibility) */
  caliber: AmmunitionCaliber;

  /** Ammo type variant */
  ammoType: AmmunitionType;

  /** Number of rounds owned */
  quantity: number;

  /** Damage modifier applied to base weapon damage */
  damageModifier: number;

  /** AP modifier applied to base weapon AP */
  apModifier: number;

  /** Cost per unit (typically per 10 rounds) */
  cost: number;

  /** Availability rating */
  availability: number;

  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;
}

/**
 * Ammo consumption rates by firing mode.
 * Based on SR5 rules.
 */
export const AMMO_CONSUMPTION_BY_MODE: Record<string, number> = {
  SS: 1, // Single Shot
  SA: 1, // Semi-Automatic
  BF: 3, // Burst Fire (narrow)
  LB: 6, // Long Burst
  FA: 6, // Full Auto (narrow)
  FAw: 10, // Full Auto (wide)
  SB: 6, // Suppressive Fire (special)
};

// =============================================================================
// ENCUMBRANCE
// =============================================================================

/**
 * Encumbrance calculation result.
 */
export interface EncumbranceState {
  /** Current total weight of carried items (kg) */
  currentWeight: number;

  /** Maximum carrying capacity (Strength × 10 kg) */
  maxCapacity: number;

  /** Pool penalty when over capacity (0 if not encumbered) */
  overweightPenalty: number;

  /** Whether currently encumbered */
  isEncumbered: boolean;
}

/**
 * Calculate encumbrance penalty based on how much over capacity.
 * SR5: -1 per 10% over capacity, max -4
 */
export function calculateEncumbrancePenalty(currentWeight: number, maxCapacity: number): number {
  if (currentWeight <= maxCapacity) {
    return 0;
  }

  const overweightPercent = ((currentWeight - maxCapacity) / maxCapacity) * 100;
  const penalty = Math.floor(overweightPercent / 10);
  return Math.min(penalty, 4); // Max -4 penalty
}

// =============================================================================
// LOADOUTS
// =============================================================================

/**
 * A saved gear configuration for a specific scenario.
 * Runners can create loadouts for different run types and quickly switch.
 */
export interface Loadout {
  id: ID;
  name: string;
  description?: string;
  icon?: string;
  /** Map of gear item ID to desired readiness state */
  gearAssignments: Record<string, EquipmentReadiness>;
  /** Map of gear item ID to stash location (for stashed items) */
  stashAssignments?: Record<string, StashLocationInfo>;
  /** Map of gear item ID to container assignment */
  containerAssignments?: Record<string, ContainmentRef>;
  /** Default readiness for items not explicitly assigned */
  defaultReadiness: EquipmentReadiness;
  /** Default stash location for items defaulting to stashed */
  defaultStashLocation?: StashLocationInfo;
  createdAt: string;
  updatedAt: string;
}

/**
 * Diff showing what changes when switching to a loadout.
 */
export interface LoadoutDiff {
  /** Items that will be stashed (currently on person) */
  itemsToStash: string[];
  /** Items that will be brought (currently stashed) */
  itemsToBring: string[];
  /** Items that will change readiness state */
  itemsToMove: Array<{ itemId: string; from: EquipmentReadiness; to: EquipmentReadiness }>;
  /** Items that will move in/out of containers */
  containerChanges: Array<{ itemId: string; fromContainer?: string; toContainer?: string }>;
  /** Net encumbrance change in kg (positive = heavier) */
  encumbranceChange: number;
}

// =============================================================================
// STATE TRANSITION HELPERS
// =============================================================================

/**
 * Result of a state transition attempt.
 */
export interface StateTransitionResult {
  /** Whether the transition was successful */
  success: boolean;

  /** The updated item (if successful) */
  newState?: GearState;

  /** Action cost required (if successful) */
  actionCost?: TransitionActionCost;

  /** Error message (if failed) */
  error?: string;
}

/**
 * Check if a state transition is valid.
 */
export function isValidTransition(
  gearCategory: string,
  fromState: EquipmentReadiness,
  toState: EquipmentReadiness
): boolean {
  // Check if toState is valid for this gear category
  const validStates = VALID_READINESS_STATES[gearCategory];
  if (validStates && !validStates.includes(toState)) {
    return false;
  }

  // Check if transition exists
  const cost = STATE_TRANSITION_COSTS[fromState]?.[toState];
  return cost !== null && cost !== undefined;
}

/**
 * Get the action cost for a state transition.
 */
export function getTransitionCost(
  fromState: EquipmentReadiness,
  toState: EquipmentReadiness
): TransitionActionCost {
  if (fromState === toState) {
    return "free";
  }
  return STATE_TRANSITION_COSTS[fromState]?.[toState] ?? null;
}
