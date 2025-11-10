export type PriorityCode = 'A' | 'B' | 'C' | 'D' | 'E';

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
}

export interface CharacterCreationData {
  priorities: Partial<Record<PriorityCategory, Record<PriorityCode, PriorityOption>>>;
  metatypes: MetatypeDefinition[];
  gameplay_levels?: Record<string, GameplayLevelDefinition>;
}

export interface CampaignCharacterCreationResponse {
  campaign_id: string;
  edition: string;
  edition_data: CharacterCreationData;
  gameplay_rules?: GameplayRules;
}

export interface UserSummary {
  id: string;
  email: string;
  username: string;
  roles: string[];
}
