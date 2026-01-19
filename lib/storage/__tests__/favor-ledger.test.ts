/**
 * Unit tests for favor-ledger.ts storage module
 *
 * Tests favor ledger CRUD and query operations with VI mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FavorLedger, FavorTransaction, FavorTransactionType } from "@/lib/types/contacts";

// Mock the base storage module
vi.mock("../base", () => {
  const storage = new Map<string, unknown>();
  return {
    ensureDirectory: vi.fn().mockResolvedValue(undefined),
    readJsonFile: vi
      .fn()
      .mockImplementation((path: string) => Promise.resolve(storage.get(path) || null)),
    writeJsonFile: vi.fn().mockImplementation((path: string, data: unknown) => {
      storage.set(path, data);
      return Promise.resolve();
    }),
    __storage: storage,
    __clearStorage: () => storage.clear(),
  };
});

// Import after mocking
import * as favorLedgerStorage from "../favor-ledger";
import * as base from "../base";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const TEST_USER_ID = "test-user";
const TEST_CHARACTER_ID = "test-character";
const TEST_CONTACT_ID = "test-contact";

function createMockFavorLedger(overrides: Partial<FavorLedger> = {}): FavorLedger {
  const now = new Date().toISOString();
  return {
    characterId: TEST_CHARACTER_ID,
    transactions: [],
    totalFavorsCalled: 0,
    totalFavorsOwed: 0,
    totalNuyenSpent: 0,
    totalKarmaSpent: 0,
    burnedContactsCount: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function createMockTransaction(overrides: Partial<FavorTransaction> = {}): FavorTransaction {
  return {
    id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    characterId: TEST_CHARACTER_ID,
    contactId: TEST_CONTACT_ID,
    type: "favor_called" as FavorTransactionType,
    description: "Called in a favor",
    favorChange: 1,
    timestamp: new Date().toISOString(),
    requiresGmApproval: false,
    ...overrides,
  };
}

// =============================================================================
// SETUP
// =============================================================================

beforeEach(() => {
  vi.clearAllMocks();
  const baseMock = base as typeof base & { __clearStorage: () => void };
  baseMock.__clearStorage();
});

// =============================================================================
// GET FAVOR LEDGER TESTS
// =============================================================================

describe("getFavorLedger", () => {
  it("should return existing ledger", async () => {
    const ledger = createMockFavorLedger();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getFavorLedger(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result).toEqual(ledger);
  });

  it("should create new ledger if none exists", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await favorLedgerStorage.getFavorLedger(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result.characterId).toBe(TEST_CHARACTER_ID);
    expect(result.transactions).toEqual([]);
    expect(base.writeJsonFile).toHaveBeenCalled();
  });
});

// =============================================================================
// INITIALIZE FAVOR LEDGER TESTS
// =============================================================================

describe("initializeFavorLedger", () => {
  it("should create new ledger with correct structure", async () => {
    const result = await favorLedgerStorage.initializeFavorLedger(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result.characterId).toBe(TEST_CHARACTER_ID);
    expect(result.transactions).toEqual([]);
    expect(result.totalFavorsCalled).toBe(0);
    expect(result.totalFavorsOwed).toBe(0);
    expect(result.totalNuyenSpent).toBe(0);
    expect(result.totalKarmaSpent).toBe(0);
    expect(result.burnedContactsCount).toBe(0);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
});

// =============================================================================
// ADD FAVOR TRANSACTION TESTS
// =============================================================================

describe("addFavorTransaction", () => {
  it("should append transaction to ledger", async () => {
    const ledger = createMockFavorLedger();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.addFavorTransaction(TEST_USER_ID, TEST_CHARACTER_ID, {
      contactId: TEST_CONTACT_ID,
      type: "favor_called",
      description: "Called in a favor for info",
      favorChange: 1,
    });

    expect(result.id).toBeDefined();
    expect(result.contactId).toBe(TEST_CONTACT_ID);
    expect(result.type).toBe("favor_called");
    expect(result.favorChange).toBe(1);
    expect(result.timestamp).toBeDefined();
  });

  it("should generate unique ID", async () => {
    const ledger = createMockFavorLedger();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger).mockResolvedValueOnce(ledger);

    const txn1 = await favorLedgerStorage.addFavorTransaction(TEST_USER_ID, TEST_CHARACTER_ID, {
      contactId: TEST_CONTACT_ID,
      type: "favor_called",
      description: "First",
      favorChange: 1,
    });

    const txn2 = await favorLedgerStorage.addFavorTransaction(TEST_USER_ID, TEST_CHARACTER_ID, {
      contactId: TEST_CONTACT_ID,
      type: "favor_called",
      description: "Second",
      favorChange: 1,
    });

    expect(txn1.id).not.toBe(txn2.id);
  });

  it("should update aggregates", async () => {
    const ledger = createMockFavorLedger();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    await favorLedgerStorage.addFavorTransaction(TEST_USER_ID, TEST_CHARACTER_ID, {
      contactId: TEST_CONTACT_ID,
      type: "favor_called",
      description: "Called favor",
      favorChange: 2,
      nuyenSpent: 1000,
      karmaSpent: 1,
    });

    const writeCall = vi.mocked(base.writeJsonFile).mock.calls[0];
    const writtenLedger = writeCall[1] as FavorLedger;

    expect(writtenLedger.totalFavorsCalled).toBe(2);
    expect(writtenLedger.totalNuyenSpent).toBe(1000);
    expect(writtenLedger.totalKarmaSpent).toBe(1);
  });

  it("should handle optional fields", async () => {
    const ledger = createMockFavorLedger();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.addFavorTransaction(TEST_USER_ID, TEST_CHARACTER_ID, {
      contactId: TEST_CONTACT_ID,
      type: "favor_called",
      description: "Requested a service",
      favorChange: 0,
      campaignId: "campaign-1",
      sessionId: "session-1",
      serviceId: "service-1",
      serviceRisk: "medium",
      thresholdRequired: 3,
      rollResult: 4,
      netHits: 1,
      success: true,
      requiresGmApproval: true,
    });

    expect(result.campaignId).toBe("campaign-1");
    expect(result.sessionId).toBe("session-1");
    expect(result.serviceRisk).toBe("medium");
    expect(result.requiresGmApproval).toBe(true);
  });
});

// =============================================================================
// GET CONTACT TRANSACTIONS TESTS
// =============================================================================

describe("getContactTransactions", () => {
  it("should return transactions for specific contact", async () => {
    const transactions = [
      createMockTransaction({ contactId: "contact-1" }),
      createMockTransaction({ contactId: "contact-2" }),
      createMockTransaction({ contactId: "contact-1" }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getContactTransactions(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "contact-1"
    );

    expect(result).toHaveLength(2);
    expect(result.every((t) => t.contactId === "contact-1")).toBe(true);
  });
});

// =============================================================================
// GET SESSION TRANSACTIONS TESTS
// =============================================================================

describe("getSessionTransactions", () => {
  it("should return transactions for specific session", async () => {
    const transactions = [
      createMockTransaction({ sessionId: "session-1" }),
      createMockTransaction({ sessionId: "session-2" }),
      createMockTransaction({ sessionId: "session-1" }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getSessionTransactions(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "session-1"
    );

    expect(result).toHaveLength(2);
  });
});

// =============================================================================
// GET TRANSACTIONS BY TYPE TESTS
// =============================================================================

describe("getTransactionsByType", () => {
  it("should filter transactions by type", async () => {
    const transactions = [
      createMockTransaction({ type: "favor_called" }),
      createMockTransaction({ type: "favor_granted" }),
      createMockTransaction({ type: "favor_called" }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getTransactionsByType(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "favor_called"
    );

    expect(result).toHaveLength(2);
  });
});

// =============================================================================
// GET TRANSACTIONS BY DATE RANGE TESTS
// =============================================================================

describe("getTransactionsByDateRange", () => {
  it("should filter transactions within date range", async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const transactions = [
      createMockTransaction({ timestamp: now.toISOString() }),
      createMockTransaction({ timestamp: yesterday.toISOString() }),
      createMockTransaction({ timestamp: twoDaysAgo.toISOString() }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getTransactionsByDateRange(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      yesterday.toISOString(),
      now.toISOString()
    );

    expect(result).toHaveLength(2);
  });
});

// =============================================================================
// GET PENDING APPROVALS TESTS
// =============================================================================

describe("getPendingApprovals", () => {
  it("should return transactions requiring GM approval", async () => {
    const transactions = [
      createMockTransaction({ requiresGmApproval: true, gmApproved: undefined }),
      createMockTransaction({ requiresGmApproval: true, gmApproved: true }),
      createMockTransaction({ requiresGmApproval: true, gmApproved: undefined }),
      createMockTransaction({ requiresGmApproval: false }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getPendingApprovals(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result).toHaveLength(2);
  });

  it("should filter by campaign if provided", async () => {
    const transactions = [
      createMockTransaction({ requiresGmApproval: true, campaignId: "campaign-1" }),
      createMockTransaction({ requiresGmApproval: true, campaignId: "campaign-2" }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getPendingApprovals(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "campaign-1"
    );

    expect(result).toHaveLength(1);
    expect(result[0].campaignId).toBe("campaign-1");
  });
});

// =============================================================================
// APPROVE FAVOR TRANSACTION TESTS
// =============================================================================

describe("approveFavorTransaction", () => {
  it("should approve transaction", async () => {
    const transaction = createMockTransaction({
      id: "txn-to-approve",
      requiresGmApproval: true,
      gmApproved: undefined,
    });
    const ledger = createMockFavorLedger({ transactions: [transaction] });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.approveFavorTransaction(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "txn-to-approve",
      "gm-user-id"
    );

    expect(result.gmApproved).toBe(true);
    expect(result.gmApprovedBy).toBe("gm-user-id");
    expect(result.gmApprovedAt).toBeDefined();
  });

  it("should throw if transaction not found", async () => {
    const ledger = createMockFavorLedger({ transactions: [] });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    await expect(
      favorLedgerStorage.approveFavorTransaction(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        "non-existent",
        "gm"
      )
    ).rejects.toThrow(/not found/);
  });

  it("should throw if transaction does not require approval", async () => {
    const transaction = createMockTransaction({
      id: "txn-1",
      requiresGmApproval: false,
    });
    const ledger = createMockFavorLedger({ transactions: [transaction] });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    await expect(
      favorLedgerStorage.approveFavorTransaction(TEST_USER_ID, TEST_CHARACTER_ID, "txn-1", "gm")
    ).rejects.toThrow(/does not require approval/);
  });

  it("should throw if already processed", async () => {
    const transaction = createMockTransaction({
      id: "txn-1",
      requiresGmApproval: true,
      gmApproved: true,
    });
    const ledger = createMockFavorLedger({ transactions: [transaction] });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    await expect(
      favorLedgerStorage.approveFavorTransaction(TEST_USER_ID, TEST_CHARACTER_ID, "txn-1", "gm")
    ).rejects.toThrow(/already been processed/);
  });
});

// =============================================================================
// REJECT FAVOR TRANSACTION TESTS
// =============================================================================

describe("rejectFavorTransaction", () => {
  it("should reject transaction with reason", async () => {
    const transaction = createMockTransaction({
      id: "txn-to-reject",
      requiresGmApproval: true,
      gmApproved: undefined,
    });
    const ledger = createMockFavorLedger({ transactions: [transaction] });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.rejectFavorTransaction(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "txn-to-reject",
      "gm-user-id",
      "Not appropriate for this session"
    );

    expect(result.gmApproved).toBe(false);
    expect(result.gmApprovedBy).toBe("gm-user-id");
    expect(result.rejectionReason).toBe("Not appropriate for this session");
  });

  it("should throw if already processed", async () => {
    const transaction = createMockTransaction({
      id: "txn-1",
      requiresGmApproval: true,
      gmApproved: false,
    });
    const ledger = createMockFavorLedger({ transactions: [transaction] });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    await expect(
      favorLedgerStorage.rejectFavorTransaction(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        "txn-1",
        "gm",
        "reason"
      )
    ).rejects.toThrow(/already been processed/);
  });
});

// =============================================================================
// RECALCULATE AGGREGATES TESTS
// =============================================================================

describe("recalculateAggregates", () => {
  it("should recalculate all aggregates from transactions", async () => {
    const transactions = [
      createMockTransaction({
        type: "favor_called",
        favorChange: 2,
        nuyenSpent: 500,
        karmaSpent: 1,
      }),
      createMockTransaction({
        type: "favor_granted",
        favorChange: -1,
        nuyenSpent: 200,
      }),
      createMockTransaction({
        type: "contact_burned",
        favorChange: 0,
      }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.recalculateAggregates(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result.totalFavorsCalled).toBe(2);
    expect(result.totalFavorsOwed).toBe(1);
    expect(result.totalNuyenSpent).toBe(700);
    expect(result.totalKarmaSpent).toBe(1);
    expect(result.burnedContactsCount).toBe(1);
  });

  it("should only count approved transactions", async () => {
    const transactions = [
      createMockTransaction({ favorChange: 2, requiresGmApproval: true, gmApproved: true }),
      createMockTransaction({ favorChange: 3, requiresGmApproval: true, gmApproved: undefined }),
      createMockTransaction({ favorChange: 1, requiresGmApproval: false }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.recalculateAggregates(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result.totalFavorsCalled).toBe(3); // 2 + 1, not 3
  });
});

// =============================================================================
// GET CONTACT FAVOR BALANCE TESTS
// =============================================================================

describe("getContactFavorBalance", () => {
  it("should calculate balance for specific contact", async () => {
    const transactions = [
      createMockTransaction({ contactId: "contact-1", favorChange: 2 }),
      createMockTransaction({ contactId: "contact-1", favorChange: -1 }),
      createMockTransaction({ contactId: "contact-2", favorChange: 3 }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getContactFavorBalance(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "contact-1"
    );

    expect(result).toBe(1); // 2 + (-1)
  });

  it("should only count approved transactions", async () => {
    const transactions = [
      createMockTransaction({ contactId: "contact-1", favorChange: 2, requiresGmApproval: false }),
      createMockTransaction({
        contactId: "contact-1",
        favorChange: 5,
        requiresGmApproval: true,
        gmApproved: undefined,
      }),
    ];
    const ledger = createMockFavorLedger({ transactions });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getContactFavorBalance(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "contact-1"
    );

    expect(result).toBe(2); // Only the non-approval-required transaction
  });
});

// =============================================================================
// GET FAVOR STATISTICS TESTS
// =============================================================================

describe("getFavorStatistics", () => {
  it("should return comprehensive statistics", async () => {
    const transactions = [
      createMockTransaction({ contactId: "contact-1" }),
      createMockTransaction({ contactId: "contact-1" }),
      createMockTransaction({ contactId: "contact-2" }),
      createMockTransaction({ contactId: "contact-1", requiresGmApproval: true }),
    ];
    const ledger = createMockFavorLedger({
      transactions,
      totalFavorsCalled: 3,
      totalFavorsOwed: 1,
      totalNuyenSpent: 1000,
      totalKarmaSpent: 2,
      burnedContactsCount: 0,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getFavorStatistics(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result.totalTransactions).toBe(4);
    expect(result.totalFavorsCalled).toBe(3);
    expect(result.totalFavorsOwed).toBe(1);
    expect(result.totalNuyenSpent).toBe(1000);
    expect(result.totalKarmaSpent).toBe(2);
    expect(result.pendingApprovals).toBe(1);
    expect(result.mostActiveContact).toEqual({
      contactId: "contact-1",
      transactionCount: 3,
    });
  });

  it("should handle empty ledger", async () => {
    const ledger = createMockFavorLedger();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(ledger);

    const result = await favorLedgerStorage.getFavorStatistics(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result.totalTransactions).toBe(0);
    expect(result.mostActiveContact).toBeUndefined();
  });
});
