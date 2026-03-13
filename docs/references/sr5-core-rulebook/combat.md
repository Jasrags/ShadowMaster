# Combat

**Source:** SR5 Core Rulebook, Section 5
**Book Pages:** 158–209
**PDF Pages:** 160–211

## Overview

Combat in Shadowrun 5e is resolved through Opposed Tests between attacker and defender, modulated by Initiative order, action economy, environmental conditions, and damage resistance. A Combat Turn represents approximately 3 seconds and is divided into Initiative Passes; each character acts once per pass as long as their Initiative Score remains above 0. The system covers ranged combat, melee combat, vehicle combat, chase scenes, and healing in a unified framework where net hits on the attack roll add directly to Damage Value before the defender's Body + Armor resistance test.

---

## Rules

### Combat Turn Sequence

Each Combat Turn follows five steps: (1) Roll Initiative, (2) Begin Initiative Pass, (3) Begin Action Phase — declare actions, (4) Declare and resolve actions of remaining characters, (5) Begin new Combat Turn. Combat Turns repeat until combat ends.

### Initiative Score

Roll Initiative Attribute + Initiative Dice; the sum is the Initiative Score. Initiative Attribute and Base Initiative Dice vary by type:

- Physical: Reaction + Intuition, 1D6
- Astral: Intuition × 2, 2D6
- Matrix cold-sim VR: Data Processing + Intuition, 3D6
- Matrix hot-sim VR: Data Processing + Intuition, 4D6
- Rigging AR: Reaction + Intuition, 1D6

Wound modifiers apply to Initiative Score immediately on injury, even within the same Initiative Pass.

### Initiative Passes and Turn Order

Characters act from highest to lowest Initiative Score. After all characters in a pass have acted, subtract 10 from all Initiative Scores; anyone above 0 gets another Action Phase (a new Initiative Pass). Repeat until all scores ≤ 0, then begin a new Combat Turn.

### Tied Initiative Score

Use ERIC (Edge, Reaction, Intuition, Coin toss) as tiebreakers in that order. Alternatively the GM may rule simultaneous action.

### Changing Initiative

If a character's Initiative Attribute changes mid-combat (augmentation activates, wound modifier applied, etc.), immediately apply the difference as a positive or negative modifier to the current Initiative Score.

### Initiative and Edge

- **Seize the Initiative:** Spend 1 Edge to move to the top of the initiative order for the entire Combat Turn.
- **Blitz:** Spend 1 Edge to roll the maximum 5D6 Initiative Dice for a single Combat Turn.

### Delaying Actions

A character may delay their Action Phase to a lower Initiative Score within the same Combat Turn, declaring this during Step 3A. Delayed characters insert themselves before, after, or simultaneously with another character at the declared score. All delayed actions suffer a −1 dice pool penalty. If the character does not act before the end of the Initiative Pass, the standard −10 is applied.

### Timed Items and Initiative

Grenades with built-in timers detonate on the next Combat Turn at the same Initiative Score at which they were thrown, minus 10. Motion sensor and wireless link detonation methods follow distinct rules (see Projectiles section).

### Action Phase

Each Action Phase, a character may take: two Simple Actions OR one Complex Action, plus one Free Action (at any point during their own Action Phase or at any later time in the pass). Interrupt Actions may be taken outside the normal Action Phase at the cost of Initiative Score.

### Free Actions

Require minimal effort; no Success Test normally needed. Available once per Initiative Pass (or anytime, if taken after the character's Action Phase). If a character has not yet had their first Action Phase, they may only take a Free Action if not surprised. Examples:

- Call a Shot (combined with a Fire Weapon, Throw Weapon, or Melee Attack)
- Change Linked Device Mode (activate/switch cyberware or smartlinked device via DNI)
- Drop Object (if holding one in each hand, drop both as a single Free Action)
- Drop Prone (cannot do if surprised)
- Eject Smartgun Clip (requires separate Simple Action to insert new clip)
- Gesture
- Multiple Attacks (declare split dice pool against multiple targets; combined with attack action)
- Run (incurs Running modifiers for the Combat Turn)
- Speak/Text/Transmit Phrase (one short phrase)

### Simple Actions

One step more complex than Free Actions; two allowed per Action Phase (only one can be an attack). Examples:

- Activate Focus
- Call Spirit / Command Spirit / Dismiss Spirit
- Change Device Mode / Change Gun Mode
- Fire Bow (single arrow)
- Fire Weapon SA, SS, BF, or FA (see Firing Modes)
- Insert Clip / Remove Clip
- Observe in Detail (Perception Test)
- Pick Up / Put Down Object
- Quick Draw: (Weapon Skill) + Reaction [Physical] (3) Test; threshold 2 with quick-draw holster. On success, draws and fires as one Simple Action; on failure, clears gun and no further actions allowed.
- Ready Weapon (draw from holster, sheath, or sling)
- Reckless Spellcasting (cast spell at higher Drain risk)
- Reload Weapon — removable clip (c) or Bow only; all other reload methods are Complex Actions (see Reloading Weapons table)
- Shift Perception (Astral)
- Stand Up (if wounded: Body + Willpower [2] Test required)
- Take Aim: each action adds +1 dice pool modifier OR +1 Accuracy to attack roll; cumulative up to Willpower ÷ 2 (round up); benefits lost if any other action (including Free) is taken before attacking
- Take Cover (grants cover bonus to defense; unavailable if surprised)
- Throw Weapon (Short or Medium range)
- Use Simple Device

### Complex Actions

One per Action Phase; can also take a Free Action. Examples:

- Astral Projection
- Banish Spirit
- Cast Spell
- Fire Full-Auto Weapon (FA, 10 bullets, Simple = 6 bullets)
- Fire Long Burst or Semi-Auto Burst (Complex)
- Fire Mounted or Vehicle Weapon
- Load and Fire Bow (combined with Nock arrow)
- Matrix Actions (most)
- Melee Attack
- Reload Firearm (belt, belt-fed, cylinder, drum, internal magazine, muzzle-loader, speed loader)
- Rigger Jump In
- Sprint (Running + Strength [Physical] test; each hit adds 1 m [dwarfs/trolls] or 2 m [elves/humans/orks] to Run Rate; maximum sprint tests = half Run skill, minimum 1)
- Summoning
- Use Skill

### Interrupt Actions

Taken outside the character's Action Phase; cost Initiative Score at time of the action. A character must have enough Initiative Score remaining to pay. Cannot be taken before first Action Phase if surprised.

| Interrupt Action | Initiative Cost |
| ---------------- | --------------- |
| Block            | −5              |
| Dodge            | −5              |
| Full Defense     | −10             |
| Hit the Dirt     | −5              |
| Intercept        | −5              |
| Parry            | −5              |

### Movement

Total movement for a Combat Turn (all Initiative Passes combined) is based on the Run rate. Walk rate determines when a character is considered Running. Running characters must use a Free Action each Initiative Pass. Movement rates:

| Metatype        | Walk Rate   | Run Rate    | Sprint Increase |
| --------------- | ----------- | ----------- | --------------- |
| Dwarf, Troll    | Agility × 2 | Agility × 4 | +1 m/hit        |
| Elf, Human, Ork | Agility × 2 | Agility × 4 | +2 m/hit        |

### Running Modifiers

- All actions while running (except Sprinting): −2 dice pool
- Charging into melee combat while running: +4 dice pool (+2 net, offsetting the −2 penalty)
- Making ranged attack against running target: −2 dice pool
- Making ranged attack while running: −2 dice pool
- Sprinting target attacked at range: −4 dice pool

### Accuracy

All weapons have an Accuracy rating that acts as the limit on the attack dice pool. Melee improvised weapons average Accuracy 4–5; combat weapons average 5. Unarmed attacks use the Inherent Physical limit. Broken or damaged weapons may have Accuracy reduced by 1.

### Armor

The highest single armor piece applies (not stacked). Armor accessories ("+X" items) add to Armor rating for Damage Resistance tests; the maximum bonus from accessories is limited to the character's Strength. For every 2 full points by which the bonus exceeds Strength, the character suffers −1 to Agility and Reaction.

### Armor Penetration

AP modifies the target's Armor rating on Damage Resistance tests. If modified Armor ≤ 0, the character loses all armor dice but does not subtract from Body.

### Damage Types

**Physical damage** — from guns, explosions, most melee weapons, many magic spells; letter "P" on Damage Value. Condition Monitor boxes = (Body ÷ 2) + 8.

**Stun damage** — from fists, blunt weapons, shock weapons, some magic; letter "S" on Damage Value. Condition Monitor boxes = (Willpower ÷ 2) + 8.

### Wound Modifiers

Accumulated at every third box of damage across both tracks combined. Applied to all tests except Damage Resistance, toxin resistance, and direct combat spell defense. Also applied to Initiative Attribute (affects Initiative Score immediately).

### Exceeding the Condition Monitor

- Stun overflow: for every 2 full boxes of excess Stun, carry 1 box to the Physical track.
- Physical overflow: character is near death. Instant death occurs only if Physical overflow exceeds Body. Each (Body) minutes without medical attention causes an additional box of damage. If cumulative overflow exceeds Body before help arrives, the character dies.

### Combat Resolution (DADA Sequence)

**Step 1 — Declare:** Attacker declares attack; defender declares defense method (standard defense is free; Dodge, Parry, Block cost −5 Initiative Score).

**Step 2 — Attack:** Attacker rolls Combat Skill + Attribute +/− modifiers [Limit = Accuracy]. Apply wound, environmental, recoil, and situational modifiers.

**Step 3 — Defend:**

- A. Defender rolls Reaction + Intuition +/− modifiers (free, no limit). If attacker scores more hits, net hits = attack hits − defense hits. Tie = grazing hit. More defense hits = miss.
- B. Add net hits to weapon's base Damage Value = modified DV. Apply AP to Armor. If modified DV ≥ modified Armor → Physical damage; if modified DV < modified Armor → Stun damage. Defender rolls Body + modified Armor; each hit reduces DV by 1. If DV ≤ 0, no damage.

**Step 4 — Apply Effect:** Apply remaining DV as boxes to Condition Monitor. Check Wound Modifiers, Knockdown, elemental effects.

### Grazing Hit

On a tie in the Opposed Test, the attack makes contact but does no damage. Contact-based attacks (poisons, shock gloves, touch-only spells) still activate.

---

## Ranged Combat

### Ranged Attack Dice Pool

Weapon Skill + Agility [Accuracy] vs. defender's Reaction + Intuition. Net hits add to DV.

### Environmental Modifiers (Ranged)

Use the most severe single condition; if two conditions tie for most severe, bump the modifier up one category. Apply to both attacker and defender sides as appropriate (condition is evaluated at the shooter's position for the attacker, and at the target's position for the defender).

| Visibility                                          | Light/Glare                     | Wind                 | Range   | Modifier |
| --------------------------------------------------- | ------------------------------- | -------------------- | ------- | -------- |
| Clear                                               | Full Light / No Glare           | None or Light Breeze | Short   | —        |
| Light Rain/Fog/Smoke                                | Partial Light / Weak Glare      | Light Winds          | Medium  | −1       |
| Moderate Rain/Fog/Smoke                             | Dim Light / Moderate Glare      | Moderate Winds       | Long    | −3       |
| Heavy Rain/Fog/Smoke                                | Total Darkness / Blinding Glare | Strong Winds         | Extreme | −6       |
| Combination of two or more conditions at the −6 row |                                 |                      |         | −10      |

### Environmental Compensation

| Compensation         | Effect                                                                        |
| -------------------- | ----------------------------------------------------------------------------- |
| Flare Compensation   | Glare conditions shift two rows up                                            |
| Image Magnification  | Reduce Range by one category                                                  |
| Low-Light Vision     | Treat Partial Light and Dim Light as Full Light                               |
| Thermographic Vision | Visibility and Light conditions shift one row up                              |
| Tracer Rounds (FA)   | Wind in rows below Light Winds and Range in rows below Short shift one row up |
| Smartlink            | Wind shifts one row up                                                        |
| Sunglasses           | Glare shifts one row up / Light conditions shift one row down                 |
| Ultrasound           | Visibility shifts one row up; ignores Light conditions (within 50 meters)     |

### Recoil

Recoil compensation = 1 (free) + Strength ÷ 3 (round down) + any weapon's built-in Recoil Compensation (only if loaded/in hand and ready to shoot). Subtract bullets fired; negative result = recoil penalty subtracted from dice pool. Recoil accumulates across all Action Phases and Combat Turns (progressive recoil) unless the character takes or is forced into a Simple or Complex non-shooting action. Recoil applies to the character, not the weapon.

- SS weapons: no cumulative recoil (chambering delay between shots)
- Vehicle/drone mounted weapons: Recoil Compensation = vehicle Body + weapon's built-in RC

When multiple firearms are fired simultaneously, shots from each gun add to total recoil value.

### Firing Modes

| Mode                                     | Action  | Bullets | Defense Modifier | Notes     |
| ---------------------------------------- | ------- | ------- | ---------------- | --------- |
| Single-Shot (SS)                         | Simple  | 1       | 0                | No recoil |
| Semi-Auto (SA)                           | Simple  | 1       | 0                |           |
| Semi-Auto Burst (SB)                     | Complex | 3       | −2               |           |
| Burst Fire (BF)                          | Simple  | 3       | −2               |           |
| Long Burst (LB) or Full-Auto (FA) Simple | Simple  | 6       | −5               |           |
| Full-Auto (FA) Complex                   | Complex | 10      | −9               |           |
| Suppressive Fire                         | Complex | 20      | Duck or Cover    | No recoil |

**Suppressive Fire:** Attacker rolls Weapon Skill + Agility [Accuracy], records hits. Creates a triangular zone projecting outward up to weapon's max range, 10 m wide at end, 2 m high. Anyone in or adjacent to the zone takes a dice pool penalty equal to the hits on all actions unless completely unaware (e.g., astral projection). Anyone moving into/out of the zone must make Reaction + Edge (3) Test (using full Edge rating regardless of spent points) or take base DV (modified by special ammo). Suppression lasts until end of Combat Turn or until firer moves/takes another action. If short on ammo: reduce each modifier by 1 per bullet short; suppressed area width reduced by 1 m per 2 bullets short.

### Situational Modifiers (Ranged)

| Situation                                      | Attacker Dice Pool         |
| ---------------------------------------------- | -------------------------- |
| Attacker firing from cover with imaging device | −3                         |
| Attacker firing from moving vehicle            | −2                         |
| Attacker in melee combat                       | −3                         |
| Attacker running                               | −2                         |
| Attacker using off-hand weapon                 | −2                         |
| Attacker wounded                               | −Wound modifier            |
| Blind fire                                     | −6                         |
| Called shot                                    | −4                         |
| Previously aimed with Take Aim                 | +1 Dice Pool, +1 Accuracy  |
| Wireless smartgun                              | +1 (gear) / +2 (implanted) |

---

## Firearms Specifics

### Shotguns and Choke Settings

Shotguns fire flechette or slug rounds. Shot rounds spread via choke setting:

**Narrow Spread:** −1 defense at all ranges.

**Medium Spread:** Short range: −1 DV, targets get −3 defense, up to 2 targets within 2 m spread. Medium range: −3 DV, −3 defense, up to 3 targets within 4 m spread. Long range: −5 DV, −1 Accuracy, −1 defense, up to 4 targets within 6 m spread. Extreme: −7 DV, −1 Accuracy, −3 defense, up to 6 targets within 8 m spread. Medium spreads cannot be used with Called Shots.

**Wide Spread:** Short: −3 DV, −5 defense, up to 2 targets within 3 m. Medium: −5 DV, −5 defense, up to 3 targets within 6 m. Long: −7 DV, −1 Accuracy, −5 defense, up to 4 targets within 9 m. Extreme: −9 DV, −1 Accuracy, −5 defense, up to 6 targets within 12 m. Wide spreads cannot be used with Called Shots.

---

## Projectiles

### Thrown Weapons

Standard ranged attack rules apply. Ranges scale with STR (see Range Table). Shuriken: ready Agility ÷ 2 per Ready Weapon action. Throwing Knife: ready Agility ÷ 2 per Ready Weapon action.

### Grenades

Throw Weapons + Agility [Physical] (3) Test modified for range. 3+ hits: no scatter. Fewer hits: scatter. Grenade lands right where intended on success; use Scatter Table on failure. Detonation methods:

- **Built-in Timer:** detonates next Combat Turn at same Initiative Score minus 10, ignoring Initiative changes.
- **Motion Sensor:** detonates after any sudden stop/change in direction after arming; uses ranged attack rules with extra scatter step if attack roll misses. Glitch on attack roll = does not detonate but scatters double distance. Critical Glitch = detonates immediately on thrower.
- **Wireless Link:** safest method; reduces scatter. Requires DNI and Change Wireless Device Mode Free Action. Without DNI, must use Change Linked Device Mode Simple Action on subsequent Action Phases.

### Grenade Launchers, Rockets, and Missiles

Use Heavy Weapons + Agility [Accuracy] (3) Test modified for range. On miss, determine scatter using Scatter Table. Minimum range 5 meters (safety feature; does not detonate before traveling 5 m).

### Determine Scatter

Direction: roll 2D6 and consult Scatter Diagram (7 = straight ahead, 2/12 = back toward attacker). Distance: roll scatter dice (from Scatter Table) and subtract attacker's hits. If result ≤ 0, projectile hits target exactly.

| Projectile Type     | Scatter Dice      |
| ------------------- | ----------------- |
| Standard Grenade    | 1D6 − Hits meters |
| Aerodynamic Grenade | 2D6 − Hits meters |
| Grenade Launcher    | 3D6 − Hits meters |
| Missile Launcher    | 4D6 − Hits meters |
| Rocket Launcher     | 5D6 − Hits meters |

### Blast Effects

Area-effect explosions deal damage to all targets within blast radius. Damage decreases with distance from blast point per the Grenades/Rockets/Missiles Table (p. 435). In confined spaces, blast waves reflect off walls and can compound (the "chunky salsa effect"). When multiple explosives detonate simultaneously at the same Initiative Score on the same character: add half the lower DV to the higher DV and apply as a single modified DV.

### Penetration Weapons (Shooting Through Barriers)

Firearms and pointed swords: barrier takes 1 box of unresisted damage; remaining damage transfers to target behind. Multiple rounds increase barrier damage: 3 bullets = 2 boxes, 6 bullets = 3 boxes, 10 bullets = 4 boxes. Only applies when modified DV exceeds barrier Armor.

---

## Sensor Attacks

### Sensor Test

Perception + Intuition [Sensor]. Vehicles: Pilot + Clearsight [Sensor]. Defense: metahumans/critters = Infiltration + Agility [Physical]; driven vehicles = Infiltration (Vehicle) + Reaction [Handling]; drones = Pilot + [Model] Evasion [Handling].

### Passive Targeting

Vehicle's Sensor Attribute substitutes for Accuracy of the weapon. Attacker rolls Gunnery + Logic [Sensor].

### Active Targeting

Vehicle/character makes Sensor Test (Simple Action) to lock on. Net hits applied as negative modifier to defender's Defense Test. If no hits achieved, active targeting cannot proceed. Once locked, no further Sensor Tests needed unless target breaks sensor contact.

---

## Melee Combat

### Melee Attack Dice Pool

Combat Skill + Agility [Accuracy] vs. defender's Reaction + Intuition (free) or active defense option. Net hits add to DV. Unarmed damage: (STR)S.

### Reach

Weapons (or troll arms) have Reach ratings 1–4. Calculate net Reach difference between attacker and defender; positive difference = negative modifier to defender's dice pool; negative difference = positive modifier to defender's dice pool. Trolls have natural Reach 1, cumulative with weapon Reach.

### Melee Modifiers

| Situation                            | Dice Pool Modifier                |
| ------------------------------------ | --------------------------------- |
| Attacker making charging attack      | +2                                |
| Attacker prone                       | −1                                |
| Attacker making a Called Shot        | −4                                |
| Character attacking multiple targets | Split dice pool                   |
| Character has superior position      | +2                                |
| Character using off-hand weapon      | −2                                |
| Attacker wounded                     | −wound modifier                   |
| Defender receiving a charge          | +1                                |
| Environmental modifiers              | Light and Visibility columns only |
| Attacker has friends in melee        | +1 or Teamwork                    |
| Opponent prone                       | +1                                |
| Touch-only attack                    | +2                                |

### Melee Teamwork

Attacker uses Complex Action to make Opposed Test (Combat Skill + Agility [Accuracy] with all modifiers including Ally in Combat modifier) vs. opponent's Intuition. Hits add as positive dice pool modifier for the next ally to attack the same opponent. Three teamwork attacks must precede a standard attack. Bonus can be built up across multiple teamwork attackers.

### Defending in Melee

- **Free (standard):** Reaction + Intuition
- **Parry (−5 Initiative):** Reaction + Intuition + Melee Weapon Skill [Physical]; requires weapon in hand. Physical limit applies.
- **Block (−5 Initiative):** Reaction + Intuition + Unarmed Combat [Physical]; requires empty hands.
- **Dodge (−5 Initiative):** Reaction + Intuition + Gymnastics [Physical]. Physical limit applies.
- **Full Defense (−10 Initiative):** Willpower added to all Defense Tests for the entire Combat Turn.

Full Defense can be combined with Block, Dodge, or Parry.

### Defense Modifiers

| Situation                                                   | Dice Pool Modifier        |
| ----------------------------------------------------------- | ------------------------- |
| Defender inside a moving vehicle                            | +3                        |
| Defender prone                                              | −2                        |
| Defender unaware of attack                                  | No defense possible       |
| Defender wounded                                            | −wound modifier           |
| Attacker has longer Reach                                   | −1 per point of net Reach |
| Defender has longer Reach                                   | +1 per point of net Reach |
| Defender receiving a charge                                 | +1                        |
| Defender has defended against previous attacks this phase   | −1 per previous attack    |
| Attacker firing flechette shotgun narrow/medium/wide spread | −1/−3/−5                  |
| Attacker firing FA (Complex)                                | −9                        |
| Attacker firing LB or FA (Simple)                           | −5                        |
| Attacker firing BF or SA burst                              | −2                        |
| Defender in melee targeted by ranged attack                 | −3                        |
| Defender running                                            | +2                        |
| Defender/target has Good Cover                              | +4                        |
| Defender/target has Partial Cover                           | +2                        |
| Targeted by area-effect attack                              | −2                        |

---

## Special Damage Types

### Elemental Damage

#### Acid Damage

Physical. Also reduces Armor rating by 1 per hit. If acid is not removed, continues to burn each Combat Turn: base DV decreases by 1 and is applied again, and Armor continues to be reduced by 1 each turn until removed/neutralized/DV reaches 0.

#### Cold Damage

Physical. Makes armor brittle, lubricants freeze, etc. If armor gets no hits on Damage Resistance, it breaks and cannot be used.

#### Electricity Damage

Stun or Physical depending on source/target. Non-conductivity armor upgrade adds its full rating to Armor. Secondary effects on characters: −1 dice pool on all actions and Defense Tests (not Damage Resistance) for 1 Combat Turn, and immediate Initiative Score reduction of 5. Penalty and Initiative reduction do not stack with multiple electricity attacks but duration extends by 1 Combat Turn per additional hit. If Initiative Score is reduced to 0 or below, last action is lost. Electronics/drones: never suffer Stun; resist as normal but secondary effect on single box of damage = secondary Matrix damage equal to half Physical damage rounded down.

#### Fire Damage

Physical. Roll Armor Value + Fire Resistance − Fire AP (Open Flame AP = −2; Fire-based spell AP = −spell Force; Flame-based weapon AP = −6) to determine if item catches fire. Threshold = net hits on fire-based attack. If something catches fire, initial DV = 3P; increases by 1 at start of each subsequent Combat Turn until extinguished or destroyed. Extinguish with Agility + Intuition Test; each hit reduces DV by 1.

### Falling Damage

Falling more than 3 meters: Physical damage with DV equal to number of meters fallen, AP −4. Resist with Body + Armor. Falling characters drop 50 m in first Combat Turn, 150 m in second, 200 m every turn after.

### Fatigue Damage

Stun damage from exertion; resisted by Body + Willpower (not Armor). Cannot heal while the causing condition exists.

- **Sprinting fatigue:** cumulative 1S DV per consecutive Sprint Action in same Combat Turn (2S the second, 3S the third, etc.)
- **Running fatigue (without sprinting):** 1S every 3 minutes
- **Environmental fatigue:** see Environment & Fatigue table

| Environment Severity | Fatigue Damage Interval    |
| -------------------- | -------------------------- |
| Mild                 | 6 hours                    |
| Moderate             | 3 hours                    |
| Harsh                | 60 minutes                 |
| Extreme              | 1 minute (10 Combat Turns) |
| Deadly               | 6 seconds (2 Combat Turns) |

- **Hunger/thirst/sleep deprivation:** starts at 1S after 24 hours; Hunger interval 6 days, Thirst 2 days, Sleep 3 hours.

---

## Cover

Good Cover (>50% body obscured): +4 defense, applies to ranged and area-effect spells. Partial Cover (25–50% obscured): +2 defense. Take Cover is a Simple Action; cannot be taken if surprised. Stationary targets ≥ 20 m away from attackers and behind cover also benefit.

If attacker ties Opposed Test when target is in cover, attack hits through the cover (treat with Barriers rules).

---

## Barriers

Barriers have Structure (Condition Monitor boxes = Structure rating) and Armor. Every square meter (≈10 cm thick) has boxes equal to Structure rating. Damage Resistance = Structure + Armor. Barriers ignore Stun damage. If Structure is exceeded by damage, a hole is created: 1 square meter per increment of Structure rating.

| Barrier Type                                                   | Structure | Armor |
| -------------------------------------------------------------- | --------- | ----- |
| Fragile (standard glass)                                       | 1         | 2     |
| Cheap Material (drywall, plaster, door)                        | 2         | 4     |
| Average Material (furniture, plastiboard, ballistic glass)     | 4         | 6     |
| Heavy Material (tree, hardwood, dataterm, chain link)          | 6         | 8     |
| Reinforced Material (densiplast, security door, armored glass) | 8         | 12    |
| Structural Material (brick, plascrete)                         | 10        | 16    |
| Heavy Structural Material (concrete, metal beam)               | 12        | 20    |
| Armored/Reinforced Material (reinforced concrete)              | 14        | 24    |
| Hardened Material (blast bunkers)                              | 16+       | 32+   |

### Shooting Through Barriers

Attacker shooting through barrier to hit defender behind it: defender gains cover bonus. If fully hidden behind opaque barrier, attacker suffers −6 Blind Fire penalty. Barrier takes the hit first; if modified DV < barrier Armor, attack stops. If modified DV ≥ barrier Armor, barrier takes 1 box damage and remaining damage transfers through. Destroying barrier: attack is uncontested; no hits = only base DV applies; critical glitch = attacker cannot hit.

### Damaging Barriers

| Weapon                            | DV Modifier             |
| --------------------------------- | ----------------------- |
| Melee or Unarmed                  | No change               |
| Projectiles and bullets           | See Penetration Weapons |
| Explosive in contact with barrier | Base DV × 2             |
| AV rocket/missile                 | Base DV × 2             |
| Combat spell                      | No change               |

---

## Defending in Combat

### Ranged Defense

Standard (free): Reaction + Intuition. Full Defense (−10 Initiative): adds Willpower to Defense Tests for the entire Combat Turn.

### Active Defenses

- **Full Defense (−10 Initiative):** Willpower bonus to all Defense Tests for entire Combat Turn. Stackable with other interrupt defenses.
- **Dodge (−5 Initiative):** Reaction + Intuition + Gymnastics [Physical] for one Defense Test.
- **Parry (−5 Initiative):** Reaction + Intuition + Melee Weapon Skill [Physical] for one Defense Test; requires melee weapon in hand.
- **Block (−5 Initiative):** Reaction + Intuition + Unarmed Combat [Physical] for one Defense Test; requires empty hands.

---

## Special Actions

### Surprise

All participants make Surprise Test: Reaction + Intuition (3). Characters alerted in advance: +3 dice pool. Success = act normally. Failure = lose 10 from Initiative Score; considered surprised until next Action Phase. Surprised characters get no Defense Test when attacked (spend Edge to avoid surprise and still be able to use defense rolls). Ambushers waiting in position: +6 dice pool on Surprise Test and automatically not surprised by their ambush targets.

**Critical glitch on Surprise Test:** character is completely stunned; does not act on first Action Phase; takes −10 for failing the test, plus an additional −10 if entering combat mid-turn.

### Interception

If a character moves within 1 + Reach meter(s) of an opponent and attempts to pass without attacking, the opponent may use an Interrupt Action (−5 Initiative) to make a melee attack. The interceptor makes a normal melee attack; if the intercepted character takes damage equal to or exceeding their Body, they are stopped. Prone combatants cannot intercept. Agility + Gymnastics (1) [Physical] Test allows moving past one opponent per hit (using a Complex Action).

### Knockdown

If a character takes damage from a single attack exceeding their Physical limit (after Damage Resistance), the attack automatically knocks them down (forced Drop Prone free action). Any character who takes 10+ boxes from a Damage Resistance Test in a single attack is always knocked down. Gel rounds: reduce Physical limit by 2 when determining knockdown threshold.

### Subduing

Use Unarmed Combat to grapple. If attacker's net hits + Strength exceed defender's Physical limit, grapple is established (no damage). Defender must take Complex Action to break free: Unarmed Combat + Strength [Physical] with threshold equal to the attacker's net hits on grapple test. Grappler must spend a Complex Action each of their Action Phases to maintain hold; each Action Phase may also: make another Unarmed Combat attack to tighten grip (Superior Position +2), inflict Stun damage = Strength (DV, resisted normally with Armor), or attempt Knock Down (Called Shots rules, Superior Position +2). Subdued defender is treated as prone for attacks against them.

### Called Shots

All called shots: −4 dice pool penalty + Free Action (plus basic attack action).

- **Blast out of Hands:** disarm; target gets −4 die pool on disarm. Item travels (hits − 1) meters in direction away from shooter. Standard defense roll.
- **Dirty Trick:** even 1 net hit = opponent takes −4 dice pool on next action due to distraction.
- **Harder Knock:** changes Stun-based weapon damage code to Physical; no DV change.
- **Knock Down (melee only):** attacker declares intent; makes melee attack; compare Strength + net hits to defender's Physical limit. If exceeds, defender knocked to ground (no damage). Attacker may follow (free Drop Prone) or stay standing.
- **Shake Up:** target loses 5 from Initiative Score along with normal damage (even if damage is fully resisted, Initiative Score loss applies). If this drops Initiative Score below 0, target loses last action for that pass.
- **Splitting the Damage:** splits successful attack damage between Physical and Stun tracks. Attacker's AP must be less than target's Armor. Odd total DV: Stun gets the higher value. If modified DV < modified Armor total, damage is halved (all applied to Stun).
- **Trick Shot:** net hits = Intimidation dice pool modifier for attacker or ally after the shot.
- **Vitals:** +2 DV on the attack.

### Multiple Attacks

Declare with Multiple Attacks Free Action combined with attack action. Dice pool includes all modifiers (wound, environmental, situational, and full recoil for all attacks). Pool split as evenly as possible. Each attack resolved separately. Maximum attacks per Action Phase = Combat Skill ÷ 2. Edge dice applied before split; both pools can be re-rolled with a single Edge use. Total number of attacks limited to half attacker's Combat Skill.

### Dead Man's Trigger

Conditions: (1) at least 1 Initiative Score remaining, (2) spend 1 Edge, (3) succeed on Body + Willpower (3) Test. If all three met, character may perform one final action of any kind (no movement).

---

## Vehicle Combat

### Vehicle Stats

- **Handling:** Agility/responsiveness; base limit for maneuver Vehicle Tests.
- **Speed:** Maximum velocity; base limit for speed-focused Vehicle Tests.
- **Acceleration:** How quickly speed changes; maximum Range Categories movable per Combat Turn.
- **Body:** Structural integrity and size; resistance to damage.
- **Armor:** Toughness against attacks; second value in damage dice pool.
- **Pilot:** Built-in autopilot; replaces all Mental attributes and Reaction for vehicles not actively piloted.
- **Sensor:** Detection suite; acts as limit for Perception and detection tests.

Vehicle Condition Monitor = 12 + (Body ÷ 2) rounded down. Drones = 6 + (Body ÷ 2). Vehicles ignore Stun damage; electricity damage is always Physical for vehicles. Attack where modified DV does not exceed Armor = no damage.

### Vehicle Tests

Vehicle Skill + Reaction [Handling] (for maneuver tests) or [Speed] (for speed tests). Threshold set by situation difficulty. Threshold modified by terrain.

| Situation                         | Threshold           |
| --------------------------------- | ------------------- |
| Easy                              | 1                   |
| Average                           | 2                   |
| Hard                              | 3                   |
| Extreme                           | 4+                  |
| Driver jumped in with Control Rig | −Control Rig rating |

**Terrain Modifier Table:**

| Terrain    | Modifier |
| ---------- | -------- |
| Open       | +0       |
| Light      | +1       |
| Restricted | +2       |
| Tight      | +4       |

**Vehicle Test Modifier Table:**

| Situation                     | Modifier                                |
| ----------------------------- | --------------------------------------- |
| Pilot has impaired Visibility | Consult Visibility column (p. 175)      |
| Piloting in limited light     | Consult Light column (p. 175)           |
| Pilot unaware of event        | No test possible                        |
| Pilot wounded                 | −wound modifiers                        |
| Piloting damaged vehicle      | −(damage modifier) Handling (minimum 1) |
| Pilot using AR                | +1 Handling limit                       |
| Pilot using VR                | +2 Handling limit                       |

### Vehicle Movement Rates

Chosen at start of Combat Turn (not per Initiative Pass). Driver can adjust rate with required control action during Action Phase.

| Speed Attribute | Walking Rate (m/turn) | Running Rate (m/turn) |
| --------------- | --------------------- | --------------------- |
| 1               | 5                     | 10                    |
| 2               | 10                    | 20                    |
| 3               | 20                    | 40                    |
| 4               | 40                    | 80                    |
| 5               | 80                    | 160                   |
| 6               | 160                   | 320                   |
| 7               | 320                   | 640                   |
| 8               | 640                   | 1,280                 |
| 9               | 1,280                 | 2,560                 |
| 10              | 2,560                 | 5,120                 |

### Vehicle Actions

Driver must spend at least one Complex Action per Combat Turn to control vehicle, or vehicle is considered uncontrolled. Uncontrolled vehicles: all characters aboard suffer −2 dice pool; Pilot autopilot can take over if available.

**Free Actions:** Change Linked Device Mode (activate/deactivate sensors, ECM, weapons via DNI).

**Simple Actions:** Use Sensors; Use Simple Device (manually activate/deactivate on-board systems).

**Complex Actions:** Control Vehicle (maintain control); Fire Vehicle Weapon; Make Vehicle Test; Ramming.

### Crashes

Vehicle + any passengers resist damage = Body equal to vehicle Body, resisted by Body + Armor −6 AP. Stun if vehicle Body < character's Armor; Physical if vehicle Body ≥ character's Armor. Characters also make Composure (4) Test; failure causes action penalty equal to missed threshold for Combat Turns equal to the same number.

### Ramming

Treat as melee attack. Target must be within vehicle's Walking or Running Range (−3 dice pool for Running). Attacker rolls Vehicle Skill + Reaction to attack. Target rolls Reaction + Intuition (pedestrian) or Reaction + Intuition [Handling] (driven vehicle). If attacker gets more hits, ram succeeds. Base DV = ramming vehicle's Body + Speed (see Ramming Damage Table). Ramming vehicle resists half that amount. Both characters resist with Body + Armor −6 AP. Both drivers must make Vehicle Test to avoid losing control: ramming driver threshold 2, rammed driver threshold 3. Failure = uncontrolled.

| Speed (m/turn) | Damage Value |
| -------------- | ------------ |
| 1–10           | Body ÷ 2     |
| 11–50          | Body         |
| 51–200         | Body × 2     |
| 201–300        | Body × 3     |
| 301–500        | Body × 5     |
| 501+           | Body × 10    |

### Attacks Against Vehicles

Defense: driver rolls Reaction + Intuition. Drones: Pilot + Autosoft [Handling].

### Vehicle Damage

Resists as normal (Body + Armor). Modified DV < Armor = no damage. Vehicles with large Body dice pools: GMs encouraged to use the trade-4-dice-for-hits rule (4 dice = 1 hit) to simplify tests.

### Evasive Driving (Defense)

Free Action; vehicle equivalent of Full Defense. Driver reduces Initiative Score by 10, adds Intuition dice to defense dice pool. Cannot be used against ramming.

### Called Shot on Vehicles

Same rules as Called Shots (p. 195). Can target specific components (window, sensor, tire, etc.). Shot-out tires: −2 dice pool modifier per flat tire to Vehicle Tests.

### Attacks Against Passengers

Must specifically target passengers (vehicle unaffected) or vehicle (passengers unaffected). Exceptions: ramming, suppressive fire, area-effect attacks — affect both. Passengers always considered under Good Cover (+4) plus +3 for being inside a moving vehicle. Passengers defending against attacks inside vehicle suffer −2 defense (movements limited to vehicle interior). Vehicle Armor adds to personal armor for passengers. In ramming, suppressive, and area-effect attacks: both passengers and vehicle resist equally.

---

## Chase Combat

All parties in moving vehicles use Chase Combat rules when all parties are in motion. Chase Environment is either Speed or Handling. Four Chase Ranges correspond to each environment.

| Range   | Speed Environment (approx m) | Handling Environment (approx m) |
| ------- | ---------------------------- | ------------------------------- |
| Short   | 0–10                         | 0–5                             |
| Medium  | 11–50                        | 6–20                            |
| Long    | 51–150                       | 21–80                           |
| Extreme | 151–300                      | 81–150                          |

**Chase Turn Steps:** (1) Determine Chase Environment, (2) Establish relative Chase Ranges, (3) Roll Initiative, (4) Take actions in Initiative order.

**Chase Actions (all Complex Actions):**

- **Catch-Up/Break Away (any range):** Reaction + Vehicle Skill [Speed or Handling] vs. maneuver Threshold. Each hit over threshold shifts one Range Category toward or away from opponent. Moving out of Extreme Range: fleeing vehicle escapes; pursuing vehicle gets Reaction + Vehicle Skill [Speed or Handling] test to maintain pursuit.
- **Cut-Off (Short range only):** Opposed Reaction + Vehicle Skill [Handling] Test. If acting vehicle wins, target must make immediate Vehicle Test (threshold = net hits) or crash.
- **Ram (Short range only):** Opposed Vehicle Skill + Reaction [Speed or Handling]. In Speed Environment use Speed limit; Handling Environment use Handling limit. Winner rams target: target takes Body of ramming vehicle + net hits; ramming vehicle takes half Body.
- **Stunt (any range):** GM sets threshold based on environment/difficulty. Driver rolls Vehicle Skill + Reaction [Speed or Handling]. Speed Environment: limit = Speed; Handling Environment: limit = Handling. Failure = out of control (could crash, slow down, or other consequence).

**Passenger Actions in Chase:** −2 to all attack rolls when attacking outside a maneuvering vehicle.

---

## Healing

### First Aid

First Aid + Logic [Mental] (2) Test. Apply Healing Modifiers. Each net hit over threshold removes 1 box of damage (divide net effect by 2 if target wears full-body armor). Maximum healable damage = First Aid skill rating. Only applicable within 1 hour of when damage was taken. Can only be applied once per set of wounds; cannot be applied after magical healing. In combat: Complex Action + (number of boxes healing) Combat Turns. Critical glitch increases damage by 1D3 (1D6 ÷ 2) boxes.

### Natural Recovery

**Stun:** Body + Willpower Extended Test (1 hour interval). Must rest entire hour. Each hit heals 1 box.

**Physical:** Body × 2 Extended Test (1 day interval). Must rest entire day. Each hit heals 1 box. Cannot heal Physical damage through rest while Stun damage also exists (Stun must be healed first).

Glitch on healing test: doubles resting time. Critical glitch: increases damage by 1D3 boxes and doubles resting time.

### Medicine

Medicine + Logic [Mental] Test; apply Healing Modifiers (including wound modifiers if applying to own wounds). Each hit adds +1 die to subsequent healing tests. Spend at least 30 minutes per day (Physical) or 10 minutes per day (Stun) tending to patient. Medicine can only be applied once per set of wounds but can be used after First Aid and/or magical healing. New damage = new set of wounds.

### Medkits and Autodocs

In combat: Complex Action to attach medkit/autodoc. Provides dice pool modifier equal to medkit rating (if wireless) or the autodoc's First Aid/Medicine autosoft. Unattended wireless medkit: roll device's rating × 2 for subsequent tests.

**Healing Modifiers Table:**

| Situation                                             | Modifier                             |
| ----------------------------------------------------- | ------------------------------------ |
| Good conditions (sterilized medical facility)         | +0                                   |
| Average conditions (indoors)                          | −1                                   |
| Poor conditions (street or wilderness)                | −2                                   |
| Bad conditions (combat, bad weather, swamp)           | −3                                   |
| Terrible conditions (fire, severe storm)              | −4                                   |
| No medical supplies                                   | −3                                   |
| Improvised medical supplies                           | −1                                   |
| Wireless medkit/autodoc                               | +Rating                              |
| Applying medical care remotely through medkit/autodoc | −2                                   |
| Assistance                                            | As Teamwork Test (p. 49)             |
| Uncooperative patient                                 | −2                                   |
| Patient is Awakened or Emerged                        | −2                                   |
| Patient has implants                                  | −1 per 2 full points of lost Essence |

### Magical Healing

Heal spell: each hit from Spellcasting Test heals 1 box of Physical damage (up to spell's Force). Sorcery cannot heal magical Drain. First Aid and Heal spell both directly remove damage boxes and can only be applied once per set of wounds. Heal can be applied after First Aid, but First Aid cannot be applied after Heal.

### Physical Damage Overflow and Stabilization

Characters in overflow are at risk of dying. Without stabilization: take additional box every (Body) minutes. Stabilize with First Aid + Logic [Mental] (3) Test or Medicine + Logic [Mental] (3) Test. Stabilize spell (p. 289) can also be used. If stabilized, no further automatic damage. Failed stabilization attempts: each attempt after the first suffers cumulative −2 dice pool. Once stabilized, normal healing may be applied. If overflow exceeds Body before stabilization, character dies.

> **Cross-reference:** Stabilize spell (p. 289); Heal spell (p. 288); Full Condition Monitor details (p. 170).

---

## Tables

- **Initiative Attribute Chart** — Initiative type, dice formula, and base initiative dice by combat mode (Physical/Astral/Matrix cold-sim/Matrix hot-sim/Rigging AR). See `combat.json: initiative-attribute-chart`.
- **Combat Actions Table** — Free/Simple/Complex/Interrupt actions list. See `combat.json: combat-actions`.
- **Reloading Weapons Table** — Reload method, result, and action type. See `combat.json: reloading-weapons`.
- **Movement Table (Metatype Walk/Run/Sprint)** — Walk Rate, Run Rate, Sprint Increase by metatype group. See `combat.json: movement-rates-metatype`.
- **Environmental Modifiers Table** — Visibility, Light/Glare, Wind, Range, and combined modifier. See `combat.json: environmental-modifiers`.
- **Environmental Compensation Table** — System/accessory and effect on modifier categories. See `combat.json: environmental-compensation`.
- **Situational Modifiers Table (Ranged)** — Attacker dice pool modifiers by situation. See `combat.json: situational-modifiers-ranged`.
- **Firing Mode Table** — Mode, defense modifier, rounds used, notes. See `combat.json: firing-mode-table`.
- **Scatter Table** — Projectile type and scatter dice formula. See `combat.json: scatter-table`.
- **Melee Modifiers Table** — Situation and dice pool modifier for melee. See `combat.json: melee-modifiers`.
- **Defense Modifiers Table** — Situation and dice pool modifier for defense. See `combat.json: defense-modifiers`.
- **Range Table** — Weapon categories and Short/Medium/Long/Extreme ranges in meters. See `combat.json: range-table`.
- **Barrier Ratings Table** — Barrier type, Structure, and Armor. See `combat.json: barrier-ratings`.
- **Damaging Barriers Table** — Weapon type and DV modifier when attacking barriers. See `combat.json: damaging-barriers`.
- **Fire Armor Penetration Table** — Type of fire and AP value. See `combat.json: fire-armor-penetration`.
- **Environment & Fatigue Table** — Severity and fatigue damage interval. See `combat.json: environment-fatigue`.
- **Vehicle Test Threshold Table** — Situation, threshold, and examples. See `combat.json: vehicle-test-threshold`.
- **Terrain Modifiers Table** — Terrain type and modifier to vehicle test threshold. See `combat.json: terrain-modifiers`.
- **Vehicle Test Modifier Table** — Situation and modifier for vehicle tests. See `combat.json: vehicle-test-modifiers`.
- **Movement Rates Table (Vehicles)** — Speed Attribute to Walking/Running Rate in m/turn. See `combat.json: vehicle-movement-rates`.
- **Ramming Damage Table** — Speed in m/turn and Damage Value formula. See `combat.json: ramming-damage`.
- **Chase Ranges Table** — Range, Speed Environment approx. distance, Handling Environment approx. distance. See `combat.json: chase-ranges`.
- **Healing Modifiers Table** — Situation and modifier for healing/medicine tests. See `combat.json: healing-modifiers`.
- **Sensor Defense Table** — Defender type and defense test formula. See `combat.json: sensor-defense`.
- **Signature Table** — Target size and modifier applied to detecting vehicle's dice pool. See `combat.json: signature-table`.

---

## Validation Checklist

- [ ] Initiative Score formula: Initiative Attribute + Initiative Dice roll ≥ 1
- [ ] After each pass, subtract exactly 10 from all Initiative Scores; only scores > 0 get another Action Phase
- [ ] ERIC tiebreaker order: Edge, Reaction, Intuition, then coin toss
- [ ] Wound modifier applies to Initiative Attribute immediately on injury (not next turn)
- [ ] Full Defense costs −10 Initiative Score; Block/Dodge/Parry cost −5
- [ ] Full Defense adds Willpower to all Defense Tests for the entire Combat Turn (not per test)
- [ ] Run rate is total for Combat Turn (all passes combined), not per pass
- [ ] Armor encumbrance: every 2 full points of accessory bonus exceeding Strength = −1 Agility and −1 Reaction
- [ ] AP reducing Armor to ≤ 0: lose all armor dice, do not subtract from Body
- [ ] Physical CM = (Body ÷ 2, round down) + 8; Stun CM = (Willpower ÷ 2, round down) + 8
- [ ] Stun overflow: every 2 excess Stun boxes → 1 Physical box
- [ ] Quick Draw threshold: 3 normally, 2 with quick-draw holster
- [ ] Take Aim max bonus = Willpower ÷ 2 (round up); lost if any action taken before attacking
- [ ] Each Take Aim gives +1 dice pool OR +1 Accuracy (not both per action — but player chooses per action)
- [ ] Recoil compensation = 1 + STR ÷ 3 (round down) + weapon RC
- [ ] FA Complex = 10 bullets; FA/LB Simple = 6 bullets; BF/SB = 3 bullets; SA/SS = 1 bullet
- [ ] Suppressive Fire consumes 20 rounds; ignores recoil; Reaction + Edge (3) Test for targets in zone
- [ ] Grazing hit (tie on Opposed Test) = contact but no damage (contact-only effects still apply)
- [ ] Net hits from attack add to base DV before comparing to modified Armor (Physical vs. Stun determination)
- [ ] Called shots: always −4 dice pool + costs a Free Action
- [ ] Knockdown triggers when damage after resistance exceeds Physical limit, or when 10+ boxes taken in a single resistance test
- [ ] Grenade scatter: direction 2D6 per Scatter Diagram; distance = scatter dice − attack hits (minimum 0)
- [ ] Grapple established when STR + net hits > defender's Physical limit
- [ ] Melee Reach: net difference is modifier to defender's dice pool (negative = attacker advantage)
- [ ] Vehicle Condition Monitor = 12 + (Body ÷ 2, round down); Drone = 6 + (Body ÷ 2, round down)
- [ ] Vehicles ignore Stun damage; electricity is always Physical for vehicles
- [ ] Crash damage: Body, resisted by Body + Armor −6 AP; Stun if vehicle Body < character Armor, Physical if ≥
- [ ] Ramming: rammed vehicle Body + net hits; rammer takes half Body; both resist with Body + Armor −6 AP
- [ ] Natural Stun recovery: Body + Willpower Extended Test, 1 hour rest, each hit = 1 box
- [ ] Natural Physical recovery: Body × 2 Extended Test, 1 day rest; cannot proceed while Stun exists
- [ ] First Aid: only within 1 hour of damage; only once per set of wounds; not after magical healing
- [ ] Magical healing (Heal spell): up to Force boxes healed; cannot heal Drain
- [ ] Stabilization: First Aid + Logic [Mental] (3) or Medicine + Logic [Mental] (3); cumulative −2 per subsequent attempt
- [ ] Physical overflow kills when overflow > Body, without stabilization

---

## Implementation Notes

- The `InitiativeScore` on a character should be a computed/tracked field separate from `InitiativeAttribute`. The Score changes during combat; the Attribute does not (unless augmentation changes).
- Wound modifier is a derived value from the total boxes filled across both condition monitors (1 per 3 boxes). It must be recomputed whenever condition monitors change and applied immediately to Initiative Score.
- Recoil is a per-character cumulative value, not per weapon. Implement as a `cumulativeRecoil` counter that resets when the character takes any non-shooting Simple or Complex Action, or is forced to do so.
- The Physical vs. Stun damage determination happens at Step 3B: compare modified DV (weapon DV + net hits) to modified Armor (Armor + AP). This is distinct from the Damage Resistance roll.
- Take Aim bonuses are fragile: cleared by any non-Aim action including Free Actions. The implementation should track `pendingAimBonus` and zero it if any other action is declared.
- Full Defense Willpower bonus lasts the entire Combat Turn (until Initiative Scores are subtracted at pass end), not just one test. Store as a Combat Turn flag, not a single-use flag.
- `callShot` modifiers are additive with other situational modifiers, and the Free Action cost must be tracked as consumed when the shot is declared.
- Multiple Attacks: dice pool is calculated first (with all modifiers including full recoil), then split evenly (rounding down for odd dice going to attacks at GM discretion). Limit applies per attack from the split pool.
- Barriers have their own Condition Monitor (boxes = Structure rating per square meter). Track barrier damage separately; holes created when damage exceeds Structure increment.
- Chase Ranges are abstract brackets, not exact distances. The `changeRange` action modifies the bracket by one step per hit over threshold, not by meters.
- Healing is an Extended Test: record partial hits across multiple intervals in case the process is interrupted. Do not auto-complete healing in a single resolution.
- Suppressive fire defense (Reaction + Edge [3]) uses full Edge rating regardless of spent Edge points. This is an exception to the normal Edge expenditure rules.
