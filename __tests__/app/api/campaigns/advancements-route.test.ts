/**
 * Tests for GET /api/campaigns/[id]/advancements (#686)
 *
 * Verifies that the route fetches characters from ALL campaign members
 * (GM + players), not just the GM's own characters.
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Character } from "@/lib/types";
import type { Campaign } from "@/lib/types/campaign";
import type { AdvancementRecord } from "@/lib/types";

// --- Mock data ---

const GM_ID = "gm-user-1";
const PLAYER_1_ID = "player-1";
const PLAYER_2_ID = "player-2";
const CAMPAIGN_ID = "campaign-1";

function makeAdvancement(overrides: Partial<AdvancementRecord> = {}): AdvancementRecord {
  return {
    id: "adv-1",
    type: "attribute",
    targetId: "body",
    previousValue: 3,
    newValue: 4,
    karmaCost: 20,
    createdAt: "2024-06-01T00:00:00Z",
    gmApproved: false,
    ...overrides,
  } as AdvancementRecord;
}

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    name: "Test Character",
    ownerId: GM_ID,
    campaignId: CAMPAIGN_ID,
    advancementHistory: [],
    ...overrides,
  } as unknown as Character;
}

const gmCharacter = makeCharacter({
  id: "gm-char-1",
  name: "GM Character",
  ownerId: GM_ID,
  advancementHistory: [makeAdvancement({ id: "adv-gm-1", gmApproved: false })],
});

const player1Character = makeCharacter({
  id: "player1-char-1",
  name: "Player 1 Character",
  ownerId: PLAYER_1_ID,
  advancementHistory: [makeAdvancement({ id: "adv-p1-1", gmApproved: false })],
});

const player2Character = makeCharacter({
  id: "player2-char-1",
  name: "Player 2 Character",
  ownerId: PLAYER_2_ID,
  advancementHistory: [makeAdvancement({ id: "adv-p2-1", gmApproved: false })],
});

// Character not in this campaign — should be excluded
const unrelatedCharacter = makeCharacter({
  id: "unrelated-char",
  name: "Unrelated Character",
  ownerId: PLAYER_1_ID,
  campaignId: "other-campaign",
  advancementHistory: [makeAdvancement({ id: "adv-unrelated", gmApproved: false })],
});

const mockCampaign: Campaign = {
  id: CAMPAIGN_ID,
  gmId: GM_ID,
  title: "Test Campaign",
  status: "active",
  editionId: "sr5",
  editionCode: "sr5",
  enabledBookIds: ["core-rulebook"],
  enabledCreationMethodIds: ["priority"],
  gameplayLevel: "street",
  visibility: "private",
  playerIds: [PLAYER_1_ID, PLAYER_2_ID],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as Campaign;

// --- Mocks ---

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn().mockResolvedValue(GM_ID),
}));

vi.mock("@/lib/storage/campaigns", () => ({
  getCampaignById: vi.fn().mockResolvedValue(mockCampaign),
}));

// getUserCharacters returns characters scoped to a single user
const mockGetUserCharacters = vi.fn().mockImplementation(async (userId: string) => {
  switch (userId) {
    case GM_ID:
      return [gmCharacter];
    case PLAYER_1_ID:
      return [player1Character, unrelatedCharacter];
    case PLAYER_2_ID:
      return [player2Character];
    default:
      return [];
  }
});

vi.mock("@/lib/storage/characters", () => ({
  getUserCharacters: (...args: unknown[]) => mockGetUserCharacters(...args),
  getCharactersByCampaign: vi.fn().mockImplementation(async (userId: string) => {
    // This only returns the GM's characters — the buggy path
    switch (userId) {
      case GM_ID:
        return [gmCharacter];
      default:
        return [];
    }
  }),
  getAdvancementHistory: vi
    .fn()
    .mockImplementation(
      (character: Character, filters?: { gmApproved?: boolean; rejected?: boolean }) => {
        const history = character.advancementHistory || [];
        return history.filter((a: AdvancementRecord) => {
          const record = a as unknown as Record<string, unknown>;
          if (filters?.gmApproved !== undefined && a.gmApproved !== filters.gmApproved)
            return false;
          if (filters?.rejected !== undefined && (record.rejected ?? false) !== filters.rejected)
            return false;
          return true;
        });
      }
    ),
}));

describe("GET /api/campaigns/[id]/advancements (#686)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserCharacters.mockImplementation(async (userId: string) => {
      switch (userId) {
        case GM_ID:
          return [gmCharacter];
        case PLAYER_1_ID:
          return [player1Character, unrelatedCharacter];
        case PLAYER_2_ID:
          return [player2Character];
        default:
          return [];
      }
    });
  });

  test("should return advancements from ALL campaign members, not just the GM", async () => {
    const { GET } = await import("@/app/api/campaigns/[id]/advancements/route");
    const { NextRequest } = await import("next/server");

    const request = new NextRequest(`http://localhost/api/campaigns/${CAMPAIGN_ID}/advancements`, {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ id: CAMPAIGN_ID }),
    });
    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.advancements).toBeDefined();

    // Should include advancements from all 3 members (GM + 2 players)
    const charIds = body.advancements.map((a: Record<string, string>) => a.characterId);
    expect(charIds).toContain("gm-char-1");
    expect(charIds).toContain("player1-char-1");
    expect(charIds).toContain("player2-char-1");
    expect(charIds).not.toContain("unrelated-char");
    expect(body.advancements).toHaveLength(3);
  });

  test("should not include characters from other campaigns", async () => {
    const { GET } = await import("@/app/api/campaigns/[id]/advancements/route");
    const { NextRequest } = await import("next/server");

    const request = new NextRequest(`http://localhost/api/campaigns/${CAMPAIGN_ID}/advancements`, {
      method: "GET",
    });

    const response = await GET(request, {
      params: Promise.resolve({ id: CAMPAIGN_ID }),
    });
    const body = await response.json();

    const charIds = body.advancements.map((a: Record<string, string>) => a.characterId);
    expect(charIds).not.toContain("unrelated-char");
  });
});
