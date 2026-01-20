/**
 * Equipment Modification System
 *
 * This module provides the modification capability resolution system for
 * weapons, armor, and other equipment.
 *
 * Key features:
 * - Hierarchical capability resolution (item → category → none)
 * - Support for mount-based, capacity-based, and slot-based modifications
 * - Sourcebook-driven capability unlocking
 *
 * @example
 * ```typescript
 * import { canAcceptModifications, getAvailableMounts } from '@/lib/rules/modifications';
 *
 * // Check if a weapon can be modified
 * if (canAcceptModifications(weapon, ruleset)) {
 *   const mounts = getAvailableMounts(weapon, ruleset);
 *   console.log('Available mounts:', mounts);
 * }
 * ```
 */

export {
  // Types
  type ModifiableItem,
  type CapabilityResolutionResult,
  // Category defaults accessor
  getCategoryModificationDefaults,
  // Core resolution
  resolveModificationCapability,
  getModificationCapability,
  canAcceptModifications,
  // Mode-specific helpers
  getAvailableMounts,
  getModificationCapacity,
  getModificationSlots,
  // Compatibility checking
  isModificationAllowed,
  canInstallInSlot,
  // Mode checks
  isMountBased,
  isCapacityBased,
  isSlotBased,
} from "./capability-resolver";
