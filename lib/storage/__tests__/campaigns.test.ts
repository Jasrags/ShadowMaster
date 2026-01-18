/**
 * Unit tests for campaigns.ts storage module
 *
 * Tests campaign CRUD and management operations with real filesystem.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import type {
  Campaign,
  CreateCampaignRequest,
  CampaignPost,
  CampaignEvent,
} from "@/lib/types/campaign";

// Test directory - uses actual data paths
const TEST_CAMPAIGN_PREFIX = `test-campaign-${Date.now()}`;
const DATA_DIR = path.join(process.cwd(), "data", "campaigns");
const TEMPLATES_DIR = path.join(process.cwd(), "data", "campaign_templates");

// Track created campaign IDs for cleanup
const createdCampaignIds: string[] = [];
const createdTemplateIds: string[] = [];

// Mock the editions storage module to avoid loading real editions
vi.mock("../editions", () => ({
  getEdition: vi.fn().mockResolvedValue({
    id: "sr5-edition",
    code: "sr5",
    name: "Shadowrun 5th Edition",
    version: "1.0.0",
    bookIds: ["core-rulebook"],
    defaultCreationMethodId: "priority",
  }),
}));

// Mock campaign validation to avoid dependencies
vi.mock("../../rules/campaign-validation", () => ({
  validateCharacterCampaignCompliance: vi.fn().mockReturnValue({ valid: true, errors: [] }),
}));

// Mock characters storage
vi.mock("../characters", () => ({
  getAllCharacters: vi.fn().mockResolvedValue([]),
  updateCharacter: vi.fn().mockResolvedValue({}),
}));

// Import after mocking
import * as campaignStorage from "../campaigns";

// =============================================================================
// SETUP & TEARDOWN
// =============================================================================

beforeEach(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(TEMPLATES_DIR, { recursive: true });
  } catch {
    // Ignore
  }
});

afterEach(async () => {
  // Clean up test campaigns
  for (const id of createdCampaignIds) {
    try {
      await fs.unlink(path.join(DATA_DIR, `${id}.json`));
    } catch {
      // File might not exist
    }
  }
  createdCampaignIds.length = 0;

  // Clean up test templates
  for (const id of createdTemplateIds) {
    try {
      await fs.unlink(path.join(TEMPLATES_DIR, `${id}.json`));
    } catch {
      // File might not exist
    }
  }
  createdTemplateIds.length = 0;
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const TEST_GM_ID = "test-gm-user";

function createMockCampaignRequest(
  overrides: Partial<CreateCampaignRequest> = {}
): CreateCampaignRequest {
  return {
    title: `Test Campaign ${Date.now()}`,
    description: "A test campaign",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "street",
    visibility: "private",
    ...overrides,
  };
}

async function createTestCampaign(
  overrides: Partial<CreateCampaignRequest> = {}
): Promise<Campaign> {
  const campaign = await campaignStorage.createCampaign(
    TEST_GM_ID,
    createMockCampaignRequest(overrides)
  );
  createdCampaignIds.push(campaign.id);
  return campaign;
}

// =============================================================================
// CREATE CAMPAIGN TESTS
// =============================================================================

describe("createCampaign", () => {
  it("should create campaign with generated ID", async () => {
    const campaign = await createTestCampaign({ title: "Test Create" });

    expect(campaign.id).toBeDefined();
    expect(campaign.gmId).toBe(TEST_GM_ID);
    expect(campaign.title).toBe("Test Create");
    expect(campaign.status).toBe("active");
  });

  it("should set timestamps", async () => {
    const beforeTime = new Date().toISOString();

    const campaign = await createTestCampaign();

    const afterTime = new Date().toISOString();

    expect(campaign.createdAt >= beforeTime).toBe(true);
    expect(campaign.createdAt <= afterTime).toBe(true);
    expect(campaign.updatedAt).toBe(campaign.createdAt);
  });

  it("should generate invite code for invite-only visibility", async () => {
    const campaign = await createTestCampaign({ visibility: "invite-only" });

    expect(campaign.inviteCode).toBeDefined();
    expect(campaign.inviteCode?.length).toBe(8);
  });

  it("should generate invite code for private visibility", async () => {
    const campaign = await createTestCampaign({ visibility: "private" });

    expect(campaign.inviteCode).toBeDefined();
  });

  it("should not generate invite code for public visibility", async () => {
    const campaign = await createTestCampaign({ visibility: "public" });

    expect(campaign.inviteCode).toBeUndefined();
  });

  it("should set default advancement settings", async () => {
    const campaign = await createTestCampaign();

    expect(campaign.advancementSettings).toBeDefined();
    expect(campaign.advancementSettings?.attributeKarmaMultiplier).toBe(5);
    expect(campaign.advancementSettings?.skillKarmaMultiplier).toBe(2);
  });

  it("should initialize empty playerIds array", async () => {
    const campaign = await createTestCampaign();

    expect(campaign.playerIds).toEqual([]);
  });
});

// =============================================================================
// GET CAMPAIGN BY ID TESTS
// =============================================================================

describe("getCampaignById", () => {
  it("should return campaign by ID", async () => {
    const created = await createTestCampaign({ title: "Get Test" });

    const result = await campaignStorage.getCampaignById(created.id);

    expect(result?.id).toBe(created.id);
    expect(result?.title).toBe("Get Test");
  });

  it("should return null for non-existent campaign", async () => {
    const result = await campaignStorage.getCampaignById("non-existent-campaign-id");

    expect(result).toBeNull();
  });

  it("should populate default advancement settings for older campaigns", async () => {
    // Create a campaign file without advancementSettings
    const campaignId = `legacy-${Date.now()}`;
    const legacyCampaign = {
      id: campaignId,
      gmId: TEST_GM_ID,
      title: "Legacy Campaign",
      status: "active",
      editionId: "sr5-edition",
      editionCode: "sr5",
      playerIds: [],
      visibility: "private",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // No advancementSettings
    };

    await fs.writeFile(
      path.join(DATA_DIR, `${campaignId}.json`),
      JSON.stringify(legacyCampaign, null, 2),
      "utf-8"
    );
    createdCampaignIds.push(campaignId);

    const result = await campaignStorage.getCampaignById(campaignId);

    expect(result?.advancementSettings).toBeDefined();
    expect(result?.advancementSettings?.attributeKarmaMultiplier).toBe(5);
  });
});

// =============================================================================
// GET ALL CAMPAIGNS TESTS
// =============================================================================

describe("getAllCampaigns", () => {
  it("should return all campaigns", async () => {
    await createTestCampaign({ title: "All Test 1" });
    await createTestCampaign({ title: "All Test 2" });

    const result = await campaignStorage.getAllCampaigns();

    // May include other campaigns from other tests, so check ours exist
    // Guard against campaigns without titles (from malformed data files)
    const ourCampaigns = result.filter((c) => c.title?.startsWith("All Test"));
    expect(ourCampaigns.length).toBeGreaterThanOrEqual(2);
  });
});

// =============================================================================
// GET CAMPAIGNS BY USER ID TESTS
// =============================================================================

describe("getCampaignsByUserId", () => {
  it("should return campaigns where user is GM", async () => {
    await createTestCampaign({ title: "GM Campaign" });

    const result = await campaignStorage.getCampaignsByUserId(TEST_GM_ID);

    const ourCampaigns = result.filter((c) => c.title === "GM Campaign");
    expect(ourCampaigns.length).toBeGreaterThanOrEqual(1);
  });

  it("should return campaigns where user is player", async () => {
    const campaign = await createTestCampaign();
    await campaignStorage.addPlayerToCampaign(campaign.id, "player-user");

    const result = await campaignStorage.getCampaignsByUserId("player-user");

    expect(result.some((c) => c.id === campaign.id)).toBe(true);
  });
});

// =============================================================================
// GET CAMPAIGNS BY GM ID TESTS
// =============================================================================

describe("getCampaignsByGmId", () => {
  it("should return only campaigns where user is GM", async () => {
    await createTestCampaign({ title: "GM Only Test" });

    const result = await campaignStorage.getCampaignsByGmId(TEST_GM_ID);

    expect(result.every((c) => c.gmId === TEST_GM_ID)).toBe(true);
  });
});

// =============================================================================
// GET PUBLIC CAMPAIGNS TESTS
// =============================================================================

describe("getPublicCampaigns", () => {
  it("should return only public active campaigns", async () => {
    await createTestCampaign({ title: "Public Test", visibility: "public" });

    const result = await campaignStorage.getPublicCampaigns();

    expect(result.every((c) => c.visibility === "public" && c.status === "active")).toBe(true);
  });
});

// =============================================================================
// SEARCH CAMPAIGNS TESTS
// =============================================================================

describe("searchCampaigns", () => {
  it("should filter by query text in title", async () => {
    await createTestCampaign({ title: "Unique Search Title XYZ", visibility: "public" });

    const result = await campaignStorage.searchCampaigns({ query: "XYZ" });

    expect(result.some((c) => c.title.includes("XYZ"))).toBe(true);
  });

  it("should filter by edition", async () => {
    await createTestCampaign({ visibility: "public" });

    const result = await campaignStorage.searchCampaigns({ editionCode: "sr5" });

    expect(result.every((c) => c.editionCode === "sr5")).toBe(true);
  });

  it("should filter by gameplay level", async () => {
    await createTestCampaign({ visibility: "public", gameplayLevel: "prime-runner" });

    const result = await campaignStorage.searchCampaigns({ gameplayLevel: "prime-runner" });

    expect(result.every((c) => c.gameplayLevel === "prime-runner")).toBe(true);
  });

  it("should filter by tags", async () => {
    await createTestCampaign({
      title: "Tagged Campaign",
      visibility: "public",
      tags: ["cyberpunk", "noir"],
    });

    const result = await campaignStorage.searchCampaigns({ tags: ["cyberpunk"] });

    const ourCampaign = result.find((c) => c.title === "Tagged Campaign");
    expect(ourCampaign).toBeDefined();
  });
});

// =============================================================================
// GET CAMPAIGN BY INVITE CODE TESTS
// =============================================================================

describe("getCampaignByInviteCode", () => {
  it("should return campaign by invite code (case-insensitive)", async () => {
    const campaign = await createTestCampaign({ visibility: "invite-only" });

    const result = await campaignStorage.getCampaignByInviteCode(
      campaign.inviteCode!.toLowerCase()
    );

    expect(result?.id).toBe(campaign.id);
  });

  it("should return null for invalid code", async () => {
    const result = await campaignStorage.getCampaignByInviteCode("INVALID");

    expect(result).toBeNull();
  });
});

// =============================================================================
// UPDATE CAMPAIGN TESTS
// =============================================================================

describe("updateCampaign", () => {
  it("should update campaign properties", async () => {
    vi.useFakeTimers();
    const baseTime = new Date("2025-01-01T00:00:00Z");
    vi.setSystemTime(baseTime);

    const campaign = await createTestCampaign({ title: "Original Title" });

    // Advance time to ensure updatedAt will be different
    vi.setSystemTime(new Date("2025-01-01T00:00:01Z"));

    const result = await campaignStorage.updateCampaign(campaign.id, {
      title: "Updated Title",
      description: "New description",
    });

    expect(result.title).toBe("Updated Title");
    expect(result.description).toBe("New description");
    expect(result.updatedAt).not.toBe(campaign.updatedAt);

    vi.useRealTimers();
  });

  it("should preserve immutable fields", async () => {
    const campaign = await createTestCampaign();

    const result = await campaignStorage.updateCampaign(campaign.id, {
      id: "different-id",
      gmId: "different-gm",
      editionId: "different-edition",
      createdAt: "2000-01-01T00:00:00Z",
    } as Partial<Campaign>);

    expect(result.id).toBe(campaign.id);
    expect(result.gmId).toBe(campaign.gmId);
    expect(result.editionId).toBe(campaign.editionId);
    expect(result.createdAt).toBe(campaign.createdAt);
  });

  it("should throw error for non-existent campaign", async () => {
    await expect(campaignStorage.updateCampaign("non-existent", { title: "X" })).rejects.toThrow(
      /not found/
    );
  });
});

// =============================================================================
// DELETE CAMPAIGN TESTS
// =============================================================================

describe("deleteCampaign", () => {
  it("should delete campaign", async () => {
    const campaign = await createTestCampaign();
    // Remove from cleanup list since we're deleting it
    const index = createdCampaignIds.indexOf(campaign.id);
    if (index > -1) createdCampaignIds.splice(index, 1);

    await campaignStorage.deleteCampaign(campaign.id);

    const result = await campaignStorage.getCampaignById(campaign.id);
    expect(result).toBeNull();
  });

  it("should throw error for non-existent campaign", async () => {
    await expect(campaignStorage.deleteCampaign("non-existent")).rejects.toThrow(/not found/);
  });
});

// =============================================================================
// ADD/REMOVE PLAYER TESTS
// =============================================================================

describe("addPlayerToCampaign", () => {
  it("should add player to campaign", async () => {
    const campaign = await createTestCampaign();

    const result = await campaignStorage.addPlayerToCampaign(campaign.id, "new-player");

    expect(result.playerIds).toContain("new-player");
  });

  it("should not duplicate player", async () => {
    const campaign = await createTestCampaign();
    await campaignStorage.addPlayerToCampaign(campaign.id, "player-1");

    const result = await campaignStorage.addPlayerToCampaign(campaign.id, "player-1");

    expect(result.playerIds.filter((id) => id === "player-1").length).toBe(1);
  });

  it("should throw if max players reached", async () => {
    const campaign = await createTestCampaign({ maxPlayers: 1 });
    await campaignStorage.addPlayerToCampaign(campaign.id, "player-1");

    await expect(campaignStorage.addPlayerToCampaign(campaign.id, "player-2")).rejects.toThrow(
      /maximum player limit/
    );
  });
});

describe("removePlayerFromCampaign", () => {
  it("should remove player from campaign", async () => {
    const campaign = await createTestCampaign();
    await campaignStorage.addPlayerToCampaign(campaign.id, "player-to-remove");

    const result = await campaignStorage.removePlayerFromCampaign(campaign.id, "player-to-remove");

    expect(result.playerIds).not.toContain("player-to-remove");
  });
});

// =============================================================================
// IS PLAYER IN CAMPAIGN TESTS
// =============================================================================

describe("isPlayerInCampaign", () => {
  it("should return true if player is in campaign", async () => {
    const campaign = await createTestCampaign();
    await campaignStorage.addPlayerToCampaign(campaign.id, "test-player");

    const result = await campaignStorage.isPlayerInCampaign(campaign.id, "test-player");

    expect(result).toBe(true);
  });

  it("should return false if player is not in campaign", async () => {
    const campaign = await createTestCampaign();

    const result = await campaignStorage.isPlayerInCampaign(campaign.id, "not-a-player");

    expect(result).toBe(false);
  });

  it("should return false for non-existent campaign", async () => {
    const result = await campaignStorage.isPlayerInCampaign("non-existent", "player");

    expect(result).toBe(false);
  });
});

// =============================================================================
// REGENERATE INVITE CODE TESTS
// =============================================================================

describe("regenerateInviteCode", () => {
  it("should generate new invite code", async () => {
    const campaign = await createTestCampaign({ visibility: "invite-only" });
    const originalCode = campaign.inviteCode;

    const result = await campaignStorage.regenerateInviteCode(campaign.id);

    expect(result.inviteCode).toBeDefined();
    expect(result.inviteCode).not.toBe(originalCode);
  });
});

// =============================================================================
// TEMPLATE TESTS
// =============================================================================

describe("saveCampaignAsTemplate", () => {
  it("should create template from campaign", async () => {
    const campaign = await createTestCampaign({ title: "Template Source" });

    const template = await campaignStorage.saveCampaignAsTemplate(
      campaign.id,
      "My Template",
      TEST_GM_ID
    );
    createdTemplateIds.push(template.id);

    expect(template.id).toBeDefined();
    expect(template.name).toBe("My Template");
    expect(template.editionCode).toBe(campaign.editionCode);
    expect(template.createdBy).toBe(TEST_GM_ID);
    expect(template.isPublic).toBe(false);
  });
});

describe("getCampaignTemplates", () => {
  it("should return user templates and public templates", async () => {
    const campaign = await createTestCampaign();
    const template = await campaignStorage.saveCampaignAsTemplate(
      campaign.id,
      "User Template",
      TEST_GM_ID
    );
    createdTemplateIds.push(template.id);

    const result = await campaignStorage.getCampaignTemplates(TEST_GM_ID);

    const ourTemplate = result.find((t) => t.id === template.id);
    expect(ourTemplate).toBeDefined();
  });
});

// =============================================================================
// POST TESTS
// =============================================================================

describe("createCampaignPost", () => {
  it("should create post and add to campaign", async () => {
    const campaign = await createTestCampaign();

    const post = await campaignStorage.createCampaignPost(campaign.id, {
      authorId: TEST_GM_ID,
      type: "announcement",
      title: "Test Announcement",
      content: "This is a test",
      playerVisible: true,
      isPinned: false,
    });

    expect(post.id).toBeDefined();
    expect(post.title).toBe("Test Announcement");
    expect(post.createdAt).toBeDefined();
  });
});

describe("getCampaignPosts", () => {
  it("should return posts for campaign", async () => {
    const campaign = await createTestCampaign();
    await campaignStorage.createCampaignPost(campaign.id, {
      authorId: TEST_GM_ID,
      type: "announcement",
      title: "Post 1",
      content: "Content 1",
      playerVisible: true,
      isPinned: false,
    });

    const result = await campaignStorage.getCampaignPosts(campaign.id);

    expect(result.some((p) => p.title === "Post 1")).toBe(true);
  });

  it("should throw for non-existent campaign", async () => {
    await expect(campaignStorage.getCampaignPosts("non-existent")).rejects.toThrow(/not found/);
  });
});

// =============================================================================
// EVENT TESTS
// =============================================================================

describe("createCampaignEvent", () => {
  it("should create event and add to campaign", async () => {
    const campaign = await createTestCampaign();

    const event = await campaignStorage.createCampaignEvent(campaign.id, {
      type: "session",
      title: "Session 1",
      date: new Date().toISOString(),
      playerVisible: true,
      createdBy: TEST_GM_ID,
    });

    expect(event.id).toBeDefined();
    expect(event.title).toBe("Session 1");
  });

  it("should sort events by date", async () => {
    const campaign = await createTestCampaign();
    const now = new Date();

    await campaignStorage.createCampaignEvent(campaign.id, {
      type: "session",
      title: "Later",
      date: new Date(now.getTime() + 1000000).toISOString(),
      playerVisible: true,
      createdBy: TEST_GM_ID,
    });

    await campaignStorage.createCampaignEvent(campaign.id, {
      type: "session",
      title: "Earlier",
      date: new Date(now.getTime() - 1000000).toISOString(),
      playerVisible: true,
      createdBy: TEST_GM_ID,
    });

    const events = await campaignStorage.getCampaignEvents(campaign.id);

    expect(events[0].title).toBe("Earlier");
    expect(events[1].title).toBe("Later");
  });
});

describe("getCampaignEvents", () => {
  it("should return events for campaign", async () => {
    const campaign = await createTestCampaign();
    await campaignStorage.createCampaignEvent(campaign.id, {
      type: "session",
      title: "Event 1",
      date: new Date().toISOString(),
      playerVisible: true,
      createdBy: TEST_GM_ID,
    });

    const result = await campaignStorage.getCampaignEvents(campaign.id);

    expect(result.some((e) => e.title === "Event 1")).toBe(true);
  });
});

describe("getDowntimeEvents", () => {
  it("should return only downtime events sorted by date", async () => {
    const campaign = await createTestCampaign();

    await campaignStorage.createCampaignEvent(campaign.id, {
      type: "session",
      title: "Session Event",
      date: new Date().toISOString(),
      playerVisible: true,
      createdBy: TEST_GM_ID,
    });

    await campaignStorage.createCampaignEvent(campaign.id, {
      type: "downtime",
      title: "Downtime Event",
      date: new Date().toISOString(),
      playerVisible: true,
      createdBy: TEST_GM_ID,
    });

    const result = await campaignStorage.getDowntimeEvents(campaign.id);

    expect(result.every((e) => e.type === "downtime")).toBe(true);
    expect(result.length).toBe(1);
  });
});

describe("getDowntimeEventById", () => {
  it("should return specific downtime event", async () => {
    const campaign = await createTestCampaign();

    const event = await campaignStorage.createCampaignEvent(campaign.id, {
      type: "downtime",
      title: "Specific Downtime",
      date: new Date().toISOString(),
      playerVisible: true,
      createdBy: TEST_GM_ID,
    });

    const result = await campaignStorage.getDowntimeEventById(campaign.id, event.id);

    expect(result?.id).toBe(event.id);
    expect(result?.title).toBe("Specific Downtime");
  });

  it("should return null for non-downtime event", async () => {
    const campaign = await createTestCampaign();

    const event = await campaignStorage.createCampaignEvent(campaign.id, {
      type: "session",
      title: "Not Downtime",
      date: new Date().toISOString(),
      playerVisible: true,
      createdBy: TEST_GM_ID,
    });

    const result = await campaignStorage.getDowntimeEventById(campaign.id, event.id);

    expect(result).toBeNull();
  });
});

// =============================================================================
// DEFAULT ADVANCEMENT SETTINGS TEST
// =============================================================================

describe("getDefaultAdvancementSettings", () => {
  it("should return default settings", () => {
    const defaults = campaignStorage.getDefaultAdvancementSettings();

    expect(defaults.trainingTimeMultiplier).toBe(1.0);
    expect(defaults.attributeKarmaMultiplier).toBe(5);
    expect(defaults.skillKarmaMultiplier).toBe(2);
    expect(defaults.skillGroupKarmaMultiplier).toBe(5);
    expect(defaults.knowledgeSkillKarmaMultiplier).toBe(1);
    expect(defaults.specializationKarmaCost).toBe(7);
    expect(defaults.spellKarmaCost).toBe(5);
    expect(defaults.complexFormKarmaCost).toBe(4);
    expect(defaults.attributeRatingCap).toBe(10);
    expect(defaults.skillRatingCap).toBe(13);
    expect(defaults.allowInstantAdvancement).toBe(false);
    expect(defaults.requireApproval).toBe(true);
  });
});
