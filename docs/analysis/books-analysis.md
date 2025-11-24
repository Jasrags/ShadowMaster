# Analysis Report: books.xml

**File**: `data\chummerxml\books.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 678
- **Unique Fields**: 6
- **Unique Attributes**: 1
- **Unique Element Types**: 12

## Fields

### language
**Path**: `chummer/books/book/matches/match/language`

- **Count**: 91
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-5 characters
- **Examples**:
  - `en-us`
  - `de-de`
  - `en-us`
  - `de-de`
  - `en-us`
- **All Values**: de-de, en-us, fr-fr

### text
**Path**: `chummer/books/book/matches/match/text`

- **Count**: 91
- **Presence Rate**: 100.0%
- **Unique Values**: 89
- **Type Patterns**: string
- **Length Range**: 12-124 characters
- **Examples**:
  - `Whether we want to admit it or not,`
  - `Soweit die Historiker das sagen können,`
  - `The weapon is designed to be hand loaded`
  - `Mit dem New Model Revolver kehrt`
  - `The whole run was a setup. It had to be`

### page
**Path**: `chummer/books/book/matches/match/page`

- **Count**: 91
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 3.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `2`
  - `3`
  - `4`
  - `6`
- **All Values**: 1, 10, 2, 3, 4, 5, 6, 7, 8

### id
**Path**: `chummer/books/book/id`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 63
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `289bc41d-6dd5-4216-9bc7-e6f0cabae9ac`
  - `b68175bc-e10f-4e11-9361-ed62bb371c8d`
  - `5d6626a2-2400-44b5-b777-d7dac6cb512f`
  - `f5ec713c-98cd-41f6-a0a4-4a8eaed55b66`
  - `3976dc50-f7db-481d-9372-fc2a5c1178ce`

### name
**Path**: `chummer/books/book/name`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 63
- **Type Patterns**: string
- **Length Range**: 8-54 characters
- **Examples**:
  - `Assassin's Primer`
  - `Gun Heaven 3`
  - `Run and Gun`
  - `Shadowrun 5th Edition`
  - `Street Grimoire`

### code
**Path**: `chummer/books/book/code`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 63
- **Type Patterns**: mixed_numeric
- **Numeric Ratio**: 1.6%
- **Length Range**: 2-8 characters
- **Examples**:
  - `AP`
  - `GH3`
  - `RG`
  - `SR5`
  - `SG`

## Attributes

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema books.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **language** (`chummer/books/book/matches/match/language`): 3 unique values
  - Values: de-de, en-us, fr-fr
- **page** (`chummer/books/book/matches/match/page`): 9 unique values
  - Values: 1, 10, 2, 3, 4, 5, 6, 7, 8
