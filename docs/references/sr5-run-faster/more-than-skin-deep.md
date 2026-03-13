# More Than Skin Deep -- Building an Identity

**Source:** Run Faster, p.44-61
**PDF Pages:** 46-63

---

## Overview

This chapter covers the cultural identities of the six major character groups in the Sixth World: dwarfs, elves, orks, trolls, humans, changelings, and shapeshifters, plus subcultures around augmentation (cyberware/bioware) and alteration (cosmetic body modification). The chapter is almost entirely lore and roleplaying guidance; it contains a single mechanical game rule (Dwarf Social Modifier, p.47) and one data table (World Population Breakdown, p.45). Pages 58-61 are fiction ("A Run on the Wild Side") with no mechanical content.

---

## Rules

### Dwarf Social Modifier (p.47)

When a dwarf interacts with another dwarf and both operate within mainstream dwarven cultural norms, the acting dwarf gains a **+2 modifier to Social limit**, including Availability checks when looking for gear.

- The modifier applies **only** to dwarf-to-dwarf interactions.
- It does **not** apply when one party is working with, or for the benefit of, a non-dwarf.
- The modifier is **lost** if the dwarf does not act in accordance with mainstream dwarven social customs, or if the dwarf is exiled from dwarven culture (e.g., being an obvious shadowrunner).
- If a dwarf is known to **flaunt** dwarven traditions, the modifier becomes **-1** when dealing with other dwarfs (except fellow exiles).
- Fellow exiles dealing with each other gain a credibility boost that **increases Social limits by 3** when dealing with other outsiders (non-mainstream dwarfs/non-dwarfs).

> **Ambiguity:** The text says the +2 applies to "Social limit, including checks for Availability when looking for gear." It is unclear whether Availability is a Social limit test in this context or a separate bonus. Safest interpretation: +2 to Social limit on all Social tests (including the Social limit used on Availability tests per standard SR5 rules) when both parties are dwarfs in good cultural standing.

> **Ambiguity:** The exile +3 Social limit bonus "when dealing with other outsiders" is vague about who qualifies as an "outsider." Likely means: anyone who is not a mainstream-culture dwarf.

> **Cross-reference:** Social limit and Availability tests, SR5 Core Rulebook p.140 (Social Tests) and p.418 (Availability).

---

## Tables

> Tabular data extracted to companion JSON file.
> Reference: `more-than-skin-deep.json`

### World Population Breakdown: 2076 (p.45)

Global metatype distribution percentages. See JSON for structured data.

---

## Cultural Sections Summary (Lore, No Mechanics)

The following sections are **purely lore/roleplaying guidance** with no implementable game mechanics. They are summarized here for completeness:

| Section                       | Pages | Metatype     | Key Themes                                                                                                  |
| ----------------------------- | ----- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| Beards: Dwarfs                | 45-47 | Dwarf        | Insular culture, deal-keeping, dwarven networking, Great Duchy of Westrhine-Luxembourg                      |
| Ears: Elves                   | 48-50 | Elf          | Isolationism, beauty culture, Path of the Wheel, Tir na nOg, Tir Tairngire, Ancients gang                   |
| Tusks: Orks                   | 50-52 | Ork          | Pack mentality, honor, carpe diem, matriarchal households, Ork Underground Seattle                          |
| Horns: Trolls                 | 52-53 | Troll        | Isolation, scrimshaw/calligraphy counterculture, Black Forest Troll Republic                                |
| Norms: Humans                 | 54    | Human        | Cultural majority, sub-culture fluidity                                                                     |
| Freaks: Changelings           | 55    | Changeling   | SURGE expression, acceptance culture, counterculture of denial                                              |
| Furs: Shapeshifters           | 55-56 | Shapeshifter | Animal-first mentality, mistrust from metahumans, counterculture of embracing metahuman form                |
| Alterations and Augmentations | 56-57 | Any          | Alteration (cosmetic self-expression) vs. Augmentation (competitive enhancement), EvoCulture, transhumanism |

---

## Validation Checklist

- [ ] When both participants are dwarfs in good cultural standing, Social limit is increased by +2
- [ ] The +2 dwarf modifier applies to Availability checks (Social limit context)
- [ ] The +2 modifier does NOT apply when one party works with/for a non-dwarf
- [ ] Dwarfs exiled from culture or known to flaunt traditions receive -1 to Social limit with other dwarfs (except fellow exiles)
- [ ] Fellow exiles receive +3 to Social limits when dealing with other outsiders
- [ ] World Population Breakdown percentages sum to 100% (39+22+15+14+5+5 = 100)
- [ ] No other mechanical rules exist in this section beyond the Dwarf Social Modifier

---

## Implementation Notes

### Dwarf Social Modifier

- This is a **conditional Social limit modifier**, not a dice pool modifier. It adjusts the Social limit used to cap hits on Social tests.
- Implementation requires tracking: (a) both participants' metatypes, (b) the acting dwarf's cultural standing (mainstream, exiled, or tradition-flaunting).
- Cultural standing could be modeled as an enum: `mainstream`, `exiled`, `tradition-flaunting`.
- The modifier matrix:
  - `mainstream` dwarf + `mainstream` dwarf = **+2 Social limit**
  - `tradition-flaunting` dwarf + any dwarf (except fellow exile) = **-1 Social limit**
  - `exiled` dwarf + `exiled` dwarf = no penalty (and +3 Social limit with other outsiders)
  - Any dwarf + non-dwarf = **no modifier**
- This modifier is niche and may be low-priority for implementation. Consider deferring to a "cultural modifiers" system if one is planned.

### World Population Breakdown

- Useful for random NPC generation weighting or flavor text. Not mechanically binding.

### General

- This chapter is 90% lore. The mechanical content is limited to the single dwarf modifier and the population table. Most of the content informs roleplaying choices during character creation (metatype culture selection) but has no testable game mechanics.
