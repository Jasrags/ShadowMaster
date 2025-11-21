# Analysis Report: qualitylevels.xml

**File**: `data\chummerxml\qualitylevels.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 9
- **Unique Fields**: 2
- **Unique Attributes**: 1
- **Unique Element Types**: 6

## Fields

### level
**Path**: `chummer/qualitygroups/qualitygroup/levels/level`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 17-26 characters
- **Examples**:
  - `SINner (National)`
  - `SINner (Criminal)`
  - `SINner (Corporate Limited)`
  - `SINner (Corporate)`
- **All Values**: SINner (Corporate Limited), SINner (Corporate), SINner (Criminal), SINner (National)

### name
**Path**: `chummer/qualitygroups/qualitygroup/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `SINner`

## Attributes

### level@value
**Path**: `chummer/qualitygroups/qualitygroup/levels/level@value`

- **Count**: 4
- **Unique Values**: 4
- **Enum Candidate**: Yes
- **Examples**:
  - `1`
  - `2`
  - `3`
  - `4`
- **All Values**: 1, 2, 3, 4

## Type Improvement Recommendations

### Enum Candidates
- **level** (`chummer/qualitygroups/qualitygroup/levels/level`): 4 unique values
  - Values: SINner (Corporate Limited), SINner (Corporate), SINner (Criminal), SINner (National)
