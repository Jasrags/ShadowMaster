import { GameplayRules } from './editions';

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


