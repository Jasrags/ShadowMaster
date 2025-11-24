# Analysis Report: qualities.xml

**File**: `data\chummerxml\qualities.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 15488
- **Unique Fields**: 292
- **Unique Attributes**: 37
- **Unique Element Types**: 422

## Fields

### quality
**Path**: `chummer/qualities/quality/forbidden/oneof/quality`

- **Count**: 860
- **Presence Rate**: 100.0%
- **Unique Values**: 187
- **Type Patterns**: string
- **Length Range**: 4-49 characters
- **Examples**:
  - `Astral Beacon`
  - `Distinctive Style`
  - `Lucky`
  - `Exceptional Attribute`
  - `Adept`

### id
**Path**: `chummer/qualities/quality/id`

- **Count**: 803
- **Presence Rate**: 100.0%
- **Unique Values**: 803
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `68cfe94a-fa7e-4129-a9b9-b5d73e3ced99`
  - `5b19dbcd-fb69-4a02-a25a-7ac5342ca576`
  - `58e3d62a-2073-4af5-b8e0-00c446b3a5ab`
  - `7d81f676-e523-4ec6-ae98-8d801f90b031`
  - `c734e46a-d391-45a6-b022-6f18db5019f1`

### name
**Path**: `chummer/qualities/quality/name`

- **Count**: 803
- **Presence Rate**: 100.0%
- **Unique Values**: 801
- **Type Patterns**: string
- **Length Range**: 4-62 characters
- **Examples**:
  - `Ambidextrous`
  - `Analytical Mind`
  - `Aptitude`
  - `Astral Chameleon`
  - `Bilingual`

### karma
**Path**: `chummer/qualities/quality/karma`

- **Count**: 803
- **Presence Rate**: 100.0%
- **Unique Values**: 53
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 1.9%
- **Length Range**: 1-3 characters
- **Examples**:
  - `4`
  - `5`
  - `14`
  - `10`
  - `5`

### category
**Path**: `chummer/qualities/quality/category`

- **Count**: 803
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-8 characters
- **Examples**:
  - `Positive`
  - `Positive`
  - `Positive`
  - `Positive`
  - `Positive`
- **All Values**: Negative, Positive

### source
**Path**: `chummer/qualities/quality/source`

- **Count**: 803
- **Presence Rate**: 100.0%
- **Unique Values**: 22
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: AP, BB, CA, CF, DT, FA, HS, HT, KC, NF, R5, RF, RG, SAG, SASS, SG, SL, SR5, TCT, TSG

### page
**Path**: `chummer/qualities/quality/page`

- **Count**: 803
- **Presence Rate**: 100.0%
- **Unique Values**: 118
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-3 characters
- **Examples**:
  - `71`
  - `72`
  - `72`
  - `72`
  - `72`

### quality
**Path**: `chummer/qualities/quality/required/oneof/quality`

- **Count**: 678
- **Presence Rate**: 100.0%
- **Unique Values**: 59
- **Type Patterns**: string
- **Length Range**: 5-29 characters
- **Examples**:
  - `Adept`
  - `Aware`
  - `Aspected Magician`
  - `Enchanter`
  - `Explorer`

### power
**Path**: `chummer/qualities/quality/bonus/critterpowers/power`

- **Count**: 397
- **Presence Rate**: 100.0%
- **Unique Values**: 43
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-29 characters
- **Examples**:
  - `Adaptive Coloration`
  - `Allergy`
  - `Dietary Requirement`
  - `Dual Natured`
  - `Essence Drain`

### attribute
**Path**: `chummer/qualities/quality/bonus/selectattributes/selectattribute/attribute`

- **Count**: 242
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `BOD`
  - `REA`
  - `STR`
  - `BOD`
  - `REA`
- **All Values**: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

### name
**Path**: `chummer/qualities/quality/bonus/replaceattributes/replaceattribute/name`

- **Count**: 179
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `BOD`
  - `AGI`
  - `REA`
  - `STR`
  - `WIL`
- **All Values**: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

### min
**Path**: `chummer/qualities/quality/bonus/replaceattributes/replaceattribute/min`

- **Count**: 179
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 81.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`
  - `1`
  - `2`
  - `5`
  - `1`
- **All Values**: 0, 1, 2, 3, 4, 5, 6

### max
**Path**: `chummer/qualities/quality/bonus/replaceattributes/replaceattribute/max`

- **Count**: 179
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 1.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `12`
  - `6`
  - `7`
  - `12`
  - `8`
- **All Values**: 0, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9

### aug
**Path**: `chummer/qualities/quality/bonus/replaceattributes/replaceattribute/aug`

- **Count**: 179
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 1.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `16`
  - `10`
  - `11`
  - `16`
  - `12`
- **All Values**: 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 6, 7, 8, 9

### doublecareer
**Path**: `chummer/qualities/quality/doublecareer`

- **Count**: 128
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

### limit
**Path**: `chummer/qualities/quality/limit`

- **Count**: 121
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 31.4%
- **Boolean Ratio**: 67.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-9 characters
- **Examples**:
  - `{arm} - 1`
  - `False`
  - `6`
  - `3`
  - `False`
- **All Values**: 10, 11, 15, 2, 20, 3, 4, 5, 6, False, {arm} - 1

### metagenic
**Path**: `chummer/qualities/quality/metagenic`

- **Count**: 119
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### contributetolimit
**Path**: `chummer/qualities/quality/contributetolimit`

- **Count**: 101
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

### val
**Path**: `chummer/qualities/quality/bonus/selectattributes/selectattribute/val`

- **Count**: 88
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`

### name
**Path**: `chummer/qualities/quality/required/oneof/group/skill/name`

- **Count**: 87
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-25 characters
- **Examples**:
  - `Spellcasting`
  - `Counterspelling`
  - `Arcana`
  - `Spellcasting`
  - `Counterspelling`
- **All Values**: Alchemy, Arcana, Assensing, Astral Combat, Counterspelling, Magical Theory, Magical Theory (Academic), Magical Theory (Street), Magical Traditions, Psychology, Ritual Spellcasting, Spellcasting, Summoning, Unarmed Combat, Zoology

### val
**Path**: `chummer/qualities/quality/required/oneof/group/skill/val`

- **Count**: 87
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 3.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `4`
  - `5`
  - `4`
  - `4`
- **All Values**: 1, 2, 3, 4, 5, 6, 7, 8, 9

### name
**Path**: `chummer/qualities/quality/bonus/specificattribute/name`

- **Count**: 75
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `EDG`
  - `BOD`
  - `STR`
  - `AGI`
  - `REA`
- **All Values**: AGI, BOD, CHA, DEP, EDG, INT, LOG, REA, STR, WIL

### name
**Path**: `chummer/qualities/quality/bonus/specificskill/name`

- **Count**: 67
- **Presence Rate**: 100.0%
- **Unique Values**: 25
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-19 characters
- **Examples**:
  - `Sneaking`
  - `Escape Artist`
  - `Running`
  - `Gymnastics`
  - `Computer`
- **All Values**: Animal Handling, Artisan, Assensing, Computer, Con, Decompiling, Diving, Etiquette, Exotic Melee Weapon, Gunnery, Gymnastics, Hacking, Negotiation, Perception, Registering, Running, Sneaking, Software, Survival, Swimming

### bonus
**Path**: `chummer/qualities/quality/bonus/specificskill/bonus`

- **Count**: 67
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 17.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`
  - `2`
- **All Values**: -1, -2, 1, 2, 3

### name
**Path**: `chummer/qualities/quality/bonus/enabletab/name`

- **Count**: 62
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-12 characters
- **Examples**:
  - `magician`
  - `adept`
  - `magician`
  - `adept`
  - `technomancer`
- **All Values**: adept, critter, magician, technomancer

### name
**Path**: `chummer/qualities/quality/required/oneof/skill/name`

- **Count**: 62
- **Presence Rate**: 100.0%
- **Unique Values**: 18
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-25 characters
- **Examples**:
  - `Hacking`
  - `Hacking`
  - `Hacking`
  - `Alchemy`
  - `Alchemy`
- **All Values**: Alchemy, Animal Handling, Artificing, Assensing, Astral Combat, Banishing, Binding, Counterspelling, Disenchanting, Hacking, Magical Theory, Magical Theory (Academic), Magical Theory (Street), Palming, Performance, Ritual Spellcasting, Spellcasting, Summoning

### val
**Path**: `chummer/qualities/quality/required/oneof/skill/val`

- **Count**: 62
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 3.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `3`
  - `3`
  - `3`
  - `6`
  - `4`
- **All Values**: 1, 10, 11, 12, 14, 3, 4, 5, 6, 7, 8, 9

### name
**Path**: `chummer/qualities/quality/bonus/enableattribute/name`

- **Count**: 60
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `MAG`
  - `MAG`
  - `MAG`
  - `RES`
  - `MAG`
- **All Values**: MAG, RES

### canbuywithspellpoints
**Path**: `chummer/qualities/quality/canbuywithspellpoints`

- **Count**: 58
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### name
**Path**: `chummer/qualities/quality/bonus/focusbindingkarmacost/name`

- **Count**: 56
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-12 characters
- **Examples**:
  - `Qi Focus`
  - `Qi Focus`
  - `Qi Focus`
  - `Qi Focus`
  - `Qi Focus`
- **All Values**: Qi Focus, Weapon Focus

### val
**Path**: `chummer/qualities/quality/bonus/focusbindingkarmacost/val`

- **Count**: 56
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-2`
  - `-2`
  - `-2`
  - `-2`
  - `-2`

### extracontains
**Path**: `chummer/qualities/quality/bonus/focusbindingkarmacost/extracontains`

- **Count**: 55
- **Presence Rate**: 100.0%
- **Unique Values**: 50
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 30-47 characters
- **Examples**:
  - `Improved Ability (skill) (Aeronautics Mechanic)`
  - `Improved Ability (skill) (Animal Handling)`
  - `Improved Ability (skill) (Armorer)`
  - `Improved Ability (skill) (Artisan)`
  - `Improved Ability (skill) (Automotive Mechanic)`

### optionalpower
**Path**: `chummer/qualities/quality/bonus/optionalpowers/optionalpower`

- **Count**: 49
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-15 characters
- **Examples**:
  - `Enhanced Senses`
  - `Immunity`
  - `Enhanced Senses`
  - `Immunity`
  - `Armor`
- **All Values**: Armor, Enhanced Senses, Fear, Immunity

### metatype
**Path**: `chummer/qualities/quality/required/oneof/metatype`

- **Count**: 47
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-9 characters
- **Examples**:
  - `Centaur`
  - `Naga`
  - `Pixie`
  - `Sasquatch`
  - `Elf`
- **All Values**: A.I., Centaur, Dwarf, Elf, Human, Naga, Ork, Pixie, Sasquatch, Troll

### name
**Path**: `chummer/qualities/quality/naturalweapons/naturalweapon/name`

- **Count**: 45
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-18 characters
- **Examples**:
  - `Infected Claws`
  - `Infected Bite`
  - `Infected Bite`
  - `Infected Claws`
  - `Infected Bite`
- **All Values**: Crystal Claw, Crystal Jaw, Crystalline Blade, Crystalline Shards, Dracoform Claws, Dracoform Fangs, Dracoform Horns, Dracoform Tail, Infected Bite, Infected Claws

### reach
**Path**: `chummer/qualities/quality/naturalweapons/naturalweapon/reach`

- **Count**: 45
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 48.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `-1`
  - `-1`
  - `0`
  - `-1`
- **All Values**: -1, 0, 1

### damage
**Path**: `chummer/qualities/quality/naturalweapons/naturalweapon/damage`

- **Count**: 45
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-10 characters
- **Examples**:
  - `({STR}+2)P`
  - `({STR}+1)P`
  - `({STR}+1)P`
  - `({STR}+2)P`
  - `({STR}+1)P`
- **All Values**: ({STR}+1)P, ({STR}+2)P, ({STR}+3)P

### ap
**Path**: `chummer/qualities/quality/naturalweapons/naturalweapon/ap`

- **Count**: 45
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-1`
  - `-1`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: -1, -2, -4, 4

### useskill
**Path**: `chummer/qualities/quality/naturalweapons/naturalweapon/useskill`

- **Count**: 45
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 14-16 characters
- **Examples**:
  - `Unarmed Combat`
  - `Unarmed Combat`
  - `Unarmed Combat`
  - `Unarmed Combat`
  - `Unarmed Combat`
- **All Values**: Throwing Weapons, Unarmed Combat

### accuracy
**Path**: `chummer/qualities/quality/naturalweapons/naturalweapon/accuracy`

- **Count**: 45
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Physical`
  - `Physical`
  - `Physical`
  - `Physical`
  - `Physical`

### source
**Path**: `chummer/qualities/quality/naturalweapons/naturalweapon/source`

- **Count**: 45
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `RF`
  - `RF`
  - `RF`
  - `RF`
  - `RF`
- **All Values**: FA, HS, RF

### page
**Path**: `chummer/qualities/quality/naturalweapons/naturalweapon/page`

- **Count**: 45
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `137`
  - `137`
  - `137`
  - `137`
  - `137`
- **All Values**: 133, 137, 163

### quality
**Path**: `chummer/qualities/quality/costdiscount/required/oneof/quality`

- **Count**: 41
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-19 characters
- **Examples**:
  - `Animal Familiar`
  - `Aware`
  - `Magician`
  - `Aspected Magician`
  - `Enchanter`
- **All Values**: Adept, Animal Familiar, Apprentice, Aspected Magician, Aware, Enchanter, Explorer, Infected: Mutaqua, Infected: Nosferatu, Infected: Wendigo, Magician, Mystic Adept

### max
**Path**: `chummer/qualities/quality/bonus/specificattribute/max`

- **Count**: 39
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 43.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `-1`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: -1, -2, 1, 3, 99

### val
**Path**: `chummer/qualities/quality/bonus/specificattribute/val`

- **Count**: 36
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-1`
  - `-1`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: -1, 1, 2

### condition
**Path**: `chummer/qualities/quality/bonus/specificskill/condition`

- **Count**: 34
- **Presence Rate**: 100.0%
- **Unique Values**: 23
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-42 characters
- **Examples**:
  - `Matrix Perception`
  - `Not Urban`
  - `Urban`
  - `Urban`
  - `Urban`
- **All Values**: Combat maneuvers, Communities of majority orks and/or trolls, Companion Sprite, Fault Sprite, Generalist Sprite, Groups of exclusively orks and/or trolls, Hearing, Hiding in a crowd, Hot-Sim, Items specifically for orks and/or trolls, Machine Sprite, Matrix Perception, Matters of life or death, Not Urban, Scent, Taste, Touch, Urban, Visual, With plausible-seeming evidence

### skillgroupdisable
**Path**: `chummer/qualities/quality/bonus/skillgroupdisable`

- **Count**: 33
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-10 characters
- **Examples**:
  - `Conjuring`
  - `Conjuring`
  - `Conjuring`
  - `Conjuring`
  - `Conjuring`
- **All Values**: Conjuring, Enchanting, Sorcery

### limitcritterpowercategory
**Path**: `chummer/qualities/quality/bonus/limitcritterpowercategory`

- **Count**: 26
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-8 characters
- **Examples**:
  - `Infected`
  - `Infected`
  - `Infected`
  - `Infected`
  - `Infected`
- **All Values**: Drake, Infected

### name
**Path**: `chummer/qualities/quality/bonus/skillcategory/name`

- **Count**: 25
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-15 characters
- **Examples**:
  - `Social Active`
  - `Social Active`
  - `Social Active`
  - `Social Active`
  - `Social Active`
- **All Values**: Academic, Combat Active, Interest, Language, Physical Active, Professional, Social Active, Street, Vehicle Active

### bonus
**Path**: `chummer/qualities/quality/bonus/skillcategory/bonus`

- **Count**: 25
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 92.0%
- **Boolean Ratio**: 16.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `2`
  - `-3`
  - `1`
  - `2`
  - `2`
- **All Values**: -1, -2, -3, -Rating, 1, 2, 3

### physical
**Path**: `chummer/qualities/quality/bonus/conditionmonitor/physical`

- **Count**: 25
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 4.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `-2`
  - `2`
  - `-1`
  - `-1`
- **All Values**: -1, -2, 1, 2

### gameplayoption
**Path**: `chummer/qualities/quality/required/oneof/gameplayoption`

- **Count**: 25
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 12-12 characters
- **Examples**:
  - `Prime Runner`
  - `Prime Runner`
  - `Prime Runner`
  - `Prime Runner`
  - `Prime Runner`

### category
**Path**: `chummer/qualities/quality/bonus/walkmultiplier/category`

- **Count**: 24
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-6 characters
- **Examples**:
  - `Ground`
  - `Swim`
  - `Ground`
  - `Swim`
  - `Swim`
- **All Values**: Ground, Swim

### val
**Path**: `chummer/qualities/quality/bonus/walkmultiplier/val`

- **Count**: 24
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`

### stun
**Path**: `chummer/qualities/quality/bonus/conditionmonitor/stun`

- **Count**: 23
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 4.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `-1`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: -1, 1

### spec
**Path**: `chummer/qualities/quality/required/oneof/group/skill/spec`

- **Count**: 23
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-16 characters
- **Examples**:
  - `Spell Design`
  - `Spell Design`
  - `Aura Reading`
  - `[Martial Art]`
  - `[Martial Art]`
- **All Values**: Aura Reading, Manipulation, Spell Design, Spirits, Spirits of Air, Spirits of Earth, Spirits of Fire, Spirits of Water, [Martial Art]

### type
**Path**: `chummer/qualities/quality/required/oneof/group/skill/type`

- **Count**: 23
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Knowledge`
  - `Knowledge`
  - `Knowledge`
  - `Knowledge`
  - `Knowledge`

### notoriety
**Path**: `chummer/qualities/quality/bonus/notoriety`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 81.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-1`
  - `-1`
  - `-1`
  - `1`
  - `1`
- **All Values**: -1, 1, 3

### essencepenaltyt100
**Path**: `chummer/qualities/quality/bonus/essencepenaltyt100`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-4 characters
- **Examples**:
  - `-100`
  - `-100`
  - `-100`
  - `-50`
  - `-50`
- **All Values**: -100, -150, -200, -50

### essencepenaltymagonlyt100
**Path**: `chummer/qualities/quality/bonus/essencepenaltymagonlyt100`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `100`
  - `100`
  - `100`
  - `50`
  - `50`
- **All Values**: 100, 150, 200, 50

### lifestylecost
**Path**: `chummer/qualities/quality/bonus/lifestylecost`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `10`
  - `20`
  - `30`
  - `10`
  - `-10`
- **All Values**: -10, -100, -20, -50, 10, 20, 30

### armor
**Path**: `chummer/qualities/quality/bonus/armor`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 76.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `4`
  - `3`
  - `1`
  - `1`
- **All Values**: 1, 2, 3, 4

### quality
**Path**: `chummer/qualities/quality/bonus/selectquality/quality`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 21
- **Type Patterns**: string
- **Length Range**: 6-62 characters
- **Examples**:
  - `Infected Optional Power: Armor`
  - `Infected Optional Power: Compulsion`
  - `Infected Optional Power: Enhanced Sense (Hearing)`
  - `Infected Optional Power: Enhanced Sense (Low-Light Vision)`
  - `Infected Optional Power: Enhanced Sense (Smell)`

### spec
**Path**: `chummer/qualities/quality/required/oneof/skill/spec`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-16 characters
- **Examples**:
  - `Combat`
  - `Aura Reading`
  - `Astral Barriers`
  - `Health`
  - `Prestidigitation`
- **All Values**: Astral Barriers, Aura Reading, Combat, Health, Illusion, Magic, Manipulation, Prestidigitation, Spirits, Spirits of Air, Spirits of Earth, Spirits of Fire, Spirits of Water

### metatype
**Path**: `chummer/qualities/quality/required/allof/metatype`

- **Count**: 20
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-9 characters
- **Examples**:
  - `Human`
  - `Centaur`
  - `Centaur`
  - `Naga`
  - `Pixie`
- **All Values**: Centaur, Dwarf, Elf, Human, Naga, Ork, Pixie, Sasquatch, Troll

### tradition
**Path**: `chummer/qualities/quality/required/oneof/group/tradition`

- **Count**: 20
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-11 characters
- **Examples**:
  - `Chaos Magic`
  - `Chaos Magic`
  - `Buddhism`
  - `Buddhism`
  - `Wuxing`
- **All Values**: Buddhism, Chaos Magic, Islam, Sioux, Wicca, Wuxing

### name
**Path**: `chummer/qualities/quality/required/allof/skill/name`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-19 characters
- **Examples**:
  - `Alchemy`
  - `Armorer`
  - `Arcana`
  - `Counterspelling`
  - `Arcana`
- **All Values**: Alchemy, Arcana, Armorer, Artisan, Assensing, Astral Combat, Binding, Chemistry, Counterspelling, First Aid, Industrial Mechanic, Leadership, Ritual Spellcasting, Zoology

### val
**Path**: `chummer/qualities/quality/required/allof/skill/val`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `4`
  - `6`
  - `4`
  - `5`
- **All Values**: 3, 4, 5, 6

### toxiningestionresist
**Path**: `chummer/qualities/quality/bonus/toxiningestionresist`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `1`
  - `1`
- **All Values**: -1, -2, 1, 2

### fatigueresist
**Path**: `chummer/qualities/quality/bonus/fatigueresist`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 31.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`
- **All Values**: 1, 2, 3, 4

### unlockskills
**Path**: `chummer/qualities/quality/bonus/unlockskills`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-28 characters
- **Examples**:
  - `Magician`
  - `Adept`
  - `Magician`
  - `Technomancer`
  - `Sorcery,Conjuring,Enchanting`
- **All Values**: Adept, Aware, Conjuring, Enchanting, Explorer, Magician, Name, Sorcery, Sorcery,Conjuring,Enchanting, Technomancer

### category
**Path**: `chummer/qualities/quality/bonus/movementreplace/category`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-6 characters
- **Examples**:
  - `Ground`
  - `Ground`
  - `Ground`
  - `Ground`
  - `Ground`
- **All Values**: Fly, Ground

### speed
**Path**: `chummer/qualities/quality/bonus/movementreplace/speed`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-6 characters
- **Examples**:
  - `walk`
  - `run`
  - `run`
  - `walk`
  - `run`
- **All Values**: run, sprint, walk

### val
**Path**: `chummer/qualities/quality/bonus/movementreplace/val`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 6.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `3`
  - `6`
  - `6`
  - `1`
  - `2`
- **All Values**: 1, 2, 3, 50, 500, 6

### fadingvalue
**Path**: `chummer/qualities/quality/bonus/fadingvalue`

- **Count**: 14
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-2`
  - `-2`
  - `-2`
  - `-2`
  - `-2`

### toxininjectionresist
**Path**: `chummer/qualities/quality/bonus/toxininjectionresist`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 15.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `-2`
  - `2`
- **All Values**: -1, -2, 1, 2

### name
**Path**: `chummer/qualities/quality/bonus/skillgroup/name`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-12 characters
- **Examples**:
  - `Conjuring`
  - `Outdoors`
  - `Outdoors`
  - `Outdoors`
  - `Outdoors`
- **All Values**: Close Combat, Conjuring, Electronics, Engineering, Influence, Outdoors, Stealth

### bonus
**Path**: `chummer/qualities/quality/bonus/skillgroup/bonus`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 38.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `2`
  - `2`
- **All Values**: -2, -4, 1, 2

### initiativepass
**Path**: `chummer/qualities/quality/bonus/initiativepass`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`

### quality
**Path**: `chummer/qualities/quality/required/allof/quality`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-18 characters
- **Examples**:
  - `Fangs`
  - `Fangs`
  - `Fangs`
  - `Fangs`
  - `Mage Hunter I`
- **All Values**: Crystal Limb (Arm), Crystalline Claws, Fangs, Mage Hunter I, Mage Hunter II, Records on File, Spirit Hunter I, Spirit Hunter II, Technomancer

### quality
**Path**: `chummer/qualities/quality/bonus/selectquality/discountqualities/quality`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-30 characters
- **Examples**:
  - `Third Eye`
  - `Scent Glands`
  - `Scales`
  - `Critter Spook`
  - `Cold-Blooded`
- **All Values**: Astral Hazing, Berserker, Bioluminescence, Cold-Blooded, Critter Spook, Cyclopean Eye, Impaired Attribute (Charisma), Impaired Attribute (Intuition), Impaired Attribute (Logic), Impaired Attribute (Willpower), Scales, Scent Glands, Third Eye

### essencepenalty
**Path**: `chummer/qualities/quality/bonus/essencepenalty`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`
  - `-1`
  - `-1`
  - `-1`
  - `-1`

### category
**Path**: `chummer/qualities/quality/bonus/runmultiplier/category`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Ground`
  - `Ground`
  - `Ground`
  - `Ground`
  - `Ground`

### val
**Path**: `chummer/qualities/quality/bonus/runmultiplier/val`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`

### disablecyberwaregrade
**Path**: `chummer/qualities/quality/bonus/disablecyberwaregrade`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-34 characters
- **Examples**:
  - `Standard`
  - `Standard (Burnout's Way)`
  - `Used`
  - `Alphaware`
  - `Omegaware`
- **All Values**: Alphaware, Alphaware (Adapsin), Greyware, Greyware (Adapsin), Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)

### spell
**Path**: `chummer/qualities/quality/required/oneof/group/spell`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-14 characters
- **Examples**:
  - `Shapechange`
  - `[Critter] Form`
  - `Shapechange`
  - `[Critter] Form`
  - `Shapechange`
- **All Values**: Shapechange, [Critter] Form

### condition
**Path**: `chummer/qualities/quality/bonus/skillcategory/condition`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: string
- **Length Range**: 24-52 characters
- **Examples**:
  - `Meeting people the first time`
  - `When not looking your best`
  - `Involves a significant event in ork or troll history`
  - `Involves a significant event in ork or troll history`
  - `Involves a significant event in ork or troll history`

### bioware
**Path**: `chummer/qualities/quality/forbidden/oneof/bioware`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 19-32 characters
- **Examples**:
  - `Damage Compensators`
  - `Damage Compensators (2050)`
  - `Genetic Optimization (Body)`
  - `Genetic Optimization (Agility)`
  - `Genetic Optimization (Reaction)`
- **All Values**: Damage Compensators, Damage Compensators (2050), Genetic Optimization (Agility), Genetic Optimization (Body), Genetic Optimization (Charisma), Genetic Optimization (Intuition), Genetic Optimization (Logic), Genetic Optimization (Reaction), Genetic Optimization (Strength), Genetic Optimization (Willpower)

### addquality
**Path**: `chummer/qualities/quality/bonus/addqualities/addquality`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-19 characters
- **Examples**:
  - `SINner (Criminal)`
  - `High Pain Tolerance`
  - `Distinctive Style`
  - `Wanted`
  - `Wanted`
- **All Values**: Distinctive Style, High Pain Tolerance, Home Ground, Magic Resistance, SINner (Criminal), Wanted

### addweapon
**Path**: `chummer/qualities/quality/addweapon`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-28 characters
- **Examples**:
  - `Kick (Centaur)`
  - `Bite (Naga)`
  - `Raptor Beak`
  - `Digging Claws`
  - `Razor Claws`
- **All Values**: Bite (Naga), Digging Claws, Fangs, Functional Tail (Thagomizer), Goring Horns, Kick (Centaur), Larger Tusks, Raptor Beak, Razor Claws, Retractable Claws

### excludeattribute
**Path**: `chummer/qualities/quality/bonus/selectattributes/selectattribute/excludeattribute`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `EDG`
  - `EDG`
  - `MAG`
  - `RES`
  - `DEP`
- **All Values**: AGI, BOD, DEP, EDG, MAG, REA, RES, STR

### value
**Path**: `chummer/qualities/quality/costdiscount/value`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `-3`
  - `-10`
  - `10`
  - `-10`
  - `-10`
- **All Values**: -10, -3, -5, 10

### limit
**Path**: `chummer/qualities/quality/bonus/limitmodifier/limit`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-6 characters
- **Examples**:
  - `Mental`
  - `Social`
  - `Social`
  - `Social`
  - `Social`
- **All Values**: Mental, Social

### value
**Path**: `chummer/qualities/quality/bonus/limitmodifier/value`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 44.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `2`
  - `3`
- **All Values**: -1, 1, 2, 3

### min
**Path**: `chummer/qualities/quality/bonus/specificattribute/min`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 88.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`
- **All Values**: -1, 1

### skilldisable
**Path**: `chummer/qualities/quality/bonus/skilldisable`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-19 characters
- **Examples**:
  - `Binding`
  - `Spellcasting`
  - `Summoning`
  - `Binding`
  - `Binding`
- **All Values**: Alchemy, Artificing, Binding, Ritual Spellcasting, Spellcasting, Summoning

### name
**Path**: `chummer/qualities/quality/includeinlimit/name`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 20-25 characters
- **Examples**:
  - `Indomitable (Physical)`
  - `Indomitable (Social)`
  - `Indomitable (Mental)`
  - `Indomitable (Social)`
  - `Indomitable (Physical)`
- **All Values**: Indomitable (Mental), Indomitable (Physical), Indomitable (Social), Tough as Nails (Physical), Tough as Nails (Stun)

### condition
**Path**: `chummer/qualities/quality/bonus/skillgroup/condition`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-13 characters
- **Examples**:
  - `Urban`
  - `Rural`
  - `Desert`
  - `Forest`
  - `Jungle`
- **All Values**: Desert, Forest, Jungle, Mountain, Polar, Rural, Urban, When in hosts

### critterpower
**Path**: `chummer/qualities/quality/forbidden/oneof/critterpower`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-15 characters
- **Examples**:
  - `Compulsion`
  - `Fear`
  - `Influence`
  - `Magical Guard`
  - `Mimicry`
- **All Values**: Compulsion, Fear, Influence, Magical Guard, Mimicry, Paralyzing Howl, Psychokinesis, Regeneration

### ess
**Path**: `chummer/qualities/quality/required/oneof/ess`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 12.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `1`
  - `0.0001`
  - `0.0001`
  - `0.0001`
  - `0.0001`
- **All Values**: 0.0001, 1

### condition
**Path**: `chummer/qualities/quality/bonus/limitmodifier/condition`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 21-38 characters
- **Examples**:
  - `LimitCondition_SkillsKnowledgeAcademic`
  - `LimitCondition_Sprawl`
  - `LimitCondition_NationalLanguageRanks`
  - `LimitCondition_Megacorp`
  - `LimitCondition_QualityTrustworthy`
- **All Values**: LimitCondition_ExcludeIntimidation, LimitCondition_Megacorp, LimitCondition_NationalLanguageRanks, LimitCondition_QualityChatty, LimitCondition_QualityTrustworthy, LimitCondition_SkillsKnowledgeAcademic, LimitCondition_Sprawl

### power
**Path**: `chummer/qualities/quality/required/allof/power`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 12-16 characters
- **Examples**:
  - `Critical Strike`
  - `Missile Parry`
  - `Counterstrike`
  - `Cool Resolve`
  - `Killing Hands`
- **All Values**: Cool Resolve, Counterstrike, Critical Strike, Elemental Body, Elemental Strike, Killing Hands, Missile Parry

### id
**Path**: `chummer/xpathqueries/query/id`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `bc8adb44-f2a6-43c6-b3e8-e0825209f86c`
  - `02d0c37b-c3c4-4892-ad32-c91e4de72742`
  - `33868824-d80c-4db5-baee-d993d87fc70a`
  - `3b5fca95-9f04-4815-999a-a35fca1f856a`
  - `5760ec8d-f7ca-4290-8f9f-c711da200353`
- **All Values**: 02d0c37b-c3c4-4892-ad32-c91e4de72742, 33868824-d80c-4db5-baee-d993d87fc70a, 3b5fca95-9f04-4815-999a-a35fca1f856a, 5760ec8d-f7ca-4290-8f9f-c711da200353, bc8adb44-f2a6-43c6-b3e8-e0825209f86c, cdd640dc-5b69-45a5-8d5e-5367ed3dddbc, d6a8a731-0225-4123-9388-212024bacd35

### display
**Path**: `chummer/xpathqueries/query/display`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 42-47 characters
- **Examples**:
  - `String_SelectQuality_XPathQuery_AddQualityBonus`
  - `String_SelectQuality_XPathQuery_KarmaRange`
  - `String_SelectQuality_XPathQuery_RunFasterSource`
  - `String_SelectQuality_XPathQuery_SpellPoints`
  - `String_SelectQuality_XPathQuery_MetagenicOnly`
- **All Values**: String_SelectQuality_XPathQuery_AddQualityBonus, String_SelectQuality_XPathQuery_KarmaRange, String_SelectQuality_XPathQuery_MetagenicOnly, String_SelectQuality_XPathQuery_NegativeOnly, String_SelectQuality_XPathQuery_PositiveOnly, String_SelectQuality_XPathQuery_RunFasterSource, String_SelectQuality_XPathQuery_SpellPoints

### xpath
**Path**: `chummer/xpathqueries/query/xpath`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-30 characters
- **Examples**:
  - `bonus/addquality`
  - `karma >= 5 and karma <= 10`
  - `source = 'RF'`
  - `canbuywithspellpoints = 'True'`
  - `metagenic = 'True'`
- **All Values**: bonus/addquality, canbuywithspellpoints = 'True', category = 'Negative', category = 'Positive', karma >= 5 and karma <= 10, metagenic = 'True', source = 'RF'

### metatype
**Path**: `chummer/qualities/quality/forbidden/oneof/metatype`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-9 characters
- **Examples**:
  - `Naga`
  - `Pixie`
  - `Centaur`
  - `Sasquatch`
  - `Human`
- **All Values**: Centaur, Human, Naga, Pixie, Sasquatch

### toxininhalationresist
**Path**: `chummer/qualities/quality/bonus/toxininhalationresist`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `-2`
  - `2`
- **All Values**: -1, -2, 1, 2

### reach
**Path**: `chummer/qualities/quality/bonus/reach`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 83.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `-1`
  - `1`
  - `1`
  - `1`
- **All Values**: -1, 1

### metatypecategory
**Path**: `chummer/qualities/quality/forbidden/oneof/metatypecategory`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-12 characters
- **Examples**:
  - `Shapeshifter`
  - `Metasapient`
  - `Shapeshifter`
  - `Metasapient`
  - `Shapeshifter`
- **All Values**: Metasapient, Shapeshifter

### toxincontactresist
**Path**: `chummer/qualities/quality/bonus/toxincontactresist`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 40.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `-2`
  - `-1`
- **All Values**: -1, -2, 1, 2

### nameonpage
**Path**: `chummer/qualities/quality/nameonpage`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-21 characters
- **Examples**:
  - `Magicians`
  - `Adepts`
  - `Mystic Adepts`
  - `Aspected Magicians`
  - `Special Modifications`
- **All Values**: Adepts, Aspected Magicians, Magicians, Mystic Adepts, Special Modifications

### name
**Path**: `chummer/qualities/quality/bonus/skillcategorykarmacostmultiplier/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-16 characters
- **Examples**:
  - `Social Active`
  - `Professional`
  - `Academic`
  - `Technical Active`
  - `Academic`
- **All Values**: Academic, Professional, Social Active, Technical Active

### val
**Path**: `chummer/qualities/quality/bonus/skillcategorykarmacostmultiplier/val`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `200`
  - `200`
  - `200`
  - `200`
  - `50`
- **All Values**: 200, 50

### name
**Path**: `chummer/qualities/quality/bonus/skillcategorypointcostmultiplier/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-13 characters
- **Examples**:
  - `Social Active`
  - `Academic`
  - `Language`
  - `Street`
  - `Professional`
- **All Values**: Academic, Language, Professional, Social Active, Street

### val
**Path**: `chummer/qualities/quality/bonus/skillcategorypointcostmultiplier/val`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `200`
  - `50`
  - `50`
  - `50`
  - `50`
- **All Values**: 200, 50

### initiative
**Path**: `chummer/qualities/quality/bonus/initiative`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 80.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `2`
- **All Values**: 1, 2

### physiologicaladdictionfirsttime
**Path**: `chummer/qualities/quality/bonus/physiologicaladdictionfirsttime`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 80.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `-Rating`
  - `2`
  - `-2`
  - `-2`
  - `-1`
- **All Values**: -1, -2, -Rating, 2

### disablebiowaregrade
**Path**: `chummer/qualities/quality/bonus/disablebiowaregrade`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-24 characters
- **Examples**:
  - `Standard`
  - `Standard (Burnout's Way)`
  - `Used`
  - `Alphaware`
  - `Omegaware`
- **All Values**: Alphaware, Omegaware, Standard, Standard (Burnout's Way), Used

### name
**Path**: `chummer/qualities/quality/required/allof/spellcategory/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Combat`
  - `Detection`
  - `Health`
  - `Illusion`
  - `Manipulation`
- **All Values**: Combat, Detection, Health, Illusion, Manipulation

### count
**Path**: `chummer/qualities/quality/required/allof/spellcategory/count`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `4`
  - `4`
  - `4`
  - `4`

### power
**Path**: `chummer/qualities/quality/required/oneof/power`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-16 characters
- **Examples**:
  - `Adept Spell`
  - `Empathic Healing`
  - `Rapid Healing`
  - `Killing Hands`
- **All Values**: Adept Spell, Empathic Healing, Killing Hands, Rapid Healing

### pathogencontactresist
**Path**: `chummer/qualities/quality/bonus/pathogencontactresist`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `-2`
- **All Values**: -2, 1, 2

### pathogeningestionresist
**Path**: `chummer/qualities/quality/bonus/pathogeningestionresist`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `-2`
- **All Values**: -2, 1, 2

### pathogeninhalationresist
**Path**: `chummer/qualities/quality/bonus/pathogeninhalationresist`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `-2`
- **All Values**: -2, 1, 2

### pathogeninjectionresist
**Path**: `chummer/qualities/quality/bonus/pathogeninjectionresist`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `-2`
- **All Values**: -2, 1, 2

### name
**Path**: `chummer/qualities/quality/bonus/skillcategoryspecializationkarmacostmultiplier/name`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-16 characters
- **Examples**:
  - `Professional`
  - `Academic`
  - `Technical Active`
  - `Academic`
- **All Values**: Academic, Professional, Technical Active

### val
**Path**: `chummer/qualities/quality/bonus/skillcategoryspecializationkarmacostmultiplier/val`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `200`
  - `200`
  - `200`
  - `50`
- **All Values**: 200, 50

### name
**Path**: `chummer/qualities/quality/bonus/skillcategorykarmacost/name`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Academic`
  - `Language`
  - `Street`
  - `Professional`
- **All Values**: Academic, Language, Professional, Street

### val
**Path**: `chummer/qualities/quality/bonus/skillcategorykarmacost/val`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`
  - `-1`
  - `-1`
  - `-1`

### min
**Path**: `chummer/qualities/quality/bonus/skillcategorykarmacost/min`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `3`
  - `3`
  - `3`

### condition
**Path**: `chummer/qualities/quality/bonus/skillcategorykarmacost/condition`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `career`
  - `career`
  - `career`
  - `career`

### publicawareness
**Path**: `chummer/qualities/quality/bonus/publicawareness`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `3`
  - `5`
  - `8`
- **All Values**: 2, 3, 5, 8

### trustfund
**Path**: `chummer/qualities/quality/bonus/trustfund`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
  - `3`
  - `4`
- **All Values**: 1, 2, 3, 4

### exclude
**Path**: `chummer/qualities/quality/bonus/skillcategory/exclude`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-12 characters
- **Examples**:
  - `Gunnery`
  - `Intimidation`
  - `Perception`
  - `Intimidation`
- **All Values**: Gunnery, Intimidation, Perception

### physiologicaladdictionalreadyaddicted
**Path**: `chummer/qualities/quality/bonus/physiologicaladdictionalreadyaddicted`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 75.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-7 characters
- **Examples**:
  - `-Rating`
  - `-2`
  - `-2`
  - `-1`
- **All Values**: -1, -2, -Rating

### attributemaxclamp
**Path**: `chummer/qualities/quality/firstlevelbonus/attributemaxclamp`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `AGI`
  - `BOD`
  - `REA`
  - `STR`
- **All Values**: AGI, BOD, REA, STR

### cyberseeker
**Path**: `chummer/qualities/quality/bonus/cyberseeker`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `WIL`
  - `AGI`
  - `STR`
  - `BOX`
- **All Values**: AGI, BOX, STR, WIL

### category
**Path**: `chummer/qualities/quality/bonus/dealerconnection/category`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-11 characters
- **Examples**:
  - `Drones`
  - `Groundcraft`
  - `Watercraft`
  - `Aircraft`
- **All Values**: Aircraft, Drones, Groundcraft, Watercraft

### stagedpurchase
**Path**: `chummer/qualities/quality/stagedpurchase`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`

### quality
**Path**: `chummer/qualities/quality/required/oneof/group/quality`

- **Count**: 4
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
- **All Values**: Adept, Mystic Adept

### power
**Path**: `chummer/qualities/quality/required/oneof/group/power`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 12-13 characters
- **Examples**:
  - `Nerve Strike`
  - `Nerve Strike`
  - `Killing Hands`
  - `Killing Hands`
- **All Values**: Killing Hands, Nerve Strike

### martialtechnique
**Path**: `chummer/qualities/quality/required/oneof/group/martialtechnique`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `Dim Mak`
  - `Dim Mak`
  - `Dim Mak`
  - `Dim Mak`

### tradition
**Path**: `chummer/qualities/quality/required/oneof/group/grouponeof/tradition`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-17 characters
- **Examples**:
  - `Black Magic`
  - `Black Magic [Alt]`
  - `Black Magic`
  - `Black Magic [Alt]`
- **All Values**: Black Magic, Black Magic [Alt]

### spirit
**Path**: `chummer/qualities/quality/bonus/limitspiritcategory/spirit`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-15 characters
- **Examples**:
  - `Spirit of Air`
  - `Spirit of Earth`
  - `Spirit of Fire`
  - `Spirit of Water`
- **All Values**: Spirit of Air, Spirit of Earth, Spirit of Fire, Spirit of Water

### name
**Path**: `chummer/qualities/quality/bonus/addgear/children/child/name`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 12-12 characters
- **Examples**:
  - `Fake License`
  - `Fake License`
  - `Fake License`
  - `Fake License`

### category
**Path**: `chummer/qualities/quality/bonus/addgear/children/child/category`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `ID/Credsticks`
  - `ID/Credsticks`
  - `ID/Credsticks`
  - `ID/Credsticks`

### rating
**Path**: `chummer/qualities/quality/bonus/addgear/children/child/rating`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `3`
  - `3`
  - `3`

### name
**Path**: `chummer/qualities/quality/bonus/skillattribute/name`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `LOG`
  - `LOG`
  - `INT`
- **All Values**: INT, LOG

### bonus
**Path**: `chummer/qualities/quality/bonus/skillattribute/bonus`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `2`
  - `-Rating`
  - `-Rating`
- **All Values**: -Rating, 2

### memory
**Path**: `chummer/qualities/quality/bonus/memory`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.7%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `2`
  - `-Rating`
  - `1`
- **All Values**: -Rating, 1, 2

### damageresistance
**Path**: `chummer/qualities/quality/bonus/damageresistance`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
  - `4`
- **All Values**: 1, 2, 4

### surprise
**Path**: `chummer/qualities/quality/bonus/surprise`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 66.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `3`
  - `-3`
  - `-Rating`
- **All Values**: -3, -Rating, 3

### blockskillcategorydefaulting
**Path**: `chummer/qualities/quality/bonus/blockskillcategorydefaulting`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-16 characters
- **Examples**:
  - `Professional`
  - `Academic`
  - `Technical Active`
- **All Values**: Academic, Professional, Technical Active

### metageniclimit
**Path**: `chummer/qualities/quality/bonus/metageniclimit`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `30`
  - `30`
  - `30`

### nuyenmaxbp
**Path**: `chummer/qualities/quality/bonus/nuyenmaxbp`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `30`
  - `-1`
  - `-1`
- **All Values**: -1, 30

### dodge
**Path**: `chummer/qualities/quality/bonus/dodge`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.7%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `1`
  - `-Rating`
  - `2`
- **All Values**: -Rating, 1, 2

### psychologicaladdictionfirsttime
**Path**: `chummer/qualities/quality/bonus/psychologicaladdictionfirsttime`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-2`
  - `-1`
- **All Values**: -1, -2, 2

### type
**Path**: `chummer/qualities/quality/required/oneof/skill/type`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Knowledge`
  - `Knowledge`
  - `Knowledge`

### val
**Path**: `chummer/qualities/quality/bonus/spellcategorydrain/val`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 66.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `1`
  - `-2`
- **All Values**: -2, 1

### spell
**Path**: `chummer/qualities/quality/required/allof/spell`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-18 characters
- **Examples**:
  - `Fling`
  - `[Critter] Form`
  - `Create Ally Spirit`
- **All Values**: Create Ally Spirit, Fling, [Critter] Form

### addmetamagic
**Path**: `chummer/qualities/quality/bonus/addmetamagic`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-11 characters
- **Examples**:
  - `Psychometry`
  - `Sensing`
  - `Reflection`
- **All Values**: Psychometry, Reflection, Sensing

### category
**Path**: `chummer/categories/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-8 characters
- **Examples**:
  - `Positive`
  - `Negative`
- **All Values**: Negative, Positive

### max
**Path**: `chummer/qualities/quality/bonus/selectattributes/selectattribute/max`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `96`
- **All Values**: 1, 96

### sociallimit
**Path**: `chummer/qualities/quality/bonus/sociallimit`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
- **All Values**: 1, 2

### spellresistance
**Path**: `chummer/qualities/quality/bonus/spellresistance`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
- **All Values**: 1, 2

### physicalcmrecovery
**Path**: `chummer/qualities/quality/bonus/physicalcmrecovery`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-2`
- **All Values**: -2, 2

### stuncmrecovery
**Path**: `chummer/qualities/quality/bonus/stuncmrecovery`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-2`
- **All Values**: -2, 2

### name
**Path**: `chummer/qualities/quality/bonus/addgear/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-14 characters
- **Examples**:
  - `Living Persona`
  - `Fake SIN`
- **All Values**: Fake SIN, Living Persona

### category
**Path**: `chummer/qualities/quality/bonus/addgear/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-13 characters
- **Examples**:
  - `Commlinks`
  - `ID/Credsticks`
- **All Values**: Commlinks, ID/Credsticks

### val
**Path**: `chummer/qualities/quality/bonus/selectskill/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-2`
  - `1`
- **All Values**: -2, 1

### freequality
**Path**: `chummer/qualities/quality/bonus/freequality`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `ced3fecf-2277-4b20-b1e0-894162ca9ae2`
  - `ced3fecf-2277-4b20-b1e0-894162ca9ae2`

### ess
**Path**: `chummer/qualities/quality/required/allof/ess`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-7 characters
- **Examples**:
  - `-5`
  - `-5.0001`
- **All Values**: -5, -5.0001

### val
**Path**: `chummer/qualities/quality/bonus/activeskillkarmacost/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-1`
  - `2`
- **All Values**: -1, 2

### condition
**Path**: `chummer/qualities/quality/bonus/activeskillkarmacost/condition`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `career`
  - `career`

### val
**Path**: `chummer/qualities/quality/bonus/knowledgeskillkarmacost/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-1`
  - `2`
- **All Values**: -1, 2

### condition
**Path**: `chummer/qualities/quality/bonus/knowledgeskillkarmacost/condition`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `career`
  - `career`

### forcedloyalty
**Path**: `chummer/qualities/quality/bonus/addcontact/forcedloyalty`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `3`

### limitwithinclusions
**Path**: `chummer/qualities/quality/limitwithinclusions`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `4`

### nuyenamt
**Path**: `chummer/qualities/quality/bonus/nuyenamt`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 4-5 characters
- **Examples**:
  - `5000`
  - `10000`
- **All Values**: 10000, 5000

### coldarmor
**Path**: `chummer/qualities/quality/bonus/coldarmor`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `2`
- **All Values**: 2, 4

### unarmeddv
**Path**: `chummer/qualities/quality/bonus/unarmeddv`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `1`
- **All Values**: 1, 2

### category
**Path**: `chummer/qualities/quality/bonus/sprintbonus/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Ground`
  - `Ground`

### val
**Path**: `chummer/qualities/quality/bonus/sprintbonus/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `100`
  - `100`

### spec
**Path**: `chummer/qualities/quality/bonus/addskillspecializationoption/spec`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 14-14 characters
- **Examples**:
  - `Electroception`
  - `Electroception`

### skill
**Path**: `chummer/qualities/quality/bonus/addskillspecializationoption/skills/skill`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 10-10 characters
- **Examples**:
  - `Perception`
  - `Perception`

### implemented
**Path**: `chummer/qualities/quality/implemented`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `False`
  - `False`

### cyberwareessmultiplier
**Path**: `chummer/qualities/quality/bonus/cyberwareessmultiplier`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `90`
  - `120`
- **All Values**: 120, 90

### biowareessmultiplier
**Path**: `chummer/qualities/quality/bonus/biowareessmultiplier`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `90`
  - `120`
- **All Values**: 120, 90

### psychologicaladdictionalreadyaddicted
**Path**: `chummer/qualities/quality/bonus/psychologicaladdictionalreadyaddicted`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `-2`
  - `-1`
- **All Values**: -1, -2

### metamagic
**Path**: `chummer/qualities/quality/required/allof/metamagic`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 16-16 characters
- **Examples**:
  - `Advanced Alchemy`
  - `Advanced Alchemy`

### allowspellrange
**Path**: `chummer/qualities/quality/bonus/allowspellrange`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-5 characters
- **Examples**:
  - `T`
  - `T (A)`
- **All Values**: T, T (A)

### category
**Path**: `chummer/qualities/quality/bonus/spellcategorydamage/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Combat`
  - `Combat`

### val
**Path**: `chummer/qualities/quality/bonus/spellcategorydamage/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`

### category
**Path**: `chummer/qualities/quality/bonus/spellcategorydrain/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Combat`
  - `Combat`

### quality
**Path**: `chummer/qualities/quality/forbidden/allof/quality`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-12 characters
- **Examples**:
  - `Adept`
  - `Mystic Adept`
- **All Values**: Adept, Mystic Adept

### spell
**Path**: `chummer/qualities/quality/required/oneof/spell`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-14 characters
- **Examples**:
  - `Shapechange`
  - `[Critter] Form`
- **All Values**: Shapechange, [Critter] Form

### attack
**Path**: `chummer/qualities/quality/bonus/livingpersona/attack`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-1`
- **All Values**: -1, 2

### dataprocessing
**Path**: `chummer/qualities/quality/bonus/livingpersona/dataprocessing`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-1`
- **All Values**: -1, 2

### firewall
**Path**: `chummer/qualities/quality/bonus/livingpersona/firewall`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-1`
- **All Values**: -1, 2

### sleaze
**Path**: `chummer/qualities/quality/bonus/livingpersona/sleaze`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-1`
- **All Values**: -1, 2

### specialmodificationlimit
**Path**: `chummer/qualities/quality/bonus/specialmodificationlimit`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`

### contactkarma
**Path**: `chummer/qualities/quality/bonus/contactkarma`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `-2`
  - `-1`
- **All Values**: -1, -2

### condition
**Path**: `chummer/qualities/quality/bonus/skillattribute/condition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 82-82 characters
- **Examples**:
  - `Involving pattern recognition, evidence analysis, clue hunting, or solving puzzles`

### max
**Path**: `chummer/qualities/quality/bonus/selectskill/max`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### nativelanguagelimit
**Path**: `chummer/qualities/quality/bonus/nativelanguagelimit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### mutant
**Path**: `chummer/qualities/quality/mutant`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`

### thresholdoffset
**Path**: `chummer/qualities/quality/bonus/conditionmonitor/thresholdoffset`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### power
**Path**: `chummer/qualities/quality/forbidden/oneof/power`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 15-15 characters
- **Examples**:
  - `Pain Resistance`

### mentallimit
**Path**: `chummer/qualities/quality/bonus/mentallimit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### physicallimit
**Path**: `chummer/qualities/quality/bonus/physicallimit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### name
**Path**: `chummer/qualities/quality/bonus/spelldicepool/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Heal`

### val
**Path**: `chummer/qualities/quality/bonus/spelldicepool/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### overflow
**Path**: `chummer/qualities/quality/bonus/conditionmonitor/overflow`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### martialart
**Path**: `chummer/qualities/quality/bonus/martialart`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 14-14 characters
- **Examples**:
  - `One Trick Pony`

### blockspelldescriptor
**Path**: `chummer/qualities/quality/bonus/blockspelldescriptor`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Spell`

### limitspellcategory
**Path**: `chummer/qualities/quality/bonus/limitspellcategory`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `Rituals`

### notoriety
**Path**: `chummer/qualities/quality/firstlevelbonus/notoriety`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### threshold
**Path**: `chummer/qualities/quality/bonus/conditionmonitor/threshold`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### cyberwaretotalessmultiplier
**Path**: `chummer/qualities/quality/bonus/cyberwaretotalessmultiplier`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `200`

### skillgroupcategorydisable
**Path**: `chummer/qualities/quality/bonus/skillgroupcategorydisable`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Social Active`

### streetcredmultiplier
**Path**: `chummer/qualities/quality/bonus/streetcredmultiplier`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `10`

### name
**Path**: `chummer/qualities/quality/bonus/skillgroupcategorykarmacostmultiplier/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 16-16 characters
- **Examples**:
  - `Technical Active`

### val
**Path**: `chummer/qualities/quality/bonus/skillgroupcategorykarmacostmultiplier/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `200`

### astralreputation
**Path**: `chummer/qualities/quality/bonus/astralreputation`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### val
**Path**: `chummer/qualities/quality/bonus/knowledgeskillpoints/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `5`

### exclude
**Path**: `chummer/qualities/quality/bonus/skillgroup/exclude`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Survival`

### condition
**Path**: `chummer/qualities/quality/bonus/skillcategorykarmacostmultiplier/condition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `create`

### condition
**Path**: `chummer/qualities/quality/bonus/skillcategoryspecializationkarmacostmultiplier/condition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `create`

### gear
**Path**: `chummer/qualities/quality/required/oneof/gear`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Fake SIN`

### max
**Path**: `chummer/qualities/quality/bonus/activeskillkarmacost/max`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `5`

### min
**Path**: `chummer/qualities/quality/bonus/activeskillkarmacost/min`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`

### val
**Path**: `chummer/qualities/quality/bonus/knowledgeskillkarmacostmin/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### max
**Path**: `chummer/qualities/quality/bonus/knowledgeskillkarmacostmin/max`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `5`

### condition
**Path**: `chummer/qualities/quality/bonus/knowledgeskillkarmacostmin/condition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `career`

### max
**Path**: `chummer/qualities/quality/bonus/knowledgeskillkarmacost/max`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `5`

### min
**Path**: `chummer/qualities/quality/bonus/knowledgeskillkarmacost/min`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`

### chargenlimit
**Path**: `chummer/qualities/quality/chargenlimit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### availability
**Path**: `chummer/qualities/quality/bonus/restrictedgear/availability`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `24`

### amount
**Path**: `chummer/qualities/quality/bonus/restrictedgear/amount`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### descriptor
**Path**: `chummer/qualities/quality/bonus/spelldescriptordamage/descriptor`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 16-16 characters
- **Examples**:
  - `Direct,NOT(Area)`

### val
**Path**: `chummer/qualities/quality/bonus/spelldescriptordamage/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### descriptor
**Path**: `chummer/qualities/quality/bonus/spelldescriptordrain/descriptor`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 16-16 characters
- **Examples**:
  - `Direct,NOT(Area)`

### val
**Path**: `chummer/qualities/quality/bonus/spelldescriptordrain/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### cyberwarecontains
**Path**: `chummer/qualities/quality/forbidden/oneof/cyberwarecontains`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Cybereyes`

### power
**Path**: `chummer/qualities/quality/costdiscount/required/oneof/power`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 17-17 characters
- **Examples**:
  - `Astral Perception`

### judgeintentionsoffense
**Path**: `chummer/qualities/quality/bonus/judgeintentionsoffense`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `-Rating`

### mentalmanipulationresist
**Path**: `chummer/qualities/quality/bonus/mentalmanipulationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `-Rating`

### manaillusionresist
**Path**: `chummer/qualities/quality/bonus/manaillusionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `-Rating`

### physicalillusionresist
**Path**: `chummer/qualities/quality/bonus/physicalillusionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `-Rating`

### decreaselogresist
**Path**: `chummer/qualities/quality/bonus/decreaselogresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `-Rating`

### decreaseintresist
**Path**: `chummer/qualities/quality/bonus/decreaseintresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `-Rating`

### detectionspellresist
**Path**: `chummer/qualities/quality/bonus/detectionspellresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `-Rating`

### firearmor
**Path**: `chummer/qualities/quality/bonus/firearmor`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### limbslot
**Path**: `chummer/qualities/quality/bonus/addlimb/limbslot`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `arm`

### val
**Path**: `chummer/qualities/quality/bonus/addlimb/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### defensetest
**Path**: `chummer/qualities/quality/bonus/defensetest`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### fadingresist
**Path**: `chummer/qualities/quality/bonus/fadingresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### loyalty
**Path**: `chummer/qualities/quality/bonus/addcontact/loyalty`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### connection
**Path**: `chummer/qualities/quality/bonus/addcontact/connection`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `5`

### critterpower
**Path**: `chummer/qualities/quality/required/oneof/critterpower`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Essence Drain`

### essencemax
**Path**: `chummer/qualities/quality/bonus/essencemax`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### prototypetranshuman
**Path**: `chummer/qualities/quality/bonus/prototypetranshuman`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### value
**Path**: `chummer/qualities/quality/bonus/weaponskillaccuracy/value`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### attribute
**Path**: `chummer/qualities/quality/bonus/swapskillattribute/attribute`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `INT`

### limittoskill
**Path**: `chummer/qualities/quality/bonus/swapskillattribute/limittoskill`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Etiquette`

### judgeintentionsdefense
**Path**: `chummer/qualities/quality/bonus/judgeintentionsdefense`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### attribute
**Path**: `chummer/qualities/quality/bonus/swapskillspecattribute/attribute`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `LOG`

### limittoskill
**Path**: `chummer/qualities/quality/bonus/swapskillspecattribute/limittoskill`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 11-11 characters
- **Examples**:
  - `Negotiation`

### spec
**Path**: `chummer/qualities/quality/bonus/swapskillspecattribute/spec`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Diplomacy`

### addspell
**Path**: `chummer/qualities/quality/bonus/addspell`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 16-16 characters
- **Examples**:
  - `Alter Ballistics`

### initiategrade
**Path**: `chummer/qualities/quality/required/allof/initiategrade`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### metamagicart
**Path**: `chummer/qualities/quality/required/allof/metamagicart`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 11-11 characters
- **Examples**:
  - `Blood Magic`

### metamagic
**Path**: `chummer/qualities/quality/required/oneof/metamagic`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Spell Shaping`

### bonus
**Path**: `chummer/qualities/quality/bonus/weaponcategorydv/bonus`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### newspellkarmacost
**Path**: `chummer/qualities/quality/bonus/newspellkarmacost`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### critterpower
**Path**: `chummer/qualities/quality/required/allof/critterpower`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 12-12 characters
- **Examples**:
  - `Dual Natured`

### name
**Path**: `chummer/qualities/quality/required/oneof/spelldescriptor/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Elemental`

### count
**Path**: `chummer/qualities/quality/required/oneof/spelldescriptor/count`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `5`

### type
**Path**: `chummer/qualities/quality/required/allof/skill/type`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Knowledge`

### allowspellcategory
**Path**: `chummer/qualities/quality/bonus/allowspellcategory`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `Rituals`

### adeptpowerpoints
**Path**: `chummer/qualities/quality/bonus/adeptpowerpoints`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### drainvalue
**Path**: `chummer/qualities/quality/bonus/drainvalue`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### availability
**Path**: `chummer/qualities/quality/bonus/availability`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### name
**Path**: `chummer/qualities/quality/bonus/addware/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 11-11 characters
- **Examples**:
  - `Busted Ware`

### grade
**Path**: `chummer/qualities/quality/bonus/addware/grade`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `None`

### type
**Path**: `chummer/qualities/quality/bonus/addware/type`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Cyberware`

### specialattburnmultiplier
**Path**: `chummer/qualities/quality/bonus/specialattburnmultiplier`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `20`

### addecho
**Path**: `chummer/qualities/quality/bonus/addecho`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 16-16 characters
- **Examples**:
  - `Sourcerer Daemon`

### rating
**Path**: `chummer/qualities/quality/bonus/addgear/rating`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`

### submersiongrade
**Path**: `chummer/qualities/quality/required/allof/submersiongrade`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### contactkarmaminimum
**Path**: `chummer/qualities/quality/bonus/contactkarmaminimum`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### contributetobp
**Path**: `chummer/qualities/quality/contributetobp`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `False`

## Attributes

### power@select
**Path**: `chummer/qualities/quality/bonus/critterpowers/power@select`

- **Count**: 220
- **Unique Values**: 38
- **Enum Candidate**: Yes
- **Examples**:
  - `Sunlight, Mild`
  - `Metahuman Flesh`
  - `Age`
  - `Sunlight, Severe`
  - `Metahuman Blood`

### optionalpower@select
**Path**: `chummer/qualities/quality/bonus/optionalpowers/optionalpower@select`

- **Count**: 47
- **Unique Values**: 10
- **Enum Candidate**: Yes
- **Examples**:
  - `Hearing`
  - `Toxins`
  - `Smell`
  - `Pathogens`
  - `Hearing`
- **All Values**: Fire, Hearing, Low-Light Vision, Lowlight Vision, Pathogens, Smell, Taste, Thermographic Vision, Toxins, Visual Acuity

### bonus@useselected
**Path**: `chummer/qualities/quality/bonus@useselected`

- **Count**: 23
- **Unique Values**: 1
- **Examples**:
  - `False`
  - `False`
  - `False`
  - `False`
  - `False`

### quality@contributetobp
**Path**: `chummer/qualities/quality/bonus/selectquality/quality@contributetobp`

- **Count**: 17
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### quality@forced
**Path**: `chummer/qualities/quality/bonus/selectquality/quality@forced`

- **Count**: 17
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### initiativepass@precedence
**Path**: `chummer/qualities/quality/bonus/initiativepass@precedence`

- **Count**: 13
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `0`
  - `-1`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: -1, 0

### quality@discount
**Path**: `chummer/qualities/quality/bonus/selectquality/discountqualities/quality@discount`

- **Count**: 13
- **Unique Values**: 5
- **Enum Candidate**: Yes
- **Examples**:
  - `-1`
  - `-2`
  - `-3`
  - `-3`
  - `-3`
- **All Values**: -1, -2, -3, -4, -8

### fadingvalue@specific
**Path**: `chummer/qualities/quality/bonus/fadingvalue@specific`

- **Count**: 13
- **Unique Values**: 13
- **Enum Candidate**: Yes
- **Examples**:
  - `Diffusion of [Matrix Attribute]`
  - `Infusion of [Matrix Attribute]`
  - `Puppeteer`
  - `Resonance Channel`
  - `Resonance Spike`
- **All Values**: Bootleg Program, Causal Nexus, Diffusion of [Matrix Attribute], Dissonance Spike, FAQ, Infusion of [Matrix Attribute], LOTO, Puppeteer, Redundancy, Resonance Channel, Resonance Spike, Resonance Veil, Search History

### selecttext@xml
**Path**: `chummer/qualities/quality/bonus/selecttext@xml`

- **Count**: 10
- **Unique Values**: 6
- **Enum Candidate**: Yes
- **Examples**:
  - `traditions.xml`
  - `lifemodules.xml`
  - `lifemodules.xml`
  - `traditions.xml`
  - `skills.xml`
- **All Values**: actions.xml, lifemodules.xml, metatypes.xml, skills.xml, strings.xml, traditions.xml

### selecttext@xpath
**Path**: `chummer/qualities/quality/bonus/selecttext@xpath`

- **Count**: 10
- **Unique Values**: 9
- **Examples**:
  - `/chummer/spirits/spirit[not(contains(name, 'Watcher') or contains(name, 'Homunculus'))]`
  - `/chummer/storybuilder/macros/mega/persistent/* \| /chummer/storybuilder/macros/megadoublea/persistent/*`
  - `/chummer/storybuilder/macros/mega/persistent/* \| /chummer/storybuilder/macros/megadoublea/persistent/*`
  - `/chummer/spirits/spirit`
  - `/chummer/skillgroups/* \| /chummer/skills/skill`

### power@rating
**Path**: `chummer/qualities/quality/bonus/critterpowers/power@rating`

- **Count**: 10
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `2`
  - `2`
- **All Values**: 1, 2

### selecttext@allowedit
**Path**: `chummer/qualities/quality/bonus/selecttext@allowedit`

- **Count**: 9
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### ess@grade
**Path**: `chummer/qualities/quality/required/oneof/ess@grade`

- **Count**: 8
- **Unique Values**: 8
- **Enum Candidate**: Yes
- **Examples**:
  - `Betaware,Deltaware,Gammaware`
  - `Used`
  - `Standard`
  - `Alphaware`
  - `Betaware`
- **All Values**: Alphaware, Betaware, Betaware,Deltaware,Gammaware, Deltaware, Gammaware, Omegaware, Standard, Used

### armor@group
**Path**: `chummer/qualities/quality/bonus/armor@group`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`
  - `0`

### addmetamagic@forced
**Path**: `chummer/qualities/quality/bonus/addmetamagic@forced`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`

### selectskill@limittoskill
**Path**: `chummer/qualities/quality/bonus/selectskill@limittoskill`

- **Count**: 2
- **Unique Values**: 2
- **Examples**:
  - `Artisan,Performance`
  - `Compiling,Computer,Cybercombat,Decompiling,Electronic Warfare,Hacking,Registering,Software`

### initiative@precedence
**Path**: `chummer/qualities/quality/bonus/initiative@precedence`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`

### unlockskills@name
**Path**: `chummer/qualities/quality/bonus/unlockskills@name`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `Assensing`
  - `Assensing`

### addquality@select
**Path**: `chummer/qualities/quality/bonus/addqualities/addquality@select`

- **Count**: 2
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Black Forest: You Know a Guy`
  - `Black Forest: Street Politics`
- **All Values**: Black Forest: Street Politics, Black Forest: You Know a Guy

### lifestylecost@lifestyle
**Path**: `chummer/qualities/quality/bonus/lifestylecost@lifestyle`

- **Count**: 2
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Low`
  - `Squatter`
- **All Values**: Low, Squatter

### lifestylecost@condition
**Path**: `chummer/qualities/quality/bonus/lifestylecost@condition`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `once`
  - `once`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema qualities.xsd`

### actiondicepool@category
**Path**: `chummer/qualities/quality/bonus/actiondicepool@category`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Matrix`

### selectskill@minimumrating
**Path**: `chummer/qualities/quality/bonus/selectskill@minimumrating`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `4`

### selectexpertise@limittoskill
**Path**: `chummer/qualities/quality/bonus/selectexpertise@limittoskill`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Artisan`

### gear@minrating
**Path**: `chummer/qualities/quality/required/oneof/gear@minrating`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `4`

### selectskill@excludecategory
**Path**: `chummer/qualities/quality/bonus/weaponskillaccuracy/selectskill@excludecategory`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Combat Active`

### addspell@alchemical
**Path**: `chummer/qualities/quality/bonus/addspell@alchemical`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

### freespells@attribute
**Path**: `chummer/qualities/quality/bonus/freespells@attribute`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `MAG`

### freespells@limit
**Path**: `chummer/qualities/quality/bonus/freespells@limit`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `half,touchonly`

### selectskill@limittoskill
**Path**: `chummer/qualities/quality/bonus/weaponcategorydv/selectskill@limittoskill`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Astral Combat,Blades,Clubs,Exotic Melee Weapon,Unarmed Combat`

### freespells@skill
**Path**: `chummer/qualities/quality/bonus/freespells@skill`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Spellcasting`

### newspellkarmacost@type
**Path**: `chummer/qualities/quality/bonus/newspellkarmacost@type`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Spells`

### limitspellcategory@exclude
**Path**: `chummer/qualities/quality/bonus/limitspellcategory@exclude`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Rituals`

### addquality@forced
**Path**: `chummer/qualities/quality/bonus/addqualities/addquality@forced`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

### availability@condition
**Path**: `chummer/qualities/quality/bonus/availability@condition`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `career`

### nuyenamt@condition
**Path**: `chummer/qualities/quality/bonus/nuyenamt@condition`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Stolen`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 2 unique values
  - Values: Negative, Positive
- **category** (`chummer/qualities/quality/category`): 2 unique values
  - Values: Negative, Positive
- **limit** (`chummer/qualities/quality/limit`): 11 unique values
  - Values: 10, 11, 15, 2, 20, 3, 4, 5, 6, False, {arm} - 1
- **source** (`chummer/qualities/quality/source`): 22 unique values
  - Values: AP, BB, CA, CF, DT, FA, HS, HT, KC, NF, R5, RF, RG, SAG, SASS, SG, SL, SR5, TCT, TSG
- **name** (`chummer/qualities/quality/bonus/skillattribute/name`): 2 unique values
  - Values: INT, LOG
- **bonus** (`chummer/qualities/quality/bonus/skillattribute/bonus`): 2 unique values
  - Values: -Rating, 2
- **metatype** (`chummer/qualities/quality/required/oneof/metatype`): 10 unique values
  - Values: A.I., Centaur, Dwarf, Elf, Human, Naga, Ork, Pixie, Sasquatch, Troll
- **notoriety** (`chummer/qualities/quality/bonus/notoriety`): 3 unique values
  - Values: -1, 1, 3
- **name** (`chummer/qualities/quality/bonus/specificskill/name`): 25 unique values
  - Values: Animal Handling, Artisan, Assensing, Computer, Con, Decompiling, Diving, Etiquette, Exotic Melee Weapon, Gunnery, Gymnastics, Hacking, Negotiation, Perception, Registering, Running, Sneaking, Software, Survival, Swimming
- **bonus** (`chummer/qualities/quality/bonus/specificskill/bonus`): 5 unique values
  - Values: -1, -2, 1, 2, 3
- **excludeattribute** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/excludeattribute`): 8 unique values
  - Values: AGI, BOD, DEP, EDG, MAG, REA, RES, STR
- **max** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/max`): 2 unique values
  - Values: 1, 96
- **name** (`chummer/qualities/quality/bonus/skillcategory/name`): 9 unique values
  - Values: Academic, Combat Active, Interest, Language, Physical Active, Professional, Social Active, Street, Vehicle Active
- **bonus** (`chummer/qualities/quality/bonus/skillcategory/bonus`): 7 unique values
  - Values: -1, -2, -3, -Rating, 1, 2, 3
- **power** (`chummer/qualities/quality/required/oneof/power`): 4 unique values
  - Values: Adept Spell, Empathic Healing, Killing Hands, Rapid Healing
- **bioware** (`chummer/qualities/quality/forbidden/oneof/bioware`): 10 unique values
  - Values: Damage Compensators, Damage Compensators (2050), Genetic Optimization (Agility), Genetic Optimization (Body), Genetic Optimization (Charisma), Genetic Optimization (Intuition), Genetic Optimization (Logic), Genetic Optimization (Reaction), Genetic Optimization (Strength), Genetic Optimization (Willpower)
- **name** (`chummer/qualities/quality/includeinlimit/name`): 5 unique values
  - Values: Indomitable (Mental), Indomitable (Physical), Indomitable (Social), Tough as Nails (Physical), Tough as Nails (Stun)
- **sociallimit** (`chummer/qualities/quality/bonus/sociallimit`): 2 unique values
  - Values: 1, 2
- **name** (`chummer/qualities/quality/bonus/specificattribute/name`): 10 unique values
  - Values: AGI, BOD, CHA, DEP, EDG, INT, LOG, REA, STR, WIL
- **max** (`chummer/qualities/quality/bonus/specificattribute/max`): 5 unique values
  - Values: -1, -2, 1, 3, 99
- **spellresistance** (`chummer/qualities/quality/bonus/spellresistance`): 2 unique values
  - Values: 1, 2
- **metatype** (`chummer/qualities/quality/forbidden/oneof/metatype`): 5 unique values
  - Values: Centaur, Human, Naga, Pixie, Sasquatch
- **metatypecategory** (`chummer/qualities/quality/forbidden/oneof/metatypecategory`): 2 unique values
  - Values: Metasapient, Shapeshifter
- **memory** (`chummer/qualities/quality/bonus/memory`): 3 unique values
  - Values: -Rating, 1, 2
- **physicalcmrecovery** (`chummer/qualities/quality/bonus/physicalcmrecovery`): 2 unique values
  - Values: -2, 2
- **stuncmrecovery** (`chummer/qualities/quality/bonus/stuncmrecovery`): 2 unique values
  - Values: -2, 2
- **pathogencontactresist** (`chummer/qualities/quality/bonus/pathogencontactresist`): 3 unique values
  - Values: -2, 1, 2
- **pathogeningestionresist** (`chummer/qualities/quality/bonus/pathogeningestionresist`): 3 unique values
  - Values: -2, 1, 2
- **pathogeninhalationresist** (`chummer/qualities/quality/bonus/pathogeninhalationresist`): 3 unique values
  - Values: -2, 1, 2
- **pathogeninjectionresist** (`chummer/qualities/quality/bonus/pathogeninjectionresist`): 3 unique values
  - Values: -2, 1, 2
- **toxincontactresist** (`chummer/qualities/quality/bonus/toxincontactresist`): 4 unique values
  - Values: -1, -2, 1, 2
- **toxiningestionresist** (`chummer/qualities/quality/bonus/toxiningestionresist`): 4 unique values
  - Values: -1, -2, 1, 2
- **toxininhalationresist** (`chummer/qualities/quality/bonus/toxininhalationresist`): 4 unique values
  - Values: -1, -2, 1, 2
- **toxininjectionresist** (`chummer/qualities/quality/bonus/toxininjectionresist`): 4 unique values
  - Values: -1, -2, 1, 2
- **damageresistance** (`chummer/qualities/quality/bonus/damageresistance`): 3 unique values
  - Values: 1, 2, 4
- **surprise** (`chummer/qualities/quality/bonus/surprise`): 3 unique values
  - Values: -3, -Rating, 3
- **name** (`chummer/qualities/quality/bonus/enableattribute/name`): 2 unique values
  - Values: MAG, RES
- **name** (`chummer/qualities/quality/bonus/enabletab/name`): 4 unique values
  - Values: adept, critter, magician, technomancer
- **unlockskills** (`chummer/qualities/quality/bonus/unlockskills`): 10 unique values
  - Values: Adept, Aware, Conjuring, Enchanting, Explorer, Magician, Name, Sorcery, Sorcery,Conjuring,Enchanting, Technomancer
- **nameonpage** (`chummer/qualities/quality/nameonpage`): 5 unique values
  - Values: Adepts, Aspected Magicians, Magicians, Mystic Adepts, Special Modifications
- **name** (`chummer/qualities/quality/bonus/addgear/name`): 2 unique values
  - Values: Fake SIN, Living Persona
- **category** (`chummer/qualities/quality/bonus/addgear/category`): 2 unique values
  - Values: Commlinks, ID/Credsticks
- **condition** (`chummer/qualities/quality/bonus/specificskill/condition`): 23 unique values
  - Values: Combat maneuvers, Communities of majority orks and/or trolls, Companion Sprite, Fault Sprite, Generalist Sprite, Groups of exclusively orks and/or trolls, Hearing, Hiding in a crowd, Hot-Sim, Items specifically for orks and/or trolls, Machine Sprite, Matrix Perception, Matters of life or death, Not Urban, Scent, Taste, Touch, Urban, Visual, With plausible-seeming evidence
- **lifestylecost** (`chummer/qualities/quality/bonus/lifestylecost`): 7 unique values
  - Values: -10, -100, -20, -50, 10, 20, 30
- **metatype** (`chummer/qualities/quality/required/allof/metatype`): 9 unique values
  - Values: Centaur, Dwarf, Elf, Human, Naga, Ork, Pixie, Sasquatch, Troll
- **val** (`chummer/qualities/quality/bonus/selectskill/val`): 2 unique values
  - Values: -2, 1
- **name** (`chummer/qualities/quality/bonus/skillcategorykarmacostmultiplier/name`): 4 unique values
  - Values: Academic, Professional, Social Active, Technical Active
- **val** (`chummer/qualities/quality/bonus/skillcategorykarmacostmultiplier/val`): 2 unique values
  - Values: 200, 50
- **name** (`chummer/qualities/quality/bonus/skillcategorypointcostmultiplier/name`): 5 unique values
  - Values: Academic, Language, Professional, Social Active, Street
- **val** (`chummer/qualities/quality/bonus/skillcategorypointcostmultiplier/val`): 2 unique values
  - Values: 200, 50
- **blockskillcategorydefaulting** (`chummer/qualities/quality/bonus/blockskillcategorydefaulting`): 3 unique values
  - Values: Academic, Professional, Technical Active
- **name** (`chummer/qualities/quality/bonus/skillcategoryspecializationkarmacostmultiplier/name`): 3 unique values
  - Values: Academic, Professional, Technical Active
- **val** (`chummer/qualities/quality/bonus/skillcategoryspecializationkarmacostmultiplier/val`): 2 unique values
  - Values: 200, 50
- **name** (`chummer/qualities/quality/bonus/focusbindingkarmacost/name`): 2 unique values
  - Values: Qi Focus, Weapon Focus
- **extracontains** (`chummer/qualities/quality/bonus/focusbindingkarmacost/extracontains`): 50 unique values
  - Values: Improved Ability (skill) (Aeronautics Mechanic), Improved Ability (skill) (Automotive Mechanic), Improved Ability (skill) (Cybercombat), Improved Ability (skill) (First Aid), Improved Ability (skill) (Flight), Improved Ability (skill) (Free-Fall), Improved Ability (skill) (Gunnery), Improved Ability (skill) (Hacking), Improved Ability (skill) (Impersonation), Improved Ability (skill) (Instruction), Improved Ability (skill) (Leadership), Improved Ability (skill) (Nautical Mechanic), Improved Ability (skill) (Negotiation), Improved Ability (skill) (Palming), Improved Ability (skill) (Pilot Aerospace), Improved Ability (skill) (Pilot Aircraft), Improved Ability (skill) (Pilot Watercraft), Improved Ability (skill) (Running), Improved Ability (skill) (Software), Improved Ability (skill) (Tracking)
- **quality** (`chummer/qualities/quality/costdiscount/required/oneof/quality`): 12 unique values
  - Values: Adept, Animal Familiar, Apprentice, Aspected Magician, Aware, Enchanter, Explorer, Infected: Mutaqua, Infected: Nosferatu, Infected: Wendigo, Magician, Mystic Adept
- **value** (`chummer/qualities/quality/costdiscount/value`): 4 unique values
  - Values: -10, -3, -5, 10
- **ess** (`chummer/qualities/quality/required/allof/ess`): 2 unique values
  - Values: -5, -5.0001
- **name** (`chummer/qualities/quality/bonus/skillgroup/name`): 7 unique values
  - Values: Close Combat, Conjuring, Electronics, Engineering, Influence, Outdoors, Stealth
- **bonus** (`chummer/qualities/quality/bonus/skillgroup/bonus`): 4 unique values
  - Values: -2, -4, 1, 2
- **limit** (`chummer/qualities/quality/bonus/limitmodifier/limit`): 2 unique values
  - Values: Mental, Social
- **value** (`chummer/qualities/quality/bonus/limitmodifier/value`): 4 unique values
  - Values: -1, 1, 2, 3
- **condition** (`chummer/qualities/quality/bonus/limitmodifier/condition`): 7 unique values
  - Values: LimitCondition_ExcludeIntimidation, LimitCondition_Megacorp, LimitCondition_NationalLanguageRanks, LimitCondition_QualityChatty, LimitCondition_QualityTrustworthy, LimitCondition_SkillsKnowledgeAcademic, LimitCondition_Sprawl
- **nuyenmaxbp** (`chummer/qualities/quality/bonus/nuyenmaxbp`): 2 unique values
  - Values: -1, 30
- **condition** (`chummer/qualities/quality/bonus/skillgroup/condition`): 8 unique values
  - Values: Desert, Forest, Jungle, Mountain, Polar, Rural, Urban, When in hosts
- **name** (`chummer/qualities/quality/bonus/skillcategorykarmacost/name`): 4 unique values
  - Values: Academic, Language, Professional, Street
- **publicawareness** (`chummer/qualities/quality/bonus/publicawareness`): 4 unique values
  - Values: 2, 3, 5, 8
- **val** (`chummer/qualities/quality/bonus/activeskillkarmacost/val`): 2 unique values
  - Values: -1, 2
- **val** (`chummer/qualities/quality/bonus/knowledgeskillkarmacost/val`): 2 unique values
  - Values: -1, 2
- **dodge** (`chummer/qualities/quality/bonus/dodge`): 3 unique values
  - Values: -Rating, 1, 2
- **initiative** (`chummer/qualities/quality/bonus/initiative`): 2 unique values
  - Values: 1, 2
- **physical** (`chummer/qualities/quality/bonus/conditionmonitor/physical`): 4 unique values
  - Values: -1, -2, 1, 2
- **stun** (`chummer/qualities/quality/bonus/conditionmonitor/stun`): 2 unique values
  - Values: -1, 1
- **trustfund** (`chummer/qualities/quality/bonus/trustfund`): 4 unique values
  - Values: 1, 2, 3, 4
- **exclude** (`chummer/qualities/quality/bonus/skillcategory/exclude`): 3 unique values
  - Values: Gunnery, Intimidation, Perception
- **physiologicaladdictionfirsttime** (`chummer/qualities/quality/bonus/physiologicaladdictionfirsttime`): 4 unique values
  - Values: -1, -2, -Rating, 2
- **physiologicaladdictionalreadyaddicted** (`chummer/qualities/quality/bonus/physiologicaladdictionalreadyaddicted`): 3 unique values
  - Values: -1, -2, -Rating
- **addquality** (`chummer/qualities/quality/bonus/addqualities/addquality`): 6 unique values
  - Values: Distinctive Style, High Pain Tolerance, Home Ground, Magic Resistance, SINner (Criminal), Wanted
- **nuyenamt** (`chummer/qualities/quality/bonus/nuyenamt`): 2 unique values
  - Values: 10000, 5000
- **attributemaxclamp** (`chummer/qualities/quality/firstlevelbonus/attributemaxclamp`): 4 unique values
  - Values: AGI, BOD, REA, STR
- **addweapon** (`chummer/qualities/quality/addweapon`): 10 unique values
  - Values: Bite (Naga), Digging Claws, Fangs, Functional Tail (Thagomizer), Goring Horns, Kick (Centaur), Larger Tusks, Raptor Beak, Razor Claws, Retractable Claws
- **coldarmor** (`chummer/qualities/quality/bonus/coldarmor`): 2 unique values
  - Values: 2, 4
- **unarmeddv** (`chummer/qualities/quality/bonus/unarmeddv`): 2 unique values
  - Values: 1, 2
- **category** (`chummer/qualities/quality/bonus/movementreplace/category`): 2 unique values
  - Values: Fly, Ground
- **speed** (`chummer/qualities/quality/bonus/movementreplace/speed`): 3 unique values
  - Values: run, sprint, walk
- **val** (`chummer/qualities/quality/bonus/movementreplace/val`): 6 unique values
  - Values: 1, 2, 3, 50, 500, 6
- **armor** (`chummer/qualities/quality/bonus/armor`): 4 unique values
  - Values: 1, 2, 3, 4
- **reach** (`chummer/qualities/quality/bonus/reach`): 2 unique values
  - Values: -1, 1
- **min** (`chummer/qualities/quality/bonus/specificattribute/min`): 2 unique values
  - Values: -1, 1
- **quality** (`chummer/qualities/quality/required/allof/quality`): 9 unique values
  - Values: Crystal Limb (Arm), Crystalline Claws, Fangs, Mage Hunter I, Mage Hunter II, Records on File, Spirit Hunter I, Spirit Hunter II, Technomancer
- **name** (`chummer/qualities/quality/naturalweapons/naturalweapon/name`): 10 unique values
  - Values: Crystal Claw, Crystal Jaw, Crystalline Blade, Crystalline Shards, Dracoform Claws, Dracoform Fangs, Dracoform Horns, Dracoform Tail, Infected Bite, Infected Claws
- **reach** (`chummer/qualities/quality/naturalweapons/naturalweapon/reach`): 3 unique values
  - Values: -1, 0, 1
- **damage** (`chummer/qualities/quality/naturalweapons/naturalweapon/damage`): 3 unique values
  - Values: ({STR}+1)P, ({STR}+2)P, ({STR}+3)P
- **ap** (`chummer/qualities/quality/naturalweapons/naturalweapon/ap`): 4 unique values
  - Values: -1, -2, -4, 4
- **useskill** (`chummer/qualities/quality/naturalweapons/naturalweapon/useskill`): 2 unique values
  - Values: Throwing Weapons, Unarmed Combat
- **source** (`chummer/qualities/quality/naturalweapons/naturalweapon/source`): 3 unique values
  - Values: FA, HS, RF
- **page** (`chummer/qualities/quality/naturalweapons/naturalweapon/page`): 3 unique values
  - Values: 133, 137, 163
- **power** (`chummer/qualities/quality/bonus/critterpowers/power`): 43 unique values
  - Values: Adaptive Coloration, Animal Control, Compulsion, Concealment, Dual Natured, Elemental Attack, Empathy, Essence Loss, Fear, Immunity, Induced Dormancy, Innate Spell, Noxious Breath, Paralyzing Howl, Realistic Form, Reduced Sense, Regeneration, Venom, Vestigial Wings, Wall Walking
- **limitcritterpowercategory** (`chummer/qualities/quality/bonus/limitcritterpowercategory`): 2 unique values
  - Values: Drake, Infected
- **name** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/name`): 8 unique values
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL
- **min** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/min`): 7 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6
- **max** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/max`): 15 unique values
  - Values: 0, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9
- **aug** (`chummer/qualities/quality/bonus/replaceattributes/replaceattribute/aug`): 15 unique values
  - Values: 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 6, 7, 8, 9
- **attribute** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/attribute`): 8 unique values
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL
- **optionalpower** (`chummer/qualities/quality/bonus/optionalpowers/optionalpower`): 4 unique values
  - Values: Armor, Enhanced Senses, Fear, Immunity
- **category** (`chummer/qualities/quality/bonus/walkmultiplier/category`): 2 unique values
  - Values: Ground, Swim
- **val** (`chummer/qualities/quality/bonus/specificattribute/val`): 3 unique values
  - Values: -1, 1, 2
- **critterpower** (`chummer/qualities/quality/forbidden/oneof/critterpower`): 8 unique values
  - Values: Compulsion, Fear, Influence, Magical Guard, Mimicry, Paralyzing Howl, Psychokinesis, Regeneration
- **quality** (`chummer/qualities/quality/bonus/selectquality/discountqualities/quality`): 13 unique values
  - Values: Astral Hazing, Berserker, Bioluminescence, Cold-Blooded, Critter Spook, Cyclopean Eye, Impaired Attribute (Charisma), Impaired Attribute (Intuition), Impaired Attribute (Logic), Impaired Attribute (Willpower), Scales, Scent Glands, Third Eye
- **name** (`chummer/qualities/quality/required/oneof/skill/name`): 18 unique values
  - Values: Alchemy, Animal Handling, Artificing, Assensing, Astral Combat, Banishing, Binding, Counterspelling, Disenchanting, Hacking, Magical Theory, Magical Theory (Academic), Magical Theory (Street), Palming, Performance, Ritual Spellcasting, Spellcasting, Summoning
- **val** (`chummer/qualities/quality/required/oneof/skill/val`): 12 unique values
  - Values: 1, 10, 11, 12, 14, 3, 4, 5, 6, 7, 8, 9
- **cyberwareessmultiplier** (`chummer/qualities/quality/bonus/cyberwareessmultiplier`): 2 unique values
  - Values: 120, 90
- **biowareessmultiplier** (`chummer/qualities/quality/bonus/biowareessmultiplier`): 2 unique values
  - Values: 120, 90
- **cyberseeker** (`chummer/qualities/quality/bonus/cyberseeker`): 4 unique values
  - Values: AGI, BOX, STR, WIL
- **psychologicaladdictionfirsttime** (`chummer/qualities/quality/bonus/psychologicaladdictionfirsttime`): 3 unique values
  - Values: -1, -2, 2
- **disablebiowaregrade** (`chummer/qualities/quality/bonus/disablebiowaregrade`): 5 unique values
  - Values: Alphaware, Omegaware, Standard, Standard (Burnout's Way), Used
- **disablecyberwaregrade** (`chummer/qualities/quality/bonus/disablecyberwaregrade`): 12 unique values
  - Values: Alphaware, Alphaware (Adapsin), Greyware, Greyware (Adapsin), Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)
- **ess** (`chummer/qualities/quality/required/oneof/ess`): 2 unique values
  - Values: 0.0001, 1
- **psychologicaladdictionalreadyaddicted** (`chummer/qualities/quality/bonus/psychologicaladdictionalreadyaddicted`): 2 unique values
  - Values: -1, -2
- **category** (`chummer/qualities/quality/bonus/dealerconnection/category`): 4 unique values
  - Values: Aircraft, Drones, Groundcraft, Watercraft
- **skillgroupdisable** (`chummer/qualities/quality/bonus/skillgroupdisable`): 3 unique values
  - Values: Conjuring, Enchanting, Sorcery
- **name** (`chummer/qualities/quality/required/allof/skill/name`): 14 unique values
  - Values: Alchemy, Arcana, Armorer, Artisan, Assensing, Astral Combat, Binding, Chemistry, Counterspelling, First Aid, Industrial Mechanic, Leadership, Ritual Spellcasting, Zoology
- **val** (`chummer/qualities/quality/required/allof/skill/val`): 4 unique values
  - Values: 3, 4, 5, 6
- **spec** (`chummer/qualities/quality/required/oneof/skill/spec`): 13 unique values
  - Values: Astral Barriers, Aura Reading, Combat, Health, Illusion, Magic, Manipulation, Prestidigitation, Spirits, Spirits of Air, Spirits of Earth, Spirits of Fire, Spirits of Water
- **name** (`chummer/qualities/quality/required/allof/spellcategory/name`): 5 unique values
  - Values: Combat, Detection, Health, Illusion, Manipulation
- **name** (`chummer/qualities/quality/required/oneof/group/skill/name`): 15 unique values
  - Values: Alchemy, Arcana, Assensing, Astral Combat, Counterspelling, Magical Theory, Magical Theory (Academic), Magical Theory (Street), Magical Traditions, Psychology, Ritual Spellcasting, Spellcasting, Summoning, Unarmed Combat, Zoology
- **val** (`chummer/qualities/quality/required/oneof/group/skill/val`): 9 unique values
  - Values: 1, 2, 3, 4, 5, 6, 7, 8, 9
- **spec** (`chummer/qualities/quality/required/oneof/group/skill/spec`): 9 unique values
  - Values: Aura Reading, Manipulation, Spell Design, Spirits, Spirits of Air, Spirits of Earth, Spirits of Fire, Spirits of Water, [Martial Art]
- **tradition** (`chummer/qualities/quality/required/oneof/group/tradition`): 6 unique values
  - Values: Buddhism, Chaos Magic, Islam, Sioux, Wicca, Wuxing
- **allowspellrange** (`chummer/qualities/quality/bonus/allowspellrange`): 2 unique values
  - Values: T, T (A)
- **quality** (`chummer/qualities/quality/required/oneof/group/quality`): 2 unique values
  - Values: Adept, Mystic Adept
- **skilldisable** (`chummer/qualities/quality/bonus/skilldisable`): 6 unique values
  - Values: Alchemy, Artificing, Binding, Ritual Spellcasting, Spellcasting, Summoning
- **power** (`chummer/qualities/quality/required/oneof/group/power`): 2 unique values
  - Values: Killing Hands, Nerve Strike
- **val** (`chummer/qualities/quality/bonus/spellcategorydrain/val`): 2 unique values
  - Values: -2, 1
- **quality** (`chummer/qualities/quality/forbidden/allof/quality`): 2 unique values
  - Values: Adept, Mystic Adept
- **power** (`chummer/qualities/quality/required/allof/power`): 7 unique values
  - Values: Cool Resolve, Counterstrike, Critical Strike, Elemental Body, Elemental Strike, Killing Hands, Missile Parry
- **spell** (`chummer/qualities/quality/required/oneof/group/spell`): 2 unique values
  - Values: Shapechange, [Critter] Form
- **spell** (`chummer/qualities/quality/required/oneof/spell`): 2 unique values
  - Values: Shapechange, [Critter] Form
- **spell** (`chummer/qualities/quality/required/allof/spell`): 3 unique values
  - Values: Create Ally Spirit, Fling, [Critter] Form
- **tradition** (`chummer/qualities/quality/required/oneof/group/grouponeof/tradition`): 2 unique values
  - Values: Black Magic, Black Magic [Alt]
- **essencepenaltyt100** (`chummer/qualities/quality/bonus/essencepenaltyt100`): 4 unique values
  - Values: -100, -150, -200, -50
- **essencepenaltymagonlyt100** (`chummer/qualities/quality/bonus/essencepenaltymagonlyt100`): 4 unique values
  - Values: 100, 150, 200, 50
- **fatigueresist** (`chummer/qualities/quality/bonus/fatigueresist`): 4 unique values
  - Values: 1, 2, 3, 4
- **spirit** (`chummer/qualities/quality/bonus/limitspiritcategory/spirit`): 4 unique values
  - Values: Spirit of Air, Spirit of Earth, Spirit of Fire, Spirit of Water
- **addmetamagic** (`chummer/qualities/quality/bonus/addmetamagic`): 3 unique values
  - Values: Psychometry, Reflection, Sensing
- **attack** (`chummer/qualities/quality/bonus/livingpersona/attack`): 2 unique values
  - Values: -1, 2
- **dataprocessing** (`chummer/qualities/quality/bonus/livingpersona/dataprocessing`): 2 unique values
  - Values: -1, 2
- **firewall** (`chummer/qualities/quality/bonus/livingpersona/firewall`): 2 unique values
  - Values: -1, 2
- **sleaze** (`chummer/qualities/quality/bonus/livingpersona/sleaze`): 2 unique values
  - Values: -1, 2
- **contactkarma** (`chummer/qualities/quality/bonus/contactkarma`): 2 unique values
  - Values: -1, -2
- **id** (`chummer/xpathqueries/query/id`): 7 unique values
  - Values: 02d0c37b-c3c4-4892-ad32-c91e4de72742, 33868824-d80c-4db5-baee-d993d87fc70a, 3b5fca95-9f04-4815-999a-a35fca1f856a, 5760ec8d-f7ca-4290-8f9f-c711da200353, bc8adb44-f2a6-43c6-b3e8-e0825209f86c, cdd640dc-5b69-45a5-8d5e-5367ed3dddbc, d6a8a731-0225-4123-9388-212024bacd35
- **display** (`chummer/xpathqueries/query/display`): 7 unique values
  - Values: String_SelectQuality_XPathQuery_AddQualityBonus, String_SelectQuality_XPathQuery_KarmaRange, String_SelectQuality_XPathQuery_MetagenicOnly, String_SelectQuality_XPathQuery_NegativeOnly, String_SelectQuality_XPathQuery_PositiveOnly, String_SelectQuality_XPathQuery_RunFasterSource, String_SelectQuality_XPathQuery_SpellPoints
- **xpath** (`chummer/xpathqueries/query/xpath`): 7 unique values
  - Values: bonus/addquality, canbuywithspellpoints = 'True', category = 'Negative', category = 'Positive', karma >= 5 and karma <= 10, metagenic = 'True', source = 'RF'

### Numeric Type Candidates
- **karma** (`chummer/qualities/quality/karma`): 100.0% numeric
  - Examples: 4, 5, 14
- **page** (`chummer/qualities/quality/page`): 100.0% numeric
  - Examples: 71, 72, 72
- **max** (`chummer/qualities/quality/bonus/selectskill/max`): 100.0% numeric
  - Examples: 1
- **nativelanguagelimit** (`chummer/qualities/quality/bonus/nativelanguagelimit`): 100.0% numeric
  - Examples: 1
- **thresholdoffset** (`chummer/qualities/quality/bonus/conditionmonitor/thresholdoffset`): 100.0% numeric
  - Examples: 1
- **mentallimit** (`chummer/qualities/quality/bonus/mentallimit`): 100.0% numeric
  - Examples: 1
- **physicallimit** (`chummer/qualities/quality/bonus/physicallimit`): 100.0% numeric
  - Examples: 1
- **val** (`chummer/qualities/quality/bonus/spelldicepool/val`): 100.0% numeric
  - Examples: 2
- **overflow** (`chummer/qualities/quality/bonus/conditionmonitor/overflow`): 100.0% numeric
  - Examples: 1
- **notoriety** (`chummer/qualities/quality/firstlevelbonus/notoriety`): 100.0% numeric
  - Examples: 1
- **threshold** (`chummer/qualities/quality/bonus/conditionmonitor/threshold`): 100.0% numeric
  - Examples: -1
- **cyberwaretotalessmultiplier** (`chummer/qualities/quality/bonus/cyberwaretotalessmultiplier`): 100.0% numeric
  - Examples: 200
- **streetcredmultiplier** (`chummer/qualities/quality/bonus/streetcredmultiplier`): 100.0% numeric
  - Examples: 10
- **val** (`chummer/qualities/quality/bonus/skillgroupcategorykarmacostmultiplier/val`): 100.0% numeric
  - Examples: 200
- **val** (`chummer/qualities/quality/bonus/focusbindingkarmacost/val`): 100.0% numeric
  - Examples: -2, -2, -2
- **astralreputation** (`chummer/qualities/quality/bonus/astralreputation`): 100.0% numeric
  - Examples: -1
- **val** (`chummer/qualities/quality/bonus/knowledgeskillpoints/val`): 100.0% numeric
  - Examples: 5
- **metageniclimit** (`chummer/qualities/quality/bonus/metageniclimit`): 100.0% numeric
  - Examples: 30, 30, 30
- **val** (`chummer/qualities/quality/bonus/skillcategorykarmacost/val`): 100.0% numeric
  - Examples: -1, -1, -1
- **min** (`chummer/qualities/quality/bonus/skillcategorykarmacost/min`): 100.0% numeric
  - Examples: 3, 3, 3
- **max** (`chummer/qualities/quality/bonus/activeskillkarmacost/max`): 100.0% numeric
  - Examples: 5
- **min** (`chummer/qualities/quality/bonus/activeskillkarmacost/min`): 100.0% numeric
  - Examples: 6
- **val** (`chummer/qualities/quality/bonus/knowledgeskillkarmacostmin/val`): 100.0% numeric
  - Examples: 1
- **max** (`chummer/qualities/quality/bonus/knowledgeskillkarmacostmin/max`): 100.0% numeric
  - Examples: 5
- **max** (`chummer/qualities/quality/bonus/knowledgeskillkarmacost/max`): 100.0% numeric
  - Examples: 5
- **min** (`chummer/qualities/quality/bonus/knowledgeskillkarmacost/min`): 100.0% numeric
  - Examples: 6
- **initiativepass** (`chummer/qualities/quality/bonus/initiativepass`): 100.0% numeric
  - Examples: 1, 1, 1
- **forcedloyalty** (`chummer/qualities/quality/bonus/addcontact/forcedloyalty`): 100.0% numeric
  - Examples: 3, 3
- **chargenlimit** (`chummer/qualities/quality/chargenlimit`): 100.0% numeric
  - Examples: 1
- **availability** (`chummer/qualities/quality/bonus/restrictedgear/availability`): 100.0% numeric
  - Examples: 24
- **amount** (`chummer/qualities/quality/bonus/restrictedgear/amount`): 100.0% numeric
  - Examples: 1
- **limitwithinclusions** (`chummer/qualities/quality/limitwithinclusions`): 100.0% numeric
  - Examples: 4, 4
- **val** (`chummer/qualities/quality/bonus/spelldescriptordamage/val`): 100.0% numeric
  - Examples: 2
- **val** (`chummer/qualities/quality/bonus/spelldescriptordrain/val`): 100.0% numeric
  - Examples: 2
- **val** (`chummer/qualities/quality/bonus/sprintbonus/val`): 100.0% numeric
  - Examples: 100, 100
- **firearmor** (`chummer/qualities/quality/bonus/firearmor`): 100.0% numeric
  - Examples: 2
- **val** (`chummer/qualities/quality/bonus/addlimb/val`): 100.0% numeric
  - Examples: 2
- **defensetest** (`chummer/qualities/quality/bonus/defensetest`): 100.0% numeric
  - Examples: -1
- **essencepenalty** (`chummer/qualities/quality/bonus/essencepenalty`): 100.0% numeric
  - Examples: -1, -1, -1
- **val** (`chummer/qualities/quality/bonus/selectattributes/selectattribute/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **val** (`chummer/qualities/quality/bonus/runmultiplier/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **val** (`chummer/qualities/quality/bonus/walkmultiplier/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **fadingresist** (`chummer/qualities/quality/bonus/fadingresist`): 100.0% numeric
  - Examples: 2
- **loyalty** (`chummer/qualities/quality/bonus/addcontact/loyalty`): 100.0% numeric
  - Examples: 1
- **connection** (`chummer/qualities/quality/bonus/addcontact/connection`): 100.0% numeric
  - Examples: 5
- **essencemax** (`chummer/qualities/quality/bonus/essencemax`): 100.0% numeric
  - Examples: -1
- **prototypetranshuman** (`chummer/qualities/quality/bonus/prototypetranshuman`): 100.0% numeric
  - Examples: 1
- **value** (`chummer/qualities/quality/bonus/weaponskillaccuracy/value`): 100.0% numeric
  - Examples: 1
- **judgeintentionsdefense** (`chummer/qualities/quality/bonus/judgeintentionsdefense`): 100.0% numeric
  - Examples: 2
- **count** (`chummer/qualities/quality/required/allof/spellcategory/count`): 100.0% numeric
  - Examples: 4, 4, 4
- **initiategrade** (`chummer/qualities/quality/required/allof/initiategrade`): 100.0% numeric
  - Examples: 1
- **val** (`chummer/qualities/quality/bonus/spellcategorydamage/val`): 100.0% numeric
  - Examples: 1, 1
- **bonus** (`chummer/qualities/quality/bonus/weaponcategorydv/bonus`): 100.0% numeric
  - Examples: 1
- **newspellkarmacost** (`chummer/qualities/quality/bonus/newspellkarmacost`): 100.0% numeric
  - Examples: -1
- **count** (`chummer/qualities/quality/required/oneof/spelldescriptor/count`): 100.0% numeric
  - Examples: 5
- **adeptpowerpoints** (`chummer/qualities/quality/bonus/adeptpowerpoints`): 100.0% numeric
  - Examples: 1
- **drainvalue** (`chummer/qualities/quality/bonus/drainvalue`): 100.0% numeric
  - Examples: -1
- **availability** (`chummer/qualities/quality/bonus/availability`): 100.0% numeric
  - Examples: 1
- **specialattburnmultiplier** (`chummer/qualities/quality/bonus/specialattburnmultiplier`): 100.0% numeric
  - Examples: 20
- **fadingvalue** (`chummer/qualities/quality/bonus/fadingvalue`): 100.0% numeric
  - Examples: -2, -2, -2
- **rating** (`chummer/qualities/quality/bonus/addgear/rating`): 100.0% numeric
  - Examples: 3
- **rating** (`chummer/qualities/quality/bonus/addgear/children/child/rating`): 100.0% numeric
  - Examples: 3, 3, 3
- **submersiongrade** (`chummer/qualities/quality/required/allof/submersiongrade`): 100.0% numeric
  - Examples: 1
- **specialmodificationlimit** (`chummer/qualities/quality/bonus/specialmodificationlimit`): 100.0% numeric
  - Examples: 2, 2
- **contactkarmaminimum** (`chummer/qualities/quality/bonus/contactkarmaminimum`): 100.0% numeric
  - Examples: -1

### Boolean Type Candidates
- **mutant** (`chummer/qualities/quality/mutant`): 100.0% boolean
  - Examples: True
- **contributetolimit** (`chummer/qualities/quality/contributetolimit`): 100.0% boolean
  - Examples: False, False, False
- **doublecareer** (`chummer/qualities/quality/doublecareer`): 100.0% boolean
  - Examples: False, False, False
- **metagenic** (`chummer/qualities/quality/metagenic`): 100.0% boolean
  - Examples: True, True, True
- **implemented** (`chummer/qualities/quality/implemented`): 100.0% boolean
  - Examples: False, False
- **stagedpurchase** (`chummer/qualities/quality/stagedpurchase`): 100.0% boolean
  - Examples: True, True, True
- **canbuywithspellpoints** (`chummer/qualities/quality/canbuywithspellpoints`): 100.0% boolean
  - Examples: True, True, True
- **contributetobp** (`chummer/qualities/quality/contributetobp`): 100.0% boolean
  - Examples: False
