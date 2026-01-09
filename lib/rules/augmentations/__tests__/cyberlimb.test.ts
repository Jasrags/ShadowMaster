/**
 * Cyberlimb System Tests
 *
 * Tests for the cyberlimb management system including:
 * - Type guards and identification
 * - Location and hierarchy validation
 * - Customization validation
 * - Capacity management
 * - Enhancement and accessory management
 * - Physical CM bonus calculations
 * - Effective attribute calculations
 * - Cyberlimb creation
 */

import { describe, it, expect } from "vitest";
import {
  // Type guards
  isCyberlimb,
  isCyberlimbCatalogItem,
  // Location & hierarchy
  checkLocationConflicts,
  validateLocationForLimbType,
  // Customization
  getMaxCustomization,
  validateCustomization,
  // Capacity
  getCapacityBreakdown,
  validateCapacityAvailable,
  // Enhancement management
  validateEnhancementInstall,
  addEnhancement,
  removeEnhancement,
  // Accessory management
  validateAccessoryInstall,
  addAccessory,
  removeAccessory,
  // CM bonus
  calculateTotalCMBonus,
  getLimbCMBonus,
  // Attribute calculations
  getCyberlimbStrength,
  getCyberlimbAgility,
  calculateEffectiveAttribute,
  calculateAverageAttribute,
  // Creation
  createCyberlimb,
  calculateCyberlimbCosts,
  validateCyberlimbInstallation,
  getCyberlimbSummary,
  toggleCyberlimbWireless,
  // Constants
  LIMB_CM_BONUS,
  type CyberlimbItem,
  type CyberlimbLocation,
} from "../cyberlimb";
import type { Character } from "@/lib/types/character";
import type { CyberlimbCatalogItem, CyberwareCatalogItem } from "@/lib/types/edition";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createTestCyberlimb(overrides: Partial<CyberlimbItem> = {}): CyberlimbItem {
  const now = new Date().toISOString();
  return {
    catalogId: "cyberlimb-arm",
    name: "Obvious Cyberarm",
    category: "cyberlimb",
    grade: "standard",
    baseEssenceCost: 1.0,
    essenceCost: 1.0,
    cost: 15000,
    availability: 4,
    location: "left-arm",
    limbType: "full-arm",
    appearance: "obvious",
    baseStrength: 3,
    baseAgility: 3,
    customStrength: 0,
    customAgility: 0,
    baseCapacity: 15,
    capacityUsed: 0,
    enhancements: [],
    accessories: [],
    weapons: [],
    wirelessEnabled: true,
    condition: "working",
    installedAt: now,
    modificationHistory: [],
    ...overrides,
  };
}

function createTestCharacter(overrides: Partial<Character> = {}): Partial<Character> {
  return {
    metatype: "human",
    specialAttributes: {
      edge: 3,
      essence: 6.0,
    },
    attributes: {
      bod: 4,
      agi: 4,
      rea: 3,
      str: 4,
      wil: 3,
      log: 3,
      int: 3,
      cha: 3,
    },
    cyberware: [],
    bioware: [],
    cyberlimbs: [],
    ...overrides,
  };
}

function createTestCatalogItem(): CyberlimbCatalogItem {
  return {
    id: "cyberlimb-arm",
    name: "Obvious Cyberarm",
    category: "cyberlimb",
    essenceCost: 1.0,
    cost: 15000,
    availability: 4,
    description: "A standard obvious cyberarm",
    capacity: 15,
    limbType: "full-arm",
    appearance: "obvious",
    baseStrength: 3,
    baseAgility: 3,
    physicalCMBonus: 1,
  };
}

function createTestEnhancementCatalog(): CyberwareCatalogItem {
  return {
    id: "enhanced-agility",
    name: "Enhanced Agility",
    category: "cyberlimb-enhancement",
    essenceCost: 0,
    cost: 6500,
    availability: 6,
    restricted: false,
    forbidden: false,
    description: "Adds +1 AGI to cyberlimb per rating",
    capacityCost: 1,
    hasRating: true,
    maxRating: 3,
    enhancementType: "agility",
  } as CyberwareCatalogItem;
}

// =============================================================================
// TYPE GUARD TESTS
// =============================================================================

describe("isCyberlimb", () => {
  it("returns true for CyberlimbItem", () => {
    const limb = createTestCyberlimb();
    expect(isCyberlimb(limb)).toBe(true);
  });

  it("returns false for regular cyberware", () => {
    const item = {
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard" as const,
      baseEssenceCost: 0.1,
      essenceCost: 0.1,
      cost: 500,
      availability: 2,
    };
    expect(isCyberlimb(item)).toBe(false);
  });
});

describe("isCyberlimbCatalogItem", () => {
  it("returns true for cyberlimb catalog items", () => {
    const item = createTestCatalogItem();
    expect(isCyberlimbCatalogItem(item)).toBe(true);
  });

  it("returns false for non-cyberlimb catalog items", () => {
    const item: CyberwareCatalogItem = {
      id: "datajack",
      name: "Datajack",
      category: "headware",
      essenceCost: 0.1,
      cost: 500,
      availability: 2,
      description: "A datajack",
    };
    expect(isCyberlimbCatalogItem(item)).toBe(false);
  });
});

// =============================================================================
// LOCATION VALIDATION TESTS
// =============================================================================

describe("validateLocationForLimbType", () => {
  it("accepts valid location for full-arm", () => {
    expect(validateLocationForLimbType("left-arm", "full-arm").valid).toBe(true);
    expect(validateLocationForLimbType("right-arm", "full-arm").valid).toBe(true);
  });

  it("rejects invalid location for full-arm", () => {
    const result = validateLocationForLimbType("left-leg", "full-arm");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("cannot be installed");
  });

  it("accepts valid location for hand", () => {
    expect(validateLocationForLimbType("left-hand", "hand").valid).toBe(true);
    expect(validateLocationForLimbType("right-hand", "hand").valid).toBe(true);
  });

  it("accepts torso location for torso type", () => {
    expect(validateLocationForLimbType("torso", "torso").valid).toBe(true);
  });

  it("accepts skull location for skull type", () => {
    expect(validateLocationForLimbType("skull", "skull").valid).toBe(true);
  });
});

// =============================================================================
// HIERARCHY CONFLICT TESTS
// =============================================================================

describe("checkLocationConflicts", () => {
  it("returns no conflict when no limbs exist", () => {
    const char = createTestCharacter({ cyberlimbs: [] });
    const result = checkLocationConflicts(char, "left-arm", "full-arm");

    expect(result.hasConflict).toBe(false);
    expect(result.limbsToReplace).toHaveLength(0);
    expect(result.blockingLimb).toBeUndefined();
  });

  it("detects that full-arm would replace hand on same side", () => {
    const existingHand = createTestCyberlimb({
      location: "left-hand",
      limbType: "hand",
      name: "Left Cyberhand",
    });
    const char = createTestCharacter({ cyberlimbs: [existingHand] });

    const result = checkLocationConflicts(char, "left-arm", "full-arm");

    expect(result.hasConflict).toBe(true);
    expect(result.limbsToReplace).toHaveLength(1);
    expect(result.limbsToReplace[0].location).toBe("left-hand");
    expect(result.blockingLimb).toBeUndefined();
  });

  it("detects blocking when trying to install hand where full-arm exists", () => {
    const existingArm = createTestCyberlimb({
      location: "left-arm",
      limbType: "full-arm",
      name: "Left Cyberarm",
    });
    const char = createTestCharacter({ cyberlimbs: [existingArm] });

    const result = checkLocationConflicts(char, "left-hand", "hand");

    expect(result.hasConflict).toBe(true);
    expect(result.blockingLimb).toBeDefined();
    expect(result.blockingLimb?.limbType).toBe("full-arm");
  });

  it("allows hand on opposite side when arm exists", () => {
    const existingArm = createTestCyberlimb({
      location: "left-arm",
      limbType: "full-arm",
    });
    const char = createTestCharacter({ cyberlimbs: [existingArm] });

    const result = checkLocationConflicts(char, "right-hand", "hand");

    expect(result.hasConflict).toBe(false);
  });
});

// =============================================================================
// CUSTOMIZATION TESTS
// =============================================================================

describe("getMaxCustomization", () => {
  it("returns 3 for human (racial max 6 - base 3)", () => {
    const char = createTestCharacter({ metatype: "human" });

    expect(getMaxCustomization(char, "strength")).toBe(3);
    expect(getMaxCustomization(char, "agility")).toBe(3);
  });

  it("returns higher value for dwarf strength (racial max 8)", () => {
    const char = createTestCharacter({ metatype: "dwarf" });

    expect(getMaxCustomization(char, "strength")).toBe(5); // 8 - 3
    expect(getMaxCustomization(char, "agility")).toBe(3); // 6 - 3
  });

  it("returns higher value for troll strength (racial max 10)", () => {
    const char = createTestCharacter({ metatype: "troll" });

    expect(getMaxCustomization(char, "strength")).toBe(7); // 10 - 3
    expect(getMaxCustomization(char, "agility")).toBe(2); // 5 - 3
  });
});

describe("validateCustomization", () => {
  it("accepts valid customization within limits", () => {
    const char = createTestCharacter({ metatype: "human" });

    const result = validateCustomization(char, {
      strengthCustomization: 2,
      agilityCustomization: 2,
    });

    expect(result.valid).toBe(true);
  });

  it("rejects negative customization", () => {
    const char = createTestCharacter();

    const result = validateCustomization(char, { strengthCustomization: -1 });

    expect(result.valid).toBe(false);
    expect(result.error).toContain("negative");
  });

  it("rejects STR customization exceeding racial maximum", () => {
    const char = createTestCharacter({ metatype: "human" });

    const result = validateCustomization(char, { strengthCustomization: 5 }); // Max is 3

    expect(result.valid).toBe(false);
    expect(result.error).toContain("STR");
    expect(result.error).toContain("exceeds maximum");
  });

  it("rejects AGI customization exceeding racial maximum", () => {
    const char = createTestCharacter({ metatype: "human" });

    const result = validateCustomization(char, { agilityCustomization: 5 }); // Max is 3

    expect(result.valid).toBe(false);
    expect(result.error).toContain("AGI");
    expect(result.error).toContain("exceeds maximum");
  });
});

// =============================================================================
// CAPACITY TESTS
// =============================================================================

describe("getCapacityBreakdown", () => {
  it("returns full capacity when empty", () => {
    const limb = createTestCyberlimb({ baseCapacity: 15, capacityUsed: 0 });

    const breakdown = getCapacityBreakdown(limb);

    expect(breakdown.totalCapacity).toBe(15);
    expect(breakdown.usedByEnhancements).toBe(0);
    expect(breakdown.usedByAccessories).toBe(0);
    expect(breakdown.usedByWeapons).toBe(0);
    expect(breakdown.remainingCapacity).toBe(15);
  });

  it("calculates used capacity from enhancements", () => {
    const limb = createTestCyberlimb({
      baseCapacity: 15,
      enhancements: [
        {
          id: "enh-1",
          catalogId: "enhanced-agility",
          name: "Enhanced Agility",
          enhancementType: "agility",
          rating: 2,
          capacityUsed: 2,
          cost: 13000,
          availability: 12,
        },
      ],
    });

    const breakdown = getCapacityBreakdown(limb);

    expect(breakdown.usedByEnhancements).toBe(2);
    expect(breakdown.remainingCapacity).toBe(13);
  });

  it("calculates used capacity from multiple sources", () => {
    const limb = createTestCyberlimb({
      baseCapacity: 20,
      enhancements: [
        {
          id: "enh-1",
          catalogId: "enhanced-strength",
          name: "Enhanced Strength",
          enhancementType: "strength",
          rating: 3,
          capacityUsed: 3,
          cost: 19500,
          availability: 18,
        },
      ],
      accessories: [
        {
          id: "acc-1",
          catalogId: "gyromount",
          name: "Gyromount",
          capacityUsed: 6,
          cost: 6000,
          availability: 8,
        },
      ],
    });

    const breakdown = getCapacityBreakdown(limb);

    expect(breakdown.usedByEnhancements).toBe(3);
    expect(breakdown.usedByAccessories).toBe(6);
    expect(breakdown.remainingCapacity).toBe(11); // 20 - 3 - 6
  });
});

describe("validateCapacityAvailable", () => {
  it("accepts item that fits", () => {
    const limb = createTestCyberlimb({ baseCapacity: 15, capacityUsed: 0 });

    const result = validateCapacityAvailable(limb, 5);

    expect(result.valid).toBe(true);
  });

  it("rejects item that doesn't fit", () => {
    // Create limb with actual enhancements that use capacity
    const limb = createTestCyberlimb({
      baseCapacity: 15,
      enhancements: [
        {
          id: "enh-1",
          catalogId: "enhanced-strength",
          name: "Enhanced Strength",
          enhancementType: "strength",
          rating: 3,
          capacityUsed: 3,
          cost: 19500,
          availability: 18,
        },
        {
          id: "enh-2",
          catalogId: "enhanced-agility",
          name: "Enhanced Agility",
          enhancementType: "agility",
          rating: 3,
          capacityUsed: 3,
          cost: 19500,
          availability: 18,
        },
      ],
      accessories: [
        {
          id: "acc-1",
          catalogId: "gyromount",
          name: "Gyromount",
          capacityUsed: 6,
          cost: 6000,
          availability: 8,
        },
      ],
    }); // 3 + 3 + 6 = 12 used, 3 remaining

    const result = validateCapacityAvailable(limb, 5); // Only 3 remaining

    expect(result.valid).toBe(false);
    expect(result.error).toContain("capacity");
  });
});

// =============================================================================
// ENHANCEMENT MANAGEMENT TESTS
// =============================================================================

describe("validateEnhancementInstall", () => {
  it("accepts valid enhancement", () => {
    const limb = createTestCyberlimb();
    const enhancement = createTestEnhancementCatalog();

    const result = validateEnhancementInstall(limb, enhancement, 2);

    expect(result.valid).toBe(true);
  });

  it("rejects non-enhancement item", () => {
    const limb = createTestCyberlimb();
    const item: CyberwareCatalogItem = {
      id: "datajack",
      name: "Datajack",
      category: "headware",
      essenceCost: 0.1,
      cost: 500,
      availability: 2,
      description: "A datajack",
    };

    const result = validateEnhancementInstall(limb, item, 1);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("not a cyberlimb enhancement");
  });

  it("rejects duplicate enhancement type", () => {
    const limb = createTestCyberlimb({
      enhancements: [
        {
          id: "enh-1",
          catalogId: "enhanced-agility",
          name: "Enhanced Agility",
          enhancementType: "agility",
          rating: 2,
          capacityUsed: 2,
          cost: 13000,
          availability: 12,
        },
      ],
    });
    const enhancement = createTestEnhancementCatalog(); // Also agility

    const result = validateEnhancementInstall(limb, enhancement, 1);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("already has");
  });

  it("rejects rating exceeding maximum", () => {
    const limb = createTestCyberlimb();
    const enhancement = createTestEnhancementCatalog();

    const result = validateEnhancementInstall(limb, enhancement, 5); // Max is 3

    expect(result.valid).toBe(false);
    expect(result.error).toContain("invalid");
  });
});

describe("addEnhancement", () => {
  it("adds enhancement to limb", () => {
    const limb = createTestCyberlimb();
    const enhancement = createTestEnhancementCatalog();

    const result = addEnhancement(limb, enhancement, 2);

    expect(result.enhancements).toHaveLength(1);
    expect(result.enhancements[0].enhancementType).toBe("agility");
    expect(result.enhancements[0].rating).toBe(2);
    expect(result.enhancements[0].capacityUsed).toBe(2);
    expect(result.capacityUsed).toBe(2);
    expect(result.modificationHistory).toHaveLength(1);
  });

  it("preserves existing enhancements", () => {
    const limb = createTestCyberlimb({
      enhancements: [
        {
          id: "existing",
          catalogId: "enhanced-strength",
          name: "Enhanced Strength",
          enhancementType: "strength",
          rating: 1,
          capacityUsed: 1,
          cost: 6500,
          availability: 6,
        },
      ],
      capacityUsed: 1,
    });
    const enhancement = createTestEnhancementCatalog();

    const result = addEnhancement(limb, enhancement, 2);

    expect(result.enhancements).toHaveLength(2);
    expect(result.capacityUsed).toBe(3);
  });
});

describe("removeEnhancement", () => {
  it("removes enhancement by ID", () => {
    const limb = createTestCyberlimb({
      enhancements: [
        {
          id: "to-remove",
          catalogId: "enhanced-agility",
          name: "Enhanced Agility",
          enhancementType: "agility",
          rating: 2,
          capacityUsed: 2,
          cost: 13000,
          availability: 12,
        },
      ],
      capacityUsed: 2,
    });

    const result = removeEnhancement(limb, "to-remove");

    expect(result.enhancements).toHaveLength(0);
    expect(result.capacityUsed).toBe(0);
    expect(result.modificationHistory).toHaveLength(1);
  });

  it("returns unchanged limb if enhancement not found", () => {
    const limb = createTestCyberlimb();

    const result = removeEnhancement(limb, "nonexistent");

    expect(result).toEqual(limb);
  });
});

// =============================================================================
// CM BONUS TESTS
// =============================================================================

describe("getLimbCMBonus", () => {
  it("returns 1 for full limbs", () => {
    expect(getLimbCMBonus("full-arm")).toBe(1);
    expect(getLimbCMBonus("full-leg")).toBe(1);
    expect(getLimbCMBonus("torso")).toBe(1);
    expect(getLimbCMBonus("skull")).toBe(1);
  });

  it("returns 0.5 for partial limbs", () => {
    expect(getLimbCMBonus("lower-arm")).toBe(0.5);
    expect(getLimbCMBonus("lower-leg")).toBe(0.5);
  });

  it("returns 0 for extremities", () => {
    expect(getLimbCMBonus("hand")).toBe(0);
    expect(getLimbCMBonus("foot")).toBe(0);
  });
});

describe("calculateTotalCMBonus", () => {
  it("returns 0 with no cyberlimbs", () => {
    const char = createTestCharacter({ cyberlimbs: [] });

    expect(calculateTotalCMBonus(char)).toBe(0);
  });

  it("returns 1 for single full arm", () => {
    const char = createTestCharacter({
      cyberlimbs: [createTestCyberlimb({ limbType: "full-arm" })],
    });

    expect(calculateTotalCMBonus(char)).toBe(1);
  });

  it("floors combined partial limb bonuses", () => {
    const char = createTestCharacter({
      cyberlimbs: [
        createTestCyberlimb({ limbType: "lower-arm", location: "left-lower-arm" }),
      ],
    });

    expect(calculateTotalCMBonus(char)).toBe(0); // 0.5 floors to 0
  });

  it("adds multiple partial limbs correctly", () => {
    const char = createTestCharacter({
      cyberlimbs: [
        createTestCyberlimb({ limbType: "lower-arm", location: "left-lower-arm" }),
        createTestCyberlimb({ limbType: "lower-arm", location: "right-lower-arm" }),
      ],
    });

    expect(calculateTotalCMBonus(char)).toBe(1); // 0.5 + 0.5 = 1
  });

  it("sums multiple full limbs", () => {
    const char = createTestCharacter({
      cyberlimbs: [
        createTestCyberlimb({ limbType: "full-arm", location: "left-arm" }),
        createTestCyberlimb({ limbType: "full-leg", location: "left-leg" }),
        createTestCyberlimb({ limbType: "torso", location: "torso" }),
      ],
    });

    expect(calculateTotalCMBonus(char)).toBe(3);
  });
});

// =============================================================================
// ATTRIBUTE CALCULATION TESTS
// =============================================================================

describe("getCyberlimbStrength", () => {
  it("returns base 3 with no customization or enhancement", () => {
    const limb = createTestCyberlimb({
      baseStrength: 3,
      customStrength: 0,
      enhancements: [],
    });

    expect(getCyberlimbStrength(limb)).toBe(3);
  });

  it("adds customization to base", () => {
    const limb = createTestCyberlimb({
      baseStrength: 3,
      customStrength: 2,
      enhancements: [],
    });

    expect(getCyberlimbStrength(limb)).toBe(5);
  });

  it("adds enhancement rating to total", () => {
    const limb = createTestCyberlimb({
      baseStrength: 3,
      customStrength: 2,
      enhancements: [
        {
          id: "enh-1",
          catalogId: "enhanced-strength",
          name: "Enhanced Strength",
          enhancementType: "strength",
          rating: 3,
          capacityUsed: 3,
          cost: 19500,
          availability: 18,
        },
      ],
    });

    expect(getCyberlimbStrength(limb)).toBe(8); // 3 + 2 + 3
  });
});

describe("getCyberlimbAgility", () => {
  it("calculates correctly with all components", () => {
    const limb = createTestCyberlimb({
      baseAgility: 3,
      customAgility: 3,
      enhancements: [
        {
          id: "enh-1",
          catalogId: "enhanced-agility",
          name: "Enhanced Agility",
          enhancementType: "agility",
          rating: 2,
          capacityUsed: 2,
          cost: 13000,
          availability: 12,
        },
      ],
    });

    expect(getCyberlimbAgility(limb)).toBe(8); // 3 + 3 + 2
  });
});

describe("calculateAverageAttribute", () => {
  it("returns natural value with no cyberlimbs", () => {
    const char = createTestCharacter({
      attributes: { bod: 4, agi: 4, rea: 3, str: 5, wil: 3, log: 3, int: 3, cha: 3 },
      cyberlimbs: [],
    });

    expect(calculateAverageAttribute(char, "strength")).toBe(5);
    expect(calculateAverageAttribute(char, "agility")).toBe(4);
  });

  it("averages with one full arm", () => {
    const limb = createTestCyberlimb({
      baseStrength: 3,
      customStrength: 3,
      enhancements: [], // STR = 6
    });
    const char = createTestCharacter({
      attributes: { bod: 4, agi: 4, rea: 3, str: 4, wil: 3, log: 3, int: 3, cha: 3 },
      cyberlimbs: [limb],
    });

    // 4 limb slots, 1 cyber (STR 6), 3 natural (STR 4)
    // Average = (6 * 1 + 4 * 3) / 4 = 18/4 = 4.5 → floor to 4
    expect(calculateAverageAttribute(char, "strength")).toBe(4);
  });
});

// =============================================================================
// CREATION TESTS
// =============================================================================

describe("createCyberlimb", () => {
  it("creates a new cyberlimb with correct defaults", () => {
    const catalogItem = createTestCatalogItem();
    const char = createTestCharacter();

    const limb = createCyberlimb(catalogItem, "left-arm", "standard");

    expect(limb.catalogId).toBe("cyberlimb-arm");
    expect(limb.name).toBe("Obvious Cyberarm");
    expect(limb.category).toBe("cyberlimb");
    expect(limb.grade).toBe("standard");
    expect(limb.baseEssenceCost).toBe(1.0);
    expect(limb.essenceCost).toBe(1.0);
    expect(limb.location).toBe("left-arm");
    expect(limb.limbType).toBe("full-arm");
    expect(limb.appearance).toBe("obvious");
    expect(limb.baseStrength).toBe(3);
    expect(limb.baseAgility).toBe(3);
    expect(limb.customStrength).toBe(0);
    expect(limb.customAgility).toBe(0);
    expect(limb.baseCapacity).toBe(15);
    expect(limb.capacityUsed).toBe(0);
    expect(limb.enhancements).toEqual([]);
    expect(limb.accessories).toEqual([]);
    expect(limb.weapons).toEqual([]);
    expect(limb.wirelessEnabled).toBe(true);
    expect(limb.condition).toBe("working");
    expect(limb.modificationHistory).toHaveLength(1);
  });

  it("applies customization costs", () => {
    const catalogItem = createTestCatalogItem();

    const limb = createCyberlimb(catalogItem, "left-arm", "standard", {
      strengthCustomization: 2,
      agilityCustomization: 1,
    });

    expect(limb.customStrength).toBe(2);
    expect(limb.customAgility).toBe(1);
    // Base cost 15000 + (2 + 1) * 5000 = 30000
    expect(limb.cost).toBe(30000);
    // Base avail 4 + (2 + 1) * 1 = 7
    expect(limb.availability).toBe(7);
  });

  it("applies grade multipliers", () => {
    const catalogItem = createTestCatalogItem();

    const limb = createCyberlimb(catalogItem, "left-arm", "alpha");

    expect(limb.essenceCost).toBe(0.8); // 1.0 * 0.8
    expect(limb.cost).toBe(30000); // 15000 * 2.0 (alpha grade costs double)
  });
});

describe("calculateCyberlimbCosts", () => {
  it("calculates all costs correctly", () => {
    const catalogItem = createTestCatalogItem();

    const costs = calculateCyberlimbCosts(catalogItem, "standard", {
      strengthCustomization: 2,
      agilityCustomization: 1,
    });

    expect(costs.essenceCost).toBe(1.0);
    expect(costs.nuyenCost).toBe(30000); // 15000 base + 15000 customization
    expect(costs.availability).toBe(7); // 4 base + 3 customization
    expect(costs.breakdown.baseCost).toBe(15000);
    expect(costs.breakdown.customizationCost).toBe(15000);
  });
});

describe("validateCyberlimbInstallation", () => {
  it("accepts valid installation", () => {
    const char = createTestCharacter();
    const catalogItem = createTestCatalogItem();

    const result = validateCyberlimbInstallation(
      char,
      catalogItem,
      "left-arm",
      "standard"
    );

    expect(result.valid).toBe(true);
  });

  it("rejects installation at invalid location", () => {
    const char = createTestCharacter();
    const catalogItem = createTestCatalogItem();

    const result = validateCyberlimbInstallation(
      char,
      catalogItem,
      "left-leg", // Invalid for arm
      "standard"
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain("cannot be installed");
  });

  it("rejects installation blocked by existing limb", () => {
    const existingArm = createTestCyberlimb({
      location: "left-arm",
      limbType: "full-arm",
    });
    const char = createTestCharacter({ cyberlimbs: [existingArm] });

    // Try to install a hand where full arm exists
    const handCatalog: CyberlimbCatalogItem = {
      id: "cyberhand",
      name: "Cyberhand",
      category: "cyberlimb",
      essenceCost: 0.25,
      cost: 4000,
      availability: 4,
      description: "A cyberhand",
      capacity: 4,
      limbType: "hand",
      appearance: "obvious",
      baseStrength: 3,
      baseAgility: 3,
      physicalCMBonus: 0,
    };

    const result = validateCyberlimbInstallation(
      char,
      handCatalog,
      "left-hand",
      "standard"
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain("already exists");
  });
});

// =============================================================================
// UTILITY TESTS
// =============================================================================

describe("getCyberlimbSummary", () => {
  it("returns formatted summary string", () => {
    const limb = createTestCyberlimb({
      name: "Obvious Cyberarm",
      grade: "alpha",
      location: "left-arm",
      customStrength: 2,
      customAgility: 1,
      baseCapacity: 15,
      enhancements: [
        {
          id: "enh-1",
          catalogId: "enhanced-strength",
          name: "Enhanced Strength",
          enhancementType: "strength",
          rating: 3,
          capacityUsed: 3,
          cost: 19500,
          availability: 18,
        },
      ],
    });

    const summary = getCyberlimbSummary(limb);

    expect(summary).toContain("Obvious Cyberarm");
    expect(summary).toContain("alpha");
    expect(summary).toContain("left-arm");
    expect(summary).toContain("STR 8"); // 3 base + 2 custom + 3 enhancement
    expect(summary).toContain("AGI 4"); // 3 base + 1 custom
    expect(summary).toContain("1 enhancement");
  });
});

describe("toggleCyberlimbWireless", () => {
  it("toggles wireless state for limb and contents", () => {
    const limb = createTestCyberlimb({
      wirelessEnabled: true,
      enhancements: [
        {
          id: "enh-1",
          catalogId: "enhanced-agility",
          name: "Enhanced Agility",
          enhancementType: "agility",
          rating: 2,
          capacityUsed: 2,
          cost: 13000,
          availability: 12,
          wirelessEnabled: true,
        },
      ],
      accessories: [
        {
          id: "acc-1",
          catalogId: "gyromount",
          name: "Gyromount",
          capacityUsed: 6,
          cost: 6000,
          availability: 8,
          wirelessEnabled: true,
        },
      ],
    });

    const result = toggleCyberlimbWireless(limb, false);

    expect(result.wirelessEnabled).toBe(false);
    expect(result.enhancements[0].wirelessEnabled).toBe(false);
    expect(result.accessories[0].wirelessEnabled).toBe(false);
    expect(result.modificationHistory).toHaveLength(1);
    expect(result.modificationHistory[0].action).toBe("wireless_toggled");
  });
});
