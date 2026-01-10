# Implementation Plan: Magic Mastery System

## Goal Description

Implement a complete Magic Mastery system that governs supernatural traditions, spellcasting mechanics, drain resolution, astral interactions, and magical resource management. This capability ensures that all magical abilities operate within edition-specific constraints, providing authoritative validation of magical potential and its interaction with character essence.

**Target Capability:** `mechanics.magic-mastery.md`

**Current State:** The codebase has foundational magical types defined (`TraditionData`, `SpellData`, `AdeptPowerCatalogItem`, `RitualData`) and comprehensive catalog data in `core-rulebook.json`. Character types support magic attributes, tradition selection, and spell storage. However, there is no enforcement of tradition requirements, no drain calculation system, no astral state management, and no integration with the essence/magic degradation loop.

---

## User Review Required

> [!NOTE]
> ✅ **Magical Path Validation Scope**: Confirmed - validates magical paths at character level; astral projection/combat belongs to Action Execution/Resolution.

> [!NOTE]
> ✅ **Initiation System**: Confirmed - basic initiation (grade + karma cost) included in Phase 6; metamagic selection and masking deferred to future phases.

> [!NOTE]
> ✅ **Dependency on Augmentation Systems**: Confirmed - Magic Mastery will include **minimal essence tracking** (read-only) sufficient for magic degradation calculations. Augmentation Systems (scheduled after Magic/Matrix/Rigging) will later own essence modification operations. Integration point: Augmentation Systems will call Magic Mastery's degradation logic after essence changes.

---

## Architectural Decisions (Approved)

The following architectural decisions have been reviewed and approved:

| Decision                            | Approved Choice                                           | Rationale                                                                 |
| ----------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Drain Calculation Location**      | Server-side with client preview                           | Ensures rule integrity while allowing UI responsiveness                   |
| **Astral State Management**         | Ephemeral (session-level, not persisted)                  | Astral projection is temporary; persist only during scenes                |
| **Tradition Attribute Enforcement** | Hard block during creation, warning during advancement    | Prevents invalid characters at creation; allows GM override post-creation |
| **Essence-Magic Link**              | Read-only in Magic Mastery; owned by Augmentation Systems | Magic reads essence state; Augmentation modifies it                       |
| **Initiation Scope**                | Basic initiation (grade + karma cost); defer metamagic    | Enables advancement without full metamagic complexity                     |

---

## Proposed Changes

### Phase 1: Core Type Definitions and Validation

#### 1.1 Magic State Types

**File:** [NEW] `/lib/types/magic.ts`

Define comprehensive types for magical state management:

```typescript
/**
 * Character's current magical state
 */
export interface MagicState {
  magicalPath: MagicalPath;
  traditionId?: string;
  mentorSpiritId?: string;

  // Core ratings
  magicRating: number;
  initiateGrade: number;

  // Metamagics (from initiation)
  metamagics: string[];

  // Active states
  sustainedSpells: SustainedSpell[];
  boundSpirits: BoundSpiritState[];
  activeFoci: ActiveFocus[];

  // Power points for adepts
  powerPointsTotal: number;
  powerPointsSpent: number;
}

export interface SustainedSpell {
  spellId: string;
  force: number;
  targets: string[];
  dicePoolPenalty: number; // -2 per sustained spell
  sustainedSince: ISODateString;
}

export interface BoundSpiritState {
  spiritType: SpiritType;
  force: number;
  servicesRemaining: number;
  bound: boolean; // true = bound, false = unbound (temp summoned)
  tasks: SpiritTask[];
}

export interface SpiritTask {
  type: "aid" | "remote-service" | "combat" | "other";
  description: string;
  startedAt: ISODateString;
}

export interface ActiveFocus {
  focusId: string;
  focusType: FocusType;
  force: number;
  bonded: boolean;
  active: boolean;
}

export interface DrainResult {
  drainValue: number;
  drainType: "stun" | "physical";
  resistancePool: number;
  resistanceHits?: number;
  damageApplied?: number;
}
```

**Satisfies:**

- Guarantee: "Magical traditions MUST be authoritative and exclusively bound to their ruleset-defined attributes"
- Requirement: "Mechanical effects of active magical states MUST be automatically propagated to relevant derived statistics"

---

#### 1.2 Tradition Validation Service

**File:** [NEW] `/lib/rules/magic/tradition-validator.ts`

```typescript
export interface TraditionValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  drainAttributes: [string, string];
  spiritTypes: TraditionSpiritTypes;
}

/**
 * Validate tradition eligibility for a character
 */
export function validateTraditionEligibility(
  character: Character,
  traditionId: string,
  ruleset: LoadedRuleset
): TraditionValidationResult;

/**
 * Get drain attributes for a tradition (handles drain variants)
 */
export function getDrainAttributes(
  tradition: TraditionData,
  character: Character
): [string, string];

/**
 * Validate magical path consistency
 * - Mundane cannot have spells/powers
 * - Adept cannot have spells (only adept powers)
 * - Technomancer has resonance, not magic
 */
export function validateMagicalPathConsistency(
  character: Character,
  ruleset: LoadedRuleset
): TraditionValidationResult;
```

**Satisfies:**

- Requirement: "The system MUST enforce mandatory tradition-specific attribute requirements during character initialization"
- Constraint: "A character MUST NOT possess magical potential if their Magic rating is zero or if they lack a defined tradition"

---

#### 1.3 Spell and Power Validation

**File:** [NEW] `/lib/rules/magic/spell-validator.ts`

```typescript
export interface SpellValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  budgetRemaining?: number;
}

/**
 * Validate spell allocation against character's magical budget
 */
export function validateSpellAllocation(
  character: Character,
  spellIds: string[],
  ruleset: LoadedRuleset
): SpellValidationResult;

/**
 * Validate adept power allocation against power point budget
 */
export function validateAdeptPowerAllocation(
  character: Character,
  powers: AdeptPower[],
  ruleset: LoadedRuleset
): SpellValidationResult;

/**
 * Check if spell is compatible with character's tradition
 */
export function isSpellCompatible(
  spellId: string,
  character: Character,
  ruleset: LoadedRuleset
): boolean;

/**
 * Validate spell against ruleset definition
 */
export function getSpellDefinition(
  spellId: string,
  category: SpellCategory,
  ruleset: LoadedRuleset
): SpellData | null;
```

**Satisfies:**

- Requirement: "Every spell, ritual, and adept power MUST be bound to a verifiable ruleset definition"
- Requirement: "Allocation of spells and powers MUST be constrained by character-specific magical budgets and skill ratings"

---

### Phase 2: Drain Calculation Engine

#### 2.1 Drain Calculator

**File:** [NEW] `/lib/rules/magic/drain-calculator.ts`

```typescript
export interface DrainCalculationInput {
  action: "spellcasting" | "summoning" | "banishing" | "binding" | "ritual" | "adept-power";
  force: number;
  spellId?: string;
  spiritType?: SpiritType;
  ritualId?: string;
  adeptPower?: AdeptPower;
  edgeUsed?: boolean;
}

export interface DrainCalculationResult {
  drainValue: number;
  drainFormula: string;
  drainType: "stun" | "physical"; // Physical if drain > Magic rating
  resistancePool: number;
  resistanceFormula: string;
  breakdown: DrainBreakdown;
}

export interface DrainBreakdown {
  baseFormula: string;
  forceValue: number;
  modifiers: DrainModifier[];
  finalValue: number;
}

/**
 * Calculate drain for a magical action
 */
export function calculateDrain(
  character: Character,
  input: DrainCalculationInput,
  ruleset: LoadedRuleset
): DrainCalculationResult;

/**
 * Calculate drain resistance pool (Tradition Drain Attributes)
 */
export function calculateDrainResistance(character: Character, tradition: TraditionData): number;

/**
 * Parse drain formula (e.g., "F-3", "F/2+1", "F") and calculate value
 */
export function parseDrainFormula(formula: string, force: number): number;

/**
 * Determine if drain is physical (exceeds Magic rating) or stun
 */
export function getDrainType(drainValue: number, magicRating: number): "stun" | "physical";
```

**Satisfies:**

- Guarantee: "Spellcasting and ritual resolution MUST adhere to strictly defined drain formulas"
- Requirement: "The system MUST provide Authoritative Drain calculations for all magical actions"

---

#### 2.2 Drain Application

**File:** [NEW] `/lib/rules/magic/drain-application.ts`

```typescript
export interface DrainApplicationResult {
  damageApplied: number;
  damageType: "stun" | "physical";
  resistanceHits: number;
  characterCondition: {
    stunDamage: number;
    physicalDamage: number;
    woundModifier: number;
  };
  burnoutWarning?: boolean; // If close to incapacitation
}

/**
 * Apply drain damage after resistance roll
 */
export function applyDrain(
  character: Character,
  drainResult: DrainCalculationResult,
  resistanceHits: number
): DrainApplicationResult;

/**
 * Check for burnout condition (drain incapacitation risks)
 */
export function checkBurnoutRisk(character: Character, pendingDrain: number): boolean;

/**
 * Track cumulative drain for session/scene
 */
export interface DrainSession {
  sessionId: string;
  characterId: string;
  drainHistory: DrainHistoryEntry[];
  totalDrainTaken: number;
}

export interface DrainHistoryEntry {
  timestamp: ISODateString;
  action: string;
  drainBase: number;
  drainResisted: number;
  damageApplied: number;
}
```

**Satisfies:**

- Requirement: "Cumulative magical fatigue or 'burnout' states MUST be persistent and impact future magical resolution"
- Guarantee: "resource expenditures... drain mechanics"

---

### Phase 3: Essence-Magic Integration

#### 3.1 Magic Degradation Service

**File:** [NEW] `/lib/rules/magic/essence-magic-link.ts`

```typescript
export interface EssenceMagicState {
  baseEssence: number; // Typically 6.0
  currentEssence: number;
  essenceLost: number;
  essenceHole: number; // For tracking permanent loss
  baseMagicRating: number;
  effectiveMagicRating: number; // After essence loss
  magicLostToEssence: number;
}

/**
 * Calculate effective Magic rating based on essence loss
 * Per SR5: Magic reduced by 1 for each full point of Essence lost
 */
export function calculateEffectiveMagic(
  baseMagicRating: number,
  essenceLost: number,
  editionRules: AugmentationRulesData
): number;

/**
 * Check if character can still use magic (Magic > 0, has tradition)
 */
export function canUseMagic(character: Character): boolean;

/**
 * Check if character's current essence supports their tradition
 * Some traditions may have minimum essence requirements
 */
export function validateEssenceForTradition(
  character: Character,
  tradition: TraditionData
): boolean;

/**
 * Calculate impact of proposed augmentation on magic rating
 */
export function previewAugmentationMagicImpact(
  character: Character,
  proposedEssenceCost: number
): EssenceMagicState;
```

**Satisfies:**

- Guarantee: "The system MUST enforce a persistent link between Essence loss and the degradation of magical/resonance potential"
- Constraint: "Magical abilities MUST NOT be exercised if the character's current Essence state violates the tradition's minimum requirements"

---

### Phase 4: Magical Content Management

#### 4.1 Spell Management

**File:** [MODIFY] `/lib/rules/RulesetContext.tsx`

Add hooks for spell and adept power management:

```typescript
/**
 * Hook to get all spells from the ruleset by category
 */
export function useSpells(): SpellsCatalogData;

/**
 * Hook to get a specific spell by ID
 */
export function useSpell(spellId: string): SpellData | null;

/**
 * Hook to get adept powers from the ruleset
 */
export function useAdeptPowers(): AdeptPowerCatalogItem[];

/**
 * Hook to get rituals from the ruleset
 */
export function useRituals(): RitualData[];

/**
 * Hook to get mentor spirits (for quality selection integration)
 */
export function useMentorSpirits(): MentorSpiritData[];
```

**Satisfies:**

- Requirement: "Every spell, ritual, and adept power MUST be bound to a verifiable ruleset definition"

---

#### 4.2 Ruleset Content Extraction

**File:** [MODIFY] `/lib/rules/loader.ts`

Add extraction functions for magic content:

```typescript
/**
 * Extract spells from a loaded ruleset
 */
export function extractSpells(ruleset: LoadedRuleset): SpellsCatalogData;

/**
 * Extract adept powers from a loaded ruleset
 */
export function extractAdeptPowers(ruleset: LoadedRuleset): AdeptPowerCatalogItem[];

/**
 * Extract rituals from a loaded ruleset
 */
export function extractRituals(ruleset: LoadedRuleset): RitualData[];

/**
 * Extract mentor spirits from a loaded ruleset
 */
export function extractMentorSpirits(ruleset: LoadedRuleset): MentorSpiritData[];

/**
 * Extract ritual keywords from a loaded ruleset
 */
export function extractRitualKeywords(ruleset: LoadedRuleset): RitualKeywordData[];
```

---

### Phase 5: Character Creation Integration

#### 5.1 Magic Step Wizard Integration

**File:** [MODIFY] `/app/characters/create/components/steps/MagicStep.tsx`

Enhance the magic selection step to:

- Validate tradition selection against priority
- Enforce spell limits based on priority
- Calculate and display spell/power budgets
- Preview Power Point allocation for adepts
- Integrate mentor spirit selection (if applicable quality)

---

#### 5.2 Spell Selection Component

**File:** [NEW] `/app/characters/create/components/SpellSelector.tsx`

```typescript
interface SpellSelectorProps {
  character: Partial<Character>;
  spellLimit: number;
  selectedSpells: string[];
  onSpellsChange: (spells: string[]) => void;
  ruleset: LoadedRuleset;
}

// Features:
// - Category tabs (Combat, Detection, Health, Illusion, Manipulation)
// - Spell cards with name, type, range, duration, drain
// - Budget counter
// - Search/filter
// - Incompatibility warnings
```

---

#### 5.3 Adept Power Selector Component

**File:** [NEW] `/app/characters/create/components/AdeptPowerSelector.tsx`

```typescript
interface AdeptPowerSelectorProps {
  character: Partial<Character>;
  powerPointBudget: number;
  selectedPowers: AdeptPower[];
  onPowersChange: (powers: AdeptPower[]) => void;
  ruleset: LoadedRuleset;
}

// Features:
// - Power point tracker (spent/remaining)
// - Power cards with cost, activation, description
// - Level selection for leveled powers
// - Skill/attribute specification for applicable powers
// - Real-time PP calculation
```

---

### Phase 6: Character Advancement Integration

#### 6.1 Magical Advancement Validation

**File:** [MODIFY] `/lib/rules/advancement/validators.ts`

Add validation for magical advancement types:

```typescript
/**
 * Validate spell learning via karma
 */
export function validateSpellAdvancement(
  character: Character,
  spellId: string,
  ruleset: LoadedRuleset
): AdvancementValidationResult;

/**
 * Validate initiation grade increase
 */
export function validateInitiationAdvancement(
  character: Character,
  newGrade: number,
  ordealUsed: boolean,
  ruleset: LoadedRuleset
): AdvancementValidationResult;

/**
 * Calculate karma cost for initiation
 */
export function calculateInitiationKarmaCost(
  currentGrade: number,
  ordealUsed: boolean,
  groupInitiation: boolean
): number;

/**
 * Validate adept power purchase via karma
 */
export function validateAdeptPowerAdvancement(
  character: Character,
  power: AdeptPower,
  ruleset: LoadedRuleset
): AdvancementValidationResult;
```

**Satisfies:**

- Requirement: "Transitions into magical advancement (e.g., Initiation) MUST satisfy all prerequisites and resource requirements"

---

### Phase 7: API Layer

#### 7.1 Magic Validation API

**File:** [NEW] `/app/api/magic/validate/route.ts`

```typescript
// POST: Validate magical configuration
// Request: { characterId, tradition, spells, powers }
// Response: { valid, errors, warnings, budgetStatus }
```

---

#### 7.2 Drain Calculation API

**File:** [NEW] `/app/api/magic/drain/route.ts`

```typescript
// POST: Calculate drain for a magical action
// Request: { characterId, action, force, spellId?, spiritType? }
// Response: { drainValue, drainType, resistancePool, formula }
```

---

#### 7.3 Magic State API

**File:** [NEW] `/app/api/characters/[id]/magic/route.ts`

```typescript
// GET: Get character's magical state
// Response: { magicState, spellsKnown, powersKnown, sustainedSpells, boundSpirits }

// PATCH: Update magical state (sustain/drop spells, dismiss spirits)
// Request: { sustainedSpells?, boundSpirits?, activeFoci? }
```

---

### Phase 8: UI Components

#### 8.1 Magic Summary Panel

**File:** [NEW] `/components/character/MagicSummary.tsx`

Display on character sheet:

- Tradition and drain attributes
- Magic rating (current/max)
- Initiate grade
- Power points (for adepts)
- Sustained spell count and penalties
- Bound spirits with services

---

#### 8.2 Spellbook Component

**File:** [NEW] `/components/character/Spellbook.tsx`

- List of known spells by category
- Spell details (range, duration, drain, type)
- Quick dice pool calculation
- Cast spell action button (integrates with Action Execution)

---

#### 8.3 Adept Power List

**File:** [NEW] `/components/character/AdeptPowerList.tsx`

- List of acquired adept powers
- Power point cost breakdown
- Activation info
- Toggle for active powers (where applicable)

---

## Verification Plan

### Automated Tests

#### Unit Tests

**File:** [NEW] `/lib/rules/magic/__tests__/tradition-validator.test.ts`

| Test Case                                     | Capability Reference                                    |
| --------------------------------------------- | ------------------------------------------------------- |
| Validates tradition eligibility for mage      | Requirement: "enforce mandatory tradition requirements" |
| Rejects tradition for mundane character       | Constraint: "MUST NOT possess magical potential if..."  |
| Returns correct drain attributes for Hermetic | Guarantee: "authoritative tradition-defined attributes" |
| Handles drain variants correctly              | Guarantee: "tradition-specific attributes"              |

**File:** [NEW] `/lib/rules/magic/__tests__/spell-validator.test.ts`

| Test Case                                | Capability Reference                                  |
| ---------------------------------------- | ----------------------------------------------------- |
| Validates spell allocation within budget | Requirement: "constrained by magical budgets"         |
| Rejects spell over budget                | Requirement: "constrained by magical budgets"         |
| Validates spell exists in ruleset        | Requirement: "bound to verifiable ruleset definition" |
| Rejects incompatible sourcebook content  | Constraint: "incompatible ruleset bundles prohibited" |

**File:** [NEW] `/lib/rules/magic/__tests__/drain-calculator.test.ts`

| Test Case                                    | Capability Reference                                    |
| -------------------------------------------- | ------------------------------------------------------- |
| Calculates F-3 drain formula correctly       | Requirement: "Authoritative Drain calculations"         |
| Calculates F/2 drain formula correctly       | Requirement: "Authoritative Drain calculations"         |
| Determines physical drain when exceeds Magic | Requirement: "drain formulas and resource expenditures" |
| Calculates resistance pool from tradition    | Requirement: "action-specific variables and attributes" |

**File:** [NEW] `/lib/rules/magic/__tests__/essence-magic-link.test.ts`

| Test Case                                    | Capability Reference                                     |
| -------------------------------------------- | -------------------------------------------------------- |
| Reduces Magic by 1 per full Essence lost     | Guarantee: "persistent link between Essence loss and..." |
| Returns false for canUseMagic when Magic = 0 | Constraint: "MUST NOT possess magical potential if..."   |
| Tracks essence hole correctly                | Guarantee: "persistent link"                             |
| Adept loses power points with essence loss   | Guarantee: "degradation of magical potential"            |

**File:** [NEW] `/lib/rules/magic/__tests__/adept-power-validator.test.ts`

| Test Case                                    | Capability Reference                          |
| -------------------------------------------- | --------------------------------------------- |
| Validates power point budget                 | Requirement: "constrained by magical budgets" |
| Rejects powers exceeding PP budget           | Requirement: "constrained by magical budgets" |
| Validates leveled power max levels           | Requirement: "bound to ruleset definition"    |
| Validates skill specification for applicable | Requirement: "bound to ruleset definition"    |

---

#### Integration Tests

**File:** [NEW] `/lib/rules/magic/__tests__/magic-flow.integration.test.ts`

| Test Case                                   | Capability Reference                                   |
| ------------------------------------------- | ------------------------------------------------------ |
| Full mage character creation with spells    | Full system integration                                |
| Adept creation with power points allocation | Full system integration                                |
| Mystic adept with both spells and powers    | Full system integration                                |
| Initiation advancement with karma cost      | Requirement: "prerequisites and resource requirements" |

---

#### API Tests

**File:** [NEW] `/app/api/magic/__tests__/drain.test.ts`

| Test Case                              | Capability Reference                            |
| -------------------------------------- | ----------------------------------------------- |
| Returns correct drain for combat spell | Requirement: "Authoritative Drain calculations" |
| Returns correct drain for summoning    | Requirement: "Authoritative Drain calculations" |
| Requires authentication                | Security requirement                            |

---

### Manual Verification Checklist

1. **Tradition Selection**
   - [ ] Create mage character and select Hermetic tradition
   - [ ] Verify drain attributes show LOG + WIL
   - [ ] Attempt to select tradition for Mundane character (should fail)

2. **Spell Selection**
   - [ ] Select spells up to creation limit
   - [ ] Verify cannot exceed spell limit
   - [ ] Verify spell details match rulebook data

3. **Adept Power Selection**
   - [ ] Create adept character
   - [ ] Select powers up to power point budget
   - [ ] Verify PP tracking updates correctly
   - [ ] Test leveled powers increment properly

4. **Drain Calculation**
   - [ ] Cast spell at Force 6
   - [ ] Verify drain formula applied correctly
   - [ ] Verify drain type changes to physical when > Magic

5. **Essence-Magic Link**
   - [ ] Install cyberware on mage (if Augmentation Systems implemented)
   - [ ] Verify Magic rating reduced appropriately
   - [ ] Verify power points reduced for adept

6. **Character Sheet Display**
   - [ ] Verify Magic Summary shows all relevant info
   - [ ] Verify Spellbook displays known spells
   - [ ] Verify dice pool previews are accurate

---

## Implementation Order

```
Phase 1: Core Type Definitions and Validation
├── 1.1 Magic State Types
├── 1.2 Tradition Validation Service
└── 1.3 Spell and Power Validation

Phase 2: Drain Calculation Engine
├── 2.1 Drain Calculator
└── 2.2 Drain Application

Phase 3: Essence-Magic Integration
└── 3.1 Magic Degradation Service

Phase 4: Magical Content Management
├── 4.1 RulesetContext Hooks
└── 4.2 Loader Extraction Functions

Phase 5: Character Creation Integration
├── 5.1 Magic Step Enhancement
├── 5.2 Spell Selector Component
└── 5.3 Adept Power Selector Component

Phase 6: Character Advancement Integration
└── 6.1 Magical Advancement Validation

Phase 7: API Layer
├── 7.1 Magic Validation API
├── 7.2 Drain Calculation API
└── 7.3 Magic State API

Phase 8: UI Components
├── 8.1 Magic Summary Panel
├── 8.2 Spellbook Component
└── 8.3 Adept Power List
```

---

## Dependencies

### Required Before Implementation

- `ruleset.integrity` ✅ - For authoritative ruleset data access
- `character.management` ✅ - For character state management

### Recommended Before Implementation

- `character.augmentation-systems` ⏳ - For essence tracking (can stub if not ready)

### Will Integrate With

- `mechanics.action-resolution` ✅ - For spellcasting dice pools
- `mechanics.action-execution` ✅ - For magical action execution
- `character.advancement` ✅ - For initiation and spell learning

---

## Future Phases (Out of Scope)

The following are explicitly out of scope for this implementation but noted for future work:

1. **Astral Combat Resolution** - Belongs to Action Resolution/Execution
2. **Spirit Summoning UI** - Complex, requires Encounter Governance
3. **Ritual Execution Flow** - Multi-participant rituals need Live Sessions
4. **Metamagic Selection** - Part of Initiation; deferred
5. **Magical Lodge Management** - Campaign/location feature
6. **Reagent Tracking** - Consumable gear management
7. **Focus Binding UI** - Needs karma transaction system
