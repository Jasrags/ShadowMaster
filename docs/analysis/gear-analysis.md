# Analysis Report: gear.xml

**File**: `data\chummerxml\gear.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 19345
- **Unique Fields**: 96
- **Unique Attributes**: 33
- **Unique Element Types**: 139

## Fields

### id
**Path**: `chummer/gears/gear/id`

- **Count**: 1598
- **Presence Rate**: 100.0%
- **Unique Values**: 1598
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `4d96ee55-0929-480e-923d-178e69675541`
  - `60ab05a7-2850-410c-9261-c5df6b5cddf1`
  - `39042c0a-4b22-4762-8d56-623033860178`
  - `0198f16e-8bb2-4618-ab2a-f010abe0a1c6`
  - `adef0fa4-67b7-41e1-b534-f15308c9c8c1`

### name
**Path**: `chummer/gears/gear/name`

- **Count**: 1598
- **Presence Rate**: 100.0%
- **Unique Values**: 1582
- **Type Patterns**: string
- **Length Range**: 2-69 characters
- **Examples**:
  - `Throwing Syringe`
  - `Seeker Shaft`
  - `Arrow: Monotip Head`
  - `Ammo: Depleted Uranium`
  - `Ammo: Silver`

### category
**Path**: `chummer/gears/gear/category`

- **Count**: 1598
- **Presence Rate**: 100.0%
- **Unique Values**: 75
- **Type Patterns**: string
- **Length Range**: 4-34 characters
- **Examples**:
  - `Ammunition`
  - `Ammunition`
  - `Ammunition`
  - `Ammunition`
  - `Ammunition`

### rating
**Path**: `chummer/gears/gear/rating`

- **Count**: 1598
- **Presence Rate**: 100.0%
- **Unique Values**: 21
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 99.4%
- **Boolean Ratio**: 76.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-15 characters
- **Examples**:
  - `0`
  - `0`
  - `12`
  - `0`
  - `0`
- **All Values**: 0, 1, 10, 100, 1000, 100000, 1000000, 12, 2, 20, 20000, 25, 3, 4, 5, 6, 7, 8, 99, {Parent Rating}

### source
**Path**: `chummer/gears/gear/source`

- **Count**: 1598
- **Presence Rate**: 100.0%
- **Unique Values**: 39
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 9.3%
- **Enum Candidate**: Yes
- **Length Range**: 2-8 characters
- **Examples**:
  - `HT`
  - `HT`
  - `HT`
  - `HT`
  - `HT`

### page
**Path**: `chummer/gears/gear/page`

- **Count**: 1598
- **Presence Rate**: 100.0%
- **Unique Values**: 183
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 0.1%
- **Length Range**: 1-3 characters
- **Examples**:
  - `183`
  - `187`
  - `187`
  - `189`
  - `189`

### avail
**Path**: `chummer/gears/gear/avail`

- **Count**: 1598
- **Presence Rate**: 100.0%
- **Unique Values**: 107
- **Type Patterns**: mixed_numeric, mixed_boolean
- **Numeric Ratio**: 50.6%
- **Boolean Ratio**: 30.4%
- **Length Range**: 1-33 characters
- **Examples**:
  - `6F`
  - `12F`
  - `8R`
  - `28F`
  - `12R`

### cost
**Path**: `chummer/gears/gear/cost`

- **Count**: 1598
- **Presence Rate**: 100.0%
- **Unique Values**: 297
- **Type Patterns**: mixed_numeric, mixed_boolean
- **Numeric Ratio**: 75.8%
- **Boolean Ratio**: 8.8%
- **Length Range**: 1-45 characters
- **Examples**:
  - `40`
  - `45`
  - `(Rating * 30)`
  - `1000`
  - `250`

### addoncategory
**Path**: `chummer/gears/gear/addoncategory`

- **Count**: 303
- **Presence Rate**: 100.0%
- **Unique Values**: 17
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-23 characters
- **Examples**:
  - `Drugs`
  - `Toxins`
  - `Custom`
  - `Drugs`
  - `Toxins`
- **All Values**: Audio Enhancements, Common Programs, Currency, Custom, Cyberdeck Modules, Cyberdecks, Drug Grades, Drugs, Electronic Modification, Hacking Programs, ID/Credsticks, Nanogear, Sensor Functions, Sensors, Tools of the Trade, Toxins, Vision Enhancements

### name
**Path**: `chummer/gears/gear/gears/usegear/name`

- **Count**: 263
- **Presence Rate**: 100.0%
- **Unique Values**: 45
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-36 characters
- **Examples**:
  - `Music Player`
  - `Micro Trid-Projector`
  - `Touchscreen Display`
  - `Camera, Micro`
  - `RFID Tag Scanner`

### category
**Path**: `chummer/gears/gear/gears/usegear/category`

- **Count**: 263
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-31 characters
- **Examples**:
  - `Electronics Accessories`
  - `Electronics Accessories`
  - `Electronics Accessories`
  - `Vision Devices`
  - `Electronics Accessories`
- **All Values**: Audio Devices, Commlink Accessories, Commlink/Cyberdeck Form Factors, Common Programs, Electronics Accessories, Hacking Programs, Sensor Functions, Sensors, Software, Survival Gear, Tools, Vision Devices, Vision Enhancements

### capacity
**Path**: `chummer/gears/gear/capacity`

- **Count**: 230
- **Presence Rate**: 100.0%
- **Unique Values**: 29
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 69.1%
- **Boolean Ratio**: 63.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-19 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 1, 1/[1], 1000000, 3, 5000, 500000, 8/[6], Rating, Rating/[1], [0.066666666666667], [0.1], [0.28571428571429], [0.2], [0.33333333333333], [0.5], [0.99009900990099], [1.1111111111111], [1.25], [Rating]

### ratinglabel
**Path**: `chummer/gears/gear/ratinglabel`

- **Count**: 204
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 12-20 characters
- **Examples**:
  - `Rating_Meters`
  - `Rating_Meters`
  - `Rating_Meters`
  - `String_Force`
  - `String_Force`
- **All Values**: Rating_Meters, Rating_SqMeters, String_Force, String_Force_Potency

### armorcapacity
**Path**: `chummer/gears/gear/armorcapacity`

- **Count**: 191
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 2.1%
- **Boolean Ratio**: 2.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-10 characters
- **Examples**:
  - `[2]`
  - `[2]`
  - `[2]`
  - `[2]`
  - `[2]`
- **All Values**: 0, Rating/[1], [0], [1], [2], [3], [4], [5], [6], [Rating]

### devicerating
**Path**: `chummer/gears/gear/devicerating`

- **Count**: 187
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 94.7%
- **Boolean Ratio**: 20.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-8 characters
- **Examples**:
  - `{RES}`
  - `Rating`
  - `1`
  - `2`
  - `3`
- **All Values**: 0, 1, 2, 3, 4, 5, 6, 7, 8, Rating, {RES}, {Rating}

### ammoforweapontype
**Path**: `chummer/gears/gear/ammoforweapontype`

- **Count**: 167
- **Presence Rate**: 100.0%
- **Unique Values**: 32
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-25 characters
- **Examples**:
  - `bow`
  - `gun`
  - `gun`
  - `gun`
  - `gun`

### costfor
**Path**: `chummer/gears/gear/costfor`

- **Count**: 132
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 28.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `10`
  - `10`
- **All Values**: 1, 10, 100, 2, 20, 3, 4, 5, 50, 6

### category
**Path**: `chummer/gears/gear/required/geardetails/OR/category`

- **Count**: 113
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-27 characters
- **Examples**:
  - `Commlinks`
  - `Custom`
  - `Commlinks`
  - `Custom`
  - `Custom`
- **All Values**: Armor, Cloaks, Clothing, Commlink, Commlinks, Custom, Cyberdecks, Cyberterminals, High-Fashion Armor Clothing, Sensors, Specialty Armor

### addweapon
**Path**: `chummer/gears/gear/addweapon`

- **Count**: 101
- **Presence Rate**: 100.0%
- **Unique Values**: 100
- **Type Patterns**: string
- **Length Range**: 3-54 characters
- **Examples**:
  - `Throwing Syringe`
  - `Throwing Knife`
  - `Shuriken`
  - `Electro-Net`
  - `Boomerang`

### dataprocessing
**Path**: `chummer/gears/gear/dataprocessing`

- **Count**: 98
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 98.0%
- **Boolean Ratio**: 19.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `{LOG}`
  - `Rating`
  - `1`
  - `2`
  - `3`
- **All Values**: 0, 1, 2, 3, 4, 5, 6, 7, 8, Rating, {LOG}

### firewall
**Path**: `chummer/gears/gear/firewall`

- **Count**: 98
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 98.0%
- **Boolean Ratio**: 15.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `{WIL}`
  - `Rating`
  - `1`
  - `2`
  - `3`
- **All Values**: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, Rating, {WIL}

### canformpersona
**Path**: `chummer/gears/gear/canformpersona`

- **Count**: 95
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-6 characters
- **Examples**:
  - `Self`
  - `Self`
  - `Self`
  - `Self`
  - `Self`
- **All Values**: Parent, Self

### programs
**Path**: `chummer/gears/gear/programs`

- **Count**: 85
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 97.6%
- **Boolean Ratio**: 17.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-10 characters
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `2`
  - `3`
- **All Values**: 1, 2, 3, 4, 5, 6, 8, Rating, {Rating}+2

### category
**Path**: `chummer/categories/category`

- **Count**: 76
- **Presence Rate**: 100.0%
- **Unique Values**: 76
- **Type Patterns**: string
- **Length Range**: 4-34 characters
- **Examples**:
  - `Alchemical Tools`
  - `Alchemical Preperations`
  - `Ammunition`
  - `Animals`
  - `Armor Enhancements`

### allowrename
**Path**: `chummer/gears/gear/allowrename`

- **Count**: 65
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### quality
**Path**: `chummer/gears/gear/required/oneof/quality`

- **Count**: 64
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Mentor Spirit`
  - `Mentor Spirit`
  - `Mentor Spirit`
  - `Mentor Spirit`
  - `Mentor Spirit`

### minrating
**Path**: `chummer/gears/gear/minrating`

- **Count**: 57
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 5.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `5`
  - `3`
  - `6`
  - `5`
  - `6`
- **All Values**: 1, 12, 2, 3, 4, 5, 6

### rating
**Path**: `chummer/gears/gear/gears/usegear/rating`

- **Count**: 56
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 89.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`
- **All Values**: 1, 2, 3

### name
**Path**: `chummer/gears/gear/required/geardetails/OR/name`

- **Count**: 56
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-26 characters
- **Examples**:
  - `Fuchi Cyber-N`
  - `Fuchi Cyber-Ex`
  - `Fuchi Cyber-N`
  - `Fuchi Cyber-Ex`
  - `Fuchi Cyber-N`
- **All Values**: Add Attack Modification, Add Sleaze Modification, Camera, Contacts, Credstick, Fake (2050), Credstick, Standard (2050), Fake SIN, Fuchi Cyber-Ex, Fuchi Cyber-N, ProCam

### attack
**Path**: `chummer/gears/gear/attack`

- **Count**: 43
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 97.7%
- **Boolean Ratio**: 67.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-5 characters
- **Examples**:
  - `{CHA}`
  - `0`
  - `0`
  - `3`
  - `4`
- **All Values**: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, 9, {CHA}

### sleaze
**Path**: `chummer/gears/gear/sleaze`

- **Count**: 41
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 97.6%
- **Boolean Ratio**: 82.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-5 characters
- **Examples**:
  - `{INT}`
  - `0`
  - `0`
  - `1`
  - `1`
- **All Values**: 0, 1, 3, 5, 6, {INT}

### ap
**Path**: `chummer/gears/gear/weaponbonus/ap`

- **Count**: 36
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 8.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-2`
  - `-5`
  - `2`
  - `4`
  - `-4`
- **All Values**: -1, -2, -3, -4, -5, 1, 2, 4, 5, 6

### attributearray
**Path**: `chummer/gears/gear/attributearray`

- **Count**: 32
- **Presence Rate**: 100.0%
- **Unique Values**: 21
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-7 characters
- **Examples**:
  - `4,3,2,1`
  - `4,3,3,1`
  - `5,4,3,2`
  - `5,4,4,2`
  - `6,5,4,3`
- **All Values**: 2,2,1,1, 4,3,2,1, 4,3,3,1, 5,4,1,1, 5,4,3,2, 5,4,4,2, 6,5,4,3, 6,5,5,3, 7,4,3,2, 7,5,3,1, 7,5,5,4, 7,6,5,4, 8,5,4,3, 8,6,4,2, 8,7,5,5, 8,7,6,5, 8,7,7,5, 8,8,7,6, 9,8,7,6, 9,9,8,8

### damage
**Path**: `chummer/gears/gear/weaponbonus/damage`

- **Count**: 26
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 96.2%
- **Boolean Ratio**: 30.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `1`
  - `-4`
  - `-1`
  - `1`
  - `2`
- **All Values**: -1, -2, -2S(e), -3, -4, 1, 2

### damagetype
**Path**: `chummer/gears/gear/weaponbonus/damagetype`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `P(f)`
  - `S(e)`
  - `S`
  - `S(e)`
  - `S`
- **All Values**: (M), (S), Acid, P(f), S, S(e)

### weight
**Path**: `chummer/gears/gear/weight`

- **Count**: 17
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 88.2%
- **Boolean Ratio**: 88.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`
- **All Values**: 1, Rating

### name
**Path**: `chummer/gears/gear/bonus/spellcategory/name`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Combat`
  - `Detection`
  - `Health`
  - `Illusion`
  - `Manipulation`
- **All Values**: Combat, Detection, Health, Illusion, Manipulation

### val
**Path**: `chummer/gears/gear/bonus/spellcategory/val`

- **Count**: 15
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

### damagereplace
**Path**: `chummer/gears/gear/weaponbonus/damagereplace`

- **Count**: 14
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-13 characters
- **Examples**:
  - `7P`
  - `8P`
  - `8S(e)`
  - `12S(e)`
  - `8S(e)`
- **All Values**: 0S, 12S(e), 6P, 7P, 8P, 8S(e), 9P, As Drug/Toxin, As Narcoject, Special

### userange
**Path**: `chummer/gears/gear/weaponbonus/userange`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-13 characters
- **Examples**:
  - `Light Pistols`
  - `Light Pistols`
  - `Holdouts`
  - `Holdouts`
  - `Light Pistols`
- **All Values**: Holdouts, Light Pistols

### modattributearray
**Path**: `chummer/gears/gear/modattributearray`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-8 characters
- **Examples**:
  - `1,-1,0,0`
  - `1,0,-1,0`
  - `1,0,0,-1`
  - `-1,1,0,0`
  - `0,1,-1,0`
- **All Values**: -1,0,0,1, -1,0,1,0, -1,1,0,0, 0,-1,0,1, 0,-1,1,0, 0,0,-1,1, 0,0,1,-1, 0,1,-1,0, 0,1,0,-1, 1,-1,0,0, 1,0,-1,0, 1,0,0,-1

### modattack
**Path**: `chummer/gears/gear/modattack`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 81.8%
- **Boolean Ratio**: 45.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-8 characters
- **Examples**:
  - `{Rating}`
  - `{Rating}`
  - `1`
  - `1`
  - `-1`
- **All Values**: -1, 1, {Rating}

### modsleaze
**Path**: `chummer/gears/gear/modsleaze`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 81.8%
- **Boolean Ratio**: 45.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-8 characters
- **Examples**:
  - `{Rating}`
  - `{Rating}`
  - `1`
  - `1`
  - `-1`
- **All Values**: -1, 1, {Rating}

### capacity
**Path**: `chummer/gears/gear/gears/usegear/capacity`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-5 characters
- **Examples**:
  - `[0]`
  - `[0]`
  - `[0]`
  - `[0]`
  - `[0]`
- **All Values**: 2/[2], [0]

### modfirewall
**Path**: `chummer/gears/gear/modfirewall`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 80.0%
- **Boolean Ratio**: 40.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-8 characters
- **Examples**:
  - `{Rating}`
  - `{Rating}`
  - `1`
  - `-1`
  - `-1`
- **All Values**: -1, 1, {Rating}

### name
**Path**: `chummer/gears/gear/required/geardetails/name`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-17 characters
- **Examples**:
  - `Altskin`
  - `Altskin`
  - `Altskin`
  - `Altskin`
  - `Altskin`
- **All Values**: Altskin, Binoculars (2050), Goggles (2050)

### moddataprocessing
**Path**: `chummer/gears/gear/moddataprocessing`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 88.9%
- **Boolean Ratio**: 44.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-8 characters
- **Examples**:
  - `{Rating}`
  - `1`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: -1, 1, {Rating}

### limit
**Path**: `chummer/gears/gear/bonus/limitmodifier/limit`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-8 characters
- **Examples**:
  - `Social`
  - `Mental`
  - `Mental`
  - `Mental`
  - `Physical`
- **All Values**: Mental, Physical, Social

### value
**Path**: `chummer/gears/gear/bonus/limitmodifier/value`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 44.4%
- **Boolean Ratio**: 22.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `1`
  - `Rating`
  - `Rating`
  - `2`
  - `Rating`
- **All Values**: 1, 2, 3, Rating

### condition
**Path**: `chummer/gears/gear/bonus/limitmodifier/condition`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: string
- **Length Range**: 27-54 characters
- **Examples**:
  - `LimitCondition_Intimidation`
  - `LimitCondition_SkillsActivePerceptionVisual`
  - `LimitCondition_SkillsActivePerceptionHearing`
  - `LimitCondition_SkillsActivePerceptionSpatialRecognizer`
  - `LimitCondition_GearAutopicker`

### matrixcmbonus
**Path**: `chummer/gears/gear/matrixcmbonus`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-3`
  - `-2`
  - `-2`
  - `-2`
  - `-2`
- **All Values**: -2, -3, 2

### accuracy
**Path**: `chummer/gears/gear/weaponbonus/accuracy`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`
  - `-1`
  - `-1`
  - `-2`
  - `-1`
- **All Values**: -1, -2

### name
**Path**: `chummer/gears/gear/allowgear/name`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 18-18 characters
- **Examples**:
  - `Internal Synthlink`
  - `External Synthlink`
  - `Internal Synthlink`
  - `External Synthlink`
  - `Internal Synthlink`
- **All Values**: External Synthlink, Internal Synthlink

### name
**Path**: `chummer/gears/gear/bonus/specificskill/name`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-13 characters
- **Examples**:
  - `Alchemy`
  - `Disenchanting`
  - `Alchemy`
  - `Disenchanting`
  - `Alchemy`
- **All Values**: Alchemy, Disenchanting

### bonus
**Path**: `chummer/gears/gear/bonus/specificskill/bonus`

- **Count**: 6
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

### attack
**Path**: `chummer/gears/gear/required/geardetails/OR/AND/attack`

- **Count**: 6
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

### sleaze
**Path**: `chummer/gears/gear/required/geardetails/OR/AND/sleaze`

- **Count**: 6
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

### dataprocessing
**Path**: `chummer/gears/gear/required/geardetails/OR/AND/dataprocessing`

- **Count**: 6
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

### firewall
**Path**: `chummer/gears/gear/required/geardetails/OR/AND/firewall`

- **Count**: 6
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

### apreplace
**Path**: `chummer/gears/gear/weaponbonus/apreplace`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 20.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-1`
  - `-5`
  - `-6`
  - `0`
  - `-8`
- **All Values**: -1, -5, -6, -8, 0

### name
**Path**: `chummer/gears/gear/forbidden/geardetails/OR/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-14 characters
- **Examples**:
  - `Fake SIN`
  - `Fuchi Cyber-N`
  - `Fuchi Cyber-Ex`
  - `Fuchi Cyber-N`
  - `Fuchi Cyber-Ex`
- **All Values**: Fake SIN, Fuchi Cyber-Ex, Fuchi Cyber-N

### name
**Path**: `chummer/gears/gear/bonus/skillattribute/name`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `MAG`
  - `MAG`
  - `MAG`

### bonus
**Path**: `chummer/gears/gear/bonus/skillattribute/bonus`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`

### ignorerating
**Path**: `chummer/gears/gear/bonus/selectpowers/selectpower/ignorerating`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`
  - `True`
  - `True`

### val
**Path**: `chummer/gears/gear/bonus/selectpowers/selectpower/val`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`

### limit
**Path**: `chummer/gears/gear/bonus/selectpowers/selectpower/limit`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`

### pointsperlevel
**Path**: `chummer/gears/gear/bonus/selectpowers/selectpower/pointsperlevel`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `0.25`
  - `0.25`
  - `0.25`

### weaponspecificdice
**Path**: `chummer/gears/gear/bonus/weaponspecificdice`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`

### category
**Path**: `chummer/gears/gear/required/geardetails/category`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Drugs`
  - `Drugs`
  - `Drugs`

### attack
**Path**: `chummer/gears/gear/required/geardetails/OR/attack`

- **Count**: 3
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

### sleaze
**Path**: `chummer/gears/gear/required/geardetails/OR/sleaze`

- **Count**: 3
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

### isflechetteammo
**Path**: `chummer/gears/gear/isflechetteammo`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`
  - `True`

### damagetype
**Path**: `chummer/gears/gear/flechetteweaponbonus/damagetype`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-4 characters
- **Examples**:
  - `P(f)`
  - `S(e)`
- **All Values**: P(f), S(e)

### accuracyreplace
**Path**: `chummer/gears/gear/weaponbonus/accuracyreplace`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `3`

### name
**Path**: `chummer/gears/gear/required/parentdetails/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-15 characters
- **Examples**:
  - `Cyberdeck`
  - `Micro-Hardpoint`
- **All Values**: Cyberdeck, Micro-Hardpoint

### val
**Path**: `chummer/gears/gear/bonus/skillsoft/val`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### smartlink
**Path**: `chummer/gears/gear/bonus/smartlink`

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

### toxincontactresist
**Path**: `chummer/gears/gear/bonus/toxincontactresist`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### pathogencontactresist
**Path**: `chummer/gears/gear/bonus/pathogencontactresist`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### toxininhalationresist
**Path**: `chummer/gears/gear/bonus/toxininhalationresist`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### pathogeninhalationresist
**Path**: `chummer/gears/gear/bonus/pathogeninhalationresist`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### dataprocessing
**Path**: `chummer/gears/gear/required/geardetails/OR/dataprocessing`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`

### firewall
**Path**: `chummer/gears/gear/required/geardetails/OR/firewall`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`

### ammoforweapontype
**Path**: `chummer/gears/gear/required/parentdetails/ammoforweapontype`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `bow`

### smartlinkpool
**Path**: `chummer/gears/gear/weaponbonus/smartlinkpool`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### ap
**Path**: `chummer/gears/gear/flechetteweaponbonus/ap`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-5`

### damage
**Path**: `chummer/gears/gear/flechetteweaponbonus/damage`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-2`

### modereplace
**Path**: `chummer/gears/gear/weaponbonus/modereplace`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 2-2 characters
- **Examples**:
  - `SS`

### maxrating
**Path**: `chummer/gears/gear/gears/usegear/maxrating`

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
**Path**: `chummer/gears/gear/required/parentdetails/category`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Headware`

### name
**Path**: `chummer/gears/gear/gears/usegear/gears/usegear/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 20-20 characters
- **Examples**:
  - `Love Life Management`

### category
**Path**: `chummer/gears/gear/gears/usegear/gears/usegear/category`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Software`

### val
**Path**: `chummer/gears/gear/bonus/activesoft/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`

### name
**Path**: `chummer/gears/gear/forbidden/geardetails/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 17-17 characters
- **Examples**:
  - `Microphone, Laser`

### matrixinitiativedice
**Path**: `chummer/gears/gear/bonus/matrixinitiativedice`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### essencepenaltyt100
**Path**: `chummer/gears/gear/bonus/essencepenaltyt100`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 10-10 characters
- **Examples**:
  - `-10*Rating`

## Attributes

### ammoforweapontype@noextra
**Path**: `chummer/gears/gear/ammoforweapontype@noextra`

- **Count**: 80
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### category@blackmarket
**Path**: `chummer/categories/category@blackmarket`

- **Count**: 64
- **Unique Values**: 11
- **Examples**:
  - `Magic`
  - `Magic`
  - `Weapons`
  - `Armor`
  - `Electronics`

### selecttext@xml
**Path**: `chummer/gears/gear/bonus/selecttext@xml`

- **Count**: 34
- **Unique Values**: 9
- **Enum Candidate**: Yes
- **Examples**:
  - `lifemodules.xml`
  - `lifemodules.xml`
  - `vehicles.xml`
  - `vehicles.xml`
  - `vehicles.xml`
- **All Values**: gear.xml, lifemodules.xml, programs.xml, skills.xml, spells.xml, strings.xml, traditions.xml, vehicles.xml, weapons.xml

### selecttext@xpath
**Path**: `chummer/gears/gear/bonus/selecttext@xpath`

- **Count**: 34
- **Unique Values**: 15
- **Examples**:
  - `/chummer/storybuilder/macros/mega/persistent/*`
  - `/chummer/storybuilder/macros/mega/persistent/*`
  - `/chummer/vehicles/vehicle`
  - `/chummer/vehicles/vehicle`
  - `/chummer/vehicles/vehicle`

### selecttext@allowedit
**Path**: `chummer/gears/gear/bonus/selecttext@allowedit`

- **Count**: 19
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### bonus@unique
**Path**: `chummer/gears/gear/bonus@unique`

- **Count**: 19
- **Unique Values**: 7
- **Enum Candidate**: Yes
- **Examples**:
  - `chemicalprotection`
  - `respirator`
  - `respirator`
  - `combatspellfocus`
  - `detectionspellfocus`
- **All Values**: chemicalprotection, combatspellfocus, detectionspellfocus, healthspellfocus, illusionspellfocus, manipulationspellfocus, respirator

### attributearray@operation
**Path**: `chummer/gears/gear/required/geardetails/attributearray@operation`

- **Count**: 14
- **Unique Values**: 1
- **Examples**:
  - `exists`
  - `exists`
  - `exists`
  - `exists`
  - `exists`

### attributearray@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/attributearray@operation`

- **Count**: 8
- **Unique Values**: 1
- **Examples**:
  - `exists`
  - `exists`
  - `exists`
  - `exists`
  - `exists`

### attack@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/AND/attack@operation`

- **Count**: 6
- **Unique Values**: 1
- **Examples**:
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`

### sleaze@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/AND/sleaze@operation`

- **Count**: 6
- **Unique Values**: 1
- **Examples**:
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`

### dataprocessing@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/AND/dataprocessing@operation`

- **Count**: 6
- **Unique Values**: 1
- **Examples**:
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`

### firewall@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/AND/firewall@operation`

- **Count**: 6
- **Unique Values**: 1
- **Examples**:
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`

### name@select
**Path**: `chummer/gears/gear/gears/usegear/name@select`

- **Count**: 4
- **Unique Values**: 4
- **Enum Candidate**: Yes
- **Examples**:
  - `Lunchbox`
  - `Bracelet`
  - `Urban Brawl News`
  - `Wristband`
- **All Values**: Bracelet, Lunchbox, Urban Brawl News, Wristband

### addweapon@rating
**Path**: `chummer/gears/gear/addweapon@rating`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `{Rating}`
  - `{Rating}`
  - `{Rating}`

### skillattribute@precedence
**Path**: `chummer/gears/gear/bonus/skillattribute@precedence`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `0`
  - `0`
  - `0`

### weaponspecificdice@type
**Path**: `chummer/gears/gear/bonus/weaponspecificdice@type`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `Melee`
  - `Melee`
  - `Melee`

### attack@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/attack@operation`

- **Count**: 3
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `exists`
  - `greaterthan`
  - `greaterthan`
- **All Values**: exists, greaterthan

### sleaze@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/sleaze@operation`

- **Count**: 3
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `exists`
  - `greaterthan`
  - `greaterthan`
- **All Values**: exists, greaterthan

### selectweapon@weapondetails
**Path**: `chummer/gears/gear/bonus/selectweapon@weapondetails`

- **Count**: 2
- **Unique Values**: 2
- **Examples**:
  - `(contains(ammo, '(c)') or contains(ammo, '(d)')) and name != 'HK Urban Fighter'`
  - `contains(ammo, '(cy)')`

### selectskill@limittoskill
**Path**: `chummer/gears/gear/bonus/selectskill@limittoskill`

- **Count**: 2
- **Unique Values**: 2
- **Examples**:
  - `First Aid,Hardware,Instruction,Aeronautics Mechanic,Automotive Mechanic,Industrial Mechanic,Nautical Mechanic,Navigation,Performance`
  - `Chemistry,Demolitions,Electronic Warfare,Lockpicking,Medicine`

### selectskill@skillcategory
**Path**: `chummer/gears/gear/bonus/selectskill@skillcategory`

- **Count**: 2
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Academic,Language,Professional`
  - `Physical Active`
- **All Values**: Academic,Language,Professional, Physical Active

### attributearray@NOT
**Path**: `chummer/gears/gear/required/geardetails/attributearray@NOT`

- **Count**: 2
- **Unique Values**: 0

### dataprocessing@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/dataprocessing@operation`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `greaterthan`
  - `greaterthan`

### firewall@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/firewall@operation`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `greaterthan`
  - `greaterthan`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema gear.xsd`

### gears@startcollapsed
**Path**: `chummer/gears/gear/gears@startcollapsed`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

### skillsoft@excludecategory
**Path**: `chummer/gears/gear/bonus/skillsoft@excludecategory`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Language`

### skillsoft@skillcategory
**Path**: `chummer/gears/gear/bonus/skillsoft@skillcategory`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Language`

### selectskill@knowledgeskills
**Path**: `chummer/gears/gear/bonus/selectskill@knowledgeskills`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

### matrixinitiativedice@precedence
**Path**: `chummer/gears/gear/bonus/matrixinitiativedice@precedence`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `-1`

### attack@NOT
**Path**: `chummer/gears/gear/required/geardetails/OR/attack@NOT`

- **Count**: 1
- **Unique Values**: 0

### sleaze@NOT
**Path**: `chummer/gears/gear/required/geardetails/OR/sleaze@NOT`

- **Count**: 1
- **Unique Values**: 0

### name@operation
**Path**: `chummer/gears/gear/required/geardetails/OR/name@operation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `contains`

## Type Improvement Recommendations

### Enum Candidates
- **rating** (`chummer/gears/gear/rating`): 21 unique values
  - Values: 0, 1, 10, 100, 1000, 100000, 1000000, 12, 2, 20, 20000, 25, 3, 4, 5, 6, 7, 8, 99, {Parent Rating}
- **source** (`chummer/gears/gear/source`): 39 unique values
  - Values: BB, BTB, CA, HAMG, HT, PBG, PGG, PZG, QSR, R5, RF, RG, SG, SL, SOXG, SPS, SS, TCT, TSG, TVG
- **costfor** (`chummer/gears/gear/costfor`): 10 unique values
  - Values: 1, 10, 100, 2, 20, 3, 4, 5, 50, 6
- **ap** (`chummer/gears/gear/weaponbonus/ap`): 10 unique values
  - Values: -1, -2, -3, -4, -5, 1, 2, 4, 5, 6
- **ammoforweapontype** (`chummer/gears/gear/ammoforweapontype`): 32 unique values
  - Values: bow, cannon, crossbow, firefighting cannons, flame, flaregun, glauncher, gun, gyrojet, man-catcher, microglauncher, mlauncher, netgun, netgunxl, sfw-30 underbarrel weapon, spraypen, squirtgun, taser, torpglauncher, trackstopper
- **damage** (`chummer/gears/gear/weaponbonus/damage`): 7 unique values
  - Values: -1, -2, -2S(e), -3, -4, 1, 2
- **damagetype** (`chummer/gears/gear/weaponbonus/damagetype`): 6 unique values
  - Values: (M), (S), Acid, P(f), S, S(e)
- **damagetype** (`chummer/gears/gear/flechetteweaponbonus/damagetype`): 2 unique values
  - Values: P(f), S(e)
- **addoncategory** (`chummer/gears/gear/addoncategory`): 17 unique values
  - Values: Audio Enhancements, Common Programs, Currency, Custom, Cyberdeck Modules, Cyberdecks, Drug Grades, Drugs, Electronic Modification, Hacking Programs, ID/Credsticks, Nanogear, Sensor Functions, Sensors, Tools of the Trade, Toxins, Vision Enhancements
- **apreplace** (`chummer/gears/gear/weaponbonus/apreplace`): 5 unique values
  - Values: -1, -5, -6, -8, 0
- **damagereplace** (`chummer/gears/gear/weaponbonus/damagereplace`): 10 unique values
  - Values: 0S, 12S(e), 6P, 7P, 8P, 8S(e), 9P, As Drug/Toxin, As Narcoject, Special
- **userange** (`chummer/gears/gear/weaponbonus/userange`): 2 unique values
  - Values: Holdouts, Light Pistols
- **accuracy** (`chummer/gears/gear/weaponbonus/accuracy`): 2 unique values
  - Values: -1, -2
- **minrating** (`chummer/gears/gear/minrating`): 7 unique values
  - Values: 1, 12, 2, 3, 4, 5, 6
- **weight** (`chummer/gears/gear/weight`): 2 unique values
  - Values: 1, Rating
- **ratinglabel** (`chummer/gears/gear/ratinglabel`): 4 unique values
  - Values: Rating_Meters, Rating_SqMeters, String_Force, String_Force_Potency
- **name** (`chummer/gears/gear/gears/usegear/name`): 45 unique values
  - Values: Agent, Biofeedback Filter, Blood Alcohol Biosensor, Credstick Reader, Decryption, Earbuds, Edit, Fork, Gas Mask, Hammer, Matches, Microphone, Omni-Directional, Motion Sensor, RFID Tag Scanner, Radar Scanner, Secret Compartment with Faraday Cage, Touchscreen Display, Track, Water Purification Unit, Waterproof Casing
- **category** (`chummer/gears/gear/gears/usegear/category`): 13 unique values
  - Values: Audio Devices, Commlink Accessories, Commlink/Cyberdeck Form Factors, Common Programs, Electronics Accessories, Hacking Programs, Sensor Functions, Sensors, Software, Survival Gear, Tools, Vision Devices, Vision Enhancements
- **capacity** (`chummer/gears/gear/gears/usegear/capacity`): 2 unique values
  - Values: 2/[2], [0]
- **rating** (`chummer/gears/gear/gears/usegear/rating`): 3 unique values
  - Values: 1, 2, 3
- **devicerating** (`chummer/gears/gear/devicerating`): 12 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, Rating, {RES}, {Rating}
- **attack** (`chummer/gears/gear/attack`): 12 unique values
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, 9, {CHA}
- **sleaze** (`chummer/gears/gear/sleaze`): 6 unique values
  - Values: 0, 1, 3, 5, 6, {INT}
- **dataprocessing** (`chummer/gears/gear/dataprocessing`): 11 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, Rating, {LOG}
- **firewall** (`chummer/gears/gear/firewall`): 12 unique values
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, Rating, {WIL}
- **canformpersona** (`chummer/gears/gear/canformpersona`): 2 unique values
  - Values: Parent, Self
- **armorcapacity** (`chummer/gears/gear/armorcapacity`): 10 unique values
  - Values: 0, Rating/[1], [0], [1], [2], [3], [4], [5], [6], [Rating]
- **capacity** (`chummer/gears/gear/capacity`): 29 unique values
  - Values: 0, 1, 1/[1], 1000000, 3, 5000, 500000, 8/[6], Rating, Rating/[1], [0.066666666666667], [0.1], [0.28571428571429], [0.2], [0.33333333333333], [0.5], [0.99009900990099], [1.1111111111111], [1.25], [Rating]
- **category** (`chummer/gears/gear/required/geardetails/OR/category`): 11 unique values
  - Values: Armor, Cloaks, Clothing, Commlink, Commlinks, Custom, Cyberdecks, Cyberterminals, High-Fashion Armor Clothing, Sensors, Specialty Armor
- **attributearray** (`chummer/gears/gear/attributearray`): 21 unique values
  - Values: 2,2,1,1, 4,3,2,1, 4,3,3,1, 5,4,1,1, 5,4,3,2, 5,4,4,2, 6,5,4,3, 6,5,5,3, 7,4,3,2, 7,5,3,1, 7,5,5,4, 7,6,5,4, 8,5,4,3, 8,6,4,2, 8,7,5,5, 8,7,6,5, 8,7,7,5, 8,8,7,6, 9,8,7,6, 9,9,8,8
- **programs** (`chummer/gears/gear/programs`): 9 unique values
  - Values: 1, 2, 3, 4, 5, 6, 8, Rating, {Rating}+2
- **modattack** (`chummer/gears/gear/modattack`): 3 unique values
  - Values: -1, 1, {Rating}
- **name** (`chummer/gears/gear/required/geardetails/OR/name`): 10 unique values
  - Values: Add Attack Modification, Add Sleaze Modification, Camera, Contacts, Credstick, Fake (2050), Credstick, Standard (2050), Fake SIN, Fuchi Cyber-Ex, Fuchi Cyber-N, ProCam
- **modsleaze** (`chummer/gears/gear/modsleaze`): 3 unique values
  - Values: -1, 1, {Rating}
- **moddataprocessing** (`chummer/gears/gear/moddataprocessing`): 3 unique values
  - Values: -1, 1, {Rating}
- **modfirewall** (`chummer/gears/gear/modfirewall`): 3 unique values
  - Values: -1, 1, {Rating}
- **name** (`chummer/gears/gear/required/parentdetails/name`): 2 unique values
  - Values: Cyberdeck, Micro-Hardpoint
- **limit** (`chummer/gears/gear/bonus/limitmodifier/limit`): 3 unique values
  - Values: Mental, Physical, Social
- **value** (`chummer/gears/gear/bonus/limitmodifier/value`): 4 unique values
  - Values: 1, 2, 3, Rating
- **name** (`chummer/gears/gear/forbidden/geardetails/OR/name`): 3 unique values
  - Values: Fake SIN, Fuchi Cyber-Ex, Fuchi Cyber-N
- **name** (`chummer/gears/gear/bonus/specificskill/name`): 2 unique values
  - Values: Alchemy, Disenchanting
- **name** (`chummer/gears/gear/bonus/spellcategory/name`): 5 unique values
  - Values: Combat, Detection, Health, Illusion, Manipulation
- **matrixcmbonus** (`chummer/gears/gear/matrixcmbonus`): 3 unique values
  - Values: -2, -3, 2
- **modattributearray** (`chummer/gears/gear/modattributearray`): 12 unique values
  - Values: -1,0,0,1, -1,0,1,0, -1,1,0,0, 0,-1,0,1, 0,-1,1,0, 0,0,-1,1, 0,0,1,-1, 0,1,-1,0, 0,1,0,-1, 1,-1,0,0, 1,0,-1,0, 1,0,0,-1
- **name** (`chummer/gears/gear/required/geardetails/name`): 3 unique values
  - Values: Altskin, Binoculars (2050), Goggles (2050)
- **name** (`chummer/gears/gear/allowgear/name`): 2 unique values
  - Values: External Synthlink, Internal Synthlink

### Numeric Type Candidates
- **page** (`chummer/gears/gear/page`): 100.0% numeric
  - Examples: 183, 187, 187
- **smartlinkpool** (`chummer/gears/gear/weaponbonus/smartlinkpool`): 100.0% numeric
  - Examples: 1
- **ap** (`chummer/gears/gear/flechetteweaponbonus/ap`): 100.0% numeric
  - Examples: -5
- **damage** (`chummer/gears/gear/flechetteweaponbonus/damage`): 100.0% numeric
  - Examples: -2
- **accuracyreplace** (`chummer/gears/gear/weaponbonus/accuracyreplace`): 100.0% numeric
  - Examples: 3, 3
- **maxrating** (`chummer/gears/gear/gears/usegear/maxrating`): 100.0% numeric
  - Examples: 1
- **smartlink** (`chummer/gears/gear/bonus/smartlink`): 100.0% numeric
  - Examples: 1, 1
- **pointsperlevel** (`chummer/gears/gear/bonus/selectpowers/selectpower/pointsperlevel`): 100.0% numeric
  - Examples: 0.25, 0.25, 0.25
- **matrixinitiativedice** (`chummer/gears/gear/bonus/matrixinitiativedice`): 100.0% numeric
  - Examples: 1
- **attack** (`chummer/gears/gear/required/geardetails/OR/attack`): 100.0% numeric
  - Examples: 0, 0, 0
- **sleaze** (`chummer/gears/gear/required/geardetails/OR/sleaze`): 100.0% numeric
  - Examples: 0, 0, 0
- **dataprocessing** (`chummer/gears/gear/required/geardetails/OR/dataprocessing`): 100.0% numeric
  - Examples: 0, 0
- **firewall** (`chummer/gears/gear/required/geardetails/OR/firewall`): 100.0% numeric
  - Examples: 0, 0
- **attack** (`chummer/gears/gear/required/geardetails/OR/AND/attack`): 100.0% numeric
  - Examples: 0, 0, 0
- **sleaze** (`chummer/gears/gear/required/geardetails/OR/AND/sleaze`): 100.0% numeric
  - Examples: 0, 0, 0
- **dataprocessing** (`chummer/gears/gear/required/geardetails/OR/AND/dataprocessing`): 100.0% numeric
  - Examples: 0, 0, 0
- **firewall** (`chummer/gears/gear/required/geardetails/OR/AND/firewall`): 100.0% numeric
  - Examples: 0, 0, 0

### Boolean Type Candidates
- **isflechetteammo** (`chummer/gears/gear/isflechetteammo`): 100.0% boolean
  - Examples: True, True
- **allowrename** (`chummer/gears/gear/allowrename`): 100.0% boolean
  - Examples: True, True, True
- **ignorerating** (`chummer/gears/gear/bonus/selectpowers/selectpower/ignorerating`): 100.0% boolean
  - Examples: True, True, True
