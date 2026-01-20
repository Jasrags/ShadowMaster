# Shadowrun 5E Firearms Reference

## Overview

Firearms throw high-velocity projectiles designed to damage whatever they hit. A weapon's firing mode determines how quickly each round is ready to fire, how quickly you can pull the trigger, and what happens when you do.

## Firing Modes

### Single Shot (SS)

Firing a Single Shot weapon uses a **Simple Action** that cannot be combined with any other attacking Simple Action in the same Action Phase.

- SS weapons can take advantage of the **Multiple Attacks Free Action** if the attacker is wielding two such weapons
- Examples: bolt-action rifles, single-action revolvers, pump-action shotguns, lever-action rifles, large weapons requiring extra time to chamber due to cartridge size
- Single Shot fire assumes another round is readied with each shot as long as rounds are available

| Attribute        | Value  |
| ---------------- | ------ |
| Action           | Simple |
| Rounds Used      | 1      |
| Defense Modifier | 0      |
| Recoil           | None   |

### Semi-Automatic (SA)

Semi-automatic weapons fire a round every time the trigger is pulled and automatically chamber a fresh round after each shot.

- Uses a **Simple Action** but cannot combine with any other attack Action in the same Action Phase
- Can take advantage of **Multiple Attacks Free Action** with two semi-automatic weapons
- Also has the option of using a **Semi-Automatic Burst** (see below)

| Attribute        | Value  |
| ---------------- | ------ |
| Action           | Simple |
| Rounds Used      | 1      |
| Defense Modifier | 0      |

### Semi-Automatic Burst (SB)

Three semi-automatic shots taken in quick succession.

- Uses a **Complex Action**
- Increases the chance that a bullet will hit
- Can take advantage of **Multiple Attacks Free Action** to fire at multiple targets with the same burst

| Attribute        | Value   |
| ---------------- | ------- |
| Action           | Complex |
| Rounds Used      | 3       |
| Defense Modifier | -2      |

### Burst Fire (BF)

Usually found on SMGs or assault rifles, but some pistols and shotguns can be modified for this mode. In burst-fire mode, a gun rapidly fires three bullets every time the trigger is pulled.

- Uses a **Simple Action** that cannot be combined with any other attack Simple Action in the same Action Phase
- Can take advantage of **Multiple Attacks Free Action** to fire at multiple targets with the same burst

| Attribute        | Value  |
| ---------------- | ------ |
| Action           | Simple |
| Rounds Used      | 3      |
| Defense Modifier | -2     |

### Long Burst (LB)

Quickly firing in Burst Fire mode - the gun fires two three-round bursts in rapid succession.

- Uses a **Complex Action**
- Can take advantage of **Multiple Attacks Free Action** to fire at multiple targets with the same burst

| Attribute        | Value   |
| ---------------- | ------- |
| Action           | Complex |
| Rounds Used      | 6       |
| Defense Modifier | -5      |

### Full-Auto (FA)

Full-Auto weapons can throw bullets for as long as the attacker keeps the trigger pulled and the rounds last.

- Can be fired as a **Simple Action** (6 bullets) or **Complex Action** (10 bullets)
- Can take advantage of **Multiple Attacks Free Action** to fire at multiple targets with the same burst

| Action Type | Rounds Used | Defense Modifier |
| ----------- | ----------- | ---------------- |
| Simple      | 6           | -5               |
| Complex     | 10          | -9               |

### Suppressive Fire

A combination of controlled and fully automatic bursts focused over a narrow area and directed at anything that moves.

**Mechanics:**

- Uses a **Complex Action**
- Consumes **20 rounds of ammo**
- **Ignores recoil**
- Creates a triangular suppression zone

**Zone Characteristics:**

- Projects from the shooter outward up to a distance of the shooter's choosing (maximum = weapon range)
- Width of **10 meters** at its end
- Height of **2 meters**

**Attack Roll:**

```
(Weapon Skill) + Agility [Accuracy]
```

- Include bonuses for: smartlink, laser sight, tracer rounds, other GM-approved modifiers
- Record the hits

**Zone Effects:**

- The suppressive fire zone lasts until the end of the Combat Turn
- Firer must not move or commit to any other action to maintain the zone
- Anyone **in the zone or immediately adjacent** takes a dice pool penalty to all actions equal to the shooter's hits (unless completely unaware, e.g., astral projection)

**Risk of Being Hit:**

Characters who are in the suppressed area (not behind cover or prone), or who move into or out of the area before suppressive fire ends, must make:

```
Reaction + Edge Test (+ Full Defense dice if chosen)
Threshold = Suppressive attacker's hits
```

**Note:** Use full Edge rating regardless of spent points (but not burned Edge points).

**Failure:** Character is hit, suffering damage equal to the weapon's **base Damage Value** modified by special ammunition.

**Avoiding Damage:**

- Characters behind **full cover** or who **drop prone** are not at risk (but suffer normal prone modifiers)
- Characters may use their **Free Action** to go prone and avoid getting hit
- If no Free Action remains, can use **Hit the Dirt Interrupt Action** to go prone instead

**Standing Up:**

- Any character who stands up or moves again before suppressive fire stops must make a test to see if hit

**Multiple Overlapping Zones:**

- Only the highest dice pool penalty counts against targets
- Targets must make a Reaction + Edge test against **all overlapping zones**, taking damage from the ones missed
- Subject to diminishing pool effect: **-1 die penalty** to defender's dice pool after each roll

## Firing Mode Summary Table

| Mode             | Action  | Rounds | Defense Mod | Notes          |
| ---------------- | ------- | ------ | ----------- | -------------- |
| Single Shot (SS) | Simple  | 1      | 0           | No recoil      |
| Semi-Auto (SA)   | Simple  | 1      | 0           |                |
| SA Burst (SB)    | Complex | 3      | -2          |                |
| Burst Fire (BF)  | Simple  | 3      | -2          |                |
| Long Burst (LB)  | Complex | 6      | -5          |                |
| Full-Auto (FA)   | Simple  | 6      | -5          |                |
| Full-Auto (FA)   | Complex | 10     | -9          |                |
| Suppressive Fire | Complex | 20     | Special     | Ignores recoil |

---

## Shotguns

Shotguns can fire slug rounds (standard) or shot rounds. Shot rounds have little effect against 21st-century body armor.

### Shot Rounds

- Apply **flechette ammunition rules** to the Damage Value
- Shot rounds spread when fired, creating a cone extending outward from the muzzle
- Allows hitting multiple targets, but with reduced effectiveness due to spread

### Choke Settings

The choke controls the spread of shot pellets. Changing the choke setting requires:

- **Simple Action** (standard)
- **Free Action** (if smartlinked)

#### Narrow Spread

| Attribute        | Value           |
| ---------------- | --------------- |
| Defense Modifier | -1 (all ranges) |
| DV Modifier      | None            |
| Max Targets      | 1               |
| Called Shots     | Allowed         |

#### Medium Spread

| Range   | DV Mod | Accuracy | Defense Mod | Max Targets | Spread Width |
| ------- | ------ | -------- | ----------- | ----------- | ------------ |
| Short   | -1     | -        | -3          | 2           | 2m           |
| Medium  | -3     | -        | -3          | 3           | 4m           |
| Long    | -5     | -1       | -3          | 4           | 6m           |
| Extreme | -7     | -1       | -3          | 6           | 8m           |

**Note:** Medium spreads **cannot** be used with Called Shots.

#### Wide Spread

| Range   | DV Mod | Accuracy | Defense Mod | Max Targets | Spread Width |
| ------- | ------ | -------- | ----------- | ----------- | ------------ |
| Short   | -3     | -        | -5          | 2           | 3m           |
| Medium  | -5     | -        | -5          | 3           | 6m           |
| Long    | -7     | -1       | -5          | 4           | 9m           |
| Extreme | -9     | -1       | -5          | 6           | 12m          |

**Note:** Wide spreads **cannot** be used with Called Shots.

---

## Not Enough Bullets

When a firing character is short on ammo, reduce each of the modifiers applied by **1 for each bullet short**.

### Examples

**Full Auto (Complex) - Short on Ammo:**

- Wombat attempts Full Auto (Complex) but only has 7 rounds (needs 10)
- 10 - 7 = 3 bullet shortage
- Defense modifier reduced from -9 to -6

**Long Burst - Short on Ammo:**

- Full Deck fires a Long Burst with only 5 rounds (needs 6)
- 1 round short = -1 to modifier
- Defense modifier reduced from -5 to -4

### Suppressive Fire - Short on Ammo

If suppressive fire doesn't have enough bullets, the **width of the suppressed area** is reduced by **1 meter for every 2 bullets short** (rounded down).

**Example:**

- Wombat uses Suppressive Fire with only 13 rounds (needs 20)
- 7 rounds short = 3.5 meters reduction (rounded down to 3m)
- Zone width reduced from 10m to 7m

---

## Implementation Notes

### For Combat System

- Track ammunition count per weapon
- Calculate defense modifiers based on firing mode and ammo availability
- Support choke setting changes (Simple Action or Free with smartlink)
- Implement suppressive fire zone tracking with position-based effects

### For UI

- Display current firing mode and ammo count
- Show defense modifier preview for firing mode selection
- Visualize suppressive fire zones when applicable
- Indicate choke setting for shotguns

---

## Reference

- SR5 Core Rulebook pp. 178-180 (Firing Modes)
- SR5 Core Rulebook pp. 180 (Firing Mode Table)
- SR5 Core Rulebook p. 429 (Shotguns - Street Gear)
