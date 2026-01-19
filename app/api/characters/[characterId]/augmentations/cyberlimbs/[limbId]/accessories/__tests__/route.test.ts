/**
 * Tests for POST /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/accessories
 *
 * Tests adding accessories to cyberlimbs with capacity validation and audit trails.
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

vi.mock("@/lib/rules/loader", () => ({
  loadRuleset: vi.fn(),
  extractCyberware: vi.fn(),
}));

vi.mock("@/lib/rules/augmentations/cyberlimb", () => ({
  validateAccessoryInstall: vi.fn(),
  addAccessory: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { loadRuleset, extractCyberware } from "@/lib/rules/loader";
import { validateAccessoryInstall, addAccessory } from "@/lib/rules/augmentations/cyberlimb";
import { POST } from "../route";
import {
  TEST_USER_ID,
  TEST_CHARACTER_ID,
  TEST_LIMB_ID,
  createMockCharacter,
  createMockCyberlimb,
  createMockAccessory,
  createMockRequest,
  createMockRuleset,
  mockAccessoryCatalog,
} from "../../../__tests__/test-utils";

// =============================================================================
// TEST SUITE
// =============================================================================

describe("POST /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/accessories", () => {
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
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-gyromount" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

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
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-gyromount" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user does not own character", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ ownerId: "other-user-id" }));

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-gyromount" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Not authorized");
    });
  });

  // ===========================================================================
  // VALIDATION TESTS
  // ===========================================================================

  describe("Input Validation", () => {
    it("should return 400 when catalogId is missing", async () => {
      const mockLimb = createMockCyberlimb();
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        {}
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("catalogId is required");
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
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-gyromount" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Cyberlimb not found");
    });

    it("should return 500 when ruleset fails to load", async () => {
      const mockLimb = createMockCyberlimb();
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: false,
        error: "Ruleset not found",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-gyromount" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Failed to load ruleset");
    });

    it("should return 404 when accessory not found in catalog", async () => {
      const mockLimb = createMockCyberlimb();
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockAccessoryCatalog,
      } as never);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "nonexistent-accessory" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cyberlimb accessory not found");
    });
  });

  // ===========================================================================
  // VALIDATION FAILURE TESTS
  // ===========================================================================

  describe("Accessory Validation Failures", () => {
    it("should return 400 when validation fails (insufficient capacity)", async () => {
      const mockLimb = createMockCyberlimb({ capacityUsed: 14, baseCapacity: 15 });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockAccessoryCatalog,
      } as never);
      vi.mocked(validateAccessoryInstall).mockReturnValue({
        valid: false,
        error: "Insufficient capacity: requires 5, only 1 available",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-gyromount" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Insufficient capacity");
    });

    it("should return 400 when limb type is incompatible", async () => {
      const mockLimb = createMockCyberlimb({ limbType: "skull" });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockAccessoryCatalog,
      } as never);
      vi.mocked(validateAccessoryInstall).mockReturnValue({
        valid: false,
        error: "Gyromount can only be installed in arm cyberlimbs",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-gyromount" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("can only be installed");
    });
  });

  // ===========================================================================
  // SUCCESS TESTS
  // ===========================================================================

  describe("Success Cases", () => {
    it("should successfully add accessory without rating", async () => {
      const mockLimb = createMockCyberlimb({ baseCapacity: 15, capacityUsed: 0 });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newAccessory = createMockAccessory({
        id: "new-acc-id",
        catalogId: "cyberarm-gyromount",
        name: "Cyberarm Gyromount",
        capacityUsed: 5,
        cost: 6500,
      });

      const updatedLimb = createMockCyberlimb({
        accessories: [newAccessory],
        capacityUsed: 5,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockAccessoryCatalog,
      } as never);
      vi.mocked(validateAccessoryInstall).mockReturnValue({ valid: true });
      vi.mocked(addAccessory).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-gyromount" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.accessory).toBeDefined();
      expect(data.accessory.name).toBe("Cyberarm Gyromount");
      expect(data.accessory.capacityUsed).toBe(5);
      expect(data.limbCapacityRemaining).toBe(10);
    });

    it("should successfully add accessory with rating", async () => {
      const mockLimb = createMockCyberlimb({
        limbType: "full-leg",
        baseCapacity: 20,
        capacityUsed: 0,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newAccessory = createMockAccessory({
        id: "new-acc-id",
        catalogId: "hydraulic-jacks",
        name: "Hydraulic Jacks R4",
        rating: 4,
        capacityUsed: 8,
        cost: 10000,
      });

      const updatedLimb = createMockCyberlimb({
        limbType: "full-leg",
        accessories: [newAccessory],
        capacityUsed: 8,
        baseCapacity: 20,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockAccessoryCatalog,
      } as never);
      vi.mocked(validateAccessoryInstall).mockReturnValue({ valid: true });
      vi.mocked(addAccessory).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "hydraulic-jacks", rating: 4 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.accessory.rating).toBe(4);
      expect(data.accessory.capacityUsed).toBe(8);
      expect(data.limbCapacityRemaining).toBe(12);
    });

    it("should create audit trail entry for accessory addition", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        name: "Obvious Full Arm",
        baseCapacity: 15,
        capacityUsed: 0,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newAccessory = createMockAccessory({
        id: "new-acc-id",
        catalogId: "cyberarm-holster",
        name: "Cyberarm Holster",
        capacityUsed: 2,
        cost: 2000,
      });

      const updatedLimb = createMockCyberlimb({
        accessories: [newAccessory],
        capacityUsed: 2,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockAccessoryCatalog,
      } as never);
      vi.mocked(validateAccessoryInstall).mockReturnValue({ valid: true });
      vi.mocked(addAccessory).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-holster" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      await POST(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({ cyberlimbs: expect.any(Array) }),
        expect.objectContaining({
          action: "cyberlimb_accessory_added",
          actor: { userId: TEST_USER_ID, role: "owner" },
          details: expect.objectContaining({
            limbId: TEST_LIMB_ID,
            limbName: "Obvious Full Arm",
            accessoryName: "Cyberarm Holster",
            capacityUsed: 2,
          }),
        })
      );
    });

    it("should find limb by catalogId", async () => {
      const mockLimb = createMockCyberlimb({
        id: "different-id",
        catalogId: TEST_LIMB_ID,
        baseCapacity: 15,
        capacityUsed: 0,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newAccessory = createMockAccessory();
      const updatedLimb = createMockCyberlimb({
        accessories: [newAccessory],
        capacityUsed: 5,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockAccessoryCatalog,
      } as never);
      vi.mocked(validateAccessoryInstall).mockReturnValue({ valid: true });
      vi.mocked(addAccessory).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/accessories`,
        { catalogId: "cyberarm-gyromount" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
