# Analysis Report: traditions.xml

**File**: `data\chummerxml\traditions.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 3155
- **Unique Fields**: 74
- **Unique Attributes**: 9
- **Unique Element Types**: 104

## Fields

### power
**Path**: `chummer/spirits/spirit/powers/power`

- **Count**: 407
- **Presence Rate**: 100.0%
- **Unique Values**: 72
- **Type Patterns**: string
- **Length Range**: 4-46 characters
- **Examples**:
  - `Accident`
  - `Astral Form`
  - `Concealment`
  - `Confusion`
  - `Engulf`

### skill
**Path**: `chummer/spirits/spirit/skills/skill`

- **Count**: 291
- **Presence Rate**: 100.0%
- **Unique Values**: 27
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-20 characters
- **Examples**:
  - `Assensing`
  - `Astral Combat`
  - `Exotic Ranged Weapon`
  - `Perception`
  - `Running`
- **All Values**: Arcana, Artisan, Assensing, Astral Combat, Blades, Clubs, Con, Counterspelling, Flight, Gymnastics, Impersonation, Negotiation, Perception, Pilot Watercraft, Running, Sneaking, Spellcasting, Survival, Swimming, Unarmed Combat

### power
**Path**: `chummer/spirits/spirit/optionalpowers/power`

- **Count**: 198
- **Presence Rate**: 100.0%
- **Unique Values**: 48
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-40 characters
- **Examples**:
  - `Elemental Attack`
  - `Energy Aura`
  - `Fear`
  - `Guard`
  - `Noxious Breath`

### id
**Path**: `chummer/traditions/tradition/id`

- **Count**: 74
- **Presence Rate**: 100.0%
- **Unique Values**: 74
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `616ba093-306c-45fc-8f41-0b98c8cccb46`
  - `19320625-bc1a-492f-8904-da6a847e5700`
  - `8d185e0e-5f49-4992-babd-d1ac9c848f68`
  - `4fba452f-a240-4530-82b6-5ffd4bb83f28`
  - `66ceefed-2cb1-4027-96ca-756ab4eed7ad`

### name
**Path**: `chummer/traditions/tradition/name`

- **Count**: 74
- **Presence Rate**: 100.0%
- **Unique Values**: 74
- **Type Patterns**: string
- **Length Range**: 5-37 characters
- **Examples**:
  - `Custom`
  - `Hermetic`
  - `Shamanic`
  - `Aztec`
  - `Black Magic`

### source
**Path**: `chummer/traditions/tradition/source`

- **Count**: 74
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SG`
  - `SG`
- **All Values**: DATG, DTR, FA, GE, HT, SAG, SFME, SG, SOTG, SR5, SSP

### page
**Path**: `chummer/traditions/tradition/page`

- **Count**: 74
- **Presence Rate**: 100.0%
- **Unique Values**: 48
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `279`
  - `279`
  - `279`
  - `41`
  - `41`

### drain
**Path**: `chummer/traditions/tradition/drain`

- **Count**: 72
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-13 characters
- **Examples**:
  - `{WIL} + {LOG}`
  - `{WIL} + {CHA}`
  - `{WIL} + {CHA}`
  - `{WIL} + {CHA}`
  - `{WIL} + {CHA}`
- **All Values**: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}

### spiritcombat
**Path**: `chummer/traditions/tradition/spirits/spiritcombat`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-16 characters
- **Examples**:
  - `Spirit of Fire`
  - `Spirit of Beasts`
  - `Guardian Spirit`
  - `Spirit of Fire`
  - `Spirit of Fire`
- **All Values**: All, Corpse Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Soldier Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit

### spiritdetection
**Path**: `chummer/traditions/tradition/spirits/spiritdetection`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-16 characters
- **Examples**:
  - `Spirit of Air`
  - `Spirit of Water`
  - `Spirit of Fire`
  - `Spirit of Water`
  - `Spirit of Water`
- **All Values**: All, Carcass Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Scout Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Water, Task Spirit

### spirithealth
**Path**: `chummer/traditions/tradition/spirits/spirithealth`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-16 characters
- **Examples**:
  - `Spirit of Man`
  - `Spirit of Earth`
  - `Plant Spirit`
  - `Spirit of Earth`
  - `Spirit of Earth`
- **All Values**: All, Caretaker Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Rot Spirit, Spirit of Air, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit

### spiritillusion
**Path**: `chummer/traditions/tradition/spirits/spiritillusion`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-16 characters
- **Examples**:
  - `Spirit of Water`
  - `Spirit of Air`
  - `Spirit of Water`
  - `Spirit of Air`
  - `Spirit of Air`
- **All Values**: All, Detritus Spirit, Guidance Spirit, Nymph Spirit, Plant Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water

### spiritmanipulation
**Path**: `chummer/traditions/tradition/spirits/spiritmanipulation`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-16 characters
- **Examples**:
  - `Spirit of Earth`
  - `Spirit of Man`
  - `Spirit of Beasts`
  - `Spirit of Man`
  - `Spirit of Man`
- **All Values**: All, Guardian Spirit, Guidance Spirit, Palefire Spirit, Plant Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit, Worker Spirit

### id
**Path**: `chummer/spirits/spirit/id`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 57
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `380a4860-e5b7-4d07-9b8f-24951c1d656a`
  - `2a0352be-9b13-4e1e-a610-af480f6a1841`
  - `c5e35ac9-5737-4003-8c9e-eb016d2bccd2`
  - `c0178bf8-1fc5-4c56-9ce1-92a3ae1adc45`
  - `d590d5ad-df91-486c-abb1-21a08a5b8a50`

### name
**Path**: `chummer/spirits/spirit/name`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 57
- **Type Patterns**: string
- **Length Range**: 6-38 characters
- **Examples**:
  - `Spirit of Air`
  - `Spirit of Earth`
  - `Spirit of Beasts`
  - `Spirit of Fire`
  - `Spirit of Man`

### bod
**Path**: `chummer/spirits/spirit/bod`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 17.5%
- **Boolean Ratio**: 12.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F-2`
  - `F+4`
  - `F+2`
  - `F+1`
  - `F+1`
- **All Values**: 0, 1, 2, 6, 8, F, F+0, F+1, F+2, F+3, F+4, F+5, F-1, F-2

### agi
**Path**: `chummer/spirits/spirit/agi`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 1.8%
- **Boolean Ratio**: 1.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+3`
  - `F-2`
  - `F+1`
  - `F+2`
  - `F+0`
- **All Values**: 0, F, F+0, F+1, F+2, F+3, F-1, F-2, F-3

### rea
**Path**: `chummer/spirits/spirit/rea`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 1.8%
- **Boolean Ratio**: 1.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+4`
  - `F-1`
  - `F+0`
  - `F+3`
  - `F+2`
- **All Values**: 0, F, F+0, F+1, F+2, F+3, F+4, F-1, F-2

### str
**Path**: `chummer/spirits/spirit/str`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 1.8%
- **Boolean Ratio**: 1.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F-3`
  - `F+4`
  - `F+2`
  - `F-2`
  - `F-2`
- **All Values**: 0, F, F+0, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3

### cha
**Path**: `chummer/spirits/spirit/cha`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 17.5%
- **Boolean Ratio**: 17.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+0`
  - `F+0`
  - `F+0`
  - `F+0`
  - `F+0`
- **All Values**: 0, 1, F, F+0, F+1, F-1, F-2, F/2

### int
**Path**: `chummer/spirits/spirit/int`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 17.5%
- **Boolean Ratio**: 17.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `F+0`
  - `F+0`
  - `F+0`
  - `F+1`
  - `F+1`
- **All Values**: (F/2)+1, 1, F, F+0, F+1, F-2, F/2

### log
**Path**: `chummer/spirits/spirit/log`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 17.5%
- **Boolean Ratio**: 17.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `F+0`
  - `F-1`
  - `F+0`
  - `F+0`
  - `F+0`
- **All Values**: (F/2)-1, 1, F, F+0, F+1, F-1, F-2, F/2

### wil
**Path**: `chummer/spirits/spirit/wil`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 17.5%
- **Boolean Ratio**: 17.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+0`
  - `F+0`
  - `F+0`
  - `F+0`
  - `F+0`
- **All Values**: 1, F, F+0, F+1, F+2, F-2, F/2

### ini
**Path**: `chummer/spirits/spirit/ini`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 31.6%
- **Boolean Ratio**: 29.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-9 characters
- **Examples**:
  - `(F*2)+4`
  - `(F*2)-1`
  - `(F*2)`
  - `(F*2)+3`
  - `(F*2)+2`
- **All Values**: (F*2), (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4, (F*2)+5, (F*2)-1, (F-1), 0, 3, F+(F/2)+2, F+(F/2)+3, F+(F/2)+4, F+(F/2)-1

### source
**Path**: `chummer/spirits/spirit/source`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: FA, HS, HT, SG, SR5

### page
**Path**: `chummer/spirits/spirit/page`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `303`
  - `303`
  - `303`
  - `303`
  - `304`
- **All Values**: 117, 129, 135, 180, 181, 193, 200, 298, 303, 304, 387, 52, 53, 87, 88, 91, 93, 98, 99

### name
**Path**: `chummer/spirits/spirit/bonus/enabletab/name`

- **Count**: 20
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-8 characters
- **Examples**:
  - `critter`
  - `critter`
  - `critter`
  - `critter`
  - `critter`
- **All Values**: critter, magician

### skilldisable
**Path**: `chummer/traditions/tradition/bonus/skilldisable`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-19 characters
- **Examples**:
  - `Binding`
  - `Binding`
  - `Alchemy`
  - `Artificing`
  - `Binding`
- **All Values**: Alchemy, Artificing, Binding, Ritual Spellcasting, Spellcasting, Summoning

### weakness
**Path**: `chummer/spirits/spirit/weaknesses/weakness`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-30 characters
- **Examples**:
  - `Allergy (Water, Severe)`
  - `Allergy (Fire, Severe)`
  - `Allergy (Clean Earth, Severe)`
  - `Allergy (Clean Water, Severe)`
  - `Essence Loss (1 point per day)`
- **All Values**: Allergy (Clean Earth, Severe), Allergy (Clean Water, Severe), Allergy (Fire, Severe), Allergy (Insecticides, Severe), Allergy (Water, Severe), Essence Loss (1 point per day), Evanescence

### edg
**Path**: `chummer/spirits/spirit/edg`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F/2

### mag
**Path**: `chummer/spirits/spirit/mag`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### res
**Path**: `chummer/spirits/spirit/res`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`

### dep
**Path**: `chummer/spirits/spirit/dep`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`

### ess
**Path**: `chummer/spirits/spirit/ess`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### addquality
**Path**: `chummer/traditions/tradition/bonus/addqualities/addquality`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-18 characters
- **Examples**:
  - `Animal Familiar`
  - `Dark Ally`
  - `Barehanded Adept`
  - `Spiritual Lodge`
  - `Spiritual Pilgrim`
- **All Values**: Animal Familiar, Arcane Arrester, Barehanded Adept, Code of Honor, Dark Ally, Dedicated Conjurer, Mentor Spirit, Pacifist I, Spectral Warden, Spiritual Lodge, Spiritual Pilgrim, Vexcraft

### walk
**Path**: `chummer/spirits/spirit/walk`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `2/1/0`
  - `2/1/0`
  - `2/1/0`
  - `2/1/0`
  - `2/1/0`

### run
**Path**: `chummer/spirits/spirit/run`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `4/0/0`
  - `4/0/0`
  - `4/0/0`
  - `4/0/0`
  - `4/0/0`

### sprint
**Path**: `chummer/spirits/spirit/sprint`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 5-5 characters
- **Examples**:
  - `1/1/0`
  - `1/1/0`
  - `1/1/0`
  - `1/1/0`
  - `1/1/0`
- **All Values**: 1/1/0, 2/1/0

### optionalpower
**Path**: `chummer/spirits/spirit/optionalpowers/optionalpower`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-14 characters
- **Examples**:
  - `Accident`
  - `Aura Masking`
  - `Compulsion`
  - `Regeneration`
  - `Search`
- **All Values**: Accident, Aura Masking, Compulsion, Noxious Breath, Regeneration, Search, Shadow Cloak, Silence

### quality
**Path**: `chummer/traditions/tradition/required/oneof/quality`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-17 characters
- **Examples**:
  - `Adept`
  - `Mystic Adept`
  - `Mentor Spirit`
  - `Aware`
  - `Aspected Magician`
- **All Values**: Adept, Apprentice, Aspected Magician, Aware, Explorer, Magician, Mentor Spirit, Mystic Adept

### spiritform
**Path**: `chummer/traditions/tradition/spiritform`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-12 characters
- **Examples**:
  - `Possession`
  - `Possession`
  - `Inhabitation`
  - `Possession`
  - `Possession`
- **All Values**: Inhabitation, Possession

### spirit
**Path**: `chummer/traditions/tradition/bonus/limitspiritcategory/spirit`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-11 characters
- **Examples**:
  - `Abomination`
  - `Barren`
  - `Noxious`
  - `Nuclear`
  - `Plague`
- **All Values**: Abomination, Barren, Noxious, Nuclear, Plague, Sludge

### skillgroupdisable
**Path**: `chummer/traditions/tradition/bonus/skillgroupdisable`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-10 characters
- **Examples**:
  - `Enchanting`
  - `Enchanting`
  - `Enchanting`
  - `Sorcery`
  - `Enchanting`
- **All Values**: Enchanting, Sorcery

### name
**Path**: `chummer/traditions/tradition/bonus/specificskill/name`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-15 characters
- **Examples**:
  - `Banishing`
  - `Banishing`
  - `Counterspelling`
  - `Disenchanting`
  - `Artificing`
- **All Values**: Artificing, Banishing, Counterspelling, Disenchanting, Navigation

### bonus
**Path**: `chummer/traditions/tradition/bonus/specificskill/bonus`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`
  - `1`
- **All Values**: 1, 2

### metamagic
**Path**: `chummer/traditions/tradition/bonus/metamagiclimit/metamagic`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-23 characters
- **Examples**:
  - `Fixation`
  - `Quickening`
  - `Advanced Alchemy`
  - `Anchoring`
  - `Centering`
- **All Values**: Advanced Alchemy, Anchoring, Centering, Fixation, Quickening, Structured Spellcasting

### name
**Path**: `chummer/traditions/tradition/bonus/spellcategory/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-8 characters
- **Examples**:
  - `Illusion`
  - `Health`
  - `Combat`
  - `Combat`
  - `Illusion`
- **All Values**: Combat, Health, Illusion

### val
**Path**: `chummer/traditions/tradition/bonus/spellcategory/val`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `3`
  - `2`
  - `-2`
  - `2`
  - `2`
- **All Values**: -2, 2, 3

### id
**Path**: `chummer/drainattributes/drainattribute/id`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `f10d9639-45c8-4c45-87b9-6af0fef73723`
  - `06b8b7da-1301-4963-aba7-4862024559a8`
  - `aca1fd74-0c25-41d5-b621-434c3892cfb3`
  - `c8adb0ec-7592-4801-b560-94805ef1c13e`
  - `f59248c7-7843-4b68-9a26-b966c32c8cae`
- **All Values**: 06b8b7da-1301-4963-aba7-4862024559a8, aca1fd74-0c25-41d5-b621-434c3892cfb3, c8adb0ec-7592-4801-b560-94805ef1c13e, f10d9639-45c8-4c45-87b9-6af0fef73723, f59248c7-7843-4b68-9a26-b966c32c8cae

### name
**Path**: `chummer/drainattributes/drainattribute/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-13 characters
- **Examples**:
  - `{WIL} + {CHA}`
  - `{WIL} + {INT}`
  - `{WIL} + {LOG}`
  - `{WIL} + {MAG}`
  - `{WIL} + {WIL}`
- **All Values**: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}

### addmetamagic
**Path**: `chummer/traditions/tradition/bonus/addmetamagic`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-8 characters
- **Examples**:
  - `Exorcism`
  - `Exorcism`
  - `Exorcism`
  - `Masking`
- **All Values**: Exorcism, Masking

### optionalpower
**Path**: `chummer/spirits/spirit/bonus/optionalpowers/optionalpower`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-15 characters
- **Examples**:
  - `Inhabitation`
  - `Possession`
  - `Materialization`
- **All Values**: Inhabitation, Materialization, Possession

### category
**Path**: `chummer/spirits/spirit/category`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-7 characters
- **Examples**:
  - `Spirits`
  - `Shedim`
  - `Shedim`
- **All Values**: Shedim, Spirits

### limitspellcategory
**Path**: `chummer/traditions/tradition/bonus/limitspellcategory`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-6 characters
- **Examples**:
  - `Combat`
  - `Health`
- **All Values**: Combat, Health

### initiativepass
**Path**: `chummer/spirits/spirit/bonus/initiativepass`

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

### limitspiritchoices
**Path**: `chummer/traditions/tradition/limitspiritchoices`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `False`

### quality
**Path**: `chummer/traditions/tradition/required/allof/quality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 15-15 characters
- **Examples**:
  - `The Twisted Way`

### drainresist
**Path**: `chummer/traditions/tradition/bonus/drainresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-2`

### name
**Path**: `chummer/traditions/tradition/bonus/specificpower/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 16-16 characters
- **Examples**:
  - `Berserker Temper`

### addquality
**Path**: `chummer/traditions/tradition/bonus/addquality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Code of Honor`

### name
**Path**: `chummer/traditions/tradition/required/skill/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 19-19 characters
- **Examples**:
  - `Ritual Spellcasting`

### val
**Path**: `chummer/traditions/tradition/required/skill/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### condition
**Path**: `chummer/traditions/tradition/bonus/specificskill/condition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Creating Foci`

### name
**Path**: `chummer/traditions/tradition/required/spellcategory/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Health`

### count
**Path**: `chummer/traditions/tradition/required/spellcategory/count`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### power
**Path**: `chummer/traditions/tradition/required/oneof/power`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 17-17 characters
- **Examples**:
  - `Astral Perception`

### name
**Path**: `chummer/spirits/spirit/bonus/enableattribute/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `MAG`

### min
**Path**: `chummer/spirits/spirit/bonus/enableattribute/min`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`

### max
**Path**: `chummer/spirits/spirit/bonus/enableattribute/max`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`

### aug
**Path**: `chummer/spirits/spirit/bonus/enableattribute/aug`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`

### val
**Path**: `chummer/spirits/spirit/bonus/enableattribute/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`

### armor
**Path**: `chummer/spirits/spirit/armor`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`

### group
**Path**: `chummer/spirits/spirit/skills/group`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 12-12 characters
- **Examples**:
  - `Close Combat`

### quality
**Path**: `chummer/spirits/spirit/qualities/positive/quality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 17-17 characters
- **Examples**:
  - `Aspected Magician`

## Attributes

### skill@attr
**Path**: `chummer/spirits/spirit/skills/skill@attr`

- **Count**: 238
- **Unique Values**: 9
- **Enum Candidate**: Yes
- **Examples**:
  - `int`
  - `wil`
  - `agi`
  - `int`
  - `str`
- **All Values**: agi, bod, cha, int, log, mag, rea, str, wil

### skill@rating
**Path**: `chummer/spirits/spirit/skills/skill@rating`

- **Count**: 43
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `F/2`
  - `F/2`
  - `F/2`
  - `F/2`
  - `F/2`
- **All Values**: F, F/2

### power@select
**Path**: `chummer/spirits/spirit/powers/power@select`

- **Count**: 27
- **Unique Values**: 9
- **Enum Candidate**: Yes
- **Examples**:
  - `Hearing`
  - `Low-Light Vision`
  - `Smell`
  - `Normal Weapons`
  - `Pathogens`
- **All Values**: Age, Hearing, Low-Light, Low-Light Vision, Normal Weapons, Pathogens, Smell, Sunlight, Mild, Toxins

### addquality@forced
**Path**: `chummer/traditions/tradition/bonus/addqualities/addquality@forced`

- **Count**: 11
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### metamagic@grade
**Path**: `chummer/traditions/tradition/bonus/metamagiclimit/metamagic@grade`

- **Count**: 6
- **Unique Values**: 4
- **Enum Candidate**: Yes
- **Examples**:
  - `1`
  - `2`
  - `3`
  - `4`
  - `1`
- **All Values**: 1, 2, 3, 4

### addmetamagic@forced
**Path**: `chummer/traditions/tradition/bonus/addmetamagic@forced`

- **Count**: 4
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`

### addquality@select
**Path**: `chummer/traditions/tradition/bonus/addqualities/addquality@select`

- **Count**: 2
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Boggle`
  - `Guardian Order`
- **All Values**: Boggle, Guardian Order

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema traditions.xsd`

### addquality@select
**Path**: `chummer/traditions/tradition/bonus/addquality@select`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Harmony with Nature, the Shaman’s Code`

## Type Improvement Recommendations

### Enum Candidates
- **source** (`chummer/traditions/tradition/source`): 11 unique values
  - Values: DATG, DTR, FA, GE, HT, SAG, SFME, SG, SOTG, SR5, SSP
- **page** (`chummer/traditions/tradition/page`): 48 unique values
  - Values: 112, 13, 165, 25, 27, 28, 40, 41, 43, 44, 46, 62, 64, 65, 69, 76, 78, 81, 91, 94
- **drain** (`chummer/traditions/tradition/drain`): 5 unique values
  - Values: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}
- **spiritcombat** (`chummer/traditions/tradition/spirits/spiritcombat`): 13 unique values
  - Values: All, Corpse Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Soldier Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit
- **spiritdetection** (`chummer/traditions/tradition/spirits/spiritdetection`): 12 unique values
  - Values: All, Carcass Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Scout Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Water, Task Spirit
- **spirithealth** (`chummer/traditions/tradition/spirits/spirithealth`): 12 unique values
  - Values: All, Caretaker Spirit, Guardian Spirit, Guidance Spirit, Plant Spirit, Rot Spirit, Spirit of Air, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit
- **spiritillusion** (`chummer/traditions/tradition/spirits/spiritillusion`): 11 unique values
  - Values: All, Detritus Spirit, Guidance Spirit, Nymph Spirit, Plant Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water
- **spiritmanipulation** (`chummer/traditions/tradition/spirits/spiritmanipulation`): 13 unique values
  - Values: All, Guardian Spirit, Guidance Spirit, Palefire Spirit, Plant Spirit, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit, Worker Spirit
- **addquality** (`chummer/traditions/tradition/bonus/addqualities/addquality`): 12 unique values
  - Values: Animal Familiar, Arcane Arrester, Barehanded Adept, Code of Honor, Dark Ally, Dedicated Conjurer, Mentor Spirit, Pacifist I, Spectral Warden, Spiritual Lodge, Spiritual Pilgrim, Vexcraft
- **spiritform** (`chummer/traditions/tradition/spiritform`): 2 unique values
  - Values: Inhabitation, Possession
- **spirit** (`chummer/traditions/tradition/bonus/limitspiritcategory/spirit`): 6 unique values
  - Values: Abomination, Barren, Noxious, Nuclear, Plague, Sludge
- **skillgroupdisable** (`chummer/traditions/tradition/bonus/skillgroupdisable`): 2 unique values
  - Values: Enchanting, Sorcery
- **addmetamagic** (`chummer/traditions/tradition/bonus/addmetamagic`): 2 unique values
  - Values: Exorcism, Masking
- **skilldisable** (`chummer/traditions/tradition/bonus/skilldisable`): 6 unique values
  - Values: Alchemy, Artificing, Binding, Ritual Spellcasting, Spellcasting, Summoning
- **limitspellcategory** (`chummer/traditions/tradition/bonus/limitspellcategory`): 2 unique values
  - Values: Combat, Health
- **name** (`chummer/traditions/tradition/bonus/specificskill/name`): 5 unique values
  - Values: Artificing, Banishing, Counterspelling, Disenchanting, Navigation
- **bonus** (`chummer/traditions/tradition/bonus/specificskill/bonus`): 2 unique values
  - Values: 1, 2
- **name** (`chummer/traditions/tradition/bonus/spellcategory/name`): 3 unique values
  - Values: Combat, Health, Illusion
- **val** (`chummer/traditions/tradition/bonus/spellcategory/val`): 3 unique values
  - Values: -2, 2, 3
- **metamagic** (`chummer/traditions/tradition/bonus/metamagiclimit/metamagic`): 6 unique values
  - Values: Advanced Alchemy, Anchoring, Centering, Fixation, Quickening, Structured Spellcasting
- **quality** (`chummer/traditions/tradition/required/oneof/quality`): 8 unique values
  - Values: Adept, Apprentice, Aspected Magician, Aware, Explorer, Magician, Mentor Spirit, Mystic Adept
- **bod** (`chummer/spirits/spirit/bod`): 14 unique values
  - Values: 0, 1, 2, 6, 8, F, F+0, F+1, F+2, F+3, F+4, F+5, F-1, F-2
- **agi** (`chummer/spirits/spirit/agi`): 9 unique values
  - Values: 0, F, F+0, F+1, F+2, F+3, F-1, F-2, F-3
- **rea** (`chummer/spirits/spirit/rea`): 9 unique values
  - Values: 0, F, F+0, F+1, F+2, F+3, F+4, F-1, F-2
- **str** (`chummer/spirits/spirit/str`): 11 unique values
  - Values: 0, F, F+0, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3
- **cha** (`chummer/spirits/spirit/cha`): 8 unique values
  - Values: 0, 1, F, F+0, F+1, F-1, F-2, F/2
- **int** (`chummer/spirits/spirit/int`): 7 unique values
  - Values: (F/2)+1, 1, F, F+0, F+1, F-2, F/2
- **log** (`chummer/spirits/spirit/log`): 8 unique values
  - Values: (F/2)-1, 1, F, F+0, F+1, F-1, F-2, F/2
- **wil** (`chummer/spirits/spirit/wil`): 7 unique values
  - Values: 1, F, F+0, F+1, F+2, F-2, F/2
- **ini** (`chummer/spirits/spirit/ini`): 14 unique values
  - Values: (F*2), (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4, (F*2)+5, (F*2)-1, (F-1), 0, 3, F+(F/2)+2, F+(F/2)+3, F+(F/2)+4, F+(F/2)-1
- **source** (`chummer/spirits/spirit/source`): 5 unique values
  - Values: FA, HS, HT, SG, SR5
- **page** (`chummer/spirits/spirit/page`): 19 unique values
  - Values: 117, 129, 135, 180, 181, 193, 200, 298, 303, 304, 387, 52, 53, 87, 88, 91, 93, 98, 99
- **power** (`chummer/spirits/spirit/optionalpowers/power`): 48 unique values
  - Values: Accident, Animal Control, Combat Skill, Concealment, Elemental Attack, Energy Aura, Enhanced Senses (Low-Light Vision), Enhanced Senses (Smell), Fear, Guard, Magic Resistance, Natural Weapon, Natural Weaponry, Noxious Breath, Reinforcement, Search, Skill (any Technical Skill), Skill (any Technical or Physical skill ), Skill (any combat skill), Venom
- **skill** (`chummer/spirits/spirit/skills/skill`): 27 unique values
  - Values: Arcana, Artisan, Assensing, Astral Combat, Blades, Clubs, Con, Counterspelling, Flight, Gymnastics, Impersonation, Negotiation, Perception, Pilot Watercraft, Running, Sneaking, Spellcasting, Survival, Swimming, Unarmed Combat
- **weakness** (`chummer/spirits/spirit/weaknesses/weakness`): 7 unique values
  - Values: Allergy (Clean Earth, Severe), Allergy (Clean Water, Severe), Allergy (Fire, Severe), Allergy (Insecticides, Severe), Allergy (Water, Severe), Essence Loss (1 point per day), Evanescence
- **edg** (`chummer/spirits/spirit/edg`): 2 unique values
  - Values: F, F/2
- **sprint** (`chummer/spirits/spirit/sprint`): 2 unique values
  - Values: 1/1/0, 2/1/0
- **name** (`chummer/spirits/spirit/bonus/enabletab/name`): 2 unique values
  - Values: critter, magician
- **optionalpower** (`chummer/spirits/spirit/bonus/optionalpowers/optionalpower`): 3 unique values
  - Values: Inhabitation, Materialization, Possession
- **category** (`chummer/spirits/spirit/category`): 2 unique values
  - Values: Shedim, Spirits
- **optionalpower** (`chummer/spirits/spirit/optionalpowers/optionalpower`): 8 unique values
  - Values: Accident, Aura Masking, Compulsion, Noxious Breath, Regeneration, Search, Shadow Cloak, Silence
- **id** (`chummer/drainattributes/drainattribute/id`): 5 unique values
  - Values: 06b8b7da-1301-4963-aba7-4862024559a8, aca1fd74-0c25-41d5-b621-434c3892cfb3, c8adb0ec-7592-4801-b560-94805ef1c13e, f10d9639-45c8-4c45-87b9-6af0fef73723, f59248c7-7843-4b68-9a26-b966c32c8cae
- **name** (`chummer/drainattributes/drainattribute/name`): 5 unique values
  - Values: {WIL} + {CHA}, {WIL} + {INT}, {WIL} + {LOG}, {WIL} + {MAG}, {WIL} + {WIL}

### Numeric Type Candidates
- **drainresist** (`chummer/traditions/tradition/bonus/drainresist`): 100.0% numeric
  - Examples: -2
- **val** (`chummer/traditions/tradition/required/skill/val`): 100.0% numeric
  - Examples: 1
- **count** (`chummer/traditions/tradition/required/spellcategory/count`): 100.0% numeric
  - Examples: 2
- **res** (`chummer/spirits/spirit/res`): 100.0% numeric
  - Examples: 0, 0, 0
- **dep** (`chummer/spirits/spirit/dep`): 100.0% numeric
  - Examples: 0, 0, 0
- **walk** (`chummer/spirits/spirit/walk`): 100.0% numeric
  - Examples: 2/1/0, 2/1/0, 2/1/0
- **run** (`chummer/spirits/spirit/run`): 100.0% numeric
  - Examples: 4/0/0, 4/0/0, 4/0/0
- **armor** (`chummer/spirits/spirit/armor`): 100.0% numeric
  - Examples: 0
- **initiativepass** (`chummer/spirits/spirit/bonus/initiativepass`): 100.0% numeric
  - Examples: 1, 1

### Boolean Type Candidates
- **limitspiritchoices** (`chummer/traditions/tradition/limitspiritchoices`): 100.0% boolean
  - Examples: False
