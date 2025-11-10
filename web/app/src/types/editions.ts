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

export interface CharacterCreationData {
  priorities: Partial<Record<PriorityCategory, Record<PriorityCode, PriorityOption>>>;
  metatypes: MetatypeDefinition[];
}
