# Analysis Report: skills.xml

**File**: `data\chummerxml\skills.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 4589
- **Unique Fields**: 21
- **Unique Attributes**: 2
- **Unique Element Types**: 31

## Fields

### spec
**Path**: `chummer/knowledgeskills/skill/specs/spec`

- **Count**: 1852
- **Presence Rate**: 100.0%
- **Unique Values**: 661
- **Type Patterns**: string
- **Length Range**: 2-35 characters
- **Examples**:
  - `Corporate`
  - `Government`
  - `Religious`
  - `Combat`
  - `Command`

### spec
**Path**: `chummer/skills/skill/specs/spec`

- **Count**: 378
- **Presence Rate**: 100.0%
- **Unique Values**: 307
- **Type Patterns**: string
- **Length Range**: 2-36 characters
- **Examples**:
  - `Aerospace`
  - `Fixed Wing`
  - `LTA (blimp)`
  - `Rotary Wing`
  - `Tilt Wing`

### id
**Path**: `chummer/knowledgeskills/skill/id`

- **Count**: 195
- **Presence Rate**: 100.0%
- **Unique Values**: 195
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `9f348c99-27e8-47ac-a098-a8a6a54c446a`
  - `60156c75-78e9-4d79-af3f-494baa20edb7`
  - `40d28f1b-2171-4a3b-a640-6b097a4dea95`
  - `f43b2a75-a556-4d3a-8f8b-f1615a78538c`
  - `534600a0-395e-4bbc-8dc9-97a007e97504`

### name
**Path**: `chummer/knowledgeskills/skill/name`

- **Count**: 195
- **Presence Rate**: 100.0%
- **Unique Values**: 195
- **Type Patterns**: string
- **Length Range**: 2-49 characters
- **Examples**:
  - `Administration`
  - `Alchemy`
  - `Alcohol`
  - `Anishinaabe`
  - `Anatomy`

### attribute
**Path**: `chummer/knowledgeskills/skill/attribute`

- **Count**: 195
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `LOG`
  - `LOG`
  - `INT`
  - `INT`
  - `LOG`
- **All Values**: INT, LOG

### category
**Path**: `chummer/knowledgeskills/skill/category`

- **Count**: 195
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Professional`
  - `Professional`
  - `Interest`
  - `Language`
  - `Academic`
- **All Values**: Academic, Interest, Language, Professional, Street

### default
**Path**: `chummer/knowledgeskills/skill/default`

- **Count**: 195
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

### id
**Path**: `chummer/skills/skill/id`

- **Count**: 76
- **Presence Rate**: 100.0%
- **Unique Values**: 76
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `b52f7575-eebf-41c4-938d-df3397b5ee68`
  - `fc89344f-daa6-438e-b61d-23f10dd13e44`
  - `e09e5aa7-e496-41a2-97ce-17f577361888`
  - `74a68a9e-8c5b-4998-8dbb-08c1e768afc3`
  - `1537ca5c-fa93-4c05-b073-a2a0eed91b8e`

### name
**Path**: `chummer/skills/skill/name`

- **Count**: 76
- **Presence Rate**: 100.0%
- **Unique Values**: 76
- **Type Patterns**: string
- **Length Range**: 3-20 characters
- **Examples**:
  - `Aeronautics Mechanic`
  - `Alchemy`
  - `Animal Handling`
  - `Arcana`
  - `Archery`

### attribute
**Path**: `chummer/skills/skill/attribute`

- **Count**: 76
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `LOG`
  - `MAG`
  - `CHA`
  - `LOG`
  - `AGI`
- **All Values**: AGI, BOD, CHA, INT, LOG, MAG, REA, RES, STR, WIL

### category
**Path**: `chummer/skills/skill/category`

- **Count**: 76
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-21 characters
- **Examples**:
  - `Technical Active`
  - `Magical Active`
  - `Technical Active`
  - `Pseudo-Magical Active`
  - `Combat Active`
- **All Values**: Combat Active, Magical Active, Physical Active, Pseudo-Magical Active, Resonance Active, Social Active, Technical Active, Vehicle Active

### default
**Path**: `chummer/skills/skill/default`

- **Count**: 76
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: boolean_string, enum_candidate
- **Boolean Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 4-5 characters
- **Examples**:
  - `False`
  - `False`
  - `True`
  - `False`
  - `True`
- **All Values**: False, True

### source
**Path**: `chummer/skills/skill/source`

- **Count**: 76
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`

### page
**Path**: `chummer/skills/skill/page`

- **Count**: 76
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `143`
  - `142`
  - `143`
  - `142`
  - `130`
- **All Values**: 130, 131, 132, 133, 134, 138, 139, 142, 143, 144, 145, 146, 147, 394

### skillgroup
**Path**: `chummer/skills/skill/skillgroup`

- **Count**: 48
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Engineering`
  - `Enchanting`
  - `Enchanting`
  - `Firearms`
  - `Engineering`
- **All Values**: Acting, Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery, Stealth, Tasking

### name
**Path**: `chummer/skillgroups/name`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Acting`
  - `Athletics`
  - `Biotech`
  - `Close Combat`
  - `Conjuring`
- **All Values**: Acting, Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery, Stealth, Tasking

### category
**Path**: `chummer/categories/category`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-21 characters
- **Examples**:
  - `Combat Active`
  - `Physical Active`
  - `Social Active`
  - `Magical Active`
  - `Pseudo-Magical Active`
- **All Values**: Academic, Combat Active, Interest, Language, Magical Active, Physical Active, Professional, Pseudo-Magical Active, Resonance Active, Social Active, Street, Technical Active, Vehicle Active

### exotic
**Path**: `chummer/skills/skill/exotic`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`
  - `True`
  - `True`

### requiresflymovement
**Path**: `chummer/skills/skill/requiresflymovement`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`

### requiresgroundmovement
**Path**: `chummer/skills/skill/requiresgroundmovement`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`

### requiresswimmovement
**Path**: `chummer/skills/skill/requiresswimmovement`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`

## Attributes

### category@type
**Path**: `chummer/categories/category@type`

- **Count**: 13
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `active`
  - `active`
  - `active`
  - `active`
  - `active`
- **All Values**: active, knowledge

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema skills.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **name** (`chummer/skillgroups/name`): 15 unique values
  - Values: Acting, Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery, Stealth, Tasking
- **category** (`chummer/categories/category`): 13 unique values
  - Values: Academic, Combat Active, Interest, Language, Magical Active, Physical Active, Professional, Pseudo-Magical Active, Resonance Active, Social Active, Street, Technical Active, Vehicle Active
- **attribute** (`chummer/skills/skill/attribute`): 10 unique values
  - Values: AGI, BOD, CHA, INT, LOG, MAG, REA, RES, STR, WIL
- **category** (`chummer/skills/skill/category`): 8 unique values
  - Values: Combat Active, Magical Active, Physical Active, Pseudo-Magical Active, Resonance Active, Social Active, Technical Active, Vehicle Active
- **default** (`chummer/skills/skill/default`): 2 unique values
  - Values: False, True
- **skillgroup** (`chummer/skills/skill/skillgroup`): 15 unique values
  - Values: Acting, Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery, Stealth, Tasking
- **page** (`chummer/skills/skill/page`): 14 unique values
  - Values: 130, 131, 132, 133, 134, 138, 139, 142, 143, 144, 145, 146, 147, 394
- **attribute** (`chummer/knowledgeskills/skill/attribute`): 2 unique values
  - Values: INT, LOG
- **category** (`chummer/knowledgeskills/skill/category`): 5 unique values
  - Values: Academic, Interest, Language, Professional, Street

### Boolean Type Candidates
- **exotic** (`chummer/skills/skill/exotic`): 100.0% boolean
  - Examples: True, True, True
- **requiresflymovement** (`chummer/skills/skill/requiresflymovement`): 100.0% boolean
  - Examples: True
- **requiresgroundmovement** (`chummer/skills/skill/requiresgroundmovement`): 100.0% boolean
  - Examples: True
- **requiresswimmovement** (`chummer/skills/skill/requiresswimmovement`): 100.0% boolean
  - Examples: True
- **default** (`chummer/knowledgeskills/skill/default`): 100.0% boolean
  - Examples: False, False, False
