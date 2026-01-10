# Shadowrun Fifth Edition Attributes Specification

## Overview

Shadowrun 5e characters are defined by a set of primary attributes (physical, mental, and special) plus derived attributes calculated from them. This spec outlines the data structures and rules needed to manage attributes in code. Detailed numeric values (starting ranges, metatype modifiers, derived formulas) will be added as reference data is collected from the core rules.

## Data Model

### PrimaryAttribute

- `name`: string (e.g., "Body", "Agility")
- `abbreviation`: short code (e.g., `BOD`, `AGI`)
- `category`: `physical`, `mental`, or `special`
- `description`: short explanation of what the attribute represents
- `baseRange`: object containing `min` and `max` before modifiers (values TBD per rules)
- `metatypeModifiers`: list of adjustments per metatype (referenced from metatype data)
- `notes`: optional text for unique behaviors (e.g., Edge special handling)

### DerivedAttribute

- `name`: string (e.g., "Reaction", "Essence")
- `formula`: textual representation or expression referencing primary attributes
- `baseValue`: starting value if applicable (e.g., Essence = 6)
- `description`: short explanation of what the derived attribute represents
- `notes`: optional special rules (e.g., reduction from cyberware)

### AttributePriority

- Tracks attribute point totals granted by priority selection.
- Fields: `priority` (A–E), `attributePoints`, `notes`

## Behavior Rules (Initial Draft)

1. **Base Ratings**
   - Primary attributes generally range 1–6 at character creation (before metatype modifiers). Ratings 7+ typically require qualities or augmentations. Exact caps to be documented.
2. **Metatype Modifiers**
   - Apply modifiers from the selected metatype to base attributes after allocation; ensure results stay within metatype limits. (Refer to metatype data once populated.)
3. **Special Attributes**
   - Edge, Magic, and Resonance follow additional rules (e.g., humans Edge bonus, Magic=0 for mundanes). Capture in `notes` pending detailed data.
4. **Derived Attributes**
   - Reaction, Essence, Initiative, etc., are calculated from primary attributes or other values. Document formulas once sourced from rules.
5. **Advancement & Augmentation**
   - Attribute improvement costs, cyberware impacts, and magical adjustments should reference advancement rules once sourced (see [Attributes questions](../questions-and-gaps.md#attributes)).

## Open Items

- See [Attributes questions](../questions-and-gaps.md#attributes) for outstanding data requirements.

## Reference

- SR5 Core Rulebook attribute chapter (pages TBD).
- [Data Tables](../data-tables.md) for priority point values.
- Metatype data (see [Data Tables](../data-tables.md) and related files) once fully populated.

USING ATTRIBUTES

The Shadowrun skill system is designed to be broad in
order to account for as many actions as possible. There
may be occasions, though, where natural abilities are
the closest matching proficiency to a given test. For ex-
ample, if a dozen beast spirits were to suddenly mate-
rialize, claws probing the air for prey, there is not a skill
to help you avoid soiling yourself. However, Charisma
(strength of character) and Willpower (mental forti-
tude) are great for seeing if you maintain some sense
of composure in the face of certain death.

## Attribute-Only Tests

Attribute-only tests are used when no skill applies. The gamemaster determines when they are appropriate and which attribute pairing forms the dice pool. Common pairings include:

- **Composure (`Charisma + Willpower`)**: Determine emotional stability in overwhelming situations. Threshold scales with severity; repeated exposure can negate the need for the test.
- **Judge Intentions (`Charisma + Intuition`)**: Opposed test against target’s `Willpower + Charisma` to gauge trustworthiness or motives. Success provides a general sense; not a guarantee against future betrayal.
- **Lifting / Carrying (`Strength + Body`)**: Base lift = `Strength × 15 kg`; each hit adds 15 kg. Overhead lifts use `Strength × 5 kg` baseline with +5 kg per hit. Carrying capacity = `Strength × 10 kg`; extra weight requires tests (see SR5 p. 420).
- **Memory (`Logic + Willpower`)**: Recall or memorize information. Apply Knowledge Skill Table thresholds. Hits on memorization tests add dice to later recall checks. Glitches cause misremembered details; critical glitches create entirely false memories.

These guidelines should be referenced when implementing tests that rely solely on innate attributes rather than skills.

## _Last updated: 2025-11-08_

## Attribute Data Tables

## Primary Attributes

| Name      | Abbreviation | Category                          | Base Range (Min–Max) | Description                                  | Notes                                              |
| --------- | ------------ | --------------------------------- | -------------------- | -------------------------------------------- | -------------------------------------------------- |
| Body      | BOD          | Physical                          | TODO                 | Physical toughness, resistance to damage.    |                                                    |
| Agility   | AGI          | Physical                          | TODO                 | Coordination, reflexes, and balance.         |                                                    |
| Reaction  | REA          | Physical (derived for initiative) | TODO                 | Reflex speed and evasive ability.            | Often treated as derived; confirm final handling.  |
| Strength  | STR          | Physical                          | TODO                 | Raw muscle power.                            |                                                    |
| Willpower | WIL          | Mental                            | TODO                 | Mental fortitude and resistance.             |                                                    |
| Logic     | LOG          | Mental                            | TODO                 | Analytical and reasoning ability.            |                                                    |
| Intuition | INT          | Mental                            | TODO                 | Instinct, perception, gut reactions.         |                                                    |
| Charisma  | CHA          | Mental                            | TODO                 | Social presence and force of personality.    |                                                    |
| Edge      | EDG          | Special                           | TODO                 | Luck and ability to “push” outcomes.         | Humans receive baseline bonus (see metatype data). |
| Magic     | MAG          | Special                           | TODO                 | Magical aptitude; only for Awakened.         | Mundanes start at 0.                               |
| Resonance | RES          | Special                           | TODO                 | Technomancer connection to the Resonance.    | Non-technomancers start at 0.                      |
| Essence   | ESS          | Special                           | 6 (base)             | Measure of life force; reduced by cyberware. | Typically derived but tracked as a key value.      |

> TODO: Confirm which attributes are strictly primary vs derived in SR5 tables and update accordingly.

## Derived Attributes

| Name                         | Formula / Base                                        | Description                                          | Notes                                                         |
| ---------------------------- | ----------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| Reaction                     | TBD                                                   | Combination of Quickness (Agility) and Intelligence? | Verify SR5 definition.                                        |
| Initiative                   | Intuition + Reaction + 1d6                            | Initiative score and dice pool.                      | Cannot be directly raised; it is a derived attribute.         |
| Astral Initiative            | (Intuition × 2) + 2D6                                 | Initiative for astral projection.                    |                                                               |
| Matrix Initiative (Cold Sim) | (Data Processing + Intuition) + 3d6                   | Initiative while in VR (cold sim).                   |                                                               |
| Matrix Initiative (Hot Sim)  | (Data Processing + Intuition) + 4d6                   | Initiative while in VR (hot sim).                    |                                                               |
| Essence                      | 6 – (cyber/bio costs)                                 | Remaining life force after augmentations.            | Already tracked above; keep formula here for clarity.         |
| Physical Limit               | [(Strength × 2) + Body + Reaction] / 3 (round up)     | Calculated limit for physical actions.               |                                                               |
| Mental Limit                 | [(Logic × 2) + Intuition + Willpower] / 3 (round up)  | Calculated limit for mental actions.                 |                                                               |
| Social Limit                 | [(Charisma × 2) + Willpower + Essence] / 3 (round up) | Calculated limit for social actions.                 | When computing, round Essence up before applying the formula. |

## Attribute Priority Reference

| Priority | Attribute Points | Notes                                        |
| -------- | ---------------- | -------------------------------------------- |
| A        | 24               | From master priority table; confirm for SR5. |
| B        | 20               |                                              |
| C        | 16               |                                              |
| D        | 14               |                                              |
| E        | 12               |                                              |

> TODO: Add metatype-specific attribute modifiers table or link to existing metatype data once finalized.

_Last updated: 2025-11-08_
