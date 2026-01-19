/**
 * Integration tests for Contact Detail API endpoints
 *
 * Tests:
 * - GET /api/characters/[characterId]/contacts/[contactId] - Get contact with transaction history
 * - PUT /api/characters/[characterId]/contacts/[contactId] - Update contact
 * - DELETE /api/characters/[characterId]/contacts/[contactId] - Remove contact
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
}));

vi.mock("@/lib/storage/contacts", () => ({
  getCharacterContact: vi.fn(),
  updateCharacterContact: vi.fn(),
  removeCharacterContact: vi.fn(),
}));

vi.mock("@/lib/storage/favor-ledger", () => ({
  getContactTransactions: vi.fn(),
}));

vi.mock("@/lib/rules/contacts", () => ({
  validateContact: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import {
  getCharacterContact,
  updateCharacterContact,
  removeCharacterContact,
} from "@/lib/storage/contacts";
import { getContactTransactions } from "@/lib/storage/favor-ledger";
import { validateContact } from "@/lib/rules/contacts";
import { GET, PUT, DELETE } from "../route";
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
    type: "favor_called",
    description: "Called in a favor",
    favorChange: -1,
    requiresGmApproval: false,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function createMockRequest(options: { method?: string; body?: unknown }) {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/contacts/${TEST_CONTACT_ID}`;
  const request = new NextRequest(url, {
    method: options.method || "GET",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  return request;
}

// =============================================================================
// GET /api/characters/[characterId]/contacts/[contactId]
// =============================================================================

describe("GET /api/characters/[characterId]/contacts/[contactId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(null);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(null);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await GET(request, { params });
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

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Contact not found");
  });

  it("should return contact with transaction history", async () => {
    const mockContact = createMockContact();
    const mockTransactions = [
      createMockTransaction({ id: "trans-1", description: "First favor" }),
      createMockTransaction({ id: "trans-2", description: "Second favor" }),
    ];

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
    vi.mocked(getContactTransactions).mockResolvedValue(mockTransactions);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contact).toBeDefined();
    expect(data.contact.id).toBe(TEST_CONTACT_ID);
    expect(data.transactions).toHaveLength(2);
  });

  it("should return contact with empty transactions", async () => {
    const mockContact = createMockContact();

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
    vi.mocked(getContactTransactions).mockResolvedValue([]);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contact).toBeDefined();
    expect(data.transactions).toEqual([]);
  });

  it("should return 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get contact");
  });
});

// =============================================================================
// PUT /api/characters/[characterId]/contacts/[contactId]
// =============================================================================

describe("PUT /api/characters/[characterId]/contacts/[contactId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({
      method: "PUT",
      body: { description: "Updated description" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(null);

    const request = createMockRequest({
      method: "PUT",
      body: { description: "Updated description" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await PUT(request, { params });
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
      method: "PUT",
      body: { description: "Updated description" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await PUT(request, { params });
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
      method: "PUT",
      body: { description: "Updated description" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Contact not found");
  });

  it("should update contact with partial data", async () => {
    const existingContact = createMockContact();
    const updatedContact = createMockContact({
      description: "Updated description",
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(existingContact);
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);

    const request = createMockRequest({
      method: "PUT",
      body: { description: "Updated description" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contact).toBeDefined();
    expect(data.contact.description).toBe("Updated description");
  });

  it("should merge updates with existing contact for validation", async () => {
    const existingContact = createMockContact({
      connection: 3,
      loyalty: 2,
    });
    const updatedContact = createMockContact({
      connection: 5,
      loyalty: 2,
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(existingContact);
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);

    const request = createMockRequest({
      method: "PUT",
      body: { connection: 5 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await PUT(request, { params });

    // Verify validateContact was called with merged data
    expect(validateContact).toHaveBeenCalledWith(
      expect.objectContaining({
        connection: 5,
        loyalty: 2,
      }),
      "sr5"
    );
    expect(response.status).toBe(200);
  });

  it("should return 400 when validation fails", async () => {
    const existingContact = createMockContact();

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(existingContact);
    vi.mocked(validateContact).mockReturnValue({
      valid: false,
      errors: ["Connection must be between 1 and 12"],
      warnings: [],
    });

    const request = createMockRequest({
      method: "PUT",
      body: { connection: 15 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid contact update");
    expect(data.errors).toContain("Connection must be between 1 and 12");
  });

  it("should return warnings on success", async () => {
    const existingContact = createMockContact();
    const updatedContact = createMockContact({ connection: 10 });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(existingContact);
    vi.mocked(validateContact).mockReturnValue({
      valid: true,
      errors: [],
      warnings: ["High connection contacts may be difficult to reach"],
    });
    vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);

    const request = createMockRequest({
      method: "PUT",
      body: { connection: 10 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.warnings).toContain("High connection contacts may be difficult to reach");
  });

  it("should verify updateCharacterContact called with correct args", async () => {
    const existingContact = createMockContact();
    const updateData = { description: "New description", notes: "New notes" };
    const updatedContact = createMockContact(updateData);

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(existingContact);
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);

    const request = createMockRequest({
      method: "PUT",
      body: updateData,
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    await PUT(request, { params });

    expect(updateCharacterContact).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      TEST_CONTACT_ID,
      updateData
    );
  });

  it("should return 500 on storage error", async () => {
    const existingContact = createMockContact();

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(existingContact);
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(updateCharacterContact).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({
      method: "PUT",
      body: { description: "Updated" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to update contact");
  });
});

// =============================================================================
// DELETE /api/characters/[characterId]/contacts/[contactId]
// =============================================================================

describe("DELETE /api/characters/[characterId]/contacts/[contactId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(null);

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(null);

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await DELETE(request, { params });
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

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Contact not found");
  });

  it("should delete contact successfully", async () => {
    const mockContact = createMockContact();

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
    vi.mocked(removeCharacterContact).mockResolvedValue(true);

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Contact deleted successfully");
    expect(removeCharacterContact).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      TEST_CONTACT_ID
    );
  });

  it("should return 500 when removeCharacterContact returns false", async () => {
    const mockContact = createMockContact();

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
    vi.mocked(removeCharacterContact).mockResolvedValue(false);

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete contact");
  });

  it("should return 500 on storage error", async () => {
    const mockContact = createMockContact();

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
    vi.mocked(removeCharacterContact).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({ method: "DELETE" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID, contactId: TEST_CONTACT_ID });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete contact");
  });
});
