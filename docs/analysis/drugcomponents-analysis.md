# Analysis Report: drugcomponents.xml

**File**: `data\chummerxml\drugcomponents.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 1470
- **Unique Fields**: 46
- **Unique Attributes**: 2
- **Unique Element Types**: 62

## Fields

### name
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/attribute/name`

- **Count**: 103
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `BOD`
  - `CHA`
  - `WIL`
  - `AGI`
  - `REA`
- **All Values**: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

### value
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/attribute/value`

- **Count**: 103
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 23.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-2`
  - `1`
  - `1`
  - `1`
- **All Values**: -1, -2, 1, 2, 3

### id
**Path**: `chummer/drugs/drug/id`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 71
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `62bffcd7-4a43-45cd-9cf7-3067ba9688f6`
  - `8dc829b9-8b94-4510-ab1a-2305cbad69c9`
  - `5f5bc907-ce31-4f34-b7cf-a48d9d5d10b3`
  - `929c4835-1754-4999-9215-9859e8ec5384`
  - `098bf489-bea9-4f17-b3d9-aead979fdc32`

### name
**Path**: `chummer/drugs/drug/name`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 70
- **Type Patterns**: string
- **Length Range**: 2-32 characters
- **Examples**:
  - `Bliss`
  - `Cram`
  - `Deepweed`
  - `Jazz`
  - `Kamikaze`

### category
**Path**: `chummer/drugs/drug/category`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-6 characters
- **Examples**:
  - `Drugs`
  - `Drugs`
  - `Drugs`
  - `Drugs`
  - `Drugs`
- **All Values**: Drugs, Toxins

### rating
**Path**: `chummer/drugs/drug/rating`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`

### source
**Path**: `chummer/drugs/drug/source`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: BB, CF, LCD, SAG, SR5, SS, TVG

### page
**Path**: `chummer/drugs/drug/page`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `411`
  - `411`
  - `411`
  - `411`
  - `412`
- **All Values**: 179, 180, 181, 182, 183, 184, 185, 186, 187, 189, 19, 204, 205, 411, 412, 97

### avail
**Path**: `chummer/drugs/drug/avail`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 25
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 22.5%
- **Boolean Ratio**: 4.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `3F`
  - `2R`
  - `8F`
  - `2R`
  - `4R`
- **All Values**: 0, 10F, 10R, 12R, 14F, 14R, 16F, 1R, 2R, 3, 3F, 3R, 4, 4F, 5, 5F, 6, 8, 8F, 8R

### cost
**Path**: `chummer/drugs/drug/cost`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 32
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `15`
  - `10`
  - `400`
  - `75`
  - `100`

### level
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/level`

- **Count**: 40
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 77.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 1, 2

### id
**Path**: `chummer/drugcomponents/drugcomponent/id`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 22
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `33ae6b1c-62f6-4824-967d-0e2b37c7d1b9`
  - `ca5e7e5e-6aab-472a-a273-6d21d4e9ad2e`
  - `cf8a2d2b-03b9-4440-873b-829c7d82489e`
  - `8ec241f7-31c0-4655-80dd-3d4ce2a0b56d`
  - `e93015ca-12ff-48c4-b45e-f1387f2ea1ef`
- **All Values**: 04f24ebd-e1cc-4b57-abe7-c8aa3fa91539, 0737b976-ec7d-45cf-a84f-1c0524dac6f9, 1ed8c102-3b31-42ae-bf0f-4d9fe22fc4fb, 33ae6b1c-62f6-4824-967d-0e2b37c7d1b9, 41018f6e-beb4-4a6c-8d59-501db802ce1a, 47387cd3-836c-4283-a1ce-c62487dd669b, 5ff4db39-aa0e-42f5-ae24-2bf79560670b, 7eebc516-8298-4a7f-afef-10dceebb5e58, 9f4c87ba-4a0d-48e8-8c90-08b689da7203, a4d7e764-5aa7-4394-92f1-43ff58c1a801, c1a7dd91-61c9-49e1-8dfd-892882bd1816, c98d587d-5651-4a53-a9ab-cc2262236658, ca5e7e5e-6aab-472a-a273-6d21d4e9ad2e, cf8a2d2b-03b9-4440-873b-829c7d82489e, d67dbda7-b03f-4914-9f1d-a6a238f6944e, e6001189-e413-43bc-86ee-2136ca5d10bf, e93015ca-12ff-48c4-b45e-f1387f2ea1ef, ebbb6a0e-f3b1-47f3-85c1-e408b4a6ceb2, ef191753-a06e-4762-9674-47e3fe90ed1e, fdca4090-a933-4393-a3bd-7633aad967a2

### name
**Path**: `chummer/drugcomponents/drugcomponent/name`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 22
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-19 characters
- **Examples**:
  - `Tank`
  - `Defender`
  - `Genius`
  - `Charmer`
  - `Warrior`
- **All Values**: Brute, Charmer, Crush, Defender, Duration Enhancer, Genius, Gut Check, Ingestion Enhancer, Inhalation Enhancer, Lighting, Razor Mind, Resist, Shock and Awe, Smoothtalk, Speed Demon, Speed Enhancer, Stonewall, Strike, Tank, The General

### category
**Path**: `chummer/drugcomponents/drugcomponent/category`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-10 characters
- **Examples**:
  - `Foundation`
  - `Foundation`
  - `Foundation`
  - `Foundation`
  - `Foundation`
- **All Values**: Block, Enhancer, Foundation

### availability
**Path**: `chummer/drugcomponents/drugcomponent/availability`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 77.3%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `+4R`
  - `+4R`
  - `+4R`
  - `+4R`
  - `+4R`
- **All Values**: +1, +2, +4R

### cost
**Path**: `chummer/drugcomponents/drugcomponent/cost`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `75`
  - `75`
  - `75`
  - `75`
  - `75`
- **All Values**: 20, 30, 40, 50, 75

### source
**Path**: `chummer/drugcomponents/drugcomponent/source`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 2-2 characters
- **Examples**:
  - `CF`
  - `CF`
  - `CF`
  - `CF`
  - `CF`

### page
**Path**: `chummer/drugcomponents/drugcomponent/page`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `190`
  - `190`
  - `190`
  - `190`
  - `190`
- **All Values**: 190, 191

### crashdamage
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/crashdamage`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 14.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`
  - `2`
- **All Values**: 1, 2, 4, 8

### name
**Path**: `chummer/drugs/drug/bonus/attribute/name`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `REA`
  - `REA`
  - `REA`
  - `WIL`
  - `REA`
- **All Values**: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

### value
**Path**: `chummer/drugs/drug/bonus/attribute/value`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 77.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`
- **All Values**: -2, 1, 2

### speed
**Path**: `chummer/drugs/drug/speed`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 40.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `1`
  - `600`
  - `1`
  - `1`
  - `1`
- **All Values**: 1, 300, 6, 600

### vectors
**Path**: `chummer/drugs/drug/vectors`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-20 characters
- **Examples**:
  - `Inhalation,Injection`
  - `Inhalation,Injection`
  - `Inhalation,Injection`
  - `Inhalation`
  - `Inhalation`
- **All Values**: Inhalation, Inhalation,Injection, Injection

### duration
**Path**: `chummer/drugs/drug/duration`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 10.0%
- **Enum Candidate**: Yes
- **Length Range**: 6-15 characters
- **Examples**:
  - `(6-{BOD})*3600`
  - `(12-{BOD})*3600`
  - `(6-{BOD})*3600`
  - `{D6}*600`
  - `{D6}*600`
- **All Values**: (10-{BOD})*3600, (12-{BOD})*3600, (6-{BOD})*3600, 345600, {D6}*600

### name
**Path**: `chummer/drugs/drug/bonus/limit/name`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-8 characters
- **Examples**:
  - `Mental`
  - `Physical`
  - `Social`
  - `Physical`
  - `Mental`
- **All Values**: Mental, Physical, Social

### value
**Path**: `chummer/drugs/drug/bonus/limit/value`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 30.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-1`
  - `-1`
  - `-1`
  - `-1`
  - `1`
- **All Values**: -1, 1, 2

### rating
**Path**: `chummer/drugcomponents/drugcomponent/rating`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 44.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`
  - `6`
  - `6`
  - `6`
  - `6`
- **All Values**: 1, 6

### threshold
**Path**: `chummer/drugcomponents/drugcomponent/threshold`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 44.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`
  - `2`
- **All Values**: 1, 2

### name
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/limit/name`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-8 characters
- **Examples**:
  - `Social`
  - `Physical`
  - `Mental`
  - `Social`
  - `Physical`
- **All Values**: Mental, Physical, Social

### value
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/limit/value`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 14.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `-1`
  - `-1`
  - `-1`
  - `-2`
- **All Values**: -1, -2, 1

### id
**Path**: `chummer/grades/grade/id`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `b00a075a-2c2c-4816-bb4a-0d0a33d06370`
  - `b8b70858-6433-451a-835b-49b67d7b63e2`
  - `b3366009-4884-44d7-9efa-34e213a75e7e`
  - `cd20695d-fedb-476b-956b-1a1ecdd65f03`
- **All Values**: b00a075a-2c2c-4816-bb4a-0d0a33d06370, b3366009-4884-44d7-9efa-34e213a75e7e, b8b70858-6433-451a-835b-49b67d7b63e2, cd20695d-fedb-476b-956b-1a1ecdd65f03

### name
**Path**: `chummer/grades/grade/name`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-14 characters
- **Examples**:
  - `Standard`
  - `Street Cooked`
  - `Pharmaceutical`
  - `Designer`
- **All Values**: Designer, Pharmaceutical, Standard, Street Cooked

### cost
**Path**: `chummer/grades/grade/cost`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `1`
  - `0.5`
  - `2`
  - `6`
- **All Values**: 0.5, 1, 2, 6

### source
**Path**: `chummer/grades/grade/source`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 2-2 characters
- **Examples**:
  - `CF`
  - `CF`
  - `CF`
  - `CF`

### quality
**Path**: `chummer/drugs/drug/bonus/quality`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 19-19 characters
- **Examples**:
  - `High Pain Tolerance`
  - `High Pain Tolerance`
  - `High Pain Tolerance`
  - `High Pain Tolerance`

### initiativedice
**Path**: `chummer/drugs/drug/bonus/initiativedice`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `2`
- **All Values**: 1, 2

### quality
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/quality`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-19 characters
- **Examples**:
  - `High Pain Tolerance`
  - `Low Pain Tolerance`
  - `Unsteady Hands`
  - `Uncouth`
- **All Values**: High Pain Tolerance, Low Pain Tolerance, Uncouth, Unsteady Hands

### category
**Path**: `chummer/categories/category`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-10 characters
- **Examples**:
  - `Foundation`
  - `Block`
  - `Enhancer`
- **All Values**: Block, Enhancer, Foundation

### info
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/info`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-34 characters
- **Examples**:
  - `Crash Effect: -1d6 initiative dice`
  - `Ingestion`
  - `Inhalation`
- **All Values**: Crash Effect: -1d6 initiative dice, Ingestion, Inhalation

### initiativedice
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/initiativedice`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
  - `3`
- **All Values**: 1, 2, 3

### name
**Path**: `chummer/drugs/drug/bonus/specificskill/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 10-10 characters
- **Examples**:
  - `Perception`
  - `Perception`

### bonus
**Path**: `chummer/drugs/drug/bonus/specificskill/bonus`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `1`
- **All Values**: 1, 2

### limit
**Path**: `chummer/drugcomponents/drugcomponent/limit`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `3`

### addictionthreshold
**Path**: `chummer/grades/grade/addictionthreshold`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### speed
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/speed`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-3`

### duration
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/duration`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

## Attributes

### quality@rating
**Path**: `chummer/drugs/drug/bonus/quality@rating`

- **Count**: 4
- **Unique Values**: 3
- **Enum Candidate**: Yes
- **Examples**:
  - `3`
  - `3`
  - `6`
  - `1`
- **All Values**: 1, 3, 6

### quality@rating
**Path**: `chummer/drugcomponents/drugcomponent/effects/effect/quality@rating`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `3`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 3 unique values
  - Values: Block, Enhancer, Foundation
- **id** (`chummer/grades/grade/id`): 4 unique values
  - Values: b00a075a-2c2c-4816-bb4a-0d0a33d06370, b3366009-4884-44d7-9efa-34e213a75e7e, b8b70858-6433-451a-835b-49b67d7b63e2, cd20695d-fedb-476b-956b-1a1ecdd65f03
- **name** (`chummer/grades/grade/name`): 4 unique values
  - Values: Designer, Pharmaceutical, Standard, Street Cooked
- **cost** (`chummer/grades/grade/cost`): 4 unique values
  - Values: 0.5, 1, 2, 6
- **category** (`chummer/drugs/drug/category`): 2 unique values
  - Values: Drugs, Toxins
- **source** (`chummer/drugs/drug/source`): 7 unique values
  - Values: BB, CF, LCD, SAG, SR5, SS, TVG
- **page** (`chummer/drugs/drug/page`): 16 unique values
  - Values: 179, 180, 181, 182, 183, 184, 185, 186, 187, 189, 19, 204, 205, 411, 412, 97
- **avail** (`chummer/drugs/drug/avail`): 25 unique values
  - Values: 0, 10F, 10R, 12R, 14F, 14R, 16F, 1R, 2R, 3, 3F, 3R, 4, 4F, 5, 5F, 6, 8, 8F, 8R
- **cost** (`chummer/drugs/drug/cost`): 32 unique values
  - Values: 10, 1000, 1100, 1250, 15, 150, 1500, 1700, 20, 200, 2000, 25, 250, 2500, 30, 300, 500, 750, 800, 900
- **speed** (`chummer/drugs/drug/speed`): 4 unique values
  - Values: 1, 300, 6, 600
- **vectors** (`chummer/drugs/drug/vectors`): 3 unique values
  - Values: Inhalation, Inhalation,Injection, Injection
- **duration** (`chummer/drugs/drug/duration`): 5 unique values
  - Values: (10-{BOD})*3600, (12-{BOD})*3600, (6-{BOD})*3600, 345600, {D6}*600
- **name** (`chummer/drugs/drug/bonus/attribute/name`): 8 unique values
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL
- **value** (`chummer/drugs/drug/bonus/attribute/value`): 3 unique values
  - Values: -2, 1, 2
- **name** (`chummer/drugs/drug/bonus/limit/name`): 3 unique values
  - Values: Mental, Physical, Social
- **value** (`chummer/drugs/drug/bonus/limit/value`): 3 unique values
  - Values: -1, 1, 2
- **initiativedice** (`chummer/drugs/drug/bonus/initiativedice`): 2 unique values
  - Values: 1, 2
- **bonus** (`chummer/drugs/drug/bonus/specificskill/bonus`): 2 unique values
  - Values: 1, 2
- **id** (`chummer/drugcomponents/drugcomponent/id`): 22 unique values
  - Values: 04f24ebd-e1cc-4b57-abe7-c8aa3fa91539, 0737b976-ec7d-45cf-a84f-1c0524dac6f9, 1ed8c102-3b31-42ae-bf0f-4d9fe22fc4fb, 33ae6b1c-62f6-4824-967d-0e2b37c7d1b9, 41018f6e-beb4-4a6c-8d59-501db802ce1a, 47387cd3-836c-4283-a1ce-c62487dd669b, 5ff4db39-aa0e-42f5-ae24-2bf79560670b, 7eebc516-8298-4a7f-afef-10dceebb5e58, 9f4c87ba-4a0d-48e8-8c90-08b689da7203, a4d7e764-5aa7-4394-92f1-43ff58c1a801, c1a7dd91-61c9-49e1-8dfd-892882bd1816, c98d587d-5651-4a53-a9ab-cc2262236658, ca5e7e5e-6aab-472a-a273-6d21d4e9ad2e, cf8a2d2b-03b9-4440-873b-829c7d82489e, d67dbda7-b03f-4914-9f1d-a6a238f6944e, e6001189-e413-43bc-86ee-2136ca5d10bf, e93015ca-12ff-48c4-b45e-f1387f2ea1ef, ebbb6a0e-f3b1-47f3-85c1-e408b4a6ceb2, ef191753-a06e-4762-9674-47e3fe90ed1e, fdca4090-a933-4393-a3bd-7633aad967a2
- **name** (`chummer/drugcomponents/drugcomponent/name`): 22 unique values
  - Values: Brute, Charmer, Crush, Defender, Duration Enhancer, Genius, Gut Check, Ingestion Enhancer, Inhalation Enhancer, Lighting, Razor Mind, Resist, Shock and Awe, Smoothtalk, Speed Demon, Speed Enhancer, Stonewall, Strike, Tank, The General
- **category** (`chummer/drugcomponents/drugcomponent/category`): 3 unique values
  - Values: Block, Enhancer, Foundation
- **level** (`chummer/drugcomponents/drugcomponent/effects/effect/level`): 3 unique values
  - Values: 0, 1, 2
- **name** (`chummer/drugcomponents/drugcomponent/effects/effect/attribute/name`): 8 unique values
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL
- **value** (`chummer/drugcomponents/drugcomponent/effects/effect/attribute/value`): 5 unique values
  - Values: -1, -2, 1, 2, 3
- **quality** (`chummer/drugcomponents/drugcomponent/effects/effect/quality`): 4 unique values
  - Values: High Pain Tolerance, Low Pain Tolerance, Uncouth, Unsteady Hands
- **availability** (`chummer/drugcomponents/drugcomponent/availability`): 3 unique values
  - Values: +1, +2, +4R
- **cost** (`chummer/drugcomponents/drugcomponent/cost`): 5 unique values
  - Values: 20, 30, 40, 50, 75
- **rating** (`chummer/drugcomponents/drugcomponent/rating`): 2 unique values
  - Values: 1, 6
- **threshold** (`chummer/drugcomponents/drugcomponent/threshold`): 2 unique values
  - Values: 1, 2
- **page** (`chummer/drugcomponents/drugcomponent/page`): 2 unique values
  - Values: 190, 191
- **name** (`chummer/drugcomponents/drugcomponent/effects/effect/limit/name`): 3 unique values
  - Values: Mental, Physical, Social
- **value** (`chummer/drugcomponents/drugcomponent/effects/effect/limit/value`): 3 unique values
  - Values: -1, -2, 1
- **crashdamage** (`chummer/drugcomponents/drugcomponent/effects/effect/crashdamage`): 4 unique values
  - Values: 1, 2, 4, 8
- **info** (`chummer/drugcomponents/drugcomponent/effects/effect/info`): 3 unique values
  - Values: Crash Effect: -1d6 initiative dice, Ingestion, Inhalation
- **initiativedice** (`chummer/drugcomponents/drugcomponent/effects/effect/initiativedice`): 3 unique values
  - Values: 1, 2, 3

### Numeric Type Candidates
- **addictionthreshold** (`chummer/grades/grade/addictionthreshold`): 100.0% numeric
  - Examples: -1
- **rating** (`chummer/drugs/drug/rating`): 100.0% numeric
  - Examples: 0, 0, 0
- **speed** (`chummer/drugcomponents/drugcomponent/effects/effect/speed`): 100.0% numeric
  - Examples: -3
- **limit** (`chummer/drugcomponents/drugcomponent/limit`): 100.0% numeric
  - Examples: 3, 3
- **duration** (`chummer/drugcomponents/drugcomponent/effects/effect/duration`): 100.0% numeric
  - Examples: 1
