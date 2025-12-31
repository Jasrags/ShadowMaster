# Weapon Hand Slot System

This document outlines the design for modeling weapon wielding mechanics, including main hand, off-hand, and two-handed weapon support.

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [SR5 Rules Reference](#sr5-rules-reference)
3. [Hand Slot Model](#hand-slot-model)
4. [Type Definitions](#type-definitions)
5. [Validation Rules](#validation-rules)
6. [Dice Pool Modifiers](#dice-pool-modifiers)
7. [Two-Handed Weapons](#two-handed-weapons)
8. [UI/UX Design](#uiux-design)
9. [Data Updates](#data-updates)
10. [Integration Points](#integration-points)

---

## Problem Statement

The current weapon readiness system tracks whether a weapon is "readied" but doesn't model:

1. **Which hand** is holding the weapon (main vs. off-hand)
2. **Off-hand penalties** (-2 dice pool for non-dominant hand)
3. **Two-handed weapons** that require both hands
4. **Dual-wielding** scenarios (pistol in each hand)
5. **Hand availability** for other actions (spellcasting, climbing, etc.)

---

## SR5 Rules Reference

### Core Rules (SR5 Core Rulebook)

1. **Main Hand**: Primary weapon hand, no penalty
2. **Off-Hand**: Secondary hand, -2 dice pool modifier
3. **Ambidextrous Quality**: Negates off-hand penalty
4. **Two-Handed Weapons**: Require both hands to wield effectively
5. **Ready Weapon Action**: Simple Action to draw/ready a weapon

### Two-Handed Weapons in SR5 Core

Only two melee weapons in SR5 Core Rulebook are explicitly two-handed:
- **Combat Axe** (Reach 2, 5P damage, -4 AP)
- **Katana** (Reach 1, 3P damage, -3 AP)

### Firearms Handling

Most firearms can technically be fired one-handed but:
- Rifles/shotguns are designed for two-handed use
- Recoil is harder to manage one-handed
- Some weapons may have "two-handed" designation in sourcebooks

---

## Hand Slot Model

### Character Hand State

```
┌─────────────────────────────────────────┐
│           CHARACTER HANDS               │
├──────────────────┬──────────────────────┤
│    MAIN HAND     │      OFF HAND        │
│                  │    (-2 modifier)     │
│  ┌────────────┐  │  ┌────────────────┐  │
│  │  Weapon A  │  │  │   Weapon B     │  │
│  │  (1H)      │  │  │   (1H, -2)     │  │
│  └────────────┘  │  └────────────────┘  │
└──────────────────┴──────────────────────┘

        OR (Two-Handed Weapon)

┌─────────────────────────────────────────┐
│           CHARACTER HANDS               │
├─────────────────────────────────────────┤
│              BOTH HANDS                 │
│         ┌─────────────────┐             │
│         │    Weapon C     │             │
│         │    (2H)         │             │
│         └─────────────────┘             │
└─────────────────────────────────────────┘
```

### Hand Slot Rules

| Scenario | Main Hand | Off Hand | Modifier |
|----------|-----------|----------|----------|
| Single 1H weapon | Weapon | Empty | None |
| Off-hand only | Empty | Weapon | -2 |
| Dual-wield | Weapon A | Weapon B | -2 on B |
| Two-handed | Weapon | Weapon (same) | None |
| Unarmed | Empty | Empty | None |

---

## Type Definitions

```typescript
// =============================================================================
// HAND SLOT TYPES
// =============================================================================

/**
 * Which hand slot(s) a weapon occupies
 */
type HandSlot = "main" | "off" | "both";

/**
 * Extended weapon state when readied
 */
interface WeaponReadyState {
  location: "readied";

  /** Which hand(s) the weapon is in */
  handSlot: HandSlot;
}

/**
 * Weapon properties related to hand requirements
 */
interface WeaponHandProperties {
  /** Requires both hands to wield (Combat Axe, Katana, etc.) */
  twoHanded?: boolean;

  /** Can be used one-handed but designed for two (rifles, etc.) */
  twoHandedPreferred?: boolean;

  /** Penalty when used one-handed (for twoHandedPreferred weapons) */
  oneHandedPenalty?: number;
}

/**
 * Character combat state tracking hand occupation
 */
interface CharacterHandState {
  /** Weapon ID in main hand (null if empty) */
  mainHand: string | null;

  /** Weapon ID in off hand (null if empty) */
  offHand: string | null;
}

// Derived helpers
function isTwoHandedWeaponReady(state: CharacterHandState): boolean {
  return state.mainHand !== null &&
         state.mainHand === state.offHand;
}

function hasEmptyHand(state: CharacterHandState): boolean {
  return state.mainHand === null || state.offHand === null;
}

function getBothHandsFree(state: CharacterHandState): boolean {
  return state.mainHand === null && state.offHand === null;
}
```

---

## Validation Rules

```typescript
// =============================================================================
// WEAPON READY VALIDATION
// =============================================================================

interface ReadyWeaponResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate if a weapon can be readied in the specified hand slot
 */
function canReadyWeapon(
  character: Character,
  weapon: Weapon,
  targetSlot: HandSlot
): ReadyWeaponResult {
  const handState = character.combatState?.hands || { mainHand: null, offHand: null };

  // Check two-handed weapon requirements
  if (weapon.twoHanded) {
    if (targetSlot !== "both") {
      return {
        valid: false,
        error: "Two-handed weapon must be wielded with both hands"
      };
    }

    if (handState.mainHand !== null || handState.offHand !== null) {
      return {
        valid: false,
        error: "Both hands must be free to ready a two-handed weapon"
      };
    }

    return { valid: true };
  }

  // Single-handed weapon validation
  if (targetSlot === "both") {
    return {
      valid: false,
      error: "Single-handed weapon cannot occupy both hands"
    };
  }

  // Check if a two-handed weapon is currently equipped
  if (handState.mainHand !== null && handState.mainHand === handState.offHand) {
    return {
      valid: false,
      error: "Cannot ready weapon while wielding a two-handed weapon"
    };
  }

  // Check specific hand availability
  if (targetSlot === "main" && handState.mainHand !== null) {
    return {
      valid: false,
      error: "Main hand is already occupied"
    };
  }

  if (targetSlot === "off" && handState.offHand !== null) {
    return {
      valid: false,
      error: "Off hand is already occupied"
    };
  }

  return { valid: true };
}

/**
 * Ready a weapon and update character hand state
 */
function readyWeapon(
  character: Character,
  weaponId: string,
  targetSlot: HandSlot
): Character {
  const weapon = character.gear?.find(g => g.id === weaponId) as Weapon;
  if (!weapon) throw new Error("Weapon not found");

  const validation = canReadyWeapon(character, weapon, targetSlot);
  if (!validation.valid) throw new Error(validation.error);

  // Update hand state
  const newHandState = { ...character.combatState?.hands };

  if (targetSlot === "both" || weapon.twoHanded) {
    newHandState.mainHand = weaponId;
    newHandState.offHand = weaponId;
  } else if (targetSlot === "main") {
    newHandState.mainHand = weaponId;
  } else {
    newHandState.offHand = weaponId;
  }

  // Update weapon state
  const updatedGear = character.gear?.map(g => {
    if (g.id === weaponId) {
      return {
        ...g,
        state: {
          ...g.state,
          location: "readied" as const,
          handSlot: targetSlot
        }
      };
    }
    return g;
  });

  return {
    ...character,
    gear: updatedGear,
    combatState: {
      ...character.combatState,
      hands: newHandState
    }
  };
}
```

---

## Dice Pool Modifiers

```typescript
// =============================================================================
// OFF-HAND MODIFIER CALCULATION
// =============================================================================

/**
 * Check if character has Ambidextrous quality
 */
function isAmbidextrous(character: Character): boolean {
  return character.qualities?.some(
    q => q.qualityId === "ambidextrous" ||
         q.id === "ambidextrous"  // Legacy support
  ) ?? false;
}

/**
 * Get the off-hand dice pool modifier for a character
 */
function getOffHandModifier(character: Character): number {
  return isAmbidextrous(character) ? 0 : -2;
}

/**
 * Calculate weapon attack pool including hand slot modifiers
 */
function calculateWeaponAttackPool(
  character: Character,
  weapon: Weapon
): AttackPoolResult {
  const basePool = calculateBaseAttackPool(character, weapon);
  const handSlot = weapon.state?.handSlot;

  let handModifier = 0;
  let handModifierLabel = "";

  if (handSlot === "off") {
    handModifier = getOffHandModifier(character);
    if (handModifier < 0) {
      handModifierLabel = "Off-hand";
    }
  }

  return {
    basePool,
    handModifier,
    handModifierLabel,
    totalPool: basePool + handModifier,
    isOffHand: handSlot === "off",
    isAmbidextrous: isAmbidextrous(character)
  };
}

interface AttackPoolResult {
  basePool: number;
  handModifier: number;
  handModifierLabel: string;
  totalPool: number;
  isOffHand: boolean;
  isAmbidextrous: boolean;
}
```

---

## Two-Handed Weapons

### SR5 Core Two-Handed Weapons

| Weapon | Type | Reach | Damage | AP | Notes |
|--------|------|-------|--------|-----|-------|
| Combat Axe | Melee | 2 | (STR+5)P | -4 | Two-handed |
| Katana | Melee | 1 | (STR+3)P | -3 | Two-handed |

### Future Considerations

Some weapons may have optional two-handed use:
- **Rifles**: Can be fired one-handed with penalty
- **Shotguns**: Can be fired one-handed with penalty
- **Heavy Pistols**: Can be braced two-handed for stability

```typescript
interface WeaponHandlingOptions {
  /** Requires two hands, cannot be used one-handed */
  twoHanded?: boolean;

  /** Designed for two hands but can be used one-handed */
  twoHandedPreferred?: boolean;

  /** Penalty when used one-handed (-2 to -4 typical) */
  oneHandedPenalty?: number;

  /** Bonus when a 1H weapon is braced with off-hand */
  bracedBonus?: number;
}
```

---

## UI/UX Design

### Weapon Ready Dialog

When readying a single-handed weapon:

```
┌─────────────────────────────────────────┐
│  Ready Weapon: Ares Predator V          │
├─────────────────────────────────────────┤
│                                         │
│  Select hand:                           │
│                                         │
│  ┌─────────────┐  ┌─────────────┐       │
│  │  🤚 Main    │  │  ✋ Off     │       │
│  │  Hand       │  │  Hand       │       │
│  │             │  │  (-2 mod)   │       │
│  └─────────────┘  └─────────────┘       │
│                                         │
│  [Cancel]                    [Ready]    │
└─────────────────────────────────────────┘
```

For Ambidextrous characters:
```
│  ┌─────────────┐  ┌─────────────┐       │
│  │  🤚 Main    │  │  ✋ Off     │       │
│  │  Hand       │  │  Hand       │       │
│  │             │  │  (no penalty)│       │
│  └─────────────┘  └─────────────┘       │
```

### Combat Quick Reference

Show hand state and modifiers:

```
┌─────────────────────────────────────────┐
│  WEAPONS                                │
├─────────────────────────────────────────┤
│  🤚 Ares Predator V    12 [5]          │
│     Agility 5, Pistols 5, Smartgun +2   │
│                                         │
│  ✋ Combat Knife        8 [Phy] -2      │
│     Agility 5, Blades 5                 │
│     ⚠️ Off-hand penalty                 │
└─────────────────────────────────────────┘
```

### Hand State Indicator

In inventory panel, show current hand state:

```
┌──────────────────────────────────┐
│  HANDS                           │
│  🤚 Main: Ares Predator V        │
│  ✋ Off:  Combat Knife (-2)      │
└──────────────────────────────────┘
```

Or for two-handed:

```
┌──────────────────────────────────┐
│  HANDS                           │
│  🙌 Both: Katana                 │
└──────────────────────────────────┘
```

---

## Data Updates

### core-rulebook.json Changes

Add `twoHanded: true` to applicable weapons:

```json
{
  "weapons": {
    "melee": [
      {
        "id": "combat-axe",
        "name": "Combat Axe",
        "subcategory": "blades",
        "damage": "(STR+5)P",
        "ap": -4,
        "reach": 2,
        "twoHanded": true,
        "cost": 4000,
        "availability": "12R"
      },
      {
        "id": "katana",
        "name": "Katana",
        "subcategory": "blades",
        "damage": "(STR+3)P",
        "ap": -3,
        "reach": 1,
        "twoHanded": true,
        "cost": 1000,
        "availability": "9R"
      }
    ]
  }
}
```

### Weapon Type Extension

```typescript
// lib/types/character.ts

export interface Weapon extends GearItem {
  // ... existing fields

  /** Requires both hands to wield */
  twoHanded?: boolean;

  /** Extended state for readied weapons */
  state?: WeaponGearState;
}

interface WeaponGearState extends GearState {
  /** Which hand(s) the weapon is in when readied */
  handSlot?: HandSlot;
}
```

---

## Integration Points

### Combat Quick Reference

Update `getWeaponPools()` to include off-hand modifier:

```typescript
function getWeaponPools(character: Character, physicalLimit: number): CombatPool[] {
  // ... existing code

  return weapons.map((weapon) => {
    // ... existing pool calculation

    // Add off-hand modifier if applicable
    const handSlot = weapon.state?.handSlot;
    const offHandMod = handSlot === "off" ? getOffHandModifier(character) : 0;

    if (offHandMod < 0) {
      modifiers.push({
        label: "Off-hand",
        value: offHandMod,
        type: "situational"
      });
    }

    return {
      label: weapon.name,
      pool: pool + offHandMod,
      modifiers,
      // ... rest
    };
  });
}
```

### Dice Roller Integration

When rolling attacks, factor in hand modifiers:

```typescript
interface AttackRollContext {
  weapon: Weapon;
  handSlot: HandSlot;
  offHandPenalty: number;
  // ... other modifiers
}
```

---

## Open Questions

1. **Shields**: Do shields occupy the off-hand? Provide defense bonus?
2. **Unarmed + Weapon**: Can you punch with off-hand while holding pistol?
3. **Dropping Weapons**: Free action? Can be forced by called shot?
4. **Switching Hands**: Can you move weapon from main to off-hand? Action cost?
5. **Cyberlimbs**: Does having a cyberarm affect hand slot mechanics?

---

## Related Documents

- [Gear Location and Loadouts](./gear-location-and-loadouts.md) - Equipment location system
- [ADR-010: Inventory State Management](../decisions/ADR-010-inventory-state-management.md)
- SR5 Core Rulebook p.163-164 (Ready Weapon, Off-Hand)
