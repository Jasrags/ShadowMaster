# Shadowrun 5E Healing & Recovery Reference

## Overview

This document covers all healing methods in Shadowrun 5E: First Aid, Natural Recovery, Medicine skill, Medkits/Autodocs, Magical Healing, and Stabilization for characters in critical condition.

---

## First Aid

Characters with the First Aid skill may immediately help reduce the trauma of wounds (Stun or Physical).

### Requirements

- **Must have a medkit** (even if currently out of supplies)
- **Must be applied within 1 hour** of when the damage was taken

### Test

```
First Aid + Logic [Mental] (2)
```

Apply appropriate modifiers from the Healing Modifiers table, including:

- **Wound modifiers** if applying First Aid to yourself or others

### Results

- Each **net hit over the threshold** removes **1 box of damage**
- **Divide effect in half (rounded up)** if victim is wearing any kind of **full-body armor**
  - Represents difficulty of treating patient through armor

### Limitations

- Maximum damage healable = **First Aid skill rating**
- May only be applied **once** for that set of wounds
- May **not** be applied if the character has been **magically healed**

### Failures

- **Critical Glitch:** Increases damage by **1D3 boxes** (1D6 ÷ 2)

### Combat First Aid

Using First Aid in combat requires:

- **Complex Action**
- Takes a number of **Combat Turns** equal to the number of boxes of damage being healed

**Workflow:**

- Character applying First Aid must spend **one Complex Action per Combat Turn** providing care
- May spend the rest of their Action Phases however they like

### Diagnosis

First Aid may also be used to diagnose:

- Character's health
- Extent of wounds taken
- Effect of other ailments

**Test:** GM sets threshold appropriate to the character's health or affliction. Award information appropriate to net hits scored.

---

## Natural Recovery

Stun and Physical damage both heal naturally, though at different rates. Medical attention can help hasten the process.

### Tracking Healing

Healing is handled as an **Extended Test**. Hits from each test should be recorded separately in case of interruption.

### Stun Damage Recovery

```
Body + Willpower (1 hour) Extended Test
```

- Character must **rest for the entire hour** for it to count
- Forced naps and unconsciousness count as rest
- Each hit heals **1 box of Stun damage**

### Physical Damage Recovery

```
Body × 2 (1 day) Extended Test
```

- Character must **rest for the entire day** for it to count
- Forced naps and unconsciousness count as rest
- Each hit heals **1 box of Physical damage**

**Critical:** Physical damage **cannot be healed through rest** if the character also has **Stun damage**. The Stun damage must be healed first.

### Glitches During Natural Recovery

| Result          | Effect                                                 |
| --------------- | ------------------------------------------------------ |
| Glitch          | Doubles the resting time (damage still healed)         |
| Critical Glitch | Increases damage by 1D3 boxes AND doubles resting time |

### Boosting Natural Recovery

Natural Recovery can be bolstered by:

- Medkits
- Autodoc drones

---

## Medicine

Characters with the Medicine skill can speed the healing process.

### Test

```
Medicine + Logic [Mental]
```

Apply appropriate modifiers, including wound modifiers if applying Medicine to own wounds.

### Effect

Each hit provides **+1 die** to any subsequent healing tests the character makes for **healing through rest**.

### Time Requirements

The character using Medicine skill must spend time tending to the injured character:

| Damage Type       | Required Time       |
| ----------------- | ------------------- |
| Physical injuries | 30 minutes per day  |
| Stun injuries     | 10 minutes per hour |

### Limitations

- May only be applied **once** to each set of wounds
- **May** be applied even if First Aid and/or magical healing have already been used
- Additional damage taken afterward counts as a **new set of wounds**
- **Cannot** be applied in combat situations

### Diagnosis

Medicine may be used to diagnose a character's health in the same manner as First Aid.

---

## Medkits and Autodocs

Modern medkits and autodoc drones rival the capabilities of trained paramedics.

### Uses

1. Aid to a medtech's diagnoses or applied healing
2. Hooked up to patient and set to apply medical care automatically

### Using in Combat

Using a medkit/autodoc in combat is time-consuming:

1. **Complex Action** to apply the medkit/autodoc
2. After application, receive a **dice pool modifier equal to the device's rating** when treating a character
   - Requires **wireless functionality**
   - For autodocs: use First Aid or Medicine autosoft rating

### Untrained Use

If the character is untrained, they can still make an untrained First Aid test:

- Roll **Logic - 1** die
- Use **device's rating** in place of First Aid skill

### Automated Care

If a wireless medkit is hooked up to a patient and left unattended:

```
Roll: Device Rating × 2
```

For any subsequent tests.

### Remote Control

Medkits and autodocs can be accessed and controlled remotely via Matrix/wireless link.

---

## Magical Healing

The **Heal spell** can be used to repair physical injuries.

### Effect

Each hit from the Spellcasting Test heals **1 box of Physical damage**.

- Maximum = spell's Force

### Limitation

Sorcery **cannot** heal damage resulting from **magical Drain**.

---

## Physical Damage Overflow

Characters who exceed their Physical Condition Monitor and enter overflow damage are at risk of dying.

### Death Threshold

If you go over **(Body)** points of overflow damage:

- **You are dead**
- Time to permanently check out and meet Mr. Johnson in the Big Shadowrunner Bar in the Sky

### Ongoing Damage (Unstabilized)

If the character's condition is **not stabilized**, they take:

- **1 additional box of damage** every **(Body) minutes**
- Due to blood loss, shock, and other things affecting a body on the brink of death

---

## Stabilization

Stabilizing a wounded character prevents ongoing overflow damage.

### Stabilization Test

```
First Aid + Logic [Mental] (3)
```

OR

```
Medicine + Logic [Mental] (3)
```

Apply situational modifiers.

### Success

- Wounded patient **stabilizes**
- **No longer takes automatic additional damage**

### Failure

- Character **continues to take damage** until they die
- Additional stabilization tests may be made
- **-2 cumulative dice pool modifier** per test

### Alternative Methods

- **Medkits and autodocs** may be used to stabilize a character
- **Stabilize spell** may be used to stabilize a character
- **Heal spell cannot** be used to stabilize

### After Stabilization

Once a character has been stabilized:

- First Aid
- Medicine
- Magical healing

May all be applied normally.

---

## Healing Modifiers Table

| Condition                             | Modifier                 |
| ------------------------------------- | ------------------------ |
| Good conditions (sterilized facility) | +0                       |
| Average conditions (indoors, clean)   | -1                       |
| Poor conditions (outdoors, dirty)     | -2                       |
| Bad conditions (rain, sewers)         | -3                       |
| Terrible conditions (combat, filth)   | -4                       |
| Patient wearing full-body armor       | Halve healing (round up) |
| Wound modifiers                       | Apply as normal          |

---

## Healing Method Interactions

### First Aid

| Can be used with | Cannot be used with      |
| ---------------- | ------------------------ |
| Medicine (later) | Magical healing (prior)  |
| Natural Recovery | Second First Aid attempt |

### Medicine

| Can be used with        | Cannot be used with     |
| ----------------------- | ----------------------- |
| First Aid (prior)       | Combat situations       |
| Magical healing (prior) | Second Medicine attempt |

### Magical Healing

| Can be used with | Cannot be used with     |
| ---------------- | ----------------------- |
| Medicine (later) | First Aid (after magic) |
|                  | Healing Drain damage    |

---

## Healing Workflow Summary

### Immediate (Within 1 Hour)

1. **First Aid** - Up to skill rating boxes, threshold 2

### Short-Term

2. **Medicine** - Provides bonus dice to natural recovery
3. **Magical Healing** - Heal spell, up to Force boxes

### Long-Term

4. **Natural Recovery (Stun)** - Body + Willpower per hour
5. **Natural Recovery (Physical)** - Body × 2 per day (after Stun healed)

### Critical Condition

- **Stabilize** - Prevent overflow death
- Then apply normal healing methods

---

## Implementation Notes

### For Combat System

- Track wound sets separately for healing attempt limits
- Implement First Aid timing window (1 hour)
- Handle overflow damage timing (Body minutes between damage)
- Support medkit/autodoc automated healing
- Track stabilization status

### For UI

- Display time since damage taken (for First Aid window)
- Show stabilization status for overflow characters
- Track healing attempts per wound set
- Display medkit/autodoc application status
- Countdown for natural recovery intervals

### State Tracking Per Character

- Current wound set ID
- First Aid applied (yes/no)
- Medicine applied (yes/no)
- Magical healing applied (yes/no)
- Stabilization status
- Time in overflow
- Medkit/autodoc connected

### Healing Attempt Limits

| Method           | Limit                             |
| ---------------- | --------------------------------- |
| First Aid        | Once per wound set                |
| Medicine         | Once per wound set                |
| Magical Healing  | Variable (blocks First Aid after) |
| Natural Recovery | Unlimited (extended test)         |

---

## Quick Reference

### First Aid

```
First Aid + Logic [Mental] (2)
Time: 1 hour window
Max Healing: Skill rating
```

### Medicine

```
Medicine + Logic [Mental]
Time: 30 min/day (Physical) or 10 min/hour (Stun)
Effect: +1 die to natural recovery per hit
```

### Natural Recovery (Stun)

```
Body + Willpower (1 hour)
Effect: 1 box per hit
Requirement: Must rest for full hour
```

### Natural Recovery (Physical)

```
Body × 2 (1 day)
Effect: 1 box per hit
Requirement: Must rest for full day; no Stun damage
```

### Stabilization

```
First Aid OR Medicine + Logic [Mental] (3)
Effect: Stops overflow damage
Retry: -2 cumulative per attempt
```

---

## Reference

- SR5 Core Rulebook pp. 205-208 (Healing)
- SR5 Core Rulebook p. 170 (Exceeding the Condition Monitor)
- SR5 Core Rulebook p. 450 (Medkits)
- SR5 Core Rulebook pp. 288-289 (Heal and Stabilize spells)
