import { getCampaignById } from "@/lib/storage/campaigns";
import { ID, Campaign } from "@/lib/types";

export type CampaignRole = "gm" | "player" | null;

/**
 * Result of a campaign authorization check
 */
export interface CampaignAuthResult {
  authorized: boolean;
  campaign: Campaign | null;
  role: CampaignRole;
  error?: string;
  status: number;
}

/**
 * Common campaign authorization checks
 */
export async function authorizeCampaign(
  campaignId: string,
  userId: ID | null,
  options: {
    requireGM?: boolean;
    requireMember?: boolean;
    allowPublic?: boolean;
  } = {}
): Promise<CampaignAuthResult> {
  if (!userId) {
    return {
      authorized: false,
      campaign: null,
      role: null,
      error: "Authentication required",
      status: 401,
    };
  }

  const campaign = await getCampaignById(campaignId);
  if (!campaign) {
    return {
      authorized: false,
      campaign: null,
      role: null,
      error: "Campaign not found",
      status: 404,
    };
  }

  let role: CampaignRole = null;
  if (campaign.gmId === userId) {
    role = "gm";
  } else if (campaign.playerIds.includes(userId)) {
    role = "player";
  }

  // GM always has full access
  if (role === "gm") {
    return { authorized: true, campaign, role, status: 200 };
  }

  // Requires GM access but user is not GM
  if (options.requireGM) {
    return {
      authorized: false,
      campaign,
      role,
      error: "Only the GM can perform this action",
      status: 403,
    };
  }

  // Requires membership (GM or Player)
  if (options.requireMember && !role) {
    return {
      authorized: false,
      campaign,
      role,
      error: "Access denied: campaign membership required",
      status: 403,
    };
  }

  // Check visibility for non-members if membership not strictly required
  if (!role && !options.requireMember) {
    if (campaign.visibility === "private") {
      return {
        authorized: false,
        campaign,
        role,
        error: "Access denied",
        status: 403,
      };
    }

    // If it's invite-only or public, they might have read access depending on the action
    // but usually, we want allowPublic to be explicit
    if (!options.allowPublic) {
      return {
        authorized: false,
        campaign,
        role,
        error: "Access denied",
        status: 403,
      };
    }
  }

  return { authorized: true, campaign, role, status: 200 };
}

/**
 * Convenience check for GM authority
 */
export async function authorizeGM(
  campaignId: string,
  userId: ID | null
): Promise<CampaignAuthResult> {
  return authorizeCampaign(campaignId, userId, { requireGM: true });
}

/**
 * Convenience check for campaign membership
 */
export async function authorizeMember(
  campaignId: string,
  userId: ID | null
): Promise<CampaignAuthResult> {
  return authorizeCampaign(campaignId, userId, { requireMember: true });
}
