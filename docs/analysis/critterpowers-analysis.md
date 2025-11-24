# Analysis Report: critterpowers.xml

**File**: `data\chummerxml\critterpowers.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 3729
- **Unique Fields**: 68
- **Unique Attributes**: 7
- **Unique Element Types**: 99

## Fields

### id
**Path**: `chummer/powers/power/id`

- **Count**: 291
- **Presence Rate**: 100.0%
- **Unique Values**: 291
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `57dd33b3-7fea-421e-bcf3-336d56ea08b5`
  - `a3f11764-2569-48a1-8eb8-8cdae58b23e8`
  - `410c17d0-0490-4e67-b2ca-4ad5e2feb016`
  - `07229dc9-3b46-4843-a30a-7b7c4c144ea0`
  - `bb55305e-0c6f-47bd-a92f-ce85df478096`

### name
**Path**: `chummer/powers/power/name`

- **Count**: 291
- **Presence Rate**: 100.0%
- **Unique Values**: 264
- **Type Patterns**: string
- **Length Range**: 4-48 characters
- **Examples**:
  - `Combat Skill`
  - `Physical Skill`
  - `Social Skill`
  - `Technical Skill`
  - `Vehicle Skill`

### category
**Path**: `chummer/powers/power/category`

- **Count**: 291
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-21 characters
- **Examples**:
  - `Paranormal`
  - `Paranormal`
  - `Paranormal`
  - `Paranormal`
  - `Paranormal`
- **All Values**: Chimeric Modification, Drake, Emergent, Free Spirit, Infected, Mundane, Paranormal, Shapeshifter, Weakness

### source
**Path**: `chummer/powers/power/source`

- **Count**: 291
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: AET, DTR, FA, HS, KC, RF, SG, SR5

### page
**Path**: `chummer/powers/power/page`

- **Count**: 291
- **Presence Rate**: 100.0%
- **Unique Values**: 59
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-3 characters
- **Examples**:
  - `130`
  - `133`
  - `137`
  - `143`
  - `146`

### quality
**Path**: `chummer/powers/power/required/oneof/quality`

- **Count**: 200
- **Presence Rate**: 100.0%
- **Unique Values**: 53
- **Type Patterns**: string
- **Length Range**: 15-40 characters
- **Examples**:
  - `Infected: Dzoo-Noo-Qua`
  - `Dracoform (Sea Drake)`
  - `Dracoform (Feathered Drake)`
  - `Dracoform (Western Drake)`
  - `Dracoform (Western Drake)`

### action
**Path**: `chummer/powers/power/action`

- **Count**: 194
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-9 characters
- **Examples**:
  - `Simple`
  - `Complex`
  - `Complex`
  - `Auto`
  - `Complex`
- **All Values**: As ritual, Auto, Complex, Free, None, Simple, Special

### duration
**Path**: `chummer/powers/power/duration`

- **Count**: 193
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-23 characters
- **Examples**:
  - `Always`
  - `Instant`
  - `Sustained`
  - `Always`
  - `Instant`
- **All Values**: Always, As ritual, F x 10 Combat Turns, Instant, Per Spell, Permanent, Predetermined by Sprite, Special, Sustained

### type
**Path**: `chummer/powers/power/type`

- **Count**: 189
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-17 characters
- **Examples**:
  - `M`
  - `P`
  - `M`
  - `M`
  - `P`
- **All Values**: As Spell, As ritual, Device, File, Host, Icon, M, P, Persona, Persona or Device

### range
**Path**: `chummer/powers/power/range`

- **Count**: 185
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-12 characters
- **Examples**:
  - `MAG x 50`
  - `LOS`
  - `LOS`
  - `Self`
  - `LOS`
- **All Values**: As ritual, LOS, LOS (A), MAG, MAG x 25 m, MAG x 50, Per Spell, Self, Special, Touch, Touch or LOS

### karma
**Path**: `chummer/powers/power/karma`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `9`
  - `9`
  - `50`
  - `6`
  - `9`
- **All Values**: 12, 14, 16, 25, 3, 5, 50, 6, 8, 9

### toxic
**Path**: `chummer/powers/power/toxic`

- **Count**: 20
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

### rating
**Path**: `chummer/powers/power/rating`

- **Count**: 20
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, boolean_string, enum_candidate
- **Numeric Ratio**: 10.0%
- **Boolean Ratio**: 90.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `20`
  - `True`
- **All Values**: 2, 20, True

### disablebiowaregrade
**Path**: `chummer/powers/power/bonus/disablebiowaregrade`

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
  - `Betaware`
- **All Values**: Alphaware, Alphaware (Adapsin), Betaware, Betaware (Adapsin), Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)

### disablecyberwaregrade
**Path**: `chummer/powers/power/bonus/disablecyberwaregrade`

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
  - `Betaware`
- **All Values**: Alphaware, Alphaware (Adapsin), Betaware, Betaware (Adapsin), Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)

### category
**Path**: `chummer/categories/category`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-21 characters
- **Examples**:
  - `Drake`
  - `Emergent`
  - `Free Spirit`
  - `Infected`
  - `Mundane`
- **All Values**: Chimeric Modification, Drake, Emergent, Free Spirit, Infected, Mundane, Paranormal, Toxic Critter Powers, Weakness

### name
**Path**: `chummer/powers/power/bonus/naturalweapon/name`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-15 characters
- **Examples**:
  - `Tunneling Claws`
  - `Electrocytes`
  - `Bite`
  - `Claws`
  - `Horns`
- **All Values**: Bite, Claws, Electrocytes, Horns, Proboscis, Quills, Tail, Tunneling Claws, Tusk

### reach
**Path**: `chummer/powers/power/bonus/naturalweapon/reach`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 88.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `0`
  - `-1`
  - `0`
  - `0`
- **All Values**: -1, 0, 1

### damage
**Path**: `chummer/powers/power/bonus/naturalweapon/damage`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-10 characters
- **Examples**:
  - `({STR}+1)P`
  - `{BOD}S(e)`
  - `({STR}+2)P`
  - `({STR}+1)P`
  - `({STR}+2)P`
- **All Values**: ({STR}+1)P, ({STR}+2)P, ({STR}+3)P, ({STR}-1)P, {BOD}S(e)

### ap
**Path**: `chummer/powers/power/bonus/naturalweapon/ap`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 22.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-1`
  - `-6`
  - `-2`
  - `-1`
  - `-1`
- **All Values**: +1, -1, -2, -6, 0

### useskill
**Path**: `chummer/powers/power/bonus/naturalweapon/useskill`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 14-19 characters
- **Examples**:
  - `Unarmed Combat`
  - `Unarmed Combat`
  - `Unarmed Combat`
  - `Unarmed Combat`
  - `Unarmed Combat`
- **All Values**: Exotic Melee Weapon, Unarmed Combat

### accuracy
**Path**: `chummer/powers/power/bonus/naturalweapon/accuracy`

- **Count**: 9
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
**Path**: `chummer/powers/power/bonus/naturalweapon/source`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `DTR`
  - `HS`
  - `HS`
  - `HS`
  - `HS`
- **All Values**: DTR, HS

### page
**Path**: `chummer/powers/power/bonus/naturalweapon/page`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `163`
  - `171`
  - `172`
  - `172`
  - `172`
- **All Values**: 163, 171, 172

### name
**Path**: `chummer/powers/power/bonus/specificskill/name`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-10 characters
- **Examples**:
  - `Swimming`
  - `Free-Fall`
  - `Swimming`
  - `Gymnastics`
  - `Free-Fall`
- **All Values**: Free-Fall, Gymnastics, Perception, Swimming

### bonus
**Path**: `chummer/powers/power/bonus/specificskill/bonus`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 87.5%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `4`
  - `1`
  - `2`
  - `1`
  - `1`
- **All Values**: 1, 2, 4, Rating

### name
**Path**: `chummer/powers/power/bonus/specificattribute/name`

- **Count**: 8
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
  - `CHA`
- **All Values**: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

### val
**Path**: `chummer/powers/power/bonus/specificattribute/val`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`
  - `Rating`
  - `Rating`

### category
**Path**: `chummer/powers/power/bonus/movementreplace/category`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-6 characters
- **Examples**:
  - `Fly`
  - `Fly`
  - `Fly`
  - `Fly`
  - `Fly`
- **All Values**: Fly, Ground

### speed
**Path**: `chummer/powers/power/bonus/movementreplace/speed`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-6 characters
- **Examples**:
  - `walk`
  - `run`
  - `sprint`
  - `walk`
  - `run`
- **All Values**: run, sprint, walk

### val
**Path**: `chummer/powers/power/bonus/movementreplace/val`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `2`
  - `4`
  - `300`
  - `3`
  - `6`
- **All Values**: 2, 3, 300, 4, 500, 6

### val
**Path**: `chummer/powers/power/bonus/selectskill/val`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `MAG`
  - `MAG`
  - `MAG`
  - `MAG`
  - `MAG`
- **All Values**: 2, MAG

### applytorating
**Path**: `chummer/powers/power/bonus/selectskill/applytorating`

- **Count**: 6
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
**Path**: `chummer/powers/power/required/allof/attribute/name`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `MAG`
  - `MAG`
  - `MAG`
  - `MAG`
  - `MAG`

### total
**Path**: `chummer/powers/power/required/allof/attribute/total`

- **Count**: 6
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
  - `3`

### notes
**Path**: `chummer/powers/power/notes`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: string
- **Length Range**: 105-213 characters
- **Examples**:
  - `These operate similarly to the autosofts of the same name, with a Rating that matches the spirit's Force.`
  - `These operate similarly to the autosofts of the same name, with a Rating that matches the spirit's Force.`
  - `These operate similarly to the autosofts of the same name, with a Rating that matches the spirit's Force.`
  - `Alters how space is perceived, making areas seem larger or distorted without changing physical structure. Can affect both physical and astral senses.`
  - `Induces intense physical and mental agony by embedding barbed tentacles into the target. Movement increases the pain and further debilitates the victim, feeding off the emotional energy generated by the suffering.`

### unlockskills
**Path**: `chummer/powers/power/bonus/unlockskills`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Name`
  - `Name`
  - `Name`
  - `Name`

### physical
**Path**: `chummer/powers/power/bonus/conditionmonitor/physical`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-7 characters
- **Examples**:
  - `-Rating`
  - `-20`
  - `Rating`
  - `Rating`
- **All Values**: -20, -Rating, Rating

### armor
**Path**: `chummer/powers/power/bonus/armor`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`

### name
**Path**: `chummer/powers/power/bonus/critterpowerlevels/power/name`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 14-21 characters
- **Examples**:
  - `Hardened Armor`
  - `Hardened Armor`
  - `Hardened Mystic Armor`
- **All Values**: Hardened Armor, Hardened Mystic Armor

### val
**Path**: `chummer/powers/power/bonus/critterpowerlevels/power/val`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 66.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `1`
  - `1`
- **All Values**: 1, 2

### applytorating
**Path**: `chummer/powers/power/bonus/specificskill/applytorating`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`
  - `True`

### category
**Path**: `chummer/powers/power/bonus/sprintbonus/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Ground`
  - `Ground`

### val
**Path**: `chummer/powers/power/bonus/sprintbonus/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `100`
  - `100`

### useskillspec
**Path**: `chummer/powers/power/bonus/naturalweapon/useskillspec`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-6 characters
- **Examples**:
  - `Trunk`
  - `Quills`
- **All Values**: Quills, Trunk

### name
**Path**: `chummer/powers/power/bonus/enabletab/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `magician`

### spellresistance
**Path**: `chummer/powers/power/bonus/spellresistance`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### metatypecategory
**Path**: `chummer/powers/power/required/oneof/metatypecategory`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 12-12 characters
- **Examples**:
  - `Shapeshifter`

### stun
**Path**: `chummer/powers/power/bonus/conditionmonitor/stun`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `-20`

### cyberwaretotalessmultiplier
**Path**: `chummer/powers/power/bonus/cyberwaretotalessmultiplier`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `200`

### quality
**Path**: `chummer/powers/power/forbidden/oneof/quality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 21-21 characters
- **Examples**:
  - `Dracoform (Sea Drake)`

### toxincontactresist
**Path**: `chummer/powers/power/bonus/toxincontactresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### toxiningestionresist
**Path**: `chummer/powers/power/bonus/toxiningestionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### toxininhalationresist
**Path**: `chummer/powers/power/bonus/toxininhalationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### toxininjectionresist
**Path**: `chummer/powers/power/bonus/toxininjectionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### pathogencontactresist
**Path**: `chummer/powers/power/bonus/pathogencontactresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### pathogeningestionresist
**Path**: `chummer/powers/power/bonus/pathogeningestionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### pathogeninhalationresist
**Path**: `chummer/powers/power/bonus/pathogeninhalationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### pathogeninjectionresist
**Path**: `chummer/powers/power/bonus/pathogeninjectionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### unarmeddv
**Path**: `chummer/powers/power/bonus/unarmeddv`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### quality
**Path**: `chummer/powers/power/required/allof/group/quality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 18-18 characters
- **Examples**:
  - `Infected: Fomoraig`

### critterpower
**Path**: `chummer/powers/power/required/allof/group/critterpower`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Armor`

### initiativedice
**Path**: `chummer/powers/power/bonus/initiativedice`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### category
**Path**: `chummer/powers/power/bonus/walkmultiplier/category`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Ground`

### percent
**Path**: `chummer/powers/power/bonus/walkmultiplier/percent`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `100`

### category
**Path**: `chummer/powers/power/bonus/runmultiplier/category`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Ground`

### percent
**Path**: `chummer/powers/power/bonus/runmultiplier/percent`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `100`

### physicallimit
**Path**: `chummer/powers/power/bonus/physicallimit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

## Attributes

### category@whitelist
**Path**: `chummer/categories/category@whitelist`

- **Count**: 5
- **Unique Values**: 1
- **Examples**:
  - `true`
  - `true`
  - `true`
  - `true`
  - `true`

### selectskill@skillcategory
**Path**: `chummer/powers/power/bonus/selectskill@skillcategory`

- **Count**: 5
- **Unique Values**: 5
- **Enum Candidate**: Yes
- **Examples**:
  - `Combat Active`
  - `Physical Active`
  - `Social Active`
  - `Technical Active`
  - `Vehicle Active`
- **All Values**: Combat Active, Physical Active, Social Active, Technical Active, Vehicle Active

### unlockskills@name
**Path**: `chummer/powers/power/bonus/unlockskills@name`

- **Count**: 4
- **Unique Values**: 3
- **Enum Candidate**: Yes
- **Examples**:
  - `Assensing`
  - `Astral Combat`
  - `Counterspelling`
  - `Assensing`
- **All Values**: Assensing, Astral Combat, Counterspelling

### selecttext@xml
**Path**: `chummer/powers/power/bonus/selecttext@xml`

- **Count**: 3
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `strings.xml`
  - `strings.xml`
  - `spells.xml`
- **All Values**: spells.xml, strings.xml

### selecttext@xpath
**Path**: `chummer/powers/power/bonus/selecttext@xpath`

- **Count**: 3
- **Unique Values**: 3
- **Examples**:
  - `/chummer/elements/*`
  - `/chummer/elements/element \| /chummer/immunities/immunity`
  - `/chummer/spells/spell[category = Rituals]`

### selecttext@allowedit
**Path**: `chummer/powers/power/bonus/selecttext@allowedit`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema critterpowers.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 9 unique values
  - Values: Chimeric Modification, Drake, Emergent, Free Spirit, Infected, Mundane, Paranormal, Toxic Critter Powers, Weakness
- **category** (`chummer/powers/power/category`): 9 unique values
  - Values: Chimeric Modification, Drake, Emergent, Free Spirit, Infected, Mundane, Paranormal, Shapeshifter, Weakness
- **val** (`chummer/powers/power/bonus/selectskill/val`): 2 unique values
  - Values: 2, MAG
- **source** (`chummer/powers/power/source`): 8 unique values
  - Values: AET, DTR, FA, HS, KC, RF, SG, SR5
- **type** (`chummer/powers/power/type`): 10 unique values
  - Values: As Spell, As ritual, Device, File, Host, Icon, M, P, Persona, Persona or Device
- **action** (`chummer/powers/power/action`): 7 unique values
  - Values: As ritual, Auto, Complex, Free, None, Simple, Special
- **range** (`chummer/powers/power/range`): 11 unique values
  - Values: As ritual, LOS, LOS (A), MAG, MAG x 25 m, MAG x 50, Per Spell, Self, Special, Touch, Touch or LOS
- **duration** (`chummer/powers/power/duration`): 9 unique values
  - Values: Always, As ritual, F x 10 Combat Turns, Instant, Per Spell, Permanent, Predetermined by Sprite, Special, Sustained
- **rating** (`chummer/powers/power/rating`): 3 unique values
  - Values: 2, 20, True
- **disablebiowaregrade** (`chummer/powers/power/bonus/disablebiowaregrade`): 12 unique values
  - Values: Alphaware, Alphaware (Adapsin), Betaware, Betaware (Adapsin), Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)
- **disablecyberwaregrade** (`chummer/powers/power/bonus/disablecyberwaregrade`): 12 unique values
  - Values: Alphaware, Alphaware (Adapsin), Betaware, Betaware (Adapsin), Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)
- **karma** (`chummer/powers/power/karma`): 10 unique values
  - Values: 12, 14, 16, 25, 3, 5, 50, 6, 8, 9
- **physical** (`chummer/powers/power/bonus/conditionmonitor/physical`): 3 unique values
  - Values: -20, -Rating, Rating
- **name** (`chummer/powers/power/bonus/specificskill/name`): 4 unique values
  - Values: Free-Fall, Gymnastics, Perception, Swimming
- **bonus** (`chummer/powers/power/bonus/specificskill/bonus`): 4 unique values
  - Values: 1, 2, 4, Rating
- **category** (`chummer/powers/power/bonus/movementreplace/category`): 2 unique values
  - Values: Fly, Ground
- **speed** (`chummer/powers/power/bonus/movementreplace/speed`): 3 unique values
  - Values: run, sprint, walk
- **val** (`chummer/powers/power/bonus/movementreplace/val`): 6 unique values
  - Values: 2, 3, 300, 4, 500, 6
- **name** (`chummer/powers/power/bonus/critterpowerlevels/power/name`): 2 unique values
  - Values: Hardened Armor, Hardened Mystic Armor
- **val** (`chummer/powers/power/bonus/critterpowerlevels/power/val`): 2 unique values
  - Values: 1, 2
- **name** (`chummer/powers/power/bonus/naturalweapon/name`): 9 unique values
  - Values: Bite, Claws, Electrocytes, Horns, Proboscis, Quills, Tail, Tunneling Claws, Tusk
- **reach** (`chummer/powers/power/bonus/naturalweapon/reach`): 3 unique values
  - Values: -1, 0, 1
- **damage** (`chummer/powers/power/bonus/naturalweapon/damage`): 5 unique values
  - Values: ({STR}+1)P, ({STR}+2)P, ({STR}+3)P, ({STR}-1)P, {BOD}S(e)
- **ap** (`chummer/powers/power/bonus/naturalweapon/ap`): 5 unique values
  - Values: +1, -1, -2, -6, 0
- **useskill** (`chummer/powers/power/bonus/naturalweapon/useskill`): 2 unique values
  - Values: Exotic Melee Weapon, Unarmed Combat
- **source** (`chummer/powers/power/bonus/naturalweapon/source`): 2 unique values
  - Values: DTR, HS
- **page** (`chummer/powers/power/bonus/naturalweapon/page`): 3 unique values
  - Values: 163, 171, 172
- **name** (`chummer/powers/power/bonus/specificattribute/name`): 8 unique values
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL
- **useskillspec** (`chummer/powers/power/bonus/naturalweapon/useskillspec`): 2 unique values
  - Values: Quills, Trunk

### Numeric Type Candidates
- **page** (`chummer/powers/power/page`): 100.0% numeric
  - Examples: 130, 133, 137
- **stun** (`chummer/powers/power/bonus/conditionmonitor/stun`): 100.0% numeric
  - Examples: -20
- **cyberwaretotalessmultiplier** (`chummer/powers/power/bonus/cyberwaretotalessmultiplier`): 100.0% numeric
  - Examples: 200
- **toxincontactresist** (`chummer/powers/power/bonus/toxincontactresist`): 100.0% numeric
  - Examples: 1
- **toxiningestionresist** (`chummer/powers/power/bonus/toxiningestionresist`): 100.0% numeric
  - Examples: 1
- **toxininhalationresist** (`chummer/powers/power/bonus/toxininhalationresist`): 100.0% numeric
  - Examples: 1
- **toxininjectionresist** (`chummer/powers/power/bonus/toxininjectionresist`): 100.0% numeric
  - Examples: 1
- **pathogencontactresist** (`chummer/powers/power/bonus/pathogencontactresist`): 100.0% numeric
  - Examples: 1
- **pathogeningestionresist** (`chummer/powers/power/bonus/pathogeningestionresist`): 100.0% numeric
  - Examples: 1
- **pathogeninhalationresist** (`chummer/powers/power/bonus/pathogeninhalationresist`): 100.0% numeric
  - Examples: 1
- **pathogeninjectionresist** (`chummer/powers/power/bonus/pathogeninjectionresist`): 100.0% numeric
  - Examples: 1
- **total** (`chummer/powers/power/required/allof/attribute/total`): 100.0% numeric
  - Examples: 3, 3, 3
- **unarmeddv** (`chummer/powers/power/bonus/unarmeddv`): 100.0% numeric
  - Examples: 2
- **val** (`chummer/powers/power/bonus/sprintbonus/val`): 100.0% numeric
  - Examples: 100, 100
- **initiativedice** (`chummer/powers/power/bonus/initiativedice`): 100.0% numeric
  - Examples: 1
- **percent** (`chummer/powers/power/bonus/walkmultiplier/percent`): 100.0% numeric
  - Examples: 100
- **percent** (`chummer/powers/power/bonus/runmultiplier/percent`): 100.0% numeric
  - Examples: 100
- **physicallimit** (`chummer/powers/power/bonus/physicallimit`): 100.0% numeric
  - Examples: 1

### Boolean Type Candidates
- **applytorating** (`chummer/powers/power/bonus/selectskill/applytorating`): 100.0% boolean
  - Examples: True, True, True
- **toxic** (`chummer/powers/power/toxic`): 100.0% boolean
  - Examples: True, True, True
- **applytorating** (`chummer/powers/power/bonus/specificskill/applytorating`): 100.0% boolean
  - Examples: True, True
