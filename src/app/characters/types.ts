// Types and constants for character actions
// This file doesn't have "use server" so it can export types and constants

// Types for action results
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// Shadowrun character data structure
export interface ShadowrunCharacterData {
  // Basic info
  metatype: string;
  archetype: string;
  description: string;
  backstory: string;

  // Attributes
  attributes: {
    body: number;
    agility: number;
    reaction: number;
    strength: number;
    willpower: number;
    logic: number;
    intuition: number;
    charisma: number;
    edge: number;
    magic: number;
    resonance: number;
  };

  // Derived attributes
  derived: {
    initiative: number;
    composure: number;
    judgeIntentions: number;
    memory: number;
    liftCarry: number;
  };

  // Skills organized by category
  skills: {
    combat: Record<string, number>;
    physical: Record<string, number>;
    social: Record<string, number>;
    technical: Record<string, number>;
    magical: Record<string, number>;
    resonance: Record<string, number>;
  };

  // Qualities
  qualities: {
    positive: Array<{ name: string; rating?: number; description?: string }>;
    negative: Array<{ name: string; rating?: number; description?: string }>;
  };

  // Gear
  gear: Array<{
    name: string;
    category: string;
    rating?: number;
    quantity?: number;
    notes?: string;
  }>;

  // Cyberware/Bioware
  augmentations: Array<{
    name: string;
    type: "cyberware" | "bioware";
    grade: string;
    rating?: number;
    essence: number;
    notes?: string;
  }>;

  // Advancement tracking
  karma: {
    total: number;
    spent: number;
    available: number;
  };

  // Nuyen (money)
  nuyen: number;

  // Notes
  notes: string;
}

// Default empty character data
export const defaultShadowrunCharacterData: ShadowrunCharacterData = {
  metatype: "",
  archetype: "",
  description: "",
  backstory: "",
  attributes: {
    body: 1,
    agility: 1,
    reaction: 1,
    strength: 1,
    willpower: 1,
    logic: 1,
    intuition: 1,
    charisma: 1,
    edge: 1,
    magic: 0,
    resonance: 0,
  },
  derived: {
    initiative: 2,
    composure: 2,
    judgeIntentions: 2,
    memory: 2,
    liftCarry: 2,
  },
  skills: {
    combat: {},
    physical: {},
    social: {},
    technical: {},
    magical: {},
    resonance: {},
  },
  qualities: {
    positive: [],
    negative: [],
  },
  gear: [],
  augmentations: [],
  karma: {
    total: 0,
    spent: 0,
    available: 0,
  },
  nuyen: 0,
  notes: "",
};

