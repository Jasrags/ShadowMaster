# Shadowrun 5E Explosives Reference

## Overview

Explosives include thrown grenades, launched grenades, rockets, and missiles. All are area-effect weapons that require special rules for determining where they land and how their blast affects targets.

---

## Thrown Grenades

Grenades are small, self-contained explosive or gas-delivery packages.

### Throwing Grenades

**Attack Roll:**

```
Throwing Weapons + Agility [Physical] (3)
```

- Modified for range and all usual conditions
- Uses a **Throw Weapon Simple Action**

**Results:**

- **Success (3+ hits):** Grenade lands exactly where intended
- **Failure (< 3 hits):** Grenade scatters (see Determine Scatter below)

**Note:** Three hits means no scatter, but it's still possible to hit the target if the scatter roll is low and the thrower got some hits.

### Grenade Detonation Methods

#### Built-in Timer

- Grenade is thrown during the character's Action Phase
- Detonates in the **next Combat Turn** on the Initiative Score in which it was thrown **minus 10**
- Regardless of any additional changes to the thrower's Initiative Score

**Example:** Thrown at Initiative Score 15, detonates next Combat Turn at Initiative Score 5.

#### Motion Sensor

**Warning:** Grenades using a motion sensor are **extremely dangerous**.

- Once armed (about a second after sensor activation), explodes after any sudden stop or change in direction
- This means hitting the wall, floor, or target

**Resolution:**

1. Use standard Ranged Attack rules
2. If attack **misses** (no net hits):
   - Roll for scatter
   - Grenade scatters the **full amount** before exploding immediately
3. **Glitch:** Grenade does not detonate on initial impact; **doubles** the scatter distance, then explodes
4. **Critical Glitch:** Thrower waited too long - grenade detonates **immediately**, affecting the attacker and those around them

#### Wireless Link

The safest way to throw a grenade, but requires extra effort.

**Requirements:**

- The thrower (or anyone with a mark on the grenade) can detonate it wirelessly
- Requires a **direct neural interface** to the linked device

**With DNI:**

- Use **Change Wireless Device Mode Free Action** to detonate
- **Reduces scatter**

**Without DNI:**

- Must use **Change Linked Device Mode Simple Action** in next or subsequent Action Phases
- Scatter distance is **not reduced**

---

## Grenade Launchers, Rockets, & Missiles

Resolving a launched grenade, rocket, or missile attack is a two-step process:

1. Determine where the projectile ends up (see Determine Scatter)
2. Resolve the effect of the explosion (see Blast Effects)

### Attack Roll

```
Heavy Weapons + Agility [Accuracy] (3)
```

- Modified for range and all usual conditions
- Uses a **Fire Weapon Simple Action**

**Results:**

- **Success (3+ hits):** Projectile hits exactly where intended
- **Failure (< 3 hits):** Projectile scatters (see Determine Scatter)

### Launcher Minimum Range

**Critical:** The shortest possible range for all launchers is **5 meters**.

- Projectiles do not arm until they have traveled 5 meters
- They **will not detonate** if they hit anything before traveling 5 meters
- This is a **safety feature** in case of accidental misfire

**Disabling the Safety:**

```
Armorer + Logic [Mental] (4, 10 minutes) Extended Test
```

### Projectile Trigger Types

#### Built-in Timer

- Weapon is launched during the character's Action Phase
- Detonates in the **next Combat Turn** on the same Initiative Score in which it was fired **minus 10**
- Regardless of any changes to the attacker's Initiative Score

#### Motion Sensor / Impact Trigger

**Warning:** Projectile explosives using motion sensors or impact triggers are **extremely dangerous**.

- Once armed (after projectile has traveled **5 meters** unless safety is disarmed), explodes after any sudden stop or change in direction

**Resolution:**

1. Use standard Ranged Attack rules
2. If attack **misses** (no net hits):
   - Roll for scatter
   - Projectile scatters the **full amount** before exploding immediately
3. **Glitch:** Projectile does not detonate on initial impact; **doubles** scatter distance, then explodes
4. **Critical Glitch:** Arming mechanism misfires - explosive detonates **immediately**, affecting the attacker and those around them

#### Wireless Link

The safest way to launch a weapon but requires extra effort.

**Requirements:**

- Firer (or anyone with the projectile subscribed to their PAN) can detonate wirelessly
- Requires a **direct neural interface** to the linked device

**With DNI:**

- Use **Change Wireless Device Mode Free Action** to detonate
- **Reduces scatter**

**Without DNI:**

- Must use **Change Linked Device Mode Simple Action** in next or subsequent Action Phases
- Scatter distance is **not reduced**

---

## Determine Scatter

When the attacker misses their intended landing spot, the GM determines scatter.

### Direction

Roll **2D6** and consult the Scatter Diagram:

- The **7 arrow** indicates the direction of the launch
- Result of **7**: Projectile continued past the target
- Result of **12 or 2**: Projectile scatters back toward the attacker

### Distance

The Scatter Table indicates a number of dice rolled based on the projectile type. The final scatter distance is calculated as:

```
Scatter Distance = (Scatter Dice Roll) - (Attacker's Hits)
```

**Note:** If scatter distance is reduced to **0 or less**, the projectile hits the target exactly. Additional hits do not add to Damage Values.

### Scatter Reduction

- Wireless detonation with DNI reduces scatter
- Attacker hits reduce scatter distance

---

## Blast Effects

Grenades, rockets, and missiles are **area-effect weapons**. Their blast affects a given area and any targets within it.

### Distance-Based Damage Reduction

The farther away a target is from the blast point, the less damage they take. Different projectile types lose blast effect at different rates.

**Formula:**

```
Effective DV = Base DV - (Distance in meters * DV Reduction Rate)
```

Consult the Grenades/Rockets/Missiles Table for:

- Base Damage Code
- Damage Value reduction rate per meter

### Blasts in a Confined Space

When a grenade detonates in a confined space (hallway, room):

1. **Determine barrier integrity:** Consult Destroying Barriers rules
2. If walls/doors **hold up**, the blast is channeled
3. If barriers **fail**, determine blast effects normally

**Channeled Blast:**

- Shock wave reflects off walls, continuing back in the direction it came from
- If rebounding shock wave maintains enough DV to reach a character, that character is subject to the appropriate blast effect
- If character is struck **twice** (once as it headed out, once as it rebounded), the Damage Value equals the **combined DV of the two waves**

**Chunky Salsa Effect:**
A detonating explosive's blast could theoretically rebound repeatedly off each of the six surfaces in a small, well-built room, raising the effective Damage Value far higher than the original grenade damage.

### Multiple Simultaneous Blasts

When multiple explosives detonate at once on the same Combat Initiative Score and both blasts affect the same character:

**Damage Calculation:**

```
Combined DV = Highest DV + (Half of each lower DV)
```

Apply as a single modified Damage Value for Damage Resistance tests.

**Armor Penetration:**

- Use the **best AP**
- Improve it by **1 for every additional explosion**

---

## Grenade Types Summary

| Type           | Primary Effect  | Notes                        |
| -------------- | --------------- | ---------------------------- |
| Fragmentation  | Physical damage | Standard anti-personnel      |
| High Explosive | Physical damage | Higher base DV, larger blast |
| Flash-Bang     | Stun + Blind    | Non-lethal                   |
| Smoke          | Concealment     | Creates visibility penalties |
| Thermal Smoke  | Concealment     | Blocks thermal/infrared      |
| Gas            | Toxin delivery  | Varies by gas type           |
| Flash-Pak      | Blind           | Non-lethal distraction       |

---

## Implementation Notes

### For Combat System

- Track scatter direction and distance when attacks miss
- Implement blast radius calculations with distance-based damage reduction
- Handle confined space reflections (chunky salsa effect)
- Support multiple simultaneous blast calculations
- Track grenade detonation timing (Initiative Score - 10)
- Implement 5-meter minimum range for launchers

### For UI

- Visualize blast radius and scatter
- Show affected targets in blast zone
- Display countdown for timer-based grenades
- Indicate wireless-enabled grenades and their status

### Data Requirements

- Grenade/Rocket/Missile table with:
  - Base DV
  - AP
  - Blast radius
  - DV reduction rate per meter
  - Scatter dice
  - Available trigger types

---

## Reference

- SR5 Core Rulebook pp. 181-183 (Grenades, Launchers, Scatter, Blast Effects)
- SR5 Core Rulebook p. 435 (Grenades/Rockets/Missiles Table)
