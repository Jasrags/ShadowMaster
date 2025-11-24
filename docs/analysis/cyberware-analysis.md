# Analysis Report: cyberware.xml

**File**: `data\chummerxml\cyberware.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 7299
- **Unique Fields**: 135
- **Unique Attributes**: 22
- **Unique Element Types**: 209

## Fields

### id
**Path**: `chummer/cyberwares/cyberware/id`

- **Count**: 362
- **Presence Rate**: 100.0%
- **Unique Values**: 362
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `b57eadaa-7c3b-4b80-8d79-cbbd922c1196`
  - `961eac53-0c43-4b19-8741-2872177a3a4c`
  - `6b219dfa-310a-45ab-98af-40a62e2431cf`
  - `16b45886-2916-48eb-aea5-ecb74da835bd`
  - `56e37c9d-9191-4f19-a733-33580888a560`

### name
**Path**: `chummer/cyberwares/cyberware/name`

- **Count**: 362
- **Presence Rate**: 100.0%
- **Unique Values**: 360
- **Type Patterns**: string
- **Length Range**: 4-52 characters
- **Examples**:
  - `Essence Hole`
  - `Essence Antihole`
  - `Commlink`
  - `Control Rig`
  - `Cranial Bomb - Kink Bomb`

### category
**Path**: `chummer/cyberwares/cyberware/category`

- **Count**: 362
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-30 characters
- **Examples**:
  - `Bodyware`
  - `Bodyware`
  - `Headware`
  - `Headware`
  - `Headware`
- **All Values**: Auto Injector Mods, Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyber Implant Weapon Accessory, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Cybersuite, Earware, Eyeware, Hard Nanoware, Headware, Nanocybernetics, Soft Nanoware, Special Biodrone Cyberware

### ess
**Path**: `chummer/cyberwares/cyberware/ess`

- **Count**: 362
- **Presence Rate**: 100.0%
- **Unique Values**: 54
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 91.2%
- **Boolean Ratio**: 28.5%
- **Length Range**: 1-32 characters
- **Examples**:
  - `Rating * 0.01`
  - `Rating * -0.01`
  - `0.2`
  - `Rating * 1`
  - `0`

### capacity
**Path**: `chummer/cyberwares/cyberware/capacity`

- **Count**: 362
- **Presence Rate**: 100.0%
- **Unique Values**: 35
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 53.0%
- **Boolean Ratio**: 42.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-12 characters
- **Examples**:
  - `0`
  - `0`
  - `[2]`
  - `0`
  - `[1]`

### avail
**Path**: `chummer/cyberwares/cyberware/avail`

- **Count**: 362
- **Presence Rate**: 100.0%
- **Unique Values**: 65
- **Type Patterns**: mixed_numeric, mixed_boolean
- **Numeric Ratio**: 55.8%
- **Boolean Ratio**: 9.7%
- **Length Range**: 1-24 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `(Rating * 5)R`
  - `12F`

### cost
**Path**: `chummer/cyberwares/cyberware/cost`

- **Count**: 362
- **Presence Rate**: 100.0%
- **Unique Values**: 122
- **Type Patterns**: mixed_numeric, mixed_boolean
- **Numeric Ratio**: 74.9%
- **Boolean Ratio**: 1.4%
- **Length Range**: 1-63 characters
- **Examples**:
  - `0`
  - `0`
  - `2000`
  - `FixedValues(43000,97000,208000)`
  - `10000`

### source
**Path**: `chummer/cyberwares/cyberware/source`

- **Count**: 362
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 15.2%
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: 2050, BB, CF, HS, HT, KC, LCD, NF, R5, SAG, SR5, TCT, TSG

### page
**Path**: `chummer/cyberwares/cyberware/page`

- **Count**: 362
- **Presence Rate**: 100.0%
- **Unique Values**: 56
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 0.6%
- **Length Range**: 1-3 characters
- **Examples**:
  - `0`
  - `0`
  - `451`
  - `452`
  - `452`

### category
**Path**: `chummer/cyberwares/cyberware/allowsubsystems/category`

- **Count**: 327
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-30 characters
- **Examples**:
  - `Eyeware`
  - `Earware`
  - `Bodyware`
  - `Cosmetic Enhancement`
  - `Cyberlimb`
- **All Values**: Auto Injector Mods, Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyber Implant Weapon Accessory, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Earware, Eyeware, Headware, Nanocybernetics

### limit
**Path**: `chummer/cyberwares/cyberware/limit`

- **Count**: 245
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 2.0%
- **Boolean Ratio**: 73.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-9 characters
- **Examples**:
  - `False`
  - `False`
  - `False`
  - `False`
  - `False`
- **All Values**: 1, 3, False, {arm}, {arm} * 5, {leg}, {skull}, {torso}

### cyberware
**Path**: `chummer/cyberwares/cyberware/forbidden/oneof/cyberware`

- **Count**: 225
- **Presence Rate**: 100.0%
- **Unique Values**: 42
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-30 characters
- **Examples**:
  - `Bone Density Augmentation`
  - `Bone Lacing (Plastic)`
  - `Bone Lacing (Titanium)`
  - `Bone Density Augmentation`
  - `Bone Lacing (Aluminum)`

### name
**Path**: `chummer/cyberwares/cyberware/required/parentdetails/OR/name`

- **Count**: 210
- **Presence Rate**: 100.0%
- **Unique Values**: 34
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-28 characters
- **Examples**:
  - `Full Arm`
  - `Lower Arm`
  - `Drone Arm`
  - `Centaur Front Leg`
  - `Centaur Rear Leg`

### name
**Path**: `chummer/cyberwares/cyberware/subsystems/cyberware/name`

- **Count**: 165
- **Presence Rate**: 100.0%
- **Unique Values**: 45
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-26 characters
- **Examples**:
  - `Datajack`
  - `Image Link`
  - `Sound Link`
  - `Centaur Front Leg`
  - `Centaur Front Leg`

### grade
**Path**: `chummer/cyberwares/cyberware/bannedgrades/grade`

- **Count**: 106
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-18 characters
- **Examples**:
  - `Greyware`
  - `Greyware (Adapsin)`
  - `Greyware`
  - `Greyware (Adapsin)`
  - `Greyware`
- **All Values**: Greyware, Greyware (Adapsin), Used, Used (Adapsin)

### gearcategory
**Path**: `chummer/cyberwares/cyberware/allowgear/gearcategory`

- **Count**: 104
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-16 characters
- **Examples**:
  - `Commlinks`
  - `Cyberdecks`
  - `Custom`
  - `Sensors`
  - `Custom`
- **All Values**: Ammunition, Commlinks, Common Programs, Custom, Cyberdecks, Drugs, Hacking Programs, Hard Nanoware, Sensors, Toxins

### rating
**Path**: `chummer/cyberwares/cyberware/rating`

- **Count**: 95
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 95.8%
- **Boolean Ratio**: 5.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-12 characters
- **Examples**:
  - `600`
  - `600`
  - `3`
  - `12`
  - `6`
- **All Values**: 0, 1, 10, 11980, 12, 2, 3, 4, 5, 6, 600, 9, {AGIMaximum}, {STRMaximum}

### rating
**Path**: `chummer/cyberwares/cyberware/subsystems/cyberware/rating`

- **Count**: 87
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 40.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `2`
  - `1`
- **All Values**: 1, 2, 3, 4, 6

### blocksmounts
**Path**: `chummer/cyberwares/cyberware/blocksmounts`

- **Count**: 62
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-35 characters
- **Examples**:
  - `wrist,elbow,shoulder`
  - `ankle,knee,hip`
  - `ankle,knee,hip`
  - `wrist,elbow,shoulder`
  - `wrist,elbow,shoulder`
- **All Values**: ankle,knee,hip, ankle,knee,wrist,elbow,hip,shoulder, elbow, knee, elbow,shoulder, knee,hip, wrist,elbow,shoulder, wrist,elbow,shoulder,ankle,knee,hip

### name
**Path**: `chummer/cyberwares/cyberware/pairinclude/name`

- **Count**: 60
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 17-28 characters
- **Examples**:
  - `Obvious Lower Leg`
  - `Synthetic Lower Arm`
  - `Synthetic Lower Leg`
  - `Obvious Lower Leg, Modular`
  - `Obvious Lower Arm, Modular`
- **All Values**: Obvious Lower Arm, Obvious Lower Arm, Modular, Obvious Lower Leg, Obvious Lower Leg, Modular, Synthetic Lower Arm, Synthetic Lower Arm, Modular, Synthetic Lower Leg, Synthetic Lower Leg, Modular

### bioware
**Path**: `chummer/cyberwares/cyberware/forbidden/oneof/bioware`

- **Count**: 33
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-25 characters
- **Examples**:
  - `Orthoskin`
  - `Bone Density Augmentation`
  - `Enhanced Articulation`
  - `Bone Density Augmentation`
  - `Bone Density Augmentation`
- **All Values**: Bone Density Augmentation, Cerebral Booster, Enhanced Articulation, Mnemonic Enhancer, Muscle Augmentation, Muscle Toner, Orthoskin, Suprathyroid Gland, Synaptic Booster

### addweapon
**Path**: `chummer/cyberwares/cyberware/addweapon`

- **Count**: 33
- **Presence Rate**: 100.0%
- **Unique Values**: 31
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-31 characters
- **Examples**:
  - `Cyber Microgrenade Launcher`
  - `Hand Blade`
  - `Hand Razors`
  - `Heavy Cyber Pistol`
  - `Cyber Hold-Out`

### forcegrade
**Path**: `chummer/cyberwares/cyberware/forcegrade`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-8 characters
- **Examples**:
  - `None`
  - `None`
  - `None`
  - `None`
  - `None`
- **All Values**: None, Standard

### disablequality
**Path**: `chummer/cyberwares/cyberware/bonus/disablequality`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-36 characters
- **Examples**:
  - `8ec5c9bb-aeb9-42f2-a436-a60f764adfe4`
  - `fd346177-3791-44c0-af8c-7cf176fc9aa3`
  - `02e76a38-304e-4a0e-93a3-ad2938306afc`
  - `7a468691-1362-439a-a096-76da6933b24c`
  - `2f080d13-92d7-4b16-9ee6-93b5a89206e4`
- **All Values**: 02e76a38-304e-4a0e-93a3-ad2938306afc, 210401d7-57fa-4260-9517-2725689a509e, 2f080d13-92d7-4b16-9ee6-93b5a89206e4, 3564b678-7721-4a8d-ac79-1600cf92dc14, 4390735f-54fa-44a5-bce7-d23a67427f25, 7a468691-1362-439a-a096-76da6933b24c, 8ec5c9bb-aeb9-42f2-a436-a60f764adfe4, Celerity, fd346177-3791-44c0-af8c-7cf176fc9aa3

### name
**Path**: `chummer/cyberwares/cyberware/subsystems/bioware/name`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-25 characters
- **Examples**:
  - `Orthoskin`
  - `Synaptic Booster`
  - `Cerebral Booster`
  - `Mnemonic Enhancer`
  - `Cerebral Booster`
- **All Values**: Bone Density Augmentation, Cerebral Booster, Enhanced Articulation, Mnemonic Enhancer, Muscle Augmentation, Muscle Toner, Orthoskin, Reflex Recorder, Suprathyroid Gland, Synaptic Booster

### limit
**Path**: `chummer/cyberwares/cyberware/bonus/limitmodifier/limit`

- **Count**: 25
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-8 characters
- **Examples**:
  - `Mental`
  - `Mental`
  - `Mental`
  - `Physical`
  - `Mental`
- **All Values**: Mental, Physical, Social

### value
**Path**: `chummer/cyberwares/cyberware/bonus/limitmodifier/value`

- **Count**: 25
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 80.0%
- **Boolean Ratio**: 36.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `2`
  - `Rating`
  - `1`
- **All Values**: -1, 1, 2, 4, Rating

### condition
**Path**: `chummer/cyberwares/cyberware/bonus/limitmodifier/condition`

- **Count**: 23
- **Presence Rate**: 100.0%
- **Unique Values**: 21
- **Type Patterns**: string
- **Length Range**: 29-54 characters
- **Examples**:
  - `LimitCondition_SkillsActivePerceptionVisual`
  - `LimitCondition_SkillsActivePerceptionHearing`
  - `LimitCondition_SkillsActivePerceptionSpatialRecognizer`
  - `LimitCondition_CyberwareHydraulicJacks`
  - `LimitCondition_SkillsActivePerception`

### limbslot
**Path**: `chummer/cyberwares/cyberware/limbslot`

- **Count**: 22
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-5 characters
- **Examples**:
  - `arm`
  - `leg`
  - `torso`
  - `skull`
  - `arm`
- **All Values**: all, arm, leg, skull, torso

### id
**Path**: `chummer/grades/grade/id`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `9352d1b0-5288-4bbf-82b5-00073f7effc2`
  - `23382221-fd16-44ec-8da7-9b935ed2c1ee`
  - `62dd61be-f1c4-4310-8545-73a4a4645393`
  - `a9aec622-410a-444a-a569-c8d8cc0457b4`
  - `75da0ff2-4137-4990-85e6-331977564712`
- **All Values**: 0b15b0c5-4b98-4884-b080-e55a93491507, 210703b8-6df1-4d1b-b5e7-7f1f8a167f74, 23382221-fd16-44ec-8da7-9b935ed2c1ee, 453dcb77-f1b2-46d6-9e96-227ecb053297, 4db89466-a1e7-4507-9849-9ce3eef56fc9, 5fc14253-7bf8-4266-af24-072607a86d45, 62dd61be-f1c4-4310-8545-73a4a4645393, 75da0ff2-4137-4990-85e6-331977564712, 7ea3a157-867f-4c66-9f62-66b14b36b763, 81b6d909-699b-4fa5-8bb8-a5b2f3996da7, 9352d1b0-5288-4bbf-82b5-00073f7effc2, a9aec622-410a-444a-a569-c8d8cc0457b4, aa2393f5-0d01-4b93-988c-d743c35ec22b, b1b679e8-72ff-46b5-bd9d-652914731b17, c4d67932-0de4-4206-91b6-f3fd504c382f, ccb47e88-b940-41de-85fd-8d0f52c04c6e, dcecd7e5-8cf1-4f83-89fa-177e28cfba03, e77b7a1f-1c7b-4494-b9b5-6dcb5b61010b, f248cee4-4629-40ca-83c6-fbf6422d0cd9

### name
**Path**: `chummer/grades/grade/name`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-34 characters
- **Examples**:
  - `None`
  - `Standard`
  - `Standard (Burnout's Way)`
  - `Used`
  - `Alphaware`
- **All Values**: Alphaware, Alphaware (Adapsin), Betaware, Betaware (Adapsin), Deltaware, Deltaware (Adapsin), Gammaware, Gammaware (Adapsin), Greyware, Greyware (Adapsin), None, Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)

### ess
**Path**: `chummer/grades/grade/ess`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 10.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-5 characters
- **Examples**:
  - `1`
  - `1`
  - `0.8`
  - `1.25`
  - `0.8`
- **All Values**: 0.3, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9, 1, 1.0, 1.125, 1.25

### cost
**Path**: `chummer/grades/grade/cost`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 26.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `0.75`
  - `1.2`
- **All Values**: 0.75, 1, 1.2, 1.3, 1.5, 2.5, 5

### devicerating
**Path**: `chummer/grades/grade/devicerating`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`
  - `3`
- **All Values**: 2, 3, 4, 5, 6

### avail
**Path**: `chummer/grades/grade/avail`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 36.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `-4`
  - `+2`
- **All Values**: +12, +2, +4, +8, -4, 0

### source
**Path**: `chummer/grades/grade/source`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SG`
  - `SR5`
  - `SR5`
- **All Values**: BTB, CF, SG, SR5

### page
**Path**: `chummer/grades/grade/page`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 5.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `1`
  - `451`
  - `177`
  - `451`
  - `451`
- **All Values**: 1, 158, 177, 451, 71, 72

### physical
**Path**: `chummer/cyberwares/cyberware/bonus/conditionmonitor/physical`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`

### mountsto
**Path**: `chummer/cyberwares/cyberware/mountsto`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-8 characters
- **Examples**:
  - `ankle`
  - `wrist`
  - `ankle`
  - `wrist`
  - `elbow`
- **All Values**: ankle, elbow, hip, knee, shoulder, wrist

### forced
**Path**: `chummer/cyberwares/cyberware/subsystems/cyberware/forced`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-5 characters
- **Examples**:
  - `Left`
  - `Right`
  - `Left`
  - `Right`
  - `Left`
- **All Values**: Left, Right

### rating
**Path**: `chummer/cyberwares/cyberware/subsystems/bioware/rating`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `1`
  - `1`
  - `1`
  - `3`
- **All Values**: 1, 2, 3, 4

### name
**Path**: `chummer/cyberwares/cyberware/subsystems/cyberware/subsystems/cyberware/name`

- **Count**: 17
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-20 characters
- **Examples**:
  - `Flare Compensation`
  - `Thermographic Vision`
  - `Low-Light Vision`
  - `Vision Enhancement`
  - `Smartlink`
- **All Values**: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement

### category
**Path**: `chummer/categories/category`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-30 characters
- **Examples**:
  - `Bodyware`
  - `Auto Injector Mods`
  - `Cosmetic Enhancement`
  - `Cyberlimb`
  - `Cyberlimb Accessory`
- **All Values**: Auto Injector Mods, Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyber Implant Weapon Accessory, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Cybersuite, Earware, Eyeware, Hard Nanoware, Headware, Nanocybernetics, Soft Nanoware, Special Biodrone Cyberware

### cyberwarecontains
**Path**: `chummer/cyberwares/cyberware/forbidden/oneof/cyberwarecontains`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-7 characters
- **Examples**:
  - `Liminal`
  - `Liminal`
  - `Liminal`
  - `Liminal`
  - `Liminal`
- **All Values**: Liminal, Skull

### minrating
**Path**: `chummer/cyberwares/cyberware/minrating`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 69.2%
- **Boolean Ratio**: 69.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-14 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`
- **All Values**: 1, {AGIMinimum}+1, {STRMinimum}+1

### name
**Path**: `chummer/cyberwares/cyberware/bonus/specificattribute/name`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `AGI`
  - `STR`
  - `REA`
  - `REA`
  - `REA`
- **All Values**: AGI, CHA, REA, STR

### val
**Path**: `chummer/cyberwares/cyberware/bonus/specificattribute/val`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`
  - `Rating`
  - `Rating`

### name
**Path**: `chummer/cyberwares/cyberware/subsystems/cyberware/gears/usegear/name`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-14 characters
- **Examples**:
  - `Shiawase Jishi`
  - `Transys Avalon`
  - `Transys Avalon`
  - `Transys Avalon`
  - `Sony Ronin`
- **All Values**: MCT-5000, Shiawase Jishi, Sony Ronin, Transys Avalon

### category
**Path**: `chummer/cyberwares/cyberware/subsystems/cyberware/gears/usegear/category`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Commlinks`
  - `Commlinks`
  - `Commlinks`
  - `Commlinks`
  - `Commlinks`

### armor
**Path**: `chummer/cyberwares/cyberware/bonus/armor`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 37.5%
- **Boolean Ratio**: 12.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `2`
  - `1`
  - `3`
  - `Rating`
  - `Rating`
- **All Values**: 1, 2, 3, Rating

### physical
**Path**: `chummer/cyberwares/cyberware/pairbonus/conditionmonitor/physical`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`

### category
**Path**: `chummer/cyberwares/cyberware/bonus/runmultiplier/category`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Ground`
  - `Ground`
  - `Ground`
  - `Ground`
  - `Ground`

### category
**Path**: `chummer/cyberwares/cyberware/bonus/walkmultiplier/category`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-6 characters
- **Examples**:
  - `Ground`
  - `Ground`
  - `Ground`
  - `Ground`
  - `Ground`
- **All Values**: Ground, Swim

### percent
**Path**: `chummer/cyberwares/cyberware/bonus/walkmultiplier/percent`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `-50`
  - `-50`
  - `-50`
  - `-50`
  - `-50`
- **All Values**: -50, 100

### category
**Path**: `chummer/cyberwares/cyberware/required/parentdetails/category`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-20 characters
- **Examples**:
  - `Cyber Implant Weapon`
  - `Cyber Implant Weapon`
  - `Cyber Implant Weapon`
  - `Cyberlimb`
  - `Cyber Implant Weapon`
- **All Values**: Cyber Implant Weapon, Cyberlimb

### val
**Path**: `chummer/cyberwares/cyberware/bonus/runmultiplier/val`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`
  - `-1`
  - `-1`
  - `-1`
  - `-1`

### modularmount
**Path**: `chummer/cyberwares/cyberware/modularmount`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-8 characters
- **Examples**:
  - `wrist`
  - `ankle`
  - `elbow`
  - `knee`
  - `shoulder`
- **All Values**: ankle, elbow, hip, knee, shoulder, wrist

### forced
**Path**: `chummer/cyberwares/cyberware/subsystems/bioware/forced`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-14 characters
- **Examples**:
  - `Locksmith`
  - `Pistols`
  - `Automatics`
  - `Unarmed Combat`
  - `Pistols`
- **All Values**: Automatics, Locksmith, Pistols, Unarmed Combat

### cyberware
**Path**: `chummer/cyberwares/cyberware/required/allof/cyberware`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 18-43 characters
- **Examples**:
  - `Siemens Cyberspine`
  - `Siemens Cyberspine`
  - `Siemens Cyberspine Upgrade (Elite Athletic)`
  - `Siemens Cyberspine`
  - `Siemens Cyberspine`
- **All Values**: Siemens Cyberspine, Siemens Cyberspine Upgrade (Elite Athletic), Siemens Cyberspine Upgrade (Elite Warrior)

### name
**Path**: `chummer/cyberwares/cyberware/bonus/specificskill/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-13 characters
- **Examples**:
  - `Impersonation`
  - `Disguise`
  - `Mathematics`
  - `Impersonation`
  - `Intimidation`
- **All Values**: Disguise, Impersonation, Intimidation, Mathematics

### bonus
**Path**: `chummer/cyberwares/cyberware/bonus/specificskill/bonus`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 40.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `4`
  - `4`
  - `Rating`
  - `Rating`
- **All Values**: 4, Rating

### initiativepass
**Path**: `chummer/cyberwares/cyberware/bonus/initiativepass`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-18 characters
- **Examples**:
  - `Rating`
  - `FixedValues(0,1,1)`
  - `FixedValues(0,1,1)`
  - `Rating`
- **All Values**: FixedValues(0,1,1), Rating

### addparentweaponaccessory
**Path**: `chummer/cyberwares/cyberware/addparentweaponaccessory`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-19 characters
- **Examples**:
  - `External Clip Port`
  - `Laser Sight`
  - `Silencer/Suppressor`
  - `Overclocked`
- **All Values**: External Clip Port, Laser Sight, Overclocked, Silencer/Suppressor

### category
**Path**: `chummer/cyberwares/cyberware/pairbonus/walkmultiplier/category`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-6 characters
- **Examples**:
  - `Swim`
  - `Swim`
  - `Ground`
  - `Ground`
- **All Values**: Ground, Swim

### percent
**Path**: `chummer/cyberwares/cyberware/pairbonus/walkmultiplier/percent`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `50`
  - `50`
  - `50`
  - `100`
- **All Values**: 100, 50

### gearname
**Path**: `chummer/cyberwares/cyberware/allowgear/gearname`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-27 characters
- **Examples**:
  - `Medkit`
  - `Medkit (Bullets & Bandages)`
  - `Medkit (2050)`
  - `Savior Medkit`
- **All Values**: Medkit, Medkit (2050), Medkit (Bullets & Bandages), Savior Medkit

### rating
**Path**: `chummer/cyberwares/cyberware/subsystems/cyberware/subsystems/cyberware/rating`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`

### name
**Path**: `chummer/cyberwares/cyberware/gears/usegear/name`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 15-24 characters
- **Examples**:
  - `Sim Module, Hot`
  - `Universal Connector Cord`
  - `Universal Connector Cord`
- **All Values**: Sim Module, Hot, Universal Connector Cord

### category
**Path**: `chummer/cyberwares/cyberware/gears/usegear/category`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-20 characters
- **Examples**:
  - `Commlink Accessories`
  - `Tools`
  - `Tools`
- **All Values**: Commlink Accessories, Tools

### damageresistance
**Path**: `chummer/cyberwares/cyberware/bonus/damageresistance`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `1`
  - `3`
- **All Values**: 1, 2, 3

### unarmeddv
**Path**: `chummer/cyberwares/cyberware/bonus/unarmeddv`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `1`
  - `3`
- **All Values**: 1, 2, 3

### notes
**Path**: `chummer/cyberwares/cyberware/notes`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 78-78 characters
- **Examples**:
  - `Bone Lacing does not increase your BOD score, only tests for resisting damage.`
  - `Bone Lacing does not increase your BOD score, only tests for resisting damage.`
  - `Bone Lacing does not increase your BOD score, only tests for resisting damage.`

### skillwire
**Path**: `chummer/cyberwares/cyberware/bonus/skillwire`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-10 characters
- **Examples**:
  - `Rating`
  - `Rating * 2`
  - `Rating * 2`
- **All Values**: Rating, Rating * 2

### limit
**Path**: `chummer/cyberwares/cyberware/wirelessbonus/limitmodifier/limit`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-8 characters
- **Examples**:
  - `Mental`
  - `Physical`
  - `Social`
- **All Values**: Mental, Physical, Social

### value
**Path**: `chummer/cyberwares/cyberware/wirelessbonus/limitmodifier/value`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`

### condition
**Path**: `chummer/cyberwares/cyberware/wirelessbonus/limitmodifier/condition`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 25-25 characters
- **Examples**:
  - `LimitCondition_Skillwires`
  - `LimitCondition_Skillwires`
  - `LimitCondition_Skillwires`

### name
**Path**: `chummer/cyberwares/cyberware/pairbonus/specificskill/name`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-8 characters
- **Examples**:
  - `Swimming`
  - `Swimming`
  - `Palming`
- **All Values**: Palming, Swimming

### bonus
**Path**: `chummer/cyberwares/cyberware/pairbonus/specificskill/bonus`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`

### limit
**Path**: `chummer/cyberwares/cyberware/pairbonus/limitmodifier/limit`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Physical`
  - `Physical`
  - `Physical`

### value
**Path**: `chummer/cyberwares/cyberware/pairbonus/limitmodifier/value`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `-1`
  - `-2`
- **All Values**: -1, -2, 1

### condition
**Path**: `chummer/cyberwares/cyberware/pairbonus/limitmodifier/condition`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 20-32 characters
- **Examples**:
  - `LimitCondition_SkillGroupStealth`
  - `LimitCondition_InUse`
  - `LimitCondition_InUse`
- **All Values**: LimitCondition_InUse, LimitCondition_SkillGroupStealth

### category
**Path**: `chummer/cyberwares/cyberware/pairbonus/runmultiplier/category`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Ground`
  - `Ground`
  - `Ground`

### limbslotcount
**Path**: `chummer/cyberwares/cyberware/limbslotcount`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `all`
  - `all`
  - `all`

### val
**Path**: `chummer/cyberwares/cyberware/bonus/knowledgeskillkarmacost/val`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 2-20 characters
- **Examples**:
  - `-1`
  - `-number(Rating >= 2)`
  - `-number(Rating >= 3)`
- **All Values**: -1, -number(Rating >= 2), -number(Rating >= 3)

### min
**Path**: `chummer/cyberwares/cyberware/bonus/knowledgeskillkarmacost/min`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `4`
  - `5`
- **All Values**: 3, 4, 5

### name
**Path**: `chummer/grades/grade/bonus/specificattribute/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `MAG`
  - `MAG`

### val
**Path**: `chummer/grades/grade/bonus/specificattribute/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`
  - `-1`

### max
**Path**: `chummer/grades/grade/bonus/specificattribute/max`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`
  - `-1`

### rating
**Path**: `chummer/cyberwares/cyberware/gears/usegear/rating`

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

### skillsoftaccess
**Path**: `chummer/cyberwares/cyberware/bonus/skillsoftaccess`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### addvehicle
**Path**: `chummer/cyberwares/cyberware/addvehicle`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 12-16 characters
- **Examples**:
  - `Ocular Drone`
  - `Remote Cyberhand`
- **All Values**: Ocular Drone, Remote Cyberhand

### smartlink
**Path**: `chummer/cyberwares/cyberware/bonus/smartlink`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`

### name
**Path**: `chummer/cyberwares/cyberware/wirelesspairbonus/specificattribute/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `REA`
  - `REA`

### val
**Path**: `chummer/cyberwares/cyberware/wirelesspairbonus/specificattribute/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### aug
**Path**: `chummer/cyberwares/cyberware/wirelesspairbonus/specificattribute/aug`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 18-18 characters
- **Examples**:
  - `FixedValues(0,0,1)`
  - `FixedValues(0,0,1)`

### name
**Path**: `chummer/cyberwares/cyberware/wirelesspairinclude/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 14-18 characters
- **Examples**:
  - `Wired Reflexes`
  - `Reaction Enhancers`
- **All Values**: Reaction Enhancers, Wired Reflexes

### name
**Path**: `chummer/cyberwares/cyberware/wirelessbonus/specificskill/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-10 characters
- **Examples**:
  - `Perception`
  - `Navigation`
- **All Values**: Navigation, Perception

### bonus
**Path**: `chummer/cyberwares/cyberware/wirelessbonus/specificskill/bonus`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
- **All Values**: 1, 2

### hardwires
**Path**: `chummer/cyberwares/cyberware/bonus/hardwires`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### category
**Path**: `chummer/cyberwares/cyberware/pairbonus/sprintbonus/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Swim`
  - `Swim`

### percent
**Path**: `chummer/cyberwares/cyberware/pairbonus/sprintbonus/percent`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `50`
  - `50`

### initiative
**Path**: `chummer/cyberwares/cyberware/bonus/initiative`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 18-18 characters
- **Examples**:
  - `FixedValues(3,6,9)`
  - `FixedValues(3,6,9)`

### ratinglabel
**Path**: `chummer/cyberwares/cyberware/ratinglabel`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-21 characters
- **Examples**:
  - `Rating_LengthInCmBy10`
  - `Rating_Meters`
- **All Values**: Rating_LengthInCmBy10, Rating_Meters

### metatype
**Path**: `chummer/cyberwares/cyberware/required/oneof/metatype`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-5 characters
- **Examples**:
  - `Ork`
  - `Troll`
- **All Values**: Ork, Troll

### percent
**Path**: `chummer/cyberwares/cyberware/pairbonus/runmultiplier/percent`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `50`
  - `100`
- **All Values**: 100, 50

### percent
**Path**: `chummer/cyberwares/cyberware/bonus/runmultiplier/percent`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `100`
  - `100`

### name
**Path**: `chummer/cyberwares/cyberware/bonus/skilllinkedattribute/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `INT`
  - `LOG`
- **All Values**: INT, LOG

### bonus
**Path**: `chummer/cyberwares/cyberware/bonus/skilllinkedattribute/bonus`

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

### devicerating
**Path**: `chummer/cyberwares/cyberware/devicerating`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `{Rating}`

### sonicresist
**Path**: `chummer/cyberwares/cyberware/bonus/sonicresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### disablequality
**Path**: `chummer/cyberwares/cyberware/wirelesspairbonus/disablequality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `3564b678-7721-4a8d-ac79-1600cf92dc14`

### initiativepass
**Path**: `chummer/cyberwares/cyberware/wirelesspairbonus/initiativepass`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### category
**Path**: `chummer/cyberwares/cyberware/forbidden/parentdetails/category`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Cyberlimb`

### name
**Path**: `chummer/cyberwares/cyberware/wirelessbonus/skillcategory/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Combat Active`

### bonus
**Path**: `chummer/cyberwares/cyberware/wirelessbonus/skillcategory/bonus`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### sociallimit
**Path**: `chummer/cyberwares/cyberware/bonus/sociallimit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `-Rating`

### addquality
**Path**: `chummer/cyberwares/cyberware/bonus/addqualities/addquality`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Human-Looking`

### max
**Path**: `chummer/cyberwares/cyberware/bonus/specificattribute/max`

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
**Path**: `chummer/cyberwares/cyberware/pairbonus/runmultiplier/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### name
**Path**: `chummer/cyberwares/cyberware/pairbonus/weaponaccuracy/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 11-11 characters
- **Examples**:
  - `Raptor Foot`

### value
**Path**: `chummer/cyberwares/cyberware/pairbonus/weaponaccuracy/value`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### category
**Path**: `chummer/cyberwares/cyberware/bonus/sprintbonus/category`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Swim`

### percent
**Path**: `chummer/cyberwares/cyberware/bonus/sprintbonus/percent`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `100`

### limbslot
**Path**: `chummer/cyberwares/cyberware/bonus/addlimb/limbslot`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `leg`

### val
**Path**: `chummer/cyberwares/cyberware/bonus/addlimb/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### value
**Path**: `chummer/cyberwares/cyberware/bonus/weaponskillaccuracy/value`

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
**Path**: `chummer/cyberwares/cyberware/pairbonus/selectskill/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### name
**Path**: `chummer/cyberwares/cyberware/required/parentdetails/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 11-11 characters
- **Examples**:
  - `Flametosser`

### category
**Path**: `chummer/cyberwares/cyberware/bonus/selectcyberware/category`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Soft Nanoware`

### stuncmrecovery
**Path**: `chummer/cyberwares/cyberware/bonus/stuncmrecovery`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### physicalcmrecovery
**Path**: `chummer/cyberwares/cyberware/bonus/physicalcmrecovery`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### memory
**Path**: `chummer/cyberwares/cyberware/bonus/memory`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### fatigueresist
**Path**: `chummer/cyberwares/cyberware/bonus/fatigueresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### removalcost
**Path**: `chummer/cyberwares/cyberware/removalcost`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `16000`

### programs
**Path**: `chummer/cyberwares/cyberware/programs`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

## Attributes

### name@operation
**Path**: `chummer/cyberwares/cyberware/required/parentdetails/OR/name@operation`

- **Count**: 147
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`
  - `contains`
  - `contains`
  - `contains`

### category@blackmarket
**Path**: `chummer/categories/category@blackmarket`

- **Count**: 16
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Cyberware`
  - `Cyberware`
  - `Cyberware`
  - `Cyberware`
  - `Cyberware`
- **All Values**: Cyberware, Nanoware

### specificattribute@precedence
**Path**: `chummer/cyberwares/cyberware/bonus/specificattribute@precedence`

- **Count**: 7
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`

### initiativepass@precedence
**Path**: `chummer/cyberwares/cyberware/bonus/initiativepass@precedence`

- **Count**: 4
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`

### armor@group
**Path**: `chummer/cyberwares/cyberware/bonus/armor@group`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`
  - `0`

### skillsoftaccess@precedence
**Path**: `chummer/cyberwares/cyberware/bonus/skillsoftaccess@precedence`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`

### wirelesspairbonus@mode
**Path**: `chummer/cyberwares/cyberware/wirelesspairbonus@mode`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `replace`
  - `replace`

### specificattribute@precedence
**Path**: `chummer/cyberwares/cyberware/wirelesspairbonus/specificattribute@precedence`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `1`
  - `1`

### wirelesspairinclude@includeself
**Path**: `chummer/cyberwares/cyberware/wirelesspairinclude@includeself`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `False`
  - `False`

### skillwire@precedence
**Path**: `chummer/cyberwares/cyberware/bonus/skillwire@precedence`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`

### initiative@precedence
**Path**: `chummer/cyberwares/cyberware/bonus/initiative@precedence`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema cyberware.xsd`

### bonus@unique
**Path**: `chummer/cyberwares/cyberware/bonus@unique`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `muscle`

### initiativepass@precedence
**Path**: `chummer/cyberwares/cyberware/wirelesspairbonus/initiativepass@precedence`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `1`

### hardwires@knowledgeskill
**Path**: `chummer/cyberwares/cyberware/bonus/hardwires@knowledgeskill`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

### hardwires@excludecategory
**Path**: `chummer/cyberwares/cyberware/bonus/hardwires@excludecategory`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Magical Active,Resonance Active`

### addlimb@precedence
**Path**: `chummer/cyberwares/cyberware/bonus/addlimb@precedence`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `0`

### selectskill@knowledgeskills
**Path**: `chummer/cyberwares/cyberware/bonus/weaponskillaccuracy/selectskill@knowledgeskills`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `False`

### selectskill@knowledgeskills
**Path**: `chummer/cyberwares/cyberware/pairbonus/selectskill@knowledgeskills`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `False`

### selecttext@xml
**Path**: `chummer/cyberwares/cyberware/bonus/selecttext@xml`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `gear.xml`

### selecttext@xpath
**Path**: `chummer/cyberwares/cyberware/bonus/selecttext@xpath`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `/chummer/gears/gear[category = 'Toxins']`

### selecttext@allowedit
**Path**: `chummer/cyberwares/cyberware/bonus/selecttext@allowedit`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

## Type Improvement Recommendations

### Enum Candidates
- **id** (`chummer/grades/grade/id`): 19 unique values
  - Values: 0b15b0c5-4b98-4884-b080-e55a93491507, 210703b8-6df1-4d1b-b5e7-7f1f8a167f74, 23382221-fd16-44ec-8da7-9b935ed2c1ee, 453dcb77-f1b2-46d6-9e96-227ecb053297, 4db89466-a1e7-4507-9849-9ce3eef56fc9, 5fc14253-7bf8-4266-af24-072607a86d45, 62dd61be-f1c4-4310-8545-73a4a4645393, 75da0ff2-4137-4990-85e6-331977564712, 7ea3a157-867f-4c66-9f62-66b14b36b763, 81b6d909-699b-4fa5-8bb8-a5b2f3996da7, 9352d1b0-5288-4bbf-82b5-00073f7effc2, a9aec622-410a-444a-a569-c8d8cc0457b4, aa2393f5-0d01-4b93-988c-d743c35ec22b, b1b679e8-72ff-46b5-bd9d-652914731b17, c4d67932-0de4-4206-91b6-f3fd504c382f, ccb47e88-b940-41de-85fd-8d0f52c04c6e, dcecd7e5-8cf1-4f83-89fa-177e28cfba03, e77b7a1f-1c7b-4494-b9b5-6dcb5b61010b, f248cee4-4629-40ca-83c6-fbf6422d0cd9
- **name** (`chummer/grades/grade/name`): 19 unique values
  - Values: Alphaware, Alphaware (Adapsin), Betaware, Betaware (Adapsin), Deltaware, Deltaware (Adapsin), Gammaware, Gammaware (Adapsin), Greyware, Greyware (Adapsin), None, Omegaware, Omegaware (Adapsin), Standard, Standard (Adapsin), Standard (Burnout's Way), Standard (Burnout's Way) (Adapsin), Used, Used (Adapsin)
- **ess** (`chummer/grades/grade/ess`): 13 unique values
  - Values: 0.3, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9, 1, 1.0, 1.125, 1.25
- **cost** (`chummer/grades/grade/cost`): 7 unique values
  - Values: 0.75, 1, 1.2, 1.3, 1.5, 2.5, 5
- **devicerating** (`chummer/grades/grade/devicerating`): 5 unique values
  - Values: 2, 3, 4, 5, 6
- **avail** (`chummer/grades/grade/avail`): 6 unique values
  - Values: +12, +2, +4, +8, -4, 0
- **source** (`chummer/grades/grade/source`): 4 unique values
  - Values: BTB, CF, SG, SR5
- **page** (`chummer/grades/grade/page`): 6 unique values
  - Values: 1, 158, 177, 451, 71, 72
- **category** (`chummer/categories/category`): 16 unique values
  - Values: Auto Injector Mods, Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyber Implant Weapon Accessory, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Cybersuite, Earware, Eyeware, Hard Nanoware, Headware, Nanocybernetics, Soft Nanoware, Special Biodrone Cyberware
- **limit** (`chummer/cyberwares/cyberware/limit`): 8 unique values
  - Values: 1, 3, False, {arm}, {arm} * 5, {leg}, {skull}, {torso}
- **category** (`chummer/cyberwares/cyberware/category`): 16 unique values
  - Values: Auto Injector Mods, Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyber Implant Weapon Accessory, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Cybersuite, Earware, Eyeware, Hard Nanoware, Headware, Nanocybernetics, Soft Nanoware, Special Biodrone Cyberware
- **capacity** (`chummer/cyberwares/cyberware/capacity`): 35 unique values
  - Values: 0, 1, 10, 12, 15, 17, 20, 40, 6, 8, [*], [-Rating], [0], [10], [15], [5], [6], [8], [Rating * 2], [Rating]
- **source** (`chummer/cyberwares/cyberware/source`): 13 unique values
  - Values: 2050, BB, CF, HS, HT, KC, LCD, NF, R5, SAG, SR5, TCT, TSG
- **rating** (`chummer/cyberwares/cyberware/rating`): 14 unique values
  - Values: 0, 1, 10, 11980, 12, 2, 3, 4, 5, 6, 600, 9, {AGIMaximum}, {STRMaximum}
- **forcegrade** (`chummer/cyberwares/cyberware/forcegrade`): 2 unique values
  - Values: None, Standard
- **gearcategory** (`chummer/cyberwares/cyberware/allowgear/gearcategory`): 10 unique values
  - Values: Ammunition, Commlinks, Common Programs, Custom, Cyberdecks, Drugs, Hacking Programs, Hard Nanoware, Sensors, Toxins
- **grade** (`chummer/cyberwares/cyberware/bannedgrades/grade`): 4 unique values
  - Values: Greyware, Greyware (Adapsin), Used, Used (Adapsin)
- **minrating** (`chummer/cyberwares/cyberware/minrating`): 3 unique values
  - Values: 1, {AGIMinimum}+1, {STRMinimum}+1
- **name** (`chummer/cyberwares/cyberware/gears/usegear/name`): 2 unique values
  - Values: Sim Module, Hot, Universal Connector Cord
- **category** (`chummer/cyberwares/cyberware/gears/usegear/category`): 2 unique values
  - Values: Commlink Accessories, Tools
- **name** (`chummer/cyberwares/cyberware/subsystems/cyberware/name`): 45 unique values
  - Values: Bone Lacing (Aluminum), Bone Lacing (Plastic), Commlink, Control Rig, Cybereyes Basic System, Data Lock, Modular Mount, Muscle Replacement, Obvious Full Arm, Obvious Full Leg, Obvious Lower Arm, Obvious Lower Leg, Obvious Skull, Olfactory Booster, Skilljack, Skillwires, Spurs, Taste Booster, Touch Link, Visualizer
- **name** (`chummer/cyberwares/cyberware/bonus/specificskill/name`): 4 unique values
  - Values: Disguise, Impersonation, Intimidation, Mathematics
- **bonus** (`chummer/cyberwares/cyberware/bonus/specificskill/bonus`): 2 unique values
  - Values: 4, Rating
- **category** (`chummer/cyberwares/cyberware/allowsubsystems/category`): 12 unique values
  - Values: Auto Injector Mods, Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyber Implant Weapon Accessory, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Earware, Eyeware, Headware, Nanocybernetics
- **disablequality** (`chummer/cyberwares/cyberware/bonus/disablequality`): 9 unique values
  - Values: 02e76a38-304e-4a0e-93a3-ad2938306afc, 210401d7-57fa-4260-9517-2725689a509e, 2f080d13-92d7-4b16-9ee6-93b5a89206e4, 3564b678-7721-4a8d-ac79-1600cf92dc14, 4390735f-54fa-44a5-bce7-d23a67427f25, 7a468691-1362-439a-a096-76da6933b24c, 8ec5c9bb-aeb9-42f2-a436-a60f764adfe4, Celerity, fd346177-3791-44c0-af8c-7cf176fc9aa3
- **addvehicle** (`chummer/cyberwares/cyberware/addvehicle`): 2 unique values
  - Values: Ocular Drone, Remote Cyberhand
- **limit** (`chummer/cyberwares/cyberware/bonus/limitmodifier/limit`): 3 unique values
  - Values: Mental, Physical, Social
- **value** (`chummer/cyberwares/cyberware/bonus/limitmodifier/value`): 5 unique values
  - Values: -1, 1, 2, 4, Rating
- **armor** (`chummer/cyberwares/cyberware/bonus/armor`): 4 unique values
  - Values: 1, 2, 3, Rating
- **damageresistance** (`chummer/cyberwares/cyberware/bonus/damageresistance`): 3 unique values
  - Values: 1, 2, 3
- **unarmeddv** (`chummer/cyberwares/cyberware/bonus/unarmeddv`): 3 unique values
  - Values: 1, 2, 3
- **cyberware** (`chummer/cyberwares/cyberware/forbidden/oneof/cyberware`): 42 unique values
  - Values: Bone Lacing (Plastic), Bone Lacing (Titanium), Cybereyes Basic System, Muscle Replacement, Obvious Full Arm, Obvious Full Leg, Obvious Hand, Obvious Lower Arm, Obvious Lower Leg, Obvious Skull, Olfactory Booster, Partial Cyberskull, Primitive Prosthetic Lower Leg, Skilljack, Skillwires, Smart Articulation, Synthetic Foot, Synthetic Full Leg, Synthetic Hand, Taste Booster
- **bioware** (`chummer/cyberwares/cyberware/forbidden/oneof/bioware`): 9 unique values
  - Values: Bone Density Augmentation, Cerebral Booster, Enhanced Articulation, Mnemonic Enhancer, Muscle Augmentation, Muscle Toner, Orthoskin, Suprathyroid Gland, Synaptic Booster
- **name** (`chummer/cyberwares/cyberware/bonus/specificattribute/name`): 4 unique values
  - Values: AGI, CHA, REA, STR
- **name** (`chummer/cyberwares/cyberware/wirelesspairinclude/name`): 2 unique values
  - Values: Reaction Enhancers, Wired Reflexes
- **skillwire** (`chummer/cyberwares/cyberware/bonus/skillwire`): 2 unique values
  - Values: Rating, Rating * 2
- **limit** (`chummer/cyberwares/cyberware/wirelessbonus/limitmodifier/limit`): 3 unique values
  - Values: Mental, Physical, Social
- **initiativepass** (`chummer/cyberwares/cyberware/bonus/initiativepass`): 2 unique values
  - Values: FixedValues(0,1,1), Rating
- **limbslot** (`chummer/cyberwares/cyberware/limbslot`): 5 unique values
  - Values: all, arm, leg, skull, torso
- **blocksmounts** (`chummer/cyberwares/cyberware/blocksmounts`): 7 unique values
  - Values: ankle,knee,hip, ankle,knee,wrist,elbow,hip,shoulder, elbow, knee, elbow,shoulder, knee,hip, wrist,elbow,shoulder, wrist,elbow,shoulder,ankle,knee,hip
- **cyberwarecontains** (`chummer/cyberwares/cyberware/forbidden/oneof/cyberwarecontains`): 2 unique values
  - Values: Liminal, Skull
- **name** (`chummer/cyberwares/cyberware/pairinclude/name`): 8 unique values
  - Values: Obvious Lower Arm, Obvious Lower Arm, Modular, Obvious Lower Leg, Obvious Lower Leg, Modular, Synthetic Lower Arm, Synthetic Lower Arm, Modular, Synthetic Lower Leg, Synthetic Lower Leg, Modular
- **name** (`chummer/cyberwares/cyberware/required/parentdetails/OR/name`): 34 unique values
  - Values: Drone Leg, Foot, Full Arm, Full Leg, Hand, Liminal Body, Liminal Body, Wheeled (Full), Obvious Full Arm, Obvious Full Leg, Obvious Hand, Obvious Lower Arm, Obvious Lower Leg, Obvious Skull, Partial Cyberskull, Primitive Drone Arm, Primitive Drone Leg, Synthetic Foot, Synthetic Full Leg, Synthetic Hand, Synthetic Torso
- **addparentweaponaccessory** (`chummer/cyberwares/cyberware/addparentweaponaccessory`): 4 unique values
  - Values: External Clip Port, Laser Sight, Overclocked, Silencer/Suppressor
- **category** (`chummer/cyberwares/cyberware/required/parentdetails/category`): 2 unique values
  - Values: Cyber Implant Weapon, Cyberlimb
- **addweapon** (`chummer/cyberwares/cyberware/addweapon`): 31 unique values
  - Values: Cyber Heavy Pistol (2050), Cyber Hold-Out, Cyber Holdout Pistol (2050), Cyber Light Pistol (2050), Cyber Shotgun, Cyber Shotgun (2050), Cyber Submachine Gun, Cyber Submachine Gun (2050), Cyberfangs, Grapple Fist, Hand Blade, Hand Razors, Hand Razors, Fixed (2050), Hand Razors, Retractable (2050), Heavy Cyber Pistol, Junkyard Jaw, Light Cyber Pistol, Shock Hand, Spur, Fixed (2050), Spurs
- **name** (`chummer/cyberwares/cyberware/wirelessbonus/specificskill/name`): 2 unique values
  - Values: Navigation, Perception
- **bonus** (`chummer/cyberwares/cyberware/wirelessbonus/specificskill/bonus`): 2 unique values
  - Values: 1, 2
- **name** (`chummer/cyberwares/cyberware/pairbonus/specificskill/name`): 2 unique values
  - Values: Palming, Swimming
- **category** (`chummer/cyberwares/cyberware/pairbonus/walkmultiplier/category`): 2 unique values
  - Values: Ground, Swim
- **percent** (`chummer/cyberwares/cyberware/pairbonus/walkmultiplier/percent`): 2 unique values
  - Values: 100, 50
- **ratinglabel** (`chummer/cyberwares/cyberware/ratinglabel`): 2 unique values
  - Values: Rating_LengthInCmBy10, Rating_Meters
- **metatype** (`chummer/cyberwares/cyberware/required/oneof/metatype`): 2 unique values
  - Values: Ork, Troll
- **category** (`chummer/cyberwares/cyberware/bonus/walkmultiplier/category`): 2 unique values
  - Values: Ground, Swim
- **percent** (`chummer/cyberwares/cyberware/bonus/walkmultiplier/percent`): 2 unique values
  - Values: -50, 100
- **gearname** (`chummer/cyberwares/cyberware/allowgear/gearname`): 4 unique values
  - Values: Medkit, Medkit (2050), Medkit (Bullets & Bandages), Savior Medkit
- **value** (`chummer/cyberwares/cyberware/pairbonus/limitmodifier/value`): 3 unique values
  - Values: -1, -2, 1
- **condition** (`chummer/cyberwares/cyberware/pairbonus/limitmodifier/condition`): 2 unique values
  - Values: LimitCondition_InUse, LimitCondition_SkillGroupStealth
- **percent** (`chummer/cyberwares/cyberware/pairbonus/runmultiplier/percent`): 2 unique values
  - Values: 100, 50
- **mountsto** (`chummer/cyberwares/cyberware/mountsto`): 6 unique values
  - Values: ankle, elbow, hip, knee, shoulder, wrist
- **modularmount** (`chummer/cyberwares/cyberware/modularmount`): 6 unique values
  - Values: ankle, elbow, hip, knee, shoulder, wrist
- **forced** (`chummer/cyberwares/cyberware/subsystems/cyberware/forced`): 2 unique values
  - Values: Left, Right
- **val** (`chummer/cyberwares/cyberware/bonus/knowledgeskillkarmacost/val`): 3 unique values
  - Values: -1, -number(Rating >= 2), -number(Rating >= 3)
- **min** (`chummer/cyberwares/cyberware/bonus/knowledgeskillkarmacost/min`): 3 unique values
  - Values: 3, 4, 5
- **name** (`chummer/cyberwares/cyberware/bonus/skilllinkedattribute/name`): 2 unique values
  - Values: INT, LOG
- **rating** (`chummer/cyberwares/cyberware/subsystems/cyberware/rating`): 5 unique values
  - Values: 1, 2, 3, 4, 6
- **name** (`chummer/cyberwares/cyberware/subsystems/cyberware/gears/usegear/name`): 4 unique values
  - Values: MCT-5000, Shiawase Jishi, Sony Ronin, Transys Avalon
- **name** (`chummer/cyberwares/cyberware/subsystems/bioware/name`): 10 unique values
  - Values: Bone Density Augmentation, Cerebral Booster, Enhanced Articulation, Mnemonic Enhancer, Muscle Augmentation, Muscle Toner, Orthoskin, Reflex Recorder, Suprathyroid Gland, Synaptic Booster
- **rating** (`chummer/cyberwares/cyberware/subsystems/bioware/rating`): 4 unique values
  - Values: 1, 2, 3, 4
- **forced** (`chummer/cyberwares/cyberware/subsystems/bioware/forced`): 4 unique values
  - Values: Automatics, Locksmith, Pistols, Unarmed Combat
- **cyberware** (`chummer/cyberwares/cyberware/required/allof/cyberware`): 3 unique values
  - Values: Siemens Cyberspine, Siemens Cyberspine Upgrade (Elite Athletic), Siemens Cyberspine Upgrade (Elite Warrior)
- **name** (`chummer/cyberwares/cyberware/subsystems/cyberware/subsystems/cyberware/name`): 7 unique values
  - Values: Audio Enhancement, Flare Compensation, Low-Light Vision, Smartlink, Spatial Recognizer, Thermographic Vision, Vision Enhancement

### Numeric Type Candidates
- **val** (`chummer/grades/grade/bonus/specificattribute/val`): 100.0% numeric
  - Examples: -1, -1
- **max** (`chummer/grades/grade/bonus/specificattribute/max`): 100.0% numeric
  - Examples: -1, -1
- **ess** (`chummer/cyberwares/cyberware/ess`): 91.2% numeric
  - Examples: Rating * 0.01, Rating * -0.01, 0.2
- **page** (`chummer/cyberwares/cyberware/page`): 100.0% numeric
  - Examples: 0, 0, 451
- **rating** (`chummer/cyberwares/cyberware/gears/usegear/rating`): 100.0% numeric
  - Examples: 1, 1
- **smartlink** (`chummer/cyberwares/cyberware/bonus/smartlink`): 100.0% numeric
  - Examples: 2, 2
- **sonicresist** (`chummer/cyberwares/cyberware/bonus/sonicresist`): 100.0% numeric
  - Examples: 2
- **value** (`chummer/cyberwares/cyberware/wirelessbonus/limitmodifier/value`): 100.0% numeric
  - Examples: 1, 1, 1
- **physical** (`chummer/cyberwares/cyberware/bonus/conditionmonitor/physical`): 100.0% numeric
  - Examples: 1, 1, 1
- **physical** (`chummer/cyberwares/cyberware/pairbonus/conditionmonitor/physical`): 100.0% numeric
  - Examples: 1, 1, 1
- **bonus** (`chummer/cyberwares/cyberware/wirelessbonus/skillcategory/bonus`): 100.0% numeric
  - Examples: 1
- **bonus** (`chummer/cyberwares/cyberware/pairbonus/specificskill/bonus`): 100.0% numeric
  - Examples: 1, 1, 1
- **percent** (`chummer/cyberwares/cyberware/pairbonus/sprintbonus/percent`): 100.0% numeric
  - Examples: 50, 50
- **max** (`chummer/cyberwares/cyberware/bonus/specificattribute/max`): 100.0% numeric
  - Examples: 1
- **val** (`chummer/cyberwares/cyberware/bonus/runmultiplier/val`): 100.0% numeric
  - Examples: -1, -1, -1
- **val** (`chummer/cyberwares/cyberware/pairbonus/runmultiplier/val`): 100.0% numeric
  - Examples: 1
- **value** (`chummer/cyberwares/cyberware/pairbonus/weaponaccuracy/value`): 100.0% numeric
  - Examples: 1
- **percent** (`chummer/cyberwares/cyberware/bonus/sprintbonus/percent`): 100.0% numeric
  - Examples: 100
- **val** (`chummer/cyberwares/cyberware/bonus/addlimb/val`): 100.0% numeric
  - Examples: 2
- **percent** (`chummer/cyberwares/cyberware/bonus/runmultiplier/percent`): 100.0% numeric
  - Examples: 100, 100
- **value** (`chummer/cyberwares/cyberware/bonus/weaponskillaccuracy/value`): 100.0% numeric
  - Examples: 1
- **val** (`chummer/cyberwares/cyberware/pairbonus/selectskill/val`): 100.0% numeric
  - Examples: 1
- **bonus** (`chummer/cyberwares/cyberware/bonus/skilllinkedattribute/bonus`): 100.0% numeric
  - Examples: 1, 1
- **rating** (`chummer/cyberwares/cyberware/subsystems/cyberware/subsystems/cyberware/rating`): 100.0% numeric
  - Examples: 2, 2, 2
- **removalcost** (`chummer/cyberwares/cyberware/removalcost`): 100.0% numeric
  - Examples: 16000
