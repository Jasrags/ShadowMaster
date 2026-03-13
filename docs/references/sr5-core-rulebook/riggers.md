# Riggers

**Source:** SR5 Core Rulebook, Section 7
**PDF Pages:** 266–273 (Book Pages 264–271)

---

## Overview

Riggers are characters who use a **control rig** cyberware implant to "jump in" to vehicles, drones, and other devices, merging their consciousness with the machine. Jumped-in riggers treat Vehicle actions as Matrix actions, gain enhanced limits from their control rig rating, and suffer feedback damage when the device takes damage. Riggers operate through direct neural control (DNI), AR, or VR, and may manage fleets of drones via a **Rigger Command Console (RCC)**. Core skills are the Pilot family (Vehicle Active skills) and Gunnery.

---

## Rules

### Control Rig

- Cyberware implant (p. 452) required to jump in.
- Connects to motor cortex, cerebrum, brain stem, and sensorium.
- Includes a built-in mod for DNI compatibility with other devices.
- Comes with a universal data connector and ~1 meter of retractable cable (equivalent to a free datajack).
- Every vehicle needs a **rigger interface** to be jumped into; drones have it built in. Non-military/non-law-enforcement vehicles must have it added as an aftermarket option.

### Control Methods (Priority Order)

Devices can only be controlled one way at a time. Control methods, from highest to lowest priority:

1. Rigger control (jumped in)
2. Remote control (Control Device action, p. 238)
3. Manual control (physical controls)
4. Autopilot (requires Pilot program)

- A higher-priority method overrides a lower one.
- Once overridden, a lower-priority method cannot reassert control until the current controller relinquishes it (voluntarily or not), after the current Initiative Pass ends.

### Jumping In (Taking the Jump)

Prerequisites:

- Implanted control rig
- Owner of the device, or have 3 marks on it
- Device has rigger interface gear

Action cost:

- **Complex Action** if currently in AR
- **Simple Action** if already in VR when making the jump
- **Simple Action** if using a direct connection and already plugged into the vehicle or RCC

When jumped in, the rigger's icon and the device's Matrix icon merge into a single icon.

### VR and Rigging

When jumped in, the control rig allows treating Vehicle actions the same as Matrix actions. All Matrix bonuses also apply to Vehicle actions, including:

- Vehicle Control Tests
- Gunnery Tests
- Sensor Tests

**Cold-sim:** +2D6 to Initiative (3D6 total); biofeedback damage is Stun.
**Hot-sim:** +3D6 to Initiative (4D6 total); +1 dice pool bonus to all Matrix tests (including Vehicle actions); biofeedback damage is Physical.

### Rigging and Limits

When jumped into a vehicle, drone, or device, the **limits** of that device are increased by the rigger's control rig Rating. This applies to:

- Vehicle and drone Sensor
- Speed
- Handling
- Accuracy of mounted weapons

The control rig also connects more smoothly through an RCC when operating in VR.

### Noise and Rigging

- Wireless rigging suffers Noise penalty (p. 230) on all actions.
- Direct connection (cable) eliminates Noise entirely.

### Physical Damage (Feedback)

- When the jumped-in vehicle/device takes Physical damage, the rigger must resist **half** of that damage (rounded up) as **Biofeedback damage** (p. 229).

### Matrix Damage

- Matrix damage goes to the first device used for the rigger's persona, **not** the jumped-in device.
- If the rigger used a commlink or RCC to enter VR before jumping in, that commlink or RCC takes Matrix damage.
- If directly connected to the vehicle when jumped in, the **vehicle** takes Matrix damage.

### Jumping Out

- Use the **Switch Interface Mode** action (p. 243) to go to VR or AR.
- With an RCC, use **Jump into Rigged Device** action to jump directly to another device on the PAN.
- If the device is **destroyed** while jumped in: suffer **dumpshock** (6 DV biofeedback damage, p. 229).

### Getting Dumped

Riggers are forcibly ejected (dumped) in three situations:

1. The jumped-in device is **destroyed or bricked**
2. The commlink or RCC used to enter VR is **destroyed or bricked**
3. The rigger is **plugged in via universal connector** and the cable is physically yanked

In all cases, the dumped rigger suffers **dumpshock** (p. 229) and loses control of the device. Vehicles with a Pilot Rating return to autopilot at the beginning of the next Combat Turn. Uncontrolled vehicles must be handled per **Control Vehicle** (p. 203).

### Rigger Command Console (RCC)

- Functions as a commlink plus drone-control features.
- Creates a PAN with slaved drones (master-slave relationship).
- Maximum slaved drones: **Device Rating × 3**.
- Slaved drones form a **personal area network (PAN)** with the RCC as master.
- Device Rating determines the RCC's Matrix attributes (Device Rating = Pilot Rating for Matrix attribute purposes).
- Has **Data Processing** (acts as Limit for all Command tests; also acts as Initiative Limit when running in VR) and **Firewall** ratings.
- Firewall defends against wireless intrusion to the entire slaved drone network.
- Programs on an RCC cannot be used in a cyberdeck, and vice versa.
- RCC cannot run more than one program of the same type simultaneously.

### Noise Reduction and Sharing

- RCCs have **Noise Reduction** and **Sharing** ratings, set when booting.
- Noise Reduction: straight-up Noise reduction (p. 230), cumulative with other Noise Reduction.
- Sharing: the number of autosofts the RCC can simultaneously run on all slaved drones. A drone running its own autosofts cannot benefit from the RCC's autosofts.
- Noise Reduction + Sharing total **cannot exceed** the RCC's Device Rating.
- Adjust the split using **Change Device Mode** action (p. 163).

> **Ambiguity:** The rule states the two ratings cannot exceed Device Rating combined, meaning an RCC with Device Rating 1 can only have one or the other at value 1 at a time.

### Data Processing and Firewall

- Data Processing: used as the **Limit** for all Command tests performed on the RCC; also acts as Initiative limit when in VR.
- Firewall: defends against unwanted wireless intrusion onto the entire slaved drone network.
- Unlike cyberdecks, RCC ratings **cannot be readjusted on the fly** — they are fixed.

### Group Command and Jumping Around

- The RCC manages multiple parallel connections simultaneously.
- A single Simple Action can issue a command to one, all, or a subset of slaved drones.
- Commands from the RCC are executed on the **drone's Action Phase**, not the rigger's.
- The rigger can jump from one slaved drone to another without first jumping out of the current drone.
- Drones receiving multiple contradicting commands on the same control level (see Control Override, p. 265): fail to perform any of them and send an error message back.

### PANs and WANs (Rigger Style)

- Slaved drones use either their own or their master's Rating for each defense test, whichever improves on what they already have.
  - Example: a hacker uses Brute Force on a slaved rotodrone; the rotodrone can use the RCC's Willpower in place of its own Device Rating.
- Marks on a slaved device also grant a mark on the master device (and vice versa).
- If an attacker has a direct connection to a drone, that drone cannot use the RCC for help.
- **Wide area networks (WANs):** Multiple devices slaved to a host. Security spiders slave their RCC to a building's host, connecting to the entire security system. Inside a host, the "physical distance" to slaved drones is effectively zero regardless of real-world location.

> **Cross-reference:** PANs and WANs, p. 233.

### Electronic Warfare for Riggers

**Compensating for Noise (Active Counter-Jamming):**

- Take a **Complex Action** and roll **Electronic Warfare + Logic [Data Processing]** test.
- Hits act as Noise reduction (cumulative with all other Noise Reduction) for the rest of the current Combat Turn.

**Full Matrix Defense:**

- Available to riggers to bolster cyberdefenses.
- Slows the rigger down but helps prevent losing control of RCC or drones.

**Reboot Device:**

- Cuts off an enemy hack before it goes too far.
- Drone comes back online at the end of the **following Combat Turn**.
- Does not automatically result in drone wreckage for aerial drones that can glide/autorotate, or surface drones not moving too fast.

### Drones

- Unmanned vehicles operated remotely by riggers or running autonomously.
- Any vehicle/device with a rigger interface can be rigged; "drones" is shorthand for such devices in this context.
- Rules for drones apply to any remotely controlled or rigged device.

### Drones in the Matrix

- Drones are devices and appear in the Matrix — reachable from anywhere.
- The drone's **Device Rating equals its Pilot Rating** (all Matrix attributes equal Pilot Rating).
- When jumped into a drone, the attacker can only target the rigger's persona (the device it's on), **not** the drone itself.
- When not jumped in, the drone becomes a valid Matrix target again.

### Pilot Programs

- Pilot programs ("dog-brains") are device-specific: a pilot is adapted to a specific vehicle/drone/device and cannot be moved to another device. After ~1 week, the pilot is adapted and useless in any other device, even of the same model.
- Pilot Rating = Device Rating of the vehicle/drone it is in. This Rating replaces any Mental attribute needed for a test.
- When a novel/complex command arises, the Pilot must make a **Device Rating × 2 Test** against a threshold set by the GM. On failure, the Pilot either continues what it was doing or stops and asks for instructions.

### Autosofts

- Specialized programs that increase drone effectiveness. Analogous to skills for drones.
- Rating: 1–6.
- A drone has a number of **slots** for autosofts and cyberprograms equal to **half its Device Rating, rounded up**.
- Swapping autosofts/programs: **Complex Matrix Action**.
- Autosofts with `[Model]` in the name are model-specific (e.g., Steel Lynx Maneuvering only works in Steel Lynx drones).

**Autosoft Types:**

| Autosoft            | Function                                                         |
| ------------------- | ---------------------------------------------------------------- |
| Clearsight          | Acts as the drone's Perception skill                             |
| Electronic Warfare  | Exactly like the Electronic Warfare skill                        |
| [Model] Evasion     | Teaches autopilot to avoid being locked on by Sensors            |
| [Model] Maneuvering | Pilot [Vehicle type] skill for one specific drone model          |
| [Model] Stealth     | Infiltration skill for one specific drone model                  |
| [Weapon] Targeting  | Gunnery skill for one specific weapon model mounted on the drone |

- If a drone is slaved to an RCC and not running its own autosofts, it uses the RCC's programs (can exceed its normal program limit this way).

### Rigger Cyberprograms

RCC-compatible programs (cannot be used in a cyberdeck; RCC cannot run more than one of the same type):

| Program            | Effect                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Encryption         | +1 Firewall                                                                                 |
| Signal Scrub       | Rating 2 noise reduction                                                                    |
| Toolbox            | +1 Data Processing                                                                          |
| Virtual Machine    | 2 extra program slots; take 1 extra box of unresisted Matrix damage when attacked           |
| Armor              | +2 dice pool modifier to resist Matrix damage                                               |
| Biofeedback Filter | +2 dice pool modifier to resist biofeedback damage                                          |
| Guard              | Reduce extra damage from marks by 1 DV per mark                                             |
| Shell              | +1 dice pool modifier against Matrix and biofeedback damage, cumulative with other programs |
| Sneak              | +2 dice pool modifier to defend against Trace User actions                                  |
| Wrapper            | Allows defying Matrix iconography rules                                                     |

### Drone Combat

- Rules identical to regular flesh-and-blood combat (p. 158).
- Gunnery and Sensors rules for combat: p. 202.

### Drone Perception

- Autonomous: **Pilot + Clearsight [Sensor] Test**
- Jumped in: **Perception + Intuition [Sensor] Test**
- Either way, the rigger/drone gets to use the drone's entire sensor suite (if it has one).

### Drone Infiltration

- Autonomous: **Pilot + Stealth [Handling] vs. Perception + Intuition [Mental]**
- Jumped in: **Stealth + Intuition [Handling] vs. Perception + Intuition [Mental]**
- Note: running silent in Matrix is advisable during infiltration; otherwise the drone's Matrix icon is visible to anyone scanning.
- When jumped in with persona under silent running, the test is as above using the rigger's Stealth + Intuition.

### Drone Initiative

- **Autonomous:** Initiative = **Pilot Rating × 2**; Initiative Dice = **3D6** (total 4D6)
- **Jumped in:** Uses the **rigger's VR initiative**.

### Repairing Drones

- Drones have two damage tracks: **Physical** and **Matrix**.
- Filling either track destroys the drone.
- Physical damage can be repaired; follows building/repair rules (p. 145).
- Matrix damage: see **Repairing Matrix Damage** (p. 228).
- If both chassis (Physical track full) and electronics (Matrix track full) are destroyed simultaneously, repair is possible but likely more expensive than replacement.

### Rigging Skills

Primary skills for riggers:

- All **Pilot** skills (Vehicle Active skills, p. 146) — Pilot Ground Craft most common
- **Gunnery** — for firing weapons from vehicles/drones
- Pilot skills for drone types (e.g., Pilot Aircraft for flying drones) should match the drone types operated

---

## Tables

### Command Console Table

Lists all available Rigger Command Consoles with Device Rating, Availability, Cost, Data Processing, and Firewall ratings. See `riggers.json` → `tables.command-console`.

---

## Validation Checklist

- [ ] Jumping in while in AR costs a Complex Action; jumping in while already in VR costs a Simple Action.
- [ ] Jumping in via direct connection from meat body costs a Simple Action.
- [ ] Jumped-in limits for Sensor, Speed, Handling, and weapon Accuracy are increased by control rig Rating.
- [ ] Cold-sim initiative is 3D6; hot-sim initiative is 4D6 with +1 dice pool bonus to all Matrix tests.
- [ ] Cold-sim biofeedback damage is Stun; hot-sim biofeedback damage is Physical.
- [ ] Physical damage to jumped-in device: rigger resists half (rounded up) as biofeedback damage.
- [ ] Dumpshock on device destruction = 6 DV biofeedback damage.
- [ ] Matrix damage targets the persona device (commlink/RCC), not the jumped-in drone, unless directly connected.
- [ ] Maximum slaved drones = RCC Device Rating × 3.
- [ ] Noise Reduction + Sharing cannot exceed RCC Device Rating.
- [ ] RCC Data Processing is the Limit for all Command tests.
- [ ] RCC programs cannot run in a cyberdeck and vice versa; RCC cannot run two programs of the same type.
- [ ] Drone Device Rating = Pilot Rating (all Matrix attributes equal to Pilot Rating).
- [ ] Autosoft slots = half drone Device Rating, rounded up.
- [ ] Swapping autosofts = Complex Matrix Action.
- [ ] Autonomous drone initiative = Pilot × 2 + 3D6 (4D6 total).
- [ ] Jumped-in drone initiative = rigger's VR initiative.
- [ ] Autonomous drone perception = Pilot + Clearsight [Sensor].
- [ ] Jumped-in drone perception = Perception + Intuition [Sensor].
- [ ] Autonomous drone infiltration = Pilot + Stealth [Handling] vs. Perception + Intuition [Mental].
- [ ] Jumped-in drone infiltration = Stealth + Intuition [Handling] vs. Perception + Intuition [Mental].
- [ ] Marks on a slaved drone also place a mark on the master RCC.
- [ ] Control override priority: rigger > remote > manual > autopilot.
- [ ] Once overridden, a lower method cannot reassert until after the current Initiative Pass ends.
- [ ] Electronic Warfare counter-jamming: Electronic Warfare + Logic [Data Processing]; hits = Noise reduction for rest of Combat Turn.
- [ ] Reboot Device: drone offline until end of the following Combat Turn.
- [ ] Pilot novel command test: Device Rating × 2 vs. GM threshold; failure = continue prior action or stop and ask.
- [ ] [Model] autosofts only function in that specific drone model.
- [ ] Drone running own autosofts cannot also benefit from RCC's autosofts.
- [ ] Drone slaved to RCC not running its own autosofts uses the RCC's programs (can exceed drone's normal program limit).

---

## Implementation Notes

- The control rig Rating is the key scalar for jumped-in limit bonuses — store it on the character's augmentations and reference it when calculating effective device limits.
- The distinction between "jumped in" and "not jumped in" is binary state that affects: dice pools, initiative, feedback damage routing, and which entity is the valid Matrix target.
- Matrix damage routing (commlink vs. RCC vs. vehicle) depends on which device the persona was running on at the moment of jumping in — track this as a session state field.
- RCC Noise Reduction and Sharing are a budget split (sum ≤ Device Rating), not independent values — enforce this constraint in Change Device Mode logic.
- The PAN/WAN slave mark propagation rule (mark on slave = mark on master) is a critical security interaction to implement in Matrix combat resolution.
- Autosoft slots formula: `Math.ceil(droneDeviceRating / 2)` — drones slaved to an RCC without own autosofts running can exceed this limit via RCC programs.
- Drone autonomous initiative = `(Pilot * 2) + roll(3, 6)` (total pool is 4D6 but the fixed component is Pilot × 2).
- For the Pilot novel command threshold, the GM sets it; flag this as requiring a configurable/narrative input rather than a calculated value.

> **Cross-reference:** Combat rules p. 158; Gunnery/Sensors p. 202; Control Vehicle p. 203; PANs and WANs p. 233; Matrix damage/biofeedback/dumpshock p. 229; Noise p. 230; Control Device action p. 238; Switch Interface Mode p. 243; Building/Repair p. 145; Repairing Matrix Damage p. 228; Control rig augmentation p. 452; Vehicle Active skills p. 146; Change Device Mode p. 163.
