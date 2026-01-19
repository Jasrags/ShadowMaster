/**
 * Tests for /api/characters/[characterId]/augmentations/[augmentationId]
 *
 * GET - Get specific augmentation details
 * PUT - Update augmentation (grade upgrade)
 * DELETE - Remove augmentation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies before imports
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  updateCharacterWithAudit: vi.fn(),
}));

vi.mock("@/lib/rules/augmentations/management", () => ({
  removeCyberware: vi.fn(),
  removeBioware: vi.fn(),
  upgradeAugmentationGrade: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import {
  removeCyberware,
  removeBioware,
  upgradeAugmentationGrade,
} from "@/lib/rules/augmentations/management";
import { GET, PUT, DELETE } from "../route";
import type { Character, CyberwareItem, BiowareItem } from "@/lib/types";

// =============================================================================
// TEST CONSTANTS
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";
const TEST_AUGMENTATION_ID = "aug-789";

// =============================================================================
// MOCK DATA
// =============================================================================

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

function createMockCyberware(overrides: Partial<CyberwareItem> = {}): CyberwareItem {
  return {
    id: TEST_AUGMENTATION_ID,
    catalogId: "datajack",
    name: "Datajack",
    category: "headware",
    grade: "standard",
    baseEssenceCost: 0.1,
    essenceCost: 0.1,
    cost: 1000,
    availability: 2,
    ...overrides,
  };
}

function createMockBioware(overrides: Partial<BiowareItem> = {}): BiowareItem {
  return {
    id: TEST_AUGMENTATION_ID,
    catalogId: "muscle-toner-1",
    name: "Muscle Toner R1",
    category: "basic",
    grade: "standard",
    baseEssenceCost: 0.2,
    essenceCost: 0.2,
    cost: 16000,
    availability: 8,
    rating: 1,
    ...overrides,
  };
}

function createMockRequest(method: string, body?: Record<string, unknown>): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/augmentations/${TEST_AUGMENTATION_ID}`;
  return new NextRequest(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
  });
}

// =============================================================================
// TEST SUITE - GET
// =============================================================================

describe("GET /api/characters/[characterId]/augmentations/[augmentationId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest("GET");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
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

      const request = createMockRequest("GET");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
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

      const request = createMockRequest("GET");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe("Resource Not Found", () => {
    it("should return 404 when augmentation not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest("GET");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: "nonexistent",
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Augmentation not found");
    });
  });

  describe("Success Cases", () => {
    it("should return cyberware details", async () => {
      const cyberware = createMockCyberware();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberware: [cyberware] }));

      const request = createMockRequest("GET");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.augmentation).toBeDefined();
      expect(data.augmentation.id).toBe(TEST_AUGMENTATION_ID);
      expect(data.type).toBe("cyberware");
    });

    it("should return bioware details", async () => {
      const bioware = createMockBioware();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ bioware: [bioware] }));

      const request = createMockRequest("GET");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.augmentation).toBeDefined();
      expect(data.type).toBe("bioware");
    });

    it("should find augmentation by catalogId", async () => {
      const cyberware = createMockCyberware({
        id: "different-id",
        catalogId: TEST_AUGMENTATION_ID,
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberware: [cyberware] }));

      const request = createMockRequest("GET");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});

// =============================================================================
// TEST SUITE - PUT
// =============================================================================

describe("PUT /api/characters/[characterId]/augmentations/[augmentationId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest("PUT", { newGrade: "alpha" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest("PUT", { newGrade: "alpha" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it("should return 403 when user does not own character", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ ownerId: "other-user-id" }));

      const request = createMockRequest("PUT", { newGrade: "alpha" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe("Input Validation", () => {
    it("should return 400 when newGrade is missing", async () => {
      const cyberware = createMockCyberware();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberware: [cyberware] }));

      const request = createMockRequest("PUT", {});
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("newGrade is required for update");
    });
  });

  describe("Resource Not Found", () => {
    it("should return 404 when augmentation not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest("PUT", { newGrade: "alpha" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Augmentation not found");
    });
  });

  describe("Upgrade Failures", () => {
    it("should return 400 when upgrade fails", async () => {
      const cyberware = createMockCyberware();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberware: [cyberware] }));
      vi.mocked(upgradeAugmentationGrade).mockReturnValue({
        success: false,
        error: "Invalid grade transition",
        code: "INVALID_GRADE_TRANSITION",
      });

      const request = createMockRequest("PUT", { newGrade: "invalid" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid grade transition");
    });
  });

  describe("Success Cases", () => {
    it("should successfully upgrade cyberware grade", async () => {
      const cyberware = createMockCyberware();
      const upgradedCyberware = createMockCyberware({
        grade: "alpha",
        essenceCost: 0.08,
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberware: [cyberware] }));
      vi.mocked(upgradeAugmentationGrade).mockReturnValue({
        success: true,
        character: createMockCharacter({ cyberware: [upgradedCyberware] }),
        upgradedItem: upgradedCyberware,
        essenceRefund: 0.02,
        costDifference: 500,
      });
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest("PUT", { newGrade: "alpha" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.augmentation.grade).toBe("alpha");
      expect(data.essenceRefund).toBe(0.02);
    });

    it("should create audit trail for upgrade", async () => {
      const cyberware = createMockCyberware({ name: "Datajack" });
      const upgradedCyberware = createMockCyberware({
        grade: "alpha",
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberware: [cyberware] }));
      vi.mocked(upgradeAugmentationGrade).mockReturnValue({
        success: true,
        character: createMockCharacter(),
        upgradedItem: upgradedCyberware,
        essenceRefund: 0.02,
        costDifference: 500,
      });
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest("PUT", { newGrade: "alpha" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      await PUT(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.any(Object),
        expect.objectContaining({
          action: "augmentation_upgraded",
          details: expect.objectContaining({
            augmentationId: TEST_AUGMENTATION_ID,
            name: "Datajack",
            previousGrade: "standard",
            newGrade: "alpha",
          }),
        })
      );
    });
  });
});

// =============================================================================
// TEST SUITE - DELETE
// =============================================================================

describe("DELETE /api/characters/[characterId]/augmentations/[augmentationId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest("DELETE");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
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

      const request = createMockRequest("DELETE");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it("should return 403 when user does not own character", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ ownerId: "other-user-id" }));

      const request = createMockRequest("DELETE");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  describe("Resource Not Found", () => {
    it("should return 404 when augmentation not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

      const request = createMockRequest("DELETE");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Augmentation not found");
    });
  });

  describe("Success Cases", () => {
    it("should successfully remove cyberware", async () => {
      const cyberware = createMockCyberware();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberware: [cyberware] }));
      vi.mocked(removeCyberware).mockReturnValue({
        success: true,
        character: createMockCharacter(),
        removedItem: cyberware,
        essenceRestored: 0.1,
      });
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest("DELETE");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.removedItem).toBeDefined();
      expect(data.essenceRestored).toBe(0.1);
    });

    it("should successfully remove bioware", async () => {
      const bioware = createMockBioware();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ bioware: [bioware] }));
      vi.mocked(removeBioware).mockReturnValue({
        success: true,
        character: createMockCharacter(),
        removedItem: bioware,
        essenceRestored: 0.2,
      });
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest("DELETE");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.essenceRestored).toBe(0.2);
    });

    it("should create audit trail for removal", async () => {
      const cyberware = createMockCyberware({ name: "Datajack" });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ cyberware: [cyberware] }));
      vi.mocked(removeCyberware).mockReturnValue({
        success: true,
        character: createMockCharacter(),
        removedItem: cyberware,
        essenceRestored: 0.1,
      });
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(createMockCharacter());

      const request = createMockRequest("DELETE");
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        augmentationId: TEST_AUGMENTATION_ID,
      });

      await DELETE(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.any(Object),
        expect.objectContaining({
          action: "augmentation_removed",
          details: expect.objectContaining({
            augmentationId: TEST_AUGMENTATION_ID,
            type: "cyberware",
            name: "Datajack",
          }),
        })
      );
    });
  });
});
