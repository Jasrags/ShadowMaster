# Analysis Report: spells.xml

**File**: `data\chummerxml\spells.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 4717
- **Unique Fields**: 27
- **Unique Attributes**: 4
- **Unique Element Types**: 39

## Fields

### id
**Path**: `chummer/spells/spell/id`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 363
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `c78d91cc-fa02-48c3-a243-28823a2038ef`
  - `87cb3685-22e8-46fa-890f-f3cfef10a71f`
  - `10dd2924-36c6-42a3-8715-694c29c1fd48`
  - `241b9811-e7d8-41d5-b4cc-444e599599fc`
  - `187b1ffe-470c-4672-ba9d-376ee1856a1c`

### name
**Path**: `chummer/spells/spell/name`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 358
- **Type Patterns**: string
- **Length Range**: 3-28 characters
- **Examples**:
  - `Acid Stream`
  - `Toxic Wave`
  - `Punch`
  - `Clout`
  - `Blast`

### page
**Path**: `chummer/spells/spell/page`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 71
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-3 characters
- **Examples**:
  - `283`
  - `283`
  - `283`
  - `284`
  - `284`

### source
**Path**: `chummer/spells/spell/source`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: BB, BTB, CA, FA, HT, PGG, SFCR, SG, SR5, SS, SSP

### category
**Path**: `chummer/spells/spell/category`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Combat`
  - `Combat`
  - `Combat`
  - `Combat`
  - `Combat`
- **All Values**: Combat, Detection, Enchantments, Health, Illusion, Manipulation, Rituals

### damage
**Path**: `chummer/spells/spell/damage`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 84.6%
- **Boolean Ratio**: 84.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `P`
  - `P`
  - `S`
  - `S`
  - `S`
- **All Values**: 0, P, S, Special

### duration
**Path**: `chummer/spells/spell/duration`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `I`
  - `I`
  - `I`
  - `I`
  - `I`
- **All Values**: I, P, S, Special

### dv
**Path**: `chummer/spells/spell/dv`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 0.8%
- **Boolean Ratio**: 0.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `F-3`
  - `F-1`
  - `F-6`
  - `F-3`
  - `F`
- **All Values**: 0, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3, F-4, F-5, F-6, Special

### range
**Path**: `chummer/spells/spell/range`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `LOS`
  - `LOS (A)`
  - `T`
  - `LOS`
  - `LOS (A)`
- **All Values**: LOS, LOS (A), S, S (A), Special, T, T (A)

### type
**Path**: `chummer/spells/spell/type`

- **Count**: 363
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `P`
  - `P`
  - `P`
  - `P`
  - `P`
- **All Values**: M, P

### descriptor
**Path**: `chummer/spells/spell/descriptor`

- **Count**: 334
- **Presence Rate**: 100.0%
- **Unique Values**: 69
- **Type Patterns**: string
- **Length Range**: 4-30 characters
- **Examples**:
  - `Indirect, Elemental`
  - `Indirect, Elemental, Area`
  - `Indirect`
  - `Indirect`
  - `Indirect, Area`

### metamagicart
**Path**: `chummer/spells/spell/required/allof/metamagicart`

- **Count**: 54
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-16 characters
- **Examples**:
  - `Geomancy`
  - `Invocation`
  - `Divination`
  - `Necromancy`
  - `Apotropaic Magic`
- **All Values**: Advanced Alchemy, Apotropaic Magic, Blood Magic, Centering, Channeling, Cleansing, Divination, Exorcism, Geomancy, Invocation, Masking, Necromancy, Psychometry, Quickening, Sensing

### metamagic
**Path**: `chummer/spells/spell/required/allof/metamagic`

- **Count**: 24
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-14 characters
- **Examples**:
  - `Sacrifice`
  - `Sacrifice`
  - `Sacrifice`
  - `Sacrifice`
  - `Sacrifice`
- **All Values**: Home Advantage, Patronage, Sacrifice

### spirit
**Path**: `chummer/spells/spell/bonus/addspirit/spirit`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 17
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-38 characters
- **Examples**:
  - `Watcher`
  - `Homunculus (Fragile)`
  - `Homunculus (Cheap Material)`
  - `Homunculus (Average Material)`
  - `Homunculus (Heavy Material)`
- **All Values**: Ally Spirit, Carcass Spirit, Corpse Cadavre, Corpse Spirit, Detritus Spirit, Homunculus (Armored Material), Homunculus (Average Material), Homunculus (Cheap Material), Homunculus (Fragile), Homunculus (Hardened Material), Homunculus (Heavy Material), Homunculus (Heavy Structural Material), Homunculus (Reinforced Material), Homunculus (Structural Material), Palefire Spirit, Rot Spirit, Watcher

### excludeattribute
**Path**: `chummer/spells/spell/bonus/selectattribute/excludeattribute`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `INI`
  - `MAG`
  - `RES`
  - `EDG`
  - `DEP`
- **All Values**: DEP, EDG, INI, MAG, RES

### quality
**Path**: `chummer/spells/spell/required/oneof/quality`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-12 characters
- **Examples**:
  - `Adept`
  - `Mystic Adept`
  - `Adept`
  - `Mystic Adept`
  - `Adept`
- **All Values**: Adept, Mystic Adept

### addtoselected
**Path**: `chummer/spells/spell/bonus/addspirit/addtoselected`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `False`
  - `False`
  - `False`
  - `False`
  - `False`

### category
**Path**: `chummer/categories/category`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Combat`
  - `Detection`
  - `Health`
  - `Illusion`
  - `Manipulation`
- **All Values**: Combat, Detection, Enchantments, Health, Illusion, Manipulation, Rituals

### tradition
**Path**: `chummer/spells/spell/required/tradition`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Toxic`
  - `Toxic`
  - `Toxic`
  - `Toxic`

### metamagicart
**Path**: `chummer/spells/spell/required/oneof/metamagicart`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-23 characters
- **Examples**:
  - `Advanced Ritual Casting`
  - `Geomancy`
- **All Values**: Advanced Ritual Casting, Geomancy

### useskill
**Path**: `chummer/spells/spell/useskill`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 15-15 characters
- **Examples**:
  - `Animal Handling`

### initiategrade
**Path**: `chummer/spells/spell/required/oneof/group/initiategrade`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### tradition
**Path**: `chummer/spells/spell/required/oneof/group/tradition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Red Magic`

### spell
**Path**: `chummer/spells/spell/required/allof/spell`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Attune Animal`

### tradition
**Path**: `chummer/spells/spell/required/oneof/tradition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Toxic`

### art
**Path**: `chummer/spells/spell/required/allof/art`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 10-10 characters
- **Examples**:
  - `Invocation`

### quality
**Path**: `chummer/spells/spell/required/allof/quality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 18-18 characters
- **Examples**:
  - `Alchemical Armorer`

## Attributes

### category@useskill
**Path**: `chummer/categories/category@useskill`

- **Count**: 7
- **Unique Values**: 3
- **Enum Candidate**: Yes
- **Examples**:
  - `Spellcasting`
  - `Spellcasting`
  - `Spellcasting`
  - `Spellcasting`
  - `Spellcasting`
- **All Values**: Artificing, Ritual Spellcasting, Spellcasting

### category@alchemicalskill
**Path**: `chummer/categories/category@alchemicalskill`

- **Count**: 5
- **Unique Values**: 1
- **Examples**:
  - `Alchemy`
  - `Alchemy`
  - `Alchemy`
  - `Alchemy`
  - `Alchemy`

### category@barehandedadeptskill
**Path**: `chummer/categories/category@barehandedadeptskill`

- **Count**: 5
- **Unique Values**: 1
- **Examples**:
  - `Unarmed Combat`
  - `Unarmed Combat`
  - `Unarmed Combat`
  - `Unarmed Combat`
  - `Unarmed Combat`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema spells.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 7 unique values
  - Values: Combat, Detection, Enchantments, Health, Illusion, Manipulation, Rituals
- **source** (`chummer/spells/spell/source`): 11 unique values
  - Values: BB, BTB, CA, FA, HT, PGG, SFCR, SG, SR5, SS, SSP
- **category** (`chummer/spells/spell/category`): 7 unique values
  - Values: Combat, Detection, Enchantments, Health, Illusion, Manipulation, Rituals
- **damage** (`chummer/spells/spell/damage`): 4 unique values
  - Values: 0, P, S, Special
- **duration** (`chummer/spells/spell/duration`): 4 unique values
  - Values: I, P, S, Special
- **dv** (`chummer/spells/spell/dv`): 14 unique values
  - Values: 0, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3, F-4, F-5, F-6, Special
- **range** (`chummer/spells/spell/range`): 7 unique values
  - Values: LOS, LOS (A), S, S (A), Special, T, T (A)
- **type** (`chummer/spells/spell/type`): 2 unique values
  - Values: M, P
- **excludeattribute** (`chummer/spells/spell/bonus/selectattribute/excludeattribute`): 5 unique values
  - Values: DEP, EDG, INI, MAG, RES
- **spirit** (`chummer/spells/spell/bonus/addspirit/spirit`): 17 unique values
  - Values: Ally Spirit, Carcass Spirit, Corpse Cadavre, Corpse Spirit, Detritus Spirit, Homunculus (Armored Material), Homunculus (Average Material), Homunculus (Cheap Material), Homunculus (Fragile), Homunculus (Hardened Material), Homunculus (Heavy Material), Homunculus (Heavy Structural Material), Homunculus (Reinforced Material), Homunculus (Structural Material), Palefire Spirit, Rot Spirit, Watcher
- **metamagicart** (`chummer/spells/spell/required/allof/metamagicart`): 15 unique values
  - Values: Advanced Alchemy, Apotropaic Magic, Blood Magic, Centering, Channeling, Cleansing, Divination, Exorcism, Geomancy, Invocation, Masking, Necromancy, Psychometry, Quickening, Sensing
- **quality** (`chummer/spells/spell/required/oneof/quality`): 2 unique values
  - Values: Adept, Mystic Adept
- **metamagicart** (`chummer/spells/spell/required/oneof/metamagicart`): 2 unique values
  - Values: Advanced Ritual Casting, Geomancy
- **metamagic** (`chummer/spells/spell/required/allof/metamagic`): 3 unique values
  - Values: Home Advantage, Patronage, Sacrifice

### Numeric Type Candidates
- **page** (`chummer/spells/spell/page`): 100.0% numeric
  - Examples: 283, 283, 283
- **initiategrade** (`chummer/spells/spell/required/oneof/group/initiategrade`): 100.0% numeric
  - Examples: 2

### Boolean Type Candidates
- **addtoselected** (`chummer/spells/spell/bonus/addspirit/addtoselected`): 100.0% boolean
  - Examples: False, False, False
