/**
 * Container Manager
 *
 * Manages gear containment hierarchy — items inside containers (backpacks,
 * duffel bags, vehicle trunks). All functions are pure with no side effects.
 *
 * @see docs/specifications/gear-location-and-loadouts.md
 */

import type { Character, GearItem, Weapon, ArmorItem } from "@/lib/types";
import type {
  EquipmentReadiness,
  ContainmentRef,
  ContainerProperties,
} from "@/lib/types/gear-state";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum nesting depth for containers (item → bag → vehicle trunk) */
export const MAX_CONTAINER_DEPTH = 3;

/**
 * Readiness restriction order from least restricted to most restricted.
 * Used to determine effective readiness in a containment chain.
 */
export const READINESS_RESTRICTION_ORDER: EquipmentReadiness[] = [
  "readied",
  "pocketed",
  "holstered",
  "worn",
  "carried",
  "stored",
  "stashed",
];

// =============================================================================
// TYPES
// =============================================================================

export interface CapacityValidationResult {
  withinWeight: boolean;
  withinSlots: boolean;
  currentWeight: number;
  maxWeight: number;
  currentSlots: number;
  maxSlots: number | undefined;
}

export interface ContainerOperationResult {
  success: boolean;
  character?: Character;
  error?: string;
}

// =============================================================================
// ITEM LOOKUP
// =============================================================================

/** Union of all item types that can appear in gear collections */
type AnyGearItem = GearItem | Weapon | ArmorItem;

/**
 * Find a gear item by ID across all character gear collections.
 */
export function findGearItemById(character: Character, itemId: string): AnyGearItem | undefined {
  // Search gear array
  const gearItem = character.gear?.find((g) => g.id === itemId);
  if (gearItem) return gearItem;

  // Search weapons
  const weapon = character.weapons?.find((w) => w.id === itemId);
  if (weapon) return weapon;

  // Search armor
  const armor = character.armor?.find((a) => a.id === itemId);
  if (armor) return armor;

  // Search drones
  const drone = character.drones?.find((d) => d.id === itemId);
  if (drone) return drone as unknown as AnyGearItem;

  return undefined;
}

/**
 * Check whether an item has container properties.
 */
export function isContainer(item: AnyGearItem): boolean {
  return (
    "containerProperties" in item &&
    item.containerProperties !== undefined &&
    item.containerProperties !== null
  );
}

// =============================================================================
// CONTAINMENT QUERIES
// =============================================================================

/**
 * Get all items contained within a given container.
 */
export function getContainerContents(character: Character, containerId: string): AnyGearItem[] {
  const results: AnyGearItem[] = [];

  for (const item of character.gear || []) {
    if (item.state?.containedIn?.containerId === containerId) {
      results.push(item);
    }
  }
  for (const weapon of character.weapons || []) {
    if (weapon.state?.containedIn?.containerId === containerId) {
      results.push(weapon);
    }
  }
  for (const armor of character.armor || []) {
    if (armor.state?.containedIn?.containerId === containerId) {
      results.push(armor);
    }
  }

  return results;
}

/**
 * Walk up the containment chain from an item to the root.
 * Returns array of container IDs from immediate parent to root.
 */
export function getContainerChain(character: Character, itemId: string): string[] {
  const chain: string[] = [];
  let currentId = itemId;
  const visited = new Set<string>();

  while (true) {
    const item = findGearItemById(character, currentId);
    if (!item) break;

    const containedIn = item.state?.containedIn;
    if (!containedIn) break;

    // Prevent infinite loops
    if (visited.has(containedIn.containerId)) break;
    visited.add(containedIn.containerId);

    chain.push(containedIn.containerId);
    currentId = containedIn.containerId;
  }

  return chain;
}

/**
 * Detect circular containment: would placing itemId into targetId create a cycle?
 */
export function isCircularContainment(
  character: Character,
  itemId: string,
  targetId: string
): boolean {
  // Direct self-containment
  if (itemId === targetId) return true;

  // Check if target is already contained (directly or indirectly) within itemId
  const chain = getContainerChain(character, targetId);
  return chain.includes(itemId);
}

/**
 * Get the nesting depth of an item (0 = top-level, 1 = in a container, etc.)
 */
export function getContainmentDepth(character: Character, itemId: string): number {
  return getContainerChain(character, itemId).length;
}

// =============================================================================
// EFFECTIVE READINESS
// =============================================================================

/**
 * Get the effective readiness of an item, considering its containment chain.
 * The effective readiness is the most restricted state in the chain.
 */
export function getEffectiveReadiness(character: Character, itemId: string): EquipmentReadiness {
  const item = findGearItemById(character, itemId);
  if (!item) return "stashed";

  const itemReadiness = item.state?.readiness ?? "carried";
  let mostRestricted = itemReadiness;

  // Walk up the containment chain
  const chain = getContainerChain(character, itemId);
  for (const containerId of chain) {
    const container = findGearItemById(character, containerId);
    if (!container) continue;
    const containerReadiness = container.state?.readiness ?? "carried";

    if (getRestrictionLevel(containerReadiness) > getRestrictionLevel(mostRestricted)) {
      mostRestricted = containerReadiness;
    }
  }

  return mostRestricted;
}

function getRestrictionLevel(readiness: EquipmentReadiness): number {
  const index = READINESS_RESTRICTION_ORDER.indexOf(readiness);
  return index === -1 ? READINESS_RESTRICTION_ORDER.length : index;
}

// =============================================================================
// WEIGHT CALCULATION
// =============================================================================

/**
 * Calculate the total weight of all items inside a container (recursive).
 */
export function getContainerContentWeight(character: Character, containerId: string): number {
  const contents = getContainerContents(character, containerId);
  let total = 0;

  for (const item of contents) {
    total += item.weight ?? 0;

    // If this content item is itself a container, include its contents' weight
    if (item.id && isContainer(item)) {
      total += getContainerContentWeight(character, item.id);
    }
  }

  return total;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate whether a container is within its capacity limits.
 */
export function validateContainerCapacity(
  character: Character,
  containerId: string
): CapacityValidationResult {
  const container = findGearItemById(character, containerId);
  if (!container || !isContainer(container)) {
    return {
      withinWeight: true,
      withinSlots: true,
      currentWeight: 0,
      maxWeight: 0,
      currentSlots: 0,
      maxSlots: undefined,
    };
  }

  const props = (container as GearItem).containerProperties!;
  const contents = getContainerContents(character, containerId);
  const currentWeight = getContainerContentWeight(character, containerId);
  const currentSlots = contents.length;

  return {
    withinWeight: currentWeight <= props.weightCapacity,
    withinSlots: props.slotCapacity === undefined || currentSlots <= props.slotCapacity,
    currentWeight,
    maxWeight: props.weightCapacity,
    currentSlots,
    maxSlots: props.slotCapacity,
  };
}

/**
 * Check if an item can be added to a container.
 */
export function canAddToContainer(
  character: Character,
  itemId: string,
  containerId: string
): { allowed: boolean; reason?: string } {
  // Item must have an ID
  if (!itemId) {
    return { allowed: false, reason: "Item has no ID" };
  }

  // Target must exist and be a container
  const container = findGearItemById(character, containerId);
  if (!container) {
    return { allowed: false, reason: "Container not found" };
  }
  if (!isContainer(container)) {
    return { allowed: false, reason: "Target item is not a container" };
  }

  // Item must exist
  const item = findGearItemById(character, itemId);
  if (!item) {
    return { allowed: false, reason: "Item not found" };
  }

  // Cannot contain self
  if (isCircularContainment(character, itemId, containerId)) {
    return { allowed: false, reason: "Circular containment detected" };
  }

  // Check max nesting depth
  const containerDepth = getContainmentDepth(character, containerId);
  if (containerDepth + 1 >= MAX_CONTAINER_DEPTH) {
    return {
      allowed: false,
      reason: `Maximum container nesting depth of ${MAX_CONTAINER_DEPTH} exceeded`,
    };
  }

  const props = (container as GearItem).containerProperties!;

  // Check allowed categories
  if (props.allowedCategories && props.allowedCategories.length > 0) {
    const itemCategory = item.category ?? "";
    if (!props.allowedCategories.includes(itemCategory)) {
      return { allowed: false, reason: `Category "${itemCategory}" not allowed in this container` };
    }
  }

  // Check weight capacity
  const currentWeight = getContainerContentWeight(character, containerId);
  const itemWeight = item.weight ?? 0;
  if (currentWeight + itemWeight > props.weightCapacity) {
    return { allowed: false, reason: "Exceeds container weight capacity" };
  }

  // Check slot capacity
  if (props.slotCapacity !== undefined) {
    const contents = getContainerContents(character, containerId);
    if (contents.length >= props.slotCapacity) {
      return { allowed: false, reason: "Exceeds container slot capacity" };
    }
  }

  return { allowed: true };
}

// =============================================================================
// CONTAINER OPERATIONS
// =============================================================================

/**
 * Add an item to a container. Returns new character with updated containment.
 */
export function addItemToContainer(
  character: Character,
  itemId: string,
  containerId: string,
  slot?: string
): ContainerOperationResult {
  const check = canAddToContainer(character, itemId, containerId);
  if (!check.allowed) {
    return { success: false, error: check.reason };
  }

  const containmentRef: ContainmentRef = { containerId, slot };
  const updated = updateItemState(character, itemId, (state) => ({
    ...state,
    containedIn: containmentRef,
  }));

  return { success: true, character: updated };
}

/**
 * Remove an item from its container.
 */
export function removeItemFromContainer(
  character: Character,
  itemId: string
): ContainerOperationResult {
  const item = findGearItemById(character, itemId);
  if (!item) {
    return { success: false, error: "Item not found" };
  }
  if (!item.state?.containedIn) {
    return { success: false, error: "Item is not in a container" };
  }

  const updated = updateItemState(character, itemId, () => ({
    containedIn: undefined,
  }));

  return { success: true, character: updated };
}

/**
 * Move an item from one container to another.
 */
export function moveItemBetweenContainers(
  character: Character,
  itemId: string,
  newContainerId: string,
  slot?: string
): ContainerOperationResult {
  // First remove from current container
  const removeResult = removeItemFromContainer(character, itemId);
  if (!removeResult.success || !removeResult.character) {
    return removeResult;
  }

  // Then add to new container
  return addItemToContainer(removeResult.character, itemId, newContainerId, slot);
}

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

import type { GearState } from "@/lib/types/gear-state";

/**
 * Update the state of a specific item across all gear collections.
 * Returns a new character object (immutable).
 */
function updateItemState(
  character: Character,
  itemId: string,
  updater: (state: GearState) => Partial<GearState>
): Character {
  const defaultState: GearState = { readiness: "carried", wirelessEnabled: true };

  const updateItem = <T extends { id?: string; state?: GearState }>(item: T): T => {
    if (item.id !== itemId) return item;
    const currentState = item.state ?? defaultState;
    return { ...item, state: { ...currentState, ...updater(currentState) } };
  };

  return {
    ...character,
    gear: character.gear?.map(updateItem) ?? [],
    weapons: character.weapons?.map(updateItem),
    armor: character.armor?.map(updateItem),
  };
}
