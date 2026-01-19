/**
 * Tests for POST /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/enhancements
 *
 * Tests adding enhancements (agility, strength, armor) to cyberlimbs with
 * capacity validation and audit trails.
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
  validateEnhancementInstall: vi.fn(),
  addEnhancement: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { loadRuleset, extractCyberware } from "@/lib/rules/loader";
import { validateEnhancementInstall, addEnhancement } from "@/lib/rules/augmentations/cyberlimb";
import { POST } from "../route";
import {
  TEST_USER_ID,
  TEST_CHARACTER_ID,
  TEST_LIMB_ID,
  createMockCharacter,
  createMockCyberlimb,
  createMockEnhancement,
  createMockRequest,
  createMockRuleset,
  mockEnhancementCatalog,
} from "../../../__tests__/test-utils";

// =============================================================================
// TEST SUITE
// =============================================================================

describe("POST /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/enhancements", () => {
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 1 }
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 1 }
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 1 }
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { rating: 1 }
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

    it("should return 400 when rating is missing", async () => {
      const mockLimb = createMockCyberlimb();
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("rating is required and must be >= 1");
    });

    it("should return 400 when rating is less than 1", async () => {
      const mockLimb = createMockCyberlimb();
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 0 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("rating is required and must be >= 1");
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 1 }
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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 1 }
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

    it("should return 404 when enhancement not found in catalog", async () => {
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
        catalog: mockEnhancementCatalog,
      } as never);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "nonexistent-enhancement", rating: 1 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cyberlimb enhancement not found");
    });
  });

  // ===========================================================================
  // VALIDATION FAILURE TESTS
  // ===========================================================================

  describe("Enhancement Validation Failures", () => {
    it("should return 400 when validation fails (insufficient capacity)", async () => {
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
        catalog: mockEnhancementCatalog,
      } as never);
      vi.mocked(validateEnhancementInstall).mockReturnValue({
        valid: false,
        error: "Insufficient capacity in cyberlimb",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 3 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Insufficient capacity in cyberlimb");
    });

    it("should return 400 when duplicate enhancement type exists", async () => {
      const existingEnhancement = createMockEnhancement({ enhancementType: "agility" });
      const mockLimb = createMockCyberlimb({ enhancements: [existingEnhancement] });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockEnhancementCatalog,
      } as never);
      vi.mocked(validateEnhancementInstall).mockReturnValue({
        valid: false,
        error: "An agility enhancement is already installed",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 2 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("already installed");
    });

    it("should return 400 when rating exceeds maximum", async () => {
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
        catalog: mockEnhancementCatalog,
      } as never);
      vi.mocked(validateEnhancementInstall).mockReturnValue({
        valid: false,
        error: "Rating 5 exceeds maximum of 3",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 5 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("exceeds maximum");
    });
  });

  // ===========================================================================
  // SUCCESS TESTS
  // ===========================================================================

  describe("Success Cases", () => {
    it("should successfully add agility enhancement", async () => {
      const mockLimb = createMockCyberlimb({ baseCapacity: 15, capacityUsed: 0 });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newEnhancement = createMockEnhancement({
        id: "new-enh-id",
        catalogId: "cyberlimb-agility",
        name: "Agility Enhancement",
        enhancementType: "agility",
        rating: 2,
        capacityUsed: 2,
        cost: 13000,
      });

      const updatedLimb = createMockCyberlimb({
        enhancements: [newEnhancement],
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
        catalog: mockEnhancementCatalog,
      } as never);
      vi.mocked(validateEnhancementInstall).mockReturnValue({ valid: true });
      vi.mocked(addEnhancement).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 2 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.enhancement).toBeDefined();
      expect(data.enhancement.name).toBe("Agility Enhancement");
      expect(data.enhancement.enhancementType).toBe("agility");
      expect(data.enhancement.rating).toBe(2);
      expect(data.enhancement.capacityUsed).toBe(2);
      expect(data.limbCapacityRemaining).toBe(13);
    });

    it("should successfully add strength enhancement", async () => {
      const mockLimb = createMockCyberlimb({ baseCapacity: 15, capacityUsed: 0 });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newEnhancement = createMockEnhancement({
        id: "new-enh-id",
        catalogId: "cyberlimb-strength",
        name: "Strength Enhancement",
        enhancementType: "strength",
        rating: 3,
        capacityUsed: 3,
        cost: 19500,
      });

      const updatedLimb = createMockCyberlimb({
        enhancements: [newEnhancement],
        capacityUsed: 3,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockEnhancementCatalog,
      } as never);
      vi.mocked(validateEnhancementInstall).mockReturnValue({ valid: true });
      vi.mocked(addEnhancement).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-strength", rating: 3 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.enhancement.enhancementType).toBe("strength");
      expect(data.enhancement.rating).toBe(3);
    });

    it("should successfully add armor enhancement", async () => {
      const mockLimb = createMockCyberlimb({ baseCapacity: 15, capacityUsed: 0 });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newEnhancement = createMockEnhancement({
        id: "new-enh-id",
        catalogId: "cyberlimb-armor",
        name: "Armor Enhancement",
        enhancementType: "armor",
        rating: 2,
        capacityUsed: 2,
        cost: 6000,
      });

      const updatedLimb = createMockCyberlimb({
        enhancements: [newEnhancement],
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
        catalog: mockEnhancementCatalog,
      } as never);
      vi.mocked(validateEnhancementInstall).mockReturnValue({ valid: true });
      vi.mocked(addEnhancement).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-armor", rating: 2 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.enhancement.enhancementType).toBe("armor");
    });

    it("should create audit trail entry for enhancement addition", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        name: "Obvious Full Arm",
        baseCapacity: 15,
        capacityUsed: 0,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newEnhancement = createMockEnhancement({
        id: "new-enh-id",
        catalogId: "cyberlimb-agility",
        name: "Agility Enhancement",
        enhancementType: "agility",
        rating: 1,
        capacityUsed: 1,
        cost: 6500,
      });

      const updatedLimb = createMockCyberlimb({
        enhancements: [newEnhancement],
        capacityUsed: 1,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockEnhancementCatalog,
      } as never);
      vi.mocked(validateEnhancementInstall).mockReturnValue({ valid: true });
      vi.mocked(addEnhancement).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 1 }
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
          action: "cyberlimb_enhancement_added",
          actor: { userId: TEST_USER_ID, role: "owner" },
          details: expect.objectContaining({
            limbId: TEST_LIMB_ID,
            limbName: "Obvious Full Arm",
            enhancementName: "Agility Enhancement",
            rating: 1,
            capacityUsed: 1,
          }),
        })
      );
    });

    it("should inherit limb grade when grade not specified", async () => {
      const mockLimb = createMockCyberlimb({
        grade: "alpha",
        baseCapacity: 15,
        capacityUsed: 0,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newEnhancement = createMockEnhancement();
      const updatedLimb = createMockCyberlimb({
        enhancements: [newEnhancement],
        capacityUsed: 1,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockEnhancementCatalog,
      } as never);
      vi.mocked(validateEnhancementInstall).mockReturnValue({ valid: true });
      vi.mocked(addEnhancement).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 1 }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      await POST(request, { params });

      expect(addEnhancement).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        1,
        "alpha"
      );
    });

    it("should use specified grade when provided", async () => {
      const mockLimb = createMockCyberlimb({
        grade: "standard",
        baseCapacity: 15,
        capacityUsed: 0,
      });
      const mockCharacter = createMockCharacter({ cyberlimbs: [mockLimb] });
      const mockRuleset = createMockRuleset();

      const newEnhancement = createMockEnhancement();
      const updatedLimb = createMockCyberlimb({
        enhancements: [newEnhancement],
        capacityUsed: 1,
        baseCapacity: 15,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: mockRuleset as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockEnhancementCatalog,
      } as never);
      vi.mocked(validateEnhancementInstall).mockReturnValue({ valid: true });
      vi.mocked(addEnhancement).mockReturnValue(updatedLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs/${TEST_LIMB_ID}/enhancements`,
        { catalogId: "cyberlimb-agility", rating: 1, grade: "deltaware" }
      );
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        limbId: TEST_LIMB_ID,
      });

      await POST(request, { params });

      expect(addEnhancement).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        1,
        "deltaware"
      );
    });
  });
});
