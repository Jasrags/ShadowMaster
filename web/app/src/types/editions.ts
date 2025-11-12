export type PriorityCode = 'A' | 'B' | 'C' | 'D' | 'E';

export interface SourceBookMatch {
  language: string;
  page: string;
  text: string;
}

export interface SourceBook {
  id: string;
  name: string;
  code: string;
  matches?: SourceBookMatch[];
}

export interface PriorityOption {
  label: string;
  summary?: string;
  description?: string;
}

export type PriorityCategory =
  | 'magic'
  | 'metatype'
  | 'attributes'
  | 'skills'
  | 'resources';

export type PriorityTable = Record<PriorityCategory, Record<PriorityCode, PriorityOption>>;

export interface AttributeRange {
  min: number;
  max: number;
}

export interface MetatypeDefinition {
  id: string;
  name: string;
  priority_tiers: PriorityCode[];
  attribute_modifiers?: Record<string, number>;
  attribute_ranges?: Record<string, AttributeRange>;
  special_attribute_points?: Partial<Record<PriorityCode, number>>;
  abilities: string[];
  notes?: string;
}

export interface GearRestrictions {
  max_device_rating?: number | null;
  max_availability?: number | null;
}

export interface FocusBondingRule {
  type: string;
  label: string;
  karma_per_force: number;
}

export interface SkillTrainingBracket {
  min_rating: number;
  max_rating: number;
  per_rating: number;
  unit: 'day' | 'week' | 'month' | string;
}

export interface AdvancementKarmaCosts {
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
}

export interface AdvancementTraining {
  attribute_per_rating_weeks: number;
  edge_requires_downtime: boolean;
  instructor_reduction_percent?: number;
  active_skill_brackets?: SkillTrainingBracket[];
  skill_group_per_rating_weeks?: number;
  specialization_months?: number;
}

export interface AdvancementLimits {
  attribute_increase_per_downtime: number;
  skill_increase_per_downtime: number;
  skill_group_increase_per_downtime: number;
  allows_simultaneous_attribute_and_skill: boolean;
  allows_simultaneous_physical_and_mental: boolean;
  requires_augmentation_recovery_pause?: boolean;
}

export interface AdvancementRules {
  karma_costs: AdvancementKarmaCosts;
  training: AdvancementTraining;
  limits: AdvancementLimits;
  focus_bonding: FocusBondingRule[];
  notes?: string[];
  future_features?: string[];
}

export interface GameplayLevelDefinition {
  label: string;
  description?: string;
  resources?: Partial<Record<PriorityCode, number>>;
  starting_karma?: number;
  max_custom_karma?: number;
  karma_to_nuyen_limit?: number;
  contact_karma_multiplier?: number;
  gear_restrictions?: GearRestrictions;
}

export interface GameplayRules {
  key: string;
  label: string;
  description?: string;
  resources?: Partial<Record<PriorityCode, number>>;
  starting_karma?: number;
  max_custom_karma?: number;
  karma_to_nuyen_limit?: number;
  contact_karma_multiplier?: number;
  gear_restrictions?: GearRestrictions;
  advancement?: AdvancementRules;
}

export interface CreationMethodGearConversion {
  karma_per_nuyen?: number;
  max_karma_for_gear?: number;
  max_starting_nuyen?: number;
}

export interface CreationMethodMagicQualityGrant {
  attribute?: string;
  base?: number;
  free_power_points?: string;
  power_point_cost?: number;
  notes?: string;
}

export interface CreationMethodMagicQuality {
  name: string;
  cost: number;
  grants?: CreationMethodMagicQualityGrant;
  notes?: string;
}

export interface CreationMethodDefinition {
  label: string;
  description?: string;
  supports_multiple_column_selection?: boolean;
  point_budget?: number;
  priority_costs?: Partial<Record<PriorityCode, number>>;
  supports_multiple_A?: boolean;
  karma_budget?: number;
  metatype_costs?: Record<string, number>;
  gear_conversion?: CreationMethodGearConversion;
  magic_qualities?: CreationMethodMagicQuality[];
  notes?: string[];
  references?: string[];
}

export interface CharacterCreationData {
  priorities: Partial<Record<PriorityCategory, Record<PriorityCode, PriorityOption>>>;
  metatypes: MetatypeDefinition[];
  gameplay_levels?: Record<string, GameplayLevelDefinition>;
  creation_methods?: Record<string, CreationMethodDefinition>;
  advancement?: AdvancementRules;
}

export interface CampaignCharacterCreationResponse {
  campaign_id: string;
  edition: string;
  edition_data: CharacterCreationData;
  creation_method?: string;
  gameplay_rules?: GameplayRules;
}

export interface UserSummary {
  id: string;
  email: string;
  username: string;
  roles: string[];
}
