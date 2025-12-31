/**
 * Ammunition Manager
 *
 * Manages weapon ammunition loading, unloading, and magazine swapping.
 * Works with the new ammoState model while maintaining backward compatibility
 * with legacy currentAmmo/ammoCapacity fields.
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import type { Weapon } from "@/lib/types";
import type {
  WeaponAmmoState,
  MagazineItem,
  AmmunitionItem,
  AmmunitionCaliber,
} from "@/lib/types/gear-state";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Rounds consumed per firing mode (SR5 Core Rulebook) */
export const AMMO_CONSUMPTION: Record<string, number> = {
  SS: 1, // Single Shot
  SA: 1, // Semi-Automatic (was 2 in older versions, now 1)
  BF: 3, // Burst Fire (short burst)
  LB: 6, // Long Burst
  FA: 10, // Full Auto (suppressive fire/complex full auto)
  "FA-simple": 6, // Full Auto (simple action)
};

/** Default magazine capacity if not specified */
export const DEFAULT_MAGAZINE_CAPACITY = 15;

// =============================================================================
// TYPES
// =============================================================================

export interface LoadWeaponResult {
  success: boolean;
  weapon: Weapon;
  ammoItem?: AmmunitionItem;
  roundsLoaded: number;
  error?: string;
}

export interface UnloadWeaponResult {
  success: boolean;
  weapon: Weapon;
  returnedAmmo?: AmmunitionItem;
  roundsUnloaded: number;
}

export interface SwapMagazineResult {
  success: boolean;
  weapon: Weapon;
  oldMagazine?: MagazineItem;
  error?: string;
}

export interface FireResult {
  canFire: boolean;
  roundsConsumed: number;
  roundsRemaining: number;
  reason?: string;
}

export interface AmmoDamageModifiers {
  damageModifier: number;
  apModifier: number;
  ammoTypeName?: string;
}

// =============================================================================
// AMMO STATE HELPERS
// =============================================================================

/**
 * Get the current ammo state from a weapon.
 * Handles both new ammoState and legacy currentAmmo/ammoCapacity.
 */
export function getWeaponAmmoState(weapon: Weapon): WeaponAmmoState {
  // Prefer new ammoState if present
  if (weapon.ammoState) {
    return weapon.ammoState;
  }

  // Fall back to legacy fields
  return {
    loadedAmmoTypeId: null,
    currentRounds: weapon.currentAmmo ?? 0,
    magazineCapacity: weapon.ammoCapacity ?? DEFAULT_MAGAZINE_CAPACITY,
  };
}

/**
 * Update weapon with new ammo state.
 * Updates both new and legacy fields for compatibility.
 */
export function updateWeaponAmmoState(
  weapon: Weapon,
  ammoState: WeaponAmmoState
): Weapon {
  return {
    ...weapon,
    ammoState,
    // Update legacy fields for backward compatibility
    currentAmmo: ammoState.currentRounds,
    ammoCapacity: ammoState.magazineCapacity,
  };
}

/**
 * Check if a weapon uses ammunition (is a ranged projectile weapon).
 */
export function weaponUsesAmmo(weapon: Weapon): boolean {
  // Melee weapons don't use ammo
  if (weapon.subcategory === "melee") {
    return false;
  }

  // Check if weapon has ammo capacity
  const capacity =
    weapon.ammoState?.magazineCapacity ?? weapon.ammoCapacity ?? 0;
  return capacity > 0;
}

// =============================================================================
// LOADING AND UNLOADING
// =============================================================================

/**
 * Load ammunition into a weapon from inventory.
 * Consumes rounds from the ammo item up to magazine capacity.
 */
export function loadWeapon(
  weapon: Weapon,
  ammoItem: AmmunitionItem,
  quantity?: number
): LoadWeaponResult {
  // Get current state
  const currentState = getWeaponAmmoState(weapon);

  // Validate weapon can use ammo
  if (!weaponUsesAmmo(weapon)) {
    return {
      success: false,
      weapon,
      roundsLoaded: 0,
      error: "Weapon does not use ammunition",
    };
  }

  // Check if magazine is already full
  if (currentState.currentRounds >= currentState.magazineCapacity) {
    return {
      success: false,
      weapon,
      roundsLoaded: 0,
      error: "Magazine is already full",
    };
  }

  // Calculate how many rounds to load
  const spaceAvailable =
    currentState.magazineCapacity - currentState.currentRounds;
  const roundsToLoad = Math.min(
    quantity ?? spaceAvailable,
    spaceAvailable,
    ammoItem.quantity
  );

  if (roundsToLoad <= 0) {
    return {
      success: false,
      weapon,
      roundsLoaded: 0,
      error: "No ammunition available to load",
    };
  }

  // Check ammo compatibility (if we have loaded ammo, must match type)
  if (
    currentState.loadedAmmoTypeId &&
    currentState.loadedAmmoTypeId !== ammoItem.catalogId &&
    currentState.currentRounds > 0
  ) {
    return {
      success: false,
      weapon,
      roundsLoaded: 0,
      error:
        "Cannot mix ammunition types. Unload current ammunition first.",
    };
  }

  // Update weapon state
  const newState: WeaponAmmoState = {
    loadedAmmoTypeId: ammoItem.catalogId,
    currentRounds: currentState.currentRounds + roundsToLoad,
    magazineCapacity: currentState.magazineCapacity,
  };

  // Update ammo item (reduce quantity)
  const updatedAmmoItem: AmmunitionItem = {
    ...ammoItem,
    quantity: ammoItem.quantity - roundsToLoad,
  };

  return {
    success: true,
    weapon: updateWeaponAmmoState(weapon, newState),
    ammoItem: updatedAmmoItem,
    roundsLoaded: roundsToLoad,
  };
}

/**
 * Unload all ammunition from a weapon back to inventory.
 */
export function unloadWeapon(
  weapon: Weapon,
  existingAmmoItem?: AmmunitionItem
): UnloadWeaponResult {
  const currentState = getWeaponAmmoState(weapon);

  if (currentState.currentRounds === 0) {
    return {
      success: true,
      weapon,
      roundsUnloaded: 0,
    };
  }

  const roundsUnloaded = currentState.currentRounds;

  // Clear weapon ammo
  const newState: WeaponAmmoState = {
    loadedAmmoTypeId: null,
    currentRounds: 0,
    magazineCapacity: currentState.magazineCapacity,
  };

  // Create or update ammo item for returned rounds
  let returnedAmmo: AmmunitionItem | undefined;
  if (currentState.loadedAmmoTypeId) {
    if (existingAmmoItem) {
      returnedAmmo = {
        ...existingAmmoItem,
        quantity: existingAmmoItem.quantity + roundsUnloaded,
      };
    } else {
      // Create new ammo item (caller should provide proper details)
      // Derive caliber from weapon subcategory (e.g., "heavy-pistol" -> "heavy-pistol")
      returnedAmmo = {
        id: `ammo-${Date.now()}`,
        catalogId: currentState.loadedAmmoTypeId,
        name: "Recovered Ammunition",
        caliber: weapon.subcategory as AmmunitionCaliber,
        ammoType: "regular",
        quantity: roundsUnloaded,
        damageModifier: 0,
        apModifier: 0,
        cost: 0,
        availability: 0,
      };
    }
  }

  return {
    success: true,
    weapon: updateWeaponAmmoState(weapon, newState),
    returnedAmmo,
    roundsUnloaded,
  };
}

// =============================================================================
// MAGAZINE MANAGEMENT
// =============================================================================

/**
 * Swap the current magazine with a spare.
 * Old magazine (with remaining rounds) goes to spares.
 */
export function swapMagazine(
  weapon: Weapon,
  newMagazine: MagazineItem
): SwapMagazineResult {
  if (!weaponUsesAmmo(weapon)) {
    return {
      success: false,
      weapon,
      error: "Weapon does not use magazines",
    };
  }

  const currentState = getWeaponAmmoState(weapon);

  // Create old magazine from current state
  const oldMagazine: MagazineItem = {
    id: `mag-${Date.now()}`,
    weaponCompatibility: [weapon.subcategory],
    capacity: currentState.magazineCapacity,
    loadedAmmoTypeId: currentState.loadedAmmoTypeId,
    currentRounds: currentState.currentRounds,
    cost: 0, // Will need to be set by caller
  };

  // Load new magazine
  const newState: WeaponAmmoState = {
    loadedAmmoTypeId: newMagazine.loadedAmmoTypeId,
    currentRounds: newMagazine.currentRounds,
    magazineCapacity: newMagazine.capacity,
  };

  return {
    success: true,
    weapon: updateWeaponAmmoState(weapon, newState),
    oldMagazine,
  };
}

/**
 * Create an empty magazine for a weapon type.
 */
export function createEmptyMagazine(
  weaponSubcategory: string,
  capacity: number,
  cost: number = 5
): MagazineItem {
  return {
    id: `mag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    weaponCompatibility: [weaponSubcategory],
    capacity,
    loadedAmmoTypeId: null,
    currentRounds: 0,
    cost,
  };
}

/**
 * Load ammunition into a spare magazine.
 */
export function loadMagazine(
  magazine: MagazineItem,
  ammoItem: AmmunitionItem,
  quantity?: number
): { magazine: MagazineItem; ammoItem: AmmunitionItem; roundsLoaded: number } {
  const spaceAvailable = magazine.capacity - magazine.currentRounds;
  const roundsToLoad = Math.min(
    quantity ?? spaceAvailable,
    spaceAvailable,
    ammoItem.quantity
  );

  return {
    magazine: {
      ...magazine,
      loadedAmmoTypeId: ammoItem.catalogId,
      currentRounds: magazine.currentRounds + roundsToLoad,
    },
    ammoItem: {
      ...ammoItem,
      quantity: ammoItem.quantity - roundsToLoad,
    },
    roundsLoaded: roundsToLoad,
  };
}

// =============================================================================
// FIRING AND CONSUMPTION
// =============================================================================

/**
 * Check if weapon can fire in the given mode.
 */
export function canFire(
  weapon: Weapon,
  firingMode: string
): { canFire: boolean; reason?: string } {
  if (!weaponUsesAmmo(weapon)) {
    // Melee weapons can always "fire" (attack)
    return { canFire: true };
  }

  const ammoState = getWeaponAmmoState(weapon);
  const required = AMMO_CONSUMPTION[firingMode] ?? 1;

  if (ammoState.currentRounds < required) {
    return {
      canFire: false,
      reason: `Insufficient ammunition (need ${required}, have ${ammoState.currentRounds})`,
    };
  }

  return { canFire: true };
}

/**
 * Consume ammunition for a firing action.
 * Returns updated weapon and consumption details.
 */
export function consumeAmmunition(
  weapon: Weapon,
  firingMode: string
): { weapon: Weapon; result: FireResult } {
  const fireCheck = canFire(weapon, firingMode);

  if (!fireCheck.canFire) {
    return {
      weapon,
      result: {
        canFire: false,
        roundsConsumed: 0,
        roundsRemaining: getWeaponAmmoState(weapon).currentRounds,
        reason: fireCheck.reason,
      },
    };
  }

  const ammoState = getWeaponAmmoState(weapon);
  const consumed = AMMO_CONSUMPTION[firingMode] ?? 1;
  const remaining = ammoState.currentRounds - consumed;

  const newState: WeaponAmmoState = {
    ...ammoState,
    currentRounds: remaining,
  };

  return {
    weapon: updateWeaponAmmoState(weapon, newState),
    result: {
      canFire: true,
      roundsConsumed: consumed,
      roundsRemaining: remaining,
    },
  };
}

// =============================================================================
// DAMAGE MODIFIERS
// =============================================================================

/**
 * Get damage and AP modifiers from loaded ammunition.
 */
export function getAmmoDamageModifiers(
  weapon: Weapon,
  ammunitionCatalog: AmmunitionItem[]
): AmmoDamageModifiers {
  const ammoState = getWeaponAmmoState(weapon);

  if (!ammoState.loadedAmmoTypeId) {
    return { damageModifier: 0, apModifier: 0 };
  }

  const ammoType = ammunitionCatalog.find(
    (a) => a.catalogId === ammoState.loadedAmmoTypeId
  );

  if (!ammoType) {
    return { damageModifier: 0, apModifier: 0 };
  }

  return {
    damageModifier: ammoType.damageModifier,
    apModifier: ammoType.apModifier,
    ammoTypeName: ammoType.name,
  };
}

/**
 * Calculate effective weapon damage with loaded ammo modifiers.
 */
export function getEffectiveWeaponDamage(
  weapon: Weapon,
  ammunitionCatalog: AmmunitionItem[]
): { damage: string; ap: number; ammoType?: string } {
  const modifiers = getAmmoDamageModifiers(weapon, ammunitionCatalog);

  // Parse base damage (e.g., "8P" or "(STR+2)S")
  const baseDamage = weapon.damage;
  const baseAp = weapon.ap;

  // Apply modifiers
  const effectiveAp = baseAp + modifiers.apModifier;

  // For numeric damage, we can add the modifier
  // For formula damage (STR+X), we append the modifier
  let effectiveDamage = baseDamage;
  if (modifiers.damageModifier !== 0) {
    const damageMatch = baseDamage.match(/^(\d+)([PS])$/);
    if (damageMatch) {
      const value = parseInt(damageMatch[1], 10) + modifiers.damageModifier;
      effectiveDamage = `${value}${damageMatch[2]}`;
    }
  }

  return {
    damage: effectiveDamage,
    ap: effectiveAp,
    ammoType: modifiers.ammoTypeName,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get ammo display string for UI (e.g., "15/15 APDS").
 */
export function getAmmoDisplayString(
  weapon: Weapon,
  ammunitionCatalog?: AmmunitionItem[]
): string {
  if (!weaponUsesAmmo(weapon)) {
    return "—";
  }

  const ammoState = getWeaponAmmoState(weapon);
  let display = `${ammoState.currentRounds}/${ammoState.magazineCapacity}`;

  if (ammoState.loadedAmmoTypeId && ammunitionCatalog) {
    const ammoType = ammunitionCatalog.find(
      (a) => a.catalogId === ammoState.loadedAmmoTypeId
    );
    if (ammoType) {
      display += ` ${ammoType.ammoType.toUpperCase()}`;
    }
  }

  return display;
}

/**
 * Check if weapon needs reloading (empty or nearly empty).
 */
export function needsReload(weapon: Weapon, threshold: number = 0): boolean {
  if (!weaponUsesAmmo(weapon)) {
    return false;
  }

  const ammoState = getWeaponAmmoState(weapon);
  return ammoState.currentRounds <= threshold;
}
