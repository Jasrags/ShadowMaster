# Shadowrun 5E Defense Reference

## Overview

Characters usually have a chance to avoid or defend against incoming attacks before they connect, unless caught by surprise. Even stationary or inanimate targets may have a defense dice pool if they have Partial or Good cover.

---

## Standard Defense

### Base Defense Roll

```
Reaction + Intuition
```

This is the default, free defense roll available to all aware defenders.

---

## Ranged Defense

A defender has **two choices** for defending against ranged attacks:

### Standard Defense (Free)

```
Reaction + Intuition
```

### Full Defense

- **Cost:** Decrease Initiative Score by 10
- **Benefit:** Gain bonus equal to **Willpower** on Defense Tests for the whole Combat Turn
- See Active Defenses section for details

---

## Melee Defense

A defender has **five choices** for defending against melee attacks:

### Standard Defense (Free)

```
Reaction + Intuition
```

### Parry (Interrupt Action, -5 Initiative)

**Requirement:** Must have a melee weapon in hand

```
Reaction + Intuition + (Melee Weapon Skill) [Physical]
```

- Only lasts for a **single Defense Test**
- Bringing a skill into the mix means Physical limit applies

### Block (Interrupt Action, -5 Initiative)

**Requirement:** Must be empty-handed and have Unarmed Combat skill

```
Reaction + Intuition + Unarmed Combat [Physical]
```

- Only lasts for a **single Defense Test**
- Physical limit applies

### Dodge (Interrupt Action, -5 Initiative)

**Requirement:** None (any character, armed or unarmed)

```
Reaction + Intuition + Gymnastics [Physical]
```

- Only lasts for a **single Defense Test**
- Physical limit applies

### Full Defense (Interrupt Action, -10 Initiative)

```
Reaction + Intuition + Willpower
```

- Lasts for the **entire Combat Turn**
- Can be combined with Block, Dodge, or Parry

---

## Defense Modifiers

### Positive Modifiers (Defender's Favor)

| Situation                         | Modifier          | Notes                    |
| --------------------------------- | ----------------- | ------------------------ |
| Defender has longer Reach         | +Reach difference | Melee only               |
| Defender receiving a charge       | +1                | Must have Delayed Action |
| Defender running                  | +2                | Running movement rate    |
| Defender/target has partial cover | +2                | 25-50% body obscured     |
| Defender/target has good cover    | +4                | >50% body obscured       |
| Defender inside moving vehicle    | +3                | Against ranged attacks   |

### Negative Modifiers (Attacker's Favor)

| Situation                                  | Modifier          | Notes                                          |
| ------------------------------------------ | ----------------- | ---------------------------------------------- |
| Attacker has longer Reach                  | -Reach difference | Melee only                                     |
| Defender prone                             | -2                | Does not apply to ranged attacks at >5m        |
| Defender wounded                           | -Wound modifier   | Per usual wound penalty rules                  |
| Defender defended against previous attacks | -1 cumulative     | Per additional defense since last Action Phase |
| Defender in melee, target of ranged attack | -3                | Distraction penalty                            |
| Flechette narrow spread                    | -1                | Shotgun setting                                |
| Flechette medium spread                    | -3                | Shotgun setting                                |
| Flechette wide spread                      | -5                | Shotgun setting                                |
| Burst Fire / SA Burst                      | -2                | 3 rounds                                       |
| Long Burst / FA (Simple)                   | -5                | 6 rounds                                       |
| Full Auto (Complex)                        | -9                | 10 rounds                                      |
| Targeted by area-effect attack             | -2                | Grenades, spells, etc.                         |

### Special Cases

| Situation                             | Effect                                          |
| ------------------------------------- | ----------------------------------------------- |
| Defender unaware of attack            | **No defense possible** (treat as Success Test) |
| Defender behind cover (still unaware) | Defense pool = cover bonus only                 |

---

## Cover

### Types of Cover

#### Partial Cover (+2 Defense)

- 25-50% of defender's body obscured by intervening terrain or obstacles
- Examples: brush, foliage, crates, windows, doorways, curtains
- Requires **Take Cover** action

#### Good Cover (+4 Defense)

- More than 50% of defender's body obscured by intervening terrain or cover
- Also applies to **prone targets** at least 20 meters from attackers
- Requires **Take Cover** action

### Cover Interactions

- Cover modifiers apply to both **Ranged Combat** and **Spellcasting**
- Cover modifier does **not** negate the Blind Fire modifier the attacker suffers
- When firing at a target that is totally concealed (100% behind cover), both modifiers apply

### Hitting Through Cover

If attacker and defender tie in the Opposed Test while defender is in cover:

- Attacker hits the target **through the cover** they're using
- If the attack penetrates the barrier, damage can still be dealt
- See Barriers rules for penetration details

---

## Active Defenses (Interrupt Actions)

Sometimes you want to do more than duck and weave. Active defenses reduce the defender's Initiative Score but provide enhanced protection.

### Full Defense

**Cost:** -10 Initiative Score (Interrupt Action)

**Effect:**

- Bonus to defense dice pool equal to **Willpower**
- Lasts for the **entire Combat Turn**
- Can be used against any form of attack
- Can be combined with Block, Dodge, or Parry

**Requirements:**

- Character must not be surprised
- Can be declared at any point in a Combat Turn
- Can be declared when attacked, even before the character's Action Phase

### Dodge

**Cost:** -5 Initiative Score (Interrupt Action)

**Effect:**

```
Reaction + Intuition + Gymnastics [Physical]
```

**Requirements:**

- Character must not be surprised
- Works for any character, armed or unarmed
- Only lasts for a **single Defense Test**

### Parry

**Cost:** -5 Initiative Score (Interrupt Action)

**Effect:**

```
Reaction + Intuition + (Melee Weapon Skill) [Physical]
```

**Requirements:**

- Character must not be surprised
- Must have melee weapon **in hand**
- Must have appropriate weapon skill
- Only lasts for a **single Defense Test**
- Only usable against **melee attacks**

### Block

**Cost:** -5 Initiative Score (Interrupt Action)

**Effect:**

```
Reaction + Intuition + Unarmed Combat [Physical]
```

**Requirements:**

- Character must not be surprised
- Must be **empty-handed**
- Must have Unarmed Combat skill
- Only lasts for a **single Defense Test**
- Usable against **unarmed or melee attacks**

---

## Defense Summary Table

| Defense Type | Cost     | Dice Pool                | Limit    | Duration    | Usable Against |
| ------------ | -------- | ------------------------ | -------- | ----------- | -------------- |
| Standard     | Free     | REA + INT                | None     | Single test | Any            |
| Full Defense | -10 Init | REA + INT + WIL          | None     | Combat Turn | Any            |
| Dodge        | -5 Init  | REA + INT + Gymnastics   | Physical | Single test | Melee          |
| Parry        | -5 Init  | REA + INT + Melee Weapon | Physical | Single test | Melee          |
| Block        | -5 Init  | REA + INT + Unarmed      | Physical | Single test | Unarmed/Melee  |

---

## Special Defense Situations

### Defender Inside a Moving Vehicle

- Gains **+3 dice** to defense against ranged attacks
- Reflects difficulty of hitting someone in an unpredictable, moving environment

### Defender Prone

- Suffers **-2 dice pool modifier** to defense
- Does **not** apply to defending against ranged attacks unless attacker is extremely close (5 meters or less)
- Prone defenders behind good cover are protected from suppressive fire

### Defender Unaware of Attack

If the defender is unaware of an incoming attack (doesn't see attacker, attacker is behind them, surprised):

- **No defense is possible**
- Treat the attack as a **Success Test** instead of an Opposed Test
- Does not apply to defenders already engaged in combat

### Multiple Defenses

If a character has defended against at least one other attack since their last Action Phase:

- Apply **-1 cumulative modifier** for each additional defense roll
- Resets at the start of character's next Action Phase

---

## Reach in Defense

Reach affects melee defense based on the difference between attacker and defender:

| Situation                 | Effect                               |
| ------------------------- | ------------------------------------ |
| Attacker has longer Reach | Defender suffers -(Reach difference) |
| Defender has longer Reach | Defender gains +(Reach difference)   |
| Equal Reach               | No modifier                          |

**Note:** Trolls have a natural Reach of 1 that is cumulative with weapon Reach.

---

## Implementation Notes

### For Combat System

- Track defense modifiers from all sources
- Implement Initiative Score reduction for active defenses
- Handle cumulative defense penalties
- Support cover bonuses and penetration rules
- Track Full Defense duration (entire Combat Turn)
- Implement Reach calculations for melee defense

### For UI

- Display current defense modifiers
- Show Initiative cost for active defense options
- Indicate cover status and bonus
- Track number of defenses since last Action Phase
- Highlight when Full Defense is active

### State Tracking Requirements

- Cover status (none, partial, good)
- Prone status
- Running status
- Full Defense active (until end of Combat Turn)
- Defense count since last Action Phase
- Active Reach comparisons

---

## Reference

- SR5 Core Rulebook pp. 187-192 (Defending in Combat, Active Defenses)
- SR5 Core Rulebook pp. 173-175 (Ranged Modifiers, Environmental Modifiers)
