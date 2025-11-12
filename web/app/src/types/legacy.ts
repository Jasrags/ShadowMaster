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
  getSkillsState?: () => unknown;
  setSkillsState?: (payload: unknown) => void;
  showWizardStep?: (step: number) => void;
  loadCampaignCharacterCreation?: (campaignId: string) => Promise<void>;
  clearCampaignCharacterCreation?: () => void;
  subscribeMetatypeState?: (listener: () => void) => void;
  unsubscribeMetatypeState?: (listener: () => void) => void;
  subscribeMagicState?: (listener: () => void) => void;
  unsubscribeMagicState?: (listener: () => void) => void;
  getMagicState?: () => {
    priority: string;
    type: string | null;
    tradition: string | null;
    totem: string | null;
  };
  getAttributesState?: () => {
    values?: Record<string, number> | null;
    startingValues?: Record<string, number> | null;
    baseValues?: Record<string, number> | null;
  } | null;
  setAttributesState?: (payload: {
    values?: Record<string, number> | null;
    startingValues?: Record<string, number> | null;
    baseValues?: Record<string, number> | null;
  }) => void;
  getEquipmentState?: () => {
    priority?: string;
    weapons?: Array<{
      id?: string;
      name: string;
      type?: string;
      damage?: string;
      accuracy?: number;
      concealability?: number;
      mode?: string;
      range?: string;
      notes?: string;
      cost?: number;
    }>;
    armor?: Array<{
      id?: string;
      name: string;
      type?: string;
      rating?: number;
      notes?: string;
      cost?: number;
    }>;
    cyberware?: Array<{
      id?: string;
      name: string;
      rating?: number;
      essenceCost?: number;
      cost?: number;
      availability?: number;
      notes?: string;
    }>;
    bioware?: Array<{
      id?: string;
      name: string;
      rating?: number;
      cost?: number;
      availability?: number;
      notes?: string;
    }>;
    gear?: Array<{
      id?: string;
      name: string;
      type?: string;
      count?: number;
      notes?: string;
      cost?: number;
    }>;
    vehicles?: Array<{
      id?: string;
      name: string;
      type?: string;
      handling?: number;
      speed?: number;
      acceleration?: number;
      body?: number;
      armor?: number;
      modifications?: string[];
      notes?: string;
      cost?: number;
    }>;
    totalCost?: number;
    remainingNuyen?: number;
    totalEssenceCost?: number;
  } | null;
  setEquipmentState?: (payload: {
    priority?: string;
    weapons?: Array<{
      id?: string;
      name: string;
      type?: string;
      damage?: string;
      accuracy?: number;
      concealability?: number;
      mode?: string;
      range?: string;
      notes?: string;
      cost?: number;
    }>;
    armor?: Array<{
      id?: string;
      name: string;
      type?: string;
      rating?: number;
      notes?: string;
      cost?: number;
    }>;
    cyberware?: Array<{
      id?: string;
      name: string;
      rating?: number;
      essenceCost?: number;
      cost?: number;
      availability?: number;
      notes?: string;
    }>;
    bioware?: Array<{
      id?: string;
      name: string;
      rating?: number;
      cost?: number;
      availability?: number;
      notes?: string;
    }>;
    gear?: Array<{
      id?: string;
      name: string;
      type?: string;
      count?: number;
      notes?: string;
      cost?: number;
    }>;
    vehicles?: Array<{
      id?: string;
      name: string;
      type?: string;
      handling?: number;
      speed?: number;
      acceleration?: number;
      body?: number;
      armor?: number;
      modifications?: string[];
      notes?: string;
      cost?: number;
    }>;
    totalCost?: number;
    remainingNuyen?: number;
    totalEssenceCost?: number;
  }) => void;
  subscribeEquipmentState?: (listener: () => void) => () => void;
  getContactsState?: () => {
    contacts?: Array<{
      id?: string;
      name: string;
      type?: string;
      level?: number;
      loyalty?: number;
      notes?: string;
    }>;
  } | null;
  setContactsState?: (payload: {
    contacts?: Array<{
      id?: string;
      name: string;
      type?: string;
      level?: number;
      loyalty?: number;
      notes?: string;
    }>;
  }) => void;
  subscribeContactsState?: (listener: () => void) => () => void;
  getLifestyleState?: () => {
    lifestyle?: string;
  } | null;
  setLifestyleState?: (payload: {
    lifestyle?: string;
  }) => void;
  subscribeLifestyleState?: (listener: () => void) => () => void;
}
