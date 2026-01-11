# Implementation Plan: Social Governance Capability

## Goal Description

Implement the **Social Governance** capability to guarantee the integrity of contact networks, social influence, and favor ledgers. This capability ensures that all social interactions are governed by edition-specific loyalty/connection metrics, networking constraints, and resource-driven influence resolution, providing a stable and verifiable state for a character's social capital and their associated network of assets.

**Current State:** The codebase has a minimal `Contact` type in `/lib/types/character.ts` with only basic fields (name, connection, loyalty, type, notes). There is no favor tracking, social capital management, influence resolution, or contact state transitions. Campaign infrastructure and NPC governance are fully implemented.

**Target State:** Full Social Governance with:

- Extended contact model with full lifecycle states (active, burned, inactive, etc.)
- Favor Ledger system for tracking social capital accumulation and consumption
- Influence budget and resource tracking per character
- Contact network management with filtering and discovery
- Favor calling and favor owed mechanics
- Social action resolution (networking, bribes, reputation effects)
- Campaign-scoped contact pools and shared contacts
- Integration with karma/nuyen resource expenditure
- GM visibility controls for secret contacts

---

## Architectural Decisions

1. **Contact vs. Character Separation**
   - **Decision:** Contacts remain a separate type, distinct from full Characters or NPCs
   - **Rationale:** Contacts have fundamentally different mechanics (no condition monitors, simplified stats, favor-based interactions rather than combat)
   - **Capability Reference:** Requirement "Contact identities MUST be uniquely defined and bound to a persistent set of loyalty and connection attributes"

2. **Storage Structure**
   - **Decision:** Character contacts stored within character JSON; campaign shared contacts stored at `/data/campaigns/{campaignId}/contacts/{contactId}.json`
   - **Rationale:** Character-specific contacts are owned by the character; campaign contacts can be shared across participants
   - **Capability Reference:** Guarantee "The 'Favor Ledger' MUST be persistent and auditable"

3. **Favor Ledger Design**
   - **Decision:** Append-only ledger with transaction records stored per character at `/data/characters/{userId}/{characterId}/favor-ledger.json`
   - **Rationale:** Immutable audit trail for social capital, supports verification across campaign lifecycle
   - **Capability Reference:** Requirement "Social capital 'records' MUST be persistent and verifiable throughout a campaign's lifecycle"

4. **Influence Budget System**
   - **Decision:** Per-character influence budget tracked in character data, campaign-level availability constraints in campaign settings
   - **Rationale:** Characters have individual social capital limits; campaigns can constrain availability
   - **Capability Reference:** Requirement "Allocation of social capital MUST be constrained by character-specific influence budgets and campaign-level availability"

5. **Contact State Machine**
   - **Decision:** Explicit state transitions (active → burned, active → inactive, etc.) with prerequisite validation
   - **Rationale:** Ensures all transitions follow edition rules and resource requirements
   - **Capability Reference:** Requirement "Transitions in contact state MUST satisfy all prerequisites and resource requirements"

6. **Social Action Resolution**
   - **Decision:** Authoritative resolution functions that calculate dice pools, modifiers, and outcomes
   - **Rationale:** Provides consistent resolution while supporting GM overrides
   - **Capability Reference:** Requirement "The system MUST provide Authoritative resolution for social actions"

---

## Proposed Changes

### Phase 1: Type Definitions

#### 1.1 Extend Contact Types

**File:** `/lib/types/contacts.ts` (NEW)
**References:**

- Capability Guarantee: "Contact identities MUST be uniquely defined and bound to a persistent set of loyalty and connection attributes"
- Capability Requirement: "Contact networks MUST be persistent and discoverable"

```typescript
// Core interfaces to define:
export type ContactStatus = "active" | "burned" | "inactive" | "missing" | "deceased";

export type ContactGroup = "personal" | "shared" | "campaign" | "organization";

export interface Contact {
  id: ID;
  characterId?: ID; // Owner character (null for campaign contacts)
  campaignId?: ID; // Campaign scope (null for personal contacts)

  // Identity
  name: string;
  aliases?: string[];
  metatype?: string;
  description?: string;
  imageUrl?: string;

  // Core Attributes (SR5: 1-12 each)
  connection: number;
  loyalty: number;

  // Classification
  archetype: string; // "Fixer", "Street Doc", "Mr. Johnson", etc.
  archetypeId?: string; // Reference to catalog archetype
  specializations?: string[]; // Areas of expertise
  location?: string; // Primary location
  locationId?: ID; // Reference to campaign location
  organization?: string; // Affiliated organization
  organizationId?: ID;

  // State
  status: ContactStatus;
  burnedReason?: string;
  burnedAt?: ISODateString;

  // Favor Balance
  favorBalance: number; // Positive = contact owes favors, Negative = character owes favors

  // Access Control
  group: ContactGroup;
  visibility: ContactVisibility;
  sharedWithCharacterIds?: ID[];

  // Metadata
  notes?: string;
  gmNotes?: string;
  lastContactedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
  metadata?: Metadata;
}

export interface ContactVisibility {
  playerVisible: boolean;
  showConnection: boolean;
  showLoyalty: boolean;
  showFavorBalance: boolean;
  showSpecializations: boolean;
}

export interface ContactArchetype {
  id: string;
  name: string;
  description: string;
  suggestedConnection: [number, number]; // Min-max range
  suggestedLoyalty: [number, number];
  commonServices: string[];
  riskProfile: "low" | "medium" | "high";
  typicalCosts: Record<string, number>; // Service type to nuyen cost
}
```

#### 1.2 Define Favor Ledger Types

**File:** `/lib/types/contacts.ts`
**References:**

- Capability Guarantee: "The 'Favor Ledger' MUST be persistent and auditable"
- Capability Requirement: "Every favor or social service MUST be bound to a verifiable ruleset-defined cost and risk profile"

```typescript
export type FavorTransactionType =
  | "favor_called" // Character called in a favor
  | "favor_granted" // Contact performed a service
  | "favor_owed" // Contact did something creating debt
  | "favor_repaid" // Character repaid a favor
  | "loyalty_change" // Loyalty increased/decreased
  | "connection_change" // Connection increased/decreased
  | "contact_burned" // Contact was burned
  | "contact_acquired" // New contact acquired
  | "gift" // Gift given to contact
  | "betrayal" // Contact betrayed or was betrayed
  | "reputation_effect"; // Street cred/notoriety affected relationship

export interface FavorTransaction {
  id: ID;
  characterId: ID;
  contactId: ID;
  campaignId?: ID;
  sessionId?: ID; // Campaign session when transaction occurred

  type: FavorTransactionType;

  // Transaction details
  description: string;
  favorChange: number; // +/- change to favor balance
  loyaltyChange?: number;
  connectionChange?: number;

  // Resource costs
  nuyenSpent?: number;
  karmaSpent?: number;

  // Service details (if favor was called)
  serviceType?: string;
  serviceRisk?: "trivial" | "low" | "medium" | "high" | "extreme";
  thresholdRequired?: number;
  rollResult?: number;
  success?: boolean;

  // Approval workflow
  requiresGmApproval: boolean;
  gmApproved?: boolean;
  gmApprovedBy?: ID;
  gmApprovedAt?: ISODateString;
  rejectionReason?: string;

  timestamp: ISODateString;
  metadata?: Metadata;
}

export interface FavorLedger {
  characterId: ID;
  transactions: FavorTransaction[];

  // Aggregate stats
  totalFavorsCalled: number;
  totalFavorsOwed: number;
  totalNuyenSpent: number;
  totalKarmaSpent: number;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}
```

#### 1.3 Define Social Capital Types

**File:** `/lib/types/contacts.ts`
**References:**

- Capability Requirement: "Allocation of social capital MUST be constrained by character-specific influence budgets"
- Capability Requirement: "The mechanical consequences of social actions MUST be automatically propagated"

```typescript
export interface SocialCapital {
  characterId: ID;

  // Budget constraints
  maxContactPoints: number; // Total points available (Connection + Loyalty per contact)
  usedContactPoints: number;

  // Contact counts
  totalContacts: number;
  activeContacts: number;
  burnedContacts: number;

  // Influence metrics
  networkingBonus?: number; // From qualities like "First Impression"
  socialLimitModifier?: number; // From qualities or augmentations

  // Campaign constraints
  campaignContactLimit?: number; // GM-set limit on total contacts

  updatedAt: ISODateString;
}

export interface SocialAction {
  id: ID;
  type: SocialActionType;
  characterId: ID;
  targetContactId?: ID;

  // Roll information
  dicePool: number;
  threshold: number;
  modifiers: SocialModifier[];
  rollResult?: number;
  netHits?: number;
  success?: boolean;

  // Costs and outcomes
  nuyenCost?: number;
  karmaCost?: number;
  timeRequired?: string; // e.g., "1 hour", "1 day"

  // Effects
  loyaltyChange?: number;
  connectionChange?: number;
  favorChange?: number;

  timestamp: ISODateString;
}

export type SocialActionType =
  | "networking" // Finding new contacts
  | "favor_call" // Calling in a favor
  | "bribe" // Direct payment for service
  | "legwork" // Information gathering
  | "introduction" // Getting introduced to someone
  | "reputation_boost" // Improving standing
  | "damage_control"; // Recovering from social misstep

export interface SocialModifier {
  source: string; // e.g., "Contact Attitude", "Street Cred", "Quality: First Impression"
  modifier: number;
  description?: string;
}
```

#### 1.4 Define Favor Cost Tables

**File:** `/lib/types/contacts.ts`
**References:**

- Capability Requirement: "Every favor or social service MUST be bound to a verifiable ruleset-defined cost and risk profile"

```typescript
export interface FavorCostTable {
  editionCode: string;
  services: FavorServiceDefinition[];
}

export interface FavorServiceDefinition {
  id: string;
  name: string;
  description: string;

  // Requirements
  minimumConnection: number;
  minimumLoyalty: number;

  // Costs
  favorCost: number; // Favor points consumed
  nuyenCost?: number | string; // Fixed or formula (e.g., "connection * 100")
  karmaCost?: number;

  // Risk
  riskLevel: "trivial" | "low" | "medium" | "high" | "extreme";
  burnRiskOnFailure: boolean;

  // Resolution
  opposedTest: boolean;
  threshold?: number;

  // Time
  typicalTime: string;
}
```

#### 1.5 Update Type Index

**File:** `/lib/types/index.ts`
**References:** Architecture pattern - single export point

Add exports for all new contact and social governance types.

---

### Phase 2: Storage Layer

#### 2.1 Create Contact Storage Functions

**File:** `/lib/storage/contacts.ts` (NEW)
**References:**

- Capability Constraint: "A character MUST NOT call upon a social contact without a defined loyalty/connection relationship"
- Capability Guarantee: "The system MUST enforce authoritative 'Contact Fidelity'"

```typescript
// Character Contact CRUD
export function getCharacterContacts(userId: ID, characterId: ID): Contact[];

export function getCharacterContact(userId: ID, characterId: ID, contactId: ID): Contact | null;

export function addCharacterContact(
  userId: ID,
  characterId: ID,
  contact: Omit<Contact, "id" | "createdAt" | "updatedAt">
): Contact;

export function updateCharacterContact(
  userId: ID,
  characterId: ID,
  contactId: ID,
  updates: Partial<Contact>
): Contact;

export function removeCharacterContact(userId: ID, characterId: ID, contactId: ID): boolean;

// Campaign Contact CRUD
export function getCampaignContacts(
  campaignId: ID,
  options?: { archetype?: string; location?: string; search?: string }
): Contact[];

export function createCampaignContact(
  campaignId: ID,
  contact: Omit<Contact, "id" | "createdAt" | "updatedAt">
): Contact;

export function updateCampaignContact(
  campaignId: ID,
  contactId: ID,
  updates: Partial<Contact>
): Contact;

export function deleteCampaignContact(campaignId: ID, contactId: ID): boolean;

// Contact State Transitions
export function burnContact(userId: ID, characterId: ID, contactId: ID, reason: string): Contact;

export function reactivateContact(
  userId: ID,
  characterId: ID,
  contactId: ID,
  karmaCost: number
): Contact;

// Query Operations
export function searchContacts(
  characterId: ID,
  options: {
    archetype?: string;
    location?: string;
    minConnection?: number;
    minLoyalty?: number;
    status?: ContactStatus;
    search?: string;
  }
): Contact[];
```

**Storage Location:**

- Character contacts: `/data/characters/{userId}/{characterId}.json` (in contacts array)
- Campaign contacts: `/data/campaigns/{campaignId}/contacts/{contactId}.json`

#### 2.2 Create Favor Ledger Storage Functions

**File:** `/lib/storage/favor-ledger.ts` (NEW)
**References:**

- Capability Guarantee: "The 'Favor Ledger' MUST be persistent and auditable"
- Capability Requirement: "Social capital 'records' MUST be persistent and verifiable"

```typescript
export function getFavorLedger(userId: ID, characterId: ID): FavorLedger | null;

export function initializeFavorLedger(userId: ID, characterId: ID): FavorLedger;

export function addFavorTransaction(
  userId: ID,
  characterId: ID,
  transaction: Omit<FavorTransaction, "id" | "timestamp">
): FavorTransaction;

export function getContactTransactions(
  userId: ID,
  characterId: ID,
  contactId: ID
): FavorTransaction[];

export function getSessionTransactions(
  userId: ID,
  characterId: ID,
  sessionId: ID
): FavorTransaction[];

export function getPendingApprovals(campaignId: ID): FavorTransaction[];

export function approveFavorTransaction(transactionId: ID, gmUserId: ID): FavorTransaction;

export function rejectFavorTransaction(
  transactionId: ID,
  gmUserId: ID,
  reason: string
): FavorTransaction;

export function recalculateAggregates(userId: ID, characterId: ID): FavorLedger;
```

**Storage Location:** `/data/characters/{userId}/{characterId}/favor-ledger.json`

#### 2.3 Create Social Capital Storage Functions

**File:** `/lib/storage/social-capital.ts` (NEW)
**References:**

- Capability Requirement: "Allocation of social capital MUST be constrained by character-specific influence budgets"

```typescript
export function getSocialCapital(userId: ID, characterId: ID): SocialCapital | null;

export function initializeSocialCapital(
  userId: ID,
  characterId: ID,
  maxPoints: number
): SocialCapital;

export function updateSocialCapital(
  userId: ID,
  characterId: ID,
  updates: Partial<SocialCapital>
): SocialCapital;

export function recalculateSocialCapital(userId: ID, characterId: ID): SocialCapital;

export function checkContactBudget(
  userId: ID,
  characterId: ID,
  newContactPoints: number
): { allowed: boolean; available: number; required: number };
```

---

### Phase 3: Rules Engine

#### 3.1 Create Contact Rules Functions

**File:** `/lib/rules/contacts.ts` (NEW)
**References:**

- Capability Requirement: "The system MUST enforce mandatory contact-specific attribute requirements"
- Capability Constraint: "Social actions MUST NOT exceed the constraints defined by character's current social capital"

```typescript
// Contact Validation
export function validateContact(
  contact: Partial<Contact>,
  editionCode: string
): { valid: boolean; errors: string[] };

export function validateContactBudget(
  character: Character,
  newContact: Contact
): { allowed: boolean; pointsUsed: number; pointsAvailable: number };

export function calculateContactPoints(contact: Contact): number;

// Loyalty/Connection Limits
export function getMaxConnection(editionCode: string): number;
export function getMaxLoyalty(editionCode: string): number;

// State Transitions
export function canBurnContact(contact: Contact): { allowed: boolean; reason?: string };

export function canReactivateContact(
  contact: Contact,
  character: Character
): { allowed: boolean; karmaCost: number; reason?: string };

export function getReactivationCost(contact: Contact, editionCode: string): number;

// Contact Improvement
export function getLoyaltyImprovementCost(
  currentLoyalty: number,
  editionCode: string
): { karmaCost: number; nuyenCost?: number; timeRequired?: string };

export function getConnectionImprovementCost(
  currentConnection: number,
  editionCode: string
): { karmaCost: number; nuyenCost?: number; timeRequired?: string };
```

#### 3.2 Create Favor Resolution Functions

**File:** `/lib/rules/favors.ts` (NEW)
**References:**

- Capability Requirement: "The system MUST provide Authoritative resolution for social actions"
- Capability Requirement: "Every favor or social service MUST be bound to a verifiable ruleset-defined cost"

```typescript
// Favor Mechanics
export function calculateFavorCost(
  service: FavorServiceDefinition,
  contact: Contact,
  character: Character
): { favorCost: number; nuyenCost: number; karmaCost: number };

export function canCallFavor(
  contact: Contact,
  service: FavorServiceDefinition,
  character: Character
): { allowed: boolean; reason?: string };

export function resolveFavorCall(
  contact: Contact,
  service: FavorServiceDefinition,
  character: Character,
  diceRoll: number
): {
  success: boolean;
  netHits: number;
  favorConsumed: number;
  loyaltyChange?: number;
  burned?: boolean;
  burnReason?: string;
};

// Favor Balance
export function getFavorBalance(transactions: FavorTransaction[], contactId: ID): number;

export function getOwedFavors(
  transactions: FavorTransaction[],
  characterId: ID
): { contactId: ID; amount: number }[];

// Risk Calculations
export function calculateBurnRisk(
  service: FavorServiceDefinition,
  contact: Contact,
  rollResult: number
): { burnChance: number; isBurned: boolean };
```

#### 3.3 Create Social Action Resolution Functions

**File:** `/lib/rules/social-actions.ts` (NEW)
**References:**

- Capability Requirement: "The system MUST provide Authoritative resolution for social actions, including networking, bribe resolution, and favor calling"

```typescript
// Dice Pool Calculation
export function calculateSocialDicePool(
  character: Character,
  actionType: SocialActionType,
  contact?: Contact
): { dicePool: number; modifiers: SocialModifier[] };

export function getSocialModifiers(
  character: Character,
  contact: Contact,
  actionType: SocialActionType
): SocialModifier[];

// Action Resolution
export function resolveNetworking(
  character: Character,
  targetArchetype: string,
  diceRoll: number
): {
  success: boolean;
  contactFound: boolean;
  suggestedConnection: number;
  suggestedLoyalty: number;
  timeSpent: string;
  nuyenSpent: number;
};

export function resolveBribe(
  character: Character,
  target: Contact | "npc",
  nuyenOffered: number,
  diceRoll: number
): {
  success: boolean;
  accepted: boolean;
  loyaltyChange?: number;
  consequences?: string;
};

export function resolveLegwork(
  character: Character,
  contact: Contact,
  informationType: string,
  diceRoll: number
): {
  success: boolean;
  informationQuality: "none" | "partial" | "full" | "detailed";
  favorCost: number;
  nuyenCost: number;
};

// Consequence Propagation
export function propagateSocialConsequences(
  character: Character,
  action: SocialAction
): {
  loyaltyChanges: { contactId: ID; change: number }[];
  reputationChanges: { streetCred?: number; notoriety?: number };
  newContacts?: Contact[];
  burnedContacts?: ID[];
};
```

#### 3.4 Create Contact Network Functions

**File:** `/lib/rules/contact-network.ts` (NEW)
**References:**

- Capability Requirement: "Contact networks MUST be persistent and discoverable, allowing for filtering by archetype, location, and specialization"

```typescript
// Network Analysis
export function analyzeContactNetwork(contacts: Contact[]): {
  totalValue: number;
  archetypeDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
  averageConnection: number;
  averageLoyalty: number;
  burnedPercentage: number;
};

export function findContactBySpecialization(contacts: Contact[], specialization: string): Contact[];

export function findContactByService(contacts: Contact[], serviceType: string): Contact[];

export function suggestContactGaps(contacts: Contact[], editionCode: string): string[]; // Suggested archetypes to fill gaps

// Shared Contact Resolution
export function resolveSharedContact(
  contact: Contact,
  requestingCharacterId: ID,
  owningCharacterId: ID
): {
  effectiveConnection: number;
  effectiveLoyalty: number;
  favorCostMultiplier: number;
};
```

---

### Phase 4: API Endpoints

#### 4.1 Character Contacts Endpoint

**File:** `/app/api/characters/[characterId]/contacts/route.ts` (NEW)
**References:**

- Capability Guarantee: "Contact networks MUST be persistent and discoverable"

```typescript
// GET /api/characters/{characterId}/contacts
// Query: ?archetype=Fixer&minConnection=3&status=active
// Returns: { success: boolean; contacts: Contact[] }

// POST /api/characters/{characterId}/contacts
// Body: CreateContactRequest
// Validation:
//   - Connection 1-12, Loyalty 1-6
//   - Contact budget check
//   - Unique name validation
// Returns: { success: boolean; contact: Contact }
```

#### 4.2 Individual Contact Endpoint

**File:** `/app/api/characters/[characterId]/contacts/[contactId]/route.ts` (NEW)
**References:**

- Capability Requirement: "Transitions in contact state MUST satisfy all prerequisites"

```typescript
// GET /api/characters/{characterId}/contacts/{contactId}
// Returns: { success: boolean; contact: Contact; transactions?: FavorTransaction[] }

// PUT /api/characters/{characterId}/contacts/{contactId}
// Owner or GM only, updates contact
// Returns: { success: boolean; contact: Contact }

// DELETE /api/characters/{characterId}/contacts/{contactId}
// Owner only, removes contact
// Returns: { success: boolean }
```

#### 4.3 Contact State Transitions Endpoint

**File:** `/app/api/characters/[characterId]/contacts/[contactId]/state/route.ts` (NEW)
**References:**

- Capability Requirement: "Transitions in contact state MUST satisfy all prerequisites and resource requirements"

```typescript
// POST /api/characters/{characterId}/contacts/{contactId}/state
// Body: { action: "burn" | "reactivate" | "mark-missing" | "mark-deceased"; reason?: string }
// Validates prerequisites, applies resource costs
// Returns: { success: boolean; contact: Contact; transaction?: FavorTransaction }
```

#### 4.4 Favor Ledger Endpoint

**File:** `/app/api/characters/[characterId]/favor-ledger/route.ts` (NEW)
**References:**

- Capability Guarantee: "The 'Favor Ledger' MUST be persistent and auditable"

```typescript
// GET /api/characters/{characterId}/favor-ledger
// Query: ?contactId={contactId}&sessionId={sessionId}
// Returns: { success: boolean; ledger: FavorLedger; transactions: FavorTransaction[] }

// POST /api/characters/{characterId}/favor-ledger
// Body: CreateFavorTransactionRequest
// Returns: { success: boolean; transaction: FavorTransaction; ledger: FavorLedger }
```

#### 4.5 Favor Call Endpoint

**File:** `/app/api/characters/[characterId]/contacts/[contactId]/call-favor/route.ts` (NEW)
**References:**

- Capability Requirement: "The system MUST provide Authoritative resolution for social actions"

```typescript
// POST /api/characters/{characterId}/contacts/{contactId}/call-favor
// Body: { serviceType: string; diceRoll?: number }
// Validates contact can provide service, calculates costs
// Returns: {
//   success: boolean;
//   resolution: FavorResolution;
//   transaction: FavorTransaction;
//   contact: Contact; // Updated state
// }
```

#### 4.6 Social Capital Endpoint

**File:** `/app/api/characters/[characterId]/social-capital/route.ts` (NEW)
**References:**

- Capability Requirement: "Allocation of social capital MUST be constrained by character-specific influence budgets"

```typescript
// GET /api/characters/{characterId}/social-capital
// Returns: { success: boolean; socialCapital: SocialCapital }

// POST /api/characters/{characterId}/social-capital/recalculate
// Recalculates from current contacts
// Returns: { success: boolean; socialCapital: SocialCapital }
```

#### 4.7 Campaign Contacts Endpoint

**File:** `/app/api/campaigns/[id]/contacts/route.ts` (NEW)
**References:**

- Capability Constraint: "Social actions MUST NOT exceed the constraints defined by campaign visibility"

```typescript
// GET /api/campaigns/{campaignId}/contacts
// Query: ?archetype=Fixer&location=Seattle
// Returns: { success: boolean; contacts: Contact[] }

// POST /api/campaigns/{campaignId}/contacts
// GM only, creates shared campaign contact
// Returns: { success: boolean; contact: Contact }
```

#### 4.8 Networking Action Endpoint

**File:** `/app/api/characters/[characterId]/social-actions/networking/route.ts` (NEW)
**References:**

- Capability Requirement: "Authoritative resolution for social actions, including networking"

```typescript
// POST /api/characters/{characterId}/social-actions/networking
// Body: { targetArchetype: string; location?: string; nuyenBudget?: number; diceRoll: number }
// Returns: {
//   success: boolean;
//   contactFound: boolean;
//   suggestedContact?: Partial<Contact>;
//   nuyenSpent: number;
//   timeSpent: string;
// }
```

#### 4.9 Favor Cost Table Endpoint

**File:** `/app/api/editions/[editionCode]/favor-costs/route.ts` (NEW)
**References:**

- Capability Requirement: "Every favor or social service MUST be bound to a verifiable ruleset-defined cost"

```typescript
// GET /api/editions/{editionCode}/favor-costs
// Query: ?archetype=Fixer
// Returns: { success: boolean; services: FavorServiceDefinition[] }
```

---

### Phase 5: UI Components

#### 5.1 Contacts List Page

**File:** `/app/characters/[id]/contacts/page.tsx` (NEW)
**References:**

- Capability Requirement: "Contact networks MUST be persistent and discoverable"

Features:

- List all contacts for character
- Filter by archetype, location, status
- Search by name or specialization
- Sort by connection, loyalty, favor balance
- Add new contact button
- Contact cards with quick stats
- Network analysis summary

#### 5.2 Contact Card Component

**File:** `/app/characters/[id]/contacts/components/ContactCard.tsx` (NEW)

Features:

- Contact name and archetype badge
- Connection/Loyalty rating display
- Favor balance indicator (+/- owed)
- Status indicator (active/burned/inactive)
- Quick actions (View, Call Favor, Edit)
- Visibility indicator for GM-only info

#### 5.3 Contact Detail Page

**File:** `/app/characters/[id]/contacts/[contactId]/page.tsx` (NEW)

Features:

- Full contact information display
- Transaction history timeline
- Call favor button with service selection
- Edit contact details (owner/GM only)
- Burn/reactivate contact actions
- Favor balance chart over time

#### 5.4 Add/Edit Contact Modal

**File:** `/app/characters/[id]/contacts/components/ContactFormModal.tsx` (NEW)
**References:**

- Capability Requirement: "The system MUST enforce mandatory contact-specific attribute requirements"

Features:

- Archetype selection with suggestions
- Connection/Loyalty sliders with point costs
- Specialization tags
- Location picker
- Contact point budget display
- Validation feedback

#### 5.5 Call Favor Modal

**File:** `/app/characters/[id]/contacts/components/CallFavorModal.tsx` (NEW)
**References:**

- Capability Requirement: "Every favor or social service MUST be bound to a verifiable ruleset-defined cost"

Features:

- Service type selection based on archetype
- Cost breakdown (favor, nuyen, karma)
- Risk assessment display
- Dice pool calculation with modifiers
- Roll integration
- Success/failure handling

#### 5.6 Favor Ledger View

**File:** `/app/characters/[id]/contacts/components/FavorLedgerView.tsx` (NEW)
**References:**

- Capability Guarantee: "The 'Favor Ledger' MUST be persistent and auditable"

Features:

- Transaction list with filters
- Contact-specific view
- Session-specific view
- Aggregate statistics
- Export to CSV/PDF

#### 5.7 Social Capital Dashboard

**File:** `/app/characters/[id]/contacts/components/SocialCapitalDashboard.tsx` (NEW)
**References:**

- Capability Requirement: "Allocation of social capital MUST be constrained"

Features:

- Contact point budget bar
- Network value display
- Archetype coverage chart
- Missing archetype suggestions
- Burned contact warnings

#### 5.8 Networking Action Component

**File:** `/app/characters/[id]/contacts/components/NetworkingAction.tsx` (NEW)
**References:**

- Capability Requirement: "Authoritative resolution for networking"

Features:

- Archetype target selection
- Location filter
- Budget input (nuyen to spend)
- Dice pool calculation
- Roll button
- Result display with new contact suggestion

---

### Phase 6: Ruleset Data

#### 6.1 Create SR5 Contact Archetypes

**File:** `/data/editions/sr5/contacts/archetypes.json` (NEW)
**References:**

- Capability Requirement: "Contact networks MUST be persistent and discoverable, allowing for filtering by archetype"

Create archetype definitions including:

- Fixer (general purpose, job connections)
- Street Doc (medical, cyberware)
- Talismonger (magical goods, reagents)
- Decker (matrix services, information)
- Rigger (vehicle services, smuggling)
- Mr. Johnson (corporate, job offers)
- Gang Leader (muscle, territory)
- Fence (goods, stolen property)
- Armorer (weapons, modifications)
- ID Manufacturer (fake SINs, licenses)
- Bartender (rumors, introductions)
- Corporate Contact (insider info, access)
- Law Enforcement (warnings, favors)
- Media Contact (publicity, investigation)
- Academic (research, translation)

#### 6.2 Create SR5 Favor Cost Tables

**File:** `/data/editions/sr5/contacts/favor-costs.json` (NEW)
**References:**

- Capability Requirement: "Every favor or social service MUST be bound to a verifiable ruleset-defined cost"

Create favor costs for each archetype with services like:

- Information (basic, detailed, restricted)
- Introduction to contact
- Equipment procurement
- Safe house provision
- Transportation/smuggling
- Medical services
- Legal assistance
- Job referral
- Rumor planting
- Cover story support

Each with defined:

- Favor point cost
- Nuyen cost (if any)
- Minimum connection/loyalty required
- Risk level
- Typical time

#### 6.3 Create SR5 Social Modifiers Data

**File:** `/data/editions/sr5/contacts/social-modifiers.json` (NEW)
**References:**

- Capability Requirement: "Social interactions MUST adhere to strictly defined influence protocols"

Encode the social modifiers from the rulebook:

- Attitude modifiers (Friendly +2, Hostile -3, etc.)
- Desired result modifiers (Advantageous +1, Disastrous -4, etc.)
- Skill-specific modifiers (Con, Etiquette, Intimidation, etc.)
- Street Cred/Notoriety effects

---

### Phase 7: Integration

#### 7.1 Add Contacts to Character Navigation

**File:** `/app/characters/[id]/components/CharacterSidebar.tsx` (or equivalent)

Add "Contacts" navigation link with:

- Contact count badge
- Favor balance indicator (if significant debt)
- Burned contact warning

#### 7.2 Update Character Creation Contacts Step

**File:** `/app/characters/create/components/steps/ContactsStep.tsx` (UPDATE)

Enhance existing step with:

- Contact point budget from priority
- Archetype templates for quick creation
- Budget enforcement
- Favor balance initialization

#### 7.3 Add Contact Events to Activity Feed

**File:** `/lib/types/campaign.ts` (UPDATE)

Extend `CampaignActivityEventType` with:

- `contact_acquired`
- `contact_burned`
- `contact_reactivated`
- `favor_called`
- `favor_granted`
- `social_action_resolved`

#### 7.4 Integrate with Session Rewards

**File:** `/app/campaigns/[campaignId]/sessions/components/SessionRewardsForm.tsx` (UPDATE if exists)

Add support for:

- Session-linked favor transactions
- Contact Loyalty improvements as rewards
- New contact introductions from NPCs

#### 7.5 Create Social Context (if needed)

**File:** `/lib/rules/SocialContext.tsx` (NEW, optional)

React Context for:

- Contact network state management
- Favor ledger caching
- Social capital calculations
- Real-time updates across components

---

## Verification Plan

### Automated Tests

#### Unit Tests: Types and Validation

**File:** `/__tests__/lib/types/contacts.test.ts`

| Test Case                                  | Capability Reference                         |
| ------------------------------------------ | -------------------------------------------- |
| Contact validates connection 1-12          | Contact attributes MUST be ruleset-compliant |
| Contact validates loyalty 1-6              | Contact attributes MUST be ruleset-compliant |
| Contact requires name and archetype        | Contact identities MUST be uniquely defined  |
| FavorTransaction validates required fields | Favor Ledger MUST be auditable               |
| ContactStatus transitions are valid        | State transitions MUST satisfy prerequisites |

#### Unit Tests: Rules Engine

**File:** `/__tests__/lib/rules/contacts.test.ts`

| Test Case                                           | Capability Reference                     |
| --------------------------------------------------- | ---------------------------------------- |
| calculateContactPoints returns connection + loyalty | Contact budget enforcement               |
| validateContactBudget enforces limits               | Social capital MUST be constrained       |
| canCallFavor checks connection minimum              | Service MUST meet connection requirement |
| canCallFavor checks loyalty minimum                 | Service MUST meet loyalty requirement    |
| canBurnContact checks active status                 | State transition prerequisites           |
| getReactivationCost returns karma based on rating   | Resource requirements for transitions    |

#### Unit Tests: Favor Resolution

**File:** `/__tests__/lib/rules/favors.test.ts`

| Test Case                                          | Capability Reference                     |
| -------------------------------------------------- | ---------------------------------------- |
| calculateFavorCost returns correct costs           | Service MUST be bound to verifiable cost |
| resolveFavorCall burns contact on critical failure | Burned bridges consequences              |
| resolveFavorCall adjusts loyalty on failure        | Mechanical consequences propagation      |
| getFavorBalance calculates correctly               | Favor Ledger MUST be auditable           |
| calculateBurnRisk increases with service risk      | Risk profile enforcement                 |

#### Unit Tests: Social Actions

**File:** `/__tests__/lib/rules/social-actions.test.ts`

| Test Case                                     | Capability Reference              |
| --------------------------------------------- | --------------------------------- |
| calculateSocialDicePool includes modifiers    | Authoritative resolution          |
| getSocialModifiers applies attitude correctly | Influence protocol adherence      |
| resolveNetworking respects nuyen budget       | Resource-driven influence         |
| resolveLegwork scales with connection         | Connection constraints            |
| propagateSocialConsequences updates correctly | Automatic consequence propagation |

#### Unit Tests: Storage Layer

**File:** `/__tests__/lib/storage/contacts.test.ts`

| Test Case                                | Capability Reference                |
| ---------------------------------------- | ----------------------------------- |
| addCharacterContact stores correctly     | Contact networks MUST be persistent |
| burnContact updates status and reason    | State transitions MUST be recorded  |
| getFavorLedger returns all transactions  | Favor Ledger MUST be persistent     |
| addFavorTransaction appends to ledger    | Ledger MUST be append-only          |
| getCampaignContacts filters by archetype | Discoverable with filtering         |

#### API Tests

**File:** `/app/api/characters/[characterId]/contacts/__tests__/`

| Test Case                                 | Capability Reference                     |
| ----------------------------------------- | ---------------------------------------- |
| POST requires owner or GM role            | Modification restricted to authorities   |
| POST validates contact budget             | Social capital constraints               |
| PUT validates state transition            | Prerequisites enforcement                |
| GET respects visibility settings          | Campaign visibility restrictions         |
| call-favor validates service availability | Contact cannot call without relationship |
| call-favor deducts resources              | Resource expenditure tracking            |

#### Integration Tests

**File:** `/__tests__/integration/social-governance.test.ts`

| Test Case                                 | Capability Reference         |
| ----------------------------------------- | ---------------------------- |
| Full lifecycle: acquire → favor → burn    | End-to-end social governance |
| Favor ledger tracks all transactions      | Auditable ledger             |
| Contact budget enforces limits            | Social capital constraints   |
| Burned contact cannot be called           | Burned bridges enforcement   |
| Reactivation costs karma                  | Resource requirements        |
| Campaign contacts visible to participants | Campaign visibility          |

### Manual Verification Steps

1. **Contact Management**
   - [ ] Create contact with valid connection/loyalty
   - [ ] Verify contact point budget enforcement
   - [ ] Edit contact details
   - [ ] Delete contact

2. **Favor Mechanics**
   - [ ] Call favor with sufficient loyalty/connection
   - [ ] Verify favor cost deduction
   - [ ] Attempt favor with insufficient loyalty (should fail)
   - [ ] Verify favor ledger records transaction

3. **Contact State Transitions**
   - [ ] Burn contact with reason
   - [ ] Verify burned contact cannot call favors
   - [ ] Reactivate contact with karma cost
   - [ ] Verify reactivation restores functionality

4. **Social Capital**
   - [ ] View social capital dashboard
   - [ ] Verify contact point calculation
   - [ ] Exceed budget (should be prevented)
   - [ ] Verify network analysis accuracy

5. **Campaign Integration**
   - [ ] Create campaign shared contact (GM)
   - [ ] Player accesses shared contact
   - [ ] Verify visibility controls
   - [ ] Favor transaction appears in session

6. **Access Control**
   - [ ] Login as player, verify can only edit own contacts
   - [ ] Login as GM, verify full access to all campaign contacts
   - [ ] Verify gmNotes hidden from players

---

## Dependency Ordering

```
Phase 1: Type Definitions
    1.1 → 1.2 → 1.3 → 1.4 → 1.5
                           ↓
Phase 2: Storage Layer
    2.1 → 2.2 → 2.3
              ↓
Phase 3: Rules Engine
    3.1 → 3.2 → 3.3 → 3.4
                   ↓
Phase 4: API Endpoints
    4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6 → 4.7 → 4.8 → 4.9
                                  ↓
Phase 5: UI Components
    5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6 → 5.7 → 5.8
                                  ↓
Phase 6: Ruleset Data
    6.1 → 6.2 → 6.3
              ↓
Phase 7: Integration
    7.1 → 7.2 → 7.3 → 7.4 → 7.5
              ↓
    Verification
```

**Critical Path:** Types (1.x) → Storage (2.x) → Rules (3.x) → APIs (4.x) → UI (5.x)

Phases 6 and 7 can be developed in parallel with Phase 5.

---

## File Summary

### New Files

| File                                                                         | Purpose                                            |
| ---------------------------------------------------------------------------- | -------------------------------------------------- |
| `/lib/types/contacts.ts`                                                     | All contact and social governance type definitions |
| `/lib/storage/contacts.ts`                                                   | Contact CRUD operations                            |
| `/lib/storage/favor-ledger.ts`                                               | Favor transaction ledger operations                |
| `/lib/storage/social-capital.ts`                                             | Social capital budget tracking                     |
| `/lib/rules/contacts.ts`                                                     | Contact validation and state transition rules      |
| `/lib/rules/favors.ts`                                                       | Favor calling and resolution logic                 |
| `/lib/rules/social-actions.ts`                                               | Social action dice pools and resolution            |
| `/lib/rules/contact-network.ts`                                              | Network analysis and discovery                     |
| `/app/api/characters/[characterId]/contacts/route.ts`                        | Character contacts list/create                     |
| `/app/api/characters/[characterId]/contacts/[contactId]/route.ts`            | Individual contact CRUD                            |
| `/app/api/characters/[characterId]/contacts/[contactId]/state/route.ts`      | Contact state transitions                          |
| `/app/api/characters/[characterId]/contacts/[contactId]/call-favor/route.ts` | Favor calling                                      |
| `/app/api/characters/[characterId]/favor-ledger/route.ts`                    | Favor ledger access                                |
| `/app/api/characters/[characterId]/social-capital/route.ts`                  | Social capital access                              |
| `/app/api/characters/[characterId]/social-actions/networking/route.ts`       | Networking action                                  |
| `/app/api/campaigns/[id]/contacts/route.ts`                                  | Campaign shared contacts                           |
| `/app/api/editions/[editionCode]/favor-costs/route.ts`                       | Favor cost table access                            |
| `/app/characters/[id]/contacts/page.tsx`                                     | Contacts list page                                 |
| `/app/characters/[id]/contacts/[contactId]/page.tsx`                         | Contact detail page                                |
| `/app/characters/[id]/contacts/components/*.tsx`                             | Contact UI components                              |
| `/data/editions/sr5/contacts/archetypes.json`                                | Contact archetype definitions                      |
| `/data/editions/sr5/contacts/favor-costs.json`                               | Favor cost tables                                  |
| `/data/editions/sr5/contacts/social-modifiers.json`                          | Social modifier data                               |
| `/__tests__/lib/types/contacts.test.ts`                                      | Type validation tests                              |
| `/__tests__/lib/storage/contacts.test.ts`                                    | Storage layer tests                                |
| `/__tests__/lib/storage/favor-ledger.test.ts`                                | Favor ledger tests                                 |
| `/__tests__/lib/rules/contacts.test.ts`                                      | Contact rules tests                                |
| `/__tests__/lib/rules/favors.test.ts`                                        | Favor resolution tests                             |
| `/__tests__/lib/rules/social-actions.test.ts`                                | Social action tests                                |
| `/__tests__/integration/social-governance.test.ts`                           | Integration tests                                  |

### Modified Files

| File                                                       | Changes                                        |
| ---------------------------------------------------------- | ---------------------------------------------- |
| `/lib/types/index.ts`                                      | Export new contact and social types            |
| `/lib/types/campaign.ts`                                   | Add social activity event types                |
| `/lib/types/character.ts`                                  | Deprecate old Contact type, reference new type |
| `/app/characters/[id]/components/CharacterSidebar.tsx`     | Add contacts nav link                          |
| `/app/characters/create/components/steps/ContactsStep.tsx` | Enhance with budget enforcement                |

---

## Open Questions Resolved

| Question                        | Resolution                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| Character vs Campaign contacts? | Both: character-owned contacts in character data, shared contacts in campaign scope |
| Favor tracking granularity?     | Per-transaction ledger with aggregate calculations                                  |
| Contact budget enforcement?     | Connection + Loyalty points per contact, total capped per character                 |
| Burned contact recovery?        | Karma cost based on original connection/loyalty                                     |
| Shared contact mechanics?       | Reduced effective loyalty/connection for non-owner callers                          |
| Campaign visibility?            | GM controls visibility per contact, defaults to hidden                              |
| Real-time favor balance?        | Calculated from ledger transactions on request                                      |
| Networking resolution?          | Dice pool based on social skill + modifiers, time/nuyen costs                       |
| GM override support?            | GM can bypass requirements, logged in transaction                                   |
| Cross-campaign contacts?        | Not supported initially, contacts scoped to single campaign or personal             |

---

## Capability Traceability Matrix

| Capability Guarantee/Requirement                       | Implementation Location                     |
| ------------------------------------------------------ | ------------------------------------------- |
| Contact identities MUST be uniquely defined            | Phase 1.1 Contact type with required fields |
| Bound to persistent loyalty/connection                 | Phase 1.1, 2.1 storage persistence          |
| Social interactions MUST adhere to influence protocols | Phase 3.2, 3.3 resolution functions         |
| Favor Ledger MUST be persistent and auditable          | Phase 1.2, 2.2 append-only ledger           |
| Contact Fidelity MUST be enforced                      | Phase 3.1 validation functions              |
| Mandatory contact-specific attributes                  | Phase 3.1 validateContact()                 |
| Contact networks MUST be discoverable with filtering   | Phase 2.1, 4.1, 5.1 search/filter           |
| Transitions MUST satisfy prerequisites                 | Phase 3.1 state transition validation       |
| Every favor MUST be bound to cost/risk                 | Phase 1.4, 6.2 favor cost tables            |
| Social capital MUST be constrained                     | Phase 1.3, 2.3, 3.1 budget enforcement      |
| Mechanical consequences MUST propagate                 | Phase 3.3 propagateSocialConsequences()     |
| Authoritative resolution for social actions            | Phase 3.2, 3.3, 4.5, 4.8 resolution APIs    |
| Social records MUST be persistent/verifiable           | Phase 2.2 favor ledger storage              |
| MUST NOT call contact without relationship             | Phase 3.2 canCallFavor() validation         |
| MUST NOT exceed social capital constraints             | Phase 3.1-3.3 budget checks                 |
| Incompatible ruleset content MUST be prohibited        | Phase 3.1 edition-specific validation       |
