import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { authorizeCampaign, authorizeGM, authorizeMember, CampaignRole } from "../campaign";
import { getCampaignById } from "@/lib/storage/campaigns";
import type { Campaign } from "@/lib/types";

vi.mock("@/lib/storage/campaigns", () => ({
  getCampaignById: vi.fn(),
}));

const mockGetCampaignById = getCampaignById as Mock;

describe("campaign authorization", () => {
  const baseCampaign: Campaign = {
    id: "campaign-123",
    gmId: "gm-user-123",
    title: "Test Campaign",
    description: "A test campaign",
    status: "active",
    editionId: "edition-1",
    editionCode: "sr5",
    enabledBookIds: ["book-1"],
    enabledCreationMethodIds: ["method-1"],
    gameplayLevel: "street",
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
    playerIds: ["player-user-123", "player-user-456"],
    visibility: "private",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("authorizeCampaign", () => {
    it("returns 401 when userId is null", async () => {
      const result = await authorizeCampaign("campaign-123", null);

      expect(result).toEqual({
        authorized: false,
        campaign: null,
        role: null,
        error: "Authentication required",
        status: 401,
      });
      expect(mockGetCampaignById).not.toHaveBeenCalled();
    });

    it("returns 404 when campaign not found", async () => {
      mockGetCampaignById.mockResolvedValue(null);

      const result = await authorizeCampaign("nonexistent", "user-123");

      expect(result).toEqual({
        authorized: false,
        campaign: null,
        role: null,
        error: "Campaign not found",
        status: 404,
      });
    });

    describe("GM access", () => {
      it("authorizes GM with role 'gm'", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "gm-user-123");

        expect(result).toEqual({
          authorized: true,
          campaign: baseCampaign,
          role: "gm",
          status: 200,
        });
      });

      it("GM always has access regardless of options", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "gm-user-123", {
          requireGM: true,
          requireMember: true,
        });

        expect(result.authorized).toBe(true);
        expect(result.role).toBe("gm");
        expect(result.status).toBe(200);
      });
    });

    describe("Player access", () => {
      it("authorizes player with role 'player' when no restrictions", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "player-user-123");

        expect(result.authorized).toBe(true);
        expect(result.role).toBe("player");
        expect(result.status).toBe(200);
      });

      it("returns 403 for player when requireGM is true", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "player-user-123", {
          requireGM: true,
        });

        expect(result).toEqual({
          authorized: false,
          campaign: baseCampaign,
          role: "player",
          error: "Only the GM can perform this action",
          status: 403,
        });
      });

      it("authorizes player when requireMember is true", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "player-user-123", {
          requireMember: true,
        });

        expect(result.authorized).toBe(true);
        expect(result.role).toBe("player");
        expect(result.status).toBe(200);
      });
    });

    describe("Non-member access", () => {
      it("returns 403 for non-member when requireMember is true", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "random-user-789", {
          requireMember: true,
        });

        expect(result).toEqual({
          authorized: false,
          campaign: baseCampaign,
          role: null,
          error: "Access denied: campaign membership required",
          status: 403,
        });
      });

      it("returns 403 for non-member with private visibility", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "random-user-789");

        expect(result).toEqual({
          authorized: false,
          campaign: baseCampaign,
          role: null,
          error: "Access denied",
          status: 403,
        });
      });

      it("returns 403 for non-member with invite-only visibility without allowPublic", async () => {
        const inviteOnlyCampaign: Campaign = {
          ...baseCampaign,
          visibility: "invite-only",
        };
        mockGetCampaignById.mockResolvedValue(inviteOnlyCampaign);

        const result = await authorizeCampaign("campaign-123", "random-user-789");

        expect(result).toEqual({
          authorized: false,
          campaign: inviteOnlyCampaign,
          role: null,
          error: "Access denied",
          status: 403,
        });
      });

      it("authorizes non-member with public visibility and allowPublic", async () => {
        const publicCampaign: Campaign = {
          ...baseCampaign,
          visibility: "public",
        };
        mockGetCampaignById.mockResolvedValue(publicCampaign);

        const result = await authorizeCampaign("campaign-123", "random-user-789", {
          allowPublic: true,
        });

        expect(result).toEqual({
          authorized: true,
          campaign: publicCampaign,
          role: null,
          status: 200,
        });
      });

      it("authorizes non-member with invite-only visibility and allowPublic", async () => {
        const inviteOnlyCampaign: Campaign = {
          ...baseCampaign,
          visibility: "invite-only",
        };
        mockGetCampaignById.mockResolvedValue(inviteOnlyCampaign);

        const result = await authorizeCampaign("campaign-123", "random-user-789", {
          allowPublic: true,
        });

        expect(result).toEqual({
          authorized: true,
          campaign: inviteOnlyCampaign,
          role: null,
          status: 200,
        });
      });

      it("returns 403 for non-member with private visibility even with allowPublic", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "random-user-789", {
          allowPublic: true,
        });

        expect(result).toEqual({
          authorized: false,
          campaign: baseCampaign,
          role: null,
          error: "Access denied",
          status: 403,
        });
      });
    });

    describe("role determination", () => {
      it("correctly identifies GM role", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "gm-user-123");

        expect(result.role).toBe("gm");
      });

      it("correctly identifies player role", async () => {
        mockGetCampaignById.mockResolvedValue(baseCampaign);

        const result = await authorizeCampaign("campaign-123", "player-user-456");

        expect(result.role).toBe("player");
      });

      it("returns null role for non-members", async () => {
        const publicCampaign: Campaign = {
          ...baseCampaign,
          visibility: "public",
        };
        mockGetCampaignById.mockResolvedValue(publicCampaign);

        const result = await authorizeCampaign("campaign-123", "random-user-789", {
          allowPublic: true,
        });

        expect(result.role).toBeNull();
      });
    });
  });

  describe("authorizeGM", () => {
    it("authorizes GM user", async () => {
      mockGetCampaignById.mockResolvedValue(baseCampaign);

      const result = await authorizeGM("campaign-123", "gm-user-123");

      expect(result.authorized).toBe(true);
      expect(result.role).toBe("gm");
      expect(result.status).toBe(200);
    });

    it("denies non-GM user", async () => {
      mockGetCampaignById.mockResolvedValue(baseCampaign);

      const result = await authorizeGM("campaign-123", "player-user-123");

      expect(result.authorized).toBe(false);
      expect(result.role).toBe("player");
      expect(result.error).toBe("Only the GM can perform this action");
      expect(result.status).toBe(403);
    });

    it("returns 401 when userId is null", async () => {
      const result = await authorizeGM("campaign-123", null);

      expect(result.authorized).toBe(false);
      expect(result.error).toBe("Authentication required");
      expect(result.status).toBe(401);
    });

    it("returns 404 when campaign not found", async () => {
      mockGetCampaignById.mockResolvedValue(null);

      const result = await authorizeGM("nonexistent", "user-123");

      expect(result.authorized).toBe(false);
      expect(result.error).toBe("Campaign not found");
      expect(result.status).toBe(404);
    });
  });

  describe("authorizeMember", () => {
    it("authorizes GM as member", async () => {
      mockGetCampaignById.mockResolvedValue(baseCampaign);

      const result = await authorizeMember("campaign-123", "gm-user-123");

      expect(result.authorized).toBe(true);
      expect(result.role).toBe("gm");
      expect(result.status).toBe(200);
    });

    it("authorizes player as member", async () => {
      mockGetCampaignById.mockResolvedValue(baseCampaign);

      const result = await authorizeMember("campaign-123", "player-user-123");

      expect(result.authorized).toBe(true);
      expect(result.role).toBe("player");
      expect(result.status).toBe(200);
    });

    it("denies non-member", async () => {
      mockGetCampaignById.mockResolvedValue(baseCampaign);

      const result = await authorizeMember("campaign-123", "random-user-789");

      expect(result.authorized).toBe(false);
      expect(result.role).toBeNull();
      expect(result.error).toBe("Access denied: campaign membership required");
      expect(result.status).toBe(403);
    });

    it("returns 401 when userId is null", async () => {
      const result = await authorizeMember("campaign-123", null);

      expect(result.authorized).toBe(false);
      expect(result.error).toBe("Authentication required");
      expect(result.status).toBe(401);
    });

    it("returns 404 when campaign not found", async () => {
      mockGetCampaignById.mockResolvedValue(null);

      const result = await authorizeMember("nonexistent", "user-123");

      expect(result.authorized).toBe(false);
      expect(result.error).toBe("Campaign not found");
      expect(result.status).toBe(404);
    });
  });
});
