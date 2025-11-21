# Analysis Report: spiritpowers.xml

**File**: `data\chummerxml\spiritpowers.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 342
- **Unique Fields**: 3
- **Unique Attributes**: 1
- **Unique Element Types**: 6

## Fields

### name
**Path**: `chummer/powers/power/name`

- **Count**: 85
- **Presence Rate**: 100.0%
- **Unique Values**: 85
- **Type Patterns**: string
- **Length Range**: 4-28 characters
- **Examples**:
  - `Accident`
  - `Animal Control`
  - `Armor`
  - `Astral Form`
  - `Binding`

### source
**Path**: `chummer/powers/power/source`

- **Count**: 85
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
- **All Values**: KC, SG, SR5

### page
**Path**: `chummer/powers/power/page`

- **Count**: 85
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `394`
  - `394`
  - `394`
  - `394`
  - `395`
- **All Values**: 100, 101, 193, 194, 195, 196, 197, 198, 199, 256, 257, 394, 395, 396, 397, 398, 399, 400, 401

## Attributes

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema critterpowers.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **source** (`chummer/powers/power/source`): 3 unique values
  - Values: KC, SG, SR5
- **page** (`chummer/powers/power/page`): 19 unique values
  - Values: 100, 101, 193, 194, 195, 196, 197, 198, 199, 256, 257, 394, 395, 396, 397, 398, 399, 400, 401
