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
export interface GearMechanicalEffect {
  dice_pool_bonus?: number;
  limit_bonus?: number;
  rating_bonus?: number;
  test_type?: string;
  skill_substitution?: string;
  perception_penalty?: number;
  noise_reduction?: number;
  damage_value?: string;
  armor_value?: number;
  structure_value?: number;
  strength_multiplier?: number;
  weight_capacity?: number;
  range?: string;
  area_effect?: string;
  duration?: string;
  charges?: string;
  operating_time?: string;
  other_effects?: string;
}

export interface GearSpecialProperty {
  concealability_modifier?: number;
  capacity?: number;
  max_rating?: number;
  requires_capacity?: number;
  size?: string;
  restocking_requirement?: string;
  compatible_with?: string[];
  requires?: string[];
  cannot_combine_with?: string[];
  optical_only?: boolean;
  wireless_required?: boolean;
  no_wireless_capability?: boolean;
  always_runs_silent?: boolean;
  emp_hardened?: boolean;
  can_change_owner?: boolean;
  other_properties?: string;
}

export interface WirelessBonus {
  description?: string;
  action_change?: string;
  dice_pool_bonus?: number;
  limit_bonus?: number;
  skill_substitution?: string;
  rating_bonus?: number;
  range_change?: string;
  other_effects?: string;
}

export interface SourceReference {
  source?: string;
  page?: string;
}

export interface Gear {
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  cost?: number;
  cost_per_rating?: boolean;
  cost_formula?: string;
  availability?: string;
  rating?: number;
  device_type?: string;
  device_rating?: number;
  mechanical_effects?: GearMechanicalEffect;
  special_properties?: GearSpecialProperty;
  wireless_bonus?: WirelessBonus;
  source?: SourceReference;
  // Legacy fields for backward compatibility
  page?: string;
  avail?: string;
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
  max_rating?: number;
  description?: string;
  addmodcategory?: string;
  selectmodsfromcategory?: {
    category: string;
  };
  gears?: {
    usegear?: string[];
  };
  addweapon?: string;
  bonus?: unknown;
  modification_effects?: unknown;
  wirelessbonus?: unknown;
  special_properties?: unknown;
  compatible_with?: string[];
  requires?: string;
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

// WeaponAccessoryItem nested types (matching Go JSON field names)
export interface AddUnderbarrels {
  weapon?: string[];
}

export interface AllowGear {
  gearcategory?: string[]; // JSON field is lowercase
}

export interface WirelessWeaponBonus {
  accuracy?: string;
  accuracyreplace?: string; // JSON field is lowercase
  ap?: string;
  apreplace?: string; // JSON field is lowercase
  damage?: string;
  damagereplace?: string; // JSON field is lowercase
  damagetype?: string; // JSON field is lowercase
  mode?: string;
  modereplace?: string; // JSON field is lowercase
  pool?: string;
  rangebonus?: number; // JSON field is lowercase
  rc?: string;
  smartlinkpool?: string; // JSON field is lowercase
  userange?: string; // JSON field is lowercase
}

// WeaponAccessoryItem represents a standalone weapon accessory (from /equipment/weapon-accessories endpoint)
// Field names match the Go JSON tags (lowercase)
export interface WeaponAccessoryItem {
  id?: string;
  name: string;
  mount: string;
  avail: string;
  cost: string;
  source: string;
  page?: string;
  description?: string;
  special_properties?: unknown;
  wireless_bonus?: unknown;
  extramount?: string;
  addmount?: string;
  accessorycostmultiplier?: string;
  accuracy?: string;
  ammobonus?: string;
  ammoreplace?: string;
  ammoslots?: string;
  conceal?: string;
  damage?: string;
  damagetype?: string;
  dicepool?: number;
  modifyammocapacity?: string;
  rating?: string;
  rc?: string;
  rcdeployable?: string;
  rcgroup?: number;
  replacerange?: string;
  hide?: string;
  ignoresourcedisabled?: string;
  addunderbarrels?: AddUnderbarrels; // JSON field is lowercase
  allowgear?: AllowGear; // JSON field is lowercase
  gears?: {
    usegear?: unknown[]; // JSON field is lowercase, simplified
  };
  required?: unknown; // Simplified, can be detailed if needed
  forbidden?: unknown; // Simplified, can be detailed if needed
  wirelessweaponbonus?: WirelessWeaponBonus; // JSON field is lowercase
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

// Skill Type
export type SkillType = 'active' | 'knowledge' | 'language';

// Skill Category
export type SkillCategory = 
  | 'combat_active'
  | 'physical_active'
  | 'social'
  | 'magical'
  | 'resonance'
  | 'technical'
  | 'vehicle'
  | 'knowledge'
  | 'language';

// Attribute
export type Attribute = 
  | 'agility'
  | 'body'
  | 'charisma'
  | 'intuition'
  | 'logic'
  | 'magic'
  | 'reaction'
  | 'resonance'
  | 'strength'
  | 'willpower';

// Skill interface (updated to match Go struct)
export interface Skill {
  name: string;
  type: SkillType;
  category: SkillCategory;
  linked_attribute: Attribute;
  description: string;
  can_default: boolean;
  skill_group?: string;
  specializations?: string[];
  is_specific: boolean;
  source?: SourceReference;
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

// Base lifestyle definition (from backend)
export interface Lifestyle {
  id: string;
  name: string;
  description: string;
  cost: string;
  source: string;
  category: string; // "Lifestyle" or "Lifestyle Option"
}

// Weapon Consumable types
export interface WeaponConsumable {
  id: string;
  name: string;
  category: string; // "Ammunition", "Ballistic Projectile", "Grenade", "Rocket & Missile"
  description?: string;
  source: string;
  // Base weapon stats (for ammunition that replaces weapon stats)
  base_dv?: string;
  base_ap?: string;
  base_acc?: string;
  // Modifier stats (for ammunition that modifies weapon stats)
  modifier_dv?: string;
  modifier_ap?: string;
  modifier_acc?: string;
  // Direct stats (for grenades, rockets, missiles)
  dv?: string;
  ap?: string;
  blast?: string;
  // Availability and cost
  availability?: string;
  cost: string;
  quantity_per_purchase?: number;
  unit_type?: string;
}

// Extended lifestyle type for XML-based data (legacy/optional)
export interface LifestyleExtended {
  id: string;
  name: string;
  cost: string;
  dice?: string;
  lp?: string;
  multiplier?: string;
  source?: string;
  page?: string;
  hide?: string;
  freegrids?: FreeGrids;
  costforarea?: number;
  costforcomforts?: number;
  costforsecurity?: number;
  increment?: string;
  allowbonuslp?: string;
  description?: string;
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
// Quality Type
export type QualityType = 'positive' | 'negative';

// Cost Structure
export interface CostStructure {
  base_cost: number;
  per_rating: boolean;
  max_rating: number;
}

// Source Reference
export interface SourceReference {
  source: string;
  page: string;
}

// Skill Dice Pool Bonus
export interface SkillDicePoolBonus {
  target: string;
  bonus: number;
  conditions?: string[];
}

// Skill Rating Modifier
export interface SkillRatingModifier {
  skill_name: string;
  max_rating_at_chargen: number;
  max_rating: number;
}

// Attribute Modifier
export interface AttributeModifier {
  attribute_name: string;
  max_rating_increase: number;
}

// Astral Signature Modifier
export interface AstralSignatureModifier {
  signature_duration_multiplier: number;
  assensing_penalty: number;
}

// Sustained Spell Modifier
export interface SustainedSpellModifier {
  penalty_free_sustain_rating: number;
}

// Addiction Modifier
export type AddictionType = 'physiological' | 'psychological';
export type AddictionSeverity = 'mild' | 'moderate' | 'severe' | 'burnout';

export interface AddictionModifier {
  type: AddictionType;
  severity: AddictionSeverity;
  dosage_required: number;
  cravings_frequency: string;
  withdrawal_penalty: number;
  social_test_penalty: number;
  substance_name: string;
}

// Allergy Modifier
export type AllergyRarity = 'uncommon' | 'common';
export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'extreme';

export interface AllergyModifier {
  rarity: AllergyRarity;
  severity: AllergySeverity;
  resistance_test_penalty: number;
  allergen_name: string;
}

// Initiative Modifier
export interface InitiativeModifier {
  first_turn_divisor: number;
}

// Prejudiced Modifier
export interface PrejudicedModifier {
  target_group: string;
  severity_level: number;
  social_test_penalty_per_level: number;
  negotiation_bonus_per_level: number;
}

// Scorched Effects
export interface ScorchedEffects {
  effect_description: string;
  vrbtl_test_threshold: number;
  effect_duration_hours: number;
  critical_glitch_duration_hours: number;
  damage_resistance_penalty: number;
  requires_addiction: boolean;
}

// Sensitive System Effects
export interface SensitiveSystemEffects {
  cyberware_essence_multiplier: number;
  bioware_rejected: boolean;
  drain_fading_test_threshold: number;
  drain_fading_value_increase: number;
}

// Knowledge Skill Restrictions
export interface KnowledgeSkillRestrictions {
  affected_categories: string[];
  cost_multiplier: number;
  cannot_default: boolean;
}

// Quality Bonus
export interface QualityBonus {
  ambidextrous?: boolean[];
  skill_dice_pool_bonuses?: SkillDicePoolBonus[];
  skill_rating_modifiers?: SkillRatingModifier[];
  attribute_modifiers?: AttributeModifier[];
  astral_signature_modifiers?: AstralSignatureModifier[];
  free_language_skills?: number;
  memory_test_threshold_increase?: number;
  shadowing_penalty?: number;
  matrix_action_bonus?: SkillDicePoolBonus;
  social_test_bonus?: SkillDicePoolBonus;
  sustained_spell_modifier?: SustainedSpellModifier;
  fear_resistance_bonus?: number;
  wound_modifier_ignore?: number;
  addiction_modifiers?: AddictionModifier[];
  allergy_modifiers?: AllergyModifier[];
  bad_luck_edge_penalty?: boolean;
  notoriety_bonus?: number;
  code_of_honor_protected_groups?: string[];
  matrix_action_penalty?: SkillDicePoolBonus;
  initiative_modifier?: InitiativeModifier;
  surprise_test_penalty?: number;
  composure_test_threshold_modifier?: number;
  dependents_level?: number;
  lifestyle_cost_increase_percent?: number;
  skill_advancement_time_multiplier?: number;
  memory_test_threshold_decrease?: number;
  identification_bonus?: number;
  glitch_reduction_per_level?: number;
  incompetent_skill_groups?: string[];
  insomnia_level?: number;
  loss_of_confidence_skill?: string;
  wound_modifier_frequency?: number;
  prejudiced_modifiers?: PrejudicedModifier[];
  scorched_effects?: ScorchedEffects;
  sensitive_system_effects?: SensitiveSystemEffects;
  simsense_vertigo_penalty?: number;
  sin_type?: string;
  social_stress_affected_skills?: string[];
  spirit_bane_spirit_type?: string;
  social_skill_cost_multiplier?: number;
  knowledge_skill_restrictions?: KnowledgeSkillRestrictions;
  agility_test_penalty?: number;
  disease_power_increase?: number;
}

// Quality Requirements
export interface QualityRequirements {
  metatype_restrictions?: string[];
  magic_required?: boolean;
  resonance_required?: boolean;
  chargen_only?: boolean;
  max_times?: number;
  other_restrictions?: string[];
}

// Quality Definition (new structure)
export interface Quality {
  name: string;
  type: QualityType;
  cost: CostStructure;
  description: string;
  bonus?: QualityBonus;
  requirements?: QualityRequirements;
  source?: SourceReference;
}

// Contact types
export interface Contact {
  id?: string;
  name?: string;
  uses?: string[];
  places_to_meet?: string;
  similar_contacts?: string[];
  description?: string;
  source?: string;
}

