# Analysis Report: ranges.xml

**File**: `data\chummerxml\ranges.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 224
- **Unique Fields**: 10
- **Unique Attributes**: 1
- **Unique Element Types**: 14

## Fields

### name
**Path**: `chummer/ranges/range/name`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 31
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-24 characters
- **Examples**:
  - `Tasers`
  - `Holdouts`
  - `Light Pistols`
  - `Heavy Pistols`
  - `Machine Pistols`

### min
**Path**: `chummer/ranges/range/min`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 93.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 20, 5

### short
**Path**: `chummer/ranges/range/short`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 80.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `5`
  - `5`
  - `5`
  - `5`
  - `5`
- **All Values**: 10, 15, 2, 25, 40, 5, 50, 6, 70, 9, {STR}, {STR}*2, {STR}/2

### medium
**Path**: `chummer/ranges/range/medium`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 80.6%
- **Enum Candidate**: Yes
- **Length Range**: 2-8 characters
- **Examples**:
  - `10`
  - `15`
  - `15`
  - `20`
  - `15`
- **All Values**: -1, 10, 100, 15, 150, 20, 200, 24, 250, 30, 300, 350, 36, 40, 45, {STR}, {STR}*10, {STR}*2, {STR}*4

### long
**Path**: `chummer/ranges/range/long`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 22
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 80.6%
- **Enum Candidate**: Yes
- **Length Range**: 2-9 characters
- **Examples**:
  - `15`
  - `30`
  - `30`
  - `40`
  - `30`
- **All Values**: -1, 120, 15, 150, 30, 350, 40, 450, 500, 60, 750, 80, 800, 90, {STR}*1.5, {STR}*3, {STR}*30, {STR}*5, {STR}*6, {STR}*8

### extreme
**Path**: `chummer/ranges/range/extreme`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 80.6%
- **Enum Candidate**: Yes
- **Length Range**: 2-9 characters
- **Examples**:
  - `20`
  - `50`
  - `50`
  - `60`
  - `50`
- **All Values**: -1, 120, 1200, 150, 1500, 180, 20, 50, 500, 550, 60, 750, 800, {STR}*10, {STR}*15, {STR}*2.5, {STR}*5, {STR}*60, {STR}*7

### short
**Path**: `chummer/modifiers/short`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`

### medium
**Path**: `chummer/modifiers/medium`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### long
**Path**: `chummer/modifiers/long`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-3`

### extreme
**Path**: `chummer/modifiers/extreme`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-6`

## Attributes

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema ranges.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **name** (`chummer/ranges/range/name`): 31 unique values
  - Values: Aerodynamic Grenade, Assault Cannons, Bows, Carbines, Grenade Launchers, Harpoon Gun, Heavy Pistols, Light Crossbows, Light Machine Guns, Light Pistols, Machine Pistols, Medium Crossbows, Missile Launchers, Net, Shotguns, Sniper Rifles, Sporting Rifles, Standard Grenade, Tasers, Thrown Knife
- **min** (`chummer/ranges/range/min`): 3 unique values
  - Values: 0, 20, 5
- **short** (`chummer/ranges/range/short`): 13 unique values
  - Values: 10, 15, 2, 25, 40, 5, 50, 6, 70, 9, {STR}, {STR}*2, {STR}/2
- **medium** (`chummer/ranges/range/medium`): 19 unique values
  - Values: -1, 10, 100, 15, 150, 20, 200, 24, 250, 30, 300, 350, 36, 40, 45, {STR}, {STR}*10, {STR}*2, {STR}*4
- **long** (`chummer/ranges/range/long`): 22 unique values
  - Values: -1, 120, 15, 150, 30, 350, 40, 450, 500, 60, 750, 80, 800, 90, {STR}*1.5, {STR}*3, {STR}*30, {STR}*5, {STR}*6, {STR}*8
- **extreme** (`chummer/ranges/range/extreme`): 19 unique values
  - Values: -1, 120, 1200, 150, 1500, 180, 20, 50, 500, 550, 60, 750, 800, {STR}*10, {STR}*15, {STR}*2.5, {STR}*5, {STR}*60, {STR}*7

### Numeric Type Candidates
- **short** (`chummer/modifiers/short`): 100.0% numeric
  - Examples: 0
- **medium** (`chummer/modifiers/medium`): 100.0% numeric
  - Examples: -1
- **long** (`chummer/modifiers/long`): 100.0% numeric
  - Examples: -3
- **extreme** (`chummer/modifiers/extreme`): 100.0% numeric
  - Examples: -6
