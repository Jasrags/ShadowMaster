/**
 * Tests for spendNuyen storage helper
 *
 * Uses a mock of the base storage layer to test the business logic
 * without touching the filesystem.
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Character } from "@/lib/types";

// Create a minimal mock character that passes ensureItemIds
function makeMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    userId: "user-1",
    name: "Test Runner",
    edition: "sr5",
    creationMethod: "priority",
    status: "active",
    metatype: "human",
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 50000,
    karmaCurrent: 10,
    karmaTotal: 25,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    attributes: {} as Character["attributes"],
    skills: [],
    positiveQualities: [],
    negativeQualities: [],
    gear: [],
    contacts: [],
    weapons: [],
    armor: [],
    lifestyles: [],
    identities: [],
    ...overrides,
  } as Character;
}

let storedCharacter: Character;

// Mock the base storage to return our mock character
vi.mock("@/lib/storage/base", () => ({
  readJsonFile: vi.fn(async () => storedCharacter),
  writeJsonFile: vi.fn(async (_path: string, data: Character) => {
    storedCharacter = data;
  }),
  readAllJsonFiles: vi.fn(async () => []),
  fileExists: vi.fn(async () => true),
  ensureDir: vi.fn(async () => undefined),
  deleteJsonFile: vi.fn(async () => undefined),
}));

const { spendNuyen } = await import("@/lib/storage/characters");

describe("spendNuyen", () => {
  beforeEach(() => {
    storedCharacter = makeMockCharacter({ nuyen: 5000 });
  });

  test("deducts nuyen successfully when balance is sufficient", async () => {
    const result = await spendNuyen("user-1", "char-1", 2000);
    expect(result.nuyen).toBe(3000);
  });

  test("throws when balance is insufficient", async () => {
    await expect(spendNuyen("user-1", "char-1", 10000)).rejects.toThrow(/Insufficient nuyen/);
  });

  test("throws when character not found", async () => {
    const { readJsonFile } = await import("@/lib/storage/base");
    (readJsonFile as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

    await expect(spendNuyen("user-1", "nonexistent", 100)).rejects.toThrow(/not found/);
  });

  test("deducts exact balance leaving zero remaining", async () => {
    const result = await spendNuyen("user-1", "char-1", 5000);
    expect(result.nuyen).toBe(0);
  });
});
