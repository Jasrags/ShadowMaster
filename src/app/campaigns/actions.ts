"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  requireAuth,
  requireGMPermission,
  isGMOfCampaign,
  isMemberOfCampaign,
} from "@/lib/auth/route-protection";
import type { CampaignInsert, CampaignUpdate } from "@/lib/supabase/schema";
import {
  createCampaign as createCampaignQuery,
  updateCampaign as updateCampaignQuery,
  deleteCampaign as deleteCampaignQuery,
  getCampaignById,
  getCampaignsByGM,
  getCampaignsForUser,
  getCampaignWithDetails,
  addPlayerToCampaign,
  removePlayerFromCampaign as removePlayerQuery,
  getCampaignPlayers,
} from "@/lib/supabase/schema";

// Types for action results
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Create a new campaign
 * Sets the current user as the GM
 */
export async function createCampaign(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const { user, supabase } = await requireAuth("/campaigns/new");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const setting = formData.get("setting") as string | null;
    const isActive = formData.get("is_active") === "true";

    if (!name || name.trim().length === 0) {
      return { success: false, error: "Campaign name is required" };
    }

    const campaignData: CampaignInsert = {
      name: name.trim(),
      description: description?.trim() || null,
      setting: setting?.trim() || null,
      is_active: isActive,
      gm_user_id: user.id,
    };

    const { data: campaign, error } = await createCampaignQuery(
      supabase,
      campaignData
    );

    if (error) {
      console.error("Error creating campaign:", error);
      return { success: false, error: "Failed to create campaign" };
    }

    // Add GM as a player with gamemaster role
    await addPlayerToCampaign(supabase, {
      campaign_id: campaign.id,
      user_id: user.id,
      role: "gamemaster",
    });

    revalidatePath("/campaigns");
    return { success: true, data: { id: campaign.id } };
  } catch (error) {
    console.error("Error in createCampaign:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Update an existing campaign
 * Only the GM can update their campaign
 */
export async function updateCampaignAction(
  campaignId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth(`/campaigns/${campaignId}/edit`);

    await requireGMPermission(campaignId, user.id);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const setting = formData.get("setting") as string | null;
    const isActive = formData.get("is_active") === "true";

    if (!name || name.trim().length === 0) {
      return { success: false, error: "Campaign name is required" };
    }

    const updateData: CampaignUpdate = {
      name: name.trim(),
      description: description?.trim() || null,
      setting: setting?.trim() || null,
      is_active: isActive,
    };

    const { error } = await updateCampaignQuery(supabase, campaignId, updateData);

    if (error) {
      console.error("Error updating campaign:", error);
      return { success: false, error: "Failed to update campaign" };
    }

    revalidatePath(`/campaigns/${campaignId}`);
    revalidatePath("/campaigns");
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof Error && error.message.includes("permission")) {
      return { success: false, error: error.message };
    }
    console.error("Error in updateCampaign:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Delete a campaign
 * Only the GM can delete their campaign
 */
export async function deleteCampaignAction(
  campaignId: string
): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth("/campaigns");

    await requireGMPermission(campaignId, user.id);

    const { error } = await deleteCampaignQuery(supabase, campaignId);

    if (error) {
      console.error("Error deleting campaign:", error);
      return { success: false, error: "Failed to delete campaign" };
    }

    revalidatePath("/campaigns");
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof Error && error.message.includes("permission")) {
      return { success: false, error: error.message };
    }
    console.error("Error in deleteCampaign:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get all campaigns for the current user (as GM or player)
 */
export async function getUserCampaigns(): Promise<
  ActionResult<{
    gmCampaigns: Awaited<ReturnType<typeof getCampaignsByGM>>["data"];
    playerCampaigns: Awaited<ReturnType<typeof getCampaignsForUser>>["data"];
  }>
> {
  try {
    const { user, supabase } = await requireAuth("/campaigns");

    // Get campaigns where user is GM
    const { data: gmCampaigns, error: gmError } = await getCampaignsByGM(
      supabase,
      user.id
    );

    if (gmError) {
      console.error("Error fetching GM campaigns:", gmError);
      return { success: false, error: "Failed to fetch campaigns" };
    }

    // Get campaigns where user is a player (excluding GM campaigns)
    const { data: allPlayerCampaigns, error: playerError } =
      await getCampaignsForUser(supabase, user.id);

    if (playerError) {
      console.error("Error fetching player campaigns:", playerError);
      return { success: false, error: "Failed to fetch campaigns" };
    }

    // Filter out campaigns where user is GM (they're already in gmCampaigns)
    const gmCampaignIds = new Set(gmCampaigns?.map((c) => c.id) || []);
    const playerCampaigns = allPlayerCampaigns?.filter(
      (c) => !gmCampaignIds.has(c.id)
    );

    return {
      success: true,
      data: {
        gmCampaigns: gmCampaigns || [],
        playerCampaigns: playerCampaigns || [],
      },
    };
  } catch (error) {
    console.error("Error in getUserCampaigns:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get a single campaign by ID with all details
 * Only members of the campaign can view it
 */
export async function getCampaignDetails(campaignId: string): Promise<
  ActionResult<{
    campaign: Awaited<ReturnType<typeof getCampaignWithDetails>>["data"];
    isGM: boolean;
  }>
> {
  try {
    const { user, supabase } = await requireAuth(`/campaigns/${campaignId}`);

    // Check if user has access
    const isMember = await isMemberOfCampaign(campaignId, user.id);
    if (!isMember) {
      return { success: false, error: "You are not a member of this campaign" };
    }

    const { data: campaign, error } = await getCampaignWithDetails(
      supabase,
      campaignId
    );

    if (error || !campaign) {
      console.error("Error fetching campaign:", error);
      return { success: false, error: "Campaign not found" };
    }

    const isGM = campaign.gm_user_id === user.id;

    return { success: true, data: { campaign, isGM } };
  } catch (error) {
    console.error("Error in getCampaignDetails:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Invite a player to a campaign by username
 * Only the GM can invite players
 */
export async function invitePlayerToCampaign(
  campaignId: string,
  username: string
): Promise<ActionResult<{ userId: string }>> {
  try {
    const { user, supabase } = await requireAuth(`/campaigns/${campaignId}`);

    await requireGMPermission(campaignId, user.id);

    // Find user by username
    const { data: targetUser, error: userError } = await supabase
      .from("users_profile")
      .select("id, username")
      .eq("username", username.trim())
      .single();

    if (userError || !targetUser) {
      return { success: false, error: `User "${username}" not found` };
    }

    // Check if user is already in the campaign
    const { data: existingPlayer } = await supabase
      .from("campaign_players")
      .select("user_id")
      .eq("campaign_id", campaignId)
      .eq("user_id", targetUser.id)
      .single();

    if (existingPlayer) {
      return { success: false, error: "User is already in this campaign" };
    }

    // Add player to campaign
    const { error: addError } = await addPlayerToCampaign(supabase, {
      campaign_id: campaignId,
      user_id: targetUser.id,
      role: "player",
    });

    if (addError) {
      console.error("Error adding player:", addError);
      return { success: false, error: "Failed to add player to campaign" };
    }

    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true, data: { userId: targetUser.id } };
  } catch (error) {
    if (error instanceof Error && error.message.includes("permission")) {
      return { success: false, error: error.message };
    }
    console.error("Error in invitePlayerToCampaign:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Remove a player from a campaign
 * Only the GM can remove players
 */
export async function removePlayerFromCampaign(
  campaignId: string,
  playerUserId: string
): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth(`/campaigns/${campaignId}`);

    await requireGMPermission(campaignId, user.id);

    // Prevent GM from removing themselves
    if (playerUserId === user.id) {
      return { success: false, error: "Cannot remove yourself as GM" };
    }

    const { error } = await removePlayerQuery(supabase, campaignId, playerUserId);

    if (error) {
      console.error("Error removing player:", error);
      return { success: false, error: "Failed to remove player" };
    }

    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof Error && error.message.includes("permission")) {
      return { success: false, error: error.message };
    }
    console.error("Error in removePlayerFromCampaign:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get campaign players list
 */
export async function getCampaignPlayersList(campaignId: string): Promise<
  ActionResult<Awaited<ReturnType<typeof getCampaignPlayers>>["data"]>
> {
  try {
    const { user, supabase } = await requireAuth(`/campaigns/${campaignId}`);

    // Verify membership
    const isMember = await isMemberOfCampaign(campaignId, user.id);
    if (!isMember) {
      return { success: false, error: "You are not a member of this campaign" };
    }

    const { data, error } = await getCampaignPlayers(supabase, campaignId);

    if (error) {
      console.error("Error fetching players:", error);
      return { success: false, error: "Failed to fetch players" };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getCampaignPlayersList:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Leave a campaign (for players)
 * GM cannot leave their own campaign
 */
export async function leaveCampaign(campaignId: string): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth("/campaigns");

    // Check if user is GM
    const isGM = await isGMOfCampaign(campaignId, user.id);
    if (isGM) {
      return {
        success: false,
        error: "As GM, you cannot leave your own campaign. Delete it instead.",
      };
    }

    const { error } = await removePlayerQuery(supabase, campaignId, user.id);

    if (error) {
      console.error("Error leaving campaign:", error);
      return { success: false, error: "Failed to leave campaign" };
    }

    revalidatePath("/campaigns");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error in leaveCampaign:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

