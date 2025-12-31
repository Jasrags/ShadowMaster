/**
 * Character types
 *
 * Defines the structure for Shadowrun characters across all editions.
 * Characters are tied to a specific edition and creation method,
 * and store a reference to the ruleset snapshot used during creation.
 */

import type { ID, ISODateString, Metadata, MagicalPath } from "./core";
import type { EditionCode, FocusType, SpiritType } from "./edition";
import type { CharacterProgram } from "./programs";
import type { QualitySelection } from "./qualities";
import type { AuditEntry } from "./audit";
import type { CharacterCyberdeck, CharacterCommlink } from "./matrix";
import type {
  SyncStatus,
  LegalityStatus,
  RulesetVersionRef,
  MechanicalSnapshot,
  DeltaOverrides,
} from "./synchronization";
import type {
  GearState,
  WeaponAmmoState,
  MagazineItem,
  AmmunitionItem,
  EncumbranceState,
} from "./gear-state";
import type { WirelessEffect } from "./wireless-effects";

// =============================================================================
// CHARACTER CORE
// =============================================================================



/**
 * Status of a character
 */
export type CharacterStatus =
  | "draft" // Still being created
  | "active" // Playable character
  | "retired" // No longer in active play
  | "deceased"; // Character died in game

/**
 * Approval status for campaign characters (GM workflow)
 */
export type CharacterApprovalStatus =
  | "pending" // Awaiting GM review
  | "approved" // Approved by GM
  | "rejected" // Rejected by GM (with feedback)
  | "not-applicable"; // Not in a campaign or no approval required

/**
 * Selection of a quality during character creation/advancement
 *
 * @deprecated The `id` field is deprecated. Use `qualityId` instead.
 * This field is maintained for backward compatibility during migration.
 */

// =============================================================================
// ADVANCEMENT TYPES (defined early for use in Character interface)
// =============================================================================

/**
 * Type of advancement being made
 */
export type AdvancementType =
  | "attribute"
  | "skill"
  | "skillGroup"
  | "specialization"
  | "knowledgeSkill"
  | "languageSkill"
  | "spell"
  | "ritual"
  | "complexForm"
  | "focus"
  | "initiation"
  | "edge"
  | "quality";

/**
 * Status of a training period
 */
export type TrainingStatus = "pending" | "in-progress" | "completed" | "interrupted";

/**
 * Record of a single advancement made to a character
 * Immutable - these records are never modified, only new ones are created
 */
export interface AdvancementRecord {
  id: ID;
  type: AdvancementType;
  targetId: string; // Attribute code (e.g., "bod", "agi"), skill ID, etc.
  targetName: string; // Display name (e.g., "Body", "Pistols")
  previousValue?: number; // Previous rating/value before advancement
  newValue: number; // New rating/value after advancement
  karmaCost: number; // Karma spent for this advancement
  karmaSpentAt: ISODateString; // When karma was spent (immediately)
  trainingRequired: boolean; // Whether training time is required
  trainingStatus: TrainingStatus; // Current status of associated training
  trainingPeriodId?: ID; // Link to TrainingPeriod if applicable
  downtimePeriodId?: ID; // Link to campaign downtime event
  campaignSessionId?: ID; // Link to campaign session
  gmApproved: boolean; // Whether GM has approved (for campaign characters)
  gmApprovedBy?: ID; // GM user ID who approved
  gmApprovedAt?: ISODateString; // When GM approved
  rejectionReason?: string; // Reason for rejection (mandatory if rejected)
  notes?: string; // Optional notes about the advancement
  createdAt: ISODateString; // When advancement was initiated
  completedAt?: ISODateString; // When advancement was completed (training finished)
}

/**
 * Active training period tracking
 */
export interface TrainingPeriod {
  id: ID;
  advancementRecordId: ID; // Link to AdvancementRecord
  type: AdvancementType;
  targetId: string;
  targetName: string;
  requiredTime: number; // Required training time in days
  timeSpent: number; // Time spent in days (cumulative)
  startDate: ISODateString; // When training started
  expectedCompletionDate?: ISODateString; // Calculated completion date
  actualCompletionDate?: ISODateString; // When training actually completed
  status: TrainingStatus;
  downtimePeriodId?: ID; // Link to campaign downtime event
  instructorBonus?: boolean; // Whether 25% time reduction from instructor applies
  timeModifier?: number; // Percentage modifier (e.g., +50 for Dependents quality)
  interruptionDate?: ISODateString; // When training was interrupted
  interruptionReason?: string; // Reason for interruption
  createdAt: ISODateString;
}

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
   * @required - Must be set during character finalization
   */
  rulesetSnapshotId: ID;

  /**
   * Full version tracking for the ruleset this character is locked to.
   * Includes edition version and all book versions for precise drift detection.
   */
  rulesetVersion?: RulesetVersionRef;

  /** Books enabled when this character was created */
  attachedBookIds: ID[];

  // -------------------------------------------------------------------------
  // Synchronization State
  // -------------------------------------------------------------------------

  /**
   * Current synchronization status relative to the ruleset.
   * @default "synchronized" for newly created characters
   */
  syncStatus?: SyncStatus;

  /**
   * Rules compliance status for gameplay eligibility.
   * Invalid characters cannot participate in encounters.
   * @default "rules-legal" for newly created characters
   */
  legalityStatus?: LegalityStatus;

  /**
   * When drift was last evaluated against current ruleset.
   */
  lastSyncCheck?: ISODateString;

  /**
   * When the character was last synchronized to a new ruleset version.
   */
  lastSyncAt?: ISODateString;

  /**
   * Reference to pending DriftReport if migration is required.
   */
  pendingMigration?: ID;

  /**
   * Snapshot of mechanical rule values captured at creation.
   * Protected from ruleset changes until explicit synchronization.
   * @see ADR-004 (Hybrid Snapshot Model)
   */
  mechanicalSnapshot?: MechanicalSnapshot;

  /**
   * Character-specific data that persists across synchronizations.
   * Never affected by ruleset changes.
   */
  deltaOverrides?: DeltaOverrides;

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

  /** Approval status for campaign characters (GM workflow) */
  approvalStatus?: CharacterApprovalStatus;

  /** GM feedback when character is approved/rejected */
  approvalFeedback?: string;

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

  /**
   * Essence hole tracking for magic users who install/remove augmentations
   * Tracks permanent Magic/Resonance loss from augmentation history
   */
  essenceHole?: EssenceHole;

  // -------------------------------------------------------------------------
  // Skills
  // -------------------------------------------------------------------------

  /**
   * Skills keyed by skill ID
   * Value is the rating (1-6 at creation, can increase with karma)
   */
  skills: Record<string, number>;

  /**
   * Source tracking for skills (optional, for tracking free vs purchased skills)
   * Maps skill ID to source type
   */
  skillSources?: Record<string, SkillSource>;

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

  /** Positive quality IDs with ratings/specifications */
  positiveQualities: QualitySelection[];

  /** Negative quality IDs with ratings/specifications */
  negativeQualities: QualitySelection[];

  /** Racial qualities/traits from metatype (e.g., "Low-Light Vision", "Thermographic Vision") */
  racialQualities?: string[];

  /** Custom quality notes (for qualities with variable effects) */
  qualityNotes?: Record<string, string>;

  // -------------------------------------------------------------------------
  // Magic / Resonance
  // -------------------------------------------------------------------------

  magicalPath: MagicalPath;

  /** For mages: tradition (Hermetic, Shaman, etc.) */
  tradition?: string;

  /** For mages/adepts: mentor spirit ID */
  mentorSpirit?: string;

  /** For technomancers: stream */
  stream?: string;
  
  /** Initiation grade */
  initiateGrade?: number;

  /** Metamagics known (IDs) */
  metamagics?: string[];

  /** Spells known (spell IDs) */
  spells?: string[];

  /** Adept powers with ratings */
  adeptPowers?: AdeptPower[];

  /** Complex forms for technomancers */
  complexForms?: string[];

  /** Spirits/sprites bound or registered */
  spirits?: BoundSpirit[];

  /** Spells currently sustained by the character */
  sustainedSpells?: Array<{ spellId: string; hits: number; force: number }>;

  /** Foci currently bonded and active */
  activeFoci?: Array<{ id: string; type: string; rating: number }>;

  // -------------------------------------------------------------------------
  // Gear & Resources
  // -------------------------------------------------------------------------

  /** Starting and current nuyen */
  nuyen: number;
  startingNuyen: number;

  // -------------------------------------------------------------------------
  // Identities & Lifestyles
  // -------------------------------------------------------------------------

  /** Character identities (each with SIN and licenses) */
  identities?: Identity[];

  /** Primary lifestyle ID (reference to lifestyles array) */
  primaryLifestyleId?: ID;

  /** All lifestyles owned by character */
  lifestyles?: Lifestyle[];

  /** SINner quality type (if character has real SIN from SINner quality) */
  sinnerQuality?: SinnerQuality;

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

  /**
   * Global wireless bonus toggle
   * When enabled, all wireless bonuses from augmentations apply
   * When disabled, augmentations still function but without wireless bonuses
   * Default: true (enabled)
   */
  wirelessBonusesEnabled?: boolean;

  /** Vehicles owned */
  vehicles?: Vehicle[];

  /** Drones owned (separate from vehicles for riggers) */
  drones?: CharacterDrone[];

  /** Rigger Command Consoles owned */
  rccs?: CharacterRCC[];

  /** Autosofts owned (can be installed on drones or run from RCC) */
  autosofts?: CharacterAutosoft[];

  /** Matrix programs owned (for cyberdecks/commlinks) */
  programs?: CharacterProgram[];

  /** Cyberdecks owned */
  cyberdecks?: CharacterCyberdeck[];

  /** Commlinks owned */
  commlinks?: CharacterCommlink[];

  /** Active matrix device ID (reference to cyberdecks or commlinks) */
  activeMatrixDeviceId?: string;

  /** Magical foci owned */
  foci?: FocusItem[];

  // -------------------------------------------------------------------------
  // Ammunition & Encumbrance (ADR-010)
  // -------------------------------------------------------------------------

  /**
   * Ammunition inventory (boxes of ammo, not loaded in weapons).
   * Ammo is consumed when loading weapons.
   */
  ammunition?: AmmunitionItem[];

  /**
   * Calculated encumbrance state.
   * Updated when carried gear changes.
   */
  encumbrance?: EncumbranceState;

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
    /** Current Edge points available (defaults to edge attribute if undefined) */
    edgeCurrent?: number;
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

  /** Advancement history - immutable records of all advancements */
  advancementHistory?: AdvancementRecord[];

  /** Active training periods - training currently in progress */
  activeTraining?: TrainingPeriod[];

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
  /** UI Preferences */
  uiPreferences?: {
    theme?: string;
  };

  // -------------------------------------------------------------------------
  // Audit Trail
  // -------------------------------------------------------------------------

  /**
   * Immutable audit log of all state changes and significant actions.
   * Entries are append-only and never modified or deleted.
   */
  auditLog?: AuditEntry[];
}

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

/**
 * Source of skill points (for tracking free vs purchased skills)
 */
export type SkillSource = "free" | "priority" | "karma";

/**
 * Skill with source tracking
 */
export interface SkillWithSource {
  rating: number;
  source: SkillSource;
  freeRating?: number; // Free rating from priority (if applicable)
  purchasedRating?: number; // Rating purchased with skill points or karma
}

export interface KnowledgeSkill {
  name: string;
  category: "academic" | "interests" | "professional" | "street";
  rating: number;
}

export interface LanguageSkill {
  name: string;
  rating: number; // 0 = none, N = native
  isNative?: boolean;
}

export interface AdeptPower {
  id: string;
  catalogId: string;      // Reference to catalog power ID
  name: string;
  rating?: number;        // For leveled powers
  powerPointCost: number; // Actual PP spent
  specification?: string; // For skill/attribute-specific powers (e.g., "Agility" or "Pistols")
}

export interface BoundSpirit {
  type: SpiritType; // Spirit type
  force: number;
  services: number;
  bound: boolean;
}

// =============================================================================
// IDENTITY & LIFESTYLE TYPES
// =============================================================================

/**
 * Types of SINner quality for real SINs
 */
export enum SinnerQuality {
  National = "national",
  Criminal = "criminal",
  CorporateLimited = "corporate-limited",
  CorporateBorn = "corporate-born",
}

/**
 * SIN (System Identification Number) - can be fake or real
 */
export type SIN =
  | {
    type: "fake";
    rating: number; // 1-4 for fake SINs
  }
  | {
    type: "real";
    sinnerQuality: SinnerQuality; // References SINner quality level
  };

/**
 * License tied to a SIN (fake or real)
 */
export interface License {
  id?: ID;
  type: "fake" | "real";
  rating?: number; // 1-4 for fake licenses (must match SIN rating if fake)
  name: string; // License name/type (e.g., "Firearms License", "Driver's License")
  sinId?: ID; // Reference to the SIN this license is tied to
  notes?: string;
}

/**
 * Identity represents a character's persona with SIN and licenses
 */
export interface Identity {
  id?: ID;
  name: string; // Identity name (e.g., "John Smith", "Jane Doe")
  sin: SIN; // Exactly one SIN (fake or real)
  licenses: License[]; // 0+ licenses tied to this identity's SIN
  associatedLifestyleId?: ID; // Optional reference to a lifestyle
  notes?: string;
}

/**
 * Lifestyle modification (positive or negative cost modifier)
 */
export interface LifestyleModification {
  id?: ID;
  catalogId?: string; // Reference to ruleset modification ID
  name: string;
  type: "positive" | "negative";
  modifierType: "percentage" | "fixed";
  modifier: number; // Percentage (e.g., 20 for +20%) or fixed cost (e.g., 1000 for +1,000¥)
  effects?: string; // Optional game effects description
  notes?: string;
}

/**
 * Lifestyle subscription (e.g., DocWagon, food service)
 */
export interface LifestyleSubscription {
  id?: ID;
  catalogId?: string; // Reference to ruleset subscription ID
  name: string;
  monthlyCost: number;
  category?: string; // e.g., "medical", "security", "food", "entertainment"
  notes?: string;
}

/**
 * Lifestyle represents a character's living conditions
 */
export interface Lifestyle {
  id?: ID;
  type: string; // Lifestyle type ID (e.g., "street", "squatter", "low", "medium", "high", "luxury")
  monthlyCost: number;
  prepaidMonths?: number;
  location?: string;
  modifications?: LifestyleModification[]; // Lifestyle modifications (positive/negative) - includes "Permanent Lifestyle" modification
  subscriptions?: LifestyleSubscription[]; // Subscriptions (DocWagon, food service, etc.)
  customExpenses?: number; // Custom monthly expenses
  customIncome?: number; // Custom monthly income
  notes?: string;
}

/**
 * Installed modification on a gear item
 */
export interface InstalledGearMod {
  /** Reference to catalog modification ID */
  catalogId: string;
  name: string;
  /** Rating if the mod has one */
  rating?: number;
  /** Capacity slots used by this mod */
  capacityUsed: number;
  /** Actual cost paid for this mod */
  cost: number;
  /** Actual availability of this mod */
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
}

export interface GearItem {
  id?: ID;
  name: string;
  category: string;
  quantity: number;
  /** Total cost including mods */
  cost: number;
  availability?: number;
  rating?: number;
  /** Total capacity for modifications */
  capacity?: number;
  /** Capacity currently used by modifications */
  capacityUsed?: number;
  /** Installed modifications on this item */
  modifications?: InstalledGearMod[];
  notes?: string;
  metadata?: Metadata;
  /**
   * Weight in kilograms for encumbrance calculation.
   * Copied from catalog during acquisition.
   * @see ADR-010 Inventory State Management
   */
  weight?: number;
}

/**
 * Mount point types for weapon accessories
 */
export type WeaponMount = "top" | "under" | "side" | "barrel" | "stock" | "internal";

/**
 * Installed weapon modification on a character's weapon
 */
export interface InstalledWeaponMod {
  /** Reference to catalog modification ID */
  catalogId: string;
  name: string;
  /** Mount point used (if applicable) */
  mount?: WeaponMount;
  /** Rating if the mod has one */
  rating?: number;
  /** Actual cost paid for this mod */
  cost: number;
  /** Actual availability of this mod */
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  /** New: Flags built-in mods that cannot be removed */
  isBuiltIn?: boolean;
  /** Capacity/Slots used by this mod */
  capacityUsed: number;
}

/**
 * Installed armor modification on a character's armor
 */
export interface InstalledArmorMod {
  /** Reference to catalog modification ID */
  catalogId: string;
  name: string;
  /** Rating if the mod has one */
  rating?: number;
  /** Capacity slots used by this mod */
  capacityUsed: number;
  /** Actual cost paid for this mod */
  cost: number;
  /** Actual availability of this mod */
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
}

export interface Weapon extends GearItem {
  /** Reference to catalog weapon ID */
  catalogId?: string;
  damage: string; // e.g., "8P" for 8 physical
  ap: number; // Armor penetration
  mode: string[]; // "SS", "SA", "BF", "FA"
  recoil?: number;
  reach?: number; // For melee weapons
  accuracy?: number; // Base accuracy
  /** Required for compatibility check */
  subcategory: string;
  /** Installed modifications on this weapon */
  modifications?: InstalledWeaponMod[];
  /** Track which mounts are occupied */
  occupiedMounts?: WeaponMount[];

  // -------------------------------------------------------------------------
  // Inventory State (ADR-010)
  // -------------------------------------------------------------------------

  /**
   * Equipment state: readiness, wireless, condition
   * @see GearState
   */
  state?: GearState;

  /**
   * Current ammunition state for ranged weapons
   * Tracks loaded ammo type and round count
   */
  ammoState?: WeaponAmmoState;

  /**
   * Spare magazines carried for this weapon
   * Each magazine can hold different ammo types
   */
  spareMagazines?: MagazineItem[];

  // -------------------------------------------------------------------------
  // Legacy fields (deprecated, use ammoState instead)
  // -------------------------------------------------------------------------

  /**
   * @deprecated Use ammoState.loadedAmmoTypeId instead
   */
  ammoType?: string;

  /**
   * @deprecated Use ammoState.magazineCapacity instead
   */
  ammoCapacity?: number;

  /**
   * @deprecated Use ammoState.currentRounds instead
   */
  currentAmmo?: number;
}

export interface ArmorItem extends GearItem {
  /** Reference to catalog armor ID */
  catalogId?: string;
  armorRating: number;
  /**
   * True if this is an armor accessory (helmet, shield, etc.)
   * Accessories add to base armor instead of replacing it
   * Their bonus is capped at the character's Strength attribute
   */
  armorModifier?: boolean;
  /** Total capacity for modifications (equals armor rating) */
  capacity?: number;
  /** Capacity currently used by modifications */
  capacityUsed?: number;
  /** Installed modifications on this armor */
  modifications?: InstalledArmorMod[];

  // -------------------------------------------------------------------------
  // Inventory State (ADR-010)
  // -------------------------------------------------------------------------

  /**
   * Equipment state: readiness (worn/stored), wireless
   * @see GearState
   */
  state?: GearState;

  /**
   * @deprecated Use state.readiness === 'worn' instead
   * Kept for backward compatibility during migration
   */
  equipped: boolean;
}

// =============================================================================
// CYBERWARE & BIOWARE TYPES
// =============================================================================

/**
 * Cyberware grade affects essence cost and availability
 */
export type CyberwareGrade = "used" | "standard" | "alpha" | "beta" | "delta";

/**
 * Cyberware grade essence cost multipliers
 * used: +25%, standard: base, alpha: -20%, beta: -40%, delta: -50%
 */
export const CYBERWARE_GRADE_MULTIPLIERS: Record<CyberwareGrade, number> = {
  used: 1.25,
  standard: 1.0,
  alpha: 0.8,
  beta: 0.6,
  delta: 0.5,
};

/**
 * Cyberware grade availability modifiers
 */
export const CYBERWARE_GRADE_AVAILABILITY_MODIFIERS: Record<
  CyberwareGrade,
  number
> = {
  used: -4,
  standard: 0,
  alpha: 2,
  beta: 4,
  delta: 8,
};

/**
 * Cyberware grade cost multipliers
 */
export const CYBERWARE_GRADE_COST_MULTIPLIERS: Record<CyberwareGrade, number> =
{
  used: 0.75,
  standard: 1.0,
  alpha: 2.0,
  beta: 4.0,
  delta: 10.0,
};

/**
 * Categories of cyberware
 */
export type CyberwareCategory =
  | "headware"
  | "eyeware"
  | "earware"
  | "bodyware"
  | "cyberlimb"
  | "cyberlimb-enhancement"
  | "cyberlimb-accessory"
  | "hand-blade"
  | "hand-razor"
  | "spur"
  | "cybernetic-weapon"
  | "nanocyber";

/**
 * Categories of bioware
 */
export type BiowareCategory =
  | "basic"
  | "cultured"
  | "cosmetic"
  | "bio-weapons"
  | "chemical-gland"
  | "organ";

/**
 * Bioware grade (includes cultured as equivalent to alpha quality)
 */
export type BiowareGrade = "standard" | "alpha" | "beta" | "delta";

/**
 * Bioware grade essence cost multipliers (same as cyberware, minus used)
 */
export const BIOWARE_GRADE_MULTIPLIERS: Record<BiowareGrade, number> = {
  standard: 1.0,
  alpha: 0.8,
  beta: 0.6,
  delta: 0.5,
};

/**
 * Installed cyberware on a character
 */
export interface CyberwareItem {
  id?: ID;
  /** Reference to catalog item ID */
  catalogId: string;
  name: string;
  category: CyberwareCategory;
  grade: CyberwareGrade;
  /** Base essence cost before grade multiplier */
  baseEssenceCost: number;
  /** Actual essence cost after grade multiplier */
  essenceCost: number;
  rating?: number;
  /** For modular cyberware (e.g., cyberlimbs), total capacity */
  capacity?: number;
  /** Capacity used by installed enhancements */
  capacityUsed?: number;
  /** Cost in nuyen */
  cost: number;
  /** Availability rating */
  availability: number;
  /** Whether availability is Restricted (R) or Forbidden (F) */
  restricted?: boolean;
  forbidden?: boolean;
  /** Attribute bonuses provided by this cyberware */
  attributeBonuses?: Record<string, number>;
  /** Initiative dice bonuses */
  initiativeDiceBonus?: number;
  /** Other special effects/notes */
  notes?: string;
  /** Wireless bonus description (human-readable) */
  wirelessBonus?: string;
  /** Child items (for modular cyberware) */
  enhancements?: CyberwareItem[];

  // -------------------------------------------------------------------------
  // Inventory State (ADR-010)
  // -------------------------------------------------------------------------

  /**
   * Whether wireless is enabled for this augmentation.
   * When disabled, wirelessEffects do not apply.
   * @default true
   */
  wirelessEnabled?: boolean;

  /**
   * Structured wireless effects for mechanical calculation.
   * Copied from catalog during installation.
   * @see WirelessEffect
   */
  wirelessEffects?: WirelessEffect[];
}

/**
 * Installed bioware on a character
 */
export interface BiowareItem {
  id?: ID;
  /** Reference to catalog item ID */
  catalogId: string;
  name: string;
  category: BiowareCategory;
  grade: BiowareGrade;
  /** Base essence cost before grade multiplier */
  baseEssenceCost: number;
  /** Actual essence cost after grade multiplier */
  essenceCost: number;
  rating?: number;
  /** Bio-index cost (used for some calculations) */
  bioIndex?: number;
  /** Cost in nuyen */
  cost: number;
  /** Availability rating */
  availability: number;
  /** Whether availability is Restricted (R) or Forbidden (F) */
  restricted?: boolean;
  forbidden?: boolean;
  /** Attribute bonuses provided by this bioware */
  attributeBonuses?: Record<string, number>;
  /** Other special effects/notes */
  notes?: string;
}

/**
 * Essence hole tracking for magic users
 * When a magic user gets cyberware/bioware and their Magic is reduced,
 * then later removes the augmentation, the "hole" represents lost Magic
 * that cannot be recovered without special means.
 */
export interface EssenceHole {
  /** Total essence lost to augmentations at peak */
  peakEssenceLoss: number;
  /** Current essence loss from augmentations */
  currentEssenceLoss: number;
  /** Calculated essence hole (peak - current) */
  essenceHole: number;
  /** Magic/Resonance points permanently lost due to essence hole */
  magicLost: number;
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
// RIGGER EQUIPMENT TYPES (Character-owned)
// =============================================================================

/**
 * Drone owned by a character (simplified from catalog Drone)
 */
export interface CharacterDrone {
  id?: ID;
  /** Reference to catalog drone ID */
  catalogId: string;
  name: string;
  /** Custom name given by player */
  customName?: string;
  /** Drone size category */
  size: "micro" | "mini" | "small" | "medium" | "large" | "huge";
  /** Core attributes */
  handling: number;
  speed: number;
  acceleration: number;
  body: number;
  armor: number;
  pilot: number;
  sensor: number;
  /** Cost in nuyen */
  cost: number;
  /** Availability rating */
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  /** Installed autosofts */
  installedAutosofts?: string[];
  /** Notes */
  notes?: string;
}

/**
 * RCC (Rigger Command Console) owned by a character
 */
export interface CharacterRCC {
  id?: ID;
  /** Reference to catalog RCC ID */
  catalogId: string;
  name: string;
  /** Custom name given by player */
  customName?: string;
  /** Device rating (1-6) */
  deviceRating: number;
  /** Data processing attribute */
  dataProcessing: number;
  /** Firewall attribute */
  firewall: number;
  /** Cost in nuyen */
  cost: number;
  /** Availability rating */
  availability: number;
  restricted?: boolean;
  /** Currently running autosofts (shared to all slaved drones) */
  runningAutosofts?: string[];
  /** Notes */
  notes?: string;
}

/**
 * Autosoft owned by a character
 */
export interface CharacterAutosoft {
  id?: ID;
  /** Reference to catalog autosoft ID */
  catalogId: string;
  name: string;
  /** Autosoft category */
  category: "perception" | "defense" | "movement" | "combat" | "electronic-warfare" | "stealth";
  /** Purchased rating */
  rating: number;
  /** Target for Maneuvering/Targeting autosofts (e.g., weapon type or vehicle model) */
  target?: string;
  /** Cost in nuyen */
  cost: number;
  /** Availability rating */
  availability: number;
  /** Notes */
  notes?: string;
}

/**
 * Magical focus owned by a character
 */
export interface FocusItem {
  id?: ID;
  /** Reference to catalog focus ID */
  catalogId: string;
  name: string;
  type: FocusType;
  /** Force rating (1-6 for starting characters) */
  force: number;
  /** Whether the focus is bonded */
  bonded: boolean;
  /** Karma cost to bond this focus (Force × bonding multiplier) */
  karmaToBond: number;
  /** Cost in nuyen (Force × cost multiplier) */
  cost: number;
  /** Availability rating */
  availability: number;
  /** Whether availability is Restricted (R) or Forbidden (F) */
  restricted?: boolean;
  forbidden?: boolean;
  /** Notes */
  notes?: string;
}

// =============================================================================
// CHARACTER DRAFT (During Creation)
// =============================================================================

/**
 * Partial character used during the creation process.
 * Fields are optional until finalized.
 * Note: rulesetSnapshotId is optional during draft but required when finalized.
 */
export type CharacterDraft = Partial<Character> & {
  id: ID;
  ownerId: ID;
  editionId: ID;
  editionCode: EditionCode;
  creationMethodId: ID;
  status: "draft";
  createdAt: ISODateString;
  /** Optional during draft, required when character is finalized */
  rulesetSnapshotId?: ID;
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

/**
 * Contact Template Data
 */
export interface ContactTemplateData {
  id: string;
  name: string;
  description: string;
  suggestedConnection: number;
  suggestedLoyalty?: number;
  commonMetatypes?: string[];
}

