/**
 * Tests for POST /api/characters/[characterId]/qualities endpoint
 *
 * Tests quality acquisition post-creation including authentication,
 * validation, karma spending, and advancement record creation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import type { Character, MergedRuleset, AdvancementRecord, QualitySelection } from "@/lib/types";
import {
  TEST_USER_ID,
  TEST_CHARACTER_ID,
  createAcquireQualityRequest,
  createMockUser,
  createMockCharacter,
  createMockRuleset,
  createMockAdvancementRecord,
  createMockPositiveQuality,
} from "./test-utils";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/merge");
vi.mock("@/lib/rules/qualities/advancement");

import * as sessionModule from "@/lib/auth/session";
import * as userStorageModule from "@/lib/storage/users";
import * as characterStorageModule from "@/lib/storage/characters";
import * as rulesModule from "@/lib/rules/merge";
import * as advancementModule from "@/lib/rules/qualities/advancement";

describe("POST /api/characters/[characterId]/qualities", () => {
  let mockCharacter: Character;
  let mockRuleset: MergedRuleset;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      status: "active",
      karmaCurrent: 25,
    });

    mockRuleset = createMockRuleset();

    // Default success mocks
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(rulesModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
  });

  // ===========================================================================
  // Authentication & Authorization Tests
  // ===========================================================================

  describe("Authentication & Authorization", () => {
    it("should return 401 if not authenticated", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(null);

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 if user not found", async () => {
      vi.mocked(userStorageModule.getUserById).mockResolvedValue(null);

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });

    it("should return 404 if character not found", async () => {
      vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  // ===========================================================================
  // Validation Tests
  // ===========================================================================

  describe("Validation", () => {
    it("should return 400 if character is draft", async () => {
      const draftCharacter = createMockCharacter({ status: "draft" });
      vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(draftCharacter);

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Cannot acquire qualities during character creation");
    });

    it("should return 400 if qualityId is missing", async () => {
      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("qualityId");
    });

    it("should return 400 if qualityId is not a string", async () => {
      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: 123 as unknown as string,
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("qualityId");
    });
  });

  // ===========================================================================
  // Ruleset Loading Tests
  // ===========================================================================

  describe("Ruleset Loading", () => {
    it("should return 500 when ruleset fails to load", async () => {
      vi.mocked(rulesModule.loadAndMergeRuleset).mockResolvedValue({
        success: false,
        error: "Failed to load ruleset",
      });

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to load ruleset");
    });

    it("should return 500 when ruleset is null", async () => {
      vi.mocked(rulesModule.loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: undefined,
      });

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  // ===========================================================================
  // Business Logic Error Tests
  // ===========================================================================

  describe("Business Logic Errors", () => {
    it("should return 400 when quality not found in ruleset", async () => {
      vi.mocked(advancementModule.acquireQuality).mockImplementation(() => {
        throw new Error("Quality 'nonexistent' not found in ruleset");
      });

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "nonexistent",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("not found");
    });

    it("should return 400 when prerequisites not met", async () => {
      vi.mocked(advancementModule.acquireQuality).mockImplementation(() => {
        throw new Error("Cannot acquire quality: Prerequisites not met");
      });

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Prerequisites");
    });

    it("should return 400 when quality is incompatible", async () => {
      vi.mocked(advancementModule.acquireQuality).mockImplementation(() => {
        throw new Error("Cannot acquire quality: Incompatible with existing quality");
      });

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Incompatible");
    });

    it("should return 400 when insufficient karma", async () => {
      vi.mocked(advancementModule.acquireQuality).mockImplementation(() => {
        throw new Error("Not enough karma. Need 10, have 5");
      });

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("karma");
    });

    it("should return 400 when quality already owned", async () => {
      vi.mocked(advancementModule.acquireQuality).mockImplementation(() => {
        throw new Error("Cannot acquire quality: Quality already owned");
      });

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("already owned");
    });
  });

  // ===========================================================================
  // Success Cases
  // ===========================================================================

  describe("Success Cases", () => {
    it("should successfully acquire a positive quality", async () => {
      const mockSelection: QualitySelection = {
        qualityId: "quick-healer",
        source: "advancement",
        acquisitionDate: new Date().toISOString(),
        originalKarma: 6, // 2× karma cost
        active: true,
      };

      const mockAdvRecord = createMockAdvancementRecord({
        targetId: "quick-healer",
        targetName: "Quick Healer",
        karmaCost: 6,
      });

      const updatedCharacter: Character = {
        ...mockCharacter,
        karmaCurrent: mockCharacter.karmaCurrent - 6,
        positiveQualities: [mockSelection],
        advancementHistory: [mockAdvRecord],
      };

      vi.mocked(advancementModule.acquireQuality).mockReturnValue({
        selection: mockSelection,
        cost: 6,
        updatedCharacter,
        quality: createMockPositiveQuality(),
        advancementRecord: mockAdvRecord,
      });

      vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
        updatedCharacter
      );

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.character).toBeDefined();
      expect(data.quality).toBeDefined();
      expect(data.advancementRecord).toBeDefined();
      expect(data.cost).toBe(6);
    });

    it("should call acquireQuality with correct parameters", async () => {
      const mockSelection: QualitySelection = {
        qualityId: "quick-healer",
        rating: 2,
        specification: "Test Spec",
        notes: "GM approved this",
        source: "advancement",
        active: true,
      };

      const mockAdvRecord = createMockAdvancementRecord();
      const updatedCharacter = createMockCharacter();

      vi.mocked(advancementModule.acquireQuality).mockReturnValue({
        selection: mockSelection,
        cost: 6,
        updatedCharacter,
        quality: createMockPositiveQuality(),
        advancementRecord: mockAdvRecord,
      });

      vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
        updatedCharacter
      );

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
        rating: 2,
        specification: "Test Spec",
        notes: "GM approved this",
        gmApproved: true,
      });

      await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(advancementModule.acquireQuality).toHaveBeenCalledWith(
        mockCharacter,
        "quick-healer",
        mockRuleset,
        expect.objectContaining({
          rating: 2,
          specification: "Test Spec",
          notes: "GM approved this",
          gmApproved: true,
        })
      );
    });

    it("should call updateCharacterWithAudit with correct audit data", async () => {
      const mockSelection: QualitySelection = {
        qualityId: "quick-healer",
        source: "advancement",
        active: true,
      };

      const mockAdvRecord = createMockAdvancementRecord();
      const updatedCharacter = createMockCharacter({
        positiveQualities: [mockSelection],
      });

      vi.mocked(advancementModule.acquireQuality).mockReturnValue({
        selection: mockSelection,
        cost: 6,
        updatedCharacter,
        quality: createMockPositiveQuality(),
        advancementRecord: mockAdvRecord,
      });

      vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
        updatedCharacter
      );

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
        notes: "Test note",
      });

      await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      expect(characterStorageModule.updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          positiveQualities: updatedCharacter.positiveQualities,
          karmaCurrent: updatedCharacter.karmaCurrent,
          advancementHistory: updatedCharacter.advancementHistory,
        }),
        expect.objectContaining({
          action: "updated",
          actor: expect.objectContaining({
            userId: TEST_USER_ID,
          }),
          details: expect.objectContaining({
            qualityId: "quick-healer",
            action: "acquire_quality",
            cost: 6,
          }),
          note: "Test note",
        })
      );
    });
  });

  // ===========================================================================
  // Storage Error Tests
  // ===========================================================================

  describe("Storage Errors", () => {
    it("should return 400 when updateCharacterWithAudit throws (caught by inner try-catch)", async () => {
      const mockSelection: QualitySelection = {
        qualityId: "quick-healer",
        source: "advancement",
        active: true,
      };

      const mockAdvRecord = createMockAdvancementRecord();
      const updatedCharacter = createMockCharacter();

      vi.mocked(advancementModule.acquireQuality).mockReturnValue({
        selection: mockSelection,
        cost: 6,
        updatedCharacter,
        quality: createMockPositiveQuality(),
        advancementRecord: mockAdvRecord,
      });

      vi.mocked(characterStorageModule.updateCharacterWithAudit).mockRejectedValue(
        new Error("Database write failed")
      );

      const request = createAcquireQualityRequest(TEST_CHARACTER_ID, {
        qualityId: "quick-healer",
      });

      const response = await POST(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID }),
      });

      // The error is caught in the inner try-catch which returns 400
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database write failed");
    });
  });
});
