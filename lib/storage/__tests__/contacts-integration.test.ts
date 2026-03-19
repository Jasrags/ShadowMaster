/**
 * Integration tests for new SocialContact fields persistence
 *
 * Verifies that relationshipQualities, loyaltyImprovementBlocked, and
 * pendingKarmaConfirmation fields round-trip through storage correctly.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Character } from "@/lib/types";
import type { SocialContact } from "@/lib/types/contacts";
import type { RelationshipQuality } from "@/lib/rules/relationship-qualities";

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
    deleteFile: vi.fn().mockImplementation((path: string) => {
      const existed = storage.has(path);
      storage.delete(path);
      return Promise.resolve(existed);
    }),
    readAllJsonFiles: vi.fn().mockResolvedValue([]),
    __storage: storage,
    __clearStorage: () => storage.clear(),
  };
});

// Mock the characters storage module
vi.mock("../characters", () => ({
  getCharacter: vi.fn(),
  updateCharacter: vi.fn(),
}));

// Import after mocking
import {
  updateCharacterContact,
  updateRelationshipQualities,
  markLoyaltyBlocked,
  getCharacterContact,
  getCharacterContacts,
} from "../contacts";
import * as charactersStorage from "../characters";

// =============================================================================
// FIXTURES
// =============================================================================

const TEST_USER_ID = "test-user";
const TEST_CHARACTER_ID = "test-character";

function createMockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "contact-1",
    characterId: TEST_CHARACTER_ID,
    name: "Mr. Johnson",
    connection: 3,
    loyalty: 2,
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
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

function createMockCharacter(contacts: SocialContact[] = []): Partial<Character> {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    contacts: contacts as Character["contacts"],
  };
}

// =============================================================================
// RELATIONSHIP QUALITIES PERSISTENCE
// =============================================================================

describe("updateRelationshipQualities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should persist relationship qualities on a contact", async () => {
    const contact = createMockContact();
    const character = createMockCharacter([contact]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValue({} as Character);

    const qualities: RelationshipQuality[] = ["blackmail"];
    const result = await updateRelationshipQualities(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "contact-1",
      qualities
    );

    expect(result.relationshipQualities).toEqual(["blackmail"]);
    expect(charactersStorage.updateCharacter).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.objectContaining({
        contacts: expect.arrayContaining([
          expect.objectContaining({
            id: "contact-1",
            relationshipQualities: ["blackmail"],
          }),
        ]),
      })
    );
  });

  it("should replace existing relationship qualities", async () => {
    const contact = createMockContact({
      relationshipQualities: ["blackmail"],
    });
    const character = createMockCharacter([contact]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValue({} as Character);

    const result = await updateRelationshipQualities(TEST_USER_ID, TEST_CHARACTER_ID, "contact-1", [
      "family",
    ]);

    expect(result.relationshipQualities).toEqual(["family"]);
  });

  it("should throw when contact not found", async () => {
    const character = createMockCharacter([]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);

    await expect(
      updateRelationshipQualities(TEST_USER_ID, TEST_CHARACTER_ID, "nonexistent", ["blackmail"])
    ).rejects.toThrow(/not found/);
  });
});

// =============================================================================
// LOYALTY BLOCKED PERSISTENCE
// =============================================================================

describe("markLoyaltyBlocked", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set loyaltyImprovementBlocked to true", async () => {
    const contact = createMockContact();
    const character = createMockCharacter([contact]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValue({} as Character);

    const result = await markLoyaltyBlocked(TEST_USER_ID, TEST_CHARACTER_ID, "contact-1", true);

    expect(result.loyaltyImprovementBlocked).toBe(true);
  });

  it("should unblock loyalty improvement", async () => {
    const contact = createMockContact({ loyaltyImprovementBlocked: true });
    const character = createMockCharacter([contact]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValue({} as Character);

    const result = await markLoyaltyBlocked(TEST_USER_ID, TEST_CHARACTER_ID, "contact-1", false);

    expect(result.loyaltyImprovementBlocked).toBe(false);
  });

  it("should throw when contact not found", async () => {
    const character = createMockCharacter([]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);

    await expect(
      markLoyaltyBlocked(TEST_USER_ID, TEST_CHARACTER_ID, "nonexistent", true)
    ).rejects.toThrow(/not found/);
  });
});

// =============================================================================
// ROUND-TRIP: NEW FIELDS PERSIST THROUGH updateCharacterContact
// =============================================================================

describe("new fields round-trip through updateCharacterContact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should persist relationshipQualities via generic update", async () => {
    const contact = createMockContact();
    const character = createMockCharacter([contact]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValue({} as Character);

    const result = await updateCharacterContact(TEST_USER_ID, TEST_CHARACTER_ID, "contact-1", {
      relationshipQualities: ["family"],
    });

    expect(result.relationshipQualities).toEqual(["family"]);
  });

  it("should persist loyaltyImprovementBlocked via generic update", async () => {
    const contact = createMockContact();
    const character = createMockCharacter([contact]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValue({} as Character);

    const result = await updateCharacterContact(TEST_USER_ID, TEST_CHARACTER_ID, "contact-1", {
      loyaltyImprovementBlocked: true,
    });

    expect(result.loyaltyImprovementBlocked).toBe(true);
  });

  it("should persist pendingKarmaConfirmation via generic update", async () => {
    const contact = createMockContact();
    const character = createMockCharacter([contact]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValue({} as Character);

    const result = await updateCharacterContact(TEST_USER_ID, TEST_CHARACTER_ID, "contact-1", {
      pendingKarmaConfirmation: true,
    });

    expect(result.pendingKarmaConfirmation).toBe(true);
  });

  it("should persist acquisitionMethod 'edge' via generic update", async () => {
    const contact = createMockContact();
    const character = createMockCharacter([contact]);
    vi.mocked(charactersStorage.getCharacter).mockResolvedValue(character as unknown as Character);
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValue({} as Character);

    const result = await updateCharacterContact(TEST_USER_ID, TEST_CHARACTER_ID, "contact-1", {
      acquisitionMethod: "edge",
    });

    expect(result.acquisitionMethod).toBe("edge");
  });
});
