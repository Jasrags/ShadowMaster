/**
 * Loadout Manager
 *
 * Manages saved gear configurations (loadouts) for different scenarios.
 * Runners can create loadouts, apply them, and see diffs before switching.
 *
 * All functions are pure — they return new Character objects.
 *
 * @see docs/specifications/gear-location-and-loadouts.md#loadout-system
 */

import type { Character, GearItem, Weapon, ArmorItem } from "@/lib/types";
import type {
  EquipmentReadiness,
  Loadout,
  LoadoutDiff,
  StashLocationInfo,
  ContainmentRef,
} from "@/lib/types/gear-state";

// =============================================================================
// TYPES
// =============================================================================

export interface LoadoutApplicationResult {
  success: boolean;
  character?: Character;
  diff: LoadoutDiff;
  errors: string[];
}

export interface CreateLoadoutConfig {
  name: string;
  description?: string;
  icon?: string;
  gearAssignments: Record<string, EquipmentReadiness>;
  stashAssignments?: Record<string, StashLocationInfo>;
  containerAssignments?: Record<string, ContainmentRef>;
  defaultReadiness: EquipmentReadiness;
  defaultStashLocation?: StashLocationInfo;
}

// =============================================================================
// LOADOUT CRUD
// =============================================================================

/**
 * Create a new loadout from a configuration.
 */
export function createLoadout(
  character: Character,
  config: CreateLoadoutConfig
): { character: Character; loadout: Loadout } {
  const now = new Date().toISOString();
  const loadout: Loadout = {
    id: `loadout-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: config.name,
    description: config.description,
    icon: config.icon,
    gearAssignments: config.gearAssignments,
    stashAssignments: config.stashAssignments,
    containerAssignments: config.containerAssignments,
    defaultReadiness: config.defaultReadiness,
    defaultStashLocation: config.defaultStashLocation,
    createdAt: now,
    updatedAt: now,
  };

  const updatedCharacter: Character = {
    ...character,
    loadouts: [...(character.loadouts || []), loadout],
  };

  return { character: updatedCharacter, loadout };
}

/**
 * Save the character's current gear state as a new loadout.
 */
export function saveCurrentAsLoadout(
  character: Character,
  name: string,
  description?: string
): { character: Character; loadout: Loadout } {
  const gearAssignments: Record<string, EquipmentReadiness> = {};
  const stashAssignments: Record<string, StashLocationInfo> = {};
  const containerAssignments: Record<string, ContainmentRef> = {};

  const processItem = (item: GearItem | Weapon | ArmorItem) => {
    if (!item.id) return;
    const readiness = item.state?.readiness ?? "carried";
    gearAssignments[item.id] = readiness;

    if (item.state?.stashLocation) {
      stashAssignments[item.id] = item.state.stashLocation;
    }
    if (item.state?.containedIn) {
      containerAssignments[item.id] = item.state.containedIn;
    }
  };

  for (const item of character.gear || []) processItem(item);
  for (const weapon of character.weapons || []) processItem(weapon);
  for (const armor of character.armor || []) processItem(armor);

  return createLoadout(character, {
    name,
    description,
    gearAssignments,
    stashAssignments: Object.keys(stashAssignments).length > 0 ? stashAssignments : undefined,
    containerAssignments:
      Object.keys(containerAssignments).length > 0 ? containerAssignments : undefined,
    defaultReadiness: "stashed",
  });
}

/**
 * Update an existing loadout's properties.
 */
export function updateLoadout(
  character: Character,
  loadoutId: string,
  updates: Partial<
    Pick<Loadout, "name" | "description" | "icon" | "gearAssignments" | "defaultReadiness">
  >
): Character {
  const loadouts = character.loadouts || [];
  const index = loadouts.findIndex((l) => l.id === loadoutId);
  if (index === -1) return character;

  const updatedLoadout: Loadout = {
    ...loadouts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const updatedLoadouts = [...loadouts];
  updatedLoadouts[index] = updatedLoadout;

  return { ...character, loadouts: updatedLoadouts };
}

/**
 * Delete a loadout. If it was the active loadout, clears activeLoadoutId.
 */
export function deleteLoadout(character: Character, loadoutId: string): Character {
  const loadouts = (character.loadouts || []).filter((l) => l.id !== loadoutId);
  const activeLoadoutId =
    character.activeLoadoutId === loadoutId ? undefined : character.activeLoadoutId;

  return { ...character, loadouts, activeLoadoutId };
}

// =============================================================================
// LOADOUT APPLICATION
// =============================================================================

/**
 * Calculate what would change if a loadout were applied.
 */
export function getLoadoutDiff(character: Character, loadoutId: string): LoadoutDiff {
  const loadout = (character.loadouts || []).find((l) => l.id === loadoutId);
  if (!loadout) {
    return { itemsToStash: [], itemsToBring: [], itemsToMove: [], encumbranceChange: 0 };
  }

  const itemsToStash: string[] = [];
  const itemsToBring: string[] = [];
  const itemsToMove: LoadoutDiff["itemsToMove"] = [];

  const processItem = (item: GearItem | Weapon | ArmorItem) => {
    if (!item.id) return;

    const currentReadiness = item.state?.readiness ?? "carried";
    const targetReadiness = loadout.gearAssignments[item.id] ?? loadout.defaultReadiness;

    if (currentReadiness === targetReadiness) return;

    if (targetReadiness === "stashed" && currentReadiness !== "stashed") {
      itemsToStash.push(item.id);
    } else if (currentReadiness === "stashed" && targetReadiness !== "stashed") {
      itemsToBring.push(item.id);
    } else {
      itemsToMove.push({ itemId: item.id, from: currentReadiness, to: targetReadiness });
    }
  };

  for (const item of character.gear || []) processItem(item);
  for (const weapon of character.weapons || []) processItem(weapon);
  for (const armor of character.armor || []) processItem(armor);

  // Estimate encumbrance change (simplified: stashing reduces, bringing increases)
  let encumbranceChange = 0;
  for (const id of itemsToStash) {
    const item = findItemById(character, id);
    if (item) encumbranceChange -= item.weight ?? 0;
  }
  for (const id of itemsToBring) {
    const item = findItemById(character, id);
    if (item) encumbranceChange += item.weight ?? 0;
  }

  return { itemsToStash, itemsToBring, itemsToMove, encumbranceChange };
}

/**
 * Apply a loadout to a character.
 * Changes all gear readiness states to match the loadout configuration.
 */
export function applyLoadout(character: Character, loadoutId: string): LoadoutApplicationResult {
  const loadout = (character.loadouts || []).find((l) => l.id === loadoutId);
  if (!loadout) {
    return {
      success: false,
      diff: { itemsToStash: [], itemsToBring: [], itemsToMove: [], encumbranceChange: 0 },
      errors: [`Loadout "${loadoutId}" not found`],
    };
  }

  const diff = getLoadoutDiff(character, loadoutId);
  const errors: string[] = [];

  const updateReadiness = <
    T extends { id?: string; state?: { readiness: EquipmentReadiness; wirelessEnabled: boolean } },
  >(
    items: T[]
  ): T[] => {
    return items.map((item) => {
      if (!item.id) return item;

      const targetReadiness = loadout.gearAssignments[item.id] ?? loadout.defaultReadiness;

      // Check if item still exists — if not, record an error
      if (loadout.gearAssignments[item.id] && !findItemById(character, item.id)) {
        errors.push(`Item "${item.id}" in loadout but not found on character`);
        return item;
      }

      if (item.state?.readiness === targetReadiness) return item;

      return {
        ...item,
        state: {
          ...(item.state ?? { readiness: "carried", wirelessEnabled: true }),
          readiness: targetReadiness,
        },
      };
    });
  };

  const updatedCharacter: Character = {
    ...character,
    gear: updateReadiness(character.gear || []),
    weapons: updateReadiness(character.weapons || []),
    armor: updateReadiness(character.armor || []),
    activeLoadoutId: loadoutId,
  };

  return {
    success: errors.length === 0,
    character: updatedCharacter,
    diff,
    errors,
  };
}

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

function findItemById(
  character: Character,
  itemId: string
): (GearItem | Weapon | ArmorItem) | undefined {
  return (
    character.gear?.find((g) => g.id === itemId) ??
    character.weapons?.find((w) => w.id === itemId) ??
    character.armor?.find((a) => a.id === itemId)
  );
}
