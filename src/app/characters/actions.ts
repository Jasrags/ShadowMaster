"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  requireAuth,
  requireCharacterOwnership,
  isMemberOfCampaign,
  isGMOfCampaign,
} from "@/lib/auth/route-protection";
import type { CharacterInsert, CharacterUpdate } from "@/lib/supabase/schema";
import {
  createCharacter as createCharacterQuery,
  updateCharacter as updateCharacterQuery,
  getCharacterById,
  getCharactersByPlayer,
  getCharacters as getCharactersByCampaign,
} from "@/lib/supabase/schema";

import type {
  ActionResult,
  ShadowrunCharacterData,
} from "./types";
import { defaultShadowrunCharacterData } from "./types";

/**
 * Create a new character
 * User must be a member of the campaign
 */
export async function createCharacter(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const { user, supabase } = await requireAuth("/characters/new");

    const name = formData.get("name") as string;
    const campaignId = formData.get("campaign_id") as string;
    const characterDataJson = formData.get("character_data") as string;

    if (!name || name.trim().length === 0) {
      return { success: false, error: "Character name is required" };
    }

    if (!campaignId) {
      return { success: false, error: "Campaign is required" };
    }

    // Verify user is a member of the campaign
    const isMember = await isMemberOfCampaign(campaignId, user.id);
    if (!isMember) {
      return { success: false, error: "You are not a member of this campaign" };
    }

    // Parse character data or use defaults
    let characterData: ShadowrunCharacterData;
    try {
      characterData = characterDataJson
        ? JSON.parse(characterDataJson)
        : defaultShadowrunCharacterData;
    } catch {
      characterData = defaultShadowrunCharacterData;
    }

    const insertData: CharacterInsert = {
      name: name.trim(),
      campaign_id: campaignId,
      player_user_id: user.id,
      character_data: characterData as any,
      is_active: true,
    };

    const { data: character, error } = await createCharacterQuery(
      supabase,
      insertData
    );

    if (error) {
      console.error("Error creating character:", error);
      return { success: false, error: "Failed to create character" };
    }

    revalidatePath("/characters");
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true, data: { id: character.id } };
  } catch (error) {
    console.error("Error in createCharacter:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Update a character
 * Only the owner can update their character
 */
export async function updateCharacterAction(
  characterId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth(`/characters/${characterId}/edit`);

    await requireCharacterOwnership(characterId, user.id);

    const name = formData.get("name") as string;
    const characterDataJson = formData.get("character_data") as string;

    if (!name || name.trim().length === 0) {
      return { success: false, error: "Character name is required" };
    }

    const updateData: CharacterUpdate = {
      name: name.trim(),
    };

    // Parse and include character data if provided
    if (characterDataJson) {
      try {
        updateData.character_data = JSON.parse(characterDataJson);
      } catch {
        return { success: false, error: "Invalid character data format" };
      }
    }

    const { data: character, error } = await updateCharacterQuery(
      supabase,
      characterId,
      updateData
    );

    if (error) {
      console.error("Error updating character:", error);
      return { success: false, error: "Failed to update character" };
    }

    revalidatePath(`/characters/${characterId}`);
    revalidatePath("/characters");
    if (character?.campaign_id) {
      revalidatePath(`/campaigns/${character.campaign_id}`);
    }
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof Error && error.message.includes("own")) {
      return { success: false, error: error.message };
    }
    console.error("Error in updateCharacter:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Update character data (partial update for auto-save)
 * Only the owner can update their character
 */
export async function updateCharacterData(
  characterId: string,
  characterData: Partial<ShadowrunCharacterData>
): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth(`/characters/${characterId}/edit`);

    await requireCharacterOwnership(characterId, user.id);

    // Get current character data
    const { data: currentCharacter, error: fetchError } = await getCharacterById(
      supabase,
      characterId
    );

    if (fetchError || !currentCharacter) {
      return { success: false, error: "Character not found" };
    }

    // Merge with existing data
    const currentData =
      (currentCharacter.character_data as ShadowrunCharacterData) ||
      defaultShadowrunCharacterData;
    const mergedData = {
      ...currentData,
      ...characterData,
    };

    const { error } = await updateCharacterQuery(supabase, characterId, {
      character_data: mergedData as any,
    });

    if (error) {
      console.error("Error updating character data:", error);
      return { success: false, error: "Failed to update character" };
    }

    revalidatePath(`/characters/${characterId}`);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof Error && error.message.includes("own")) {
      return { success: false, error: error.message };
    }
    console.error("Error in updateCharacterData:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Soft delete a character (set is_active to false)
 * Only the owner can delete their character
 */
export async function deleteCharacterAction(
  characterId: string
): Promise<ActionResult> {
  try {
    const { user, supabase } = await requireAuth("/characters");

    await requireCharacterOwnership(characterId, user.id);

    // Get character to know which campaign to revalidate
    const { data: character } = await getCharacterById(supabase, characterId);

    // Soft delete - set is_active to false
    const { error } = await updateCharacterQuery(supabase, characterId, {
      is_active: false,
    });

    if (error) {
      console.error("Error deleting character:", error);
      return { success: false, error: "Failed to delete character" };
    }

    revalidatePath("/characters");
    if (character?.campaign_id) {
      revalidatePath(`/campaigns/${character.campaign_id}`);
    }
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof Error && error.message.includes("own")) {
      return { success: false, error: error.message };
    }
    console.error("Error in deleteCharacter:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get all characters for the current user
 */
export async function getUserCharacters(): Promise<
  ActionResult<Array<any>>
> {
  try {
    const { user, supabase } = await requireAuth("/characters");

    // Query characters directly by ownership
    // NOTE: If you encounter RLS recursion errors, the issue is in the database
    // RLS policies, not the query. The policies on characters/campaign_players
    // need to avoid recursive checks. Querying by ownership (player_user_id)
    // should not trigger recursive policy checks.
    const { data: characters, error } = await supabase
      .from('characters')
      .select('*')
      .eq('player_user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      const errorInfo = {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        statusCode: (error as any)?.statusCode,
        statusText: (error as any)?.statusText,
      };
      console.error("Error fetching characters:", JSON.stringify(errorInfo, null, 2));
      console.error("Full error object:", error);
      
      return {
        success: false,
        error:
          error?.message ||
          error?.details ||
          "Failed to fetch characters",
      };
    }

    const characterList = characters || [];

    // Fetch related data separately to avoid RLS recursion
    if (characterList.length > 0) {
      // Get unique IDs for related data
      const campaignIds = [
        ...new Set(characterList.map((c) => c.campaign_id).filter(Boolean)),
      ];
      const playerUserIds = [
        ...new Set(characterList.map((c) => c.player_user_id).filter(Boolean)),
      ];

      // Fetch campaigns (only id and name to avoid RLS recursion)
      const campaignMap = new Map();
      if (campaignIds.length > 0) {
        const { data: campaigns } = await supabase
          .from("campaigns")
          .select("id, name")
          .in("id", campaignIds);
        
        (campaigns || []).forEach((c) => campaignMap.set(c.id, c));
      }

      // Fetch player profiles (only basic info to avoid RLS recursion)
      const playerMap = new Map();
      if (playerUserIds.length > 0) {
        const { data: players } = await supabase
          .from("users_profile")
          .select("id, username, avatar_url")
          .in("id", playerUserIds);
        
        (players || []).forEach((p) => playerMap.set(p.id, p));
      }

      // Enrich characters with related data
      const enrichedCharacters = characterList.map((character) => ({
        ...character,
        campaign: campaignMap.get(character.campaign_id) || null,
        player: playerMap.get(character.player_user_id) || null,
      }));

      return { success: true, data: enrichedCharacters };
    }

    return { success: true, data: characterList };
  } catch (error) {
    console.error("Error in getUserCharacters:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}

/**
 * Get a character by ID
 * User must be the owner or a member of the campaign
 */
export async function getCharacterDetails(characterId: string): Promise<
  ActionResult<{
    character: Awaited<ReturnType<typeof getCharacterById>>["data"];
    isOwner: boolean;
    isGM: boolean;
  }>
> {
  try {
    const { user, supabase } = await requireAuth(`/characters/${characterId}`);

    const { data: character, error } = await getCharacterById(
      supabase,
      characterId
    );

    if (error || !character) {
      console.error("Error fetching character:", error);
      return { success: false, error: "Character not found" };
    }

    // Check if user has access (owner or campaign member)
    const isOwner = character.player_user_id === user.id;
    const isGM = await isGMOfCampaign(character.campaign_id, user.id);

    if (!isOwner && !isGM) {
      const isMember = await isMemberOfCampaign(character.campaign_id, user.id);
      if (!isMember) {
        return { success: false, error: "You do not have access to this character" };
      }
    }

    return { success: true, data: { character, isOwner, isGM } };
  } catch (error) {
    console.error("Error in getCharacterDetails:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get all characters in a campaign
 * User must be a member of the campaign
 */
export async function getCampaignCharacters(campaignId: string): Promise<
  ActionResult<Awaited<ReturnType<typeof getCharactersByCampaign>>["data"]>
> {
  try {
    const { user, supabase } = await requireAuth(`/campaigns/${campaignId}`);

    // Verify membership
    const isMember = await isMemberOfCampaign(campaignId, user.id);
    if (!isMember) {
      return { success: false, error: "You are not a member of this campaign" };
    }

    const { data, error } = await getCharactersByCampaign(supabase, campaignId);

    if (error) {
      console.error("Error fetching campaign characters:", error);
      return { success: false, error: "Failed to fetch characters" };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getCampaignCharacters:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get available campaigns for character creation
 * Returns campaigns where user is a member
 */
export async function getAvailableCampaignsForCharacter(): Promise<
  ActionResult<Array<{ id: string; name: string }>>
> {
  try {
    const { user, supabase } = await requireAuth("/characters/new");

    // Get campaigns where user is a player
    const { data: playerCampaigns, error } = await supabase
      .from("campaign_players")
      .select("campaign:campaigns(id, name)")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching campaigns:", error);
      return { success: false, error: "Failed to fetch campaigns" };
    }

    const campaigns =
      playerCampaigns
        ?.map((pc) => pc.campaign)
        .filter((c): c is { id: string; name: string } => c !== null) || [];

    return { success: true, data: campaigns };
  } catch (error) {
    console.error("Error in getAvailableCampaignsForCharacter:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

