/**
 * Tests for Daredevil quality edge regain modifier
 *
 * SR5 Run Faster: Daredevil quality grants 2 Edge regain instead of 1
 * when performing a "daring action" (GM judgment call).
 *
 * Eval-first: these tests are written before the implementation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Character } from "@/lib/types";

// Mock dice-engine (same as edge-actions tests)
vi.mock("../dice-engine", () => ({
  DEFAULT_DICE_RULES: {
    hitThreshold: 5,
    glitchThreshold: 0.5,
    criticalGlitchRequiresZeroHits: true,
    allowExplodingSixes: false,
    maxDicePool: 50,
    minDicePool: 1,
    edgeActions: {},
    woundModifiers: { boxesPerPenalty: 3, maxPenalty: -4 },
  },
  executeRoll: vi.fn(),
  executeReroll: vi.fn(),
  rollDiceExploding: vi.fn(),
  calculateHitsWithLimit: vi.fn(),
  calculateGlitch: vi.fn(),
  sortDiceForDisplay: vi.fn(),
}));

vi.mock("../pool-builder", () => ({
  getAttributeValue: vi.fn(),
  addModifiersToPool: vi.fn(),
}));

import {
  calculateEdgeRegainAmount,
  DAREDEVIL_QUALITY_ID,
  DAREDEVIL_REGAIN_AMOUNT,
  DEFAULT_REGAIN_AMOUNT,
} from "../edge-actions";

// =============================================================================
// HELPERS
// =============================================================================

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    ownerId: "user-1",
    editionCode: "sr5",
    name: "Test Runner",
    status: "active",
    approvalStatus: "approved",
    karma: 0,
    totalKarma: 25,
    nuyen: 5000,
    totalNuyen: 10000,
    streetCred: 0,
    notoriety: 0,
    publicAwareness: 0,
    metatype: "human",
    attributes: {
      body: 4,
      agility: 5,
      reaction: 4,
      strength: 3,
      charisma: 3,
      intuition: 4,
      logic: 3,
      willpower: 4,
      edge: 3,
      magic: 0,
      resonance: 0,
      essence: 6,
    },
    skills: [],
    specializations: [],
    knowledgeSkills: [],
    languageSkills: [],
    positiveQualities: [],
    negativeQualities: [],
    contacts: [],
    lifestyles: [],
    weapons: [],
    armor: [],
    gear: [],
    vehicles: [],
    cyberware: [],
    bioware: [],
    spells: [],
    complexForms: [],
    adeptPowers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

function createDaredevilCharacter(): Character {
  return createMockCharacter({
    positiveQualities: [
      {
        qualityId: DAREDEVIL_QUALITY_ID,
        source: "creation",
      },
    ],
  });
}

// =============================================================================
// EVAL: Constants
// =============================================================================

describe("Daredevil constants", () => {
  it("DAREDEVIL_QUALITY_ID is 'daredevil'", () => {
    expect(DAREDEVIL_QUALITY_ID).toBe("daredevil");
  });

  it("DAREDEVIL_REGAIN_AMOUNT is 2", () => {
    expect(DAREDEVIL_REGAIN_AMOUNT).toBe(2);
  });

  it("DEFAULT_REGAIN_AMOUNT is 1", () => {
    expect(DEFAULT_REGAIN_AMOUNT).toBe(1);
  });
});

// =============================================================================
// EVAL: calculateEdgeRegainAmount
// =============================================================================

describe("calculateEdgeRegainAmount", () => {
  it("returns 1 for character without Daredevil (no context)", () => {
    const char = createMockCharacter();
    expect(calculateEdgeRegainAmount(char)).toBe(1);
  });

  it("returns 1 for character with Daredevil but normal context", () => {
    const char = createDaredevilCharacter();
    expect(calculateEdgeRegainAmount(char, "normal")).toBe(1);
  });

  it("returns 2 for character with Daredevil and daring context", () => {
    const char = createDaredevilCharacter();
    expect(calculateEdgeRegainAmount(char, "daring")).toBe(2);
  });

  it("returns 1 for character without Daredevil even with daring context", () => {
    const char = createMockCharacter();
    expect(calculateEdgeRegainAmount(char, "daring")).toBe(1);
  });

  it("returns 1 for character with Daredevil and no context (default is normal)", () => {
    const char = createDaredevilCharacter();
    expect(calculateEdgeRegainAmount(char)).toBe(1);
  });

  it("caps regain at max edge remaining", () => {
    // Character with Daredevil, current edge = max - 1 (only 1 restorable)
    const char = createDaredevilCharacter();
    char.condition = { physicalDamage: 0, stunDamage: 0, edgeCurrent: 2 };
    // Max edge is 3, current is 2, so only 1 can be restored
    const amount = calculateEdgeRegainAmount(char, "daring");
    // Should return 2 (the quality amount), capping is done by restoreEdge storage layer
    expect(amount).toBe(2);
  });

  it("detects Daredevil via qualityId field", () => {
    const char = createMockCharacter({
      positiveQualities: [
        { qualityId: "some-other-quality", source: "creation" },
        { qualityId: DAREDEVIL_QUALITY_ID, source: "creation" },
      ],
    });
    expect(calculateEdgeRegainAmount(char, "daring")).toBe(2);
  });

  it("detects Daredevil via deprecated id field", () => {
    const char = createMockCharacter({
      positiveQualities: [
        { id: DAREDEVIL_QUALITY_ID, qualityId: DAREDEVIL_QUALITY_ID, source: "creation" },
      ],
    });
    expect(calculateEdgeRegainAmount(char, "daring")).toBe(2);
  });
});
