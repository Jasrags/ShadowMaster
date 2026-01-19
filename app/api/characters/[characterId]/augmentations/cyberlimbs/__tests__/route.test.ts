/**
 * Tests for /api/characters/[characterId]/augmentations/cyberlimbs
 *
 * GET - List all installed cyberlimbs
 * POST - Install a new cyberlimb
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
  createCyberlimb: vi.fn(),
  validateCyberlimbInstallation: vi.fn(),
  checkLocationConflicts: vi.fn(),
  validateCustomization: vi.fn(),
  calculateCyberlimbCosts: vi.fn(),
  calculateTotalCMBonus: vi.fn(),
  getCyberlimbStrength: vi.fn(),
  getCyberlimbAgility: vi.fn(),
  getCapacityBreakdown: vi.fn(),
  isCyberlimbCatalogItem: vi.fn(),
}));

vi.mock("@/lib/rules/augmentations/essence", () => ({
  calculateTotalEssenceLoss: vi.fn(),
  roundEssence: vi.fn((val) => Math.round(val * 100) / 100),
}));

vi.mock("@/lib/rules/augmentations/essence-hole", () => ({
  shouldTrackEssenceHole: vi.fn(),
  updateEssenceHoleOnInstall: vi.fn(),
  getCharacterEssenceHole: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { loadRuleset, extractCyberware } from "@/lib/rules/loader";
import {
  createCyberlimb,
  validateCyberlimbInstallation,
  checkLocationConflicts,
  validateCustomization,
  calculateTotalCMBonus,
  getCyberlimbStrength,
  getCyberlimbAgility,
  getCapacityBreakdown,
  isCyberlimbCatalogItem,
} from "@/lib/rules/augmentations/cyberlimb";
import {
  shouldTrackEssenceHole,
  updateEssenceHoleOnInstall,
  getCharacterEssenceHole,
} from "@/lib/rules/augmentations/essence-hole";
import { GET, POST } from "../route";
import {
  TEST_USER_ID,
  TEST_CHARACTER_ID,
  TEST_LIMB_ID,
  createMockCharacter,
  createMockCyberlimb,
  createMockRequest,
  createMockRuleset,
  mockCyberlimbCatalog,
} from "./test-utils";

// =============================================================================
// TEST SUITE - GET
// =============================================================================

describe("GET /api/characters/[characterId]/augmentations/cyberlimbs", () => {
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
    vi.mocked(calculateTotalCMBonus).mockReturnValue(0);
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Not authorized");
    });
  });

  describe("Success Cases", () => {
    it("should return empty list for character with no cyberlimbs", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberlimbs: [] }));

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.cyberlimbs).toEqual([]);
      expect(data.totalCMBonus).toBe(0);
      expect(data.totalEssenceLost).toBe(0);
    });

    it("should return list of cyberlimbs with summaries", async () => {
      const mockLimb = createMockCyberlimb({
        id: TEST_LIMB_ID,
        name: "Obvious Full Arm",
        location: "right-arm",
        limbType: "full-arm",
        essenceCost: 1.0,
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberlimbs: [mockLimb] }));
      vi.mocked(calculateTotalCMBonus).mockReturnValue(1);

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.cyberlimbs).toHaveLength(1);
      expect(data.cyberlimbs[0].name).toBe("Obvious Full Arm");
      expect(data.cyberlimbs[0].location).toBe("right-arm");
      expect(data.totalCMBonus).toBe(1);
      expect(data.totalEssenceLost).toBe(1.0);
    });

    it("should calculate total essence from multiple limbs", async () => {
      const limb1 = createMockCyberlimb({
        id: "limb-1",
        essenceCost: 1.0,
      });
      const limb2 = createMockCyberlimb({
        id: "limb-2",
        location: "left-arm",
        essenceCost: 0.8,
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({ cyberlimbs: [limb1, limb2] })
      );
      vi.mocked(calculateTotalCMBonus).mockReturnValue(2);

      const request = createMockRequest(
        "GET",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cyberlimbs).toHaveLength(2);
      expect(data.totalEssenceLost).toBe(1.8);
      expect(data.totalCMBonus).toBe(2);
    });
  });
});

// =============================================================================
// TEST SUITE - POST
// =============================================================================

describe("POST /api/characters/[characterId]/augmentations/cyberlimbs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(shouldTrackEssenceHole).mockReturnValue(false);
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
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
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
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

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
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe("Input Validation", () => {
    it("should return 400 when catalogId is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("catalogId is required");
    });

    it("should return 400 when location is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("location is required");
    });

    it("should return 400 when grade is missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("grade is required");
    });
  });

  describe("Resource Not Found", () => {
    it("should return 500 when ruleset fails to load", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: false,
        error: "Ruleset not found",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Failed to load ruleset");
    });

    it("should return 404 when cyberlimb not found in catalog", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(false);

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "nonexistent-limb",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cyberlimb not found in catalog");
    });
  });

  describe("Validation Failures", () => {
    it("should return 400 when customization is invalid", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(true);
      vi.mocked(validateCustomization).mockReturnValue({
        valid: false,
        error: "Strength customization exceeds racial maximum",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
          customization: { strengthCustomization: 10 },
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("exceeds racial maximum");
    });

    it("should return 400 when location conflicts with blocking limb", async () => {
      const existingLimb = createMockCyberlimb({
        location: "right-arm",
        limbType: "full-arm",
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({ cyberlimbs: [existingLimb] })
      );
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(true);
      vi.mocked(validateCustomization).mockReturnValue({ valid: true });
      vi.mocked(checkLocationConflicts).mockReturnValue({
        hasConflict: true,
        blockingLimb: existingLimb,
        limbsToReplace: [],
        error: "Cannot install hand when full arm already exists",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-hand",
          location: "right-hand",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should return 400 when replacement not confirmed", async () => {
      const existingLimb = createMockCyberlimb({
        location: "right-hand",
        limbType: "hand",
        name: "Existing Hand",
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({ cyberlimbs: [existingLimb] })
      );
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(true);
      vi.mocked(validateCustomization).mockReturnValue({ valid: true });
      vi.mocked(checkLocationConflicts).mockReturnValue({
        hasConflict: true,
        limbsToReplace: [existingLimb],
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("will replace");
      expect(data.warnings).toBeDefined();
    });

    it("should return 400 when validation fails", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(true);
      vi.mocked(validateCustomization).mockReturnValue({ valid: true });
      vi.mocked(checkLocationConflicts).mockReturnValue({
        hasConflict: false,
        limbsToReplace: [],
      });
      vi.mocked(validateCyberlimbInstallation).mockReturnValue({
        valid: false,
        error: "Insufficient essence",
      });

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Insufficient essence");
    });
  });

  describe("Success Cases", () => {
    it("should successfully install cyberlimb", async () => {
      const newLimb = createMockCyberlimb({
        name: "Obvious Full Arm",
        location: "right-arm",
        essenceCost: 1.0,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberlimbs: [] }));
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(true);
      vi.mocked(validateCustomization).mockReturnValue({ valid: true });
      vi.mocked(checkLocationConflicts).mockReturnValue({
        hasConflict: false,
        limbsToReplace: [],
      });
      vi.mocked(validateCyberlimbInstallation).mockReturnValue({ valid: true });
      vi.mocked(createCyberlimb).mockReturnValue(newLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.installedLimb).toBeDefined();
      expect(data.installedLimb.name).toBe("Obvious Full Arm");
      expect(data.essenceChange).toBe(-1.0);
    });

    it("should install with confirmed replacement", async () => {
      const existingLimb = createMockCyberlimb({
        id: "existing-hand",
        location: "right-hand",
        limbType: "hand",
        name: "Existing Hand",
      });
      const newLimb = createMockCyberlimb({
        name: "Obvious Full Arm",
        location: "right-arm",
        essenceCost: 1.0,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({ cyberlimbs: [existingLimb] })
      );
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(true);
      vi.mocked(validateCustomization).mockReturnValue({ valid: true });
      vi.mocked(checkLocationConflicts).mockReturnValue({
        hasConflict: true,
        limbsToReplace: [existingLimb],
      });
      vi.mocked(validateCyberlimbInstallation).mockReturnValue({ valid: true });
      vi.mocked(createCyberlimb).mockReturnValue(newLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
          confirmReplacement: true,
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.removedLimbs).toContain("Existing Hand");
      expect(data.warnings).toBeDefined();
    });

    it("should update essence hole for magical characters", async () => {
      const newLimb = createMockCyberlimb({
        essenceCost: 1.0,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({
          magicalPath: "full-mage",
          specialAttributes: { edge: 3, essence: 6, magic: 6 },
        })
      );
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(true);
      vi.mocked(validateCustomization).mockReturnValue({ valid: true });
      vi.mocked(checkLocationConflicts).mockReturnValue({
        hasConflict: false,
        limbsToReplace: [],
      });
      vi.mocked(validateCyberlimbInstallation).mockReturnValue({ valid: true });
      vi.mocked(createCyberlimb).mockReturnValue(newLimb);
      vi.mocked(shouldTrackEssenceHole).mockReturnValue(true);
      vi.mocked(getCharacterEssenceHole).mockReturnValue({
        peakEssenceLoss: 0,
        currentEssenceLoss: 0,
        essenceHole: 0,
        magicLost: 0,
      });
      vi.mocked(updateEssenceHoleOnInstall).mockReturnValue({
        essenceHole: {
          peakEssenceLoss: 1.0,
          currentEssenceLoss: 1.0,
          essenceHole: 0,
          magicLost: 1,
        },
        hadPermanentLoss: true,
        additionalMagicLost: 1,
      });
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.magicLoss).toBe(1);
    });

    it("should create audit trail for installation", async () => {
      const newLimb = createMockCyberlimb({
        name: "Obvious Full Arm",
        location: "right-arm",
        essenceCost: 1.0,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(true);
      vi.mocked(validateCustomization).mockReturnValue({ valid: true });
      vi.mocked(checkLocationConflicts).mockReturnValue({
        hasConflict: false,
        limbsToReplace: [],
      });
      vi.mocked(validateCyberlimbInstallation).mockReturnValue({ valid: true });
      vi.mocked(createCyberlimb).mockReturnValue(newLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          cyberlimbs: expect.any(Array),
          specialAttributes: expect.any(Object),
        }),
        expect.objectContaining({
          action: "cyberlimb_installed",
          actor: { userId: TEST_USER_ID, role: "owner" },
          details: expect.objectContaining({
            catalogId: "obvious-full-arm",
            location: "right-arm",
            grade: "standard",
          }),
        })
      );
    });

    it("should pass customization to createCyberlimb", async () => {
      const newLimb = createMockCyberlimb({
        customStrength: 2,
        customAgility: 1,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset() as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberlimbCatalog,
      } as never);
      vi.mocked(isCyberlimbCatalogItem).mockReturnValue(true);
      vi.mocked(validateCustomization).mockReturnValue({ valid: true });
      vi.mocked(checkLocationConflicts).mockReturnValue({
        hasConflict: false,
        limbsToReplace: [],
      });
      vi.mocked(validateCyberlimbInstallation).mockReturnValue({ valid: true });
      vi.mocked(createCyberlimb).mockReturnValue(newLimb);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest(
        "POST",
        `/api/characters/${TEST_CHARACTER_ID}/augmentations/cyberlimbs`,
        {
          catalogId: "obvious-full-arm",
          location: "right-arm",
          grade: "standard",
          customization: {
            strengthCustomization: 2,
            agilityCustomization: 1,
          },
        }
      );
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(createCyberlimb).toHaveBeenCalledWith(expect.any(Object), "right-arm", "standard", {
        strengthCustomization: 2,
        agilityCustomization: 1,
      });
    });
  });
});
