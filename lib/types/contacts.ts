/**
 * Contact and Social Governance types
 *
 * Defines the structure for contact networks, favor tracking, and social capital
 * management. Implements the Social Governance capability guarantees.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import type { ID, ISODateString, Metadata } from "./core";
import type { EditionCode } from "./edition";
import type { RelationshipQuality, ChipCostAdjustment } from "../rules/relationship-qualities";

// =============================================================================
// CONTACT CORE TYPES
// =============================================================================

/**
 * Status of a contact relationship
 */
export type ContactStatus =
  | "active" // Normal, functional relationship
  | "burned" // Relationship destroyed, contact won't help
  | "inactive" // Dormant relationship (e.g., contact moved away)
  | "missing" // Contact cannot be located
  | "deceased"; // Contact is dead

/**
 * Contact ownership/scope group
 */
export type ContactGroup =
  | "personal" // Owned by a specific character
  | "shared" // Shared between specific characters
  | "campaign" // Available to all campaign participants
  | "organization"; // Belongs to an organization/faction

/**
 * Visibility settings for contact information
 */
export interface ContactVisibility {
  /** Whether players can see this contact exists */
  playerVisible: boolean;
  /** Whether to show connection rating to players */
  showConnection: boolean;
  /** Whether to show loyalty rating to players */
  showLoyalty: boolean;
  /** Whether to show favor balance to players */
  showFavorBalance: boolean;
  /** Whether to show specializations to players */
  showSpecializations: boolean;
}

/**
 * Default visibility for player-owned contacts
 */
export const DEFAULT_CONTACT_VISIBILITY: ContactVisibility = {
  playerVisible: true,
  showConnection: true,
  showLoyalty: true,
  showFavorBalance: true,
  showSpecializations: true,
};

/**
 * Default visibility for GM-created contacts
 */
export const GM_CONTACT_VISIBILITY: ContactVisibility = {
  playerVisible: false,
  showConnection: false,
  showLoyalty: false,
  showFavorBalance: false,
  showSpecializations: false,
};

/**
 * A social contact in a character's network
 *
 * Enhanced version of the basic Contact type with full
 * Social Governance capability support.
 */
export interface SocialContact {
  id: ID;

  /** Owner character ID (null for campaign/shared contacts) */
  characterId?: ID;

  /** Campaign scope (null for personal contacts outside campaigns) */
  campaignId?: ID;

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /** Contact's name */
  name: string;

  /** Known aliases */
  aliases?: string[];

  /** Contact's metatype */
  metatype?: string;

  /** Physical/personality description */
  description?: string;

  /** Portrait/image URL */
  imageUrl?: string;

  // ---------------------------------------------------------------------------
  // Core Attributes (SR5: Connection 1-12, Loyalty 1-6)
  // ---------------------------------------------------------------------------

  /**
   * Connection rating (1-12 in SR5)
   * Represents influence, resources, and reach
   */
  connection: number;

  /**
   * Loyalty rating (1-6 in SR5)
   * Represents dedication to the character
   */
  loyalty: number;

  // ---------------------------------------------------------------------------
  // Classification
  // ---------------------------------------------------------------------------

  /** Contact archetype (e.g., "Fixer", "Street Doc", "Mr. Johnson") */
  archetype: string;

  /** Reference to catalog archetype ID */
  archetypeId?: string;

  /** Areas of expertise/services offered */
  specializations?: string[];

  /** Primary location (freeform text) */
  location?: string;

  /** Reference to campaign location ID */
  locationId?: ID;

  /** Affiliated organization name */
  organization?: string;

  /** Reference to organization/faction ID */
  organizationId?: ID;

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  /** Current relationship status */
  status: ContactStatus;

  /** Reason the contact was burned (if status is "burned") */
  burnedReason?: string;

  /** When the contact was burned */
  burnedAt?: ISODateString;

  /** When the contact went missing (if status is "missing") */
  missingAt?: ISODateString;

  /** When the contact died (if status is "deceased") */
  deceasedAt?: ISODateString;

  // ---------------------------------------------------------------------------
  // Favor Balance
  // ---------------------------------------------------------------------------

  /**
   * Current favor balance
   * Positive = contact owes character favors
   * Negative = character owes contact favors
   */
  favorBalance: number;

  // ---------------------------------------------------------------------------
  // Access Control
  // ---------------------------------------------------------------------------

  /** Ownership/scope group */
  group: ContactGroup;

  /** Visibility settings */
  visibility: ContactVisibility;

  /** Character IDs this contact is shared with (for group === "shared") */
  sharedWithCharacterIds?: ID[];

  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------

  /** Player-visible notes */
  notes?: string;

  /** GM-only notes (hidden from players) */
  gmNotes?: string;

  /** Last time this contact was used/contacted */
  lastContactedAt?: ISODateString;

  /** How the contact was acquired */
  acquisitionMethod?: "creation" | "networking" | "introduction" | "event" | "karma" | "edge";

  /** Session ID when contact was acquired (if in campaign) */
  acquisitionSessionId?: ID;

  // ---------------------------------------------------------------------------
  // Run Faster Extensions (pp. 177-178)
  // ---------------------------------------------------------------------------

  /** Relationship qualities (Run Faster pp. 177-178) */
  relationshipQualities?: RelationshipQuality[];

  /** Whether loyalty improvement is permanently blocked (via Intimidation) */
  loyaltyImprovementBlocked?: boolean;

  /** Whether this contact is pending Karma confirmation (I Know a Guy) */
  pendingKarmaConfirmation?: boolean;

  createdAt: ISODateString;
  updatedAt?: ISODateString;

  /** Extensible metadata */
  metadata?: Metadata;
}

/**
 * High-level service type taxonomy (Run Faster p. 176)
 */
export type ContactServiceType =
  | "swag"
  | "legwork"
  | "support"
  | "shadow-service"
  | "networking"
  | "personal-favor";

/**
 * Preferred payment method (Run Faster p. 180-181)
 */
export type ContactPreferredPayment =
  | "cash-credstick"
  | "cash-corporate-scrip"
  | "cash-hard-currency"
  | "service-shadowrun-job"
  | "service-drek-jobs"
  | "service-free-labor"
  | "barter-hobby-vice"
  | "barter-easy-to-sell"
  | "barter-profession-items"
  | "barter-illegal-items";

/**
 * Contact archetype definition from ruleset
 */
export interface ContactArchetype {
  id: string;

  /** Archetype name */
  name: string;

  /** Description of what this type of contact does */
  description: string;

  /** Suggested connection range [min, max] */
  suggestedConnection: [number, number];

  /** Suggested loyalty range [min, max] */
  suggestedLoyalty: [number, number];

  /** High-level service type taxonomy from Run Faster */
  serviceType?: ContactServiceType;

  /** Preferred payment method from Run Faster */
  preferredPayment?: ContactPreferredPayment;

  /** Common services this archetype can provide */
  commonServices: string[];

  /** Typical risk profile for dealing with this contact */
  riskProfile: "low" | "medium" | "high";

  /** Typical costs for services (service type -> base nuyen cost) */
  typicalCosts: Record<string, number>;

  /** Common locations to find this archetype */
  commonLocations?: string[];

  /** Typical organizations this archetype is associated with */
  commonOrganizations?: string[];
}

// =============================================================================
// FAVOR LEDGER TYPES
// =============================================================================

/**
 * Types of favor transactions
 */
export type FavorTransactionType =
  | "favor_called" // Character called in a favor from contact
  | "favor_failed" // Character attempted to call favor but failed
  | "favor_granted" // Contact performed a service for character
  | "favor_owed" // Contact did something that created debt for character
  | "favor_repaid" // Character repaid a favor to contact
  | "loyalty_change" // Loyalty rating increased or decreased
  | "connection_change" // Connection rating increased or decreased
  | "contact_burned" // Contact relationship was destroyed
  | "contact_acquired" // New contact was added
  | "contact_reactivated" // Burned/inactive contact was restored
  | "status_change" // Contact status changed (missing, deceased, etc.)
  | "gift" // Gift given to contact (nuyen/items)
  | "betrayal" // Contact betrayed character or vice versa
  | "reputation_effect" // Street cred/notoriety affected relationship
  | "chip_spent_dice_bonus" // Chips spent for negotiation dice bonus
  | "chip_spent_loyalty"; // Chips spent to improve loyalty

/**
 * Risk level for a favor or service
 */
export type FavorRiskLevel =
  | "trivial" // No real risk to contact
  | "low" // Minor inconvenience
  | "medium" // Noticeable risk or effort
  | "high" // Significant danger or resources
  | "extreme"; // Life-threatening or career-ending

/**
 * A single transaction in the favor ledger
 */
export interface FavorTransaction {
  id: ID;

  /** Character who owns this transaction */
  characterId: ID;

  /** Contact involved in this transaction */
  contactId: ID;

  /** Campaign context (if any) */
  campaignId?: ID;

  /** Session when this occurred (if in campaign) */
  sessionId?: ID;

  /** Type of transaction */
  type: FavorTransactionType;

  // ---------------------------------------------------------------------------
  // Transaction Details
  // ---------------------------------------------------------------------------

  /** Human-readable description of what happened */
  description: string;

  /** Change to favor balance (+/- favor points) */
  favorChange: number;

  /** Change to loyalty rating (if any) */
  loyaltyChange?: number;

  /** Previous loyalty value (for audit) */
  previousLoyalty?: number;

  /** Change to connection rating (if any) */
  connectionChange?: number;

  /** Previous connection value (for audit) */
  previousConnection?: number;

  // ---------------------------------------------------------------------------
  // Resource Costs
  // ---------------------------------------------------------------------------

  /** Nuyen spent in this transaction */
  nuyenSpent?: number;

  /** Karma spent in this transaction */
  karmaSpent?: number;

  // ---------------------------------------------------------------------------
  // Service Details (for favor calls)
  // ---------------------------------------------------------------------------

  /** Type of service requested */
  serviceType?: string;

  /** Service ID from favor cost table */
  serviceId?: string;

  /** Risk level of the service */
  serviceRisk?: FavorRiskLevel;

  /** Threshold required for success (if applicable) */
  thresholdRequired?: number;

  /** Dice roll result (if applicable) */
  rollResult?: number;

  /** Net hits achieved */
  netHits?: number;

  /** Whether the action succeeded */
  success?: boolean;

  // ---------------------------------------------------------------------------
  // Approval Workflow
  // ---------------------------------------------------------------------------

  /** Whether this transaction requires GM approval */
  requiresGmApproval: boolean;

  /** Whether GM has approved (null = pending) */
  gmApproved?: boolean;

  /** GM user ID who approved/rejected */
  gmApprovedBy?: ID;

  /** When GM approved/rejected */
  gmApprovedAt?: ISODateString;

  /** Reason for rejection (if rejected) */
  rejectionReason?: string;

  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------

  /** When this transaction occurred */
  timestamp: ISODateString;

  /** Extensible metadata */
  metadata?: Metadata;
}

/**
 * Complete favor ledger for a character
 */
export interface FavorLedger {
  /** Character who owns this ledger */
  characterId: ID;

  /** All transactions (append-only) */
  transactions: FavorTransaction[];

  // ---------------------------------------------------------------------------
  // Aggregate Statistics (calculated)
  // ---------------------------------------------------------------------------

  /** Total favors called by character */
  totalFavorsCalled: number;

  /** Total favors owed by character */
  totalFavorsOwed: number;

  /** Total nuyen spent on social interactions */
  totalNuyenSpent: number;

  /** Total karma spent on social interactions */
  totalKarmaSpent: number;

  /** Number of burned contacts */
  burnedContactsCount: number;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// =============================================================================
// SOCIAL CAPITAL TYPES
// =============================================================================

/**
 * Social capital budget and metrics for a character
 */
export interface SocialCapital {
  /** Character who owns this social capital */
  characterId: ID;

  // ---------------------------------------------------------------------------
  // Budget Constraints
  // ---------------------------------------------------------------------------

  /**
   * Maximum contact points available
   * (sum of Connection + Loyalty for all contacts)
   */
  maxContactPoints: number;

  /** Currently used contact points */
  usedContactPoints: number;

  /** Available contact points */
  availableContactPoints: number;

  // ---------------------------------------------------------------------------
  // Contact Counts
  // ---------------------------------------------------------------------------

  /** Total number of contacts */
  totalContacts: number;

  /** Number of active contacts */
  activeContacts: number;

  /** Number of burned contacts */
  burnedContacts: number;

  /** Number of inactive/missing contacts */
  inactiveContacts: number;

  // ---------------------------------------------------------------------------
  // Influence Metrics (from qualities/augmentations)
  // ---------------------------------------------------------------------------

  /** Bonus to networking rolls (from qualities like "First Impression") */
  networkingBonus: number;

  /** Modifier to Social limit (from qualities or augmentations) */
  socialLimitModifier: number;

  /** Bonus to maintaining loyalty (from qualities like "Trustworthy") */
  loyaltyBonus: number;

  // ---------------------------------------------------------------------------
  // Campaign Constraints
  // ---------------------------------------------------------------------------

  /** GM-set limit on total contacts (null = no limit) */
  campaignContactLimit?: number;

  /** GM-set limit on max connection rating */
  campaignMaxConnection?: number;

  /** GM-set limit on max loyalty rating */
  campaignMaxLoyalty?: number;

  updatedAt: ISODateString;
}

/**
 * Types of social actions that can be resolved
 */
export type SocialActionType =
  | "networking" // Finding new contacts
  | "favor_call" // Calling in a favor
  | "bribe" // Direct payment for service
  | "legwork" // Information gathering via contacts
  | "introduction" // Getting introduced to someone new
  | "reputation_boost" // Improving standing with contact
  | "damage_control" // Recovering from social misstep
  | "loyalty_increase" // Spending karma to improve loyalty
  | "connection_boost"; // Improving contact's connection (rare)

/**
 * A modifier to a social dice pool
 */
export interface SocialModifier {
  /** Source of the modifier */
  source: string;

  /** Dice pool modifier value (+/-) */
  modifier: number;

  /** Optional detailed description */
  description?: string;

  /** Category of modifier for stacking rules */
  category?: "attitude" | "circumstance" | "quality" | "augmentation" | "magic" | "other";
}

/**
 * A resolved social action
 */
export interface SocialAction {
  id: ID;

  /** Type of action performed */
  type: SocialActionType;

  /** Character who performed the action */
  characterId: ID;

  /** Target contact (if applicable) */
  targetContactId?: ID;

  /** Campaign context */
  campaignId?: ID;

  /** Session context */
  sessionId?: ID;

  // ---------------------------------------------------------------------------
  // Roll Information
  // ---------------------------------------------------------------------------

  /** Calculated dice pool */
  dicePool: number;

  /** Required threshold (if threshold test) */
  threshold?: number;

  /** Opposing dice pool (if opposed test) */
  opposingPool?: number;

  /** All modifiers applied */
  modifiers: SocialModifier[];

  /** Dice roll result */
  rollResult?: number;

  /** Opposing roll result (if opposed) */
  opposingResult?: number;

  /** Net hits achieved */
  netHits?: number;

  /** Whether the action succeeded */
  success?: boolean;

  // ---------------------------------------------------------------------------
  // Costs and Outcomes
  // ---------------------------------------------------------------------------

  /** Nuyen spent */
  nuyenCost?: number;

  /** Karma spent */
  karmaCost?: number;

  /** Time required (e.g., "1 hour", "1 day") */
  timeRequired?: string;

  /** Resulting loyalty change */
  loyaltyChange?: number;

  /** Resulting connection change */
  connectionChange?: number;

  /** Resulting favor balance change */
  favorChange?: number;

  /** New contact created (for networking) */
  newContactId?: ID;

  /** Whether contact was burned as a result */
  contactBurned?: boolean;

  timestamp: ISODateString;
}

// =============================================================================
// FAVOR COST TABLE TYPES
// =============================================================================

/**
 * Edition-specific favor cost table
 */
export interface FavorCostTable {
  /** Edition code this table applies to */
  editionCode: EditionCode;

  /** All defined services */
  services: FavorServiceDefinition[];
}

/**
 * Definition of a favor/service that can be requested
 */
export interface FavorServiceDefinition {
  id: string;

  /** Service name */
  name: string;

  /** Description of what the service entails */
  description: string;

  /** Which archetypes can provide this service */
  archetypeIds?: string[];

  // ---------------------------------------------------------------------------
  // Requirements
  // ---------------------------------------------------------------------------

  /** Minimum connection rating required */
  minimumConnection: number;

  /** Minimum loyalty rating required */
  minimumLoyalty: number;

  // ---------------------------------------------------------------------------
  // Costs
  // ---------------------------------------------------------------------------

  /**
   * Favor points consumed
   * Negative values add to character's debt
   */
  favorCost: number;

  /**
   * Nuyen cost
   * Can be a fixed number or a formula string (e.g., "connection * 100")
   */
  nuyenCost?: number | string;

  /** Karma cost (rare, for exceptional services) */
  karmaCost?: number;

  // ---------------------------------------------------------------------------
  // Risk
  // ---------------------------------------------------------------------------

  /** Risk level for the contact */
  riskLevel: FavorRiskLevel;

  /** Whether failure can burn the contact */
  burnRiskOnFailure: boolean;

  /** Threshold for burning on failure (glitches below this burn) */
  burnThreshold?: number;

  // ---------------------------------------------------------------------------
  // Resolution
  // ---------------------------------------------------------------------------

  /** Whether this is an opposed test */
  opposedTest: boolean;

  /** Threshold for success (if not opposed) */
  threshold?: number;

  /** Skill used for the test */
  testSkill?: string;

  /** Attribute used for the test */
  testAttribute?: string;

  // ---------------------------------------------------------------------------
  // Timing
  // ---------------------------------------------------------------------------

  /** Typical time to complete */
  typicalTime: string;

  /** Rush job possible? */
  canRush: boolean;

  /** Rush job cost multiplier */
  rushCostMultiplier?: number;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Request to create a new contact
 */
export interface CreateContactRequest {
  name: string;
  connection: number;
  loyalty: number;
  archetype: string;
  archetypeId?: string;
  description?: string;
  specializations?: string[];
  location?: string;
  locationId?: ID;
  organization?: string;
  metatype?: string;
  notes?: string;
  group?: ContactGroup;
  visibility?: Partial<ContactVisibility>;
  /** Initial favor balance (default: 0) */
  favorBalance?: number;
}

/**
 * Request to update an existing contact
 */
export interface UpdateContactRequest {
  name?: string;
  description?: string;
  specializations?: string[];
  location?: string;
  locationId?: ID;
  organization?: string;
  organizationId?: ID;
  metatype?: string;
  imageUrl?: string;
  notes?: string;
  gmNotes?: string;
  visibility?: Partial<ContactVisibility>;
  // Additional fields for state updates
  connection?: number;
  loyalty?: number;
  status?: ContactStatus;
  favorBalance?: number;
  lastContactedAt?: ISODateString;
  // Run Faster extensions (pp. 177-178)
  relationshipQualities?: RelationshipQuality[];
  loyaltyImprovementBlocked?: boolean;
  pendingKarmaConfirmation?: boolean;
  acquisitionMethod?: SocialContact["acquisitionMethod"];
}

/**
 * Request to change contact state
 */
export interface ContactStateChangeRequest {
  action: "burn" | "reactivate" | "mark-missing" | "mark-deceased" | "mark-inactive";
  reason?: string;
}

/**
 * Request to call a favor
 */
/**
 * Request to acquire a contact via "I Know a Guy" (Edge spend)
 */
export interface EdgeAcquireRequest {
  /** Desired Connection rating (1-12) */
  connection: number;
  /** Contact archetype */
  archetype: string;
  /** Contact name */
  name: string;
  /** Optional description */
  description?: string;
}

/**
 * Response from Edge contact acquisition
 */
export interface EdgeAcquireResponse {
  success: boolean;
  contact?: SocialContact;
  edgeSpent?: number;
  edgeRemaining?: number;
  karmaCostToConfirm?: number;
  error?: string;
}

/**
 * Response from confirming an Edge contact with Karma
 */
export interface ConfirmEdgeResponse {
  success: boolean;
  contact?: SocialContact;
  karmaSpent?: number;
  karmaRemaining?: number;
  error?: string;
}

/**
 * Response from expiring unconfirmed Edge contacts
 */
export interface ExpireEdgeResponse {
  success: boolean;
  expiredCount?: number;
  expiredContactIds?: string[];
  error?: string;
}

export interface CallFavorRequest {
  serviceId: string;
  serviceType?: string;
  nuyenOffered?: number;
  diceRoll?: number;
  rushJob?: boolean;
  notes?: string;
}

/**
 * Request to add a favor transaction
 */
export interface CreateFavorTransactionRequest {
  contactId: ID;
  type: FavorTransactionType;
  description: string;
  favorChange: number;
  loyaltyChange?: number;
  connectionChange?: number;
  nuyenSpent?: number;
  karmaSpent?: number;
  serviceType?: string;
  sessionId?: ID;
}

/**
 * Request to perform a networking action
 */
export interface NetworkingActionRequest {
  targetArchetype: string;
  location?: string;
  nuyenBudget?: number;
  diceRoll: number;
}

/**
 * Response for contact operations
 */
export interface ContactResponse {
  success: boolean;
  contact?: SocialContact;
  error?: string;
}

/**
 * Response for contacts list
 */
export interface ContactsListResponse {
  success: boolean;
  contacts: SocialContact[];
  socialCapital?: SocialCapital;
  error?: string;
}

/**
 * Response for favor ledger
 */
export interface FavorLedgerResponse {
  success: boolean;
  ledger?: FavorLedger;
  transactions?: FavorTransaction[];
  error?: string;
}

/**
 * Response for social capital
 */
export interface SocialCapitalResponse {
  success: boolean;
  socialCapital?: SocialCapital;
  error?: string;
}

/**
 * Breakdown of how chip cost was calculated for a favor
 */
export interface ChipCostBreakdown {
  /** Original favor cost from service definition */
  originalFavorCost: number;
  /** +1 surcharge for using contact outside their archetype */
  secondarySurcharge: number;
  /** Adjustment from relationship qualities (blackmail=free, family=-1) */
  qualityAdjustment: ChipCostAdjustment;
  /** Final chip cost after all adjustments */
  finalChipCost: number;
}

/**
 * Request to spend chips for dice bonus or loyalty improvement
 */
export interface SpendChipsRequest {
  action: "dice-bonus" | "loyalty-improvement";
  /** Number of chips to spend (for dice-bonus) */
  chipsToSpend?: number;
  /** Target loyalty level (for loyalty-improvement, must be current + 1) */
  targetLoyalty?: number;
  notes?: string;
}

/**
 * Response from spending chips
 */
export interface SpendChipsResponse {
  success: boolean;
  /** Dice bonus granted (for dice-bonus action) */
  diceBonus?: number;
  /** New loyalty rating (for loyalty-improvement action) */
  newLoyalty?: number;
  /** Chips deducted */
  chipsSpent: number;
  /** Updated contact */
  contact?: SocialContact;
  /** Transaction record */
  transaction?: FavorTransaction;
  error?: string;
}

/**
 * Response for favor call resolution
 */
export interface CallFavorResponse {
  success: boolean;
  resolution?: {
    success: boolean;
    netHits: number;
    favorConsumed: number;
    loyaltyChange?: number;
    burned?: boolean;
    burnReason?: string;
    serviceResult?: string;
    chipCostBreakdown?: ChipCostBreakdown;
  };
  transaction?: FavorTransaction;
  contact?: SocialContact;
  error?: string;
}

/**
 * Response for networking action
 */
export interface NetworkingActionResponse {
  success: boolean;
  contactFound: boolean;
  suggestedContact?: Partial<SocialContact>;
  nuyenSpent: number;
  timeSpent: string;
  error?: string;
}

// =============================================================================
// ACTIVITY TYPES
// =============================================================================

/**
 * Activity types for social governance events
 */
export type SocialActivityType =
  | "contact_acquired"
  | "contact_burned"
  | "contact_reactivated"
  | "contact_deceased"
  | "favor_called"
  | "favor_granted"
  | "favor_repaid"
  | "loyalty_increased"
  | "loyalty_decreased"
  | "social_action_resolved"
  | "networking_success"
  | "networking_failure";

// =============================================================================
// FILTER TYPES
// =============================================================================

/**
 * Filters for searching contacts
 */
export interface ContactFilters {
  archetype?: string;
  archetypeId?: string;
  location?: string;
  locationId?: ID;
  organization?: string;
  organizationId?: ID;
  minConnection?: number;
  maxConnection?: number;
  minLoyalty?: number;
  maxLoyalty?: number;
  status?: ContactStatus;
  group?: ContactGroup;
  search?: string;
}
