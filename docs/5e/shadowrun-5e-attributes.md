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
   - Attribute improvement costs, cyberware impacts, and magical adjustments should reference advancement rules once sourced (see [Attributes questions](./shadowrun-5e-questions-and-gaps.md#attributes)).

## Open Items
- See [Attributes questions](./shadowrun-5e-questions-and-gaps.md#attributes) for outstanding data requirements.

## Reference
- SR5 Core Rulebook attribute chapter (pages TBD).
- `shadowrun-5e-data-tables.md` for priority point values.
- Metatype data (see `shadowrun-5e-data-tables.md` and related files) once fully populated.


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