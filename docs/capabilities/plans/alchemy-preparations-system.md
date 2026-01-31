# Alchemy & Preparations System

## Overview

This document specifies the implementation requirements for the SR5 Alchemy system, which allows Awakened characters to create **alchemical preparations** — spells stored in physical objects (lynchpins) for later activation.

**Key Distinction:** Preparations are NOT selected at character creation. Characters learn **spells** at creation, then use the **Alchemy skill** during gameplay to create preparations from those spells.

---

## Core Concepts

### What is a Preparation?

A preparation is a spell that has been cast into a physical object (called a **lynchpin**) using the Alchemy skill. The preparation stores the spell's effect until a **trigger condition** activates it.

### Preparation Lifecycle

```
Spell Known → Alchemy Test → Preparation Created → Potency Decays → Trigger Activates → Effect Resolves
```

### Key Properties

| Property          | Description                                               |
| ----------------- | --------------------------------------------------------- |
| **Spell**         | The underlying spell that was prepared                    |
| **Force**         | Set at creation time (same as spell Force)                |
| **Potency**       | Net hits from creation test; becomes activation dice pool |
| **Trigger**       | Command, Contact, or Time — determines how it activates   |
| **Lynchpin**      | Physical object holding the preparation                   |
| **Creation Time** | When the preparation was created                          |
| **Decay**         | Potency decreases over time based on Force                |

---

## SR5 Rules Reference

### Creating a Preparation (SR5 Core p. 304-306)

**Test:** `Alchemy + Magic [Force]` vs Force (threshold)

- **Success:** Net hits = Potency
- **Failure:** Preparation fails, materials wasted
- **Drain:** Base spell Drain + Trigger modifier

**Trigger Modifiers to Drain Value:**

| Trigger Type | DV Modifier | Activation Method                           |
| ------------ | ----------- | ------------------------------------------- |
| Command      | +2          | Mental command from creator (requires LOS)  |
| Contact      | +1          | Physical contact with target                |
| Time         | +2          | Activates after predetermined time interval |

### Potency Decay

Preparations are inherently unstable. Potency decreases over time:

- **Decay Rate:** Potency -1 per (Force) hours
- **When Potency = 0:** Preparation becomes inert (unusable)
- **Maximum Lifespan:** Potency × Force hours

**Example:** Force 4 preparation with Potency 5

- Loses 1 Potency every 4 hours
- Maximum lifespan: 5 × 4 = 20 hours

### Activation

When triggered, the preparation uses its remaining Potency as the dice pool:

**Test:** `Potency [Force]` vs appropriate defense

- The preparation acts as if the spell was cast with Potency dice
- All spell effects apply normally
- Single-use: preparation is consumed upon activation

### Lynchpin Requirements

- Must be a physical object
- Object Resistance applies to creation test
- Destroyed lynchpin = destroyed preparation
- Cannot be astrally perceived (dual-natured exception)

---

## Implementation Requirements

### 1. Type Definitions

```typescript
// lib/types/alchemy.ts

type PreparationTrigger = "command" | "contact" | "time";

interface AlchemicalPreparation {
  id: string;
  characterId: string;

  // Spell reference
  spellId: string;
  spellName: string;
  spellCategory: SpellCategory;

  // Creation parameters
  force: number;
  potency: number; // Current potency (decays over time)
  initialPotency: number; // Original potency at creation
  trigger: PreparationTrigger;

  // Lynchpin
  lynchpin: {
    description: string;
    objectResistance?: number;
  };

  // Timing
  createdAt: string; // ISO timestamp
  decayRate: number; // Hours per potency loss (= Force)

  // For Time triggers
  timedActivation?: string; // ISO timestamp when it activates

  // Status
  status: "active" | "activated" | "decayed" | "destroyed";
  activatedAt?: string;
}

interface PreparationCreationParams {
  spellId: string;
  force: number;
  trigger: PreparationTrigger;
  lynchpinDescription: string;
  timedDelay?: number; // Minutes (for Time trigger)
}

interface PreparationCreationResult {
  success: boolean;
  preparation?: AlchemicalPreparation;
  potency?: number;
  drain: number;
  alchemyDice: number;
  alchemyHits: number;
  opposedHits: number;
  netHits: number;
}
```

### 2. Character Type Extension

```typescript
// Add to Character interface
interface Character {
  // ... existing properties
  preparations?: AlchemicalPreparation[];
}
```

### 3. Rule Engine Functions

```typescript
// lib/rules/magic/alchemy/index.ts

// Calculate dice pool for preparation creation
function getAlchemyDicePool(
  character: Character,
  spellId: string
): {
  baseDice: number; // Alchemy skill + Magic
  focusBonus: number; // From Alchemy/Enchanting focus
  mentorBonus: number; // From mentor spirit
  total: number;
  limit: number; // Force
};

// Calculate drain for preparation
function getPreparationDrain(
  spell: CatalogSpell,
  trigger: PreparationTrigger
): {
  baseDrain: string; // e.g., "F-2"
  triggerModifier: number; // +1 or +2
  totalDrain: string; // e.g., "F"
};

// Create preparation (rolls dice, calculates result)
function createPreparation(
  character: Character,
  params: PreparationCreationParams,
  alchemyHits: number, // From dice roll
  opposedHits: number // Force threshold or opposed
): PreparationCreationResult;

// Calculate current potency (with decay)
function getCurrentPotency(preparation: AlchemicalPreparation): number;

// Check if preparation is still active
function isPreparationActive(preparation: AlchemicalPreparation): boolean;

// Activate preparation (for combat/gameplay)
function activatePreparation(preparation: AlchemicalPreparation, target?: Target): ActivationResult;
```

### 4. Storage Layer

```typescript
// lib/storage/preparations.ts

async function getCharacterPreparations(characterId: string): Promise<AlchemicalPreparation[]>;
async function createPreparation(prep: AlchemicalPreparation): Promise<AlchemicalPreparation>;
async function updatePreparation(
  id: string,
  updates: Partial<AlchemicalPreparation>
): Promise<AlchemicalPreparation>;
async function deletePreparation(id: string): Promise<void>;

// Batch operations for decay processing
async function updatePreparationPotencies(): Promise<void>; // Called periodically
async function getExpiredPreparations(): Promise<AlchemicalPreparation[]>;
```

### 5. API Routes

```
POST   /api/characters/[characterId]/preparations     - Create new preparation
GET    /api/characters/[characterId]/preparations     - List character's preparations
GET    /api/characters/[characterId]/preparations/[id] - Get specific preparation
PATCH  /api/characters/[characterId]/preparations/[id] - Update (activate, destroy)
DELETE /api/characters/[characterId]/preparations/[id] - Remove preparation
```

### 6. UI Components

#### Preparation Management (Character Sheet)

```
/components/preparations/
  PreparationsPanel.tsx       - Main panel showing all preparations
  PreparationCard.tsx         - Individual preparation display
  PreparationCreationModal.tsx - Create new preparation
  PotencyDecayIndicator.tsx   - Visual decay progress
  TriggerBadge.tsx            - Trigger type indicator
```

#### Preparation Creation Flow

1. Select spell from known spells
2. Set Force (1 to Magic rating)
3. Choose trigger type (Command/Contact/Time)
4. Describe lynchpin object
5. Roll Alchemy + Magic [Force]
6. Calculate net hits → Potency
7. Resist Drain

#### Character Sheet Integration

- Add "Preparations" tab/section alongside Spellbook
- Show active preparations with:
  - Spell name and category
  - Force and current Potency
  - Trigger type
  - Time remaining (decay visualization)
  - Activate/Destroy buttons

---

## Data Requirements

### Catalog Updates

No new catalog entries needed. Preparations use existing spells.

### Character Data

Add `preparations` array to character storage:

```json
{
  "preparations": [
    {
      "id": "prep-001",
      "spellId": "heal",
      "spellName": "Heal",
      "spellCategory": "health",
      "force": 4,
      "potency": 3,
      "initialPotency": 5,
      "trigger": "command",
      "lynchpin": {
        "description": "Silver pendant shaped like a caduceus"
      },
      "createdAt": "2026-01-30T10:00:00Z",
      "decayRate": 4,
      "status": "active"
    }
  ]
}
```

---

## Validation Rules

### Creation Constraints

1. Character must know the spell
2. Force ≤ Magic rating
3. Character must have Alchemy skill
4. Appropriate focus adds dice (optional)

### Activation Constraints

1. Potency > 0 (not decayed)
2. Status = 'active'
3. For Command trigger: creator must have LOS
4. For Contact trigger: must touch target
5. For Time trigger: time must have elapsed

### Limits

- No hard limit on number of preparations
- Practical limit: time to create + decay means finite inventory
- Focus bonding limits apply to Alchemy foci

---

## Integration Points

### Combat System

- Preparations can be activated during combat
- Contact trigger preparations can be thrown (use throwing skill)
- Time trigger preparations for traps/ambushes

### Inventory System

- Lynchpins are physical objects
- Could integrate with gear tracking (optional)
- Destroyed gear = destroyed preparation

### Magic System

- Shares spell definitions with Spellcasting
- Uses same drain resistance mechanics
- Focus bonuses apply

---

## Phase 1: Core Implementation

Minimum viable alchemy system:

1. **Types:** `AlchemicalPreparation`, `PreparationTrigger`
2. **Storage:** Add preparations to character, CRUD operations
3. **Rules:** `getAlchemyDicePool`, `getPreparationDrain`, `getCurrentPotency`
4. **API:** Create/list/update preparations
5. **UI:** PreparationsPanel, PreparationCard, simple creation flow

## Phase 2: Full Integration

Complete gameplay support:

1. **Combat Integration:** Activate preparations in combat tracker
2. **Decay System:** Background job or real-time decay calculation
3. **Validation:** Full constraint checking
4. **Focus Support:** Alchemy focus dice bonuses
5. **Mentor Spirit:** Preparation bonuses for applicable mentors

## Phase 3: Advanced Features

1. **Preparation Templates:** Quick-create common preparations
2. **Batch Operations:** Create multiple preparations at once
3. **History:** Log of created/used preparations
4. **Statistics:** Success rates, average potency, etc.

---

## Open Questions

1. **Decay Timing:** Real-time decay vs. calculated on access?
   - Recommendation: Calculate on access (simpler, no background jobs)

2. **Combat Integration Priority:** Block on combat tracker or standalone?
   - Recommendation: Standalone first, combat integration later

3. **Lynchpin Inventory:** Track lynchpins as gear items?
   - Recommendation: Simple description field initially

4. **Session Persistence:** How to handle preparations across sessions?
   - Recommendation: Store with character, recalculate potency on load

---

## References

- SR5 Core Rulebook pp. 304-306 (Alchemy)
- SR5 Core Rulebook pp. 281-283 (Spellcasting basics, for spell references)
- `/docs/rules/5e/game-mechanics/magic.md` lines 176-182 (existing documentation)
- `/lib/types/character.ts` (Character interface)
- `/components/creation/SpellsCard.tsx` (spell selection pattern)

---

_Created: 2026-01-30_
_Status: Specification_
