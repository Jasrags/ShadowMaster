# Shadowrun 5E Special Combat Actions Reference

## Overview

This document covers special combat actions including surprise, interception, knockdown, subduing, multiple attacks, called shots, and the dead man's trigger.

---

## Surprise

Sometimes things happen when you least expect them. Surprise simulates those moments you didn't see coming.

### What Can Be Surprised

- All characters and critters can be surprised
- **Cannot be surprised:** non-sentient objects (astral barriers, foci, programs, IC, bricks)

### When Surprise Occurs

- Surprise occurs on a **character-by-character basis**
- A character walking into an ambush may be surprised by one enemy but not another
- Not all characters in a team may be surprised by the same events
- Surprise normally occurs at the **beginning of combat**
- Can also occur **within a Combat Turn** if unexpected forces enter the fray

### Surprise and Perception

Surprised characters are unaware that danger is imminent. This occurs because:

1. They failed to perceive something (didn't get enough hits to notice the concealed sniper)
2. The GM decides they didn't have a chance to perceive it (walked into a room full of armed guards)

**Perception Check:**
In some circumstances, GMs may give a character a chance to be alerted via a secret Perception Test. Success means the character:

- Hears approaching footsteps
- Notices the smell of cigarette vapor
- Gets that "tingly feeling" that someone is behind them

**Alert Bonus:** Characters who succeed receive a **+3 bonus** on their Surprise Test.

**Combat Sense:** Anyone with Combat Sense spell or Adept power **always** gets a Perception Test, but can still be surprised if they don't receive enough hits.

### Surprise Tests

**All participants** must make a Surprise Test:

```
Reaction + Intuition (3)
```

**Modifiers:**

- Characters who have been alerted: **+3 dice pool modifier**
- Surprise Tests have **no Limit**

**Results:**

| Result          | Effect                                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Success         | Character acts normally                                                                                                                             |
| Failure         | Lose 10 from Initiative Score; considered surprised until next Action Phase; **no Defense Test** when attacked                                      |
| Glitch          | Can still react, but startles (jump, knock into something, drop something held)                                                                     |
| Critical Glitch | Completely stunned; does not act for the first Action Phase; if entering combat after, receives both -10 for failure AND -10 for entering mid-fight |

**Edge Option:** Spending a point of Edge avoids surprise. Still lose Initiative Score points, but can use defense rolls.

### Ambushing

Characters who plan an ambush and delay their actions while lying in wait receive:

- **+6 dice pool modifier** on the Surprise Test
- **Automatically not surprised** by characters they are ambushing (if aware of target's movement/actions)

**Ambusher Unaware:**
If the ambusher is unaware of their prey's activities (waiting for someone to enter a room, watching for a spirit to materialize):

- Still receives the **+6 modifier**
- **Must still check for surprise** as they may not be ready when target appears

**Note:** If an ambushed character gets a higher Initiative Score than the ambushers, they can act first.

### Surprise in Combat

When new characters are unexpectedly introduced to an ongoing combat:

- **All characters** (existing and new) must make Surprise Tests
- If any are surprised, adjust Initiative Scores
- Return to regular Combat Turn
- Surprised characters cannot make defense rolls during this Action Phase

### Effects of Surprise

Surprised characters **cannot:**

- Take any actions that directly affect, impede, or counteract non-surprised characters
- Attack non-surprised characters
- Dodge or defend against attacks from non-surprised characters
- React to the other characters' actions in any way
- React to friendly warnings (can't "duck" when friend shouts warning)

Surprised characters **can:**

- Carry out other actions not specifically directed at surprising characters
- Drop prone
- Ready a weapon (but not fire it)

---

## Interception

If movement takes a character within one meter (+1 meter per point of Reach) of an opponent, and the character attempts to pass without attacking:

### Intercepting

- Opponent can use an **Interrupt Action**
- **Cost:** Voluntarily decrease Initiative Score by 5
- Make a melee attack against the passing character

**Weapon Options:**

- If melee weapon ready: use normal melee weapon skill
- Otherwise: use Unarmed Combat skill
- If wielding firearm: can use weapon as club (Clubs skill)

This attack follows normal Melee Combat rules.

### Interception Success

If after the Resistance Test the passing character takes damage **equal to their Body**:

- Character is **intercepted**
- **Cannot continue movement**

**Note:** Prone combatants cannot intercept.

### Avoiding Interception

Agile characters can avoid Interception attempts without engaging in combat:

**Test:**

```
Agility + Gymnastics (1) [Physical]
```

- Uses a **Complex Action** with their movement
- Each hit above the threshold allows the character to move past **one opponent**

---

## Knockdown

Characters who take damage may be knocked down by the attack or its staggering effects.

### Automatic Knockdown

If a character takes boxes of damage (Stun or Physical, after Damage Resistance Test) from a single attack that **exceed their Physical limit**:

- Attack automatically knocks them down
- Acts as a forced, free **Drop Prone** action

**Absolute Threshold:** Any character who takes **10 or more boxes** of damage after a Resistance Test in a single attack is **always** knocked down.

### Special Knockdown Weapons

Certain less-than-lethal weapons are specifically designed to knock a target down:

- **Gel rounds:** Reduce the Physical limit of the character by **2** when comparing to DV for knockdown

### Intentional Knockdown (Called Shot)

A character making a melee attack may attempt to intentionally knock their opponent down using a Called Shot (see Called Shots section).

---

## Subduing

Sometimes characters need to subdue an opponent without beating them into unconsciousness.

### Initiating a Grapple

Resolve melee combat normally using the **Unarmed Combat skill**.

**If the attacker successfully hits:**

Compare:

```
Attacker's Strength + Net Hits vs. Defender's Physical Limit
```

If attacker's total **exceeds** defender's Physical limit:

- Attacker **grapples and immobilizes** the defender
- This subduing attack causes **no damage** to the defender

### While Subdued

- Defender is considered **prone** for any attacks made against them
- Defender **cannot take any actions requiring physical movement**
- Grappling character does not need to make tests to maintain the grapple
- Grappler must spend **one Complex Action per Action Phase** to hold the position

### Breaking Free

Defender must take a **Complex Action** and succeed in:

```
Unarmed Combat + Strength [Physical]
Threshold = Attacker's original grappling net hits
```

Success: Defender escapes the grapple.

### Grappler Options

Each Complex Action spent to maintain the grapple, the grappler may also choose ONE:

#### Improve Grip

- Make an additional Unarmed Combat Attack Test
- Defender opposes as normal
- Attacker gets **Superior Position bonus (+2)**
- If attacker scores more hits: net hits added to previous grappling net hits
- If defender scores more hits: reduce attacker's net hits (grip is slipping)

#### Inflict Damage

- Inflict **Stun Damage** with DV equal to grappler's **Strength**
- Requires no test
- Defender resists as normal
- **Armor applies**

#### Knockdown

- Follow rules for Called Shots knockdown
- Attacker gets **Superior Position bonus (+2)**

---

## Multiple Attacks

Characters can attack more than once in a single Action Phase by using the **Multiple Attacks Free Action**.

### How It Works

1. Calculate attacker's dice pool with **all modifiers** (Wound, Environmental, Situational, and **full recoil of all attacks** if ranged)
2. **Split the pool** as evenly as possible between all attacks
3. Each attack is handled **separately**

**Warning:** As dice pools get smaller, chances of a glitch rise.

### Edge Usage

- Dice gained by spending Edge applies **before** the pool is split
- Dice from both pools can be re-rolled with a **single use of Edge**

### Attack Limit

Total number of attacks in a single Action Phase is limited to:

```
Maximum Attacks = 1/2 Attacker's Combat Skill (round down)
```

---

## Called Shots

Sometimes just taking a normal shot isn't enough. Called shots allow specific targeting or special maneuvers.

### General Rules

- **Cost:** -4 dice pool penalty + Free Action (in addition to basic attack action)
- GM determines which options are allowed in their game

### Called Shot Options

#### Blast Out of Hands

- Knock an item out of target's hand
- Target takes **no damage**
- Normal -4 modifier plus situational modifiers (wounds, lighting, range)
- Defender rolls as normal
- Item sent flying, coming to rest **(net hits)** meters from defender
- Item travels away from the shooter

#### Dirty Trick

Shooting plasterboard to kick up dust, kicking dirt in opponent's eyes, etc.

- If attack succeeds with even **one net hit**
- Opponent takes **-4 dice pool modifier** on their next action

#### Harder Knock

Shoot a gel round into opponent's face, punch someone in the throat, etc.

- Changes damage code on **Stun-based weapons to Physical**
- No other change to DV

#### Knock Down (Melee Only)

Bowl opponent over, sweep feet, pull off balance, etc.

- Must declare intent during Declare Actions
- Make melee attack as normal
- If scoring more hits than defender, compare:

```
Attacker's Strength + Net Hits vs. Defender's Physical Limit
```

- If exceeds: defender is knocked to the ground
- Causes **no damage** to target
- Attacker chooses to follow defender down (free Drop Prone) or stay standing
- **Glitch:** Attacker falls as well
- **Critical Glitch:** Attacker falls while defender stays standing

#### Shake Up

Intentional shot past the ear, skipping rounds off the ground to keep opponent running.

- Target loses **5 from Initiative Score** along with normal damage
- If Initiative Score drops below 0: target loses last Action Phase for this Initiative Pass
- Even if defender **completely resists all damage**, as long as shot hit, they still lose Initiative Score

#### Splitting the Damage

Intentionally shooting the trauma plate on armor, hitting thicker padding, etc.

**Requirements:**

- Target must be wearing armor
- Attacker's AP must be **less than** that armor (can't use with APDS vs armor clothing)

**Effect:**

- Damage is split between the two condition monitors
- If odd damage, Stun Damage is the higher value
- If modified total DV is **less than** modified Armor Value: attack does only half damage, all applied to Stun

#### Trick Shot

Shooting a cigarette out of someone's mouth, tacking opponent's sleeve to wall with a knife, slicing a playing card in midair.

- Usually requires some setup (can't happen mid-combat)
- Standard -4 modifier plus situational modifiers
- Note the number of hits scored
- Those hits act as **positive dice pool modifier** for Intimidation Test made by attacker or known ally after the shot

#### Vitals

Aiming for a particularly vital area (brain, heart, major arteries).

- **Effect:** Extra **+2 DV** on the attack
- These areas are smaller and harder to hit (hence the -4 penalty)

---

## Dead Man's Trigger

A character may perform **one final action** before dying or falling unconscious.

### Requirements (All Three Must Be Met)

1. **Initiative Score of at least 1** for the Combat Turn
   - If all Initiative Score is used up, out of luck

2. **Spend 1 Edge point**
   - This just activates the Dead Man's Trigger
   - Doesn't add extra Edge dice to any tests
   - Character may spend extra Edge to augment tests as normal
   - If no Edge left, out of luck

3. **Succeed in a Body + Willpower (3) Test**
   - This takes place **after** the Edge point is spent

### If Successful

Character may perform **one final action** of any kind:

- **No movement** allowed
- Resolved as normal
- Can be modified by any Free Action as well

---

## Implementation Notes

### For Combat System

- Implement Surprise Tests at combat start and when new combatants enter
- Track "surprised" status per character
- Support interception when characters move past enemies
- Implement grapple state with Complex Action maintenance
- Handle multiple attack dice pool splitting
- Support all called shot variants
- Implement Dead Man's Trigger state check

### For UI

- Display surprise status and Initiative penalties
- Show interception opportunities during movement
- Track grapple state and options
- Visualize dice pool splitting for multiple attacks
- Called shot selection interface
- Dead Man's Trigger prompt when conditions are met

### State Tracking

- Surprise status per character
- Grapple state (who is grappling whom, net hits for escape threshold)
- Called shot declarations
- Multiple attack pool divisions
- Edge spent for Dead Man's Trigger

---

## Reference

- SR5 Core Rulebook pp. 192-196 (Surprise, Interception, Knockdown, Subduing, Called Shots)
- SR5 Core Rulebook p. 195 (Called Shots)
- SR5 Core Rulebook p. 196 (Multiple Attacks, Dead Man's Trigger)
