# Analysis Report: references.xml

**File**: `data\chummerxml\references.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 4607
- **Unique Fields**: 4
- **Unique Attributes**: 0
- **Unique Element Types**: 7

## Fields

### id
**Path**: `chummer/rules/rule/id`

- **Count**: 921
- **Presence Rate**: 100.0%
- **Unique Values**: 921
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `72B79189-AB4F-4D90-A701-0F35606DE541`
  - `2BA1D635-A856-48F0-B533-A6792B3BF094`
  - `7ED94B84-A981-45B1-B029-180098151271`
  - `AB2A54DC-0A32-4AAB-9A5F-DC857A514B48`
  - `BF86ADB5-BC54-45CB-8555-8800604B47D6`

### name
**Path**: `chummer/rules/rule/name`

- **Count**: 921
- **Presence Rate**: 100.0%
- **Unique Values**: 866
- **Type Patterns**: string
- **Length Range**: 3-52 characters
- **Examples**:
  - `Another Night, Another Run`
  - `Introduction`
  - `The Battle Fought`
  - `Life in the Sixth World`
  - `Everything Has a Price`

### source
**Path**: `chummer/rules/rule/source`

- **Count**: 921
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
**Path**: `chummer/rules/rule/page`

- **Count**: 921
- **Presence Rate**: 100.0%
- **Unique Values**: 274
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-3 characters
- **Examples**:
  - `8`
  - `14`
  - `16`
  - `20`
  - `20`

## Type Improvement Recommendations

### Numeric Type Candidates
- **page** (`chummer/rules/rule/page`): 100.0% numeric
  - Examples: 8, 14, 16
