# Analysis Report: complexforms.xml

**File**: `data\chummerxml\complexforms.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 331
- **Unique Fields**: 8
- **Unique Attributes**: 3
- **Unique Element Types**: 15

## Fields

### id
**Path**: `chummer/complexforms/complexform/id`

- **Count**: 38
- **Presence Rate**: 100.0%
- **Unique Values**: 38
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `373638b9-4334-4645-99f5-c3673e4f809b`
  - `33e75cd6-cad7-43dd-87ac-9838c83eccb5`
  - `6b4ed8d5-75c8-4415-9578-15afa4ac8494`
  - `2abb9759-30b1-490f-9b42-0d6b7d282526`
  - `dbb1d719-c829-4c45-9a53-9ff538865c14`

### name
**Path**: `chummer/complexforms/complexform/name`

- **Count**: 38
- **Presence Rate**: 100.0%
- **Unique Values**: 38
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-31 characters
- **Examples**:
  - `Cleaner`
  - `Diffusion of [Matrix Attribute]`
  - `Editor`
  - `Infusion of [Matrix Attribute]`
  - `Static Veil`

### target
**Path**: `chummer/complexforms/complexform/target`

- **Count**: 38
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-9 characters
- **Examples**:
  - `Persona`
  - `Device`
  - `File`
  - `Device`
  - `Persona`
- **All Values**: Cyberware, Device, File, Host, IC, Icon, Persona, Self, Sprite

### duration
**Path**: `chummer/complexforms/complexform/duration`

- **Count**: 38
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `P`
  - `S`
  - `P`
  - `S`
  - `S`
- **All Values**: E, I, P, S, Special

### fv
**Path**: `chummer/complexforms/complexform/fv`

- **Count**: 38
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `L-2`
  - `L-2`
  - `L-1`
  - `L-2`
  - `L-3`
- **All Values**: L, L+0, L+1, L+2, L+3, L+6, L-1, L-2, L-3, Special

### source
**Path**: `chummer/complexforms/complexform/source`

- **Count**: 38
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: CF, DT, KC, SR5

### page
**Path**: `chummer/complexforms/complexform/page`

- **Count**: 38
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `252`
  - `252`
  - `252`
  - `252`
  - `252`
- **All Values**: 133, 134, 25, 252, 253, 58, 90, 91, 94, 95, 96

### quality
**Path**: `chummer/complexforms/complexform/required/oneof/quality`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 25-29 characters
- **Examples**:
  - `Resonant Stream: Cyberadept`
  - `Resonant Stream: Machinist`
  - `Resonant Stream: Sourceror`
  - `Resonant Stream: Technoshaman`
  - `Dissonant Stream: Apophenian`
- **All Values**: Dissonant Stream: Apophenian, Dissonant Stream: Erisian, Dissonant Stream: Morphinae, Resonant Stream: Cyberadept, Resonant Stream: Machinist, Resonant Stream: Sourceror, Resonant Stream: Technoshaman

## Attributes

### selecttext@xml
**Path**: `chummer/complexforms/complexform/bonus/selecttext@xml`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `strings.xml`
  - `strings.xml`

### selecttext@xpath
**Path**: `chummer/complexforms/complexform/bonus/selecttext@xpath`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `/chummer/matrixattributes/*`
  - `/chummer/matrixattributes/*`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema complexforms.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **id** (`chummer/complexforms/complexform/id`): 38 unique values
  - Values: 07b461db-3982-4fa2-8e24-cc5007c377a4, 080013b7-deb3-4a2e-822f-400ecf8293b2, 174f61be-5dad-41ad-8d6b-641bc514b9bb, 2badbff2-02e1-4218-97f0-f53f71f22cc4, 33e75cd6-cad7-43dd-87ac-9838c83eccb5, 3bed693e-d9dd-4873-8d54-2cbe97202174, 42a11004-5379-4b79-90fa-a30f7ddf4f14, 4856cfa1-89c8-484a-9127-ddc4a2327c63, 57566f59-ddbf-42bb-929a-2966ce2fde46, 5e5c8711-70a9-4068-b084-2ae23fce8fa7, 60b3f99f-f903-426a-ae13-ea604e77a956, 704abd70-c0e6-4f06-b186-53a7cb856584, 7cd49196-0912-43c5-b1a1-c9da96432340, 7d98d12d-5b02-4bc8-bf1f-b0b3507ebdaf, 92b4cf59-62ca-443b-aeb8-f5044967c835, d8b11a80-eb95-409e-a53b-18c48e09342e, f53a57c9-5073-4af3-aff9-45e3e449ac59, f64ccd1d-634f-4cf3-a020-ab03247abf25, f9a63582-6858-4b83-a76f-6daa52b127c5, f9dc77ad-bc06-4a1b-a967-0e78efe136e4
- **name** (`chummer/complexforms/complexform/name`): 38 unique values
  - Values: Arc Feedback, Bootleg Program, Causal Nexus, Cleaner, Coriolis, Derezz, Diffusion of [Matrix Attribute], Dissonance Spike, FAQ, Hyperthreading, Mirrored Persona, Overdrive, Pinch, Redundancy, Resonance Bind, Resonance Channel, Resonance Veil, Static Bomb, Transcendent Grid, Weaken Encryption
- **target** (`chummer/complexforms/complexform/target`): 9 unique values
  - Values: Cyberware, Device, File, Host, IC, Icon, Persona, Self, Sprite
- **duration** (`chummer/complexforms/complexform/duration`): 5 unique values
  - Values: E, I, P, S, Special
- **fv** (`chummer/complexforms/complexform/fv`): 10 unique values
  - Values: L, L+0, L+1, L+2, L+3, L+6, L-1, L-2, L-3, Special
- **source** (`chummer/complexforms/complexform/source`): 4 unique values
  - Values: CF, DT, KC, SR5
- **page** (`chummer/complexforms/complexform/page`): 11 unique values
  - Values: 133, 134, 25, 252, 253, 58, 90, 91, 94, 95, 96
- **quality** (`chummer/complexforms/complexform/required/oneof/quality`): 7 unique values
  - Values: Dissonant Stream: Apophenian, Dissonant Stream: Erisian, Dissonant Stream: Morphinae, Resonant Stream: Cyberadept, Resonant Stream: Machinist, Resonant Stream: Sourceror, Resonant Stream: Technoshaman
