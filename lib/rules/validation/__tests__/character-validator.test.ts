/**
 * Tests for character validator
 *
 * Tests the character validation engine including individual validators
 * and main validation functions.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Character, CharacterDraft } from "@/lib/types/character";
import type { MergedRuleset, CreationMethod, Campaign, CreationState } from "@/lib/types";
import {
  validateCharacter,
  validateForFinalization,
  isCharacterValid,
} from "../character-validator";

// Mock the dependencies
vi.mock("../../constraint-validation", () => ({
  validateAllConstraints: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
  validateStep: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
  validateBudgetsComplete: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
  getMetatypeAttributeLimits: vi.fn(() => null),
}));

vi.mock("../../qualities", () => ({
  validateAllQualities: vi.fn(() => ({ valid: true, errors: [] })),
  validateKarmaLimits: vi.fn(() => ({
    valid: true,
    errors: [],
    positiveTotal: 0,
    negativeTotal: 0,
    positiveExceeded: false,
    negativeExceeded: false,
  })),
}));

vi.mock("../../skills/free-skills", () => ({
  canDesignateForFreeSkill: vi.fn(() => ({ canDesignate: true })),
  getFreeSkillAllocationStatus: vi.fn(() => []),
}));

vi.mock("../../contacts", () => ({
  getMaxConnection: vi.fn((editionCode: string) => (editionCode === "sr6" ? 6 : 12)),
  getMaxLoyalty: vi.fn(() => 6),
  calculateContactPoints: vi.fn(
    (contact: { connection: number; loyalty: number }) => contact.connection + contact.loyalty
  ),
}));

// Import mocked functions
import { getMetatypeAttributeLimits, validateAllConstraints } from "../../constraint-validation";
import { validateKarmaLimits, validateAllQualities } from "../../qualities";

// Helper to create minimal Character for testing
function createMinimalCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "test-char",
    userId: "test-user",
    name: "Test Character",
    editionCode: "sr5",
    metatype: "human",
    attributes: { bod: 3, agi: 3, rea: 3, str: 3, wil: 3, log: 3, int: 3, cha: 3 },
    specialAttributes: { edge: 2, essence: 6 },
    magicalPath: "mundane",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    identities: [{ id: "sin-1", name: "Fake SIN", type: "fake", rating: 4 }],
    lifestyles: [{ id: "ls-1", name: "Middle", level: "middle", months: 1, cost: 5000 }],
    ...overrides,
  } as Character;
}

// Helper to create minimal CharacterDraft for testing
function createMinimalDraft(overrides: Partial<CharacterDraft> = {}): CharacterDraft {
  return {
    id: "test-draft",
    userId: "test-user",
    editionCode: "sr5",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as CharacterDraft;
}

// Helper to create minimal MergedRuleset
function createMinimalRuleset(overrides: Partial<MergedRuleset> = {}): MergedRuleset {
  return {
    snapshotId: "test-snapshot",
    editionId: "sr5",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {},
    createdAt: new Date().toISOString(),
    ...overrides,
  } as MergedRuleset;
}

// Helper to create minimal CreationMethod
function createMinimalCreationMethod(overrides: Partial<CreationMethod> = {}): CreationMethod {
  return {
    id: "priority",
    name: "Priority System",
    description: "Standard SR5 priority creation",
    editionCode: "sr5",
    steps: [],
    budgets: [],
    constraints: [],
    ...overrides,
  } as CreationMethod;
}

// Helper to create minimal Campaign
function createMinimalCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: "campaign-1",
    gmId: "gm-user",
    title: "Test Campaign",
    status: "active",
    editionId: "sr5",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "experienced",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Campaign;
}

// Helper to create minimal CreationState
function createMinimalCreationState(overrides: Partial<CreationState> = {}): CreationState {
  return {
    characterId: "test-char",
    creationMethodId: "priority",
    currentStep: 0,
    completedSteps: [],
    budgets: {},
    selections: {} as CreationState["selections"],
    errors: [],
    warnings: [],
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("Character Validator", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getMetatypeAttributeLimits).mockReturnValue(null);
    vi.mocked(validateAllConstraints).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(validateKarmaLimits).mockReturnValue({
      valid: true,
      errors: [],
      positiveTotal: 0,
      negativeTotal: 0,
      positiveExceeded: false,
      negativeExceeded: false,
    });
    vi.mocked(validateAllQualities).mockReturnValue({ valid: true, errors: [] });
  });

  // ===========================================================================
  // BASIC INFO VALIDATOR
  // ===========================================================================

  describe("basicInfoValidator (via validateCharacter)", () => {
    it("should return error when name is missing", async () => {
      const character = createMinimalCharacter({ name: "" });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_NAME",
          field: "name",
        })
      );
    });

    it("should return error when name is only whitespace", async () => {
      const character = createMinimalCharacter({ name: "   " });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ code: "MISSING_NAME" }));
    });

    it("should return error when metatype is missing", async () => {
      const character = createMinimalCharacter({ metatype: "" });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_METATYPE",
          field: "metatype",
        })
      );
    });

    it("should return error when magicalPath is missing", async () => {
      const character = createMinimalCharacter({
        magicalPath: undefined as unknown as Character["magicalPath"],
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_MAGICAL_PATH",
          field: "magicalPath",
        })
      );
    });

    it("should not run basicInfoValidator in creation mode", async () => {
      const character = createMinimalCharacter({ name: "" });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      // Basic info validator only runs in finalization mode
      expect(result.errors).not.toContainEqual(expect.objectContaining({ code: "MISSING_NAME" }));
    });
  });

  // ===========================================================================
  // ATTRIBUTE VALIDATOR
  // ===========================================================================

  describe("attributeValidator (via validateCharacter)", () => {
    it("should return error when no attributes allocated", async () => {
      const character = createMinimalCharacter({ attributes: {} });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_ATTRIBUTES",
          field: "attributes",
        })
      );
    });

    it("should return error when attribute is below minimum", async () => {
      const character = createMinimalCharacter({
        metatype: "troll",
        attributes: { bod: 1 }, // Below troll minimum
      });
      const ruleset = createMinimalRuleset();

      vi.mocked(getMetatypeAttributeLimits).mockReturnValue({
        bod: { min: 5, max: 10 },
      });

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "ATTRIBUTE_BELOW_MIN",
          field: "attributes.bod",
        })
      );
    });

    it("should return error when attribute exceeds maximum", async () => {
      const character = createMinimalCharacter({
        metatype: "human",
        attributes: { agi: 10 }, // Above human maximum
      });
      const ruleset = createMinimalRuleset();

      vi.mocked(getMetatypeAttributeLimits).mockReturnValue({
        agi: { min: 1, max: 6 },
      });

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "ATTRIBUTE_ABOVE_MAX",
          field: "attributes.agi",
        })
      );
    });

    it("should pass when attributes are within limits", async () => {
      const character = createMinimalCharacter({
        metatype: "human",
        attributes: { bod: 3, agi: 4 },
      });
      const ruleset = createMinimalRuleset();

      vi.mocked(getMetatypeAttributeLimits).mockReturnValue({
        bod: { min: 1, max: 6 },
        agi: { min: 1, max: 6 },
      });

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "ATTRIBUTE_BELOW_MIN" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "ATTRIBUTE_ABOVE_MAX" })
      );
    });
  });

  // ===========================================================================
  // IDENTITY VALIDATOR
  // ===========================================================================

  describe("identityValidator (via validateCharacter)", () => {
    it("should return error when no identities", async () => {
      const character = createMinimalCharacter({ identities: [] });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_IDENTITY",
          field: "identities",
        })
      );
    });

    it("should return error when no lifestyles", async () => {
      const character = createMinimalCharacter({ lifestyles: [] });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_LIFESTYLE",
          field: "lifestyles",
        })
      );
    });

    it("should pass when identities and lifestyles exist", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_IDENTITY" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_LIFESTYLE" })
      );
    });
  });

  // ===========================================================================
  // MAGIC VALIDATOR
  // ===========================================================================

  describe("magicValidator (via validateCharacter)", () => {
    it("should return no issues for mundane characters", async () => {
      const character = createMinimalCharacter({ magicalPath: "mundane" });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.warnings).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_TRADITION" })
      );
    });

    it("should return warning when full-mage has no tradition in creation mode", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        tradition: undefined,
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: "MISSING_TRADITION",
          field: "tradition",
          severity: "warning",
        })
      );
    });

    it("should return error when full-mage has no tradition at finalization", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        tradition: undefined,
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_TRADITION",
          field: "tradition",
          severity: "error",
        })
      );
    });

    it("should return error when mystic-adept has no tradition at finalization", async () => {
      const character = createMinimalCharacter({
        magicalPath: "mystic-adept",
        tradition: undefined,
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_TRADITION",
          field: "tradition",
          severity: "error",
        })
      );
    });

    it("should return error when aspected-mage has no tradition at finalization", async () => {
      const character = createMinimalCharacter({
        magicalPath: "aspected-mage",
        tradition: undefined,
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_TRADITION",
          field: "tradition",
          severity: "error",
        })
      );
    });

    it("should not return MISSING_TRADITION when tradition is set", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        tradition: "hermetic",
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_TRADITION" })
      );
      expect(result.warnings).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_TRADITION" })
      );
    });

    it("should resolve MISSING_TRADITION via creationState selections", async () => {
      // During creation, character.magicalPath may not be set — use creationState
      const character = createMinimalCharacter({
        magicalPath: "mundane", // Not yet mapped from selections
        tradition: undefined,
      });
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          "magical-path": "magician", // selection value, maps to "full-mage"
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "finalization",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_TRADITION",
          field: "tradition",
          severity: "error",
        })
      );
    });

    it("should not return MISSING_TRADITION when tradition is in creationState", async () => {
      const character = createMinimalCharacter({
        magicalPath: "mundane",
        tradition: undefined,
      });
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          "magical-path": "magician",
          tradition: "hermetic",
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "finalization",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_TRADITION" })
      );
      expect(result.warnings).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_TRADITION" })
      );
    });

    it("should not return MISSING_TRADITION for adept at finalization", async () => {
      const character = createMinimalCharacter({
        magicalPath: "adept",
        tradition: undefined,
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_TRADITION" })
      );
      expect(result.warnings).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_TRADITION" })
      );
    });

    it("should return warning when adept has no powers", async () => {
      const character = createMinimalCharacter({
        magicalPath: "adept",
        adeptPowers: [],
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: "NO_ADEPT_POWERS",
          field: "adeptPowers",
        })
      );
    });

    it("should return warning when mage has no spells", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        spells: [],
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: "NO_SPELLS",
          field: "spells",
        })
      );
    });

    it("should return warning when technomancer has no complex forms", async () => {
      const character = createMinimalCharacter({
        magicalPath: "technomancer",
        complexForms: [],
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: "NO_COMPLEX_FORMS",
          field: "complexForms",
        })
      );
    });

    it("should return error when mystic-adept has Counterspelling skill", async () => {
      const character = createMinimalCharacter({
        magicalPath: "mystic-adept",
        skills: { counterspelling: 3 },
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MYSTIC_ADEPT_RESTRICTED_SKILL",
          field: "skills.counterspelling",
          severity: "error",
        })
      );
    });

    it("should not return error when magician has Counterspelling skill", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        skills: { counterspelling: 3 },
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({
          code: "MYSTIC_ADEPT_RESTRICTED_SKILL",
        })
      );
    });
  });

  // ===========================================================================
  // QUALITY VALIDATOR
  // ===========================================================================

  describe("qualityValidator (via validateCharacter)", () => {
    it("should report karma limit exceeded errors", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();

      vi.mocked(validateKarmaLimits).mockReturnValue({
        valid: false,
        errors: [],
        positiveTotal: 30,
        negativeTotal: 25,
        positiveExceeded: true,
        negativeExceeded: false,
      });

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "POSITIVE_KARMA_EXCEEDED",
          field: "positiveQualities",
        })
      );
    });

    it("should report negative karma exceeded errors", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();

      vi.mocked(validateKarmaLimits).mockReturnValue({
        valid: false,
        errors: [],
        positiveTotal: 20,
        negativeTotal: 30,
        positiveExceeded: false,
        negativeExceeded: true,
      });

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "NEGATIVE_KARMA_EXCEEDED",
          field: "negativeQualities",
        })
      );
    });

    it("should report quality validation errors", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();

      vi.mocked(validateAllQualities).mockReturnValue({
        valid: false,
        errors: [
          {
            qualityId: "PREREQ_MISSING",
            message: "Quality requires Body 5+",
            field: "positiveQualities",
          },
        ],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "PREREQ_MISSING",
          message: "Quality requires Body 5+",
        })
      );
    });
  });

  // ===========================================================================
  // CAMPAIGN VALIDATOR
  // ===========================================================================

  describe("campaignValidator (via validateCharacter)", () => {
    it("should skip validation when no campaign", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "DISABLED_BOOKS_USED" })
      );
    });

    it("should report disabled books usage", async () => {
      const character = createMinimalCharacter({
        campaignId: "campaign-1",
        attachedBookIds: ["core-rulebook", "street-grimoire"],
      });
      const ruleset = createMinimalRuleset();
      const campaign = createMinimalCampaign({
        enabledBookIds: ["core-rulebook"], // street-grimoire not enabled
      });

      const result = await validateCharacter({
        character,
        ruleset,
        campaign,
        mode: "finalization",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "DISABLED_BOOKS_USED",
          field: "attachedBookIds",
        })
      );
    });

    it("should pass when all books are enabled", async () => {
      const character = createMinimalCharacter({
        campaignId: "campaign-1",
        attachedBookIds: ["core-rulebook"],
      });
      const ruleset = createMinimalRuleset();
      const campaign = createMinimalCampaign({
        enabledBookIds: ["core-rulebook", "run-faster"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        campaign,
        mode: "finalization",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "DISABLED_BOOKS_USED" })
      );
    });
  });

  // ===========================================================================
  // MAIN VALIDATION FUNCTIONS
  // ===========================================================================

  describe("validateCharacter", () => {
    it("should return valid: true when no errors", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return valid: false when errors exist", async () => {
      const character = createMinimalCharacter({ name: "" });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should run constraint validation when creationMethod provided", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationMethod = createMinimalCreationMethod();
      const creationState = createMinimalCreationState();

      await validateCharacter({
        character,
        ruleset,
        creationMethod,
        creationState,
        mode: "finalization",
      });

      expect(validateAllConstraints).toHaveBeenCalled();
    });

    it("should include completeness information", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationMethod = createMinimalCreationMethod({
        steps: [
          { id: "step-1", title: "Step 1" },
          { id: "step-2", title: "Step 2" },
        ],
        budgets: [{ id: "karma", label: "Karma", initialValue: 25 }],
      } as unknown as CreationMethod);
      const creationState = createMinimalCreationState({
        budgets: { karma: 10 },
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationMethod,
        creationState,
        mode: "finalization",
      });

      expect(result.completeness).toBeDefined();
      expect(result.completeness.steps).toHaveLength(2);
      expect(result.completeness.budgets).toHaveLength(1);
      expect(result.completeness.percentage).toBeDefined();
      expect(result.completeness.readyForFinalization).toBeDefined();
    });

    it("should include campaign info when campaign provided", async () => {
      const character = createMinimalCharacter({ campaignId: "campaign-1" });
      const ruleset = createMinimalRuleset();
      const campaign = createMinimalCampaign();

      const result = await validateCharacter({
        character,
        ruleset,
        campaign,
        mode: "finalization",
      });

      expect(result.campaign).toBeDefined();
      expect(result.campaign?.inCampaign).toBe(true);
      expect(result.campaign?.requiresApproval).toBe(true);
    });
  });

  // ===========================================================================
  // CONVENIENCE FUNCTIONS
  // ===========================================================================

  describe("validateForFinalization", () => {
    it("should use finalization mode", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();

      const result = await validateForFinalization(character, ruleset);

      // Finalization mode runs basicInfoValidator
      // If character is valid with name, it should pass
      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
    });

    it("should accept optional parameters", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationMethod = createMinimalCreationMethod();
      const creationState = createMinimalCreationState();
      const campaign = createMinimalCampaign();

      const result = await validateForFinalization(
        character,
        ruleset,
        creationMethod,
        creationState,
        campaign
      );

      expect(result).toBeDefined();
    });
  });

  describe("isCharacterValid", () => {
    it("should return true for valid character", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();

      const result = await isCharacterValid(character, ruleset);

      expect(result).toBe(true);
    });

    it("should return false for invalid character", async () => {
      const character = createMinimalCharacter({ name: "", metatype: "" });
      const ruleset = createMinimalRuleset();

      const result = await isCharacterValid(character, ruleset);

      expect(result).toBe(false);
    });

    it("should use finalization mode by default", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();

      // With default mode (finalization), basic info validator runs
      const result = await isCharacterValid(character, ruleset);

      expect(result).toBe(true);
    });

    it("should accept custom validation mode", async () => {
      const draft = createMinimalDraft();
      const ruleset = createMinimalRuleset();

      // Creation mode doesn't require all fields
      const result = await isCharacterValid(draft, ruleset, "creation");

      // Should pass in creation mode as basic info validator is not run
      expect(typeof result).toBe("boolean");
    });
  });

  // ===========================================================================
  // COMPLETENESS CALCULATION
  // ===========================================================================

  describe("completeness calculation", () => {
    it("should calculate budget completeness correctly", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationMethod = createMinimalCreationMethod({
        budgets: [
          { id: "karma", label: "Karma", initialValue: 25 },
          { id: "resources", label: "Resources", initialValue: 100000 },
        ],
      } as unknown as CreationMethod);
      const creationState = createMinimalCreationState({
        budgets: { karma: 5, resources: 50000 },
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationMethod,
        creationState,
        mode: "finalization",
      });

      const karmaBudget = result.completeness.budgets.find((b) => b.budgetId === "karma");
      expect(karmaBudget).toBeDefined();
      expect(karmaBudget?.total).toBe(25);
      expect(karmaBudget?.remaining).toBe(5);
      expect(karmaBudget?.spent).toBe(20);
      expect(karmaBudget?.complete).toBe(true);
      expect(karmaBudget?.overspent).toBe(false);
    });

    it("should detect overspent budgets", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationMethod = createMinimalCreationMethod({
        budgets: [{ id: "karma", label: "Karma", initialValue: 25 }],
      } as unknown as CreationMethod);
      const creationState = createMinimalCreationState({
        budgets: { karma: -5 }, // Overspent
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationMethod,
        creationState,
        mode: "finalization",
      });

      const karmaBudget = result.completeness.budgets.find((b) => b.budgetId === "karma");
      expect(karmaBudget?.overspent).toBe(true);
      expect(karmaBudget?.complete).toBe(false);
    });

    it("should calculate percentage based on completed steps", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationMethod = createMinimalCreationMethod({
        steps: [
          { id: "step-1", title: "Step 1" },
          { id: "step-2", title: "Step 2" },
          { id: "step-3", title: "Step 3" },
          { id: "step-4", title: "Step 4" },
        ],
      } as unknown as CreationMethod);
      const creationState = createMinimalCreationState();

      const result = await validateCharacter({
        character,
        ruleset,
        creationMethod,
        creationState,
        mode: "finalization",
      });

      // Percentage should be based on steps
      expect(result.completeness.percentage).toBeDefined();
      expect(result.completeness.percentage).toBeGreaterThanOrEqual(0);
      expect(result.completeness.percentage).toBeLessThanOrEqual(100);
    });
  });

  // ===========================================================================
  // MENTOR SPIRIT VALIDATOR (Task 1)
  // ===========================================================================

  describe("mentorSpirit validation (via magicValidator)", () => {
    it("should return error when mundane character has mentor spirit", async () => {
      const character = createMinimalCharacter({
        magicalPath: "mundane",
        mentorSpirit: "bear",
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MENTOR_SPIRIT_INVALID_PATH",
          field: "mentorSpirit",
          severity: "error",
        })
      );
    });

    it("should return error when technomancer has mentor spirit", async () => {
      const character = createMinimalCharacter({
        magicalPath: "technomancer",
        mentorSpirit: "bear",
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MENTOR_SPIRIT_TECHNOMANCER",
          field: "mentorSpirit",
          severity: "error",
        })
      );
    });

    it("should not return error when full-mage has mentor spirit", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        mentorSpirit: "bear",
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MENTOR_SPIRIT_INVALID_PATH" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MENTOR_SPIRIT_TECHNOMANCER" })
      );
    });

    it("should not return error when adept has mentor spirit", async () => {
      const character = createMinimalCharacter({
        magicalPath: "adept",
        mentorSpirit: "wolf",
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MENTOR_SPIRIT_INVALID_PATH" })
      );
    });

    it("should return info warning when mage has no mentor spirit at finalization", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        mentorSpirit: undefined,
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "finalization",
      });

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: "NO_MENTOR_SPIRIT",
          field: "mentorSpirit",
          severity: "info",
        })
      );
    });
  });

  // ===========================================================================
  // INITIATION / METAMAGICS VALIDATOR (Task 2)
  // ===========================================================================

  describe("initiation/metamagics validation (via magicValidator)", () => {
    it("should not return error when initiateGrade is 0", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        initiateGrade: 0,
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "INITIATION_AT_CREATION" })
      );
    });

    it("should return error when initiateGrade is > 0 at creation", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        initiateGrade: 1,
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "INITIATION_AT_CREATION",
          field: "initiateGrade",
          severity: "error",
        })
      );
    });

    it("should return error when metamagics are selected at creation", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        metamagics: ["centering"],
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "METAMAGICS_AT_CREATION",
          field: "metamagics",
          severity: "error",
        })
      );
    });

    it("should not check initiation for mundane characters", async () => {
      const character = createMinimalCharacter({
        magicalPath: "mundane",
        initiateGrade: 0,
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "INITIATION_AT_CREATION" })
      );
    });
  });

  // ===========================================================================
  // FREE SKILL VALIDATOR (Task 4)
  // ===========================================================================

  describe("freeSkillValidator (via validateCharacter)", () => {
    it("should return no issues when no free skills needed (mundane)", async () => {
      const character = createMinimalCharacter({ magicalPath: "mundane" });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "FREE_SKILL_WRONG_CATEGORY" })
      );
    });

    it("should return error when non-mage has magical free skill designations", async () => {
      const character = createMinimalCharacter({ magicalPath: "mundane" });
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          freeSkillDesignations: {
            magical: ["spellcasting"],
          },
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "FREE_SKILL_WRONG_CATEGORY",
          severity: "error",
        })
      );
    });

    it("should return error when non-technomancer has resonance free skill designations", async () => {
      const character = createMinimalCharacter({ magicalPath: "full-mage" });
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          freeSkillDesignations: {
            resonance: ["compiling"],
          },
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "FREE_SKILL_WRONG_CATEGORY",
          severity: "error",
        })
      );
    });

    it("should return no error when mage has correct magical skill designations", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        skills: { spellcasting: 5, summoning: 5 },
      });
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          freeSkillDesignations: {
            magical: ["spellcasting", "summoning"],
          },
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "FREE_SKILL_WRONG_CATEGORY" })
      );
    });
  });

  // ===========================================================================
  // CONTACT VALIDATOR (Task 5)
  // ===========================================================================

  describe("contactValidator (via validateCharacter)", () => {
    it("should return no issues when contacts are within limits", async () => {
      const character = createMinimalCharacter({
        contacts: [
          { name: "Fixer", connection: 4, loyalty: 3 },
          { name: "Street Doc", connection: 3, loyalty: 4 },
        ],
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "CONTACT_CONNECTION_EXCEEDED" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "CONTACT_LOYALTY_EXCEEDED" })
      );
    });

    it("should return error when contact connection exceeds max", async () => {
      const character = createMinimalCharacter({
        contacts: [{ name: "Big Boss", connection: 13, loyalty: 3 }],
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "CONTACT_CONNECTION_EXCEEDED",
          severity: "error",
        })
      );
    });

    it("should return error when contact loyalty exceeds max", async () => {
      const character = createMinimalCharacter({
        contacts: [{ name: "BFF", connection: 3, loyalty: 7 }],
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "CONTACT_LOYALTY_EXCEEDED",
          severity: "error",
        })
      );
    });

    it("should warn when total contact points exceed charisma budget", async () => {
      const character = createMinimalCharacter({
        attributes: { cha: 2 }, // CHA 2 × 3 = 6 point budget
        contacts: [
          { name: "Fixer", connection: 4, loyalty: 3 }, // 7 points
        ],
      });
      const ruleset = createMinimalRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: "CONTACT_POINTS_EXCEEDED",
          severity: "warning",
        })
      );
    });
  });

  // ===========================================================================
  // KNOWLEDGE & LANGUAGE VALIDATOR
  // ===========================================================================

  describe("knowledgeLanguageValidator (via validateCharacter)", () => {
    it("should return error when no native language at finalization", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [{ name: "English", rating: 4, isNative: false }],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "finalization",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_NATIVE_LANGUAGE",
          severity: "error",
        })
      );
    });

    it("should return error when no languages at all at finalization", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "finalization",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MISSING_NATIVE_LANGUAGE",
          severity: "error",
        })
      );
    });

    it("should pass with one native language", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [{ name: "English", rating: 0, isNative: true }],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "finalization",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_NATIVE_LANGUAGE" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "TOO_MANY_NATIVE_LANGUAGES" })
      );
    });

    it("should pass with bilingual quality and 2 native languages", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 0, isNative: true },
          ],
          positiveQualities: ["bilingual"],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "TOO_MANY_NATIVE_LANGUAGES" })
      );
      expect(result.warnings).not.toContainEqual(
        expect.objectContaining({ code: "BILINGUAL_REQUIRES_TWO_NATIVE" })
      );
    });

    it("should warn when bilingual quality has only 1 native language", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [{ name: "English", rating: 0, isNative: true }],
          positiveQualities: ["bilingual"],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: "BILINGUAL_REQUIRES_TWO_NATIVE",
          severity: "warning",
        })
      );
    });

    it("should return error with too many native languages (no bilingual)", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 0, isNative: true },
          ],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "TOO_MANY_NATIVE_LANGUAGES",
          severity: "error",
        })
      );
    });

    it("should return error with too many native languages (with bilingual, > 2)", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 0, isNative: true },
            { name: "Spanish", rating: 0, isNative: true },
          ],
          positiveQualities: ["bilingual"],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "TOO_MANY_NATIVE_LANGUAGES",
          severity: "error",
        })
      );
    });

    it("should return error when language rating is below 1", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 0, isNative: false },
          ],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "LANGUAGE_RATING_OUT_OF_RANGE",
          severity: "error",
        })
      );
    });

    it("should return error when language rating is above 6", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 7, isNative: false },
          ],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "LANGUAGE_RATING_OUT_OF_RANGE",
          severity: "error",
        })
      );
    });

    it("should return error when knowledge skill rating is below 1", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [{ name: "English", rating: 0, isNative: true }],
          knowledgeSkills: [{ name: "Corp Politics", category: "street", rating: 0 }],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_SKILL_RATING_OUT_OF_RANGE",
          severity: "error",
        })
      );
    });

    it("should return error when knowledge skill rating is above 6", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [{ name: "English", rating: 0, isNative: true }],
          knowledgeSkills: [{ name: "Corp Politics", category: "street", rating: 8 }],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_SKILL_RATING_OUT_OF_RANGE",
          severity: "error",
        })
      );
    });

    it("should return error when knowledge points are overspent", async () => {
      // INT 3 + LOG 3 = 6, budget = 12
      const character = createMinimalCharacter({
        attributes: { bod: 3, agi: 3, rea: 3, str: 3, wil: 3, log: 3, int: 3, cha: 3 },
      });
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 4, isNative: false },
          ],
          knowledgeSkills: [
            { name: "Corp Politics", category: "street", rating: 5 },
            { name: "Gang Turf", category: "street", rating: 5 },
          ],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      // Total: 4 (Japanese) + 5 + 5 = 14, budget = 12
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "KNOWLEDGE_POINTS_OVERSPENT",
          severity: "error",
        })
      );
    });

    it("should pass when knowledge points are within budget", async () => {
      // INT 3 + LOG 3 = 6, budget = 12
      const character = createMinimalCharacter({
        attributes: { bod: 3, agi: 3, rea: 3, str: 3, wil: 3, log: 3, int: 3, cha: 3 },
      });
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 3, isNative: false },
          ],
          knowledgeSkills: [
            { name: "Corp Politics", category: "street", rating: 4 },
            { name: "Gang Turf", category: "street", rating: 4 },
          ],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      // Total: 3 + 4 + 4 = 11, budget = 12
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "KNOWLEDGE_POINTS_OVERSPENT" })
      );
    });

    it("should pass when languages and knowledge skills are empty", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {} as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      // No knowledge/language errors in creation mode with no data
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "MISSING_NATIVE_LANGUAGE" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "LANGUAGE_RATING_OUT_OF_RANGE" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "KNOWLEDGE_SKILL_RATING_OUT_OF_RANGE" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "KNOWLEDGE_POINTS_OVERSPENT" })
      );
    });

    it("should handle bilingual quality as SelectedQuality object", async () => {
      const character = createMinimalCharacter();
      const ruleset = createMinimalRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          languages: [
            { name: "English", rating: 0, isNative: true },
            { name: "Japanese", rating: 0, isNative: true },
          ],
          positiveQualities: [{ id: "bilingual", karma: 5 }],
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "TOO_MANY_NATIVE_LANGUAGES" })
      );
    });
  });

  // ===========================================================================
  // SPELL VALIDATOR
  // ===========================================================================

  describe("spellValidator (via validateCharacter)", () => {
    // Helper: ruleset with spell catalog and priority table
    function createSpellRuleset(spellLimit = 10) {
      return createMinimalRuleset({
        modules: {
          magic: {
            spells: {
              combat: [
                {
                  id: "stunbolt",
                  name: "Stunbolt",
                  category: "combat",
                  type: "mana",
                  range: "LOS",
                  duration: "instant",
                  drain: "F-3",
                },
                {
                  id: "manabolt",
                  name: "Manabolt",
                  category: "combat",
                  type: "mana",
                  range: "LOS",
                  duration: "instant",
                  drain: "F-3",
                },
                {
                  id: "powerbolt",
                  name: "Powerbolt",
                  category: "combat",
                  type: "physical",
                  range: "LOS",
                  duration: "instant",
                  drain: "F-3",
                },
              ],
              detection: [
                {
                  id: "detect-life",
                  name: "Detect Life",
                  category: "detection",
                  type: "mana",
                  range: "Touch",
                  duration: "sustained",
                  drain: "F-3",
                },
              ],
              health: [
                {
                  id: "heal",
                  name: "Heal",
                  category: "health",
                  type: "mana",
                  range: "Touch",
                  duration: "permanent",
                  drain: "F-4",
                },
              ],
              illusion: [
                {
                  id: "invisibility",
                  name: "Invisibility",
                  category: "illusion",
                  type: "mana",
                  range: "LOS",
                  duration: "sustained",
                  drain: "F-1",
                },
              ],
              manipulation: [
                {
                  id: "levitate",
                  name: "Levitate",
                  category: "manipulation",
                  type: "physical",
                  range: "LOS",
                  duration: "sustained",
                  drain: "F-2",
                },
              ],
            },
          },
          priorities: {
            table: {
              A: {
                metatype: {
                  available: ["human", "elf", "dwarf", "ork", "troll"],
                  specialAttributePoints: { human: 9 },
                },
                magic: {
                  options: [
                    { path: "magician", spells: spellLimit },
                    { path: "mystic-adept", spells: spellLimit },
                  ],
                },
              },
              B: {
                metatype: {
                  available: ["human", "elf", "dwarf", "ork", "troll"],
                  specialAttributePoints: { human: 7 },
                },
                magic: {
                  options: [
                    { path: "magician", spells: 7 },
                    { path: "mystic-adept", spells: 7 },
                    { path: "aspected-mage" },
                  ],
                },
              },
              C: {
                metatype: {
                  available: ["human", "elf", "dwarf", "ork"],
                  specialAttributePoints: { human: 5 },
                },
                magic: { options: [] },
              },
              D: {
                metatype: { available: ["human", "elf"], specialAttributePoints: { human: 3 } },
                magic: { options: [] },
              },
              E: {
                metatype: { available: ["human"], specialAttributePoints: { human: 1 } },
                magic: { options: [] },
              },
            },
          },
        },
      });
    }

    it("should produce no errors for valid spell allocation", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        spells: ["stunbolt", "heal", "invisibility"],
      });
      const ruleset = createSpellRuleset();
      const creationState = createMinimalCreationState({
        priorities: { metatype: "B", attributes: "C", magic: "A", skills: "D", resources: "E" },
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_DUPLICATE" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_NOT_FOUND" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_LIMIT_EXCEEDED" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_ASPECT_RESTRICTED" })
      );
    });

    it("should reject duplicate spell IDs", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        spells: ["stunbolt", "heal", "stunbolt"],
      });
      const ruleset = createSpellRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "SPELL_DUPLICATE",
          field: "spells",
          severity: "error",
        })
      );
    });

    it("should reject unknown spell IDs", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        spells: ["stunbolt", "totally-fake-spell"],
      });
      const ruleset = createSpellRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "SPELL_NOT_FOUND",
          field: "spells",
          severity: "error",
        })
      );
    });

    it("should reject exceeding priority spell limit", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        spells: ["stunbolt", "manabolt", "powerbolt"],
      });
      const ruleset = createSpellRuleset(2); // Limit of 2
      const creationState = createMinimalCreationState({
        priorities: { metatype: "B", attributes: "C", magic: "A", skills: "D", resources: "E" },
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "SPELL_LIMIT_EXCEEDED",
          field: "spells",
          severity: "error",
        })
      );
    });

    it("should reject spells for aspected conjurer", async () => {
      const character = createMinimalCharacter({
        magicalPath: "aspected-mage",
        spells: ["stunbolt"],
      });
      const ruleset = createSpellRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          skillGroups: { conjuring: 4 },
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "SPELL_ASPECT_RESTRICTED",
          field: "spells",
          severity: "error",
        })
      );
    });

    it("should reject spells for aspected enchanter", async () => {
      const character = createMinimalCharacter({
        magicalPath: "aspected-mage",
        spells: ["stunbolt"],
      });
      const ruleset = createSpellRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          skillGroups: { enchanting: 3 },
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "SPELL_ASPECT_RESTRICTED",
          field: "spells",
          severity: "error",
        })
      );
    });

    it("should allow spells for aspected sorcerer", async () => {
      const character = createMinimalCharacter({
        magicalPath: "aspected-mage",
        spells: ["stunbolt", "heal"],
      });
      const ruleset = createSpellRuleset();
      const creationState = createMinimalCreationState({
        selections: {
          skillGroups: { sorcery: 4 },
        } as CreationState["selections"],
      });

      const result = await validateCharacter({
        character,
        ruleset,
        creationState,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_ASPECT_RESTRICTED" })
      );
    });

    it("should allow spells for full-mage", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        spells: ["stunbolt", "heal"],
      });
      const ruleset = createSpellRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_ASPECT_RESTRICTED" })
      );
    });

    it("should allow spells for mystic-adept", async () => {
      const character = createMinimalCharacter({
        magicalPath: "mystic-adept",
        spells: ["stunbolt"],
      });
      const ruleset = createSpellRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_ASPECT_RESTRICTED" })
      );
    });

    it("should skip validation entirely for mundane characters", async () => {
      const character = createMinimalCharacter({
        magicalPath: "mundane",
        spells: ["stunbolt"],
      });
      const ruleset = createSpellRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_DUPLICATE" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_NOT_FOUND" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_LIMIT_EXCEEDED" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_ASPECT_RESTRICTED" })
      );
    });

    it("should skip validation entirely for adept characters", async () => {
      const character = createMinimalCharacter({
        magicalPath: "adept",
        spells: ["stunbolt"],
      });
      const ruleset = createSpellRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_DUPLICATE" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_NOT_FOUND" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_LIMIT_EXCEEDED" })
      );
    });

    it("should skip validation entirely for technomancer characters", async () => {
      const character = createMinimalCharacter({
        magicalPath: "technomancer",
        spells: ["stunbolt"],
      });
      const ruleset = createSpellRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_DUPLICATE" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_NOT_FOUND" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_LIMIT_EXCEEDED" })
      );
    });

    it("should handle CharacterSpell object format", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        spells: [
          { id: "spell-1", catalogId: "stunbolt", name: "Stunbolt" },
          { id: "spell-2", catalogId: "heal", name: "Heal" },
        ],
      });
      const ruleset = createSpellRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_NOT_FOUND" })
      );
      expect(result.errors).not.toContainEqual(
        expect.objectContaining({ code: "SPELL_DUPLICATE" })
      );
    });

    it("should detect duplicates in CharacterSpell object format", async () => {
      const character = createMinimalCharacter({
        magicalPath: "full-mage",
        spells: [
          { id: "spell-1", catalogId: "stunbolt", name: "Stunbolt" },
          { id: "spell-2", catalogId: "stunbolt", name: "Stunbolt" },
        ],
      });
      const ruleset = createSpellRuleset();

      const result = await validateCharacter({
        character,
        ruleset,
        mode: "creation",
      });

      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "SPELL_DUPLICATE",
          field: "spells",
        })
      );
    });
  });
});
