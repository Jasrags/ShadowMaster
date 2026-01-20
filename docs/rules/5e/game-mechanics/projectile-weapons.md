# Shadowrun 5E Projectile Weapons Reference

## Overview

Ranged combat rules apply to bows and throwing weapons, with some special rules for each category.

---

## Thrown Weapons

Thrown weapons are used for a variety of different purposes.

### Damage-Dealing Thrown Weapons

Knives, hatchets, and shuriken are intended to injure a target on impact. They act just like projectiles in terms of attack rules.

### Shuriken

Multi-edged airfoil throwing blades available in many different styles.

**Readying:**

- A character can ready **Agility ÷ 2** shuriken per Ready Weapon action

**Example:** A character with Agility 5 can ready 2 shuriken (5 ÷ 2 = 2.5, rounded down to 2) with a single Ready Weapon action.

### Throwing Knife

This category covers a variety of slim knives or spikes.

**Readying:**

- A character can ready **Agility ÷ 2** throwing knives per Ready Weapon action

---

## Grenades (Thrown)

When throwing a grenade, choose a location as a target.

**Attack Roll:**

```
Throwing Weapons + Agility [Physical] (3)
```

- Modified for range and all usual conditions
- Uses a **Throw Weapon Simple Action**

**Results:**

- **Success (3+ hits):** Grenade lands right where intended
- **Failure (< 3 hits):** Grenade scatters

See the [Explosives Reference](./explosives.md) for detailed grenade rules including detonation methods and scatter.

---

## Bows

Bows can be straight, recurve, reflex, or compound, made of anything from wood to spring steel to modern composites.

### Minimum Strength Rating

Bows have a **minimum Strength rating** that indicates the minimum Strength a character must have to use that weapon effectively.

**Below Minimum Strength:**

- Suffer **-3 dice pool modifier per point below the minimum**
- This reflects the difficulty of pulling the bow and nocking an arrow

### Range and Damage Calculation

The weapon's **minimum Strength rating** is used to determine:

- Weapon's range
- Weapon's damage

**Damage Calculation:**

```
Base Damage = Lower of (Bow Rating, Arrow Rating)
```

### Bow Attributes

| Bow Type     | Typical Min STR | Notes                 |
| ------------ | --------------- | --------------------- |
| Survival Bow | 1-2             | Compact, emergency    |
| Bow          | 2-4             | Standard bow          |
| Compound Bow | 3-6             | Mechanical assistance |

---

## Crossbows

Modern crossbows are equipped with **automatic reloading devices** for faster firing rates.

### Reloading

- Reloading **does not require a Ready Weapon action** (for modern crossbows)
- Exception: Museum pieces/antique crossbows require Ready Weapon to reload

### Magazine

- Feature **internal magazines (m)** holding up to **4 bolts**

### Size Categories

| Category | Notes                          |
| -------- | ------------------------------ |
| Light    | Lower damage, faster handling  |
| Medium   | Balanced                       |
| Heavy    | Higher damage, slower handling |

---

## Thrown Weapon Ranges

Thrown weapons typically have limited range compared to firearms. Range is often based on:

- Character's Strength
- Weapon's aerodynamic properties
- Weapon weight

---

## Attack Resolution

### Standard Thrown Weapon Attack

```
Throwing Weapons + Agility [Physical]
```

vs.

```
Defender: Reaction + Intuition
```

### Bow/Crossbow Attack

```
Archery + Agility [Accuracy]
```

vs.

```
Defender: Reaction + Intuition
```

---

## Special Considerations

### Touch-Only Attacks

If the intention of an attack is simply to make contact (discharge a spell, plant an RFID tag, etc.):

- Attacker gains **+2 dice pool bonus**
- If all that is needed is contact, the **attacker wins on a tie** (not the defender)

### Multiple Thrown Weapons

Characters can use the Multiple Attacks Free Action with thrown weapons, but:

- Dice pool is split between attacks
- Maximum attacks = half of Combat Skill

### Ammunition Management

| Weapon Type        | Ready Amount | Notes                    |
| ------------------ | ------------ | ------------------------ |
| Shuriken           | AGI ÷ 2      | Per Ready Weapon action  |
| Throwing Knife     | AGI ÷ 2      | Per Ready Weapon action  |
| Bow                | 1 arrow      | Per Ready Weapon action  |
| Crossbow (modern)  | N/A          | Auto-feeds from magazine |
| Crossbow (antique) | 1 bolt       | Per Ready Weapon action  |

---

## Implementation Notes

### For Combat System

- Track minimum Strength requirements for bows
- Calculate readied projectile quantities based on Agility
- Implement damage calculation using min(Bow Rating, Arrow Rating)
- Support auto-reload for modern crossbows
- Handle multiple thrown weapons in single action

### For UI

- Display minimum Strength warning when below requirement
- Show number of projectiles that can be readied
- Track crossbow magazine capacity
- Indicate Strength-based range calculations

### Data Requirements

- Thrown weapon stats (damage, accuracy, range)
- Bow stats including minimum Strength rating
- Crossbow magazine capacities
- Arrow/bolt damage ratings

---

## Reference

- SR5 Core Rulebook pp. 181-182 (Projectiles)
- SR5 Core Rulebook pp. 424-425 (Projectile Weapons - Street Gear)
