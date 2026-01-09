/**
 * Cyberlimb types
 *
 * Defines the structure for cyberlimb augmentations in Shadowrun 5E.
 * Cyberlimbs have unique mechanics compared to standard cyberware:
 * - Location tracking on the body
 * - Internal STR/AGI attributes
 * - Capacity for enhancements and accessories
 * - Hierarchical replacement rules
 *
 * @see docs/rules/5e/game-mechanics/cyberlimbs.md
 * @see docs/capabilities/character.augmentation-systems.md
 * @see docs/decisions/010-gear.inventory-state-management.md
 */

import type { ID, ISODateString, ItemLegality } from "./core";
import type { CyberwareGrade, CyberwareItem } from "./character";
import type { WirelessEffect } from "./wireless-effects";

// =============================================================================
// LOCATION & TYPE ENUMS
// =============================================================================

/**
 * Body locations where cyberlimbs can be installed.
 * Each location can only have one cyberlimb.
 */
export type CyberlimbLocation =
  | "left-arm"
  | "right-arm"
  | "left-leg"
  | "right-leg"
  | "left-hand"
  | "right-hand"
  | "left-foot"
  | "right-foot"
  | "left-lower-arm"
  | "right-lower-arm"
  | "left-lower-leg"
  | "right-lower-leg"
  | "torso"
  | "skull";

/**
 * Classification of cyberlimb types.
 * Determines capacity, essence cost, and CM bonus.
 */
export type CyberlimbType =
  | "full-arm"
  | "lower-arm"
  | "hand"
  | "full-leg"
  | "lower-leg"
  | "foot"
  | "torso"
  | "skull";

/**
 * Appearance classification for cyberlimbs.
 * Obvious limbs are visibly mechanical; synthetic limbs appear natural.
 * Synthetic limbs have reduced capacity but -8 Concealability.
 */
export type CyberlimbAppearance = "obvious" | "synthetic";

/**
 * Enhancement types that can be installed in cyberlimbs.
 * Only one enhancement of each type can be installed per limb.
 */
export type CyberlimbEnhancementType = "agility" | "strength" | "armor";

// =============================================================================
// HIERARCHY & CONSTANTS
// =============================================================================

/**
 * Limb hierarchy for replacement rules.
 * When a higher-level limb is installed, lower-level limbs in that location are removed.
 * Example: Installing a full-arm removes any existing lower-arm or hand on that side.
 */
export const LIMB_HIERARCHY: Record<CyberlimbType, CyberlimbType[]> = {
  "full-arm": ["lower-arm", "hand"],
  "lower-arm": ["hand"],
  hand: [],
  "full-leg": ["lower-leg", "foot"],
  "lower-leg": ["foot"],
  foot: [],
  torso: [],
  skull: [],
};

/**
 * Maps limb types to their possible body locations.
 * Used for validation when installing cyberlimbs.
 */
export const LIMB_TYPE_LOCATIONS: Record<CyberlimbType, CyberlimbLocation[]> = {
  "full-arm": ["left-arm", "right-arm"],
  "lower-arm": ["left-lower-arm", "right-lower-arm"],
  hand: ["left-hand", "right-hand"],
  "full-leg": ["left-leg", "right-leg"],
  "lower-leg": ["left-lower-leg", "right-lower-leg"],
  foot: ["left-foot", "right-foot"],
  torso: ["torso"],
  skull: ["skull"],
};

/**
 * Physical Condition Monitor bonus per limb type.
 * Full limbs add +1 box, partial limbs add +0.5, hands/feet add nothing.
 * Total bonus is floored when calculating final CM.
 */
export const LIMB_CM_BONUS: Record<CyberlimbType, number> = {
  "full-arm": 1,
  "full-leg": 1,
  torso: 1,
  skull: 1,
  "lower-arm": 0.5,
  "lower-leg": 0.5,
  hand: 0,
  foot: 0,
};

/**
 * Maps location to its "side" for hierarchy checks.
 * Used to determine if a new limb conflicts with an existing one.
 */
export const LOCATION_SIDE: Record<
  CyberlimbLocation,
  "left" | "right" | "center"
> = {
  "left-arm": "left",
  "right-arm": "right",
  "left-leg": "left",
  "right-leg": "right",
  "left-hand": "left",
  "right-hand": "right",
  "left-foot": "left",
  "right-foot": "right",
  "left-lower-arm": "left",
  "right-lower-arm": "right",
  "left-lower-leg": "left",
  "right-lower-leg": "right",
  torso: "center",
  skull: "center",
};

/**
 * Maps location to its limb type for hierarchy checks.
 */
export const LOCATION_LIMB_TYPE: Record<CyberlimbLocation, CyberlimbType> = {
  "left-arm": "full-arm",
  "right-arm": "full-arm",
  "left-leg": "full-leg",
  "right-leg": "full-leg",
  "left-hand": "hand",
  "right-hand": "hand",
  "left-foot": "foot",
  "right-foot": "foot",
  "left-lower-arm": "lower-arm",
  "right-lower-arm": "lower-arm",
  "left-lower-leg": "lower-leg",
  "right-lower-leg": "lower-leg",
  torso: "torso",
  skull: "skull",
};

// =============================================================================
// AUDIT TRAIL
// =============================================================================

/**
 * Modification history entry for audit trail.
 * Satisfies: character.augmentation-systems - persistent and auditable record
 */
export interface CyberlimbModificationEntry {
  /** Unique identifier for this entry */
  id: ID;
  /** When the modification occurred */
  timestamp: ISODateString;
  /** Type of modification */
  action:
    | "installed"
    | "removed"
    | "enhancement_added"
    | "enhancement_removed"
    | "enhancement_replaced"
    | "accessory_added"
    | "accessory_removed"
    | "weapon_added"
    | "weapon_removed"
    | "wireless_toggled"
    | "condition_changed";
  /** ID of the affected item (enhancement, accessory, weapon) */
  targetId?: string;
  /** Name of the affected item */
  targetName?: string;
  /** Previous value/state */
  previousValue?: unknown;
  /** New value/state */
  newValue?: unknown;
  /** Optional notes about the modification */
  notes?: string;
}

// =============================================================================
// INSTALLED ITEMS (Character-owned)
// =============================================================================

/**
 * Enhancement installed in a cyberlimb.
 * Only one enhancement of each type (agility, strength, armor) per limb.
 */
export interface CyberlimbEnhancement {
  /** Unique identifier for this installed enhancement */
  id: ID;
  /** Reference to catalog item */
  catalogId: string;
  /** Display name */
  name: string;
  /** Enhancement type for stacking validation */
  enhancementType: CyberlimbEnhancementType;
  /** Rating (1-3 for standard enhancements) */
  rating: number;
  /** Capacity consumed in the parent limb */
  capacityUsed: number;
  /** Cost in nuyen (after grade multiplier) */
  cost: number;
  /** Availability rating */
  availability: number;
  /** Legality status */
  legality?: ItemLegality;
  /** Whether wireless is enabled */
  wirelessEnabled?: boolean;
  /** Structured wireless effects */
  wirelessEffects?: WirelessEffect[];
}

/**
 * Accessory installed in a cyberlimb.
 * Examples: gyromount, holster, slide, hydraulic jacks, smuggling compartment
 */
export interface CyberlimbAccessory {
  /** Unique identifier for this installed accessory */
  id: ID;
  /** Reference to catalog item */
  catalogId: string;
  /** Display name */
  name: string;
  /** Rating (if applicable, e.g., hydraulic jacks 1-6) */
  rating?: number;
  /** Capacity consumed in the parent limb */
  capacityUsed: number;
  /** Cost in nuyen */
  cost: number;
  /** Availability rating */
  availability: number;
  /** Legality status */
  legality?: ItemLegality;
  /** Whether wireless is enabled */
  wirelessEnabled?: boolean;
  /** Structured wireless effects */
  wirelessEffects?: WirelessEffect[];
  /** Human-readable wireless bonus description */
  wirelessBonus?: string;
}

/**
 * Cyber implant weapon installed in a cyberlimb or directly in meat.
 * Includes cyberguns (hold-out to SMG) and cyber melee weapons (razors, blades, spurs).
 */
export interface CyberImplantWeapon {
  /** Unique identifier for this installed weapon */
  id: ID;
  /** Reference to catalog item */
  catalogId: string;
  /** Display name */
  name: string;
  /** Capacity consumed (0 if installed in meat with essence cost) */
  capacityUsed: number;
  /** Essence cost (for meat installation; 0 if in cyberlimb) */
  essenceCost: number;
  /** Cost in nuyen */
  cost: number;
  /** Availability rating */
  availability: number;
  /** Legality status */
  legality?: ItemLegality;
  /** Damage string (e.g., "(STR+2)P", "7P") */
  damage: string;
  /** Armor penetration */
  ap: number;
  /** Reach for melee weapons */
  reach?: number;
  /** Fire modes for ranged weapons */
  mode?: string[];
  /** Magazine capacity for ranged weapons */
  ammoCapacity?: number;
  /** Current loaded rounds */
  currentAmmo?: number;
  /** Whether installed in cyberlimb or directly in body */
  installedIn: "cyberlimb" | "meat";
  /** ID of parent cyberlimb (if installed in cyberlimb) */
  parentLimbId?: ID;
}

// =============================================================================
// CYBERLIMB ITEM (Character-owned)
// =============================================================================

/**
 * Cyberlimb item installed on a character.
 * Extends CyberwareItem with cyberlimb-specific properties.
 *
 * Satisfies:
 * - character.augmentation-systems: Essence tracking, capacity management, attribute bonuses
 * - ADR-010: Wireless state, device condition
 * - ADR-011: Sheet-driven creation support
 */
export interface CyberlimbItem
  extends Omit<CyberwareItem, "enhancements" | "category"> {
  /** Always "cyberlimb" for type discrimination */
  category: "cyberlimb";

  // -------------------------------------------------------------------------
  // Location & Type
  // -------------------------------------------------------------------------

  /** Body location where this limb is installed */
  location: CyberlimbLocation;
  /** Type classification of this limb */
  limbType: CyberlimbType;
  /** Appearance (obvious or synthetic) */
  appearance: CyberlimbAppearance;

  // -------------------------------------------------------------------------
  // Base Attributes (always 3)
  // -------------------------------------------------------------------------

  /** Base Strength (always 3 for all cyberlimbs) */
  baseStrength: 3;
  /** Base Agility (always 3 for all cyberlimbs) */
  baseAgility: 3;

  // -------------------------------------------------------------------------
  // Customization (set at purchase, immutable)
  // -------------------------------------------------------------------------

  /**
   * STR customization above base 3.
   * Range: 0 to (racial natural maximum - 3)
   * Set at purchase, cannot be changed afterward.
   */
  customStrength: number;

  /**
   * AGI customization above base 3.
   * Range: 0 to (racial natural maximum - 3)
   * Set at purchase, cannot be changed afterward.
   */
  customAgility: number;

  // -------------------------------------------------------------------------
  // Capacity
  // -------------------------------------------------------------------------

  /** Base capacity provided by this limb type */
  baseCapacity: number;
  /** Total capacity currently used by enhancements, accessories, and weapons */
  capacityUsed: number;

  // -------------------------------------------------------------------------
  // Installed Items
  // -------------------------------------------------------------------------

  /** Enhancements installed in this limb (agility, strength, armor) */
  enhancements: CyberlimbEnhancement[];
  /** Accessories installed in this limb */
  accessories: CyberlimbAccessory[];
  /** Cyber implant weapons installed in this limb */
  weapons: CyberImplantWeapon[];

  // -------------------------------------------------------------------------
  // State (per ADR-010)
  // -------------------------------------------------------------------------

  /** Whether wireless is enabled for this limb and its contents */
  wirelessEnabled: boolean;
  /** Device condition */
  condition: "working" | "bricked" | "permanently_bricked";

  // -------------------------------------------------------------------------
  // Audit Trail
  // -------------------------------------------------------------------------

  /** When this limb was installed */
  installedAt: ISODateString;
  /** Complete history of modifications to this limb */
  modificationHistory: CyberlimbModificationEntry[];
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard to check if a cyberware item is a cyberlimb.
 */
export function isCyberlimb(
  item: CyberwareItem | CyberlimbItem
): item is CyberlimbItem {
  return item.category === "cyberlimb" && "location" in item && "limbType" in item;
}

/**
 * Type guard to check if a location is for an arm.
 */
export function isArmLocation(location: CyberlimbLocation): boolean {
  return (
    location === "left-arm" ||
    location === "right-arm" ||
    location === "left-lower-arm" ||
    location === "right-lower-arm" ||
    location === "left-hand" ||
    location === "right-hand"
  );
}

/**
 * Type guard to check if a location is for a leg.
 */
export function isLegLocation(location: CyberlimbLocation): boolean {
  return (
    location === "left-leg" ||
    location === "right-leg" ||
    location === "left-lower-leg" ||
    location === "right-lower-leg" ||
    location === "left-foot" ||
    location === "right-foot"
  );
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the effective STR of a cyberlimb.
 * Formula: baseStrength (3) + customStrength + strengthEnhancementRating
 */
export function getCyberlimbStrength(limb: CyberlimbItem): number {
  const strengthEnhancement = limb.enhancements.find(
    (e) => e.enhancementType === "strength"
  );
  return (
    limb.baseStrength +
    limb.customStrength +
    (strengthEnhancement?.rating ?? 0)
  );
}

/**
 * Get the effective AGI of a cyberlimb.
 * Formula: baseAgility (3) + customAgility + agilityEnhancementRating
 */
export function getCyberlimbAgility(limb: CyberlimbItem): number {
  const agilityEnhancement = limb.enhancements.find(
    (e) => e.enhancementType === "agility"
  );
  return (
    limb.baseAgility + limb.customAgility + (agilityEnhancement?.rating ?? 0)
  );
}

/**
 * Get the armor bonus from a cyberlimb's armor enhancement.
 */
export function getCyberlimbArmorBonus(limb: CyberlimbItem): number {
  const armorEnhancement = limb.enhancements.find(
    (e) => e.enhancementType === "armor"
  );
  return armorEnhancement?.rating ?? 0;
}

/**
 * Get remaining capacity in a cyberlimb.
 */
export function getCyberlimbAvailableCapacity(limb: CyberlimbItem): number {
  return limb.baseCapacity - limb.capacityUsed;
}

/**
 * Calculate total capacity used by all installed items.
 */
export function calculateCyberlimbCapacityUsed(limb: CyberlimbItem): number {
  const enhancementCapacity = limb.enhancements.reduce(
    (sum, e) => sum + e.capacityUsed,
    0
  );
  const accessoryCapacity = limb.accessories.reduce(
    (sum, a) => sum + a.capacityUsed,
    0
  );
  const weaponCapacity = limb.weapons.reduce(
    (sum, w) => sum + w.capacityUsed,
    0
  );
  return enhancementCapacity + accessoryCapacity + weaponCapacity;
}

/**
 * Get the Physical Condition Monitor bonus from a cyberlimb.
 */
export function getCyberlimbCMBonus(limb: CyberlimbItem): number {
  return LIMB_CM_BONUS[limb.limbType];
}

/**
 * Check if a limb type would replace another based on hierarchy.
 * Example: full-arm replaces lower-arm and hand.
 */
export function wouldReplaceExisting(
  newLimbType: CyberlimbType,
  existingLimbType: CyberlimbType
): boolean {
  const replacedTypes = LIMB_HIERARCHY[newLimbType];
  return replacedTypes.includes(existingLimbType);
}

/**
 * Check if an existing limb blocks installation of a new limb.
 * Example: Cannot install hand if full-arm already exists.
 */
export function isBlockedByExisting(
  newLimbType: CyberlimbType,
  existingLimbType: CyberlimbType
): boolean {
  // Check if existing limb would replace the new one (reverse hierarchy)
  const existingReplaces = LIMB_HIERARCHY[existingLimbType];
  return existingReplaces.includes(newLimbType);
}

/**
 * Get all locations on the same side that would be affected by a new limb.
 */
export function getAffectedLocations(
  location: CyberlimbLocation,
  limbType: CyberlimbType
): CyberlimbLocation[] {
  const side = LOCATION_SIDE[location];
  const replacedTypes = LIMB_HIERARCHY[limbType];

  // Find all locations on the same side with types that would be replaced
  const affected: CyberlimbLocation[] = [];
  for (const [loc, type] of Object.entries(LOCATION_LIMB_TYPE)) {
    if (
      LOCATION_SIDE[loc as CyberlimbLocation] === side &&
      replacedTypes.includes(type)
    ) {
      affected.push(loc as CyberlimbLocation);
    }
  }
  return affected;
}
