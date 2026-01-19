/**
 * Integration tests for Contacts API endpoints
 *
 * Tests:
 * - GET /api/characters/[characterId]/contacts - List character's contacts with filters
 * - POST /api/characters/[characterId]/contacts - Create a new contact
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
  getCharacterContacts: vi.fn(),
  addCharacterContact: vi.fn(),
}));

vi.mock("@/lib/storage/social-capital", () => ({
  getSocialCapital: vi.fn(),
}));

vi.mock("@/lib/rules/contacts", () => ({
  validateContact: vi.fn(),
  validateContactBudget: vi.fn(),
  validateContactAgainstCampaign: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { getCharacterContacts, addCharacterContact } from "@/lib/storage/contacts";
import { getSocialCapital } from "@/lib/storage/social-capital";
import {
  validateContact,
  validateContactBudget,
  validateContactAgainstCampaign,
} from "@/lib/rules/contacts";
import { GET, POST } from "../route";
import type { Character, User } from "@/lib/types";
import type { SocialContact, SocialCapital, CreateContactRequest } from "@/lib/types/contacts";

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

function createMockSocialCapital(overrides: Partial<SocialCapital> = {}): SocialCapital {
  return {
    characterId: TEST_CHARACTER_ID,
    maxContactPoints: 25,
    usedContactPoints: 5,
    availableContactPoints: 20,
    totalContacts: 1,
    activeContacts: 1,
    burnedContacts: 0,
    inactiveContacts: 0,
    networkingBonus: 0,
    socialLimitModifier: 0,
    loyaltyBonus: 0,
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockRequest(options: {
  method?: string;
  body?: unknown;
  url?: string;
  searchParams?: Record<string, string>;
}) {
  const baseUrl =
    options.url || `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/contacts`;
  const url = new URL(baseUrl);
  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  const request = new NextRequest(url, {
    method: options.method || "GET",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  // Set nextUrl for search params access
  Object.defineProperty(request, "nextUrl", { value: url, writable: false });
  return request;
}

// =============================================================================
// GET /api/characters/[characterId]/contacts
// =============================================================================

describe("GET /api/characters/[characterId]/contacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

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
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

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
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return contacts list successfully", async () => {
    const mockContacts = [
      createMockContact({ id: "contact-1", name: "Fixer" }),
      createMockContact({ id: "contact-2", name: "Street Doc" }),
    ];

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue(mockContacts);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contacts).toHaveLength(2);
    expect(data.count).toBe(2);
  });

  it("should filter by archetype (case-insensitive)", async () => {
    const mockContacts = [
      createMockContact({ id: "contact-1", name: "Doc", archetype: "Street Doc" }),
      createMockContact({ id: "contact-2", name: "Fix", archetype: "Fixer" }),
    ];

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue(mockContacts);

    const request = createMockRequest({
      method: "GET",
      searchParams: { archetype: "street doc" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contacts).toHaveLength(1);
    expect(data.contacts[0].name).toBe("Doc");
  });

  it("should filter by status", async () => {
    const mockContacts = [
      createMockContact({ id: "contact-1", name: "Active", status: "active" }),
      createMockContact({ id: "contact-2", name: "Burned", status: "burned" }),
    ];

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue(mockContacts);

    const request = createMockRequest({
      method: "GET",
      searchParams: { status: "burned" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contacts).toHaveLength(1);
    expect(data.contacts[0].name).toBe("Burned");
  });

  it("should filter by minConnection", async () => {
    const mockContacts = [
      createMockContact({ id: "contact-1", name: "Low", connection: 2 }),
      createMockContact({ id: "contact-2", name: "High", connection: 5 }),
    ];

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue(mockContacts);

    const request = createMockRequest({
      method: "GET",
      searchParams: { minConnection: "4" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contacts).toHaveLength(1);
    expect(data.contacts[0].name).toBe("High");
  });

  it("should filter by location (case-insensitive)", async () => {
    const mockContacts = [
      createMockContact({ id: "contact-1", name: "Downtown", location: "Downtown" }),
      createMockContact({ id: "contact-2", name: "Redmond", location: "Redmond Barrens" }),
    ];

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue(mockContacts);

    const request = createMockRequest({
      method: "GET",
      searchParams: { location: "downtown" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contacts).toHaveLength(1);
    expect(data.contacts[0].name).toBe("Downtown");
  });

  it("should apply multiple filters", async () => {
    const mockContacts = [
      createMockContact({
        id: "contact-1",
        name: "Match",
        archetype: "Fixer",
        status: "active",
        connection: 5,
      }),
      createMockContact({
        id: "contact-2",
        name: "Wrong Archetype",
        archetype: "Street Doc",
        status: "active",
        connection: 5,
      }),
      createMockContact({
        id: "contact-3",
        name: "Wrong Status",
        archetype: "Fixer",
        status: "burned",
        connection: 5,
      }),
      createMockContact({
        id: "contact-4",
        name: "Low Connection",
        archetype: "Fixer",
        status: "active",
        connection: 2,
      }),
    ];

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue(mockContacts);

    const request = createMockRequest({
      method: "GET",
      searchParams: { archetype: "Fixer", status: "active", minConnection: "4" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contacts).toHaveLength(1);
    expect(data.contacts[0].name).toBe("Match");
  });

  it("should handle invalid minConnection (NaN)", async () => {
    const mockContacts = [createMockContact({ id: "contact-1", name: "Contact", connection: 3 })];

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContacts).mockResolvedValue(mockContacts);

    const request = createMockRequest({
      method: "GET",
      searchParams: { minConnection: "invalid" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    // When minConnection is NaN, the filter is skipped
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contacts).toHaveLength(1);
  });

  it("should return 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getCharacterContacts).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get contacts");
  });
});

// =============================================================================
// POST /api/characters/[characterId]/contacts
// =============================================================================

describe("POST /api/characters/[characterId]/contacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({
      method: "POST",
      body: { name: "New Contact", connection: 3, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

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
      body: { name: "New Contact", connection: 3, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

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
      body: { name: "New Contact", connection: 3, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should create contact with minimal data successfully (201)", async () => {
    const newContact = createMockContact({ name: "New Contact" });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(getSocialCapital).mockResolvedValue(null);
    vi.mocked(validateContactBudget).mockReturnValue({
      allowed: true,
      pointsRequired: 5,
      pointsAvailable: 20,
    });
    vi.mocked(getCharacterContacts).mockResolvedValue([]);
    vi.mocked(addCharacterContact).mockResolvedValue(newContact);

    const request = createMockRequest({
      method: "POST",
      body: { name: "New Contact", connection: 3, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.contact).toBeDefined();
    expect(data.contact.name).toBe("New Contact");
  });

  it("should create contact with all optional fields", async () => {
    const fullRequest: CreateContactRequest = {
      name: "Mr. Johnson",
      connection: 5,
      loyalty: 3,
      archetype: "Mr. Johnson",
      description: "Corporate fixer",
      specializations: ["Jobs", "Intel"],
      location: "Downtown",
      organization: "Ares",
      metatype: "Human",
      notes: "Private notes",
      group: "personal",
      visibility: { playerVisible: true },
      favorBalance: 2,
    };

    const newContact = createMockContact({
      id: "new-contact-id",
      name: fullRequest.name,
      connection: fullRequest.connection,
      loyalty: fullRequest.loyalty,
      archetype: fullRequest.archetype,
      description: fullRequest.description,
      specializations: fullRequest.specializations,
      location: fullRequest.location,
      organization: fullRequest.organization,
      metatype: fullRequest.metatype,
      notes: fullRequest.notes,
      group: fullRequest.group,
      favorBalance: fullRequest.favorBalance,
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(getSocialCapital).mockResolvedValue(null);
    vi.mocked(validateContactBudget).mockReturnValue({
      allowed: true,
      pointsRequired: 8,
      pointsAvailable: 20,
    });
    vi.mocked(getCharacterContacts).mockResolvedValue([]);
    vi.mocked(addCharacterContact).mockResolvedValue(newContact);

    const request = createMockRequest({
      method: "POST",
      body: fullRequest,
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(addCharacterContact).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, fullRequest);
  });

  it("should return 400 when validateContact fails", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({
      valid: false,
      errors: ["Connection must be between 1 and 12"],
      warnings: [],
    });

    const request = createMockRequest({
      method: "POST",
      body: { name: "Invalid", connection: 15, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid contact");
    expect(data.errors).toContain("Connection must be between 1 and 12");
  });

  it("should return 400 when validateContactBudget fails (includes pointsRequired/pointsAvailable)", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(getSocialCapital).mockResolvedValue(
      createMockSocialCapital({ availableContactPoints: 5 })
    );
    vi.mocked(validateContactBudget).mockReturnValue({
      allowed: false,
      reason: "Insufficient contact points",
      pointsRequired: 10,
      pointsAvailable: 5,
    });

    const request = createMockRequest({
      method: "POST",
      body: { name: "Expensive", connection: 8, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Insufficient contact points");
    expect(data.pointsRequired).toBe(10);
    expect(data.pointsAvailable).toBe(5);
  });

  it("should return 400 when validateContactAgainstCampaign fails", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(getSocialCapital).mockResolvedValue(
      createMockSocialCapital({ campaignMaxConnection: 4 })
    );
    vi.mocked(validateContactBudget).mockReturnValue({
      allowed: true,
      pointsRequired: 8,
      pointsAvailable: 20,
    });
    vi.mocked(validateContactAgainstCampaign).mockReturnValue({
      valid: false,
      errors: ["Connection exceeds campaign maximum of 4"],
      warnings: [],
    });

    const request = createMockRequest({
      method: "POST",
      body: { name: "High Connection", connection: 6, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Contact violates campaign constraints");
    expect(data.errors).toContain("Connection exceeds campaign maximum of 4");
  });

  it("should return 400 for duplicate contact name (case-insensitive)", async () => {
    const existingContact = createMockContact({ name: "Street Doc" });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(getSocialCapital).mockResolvedValue(null);
    vi.mocked(validateContactBudget).mockReturnValue({
      allowed: true,
      pointsRequired: 5,
      pointsAvailable: 20,
    });
    vi.mocked(getCharacterContacts).mockResolvedValue([existingContact]);

    const request = createMockRequest({
      method: "POST",
      body: { name: "STREET DOC", connection: 3, loyalty: 2, archetype: "Street Doc" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("A contact with this name already exists");
  });

  it("should return validation warnings on success", async () => {
    const newContact = createMockContact({ name: "New Contact" });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({
      valid: true,
      errors: [],
      warnings: ["High connection contacts may be difficult to reach"],
    });
    vi.mocked(getSocialCapital).mockResolvedValue(null);
    vi.mocked(validateContactBudget).mockReturnValue({
      allowed: true,
      pointsRequired: 12,
      pointsAvailable: 20,
    });
    vi.mocked(getCharacterContacts).mockResolvedValue([]);
    vi.mocked(addCharacterContact).mockResolvedValue(newContact);

    const request = createMockRequest({
      method: "POST",
      body: { name: "New Contact", connection: 10, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.warnings).toContain("High connection contacts may be difficult to reach");
  });

  it("should skip campaign validation when no socialCapital", async () => {
    const newContact = createMockContact({ name: "New Contact" });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(getSocialCapital).mockResolvedValue(null);
    vi.mocked(validateContactBudget).mockReturnValue({
      allowed: true,
      pointsRequired: 5,
      pointsAvailable: 20,
    });
    vi.mocked(getCharacterContacts).mockResolvedValue([]);
    vi.mocked(addCharacterContact).mockResolvedValue(newContact);

    const request = createMockRequest({
      method: "POST",
      body: { name: "New Contact", connection: 3, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(validateContactAgainstCampaign).not.toHaveBeenCalled();
  });

  it("should verify storage functions called with correct args", async () => {
    const newContact = createMockContact({ name: "Test Contact" });
    const contactRequest = {
      name: "Test Contact",
      connection: 3,
      loyalty: 2,
      archetype: "Fixer",
    };

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(getSocialCapital).mockResolvedValue(createMockSocialCapital());
    vi.mocked(validateContactBudget).mockReturnValue({
      allowed: true,
      pointsRequired: 5,
      pointsAvailable: 20,
    });
    vi.mocked(validateContactAgainstCampaign).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(getCharacterContacts).mockResolvedValue([]);
    vi.mocked(addCharacterContact).mockResolvedValue(newContact);

    const request = createMockRequest({
      method: "POST",
      body: contactRequest,
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await POST(request, { params });

    expect(getCharacter).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    expect(getSocialCapital).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    expect(getCharacterContacts).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID);
    expect(addCharacterContact).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      contactRequest
    );
  });

  it("should return 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(validateContact).mockReturnValue({ valid: true, errors: [], warnings: [] });
    vi.mocked(getSocialCapital).mockResolvedValue(null);
    vi.mocked(validateContactBudget).mockReturnValue({
      allowed: true,
      pointsRequired: 5,
      pointsAvailable: 20,
    });
    vi.mocked(getCharacterContacts).mockResolvedValue([]);
    vi.mocked(addCharacterContact).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({
      method: "POST",
      body: { name: "New Contact", connection: 3, loyalty: 2, archetype: "Fixer" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to create contact");
  });
});
