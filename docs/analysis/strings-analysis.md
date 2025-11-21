# Analysis Report: strings.xml

**File**: `data\chummerxml\strings.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 23
- **Unique Fields**: 4
- **Unique Attributes**: 0
- **Unique Element Types**: 9

## Fields

### element
**Path**: `chummer/elements/element`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-11 characters
- **Examples**:
  - `Acid`
  - `Cold`
  - `Electricity`
  - `Fire`
  - `Pollutant`
- **All Values**: Acid, Cold, Electricity, Fire, Pollutant, Radiation, Water

### category
**Path**: `chummer/spiritcategories/category`

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

### key
**Path**: `chummer/matrixattributes/key`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-21 characters
- **Examples**:
  - `String_Attack`
  - `String_DataProcessing`
  - `String_Firewall`
  - `String_Sleaze`
- **All Values**: String_Attack, String_DataProcessing, String_Firewall, String_Sleaze

### immunity
**Path**: `chummer/immunities/immunity`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-14 characters
- **Examples**:
  - `Age`
  - `Normal Weapons`
- **All Values**: Age, Normal Weapons

## Type Improvement Recommendations

### Enum Candidates
- **key** (`chummer/matrixattributes/key`): 4 unique values
  - Values: String_Attack, String_DataProcessing, String_Firewall, String_Sleaze
- **element** (`chummer/elements/element`): 7 unique values
  - Values: Acid, Cold, Electricity, Fire, Pollutant, Radiation, Water
- **immunity** (`chummer/immunities/immunity`): 2 unique values
  - Values: Age, Normal Weapons
- **category** (`chummer/spiritcategories/category`): 5 unique values
  - Values: Combat, Detection, Health, Illusion, Manipulation
