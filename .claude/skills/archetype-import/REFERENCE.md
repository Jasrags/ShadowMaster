# Archetype Import Quick Reference

## Priority Tables

### Metatype Priority

| Priority | Human     | Elf       | Dwarf     | Ork       | Troll     |
| -------- | --------- | --------- | --------- | --------- | --------- |
| A        | 9 special | 8 special | 7 special | 7 special | 5 special |
| B        | 7 special | 6 special | 4 special | 4 special | 0 special |
| C        | 5 special | 3 special | 1 special | 0 special | -         |
| D        | 3 special | 0 special | -         | -         | -         |
| E        | 1 special | -         | -         | -         | -         |

### Attributes Priority

| Priority | Points |
| -------- | ------ |
| A        | 24     |
| B        | 20     |
| C        | 16     |
| D        | 14     |
| E        | 12     |

### Skills Priority

| Priority | Skill Points | Group Points |
| -------- | ------------ | ------------ |
| A        | 46           | 10           |
| B        | 36           | 5            |
| C        | 28           | 2            |
| D        | 22           | 0            |
| E        | 18           | 0            |

### Resources Priority

| Priority | Nuyen    |
| -------- | -------- |
| A        | 450,000¥ |
| B        | 275,000¥ |
| C        | 140,000¥ |
| D        | 50,000¥  |
| E        | 6,000¥   |

### Magic/Resonance Priority

| Priority | Magician/Mystic Adept             | Technomancer                      | Adept                 | Aspected              |
| -------- | --------------------------------- | --------------------------------- | --------------------- | --------------------- |
| A        | Magic 6, 2 skills at 5, 10 spells | Resonance 6, 2 skills at 5, 5 CFs | -                     | -                     |
| B        | Magic 4, 2 skills at 4, 7 spells  | Resonance 4, 2 skills at 4, 2 CFs | Magic 6, 1 skill at 4 | Magic 5, 1 group at 4 |
| C        | Magic 3, 5 spells                 | Resonance 3, 1 CF                 | Magic 4, 1 skill at 2 | Magic 3, 1 group at 2 |
| D        | -                                 | -                                 | Magic 2               | Magic 2               |
| E        | Mundane                           | Mundane                           | Mundane               | Mundane               |

---

## Gameplay Level Variants

### Resource Allocation by Level

| Priority | Street  | Standard | Prime Runner |
| -------- | ------- | -------- | ------------ |
| A        | 75,000¥ | 450,000¥ | 500,000¥     |
| B        | 50,000¥ | 275,000¥ | 325,000¥     |
| C        | 25,000¥ | 140,000¥ | 210,000¥     |
| D        | 15,000¥ | 50,000¥  | 150,000¥     |
| E        | 6,000¥  | 6,000¥   | 100,000¥     |

### Karma Budgets by Level

| Level        | Starting | Max Carryover | Max to Nuyen |
| ------------ | -------- | ------------- | ------------ |
| Street       | 13       | 7             | 5 (10,000¥)  |
| Standard     | 25       | 7             | 10 (20,000¥) |
| Prime Runner | 35       | 7             | 25 (50,000¥) |

### Restrictions by Level

| Restriction   | Street | Standard | Prime |
| ------------- | ------ | -------- | ----- |
| Availability  | ≤10    | ≤12      | ≤15   |
| Device Rating | ≤4     | ≤6       | —     |
| Augment Bonus | +4     | +4       | +4    |

---

## Karma Spending at Creation

### Starting Karma by Level

- **Street:** 13 Karma
- **Standard:** 25 Karma
- **Prime Runner:** 35 Karma

### All Karma Costs

| Purchase                   | Cost               |
| -------------------------- | ------------------ |
| Positive Quality           | Listed cost        |
| Negative Quality           | Receive listed     |
| Karma-to-Nuyen             | 1 : 2,000¥         |
| Active Skill               | New Rating × 2     |
| Skill Group                | New Rating × 5     |
| Knowledge/Language Skill   | New Rating × 1     |
| Specialization             | 7                  |
| Attribute                  | New Rating × 5     |
| Spell/Ritual/Preparation   | 5                  |
| Complex Form               | 4                  |
| Focus Bonding              | Force × multiplier |
| Power Point (Mystic Adept) | 5                  |
| Contact                    | Connection+Loyalty |
| Bound Spirit Service       | 1 per service      |
| Registered Sprite Task     | 1 per task         |

### Karma-to-Nuyen Conversion Limits

| Level    | Max Karma | Max Nuyen |
| -------- | --------- | --------- |
| Street   | 5         | 10,000¥   |
| Standard | 10        | 20,000¥   |
| Prime    | 25        | 50,000¥   |

### Carryover Rules

- **Karma:** Maximum 7 Karma carryover (all levels)
- **Nuyen:** Maximum 5,000¥ carryover (all levels)

---

## Knowledge & Language Skills

### Formula

```
Free Points = (Intuition + Logic) × 2
```

### Example Calculations

| INT | LOG | Free Points |
| --- | --- | ----------- |
| 2   | 2   | 8           |
| 3   | 3   | 12          |
| 4   | 3   | 14          |
| 4   | 4   | 16          |
| 5   | 4   | 18          |
| 5   | 5   | 20          |

### Knowledge Skill Categories

| Category     | Linked Attr | Examples                       |
| ------------ | ----------- | ------------------------------ |
| Academic     | Logic       | History, Biology, Literature   |
| Professional | Logic       | Law, Business, Engineering     |
| Interests    | Intuition   | Sports, Music, Urban Brawl     |
| Street       | Intuition   | Gangs, Drugs, Smuggling Routes |

---

## Contact Pool

### Formula

```
Free Contact Karma = Charisma × 3
```

### Example Calculations

| CHA | Free Contact Karma |
| --- | ------------------ |
| 2   | 6                  |
| 3   | 9                  |
| 4   | 12                 |
| 5   | 15                 |
| 6   | 18                 |

### Contact Limits

- **Per Contact:** 2-7 Karma
- **Minimum:** 1 Connection + 1 Loyalty
- **Maximum:** 6 Connection + 1 Loyalty OR 1 Connection + 6 Loyalty
- **No limit** on number of contacts

### Contact Cost Matrix (Connection + Loyalty = Total)

| Con\\Loy | 1   | 2   | 3   | 4   | 5   | 6   |
| -------- | --- | --- | --- | --- | --- | --- |
| 1        | 2   | 3   | 4   | 5   | 6   | 7   |
| 2        | 3   | 4   | 5   | 6   | 7   | —   |
| 3        | 4   | 5   | 6   | 7   | —   | —   |
| 4        | 5   | 6   | 7   | —   | —   | —   |
| 5        | 6   | 7   | —   | —   | —   | —   |
| 6        | 7   | —   | —   | —   | —   | —   |

(— = exceeds 7 Karma limit per contact)

---

## Focus Bonding Costs

### Bonding Multipliers

| Focus Type       | Multiplier |
| ---------------- | ---------- |
| Qi Focus         | Force × 2  |
| Spell Focus      | Force × 2  |
| Spirit Focus     | Force × 2  |
| Enchanting Focus | Force × 3  |
| Metamagic Focus  | Force × 3  |
| Weapon Focus     | Force × 3  |
| Power Focus      | Force × 6  |

### Precalculated Costs by Force

| Focus Type       | F1  | F2  | F3  | F4  | F5  | F6  |
| ---------------- | --- | --- | --- | --- | --- | --- |
| Qi Focus         | 2   | 4   | 6   | 8   | 10  | 12  |
| Spell Focus      | 2   | 4   | 6   | 8   | 10  | 12  |
| Spirit Focus     | 2   | 4   | 6   | 8   | 10  | 12  |
| Enchanting Focus | 3   | 6   | 9   | 12  | 15  | 18  |
| Metamagic Focus  | 3   | 6   | 9   | 12  | 15  | 18  |
| Weapon Focus     | 3   | 6   | 9   | 12  | 15  | 18  |
| Power Focus      | 6   | 12  | 18  | 24  | 30  | 36  |

### Creation vs Post-Creation Limits

| Limit          | At Creation | Post-Creation |
| -------------- | ----------- | ------------- |
| Bonded foci    | ≤ Magic     | ≤ Magic       |
| Total Force    | ≤ Magic × 2 | ≤ Magic × 5   |
| Force per test | 1 focus     | 1 focus       |

---

## Magic Purchase Limits

### Spell/Ritual/Preparation Limits by Magic

| Magic | Max per Category |
| ----- | ---------------- |
| 2     | 4                |
| 3     | 6                |
| 4     | 8                |
| 5     | 10               |
| 6     | 12               |

### Spirit Limits

- **Bound spirits:** Count ≤ Charisma
- **Services per spirit:** Varies (1 Karma each at creation)

### Sprite Limits

- **Registered sprites:** Count ≤ Charisma
- **Tasks per sprite:** Varies (1 Karma each at creation)

### Mystic Adept Power Points

| Magic | Max Power Points | Total Cost |
| ----- | ---------------- | ---------- |
| 2     | 2                | 10 Karma   |
| 3     | 3                | 15 Karma   |
| 4     | 4                | 20 Karma   |
| 5     | 5                | 25 Karma   |
| 6     | 6                | 30 Karma   |

(Adepts get Power Points free = Magic rating)

---

## Creation Limits Summary

### Hard Limits (All Levels)

| Category               | Limit                |
| ---------------------- | -------------------- |
| Karma carryover        | ≤7                   |
| Nuyen carryover        | ≤5,000¥              |
| Positive qualities     | ≤25 Karma            |
| Negative qualities     | ≤25 Karma bonus      |
| Physical at max        | Only 1               |
| Mental at max          | Only 1               |
| Attribute augmentation | +4 per attribute     |
| Skill rating           | ≤6 (7 with Aptitude) |

### Level-Dependent Limits

| Limit           | Street | Standard | Prime |
| --------------- | ------ | -------- | ----- |
| Starting Karma  | 13     | 25       | 35    |
| Availability    | ≤10    | ≤12      | ≤15   |
| Device Rating   | ≤4     | ≤6       | —     |
| Max Karma→Nuyen | 5      | 10       | 25    |

### Magic/Resonance Limits

| Limit                 | Formula    |
| --------------------- | ---------- |
| Bonded foci count     | ≤ Magic    |
| Bonded foci Force     | ≤ Magic×2  |
| Spells (per category) | ≤ Magic×2  |
| Complex forms         | ≤ Logic    |
| Bound spirits         | ≤ Charisma |
| Registered sprites    | ≤ Charisma |

---

## Metatype Base Attributes

| Metatype | BOD | AGI | REA | STR | WIL | LOG | INT | CHA | Max Attribute           |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------- |
| Human    | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 1   | 6                       |
| Elf      | 1   | 2   | 1   | 1   | 1   | 1   | 1   | 3   | 6 (AGI 7, CHA 8)        |
| Dwarf    | 3   | 1   | 1   | 3   | 2   | 1   | 1   | 1   | 6 (BOD 8, STR 8, WIL 7) |
| Ork      | 4   | 1   | 1   | 3   | 1   | 1   | 1   | 1   | 6 (BOD 9, STR 8)        |
| Troll    | 5   | 1   | 1   | 5   | 1   | 1   | 1   | 1   | 6 (BOD 10, STR 10)      |

---

## Cyberware Grade Multipliers

| Grade     | Essence Mult | Cost Mult    | Avail Mod |
| --------- | ------------ | ------------ | --------- |
| Used      | 1.25 (×1.25) | 0.75 (×0.75) | -4        |
| Standard  | 1.0 (base)   | 1.0 (base)   | +0        |
| Alphaware | 0.8 (×0.8)   | 2.0 (×2)     | +2        |
| Betaware  | 0.6 (×0.6)   | 4.0 (×4)     | +4        |
| Deltaware | 0.5 (×0.5)   | 10.0 (×10)   | +8        |

### Grade Calculation Examples

**Wired Reflexes 2 (Standard)**

- Base Essence: 3.0
- Base Cost: 149,000¥
- Standard: 3.0 essence, 149,000¥

**Wired Reflexes 2 (Alphaware)**

- Essence: 3.0 × 0.8 = 2.4
- Cost: 149,000¥ × 2 = 298,000¥
- Availability: 12R + 2 = 14R

**Dermal Plating 2 (Used)**

- Base Essence: 1.0
- Essence: 1.0 × 1.25 = 1.25
- Base Cost: 24,000¥
- Cost: 24,000¥ × 0.75 = 18,000¥

---

## Cyberlimb Base Capacity

| Limb Type            | Essence | Base Capacity | Base STR | Base AGI |
| -------------------- | ------- | ------------- | -------- | -------- |
| Full Arm (Obvious)   | 1.0     | 15            | 3        | 3        |
| Full Arm (Synthetic) | 1.0     | 8             | 3        | 3        |
| Full Leg (Obvious)   | 1.0     | 20            | 3        | 3        |
| Full Leg (Synthetic) | 1.0     | 10            | 3        | 3        |
| Torso (Obvious)      | 1.5     | 10            | -        | -        |
| Skull (Obvious)      | 0.75    | 4             | -        | -        |
| Hand                 | 0.25    | 4             | 3        | 3        |
| Foot                 | 0.25    | 4             | 3        | 3        |
| Lower Arm            | 0.45    | 10            | 3        | 3        |
| Lower Leg            | 0.45    | 12            | 3        | 3        |

### Cyberlimb Enhancement Costs

| Enhancement       | Capacity    | Cost per Point   |
| ----------------- | ----------- | ---------------- |
| STR Enhancement   | 1 per point | 3,000¥ per point |
| AGI Enhancement   | 1 per point | 6,000¥ per point |
| Armor Enhancement | 1 per point | 2,000¥ per point |

**Maximum Enhancements:**

- STR: Up to +3 per limb
- AGI: Up to +3 per limb
- Armor: Up to +3 per limb

---

## Weapon Mount Types

| Mount    | Location      | Common Accessories                    |
| -------- | ------------- | ------------------------------------- |
| Top      | Top rail      | Scopes, imaging devices, laser sights |
| Under    | Under barrel  | Grenade launchers, grips, bipods      |
| Side     | Side rails    | Flashlights, laser sights             |
| Barrel   | Barrel        | Suppressors, flash hiders             |
| Stock    | Stock         | Folding stock, shock pads             |
| Internal | Inside weapon | Smartgun system, personalization      |

### Mount Compatibility by Weapon Category

| Category       | Top | Under | Side | Barrel | Stock | Internal |
| -------------- | --- | ----- | ---- | ------ | ----- | -------- |
| Holdout Pistol | -   | -     | -    | Yes    | -     | Yes      |
| Light Pistol   | -   | -     | -    | Yes    | -     | Yes      |
| Heavy Pistol   | -   | Yes   | -    | Yes    | -     | Yes      |
| Machine Pistol | -   | Yes   | -    | Yes    | -     | Yes      |
| SMG            | Yes | Yes   | Yes  | Yes    | Yes   | Yes      |
| Assault Rifle  | Yes | Yes   | Yes  | Yes    | Yes   | Yes      |
| Sniper Rifle   | Yes | Yes   | -    | Yes    | Yes   | Yes      |
| Shotgun        | Yes | Yes   | -    | Yes    | Yes   | Yes      |
| LMG/HMG        | Yes | Yes   | -    | Yes    | Yes   | Yes      |

---

## Armor Capacity

Armor capacity equals armor rating.

| Armor                   | Rating | Capacity |
| ----------------------- | ------ | -------- |
| Lined Coat              | 9      | 9        |
| Armor Jacket            | 12     | 12       |
| Armor Vest              | 9      | 9        |
| Urban Explorer Jumpsuit | 9      | 9        |
| Full Body Armor         | 15     | 15       |
| Chameleon Suit          | 9      | 9        |

### Common Armor Modifications

| Mod                       | Capacity | Cost          |
| ------------------------- | -------- | ------------- |
| Chemical Protection (1-6) | Rating   | 250¥ × Rating |
| Fire Resistance (1-6)     | Rating   | 250¥ × Rating |
| Insulation (1-6)          | Rating   | 200¥ × Rating |
| Nonconductivity (1-6)     | Rating   | 250¥ × Rating |
| Thermal Damping (1-6)     | Rating   | 500¥ × Rating |
| Gel Packs                 | 2        | 600¥          |
| Shock Frills              | 2        | 250¥          |

---

## Common Gear Hierarchy Patterns

### Cybereyes with Enhancements

```
Cybereyes (Rating 1-4)
├── Capacity: 4/8/12/16 (by rating)
├── Essence: 0.2/0.3/0.4/0.5 (by rating)
└── Enhancements:
    ├── Flare Compensation (1 cap, 250¥)
    ├── Image Link (0 cap, free)
    ├── Low-Light Vision (2 cap, 500¥)
    ├── Smartlink (3 cap, 2,000¥)
    ├── Thermographic Vision (2 cap, 500¥)
    ├── Vision Enhancement 1-3 (1 cap each, 500¥ each)
    └── Vision Magnification (2 cap, 250¥)
```

### Cyberears with Enhancements

```
Cyberears (Rating 1-4)
├── Capacity: 4/8/12/16 (by rating)
├── Essence: 0.2/0.3/0.4/0.5 (by rating)
└── Enhancements:
    ├── Audio Enhancement 1-3 (1 cap each, 250¥ each)
    ├── Balance Augmenter (1 cap, 6,000¥)
    ├── Damper (1 cap, 2,000¥)
    ├── Select Sound Filter 1-6 (1 cap each, 250¥ each)
    └── Spatial Recognizer (2 cap, 1,000¥)
```

### Commlink with Software

```
Commlink (Rating 1-6)
├── Cost: varies by model
└── Software:
    ├── AR Gloves (150¥)
    ├── Mapsoft [Location] (20¥)
    ├── Datasoft [Subject] (120¥)
    └── Sim Module Hot (200¥, if not included)
```

### Fake SIN with Licenses

```
Fake SIN (Rating 1-6)
├── Cost: 2,500¥ × Rating
└── Fake Licenses (same rating as SIN):
    ├── Concealed Carry Permit (200¥)
    ├── Driver's License (200¥)
    ├── Firearms License (200¥)
    ├── Augmentation License (200¥)
    ├── Mage License (200¥)
    └── [Other] License (200¥)
```

---

## Validation Checklist

### Pre-Generation

- [ ] All equipment names match database (use fuzzy matching if no exact match)
- [ ] Close matches auto-corrected to database names
- [ ] Rated items without specified rating default to Rating 1
- [ ] All cyberware grades specified
- [ ] All item costs include grade multipliers
- [ ] Availability within level limit (≤10/≤12/≤15)
- [ ] Device ratings within level limit (≤4/≤6/—)

### Priority Calculations

- [ ] Attribute points total matches priority
- [ ] Skill points total matches priority
- [ ] Essence total is correct (6 - sum of augmentation essence)
- [ ] Resource total within priority budget (±5% tolerance)
- [ ] Each priority used exactly once (A-E)
- [ ] Gameplay level identified (Street/Standard/Prime)

### Karma Validation

- [ ] Starting karma matches level (13/25/35)
- [ ] Positive qualities ≤25 Karma total
- [ ] Negative qualities ≤25 Karma bonus
- [ ] Karma-to-Nuyen within level limit
- [ ] Karma carryover ≤7
- [ ] All karma expenditures itemized

### Knowledge & Contacts

- [ ] Knowledge points ≤ (INT + LOG) × 2
- [ ] Contact pool ≤ CHA × 3
- [ ] Each contact costs 2-7 Karma
- [ ] Each contact has min 1 Connection + 1 Loyalty

### Magic Validation (if Awakened)

- [ ] Spells per category ≤ Magic × 2
- [ ] Bonded foci count ≤ Magic
- [ ] Bonded foci total Force ≤ Magic × 2
- [ ] Focus bonding costs calculated correctly
- [ ] Bound spirits ≤ Charisma

### Resonance Validation (if Emerged)

- [ ] Complex forms ≤ Logic
- [ ] Registered sprites ≤ Charisma

### Hierarchy

- [ ] Every weapon mod has parent weapon
- [ ] Every armor mod has parent armor
- [ ] Every cyberlimb enhancement has parent limb
- [ ] Every license has parent SIN at same rating
- [ ] No capacity overflows

### Database

- [ ] All items exist in core-rulebook.json
- [ ] Fuzzy matching applied before marking items as missing
- [ ] Close matches auto-corrected to database names
- [ ] Missing items documented in validation report
- [ ] Item IDs use kebab-case

### Carryover Limits

- [ ] Nuyen carryover ≤5,000¥
- [ ] Karma carryover ≤7

---

## Default Rating Rule

When a stat block lists a rated item WITHOUT specifying a rating, **default to Rating 1**.

### Common Rated Items (Default to R1)

| Item                  | R1 Cost | R1 Avail | Max Rating |
| --------------------- | ------- | -------- | ---------- |
| Bug Scanner           | 100¥    | 1R       | 6          |
| White Noise Generator | 50¥     | 1        | 6          |
| Area Jammer           | 200¥    | 2F       | 6          |
| Medkit                | 250¥    | 1        | 6          |
| Fake SIN              | 2,500¥  | 3F       | 6          |
| Autopicker            | 50¥     | 4F       | 6          |
| Maglock Passkey       | 2,000¥  | 8R       | 4          |
| Sequencer             | 125¥    | 2R       | 4          |
| Keycard Copier        | 200¥    | 2R       | 6          |

**Validation:** If stat block price ≠ R1 price, infer the rating from the price.

---

## Common Transcription Errors

### Weapon Names

| Common Error         | Correct Name         |
| -------------------- | -------------------- |
| Ares Predator 5      | Ares Predator V      |
| HK-277               | HK-227               |
| Ingram Smart Gun X   | Ingram Smartgun X    |
| FN-HAR               | FN HAR               |
| AK97                 | AK-97                |
| Browning Ultra Power | Browning Ultra-Power |

### Cyberware Names

| Common Error         | Correct Name               |
| -------------------- | -------------------------- |
| Smartlink (external) | Smartgun System (External) |
| Wired Reflexes R2    | Wired Reflexes 2           |
| Cyber Eyes           | Cybereyes                  |
| Dermal Armor         | Dermal Plating             |

---

## Fuzzy Matching Name Variations

When validating items against the database, use fuzzy matching before marking items as "missing."

### Variation Types

| Type           | Example Stat Block   | Example Database      | Resolution            |
| -------------- | -------------------- | --------------------- | --------------------- |
| Hyphen         | Browning Ultra Power | Browning Ultra-Power  | Normalize hyphens     |
| Word Split     | Earbuds              | Ear Buds              | Check both forms      |
| Roman Numeral  | Predator 5           | Predator V            | Convert to numeral    |
| Word Order     | Jammer (area)        | Area Jammer           | Check rearrangements  |
| Abbreviation   | Fichetti Sec 600     | Fichetti Security 600 | Expand abbreviations  |
| Adjective Form | Concealed holster    | Concealable Holster   | Check similar forms   |
| Partial Name   | Silencer             | Silencer/Suppressor   | Substring search      |
| Synonym        | Regular ammunition   | Regular Rounds        | Check common synonyms |
| Full Name      | Hardware kit         | Hardware Toolkit      | Search partial match  |

### Normalization Algorithm

```
1. Convert to lowercase
2. Remove hyphens and extra spaces
3. Convert Roman numerals (I, II, III, IV, V, VI) to digits
4. Strip common suffixes (rating, level, mk, mark)
5. Compare normalized strings
```

### Search Strategy (in order)

1. **Exact match** → Use as-is
2. **Case-insensitive match** → Use database name
3. **Normalized match** (remove hyphens/spaces) → Use database name
4. **Substring match** (stat block name in database) → Flag as close match
5. **Reverse substring** (database name in stat block) → Flag as close match
6. **Token overlap ≥80%** → Flag as close match
7. **No match** → Mark as missing

### Comprehensive Name Variation Table

| Stat Block Name      | Database Name         | Variation      |
| -------------------- | --------------------- | -------------- |
| Browning Ultra Power | Browning Ultra-Power  | Hyphen added   |
| Ares Predator 5      | Ares Predator V       | Roman numeral  |
| Earbuds              | Ear Buds              | Word split     |
| Hardware kit         | Hardware Toolkit      | Full name      |
| Jammer (area)        | Area Jammer           | Word order     |
| Silencer             | Silencer/Suppressor   | Partial name   |
| Concealed holster    | Concealable Holster   | Adjective form |
| Regular ammunition   | Regular Rounds        | Synonym        |
| Fichetti Sec 600     | Fichetti Security 600 | Abbreviation   |
| Ingram Smart Gun X   | Ingram Smartgun X     | Word merge     |
| Cyber Eyes           | Cybereyes             | Word merge     |
| FN-HAR               | FN HAR                | Hyphen removed |
| AK97                 | AK-97                 | Hyphen added   |
| Smartlink            | Smartgun System       | Different name |
| Dermal Armor         | Dermal Plating        | Different name |

### grep Patterns for Fuzzy Search

```bash
# Exact search
grep -i '"name": "Browning Ultra Power"' core-rulebook.json

# Normalized (ignore hyphens)
grep -i '"name":.*browning.*ultra.*power' core-rulebook.json

# Partial match (find all "browning" items)
grep -i '"name":.*browning' core-rulebook.json

# Find all items in a category
grep -A5 '"category": "weapons"' core-rulebook.json | grep '"name"'
```

### Essence Values

| Augmentation       | Common Error | Correct Value |
| ------------------ | ------------ | ------------- |
| Wired Reflexes 1   | 1.5          | 2.0           |
| Wired Reflexes 2   | 2.0          | 3.0           |
| Wired Reflexes 3   | 3.0          | 5.0           |
| Synaptic Booster 1 | 0.25         | 0.5           |
| Synaptic Booster 2 | 0.5          | 1.0           |
| Synaptic Booster 3 | 0.75         | 1.5           |

### Grade Confusion

| Issue                  | Resolution                       |
| ---------------------- | -------------------------------- |
| "Alphaware" vs "Alpha" | Both acceptable, use "Alphaware" |
| Missing grade          | Assume Standard grade            |
| "Military Grade"       | Not a grade - check availability |

---

## Quick Formulas

### Essence Calculation

```
Remaining Essence = 6 - Σ(Augmentation Essence × Grade Multiplier)
```

### Attribute Points

```
Total Points = Σ(Current Attribute - Metatype Base)
```

### Cyberlimb Average

```
Limb Average STR/AGI = (Base 3 + Enhancements)
Character uses limb value when using that limb specifically
```

### License Cost

```
Per License = 200¥ (regardless of rating)
Total SIN + Licenses = (2,500¥ × Rating) + (200¥ × Number of Licenses)
```
