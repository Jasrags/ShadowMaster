/**
 * Migration: Gear Location System
 *
 * Migrates existing characters from the flat readiness model to the
 * new location/container model. Key changes:
 * - "stored" → "carried" readiness state
 * - Old containedIn format { itemId, slotType } → new ContainmentRef { containerId, slot }
 *
 * This migration is NOT auto-run. It should be triggered during the
 * UI phase or via an admin endpoint.
 *
 * @see docs/specifications/gear-location-and-loadouts.md
 */

import type { Character, GearItem, Weapon, ArmorItem } from "@/lib/types";
import type { GearState, ContainmentRef } from "@/lib/types/gear-state";

// =============================================================================
// MIGRATION RESULT TYPES
// =============================================================================

export interface MigrationResult {
  success: boolean;
  characterId: string;
  characterName: string;
  changes: MigrationChange[];
  error?: string;
}

export interface MigrationChange {
  type: "weapon" | "armor" | "gear";
  itemId?: string;
  itemName: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface BatchMigrationResult {
  total: number;
  migrated: number;
  skipped: number;
  failed: number;
  results: MigrationResult[];
}

// =============================================================================
// MIGRATION CHECKS
// =============================================================================

/**
 * Check if a character needs location migration.
 * Returns true if any gear items use the deprecated "stored" state
 * or have the old containedIn format.
 */
export function needsLocationMigration(character: Character): boolean {
  const checkState = (state?: GearState): boolean => {
    if (!state) return false;

    // Check for deprecated "stored" readiness
    if (state.readiness === "stored") return true;

    // Check for old containedIn format (has itemId instead of containerId)
    if (state.containedIn) {
      const ref = state.containedIn as unknown as Record<string, unknown>;
      if ("itemId" in ref && !("containerId" in ref)) return true;
    }

    return false;
  };

  for (const item of character.gear || []) {
    if (checkState(item.state)) return true;
  }
  for (const weapon of character.weapons || []) {
    if (checkState(weapon.state)) return true;
  }
  for (const armor of character.armor || []) {
    if (checkState(armor.state)) return true;
  }

  return false;
}

// =============================================================================
// ITEM MIGRATION
// =============================================================================

/**
 * Migrate a single item's state from old format to new.
 */
function migrateItemState(
  state: GearState | undefined,
  itemId: string | undefined,
  itemName: string,
  type: MigrationChange["type"],
  changes: MigrationChange[]
): GearState | undefined {
  if (!state) return state;

  let migrated = { ...state };
  let changed = false;

  // Migrate "stored" → "carried"
  if (state.readiness === "stored") {
    changes.push({
      type,
      itemId,
      itemName,
      field: "readiness",
      oldValue: "stored",
      newValue: "carried",
    });
    migrated = { ...migrated, readiness: "carried" };
    changed = true;
  }

  // Migrate old containedIn format
  if (state.containedIn) {
    const ref = state.containedIn as unknown as Record<string, unknown>;
    if ("itemId" in ref && !("containerId" in ref)) {
      const newRef: ContainmentRef = {
        containerId: ref.itemId as string,
        slot: (ref.slotType as string) || undefined,
      };
      changes.push({
        type,
        itemId,
        itemName,
        field: "containedIn",
        oldValue: state.containedIn,
        newValue: newRef,
      });
      migrated = { ...migrated, containedIn: newRef };
      changed = true;
    }
  }

  return changed ? migrated : state;
}

// =============================================================================
// MAIN MIGRATION
// =============================================================================

/**
 * Migrate a character's gear to the new location model.
 * Returns a new character object (immutable).
 */
export function migrateGearLocation(character: Character): {
  character: Character;
  result: MigrationResult;
} {
  const changes: MigrationChange[] = [];
  const migrated: Character = JSON.parse(JSON.stringify(character));

  // Migrate gear array
  if (migrated.gear) {
    migrated.gear = migrated.gear.map((item) => {
      const newState = migrateItemState(item.state, item.id, item.name, "gear", changes);
      if (newState !== item.state) {
        return { ...item, state: newState };
      }
      return item;
    });
  }

  // Migrate weapons array
  if (migrated.weapons) {
    migrated.weapons = migrated.weapons.map((weapon) => {
      const newState = migrateItemState(
        weapon.state,
        weapon.id || weapon.catalogId,
        weapon.name,
        "weapon",
        changes
      );
      if (newState !== weapon.state) {
        return { ...weapon, state: newState };
      }
      return weapon;
    });
  }

  // Migrate armor array
  if (migrated.armor) {
    migrated.armor = migrated.armor.map((armor) => {
      const newState = migrateItemState(
        armor.state,
        armor.id || armor.catalogId,
        armor.name,
        "armor",
        changes
      );
      if (newState !== armor.state) {
        return { ...armor, state: newState };
      }
      return armor;
    });
  }

  return {
    character: migrated,
    result: {
      success: true,
      characterId: character.id,
      characterName: character.name,
      changes,
    },
  };
}

// =============================================================================
// BATCH MIGRATION
// =============================================================================

/**
 * Migrate multiple characters.
 */
export function migrateGearLocations(characters: Character[]): BatchMigrationResult {
  const results: MigrationResult[] = [];
  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const character of characters) {
    try {
      if (!needsLocationMigration(character)) {
        skipped++;
        results.push({
          success: true,
          characterId: character.id,
          characterName: character.name,
          changes: [],
        });
        continue;
      }

      const { result } = migrateGearLocation(character);
      results.push(result);

      if (result.changes.length > 0) {
        migrated++;
      } else {
        skipped++;
      }
    } catch (error) {
      failed++;
      results.push({
        success: false,
        characterId: character.id,
        characterName: character.name,
        changes: [],
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return { total: characters.length, migrated, skipped, failed, results };
}
