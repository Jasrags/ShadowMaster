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
  source?: SourceReference;
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

// SourceReference is already defined above (line 202)

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

// Action types
export type ActionType = 'unclassified' | 'free' | 'simple' | 'complex' | 'interrupt';

export interface Action {
  name?: string;
  type?: ActionType;
  description?: string;
  initiative_cost?: number;
  source?: SourceReference;
}

// Cyberware types
export interface RatingFormula {
  fixed_value?: number;
  formula?: string;
  is_fixed?: boolean;
}

export interface CostFormula {
  base_cost?: number;
  formula?: string;
  is_fixed?: boolean;
  is_variable?: boolean;
}

export interface Cyberware {
  id?: string;
  part?: string;
  device?: string;
  essence?: string;
  essence_formula?: RatingFormula;
  capacity?: string;
  capacity_formula?: RatingFormula;
  availability?: string;
  availability_formula?: RatingFormula;
  cost?: string;
  cost_formula?: CostFormula;
  source?: SourceReference;
}

// Bioware types
export interface Bioware {
  id?: string;
  type?: string;
  device?: string;
  essence?: string;
  essence_formula?: RatingFormula;
  availability?: string;
  availability_formula?: RatingFormula;
  cost?: string;
  cost_formula?: CostFormula;
  source?: SourceReference;
}

// Complex Form types
export type ComplexFormTargetType = 'persona' | 'device' | 'file' | 'host' | 'ic' | 'sprite' | 'self';
export type ComplexFormDurationType = 'instantaneous' | 'sustained' | 'permanent' | 'extended';

export interface FadingFormula {
  base_modifier?: number;
  formula?: string;
  has_fading?: boolean;
}

export interface ComplexFormDuration {
  type?: ComplexFormDurationType;
  extended_parameters?: string;
  description?: string;
}

export interface ComplexForm {
  name?: string;
  description?: string;
  target?: ComplexFormTargetType;
  duration?: ComplexFormDuration;
  fading?: FadingFormula;
  source?: SourceReference;
}

// Mentor types
export interface Mentor {
  name?: string;
  similar_archetypes?: string[];
  description?: string;
  source?: SourceReference;
}

// Metatype types
export type MetatypeCategory = 'standard' | 'metavariant' | 'shapeshifter';

export interface AttributeRange {
  min?: number;
  max?: number;
}

export interface InitiativeCalculation {
  formula?: string;
  base_dice?: number;
  additional_dice?: number;
}

export interface RacialTrait {
  name?: string;
  description?: string;
}

export interface Metatype {
  name?: string;
  category?: MetatypeCategory;
  base_race?: string;
  description?: string;
  body?: AttributeRange;
  agility?: AttributeRange;
  reaction?: AttributeRange;
  strength?: AttributeRange;
  willpower?: AttributeRange;
  logic?: AttributeRange;
  intuition?: AttributeRange;
  charisma?: AttributeRange;
  edge?: AttributeRange;
  magic?: AttributeRange;
  essence?: number;
  initiative?: InitiativeCalculation;
  racial_traits?: RacialTrait[];
  source?: SourceReference;
}

// Power types
export type ActivationType = 'free_action' | 'simple_action' | 'interrupt' | 'passive';

export interface PowerCostFormula {
  base_cost?: number;
  cost_per_level?: number;
  additional_cost?: number;
  max_level?: number;
  cost_per_item?: number;
  formula?: string;
  is_variable?: boolean;
}

export interface Power {
  name?: string;
  parameter?: string;
  description?: string;
  prerequisite?: string;
  activation?: ActivationType;
  activation_description?: string;
  cost?: PowerCostFormula;
  source?: SourceReference;
}

// Program types
export type ProgramType = 'agent' | 'commlink_app' | 'common' | 'hacking';

export interface AgentRatingRange {
  min_rating?: number;
  max_rating?: number;
}

export interface AgentCostFormula {
  cost_per_rating?: number;
  formula?: string;
}

export interface AgentAvailabilityFormula {
  availability_per_rating?: number;
  formula?: string;
}

export interface ProgramEffect {
  action?: string;
  effect?: string;
  attribute_bonus?: string;
  dice_pool_bonus?: string;
  damage_bonus?: string;
  other_effects?: string;
}

export interface Program {
  name?: string;
  type?: ProgramType;
  description?: string;
  rating_range?: AgentRatingRange;
  availability?: AgentAvailabilityFormula;
  cost?: AgentCostFormula;
  action_effect?: string;
  effects?: ProgramEffect[];
  source?: SourceReference;
}

// Spell types
export type SpellCategory = 'combat' | 'detection' | 'health' | 'illusion' | 'manipulation';
export type SpellType = 'physical' | 'mana';
export type SpellRange = 'LOS' | 'T' | 'LOS(A)';
export type SpellDamageType = 'physical' | 'stun';
export type DurationType = 'instantaneous' | 'sustained' | 'permanent';

export interface DrainFormula {
  base_modifier?: number;
  formula?: string;
  minimum_drain?: number;
}

export interface SpellEffect {
  keywords?: string[];
  description?: string;
}

export interface Spell {
  name?: string;
  category?: SpellCategory;
  description?: string;
  effects?: SpellEffect;
  type?: SpellType;
  range?: SpellRange;
  is_area?: boolean;
  damage?: SpellDamageType;
  duration?: DurationType;
  drain?: DrainFormula;
  source?: SourceReference;
}

// Tradition types
export interface Tradition {
  name?: string;
  description?: string;
  combat_element?: string;
  detection_element?: string;
  health_element?: string;
  illusion_element?: string;
  manipulation_element?: string;
  drain_formula?: string;
  drain_attributes?: string[];
  source?: SourceReference;
}

// Vehicle Modification types
export type VehicleModificationType = 'base_mods' | 'power_train' | 'protection' | 'weapon' | 'body' | 'electromagnetic' | 'cosmetic';
export type ToolType = 'kit' | 'shop' | 'facility';
export type InstallationSkillType = 'hardware' | 'none';

export interface SlotsFormula {
  fixed_slots?: number;
  rating_based?: boolean;
  is_variable?: boolean;
  description?: string;
}

export interface ThresholdFormula {
  fixed_threshold?: number;
  formula?: string;
  is_variable?: boolean;
}

export interface AvailabilityModifier {
  value?: number;
  restricted?: boolean;
  forbidden?: boolean;
  formula?: string;
  is_variable?: boolean;
}

export interface VehicleModification {
  name?: string;
  type?: VehicleModificationType;
  description?: string;
  slots?: SlotsFormula;
  threshold?: ThresholdFormula;
  tools?: ToolType;
  skill?: InstallationSkillType;
  availability?: AvailabilityModifier;
  cost?: CostFormula;
  source?: SourceReference;
}

// Vehicle types
export type VehicleType = 'groundcraft' | 'watercraft' | 'aircraft' | 'drone';
export type VehicleSubtype = 'bike' | 'car' | 'truck' | 'other_groundcraft' | 'micro_drone' | 'mini_drone' | 'small_drone' | 'medium_drone' | 'large_drone' | 'huge_drone' | 'anthro_drone' | 'missile_drone';
export type MovementType = 'G' | 'W' | 'J' | 'F' | 'P';

export interface HandlingRating {
  on_road?: number;
  off_road?: number;
}

export interface SpeedRating {
  value?: number;
  movement_type?: MovementType;
  alternative_speed?: number;
}

export interface BodyRating {
  value?: number;
  structure?: number;
}

export interface AvailabilityRating {
  value?: number;
  restricted?: boolean;
  forbidden?: boolean;
}

export interface Vehicle {
  name?: string;
  type?: VehicleType;
  subtype?: VehicleSubtype;
  vehicle_type_name?: string;
  handling?: HandlingRating;
  speed?: SpeedRating;
  acceleration?: number;
  body?: BodyRating;
  armor?: number;
  pilot?: number;
  sensor?: number;
  seats?: number;
  availability?: AvailabilityRating;
  cost?: number;
  source?: SourceReference;
}

// Character Creation Types
export interface PriorityOption {
  label: string;
  summary?: string;
  description?: string;
  available_types?: string[]; // For magic/resonance priorities
  magic_rating?: number; // For magic/resonance priorities (0 for mundane)
  free_spells?: number; // Number of free spells for Magicians/Mystic Adepts
}

export interface MetatypeDefinition {
  id: string;
  name: string;
  priority_tiers: string[];
  attribute_modifiers?: Record<string, number>;
  attribute_ranges?: Record<string, AttributeRange>;
  special_attribute_points?: Record<string, number>;
  abilities: string[];
  notes?: string;
}

export interface GameplayLevel {
  label: string;
  description?: string;
  resources?: Record<string, number>;
  starting_karma?: number;
  max_custom_karma?: number;
  karma_to_nuyen_limit?: number;
  contact_karma_multiplier?: number;
  gear_restrictions?: {
    max_device_rating?: number;
    max_availability?: number;
  };
}

export interface CreationMethod {
  label: string;
  description?: string;
  supports_multiple_column_selection?: boolean;
  point_budget?: number;
  priority_costs?: Record<string, number>;
  supports_multiple_A?: boolean;
  karma_budget?: number;
  metatype_costs?: Record<string, number>;
  gear_conversion?: {
    karma_per_nuyen?: number;
    max_karma_for_gear?: number;
    max_starting_nuyen?: number;
  };
  magic_qualities?: Array<{
    name: string;
    cost: number;
    grants?: {
      attribute?: string;
      base?: number;
      free_power_points?: string;
      power_point_cost?: number;
      notes?: string;
    };
    notes?: string;
  }>;
  notes?: string[];
  references?: string[];
}

export interface AdvancementRules {
  karma_costs: {
    attribute_multiplier: number;
    active_skill_multiplier: number;
    knowledge_skill_multiplier: number;
    skill_group_multiplier: number;
    specialization: number;
    new_knowledge_skill: number;
    new_complex_form: number;
    new_spell: number;
    initiation_base: number;
    initiation_per_grade: number;
    positive_quality_multiplier: number;
    negative_quality_removal_multiplier: number;
  };
  training: {
    attribute_per_rating_weeks: number;
    edge_requires_downtime: boolean;
    instructor_reduction_percent?: number;
    active_skill_brackets?: Array<{
      min_rating: number;
      max_rating: number;
      per_rating: number;
      unit: string;
    }>;
    skill_group_per_rating_weeks?: number;
    specialization_months?: number;
  };
  limits: {
    attribute_increase_per_downtime: number;
    skill_increase_per_downtime: number;
    skill_group_increase_per_downtime: number;
    allows_simultaneous_attribute_and_skill: boolean;
    allows_simultaneous_physical_and_mental: boolean;
    requires_augmentation_recovery_pause: boolean;
  };
  focus_bonding: Array<{
    type: string;
    label: string;
    karma_per_force: number;
  }>;
  notes?: string[];
  future_features?: string[];
}

export interface CharacterCreationData {
  priorities: {
    metatype: Record<string, PriorityOption>;
    attributes: Record<string, PriorityOption>;
    skills: Record<string, PriorityOption>;
    resources: Record<string, PriorityOption>;
    magic: Record<string, PriorityOption>;
  };
  metatypes: MetatypeDefinition[];
  gameplay_levels: Record<string, GameplayLevel>;
  creation_methods: Record<string, CreationMethod>;
  advancement?: AdvancementRules;
}

export interface PrioritySelection {
  metatype_priority: string; // A-E
  attributes_priority: string; // A-E
  magic_priority: string; // A-E or "none"
  skills_priority: string; // A-E
  resources_priority: string; // A-E
  selected_metatype?: string;
  magic_type?: string;
  tradition?: string;
  gameplay_level?: string;
  edge?: number;
  magic?: number;
  resonance?: number;
  skill_allocations?: Record<string, { rating: number; specialization?: string }>;
}

export interface SumToTenSelection {
  metatype_priority: string;
  attributes_priority: string;
  magic_priority: string;
  skills_priority: string;
  resources_priority: string;
  selected_metatype?: string;
  magic_type?: string;
  tradition?: string;
  gameplay_level?: string;
  edge?: number;
  magic?: number;
  resonance?: number;
  skill_allocations?: Record<string, { rating: number; specialization?: string }>;
}

export interface KarmaSelection {
  metatype: string;
  attributes: Record<string, number>;
  magic_type?: string;
  tradition?: string;
  skills: Record<string, number>;
  qualities?: Array<{ name: string; type: 'positive' | 'negative' }>;
  equipment?: Array<{ type: string; name: string }>;
  gameplay_level?: string;
}

export interface Character {
  id: string;
  name: string;
  player_name?: string;
  user_id?: string;
  campaign_id?: string;
  is_npc: boolean;
  status?: string;
  edition: string;
  edition_data: CharacterSR5 | Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface InitiativeValue {
  base: number;
  augmented: number;
  dice: number;
}

export interface InitiativeData {
  physical: InitiativeValue;
  astral: InitiativeValue;
  matrix_ar: InitiativeValue;
  matrix_vr_cold: InitiativeValue;
  matrix_vr_hot: InitiativeValue;
}

export interface InherentLimits {
  mental: number;
  physical: number;
  social: number;
}

export interface ConditionMonitor {
  physical: number;
  stun: number;
  overflow: number;
}

export interface LivingPersona {
  attack: number;
  data_processing: number;
  device_rating: number;
  firewall: number;
  sleaze: number;
}

// Equipment item types - union of all equipment types
export type EquipmentItem = Weapon | Armor | Cyberware | Bioware | Gear | Vehicle;

// Karma spending structure
export interface KarmaSpending {
  spells?: Array<{ name: string; karma_cost: number }>;
  contacts?: Array<{ name: string; karma_cost: number }>;
  improvements?: Array<{ type: string; description: string; karma_cost: number }>;
  total_spent?: number;
}

// Focus types (magical foci)
export interface Focus {
  name: string;
  type: string; // e.g., 'weapon', 'spell', 'power', etc.
  rating: number;
  force?: number;
  source?: SourceReference;
}

// Spirit types
export interface Spirit {
  name: string;
  type: string; // e.g., 'fire', 'water', 'air', 'earth', etc.
  force: number;
  services?: number;
  source?: SourceReference;
}

// Adept Power types
export interface AdeptPower {
  name: string;
  level?: number;
  power_points: number;
  description?: string;
  source?: SourceReference;
}

export interface CharacterSR5 {
  // Attributes
  body: number;
  agility: number;
  reaction: number;
  strength: number;
  willpower: number;
  logic: number;
  intuition: number;
  charisma: number;
  edge: number;
  magic?: number;
  resonance?: number;
  
  // Priority system
  metatype_priority: string;
  attributes_priority: string;
  magic_priority: string;
  skills_priority: string;
  resources_priority: string;
  creation_method: string;
  gameplay_level: string;
  
  // Metatype
  metatype: string;
  special_attribute_points: number;
  
  // Skills
  active_skills: Record<string, Skill>;
  knowledge_skills: Record<string, Skill>;
  language_skills: Record<string, Skill>;
  
  // Qualities
  positive_qualities: Quality[];
  negative_qualities: Quality[];
  
  // Equipment
  weapons: Weapon[];
  armor: Armor[];
  cyberware: Cyberware[];
  bioware: Bioware[];
  gear: Gear[];
  vehicles: Vehicle[];
  
  // Magic
  magic_type?: string;
  tradition?: string;
  spells: Spell[];
  complex_forms: ComplexForm[];
  focuses: Focus[];
  spirits: Spirit[];
  adept_powers: AdeptPower[];
  power_points?: number;
  
  // Social
  contacts: Contact[];
  lifestyle: string;
  
  // Resources
  karma: number;
  nuyen: number;
  essence: number;
  
  // Derived
  initiative: InitiativeData;
  inherent_limits: InherentLimits;
  condition_monitor: ConditionMonitor;
  living_persona?: LivingPersona;
}

