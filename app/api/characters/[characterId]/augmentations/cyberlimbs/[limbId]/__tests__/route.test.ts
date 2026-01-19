/**
 * Tests for /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]
 *
 * GET - Get cyberlimb details
 * PATCH - Update cyberlimb settings (wireless toggle)
 * DELETE - Remove cyberlimb
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
  toggleCyberlimbWireless: vi.fn(),
  getCyberlimbStrength: vi.fn(),
  getCyberlimbAgility: vi.fn(),
  getCapacityBreakdown: vi.fn(),
}));

vi.mock("@/lib/rules/augmentations/essence-hole", () => ({
  shouldTrackEssenceHole: vi.fn(),
  updateEssenceHoleOnRemoval: vi.fn(),
}));

vi.mock("@/lib/rules/augmentations/essence", () => ({
  roundEssence: vi.fn((val) => Math.round(val * 100) / 100),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import {
  toggleCyberlimbWireless,
  getCyberlimbStrength,
  getCyberlimbAgility,
  getCapacityBreakdown,
} from "@/lib/rules/augmentations/cyberlimb";
import {
  shouldTrackEssenceHole,
  updateEssenceHoleOnRemoval,
} from "@/lib/rules/augmentations/essence-hole";
import { GET, PATCH, DELETE } from "../route";
import {
  TEST_USER_ID,
  TEST_CHARACTER_ID,
  TEST_LIMB_ID,
  createMockCharacter,
  createMockCyberlimb,
  createMockEnhancement,
  createMockAccessory,
  createMockRequest,
} from "../../__tests__/test-utils";

// =============================================================================
// TEST SUITE - GET
// =============================================================================

describe("GET /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    vi.mocked(getCyberlimbStrength).mockReturnValue(3);
    vi.mocked(getCyberlimbAgility).mockReturnValue(3);
    vi.mocked(getCapacityBreakdown).mockReturnValue({
      totalCapacity: 15,
      usedByEnhancements: 0,
      usedByAccessories: 0,
      usedByWeapons: 0,
      remainingCapacity: 15,
    });
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user does not own character", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ ownerId: "other-user-id" }));

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Not authorized");
    });
  });

  describe("Resource Not Found", () => {
    it("should return 404 when cyberlimb not found", async () => {
      const mockCharacter = createMockCharacter({ cyberlimbs: [] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Cyberlimb not found");
    });
  });

  describe("Success Cases", () => {
    it("should return cyberlimb details", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        name: "Obvious Full Arm",
        location: "right-arm",
        limbType: "full-arm",
        appearance: "obvious",
        grade: "standard",
        essenceCost: 1.0,
        cost: 15000,
        availability: 4,
        baseStrength: 3,
        baseAgility: 3,
        customStrength: 1,
        customAgility: 0,
        baseCapacity: 15,
        capacityUsed: 3,
        wirelessEnabled: true,
        condition: "working",
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCyberlimbStrength).mockReturnValue(4);
      vi.mocked(getCyberlimbAgility).mockReturnValue(3);
      vi.mocked(getCapacityBreakdown).mockReturnValue({
        totalCapacity: 15,
        usedByEnhancements: 2,
        usedByAccessories: 1,
        usedByWeapons: 0,
        remainingCapacity: 12,
      });

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.limb).toBeDefined();
      expect(data.limb.name).toBe("Obvious Full Arm");
      expect(data.limb.location).toBe("right-arm");
      expect(data.limb.limbType).toBe("full-arm");
      expect(data.limb.effectiveStrength).toBe(4);
      expect(data.limb.effectiveAgility).toBe(3);
      expect(data.limb.capacity.remaining).toBe(12);
    });

    it("should return limb with enhancements and accessories", async () => {
      const mockEnhancement = createMockEnhancement();
      const mockAccessory = createMockAccessory();
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        enhancements: [mockEnhancement],
        accessories: [mockAccessory],
        weapons: [],
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.limb.enhancements).toHaveLength(1);
      expect(data.limb.accessories).toHaveLength(1);
      expect(data.limb.weapons).toHaveLength(0);
    });

    it("should find limb by catalogId", async () => {
      const mockLimb = createMockCyberlimb({
        id: "different-id",
        catalogId: TEST_LIMB_ID,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});

// =============================================================================
// TEST SUITE - PATCH
// =============================================================================

describe("PATCH /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCyberlimbStrength).mockReturnValue(3);
    vi.mocked(getCyberlimbAgility).mockReturnValue(3);
    vi.mocked(getCapacityBreakdown).mockReturnValue({
      totalCapacity: 15,
      usedByEnhancements: 0,
      usedByAccessories: 0,
      usedByWeapons: 0,
      remainingCapacity: 15,
    });
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest(
        "PATCH",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`,
        { wirelessEnabled: false }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest(
        "PATCH",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`,
        { wirelessEnabled: false }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it("should return 403 when user does not own character", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ ownerId: "other-user-id" }));

      const request = createMockRequest(
        "PATCH",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`,
        { wirelessEnabled: false }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe("Input Validation", () => {
    it("should return 400 when no valid update fields provided", async () => {
      const mockLimb = createMockCyberlimb();
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "PATCH",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`,
        {}
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("No valid update fields provided");
    });
  });

  describe("Resource Not Found", () => {
    it("should return 404 when cyberlimb not found", async () => {
      const mockCharacter = createMockCharacter({ cyberlimbs: [] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "PATCH",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`,
        { wirelessEnabled: false }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe("Success Cases", () => {
    it("should toggle wireless to disabled", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        wirelessEnabled: true,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        wirelessEnabled: false,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(toggleCyberlimbWireless).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "PATCH",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`,
        { wirelessEnabled: false }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.limb.wirelessEnabled).toBe(false);
    });

    it("should toggle wireless to enabled", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        wirelessEnabled: false,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        wirelessEnabled: true,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(toggleCyberlimbWireless).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "PATCH",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`,
        { wirelessEnabled: true }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.limb.wirelessEnabled).toBe(true);
    });

    it("should create audit trail for wireless toggle", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        name: "Obvious Full Arm",
        wirelessEnabled: true,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      const updatedLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        wirelessEnabled: false,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(toggleCyberlimbWireless).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "PATCH",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`,
        { wirelessEnabled: false }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      await PATCH(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.any(Object),
        expect.objectContaining({
          action: "cyberlimb_wireless_toggled",
          details: expect.objectContaining({
            limbId: TEST_LIMB_ID,
            name: "Obvious Full Arm",
            wirelessEnabled: false,
          }),
        })
      );
    });
  });
});

// =============================================================================
// TEST SUITE - DELETE
// =============================================================================

describe("DELETE /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(shouldTrackEssenceHole).mockReturnValue(false);
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it("should return 403 when user does not own character", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ ownerId: "other-user-id" }));

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe("Resource Not Found", () => {
    it("should return 404 when cyberlimb not found", async () => {
      const mockCharacter = createMockCharacter({ cyberlimbs: [] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe("Success Cases", () => {
    it("should remove cyberlimb and restore essence", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        name: "Obvious Full Arm",
        essenceCost: 1.0,
      });
      const mockCharacter = createMockCharacter({
        cyberlimbs: [mockLimb],
        specialAttributes: { edge: 3, essence: 5.0 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.removedLimb).toBe("Obvious Full Arm");
      expect(data.essenceRestored).toBe(1.0);
    });

    it("should create audit trail for removal", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        name: "Synthetic Full Arm",
        location: "left-arm",
        essenceCost: 1.0,
      });
      const mockCharacter = createMockCharacter({
        cyberlimbs: [mockLimb],
        specialAttributes: { edge: 3, essence: 5.0 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      await DELETE(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          cyberlimbs: [],
          specialAttributes: expect.any(Object),
        }),
        expect.objectContaining({
          action: "cyberlimb_removed",
          details: expect.objectContaining({
            limbId: TEST_LIMB_ID,
            name: "Synthetic Full Arm",
            location: "left-arm",
            essenceRestored: 1.0,
          }),
        })
      );
    });

    it("should update essence hole for magical characters", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        essenceCost: 1.0,
      });
      const mockCharacter = createMockCharacter({
        cyberlimbs: [mockLimb],
        magicalPath: "full-mage",
        specialAttributes: { edge: 3, essence: 5.0, magic: 5 },
        essenceHole: {
          peakEssenceLoss: 1.0,
          currentEssenceLoss: 1.0,
          essenceHole: 0,
          magicLost: 1,
        },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(shouldTrackEssenceHole).mockReturnValue(true);
      vi.mocked(updateEssenceHoleOnRemoval).mockReturnValue({
        essenceHole: {
          peakEssenceLoss: 1.0,
          currentEssenceLoss: 0,
          essenceHole: 1.0,
          magicLost: 1,
        },
        hadPermanentLoss: false,
        additionalMagicLost: 0,
      });
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      await DELETE(request, { params });

      expect(updateEssenceHoleOnRemoval).toHaveBeenCalled();
      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          essenceHole: expect.objectContaining({
            essenceHole: 1.0,
          }),
        }),
        expect.any(Object)
      );
    });

    it("should correctly calculate essence after removal with other augmentations", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        essenceCost: 1.0,
      });
      const mockCharacter = createMockCharacter({
        cyberlimbs: [mockLimb],
        cyberware: [{ essenceCost: 0.5 }] as never,
        bioware: [{ essenceCost: 0.3 }] as never,
        specialAttributes: { edge: 3, essence: 4.2 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "DELETE",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}`
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      await DELETE(request, { params });

      // New essence = 6 - 0.5 (cyberware) - 0.3 (bioware) - 0 (no more cyberlimbs) = 5.2
      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          specialAttributes: expect.objectContaining({
            essence: 5.2,
          }),
        }),
        expect.any(Object)
      );
    });
  });
});
