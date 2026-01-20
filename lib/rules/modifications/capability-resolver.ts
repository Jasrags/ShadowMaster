/**
 * Modification Capability Resolver
 *
 * Resolves modification capabilities for equipment items using a hierarchical
 * resolution strategy:
 * 1. Item-level capability (explicit override on the item)
 * 2. Category defaults (from categoryModificationDefaults module in ruleset)
 * 3. None (no modification support)
 *
 * This system enables sourcebooks to "unlock" modification support for
 * equipment categories (e.g., melee weapons) while maintaining explicit
 * per-item control when needed.
 *
 * @see /docs/specifications/equipment-modification-capability-system.md
 */

import type {
  MergedRuleset,
  ModificationCapability,
  ModificationSlot,
  CategoryModificationDefaults,
  WeaponMountType,
} from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Base interface for items that can potentially be modified.
 * This is a subset of properties that the resolver needs to check.
 */
export interface ModifiableItem {
  /** Item subcategory (e.g., "melee", "heavy-pistol", "armor") */
  subcategory: string;
  /** Optional explicit modification capability on the item */
  modificationCapability?: ModificationCapability;
  /** For capacity-based items, the total capacity */
  capacity?: number;
}

/**
 * Result of resolving modification capability for an item.
 */
export interface CapabilityResolutionResult {
  /** The resolved capability, or null if no modifications allowed */
  capability: ModificationCapability | null;
  /** Where the capability was resolved from */
  source: "item" | "category-default" | "none";
  /** The subcategory that was used for lookup */
  subcategory: string;
}

// =============================================================================
// CATEGORY DEFAULTS ACCESSOR
// =============================================================================

/**
 * Get the categoryModificationDefaults module from a merged ruleset.
 *
 * @param ruleset - The merged ruleset to extract defaults from
 * @returns The category modification defaults, or undefined if not present
 */
export function getCategoryModificationDefaults(
  ruleset: MergedRuleset
): CategoryModificationDefaults | undefined {
  const module = ruleset.modules.categoryModificationDefaults as
    | CategoryModificationDefaults
    | undefined;
  return module;
}

// =============================================================================
// CAPABILITY RESOLUTION
// =============================================================================

/**
 * Resolves the modification capability for an item.
 *
 * Resolution order:
 * 1. Check explicit item-level `modificationCapability`
 * 2. Check `categoryModificationDefaults` in ruleset for the item's subcategory
 * 3. Return null (no modification support)
 *
 * If a capability has `capabilityMode: "none"`, it is treated as no support.
 *
 * @param item - The item to resolve capability for
 * @param ruleset - The merged ruleset containing category defaults
 * @returns Resolution result with capability, source, and subcategory
 *
 * @example
 * ```typescript
 * const result = resolveModificationCapability(weapon, ruleset);
 * if (result.capability) {
 *   console.log(`${result.subcategory} supports ${result.capability.capabilityMode} mods`);
 *   console.log(`Resolved from: ${result.source}`);
 * }
 * ```
 */
export function resolveModificationCapability(
  item: ModifiableItem,
  ruleset: MergedRuleset
): CapabilityResolutionResult {
  const subcategory = item.subcategory;

  // 1. Check explicit item-level capability
  if (item.modificationCapability) {
    if (item.modificationCapability.capabilityMode === "none") {
      return { capability: null, source: "item", subcategory };
    }
    return { capability: item.modificationCapability, source: "item", subcategory };
  }

  // 2. Check category defaults
  const categoryDefaults = getCategoryModificationDefaults(ruleset);
  if (categoryDefaults) {
    const categoryDefault = categoryDefaults[subcategory];
    if (categoryDefault) {
      if (categoryDefault.capabilityMode === "none") {
        return { capability: null, source: "category-default", subcategory };
      }
      return { capability: categoryDefault, source: "category-default", subcategory };
    }
  }

  // 3. Default: no modifications
  return { capability: null, source: "none", subcategory };
}

/**
 * Get the modification capability for an item.
 * Convenience function that returns just the capability or null.
 *
 * @param item - The item to check
 * @param ruleset - The merged ruleset
 * @returns The resolved capability or null
 */
export function getModificationCapability(
  item: ModifiableItem,
  ruleset: MergedRuleset
): ModificationCapability | null {
  return resolveModificationCapability(item, ruleset).capability;
}

/**
 * Check if an item can accept modifications.
 *
 * @param item - The item to check
 * @param ruleset - The merged ruleset
 * @returns True if the item supports any form of modification
 */
export function canAcceptModifications(item: ModifiableItem, ruleset: MergedRuleset): boolean {
  return getModificationCapability(item, ruleset) !== null;
}

// =============================================================================
// MODE-SPECIFIC HELPERS
// =============================================================================

/**
 * Get available mount points for a mount-based item.
 *
 * @param item - The item to check
 * @param ruleset - The merged ruleset
 * @returns Array of available mount types, or empty array if not mount-based
 */
export function getAvailableMounts(
  item: ModifiableItem,
  ruleset: MergedRuleset
): WeaponMountType[] {
  const capability = getModificationCapability(item, ruleset);

  if (!capability || capability.capabilityMode !== "mount-based") {
    return [];
  }

  return capability.availableMounts ?? [];
}

/**
 * Get the modification capacity for a capacity-based item.
 *
 * For capacity-based items, the capacity can come from:
 * 1. The capability definition itself
 * 2. The item's `capacity` property (e.g., armor rating)
 *
 * @param item - The item to check
 * @param ruleset - The merged ruleset
 * @returns The total capacity, or 0 if not capacity-based
 */
export function getModificationCapacity(item: ModifiableItem, ruleset: MergedRuleset): number {
  const capability = getModificationCapability(item, ruleset);

  if (!capability || capability.capabilityMode !== "capacity-based") {
    return 0;
  }

  // Prefer capability-defined capacity, fall back to item's capacity
  return capability.capacity ?? item.capacity ?? 0;
}

/**
 * Get modification slots for a slot-based item.
 *
 * @param item - The item to check
 * @param ruleset - The merged ruleset
 * @returns Array of modification slots, or empty array if not slot-based
 */
export function getModificationSlots(
  item: ModifiableItem,
  ruleset: MergedRuleset
): ModificationSlot[] {
  const capability = getModificationCapability(item, ruleset);

  if (!capability || capability.capabilityMode !== "slot-based") {
    return [];
  }

  return capability.slots ?? [];
}

// =============================================================================
// MODIFICATION COMPATIBILITY CHECKING
// =============================================================================

/**
 * Check if a specific modification is allowed for an item.
 * Considers whitelist/blacklist constraints defined in the capability.
 *
 * @param item - The item to check
 * @param ruleset - The merged ruleset
 * @param modificationId - The ID of the modification to check
 * @param modificationCategory - Optional category of the modification
 * @returns True if the modification is allowed
 */
export function isModificationAllowed(
  item: ModifiableItem,
  ruleset: MergedRuleset,
  modificationId: string,
  modificationCategory?: string
): boolean {
  const capability = getModificationCapability(item, ruleset);

  if (!capability) {
    return false;
  }

  // Check blacklist first (explicit disallow takes precedence)
  if (capability.disallowedModifications?.includes(modificationId)) {
    return false;
  }

  // Check category blacklist (if provided)
  if (
    modificationCategory &&
    capability.allowedModCategories &&
    capability.allowedModCategories.length > 0 &&
    !capability.allowedModCategories.includes(modificationCategory)
  ) {
    return false;
  }

  // Check whitelist (if defined, only allow listed mods)
  if (capability.allowedModifications && capability.allowedModifications.length > 0) {
    return capability.allowedModifications.includes(modificationId);
  }

  // No restrictions - modification is allowed
  return true;
}

/**
 * Check if a modification can be installed in a specific slot.
 *
 * @param slot - The slot to check
 * @param modificationId - The ID of the modification
 * @param modificationCategory - Optional category of the modification
 * @returns True if the modification fits in the slot
 */
export function canInstallInSlot(
  slot: ModificationSlot,
  modificationId: string,
  modificationCategory?: string
): boolean {
  // Check specific mod ID whitelist
  if (slot.acceptsModifications && slot.acceptsModifications.length > 0) {
    if (!slot.acceptsModifications.includes(modificationId)) {
      return false;
    }
  }

  // Check category whitelist
  if (slot.acceptsCategories && slot.acceptsCategories.length > 0 && modificationCategory) {
    if (!slot.acceptsCategories.includes(modificationCategory)) {
      return false;
    }
  }

  return true;
}

// =============================================================================
// CAPABILITY MODE CHECKS
// =============================================================================

/**
 * Check if an item uses mount-based modifications.
 */
export function isMountBased(item: ModifiableItem, ruleset: MergedRuleset): boolean {
  const capability = getModificationCapability(item, ruleset);
  return capability?.capabilityMode === "mount-based";
}

/**
 * Check if an item uses capacity-based modifications.
 */
export function isCapacityBased(item: ModifiableItem, ruleset: MergedRuleset): boolean {
  const capability = getModificationCapability(item, ruleset);
  return capability?.capabilityMode === "capacity-based";
}

/**
 * Check if an item uses slot-based modifications.
 */
export function isSlotBased(item: ModifiableItem, ruleset: MergedRuleset): boolean {
  const capability = getModificationCapability(item, ruleset);
  return capability?.capabilityMode === "slot-based";
}
