# Shadowrun 5E Vehicles & Chase Combat Reference

## Overview

Vehicles provide expedient transportation and exciting combat opportunities. When a scene centers on vehicles, the primary theme is speed - vehicles are moving fast, the situation is changing fast, and the rules should resolve fast.

---

## Vehicle Stats

### Handling

Represents the vehicle's agility and responsiveness.

- Base limit for Vehicle Tests where **maneuverability** is the most important feature

### Speed

Represents the maximum velocity the vehicle can achieve (top-end speed).

- Base limit for Vehicle Tests that emphasize **raw speed**

### Acceleration

Defines how quickly a vehicle can change its current speed and close distance.

- Value represents the maximum number of **Range Categories** the vehicle can move in a single Combat Turn

### Body

Represents a combination of structural integrity and size.

- Larger vehicles tend to have more open spaces that are not high risk when attacked
- Used as part of the dice pool for **resisting damage** (like a metahuman character)

### Armor

Represents the vehicle's "toughness" and ability to take a hit and still function.

- Does not necessarily represent metal plating
- Can indicate general resistance due to structural integrity and strength
- Second value (with Body) that forms the dice pool for **damage resistance**

### Pilot

Rating defining the capabilities of the built-in computer piloting system.

- All vehicles in the Sixth World come equipped with this
- For vehicles **not actively piloted by a metahuman**, takes the place of:
  - All Mental attributes
  - Reaction
  - For any tests the vehicle needs to make

### Sensor

Rating representing the suite of information-gathering/detection devices.

- Acts as the **limit** for Perception and other detection tests using the vehicle's systems

### Condition Monitor

| Vehicle Type | Condition Monitor |
| ------------ | ----------------- |
| Vehicles     | 12 + ceil(Body/2) |
| Drones       | 6 + ceil(Body/2)  |

### Special Vehicle Properties

- Vehicles **ignore Stun damage**
- **Electricity-based attacks** are considered Physical Damage to vehicles
- Any attack where modified DV **does not exceed** the Armor of the vehicle does **nothing**

---

## Vehicle Tests

No test is required for non-combat, everyday situations (unless character is Incompetent).

### When Vehicle Tests Are Required

Tests are needed in dangerous or extreme situations with vehicles.

### Test Format

```
Vehicle Skill + Reaction [Handling]
```

### Threshold Guidelines

| Difficulty | Threshold | Examples                  |
| ---------- | --------- | ------------------------- |
| Easy       | 1         | Standard maneuvering      |
| Average    | 2         | Moderate difficulty       |
| Hard       | 4         | Challenging maneuvers     |
| Extreme    | 6         | Very difficult situations |

### Terrain Modifiers

Terrain affects the threshold of Vehicle Tests:

| Terrain Type                 | Threshold Modifier |
| ---------------------------- | ------------------ |
| Open/Clear                   | 0                  |
| Light (minor obstacles)      | +1                 |
| Restricted (narrow, winding) | +2                 |
| Tight (very limited space)   | +3                 |
| Severe (extreme hazards)     | +4                 |

---

## Vehicle Speeds (Long Distance)

### Foot

| Mode            | Speed        | Notes                             |
| --------------- | ------------ | --------------------------------- |
| Walking         | 5 kph        | Straight line in urban/flat rural |
| Hustling        | 10 kph       | Causes Fatigue damage             |
| Mountains/Rough | 1.25-2.5 kph | Half to quarter normal            |

### Bicycle

| Mode     | Speed  | Notes                    |
| -------- | ------ | ------------------------ |
| Road     | 25 kph | Streets and flat terrain |
| Off-road | ~6 kph | Quarter speed            |

Long periods or uneven terrain cause Fatigue.

### Ground Craft (with GridGuide)

| Environment         | Speed   |
| ------------------- | ------- |
| Urban               | 80 kph  |
| Rural/Cross-country | 120 kph |

### Watercraft

| Type              | Speed               |
| ----------------- | ------------------- |
| Kayaks/Canoes     | 3 kph (still water) |
| Against current   | 0.75 kph (quarter)  |
| With current      | 12 kph (quadruple)  |
| Small powerboats  | 25 kph              |
| Larger powerboats | 65 kph              |
| Speedboats        | 130 kph             |
| Cigarette boats   | 200 kph             |
| Yachts            | 60 kph              |
| Cruise ships      | 35 kph              |

### Rotorcraft

| Environment                | Speed   |
| -------------------------- | ------- |
| Open terrain               | 220 kph |
| Urban airspace             | 140 kph |
| Rural airspace (tilt-wing) | 300 kph |

### Aircraft

| Type                    | Speed     |
| ----------------------- | --------- |
| Prop planes             | 250 kph   |
| Small jets              | 1,000 kph |
| Large jets (commercial) | 800 kph   |

---

## Piloting Modifiers

### Environmental Modifiers

| Condition           | Modifier                                                 |
| ------------------- | -------------------------------------------------------- |
| Impaired Visibility | Use Visibility column from Environmental Modifiers Table |
| Limited Light       | Use Light column from Environmental Modifiers Table      |

These modifiers are mitigated and neutralized the same way as for other circumstances.

### Pilot-Related Modifiers

| Condition                | Effect                                                 |
| ------------------------ | ------------------------------------------------------ |
| Pilot unaware of event   | No Vehicle Test allowed against surprising threats     |
| Pilot wounded            | Apply wound modifiers to Vehicle tests                 |
| Piloting damaged vehicle | Apply vehicle's damage modifier as penalty to Handling |

### Technology Modifiers

| Control Method          | Effect                                                   |
| ----------------------- | -------------------------------------------------------- |
| Augmented Reality       | Increase limit of tests by **+1**                        |
| Virtual Reality         | Increase limit of tests by **+2**                        |
| Jumped In (Control Rig) | Decrease threshold by **Control Rig rating** (minimum 1) |

---

## Crashes

Crashes occur during:

- Ramming actions
- When driver on a collision course fails a vehicle test
- Whenever the GM says so

### Crash Damage

When a vehicle crashes, both vehicle and passengers must resist damage:

```
Damage = Vehicle's Body
Resistance = Body + Armor - 6 AP
```

**Damage Type:**

- **Stun** if vehicle's Body (base damage) is **less than** character's Armor
- **Physical** if vehicle's Body is **equal to or greater than** character's Armor

### Mental Trauma

Any character caught in a crash must make:

```
Composure (4) Test
```

**Failure:** Penalty to actions equal to how many hits they missed the threshold by, for that number of Combat Turns.

---

## Tactical Vehicle Combat

When transportation mode is mixed between vehicles and pedestrians (start of getaway, drive-by shooting).

### Movement

- Based on movement rate from vehicle's Speed rating
- Driver chooses movement rate at **beginning of each Combat Turn**

### Initiative

Resolved as normal.

### Actions

| Requirement       | Action                                                |
| ----------------- | ----------------------------------------------------- |
| Driver must spend | At least **1 Complex Action** per Combat Turn driving |
| Failure           | Vehicle is **uncontrolled** at end of Combat Turn     |

### Uncontrolled Vehicles

- All characters apply **-2 dice pool modifier** to all actions
- If driver doesn't make Vehicle Test to regain control in one Combat Turn:
  - **If Pilot rating exists:** Autopilot kicks in and drives with traffic flow
  - **If no Pilot program:** Vehicle continues last heading, slowing down (or maintaining speed if accelerator locked) until GM says it crashes

### Vehicle Actions

#### Free Actions

**Change Linked Device Mode (with DNI):**

- Activate/deactivate sensors, ECM, weapons, etc.
- Call up status report (position, heading, speed, damage, orders)
- Activated systems come online at start of **next Action Phase**

#### Simple Actions

**Use Sensors:**

- Detect or lock onto targets

**Use Simple Device:**

- Manually activate/deactivate sensors, ECM/ECCM, weapon systems, other onboard systems

#### Complex Actions

**Control Vehicle:**

- Not really an action, but expenditure to represent efforts to keep vehicle under control
- Doesn't need to be driver's first action
- Until taken, vehicle is considered uncontrolled

**Fire a Vehicle Weapon:**

- Fire a vehicle-mounted weapon

**Make Vehicle Test:**

- Execute a maneuver requiring a Vehicle Test
- Failed tests may result in uncontrolled vehicle or crash
- Glitched tests almost always result in a crash
- Critical Glitched tests **always** result in a crash

---

## Ramming

If a driver wants to ram something (or someone) with the vehicle, treat it as a **melee attack**.

### Requirements

Target must be within vehicle's Walking or Running Rate.

- **-3 dice modifier** applies if driver has to resort to running

### Attack Roll

```
Vehicle Skill + Reaction
```

### Defense Roll

| Target Type     | Defense                         |
| --------------- | ------------------------------- |
| Pedestrian      | Reaction + Intuition            |
| Another Vehicle | Reaction + Intuition [Handling] |

**Pedestrian Options:**

- Can use Full Defense or Dodge Interrupt Action
- **Cannot** use Block or Parry

### If Driver Gets More Hits

- Ram succeeds
- Make Damage Resistance Test as normal

### Ramming Damage

| Vehicle Speed | Base DV           |
| ------------- | ----------------- |
| Walking       | Body              |
| Running       | Body + (Speed/10) |
| Sprinting     | Body + (Speed/5)  |

**Note:** Ramming vehicle must resist only **half** that amount (round up).

### Passenger Damage Resistance

```
Body + Armor - 6 AP
```

### After Ramming

Each driver must make an additional Vehicle Test to avoid losing control:

| Role           | Threshold |
| -------------- | --------- |
| Ramming driver | 2         |
| Rammed driver  | 3         |

**Failure:** Vehicle is uncontrolled and cannot perform any actions until control is regained.

---

## Chase Combat

Used when a combat situation involves two or more parties all in moving vehicles.

### Chase Combat Turn Sequence

1. Determine Chase Environment for this Combat Turn
2. Establish relative Chase Ranges for participating vehicles
3. Roll Initiative for all characters
4. Take actions in Initiative order
   - Drivers may perform Chase Actions OR regular combat actions
   - Passengers may only perform regular combat actions

### Chase Ranges

Distance between vehicles is measured in Chase Ranges - brackets rather than exact distances.

| Range   | Speed Environment | Handling Environment |
| ------- | ----------------- | -------------------- |
| Short   | 0-50m             | 0-25m                |
| Medium  | 51-150m           | 26-75m               |
| Long    | 151-300m          | 76-150m              |
| Extreme | 301m+             | 151m+                |

Vehicles acting together can be grouped and assumed at the same range.

### Chase Environments

#### Speed Environment

- Movement is not significantly inhibited
- Maneuvering is minimal
- High speeds are possible
- Examples: major highway, open field, calm waters, clear skies
- May have very long sight lines (especially water or air)

#### Handling Environment

- Space is limited
- Quick reflexes and maneuverability more important than speed
- Top speed is almost never an option
- Examples: winding residential streets, rocky foothills/canyons, crowded harbor, flying at street level through a city

---

## Chase Actions (Complex Actions)

### Catch-Up/Break Away (Any Range)

Vehicle wishes to close distance or get away.

**Range Change Limit:** Equal to vehicle's **Acceleration**

**Test:**

```
Reaction + Vehicle Skill [Speed or Handling] (Maneuver Threshold)
```

- For every hit above threshold: shift **one Range Category** toward or away from opponent
- If move results in leaving Extreme range: pursuer gets own test to keep target in sight

### Cut-Off (Short Range Only)

Acting vehicle makes sudden move to cut off target, forcing it to crash.

**Opposed Test:**

```
Reaction + Vehicle Skill [Handling]
```

**If acting vehicle achieves more hits:**

- Target must make immediate Vehicle Test to avoid crashing
- Threshold = net hits on the test

### Ram (Short Range Only)

Acting vehicle attempts to collide with target.

**Opposed Test:**

```
Vehicle Skill + Reaction [Speed or Handling]
```

- Use **Speed** limit in Speed Environment
- Use **Handling** limit in Handling Environment

**If ramming vehicle achieves more hits:**

- Vehicles have collided
- Target takes damage = **Body of ramming vehicle + net hits**
- Ramming vehicle takes damage = **half its Body**

### Stunt (Any Range)

Last-second veer onto an off-ramp, tight turn into a side street, threading the needle through a tight area.

**Test:**

```
Vehicle Skill + Reaction [Speed or Handling]
```

- Use **Speed** limit in Speed Environment
- Use **Handling** limit in Handling Environment

**GM sets threshold** based on environment, difficulty, and terrain.

**Failure:**

- Vehicle goes out of control
- Could crash, slow down (allowing pursuers to gain a Range Category), or other consequences

**Success:**

- All pursuing vehicles must immediately make Vehicle Test at the **same threshold** to maintain pursuit range
- Failure: pursuer falls behind by one Range Category
- If pursuer already at Extreme Range: fleeing vehicle escapes pursuit

---

## Passenger Actions in Chase Combat

Passengers may take individual actions, but attacking targets outside the vehicle is difficult.

### Penalty

**-2 penalty** to all attack rolls when attacking targets outside the vehicle while using a weapon not mounted to the vehicle.

---

## Attacks Against Vehicles

### Defense Roll

| Situation                 | Defense Roll                |
| ------------------------- | --------------------------- |
| Driver-controlled vehicle | Reaction + Intuition        |
| Drone                     | Pilot + Autosoft [Handling] |

### Evasive Driving

The vehicle equivalent of Full Defense.

**Cost:** -10 Initiative Score (Free Action)

**Effect:**

- Add dice equal to **Intuition** to defense dice pool
- Lasts for entire Combat Turn
- **Cannot** be used against ramming attacks

---

## Vehicle Damage

### Damage Resistance

```
Body + Armor
```

**Note:** If attack's modified DV is **less than** vehicle's modified Armor, no damage is applied.

**GM Tip:** For vehicles with large Body dice pools, use the trade-in-dice-for-hits rule (4 dice = 1 hit) to simplify.

### Called Shots on Vehicles

Follow normal Called Shot rules (-4 penalty).

**Additional Option:** Target and destroy a specific component:

- Window
- Sensor
- Tire
- Etc.

GM determines exact effect based on DV inflicted. Usually component is destroyed.

**Shot-out tires:** -2 dice pool modifier per flat tire to Vehicle Tests.

**Note:** This targets the vehicle, not passengers.

---

## Damage and Passengers

### Targeting Choice

Attacks must specifically target either:

- **Passengers** (vehicle is unaffected)
- **Vehicle** (passengers are not affected)

### Exceptions (Affect Both)

- Ramming
- Suppressive fire
- Area-effect weapons (grenades, rockets)

### Attacking Passengers

Normal Attack Test with:

- Passengers always considered under **Good Cover** (+4)
- Additional **+3 modifier** for being inside a moving vehicle
- **Blind Fire modifier** may apply
- Passengers suffer **-2 dice pool modifier** to Defense Test (limited movement inside vehicle)
- Passengers gain protection from vehicle's chassis: add **vehicle's Armor** to personal armor

### Ramming, Suppressive Fire, and Area-Effect

Both passengers and vehicles resist the damage equally.

---

## Air and Naval Warfare

Rules presented are primarily for land, sea, and air combat on a **close scale** with conventional (shadowrunner-level) weapons.

For large-scale, long-range combat:

- Use these rules
- Extend ranges to those for assault cannons and missiles
- Ensure everyone understands added danger (ramming at 5,000 meters altitude)

---

## Implementation Notes

### For Combat System

- Track vehicle stats (Handling, Speed, Acceleration, Body, Armor, Pilot, Sensor)
- Implement Chase Range tracking
- Support both tactical and chase combat modes
- Calculate crash damage and composure tests
- Handle ramming mechanics
- Support Evasive Driving interrupt

### For UI

- Display Chase Range between vehicles
- Show Environment type (Speed/Handling)
- Track vehicle damage vs condition monitor
- Display available Chase Actions based on range
- Indicate passenger penalty for attacks

### State Tracking

- Current Chase Range between all vehicle pairs/groups
- Chase Environment type
- Vehicle control status (controlled/uncontrolled)
- Evasive Driving active status
- Damaged components

---

## Reference

- SR5 Core Rulebook pp. 199-205 (Vehicles, Vehicle Combat, Chase Combat)
- SR5 Core Rulebook pp. 266-269 (Rigging, Control Rigs)
