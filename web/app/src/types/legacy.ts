import type { PriorityCode } from './editions';

export interface ShadowmasterLegacyApp {
  initialize?: () => void;
  isInitialized?: () => boolean;
  setEditionData?: (edition: string, data: unknown) => void;
  loadCharacters?: () => void;
  loadCampaigns?: () => void;
  loadCampaignCharacterCreation?: (campaignId: string) => Promise<void>;
  clearCampaignCharacterCreation?: () => void;
  applyCampaignCreationDefaults?: (payload: unknown) => void;
  setPriorities?: (assignments: Record<string, PriorityCode | null>) => void;
  getPriorities?: () => Record<string, PriorityCode | null>;
}
