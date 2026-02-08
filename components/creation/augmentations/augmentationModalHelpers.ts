/**
 * augmentationModalHelpers
 *
 * Constants, types, and utility functions for the augmentation modal.
 */

import type { ItemLegality } from "@/lib/types";
import type { CyberlimbLocation, CyberlimbType } from "@/lib/types/cyberlimb";
import { LOCATION_SIDE, isBlockedByExisting, wouldReplaceExisting } from "@/lib/types/cyberlimb";

// Re-export shared formatting from utils.ts
export { formatCurrency, formatEssence } from "./utils";

// =============================================================================
// TYPES
// =============================================================================

export type AugmentationType = "cyberware" | "bioware";

/** Simplified cyberlimb info for conflict checking */
export interface InstalledCyberlimb {
  id: string;
  name: string;
  location: CyberlimbLocation;
  limbType: CyberlimbType;
}

/** Installed skill-linked bioware for duplicate checking */
export interface InstalledSkillLinkedBioware {
  catalogId: string;
  targetSkill: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const MAX_AVAILABILITY = 12;

/** Grade labels with full names (for modal grade selector) */
export const GRADE_LABELS: Record<string, string> = {
  used: "Used",
  standard: "Standard",
  alpha: "Alpha",
  beta: "Beta",
  delta: "Delta",
};

export const CYBERWARE_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "headware", name: "Headware" },
  { id: "eyeware", name: "Eyeware" },
  { id: "earware", name: "Earware" },
  { id: "bodyware", name: "Bodyware" },
  { id: "cyberlimb", name: "Cyberlimbs" },
  { id: "cybernetic-weapon", name: "Weapons" },
];

export const BIOWARE_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "basic", name: "Basic" },
  { id: "cultured", name: "Cultured" },
  { id: "cosmetic", name: "Cosmetic" },
];

/** Human-readable category labels for sticky headers */
export const CATEGORY_LABELS: Record<string, string> = {
  headware: "Headware",
  eyeware: "Eyeware",
  earware: "Earware",
  bodyware: "Bodyware",
  cyberlimb: "Cyberlimbs",
  "cybernetic-weapon": "Cybernetic Weapons",
  basic: "Basic Bioware",
  cultured: "Cultured Bioware",
  cosmetic: "Cosmetic Bioware",
  other: "Other",
};

/** Human-readable location labels */
export const LOCATION_LABELS: Record<CyberlimbLocation, string> = {
  "left-arm": "Left Arm",
  "right-arm": "Right Arm",
  "left-leg": "Left Leg",
  "right-leg": "Right Leg",
  "left-hand": "Left Hand",
  "right-hand": "Right Hand",
  "left-foot": "Left Foot",
  "right-foot": "Right Foot",
  "left-lower-arm": "Left Lower Arm",
  "right-lower-arm": "Right Lower Arm",
  "left-lower-leg": "Left Lower Leg",
  "right-lower-leg": "Right Lower Leg",
  torso: "Torso",
  skull: "Skull",
};

// =============================================================================
// HELPERS
// =============================================================================

export function getAvailabilityDisplay(availability: number, legality?: ItemLegality): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

/** Get conflict status for a location */
export function getLocationConflict(
  location: CyberlimbLocation,
  limbType: CyberlimbType,
  installedCyberlimbs: InstalledCyberlimb[]
): {
  type: "blocked" | "replaces" | "none";
  by?: InstalledCyberlimb;
  replaces?: InstalledCyberlimb[];
} {
  const side = LOCATION_SIDE[location];

  // Check each installed cyberlimb on the same side
  for (const installed of installedCyberlimbs) {
    const installedSide = LOCATION_SIDE[installed.location];
    if (installedSide !== side) continue;

    // Check if this location is blocked by an existing larger limb
    if (isBlockedByExisting(limbType, installed.limbType)) {
      return { type: "blocked", by: installed };
    }
  }

  // Check what would be replaced
  const wouldReplace: InstalledCyberlimb[] = [];
  for (const installed of installedCyberlimbs) {
    const installedSide = LOCATION_SIDE[installed.location];
    if (installedSide !== side) continue;

    // Same location = direct replacement
    if (installed.location === location) {
      wouldReplace.push(installed);
      continue;
    }

    // Check hierarchy replacement
    if (wouldReplaceExisting(limbType, installed.limbType)) {
      wouldReplace.push(installed);
    }
  }

  if (wouldReplace.length > 0) {
    return { type: "replaces", replaces: wouldReplace };
  }

  return { type: "none" };
}
