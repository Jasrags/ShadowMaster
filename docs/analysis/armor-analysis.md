# Analysis Report: armor.xml

**File**: `data\chummerxml\armor.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 3725
- **Unique Fields**: 62
- **Unique Attributes**: 8
- **Unique Element Types**: 93

## Fields

### id
**Path**: `chummer/armors/armor/id`

- **Count**: 202
- **Presence Rate**: 100.0%
- **Unique Values**: 202
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `31c68476-6328-476a-ae8a-94f65d505a04`
  - `5a650844-8f24-48e7-829f-0443d9ff5cf7`
  - `40826eaa-c22a-43da-8730-bc1867ea65a1`
  - `36a4cd30-c32c-44d0-847a-0c15fb51072a`
  - `4ad1eeab-daf3-4495-a73d-fbb0ce89be5b`

### name
**Path**: `chummer/armors/armor/name`

- **Count**: 202
- **Presence Rate**: 100.0%
- **Unique Values**: 202
- **Type Patterns**: string
- **Length Range**: 3-47 characters
- **Examples**:
  - `Clothing`
  - `Actioneer Business Clothes`
  - `Armor Clothing`
  - `Armor Jacket`
  - `Armor Vest`

### category
**Path**: `chummer/armors/armor/category`

- **Count**: 202
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-27 characters
- **Examples**:
  - `Clothing`
  - `Armor`
  - `Armor`
  - `Armor`
  - `Armor`
- **All Values**: Armor, Cloaks, Clothing, High-Fashion Armor Clothing, Specialty Armor

### armor
**Path**: `chummer/armors/armor/armor`

- **Count**: 202
- **Presence Rate**: 100.0%
- **Unique Values**: 24
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 99.5%
- **Boolean Ratio**: 29.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `0`
  - `8`
  - `6`
  - `12`
  - `9`
- **All Values**: +1, +10, +3, +4, +6, 0, 1, 10, 12, 13, 14, 15, 16, 20, 3, 4, 6, 8, 9, Rating

### armorcapacity
**Path**: `chummer/armors/armor/armorcapacity`

- **Count**: 202
- **Presence Rate**: 100.0%
- **Unique Values**: 17
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 98.5%
- **Boolean Ratio**: 31.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `0`
  - `8`
  - `6`
  - `12`
  - `9`
- **All Values**: 0, 1, 10, 12, 14, 15, 16, 18, 2, 20, 3, 4, 5, 6, 8, 9, Rating

### avail
**Path**: `chummer/armors/armor/avail`

- **Count**: 202
- **Presence Rate**: 100.0%
- **Unique Values**: 32
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 85.6%
- **Boolean Ratio**: 26.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `0`
  - `8`
  - `2`
  - `2`
  - `4`

### cost
**Path**: `chummer/armors/armor/cost`

- **Count**: 202
- **Presence Rate**: 100.0%
- **Unique Values**: 73
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 97.0%
- **Length Range**: 1-21 characters
- **Examples**:
  - `Variable(20-100000)`
  - `1500`
  - `450`
  - `1000`
  - `500`

### source
**Path**: `chummer/armors/armor/source`

- **Count**: 202
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 7.4%
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: 2050, BB, CA, HAMG, HS, HT, KC, NF, RF, RG, SAG, SL, SR5, TCT

### page
**Path**: `chummer/armors/armor/page`

- **Count**: 202
- **Presence Rate**: 100.0%
- **Unique Values**: 41
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `437`
  - `437`
  - `437`
  - `437`
  - `437`

### name
**Path**: `chummer/armors/armor/mods/name`

- **Count**: 138
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-35 characters
- **Examples**:
  - `Custom Fit`
  - `Concealability`
  - `Custom Fit`
  - `Concealability`
  - `Custom Fit`
- **All Values**: Chemical Protection, Chemical Seal, Concealability, Custom Fit, Custom Fit (Stack), Drag Handle, Fire Resistance, Gear Access, Insulation, Internal Air Tank (5 Minutes), Micro-Hardpoint, Newest Model, Padded, Pantheon Armored Shell, Pantheon Quick-Charge Battery Pack, Parachute (Urban Explorer Daedalus), Radiation Shielding, Restrictive, Ruthenium Polymer Coating, Thermal Damping

### id
**Path**: `chummer/mods/mod/id`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 70
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `9ee8e6ad-2472-485d-ae42-d1978749b456`
  - `3fdd4706-9052-4c6b-8c2c-61dbb5c1f16f`
  - `142031f9-ab13-4dd0-a5a4-2cc4d06055ea`
  - `480b7c5d-758b-4833-8bfd-9487e2455f7d`
  - `1e002d2e-cd93-4cef-a666-b6c6449f4e9f`

### name
**Path**: `chummer/mods/mod/name`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 70
- **Type Patterns**: string
- **Length Range**: 6-39 characters
- **Examples**:
  - `Electrochromic Clothing`
  - `Feedback Clothing`
  - `(Synth)Leather`
  - `Chemical Protection`
  - `Chemical Seal`

### category
**Path**: `chummer/mods/mod/category`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-35 characters
- **Examples**:
  - `General`
  - `General`
  - `Clothing`
  - `General`
  - `General`
- **All Values**: Clothing, Custom Liners (Rating 1), Custom Liners (Rating 2), Custom Liners (Rating 3), Custom Liners (Rating 4), Custom Liners (Rating 5), Custom Liners (Rating 6), Customized Ballistic Mask, Full Body Armor Mods, General, Nightshade IR, Rapid Transit Detailing, Urban Explorer Jumpsuit Accessories

### armor
**Path**: `chummer/mods/mod/armor`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 94.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `0`
  - `4`
  - `0`
  - `0`
- **All Values**: +2, +3, 0, 4

### maxrating
**Path**: `chummer/mods/mod/maxrating`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 84.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `6`
  - `1`
- **All Values**: 0, 1, 4, 6

### armorcapacity
**Path**: `chummer/mods/mod/armorcapacity`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-42 characters
- **Examples**:
  - `[0]`
  - `[3]`
  - `[0]`
  - `FixedValues([1],[2],[3],[4],[5],[6])`
  - `[6]`
- **All Values**: FixedValues([1],[2],[3],[4],[5],[6]), [-(Capacity * 0.5 + 0.5*(Capacity mod 2))], [0], [1], [2], [3], [4], [6], [Rating]

### avail
**Path**: `chummer/mods/mod/avail`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 84.3%
- **Boolean Ratio**: 55.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-30 characters
- **Examples**:
  - `+2`
  - `8`
  - `0`
  - `6`
  - `12R`
- **All Values**: +2, +3, +4, +6, +8R, 0, 10F, 10R, 12R, 14F, 14R, 16F, 4, 6, 6R, 7R, 8, FixedValues(6F,6F,6F,9F,9F,9F), Rating * 2

### cost
**Path**: `chummer/mods/mod/cost`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 25
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 82.9%
- **Boolean Ratio**: 45.7%
- **Length Range**: 1-84 characters
- **Examples**:
  - `500`
  - `500`
  - `200`
  - `Rating * 250`
  - `3000`

### source
**Path**: `chummer/mods/mod/source`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: BB, BTB, CA, HAMG, HT, KC, RG, SL, SR5

### page
**Path**: `chummer/mods/mod/page`

- **Count**: 70
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `437`
  - `437`
  - `437`
  - `437`
  - `437`
- **All Values**: 138, 156, 173, 185, 23, 437, 438, 48, 59, 62, 65, 73, 84, 85

### limit
**Path**: `chummer/armors/armor/bonus/limitmodifier/limit`

- **Count**: 59
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
**Path**: `chummer/armors/armor/bonus/limitmodifier/value`

- **Count**: 59
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 45.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `-1`
  - `-1`
  - `2`
  - `2`
- **All Values**: -1, 1, 2, 3

### condition
**Path**: `chummer/armors/armor/bonus/limitmodifier/condition`

- **Count**: 58
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 22-45 characters
- **Examples**:
  - `LimitCondition_SkillsActiveSneakingVisible`
  - `LimitCondition_ShieldPhysicalPenalty`
  - `LimitCondition_ShieldPhysicalPenalty`
  - `LimitCondition_Visible`
  - `LimitCondition_Visible`
- **All Values**: LimitCondition_BunkerGearVisible, LimitCondition_CorporationVisible, LimitCondition_ExcludeFansGangers, LimitCondition_ExcludeIntimidationVisible, LimitCondition_GangVisible, LimitCondition_IntimidationVisible, LimitCondition_PublicVisible, LimitCondition_ShieldPhysicalPenalty, LimitCondition_SkillsActiveGymnasticsClimbing, LimitCondition_SkillsActiveSneakingVisible, LimitCondition_SportsFans, LimitCondition_SportsRivals, LimitCondition_Visible

### usegear
**Path**: `chummer/armors/armor/gears/usegear`

- **Count**: 43
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-19 characters
- **Examples**:
  - `Concealable Holster`
  - `Biomonitor`
  - `Music Player`
  - `Holster`
  - `Holster`
- **All Values**: Biomonitor, Concealable Holster, Flare Compensation, Gas Mask, Grenade: Flash-Pak, Holster, Image Link, Low Light, Medkit, Music Player, Renraku Sensei

### name
**Path**: `chummer/armors/armor/wirelessbonus/skillcategory/name`

- **Count**: 20
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-13 characters
- **Examples**:
  - `Social Active`
  - `Social Active`
  - `Social Active`
  - `Social Active`
  - `Social Active`
- **All Values**: Social, Social Active

### bonus
**Path**: `chummer/armors/armor/wirelessbonus/skillcategory/bonus`

- **Count**: 20
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
**Path**: `chummer/modcategories/category`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-35 characters
- **Examples**:
  - `Customized Ballistic Mask`
  - `Full Body Armor Mods`
  - `General`
  - `Custom Liners (Rating 1)`
  - `Custom Liners (Rating 2)`
- **All Values**: Custom Liners (Rating 1), Custom Liners (Rating 2), Custom Liners (Rating 3), Custom Liners (Rating 4), Custom Liners (Rating 5), Custom Liners (Rating 6), Customized Ballistic Mask, Full Body Armor Mods, General, Nightshade IR, Rapid Transit Detailing, Urban Explorer Jumpsuit Accessories

### armoroverride
**Path**: `chummer/armors/armor/armoroverride`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `+3`
  - `+3`
  - `+4`
  - `+3`
  - `+2`
- **All Values**: +2, +3, +4

### limit
**Path**: `chummer/armors/armor/wirelessbonus/limitmodifier/limit`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-8 characters
- **Examples**:
  - `Social`
  - `Social`
  - `Social`
  - `Social`
  - `Social`
- **All Values**: Physical, Social

### value
**Path**: `chummer/armors/armor/wirelessbonus/limitmodifier/value`

- **Count**: 9
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
  - `1`
  - `1`
  - `2`
- **All Values**: 1, 2, 3

### condition
**Path**: `chummer/armors/armor/wirelessbonus/limitmodifier/condition`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 22-34 characters
- **Examples**:
  - `LimitCondition_Visible`
  - `LimitCondition_Visible`
  - `LimitCondition_Visible`
  - `LimitCondition_Visible`
  - `LimitCondition_Visible`
- **All Values**: LimitCondition_ClimbingTests, LimitCondition_IntimidationVisible, LimitCondition_Visible

### name
**Path**: `chummer/armors/armor/wirelessbonus/specificskill/name`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Survival`
  - `Survival`
  - `Survival`
  - `Survival`
  - `Survival`

### bonus
**Path**: `chummer/armors/armor/wirelessbonus/specificskill/bonus`

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

### addmodcategory
**Path**: `chummer/armors/armor/addmodcategory`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-35 characters
- **Examples**:
  - `Full Body Armor Mods`
  - `Urban Explorer Jumpsuit Accessories`
  - `Nightshade IR`
  - `Rapid Transit Detailing`
  - `Customized Ballistic Mask`
- **All Values**: Customized Ballistic Mask, Full Body Armor Mods, Nightshade IR, Rapid Transit Detailing, Urban Explorer Jumpsuit Accessories

### category
**Path**: `chummer/armors/armor/selectmodsfromcategory/category`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 24-24 characters
- **Examples**:
  - `Custom Liners (Rating 4)`
  - `Custom Liners (Rating 3)`
  - `Custom Liners (Rating 2)`
  - `Custom Liners (Rating 6)`
  - `Custom Liners (Rating 6)`
- **All Values**: Custom Liners (Rating 2), Custom Liners (Rating 3), Custom Liners (Rating 4), Custom Liners (Rating 6)

### toxincontactresist
**Path**: `chummer/mods/mod/bonus/toxincontactresist`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 85.7%
- **Boolean Ratio**: 14.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `6`
  - `5`
  - `4`
  - `3`
- **All Values**: 1, 2, 3, 4, 5, 6, Rating

### pathogencontactresist
**Path**: `chummer/mods/mod/bonus/pathogencontactresist`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 85.7%
- **Boolean Ratio**: 14.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `6`
  - `5`
  - `4`
  - `3`
- **All Values**: 1, 2, 3, 4, 5, 6, Rating

### coldarmor
**Path**: `chummer/mods/mod/bonus/coldarmor`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 85.7%
- **Boolean Ratio**: 14.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `6`
  - `5`
  - `4`
  - `3`
- **All Values**: 1, 2, 3, 4, 5, 6, Rating

### firearmor
**Path**: `chummer/mods/mod/bonus/firearmor`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 83.3%
- **Boolean Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `6`
  - `5`
  - `4`
  - `2`
- **All Values**: 1, 2, 4, 5, 6, Rating

### category
**Path**: `chummer/categories/category`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-27 characters
- **Examples**:
  - `Armor`
  - `Clothing`
  - `Cloaks`
  - `High-Fashion Armor Clothing`
  - `Specialty Armor`
- **All Values**: Armor, Cloaks, Clothing, High-Fashion Armor Clothing, Specialty Armor

### addoncategory
**Path**: `chummer/mods/mod/addoncategory`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-23 characters
- **Examples**:
  - `Drugs`
  - `Toxins`
  - `Cyberdecks`
  - `Commlinks`
  - `Rigger Command Consoles`
- **All Values**: Commlinks, Cyberdecks, Drugs, Rigger Command Consoles, Toxins

### addweapon
**Path**: `chummer/armors/armor/addweapon`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-21 characters
- **Examples**:
  - `Ballistic Shield`
  - `Riot Shield`
  - `Shiawase Arms Simoom`
  - `Ares Briefcase Shield`
- **All Values**: Ares Briefcase Shield, Ballistic Shield, Riot Shield, Shiawase Arms Simoom

### rating
**Path**: `chummer/armors/armor/rating`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `6`
  - `6`
  - `4`
  - `24`
- **All Values**: 24, 4, 6

### limit
**Path**: `chummer/mods/mod/bonus/limitmodifier/limit`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-8 characters
- **Examples**:
  - `Physical`
  - `Social`
  - `Social`
  - `Social`
- **All Values**: Physical, Social

### value
**Path**: `chummer/mods/mod/bonus/limitmodifier/value`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 75.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `Rating`
  - `1`
  - `2`
  - `3`
- **All Values**: 1, 2, 3, Rating

### condition
**Path**: `chummer/mods/mod/bonus/limitmodifier/condition`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 22-34 characters
- **Examples**:
  - `LimitCondition_TestSneakingThermal`
  - `LimitCondition_Visible`
  - `LimitCondition_Visible`
  - `LimitCondition_Visible`
- **All Values**: LimitCondition_TestSneakingThermal, LimitCondition_Visible

### gearcapacity
**Path**: `chummer/mods/mod/gearcapacity`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`
  - `6`
  - `1`
  - `1`
- **All Values**: 1, 6

### name
**Path**: `chummer/mods/mod/required/parentdetails/name`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 15-15 characters
- **Examples**:
  - `Full Body Armor`
  - `Full Body Armor`
  - `Full Body Armor`

### name
**Path**: `chummer/armors/armor/gears/usegear/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-28 characters
- **Examples**:
  - `Camera`
  - `Microphone, Omni-Directional`
- **All Values**: Camera, Microphone, Omni-Directional

### category
**Path**: `chummer/armors/armor/gears/usegear/category`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-14 characters
- **Examples**:
  - `Vision Devices`
  - `Audio Devices`
- **All Values**: Audio Devices, Vision Devices

### rating
**Path**: `chummer/armors/armor/gears/usegear/rating`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`

### capacity
**Path**: `chummer/armors/armor/gears/usegear/capacity`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `2/[0]`
  - `2/[0]`

### name
**Path**: `chummer/armors/armor/bonus/specificskill/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-12 characters
- **Examples**:
  - `Etiquette`
  - `Intimidation`
- **All Values**: Etiquette, Intimidation

### bonus
**Path**: `chummer/armors/armor/bonus/specificskill/bonus`

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

### fatigueresist
**Path**: `chummer/armors/armor/bonus/fatigueresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-2`

### sociallimit
**Path**: `chummer/armors/armor/bonus/sociallimit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### electricityarmor
**Path**: `chummer/mods/mod/bonus/electricityarmor`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### radiationresist
**Path**: `chummer/mods/mod/bonus/radiationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### limit
**Path**: `chummer/mods/mod/wirelessbonus/limitmodifier/limit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Mental`

### value
**Path**: `chummer/mods/mod/wirelessbonus/limitmodifier/value`

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
**Path**: `chummer/mods/mod/wirelessbonus/limitmodifier/condition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 37-37 characters
- **Examples**:
  - `LimitCondition_SkillsActivePerception`

### armormod
**Path**: `chummer/mods/mod/required/oneof/armormod`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 32-32 characters
- **Examples**:
  - `Responsive Interface Gear: Armor`

## Attributes

### name@rating
**Path**: `chummer/armors/armor/mods/name@rating`

- **Count**: 28
- **Unique Values**: 6
- **Enum Candidate**: Yes
- **Examples**:
  - `3`
  - `4`
  - `8`
  - `4`
  - `6`
- **All Values**: 2, 3, 4, 5, 6, 8

### bonus@unique
**Path**: `chummer/mods/mod/bonus@unique`

- **Count**: 21
- **Unique Values**: 4
- **Enum Candidate**: Yes
- **Examples**:
  - `chemicalprotection`
  - `fireresistance`
  - `insulation`
  - `nonconductivity`
  - `fireresistance`
- **All Values**: chemicalprotection, fireresistance, insulation, nonconductivity

### category@blackmarket
**Path**: `chummer/modcategories/category@blackmarket`

- **Count**: 12
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Armor`
  - `Armor`
  - `Armor,Electronics,Magic,Software`
  - `Armor`
  - `Armor`
- **All Values**: Armor, Armor,Electronics,Magic,Software

### category@blackmarket
**Path**: `chummer/categories/category@blackmarket`

- **Count**: 5
- **Unique Values**: 1
- **Examples**:
  - `Armor`
  - `Armor`
  - `Armor`
  - `Armor`
  - `Armor`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema armor.xsd`

### name@maxrating
**Path**: `chummer/armors/armor/mods/name@maxrating`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `8`

### usegear@rating
**Path**: `chummer/armors/armor/gears/usegear@rating`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `4`

### armormod@sameparent
**Path**: `chummer/mods/mod/required/oneof/armormod@sameparent`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 5 unique values
  - Values: Armor, Cloaks, Clothing, High-Fashion Armor Clothing, Specialty Armor
- **category** (`chummer/modcategories/category`): 12 unique values
  - Values: Custom Liners (Rating 1), Custom Liners (Rating 2), Custom Liners (Rating 3), Custom Liners (Rating 4), Custom Liners (Rating 5), Custom Liners (Rating 6), Customized Ballistic Mask, Full Body Armor Mods, General, Nightshade IR, Rapid Transit Detailing, Urban Explorer Jumpsuit Accessories
- **category** (`chummer/armors/armor/category`): 5 unique values
  - Values: Armor, Cloaks, Clothing, High-Fashion Armor Clothing, Specialty Armor
- **armor** (`chummer/armors/armor/armor`): 24 unique values
  - Values: +1, +10, +3, +4, +6, 0, 1, 10, 12, 13, 14, 15, 16, 20, 3, 4, 6, 8, 9, Rating
- **armorcapacity** (`chummer/armors/armor/armorcapacity`): 17 unique values
  - Values: 0, 1, 10, 12, 14, 15, 16, 18, 2, 20, 3, 4, 5, 6, 8, 9, Rating
- **avail** (`chummer/armors/armor/avail`): 32 unique values
  - Values: 0, 1, 10, 12, 14, 14R, 15, 16, 16F, 16R, 18F, 18R, 22F, 24, 24R, 30F, 8, 8F, 8R, 9
- **source** (`chummer/armors/armor/source`): 14 unique values
  - Values: 2050, BB, CA, HAMG, HS, HT, KC, NF, RF, RG, SAG, SL, SR5, TCT
- **page** (`chummer/armors/armor/page`): 41 unique values
  - Values: 173, 186, 253, 438, 57, 62, 63, 64, 65, 66, 69, 70, 71, 72, 78, 79, 81, 83, 91, 92
- **usegear** (`chummer/armors/armor/gears/usegear`): 11 unique values
  - Values: Biomonitor, Concealable Holster, Flare Compensation, Gas Mask, Grenade: Flash-Pak, Holster, Image Link, Low Light, Medkit, Music Player, Renraku Sensei
- **limit** (`chummer/armors/armor/bonus/limitmodifier/limit`): 2 unique values
  - Values: Physical, Social
- **value** (`chummer/armors/armor/bonus/limitmodifier/value`): 4 unique values
  - Values: -1, 1, 2, 3
- **condition** (`chummer/armors/armor/bonus/limitmodifier/condition`): 13 unique values
  - Values: LimitCondition_BunkerGearVisible, LimitCondition_CorporationVisible, LimitCondition_ExcludeFansGangers, LimitCondition_ExcludeIntimidationVisible, LimitCondition_GangVisible, LimitCondition_IntimidationVisible, LimitCondition_PublicVisible, LimitCondition_ShieldPhysicalPenalty, LimitCondition_SkillsActiveGymnasticsClimbing, LimitCondition_SkillsActiveSneakingVisible, LimitCondition_SportsFans, LimitCondition_SportsRivals, LimitCondition_Visible
- **addmodcategory** (`chummer/armors/armor/addmodcategory`): 5 unique values
  - Values: Customized Ballistic Mask, Full Body Armor Mods, Nightshade IR, Rapid Transit Detailing, Urban Explorer Jumpsuit Accessories
- **addweapon** (`chummer/armors/armor/addweapon`): 4 unique values
  - Values: Ares Briefcase Shield, Ballistic Shield, Riot Shield, Shiawase Arms Simoom
- **name** (`chummer/armors/armor/wirelessbonus/skillcategory/name`): 2 unique values
  - Values: Social, Social Active
- **name** (`chummer/armors/armor/mods/name`): 20 unique values
  - Values: Chemical Protection, Chemical Seal, Concealability, Custom Fit, Custom Fit (Stack), Drag Handle, Fire Resistance, Gear Access, Insulation, Internal Air Tank (5 Minutes), Micro-Hardpoint, Newest Model, Padded, Pantheon Armored Shell, Pantheon Quick-Charge Battery Pack, Parachute (Urban Explorer Daedalus), Radiation Shielding, Restrictive, Ruthenium Polymer Coating, Thermal Damping
- **armoroverride** (`chummer/armors/armor/armoroverride`): 3 unique values
  - Values: +2, +3, +4
- **limit** (`chummer/armors/armor/wirelessbonus/limitmodifier/limit`): 2 unique values
  - Values: Physical, Social
- **value** (`chummer/armors/armor/wirelessbonus/limitmodifier/value`): 3 unique values
  - Values: 1, 2, 3
- **condition** (`chummer/armors/armor/wirelessbonus/limitmodifier/condition`): 3 unique values
  - Values: LimitCondition_ClimbingTests, LimitCondition_IntimidationVisible, LimitCondition_Visible
- **category** (`chummer/armors/armor/selectmodsfromcategory/category`): 4 unique values
  - Values: Custom Liners (Rating 2), Custom Liners (Rating 3), Custom Liners (Rating 4), Custom Liners (Rating 6)
- **rating** (`chummer/armors/armor/rating`): 3 unique values
  - Values: 24, 4, 6
- **name** (`chummer/armors/armor/gears/usegear/name`): 2 unique values
  - Values: Camera, Microphone, Omni-Directional
- **category** (`chummer/armors/armor/gears/usegear/category`): 2 unique values
  - Values: Audio Devices, Vision Devices
- **name** (`chummer/armors/armor/bonus/specificskill/name`): 2 unique values
  - Values: Etiquette, Intimidation
- **category** (`chummer/mods/mod/category`): 13 unique values
  - Values: Clothing, Custom Liners (Rating 1), Custom Liners (Rating 2), Custom Liners (Rating 3), Custom Liners (Rating 4), Custom Liners (Rating 5), Custom Liners (Rating 6), Customized Ballistic Mask, Full Body Armor Mods, General, Nightshade IR, Rapid Transit Detailing, Urban Explorer Jumpsuit Accessories
- **armor** (`chummer/mods/mod/armor`): 4 unique values
  - Values: +2, +3, 0, 4
- **maxrating** (`chummer/mods/mod/maxrating`): 4 unique values
  - Values: 0, 1, 4, 6
- **armorcapacity** (`chummer/mods/mod/armorcapacity`): 9 unique values
  - Values: FixedValues([1],[2],[3],[4],[5],[6]), [-(Capacity * 0.5 + 0.5*(Capacity mod 2))], [0], [1], [2], [3], [4], [6], [Rating]
- **avail** (`chummer/mods/mod/avail`): 19 unique values
  - Values: +2, +3, +4, +6, +8R, 0, 10F, 10R, 12R, 14F, 14R, 16F, 4, 6, 6R, 7R, 8, FixedValues(6F,6F,6F,9F,9F,9F), Rating * 2
- **source** (`chummer/mods/mod/source`): 9 unique values
  - Values: BB, BTB, CA, HAMG, HT, KC, RG, SL, SR5
- **page** (`chummer/mods/mod/page`): 14 unique values
  - Values: 138, 156, 173, 185, 23, 437, 438, 48, 59, 62, 65, 73, 84, 85
- **toxincontactresist** (`chummer/mods/mod/bonus/toxincontactresist`): 7 unique values
  - Values: 1, 2, 3, 4, 5, 6, Rating
- **pathogencontactresist** (`chummer/mods/mod/bonus/pathogencontactresist`): 7 unique values
  - Values: 1, 2, 3, 4, 5, 6, Rating
- **firearmor** (`chummer/mods/mod/bonus/firearmor`): 6 unique values
  - Values: 1, 2, 4, 5, 6, Rating
- **coldarmor** (`chummer/mods/mod/bonus/coldarmor`): 7 unique values
  - Values: 1, 2, 3, 4, 5, 6, Rating
- **limit** (`chummer/mods/mod/bonus/limitmodifier/limit`): 2 unique values
  - Values: Physical, Social
- **value** (`chummer/mods/mod/bonus/limitmodifier/value`): 4 unique values
  - Values: 1, 2, 3, Rating
- **condition** (`chummer/mods/mod/bonus/limitmodifier/condition`): 2 unique values
  - Values: LimitCondition_TestSneakingThermal, LimitCondition_Visible
- **gearcapacity** (`chummer/mods/mod/gearcapacity`): 2 unique values
  - Values: 1, 6
- **addoncategory** (`chummer/mods/mod/addoncategory`): 5 unique values
  - Values: Commlinks, Cyberdecks, Drugs, Rigger Command Consoles, Toxins

### Numeric Type Candidates
- **cost** (`chummer/armors/armor/cost`): 97.0% numeric
  - Examples: Variable(20-100000), 1500, 450
- **bonus** (`chummer/armors/armor/wirelessbonus/skillcategory/bonus`): 100.0% numeric
  - Examples: 1, 1, 1
- **bonus** (`chummer/armors/armor/wirelessbonus/specificskill/bonus`): 100.0% numeric
  - Examples: 1, 1, 1
- **fatigueresist** (`chummer/armors/armor/bonus/fatigueresist`): 100.0% numeric
  - Examples: -2
- **rating** (`chummer/armors/armor/gears/usegear/rating`): 100.0% numeric
  - Examples: 2, 2
- **sociallimit** (`chummer/armors/armor/bonus/sociallimit`): 100.0% numeric
  - Examples: 1
- **bonus** (`chummer/armors/armor/bonus/specificskill/bonus`): 100.0% numeric
  - Examples: 1, 1
- **value** (`chummer/mods/mod/wirelessbonus/limitmodifier/value`): 100.0% numeric
  - Examples: 1
