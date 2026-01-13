/**
 * Augmentation Validation Engine Tests
 *
 * Tests for validating augmentation installations including:
 * - Essence viability
 * - Availability restrictions
 * - Attribute bonus limits
 * - Mutual exclusivity rules
 */

import { describe, it, expect } from "vitest";
import {
  validateAugmentationInstall,
  validateAvailabilityConstraint,
  validateAttributeBonusLimit,
  validateMutualExclusion,
  aggregateAttributeBonuses,
  canInstallAugmentation,
  getValidationErrorSummary,
  DEFAULT_AUGMENTATION_RULES,
  type ValidationContext,
  type AugmentationValidationResult,
} from "../validation";
import type { Character, CyberwareItem, BiowareItem } from "@/lib/types/character";
import type { CyberwareCatalogItem, BiowareCatalogItem } from "@/lib/types/edition";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createTestCharacter(overrides: Partial<Character> = {}): Partial<Character> {
  return {
    specialAttributes: {
      edge: 3,
      essence: 6.0,
    },
    cyberware: [],
    bioware: [],
    ...overrides,
  };
}

function createTestCyberware(overrides: Partial<CyberwareCatalogItem> = {}): CyberwareCatalogItem {
  return {
    id: "test-cyberware",
    name: "Test Cyberware",
    category: "bodyware",
    essenceCost: 0.5,
    cost: 1000,
    availability: 4,
    restricted: false,
    forbidden: false,
    description: "A test item",
    ...overrides,
  } as CyberwareCatalogItem;
}

function createTestBioware(overrides: Partial<BiowareCatalogItem> = {}): BiowareCatalogItem {
  return {
    id: "test-bioware",
    name: "Test Bioware",
    category: "bioware",
    essenceCost: 0.3,
    cost: 2000,
    availability: 6,
    restricted: false,
    forbidden: false,
    description: "A test bioware item",
    ...overrides,
  } as BiowareCatalogItem;
}

function createCreationContext(overrides: Partial<ValidationContext> = {}): ValidationContext {
  return {
    lifecycleStage: "creation",
    rules: DEFAULT_AUGMENTATION_RULES,
    ...overrides,
  };
}

function createActiveContext(overrides: Partial<ValidationContext> = {}): ValidationContext {
  return {
    lifecycleStage: "active",
    rules: DEFAULT_AUGMENTATION_RULES,
    ...overrides,
  };
}

// =============================================================================
// MAIN VALIDATION FUNCTION
// =============================================================================

describe("validateAugmentationInstall", () => {
  describe("basic validation", () => {
    it("validates a valid cyberware installation", () => {
      const char = createTestCharacter();
      const item = createTestCyberware({ essenceCost: 0.5, availability: 4 });
      const context = createCreationContext();

      const result = validateAugmentationInstall(char, item, "standard", undefined, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("validates a valid bioware installation", () => {
      const char = createTestCharacter();
      const item = createTestBioware({ essenceCost: 0.3, availability: 6 });
      const context = createCreationContext();

      const result = validateAugmentationInstall(char, item, "standard", undefined, context);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("fails when essence would be depleted", () => {
      const char = createTestCharacter({
        specialAttributes: { edge: 3, essence: 1.0 },
        cyberware: [
          {
            catalogId: "existing",
            name: "Existing",
            category: "bodyware",
            grade: "standard",
            baseEssenceCost: 5.0,
            essenceCost: 5.0,
            cost: 1000,
            availability: 4,
          } as CyberwareItem,
        ],
      });
      const item = createTestCyberware({ essenceCost: 1.5 });
      const context = createCreationContext();

      const result = validateAugmentationInstall(char, item, "standard", undefined, context);

      expect(result.valid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.code === "ESSENCE_INSUFFICIENT" || e.code === "ESSENCE_WOULD_KILL"
        )
      ).toBe(true);
    });
  });

  describe("with ratings", () => {
    it("validates rated augmentation with valid rating", () => {
      const char = createTestCharacter();
      const item = createTestCyberware({
        hasRating: true,
        maxRating: 6,
        essenceCost: 0.1,
      });
      const context = createCreationContext();

      const result = validateAugmentationInstall(char, item, "standard", 3, context);

      expect(result.valid).toBe(true);
    });

    it("fails with rating on non-rated augmentation", () => {
      const char = createTestCharacter();
      const item = createTestCyberware({ hasRating: false });
      const context = createCreationContext();

      const result = validateAugmentationInstall(char, item, "standard", 3, context);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "INVALID_RATING")).toBe(true);
    });

    it("fails with rating outside valid range", () => {
      const char = createTestCharacter();
      const item = createTestCyberware({
        hasRating: true,
        maxRating: 3,
      });
      const context = createCreationContext();

      const result = validateAugmentationInstall(char, item, "standard", 5, context);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "INVALID_RATING")).toBe(true);
    });
  });

  describe("with different grades", () => {
    it("calculates essence correctly for alpha grade", () => {
      const char = createTestCharacter();
      // Alpha grade multiplies essence by 0.8
      const item = createTestCyberware({ essenceCost: 1.0, availability: 4 });
      const context = createCreationContext();

      const result = validateAugmentationInstall(char, item, "alpha", undefined, context);

      expect(result.valid).toBe(true);
    });

    it("accounts for grade availability modifier", () => {
      const char = createTestCharacter();
      // Alpha adds +2 to availability, so 11 + 2 = 13 > 12
      const item = createTestCyberware({ essenceCost: 0.5, availability: 11 });
      const context = createCreationContext();

      const result = validateAugmentationInstall(char, item, "alpha", undefined, context);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "AVAILABILITY_EXCEEDED")).toBe(true);
    });
  });
});

// =============================================================================
// AVAILABILITY VALIDATION
// =============================================================================

describe("validateAvailabilityConstraint", () => {
  describe("at character creation", () => {
    it("allows availability at or below max", () => {
      const result = validateAvailabilityConstraint(12, "standard", undefined, "creation", 12);
      expect(result.valid).toBe(true);
    });

    it("blocks availability above max", () => {
      const result = validateAvailabilityConstraint(13, "standard", undefined, "creation", 12);
      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe("AVAILABILITY_EXCEEDED");
    });

    it("accounts for grade availability modifier", () => {
      // Alpha adds +2, so 11 + 2 = 13 > 12
      const result = validateAvailabilityConstraint(11, "alpha", undefined, "creation", 12);
      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe("AVAILABILITY_EXCEEDED");
    });

    it("blocks restricted items without override", () => {
      const result = validateAvailabilityConstraint(8, "standard", "restricted", "creation", 12);
      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe("AVAILABILITY_RESTRICTED");
    });

    it("allows restricted items with override", () => {
      const result = validateAvailabilityConstraint(
        8,
        "standard",
        "restricted",
        "creation",
        12,
        true,
        false
      );
      expect(result.valid).toBe(true);
    });

    it("blocks forbidden items", () => {
      const result = validateAvailabilityConstraint(8, "standard", "forbidden", "creation", 12);
      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe("AVAILABILITY_FORBIDDEN");
    });

    it("allows forbidden items with override", () => {
      const result = validateAvailabilityConstraint(
        8,
        "standard",
        "forbidden",
        "creation",
        12,
        false,
        true
      );
      expect(result.valid).toBe(true);
    });
  });

  describe("in active play", () => {
    it("allows any availability during active play", () => {
      const result = validateAvailabilityConstraint(20, "standard", undefined, "active", 12);
      expect(result.valid).toBe(true);
    });

    it("allows restricted items during active play", () => {
      const result = validateAvailabilityConstraint(8, "standard", "restricted", "active", 12);
      expect(result.valid).toBe(true);
    });

    it("still blocks forbidden items during active play", () => {
      const result = validateAvailabilityConstraint(8, "standard", "forbidden", "active", 12);
      expect(result.valid).toBe(false);
      expect(result.error?.code).toBe("AVAILABILITY_FORBIDDEN");
    });
  });
});

// =============================================================================
// ATTRIBUTE BONUS VALIDATION
// =============================================================================

describe("validateAttributeBonusLimit", () => {
  it("allows bonuses within limit", () => {
    const char = createTestCharacter();
    const newBonuses = { str: 2 };

    const result = validateAttributeBonusLimit(char, newBonuses, 4);

    expect(result.valid).toBe(true);
  });

  it("blocks bonuses exceeding limit", () => {
    const char = createTestCharacter();
    const newBonuses = { str: 5 };

    const result = validateAttributeBonusLimit(char, newBonuses, 4);

    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe("ATTRIBUTE_BONUS_EXCEEDED");
  });

  it("considers existing bonuses from cyberware", () => {
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
    // Adding 3 more str would exceed 4 (2 + 3 = 5)
    const newBonuses = { str: 3 };

    const result = validateAttributeBonusLimit(char, newBonuses, 4);

    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe("ATTRIBUTE_BONUS_EXCEEDED");
    expect(result.error?.details?.totalBonus).toBe(5);
  });

  it("considers existing bonuses from bioware", () => {
    const char = createTestCharacter({
      bioware: [
        {
          catalogId: "muscle-toner",
          name: "Muscle Toner",
          category: "basic",
          grade: "standard",
          baseEssenceCost: 0.4,
          essenceCost: 0.4,
          cost: 10000,
          availability: 6,
          attributeBonuses: { agi: 2 },
        } as BiowareItem,
      ],
    });
    // Adding 3 more agi would exceed 4 (2 + 3 = 5)
    const newBonuses = { agi: 3 };

    const result = validateAttributeBonusLimit(char, newBonuses, 4);

    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe("ATTRIBUTE_BONUS_EXCEEDED");
  });

  it("allows bonuses that reach exactly the limit", () => {
    const char = createTestCharacter({
      cyberware: [
        {
          catalogId: "existing",
          name: "Existing",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 1000,
          availability: 4,
          attributeBonuses: { str: 2 },
        } as CyberwareItem,
      ],
    });
    const newBonuses = { str: 2 }; // 2 + 2 = 4, exactly at limit

    const result = validateAttributeBonusLimit(char, newBonuses, 4);

    expect(result.valid).toBe(true);
  });

  it("validates multiple attributes separately", () => {
    const char = createTestCharacter();
    const newBonuses = { str: 4, agi: 4 };

    const result = validateAttributeBonusLimit(char, newBonuses, 4);

    expect(result.valid).toBe(true);
  });
});

describe("aggregateAttributeBonuses", () => {
  it("returns empty object for character with no augmentations", () => {
    const char = createTestCharacter();

    const result = aggregateAttributeBonuses(char);

    expect(result).toEqual({});
  });

  it("aggregates cyberware bonuses", () => {
    const char = createTestCharacter({
      cyberware: [
        {
          catalogId: "a",
          name: "A",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 1000,
          availability: 4,
          attributeBonuses: { str: 2 },
        } as CyberwareItem,
        {
          catalogId: "b",
          name: "B",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 1000,
          availability: 4,
          attributeBonuses: { str: 1, agi: 2 },
        } as CyberwareItem,
      ],
    });

    const result = aggregateAttributeBonuses(char);

    expect(result.str).toBe(3);
    expect(result.agi).toBe(2);
  });

  it("aggregates bioware bonuses", () => {
    const char = createTestCharacter({
      bioware: [
        {
          catalogId: "muscle-toner",
          name: "Muscle Toner",
          category: "basic",
          grade: "standard",
          baseEssenceCost: 0.4,
          essenceCost: 0.4,
          cost: 5000,
          availability: 6,
          attributeBonuses: { agi: 2 },
        } as BiowareItem,
      ],
    });

    const result = aggregateAttributeBonuses(char);

    expect(result.agi).toBe(2);
  });

  it("combines cyberware and bioware bonuses", () => {
    const char = createTestCharacter({
      cyberware: [
        {
          catalogId: "cyber",
          name: "Cyber",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 1000,
          availability: 4,
          attributeBonuses: { str: 2 },
        } as CyberwareItem,
      ],
      bioware: [
        {
          catalogId: "bio",
          name: "Bio",
          category: "basic",
          grade: "standard",
          baseEssenceCost: 0.4,
          essenceCost: 0.4,
          cost: 5000,
          availability: 6,
          attributeBonuses: { str: 1, agi: 2 },
        } as BiowareItem,
      ],
    });

    const result = aggregateAttributeBonuses(char);

    expect(result.str).toBe(3);
    expect(result.agi).toBe(2);
  });
});

// =============================================================================
// MUTUAL EXCLUSION VALIDATION
// =============================================================================

describe("validateMutualExclusion", () => {
  it("allows non-conflicting augmentation", () => {
    const char = createTestCharacter({
      cyberware: [
        {
          catalogId: "datajack",
          name: "Datajack",
          category: "headware",
          grade: "standard",
          baseEssenceCost: 0.1,
          essenceCost: 0.1,
          cost: 500,
          availability: 2,
        } as CyberwareItem,
      ],
    });
    const item = createTestCyberware({ id: "cybereyes" });

    const result = validateMutualExclusion(char, item);

    expect(result.valid).toBe(true);
  });

  it("blocks muscle replacement when muscle toner is installed", () => {
    const char = createTestCharacter({
      bioware: [
        {
          catalogId: "muscle-toner",
          name: "Muscle Toner",
          category: "basic",
          grade: "standard",
          baseEssenceCost: 0.4,
          essenceCost: 0.4,
          cost: 10000,
          availability: 6,
        } as BiowareItem,
      ],
    });
    const item = createTestCyberware({ id: "muscle-replacement", name: "Muscle Replacement" });

    const result = validateMutualExclusion(char, item);

    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe("MUTUAL_EXCLUSION");
    expect(result.error?.message).toContain("Muscle Replacement");
    expect(result.error?.message).toContain("Muscle Toner");
  });

  it("blocks wired reflexes when synaptic booster is installed", () => {
    const char = createTestCharacter({
      bioware: [
        {
          catalogId: "synaptic-booster",
          name: "Synaptic Booster",
          category: "cultured",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 50000,
          availability: 10,
        } as BiowareItem,
      ],
    });
    const item = createTestCyberware({ id: "wired-reflexes", name: "Wired Reflexes" });

    const result = validateMutualExclusion(char, item);

    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe("MUTUAL_EXCLUSION");
  });

  it("blocks bone lacing variants from stacking", () => {
    const char = createTestCharacter({
      cyberware: [
        {
          catalogId: "bone-lacing-aluminum",
          name: "Bone Lacing (Aluminum)",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 1.0,
          essenceCost: 1.0,
          cost: 15000,
          availability: 8,
        } as CyberwareItem,
      ],
    });
    const item = createTestCyberware({
      id: "bone-lacing-titanium",
      name: "Bone Lacing (Titanium)",
    });

    const result = validateMutualExclusion(char, item);

    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe("MUTUAL_EXCLUSION");
  });
});

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

describe("canInstallAugmentation", () => {
  it("returns true for valid installation", () => {
    const char = createTestCharacter();
    const item = createTestCyberware();
    const context = createCreationContext();

    const result = canInstallAugmentation(char, item, "standard", undefined, context);

    expect(result).toBe(true);
  });

  it("returns false for invalid installation", () => {
    const char = createTestCharacter();
    const item = createTestCyberware({ availability: 20 });
    const context = createCreationContext();

    const result = canInstallAugmentation(char, item, "standard", undefined, context);

    expect(result).toBe(false);
  });
});

describe("getValidationErrorSummary", () => {
  it("returns success message for valid result", () => {
    const result: AugmentationValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    };

    const summary = getValidationErrorSummary(result);

    expect(summary).toBe("Installation is valid.");
  });

  it("concatenates error messages", () => {
    const result: AugmentationValidationResult = {
      valid: false,
      errors: [
        { code: "ESSENCE_INSUFFICIENT", message: "Not enough essence." },
        { code: "AVAILABILITY_EXCEEDED", message: "Availability too high." },
      ],
      warnings: [],
    };

    const summary = getValidationErrorSummary(result);

    expect(summary).toContain("Not enough essence.");
    expect(summary).toContain("Availability too high.");
  });
});

// =============================================================================
// LOW ESSENCE WARNINGS
// =============================================================================

describe("warnings", () => {
  it("warns when essence would drop to 1 or below", () => {
    const char = createTestCharacter({
      specialAttributes: { edge: 3, essence: 2.0 },
      cyberware: [
        {
          catalogId: "existing",
          name: "Existing",
          category: "bodyware",
          grade: "standard",
          baseEssenceCost: 4.0,
          essenceCost: 4.0,
          cost: 1000,
          availability: 4,
        } as CyberwareItem,
      ],
    });
    const item = createTestCyberware({ essenceCost: 1.0 }); // Would leave 1.0 essence
    const context = createCreationContext();

    const result = validateAugmentationInstall(char, item, "standard", undefined, context);

    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.code === "LOW_ESSENCE")).toBe(true);
  });
});
