# Analysis Report: bioware.xml

**File**: `data\chummerxml\bioware.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 3319
- **Unique Fields**: 114
- **Unique Attributes**: 14
- **Unique Element Types**: 154

## Fields

### id
**Path**: `chummer/biowares/bioware/id`

- **Count**: 213
- **Presence Rate**: 100.0%
- **Unique Values**: 213
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `ae0bb365-e40c-4aa2-9c30-0be902d992ac`
  - `b04871a1-6b7b-4a78-89fc-af8ec69bdd3d`
  - `f038260b-f2de-4a9a-9507-5602d0e64a22`
  - `81b40aa8-98d1-4a5d-89d6-9b6d438006da`
  - `c46fbaba-d941-44b5-9bdc-643c5c6f4b24`

### name
**Path**: `chummer/biowares/bioware/name`

- **Count**: 213
- **Presence Rate**: 100.0%
- **Unique Values**: 210
- **Type Patterns**: string
- **Length Range**: 4-52 characters
- **Examples**:
  - `Adrenaline Pump`
  - `Bone Density Augmentation`
  - `Cat's Eyes`
  - `Cerebral Booster`
  - `Damage Compensators`

### category
**Path**: `chummer/biowares/bioware/category`

- **Count**: 213
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-29 characters
- **Examples**:
  - `Basic`
  - `Basic`
  - `Basic`
  - `Cultured`
  - `Cultured`
- **All Values**: Basic, Bio-Weapons, Biosculpting, Chemical Gland Modifications, Complimentary Genetics, Cosmetic Bioware, Cultured, Environmental Microadaptation, Exotic Metagenetics, Genetic Restoration, Immunization, Orthoskin Upgrades, Phenotype Adjustment, Symbionts, Transgenic Alteration, Transgenics

### ess
**Path**: `chummer/biowares/bioware/ess`

- **Count**: 213
- **Presence Rate**: 100.0%
- **Unique Values**: 27
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 79.3%
- **Boolean Ratio**: 8.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-24 characters
- **Examples**:
  - `Rating * 0.75`
  - `Rating * 0.3`
  - `0.1`
  - `Rating * 0.2`
  - `Rating * 0.1`
- **All Values**: (Rating)*0.5, -0.1, 0, 0.02, 0.05*Rating, 0.1, 0.1*Rating, 0.15*Rating, 0.2*Rating, 0.25, 0.3, 0.5, 0.7, 1, FixedValues(0,0.01,0.02), Rating * 0.05, Rating * 0.2, Rating * 0.25, Rating * 0.3, Rating * 0.75

### capacity
**Path**: `chummer/biowares/bioware/capacity`

- **Count**: 213
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

### avail
**Path**: `chummer/biowares/bioware/avail`

- **Count**: 213
- **Presence Rate**: 100.0%
- **Unique Values**: 48
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 69.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-18 characters
- **Examples**:
  - `(Rating * 6)F`
  - `(Rating * 4)`
  - `4`
  - `Rating * 6`
  - `(Rating * 3)F`

### cost
**Path**: `chummer/biowares/bioware/cost`

- **Count**: 213
- **Presence Rate**: 100.0%
- **Unique Values**: 88
- **Type Patterns**: mixed_numeric
- **Numeric Ratio**: 74.2%
- **Length Range**: 2-29 characters
- **Examples**:
  - `Rating * 55000`
  - `Rating * 5000`
  - `4000`
  - `Rating * 31500`
  - `Rating * 2000`

### source
**Path**: `chummer/biowares/bioware/source`

- **Count**: 213
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 8.9%
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: 2050, CF, DTR, HT, KC, NF, SR5

### page
**Path**: `chummer/biowares/bioware/page`

- **Count**: 213
- **Presence Rate**: 100.0%
- **Unique Values**: 33
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `459`
  - `459`
  - `459`
  - `460`
  - `460`

### limit
**Path**: `chummer/biowares/bioware/limit`

- **Count**: 79
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: mixed_numeric, boolean_string, enum_candidate
- **Numeric Ratio**: 2.5%
- **Boolean Ratio**: 88.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-10 characters
- **Examples**:
  - `False`
  - `False`
  - `False`
  - `False`
  - `False`
- **All Values**: 1, False, {BODUnaug}, {arm}, {leg}

### forcegrade
**Path**: `chummer/biowares/bioware/forcegrade`

- **Count**: 61
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `None`
  - `None`
  - `None`
  - `None`
  - `None`

### grade
**Path**: `chummer/biowares/bioware/bannedgrades/grade`

- **Count**: 59
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-24 characters
- **Examples**:
  - `Used`
  - `Used (Adapsin)`
  - `Used`
  - `Used (Adapsin)`
  - `Used`
- **All Values**: Alphaware, Omegaware, Standard, Standard (Burnout's Way), Used, Used (Adapsin)

### rating
**Path**: `chummer/biowares/bioware/rating`

- **Count**: 47
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `3`
  - `4`
  - `3`
  - `12`
  - `3`
- **All Values**: 12, 2, 20, 3, 4, 6

### name
**Path**: `chummer/biowares/bioware/bonus/specificattribute/name`

- **Count**: 28
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `LOG`
  - `STR`
  - `AGI`
  - `BOD`
  - `AGI`
- **All Values**: AGI, BOD, CHA, INT, LOG, REA, STR, WIL

### gearcategory
**Path**: `chummer/biowares/bioware/allowgear/gearcategory`

- **Count**: 25
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-11 characters
- **Examples**:
  - `Chemicals`
  - `Custom Drug`
  - `Drugs`
  - `Toxins`
  - `Custom`
- **All Values**: Chemicals, Custom, Custom Drug, Drugs, Toxins

### addweapon
**Path**: `chummer/biowares/bioware/addweapon`

- **Count**: 20
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 12-30 characters
- **Examples**:
  - `Claws (Bio-Weapon)`
  - `Retractable Claws (Bio-Weapon)`
  - `Medium Tusk(s)`
  - `Large Tusk(s)`
  - `Claws (Bio-Weapon)`
- **All Values**: Bone Spike I, Bone Spike II, Bone Spike III, Claws (Bio-Weapon), Electrical Discharge, Fangs (Bio-Weapon), Horns (Bio-Weapon), Large Stinger, Large Tusk(s), Medium Stinger, Medium Tusk(s), Retractable Claws (Bio-Weapon), Retractable Fangs (Bio-Weapon)

### val
**Path**: `chummer/biowares/bioware/bonus/specificattribute/val`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 50.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`
  - `1`
  - `1`
- **All Values**: 1, Rating

### category
**Path**: `chummer/categories/category`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-29 characters
- **Examples**:
  - `Basic`
  - `Biosculpting`
  - `Bio-Weapons`
  - `Chemical Gland Modifications`
  - `Cosmetic Bioware`
- **All Values**: Basic, Bio-Weapons, Biosculpting, Chemical Gland Modifications, Complimentary Genetics, Cosmetic Bioware, Cultured, Environmental Microadaptation, Exotic Metagenetics, Genetic Restoration, Immunization, Orthoskin Upgrades, Phenotype Adjustment, Symbionts, Transgenic Alteration, Transgenics

### bioware
**Path**: `chummer/biowares/bioware/required/oneof/bioware`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: string
- **Length Range**: 9-52 characters
- **Examples**:
  - `Chemical Gland (Internal Release or Gradual Release)`
  - `Chemical Gland (Exhalation Sprayer)`
  - `Chemical Gland (Spitter)`
  - `Chemical Gland (Weapon Reservoir)`
  - `Orthoskin`

### limit
**Path**: `chummer/biowares/bioware/bonus/limitmodifier/limit`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-8 characters
- **Examples**:
  - `Physical`
  - `Physical`
  - `Physical`
  - `Social`
  - `Social`
- **All Values**: Physical, Social

### value
**Path**: `chummer/biowares/bioware/bonus/limitmodifier/value`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 83.3%
- **Boolean Ratio**: 58.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `2`
- **All Values**: 1, 2, Rating

### condition
**Path**: `chummer/biowares/bioware/bonus/limitmodifier/condition`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 25-45 characters
- **Examples**:
  - `LimitCondition_SkillsActiveEscapeArtist`
  - `LimitCondition_SkillsActiveSwimming`
  - `LimitCondition_SkillsActiveSwimming`
  - `LimitCondition_TestSpeech`
  - `LimitCondition_SkillsActivePerformanceSinging`
- **All Values**: LimitCondition_SkillGroupStealthNaked, LimitCondition_SkillsActiveEscapeArtist, LimitCondition_SkillsActiveLeadership, LimitCondition_SkillsActivePerformanceSinging, LimitCondition_SkillsActiveSwimming, LimitCondition_TestSpeech

### quality
**Path**: `chummer/biowares/bioware/forbidden/oneof/quality`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: string
- **Length Range**: 19-55 characters
- **Examples**:
  - `High Pain Tolerance`
  - `Phenotypic Variation - Genetic Optimization (Body)`
  - `Phenotypic Variation - Genetic Optimization (Agility)`
  - `Phenotypic Variation - Genetic Optimization (Reaction)`
  - `Phenotypic Variation - Genetic Optimization (Strength)`

### bioware
**Path**: `chummer/biowares/bioware/forbidden/oneof/bioware`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-25 characters
- **Examples**:
  - `Elastic Joints`
  - `Chemical Gland (Spitter)`
  - `Electroshock`
  - `Insulation`
  - `Elastic Joints`
- **All Values**: Bone Density Augmentation, Chemical Gland (Spitter), Cold Adaptation, Elastic Joints, Electroshock, Enhanced Articulation, Heat Adaptation, Insulation

### name
**Path**: `chummer/biowares/bioware/bonus/skillcategory/name`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Academic`
  - `Interest`
  - `Language`
  - `Professional`
  - `Street`
- **All Values**: Academic, Interest, Language, Professional, Street

### bonus
**Path**: `chummer/biowares/bioware/bonus/skillcategory/bonus`

- **Count**: 10
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

### max
**Path**: `chummer/biowares/bioware/bonus/specificattribute/max`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 90.0%
- **Boolean Ratio**: 90.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `1`
  - `1`
  - `1`
  - `1`
- **All Values**: 1, Rating

### id
**Path**: `chummer/grades/grade/id`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `ee71d4f8-0fd0-4992-8b4e-70ef4dfbcce1`
  - `f0a67dc0-6b0a-43fa-b389-a110ba1dd59d`
  - `9166244c-440b-44a1-8795-4917b53e6101`
  - `c4bbffe4-5818-4055-bc5e-f44562bde855`
  - `c2c6a3cc-c4bf-42c8-9260-868fd44d34ce`
- **All Values**: 0c86e85c-7e3e-4b6f-aa4b-26d8b379a7c9, 2b599ecd-4e80-4669-a78e-4db232c80a83, 9166244c-440b-44a1-8795-4917b53e6101, 9e24f0ce-b41e-496f-844a-82805fcb65a9, a6fba72c-9fbe-41dc-8310-cd047b50c81e, c2c6a3cc-c4bf-42c8-9260-868fd44d34ce, c4bbffe4-5818-4055-bc5e-f44562bde855, ee71d4f8-0fd0-4992-8b4e-70ef4dfbcce1, f0a67dc0-6b0a-43fa-b389-a110ba1dd59d

### name
**Path**: `chummer/grades/grade/name`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-24 characters
- **Examples**:
  - `None`
  - `Standard`
  - `Standard (Burnout's Way)`
  - `Used`
  - `Alphaware`
- **All Values**: Alphaware, Betaware, Deltaware, Gammaware, None, Omegaware, Standard, Standard (Burnout's Way), Used

### ess
**Path**: `chummer/grades/grade/ess`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `1`
  - `1`
  - `0.8`
  - `1.25`
  - `0.8`
- **All Values**: 0.4, 0.5, 0.7, 0.8, 1, 1.25

### cost
**Path**: `chummer/grades/grade/cost`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `0.75`
  - `1.2`
- **All Values**: 0.75, 1, 1.2, 1.5, 2.5, 5

### devicerating
**Path**: `chummer/grades/grade/devicerating`

- **Count**: 9
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

### avail
**Path**: `chummer/grades/grade/avail`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
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

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SG`
  - `SR5`
  - `SR5`
- **All Values**: CF, SG, SR5

### page
**Path**: `chummer/grades/grade/page`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 11.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `1`
  - `451`
  - `177`
  - `451`
  - `451`
- **All Values**: 1, 177, 451, 71, 72

### disablequality
**Path**: `chummer/biowares/bioware/bonus/disablequality`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-36 characters
- **Examples**:
  - `Celerity`
  - `Celerity`
  - `3564b678-7721-4a8d-ac79-1600cf92dc14`
  - `3564b678-7721-4a8d-ac79-1600cf92dc14`
  - `3564b678-7721-4a8d-ac79-1600cf92dc14`
- **All Values**: 3564b678-7721-4a8d-ac79-1600cf92dc14, Celerity

### lifestylecost
**Path**: `chummer/biowares/bioware/bonus/lifestylecost`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `25`
  - `-10`
  - `10`
  - `-10`
  - `10`
- **All Values**: -10, 10, 25

### notes
**Path**: `chummer/biowares/bioware/notes`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: string
- **Length Range**: 43-95 characters
- **Examples**:
  - `Bonus is for whether this is Internal Release or Gradual Release, not the cost of the chemical.`
  - `Rating is used to indicate number of claws.`
  - `Rating is used to indicate number of claws.`
  - `Rating is used to represent hands and feet. Every 2 Rating will grant +1 Unarmed damage.`
  - `Rating is used to indicate number of tusks.`

### cyberware
**Path**: `chummer/biowares/bioware/forbidden/oneof/cyberware`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 14-22 characters
- **Examples**:
  - `Bone Lacing (Titanium)`
  - `Bone Lacing (Aluminum)`
  - `Bone Lacing (Plastic)`
  - `Smart Articulation`
  - `Dermal Plating`
- **All Values**: Bone Lacing (Aluminum), Bone Lacing (Plastic), Bone Lacing (Titanium), Dermal Plating, Smart Articulation

### name
**Path**: `chummer/biowares/bioware/bonus/specificskill/name`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-13 characters
- **Examples**:
  - `Escape Artist`
  - `Navigation`
  - `Gymnastics`
  - `Perception`
  - `Perception`
- **All Values**: Escape Artist, Gymnastics, Navigation, Perception

### bonus
**Path**: `chummer/biowares/bioware/bonus/specificskill/bonus`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 66.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `1`
  - `3`
- **All Values**: 1, 2, 3

### toxincontactresist
**Path**: `chummer/biowares/bioware/bonus/toxincontactresist`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 50.0%
- **Boolean Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `2`
  - `Rating`
  - `1`
  - `2`
- **All Values**: 1, 2, Rating

### toxiningestionresist
**Path**: `chummer/biowares/bioware/bonus/toxiningestionresist`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 50.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `1`
  - `2`
  - `1`
- **All Values**: 1, 2, Rating

### toxininhalationresist
**Path**: `chummer/biowares/bioware/bonus/toxininhalationresist`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 33.3%
- **Boolean Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`
  - `1`
  - `2`
- **All Values**: 1, 2, Rating

### fatigueresist
**Path**: `chummer/biowares/bioware/bonus/fatigueresist`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 83.3%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `-2`
  - `-2`
  - `Rating`
  - `1`
  - `-1`
- **All Values**: -1, -2, 1, Rating

### blocksmounts
**Path**: `chummer/biowares/bioware/blocksmounts`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 14-20 characters
- **Examples**:
  - `wrist,elbow,shoulder`
  - `wrist,elbow,shoulder`
  - `ankle,knee,hip`
  - `ankle,knee,hip`
  - `wrist,elbow,shoulder`
- **All Values**: ankle,knee,hip, wrist,elbow,shoulder

### pathogencontactresist
**Path**: `chummer/biowares/bioware/bonus/pathogencontactresist`

- **Count**: 5
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

### pathogeningestionresist
**Path**: `chummer/biowares/bioware/bonus/pathogeningestionresist`

- **Count**: 5
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

### pathogeninhalationresist
**Path**: `chummer/biowares/bioware/bonus/pathogeninhalationresist`

- **Count**: 5
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

### pathogeninjectionresist
**Path**: `chummer/biowares/bioware/bonus/pathogeninjectionresist`

- **Count**: 5
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
**Path**: `chummer/biowares/bioware/bonus/skillgroup/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-9 characters
- **Examples**:
  - `Athletics`
  - `Acting`
  - `Influence`
  - `Athletics`
  - `Athletics`
- **All Values**: Acting, Athletics, Influence

### bonus
**Path**: `chummer/biowares/bioware/bonus/skillgroup/bonus`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 20.0%
- **Boolean Ratio**: 20.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`
  - `1`
  - `Rating`
- **All Values**: 1, Rating

### stuncmrecovery
**Path**: `chummer/biowares/bioware/bonus/stuncmrecovery`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 75.0%
- **Boolean Ratio**: 75.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `1`
  - `1`
  - `1`
- **All Values**: 1, Rating

### physicalcmrecovery
**Path**: `chummer/biowares/bioware/bonus/physicalcmrecovery`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 75.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `1`
  - `1`
  - `2`
- **All Values**: 1, 2, Rating

### initiativepass
**Path**: `chummer/biowares/bioware/bonus/initiativepass`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 50.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `1`
  - `1`
  - `Rating`
- **All Values**: 1, Rating

### toxininjectionresist
**Path**: `chummer/biowares/bioware/bonus/toxininjectionresist`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 25.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `1`
  - `Rating`
- **All Values**: 1, Rating

### category
**Path**: `chummer/biowares/bioware/allowsubsystems/category`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 28-28 characters
- **Examples**:
  - `Chemical Gland Modifications`
  - `Chemical Gland Modifications`
  - `Chemical Gland Modifications`
  - `Chemical Gland Modifications`

### physiologicaladdictionfirsttime
**Path**: `chummer/biowares/bioware/bonus/physiologicaladdictionfirsttime`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 50.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `-2`
  - `1`
  - `Rating`
- **All Values**: -2, 1, Rating

### psychologicaladdictionfirsttime
**Path**: `chummer/biowares/bioware/bonus/psychologicaladdictionfirsttime`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 50.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `-2`
  - `1`
  - `Rating`
- **All Values**: -2, 1, Rating

### physiologicaladdictionalreadyaddicted
**Path**: `chummer/biowares/bioware/bonus/physiologicaladdictionalreadyaddicted`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 50.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `2`
  - `1`
  - `Rating`
- **All Values**: 1, 2, Rating

### psychologicaladdictionalreadyaddicted
**Path**: `chummer/biowares/bioware/bonus/psychologicaladdictionalreadyaddicted`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 50.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `2`
  - `1`
  - `Rating`
- **All Values**: 1, 2, Rating

### memory
**Path**: `chummer/biowares/bioware/bonus/memory`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `2`
  - `Rating`
- **All Values**: 2, Rating

### armor
**Path**: `chummer/biowares/bioware/bonus/armor`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 2-6 characters
- **Examples**:
  - `Rating`
  - `-1`
  - `Rating`
- **All Values**: -1, Rating

### val
**Path**: `chummer/biowares/bioware/bonus/selectskill/val`

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

### electricityarmor
**Path**: `chummer/biowares/bioware/bonus/electricityarmor`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-2`
  - `1`
- **All Values**: -2, 1, 2

### reach
**Path**: `chummer/biowares/bioware/pairbonus/reach`

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

### cyberware
**Path**: `chummer/biowares/bioware/required/oneof/cyberware`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-18 characters
- **Examples**:
  - `Control Rig`
  - `Reaction Enhancers`
  - `Wired Reflexes`
- **All Values**: Control Rig, Reaction Enhancers, Wired Reflexes

### unarmeddv
**Path**: `chummer/biowares/bioware/bonus/unarmeddv`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-10 characters
- **Examples**:
  - `Rating-1`
  - `Rating*0.5`
- **All Values**: Rating*0.5, Rating-1

### sharedthresholdoffset
**Path**: `chummer/biowares/bioware/bonus/conditionmonitor/sharedthresholdoffset`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### physicallimit
**Path**: `chummer/biowares/bioware/bonus/physicallimit`

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

### mentallimit
**Path**: `chummer/biowares/bioware/bonus/mentallimit`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### sociallimit
**Path**: `chummer/biowares/bioware/bonus/sociallimit`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### condition
**Path**: `chummer/biowares/bioware/bonus/skillgroup/condition`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 24-24 characters
- **Examples**:
  - `People who can smell you`
  - `People who can smell you`

### firearmor
**Path**: `chummer/biowares/bioware/bonus/firearmor`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`

### coldarmor
**Path**: `chummer/biowares/bioware/bonus/coldarmor`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`

### val
**Path**: `chummer/biowares/bioware/pairbonus/walkmultiplier/val`

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

### category
**Path**: `chummer/biowares/bioware/pairbonus/walkmultiplier/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Swim`
  - `Swim`

### metatype
**Path**: `chummer/biowares/bioware/required/oneof/metatype`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-5 characters
- **Examples**:
  - `Troll`
  - `Ork`
- **All Values**: Ork, Troll

### unarmeddv
**Path**: `chummer/biowares/bioware/pairbonus/unarmeddv`

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

### name
**Path**: `chummer/biowares/bioware/pairinclude/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 22-23 characters
- **Examples**:
  - `Striking Callus (Feet)`
  - `Striking Callus (Hands)`
- **All Values**: Striking Callus (Feet), Striking Callus (Hands)

### metatype
**Path**: `chummer/biowares/bioware/required/allof/metatype`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `Ork`
  - `Ork`

### addquality
**Path**: `chummer/biowares/bioware/bonus/addqualities/addquality`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: string
- **Length Range**: 19-50 characters
- **Examples**:
  - `Photographic Memory`
  - `Poor Self Control (Thrill Seeker) (Dareadrenaline)`

### name
**Path**: `chummer/biowares/bioware/bonus/skilllinkedattribute/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `LOG`
  - `INT`
- **All Values**: INT, LOG

### bonus
**Path**: `chummer/biowares/bioware/bonus/skilllinkedattribute/bonus`

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

### dodge
**Path**: `chummer/biowares/bioware/bonus/dodge`

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

### initiative
**Path**: `chummer/biowares/bioware/bonus/initiative`

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

### damageresistance
**Path**: `chummer/biowares/bioware/bonus/damageresistance`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### unarmedreach
**Path**: `chummer/biowares/bioware/bonus/unarmedreach`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### unarmedreach
**Path**: `chummer/biowares/bioware/pairbonus/unarmedreach`

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
**Path**: `chummer/biowares/bioware/bonus/weaponaccuracy/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 15-15 characters
- **Examples**:
  - `[contains]Fangs`

### value
**Path**: `chummer/biowares/bioware/bonus/weaponaccuracy/value`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### applytorating
**Path**: `chummer/biowares/bioware/bonus/selectskill/applytorating`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`

### name
**Path**: `chummer/biowares/bioware/bonus/attributekarmacost/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `STR`

### val
**Path**: `chummer/biowares/bioware/bonus/attributekarmacost/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-2`

### composure
**Path**: `chummer/biowares/bioware/bonus/composure`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### judgeintentionsdefense
**Path**: `chummer/biowares/bioware/bonus/judgeintentionsdefense`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### drainresist
**Path**: `chummer/biowares/bioware/bonus/drainresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### fadingresist
**Path**: `chummer/biowares/bioware/bonus/fadingresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### directmanaspellresist
**Path**: `chummer/biowares/bioware/bonus/directmanaspellresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### detectionspellresist
**Path**: `chummer/biowares/bioware/bonus/detectionspellresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### manaillusionresist
**Path**: `chummer/biowares/bioware/bonus/manaillusionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### mentalmanipulationresist
**Path**: `chummer/biowares/bioware/bonus/mentalmanipulationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### decreasebodresist
**Path**: `chummer/biowares/bioware/bonus/decreasebodresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### decreaseagiresist
**Path**: `chummer/biowares/bioware/bonus/decreaseagiresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### decreaserearesist
**Path**: `chummer/biowares/bioware/bonus/decreaserearesist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### decreasestrresist
**Path**: `chummer/biowares/bioware/bonus/decreasestrresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### decreasecharesist
**Path**: `chummer/biowares/bioware/bonus/decreasecharesist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### decreaseintresist
**Path**: `chummer/biowares/bioware/bonus/decreaseintresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### decreaselogresist
**Path**: `chummer/biowares/bioware/bonus/decreaselogresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### decreasewilresist
**Path**: `chummer/biowares/bioware/bonus/decreasewilresist`

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
**Path**: `chummer/biowares/bioware/bonus/skillattribute/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `WIL`

### bonus
**Path**: `chummer/biowares/bioware/bonus/skillattribute/bonus`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### condition
**Path**: `chummer/biowares/bioware/bonus/specificskill/condition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Visual`

### radiationresist
**Path**: `chummer/biowares/bioware/bonus/radiationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

## Attributes

### category@blackmarket
**Path**: `chummer/categories/category@blackmarket`

- **Count**: 16
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Bioware`
  - `Bioware`
  - `Bioware`
  - `Bioware`
  - `Bioware`
- **All Values**: Bioware, Geneware

### bonus@unique
**Path**: `chummer/biowares/bioware/bonus@unique`

- **Count**: 12
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `muscle`
  - `muscle`
  - `microadaptation`
  - `microadaptation`
  - `microadaptation`
- **All Values**: microadaptation, muscle

### initiativepass@precedence
**Path**: `chummer/biowares/bioware/bonus/initiativepass@precedence`

- **Count**: 4
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`

### reach@name
**Path**: `chummer/biowares/bioware/pairbonus/reach@name`

- **Count**: 3
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Retractable Claws (Bio-Weapon)`
  - `Claws (Bio-Weapon)`
  - `Retractable Claws (Bio-Weapon)`
- **All Values**: Claws (Bio-Weapon), Retractable Claws (Bio-Weapon)

### armor@group
**Path**: `chummer/biowares/bioware/bonus/armor@group`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`

### selectskill@limittoattribute
**Path**: `chummer/biowares/bioware/bonus/selectskill@limittoattribute`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `BOD,AGI,REA,STR`
  - `BOD,AGI,REA,STR`

### specificattribute@precedence
**Path**: `chummer/biowares/bioware/bonus/specificattribute@precedence`

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
  - `http://www.w3.org/2001/XMLSchema bioware.xsd`

### selectskill@maximumrating
**Path**: `chummer/biowares/bioware/bonus/selectskill@maximumrating`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `0`

### selectskill@knowledgeskills
**Path**: `chummer/biowares/bioware/bonus/selectskill@knowledgeskills`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

### initiative@precedence
**Path**: `chummer/biowares/bioware/bonus/initiative@precedence`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `0`

### selecttext@xml
**Path**: `chummer/biowares/bioware/bonus/selecttext@xml`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `metatypes.xml`

### selecttext@xpath
**Path**: `chummer/biowares/bioware/bonus/selecttext@xpath`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `/chummer/metatypes/metatype \| /chummer/metatypes/metatype/metavariants/metavariant`

### selecttext@allowedit
**Path**: `chummer/biowares/bioware/bonus/selecttext@allowedit`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

## Type Improvement Recommendations

### Enum Candidates
- **id** (`chummer/grades/grade/id`): 9 unique values
  - Values: 0c86e85c-7e3e-4b6f-aa4b-26d8b379a7c9, 2b599ecd-4e80-4669-a78e-4db232c80a83, 9166244c-440b-44a1-8795-4917b53e6101, 9e24f0ce-b41e-496f-844a-82805fcb65a9, a6fba72c-9fbe-41dc-8310-cd047b50c81e, c2c6a3cc-c4bf-42c8-9260-868fd44d34ce, c4bbffe4-5818-4055-bc5e-f44562bde855, ee71d4f8-0fd0-4992-8b4e-70ef4dfbcce1, f0a67dc0-6b0a-43fa-b389-a110ba1dd59d
- **name** (`chummer/grades/grade/name`): 9 unique values
  - Values: Alphaware, Betaware, Deltaware, Gammaware, None, Omegaware, Standard, Standard (Burnout's Way), Used
- **ess** (`chummer/grades/grade/ess`): 6 unique values
  - Values: 0.4, 0.5, 0.7, 0.8, 1, 1.25
- **cost** (`chummer/grades/grade/cost`): 6 unique values
  - Values: 0.75, 1, 1.2, 1.5, 2.5, 5
- **avail** (`chummer/grades/grade/avail`): 6 unique values
  - Values: +12, +2, +4, +8, -4, 0
- **source** (`chummer/grades/grade/source`): 3 unique values
  - Values: CF, SG, SR5
- **page** (`chummer/grades/grade/page`): 5 unique values
  - Values: 1, 177, 451, 71, 72
- **category** (`chummer/categories/category`): 16 unique values
  - Values: Basic, Bio-Weapons, Biosculpting, Chemical Gland Modifications, Complimentary Genetics, Cosmetic Bioware, Cultured, Environmental Microadaptation, Exotic Metagenetics, Genetic Restoration, Immunization, Orthoskin Upgrades, Phenotype Adjustment, Symbionts, Transgenic Alteration, Transgenics
- **category** (`chummer/biowares/bioware/category`): 16 unique values
  - Values: Basic, Bio-Weapons, Biosculpting, Chemical Gland Modifications, Complimentary Genetics, Cosmetic Bioware, Cultured, Environmental Microadaptation, Exotic Metagenetics, Genetic Restoration, Immunization, Orthoskin Upgrades, Phenotype Adjustment, Symbionts, Transgenic Alteration, Transgenics
- **ess** (`chummer/biowares/bioware/ess`): 27 unique values
  - Values: (Rating)*0.5, -0.1, 0, 0.02, 0.05*Rating, 0.1, 0.1*Rating, 0.15*Rating, 0.2*Rating, 0.25, 0.3, 0.5, 0.7, 1, FixedValues(0,0.01,0.02), Rating * 0.05, Rating * 0.2, Rating * 0.25, Rating * 0.3, Rating * 0.75
- **avail** (`chummer/biowares/bioware/avail`): 48 unique values
  - Values: (Rating * 3)F, (Rating * 4)R, (Rating * 5)R, (Rating * 6)R, (Rating*3)R, 10, 11, 12, 13, 16, 16F, 18F, 6F, 7F, 8, 8F, 8R, FixedValues(4,5,6), Rating * 2, Rating * 3
- **rating** (`chummer/biowares/bioware/rating`): 6 unique values
  - Values: 12, 2, 20, 3, 4, 6
- **source** (`chummer/biowares/bioware/source`): 7 unique values
  - Values: 2050, CF, DTR, HT, KC, NF, SR5
- **page** (`chummer/biowares/bioware/page`): 33 unique values
  - Values: 110, 112, 114, 115, 116, 119, 120, 123, 158, 160, 161, 163, 165, 175, 205, 206, 459, 460, 461, 67
- **unarmeddv** (`chummer/biowares/bioware/bonus/unarmeddv`): 2 unique values
  - Values: Rating*0.5, Rating-1
- **cyberware** (`chummer/biowares/bioware/forbidden/oneof/cyberware`): 5 unique values
  - Values: Bone Lacing (Aluminum), Bone Lacing (Plastic), Bone Lacing (Titanium), Dermal Plating, Smart Articulation
- **grade** (`chummer/biowares/bioware/bannedgrades/grade`): 6 unique values
  - Values: Alphaware, Omegaware, Standard, Standard (Burnout's Way), Used, Used (Adapsin)
- **name** (`chummer/biowares/bioware/bonus/specificattribute/name`): 8 unique values
  - Values: AGI, BOD, CHA, INT, LOG, REA, STR, WIL
- **val** (`chummer/biowares/bioware/bonus/specificattribute/val`): 2 unique values
  - Values: 1, Rating
- **name** (`chummer/biowares/bioware/bonus/specificskill/name`): 4 unique values
  - Values: Escape Artist, Gymnastics, Navigation, Perception
- **bonus** (`chummer/biowares/bioware/bonus/specificskill/bonus`): 3 unique values
  - Values: 1, 2, 3
- **bioware** (`chummer/biowares/bioware/forbidden/oneof/bioware`): 8 unique values
  - Values: Bone Density Augmentation, Chemical Gland (Spitter), Cold Adaptation, Elastic Joints, Electroshock, Enhanced Articulation, Heat Adaptation, Insulation
- **memory** (`chummer/biowares/bioware/bonus/memory`): 2 unique values
  - Values: 2, Rating
- **name** (`chummer/biowares/bioware/bonus/skillcategory/name`): 5 unique values
  - Values: Academic, Interest, Language, Professional, Street
- **disablequality** (`chummer/biowares/bioware/bonus/disablequality`): 2 unique values
  - Values: 3564b678-7721-4a8d-ac79-1600cf92dc14, Celerity
- **armor** (`chummer/biowares/bioware/bonus/armor`): 2 unique values
  - Values: -1, Rating
- **limit** (`chummer/biowares/bioware/limit`): 5 unique values
  - Values: 1, False, {BODUnaug}, {arm}, {leg}
- **lifestylecost** (`chummer/biowares/bioware/bonus/lifestylecost`): 3 unique values
  - Values: -10, 10, 25
- **stuncmrecovery** (`chummer/biowares/bioware/bonus/stuncmrecovery`): 2 unique values
  - Values: 1, Rating
- **physicalcmrecovery** (`chummer/biowares/bioware/bonus/physicalcmrecovery`): 3 unique values
  - Values: 1, 2, Rating
- **initiativepass** (`chummer/biowares/bioware/bonus/initiativepass`): 2 unique values
  - Values: 1, Rating
- **name** (`chummer/biowares/bioware/bonus/skillgroup/name`): 3 unique values
  - Values: Acting, Athletics, Influence
- **bonus** (`chummer/biowares/bioware/bonus/skillgroup/bonus`): 2 unique values
  - Values: 1, Rating
- **toxincontactresist** (`chummer/biowares/bioware/bonus/toxincontactresist`): 3 unique values
  - Values: 1, 2, Rating
- **toxiningestionresist** (`chummer/biowares/bioware/bonus/toxiningestionresist`): 3 unique values
  - Values: 1, 2, Rating
- **toxininhalationresist** (`chummer/biowares/bioware/bonus/toxininhalationresist`): 3 unique values
  - Values: 1, 2, Rating
- **toxininjectionresist** (`chummer/biowares/bioware/bonus/toxininjectionresist`): 2 unique values
  - Values: 1, Rating
- **gearcategory** (`chummer/biowares/bioware/allowgear/gearcategory`): 5 unique values
  - Values: Chemicals, Custom, Custom Drug, Drugs, Toxins
- **fatigueresist** (`chummer/biowares/bioware/bonus/fatigueresist`): 4 unique values
  - Values: -1, -2, 1, Rating
- **electricityarmor** (`chummer/biowares/bioware/bonus/electricityarmor`): 3 unique values
  - Values: -2, 1, 2
- **limit** (`chummer/biowares/bioware/bonus/limitmodifier/limit`): 2 unique values
  - Values: Physical, Social
- **value** (`chummer/biowares/bioware/bonus/limitmodifier/value`): 3 unique values
  - Values: 1, 2, Rating
- **condition** (`chummer/biowares/bioware/bonus/limitmodifier/condition`): 6 unique values
  - Values: LimitCondition_SkillGroupStealthNaked, LimitCondition_SkillsActiveEscapeArtist, LimitCondition_SkillsActiveLeadership, LimitCondition_SkillsActivePerformanceSinging, LimitCondition_SkillsActiveSwimming, LimitCondition_TestSpeech
- **physiologicaladdictionfirsttime** (`chummer/biowares/bioware/bonus/physiologicaladdictionfirsttime`): 3 unique values
  - Values: -2, 1, Rating
- **psychologicaladdictionfirsttime** (`chummer/biowares/bioware/bonus/psychologicaladdictionfirsttime`): 3 unique values
  - Values: -2, 1, Rating
- **physiologicaladdictionalreadyaddicted** (`chummer/biowares/bioware/bonus/physiologicaladdictionalreadyaddicted`): 3 unique values
  - Values: 1, 2, Rating
- **psychologicaladdictionalreadyaddicted** (`chummer/biowares/bioware/bonus/psychologicaladdictionalreadyaddicted`): 3 unique values
  - Values: 1, 2, Rating
- **max** (`chummer/biowares/bioware/bonus/specificattribute/max`): 2 unique values
  - Values: 1, Rating
- **metatype** (`chummer/biowares/bioware/required/oneof/metatype`): 2 unique values
  - Values: Ork, Troll
- **addweapon** (`chummer/biowares/bioware/addweapon`): 13 unique values
  - Values: Bone Spike I, Bone Spike II, Bone Spike III, Claws (Bio-Weapon), Electrical Discharge, Fangs (Bio-Weapon), Horns (Bio-Weapon), Large Stinger, Large Tusk(s), Medium Stinger, Medium Tusk(s), Retractable Claws (Bio-Weapon), Retractable Fangs (Bio-Weapon)
- **blocksmounts** (`chummer/biowares/bioware/blocksmounts`): 2 unique values
  - Values: ankle,knee,hip, wrist,elbow,shoulder
- **name** (`chummer/biowares/bioware/pairinclude/name`): 2 unique values
  - Values: Striking Callus (Feet), Striking Callus (Hands)
- **name** (`chummer/biowares/bioware/bonus/skilllinkedattribute/name`): 2 unique values
  - Values: INT, LOG
- **dodge** (`chummer/biowares/bioware/bonus/dodge`): 2 unique values
  - Values: 1, 2
- **cyberware** (`chummer/biowares/bioware/required/oneof/cyberware`): 3 unique values
  - Values: Control Rig, Reaction Enhancers, Wired Reflexes

### Numeric Type Candidates
- **devicerating** (`chummer/grades/grade/devicerating`): 100.0% numeric
  - Examples: 0, 0, 0
- **capacity** (`chummer/biowares/bioware/capacity`): 100.0% numeric
  - Examples: 0, 0, 0
- **physicallimit** (`chummer/biowares/bioware/bonus/physicallimit`): 100.0% numeric
  - Examples: 1, 1
- **val** (`chummer/biowares/bioware/bonus/selectskill/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **firearmor** (`chummer/biowares/bioware/bonus/firearmor`): 100.0% numeric
  - Examples: 2, 2
- **coldarmor** (`chummer/biowares/bioware/bonus/coldarmor`): 100.0% numeric
  - Examples: 2, 2
- **unarmedreach** (`chummer/biowares/bioware/bonus/unarmedreach`): 100.0% numeric
  - Examples: 1
- **val** (`chummer/biowares/bioware/pairbonus/walkmultiplier/val`): 100.0% numeric
  - Examples: 1, 1
- **unarmedreach** (`chummer/biowares/bioware/pairbonus/unarmedreach`): 100.0% numeric
  - Examples: 1
- **reach** (`chummer/biowares/bioware/pairbonus/reach`): 100.0% numeric
  - Examples: 1, 1, 1
- **unarmeddv** (`chummer/biowares/bioware/pairbonus/unarmeddv`): 100.0% numeric
  - Examples: 1, 1
- **value** (`chummer/biowares/bioware/bonus/weaponaccuracy/value`): 100.0% numeric
  - Examples: 2
- **val** (`chummer/biowares/bioware/bonus/attributekarmacost/val`): 100.0% numeric
  - Examples: -2
- **composure** (`chummer/biowares/bioware/bonus/composure`): 100.0% numeric
  - Examples: 1
- **judgeintentionsdefense** (`chummer/biowares/bioware/bonus/judgeintentionsdefense`): 100.0% numeric
  - Examples: 1
- **drainresist** (`chummer/biowares/bioware/bonus/drainresist`): 100.0% numeric
  - Examples: 1
- **fadingresist** (`chummer/biowares/bioware/bonus/fadingresist`): 100.0% numeric
  - Examples: 1
- **directmanaspellresist** (`chummer/biowares/bioware/bonus/directmanaspellresist`): 100.0% numeric
  - Examples: 1
- **detectionspellresist** (`chummer/biowares/bioware/bonus/detectionspellresist`): 100.0% numeric
  - Examples: 1
- **manaillusionresist** (`chummer/biowares/bioware/bonus/manaillusionresist`): 100.0% numeric
  - Examples: 1
- **mentalmanipulationresist** (`chummer/biowares/bioware/bonus/mentalmanipulationresist`): 100.0% numeric
  - Examples: 1
- **decreasebodresist** (`chummer/biowares/bioware/bonus/decreasebodresist`): 100.0% numeric
  - Examples: 1
- **decreaseagiresist** (`chummer/biowares/bioware/bonus/decreaseagiresist`): 100.0% numeric
  - Examples: 1
- **decreaserearesist** (`chummer/biowares/bioware/bonus/decreaserearesist`): 100.0% numeric
  - Examples: 1
- **decreasestrresist** (`chummer/biowares/bioware/bonus/decreasestrresist`): 100.0% numeric
  - Examples: 1
- **decreasecharesist** (`chummer/biowares/bioware/bonus/decreasecharesist`): 100.0% numeric
  - Examples: 1
- **decreaseintresist** (`chummer/biowares/bioware/bonus/decreaseintresist`): 100.0% numeric
  - Examples: 1
- **decreaselogresist** (`chummer/biowares/bioware/bonus/decreaselogresist`): 100.0% numeric
  - Examples: 1
- **decreasewilresist** (`chummer/biowares/bioware/bonus/decreasewilresist`): 100.0% numeric
  - Examples: 1
- **bonus** (`chummer/biowares/bioware/bonus/skillattribute/bonus`): 100.0% numeric
  - Examples: 1
- **bonus** (`chummer/biowares/bioware/bonus/skilllinkedattribute/bonus`): 100.0% numeric
  - Examples: 1, 1
- **initiative** (`chummer/biowares/bioware/bonus/initiative`): 100.0% numeric
  - Examples: 1, 1
- **radiationresist** (`chummer/biowares/bioware/bonus/radiationresist`): 100.0% numeric
  - Examples: 2

### Boolean Type Candidates
- **applytorating** (`chummer/biowares/bioware/bonus/selectskill/applytorating`): 100.0% boolean
  - Examples: True
