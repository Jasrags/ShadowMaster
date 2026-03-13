/**
 * Tests for gear catalog helpers
 *
 * Validates the pure utility functions that UI components depend on
 * for gear subcategory browsing, lookup, and display mapping.
 * These tests serve as regression guards for #629 (consolidation refactor).
 */

import { describe, it, expect } from "vitest";
import type { GearCatalogData, GearItemData } from "@/lib/rules/loader-types";
import {
  GEAR_BROWSABLE_KEYS,
  getAllBrowsableGear,
  findGearItemInCatalog,
  mapToDisplayCategory,
  mapItemCategoryToKey,
} from "../catalog-helpers";

// =============================================================================
// TEST HELPERS
// =============================================================================

function makeGearItem(
  overrides: Partial<GearItemData> & { id: string; name: string }
): GearItemData {
  return {
    category: "gear",
    cost: 100,
    availability: 4,
    ...overrides,
  } as GearItemData;
}

/** Catalog with exactly one item per browsable subcategory */
function makeCatalogWithOnePerSubcategory(): GearCatalogData {
  return {
    categories: [],
    weapons: {
      melee: [],
      pistols: [],
      smgs: [],
      rifles: [],
      shotguns: [],
      sniperRifles: [],
      throwingWeapons: [],
      grenades: [],
    },
    armor: [],
    armorModifications: [],
    commlinks: [],
    cyberdecks: [],
    accessories: [],
    visionEnhancements: [],
    audioEnhancements: [],
    sensors: { housings: [], functions: [] },
    securityDevices: [],
    restraints: [],
    industrialChemicals: [],
    ammunition: [],
    // One item per browsable subcategory
    electronics: [makeGearItem({ id: "commlink", name: "Commlink", category: "electronics" })],
    tools: [makeGearItem({ id: "toolkit", name: "Toolkit", category: "tools" })],
    survival: [makeGearItem({ id: "respirator", name: "Respirator", category: "survival" })],
    medical: [makeGearItem({ id: "medkit", name: "Medkit", category: "medical" })],
    security: [makeGearItem({ id: "maglock", name: "Maglock", category: "security" })],
    explosives: [
      makeGearItem({
        id: "plastic-explosives",
        name: "Plastic Explosives",
        category: "explosives",
      }),
    ],
    miscellaneous: [
      makeGearItem({ id: "credstick", name: "Credstick", category: "miscellaneous" }),
    ],
    rfidTags: [makeGearItem({ id: "rfid-tag", name: "RFID Tag", category: "rfidTags" })],
  } as unknown as GearCatalogData;
}

function makeEmptyCatalog(): GearCatalogData {
  return {
    categories: [],
    weapons: {
      melee: [],
      pistols: [],
      smgs: [],
      rifles: [],
      shotguns: [],
      sniperRifles: [],
      throwingWeapons: [],
      grenades: [],
    },
    armor: [],
    armorModifications: [],
    commlinks: [],
    cyberdecks: [],
    electronics: [],
    accessories: [],
    rfidTags: [],
    visionEnhancements: [],
    audioEnhancements: [],
    tools: [],
    sensors: { housings: [], functions: [] },
    securityDevices: [],
    restraints: [],
    survival: [],
    industrialChemicals: [],
    medical: [],
    security: [],
    miscellaneous: [],
    ammunition: [],
    explosives: [],
  } as unknown as GearCatalogData;
}

// =============================================================================
// TESTS
// =============================================================================

describe("GEAR_BROWSABLE_KEYS", () => {
  it("contains all expected browsable subcategories", () => {
    const expected = [
      "electronics",
      "tools",
      "survival",
      "medical",
      "security",
      "explosives",
      "miscellaneous",
      "rfidTags",
    ];
    expect(GEAR_BROWSABLE_KEYS).toEqual(expected);
  });

  it("has no duplicates", () => {
    const unique = new Set(GEAR_BROWSABLE_KEYS);
    expect(unique.size).toBe(GEAR_BROWSABLE_KEYS.length);
  });

  it("every key exists as a property on GearCatalogData", () => {
    // Construct a catalog and verify every key resolves to an array
    const catalog = makeEmptyCatalog();
    for (const key of GEAR_BROWSABLE_KEYS) {
      expect(catalog).toHaveProperty(key);
      expect(Array.isArray(catalog[key])).toBe(true);
    }
  });
});

describe("getAllBrowsableGear", () => {
  it("returns empty array for null catalog", () => {
    expect(getAllBrowsableGear(null)).toEqual([]);
  });

  it("returns empty array for catalog with no items", () => {
    expect(getAllBrowsableGear(makeEmptyCatalog())).toEqual([]);
  });

  it("returns items from every browsable subcategory", () => {
    const catalog = makeCatalogWithOnePerSubcategory();
    const all = getAllBrowsableGear(catalog);

    // Should have exactly one item per browsable key
    expect(all).toHaveLength(GEAR_BROWSABLE_KEYS.length);

    // Verify every subcategory contributed an item
    const ids = all.map((item) => item.id);
    expect(ids).toContain("commlink");
    expect(ids).toContain("toolkit");
    expect(ids).toContain("respirator");
    expect(ids).toContain("medkit");
    expect(ids).toContain("maglock");
    expect(ids).toContain("plastic-explosives");
    expect(ids).toContain("credstick");
    expect(ids).toContain("rfid-tag");
  });

  it("does not include items from non-browsable arrays", () => {
    const catalog = makeEmptyCatalog();
    // Add items only to non-browsable categories
    (catalog as unknown as Record<string, unknown[]>).ammunition = [
      makeGearItem({ id: "ammo", name: "Ammo" }),
    ];
    (catalog as unknown as Record<string, unknown[]>).accessories = [
      makeGearItem({ id: "scope", name: "Scope" }),
    ];

    const all = getAllBrowsableGear(catalog);
    expect(all).toHaveLength(0);
  });

  it("handles multiple items per subcategory", () => {
    const catalog = makeEmptyCatalog();
    catalog.electronics = [
      makeGearItem({ id: "commlink-a", name: "Commlink A" }),
      makeGearItem({ id: "commlink-b", name: "Commlink B" }),
      makeGearItem({ id: "commlink-c", name: "Commlink C" }),
    ];
    catalog.explosives = [
      makeGearItem({ id: "c4", name: "C4" }),
      makeGearItem({ id: "det-cap", name: "Detonator Cap" }),
    ];

    const all = getAllBrowsableGear(catalog);
    expect(all).toHaveLength(5);
  });
});

describe("findGearItemInCatalog", () => {
  it("returns undefined for null catalog", () => {
    expect(findGearItemInCatalog(null, () => true)).toBeUndefined();
  });

  it("finds item in a browsable subcategory by id", () => {
    const catalog = makeCatalogWithOnePerSubcategory();
    const found = findGearItemInCatalog(catalog, (item) => item.id === "plastic-explosives");
    expect(found).toBeDefined();
    expect(found!.name).toBe("Plastic Explosives");
  });

  it("finds item in a browsable subcategory by name", () => {
    const catalog = makeCatalogWithOnePerSubcategory();
    const found = findGearItemInCatalog(catalog, (item) => item.name === "Medkit");
    expect(found).toBeDefined();
    expect(found!.id).toBe("medkit");
  });

  it("finds items in every browsable subcategory", () => {
    const catalog = makeCatalogWithOnePerSubcategory();
    const expectedIds = [
      "commlink",
      "toolkit",
      "respirator",
      "medkit",
      "maglock",
      "plastic-explosives",
      "credstick",
      "rfid-tag",
    ];

    for (const id of expectedIds) {
      const found = findGearItemInCatalog(catalog, (item) => item.id === id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(id);
    }
  });

  it("finds items in non-browsable arrays (ammunition, accessories, etc.)", () => {
    const catalog = makeEmptyCatalog();
    catalog.ammunition = [makeGearItem({ id: "apds-rounds", name: "APDS Rounds" })];
    catalog.accessories = [makeGearItem({ id: "smartgun", name: "Smartgun System" })];
    catalog.armorModifications = [makeGearItem({ id: "chemical-seal", name: "Chemical Seal" })];
    catalog.industrialChemicals = [makeGearItem({ id: "glue-solvent", name: "Glue Solvent" })];
    catalog.visionEnhancements = [makeGearItem({ id: "thermographic", name: "Thermographic" })];
    catalog.audioEnhancements = [makeGearItem({ id: "audio-enhance", name: "Audio Enhancement" })];
    catalog.securityDevices = [makeGearItem({ id: "motion-sensor", name: "Motion Sensor" })];
    catalog.restraints = [makeGearItem({ id: "plasteel-cuffs", name: "Plasteel Restraints" })];

    expect(findGearItemInCatalog(catalog, (i) => i.id === "apds-rounds")).toBeDefined();
    expect(findGearItemInCatalog(catalog, (i) => i.id === "smartgun")).toBeDefined();
    expect(findGearItemInCatalog(catalog, (i) => i.id === "chemical-seal")).toBeDefined();
    expect(findGearItemInCatalog(catalog, (i) => i.id === "glue-solvent")).toBeDefined();
    expect(findGearItemInCatalog(catalog, (i) => i.id === "thermographic")).toBeDefined();
    expect(findGearItemInCatalog(catalog, (i) => i.id === "audio-enhance")).toBeDefined();
    expect(findGearItemInCatalog(catalog, (i) => i.id === "motion-sensor")).toBeDefined();
    expect(findGearItemInCatalog(catalog, (i) => i.id === "plasteel-cuffs")).toBeDefined();
  });

  it("returns undefined when item does not exist", () => {
    const catalog = makeCatalogWithOnePerSubcategory();
    const found = findGearItemInCatalog(catalog, (item) => item.id === "nonexistent");
    expect(found).toBeUndefined();
  });
});

describe("mapToDisplayCategory", () => {
  it("maps direct category names to themselves", () => {
    const directCategories = [
      "electronics",
      "tools",
      "medical",
      "security",
      "survival",
      "explosives",
      "rfidTags",
    ];

    for (const cat of directCategories) {
      expect(mapToDisplayCategory(cat)).toBe(cat);
    }
  });

  it("maps audio/optical/imaging sub-categories to electronics", () => {
    expect(mapToDisplayCategory("audio-devices")).toBe("electronics");
    expect(mapToDisplayCategory("optical-devices")).toBe("electronics");
    expect(mapToDisplayCategory("imaging-devices")).toBe("electronics");
  });

  it("maps restraints to tools", () => {
    expect(mapToDisplayCategory("restraints")).toBe("tools");
  });

  it("maps grapple-gun to survival", () => {
    expect(mapToDisplayCategory("grapple-gun")).toBe("survival");
  });

  it("maps rfid-tags (kebab) to rfidTags (camel)", () => {
    expect(mapToDisplayCategory("rfid-tags")).toBe("rfidTags");
  });

  it("maps unknown categories to miscellaneous", () => {
    expect(mapToDisplayCategory("unknown")).toBe("miscellaneous");
    expect(mapToDisplayCategory("")).toBe("miscellaneous");
    expect(mapToDisplayCategory("foobar")).toBe("miscellaneous");
  });
});

describe("mapItemCategoryToKey", () => {
  it("maps standard categories case-insensitively", () => {
    expect(mapItemCategoryToKey("Electronics")).toBe("electronics");
    expect(mapItemCategoryToKey("TOOLS")).toBe("tools");
    expect(mapItemCategoryToKey("Medical")).toBe("medical");
    expect(mapItemCategoryToKey("Security")).toBe("security");
    expect(mapItemCategoryToKey("survival")).toBe("survival");
    expect(mapItemCategoryToKey("Explosives")).toBe("explosives");
  });

  it("handles rfidTags variants", () => {
    expect(mapItemCategoryToKey("rfidTags")).toBe("rfidTags");
    expect(mapItemCategoryToKey("rfidtags")).toBe("rfidTags");
    expect(mapItemCategoryToKey("rfid-tags")).toBe("rfidTags");
  });

  it("maps unknown or undefined to miscellaneous", () => {
    expect(mapItemCategoryToKey(undefined)).toBe("miscellaneous");
    expect(mapItemCategoryToKey("")).toBe("miscellaneous");
    expect(mapItemCategoryToKey("widgets")).toBe("miscellaneous");
  });
});
