# Analysis Report: powers.xml

**File**: `data\chummerxml\powers.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 1571
- **Unique Fields**: 81
- **Unique Attributes**: 10
- **Unique Element Types**: 119

## Fields

### quality
**Path**: `chummer/powers/power/adeptwayrequires/required/oneof/quality`

- **Count**: 113
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 15-17 characters
- **Examples**:
  - `The Artist's Way`
  - `The Beast's Way`
  - `The Spiritual Way`
  - `The Beast's Way`
  - `The Invisible Way`
- **All Values**: The Artisan's Way, The Artist's Way, The Athlete's Way, The Beast's Way, The Invisible Way, The Speaker's Way, The Spiritual Way, The Warrior's Way

### id
**Path**: `chummer/powers/power/id`

- **Count**: 109
- **Presence Rate**: 100.0%
- **Unique Values**: 109
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `8caaadf4-75b4-4535-928a-5648d395c13a`
  - `39224ecf-f3d0-40b6-95a6-2f047f95d736`
  - `ddcca815-d6fe-41ed-b174-2e7255320f17`
  - `76337564-7688-497f-84f9-302c6ece10fe`
  - `dbf16604-164c-485c-96c8-fe3136cd5caa`

### name
**Path**: `chummer/powers/power/name`

- **Count**: 109
- **Presence Rate**: 100.0%
- **Unique Values**: 105
- **Type Patterns**: string
- **Length Range**: 4-33 characters
- **Examples**:
  - `Adrenaline Boost`
  - `Astral Perception`
  - `Attribute Boost`
  - `Combat Sense`
  - `Critical Strike`

### points
**Path**: `chummer/powers/power/points`

- **Count**: 109
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 24.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `0.25`
  - `1`
  - `0.25`
  - `0.5`
  - `0.5`
- **All Values**: 0, 0.25, 0.5, 0.75, 1, 1.5

### levels
**Path**: `chummer/powers/power/levels`

- **Count**: 109
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: boolean_string, enum_candidate
- **Boolean Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 4-5 characters
- **Examples**:
  - `True`
  - `False`
  - `True`
  - `True`
  - `False`
- **All Values**: False, True

### limit
**Path**: `chummer/powers/power/limit`

- **Count**: 109
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 88.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `1`
  - `1`
  - `4`
  - `1`
  - `100`
- **All Values**: 1, 100, 12, 20, 4

### source
**Path**: `chummer/powers/power/source`

- **Count**: 109
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: BB, BLB, BTB, CA, FA, HT, SG, SGE, SR5, SS, SSP

### page
**Path**: `chummer/powers/power/page`

- **Count**: 109
- **Presence Rate**: 100.0%
- **Unique Values**: 21
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `309`
  - `309`
  - `309`
  - `309`
  - `309`
- **All Values**: 153, 160, 169, 170, 171, 172, 173, 174, 175, 176, 190, 191, 22, 23, 24, 309, 310, 311, 4, 68

### adeptway
**Path**: `chummer/powers/power/adeptway`

- **Count**: 69
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-4 characters
- **Examples**:
  - `0.5`
  - `0.25`
  - `0.25`
  - `0.25`
  - `0.25`
- **All Values**: 0.25, 0.5, 0.75

### action
**Path**: `chummer/powers/power/action`

- **Count**: 30
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-9 characters
- **Examples**:
  - `Free`
  - `Simple`
  - `Simple`
  - `Free`
  - `Interrupt`
- **All Values**: Complex, Free, Interrupt, Simple, Special

### name
**Path**: `chummer/powers/power/bonus/specificskill/name`

- **Count**: 17
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-16 characters
- **Examples**:
  - `Perception`
  - `Assensing`
  - `Impersonation`
  - `Animal Handling`
  - `Con`
- **All Values**: Animal Handling, Assensing, Con, Disguise, Etiquette, Impersonation, Instruction, Intimidation, Leadership, Negotiation, Palming, Perception, Performance, Throwing Weapons

### bonus
**Path**: `chummer/powers/power/bonus/specificskill/bonus`

- **Count**: 17
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 23.5%
- **Boolean Ratio**: 17.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`
  - `Rating`
  - `Rating`
- **All Values**: 1, 2, Rating

### maxlevels
**Path**: `chummer/powers/power/maxlevels`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `3`
  - `3`
  - `4`
  - `3`
- **All Values**: 3, 4, 6

### id
**Path**: `chummer/enhancements/enhancement/id`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `8dc0a8e3-535a-4935-8c90-2079666e6a01`
  - `19bafb80-2f5a-4370-8cbe-875477ce7471`
  - `855a7a07-5def-4ec5-bb69-29273327b885`
  - `3f0a99c7-6524-46cb-b43e-070a978c5052`
  - `2d2939f0-486c-4915-bbeb-084b857c2450`
- **All Values**: 19bafb80-2f5a-4370-8cbe-875477ce7471, 215a5a0e-09fc-47ff-9a84-74c99f4f1a53, 25f6368f-21ef-4544-ac55-3c20d8a60374, 2d2939f0-486c-4915-bbeb-084b857c2450, 3f0a99c7-6524-46cb-b43e-070a978c5052, 47cb80a1-a11b-4a60-a557-feada7114379, 855a7a07-5def-4ec5-bb69-29273327b885, 8dc0a8e3-535a-4935-8c90-2079666e6a01, e5cf0578-be0f-4453-9223-118234d3e749, e66fac54-39e4-4e3e-92c6-670485c28c25, fafc7fd4-8418-4a86-b396-6e90943d9e68

### name
**Path**: `chummer/enhancements/enhancement/name`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-26 characters
- **Examples**:
  - `Air Walking`
  - `Pied Piper`
  - `Skin Artist`
  - `Claws`
  - `Hot Qi`
- **All Values**: Air Walking, Barrage, Claws, Digital Celerity, Hot Qi, Master of Taijiquan, Master of the Nine Chakras, Pied Piper, Shadow Touch, Silver-Tongued Devil, Skin Artist

### source
**Path**: `chummer/enhancements/enhancement/source`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 2-2 characters
- **Examples**:
  - `SG`
  - `SG`
  - `SG`
  - `SG`
  - `SG`

### page
**Path**: `chummer/enhancements/enhancement/page`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `156`
  - `156`
  - `157`
  - `157`
  - `157`
- **All Values**: 156, 157, 158, 159

### quality
**Path**: `chummer/enhancements/enhancement/required/allof/quality`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 15-18 characters
- **Examples**:
  - `The Athlete's Way`
  - `The Artist's Way`
  - `The Artist's Way`
  - `The Beast's Way`
  - `The Burnout's Way`
- **All Values**: The Artist's Way, The Athlete's Way, The Beast's Way, The Burnout's Way, The Invisible Way, The Magician's Way, The Speaker's Way, The Warrior's Way

### power
**Path**: `chummer/enhancements/enhancement/power`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-16 characters
- **Examples**:
  - `Light Body`
  - `Melanin Control`
  - `Keratin Control`
  - `Living Focus`
  - `Traceless Walk`
- **All Values**: Commanding Voice, Counterstrike, Keratin Control, Light Body, Living Focus, Melanin Control, Missile Mastery, Nerve Strike, Nimble Fingers, Traceless Walk

### power
**Path**: `chummer/enhancements/enhancement/required/allof/power`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-16 characters
- **Examples**:
  - `Light Body`
  - `Melanin Control`
  - `Keratin Control`
  - `Living Focus`
  - `Traceless Walk`
- **All Values**: Commanding Voice, Counterstrike, Keratin Control, Light Body, Living Focus, Melanin Control, Missile Mastery, Nerve Strike, Nimble Fingers, Traceless Walk

### attribute
**Path**: `chummer/powers/power/bonus/selectattribute/attribute`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `AGI`
  - `BOD`
  - `REA`
  - `STR`
  - `BOD`
- **All Values**: AGI, BOD, REA, STR

### power
**Path**: `chummer/powers/power/required/oneof/power`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-16 characters
- **Examples**:
  - `Berserk`
  - `Elemental Strike`
  - `Killing Hands`
  - `Kinesics`
  - `Killing Hands`
- **All Values**: Berserk, Elemental Strike, Facial Sculpt, Killing Hands, Kinesics, Mimic

### category
**Path**: `chummer/powers/power/bonus/weaponcategorydv/selectcategory/category`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-19 characters
- **Examples**:
  - `Astral Combat`
  - `Blades`
  - `Clubs`
  - `Exotic Melee Weapon`
  - `Unarmed Combat`
- **All Values**: Astral Combat, Blades, Clubs, Exotic Melee Weapon, Unarmed Combat

### category
**Path**: `chummer/powers/power/bonus/selectskill/skillcategories/category`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-16 characters
- **Examples**:
  - `Combat Active`
  - `Physical Active`
  - `Social Active`
  - `Technical Active`
  - `Vehicle Active`
- **All Values**: Combat Active, Physical Active, Social Active, Technical Active, Vehicle Active

### unlockskills
**Path**: `chummer/powers/power/bonus/unlockskills`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Name`
  - `Name`

### sociallimit
**Path**: `chummer/powers/power/bonus/sociallimit`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### toxiningestionresist
**Path**: `chummer/powers/power/bonus/toxiningestionresist`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### name
**Path**: `chummer/powers/power/includeinlimit/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 14-29 characters
- **Examples**:
  - `Power Swimming (Elf or Troll)`
  - `Power Swimming`
- **All Values**: Power Swimming, Power Swimming (Elf or Troll)

### category
**Path**: `chummer/powers/power/bonus/sprintbonus/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Swim`
  - `Swim`

### val
**Path**: `chummer/powers/power/bonus/sprintbonus/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `200`
  - `400`
- **All Values**: 200, 400

### category
**Path**: `chummer/powers/power/bonus/walkmultiplier/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Swim`
  - `Swim`

### percent
**Path**: `chummer/powers/power/bonus/walkmultiplier/percent`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `100`
  - `100`

### metatype
**Path**: `chummer/powers/power/forbidden/oneof/metatype`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-5 characters
- **Examples**:
  - `Elf`
  - `Troll`
- **All Values**: Elf, Troll

### metatype
**Path**: `chummer/powers/power/required/oneof/metatype`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-5 characters
- **Examples**:
  - `Elf`
  - `Troll`
- **All Values**: Elf, Troll

### dodge
**Path**: `chummer/powers/power/bonus/dodge`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### bonus
**Path**: `chummer/powers/power/bonus/weaponcategorydv/bonus`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### surprise
**Path**: `chummer/powers/power/bonus/surprise`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### value
**Path**: `chummer/powers/power/bonus/weaponskillaccuracy/value`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### val
**Path**: `chummer/powers/power/bonus/selectskill/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### val
**Path**: `chummer/powers/power/bonus/selectattribute/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### mentallimit
**Path**: `chummer/powers/power/bonus/mentallimit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### physicallimit
**Path**: `chummer/powers/power/bonus/physicallimit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### val
**Path**: `chummer/powers/power/bonus/selectlimit/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### disablequality
**Path**: `chummer/powers/power/bonus/disablequality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `3564b678-7721-4a8d-ac79-1600cf92dc14`

### initiativepass
**Path**: `chummer/powers/power/bonus/initiativepass`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### name
**Path**: `chummer/powers/power/bonus/specificattribute/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `REA`

### val
**Path**: `chummer/powers/power/bonus/specificattribute/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### doublecost
**Path**: `chummer/powers/power/doublecost`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `False`

### extrapointcost
**Path**: `chummer/powers/power/extrapointcost`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `0.5`

### judgeintentionsdefense
**Path**: `chummer/powers/power/bonus/judgeintentionsdefense`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### armor
**Path**: `chummer/powers/power/bonus/armor`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### pathogencontactresist
**Path**: `chummer/powers/power/bonus/pathogencontactresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### pathogeningestionresist
**Path**: `chummer/powers/power/bonus/pathogeningestionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### pathogeninhalationresist
**Path**: `chummer/powers/power/bonus/pathogeninhalationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### pathogeninjectionresist
**Path**: `chummer/powers/power/bonus/pathogeninjectionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### toxincontactresist
**Path**: `chummer/powers/power/bonus/toxincontactresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### toxininhalationresist
**Path**: `chummer/powers/power/bonus/toxininhalationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### toxininjectionresist
**Path**: `chummer/powers/power/bonus/toxininjectionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### thresholdoffset
**Path**: `chummer/powers/power/bonus/conditionmonitor/thresholdoffset`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### quality
**Path**: `chummer/powers/power/forbidden/oneof/quality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 19-19 characters
- **Examples**:
  - `High Pain Tolerance`

### physicalcmrecovery
**Path**: `chummer/powers/power/bonus/physicalcmrecovery`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### stuncmrecovery
**Path**: `chummer/powers/power/bonus/stuncmrecovery`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### spellresistance
**Path**: `chummer/powers/power/bonus/spellresistance`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### detectionspellresist
**Path**: `chummer/powers/power/bonus/detectionspellresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### name
**Path**: `chummer/powers/power/bonus/addweapon/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 14-14 characters
- **Examples**:
  - `Elemental Body`

### throwstr
**Path**: `chummer/powers/power/bonus/throwstr`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### unarmedap
**Path**: `chummer/powers/power/bonus/unarmedap`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `-Rating`

### coldarmor
**Path**: `chummer/powers/power/bonus/coldarmor`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### firearmor
**Path**: `chummer/powers/power/bonus/firearmor`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### fatigueresist
**Path**: `chummer/powers/power/bonus/fatigueresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### mentalmanipulationresist
**Path**: `chummer/powers/power/bonus/mentalmanipulationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### manaillusionresist
**Path**: `chummer/powers/power/bonus/manaillusionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### physicalillusionresist
**Path**: `chummer/powers/power/bonus/physicalillusionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### physical
**Path**: `chummer/powers/power/bonus/conditionmonitor/physical`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### stun
**Path**: `chummer/powers/power/bonus/conditionmonitor/stun`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### name
**Path**: `chummer/powers/power/bonus/weaponcategorydice/category/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Bows`

### value
**Path**: `chummer/powers/power/bonus/weaponcategorydice/category/value`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### throwrangestr
**Path**: `chummer/powers/power/bonus/throwrangestr`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Rating*2`

### judgeintentions
**Path**: `chummer/powers/power/bonus/judgeintentions`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### ess
**Path**: `chummer/powers/power/required/oneof/ess`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`

### unarmeddv
**Path**: `chummer/enhancements/enhancement/bonus/unarmeddv`

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

### selecttext@xml
**Path**: `chummer/powers/power/bonus/selecttext@xml`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `strings.xml`
  - `strings.xml`
  - `strings.xml`

### selecttext@xpath
**Path**: `chummer/powers/power/bonus/selecttext@xpath`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `/chummer/elements/element`
  - `/chummer/elements/element`
  - `/chummer/elements/element`

### selecttext@allowedit
**Path**: `chummer/powers/power/bonus/selecttext@allowedit`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`

### unlockskills@name
**Path**: `chummer/powers/power/bonus/unlockskills@name`

- **Count**: 2
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Assensing`
  - `Spellcasting`
- **All Values**: Assensing, Spellcasting

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema powers.xsd`

### selectskill@skillcategory
**Path**: `chummer/powers/power/bonus/weaponskillaccuracy/selectskill@skillcategory`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Combat Active`

### selectskill@excludeskill
**Path**: `chummer/powers/power/bonus/weaponskillaccuracy/selectskill@excludeskill`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Unarmed Combat`

### selectskill@minimumrating
**Path**: `chummer/powers/power/bonus/selectskill@minimumrating`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `1`

### initiativepass@precedence
**Path**: `chummer/powers/power/bonus/initiativepass@precedence`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `0`

### selectspell@ignorerequirements
**Path**: `chummer/powers/power/bonus/selectspell@ignorerequirements`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

## Type Improvement Recommendations

### Enum Candidates
- **points** (`chummer/powers/power/points`): 6 unique values
  - Values: 0, 0.25, 0.5, 0.75, 1, 1.5
- **levels** (`chummer/powers/power/levels`): 2 unique values
  - Values: False, True
- **limit** (`chummer/powers/power/limit`): 5 unique values
  - Values: 1, 100, 12, 20, 4
- **source** (`chummer/powers/power/source`): 11 unique values
  - Values: BB, BLB, BTB, CA, FA, HT, SG, SGE, SR5, SS, SSP
- **page** (`chummer/powers/power/page`): 21 unique values
  - Values: 153, 160, 169, 170, 171, 172, 173, 174, 175, 176, 190, 191, 22, 23, 24, 309, 310, 311, 4, 68
- **action** (`chummer/powers/power/action`): 5 unique values
  - Values: Complex, Free, Interrupt, Simple, Special
- **adeptway** (`chummer/powers/power/adeptway`): 3 unique values
  - Values: 0.25, 0.5, 0.75
- **quality** (`chummer/powers/power/adeptwayrequires/required/oneof/quality`): 8 unique values
  - Values: The Artisan's Way, The Artist's Way, The Athlete's Way, The Beast's Way, The Invisible Way, The Speaker's Way, The Spiritual Way, The Warrior's Way
- **attribute** (`chummer/powers/power/bonus/selectattribute/attribute`): 4 unique values
  - Values: AGI, BOD, REA, STR
- **category** (`chummer/powers/power/bonus/weaponcategorydv/selectcategory/category`): 5 unique values
  - Values: Astral Combat, Blades, Clubs, Exotic Melee Weapon, Unarmed Combat
- **name** (`chummer/powers/power/bonus/specificskill/name`): 14 unique values
  - Values: Animal Handling, Assensing, Con, Disguise, Etiquette, Impersonation, Instruction, Intimidation, Leadership, Negotiation, Palming, Perception, Performance, Throwing Weapons
- **bonus** (`chummer/powers/power/bonus/specificskill/bonus`): 3 unique values
  - Values: 1, 2, Rating
- **category** (`chummer/powers/power/bonus/selectskill/skillcategories/category`): 5 unique values
  - Values: Combat Active, Physical Active, Social Active, Technical Active, Vehicle Active
- **maxlevels** (`chummer/powers/power/maxlevels`): 3 unique values
  - Values: 3, 4, 6
- **power** (`chummer/powers/power/required/oneof/power`): 6 unique values
  - Values: Berserk, Elemental Strike, Facial Sculpt, Killing Hands, Kinesics, Mimic
- **name** (`chummer/powers/power/includeinlimit/name`): 2 unique values
  - Values: Power Swimming, Power Swimming (Elf or Troll)
- **val** (`chummer/powers/power/bonus/sprintbonus/val`): 2 unique values
  - Values: 200, 400
- **metatype** (`chummer/powers/power/forbidden/oneof/metatype`): 2 unique values
  - Values: Elf, Troll
- **metatype** (`chummer/powers/power/required/oneof/metatype`): 2 unique values
  - Values: Elf, Troll
- **id** (`chummer/enhancements/enhancement/id`): 11 unique values
  - Values: 19bafb80-2f5a-4370-8cbe-875477ce7471, 215a5a0e-09fc-47ff-9a84-74c99f4f1a53, 25f6368f-21ef-4544-ac55-3c20d8a60374, 2d2939f0-486c-4915-bbeb-084b857c2450, 3f0a99c7-6524-46cb-b43e-070a978c5052, 47cb80a1-a11b-4a60-a557-feada7114379, 855a7a07-5def-4ec5-bb69-29273327b885, 8dc0a8e3-535a-4935-8c90-2079666e6a01, e5cf0578-be0f-4453-9223-118234d3e749, e66fac54-39e4-4e3e-92c6-670485c28c25, fafc7fd4-8418-4a86-b396-6e90943d9e68
- **name** (`chummer/enhancements/enhancement/name`): 11 unique values
  - Values: Air Walking, Barrage, Claws, Digital Celerity, Hot Qi, Master of Taijiquan, Master of the Nine Chakras, Pied Piper, Shadow Touch, Silver-Tongued Devil, Skin Artist
- **power** (`chummer/enhancements/enhancement/power`): 10 unique values
  - Values: Commanding Voice, Counterstrike, Keratin Control, Light Body, Living Focus, Melanin Control, Missile Mastery, Nerve Strike, Nimble Fingers, Traceless Walk
- **page** (`chummer/enhancements/enhancement/page`): 4 unique values
  - Values: 156, 157, 158, 159
- **power** (`chummer/enhancements/enhancement/required/allof/power`): 10 unique values
  - Values: Commanding Voice, Counterstrike, Keratin Control, Light Body, Living Focus, Melanin Control, Missile Mastery, Nerve Strike, Nimble Fingers, Traceless Walk
- **quality** (`chummer/enhancements/enhancement/required/allof/quality`): 8 unique values
  - Values: The Artist's Way, The Athlete's Way, The Beast's Way, The Burnout's Way, The Invisible Way, The Magician's Way, The Speaker's Way, The Warrior's Way

### Numeric Type Candidates
- **bonus** (`chummer/powers/power/bonus/weaponcategorydv/bonus`): 100.0% numeric
  - Examples: 1
- **value** (`chummer/powers/power/bonus/weaponskillaccuracy/value`): 100.0% numeric
  - Examples: 1
- **val** (`chummer/powers/power/bonus/selectlimit/val`): 100.0% numeric
  - Examples: 1
- **extrapointcost** (`chummer/powers/power/extrapointcost`): 100.0% numeric
  - Examples: 0.5
- **throwstr** (`chummer/powers/power/bonus/throwstr`): 100.0% numeric
  - Examples: 1
- **percent** (`chummer/powers/power/bonus/walkmultiplier/percent`): 100.0% numeric
  - Examples: 100, 100
- **value** (`chummer/powers/power/bonus/weaponcategorydice/category/value`): 100.0% numeric
  - Examples: 1
- **ess** (`chummer/powers/power/required/oneof/ess`): 100.0% numeric
  - Examples: 6
- **unarmeddv** (`chummer/enhancements/enhancement/bonus/unarmeddv`): 100.0% numeric
  - Examples: 1

### Boolean Type Candidates
- **doublecost** (`chummer/powers/power/doublecost`): 100.0% boolean
  - Examples: False
