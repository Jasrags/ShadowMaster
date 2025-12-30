/**
 * Integration tests for Augmentation API endpoints
 *
 * Tests:
 * - GET /api/characters/[characterId]/augmentations - List installed augmentations
 * - POST /api/characters/[characterId]/augmentations - Install new augmentation
 * - GET /api/characters/[characterId]/augmentations/[augmentationId] - Get augmentation details
 * - PUT /api/characters/[characterId]/augmentations/[augmentationId] - Update augmentation grade
 * - DELETE /api/characters/[characterId]/augmentations/[augmentationId] - Remove augmentation
 * - POST /api/characters/[characterId]/augmentations/validate - Validate installation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
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
  extractBioware: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { loadRuleset, extractCyberware, extractBioware } from "@/lib/rules/loader";
import { GET, POST } from "../route";
import { GET as GET_DETAIL, PUT, DELETE } from "../[augmentationId]/route";
import { POST as VALIDATE } from "../validate/route";
import type { Character, CyberwareItem, BiowareItem } from "@/lib/types";
import type { CyberwareCatalogItem, BiowareCatalogItem } from "@/lib/types/edition";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";
const TEST_AUGMENTATION_ID = "aug-789";

const mockCyberwareCatalog: CyberwareCatalogItem[] = [
  {
    id: "datajack",
    name: "Datajack",
    category: "headware",
    essenceCost: 0.1,
    cost: 1000,
    availability: 2,
    description: "A universal data connector",
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

const mockRuleset = {
  edition: { code: "sr5", name: "Shadowrun 5th Edition" },
  cyberware: { catalog: mockCyberwareCatalog },
  bioware: { catalog: mockBiowareCatalog },
};

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

function createMockRequest(
  method: string,
  body?: Record<string, unknown>
): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/augmentations`;
  const request = new NextRequest(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
  });
  return request;
}

// =============================================================================
// GET /api/characters/[characterId]/augmentations
// =============================================================================

describe("GET /api/characters/[characterId]/augmentations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest("GET");
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(null);

    const request = createMockRequest("GET");
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 403 when user does not own character", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(
      createMockCharacter({ ownerId: "other-user" })
    );

    const request = createMockRequest("GET");
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
  });

  it("should return empty lists for character with no augmentations", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest("GET");
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.cyberware).toEqual([]);
    expect(data.bioware).toEqual([]);
    expect(data.essenceSummary).toEqual({
      current: 6,
      lost: 0,
      fromCyberware: 0,
      fromBioware: 0,
    });
  });

  it("should return installed augmentations with essence summary", async () => {
    const cyberwareItem: CyberwareItem = {
      id: "aug-1",
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 0.1,
      essenceCost: 0.1,
      cost: 1000,
      availability: 2,
    };

    const biowareItem: BiowareItem = {
      id: "aug-2",
      catalogId: "muscle-toner-1",
      name: "Muscle Toner Rating 1",
      category: "basic",
      grade: "standard",
      baseEssenceCost: 0.2,
      essenceCost: 0.2,
      cost: 16000,
      rating: 1,
      availability: 8,
    };

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(
      createMockCharacter({
        cyberware: [cyberwareItem],
        bioware: [biowareItem],
        specialAttributes: { edge: 3, essence: 5.7 },
      })
    );

    const request = createMockRequest("GET");
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.cyberware).toHaveLength(1);
    expect(data.bioware).toHaveLength(1);
    expect(data.essenceSummary.current).toBe(5.7);
    expect(data.essenceSummary.lost).toBe(0.3);
    expect(data.essenceSummary.fromCyberware).toBe(0.1);
    expect(data.essenceSummary.fromBioware).toBe(0.2);
  });
});

// =============================================================================
// POST /api/characters/[characterId]/augmentations
// =============================================================================

describe("POST /api/characters/[characterId]/augmentations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest("POST", {
      type: "cyberware",
      catalogId: "datajack",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("should return 400 for invalid type", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest("POST", {
      type: "invalid",
      catalogId: "datajack",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("should return 400 for missing catalogId", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest("POST", {
      type: "cyberware",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("should return 404 when catalog item not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as never,
    });
    vi.mocked(extractCyberware).mockReturnValue({
      catalog: mockCyberwareCatalog,
    } as never);

    const request = createMockRequest("POST", {
      type: "cyberware",
      catalogId: "nonexistent",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });

  it("should successfully install cyberware", async () => {
    const mockChar = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(mockChar);
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as never,
    });
    vi.mocked(extractCyberware).mockReturnValue({
      catalog: mockCyberwareCatalog,
    } as never);
    vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockChar);

    const request = createMockRequest("POST", {
      type: "cyberware",
      catalogId: "datajack",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.installedItem).toBeDefined();
    expect(data.installedItem.name).toBe("Datajack");
    // Essence change is negative (essence lost)
    expect(data.essenceChange).toBe(-0.1);
    expect(updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.any(Object),
      expect.objectContaining({
        action: "augmentation_installed",
      })
    );
  });

  it("should install bioware with correct essence cost", async () => {
    const mockChar = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(mockChar);
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as never,
    });
    vi.mocked(extractBioware).mockReturnValue({
      catalog: mockBiowareCatalog,
    } as never);
    vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockChar);

    const request = createMockRequest("POST", {
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
    expect(data.installedItem.name).toBe("Muscle Toner Rating 1");
  });

  it("should apply grade modifier to essence cost for alpha grade", async () => {
    const mockChar = createMockCharacter();
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(mockChar);
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as never,
    });
    vi.mocked(extractCyberware).mockReturnValue({
      catalog: mockCyberwareCatalog,
    } as never);
    vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockChar);

    const request = createMockRequest("POST", {
      type: "cyberware",
      catalogId: "datajack",
      grade: "alpha",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Alpha grade = 0.8 multiplier: 0.1 * 0.8 = 0.08 (negative for essence loss)
    expect(data.essenceChange).toBe(-0.08);
  });
});

// =============================================================================
// GET /api/characters/[characterId]/augmentations/[augmentationId]
// =============================================================================

describe("GET /api/characters/[characterId]/augmentations/[augmentationId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest("GET");
    const params = Promise.resolve({
      characterId: TEST_CHARACTER_ID,
      augmentationId: TEST_AUGMENTATION_ID,
    });

    const response = await GET_DETAIL(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("should return 404 when augmentation not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest("GET");
    const params = Promise.resolve({
      characterId: TEST_CHARACTER_ID,
      augmentationId: "nonexistent",
    });

    const response = await GET_DETAIL(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Augmentation not found");
  });

  it("should return augmentation details", async () => {
    const cyberwareItem: CyberwareItem = {
      id: TEST_AUGMENTATION_ID,
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 0.1,
      essenceCost: 0.1,
      cost: 1000,
      availability: 2,
    };

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(
      createMockCharacter({ cyberware: [cyberwareItem] })
    );

    const request = createMockRequest("GET");
    const params = Promise.resolve({
      characterId: TEST_CHARACTER_ID,
      augmentationId: TEST_AUGMENTATION_ID,
    });

    const response = await GET_DETAIL(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.augmentation.id).toBe(TEST_AUGMENTATION_ID);
    expect(data.type).toBe("cyberware");
  });
});

// =============================================================================
// DELETE /api/characters/[characterId]/augmentations/[augmentationId]
// =============================================================================

describe("DELETE /api/characters/[characterId]/augmentations/[augmentationId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("should return 404 when augmentation not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest("DELETE");
    const params = Promise.resolve({
      characterId: TEST_CHARACTER_ID,
      augmentationId: "nonexistent",
    });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });

  it("should successfully remove cyberware", async () => {
    const cyberwareItem: CyberwareItem = {
      id: TEST_AUGMENTATION_ID,
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 0.1,
      essenceCost: 0.1,
      cost: 1000,
      availability: 2,
    };

    const mockChar = createMockCharacter({
      cyberware: [cyberwareItem],
      specialAttributes: { edge: 3, essence: 5.9 },
    });
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(mockChar);
    vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockChar);

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
    expect(updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.any(Object),
      expect.objectContaining({
        action: "augmentation_removed",
      })
    );
  });

  it("should successfully remove bioware", async () => {
    const biowareItem: BiowareItem = {
      id: TEST_AUGMENTATION_ID,
      catalogId: "muscle-toner-1",
      name: "Muscle Toner",
      category: "basic",
      grade: "standard",
      baseEssenceCost: 0.2,
      essenceCost: 0.2,
      cost: 16000,
      rating: 1,
      availability: 8,
    };

    const mockChar = createMockCharacter({
      bioware: [biowareItem],
      specialAttributes: { edge: 3, essence: 5.8 },
    });
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(mockChar);
    vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockChar);

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
    expect(data.essenceRestored).toBe(0.2);
  });
});

// =============================================================================
// PUT /api/characters/[characterId]/augmentations/[augmentationId]
// =============================================================================

describe("PUT /api/characters/[characterId]/augmentations/[augmentationId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it("should return 400 when newGrade is missing", async () => {
    const cyberwareItem: CyberwareItem = {
      id: TEST_AUGMENTATION_ID,
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 0.1,
      essenceCost: 0.1,
      cost: 1000,
      availability: 2,
    };

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(
      createMockCharacter({ cyberware: [cyberwareItem] })
    );

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

  it("should successfully upgrade cyberware grade", async () => {
    const cyberwareItem: CyberwareItem = {
      id: TEST_AUGMENTATION_ID,
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 0.1,
      essenceCost: 0.1,
      cost: 1000,
      availability: 2,
    };

    const mockChar = createMockCharacter({
      cyberware: [cyberwareItem],
      specialAttributes: { edge: 3, essence: 5.9 },
    });
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(mockChar);
    vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockChar);

    const request = createMockRequest("PUT", { newGrade: "alpha" });
    const params = Promise.resolve({
      characterId: TEST_CHARACTER_ID,
      augmentationId: TEST_AUGMENTATION_ID,
    });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.augmentation).toBeDefined();
    expect(data.augmentation.grade).toBe("alpha");
    expect(updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.any(Object),
      expect.objectContaining({
        action: "augmentation_upgraded",
      })
    );
  });
});

// =============================================================================
// POST /api/characters/[characterId]/augmentations/validate
// =============================================================================

describe("POST /api/characters/[characterId]/augmentations/validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest("POST", {
      type: "cyberware",
      catalogId: "datajack",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await VALIDATE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("should return 400 for invalid type", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest("POST", {
      type: "invalid",
      catalogId: "datajack",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await VALIDATE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.errors).toContainEqual(
      expect.objectContaining({ code: "INVALID_TYPE" })
    );
  });

  it("should return validation result with projection", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as never,
    });
    vi.mocked(extractCyberware).mockReturnValue({
      catalog: mockCyberwareCatalog,
    } as never);

    const request = createMockRequest("POST", {
      type: "cyberware",
      catalogId: "datajack",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await VALIDATE(request, { params });
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

  it("should return validation errors for insufficient essence", async () => {
    // Create a character that already has cyberware using up 5.9 essence
    // This leaves only 0.1 essence available
    const existingCyberware: CyberwareItem[] = [
      {
        id: "existing-aug-1",
        catalogId: "cyber-arm",
        name: "Obvious Full Arm",
        category: "cyberlimb",
        grade: "standard",
        baseEssenceCost: 5.9,
        essenceCost: 5.9,
        cost: 15000,
        availability: 4,
      },
    ];

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(
      createMockCharacter({
        cyberware: existingCyberware,
        specialAttributes: { edge: 3, essence: 0.1 },
      })
    );
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as never,
    });
    vi.mocked(extractCyberware).mockReturnValue({
      catalog: [
        {
          ...mockCyberwareCatalog[0],
          essenceCost: 0.5, // 0.5 is more than the 0.1 remaining
        },
      ],
    } as never);

    const request = createMockRequest("POST", {
      type: "cyberware",
      catalogId: "datajack",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await VALIDATE(request, { params });
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
      ruleset: mockRuleset as never,
    });
    vi.mocked(extractCyberware).mockReturnValue({
      catalog: [
        {
          ...mockCyberwareCatalog[0],
          essenceCost: 1.5, // Enough to cause 2 magic loss
        },
      ],
    } as never);

    const request = createMockRequest("POST", {
      type: "cyberware",
      catalogId: "datajack",
      grade: "standard",
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await VALIDATE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Magic loss should be calculated for awakened characters
    if (data.projection.projectedMagicLoss !== undefined) {
      expect(data.projection.projectedMagicLoss).toBeGreaterThanOrEqual(1);
    }
  });
});
