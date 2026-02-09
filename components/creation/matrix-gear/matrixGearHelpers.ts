/**
 * MatrixGearHelpers
 *
 * Constants, type aliases, and utility functions shared across matrix gear components.
 */

import type { ItemLegality } from "@/lib/types";
import type { CyberdeckData } from "@/lib/rules/RulesetContext";
import { CREATION_CONSTRAINTS } from "@/lib/rules/gear/validation";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum availability allowed at character creation */
export const MAX_AVAILABILITY = CREATION_CONSTRAINTS.maxAvailabilityAtCreation;

// =============================================================================
// TYPES
// =============================================================================

export type MatrixGearCategory = "commlinks" | "cyberdecks" | "software";
export type SoftwareSubcategory = "datasoft" | "mapsoft" | "shopsoft" | "tutorsoft";

// =============================================================================
// CATEGORY CONFIGS
// =============================================================================

export const MATRIX_CATEGORIES = [
  { id: "commlinks" as const, label: "Commlinks" },
  { id: "cyberdecks" as const, label: "Cyberdecks" },
  { id: "software" as const, label: "Software" },
];

export const SOFTWARE_SUBCATEGORIES = [
  {
    id: "datasoft" as const,
    label: "Datasoft",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: "mapsoft" as const,
    label: "Mapsoft",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    id: "shopsoft" as const,
    label: "Shopsoft",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    id: "tutorsoft" as const,
    label: "Tutorsoft",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
];

// =============================================================================
// HELPERS
// =============================================================================

/** Format a number as currency (no decimal places). */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format availability with legality suffix (R/F). */
export function getAvailabilityDisplay(availability: number, legality?: ItemLegality): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

/** Format cyberdeck ASDF attributes as a slash-separated string. */
export function formatAttributeArray(deck: CyberdeckData): string {
  const attrs = deck.attributes;
  return `${attrs.attack}/${attrs.sleaze}/${attrs.dataProcessing}/${attrs.firewall}`;
}
