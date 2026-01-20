/**
 * Weapon Customization Validation Service
 *
 * Provides validation and manipulation functions for weapon modifications.
 * Implements mount point governance, compatibility checking, and built-in
 * modification handling as defined in the Weapon Customization capability.
 */

import type { Weapon, InstalledWeaponMod, WeaponMount } from "@/lib/types/character";
import type {
  WeaponModificationCatalogItem,
  WeaponMountType,
  WeaponSubcategoryMountRegistry,
  WeaponSizeCategory,
} from "@/lib/types/edition";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of a modification validation check
 */
export interface ModValidationResult {
  /** Whether the modification can be installed */
  valid: boolean;
  /** Error messages that prevent installation */
  errors: string[];
  /** Warning messages that don't prevent installation */
  warnings: string[];
}

/**
 * Result of a modification removal operation
 */
export interface ModRemovalResult {
  /** Whether the removal was successful */
  success: boolean;
  /** Updated weapon after removal */
  weapon: Weapon;
  /** Mount points restored by the removal */
  restoredMounts: WeaponMount[];
  /** Error message if removal failed */
  error?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Size hierarchy for minimum weapon size checks.
 * Higher index = larger weapon.
 */
const SIZE_HIERARCHY: WeaponSizeCategory[] = [
  "holdout",
  "light-pistol",
  "heavy-pistol",
  "smg",
  "rifle",
  "heavy",
];

/**
 * Default mount registry for common weapon subcategories (SR5 Core)
 * This can be overridden by edition-specific data.
 */
export const DEFAULT_MOUNT_REGISTRY: WeaponSubcategoryMountRegistry = {
  "hold-out-pistol": {
    size: "holdout",
    availableMounts: [],
  },
  "light-pistol": {
    size: "light-pistol",
    availableMounts: ["barrel", "top"],
  },
  "heavy-pistol": {
    size: "heavy-pistol",
    availableMounts: ["barrel", "top"],
  },
  "machine-pistol": {
    size: "heavy-pistol",
    availableMounts: ["barrel", "top"],
  },
  smg: {
    size: "smg",
    availableMounts: ["barrel", "top"],
  },
  "assault-rifle": {
    size: "rifle",
    availableMounts: ["barrel", "top", "under"],
  },
  "sport-rifle": {
    size: "rifle",
    availableMounts: ["barrel", "top", "under", "stock"],
  },
  "sniper-rifle": {
    size: "rifle",
    availableMounts: ["barrel", "top", "under"],
  },
  shotgun: {
    size: "rifle",
    availableMounts: ["barrel", "top", "under"],
  },
  "light-machine-gun": {
    size: "heavy",
    availableMounts: ["barrel", "top", "under"],
  },
  "medium-machine-gun": {
    size: "heavy",
    availableMounts: ["barrel", "top", "under"],
  },
  "heavy-machine-gun": {
    size: "heavy",
    availableMounts: ["barrel", "top", "under"],
  },
  "assault-cannon": {
    size: "heavy",
    availableMounts: ["top", "under"],
  },
  cannon: {
    size: "heavy",
    availableMounts: ["top", "under"],
  },
  launcher: {
    size: "heavy",
    availableMounts: ["top", "under"],
  },
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Get the size index for comparison operations.
 * Returns -1 if size is not found (treated as smallest).
 */
function getSizeIndex(size: WeaponSizeCategory | undefined): number {
  if (!size) return -1;
  return SIZE_HIERARCHY.indexOf(size);
}

/**
 * Validate that a modification can be installed on a weapon.
 *
 * Checks:
 * 1. Mount point availability (if mod requires a mount)
 * 2. Weapon size compatibility (minimum size check)
 * 3. Subcategory compatibility (allow/block lists)
 * 4. Multi-mount occupancy (for multi-slot accessories)
 */
export function validateModInstallation(
  weapon: Weapon,
  mod: WeaponModificationCatalogItem,
  mountRegistry: WeaponSubcategoryMountRegistry = DEFAULT_MOUNT_REGISTRY
): ModValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Get mount configuration for this weapon's subcategory
  const mountConfig = mountRegistry[weapon.subcategory];

  // Check if weapon supports customization
  if (!mountConfig) {
    errors.push(`Weapon subcategory "${weapon.subcategory}" does not support modifications.`);
    return { valid: false, errors, warnings };
  }

  // Collect all mount points this mod will occupy
  const requiredMounts: WeaponMountType[] = [];
  if (mod.mount) {
    requiredMounts.push(mod.mount);
  }
  if (mod.occupiedMounts) {
    requiredMounts.push(...mod.occupiedMounts);
  }

  // Check mount point availability
  if (requiredMounts.length > 0) {
    const occupiedMounts = weapon.occupiedMounts ?? [];

    for (const mount of requiredMounts) {
      // Check if mount is available on this weapon type
      if (!mountConfig.availableMounts.includes(mount)) {
        errors.push(`Mount point "${mount}" is not available on ${weapon.subcategory} weapons.`);
        continue;
      }

      // Check if mount is already occupied
      if (occupiedMounts.includes(mount)) {
        errors.push(`Mount point "${mount}" is already occupied.`);
      }
    }
  }

  // Check minimum weapon size
  if (mod.minimumWeaponSize && mountConfig.size) {
    const modMinSizeIndex = getSizeIndex(mod.minimumWeaponSize);
    const weaponSizeIndex = getSizeIndex(mountConfig.size);

    if (weaponSizeIndex < modMinSizeIndex) {
      errors.push(
        `This modification requires a minimum weapon size of "${mod.minimumWeaponSize}".`
      );
    }
  }

  // Check compatible weapons list (if specified)
  if (mod.compatibleWeapons && mod.compatibleWeapons.length > 0) {
    const isCompatible =
      mod.compatibleWeapons.includes(weapon.subcategory) ||
      (weapon.catalogId && mod.compatibleWeapons.includes(weapon.catalogId));

    if (!isCompatible) {
      errors.push(`This modification is not compatible with ${weapon.subcategory} weapons.`);
    }
  }

  // Check incompatible weapons list (if specified)
  if (mod.incompatibleWeapons && mod.incompatibleWeapons.length > 0) {
    const isIncompatible =
      mod.incompatibleWeapons.includes(weapon.subcategory) ||
      (weapon.catalogId && mod.incompatibleWeapons.includes(weapon.catalogId));

    if (isIncompatible) {
      errors.push(
        `This modification is explicitly incompatible with ${weapon.subcategory} weapons.`
      );
    }
  }

  // Check for duplicate modification
  const existingMod = weapon.modifications?.find((m) => m.catalogId === mod.id);
  if (existingMod) {
    warnings.push(
      `A modification of this type is already installed. Some weapons allow multiple instances.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get list of available (unoccupied) mount points for a weapon.
 */
export function getAvailableMounts(
  weapon: Weapon,
  mountRegistry: WeaponSubcategoryMountRegistry = DEFAULT_MOUNT_REGISTRY
): WeaponMountType[] {
  const mountConfig = mountRegistry[weapon.subcategory];
  if (!mountConfig) {
    return [];
  }

  const occupiedMounts = weapon.occupiedMounts ?? [];
  return mountConfig.availableMounts.filter((mount) => !occupiedMounts.includes(mount));
}

/**
 * Get all mount points for a weapon subcategory.
 */
export function getAllMounts(
  subcategory: string,
  mountRegistry: WeaponSubcategoryMountRegistry = DEFAULT_MOUNT_REGISTRY
): WeaponMountType[] {
  const mountConfig = mountRegistry[subcategory];
  return mountConfig?.availableMounts ?? [];
}

// =============================================================================
// BUILT-IN MODIFICATION HANDLING
// =============================================================================

/**
 * Apply built-in modifications to a weapon.
 * Built-in mods are automatically installed, marked as immutable,
 * and do not incur costs.
 */
export function applyBuiltInModifications(
  weapon: Weapon,
  builtInMods: WeaponModificationCatalogItem[]
): Weapon {
  if (builtInMods.length === 0) {
    return weapon;
  }

  const modifications: InstalledWeaponMod[] = [...(weapon.modifications ?? [])];
  const occupiedMounts: WeaponMount[] = [...(weapon.occupiedMounts ?? [])];

  for (const mod of builtInMods) {
    // Create installed mod record
    const installedMod: InstalledWeaponMod = {
      catalogId: mod.id,
      name: mod.name,
      mount: mod.mount as WeaponMount | undefined,
      rating: undefined,
      cost: 0, // Built-in mods have no cost
      availability: mod.availability,
      legality: mod.legality,
      isBuiltIn: true,
      capacityUsed: 0,
    };

    modifications.push(installedMod);

    // Mark mount points as occupied
    if (mod.mount) {
      occupiedMounts.push(mod.mount as WeaponMount);
    }
    if (mod.occupiedMounts) {
      for (const mount of mod.occupiedMounts) {
        occupiedMounts.push(mount as WeaponMount);
      }
    }
  }

  return {
    ...weapon,
    modifications,
    occupiedMounts,
  };
}

// =============================================================================
// MODIFICATION REMOVAL
// =============================================================================

/**
 * Remove a modification from a weapon.
 * Returns an error if the modification is built-in (immutable).
 */
export function removeModification(weapon: Weapon, modId: string): ModRemovalResult {
  const modifications = weapon.modifications ?? [];
  const modIndex = modifications.findIndex((m) => m.catalogId === modId);

  if (modIndex === -1) {
    return {
      success: false,
      weapon,
      restoredMounts: [],
      error: `Modification "${modId}" not found on this weapon.`,
    };
  }

  const mod = modifications[modIndex];

  // Check if this is a built-in modification
  if (mod.isBuiltIn) {
    return {
      success: false,
      weapon,
      restoredMounts: [],
      error: `Cannot remove built-in modification "${mod.name}". It is an integral part of the weapon.`,
    };
  }

  // Determine which mount points to restore
  const restoredMounts: WeaponMount[] = [];
  if (mod.mount) {
    restoredMounts.push(mod.mount);
  }

  // Remove the modification
  const updatedModifications = [
    ...modifications.slice(0, modIndex),
    ...modifications.slice(modIndex + 1),
  ];

  // Update occupied mounts
  const occupiedMounts = (weapon.occupiedMounts ?? []).filter(
    (mount) => !restoredMounts.includes(mount)
  );

  return {
    success: true,
    weapon: {
      ...weapon,
      modifications: updatedModifications,
      occupiedMounts,
    },
    restoredMounts,
  };
}

// =============================================================================
// MODIFICATION INSTALLATION
// =============================================================================

/**
 * Install a modification on a weapon.
 * This function assumes validation has already passed.
 */
export function installModification(
  weapon: Weapon,
  mod: WeaponModificationCatalogItem,
  options: {
    rating?: number;
    cost?: number;
  } = {}
): Weapon {
  const installedMod: InstalledWeaponMod = {
    catalogId: mod.id,
    name: mod.name,
    mount: mod.mount as WeaponMount | undefined,
    rating: options.rating,
    cost: options.cost ?? mod.cost,
    availability: mod.availability,
    legality: mod.legality,
    isBuiltIn: false,
    capacityUsed: 0, // TODO: Calculate from mod if applicable
  };

  const modifications = [...(weapon.modifications ?? []), installedMod];
  const occupiedMounts = [...(weapon.occupiedMounts ?? [])];

  // Mark mount points as occupied
  if (mod.mount) {
    occupiedMounts.push(mod.mount as WeaponMount);
  }
  if (mod.occupiedMounts) {
    for (const mount of mod.occupiedMounts) {
      occupiedMounts.push(mount as WeaponMount);
    }
  }

  return {
    ...weapon,
    modifications,
    occupiedMounts,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate total modification cost for a weapon.
 * Excludes built-in modifications.
 */
export function calculateModificationCost(weapon: Weapon): number {
  const modifications = weapon.modifications ?? [];
  return modifications.filter((m) => !m.isBuiltIn).reduce((total, m) => total + m.cost, 0);
}

/**
 * Get all modifications of a specific type installed on a weapon.
 */
export function getModificationsByMount(weapon: Weapon, mount: WeaponMount): InstalledWeaponMod[] {
  const modifications = weapon.modifications ?? [];
  return modifications.filter((m) => m.mount === mount);
}

/**
 * Check if a weapon has any available mount points for customization.
 */
export function canBeCustomized(
  weapon: Weapon,
  mountRegistry: WeaponSubcategoryMountRegistry = DEFAULT_MOUNT_REGISTRY
): boolean {
  return getAvailableMounts(weapon, mountRegistry).length > 0;
}
