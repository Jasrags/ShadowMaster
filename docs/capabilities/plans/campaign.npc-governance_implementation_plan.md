# Implementation Plan: NPC Governance Capability

## Goal Description

Implement the **NPC Governance** capability to provide authoritative lifecycle management for non-player entities within the game environment. This capability ensures ruleset-compliant NPCs, simplified grunt group mechanics, Professional Rating-based behaviors, and auditable state transitions.

**Current State:** The codebase has no NPC infrastructure. Campaign, character, participant governance, and location systems are fully implemented. A detailed specification exists at `/docs/specifications/npcs_grunts_specification.md`.

**Target State:** Full NPC Governance with:

- Complete grunt team data model and type definitions
- Storage layer for grunt team persistence
- Rules engine for condition tracking, morale, and Group Edge
- API endpoints for CRUD and combat operations
- UI components for grunt team management and combat tracking
- Integration with campaign system for visibility control
- Professional Rating templates (0-6) for rapid encounter setup

---

## Architectural Decisions

1. **Grunt vs. Character Separation**
   - **Decision:** Grunts use a separate `GruntTeam` type, not an extension of `Character`
   - **Rationale:** Grunts have fundamentally different mechanics (group Edge, single condition monitor, no advancement)
   - **Capability Reference:** Requirement "Grunt groups MUST share a common statistical foundation"

2. **Storage Structure**
   - **Decision:** Store grunt teams at `/data/campaigns/{campaignId}/grunt-teams/{teamId}.json`
   - **Rationale:** Campaign-scoped, consistent with location storage pattern
   - **Capability Reference:** Constraint "Modification of NPC attributes... MUST be restricted to campaign authorities"

3. **Combat State Tracking**
   - **Decision:** Individual grunt condition tracking stored alongside team data
   - **Rationale:** Supports both group and individual tracking models
   - **Capability Reference:** Requirement "Casualty calculation MUST be automatic"

4. **Template System**
   - **Decision:** Edition-specific templates in `/data/editions/{editionCode}/grunt-templates/`
   - **Rationale:** Templates are ruleset data, not user data
   - **Capability Reference:** Requirement "NPCs MUST be authoritatively defined... strictly compliant with the active campaign ruleset"

5. **Visibility Control**
   - **Decision:** GM-only write access, configurable read access per team
   - **Rationale:** Consistent with campaign authority model
   - **Capability Reference:** Constraint "Participant visibility into NPC capabilities MUST be restricted"

---

## Proposed Changes

### Phase 1: Type Definitions

#### 1.1 Define Grunt Core Types

**File:** `/lib/types/grunts.ts` (NEW)
**References:**

- Capability Guarantee: "NPC entities MUST be authoritatively defined with attributes and skills strictly compliant with the active campaign ruleset"
- Capability Requirement: "Grunt groups MUST share a common statistical foundation while supporting individual casualty markers"

```typescript
// Core interfaces to define:
export interface GruntTeam {
  id: ID;
  campaignId: ID;
  encounterId?: ID;
  name: string;
  description?: string;
  professionalRating: number; // 0-6
  groupEdge: number;
  groupEdgeMax: number;
  baseGrunts: GruntStats;
  lieutenant?: LieutenantStats;
  specialists?: GruntSpecialist[];
  state: GruntTeamState;
  options?: GruntTeamOptions;
  visibility?: GruntVisibility;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
  metadata?: Metadata;
}

export interface GruntStats {
  attributes: CharacterAttributes; // Reuse existing type
  essence: number;
  magic?: number;
  resonance?: number;
  skills: Record<string, number>;
  knowledgeSkills?: Record<string, number>;
  positiveQualities?: string[];
  negativeQualities?: string[];
  gear: GearItem[];
  weapons: Weapon[];
  armor: ArmorItem[];
  cyberware?: CyberwareItem[];
  bioware?: BiowareItem[];
  magicalPath?: MagicalPath;
  spells?: string[];
  adeptPowers?: AdeptPower[];
  complexForms?: string[];
  conditionMonitorSize: number;
}

export interface LieutenantStats extends GruntStats {
  leadershipSkill?: number;
  canBoostProfessionalRating: boolean;
  usesIndividualInitiative: boolean;
}

export interface GruntSpecialist {
  id: ID;
  type: string;
  description: string;
  statModifications?: Partial<GruntStats>;
  usesIndividualInitiative?: boolean;
}

export interface GruntTeamState {
  activeCount: number;
  casualties: number;
  groupInitiative?: number;
  moraleBroken: boolean;
}

export interface GruntTeamOptions {
  useGroupInitiative?: boolean;
  useSimplifiedRules?: boolean;
}

export interface GruntVisibility {
  showToPlayers: boolean;
  revealedStats?: ("attributes" | "skills" | "gear" | "qualities")[];
}
```

#### 1.2 Define Combat Tracking Types

**File:** `/lib/types/grunts.ts`
**References:**

- Capability Requirement: "The system MUST provide an authoritative tracker for NPC condition monitors"
- Capability Requirement: "Initiative resolution MUST support both group-based and individual-based models"

```typescript
export interface IndividualGrunt {
  id: ID;
  conditionMonitor: boolean[];
  currentDamage: number;
  isStunned: boolean;
  isDead: boolean;
  lastDamageType?: "physical" | "stun";
  initiative?: number;
}

export interface IndividualGrunts {
  grunts: Map<ID, IndividualGrunt>;
  lieutenant?: IndividualGrunt;
  specialists?: Map<ID, IndividualGrunt>;
}

export interface SimplifiedGruntsRules {
  oneHitKill: boolean;
  unopposedRolls: boolean;
  noDodge: boolean;
  autoSurprise: boolean;
  ambushFails: boolean;
}

export type MoraleState = "steady" | "shaken" | "broken" | "routed";
```

#### 1.3 Define Template Types

**File:** `/lib/types/grunts.ts`
**References:**

- Capability Requirement: "Professional Ratings (0-6) MUST govern the default behavior, morale thresholds, and group quality"

```typescript
export interface GruntTemplate {
  id: ID;
  editionCode: string;
  professionalRating: number;
  name: string;
  description: string;
  baseGrunts: GruntStats;
  defaultOptions?: GruntTeamOptions;
  moraleTier: MoraleTier;
}

export interface MoraleTier {
  breakThreshold: number; // Casualty % that triggers break
  rallyCost: number; // Edge cost to rally
  canRally: boolean;
}
```

#### 1.4 Update Type Index

**File:** `/lib/types/index.ts`
**References:** Architecture pattern - single export point

Add exports for all new grunt types.

---

### Phase 2: Storage Layer

#### 2.1 Create Grunt Storage Functions

**File:** `/lib/storage/grunts.ts` (NEW)
**References:**

- Capability Constraint: "Modification of NPC attributes and group configurations MUST be restricted to campaign authorities"
- Capability Constraint: "NPC state changes resulting from encounter actions MUST be permanently recorded in the campaign history"

```typescript
// CRUD Operations
export function createGruntTeam(
  campaignId: ID,
  team: Omit<GruntTeam, "id" | "createdAt" | "updatedAt">
): GruntTeam;

export function getGruntTeam(teamId: ID): GruntTeam | null;

export function updateGruntTeam(teamId: ID, updates: Partial<GruntTeam>): GruntTeam;

export function deleteGruntTeam(teamId: ID): boolean;

// Query Operations
export function getGruntTeamsByCampaign(
  campaignId: ID,
  options?: { professionalRating?: number; search?: string }
): GruntTeam[];

export function getGruntTeamsByEncounter(encounterId: ID): GruntTeam[];

// Combat State Operations
export function getIndividualGrunts(teamId: ID): IndividualGrunts | null;

export function initializeIndividualGrunts(team: GruntTeam): IndividualGrunts;

export function updateIndividualGrunt(
  teamId: ID,
  gruntId: ID,
  updates: Partial<IndividualGrunt>
): IndividualGrunt;

export function updateGruntTeamState(teamId: ID, updates: Partial<GruntTeamState>): GruntTeam;
```

**Storage Location:** `/data/campaigns/{campaignId}/grunt-teams/{teamId}.json`

#### 2.2 Create Template Storage Functions

**File:** `/lib/storage/grunt-templates.ts` (NEW)
**References:**

- Capability Requirement: "Grunt teams MUST support specialization... without requiring full individual entity modeling"

```typescript
export function getGruntTemplates(
  editionCode: string,
  professionalRating?: number
): GruntTemplate[];

export function getGruntTemplate(editionCode: string, templateId: ID): GruntTemplate | null;
```

**Storage Location:** `/data/editions/{editionCode}/grunt-templates/`

---

### Phase 3: Rules Engine

#### 3.1 Create Grunt Rules Functions

**File:** `/lib/rules/grunts.ts` (NEW)
**References:**

- Capability Requirement: "Casualty calculation MUST be automatic based on damage thresholds"
- Capability Requirement: "The system MUST manage a shared 'Group Edge' pool for grunt teams"
- Capability Requirement: "Morale state MUST be automatically evaluated based on casualty rates and leadership presence"

```typescript
// Condition Monitor
export function calculateConditionMonitorSize(body: number, willpower: number): number;

export function applyDamage(
  grunt: IndividualGrunt,
  damage: number,
  damageType: "physical" | "stun",
  stats: GruntStats
): { isDead: boolean; isStunned: boolean };

// Morale System
export function calculateMoraleThreshold(
  professionalRating: number,
  hasLieutenant: boolean
): number;

export function checkMorale(team: GruntTeam): MoraleState;

export function attemptRally(team: GruntTeam): boolean;

// Group Edge
export function spendGroupEdge(team: GruntTeam, amount: number): boolean;

export function refreshGroupEdge(team: GruntTeam): GruntTeam;

export function getGroupEdgeMax(professionalRating: number): number;

// Initiative
export function rollGroupInitiative(team: GruntTeam): number;

export function rollLieutenantInitiative(lieutenant: LieutenantStats): number;

export function rollSpecialistInitiative(
  specialist: GruntSpecialist,
  baseStats: GruntStats
): number;

// Validation
export function validateLieutenantStats(
  lieutenant: LieutenantStats,
  baseGrunts: GruntStats
): { valid: boolean; errors: string[] };

export function validateGruntTeam(team: Partial<GruntTeam>): { valid: boolean; errors: string[] };

// Professional Rating
export function getProfessionalRatingModifiers(rating: number): {
  attributeRange: [number, number];
  skillRange: [number, number];
  edgePool: number;
  moraleBreakThreshold: number;
};
```

#### 3.2 Create Simplified Combat Rules

**File:** `/lib/rules/grunts.ts`
**References:**

- Capability Requirement: "The system MUST facilitate the implementation of 'simplified rules'"

```typescript
export function applySimplifiedDamage(
  team: GruntTeam,
  gruntId: ID,
  rules: SimplifiedGruntsRules
): { isDead: boolean };

export function isAmbushAutoFail(rules: SimplifiedGruntsRules): boolean;

export function isRollUnopposed(rules: SimplifiedGruntsRules, rollType: string): boolean;
```

---

### Phase 4: API Endpoints

#### 4.1 Campaign Grunt Teams Endpoint

**File:** `/app/api/campaigns/[id]/grunt-teams/route.ts` (NEW)
**References:**

- Capability Constraint: "Modification of NPC attributes... MUST be restricted to campaign authorities"

```typescript
// GET /api/campaigns/{campaignId}/grunt-teams
// Query: ?professionalRating=3&search=knight
// Returns: { success: boolean; teams: GruntTeam[] }

// POST /api/campaigns/{campaignId}/grunt-teams
// Body: CreateGruntTeamRequest
// Validation:
//   - Name required (1-100 chars)
//   - professionalRating 0-6
//   - specialists max 2
//   - lieutenant stats +4 over base
// Returns: { success: boolean; team: GruntTeam }
```

#### 4.2 Individual Grunt Team Endpoint

**File:** `/app/api/grunt-teams/[teamId]/route.ts` (NEW)
**References:**

- Capability Guarantee: "Grunt teams MUST operate within a simplified condition and initiative model"

```typescript
// GET /api/grunt-teams/{teamId}
// Returns: { success: boolean; team: GruntTeam; individualGrunts?: IndividualGrunts }

// PUT /api/grunt-teams/{teamId}
// GM-only, updates team configuration
// Returns: { success: boolean; team: GruntTeam }

// DELETE /api/grunt-teams/{teamId}
// GM-only, removes team
// Returns: { success: boolean }
```

#### 4.3 Combat State Endpoint

**File:** `/app/api/grunt-teams/[teamId]/state/route.ts` (NEW)
**References:**

- Capability Requirement: "The system MUST provide an authoritative tracker for NPC condition monitors"

```typescript
// PATCH /api/grunt-teams/{teamId}/state
// Body: { activeCount?, casualties?, groupInitiative?, moraleBroken? }
// Auto-calculates morale when casualties change
// Returns: { success: boolean; team: GruntTeam }
```

#### 4.4 Damage Application Endpoint

**File:** `/app/api/grunt-teams/[teamId]/grunts/[gruntId]/damage/route.ts` (NEW)
**References:**

- Capability Requirement: "Casualty calculation MUST be automatic"

```typescript
// POST /api/grunt-teams/{teamId}/grunts/{gruntId}/damage
// Body: { damage: number; damageType: 'physical' | 'stun' }
// Auto-updates casualties, checks morale
// Returns: { success: boolean; grunt: IndividualGrunt; teamState: GruntTeamState }
```

#### 4.5 Bulk Damage Endpoint

**File:** `/app/api/grunt-teams/[teamId]/damage/bulk/route.ts` (NEW)
**References:**

- Capability Requirement: "precise casualty and state tracking"

```typescript
// POST /api/grunt-teams/{teamId}/damage/bulk
// Body: { gruntIds: ID[]; damage: number; damageType: 'physical' | 'stun' }
// Returns: { success: boolean; results: DamageResult[]; teamState: GruntTeamState }
```

#### 4.6 Group Edge Endpoint

**File:** `/app/api/grunt-teams/[teamId]/spend-edge/route.ts` (NEW)
**References:**

- Capability Requirement: "The system MUST manage a shared 'Group Edge' pool"

```typescript
// POST /api/grunt-teams/{teamId}/spend-edge
// Body: { amount: number; targetGruntId?: ID }
// Validates sufficient edge available
// Returns: { success: boolean; team: GruntTeam }
```

#### 4.7 Initiative Endpoint

**File:** `/app/api/grunt-teams/[teamId]/initiative/route.ts` (NEW)
**References:**

- Capability Requirement: "Initiative resolution MUST support both group-based and individual-based models"

```typescript
// POST /api/grunt-teams/{teamId}/initiative
// Body: { type: 'group' | 'individual' }
// Returns: { success: boolean; groupInitiative?: number; individualInitiatives?: Record<ID, number> }
```

#### 4.8 Templates Endpoint

**File:** `/app/api/editions/[editionCode]/grunt-templates/route.ts` (NEW)
**References:**

- Capability Requirement: "Professional Ratings (0-6) MUST govern default behavior"

```typescript
// GET /api/editions/{editionCode}/grunt-templates
// Query: ?professionalRating=3
// Returns: { success: boolean; templates: GruntTemplate[] }
```

---

### Phase 5: UI Components

#### 5.1 Grunt Teams List Page

**File:** `/app/campaigns/[campaignId]/grunt-teams/page.tsx` (NEW)
**References:**

- Capability Constraint: "Participant visibility into NPC capabilities MUST be restricted according to campaign authority"

Features:

- List all grunt teams for campaign
- Filter by Professional Rating
- Search by name
- Create new team button (GM only)
- Team cards with quick stats

#### 5.2 Grunt Team Card Component

**File:** `/app/campaigns/[campaignId]/grunt-teams/components/GruntTeamCard.tsx` (NEW)

Features:

- Team name and description
- Professional Rating badge
- Active count / Total count
- Group Edge display
- Morale status indicator
- Quick actions (View, Edit, Delete)

#### 5.3 Create Grunt Team Wizard

**File:** `/app/campaigns/[campaignId]/grunt-teams/create/page.tsx` (NEW)
**References:**

- Capability Requirement: "NPC entities MUST support specialized roles"

Steps:

1. **Basic Info** - Name, description, Professional Rating
2. **Template Selection** - Choose from PR templates or custom
3. **Base Stats** - Attributes, skills, gear (if custom)
4. **Lieutenant** - Optional enhanced leader
5. **Specialists** - Optional 1-2 specialized grunts
6. **Review** - Summary and confirm

#### 5.4 Grunt Team Detail Page

**File:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/page.tsx` (NEW)

Features:

- Team header with metadata
- Tab navigation (Stats, Combat Tracker, Settings)
- Permission-based view (GM vs Player)

#### 5.5 Stats Tab Component

**File:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/components/GruntTeamStatsTab.tsx` (NEW)

Features:

- Base grunt statistics display
- Lieutenant section (if present)
- Specialists section (if present)
- Gear and weapon lists
- Calculated values (condition monitor, limits)

#### 5.6 Combat Tracker Tab Component

**File:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/components/GruntTeamCombatTrackerTab.tsx` (NEW)
**References:**

- Capability Guarantee: "The system MUST provide an authoritative tracker for NPC condition monitors"

Features:

- Individual grunt condition monitors
- Damage application form
- Bulk damage mode
- Group Edge pool with spend button
- Initiative roller and display
- Morale status with rally option
- Simplified rules toggle (GM only)

#### 5.7 Condition Monitor Component

**File:** `/app/campaigns/[campaignId]/grunt-teams/[teamId]/components/ConditionMonitor.tsx` (NEW)

Features:

- Visual condition monitor boxes (filled/empty)
- Click-to-fill damage application
- Physical/Stun indicators
- Dead/Stunned state display

#### 5.8 Professional Rating Badge Component

**File:** `/app/campaigns/[campaignId]/grunt-teams/components/ProfessionalRatingBadge.tsx` (NEW)

Features:

- Color-coded by rating tier
- Tooltip with tier description
- Consistent styling across app

---

### Phase 6: Template Data

#### 6.1 Create SR5 Grunt Templates

**File:** `/data/editions/sr5/grunt-templates/` (NEW DIRECTORY)
**References:**

- Capability Requirement: "Professional Ratings (0-6) MUST govern the default behavior"

Create template files for each Professional Rating tier:

- `professional-rating-0.json` - Untrained (street thugs, desperate civilians)
- `professional-rating-1.json` - Green (new gang members, mall security)
- `professional-rating-2.json` - Regular (gang veterans, private security)
- `professional-rating-3.json` - Seasoned (experienced mercs, corp security)
- `professional-rating-4.json` - Veteran (HTR teams, special forces)
- `professional-rating-5.json` - Elite (Red Samurai, Tir Ghost)
- `professional-rating-6.json` - Prime (Dragon guard, immortal elf special ops)

Each template includes:

- Default attribute spreads
- Typical skill sets
- Standard gear loadouts
- Morale thresholds
- Group Edge maximum

---

### Phase 7: Integration

#### 7.1 Add Grunt Teams to Campaign Navigation

**File:** `/app/campaigns/[campaignId]/components/CampaignSidebar.tsx`

Add "Grunt Teams" navigation link with count badge.

#### 7.2 Create Grunt Context (Optional)

**File:** `/lib/rules/GruntContext.tsx` (NEW, if needed)

React Context for grunt team state management across combat tracker components.

#### 7.3 Add Activity Feed Integration

**File:** `/lib/types/campaign.ts`

Extend `CampaignActivityEventType` with:

- `grunt_team_created`
- `grunt_team_updated`
- `grunt_team_deleted`
- `grunt_casualties`
- `grunt_morale_break`

---

## Verification Plan

### Automated Tests

#### Unit Tests: Types and Validation

**File:** `/__tests__/lib/types/grunts.test.ts`

| Test Case                                   | Capability Reference                          |
| ------------------------------------------- | --------------------------------------------- |
| GruntTeam validates Professional Rating 0-6 | PR MUST govern behavior                       |
| GruntStats requires all 8 attributes        | NPC MUST be compliant with ruleset            |
| LieutenantStats validates +4 over base      | Leadership entities MUST apply bonuses        |
| Specialists limited to 2 per team           | Support specialization within group structure |

#### Unit Tests: Rules Engine

**File:** `/__tests__/lib/rules/grunts.test.ts`

| Test Case                                             | Capability Reference                         |
| ----------------------------------------------------- | -------------------------------------------- |
| calculateConditionMonitorSize returns 8 + ceil(max/2) | Authoritative tracker for condition monitors |
| applyDamage correctly tracks Physical vs Stun         | Physical and Stun damage application         |
| Casualty auto-increments when grunt dies              | Casualty calculation MUST be automatic       |
| checkMorale returns broken at threshold               | Morale MUST be automatically evaluated       |
| spendGroupEdge fails when insufficient                | Enforce Professional Rating constraints      |
| groupEdgeMax equals professionalRating                | Group Edge derived from Professional Rating  |
| validateLieutenantStats enforces +4 rule              | Lieutenant bonuses MUST be verifiable        |

#### Unit Tests: Storage Layer

**File:** `/__tests__/lib/storage/grunts.test.ts`

| Test Case                                        | Capability Reference                |
| ------------------------------------------------ | ----------------------------------- |
| createGruntTeam stores in campaign directory     | NPC state changes MUST be recorded  |
| getGruntTeamsByCampaign filters by campaign      | Restricted to campaign authorities  |
| updateGruntTeam records updatedAt                | State transitions MUST be permanent |
| deleteGruntTeam removes from storage             | Campaign authority control          |
| initializeIndividualGrunts creates correct count | Individual casualty markers         |

#### API Tests

**File:** `/app/api/grunt-teams/__tests__/`

| Test Case                               | Capability Reference               |
| --------------------------------------- | ---------------------------------- |
| POST requires GM role                   | Restricted to campaign authorities |
| PUT validates team ownership            | Restricted to campaign authorities |
| DELETE returns 403 for players          | Restricted to campaign authorities |
| GET respects visibility settings        | Visibility MUST be restricted      |
| Damage endpoint updates casualties      | Casualty tracking                  |
| Edge endpoint validates availability    | Group Edge constraints             |
| Initiative endpoint supports both modes | Group and individual initiative    |

#### Integration Tests

**File:** `/__tests__/integration/npc-governance.test.ts`

| Test Case                                      | Capability Reference               |
| ---------------------------------------------- | ---------------------------------- |
| Full lifecycle: create → damage → morale break | End-to-end NPC governance          |
| Group Edge depletes and refreshes correctly    | Group Edge pool management         |
| Lieutenant death affects morale threshold      | Leadership presence evaluation     |
| Simplified rules apply one-hit-kill            | Simplified rules implementation    |
| Activity feed records grunt events             | State changes permanently recorded |

### Manual Verification Steps

1. **Access Control**
   - [ ] Login as player, verify cannot create grunt teams
   - [ ] Login as GM, verify full CRUD access
   - [ ] Verify visibility settings hide stats from players

2. **Professional Rating Templates**
   - [ ] Create team from PR-0 template, verify street thug stats
   - [ ] Create team from PR-6 template, verify elite stats
   - [ ] Verify Edge pool matches PR value

3. **Combat Tracking**
   - [ ] Apply damage to grunt, verify condition monitor updates
   - [ ] Kill grunt, verify casualties increment
   - [ ] Reach morale threshold, verify team breaks
   - [ ] Spend Group Edge, verify pool decrements
   - [ ] Roll initiative, verify group vs individual modes

4. **Lieutenant Mechanics**
   - [ ] Create team with lieutenant, verify +4 stat requirement
   - [ ] Verify lieutenant uses individual initiative
   - [ ] Kill lieutenant, verify morale threshold changes

5. **Specialists**
   - [ ] Add 2 specialists, verify limit enforced
   - [ ] Verify specialist stat modifications apply
   - [ ] Verify specialist individual initiative (if augmented)

6. **Simplified Rules**
   - [ ] Enable one-hit-kill, verify grunts die on any damage
   - [ ] Enable unopposed rolls, verify dice pool adjustments

---

## Dependency Ordering

```
Phase 1: Type Definitions
    1.1 → 1.2 → 1.3 → 1.4
                    ↓
Phase 2: Storage Layer
    2.1 → 2.2
         ↓
Phase 3: Rules Engine
    3.1 → 3.2
         ↓
Phase 4: API Endpoints
    4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6 → 4.7 → 4.8
                              ↓
Phase 5: UI Components
    5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6 → 5.7 → 5.8
                              ↓
Phase 6: Template Data
    6.1
         ↓
Phase 7: Integration
    7.1 → 7.2 → 7.3
         ↓
    Verification
```

**Critical Path:** Types (1.x) → Storage (2.x) → Rules (3.x) → APIs (4.x) → UI (5.x)

Phases 6 and 7 can be developed in parallel with Phase 5.

---

## File Summary

### New Files

| File                                                                | Purpose                                     |
| ------------------------------------------------------------------- | ------------------------------------------- |
| `/lib/types/grunts.ts`                                              | All grunt-related type definitions          |
| `/lib/storage/grunts.ts`                                            | Grunt team CRUD and combat state operations |
| `/lib/storage/grunt-templates.ts`                                   | Template loading from edition data          |
| `/lib/rules/grunts.ts`                                              | Combat, morale, Edge, and validation logic  |
| `/app/api/campaigns/[id]/grunt-teams/route.ts`                      | Campaign grunt teams list/create            |
| `/app/api/grunt-teams/[teamId]/route.ts`                            | Individual team GET/PUT/DELETE              |
| `/app/api/grunt-teams/[teamId]/state/route.ts`                      | Combat state updates                        |
| `/app/api/grunt-teams/[teamId]/grunts/[gruntId]/damage/route.ts`    | Individual damage                           |
| `/app/api/grunt-teams/[teamId]/damage/bulk/route.ts`                | Bulk damage                                 |
| `/app/api/grunt-teams/[teamId]/spend-edge/route.ts`                 | Group Edge spending                         |
| `/app/api/grunt-teams/[teamId]/initiative/route.ts`                 | Initiative rolling                          |
| `/app/api/editions/[editionCode]/grunt-templates/route.ts`          | Template fetching                           |
| `/app/campaigns/[campaignId]/grunt-teams/page.tsx`                  | Grunt teams list page                       |
| `/app/campaigns/[campaignId]/grunt-teams/create/page.tsx`           | Creation wizard                             |
| `/app/campaigns/[campaignId]/grunt-teams/[teamId]/page.tsx`         | Team detail page                            |
| `/app/campaigns/[campaignId]/grunt-teams/components/*.tsx`          | Shared components                           |
| `/app/campaigns/[campaignId]/grunt-teams/[teamId]/components/*.tsx` | Detail components                           |
| `/data/editions/sr5/grunt-templates/*.json`                         | PR 0-6 template files                       |
| `/__tests__/lib/types/grunts.test.ts`                               | Type validation tests                       |
| `/__tests__/lib/storage/grunts.test.ts`                             | Storage layer tests                         |
| `/__tests__/lib/rules/grunts.test.ts`                               | Rules engine tests                          |
| `/__tests__/integration/npc-governance.test.ts`                     | Integration tests                           |

### Modified Files

| File                                                         | Changes                        |
| ------------------------------------------------------------ | ------------------------------ |
| `/lib/types/index.ts`                                        | Export grunt types             |
| `/lib/types/campaign.ts`                                     | Add grunt activity event types |
| `/app/campaigns/[campaignId]/components/CampaignSidebar.tsx` | Add grunt teams nav link       |

---

## Open Questions Resolved

| Question                      | Resolution                                                                 |
| ----------------------------- | -------------------------------------------------------------------------- |
| Individual vs Group tracking? | Support both, default to group, allow individual per encounter             |
| Encounter integration?        | Start campaign-only, add encounter links when encounter system implemented |
| Template storage?             | Edition-specific in `/data/editions/`, not user-specific                   |
| Prime Runners?                | Separate feature using Character type with `isNPC` flag                    |
| Simplified rules scope?       | Team-specific for flexibility                                              |
| Group Edge refresh?           | Manual with GM control, default to encounter start                         |
| Morale automation?            | Automatic checks with manual override                                      |
| Death determination?          | Automatic with visual indicator, GM can override                           |
| Bulk operations?              | Allow selection (checkbox list)                                            |
| Export format?                | Start with JSON, add PDF in future phase                                   |

---

## Capability Traceability Matrix

| Capability Guarantee/Requirement                                               | Implementation Location              |
| ------------------------------------------------------------------------------ | ------------------------------------ |
| NPC entities MUST be authoritatively defined with ruleset-compliant attributes | Phase 1.1, 3.1 validation            |
| Grunt teams MUST share common statistical foundation                           | Phase 1.1 GruntStats type            |
| Individual casualty markers                                                    | Phase 1.2 IndividualGrunts type      |
| Professional Rating (0-6) MUST govern behavior                                 | Phase 3.1, Phase 6 templates         |
| The system MUST manage a shared Group Edge pool                                | Phase 3.1, Phase 4.6                 |
| Morale MUST be automatically evaluated                                         | Phase 3.1 checkMorale()              |
| Support simplified rules                                                       | Phase 3.2, Phase 5.6 toggle          |
| Authoritative tracker for condition monitors                                   | Phase 1.2, 3.1, 5.7                  |
| Initiative: group-based and individual-based                                   | Phase 3.1, Phase 4.7                 |
| Modification restricted to campaign authorities                                | Phase 4.x GM-only endpoints          |
| NPC state changes MUST be permanently recorded                                 | Phase 2.1, 7.3 activity feed         |
| Participant visibility MUST be restricted                                      | Phase 1.1 visibility, API checks     |
| Leadership entities MUST apply verifiable bonuses                              | Phase 1.1, 3.1 lieutenant validation |
