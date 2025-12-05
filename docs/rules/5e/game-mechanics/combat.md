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
- Special damage (acid, cold, electricity, fire, blast) apply secondary effects, armor adjustments, and ongoing DV per SR5 tables. See Elemental Damage section below for details.

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

## Called Shots

Called shots allow characters to target specific locations or perform special maneuvers. Most called shots require a Free Action to declare and impose a dice pool modifier. See the Called Shots table below for details.

**General Called Shots**

| ACTION | DICE POOL MODIFIER | EFFECTS |
| --- | --- | --- |
| Blast Out Of Hand | -4 | No Damage; Knocks Weapon From Hand |
| Dirty Trick | -4 | No Damage; Penalty On Next Action |
| Shake Up | -4 | Does Damage; Decreases Target Initiative |
| Splitting Damage | -4 | Evenly Divide Damage Between Target's Stun & Physical Condition Monitors |
| Trick Shot | -4 | Net Hits Added To Intimidation Test dice pool |

**Close Combat Only Called Shots**

| ACTION | DICE POOL MODIFIER | EFFECTS |
| --- | --- | --- |
| Break Weapon | -4 | Break Weapon As Barrier |
| Feint | -4 | No Damage; On next attack, -net hits to target Defense Test |
| Knock Down | -4 | No Damage; Target Knocked Prone |

**Unarmed Combat Only Called Shots**

| ACTION | DICE POOL MODIFIER | EFFECTS |
| --- | --- | --- |
| Disarm | -4 | Take Weapon If STR + net hits > Target Physical Limit |
| Reversal | -4 | Gain Superior Position |

**Specific Target Called Shots (Living)**

| ACTION | DICE POOL MODIFIER | DV LIMIT | EFFECTS |
| --- | --- | --- | --- |
| Ankle | -8 | 1 | Slowed, Winded |
| Ear | -10 | 1 | Deafened, Stunned |
| Eye | -10 | 1 | Blinded, Stunned |
| Foot | -8 | 1 | Stunned, Slowed, Winded |
| Forearm | -6 | 2 | Broken Grip, Weak Side |
| Genitals | -10 | 4 | Stunned, Nauseous, Buckled |
| Gut | -6 | 8 | Stunned, Nauseous, Slow Death |
| Hand | -8 | 1 | Stunned, Broken Grip, Weak Side |
| Hip | -6 | 3 | Knockdown, Slowed |
| Jaw | -8 | 2 | Stunned, Unable To Speak |
| Knee | -8 | 1 | Stunned, Slowed, Winded |
| Neck | -8 | 10 | Stunned, Bleedout |
| Shin | -6 | 2 | Knockdown, Slowed, Winded |
| Shoulder / Upper Arm | -6 | 3 | Stunned, One-Arm Bandit, Weak Side |
| Sternum | -10 | 10 | Stunned, Fatigued, Winded |
| Thigh | -6 | 3 | Slowed, Winded |

**Specific Target Called Shots (Vehicle)**

| ACTION | DICE POOL MODIFIER | DV LIMIT | EFFECTS |
| --- | --- | --- | --- |
| Engine Block | -4 | None | Disables Vehicle |
| Fuel Tank / Battery | -6 | None | Disables Vehicle. Causes Fuel Leak Or Battery Leak |
| Axle | -6 | 6 | Reduces Speed To 1 |
| Antenna | -8 | 2 | Disables Communications & Wireless Capability |
| Door Lock | -6 | 0 | Door Cannot Be Opened |
| Window Motor | -4 | 0 | Window Cannot Be Opened |

## Elemental Damage

Elemental damage comes from non-kinetic sources like acid, fire, electricity, etc. Most elemental damage has special rules beyond normal Physical or Stun damage.

### Acid Damage

Acid damage is **Physical**. In addition to its normal damage, it also **reduces the rating of any Armor it hits by 1**. If the acid isn't removed from the target (by washing it off, or because the acid is from a spell and evaporates into mana after the spell ends), then the acid continues to burn. **Each Combat Turn the base DV of the acid is decreased by 1 and damage is applied again**. The acid also continues to burn through armor reducing the target's Armor rating by 1 until the acid is removed, neutralized, or loses all its base DV. The Armor reduction should be applied to worn Armor first but could be applied to Armor accessories (+Armor items) if the gamemaster allows.

At the gamemaster's discretion, acid **can also create Light Smoke conditions** in an area around the target.

### Cold Damage

Cold damage is **Physical**. Additionally, cold damage can make armor brittle, liquids freeze, lubricants gum up, etc. Make a simple **Armor Test for anything directly hit. If the armor gets no hits, it breaks and cannot be used as armor**. It can be repaired with the Armorer skill. In the case of a glitch, it's destroyed irreparably. With a critical glitch the armor breaks irreparably in a dangerous way.

### Electricity Damage

Electrical damage is treated as **Stun or Physical damage depending on the source and/or target**. The **Non-conductivity armor upgrade** adds its full rating to the Armor value. The gamemaster can also decide which (if any) other factors may modify the target's damage, such as extra conductivity for a character covered in water.

An Electricity attack that does damage can stun and incapacitate the target as well, though if there is no damage, there is no secondary effect at all. Secondary effects for characters injured by Electricity damage include a **–1 dice pool penalty on all actions and Defense Tests, but not Damage Resistance Tests, for 1 Combat Turn and an immediate Initiative Score reduction of 5.** The dice pool penalty and Initiative Score reduction do not accumulate with multiple attacks, but the **length of the penalty is extended by 1 Combat Turn** for each successful damaging attack while a character is affected. If the character's Initiative Score is reduced to 0 or below, they lose their last action. If they have no Initiative Score left the reduction comes on the start of the next Combat Turn.

Electronic equipment and drones can also be affected by Electricity damage. They never suffer Stun damage so Electricity damage is Physical when used against electronics and drones. They resist damage as usual and suffer a secondary effect if they take even a single box of damage. The secondary effect for electronics and drones damaged by Electricity damage is shorting out or overloading. In game terms this is reflected as secondary Matrix damage equal to half the Physical damage rounded down.

Vehicles can be damaged by Electricity attacks but do not suffer any secondary effects. Specific systems of vehicles can be targeted by a Called Shots.

### Fire Damage

**Fire Armor Penetration**

| TYPE OF FIRE | AP |
| --- | --- |
| Open Flame | –2 |
| Fire-based spells | –spell Force |
| Flame-based weapon | –6 |

Fire damage is **Physical**. It can also make things catch fire. To determine if something catches fire, **roll Armor Value + Fire Resistance – Fire AP (see Fire Armor Piercing Ratings table)**. The threshold on this test is the net hits rolled on the fire-based attack. If the item succeeds, it is not on fire (for now). Armor accessories are excluded from the test but the gamemaster may require them to make their own test.

When something catches fire, the fire has an **initial Damage Value of 3**. This damage is caused **at the end of each Combat Turn**, and the **DV increases by 1 at the start of each subsequent Combat Turn** until the item is completely destroyed or the fire is put out. You can fight the fire a number of ways (water, smothering, etc.), making an **Agility + Intuition Test and reducing the fire's DV by 1 for each hit**. Remember, as long as the fire is burning it can ignite any nearby flammables, including furniture, vehicles, foliage, and elves.

### Other Elemental Damage Types

**Pollutant Damage**: Treat any Pollutant attack as a toxin with the following characteristics:
- Vector: Inhalation
- Speed: Immediate
- Penetration: 0
- Power: (DV of attack)
- Effect: Physical damage, Anaphylactic Shock
- Armor provides no dice to resist a Pollutant attack. Armor upgraded with a Chemical seal provides immunity to the damage and toxic effects.

**Radiation Damage**: Radiation attacks cause **Physical damage**. Armor provides no dice to resist Radiation damage, unless it has an upgrade to provide Radiation resistance, which provides dice equal to its rating for the Damage Resistance Test and the following Toxin Resistance Test. Treat every Radiation attack that hits as a **toxin causing** with a **DV equal to net hits of the attack** (before the Damage Resistance roll).

**Water Damage**: Water damage does not directly affect any Condition Monitors; instead, it has a chance to knock characters down. The base Water damage for knockdown purposes is the Force of the spell. The targeted character **rolls Agility, reducing the Water damage** by the number of hits. If the remaining **damage is higher than the character's Physical limit, the Water damage knocks them down**, as if they had been forcibly taken a free **Drop Prone action**. Additionally, the area around the target with a **radius of (Force / 2) meters is slippery for the next ten minutes**. Any action involving movement in this area, including Defense Tests, take a **–2 dice pool penalty.** Active fires in that same area have their DV reduced by the spell's Force. Also, any exposed and unsealed electronics may be damaged. For any such devices, make a **Device Rating (3) Test**; failure means water hit the sensitive innards of the device and causes damage.

### Falling Damage

When a character falls more than three meters, he takes **Physical damage with a DV equal to the number of meters fallen, with an AP of –4**. Use **Body + Armor to resist this damage**. The gamemaster should feel free to modify the damage to reflect a softer landing surface (sand), branches to break the fall, and so on.

Falling characters drop 50 meters in the first Combat Turn, 150 meters in the second Combat Turn, and 200 meters every Combat Turn after that. Terminal velocity for a falling body is about 200 meters per turn.

### Fatigue Damage

Fatigue damage is **Stun damage** you incur through doing something strenuous or for being in the middle of something stressful. It's caused by harsh environments, hard exertion, and drek like that. Fatigue damage is resisted with **Body + Willpower, not with any armor**. Fatigue damage **cannot be healed while the condition causing it still exists**.

**Fatigue From Running**: If you **sprint over multiple consecutive Combat Turns or during multiple Action Phases in the same Combat Turn**, you risk taking fatigue damage. For every consecutive Action Phase or Combat Turn in which you use the Sprint action, you **take a cumulative 1S DV of fatigue damage**, which means that the second time you take it without dialing it back you take 2S, then 3S, etc. If you're **only running** (using your running movement rate) instead of sprinting, this **damage is taken every 3 minutes**.

**Fatigue From Environments**: Hot, cold, humid, dry, polluted, or irradiated environments can cause fatigue damage, depending on the severity of the surroundings. As with running fatigue, the **DV from a harsh environment starts at 1S and increases over time**. Unlike running fatigue, if you keel over in a hostile environment the damage doesn't stop rolling in.

| SEVERITY | INTERVAL |
| --- | --- |
| Mild | 6 hours |
| Moderate | 3 hours |
| Harsh | 60 minutes |
| Extreme | 1 minute (10 Combat Turns) |
| Deadly | 6 seconds (2 Combat Turns) |

**Hunger, Thirst, And Sleep Deprivation**: **After 24 hours, if you haven't eaten, slept, or had a (nonalcoholic) drink**, you risk fatigue damage. Like running, the **damage starts at a mere 1S and increases over each interval it is taken**. The interval for **hunger is 6 days, for thirst is 2 days, and for sleep is 3 hours**. This damage stops when you eat, drink, or sleep, respectively.

## Combat Modifiers

### Environmental Modifiers

| VISIBILITY | LIGHT / GLARE | WIND | RANGE | MODIFIER |
| --- | --- | --- | --- | --- |
| Clear | Full Light / No Glare | None / Light Breeze | Short | 0 |
| Light Rain / Fog / Smoke | Partial Light / Weak Glare | Light Winds / Light Breeze | Medium | -1 |
| Moderate Rain / Fog / Smoke | Dim Light / Moderate Glare | Moderate Winds / Light Breeze | Long | -3 |
| Heavy Rain / Fog / Smoke | Total Darkness/ Blinding Glare | Strong Winds / Light Breeze | Extreme | -6 |
| Combination of two or more conditions at the -6 level row |  |  |  | -10 |

### Situational Modifiers

| SITUATION | ATTACKER'S MODIFIER |
| --- | --- |
| Attacker Firing From Cover With Imaging Device | -3 |
| Attacker Firing From A Moving Vehicle | -2 |
| Attacker In Melee Combat | -3 |
| Attacker Running | -2 |
| Attacker Using Off-Hand Weapon | -2 |
| Attacker Wounded | -Wound Modifier |
| Blind Fire | -6 |
| Called Shot | Varies |
| Previously Aimed With Take Aim | +1 Dice Pool, +1 Accuracy |
| Wireless Smartgun | +1 (Gear) / +2 (Implanted) |

## Weapon Firing Modes

| MODE | ATTACK | ACTION | DEFENSE MODIFIER | ROUNDS USED | NOTES |
| --- | --- | --- | --- | --- | --- |
| Single-Shot (SS) | Single Shot | Simple | 0 | 1 | No Recoil |
| Semi-Automatic (SA) | Single Shot | Simple | 0 | 1 |  |
| Semi-Automatic (SA) | Semi-Automatic Burst (SB) | Complex | -2 | 3 |  |
| Burst-Fire (BF) | Burst Fire (SB) | Simple | -2 | 3 |  |
| Burst-Fire (BF) | Long Burst (LB) | Complex | -5 | 6 |  |
| Full-Auto (FA) | Full Auto | Simple | -5 | 6 |  |
| Full-Auto (FA) | Full Auto | Complex | -9 | 10 |  |

## Armor Features

### Social Limit Modifiers

The value and status of simply wearing certain outfits help characters impress those around them, while on the other hand wearing camo fatigues at a social gathering isn't the social standard. Some pieces of armor raise the Social Limit of the wearer. These modifiers do not stack; only the highest modifier of any visible clothing item counts (and "visible" means seeing enough of it that viewers get a solid impression of what the garment does on the wearer).

### Lightly Worn

The Lightly Worn option provides runners with a chance to buy some primo gear at a discount rate, with a few catches. Buying from the Lightly Worn section requires the character to have Armand as a contact with a Loyalty of at least 2. When gear is purchased Lightly Worn, the character gets a price discount of 25 percent, but they only get the Armor rating; they do not get any of the Features of the armor.

The Lightly Worn feature can be bought off by having the piece of Armor refit. This requires an Armorer + Logic [Mental] (10, 1 hour) Extended Test and costs 10 percent of the original armor cost for each Feature the character is trying to have restored.

### Custom Fit

Items that are Custom Fit were measured for a specific person. They are specially designed for that person and don't fit well on anyone else, therefore conferring none of the positive Social Limit adjustments to the character. When an item is Custom Fit, any changes to an individual's Physical Attributes, whether through Karma advancement or augmentation (but not through magic), require the suit to be refit. The refit process requires an Armorer shop and an Armorer + Logic [Mental] (10, 1 hour) Extended Test. The owner can also use their Contacts to help them get the job done, requiring loss of the armor for one week and a payment of 25 percent of the initial armor cost.

### Custom Fit (stack)

This characteristic employs all the Custom Fit rules, but in addition these items can stack with other pieces that have been Custom Fit by the same maker, for the same person. The character has to select a specific set of Armored Clothing to have the piece Custom Fit with. The Custom Fit combination then allows the character to use either the base armor or add on the stack bonus for that set of gear.

### Other Armor Features

- **Concealability**: This feature means things are either more easily hidden beneath the girth or length of the piece, or the design of the piece means it is less likely to be detected.
- **Holster**: This piece has a holster built into the armor so smoothly it is hard to see with the metahuman eye. This item provides a –1 Concealability modifier for any tests to spot a weapon in the holster through visual means.
- **Gear Access**: This feature allows items to be retrieved from the piece of armor with more ease than usual. This means drawing or retrieving items that are set up on the armor takes one lower action. Complex becomes Simple, and Simple becomes Free. Free stays Free, but gamemasters can consider allowing an extra Free Action for the Action Phase.
- **Newest Model**: These items are the most recent incarnations of their corporate creators. That means they lose a little more when purchased as Lightly Worn, namely a 20 percent loss of Armor Rating (round adjusted Rating up) when buying older models of the clothes.
- **Illuminating**: Armor with this feature enhances lighting conditions by 1 category within 10 meters. That can be increased to 25 meters when individuals in the vicinity uses special IR lights and contacts.
- **Custom Protection**: These items come with a built-in environmental customization (Fire Resistance, Chemical Protection, or Insulation) that cannot be removed or changed. The option is chosen at purchase and is included in the price.
- **Restrictive**: This armor is a little unwieldy. Armors with this quality halve Movement and incur Fatigue rolls with every Running check, even the first one.
- **Padded**: This armor has a little extra over the vitals, making them harder to hit. Increase the Called Shot modifier by 2 (making it –6) for all Called Shots to Vitals.

## Martial Arts

Martial arts styles provide specialized combat techniques and can be used as skill specializations. Each style has six techniques for a character to choose from. Buying a new style costs 7 Karma, and when you buy that style you may then choose a technique to go with it. Buying additional techniques costs 5 Karma. At character creation, you can buy up to 5 total techniques, in a single style, which costs 27 Karma. You can only buy one style at character creation.

After character creation, the character can continue to learn techniques within the martial art style or pick up a new martial art style. Each technique within the style takes 2 weeks to learn and the same Karma cost. A character can learn a new technique in a different martial art style, but they must spend the time to learn that style of fighting as well. Each new style takes 1 month to learn and costs 7 Karma for the style and the first technique; that time includes the learning of the technique. Once a style is known techniques within that style cost 5 Karma and 2 weeks to learn. A character can learn multiple styles, but there is a limit in how much stacking a character can get away with. You cannot gain more than a +2 bonus or a reduction in modifiers by more than 2 from purchasing the same technique from two different martial art styles.

**Learning Martial Arts**

| DESCRIPTION | LEARNING TIME | KARMA | INSTRUCTION COST |
| --- | --- | --- | --- |
| New Technique | 2 Weeks | 5 | 1,500¥ |
| New Style | 1 Month | 7 | 2,500¥ |

Note: The learning of a new style comes with one technique available under that style.

Common martial art styles include: 52 Blocks, Aikido, Arnis De Mano, Bartitsu, Boxing (Brawler, Classic, Swarmer), Capoeira, Carromeleg, Chakram Fighting, Drunken Boxing, Fiore Dei Liberi, Firefight, Gun Kata, Jeet Kune Do, Jogo Du Pau, Jujitsu, Karate, Kenjutsu, Knight Errant Tactical, Krav Maga, Kunst Des Fechtens, Kyujutsu, La Verdadera Destreza, Lone Star Tactical, Muay Thai, Ninjutsu, Okichitaw, Parkour, Penthak-Silat, Quarterstaff Fighting, Sangre Y Acero, Tae Kwon Do, The Cowboy Way, Turkish Archery, Whip Fighting, Wildcat, Wrestling (Sport, Sumo, Professional, MMA), and Wudang Sword.

For detailed descriptions of each style and their available techniques, see the full Martial Arts documentation.

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

