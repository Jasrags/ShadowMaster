# Shadowrun 5E Sensors & Gunnery Reference

## Overview

This document covers vehicle-mounted weapons (gunnery), drone weapon systems, and sensor-based detection and targeting.

---

## Gunnery

The rules and modifiers for ranged combat apply to vehicle-mounted weapons.

### Manual Operation (Door Guns, Mounted Weapons)

**Attack Roll:**

```
Gunnery + Agility [Accuracy]
```

### Remote Operated Systems

**Attack Roll:**

```
Gunnery + Logic [Accuracy]
```

### Action Requirements

- **Complex Action** required for shooting weapons mounted on a vehicle in any firing mode
- This applies regardless of the weapon's normal firing mode action

### Handheld Weapons from Vehicles

Characters shooting handheld weapons (not vehicle-mounted) from vehicles:

- Follow normal rules for ranged combat
- Suffer **-2 dice penalty** for firing from a moving vehicle
- **Stationary vehicles** do not confer this penalty
- May inflict the **Firing from Cover** modifier if applicable

---

## Drone Gunnery

Drones attack using their onboard systems and autosofts.

### Attack Roll

```
Pilot + [Weapon] Targeting Autosoft [Accuracy]
```

### Requirements

- Drones **must** have an autosoft appropriate to the weapon they are wielding
- Drones **cannot fire a weapon untrained**
- No autosoft = no attack capability with that weapon

### Example

A drone with Pilot 3 and Ares Alpha Targeting autosoft 4 would roll:

```
3 (Pilot) + 4 (Targeting) = 7 dice [limited by weapon Accuracy]
```

---

## Sensor Attacks

### Detection

To detect a person, critter, or vehicle with sensors, make a successful Sensor Test.

#### For Characters/Vehicles with Operator

```
Perception + Intuition [Sensor]
```

#### For Autonomous Vehicles/Drones

```
Pilot + Clearsight [Sensor]
```

### Opposed Detection (Target Evading)

If the target is trying to evade detection, make this an Opposed Test:

| Target Type         | Defense Roll                                 |
| ------------------- | -------------------------------------------- |
| Metahumans/Critters | Infiltration + Agility [Physical]            |
| Driven Vehicles     | Infiltration (Vehicle) + Reaction [Handling] |
| Drones              | Pilot + [Model] Stealth [Handling]           |

**Note:** Since vehicle stealth is limited by the driver's ability, the dice applied for Infiltration skill should not exceed the driver's appropriate Vehicle skill.

### Signature Modifiers

Sensors are designed to detect the "signature" (emissions, composition, sound, etc.) of other vehicles. Modifiers from the **Signature Table** apply to the detecting vehicle's dice pool.

---

## Sensor Targeting

A character can use the vehicle's Sensor Attribute to help with Gunnery. Two options are available:

### Passive Targeting

The vehicle's Sensor attribute **substitutes for the Accuracy** of the weapon as the advanced targeting system compensates for weapon design flaws.

**Attack Roll:**

```
Gunnery + Logic [Sensor]
```

**Modifiers:**

- Target's **Signature modifiers** are applied as a dice pool modifier

### Active Targeting

Active targeting uses a vehicle's Sensors to **lock onto** a target.

#### Step 1: Acquire Target Lock

- Requires a **Simple Action**
- Make a **Sensor Test** to lock onto target

**If Lock Succeeds:**

- Net hits are applied as a **negative modifier to the Defense Test** on the attack

**If No Hits:**

- Sensors fail to lock onto target
- Active targeting attack **cannot be made**

#### Step 2: Maintain Lock

- Once locked, active targeting can be used against the target **without additional Sensor Tests**
- Lock is maintained until target breaks sensor contact

#### Breaking Sensor Lock

If target breaks sensor contact, a new target lock must be acquired.

**Breaking Contact:**

- Use an action to **Evade Detection**
- This is an Opposed Test using the appropriate Sensor Defense Test

### Sensor Defense Table

| Target Type         | Defense Roll                                 |
| ------------------- | -------------------------------------------- |
| Metahumans/Critters | Infiltration + Agility [Physical]            |
| Driven Vehicles     | Infiltration (Vehicle) + Reaction [Handling] |
| Drones              | Pilot + [Model] Stealth [Handling]           |

---

## Targeting Method Comparison

| Method            | Attack Roll       | Limit      | Special                         |
| ----------------- | ----------------- | ---------- | ------------------------------- |
| Manual            | Gunnery + AGI     | Accuracy   | Standard                        |
| Remote            | Gunnery + LOG     | Accuracy   | Standard                        |
| Drone Auto        | Pilot + Targeting | Accuracy   | Requires autosoft               |
| Passive Targeting | Gunnery + LOG     | **Sensor** | Signature mods apply            |
| Active Targeting  | Standard          | Standard   | Applies lock penalty to defense |

---

## Vehicle Weapon Actions

| Action Type | Use Case                                   |
| ----------- | ------------------------------------------ |
| Complex     | Fire any vehicle-mounted weapon (any mode) |
| Simple      | Use sensors to detect/lock targets         |
| Free        | Change linked device mode (with DNI)       |
| Simple      | Change linked device mode (without DNI)    |

---

## Implementation Notes

### For Combat System

- Support separate Gunnery skill for vehicle weapons
- Implement Pilot + Autosoft rolls for drones
- Track sensor locks on targets
- Apply signature modifiers to detection
- Support passive targeting (Sensor as limit)
- Support active targeting (lock provides defense penalty)

### For UI

- Display sensor lock status
- Show available targeting modes
- Indicate required autosofts for drones
- Display signature ratings for vehicles

### Data Requirements

- Vehicle sensor ratings
- Weapon targeting autosofts
- Vehicle/drone signature ratings
- Clearsight autosoft ratings

---

## Quick Reference

### Gunnery Attack Summary

```
Manual Mount:       Gunnery + Agility [Accuracy]
Remote System:      Gunnery + Logic [Accuracy]
Passive Targeting:  Gunnery + Logic [Sensor]
Active Targeting:   Standard attack + lock bonus vs defense
Drone Attack:       Pilot + Targeting Autosoft [Accuracy]
```

### Detection Summary

```
Character/Vehicle:  Perception + Intuition [Sensor]
Autonomous:         Pilot + Clearsight [Sensor]
```

---

## Reference

- SR5 Core Rulebook pp. 183-184 (Gunnery, Drone Gunnery, Sensor Attacks)
- SR5 Core Rulebook p. 269 (Autosofts)
