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

// Gear Requirement types (matching Go structure)
export interface GearConditionGroup {
  category?: string[];
  name?: string[];
}

export interface GearDetailsRequirement {
  or?: GearConditionGroup;
  and?: GearConditionGroup;
  // For complex attribute-based requirements (fallback)
  [key: string]: unknown;
}

export interface RequirementOneOf {
  cyberware?: string[];
  bioware?: string[];
  metatype?: string;
  quality?: string[];
  power?: string;
  group?: string[];
}

export interface RequirementAllOf {
  metatype?: string;
  quality?: string;
  power?: string;
  magenabled?: boolean;
}

export interface ParentDetails {
  name: string;
}

export interface GearRequired {
  oneof?: RequirementOneOf;
  allof?: RequirementAllOf;
  parentdetails?: ParentDetails;
  geardetails?: GearDetailsRequirement | Record<string, unknown>; // Can be type-safe or complex map
}

// Gear types
export interface Gear {
  name: string;
  category: string;
  source: string;
  page?: string;
  rating?: string;
  avail?: string;
  cost?: string;
  costfor?: string;
  addweapon?: string;
  ammoforweapontype?: string;
  isflechetteammo?: boolean;
  flechetteweaponbonus?: string;
  weaponbonus?: string;
  addoncategory?: string | string[];
  required?: GearRequired;
  requireparent?: boolean;
  bonus?: unknown;
}

// Armor types
export interface Armor {
  name: string;
  category: string;
  armor: string;
  armorcapacity: string;
  avail: string;
  cost: string;
  source: string;
  armoroverride?: string;
  rating?: number;
  addmodcategory?: string;
  selectmodsfromcategory?: {
    category: string;
  };
  gears?: {
    usegear?: string[];
  };
  addweapon?: string;
  bonus?: unknown;
  wirelessbonus?: unknown;
  mods?: {
    name?: string | string[] | Array<{
      '+content'?: string;
      '+@rating'?: string;
    }>;
  };
}

