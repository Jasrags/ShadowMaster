# SR5 Wireless Bonuses Catalog

Comprehensive catalog of all wireless bonus effects extracted from SR5 source reference pages.
Used to populate structured `wirelessEffects` arrays on catalog items.

> **Bioware** explicitly has no wireless capability at all (SR5 CRB, p.459).

---

## Armor & Clothing (`SR5_Armor_Clothing.md`)

### CRB Items

| Item                        | Source | Wireless Bonus                                                                                     |
| --------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| Electrochromic Modification | Core   | Changing clothes' settings is a Free Action; can display images, text, or flat video from commlink |
| Chameleon Suit              | Core   | +2 dice pool bonus to Sneaking Tests for hiding                                                    |
| Riot Shield                 | Core   | Recharges by induction, 1 charge per hour                                                          |

### R&G Fashion Armor — Social Pool (+1 dice pool to Social Tests)

All of these share the same wireless bonus: **+1 dice pool bonus to Social Tests**.

| Item                                 | Source |
| ------------------------------------ | ------ |
| Armante Suit                         | R&G    |
| Armante Dress                        | R&G    |
| Mortimer of London, Berwick Suit     | R&G    |
| Mortimer of London, Berwick Dress    | R&G    |
| Mortimer of London, Crimson Sky Suit | R&G    |
| Mortimer of London, Summit Suit      | R&G    |
| Mortimer of London, Summit Dress     | R&G    |
| Mortimer of London, Greatcoat Coat   | R&G    |
| Mortimer of London, Ulysses Coat     | R&G    |
| Mortimer of London, Argentum Coat    | R&G    |
| Vashon Island, Ace of Cups           | R&G    |
| Vashon Island, Ace of Swords         | R&G    |
| Vashon Island, Ace of Wands          | R&G    |
| Vashon Island, Ace of Coins          | R&G    |
| Vashon Island, Ace of Spades         | R&G    |
| Vashon Island, Ace of Clubs          | R&G    |
| Vashon Island, Ace of Hearts         | R&G    |
| Vashon Island, Ace of Diamonds       | R&G    |
| Industrious                          | R&G    |

> **Pattern:** `{ type: "skill", skill: "social-tests", modifier: 1, isDicePool: true }` or similar social pool type.
> Note: Industrious is conditional — "when worn within the appropriate corp."

### R&G Fashion Armor — Social Limit (+1 Social Limit)

| Item                                            | Source | Wireless Bonus                                                |
| ----------------------------------------------- | ------ | ------------------------------------------------------------- |
| Vashon Island, Steampunk                        | R&G    | Increase Social Limit by 1                                    |
| Vashon Island, Synergist Business Line          | R&G    | Increase Social Limit by 1                                    |
| Vashon Island, Synergist Business Line Longcoat | R&G    | Increase Social Limit by 1                                    |
| Vashon Island, Sleeping Tiger                   | R&G    | Increase Social Limit by 1 + Ruthenium Polymer Coating effect |
| Executive Suite                                 | R&G    | Increase Social Limit by 2                                    |

> **Pattern:** `{ type: "limit", limit: "social", modifier: 1 }` (or 2 for Executive Suite)

### R&G Tactical Armor — Survival Pool

All share: **+1 dice pool bonus to Survival Tests** (conditional on Custom Protection terrain).

| Item                  | Source |
| --------------------- | ------ |
| Globetrotter Jacket   | R&G    |
| Globetrotter Vest     | R&G    |
| Globetrotter Clothing | R&G    |
| Wild Hunt             | R&G    |
| Big Game Hunter       | R&G    |

> **Pattern:** `{ type: "skill", skill: "survival", modifier: 1, condition: "custom_protection_terrain", isDicePool: true }`

### R&G Tactical Armor — Intimidation Limit

| Item               | Source | Wireless Bonus                                    |
| ------------------ | ------ | ------------------------------------------------- |
| Riot Control Armor | R&G    | Increase Social Limit by 2 for Intimidation Tests |
| SWAT Armor         | R&G    | Increase Social Limit by 3 for Intimidation Tests |

> **Pattern:** `{ type: "special", modifier: 0, description: "..." }` — conditional limit bonuses need custom handling.

### Other Armor

| Item                  | Source | Wireless Bonus                                                      |
| --------------------- | ------ | ------------------------------------------------------------------- |
| Nightshade/Moonsilver | R&G    | Illuminating (+1,500¥ for IR and contacts)                          |
| Bunker Gear           | R&G    | +1 dice pool bonus to Social Tests to calm/pacify at emergency site |

---

## Armor Modifications (`SR5_Armor_Mod.md`)

| Item                          | Source | Wireless Bonus                                                                   |
| ----------------------------- | ------ | -------------------------------------------------------------------------------- |
| Chemical Seal                 | Core   | Activating the chemical seal is a Free Action                                    |
| Shock Frills                  | Core   | Activating/deactivating is a Free Action; recharges by induction (1 charge/hour) |
| Thermal Damping               | Core   | Rating as dice pool bonus to Sneaking tests against heat-based detection         |
| Auto-Injector                 | R&G    | Activating a drug injection is a Free Action                                     |
| Fresnel Fabric                | R&G    | Reduce the Noise penalty by 1 more                                               |
| Pulse Weave                   | R&G    | Increase Attack Test penalties by 1                                              |
| Shock Weave                   | R&G    | The Block Test only needs to generate 1 hit                                      |
| Response Interface Gear (RIG) | R&G    | +1 Mental Limit on Perception Tests                                              |

> **Patterns:** Mix of Free Action upgrades, dice pool bonuses, and special effects.

---

## Environmental Armor (`SR5_Environmental_Armor.md`)

| Item                            | Source | Wireless Bonus                                                    |
| ------------------------------- | ------ | ----------------------------------------------------------------- |
| Ghillie Suit                    | R&G    | None (flavor text only)                                           |
| Ares Armored Survivalist        | R&G    | +1 on all Survival Tests in appropriate Custom Protection terrain |
| Desert Suit                     | R&G    | +1 on all Survival Tests in hot terrain                           |
| Coldsuit                        | R&G    | +1 on all Survival Tests in cold terrain                          |
| Polar Survival Suit             | R&G    | Increase Physical Limit by 1 for Climbing Tests                   |
| Ares Arctic Forces Suit         | R&G    | Increase Physical Limit by 1 for Climbing Tests                   |
| Ares Armored Coldsuit           | R&G    | Fatigue dice pool penalty decreases to -1                         |
| Enclosed Breathing Helmet       | R&G    | Transmits environmental information                               |
| Full Face Mask                  | R&G    | Transmits environmental information                               |
| Drysuit                         | R&G    | Transmits environmental information                               |
| Diving Armor                    | R&G    | Transmits environmental info; Swimming Test penalty reduced to -1 |
| Arctic Diving Suit              | R&G    | Extend warm diver time to 1 hour                                  |
| Evo HEL Suit                    | R&G    | Records and transmits environmental information                   |
| Spacesuit                       | R&G    | Records and transmits environmental information                   |
| Security Spacesuit              | R&G    | Records and transmits environmental information                   |
| Evo Armadillo Armored Spacesuit | R&G    | Records and transmits environmental information                   |
| Survival Bubble                 | R&G    | Homing beacon transmits supply levels to rescue personnel         |
| MCT EE Suit                     | R&G    | Records and transmits environmental information                   |

> **Patterns:** Mostly informational/flavor. Mechanical bonuses are Survival pool (+1) or Physical Limit (+1 Climbing).

---

## Firearm Accessories (`SR5_Firearm_Accessories.md`)

| Item                       | Source | Wireless Bonus                                                                                         |
| -------------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| Airburst Link              | Core   | Detonate grenade/rocket remotely (required for function)                                               |
| Bipod                      | Core   | Folding/deploying is a Free Action                                                                     |
| Concealable Holster        | Core   | Additional -1 to item's Concealability                                                                 |
| Gyro Mount                 | Core   | Quick-release exit is a Free Action                                                                    |
| Hidden Arm Slide           | Core   | Ready weapon is a Free Action                                                                          |
| Imaging Scope              | Core   | Share scope's "line of sight" with team                                                                |
| Laser Sight                | Core   | +1 dice pool bonus to attack tests (not cumulative with smartlink); activate/deactivate is Free Action |
| Periscope                  | Core   | Shooting around corners penalty reduced to -1                                                          |
| Silencer/Suppressor        | Core   | Rating 2 mic with Select Sound Filter alerts if nearby reaction detected                               |
| Smart Firing Platform      | Core   | Fire mounted weapon remotely like a drone; use smartlink in VR                                         |
| Smartgun System (External) | Core   | +1 (gear smartlink) or +2 (cyberware smartlink) dice pool; eject clip/change fire mode as Free Actions |
| Tripod                     | Core   | Folding/deploying/removing is a Free Action                                                            |
| Ammo Skip System           | R&G    | Switching between ammo types is a Free Action                                                          |

> **Patterns:** Heavy on Free Action upgrades. Smartgun is the key mechanical bonus (attack pool). Laser Sight is +1 attack pool (non-cumulative with smartlink).

---

## Melee Weapons

### Clubs (`SR5_Weapons_Clubs.md`)

| Item              | Source | Wireless Bonus                                      |
| ----------------- | ------ | --------------------------------------------------- |
| Extendable Baton  | Core   | Readying is a Free Action instead of Simple Action  |
| Stun Baton        | Core   | Recharges by induction (1 charge/hour)              |
| Telescoping Staff | Core   | Extending is a Free Action instead of Simple Action |

### Blades (`SR5_Weapons_Blades.md`)

| Item                | Source | Wireless Bonus                                      |
| ------------------- | ------ | --------------------------------------------------- |
| Forearm Snap-Blades | Core   | Readying is a Free Action instead of Simple Action  |
| Survival Knife      | Core   | Displays ARO of local maps, GPS position, commcalls |

### Misc Melee (`SR5_Weapons_Misc_Melee_Weapons.md`)

| Item         | Source | Wireless Bonus                         |
| ------------ | ------ | -------------------------------------- |
| Shock Gloves | Core   | Recharges by induction (1 charge/hour) |

### Exotic Melee (`SR5_Weapons_Exotic_Melee_Weapons.md`)

| Item               | Source | Wireless Bonus                                                   |
| ------------------ | ------ | ---------------------------------------------------------------- |
| Collapsible Scythe | R&G    | Collapsing/extending is a Simple Action                          |
| Monofilament Whip  | Core   | Ready as Free Action; auto-retract safety on glitch; Accuracy +2 |

> **Patterns:** Almost all melee wireless bonuses are action economy (Free Action readying) or induction recharging.

---

## Ranged Weapons

### Tasers (`SR5_Weapons_Taser.md`)

All tasers share: **A successful hit informs you of the target's basic health (and Condition Monitors).**

| Item                       | Source |
| -------------------------- | ------ |
| Cavalier Safeguard         | Core   |
| Defiance EX Shocker        | Core   |
| Tiffani-Defiance Protector | Core   |
| Yamaha Pulsar              | Core   |

### Hold-Out Pistols (`SR5_Weapons_Hold-Out_Pistol.md`)

| Item                     | Source | Wireless Bonus                    |
| ------------------------ | ------ | --------------------------------- |
| Fichetti Tiffani Needler | Core   | Change color with a Simple Action |

### Heavy Pistols (`SR5_Weapons_Heavy_Pistol.md`)

| Item       | Source | Wireless Bonus                            |
| ---------- | ------ | ----------------------------------------- |
| Lemat 2072 | R&G    | Switching fire mode becomes a Free Action |

### Exotic Firearms (`SR5_Weapons_Exotic_Firearms.md`)

| Item                   | Source | Wireless Bonus                                         |
| ---------------------- | ------ | ------------------------------------------------------ |
| Fichetti Pain Inducer  | Core   | Recharges by induction (1 charge/hour)                 |
| Parashield Dart Pistol | Core   | Dart reports hit/injection status and tissue anomalies |
| Parashield Dart Rifle  | Core   | Dart reports hit/injection status and tissue anomalies |
| Shiawase Arms Simoom   | R&G    | Firing is a Simple Action                              |

### Flamethrowers (`SR5_Weapons_Flamethrowers.md`)

| Item                    | Source | Wireless Bonus                                                           |
| ----------------------- | ------ | ------------------------------------------------------------------------ |
| Flamethrowers (general) | Core   | Ready Weapon is Simple Action (instead of Complex); Free Action with DNI |

### Launchers (`SR5_Weapons_Launchers.md`)

| Item                      | Source | Wireless Bonus                                         |
| ------------------------- | ------ | ------------------------------------------------------ |
| Ares Antioch-2            | Core   | Use wireless link trigger for grenades without DNI     |
| ArmTech MGL-12            | Core   | Use wireless link trigger for grenades without DNI     |
| Aztechnology Striker      | Core   | Use wireless link trigger for missiles without DNI     |
| Mitsubishi Yakusoku MRL   | Core   | Choose missile to launch via smartgun as Free Action   |
| Onotari Arms Ballista MML | R&G    | Accept orders wirelessly from other target designators |
| Onotari Interceptor       | R&G    | Use wireless link trigger for missiles without DNI     |

### Throwing Weapons (`SR5_Weapons_Throwing_Weapons.md`)

| Item                    | Source | Wireless Bonus                                                                 |
| ----------------------- | ------ | ------------------------------------------------------------------------------ |
| Horizon BoomerEye       | R&G    | Live-feed video while in flight                                                |
| Throwing Knife/Shuriken | Core   | +1 dice pool per knife thrown that Combat Turn at same target (with smartlink) |

### Ballistic Projectiles (`SR5_Weapons_Ballistic_Projectiles.md`)

| Item                | Source | Wireless Bonus                        |
| ------------------- | ------ | ------------------------------------- |
| Dynamic Tension Bow | R&G    | Changing Rating becomes a Free Action |

---

## Ammunition

### Grenades (`SR5_Ammo_Grenade.md`)

| Item           | Source | Wireless Bonus                                                                            |
| -------------- | ------ | ----------------------------------------------------------------------------------------- |
| Grenades (all) | Core   | Use wireless link trigger without DNI                                                     |
| Flash-Pak      | Core   | Avoids flashing subscribed character (half glare); recharges by induction (1 charge/hour) |

### Rockets & Missiles (`SR5_Ammo_Rocket.md`)

| Item                   | Source | Wireless Bonus                        |
| ---------------------- | ------ | ------------------------------------- |
| Rockets/Missiles (all) | Core   | Use wireless link trigger without DNI |

### Arrowheads (`SR5_Ammo_Arrowhead.md`)

| Item            | Source | Wireless Bonus                                                  |
| --------------- | ------ | --------------------------------------------------------------- |
| Incendiary Head | R&G    | Can detonate before impact, split between two targets within 1m |
| Screamer Head   | R&G    | Sound resetting is a Free Action, even while in flight          |
| Seeker Shafts   | R&G    | Locking onto a target is a Free Action                          |

---

## Cyberware — Head (`SR5_Cyberware_Head.md`)

| Item                  | Source | Wireless Bonus                                                                       |
| --------------------- | ------ | ------------------------------------------------------------------------------------ |
| Datajack              | Core   | Rating 1 noise reduction                                                             |
| Skilljack (R 1-6)     | Core   | Total Rating limit increases to Rating x 3                                           |
| Attention Coprocessor | R&G    | +1 dice pool bonus to all Perception tests (objects identified via central database) |

---

## Cyberware — Eyes (`SR5_Cyberware_Eye.md`)

| Item                                 | Source | Wireless Bonus                                                                                         |
| ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------ |
| Eye-light System                     | R&G    | Activating/deactivating is a Free Action instead of Simple Action                                      |
| Microscopic Lenses                   | R&G    | Switching lenses on/off is a Free Action instead of Simple Action                                      |
| Targeting Laser / IR Targeting Laser | R&G    | +1 dice pool bonus to attack tests (not cumulative with smartlink); activate/deactivate is Free Action |

---

## Cyberware — Body (`SR5_Cyberware_Body.md`)

| Item                       | Source | Wireless Bonus                                                                  |
| -------------------------- | ------ | ------------------------------------------------------------------------------- |
| Fingertip Compartment      | Core   | Inserting/removing item is a Simple Action                                      |
| Internal Air Tank (R 1-3)  | Core   | Activating/deactivating is a Free Action; always aware of air level/purity      |
| Reaction Enhancers (R 1-3) | Core   | Compatible with wireless wired reflexes; total Reaction bonus can exceed +4     |
| Skillwires (R 1-6)         | Core   | All skills used with it receive +1 to relevant inherent Limit                   |
| Smuggling Compartment      | Core   | Inserting/retrieving object is a Simple Action                                  |
| Wired Reflexes (R 1-3)     | Core   | Compatible with wireless reaction enhancers; total Reaction bonus can exceed +4 |

---

## Cyberware — Limb Accessories (`SR5_Cyberware_Limb_Accessories.md`)

| Item                        | Source | Wireless Bonus                                                 |
| --------------------------- | ------ | -------------------------------------------------------------- |
| Cyberarm Gyromount          | R&G    | Activating/deactivating is a Free Action                       |
| Cyber Holster               | R&G    | Readying a weapon is a Free Action                             |
| Hydraulic Jacks (R 1-6)     | R&G    | +1 dice pool bonus to jumping, sprinting, or lifting with legs |
| Large Smuggling Compartment | R&G    | Getting something out/putting something in is a Simple Action  |

---

## Security — Communications (`SR5_Security_Communications.md`)

| Item                          | Source | Wireless Bonus                                           |
| ----------------------------- | ------ | -------------------------------------------------------- |
| Bug Scanner (R 1-6)           | Core   | Substitute scanner's Rating for Electronic Warfare skill |
| Data Tap                      | Core   | Self-destruct as Free Action (severs connection)         |
| Jammer, Area (R 1-6)          | Core   | Designate devices/personas to not interfere with         |
| Jammer, Directional (R 1-6)   | Core   | Designate devices/personas to not interfere with         |
| Micro-Transceiver             | Core   | Range becomes worldwide                                  |
| Tag Eraser                    | Core   | Recharges fully in 1 hour by induction                   |
| White Noise Generator (R 1-6) | Core   | Effective radius is tripled                              |

---

## Security — B&E Gear (`SR5_Security_B_26E_Gear.md`)

| Item                    | Source | Wireless Bonus                                                                       |
| ----------------------- | ------ | ------------------------------------------------------------------------------------ |
| Autopicker (R 1-6)      | Core   | Rating as dice pool modifier to mechanical lock picking; can replace Locksmith skill |
| Maglock Passkey (R 1-4) | Core   | +1 bonus to Rating                                                                   |
| Sequencer (R 1-6)       | Core   | +1 bonus to Rating                                                                   |

---

## Bioware

> **All bioware explicitly has no wireless capability at all** (SR5 CRB, p.459).

---

## Observed Patterns

### Common Wireless Effect Categories

1. **Free Action upgrades** (~40% of items) — Action that normally costs Simple/Complex becomes Free Action
2. **Dice pool bonuses** (~20%) — +1 or +2 to specific test types
3. **Induction recharging** (~8%) — Recharges 1 charge per hour wirelessly
4. **Informational/telemetry** (~15%) — Shares data, transmits status, displays ARO
5. **Limit bonuses** (~5%) — +1 to Social/Physical/Mental Limit
6. **Rating substitution** (~3%) — Use device Rating in place of skill
7. **Special/unique** (~9%) — Complex effects requiring custom handling

### Structurable Effects (candidates for `wirelessEffects` arrays)

These have clear mechanical bonuses that can be expressed as structured `WirelessEffect` objects:

| Pattern                          | Effect Type        | Items                                  |
| -------------------------------- | ------------------ | -------------------------------------- |
| +N dice pool to Social Tests     | `skill` (social)   | ~19 fashion armor items                |
| +N Social Limit                  | `limit` (social)   | Steampunk, Synergist, Executive Suite  |
| +N dice pool to Survival Tests   | `skill` (survival) | Globetrotter series, Big Game Hunter   |
| +N dice pool to Sneaking Tests   | `skill` (sneaking) | Chameleon Suit, Thermal Damping        |
| +N dice pool to Perception Tests | `perception`       | Attention Coprocessor                  |
| +N dice pool to attack tests     | `attack_pool`      | Smartgun, Laser Sight, Targeting Laser |
| +N noise reduction               | `noise_reduction`  | Datajack, Fresnel Fabric               |
| +N to Limit (Physical/Mental)    | `limit`            | Polar Survival Suit, RIG, Skillwires   |
| Stacking compatibility           | `special`          | Wired Reflexes + Reaction Enhancers    |

### Non-Structurable Effects (remain as text-only `wirelessBonus`)

These are too situational or complex for the current type system:

- Free Action upgrades (need action economy system)
- Induction recharging (need charge tracking system)
- Informational/telemetry (flavor only, no mechanical effect)
- Conditional bonuses tied to specific gear interactions (e.g., throwing knives + smartlink)

---

## Summary Counts

| Category                     | File                                | Items with Wireless |
| ---------------------------- | ----------------------------------- | :-----------------: |
| Armor & Clothing             | `SR5_Armor_Clothing.md`             |         37          |
| Armor Modifications          | `SR5_Armor_Mod.md`                  |          8          |
| Environmental Armor          | `SR5_Environmental_Armor.md`        |         18          |
| Firearm Accessories          | `SR5_Firearm_Accessories.md`        |         13          |
| Melee Weapons                | Clubs/Blades/Misc/Exotic            |          8          |
| Ranged Weapons               | Tasers/Pistols/Exotic/etc.          |         13          |
| Ammunition                   | Grenades/Rockets/Arrows             |          6          |
| Cyberware — Head             | `SR5_Cyberware_Head.md`             |          3          |
| Cyberware — Eyes             | `SR5_Cyberware_Eye.md`              |          3          |
| Cyberware — Body             | `SR5_Cyberware_Body.md`             |          6          |
| Cyberware — Limb Accessories | `SR5_Cyberware_Limb_Accessories.md` |          4          |
| Security — Communications    | `SR5_Security_Communications.md`    |          7          |
| Security — B&E Gear          | `SR5_Security_B_26E_Gear.md`        |          3          |
| Bioware                      | All bioware files                   |          0          |
| **Total**                    |                                     |      **~129**       |
