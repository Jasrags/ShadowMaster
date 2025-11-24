# Analysis Report: programs.xml

**File**: `data\chummerxml\programs.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 673
- **Unique Fields**: 11
- **Unique Attributes**: 4
- **Unique Element Types**: 20

## Fields

### id
**Path**: `chummer/programs/program/id`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 71
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `bed1f6eb-ead9-49aa-bb24-266c21d7aeb4`
  - `734f653b-35ca-4b26-b837-f64662878e8f`
  - `dd35285a-7506-4b7e-8d5a-1b6ea8577e19`
  - `a1dd8536-d2ca-41cd-be55-4adfdc52068b`
  - `3f2498d9-b575-474c-9b18-b959442011c5`

### name
**Path**: `chummer/programs/program/name`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 71
- **Type Patterns**: string
- **Length Range**: 4-28 characters
- **Examples**:
  - `Browse`
  - `Configurator`
  - `Edit`
  - `Encryption`
  - `Signal Scrub`

### category
**Path**: `chummer/programs/program/category`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-17 characters
- **Examples**:
  - `Common Programs`
  - `Common Programs`
  - `Common Programs`
  - `Common Programs`
  - `Common Programs`
- **All Values**: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software

### avail
**Path**: `chummer/programs/program/avail`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 16.9%
- **Boolean Ratio**: 15.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-13 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: (Rating * 2)R, 0, 0F, 12F, 4, 4R, 6R, Rating * 2, Rating * 3

### cost
**Path**: `chummer/programs/program/cost`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 85.9%
- **Boolean Ratio**: 22.5%
- **Length Range**: 1-56 characters
- **Examples**:
  - `80`
  - `80`
  - `80`
  - `80`
  - `80`

### source
**Path**: `chummer/programs/program/source`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: DT, R5, SR5

### page
**Path**: `chummer/programs/program/page`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `245`
  - `245`
  - `245`
  - `245`
  - `245`
- **All Values**: 127, 158, 159, 160, 245, 246, 269, 270, 31, 56, 57

### rating
**Path**: `chummer/programs/program/rating`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 58.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 2, 3, 6

### program
**Path**: `chummer/programs/program/required/oneof/program`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-28 characters
- **Examples**:
  - `Clearsight Autosoft`
  - `Exploit`
  - `Decryption`
  - `Wrapper`
  - `Sneak`
- **All Values**: Biofeedback, Cat's Paw, Clearsight Autosoft, Decryption, Exploit, Guard, Lockdown, Shell, Sneak, Stealth, Toolbox, Wrapper, [Model] Maneuvering Autosoft, [Weapon] Targeting Autosoft

### category
**Path**: `chummer/categories/category`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-17 characters
- **Examples**:
  - `Autosofts`
  - `Advanced Programs`
  - `Common Programs`
  - `Hacking Programs`
  - `Software`
- **All Values**: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software

### minrating
**Path**: `chummer/programs/program/minrating`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `2`
- **All Values**: 2, 3

## Attributes

### selecttext@xml
**Path**: `chummer/programs/program/bonus/selecttext@xml`

- **Count**: 8
- **Unique Values**: 3
- **Enum Candidate**: Yes
- **Examples**:
  - `vehicles.xml`
  - `vehicles.xml`
  - `vehicles.xml`
  - `weapons.xml`
  - `skills.xml`
- **All Values**: skills.xml, vehicles.xml, weapons.xml

### selecttext@xpath
**Path**: `chummer/programs/program/bonus/selecttext@xpath`

- **Count**: 8
- **Unique Values**: 4
- **Examples**:
  - `/chummer/vehicles/vehicle`
  - `/chummer/vehicles/vehicle`
  - `/chummer/vehicles/vehicle`
  - `/chummer/weapons/weapon[type = 'Ranged']`
  - `/chummer/skills/skill/name \| /chummer/knowledgeskills/skill/name`

### selecttext@allowedit
**Path**: `chummer/programs/program/bonus/selecttext@allowedit`

- **Count**: 8
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema programs.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 5 unique values
  - Values: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software
- **category** (`chummer/programs/program/category`): 5 unique values
  - Values: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software
- **avail** (`chummer/programs/program/avail`): 9 unique values
  - Values: (Rating * 2)R, 0, 0F, 12F, 4, 4R, 6R, Rating * 2, Rating * 3
- **source** (`chummer/programs/program/source`): 3 unique values
  - Values: DT, R5, SR5
- **page** (`chummer/programs/program/page`): 11 unique values
  - Values: 127, 158, 159, 160, 245, 246, 269, 270, 31, 56, 57
- **rating** (`chummer/programs/program/rating`): 4 unique values
  - Values: 0, 2, 3, 6
- **minrating** (`chummer/programs/program/minrating`): 2 unique values
  - Values: 2, 3
- **program** (`chummer/programs/program/required/oneof/program`): 14 unique values
  - Values: Biofeedback, Cat's Paw, Clearsight Autosoft, Decryption, Exploit, Guard, Lockdown, Shell, Sneak, Stealth, Toolbox, Wrapper, [Model] Maneuvering Autosoft, [Weapon] Targeting Autosoft
