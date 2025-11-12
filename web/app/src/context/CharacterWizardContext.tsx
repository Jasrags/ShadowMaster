import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type PriorityValue = 'A' | 'B' | 'C' | 'D' | 'E' | null;

export interface Priorities {
  magic: PriorityValue;
  metatype: PriorityValue;
  attributes: PriorityValue;
  skills: PriorityValue;
  resources: PriorityValue;
}

export interface MagicSelection {
  type: string | null;
  tradition: string | null;
  totem: string | null;
}

export interface AttributeValues {
  body: number;
  quickness: number;
  strength: number;
  charisma: number;
  intelligence: number;
  willpower: number;
}

export interface SkillEntry {
  id: string;
  name: string;
  rating: number;
}

export interface EquipmentEntry {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface ContactEntry {
  id: string;
  name: string;
  type: string;
  level: number;
  loyalty: number;
  notes?: string;
}

export type LifestyleOption = 'Street' | 'Squatter' | 'Low' | 'Middle' | 'High' | 'Luxury' | '';

export interface CharacterWizardState {
  // Basic info
  characterName: string;
  playerName: string;
  campaignId: string | null;

  // Step 1: Priorities
  priorities: Priorities;

  // Step 2: Metatype
  selectedMetatype: string | null;

  // Step 3: Magic
  magicSelection: MagicSelection;

  // Step 4: Attributes
  attributes: AttributeValues | null;
  attributeStartingValues: AttributeValues | null;
  attributeBaseValues: AttributeValues | null;

  // Step 5: Skills
  activeSkills: SkillEntry[];
  knowledgeSkills: SkillEntry[];

  // Step 6: Equipment
  weapons: EquipmentEntry[];
  armor: EquipmentEntry[];
  cyberware: EquipmentEntry[];
  bioware: EquipmentEntry[];
  gear: EquipmentEntry[];
  vehicles: EquipmentEntry[];

  // Step 7: Contacts
  contacts: ContactEntry[];

  // Step 8: Lifestyle
  lifestyle: LifestyleOption;

  // Current step
  currentStep: number;
}

interface CharacterWizardContextValue {
  state: CharacterWizardState;
  setCharacterName: (name: string) => void;
  setPlayerName: (name: string) => void;
  setCampaignId: (id: string | null) => void;
  setPriorities: (priorities: Priorities) => void;
  setSelectedMetatype: (metatype: string | null) => void;
  setMagicSelection: (selection: MagicSelection) => void;
  setAttributes: (attributes: AttributeValues) => void;
  setAttributeStartingValues: (values: AttributeValues) => void;
  setAttributeBaseValues: (values: AttributeValues) => void;
  setActiveSkills: (skills: SkillEntry[]) => void;
  setKnowledgeSkills: (skills: SkillEntry[]) => void;
  setWeapons: (weapons: EquipmentEntry[]) => void;
  setArmor: (armor: EquipmentEntry[]) => void;
  setCyberware: (cyberware: EquipmentEntry[]) => void;
  setBioware: (bioware: EquipmentEntry[]) => void;
  setGear: (gear: EquipmentEntry[]) => void;
  setVehicles: (vehicles: EquipmentEntry[]) => void;
  setContacts: (contacts: ContactEntry[]) => void;
  setLifestyle: (lifestyle: LifestyleOption) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

const initialPriorities: Priorities = {
  magic: null,
  metatype: null,
  attributes: null,
  skills: null,
  resources: null,
};

const initialState: CharacterWizardState = {
  characterName: '',
  playerName: '',
  campaignId: null,
  priorities: initialPriorities,
  selectedMetatype: null,
  magicSelection: {
    type: null,
    tradition: null,
    totem: null,
  },
  attributes: null,
  attributeStartingValues: null,
  attributeBaseValues: null,
  activeSkills: [],
  knowledgeSkills: [],
  weapons: [],
  armor: [],
  cyberware: [],
  bioware: [],
  gear: [],
  vehicles: [],
  contacts: [],
  lifestyle: '',
  currentStep: 1,
};

const CharacterWizardContext = createContext<CharacterWizardContextValue | null>(null);

export function CharacterWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CharacterWizardState>(initialState);

  const setCharacterName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, characterName: name }));
  }, []);

  const setPlayerName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, playerName: name }));
  }, []);

  const setCampaignId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, campaignId: id }));
  }, []);

  const setPriorities = useCallback((priorities: Priorities) => {
    setState((prev) => ({ ...prev, priorities }));
  }, []);

  const setSelectedMetatype = useCallback((metatype: string | null) => {
    setState((prev) => ({ ...prev, selectedMetatype: metatype }));
  }, []);

  const setMagicSelection = useCallback((selection: MagicSelection) => {
    setState((prev) => ({ ...prev, magicSelection: selection }));
  }, []);

  const setAttributes = useCallback((attributes: AttributeValues) => {
    setState((prev) => ({ ...prev, attributes }));
  }, []);

  const setAttributeStartingValues = useCallback((values: AttributeValues) => {
    setState((prev) => ({ ...prev, attributeStartingValues: values }));
  }, []);

  const setAttributeBaseValues = useCallback((values: AttributeValues) => {
    setState((prev) => ({ ...prev, attributeBaseValues: values }));
  }, []);

  const setActiveSkills = useCallback((skills: SkillEntry[]) => {
    setState((prev) => ({ ...prev, activeSkills: skills }));
  }, []);

  const setKnowledgeSkills = useCallback((skills: SkillEntry[]) => {
    setState((prev) => ({ ...prev, knowledgeSkills: skills }));
  }, []);

  const setWeapons = useCallback((weapons: EquipmentEntry[]) => {
    setState((prev) => ({ ...prev, weapons }));
  }, []);

  const setArmor = useCallback((armor: EquipmentEntry[]) => {
    setState((prev) => ({ ...prev, armor }));
  }, []);

  const setCyberware = useCallback((cyberware: EquipmentEntry[]) => {
    setState((prev) => ({ ...prev, cyberware }));
  }, []);

  const setBioware = useCallback((bioware: EquipmentEntry[]) => {
    setState((prev) => ({ ...prev, bioware }));
  }, []);

  const setGear = useCallback((gear: EquipmentEntry[]) => {
    setState((prev) => ({ ...prev, gear }));
  }, []);

  const setVehicles = useCallback((vehicles: EquipmentEntry[]) => {
    setState((prev) => ({ ...prev, vehicles }));
  }, []);

  const setContacts = useCallback((contacts: ContactEntry[]) => {
    setState((prev) => ({ ...prev, contacts }));
  }, []);

  const setLifestyle = useCallback((lifestyle: LifestyleOption) => {
    setState((prev) => ({ ...prev, lifestyle }));
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value: CharacterWizardContextValue = {
    state,
    setCharacterName,
    setPlayerName,
    setCampaignId,
    setPriorities,
    setSelectedMetatype,
    setMagicSelection,
    setAttributes,
    setAttributeStartingValues,
    setAttributeBaseValues,
    setActiveSkills,
    setKnowledgeSkills,
    setWeapons,
    setArmor,
    setCyberware,
    setBioware,
    setGear,
    setVehicles,
    setContacts,
    setLifestyle,
    setCurrentStep,
    reset,
  };

  return <CharacterWizardContext.Provider value={value}>{children}</CharacterWizardContext.Provider>;
}

export function useCharacterWizard() {
  const context = useContext(CharacterWizardContext);
  if (!context) {
    throw new Error('useCharacterWizard must be used within CharacterWizardProvider');
  }
  return context;
}

