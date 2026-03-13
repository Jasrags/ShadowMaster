# Street Gear Part 3: Vehicles and Drones

**Source:** SR5 Core Rulebook, pp. 461–467
**PDF Pages:** 463–469
**Section:** Street Gear

---

## Overview

Vehicles and drones in SR5 are defined by eight core attributes. Vehicles are split into Groundcraft, Watercraft, and Aircraft categories, each operated by a corresponding Pilot skill. Drones are operated by Pilot Walker, Pilot Groundcraft, or Pilot Aircraft depending on their locomotion type. Combat-relevant vehicle attributes are defined in the Vehicles chapter (p. 198); the Seating attribute is a non-combat attribute defined in this section. Vehicle modifications (Rigger Interface, weapon mounts, Manual operation) are purchasable additions. "Similar Models" are flavor variants with no mechanical difference except brand-related price tweaks and possibly minor attribute variations.

---

## Rules

### Vehicle Attribute: Seating

**Seating** determines how many people can fit in a vehicle (including the operator) and provides cargo space. Each extra "seat" beyond occupants can hold up to 250 kilograms of cargo. Seating for people can be exceeded by up to 150% by stuffing people inside, but doing so decreases the vehicle's Speed and Handling attributes by one for each extra person beyond normal capacity.

### Handling (On Road / Off Road)

When a vehicle's Handling stat shows a slash (e.g., `4/3`), the first number is On Road and the second is Off Road. Speed is listed the same way when it differs by terrain.

### Vehicle Modification: Rigger Interface

- **Avail:** 4
- **Cost:** 1,000¥
- When installed, allows a rigger to jump in and control the vehicle directly through immersive virtual reality.
- Supports control via direct fiber-optic cable or wireless link.
- Cross-reference: **Being the Machine**, p. 265.

### Vehicle Modification: Weapon Mounts

- A vehicle may be equipped with weapon mounts equal to its unaugmented Body ÷ 3 (round down).
- **Standard weapon mount:** Avail 8F, Cost 2,500¥. Holds any assault rifle or smaller-sized weapon and 250 rounds of belted ammo.
- **Heavy weapon mount:** Avail 14F, Cost 5,000¥. Counts as two weapon mounts; holds any weapon and up to 500 rounds of belted ammo or up to Body rockets/missiles.
- All weapon mounts are operated remotely and can target a ninety-degree arc of fire (horizontal and vertical).
- Weapon mounts cannot be added to drones, only vehicles.

### Vehicle Modification: Manual Operation

- **Avail:** +1
- **Cost:** +500¥
- Adds a manual cockpit/controls. Can only be added to vehicles, not drones.

### Similar Models Rule

Every listed vehicle has numerous cousins, copycats, clones, and competitors. "Similar models" carry the same name but different branding, make, and model year. There are no mechanical differences between similar models except brand-related price tweaks and possibly a point or so difference in an attribute or two.

### Bikes

Operated with the **Pilot Ground Craft** skill. Most have electric or hybrid biofuel engines.

### Cars

Operated with the **Pilot Ground Craft** skill. Most have electric or hybrid biofuel engines.

### Trucks and Vans

Operated with the **Pilot Ground Craft** skill. Most have electric or hybrid biofuel engines.

### Boats

Operated with the **Pilot Watercraft** skill.

### Submarines

Operated with the **Pilot Watercraft** skill.

### Fixed-Wing Aircraft

Operated with the **Pilot Aircraft** skill.

### Rotorcraft

Helicopters are operated with the **Pilot Aircraft** skill.

### VTOL/VSTOL

Vectored thrust crafts (Vertical Take-Off and Landing / Vertical/Short Take-Off and Landing) are operated with the **Pilot Aircraft** skill.

### Microdrones

The skill used to pilot a microdrone varies from drone to drone — see individual entries.

- **Shiawase Kanmushi:** Operated with **Pilot Walker** skill.
- **Sikorsky-Bell Microskimmer:** Operated with **Pilot Groundcraft** skill (hovercraft specialization applies).

### Minidrones

- **Horizon Flying Eye:** Operated with **Pilot Aircraft** skill.

### Small Drones

- **Aztechnology Crawler:** Operated with **Pilot Walker** skill.
- **Lockheed Optic-X2:** Operated with **Pilot Aircraft** skill. Radar systems and visual and audio Perception Tests all receive a –3 dice pool penalty to spot the Optic-X2.

### Medium Drones

- **Ares Duelist:** Operated with **Pilot Walker** skill. Comes with a unique Rating 3 Targeting (Swords) autosoft and two standard swords in special weapon mounts. The mounted swords cannot be replaced with other weapons, but additional weapon mounts may be installed using the normal rules.
- **GM-Nissan Doberman:** Operated with **Pilot Groundcraft** skill. Comes with a standard weapon mount.
- **MCT-Nissan Roto-Drone:** Operated with **Pilot Aircraft** skill. Treat its Body as 3 higher than its actual Rating for determining how many weapon mounts or customizations it can integrate.

### Large Drones

- **Cyberspace Designs Dalmatian:** Operated with **Pilot Aircraft** skill. VTOL recon drone.
- **Steel Lynx Combat Drone:** Operated with **Pilot Groundcraft** skill. Has four wheeled legs and a heavy weapon mount.

---

## Tables

### Groundcraft Stats Table

All groundcraft (bikes, cars, trucks/vans). See `street-gear-vehicles-drones.json` → `tables.groundcraft`. Columns: Handling (On Road/Off Road), Speed (On Road/Off Road), Accel, Body, Armor, Pilot, Sensor, Seats, Avail, Cost.

### Watercraft Stats Table

All boats and submarines. See `street-gear-vehicles-drones.json` → `tables.watercraft`. Columns: Handling, Speed, Accel, Body, Armor, Pilot, Sensor, Seats, Avail, Cost.

### Aircraft Stats Table

All fixed-wing, rotorcraft, and VTOL/VSTOL aircraft. See `street-gear-vehicles-drones.json` → `tables.aircraft`. Columns: Handling, Speed, Accel, Body, Armor, Pilot, Sensor, Seats, Avail, Cost.

### Drones Stats Table

All drones (microdrones through large drones). See `street-gear-vehicles-drones.json` → `tables.drones`. Columns: Handling, Speed, Accel, Body, Armor, Pilot, Sensor, Seats, Avail, Cost.

### Vehicle Modifications Table

See `street-gear-vehicles-drones.json` → `tables.vehicle-modifications`. Lists Rigger Interface, Standard Weapon Mount, Heavy Weapon Mount, Manual Operation with Avail and Cost.

### Similar Models Table

See `street-gear-vehicles-drones.json` → `tables.similar-models`. Maps each listed vehicle name to its flavor-only variant names; no mechanical difference.

---

## Validation Checklist

- [ ] Groundcraft table has exactly 15 entries (Dodge Scoot through Ares Roadmaster).
- [ ] Watercraft table has exactly 5 entries (Samuvani Otter, Yongkang Gala Trinity, Morgan Cutlass, Proteus Lamprey, Vulkan Electronaut).
- [ ] Aircraft table has exactly 9 entries (Artemis Nightwing, Cessna C750, R-F Fokker Tundra-9, Ares Dragon, Nissan Hound, Northrup Wasp, Ares Venture, GMC Banshee, Fed-Boeing Commuter).
- [ ] Drones table has exactly 11 entries (Shiawase Kanmushi, S-B Microskimmer, MCT Fly-Spy, Horizon Flying Eye, Aztechnology Crawler, Lockheed Optic-X2, Ares Duelist, GM-Nissan Doberman, MCT-Nissan Roto-Drone, C-D Dalmatian, Steel Lynx).
- [ ] Ares Roadmaster Body is 18, Armor is 18.
- [ ] Mitsubishi Nightsky Avail is 16, Cost is 320,000¥.
- [ ] GMC Banshee Cost is 2,500,000¥ (most expensive aircraft).
- [ ] Steel Lynx Armor is 12, Cost is 25,000¥, Avail is 10R.
- [ ] Lockheed Optic-X2 Body is 2, Armor is 2, Avail is 10.
- [ ] MCT-Nissan Roto-Drone Body-for-mounts rule: use actual Body + 3 for mount/customization capacity.
- [ ] Ares Duelist comes factory-equipped with Rating 3 Targeting (Swords) autosoft and two sword weapon mounts (not replaceable with other weapons).
- [ ] Seating overcapacity rule: exceeding normal Seating by up to 150% reduces Speed and Handling by 1 per extra person.
- [ ] Heavy weapon mount counts as TWO weapon mounts toward the Body ÷ 3 limit.
- [ ] Weapon mounts cannot be added to drones.
- [ ] Sikorsky-Bell Microskimmer uses Pilot Groundcraft (hovercraft specialization), not Pilot Aircraft.
- [ ] Vehicle modifications table has exactly 4 entries.

---

## Implementation Notes

- **Handling on road vs. off road:** Store as two separate numeric fields (`handlingOnRoad`, `handlingOffRoad`). When a single value appears without a slash, use the same value for both. Same pattern applies to Speed.
- **Seating as cargo:** Implement the "1 seat = 250 kg cargo" rule in the cargo capacity calculator.
- **Overcapacity penalty:** Apply –1 Speed and –1 Handling per person above normal Seating, up to 150% of normal Seating. Exceeding 150% should be disallowed or flagged.
- **Weapon mount limit:** `floor(vehicle.body / 3)`. Heavy mounts consume 2 slots. Validate against this cap when adding mounts.
- **Drone pilot skill:** Store `pilotSkill` per drone entry (values: `"pilotWalker"`, `"pilotGroundcraft"`, `"pilotAircraft"`). Microskimmer uses `"pilotGroundcraft"` with hovercraft specialization noted.
- **Roto-Drone body-for-mounts:** Implement as `effectiveBodyForMounts = body + 3` for MCT-Nissan Roto-Drone specifically, or expose a `bodyMountBonus` field.
- **Ares Duelist fixed weapons:** Store the sword mounts as non-replaceable; flag `replaceable: false` on those specific mount entries.
- **Similar models:** Store as metadata only (flavor); do not create separate stat entries. The similar-models table is reference-only.
- **Avail codes:** `R` = Restricted, `F` = Forbidden. `—` means no restriction. Numeric prefix is the Availability threshold.
- **Cross-references:** Vehicle combat attributes are fully defined in the Vehicles chapter (p. 198). This section only adds Seating and modifications. The `riggers.md` reference covers jump-in mechanics.

> **Ambiguity:** The book states seating can be exceeded by "up to 150 percent by stuffing people inside" but does not explicitly state whether this cap is a hard cap (i.e., no additional passengers possible) or a soft cap that GMs can override. Treat as a hard cap in implementation.

> **Cross-reference:** Rigger Interface jump-in mechanics → `riggers.md` / SR5 p. 265. Vehicle combat attributes (Handling, Speed, Accel, Body, Armor, Pilot, Sensor) are fully defined at SR5 p. 198.
