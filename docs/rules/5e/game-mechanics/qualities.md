# Shadowrun Fifth Edition Qualities Specification

## Overview

Qualities represent positive and negative traits that modify a character's capabilities, costs, and behavior. Each quality has a Karma value, gameplay effects, and possible prerequisites or incompatibilities. This spec outlines how qualities should be modeled, validated, and applied so future code can manage them consistently.

---

## Data Model

### Quality (Catalog Entry)

The catalog definition for a quality available in the ruleset.

| Field                   | Type                         | Required     | Description                                       |
| ----------------------- | ---------------------------- | ------------ | ------------------------------------------------- |
| `id`                    | string                       | Yes          | Unique identifier (e.g., `"high-pain-tolerance"`) |
| `name`                  | string                       | Yes          | Display name (e.g., `"High Pain Tolerance"`)      |
| `type`                  | `"positive"` \| `"negative"` | Yes          | Quality category                                  |
| `karmaCost`             | number                       | For positive | Karma spent to acquire                            |
| `karmaBonus`            | number                       | For negative | Karma gained when taken                           |
| `summary`               | string                       | Yes          | Short description (1-2 sentences)                 |
| `description`           | string                       | No           | Extended text with full mechanics                 |
| `source`                | SourceReference              | No           | Book and page reference                           |
| `tags`                  | string[]                     | No           | Categorization tags (see below)                   |
| `prerequisites`         | QualityPrerequisites         | No           | Requirements to take this quality                 |
| `incompatibilities`     | string[]                     | No           | Quality IDs that cannot coexist                   |
| `levels`                | QualityLevel[]               | No           | For per-rating qualities                          |
| `maxRating`             | number                       | No           | Maximum rating if per-rating                      |
| `limit`                 | number                       | No           | How many times quality can be taken (default: 1)  |
| `requiresSpecification` | boolean                      | No           | Whether player must specify details               |
| `specificationLabel`    | string                       | No           | Label for specification input                     |
| `specificationSource`   | string                       | No           | Catalog to pull options from                      |
| `specificationOptions`  | string[]                     | No           | Fixed list of valid options                       |
| `effects`               | QualityEffect[]              | No           | Gameplay effects (see Effects Schema)             |
| `dynamicState`          | DynamicStateType             | No           | For qualities with changing state                 |

#### Source Reference

```typescript
interface SourceReference {
  book: string; // e.g., "sr5-core", "run-faster"
  page: number;
}
```

#### Quality Tags

Standard tags for filtering and categorization:

- **Restriction Tags**: `magic-required`, `resonance-required`, `mundane-only`
- **Metatype Tags**: `metatype-restricted`, `human-only`, `metahuman-only`
- **Mechanic Tags**: `per-rating`, `has-levels`, `requires-specification`, `has-variants`
- **Impact Tags**: `combat-impact`, `social-impact`, `matrix-impact`, `magic-impact`, `lifestyle-impact`
- **Special Tags**: `racial`, `mentor-spirit`, `addiction`, `allergy`

#### Quality Level (for per-rating qualities)

```typescript
interface QualityLevel {
  level: number; // Rating level (1, 2, 3, etc.)
  name: string; // Display name (e.g., "Rating 2")
  karma: number; // Karma cost/bonus at this level
  effects?: QualityEffect[]; // Level-specific effects
}
```

### QualityPrerequisites

Structure defining requirements to take a quality.

```typescript
interface QualityPrerequisites {
  // Attribute requirements (e.g., { "wil": { min: 4 } })
  attributes?: Record<string, { min?: number; max?: number }>;

  // Magical path restrictions
  magicalPaths?: MagicalPath[]; // Must be one of these
  magicalPathsExcluded?: MagicalPath[]; // Cannot be any of these

  // Metatype restrictions
  metatypes?: string[]; // Must be one of these (empty = all)
  metatypesExcluded?: string[]; // Cannot be any of these

  // Quality dependencies
  requiredQualities?: string[]; // Must have all of these
  requiredAnyQualities?: string[]; // Must have at least one of these

  // Skill requirements
  skills?: Record<string, { min?: number }>;

  // Special attribute requirements
  hasMagic?: boolean; // Must have Magic attribute
  hasResonance?: boolean; // Must have Resonance attribute

  // Custom validation function reference
  customValidator?: string;
}
```

### QualitySelection (Character Data)

How a quality is stored on a character record.

| Field             | Type              | Required | Description                                            |
| ----------------- | ----------------- | -------- | ------------------------------------------------------ |
| `qualityId`       | string            | Yes      | References catalog Quality.id                          |
| `rating`          | number            | No       | Chosen rating for per-rating qualities                 |
| `specification`   | string            | No       | Player-specified detail (e.g., skill name)             |
| `specificationId` | string            | No       | ID when specification references another catalog       |
| `source`          | AcquisitionSource | Yes      | How/when quality was acquired                          |
| `acquisitionDate` | ISODateString     | No       | When quality was acquired                              |
| `originalKarma`   | number            | No       | Original karma value (for buy-off calculations)        |
| `variant`         | string            | No       | For qualities with variants (e.g., Addiction severity) |
| `notes`           | string            | No       | Player/GM annotations                                  |
| `active`          | boolean           | No       | Whether quality is currently active (default: true)    |
| `dynamicState`    | object            | No       | Current state for dynamic qualities                    |

#### Acquisition Source

```typescript
type AcquisitionSource =
  | "creation" // During character creation
  | "advancement" // Purchased with Karma post-creation
  | "story" // Granted by GM during gameplay
  | "racial" // Innate from metatype
  | "initiation" // From magical initiation
  | "submersion"; // From technomancer submersion
```

### QualityCatalog

Container for the master list of qualities in a ruleset.

```typescript
interface QualityCatalog {
  positive: Quality[];
  negative: Quality[];
  racial: Quality[]; // Metatype-specific qualities
}
```

**Catalog Operations:**

- Filter by type, tags, prerequisites
- Validate prerequisites against character
- Check incompatibilities
- Calculate effective karma cost (including ratings)

---

## Gameplay Effects Schema

Qualities produce mechanical effects that must be applied during gameplay. This schema defines how effects are structured for programmatic application.

### QualityEffect Structure

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
```

### Effect Types

| Type                  | Description                          | Example                      |
| --------------------- | ------------------------------------ | ---------------------------- |
| `dice-pool-modifier`  | Add/subtract dice from pools         | Catlike: +2 to Sneaking      |
| `limit-modifier`      | Modify Physical/Mental/Social limits | Indomitable: +1 to limit     |
| `threshold-modifier`  | Modify test thresholds               | Blandness: +1 to remember    |
| `wound-modifier`      | Alter wound penalty calculation      | High Pain Tolerance          |
| `attribute-modifier`  | Modify attribute values              | Exceptional Attribute        |
| `attribute-maximum`   | Change attribute maximum             | Lucky (Edge max +1)          |
| `resistance-modifier` | Modify resistance tests              | Magic Resistance             |
| `initiative-modifier` | Modify initiative dice/score         | —                            |
| `healing-modifier`    | Modify healing tests                 | Quick Healer: +2             |
| `karma-cost-modifier` | Modify Karma costs                   | Uneducated: 2× for Technical |
| `nuyen-cost-modifier` | Modify lifestyle/gear costs          | Dependents                   |
| `time-modifier`       | Modify time requirements             | Analytical Mind: ½ time      |
| `signature-modifier`  | Modify astral signature              | Astral Chameleon             |
| `glitch-modifier`     | Modify glitch thresholds             | Gremlins                     |
| `special`             | Custom logic required                | Complex effects              |

### Effect Triggers

| Trigger             | When Applied                               |
| ------------------- | ------------------------------------------ |
| `always`            | Constantly active                          |
| `skill-test`        | During skill tests (filter by skill/group) |
| `attribute-test`    | During attribute-only tests                |
| `combat-action`     | During combat actions                      |
| `defense-test`      | When defending                             |
| `resistance-test`   | When resisting effects                     |
| `social-test`       | During social encounters                   |
| `first-meeting`     | First interaction with NPC                 |
| `magic-use`         | When casting/summoning                     |
| `matrix-action`     | During Matrix actions                      |
| `healing`           | During healing tests                       |
| `damage-taken`      | When receiving damage                      |
| `fear-intimidation` | When facing fear/intimidation              |
| `withdrawal`        | During addiction withdrawal                |
| `on-exposure`       | When exposed to allergen                   |

### Effect Target

```typescript
interface EffectTarget {
  // Target a specific stat
  stat?: "wound-threshold" | "overflow" | "initiative" | "edge-max" | string;

  // Target a limit
  limit?: "physical" | "mental" | "social" | "astral";

  // Target an attribute
  attribute?: string;

  // Target a skill or skill group
  skill?: string;
  skillGroup?: string;

  // Target a category of tests
  testCategory?: "combat" | "social" | "technical" | "magic" | "matrix";

  // Target specific action
  matrixAction?: string;

  // Self or others
  affectsOthers?: boolean; // e.g., Quick Healer affects healing on self
}
```

### Effect Condition

```typescript
interface EffectCondition {
  // Only applies in certain environments
  environment?: string[]; // e.g., ["dim-light", "darkness"]

  // Only applies against certain targets
  targetType?: string[]; // e.g., ["spirit", "awakened"]

  // Only when character has certain state
  characterState?: string[]; // e.g., ["astrally-projecting"]

  // Opposed test conditions
  opposedBy?: string; // e.g., "assensing"

  // Custom condition reference
  customCondition?: string;
}
```

### Effect Examples

```json
{
  "id": "catlike",
  "effects": [{
    "id": "catlike-sneaking",
    "type": "dice-pool-modifier",
    "trigger": "skill-test",
    "target": { "skill": "sneaking" },
    "value": 2,
    "description": "+2 dice to Sneaking tests"
  }]
}

{
  "id": "high-pain-tolerance",
  "levels": [
    {
      "level": 1,
      "karma": 7,
      "effects": [{
        "type": "wound-modifier",
        "trigger": "always",
        "target": { "stat": "wound-boxes-ignored" },
        "value": 1
      }]
    },
    {
      "level": 2,
      "karma": 14,
      "effects": [{
        "type": "wound-modifier",
        "trigger": "always",
        "target": { "stat": "wound-boxes-ignored" },
        "value": 2
      }]
    }
  ]
}

{
  "id": "low-pain-tolerance",
  "effects": [{
    "type": "wound-modifier",
    "trigger": "always",
    "target": { "stat": "wound-penalty-interval" },
    "value": 2,
    "description": "Wound modifiers apply every 2 boxes instead of 3"
  }]
}

{
  "id": "guts",
  "effects": [{
    "type": "dice-pool-modifier",
    "trigger": "fear-intimidation",
    "target": { "testCategory": "resistance" },
    "value": 2,
    "description": "+2 dice to resist fear and intimidation"
  }]
}

{
  "id": "indomitable",
  "requiresSpecification": true,
  "specificationLabel": "Limit Type",
  "specificationOptions": ["Physical", "Mental", "Social"],
  "effects": [{
    "type": "limit-modifier",
    "trigger": "always",
    "target": { "limit": "{{specification}}" },
    "value": "{{rating}}",
    "description": "+{{rating}} to {{specification}} Limit"
  }]
}

{
  "id": "gremlins",
  "effects": [{
    "type": "glitch-modifier",
    "trigger": "skill-test",
    "target": { "testCategory": "technology" },
    "value": "-{{rating}}",
    "description": "Reduce glitch threshold by {{rating}} on technology tests"
  }]
}
```

---

## Dynamic Quality State

Some qualities have state that changes during gameplay. This section defines how to track and manage dynamic quality state.

### Dynamic State Types

```typescript
type DynamicStateType = "addiction" | "allergy" | "dependent" | "reputation" | "custom";
```

### Addiction State

For the Addiction quality, track ongoing addiction status.

```typescript
interface AddictionState {
  // What the character is addicted to
  substance: string;
  substanceType: "physiological" | "psychological" | "both";

  // Current severity (can change during play)
  severity: "mild" | "moderate" | "severe" | "burnout";
  originalSeverity: "mild" | "moderate" | "severe" | "burnout";

  // Timing
  lastDose: ISODateString;
  nextCravingCheck: ISODateString;

  // Current state
  cravingActive: boolean;
  withdrawalActive: boolean;
  withdrawalPenalty: number; // 0-6 dice penalty

  // Recovery tracking
  daysClean: number;
  recoveryAttempts: number;
}
```

**Addiction Mechanics:**

- Craving frequency based on severity (see reference tables)
- Failed craving test → must use or suffer withdrawal
- Withdrawal penalties apply to Physical and Mental tests
- Recovery requires clean period + successful test

### Allergy State

For the Allergy quality, track exposure and effects.

```typescript
interface AllergyState {
  allergen: string;
  prevalence: "uncommon" | "common";
  severity: "mild" | "moderate" | "severe" | "extreme";

  // Current exposure
  currentlyExposed: boolean;
  exposureStartTime?: ISODateString;
  exposureDuration?: number; // minutes

  // Damage tracking (for severe/extreme)
  damageAccumulated: number;
  lastDamageTime?: ISODateString;
}
```

**Allergy Mechanics:**

- Prevalence determines encounter frequency
- Severity determines penalties and damage
- Extreme: 1 Physical damage per 30 seconds until treated

### Dependent State

For the Dependents quality, track relationship status.

```typescript
interface DependentState {
  name: string;
  relationship: string; // "child", "spouse", "parent", etc.
  tier: 1 | 2 | 3; // Nuisance / Demanding / Inescapable

  // Current status
  currentStatus: "safe" | "needs-attention" | "in-danger" | "missing";
  lastCheckedIn: ISODateString;

  // Resource drain
  lifestyleCostModifier: number; // +10% / +20% / +30%
  timeCommitmentHours: number; // per week
}
```

### Code of Honor Tracking

```typescript
interface CodeOfHonorState {
  codeName: string;
  description: string;
  protectedGroups?: string[];

  // Violation tracking
  violations: Array<{
    date: ISODateString;
    description: string;
    karmaLost: number;
  }>;
  totalKarmaLost: number;
}
```

---

## Behavior Rules

### 1. Karma Accounting

| Rule                      | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| Starting Karma            | Characters begin with 25 Karma at creation             |
| Positive Quality Cost     | Deducted from available Karma                          |
| Negative Quality Bonus    | Added to available Karma (max 25)                      |
| Creation Limit (Positive) | Maximum 25 Karma spent on positive qualities           |
| Creation Limit (Negative) | Maximum 25 Karma gained from negative qualities        |
| Post-Creation Cost        | Karma cost × 2 to acquire new qualities                |
| Post-Creation Buy-Off     | Karma cost = original bonus × 2 for negative qualities |

**Karma Tracking Fields:**

- `karmaSpentAtCreation`: Total positive quality cost during creation
- `karmaGainedAtCreation`: Total negative quality bonus during creation
- `originalKarma`: On each QualitySelection, store original value for buy-off

### 2. Prerequisites & Restrictions

Prerequisites must be validated before a quality can be added:

```typescript
function canTakeQuality(
  quality: Quality,
  character: Character
): { allowed: boolean; reason?: string } {
  // Check metatype restrictions
  if (quality.prerequisites?.metatypes?.length) {
    if (!quality.prerequisites.metatypes.includes(character.metatype)) {
      return {
        allowed: false,
        reason: `Requires metatype: ${quality.prerequisites.metatypes.join(", ")}`,
      };
    }
  }

  // Check excluded metatypes
  if (quality.prerequisites?.metatypesExcluded?.includes(character.metatype)) {
    return { allowed: false, reason: `Not available to ${character.metatype}` };
  }

  // Check magic requirements
  if (quality.prerequisites?.hasMagic && !character.specialAttributes?.magic) {
    return { allowed: false, reason: "Requires Magic attribute" };
  }

  // Check attribute minimums
  for (const [attr, req] of Object.entries(quality.prerequisites?.attributes || {})) {
    if (req.min && (character.attributes[attr] || 0) < req.min) {
      return { allowed: false, reason: `Requires ${attr} ${req.min}+` };
    }
  }

  // Check required qualities
  for (const reqQuality of quality.prerequisites?.requiredQualities || []) {
    if (!characterHasQuality(character, reqQuality)) {
      return { allowed: false, reason: `Requires quality: ${reqQuality}` };
    }
  }

  // Check incompatibilities
  for (const incompatible of quality.incompatibilities || []) {
    if (characterHasQuality(character, incompatible)) {
      return { allowed: false, reason: `Incompatible with: ${incompatible}` };
    }
  }

  // Check quality limit
  const currentCount = countQualityInstances(character, quality.id);
  if (currentCount >= (quality.limit || 1)) {
    return { allowed: false, reason: `Already have maximum instances (${quality.limit || 1})` };
  }

  return { allowed: true };
}
```

### 3. Known Incompatibilities

| Quality A               | Quality B                     | Reason                            |
| ----------------------- | ----------------------------- | --------------------------------- |
| Lucky                   | Exceptional Attribute (Edge)  | Both affect Edge maximum          |
| Blandness               | Distinctive Style             | Mutually exclusive concepts       |
| Magic Resistance        | Any Magic attribute           | Magic Resistance blocks all magic |
| Human-Looking           | Human metatype                | Pointless (already human)         |
| High Pain Tolerance     | Pain Resistance (adept power) | Cannot stack                      |
| High Pain Tolerance     | Pain Editor (cyberware)       | Cannot stack                      |
| Natural Immunity        | Weak Immune System            | Contradictory                     |
| Resistance to Pathogens | Weak Immune System            | Contradictory                     |

### 4. Per-Rating Qualities

Qualities with ratings have costs that scale:

| Quality               | Base Cost | Max Rating | Total at Max |
| --------------------- | --------- | ---------- | ------------ |
| Focused Concentration | 4         | 6          | 24           |
| High Pain Tolerance   | 7         | 3          | 21           |
| Indomitable           | 8         | 3          | 24           |
| Magic Resistance      | 6         | 4          | 24           |
| Will to Live          | 3         | 3          | 9            |
| Gremlins              | 4         | 4          | 16           |

**Implementation:**

- Store selected `rating` on QualitySelection
- Calculate actual cost: `baseKarma × rating`
- Apply effects scaled by rating (see Effects Schema)

### 5. Conditional Effects Application

Effects are applied based on triggers and conditions:

```typescript
function getActiveEffects(character: Character, context: GameplayContext): QualityEffect[] {
  const activeEffects: QualityEffect[] = [];

  for (const quality of getAllQualities(character)) {
    const qualityDef = getQualityDefinition(quality.qualityId);

    for (const effect of qualityDef.effects || []) {
      if (shouldApplyEffect(effect, context)) {
        activeEffects.push(resolveEffectValues(effect, quality));
      }
    }
  }

  return activeEffects;
}

function shouldApplyEffect(effect: QualityEffect, context: GameplayContext): boolean {
  // Check trigger matches current context
  if (effect.trigger !== "always" && effect.trigger !== context.trigger) {
    return false;
  }

  // Check conditions
  if (effect.condition?.environment) {
    if (!effect.condition.environment.includes(context.environment)) {
      return false;
    }
  }

  // Check target matches
  if (effect.target.skill && context.skill !== effect.target.skill) {
    return false;
  }

  return true;
}
```

### 6. Dynamic Qualities

Qualities that change during play require state management:

| Quality       | Dynamic Aspect                      | Tracking Required   |
| ------------- | ----------------------------------- | ------------------- |
| Addiction     | Severity can increase/decrease      | AddictionState      |
| Allergy       | Exposure status                     | AllergyState        |
| Dependents    | Relationship status, resource drain | DependentState      |
| Code of Honor | Violations                          | CodeOfHonorState    |
| Bad Rep       | Notoriety changes                   | Reputation tracking |
| SINner        | SIN discovery, obligations          | SIN status          |

### 7. Removal & Advancement

**Acquiring Qualities Post-Creation:**

- Karma cost = listed cost × 2
- GM approval required
- All prerequisites must be met
- Story justification recommended

**Buying Off Negative Qualities:**

- Karma cost = original bonus × 2
- GM approval required
- Story justification required
- Some qualities may not be removable (GM discretion)

**Tracking for Buy-Off:**

```typescript
interface QualityRemovalRecord {
  qualityId: string;
  removedAt: ISODateString;
  originalKarma: number;
  karmaPaid: number;
  reason: string;
  gmApproved: boolean;
}
```

---

## Validation Rules

### Creation-Time Validation

All validation errors must be resolved before character can be finalized.

```typescript
interface QualityValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

function validateQualities(character: Character, ruleset: MergedRuleset): QualityValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // 1. Karma limit checks
  const positiveKarma = calculatePositiveQualityKarma(character);
  const negativeKarma = calculateNegativeQualityKarma(character);

  if (positiveKarma > 25) {
    errors.push({
      code: "POSITIVE_KARMA_EXCEEDED",
      message: `Positive qualities exceed 25 Karma limit (${positiveKarma})`,
      field: "positiveQualities",
    });
  }

  if (negativeKarma > 25) {
    errors.push({
      code: "NEGATIVE_KARMA_EXCEEDED",
      message: `Negative qualities exceed 25 Karma limit (${negativeKarma})`,
      field: "negativeQualities",
    });
  }

  // 2. Prerequisite validation
  for (const quality of getAllQualities(character)) {
    const canTake = canTakeQuality(getQualityDef(quality.qualityId), character);
    if (!canTake.allowed) {
      errors.push({
        code: "PREREQUISITE_NOT_MET",
        message: `${quality.qualityId}: ${canTake.reason}`,
        field: `qualities.${quality.qualityId}`,
      });
    }
  }

  // 3. Incompatibility checks
  const incompatibilities = findIncompatibilities(character);
  for (const pair of incompatibilities) {
    errors.push({
      code: "INCOMPATIBLE_QUALITIES",
      message: `${pair[0]} and ${pair[1]} cannot be taken together`,
      field: "qualities",
    });
  }

  // 4. Specification validation
  for (const quality of getAllQualities(character)) {
    const def = getQualityDef(quality.qualityId);
    if (def.requiresSpecification && !quality.specification) {
      errors.push({
        code: "SPECIFICATION_REQUIRED",
        message: `${def.name} requires a specification`,
        field: `qualities.${quality.qualityId}.specification`,
      });
    }
  }

  // 5. Rating validation
  for (const quality of getAllQualities(character)) {
    const def = getQualityDef(quality.qualityId);
    if (def.levels && quality.rating) {
      if (quality.rating < 1 || quality.rating > (def.maxRating || def.levels.length)) {
        errors.push({
          code: "INVALID_RATING",
          message: `${def.name} rating must be 1-${def.maxRating || def.levels.length}`,
          field: `qualities.${quality.qualityId}.rating`,
        });
      }
    }
  }

  // Warnings (non-blocking)
  if (negativeKarma === 0) {
    warnings.push({
      code: "NO_NEGATIVE_QUALITIES",
      message: "Consider taking negative qualities for additional Karma",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```

### Post-Creation Validation

Additional rules for quality changes after character creation:

```typescript
function validateQualityAcquisition(
  character: Character,
  qualityId: string,
  rating?: number
): ValidationResult {
  const quality = getQualityDef(qualityId);

  // Check prerequisites
  const canTake = canTakeQuality(quality, character);
  if (!canTake.allowed) {
    return { valid: false, reason: canTake.reason };
  }

  // Check Karma availability (2× cost post-creation)
  const cost = calculateQualityCost(quality, rating) * 2;
  if (character.karmaCurrent < cost) {
    return { valid: false, reason: `Insufficient Karma (need ${cost})` };
  }

  // GM approval flag
  return { valid: true, requiresGMApproval: true };
}

function validateQualityRemoval(character: Character, qualityId: string): ValidationResult {
  const selection = findQualitySelection(character, qualityId);
  if (!selection) {
    return { valid: false, reason: "Quality not found on character" };
  }

  const quality = getQualityDef(qualityId);

  // Negative quality buy-off
  if (quality.type === "negative") {
    const cost = (selection.originalKarma || quality.karmaBonus) * 2;
    if (character.karmaCurrent < cost) {
      return { valid: false, reason: `Insufficient Karma to buy off (need ${cost})` };
    }
  }

  // Positive quality removal (GM approval, possible partial refund)
  if (quality.type === "positive") {
    return { valid: true, requiresGMApproval: true, note: "GM determines refund amount" };
  }

  return { valid: true, requiresGMApproval: true };
}
```

### 8. Data Source

All official quality definitions live in the data tables section below. Specs and tools should refer to that section for authoritative data.

## Reference

- Data tables section below: Complete positive/negative quality tables and supporting reference charts (Prejudiced, Allergy, Scorched).
- SR5 Core Rulebook, Qualities chapter (pp. 84–92, 134–138) for detailed descriptions and edge cases.
- Character creation limits: SR5 Core p. 63 (25 Karma limit for positive, 25 Karma bonus cap for negative).

_Last updated: 2025-11-08_

---

## Qualities Data Tables

## Positive Qualities

| Quality                        | Karma Cost         | Summary                                                                                | Notes                                                                                                                                                               |
| ------------------------------ | ------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ambidextrous                   | 4                  | Ignore off-hand penalties; both hands treated equally.                                 | Removes –2 dice off-hand modifier.                                                                                                                                  |
| Analytical Mind                | 5                  | +2 dice to Logic tests involving pattern analysis; halves time for problem solving.    | Applies to puzzles, ciphers, clue hunting, etc.                                                                                                                     |
| Aptitude                       | 14                 | Raise one skill to 7 at creation; cap becomes 13.                                      | May take once; GM approval recommended.                                                                                                                             |
| Astral Chameleon               | 10                 | Astral signature fades twice as fast; hard to detect.                                  | –2 dice to Assensing tests against your signature; requires Magic attribute.                                                                                        |
| Bilingual                      | 5                  | Gain a second native language at chargen.                                              | Grants an extra free language skill.                                                                                                                                |
| Blandness                      | 8                  | Harder to notice/recall; blends into crowds.                                           | +1 threshold to remember; –2 dice to track in populated areas; suppressed by distinctive features.                                                                  |
| Catlike                        | 7                  | +2 dice to Sneaking tests.                                                             | —                                                                                                                                                                   |
| Codeslinger                    | 10                 | +2 dice to a chosen Matrix action test.                                                | Action chosen when quality is taken.                                                                                                                                |
| Double-Jointed                 | 6                  | +2 dice to Escape Artist; fit into tight spaces.                                       | —                                                                                                                                                                   |
| Exceptional Attribute          | 14                 | Increase natural maximum of one attribute (including Magic/Resonance) by 1.            | Cannot affect Edge; may take once with GM approval.                                                                                                                 |
| First Impression               | 11                 | +2 dice to relevant Social tests during first meetings.                                | Applies only to initial encounter.                                                                                                                                  |
| Focused Concentration          | 4 × rating (max 6) | Sustain one spell/complex form up to rating without penalty.                           | Magic users/technomancers only; penalties still apply beyond free sustain.                                                                                          |
| Gearhead                       | 11                 | +2 dice to difficult vehicle tests; boost Speed by 20% or Handling +1 for 1D6 minutes. | Extra duration inflicts 1 stress per additional minute.                                                                                                             |
| Guts                           | 10                 | +2 dice to resist fear/intimidation (including magical).                               | —                                                                                                                                                                   |
| High Pain Tolerance            | 7 × rating (max 3) | Ignore 1 damage box per rating when applying wound modifiers.                          | Incompatible with Pain Resistance adept power, pain editor, damage compensator.                                                                                     |
| Home Ground                    | 10                 | Gain specialized advantage tied to a familiar neighborhood/host.                       | Choose one option (Astral Acclimation, You Know a Guy, Digital Turf, Transporter, On the Lam, Street Politics); can be taken multiple times with different options. |
| Human-Looking                  | 6                  | Metahuman appears human; humans treat them neutrally.                                  | Elves, dwarfs, orks only; may incur distrust from metahumans.                                                                                                       |
| Indomitable                    | 8 × rating (max 3) | +1 to chosen Inherent limit per rating.                                                | Distribute levels among Physical/Mental/Social limits.                                                                                                              |
| Juryrigger                     | 10                 | +2 dice to Mechanics tests when improvising fixes; reduce thresholds by 1.             | Effects temporary; can overclock devices short term.                                                                                                                |
| Lucky                          | 12                 | Raise Edge natural maximum by 1.                                                       | Does not increase current Edge; cannot combine with Exceptional Attribute; take once with GM approval.                                                              |
| Magic Resistance               | 6 × rating (max 4) | +1 die per rating on Spell Resistance tests.                                           | Always on; blocks beneficial voluntary spells; unavailable to characters with Magic attribute.                                                                      |
| Mentor Spirit                  | 5                  | Gain mentor spirit benefits/drawbacks.                                                 | Magic attribute required; switching mentors costs Karma (buy off then repurchase).                                                                                  |
| Natural Athlete                | 7                  | +2 dice to Running and Gymnastics tests.                                               | —                                                                                                                                                                   |
| Natural Hardening              | 10                 | +1 point natural biofeedback filtering.                                                | Stacks with programs/firewall; technomancers benefit.                                                                                                               |
| Natural Immunity               | 4 or 10            | Immunity to one natural (4) or synthetic (10) disease/toxin.                           | Halved recovery time on subsequent exposures; can still be a carrier; GM/player agree on target.                                                                    |
| Photographic Memory            | 6                  | Perfect recall; +2 dice to Memory tests.                                               | —                                                                                                                                                                   |
| Quick Healer                   | 3                  | +2 dice to all Healing tests (self or others).                                         | Includes magical healing.                                                                                                                                           |
| Resistance to Pathogens/Toxins | 4 or 8             | +1 die to resist pathogens (4) or toxins (4); both if 8 Karma.                         | —                                                                                                                                                                   |
| Spirit Affinity                | 7                  | +1 service and +1 die to Binding for one spirit type.                                  | Magic users only; can select spirits outside tradition.                                                                                                             |
| Toughness                      | 9                  | +1 die to Body for Damage Resistance tests.                                            | —                                                                                                                                                                   |
| Will to Live                   | 3 × rating (max 3) | +1 Damage Overflow box per rating.                                                     | Extends death threshold only (not unconscious limits).                                                                                                              |

## Negative Qualities

| Quality            | Karma Bonus        | Summary                                                                                                     | Notes                                                                                                                                                                                             |
| ------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Addiction          | 4–25               | Character is dependent on a substance/device/activity; cravings impose penalties and downtime requirements. | Mild (4): monthly cravings, –2 Mental/Physical dice when withdrawing.<br>Moderate (9): biweekly, –4.<br>Severe (20): weekly, –4 plus –2 Social always.<br>Burnout (25): daily, –6 plus –3 Social. |
| Allergy            | 5–25               | Harmed by a substance/condition; value = prevalence + severity.                                             | See allergy reference tables below.                                                                                                                                                               |
| Astral Beacon      | 10                 | Astral signature is bright and long-lasting; easier to track.                                               | Signature lasts twice as long; Assensing threshold –1. Magic-only.                                                                                                                                |
| Bad Luck           | 12                 | Edge occasionally backfires.                                                                                | When spending Edge, roll 1d6; on 1 the effect reverses. Happens once per session.                                                                                                                 |
| Bad Rep            | 7                  | Tainted reputation follows the character.                                                                   | Start with 3 Notoriety; must resolve source to remove.                                                                                                                                            |
| Code of Honor      | 15                 | Bound by strict rules about who may be harmed.                                                              | Choose protected group or credo; failure forces nonlethal options, may incur Karma loss; includes variants like Assassin’s Creed or Warrior’s Code.                                               |
| Codeblock          | 10                 | Struggles with a specific Matrix action.                                                                    | –2 dice to chosen Matrix action tests; must involve tested action.                                                                                                                                |
| Combat Paralysis   | 12                 | Freezes at start of combat.                                                                                 | First Initiative score halved (rounded up); –3 dice on Surprise tests; +1 threshold to Composure under fire.                                                                                      |
| Dependents         | 3 / 6 / 9          | Loved ones rely on character, draining time/resources.                                                      | +50% training/project time. Lifestyle cost +10% / +20% / +30% depending on commitment level.                                                                                                      |
| Distinctive Style  | 5                  | Memorable look or mannerism.                                                                                | +2 dice to identify/trace; –1 Memory threshold. Incompatible with Blandness.                                                                                                                      |
| Elf Poser          | 6                  | Human seeks to pass as elf.                                                                                 | Gains elf appearance but risks hostility if discovered; humans only.                                                                                                                              |
| Gremlins           | 4 × rating (max 4) | Technology malfunctions around the character.                                                               | Reduce glitch threshold by rating on tech use; affects external gear only.                                                                                                                        |
| Incompetent        | 5                  | Totally inept with one Active skill group.                                                                  | Treated as Unaware; cannot learn/use that group; GM may veto trivial picks.                                                                                                                       |
| Insomnia           | 10 / 15            | Restless sleeper; slow Stun recovery.                                                                       | 10 Karma: failed Intuition+Willpower (4) doubles recovery time and delays Edge refresh.<br>15 Karma: failure prevents any Stun recovery and Edge refresh for 24h.                                 |
| Loss of Confidence | 10                 | Doubts a once-proud skill.                                                                                  | Choose skill rating ≥4; –2 dice; can’t use specialization or Edge with that skill until resolved.                                                                                                 |
| Low Pain Tolerance | 9                  | More sensitive to injury.                                                                                   | Wound modifiers every 2 boxes instead of 3 (both tracks).                                                                                                                                         |
| Ork Poser          | 6                  | Human/elf adopts ork appearance.                                                                            | Social consequences if revealed; humans or elves only.                                                                                                                                            |
| Prejudiced         | 3–10               | Open bias against a group.                                                                                  | See prejudiced reference tables below.                                                                                                                                                            |
| Scorched           | 10                 | Neurological trauma from Black IC/BTLs.                                                                     | See scorched side effects table below.                                                                                                                                                            |
| Sensitive System   | 12                 | Body rejects cyberware.                                                                                     | Cyber Essence costs doubled; bioware impossible. Awakened/technomancers risk +2 Drain/Fading if Willpower (2) fails.                                                                              |
| Simsense Vertigo   | 5                  | Suffers disorientation in AR/VR.                                                                            | –2 dice on all AR/VR/simsense interactions (smartlinks, simrigs, etc.).                                                                                                                           |
| SINner (Layered)   | 5–25               | Possesses legal/corporate/criminal SIN with obligations.                                                    | National (5): 15% tax; Criminal (10): constant scrutiny; Corporate Limited (15): 20% corp tax; Corporate Born (25): 10% tax and deep distrust.                                                    |
| Social Stress      | 8                  | Emotional triggers hinder social grace.                                                                     | Define trigger; reduce number of 1s needed to glitch by 1 on relevant tests.                                                                                                                      |
| Spirit Bane        | 7                  | Specific spirit type hates the character.                                                                   | Spirits of that type attack preferentially; –2 dice to summon/bind; +2 to resist banishing. Magic-only.                                                                                           |
| Uncouth            | 14                 | Socially inept and impulsive.                                                                               | –2 dice to resist acting improperly; double Karma cost for Social skills; cannot learn Social groups; treated as Unaware if skill <1.                                                             |
| Uneducated         | 8                  | Lacks formal schooling.                                                                                     | Unaware in Technical, Academic, Professional Knowledge skills without ranks; cannot default; double Karma cost to learn/improve them.                                                             |
| Unsteady Hands     | 7                  | Hands tremble under stress.                                                                                 | –2 dice to Agility-based tests when symptoms occur; after stressful event roll Agility+Body (4) to avoid episode.                                                                                 |
| Weak Immune System | 10                 | Poor disease resistance.                                                                                    | Increase disease Power by +2 on resistance; cannot take Natural Immunity or Resistance to Pathogens/Toxins.                                                                                       |

## Reference Tables

### Prejudiced Reference Table

**Prevalence of Target Group**

| Target Group Type                                                                 | Karma Value |
| --------------------------------------------------------------------------------- | ----------- |
| Common group (e.g., humans, metahumans)                                           | 5           |
| Specific group (e.g., Awakened, technomancers, shapeshifters, aspected magicians) | 3           |

**Degree of Prejudice**

| Degree                             | Karma Value |
| ---------------------------------- | ----------- |
| Biased (closet meta-hater)         | 0           |
| Outspoken (typical Humanis member) | 2           |
| Radical (racial supremacist)       | 5           |

### Addiction Severity Reference

| Severity | Karma Bonus | Craving Frequency  | Resistance Threshold | Withdrawal Penalties              |
| -------- | ----------- | ------------------ | -------------------- | --------------------------------- |
| Mild     | 4           | Monthly (30 days)  | 2                    | -2 Mental, -2 Physical            |
| Moderate | 9           | Biweekly (14 days) | 3                    | -4 Mental, -4 Physical            |
| Severe   | 20          | Weekly (7 days)    | 4                    | -4 Mental, -4 Physical, -2 Social |
| Burnout  | 25          | Daily (1 day)      | 5                    | -6 Mental, -6 Physical, -3 Social |

**Addiction Types:**

| Type          | Examples                          | Notes                                           |
| ------------- | --------------------------------- | ----------------------------------------------- |
| Physiological | Alcohol, Novacoke, Kamikaze, BTLs | Physical dependence; Body + Willpower to resist |
| Psychological | Gambling, Simsense, Combat        | Mental dependence; Logic + Willpower to resist  |
| Both          | Some drugs, Deepweed              | Both tests required                             |

**Craving Mechanics:**

1. When craving period elapses, make Resistance Test (attribute + Willpower vs threshold)
2. **Success**: Resist craving, no penalty
3. **Failure**: Must indulge within 24 hours or begin withdrawal
4. **Glitch**: Addiction severity may increase (GM discretion)

**Withdrawal Mechanics:**

- Penalties apply to all tests of the affected type
- Duration: Until character indulges OR completes recovery
- Each week of withdrawal: Body + Willpower (severity threshold) to reduce severity by 1

**Recovery:**

1. Remain clean for: Severity Level × 1 week
2. Roll: Body + Willpower (threshold = current severity)
3. **Success**: Reduce severity by 1 level
4. **Critical Success**: Reduce by 2 levels
5. **Failure**: Reset clean time counter
6. Complete recovery when severity reaches 0

### Allergy Reference Table

**Prevalence of Allergen**

| Condition | Karma Value | Description                                                                                                            |
| --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| Uncommon  | 2           | Allergen is rare in the local environment (e.g., silver, gold, antibiotics, grass).                                    |
| Common    | 7           | Allergen is prevalent in the local environment (e.g., sunlight, seafood, bees, pollen, pollutants, Wi-Fi, soy, wheat). |

**Severity of Reaction**

| Severity | Karma Value | Effects                                                                                                            |
| -------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| Mild     | 3           | Discomfort and distraction; –2 dice to Physical tests while exposed.                                               |
| Moderate | 8           | Intense pain; –4 dice to Physical tests while exposed.                                                             |
| Severe   | 13          | Extreme pain plus damage; –4 dice to all tests while exposed and 1 unresisted Physical box per minute of exposure. |
| Extreme  | 18          | Anaphylactic shock; –6 dice to all tests, 1 unresisted Physical box every 30 seconds until treated.                |

### Scorched Physical Side Effects

| Effect                   | Game Rules                                                                                                                                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Memory Loss (short term) | Character forgets slotting the BTL. Must immediately take a Withdrawal Test; failure reintroduces cravings and withdrawal. When encountering IC, Memory Tests have threshold +1; failure causes gaps in memory and disorientation. |
| Memory Loss (long term)  | As above, plus the character loses access to one active skill (treated as Unaware) for the duration.                                                                                                                               |
| Blackout                 | No memories retained for the duration; neither tech nor magic can restore them.                                                                                                                                                    |
| Migraines                | –2 dice to all Physical and Mental tests; also suffers light sensitivity and nausea (see p. 409).                                                                                                                                  |
| Paranoia/Anxiety         | Must make Social Success Tests (threshold 5) for basic interactions; if no skill applies, default to Charisma –1. Failure means paranoia/anxiety reactions for the effect's duration.                                              |

---

## System Integration Points

This section defines how the qualities system integrates with other game systems.

### Wound Modifier Integration

Qualities that affect wound penalties must integrate with the damage tracking system:

```typescript
interface WoundModifierCalculation {
  // Base calculation: every 3 boxes = -1 modifier
  baseInterval: number; // Default: 3

  // Modified by Low Pain Tolerance: every 2 boxes
  // Modified by qualities/cyberware/powers
  effectiveInterval: number;

  // Boxes ignored before penalties apply
  boxesIgnored: number; // From High Pain Tolerance, Pain Editor, etc.

  // Calculate final modifier
  calculateModifier(damage: number): number;
}

function getWoundModifier(character: Character, damageTrack: "physical" | "stun"): number {
  const damage = character.condition[damageTrack === "physical" ? "physicalDamage" : "stunDamage"];

  // Get all wound-affecting qualities
  const woundEffects = getActiveEffects(character, { trigger: "always" }).filter(
    (e) => e.type === "wound-modifier"
  );

  let interval = 3; // Default
  let ignored = 0;

  for (const effect of woundEffects) {
    if (effect.target.stat === "wound-penalty-interval") {
      interval = effect.value as number;
    }
    if (effect.target.stat === "wound-boxes-ignored") {
      ignored += effect.value as number;
    }
  }

  const effectiveDamage = Math.max(0, damage - ignored);
  return -Math.floor(effectiveDamage / interval);
}
```

### Skill Test Integration

Qualities that modify skill tests must be applied during dice pool calculation:

```typescript
interface DicePoolModification {
  source: string; // Quality ID
  modifier: number; // +/- dice
  reason: string; // Human-readable explanation
  conditional: boolean; // Whether it's always active or situational
}

function calculateSkillDicePool(
  character: Character,
  skill: string,
  context: TestContext
): { pool: number; modifications: DicePoolModification[] } {
  let pool = getBasePool(character, skill);
  const modifications: DicePoolModification[] = [];

  // Get quality effects for this skill test
  const effects = getActiveEffects(character, {
    trigger: "skill-test",
    skill: skill,
  });

  for (const effect of effects) {
    if (effect.type === "dice-pool-modifier") {
      const mod = resolveValue(effect.value, character);
      pool += mod;
      modifications.push({
        source: effect.id,
        modifier: mod,
        reason: effect.description || `${effect.id}`,
        conditional: effect.trigger !== "always",
      });
    }
  }

  return { pool, modifications };
}
```

### Limit Integration

Qualities like Indomitable that modify limits:

```typescript
function calculateLimit(character: Character, limitType: "physical" | "mental" | "social"): number {
  // Base limit calculation
  let limit = calculateBaseLimit(character, limitType);

  // Apply quality modifiers
  const effects = getActiveEffects(character, { trigger: "always" }).filter(
    (e) => e.type === "limit-modifier" && e.target.limit === limitType
  );

  for (const effect of effects) {
    limit += resolveValue(effect.value, character);
  }

  return limit;
}
```

### Magic System Integration

Qualities that interact with the magic system:

| Quality               | Integration Point                                   |
| --------------------- | --------------------------------------------------- |
| Mentor Spirit         | Spell bonuses, spirit types, behavioral constraints |
| Focused Concentration | Sustaining penalty exemption                        |
| Magic Resistance      | Spell defense dice (blocks beneficial spells)       |
| Astral Chameleon      | Signature duration, Assensing thresholds            |
| Spirit Affinity       | Binding dice, service bonus                         |
| Spirit Bane           | Summoning penalty, banishing resistance             |

### Matrix System Integration

| Quality           | Integration Point              |
| ----------------- | ------------------------------ |
| Codeslinger       | Specific Matrix action bonus   |
| Codeblock         | Specific Matrix action penalty |
| Natural Hardening | Biofeedback filtering          |
| Simsense Vertigo  | AR/VR/simsense penalties       |

### Lifestyle Integration

Qualities affecting lifestyle costs:

```typescript
function calculateLifestyleCost(character: Character, lifestyle: Lifestyle): number {
  let cost = lifestyle.baseCost;

  // Apply Dependents modifier
  const dependents = findQuality(character, "dependents");
  if (dependents) {
    const tier = dependents.rating || 1;
    const modifier = [0.1, 0.2, 0.3][tier - 1];
    cost *= 1 + modifier;
  }

  // Apply SINner taxes
  const sinner = findQuality(character, "sinner");
  if (sinner) {
    const taxRate = getSINnerTaxRate(sinner.variant);
    cost *= 1 + taxRate;
  }

  return cost;
}
```

---

## UI/UX Guidelines

Guidelines for implementing quality selection and management in the user interface.

### Character Creation UI

#### Quality Selection Panel

```
┌─────────────────────────────────────────────────────────────┐
│ QUALITIES                                                    │
├─────────────────────────────────────────────────────────────┤
│ Karma Budget: 25 starting                                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Positive: -12 spent    │ Negative: +8 gained            │ │
│ │ ═══════════▓▓▓▓░░░░░░ │ ═══════▓▓▓░░░░░░░░░░░░░░░░░   │ │
│ │          (max 25)      │         (max 25)               │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Available Karma: 21                                         │
├─────────────────────────────────────────────────────────────┤
│ [Search qualities...]                    [Filter ▼]         │
├─────────────────────────────────────────────────────────────┤
│ ○ POSITIVE  ● NEGATIVE                                      │
├─────────────────────────────────────────────────────────────┤
│ ┌─ Selected ─────────────────────────────────────────────┐  │
│ │ ✓ Catlike                                    -7 Karma  │  │
│ │ ✓ Analytical Mind                            -5 Karma  │  │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─ Available ────────────────────────────────────────────┐  │
│ │ □ Ambidextrous                               -4 Karma  │  │
│ │   Ignore off-hand penalties                            │  │
│ │ □ Aptitude [Requires Specification]         -14 Karma  │  │
│ │   Raise one skill max to 7                             │  │
│ │ ⊘ Astral Chameleon [Requires Magic]         -10 Karma  │  │
│ │   Astral signature fades faster (unavailable)          │  │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Quality Detail View

When a quality is selected, show:

1. Full description
2. Mechanical effects (translated from effects schema)
3. Prerequisites (with pass/fail indicators)
4. Incompatibilities (if any selected)
5. Rating selector (if per-rating)
6. Specification input (if required)

```
┌─ High Pain Tolerance ────────────────────────────────────────┐
│                                                              │
│ Cost: 7 Karma × Rating                                       │
│                                                              │
│ Description:                                                 │
│ You can shrug off more pain than normal. For each rating    │
│ level, ignore 1 box of damage when calculating wound        │
│ modifiers.                                                   │
│                                                              │
│ Rating: [1] [2] [3]     Current Cost: 14 Karma              │
│          ○   ●   ○                                          │
│                                                              │
│ Effects at Rating 2:                                         │
│ • Ignore 2 damage boxes when calculating wound modifiers    │
│                                                              │
│ ⚠ Incompatible with:                                        │
│ • Pain Resistance (Adept Power)                             │
│ • Pain Editor (Cyberware)                                   │
│                                                              │
│                              [Cancel] [Add Quality]          │
└──────────────────────────────────────────────────────────────┘
```

### Gameplay UI

#### Active Effects Display

Show currently active quality effects on the character sheet:

```
┌─ Active Quality Effects ─────────────────────────────────────┐
│                                                              │
│ Always Active:                                               │
│ • +2 dice to Sneaking tests (Catlike)                       │
│ • +2 dice to Logic pattern analysis (Analytical Mind)       │
│ • Ignore 2 wound boxes (High Pain Tolerance 2)              │
│                                                              │
│ Situational:                                                 │
│ • +2 dice vs Fear/Intimidation (Guts) - when triggered      │
│ • +2 dice on first meetings (First Impression) - social     │
│                                                              │
│ Penalties:                                                   │
│ • -2 dice to Hacking actions (Codeblock: Hack on the Fly)   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Dynamic Quality Tracking

For qualities with changing state, provide management UI:

```
┌─ Addiction: Novacoke (Moderate) ─────────────────────────────┐
│                                                              │
│ Status: ⚠ CRAVING ACTIVE                                    │
│                                                              │
│ Last Dose: 2 days ago                                        │
│ Next Craving Check: OVERDUE                                  │
│                                                              │
│ Current Effects:                                             │
│ • -4 dice to Mental tests                                   │
│ • -4 dice to Physical tests                                 │
│                                                              │
│ [Record Dose] [Make Resistance Test] [Begin Recovery]        │
│                                                              │
│ Recovery Progress: ░░░░░░░░░░ 0/14 days clean               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Validation Feedback

Display validation errors clearly:

```
┌─ Quality Validation ─────────────────────────────────────────┐
│                                                              │
│ ❌ ERRORS (must fix before continuing):                     │
│                                                              │
│ • Positive qualities exceed 25 Karma limit (28 spent)       │
│   → Remove 3+ Karma of positive qualities                   │
│                                                              │
│ • Astral Chameleon requires Magic attribute                 │
│   → Select a magical path or remove this quality            │
│                                                              │
│ • Lucky and Exceptional Attribute (Edge) are incompatible   │
│   → Remove one of these qualities                           │
│                                                              │
│ ⚠ WARNINGS (optional):                                      │
│                                                              │
│ • No negative qualities selected                             │
│   → Consider taking negatives for additional Karma          │
│                                                              │
│ • Codeslinger requires a Matrix Action specification        │
│   → Select which action gets the bonus                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

When implementing qualities support, ensure the following:

### Data Layer

- [ ] Quality catalog in ruleset JSON with all fields from Data Model
- [ ] QualitySelection structure on Character with all tracking fields
- [ ] Dynamic state storage for Addiction, Allergy, Dependents, etc.

### Character Creation

- [ ] Karma budget tracking (25 positive max, 25 negative max)
- [ ] Prerequisite validation before selection
- [ ] Incompatibility checking in real-time
- [ ] Rating selection for per-rating qualities
- [ ] Specification input (text or dropdown from source)
- [ ] Validation errors displayed clearly

### Gameplay Support

- [ ] Effects application during dice pool calculation
- [ ] Wound modifier integration
- [ ] Limit modifier integration
- [ ] Dynamic quality state management (Addiction tracking, etc.)
- [ ] Display of active effects on character sheet

### Advancement

- [ ] Post-creation quality acquisition (2× cost)
- [ ] Negative quality buy-off (2× original bonus)
- [ ] GM approval workflow
- [ ] Karma transaction logging

---

_Last updated: 2025-12-21_
