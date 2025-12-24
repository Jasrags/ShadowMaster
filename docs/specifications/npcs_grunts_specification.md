> [!NOTE]
> This implementation guide is governed by the [Capability (campaign.npc-governance.md)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/campaign.npc-governance.md).

# NPCs (Grunts) Specification

**Last Updated:** 2025-01-27  
**Status:** Specification  
**Category:** Gameplay, NPC Management, Combat Tracking  
**Affected Editions:** SR5 (primary), other editions may vary

---

## Overview

This document specifies the implementation requirements for supporting Non-Player Characters (NPCs), specifically **Grunts**, in Shadow Master. Grunts are simplified NPCs designed for quick combat encounters and streamlined gameplay management. They represent nameless antagonists (go-gangs, security teams, etc.) that can be managed as groups rather than individuals.

**Key Features:**
- Simplified condition tracking (single monitor for Physical and Stun damage)
- Group management with shared attributes, skills, and Edge pool
- Professional Rating system (0-6) determining team quality and morale
- Optional lieutenants (enhanced team leaders)
- Optional specialists (1-2 per team with unique gear/abilities)
- Campaign and encounter integration
- Combat tracking and damage application
- Optional "mowing them down" simplified rules for faster combat

**Source Material:** Shadowrun 5th Edition Core Rulebook, Chapter: NPCs and Critters

---


## Page Structure

### Routes

#### Grunt Teams List Page
- **Path:** `/app/campaigns/[campaignId]/grunt-teams/page.tsx`
- **Layout:** Uses `AuthenticatedLayout` (inherits sidebar navigation)
- **Authentication:** Required (protected route)
- **Description:** Lists all grunt teams for a campaign

#### Grunt Team Detail Page
- **Path:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Shows grunt team details, stats, and combat tracker

#### Create Grunt Team Page
- **Path:** `/app/campaigns/[campaignId]/grunt-teams/create/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route, GM-only)
- **Description:** Wizard/form for creating a new grunt team

#### Combat Tracker Page
- **Path:** `/app/campaigns/[campaignId]/encounters/[encounterId]/combat/page.tsx`
- **Layout:** Uses `AuthenticatedLayout`
- **Authentication:** Required (protected route)
- **Description:** Combat encounter tracker with grunt teams and PCs

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (from AuthenticatedLayout)                                │
├──────────┬──────────────────────────────────────────────────────┤
│ SIDEBAR   │ MAIN CONTENT AREA                                    │
│ (nav)     │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Grunt Team Header                                │ │
│           │ │ - Team Name, Professional Rating                 │ │
│           │ │ - Campaign/Encounter Link                        │ │
│           │ │ - Actions (Edit, Delete, Duplicate)             │ │
│           │ └─────────────────────────────────────────────────┘ │
│           │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Grunt Team Navigation Tabs                      │ │
│           │ │ - Stats | Combat Tracker | Templates            │ │
│           │ └─────────────────────────────────────────────────┘ │
│           │                                                       │
│           │ ┌─────────────────────────────────────────────────┐ │
│           │ │ Active Tab Content                                │ │
│           │ │ (Stats/Combat Tracker/Templates)                  │ │
│           │ └─────────────────────────────────────────────────┘ │
└───────────┴──────────────────────────────────────────────────────┘
```

---

## Data Model

### GruntTeam Type

```typescript
/**
 * A team of grunts with shared statistics
 */
export interface GruntTeam {
  id: ID;
  
  /** Campaign or encounter this team belongs to */
  campaignId?: ID;
  encounterId?: ID;
  
  /** Team metadata */
  name: string; // e.g., "Knight Errant Patrol", "Halloweeners Gang"
  description?: string;
  
  /** Professional Rating (0-6) */
  professionalRating: number; // 0-6
  
  /** Group Edge pool (equals Professional Rating) */
  groupEdge: number;
  groupEdgeMax: number; // Usually equals professionalRating
  
  /** Base grunt statistics (shared by all grunts in team) */
  baseGrunts: GruntStats;
  
  /** Optional lieutenant (enhanced grunt) */
  lieutenant?: LieutenantStats;
  
  /** Optional specialists (1-2 per team) */
  specialists?: GruntSpecialist[];
  
  /** Current team state */
  state: {
    /** Number of active grunts remaining */
    activeCount: number;
    
    /** Number of grunts taken out */
    casualties: number;
    
    /** Current group initiative (if using group initiative) */
    groupInitiative?: number;
    
    /** Whether team has broken/morale failed */
    moraleBroken: boolean;
  };
  
  /** Optional rules flags */
  options?: {
    /** Use group initiative (default: true) */
    useGroupInitiative?: boolean;
    
    /** Use "mowing them down" simplified rules */
    useSimplifiedRules?: boolean;
  };
  
  createdAt: ISODateString;
  updatedAt?: ISODateString;
  
  /** Extensible metadata */
  metadata?: Metadata;
}
```

### GruntStats Type

```typescript
/**
 * Base statistics shared by all grunts in a team
 */
export interface GruntStats {
  /** Core attributes */
  attributes: {
    body: number;
    agility: number;
    reaction: number;
    strength: number;
    willpower: number;
    logic: number;
    intuition: number;
    charisma: number;
  };
  
  /** Special attributes */
  essence: number;
  magic?: number; // If awakened
  resonance?: number; // If emerged
  
  /** Active skills (keyed by skill name/code) */
  skills: Record<string, number>; // e.g., { "firearms": 4, "unarmed": 3 }
  
  /** Knowledge skills (optional) */
  knowledgeSkills?: Record<string, number>;
  
  /** Qualities (positive and negative) */
  positiveQualities?: string[];
  negativeQualities?: string[];
  
  /** Equipment (standard loadout) */
  gear: GearItem[];
  weapons: Weapon[];
  armor: ArmorItem[];
  
  /** Augmentations (if any) */
  cyberware?: CyberwareItem[];
  bioware?: BiowareItem[];
  
  /** Magic/Resonance (if applicable) */
  magicalPath?: MagicalPath;
  spells?: string[];
  adeptPowers?: AdeptPower[];
  complexForms?: string[];
  
  /** Condition monitor size (calculated: 8 + ceil(max(Body, Willpower) / 2)) */
  conditionMonitorSize: number;
}
```

### LieutenantStats Type

```typescript
/**
 * Enhanced grunt with individual statistics
 * Attributes should total at least 4 higher than base grunts
 * Active skills should total at least 4 higher than base grunts
 */
export interface LieutenantStats extends GruntStats {
  /** Leadership skill rating (if present) */
  leadershipSkill?: number;
  
  /** Can use Leadership to boost team Professional Rating by +1 */
  canBoostProfessionalRating: boolean;
  
  /** Makes own initiative test (doesn't use group initiative) */
  usesIndividualInitiative: boolean;
}
```

### GruntSpecialist Type

```typescript
/**
 * Specialist grunt with unique gear/abilities
 * Limit 1-2 specialists per team
 */
export interface GruntSpecialist {
  id: ID;
  
  /** Type of specialist */
  type: string; // e.g., "street-witch", "assault-rifle", "technomancer"
  
  /** Description of specialization */
  description: string;
  
  /** Modified stats from base grunt */
  statModifications?: {
    attributes?: Partial<GruntStats["attributes"]>;
    skills?: Partial<GruntStats["skills"]>;
    gear?: GearItem[];
    weapons?: Weapon[];
  };
  
  /** Makes own initiative test (if augmented) */
  usesIndividualInitiative?: boolean;
}
```

### IndividualGrunts Type (Runtime Tracking)

```typescript
/**
 * For combat tracking, individual grunts may need separate condition tracking
 */
export interface IndividualGrunts {
  /** Map of grunt IDs to their individual condition */
  grunts: Map<ID, {
    conditionMonitor: boolean[]; // Array of boxes (filled = true, empty = false)
    currentDamage: number;
    isStunned: boolean;
    isDead: boolean;
    lastDamageType?: "physical" | "stun";
    initiative?: number; // If using individual initiative (injury modifiers)
  }>;
  
  /** Lieutenant condition (if present) */
  lieutenant?: {
    conditionMonitor: boolean[];
    currentDamage: number;
    isStunned: boolean;
    isDead: boolean;
    lastDamageType?: "physical" | "stun";
    initiative: number;
  };
  
  /** Specialist conditions (if present) */
  specialists?: Map<ID, {
    conditionMonitor: boolean[];
    currentDamage: number;
    isStunned: boolean;
    isDead: boolean;
    lastDamageType?: "physical" | "stun";
    initiative?: number;
  }>;
}
```

### SimplifiedGruntsRules Type

```typescript
/**
 * Optional simplified rules for faster combat
 */
export interface SimplifiedGruntsRules {
  /** Single wound takes grunt down */
  oneHitKill: boolean;
  
  /** All rolls against grunts are unopposed */
  unopposedRolls: boolean;
  
  /** Grunts don't dodge ranged attacks */
  noDodge: boolean;
  
  /** Any hits on Sneaking = automatic surprise */
  autoSurprise: boolean;
  
  /** Grunt ambushes automatically fail */
  ambushFails: boolean;
}
```

---

## Components

### 1. GruntTeamsPage (Grunt Teams List)

**Location:** `/app/campaigns/[campaignId]/grunt-teams/page.tsx`

**Responsibilities:**
- Fetch and display campaign's grunt teams
- Filter teams by Professional Rating
- Search teams by name
- Create new grunt team action
- Link to grunt team detail pages

**State:**
- `teams: GruntTeam[]` - All grunt teams for campaign
- `filterRating: number | "all"` - Current Professional Rating filter
- `searchQuery: string` - Search input
- `loading: boolean` - Loading state
- `error: string | null` - Error state

**Props:** None (route params provide campaign ID)

---

### 2. GruntTeamCard

**Location:** `/app/campaigns/[campaignId]/grunt-teams/components/GruntTeamCard.tsx`

**Description:** Individual grunt team display card in list view.

**Features:**
- Team name and description preview
- Professional Rating badge
- Active count and casualties
- Group Edge pool display
- Quick actions (View, Edit, Delete)
- Link to encounter (if linked)

**Props:**
```typescript
interface GruntTeamCardProps {
  team: GruntTeam;
  onView: (teamId: ID) => void;
  onEdit?: (teamId: ID) => void;
  onDelete?: (teamId: ID) => void;
}
```

---

### 3. GruntTeamDetailPage

**Location:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/page.tsx`

**Responsibilities:**
- Fetch and display grunt team details
- Render appropriate tab content
- Handle user actions (edit, delete, apply damage)
- Check user permissions (GM vs player)

**State:**
- `team: GruntTeam | null` - Grunt team data
- `activeTab: GruntTeamTab` - Currently active tab
- `individualGrunts: IndividualGrunts | null` - Combat tracking state
- `userRole: "gm" | "player" | null` - Current user's role
- `loading: boolean` - Loading state

**Props:** None (route params provide team ID)

---

### 4. GruntTeamHeader

**Location:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/components/GruntTeamHeader.tsx`

**Description:** Grunt team header with name, metadata, and actions.

**Features:**
- Team name and description
- Professional Rating badge
- Campaign/encounter link
- Status indicators (active count, casualties, morale)
- Action buttons (context-aware):
  - GM: Edit, Delete, Duplicate, Export
  - Player: View only

**Props:**
```typescript
interface GruntTeamHeaderProps {
  team: GruntTeam;
  userRole: "gm" | "player" | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}
```

---

### 5. GruntTeamTabs

**Location:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/components/GruntTeamTabs.tsx`

**Description:** Tab navigation for grunt team detail sections.

**Tabs:**
- **Stats** - Base statistics, attributes, skills, gear
- **Combat Tracker** - Condition monitors, damage application, initiative
- **Templates** - Save/load templates (GM-only)

**Props:**
```typescript
interface GruntTeamTabsProps {
  activeTab: GruntTeamTab;
  onTabChange: (tab: GruntTeamTab) => void;
  userRole: "gm" | "player" | null;
}
```

---

### 6. GruntTeamStatsTab

**Location:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/components/GruntTeamStatsTab.tsx`

**Description:** Display grunt team statistics and configuration.

**Sections:**
- Base grunt statistics (attributes, skills, gear)
- Lieutenant statistics (if present)
- Specialist statistics (if present)
- Professional Rating details
- Group Edge pool
- Condition monitor size calculation

**Props:**
```typescript
interface GruntTeamStatsTabProps {
  team: GruntTeam;
  userRole: "gm" | "player";
}
```

---

### 7. GruntTeamCombatTrackerTab

**Location:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/components/GruntTeamCombatTrackerTab.tsx`

**Description:** Combat tracking interface for grunt teams.

**Features:**
- Individual grunt condition monitors
- Damage application interface (amount + type)
- Bulk damage application
- Group Edge spending interface
- Initiative tracker (group + individual)
- Morale status indicator
- Simplified rules toggle (GM-only)

**Props:**
```typescript
interface GruntTeamCombatTrackerTabProps {
  team: GruntTeam;
  individualGrunts: IndividualGrunts;
  userRole: "gm" | "player";
  onApplyDamage: (gruntId: ID, damage: number, damageType: "physical" | "stun") => Promise<void>;
  onSpendEdge: (amount: number, targetId?: ID) => Promise<void>;
  onRollInitiative: () => Promise<void>;
}
```

---

### 8. CreateGruntTeamWizard

**Location:** `/app/campaigns/[campaignId]/grunt-teams/create/components/CreateGruntTeamWizard.tsx`

**Description:** Step-by-step wizard for creating a new grunt team.

**Steps:**
1. **Basic Info** - Name, description, Professional Rating
2. **Template Selection** - Choose from pre-built templates (0-6) or custom
3. **Base Stats** - Attributes, skills, gear (if custom)
4. **Lieutenant** - Add optional lieutenant (GM choice)
5. **Specialists** - Add optional specialists (1-2 max)
6. **Review** - Review all settings and create

**State:**
- `currentStep: number` - Current wizard step
- `formData: Partial<GruntTeam>` - Accumulated form data
- `selectedTemplate?: GruntTemplate` - Selected template
- `validationErrors: Record<string, string>` - Form validation errors

**Props:**
```typescript
interface CreateGruntTeamWizardProps {
  campaignId: ID;
  onComplete: (team: GruntTeam) => void;
  onCancel: () => void;
}
```

---

## Data Requirements

### API Endpoints

#### 1. GET `/api/campaigns/[campaignId]/grunt-teams`

**Purpose:** List all grunt teams for a campaign

**Query Parameters:**
- `encounterId?: ID` - Filter by encounter
- `professionalRating?: number` - Filter by Professional Rating
- `search?: string` - Search teams by name

**Response:**
```typescript
{
  success: boolean;
  teams: GruntTeam[];
  error?: string;
}
```

**Implementation:** New endpoint - query grunt teams where `campaignId = campaignId`

---

#### 2. GET `/api/grunt-teams/[teamId]`

**Purpose:** Get detailed grunt team information

**Response:**
```typescript
{
  success: boolean;
  team: GruntTeam;
  individualGrunts?: IndividualGrunts;
  error?: string;
}
```

**Implementation:** New endpoint - return grunt team and optional combat tracking state

---

#### 3. POST `/api/campaigns/[campaignId]/grunt-teams`

**Purpose:** Create a new grunt team

**Request:**
```typescript
{
  name: string;
  description?: string;
  professionalRating: number;
  baseGrunts: GruntStats;
  lieutenant?: LieutenantStats;
  specialists?: GruntSpecialist[];
  encounterId?: ID;
  options?: GruntTeam["options"];
}
```

**Response:**
```typescript
{
  success: boolean;
  team?: GruntTeam;
  error?: string;
}
```

**Implementation:** New endpoint - create grunt team, set `campaignId`, initialize state

**Validation:**
- Name required (1-100 characters)
- Professional Rating must be 0-6
- Base grunts must have valid attributes
- Specialists limited to 2 per team
- Lieutenant stats must be +4 over base grunts

---

#### 4. PUT `/api/grunt-teams/[teamId]`

**Purpose:** Update grunt team (GM-only)

**Request:**
```typescript
{
  name?: string;
  description?: string;
  professionalRating?: number;
  baseGrunts?: Partial<GruntStats>;
  lieutenant?: LieutenantStats;
  specialists?: GruntSpecialist[];
  options?: GruntTeam["options"];
}
```

**Response:**
```typescript
{
  success: boolean;
  team?: GruntTeam;
  error?: string;
}
```

**Implementation:** New endpoint - verify user is GM, update allowed fields

---

#### 5. DELETE `/api/grunt-teams/[teamId]`

**Purpose:** Delete a grunt team (GM-only)

**Request:** None (team ID from route)

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Implementation:** New endpoint - verify user is GM, delete team

---

#### 6. PATCH `/api/grunt-teams/[teamId]/state`

**Purpose:** Update grunt team combat state

**Request:**
```typescript
{
  activeCount?: number;
  casualties?: number;
  groupInitiative?: number;
  moraleBroken?: boolean;
  groupEdge?: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  team?: GruntTeam;
  error?: string;
}
```

**Implementation:** New endpoint - update team state, check morale thresholds

---

#### 7. POST `/api/grunt-teams/[teamId]/grunts/[gruntId]/damage`

**Purpose:** Apply damage to an individual grunt

**Request:**
```typescript
{
  damage: number;
  damageType: "physical" | "stun";
}
```

**Response:**
```typescript
{
  success: boolean;
  grunt?: IndividualGrunts["grunts"][ID];
  isDead?: boolean;
  isStunned?: boolean;
  error?: string;
}
```

**Implementation:** New endpoint - apply damage, calculate death/stun status, update casualties

---

#### 8. POST `/api/grunt-teams/[teamId]/damage/bulk`

**Purpose:** Apply damage to multiple grunts simultaneously

**Request:**
```typescript
{
  gruntIds: ID[];
  damage: number;
  damageType: "physical" | "stun";
}
```

**Response:**
```typescript
{
  success: boolean;
  results: Array<{
    gruntId: ID;
    isDead: boolean;
    isStunned: boolean;
  }>;
  error?: string;
}
```

**Implementation:** New endpoint - apply damage to multiple grunts, update team casualties

---

#### 9. POST `/api/grunt-teams/[teamId]/spend-edge`

**Purpose:** Spend Group Edge

**Request:**
```typescript
{
  amount: number;
  targetGruntsId?: ID; // Optional: which grunt benefits
}
```

**Response:**
```typescript
{
  success: boolean;
  team?: GruntTeam;
  error?: string;
}
```

**Implementation:** New endpoint - verify sufficient edge, deduct from pool

---

#### 10. POST `/api/grunt-teams/[teamId]/initiative`

**Purpose:** Roll initiative for grunt team

**Request:**
```typescript
{
  type: "group" | "individual";
  baseInitiative?: number; // Optional base initiative modifier
}
```

**Response:**
```typescript
{
  success: boolean;
  initiative?: number;
  individualInitiatives?: Record<ID, number>;
  error?: string;
}
```

**Implementation:** New endpoint - roll initiative, update team state

---

### Storage Layer

**File Structure:**
```
data/campaigns/{campaignId}/
├── grunt-teams/
│   ├── {teamId}.json
│   └── {teamId}.json
└── encounters/{encounterId}/
    └── grunt-teams/
        └── {teamId}.json
```

**Functions needed in `/lib/storage/grunts.ts`:**

```typescript
// CRUD operations
export function createGruntTeam(
  campaignId: ID,
  team: Omit<GruntTeam, "id" | "createdAt" | "updatedAt">
): GruntTeam;

export function getGruntTeam(teamId: ID): GruntTeam | null;

export function updateGruntTeam(
  teamId: ID,
  updates: Partial<GruntTeam>
): GruntTeam;

export function deleteGruntTeam(teamId: ID): void;

// Query operations
export function getGruntTeamsByCampaign(campaignId: ID): GruntTeam[];

export function getGruntTeamsByEncounter(encounterId: ID): GruntTeam[];

// Combat tracking
export function getIndividualGrunts(teamId: ID): IndividualGrunts | null;

export function updateIndividualGrunts(
  teamId: ID,
  updates: Partial<IndividualGrunts>
): IndividualGrunts;

// Template operations
export function getGruntTemplates(professionalRating?: number): GruntTemplate[];

export function saveGruntTemplate(
  userId: ID,
  template: GruntTemplate
): GruntTemplate;
```

---

## UI/UX Considerations

### Visual Design

- **Consistent with existing UI:** Follow Tailwind CSS patterns and dark mode support
- **Card-based layout:** Grunt team cards with hover effects
- **Badge system:** Professional Rating badges, status badges
- **Condition monitors:** Visual condition monitor display (filled/empty boxes)
- **Responsive design:** Mobile-first, adapts to tablet and desktop
- **Loading states:** Skeleton loaders for async content
- **Error handling:** User-friendly error messages with retry options

### Accessibility

- **Keyboard navigation:** Full keyboard support for all interactive elements
- **Screen readers:** Proper ARIA labels and semantic HTML
- **Focus management:** Clear focus indicators, proper tab order
- **Color contrast:** Meet WCAG AA standards
- **Form labels:** All inputs have associated labels

### User Flow - Creating a Grunt Team

1. GM navigates to campaign grunt teams page
2. GM clicks "Create Grunt Team" button
3. Wizard opens with Basic Info step
4. GM enters name, description, selects Professional Rating
5. GM selects template (or chooses custom)
6. If custom, GM edits base stats (attributes, skills, gear)
7. GM optionally adds lieutenant
8. GM optionally adds specialists (1-2 max)
9. GM reviews all settings
10. Grunt team is created
11. GM is redirected to grunt team detail page

### User Flow - Combat Tracking

1. GM navigates to grunt team combat tracker tab
2. GM sees individual grunt condition monitors
3. GM applies damage to grunt (amount + type)
4. System updates condition monitor, checks for death/stun
5. System updates team casualties count
6. System checks morale thresholds
7. GM can spend Group Edge on grunt actions
8. GM can roll initiative (group or individual)
9. Combat state persists across sessions

---

## Implementation Notes

### File Structure

```
app/campaigns/[campaignId]/grunt-teams/
├── page.tsx                                    # Grunt teams list page
├── create/
│   ├── page.tsx                                # Create grunt team page
│   └── components/
│       ├── CreateGruntTeamWizard.tsx           # Main wizard
│       ├── BasicInfoStep.tsx                   # Step 1
│       ├── TemplateSelectionStep.tsx           # Step 2
│       ├── BaseStatsStep.tsx                   # Step 3
│       ├── LieutenantStep.tsx                 # Step 4
│       ├── SpecialistsStep.tsx                 # Step 5
│       └── ReviewStep.tsx                      # Step 6
├── [teamId]/
│   ├── page.tsx                                # Grunt team detail page
│   └── components/
│       ├── GruntTeamHeader.tsx                 # Team header
│       ├── GruntTeamTabs.tsx                   # Tab navigation
│       ├── GruntTeamStatsTab.tsx               # Stats tab
│       ├── GruntTeamCombatTrackerTab.tsx       # Combat tracker tab
│       ├── ConditionMonitor.tsx                # Condition monitor component
│       ├── DamageApplicationForm.tsx           # Damage input form
│       └── GroupEdgeDisplay.tsx                 # Group Edge display
└── components/
    ├── GruntTeamCard.tsx                       # Team list card
    ├── GruntTeamList.tsx                       # Team list container
    └── ProfessionalRatingBadge.tsx             # Rating badge

lib/storage/
└── grunts.ts                                   # Grunt storage layer

lib/types/
└── grunts.ts                                   # Grunt type definitions

lib/rules/
└── grunts.ts                                   # Grunt rules engine (condition monitor, morale, etc.)

app/api/grunt-teams/
├── route.ts                                    # GET, POST /api/campaigns/[campaignId]/grunt-teams
├── [teamId]/
│   ├── route.ts                                # GET, PUT, DELETE /api/grunt-teams/[teamId]
│   ├── state/
│   │   └── route.ts                            # PATCH /api/grunt-teams/[teamId]/state
│   ├── grunts/
│   │   └── [gruntId]/
│   │       └── damage/
│   │           └── route.ts                    # POST /api/grunt-teams/[teamId]/grunts/[gruntId]/damage
│   ├── damage/
│   │   └── bulk/
│   │       └── route.ts                        # POST /api/grunt-teams/[teamId]/damage/bulk
│   ├── spend-edge/
│   │   └── route.ts                            # POST /api/grunt-teams/[teamId]/spend-edge
│   └── initiative/
│       └── route.ts                            # POST /api/grunt-teams/[teamId]/initiative

data/editions/sr5/
└── grunt-templates/
    ├── professional-rating-0.json
    ├── professional-rating-1.json
    └── ... (ratings 0-6)
```

### Dependencies

- **Existing:**
  - `@/lib/types` - Type definitions (extend with Grunt types)
  - `@/lib/storage` - Storage layer (add grunts.ts)
  - `@/lib/auth` - Authentication utilities
  - `@/lib/rules` - Rules engine (add grunt-specific rules)
  - `react-aria-components` - UI components
  - `next/navigation` - Routing

- **New:**
  - Grunt type definitions in `/lib/types/grunts.ts`
  - Grunt storage layer in `/lib/storage/grunts.ts`
  - Grunt rules engine in `/lib/rules/grunts.ts`

### State Management

- **Client-side state:** React `useState` for UI state (tabs, form data, combat tracking)
- **Server data:** Fetch via API routes
- **Combat state:** Consider React Context for combat tracking shared across components (future)

### Rules Engine

**Functions needed in `/lib/rules/grunts.ts`:**

```typescript
// Condition monitor calculation
export function calculateGruntsConditionMonitorSize(
  body: number,
  willpower: number
): number;

// Damage application
export function applyDamageToGrunts(
  grunt: IndividualGrunts["grunts"][ID],
  damage: number,
  damageType: "physical" | "stun",
  body: number
): void;

// Morale checks
export function checkMorale(team: GruntTeam): boolean;

// Group Edge management
export function spendGroupEdge(team: GruntTeam, amount: number): boolean;
export function refreshGroupEdge(team: GruntTeam): void;

// Initiative rolling
export function rollGroupInitiative(
  team: GruntTeam,
  baseInitiative: number
): number;
export function rollLieutenantInitiative(
  lieutenant: LieutenantStats,
  baseInitiative: number
): number;

// Lieutenant validation
export function validateLieutenantStats(
  lieutenant: LieutenantStats,
  baseGrunts: GruntStats
): boolean;
export function useLeadershipBoost(
  team: GruntTeam,
  lieutenant: LieutenantStats
): boolean;

// Simplified rules
export function applySimplifiedRules(
  team: GruntTeam,
  rules: SimplifiedGruntsRules
): void;
```

### Validation Rules

**Grunt Team Creation:**
- Name: 1-100 characters, required
- Professional Rating: Must be 0-6
- Base grunts: Must have valid attributes (all 8 attributes)
- Specialists: Maximum 2 per team
- Lieutenant: Stats must be +4 over base grunts (attributes and skills)

**Damage Application:**
- Damage must be positive number
- Damage type must be "physical" or "stun"
- Cannot apply damage to dead grunts

**Group Edge:**
- Cannot spend more edge than available
- Edge refreshes at start of session/scenario

---


## Security Considerations

### Access Control

- **Grunt Team Creation:** Only GM can create grunt teams
- **Grunt Team Editing:** Only GM can modify grunt teams
- **Grunt Team Deletion:** Only GM can delete grunt teams
- **Combat Tracking:** GM can modify combat state, players can view (read-only)
- **Campaign Context:** Grunt teams are campaign-specific, verify campaign membership

### Data Validation

- Validate all user inputs server-side
- Sanitize grunt team names and descriptions
- Validate Professional Rating (0-6)
- Validate attribute ranges (typically 1-6 for grunts)
- Enforce specialist limit (max 2 per team)
- Validate lieutenant stat requirements (+4 over base)

---

## Future Enhancements

### Phase 2: Advanced Combat Features

- Bulk damage application
- Simplified rules toggle
- Visual condition monitor component
- Initiative tracker with turn order
- Group Edge spending interface

### Phase 3: Template System

- Save/load custom grunt team templates
- Template library with sharing
- Template categories and tags
- Import/export templates

### Phase 4: Encounter Integration

- Link grunt teams to specific encounters
- Encounter-based combat tracker
- Multiple grunt teams per encounter
- Encounter statistics tracking

### Phase 5: Prime Runners

- Prime Runner support (using Character type with `isNPC` flag)
- Prime Runner creation wizard
- Prime Runner advancement tracking
- Integration with grunt teams

---

## Related Documentation

- **Architecture:** `/docs/architecture/architecture-overview.md`
- **Campaign Support:** `/docs/specifications/campaign_support_specification.md`
- **Character Sheet:** `/docs/specifications/character_sheet_specification.md`
- **Gameplay Actions:** `/docs/specifications/gameplay_actions_specification.md`
- **Rules Reference:** `/docs/rules/5e/character.md`
- **Source Material:** `/docs/grunts.md`

---

## Open Questions

1. **Individual Tracking:** Should we track individual grunt condition in detail, or use simplified group tracking?
   - **Recommendation:** Support both - default to group tracking, allow individual tracking for important encounters

2. **Encounter Integration:** How should grunt teams integrate with encounter system (if not yet implemented)?
   - **Recommendation:** Start with campaign-only, add encounter links when encounter system is implemented

3. **Template Storage:** Where should grunt templates be stored (edition-specific vs. user-specific)?
   - **Recommendation:** Edition-specific templates in `/data/editions/{editionCode}/grunt-templates/`, user templates in `/data/users/{userId}/grunt-templates/`

4. **Prime Runners:** Should Prime Runners be implemented as part of this feature or separate?
   - **Recommendation:** Separate feature - Prime Runners use Character type, grunts use GruntTeam type

5. **Simplified Rules:** Should simplified rules be team-specific or campaign-wide?
   - **Recommendation:** Team-specific (allows mixing simplified and normal grunts in same encounter)

6. **Group Edge Refresh:** When should Group Edge refresh (start of session, start of encounter, manual)?
   - **Recommendation:** Manual refresh with GM control, default to start of encounter

7. **Morale Automation:** Should morale checks be automatic or manual?
   - **Recommendation:** Automatic checks with manual override option

8. **Death Determination:** Should death determination be automatic or require GM confirmation?
   - **Recommendation:** Automatic with visual indicator, allow GM to override

9. **Bulk Operations:** Should bulk damage apply to all grunts or allow selection?
   - **Recommendation:** Allow selection (checkbox list) for flexibility

10. **Export Format:** What format should grunt team export use (JSON, PDF, printable)?
    - **Recommendation:** Start with JSON, add PDF/printable formats in Phase 2

---

## Implementation Priority

**Priority:** Medium  
**Estimated Effort:** 10-14 days  
**Dependencies:**
- Campaign system (for campaign context)
- Type definitions (extend with Grunt types)
- Storage layer (add grunts.ts)
- Rules engine (add grunt-specific rules)
- UI components (grunt team management)

**Blockers:** None (all infrastructure exists, need to add grunt-specific code)

This feature enables GMs to quickly create and manage NPC opponents for combat encounters, streamlining gameplay and reducing bookkeeping overhead. It provides the foundation for encounter management and combat tracking features.

---

## Notes

- Grunt support is essential for combat encounter management
- Grunts use simplified rules compared to player characters (single condition monitor, Group Edge)
- Professional Rating system provides quick scaling of opponent difficulty
- Template system allows quick creation of common opponent types
- Integration with campaign system ensures proper access control and context
- Future integration with encounter system will enable full combat tracking
- Prime Runners are out of scope for this specification but should use Character type with `isNPC` flag
- Edition support: This specification is based on SR5 rules; other editions may have different mechanics
