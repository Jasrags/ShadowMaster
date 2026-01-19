/**
 * Tests for DELETE /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/enhancements/[enhancementId]
 *
 * Tests enhancement removal from cyberlimbs with proper capacity restoration
 * and audit trail.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies before imports
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  updateCharacterWithAudit: vi.fn(),
}));

vi.mock("@/lib/rules/augmentations/cyberlimb", () => ({
  removeEnhancement: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { removeEnhancement } from "@/lib/rules/augmentations/cyberlimb";
import { DELETE } from "../route";
import {
  TEST_USER_ID,
  TEST_CHARACTER_ID,
  TEST_LIMB_ID,
  TEST_ENHANCEMENT_ID,
  createMockCharacter,
  createMockCyberlimb,
  createMockEnhancement,
  createMockRequest,
} from "../../../../__tests__/test-utils";

// =============================================================================
// TEST SUITE
// =============================================================================

describe("DELETE /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/enhancements/[enhancementId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // AUTHENTICATION TESTS
  // ===========================================================================

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements/${TEST_ENHANCEMENT_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        enhancementId: TEST_ENHANCEMENT_ID,
      });

      const response = await DELETE(request, { params });
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
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements/${TEST_ENHANCEMENT_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        enhancementId: TEST_ENHANCEMENT_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user does not own character", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ ownerId: "other-user-id" }));

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements/${TEST_ENHANCEMENT_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        enhancementId: TEST_ENHANCEMENT_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Not authorized");
    });
  });

  // ===========================================================================
  // RESOURCE NOT FOUND TESTS
  // ===========================================================================

  describe("Resource Not Found", () => {
    it("should return 404 when cyberlimb not found", async () => {
      const mockCharacter = createMockCharacter({ cyberlimbs: [] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements/${TEST_ENHANCEMENT_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        enhancementId: TEST_ENHANCEMENT_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Cyberlimb not found");
    });

    it("should return 404 when enhancement not found in limb", async () => {
      const mockLimb = createMockCyberlimb({ enhancements: [] });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements/${TEST_ENHANCEMENT_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        enhancementId: TEST_ENHANCEMENT_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Enhancement not found in this cyberlimb");
    });
  });

  // ===========================================================================
  // SUCCESS TESTS
  // ===========================================================================

  describe("Success Cases", () => {
    it("should successfully remove enhancement and restore capacity", async () => {
      const mockEnhancement = createMockEnhancement({
        id: TEST_ENHANCEMENT_ID,
        capacityUsed: 2,
      });
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        enhancements: [mockEnhancement],
        capacityUsed: 2,
        baseCapacity: 15,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        enhancements: [],
        capacityUsed: 0,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(removeEnhancement).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements/${TEST_ENHANCEMENT_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        enhancementId: TEST_ENHANCEMENT_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.removedEnhancement).toBe("Agility Enhancement");
      expect(data.capacityRestored).toBe(2);
      expect(data.limbCapacityRemaining).toBe(15);
    });

    it("should find enhancement by catalogId", async () => {
      const mockEnhancement = createMockEnhancement({
        id: "different-id",
        catalogId: TEST_ENHANCEMENT_ID,
        capacityUsed: 1,
      });
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        enhancements: [mockEnhancement],
        capacityUsed: 1,
        baseCapacity: 15,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        enhancements: [],
        capacityUsed: 0,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(removeEnhancement).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements/${TEST_ENHANCEMENT_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        enhancementId: TEST_ENHANCEMENT_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should create audit trail entry for removal", async () => {
      const mockEnhancement = createMockEnhancement({
        id: TEST_ENHANCEMENT_ID,
        name: "Strength Enhancement",
        capacityUsed: 3,
      });
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        name: "Obvious Full Arm",
        enhancements: [mockEnhancement],
        capacityUsed: 3,
        baseCapacity: 15,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        enhancements: [],
        capacityUsed: 0,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(removeEnhancement).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements/${TEST_ENHANCEMENT_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        enhancementId: TEST_ENHANCEMENT_ID,
      });

      await DELETE(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({ cyberlimbs: expect.any(Array) }),
        expect.objectContaining({
          action: "cyberlimb_enhancement_removed",
          actor: { userId: TEST_USER_ID, role: "owner" },
          details: expect.objectContaining({
            limbId: TEST_LIMB_ID,
            limbName: "Obvious Full Arm",
            enhancementId: TEST_ENHANCEMENT_ID,
            enhancementName: "Strength Enhancement",
            capacityRestored: 3,
          }),
        })
      );
    });
  });
});
