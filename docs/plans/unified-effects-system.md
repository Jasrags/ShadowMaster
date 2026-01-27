# Unified Effects System

> **Status**: Approved
> **Author**: System Design
> **Date**: 2026-01-11
> **Milestone**: v1.3 - Effects & Context
> **Related**: Quality Effects System (`/lib/types/qualities.ts`)

## Overview

This document describes a unified system for defining and resolving mechanical effects from all character sources: qualities, gear, cyberware, bioware, adept powers, spells, and situational modifiers.

### Problem Statement

Currently, gear items like Spatial Recognizer have mechanical effects (+2 limit to locate sounds) stored only as description text. There is no structured way for the application to:

- Display these modifiers on character sheets
- Apply them during gameplay/dice rolling
- Stack/combine multiple sources of the same bonus
- Toggle wireless bonuses per-item

The quality system already has a mature `effects` structure. We should extend and migrate this pattern to all item types.

### Goals

1. Single effect type usable across all item categories
2. Compute effects on demand (not stored on character)
3. Support wireless mode toggles per-item
4. Handle GM/situational modifiers via active modifier array
5. Apply proper stacking rules per effect type
6. Surface effects clearly in UI for player visibility
7. Migrate existing quality effects to unified system

### Non-Goals

- Automated dice rolling (future feature)
- Combat automation (future feature)
- Effect duration tracking beyond simple expiration
- Data authoring tools (backlog item)
- Internationalization of effect descriptions (backlog item)

---

## Design Decisions

| Decision                 | Choice                  | Rationale                                                  |
| ------------------------ | ----------------------- | ---------------------------------------------------------- |
| Trigger matching         | Multi-trigger array     | Explicit, no ambiguity about which triggers apply          |
| Specific actions         | Typed enum              | Prevents stringly-typed mess, enables validation           |
| Wireless overrides       | Constrained fields only | Most SR5 wireless bonuses follow predictable patterns      |
| Stacking rules           | Per effect type         | Matches SR5 rules where dice pool stacks but limits don't  |
| Character state          | Extend existing types   | Avoid parallel structures, integrate with current patterns |
| Active modifiers         | Part of character model | Persisted, not session-only                                |
| Resolution context       | Builder helpers         | Reduce coupling, improve DX                                |
| Existing quality effects | Migrate                 | Single system, not parallel                                |

---

## 1. Unified Effect Type

### Base Effect Definition

Stored on catalog items in edition JSON files.

```typescript
interface Effect {
  id: string;
  type: EffectType;
  triggers: EffectTrigger[]; // Multi-trigger array (explicit matching)
  target: EffectTarget;
  value: number | { perRating: number };
  condition?: EffectCondition;
  description?: string;

  // Stacking control
  stackingGroup?: string;
  stackingPriority?: number;

  // Wireless variant (constrained fields only)
  requiresWireless?: boolean;
  wirelessOverride?: {
    type?: EffectType; // Can change (e.g., limit → dice)
    bonusValue?: number; // Additional value on top of base
    description?: string;
  };
}
```

### Effect Types

```typescript
type EffectType =
  // Existing (from qualities)
  | "dice-pool-modifier"
  | "limit-modifier"
  | "threshold-modifier"
  | "attribute-modifier"
  | "attribute-maximum"
  | "initiative-modifier"
  | "wound-modifier"
  | "resistance-modifier"
  | "healing-modifier"
  | "karma-cost-modifier"
  | "nuyen-cost-modifier"
  | "time-modifier"
  | "signature-modifier"
  | "glitch-modifier"
  // New (for gear/combat)
  | "accuracy-modifier"
  | "recoil-compensation"
  | "damage-resistance-modifier"
  | "armor-modifier"
  | "special";
```

### Effect Triggers

```typescript
type EffectTrigger =
  // Broad triggers
  | "always"
  | "skill-test"
  | "attribute-test"
  | "combat-action"
  | "defense-test"
  | "resistance-test"
  | "social-test"
  | "magic-use"
  | "matrix-action"
  | "healing"
  // Granular triggers
  | "perception-audio"
  | "perception-visual"
  | "ranged-attack"
  | "melee-attack"
  | "damage-resistance"
  | "full-defense"
  // Situational triggers
  | "first-meeting"
  | "damage-taken"
  | "fear-intimidation"
  | "withdrawal"
  | "on-exposure";
```

### Specific Actions (Typed Enum)

```typescript
/**
 * Valid specific actions for fine-grained effect targeting.
 * Enumerated to prevent stringly-typed errors.
 */
type SpecificAction =
  // Perception subtypes
  | "locate-sound-source"
  | "detect-ambush"
  | "read-lips"
  | "spot-hidden"
  // Combat subtypes
  | "called-shot"
  | "suppressive-fire"
  | "full-auto"
  // Social subtypes
  | "negotiate"
  | "intimidate"
  | "con"
  // Matrix subtypes
  | "hack-on-the-fly"
  | "brute-force"
  | "data-spike";
```

### Effect Targets

```typescript
interface EffectTarget {
  // Existing
  stat?: string;
  limit?: "physical" | "mental" | "social" | "astral" | "accuracy";
  attribute?: string;
  skill?: string;
  skillGroup?: string;
  testCategory?: string;
  matrixAction?: string;
  affectsOthers?: boolean;

  // New (typed)
  perceptionType?: "audio" | "visual" | "tactile" | "astral";
  weaponCategory?: string[];
  damageType?: "physical" | "stun";
  specificAction?: SpecificAction; // Typed enum, not string
}
```

### Effect Conditions

```typescript
interface EffectCondition {
  // Existing
  environment?: string[];
  targetType?: string[];
  characterState?: string[];
  opposedBy?: string;
  customCondition?: string;

  // New
  requiresEquipment?: string[];
  lightingCondition?: "bright" | "dim" | "dark";
  noiseCondition?: "quiet" | "normal" | "loud";
}
```

---

## 2. Stacking Rules

### Per-Type Stacking Behavior

SR5 has specific stacking rules that vary by effect type:

```typescript
interface StackingRule {
  effectType: EffectType;
  behavior: "stack" | "highest" | "lowest";
  groupBy: "none" | "source-type" | "stacking-group";
}

const STACKING_RULES: StackingRule[] = [
  // Dice pool modifiers generally stack
  { effectType: "dice-pool-modifier", behavior: "stack", groupBy: "none" },

  // Limit modifiers: highest from each source type
  { effectType: "limit-modifier", behavior: "highest", groupBy: "source-type" },

  // Accuracy: use highest (doesn't stack)
  { effectType: "accuracy-modifier", behavior: "highest", groupBy: "none" },

  // Recoil compensation: stacks from different sources
  { effectType: "recoil-compensation", behavior: "stack", groupBy: "none" },

  // Attribute modifiers: highest from each source type
  { effectType: "attribute-modifier", behavior: "highest", groupBy: "source-type" },

  // Initiative: stacks
  { effectType: "initiative-modifier", behavior: "stack", groupBy: "none" },

  // Armor: stacks (up to encumbrance limits)
  { effectType: "armor-modifier", behavior: "stack", groupBy: "none" },

  // Wound modifiers: stack (penalties accumulate)
  { effectType: "wound-modifier", behavior: "stack", groupBy: "none" },
];
```

### Source Types for Grouping

```typescript
type EffectSourceType =
  | "quality"
  | "gear"
  | "cyberware"
  | "bioware"
  | "adept-power"
  | "spell"
  | "active-modifier";
```

### Stacking Resolution

1. Group effects by `effectType`
2. Look up stacking rule for that type
3. If `groupBy: "none"` → sum all values
4. If `groupBy: "source-type"` → within each source type, take highest; then sum across types
5. If `groupBy: "stacking-group"` → within each group, take highest priority (or highest value if tied)

---

## 3. Character State Integration

### Extending Existing Types

Rather than creating parallel structures, extend existing character types.

**Audit Required**: Review existing character gear/cyberware structures in `/lib/types/` before implementation.

### Gear Instance Extension

```typescript
// Extend existing gear instance type (if present) or add to character type
interface GearInstanceState {
  wirelessEnabled: boolean;
  // Other existing fields preserved
}
```

### Cyberware Instance Extension

```typescript
// Extend existing cyberware instance type
interface CyberwareInstanceState {
  wirelessEnabled: boolean;
  // Other existing fields preserved
}
```

### Active Modifiers

Active modifiers are GM-applied or situational effects. They are **persisted** on the character (not session-only) to survive page refreshes and allow GM review.

```typescript
interface ActiveModifier {
  id: string;
  name: string;
  source: "gm" | "environment" | "condition" | "temporary";
  effect: Effect;
  expiresAt?: ISODateString;
  expiresAfterUses?: number;
  remainingUses?: number;
  appliedBy?: string; // User ID of GM who applied
  appliedAt: ISODateString;
  notes?: string;
}

// Added to Character type
interface Character {
  // ... existing fields ...
  activeModifiers: ActiveModifier[];
}
```

### Active Modifier Lifecycle

1. **Creation**: GM adds via UI, or system adds for conditions (wounded, etc.)
2. **Persistence**: Stored on character document
3. **Resolution**: Included in effect resolution alongside item effects
4. **Expiration**: Removed when `expiresAt` passes or `remainingUses` reaches 0
5. **Manual Removal**: GM can remove at any time

---

## 4. Effect Resolution

### Resolution Context Builder

To reduce coupling between UI and rules logic, provide builder helpers:

```typescript
// lib/rules/effects/context.ts

class EffectContextBuilder {
  private context: Partial<EffectResolutionContext> = {};

  static forSkillTest(skill: string): EffectContextBuilder {
    return new EffectContextBuilder().setAction({
      type: "skill-test",
      skill,
    });
  }

  static forPerception(
    type: "audio" | "visual",
    specificAction?: SpecificAction
  ): EffectContextBuilder {
    const trigger = type === "audio" ? "perception-audio" : "perception-visual";
    return new EffectContextBuilder().setAction({
      type: "skill-test",
      skill: "perception",
      perceptionType: type,
      specificAction,
    });
  }

  static forRangedAttack(weaponId: string): EffectContextBuilder {
    return new EffectContextBuilder().setAction({
      type: "attack",
      attackType: "ranged",
      weaponId,
    });
  }

  static forMeleeAttack(weaponId: string): EffectContextBuilder {
    return new EffectContextBuilder().setAction({
      type: "attack",
      attackType: "melee",
      weaponId,
    });
  }

  withEnvironment(env: Partial<EnvironmentContext>): this {
    this.context.environment = { ...this.context.environment, ...env };
    return this;
  }

  build(): EffectResolutionContext {
    if (!this.context.action) {
      throw new Error("Action context is required");
    }
    return this.context as EffectResolutionContext;
  }

  private setAction(action: ActionContext): this {
    this.context.action = action;
    return this;
  }
}

// Usage examples:
const ctx = EffectContextBuilder.forPerception("audio", "locate-sound-source")
  .withEnvironment({ noise: "loud" })
  .build();
```

### Resolution Context Types

```typescript
interface ActionContext {
  type: "skill-test" | "attack" | "defense" | "resistance" | "initiative";
  skill?: string;
  attribute?: string;
  attackType?: "ranged" | "melee";
  perceptionType?: "audio" | "visual";
  specificAction?: SpecificAction;
  weaponId?: string;
}

interface EnvironmentContext {
  lighting?: "bright" | "dim" | "dark";
  noise?: "quiet" | "normal" | "loud";
  terrain?: string;
  weather?: string;
}

interface EffectResolutionContext {
  action: ActionContext;
  environment?: EnvironmentContext;
}
```

### Resolved Effect

```typescript
interface ResolvedEffect {
  effect: Effect;
  source: {
    type: EffectSourceType;
    id: string;
    name: string;
    rating?: number;
    wirelessEnabled?: boolean;
  };
  resolvedValue: number;
  appliedVariant: "standard" | "wireless";
}
```

### Resolution Result

```typescript
interface EffectResolutionResult {
  // Grouped by effect type
  dicePoolModifiers: ResolvedEffect[];
  limitModifiers: ResolvedEffect[];
  thresholdModifiers: ResolvedEffect[];
  accuracyModifiers: ResolvedEffect[];
  initiativeModifiers: ResolvedEffect[];

  // Totals (after stacking rules)
  totalDicePoolModifier: number;
  totalLimitModifier: number;
  totalThresholdModifier: number;
  totalAccuracyModifier: number;
  totalInitiativeModifier: number;

  // Transparency for UI
  excludedByStacking: ResolvedEffect[];
}
```

### Resolver Function

```typescript
// lib/rules/effects/resolver.ts

function resolveEffects(
  character: Character,
  context: EffectResolutionContext,
  ruleset: MergedRuleset
): EffectResolutionResult;
```

### Resolution Algorithm

```
resolveEffects(character, context, ruleset)
│
├── 1. Gather all effect sources
│   ├── Character qualities → lookup effects from ruleset catalog
│   ├── Equipped gear → lookup effects, include wirelessEnabled state
│   ├── Installed cyberware → lookup effects, include wirelessEnabled state
│   ├── Active adept powers → lookup effects
│   └── Character.activeModifiers → already Effect objects
│
├── 2. Filter by trigger match
│   └── Does any effect.triggers[] match context.action?
│
├── 3. Filter by target match
│   └── Does effect.target match context specifics?
│
├── 4. Filter by condition match
│   └── Does effect.condition match context.environment?
│
├── 5. Apply wireless variants
│   └── If source.wirelessEnabled && effect.wirelessOverride exists:
│       - If wirelessOverride.type → replace effect.type
│       - If wirelessOverride.bonusValue → add to resolved value
│       - Set appliedVariant = "wireless"
│
├── 6. Resolve values
│   └── If value is { perRating: N } → multiply by source.rating
│
├── 7. Apply stacking rules (per effect type)
│   └── Lookup STACKING_RULES for effect.type
│   └── Apply behavior (stack/highest) with groupBy
│   └── Track excluded effects for UI
│
└── 8. Return grouped & totaled results
```

---

## 5. Data Examples

### Spatial Recognizer

```json
{
  "id": "spatial-recognizer",
  "name": "Spatial Recognizer",
  "category": "audio-enhancements",
  "capacityCost": 2,
  "cost": 1000,
  "availability": 4,
  "description": "Pinpoints the source of a sound...",
  "page": 445,
  "source": "Core",
  "effects": [
    {
      "id": "spatial-recognizer-limit",
      "type": "limit-modifier",
      "triggers": ["perception-audio"],
      "target": {
        "limit": "mental",
        "specificAction": "locate-sound-source"
      },
      "value": 2,
      "description": "+2 limit to locate sound source",
      "wirelessOverride": {
        "type": "dice-pool-modifier",
        "description": "+2 dice pool to locate sound source"
      }
    }
  ]
}
```

### Audio Enhancement (Rated)

```json
{
  "id": "audio-enhancement",
  "name": "Audio Enhancement",
  "category": "audio-enhancements",
  "hasRating": true,
  "minRating": 1,
  "maxRating": 3,
  "effects": [
    {
      "id": "audio-enhancement-limit",
      "type": "limit-modifier",
      "triggers": ["perception-audio", "skill-test"],
      "target": {
        "limit": "mental",
        "skill": "perception",
        "perceptionType": "audio"
      },
      "value": { "perRating": 1 },
      "description": "+[Rating] limit on audio Perception",
      "wirelessOverride": {
        "type": "dice-pool-modifier",
        "description": "+[Rating] dice on audio Perception"
      }
    }
  ]
}
```

### Quality: Perceptive (Migrated)

```json
{
  "id": "perceptive",
  "name": "Perceptive",
  "type": "positive",
  "hasRating": true,
  "maxRating": 2,
  "effects": [
    {
      "id": "perceptive-bonus",
      "type": "dice-pool-modifier",
      "triggers": ["skill-test"],
      "target": { "skill": "perception" },
      "value": { "perRating": 1 },
      "description": "+[Rating] dice on Perception tests"
    }
  ]
}
```

---

## 6. UI Usage Examples

### Character Sheet

```typescript
// Show perception modifiers on character sheet
const ctx = EffectContextBuilder.forSkillTest("perception").build();
const effects = resolveEffects(character, ctx, ruleset);

// Render:
// Perception
// Base: Intuition 4 + Perception 3 = 7 dice
//
// Active Modifiers:
//   +2 dice - Perceptive (Quality, R2)
//   +2 dice - Spatial Recognizer (Gear, wireless)
//
// Limit: Mental 5
//   +2 - Audio Enhancement R2 (Cyberware)
//
// Total: 11 dice, Limit 7
```

### Gameplay (Locate Sniper)

```typescript
const ctx = EffectContextBuilder.forPerception("audio", "locate-sound-source")
  .withEnvironment({ noise: "loud" })
  .build();

const effects = resolveEffects(character, ctx, ruleset);

// Dice roller shows full breakdown with sources
```

---

## 7. Migration Plan

### Phase 1: Foundation (Types & Resolver)

- Define types in `/lib/types/effects.ts`
- Create resolver in `/lib/rules/effects/resolver.ts`
- Create context builder in `/lib/rules/effects/context.ts`
- Write comprehensive unit tests
- Audit existing character types for integration points

### Phase 2: Quality Migration

- Update quality effects to use `triggers: []` array format
- Ensure backward compatibility during transition
- Update quality resolution to use unified resolver

### Phase 3: Gear Effects

- Add `effects` arrays to gear items (10-20 items initially)
- Validate resolver with gear + quality combinations
- Add wireless toggle to character gear state

### Phase 4: Cyberware/Bioware Effects

- Add `effects` arrays to cyberware items
- Add `effects` arrays to bioware items
- Add wireless toggle to character cyberware state

### Phase 5: Character Sheet Integration

- Display resolved effects on character sheet
- Show wireless toggle controls
- Show stacking exclusions for transparency

### Phase 6: Active Modifiers UI

- GM interface to add/remove active modifiers
- Display active modifiers on character sheet
- Automatic expiration handling

---

## 8. Open Questions (Resolved)

| Question                  | Resolution                                   |
| ------------------------- | -------------------------------------------- |
| Trigger hierarchy?        | Multi-trigger arrays - explicit matching     |
| Specific action typing?   | Enum - `SpecificAction` type                 |
| Wireless override fields? | Constrained to type, bonusValue, description |
| Stacking rules?           | Per effect type via `STACKING_RULES`         |
| Character state?          | Extend existing types, audit first           |
| Active modifiers?         | Persisted on character, part of data model   |
| Resolution context?       | Builder pattern for DX                       |
| Existing quality effects? | Migrate to unified system                    |

---

## 9. Backlog Items

These items are intentionally deferred:

1. **Data Authoring Tools**: Schema validation, effect builder UI for content authors. Deferred because ruleset management features would change as new features are added.

2. **Internationalization**: Effect description keys for localization. Deferred until i18n strategy is defined for the application.

3. **Effect Versioning**: Handling effect definition changes in ruleset updates for existing characters.

---

## 10. Appendix: Full Type Definitions

```typescript
// =============================================================================
// EFFECT TYPES
// =============================================================================

type EffectType =
  | "dice-pool-modifier"
  | "limit-modifier"
  | "threshold-modifier"
  | "attribute-modifier"
  | "attribute-maximum"
  | "initiative-modifier"
  | "wound-modifier"
  | "resistance-modifier"
  | "healing-modifier"
  | "karma-cost-modifier"
  | "nuyen-cost-modifier"
  | "time-modifier"
  | "signature-modifier"
  | "glitch-modifier"
  | "accuracy-modifier"
  | "recoil-compensation"
  | "damage-resistance-modifier"
  | "armor-modifier"
  | "special";

type EffectTrigger =
  | "always"
  | "skill-test"
  | "attribute-test"
  | "combat-action"
  | "defense-test"
  | "resistance-test"
  | "social-test"
  | "magic-use"
  | "matrix-action"
  | "healing"
  | "perception-audio"
  | "perception-visual"
  | "ranged-attack"
  | "melee-attack"
  | "damage-resistance"
  | "full-defense"
  | "first-meeting"
  | "damage-taken"
  | "fear-intimidation"
  | "withdrawal"
  | "on-exposure";

type SpecificAction =
  | "locate-sound-source"
  | "detect-ambush"
  | "read-lips"
  | "spot-hidden"
  | "called-shot"
  | "suppressive-fire"
  | "full-auto"
  | "negotiate"
  | "intimidate"
  | "con"
  | "hack-on-the-fly"
  | "brute-force"
  | "data-spike";

type EffectSourceType =
  | "quality"
  | "gear"
  | "cyberware"
  | "bioware"
  | "adept-power"
  | "spell"
  | "active-modifier";

// =============================================================================
// EFFECT DEFINITION (Catalog Items)
// =============================================================================

interface EffectTarget {
  stat?: string;
  limit?: "physical" | "mental" | "social" | "astral" | "accuracy";
  attribute?: string;
  skill?: string;
  skillGroup?: string;
  testCategory?: string;
  matrixAction?: string;
  affectsOthers?: boolean;
  perceptionType?: "audio" | "visual" | "tactile" | "astral";
  weaponCategory?: string[];
  damageType?: "physical" | "stun";
  specificAction?: SpecificAction;
}

interface EffectCondition {
  environment?: string[];
  targetType?: string[];
  characterState?: string[];
  opposedBy?: string;
  customCondition?: string;
  requiresEquipment?: string[];
  lightingCondition?: "bright" | "dim" | "dark";
  noiseCondition?: "quiet" | "normal" | "loud";
}

interface Effect {
  id: string;
  type: EffectType;
  triggers: EffectTrigger[];
  target: EffectTarget;
  value: number | { perRating: number };
  condition?: EffectCondition;
  description?: string;
  stackingGroup?: string;
  stackingPriority?: number;
  requiresWireless?: boolean;
  wirelessOverride?: {
    type?: EffectType;
    bonusValue?: number;
    description?: string;
  };
}

// =============================================================================
// RESOLVED EFFECT (Runtime)
// =============================================================================

interface EffectSource {
  type: EffectSourceType;
  id: string;
  name: string;
  rating?: number;
  wirelessEnabled?: boolean;
}

interface ResolvedEffect {
  effect: Effect;
  source: EffectSource;
  resolvedValue: number;
  appliedVariant: "standard" | "wireless";
}

// =============================================================================
// RESOLUTION
// =============================================================================

interface ActionContext {
  type: "skill-test" | "attack" | "defense" | "resistance" | "initiative";
  skill?: string;
  attribute?: string;
  attackType?: "ranged" | "melee";
  perceptionType?: "audio" | "visual";
  specificAction?: SpecificAction;
  weaponId?: string;
}

interface EnvironmentContext {
  lighting?: "bright" | "dim" | "dark";
  noise?: "quiet" | "normal" | "loud";
  terrain?: string;
  weather?: string;
}

interface EffectResolutionContext {
  action: ActionContext;
  environment?: EnvironmentContext;
}

interface EffectResolutionResult {
  dicePoolModifiers: ResolvedEffect[];
  limitModifiers: ResolvedEffect[];
  thresholdModifiers: ResolvedEffect[];
  accuracyModifiers: ResolvedEffect[];
  initiativeModifiers: ResolvedEffect[];
  totalDicePoolModifier: number;
  totalLimitModifier: number;
  totalThresholdModifier: number;
  totalAccuracyModifier: number;
  totalInitiativeModifier: number;
  excludedByStacking: ResolvedEffect[];
}

// =============================================================================
// ACTIVE MODIFIERS
// =============================================================================

interface ActiveModifier {
  id: string;
  name: string;
  source: "gm" | "environment" | "condition" | "temporary";
  effect: Effect;
  expiresAt?: ISODateString;
  expiresAfterUses?: number;
  remainingUses?: number;
  appliedBy?: string;
  appliedAt: ISODateString;
  notes?: string;
}

// =============================================================================
// STACKING RULES
// =============================================================================

interface StackingRule {
  effectType: EffectType;
  behavior: "stack" | "highest" | "lowest";
  groupBy: "none" | "source-type" | "stacking-group";
}
```
