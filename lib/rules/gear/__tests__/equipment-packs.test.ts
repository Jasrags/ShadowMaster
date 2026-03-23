/**
 * Tests for equipment packs data integrity and loader
 *
 * Validates the ~127 equipment packs from Run Faster against
 * the EquipmentPackCatalogItem interface constraints.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractEquipmentPacks } from "../../loader";
import type { LoadedRuleset } from "../../loader-types";
import type {
  EquipmentPackCatalogItem,
  EquipmentPackCategory,
  EquipmentPacksModulePayload,
} from "../../module-payloads";

// =============================================================================
// TEST DATA: Load real pack data from run-faster.json
// =============================================================================

import runFasterData from "../../../../data/editions/sr5/run-faster.json";
const packsPayload = runFasterData.modules.equipmentPacks.payload as EquipmentPacksModulePayload;
const allPacks: EquipmentPackCatalogItem[] = packsPayload.packs;

// =============================================================================
// VALID CATEGORIES
// =============================================================================

const VALID_CATEGORIES: EquipmentPackCategory[] = [
  "core",
  "weapon",
  "armor",
  "cyber",
  "lifestyle",
  "color",
  "vehicle",
  "decker",
  "drone",
  "magic",
];

// =============================================================================
// TESTS
// =============================================================================

describe("Equipment Packs Data Integrity", () => {
  it("should have at least 100 packs", () => {
    expect(allPacks.length).toBeGreaterThanOrEqual(100);
  });

  it("should have unique IDs across all packs", () => {
    const ids = allPacks.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have kebab-case IDs", () => {
    const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    for (const pack of allPacks) {
      expect(pack.id).toMatch(kebabRegex);
    }
  });

  it("should have valid categories", () => {
    for (const pack of allPacks) {
      expect(VALID_CATEGORIES).toContain(pack.category);
    }
  });

  it("should have nuyen costs divisible by 2000", () => {
    for (const pack of allPacks) {
      expect(pack.nuyenCost % 2000).toBe(0);
    }
  });

  it("should have karma costs matching nuyenCost / 2000", () => {
    for (const pack of allPacks) {
      expect(pack.karmaCost).toBe(pack.nuyenCost / 2000);
    }
  });

  it("should have non-negative maxAvailability", () => {
    for (const pack of allPacks) {
      expect(pack.maxAvailability).toBeGreaterThanOrEqual(0);
    }
  });

  it("should have valid availabilityType when present", () => {
    for (const pack of allPacks) {
      if (pack.availabilityType !== undefined) {
        expect(["R", "F"]).toContain(pack.availabilityType);
      }
    }
  });

  it("should have essenceCost only on cyber packs", () => {
    for (const pack of allPacks) {
      if (pack.essenceCost !== undefined) {
        expect(pack.category).toBe("cyber");
        expect(pack.essenceCost).toBeGreaterThan(0);
      }
    }
  });

  it("should have non-empty contents or includedPacks for all packs", () => {
    for (const pack of allPacks) {
      const hasContents = pack.contents.length > 0;
      const hasSubPacks = pack.includedPacks !== undefined && pack.includedPacks.length > 0;
      expect(hasContents || hasSubPacks).toBe(true);
    }
  });

  it("should have valid content items with required fields", () => {
    for (const pack of allPacks) {
      for (const contentItem of pack.contents) {
        expect(contentItem.itemId).toBeTruthy();
        expect(contentItem.itemName).toBeTruthy();
        expect(contentItem.quantity).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("should have positive ratings when present", () => {
    for (const pack of allPacks) {
      for (const contentItem of pack.contents) {
        if (contentItem.rating !== undefined) {
          expect(contentItem.rating).toBeGreaterThan(0);
        }
      }
    }
  });

  it("should have source set to run-faster", () => {
    for (const pack of allPacks) {
      expect(pack.source).toBe("run-faster");
    }
  });

  it("should have valid page numbers", () => {
    for (const pack of allPacks) {
      expect(pack.page).toBeGreaterThanOrEqual(228);
      expect(pack.page).toBeLessThanOrEqual(252);
    }
  });
});

describe("Equipment Packs Category Distribution", () => {
  it("should have core packs", () => {
    const corePacks = allPacks.filter((p) => p.category === "core");
    expect(corePacks.length).toBe(3);
  });

  it("should have weapon packs", () => {
    const weaponPacks = allPacks.filter((p) => p.category === "weapon");
    expect(weaponPacks.length).toBeGreaterThanOrEqual(30);
  });

  it("should have armor packs", () => {
    const armorPacks = allPacks.filter((p) => p.category === "armor");
    expect(armorPacks.length).toBeGreaterThanOrEqual(8);
  });

  it("should have cyber packs", () => {
    const cyberPacks = allPacks.filter((p) => p.category === "cyber");
    expect(cyberPacks.length).toBeGreaterThanOrEqual(30);
  });
});

describe("extractEquipmentPacks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should extract packs from a ruleset with equipmentPacks module", () => {
    const mockRuleset = {
      books: [
        {
          payload: {
            modules: {
              equipmentPacks: {
                payload: {
                  packs: [
                    {
                      id: "test-pack",
                      name: "Test Pack",
                      category: "core",
                      nuyenCost: 4000,
                      karmaCost: 2,
                      maxAvailability: 0,
                      contents: [
                        {
                          itemId: "knife",
                          itemName: "Knife",
                          quantity: 1,
                        },
                      ],
                      source: "run-faster",
                      page: 228,
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    } as unknown as LoadedRuleset;

    const result = extractEquipmentPacks(mockRuleset);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("test-pack");
    expect(result[0].contents).toHaveLength(1);
  });

  it("should return empty array when no equipmentPacks module", () => {
    const mockRuleset = {
      books: [
        {
          payload: {
            modules: {},
          },
        },
      ],
    } as unknown as LoadedRuleset;

    const result = extractEquipmentPacks(mockRuleset);
    expect(result).toEqual([]);
  });
});
