/**
 * Character types
 *
 * Defines the structure for Shadowrun characters across all editions.
 * Characters are tied to a specific edition and creation method,
 * and store a reference to the ruleset snapshot used during creation.
 */

import type { ID, ISODateString, Metadata } from "./core";
import type { EditionCode } from "./edition";

// =============================================================================
// CHARACTER CORE
// =============================================================================

/**
 * Magical or resonance path for a character
 */
export type MagicalPath =
  | "mundane"
  | "full-mage"
  | "aspected-mage"
  | "mystic-adept"
  | "adept"
  | "technomancer";

/**
 * Status of a character
 */
export type CharacterStatus =
  | "draft" // Still being created
  | "active" // Playable character
  | "retired" // No longer in active play
  | "deceased"; // Character died in game

/**
 * A complete Shadowrun character
 */
export interface Character {
  id: ID;

  /** Owner user ID */
  ownerId: ID;

  /** Edition this character belongs to */
  editionId: ID;
  editionCode: EditionCode;

  /** Creation method used to build this character */
  creationMethodId: ID;
  creationMethodVersion?: string;

  /**
   * Reference to the merged ruleset snapshot used during creation.
   * This ensures the character can always be validated against
   * the same rules they were created with.
   */
  rulesetSnapshotId?: ID;

  /** Books enabled when this character was created */
  attachedBookIds: ID[];

  // -------------------------------------------------------------------------
  // Basic Info
  // -------------------------------------------------------------------------

  name: string;
  metatype: string; // e.g., "Human", "Elf", "Nocturna", "Ork", "Oni"
  gender?: string;
  age?: number;
  height?: string;
  weight?: string;
  ethnicity?: string;
  description?: string;
  background?: string;
  imageUrl?: string;

  status: CharacterStatus;

  // -------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------

  /**
   * Core attributes keyed by attribute code
   * e.g., { "bod": 4, "agi": 5, "rea": 3, ... }
   */
  attributes: Record<string, number>;

  /**
   * Special attributes (Edge, Essence, Magic/Resonance)
   * Tracked separately as they have different rules
   */
  specialAttributes: {
    edge: number;
    essence: number;
    magic?: number;
    resonance?: number;
  };

  // -------------------------------------------------------------------------
  // Skills
  // -------------------------------------------------------------------------

  /**
   * Skills keyed by skill ID
   * Value is the rating (1-6 at creation, can increase with karma)
   */
  skills: Record<string, number>;

  /**
   * Skill specializations keyed by skill ID
   */
  skillSpecializations?: Record<string, string[]>;

  /**
   * Knowledge skills with categories
   */
  knowledgeSkills?: KnowledgeSkill[];

  /**
   * Language skills
   */
  languages?: LanguageSkill[];

  // -------------------------------------------------------------------------
  // Qualities
  // -------------------------------------------------------------------------

  /** Positive quality IDs */
  positiveQualities: string[];

  /** Negative quality IDs */
  negativeQualities: string[];

  /** Custom quality notes (for qualities with variable effects) */
  qualityNotes?: Record<string, string>;

  // -------------------------------------------------------------------------
  // Magic / Resonance
  // -------------------------------------------------------------------------

  magicalPath: MagicalPath;

  /** For mages: tradition (Hermetic, Shaman, etc.) */
  tradition?: string;

  /** For technomancers: stream */
  stream?: string;

  /** Spells known (spell IDs) */
  spells?: string[];

  /** Adept powers with ratings */
  adeptPowers?: AdeptPower[];

  /** Complex forms for technomancers */
  complexForms?: string[];

  /** Spirits/sprites bound or registered */
  spirits?: BoundSpirit[];

  // -------------------------------------------------------------------------
  // Gear & Resources
  // -------------------------------------------------------------------------

  /** Starting and current nuyen */
  nuyen: number;
  startingNuyen: number;

  /** Current lifestyle */
  lifestyle?: Lifestyle;

  /** All owned gear */
  gear: GearItem[];

  /** Weapons (subset of gear with combat stats) */
  weapons?: Weapon[];

  /** Armor items */
  armor?: ArmorItem[];

  /** Cyberware installed */
  cyberware?: CyberwareItem[];

  /** Bioware installed (edition-dependent) */
  bioware?: BiowareItem[];

  /** Vehicles and drones owned */
  vehicles?: Vehicle[];

  // -------------------------------------------------------------------------
  // Contacts
  // -------------------------------------------------------------------------

  contacts: Contact[];

  // -------------------------------------------------------------------------
  // Derived Stats & Condition
  // -------------------------------------------------------------------------

  /**
   * Derived stats calculated from attributes and gear
   * e.g., { "physicalLimit": 5, "mentalLimit": 6, "initiative": 8 }
   */
  derivedStats: Record<string, number>;

  /**
   * Current condition (damage taken)
   */
  condition: {
    physicalDamage: number;
    stunDamage: number;
    overflowDamage?: number;
  };

  // -------------------------------------------------------------------------
  // Karma & Advancement
  // -------------------------------------------------------------------------

  /** Total karma earned over character lifetime */
  karmaTotal: number;

  /** Current unspent karma */
  karmaCurrent: number;

  /** Karma spent during creation */
  karmaSpentAtCreation: number;

  /** Street cred, notoriety, public awareness (SR5) */
  reputation?: {
    streetCred: number;
    notoriety: number;
    publicAwareness: number;
  };

  // -------------------------------------------------------------------------
  // Campaign & Meta
  // -------------------------------------------------------------------------

  /** Campaign this character belongs to (if any) */
  campaignId?: ID;

  /** Private notes (only visible to owner) */
  privateNotes?: string;

  /** GM notes (only visible to GM) */
  gmNotes?: string;

  createdAt: ISODateString;
  updatedAt?: ISODateString;

  /** Extensible metadata */
  metadata?: Metadata;
}

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

export interface KnowledgeSkill {
  name: string;
  category: "academic" | "interest" | "professional" | "street";
  rating: number;
}

export interface LanguageSkill {
  name: string;
  rating: number; // 0 = none, N = native
  isNative?: boolean;
}

export interface AdeptPower {
  id: string;
  name: string;
  rating?: number;
  powerPointCost: number;
}

export interface BoundSpirit {
  type: string; // Spirit type
  force: number;
  services: number;
  bound: boolean;
}

export interface Lifestyle {
  type: string; // "Street", "Squatter", "Low", "Medium", "High", "Luxury"
  monthlyCost: number;
  prepaidMonths?: number;
  location?: string;
  notes?: string;
}

export interface GearItem {
  id?: ID;
  name: string;
  category: string;
  quantity: number;
  cost: number;
  availability?: number;
  rating?: number;
  notes?: string;
  metadata?: Metadata;
}

export interface Weapon extends GearItem {
  damage: string; // e.g., "8P" for 8 physical
  ap: number; // Armor penetration
  mode: string[]; // "SS", "SA", "BF", "FA"
  recoil?: number;
  ammoType?: string;
  ammoCapacity?: number;
  currentAmmo?: number;
  reach?: number; // For melee weapons
}

export interface ArmorItem extends GearItem {
  armorRating: number;
  equipped: boolean;
  modifications?: string[];
}

export interface CyberwareItem {
  id?: ID;
  name: string;
  grade: "standard" | "alpha" | "beta" | "delta" | "used";
  essenceCost: number;
  rating?: number;
  capacity?: number;
  capacityUsed?: number;
  notes?: string;
}

export interface BiowareItem {
  id?: ID;
  name: string;
  grade: "standard" | "cultured";
  essenceCost: number;
  rating?: number;
  notes?: string;
}

export interface Vehicle {
  id?: ID;
  name: string;
  type: "ground" | "water" | "air" | "drone";
  handling: number;
  speed: number;
  acceleration: number;
  body: number;
  armor: number;
  pilot: number;
  sensor: number;
  seats?: number;
  notes?: string;
}

export interface Contact {
  name: string;
  connection: number; // 1-6, how connected/useful
  loyalty: number; // 1-6, how loyal to character
  type?: string; // "Fixer", "Street Doc", etc.
  notes?: string;
}

// =============================================================================
// CHARACTER DRAFT (During Creation)
// =============================================================================

/**
 * Partial character used during the creation process.
 * Fields are optional until finalized.
 */
export type CharacterDraft = Partial<Character> & {
  id: ID;
  ownerId: ID;
  editionId: ID;
  editionCode: EditionCode;
  creationMethodId: ID;
  status: "draft";
  createdAt: ISODateString;
};

// =============================================================================
// API TYPES
// =============================================================================

export interface CreateCharacterRequest {
  editionId: ID;
  creationMethodId: ID;
  name?: string;
}

export interface UpdateCharacterRequest {
  character: Partial<Character>;
}

export interface CharacterResponse {
  success: boolean;
  character?: Character;
  error?: string;
}

export interface CharactersListResponse {
  success: boolean;
  characters: Character[];
  error?: string;
}

