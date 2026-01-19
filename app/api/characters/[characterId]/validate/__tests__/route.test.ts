/**
 * Integration tests for Validate Character API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/validate - Validate a character without persisting changes
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
}));

vi.mock("@/lib/storage/campaigns", () => ({
  getCampaignById: vi.fn(),
}));

vi.mock("@/lib/rules/merge", () => ({
  loadAndMergeRuleset: vi.fn(),
}));

vi.mock("@/lib/rules/loader", () => ({
  loadCreationMethod: vi.fn(),
}));

vi.mock("@/lib/rules/validation", () => ({
  validateCharacter: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { loadCreationMethod } from "@/lib/rules/loader";
import { validateCharacter } from "@/lib/rules/validation";
import { POST } from "../route";
import type { Character } from "@/lib/types";
import type { Campaign } from "@/lib/types/campaign";
import type { CharacterValidationResult, ValidationIssue } from "@/lib/rules/validation/types";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-789";
const TEST_CAMPAIGN_ID = "test-campaign-111";

const mockRuleset = {
  edition: { code: "sr5", name: "Shadowrun 5th Edition" },
};

const mockCampaign: Campaign = {
  id: TEST_CAMPAIGN_ID,
  title: "Test Campaign",
  gmId: "test-gm-456",
  editionId: "sr5-edition-id",
  editionCode: "sr5",
  enabledBookIds: ["core-rulebook"],
  enabledCreationMethodIds: ["priority"],
  gameplayLevel: "street",
  status: "active",
  playerIds: [TEST_USER_ID],
  visibility: "private",
  advancementSettings: {
    trainingTimeMultiplier: 1.0,
    attributeKarmaMultiplier: 5,
    skillKarmaMultiplier: 2,
    skillGroupKarmaMultiplier: 5,
    knowledgeSkillKarmaMultiplier: 1,
    specializationKarmaCost: 7,
    spellKarmaCost: 5,
    complexFormKarmaCost: 4,
    attributeRatingCap: 10,
    skillRatingCap: 13,
    allowInstantAdvancement: false,
    requireApproval: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Runner",
    status: "draft",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 3,
      intuition: 3,
      charisma: 3,
    },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    ...overrides,
  } as Character;
}

function createMockRequest(body: Record<string, unknown> = {}): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/validate`;
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function createMockRequestWithoutBody(): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/validate`;
  return new NextRequest(url, {
    method: "POST",
  });
}

function createValidationResult(
  overrides: Partial<CharacterValidationResult> = {}
): CharacterValidationResult {
  return {
    valid: true,
    errors: [],
    warnings: [],
    completeness: {
      steps: [],
      budgets: [],
      percentage: 100,
      readyForFinalization: true,
    },
    ...overrides,
  };
}

function createValidationIssue(
  code: string,
  message: string,
  severity: "error" | "warning" = "error"
): ValidationIssue {
  return { code, message, severity };
}

// =============================================================================
// AUTHENTICATION TESTS
// =============================================================================

describe("POST /api/characters/[characterId]/validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });
  });

  // ===========================================================================
  // RESOURCE NOT FOUND TESTS
  // ===========================================================================

  describe("Resource not found", () => {
    it("should return 404 when character doesn't exist", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  // ===========================================================================
  // RULESET ERROR TESTS
  // ===========================================================================

  describe("Ruleset loading", () => {
    it("should return 500 when ruleset fails to load", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: false,
        error: "Failed to load ruleset",
      });

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to load ruleset");
    });

    it("should return 500 with default error when ruleset has no error message", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: false,
      });

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to load ruleset");
    });
  });

  // ===========================================================================
  // VALIDATION MODE TESTS
  // ===========================================================================

  describe("Validation modes", () => {
    it("should use default mode (creation) when not specified", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: "creation",
        })
      );
    });

    it("should use finalization mode when specified", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest({ mode: "finalization" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: "finalization",
        })
      );
    });

    it("should use step mode with stepId when specified", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest({ mode: "step", stepId: "attributes" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: "step",
        })
      );
    });

    it("should use advancement mode when specified", async () => {
      const mockChar = createMockCharacter({ status: "active" });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest({ mode: "advancement" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: "advancement",
        })
      );
    });
  });

  // ===========================================================================
  // UPDATES MERGE TESTS
  // ===========================================================================

  describe("Updates merge", () => {
    it("should validate with partial updates merged into character", async () => {
      const mockChar = createMockCharacter({ name: "Original Name" });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest({ updates: { name: "Updated Name" } });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          character: expect.objectContaining({
            name: "Updated Name",
          }),
        })
      );
    });

    it("should handle empty request body gracefully", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should handle invalid JSON body by using defaults", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/validate`;
      const request = new NextRequest(url, {
        method: "POST",
        body: "not valid json",
        headers: { "Content-Type": "application/json" },
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // Should use default mode "creation" when JSON parsing fails
      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: "creation",
        })
      );
    });

    it("should validate original character when no updates provided", async () => {
      const mockChar = createMockCharacter({ name: "Original Name" });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          character: expect.objectContaining({
            name: "Original Name",
          }),
        })
      );
    });
  });

  // ===========================================================================
  // CAMPAIGN CONTEXT TESTS
  // ===========================================================================

  describe("Campaign context", () => {
    it("should include campaign validation when character is in campaign", async () => {
      const mockChar = createMockCharacter({ campaignId: TEST_CAMPAIGN_ID });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(getCampaignById).mockResolvedValue(mockCampaign);
      vi.mocked(validateCharacter).mockResolvedValue(
        createValidationResult({
          campaign: {
            inCampaign: true,
            requiresApproval: true,
            booksValid: true,
            violations: [],
          },
        })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.validation.campaign).toBeDefined();
      expect(data.validation.campaign.inCampaign).toBe(true);
      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          campaign: mockCampaign,
        })
      );
    });

    it("should handle campaign not found gracefully", async () => {
      const mockChar = createMockCharacter({ campaignId: TEST_CAMPAIGN_ID });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(getCampaignById).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          campaign: undefined,
        })
      );
    });

    it("should not load campaign when character has no campaignId", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(getCampaignById).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // VALIDATION RESULTS TESTS
  // ===========================================================================

  describe("Validation results", () => {
    it("should return validation errors when character is invalid", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(
        createValidationResult({
          valid: false,
          errors: [
            createValidationIssue("ATTR_INCOMPLETE", "Attributes not complete"),
            createValidationIssue("SKILL_MISSING", "No skills selected"),
          ],
          completeness: {
            steps: [],
            budgets: [],
            percentage: 30,
            readyForFinalization: false,
          },
        })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.validation.valid).toBe(false);
      expect(data.validation.errors).toHaveLength(2);
      expect(data.validation.errors[0].code).toBe("ATTR_INCOMPLETE");
      expect(data.validation.errors[1].code).toBe("SKILL_MISSING");
    });

    it("should return warnings for non-blocking issues", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(
        createValidationResult({
          valid: true,
          warnings: [
            createValidationIssue("LOW_KARMA", "Low starting karma", "warning"),
            createValidationIssue("NO_CONTACTS", "No contacts selected", "warning"),
          ],
        })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.validation.valid).toBe(true);
      expect(data.validation.warnings).toHaveLength(2);
      expect(data.validation.warnings[0].code).toBe("LOW_KARMA");
    });

    it("should return completeness metrics", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(
        createValidationResult({
          valid: true,
          completeness: {
            steps: [
              {
                stepId: "metatype",
                stepTitle: "Metatype",
                complete: true,
                errors: [],
                warnings: [],
              },
              {
                stepId: "attributes",
                stepTitle: "Attributes",
                complete: false,
                errors: [createValidationIssue("ATTR_INCOMPLETE", "Not all points spent")],
                warnings: [],
              },
            ],
            budgets: [
              {
                budgetId: "attribute-points",
                budgetLabel: "Attribute Points",
                total: 20,
                spent: 15,
                remaining: 5,
                complete: false,
                overspent: false,
              },
            ],
            percentage: 75,
            readyForFinalization: false,
          },
        })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.validation.completeness.percentage).toBe(75);
      expect(data.validation.completeness.readyForFinalization).toBe(false);
      expect(data.validation.completeness.steps).toHaveLength(2);
      expect(data.validation.completeness.budgets).toHaveLength(1);
    });

    it("should return valid response when character is complete", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.validation.valid).toBe(true);
      expect(data.validation.errors).toHaveLength(0);
      expect(data.validation.warnings).toHaveLength(0);
      expect(data.validation.completeness.percentage).toBe(100);
      expect(data.validation.completeness.readyForFinalization).toBe(true);
    });
  });

  // ===========================================================================
  // CREATION METHOD TESTS
  // ===========================================================================

  describe("Creation method loading", () => {
    it("should pass creation method to validator when available", async () => {
      const mockChar = createMockCharacter();
      const mockCreationMethod = {
        id: "priority",
        name: "Priority System",
        editionCode: "sr5",
        priorities: {},
      };
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(mockCreationMethod as never);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(loadCreationMethod).toHaveBeenCalledWith("sr5", "priority");
      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          creationMethod: mockCreationMethod,
        })
      );
    });

    it("should continue without creation method when not found", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          creationMethod: undefined,
        })
      );
    });

    it("should continue without creation method when loader throws", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockRejectedValue(new Error("Method not found"));
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  // ===========================================================================
  // CREATION STATE TESTS
  // ===========================================================================

  describe("Creation state", () => {
    it("should pass creation state from character metadata to validator", async () => {
      const creationState = {
        currentStepIndex: 2,
        completedSteps: ["metatype", "attributes"],
        selections: {},
      };
      const mockChar = createMockCharacter({
        metadata: { creationState },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          creationState,
        })
      );
    });

    it("should pass undefined creation state when not present", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockResolvedValue(createValidationResult());

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(validateCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          creationState: undefined,
        })
      );
    });
  });

  // ===========================================================================
  // ERROR HANDLING TESTS
  // ===========================================================================

  describe("Error handling", () => {
    it("should return 500 when validateCharacter throws", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateCharacter).mockRejectedValue(new Error("Validation error"));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to validate character");
    });

    it("should return 500 on unexpected error during character retrieval", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockRejectedValue(new Error("Database error"));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to validate character");
    });
  });
});
