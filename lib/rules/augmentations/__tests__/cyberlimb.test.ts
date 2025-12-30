/**
 * Cyberlimb Capacity and Customization Tests
 *
 * Tests for cyberlimb capacity management and attribute customization.
 */

import { describe, it, expect } from "vitest";
import {
  isCyberlimb,
  getBaseCyberlimbCapacity,
  calculateCyberlimbCapacity,
  calculateEnhancementCapacityUsed,
  calculateCustomizationCapacityCost,
  calculateUsedCapacity,
  validateEnhancementFits,
  addEnhancementToLimb,
  removeEnhancementFromLimb,
  getCyberlimbCustomizationLimits,
  validateCyberlimbCustomization,
  setCyberlimbAttribute,
  getCyberlimbEffectiveAttributes,
  calculateCyberlimbAverageAttribute,
  createCyberlimb,
  getCyberlimbSummary,
  type CyberlimbItem,
} from "../cyberlimb";
import type { CyberwareItem, Character } from "@/lib/types/character";
import type { CyberwareCatalogItem } from "@/lib/types/edition";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createTestCyberlimb(overrides: Partial<CyberlimbItem> = {}): CyberlimbItem {
  return {
    catalogId: "cyberarm-standard",
    name: "Cyberarm (Standard)",
    category: "cyberlimb",
    grade: "standard",
    baseEssenceCost: 1.0,
    essenceCost: 1.0,
    cost: 15000,
    availability: 4,
    capacity: 15,
    capacityUsed: 0,
    enhancements: [],
    limbStrength: 3,
    limbAgility: 3,
    strengthCustomization: 0,
    agilityCustomization: 0,
    ...overrides,
  };
}

function createTestCharacter(overrides: Partial<Character> = {}): Partial<Character> {
  return {
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
    ...overrides,
  };
}

function createTestEnhancement(overrides: Partial<CyberwareCatalogItem> = {}): CyberwareCatalogItem {
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
    ...overrides,
  } as CyberwareCatalogItem;
}

// =============================================================================
// CYBERLIMB IDENTIFICATION
// =============================================================================

describe("isCyberlimb", () => {
  it("returns true for cyberlimb category", () => {
    const item: CyberwareItem = {
      catalogId: "cyberarm",
      name: "Cyberarm",
      category: "cyberlimb",
      grade: "standard",
      baseEssenceCost: 1.0,
      essenceCost: 1.0,
      cost: 15000,
      availability: 4,
    };

    expect(isCyberlimb(item)).toBe(true);
  });

  it("returns false for non-cyberlimb category", () => {
    const item: CyberwareItem = {
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 0.1,
      essenceCost: 0.1,
      cost: 500,
      availability: 2,
    };

    expect(isCyberlimb(item)).toBe(false);
  });
});

// =============================================================================
// BASE CAPACITY
// =============================================================================

describe("getBaseCyberlimbCapacity", () => {
  it("returns 15 for cyberarm", () => {
    expect(getBaseCyberlimbCapacity("cyberarm")).toBe(15);
    expect(getBaseCyberlimbCapacity("cyberarm-standard")).toBe(15);
    expect(getBaseCyberlimbCapacity("CYBERARM")).toBe(15);
  });

  it("returns 20 for cyberleg", () => {
    expect(getBaseCyberlimbCapacity("cyberleg")).toBe(20);
    expect(getBaseCyberlimbCapacity("cyberleg-obvious")).toBe(20);
  });

  it("returns 4 for cyberhand", () => {
    expect(getBaseCyberlimbCapacity("cyberhand")).toBe(4);
  });

  it("returns 4 for cyberfoot", () => {
    expect(getBaseCyberlimbCapacity("cyberfoot")).toBe(4);
  });

  it("returns 10 for cybertorso", () => {
    expect(getBaseCyberlimbCapacity("cybertorso")).toBe(10);
  });

  it("returns 4 for cyberskull", () => {
    expect(getBaseCyberlimbCapacity("cyberskull")).toBe(4);
  });

  it("defaults to arm capacity for unknown types", () => {
    expect(getBaseCyberlimbCapacity("unknown-limb")).toBe(15);
  });
});

describe("calculateCyberlimbCapacity", () => {
  it("uses explicit capacity if set", () => {
    const limb = createTestCyberlimb({ capacity: 18 });

    expect(calculateCyberlimbCapacity(limb)).toBe(18);
  });

  it("derives capacity from catalogId if not set", () => {
    const limb = createTestCyberlimb({ capacity: 0, catalogId: "cyberleg" });

    expect(calculateCyberlimbCapacity(limb)).toBe(20);
  });

  it("defaults to arm capacity when catalogId doesn't match", () => {
    const limb = createTestCyberlimb({
      capacity: undefined,
      catalogId: "custom-limb",
      name: "Custom Cyberleg",
    });

    // Function uses catalogId for lookup, not name
    // Unknown types default to arm capacity (15)
    expect(calculateCyberlimbCapacity(limb)).toBe(15);
  });
});

// =============================================================================
// CAPACITY CALCULATIONS
// =============================================================================

describe("calculateEnhancementCapacityUsed", () => {
  it("returns 0 with no enhancements", () => {
    const limb = createTestCyberlimb({ enhancements: [] });

    expect(calculateEnhancementCapacityUsed(limb)).toBe(0);
  });

  it("sums enhancement capacity usage", () => {
    const limb = createTestCyberlimb({
      enhancements: [
        { catalogId: "a", name: "A", category: "cyberlimb-enhancement", grade: "standard", baseEssenceCost: 0, essenceCost: 0, cost: 1000, availability: 4, capacityUsed: 2 } as CyberwareItem,
        { catalogId: "b", name: "B", category: "cyberlimb-enhancement", grade: "standard", baseEssenceCost: 0, essenceCost: 0, cost: 1000, availability: 4, capacityUsed: 3 } as CyberwareItem,
      ],
    });

    expect(calculateEnhancementCapacityUsed(limb)).toBe(5);
  });

  it("falls back to baseEssenceCost if capacityUsed not set", () => {
    const limb = createTestCyberlimb({
      enhancements: [
        { catalogId: "a", name: "A", category: "cyberlimb-enhancement", grade: "standard", baseEssenceCost: 2, essenceCost: 2, cost: 1000, availability: 4 } as CyberwareItem,
      ],
    });

    expect(calculateEnhancementCapacityUsed(limb)).toBe(2);
  });

  it("uses 0 when baseEssenceCost is 0 (nullish coalescing)", () => {
    const limb = createTestCyberlimb({
      enhancements: [
        { catalogId: "a", name: "A", category: "cyberlimb-enhancement", grade: "standard", baseEssenceCost: 0, essenceCost: 0, cost: 1000, availability: 4 } as CyberwareItem,
      ],
    });

    // Uses nullish coalescing (??) so 0 is a valid value, not treated as fallback
    expect(calculateEnhancementCapacityUsed(limb)).toBe(0);
  });
});

describe("calculateCustomizationCapacityCost", () => {
  it("returns 0 with no customization", () => {
    const limb = createTestCyberlimb({ strengthCustomization: 0, agilityCustomization: 0 });

    expect(calculateCustomizationCapacityCost(limb)).toBe(0);
  });

  it("calculates cost as sum of STR and AGI bonuses", () => {
    const limb = createTestCyberlimb({ strengthCustomization: 2, agilityCustomization: 3 });

    expect(calculateCustomizationCapacityCost(limb)).toBe(5);
  });

  it("handles only STR customization", () => {
    const limb = createTestCyberlimb({ strengthCustomization: 3, agilityCustomization: 0 });

    expect(calculateCustomizationCapacityCost(limb)).toBe(3);
  });

  it("handles only AGI customization", () => {
    const limb = createTestCyberlimb({ strengthCustomization: 0, agilityCustomization: 4 });

    expect(calculateCustomizationCapacityCost(limb)).toBe(4);
  });
});

describe("calculateUsedCapacity", () => {
  it("calculates complete breakdown", () => {
    const limb = createTestCyberlimb({
      capacity: 15,
      strengthCustomization: 2,
      agilityCustomization: 1,
      enhancements: [
        { catalogId: "a", name: "A", category: "cyberlimb-enhancement", grade: "standard", baseEssenceCost: 0, essenceCost: 0, cost: 1000, availability: 4, capacityUsed: 3 } as CyberwareItem,
      ],
    });

    const breakdown = calculateUsedCapacity(limb);

    expect(breakdown.totalCapacity).toBe(15);
    expect(breakdown.usedByEnhancements).toBe(3);
    expect(breakdown.usedByCustomization).toBe(3); // 2 + 1
    expect(breakdown.remainingCapacity).toBe(9); // 15 - 3 - 3
  });

  it("clamps remaining to minimum 0", () => {
    const limb = createTestCyberlimb({
      capacity: 5,
      strengthCustomization: 3,
      agilityCustomization: 3,
      enhancements: [],
    });

    const breakdown = calculateUsedCapacity(limb);

    expect(breakdown.remainingCapacity).toBe(0); // Max 0, not negative
  });
});

// =============================================================================
// ENHANCEMENT MANAGEMENT
// =============================================================================

describe("validateEnhancementFits", () => {
  it("allows enhancement that fits", () => {
    const limb = createTestCyberlimb({ capacity: 15, capacityUsed: 0 });
    const enhancement = createTestEnhancement({ capacityCost: 3 });

    const result = validateEnhancementFits(limb, enhancement);

    expect(result.valid).toBe(true);
  });

  it("rejects enhancement that doesn't fit", () => {
    const limb = createTestCyberlimb({
      capacity: 15,
      strengthCustomization: 5,
      agilityCustomization: 5,
      enhancements: [
        { catalogId: "existing", name: "Existing", category: "cyberlimb-enhancement", grade: "standard", baseEssenceCost: 0, essenceCost: 0, cost: 1000, availability: 4, capacityUsed: 4 } as CyberwareItem,
      ],
    });
    const enhancement = createTestEnhancement({ capacityCost: 5 }); // Only 1 remaining

    const result = validateEnhancementFits(limb, enhancement);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("capacity");
  });

  it("rejects non-enhancement items", () => {
    const limb = createTestCyberlimb();
    const item = createTestEnhancement({ category: "bodyware" });

    const result = validateEnhancementFits(limb, item);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("not a cyberlimb enhancement");
  });

  it("accounts for rated enhancement capacity", () => {
    const limb = createTestCyberlimb({ capacity: 15, capacityUsed: 0 });
    const enhancement = createTestEnhancement({
      capacityCost: 2,
      ratingSpec: { capacityCostScaling: { perRating: true } },
    } as Partial<CyberwareCatalogItem>);

    // Rating 3 = 2 * 3 = 6 capacity
    const result = validateEnhancementFits(limb, enhancement, 3);

    expect(result.valid).toBe(true);
  });

  it("allows cyberlimb-accessory items", () => {
    const limb = createTestCyberlimb({ capacity: 15 });
    const accessory = createTestEnhancement({ category: "cyberlimb-accessory", capacityCost: 2 });

    const result = validateEnhancementFits(limb, accessory);

    expect(result.valid).toBe(true);
  });
});

describe("addEnhancementToLimb", () => {
  it("adds enhancement to limb", () => {
    const limb = createTestCyberlimb({ enhancements: [] });
    const enhancement = createTestEnhancement({ id: "new-enhancement", name: "New Enhancement", capacityCost: 2 });

    const result = addEnhancementToLimb(limb, enhancement, "standard");

    expect(result.enhancements).toHaveLength(1);
    expect(result.enhancements![0].catalogId).toBe("new-enhancement");
    expect(result.enhancements![0].capacityUsed).toBe(2);
    expect(result.capacityUsed).toBe(2);
  });

  it("preserves existing enhancements", () => {
    const existing: CyberwareItem = {
      catalogId: "existing",
      name: "Existing",
      category: "cyberlimb-enhancement",
      grade: "standard",
      baseEssenceCost: 0,
      essenceCost: 0,
      cost: 1000,
      availability: 4,
      capacityUsed: 3,
    };
    const limb = createTestCyberlimb({ enhancements: [existing], capacityUsed: 3 });
    const enhancement = createTestEnhancement({ capacityCost: 2 });

    const result = addEnhancementToLimb(limb, enhancement, "standard");

    expect(result.enhancements).toHaveLength(2);
    expect(result.capacityUsed).toBe(5);
  });

  it("applies grade to cost and essence", () => {
    const limb = createTestCyberlimb();
    const enhancement = createTestEnhancement({ cost: 1000, essenceCost: 0.2 });

    const result = addEnhancementToLimb(limb, enhancement, "alpha");

    // Alpha cost multiplier is 2.0 (double the price for better quality)
    expect(result.enhancements![0].cost).toBe(2000);
    // Alpha essence multiplier is 0.8
    expect(result.enhancements![0].essenceCost).toBe(0.16);
  });

  it("handles rated enhancements", () => {
    const limb = createTestCyberlimb();
    const enhancement = createTestEnhancement({
      capacityCost: 1,
      ratingSpec: { capacityCostScaling: { perRating: true } },
    } as Partial<CyberwareCatalogItem>);

    const result = addEnhancementToLimb(limb, enhancement, "standard", 3);

    expect(result.enhancements![0].rating).toBe(3);
    expect(result.enhancements![0].capacityUsed).toBe(3);
  });
});

describe("removeEnhancementFromLimb", () => {
  it("removes enhancement by catalogId", () => {
    const existing: CyberwareItem = {
      catalogId: "to-remove",
      name: "To Remove",
      category: "cyberlimb-enhancement",
      grade: "standard",
      baseEssenceCost: 0,
      essenceCost: 0,
      cost: 1000,
      availability: 4,
      capacityUsed: 3,
    };
    const limb = createTestCyberlimb({ enhancements: [existing], capacityUsed: 3 });

    const result = removeEnhancementFromLimb(limb, "to-remove");

    expect(result.enhancements).toHaveLength(0);
    expect(result.capacityUsed).toBe(0);
  });

  it("returns unchanged limb if enhancement not found", () => {
    const limb = createTestCyberlimb({ enhancements: [], capacityUsed: 0 });

    const result = removeEnhancementFromLimb(limb, "nonexistent");

    expect(result).toEqual(limb);
  });

  it("preserves other enhancements", () => {
    const keep: CyberwareItem = {
      catalogId: "keep",
      name: "Keep",
      category: "cyberlimb-enhancement",
      grade: "standard",
      baseEssenceCost: 0,
      essenceCost: 0,
      cost: 1000,
      availability: 4,
      capacityUsed: 2,
    };
    const remove: CyberwareItem = {
      catalogId: "remove",
      name: "Remove",
      category: "cyberlimb-enhancement",
      grade: "standard",
      baseEssenceCost: 0,
      essenceCost: 0,
      cost: 1000,
      availability: 4,
      capacityUsed: 3,
    };
    const limb = createTestCyberlimb({ enhancements: [keep, remove], capacityUsed: 5 });

    const result = removeEnhancementFromLimb(limb, "remove");

    expect(result.enhancements).toHaveLength(1);
    expect(result.enhancements![0].catalogId).toBe("keep");
    expect(result.capacityUsed).toBe(2);
  });
});

// =============================================================================
// ATTRIBUTE CUSTOMIZATION
// =============================================================================

describe("getCyberlimbCustomizationLimits", () => {
  it("calculates limits based on character", () => {
    const limb = createTestCyberlimb({ strengthCustomization: 2, agilityCustomization: 1 });
    const char = createTestCharacter({ attributes: { bod: 5, agi: 4 } });

    const limits = getCyberlimbCustomizationLimits(limb, char);

    expect(limits.baseStrength).toBe(5);
    expect(limits.baseAgility).toBe(4);
    expect(limits.strengthBonus).toBe(2);
    expect(limits.agilityBonus).toBe(1);
    expect(limits.strength).toBe(5); // base 3 + 2
    expect(limits.agility).toBe(4); // base 3 + 1
    expect(limits.maxStrength).toBe(9); // racial max 6 + 3
    expect(limits.maxAgility).toBe(9);
  });
});

describe("validateCyberlimbCustomization", () => {
  it("validates valid customization", () => {
    const limb = createTestCyberlimb({
      capacity: 15,
      strengthCustomization: 2,
      agilityCustomization: 2,
    });
    const char = createTestCharacter();

    const result = validateCyberlimbCustomization(limb, char);

    expect(result.valid).toBe(true);
  });

  it("rejects STR exceeding maximum", () => {
    const limb = createTestCyberlimb({
      strengthCustomization: 7, // Would be 3 + 7 = 10, max is 9
      agilityCustomization: 0,
    });
    const char = createTestCharacter();

    const result = validateCyberlimbCustomization(limb, char);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("STR");
    expect(result.error).toContain("exceeds maximum");
  });

  it("rejects AGI exceeding maximum", () => {
    const limb = createTestCyberlimb({
      strengthCustomization: 0,
      agilityCustomization: 7, // Would be 3 + 7 = 10, max is 9
    });
    const char = createTestCharacter();

    const result = validateCyberlimbCustomization(limb, char);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("AGI");
  });

  it("rejects customization exceeding available capacity", () => {
    const limb = createTestCyberlimb({
      capacity: 5,
      strengthCustomization: 3,
      agilityCustomization: 3, // Total 6, but only 5 capacity
      enhancements: [],
    });
    const char = createTestCharacter();

    const result = validateCyberlimbCustomization(limb, char);

    expect(result.valid).toBe(false);
    expect(result.error).toContain("capacity");
  });
});

describe("setCyberlimbAttribute", () => {
  it("sets strength successfully", () => {
    const limb = createTestCyberlimb({ capacity: 15 });
    const char = createTestCharacter();

    const result = setCyberlimbAttribute(limb, "strength", 5, char);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.limb.limbStrength).toBe(5);
      expect(result.limb.strengthCustomization).toBe(2); // 5 - 3 base
    }
  });

  it("sets agility successfully", () => {
    const limb = createTestCyberlimb({ capacity: 15 });
    const char = createTestCharacter();

    const result = setCyberlimbAttribute(limb, "agility", 6, char);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.limb.limbAgility).toBe(6);
      expect(result.limb.agilityCustomization).toBe(3);
    }
  });

  it("rejects setting below base value", () => {
    const limb = createTestCyberlimb();
    const char = createTestCharacter();

    const result = setCyberlimbAttribute(limb, "strength", 2, char);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("below base value");
    }
  });

  it("rejects setting above maximum", () => {
    const limb = createTestCyberlimb();
    const char = createTestCharacter();

    const result = setCyberlimbAttribute(limb, "strength", 10, char); // Max is 9

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("exceeds maximum");
    }
  });

  it("rejects when capacity would be exceeded", () => {
    const limb = createTestCyberlimb({
      capacity: 5,
      strengthCustomization: 3,
      agilityCustomization: 0,
    });
    const char = createTestCharacter();

    // Setting AGI to 6 (bonus 3) would need 3 + 3 = 6 capacity, but only 5 available
    const result = setCyberlimbAttribute(limb, "agility", 6, char);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("capacity");
    }
  });
});

describe("getCyberlimbEffectiveAttributes", () => {
  it("returns current limb attributes", () => {
    const limb = createTestCyberlimb({
      limbStrength: 5,
      limbAgility: 4,
    });

    const attrs = getCyberlimbEffectiveAttributes(limb);

    expect(attrs.strength).toBe(5);
    expect(attrs.agility).toBe(4);
  });

  it("calculates from customization if limb values not set", () => {
    const limb = createTestCyberlimb({
      limbStrength: undefined,
      limbAgility: undefined,
      strengthCustomization: 2,
      agilityCustomization: 3,
    });

    const attrs = getCyberlimbEffectiveAttributes(limb);

    expect(attrs.strength).toBe(5); // 3 + 2
    expect(attrs.agility).toBe(6); // 3 + 3
  });
});

// =============================================================================
// CYBERLIMB AVERAGING
// =============================================================================

describe("calculateCyberlimbAverageAttribute", () => {
  it("returns natural value with no cyberlimbs", () => {
    const char = createTestCharacter({ attributes: { bod: 5, agi: 4 } });

    const avgStr = calculateCyberlimbAverageAttribute(char, "strength");
    const avgAgi = calculateCyberlimbAverageAttribute(char, "agility");

    expect(avgStr).toBe(5);
    expect(avgAgi).toBe(4);
  });

  it("averages with one cyberarm", () => {
    const limb = createTestCyberlimb({
      catalogId: "cyberarm",
      limbStrength: 6,
      limbAgility: 5,
    });
    const char = createTestCharacter({
      attributes: { bod: 4, agi: 4 },
      cyberware: [limb],
    });

    // 4 limbs total, 1 cyber (STR 6), 3 natural (STR 4)
    // Average = (6 + 4*3) / 4 = 18/4 = 4.5
    const avgStr = calculateCyberlimbAverageAttribute(char, "strength");

    expect(avgStr).toBe(4.5);
  });

  it("handles multiple cyberlimbs", () => {
    const arm = createTestCyberlimb({
      catalogId: "cyberarm",
      limbStrength: 6,
      limbAgility: 5,
    });
    const leg = createTestCyberlimb({
      catalogId: "cyberleg",
      limbStrength: 6,
      limbAgility: 5,
    });
    const char = createTestCharacter({
      attributes: { bod: 4, agi: 4 },
      cyberware: [arm, leg],
    });

    // 4 limbs total, 2 cyber (STR 6), 2 natural (STR 4)
    // Average = (6*2 + 4*2) / 4 = 20/4 = 5
    const avgStr = calculateCyberlimbAverageAttribute(char, "strength");

    expect(avgStr).toBe(5);
  });

  it("weights hands/feet as half limbs", () => {
    const hand = createTestCyberlimb({
      catalogId: "cyberhand",
      limbStrength: 6,
      limbAgility: 5,
    });
    const char = createTestCharacter({
      attributes: { bod: 4, agi: 4 },
      cyberware: [hand],
    });

    // 4 limbs total, 0.5 cyber (STR 6 * 0.5 = 3), 3.5 natural (STR 4 * 3.5 = 14)
    // Average = (3 + 14) / 4 = 17/4 = 4.25 → 4.3
    const avgStr = calculateCyberlimbAverageAttribute(char, "strength");

    expect(avgStr).toBeCloseTo(4.3, 1);
  });
});

// =============================================================================
// CYBERLIMB CREATION
// =============================================================================

describe("createCyberlimb", () => {
  it("creates a new cyberlimb with correct defaults", () => {
    const catalogItem: CyberwareCatalogItem = {
      id: "cyberarm-obvious",
      name: "Obvious Cyberarm",
      category: "cyberlimb",
      essenceCost: 1.0,
      cost: 15000,
      availability: 4,
      restricted: false,
      forbidden: false,
      description: "An obvious cyberarm",
      capacity: 15,
    } as CyberwareCatalogItem;
    const char = createTestCharacter();

    const limb = createCyberlimb(catalogItem, "standard", char);

    expect(limb.catalogId).toBe("cyberarm-obvious");
    expect(limb.name).toBe("Obvious Cyberarm");
    expect(limb.category).toBe("cyberlimb");
    expect(limb.grade).toBe("standard");
    expect(limb.baseEssenceCost).toBe(1.0);
    expect(limb.essenceCost).toBe(1.0);
    expect(limb.capacity).toBe(15);
    expect(limb.capacityUsed).toBe(0);
    expect(limb.enhancements).toEqual([]);
    expect(limb.limbStrength).toBe(3);
    expect(limb.limbAgility).toBe(3);
    expect(limb.strengthCustomization).toBe(0);
    expect(limb.agilityCustomization).toBe(0);
  });

  it("applies grade multipliers", () => {
    const catalogItem: CyberwareCatalogItem = {
      id: "cyberarm",
      name: "Cyberarm",
      category: "cyberlimb",
      essenceCost: 1.0,
      cost: 15000,
      availability: 4,
      restricted: false,
      forbidden: false,
      description: "",
    } as CyberwareCatalogItem;
    const char = createTestCharacter();

    const limb = createCyberlimb(catalogItem, "alpha", char);

    expect(limb.essenceCost).toBe(0.8); // 1.0 * 0.8
    expect(limb.cost).toBe(30000); // 15000 * 2.0 (alpha grade costs double)
  });

  it("derives capacity if not specified", () => {
    const catalogItem: CyberwareCatalogItem = {
      id: "cyberleg",
      name: "Cyberleg",
      category: "cyberlimb",
      essenceCost: 1.0,
      cost: 15000,
      availability: 4,
      restricted: false,
      forbidden: false,
      description: "",
      // No capacity specified
    } as CyberwareCatalogItem;
    const char = createTestCharacter();

    const limb = createCyberlimb(catalogItem, "standard", char);

    expect(limb.capacity).toBe(20); // Derived from "cyberleg"
  });
});

// =============================================================================
// SUMMARY
// =============================================================================

describe("getCyberlimbSummary", () => {
  it("returns formatted summary string", () => {
    const limb = createTestCyberlimb({
      name: "Obvious Cyberarm",
      grade: "alpha",
      limbStrength: 5,
      limbAgility: 4,
      capacity: 15,
      enhancements: [
        { catalogId: "a", name: "A", category: "cyberlimb-enhancement", grade: "standard", baseEssenceCost: 0, essenceCost: 0, cost: 1000, availability: 4, capacityUsed: 3 } as CyberwareItem,
      ],
      strengthCustomization: 2,
      agilityCustomization: 1,
    });

    const summary = getCyberlimbSummary(limb);

    expect(summary).toContain("Obvious Cyberarm");
    expect(summary).toContain("alpha");
    expect(summary).toContain("STR 5");
    expect(summary).toContain("AGI 4");
    expect(summary).toContain("1 enhancement");
  });
});
