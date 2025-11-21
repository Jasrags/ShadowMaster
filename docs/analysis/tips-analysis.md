# Analysis Report: tips.xml

**File**: `data\chummerxml\tips.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 255
- **Unique Fields**: 45
- **Unique Attributes**: 1
- **Unique Element Types**: 72

## Fields

### id
**Path**: `chummer/tips/tip/id`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `528f605f-9994-46b5-8583-cafe006507e4`
  - `ccaae7df-40ba-4da9-837e-c0df92f07038`
  - `ff26b01d-1aa4-45ac-8685-0d199e115d1f`
  - `b6da9d78-024d-4516-821c-93ad8207075d`
  - `b669df07-528b-4df3-829b-54d095af1791`
- **All Values**: 1e98f6d1-dfca-4dc3-9248-dd3da3589989, 250bf4c4-b71a-4ff7-8f99-4d59aaba89c1, 42262ca7-b414-4dde-b1b3-b7f72bc160c1, 4bf9379e-101a-4664-8049-7db867073943, 528f605f-9994-46b5-8583-cafe006507e4, 543af3b5-c490-4dcd-8db4-54ad214e32f4, 8bdb4ade-46e2-4ff6-b440-d8a8955766ed, ab52155b-d99e-4e2e-816b-16535afc206f, afc35a4b-a588-4080-9e77-0dbb5d223122, b669df07-528b-4df3-829b-54d095af1791, b6da9d78-024d-4516-821c-93ad8207075d, c2d32a52-25a7-4565-a9b6-1bde1f65c83e, ccaae7df-40ba-4da9-837e-c0df92f07038, d6d22084-a292-4938-a9b4-af8963111ce6, ee4bdb97-2b43-49ea-bc1e-487969258880, ff26b01d-1aa4-45ac-8685-0d199e115d1f

### text
**Path**: `chummer/tips/tip/text`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: string
- **Length Range**: 27-233 characters
- **Examples**:
  - `Looks like you're building a street samurai. Don't you need a code of honor?`
  - `You have enough money to retire with a Low Lifestyle. Keep at it! A nuyen saved is a nuyen earned!`
  - `You have enough money to retire with a Medium Lifestyle. 2.5 kids, picket fence AR overlay, loving partner. Is it really worth saving up for that next upgrade?`
  - `You have enough money to retire with a Luxury Lifestyle. Molly Millions has nothing on you!`
  - `Why bother with any other weapon when you can have the Ares Alpha, the last word in automatics! This message brought to you by Ares Macrotechnology.`

### name
**Path**: `chummer/tips/tip/required/allof/grouponeof/skill/name`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-16 characters
- **Examples**:
  - `Automatics`
  - `Pistols`
  - `Longarms`
  - `Archery`
  - `Throwing Weapons`
- **All Values**: Archery, Automatics, Blades, Clubs, Longarms, Pistols, Throwing Weapons, Unarmed Combat

### val
**Path**: `chummer/tips/tip/required/allof/grouponeof/skill/val`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`
  - `6`
  - `6`
  - `6`
  - `6`
- **All Values**: 4, 6

### val
**Path**: `chummer/tips/tip/required/allof/skill/val`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`
  - `6`
  - `1`
  - `6`
  - `6`
- **All Values**: 1, 6

### quality
**Path**: `chummer/tips/tip/forbidden/oneof/quality`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 12-29 characters
- **Examples**:
  - `Code of Honor`
  - `Code of Honor: Like a Boss`
  - `Code of Honor: Avenging Angel`
  - `Code of Honor: Black Hat`
  - `Perfect Time`
- **All Values**: Code of Honor, Code of Honor: Avenging Angel, Code of Honor: Black Hat, Code of Honor: Like a Boss, Perfect Time

### name
**Path**: `chummer/tips/tip/required/allof/skill/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-18 characters
- **Examples**:
  - `Automatics`
  - `Alchemy`
  - `Hacking`
  - `Electronic Warfare`
  - `Computer`
- **All Values**: Alchemy, Automatics, Computer, Electronic Warfare, Hacking

### name
**Path**: `chummer/tips/tip/required/oneof/skill/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-12 characters
- **Examples**:
  - `Con`
  - `Etiquette`
  - `Negotiation`
  - `Leadership`
  - `Intimidation`
- **All Values**: Con, Etiquette, Intimidation, Leadership, Negotiation

### val
**Path**: `chummer/tips/tip/required/oneof/skill/val`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`
  - `6`
  - `6`
  - `6`
  - `6`

### name
**Path**: `chummer/tips/tip/forbidden/oneof/attribute/name`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `DEP`
  - `DEP`
  - `RES`
- **All Values**: DEP, RES

### val
**Path**: `chummer/tips/tip/forbidden/oneof/attribute/val`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 66.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `2`
- **All Values**: 1, 2

### nuyen
**Path**: `chummer/tips/tip/required/allof/nuyen`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 6-9 characters
- **Examples**:
  - `200000`
  - `500000`
  - `100000000`
- **All Values**: 100000000, 200000, 500000

### weapon
**Path**: `chummer/tips/tip/forbidden/oneof/weapon`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-17 characters
- **Examples**:
  - `Ares Alpha`
  - `HK-227`
  - `Ingram Smartgun X`
- **All Values**: Ares Alpha, HK-227, Ingram Smartgun X

### name
**Path**: `chummer/tips/tip/required/allof/attribute/name`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `MAG`
  - `RES`
  - `WIL`
- **All Values**: MAG, RES, WIL

### cyberware
**Path**: `chummer/tips/tip/required/allof/grouponeof/cyberware`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-13 characters
- **Examples**:
  - `Datajack`
  - `Datajack Plus`
  - `Control Rig`
- **All Values**: Control Rig, Datajack, Datajack Plus

### nuyen
**Path**: `chummer/tips/tip/forbidden/allof/nuyen`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 6-7 characters
- **Examples**:
  - `500000`
  - `1000000`
- **All Values**: 1000000, 500000

### quality
**Path**: `chummer/tips/tip/required/allof/quality`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 12-21 characters
- **Examples**:
  - `Sharpshooter`
  - `Strive For Perfection`
- **All Values**: Sharpshooter, Strive For Perfection

### val
**Path**: `chummer/tips/tip/required/allof/attribute/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`

### careerkarma
**Path**: `chummer/tips/tip/required/allof/careerkarma`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `100`
  - `100`

### skills
**Path**: `chummer/tips/tip/required/allof/skilltotal/skills`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 38-49 characters
- **Examples**:
  - `Con+Etiquette+Negotiation+Leadership+Intimidation`
  - `Hardware+Software+Computer+Cybercombat`
- **All Values**: Con+Etiquette+Negotiation+Leadership+Intimidation, Hardware+Software+Computer+Cybercombat

### val
**Path**: `chummer/tips/tip/required/allof/skilltotal/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `13`
  - `8`
- **All Values**: 13, 8

### cyberware
**Path**: `chummer/tips/tip/required/allof/cyberware`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 16-27 characters
- **Examples**:
  - `Boosted Reflexes`
  - `Large Smuggling Compartment`
- **All Values**: Boosted Reflexes, Large Smuggling Compartment

### gear
**Path**: `chummer/tips/tip/required/allof/grouponeof/gear`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-11 characters
- **Examples**:
  - `Trodes`
  - `Trode Patch`
- **All Values**: Trode Patch, Trodes

### ess
**Path**: `chummer/tips/tip/required/allof/ess`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### name
**Path**: `chummer/tips/tip/required/allof/grouponeof/attribute/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `AGI`

### total
**Path**: `chummer/tips/tip/required/allof/grouponeof/attribute/total`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`

### cyberwarecategory
**Path**: `chummer/tips/tip/required/allof/grouponeof/cyberwarecategory`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 10-10 characters
- **Examples**:
  - `Cyberlimbs`

### attributes
**Path**: `chummer/tips/tip/forbidden/oneof/attributetotal/attributes`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 11-11 characters
- **Examples**:
  - `{RES}+{MAG}`

### val
**Path**: `chummer/tips/tip/forbidden/oneof/attributetotal/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### metatype
**Path**: `chummer/tips/tip/required/allof/metatype`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `A.I.`

### metavariant
**Path**: `chummer/tips/tip/required/allof/metavariant`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `Oni`

### type
**Path**: `chummer/tips/tip/forbidden/allof/skill/type`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Interest`

### val
**Path**: `chummer/tips/tip/forbidden/allof/skill/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### initiategrade
**Path**: `chummer/tips/tip/forbidden/allof/initiategrade`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### submersiongrade
**Path**: `chummer/tips/tip/forbidden/allof/submersiongrade`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### type
**Path**: `chummer/tips/tip/required/allof/skill/type`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Language`

### type
**Path**: `chummer/tips/tip/forbidden/oneof/skill/type`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Language`

### val
**Path**: `chummer/tips/tip/forbidden/oneof/skill/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`

### attributes
**Path**: `chummer/tips/tip/required/oneof/attributetotal/attributes`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 11-11 characters
- **Examples**:
  - `{LOG}+{INT}`

### total
**Path**: `chummer/tips/tip/required/oneof/attributetotal/total`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `11`

### attributes
**Path**: `chummer/tips/tip/required/oneof/group/attributetotal/attributes`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 11-11 characters
- **Examples**:
  - `{LOG}+{INT}`

### total
**Path**: `chummer/tips/tip/required/oneof/group/attributetotal/total`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `10`

### metatype
**Path**: `chummer/tips/tip/required/oneof/group/metatype`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Troll`

### total
**Path**: `chummer/tips/tip/required/allof/attribute/total`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`

### spec
**Path**: `chummer/tips/tip/required/allof/grouponeof/skill/spec`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 15-15 characters
- **Examples**:
  - `Submachine Guns`

## Attributes

### cyberwarecategory@count
**Path**: `chummer/tips/tip/required/allof/grouponeof/cyberwarecategory@count`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `2`

## Type Improvement Recommendations

### Enum Candidates
- **id** (`chummer/tips/tip/id`): 16 unique values
  - Values: 1e98f6d1-dfca-4dc3-9248-dd3da3589989, 250bf4c4-b71a-4ff7-8f99-4d59aaba89c1, 42262ca7-b414-4dde-b1b3-b7f72bc160c1, 4bf9379e-101a-4664-8049-7db867073943, 528f605f-9994-46b5-8583-cafe006507e4, 543af3b5-c490-4dcd-8db4-54ad214e32f4, 8bdb4ade-46e2-4ff6-b440-d8a8955766ed, ab52155b-d99e-4e2e-816b-16535afc206f, afc35a4b-a588-4080-9e77-0dbb5d223122, b669df07-528b-4df3-829b-54d095af1791, b6da9d78-024d-4516-821c-93ad8207075d, c2d32a52-25a7-4565-a9b6-1bde1f65c83e, ccaae7df-40ba-4da9-837e-c0df92f07038, d6d22084-a292-4938-a9b4-af8963111ce6, ee4bdb97-2b43-49ea-bc1e-487969258880, ff26b01d-1aa4-45ac-8685-0d199e115d1f
- **name** (`chummer/tips/tip/required/allof/grouponeof/skill/name`): 8 unique values
  - Values: Archery, Automatics, Blades, Clubs, Longarms, Pistols, Throwing Weapons, Unarmed Combat
- **val** (`chummer/tips/tip/required/allof/grouponeof/skill/val`): 2 unique values
  - Values: 4, 6
- **name** (`chummer/tips/tip/forbidden/oneof/attribute/name`): 2 unique values
  - Values: DEP, RES
- **val** (`chummer/tips/tip/forbidden/oneof/attribute/val`): 2 unique values
  - Values: 1, 2
- **quality** (`chummer/tips/tip/forbidden/oneof/quality`): 5 unique values
  - Values: Code of Honor, Code of Honor: Avenging Angel, Code of Honor: Black Hat, Code of Honor: Like a Boss, Perfect Time
- **nuyen** (`chummer/tips/tip/forbidden/allof/nuyen`): 2 unique values
  - Values: 1000000, 500000
- **nuyen** (`chummer/tips/tip/required/allof/nuyen`): 3 unique values
  - Values: 100000000, 200000, 500000
- **weapon** (`chummer/tips/tip/forbidden/oneof/weapon`): 3 unique values
  - Values: Ares Alpha, HK-227, Ingram Smartgun X
- **name** (`chummer/tips/tip/required/allof/skill/name`): 5 unique values
  - Values: Alchemy, Automatics, Computer, Electronic Warfare, Hacking
- **val** (`chummer/tips/tip/required/allof/skill/val`): 2 unique values
  - Values: 1, 6
- **quality** (`chummer/tips/tip/required/allof/quality`): 2 unique values
  - Values: Sharpshooter, Strive For Perfection
- **name** (`chummer/tips/tip/required/allof/attribute/name`): 3 unique values
  - Values: MAG, RES, WIL
- **skills** (`chummer/tips/tip/required/allof/skilltotal/skills`): 2 unique values
  - Values: Con+Etiquette+Negotiation+Leadership+Intimidation, Hardware+Software+Computer+Cybercombat
- **val** (`chummer/tips/tip/required/allof/skilltotal/val`): 2 unique values
  - Values: 13, 8
- **name** (`chummer/tips/tip/required/oneof/skill/name`): 5 unique values
  - Values: Con, Etiquette, Intimidation, Leadership, Negotiation
- **cyberware** (`chummer/tips/tip/required/allof/cyberware`): 2 unique values
  - Values: Boosted Reflexes, Large Smuggling Compartment
- **cyberware** (`chummer/tips/tip/required/allof/grouponeof/cyberware`): 3 unique values
  - Values: Control Rig, Datajack, Datajack Plus
- **gear** (`chummer/tips/tip/required/allof/grouponeof/gear`): 2 unique values
  - Values: Trode Patch, Trodes

### Numeric Type Candidates
- **ess** (`chummer/tips/tip/required/allof/ess`): 100.0% numeric
  - Examples: -1
- **total** (`chummer/tips/tip/required/allof/grouponeof/attribute/total`): 100.0% numeric
  - Examples: 6
- **val** (`chummer/tips/tip/forbidden/oneof/attributetotal/val`): 100.0% numeric
  - Examples: 2
- **val** (`chummer/tips/tip/forbidden/allof/skill/val`): 100.0% numeric
  - Examples: 1
- **val** (`chummer/tips/tip/required/allof/attribute/val`): 100.0% numeric
  - Examples: 1, 1
- **careerkarma** (`chummer/tips/tip/required/allof/careerkarma`): 100.0% numeric
  - Examples: 100, 100
- **initiategrade** (`chummer/tips/tip/forbidden/allof/initiategrade`): 100.0% numeric
  - Examples: 1
- **submersiongrade** (`chummer/tips/tip/forbidden/allof/submersiongrade`): 100.0% numeric
  - Examples: 1
- **val** (`chummer/tips/tip/required/oneof/skill/val`): 100.0% numeric
  - Examples: 6, 6, 6
- **val** (`chummer/tips/tip/forbidden/oneof/skill/val`): 100.0% numeric
  - Examples: 6
- **total** (`chummer/tips/tip/required/oneof/attributetotal/total`): 100.0% numeric
  - Examples: 11
- **total** (`chummer/tips/tip/required/oneof/group/attributetotal/total`): 100.0% numeric
  - Examples: 10
- **total** (`chummer/tips/tip/required/allof/attribute/total`): 100.0% numeric
  - Examples: 3
