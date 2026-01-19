/**
 * Integration tests for Favor Ledger API endpoints
 *
 * Tests:
 * - GET /api/characters/[characterId]/favor-ledger - Get favor ledger with transactions
 * - POST /api/characters/[characterId]/favor-ledger - Record a new favor transaction
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

vi.mock("@/lib/storage/favor-ledger", () => ({
  getFavorLedger: vi.fn(),
  addFavorTransaction: vi.fn(),
  getContactTransactions: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import {
  getFavorLedger,
  addFavorTransaction,
  getContactTransactions,
} from "@/lib/storage/favor-ledger";
import { GET, POST } from "../route";
import type { Character, User } from "@/lib/types";
import type { FavorLedger, FavorTransaction } from "@/lib/types/contacts";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";
const TEST_CONTACT_ID = "contact-789";
const TEST_SESSION_ID = "session-012";
const TEST_TRANSACTION_ID = "transaction-345";

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

function createMockFavorLedger(overrides: Partial<FavorLedger> = {}): FavorLedger {
  return {
    characterId: TEST_CHARACTER_ID,
    transactions: [],
    totalFavorsCalled: 0,
    totalFavorsOwed: 0,
    totalNuyenSpent: 0,
    totalKarmaSpent: 0,
    burnedContactsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockFavorTransaction(overrides: Partial<FavorTransaction> = {}): FavorTransaction {
  return {
    id: TEST_TRANSACTION_ID,
    characterId: TEST_CHARACTER_ID,
    contactId: TEST_CONTACT_ID,
    type: "favor_called",
    description: "Called in a favor for information",
    favorChange: -1,
    requiresGmApproval: false,
    timestamp: new Date().toISOString(),
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
    options.url || `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/favor-ledger`;
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
// GET /api/characters/[characterId]/favor-ledger
// =============================================================================

describe("GET /api/characters/[characterId]/favor-ledger", () => {
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

  it("should return ledger with all transactions", async () => {
    const transactions = [
      createMockFavorTransaction({ id: "tx-1", favorChange: -1 }),
      createMockFavorTransaction({ id: "tx-2", favorChange: 2 }),
    ];
    const mockLedger = createMockFavorLedger({ transactions });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getFavorLedger).mockResolvedValue(mockLedger);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.ledger).toBeDefined();
    expect(data.transactions).toHaveLength(2);
    expect(data.count).toBe(2);
  });

  it("should return empty transactions for new ledger", async () => {
    const mockLedger = createMockFavorLedger({ transactions: [] });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getFavorLedger).mockResolvedValue(mockLedger);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.transactions).toHaveLength(0);
    expect(data.count).toBe(0);
  });

  it("should filter by contactId (calls getContactTransactions)", async () => {
    const contactTransactions = [
      createMockFavorTransaction({ id: "tx-1", contactId: TEST_CONTACT_ID }),
    ];
    const mockLedger = createMockFavorLedger({
      transactions: [
        ...contactTransactions,
        createMockFavorTransaction({ id: "tx-2", contactId: "other-contact" }),
      ],
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getFavorLedger).mockResolvedValue(mockLedger);
    vi.mocked(getContactTransactions).mockResolvedValue(contactTransactions);

    const request = createMockRequest({
      method: "GET",
      searchParams: { contactId: TEST_CONTACT_ID },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.transactions).toHaveLength(1);
    expect(getContactTransactions).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      TEST_CONTACT_ID
    );
  });

  it("should filter by sessionId", async () => {
    const mockLedger = createMockFavorLedger({
      transactions: [
        createMockFavorTransaction({ id: "tx-1", sessionId: TEST_SESSION_ID }),
        createMockFavorTransaction({ id: "tx-2", sessionId: "other-session" }),
        createMockFavorTransaction({ id: "tx-3", sessionId: TEST_SESSION_ID }),
      ],
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getFavorLedger).mockResolvedValue(mockLedger);

    const request = createMockRequest({
      method: "GET",
      searchParams: { sessionId: TEST_SESSION_ID },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.transactions).toHaveLength(2);
    expect(data.transactions.every((t: FavorTransaction) => t.sessionId === TEST_SESSION_ID)).toBe(
      true
    );
  });

  it("should combine contactId + sessionId filters", async () => {
    const contactTransactions = [
      createMockFavorTransaction({
        id: "tx-1",
        contactId: TEST_CONTACT_ID,
        sessionId: TEST_SESSION_ID,
      }),
      createMockFavorTransaction({
        id: "tx-2",
        contactId: TEST_CONTACT_ID,
        sessionId: "other-session",
      }),
    ];

    const mockLedger = createMockFavorLedger({
      transactions: contactTransactions,
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getFavorLedger).mockResolvedValue(mockLedger);
    vi.mocked(getContactTransactions).mockResolvedValue(contactTransactions);

    const request = createMockRequest({
      method: "GET",
      searchParams: { contactId: TEST_CONTACT_ID, sessionId: TEST_SESSION_ID },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.transactions).toHaveLength(1);
    expect(data.transactions[0].sessionId).toBe(TEST_SESSION_ID);
  });

  it("should return correct count", async () => {
    const transactions = [
      createMockFavorTransaction({ id: "tx-1" }),
      createMockFavorTransaction({ id: "tx-2" }),
      createMockFavorTransaction({ id: "tx-3" }),
      createMockFavorTransaction({ id: "tx-4" }),
      createMockFavorTransaction({ id: "tx-5" }),
    ];
    const mockLedger = createMockFavorLedger({ transactions });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getFavorLedger).mockResolvedValue(mockLedger);

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.count).toBe(5);
  });

  it("should return 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(getFavorLedger).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({ method: "GET" });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get favor ledger");
  });
});

// =============================================================================
// POST /api/characters/[characterId]/favor-ledger
// =============================================================================

describe("POST /api/characters/[characterId]/favor-ledger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const request = createMockRequest({
      method: "POST",
      body: { contactId: TEST_CONTACT_ID, type: "favor_called", favorChange: -1 },
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
      body: { contactId: TEST_CONTACT_ID, type: "favor_called", favorChange: -1 },
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
      body: { contactId: TEST_CONTACT_ID, type: "favor_called", favorChange: -1 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 400 when contactId missing", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest({
      method: "POST",
      body: { type: "favor_called", favorChange: -1 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Contact ID is required");
  });

  it("should return 400 when type missing", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest({
      method: "POST",
      body: { contactId: TEST_CONTACT_ID, favorChange: -1 },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Transaction type is required");
  });

  it("should return 400 when favorChange missing", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest({
      method: "POST",
      body: { contactId: TEST_CONTACT_ID, type: "favor_called" },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Favor change is required");
  });

  it("should return 400 when favorChange is null", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest({
      method: "POST",
      body: { contactId: TEST_CONTACT_ID, type: "favor_called", favorChange: null },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Favor change is required");
  });

  it("should create transaction with minimal fields (201)", async () => {
    const newTransaction = createMockFavorTransaction();
    const updatedLedger = createMockFavorLedger({ transactions: [newTransaction] });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(addFavorTransaction).mockResolvedValue(newTransaction);
    vi.mocked(getFavorLedger).mockResolvedValue(updatedLedger);

    const request = createMockRequest({
      method: "POST",
      body: {
        contactId: TEST_CONTACT_ID,
        type: "favor_called",
        description: "Called a favor",
        favorChange: -1,
      },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.transaction).toBeDefined();
  });

  it("should create transaction with all optional fields", async () => {
    const newTransaction = createMockFavorTransaction({
      loyaltyChange: 1,
      connectionChange: 0,
      nuyenSpent: 500,
      karmaSpent: 2,
      serviceType: "legwork",
      sessionId: TEST_SESSION_ID,
    });
    const updatedLedger = createMockFavorLedger({ transactions: [newTransaction] });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(addFavorTransaction).mockResolvedValue(newTransaction);
    vi.mocked(getFavorLedger).mockResolvedValue(updatedLedger);

    const fullRequest = {
      contactId: TEST_CONTACT_ID,
      type: "favor_granted",
      description: "Contact provided intel",
      favorChange: 2,
      loyaltyChange: 1,
      connectionChange: 0,
      nuyenSpent: 500,
      karmaSpent: 2,
      serviceType: "legwork",
      sessionId: TEST_SESSION_ID,
    };

    const request = createMockRequest({
      method: "POST",
      body: fullRequest,
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(addFavorTransaction).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
      contactId: TEST_CONTACT_ID,
      type: "favor_granted",
      description: "Contact provided intel",
      favorChange: 2,
      loyaltyChange: 1,
      connectionChange: 0,
      nuyenSpent: 500,
      karmaSpent: 2,
      serviceType: "legwork",
    });
  });

  it("should return transaction + updated ledger", async () => {
    const newTransaction = createMockFavorTransaction();
    const updatedLedger = createMockFavorLedger({
      transactions: [newTransaction],
      totalFavorsCalled: 1,
    });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(addFavorTransaction).mockResolvedValue(newTransaction);
    vi.mocked(getFavorLedger).mockResolvedValue(updatedLedger);

    const request = createMockRequest({
      method: "POST",
      body: {
        contactId: TEST_CONTACT_ID,
        type: "favor_called",
        description: "Called a favor",
        favorChange: -1,
      },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.transaction).toBeDefined();
    expect(data.ledger).toBeDefined();
    expect(data.ledger.totalFavorsCalled).toBe(1);
  });

  it("should return 500 on storage error", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(addFavorTransaction).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest({
      method: "POST",
      body: {
        contactId: TEST_CONTACT_ID,
        type: "favor_called",
        description: "Called a favor",
        favorChange: -1,
      },
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    const response = await POST(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to record transaction");
  });

  it("should verify addFavorTransaction called with correct args", async () => {
    const newTransaction = createMockFavorTransaction();
    const updatedLedger = createMockFavorLedger({ transactions: [newTransaction] });

    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getUserById).mockResolvedValue(createMockUser());
    vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(addFavorTransaction).mockResolvedValue(newTransaction);
    vi.mocked(getFavorLedger).mockResolvedValue(updatedLedger);

    const transactionRequest = {
      contactId: TEST_CONTACT_ID,
      type: "loyalty_change" as const,
      description: "Improved relationship",
      favorChange: 0,
      loyaltyChange: 1,
    };

    const request = createMockRequest({
      method: "POST",
      body: transactionRequest,
    });
    const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

    await POST(request, { params });

    expect(addFavorTransaction).toHaveBeenCalledWith(TEST_USER_ID, TEST_CHARACTER_ID, {
      contactId: TEST_CONTACT_ID,
      type: "loyalty_change",
      description: "Improved relationship",
      favorChange: 0,
      loyaltyChange: 1,
      connectionChange: undefined,
      nuyenSpent: undefined,
      karmaSpent: undefined,
      serviceType: undefined,
    });
  });
});
