/**
 * Unit tests for social-capital.ts storage module
 *
 * Tests social capital CRUD and budget operations with VI mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SocialCapital, SocialContact } from "@/lib/types/contacts";

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

// Mock the contacts storage module
vi.mock("../contacts", () => ({
  getCharacterContacts: vi.fn().mockResolvedValue([]),
  calculateContactPoints: vi.fn((contact: SocialContact) => contact.connection + contact.loyalty),
}));

// Import after mocking
import * as socialCapitalStorage from "../social-capital";
import * as base from "../base";
import * as contactsStorage from "../contacts";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const TEST_USER_ID = "test-user";
const TEST_CHARACTER_ID = "test-character";

function createMockSocialCapital(overrides: Partial<SocialCapital> = {}): SocialCapital {
  return {
    characterId: TEST_CHARACTER_ID,
    maxContactPoints: 20,
    usedContactPoints: 8,
    availableContactPoints: 12,
    totalContacts: 3,
    activeContacts: 2,
    burnedContacts: 1,
    inactiveContacts: 0,
    networkingBonus: 0,
    socialLimitModifier: 0,
    loyaltyBonus: 0,
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: `contact-${Date.now()}`,
    characterId: TEST_CHARACTER_ID,
    name: "Test Contact",
    archetype: "Fixer",
    connection: 3,
    loyalty: 2,
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

// =============================================================================
// SETUP
// =============================================================================

beforeEach(() => {
  vi.clearAllMocks();
  const baseMock = base as typeof base & { __clearStorage: () => void };
  baseMock.__clearStorage();
});

// =============================================================================
// GET SOCIAL CAPITAL TESTS
// =============================================================================

describe("getSocialCapital", () => {
  it("should return null when social capital is not initialized", async () => {
    const result = await socialCapitalStorage.getSocialCapital(TEST_USER_ID, TEST_CHARACTER_ID);
    expect(result).toBeNull();
  });

  it("should return existing social capital", async () => {
    const socialCapital = createMockSocialCapital();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(socialCapital);

    const result = await socialCapitalStorage.getSocialCapital(TEST_USER_ID, TEST_CHARACTER_ID);

    expect(result).toEqual(socialCapital);
  });
});

// =============================================================================
// GET OR INITIALIZE SOCIAL CAPITAL TESTS
// =============================================================================

describe("getOrInitializeSocialCapital", () => {
  it("should return existing social capital if it exists", async () => {
    const socialCapital = createMockSocialCapital();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(socialCapital);

    const result = await socialCapitalStorage.getOrInitializeSocialCapital(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    expect(result).toEqual(socialCapital);
    expect(base.writeJsonFile).not.toHaveBeenCalled();
  });

  it("should initialize if it does not exist", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);
    vi.mocked(contactsStorage.getCharacterContacts).mockResolvedValueOnce([]);

    const result = await socialCapitalStorage.getOrInitializeSocialCapital(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      20
    );

    expect(result.characterId).toBe(TEST_CHARACTER_ID);
    expect(result.maxContactPoints).toBe(20);
    expect(base.writeJsonFile).toHaveBeenCalled();
  });
});

// =============================================================================
// INITIALIZE SOCIAL CAPITAL TESTS
// =============================================================================

describe("initializeSocialCapital", () => {
  it("should create social capital with correct structure", async () => {
    vi.mocked(contactsStorage.getCharacterContacts).mockResolvedValueOnce([]);

    const result = await socialCapitalStorage.initializeSocialCapital(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      25
    );

    expect(result.characterId).toBe(TEST_CHARACTER_ID);
    expect(result.maxContactPoints).toBe(25);
    expect(result.usedContactPoints).toBe(0);
    expect(result.availableContactPoints).toBe(25);
    expect(result.updatedAt).toBeDefined();
  });

  it("should calculate used points from existing contacts", async () => {
    const contacts = [
      createMockContact({ connection: 3, loyalty: 2, status: "active" }),
      createMockContact({ connection: 4, loyalty: 3, status: "active" }),
    ];
    vi.mocked(contactsStorage.getCharacterContacts).mockResolvedValueOnce(contacts);
    vi.mocked(contactsStorage.calculateContactPoints)
      .mockReturnValueOnce(5) // First contact: 3 + 2
      .mockReturnValueOnce(7); // Second contact: 4 + 3

    const result = await socialCapitalStorage.initializeSocialCapital(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      20
    );

    expect(result.usedContactPoints).toBe(12); // 5 + 7
    expect(result.availableContactPoints).toBe(8); // 20 - 12
    expect(result.activeContacts).toBe(2);
  });

  it("should count contacts by status", async () => {
    const contacts = [
      createMockContact({ status: "active" }),
      createMockContact({ status: "active" }),
      createMockContact({ status: "burned" }),
      createMockContact({ status: "inactive" }),
    ];
    vi.mocked(contactsStorage.getCharacterContacts).mockResolvedValueOnce(contacts);

    const result = await socialCapitalStorage.initializeSocialCapital(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      30
    );

    expect(result.totalContacts).toBe(4);
    expect(result.activeContacts).toBe(2);
    expect(result.burnedContacts).toBe(1);
    expect(result.inactiveContacts).toBe(1);
  });
});

// =============================================================================
// UPDATE SOCIAL CAPITAL TESTS
// =============================================================================

describe("updateSocialCapital", () => {
  it("should update social capital settings", async () => {
    const existing = createMockSocialCapital();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(existing);

    const result = await socialCapitalStorage.updateSocialCapital(TEST_USER_ID, TEST_CHARACTER_ID, {
      networkingBonus: 2,
    });

    expect(result.networkingBonus).toBe(2);
    expect(result.characterId).toBe(TEST_CHARACTER_ID);
  });

  it("should recalculate available points when max or used changes", async () => {
    const existing = createMockSocialCapital({
      maxContactPoints: 20,
      usedContactPoints: 8,
      availableContactPoints: 12,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(existing);

    const result = await socialCapitalStorage.updateSocialCapital(TEST_USER_ID, TEST_CHARACTER_ID, {
      maxContactPoints: 30,
    });

    expect(result.maxContactPoints).toBe(30);
    expect(result.availableContactPoints).toBe(22); // 30 - 8
  });

  it("should throw error if social capital is not initialized", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    await expect(
      socialCapitalStorage.updateSocialCapital(TEST_USER_ID, TEST_CHARACTER_ID, {
        networkingBonus: 1,
      })
    ).rejects.toThrow(/not initialized/);
  });

  it("should prevent characterId from being changed", async () => {
    const existing = createMockSocialCapital();
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(existing);

    const result = await socialCapitalStorage.updateSocialCapital(TEST_USER_ID, TEST_CHARACTER_ID, {
      characterId: "different-id",
    } as Partial<SocialCapital>);

    expect(result.characterId).toBe(TEST_CHARACTER_ID);
  });
});

// =============================================================================
// RECALCULATE SOCIAL CAPITAL TESTS
// =============================================================================

describe("recalculateSocialCapital", () => {
  it("should recalculate from current contacts", async () => {
    const existing = createMockSocialCapital({ maxContactPoints: 20 });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(existing);

    const contacts = [createMockContact({ connection: 3, loyalty: 2, status: "active" })];
    vi.mocked(contactsStorage.getCharacterContacts).mockResolvedValueOnce(contacts);
    vi.mocked(contactsStorage.calculateContactPoints).mockReturnValueOnce(5);

    const result = await socialCapitalStorage.recalculateSocialCapital(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    expect(result.usedContactPoints).toBe(5);
    expect(result.availableContactPoints).toBe(15);
  });

  it("should preserve modifiers from existing", async () => {
    const existing = createMockSocialCapital({
      networkingBonus: 3,
      socialLimitModifier: 2,
      loyaltyBonus: 1,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(existing);
    vi.mocked(contactsStorage.getCharacterContacts).mockResolvedValueOnce([]);

    const result = await socialCapitalStorage.recalculateSocialCapital(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    expect(result.networkingBonus).toBe(3);
    expect(result.socialLimitModifier).toBe(2);
    expect(result.loyaltyBonus).toBe(1);
  });

  it("should preserve campaign constraints", async () => {
    const existing = createMockSocialCapital({
      campaignContactLimit: 5,
      campaignMaxConnection: 6,
      campaignMaxLoyalty: 6,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(existing);
    vi.mocked(contactsStorage.getCharacterContacts).mockResolvedValueOnce([]);

    const result = await socialCapitalStorage.recalculateSocialCapital(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    expect(result.campaignContactLimit).toBe(5);
    expect(result.campaignMaxConnection).toBe(6);
    expect(result.campaignMaxLoyalty).toBe(6);
  });
});

// =============================================================================
// CHECK CONTACT BUDGET TESTS
// =============================================================================

describe("checkContactBudget", () => {
  it("should return allowed when budget is sufficient", async () => {
    const socialCapital = createMockSocialCapital({ availableContactPoints: 10 });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(socialCapital);

    const result = await socialCapitalStorage.checkContactBudget(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      5
    );

    expect(result.allowed).toBe(true);
    expect(result.available).toBe(10);
    expect(result.required).toBe(5);
  });

  it("should return not allowed when budget is insufficient", async () => {
    const socialCapital = createMockSocialCapital({ availableContactPoints: 3 });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(socialCapital);

    const result = await socialCapitalStorage.checkContactBudget(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      5
    );

    expect(result.allowed).toBe(false);
    expect(result.available).toBe(3);
    expect(result.required).toBe(5);
  });

  it("should check campaign contact limit", async () => {
    const socialCapital = createMockSocialCapital({
      availableContactPoints: 10,
      activeContacts: 5,
      campaignContactLimit: 5,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(socialCapital);

    const result = await socialCapitalStorage.checkContactBudget(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      3
    );

    expect(result.allowed).toBe(false);
    expect(result.wouldExceedCampaignLimit).toBe(true);
  });

  it("should allow when no social capital tracking", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await socialCapitalStorage.checkContactBudget(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      100
    );

    expect(result.allowed).toBe(true);
    expect(result.available).toBe(Infinity);
  });
});

// =============================================================================
// SET MAX CONTACT POINTS TESTS
// =============================================================================

describe("setMaxContactPoints", () => {
  it("should update max points when social capital exists", async () => {
    const existing = createMockSocialCapital({ maxContactPoints: 20, usedContactPoints: 5 });
    // setMaxContactPoints calls getSocialCapital, then updateSocialCapital which calls getSocialCapital again
    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(existing) // First call: getSocialCapital in setMaxContactPoints
      .mockResolvedValueOnce(existing); // Second call: getSocialCapital in updateSocialCapital

    const result = await socialCapitalStorage.setMaxContactPoints(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      30
    );

    expect(result.maxContactPoints).toBe(30);
    expect(result.availableContactPoints).toBe(25); // 30 - 5
  });

  it("should initialize when social capital does not exist", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);
    vi.mocked(contactsStorage.getCharacterContacts).mockResolvedValueOnce([]);

    const result = await socialCapitalStorage.setMaxContactPoints(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      25
    );

    expect(result.maxContactPoints).toBe(25);
  });
});

// =============================================================================
// SET CAMPAIGN CONSTRAINTS TESTS
// =============================================================================

describe("setCampaignConstraints", () => {
  it("should set campaign constraints", async () => {
    const existing = createMockSocialCapital();
    // setCampaignConstraints calls getSocialCapital, then updateSocialCapital which calls getSocialCapital again
    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(existing) // First call: getSocialCapital in setCampaignConstraints
      .mockResolvedValueOnce(existing); // Second call: getSocialCapital in updateSocialCapital

    const result = await socialCapitalStorage.setCampaignConstraints(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      {
        contactLimit: 6,
        maxConnection: 5,
        maxLoyalty: 5,
      }
    );

    expect(result.campaignContactLimit).toBe(6);
    expect(result.campaignMaxConnection).toBe(5);
    expect(result.campaignMaxLoyalty).toBe(5);
  });

  it("should throw error if social capital is not initialized", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    await expect(
      socialCapitalStorage.setCampaignConstraints(TEST_USER_ID, TEST_CHARACTER_ID, {})
    ).rejects.toThrow(/not initialized/);
  });
});

// =============================================================================
// APPLY INFLUENCE MODIFIERS TESTS
// =============================================================================

describe("applyInfluenceModifiers", () => {
  it("should add influence modifiers to existing values", async () => {
    const existing = createMockSocialCapital({
      networkingBonus: 1,
      socialLimitModifier: 0,
      loyaltyBonus: 2,
    });
    // applyInfluenceModifiers calls getSocialCapital, then updateSocialCapital which calls getSocialCapital again
    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(existing) // First call: getSocialCapital in applyInfluenceModifiers
      .mockResolvedValueOnce(existing); // Second call: getSocialCapital in updateSocialCapital

    const result = await socialCapitalStorage.applyInfluenceModifiers(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      {
        networkingBonus: 2,
        socialLimitModifier: 1,
        loyaltyBonus: 1,
      }
    );

    expect(result.networkingBonus).toBe(3); // 1 + 2
    expect(result.socialLimitModifier).toBe(1); // 0 + 1
    expect(result.loyaltyBonus).toBe(3); // 2 + 1
  });

  it("should throw error if social capital is not initialized", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    await expect(
      socialCapitalStorage.applyInfluenceModifiers(TEST_USER_ID, TEST_CHARACTER_ID, {})
    ).rejects.toThrow(/not initialized/);
  });
});

// =============================================================================
// GET SOCIAL CAPITAL SUMMARY TESTS
// =============================================================================

describe("getSocialCapitalSummary", () => {
  it("should return formatted summary", async () => {
    const socialCapital = createMockSocialCapital({
      maxContactPoints: 20,
      usedContactPoints: 10,
      availableContactPoints: 10,
      totalContacts: 5,
      activeContacts: 3,
      burnedContacts: 1,
      inactiveContacts: 1,
      networkingBonus: 2,
      socialLimitModifier: 1,
      loyaltyBonus: 1,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(socialCapital);

    const result = await socialCapitalStorage.getSocialCapitalSummary(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    expect(result.totalPoints).toBe(20);
    expect(result.usedPoints).toBe(10);
    expect(result.availablePoints).toBe(10);
    expect(result.usagePercentage).toBe(50);
    expect(result.contactCounts.total).toBe(5);
    expect(result.contactCounts.active).toBe(3);
    expect(result.modifiers.networkingBonus).toBe(2);
  });

  it("should include campaign constraints when set", async () => {
    const socialCapital = createMockSocialCapital({
      campaignContactLimit: 5,
      campaignMaxConnection: 6,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(socialCapital);

    const result = await socialCapitalStorage.getSocialCapitalSummary(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    expect(result.campaignConstraints).toBeDefined();
    expect(result.campaignConstraints?.contactLimit).toBe(5);
    expect(result.campaignConstraints?.maxConnection).toBe(6);
  });

  it("should handle zero max points without division error", async () => {
    const socialCapital = createMockSocialCapital({
      maxContactPoints: 0,
      usedContactPoints: 0,
      availableContactPoints: 0,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(socialCapital);

    const result = await socialCapitalStorage.getSocialCapitalSummary(
      TEST_USER_ID,
      TEST_CHARACTER_ID
    );

    expect(result.usagePercentage).toBe(0);
  });
});
