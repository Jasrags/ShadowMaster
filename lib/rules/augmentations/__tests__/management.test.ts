/**
 * Augmentation Management Tests
 *
 * Tests for installation, removal, and management of cyberware and bioware.
 */

import { describe, it, expect } from "vitest";
import {
  installCyberware,
  installBioware,
  removeCyberware,
  removeBioware,
  upgradeAugmentationGrade,
  toggleGlobalWirelessBonus,
  getWirelessBonusState,
  aggregateActiveWirelessBonuses,
  aggregateAugmentationBonuses,
} from "../management";
import type { Character, CyberwareItem, BiowareItem } from "@/lib/types/character";
import type { CyberwareCatalogItem, BiowareCatalogItem } from "@/lib/types/edition";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createTestCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "test-char-1",
    ownerId: "test-user-1",
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    attachedBookIds: [],
    name: "Test Character",
    metatype: "Human",
    status: "active",
    attributes: {
      bod: 4,
      agi: 4,
      rea: 4,
      str: 4,
      wil: 4,
      log: 4,
      int: 4,
      cha: 4,
    },
    specialAttributes: {
      edge: 3,
      essence: 6.0,
    },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    nuyen: 50000,
    startingNuyen: 50000,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
    },
    magicalPath: "mundane",
    cyberware: [],
    bioware: [],
    ...overrides,
  } as Character;
}

function createMagicalCharacter(overrides: Partial<Character> = {}): Character {
  return createTestCharacter({
    magicalPath: "full-mage",
    specialAttributes: {
      edge: 3,
      essence: 6.0,
      magic: 6,
    },
    ...overrides,
  });
}

function createTestCyberwareCatalog(
  overrides: Partial<CyberwareCatalogItem> = {}
): CyberwareCatalogItem {
  return {
    id: "datajack",
    name: "Datajack",
    category: "headware",
    essenceCost: 0.1,
    cost: 1000,
    availability: 2,
    restricted: false,
    forbidden: false,
    description: "Neural interface for direct data connection",
    ...overrides,
  } as CyberwareCatalogItem;
}

function createTestBiowareCatalog(overrides: Partial<BiowareCatalogItem> = {}): BiowareCatalogItem {
  return {
    id: "muscle-toner",
    name: "Muscle Toner",
    category: "basic",
    essenceCost: 0.2,
    cost: 8000,
    availability: 8,
    restricted: false,
    forbidden: false,
    description: "Genetically modified muscle fibers",
    hasRating: true,
    maxRating: 4,
    ...overrides,
  } as BiowareCatalogItem;
}

// =============================================================================
// INSTALLATION TESTS
// =============================================================================

describe("installCyberware", () => {
  it("installs cyberware and updates essence correctly", () => {
    const char = createTestCharacter();
    const catalog = createTestCyberwareCatalog({ essenceCost: 0.5 });

    const result = installCyberware(char, catalog, "standard");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.character.cyberware).toHaveLength(1);
      expect(result.character.specialAttributes.essence).toBe(5.5);
      expect(result.installedItem.catalogId).toBe("datajack");
      expect(result.installedItem.essenceCost).toBe(0.5);
      expect(result.essenceChange).toBe(-0.5);
    }
  });

  it("applies grade multiplier to essence", () => {
    const char = createTestCharacter();
    const catalog = createTestCyberwareCatalog({ essenceCost: 1.0 });

    const result = installCyberware(char, catalog, "alpha");

    expect(result.success).toBe(true);
    if (result.success) {
      // Alpha grade = 0.8 multiplier
      expect(result.installedItem.essenceCost).toBe(0.8);
      expect(result.character.specialAttributes.essence).toBe(5.2);
    }
  });

  it("rejects installation when essence would drop too low", () => {
    const char = createTestCharacter({
      cyberware: [
        {
          catalogId: "existing",
          name: "Existing",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 5.9,
          essenceCost: 5.9,
          cost: 50000,
          availability: 8,
        } as CyberwareItem,
      ],
      specialAttributes: { edge: 3, essence: 0.1 },
    });
    const catalog = createTestCyberwareCatalog({ essenceCost: 0.5 });

    const result = installCyberware(char, catalog, "standard");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toContain("ESSENCE");
    }
  });

  it("tracks magic loss for magical characters", () => {
    const char = createMagicalCharacter();
    const catalog = createTestCyberwareCatalog({ essenceCost: 1.5 });

    const result = installCyberware(char, catalog, "standard");

    expect(result.success).toBe(true);
    if (result.success) {
      // 1.5 essence loss = 2 magic loss (roundUp)
      expect(result.magicLoss).toBe(2);
      expect(result.character.specialAttributes.magic).toBe(4);
      expect(result.character.essenceHole).toBeDefined();
      expect(result.character.essenceHole?.magicLost).toBe(2);
    }
  });

  it("preserves existing cyberware when adding new", () => {
    const existingCyberware: CyberwareItem = {
      id: "existing-1",
      catalogId: "existing",
      name: "Existing Cyberware",
      category: "bodyware",
      grade: "standard",
      baseEssenceCost: 1.0,
      essenceCost: 1.0,
      cost: 5000,
      availability: 4,
    };
    const char = createTestCharacter({
      cyberware: [existingCyberware],
      specialAttributes: { edge: 3, essence: 5.0 },
    });
    const catalog = createTestCyberwareCatalog({ essenceCost: 0.5 });

    const result = installCyberware(char, catalog, "standard");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.character.cyberware).toHaveLength(2);
      expect(result.character.cyberware![0].catalogId).toBe("existing");
      expect(result.character.cyberware![1].catalogId).toBe("datajack");
      expect(result.character.specialAttributes.essence).toBe(4.5);
    }
  });

  it("handles rated cyberware", () => {
    const char = createTestCharacter();
    const catalog = createTestCyberwareCatalog({
      id: "wired-reflexes",
      name: "Wired Reflexes",
      essenceCost: 2.0,
      hasRating: true,
      maxRating: 3,
      essencePerRating: true, // Enable essence scaling with rating
    });

    const result = installCyberware(char, catalog, "standard", 2);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.installedItem.rating).toBe(2);
      // Essence scales with rating: 2.0 * 2 = 4.0
      expect(result.installedItem.essenceCost).toBe(4.0);
    }
  });
});

describe("installBioware", () => {
  it("installs bioware and updates essence correctly", () => {
    const char = createTestCharacter();
    const catalog = createTestBiowareCatalog({ essenceCost: 0.3 });

    const result = installBioware(char, catalog, "standard");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.character.bioware).toHaveLength(1);
      expect(result.character.specialAttributes.essence).toBe(5.7);
      expect(result.installedItem.catalogId).toBe("muscle-toner");
      expect(result.essenceChange).toBe(-0.3);
    }
  });

  it("applies bioware grade multiplier", () => {
    const char = createTestCharacter();
    const catalog = createTestBiowareCatalog({ essenceCost: 0.5 });

    const result = installBioware(char, catalog, "alpha");

    expect(result.success).toBe(true);
    if (result.success) {
      // Alpha bioware = 0.8 multiplier
      expect(result.installedItem.essenceCost).toBe(0.4); // 0.5 * 0.8 = 0.4
      expect(result.character.specialAttributes.essence).toBe(5.6);
    }
  });

  it("tracks magic loss for magical characters", () => {
    const char = createMagicalCharacter();
    const catalog = createTestBiowareCatalog({ essenceCost: 0.8 });

    const result = installBioware(char, catalog, "standard");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.magicLoss).toBe(1); // roundUp(0.8) = 1
      expect(result.character.specialAttributes.magic).toBe(5);
    }
  });
});

// =============================================================================
// REMOVAL TESTS
// =============================================================================

describe("removeCyberware", () => {
  it("removes cyberware and restores essence", () => {
    const cyberware: CyberwareItem = {
      id: "cyber-1",
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 0.5,
      essenceCost: 0.5,
      cost: 1000,
      availability: 2,
    };
    const char = createTestCharacter({
      cyberware: [cyberware],
      specialAttributes: { edge: 3, essence: 5.5 },
    });

    const result = removeCyberware(char, "cyber-1");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.character.cyberware).toHaveLength(0);
      expect(result.character.specialAttributes.essence).toBe(6.0);
      expect(result.essenceRestored).toBe(0.5);
      expect(result.removedItem.catalogId).toBe("datajack");
    }
  });

  it("removes cyberware by catalogId", () => {
    const cyberware: CyberwareItem = {
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 0.5,
      essenceCost: 0.5,
      cost: 1000,
      availability: 2,
    };
    const char = createTestCharacter({
      cyberware: [cyberware],
      specialAttributes: { edge: 3, essence: 5.5 },
    });

    const result = removeCyberware(char, "datajack");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.character.cyberware).toHaveLength(0);
    }
  });

  it("returns error for non-existent cyberware", () => {
    const char = createTestCharacter();

    const result = removeCyberware(char, "non-existent");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("updates essence hole but not magic on removal (essence hole persists)", () => {
    const cyberware: CyberwareItem = {
      id: "cyber-1",
      catalogId: "wired-reflexes",
      name: "Wired Reflexes",
      category: "bodyware",
      grade: "standard",
      baseEssenceCost: 2.0,
      essenceCost: 2.0,
      cost: 10000,
      availability: 8,
    };
    const char = createMagicalCharacter({
      cyberware: [cyberware],
      specialAttributes: { edge: 3, essence: 4.0, magic: 4 },
      essenceHole: {
        peakEssenceLoss: 2.0,
        currentEssenceLoss: 2.0,
        essenceHole: 0,
        magicLost: 2,
      },
    });

    const result = removeCyberware(char, "cyber-1");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.character.specialAttributes.essence).toBe(6.0);
      // Magic stays at 4 (essence hole persists)
      expect(result.character.specialAttributes.magic).toBe(4);
      // Essence hole now exists (peak stays at 2.0)
      expect(result.character.essenceHole?.peakEssenceLoss).toBe(2.0);
      expect(result.character.essenceHole?.currentEssenceLoss).toBe(0);
      expect(result.character.essenceHole?.essenceHole).toBe(2.0);
    }
  });
});

describe("removeBioware", () => {
  it("removes bioware and restores essence", () => {
    const bioware: BiowareItem = {
      id: "bio-1",
      catalogId: "muscle-toner",
      name: "Muscle Toner",
      category: "basic",
      grade: "standard",
      baseEssenceCost: 0.3,
      essenceCost: 0.3,
      cost: 8000,
      availability: 8,
    };
    const char = createTestCharacter({
      bioware: [bioware],
      specialAttributes: { edge: 3, essence: 5.7 },
    });

    const result = removeBioware(char, "bio-1");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.character.bioware).toHaveLength(0);
      expect(result.character.specialAttributes.essence).toBe(6.0);
      expect(result.essenceRestored).toBe(0.3);
    }
  });

  it("returns error for non-existent bioware", () => {
    const char = createTestCharacter();

    const result = removeBioware(char, "non-existent");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });
});

// =============================================================================
// GRADE UPGRADE TESTS
// =============================================================================

describe("upgradeAugmentationGrade", () => {
  it("upgrades cyberware grade and refunds essence", () => {
    const cyberware: CyberwareItem = {
      id: "cyber-1",
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 1.0,
      essenceCost: 1.0,
      cost: 1000,
      availability: 2,
    };
    const char = createTestCharacter({
      cyberware: [cyberware],
      specialAttributes: { edge: 3, essence: 5.0 },
    });

    const result = upgradeAugmentationGrade(char, "cyber-1", "alpha", true);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.upgradedItem.grade).toBe("alpha");
      expect(result.upgradedItem.essenceCost).toBe(0.8); // 1.0 * 0.8
      expect(result.essenceRefund).toBe(0.2); // 1.0 - 0.8
      expect(result.character.specialAttributes.essence).toBe(5.2); // 5.0 + 0.2
    }
  });

  it("rejects invalid grade downgrade", () => {
    const cyberware: CyberwareItem = {
      id: "cyber-1",
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "alpha",
      baseEssenceCost: 1.0,
      essenceCost: 0.8,
      cost: 2000,
      availability: 4,
    };
    const char = createTestCharacter({
      cyberware: [cyberware],
      specialAttributes: { edge: 3, essence: 5.2 },
    });

    // Trying to "upgrade" from alpha to standard (which is a downgrade)
    const result = upgradeAugmentationGrade(char, "cyber-1", "standard", true);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("INVALID_GRADE_UPGRADE");
    }
  });

  it("returns error for non-existent item", () => {
    const char = createTestCharacter();

    const result = upgradeAugmentationGrade(char, "non-existent", "alpha", true);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.code).toBe("NOT_FOUND");
    }
  });

  it("upgrades bioware grade", () => {
    const bioware: BiowareItem = {
      id: "bio-1",
      catalogId: "muscle-toner",
      name: "Muscle Toner",
      category: "basic",
      grade: "standard",
      baseEssenceCost: 0.5,
      essenceCost: 0.5,
      cost: 8000,
      availability: 8,
    };
    const char = createTestCharacter({
      bioware: [bioware],
      specialAttributes: { edge: 3, essence: 5.5 },
    });

    const result = upgradeAugmentationGrade(char, "bio-1", "alpha", false);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.upgradedItem.grade).toBe("alpha");
      // Alpha bioware = 0.8 multiplier
      expect(result.upgradedItem.essenceCost).toBe(0.4); // 0.5 * 0.8
      expect(result.essenceRefund).toBe(0.1); // 0.5 - 0.4
    }
  });
});

// =============================================================================
// WIRELESS BONUS TESTS
// =============================================================================

describe("toggleGlobalWirelessBonus", () => {
  it("enables wireless bonuses", () => {
    const char = createTestCharacter({ wirelessBonusesEnabled: false });

    const result = toggleGlobalWirelessBonus(char, true);

    expect(result.wirelessBonusesEnabled).toBe(true);
  });

  it("disables wireless bonuses", () => {
    const char = createTestCharacter({ wirelessBonusesEnabled: true });

    const result = toggleGlobalWirelessBonus(char, false);

    expect(result.wirelessBonusesEnabled).toBe(false);
  });
});

describe("getWirelessBonusState", () => {
  it("returns true by default", () => {
    const char = createTestCharacter();

    expect(getWirelessBonusState(char)).toBe(true);
  });

  it("returns explicit false when set", () => {
    const char = createTestCharacter({ wirelessBonusesEnabled: false });

    expect(getWirelessBonusState(char)).toBe(false);
  });

  it("returns explicit true when set", () => {
    const char = createTestCharacter({ wirelessBonusesEnabled: true });

    expect(getWirelessBonusState(char)).toBe(true);
  });
});

describe("aggregateActiveWirelessBonuses", () => {
  it("returns empty when wireless disabled", () => {
    const char = createTestCharacter({
      wirelessBonusesEnabled: false,
      cyberware: [
        {
          catalogId: "smartgun",
          name: "Smartgun System",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.2,
          essenceCost: 0.2,
          cost: 500,
          availability: 4,
          wirelessBonus: "+2 dice pool bonus",
        } as CyberwareItem,
      ],
    });

    const result = aggregateActiveWirelessBonuses(char);

    expect(result.enabled).toBe(false);
    expect(result.bonuses).toHaveLength(0);
    expect(result.descriptions).toHaveLength(0);
  });

  it("aggregates wireless bonuses when enabled", () => {
    const char = createTestCharacter({
      wirelessBonusesEnabled: true,
      cyberware: [
        {
          catalogId: "smartgun",
          name: "Smartgun System",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.2,
          essenceCost: 0.2,
          cost: 500,
          availability: 4,
          wirelessBonus: "+2 dice pool bonus",
        } as CyberwareItem,
        {
          catalogId: "reaction-enhancers",
          name: "Reaction Enhancers",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.3,
          essenceCost: 0.3,
          cost: 10000,
          availability: 8,
          wirelessBonus: "+1 REA",
        } as CyberwareItem,
      ],
    });

    const result = aggregateActiveWirelessBonuses(char);

    expect(result.enabled).toBe(true);
    expect(result.bonuses).toHaveLength(2);
    // Note: CyberwareItem only has wirelessBonus as a string description,
    // not structured numeric bonuses. Numeric aggregation would require
    // catalog lookup or extended type support.
    expect(result.totalAttributeBonuses).toEqual({});
    expect(result.totalInitiativeDiceBonus).toBe(0);
    expect(result.descriptions).toHaveLength(2);
    expect(result.descriptions).toContain("Smartgun System: +2 dice pool bonus");
    expect(result.descriptions).toContain("Reaction Enhancers: +1 REA");
  });

  it("uses default enabled when not set", () => {
    const char = createTestCharacter({
      // wirelessBonusesEnabled not set (defaults to true)
      cyberware: [
        {
          catalogId: "datajack",
          name: "Datajack",
          category: "headware",
          grade: "standard",
          baseEssenceCost: 0.1,
          essenceCost: 0.1,
          cost: 1000,
          availability: 2,
          wirelessBonus: "Direct neural interface",
        } as CyberwareItem,
      ],
    });

    const result = aggregateActiveWirelessBonuses(char);

    expect(result.enabled).toBe(true);
    expect(result.bonuses).toHaveLength(1);
  });
});

// =============================================================================
// BONUS AGGREGATION TESTS
// =============================================================================

describe("aggregateAugmentationBonuses", () => {
  it("returns empty bonuses for character without augmentations", () => {
    const char = createTestCharacter();

    const result = aggregateAugmentationBonuses(char);

    expect(result.attributes).toEqual({});
    expect(result.initiativeDice).toBe(0);
    expect(result.armorBonus).toBe(0);
  });

  it("aggregates attribute bonuses from cyberware", () => {
    const char = createTestCharacter({
      cyberware: [
        {
          catalogId: "muscle-replacement",
          name: "Muscle Replacement",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 1.0,
          essenceCost: 1.0,
          cost: 5000,
          availability: 8,
          attributeBonuses: { str: 2, agi: 2 },
        } as CyberwareItem,
      ],
    });

    const result = aggregateAugmentationBonuses(char);

    expect(result.attributes.str).toBe(2);
    expect(result.attributes.agi).toBe(2);
  });

  it("aggregates attribute bonuses from bioware", () => {
    const char = createTestCharacter({
      bioware: [
        {
          catalogId: "muscle-toner",
          name: "Muscle Toner",
          category: "basic",
          grade: "standard",
          baseEssenceCost: 0.4,
          essenceCost: 0.4,
          cost: 8000,
          availability: 8,
          attributeBonuses: { agi: 2 },
        } as BiowareItem,
      ],
    });

    const result = aggregateAugmentationBonuses(char);

    expect(result.attributes.agi).toBe(2);
  });

  it("sums bonuses from multiple augmentations", () => {
    const char = createTestCharacter({
      cyberware: [
        {
          catalogId: "cyber-1",
          name: "Cyber 1",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 5000,
          availability: 8,
          attributeBonuses: { str: 1 },
          initiativeDiceBonus: 1,
        } as CyberwareItem,
        {
          catalogId: "cyber-2",
          name: "Cyber 2",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 5000,
          availability: 8,
          attributeBonuses: { str: 2 },
          initiativeDiceBonus: 2,
        } as CyberwareItem,
      ],
    });

    const result = aggregateAugmentationBonuses(char);

    expect(result.attributes.str).toBe(3);
    expect(result.initiativeDice).toBe(3);
  });

  it("includes initiative dice bonuses from cyberware", () => {
    const char = createTestCharacter({
      cyberware: [
        {
          catalogId: "wired-reflexes",
          name: "Wired Reflexes 2",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 3.0,
          essenceCost: 3.0,
          cost: 32000,
          availability: 12,
          initiativeDiceBonus: 2,
        } as CyberwareItem,
      ],
    });

    const result = aggregateAugmentationBonuses(char);

    expect(result.initiativeDice).toBe(2);
  });

  it("includes base attribute bonuses (wireless is descriptive only)", () => {
    const char = createTestCharacter({
      wirelessBonusesEnabled: true,
      cyberware: [
        {
          catalogId: "reaction-enhancers",
          name: "Reaction Enhancers",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.3,
          essenceCost: 0.3,
          cost: 10000,
          availability: 8,
          attributeBonuses: { rea: 1 },
          wirelessBonus: "+1 REA wireless bonus", // String description only
        } as CyberwareItem,
      ],
    });

    const result = aggregateAugmentationBonuses(char);

    // Base attribute bonus from cyberware
    // Note: Wireless bonuses are string descriptions in current type model
    expect(result.attributes.rea).toBe(1);
  });

  it("excludes wireless bonuses when disabled", () => {
    const char = createTestCharacter({
      wirelessBonusesEnabled: false,
      cyberware: [
        {
          catalogId: "reaction-enhancers",
          name: "Reaction Enhancers",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.3,
          essenceCost: 0.3,
          cost: 10000,
          availability: 8,
          attributeBonuses: { rea: 1 },
          wirelessBonus: "+1 REA wireless",
        } as CyberwareItem,
      ],
    });

    const result = aggregateAugmentationBonuses(char);

    // Base attribute bonuses still apply even with wireless disabled
    expect(result.attributes.rea).toBe(1);
  });
});
