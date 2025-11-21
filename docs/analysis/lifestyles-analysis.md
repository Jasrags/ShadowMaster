# Analysis Report: lifestyles.xml

**File**: `data\chummerxml\lifestyles.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 2044
- **Unique Fields**: 49
- **Unique Attributes**: 5
- **Unique Element Types**: 74

## Fields

### name
**Path**: `chummer/cities/city/district/name`

- **Count**: 159
- **Presence Rate**: 100.0%
- **Unique Values**: 155
- **Type Patterns**: string
- **Length Range**: 3-27 characters
- **Examples**:
  - `Auburn`
  - `Bellevue`
  - `Downtown`
  - `Everett`
  - `Fort Lewis`

### name
**Path**: `chummer/cities/city/district/borough/name`

- **Count**: 140
- **Presence Rate**: 100.0%
- **Unique Values**: 134
- **Type Patterns**: string
- **Length Range**: 4-31 characters
- **Examples**:
  - `Black Diamond`
  - `Bolse`
  - `Algona`
  - `Berrydale`
  - `Pacifica`

### id
**Path**: `chummer/qualities/quality/id`

- **Count**: 112
- **Presence Rate**: 100.0%
- **Unique Values**: 112
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `91ac54bf-0f7d-40f3-81bf-dc32e62fd94e`
  - `af5b1436-abc9-4f3d-9521-64cf58724e0a`
  - `6f638af3-39c0-4d29-8a5d-1e0bc67ea922`
  - `1fd70570-e89d-4c85-bfe7-6b56aac7c7df`
  - `080401ff-1470-4b32-86bb-bd615fd63b86`

### name
**Path**: `chummer/qualities/quality/name`

- **Count**: 112
- **Presence Rate**: 100.0%
- **Unique Values**: 111
- **Type Patterns**: string
- **Length Range**: 3-44 characters
- **Examples**:
  - `Armory`
  - `Cleaning Service (Standard)`
  - `Cleaning Service (Mage Sensitive)`
  - `Cleaning Service (Pollution Sensitive)`
  - `Discreet Cleaning Service`

### category
**Path**: `chummer/qualities/quality/category`

- **Count**: 112
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-23 characters
- **Examples**:
  - `Entertainment - Asset`
  - `Entertainment - Service`
  - `Entertainment - Service`
  - `Entertainment - Service`
  - `Entertainment - Service`
- **All Values**: Contracts, Entertainment - Asset, Entertainment - Outing, Entertainment - Service, Negative, Positive

### lp
**Path**: `chummer/qualities/quality/lp`

- **Count**: 112
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 53.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `1`
  - `1`
  - `1`
  - `4`
- **All Values**: -1, 0, 1, 2, 3, 4, 5

### source
**Path**: `chummer/qualities/quality/source`

- **Count**: 112
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `RF`
  - `RF`
  - `RF`
  - `RF`
  - `RF`
- **All Values**: CA, CF, HT, RF, SFB, SFCR, SR5

### page
**Path**: `chummer/qualities/quality/page`

- **Count**: 112
- **Presence Rate**: 100.0%
- **Unique Values**: 18
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `220`
  - `220`
  - `220`
  - `220`
  - `221`
- **All Values**: 138, 140, 141, 144, 20, 220, 221, 222, 223, 224, 225, 226, 28, 370, 450, 78, 80, 81

### cost
**Path**: `chummer/qualities/quality/cost`

- **Count**: 98
- **Presence Rate**: 100.0%
- **Unique Values**: 38
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 95.9%
- **Boolean Ratio**: 5.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-13 characters
- **Examples**:
  - `1000`
  - `100`
  - `200`
  - `400`
  - `10000`

### secRating
**Path**: `chummer/cities/city/district/borough/secRating`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `C`
  - `D`
  - `A/B`
  - `A/B`
  - `A/B`
- **All Values**: A, A/B, AA, AAA, B, B/C, C, D, E, Z

### allowed
**Path**: `chummer/qualities/quality/allowed`

- **Count**: 59
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-31 characters
- **Examples**:
  - `High,Luxury`
  - `High,Luxury`
  - `High,Luxury`
  - `High,Luxury`
  - `Luxury`
- **All Values**: Commercial, High, High, Luxury, High,Luxury, Low,Medium,High,Luxury, Luxury, Medium,High,Luxury, Squatter,Low,Medium,High,Luxury

### freegrid
**Path**: `chummer/lifestyles/lifestyle/freegrids/freegrid`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 17-17 characters
- **Examples**:
  - `Grid Subscription`
  - `Grid Subscription`
  - `Grid Subscription`
  - `Grid Subscription`
  - `Grid Subscription`

### name
**Path**: `chummer/cities/city/name`

- **Count**: 17
- **Presence Rate**: 100.0%
- **Unique Values**: 17
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-27 characters
- **Examples**:
  - `Seattle`
  - `Pretoria-Witwatersrand-Vaal`
  - `Denver`
  - `FDC`
  - `Portland`
- **All Values**: Atlanta, Berlin, Cheyenne, Chicago, Denver, Dubai, Europort, FDC, Hong Kong, Los Angeles, Nairobi, Neo-Tokyo, New York City, Portland, Pretoria-Witwatersrand-Vaal, Seattle, Tenochtitlán

### id
**Path**: `chummer/lifestyles/lifestyle/id`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 8.3%
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `00000000-0000-0000-0000-000000000000`
  - `559653df-a9af-44e2-9e04-3044c1d1b421`
  - `9367556e-f82f-4f9d-840e-24c8f824ca68`
  - `451eef87-d18e-4bee-a972-1ee165b08522`
  - `9cb0222c-14c1-4bea-bf83-055513a1f33e`
- **All Values**: 00000000-0000-0000-0000-000000000000, 1a231a81-4985-4b57-83cf-659ad920cfb7, 2be1a0f7-6133-4966-be57-720ed9b927a9, 451eef87-d18e-4bee-a972-1ee165b08522, 4a37d519-c9be-4ecc-97bb-e9d78708c374, 4b513ac9-9eb3-471b-931b-839a04873b84, 4be85958-af8f-4404-812f-0d8a426f01d6, 559653df-a9af-44e2-9e04-3044c1d1b421, 9367556e-f82f-4f9d-840e-24c8f824ca68, 9cb0222c-14c1-4bea-bf83-055513a1f33e, b7b15c35-596d-4e00-92ee-2e999f062924, ed775c22-8f0c-40a0-bc6f-5dbb980cedba

### name
**Path**: `chummer/lifestyles/lifestyle/name`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-34 characters
- **Examples**:
  - `ID ERROR. Re-add life style to fix`
  - `Street`
  - `Squatter`
  - `Low`
  - `Medium`
- **All Values**: Bolt Hole, Commercial, High, Hospitalized, Basic, Hospitalized, Intensive, ID ERROR. Re-add life style to fix, Low, Luxury, Medium, Squatter, Street, Traveler

### cost
**Path**: `chummer/lifestyles/lifestyle/cost`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `1`
  - `0`
  - `500`
  - `2000`
  - `5000`
- **All Values**: 0, 1, 1000, 10000, 100000, 2000, 3000, 500, 5000, 8000

### dice
**Path**: `chummer/lifestyles/lifestyle/dice`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 41.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `3`
  - `4`
- **All Values**: 0, 1, 2, 3, 4, 5, 6

### lp
**Path**: `chummer/lifestyles/lifestyle/lp`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `2`
  - `2`
  - `3`
  - `4`
- **All Values**: 0, 12, 2, 3, 4, 6

### multiplier
**Path**: `chummer/lifestyles/lifestyle/multiplier`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `0`
  - `20`
  - `40`
  - `60`
  - `100`
- **All Values**: 0, 100, 1000, 20, 40, 500, 60

### source
**Path**: `chummer/lifestyles/lifestyle/source`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: RF, SR5

### page
**Path**: `chummer/lifestyles/lifestyle/page`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 8.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `1`
  - `369`
  - `369`
  - `369`
  - `369`
- **All Values**: 1, 216, 218, 369

### lifestylequality
**Path**: `chummer/qualities/quality/required/oneof/lifestylequality`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-37 characters
- **Examples**:
  - `Garage (Airplane)`
  - `Garage (Boat)`
  - `Garage (Car (Body 4 or Less))`
  - `Garage (Car (Body 5 or More))`
  - `Garage (Helicopter)`
- **All Values**: Cramped Garage (Airplane), Cramped Garage (Boat), Cramped Garage (Car (Body 4 or Less)), Cramped Garage (Car (Body 5 or More)), Cramped Garage (Helicopter), Cramped Workshop/Facility, Garage (Airplane), Garage (Boat), Garage (Car (Body 4 or Less)), Garage (Car (Body 5 or More)), Garage (Helicopter), Workshop/Facility

### name
**Path**: `chummer/comforts/comfort/name`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-10 characters
- **Examples**:
  - `Bolt Hole`
  - `Street`
  - `Squatter`
  - `Low`
  - `Medium`
- **All Values**: Bolt Hole, Commercial, High, Low, Luxury, Medium, Squatter, Street, Traveler

### minimum
**Path**: `chummer/comforts/comfort/minimum`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `0`
  - `1`
  - `2`
  - `3`
- **All Values**: 0, 1, 2, 3, 4, 5

### limit
**Path**: `chummer/comforts/comfort/limit`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 11.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `1`
  - `2`
  - `3`
  - `4`
- **All Values**: 1, 2, 3, 4, 6, 8

### name
**Path**: `chummer/neighborhoods/neighborhood/name`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-10 characters
- **Examples**:
  - `Bolt Hole`
  - `Street`
  - `Squatter`
  - `Low`
  - `Medium`
- **All Values**: Bolt Hole, Commercial, High, Low, Luxury, Medium, Squatter, Street, Traveler

### minimum
**Path**: `chummer/neighborhoods/neighborhood/minimum`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `0`
  - `1`
  - `2`
  - `4`
- **All Values**: 0, 1, 2, 4, 5

### limit
**Path**: `chummer/neighborhoods/neighborhood/limit`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 11.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `1`
  - `2`
  - `3`
  - `5`
- **All Values**: 1, 2, 3, 4, 5, 6, 7

### name
**Path**: `chummer/securities/security/name`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-10 characters
- **Examples**:
  - `Bolt Hole`
  - `Street`
  - `Squatter`
  - `Low`
  - `Medium`
- **All Values**: Bolt Hole, Commercial, High, Low, Luxury, Medium, Squatter, Street, Traveler

### minimum
**Path**: `chummer/securities/security/minimum`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `0`
  - `1`
  - `2`
  - `3`
- **All Values**: 0, 1, 2, 3, 4, 5

### limit
**Path**: `chummer/securities/security/limit`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 11.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `1`
  - `2`
  - `3`
  - `4`
- **All Values**: 1, 2, 3, 4, 6, 7, 8

### category
**Path**: `chummer/categories/category`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-23 characters
- **Examples**:
  - `Entertainment - Asset`
  - `Entertainment - Service`
  - `Entertainment - Outing`
  - `Positive`
  - `Negative`
- **All Values**: Contracts, Entertainment - Asset, Entertainment - Outing, Entertainment - Service, Negative, Positive

### lifestylequality
**Path**: `chummer/qualities/quality/forbidden/oneof/lifestylequality`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 16-33 characters
- **Examples**:
  - `Local Bar Patron`
  - `Patron of the Arts (Private Club)`
  - `Cleaning Service`
  - `Discreet Deliveryman`
  - `Discreet Candyman`
- **All Values**: Cleaning Service, Discreet Candyman, Discreet Deliveryman, Local Bar Patron, Patron of the Arts (Private Club)

### multiplier
**Path**: `chummer/qualities/quality/multiplier`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `-10`
  - `-20`
  - `10`
  - `-10`
  - `-20`
- **All Values**: -10, -20, 10

### lifestyle
**Path**: `chummer/qualities/quality/required/lifestyle`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-9 characters
- **Examples**:
  - `Traveler`
  - `Traveler`
  - `Bolt Hole`
  - `Bolt Hole`
- **All Values**: Bolt Hole, Traveler

### increment
**Path**: `chummer/lifestyles/lifestyle/increment`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `day`
  - `day`

### characterquality
**Path**: `chummer/qualities/quality/required/oneof/characterquality`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 18-26 characters
- **Examples**:
  - `SINner (Corporate)`
  - `SINner (Corporate Limited)`
- **All Values**: SINner (Corporate Limited), SINner (Corporate)

### area
**Path**: `chummer/qualities/quality/area`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`
  - `-1`

### characterquality
**Path**: `chummer/qualities/quality/forbidden/oneof/characterquality`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 18-26 characters
- **Examples**:
  - `SINner (Corporate)`
  - `SINner (Corporate Limited)`
- **All Values**: SINner (Corporate Limited), SINner (Corporate)

### costforarea
**Path**: `chummer/lifestyles/lifestyle/costforarea`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `50`

### costforcomforts
**Path**: `chummer/lifestyles/lifestyle/costforcomforts`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `50`

### costforsecurity
**Path**: `chummer/lifestyles/lifestyle/costforsecurity`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `50`

### allowbonuslp
**Path**: `chummer/lifestyles/lifestyle/allowbonuslp`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`

### comfortsminimum
**Path**: `chummer/qualities/quality/comfortsminimum`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### securityminimum
**Path**: `chummer/qualities/quality/securityminimum`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### comforts
**Path**: `chummer/qualities/quality/comforts`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### security
**Path**: `chummer/qualities/quality/security`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### multiplierbaseonly
**Path**: `chummer/qualities/quality/multiplierbaseonly`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `20`

### comfortsmaximum
**Path**: `chummer/qualities/quality/comfortsmaximum`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

## Attributes

### freegrid@select
**Path**: `chummer/lifestyles/lifestyle/freegrids/freegrid@select`

- **Count**: 21
- **Unique Values**: 3
- **Enum Candidate**: Yes
- **Examples**:
  - `Public Grid`
  - `Public Grid`
  - `Public Grid`
  - `Local Grid`
  - `Public Grid`
- **All Values**: Global Grid, Local Grid, Public Grid

### selecttext@xml
**Path**: `chummer/qualities/quality/bonus/selecttext@xml`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `skills.xml`
  - `skills.xml`

### selecttext@xpath
**Path**: `chummer/qualities/quality/bonus/selecttext@xpath`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `/chummer/skills/skill/name \| /chummer/knowledgeskills/skill/name`
  - `/chummer/skills/skill/name \| /chummer/knowledgeskills/skill/name`

### selecttext@allowedit
**Path**: `chummer/qualities/quality/bonus/selecttext@allowedit`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema lifestyles.xsd`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 6 unique values
  - Values: Contracts, Entertainment - Asset, Entertainment - Outing, Entertainment - Service, Negative, Positive
- **id** (`chummer/lifestyles/lifestyle/id`): 12 unique values
  - Values: 00000000-0000-0000-0000-000000000000, 1a231a81-4985-4b57-83cf-659ad920cfb7, 2be1a0f7-6133-4966-be57-720ed9b927a9, 451eef87-d18e-4bee-a972-1ee165b08522, 4a37d519-c9be-4ecc-97bb-e9d78708c374, 4b513ac9-9eb3-471b-931b-839a04873b84, 4be85958-af8f-4404-812f-0d8a426f01d6, 559653df-a9af-44e2-9e04-3044c1d1b421, 9367556e-f82f-4f9d-840e-24c8f824ca68, 9cb0222c-14c1-4bea-bf83-055513a1f33e, b7b15c35-596d-4e00-92ee-2e999f062924, ed775c22-8f0c-40a0-bc6f-5dbb980cedba
- **name** (`chummer/lifestyles/lifestyle/name`): 12 unique values
  - Values: Bolt Hole, Commercial, High, Hospitalized, Basic, Hospitalized, Intensive, ID ERROR. Re-add life style to fix, Low, Luxury, Medium, Squatter, Street, Traveler
- **cost** (`chummer/lifestyles/lifestyle/cost`): 10 unique values
  - Values: 0, 1, 1000, 10000, 100000, 2000, 3000, 500, 5000, 8000
- **dice** (`chummer/lifestyles/lifestyle/dice`): 7 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6
- **lp** (`chummer/lifestyles/lifestyle/lp`): 6 unique values
  - Values: 0, 12, 2, 3, 4, 6
- **multiplier** (`chummer/lifestyles/lifestyle/multiplier`): 7 unique values
  - Values: 0, 100, 1000, 20, 40, 500, 60
- **source** (`chummer/lifestyles/lifestyle/source`): 2 unique values
  - Values: RF, SR5
- **page** (`chummer/lifestyles/lifestyle/page`): 4 unique values
  - Values: 1, 216, 218, 369
- **name** (`chummer/comforts/comfort/name`): 9 unique values
  - Values: Bolt Hole, Commercial, High, Low, Luxury, Medium, Squatter, Street, Traveler
- **minimum** (`chummer/comforts/comfort/minimum`): 6 unique values
  - Values: 0, 1, 2, 3, 4, 5
- **limit** (`chummer/comforts/comfort/limit`): 6 unique values
  - Values: 1, 2, 3, 4, 6, 8
- **name** (`chummer/neighborhoods/neighborhood/name`): 9 unique values
  - Values: Bolt Hole, Commercial, High, Low, Luxury, Medium, Squatter, Street, Traveler
- **minimum** (`chummer/neighborhoods/neighborhood/minimum`): 5 unique values
  - Values: 0, 1, 2, 4, 5
- **limit** (`chummer/neighborhoods/neighborhood/limit`): 7 unique values
  - Values: 1, 2, 3, 4, 5, 6, 7
- **name** (`chummer/securities/security/name`): 9 unique values
  - Values: Bolt Hole, Commercial, High, Low, Luxury, Medium, Squatter, Street, Traveler
- **minimum** (`chummer/securities/security/minimum`): 6 unique values
  - Values: 0, 1, 2, 3, 4, 5
- **limit** (`chummer/securities/security/limit`): 7 unique values
  - Values: 1, 2, 3, 4, 6, 7, 8
- **category** (`chummer/qualities/quality/category`): 6 unique values
  - Values: Contracts, Entertainment - Asset, Entertainment - Outing, Entertainment - Service, Negative, Positive
- **lp** (`chummer/qualities/quality/lp`): 7 unique values
  - Values: -1, 0, 1, 2, 3, 4, 5
- **cost** (`chummer/qualities/quality/cost`): 38 unique values
  - Values: -300, 0, 1000, 100000 div 12, 15, 150, 1500, 15000, 180, 20, 200, 2000, 25, 250, 25000 div 12, 300, 4500, 5000, 50000 div 12, 9000
- **allowed** (`chummer/qualities/quality/allowed`): 8 unique values
  - Values: Commercial, High, High, Luxury, High,Luxury, Low,Medium,High,Luxury, Luxury, Medium,High,Luxury, Squatter,Low,Medium,High,Luxury
- **source** (`chummer/qualities/quality/source`): 7 unique values
  - Values: CA, CF, HT, RF, SFB, SFCR, SR5
- **page** (`chummer/qualities/quality/page`): 18 unique values
  - Values: 138, 140, 141, 144, 20, 220, 221, 222, 223, 224, 225, 226, 28, 370, 450, 78, 80, 81
- **lifestylequality** (`chummer/qualities/quality/forbidden/oneof/lifestylequality`): 5 unique values
  - Values: Cleaning Service, Discreet Candyman, Discreet Deliveryman, Local Bar Patron, Patron of the Arts (Private Club)
- **characterquality** (`chummer/qualities/quality/required/oneof/characterquality`): 2 unique values
  - Values: SINner (Corporate Limited), SINner (Corporate)
- **multiplier** (`chummer/qualities/quality/multiplier`): 3 unique values
  - Values: -10, -20, 10
- **lifestyle** (`chummer/qualities/quality/required/lifestyle`): 2 unique values
  - Values: Bolt Hole, Traveler
- **lifestylequality** (`chummer/qualities/quality/required/oneof/lifestylequality`): 12 unique values
  - Values: Cramped Garage (Airplane), Cramped Garage (Boat), Cramped Garage (Car (Body 4 or Less)), Cramped Garage (Car (Body 5 or More)), Cramped Garage (Helicopter), Cramped Workshop/Facility, Garage (Airplane), Garage (Boat), Garage (Car (Body 4 or Less)), Garage (Car (Body 5 or More)), Garage (Helicopter), Workshop/Facility
- **characterquality** (`chummer/qualities/quality/forbidden/oneof/characterquality`): 2 unique values
  - Values: SINner (Corporate Limited), SINner (Corporate)
- **name** (`chummer/cities/city/name`): 17 unique values
  - Values: Atlanta, Berlin, Cheyenne, Chicago, Denver, Dubai, Europort, FDC, Hong Kong, Los Angeles, Nairobi, Neo-Tokyo, New York City, Portland, Pretoria-Witwatersrand-Vaal, Seattle, Tenochtitlán
- **secRating** (`chummer/cities/city/district/borough/secRating`): 10 unique values
  - Values: A, A/B, AA, AAA, B, B/C, C, D, E, Z

### Numeric Type Candidates
- **costforarea** (`chummer/lifestyles/lifestyle/costforarea`): 100.0% numeric
  - Examples: 50
- **costforcomforts** (`chummer/lifestyles/lifestyle/costforcomforts`): 100.0% numeric
  - Examples: 50
- **costforsecurity** (`chummer/lifestyles/lifestyle/costforsecurity`): 100.0% numeric
  - Examples: 50
- **comfortsminimum** (`chummer/qualities/quality/comfortsminimum`): 100.0% numeric
  - Examples: 1
- **securityminimum** (`chummer/qualities/quality/securityminimum`): 100.0% numeric
  - Examples: 1
- **comforts** (`chummer/qualities/quality/comforts`): 100.0% numeric
  - Examples: 1
- **security** (`chummer/qualities/quality/security`): 100.0% numeric
  - Examples: 1
- **multiplierbaseonly** (`chummer/qualities/quality/multiplierbaseonly`): 100.0% numeric
  - Examples: 20
- **comfortsmaximum** (`chummer/qualities/quality/comfortsmaximum`): 100.0% numeric
  - Examples: -1
- **area** (`chummer/qualities/quality/area`): 100.0% numeric
  - Examples: -1, -1

### Boolean Type Candidates
- **allowbonuslp** (`chummer/lifestyles/lifestyle/allowbonuslp`): 100.0% boolean
  - Examples: True
