/**
 * VehicleSystemHelpers
 *
 * Constants, type aliases, and utility functions shared across vehicle system components.
 */

import type { ItemLegality } from "@/lib/types";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum availability allowed at character creation */
export const MAX_AVAILABILITY = 12;

/** Vehicle system types */
export type VehicleSystemType = "vehicle" | "drone" | "rcc" | "autosoft";

/** Tab configuration for each type */
export const TYPE_TABS: {
  id: VehicleSystemType;
  label: string;
  color: string;
  activeColor: string;
}[] = [
  {
    id: "vehicle",
    label: "Vehicles",
    color: "text-blue-500",
    activeColor: "bg-blue-500 text-white",
  },
  {
    id: "drone",
    label: "Drones",
    color: "text-green-500",
    activeColor: "bg-green-500 text-white",
  },
  {
    id: "rcc",
    label: "RCCs",
    color: "text-purple-500",
    activeColor: "bg-purple-500 text-white",
  },
  {
    id: "autosoft",
    label: "Autosofts",
    color: "text-cyan-500",
    activeColor: "bg-cyan-500 text-white",
  },
];

/** Vehicle subcategories */
export const VEHICLE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "bikes", label: "Bikes" },
  { id: "cars", label: "Cars" },
  { id: "trucks", label: "Trucks" },
  { id: "boats", label: "Boats" },
  { id: "submarines", label: "Subs" },
  { id: "fixed-wing", label: "Fixed-Wing" },
  { id: "rotorcraft", label: "Rotorcraft" },
  { id: "vtol", label: "VTOL" },
  { id: "walkers", label: "Walkers" },
] as const;

/** Drone size categories */
export const DRONE_SIZES = [
  { id: "all", label: "All" },
  { id: "micro", label: "Micro" },
  { id: "mini", label: "Mini" },
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
] as const;

/** RCC tier categories */
export const RCC_TIERS = [
  { id: "all", label: "All" },
  { id: "entry", label: "Entry (1-2)" },
  { id: "professional", label: "Professional (3-4)" },
  { id: "elite", label: "Elite (5-6)" },
] as const;

/** Autosoft category filter */
export const AUTOSOFT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "combat", label: "Combat" },
  { id: "perception", label: "Perception" },
  { id: "movement", label: "Movement" },
  { id: "defense", label: "Defense" },
  { id: "stealth", label: "Stealth" },
  { id: "electronic-warfare", label: "EW" },
] as const;

/** Display names for category headers */
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  // Vehicles
  bikes: "Bikes",
  cars: "Cars",
  trucks: "Trucks & Vans",
  boats: "Boats",
  submarines: "Submarines",
  "fixed-wing": "Fixed-Wing Aircraft",
  rotorcraft: "Rotorcraft",
  vtol: "VTOL/LAV",
  walkers: "Walkers",
  // Drones
  micro: "Micro Drones",
  mini: "Mini Drones",
  small: "Small Drones",
  medium: "Medium Drones",
  large: "Large Drones",
  // RCCs
  entry: "Entry Level (Rating 1-2)",
  professional: "Professional (Rating 3-4)",
  elite: "Elite Grade (Rating 5-6)",
  // Autosofts
  combat: "Combat",
  perception: "Perception",
  movement: "Movement",
  defense: "Defense",
  stealth: "Stealth",
  "electronic-warfare": "Electronic Warfare",
};

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

/** Check if an item's availability is within creation limits. */
export function isItemAvailable(availability: number): boolean {
  return availability <= MAX_AVAILABILITY;
}

/** Determine the tier for an RCC based on device rating. */
export function getRatingTier(rating: number): string {
  if (rating <= 2) return "entry";
  if (rating <= 4) return "professional";
  return "elite";
}

/** Calculate the maximum purchasable rating for an autosoft. */
export function getMaxAvailableRating(availabilityPerRating: number, maxRating: number): number {
  if (availabilityPerRating === 0) return maxRating;
  const maxByAvailability = Math.floor(MAX_AVAILABILITY / availabilityPerRating);
  return Math.min(maxRating, maxByAvailability);
}

/** Get the theme color name for a vehicle system type. */
export function getTypeColor(type: VehicleSystemType): string {
  switch (type) {
    case "vehicle":
      return "blue";
    case "drone":
      return "green";
    case "rcc":
      return "purple";
    case "autosoft":
      return "cyan";
  }
}
