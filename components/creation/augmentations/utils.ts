/**
 * Augmentation Utilities
 *
 * Shared formatting and helper functions for augmentation components.
 */

/**
 * Grade display labels for augmentation grades.
 */
export const GRADE_DISPLAY: Record<string, string> = {
  used: "Used",
  standard: "Std",
  alpha: "Alpha",
  beta: "Beta",
  delta: "Delta",
};

/**
 * Format a number as currency (no decimal places).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format essence value with 2 decimal places.
 */
export function formatEssence(value: number): string {
  return value.toFixed(2);
}

/**
 * Category groupings for display in the augmentations card.
 */
export const DISPLAY_CATEGORIES = [
  { id: "cyberlimb", label: "Cyberlimbs", type: "cyberware" },
  { id: "headware", label: "Headware", type: "cyberware" },
  { id: "eyeware", label: "Eyeware", type: "cyberware" },
  { id: "earware", label: "Earware", type: "cyberware" },
  { id: "bodyware", label: "Bodyware", type: "cyberware" },
  { id: "cybernetic-weapon", label: "Cybernetic Weapons", type: "cyberware" },
  { id: "basic", label: "Basic Bioware", type: "bioware" },
  { id: "cultured", label: "Cultured Bioware", type: "bioware" },
  { id: "cosmetic", label: "Cosmetic Bioware", type: "bioware" },
] as const;

export type DisplayCategory = (typeof DISPLAY_CATEGORIES)[number];
