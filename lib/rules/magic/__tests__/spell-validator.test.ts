/**
 * Spell Validator Tests
 *
 * Tests for spell allocation and adept power validation.
 */

import { describe, it, expect } from "vitest";
import {
  validateSpellAllocation,
  validateAdeptPowerAllocation,
  isSpellCompatible,
  getSpellDefinition,
  getAdeptPowerDefinition,
  extractSpellsCatalog,
  getAllSpells,
  getSpellsByCategory,
} from "../spell-validator";
import type { Character, AdeptPower } from "@/lib/types/character";
import type {
  LoadedRuleset,
  SpellData,
  SpellsCatalogData,
  AdeptPowerCatalogItem,
} from "../../loader-types";
import type { BookPayload } from "@/lib/types/edition";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockSpell(overrides: Partial<SpellData> = {}): SpellData {
  return {
    id: "acid-stream",
    name: "Acid Stream",
    category: "combat",
    type: "physical",
    range: "LOS",
    duration: "instant",
    drain: "F-3",
    description: "Test spell",
    ...overrides,
  };
}

function createMockAdeptPower(
  overrides: Partial<AdeptPowerCatalogItem> = {}
): AdeptPowerCatalogItem {
  return {
    id: "improved-reflexes",
    name: "Improved Reflexes",
    cost: 1.5,
    costType: "perLevel",
    maxLevel: 3,
    activation: "free",
    description: "Test power",
    ...overrides,
  };
}

function createMockRuleset(
  spells?: SpellsCatalogData,
  adeptPowers?: AdeptPowerCatalogItem[]
): LoadedRuleset {
  // We use type assertions here because we're creating minimal mock objects
  // that satisfy the parts of the interfaces our tests actually use
  return {
    edition: {} as LoadedRuleset["edition"],
    books: [
      {
        id: "core-rulebook",
        title: "Core Rulebook",
        isCore: true,
        loadOrder: 0,
        payload: {
          meta: {
            id: "core-rulebook",
            editionCode: "sr5",
            name: "Core Rulebook",
            category: "core",
            releaseYear: 2013,
          },
          modules: {
            magic: spells
              ? {
                  mergeStrategy: "override" as const,
                  payload: { spells },
                }
              : undefined,
            adeptPowers: adeptPowers
              ? {
                  mergeStrategy: "override" as const,
                  payload: { powers: adeptPowers },
                }
              : undefined,
          },
        } as unknown as BookPayload,
      },
    ],
    creationMethods: [],
  } as LoadedRuleset;
}

function createMockCharacter(
  overrides: Partial<Character> = {}
): Partial<Character> {
  return {
    id: "test-character",
    name: "Test Character",
    magicalPath: "full-mage",
    specialAttributes: {
      edge: 3,
      essence: 6,
      magic: 4,
      resonance: 0,
    },
    attributes: {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 2,
      willpower: 4,
      logic: 5,
      intuition: 3,
      charisma: 3,
    },
    ...overrides,
  };
}

function createMockAdeptPowerInstance(
  overrides: Partial<AdeptPower> = {}
): AdeptPower {
  return {
    id: "power-1",
    catalogId: "killing-hands",
    name: "Killing Hands",
    powerPointCost: 0.5,
    ...overrides,
  };
}

// =============================================================================
// VALIDATE SPELL ALLOCATION
// =============================================================================

describe("validateSpellAllocation", () => {
  const spellsCatalog: SpellsCatalogData = {
    combat: [
      createMockSpell({ id: "acid-stream", name: "Acid Stream" }),
      createMockSpell({ id: "fireball", name: "Fireball" }),
    ],
    detection: [
      createMockSpell({
        id: "detect-enemies",
        name: "Detect Enemies",
        category: "detection",
      }),
    ],
    health: [
      createMockSpell({ id: "heal", name: "Heal", category: "health" }),
    ],
    illusion: [
      createMockSpell({
        id: "invisibility",
        name: "Invisibility",
        category: "illusion",
      }),
    ],
    manipulation: [
      createMockSpell({
        id: "levitate",
        name: "Levitate",
        category: "manipulation",
      }),
    ],
  };
  const mockRuleset = createMockRuleset(spellsCatalog, []);

  it("should validate spell allocation within budget", () => {
    const character = createMockCharacter({ magicalPath: "full-mage" });
    const result = validateSpellAllocation(
      character,
      ["acid-stream", "fireball"],
      5,
      mockRuleset
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.budgetRemaining).toBe(3);
    expect(result.budgetTotal).toBe(5);
  });

  it("should reject spells exceeding budget", () => {
    const character = createMockCharacter();
    const result = validateSpellAllocation(
      character,
      ["acid-stream", "fireball", "heal", "invisibility"],
      3,
      mockRuleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "SPELL_LIMIT_EXCEEDED" })
    );
  });

  it("should reject non-existent spells", () => {
    const character = createMockCharacter();
    const result = validateSpellAllocation(
      character,
      ["acid-stream", "nonexistent-spell"],
      5,
      mockRuleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "SPELLS_NOT_FOUND" })
    );
  });

  it("should reject duplicate spells", () => {
    const character = createMockCharacter();
    const result = validateSpellAllocation(
      character,
      ["acid-stream", "acid-stream"],
      5,
      mockRuleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "DUPLICATE_SPELLS" })
    );
  });

  it("should reject character who cannot cast spells", () => {
    const character = createMockCharacter({ magicalPath: "adept" });
    const result = validateSpellAllocation(
      character,
      ["acid-stream"],
      5,
      mockRuleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "CANNOT_CAST_SPELLS" })
    );
  });

  it("should calculate budget remaining correctly", () => {
    const character = createMockCharacter();
    const result = validateSpellAllocation(
      character,
      ["acid-stream", "fireball", "heal"],
      10,
      mockRuleset
    );

    expect(result.budgetRemaining).toBe(7);
  });
});

// =============================================================================
// VALIDATE ADEPT POWER ALLOCATION
// =============================================================================

describe("validateAdeptPowerAllocation", () => {
  const adeptPowers: AdeptPowerCatalogItem[] = [
    createMockAdeptPower({
      id: "improved-reflexes",
      name: "Improved Reflexes",
      cost: 1.5,
      costType: "perLevel",
      maxLevel: 3,
    }),
    createMockAdeptPower({
      id: "killing-hands",
      name: "Killing Hands",
      cost: 0.5,
      costType: "fixed",
    }),
    createMockAdeptPower({
      id: "improved-ability",
      name: "Improved Ability",
      cost: 0.5,
      costType: "perLevel",
      requiresSkill: true,
    }),
  ];
  const mockRuleset = createMockRuleset(undefined, adeptPowers);

  it("should validate power allocation within budget", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
    });
    const powers: AdeptPower[] = [
      createMockAdeptPowerInstance({
        id: "kh-1",
        catalogId: "killing-hands",
        name: "Killing Hands",
        powerPointCost: 0.5,
      }),
    ];

    const result = validateAdeptPowerAllocation(
      character,
      powers,
      4,
      mockRuleset
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.budgetRemaining).toBe(3.5);
  });

  it("should calculate per-level costs correctly", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 6, resonance: 0 },
    });
    const powers: AdeptPower[] = [
      createMockAdeptPowerInstance({
        id: "ir-1",
        catalogId: "improved-reflexes",
        name: "Improved Reflexes",
        rating: 2,
        powerPointCost: 3,
      }),
    ];

    // 1.5 * 2 = 3 PP
    const result = validateAdeptPowerAllocation(
      character,
      powers,
      6,
      mockRuleset
    );

    expect(result.valid).toBe(true);
    expect(result.budgetRemaining).toBe(3);
  });

  it("should reject powers exceeding budget", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
    });
    const powers: AdeptPower[] = [
      createMockAdeptPowerInstance({
        id: "ir-1",
        catalogId: "improved-reflexes",
        name: "Improved Reflexes",
        rating: 3,
        powerPointCost: 4.5,
      }),
    ];

    // 1.5 * 3 = 4.5 PP > 4
    const result = validateAdeptPowerAllocation(
      character,
      powers,
      4,
      mockRuleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "POWER_POINTS_EXCEEDED" })
    );
  });

  it("should reject powers exceeding max level", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 6, resonance: 0 },
    });
    const powers: AdeptPower[] = [
      createMockAdeptPowerInstance({
        id: "ir-1",
        catalogId: "improved-reflexes",
        name: "Improved Reflexes",
        rating: 5,
        powerPointCost: 7.5,
      }),
    ];

    const result = validateAdeptPowerAllocation(
      character,
      powers,
      10,
      mockRuleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "POWER_LEVEL_EXCEEDED" })
    );
  });

  it("should reject power requiring skill without specification", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
    });
    const powers: AdeptPower[] = [
      createMockAdeptPowerInstance({
        id: "ia-1",
        catalogId: "improved-ability",
        name: "Improved Ability",
        rating: 1,
        powerPointCost: 0.5,
      }),
    ];

    const result = validateAdeptPowerAllocation(
      character,
      powers,
      4,
      mockRuleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "POWER_REQUIRES_SKILL" })
    );
  });

  it("should accept power with required specification", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
    });
    const powers: AdeptPower[] = [
      createMockAdeptPowerInstance({
        id: "ia-1",
        catalogId: "improved-ability",
        name: "Improved Ability",
        rating: 1,
        powerPointCost: 0.5,
        specification: "Pistols",
      }),
    ];

    const result = validateAdeptPowerAllocation(
      character,
      powers,
      4,
      mockRuleset
    );

    expect(result.valid).toBe(true);
  });

  it("should reject non-existent power", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
    });
    const powers: AdeptPower[] = [
      createMockAdeptPowerInstance({
        id: "np-1",
        catalogId: "nonexistent-power",
        name: "Nonexistent Power",
        powerPointCost: 1,
      }),
    ];

    const result = validateAdeptPowerAllocation(
      character,
      powers,
      4,
      mockRuleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "POWER_NOT_FOUND" })
    );
  });

  it("should reject character who cannot use adept powers", () => {
    const character = createMockCharacter({ magicalPath: "full-mage" });
    const powers: AdeptPower[] = [
      createMockAdeptPowerInstance(),
    ];

    const result = validateAdeptPowerAllocation(
      character,
      powers,
      4,
      mockRuleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "CANNOT_USE_POWERS" })
    );
  });
});

// =============================================================================
// IS SPELL COMPATIBLE
// =============================================================================

describe("isSpellCompatible", () => {
  const spellsCatalog: SpellsCatalogData = {
    combat: [createMockSpell({ id: "acid-stream" })],
    detection: [],
    health: [],
    illusion: [],
    manipulation: [],
  };
  const mockRuleset = createMockRuleset(spellsCatalog, []);

  it("should return true for compatible spell", () => {
    const character = createMockCharacter({ magicalPath: "full-mage" });
    expect(isSpellCompatible("acid-stream", character, mockRuleset)).toBe(true);
  });

  it("should return false for non-existent spell", () => {
    const character = createMockCharacter({ magicalPath: "full-mage" });
    expect(isSpellCompatible("nonexistent", character, mockRuleset)).toBe(
      false
    );
  });

  it("should return false for character who cannot cast spells", () => {
    const character = createMockCharacter({ magicalPath: "adept" });
    expect(isSpellCompatible("acid-stream", character, mockRuleset)).toBe(
      false
    );
  });
});

// =============================================================================
// GET SPELL DEFINITION
// =============================================================================

describe("getSpellDefinition", () => {
  const spellsCatalog: SpellsCatalogData = {
    combat: [createMockSpell({ id: "acid-stream", name: "Acid Stream" })],
    detection: [
      createMockSpell({
        id: "detect-enemies",
        name: "Detect Enemies",
        category: "detection",
      }),
    ],
    health: [],
    illusion: [],
    manipulation: [],
  };
  const mockRuleset = createMockRuleset(spellsCatalog, []);

  it("should find spell in specific category", () => {
    const spell = getSpellDefinition("acid-stream", "combat", mockRuleset);
    expect(spell).toBeDefined();
    expect(spell?.name).toBe("Acid Stream");
  });

  it("should find spell across all categories", () => {
    const spell = getSpellDefinition("detect-enemies", undefined, mockRuleset);
    expect(spell).toBeDefined();
    expect(spell?.name).toBe("Detect Enemies");
  });

  it("should return null for non-existent spell", () => {
    const spell = getSpellDefinition("nonexistent", undefined, mockRuleset);
    expect(spell).toBeNull();
  });
});

// =============================================================================
// GET ADEPT POWER DEFINITION
// =============================================================================

describe("getAdeptPowerDefinition", () => {
  const adeptPowers: AdeptPowerCatalogItem[] = [
    createMockAdeptPower({ id: "improved-reflexes", name: "Improved Reflexes" }),
  ];
  const mockRuleset = createMockRuleset(undefined, adeptPowers);

  it("should find power by ID", () => {
    const power = getAdeptPowerDefinition("improved-reflexes", mockRuleset);
    expect(power).toBeDefined();
    expect(power?.name).toBe("Improved Reflexes");
  });

  it("should return null for non-existent power", () => {
    const power = getAdeptPowerDefinition("nonexistent", mockRuleset);
    expect(power).toBeNull();
  });
});

// =============================================================================
// CATALOG EXTRACTION
// =============================================================================

describe("extractSpellsCatalog", () => {
  it("should extract spells from ruleset", () => {
    const spellsCatalog: SpellsCatalogData = {
      combat: [createMockSpell({ id: "fireball" })],
      detection: [
        createMockSpell({ id: "detect-enemies", category: "detection" }),
      ],
      health: [],
      illusion: [],
      manipulation: [],
    };
    const mockRuleset = createMockRuleset(spellsCatalog, []);

    const result = extractSpellsCatalog(mockRuleset);
    expect(result.combat).toHaveLength(1);
    expect(result.detection).toHaveLength(1);
  });

  it("should return empty catalogs if no spells module", () => {
    const mockRuleset = createMockRuleset(undefined, []);
    const result = extractSpellsCatalog(mockRuleset);

    expect(result.combat).toHaveLength(0);
    expect(result.detection).toHaveLength(0);
  });
});

describe("getAllSpells", () => {
  it("should return all spells from all categories", () => {
    const spellsCatalog: SpellsCatalogData = {
      combat: [createMockSpell({ id: "fireball" })],
      detection: [
        createMockSpell({ id: "detect-enemies", category: "detection" }),
      ],
      health: [createMockSpell({ id: "heal", category: "health" })],
      illusion: [],
      manipulation: [],
    };
    const mockRuleset = createMockRuleset(spellsCatalog, []);

    const result = getAllSpells(mockRuleset);
    expect(result).toHaveLength(3);
  });
});

describe("getSpellsByCategory", () => {
  it("should return spells for specified category", () => {
    const spellsCatalog: SpellsCatalogData = {
      combat: [
        createMockSpell({ id: "fireball" }),
        createMockSpell({ id: "acid-stream" }),
      ],
      detection: [],
      health: [],
      illusion: [],
      manipulation: [],
    };
    const mockRuleset = createMockRuleset(spellsCatalog, []);

    const result = getSpellsByCategory("combat", mockRuleset);
    expect(result).toHaveLength(2);
  });
});
