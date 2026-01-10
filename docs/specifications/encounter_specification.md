> [!NOTE]
> This implementation guide is governed by the [Capability (mechanics.encounter-governance.md)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/mechanics.encounter-governance.md).

# Encounter Specification

**Last Updated:** 2025-01-27
**Status:** Specification
**Category:** Gameplay, Combat Management, Session Tools
**Affected Editions:** All editions (combat mechanics vary by edition)
**Related Specs:**

- [Campaign Support Specification](./campaign_support_specification.md)
- [NPCs/Grunts Specification](./npcs_grunts_specification.md)
- [Character Advancement Specification](./character_advancement_specification.md)
- [Locations Specification](./locations_specification.md)

---

## Overview

The Encounter system provides GMs with tools to plan, run, and track combat and non-combat encounters within campaigns. Encounters serve as the bridge between campaign sessions, NPCs/Grunts, player characters, and locations. The system includes initiative tracking, action management, damage application, and post-encounter reward calculation.

**Key Features:**

- Encounter creation with participant management (PCs + NPCs)
- Combined initiative tracker for all participants
- Turn-based action tracking
- Integrated damage application
- Encounter templates for reusable scenarios
- Session-encounter linking for reward tracking
- Difficulty assessment and karma suggestion
- Combat log and history
- Location integration

**Source Material:** Shadowrun 5th Edition Core Rulebook, Chapter: Combat

---

## Page Structure

### Routes

#### Encounters List Page

- **Path:** `/app/campaigns/[campaignId]/encounters/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Lists all encounters for a campaign

#### Encounter Detail Page

- **Path:** `/app/campaigns/[campaignId]/encounters/[encounterId]/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Encounter overview, participants, and status
- **Tabs:**
  - `overview`: Encounter details and participant summary
  - `combat`: Active combat tracker (initiative, turns)
  - `log`: Combat log and history
  - `rewards`: Post-encounter reward distribution

#### Create Encounter Page

- **Path:** `/app/campaigns/[campaignId]/encounters/create/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route, GM-only)
- **Description:** Wizard/form for creating a new encounter

#### Combat Tracker (Full Screen)

- **Path:** `/app/campaigns/[campaignId]/encounters/[encounterId]/combat/page.tsx`
- **Layout:** Minimal layout (focused combat view)
- **Authentication:** Required (protected route)
- **Description:** Full-screen combat tracker for active encounters

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (Campaign: [Name] > Encounters > [Encounter Name])       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Encounter Header                                             │ │
│ │ - Name, Status (Planning/Active/Paused/Completed)           │ │
│ │ - Round Counter, Current Turn                                │ │
│ │ - Actions: Start Combat, Pause, End Encounter               │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌──────────────────────┬──────────────────────────────────────┐ │
│ │ INITIATIVE TRACKER   │ PARTICIPANT DETAILS                   │ │
│ │                       │                                       │ │
│ │ Round 3               │ ┌─────────────────────────────────┐ │ │
│ │ ─────────────────     │ │ Selected: Street Samurai        │ │ │
│ │ ► 24 - Street Sam     │ │ Initiative: 24 (12+3d6)          │ │ │
│ │   22 - Grunt Team A   │ │ Actions: ○○ Simple ○ Complex    │ │ │
│ │   19 - Decker         │ │                                   │ │ │
│ │   17 - Lieutenant     │ │ Condition Monitor:                │ │ │
│ │   15 - Mage           │ │ Physical: [■■■□□□□□□□] 3/10     │ │ │
│ │   12 - Grunt Team B   │ │ Stun:     [■□□□□□□□□□] 1/10     │ │ │
│ │                       │ │                                   │ │ │
│ │ [Roll Initiative]     │ │ [Apply Damage] [Spend Edge]      │ │ │
│ │ [Next Turn]           │ └─────────────────────────────────┘ │ │
│ │ [End Round]           │                                       │ │
│ └──────────────────────┴──────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Combat Log (collapsible)                                     │ │
│ │ [R3] Street Samurai attacks Grunt #2 - 4 hits, 6P damage    │ │
│ │ [R3] Grunt #2 takes 6P damage, incapacitated                │ │
│ │ [R2] Mage casts Stunball - 3 hits, 8S damage to area        │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Model

### Encounter Type

```typescript
/**
 * Encounter status
 */
export type EncounterStatus =
  | "planning" // Setting up, not yet started
  | "active" // Combat in progress
  | "paused" // Temporarily stopped (between sessions)
  | "completed" // Finished
  | "abandoned"; // Cancelled without completion

/**
 * Encounter type/category
 */
export type EncounterType =
  | "combat" // Standard combat encounter
  | "social" // Social encounter (negotiations, interrogations)
  | "stealth" // Infiltration/stealth encounter
  | "chase" // Vehicle/foot chase
  | "matrix" // Matrix-focused encounter
  | "astral" // Astral combat/exploration
  | "mixed"; // Multiple types

/**
 * A campaign encounter
 */
export interface Encounter {
  id: ID;
  campaignId: ID;

  /** Encounter metadata */
  name: string;
  description?: string;
  type: EncounterType;
  status: EncounterStatus;

  /** Link to session (optional) */
  sessionId?: ID;

  /** Link to location (optional) */
  locationId?: ID;

  // -------------------------------------------------------------------------
  // Participants
  // -------------------------------------------------------------------------

  /** Player characters in this encounter */
  pcParticipants: PCParticipant[];

  /** NPC/Grunt teams in this encounter */
  npcParticipants: NPCParticipant[];

  // -------------------------------------------------------------------------
  // Combat State
  // -------------------------------------------------------------------------

  /** Current combat round (0 = not started) */
  currentRound: number;

  /** Index of current participant in initiative order */
  currentTurnIndex: number;

  /** Calculated initiative order */
  initiativeOrder: InitiativeEntry[];

  /** Whether initiative has been rolled this encounter */
  initiativeRolled: boolean;

  // -------------------------------------------------------------------------
  // Environment
  // -------------------------------------------------------------------------

  /** Environmental modifiers */
  environment?: EncounterEnvironment;

  // -------------------------------------------------------------------------
  // Difficulty & Rewards
  // -------------------------------------------------------------------------

  /** Calculated difficulty rating */
  difficultyRating?: DifficultyRating;

  /** Suggested karma reward */
  suggestedKarma?: number;

  /** Actual karma awarded (after completion) */
  karmaAwarded?: number;

  /** Whether rewards have been distributed */
  rewardsDistributed: boolean;

  // -------------------------------------------------------------------------
  // Metadata
  // -------------------------------------------------------------------------

  createdAt: ISODateString;
  updatedAt: ISODateString;
  startedAt?: ISODateString;
  completedAt?: ISODateString;

  /** GM notes (private) */
  gmNotes?: string;

  /** Extensible metadata */
  metadata?: Metadata;
}
```

### Participant Types

```typescript
/**
 * Player character participant in an encounter
 */
export interface PCParticipant {
  id: ID;
  characterId: ID;
  characterName: string;
  playerId: ID;

  /** Current state in this encounter */
  state: ParticipantState;

  /** Snapshot of relevant stats at encounter start */
  statsSnapshot?: {
    initiative: { base: number; dice: number };
    physicalMonitor: number;
    stunMonitor: number;
    armor: number;
  };
}

/**
 * NPC participant (individual or team reference)
 */
export interface NPCParticipant {
  id: ID;

  /** Reference to grunt team (if using team) */
  gruntTeamId?: ID;

  /** Inline NPC stats (if not using grunt team) */
  inlineNPC?: InlineNPC;

  /** Display name */
  name: string;

  /** Whether this is a group or individual */
  isGroup: boolean;

  /** Current state in this encounter */
  state: ParticipantState;

  /** GM visibility setting */
  visibleToPlayers: boolean;

  /** Stats visible to players */
  statsVisibleToPlayers: boolean;
}

/**
 * Inline NPC definition (for quick NPCs without full grunt team)
 */
export interface InlineNPC {
  /** Professional rating equivalent */
  professionalRating: number;

  /** Key attributes */
  attributes: {
    body: number;
    agility: number;
    reaction: number;
    strength: number;
    willpower: number;
    intuition: number;
  };

  /** Key skills */
  skills: Record<string, number>;

  /** Initiative dice */
  initiativeDice: number;

  /** Condition monitor size */
  conditionMonitorSize: number;

  /** Armor rating */
  armor: number;

  /** Primary weapon damage */
  weaponDamage?: string;
}

/**
 * Current state of a participant in the encounter
 */
export interface ParticipantState {
  /** Whether participant is active in combat */
  isActive: boolean;

  /** Current initiative score */
  initiative: number;

  /** Initiative passes remaining this round */
  initiativePassesRemaining: number;

  /** Current physical damage */
  physicalDamage: number;

  /** Current stun damage */
  stunDamage: number;

  /** Status conditions */
  conditions: StatusCondition[];

  /** Edge spent this encounter */
  edgeSpent: number;

  /** Actions taken this turn */
  actionsThisTurn: {
    free: number;
    simple: number;
    complex: number;
  };

  /** Notes for this participant */
  notes?: string;
}

/**
 * Status conditions that affect a participant
 */
export type StatusCondition =
  | "prone"
  | "running"
  | "wounded"
  | "stunned"
  | "unconscious"
  | "dead"
  | "surprised"
  | "cover_partial"
  | "cover_full"
  | "invisible"
  | "hidden"
  | "grappled"
  | "on_fire"
  | "blinded"
  | "deafened";
```

### Initiative Types

```typescript
/**
 * Entry in the initiative order
 */
export interface InitiativeEntry {
  /** Reference to participant */
  participantId: ID;
  participantType: "pc" | "npc";

  /** Display name */
  name: string;

  /** Initiative score */
  initiative: number;

  /** Current initiative pass (1, 2, 3, etc.) */
  currentPass: number;

  /** Whether this entry has acted this pass */
  hasActed: boolean;

  /** Whether participant is still active */
  isActive: boolean;

  /** Edge used on initiative */
  seizedInitiative: boolean;
}

/**
 * Initiative roll result
 */
export interface InitiativeRollResult {
  participantId: ID;
  base: number;
  diceRolled: number[];
  total: number;
  seizedInitiative: boolean;
}
```

### Environment Types

```typescript
/**
 * Environmental modifiers for the encounter
 */
export interface EncounterEnvironment {
  /** Lighting conditions */
  lighting: "bright" | "dim" | "dark" | "pitch_black";

  /** Visibility modifiers */
  visibility?: {
    smoke: boolean;
    fog: boolean;
    rain: boolean;
    dust: boolean;
  };

  /** Background count (for magic) */
  backgroundCount?: number;

  /** Noise level (for stealth/perception) */
  noiseLevel?: "quiet" | "normal" | "loud" | "deafening";

  /** Terrain type */
  terrain?: "open" | "cluttered" | "confined" | "urban" | "wilderness";

  /** Custom modifiers */
  customModifiers?: Array<{
    name: string;
    effect: string;
    diceModifier?: number;
  }>;
}
```

### Difficulty & Rewards

```typescript
/**
 * Difficulty rating calculation
 */
export interface DifficultyRating {
  /** Overall difficulty tier */
  tier: "trivial" | "easy" | "medium" | "hard" | "deadly";

  /** Numeric score */
  score: number;

  /** Breakdown */
  factors: {
    /** Total NPC threat points */
    npcThreat: number;
    /** Average Professional Rating of NPCs */
    averagePR: number;
    /** Number ratio (NPCs vs PCs) */
    numberRatio: number;
    /** Environmental modifiers */
    environmentModifier: number;
  };

  /** Suggested karma range */
  suggestedKarmaRange: { min: number; max: number };
}

/**
 * Encounter outcome for reward calculation
 */
export interface EncounterOutcome {
  /** How the encounter ended */
  resolution: "victory" | "retreat" | "negotiation" | "escape" | "defeat";

  /** Objectives achieved */
  objectivesCompleted: boolean;

  /** Casualties on player side */
  pcCasualties: number;

  /** NPCs defeated */
  npcsDefeated: number;

  /** Special circumstances */
  bonuses?: Array<{
    reason: string;
    karmaModifier: number;
  }>;

  /** Final karma calculation */
  karmaCalculation: {
    base: number;
    difficultyBonus: number;
    objectiveBonus: number;
    styleBonus: number;
    total: number;
  };
}
```

### Combat Log

```typescript
/**
 * Types of combat log entries
 */
export type CombatLogEntryType =
  | "round_start"
  | "round_end"
  | "turn_start"
  | "turn_end"
  | "attack"
  | "damage"
  | "defense"
  | "spell_cast"
  | "edge_use"
  | "condition_applied"
  | "condition_removed"
  | "participant_added"
  | "participant_removed"
  | "participant_defeated"
  | "initiative_roll"
  | "gm_note";

/**
 * Combat log entry
 */
export interface CombatLogEntry {
  id: ID;
  encounterId: ID;
  timestamp: ISODateString;

  /** Log entry type */
  type: CombatLogEntryType;

  /** Round number when this occurred */
  round: number;

  /** Actor (who did this) */
  actorId?: ID;
  actorName?: string;
  actorType?: "pc" | "npc" | "gm";

  /** Target (who was affected) */
  targetId?: ID;
  targetName?: string;

  /** Human-readable description */
  description: string;

  /** Dice roll details (if applicable) */
  diceRoll?: {
    pool: number;
    hits: number;
    glitch: boolean;
    criticalGlitch: boolean;
    dice: number[];
  };

  /** Damage details (if applicable) */
  damage?: {
    amount: number;
    type: "physical" | "stun";
    resisted: number;
    netDamage: number;
  };

  /** Visibility to players */
  visibleToPlayers: boolean;
}
```

---

## Components

### 1. EncountersPage (Encounters List)

**Location:** `/app/campaigns/[campaignId]/encounters/page.tsx`

**Responsibilities:**

- Fetch and display campaign's encounters
- Filter encounters by status
- Search encounters by name
- Create new encounter action
- Link to encounter detail pages

**State:**

- `encounters: Encounter[]` - All encounters for campaign
- `filterStatus: EncounterStatus | "all"` - Current status filter
- `searchQuery: string` - Search input
- `loading: boolean` - Loading state

**Props:** None (route params provide campaign ID)

---

### 2. EncounterCard

**Location:** `/app/campaigns/[campaignId]/encounters/components/EncounterCard.tsx`

**Description:** Individual encounter display card in list view.

**Features:**

- Encounter name and type
- Status badge (Planning/Active/Paused/Completed)
- Participant count (PCs + NPCs)
- Difficulty badge
- Session link (if any)
- Location link (if any)
- Quick actions (View, Edit, Delete, Start Combat)

**Props:**

```typescript
interface EncounterCardProps {
  encounter: Encounter;
  onView: (encounterId: ID) => void;
  onEdit?: (encounterId: ID) => void;
  onDelete?: (encounterId: ID) => void;
  onStartCombat?: (encounterId: ID) => void;
}
```

---

### 3. EncounterDetailPage

**Location:** `/app/campaigns/[campaignId]/encounters/[encounterId]/page.tsx`

**Responsibilities:**

- Fetch and display encounter details
- Render appropriate tab content
- Handle encounter state transitions
- Check user permissions

**Tabs:**

- **Overview** - Encounter details, participants, difficulty
- **Combat** - Active combat tracker
- **Log** - Combat history
- **Rewards** - Post-encounter rewards

---

### 4. CreateEncounterWizard

**Location:** `/app/campaigns/[campaignId]/encounters/create/components/CreateEncounterWizard.tsx`

**Description:** Step-by-step wizard for creating a new encounter.

**Steps:**

1. **Basic Info** - Name, type, description
2. **Location** - Optional location selection
3. **Player Characters** - Select participating PCs
4. **NPCs** - Add grunt teams or inline NPCs
5. **Environment** - Set environmental modifiers
6. **Review** - Review and create

**Props:**

```typescript
interface CreateEncounterWizardProps {
  campaignId: ID;
  sessionId?: ID;
  onComplete: (encounter: Encounter) => void;
  onCancel: () => void;
}
```

---

### 5. InitiativeTracker

**Location:** `/app/campaigns/[campaignId]/encounters/[encounterId]/components/InitiativeTracker.tsx`

**Description:** Main combat initiative tracking component.

**Features:**

- Ordered list of all participants by initiative
- Current turn indicator
- Round counter
- Roll initiative button
- Next turn / End round buttons
- Seize initiative option
- Initiative pass tracking (multiple passes per round)
- Drag-and-drop reordering (GM override)

**Props:**

```typescript
interface InitiativeTrackerProps {
  encounter: Encounter;
  userRole: "gm" | "player";
  onRollInitiative: () => Promise<void>;
  onNextTurn: () => Promise<void>;
  onEndRound: () => Promise<void>;
  onSelectParticipant: (participantId: ID) => void;
  selectedParticipantId?: ID;
}
```

---

### 6. ParticipantPanel

**Location:** `/app/campaigns/[campaignId]/encounters/[encounterId]/components/ParticipantPanel.tsx`

**Description:** Details panel for selected participant.

**Features:**

- Participant name and type
- Initiative score breakdown
- Condition monitors (Physical/Stun)
- Action economy tracker
- Status conditions
- Damage application form
- Edge spending interface
- Quick stats display

**Props:**

```typescript
interface ParticipantPanelProps {
  participant: PCParticipant | NPCParticipant;
  participantState: ParticipantState;
  userRole: "gm" | "player";
  onApplyDamage: (damage: number, type: "physical" | "stun") => Promise<void>;
  onSpendEdge: (amount: number) => Promise<void>;
  onAddCondition: (condition: StatusCondition) => Promise<void>;
  onRemoveCondition: (condition: StatusCondition) => Promise<void>;
  onUpdateActions: (actions: ParticipantState["actionsThisTurn"]) => Promise<void>;
}
```

---

### 7. ConditionMonitorDisplay

**Location:** `/components/combat/ConditionMonitorDisplay.tsx`

**Description:** Visual condition monitor component.

**Features:**

- Boxes display (filled/empty)
- Physical and Stun tracks
- Wound modifier calculation
- Overflow tracking (for Physical)
- Interactive damage marking (GM)
- Color-coded severity

**Props:**

```typescript
interface ConditionMonitorDisplayProps {
  maxPhysical: number;
  maxStun: number;
  currentPhysical: number;
  currentStun: number;
  editable: boolean;
  onDamageChange?: (physical: number, stun: number) => void;
}
```

---

### 8. DamageApplicationForm

**Location:** `/components/combat/DamageApplicationForm.tsx`

**Description:** Form for applying damage to a participant.

**Features:**

- Damage amount input
- Damage type selector (Physical/Stun)
- Armor/resistance input
- Net damage calculation
- Apply button

**Props:**

```typescript
interface DamageApplicationFormProps {
  targetName: string;
  targetArmor?: number;
  onApply: (damage: number, type: "physical" | "stun") => Promise<void>;
}
```

---

### 9. CombatLogPanel

**Location:** `/app/campaigns/[campaignId]/encounters/[encounterId]/components/CombatLogPanel.tsx`

**Description:** Combat log display component.

**Features:**

- Chronological list of combat events
- Filter by type (attacks, damage, spells, etc.)
- Filter by round
- Color-coded entries
- Dice roll details expansion
- Export log option

**Props:**

```typescript
interface CombatLogPanelProps {
  encounterId: ID;
  entries: CombatLogEntry[];
  userRole: "gm" | "player";
  onAddNote?: (note: string) => Promise<void>;
}
```

---

### 10. EncounterRewardsTab

**Location:** `/app/campaigns/[campaignId]/encounters/[encounterId]/components/EncounterRewardsTab.tsx`

**Description:** Post-encounter reward distribution interface.

**Features:**

- Difficulty summary
- Suggested karma display
- Outcome selection (victory, retreat, etc.)
- Bonus karma modifiers
- Final karma calculation
- Distribute rewards button
- Link to session rewards

**Props:**

```typescript
interface EncounterRewardsTabProps {
  encounter: Encounter;
  outcome?: EncounterOutcome;
  onCalculateRewards: (outcome: Partial<EncounterOutcome>) => Promise<void>;
  onDistributeRewards: () => Promise<void>;
}
```

---

### 11. AddParticipantDialog

**Location:** `/components/combat/AddParticipantDialog.tsx`

**Description:** Dialog for adding participants to an encounter.

**Features:**

- Tab: Campaign Characters (PCs)
- Tab: Grunt Teams (NPCs)
- Tab: Quick NPC (inline definition)
- Search and filter
- Multi-select for batch add
- Preview stats

**Props:**

```typescript
interface AddParticipantDialogProps {
  campaignId: ID;
  existingParticipantIds: ID[];
  onAddPC: (characterId: ID) => Promise<void>;
  onAddNPC: (gruntTeamId: ID) => Promise<void>;
  onAddQuickNPC: (npc: InlineNPC) => Promise<void>;
  onClose: () => void;
}
```

---

### 12. EnvironmentPanel

**Location:** `/components/combat/EnvironmentPanel.tsx`

**Description:** Environmental modifiers display and editor.

**Features:**

- Lighting selector
- Visibility toggles
- Background count input
- Noise level selector
- Custom modifier list
- Modifier effect summary

**Props:**

```typescript
interface EnvironmentPanelProps {
  environment: EncounterEnvironment;
  editable: boolean;
  onChange?: (environment: EncounterEnvironment) => void;
}
```

---

## API Endpoints

### Encounter CRUD

#### 1. GET `/api/campaigns/[campaignId]/encounters`

**Purpose:** List all encounters for a campaign

**Query Parameters:**

- `status?: EncounterStatus` - Filter by status
- `sessionId?: ID` - Filter by session
- `locationId?: ID` - Filter by location
- `search?: string` - Search by name

**Response:**

```typescript
{
  success: boolean;
  encounters: Encounter[];
  error?: string;
}
```

---

#### 2. GET `/api/encounters/[encounterId]`

**Purpose:** Get detailed encounter information

**Response:**

```typescript
{
  success: boolean;
  encounter: Encounter;
  combatLog?: CombatLogEntry[];
  error?: string;
}
```

---

#### 3. POST `/api/campaigns/[campaignId]/encounters`

**Purpose:** Create a new encounter

**Request:**

```typescript
{
  name: string;
  description?: string;
  type: EncounterType;
  sessionId?: ID;
  locationId?: ID;
  pcParticipants?: Array<{ characterId: ID }>;
  npcParticipants?: Array<{ gruntTeamId?: ID; inlineNPC?: InlineNPC; name: string }>;
  environment?: EncounterEnvironment;
  gmNotes?: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  encounter?: Encounter;
  error?: string;
}
```

---

#### 4. PUT `/api/encounters/[encounterId]`

**Purpose:** Update encounter details (GM-only)

**Request:**

```typescript
{
  name?: string;
  description?: string;
  type?: EncounterType;
  sessionId?: ID;
  locationId?: ID;
  environment?: EncounterEnvironment;
  gmNotes?: string;
}
```

---

#### 5. DELETE `/api/encounters/[encounterId]`

**Purpose:** Delete an encounter (GM-only)

---

### Combat State Management

#### 6. POST `/api/encounters/[encounterId]/start`

**Purpose:** Start combat (transition from planning to active)

**Response:**

```typescript
{
  success: boolean;
  encounter?: Encounter;
  error?: string;
}
```

---

#### 7. POST `/api/encounters/[encounterId]/initiative/roll`

**Purpose:** Roll initiative for all participants

**Request:**

```typescript
{
  reroll?: boolean;  // Whether to reroll existing initiative
}
```

**Response:**

```typescript
{
  success: boolean;
  results: InitiativeRollResult[];
  initiativeOrder: InitiativeEntry[];
  error?: string;
}
```

---

#### 8. POST `/api/encounters/[encounterId]/initiative/seize`

**Purpose:** Use Edge to seize initiative

**Request:**

```typescript
{
  participantId: ID;
}
```

---

#### 9. POST `/api/encounters/[encounterId]/turn/next`

**Purpose:** Advance to next turn

**Response:**

```typescript
{
  success: boolean;
  currentTurnIndex: number;
  currentRound: number;
  nextParticipant: InitiativeEntry;
  error?: string;
}
```

---

#### 10. POST `/api/encounters/[encounterId]/round/end`

**Purpose:** End current round and start new round

**Response:**

```typescript
{
  success: boolean;
  currentRound: number;
  initiativeOrder: InitiativeEntry[];  // Reset for new round
  error?: string;
}
```

---

### Participant Management

#### 11. POST `/api/encounters/[encounterId]/participants`

**Purpose:** Add a participant mid-encounter

**Request:**

```typescript
{
  type: "pc" | "npc";
  characterId?: ID;      // For PCs
  gruntTeamId?: ID;      // For NPCs (team reference)
  inlineNPC?: InlineNPC; // For NPCs (inline)
  name: string;
  initiative?: number;   // Optional: join at specific initiative
}
```

---

#### 12. DELETE `/api/encounters/[encounterId]/participants/[participantId]`

**Purpose:** Remove a participant from encounter

---

#### 13. PATCH `/api/encounters/[encounterId]/participants/[participantId]/state`

**Purpose:** Update participant state

**Request:**

```typescript
{
  isActive?: boolean;
  initiative?: number;
  physicalDamage?: number;
  stunDamage?: number;
  conditions?: StatusCondition[];
  edgeSpent?: number;
  actionsThisTurn?: ParticipantState["actionsThisTurn"];
  notes?: string;
}
```

---

#### 14. POST `/api/encounters/[encounterId]/participants/[participantId]/damage`

**Purpose:** Apply damage to a participant

**Request:**

```typescript
{
  damage: number;
  damageType: "physical" | "stun";
  source?: string;  // For combat log
}
```

**Response:**

```typescript
{
  success: boolean;
  participantState: ParticipantState;
  isDefeated: boolean;
  combatLogEntry: CombatLogEntry;
  error?: string;
}
```

---

### Combat Log

#### 15. GET `/api/encounters/[encounterId]/log`

**Purpose:** Get combat log entries

**Query Parameters:**

- `round?: number` - Filter by round
- `type?: CombatLogEntryType` - Filter by type
- `limit?: number` - Pagination
- `offset?: number` - Pagination

**Response:**

```typescript
{
  success: boolean;
  entries: CombatLogEntry[];
  total: number;
  error?: string;
}
```

---

#### 16. POST `/api/encounters/[encounterId]/log`

**Purpose:** Add a GM note to combat log

**Request:**

```typescript
{
  description: string;
  visibleToPlayers: boolean;
}
```

---

### Encounter Completion

#### 17. POST `/api/encounters/[encounterId]/complete`

**Purpose:** End encounter and calculate rewards

**Request:**

```typescript
{
  resolution: EncounterOutcome["resolution"];
  objectivesCompleted: boolean;
  bonuses?: EncounterOutcome["bonuses"];
}
```

**Response:**

```typescript
{
  success: boolean;
  encounter?: Encounter;
  outcome?: EncounterOutcome;
  suggestedKarma?: number;
  error?: string;
}
```

---

#### 18. POST `/api/encounters/[encounterId]/rewards/distribute`

**Purpose:** Distribute karma rewards to participants

**Request:**

```typescript
{
  karma: number;
  characterIds?: ID[];  // Optional: specific characters (default: all PCs)
  linkToSession?: boolean;  // Add to session rewards
}
```

**Response:**

```typescript
{
  success: boolean;
  karmaTransactions: KarmaTransaction[];
  error?: string;
}
```

---

## Storage Layer

**File Structure:**

```
data/
├── encounters/
│   └── {campaignId}/
│       └── {encounterId}.json    # Encounter data
├── combat-logs/
│   └── {encounterId}.json        # Combat log entries
└── encounter-templates/
    ├── system/                    # Pre-built templates
    │   └── {templateId}.json
    └── {userId}/                  # User templates
        └── {templateId}.json
```

**Functions needed in `/lib/storage/encounters.ts`:**

```typescript
// CRUD operations
export function createEncounter(
  campaignId: ID,
  encounter: Omit<Encounter, "id" | "createdAt">
): Encounter;
export function getEncounterById(encounterId: ID): Encounter | null;
export function updateEncounter(encounterId: ID, updates: Partial<Encounter>): Encounter;
export function deleteEncounter(encounterId: ID): void;

// Query operations
export function getEncountersByCampaign(campaignId: ID, filters?: EncounterFilters): Encounter[];
export function getEncountersBySession(sessionId: ID): Encounter[];
export function getActiveEncounters(campaignId: ID): Encounter[];

// Participant management
export function addParticipant(
  encounterId: ID,
  participant: PCParticipant | NPCParticipant
): Encounter;
export function removeParticipant(encounterId: ID, participantId: ID): Encounter;
export function updateParticipantState(
  encounterId: ID,
  participantId: ID,
  state: Partial<ParticipantState>
): Encounter;

// Combat state
export function rollInitiative(encounterId: ID): InitiativeRollResult[];
export function advanceTurn(encounterId: ID): Encounter;
export function endRound(encounterId: ID): Encounter;

// Combat log
export function addCombatLogEntry(entry: Omit<CombatLogEntry, "id" | "timestamp">): CombatLogEntry;
export function getCombatLog(encounterId: ID, options?: LogQueryOptions): CombatLogEntry[];
```

**Functions needed in `/lib/rules/combat.ts`:**

```typescript
// Initiative
export function calculateInitiative(
  reaction: number,
  intuition: number,
  modifiers?: number
): { base: number; dice: number };
export function rollInitiativeDice(dice: number): number[];
export function sortInitiativeOrder(entries: InitiativeEntry[]): InitiativeEntry[];

// Damage
export function applyDamage(
  state: ParticipantState,
  damage: number,
  type: "physical" | "stun",
  monitorSize: number
): ParticipantState;
export function calculateWoundModifier(physicalDamage: number, stunDamage: number): number;
export function isDefeated(
  state: ParticipantState,
  physicalMonitor: number,
  stunMonitor: number
): boolean;

// Difficulty
export function calculateDifficultyRating(encounter: Encounter): DifficultyRating;
export function calculateSuggestedKarma(
  difficulty: DifficultyRating,
  outcome: EncounterOutcome
): number;

// Action economy
export function resetActionsForTurn(state: ParticipantState): ParticipantState;
export function canTakeAction(
  state: ParticipantState,
  actionType: "free" | "simple" | "complex"
): boolean;
```

---

## Difficulty Calculation

### Threat Points System

Each NPC contributes threat points based on Professional Rating:

| Professional Rating | Threat Points |
| ------------------- | ------------- |
| 0 (Untrained)       | 0.5           |
| 1 (Inexperienced)   | 1             |
| 2 (Regular)         | 2             |
| 3 (Experienced)     | 3             |
| 4 (Veteran)         | 5             |
| 5 (Elite)           | 8             |
| 6 (Prime)           | 12            |

**Modifiers:**

- Lieutenant: +2 threat points
- Specialist: +1 threat point each
- Magic-capable: +2 threat points
- Group size > 4: +1 per additional grunt

### Difficulty Tiers

| Tier    | Threat/PC Ratio | Suggested Karma |
| ------- | --------------- | --------------- |
| Trivial | < 1             | 1               |
| Easy    | 1-2             | 2               |
| Medium  | 2-4             | 3-4             |
| Hard    | 4-6             | 5-6             |
| Deadly  | > 6             | 7+              |

### Karma Calculation Formula

```
Base Karma = Difficulty Tier Base
+ Objective Bonus (0-2 if objectives completed)
+ Style Bonus (0-2 for creative solutions, minimal casualties)
+ Environment Bonus (0-1 for harsh conditions)
- Retreat Penalty (-1 if retreated)
- Defeat Penalty (-2 if defeated)
```

---

## Security Considerations

### Access Control

- **Encounter Creation:** Only GM can create encounters
- **Encounter Viewing:** GM sees all, players see limited (based on visibility settings)
- **Combat State Changes:** Only GM can modify combat state
- **Damage Application:** Only GM can apply damage
- **NPC Stats:** Controlled by `statsVisibleToPlayers` flag
- **Combat Log:** Some entries GM-only based on `visibleToPlayers`

### Data Validation

- Validate all damage values are non-negative
- Validate initiative scores are reasonable
- Validate participant IDs exist in campaign
- Validate encounter belongs to campaign
- Validate user has GM role for modifications

---

## Integration with Other Systems

### Campaign Integration

- Encounters belong to campaigns
- Encounters can link to sessions
- Encounter karma flows to session rewards
- Campaign NPCs tab shows encounter-linked grunt teams

### Character Integration

- PC participants reference campaign characters
- Character condition carries between encounters (optional)
- Character karma updated from encounter rewards

### Session Integration

- Sessions can have multiple encounters
- Session karma includes encounter rewards
- Session recap can reference encounters

### Location Integration

- Encounters can be set at campaign locations
- Location details shown in encounter
- Location modifiers affect environment

---

## Related Documentation

- **Campaign Support:** `/docs/specifications/campaign_support_specification.md`
- **NPCs/Grunts:** `/docs/specifications/npcs_grunts_specification.md`
- **Character Advancement:** `/docs/specifications/character_advancement_specification.md`
- **Locations:** `/docs/specifications/locations_specification.md`
- **Gameplay Actions:** `/docs/specifications/gameplay_actions_specification.md`
- **SR5 Combat Rules:** `/docs/rules/5e/combat.md`

---

## Open Questions

1. **Real-time Updates:** Should combat tracker use WebSockets for real-time updates?
   - **Recommendation:** Start with polling, add WebSockets in Phase 2

2. **Player Actions:** Should players be able to declare actions in the tracker?
   - **Recommendation:** GM-controlled for MVP, add player actions later

3. **Dice Integration:** Should dice rolls happen in-app or be entered manually?
   - **Recommendation:** Manual entry for MVP, integrate dice roller in Phase 2

4. **Concurrent Encounters:** How to handle multiple active encounters?
   - **Recommendation:** Support multiple, but only one "focused" at a time per session

5. **Character State Persistence:** Should damage persist after encounter ends?
   - **Recommendation:** Optional setting - default to reset, allow persistence

6. **Undo Functionality:** Should GMs be able to undo combat actions?
   - **Recommendation:** Phase 2 feature - start without undo

7. **Mobile Support:** Should combat tracker have a mobile-optimized view?
   - **Recommendation:** Yes, essential for at-the-table use

8. **Offline Support:** Should encounter data work offline?
   - **Recommendation:** Future consideration, not MVP

---

## Implementation Priority

**Priority:** Medium-High
**Estimated Effort:** 12-16 days
**Dependencies:**

- Campaign system (complete)
- NPCs/Grunts system (partial)
- Character system (complete)
- Locations system (optional)

**Blockers:** NPCs/Grunts must be at least partially implemented for NPC participants.

This specification enables full combat encounter management, providing GMs with the tools needed to run Shadowrun combat sessions efficiently. It bridges the campaign, character, and NPC systems into a cohesive gameplay experience.

---

## Notes

- Encounter system is central to gameplay loop
- Combat tracker is high-visibility, high-use feature
- Performance critical for real-time combat
- Mobile support essential for table use
- Consider VTT integrations (Foundry, Roll20) as future export targets
- Edition-specific combat rules should be data-driven from ruleset
