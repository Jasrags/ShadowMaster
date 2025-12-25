/**
 * NPC/Grunt types
 *
 * Defines the structure for NPC entities, specifically Grunts (simplified NPCs)
 * for combat encounters. Grunts use simplified mechanics compared to player
 * characters: single condition monitor, Group Edge pool, Professional Rating.
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 * @see /docs/specifications/npcs_grunts_specification.md
 */

import type { ID, ISODateString, Metadata, MagicalPath } from "./core";
import type { EditionCode } from "./edition";
import type {
  GearItem,
  Weapon,
  ArmorItem,
  CyberwareItem,
  BiowareItem,
  AdeptPower,
} from "./character";

// =============================================================================
// GRUNT CORE TYPES (Phase 1.1)
// =============================================================================

/**
 * Core attributes for grunts (same structure as character attributes)
 */
export interface GruntAttributes {
  body: number;
  agility: number;
  reaction: number;
  strength: number;
  willpower: number;
  logic: number;
  intuition: number;
  charisma: number;
}

/**
 * Base statistics shared by all grunts in a team
 *
 * @remarks
 * Capability Requirement: "NPC entities MUST be authoritatively defined with
 * attributes and skills strictly compliant with the active campaign ruleset."
 */
export interface GruntStats {
  /** Core attributes */
  attributes: GruntAttributes;

  /** Special attributes */
  essence: number;
  magic?: number; // If awakened
  resonance?: number; // If emerged

  /**
   * Active skills keyed by skill ID
   * e.g., { "firearms": 4, "unarmed": 3 }
   */
  skills: Record<string, number>;

  /** Knowledge skills (optional for grunts) */
  knowledgeSkills?: Record<string, number>;

  /** Qualities (by ID or name) */
  positiveQualities?: string[];
  negativeQualities?: string[];

  /** Equipment loadout */
  gear: GearItem[];
  weapons: Weapon[];
  armor: ArmorItem[];

  /** Augmentations (if any) */
  cyberware?: CyberwareItem[];
  bioware?: BiowareItem[];

  /** Magic/Resonance capabilities (if applicable) */
  magicalPath?: MagicalPath;
  spells?: string[];
  adeptPowers?: AdeptPower[];
  complexForms?: string[];

  /**
   * Condition monitor size
   * Calculated: 8 + ceil(max(Body, Willpower) / 2)
   * Grunts use a single combined condition monitor
   */
  conditionMonitorSize: number;
}

/**
 * Enhanced grunt with individual statistics (team leader)
 *
 * @remarks
 * Capability Requirement: "Leadership entities (e.g., Lieutenants) MUST be able
 * to apply verifiable bonuses to associated group entities."
 *
 * Lieutenant stats MUST total at least 4 higher than base grunts in both
 * attributes and active skills.
 */
export interface LieutenantStats extends GruntStats {
  /** Leadership skill rating (if present) */
  leadershipSkill?: number;

  /**
   * Can use Leadership to boost team Professional Rating by +1
   * Requires Leadership skill and successful test
   */
  canBoostProfessionalRating: boolean;

  /**
   * Makes own initiative test (doesn't use group initiative)
   * Lieutenants always roll individually for tactical advantage
   */
  usesIndividualInitiative: boolean;
}

/**
 * Specialist grunt with unique gear/abilities
 *
 * @remarks
 * Capability Requirement: "Grunt teams MUST support specialization (e.g., specialists,
 * heavy weapons) within the group structure without requiring full individual
 * entity modeling."
 *
 * Limit: 1-2 specialists per team
 */
export interface GruntSpecialist {
  id: ID;

  /** Type of specialist (e.g., "street-witch", "assault-rifle", "technomancer") */
  type: string;

  /** Description of specialization */
  description: string;

  /**
   * Modified stats from base grunt
   * Only differences from base stats need to be specified
   */
  statModifications?: {
    attributes?: Partial<GruntAttributes>;
    skills?: Record<string, number>;
    gear?: GearItem[];
    weapons?: Weapon[];
  };

  /**
   * Makes own initiative test (if augmented with wired reflexes, etc.)
   */
  usesIndividualInitiative?: boolean;
}

/**
 * Current state of a grunt team in combat
 */
export interface GruntTeamState {
  /** Number of active grunts remaining */
  activeCount: number;

  /** Number of grunts taken out (dead or incapacitated) */
  casualties: number;

  /** Current group initiative (if using group initiative) */
  groupInitiative?: number;

  /** Whether team has broken (morale failed) */
  moraleBroken: boolean;

  /** Current morale state for detailed tracking */
  moraleState?: MoraleState;
}

/**
 * Optional rule flags for grunt team behavior
 */
export interface GruntTeamOptions {
  /** Use group initiative (default: true) */
  useGroupInitiative?: boolean;

  /**
   * Use "mowing them down" simplified rules for faster combat
   * @see SimplifiedGruntsRules
   */
  useSimplifiedRules?: boolean;
}

/**
 * Visibility settings for grunt team (what players can see)
 *
 * @remarks
 * Capability Constraint: "Participant visibility into NPC capabilities MUST be
 * restricted according to campaign authority and active encounter scope."
 */
export interface GruntVisibility {
  /** Whether the team is visible to players at all */
  showToPlayers: boolean;

  /** Which stat categories are revealed to players (GM choice) */
  revealedStats?: Array<"attributes" | "skills" | "gear" | "qualities">;
}

/**
 * A team of grunts with shared statistics
 *
 * @remarks
 * This is the primary NPC type for combat encounters. Grunts share a common
 * statistical foundation while supporting individual casualty tracking.
 *
 * Capability Guarantee: "Grunt teams MUST operate within a simplified condition
 * and initiative model while maintaining precise casualty and state tracking."
 */
export interface GruntTeam {
  id: ID;

  /** Campaign this team belongs to */
  campaignId: ID;

  /** Optional encounter link (if assigned to specific encounter) */
  encounterId?: ID;

  /** Team metadata */
  name: string; // e.g., "Knight Errant Patrol", "Halloweeners Gang"
  description?: string;

  /**
   * Professional Rating (0-6)
   *
   * @remarks
   * Capability Requirement: "Professional Ratings (0-6) MUST govern the default
   * behavior, morale thresholds, and group quality of NPC teams."
   */
  professionalRating: ProfessionalRating;

  /**
   * Group Edge pool (equals Professional Rating)
   *
   * @remarks
   * Capability Requirement: "The system MUST manage a shared 'Group Edge' pool
   * for grunt teams, derived from their Professional Rating."
   */
  groupEdge: number;
  groupEdgeMax: number;

  /** Base grunt statistics (shared by all grunts in team) */
  baseGrunts: GruntStats;

  /** Initial team size (number of grunts at full strength) */
  initialSize: number;

  /** Optional lieutenant (enhanced team leader) */
  lieutenant?: LieutenantStats;

  /** Optional specialists (1-2 per team) */
  specialists?: GruntSpecialist[];

  /** Current team state */
  state: GruntTeamState;

  /** Optional rules flags */
  options?: GruntTeamOptions;

  /** Visibility settings */
  visibility?: GruntVisibility;

  createdAt: ISODateString;
  updatedAt?: ISODateString;

  /** Extensible metadata */
  metadata?: Metadata;
}

/**
 * Professional Rating tiers (0-6)
 *
 * @remarks
 * Professional Rating governs:
 * - Default attribute/skill ranges
 * - Morale thresholds
 * - Group Edge pool size
 * - Overall team quality/training
 */
export type ProfessionalRating = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// =============================================================================
// COMBAT TRACKING TYPES (Phase 1.2)
// =============================================================================

/**
 * Morale states for grunt teams
 *
 * @remarks
 * Capability Requirement: "Morale state (e.g., Broken, Persistent) MUST be
 * automatically evaluated based on casualty rates and leadership presence."
 */
export type MoraleState =
  | "steady" // Team is confident and fighting normally
  | "shaken" // Team is nervous, may break soon
  | "broken" // Team has broken, attempting to retreat
  | "routed"; // Team has completely routed, fleeing

/**
 * Individual grunt condition tracking for combat
 *
 * @remarks
 * Capability Requirement: "The system MUST provide an authoritative tracker for
 * NPC condition monitors, allowing for both Physical and Stun damage application."
 */
export interface IndividualGrunt {
  id: ID;

  /**
   * Condition monitor boxes (true = filled, false = empty)
   * Array length equals conditionMonitorSize from GruntStats
   */
  conditionMonitor: boolean[];

  /** Current total damage taken */
  currentDamage: number;

  /** Whether grunt is currently stunned (stun damage overflow to physical) */
  isStunned: boolean;

  /** Whether grunt is dead/incapacitated */
  isDead: boolean;

  /** Type of last damage received (for stun overflow calculation) */
  lastDamageType?: "physical" | "stun";

  /** Individual initiative (if using individual initiative or has injury modifiers) */
  initiative?: number;
}

/**
 * Runtime combat tracking for all individuals in a grunt team
 *
 * @remarks
 * This structure tracks individual grunt conditions during combat.
 * It's separate from the GruntTeam to allow for efficient updates
 * during combat without modifying the base team configuration.
 */
export interface IndividualGrunts {
  /** Map of grunt IDs to their individual condition */
  grunts: Record<ID, IndividualGrunt>;

  /** Lieutenant condition (if team has a lieutenant) */
  lieutenant?: IndividualGrunt;

  /** Specialist conditions (if team has specialists) */
  specialists?: Record<ID, IndividualGrunt>;
}

/**
 * Simplified combat rules for faster encounters
 *
 * @remarks
 * Capability Requirement: "The system MUST facilitate the implementation of
 * 'simplified rules' (e.g., one-hit-kill, unopposed rolls) for rapid
 * encounter resolution."
 */
export interface SimplifiedGruntsRules {
  /** Single wound takes grunt down (no condition monitor tracking) */
  oneHitKill: boolean;

  /** All rolls against grunts are unopposed (grunts don't roll defense) */
  unopposedRolls: boolean;

  /** Grunts don't dodge ranged attacks */
  noDodge: boolean;

  /** Any hits on Sneaking = automatic surprise */
  autoSurprise: boolean;

  /** Grunt ambushes automatically fail against PCs */
  ambushFails: boolean;
}

/**
 * Damage types for application to grunts
 */
export type DamageType = "physical" | "stun";

/**
 * Result of applying damage to a grunt
 */
export interface DamageResult {
  gruntId: ID;
  previousDamage: number;
  newDamage: number;
  damageApplied: number;
  isStunned: boolean;
  isDead: boolean;
  conditionMonitor: boolean[];
}

// =============================================================================
// TEMPLATE TYPES (Phase 1.3)
// =============================================================================

/**
 * Morale tier configuration for Professional Rating
 *
 * @remarks
 * Each Professional Rating tier has different morale thresholds
 * and rally capabilities.
 */
export interface MoraleTier {
  /** Casualty percentage that triggers morale break (0-100) */
  breakThreshold: number;

  /** Edge cost to attempt rally (0 = cannot rally) */
  rallyCost: number;

  /** Whether this tier can rally after breaking */
  canRally: boolean;
}

/**
 * Pre-built grunt team template for quick encounter setup
 *
 * @remarks
 * Templates are stored per-edition and provide default configurations
 * for each Professional Rating tier.
 */
export interface GruntTemplate {
  id: ID;

  /** Edition this template belongs to */
  editionCode: EditionCode;

  /** Professional Rating this template represents */
  professionalRating: ProfessionalRating;

  /** Template name (e.g., "Street Thugs", "Corporate Security") */
  name: string;

  /** Template description */
  description: string;

  /** Category for organization */
  category?: GruntTemplateCategory;

  /** Base grunt statistics for this template */
  baseGrunts: GruntStats;

  /** Default team options */
  defaultOptions?: GruntTeamOptions;

  /** Morale configuration for this tier */
  moraleTier: MoraleTier;

  /** Suggested team sizes */
  suggestedSizes?: {
    small: number; // e.g., 3-4
    medium: number; // e.g., 6-8
    large: number; // e.g., 10-12
  };

  /** Source reference (book, page) */
  source?: string;
}

/**
 * Categories for organizing grunt templates
 */
export type GruntTemplateCategory =
  | "gang" // Street gangs, go-gangs
  | "corporate" // Corporate security, executives
  | "military" // Military units, PMCs
  | "law-enforcement" // Police, SWAT, federal
  | "criminal" // Organized crime, syndicates
  | "magical" // Awakened groups, cults
  | "matrix" // Deckers, technomancers
  | "civilian" // Civilians, bystanders
  | "other"; // Miscellaneous

/**
 * Professional Rating tier descriptions
 */
export const PROFESSIONAL_RATING_DESCRIPTIONS: Record<ProfessionalRating, string> = {
  0: "Untrained - Street thugs, desperate civilians, no combat training",
  1: "Green - New gang members, mall security, minimal training",
  2: "Regular - Gang veterans, private security, basic training",
  3: "Seasoned - Experienced mercs, corp security, professional training",
  4: "Veteran - HTR teams, special forces, extensive training",
  5: "Elite - Red Samurai, Tir Ghost, exceptional training",
  6: "Prime - Dragon guard, immortal elf special ops, legendary",
};

/**
 * Default morale tiers by Professional Rating
 */
export const DEFAULT_MORALE_TIERS: Record<ProfessionalRating, MoraleTier> = {
  0: { breakThreshold: 25, rallyCost: 0, canRally: false },
  1: { breakThreshold: 33, rallyCost: 0, canRally: false },
  2: { breakThreshold: 40, rallyCost: 2, canRally: true },
  3: { breakThreshold: 50, rallyCost: 2, canRally: true },
  4: { breakThreshold: 60, rallyCost: 1, canRally: true },
  5: { breakThreshold: 75, rallyCost: 1, canRally: true },
  6: { breakThreshold: 90, rallyCost: 1, canRally: true },
};

// =============================================================================
// API TYPES
// =============================================================================

/**
 * Request to create a new grunt team
 */
export interface CreateGruntTeamRequest {
  name: string;
  description?: string;
  professionalRating: ProfessionalRating;
  baseGrunts: GruntStats;
  initialSize: number;
  lieutenant?: LieutenantStats;
  specialists?: Omit<GruntSpecialist, "id">[];
  encounterId?: ID;
  options?: GruntTeamOptions;
  visibility?: GruntVisibility;
  /** Optional: use template ID to populate baseGrunts */
  templateId?: ID;
}

/**
 * Request to update a grunt team
 */
export interface UpdateGruntTeamRequest {
  name?: string;
  description?: string;
  professionalRating?: ProfessionalRating;
  baseGrunts?: Partial<GruntStats>;
  initialSize?: number;
  lieutenant?: LieutenantStats | null;
  specialists?: GruntSpecialist[];
  encounterId?: ID | null;
  options?: GruntTeamOptions;
  visibility?: GruntVisibility;
}

/**
 * Request to apply damage to a grunt
 */
export interface ApplyDamageRequest {
  damage: number;
  damageType: DamageType;
}

/**
 * Request to apply damage to multiple grunts
 */
export interface BulkDamageRequest {
  gruntIds: ID[];
  damage: number;
  damageType: DamageType;
}

/**
 * Request to spend Group Edge
 */
export interface SpendEdgeRequest {
  amount: number;
  /** Optional: which grunt benefits from the Edge use */
  targetGruntId?: ID;
}

/**
 * Request to roll initiative
 */
export interface RollInitiativeRequest {
  type: "group" | "individual";
  /** Optional base modifier */
  baseModifier?: number;
}

/**
 * Response for grunt team operations
 */
export interface GruntTeamResponse {
  success: boolean;
  team?: GruntTeam;
  error?: string;
}

/**
 * Response for grunt team list operations
 */
export interface GruntTeamsListResponse {
  success: boolean;
  teams: GruntTeam[];
  error?: string;
}

/**
 * Response for grunt team with combat tracking
 */
export interface GruntTeamDetailResponse {
  success: boolean;
  team?: GruntTeam;
  individualGrunts?: IndividualGrunts;
  error?: string;
}

/**
 * Response for damage operations
 */
export interface DamageResponse {
  success: boolean;
  result?: DamageResult;
  teamState?: GruntTeamState;
  error?: string;
}

/**
 * Response for bulk damage operations
 */
export interface BulkDamageResponse {
  success: boolean;
  results?: DamageResult[];
  teamState?: GruntTeamState;
  error?: string;
}

/**
 * Response for initiative operations
 */
export interface InitiativeResponse {
  success: boolean;
  groupInitiative?: number;
  individualInitiatives?: Record<ID, number>;
  error?: string;
}

/**
 * Response for template operations
 */
export interface GruntTemplatesResponse {
  success: boolean;
  templates: GruntTemplate[];
  error?: string;
}

// =============================================================================
// CAMPAIGN ACTIVITY TYPES (for integration)
// =============================================================================

/**
 * Activity event types specific to grunt teams
 * These will be added to CampaignActivityType in campaign.ts
 */
export type GruntActivityType =
  | "grunt_team_created"
  | "grunt_team_updated"
  | "grunt_team_deleted"
  | "grunt_casualties"
  | "grunt_morale_break"
  | "grunt_morale_rally";
