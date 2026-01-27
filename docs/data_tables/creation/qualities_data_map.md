# Qualities Data Map

This document maps all qualities from the SR5 Core Rulebook to their data properties for implementation verification. Fill in the missing columns (Metatype Restrictions, Incompatibilities, Effect Details) as needed.

**Legend:**

- **Karma**: Cost for positive / Bonus for negative (rated qualities show all levels)
- **Prerequisites**: Required conditions (Magic, Resonance, etc.)
- **Specification**: User must specify a value (skill, attribute, substance, etc.)
- **Effects**: Mechanical effects implemented in code
- **Metatype Restrictions**: Which metatypes can/cannot take this quality
- **Incompatibilities**: Qualities that cannot be taken together

---

## Positive Qualities (CRB p.71-77)

| Quality      | Karma | Page | Prerequisites | Specification | Effects | Metatype Restrictions | Incompatibilities |
| ------------ | ----- | ---- | ------------- | ------------- | ------- | --------------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| Ambidextrous | 4     | 71   | —             | —             | —       |                       |                   | Without this quality, any action performed solely with the off–hand (i.e., firing a gun) suffers |

a –2 dice pool modifier
| Analytical Mind | 5 | 72 | — | — | +2 dice Logic (pattern analysis) | | | This quality gives the character a +2 dice pool modifier to any Logic Tests involving pattern recognition, evidence analysis, clue hunting, or solving puzzles. This quality also reduces the
time it takes the character to solve a problem by half.
| Aptitude | 14 | 72 | Limit: 1 | Skill | +1 skill max (7 at creation, 13 post) | | |
| Astral Chameleon | 10 | 72 | Magic | — | -2 to Assensing, signature ×0.5 | | Astral Beacon |
| Bilingual | 5 | 72 | — | — | Second native language | | |
| Blandness | 8 | 72 | — | — | +1 threshold to remember, -2 Shadow/Locate | | Distinctive Style |
| Catlike | 7 | 72 | — | — | +2 dice Sneaking | | |
| Codeslinger | 10 | 72 | — | Matrix Action | +2 dice to specified Matrix action | | Codeblock (same action) |
| Double-Jointed | 6 | 72 | — | — | +2 dice Escape Artist, fit tight spaces | | |
| Exceptional Attribute | 14 | 72 | — | Attribute | +1 to attribute natural max | | |
| First Impression | 11 | 74 | — | — | +2 dice Social (first meeting) | | |
| Focused Concentration | 4/8/12/16/20/24 | 74 | Magic | — | Sustain spells = rating without penalty | | |
| Gearhead | 11 | 74 | — | — | +20% Speed or +1 Handling, +2 stunts | | |
| Guts | 10 | 74 | — | — | +2 dice resist fear/intimidation | | |
| High Pain Tolerance | 7/14/21 | 74 | — | — | Ignore 1 wound modifier per rating | | Low Pain Tolerance |
| Home Ground | 10 | 74 | — | Category/Location | Bonus in specific turf | | |
| Human-Looking | 6 | 75 | — | — | Pass for human | Elf, Dwarf, Ork only | |
| Indomitable | 8/16/24 | 75 | — | — | +1 to one Inherent Limit per rating | | |
| Juryrigger | 10 | 75 | — | — | +2 dice Mechanics (temp fixes) | | |
| Low-Light Vision | 5 | — | — | — | See in dim light | Human only (others have racial) | |
| Lucky | 12 | 76 | — | — | +1 Edge natural max | | Bad Luck |
| Magic Resistance | 6/12/18/24 | 76 | — | — | +1 die Spell Resistance per rating | Cannot be Awakened | |
| Mentor Spirit | 5 | 76 | Magic | Spirit | Mentor benefits/drawbacks | | |
| Natural Athlete | 7 | 76 | — | — | +2 dice Running, +2 dice Gymnastics | | |
| Natural Hardening | 10 | 76 | — | — | +1 natural Biofeedback filtering | | |
| Natural Immunity | 4/10 | 76 | — | Disease/Toxin | Immunity to specific substance | | |
| Photographic Memory | 6 | 76 | — | — | Perfect recall, +2 dice Memory | | |
| Quick Healer | 3 | 77 | — | — | +2 dice Healing tests | | |
| Resistance to Pathogens/Toxins | 4/8 | 77 | — | — | +1/+2 dice resist pathogens/toxins | | Weak Immune System |
| Spirit Affinity | 7 | 77 | — | Spirit Type | +1 service per summoning | | Spirit Bane (same type) |
| Thermographic Vision | 5 | — | — | — | See heat signatures | Human only (others have racial) | |
| Toughness | 9 | 77 | — | — | +1 die Body (Damage Resistance) | | |
| Will to Live | 3/6/9 | 77 | — | — | +1 Overflow box per rating | | |

---

## Negative Qualities (CRB p.77-87)

| Quality            | Karma Bonus            | Page | Prerequisites | Specification | Effects                                    | Metatype Restrictions | Incompatibilities              |
| ------------------ | ---------------------- | ---- | ------------- | ------------- | ------------------------------------------ | --------------------- | ------------------------------ |
| Addiction          | 4/9/20/25              | 77   | —             | Substance     | Addiction tests, withdrawal                |                       |                                |
| Allergy            | 5/10/10/15/15/20/20/25 | 78   | —             | Allergen      | Reaction severity varies                   |                       |                                |
| Astral Beacon      | 10                     | 78   | Magic         | —             | Signature ×2, highly visible               |                       | Astral Chameleon               |
| Bad Luck           | 12                     | 79   | —             | —             | Edge backfires on 1 (d6)                   |                       | Lucky                          |
| Bad Rep            | 7                      | 79   | —             | —             | Start with 3 Notoriety                     |                       |                                |
| Code of Honor      | 15                     | 79   | —             | Code          | Cannot violate code                        |                       |                                |
| Codeblock          | 10                     | 80   | —             | Matrix Action | -2 dice to specified action                |                       | Codeslinger (same action)      |
| Combat Paralysis   | 12                     | 80   | —             | —             | First Initiative ÷2, -3 Surprise           |                       |                                |
| Dependents         | 3/6/9                  | 80   | —             | —             | Time/resource requirements                 |                       |                                |
| Distinctive Style  | 5                      | 80   | —             | Style         | +2 dice to identify/trace                  |                       | Blandness                      |
| Elf Poser          | 6                      | 81   | —             | —             | Social stigma when discovered              | Human only            | Ork Poser                      |
| Gremlins           | 4/8/12/16              | 81   | —             | —             | Tech glitches (1s on rating dice)          |                       |                                |
| Incompetent        | 5                      | 81   | —             | Skill Group   | Cannot use skill group                     |                       |                                |
| Insomnia           | 10/15                  | 81   | —             | —             | Recovery time ×2, fatigue                  |                       |                                |
| Loss of Confidence | 10                     | 82   | —             | Skill         | -2 dice to specified skill                 |                       |                                |
| Low Pain Tolerance | 9                      | 82   | —             | —             | Wound mod every 2 boxes (not 3)            |                       | High Pain Tolerance            |
| Ork Poser          | 6                      | 82   | —             | —             | Social stigma when discovered              | Human only            | Elf Poser                      |
| Prejudiced         | 3/5/5/7/8/10           | 82   | —             | Target Group  | Social penalties with group                |                       |                                |
| Scorched           | 10                     | 83   | —             | Effect/Source | Flashbacks, neurological issues            |                       |                                |
| Sensitive System   | 12                     | 83   | —             | —             | Essence ×2 for cyberware, no bioware       |                       |                                |
| Simsense Vertigo   | 5                      | 83   | —             | —             | -2 dice AR/VR/Simsense                     |                       |                                |
| SINner             | 5/10/15/25             | 84   | —             | —             | Tax obligations, legal status              |                       |                                |
| Social Stress      | 8                      | 85   | —             | Trigger       | Emotional triggers                         |                       |                                |
| Spirit Bane        | 7                      | 85   | Magic         | Spirit Type   | Specified spirits hostile                  |                       | Spirit Affinity (same type)    |
| Uncouth            | 14                     | 85   | —             | —             | -2 resist social impulses, ×2 karma Social |                       |                                |
| Uneducated         | 8                      | 87   | —             | —             | Cannot default Technical/Academic          |                       |                                |
| Unsteady Hands     | 7                      | 87   | —             | —             | -2 Agility (stressed/shaking)              |                       |                                |
| Weak Immune System | 10                     | 87   | —             | —             | Disease Power +2 vs character              |                       | Resistance to Pathogens/Toxins |

---

## Notes

### Allergy Rating Scale

The 8 rating levels for Allergy combine Severity (Mild/Moderate/Severe/Extreme) with Commonality (Uncommon/Common):

| Rating | Severity | Commonality | Karma |
| ------ | -------- | ----------- | ----- |
| 1      | Mild     | Uncommon    | 5     |
| 2      | Mild     | Common      | 10    |
| 3      | Moderate | Uncommon    | 10    |
| 4      | Moderate | Common      | 15    |
| 5      | Severe   | Uncommon    | 15    |
| 6      | Severe   | Common      | 20    |
| 7      | Extreme  | Uncommon    | 20    |
| 8      | Extreme  | Common      | 25    |

### Addiction Rating Scale

| Rating | Severity | Karma |
| ------ | -------- | ----- |
| 1      | Mild     | 4     |
| 2      | Moderate | 9     |
| 3      | Severe   | 20    |
| 4      | Burnout  | 25    |

### SINner Rating Scale

| Rating | Type                | Karma |
| ------ | ------------------- | ----- |
| 1      | National            | 5     |
| 2      | Criminal            | 10    |
| 3      | Corporate (Limited) | 15    |
| 4      | Corporate           | 25    |

### Prejudiced Rating Scale

| Rating | Intensity | Group Size | Karma |
| ------ | --------- | ---------- | ----- |
| 1      | Biased    | Common     | 3     |
| 2      | Biased    | Specific   | 5     |
| 3      | Outspoken | Common     | 5     |
| 4      | Outspoken | Specific   | 7     |
| 5      | Radical   | Common     | 8     |
| 6      | Radical   | Specific   | 10    |

---

## Missing Data Checklist

Please review and fill in:

- [ ] Verify all metatype restrictions are correct
- [ ] Add any missing incompatibilities
- [ ] Confirm effect descriptions match CRB mechanics
- [ ] Add any qualities missing from the list
- [ ] Verify rated quality karma values match CRB tables
