// Type definitions matching Go domain models

export interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  group_id: string;
  gm_name?: string;
  gm_user_id?: string;
  edition: string;
  creation_method: string;
  gameplay_level?: string;
  theme?: string;
  house_rule_notes?: string;
  automation?: Record<string, boolean>;
  factions?: CampaignFaction[];
  locations?: CampaignLocation[];
  placeholders?: CampaignPlaceholder[];
  session_seed?: CampaignSessionSeed;
  players?: CampaignPlayer[];
  enabled_books: string[];
  created_at: string;
  updated_at: string;
  setup_locked_at?: string;
  deleted_at?: string;
  status: string; // Active, Paused, Completed
}

export interface CampaignFaction {
  id: string;
  name: string;
  tags?: string;
  notes?: string;
}

export interface CampaignLocation {
  id: string;
  name: string;
  descriptor?: string;
}

export interface CampaignPlaceholder {
  id: string;
  name: string;
  role?: string;
}

export interface CampaignSessionSeed {
  title?: string;
  objectives?: string;
  scene_template?: string;
  summary?: string;
  skip: boolean;
}

// Unified player structure that replaces both CampaignPlayerReference and CampaignInvitation
export interface CampaignPlayer {
  id: string; // Unique ID for this player entry
  user_id?: string; // User ID if registered user
  email?: string; // Email if unregistered user (for email-based invites)
  username?: string; // Username (enriched from user data)
  status: 'invited' | 'accepted' | 'declined' | 'removed'; // Player status
  invited_by: string; // User ID of GM who sent invite
  invited_at: string; // When invitation was sent
  responded_at?: string; // When player responded (accepted/declined)
  joined_at?: string; // When player joined (for accepted players)
}

// Auth request/response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  roles: string[];
}

// Campaign response with additional fields
export interface CampaignResponse extends Campaign {
  gm_username?: string;
  can_edit?: boolean;
  can_delete?: boolean;
}

// API Error response
export interface ApiError {
  error: string;
  message?: string;
}

