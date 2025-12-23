# Qualities System Specification

**Status:** Complete (Core system, UI, and Dynamic State management implemented)
**Last Updated:** 2025-12-22
**Category:** Core Functionality, Character System
**Dependencies:** RulesetSystem, CharacterCreation, AdvancementSystem

---

## Overview

The Qualities system manages positive and negative character traits that provide mechanical benefits, drawbacks, and roleplaying hooks. This specification covers the quality catalog structure, selection during character creation, post-creation acquisition/removal, effects system, dynamic state management, and gameplay integration.

### Key Concepts

- **Positive Qualities**: Purchased with Karma, provide benefits (max 25 Karma at creation)
- **Negative Qualities**: Grant bonus Karma, impose drawbacks (max 25 Karma gained at creation)
- **Per-Rating Qualities**: Qualities with multiple levels (e.g., High Pain Tolerance 1-3)
- **Specification Qualities**: Qualities requiring player-specified details (e.g., Aptitude: skill)
- **Dynamic State Qualities**: Qualities with gameplay state that changes over time (Addiction, Allergy, Dependents)
- **Post-Creation Costs**: Acquiring qualities after creation costs 2× Karma; buying off negatives costs 2×

---

## User Stories

### Character Creation

1. **As a player**, I want to browse available positive and negative qualities so I can customize my character.
2. **As a player**, I want to see karma costs and summaries for each quality to make informed choices.
3. **As a player**, I want the system to enforce the 25 Karma limit for positive and negative qualities.
4. **As a player**, I want to see which qualities I cannot take due to prerequisites or incompatibilities.
5. **As a player**, I want to specify details for qualities that require them (skill, attribute, allergen, etc.).

### Character Advancement

6. **As a player**, I want to acquire new positive qualities post-creation by spending 2× Karma.
7. **As a player**, I want to buy off negative qualities by spending 2× the original Karma bonus.
8. **As a GM**, I want to approve quality acquisitions that require narrative justification.
9. **As a player**, I want to see my current qualities and their effects on my character sheet.

### Gameplay Integration

10. **As a player**, I want quality effects to automatically apply to my dice pools and limits.
11. **As a player**, I want to track dynamic state for qualities like Addiction and Allergy.
12. **As a GM**, I want to update character dynamic state during gameplay (exposure, doses, etc.).

---

## Data Models

### Quality Catalog Entry

```typescript
interface Quality {
  id: string; // Unique identifier (e.g., "high-pain-tolerance")
  name: string; // Display name
  type: "positive" | "negative"; // Quality category
  karmaCost?: number; // Karma spent to acquire (positive)
  karmaBonus?: number; // Karma gained when taken (negative)
  summary: string; // Short description (1-2 sentences)
  description?: string; // Extended text with full mechanics
  source?: SourceReference; // Book and page reference
  tags?: string[]; // Categorization tags
  prerequisites?: QualityPrerequisites; // Requirements to take
  incompatibilities?: string[]; // Quality IDs that cannot coexist
  levels?: QualityLevel[]; // For per-rating qualities
  maxRating?: number; // Maximum rating if per-rating
  limit?: number; // How many times quality can be taken (default: 1)
  requiresSpecification?: boolean; // Whether player must specify details
  specificationLabel?: string; // Label for specification input
  specificationSource?: string; // Catalog to pull options from
  specificationOptions?: string[]; // Fixed list of valid options
  effects?: QualityEffect[]; // Gameplay effects
  dynamicState?: DynamicStateType; // For qualities with changing state
}
```

### Quality Selection (Character Data)

```typescript
interface QualitySelection {
  qualityId: string; // References catalog Quality.id
  rating?: number; // Chosen rating for per-rating qualities
  specification?: string; // Player-specified detail
  specificationId?: string; // ID when specification references catalog
  source: AcquisitionSource; // How/when quality was acquired
  acquisitionDate?: ISODateString; // When quality was acquired
  originalKarma?: number; // Original karma value (for buy-off)
  variant?: string; // For qualities with variants
  notes?: string; // Player/GM annotations
  active?: boolean; // Whether quality is currently active
  dynamicState?: QualityDynamicState; // Current state for dynamic qualities
}

type AcquisitionSource =
  | "creation" // During character creation
  | "advancement" // Purchased with Karma post-creation
  | "story" // Granted by GM during gameplay
  | "racial" // Innate from metatype
  | "initiation" // From magical initiation
  | "submersion"; // From technomancer submersion
```

### Quality Prerequisites

```typescript
interface QualityPrerequisites {
  attributes?: Record<string, { min?: number; max?: number }>;
  magicalPaths?: MagicalPath[]; // Must be one of these
  magicalPathsExcluded?: MagicalPath[]; // Cannot be any of these
  metatypes?: string[]; // Must be one of these
  metatypesExcluded?: string[]; // Cannot be any of these
  requiredQualities?: string[]; // Must have all of these
  requiredAnyQualities?: string[]; // Must have at least one
  skills?: Record<string, { min?: number }>;
  hasMagic?: boolean; // Must have Magic attribute
  hasResonance?: boolean; // Must have Resonance attribute
  customValidator?: string; // Custom validation function
}
```

### Quality Effects

```typescript
interface QualityEffect {
  id: string; // Unique effect identifier
  type: EffectType; // Category of effect
  trigger: EffectTrigger; // When effect applies
  target: EffectTarget; // What the effect modifies
  value: number | string; // Modifier value or formula
  condition?: EffectCondition; // Optional conditions
  description?: string; // Human-readable description
}

type EffectType =
  | "dice-pool-modifier"
  | "limit-modifier"
  | "threshold-modifier"
  | "wound-modifier"
  | "attribute-modifier"
  | "attribute-maximum"
  | "resistance-modifier"
  | "initiative-modifier"
  | "healing-modifier"
  | "karma-cost-modifier"
  | "nuyen-cost-modifier"
  | "time-modifier"
  | "signature-modifier"
  | "glitch-modifier"
  | "special";

type EffectTrigger =
  | "always"
  | "skill-test"
  | "attribute-test"
  | "combat-action"
  | "defense-test"
  | "resistance-test"
  | "social-test"
  | "first-meeting"
  | "magic-use"
  | "matrix-action"
  | "healing"
  | "damage-taken"
  | "fear-intimidation"
  | "withdrawal"
  | "on-exposure";
```

### Dynamic Quality State

```typescript
type DynamicStateType =
  | "addiction"
  | "allergy"
  | "dependent"
  | "reputation"
  | "code-of-honor"
  | "custom";

// Addiction State
interface AddictionState {
  substance: string;
  substanceType: "physiological" | "psychological" | "both";
  severity: "mild" | "moderate" | "severe" | "burnout";
  originalSeverity: "mild" | "moderate" | "severe" | "burnout";
  lastDose: ISODateString;
  nextCravingCheck: ISODateString;
  cravingActive: boolean;
  withdrawalActive: boolean;
  withdrawalPenalty: number; // 0-6 dice penalty
  daysClean: number;
  recoveryAttempts: number;
}

// Allergy State
interface AllergyState {
  allergen: string;
  prevalence: "uncommon" | "common";
  severity: "mild" | "moderate" | "severe" | "extreme";
  currentlyExposed: boolean;
  exposureStartTime?: ISODateString;
  exposureDuration?: number;
  damageAccumulated: number;
  lastDamageTime?: ISODateString;
}

// Dependent State
interface DependentState {
  name: string;
  relationship: string;
  tier: 1 | 2 | 3;
  currentStatus: "safe" | "needs-attention" | "in-danger" | "missing";
  lastCheckedIn: ISODateString;
  lifestyleCostModifier: number; // +10%, +20%, +30%
  timeCommitmentHours: number; // per week
}

// Code of Honor State
interface CodeOfHonorState {
  codeName: string;
  description: string;
  protectedGroups?: string[];
  violations: Array<{
    date: ISODateString;
    description: string;
    karmaLost: number;
  }>;
  totalKarmaLost: number;
}
```

---

## Business Rules

### Karma Limits (SR5)

| Rule                                 | Value | Enforcement              |
| ------------------------------------ | ----- | ------------------------ |
| Maximum positive quality Karma       | 25    | Hard limit at creation   |
| Maximum negative quality Karma bonus | 25    | Hard limit at creation   |
| Post-creation acquisition cost       | 2×    | Automatically calculated |
| Post-creation buy-off cost           | 2×    | Automatically calculated |

### Prerequisite Validation

Prerequisites are checked in this order:

1. **Metatype restrictions** - Character must be allowed metatype
2. **Magical path restrictions** - Character must have allowed path
3. **Attribute requirements** - Character must meet min/max values
4. **Skill requirements** - Character must have minimum skill ratings
5. **Quality dependencies** - Character must have required qualities
6. **Incompatibilities** - Character must not have conflicting qualities
7. **Instance limits** - Character cannot exceed maximum instances

### Dynamic State Rules

#### Addiction

- Craving checks occur based on severity (weekly → twice daily)
- Failed craving test triggers withdrawal if dose not taken
- Withdrawal applies dice penalties (up to -6)
- Recovery requires extended abstinence and successful tests

#### Allergy

- Exposure triggers effects based on severity
- Mild/Moderate: Dice penalties
- Severe/Extreme: Physical damage over time
- Effects end when exposure ends

#### Dependents

- Lifestyle cost modifier scales with tier (+10/20/30%)
- Time commitment affects downtime activities
- Status can change during gameplay

---

## API Endpoints

### Get Character Qualities

**Endpoint:** `GET /api/characters/[characterId]`

Returns character with `positiveQualities` and `negativeQualities` arrays.

### Acquire Quality Post-Creation

**Endpoint:** `POST /api/characters/[characterId]/qualities`

**Request Body:**

```typescript
{
  qualityId: string;
  rating?: number;
  specification?: string;
  specificationId?: string;
  variant?: string;
  notes?: string;
  gmApproved?: boolean;
  acquisitionDate?: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  character?: Character;
  quality?: QualitySelection;
  cost?: number;
  error?: string;
}
```

**Validation:**

- Character must not be in draft status
- Quality must exist in ruleset
- Prerequisites must be met
- Character must have sufficient Karma
- Quality limit must not be exceeded

### Remove Quality (Buy Off)

**Endpoint:** `DELETE /api/characters/[characterId]/qualities/[qualityId]`

**Request Body:**

```typescript
{
  reason?: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  character?: Character;
  cost?: number;
  error?: string;
}
```

**Validation:**

- Only negative qualities can be bought off
- Character must have sufficient Karma (2× original bonus)

### Update Dynamic State

**Endpoint:** `PATCH /api/characters/[characterId]/qualities/[qualityId]/state`

**Request Body:** Partial dynamic state update

**Response:**

```typescript
{
  success: boolean;
  character?: Character;
  error?: string;
}
```

---

## Core Functions

### Validation Module (`/lib/rules/qualities/validation.ts`)

| Function                     | Purpose                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| `validatePrerequisites()`    | Check all prerequisites for a quality                            |
| `checkIncompatibilities()`   | Check for conflicting qualities                                  |
| `canTakeQuality()`           | Combined validation (prerequisites + incompatibilities + limits) |
| `validateQualitySelection()` | Validate selection structure (rating, specification)             |
| `validateAllQualities()`     | Validate all qualities on a character                            |

### Karma Module (`/lib/rules/qualities/karma.ts`)

| Function                          | Purpose                                    |
| --------------------------------- | ------------------------------------------ |
| `calculateQualityCost()`          | Calculate Karma cost for quality at rating |
| `calculatePositiveQualityKarma()` | Sum of positive quality Karma spent        |
| `calculateNegativeQualityKarma()` | Sum of negative quality Karma gained       |
| `getAvailableKarma()`             | Calculate remaining Karma                  |
| `validateKarmaLimits()`           | Enforce 25 Karma limits                    |

### Advancement Module (`/lib/rules/qualities/advancement.ts`)

| Function                       | Purpose                              |
| ------------------------------ | ------------------------------------ |
| `validateQualityAcquisition()` | Validate post-creation acquisition   |
| `acquireQuality()`             | Acquire quality and update character |
| `validateQualityRemoval()`     | Validate quality buy-off             |
| `removeQuality()`              | Remove quality and update character  |
| `calculatePostCreationCost()`  | Calculate 2× acquisition cost        |
| `calculateBuyOffCost()`        | Calculate 2× buy-off cost            |

### Effects Module (`/lib/rules/qualities/effects.ts`)

| Function                    | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `resolveTemplateVariable()` | Resolve `{{rating}}`, `{{specification}}` in values |
| `resolveEffectValue()`      | Calculate numeric effect value                      |
| `matchesTrigger()`          | Check if effect trigger matches context             |
| `matchesCondition()`        | Check if effect condition matches context           |
| `shouldApplyEffect()`       | Combined trigger + condition check                  |
| `getActiveEffects()`        | Get all applicable effects for character            |

### Gameplay Integration (`/lib/rules/qualities/gameplay-integration.ts`)

| Function                      | Purpose                           |
| ----------------------------- | --------------------------------- |
| `calculateWoundModifier()`    | Apply wound modifier effects      |
| `calculateSkillDicePool()`    | Apply dice pool modifiers         |
| `calculateLimit()`            | Apply limit modifiers             |
| `calculateLifestyleCost()`    | Apply lifestyle cost modifiers    |
| `calculateHealingDicePool()`  | Apply healing modifiers           |
| `calculateAttributeValue()`   | Apply attribute modifiers         |
| `calculateAttributeMaximum()` | Apply attribute maximum modifiers |

### Dynamic State Module (`/lib/rules/qualities/dynamic-state.ts`)

| Function                   | Purpose                                    |
| -------------------------- | ------------------------------------------ |
| `initializeDynamicState()` | Create initial state for dynamic quality   |
| `updateDynamicState()`     | Update state and return modified character |
| `getDynamicState()`        | Get current state for a quality            |
| `validateDynamicState()`   | Validate state consistency                 |

---

## UI Components

### Character Creation - Qualities Step

**Location:** `app/characters/create/components/steps/QualitiesStep.tsx` (Planned)

**Features:**

- Tabbed interface: Positive | Negative
- Quality list with search/filter
- Karma cost display
- Prerequisite warnings
- Running total with limit enforcement
- Specification input for applicable qualities

### Character Sheet - Qualities Section

**Location:** `app/characters/[id]/components/QualitiesSection.tsx`

**Features:**

- List of positive and negative qualities
- Rating and specification display
- Effect summary tooltips
- Dynamic state indicators (for Addiction, Allergy, etc.)

### Advancement - Quality Acquisition

**Location:** `app/characters/[id]/advancement/qualities.tsx`

**Features:**

- Browse available qualities
- Show 2× cost warning
- Prerequisite validation
- GM approval indicator for campaign characters

---

## Implementation Status

### Complete

- [x] Type definitions for all quality structures
- [x] Quality catalog in ruleset data (40+ SR5 qualities)
- [x] Prerequisite validation engine
- [x] Incompatibility checking
- [x] Karma cost calculations
- [x] Karma limit enforcement (25/25)
- [x] Post-creation acquisition logic (2× cost)
- [x] Quality buy-off logic (2× cost)
- [x] Effects resolution engine
- [x] Template variable substitution (`{{rating}}`, etc.)
- [x] Gameplay integration functions
- [x] Dynamic state management (Addiction, Allergy, Dependents)
- [x] API endpoints for quality CRUD
- [x] Character creation qualities step (`QualitiesStep.tsx`)
- [x] Character sheet qualities section (`QualitiesSection.tsx`)
- [x] Quality advancement UI (`QualitiesAdvancement.tsx`)
- [x] Test coverage for core modules

- [x] Dynamic state management UI (Addiction, Allergy tracking)
- [x] GM approval workflow for quality acquisition

### Pending

- [/] Full catalog of SR5 qualities with effects (Ongoing data enrichment)
- [ ] Timeline view of dynamic state events

---

## Test Coverage

The qualities system has comprehensive test coverage:

| Test File                         | Coverage                                                  |
| --------------------------------- | --------------------------------------------------------- |
| `validation.test.ts`              | Prerequisites, incompatibilities, selection validation    |
| `karma.test.ts`                   | Cost calculations, limits                                 |
| `advancement.test.ts`             | Acquisition, removal, validation                          |
| `effects.test.ts`                 | Template resolution, trigger matching, condition matching |
| `dynamic-state.test.ts`           | State initialization, updates, validation                 |
| `dynamic-state/addiction.test.ts` | Addiction-specific mechanics                              |
| `dynamic-state/allergy.test.ts`   | Allergy-specific mechanics                                |

---

## Dependencies

### Required

- **RulesetSystem**: Quality catalog comes from merged ruleset
- **CharacterCreation**: Qualities step in creation wizard
- **AdvancementSystem**: Post-creation quality management

### Optional

- **CampaignSystem**: GM approval workflows
- **DiceRoller**: Effects apply to dice pool calculations

---

## Related Documentation

- [Character Creation Specification](./character_creation_and_management_specification.md)
- [Character Advancement Specification](./character_advancement_specification.md)
- [SR5 Character Creation Rules](/docs/rules/5e/character-creation.md)
- [Ruleset Architecture](/docs/architecture/edition_support_and_ruleset_architecture.md)

---

## Future Enhancements

1. **Quality Categories**: Group qualities by category (Physical, Mental, Social, Magical)
2. **Search and Filter**: Advanced filtering by cost, type, prerequisites
3. **Quality Recommendations**: Suggest qualities based on character archetype
4. **Sourcebook Expansion**: Add qualities from Run Faster, Chrome Flesh, etc.
5. **Effect Visualization**: Show exactly how each quality modifies dice pools
6. **Dynamic State Tracking**: Timeline view of addiction/allergy events
7. **Cross-Edition Support**: Abstract quality system for SR4, SR6

---

_This specification documents the implemented QualitiesSystem. All core business logic and UI components are complete._
