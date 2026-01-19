/**
 * Tests for DELETE /api/characters/[characterId]/qualities/[qualityId] endpoint
 *
 * Tests quality buy-off (removal of negative qualities) including authentication,
 * validation, karma spending, and advancement record creation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { DELETE } from "../route";
import type { Character, MergedRuleset, AdvancementRecord, QualitySelection } from "@/lib/types";
import {
  TEST_USER_ID,
  TEST_CHARACTER_ID,
  TEST_QUALITY_ID,
  createRemoveQualityRequest,
  createMockUser,
  createMockCharacter,
  createMockRuleset,
  createMockAdvancementRecord,
  createMockNegativeQuality,
} from "../../__tests__/test-utils";

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

describe("DELETE /api/characters/[characterId]/qualities/[qualityId]", () => {
  let mockCharacter: Character;
  let mockRuleset: MergedRuleset;

  beforeEach(() => {
    vi.clearAllMocks();

    // Character with a negative quality that can be bought off
    const negativeQuality: QualitySelection = {
      qualityId: "addiction",
      rating: 2,
      specification: "Cram",
      source: "creation",
      originalKarma: 8, // Will cost 16 to buy off (2×)
      active: true,
    };

    mockCharacter = createMockCharacter({
      status: "active",
      karmaCurrent: 25,
      negativeQualities: [negativeQuality],
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

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 if user not found", async () => {
      vi.mocked(userStorageModule.getUserById).mockResolvedValue(null);

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });

    it("should return 404 if character not found", async () => {
      vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
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
      const draftCharacter = createMockCharacter({
        status: "draft",
        negativeQualities: [{ qualityId: "addiction", source: "creation", active: true }],
      });
      vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(draftCharacter);

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Cannot buy off qualities during character creation");
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

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
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

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
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
    it("should return 400 when quality not found on character", async () => {
      vi.mocked(advancementModule.removeQuality).mockImplementation(() => {
        throw new Error("Quality 'nonexistent' not found on character");
      });

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "nonexistent");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "nonexistent" }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("not found");
    });

    it("should return 400 when trying to buy off positive quality", async () => {
      vi.mocked(advancementModule.removeQuality).mockImplementation(() => {
        throw new Error("Cannot buy off positive qualities");
      });

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "quick-healer");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "quick-healer" }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("positive qualities");
    });

    it("should return 400 when insufficient karma", async () => {
      vi.mocked(advancementModule.removeQuality).mockImplementation(() => {
        throw new Error("Not enough karma to buy off. Need 16, have 5");
      });

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("karma");
    });

    it("should return 400 when quality not found in ruleset", async () => {
      vi.mocked(advancementModule.removeQuality).mockImplementation(() => {
        throw new Error("Quality 'addiction' not found in ruleset");
      });

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("not found in ruleset");
    });
  });

  // ===========================================================================
  // Success Cases
  // ===========================================================================

  describe("Success Cases", () => {
    it("should successfully buy off a negative quality", async () => {
      const mockAdvRecord: AdvancementRecord = createMockAdvancementRecord({
        targetId: "addiction",
        targetName: "Addiction (Removed)",
        newValue: 0,
        karmaCost: 16, // 2× the original 8 karma bonus
      });

      const updatedCharacter: Character = {
        ...mockCharacter,
        karmaCurrent: mockCharacter.karmaCurrent - 16,
        negativeQualities: [], // Quality removed
        advancementHistory: [mockAdvRecord],
      };

      vi.mocked(advancementModule.removeQuality).mockReturnValue({
        cost: 16,
        updatedCharacter,
        quality: createMockNegativeQuality(),
        advancementRecord: mockAdvRecord,
      });

      vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
        updatedCharacter
      );

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.character).toBeDefined();
      expect(data.advancementRecord).toBeDefined();
      expect(data.cost).toBe(16);
    });

    it("should accept optional reason in request body", async () => {
      const mockAdvRecord = createMockAdvancementRecord({
        targetId: "addiction",
        targetName: "Addiction (Removed)",
        notes: "Completed rehab program",
      });

      const updatedCharacter: Character = {
        ...mockCharacter,
        karmaCurrent: mockCharacter.karmaCurrent - 16,
        negativeQualities: [],
        advancementHistory: [mockAdvRecord],
      };

      vi.mocked(advancementModule.removeQuality).mockReturnValue({
        cost: 16,
        updatedCharacter,
        quality: createMockNegativeQuality(),
        advancementRecord: mockAdvRecord,
      });

      vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
        updatedCharacter
      );

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction", {
        reason: "Completed rehab program",
      });

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      expect(response.status).toBe(200);
      expect(advancementModule.removeQuality).toHaveBeenCalledWith(
        mockCharacter,
        "addiction",
        mockRuleset,
        "Completed rehab program"
      );
    });

    it("should call updateCharacterWithAudit with correct audit data", async () => {
      const mockAdvRecord = createMockAdvancementRecord();
      const updatedCharacter: Character = {
        ...mockCharacter,
        negativeQualities: [],
      };

      vi.mocked(advancementModule.removeQuality).mockReturnValue({
        cost: 16,
        updatedCharacter,
        quality: createMockNegativeQuality(),
        advancementRecord: mockAdvRecord,
      });

      vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
        updatedCharacter
      );

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction", {
        reason: "Story reason",
      });

      await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      expect(characterStorageModule.updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          negativeQualities: [],
          karmaCurrent: updatedCharacter.karmaCurrent,
          advancementHistory: updatedCharacter.advancementHistory,
        }),
        expect.objectContaining({
          action: "updated",
          actor: expect.objectContaining({
            userId: TEST_USER_ID,
          }),
          details: expect.objectContaining({
            qualityId: "addiction",
            action: "remove_quality",
            cost: 16,
          }),
          note: "Story reason",
        })
      );
    });

    it("should work without request body", async () => {
      const mockAdvRecord = createMockAdvancementRecord();
      const updatedCharacter = createMockCharacter({ negativeQualities: [] });

      vi.mocked(advancementModule.removeQuality).mockReturnValue({
        cost: 16,
        updatedCharacter,
        quality: createMockNegativeQuality(),
        advancementRecord: mockAdvRecord,
      });

      vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
        updatedCharacter
      );

      // Request with no body
      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  // ===========================================================================
  // Storage Error Tests
  // ===========================================================================

  describe("Storage Errors", () => {
    it("should return 400 when updateCharacterWithAudit throws (caught by inner try-catch)", async () => {
      const mockAdvRecord = createMockAdvancementRecord();
      const updatedCharacter = createMockCharacter();

      vi.mocked(advancementModule.removeQuality).mockReturnValue({
        cost: 16,
        updatedCharacter,
        quality: createMockNegativeQuality(),
        advancementRecord: mockAdvRecord,
      });

      vi.mocked(characterStorageModule.updateCharacterWithAudit).mockRejectedValue(
        new Error("Database write failed")
      );

      const request = createRemoveQualityRequest(TEST_CHARACTER_ID, "addiction");

      const response = await DELETE(request, {
        params: Promise.resolve({ characterId: TEST_CHARACTER_ID, qualityId: "addiction" }),
      });

      // The error is caught in the inner try-catch which returns 400
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database write failed");
    });
  });
});
