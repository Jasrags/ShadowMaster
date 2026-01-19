/**
 * Tests for DELETE /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/accessories/[accessoryId]
 *
 * Tests accessory removal from cyberlimbs with proper capacity restoration
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
  removeAccessory: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { removeAccessory } from "@/lib/rules/augmentations/cyberlimb";
import { DELETE } from "../route";
import {
  TEST_USER_ID,
  TEST_CHARACTER_ID,
  TEST_LIMB_ID,
  TEST_ACCESSORY_ID,
  createMockCharacter,
  createMockCyberlimb,
  createMockAccessory,
  createMockRequest,
} from "../../../../__tests__/test-utils";

// =============================================================================
// TEST SUITE
// =============================================================================

describe("DELETE /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/accessories/[accessoryId]", () => {
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories/${TEST_ACCESSORY_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        accessoryId: TEST_ACCESSORY_ID,
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories/${TEST_ACCESSORY_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        accessoryId: TEST_ACCESSORY_ID,
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories/${TEST_ACCESSORY_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        accessoryId: TEST_ACCESSORY_ID,
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories/${TEST_ACCESSORY_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        accessoryId: TEST_ACCESSORY_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Cyberlimb not found");
    });

    it("should return 404 when accessory not found in limb", async () => {
      const mockLimb = createMockCyberlimb({ accessories: [] });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories/${TEST_ACCESSORY_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        accessoryId: TEST_ACCESSORY_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Accessory not found in this cyberlimb");
    });
  });

  // ===========================================================================
  // SUCCESS TESTS
  // ===========================================================================

  describe("Success Cases", () => {
    it("should successfully remove accessory and restore capacity", async () => {
      const mockAccessory = createMockAccessory({
        id: TEST_ACCESSORY_ID,
        name: "Cyberarm Gyromount",
        capacityUsed: 5,
      });
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        accessories: [mockAccessory],
        capacityUsed: 5,
        baseCapacity: 15,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        accessories: [],
        capacityUsed: 0,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(removeAccessory).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories/${TEST_ACCESSORY_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        accessoryId: TEST_ACCESSORY_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.removedAccessory).toBe("Cyberarm Gyromount");
      expect(data.capacityRestored).toBe(5);
      expect(data.limbCapacityRemaining).toBe(15);
    });

    it("should find accessory by catalogId", async () => {
      const mockAccessory = createMockAccessory({
        id: "different-id",
        catalogId: TEST_ACCESSORY_ID,
        capacityUsed: 2,
      });
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        accessories: [mockAccessory],
        capacityUsed: 2,
        baseCapacity: 15,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        accessories: [],
        capacityUsed: 0,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(removeAccessory).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories/${TEST_ACCESSORY_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        accessoryId: TEST_ACCESSORY_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should create audit trail entry for removal", async () => {
      const mockAccessory = createMockAccessory({
        id: TEST_ACCESSORY_ID,
        name: "Cyberarm Holster",
        capacityUsed: 2,
      });
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        name: "Obvious Full Arm",
        accessories: [mockAccessory],
        capacityUsed: 2,
        baseCapacity: 15,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        accessories: [],
        capacityUsed: 0,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(removeAccessory).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories/${TEST_ACCESSORY_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        accessoryId: TEST_ACCESSORY_ID,
      });

      await DELETE(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({ cyberlimbs: expect.any(Array) }),
        expect.objectContaining({
          action: "cyberlimb_accessory_removed",
          actor: { userId: TEST_USER_ID, role: "owner" },
          details: expect.objectContaining({
            limbId: TEST_LIMB_ID,
            limbName: "Obvious Full Arm",
            accessoryId: TEST_ACCESSORY_ID,
            accessoryName: "Cyberarm Holster",
            capacityRestored: 2,
          }),
        })
      );
    });

    it("should handle accessory with rating", async () => {
      const mockAccessory = createMockAccessory({
        id: TEST_ACCESSORY_ID,
        name: "Hydraulic Jacks R3",
        rating: 3,
        capacityUsed: 6,
      });
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        accessories: [mockAccessory],
        capacityUsed: 6,
        baseCapacity: 20,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        accessories: [],
        capacityUsed: 0,
        baseCapacity: 20,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(removeAccessory).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories/${TEST_ACCESSORY_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
        accessoryId: TEST_ACCESSORY_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.capacityRestored).toBe(6);
      expect(data.limbCapacityRemaining).toBe(20);
    });
  });
});
