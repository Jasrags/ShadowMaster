/**
 * Tests for POST /api/characters/[characterId]/augmentations/validate
 *
 * Tests augmentation validation without committing installation.
 * Returns validation result, projected essence, and stats impact.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies before imports
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
}));

vi.mock("@/lib/rules/loader", () => ({
  loadRuleset: vi.fn(),
  extractCyberware: vi.fn(),
  extractBioware: vi.fn(),
}));

vi.mock("@/lib/rules/augmentations/validation", () => ({
  validateAugmentationInstall: vi.fn(),
  DEFAULT_AUGMENTATION_RULES: {},
}));

vi.mock("@/lib/rules/augmentations/essence", () => ({
  calculateCyberwareEssence: vi.fn(),
  calculateBiowareEssence: vi.fn(),
  calculateRemainingEssence: vi.fn(),
}));

vi.mock("@/lib/rules/augmentations/essence-hole", () => ({
  calculateMagicLoss: vi.fn(),
  shouldTrackEssenceHole: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/storage/characters";
import { loadRuleset, extractCyberware, extractBioware } from "@/lib/rules/loader";
import { validateAugmentationInstall } from "@/lib/rules/augmentations/validation";
import {
  calculateCyberwareEssence,
  calculateBiowareEssence,
  calculateRemainingEssence,
} from "@/lib/rules/augmentations/essence";
import { calculateMagicLoss, shouldTrackEssenceHole } from "@/lib/rules/augmentations/essence-hole";
import { POST } from "../route";
import type { Character } from "@/lib/types";
import type { CyberwareCatalogItem, BiowareCatalogItem } from "@/lib/types/edition";

// =============================================================================
// TEST CONSTANTS
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";

// =============================================================================
// MOCK DATA
// =============================================================================

const mockCyberwareCatalog: CyberwareCatalogItem[] = [
  {
    id: "datajack",
    name: "Datajack",
    category: "headware",
    essenceCost: 0.1,
    cost: 1000,
    availability: 2,
    description: "Universal data connector",
  },
  {
    id: "cybereyes-1",
    name: "Cybereyes Rating 1",
    category: "eyeware",
    essenceCost: 0.2,
    cost: 4000,
    availability: 3,
    capacity: 4,
    description: "Replacement cybernetic eyes",
  },
];

const mockBiowareCatalog: BiowareCatalogItem[] = [
  {
    id: "muscle-toner-1",
    name: "Muscle Toner Rating 1",
    category: "basic",
    essenceCost: 0.2,
    cost: 16000,
    availability: 8,
    hasRating: true,
    maxRating: 4,
    description: "Enhances agility",
  },
];

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Runner",
    status: "active",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: {},
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
    cyberware: [],
    bioware: [],
    ...overrides,
  } as Character;
}

function createMockRequest(body: Record<string, unknown>): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/augmentations/validate`;
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// =============================================================================
// TEST SUITE
// =============================================================================

describe("POST /api/characters/[characterId]/augmentations/validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(shouldTrackEssenceHole).mockReturnValue(false);
  });

  // ===========================================================================
  // AUTHENTICATION TESTS
  // ===========================================================================

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "datajack",
        grade: "standard",
      });
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
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "datajack",
        grade: "standard",
      });
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

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "datajack",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Not authorized");
    });
  });

  // ===========================================================================
  // INPUT VALIDATION TESTS
  // ===========================================================================

  describe("Input Validation", () => {
    it("should return 400 for invalid type", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest({
        type: "invalid",
        catalogId: "datajack",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors).toContainEqual(expect.objectContaining({ code: "INVALID_TYPE" }));
    });

    it("should return 400 for missing catalogId", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest({
        type: "cyberware",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors).toContainEqual(expect.objectContaining({ code: "MISSING_CATALOG_ID" }));
    });

    it("should return 400 for missing grade", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "datajack",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors).toContainEqual(expect.objectContaining({ code: "MISSING_GRADE" }));
    });
  });

  // ===========================================================================
  // RESOURCE NOT FOUND TESTS
  // ===========================================================================

  describe("Resource Not Found", () => {
    it("should return 500 when ruleset fails to load", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: false,
        error: "Ruleset not found",
      });

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "datajack",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Failed to load ruleset");
    });

    it("should return 404 when cyberware not found in catalog", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: {} as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberwareCatalog,
      } as never);

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "nonexistent",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.errors).toContainEqual(
        expect.objectContaining({ code: "CATALOG_ITEM_NOT_FOUND" })
      );
    });

    it("should return 404 when bioware not found in catalog", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: {} as never,
      });
      vi.mocked(extractBioware).mockReturnValue({
        catalog: mockBiowareCatalog,
      } as never);

      const request = createMockRequest({
        type: "bioware",
        catalogId: "nonexistent",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.errors).toContainEqual(
        expect.objectContaining({ code: "CATALOG_ITEM_NOT_FOUND" })
      );
    });
  });

  // ===========================================================================
  // SUCCESS TESTS
  // ===========================================================================

  describe("Success Cases", () => {
    it("should validate cyberware with essence projection", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: {} as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberwareCatalog,
      } as never);
      vi.mocked(validateAugmentationInstall).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [],
      });
      vi.mocked(calculateCyberwareEssence).mockReturnValue(0.1);
      vi.mocked(calculateRemainingEssence).mockReturnValue(5.9);

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "datajack",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.valid).toBe(true);
      expect(data.projection).toBeDefined();
      expect(data.projection.essenceCost).toBe(0.1);
      expect(data.projection.currentEssence).toBe(6);
      expect(data.projection.projectedEssence).toBe(5.9);
      expect(data.projection.catalogItem.name).toBe("Datajack");
    });

    it("should validate bioware with essence projection", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: {} as never,
      });
      vi.mocked(extractBioware).mockReturnValue({
        catalog: mockBiowareCatalog,
      } as never);
      vi.mocked(validateAugmentationInstall).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [],
      });
      vi.mocked(calculateBiowareEssence).mockReturnValue(0.2);
      vi.mocked(calculateRemainingEssence).mockReturnValue(5.8);

      const request = createMockRequest({
        type: "bioware",
        catalogId: "muscle-toner-1",
        grade: "standard",
        rating: 1,
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.valid).toBe(true);
      expect(data.projection.essenceCost).toBe(0.2);
      expect(data.projection.projectedEssence).toBe(5.8);
    });

    it("should return validation errors for insufficient essence", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({
          specialAttributes: { edge: 3, essence: 0.1 },
        })
      );
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: {} as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberwareCatalog,
      } as never);
      vi.mocked(validateAugmentationInstall).mockReturnValue({
        valid: false,
        errors: [{ code: "ESSENCE_INSUFFICIENT", message: "Not enough essence" }],
        warnings: [],
      });
      vi.mocked(calculateCyberwareEssence).mockReturnValue(0.2);
      vi.mocked(calculateRemainingEssence).mockReturnValue(-0.1);

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "cybereyes-1",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.valid).toBe(false);
      expect(data.errors.length).toBeGreaterThan(0);
    });

    it("should project magic loss for awakened characters", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({
          magicalPath: "full-mage",
          specialAttributes: { edge: 3, essence: 6, magic: 6 },
        })
      );
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: {} as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: [{ ...mockCyberwareCatalog[0], essenceCost: 1.5 }],
      } as never);
      vi.mocked(validateAugmentationInstall).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [],
      });
      vi.mocked(calculateCyberwareEssence).mockReturnValue(1.5);
      vi.mocked(calculateRemainingEssence).mockReturnValue(4.5);
      vi.mocked(shouldTrackEssenceHole).mockReturnValue(true);
      vi.mocked(calculateMagicLoss).mockReturnValue(2);

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "datajack",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.projection.projectedMagicLoss).toBe(2);
    });

    it("should return warnings from validation", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: {} as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberwareCatalog,
      } as never);
      vi.mocked(validateAugmentationInstall).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [{ code: "HIGH_AVAILABILITY", message: "Availability may be restricted" }],
      });
      vi.mocked(calculateCyberwareEssence).mockReturnValue(0.1);
      vi.mocked(calculateRemainingEssence).mockReturnValue(5.9);

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "datajack",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.valid).toBe(true);
      expect(data.warnings).toContainEqual(expect.objectContaining({ code: "HIGH_AVAILABILITY" }));
    });

    it("should handle draft characters with creation lifecycle", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ status: "draft" }));
      vi.mocked(loadRuleset).mockResolvedValue({
        success: true,
        ruleset: {} as never,
      });
      vi.mocked(extractCyberware).mockReturnValue({
        catalog: mockCyberwareCatalog,
      } as never);
      vi.mocked(validateAugmentationInstall).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [],
      });
      vi.mocked(calculateCyberwareEssence).mockReturnValue(0.1);
      vi.mocked(calculateRemainingEssence).mockReturnValue(5.9);

      const request = createMockRequest({
        type: "cyberware",
        catalogId: "datajack",
        grade: "standard",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(validateAugmentationInstall).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        "standard",
        undefined,
        expect.objectContaining({ lifecycleStage: "creation" })
      );
    });
  });
});
