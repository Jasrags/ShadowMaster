# Shadowrun Concepts

**Source:** SR5 Core Rulebook, pp. 44–57
**PDF Pages:** 46–59
**Located:** "Shadowrun Concepts" — PDF pages 46–59 (Book pages 44–57)

---

## Overview

This section defines the foundational mechanical concepts for Shadowrun Fifth Edition: the dice system (hits, thresholds, glitches), all test types (Success, Opposed, Extended, Teamwork), the four components of every test (type, dice pool, limit, threshold), character building blocks (metatype, attributes, skills, qualities), combat structure (Combat Turns, actions), condition monitors, the Edge meta-resource, and an overview of major subsystems (Magic, Matrix, AR/VR, Gear, Cyberware, Bioware, Contacts, Lifestyle).

---

## Rules

### Dice Pool

A dice pool is the number of six-sided dice (d6) rolled for a test. It is usually Skill Rating + Linked Attribute Rating. Notation like "3D6" means three six-sided dice.

### Hits

A **hit** is any die result showing a **5 or 6**. The total number of hits on a roll determines success and degree of success.

### Thresholds

A **threshold** is the minimum number of hits required to succeed at a test. Thresholds vary by difficulty; reference the **Success Test Thresholds** table. In Opposed tests there is no fixed threshold — you must beat the opponent's hit count.

### Net Hits

**Net hits** = hits rolled minus the threshold (or opponent's hits in an Opposed test). Net hits above the minimum add positive effects (e.g., extra damage). The gamemaster may reward 4+ net hits with an additional small bonus at their discretion.

### Buying Hits

- Count 1 hit per 4 dice in the pool, rounded down.
- This is all-or-nothing: you either buy all hits or roll all dice — no mixing.
- Requires gamemaster approval.
- Must not be used when there is any risk of a glitch or critical glitch that could significantly affect the game.
- The Rule of Six does not apply when buying hits.

### Glitches

A **glitch** occurs when **more than half** the dice in the pool show a **1**. A glitch causes a complication — severity and nature are at gamemaster discretion — but should not catastrophically end the action.

- A successful roll can still glitch; the success stands but an additional complication occurs.
- A glitch on an Extended test reduces accumulated hits by 1D6 (if total drops to 0 or below, the test fails).

### Critical Glitch

A **critical glitch** occurs when the player rolls a glitch (more than half the dice show 1) **and** achieves **zero hits**. The consequences are severe and potentially life-threatening. The gamemaster determines the specific outcome.

- Edge (Close Call function) can downgrade a critical glitch to a glitch, or negate a glitch entirely. A single Edge point cannot do both.
- A critical glitch on an Extended test causes immediate test failure with all accumulated hits lost.

### Tests — Four Required Components

Every test requires knowing four things:

1. **Test type** (Success, Opposed, Extended, or Teamwork)
2. **Dice pool** (usually Skill + Attribute)
3. **Limit** (maximum countable hits)
4. **Threshold** (target hit count; absent in Opposed tests)

### Limits

Two types of limits exist:

**Inherent limits** — derived from attributes at character creation (p. 62):

- **Physical limit** = `[(STR × 2) + BOD + REA] ÷ 3`, rounded up
- **Mental limit** = `[(LOG × 2) + INT + WIL] ÷ 3`, rounded up
- **Social limit** = `[(CHA × 2) + WIL + Essence] ÷ 3`, rounded up

> **Cross-reference:** Inherent limit formulas are defined on p. 51; exact formulas confirmed in character creation, p. 62.

**Gear limits** — a piece of gear's relevant rating (e.g., a firearm's Accuracy) overrides the inherent limit for tests involving that gear, whether higher or lower.

- Limits apply only to tests using a dice pool derived from a skill + attribute. Tests rolling a single attribute or two attributes do not use limits.
- Using Edge (Push the Limit) allows a character to ignore the limit for a single test.

### Test Notation

Tests are written in the format:

```
Skill + Attribute [Limit] (Threshold) Test Type
```

Example: `PERCEPTION + INTUITION [MENTAL] (2) TEST`
Extended: `Automotive Mechanic + Logic [Mental] (10, 1 hour) Extended Test`

### Success Tests

A **Success test** (also called a Simple test) resolves a single momentary action against a fixed threshold. Roll the dice pool, count hits, compare to threshold. Notation includes a threshold in parentheses.

> **Cross-reference:** Skill list with linked attributes, p. 151.

### Opposed Tests

An **Opposed test** pits two parties rolling their respective dice pools simultaneously. No fixed threshold — the side with more hits wins. In a tie, the acting character (initiator) wins.

- The opposing side may roll the same skill + attribute combination as the initiator, or a different one; the test description specifies which.
- Opposed test notation has no threshold in parentheses.

> **Cross-reference:** Specific opposed test combinations, p. 128 (Using Skills).

### Extended Tests

An **Extended test** accumulates hits across multiple sequential rolls against a high threshold. Each roll:

1. Count hits up to the limit (unless using Edge to bypass limit).
2. Add to running total.
3. Remove one die from the pool.
4. Repeat until threshold is met, dice run out, or time runs out.

Extended test notation: `Skill + Attribute [Limit] (Threshold, Interval) Extended Test`

- The **interval** is the real- or game-time between rolls.
- Extended tests can be paused and resumed; accumulated hits persist.
- Each successive roll costs one die from the pool; when the pool reaches zero dice, the test ends in failure.
- Rounding rule: always round up unless a specific rule states otherwise.

> **Cross-reference:** Extended Test Thresholds table and Extended Test Intervals table — see JSON file.

### Extended Tests and Glitches

- Glitch on an Extended test: gamemaster may reduce accumulated hits by 1D6. If total ≤ 0, test fails.
- Critical glitch on an Extended test: test immediately fails; all accumulated hits are lost.

### Teamwork Tests

One character is designated **leader**; all others are **assistants**.

1. Each assistant rolls the appropriate Skill + Attribute.
2. For each assistant hit: the leader's applicable limit increases by 1.
3. For each assistant hit: add 1 die to the leader's dice pool.
4. Maximum dice added to the leader's pool = the leader's rating in the applicable skill, or the highest attribute if the test involves two attributes.
5. The leader then rolls the adjusted pool against the threshold.

- An assistant rolling a **critical glitch**: the leader receives no limit or dice adjustments from that assistant (in addition to normal critical glitch effects).
- An assistant rolling a **glitch** (non-critical): that assistant contributes no limit adjustment.

### Trying Again (Re-tests)

Retrying a failed test is allowed but incurs a cumulative **–2 penalty** on each retry. If a character takes a sufficient break (gamemaster determines duration), they may restart with no penalty. Each distinct attack or action attempt is its own test, not a retry of a previous failure.

### Combat Turns

Combat is structured in **Combat Turns**, each lasting approximately 3 seconds. Each Combat Turn, every participant selects and takes actions in Initiative Score order.

> **Cross-reference:** Full combat rules, p. 163.

### Actions

Three types of actions exist per Combat Turn:

- **Free Actions** — minimal effort (e.g., speak a short phrase)
- **Simple Actions** — one discrete task
- **Complex Actions** — tasks requiring full attention

> **Cross-reference:** Full action list, p. 163.

### Metatype

Characters belong to one of five metatypes: **Human**, **Elf**, **Dwarf**, **Ork**, or **Troll**. Each has different attribute ranges and special traits.

> **Cross-reference:** Metatype attribute ranges, p. 65; full creation rules, p. 62.

### Attributes

Attributes are numerical ratings (1–6 for humans; metatypes vary) divided into three groups:

**Physical Attributes:**

- **Body (BOD):** Physical health, damage resistance, poison/disease resistance.
- **Agility (AGI):** Coordination, nimbleness, combat accuracy.
- **Reaction (REA):** Reflexes, awareness; contributes to Initiative and defense.
- **Strength (STR):** Raw power; determines melee damage and carrying capacity.

**Mental Attributes:**

- **Willpower (WIL):** Adversity resistance, spellcasting drain resistance.
- **Logic (LOG):** Rational processing; used for technical tasks and drain resistance (hermetic mages).
- **Intuition (INT):** Gut instinct; used for Initiative and perception.
- **Charisma (CHA):** Social influence; used for shamanic drain resistance.

**Special Attributes** (not all characters have ratings in all of these):

- **Essence (ESS):** Starts at 6; reduced permanently by cyberware/bioware. Caps augmentation capacity. Each point lost also reduces Magic or Resonance by 1. Factors into Social limit calculation.
- **Edge (EDG):** Luck/meta-resource; see Edge rules below.
- **Magic (MAG):** Required for spellcasting and adept abilities. Rating of 0 = not Awakened.
- **Resonance (RES):** Required for technomancers. Rating of 0 = not Emerged.

> **Cross-reference:** Attribute ranges by metatype, p. 65.

### Initiative

**Initiative attribute** = Reaction + Intuition (base value).

**Initiative Score** = Roll Initiative attribute + Initiative Dice, sum all results.

**Initiative Dice:** Everyone has 1 base die; gear, spells, adept powers can add up to 4 more (maximum 5 total). Hackers in the Matrix may have different totals (see p. 214).

> **Cross-reference:** Full Initiative rules, p. 159.

### Condition Monitors

Two Condition Monitors track damage:

- **Physical Condition Monitor:** Boxes = `(BOD ÷ 2, rounded up) + 8`
- **Stun Condition Monitor:** Boxes = `(WIL ÷ 2, rounded up) + 8`

Boxes are arranged in rows of 3. When a complete row is filled, the character takes a **–1 penalty to all tests** (stacks for each filled row).

> **Cross-reference:** Healing rules, p. 205.

### Skills

Skills have ratings linked to a specific attribute. Dice pool = Skill rating + Linked attribute rating.

**Defaulting:** Characters without ranks in a skill may still attempt the test using only the linked attribute –1 (i.e., roll Attribute – 1 dice). Some skills cannot be defaulted; these are listed in italics on the skill table (p. 151).

Two categories:

- **Active skills:** Things the character does (combat, hacking, piloting, etc.)
- **Knowledge skills:** Facts and information; includes languages.

> **Cross-reference:** Full skill list by linked attribute, p. 151.

### Qualities

Qualities modify character capabilities. Purchased at character creation with Karma:

- **Positive Qualities:** Bonuses; cost Karma to acquire.
- **Negative Qualities:** Penalties; provide additional Karma at creation.

> **Cross-reference:** Full quality descriptions, p. 71.

### Magic

Magic users must have the Magic (MAG) special attribute. Types of Awakened characters:

- **Mages:** Cast spells affecting the world in various ways.
- **Adepts:** Channel mana into physical and mental enhancements.
- **Mystic Adepts:** Split Magic rating between spellcasting and adept powers.
- **Aspected Magicians:** Specialized subset of mage or shaman abilities.

> **Cross-reference:** Full magic rules, p. 276.

### Matrix — Augmented Reality (AR)

AR overlays multimedia information on the physical world via AROs (Augmented Reality Objects). Requires a commlink, cybereyes, eyeglasses, or goggles to perceive. AR allows Matrix interaction while remaining physically present in meatspace.

### Matrix — Virtual Reality (VR)

Full immersion in the Matrix. Provides faster reaction time and full sensory feedback. Required gear: a VR-capable device (datajack, trode net, etc.). Hackers and riggers prefer VR for most heavy Matrix work.

### Gear

Physical equipment used by shadowrunners. Key categories: firearms, melee weapons, armor, surveillance, commlinks, cyberdecks, explosives. Gear often provides its own limit stat that overrides inherent limits for relevant tests.

> **Cross-reference:** Street Gear chapter, p. 416.

### Cyberware

Mechanical/electronic augmentations installed in the body. Benefits include combat enhancement, sensory upgrades, and speed improvements. Every piece of cyberware reduces **Essence** permanently. Essence loss also reduces Magic or Resonance rating point-for-point.

Three grades with different Essence costs:

- **Alphaware:** Standard; reduced Essence loss vs. standard.
- **Betaware:** Further reduced Essence loss; not available at character creation.
- **Deltaware:** Minimal Essence loss; not available at character creation.

> **Cross-reference:** Cyberware rules and grades, p. 451.

### Bioware

Organic augmentations grown from biological materials. Less Essence impact than equivalent cyberware, but more expensive and harder to acquire. Still reduces Social limit via Essence. **Cultured bioware** uses the character's own cells for minimal Essence loss at extreme cost.

### Contacts

Contacts are NPCs with two special ratings:

- **Loyalty:** Closeness of personal relationship. Range: 1–6.
- **Connection:** How well-connected the contact is. Range: 1–12.

Contacts are purchased during character creation (p. 98). Post-creation contacts must be earned through play. Contacts do not need to like the character; they only need to see benefit in the relationship.

> **Cross-reference:** Contact rules and sample contacts, p. 386.

### Lifestyle

Lifestyle represents monthly living expenses. Ranges from Squatter to Luxury.

> **Cross-reference:** Lifestyle costs and details, p. 373.

### Edge

Edge is a meta-resource representing luck. The Edge **attribute** = maximum Edge points. Spent Edge points are temporarily unavailable (not permanently lost unless burned). A character cannot spend more than 1 Edge point on a single test or action.

### Edge Effects (Spending Edge)

All Edge effects cost 1 point unless noted as Burning Edge:

- **Push the Limit:** Add Edge rating as extra dice to the test (before or after rolling). Triggers the **Rule of Six** (each 6 is a hit and is re-rolled; additional hits from re-rolls also count). Allows ignoring the limit for that test.
- **Second Chance:** Re-roll all dice that did not score a hit. Cannot be used to negate glitches or critical glitches. Does not use Rule of Six. Has no effect on limits.
- **Seize the Initiative:** Move to the top of Initiative order regardless of Initiative Score. If multiple characters use this in the same Combat Turn, they go first in descending Initiative Score order; the effect lasts the full Combat Turn (all Initiative Passes). Returns to normal Initiative position at the start of the next Combat Turn.
- **Blitz:** Roll maximum of 5 Initiative Dice for a single Combat Turn.
- **Close Call:** Either negate all effects of one glitch, or downgrade one critical glitch to a regular glitch. Cannot do both with a single Edge point.
- **Dead Man's Trigger:** When about to fall unconscious or die, spend 1 Edge to make a Body + Willpower (3) test. On success, may spend any remaining actions before blacking out.

> **Ambiguity:** "Before or after the roll" for Push the Limit — the text says "either before or after the roll." Confirm with p. 56 for any timing restrictions relative to declaring other Edge uses.

### Burning Edge (Permanent Edge Loss)

Burning Edge permanently reduces Edge attribute by 1 (recoverable later only by spending Karma to raise the attribute). Two uses:

- **Smackdown:** Automatically succeed at an action the character is capable of performing, counting as 4 net hits. Limits do not apply — the character gets 4 net hits regardless of the applicable limit. Cannot be used for skills the character cannot default on if they have no ranks.
- **Not Dead Yet:** Prevent death from a normally fatal action. The character survives the event at the gamemaster's discretion (bullet still hits, grenade still detonates), but maintains a thin thread of life allowing others to stabilize them.

### Regaining Edge

A character regains 1 Edge point after:

- A fulfilling meal and a good night's sleep (at least 8 hours).
- Gamemaster award for: good roleplaying, heroic self-sacrifice, achievement of important personal goals, enduring a critical glitch without Close Call, succeeding in an important objective, bravery, intelligence, advancing the story, humor, or drama.

Regaining Edge restores spent points only — cannot exceed the Edge attribute maximum.

---

## Tables

| Table Name               | Description                                                      | Reference                                              |
| ------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------ |
| Success Test Thresholds  | Difficulty labels (Easy–Extreme) mapped to hit thresholds 1–10   | `shadowrun-concepts.json` → `success-test-thresholds`  |
| Extended Test Thresholds | Difficulty labels mapped to higher cumulative thresholds (6–30+) | `shadowrun-concepts.json` → `extended-test-thresholds` |
| Extended Test Intervals  | Task labels (Fast–Mammoth) mapped to time intervals per roll     | `shadowrun-concepts.json` → `extended-test-intervals`  |

---

## Validation Checklist

- [ ] A die showing 5 or 6 counts as exactly 1 hit; no die can count as more than 1 hit on a standard roll.
- [ ] Buying hits: `floor(dicePool / 4)` hits, all-or-nothing, requires GM approval, invalid when glitch risk is meaningful.
- [ ] Glitch condition: `ones > floor(dicePool / 2)` (strictly more than half).
- [ ] Critical glitch condition: glitch condition is true AND total hits = 0.
- [ ] Limit caps applied after counting hits: if hits > limit, hits = limit (unless Edge Push the Limit is active).
- [ ] Physical Condition Monitor: `ceil(BOD / 2) + 8` boxes.
- [ ] Stun Condition Monitor: `ceil(WIL / 2) + 8` boxes.
- [ ] Each filled row of 3 boxes on a Condition Monitor applies exactly –1 penalty to all tests.
- [ ] Essence starts at exactly 6 for all characters.
- [ ] Each point of Essence lost reduces Magic or Resonance by 1 (whichever applies; non-Awakened/non-Emerged characters are unaffected).
- [ ] Initiative attribute = REA + INT (before dice).
- [ ] Maximum Initiative Dice = 5 total (base 1 + up to 4 from sources).
- [ ] Teamwork test: max dice added to leader = leader's skill rating (or highest attribute if two attributes involved).
- [ ] Retry penalty: cumulative –2 per retry; resets to 0 after sufficient break.
- [ ] Extended test glitch: reduce accumulated hits by 1D6; if total ≤ 0, test fails.
- [ ] Extended test critical glitch: immediate test failure, all accumulated hits lost.
- [ ] Edge spend: maximum 1 point per test/action.
- [ ] Close Call cannot both negate a glitch and downgrade a critical glitch with a single Edge point.
- [ ] Burning Smackdown: exactly 4 net hits, limits ignored, character must be capable of the action.
- [ ] Contact Loyalty range: 1–6. Contact Connection range: 1–12.
- [ ] Physical limit formula: `ceil((STR × 2 + BOD + REA) / 3)`
- [ ] Mental limit formula: `ceil((LOG × 2 + INT + WIL) / 3)`
- [ ] Social limit formula: `ceil((CHA × 2 + WIL + Essence) / 3)`

---

## Implementation Notes

- **Limit application:** Limits are enforced at the point of counting hits from a roll, not before rolling. Store raw hit count and effective hit count (min of raw hits and limit) separately to support net hits calculation and Edge interactions.
- **Edge state:** Track spent Edge as a separate counter from the Edge attribute. The attribute is the ceiling; spent points are not subtracted from the attribute value until Burning Edge occurs (which permanently lowers the attribute itself).
- **Rule of Six:** Only triggers with Push the Limit or when explicitly stated. On a re-roll from Rule of Six, each additional 6 triggers another re-roll. Implement as a recursive loop capped by practical limits (or a while loop checking for 6s).
- **Glitch detection:** Evaluate `ones > Math.floor(dicePool / 2)` on the raw dice array before any hits are counted or limits applied.
- **Extended tests:** Model as a mutable accumulator (current hits, current pool size, interval timer). Pool decreases by 1 after each roll regardless of outcome.
- **Teamwork limit increase:** Apply limit bonus from assistants before the leader rolls; the bonus is the count of assistant hits, not the number of assistants.
- **Defaulting:** When a character has 0 ranks in a skill and the skill allows defaulting, the dice pool = linked attribute – 1 (minimum 1 die). Skills marked as no-default cannot be attempted without at least 1 rank.
- **Condition monitor rows:** Penalties apply per completed row of 3, not per individual filled box. Track box count and compute `floor(filledBoxes / 3)` for penalty.
- **Essence and Social limit:** Essence is a floating-point value (cyberware reduces it by fractional amounts); Social limit must use current Essence value in its formula.
- **Seize the Initiative timing:** This Edge effect changes turn order for the remainder of the current Combat Turn only; reset to calculated Initiative Score at the start of the next Combat Turn.
- **Dead Man's Trigger test:** `Body + Willpower (3) test` — this is a Success test with threshold 3, no limit specified (inherent Physical limit applies).
