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

// Weapon types
export interface WeaponAccessory {
  name: string | string[];
  mount?: string;
  avail?: string;
  cost?: string;
  source?: string;
  page?: string;
  rating?: string;
  required?: {
    weapondetails?: unknown;
  };
}

export interface WeaponAccessories {
  accessory?: WeaponAccessory[];
}

export interface WeaponAccessoryMounts {
  mount?: string[];
}

export interface Weapon {
  name: string;
  category: string;
  type: string; // "Melee" or "Ranged"
  source: string;
  conceal?: string;
  accuracy?: string;
  reach?: string;
  damage?: string;
  ap?: string; // Armor penetration
  mode?: string;
  rc?: string; // Recoil compensation
  ammo?: string;
  range?: string;
  avail?: string;
  cost?: string;
  page?: string;
  accessories?: WeaponAccessories;
  accessorymounts?: WeaponAccessoryMounts;
  addweapon?: string | string[];
  allowaccessory?: string;
  allowgear?: string | string[];
  alternaterange?: string;
  ammocategory?: string;
  ammoslots?: string;
  cyberware?: string;
  doubledcostaccessorymounts?: boolean;
  extramount?: string;
  hide?: boolean;
  maxrating?: string;
  mount?: string;
  requireammo?: string;
  required?: {
    weapondetails?: unknown;
  };
  shortburst?: string;
  singleshot?: string;
  sizecategory?: string;
  spec?: string;
  spec2?: string;
  underbarrels?: string | string[];
  useskill?: string;
  useskillspec?: string;
  weapontype?: string;
}

// Skill types
export interface Specs {
  spec: string[];
}

export interface Skill {
  name: string;
  attribute: string;
  category: string;
  default: string; // "True" or "False"
  source?: string;
  skillgroup?: string;
  specs?: Specs;
  exotic?: boolean;
  page?: string;
  requiresflymovement?: boolean;
  requiresgroundmovement?: boolean;
  requiresswimmovement?: boolean;
}

// Book types
export interface BookMatch {
  language: string;
  text: string;
  page: number;
}

export interface BookMatches {
  match?: BookMatch[];
}

export interface Book {
  id: string;
  name: string;
  code: string;
  hide?: string;
  permanent?: string;
  matches?: BookMatches;
}

// Lifestyle types
export interface FreeGrid {
  content?: string;
  select?: string;
}

export interface FreeGrids {
  freegrid?: FreeGrid[];
}

export interface Lifestyle {
  id: string;
  name: string;
  cost: string;
  dice: string;
  lp: string;
  multiplier: string;
  source: string;
  page: string;
  hide?: string;
  freegrids?: FreeGrids;
  costforarea?: number;
  costforcomforts?: number;
  costforsecurity?: number;
  increment?: string;
  allowbonuslp?: string;
}

export interface Comfort {
  name: string;
  minimum: number;
  limit?: number;
}

export interface Neighborhood {
  name: string;
  minimum: number;
  limit?: number;
}

export interface Security {
  name: string;
  minimum: number;
  limit?: number;
}

// Quality types
export interface QualityRequiredOneOf {
  metatype?: string[];
  quality?: string[];
  power?: string;
  magenabled?: boolean;
}

export interface QualityRequiredAllOf {
  metatype?: string;
}

export interface QualityRequired {
  oneof?: QualityRequiredOneOf;
  allof?: QualityRequiredAllOf;
}

export interface QualityForbiddenOneOf {
  quality?: string[];
  bioware?: string[];
  power?: string;
}

export interface QualityForbidden {
  oneof?: QualityForbiddenOneOf;
}

export interface Quality {
  name: string;
  karma: string;
  category: string; // "Positive" or "Negative"
  source: string;
  limit?: string;
  bonus?: unknown; // Complex structure, can be expanded later
  required?: QualityRequired;
  forbidden?: QualityForbidden;
  page?: string;
  chargenonly?: boolean;
  careeronly?: boolean;
  mutant?: string;
  metagenic?: string;
  nolevels?: boolean;
  stagedpurchase?: boolean;
  refundkarmaonremove?: boolean;
  contributetobp?: boolean;
  contributetolimit?: boolean;
  includeinlimit?: unknown;
  limitwithininclusions?: boolean;
  onlyprioritygiven?: boolean;
  canbuywithspellpoints?: boolean;
  doublecareer?: boolean;
  chargenlimit?: string;
  costdiscount?: string;
  firstlevelbonus?: boolean;
  hide?: boolean;
  implemented?: boolean;
  nameonpage?: string;
  naturalweapons?: unknown;
  addweapon?: string;
}

