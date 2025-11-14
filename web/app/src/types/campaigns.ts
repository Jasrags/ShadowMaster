import { GameplayRules } from './editions';

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
  role: string;
}

export interface CampaignSessionSeed {
  title?: string;
  objectives?: string;
  sceneTemplate?: string;
  summary?: string;
  skip?: boolean;
}

export interface CampaignPlayerReference {
  id: string;
  username?: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  group_id?: string;
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
  session_seed?: CampaignSessionSeed | null;
  player_user_ids?: string[];
  players?: CampaignPlayerReference[];
  house_rules?: string;
  status: string;
  created_at: string;
  updated_at: string;
  setup_locked_at?: string;
  enabled_books: string[];
}

export type CampaignStatus = 'Active' | 'Paused' | 'Completed';

export interface CampaignSummary {
  id: string;
  name: string;
  description?: string;
  group_id?: string;
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
  session_seed?: CampaignSessionSeed | null;
  player_user_ids?: string[];
  players?: CampaignPlayerReference[];
  house_rules?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  setup_locked_at?: string;
  gameplay_rules?: GameplayRules;
  enabled_books: string[];
  can_edit: boolean;
  can_delete: boolean;
}

