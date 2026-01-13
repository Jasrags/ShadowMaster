> [!NOTE]
> This implementation guide is governed by the [Capability (mechanics.action-execution.md)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/mechanics.action-execution.md).

# Gameplay Actions Specification

**Last Updated:** 2025-01-27  
**Status:** Specification  
**Category:** Gameplay, Core Mechanics, Combat, Magic, Matrix  
**Affected Areas:** Character sheets, combat system, skill tests, magic system, matrix system

---

## Overview

Gameplay actions are the fundamental building blocks of Shadowrun 5th Edition gameplay. They represent everything a character can do during their turn, from combat attacks to skill tests, spellcasting, matrix operations, and character state management. This specification defines the action economy, action types, implementation requirements, and integration points for all gameplay actions in Shadow Master.

**Key Features:**

- Action economy system (Free, Simple, Complex, Interrupt actions)
- Combat actions (ranged, melee, movement, defense)
- Non-combat actions (skill tests, social interactions)
- Magic actions (spellcasting, summoning, banishing, etc.)
- Matrix actions (hacking, data manipulation, combat)
- Character lifecycle actions (damage, healing, karma, retirement)
- Action validation and state management
- Integration with dice roller and character data

**Current Status:** Basic character lifecycle actions implemented. Combat, magic, and matrix actions are planned. This specification documents current implementation and defines the complete action system.

---

## Action Economy

### Core Principles

**Action Phase Structure:**

- Each Action Phase provides: **1 Free Action** + **(2 Simple Actions)** OR **(1 Complex Action)**
- Free Actions can be used at any point until the next Action Phase, even during another character's turn
- Multiple Actions can split dice pools (e.g., Multiple Attacks splits pool between attacks)
- Interrupt Actions can be taken outside your turn at Initiative cost

**Action Types:**

| Type          | Cost                     | Description                                         | Examples                                                  |
| ------------- | ------------------------ | --------------------------------------------------- | --------------------------------------------------------- |
| **Free**      | 1 per Action Phase       | Minor actions that don't require significant effort | Run, Drop Prone, Call Shot, Speak                         |
| **Simple**    | 1 of 2 per Action Phase  | Standard actions requiring moderate effort          | Fire Weapon (SS/SA/BF), Ready Weapon, Take Aim            |
| **Complex**   | 1 per Action Phase       | Major actions requiring full attention              | Cast Spell, Melee Attack, Sprint, Summoning               |
| **Interrupt** | Variable Initiative cost | Defensive actions taken outside your turn           | Block (-5 Init), Dodge (-5 Init), Full Defense (-10 Init) |

**Reference:** SR5 Core Rulebook, p. 163-164 (Action Economy)

---

## Current Implementation

### Character Lifecycle Actions

**API Endpoint:** `POST /api/characters/[characterId]/gameplay`

**Implemented Actions:**

#### 1. Damage Action

```typescript
{
  action: "damage";
  physical: number;
  stun: number;
}
```

- Applies physical and/or stun damage to character
- Updates condition monitors
- Applies wound modifiers
- Validates character is active

#### 2. Heal Action

```typescript
{
  action: "heal";
  physical: number;
  stun: number;
}
```

- Heals physical and/or stun damage
- Updates condition monitors
- Removes wound modifiers when appropriate
- Validates character is active

#### 3. Spend Karma Action

```typescript
{
  action: "spendKarma";
  amount: number;
}
```

- Deducts karma from character
- Validates sufficient karma available
- Validates positive amount

#### 4. Award Karma Action

```typescript
{
  action: "awardKarma";
  amount: number;
}
```

- Adds karma to character
- Validates positive amount

#### 5. Retire Action

```typescript
{
  action: "retire";
}
```

- Changes character status to "retired"
- Prevents further gameplay actions

#### 6. Kill Action

```typescript
{
  action: "kill";
}
```

- Changes character status to "dead"
- Prevents further gameplay actions

**Validation:**

- All actions require authentication
- Character must belong to authenticated user
- Character must be active (except retire/kill)
- Positive amounts required for karma actions

---

## Combat Actions

### Free Actions

#### Run

- **Cost:** 1 Free Action
- **Effect:** Declares running state for the turn
- **Modifiers:** -2 dice to ranged actions while running
- **Notes:** Movement rate determined by metatype

#### Drop Prone

- **Cost:** 1 Free Action
- **Effect:** Character falls prone
- **Modifiers:** -1 to melee attacks, +2 defense vs ranged
- **Notes:** Can be taken at any time

#### Call Shot

- **Cost:** 1 Free Action
- **Effect:** Declares called shot for next attack
- **Modifiers:** Varies by called shot type (-4 to -10)
- **Notes:** Must be declared before attack roll

#### Drop Object

- **Cost:** 1 Free Action
- **Effect:** Drops held object
- **Notes:** No test required

#### Eject Smartgun Clip

- **Cost:** 1 Free Action
- **Effect:** Ejects clip from smartgun
- **Requirements:** Smartgun with wireless enabled

#### Multiple Attacks

- **Cost:** 1 Free Action (declaration)
- **Effect:** Splits dice pool between multiple attacks
- **Limits:** Max attacks = half combat skill rating
- **Notes:** Each attack resolved separately

#### Speak/Text/Transmit Phrase

- **Cost:** 1 Free Action
- **Effect:** Brief communication
- **Notes:** Can be done during other actions

#### Change Linked Device Mode

- **Cost:** 1 Free Action
- **Effect:** Changes mode of linked device (e.g., smartlink)
- **Requirements:** Device must be linked/wireless

### Simple Actions

#### Fire Weapon (SS/SA/BF/FA Short Burst)

- **Cost:** 1 Simple Action
- **Test:** `Weapon Skill + AGI [Accuracy]`
- **Modes:** Single-Shot (SS), Semi-Auto (SA), Burst-Fire (BF), Full-Auto (FA) - 6 rounds
- **Defense Modifier:** -2 (BF), -5 (FA short burst)
- **Rounds:** 1 (SS/SA), 3 (BF), 6 (FA short burst)

#### Ready/Draw Weapon

- **Cost:** 1 Simple Action
- **Effect:** Draws or readies weapon
- **Notes:** Quick Draw test can make this Free Action

#### Take Aim

- **Cost:** 1 Simple Action
- **Effect:** +1 dice pool, +1 Accuracy for next attack
- **Requirements:** Must be used before attack
- **Notes:** Can be used multiple times (cumulative)

#### Reload Weapon (Magazine Feed)

- **Cost:** 1 Simple Action
- **Effect:** Reloads weapon with new magazine/clip
- **Requirements:** Weapon with magazine/clip feed
- **Notes:** Other feed types may be Complex Action

#### Throw Weapon

- **Cost:** 1 Simple Action
- **Test:** `Throwing + AGI [Physical]`
- **Effect:** Throws weapon or grenade
- **Notes:** Grenades have scatter rules

#### Pick Up/Put Down Object

- **Cost:** 1 Simple Action
- **Effect:** Manipulates object
- **Notes:** May require test for complex objects

#### Take Cover

- **Cost:** 1 Simple Action
- **Effect:** Moves to cover
- **Defense Bonus:** +2 (partial), +4 (good cover)

#### Observe in Detail

- **Cost:** 1 Simple Action
- **Test:** `Perception + INT [Mental]`
- **Effect:** Detailed observation of target

#### Shift Perception

- **Cost:** 1 Simple Action
- **Effect:** Changes perception mode (e.g., astral, thermo)
- **Requirements:** Appropriate gear or abilities

#### Use Simple Device

- **Cost:** 1 Simple Action
- **Effect:** Uses device with simple interface
- **Notes:** Complex devices may require Complex Action

#### Activate Focus

- **Cost:** 1 Simple Action
- **Effect:** Activates magical focus
- **Requirements:** Magical ability, focus item

#### Call Spirit

- **Cost:** 1 Simple Action
- **Effect:** Calls already-summoned spirit
- **Requirements:** Summoned spirit available

#### Command Spirit

- **Cost:** 1 Simple Action
- **Effect:** Commands spirit to perform action
- **Requirements:** Bound or summoned spirit

#### Dismiss Spirit

- **Cost:** 1 Simple Action
- **Effect:** Dismisses summoned spirit
- **Requirements:** Summoned spirit present

#### Reckless Spellcasting

- **Cost:** 1 Simple Action (normally Complex)
- **Test:** `Spellcasting + Magic [Force]`
- **Modifier:** +3 Drain Value
- **Effect:** Casts spell as Simple Action

#### Fire Bow

- **Cost:** 1 Simple Action
- **Test:** `Archery + AGI [Accuracy]`
- **Effect:** Fires bow or crossbow

#### Change Device Mode

- **Cost:** 1 Simple Action
- **Effect:** Changes operating mode of device
- **Notes:** Different from Change Linked Device Mode (Free)

#### Remove Clip

- **Cost:** 1 Simple Action
- **Effect:** Removes clip from weapon
- **Notes:** Eject is Free Action, Remove is Simple

#### Quick Draw

- **Cost:** 1 Simple Action
- **Test:** `Reaction + INT (2)`
- **Effect:** Draws weapon; success makes Ready Weapon Free Action

### Complex Actions

#### Melee Attack

- **Cost:** 1 Complex Action
- **Test:** `Close Combat Skill + AGI [Accuracy]`
- **Modifiers:** Reach, charging, off-hand penalties
- **Effect:** Melee attack; net hits add to Damage Value

#### Fire Weapon (FA Full Auto)

- **Cost:** 1 Complex Action
- **Test:** `Weapon Skill + AGI [Accuracy]`
- **Defense Modifier:** -9
- **Rounds:** 10
- **Effect:** Full automatic fire

#### Fire Long or Semi-Auto Burst

- **Cost:** 1 Complex Action
- **Test:** `Weapon Skill + AGI [Accuracy]`
- **Defense Modifier:** -5
- **Rounds:** 6
- **Effect:** Long burst fire

#### Cast Spell

- **Cost:** 1 Complex Action
- **Test:** `Spellcasting + Magic [Force]`
- **Drain:** Varies by spell (Force-based formula)
- **Effect:** Casts magical spell
- **Notes:** Reckless Spellcasting makes this Simple (+3 DV)

#### Summoning

- **Cost:** 1 Complex Action
- **Test:** `Summoning + Magic [Force]`
- **Drain:** `2 × spirit hits` (minimum 2)
- **Effect:** Summons spirit
- **Notes:** Extended test (Force intervals)

#### Banish Spirit

- **Cost:** 1 Complex Action
- **Test:** `Banishing + Magic [Force]`
- **Effect:** Forces spirit to return to native plane

#### Sprint

- **Cost:** 1 Complex Action
- **Test:** `Running + STR [Physical]`
- **Effect:** +2 m movement (metahumans) or +1 m (dwarfs/trolls) per hit
- **Fatigue:** Cumulative 1S per consecutive use

#### Astral Projection

- **Cost:** 1 Complex Action
- **Effect:** Projects astral form
- **Requirements:** Magical ability

#### Fire Mounted or Vehicle Weapon

- **Cost:** 1 Complex Action
- **Test:** `Gunnery + AGI [Accuracy]`
- **Effect:** Fires vehicle-mounted weapon

#### Reload Weapon (Complex Feed Types)

- **Cost:** 1 Complex Action
- **Effect:** Reloads weapon with belt/drum/internal feed
- **Notes:** Magazine feed is Simple Action

#### Rigger Jump In

- **Cost:** 1 Complex Action
- **Test:** `Pilot + REA [Handling]`
- **Effect:** Jumps into rigged device
- **Requirements:** Control rig, rigged device

#### Use Skill

- **Cost:** 1 Complex Action
- **Test:** `Skill + Attribute [Limit]`
- **Effect:** Uses skill for significant task
- **Notes:** Simple tasks may be Simple Action

### Interrupt Actions

#### Block

- **Cost:** -5 Initiative
- **Test:** `Close Combat Skill + AGI [Accuracy]`
- **Effect:** Blocks melee attack
- **Notes:** Can be used outside your turn

#### Parry

- **Cost:** -5 Initiative
- **Test:** `Close Combat Skill + AGI [Accuracy]`
- **Effect:** Parries melee attack
- **Notes:** Can be used outside your turn

#### Dodge

- **Cost:** -5 Initiative
- **Test:** `Gymnastics + REA [Physical]`
- **Effect:** Dodges attack
- **Notes:** Can be used outside your turn

#### Full Defense

- **Cost:** -10 Initiative
- **Effect:** Adds Willpower to all Defense Tests for Combat Turn
- **Notes:** Can be used outside your turn

#### Hit the Dirt

- **Cost:** -5 Initiative
- **Effect:** Drops prone, +2 defense vs ranged
- **Notes:** Can be used outside your turn

#### Intercept

- **Cost:** -5 Initiative
- **Test:** `Close Combat Skill + AGI [Accuracy]`
- **Effect:** Intercepts attack meant for another
- **Notes:** Can be used outside your turn

**Reference:** SR5 Core Rulebook, p. 163-164, 188-189 (Combat Actions)

---

## Non-Combat Actions

### Skill Tests

**General Format:**

- **Test:** `Skill + Attribute [Limit] (Threshold)`
- **Action Cost:** Usually Complex (Simple for trivial tasks)
- **Effect:** Varies by skill and context

**Common Skill Test Actions:**

#### Social Tests

- **Con:** `Con + CHA [Social]`
- **Etiquette:** `Etiquette + CHA [Social]`
- **Intimidation:** `Intimidation + CHA [Social]` or `STR [Physical]`
- **Leadership:** `Leadership + CHA [Social]`
- **Negotiation:** `Negotiation + CHA [Social]`

#### Physical Tests

- **Athletics:** `Athletics + AGI [Physical]` or `STR [Physical]`
- **Running:** `Running + STR [Physical]`
- **Sneaking:** `Sneaking + AGI [Physical]`
- **Gymnastics:** `Gymnastics + AGI [Physical]`

#### Mental Tests

- **Computer:** `Computer + LOG [Mental]`
- **Perception:** `Perception + INT [Mental]`
- **First Aid:** `First Aid + LOG [Mental]`
- **Medicine:** `Medicine + LOG [Mental]`

#### Technical Tests

- **Armorer:** `Armorer + LOG [Mental]`
- **Hardware:** `Hardware + LOG [Mental]`
- **Software:** `Software + LOG [Mental]`
- **Electronics:** `Electronics + LOG [Mental]`

### Extended Tests

**Format:**

- **Test:** `Skill + Attribute [Limit] (Threshold, Interval)`
- **Action Cost:** Complex Action per interval
- **Effect:** Accumulates hits over multiple intervals
- **Pool Degradation:** -1 die per interval
- **Intervals:** Fast (1 CT), Quick (1 min), Short (10 min), Average (30 min), Long (1 hour), etc.

### Teamwork Tests

**Format:**

- **Leader Test:** `Skill + Attribute [Limit]`
- **Helper Tests:** Each helper rolls same pool
- **Bonuses:** +1 limit and +1 die per helper with ≥1 hit (capped by leader's skill)
- **Penalties:** Helper glitches remove contribution; critical glitches negate all bonuses

---

## Magic Actions

### Sorcery Actions

#### Cast Spell (Standard)

- **Cost:** 1 Complex Action
- **Test:** `Spellcasting + Magic [Force]`
- **Drain:** Varies by spell (Force-based formula)
- **Effect:** Casts spell
- **Sustaining:** -2 dice per sustained spell
- **Notes:** Reckless Spellcasting makes this Simple (+3 DV)

#### Reckless Spellcasting

- **Cost:** 1 Simple Action
- **Test:** `Spellcasting + Magic [Force]`
- **Drain:** Standard DV + 3
- **Effect:** Casts spell as Simple Action
- **Notes:** Faster but more dangerous

#### Ritual Spellcasting

- **Cost:** Variable (Extended Test)
- **Test:** `Ritual Spellcasting + Magic [Force]`
- **Drain:** Varies by ritual
- **Effect:** Casts ritual spell
- **Requirements:** Multiple participants, extended time

#### Counterspelling

- **Cost:** 1 Complex Action (or Interrupt)
- **Test:** `Counterspelling + Magic [Force]`
- **Effect:** Defends against or dispels spells
- **Notes:** Can be used as Interrupt Action

### Conjuring Actions

#### Summoning

- **Cost:** 1 Complex Action
- **Test:** `Summoning + Magic [Force]` (Extended Test)
- **Drain:** `2 × spirit hits` (minimum 2)
- **Effect:** Summons spirit
- **Intervals:** Force intervals (e.g., Force 4 = 4 intervals)

#### Binding

- **Cost:** 1 Complex Action
- **Test:** `Binding + Magic [Force]` (Extended Test)
- **Drain:** `2 × spirit hits` (minimum 2)
- **Effect:** Binds spirit for additional services
- **Requirements:** Summoned spirit present

#### Banishing

- **Cost:** 1 Complex Action
- **Test:** `Banishing + Magic [Force]` (Opposed Test)
- **Drain:** `2 × spirit hits` (minimum 2)
- **Effect:** Forces spirit to return to native plane

#### Call Spirit

- **Cost:** 1 Simple Action
- **Effect:** Calls already-summoned spirit
- **Requirements:** Summoned spirit available

#### Command Spirit

- **Cost:** 1 Simple Action
- **Effect:** Commands spirit to perform action
- **Requirements:** Bound or summoned spirit

#### Dismiss Spirit

- **Cost:** 1 Simple Action
- **Effect:** Dismisses summoned spirit
- **Requirements:** Summoned spirit present

### Enchanting Actions

#### Alchemy

- **Cost:** Extended Test (hours/days)
- **Test:** `Alchemy + Magic [Force]`
- **Effect:** Creates alchemical preparation
- **Requirements:** Reagents, time, workspace

#### Artificing

- **Cost:** Extended Test (hours/days)
- **Test:** `Artificing + Magic [Force]`
- **Effect:** Crafts magical focus
- **Requirements:** Materials, time, workspace

#### Disenchanting

- **Cost:** Extended Test
- **Test:** `Disenchanting + Magic [Force]`
- **Effect:** Removes enchantment from item
- **Requirements:** Time, workspace

### Astral Actions

#### Astral Projection

- **Cost:** 1 Complex Action
- **Effect:** Projects astral form
- **Requirements:** Magical ability

#### Assensing

- **Cost:** 1 Simple Action
- **Test:** `Assensing + INT [Mental]`
- **Effect:** Reads astral auras
- **Requirements:** Astral perception

#### Astral Combat

- **Cost:** 1 Complex Action
- **Test:** `Astral Combat + WIL [Willpower]`
- **Effect:** Combat in astral space
- **Requirements:** Astral form or dual-natured

**Reference:** SR5 Core Rulebook, p. 281-307 (Magic System)

---

## Matrix Actions

### Free Actions

#### Load Program

- **Cost:** 1 Free Action
- **Effect:** Loads program into device
- **Requirements:** Program available, device capacity

#### Unload Program

- **Cost:** 1 Free Action
- **Effect:** Unloads program from device

#### Switch Two Matrix Attributes

- **Cost:** 1 Free Action
- **Effect:** Swaps two Matrix attributes
- **Requirements:** Device with multiple attributes

#### Swap Two Programs

- **Cost:** 1 Free Action
- **Effect:** Swaps positions of two loaded programs

### Simple Actions

#### Change Icon

- **Cost:** 1 Simple Action
- **Limit:** Data Processing
- **Marks:** Owner
- **Effect:** Changes device icon appearance

#### Jack Out

- **Cost:** 1 Simple Action
- **Test:** `Hardware + WIL vs. Attack + LOG`
- **Limit:** Firewall
- **Marks:** Owner
- **Effect:** Disconnects from Matrix

#### Invite Mark

- **Cost:** 1 Simple Action
- **Limit:** Data Processing
- **Marks:** Owner
- **Effect:** Invites another persona to place mark

#### Send Message

- **Cost:** 1 Simple Action
- **Limit:** Data Processing
- **Marks:** 1
- **Effect:** Sends Matrix message

#### Switch Interface Mode

- **Cost:** 1 Simple Action
- **Limit:** Data Processing
- **Marks:** Owner
- **Effect:** Switches AR/VR interface mode

#### Call/Dismiss Sprite

- **Cost:** 1 Simple Action
- **Effect:** Calls or dismisses sprite
- **Requirements:** Technomancer, compiled sprite

#### Command Sprite

- **Cost:** 1 Simple Action
- **Effect:** Commands sprite to perform action
- **Requirements:** Registered sprite

### Complex Actions

#### Hack on the Fly

- **Cost:** 1 Complex Action
- **Test:** `Hacking + LOG vs. Firewall + INT` (Opposed)
- **Limit:** Sleaze
- **Marks:** 1 on success
- **OS Gain:** On failure
- **Effect:** Places mark stealthily

#### Brute Force

- **Cost:** 1 Complex Action
- **Test:** `Cybercombat + LOG vs. Firewall + WIL` (Opposed)
- **Limit:** Attack
- **Marks:** 1 on success
- **OS Gain:** On failure
- **Effect:** Places mark forcefully

#### Data Spike

- **Cost:** 1 Complex Action
- **Test:** `Cybercombat + LOG vs. Firewall + INT` (Opposed)
- **Limit:** Attack
- **Marks:** None required
- **Effect:** Matrix combat attack

#### Matrix Perception

- **Cost:** 1 Complex Action
- **Test:** `Computer + INT [Data Processing]`
- **Effect:** Perceives Matrix environment

#### Edit File

- **Cost:** 1 Complex Action
- **Test:** `Computer + LOG vs. Firewall + INT` (Opposed)
- **Limit:** Data Processing
- **Marks:** 1
- **Effect:** Edits file

#### Crack File

- **Cost:** 1 Complex Action
- **Test:** `Hacking + LOG vs. 2 × Protection Rating`
- **Limit:** Attack
- **Marks:** 1
- **Effect:** Breaks file protection

#### Enter/Exit Host

- **Cost:** 1 Complex Action
- **Limit:** Data Processing
- **Marks:** 1
- **Effect:** Enters or exits host

#### Erase Mark

- **Cost:** 1 Complex Action
- **Test:** `Cybercombat + LOG vs. Firewall + WIL` (Opposed)
- **Limit:** Attack
- **Marks:** Special (must have mark to erase)
- **Effect:** Removes mark from device

#### Spoof Command

- **Cost:** 1 Complex Action
- **Test:** `Hacking + LOG vs. Firewall + INT` (Opposed)
- **Limit:** Sleaze
- **Marks:** 1
- **OS Gain:** On failure
- **Effect:** Sends false command

#### Trace Icon

- **Cost:** 1 Complex Action
- **Test:** `Electronic Warfare + LOG [Sleaze]` (Extended Test)
- **Effect:** Traces icon to physical location

#### Crash Program

- **Cost:** 1 Complex Action
- **Test:** `Cybercombat + LOG vs. Firewall + INT` (Opposed)
- **Limit:** Attack
- **Marks:** 1
- **Effect:** Crashes program or IC

#### Format Device

- **Cost:** 1 Complex Action
- **Test:** `Computer + LOG vs. Firewall + WIL` (Opposed)
- **Limit:** Sleaze
- **Marks:** 3
- **Effect:** Formats device (destructive)

#### Reboot Device

- **Cost:** 1 Complex Action
- **Limit:** Firewall
- **Marks:** Owner
- **Effect:** Reboots device

#### Full Matrix Defense

- **Cost:** 1 Complex Action
- **Effect:** Adds Willpower to all Matrix Defense Tests for Combat Turn
- **Notes:** Similar to Full Defense in physical combat

### Resonance Actions (Technomancers)

#### Compile Sprite

- **Cost:** 1 Complex Action
- **Test:** `Compiling + Resonance [Level]` (Extended Test)
- **Drain:** `2 × sprite hits` (minimum 2)
- **Effect:** Compiles sprite

#### Register Sprite

- **Cost:** 1 Complex Action
- **Test:** `Registering + Resonance [Level]` (Extended Test)
- **Drain:** `2 × sprite hits` (minimum 2)
- **Effect:** Registers sprite for binding

#### Thread Complex Form

- **Cost:** 1 Complex Action
- **Test:** `Skill + Resonance [Level]`
- **Fade:** Varies by form
- **Effect:** Threads complex form

#### Kill Complex Form

- **Cost:** 1 Complex Action
- **Test:** `Software + Resonance [Level]`
- **Effect:** Kills complex form

#### Erase Resonance Signature

- **Cost:** 1 Complex Action
- **Test:** `Computer + Resonance vs. 2 × Signature Rating`
- **Limit:** Attack
- **Effect:** Erases resonance signature

**Reference:** SR5 Core Rulebook, p. 228-267 (Matrix System)

---

## Character Lifecycle Actions

### Damage Action

**Implementation:**

```typescript
{
  action: "damage";
  physical: number;
  stun: number;
}
```

**Behavior:**

- Applies damage to Physical and/or Stun condition monitors
- Updates character state
- Applies wound modifiers (if applicable)
- Validates character is active
- Prevents negative condition monitor values

**Validation:**

- Character must be active
- Character must belong to authenticated user
- Damage values must be non-negative

### Heal Action

**Implementation:**

```typescript
{
  action: "heal";
  physical: number;
  stun: number;
}
```

**Behavior:**

- Heals damage from Physical and/or Stun condition monitors
- Updates character state
- Removes wound modifiers when appropriate
- Validates character is active
- Prevents exceeding maximum condition monitor values

**Validation:**

- Character must be active
- Character must belong to authenticated user
- Heal values must be non-negative

### Spend Karma Action

**Implementation:**

```typescript
{
  action: "spendKarma";
  amount: number;
}
```

**Behavior:**

- Deducts karma from character's current karma
- Updates character state
- Validates sufficient karma available

**Validation:**

- Character must be active
- Character must belong to authenticated user
- Amount must be positive
- Character must have sufficient karma

### Award Karma Action

**Implementation:**

```typescript
{
  action: "awardKarma";
  amount: number;
}
```

**Behavior:**

- Adds karma to character's current karma
- Updates character state

**Validation:**

- Character must be active
- Character must belong to authenticated user
- Amount must be positive

### Retire Action

**Implementation:**

```typescript
{
  action: "retire";
}
```

**Behavior:**

- Changes character status to "retired"
- Prevents further gameplay actions
- Preserves character data

**Validation:**

- Character must be active
- Character must belong to authenticated user

### Kill Action

**Implementation:**

```typescript
{
  action: "kill";
}
```

**Behavior:**

- Changes character status to "dead"
- Prevents further gameplay actions
- Preserves character data

**Validation:**

- Character must be active
- Character must belong to authenticated user

---

## Action Data Structures

### Action Request

```typescript
interface ActionRequest {
  actionType: string;
  characterId: string;
  parameters: Record<string, unknown>;
  modifiers?: Modifier[];
  context?: ActionContext;
}
```

### Action Result

```typescript
interface ActionResult {
  success: boolean;
  actionType: string;
  dicePool?: number;
  hits?: number;
  glitch?: boolean;
  criticalGlitch?: boolean;
  netHits?: number;
  effects?: ActionEffect[];
  error?: string;
}
```

### Action Context

```typescript
interface ActionContext {
  combatSessionId?: string;
  turnNumber?: number;
  passNumber?: number;
  initiativeScore?: number;
  environmentModifiers?: Modifier[];
  targetId?: string;
}
```

### Modifier

```typescript
interface Modifier {
  type: "wound" | "environment" | "situational" | "gear" | "spell" | "other";
  source: string;
  value: number;
  description?: string;
}
```

### Action Effect

```typescript
interface ActionEffect {
  type: "damage" | "heal" | "condition" | "modifier" | "other";
  target: string;
  value: number;
  duration?: number;
  description: string;
}
```

---

## Action Validation

### Pre-Action Validation

**Character State:**

- Character must be active (for most actions)
- Character must have required attributes/skills
- Character must have required equipment/abilities
- Character must meet action prerequisites

**Action Economy:**

- Character must have available actions (Free, Simple, Complex)
- Interrupt actions must have sufficient Initiative
- Multiple actions must respect action limits

**Resources:**

- Character must have required resources (ammo, Edge, karma, etc.)
- Equipment must be available and functional
- Spells/preparations must be known/prepared

### Post-Action Validation

**Results:**

- Dice pool calculations verified
- Hit calculations verified
- Glitch detection verified
- Effect applications verified

**State Updates:**

- Character state updated correctly
- Action economy updated correctly
- Resources consumed correctly
- Conditions applied correctly

---

## Integration Points

### Dice Roller Integration

**Action → Dice Roll:**

1. Action calculates dice pool from character data
2. Action applies modifiers
3. Action calls dice roller with pool
4. Dice roller returns results
5. Action processes results and applies effects

**Example Flow:**

```typescript
// Calculate pool
const pool = character.attributes.agility + character.skills.pistols;
const modifiers = calculateModifiers(character, action, context);
const finalPool = pool + modifiers.total;

// Roll dice
const result = await rollDice(finalPool, {
  limit: weapon.accuracy,
  threshold: action.threshold,
});

// Process results
if (result.hits >= action.threshold) {
  applySuccessEffects(character, result);
} else {
  applyFailureEffects(character, result);
}
```

### Character Data Integration

**Character Attributes:**

- Actions read character attributes for dice pools
- Actions read character skills for dice pools
- Actions read character equipment for modifiers
- Actions update character state after execution

**Character State:**

- Actions check character conditions (wounds, status effects)
- Actions update condition monitors
- Actions update action economy state
- Actions update resource pools (ammo, Edge, karma)

### Combat System Integration

**Initiative:**

- Actions respect initiative order
- Actions update initiative scores (for interrupts)
- Actions track action phases and passes

**Combat State:**

- Actions read combat environment modifiers
- Actions apply combat effects (damage, conditions)
- Actions update combat log

---

## API Requirements

### Current API

**POST `/api/characters/[characterId]/gameplay`**

- Handles character lifecycle actions
- Returns updated character
- Validates authentication and ownership

### Future API Endpoints

**POST `/api/characters/[characterId]/actions/execute`**

- Executes any gameplay action
- Validates action economy
- Returns action result
- Updates character state

**GET `/api/characters/[characterId]/actions/available`**

- Returns list of available actions
- Filters by character state
- Includes action costs and requirements

**POST `/api/combat/[sessionId]/actions/execute`**

- Executes combat action
- Validates combat state
- Updates combat session
- Returns combat result

**GET `/api/combat/[sessionId]/actions/available`**

- Returns available combat actions for character
- Includes action economy status
- Includes modifiers

---

## Testing Requirements

### Unit Tests

**Action Validation:**

- Test pre-action validation (character state, resources, prerequisites)
- Test action economy validation
- Test modifier calculations
- Test dice pool calculations

**Action Execution:**

- Test action execution logic
- Test result processing
- Test effect application
- Test state updates

**Action Types:**

- Test each action type individually
- Test action-specific rules
- Test edge cases

### Integration Tests

**Dice Roller Integration:**

- Test action → dice roll flow
- Test result processing
- Test glitch handling

**Character Data Integration:**

- Test character state reading
- Test character state updates
- Test resource consumption

**Combat System Integration:**

- Test combat action flow
- Test initiative handling
- Test combat state updates

### E2E Tests

**Action Workflows:**

- Test complete action workflows
- Test action sequences
- Test action economy enforcement
- Test error handling

---

## Future Enhancements

### Phase 1: Combat Actions

**Ranged Combat:**

- Implement weapon attack actions
- Implement called shots
- Implement firing modes
- Implement recoil calculations
- Implement environmental modifiers

**Melee Combat:**

- Implement melee attack actions
- Implement reach calculations
- Implement grappling/subduing
- Implement martial arts techniques

**Movement:**

- Implement movement actions
- Implement sprint actions
- Implement movement modifiers

**Defense:**

- Implement defense actions
- Implement interrupt actions
- Implement cover mechanics

### Phase 2: Skill Tests

**Skill Test Actions:**

- Implement generic skill test action
- Implement extended tests
- Implement teamwork tests
- Implement opposed tests

**Skill-Specific Actions:**

- Implement social skill actions
- Implement technical skill actions
- Implement physical skill actions

### Phase 3: Magic Actions

**Spellcasting:**

- Implement spell casting action
- Implement drain calculation
- Implement sustaining mechanics
- Implement spell effects

**Conjuring:**

- Implement summoning action
- Implement binding action
- Implement banishing action
- Implement spirit commands

**Enchanting:**

- Implement alchemy action
- Implement artificing action
- Implement disenchanting action

### Phase 4: Matrix Actions

**Matrix Actions:**

- Implement hacking actions
- Implement data manipulation actions
- Implement matrix combat actions
- Implement sprite actions

**Matrix Integration:**

- Integrate with matrix system
- Implement OS tracking
- Implement mark management

### Phase 5: Advanced Features

**Action History:**

- Track action history
- Display action log
- Export action history

**Action Templates:**

- Save action configurations
- Quick action access
- Character-specific templates

**GM Overrides:**

- GM action overrides
- Force results
- Modify actions

**Action Automation:**

- Auto-calculate pools
- Auto-apply modifiers
- Auto-resolve effects

---

## Edge Cases & Error Handling

### Invalid Actions

**Handling:**

- Return clear error messages
- Validate before execution
- Prevent invalid state changes
- Log validation failures

### Insufficient Resources

**Handling:**

- Check resources before action
- Return clear error messages
- Suggest alternatives
- Track resource availability

### Action Economy Violations

**Handling:**

- Enforce action economy rules
- Prevent invalid action sequences
- Track action usage
- Reset on new turn

### Concurrent Actions

**Handling:**

- Prevent concurrent action execution
- Lock character during action
- Queue actions if needed
- Handle race conditions

---

## Performance Considerations

### Action Execution

**Optimization:**

- Cache character data
- Batch state updates
- Minimize database calls
- Use efficient algorithms

### Dice Pool Calculation

**Optimization:**

- Cache modifier calculations
- Pre-calculate common pools
- Minimize recalculation
- Use efficient data structures

### State Management

**Optimization:**

- Incremental state updates
- Batch updates when possible
- Minimize full character reloads
- Use efficient storage

---

## Security Considerations

### Authentication

**Requirements:**

- All actions require authentication
- Validate character ownership
- Prevent unauthorized actions
- Log all action attempts

### Validation

**Requirements:**

- Validate all inputs
- Sanitize parameters
- Prevent injection attacks
- Validate state transitions

### Authorization

**Requirements:**

- Check action permissions
- Validate prerequisites
- Prevent privilege escalation
- Enforce game rules

---

## Dependencies

### Internal Dependencies

**Character Storage:**

- Character data access
- Character state updates
- Character validation

**Dice Roller:**

- Dice rolling functionality
- Result processing
- Glitch detection

**Rules System:**

- Ruleset data
- Modifier calculations
- Action definitions

### External Dependencies

**None** - All dependencies are internal to Shadow Master.

---

## Related Documentation

- **Combat Specification:** `/docs/rules/5e/game-mechanics/combat.md` - Combat action details
- **Magic Specification:** `/docs/rules/5e/game-mechanics/magic.md` - Magic action details
- **Matrix Specification:** `/docs/rules/5e/game-mechanics/matrix.md` - Matrix action details
- **Dice Roller Specification:** `/docs/specifications/dice_roller_specification.md` - Dice rolling integration
- **Character Creation:** `/docs/specifications/character_creation_and_management_specification.md` - Character data structure

---

## Change Log

### 2025-01-27

- Initial specification created
- Documents current character lifecycle actions
- Defines complete action system architecture
- Outlines future enhancement roadmap

---

## Open Questions

1. **Action History:** Should all actions be logged, or only significant ones (combat, critical tests)?

2. **Action Templates:** Should players be able to create custom action templates, or only use predefined ones?

3. **GM Overrides:** What level of GM override should be available? Should GMs be able to force results, modify pools, or skip validation?

4. **Action Automation:** Should the system automatically resolve some actions (e.g., simple skill tests), or should all actions require player/GM confirmation?

5. **Concurrent Actions:** How should the system handle multiple players attempting actions simultaneously? Should there be a queue system?

6. **Action Validation:** Should validation be strict (prevent invalid actions) or permissive (warn but allow with GM approval)?

7. **Offline Actions:** Should actions be executable offline, or must all actions go through the server for validation?

8. **Action Replay:** Should players be able to replay or undo actions, or should all actions be final once executed?

---

_This specification is a living document and will be updated as the gameplay action system evolves._
