"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "./session";
import type { User } from "./types";

/**
 * Result of authentication check
 */
export interface AuthResult {
  user: User;
  supabase: Awaited<ReturnType<typeof createClient>>;
}

/**
 * Require authentication for server components/actions
 * Redirects to login if not authenticated
 * @param redirectTo - Optional URL to redirect back to after login
 * @returns The authenticated user and supabase client
 */
export async function requireAuth(redirectTo?: string): Promise<AuthResult> {
  const user = await getUser();

  if (!user) {
    const loginUrl = redirectTo
      ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : "/login";
    redirect(loginUrl);
  }

  const supabase = await createClient();
  return { user, supabase };
}

/**
 * Check if user is the GM of a campaign
 * @param campaignId - The campaign ID to check
 * @param userId - The user ID to verify
 * @returns true if user is the GM, false otherwise
 */
export async function isGMOfCampaign(
  campaignId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("gm_user_id")
    .eq("id", campaignId)
    .single();

  if (error || !campaign) {
    return false;
  }

  return campaign.gm_user_id === userId;
}

/**
 * Check if user is a member (player or GM) of a campaign
 * @param campaignId - The campaign ID to check
 * @param userId - The user ID to verify
 * @returns true if user is a member, false otherwise
 */
export async function isMemberOfCampaign(
  campaignId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  // Check if user is GM
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("gm_user_id")
    .eq("id", campaignId)
    .single();

  if (campaign?.gm_user_id === userId) {
    return true;
  }

  // Check if user is a player
  const { data: player } = await supabase
    .from("campaign_players")
    .select("user_id")
    .eq("campaign_id", campaignId)
    .eq("user_id", userId)
    .single();

  return !!player;
}

/**
 * Check if user owns a character
 * @param characterId - The character ID to check
 * @param userId - The user ID to verify
 * @returns true if user owns the character, false otherwise
 */
export async function isOwnerOfCharacter(
  characterId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data: character, error } = await supabase
    .from("characters")
    .select("player_user_id")
    .eq("id", characterId)
    .single();

  if (error || !character) {
    return false;
  }

  return character.player_user_id === userId;
}

/**
 * Require GM permissions for a campaign
 * Throws an error if user is not the GM
 * @param campaignId - The campaign ID to check
 * @param userId - The user ID to verify
 */
export async function requireGMPermission(
  campaignId: string,
  userId: string
): Promise<void> {
  const isGM = await isGMOfCampaign(campaignId, userId);
  if (!isGM) {
    throw new Error("You do not have permission to perform this action. GM access required.");
  }
}

/**
 * Require campaign membership
 * Throws an error if user is not a member
 * @param campaignId - The campaign ID to check
 * @param userId - The user ID to verify
 */
export async function requireCampaignMembership(
  campaignId: string,
  userId: string
): Promise<void> {
  const isMember = await isMemberOfCampaign(campaignId, userId);
  if (!isMember) {
    throw new Error("You are not a member of this campaign.");
  }
}

/**
 * Require character ownership
 * Throws an error if user does not own the character
 * @param characterId - The character ID to check
 * @param userId - The user ID to verify
 */
export async function requireCharacterOwnership(
  characterId: string,
  userId: string
): Promise<void> {
  const isOwner = await isOwnerOfCharacter(characterId, userId);
  if (!isOwner) {
    throw new Error("You do not own this character.");
  }
}

/**
 * Get user if authenticated, without redirecting
 * Useful for pages that have both authenticated and unauthenticated views
 * @returns The user or null if not authenticated
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  return getUser();
}

