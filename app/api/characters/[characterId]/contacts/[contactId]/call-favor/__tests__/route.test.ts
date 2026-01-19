/**
 * Integration tests for Call Favor API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/contacts/[contactId]/call-favor - Call a favor from a contact
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/users", () => ({
  getUserById: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  saveCharacter: vi.fn(),
}));

vi.mock("@/lib/storage/contacts", () => ({
  getCharacterContact: vi.fn(),
  updateCharacterContact: vi.fn(),
  burnContact: vi.fn(),
}));

vi.mock("@/lib/storage/favor-ledger", () => ({
  addFavorTransaction: vi.fn(),
}));

vi.mock("@/lib/rules/merge", () => ({
  loadAndMergeRuleset: vi.fn(),
}));

vi.mock("@/lib/rules/favors", () => ({
  canCallFavor: vi.fn(),
  resolveFavorCall: vi.fn(),
  calculateFavorCost: vi.fn(),
  getAvailableServices: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { getCharacterContact, updateCharacterContact, burnContact } from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import {
  canCallFavor,
  resolveFavorCall,
  calculateFavorCost,
  getAvailableServices,
} from "@/lib/rules/favors";
import { POST } from "../route";
import type { Character, User } from "@/lib/types";
import type { SocialContact, FavorServiceDefinition, FavorTransaction } from "@/lib/types/contacts";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";
const TEST_CONTACT_ID = "contact-789";
const TEST_SERVICE_ID = "service-info-gathering";

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: TEST_USER_ID,
    username: "testuser",
    email: "test@example.com",
    passwordHash: "hashedpassword",
    role: "player",
    createdAt: new Date().toISOString(),
    ...overrides,
  } as User;
}

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
    karmaCurrent: 10,
    karmaTotal: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    contacts: [],
    ...overrides,
  } as Character;
}

function createMockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: TEST_CONTACT_ID,
    characterId: TEST_CHARACTER_ID,
    name: "Fixer",
    connection: 4,
    loyalty: 3,
    archetype: "Fixer",
    status: "active",
    favorBalance: 0,
    group: "personal",
    visibility: {
      playerVisible: true,
      showConnection: true,
      showLoyalty: true,
      showFavorBalance: true,
      showSpecializations: true,
    },
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockService(
  overrides: Partial<FavorServiceDefinition> = {}
): FavorServiceDefinition {
  return {
    id: TEST_SERVICE_ID,
    name: "Information Gathering",
    description: "Gather intel on a target",
    minimumConnection: 2,
    minimumLoyalty: 1,
    favorCost: 1,
    riskLevel: "low",
    burnRiskOnFailure: false,
    opposedTest: false,
    threshold: 2,
    typicalTime: "1 day",
    canRush: true,
    rushCostMultiplier: 2,
    ...overrides,
  };
}

function createMockTransaction(overrides: Partial<FavorTransaction> = {}): FavorTransaction {
  return {
    id: "trans-001",
    characterId: TEST_CHARACTER_ID,
    contactId: TEST_CONTACT_ID,
    type: "favor_called",
    description: "Called in a favor",
    favorChange: -1,
    requiresGmApproval: false,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function createMockRuleset(services: FavorServiceDefinition[] = []) {
  return {
    edition: { code: "sr5", name: "Shadowrun 5th Edition" },
    modules: {
      favorServices: {
        services,
      },
    },
  };
}

function createMockRequest(options: { method?: string; body?: unknown }) {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/contacts/${TEST_CONTACT_ID}/call-favor`;
  const request = new NextRequest(url, {
    method: options.method || "POST",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  return request;
}

// =============================================================================
// POST /api/characters/[characterId]/contacts/[contactId]/call-favor
// =============================================================================

describe("POST /api/characters/[characterId]/contacts/[contactId]/call-favor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Auth/Resource Tests
  // ---------------------------------------------------------------------------

  describe("Auth/Resource Tests", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });

    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });

    it("should return 404 when contact not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(null);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Contact not found");
    });

    it("should return 500 when ruleset fails to load", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: false,
        error: "Failed to load ruleset",
      });

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to load ruleset");
    });
  });

  // ---------------------------------------------------------------------------
  // Request Validation Tests
  // ---------------------------------------------------------------------------

  describe("Request Validation Tests", () => {
    it("should return 400 when serviceId missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());

      const request = createMockRequest({
        method: "POST",
        body: { diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Service ID is required");
    });

    it("should return 400 when diceRoll missing", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Dice roll must be a non-negative number");
    });

    it("should return 400 when diceRoll negative", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: -1 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Dice roll must be a non-negative number");
    });

    it("should return 400 when diceRoll not a number", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: "three" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Dice roll must be a non-negative number");
    });
  });

  // ---------------------------------------------------------------------------
  // Service Validation Tests
  // ---------------------------------------------------------------------------

  describe("Service Validation Tests", () => {
    it("should return 404 when service not found in ruleset", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([]) as never,
      });

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: "nonexistent-service", diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain("not found");
    });

    it("should return 400 when contact cannot provide service", async () => {
      const mockService = createMockService();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([]); // Contact can't provide this service

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("cannot provide service");
    });

    it("should return 400 when canCallFavor fails", async () => {
      const mockService = createMockService();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({
        allowed: false,
        reasons: ["Contact loyalty too low"],
        warnings: [],
      });

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Cannot call favor");
      expect(data.reasons).toContain("Contact loyalty too low");
    });
  });

  // ---------------------------------------------------------------------------
  // Success Path Tests
  // ---------------------------------------------------------------------------

  describe("Success Path Tests", () => {
    it("should call favor successfully", async () => {
      const mockService = createMockService();
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter({ nuyen: 5000, karmaCurrent: 10 });
      const updatedContact = createMockContact({ favorBalance: -1 });
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 100,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 100, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Intel gathered successfully",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 4 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.resolution).toBeDefined();
      expect(data.resolution.success).toBe(true);
      expect(data.resolution.netHits).toBe(2);
      expect(data.costs).toBeDefined();
      expect(data.contact).toBeDefined();
      expect(data.transaction).toBeDefined();
    });

    it("should apply rush job cost", async () => {
      const mockService = createMockService({ canRush: true, rushCostMultiplier: 2 });
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter({ nuyen: 5000 });
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 200, // Rush job doubles the cost
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 200, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Rush job completed",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 4, rushJob: true },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(calculateFavorCost).toHaveBeenCalledWith(
        mockService,
        mockContact,
        mockCharacter,
        true // rushJob flag
      );
    });

    it("should deduct nuyen from character", async () => {
      const mockService = createMockService();
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter({ nuyen: 5000 });
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 500,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 500, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Completed",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 4 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(saveCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          nuyen: 4500, // 5000 - 500
        })
      );
    });

    it("should deduct karma from character", async () => {
      const mockService = createMockService();
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter({ karmaCurrent: 10 });
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 3,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 3, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Completed",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 4 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(saveCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          karmaCurrent: 7, // 10 - 3
        })
      );
    });

    it("should update contact favor balance and loyalty", async () => {
      const mockService = createMockService();
      const mockContact = createMockContact({ favorBalance: 2, loyalty: 3 });
      const mockCharacter = createMockCharacter();
      const updatedContact = createMockContact({ favorBalance: 1, loyalty: 4 });
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 4,
        favorConsumed: 1,
        loyaltyChange: 1, // Loyalty increased
        connectionChange: 0,
        burned: false,
        serviceResult: "Exceptional success",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 6 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(updateCharacterContact).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        TEST_CONTACT_ID,
        expect.objectContaining({
          favorBalance: 1, // 2 - 1
          loyalty: 4, // 3 + 1
        })
      );
    });

    it("should record favor transaction", async () => {
      const mockService = createMockService();
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 100,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 100, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Intel gathered",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 4 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(addFavorTransaction).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          contactId: TEST_CONTACT_ID,
          type: "favor_called",
          favorChange: -1,
          serviceId: TEST_SERVICE_ID,
          nuyenSpent: 100,
          rollResult: 4,
          success: true,
        })
      );
    });

    it("should handle glitch in resolution", async () => {
      const mockService = createMockService();
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 1,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        glitch: true,
        criticalGlitch: false,
        serviceResult: "Success with complications",
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.resolution.glitch).toBe(true);
      expect(data.resolution.criticalGlitch).toBe(false);
    });

    it("should return warnings", async () => {
      const mockService = createMockService();
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({
        allowed: true,
        reasons: [],
        warnings: ["Contact is near burn threshold"],
      });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Completed",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 4 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.warnings).toContain("Contact is near burn threshold");
    });
  });

  // ---------------------------------------------------------------------------
  // Contact Burn Tests
  // ---------------------------------------------------------------------------

  describe("Contact Burn Tests", () => {
    it("should burn contact when resolution.burned is true", async () => {
      const mockService = createMockService({ burnRiskOnFailure: true });
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const burnedContact = createMockContact({ status: "burned" });
      const mockTransaction = createMockTransaction({ type: "favor_failed" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: false,
        netHits: -2,
        favorConsumed: 1,
        loyaltyChange: -1,
        connectionChange: 0,
        burned: true,
        burnReason: "Critical failure resulted in exposure",
        serviceResult: "Complete failure",
        glitch: true,
        criticalGlitch: true,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(burnContact).mockResolvedValue(burnedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 0 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.resolution.burned).toBe(true);
      expect(burnContact).toHaveBeenCalled();
      expect(updateCharacterContact).not.toHaveBeenCalled();
    });

    it("should record burn reason", async () => {
      const mockService = createMockService({ burnRiskOnFailure: true });
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const burnedContact = createMockContact({ status: "burned" });
      const mockTransaction = createMockTransaction({ type: "favor_failed" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: false,
        netHits: -2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: true,
        burnReason: "Got caught by rival gang",
        serviceResult: "Failed",
        glitch: true,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(burnContact).mockResolvedValue(burnedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 0 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(burnContact).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        TEST_CONTACT_ID,
        "Got caught by rival gang"
      );
    });

    it("should use default burn reason", async () => {
      const mockService = createMockService({ burnRiskOnFailure: true });
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const burnedContact = createMockContact({ status: "burned" });
      const mockTransaction = createMockTransaction({ type: "favor_failed" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: false,
        netHits: -2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: true,
        // No burnReason provided
        serviceResult: "Failed",
        glitch: true,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(burnContact).mockResolvedValue(burnedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 0 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(burnContact).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        TEST_CONTACT_ID,
        "Contact burned due to failed favor"
      );
    });

    it("should record favor_failed transaction when failed", async () => {
      const mockService = createMockService();
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction({ type: "favor_failed" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: false,
        netHits: 0,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Contact couldn't deliver",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 1 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(addFavorTransaction).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          type: "favor_failed",
          success: false,
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Edge Case Tests
  // ---------------------------------------------------------------------------

  describe("Edge Case Tests", () => {
    it("should handle optional opposingRoll", async () => {
      const mockService = createMockService({ opposedTest: true });
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 1,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Won opposed test",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 4, opposingRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(resolveFavorCall).toHaveBeenCalledWith(
        mockContact,
        mockService,
        mockCharacter,
        4,
        3 // opposingRoll
      );
    });

    it("should handle optional rushJob flag", async () => {
      const mockService = createMockService({ canRush: true });
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Completed",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 4, rushJob: false },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(calculateFavorCost).toHaveBeenCalledWith(
        mockService,
        mockContact,
        mockCharacter,
        false
      );
    });

    it("should include notes in transaction", async () => {
      const mockService = createMockService();
      const mockContact = createMockContact();
      const mockCharacter = createMockCharacter();
      const updatedContact = createMockContact();
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(loadAndMergeRuleset).mockResolvedValue({
        success: true,
        ruleset: createMockRuleset([mockService]) as never,
      });
      vi.mocked(getAvailableServices).mockReturnValue([mockService]);
      vi.mocked(canCallFavor).mockReturnValue({ allowed: true, reasons: [], warnings: [] });
      vi.mocked(calculateFavorCost).mockReturnValue({
        nuyenCost: 0,
        karmaCost: 0,
        favorCost: 1,
        totalCost: { nuyen: 0, karma: 0, favors: 1 },
      });
      vi.mocked(resolveFavorCall).mockReturnValue({
        success: true,
        netHits: 2,
        favorConsumed: 1,
        loyaltyChange: 0,
        connectionChange: 0,
        burned: false,
        serviceResult: "Got the intel",
        glitch: false,
        criticalGlitch: false,
      });
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: {
          serviceId: TEST_SERVICE_ID,
          diceRoll: 4,
          notes: "Needed info on Renraku black site",
        },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(addFavorTransaction).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          description: expect.stringContaining("Needed info on Renraku black site"),
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Error Handling
  // ---------------------------------------------------------------------------

  describe("Error Handling", () => {
    it("should return 500 on storage error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockRejectedValue(new Error("Storage error"));

      const request = createMockRequest({
        method: "POST",
        body: { serviceId: TEST_SERVICE_ID, diceRoll: 3 },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to call favor");
    });
  });
});
