export interface ShadowmasterLegacyApp {
  loadCampaigns?: () => void;
  setEditionData?: (edition: string, data: unknown) => void;
  applyCampaignCreationDefaults?: (payload: unknown) => void;
  showLegacyKarmaWizard?: () => void;
  setMetatypeSelection?: (id: string) => void;
  setMagicState?: (state: unknown) => void;
  getPriorities?: () => unknown;
  setPriorities?: (payload: unknown) => void;
  setKarmaPointBuy?: (payload: unknown) => void;
}
