/**
 * Integration tests for Finalize Character API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/finalize - Finalize a draft character
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  updateCharacter: vi.fn(),
}));

vi.mock("@/lib/storage/campaigns", () => ({
  getCampaignById: vi.fn(),
}));

vi.mock("@/lib/auth/character-authorization", () => ({
  authorizeOwnerAccess: vi.fn(),
}));

vi.mock("@/lib/rules/character/state-machine", () => ({
  executeTransition: vi.fn(),
  createAuditEntry: vi.fn(),
  appendAuditEntry: vi.fn(),
}));

vi.mock("@/lib/rules/validation", () => ({
  validateForFinalization: vi.fn(),
}));

vi.mock("@/lib/rules/merge", () => ({
  loadAndMergeRuleset: vi.fn(),
}));

vi.mock("@/lib/rules/loader", () => ({
  loadCreationMethod: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { updateCharacter } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import {
  executeTransition,
  createAuditEntry,
  appendAuditEntry,
} from "@/lib/rules/character/state-machine";
import { validateForFinalization } from "@/lib/rules/validation";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { loadCreationMethod } from "@/lib/rules/loader";
import { POST } from "../route";
import type { Character } from "@/lib/types";
import type { Campaign } from "@/lib/types/campaign";
import type { CharacterAuthResult } from "@/lib/auth/character-authorization";
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

function createMockRequest(): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/finalize`;
  return new NextRequest(url, {
    method: "POST",
  });
}

function createAuthResult(overrides: Partial<CharacterAuthResult> = {}): CharacterAuthResult {
  return {
    authorized: true,
    character: null,
    campaign: null,
    role: "owner",
    permissions: ["view", "edit", "finalize"],
    status: 200,
    ...overrides,
  };
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

describe("POST /api/characters/[characterId]/finalize", () => {
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
  // AUTHORIZATION TESTS
  // ===========================================================================

  describe("Authorization", () => {
    it("should return 403 when user is not owner", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createAuthResult({
          authorized: false,
          error: "Not authorized to access this character",
          status: 403,
          role: "owner",
        })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(
        createAuthResult({
          authorized: false,
          error: "Character not found",
          status: 404,
          role: "owner",
        })
      );

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
  // STATUS VALIDATION TESTS
  // ===========================================================================

  describe("Status validation", () => {
    it("should return 400 when character is not a draft", async () => {
      const mockChar = createMockCharacter({ status: "active" });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character is not a draft");
    });

    it("should return 400 when character is retired", async () => {
      const mockChar = createMockCharacter({ status: "retired" });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character is not a draft");
    });
  });

  // ===========================================================================
  // RULESET TESTS
  // ===========================================================================

  describe("Ruleset loading", () => {
    it("should return 500 when ruleset fails to load", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));
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
  });

  // ===========================================================================
  // VALIDATION TESTS
  // ===========================================================================

  describe("Character validation", () => {
    it("should return 400 when validation fails with errors", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateForFinalization).mockResolvedValue(
        createValidationResult({
          valid: false,
          errors: [createValidationIssue("ATTR_INCOMPLETE", "Attributes not complete")],
          completeness: {
            steps: [],
            budgets: [],
            percentage: 50,
            readyForFinalization: false,
          },
        })
      );

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character validation failed");
      expect(data.validation.errors).toHaveLength(1);
      expect(data.validation.errors[0].code).toBe("ATTR_INCOMPLETE");
    });

    it("should continue when validation passes", async () => {
      const mockChar = createMockCharacter();
      const updatedChar = { ...mockChar, status: "active" as const };
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateForFinalization).mockResolvedValue(createValidationResult());
      vi.mocked(executeTransition).mockResolvedValue({
        success: true,
        character: updatedChar,
        warnings: [],
      });
      vi.mocked(updateCharacter).mockResolvedValue(updatedChar);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(executeTransition).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // CAMPAIGN APPROVAL TESTS
  // ===========================================================================

  describe("Campaign approval", () => {
    it("should return requiresApproval when campaign requires it", async () => {
      const mockChar = createMockCharacter({ campaignId: TEST_CAMPAIGN_ID });
      const updatedChar = { ...mockChar, approvalStatus: "pending" as const };
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(getCampaignById).mockResolvedValue(mockCampaign);
      vi.mocked(validateForFinalization).mockResolvedValue(
        createValidationResult({
          campaign: {
            inCampaign: true,
            requiresApproval: true,
            booksValid: true,
            violations: [],
          },
        })
      );
      vi.mocked(createAuditEntry).mockReturnValue({
        id: "audit-1",
        timestamp: new Date().toISOString(),
        action: "approval_requested",
        actor: { userId: TEST_USER_ID, role: "owner" },
        details: {},
      });
      vi.mocked(appendAuditEntry).mockReturnValue(updatedChar);
      vi.mocked(updateCharacter).mockResolvedValue(updatedChar);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.requiresApproval).toBe(true);
      expect(data.message).toBe("Character submitted for GM approval");
    });
  });

  // ===========================================================================
  // STATE TRANSITION TESTS
  // ===========================================================================

  describe("State transition", () => {
    it("should return 400 when transition fails", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateForFinalization).mockResolvedValue(createValidationResult());
      vi.mocked(executeTransition).mockResolvedValue({
        success: false,
        errors: [{ code: "TRANSITION_INVALID", message: "Invalid transition" }],
        warnings: [],
      });

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("State transition failed");
      expect(data.errors).toBeDefined();
    });

    it("should return 200 on successful transition with audit", async () => {
      const mockChar = createMockCharacter();
      const updatedChar = { ...mockChar, status: "active" as const };
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateForFinalization).mockResolvedValue(
        createValidationResult({
          warnings: [createValidationIssue("WARN_LOW_KARMA", "Low karma", "warning")],
        })
      );
      vi.mocked(executeTransition).mockResolvedValue({
        success: true,
        character: updatedChar,
        warnings: [{ code: "TRANS_WARN", message: "Transition warning" }],
      });
      vi.mocked(updateCharacter).mockResolvedValue(updatedChar);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character).toBeDefined();
      expect(updateCharacter).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, updatedChar);
    });
  });

  // ===========================================================================
  // RESPONSE FORMAT TESTS
  // ===========================================================================

  describe("Response format", () => {
    it("should return combined warnings from validation and transition", async () => {
      const mockChar = createMockCharacter();
      const updatedChar = { ...mockChar, status: "active" as const };
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateForFinalization).mockResolvedValue(
        createValidationResult({
          warnings: [createValidationIssue("VALIDATION_WARN", "Validation warning", "warning")],
        })
      );
      vi.mocked(executeTransition).mockResolvedValue({
        success: true,
        character: updatedChar,
        warnings: [{ code: "TRANS_WARN", message: "Transition warning" }],
      });
      vi.mocked(updateCharacter).mockResolvedValue(updatedChar);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      // Validation warnings are objects, transition warnings are strings
      expect(data.warnings).toHaveLength(2);
    });

    it("should return updated character", async () => {
      const mockChar = createMockCharacter();
      const updatedChar = {
        ...mockChar,
        status: "active" as const,
        updatedAt: new Date().toISOString(),
      };
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockResolvedValue(createAuthResult({ character: mockChar }));
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(loadCreationMethod).mockResolvedValue(null);
      vi.mocked(validateForFinalization).mockResolvedValue(createValidationResult());
      vi.mocked(executeTransition).mockResolvedValue({
        success: true,
        character: updatedChar,
        warnings: [],
      });
      vi.mocked(updateCharacter).mockResolvedValue(updatedChar);

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.character.id).toBe(TEST_CHARACTER_ID);
      expect(data.character.status).toBe("active");
    });
  });

  // ===========================================================================
  // ERROR HANDLING TESTS
  // ===========================================================================

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(authorizeOwnerAccess).mockRejectedValue(new Error("Database error"));

      const request = createMockRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to finalize character");
    });
  });
});
