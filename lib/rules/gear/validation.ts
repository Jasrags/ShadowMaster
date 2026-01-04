/**
 * Gear Validation Engine
 *
 * Validates gear purchases against ruleset constraints including:
 * - Availability restrictions (creation vs active play)
 * - Device rating limits
 * - Restricted/Forbidden item checks
 *
 * Per SR5 Core Rulebook:
 * - Maximum Availability at creation: 12
 * - Maximum Device Rating at creation: 6
 * - Restricted items require licenses, Forbidden items unavailable at creation
 */

import type {
  Character,
  CharacterDraft,
  GearItem,
  Weapon,
  ArmorItem,
  InstalledWeaponMod,
  InstalledArmorMod,
  InstalledGearMod,
  ItemLegality,
} from "@/lib/types";
import type {
  CharacterCyberdeck,
  CharacterCommlink,
} from "@/lib/types/matrix";
import type { CharacterRCC } from "@/lib/types/character";

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Default creation constraints (SR5 standard)
 */
export const CREATION_CONSTRAINTS = {
  /** Maximum availability rating at character creation */
  maxAvailabilityAtCreation: 12,
  /** Maximum device rating at character creation */
  maxDeviceRatingAtCreation: 6,
  /** Whether restricted items are allowed at creation (typically no without GM approval) */
  allowRestrictedAtCreation: false,
  /** Whether forbidden items are allowed at creation (never) */
  allowForbiddenAtCreation: false,
} as const;

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * Error codes for gear validation failures
 */
export type GearValidationErrorCode =
  | "AVAILABILITY_EXCEEDED"
  | "AVAILABILITY_RESTRICTED"
  | "AVAILABILITY_FORBIDDEN"
  | "DEVICE_RATING_EXCEEDED"
  | "MOD_AVAILABILITY_EXCEEDED"
  | "MOD_RESTRICTED"
  | "MOD_FORBIDDEN";

/**
 * Validation error with details
 */
export interface GearValidationError {
  code: GearValidationErrorCode;
  message: string;
  itemName: string;
  itemType: "gear" | "weapon" | "armor" | "cyberdeck" | "commlink" | "rcc" | "modification";
  field?: string;
  details?: Record<string, unknown>;
}

/**
 * Validation result
 */
export interface GearValidationResult {
  valid: boolean;
  errors: GearValidationError[];
}

/**
 * Context for validation
 */
export interface GearValidationContext {
  /** Character's current lifecycle stage */
  lifecycleStage: "creation" | "active";
  /** Maximum availability allowed */
  maxAvailability?: number;
  /** Maximum device rating allowed */
  maxDeviceRating?: number;
  /** Whether to allow restricted items */
  allowRestricted?: boolean;
  /** Whether to allow forbidden items */
  allowForbidden?: boolean;
}

// =============================================================================
// MAIN VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate all gear on a character for creation constraints
 *
 * @param character - The character to validate
 * @param context - Validation context (defaults to creation stage)
 * @returns Validation result with all errors
 */
export function validateAllGear(
  character: Character | CharacterDraft,
  context?: Partial<GearValidationContext>
): GearValidationResult {
  const isCreation = character.status === "draft";
  const ctx: GearValidationContext = {
    lifecycleStage: isCreation ? "creation" : "active",
    maxAvailability: isCreation ? CREATION_CONSTRAINTS.maxAvailabilityAtCreation : undefined,
    maxDeviceRating: isCreation ? CREATION_CONSTRAINTS.maxDeviceRatingAtCreation : undefined,
    allowRestricted: isCreation ? CREATION_CONSTRAINTS.allowRestrictedAtCreation : true,
    allowForbidden: isCreation ? CREATION_CONSTRAINTS.allowForbiddenAtCreation : false,
    ...context,
  };

  const errors: GearValidationError[] = [];

  // Validate general gear
  errors.push(...validateGearItems(character.gear ?? [], ctx));

  // Validate weapons and their modifications
  errors.push(...validateWeapons(character.weapons ?? [], ctx));

  // Validate armor and their modifications
  errors.push(...validateArmor(character.armor ?? [], ctx));

  // Validate matrix devices (device rating)
  errors.push(...validateCyberdecks(character.cyberdecks ?? [], ctx));
  errors.push(...validateCommlinks(character.commlinks ?? [], ctx));
  errors.push(...validateRCCs(character.rccs ?? [], ctx));

  return {
    valid: errors.length === 0,
    errors,
  };
}

// =============================================================================
// GEAR ITEM VALIDATION
// =============================================================================

/**
 * Validate general gear items
 */
function validateGearItems(
  items: GearItem[],
  context: GearValidationContext
): GearValidationError[] {
  const errors: GearValidationError[] = [];

  for (const item of items) {
    // Check base item availability
    if (item.availability !== undefined) {
      const availResult = validateAvailability(
        item.availability,
        item.name,
        "gear",
        context
      );
      if (availResult) errors.push(availResult);
    }

    // Check modifications availability
    if (item.modifications) {
      errors.push(...validateInstalledMods(item.modifications, item.name, context));
    }
  }

  return errors;
}

/**
 * Validate weapons and their modifications
 */
function validateWeapons(
  weapons: Weapon[],
  context: GearValidationContext
): GearValidationError[] {
  const errors: GearValidationError[] = [];

  for (const weapon of weapons) {
    // Check base weapon availability
    if (weapon.availability !== undefined) {
      const availResult = validateAvailability(
        weapon.availability,
        weapon.name,
        "weapon",
        context
      );
      if (availResult) errors.push(availResult);
    }

    // Check weapon modifications
    if (weapon.modifications) {
      errors.push(...validateWeaponMods(weapon.modifications, weapon.name, context));
    }
  }

  return errors;
}

/**
 * Validate armor and their modifications
 */
function validateArmor(
  armorItems: ArmorItem[],
  context: GearValidationContext
): GearValidationError[] {
  const errors: GearValidationError[] = [];

  for (const armor of armorItems) {
    // Check base armor availability
    if (armor.availability !== undefined) {
      const availResult = validateAvailability(
        armor.availability,
        armor.name,
        "armor",
        context
      );
      if (availResult) errors.push(availResult);
    }

    // Check armor modifications
    if (armor.modifications) {
      errors.push(...validateArmorMods(armor.modifications, armor.name, context));
    }
  }

  return errors;
}

// =============================================================================
// MATRIX DEVICE VALIDATION
// =============================================================================

/**
 * Validate cyberdecks for device rating and availability
 */
function validateCyberdecks(
  cyberdecks: CharacterCyberdeck[],
  context: GearValidationContext
): GearValidationError[] {
  const errors: GearValidationError[] = [];

  for (const deck of cyberdecks) {
    // Check availability
    if (deck.availability !== undefined) {
      const availResult = validateAvailability(
        deck.availability,
        deck.name,
        "cyberdeck",
        context,
        deck.legality
      );
      if (availResult) errors.push(availResult);
    }

    // Check device rating
    const ratingResult = validateDeviceRating(
      deck.deviceRating,
      deck.name,
      "cyberdeck",
      context
    );
    if (ratingResult) errors.push(ratingResult);
  }

  return errors;
}

/**
 * Validate commlinks for device rating and availability
 */
function validateCommlinks(
  commlinks: CharacterCommlink[],
  context: GearValidationContext
): GearValidationError[] {
  const errors: GearValidationError[] = [];

  for (const commlink of commlinks) {
    // Check availability
    if (commlink.availability !== undefined) {
      const availResult = validateAvailability(
        commlink.availability,
        commlink.name,
        "commlink",
        context
      );
      if (availResult) errors.push(availResult);
    }

    // Check device rating
    const ratingResult = validateDeviceRating(
      commlink.deviceRating,
      commlink.name,
      "commlink",
      context
    );
    if (ratingResult) errors.push(ratingResult);
  }

  return errors;
}

/**
 * Validate RCCs for device rating and availability
 */
function validateRCCs(
  rccs: CharacterRCC[],
  context: GearValidationContext
): GearValidationError[] {
  const errors: GearValidationError[] = [];

  for (const rcc of rccs) {
    // Check availability
    if (rcc.availability !== undefined) {
      const availResult = validateAvailability(
        rcc.availability,
        rcc.name,
        "rcc",
        context,
        rcc.legality
      );
      if (availResult) errors.push(availResult);
    }

    // Check device rating
    const ratingResult = validateDeviceRating(
      rcc.deviceRating,
      rcc.name,
      "rcc",
      context
    );
    if (ratingResult) errors.push(ratingResult);
  }

  return errors;
}

// =============================================================================
// MODIFICATION VALIDATION
// =============================================================================

/**
 * Validate installed gear modifications
 */
function validateInstalledMods(
  mods: InstalledGearMod[],
  parentName: string,
  context: GearValidationContext
): GearValidationError[] {
  const errors: GearValidationError[] = [];

  for (const mod of mods) {
    const availResult = validateModAvailability(
      mod.availability,
      mod.name,
      parentName,
      context,
      mod.legality
    );
    if (availResult) errors.push(availResult);
  }

  return errors;
}

/**
 * Validate installed weapon modifications
 */
function validateWeaponMods(
  mods: InstalledWeaponMod[],
  parentName: string,
  context: GearValidationContext
): GearValidationError[] {
  const errors: GearValidationError[] = [];

  for (const mod of mods) {
    const availResult = validateModAvailability(
      mod.availability,
      mod.name,
      parentName,
      context,
      mod.legality
    );
    if (availResult) errors.push(availResult);
  }

  return errors;
}

/**
 * Validate installed armor modifications
 */
function validateArmorMods(
  mods: InstalledArmorMod[],
  parentName: string,
  context: GearValidationContext
): GearValidationError[] {
  const errors: GearValidationError[] = [];

  for (const mod of mods) {
    const availResult = validateModAvailability(
      mod.availability,
      mod.name,
      parentName,
      context,
      mod.legality
    );
    if (availResult) errors.push(availResult);
  }

  return errors;
}

// =============================================================================
// CORE VALIDATION HELPERS
// =============================================================================

/**
 * Validate item availability against constraints
 */
function validateAvailability(
  availability: number,
  itemName: string,
  itemType: GearValidationError["itemType"],
  context: GearValidationContext,
  legality?: ItemLegality
): GearValidationError | null {
  // Check forbidden first (most restrictive)
  if (legality === "forbidden" && !context.allowForbidden) {
    return {
      code: "AVAILABILITY_FORBIDDEN",
      message: `${itemName} is forbidden and cannot be purchased during character creation.`,
      itemName,
      itemType,
      field: "availability",
      details: { availability, forbidden: true },
    };
  }

  // Check restricted at creation
  if (legality === "restricted" && context.lifecycleStage === "creation" && !context.allowRestricted) {
    return {
      code: "AVAILABILITY_RESTRICTED",
      message: `${itemName} is restricted (R) and cannot be purchased during character creation without GM approval.`,
      itemName,
      itemType,
      field: "availability",
      details: { availability, restricted: true },
    };
  }

  // Check max availability
  if (context.maxAvailability !== undefined && availability > context.maxAvailability) {
    return {
      code: "AVAILABILITY_EXCEEDED",
      message: `${itemName} has Availability ${availability}, which exceeds the maximum of ${context.maxAvailability} allowed during character creation.`,
      itemName,
      itemType,
      field: "availability",
      details: {
        availability,
        maxAllowed: context.maxAvailability,
      },
    };
  }

  return null;
}

/**
 * Validate modification availability
 */
function validateModAvailability(
  availability: number,
  modName: string,
  parentName: string,
  context: GearValidationContext,
  legality?: ItemLegality
): GearValidationError | null {
  // Check forbidden first
  if (legality === "forbidden" && !context.allowForbidden) {
    return {
      code: "MOD_FORBIDDEN",
      message: `${modName} on ${parentName} is forbidden and cannot be purchased during character creation.`,
      itemName: modName,
      itemType: "modification",
      field: "availability",
      details: { availability, forbidden: true, parentItem: parentName },
    };
  }

  // Check restricted at creation
  if (legality === "restricted" && context.lifecycleStage === "creation" && !context.allowRestricted) {
    return {
      code: "MOD_RESTRICTED",
      message: `${modName} on ${parentName} is restricted (R) and cannot be purchased during character creation without GM approval.`,
      itemName: modName,
      itemType: "modification",
      field: "availability",
      details: { availability, restricted: true, parentItem: parentName },
    };
  }

  // Check max availability
  if (context.maxAvailability !== undefined && availability > context.maxAvailability) {
    return {
      code: "MOD_AVAILABILITY_EXCEEDED",
      message: `${modName} on ${parentName} has Availability ${availability}, which exceeds the maximum of ${context.maxAvailability} allowed during character creation.`,
      itemName: modName,
      itemType: "modification",
      field: "availability",
      details: {
        availability,
        maxAllowed: context.maxAvailability,
        parentItem: parentName,
      },
    };
  }

  return null;
}

/**
 * Validate device rating against creation constraints
 */
function validateDeviceRating(
  deviceRating: number,
  deviceName: string,
  deviceType: "cyberdeck" | "commlink" | "rcc",
  context: GearValidationContext
): GearValidationError | null {
  if (
    context.maxDeviceRating !== undefined &&
    context.lifecycleStage === "creation" &&
    deviceRating > context.maxDeviceRating
  ) {
    return {
      code: "DEVICE_RATING_EXCEEDED",
      message: `${deviceName} has Device Rating ${deviceRating}, which exceeds the maximum of ${context.maxDeviceRating} allowed during character creation.`,
      itemName: deviceName,
      itemType: deviceType,
      field: "deviceRating",
      details: {
        deviceRating,
        maxAllowed: context.maxDeviceRating,
      },
    };
  }

  return null;
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Quick check if an item's availability is valid for creation
 */
export function isAvailabilityValidForCreation(
  availability: number,
  restricted?: boolean,
  forbidden?: boolean
): boolean {
  if (forbidden) return false;
  if (restricted) return false;
  return availability <= CREATION_CONSTRAINTS.maxAvailabilityAtCreation;
}

/**
 * Quick check if a device rating is valid for creation
 */
export function isDeviceRatingValidForCreation(deviceRating: number): boolean {
  return deviceRating <= CREATION_CONSTRAINTS.maxDeviceRatingAtCreation;
}

/**
 * Get a human-readable summary of validation errors
 */
export function getGearValidationSummary(result: GearValidationResult): string {
  if (result.valid) {
    return "All gear is valid for character creation.";
  }

  return result.errors.map((e) => e.message).join("\n");
}
