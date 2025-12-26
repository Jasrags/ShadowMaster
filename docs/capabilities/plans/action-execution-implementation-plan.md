# Implementation Plan: Action Economy and Execution System

## Goal Description

Implement a complete Action Economy and Execution system that enforces consistent action allocation (Free, Simple, Complex, Interrupt), validates actions against character state, propagates results to character records, and maintains auditable action history.

**Target Capability:** `mechanics.action-execution.md`

**Current State:** The codebase has foundational infrastructure (dice engine, pool builder, edge actions, basic API endpoints) but lacks combat session tracking, action economy enforcement, and integrated execution domains (combat, magic, matrix).

---

## Architectural Decisions (Approved)

The following architectural decisions have been reviewed and approved:

| Decision | Approved Choice | Rationale |
|----------|-----------------|-----------|
| **Combat Session Model** | Server-side (persistent) | Enables multiplayer campaign support |
| **Action Economy Enforcement** | Server-enforced with client-side preview | Ensures rule integrity while providing good UX |
| **Opposed Test Resolution** | Async for real-time, sync for solo/GM | Flexibility for different play modes |
| **Magic/Matrix Scope** | Deferred to Phase 2 | Focus on physical combat first, reduces initial scope |

### Implementation Implications

1. **Server-side Combat Sessions**: Requires `/lib/storage/combat.ts` with full CRUD operations
2. **Server Enforcement**: All action APIs must validate against turn state before execution
3. **Dual Opposed Test Modes**: API must support both sync and async resolution patterns
4. **Phase 2 Scope**: Magic and Matrix execution domains will be added after Phase 1 completion

---

## Proposed Changes

### Phase 1: Action Economy Core

#### 1.1 Combat Session Types

**File:** `/lib/types/combat.ts` (NEW)

```typescript
interface CombatSession {
  id: string;
  campaignId?: string;
  participants: CombatParticipant[];
  initiativeOrder: string[]; // participantId order
  currentTurn: number;
  currentPhase: CombatPhase;
  round: number;
  status: 'active' | 'paused' | 'completed';
  environment: EnvironmentConditions;
  createdAt: string;
  updatedAt: string;
}

interface CombatParticipant {
  id: string;
  characterId: string;
  initiativeScore: number;
  actionsRemaining: ActionAllocation;
  interruptsPending: InterruptAction[];
  status: ParticipantStatus;
}

interface ActionAllocation {
  free: number;      // Typically unlimited
  simple: number;    // 2 per turn (or 1 complex)
  complex: number;   // 1 per turn (uses both simple)
  interrupt: boolean; // Available if not used
}

type CombatPhase = 'initiative' | 'action' | 'resolution';
type ParticipantStatus = 'active' | 'delayed' | 'out';
```

**Satisfies:**
- Guarantee: "enforce a consistent action economy (Free, Simple, Complex, Interrupt)"
- Requirement: "track and restrict the available action pool for a participant"

---

#### 1.2 Action Definition Types

**File:** `/lib/types/action-definitions.ts` (NEW)

```typescript
interface ActionDefinition {
  id: string;
  name: string;
  type: ActionType;
  cost: ActionCost;
  domain: ExecutionDomain;
  prerequisites: ActionPrerequisite[];
  modifiers: ActionModifier[];
  opposedBy?: OpposedTestConfig;
  effects: ActionEffect[];
}

type ActionType = 'free' | 'simple' | 'complex' | 'interrupt';
type ExecutionDomain = 'combat' | 'magic' | 'matrix' | 'social' | 'general';

interface ActionCost {
  actionType: ActionType;
  initiativeCost?: number;  // For interrupts
  resourceCost?: ResourceCost[];
}

interface ActionPrerequisite {
  type: 'skill' | 'attribute' | 'equipment' | 'state' | 'resource';
  requirement: string;
  minimumValue?: number;
}

interface ActionEffect {
  type: 'damage' | 'heal' | 'condition' | 'resource' | 'state';
  target: 'self' | 'target' | 'area';
  calculation: EffectCalculation;
}
```

**Satisfies:**
- Requirement: "Actions MUST have authoritative costs in terms of time or resources"
- Requirement: "Interrupt actions MUST be available at the cost of predefined initiative penalties"

---

#### 1.3 Combat Session Storage

**File:** `/lib/storage/combat.ts` (NEW)

```typescript
// CRUD operations for combat sessions
export function createCombatSession(session: Omit<CombatSession, 'id' | 'createdAt' | 'updatedAt'>): CombatSession;
export function getCombatSession(sessionId: string): CombatSession | null;
export function updateCombatSession(sessionId: string, updates: Partial<CombatSession>): CombatSession;
export function deleteCombatSession(sessionId: string): boolean;

// Participant management
export function addParticipant(sessionId: string, participant: CombatParticipant): CombatSession;
export function removeParticipant(sessionId: string, participantId: string): CombatSession;
export function updateParticipantActions(sessionId: string, participantId: string, actions: ActionAllocation): CombatSession;

// Turn management
export function advanceTurn(sessionId: string): CombatSession;
export function advanceRound(sessionId: string): CombatSession;
```

**Satisfies:**
- Guarantee: "maintain a persistent and auditable history of all action attempts"

---

#### 1.4 Action Validator

**File:** `/lib/rules/action-resolution/action-validator.ts` (NEW)

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  modifiedPool?: ActionPool;  // Pool after applying state modifiers
}

interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

// Core validation functions
export function validateActionEligibility(
  character: Character,
  action: ActionDefinition,
  combatSession?: CombatSession
): ValidationResult;

export function validateActionCost(
  participant: CombatParticipant,
  action: ActionDefinition
): ValidationResult;

export function validatePrerequisites(
  character: Character,
  prerequisites: ActionPrerequisite[]
): ValidationResult;

export function calculateStateModifiers(
  character: Character,
  action: ActionDefinition
): Modifier[];
```

**Satisfies:**
- Guarantee: "Every action execution MUST involve a real-time validity check"
- Requirement: "pre-calculate action-specific resolution pools based on entity's attributes"
- Requirement: "Actions MUST be restricted to those compatible with character's state"
- Constraint: "Action resolution MUST be exclusively derived from current verifiable state"

---

#### 1.5 Action Executor

**File:** `/lib/rules/action-resolution/action-executor.ts` (NEW)

```typescript
interface ExecutionRequest {
  characterId: string;
  actionId: string;
  targetId?: string;
  combatSessionId?: string;
  edgeAction?: EdgeActionType;
  modifiers?: Modifier[];
}

interface ExecutionResult {
  success: boolean;
  actionResult: ActionResult;
  stateChanges: StateChange[];
  validation: ValidationResult;
  audit: ActionAuditEntry;
}

interface StateChange {
  entityId: string;
  entityType: 'character' | 'npc' | 'device';
  field: string;
  previousValue: unknown;
  newValue: unknown;
}

// Core execution
export function executeAction(request: ExecutionRequest): Promise<ExecutionResult>;

// Domain-specific executors
export function executeCombatAction(request: ExecutionRequest): Promise<ExecutionResult>;
export function executeGeneralAction(request: ExecutionRequest): Promise<ExecutionResult>;

// Result application
export function applyStateChanges(changes: StateChange[]): Promise<void>;
export function rollbackStateChanges(changes: StateChange[]): Promise<void>;
```

**Satisfies:**
- Guarantee: "Results MUST be automatically propagated to character's records"
- Constraint: "Resource expenditures MUST NOT cause invalid or negative threshold"
- Constraint: "Action execution MUST be restricted to authorized participants"

---

### Phase 2: Combat Execution Domain

#### 2.1 Combat Action Definitions

**File:** `/data/editions/sr5/actions/combat-actions.json` (NEW)

Define all combat actions from `/docs/data_tables/combat/combat_actions.md`:
- Free Actions: Call Shot, Change Device Mode, Drop Object, etc.
- Simple Actions: Fire Weapon (SA/SS/BF), Ready Weapon, Take Aim, etc.
- Complex Actions: Fire Weapon (FA), Melee Attack, Sprint, etc.
- Interrupt Actions: Block, Dodge, Full Defense, etc.

**Satisfies:**
- Requirement: "Combat execution MUST support multi-mode weapon interactions"

---

#### 2.2 Weapon Integration

**File:** `/lib/rules/action-resolution/combat/weapon-handler.ts` (NEW)

```typescript
interface WeaponAttackRequest {
  weaponId: string;
  firingMode: FiringMode;
  targetId: string;
  range: number;
  calledShot?: CalledShotType;
  aimBonus?: number;
}

interface WeaponAttackResult {
  attackPool: ActionPool;
  defensePool: ActionPool;
  netHits: number;
  damage: DamageResult;
  ammoExpended: number;
  recoilPenalty: number;
}

export function calculateAttackPool(character: Character, weapon: Weapon, request: WeaponAttackRequest): ActionPool;
export function calculateDefensePool(defender: Character, attackType: AttackType): ActionPool;
export function calculateDamage(weapon: Weapon, netHits: number, calledShot?: CalledShotType): DamageResult;
export function applyRecoil(weapon: Weapon, firingMode: FiringMode, previousShots: number): number;
```

**Satisfies:**
- Requirement: "Combat execution MUST support ammunition management and movement-based modifiers"

---

#### 2.3 Damage Application

**File:** `/lib/rules/action-resolution/combat/damage-handler.ts` (NEW)

```typescript
interface DamageApplication {
  targetId: string;
  damageType: 'physical' | 'stun';
  damageValue: number;
  armorPenetration: number;
}

interface DamageResult {
  damageDealt: number;
  armorUsed: number;
  woundModifierChange: number;
  conditionMonitorState: ConditionMonitorState;
  knockdown: boolean;
  overflow: number;
}

export function calculateResistance(character: Character, damage: DamageApplication): ActionPool;
export function applyDamage(character: Character, damage: DamageApplication, resistanceHits: number): DamageResult;
export function calculateWoundModifier(conditionMonitor: ConditionMonitorState): number;
```

**Satisfies:**
- Requirement: "Lifecycle execution MUST facilitate precise application of damage and healing"
- Requirement: "Changes to operational state MUST automatically apply persistent modifiers"

---

### Phase 3: API Layer

#### 3.1 Combat Session API

**File:** `/app/api/combat/route.ts` (NEW)

```typescript
// POST: Create new combat session
// GET: List active combat sessions for user/campaign
```

**File:** `/app/api/combat/[sessionId]/route.ts` (NEW)

```typescript
// GET: Get combat session state
// PATCH: Update combat session (pause, resume, environment)
// DELETE: End combat session
```

**File:** `/app/api/combat/[sessionId]/participants/route.ts` (NEW)

```typescript
// POST: Add participant
// GET: List participants with current state
```

**File:** `/app/api/combat/[sessionId]/turn/route.ts` (NEW)

```typescript
// POST: Advance turn
// GET: Current turn state
```

---

#### 3.2 Action Execution API

**File:** `/app/api/combat/[sessionId]/actions/route.ts` (NEW)

```typescript
// POST: Execute action within combat context
// Request includes: actionId, targetId, modifiers, edgeAction
// Response includes: result, stateChanges, validation

// GET: Available actions for current participant
// Returns actions filtered by eligibility and action economy
```

**Satisfies:**
- Requirement: "Participants MUST receive immediate verification of action costs, eligibility, and resulting state changes"

---

### Phase 4: UI Components

#### 4.1 Combat Tracker Component

**File:** `/components/combat/CombatTracker.tsx` (NEW)

- Initiative order display
- Current turn indicator
- Action economy display (remaining actions per participant)
- Quick action buttons for current participant
- Round/phase tracking

---

#### 4.2 Action Selector Component

**File:** `/components/combat/ActionSelector.tsx` (NEW)

- Categorized action list (Free/Simple/Complex/Interrupt)
- Eligibility indicators (grayed out if unavailable)
- Cost display
- Pool preview on hover
- Quick filters by domain

---

#### 4.3 Opposed Test Resolver

**File:** `/components/combat/OpposedTestResolver.tsx` (NEW)

- Side-by-side pool display
- Simultaneous roll animation
- Net hits calculation
- Result announcement

---

### Phase 5: Character Sheet Integration

#### 5.1 Update Character Sheet

**File:** `/app/characters/[id]/page.tsx` (MODIFY)

- Add ActionPanel integration (currently exists but not fully integrated)
- Add combat session awareness
- Add quick action shortcuts

---

#### 5.2 Condition Monitor Component

**File:** `/components/character/ConditionMonitor.tsx` (NEW)

- Physical/Stun damage tracks
- Wound modifier display
- Overflow tracking
- Status effect indicators

---

## Verification Plan

### Automated Tests

#### Unit Tests

**File:** `/lib/rules/action-resolution/__tests__/action-validator.test.ts`

| Test Case | Capability Reference |
|-----------|---------------------|
| Validates action with sufficient action points | Requirement: "track and restrict available action pool" |
| Rejects action when action economy exhausted | Requirement: "track and restrict available action pool" |
| Applies wound modifiers to pool calculation | Requirement: "pre-calculate resolution pools" |
| Validates equipment prerequisites | Requirement: "actions restricted to compatible state" |
| Rejects actions in invalid character state | Constraint: "derived from current verifiable state" |

**File:** `/lib/rules/action-resolution/__tests__/action-executor.test.ts`

| Test Case | Capability Reference |
|-----------|---------------------|
| Executes action and updates character state | Guarantee: "results propagated to character records" |
| Prevents negative resource thresholds | Constraint: "MUST NOT cause invalid/negative threshold" |
| Records action in audit history | Guarantee: "persistent and auditable history" |
| Rollback on partial failure | Constraint: "resource expenditures MUST NOT cause invalid state" |

**File:** `/lib/rules/action-resolution/__tests__/combat-actions.test.ts`

| Test Case | Capability Reference |
|-----------|---------------------|
| Simple action uses correct action economy | Guarantee: "consistent action economy" |
| Complex action consumes both simple actions | Guarantee: "consistent action economy" |
| Interrupt action applies initiative penalty | Requirement: "predefined initiative penalties" |
| Free actions unlimited per turn | Guarantee: "consistent action economy" |

**File:** `/lib/rules/action-resolution/__tests__/damage-handler.test.ts`

| Test Case | Capability Reference |
|-----------|---------------------|
| Damage correctly applied to condition monitor | Requirement: "precise application of damage" |
| Armor reduces damage appropriately | Requirement: "precise application of damage" |
| Wound modifiers update after damage | Requirement: "automatically apply persistent modifiers" |
| Overflow calculated when condition monitor full | Requirement: "precise application of damage" |

---

#### Integration Tests

**File:** `/lib/rules/action-resolution/__tests__/combat-flow.integration.test.ts`

| Test Case | Capability Reference |
|-----------|---------------------|
| Full combat round with multiple participants | Guarantee: "consistent action economy" |
| Initiative order respected across turns | Requirement: "initiative system" |
| Action history persisted and queryable | Guarantee: "auditable history" |
| Edge actions correctly modify resolution | Requirement: "Edge-based modifications" |

---

#### E2E Tests

**File:** `/e2e/combat-session.spec.ts`

| Test Case | Capability Reference |
|-----------|---------------------|
| Create combat session with multiple characters | Full system integration |
| Execute attack action and verify damage applied | Guarantee: "results propagated" |
| Use interrupt action and verify initiative penalty | Requirement: "interrupt penalties" |
| Verify action history UI displays correctly | Guarantee: "auditable history" |

---

### Manual Verification Checklist

1. **Action Economy Enforcement**
   - [ ] Create character with 2 simple actions
   - [ ] Execute 2 simple actions
   - [ ] Verify 3rd simple action is rejected
   - [ ] Verify 1 complex action consumes both simple actions

2. **State Validation**
   - [ ] Apply wound to character
   - [ ] Verify dice pool reduced by wound modifier
   - [ ] Verify modifier displayed in UI

3. **Damage Application**
   - [ ] Execute attack action
   - [ ] Verify damage recorded on target
   - [ ] Verify condition monitor updated
   - [ ] Verify wound modifier updated if applicable

4. **Audit Trail**
   - [ ] Execute multiple actions
   - [ ] View action history
   - [ ] Verify all actions recorded with timestamps
   - [ ] Verify Edge usage tracked

5. **Edge Cases**
   - [ ] Attempt action with insufficient Edge
   - [ ] Attempt action with invalid weapon
   - [ ] Attempt action while incapacitated
   - [ ] Verify graceful error handling

---

## Implementation Order

```
Phase 1: Action Economy Core (2 weeks estimated)
├── 1.1 Combat Session Types
├── 1.2 Action Definition Types
├── 1.3 Combat Session Storage
├── 1.4 Action Validator
└── 1.5 Action Executor

Phase 2: Combat Execution Domain (2 weeks estimated)
├── 2.1 Combat Action Definitions (data)
├── 2.2 Weapon Integration
└── 2.3 Damage Application

Phase 3: API Layer (1 week estimated)
├── 3.1 Combat Session API
└── 3.2 Action Execution API

Phase 4: UI Components (2 weeks estimated)
├── 4.1 Combat Tracker
├── 4.2 Action Selector
└── 4.3 Opposed Test Resolver

Phase 5: Integration (1 week estimated)
├── 5.1 Character Sheet Integration
└── 5.2 Condition Monitor Component
```

---

## Dependencies

- Existing: `/lib/rules/action-resolution/dice-engine.ts`
- Existing: `/lib/rules/action-resolution/pool-builder.ts`
- Existing: `/lib/rules/action-resolution/edge-actions.ts`
- Existing: `/lib/storage/action-history.ts`
- Existing: `/lib/types/action-resolution.ts`
- Required: Weapon/Gear types with accuracy limits
- Required: Skill specializations in ruleset data

---

## ADR References

- **ADR-001**: File-based storage pattern (applies to combat session storage)
- **ADR-002**: API authentication pattern (applies to all new endpoints)
- **ADR-003**: Ruleset context pattern (action definitions loaded via ruleset)

*Note: ADRs to be created if not existing*

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Combat sessions may become stale | Implement session timeout/cleanup |
| Action economy complexity | Start with basic economy, add interrupt later |
| Performance with large action history | Pagination and cleanup (existing 1000 item limit) |
| State synchronization in multiplayer | Defer real-time sync to future phase |

---

## Success Criteria

1. All capability guarantees verified by automated tests
2. Action economy enforced for all action types
3. Character state automatically updated on action execution
4. Complete audit trail for all actions
5. UI provides immediate feedback on action eligibility
