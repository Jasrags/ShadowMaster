# Analysis Report: weapons.xml

**File**: `data\chummerxml\weapons.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 17201
- **Unique Fields**: 117
- **Unique Attributes**: 25
- **Unique Element Types**: 162

## Fields

### mount
**Path**: `chummer/weapons/weapon/accessorymounts/mount`

- **Count**: 1135
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-6 characters
- **Examples**:
  - `Stock`
  - `Side`
  - `Top`
  - `Under`
  - `Stock`
- **All Values**: Barrel, Side, Stock, Top, Under

### id
**Path**: `chummer/weapons/weapon/id`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 632
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `e5ac06f4-3755-42a7-9da9-88de4b3b2ad8`
  - `944dfbc8-5972-44f7-810e-039d9f7d98b7`
  - `4a4810ca-4d11-49ee-8705-0411edc4d523`
  - `3320c670-23ae-4cce-9c2c-e59d2554ddd7`
  - `b59116dd-eeba-4091-ad87-a1216e7e52fe`

### name
**Path**: `chummer/weapons/weapon/name`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 628
- **Type Patterns**: string
- **Length Range**: 3-54 characters
- **Examples**:
  - `Ares Thunderstruck Gauss Rifle`
  - `Ares Vigorous Assault Cannon`
  - `Krime Bomb`
  - `Krime Cannon`
  - `Ogre Hammer SWS Assault Cannon`

### category
**Path**: `chummer/weapons/weapon/category`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 32
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-21 characters
- **Examples**:
  - `Assault Cannons`
  - `Assault Cannons`
  - `Assault Cannons`
  - `Assault Cannons`
  - `Assault Cannons`

### type
**Path**: `chummer/weapons/weapon/type`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-6 characters
- **Examples**:
  - `Ranged`
  - `Ranged`
  - `Ranged`
  - `Ranged`
  - `Ranged`
- **All Values**: Melee, Ranged

### conceal
**Path**: `chummer/weapons/weapon/conceal`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 30.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `10`
  - `10`
  - `10`
  - `10`
  - `10`
- **All Values**: -1, -10, -2, -3, -4, -5, -6, 0, 1, 10, 2, 3, 4, 6, 8

### accuracy
**Path**: `chummer/weapons/weapon/accuracy`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 82.8%
- **Boolean Ratio**: 5.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-39 characters
- **Examples**:
  - `7`
  - `4`
  - `6`
  - `4`
  - `6`
- **All Values**: 0, 2, 3, 3+number({STR} >= 5)+number({STR} >= 7), 4, 5, 6, 7, 8, 9, Missile, Physical, Physical+1, Physical-1, Physical-2

### reach
**Path**: `chummer/weapons/weapon/reach`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 96.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: -1, 0, 1, 2, 3

### damage
**Path**: `chummer/weapons/weapon/damage`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 91
- **Type Patterns**: mixed_numeric, mixed_boolean
- **Numeric Ratio**: 0.5%
- **Boolean Ratio**: 0.5%
- **Length Range**: 1-56 characters
- **Examples**:
  - `15P`
  - `16P`
  - `16P`
  - `16P`
  - `16P`

### ap
**Path**: `chummer/weapons/weapon/ap`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 24
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 96.5%
- **Boolean Ratio**: 11.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-11 characters
- **Examples**:
  - `-8`
  - `-6`
  - `-6`
  - `-6`
  - `-4`
- **All Values**: +1, +3, +4, +4//-8, +5, -, -(Rating/4), -1, -1//-2, -10, -3, -4, -4//-10, -6, -8, -{MAG}*0.5, 0, 4, Missile, Special

### mode
**Path**: `chummer/weapons/weapon/mode`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 39.7%
- **Boolean Ratio**: 39.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-8 characters
- **Examples**:
  - `SA`
  - `SS`
  - `SS`
  - `SA`
  - `SA`
- **All Values**: -, 0, BF, BF/FA, FA, SA, SA/BF, SA/BF/FA, SA/FA, SS, SS/BF, SS/FA, SS/SA

### rc
**Path**: `chummer/weapons/weapon/rc`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 94.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `1`
  - `0`
- **All Values**: -, -1, -2, -3, -5, -6, 0, 1, 2, 3

### ammo
**Path**: `chummer/weapons/weapon/ammo`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 89
- **Type Patterns**: mixed_numeric, mixed_boolean
- **Numeric Ratio**: 42.6%
- **Boolean Ratio**: 41.0%
- **Length Range**: 1-26 characters
- **Examples**:
  - `10(c) + energy`
  - `12(c)`
  - `4(m)`
  - `6(m)`
  - `6(c)`

### avail
**Path**: `chummer/weapons/weapon/avail`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 53
- **Type Patterns**: mixed_numeric, mixed_boolean
- **Numeric Ratio**: 28.6%
- **Boolean Ratio**: 19.3%
- **Length Range**: 1-13 characters
- **Examples**:
  - `24F`
  - `18F`
  - `20F`
  - `20F`
  - `20F`

### cost
**Path**: `chummer/weapons/weapon/cost`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 141
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 99.5%
- **Boolean Ratio**: 18.4%
- **Length Range**: 1-11 characters
- **Examples**:
  - `26000`
  - `24500`
  - `23000`
  - `21000`
  - `32000`

### source
**Path**: `chummer/weapons/weapon/source`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 29
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 11.4%
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `RG`
  - `RG`
  - `GH3`
  - `SR5`
  - `RG`
- **All Values**: AP, CA, DT, GH3, HAMG, HT, R5, RF, RG, SASS, SFM, SG, SHB, SHB4, SL, SLG2, SR5, SS, TCT, TSG

### page
**Path**: `chummer/weapons/weapon/page`

- **Count**: 632
- **Presence Rate**: 100.0%
- **Unique Values**: 122
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 0.3%
- **Length Range**: 1-3 characters
- **Examples**:
  - `45`
  - `46`
  - `35`
  - `431`
  - `46`

### name
**Path**: `chummer/weapons/weapon/accessories/accessory/name`

- **Count**: 433
- **Presence Rate**: 100.0%
- **Unique Values**: 57
- **Type Patterns**: string
- **Length Range**: 5-69 characters
- **Examples**:
  - `Laser Sight`
  - `Shock Pad`
  - `Laser Sight`
  - `Slide Mount`
  - `Advanced Safety System, Basic`

### spec
**Path**: `chummer/weapons/weapon/spec`

- **Count**: 313
- **Presence Rate**: 100.0%
- **Unique Values**: 37
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-18 characters
- **Examples**:
  - `Grenade Launchers`
  - `Submachine Guns`
  - `Machine Guns`
  - `Shotguns`
  - `Sniper Rifles`

### useskill
**Path**: `chummer/weapons/weapon/useskill`

- **Count**: 223
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-20 characters
- **Examples**:
  - `Heavy Weapons`
  - `Automatics`
  - `Heavy Weapons`
  - `Longarms`
  - `Longarms`
- **All Values**: Archery, Automatics, Blades, Clubs, Exotic Melee Weapon, Exotic Ranged Weapon, Gunnery, Heavy Weapons, Longarms, Pistols, Throwing Weapons, Unarmed Combat

### name
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/name`

- **Count**: 196
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-33 characters
- **Examples**:
  - `HK Urban Combat`
  - `HK Urban Enforcer`
  - `HK Urban Fighter`
  - `HK Urban Assassin`
  - `PSK-3 Collapsible Heavy Pistol`
- **All Values**: Ares Crusader II, Ceska Black Scorpion, HK Urban Assassin, HK Urban Combat, HK Urban Enforcer, HK Urban Fighter, HK Urban Striker, Hammerli Gemini, Onotari Arms Pressure KS-X, Onotari Arms SIG-6, PPSK-4 Collapsible Machine Pistol, PSK-3 Collapsible Heavy Pistol, Ruhrmetall SMK 252, Steyr TMP

### range
**Path**: `chummer/weapons/weapon/range`

- **Count**: 181
- **Presence Rate**: 100.0%
- **Unique Values**: 27
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-23 characters
- **Examples**:
  - `Grenade Launchers`
  - `Submachine Guns`
  - `Light Machine Guns`
  - `Shotguns`
  - `Sniper Rifles`
- **All Values**: Aerodynamic Grenade, Flamethrowers, Grenade Launchers, Harpoon Gun, Heavy Pistols, Holdouts, Light Crossbows, Light Machine Guns, Light Pistols, Machine Pistols, Medium Crossbows, Missile Launchers, Net, Shotguns, Shotguns (slug), Sniper Rifles, Sporting Rifles, Standard Grenade, Tasers, Thrown Knife

### id
**Path**: `chummer/accessories/accessory/id`

- **Count**: 152
- **Presence Rate**: 100.0%
- **Unique Values**: 152
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `d34a93a8-b695-4c46-8e34-0948df68d44f`
  - `4026650e-ecd3-4514-b2c6-d03dc1d466b5`
  - `294a6b30-6e1c-4b7d-8e93-10964647c2dd`
  - `6e06df00-95b8-450f-9f2a-4a86c582d342`
  - `7f66a669-917a-4423-bd83-cf0e0a1fb2a8`

### name
**Path**: `chummer/accessories/accessory/name`

- **Count**: 152
- **Presence Rate**: 100.0%
- **Unique Values**: 151
- **Type Patterns**: string
- **Length Range**: 5-69 characters
- **Examples**:
  - `Silencer (Ares Light Fire 70)`
  - `Silencer (Ares Light Fire 75)`
  - `Airburst Link`
  - `Bipod`
  - `Concealable Holster`

### avail
**Path**: `chummer/accessories/accessory/avail`

- **Count**: 152
- **Presence Rate**: 100.0%
- **Unique Values**: 36
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 57.2%
- **Boolean Ratio**: 19.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-11 characters
- **Examples**:
  - `6F`
  - `6F`
  - `6R`
  - `2`
  - `2`

### cost
**Path**: `chummer/accessories/accessory/cost`

- **Count**: 152
- **Presence Rate**: 100.0%
- **Unique Values**: 44
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 93.4%
- **Boolean Ratio**: 15.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-20 characters
- **Examples**:
  - `750`
  - `0`
  - `600`
  - `200`
  - `150`

### source
**Path**: `chummer/accessories/accessory/source`

- **Count**: 152
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 10.5%
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: 2050, BTB, CF, GH3, HT, KK, RG, SAG, SL, SLG2, SOTG, SR5

### page
**Path**: `chummer/accessories/accessory/page`

- **Count**: 152
- **Presence Rate**: 100.0%
- **Unique Values**: 41
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 1.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `425`
  - `425`
  - `431`
  - `431`
  - `431`

### rating
**Path**: `chummer/accessories/accessory/rating`

- **Count**: 152
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 95.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 1, 10, 1000, 2, 6

### accessory
**Path**: `chummer/accessories/accessory/forbidden/oneof/accessory`

- **Count**: 83
- **Presence Rate**: 100.0%
- **Unique Values**: 25
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-47 characters
- **Examples**:
  - `Vintage`
  - `Stock Removal`
  - `Sawed Off/Shortbarrel and Stock Removal`
  - `Vintage`
  - `Ceramic/Plasteel Components`
- **All Values**: Advanced Safety System, Basic, Advanced Safety System, Electro Shocker, Advanced Safety System, Explosive Self Destruct, Advanced Safety System, Immobilization, Advanced Safety System, Self Destruct, Airburst Link, Ammo Skip, Ceramic/Plasteel Components, Chameleon Coating (Rifle), Easy Breakdown (Powered), Electronic Firing, Safe Target System, Base, Sawed Off/Shortbarrel, Sawed Off/Shortbarrel and Stock Removal, Smart Firing Platform, Smartgun System, External, Smartgun System, Internal, Stock Removal, Weapon Commlink, Weapon Personality

### mount
**Path**: `chummer/accessories/accessory/mount`

- **Count**: 71
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-30 characters
- **Examples**:
  - `Barrel`
  - `Barrel`
  - `Under`
  - `Barrel`
  - `Barrel`
- **All Values**: Barrel, Side, Stock, Top, Top/Under, Top/Under/Barrel/Side/Internal, Top/Under/Side, Under, Under/Barrel

### category
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/category`

- **Count**: 59
- **Presence Rate**: 100.0%
- **Unique Values**: 21
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-19 characters
- **Examples**:
  - `Grenade Launchers`
  - `Missile Launchers`
  - `Tasers`
  - `Holdouts`
  - `Light Pistols`
- **All Values**: Assault Cannons, Assault Rifles, Bows, Flamethrowers, Grenade Launchers, Heavy Machine Guns, Heavy Pistols, Holdouts, Laser Weapons, Light Machine Guns, Light Pistols, Machine Pistols, Medium Machine Guns, Missile Launchers, Pistol, Shotguns, Sniper Rifles, Sporting Rifles, Tasers, Underbarrel Weapons

### allowaccessory
**Path**: `chummer/weapons/weapon/allowaccessory`

- **Count**: 56
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: boolean_string, enum_candidate
- **Boolean Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 4-5 characters
- **Examples**:
  - `False`
  - `False`
  - `False`
  - `False`
  - `False`
- **All Values**: False, True

### weapontype
**Path**: `chummer/weapons/weapon/weapontype`

- **Count**: 45
- **Presence Rate**: 100.0%
- **Unique Values**: 25
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-25 characters
- **Examples**:
  - `harpoongun`
  - `slingshot`
  - `harpoongun`
  - `grapplegun`
  - `flaregun`
- **All Values**: energy, firefighting cannons, flame, flaregun, glauncher, grapplegun, gun, gyrojet, man-catcher, microglauncher, netgun, netgunxl, pepperpunch, sfw-30 main weapon, sfw-30 underbarrel weapon, slingshot, spraypen, squirtgun, torpglauncher, trackstopper

### category
**Path**: `chummer/weapons/weapon/required/weapondetails/OR/AND/OR/category`

- **Count**: 36
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-19 characters
- **Examples**:
  - `Shotguns`
  - `Sporting Rifles`
  - `Sniper Rifles`
  - `Light Machine Guns`
  - `Medium Machine Guns`
- **All Values**: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles

### alternaterange
**Path**: `chummer/weapons/weapon/alternaterange`

- **Count**: 32
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 20-24 characters
- **Examples**:
  - `Shotguns (flechette)`
  - `Harpoon Gun (Underwater)`
  - `Harpoon Gun (Underwater)`
  - `Shotguns (flechette)`
  - `Shotguns (flechette)`
- **All Values**: Harpoon Gun (Underwater), Shotguns (flechette)

### category
**Path**: `chummer/categories/category`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 31
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-21 characters
- **Examples**:
  - `Blades`
  - `Clubs`
  - `Improvised Weapons`
  - `Exotic Melee Weapons`
  - `Exotic Ranged Weapons`

### cyberware
**Path**: `chummer/weapons/weapon/cyberware`

- **Count**: 31
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

### addweapon
**Path**: `chummer/weapons/weapon/addweapon`

- **Count**: 27
- **Presence Rate**: 100.0%
- **Unique Values**: 21
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-37 characters
- **Examples**:
  - `HK XM30 Grenade Launcher`
  - `HK XM30 Carbine`
  - `HK XM30 LMG`
  - `HK XM30 Shotgun`
  - `HK XM30 Sniper`
- **All Values**: Barrens Special: Bayonet, Gunstock War Club (Thrown), HK XM30 Carbine, HK XM30 Grenade Launcher, HK XM30 LMG, HK XM30 Shotgun, HK XM30 Sniper, Krime Reaver Knob, Krime Reaver Pick, Krime Trollbow Horns, Krime Whammy (Melee), Onotari HL-13 (Sniper Rifle), Onotari HL-13 Personal Defense Weapon, Onotari HL-13 Urban Assault, Steyr AUG-CSL Carbine (2050), Steyr AUG-CSL III (Carbine), Steyr AUG-CSL III (LMG), Steyr AUG-CSL III (Sniper Rifle), Steyr AUG-CSL LMG (2050), Steyr AUG-CSL SMG (2050)

### category
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/AND/OR/category`

- **Count**: 27
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-19 characters
- **Examples**:
  - `Shotguns`
  - `Sporting Rifles`
  - `Sniper Rifles`
  - `Shotguns`
  - `Sporting Rifles`
- **All Values**: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles

### accessory
**Path**: `chummer/accessories/accessory/required/oneof/accessory`

- **Count**: 26
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 23-38 characters
- **Examples**:
  - `Smartgun System, External`
  - `Smartgun System, Internal`
  - `Krime Dual-Mode External Smartgun Link`
  - `Smartgun System, External`
  - `Smartgun System, Internal`
- **All Values**: Drum Magazine, 24-round, Drum Magazine, 32-round, Krime Dual-Mode External Smartgun Link, Safe Target System, Base, Smartgun System, External, Smartgun System, Internal

### ammocategory
**Path**: `chummer/weapons/weapon/ammocategory`

- **Count**: 25
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-17 characters
- **Examples**:
  - `Grenade Launchers`
  - `Heavy Pistols`
  - `Heavy Pistols`
  - `Light Pistols`
  - `Holdouts`
- **All Values**: Assault Rifles, Grenade Launchers, Heavy Pistols, Holdouts, Light Pistols, Shotguns, Sniper Rifles, Sporting Rifles

### rc
**Path**: `chummer/accessories/accessory/rc`

- **Count**: 24
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 45.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `1`
  - `2`
  - `3`
  - `6`
- **All Values**: 1, 2, 3, 5, 6

### ammo
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/ammo`

- **Count**: 24
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-15 characters
- **Examples**:
  - `(c)`
  - `(d)`
  - `External Source`
  - `Energy`
  - `External Source`
- **All Values**: (belt), (c), (d), (m), Energy, External Source

### ammoslots
**Path**: `chummer/accessories/accessory/ammoslots`

- **Count**: 23
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

### underbarrel
**Path**: `chummer/weapons/weapon/underbarrels/underbarrel`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 16-44 characters
- **Examples**:
  - `AK-98 Grenade Launcher`
  - `Ares Alpha Grenade Launcher`
  - `Nissan Optimum II Shotgun`
  - `Defiance EX Shocker (Melee Contacts)`
  - `Lemat 2072 (Shotgun Barrel)`
- **All Values**: AK-98 Grenade Launcher, Ares Alpha Grenade Launcher, Cannon Shot (Melee), Colt M22A2 Grenade Launcher (2050), Defiance EX Shocker (Melee Contacts), Grenade: Krime Party (Flash-Bang), HK G12A4 Grenade Launcher, HK Urban Enforcer Microgrenade Launcher, Krime Ditch (Shotgun), Krime Soldier GL, Lemat 2072 (Shotgun Barrel), Mannlicher Dirmingen SX BD: Shotgun Barrel, Mannlicher Dirmingen SX BD: Small Caliber, Mannlicher Marpingen Pro D (Shotgun Barrels), Nissan Optimum II Shotgun, PJSS Model 75-III (Rifle Barrel), Rheinmetall Wrecking Ball (Morningstar Mode), Ruhrmetall SFW-30 Tracker Weapon, Steyr UCR Underbarrel Shotgun, Underbarrel Grenade Launcher

### conceal
**Path**: `chummer/accessories/accessory/conceal`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 95.2%
- **Boolean Ratio**: 14.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-6 characters
- **Examples**:
  - `-1`
  - `-1`
  - `-6`
  - `-1`
  - `1`
- **All Values**: +1, +2, -1, -2, -6, 0, 1, 2, Rating

### name
**Path**: `chummer/weapons/weapon/accessories/accessory/gears/usegear/name`

- **Count**: 20
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-41 characters
- **Examples**:
  - `Ogre Hammer SWS Assault Cannon (Commlink)`
  - `Image Link`
  - `Flare Compensation`
  - `Low Light`
  - `Vision Enhancement`
- **All Values**: Clearsight Autosoft, Flare Compensation, Image Link, Krime Ripper Sensor Array, Low Light, Meta Link, Ogre Hammer SWS Assault Cannon (Commlink), Terracotta Arms AM-47 (Commlink), Tutorsoft, Vision Enhancement, [Weapon] Targeting Autosoft

### category
**Path**: `chummer/weapons/weapon/accessories/accessory/gears/usegear/category`

- **Count**: 20
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-19 characters
- **Examples**:
  - `Commlinks`
  - `Vision Enhancements`
  - `Vision Enhancements`
  - `Vision Enhancements`
  - `Vision Enhancements`
- **All Values**: Autosofts, Commlinks, Sensors, Software, Vision Enhancements

### name
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/name`

- **Count**: 20
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-33 characters
- **Examples**:
  - `Cavalier Flash`
  - `RPK HMG`
  - `Ruhrmetall SF-20`
  - `Ultamax HMG-2`
  - `Ingram Valiant`
- **All Values**: Ares Crusader II, Ares Lancer MP Laser, Ares Redline, Cavalier Flash, Ceska Black Scorpion, FN MAG-5, Ingram Valiant, Krime Wave, Onotari Arms SIG-6, PPSK-4 Collapsible Machine Pistol, RPK HMG, Repeating Laser, Ruhrmetall SF-20, Ruhrmetall SMK 252, Shiawase Armaments Nemesis, Steyr TMP, Stoner-Ares M202, Ultamax HMG-2, Ultamax MMG, Underbarrel Laser

### useskillspec
**Path**: `chummer/weapons/weapon/useskillspec`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-17 characters
- **Examples**:
  - `Laser Weapons`
  - `Laser Weapons`
  - `Laser Weapons`
  - `Bola`
  - `Monofilament Bola`
- **All Values**: Bola, Crossbow, Grapple Gun, Grenade Launchers, Laser Weapons, Monofilament Bola, Shotguns

### name
**Path**: `chummer/accessories/accessory/gears/usegear/name`

- **Count**: 17
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 11-28 characters
- **Examples**:
  - `Camera, Micro`
  - `Vision Magnification`
  - `Laser Range Finder`
  - `Camera, Micro`
  - `Laser Range Finder`
- **All Values**: ARO of Local Maps, Camera, Micro, Can Make Commcalls, GPS Monitor, Hidden Compartment, Laser Range Finder, Micro-Lighter, Mini-Multitool, Phosphorescent Blade Coating, Radio Signal Scanner, Vision Magnification

### category
**Path**: `chummer/accessories/accessory/gears/usegear/category`

- **Count**: 17
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-23 characters
- **Examples**:
  - `Vision Devices`
  - `Vision Enhancements`
  - `Sensor Functions`
  - `Vision Devices`
  - `Sensor Functions`
- **All Values**: Electronics Accessories, Sensor Functions, Software, Survival Gear, Vision Devices, Vision Enhancements

### name
**Path**: `chummer/accessories/accessory/required/weapondetails/name`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-33 characters
- **Examples**:
  - `Ares Light Fire 70`
  - `Ares Light Fire 75`
  - `Hammerli Gemini`
  - `Enfield AS-7`
  - `Auto-Assault 16`
- **All Values**: Ares Executioner, Ares Light Fire 70, Ares Light Fire 75, Auto-Assault 16, Enfield AS-7, GE Vindicator Mini-Gun, Glock MP Custodes, HK 223C, HK Puncheon, HK Urban Enforcer, HK Urban Striker, Hammerli Gemini, Onotari Arms Pressure KS-X, PPSK-4 Collapsible Machine Pistol, PSK-3 Collapsible Heavy Pistol, Terracotta Arms Pup

### rcgroup
**Path**: `chummer/accessories/accessory/rcgroup`

- **Count**: 16
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 62.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `1`
  - `2`
- **All Values**: 1, 2

### sizecategory
**Path**: `chummer/weapons/weapon/sizecategory`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-18 characters
- **Examples**:
  - `Light Crossbows`
  - `Tasers`
  - `Tasers`
  - `Assault Rifles`
  - `Assault Rifles`
- **All Values**: Assault Rifles, Heavy Crossbows, Heavy Machine Guns, Heavy Pistols, Light Crossbows, Missile Launchers, Shotguns, Sporting Rifles, Submachine Guns, Tasers

### mount
**Path**: `chummer/weapons/weapon/mount`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-6 characters
- **Examples**:
  - `Under`
  - `Under`
  - `Under`
  - `Under`
  - `Under`
- **All Values**: Barrel, Under

### accuracy
**Path**: `chummer/accessories/accessory/accuracy`

- **Count**: 14
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `2`
  - `2`
  - `1`
  - `1`
- **All Values**: -1, 1, 2

### rating
**Path**: `chummer/weapons/weapon/accessories/accessory/rating`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `4`
  - `2`
  - `1`
  - `1`
- **All Values**: 1, 2, 4, 6

### category
**Path**: `chummer/weapons/weapon/required/weapondetails/OR/category`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-15 characters
- **Examples**:
  - `Assault Rifles`
  - `Sniper Rifles`
  - `Sporting Rifles`
  - `Assault Rifles`
  - `Sniper Rifles`
- **All Values**: Assault Rifles, Sniper Rifles, Sporting Rifles

### mount
**Path**: `chummer/weapons/weapon/accessories/accessory/mount`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-5 characters
- **Examples**:
  - `Top`
  - `Top`
  - `Stock`
  - `Top`
  - `Side`
- **All Values**: Side, Stock, Top, Under

### conceal
**Path**: `chummer/accessories/accessory/required/weapondetails/conceal`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 90.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 4

### rating
**Path**: `chummer/weapons/weapon/accessories/accessory/gears/usegear/rating`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 44.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `1`
  - `5`
  - `2`
  - `1`
- **All Values**: 1, 2, 3, 4, 5

### requireammo
**Path**: `chummer/weapons/weapon/requireammo`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: boolean_string, enum_candidate
- **Boolean Ratio**: 88.9%
- **Enum Candidate**: Yes
- **Length Range**: 5-12 characters
- **Examples**:
  - `False`
  - `False`
  - `False`
  - `False`
  - `False`
- **All Values**: False, microtorpedo

### category
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/category`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-15 characters
- **Examples**:
  - `Shotguns`
  - `Shotguns`
  - `Machine Pistols`
  - `Bows`
  - `Shotguns`
- **All Values**: Bows, Heavy Pistols, Holdouts, Light Pistols, Machine Pistols, Shotguns

### ammoreplace
**Path**: `chummer/accessories/accessory/ammoreplace`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 33.3%
- **Enum Candidate**: Yes
- **Length Range**: 2-15 characters
- **Examples**:
  - `100(belt)`
  - `24(d)`
  - `32(d)`
  - `External Source`
  - `10`
- **All Values**: 10, 100(belt), 20, 24(d), 2500(belt), 30, 32(d), 40(c), External Source

### useskill
**Path**: `chummer/weapons/weapon/required/weapondetails/OR/useskill`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-13 characters
- **Examples**:
  - `Longarms`
  - `Heavy Weapons`
  - `Longarms`
  - `Heavy Weapons`
  - `Longarms`
- **All Values**: Heavy Weapons, Longarms

### gearcategory
**Path**: `chummer/accessories/accessory/allowgear/gearcategory`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-19 characters
- **Examples**:
  - `Vision Enhancements`
  - `Custom`
  - `Autosofts`
  - `Custom`
  - `Commlinks`
- **All Values**: Autosofts, Commlinks, Custom, Vision Enhancements

### rcdeployable
**Path**: `chummer/accessories/accessory/rcdeployable`

- **Count**: 7
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

### useskill
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/useskill`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-13 characters
- **Examples**:
  - `Longarms`
  - `Longarms`
  - `Heavy Weapons`
  - `Longarms`
  - `Longarms`
- **All Values**: Heavy Weapons, Longarms

### specialmodification
**Path**: `chummer/accessories/accessory/specialmodification`

- **Count**: 7
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

### specialmodificationlimit
**Path**: `chummer/accessories/accessory/required/oneof/specialmodificationlimit`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 85.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `2`
- **All Values**: 1, 2

### spec2
**Path**: `chummer/weapons/weapon/spec2`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-15 characters
- **Examples**:
  - `Aerodynamic`
  - `Non-Aerodynamic`
  - `Non-Aerodynamic`
  - `Semi-Automatics`
  - `Revolvers`
- **All Values**: Aerodynamic, Non-Aerodynamic, Revolvers, Semi-Automatics

### conceal
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/conceal`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 83.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `-2`
  - `0`
  - `0`
  - `0`
- **All Values**: -2, 0

### spec
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/spec`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-9 characters
- **Examples**:
  - `Revolvers`
  - `Shotguns`
  - `Revolvers`
  - `Shotguns`
  - `Revolvers`
- **All Values**: Revolvers, Shotguns

### spec2
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/spec2`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-9 characters
- **Examples**:
  - `Revolvers`
  - `Shotguns`
  - `Revolvers`
  - `Shotguns`
  - `Revolvers`
- **All Values**: Revolvers, Shotguns

### type
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/type`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Melee`
  - `Melee`
  - `Melee`
  - `Melee`
  - `Melee`

### ammobonus
**Path**: `chummer/accessories/accessory/ammobonus`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 80.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-11 characters
- **Examples**:
  - `-2`
  - `50 * Rating`
  - `50`
  - `-50`
  - `-25`
- **All Values**: -2, -25, -50, 50, 50 * Rating

### category
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/AND/OR/category`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-13 characters
- **Examples**:
  - `Tasers`
  - `Holdouts`
  - `Light Pistols`
  - `Heavy Pistols`
- **All Values**: Heavy Pistols, Holdouts, Light Pistols, Tasers

### damage
**Path**: `chummer/accessories/accessory/damage`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `-2`
  - `-1`
  - `-1`
  - `1`
- **All Values**: -1, -2, 1

### id
**Path**: `chummer/accessories/accessory/required/weapondetails/id`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `ad28b2dd-4f4f-4089-af6b-39f3ff6900fd`
  - `ad28b2dd-4f4f-4089-af6b-39f3ff6900fd`
  - `dc1ce668-94ba-44a5-a61b-d5b330537ac2`
  - `65b7803a-0efe-44d9-8b85-6410644f079d`
- **All Values**: 65b7803a-0efe-44d9-8b85-6410644f079d, ad28b2dd-4f4f-4089-af6b-39f3ff6900fd, dc1ce668-94ba-44a5-a61b-d5b330537ac2

### conceal
**Path**: `chummer/weapons/weapon/required/weapondetails/conceal`

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

### spec
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/spec`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-17 characters
- **Examples**:
  - `Grenade Launchers`
  - `Missile Launchers`
  - `Bow`
- **All Values**: Bow, Grenade Launchers, Missile Launchers

### ammo
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/ammo`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `(cy)`
  - `(cy)`
  - `(cy)`

### ammocategory
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/ammocategory`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Shotguns`
  - `Shotguns`
  - `Shotguns`

### name
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/name`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 15-23 characters
- **Examples**:
  - `Glock MP Custodes (MPV)`
  - `Glock MP Custodes`
  - `HK Urban Combat`
- **All Values**: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat

### extramount
**Path**: `chummer/accessories/accessory/extramount`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-12 characters
- **Examples**:
  - `Under/Barrel`
  - `Side`
  - `Barrel`
- **All Values**: Barrel, Side, Under/Barrel

### extramount
**Path**: `chummer/weapons/weapon/extramount`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-5 characters
- **Examples**:
  - `Under`
  - `Side`
- **All Values**: Side, Under

### gearcategory
**Path**: `chummer/weapons/weapon/allowgear/gearcategory`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-6 characters
- **Examples**:
  - `Drugs`
  - `Toxins`
- **All Values**: Drugs, Toxins

### weight
**Path**: `chummer/weapons/weapon/weight`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `60`
  - `80`
- **All Values**: 60, 80

### maxrating
**Path**: `chummer/weapons/weapon/maxrating`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 6-6 characters
- **Examples**:
  - `100000`
  - `100000`

### ammocategory
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/ammocategory`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 17-17 characters
- **Examples**:
  - `Grenade Launchers`
  - `Missile Launchers`
- **All Values**: Grenade Launchers, Missile Launchers

### spec2
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/spec2`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 17-17 characters
- **Examples**:
  - `Grenade Launchers`
  - `Missile Launchers`
- **All Values**: Grenade Launchers, Missile Launchers

### ammo
**Path**: `chummer/accessories/accessory/required/weapondetails/ammo`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `(cy)`
  - `(cy)`

### ammo
**Path**: `chummer/accessories/accessory/required/oneof/weapondetails/OR/ammo`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-4 characters
- **Examples**:
  - `(cy)`
  - `(d)`
- **All Values**: (cy), (d)

### weapon
**Path**: `chummer/accessories/accessory/addunderbarrels/weapon`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 16-19 characters
- **Examples**:
  - `Underbarrel Shotgun`
  - `Krime Stun-O-Net`
- **All Values**: Krime Stun-O-Net, Underbarrel Shotgun

### modifyammocapacity
**Path**: `chummer/accessories/accessory/modifyammocapacity`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-15 characters
- **Examples**:
  - `* 3 div 4`
  - `+(Weapon * 0.5)`
- **All Values**: * 3 div 4, +(Weapon * 0.5)

### mode
**Path**: `chummer/accessories/accessory/required/weapondetails/mode`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 2-2 characters
- **Examples**:
  - `SA`
  - `SA`

### ammoslots
**Path**: `chummer/weapons/weapon/ammoslots`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`

### accuracy
**Path**: `chummer/weapons/weapon/wirelessweaponbonus/accuracy`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### mount
**Path**: `chummer/weapons/weapon/doubledcostaccessorymounts/mount`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Barrel`

### singleshot
**Path**: `chummer/weapons/weapon/singleshot`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### shortburst
**Path**: `chummer/weapons/weapon/shortburst`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`

### type
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/type`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Melee`

### conceal
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/conceal`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`

### useskill
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/useskill`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `Pistols`

### mount
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/accessorymounts/mount`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Stock`

### mount
**Path**: `chummer/accessories/accessory/required/weapondetails/accessorymounts/mount`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Stock`

### rangemodifier
**Path**: `chummer/accessories/accessory/rangemodifier`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### accessorycostmultiplier
**Path**: `chummer/accessories/accessory/accessorycostmultiplier`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### damagetype
**Path**: `chummer/accessories/accessory/damagetype`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `P`

### damage
**Path**: `chummer/accessories/accessory/required/weapondetails/damage`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `S(e)`

### type
**Path**: `chummer/accessories/accessory/required/weapondetails/type`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Melee`

### ap
**Path**: `chummer/accessories/accessory/ap`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### reach
**Path**: `chummer/accessories/accessory/reach`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### addmount
**Path**: `chummer/accessories/accessory/addmount`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Under`

### replacerange
**Path**: `chummer/accessories/accessory/replacerange`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Heavy Pistols`

## Attributes

### category@blackmarket
**Path**: `chummer/categories/category@blackmarket`

- **Count**: 31
- **Unique Values**: 1
- **Examples**:
  - `Weapons`
  - `Weapons`
  - `Weapons`
  - `Weapons`
  - `Weapons`

### category@type
**Path**: `chummer/categories/category@type`

- **Count**: 31
- **Unique Values**: 11
- **Enum Candidate**: Yes
- **Examples**:
  - `melee`
  - `melee`
  - `melee`
  - `melee`
  - `exotic`
- **All Values**: bow, cannon, crossbow, energy, exotic, flame, glauncher, gun, melee, mlauncher, taser

### ammo@operation
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/ammo@operation`

- **Count**: 24
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`
  - `contains`
  - `contains`
  - `contains`

### category@gunneryspec
**Path**: `chummer/categories/category@gunneryspec`

- **Count**: 19
- **Unique Values**: 4
- **Enum Candidate**: Yes
- **Examples**:
  - `Energy`
  - `Ballistic`
  - `Ballistic`
  - `Ballistic`
  - `Ballistic`
- **All Values**: Artillery, Ballistic, Energy, Rocket

### conceal@operation
**Path**: `chummer/accessories/accessory/required/weapondetails/conceal@operation`

- **Count**: 11
- **Unique Values**: 3
- **Enum Candidate**: Yes
- **Examples**:
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`
- **All Values**: greaterthan, greaterthanequals, lessthanequals

### conceal@operation
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/conceal@operation`

- **Count**: 6
- **Unique Values**: 1
- **Examples**:
  - `lessthanequals`
  - `lessthanequals`
  - `lessthanequals`
  - `lessthanequals`
  - `lessthanequals`

### useskill@NOT
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/AND/useskill@NOT`

- **Count**: 5
- **Unique Values**: 0

### useskill@operation
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/AND/useskill@operation`

- **Count**: 5
- **Unique Values**: 1
- **Examples**:
  - `exists`
  - `exists`
  - `exists`
  - `exists`
  - `exists`

### useskill@NOT
**Path**: `chummer/weapons/weapon/required/weapondetails/OR/AND/useskill@NOT`

- **Count**: 4
- **Unique Values**: 0

### useskill@operation
**Path**: `chummer/weapons/weapon/required/weapondetails/OR/AND/useskill@operation`

- **Count**: 4
- **Unique Values**: 1
- **Examples**:
  - `exists`
  - `exists`
  - `exists`
  - `exists`

### category@operation
**Path**: `chummer/accessories/accessory/required/weapondetails/OR/category@operation`

- **Count**: 4
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`
  - `contains`
  - `contains`

### conceal@operation
**Path**: `chummer/weapons/weapon/required/weapondetails/conceal@operation`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `greaterthan`
  - `greaterthan`
  - `greaterthan`

### ammo@operation
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/ammo@operation`

- **Count**: 3
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`
  - `contains`

### name@select
**Path**: `chummer/weapons/weapon/accessories/accessory/gears/usegear/name@select`

- **Count**: 2
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Longarms`
  - `Krime Ripper`
- **All Values**: Krime Ripper, Longarms

### name@operation
**Path**: `chummer/accessories/accessory/required/weapondetails/name@operation`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`

### ammo@operation
**Path**: `chummer/accessories/accessory/required/weapondetails/ammo@operation`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`

### ammo@operation
**Path**: `chummer/accessories/accessory/required/oneof/weapondetails/OR/ammo@operation`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`

### mode@operation
**Path**: `chummer/accessories/accessory/required/weapondetails/mode@operation`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema weapons.xsd`

### name@operation
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/name@operation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `contains`

### useskill@NOT
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/AND/useskill@NOT`

- **Count**: 1
- **Unique Values**: 0

### useskill@operation
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/AND/useskill@operation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `exists`

### conceal@operation
**Path**: `chummer/accessories/accessory/forbidden/weapondetails/OR/conceal@operation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `lessthanequals`

### OR@NOT
**Path**: `chummer/accessories/accessory/required/weapondetails/OR@NOT`

- **Count**: 1
- **Unique Values**: 0

### damage@operation
**Path**: `chummer/accessories/accessory/required/weapondetails/damage@operation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `contains`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 31 unique values
  - Values: Assault Cannons, Bio-Weapon, Bows, Carbines, Cyberweapon, Exotic Ranged Weapons, Grenade Launchers, Heavy Pistols, Improvised Weapons, Light Machine Guns, Light Pistols, Machine Pistols, Medium Machine Guns, Micro-Drone Weapons, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles, Unarmed, Underbarrel Weapons
- **category** (`chummer/weapons/weapon/category`): 32 unique values
  - Values: Assault Cannons, Bio-Weapon, Bows, Carbines, Cyberweapon, Exotic Ranged Weapons, Gear, Grenade Launchers, Heavy Pistols, Improvised Weapons, Light Machine Guns, Light Pistols, Machine Pistols, Medium Machine Guns, Missile Launchers, Quality, Shotguns, Sporting Rifles, Unarmed, Underbarrel Weapons
- **type** (`chummer/weapons/weapon/type`): 2 unique values
  - Values: Melee, Ranged
- **conceal** (`chummer/weapons/weapon/conceal`): 15 unique values
  - Values: -1, -10, -2, -3, -4, -5, -6, 0, 1, 10, 2, 3, 4, 6, 8
- **accuracy** (`chummer/weapons/weapon/accuracy`): 15 unique values
  - Values: 0, 2, 3, 3+number({STR} >= 5)+number({STR} >= 7), 4, 5, 6, 7, 8, 9, Missile, Physical, Physical+1, Physical-1, Physical-2
- **reach** (`chummer/weapons/weapon/reach`): 5 unique values
  - Values: -1, 0, 1, 2, 3
- **ap** (`chummer/weapons/weapon/ap`): 24 unique values
  - Values: +1, +3, +4, +4//-8, +5, -, -(Rating/4), -1, -1//-2, -10, -3, -4, -4//-10, -6, -8, -{MAG}*0.5, 0, 4, Missile, Special
- **mode** (`chummer/weapons/weapon/mode`): 13 unique values
  - Values: -, 0, BF, BF/FA, FA, SA, SA/BF, SA/BF/FA, SA/FA, SS, SS/BF, SS/FA, SS/SA
- **rc** (`chummer/weapons/weapon/rc`): 10 unique values
  - Values: -, -1, -2, -3, -5, -6, 0, 1, 2, 3
- **source** (`chummer/weapons/weapon/source`): 29 unique values
  - Values: AP, CA, DT, GH3, HAMG, HT, R5, RF, RG, SASS, SFM, SG, SHB, SHB4, SL, SLG2, SR5, SS, TCT, TSG
- **mount** (`chummer/weapons/weapon/accessorymounts/mount`): 5 unique values
  - Values: Barrel, Side, Stock, Top, Under
- **name** (`chummer/weapons/weapon/accessories/accessory/gears/usegear/name`): 11 unique values
  - Values: Clearsight Autosoft, Flare Compensation, Image Link, Krime Ripper Sensor Array, Low Light, Meta Link, Ogre Hammer SWS Assault Cannon (Commlink), Terracotta Arms AM-47 (Commlink), Tutorsoft, Vision Enhancement, [Weapon] Targeting Autosoft
- **category** (`chummer/weapons/weapon/accessories/accessory/gears/usegear/category`): 5 unique values
  - Values: Autosofts, Commlinks, Sensors, Software, Vision Enhancements
- **rating** (`chummer/weapons/weapon/accessories/accessory/gears/usegear/rating`): 5 unique values
  - Values: 1, 2, 3, 4, 5
- **underbarrel** (`chummer/weapons/weapon/underbarrels/underbarrel`): 20 unique values
  - Values: AK-98 Grenade Launcher, Ares Alpha Grenade Launcher, Cannon Shot (Melee), Colt M22A2 Grenade Launcher (2050), Defiance EX Shocker (Melee Contacts), Grenade: Krime Party (Flash-Bang), HK G12A4 Grenade Launcher, HK Urban Enforcer Microgrenade Launcher, Krime Ditch (Shotgun), Krime Soldier GL, Lemat 2072 (Shotgun Barrel), Mannlicher Dirmingen SX BD: Shotgun Barrel, Mannlicher Dirmingen SX BD: Small Caliber, Mannlicher Marpingen Pro D (Shotgun Barrels), Nissan Optimum II Shotgun, PJSS Model 75-III (Rifle Barrel), Rheinmetall Wrecking Ball (Morningstar Mode), Ruhrmetall SFW-30 Tracker Weapon, Steyr UCR Underbarrel Shotgun, Underbarrel Grenade Launcher
- **addweapon** (`chummer/weapons/weapon/addweapon`): 21 unique values
  - Values: Barrens Special: Bayonet, Gunstock War Club (Thrown), HK XM30 Carbine, HK XM30 Grenade Launcher, HK XM30 LMG, HK XM30 Shotgun, HK XM30 Sniper, Krime Reaver Knob, Krime Reaver Pick, Krime Trollbow Horns, Krime Whammy (Melee), Onotari HL-13 (Sniper Rifle), Onotari HL-13 Personal Defense Weapon, Onotari HL-13 Urban Assault, Steyr AUG-CSL Carbine (2050), Steyr AUG-CSL III (Carbine), Steyr AUG-CSL III (LMG), Steyr AUG-CSL III (Sniper Rifle), Steyr AUG-CSL LMG (2050), Steyr AUG-CSL SMG (2050)
- **ammocategory** (`chummer/weapons/weapon/ammocategory`): 8 unique values
  - Values: Assault Rifles, Grenade Launchers, Heavy Pistols, Holdouts, Light Pistols, Shotguns, Sniper Rifles, Sporting Rifles
- **range** (`chummer/weapons/weapon/range`): 27 unique values
  - Values: Aerodynamic Grenade, Flamethrowers, Grenade Launchers, Harpoon Gun, Heavy Pistols, Holdouts, Light Crossbows, Light Machine Guns, Light Pistols, Machine Pistols, Medium Crossbows, Missile Launchers, Net, Shotguns, Shotguns (slug), Sniper Rifles, Sporting Rifles, Standard Grenade, Tasers, Thrown Knife
- **spec** (`chummer/weapons/weapon/spec`): 37 unique values
  - Values: Aerodynamic, Axes, Batons, Battering Ram, Grapple Gun, Grenade Launchers, Hammers, Knives, Machine Guns, Modified Spray Pen, Natural Weapons, Non-Aerodynamic, Pepper Punch Pen, Revolvers, Saps, Semi-Automatics, Shotguns, Slingshot, Sporting Rifles, Staves
- **useskill** (`chummer/weapons/weapon/useskill`): 12 unique values
  - Values: Archery, Automatics, Blades, Clubs, Exotic Melee Weapon, Exotic Ranged Weapon, Gunnery, Heavy Weapons, Longarms, Pistols, Throwing Weapons, Unarmed Combat
- **alternaterange** (`chummer/weapons/weapon/alternaterange`): 2 unique values
  - Values: Harpoon Gun (Underwater), Shotguns (flechette)
- **requireammo** (`chummer/weapons/weapon/requireammo`): 2 unique values
  - Values: False, microtorpedo
- **weapontype** (`chummer/weapons/weapon/weapontype`): 25 unique values
  - Values: energy, firefighting cannons, flame, flaregun, glauncher, grapplegun, gun, gyrojet, man-catcher, microglauncher, netgun, netgunxl, pepperpunch, sfw-30 main weapon, sfw-30 underbarrel weapon, slingshot, spraypen, squirtgun, torpglauncher, trackstopper
- **sizecategory** (`chummer/weapons/weapon/sizecategory`): 10 unique values
  - Values: Assault Rifles, Heavy Crossbows, Heavy Machine Guns, Heavy Pistols, Light Crossbows, Missile Launchers, Shotguns, Sporting Rifles, Submachine Guns, Tasers
- **spec2** (`chummer/weapons/weapon/spec2`): 4 unique values
  - Values: Aerodynamic, Non-Aerodynamic, Revolvers, Semi-Automatics
- **allowaccessory** (`chummer/weapons/weapon/allowaccessory`): 2 unique values
  - Values: False, True
- **useskillspec** (`chummer/weapons/weapon/useskillspec`): 7 unique values
  - Values: Bola, Crossbow, Grapple Gun, Grenade Launchers, Laser Weapons, Monofilament Bola, Shotguns
- **rating** (`chummer/weapons/weapon/accessories/accessory/rating`): 4 unique values
  - Values: 1, 2, 4, 6
- **mount** (`chummer/weapons/weapon/mount`): 2 unique values
  - Values: Barrel, Under
- **category** (`chummer/weapons/weapon/required/weapondetails/OR/AND/OR/category`): 9 unique values
  - Values: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles
- **category** (`chummer/weapons/weapon/required/weapondetails/OR/category`): 3 unique values
  - Values: Assault Rifles, Sniper Rifles, Sporting Rifles
- **useskill** (`chummer/weapons/weapon/required/weapondetails/OR/useskill`): 2 unique values
  - Values: Heavy Weapons, Longarms
- **extramount** (`chummer/weapons/weapon/extramount`): 2 unique values
  - Values: Side, Under
- **gearcategory** (`chummer/weapons/weapon/allowgear/gearcategory`): 2 unique values
  - Values: Drugs, Toxins
- **weight** (`chummer/weapons/weapon/weight`): 2 unique values
  - Values: 60, 80
- **mount** (`chummer/weapons/weapon/accessories/accessory/mount`): 4 unique values
  - Values: Side, Stock, Top, Under
- **mount** (`chummer/accessories/accessory/mount`): 9 unique values
  - Values: Barrel, Side, Stock, Top, Top/Under, Top/Under/Barrel/Side/Internal, Top/Under/Side, Under, Under/Barrel
- **avail** (`chummer/accessories/accessory/avail`): 36 unique values
  - Values: +2F, +4, 0, 10, 11F, 12, 14R, 15R, 16F, 18F, 18R, 2R, 3, 3R, 6, 7R, 8, 8F, 8R, 9F
- **cost** (`chummer/accessories/accessory/cost`): 44 unique values
  - Values: 0, 10, 1000, 150, 1700, 20, 200, 2000, 22000, 25, 250, 300, 35, 3500, 70, 700, 750, 800, 900, Weapon Cost
- **source** (`chummer/accessories/accessory/source`): 12 unique values
  - Values: 2050, BTB, CF, GH3, HT, KK, RG, SAG, SL, SLG2, SOTG, SR5
- **page** (`chummer/accessories/accessory/page`): 41 unique values
  - Values: 0, 1, 12, 131, 161, 180, 181, 182, 186, 197, 21, 22, 25, 27, 35, 42, 432, 433, 46, 53
- **rating** (`chummer/accessories/accessory/rating`): 6 unique values
  - Values: 0, 1, 10, 1000, 2, 6
- **name** (`chummer/accessories/accessory/required/weapondetails/name`): 16 unique values
  - Values: Ares Executioner, Ares Light Fire 70, Ares Light Fire 75, Auto-Assault 16, Enfield AS-7, GE Vindicator Mini-Gun, Glock MP Custodes, HK 223C, HK Puncheon, HK Urban Enforcer, HK Urban Striker, Hammerli Gemini, Onotari Arms Pressure KS-X, PPSK-4 Collapsible Machine Pistol, PSK-3 Collapsible Heavy Pistol, Terracotta Arms Pup
- **accessory** (`chummer/accessories/accessory/forbidden/oneof/accessory`): 25 unique values
  - Values: Advanced Safety System, Basic, Advanced Safety System, Electro Shocker, Advanced Safety System, Explosive Self Destruct, Advanced Safety System, Immobilization, Advanced Safety System, Self Destruct, Airburst Link, Ammo Skip, Ceramic/Plasteel Components, Chameleon Coating (Rifle), Easy Breakdown (Powered), Electronic Firing, Safe Target System, Base, Sawed Off/Shortbarrel, Sawed Off/Shortbarrel and Stock Removal, Smart Firing Platform, Smartgun System, External, Smartgun System, Internal, Stock Removal, Weapon Commlink, Weapon Personality
- **ammocategory** (`chummer/accessories/accessory/required/weapondetails/OR/ammocategory`): 2 unique values
  - Values: Grenade Launchers, Missile Launchers
- **category** (`chummer/accessories/accessory/required/weapondetails/OR/category`): 21 unique values
  - Values: Assault Cannons, Assault Rifles, Bows, Flamethrowers, Grenade Launchers, Heavy Machine Guns, Heavy Pistols, Holdouts, Laser Weapons, Light Machine Guns, Light Pistols, Machine Pistols, Medium Machine Guns, Missile Launchers, Pistol, Shotguns, Sniper Rifles, Sporting Rifles, Tasers, Underbarrel Weapons
- **spec** (`chummer/accessories/accessory/required/weapondetails/OR/spec`): 3 unique values
  - Values: Bow, Grenade Launchers, Missile Launchers
- **spec2** (`chummer/accessories/accessory/required/weapondetails/OR/spec2`): 2 unique values
  - Values: Grenade Launchers, Missile Launchers
- **rc** (`chummer/accessories/accessory/rc`): 5 unique values
  - Values: 1, 2, 3, 5, 6
- **rcgroup** (`chummer/accessories/accessory/rcgroup`): 2 unique values
  - Values: 1, 2
- **conceal** (`chummer/accessories/accessory/conceal`): 9 unique values
  - Values: +1, +2, -1, -2, -6, 0, 1, 2, Rating
- **conceal** (`chummer/accessories/accessory/required/weapondetails/OR/conceal`): 2 unique values
  - Values: -2, 0
- **name** (`chummer/accessories/accessory/required/weapondetails/OR/name`): 20 unique values
  - Values: Ares Crusader II, Ares Lancer MP Laser, Ares Redline, Cavalier Flash, Ceska Black Scorpion, FN MAG-5, Ingram Valiant, Krime Wave, Onotari Arms SIG-6, PPSK-4 Collapsible Machine Pistol, RPK HMG, Repeating Laser, Ruhrmetall SF-20, Ruhrmetall SMK 252, Shiawase Armaments Nemesis, Steyr TMP, Stoner-Ares M202, Ultamax HMG-2, Ultamax MMG, Underbarrel Laser
- **gearcategory** (`chummer/accessories/accessory/allowgear/gearcategory`): 4 unique values
  - Values: Autosofts, Commlinks, Custom, Vision Enhancements
- **name** (`chummer/accessories/accessory/gears/usegear/name`): 11 unique values
  - Values: ARO of Local Maps, Camera, Micro, Can Make Commcalls, GPS Monitor, Hidden Compartment, Laser Range Finder, Micro-Lighter, Mini-Multitool, Phosphorescent Blade Coating, Radio Signal Scanner, Vision Magnification
- **category** (`chummer/accessories/accessory/gears/usegear/category`): 6 unique values
  - Values: Electronics Accessories, Sensor Functions, Software, Survival Gear, Vision Devices, Vision Enhancements
- **accuracy** (`chummer/accessories/accessory/accuracy`): 3 unique values
  - Values: -1, 1, 2
- **name** (`chummer/accessories/accessory/forbidden/weapondetails/OR/name`): 14 unique values
  - Values: Ares Crusader II, Ceska Black Scorpion, HK Urban Assassin, HK Urban Combat, HK Urban Enforcer, HK Urban Fighter, HK Urban Striker, Hammerli Gemini, Onotari Arms Pressure KS-X, Onotari Arms SIG-6, PPSK-4 Collapsible Machine Pistol, PSK-3 Collapsible Heavy Pistol, Ruhrmetall SMK 252, Steyr TMP
- **category** (`chummer/accessories/accessory/forbidden/weapondetails/OR/category`): 6 unique values
  - Values: Bows, Heavy Pistols, Holdouts, Light Pistols, Machine Pistols, Shotguns
- **spec** (`chummer/accessories/accessory/forbidden/weapondetails/OR/spec`): 2 unique values
  - Values: Revolvers, Shotguns
- **spec2** (`chummer/accessories/accessory/forbidden/weapondetails/OR/spec2`): 2 unique values
  - Values: Revolvers, Shotguns
- **ammo** (`chummer/accessories/accessory/required/weapondetails/OR/ammo`): 6 unique values
  - Values: (belt), (c), (d), (m), Energy, External Source
- **ammoreplace** (`chummer/accessories/accessory/ammoreplace`): 9 unique values
  - Values: 10, 100(belt), 20, 24(d), 2500(belt), 30, 32(d), 40(c), External Source
- **accessory** (`chummer/accessories/accessory/required/oneof/accessory`): 6 unique values
  - Values: Drum Magazine, 24-round, Drum Magazine, 32-round, Krime Dual-Mode External Smartgun Link, Safe Target System, Base, Smartgun System, External, Smartgun System, Internal
- **conceal** (`chummer/accessories/accessory/required/weapondetails/conceal`): 2 unique values
  - Values: 0, 4
- **name** (`chummer/accessories/accessory/forbidden/weapondetails/name`): 3 unique values
  - Values: Glock MP Custodes, Glock MP Custodes (MPV), HK Urban Combat
- **category** (`chummer/accessories/accessory/forbidden/weapondetails/OR/AND/OR/category`): 4 unique values
  - Values: Heavy Pistols, Holdouts, Light Pistols, Tasers
- **ammo** (`chummer/accessories/accessory/required/oneof/weapondetails/OR/ammo`): 2 unique values
  - Values: (cy), (d)
- **ammobonus** (`chummer/accessories/accessory/ammobonus`): 5 unique values
  - Values: -2, -25, -50, 50, 50 * Rating
- **extramount** (`chummer/accessories/accessory/extramount`): 3 unique values
  - Values: Barrel, Side, Under/Barrel
- **useskill** (`chummer/accessories/accessory/required/weapondetails/OR/useskill`): 2 unique values
  - Values: Heavy Weapons, Longarms
- **category** (`chummer/accessories/accessory/required/weapondetails/OR/AND/OR/category`): 9 unique values
  - Values: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles
- **weapon** (`chummer/accessories/accessory/addunderbarrels/weapon`): 2 unique values
  - Values: Krime Stun-O-Net, Underbarrel Shotgun
- **damage** (`chummer/accessories/accessory/damage`): 3 unique values
  - Values: -1, -2, 1
- **id** (`chummer/accessories/accessory/required/weapondetails/id`): 3 unique values
  - Values: 65b7803a-0efe-44d9-8b85-6410644f079d, ad28b2dd-4f4f-4089-af6b-39f3ff6900fd, dc1ce668-94ba-44a5-a61b-d5b330537ac2
- **modifyammocapacity** (`chummer/accessories/accessory/modifyammocapacity`): 2 unique values
  - Values: * 3 div 4, +(Weapon * 0.5)
- **specialmodificationlimit** (`chummer/accessories/accessory/required/oneof/specialmodificationlimit`): 2 unique values
  - Values: 1, 2

### Numeric Type Candidates
- **cost** (`chummer/weapons/weapon/cost`): 99.5% numeric
  - Examples: 26000, 24500, 23000
- **page** (`chummer/weapons/weapon/page`): 100.0% numeric
  - Examples: 45, 46, 35
- **ammoslots** (`chummer/weapons/weapon/ammoslots`): 100.0% numeric
  - Examples: 6
- **accuracy** (`chummer/weapons/weapon/wirelessweaponbonus/accuracy`): 100.0% numeric
  - Examples: 2
- **conceal** (`chummer/weapons/weapon/required/weapondetails/conceal`): 100.0% numeric
  - Examples: 0, 0, 0
- **singleshot** (`chummer/weapons/weapon/singleshot`): 100.0% numeric
  - Examples: 2
- **shortburst** (`chummer/weapons/weapon/shortburst`): 100.0% numeric
  - Examples: 6
- **maxrating** (`chummer/weapons/weapon/maxrating`): 100.0% numeric
  - Examples: 100000, 100000
- **ammoslots** (`chummer/accessories/accessory/ammoslots`): 100.0% numeric
  - Examples: 1, 1, 1
- **conceal** (`chummer/accessories/accessory/forbidden/weapondetails/OR/conceal`): 100.0% numeric
  - Examples: 0
- **rangemodifier** (`chummer/accessories/accessory/rangemodifier`): 100.0% numeric
  - Examples: 1
- **accessorycostmultiplier** (`chummer/accessories/accessory/accessorycostmultiplier`): 100.0% numeric
  - Examples: 2
- **ap** (`chummer/accessories/accessory/ap`): 100.0% numeric
  - Examples: -1
- **reach** (`chummer/accessories/accessory/reach`): 100.0% numeric
  - Examples: 1

### Boolean Type Candidates
- **cyberware** (`chummer/weapons/weapon/cyberware`): 100.0% boolean
  - Examples: True, True, True
- **rcdeployable** (`chummer/accessories/accessory/rcdeployable`): 100.0% boolean
  - Examples: True, True, True
- **specialmodification** (`chummer/accessories/accessory/specialmodification`): 100.0% boolean
  - Examples: True, True, True
