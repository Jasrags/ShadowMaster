import { SupabaseClient } from '@supabase/supabase-js'
import { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database'

type Client = SupabaseClient<Database>

// Type aliases for convenience
export type UserProfile = Tables<'users_profile'>
export type Campaign = Tables<'campaigns'>
export type CampaignPlayer = Tables<'campaign_players'>
export type Character = Tables<'characters'>
export type Session = Tables<'sessions'>
export type GameState = Tables<'game_state'>
export type Map = Tables<'maps'>

export type CampaignInsert = TablesInsert<'campaigns'>
export type CampaignUpdate = TablesUpdate<'campaigns'>
export type CharacterInsert = TablesInsert<'characters'>
export type CharacterUpdate = TablesUpdate<'characters'>
export type SessionInsert = TablesInsert<'sessions'>
export type SessionUpdate = TablesUpdate<'sessions'>
export type GameStateInsert = TablesInsert<'game_state'>
export type GameStateUpdate = TablesUpdate<'game_state'>
export type MapInsert = TablesInsert<'maps'>
export type MapUpdate = TablesUpdate<'maps'>
export type CampaignPlayerInsert = TablesInsert<'campaign_players'>
export type CampaignPlayerUpdate = TablesUpdate<'campaign_players'>

// Campaign queries
export async function getCampaigns(client: Client) {
  return client
    .from('campaigns')
    .select('*, gm_user:users_profile!campaigns_gm_user_id_fkey(*)')
    .order('created_at', { ascending: false })
}

export async function getCampaignById(client: Client, campaignId: string) {
  return client
    .from('campaigns')
    .select('*, gm_user:users_profile!campaigns_gm_user_id_fkey(*)')
    .eq('id', campaignId)
    .single()
}

export async function getCampaignsByGM(client: Client, gmUserId: string) {
  return client
    .from('campaigns')
    .select('*, gm_user:users_profile!campaigns_gm_user_id_fkey(*)')
    .eq('gm_user_id', gmUserId)
    .order('created_at', { ascending: false })
}

export async function getCampaignsForUser(client: Client, userId: string) {
  return client
    .from('campaigns')
    .select(
      '*, gm_user:users_profile!campaigns_gm_user_id_fkey(*), campaign_players!inner(*)'
    )
    .eq('campaign_players.user_id', userId)
    .order('created_at', { ascending: false })
}

export async function createCampaign(
  client: Client,
  data: CampaignInsert
) {
  return client.from('campaigns').insert(data).select().single()
}

export async function updateCampaign(
  client: Client,
  campaignId: string,
  data: CampaignUpdate
) {
  return client
    .from('campaigns')
    .update(data)
    .eq('id', campaignId)
    .select()
    .single()
}

export async function deleteCampaign(client: Client, campaignId: string) {
  return client.from('campaigns').delete().eq('id', campaignId)
}

// Campaign Players queries
export async function getCampaignPlayers(
  client: Client,
  campaignId: string
) {
  return client
    .from('campaign_players')
    .select('*, user:users_profile!campaign_players_user_id_fkey(*)')
    .eq('campaign_id', campaignId)
    .order('joined_at', { ascending: true })
}

export async function addPlayerToCampaign(
  client: Client,
  data: CampaignPlayerInsert
) {
  return client
    .from('campaign_players')
    .insert(data)
    .select('*, user:users_profile!campaign_players_user_id_fkey(*)')
    .single()
}

export async function updateCampaignPlayer(
  client: Client,
  campaignId: string,
  userId: string,
  data: CampaignPlayerUpdate
) {
  return client
    .from('campaign_players')
    .update(data)
    .eq('campaign_id', campaignId)
    .eq('user_id', userId)
    .select('*, user:users_profile!campaign_players_user_id_fkey(*)')
    .single()
}

export async function removePlayerFromCampaign(
  client: Client,
  campaignId: string,
  userId: string
) {
  return client
    .from('campaign_players')
    .delete()
    .eq('campaign_id', campaignId)
    .eq('user_id', userId)
}

// Character queries
export async function getCharacters(client: Client, campaignId: string) {
  return client
    .from('characters')
    .select(
      '*, player:users_profile!characters_player_user_id_fkey(*), campaign:campaigns!characters_campaign_id_fkey(*)'
    )
    .eq('campaign_id', campaignId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
}

export async function getCharacterById(client: Client, characterId: string) {
  return client
    .from('characters')
    .select(
      '*, player:users_profile!characters_player_user_id_fkey(id, username, avatar_url), campaign:campaigns!characters_campaign_id_fkey(id, name)'
    )
    .eq('id', characterId)
    .single()
}

export async function getCharactersByPlayer(
  client: Client,
  playerUserId: string,
  campaignId?: string
) {
  let query = client
    .from('characters')
    .select('*')
    .eq('player_user_id', playerUserId)
    .eq('is_active', true)

  if (campaignId) {
    query = query.eq('campaign_id', campaignId)
  }

  return query.order('created_at', { ascending: true })
}

export async function createCharacter(
  client: Client,
  data: CharacterInsert
) {
  return client
    .from('characters')
    .insert(data)
    .select(
      '*, player:users_profile!characters_player_user_id_fkey(*), campaign:campaigns!characters_campaign_id_fkey(*)'
    )
    .single()
}

export async function updateCharacter(
  client: Client,
  characterId: string,
  data: CharacterUpdate
) {
  return client
    .from('characters')
    .update(data)
    .eq('id', characterId)
    .select(
      '*, player:users_profile!characters_player_user_id_fkey(*), campaign:campaigns!characters_campaign_id_fkey(*)'
    )
    .single()
}

export async function deleteCharacter(client: Client, characterId: string) {
  return client.from('characters').delete().eq('id', characterId)
}

// Session queries
export async function getSessions(client: Client, campaignId: string) {
  return client
    .from('sessions')
    .select('*, campaign:campaigns!sessions_campaign_id_fkey(*)')
    .eq('campaign_id', campaignId)
    .order('scheduled_date', { ascending: false })
}

export async function getSessionById(client: Client, sessionId: string) {
  return client
    .from('sessions')
    .select('*, campaign:campaigns!sessions_campaign_id_fkey(*)')
    .eq('id', sessionId)
    .single()
}

export async function getActiveSession(client: Client, campaignId: string) {
  return client
    .from('sessions')
    .select('*, campaign:campaigns!sessions_campaign_id_fkey(*)')
    .eq('campaign_id', campaignId)
    .eq('status', 'active')
    .maybeSingle()
}

export async function createSession(client: Client, data: SessionInsert) {
  return client
    .from('sessions')
    .insert(data)
    .select('*, campaign:campaigns!sessions_campaign_id_fkey(*)')
    .single()
}

export async function updateSession(
  client: Client,
  sessionId: string,
  data: SessionUpdate
) {
  return client
    .from('sessions')
    .update(data)
    .eq('id', sessionId)
    .select('*, campaign:campaigns!sessions_campaign_id_fkey(*)')
    .single()
}

export async function deleteSession(client: Client, sessionId: string) {
  return client.from('sessions').delete().eq('id', sessionId)
}

// Game State queries
export async function getGameState(client: Client, sessionId: string) {
  return client
    .from('game_state')
    .select('*, session:sessions!game_state_session_id_fkey(*)')
    .eq('session_id', sessionId)
    .single()
}

export async function createGameState(
  client: Client,
  data: GameStateInsert
) {
  return client
    .from('game_state')
    .insert(data)
    .select('*, session:sessions!game_state_session_id_fkey(*)')
    .single()
}

export async function updateGameState(
  client: Client,
  sessionId: string,
  data: GameStateUpdate
) {
  return client
    .from('game_state')
    .update(data)
    .eq('session_id', sessionId)
    .select('*, session:sessions!game_state_session_id_fkey(*)')
    .single()
}

// Map queries
export async function getMaps(client: Client, campaignId: string) {
  return client
    .from('maps')
    .select('*, campaign:campaigns!maps_campaign_id_fkey(*)')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
}

export async function getMapById(client: Client, mapId: string) {
  return client
    .from('maps')
    .select('*, campaign:campaigns!maps_campaign_id_fkey(*)')
    .eq('id', mapId)
    .single()
}

export async function createMap(client: Client, data: MapInsert) {
  return client
    .from('maps')
    .insert(data)
    .select('*, campaign:campaigns!maps_campaign_id_fkey(*)')
    .single()
}

export async function updateMap(client: Client, mapId: string, data: MapUpdate) {
  return client
    .from('maps')
    .update(data)
    .eq('id', mapId)
    .select('*, campaign:campaigns!maps_campaign_id_fkey(*)')
    .single()
}

export async function deleteMap(client: Client, mapId: string) {
  return client.from('maps').delete().eq('id', mapId)
}

// User Profile queries
export async function getUserProfile(client: Client, userId: string) {
  return client
    .from('users_profile')
    .select('*')
    .eq('id', userId)
    .single()
}

export async function updateUserProfile(
  client: Client,
  userId: string,
  data: TablesUpdate<'users_profile'>
) {
  return client
    .from('users_profile')
    .update(data)
    .eq('id', userId)
    .select()
    .single()
}

// Utility queries
export async function getCampaignWithDetails(
  client: Client,
  campaignId: string
) {
  return client
    .from('campaigns')
    .select(
      `
      *,
      gm_user:users_profile!campaigns_gm_user_id_fkey(*),
      campaign_players(
        *,
        user:users_profile!campaign_players_user_id_fkey(*)
      ),
      characters(*),
      sessions(*),
      maps(*)
    `
    )
    .eq('id', campaignId)
    .single()
}

