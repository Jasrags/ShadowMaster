# Analysis Report: actions.xml

**File**: `data\chummerxml\actions.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 2713
- **Unique Fields**: 18
- **Unique Attributes**: 1
- **Unique Element Types**: 25

## Fields

### id
**Path**: `chummer/actions/action/id`

- **Count**: 260
- **Presence Rate**: 100.0%
- **Unique Values**: 260
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `c649963a-b88f-473f-96d0-2f38cd054d86`
  - `3e5bc4f5-f36e-4152-9e2b-a07c316ed017`
  - `85f6b9af-45a9-45b5-90e0-5421ae2278e8`
  - `d5bd6550-e4ef-40f7-b95c-47ea79c682d0`
  - `0ca7d61c-88e6-4e5c-841a-9cfbbb4ab491`

### name
**Path**: `chummer/actions/action/name`

- **Count**: 260
- **Presence Rate**: 100.0%
- **Unique Values**: 260
- **Type Patterns**: string
- **Length Range**: 3-57 characters
- **Examples**:
  - `Melee Defense`
  - `Ranged Defense`
  - `Suppressive Fire Defense`
  - `Resist Surprise`
  - `Direct, Physical Combat Spell Defense`

### type
**Path**: `chummer/actions/action/type`

- **Count**: 260
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: mixed_boolean, enum_candidate
- **Boolean Ratio**: 11.2%
- **Enum Candidate**: Yes
- **Length Range**: 2-9 characters
- **Examples**:
  - `No`
  - `No`
  - `No`
  - `No`
  - `No`
- **All Values**: Complex, Extended, Free, Interrupt, No, Simple

### source
**Path**: `chummer/actions/action/source`

- **Count**: 260
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
- **All Values**: DT, KC, R5, RG, SR5

### page
**Path**: `chummer/actions/action/page`

- **Count**: 260
- **Presence Rate**: 100.0%
- **Unique Values**: 46
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `168`
  - `186`
  - `179`
  - `192`
  - `283`

### dice
**Path**: `chummer/actions/action/test/dice`

- **Count**: 248
- **Presence Rate**: 100.0%
- **Unique Values**: 143
- **Type Patterns**: string
- **Length Range**: 4-216 characters
- **Examples**:
  - `{REA} + {INT} + {Improvement Value: Dodge}`
  - `{REA} + {INT} + {Improvement Value: Dodge}`
  - `{REA} + {EDG}`
  - `{INT} + {REA} + {Improvement Value: SurpriseResist}`
  - `{BOD} + {Improvement Value: SpellResistance}`

### bonusstring
**Path**: `chummer/actions/action/test/bonusstring`

- **Count**: 216
- **Presence Rate**: 100.0%
- **Unique Values**: 175
- **Type Patterns**: string
- **Length Range**: 6-686 characters
- **Examples**:
  - `Activate, deactivate, or switch the mode of any device to which the character has a direct neural interface connection.`
  - `Change the firing mode of a readied firearm with a linked smartgun system.`
  - `Drop one object held in the character's hand(s).`
  - `Drop to prone.`
  - `Eject the detachable magazine of a smartgun.`

### limit
**Path**: `chummer/actions/action/test/limit`

- **Count**: 181
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-46 characters
- **Examples**:
  - `{Weapon: Accuracy}`
  - `{Weapon: Accuracy}`
  - `{Weapon: Accuracy}`
  - `{Weapon: Accuracy}`
  - `{Weapon: Accuracy}`
- **All Values**: Variable, {Astral}, {Icon: Attack}, {Icon: Data Processing}, {Icon: Firewall}, {Icon: Sleaze}, {Max: {Icon: Sleaze} or {Icon: Attack}}, {Max: {Weapon: Accuracy} or {Vehicle: Sensor}}, {Mental}, {Physical}, {Social}, {Spell: Force}, {Spirit: Force}, {Target: {Icon: Rating}}, {Target: {Spell: Force}}, {Vehicle: Handling}, {Vehicle: Sensor}, {Weapon: Accuracy}, {Weapon: Limit}

### category
**Path**: `chummer/actions/action/category`

- **Count**: 48
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Matrix`
  - `Matrix`
  - `Matrix`
  - `Matrix`
  - `Matrix`

### initiativecost
**Path**: `chummer/actions/action/initiativecost`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `5`
  - `5`
  - `5`
  - `5`
  - `5`
- **All Values**: 10, 5, 7

### name
**Path**: `chummer/actions/action/boosts/boost/name`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-27 characters
- **Examples**:
  - `Melee Defense`
  - `Melee Defense`
  - `Melee Defense`
  - `Melee Defense`
  - `Ranged Defense`
- **All Values**: INT Data Processing Defense, INT Firewall Defense, LOG Attack Defense, LOG Data Processing Defense, LOG Firewall Defense, LOG Sleaze Defense, Melee Defense, Ranged Defense, Suppressive Fire Defense, WIL Attack Defense, WIL Data Processing Defense, WIL Firewall Defense, WIL Sleaze Defense

### duration
**Path**: `chummer/actions/action/boosts/boost/duration`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-12 characters
- **Examples**:
  - `One Attack`
  - `One Attack`
  - `One Attack`
  - `Rest of Turn`
  - `Rest of Turn`
- **All Values**: One Attack, Rest of Turn

### dicebonus
**Path**: `chummer/actions/action/boosts/boost/dicebonus`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-16 characters
- **Examples**:
  - `{Unarmed Combat}`
  - `{Gymnastics}`
  - `{Weapon: Skill}`
  - `{WIL}`
  - `{WIL}`
- **All Values**: {AGI}, {CHA}, {Gymnastics}, {Perception}, {Unarmed Combat}, {WIL}, {Weapon: Skill}

### specname
**Path**: `chummer/actions/action/specname`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-10 characters
- **Examples**:
  - `Sprinting`
  - `Blocking`
  - `Dodging`
  - `Parrying`
  - `Data Bombs`
- **All Values**: Blocking, Data Bombs, Dodging, Parrying, Sprinting

### addlimit
**Path**: `chummer/actions/action/boosts/boost/addlimit`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-18 characters
- **Examples**:
  - `{Physical}`
  - `{Physical}`
  - `{Weapon: Accuracy}`
  - `{Physical}`
  - `{Physical}`
- **All Values**: {Physical}, {Weapon: Accuracy}

### defenselimit
**Path**: `chummer/actions/action/test/defenselimit`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-29 characters
- **Examples**:
  - `{Mental}`
  - `{Max: {Physical} or {Mental}}`
- **All Values**: {Max: {Physical} or {Mental}}, {Mental}

### edgecost
**Path**: `chummer/actions/action/edgecost`

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

### version
**Path**: `chummer/version`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`

## Attributes

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema actions.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **type** (`chummer/actions/action/type`): 6 unique values
  - Values: Complex, Extended, Free, Interrupt, No, Simple
- **source** (`chummer/actions/action/source`): 5 unique values
  - Values: DT, KC, R5, RG, SR5
- **page** (`chummer/actions/action/page`): 46 unique values
  - Values: 119, 122, 123, 165, 167, 168, 179, 186, 195, 239, 242, 248, 249, 250, 283, 285, 295, 312, 38, 39
- **limit** (`chummer/actions/action/test/limit`): 19 unique values
  - Values: Variable, {Astral}, {Icon: Attack}, {Icon: Data Processing}, {Icon: Firewall}, {Icon: Sleaze}, {Max: {Icon: Sleaze} or {Icon: Attack}}, {Max: {Weapon: Accuracy} or {Vehicle: Sensor}}, {Mental}, {Physical}, {Social}, {Spell: Force}, {Spirit: Force}, {Target: {Icon: Rating}}, {Target: {Spell: Force}}, {Vehicle: Handling}, {Vehicle: Sensor}, {Weapon: Accuracy}, {Weapon: Limit}
- **specname** (`chummer/actions/action/specname`): 5 unique values
  - Values: Blocking, Data Bombs, Dodging, Parrying, Sprinting
- **initiativecost** (`chummer/actions/action/initiativecost`): 3 unique values
  - Values: 10, 5, 7
- **name** (`chummer/actions/action/boosts/boost/name`): 13 unique values
  - Values: INT Data Processing Defense, INT Firewall Defense, LOG Attack Defense, LOG Data Processing Defense, LOG Firewall Defense, LOG Sleaze Defense, Melee Defense, Ranged Defense, Suppressive Fire Defense, WIL Attack Defense, WIL Data Processing Defense, WIL Firewall Defense, WIL Sleaze Defense
- **duration** (`chummer/actions/action/boosts/boost/duration`): 2 unique values
  - Values: One Attack, Rest of Turn
- **dicebonus** (`chummer/actions/action/boosts/boost/dicebonus`): 7 unique values
  - Values: {AGI}, {CHA}, {Gymnastics}, {Perception}, {Unarmed Combat}, {WIL}, {Weapon: Skill}
- **addlimit** (`chummer/actions/action/boosts/boost/addlimit`): 2 unique values
  - Values: {Physical}, {Weapon: Accuracy}
- **defenselimit** (`chummer/actions/action/test/defenselimit`): 2 unique values
  - Values: {Max: {Physical} or {Mental}}, {Mental}

### Numeric Type Candidates
- **version** (`chummer/version`): 100.0% numeric
  - Examples: 0
- **edgecost** (`chummer/actions/action/edgecost`): 100.0% numeric
  - Examples: 1, 1
