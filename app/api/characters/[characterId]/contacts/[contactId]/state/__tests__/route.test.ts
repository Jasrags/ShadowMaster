/**
 * Integration tests for Contact State API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/contacts/[contactId]/state - State transitions (burn, reactivate, mark-missing, mark-deceased)
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
  burnContact: vi.fn(),
  reactivateContact: vi.fn(),
  updateCharacterContact: vi.fn(),
}));

vi.mock("@/lib/storage/favor-ledger", () => ({
  addFavorTransaction: vi.fn(),
}));

vi.mock("@/lib/rules/contacts", () => ({
  canBurnContact: vi.fn(),
  canReactivateContact: vi.fn(),
  isValidTransition: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import {
  getCharacterContact,
  burnContact,
  reactivateContact,
  updateCharacterContact,
} from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import { canBurnContact, canReactivateContact, isValidTransition } from "@/lib/rules/contacts";
import { POST } from "../route";
import type { Character, User } from "@/lib/types";
import type { SocialContact, FavorTransaction } from "@/lib/types/contacts";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";
const TEST_CONTACT_ID = "contact-789";

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
    name: "Street Doc",
    connection: 3,
    loyalty: 2,
    archetype: "Street Doc",
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

function createMockTransaction(overrides: Partial<FavorTransaction> = {}): FavorTransaction {
  return {
    id: "trans-001",
    characterId: TEST_CHARACTER_ID,
    contactId: TEST_CONTACT_ID,
    type: "contact_burned",
    description: "Contact burned",
    favorChange: 0,
    requiresGmApproval: false,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function createMockRequest(options: { method?: string; body?: unknown }) {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/contacts/${TEST_CONTACT_ID}/state`;
  const request = new NextRequest(url, {
    method: options.method || "POST",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  return request;
}

// =============================================================================
// POST /api/characters/[characterId]/contacts/[contactId]/state
// =============================================================================

describe("POST /api/characters/[characterId]/contacts/[contactId]/state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // General Tests
  // ---------------------------------------------------------------------------

  describe("General Tests", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({
        method: "POST",
        body: { action: "burn" },
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
        body: { action: "burn" },
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
        body: { action: "burn" },
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
        body: { action: "burn" },
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

    it("should return 400 for invalid action", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());

      const request = createMockRequest({
        method: "POST",
        body: { action: "invalid-action" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid action");
    });

    it("should return 400 for missing action", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());

      const request = createMockRequest({
        method: "POST",
        body: {},
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid action");
    });
  });

  // ---------------------------------------------------------------------------
  // Burn Action Tests
  // ---------------------------------------------------------------------------

  describe("Burn Action Tests", () => {
    it("should return 400 when isValidTransition returns false", async () => {
      const burnedContact = createMockContact({ status: "burned" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(burnedContact);
      vi.mocked(isValidTransition).mockReturnValue(false);

      const request = createMockRequest({
        method: "POST",
        body: { action: "burn" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cannot transition from burned to burned");
    });

    it("should return 400 when canBurnContact returns false", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(canBurnContact).mockReturnValue({
        allowed: false,
        reason: "Contact has outstanding favors owed",
      });

      const request = createMockRequest({
        method: "POST",
        body: { action: "burn" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Contact has outstanding favors owed");
    });

    it("should burn contact successfully", async () => {
      const mockContact = createMockContact();
      const burnedContact = createMockContact({ status: "burned" });
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(canBurnContact).mockReturnValue({ allowed: true });
      vi.mocked(burnContact).mockResolvedValue(burnedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "burn", reason: "Betrayed the team" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.contact).toBeDefined();
      expect(data.contact.status).toBe("burned");
      expect(data.transaction).toBeDefined();
    });

    it("should record transaction with reason", async () => {
      const mockContact = createMockContact();
      const burnedContact = createMockContact({ status: "burned" });
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(canBurnContact).mockReturnValue({ allowed: true });
      vi.mocked(burnContact).mockResolvedValue(burnedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "burn", reason: "Betrayed the team" },
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
        "Betrayed the team"
      );
      expect(addFavorTransaction).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          contactId: TEST_CONTACT_ID,
          type: "contact_burned",
          description: expect.stringContaining("Betrayed the team"),
        })
      );
    });

    it("should use default reason when not provided", async () => {
      const mockContact = createMockContact();
      const burnedContact = createMockContact({ status: "burned" });
      const mockTransaction = createMockTransaction();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(canBurnContact).mockReturnValue({ allowed: true });
      vi.mocked(burnContact).mockResolvedValue(burnedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "burn" },
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
        "No reason provided"
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Reactivate Action Tests
  // ---------------------------------------------------------------------------

  describe("Reactivate Action Tests", () => {
    it("should return 400 when isValidTransition returns false", async () => {
      const activeContact = createMockContact({ status: "active" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(activeContact);
      vi.mocked(isValidTransition).mockReturnValue(false);

      const request = createMockRequest({
        method: "POST",
        body: { action: "reactivate" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cannot transition from active to active");
    });

    it("should return 400 when canReactivateContact returns false", async () => {
      const burnedContact = createMockContact({ status: "burned" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ karmaCurrent: 0 }));
      vi.mocked(getCharacterContact).mockResolvedValue(burnedContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(canReactivateContact).mockReturnValue({
        allowed: false,
        reason: "Insufficient karma to reactivate",
        karmaCost: 5,
      });

      const request = createMockRequest({
        method: "POST",
        body: { action: "reactivate" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Insufficient karma to reactivate");
    });

    it("should reactivate contact successfully", async () => {
      const burnedContact = createMockContact({ status: "burned" });
      const activeContact = createMockContact({ status: "active" });
      const mockTransaction = createMockTransaction({ type: "contact_reactivated" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ karmaCurrent: 10 }));
      vi.mocked(getCharacterContact).mockResolvedValue(burnedContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(canReactivateContact).mockReturnValue({ allowed: true, karmaCost: 5 });
      vi.mocked(saveCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(reactivateContact).mockResolvedValue(activeContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "reactivate" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.contact).toBeDefined();
      expect(data.contact.status).toBe("active");
    });

    it("should deduct karma from character", async () => {
      const burnedContact = createMockContact({ status: "burned" });
      const activeContact = createMockContact({ status: "active" });
      const mockTransaction = createMockTransaction({ type: "contact_reactivated" });
      const mockCharacter = createMockCharacter({ karmaCurrent: 10 });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(getCharacterContact).mockResolvedValue(burnedContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(canReactivateContact).mockReturnValue({ allowed: true, karmaCost: 5 });
      vi.mocked(saveCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(reactivateContact).mockResolvedValue(activeContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "reactivate" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      await POST(request, { params });

      expect(saveCharacter).toHaveBeenCalledWith(
        expect.objectContaining({
          karmaCurrent: 5, // 10 - 5 = 5
        })
      );
    });

    it("should record transaction with karma spent", async () => {
      const burnedContact = createMockContact({ status: "burned" });
      const activeContact = createMockContact({ status: "active" });
      const mockTransaction = createMockTransaction({ type: "contact_reactivated" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ karmaCurrent: 10 }));
      vi.mocked(getCharacterContact).mockResolvedValue(burnedContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(canReactivateContact).mockReturnValue({ allowed: true, karmaCost: 5 });
      vi.mocked(saveCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(reactivateContact).mockResolvedValue(activeContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "reactivate", reason: "Made amends" },
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
          type: "contact_reactivated",
          karmaSpent: 5,
          description: expect.stringContaining("Made amends"),
        })
      );
    });

    it("should return karmaCost in response", async () => {
      const burnedContact = createMockContact({ status: "burned" });
      const activeContact = createMockContact({ status: "active" });
      const mockTransaction = createMockTransaction({ type: "contact_reactivated" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter({ karmaCurrent: 10 }));
      vi.mocked(getCharacterContact).mockResolvedValue(burnedContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(canReactivateContact).mockReturnValue({ allowed: true, karmaCost: 5 });
      vi.mocked(saveCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(reactivateContact).mockResolvedValue(activeContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "reactivate" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.karmaCost).toBe(5);
    });
  });

  // ---------------------------------------------------------------------------
  // Mark Missing/Deceased Tests
  // ---------------------------------------------------------------------------

  describe("Mark Missing/Deceased Tests", () => {
    it("should return 400 when isValidTransition returns false for mark-missing", async () => {
      const deceasedContact = createMockContact({ status: "deceased" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(deceasedContact);
      vi.mocked(isValidTransition).mockReturnValue(false);

      const request = createMockRequest({
        method: "POST",
        body: { action: "mark-missing" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Cannot transition from deceased to missing");
    });

    it("should mark contact as missing successfully", async () => {
      const activeContact = createMockContact({ status: "active" });
      const missingContact = createMockContact({ status: "missing" });
      const mockTransaction = createMockTransaction({ type: "status_change" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(activeContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(updateCharacterContact).mockResolvedValue(missingContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "mark-missing", reason: "Disappeared after job" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.contact).toBeDefined();
      expect(data.contact.status).toBe("missing");
    });

    it("should mark contact as deceased successfully", async () => {
      const activeContact = createMockContact({ status: "active" });
      const deceasedContact = createMockContact({ status: "deceased" });
      const mockTransaction = createMockTransaction({ type: "status_change" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(activeContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(updateCharacterContact).mockResolvedValue(deceasedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "mark-deceased", reason: "Killed in crossfire" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.contact).toBeDefined();
      expect(data.contact.status).toBe("deceased");
    });

    it("should record status_change transaction", async () => {
      const activeContact = createMockContact({ status: "active" });
      const missingContact = createMockContact({ status: "missing" });
      const mockTransaction = createMockTransaction({ type: "status_change" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(activeContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(updateCharacterContact).mockResolvedValue(missingContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "mark-missing", reason: "Lost contact" },
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
          type: "status_change",
          description: expect.stringContaining("missing"),
        })
      );
    });

    it("should use default reason when not provided", async () => {
      const activeContact = createMockContact({ status: "active" });
      const deceasedContact = createMockContact({ status: "deceased" });
      const mockTransaction = createMockTransaction({ type: "status_change" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(activeContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(updateCharacterContact).mockResolvedValue(deceasedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "mark-deceased" },
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
          description: expect.stringContaining("No details provided"),
        })
      );
    });

    it("should call updateCharacterContact with correct status", async () => {
      const activeContact = createMockContact({ status: "active" });
      const missingContact = createMockContact({ status: "missing" });
      const mockTransaction = createMockTransaction({ type: "status_change" });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(activeContact);
      vi.mocked(isValidTransition).mockReturnValue(true);
      vi.mocked(updateCharacterContact).mockResolvedValue(missingContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const request = createMockRequest({
        method: "POST",
        body: { action: "mark-missing" },
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
        { status: "missing" }
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
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockRejectedValue(new Error("Storage error"));

      const request = createMockRequest({
        method: "POST",
        body: { action: "burn" },
      });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        contactId: TEST_CONTACT_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to transition contact state");
    });
  });
});
