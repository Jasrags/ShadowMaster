# Implementation Plan: Matrix Operations System

## Goal Description

Implement a complete Matrix Operations system that governs digital interactions, network navigation, cyberdeck state, and persona management. This capability ensures that all matrix-level actions are governed by edition-specific network protocols, program requirements, and hardware constraints, providing a stable and verifiable state for digital entities within the global data grid.

**Target Capability:** `mechanics.matrix-operations.md`

**Current State:** The codebase has foundational matrix types defined (`ProgramCatalogItem`, `CharacterProgram`, `ProgramsModule`) and comprehensive catalog data in `core-rulebook.json` including cyberdecks and programs. Character types support program ownership. However, there is no enforcement of hardware requirements, no persona/matrix state management, no Overwatch Score tracking, no matrix damage system, and no integration with matrix action resolution.

---

## User Review Required

> [!WARNING]
> **Hardware Validation Scope**: Should hardware validation (cyberdeck attribute configuration) be enforced at character level, or deferred to scene/encounter level? Recommendation: Enforce at character level for gear ownership, allow dynamic reconfiguration during gameplay.

> [!WARNING]
> **Overwatch Score Persistence**: Should Overwatch Score persist between sessions, or reset per scene? Recommendation: Ephemeral (session/scene-level) as per Shadowrun rules—OS resets when decker jacks out.

> [!WARNING]
> **Matrix Damage Model**: Should matrix damage (Brain Fry, dump shock) be tracked separately or integrated with existing condition tracking? Recommendation: Integrate with existing `condition` tracking, adding `matrixDamage` for biofeedback damage sources.

> [!WARNING]
> **Dependency on Action Resolution**: Matrix actions (Hack on the Fly, Brute Force, etc.) require dice pool construction. Confirm integration point with `mechanics.action-resolution`.

---

## Architectural Decisions (Pending Approval)

The following architectural decisions require user approval:

| Decision                       | Proposed Choice                                       | Rationale                                                               |
| ------------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| **Cyberdeck Attribute Config** | Validated at gear level, reconfigurable during scenes | Deckers swap Attack/Sleaze/DP/Firewall dynamically; validate array fits |
| **Overwatch Score Management** | Ephemeral (scene-level, not persisted to character)   | OS resets when decker jacks out; persist only during active matrix runs |
| **Persona State**              | Tracked in MatrixState, ephemeral during scenes       | Persona icons, matrix condition monitor are session-level               |
| **Matrix Damage Integration**  | Extend `condition` with `matrixDamage` field          | Biofeedback damage causes stun/physical based on mode (AR vs VR)        |
| **Program Slot Enforcement**   | Hard validation at load time, warning at creation     | Prevent loading more programs than deck supports                        |

---

## Proposed Changes

### Phase 1: Core Type Definitions

#### 1.1 Matrix State Types

**File:** [NEW] `/lib/types/matrix.ts`

Define comprehensive types for matrix state management:

```typescript
/**
 * Matrix connection mode
 */
export type MatrixMode = "ar" | "cold-sim-vr" | "hot-sim-vr";

/**
 * Device type for matrix operations
 */
export type MatrixDeviceType = "cyberdeck" | "commlink" | "rcc" | "technomancer-living-persona";

/**
 * Character's current matrix state (ephemeral, session-level)
 */
export interface MatrixState {
  // Connection status
  isConnected: boolean;
  connectionMode: MatrixMode;

  // Active hardware
  activeDeviceId?: string;
  activeDeviceType?: MatrixDeviceType;

  // Cyberdeck attribute configuration (for deckers)
  attributeConfig?: CyberdeckAttributeConfig;

  // Persona state
  persona: MatrixPersona;

  // Running programs
  loadedPrograms: LoadedProgram[];
  programSlotsUsed: number;
  programSlotsMax: number;

  // Matrix condition
  matrixConditionMonitor: number; // Max = Device Rating + 8
  matrixDamageTaken: number;

  // Overwatch Score (session-level)
  overwatchScore: number;
  overwatchThreshold: number; // 40 in SR5
  overwatchConverged: boolean;

  // Marks held by this persona
  marksHeld: MatrixMark[];

  // Marks on this persona (from other entities)
  marksReceived: MatrixMark[];

  // Current location in matrix
  currentGrid?: string;
  currentHost?: string;
  hostAuthLevel?: "outsider" | "user" | "security" | "admin";

  // Session tracking
  sessionStartedAt?: ISODateString;
}

/**
 * Cyberdeck attribute configuration (can be reconfigured)
 */
export interface CyberdeckAttributeConfig {
  attack: number;
  sleaze: number;
  dataProcessing: number;
  firewall: number;
}

/**
 * Matrix persona representation
 */
export interface MatrixPersona {
  personaId: string;
  iconDescription?: string;

  // Persona attributes (derived from deck + programs)
  attack: number;
  sleaze: number;
  dataProcessing: number;
  firewall: number;

  // Device Rating (for matrix condition monitor)
  deviceRating: number;
}

/**
 * A program currently loaded and running
 */
export interface LoadedProgram {
  programId: string;
  catalogId: string;
  name: string;
  category: "common" | "hacking" | "agent";
  rating?: number; // For agents
  isRunning: boolean;
  effects?: ProgramEffect[];
}

/**
 * Program effect on matrix stats
 */
export interface ProgramEffect {
  type: "attribute_bonus" | "action_bonus" | "defense_bonus" | "special";
  target?: string;
  value?: number;
  description?: string;
}

/**
 * Matrix mark (authorization level)
 */
export interface MatrixMark {
  id: string;
  targetId: string;
  targetType: "device" | "persona" | "file" | "host" | "ic";
  targetName: string;
  markCount: number; // 1-3 marks
  placedAt: ISODateString;
  expiresAt?: ISODateString;
}

/**
 * Overwatch Score event (for audit trail)
 */
export interface OverwatchEvent {
  timestamp: ISODateString;
  action: string;
  scoreAdded: number;
  totalScore: number;
  triggeredConvergence?: boolean;
}
```

**Satisfies:**

- Guarantee: "Matrix identity and presence MUST be authoritative and bound to a specific hardware or persona identifier"
- Requirement: "The system MUST enforce mandatory hardware-specific attribute requirements"

---

#### 1.2 Cyberdeck Types

**File:** [MODIFY] `/lib/types/edition.ts`

Add cyberdeck catalog types (if not already present in gear):

```typescript
/**
 * Cyberdeck catalog item in ruleset data
 */
export interface CyberdeckCatalogItem {
  id: string;
  name: string;

  // Device Rating (determines matrix condition monitor)
  deviceRating: number;

  // Attribute array (total points to distribute)
  attributeArray: CyberdeckAttributeArray;

  // Program slots
  programSlots: number;

  // Cost and availability
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;

  // Description and source
  description?: string;
  page?: number;
  source?: string;
}

/**
 * Cyberdeck attribute array (values to assign to ASDF)
 */
export interface CyberdeckAttributeArray {
  values: number[]; // e.g., [4, 3, 2, 1] for Erika MCD-1
}
```

---

#### 1.3 Character Matrix Equipment

**File:** [NEW] `/lib/types/matrix-equipment.ts`

```typescript
/**
 * Cyberdeck owned by a character
 */
export interface CharacterCyberdeck {
  id?: ID;
  /** Reference to catalog cyberdeck ID */
  catalogId: string;
  name: string;
  /** Custom name given by player */
  customName?: string;

  /** Device Rating */
  deviceRating: number;

  /** Attribute array from catalog */
  attributeArray: number[];

  /** Current attribute assignment */
  currentConfig: CyberdeckAttributeConfig;

  /** Max program slots */
  programSlots: number;

  /** Currently loaded programs */
  loadedPrograms: string[]; // Program IDs

  /** Cost in nuyen */
  cost: number;

  /** Availability rating */
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;

  /** Notes */
  notes?: string;
}

/**
 * Commlink owned by a character (simpler than cyberdeck)
 */
export interface CharacterCommlink {
  id?: ID;
  catalogId: string;
  name: string;
  customName?: string;

  deviceRating: number;
  dataProcessing: number;
  firewall: number;

  cost: number;
  availability: number;

  /** Running programs (limited functionality) */
  loadedPrograms: string[];

  notes?: string;
}
```

**Satisfies:**

- Requirement: "Hardware-specific limits (e.g., Data Processing, Firewall) MUST be automatically applied to all relevant matrix actions"

---

### Phase 2: Hardware Validation Services

#### 2.1 Cyberdeck Validator

**File:** [NEW] `/lib/rules/matrix/cyberdeck-validator.ts`

```typescript
export interface CyberdeckValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  effectiveAttributes: CyberdeckAttributeConfig;
}

/**
 * Validate cyberdeck attribute configuration
 * Ensures the assigned values match the deck's attribute array
 */
export function validateCyberdeckConfig(
  config: CyberdeckAttributeConfig,
  attributeArray: number[]
): CyberdeckValidationResult;

/**
 * Validate program loading against deck slots
 */
export function validateProgramLoad(
  deck: CharacterCyberdeck,
  programsToLoad: string[],
  ruleset: LoadedRuleset
): CyberdeckValidationResult;

/**
 * Check if character has valid matrix hardware
 */
export function hasValidMatrixHardware(character: Character): boolean;

/**
 * Get active cyberdeck for a character
 */
export function getActiveCyberdeck(character: Character): CharacterCyberdeck | null;
```

**Satisfies:**

- Constraint: "A character MUST NOT engage in matrix operations without a valid hardware interface or digital persona"
- Requirement: "The system MUST enforce mandatory hardware-specific attribute requirements"

---

#### 2.2 Program Slot Validator

**File:** [NEW] `/lib/rules/matrix/program-validator.ts`

```typescript
export interface ProgramValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  slotsUsed: number;
  slotsRemaining: number;
}

/**
 * Validate program allocation against hardware limits
 */
export function validateProgramAllocation(
  character: Character,
  programIds: string[],
  ruleset: LoadedRuleset
): ProgramValidationResult;

/**
 * Check if a program exists in the ruleset
 */
export function validateProgramExists(programId: string, ruleset: LoadedRuleset): boolean;

/**
 * Get program slot count for active device
 */
export function getProgramSlotLimit(character: Character): number;

/**
 * Check if program is compatible with device type
 */
export function isProgramCompatible(
  programId: string,
  deviceType: MatrixDeviceType,
  ruleset: LoadedRuleset
): boolean;
```

**Satisfies:**

- Requirement: "Active program slots MUST be constrained by hardware-specific memory and processing limits"
- Requirement: "Every matrix program and utility MUST be bound to a verifiable ruleset definition"

---

### Phase 3: Overwatch Score Engine

#### 3.1 Overwatch Score Calculator

**File:** [NEW] `/lib/rules/matrix/overwatch-calculator.ts`

```typescript
export interface OverwatchCalculationResult {
  previousScore: number;
  scoreAdded: number;
  newScore: number;
  convergenceTriggered: boolean;
  convergenceCountdown?: number;
}

/**
 * Calculate Overwatch Score increase for an action
 */
export function calculateOverwatchIncrease(
  action: MatrixAction,
  successLevel: "success" | "failure" | "glitch",
  currentOS: number
): OverwatchCalculationResult;

/**
 * Apply 2d6 OS increase for illegal actions
 */
export function rollOverwatchIncrease(): number;

/**
 * Check if convergence threshold reached
 */
export function checkConvergence(currentOS: number, threshold: number): boolean;

/**
 * Handle convergence effects
 */
export interface ConvergenceResult {
  os_reset: boolean;
  dumpshock_triggered: boolean;
  persona_destroyed: boolean;
  ic_dispatched: ICSpawnData[];
}

export function handleConvergence(
  character: Character,
  matrixState: MatrixState
): ConvergenceResult;
```

**Satisfies:**

- Guarantee: "The accumulation of digital 'Overwatch Score' MUST be auditable and result in predictable system interventions"

---

#### 3.2 Overwatch Session Tracker

**File:** [NEW] `/lib/rules/matrix/overwatch-tracker.ts`

```typescript
/**
 * Session-level Overwatch tracking
 */
export interface OverwatchSession {
  sessionId: string;
  characterId: string;
  startedAt: ISODateString;
  currentScore: number;
  threshold: number;
  events: OverwatchEvent[];
  converged: boolean;
  convergedAt?: ISODateString;
}

/**
 * Create a new overwatch tracking session
 */
export function startOverwatchSession(characterId: string): OverwatchSession;

/**
 * Record an overwatch event
 */
export function recordOverwatchEvent(
  session: OverwatchSession,
  action: string,
  scoreAdded: number
): OverwatchSession;

/**
 * End session (decker jacks out or converges)
 */
export function endOverwatchSession(
  session: OverwatchSession,
  reason: "jacked_out" | "converged" | "session_ended"
): OverwatchSession;
```

---

### Phase 4: Matrix Action Integration

#### 4.1 Matrix Action Validator

**File:** [NEW] `/lib/rules/matrix/action-validator.ts`

```typescript
export interface MatrixActionValidation {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  requiredMarks: number;
  requiredProgram?: string;
  isIllegalAction: boolean;
  overwatchRisk: boolean;
}

/**
 * Validate that a matrix action can be performed
 */
export function validateMatrixAction(
  character: Character,
  matrixState: MatrixState,
  action: MatrixAction,
  ruleset: LoadedRuleset
): MatrixActionValidation;

/**
 * Check mark requirements for an action
 */
export function checkMarkRequirements(
  action: MatrixAction,
  marksHeld: MatrixMark[],
  targetId: string
): boolean;

/**
 * Categorize action as legal/illegal
 */
export function isIllegalAction(action: MatrixAction): boolean;
```

**Satisfies:**

- Guarantee: "Digital interactions MUST adhere to strictly defined network protocols and action economy rules"
- Requirement: "The system MUST provide Authoritative resolution for matrix actions"

---

#### 4.2 Matrix Dice Pool Calculator

**File:** [NEW] `/lib/rules/matrix/dice-pool-calculator.ts`

```typescript
export interface MatrixDicePoolResult {
  pool: number;
  formula: string;
  breakdown: DicePoolComponent[];
  limit: number;
  limitType: "attack" | "sleaze" | "data_processing" | "firewall";
}

export interface DicePoolComponent {
  source: string;
  attribute?: string;
  skill?: string;
  program?: string;
  modifier?: number;
  value: number;
}

/**
 * Calculate dice pool for a matrix action
 */
export function calculateMatrixDicePool(
  character: Character,
  matrixState: MatrixState,
  action: MatrixAction,
  ruleset: LoadedRuleset
): MatrixDicePoolResult;

/**
 * Calculate matrix limit for an action
 */
export function calculateMatrixLimit(action: MatrixAction, matrixState: MatrixState): number;

/**
 * Get attribute value from current persona config
 */
export function getPersonaAttribute(
  matrixState: MatrixState,
  attribute: "attack" | "sleaze" | "dataProcessing" | "firewall"
): number;
```

**Satisfies:**

- Requirement: "Hardware-specific limits MUST be automatically applied to all relevant matrix actions"

---

### Phase 5: Mark Management

#### 5.1 Mark Tracker

**File:** [NEW] `/lib/rules/matrix/mark-tracker.ts`

```typescript
export interface MarkPlacementResult {
  success: boolean;
  mark: MatrixMark | null;
  errors: ValidationError[];
  newMarkCount: number;
}

/**
 * Place a mark on a target
 */
export function placeMark(
  matrixState: MatrixState,
  targetId: string,
  targetType: MatrixMark["targetType"],
  targetName: string
): MarkPlacementResult;

/**
 * Remove marks from a target
 */
export function removeMarks(
  matrixState: MatrixState,
  targetId: string,
  count?: number // undefined = remove all
): MatrixState;

/**
 * Check marks on a specific target
 */
export function getMarksOnTarget(matrixState: MatrixState, targetId: string): number;

/**
 * Validate mark requirements for an action
 */
export function hasRequiredMarks(
  matrixState: MatrixState,
  targetId: string,
  requiredMarks: number
): boolean;
```

**Satisfies:**

- Requirement: "Digital 'marks' or authorization states MUST be persistent and verifiable throughout a matrix session"

---

### Phase 6: Ruleset Content Management

#### 6.1 Matrix Hooks

**File:** [MODIFY] `/lib/rules/RulesetContext.tsx`

Add hooks for matrix content management:

```typescript
/**
 * Hook to get all cyberdecks from the ruleset
 */
export function useCyberdecks(): CyberdeckCatalogItem[];

/**
 * Hook to get a specific cyberdeck by ID
 */
export function useCyberdeck(deckId: string): CyberdeckCatalogItem | null;

/**
 * Hook to get all commlinks from the ruleset
 */
export function useCommlinks(): CommlinkCatalogItem[];

/**
 * Hook to get matrix action definitions
 */
export function useMatrixActions(): MatrixActionDefinition[];

/**
 * Hook to get IC types (for GM reference)
 */
export function useICTypes(): ICTypeData[];
```

---

#### 6.2 Ruleset Content Extraction

**File:** [MODIFY] `/lib/rules/loader.ts`

Add extraction functions for matrix content:

```typescript
/**
 * Extract cyberdecks from a loaded ruleset
 */
export function extractCyberdecks(ruleset: LoadedRuleset): CyberdeckCatalogItem[];

/**
 * Extract commlinks from a loaded ruleset
 */
export function extractCommlinks(ruleset: LoadedRuleset): CommlinkCatalogItem[];

/**
 * Extract matrix action definitions from a loaded ruleset
 */
export function extractMatrixActions(ruleset: LoadedRuleset): MatrixActionDefinition[];

/**
 * Extract IC types from a loaded ruleset
 */
export function extractICTypes(ruleset: LoadedRuleset): ICTypeData[];

/**
 * Extract host rating tables from a loaded ruleset
 */
export function extractHostRatings(ruleset: LoadedRuleset): HostRatingData[];
```

---

### Phase 7: Character Sheet Integration

#### 7.1 Character Type Updates

**File:** [MODIFY] `/lib/types/character.ts`

Add matrix-related fields to Character:

```typescript
// Add to Character interface:

/** Cyberdecks owned */
cyberdecks?: CharacterCyberdeck[];

/** Commlinks owned */
commlinks?: CharacterCommlink[];

/** Active matrix device ID (reference to cyberdecks or commlinks array) */
activeMatrixDeviceId?: string;

/** Current matrix state (ephemeral, session-level) */
matrixState?: MatrixState;
```

---

### Phase 8: API Layer

#### 8.1 Matrix State API

**File:** [NEW] `/app/api/characters/[id]/matrix/route.ts`

```typescript
// GET: Get character's matrix equipment and current state
// Response: { cyberdecks, commlinks, programs, matrixState? }

// PATCH: Update matrix state (load programs, reconfigure deck, etc.)
// Request: { loadPrograms?, unloadPrograms?, deckConfig?, connect?, disconnect? }
```

---

#### 8.2 Matrix Validation API

**File:** [NEW] `/app/api/matrix/validate/route.ts`

```typescript
// POST: Validate matrix configuration
// Request: { characterId, deckId, programIds, config }
// Response: { valid, errors, warnings, effectiveStats }
```

---

#### 8.3 Overwatch API

**File:** [NEW] `/app/api/matrix/overwatch/route.ts`

```typescript
// POST: Record overwatch event
// Request: { characterId, sessionId, action, scoreAdded }
// Response: { currentScore, convergenceTriggered, events }

// DELETE: End overwatch session (jack out)
// Request: { characterId, sessionId }
```

---

### Phase 9: UI Components

#### 9.1 Matrix Summary Panel

**File:** [NEW] `/components/character/MatrixSummary.tsx`

Display on character sheet:

- Active device and attributes (ASDF configuration)
- Program slots used/available
- Loaded programs list
- Matrix condition monitor
- Current Overwatch Score (if in session)
- Marks held/received summary

---

#### 9.2 Cyberdeck Configuration Panel

**File:** [NEW] `/components/character/CyberdeckConfig.tsx`

- Deck attribute array display
- Drag-and-drop ASDF configuration
- Real-time validation feedback
- Program slot indicator
- Quick-swap presets

---

#### 9.3 Program Manager

**File:** [NEW] `/components/character/ProgramManager.tsx`

- Owned programs list
- Load/unload interface
- Slot usage tracking
- Program effects display
- Search/filter by category

---

#### 9.4 Matrix Actions Panel

**File:** [NEW] `/components/character/MatrixActions.tsx`

- Available matrix actions by category
- Dice pool preview
- Mark requirement indicators
- Overwatch risk warnings
- Quick-action buttons

---

## Verification Plan

### Automated Tests

#### Unit Tests

**File:** [NEW] `/lib/rules/matrix/__tests__/cyberdeck-validator.test.ts`

| Test Case                               | Capability Reference                                   |
| --------------------------------------- | ------------------------------------------------------ |
| Validates attribute array configuration | Requirement: "enforce mandatory hardware requirements" |
| Rejects invalid ASDF assignment         | Requirement: "enforce mandatory hardware requirements" |
| Validates program slot limits           | Requirement: "constrained by hardware limits"          |
| Rejects program overload                | Requirement: "constrained by hardware limits"          |

**File:** [NEW] `/lib/rules/matrix/__tests__/program-validator.test.ts`

| Test Case                           | Capability Reference                                  |
| ----------------------------------- | ----------------------------------------------------- |
| Validates program exists in ruleset | Requirement: "bound to verifiable ruleset definition" |
| Validates program compatibility     | Constraint: "incompatible ruleset bundles prohibited" |
| Calculates slot usage correctly     | Requirement: "constrained by hardware limits"         |

**File:** [NEW] `/lib/rules/matrix/__tests__/overwatch-calculator.test.ts`

| Test Case                               | Capability Reference                          |
| --------------------------------------- | --------------------------------------------- |
| Calculates OS increase for illegal acts | Guarantee: "OS MUST be auditable"             |
| Triggers convergence at threshold       | Guarantee: "predictable system interventions" |
| Tracks session events correctly         | Guarantee: "OS MUST be auditable"             |
| Resets OS on jack out                   | Guarantee: "predictable system interventions" |

**File:** [NEW] `/lib/rules/matrix/__tests__/mark-tracker.test.ts`

| Test Case                               | Capability Reference                                   |
| --------------------------------------- | ------------------------------------------------------ |
| Places marks correctly (1-3 max)        | Requirement: "marks MUST be persistent and verifiable" |
| Validates mark requirements for actions | Requirement: "marks MUST be persistent and verifiable" |
| Removes marks on disconnect             | Requirement: "marks MUST be persistent and verifiable" |

**File:** [NEW] `/lib/rules/matrix/__tests__/dice-pool-calculator.test.ts`

| Test Case                               | Capability Reference                                 |
| --------------------------------------- | ---------------------------------------------------- |
| Calculates correct pool for Hack on Fly | Requirement: "Authoritative resolution for actions"  |
| Applies correct matrix limit            | Requirement: "hardware limits automatically applied" |
| Includes program bonuses                | Requirement: "update based on program modifications" |

---

#### Integration Tests

**File:** [NEW] `/lib/rules/matrix/__tests__/matrix-flow.integration.test.ts`

| Test Case                               | Capability Reference                          |
| --------------------------------------- | --------------------------------------------- |
| Full decker character with deck + progs | Full system integration                       |
| Matrix session with OS tracking         | Guarantee: "OS MUST be auditable"             |
| Mark placement and action validation    | Requirement: "marks MUST be persistent"       |
| Convergence handling and cleanup        | Guarantee: "predictable system interventions" |

---

#### API Tests

**File:** [NEW] `/app/api/matrix/__tests__/validate.test.ts`

| Test Case                    | Capability Reference                          |
| ---------------------------- | --------------------------------------------- |
| Validates deck configuration | Requirement: "hardware requirements enforced" |
| Returns program slot errors  | Requirement: "constrained by hardware limits" |
| Requires authentication      | Security requirement                          |

---

### Manual Verification Checklist

1. **Hardware Configuration**
   - [ ] Create decker character with cyberdeck
   - [ ] Configure ASDF attributes using drag-and-drop
   - [ ] Verify invalid configurations are rejected
   - [ ] Attempt to load programs exceeding slot limit (should fail)

2. **Program Management**
   - [ ] Load programs up to deck limit
   - [ ] Verify cannot exceed program slots
   - [ ] Verify program effects are applied to persona
   - [ ] Unload programs and verify slot recovery

3. **Matrix Session**
   - [ ] Connect to matrix (AR/VR modes)
   - [ ] Verify persona attributes display correctly
   - [ ] Perform illegal action, verify OS increases
   - [ ] Track OS until convergence threshold
   - [ ] Verify convergence effects trigger

4. **Mark Management**
   - [ ] Place marks on target via successful hack
   - [ ] Verify marks persist in session
   - [ ] Attempt action requiring marks (should succeed/fail based on marks)
   - [ ] Disconnect and verify marks cleared

5. **Character Sheet Display**
   - [ ] Verify Matrix Summary shows active deck
   - [ ] Verify program list displays correctly
   - [ ] Verify dice pool previews are accurate

---

## Implementation Order

```
Phase 1: Core Type Definitions
├── 1.1 Matrix State Types
├── 1.2 Cyberdeck Types
└── 1.3 Character Matrix Equipment

Phase 2: Hardware Validation Services
├── 2.1 Cyberdeck Validator
└── 2.2 Program Slot Validator

Phase 3: Overwatch Score Engine
├── 3.1 Overwatch Score Calculator
└── 3.2 Overwatch Session Tracker

Phase 4: Matrix Action Integration
├── 4.1 Matrix Action Validator
└── 4.2 Matrix Dice Pool Calculator

Phase 5: Mark Management
└── 5.1 Mark Tracker

Phase 6: Ruleset Content Management
├── 6.1 Matrix Hooks
└── 6.2 Ruleset Content Extraction

Phase 7: Character Sheet Integration
└── 7.1 Character Type Updates

Phase 8: API Layer
├── 8.1 Matrix State API
├── 8.2 Matrix Validation API
└── 8.3 Overwatch API

Phase 9: UI Components
├── 9.1 Matrix Summary Panel
├── 9.2 Cyberdeck Configuration Panel
├── 9.3 Program Manager
└── 9.4 Matrix Actions Panel
```

---

## Dependencies

### Required Before Implementation

- `ruleset.integrity` ✅ - For authoritative ruleset data access
- `character.management` ✅ - For character state management
- Programs catalog in core-rulebook.json ✅ - Exists

### Recommended Before Implementation

- `mechanics.action-resolution` ✅ - For matrix action dice pool integration

### Will Integrate With

- `mechanics.action-execution` ✅ - For matrix action execution flow
- `character.advancement` ✅ - For skill advancement (Computer, Hacking, etc.)
- `mechanics.encounter-governance` - For host/IC encounters (future)

---

## Future Phases (Out of Scope)

The following are explicitly out of scope for this implementation but noted for future work:

1. **Host Navigation** - Detailed host traversal and sculpting (needs Encounter Governance)
2. **IC Combat** - IC types, attack patterns, autonomous IC behavior
3. **Technomancer Integration** - Living Persona, sprites, echoes (separate capability)
4. **Matrix Topology** - Grids, noise, public/private hosts
5. **Cybercombat Resolution** - Full matrix combat rounds (part of Action Execution)
6. **Foundation Runs** - Deep host foundation exploration
7. **Data Bomb/File Interaction** - Complex file security systems
8. **Agent Deployment** - Autonomous agent programs running in matrix
