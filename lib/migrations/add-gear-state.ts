/**
 * Migration: Add Gear State
 *
 * Migrates existing characters to include the new gear state fields
 * introduced in ADR-010 (Inventory State Management).
 *
 * Migration actions:
 * - Weapons: Add state { readiness: 'holstered', wirelessEnabled: true }
 * - Armor: Add state based on legacy 'equipped' field
 * - Cyberware: Set wirelessEnabled = true if not set
 * - Matrix devices: Set condition = 'functional'
 * - Weapons: Initialize ammoState from currentAmmo/ammoCapacity
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import type { Character, Weapon, ArmorItem, CyberwareItem } from "@/lib/types";
import type { GearState, WeaponAmmoState, DeviceCondition } from "@/lib/types/gear-state";
import { DEFAULT_STATE_BY_CATEGORY } from "@/lib/types/gear-state";

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
  type: "weapon" | "armor" | "cyberware" | "gear" | "matrix_device";
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
 * Check if a character needs gear state migration.
 * Returns true if any gear items are missing the new state fields.
 */
export function needsGearStateMigration(character: Character): boolean {
  // Check weapons in gear array
  const weaponsInGear = character.gear?.filter((g): g is Weapon => g.category === "weapons") ?? [];
  if (weaponsInGear.some((w) => !w.state)) {
    return true;
  }

  // Check armor in gear array
  const armorInGear = character.gear?.filter((g): g is ArmorItem => g.category === "armor") ?? [];
  if (armorInGear.some((a) => !a.state)) {
    return true;
  }

  // Check separate weapons array (legacy format)
  if (character.weapons?.some((w) => !w.state)) {
    return true;
  }

  // Check separate armor array (legacy format)
  if (character.armor?.some((a) => !a.state)) {
    return true;
  }

  // Check cyberware
  if (character.cyberware?.some((c) => c.wirelessEnabled === undefined)) {
    return true;
  }

  // Check Matrix devices (arrays of cyberdecks/commlinks)
  if (character.cyberdecks?.some((d) => !d.condition)) {
    return true;
  }
  if (character.commlinks?.some((c) => !c.condition)) {
    return true;
  }

  return false;
}

// =============================================================================
// ITEM MIGRATION FUNCTIONS
// =============================================================================

/**
 * Create default weapon state from existing fields.
 */
function createWeaponState(weapon: Weapon): GearState {
  return {
    readiness: "holstered",
    wirelessEnabled: true,
    ...(DEFAULT_STATE_BY_CATEGORY.weapon || {}),
  };
}

/**
 * Create weapon ammo state from legacy fields.
 */
function createWeaponAmmoState(weapon: Weapon): WeaponAmmoState | undefined {
  // Only create if weapon has ammo capacity
  if (!weapon.ammoCapacity || weapon.ammoCapacity === 0) {
    return undefined;
  }

  return {
    loadedAmmoTypeId: null, // No way to know loaded type from legacy data
    currentRounds: weapon.currentAmmo ?? weapon.ammoCapacity,
    magazineCapacity: weapon.ammoCapacity,
  };
}

/**
 * Create default armor state based on legacy 'equipped' field.
 */
function createArmorState(armor: ArmorItem): GearState {
  // Legacy 'equipped' field determines worn vs stored
  const equipped = (armor as unknown as { equipped?: boolean }).equipped;

  return {
    readiness: equipped ? "worn" : "stored",
    wirelessEnabled: true,
    ...(DEFAULT_STATE_BY_CATEGORY.armor || {}),
  };
}

/**
 * Get default device condition.
 */
function getDefaultDeviceCondition(): DeviceCondition {
  return "functional";
}

// =============================================================================
// MAIN MIGRATION FUNCTION
// =============================================================================

/**
 * Migrate a character's gear to include state fields.
 * Returns a new character object with migrated data.
 */
export function migrateCharacterGearState(character: Character): {
  character: Character;
  result: MigrationResult;
} {
  const changes: MigrationChange[] = [];

  // Create a deep copy to avoid mutating original
  const migrated: Character = JSON.parse(JSON.stringify(character));

  // Migrate weapons in gear array
  if (migrated.gear) {
    migrated.gear = migrated.gear.map((item) => {
      if (item.category === "weapons") {
        const weapon = item as Weapon;
        if (!weapon.state) {
          const newState = createWeaponState(weapon);
          changes.push({
            type: "weapon",
            itemId: weapon.id,
            itemName: weapon.name,
            field: "state",
            oldValue: undefined,
            newValue: newState,
          });
          weapon.state = newState;
        }

        // Add ammo state if needed
        if (!weapon.ammoState && weapon.ammoCapacity) {
          const newAmmoState = createWeaponAmmoState(weapon);
          if (newAmmoState) {
            changes.push({
              type: "weapon",
              itemId: weapon.id,
              itemName: weapon.name,
              field: "ammoState",
              oldValue: undefined,
              newValue: newAmmoState,
            });
            weapon.ammoState = newAmmoState;
          }
        }

        return weapon;
      }

      if (item.category === "armor") {
        const armor = item as ArmorItem;
        if (!armor.state) {
          const newState = createArmorState(armor);
          changes.push({
            type: "armor",
            itemId: armor.id,
            itemName: armor.name,
            field: "state",
            oldValue: undefined,
            newValue: newState,
          });
          armor.state = newState;
        }
        return armor;
      }

      return item;
    });
  }

  // Migrate separate weapons array (some characters store weapons separately)
  if (migrated.weapons) {
    migrated.weapons = migrated.weapons.map((weapon) => {
      if (!weapon.state) {
        const newState = createWeaponState(weapon);
        changes.push({
          type: "weapon",
          itemId: weapon.id || weapon.catalogId,
          itemName: weapon.name,
          field: "state",
          oldValue: undefined,
          newValue: newState,
        });
        weapon.state = newState;
      }

      // Add ammo state if needed - check both ammoCapacity and ammo fields
      const capacity = weapon.ammoCapacity || (weapon as unknown as { ammo?: number }).ammo;
      if (!weapon.ammoState && capacity) {
        const weaponWithCapacity = { ...weapon, ammoCapacity: capacity };
        const newAmmoState = createWeaponAmmoState(weaponWithCapacity);
        if (newAmmoState) {
          changes.push({
            type: "weapon",
            itemId: weapon.id || weapon.catalogId,
            itemName: weapon.name,
            field: "ammoState",
            oldValue: undefined,
            newValue: newAmmoState,
          });
          weapon.ammoState = newAmmoState;
        }
      }

      return weapon;
    });
  }

  // Migrate separate armor array (some characters store armor separately)
  if (migrated.armor) {
    migrated.armor = migrated.armor.map((armorItem) => {
      if (!armorItem.state) {
        const newState = createArmorState(armorItem);
        changes.push({
          type: "armor",
          itemId: armorItem.id || armorItem.catalogId,
          itemName: armorItem.name,
          field: "state",
          oldValue: undefined,
          newValue: newState,
        });
        armorItem.state = newState;
      }
      return armorItem;
    });
  }

  // Migrate cyberware
  if (migrated.cyberware) {
    migrated.cyberware = migrated.cyberware.map((cyberware) => {
      if (cyberware.wirelessEnabled === undefined) {
        changes.push({
          type: "cyberware",
          itemId: cyberware.id,
          itemName: cyberware.name,
          field: "wirelessEnabled",
          oldValue: undefined,
          newValue: true,
        });
        cyberware.wirelessEnabled = true;
      }
      return cyberware;
    });
  }

  // Migrate cyberdecks (array)
  if (migrated.cyberdecks) {
    migrated.cyberdecks = migrated.cyberdecks.map((deck) => {
      if (!deck.condition) {
        const condition = getDefaultDeviceCondition();
        changes.push({
          type: "matrix_device",
          itemId: deck.id,
          itemName: deck.name || "Cyberdeck",
          field: "condition",
          oldValue: undefined,
          newValue: condition,
        });
        deck.condition = condition;
      }
      return deck;
    });
  }

  // Migrate commlinks (array)
  if (migrated.commlinks) {
    migrated.commlinks = migrated.commlinks.map((comm) => {
      if (!comm.condition) {
        const condition = getDefaultDeviceCondition();
        changes.push({
          type: "matrix_device",
          itemId: comm.id,
          itemName: comm.name || "Commlink",
          field: "condition",
          oldValue: undefined,
          newValue: condition,
        });
        comm.condition = condition;
      }
      return comm;
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
 * Returns results for each character.
 */
export function migrateCharactersGearState(characters: Character[]): BatchMigrationResult {
  const results: MigrationResult[] = [];
  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const character of characters) {
    try {
      if (!needsGearStateMigration(character)) {
        skipped++;
        results.push({
          success: true,
          characterId: character.id,
          characterName: character.name,
          changes: [],
        });
        continue;
      }

      const { result } = migrateCharacterGearState(character);
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

  return {
    total: characters.length,
    migrated,
    skipped,
    failed,
    results,
  };
}

/**
 * Get migration summary for reporting.
 */
export function getMigrationSummary(result: BatchMigrationResult): string {
  const lines: string[] = [
    `Migration Summary`,
    `=================`,
    `Total characters: ${result.total}`,
    `Migrated: ${result.migrated}`,
    `Skipped (already up to date): ${result.skipped}`,
    `Failed: ${result.failed}`,
    ``,
  ];

  if (result.failed > 0) {
    lines.push(`Failed characters:`);
    for (const r of result.results.filter((r) => !r.success)) {
      lines.push(`  - ${r.characterName}: ${r.error}`);
    }
  }

  return lines.join("\n");
}
