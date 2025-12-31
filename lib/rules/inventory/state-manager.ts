/**
 * Equipment State Manager
 *
 * Manages equipment readiness states, wireless toggles, and device conditions.
 * Handles state transitions and enforces action economy rules.
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import type { Weapon, ArmorItem, GearItem, Character } from "@/lib/types";
import type {
  GearState,
  EquipmentReadiness,
  DeviceCondition,
} from "@/lib/types/gear-state";

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Action types for state transitions.
 */
export type ActionType = "free" | "simple" | "complex" | "none";

/**
 * Valid state transitions and their action costs.
 * Key format: "fromState->toState"
 */
export const STATE_TRANSITION_COSTS: Record<string, ActionType> = {
  // Ready a weapon (from holster)
  "holstered->readied": "simple",
  // Holster a readied weapon
  "readied->holstered": "free",
  // Draw and ready from storage (bag, etc.)
  "stored->readied": "complex",
  // Store a readied item
  "readied->stored": "simple",
  // Holster to storage
  "holstered->stored": "simple",
  // Draw from storage to holster
  "stored->holstered": "simple",
  // Putting on armor
  "stored->worn": "complex",
  // Taking off armor
  "worn->stored": "complex",
  // Armor doesn't go to readied/holstered
  // Same state = no action
  "readied->readied": "none",
  "holstered->holstered": "none",
  "stored->stored": "none",
  "worn->worn": "none",
};

/**
 * Valid states for different gear types.
 */
export const VALID_STATES: Record<string, EquipmentReadiness[]> = {
  weapon: ["readied", "holstered", "stored"],
  armor: ["worn", "stored"],
  gear: ["readied", "holstered", "worn", "stored"],
  augmentation: ["worn"], // Augmentations are always "worn" (implanted)
  electronics: ["readied", "holstered", "stored"],
};

// =============================================================================
// TYPES
// =============================================================================

export interface StateTransitionResult {
  success: boolean;
  item: Weapon | ArmorItem | GearItem;
  previousState: EquipmentReadiness;
  newState: EquipmentReadiness;
  actionCost: ActionType;
  error?: string;
}

export interface WirelessToggleResult {
  success: boolean;
  previousState: boolean;
  newState: boolean;
  actionCost: ActionType;
}

export interface DeviceConditionResult {
  success: boolean;
  previousCondition: DeviceCondition;
  newCondition: DeviceCondition;
}

// =============================================================================
// STATE MANAGEMENT
// =============================================================================

/**
 * Get the default state for a new item based on its type.
 */
export function getDefaultState(gearType: string): GearState {
  switch (gearType) {
    case "weapon":
      return { readiness: "holstered", wirelessEnabled: true };
    case "armor":
      return { readiness: "worn", wirelessEnabled: true };
    case "augmentation":
      return { readiness: "worn", wirelessEnabled: true };
    case "electronics":
      return {
        readiness: "stored",
        wirelessEnabled: true,
        condition: "functional",
      };
    default:
      return { readiness: "stored", wirelessEnabled: true };
  }
}

/**
 * Get valid state transitions from the current state.
 */
export function getValidTransitions(
  currentState: EquipmentReadiness,
  gearType: string
): EquipmentReadiness[] {
  const validStates = VALID_STATES[gearType] || VALID_STATES.gear;
  return validStates.filter((state) => {
    const transitionKey = `${currentState}->${state}`;
    // Valid if there's a defined cost (including 'none' for same state)
    return STATE_TRANSITION_COSTS[transitionKey] !== undefined;
  });
}

/**
 * Get the action cost for a state transition.
 */
export function getTransitionActionCost(
  from: EquipmentReadiness,
  to: EquipmentReadiness
): ActionType {
  const key = `${from}->${to}`;
  return STATE_TRANSITION_COSTS[key] ?? "complex"; // Default to complex for unknown
}

/**
 * Check if a state transition is valid.
 */
export function isValidTransition(
  from: EquipmentReadiness,
  to: EquipmentReadiness,
  gearType: string
): boolean {
  const validStates = VALID_STATES[gearType] || VALID_STATES.gear;

  // Target state must be valid for this gear type
  if (!validStates.includes(to)) {
    return false;
  }

  // Must have a defined transition cost
  const key = `${from}->${to}`;
  return STATE_TRANSITION_COSTS[key] !== undefined;
}

/**
 * Set equipment readiness state.
 * Returns the updated item and action cost.
 */
export function setEquipmentReadiness<
  T extends { state?: GearState }
>(
  item: T,
  newState: EquipmentReadiness,
  gearType: string = "gear"
): StateTransitionResult {
  // Get current state (default to stored if no state)
  const currentState: GearState = item.state ?? getDefaultState(gearType);
  const previousReadiness = currentState.readiness;

  // Check if transition is valid
  if (!isValidTransition(previousReadiness, newState, gearType)) {
    return {
      success: false,
      item: item as unknown as Weapon | ArmorItem | GearItem,
      previousState: previousReadiness,
      newState: previousReadiness, // No change
      actionCost: "none",
      error: `Invalid state transition from ${previousReadiness} to ${newState} for ${gearType}`,
    };
  }

  // Calculate action cost
  const actionCost = getTransitionActionCost(previousReadiness, newState);

  // Update item state
  const updatedItem = {
    ...item,
    state: {
      ...currentState,
      readiness: newState,
    },
  };

  return {
    success: true,
    item: updatedItem as unknown as Weapon | ArmorItem | GearItem,
    previousState: previousReadiness,
    newState,
    actionCost,
  };
}

// =============================================================================
// WIRELESS MANAGEMENT
// =============================================================================

/**
 * Toggle wireless state for an item.
 * Toggling wireless is always a Free Action.
 */
export function toggleWireless<T extends { state?: GearState }>(
  item: T,
  enabled: boolean,
  gearType: string = "gear"
): { item: T; result: WirelessToggleResult } {
  const currentState: GearState = item.state ?? getDefaultState(gearType);
  const previousEnabled = currentState.wirelessEnabled;

  const updatedItem = {
    ...item,
    state: {
      ...currentState,
      wirelessEnabled: enabled,
    },
  };

  return {
    item: updatedItem,
    result: {
      success: true,
      previousState: previousEnabled,
      newState: enabled,
      actionCost: "free",
    },
  };
}

/**
 * Toggle wireless for cyberware/bioware (uses wirelessEnabled directly).
 */
export function toggleAugmentationWireless<
  T extends { wirelessEnabled?: boolean }
>(
  item: T,
  enabled: boolean
): { item: T; result: WirelessToggleResult } {
  const previousEnabled = item.wirelessEnabled ?? true;

  const updatedItem = {
    ...item,
    wirelessEnabled: enabled,
  };

  return {
    item: updatedItem,
    result: {
      success: true,
      previousState: previousEnabled,
      newState: enabled,
      actionCost: "free",
    },
  };
}

/**
 * Set wireless state for all items on a character.
 * Respects the global wirelessBonusesEnabled flag.
 */
export function setAllWireless(
  character: Character,
  enabled: boolean
): Character {
  return {
    ...character,
    wirelessBonusesEnabled: enabled,
  };
}

// =============================================================================
// DEVICE CONDITION MANAGEMENT
// =============================================================================

/**
 * Set device condition for a Matrix-capable device.
 */
export function setDeviceCondition<
  T extends { condition?: DeviceCondition; state?: GearState }
>(
  device: T,
  condition: DeviceCondition
): { device: T; result: DeviceConditionResult } {
  const previousCondition = device.condition ?? device.state?.condition ?? "functional";

  const updatedDevice = {
    ...device,
    condition,
    state: device.state
      ? { ...device.state, condition }
      : undefined,
  };

  return {
    device: updatedDevice,
    result: {
      success: true,
      previousCondition,
      newCondition: condition,
    },
  };
}

/**
 * Brick a device (set condition to 'bricked').
 */
export function brickDevice<
  T extends { condition?: DeviceCondition; state?: GearState }
>(device: T): { device: T; result: DeviceConditionResult } {
  return setDeviceCondition(device, "bricked");
}

/**
 * Repair a bricked device (set condition back to 'functional').
 */
export function repairDevice<
  T extends { condition?: DeviceCondition; state?: GearState }
>(device: T): { device: T; result: DeviceConditionResult } {
  const currentCondition = device.condition ?? device.state?.condition ?? "functional";

  // Cannot repair destroyed devices
  if (currentCondition === "destroyed") {
    return {
      device,
      result: {
        success: false,
        previousCondition: currentCondition,
        newCondition: currentCondition,
      },
    };
  }

  return setDeviceCondition(device, "functional");
}

/**
 * Check if a device is usable (functional).
 */
export function isDeviceUsable(
  device: { condition?: DeviceCondition; state?: GearState }
): boolean {
  const condition = device.condition ?? device.state?.condition ?? "functional";
  return condition === "functional";
}

// =============================================================================
// BULK OPERATIONS
// =============================================================================

/**
 * Ready all carried weapons (holstered -> readied).
 * Useful for combat initialization.
 */
export function readyAllWeapons(
  weapons: Weapon[]
): { weapons: Weapon[]; totalActionCost: number } {
  let simpleActions = 0;
  const complexActions = 0;

  const updatedWeapons = weapons.map((weapon) => {
    const currentState = weapon.state?.readiness ?? "holstered";

    if (currentState === "holstered") {
      const result = setEquipmentReadiness(weapon, "readied", "weapon");
      if (result.success && result.actionCost === "simple") {
        simpleActions++;
      }
      return result.item as Weapon;
    }

    return weapon;
  });

  return {
    weapons: updatedWeapons,
    totalActionCost: simpleActions + complexActions * 2, // Complex = 2 simple
  };
}

/**
 * Holster all readied weapons.
 */
export function holsterAllWeapons(weapons: Weapon[]): Weapon[] {
  return weapons.map((weapon) => {
    const currentState = weapon.state?.readiness ?? "holstered";

    if (currentState === "readied") {
      const result = setEquipmentReadiness(weapon, "holstered", "weapon");
      return result.item as Weapon;
    }

    return weapon;
  });
}

/**
 * Get a summary of equipment states for UI display.
 */
export function getEquipmentStateSummary(
  character: Character
): {
  readiedWeapons: number;
  holsteredWeapons: number;
  storedWeapons: number;
  wornArmor: number;
  storedArmor: number;
  wirelessEnabled: number;
  wirelessDisabled: number;
  brickedDevices: number;
} {
  const weapons = character.weapons || [];
  const armor = character.armor || [];
  const cyberware = character.cyberware || [];

  let readiedWeapons = 0;
  let holsteredWeapons = 0;
  let storedWeapons = 0;
  let wornArmor = 0;
  let storedArmor = 0;
  let wirelessEnabled = 0;
  let wirelessDisabled = 0;
  let brickedDevices = 0;

  for (const weapon of weapons) {
    const state = weapon.state?.readiness ?? "holstered";
    if (state === "readied") readiedWeapons++;
    else if (state === "holstered") holsteredWeapons++;
    else storedWeapons++;

    if (weapon.state?.wirelessEnabled !== false) wirelessEnabled++;
    else wirelessDisabled++;
  }

  for (const item of armor) {
    const state = item.state?.readiness ?? (item.equipped ? "worn" : "stored");
    if (state === "worn") wornArmor++;
    else storedArmor++;
  }

  for (const item of cyberware) {
    if (item.wirelessEnabled !== false) wirelessEnabled++;
    else wirelessDisabled++;
  }

  // Check Matrix devices
  for (const deck of character.cyberdecks || []) {
    if (deck.condition === "bricked") brickedDevices++;
  }
  for (const link of character.commlinks || []) {
    if (link.condition === "bricked") brickedDevices++;
  }

  return {
    readiedWeapons,
    holsteredWeapons,
    storedWeapons,
    wornArmor,
    storedArmor,
    wirelessEnabled,
    wirelessDisabled,
    brickedDevices,
  };
}
