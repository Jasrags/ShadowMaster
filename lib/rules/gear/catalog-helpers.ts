/**
 * Gear Catalog Helpers
 *
 * Pure utility functions for working with gear catalog data.
 * Extracted from UI components to enable direct unit testing
 * and prepare for consolidation (see #629).
 */

import type { GearCatalogData, GearItemData } from "@/lib/rules/loader-types";

// =============================================================================
// BROWSABLE SUBCATEGORY KEYS
// =============================================================================

/**
 * The subset of GearCatalogData keys that appear as browsable tabs
 * in the gear purchase modal and gear panel.
 *
 * This is the canonical list — UI components should derive their
 * category types, labels, and iteration from this array.
 */
export const GEAR_BROWSABLE_KEYS = [
  "electronics",
  "tools",
  "survival",
  "medical",
  "security",
  "explosives",
  "miscellaneous",
  "rfidTags",
] as const;

export type GearBrowsableKey = (typeof GEAR_BROWSABLE_KEYS)[number];

// =============================================================================
// CATALOG QUERY HELPERS
// =============================================================================

/**
 * Flatten all browsable gear subcategories into a single array.
 * Used by the purchase modal's "All" tab and by category counting.
 */
export function getAllBrowsableGear(catalog: GearCatalogData | null): GearItemData[] {
  if (!catalog) return [];
  return GEAR_BROWSABLE_KEYS.flatMap((key) => catalog[key] ?? []);
}

/**
 * Find an item across ALL GearItemData sub-arrays in the catalog.
 * Used by the character sheet and constraint validation to look up
 * catalog data for items the character owns.
 */
export function findGearItemInCatalog(
  catalog: GearCatalogData | null,
  predicate: (item: GearItemData) => boolean
): GearItemData | undefined {
  if (!catalog) return undefined;

  // Browsable subcategories
  for (const key of GEAR_BROWSABLE_KEYS) {
    const arr = catalog[key];
    if (!arr) continue;
    const found = arr.find(predicate);
    if (found) return found;
  }

  // Non-browsable but still searchable arrays
  const extraArrays: (GearItemData[] | undefined)[] = [
    catalog.ammunition,
    catalog.accessories,
    catalog.armorModifications,
    catalog.industrialChemicals,
    catalog.visionEnhancements,
    catalog.audioEnhancements,
    catalog.securityDevices,
    catalog.restraints,
  ];
  for (const arr of extraArrays) {
    if (!arr) continue;
    const found = arr.find(predicate);
    if (found) return found;
  }

  return undefined;
}

// =============================================================================
// DISPLAY CATEGORY MAPPING
// =============================================================================

/**
 * Map a gear item's category/subcategory string to the browsable tab it belongs to.
 * Sub-categories like "audio-devices" roll up to their parent "electronics".
 */
export function mapToDisplayCategory(category: string): GearBrowsableKey {
  switch (category) {
    case "audio-devices":
    case "optical-devices":
    case "imaging-devices":
      return "electronics";
    case "restraints":
      return "tools";
    case "grapple-gun":
      return "survival";
    case "rfid-tags":
      return "rfidTags";
    case "electronics":
    case "tools":
    case "medical":
    case "security":
    case "survival":
    case "explosives":
    case "rfidTags":
      return category as GearBrowsableKey;
    default:
      return "miscellaneous";
  }
}

/**
 * Map a GearItem's category field (which may be lowercase or kebab-case)
 * to a canonical browsable key.
 */
export function mapItemCategoryToKey(category: string | undefined): GearBrowsableKey {
  const normalized = (category ?? "").toLowerCase();
  if (normalized === "electronics") return "electronics";
  if (normalized === "tools") return "tools";
  if (normalized === "survival") return "survival";
  if (normalized === "medical") return "medical";
  if (normalized === "security") return "security";
  if (normalized === "explosives") return "explosives";
  if (normalized === "rfidtags" || normalized === "rfid-tags") return "rfidTags";
  return "miscellaneous";
}
