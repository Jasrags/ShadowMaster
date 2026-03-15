/**
 * Tests for getTransactionsByDateRange in favor-ledger storage
 *
 * Verifies that date range filtering uses proper Date comparison
 * instead of string comparison, which fails for different ISO formats.
 *
 * @see https://github.com/Jasrags/ShadowMaster/issues/647
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import type { FavorLedger } from "@/lib/types/contacts";

let storedLedger: FavorLedger | null;

vi.mock("@/lib/storage/base", () => ({
  readJsonFile: vi.fn(async () => storedLedger),
  writeJsonFile: vi.fn(async (_path: string, data: FavorLedger) => {
    storedLedger = data;
  }),
  ensureDirectory: vi.fn(async () => undefined),
}));

const { getTransactionsByDateRange } = await import("@/lib/storage/favor-ledger");

function makeLedger(timestamps: string[]): FavorLedger {
  return {
    characterId: "char-1",
    transactions: timestamps.map((ts, i) => ({
      id: `txn-${i}`,
      characterId: "char-1",
      contactId: "contact-1",
      type: "favor_called" as const,
      description: `Transaction ${i}`,
      favorChange: 1,
      loyaltyChange: 0,
      connectionChange: 0,
      requiresGmApproval: false,
      timestamp: ts,
    })),
    totalFavorsCalled: 0,
    totalFavorsOwed: 0,
    totalNuyenSpent: 0,
    totalKarmaSpent: 0,
    burnedContactsCount: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };
}

describe("getTransactionsByDateRange", () => {
  beforeEach(() => {
    storedLedger = null;
  });

  test("filters transactions within a date range using proper Date comparison", async () => {
    storedLedger = makeLedger([
      "2024-01-15T10:00:00.000Z",
      "2024-02-15T10:00:00.000Z",
      "2024-03-15T10:00:00.000Z",
    ]);

    const result = await getTransactionsByDateRange(
      "user-1",
      "char-1",
      "2024-01-01T00:00:00.000Z",
      "2024-02-28T23:59:59.999Z"
    );

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("txn-0");
    expect(result[1].id).toBe("txn-1");
  });

  test("compares by time value, not string sort order (bug #647)", async () => {
    // The core bug: string comparison "2024-02-01..." >= "2024-1..." would
    // work coincidentally, but non-UTC offset strings or different-length
    // fractional seconds break lexicographic ordering.
    //
    // This test uses a range boundary that is equivalent in time but
    // different in string form: "2024-06-14T19:00:00.000-05:00" is the
    // same instant as "2024-06-15T00:00:00.000Z". String comparison
    // would incorrectly sort the offset version before a Z-suffixed
    // timestamp, because '-' (0x2D) < '0' (0x30) in ASCII.
    //
    // With proper Date-based comparison, the function correctly resolves
    // both to the same epoch ms and the transaction is included.
    storedLedger = makeLedger([
      "2024-06-15T00:00:00.000Z", // exactly midnight UTC
    ]);

    // Start date: same instant as midnight UTC June 15, but with offset
    const startWithOffset = "2024-06-14T19:00:00.000-05:00";
    const endDate = "2024-06-15T23:59:59.999Z";

    const result = await getTransactionsByDateRange("user-1", "char-1", startWithOffset, endDate);

    // With string comparison this FAILS because
    // "2024-06-15T00:00:00.000Z" >= "2024-06-14T19:00:00.000-05:00" is true (coincidence)
    // but the reverse case would fail.
    // Let's test the reverse: transaction has offset, range has Z
    storedLedger = makeLedger([
      "2024-06-14T19:00:00.000-05:00", // same as 2024-06-15T00:00:00Z
    ]);

    const result2 = await getTransactionsByDateRange(
      "user-1",
      "char-1",
      "2024-06-15T00:00:00.000Z", // midnight UTC = same instant
      "2024-06-15T23:59:59.999Z"
    );

    // String comparison: "2024-06-14T19:00:00.000-05:00" >= "2024-06-15T00:00:00.000Z"
    // => "2024-06-14..." >= "2024-06-15..." => FALSE (string sort puts 14 before 15)
    // But the actual time IS equal, so it should be included.
    expect(result2).toHaveLength(1);
  });

  test("excludes transactions outside the date range", async () => {
    storedLedger = makeLedger([
      "2024-01-01T00:00:00.000Z",
      "2024-06-15T12:00:00.000Z",
      "2024-12-31T23:59:59.999Z",
    ]);

    const result = await getTransactionsByDateRange(
      "user-1",
      "char-1",
      "2024-03-01T00:00:00.000Z",
      "2024-09-30T23:59:59.999Z"
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("txn-1");
  });

  test("includes boundary timestamps (inclusive range)", async () => {
    const exactStart = "2024-05-01T00:00:00.000Z";
    const exactEnd = "2024-05-31T23:59:59.999Z";

    storedLedger = makeLedger([exactStart, "2024-05-15T12:00:00.000Z", exactEnd]);

    const result = await getTransactionsByDateRange("user-1", "char-1", exactStart, exactEnd);

    expect(result).toHaveLength(3);
  });

  test("returns empty array when no transactions match", async () => {
    storedLedger = makeLedger(["2024-01-15T10:00:00.000Z"]);

    const result = await getTransactionsByDateRange(
      "user-1",
      "char-1",
      "2024-06-01T00:00:00.000Z",
      "2024-06-30T23:59:59.999Z"
    );

    expect(result).toHaveLength(0);
  });
});
