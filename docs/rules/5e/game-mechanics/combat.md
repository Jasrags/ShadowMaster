# Shadowrun Fifth Edition Combat Specification

## Purpose

Define how ShadowMaster represents and automates Shadowrun 5e combat, focusing on consistent turn handling, attack resolution, modifiers, and subsystem hooks (magic, matrix, rigging).

## Glossary

### Combat Turn
A three-second chunk of time where players act in order of their initiative. A Combat Turn is composed of a series of Initiative Passes.

### Initiative Pass
Chunks of a Combat Turn. Characters get one Action Phase per Combat Turn. Typically, all characters are guaranteed an Action Phase on the first Initiative Pass, but subsequent passes will depend on how high their Initiative is.

### Action Phase
When a character acts during an Initiative Pass.
- On an Action Phase, you can perform either one (1) Complex Action or two (2) Simple Actions.
- Additionally, you may always take one Free Action per Action Phase.
- If you do not use your Free Action, you may use it at any point until your next Action Phase, even if it's during another character's Action Phase.

## Turn Structure & Initiative

### Initiative System

#### Initiative Attribute
This is a derived value that depends on summing two other Attributes, depending on the Initiative Type:

| Initiative Type | Formula |
|----------------|---------|
| Physical | `Reaction + Intuition` |
| Rigging AR | `Reaction + Intuition` |
| Matrix AR | `Reaction + Intuition` |
| Astral | `Intuition × 2` |
| Matrix (cold-sim) VR | `Data Processing + Intuition` |
| Matrix (hot-sim) VR | `Data Processing + Intuition` |

**Example**: If it's Physical Initiative and your Reaction is 3 and your Intuition is 4, your Initiative Attribute is 7.

#### Initiative Dice
Each Initiative Type has a Base Initiative Dice. Certain upgrades (such as Wired Reflexes) can give you more dice to roll, but it's not improvable with Karma.

**Base Dice by Initiative Type**:

| Initiative Type | Base Dice |
|----------------|-----------|
| Physical | 1d6 |
| Rigging AR | 1d6 |
| Matrix AR | 1d6 |
| Astral | 2d6 |
| Matrix (cold-sim) VR | 3d6 |
| Matrix (hot-sim) VR | 4d6 |

**Edge Usage**: Edge can be used to give yourself the maximum 5d6 dice for a single Combat Turn.
- *(House Rule Note)*: Some groups limit Edge to +2d6 dice (still limited to 5d6 total)

#### Initiative Score
This is the sum of your Initiative Attribute and a **roll** of your Initiative Dice.

**Example**: Astral Initiative is `(Intuition × 2) + 2d6`
- If you had 5 Intuition and rolled a 3 and a 6, your Initiative Score would be `(5 × 2 + 3 + 6) = 19`

#### Tie Resolution
When Initiative Scores are tied, resolve in this order:
1. **Edge** (highest Edge acts first)
2. **Reaction** (highest Reaction acts first)
3. **Intuition** (highest Intuition acts first)
4. **Coin Toss** (random determination)

### Combat Turn Sequence

1. **Roll Initiative**: `Initiative Attribute + Initiative Dice`. Apply wound modifiers immediately.
2. **Determine Order**: Highest score acts first; simultaneous ties resolved by Edge → Reaction → Intuition → coin toss.
3. **Action Phases**: Each character takes an Action Phase (declare movement, actions, resolve tests).
4. **Next Pass**: After all have acted, subtract 10 from remaining Initiative Scores; continue passes while score > 0.
5. **New Turn**: Begin new Combat Turn and repeat.

### Initiative Modifications

- **Changing Initiative mid-turn**: Adjust score immediately for attribute changes; reroll added dice when Initiative Dice increase; subtract roll when dice decrease.
- **Damage effects**: Damage applies wound modifiers to Initiative instantly.
- **Edge options**: 
  - **Seize the Initiative**: Act first for the turn
  - **Blitz**: Roll 5d6 once per Edge spend

## Action Economy

- Per Action Phase: 1 Free + (2 Simple) or (1 Complex). Interrupts allowed outside turn at cost to Initiative.
- Free examples: run (declare running state), drop prone, call shot, change smartlink mode, speak, eject clip.
- Simple examples: fire SS/SA/BF/FA (short burst), ready weapon, take aim, reload (mag feed), throw weapon, observe in detail, command/dismiss spirit, Quick Draw test.
- Complex examples: full-auto (10 rounds), cast spell, summon/banish, melee attack, sprint (with Running test), rigger jump-in, long/semi-auto burst, use skill with significant focus.
- Interrupt examples (Initiative cost): Block/Dodge/Parry/Hit the Dirt/Intercept (–5), Full Defense (–10, adds Willpower to defense for turn).
- Multiple Attacks: split final dice pool (after modifiers). Max attacks = half combat skill. Apply recoil/damage once per attack resolved separately.

## Movement

- Vehicle-like declaration: characters choose Walk/Run (per metatype) for entire turn; exceeding Walk = running (–2 dice penalty, +4 bonus when charging into melee).
- Sprint (Complex): `Running + STR [Physical]`; hits add +2 m (metahumans) or +1 m (dwarfs/trolls) to Run in turn; fatigue applied for repeated use.
- Movement penalties: running attackers suffer –2 to ranged actions; targets gain +2 defense if running, +4 if sprinting.

## Surprise & Delays

- Surprise Test: `REA + INT (3)`; alert bonus +3. Failure → lose 10 Initiative, no actions/defense vs non-surprised until next Action Phase. Edge may negate.
- Ambushers gain +6; still test if unaware of exact timing.
- Delay: declare in Action Phase; may intervene later with –1 attack modifier, preserving Initiative score (still subtract 10 at pass end).

## Ranged Combat

- Attack test: `Weapon Skill + AGI [Accuracy]` ± modifiers.
- Defense test: `REA + INT` ± modifiers (Full Defense/Interrupt options apply). For melee-range shooting defender –3.
- Net hits add to DV. Apply AP to armor; if modified DV <= modified Armor, damage becomes Stun (unless otherwise stated).
- Called shots (–4 + Free Action): options include vitals (+2 DV), knockdown, disarm, split damage, trick shot, shake up (–5 Initiative), etc.
- Recoil: cumulative per Combat Turn; base compensation = 1 (first shot) + `ceil(STR/3)` + weapon RC + augment. Apply to total bullets fired before pool split.
- Firing modes & defense modifiers:
  - SS/SA: 0; 1 round.
  - SA burst/BF: –2 defense; 3 rounds.
  - Long burst/FA (Simple): –5 defense; 6 rounds.
  - FA (Complex): –9 defense; 10 rounds.
  - Suppressive: 20 rounds, forces Reaction + Edge (threshold = attacker hits) or hit (DV weapon base). Provides –hits penalty within lane.
- Environmental modifiers: use table (visibility, light, wind, range). Compensation via smartlink, thermo/low-light, ultrasound, image mag, tracers.
- Ammo & Reloading: table for action type (most complex). Smartgun eject clip (Free); insert clip (Simple); internal/belt/drum reload (Complex).
- Grenades/thrown: `Throwing + AGI [Physical] (3)`; scatter = weapon dice – hits; triggers include timer (next CT same Init–10), motion (explode on impact), wireless (detonate via DNI). Area DV reduces with distance per grenade data.
- Shotgun choke: narrow (–1 defense), medium (–3 & DV penalties; multiple targets), wide (–5; larger spread).

## Melee Combat

- Attack: `Close Combat Skill + AGI [Accuracy]` (include Reach, charging, off-hand penalties). Net hits add DV.
- Defense: `REA + INT` plus optional Block/Parry/Dodge (adds skill, costs –5 initiative). Reach difference modifies defender dice (attacker longer = –Reach, defender longer = +Reach).
- Called shot knockdown: compare `STR + net hits` vs target Physical limit; success knocks prone without damage.
- Subduing: attacker grapples if `STR + net hits > Physical limit`. Defender must use Complex `Unarmed + STR [Physical] (attacker net hits)` to escape. Grappler actions each Complex action (increase grip, deal STR Stun, knockdown).
- Friends in melee: +1 or use teamwork. Opponent prone +1 to hit; attacker prone –1.

## Defense & Damage

- Defense modifiers include wounds, running, prone, cover (partial +2, good +4), area attacks (–2), full-auto modes (above), multiple defenses in same CT (–1 cumulative), receiving charge (+1), inside moving vehicle (+3).
- Grazing hits on tie: no DV but contact occurs (apply contact effects).
- Condition monitors: Physical = `8 + ceil(BOD/2)`, Stun = `8 + ceil(WIL/2)`. Wound modifiers: –1 per 3 boxes to all tests incl. Initiative.
- Armor penetration: AP modifies armor rating; if modified DV ≤ modified armor, convert to Stun; otherwise Physical. Armor encumbrance: sum Ballistic+Impact exceeding `STR×2` imposes penalties.
- Knockdown: if post-resistance DV > Physical limit (or ≥10), target falls prone. Gel rounds reduce limit by 2 for knockdown checks.
- Special damage (acid, cold, electricity, fire, blast) apply secondary effects, armor adjustments, and ongoing DV per SR5 tables.

## Barriers

- Barrier stats: Structure & Armor (see Barrier Table). Attack to destroy: roll unopposed test; compare DV vs Armor; apply Structure + Armor resistance. Breakthrough when total damage ≥ Structure (creates 1 m² hole per Structure multiple). Penetration weapons transfer damage beyond 1–4 boxes to target (depending on rounds fired).
- Shooting through cover: defender gains cover bonus; if attack penetrates barrier, apply remaining DV to target. Body barriers use Body instead of Structure.

## Vehicles & Drones

- Vehicle stats: Handling (limit), Speed (limit), Acceleration (range change capacity), Body, Armor, Pilot, Sensor, Seats. Condition monitor: `12 + ceil(BOD/2)` (vehicles), `6 + ceil(BOD/2)` (drones). Vehicles ignore Stun; Electricity inflicts Physical.
- Vehicle tests: `Vehicle Skill + REA [Handling]` (threshold from Vehicle Test Table; modify by terrain). AR adds +1 limit; VR +2 limit. Control rig in jumped-in: reduce threshold by rig rating; use mental attributes of rigger.
- In tactical combat: driver must take Complex "Control Vehicle" each CT or vehicle becomes uncontrolled (–2 dice to occupants, potential crash). Passengers suffer –2 to actions; can attack with –2 for firing from moving vehicle.
- Vehicle defense: `REA + INT` (driver) or `Pilot + Autosoft [Handling]` (drone). Evasive driving (Interrupt –10) adds Willpower to defense for CT.
- Ramming (Short range): opposed Vehicle test; DV = Body + net hits (half to ramming vehicle). After collision, Vehicle Test (threshold 2/3) to avoid going uncontrolled.
- Chase combat: track Chase Range (environment-specific). Actions: Catch-up/Break Away (move per Acceleration), Cut-off (force crash test), Ram, Stunt (force pursuer tests). Passengers act with standard actions plus –2 for unstable platform.
- Vehicle damage: resist with `BOD + Armor`. If modified DV < modified Armor, no effect. Crashes: everyone resists Body damage with `BOD + Armor –6 AP`; vehicles resist half. Apply Composure (4) to avoid shock penalties.

## Healing & Recovery

- First Aid: `First Aid + LOG [Mental] (2)` within 1 hour; heals up to skill rating boxes (divide by 2 if armored); glitch adds 1D3 damage. Each attempt once per wound set; cannot use after magical healing.
- Medicine: `Medicine + LOG [Mental]`; each hit adds +1 die to subsequent natural healing tests (10 min/hour for Stun, 30 min/day for Physical); one attempt per wound set.
- Natural recovery: Stun → `BOD + WIL (1 hour)`, Physical → `BOD×2 (1 day)`; heal 1 box per hit; must heal Stun before Physical. Glitch doubles interval; critical glitch adds 1D3 damage.
- Medkits/autodocs: wireless rating adds dice; untrained can roll `LOG –1 + device rating`; unattended device rolls `rating×2` each interval.
- Magical healing: Heal spell (Force limit). Cannot heal Drain or after natural/magical healing conflict rules.
- Overflow: when Physical track exceeded; each `(Body)` minutes adds 1 damage until stabilized; death at overflow > Body. Stabilize via First Aid/Medicine `(3)` or Stabilize spell.

## Integration Notes

- Provide modular modifier calculators (environment, recoil, cover) for reuse across systems.
- Weapon/armor tables supply DV/AP/modes, reload types, capacity, and accessory slots.
- Condition monitor UI must handle knockdown, prone state, running flag, multiple defenses penalty.
- Support autopilot/Pilot behavior for drones/vehicles with shared APIs for matrix/rigging subsystems.
- Healing workflows should track per-wound-set attempts (First Aid, Medicine, magic) and enforce timing limits.

## Open Questions & Data Gaps

- Need machine-readable modifier tables (environmental, firing modes, melee/ranged adjustments, barrier stats).
- Populate ammo, grenade, elemental damage reference tables for automation.
- Vehicle catalog requires detailed stats (Handling, Speed, Accel, Pilot, Sensor, seats, mod slots).
- Healing section should cross-reference lifestyle/medical costs and advanced treatment (docwagon, hospitals).
- Matrix action table (combat-relevant) still TODO for quick reference.

## Reference

- SR5 Core Rulebook (pp. 159-160 for Initiative)
- [Hardcore Game Mode: SR5 Combat Rules Summary](https://hardcoregamemode.blogspot.com/2014/07/shadowrun-5th-edition-combat-rules.html)

*Last updated: 2025-01-XX*

