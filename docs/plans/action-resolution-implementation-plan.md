# Action Resolution Implementation Plan

## Goal Description

Implement a complete Action Resolution system that provides probabilistic determination of character actions with edition-specific probability models, persistent audit trails, and resource-backed interventions (Edge rerolls). This replaces the current client-side-only DiceRoller with a server-persisted system linked to characters.

## User Review Required

### Critical Architectural Decisions

1. **Storage Location**: Action history will be stored alongside character data in `/data/characters/{userId}/{characterId}/action-history.json`. This follows the existing file-based storage pattern.

2. **Edition-Specific Probability Models**: Dice mechanics (hit thresholds, glitch rules) will be defined in edition ruleset data (`diceRules` module), allowing SR4/SR5/SR6 differences to be data-driven.

3. **Edge Tracking**: Edge spending will be tracked at the character level, decrementing `character.condition.edgeCurrent` (new field) while respecting `character.attributes.edge` as maximum.

4. **Wound Modifier Integration**: Action pools will automatically incorporate wound penalties calculated from `character.condition.physicalDamage` and `character.condition.stunDamage`.

## Proposed Changes

### Phase 1: Type Definitions

#### File: `/lib/types/action-resolution.ts` (NEW)

**Purpose**: Define all types for action resolution system

**Satisfies**:

- Capability: "configurable action pools incorporating base character attributes, skill ratings, and situational modifiers"
- Capability: "persistent history record containing the pool configuration, individual results, and outcome statistics"

```typescript
// Core types to define:
interface ActionPool {
  basePool: number;
  attribute?: string;
  skill?: string;
  modifiers: PoolModifier[];
  totalDice: number;
}

interface PoolModifier {
  source: string; // "wound", "situational", "equipment", "quality"
  value: number;
  description: string;
}

interface DiceResult {
  value: number;
  isHit: boolean;
  isOne: boolean;
  wasRerolled?: boolean;
}

interface ActionResult {
  id: string;
  characterId: string;
  pool: ActionPool;
  dice: DiceResult[];
  hits: number;
  ones: number;
  isGlitch: boolean;
  isCriticalGlitch: boolean;
  edgeSpent: number;
  rerollCount: number;
  timestamp: string;
  context?: ActionContext;
}

interface ActionContext {
  actionType?: string;
  skillUsed?: string;
  attributeUsed?: string;
  threshold?: number;
  notes?: string;
}

interface ActionHistory {
  characterId: string;
  actions: ActionResult[];
  createdAt: string;
  updatedAt: string;
}

interface EditionDiceRules {
  hitThreshold: number; // Default 5 for SR5
  glitchThreshold: number; // Half pool
  allowExplodingSixes?: boolean; // SR4
  maxDicePool?: number;
}
```

#### File: `/lib/types/character.ts` (MODIFY)

**Purpose**: Add Edge current tracking to character condition

**Satisfies**: Capability: "Resource-backed interventions MUST be restricted by character state"

```typescript
// Add to CharacterCondition interface:
edgeCurrent?: number; // Current Edge points available (defaults to edge attribute if undefined)
```

#### File: `/lib/types/index.ts` (MODIFY)

**Purpose**: Export new action-resolution types

---

### Phase 2: Edition Ruleset Data

#### File: `/data/editions/sr5/core-rulebook.json` (MODIFY)

**Purpose**: Add `diceRules` module with SR5-specific probability model

**Satisfies**:

- Capability: "authoritative probability model defined by the game edition ruleset"
- Capability: "Hit identification MUST be based on ruleset-defined value thresholds"

```json
{
  "diceRules": {
    "hitThreshold": 5,
    "glitchThreshold": 0.5,
    "criticalGlitchRequiresZeroHits": true,
    "edgeActions": {
      "pushTheLimit": { "addDice": "edge", "explodingSixes": true },
      "secondChance": { "rerollFailures": true, "preserveHits": true },
      "seizeTheInitiative": { "goFirst": true },
      "blitz": { "extraInitiativeDice": 5 },
      "closeCall": { "negateGlitch": true },
      "deadMansTrigger": { "actWhenIncapacitated": true }
    },
    "woundModifiers": {
      "boxesPerPenalty": 3,
      "maxPenalty": -4
    }
  }
}
```

#### File: `/lib/types/edition.ts` (MODIFY)

**Purpose**: Add DiceRules type to BookPayload modules

---

### Phase 3: Rules Engine

#### File: `/lib/rules/action-resolution/pool-builder.ts` (NEW)

**Purpose**: Calculate action pools from character state and context

**Satisfies**:

- Capability: "configurable action pools incorporating base character attributes, skill ratings, and situational modifiers"
- Capability: "Resolution pools MUST automatically incorporate persistent character modifiers, such as wound penalties"

```typescript
// Functions to implement:
function buildActionPool(character: Character, options: PoolBuildOptions): ActionPool;

function calculateWoundModifier(
  physicalDamage: number,
  stunDamage: number,
  boxesPerPenalty: number
): number;

function applyModifiers(basePool: number, modifiers: PoolModifier[]): number;
```

#### File: `/lib/rules/action-resolution/dice-engine.ts` (NEW)

**Purpose**: Core dice rolling logic with hit/glitch calculation

**Satisfies**:

- Capability: "Successful outcomes (Hits) and complications (Glitches) MUST be calculated with absolute precision"
- Capability: "Individual results MUST be generated using an unbiased random distribution mechanism"
- Capability: "Complication identification... MUST be calculated according to the distribution of minimum values"

```typescript
// Functions to implement:
function rollDice(poolSize: number): DiceResult[];

function calculateHits(dice: DiceResult[], hitThreshold: number): number;

function calculateGlitch(
  dice: DiceResult[],
  glitchThreshold: number
): { isGlitch: boolean; isCriticalGlitch: boolean };

function sortDiceForDisplay(dice: DiceResult[]): DiceResult[];
```

#### File: `/lib/rules/action-resolution/edge-actions.ts` (NEW)

**Purpose**: Handle Edge-powered interventions (rerolls, push the limit)

**Satisfies**:

- Capability: "Resource-backed interventions MUST be restricted by character resource availability"
- Capability: "Interventions MUST re-evaluate the complication status... while maintaining the integrity of original successes"

```typescript
// Functions to implement:
function canSpendEdge(character: Character, action: EdgeAction): boolean;

function performSecondChance(result: ActionResult, edgeRules: EditionDiceRules): ActionResult;

function performPushTheLimit(
  pool: ActionPool,
  character: Character,
  edgeRules: EditionDiceRules
): ActionResult;
```

#### File: `/lib/rules/action-resolution/index.ts` (NEW)

**Purpose**: Unified export for action resolution module

---

### Phase 4: Storage Layer

#### File: `/lib/storage/action-history.ts` (NEW)

**Purpose**: Persist action history per character

**Satisfies**:

- Capability: "persistent, auditable record of all action attempts and their resulting states"
- Capability: "Action records MUST maintain an immutable link to the character entity"

```typescript
// Functions to implement:
async function getActionHistory(userId: string, characterId: string): Promise<ActionHistory | null>;

async function saveActionResult(
  userId: string,
  characterId: string,
  result: ActionResult
): Promise<void>;

async function getRecentActions(
  userId: string,
  characterId: string,
  limit?: number
): Promise<ActionResult[]>;
```

#### File: `/lib/storage/characters.ts` (MODIFY)

**Purpose**: Add functions for Edge spending/restoration

```typescript
// Functions to add:
async function spendEdge(
  userId: string,
  characterId: string,
  amount: number
): Promise<Character | null>;

async function restoreEdge(
  userId: string,
  characterId: string,
  amount: number
): Promise<Character | null>;
```

---

### Phase 5: API Endpoints

#### File: `/app/api/characters/[characterId]/actions/route.ts` (NEW)

**Purpose**: Roll dice and record action results

**Satisfies**:

- Capability: "Action resolution MUST NOT proceed without an authorized participant request and a valid pool configuration"

```typescript
// POST: Execute new action roll
// GET: Retrieve action history
```

#### File: `/app/api/characters/[characterId]/actions/[actionId]/reroll/route.ts` (NEW)

**Purpose**: Handle Edge reroll for a specific action

**Satisfies**: Capability: "mechanisms for authoritative interventions, such as rerolling failures"

```typescript
// POST: Execute Edge reroll
// Validates Edge availability before proceeding
```

#### File: `/app/api/characters/[characterId]/edge/route.ts` (NEW)

**Purpose**: Manage Edge spending and restoration

```typescript
// POST: Spend/restore Edge
// GET: Current Edge status
```

---

### Phase 6: React Hooks

#### File: `/lib/rules/action-resolution/hooks.ts` (NEW)

**Purpose**: React hooks for action resolution in components

```typescript
// Hooks to implement:
function useActionResolver(characterId: string): {
  roll: (pool: ActionPool) => Promise<ActionResult>;
  reroll: (actionId: string) => Promise<ActionResult>;
  history: ActionResult[];
  isRolling: boolean;
  error: string | null;
};

function useEdge(characterId: string): {
  current: number;
  maximum: number;
  spend: (amount: number) => Promise<void>;
  restore: (amount: number) => Promise<void>;
};

function usePoolBuilder(
  character: Character,
  ruleset: MergedRuleset
): {
  buildPool: (options: PoolBuildOptions) => ActionPool;
  woundModifier: number;
};
```

---

### Phase 7: UI Components

#### File: `/components/DiceRoller.tsx` (MODIFY)

**Purpose**: Enhance existing component to support server persistence

**Satisfies**: Capability: "Individual results within an action pool MUST be sorted and visualized for immediate participant verifiability"

Changes:

- Add `characterId` prop for persistence mode
- Add `onRollComplete` callback with full `ActionResult`
- Integrate with `useActionResolver` hook when `characterId` provided
- Keep standalone mode for non-character rolls (testing/demos)

#### File: `/components/ActionPoolBuilder.tsx` (NEW)

**Purpose**: UI for constructing action pools with modifiers

```typescript
// Component that allows:
// - Selecting attribute + skill
// - Adding situational modifiers
// - Showing wound penalty
// - Displaying total pool
```

#### File: `/components/ActionHistory.tsx` (NEW)

**Purpose**: Display character's action history

**Satisfies**: Capability: "Participants MUST have access to a historical log of resolutions"

```typescript
// Component features:
// - Chronological list of recent actions
// - Expandable details (pool config, individual dice, context)
// - Filter by action type, date range
// - Export to CSV (reuse pattern from FavorLedgerView)
```

#### File: `/components/EdgeTracker.tsx` (NEW)

**Purpose**: Display and manage Edge points

```typescript
// Component features:
// - Visual display of current/max Edge
// - Quick spend/restore buttons
// - Integration with action resolution flow
```

---

### Phase 8: Integration

#### File: `/app/characters/[id]/page.tsx` (MODIFY)

**Purpose**: Add action resolution section to character sheet

Changes:

- Add "Action Roller" section with integrated DiceRoller
- Display current Edge prominently
- Link to action history page

#### File: `/app/characters/[id]/actions/page.tsx` (NEW)

**Purpose**: Dedicated page for action rolling and history

Features:

- Full ActionPoolBuilder UI
- Integrated dice roller
- Complete action history
- Edge management panel

---

## Verification Plan

### Automated Tests

#### Unit Tests: `/lib/rules/action-resolution/__tests__/`

1. **pool-builder.test.ts**
   - Test wound modifier calculation (3 boxes = -1, 6 boxes = -2, etc.)
   - Test pool building with attribute + skill
   - Test modifier stacking
   - Edge case: negative pools clamp to 0

2. **dice-engine.test.ts**
   - Test hit counting at threshold 5 (SR5)
   - Test glitch detection (>50% ones)
   - Test critical glitch (glitch + 0 hits)
   - Test dice sorting order (hits first, ones last)
   - Statistical test: verify unbiased distribution over many rolls

3. **edge-actions.test.ts**
   - Test second chance preserves hits
   - Test Edge availability check
   - Test push the limit adds Edge dice
   - Test cannot spend more Edge than available

#### API Tests: `/app/api/characters/[characterId]/actions/__tests__/`

1. **route.test.ts**
   - Test successful roll creates history record
   - Test 401 for unauthenticated requests
   - Test 404 for non-existent character
   - Test pool validation (minimum 1 die)
   - Test action is linked to correct character

2. **reroll.test.ts**
   - Test reroll requires available Edge
   - Test reroll preserves original hits
   - Test reroll updates action record
   - Test cannot reroll same action twice (configurable)

#### Storage Tests: `/lib/storage/__tests__/action-history.test.ts`

1. Test action history creation
2. Test action append to existing history
3. Test history retrieval with limit
4. Test atomic write integrity

### Manual Testing Checklist

1. **Basic Roll Flow**
   - [ ] Create character with known attributes/skills
   - [ ] Open action roller on character sheet
   - [ ] Build pool from attribute + skill
   - [ ] Roll dice and verify hit/glitch calculation
   - [ ] Confirm action saved to history

2. **Edge Spending**
   - [ ] Verify Edge display matches character
   - [ ] Spend Edge for reroll
   - [ ] Confirm Edge decrements in character data
   - [ ] Verify reroll preserves original hits
   - [ ] Test cannot overspend Edge

3. **Wound Modifiers**
   - [ ] Apply physical damage to character
   - [ ] Verify wound modifier appears in pool builder
   - [ ] Confirm pool total is reduced correctly
   - [ ] Test combined physical + stun wounds

4. **History and Audit**
   - [ ] Roll multiple actions
   - [ ] View action history page
   - [ ] Expand action to see full details
   - [ ] Verify pool configuration recorded
   - [ ] Export history to CSV

5. **Edition Rules**
   - [ ] Verify SR5 uses 5-6 as hits
   - [ ] Confirm glitch at >50% ones
   - [ ] Confirm critical glitch at glitch + 0 hits
   - [ ] (Future) Test SR4 exploding sixes when implemented

### Edge Cases to Test

1. **Zero dice pool**: Should be prevented or return automatic failure
2. **All hits**: Should not trigger glitch
3. **All ones**: Should trigger critical glitch
4. **Edge at 0**: Should disable reroll button
5. **Concurrent actions**: File storage should handle sequential writes
6. **Character without edge attribute**: Should default to 0

## Dependency Ordering

Implementation should proceed in this order:

1. **Phase 1**: Type definitions (no dependencies)
2. **Phase 2**: Edition ruleset data (requires Phase 1 types)
3. **Phase 3**: Rules engine (requires Phase 1 + 2)
4. **Phase 4**: Storage layer (requires Phase 1)
5. **Phase 5**: API endpoints (requires Phase 3 + 4)
6. **Phase 6**: React hooks (requires Phase 5)
7. **Phase 7**: UI components (requires Phase 6)
8. **Phase 8**: Integration (requires Phase 7)

Each phase should be committed separately for clean git history.
