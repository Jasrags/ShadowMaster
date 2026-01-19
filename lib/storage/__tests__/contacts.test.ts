/**
 * Unit tests for contacts.ts storage module
 *
 * Tests character and campaign contact CRUD operations with VI mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Character } from "@/lib/types";
import type { SocialContact, ContactStatus, CreateContactRequest } from "@/lib/types/contacts";

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
import * as contactsStorage from "../contacts";
import * as base from "../base";
import * as charactersStorage from "../characters";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const TEST_USER_ID = "test-user";
const TEST_CHARACTER_ID = "test-character";
const TEST_CAMPAIGN_ID = "test-campaign";

function createMockCharacter(contacts: SocialContact[] = []): Partial<Character> {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    contacts: contacts as Character["contacts"],
  };
}

function createMockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockContactRequest(
  overrides: Partial<CreateContactRequest> = {}
): CreateContactRequest {
  return {
    name: "New Contact",
    connection: 3,
    loyalty: 2,
    archetype: "Fixer",
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
// GET CHARACTER CONTACTS TESTS
// =============================================================================

describe("getCharacterContacts", () => {
  it("should return empty array when character has no contacts", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([]) as Character
    );

    const result = await contactsStorage.getCharacterContacts(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result).toEqual([]);
  });

  it("should return contacts array", async () => {
    const contacts = [
      createMockContact({ id: "c1", name: "Contact 1" }),
      createMockContact({ id: "c2", name: "Contact 2" }),
    ];
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.getCharacterContacts(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result).toHaveLength(2);
  });

  it("should return empty array if character does not exist", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(null);

    const result = await contactsStorage.getCharacterContacts(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result).toEqual([]);
  });
});

// =============================================================================
// GET CHARACTER CONTACT TESTS
// =============================================================================

describe("getCharacterContact", () => {
  it("should return specific contact by ID", async () => {
    const contacts = [
      createMockContact({ id: "target-contact", name: "Target" }),
      createMockContact({ id: "other-contact", name: "Other" }),
    ];
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.getCharacterContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "target-contact"
    );

    expect(result?.id).toBe("target-contact");
    expect(result?.name).toBe("Target");
  });

  it("should return null for non-existent contact", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([]) as Character
    );

    const result = await contactsStorage.getCharacterContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "non-existent"
    );

    expect(result).toBeNull();
  });
});

// =============================================================================
// ADD CHARACTER CONTACT TESTS
// =============================================================================

describe("addCharacterContact", () => {
  it("should add new contact with generated ID", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.addCharacterContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      createMockContactRequest({ name: "New Fixer" })
    );

    expect(result.id).toBeDefined();
    expect(result.name).toBe("New Fixer");
    expect(result.characterId).toBe(TEST_CHARACTER_ID);
    expect(result.status).toBe("active");
    expect(result.createdAt).toBeDefined();
  });

  it("should set default values for optional fields", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.addCharacterContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      createMockContactRequest()
    );

    expect(result.favorBalance).toBe(0);
    expect(result.group).toBe("personal");
    expect(result.acquisitionMethod).toBe("creation");
    expect(result.visibility.playerVisible).toBe(true);
  });

  it("should throw error if character not found", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(null);

    await expect(
      contactsStorage.addCharacterContact(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        createMockContactRequest()
      )
    ).rejects.toThrow(/not found/);
  });
});

// =============================================================================
// UPDATE CHARACTER CONTACT TESTS
// =============================================================================

describe("updateCharacterContact", () => {
  it("should update contact properties", async () => {
    const contact = createMockContact({ id: "contact-1", name: "Old Name" });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.updateCharacterContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "contact-1",
      { name: "New Name", description: "Updated description" }
    );

    expect(result.name).toBe("New Name");
    expect(result.description).toBe("Updated description");
    expect(result.updatedAt).toBeDefined();
  });

  it("should preserve ID and characterId", async () => {
    const contact = createMockContact({ id: "contact-1" });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.updateCharacterContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "contact-1",
      { id: "different-id", characterId: "different-char" } as Partial<SocialContact>
    );

    expect(result.id).toBe("contact-1");
    expect(result.characterId).toBe(TEST_CHARACTER_ID);
  });

  it("should throw error if contact not found", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([]) as Character
    );

    await expect(
      contactsStorage.updateCharacterContact(TEST_USER_ID, TEST_CHARACTER_ID, "non-existent", {})
    ).rejects.toThrow(/not found/);
  });
});

// =============================================================================
// REMOVE CHARACTER CONTACT TESTS
// =============================================================================

describe("removeCharacterContact", () => {
  it("should remove contact and return true", async () => {
    const contacts = [createMockContact({ id: "c1" }), createMockContact({ id: "c2" })];
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.removeCharacterContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "c1"
    );

    expect(result).toBe(true);
    expect(charactersStorage.updateCharacter).toHaveBeenCalled();
  });

  it("should return false for non-existent contact", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([]) as Character
    );

    const result = await contactsStorage.removeCharacterContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "non-existent"
    );

    expect(result).toBe(false);
  });

  it("should return false for non-existent character", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(null);

    const result = await contactsStorage.removeCharacterContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "contact-1"
    );

    expect(result).toBe(false);
  });
});

// =============================================================================
// BURN CONTACT TESTS
// =============================================================================

describe("burnContact", () => {
  it("should change status to burned with reason", async () => {
    const contact = createMockContact({ id: "c1", status: "active" });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.burnContact(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "c1",
      "Sold us out"
    );

    expect(result.status).toBe("burned");
    expect(result.burnedReason).toBe("Sold us out");
    expect(result.burnedAt).toBeDefined();
  });

  it("should throw if already burned", async () => {
    const contact = createMockContact({ id: "c1", status: "burned" });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );

    await expect(
      contactsStorage.burnContact(TEST_USER_ID, TEST_CHARACTER_ID, "c1", "reason")
    ).rejects.toThrow(/already burned/);
  });
});

// =============================================================================
// REACTIVATE CONTACT TESTS
// =============================================================================

describe("reactivateContact", () => {
  it("should change status to active", async () => {
    const contact = createMockContact({ id: "c1", status: "burned" });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.reactivateContact(TEST_USER_ID, TEST_CHARACTER_ID, "c1");

    expect(result.status).toBe("active");
  });

  it("should throw if already active", async () => {
    const contact = createMockContact({ id: "c1", status: "active" });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );

    await expect(
      contactsStorage.reactivateContact(TEST_USER_ID, TEST_CHARACTER_ID, "c1")
    ).rejects.toThrow(/already active/);
  });

  it("should throw if deceased", async () => {
    const contact = createMockContact({ id: "c1", status: "deceased" });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );

    await expect(
      contactsStorage.reactivateContact(TEST_USER_ID, TEST_CHARACTER_ID, "c1")
    ).rejects.toThrow(/deceased/);
  });
});

// =============================================================================
// UPDATE CONTACT LOYALTY TESTS
// =============================================================================

describe("updateContactLoyalty", () => {
  it("should update loyalty rating", async () => {
    const contact = createMockContact({ id: "c1", loyalty: 2 });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.updateContactLoyalty(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "c1",
      4
    );

    expect(result.loyalty).toBe(4);
    expect(result.updatedAt).toBeDefined();
  });
});

// =============================================================================
// UPDATE CONTACT CONNECTION TESTS
// =============================================================================

describe("updateContactConnection", () => {
  it("should update connection rating", async () => {
    const contact = createMockContact({ id: "c1", connection: 3 });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.updateContactConnection(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "c1",
      5
    );

    expect(result.connection).toBe(5);
  });
});

// =============================================================================
// UPDATE CONTACT FAVOR BALANCE TESTS
// =============================================================================

describe("updateContactFavorBalance", () => {
  it("should add to favor balance", async () => {
    const contact = createMockContact({ id: "c1", favorBalance: 2 });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.updateContactFavorBalance(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "c1",
      3
    );

    expect(result.favorBalance).toBe(5);
  });

  it("should subtract from favor balance", async () => {
    const contact = createMockContact({ id: "c1", favorBalance: 5 });
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter([contact]) as Character
    );
    vi.mocked(charactersStorage.updateCharacter).mockResolvedValueOnce({} as Character);

    const result = await contactsStorage.updateContactFavorBalance(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      "c1",
      -2
    );

    expect(result.favorBalance).toBe(3);
  });
});

// =============================================================================
// CAMPAIGN CONTACT TESTS
// =============================================================================

describe("getCampaignContacts", () => {
  it("should return all contacts for campaign", async () => {
    const contacts = [
      createMockContact({ id: "cc1", campaignId: TEST_CAMPAIGN_ID }),
      createMockContact({ id: "cc2", campaignId: TEST_CAMPAIGN_ID }),
    ];
    vi.mocked(base.readAllJsonFiles).mockResolvedValueOnce(contacts);

    const result = await contactsStorage.getCampaignContacts(TEST_CAMPAIGN_ID);

    expect(result).toHaveLength(2);
  });
});

describe("getCampaignContact", () => {
  it("should return specific campaign contact", async () => {
    const contact = createMockContact({ id: "cc1", campaignId: TEST_CAMPAIGN_ID });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(contact);

    const result = await contactsStorage.getCampaignContact(TEST_CAMPAIGN_ID, "cc1");

    expect(result).toEqual(contact);
  });

  it("should return null for non-existent contact", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await contactsStorage.getCampaignContact(TEST_CAMPAIGN_ID, "non-existent");

    expect(result).toBeNull();
  });
});

describe("createCampaignContact", () => {
  it("should create campaign contact", async () => {
    const result = await contactsStorage.createCampaignContact(
      TEST_CAMPAIGN_ID,
      createMockContactRequest({ name: "Campaign NPC" })
    );

    expect(result.id).toBeDefined();
    expect(result.campaignId).toBe(TEST_CAMPAIGN_ID);
    expect(result.name).toBe("Campaign NPC");
    expect(result.group).toBe("campaign");
    expect(result.visibility.playerVisible).toBe(false); // Default for campaign contacts
  });
});

describe("updateCampaignContact", () => {
  it("should update campaign contact", async () => {
    const contact = createMockContact({
      id: "cc1",
      campaignId: TEST_CAMPAIGN_ID,
      name: "Old Name",
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(contact);

    const result = await contactsStorage.updateCampaignContact(TEST_CAMPAIGN_ID, "cc1", {
      name: "New Name",
    });

    expect(result.name).toBe("New Name");
    expect(result.campaignId).toBe(TEST_CAMPAIGN_ID);
  });

  it("should throw if contact not found", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    await expect(
      contactsStorage.updateCampaignContact(TEST_CAMPAIGN_ID, "non-existent", { name: "x" })
    ).rejects.toThrow(/not found/);
  });
});

describe("deleteCampaignContact", () => {
  it("should delete campaign contact", async () => {
    vi.mocked(base.deleteFile).mockResolvedValueOnce(true);

    const result = await contactsStorage.deleteCampaignContact(TEST_CAMPAIGN_ID, "cc1");

    expect(result).toBe(true);
  });

  it("should return false if contact does not exist", async () => {
    vi.mocked(base.deleteFile).mockResolvedValueOnce(false);

    const result = await contactsStorage.deleteCampaignContact(TEST_CAMPAIGN_ID, "non-existent");

    expect(result).toBe(false);
  });
});

// =============================================================================
// SEARCH CONTACTS TESTS
// =============================================================================

describe("searchContacts", () => {
  const contacts = [
    createMockContact({
      id: "c1",
      archetype: "Fixer",
      location: "Seattle",
      connection: 4,
      loyalty: 3,
      status: "active",
    }),
    createMockContact({
      id: "c2",
      archetype: "Street Doc",
      location: "Downtown",
      connection: 2,
      loyalty: 4,
      status: "active",
    }),
    createMockContact({
      id: "c3",
      archetype: "Fixer",
      location: "Seattle",
      connection: 5,
      loyalty: 2,
      status: "burned",
    }),
  ];

  it("should filter by archetype", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.searchContacts(TEST_USER_ID, TEST_CHARACTER_ID, {
      archetype: "Fixer",
    });

    expect(result).toHaveLength(2);
  });

  it("should filter by location", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.searchContacts(TEST_USER_ID, TEST_CHARACTER_ID, {
      location: "Seattle",
    });

    expect(result).toHaveLength(2);
  });

  it("should filter by min/max connection", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.searchContacts(TEST_USER_ID, TEST_CHARACTER_ID, {
      minConnection: 4,
    });

    expect(result).toHaveLength(2);
  });

  it("should filter by min/max loyalty", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.searchContacts(TEST_USER_ID, TEST_CHARACTER_ID, {
      minLoyalty: 3,
    });

    expect(result).toHaveLength(2);
  });

  it("should filter by status", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.searchContacts(TEST_USER_ID, TEST_CHARACTER_ID, {
      status: "burned",
    });

    expect(result).toHaveLength(1);
  });

  it("should filter by search text", async () => {
    const contactsWithNotes = [
      createMockContact({ name: "Fast Eddie", notes: "Good with cars" }),
      createMockContact({ name: "Doc Jones", notes: "Medical contact" }),
    ];
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contactsWithNotes) as Character
    );

    const result = await contactsStorage.searchContacts(TEST_USER_ID, TEST_CHARACTER_ID, {
      search: "eddie",
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Fast Eddie");
  });

  it("should return all contacts when no filters", async () => {
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.searchContacts(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result).toHaveLength(3);
  });
});

// =============================================================================
// UTILITY FUNCTION TESTS
// =============================================================================

describe("calculateContactPoints", () => {
  it("should return connection + loyalty", () => {
    const contact = createMockContact({ connection: 4, loyalty: 3 });

    const result = contactsStorage.calculateContactPoints(contact);

    expect(result).toBe(7);
  });
});

describe("calculateTotalContactPoints", () => {
  it("should sum points for active contacts only", async () => {
    const contacts = [
      createMockContact({ connection: 3, loyalty: 2, status: "active" }),
      createMockContact({ connection: 4, loyalty: 3, status: "active" }),
      createMockContact({ connection: 5, loyalty: 5, status: "burned" }),
    ];
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.calculateTotalContactPoints(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    expect(result).toBe(12); // (3+2) + (4+3), burned not counted
  });
});

describe("countContactsByStatus", () => {
  it("should return counts for each status", async () => {
    const contacts = [
      createMockContact({ status: "active" }),
      createMockContact({ status: "active" }),
      createMockContact({ status: "burned" }),
      createMockContact({ status: "inactive" }),
      createMockContact({ status: "missing" }),
    ];
    vi.mocked(charactersStorage.getCharacter).mockResolvedValueOnce(
      createMockCharacter(contacts) as Character
    );

    const result = await contactsStorage.countContactsByStatus(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result.active).toBe(2);
    expect(result.burned).toBe(1);
    expect(result.inactive).toBe(1);
    expect(result.missing).toBe(1);
    expect(result.deceased).toBe(0);
  });
});
