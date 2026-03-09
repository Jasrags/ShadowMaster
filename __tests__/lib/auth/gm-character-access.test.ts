/**
 * Tests for GM Character Access module
 *
 * Tests the cross-user character resolution that allows GMs to
 * perform gameplay edits on player characters in their campaigns.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  getCharacterById: vi.fn(),
}));

vi.mock("@/lib/auth/character-authorization", () => ({
  determineRole: vi.fn(),
  getPermissionsForRole: vi.fn(),
  hasPermission: vi.fn(),
}));

vi.mock("@/lib/storage/notifications", () => ({
  createNotification: vi.fn(),
}));

import { getCharacter, getCharacterById } from "@/lib/storage/characters";
import {
  determineRole,
  getPermissionsForRole,
  hasPermission,
} from "@/lib/auth/character-authorization";
import { createNotification } from "@/lib/storage/notifications";
import { resolveCharacterForGameplay, notifyOwnerOfGMEdit } from "@/lib/auth/gm-character-access";
import type { Character } from "@/lib/types";
import type { Campaign } from "@/lib/types/campaign";

// =============================================================================
// TEST DATA
// =============================================================================

const OWNER_ID = "owner-user-1";
const GM_ID = "gm-user-2";
const OTHER_USER_ID = "other-user-3";
const CHARACTER_ID = "char-1";
const CAMPAIGN_ID = "campaign-1";

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: CHARACTER_ID,
    ownerId: OWNER_ID,
    name: "Test Runner",
    status: "active",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: {
      body: 4,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 4,
      logic: 3,
      intuition: 3,
      charisma: 3,
    },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: { edge: 3, essence: 6 },
    ...overrides,
  } as Character;
}

const mockCampaign: Campaign = {
  id: CAMPAIGN_ID,
  title: "Test Campaign",
  gmId: GM_ID,
  editionId: "sr5-edition-id",
  editionCode: "sr5",
  enabledBookIds: ["core-rulebook"],
  enabledCreationMethodIds: ["priority"],
  gameplayLevel: "street",
  status: "active",
  playerIds: [OWNER_ID],
  visibility: "private",
  advancementSettings: {
    trainingTimeMultiplier: 1.0,
    attributeKarmaMultiplier: 5,
    skillKarmaMultiplier: 2,
    skillGroupKarmaMultiplier: 5,
    knowledgeSkillKarmaMultiplier: 1,
    specializationKarmaCost: 7,
    spellKarmaCost: 5,
    complexFormKarmaCost: 4,
    attributeRatingCap: 10,
    skillRatingCap: 13,
    allowInstantAdvancement: false,
    requireApproval: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// =============================================================================
// resolveCharacterForGameplay
// =============================================================================

describe("resolveCharacterForGameplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Owner fast path
  // ---------------------------------------------------------------------------

  it("should resolve via owner fast path when actor owns the character", async () => {
    const character = createMockCharacter();
    vi.mocked(getCharacter).mockResolvedValue(character);
    vi.mocked(determineRole).mockResolvedValue({ role: "owner", campaign: null });
    vi.mocked(getPermissionsForRole).mockReturnValue(["view", "gameplay_edit"]);
    vi.mocked(hasPermission).mockReturnValue(true);

    const result = await resolveCharacterForGameplay(OWNER_ID, CHARACTER_ID);

    expect(result.authorized).toBe(true);
    if (result.authorized) {
      expect(result.character.id).toBe(CHARACTER_ID);
      expect(result.ownerId).toBe(OWNER_ID);
      expect(result.actorRole).toBe("owner");
      expect(result.isGMAccess).toBe(false);
    }

    // Should NOT call getCharacterById (fast path)
    expect(getCharacterById).not.toHaveBeenCalled();
  });

  it("should deny owner access when permission not granted", async () => {
    const character = createMockCharacter({ status: "draft" });
    vi.mocked(getCharacter).mockResolvedValue(character);
    vi.mocked(determineRole).mockResolvedValue({ role: "owner", campaign: null });
    vi.mocked(getPermissionsForRole).mockReturnValue(["view", "edit", "finalize"]);
    vi.mocked(hasPermission).mockReturnValue(false);

    const result = await resolveCharacterForGameplay(OWNER_ID, CHARACTER_ID, "gameplay_edit");

    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.status).toBe(403);
      expect(result.error).toContain("gameplay_edit");
    }
  });

  // ---------------------------------------------------------------------------
  // GM path
  // ---------------------------------------------------------------------------

  it("should resolve via GM path when actor is campaign GM", async () => {
    const character = createMockCharacter({ campaignId: CAMPAIGN_ID });
    vi.mocked(getCharacter).mockResolvedValue(null); // Not owned by GM
    vi.mocked(getCharacterById).mockResolvedValue(character);
    vi.mocked(determineRole).mockResolvedValue({ role: "gm", campaign: mockCampaign });
    vi.mocked(getPermissionsForRole).mockReturnValue(["view", "gameplay_edit", "retire"]);
    vi.mocked(hasPermission).mockReturnValue(true);

    const result = await resolveCharacterForGameplay(GM_ID, CHARACTER_ID);

    expect(result.authorized).toBe(true);
    if (result.authorized) {
      expect(result.character.id).toBe(CHARACTER_ID);
      expect(result.ownerId).toBe(OWNER_ID);
      expect(result.actorRole).toBe("gm");
      expect(result.campaign).toBe(mockCampaign);
      expect(result.isGMAccess).toBe(true);
    }
  });

  it("should deny when non-GM/non-owner tries to access", async () => {
    const character = createMockCharacter({ campaignId: CAMPAIGN_ID });
    vi.mocked(getCharacter).mockResolvedValue(null);
    vi.mocked(getCharacterById).mockResolvedValue(character);
    vi.mocked(determineRole).mockResolvedValue({ role: "owner", campaign: null });

    const result = await resolveCharacterForGameplay(OTHER_USER_ID, CHARACTER_ID);

    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.status).toBe(403);
    }
  });

  it("should deny when character is not in a campaign (GM path)", async () => {
    const character = createMockCharacter(); // No campaignId
    vi.mocked(getCharacter).mockResolvedValue(null);
    vi.mocked(getCharacterById).mockResolvedValue(character);

    const result = await resolveCharacterForGameplay(GM_ID, CHARACTER_ID);

    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.status).toBe(404);
    }
  });

  it("should return 404 when character doesn't exist at all", async () => {
    vi.mocked(getCharacter).mockResolvedValue(null);
    vi.mocked(getCharacterById).mockResolvedValue(null);

    const result = await resolveCharacterForGameplay(OTHER_USER_ID, CHARACTER_ID);

    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.status).toBe(404);
      expect(result.error).toBe("Character not found");
    }
  });

  it("should deny GM when required permission not in matrix", async () => {
    const character = createMockCharacter({ campaignId: CAMPAIGN_ID, status: "draft" });
    vi.mocked(getCharacter).mockResolvedValue(null);
    vi.mocked(getCharacterById).mockResolvedValue(character);
    vi.mocked(determineRole).mockResolvedValue({ role: "gm", campaign: mockCampaign });
    vi.mocked(getPermissionsForRole).mockReturnValue(["view"]); // GM can only view drafts
    vi.mocked(hasPermission).mockReturnValue(false);

    const result = await resolveCharacterForGameplay(GM_ID, CHARACTER_ID, "gameplay_edit");

    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.status).toBe(403);
      expect(result.error).toContain("gameplay_edit");
    }
  });

  it("should allow view permission for GM on any character status", async () => {
    const character = createMockCharacter({ campaignId: CAMPAIGN_ID, status: "draft" });
    vi.mocked(getCharacter).mockResolvedValue(null);
    vi.mocked(getCharacterById).mockResolvedValue(character);
    vi.mocked(determineRole).mockResolvedValue({ role: "gm", campaign: mockCampaign });
    vi.mocked(getPermissionsForRole).mockReturnValue(["view"]);
    vi.mocked(hasPermission).mockReturnValue(true);

    const result = await resolveCharacterForGameplay(GM_ID, CHARACTER_ID, "view");

    expect(result.authorized).toBe(true);
    if (result.authorized) {
      expect(result.actorRole).toBe("gm");
      expect(result.isGMAccess).toBe(true);
    }
  });
});

// =============================================================================
// notifyOwnerOfGMEdit
// =============================================================================

describe("notifyOwnerOfGMEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create notification for character owner", async () => {
    const character = createMockCharacter({ campaignId: CAMPAIGN_ID });

    await notifyOwnerOfGMEdit(
      character,
      mockCampaign,
      GM_ID,
      "3 physical damage applied",
      "Combat"
    );

    expect(createNotification).toHaveBeenCalledWith({
      userId: OWNER_ID,
      campaignId: CAMPAIGN_ID,
      type: "character_gm_edited",
      title: "Character Updated by GM",
      message: expect.stringContaining("3 physical damage applied"),
      actionUrl: `/characters/${CHARACTER_ID}`,
    });
  });

  it("should include details in notification message when provided", async () => {
    const character = createMockCharacter({ campaignId: CAMPAIGN_ID });

    await notifyOwnerOfGMEdit(character, mockCampaign, GM_ID, "damage applied", "Ares Predator");

    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Ares Predator"),
      })
    );
  });

  it("should NOT notify when GM owns the character (NPC case)", async () => {
    const npcCharacter = createMockCharacter({ ownerId: GM_ID, campaignId: CAMPAIGN_ID });

    await notifyOwnerOfGMEdit(npcCharacter, mockCampaign, GM_ID, "damage applied");

    expect(createNotification).not.toHaveBeenCalled();
  });

  it("should send notification without details when not provided", async () => {
    const character = createMockCharacter({ campaignId: CAMPAIGN_ID });

    await notifyOwnerOfGMEdit(character, mockCampaign, GM_ID, "modifier applied");

    expect(createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("modifier applied"),
      })
    );
  });
});
