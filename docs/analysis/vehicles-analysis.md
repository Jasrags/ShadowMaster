# Analysis Report: vehicles.xml

**File**: `data\chummerxml\vehicles.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 12716
- **Unique Fields**: 110
- **Unique Attributes**: 24
- **Unique Element Types**: 159

## Fields

### name
**Path**: `chummer/vehicles/vehicle/mods/name`

- **Count**: 719
- **Presence Rate**: 100.0%
- **Unique Values**: 93
- **Type Patterns**: string
- **Length Range**: 3-48 characters
- **Examples**:
  - `Improved Economy`
  - `Enviroseal`
  - `Gyro-Stabilization`
  - `Gyro-Stabilization`
  - `Smart Tires`

### name
**Path**: `chummer/vehicles/vehicle/gears/gear/name`

- **Count**: 381
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-18 characters
- **Examples**:
  - `Sensor Array`
  - `Sensor Array`
  - `Sensor Array`
  - `Sensor Array`
  - `Sensor Array`
- **All Values**: Grenade: Flash-Pak, Holster, Medkit, Sensor Array

### id
**Path**: `chummer/vehicles/vehicle/id`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 380
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `c0d3e7fd-d5fd-48c4-b49d-0c7dea26895d`
  - `d43b2b6a-d6e6-460a-ab75-ca445db06dde`
  - `be4aa3ae-6725-4082-a5d2-8fa8d1e91640`
  - `ce6e90f6-2be6-42f4-a1e7-b633b40604c2`
  - `cfafdbac-509e-49f3-a62a-5cfa8e987e0f`

### name
**Path**: `chummer/vehicles/vehicle/name`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 380
- **Type Patterns**: string
- **Length Range**: 4-60 characters
- **Examples**:
  - `Dodge Scoot (Scooter)`
  - `Daihatsu-Caterpillar Horseman`
  - `Ares-Segway Terrier`
  - `Horizon-Doble Revolution`
  - `Evo Falcon-EX`

### page
**Path**: `chummer/vehicles/vehicle/page`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 129
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 0.5%
- **Length Range**: 1-3 characters
- **Examples**:
  - `462`
  - `41`
  - `42`
  - `42`
  - `43`

### source
**Path**: `chummer/vehicles/vehicle/source`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 22
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 8.4%
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `R5`
  - `R5`
  - `R5`
  - `R5`
- **All Values**: 2050, BB, CA, HAMG, HT, KK, NF, NP, R5, SFME, SHB, SHB3, SL, SLG7, SOTG, SR5, SS, TCT, TSG, TVG

### accel
**Path**: `chummer/vehicles/vehicle/accel`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 38.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `3`
  - `1/2`
- **All Values**: 0, 1, 1/1, 1/2, 1/3, 2, 2/3, 2/4, 3, 3/2, 4, 5, 6, 7, 8

### armor
**Path**: `chummer/vehicles/vehicle/armor`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 22
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 15.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `4`
  - `3`
  - `2`
  - `6`
  - `9`
- **All Values**: 0, 1, 10, 12, 13, 14, 15, 16, 2, 20, 24, 25, 27, 3, 4, 5, 6, 7, 8, 9

### avail
**Path**: `chummer/vehicles/vehicle/avail`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 46
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 68.2%
- **Boolean Ratio**: 26.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `4`
  - `0`

### body
**Path**: `chummer/vehicles/vehicle/body`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 28
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 8.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `4`
  - `4`
  - `2`
  - `6`
  - `7`
- **All Values**: 0, 1, 10, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 27, 30, 6, 8, 9

### category
**Path**: `chummer/vehicles/vehicle/category`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-23 characters
- **Examples**:
  - `Bikes`
  - `Bikes`
  - `Bikes`
  - `Bikes`
  - `Bikes`
- **All Values**: Bikes, Boats, Cars, Corpsec/Police/Military, Drones: Anthro, Drones: Huge, Drones: Large, Drones: Medium, Drones: Micro, Drones: Mini, Drones: Missile, Drones: Small, Fixed-Wing Aircraft, Hovercraft, LTAV, Municipal/Construction, Rotorcraft, Submarines, Trucks, VTOL/VSTOL

### cost
**Path**: `chummer/vehicles/vehicle/cost`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 165
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 99.7%
- **Boolean Ratio**: 1.1%
- **Length Range**: 1-18 characters
- **Examples**:
  - `3000`
  - `12000`
  - `4500`
  - `8000`
  - `10000`

### handling
**Path**: `chummer/vehicles/vehicle/handling`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 32
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 2.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `4/3`
  - `3/1`
  - `5/2`
  - `5/3`
  - `3/5`

### pilot
**Path**: `chummer/vehicles/vehicle/pilot`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 22.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
  - `2`
  - `2`
  - `1`
- **All Values**: 0, 1, 2, 3, 4, 5, 6

### sensor
**Path**: `chummer/vehicles/vehicle/sensor`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 13.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
  - `2`
  - `2`
  - `1`
- **All Values**: 0, 1, 2, 3, 4, 5, 6, 7, 8

### speed
**Path**: `chummer/vehicles/vehicle/speed`

- **Count**: 380
- **Presence Rate**: 100.0%
- **Unique Values**: 21
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 10.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `3`
  - `3`
  - `2`
  - `4`
  - `2/3`
- **All Values**: 0, 1, 1/1, 1/4, 1/7, 2, 2/3, 2/5, 3, 3/4, 3/6, 4, 4/3, 4/5, 5, 5/3, 6, 7, 8, 9

### rating
**Path**: `chummer/vehicles/vehicle/gears/gear/rating`

- **Count**: 377
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 8.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
  - `2`
  - `2`
  - `1`
- **All Values**: 1, 2, 3, 4, 5, 6, 8

### maxrating
**Path**: `chummer/vehicles/vehicle/gears/gear/maxrating`

- **Count**: 376
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 1.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`
  - `6`
  - `6`
  - `6`
  - `6`
- **All Values**: 1, 2, 3, 4, 5, 6, 7, 8

### seats
**Path**: `chummer/vehicles/vehicle/seats`

- **Count**: 270
- **Presence Rate**: 100.0%
- **Unique Values**: 22
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 17.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `2`
- **All Values**: 0, 1, 10, 12, 14, 16, 20, 200, 22, 24, 3, 30, 4, 5, 50, 53, 6, 7, 8, 9

### id
**Path**: `chummer/mods/mod/id`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 197
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `b062f16a-52ab-40d5-8985-d71b8ee1923c`
  - `7f616742-0460-46fb-bd98-b73ff6123ed4`
  - `a850f813-afd4-40ce-a418-8790fe39cfa5`
  - `b2e3b364-ff22-4dd7-b5ea-2990ce2e8353`
  - `87713603-78f3-46d5-8e3c-b6fecc41203f`

### name
**Path**: `chummer/mods/mod/name`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 194
- **Type Patterns**: string
- **Length Range**: 3-54 characters
- **Examples**:
  - `Tracked Propulsion`
  - `Signature Dampening`
  - `FlashTech`
  - `Enviroseal`
  - `Drone Rail`

### page
**Path**: `chummer/mods/mod/page`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 46
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 95.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `?`
  - `?`
  - `?`
  - `?`
  - `?`

### source
**Path**: `chummer/mods/mod/source`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 1.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `R5`
  - `R5`
  - `R5`
  - `R5`
  - `R5`
- **All Values**: 2050, BB, HT, KK, R5, RF, SAG, SFME, SHB, SHB3, SL, SR5, SS, TCT

### avail
**Path**: `chummer/mods/mod/avail`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 37
- **Type Patterns**: mixed_numeric, mixed_boolean
- **Numeric Ratio**: 68.5%
- **Boolean Ratio**: 32.0%
- **Length Range**: 1-78 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`

### category
**Path**: `chummer/mods/mod/category`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-15 characters
- **Examples**:
  - `Model-Specific`
  - `Model-Specific`
  - `Model-Specific`
  - `Model-Specific`
  - `Model-Specific`
- **All Values**: Acceleration, All, Armor, Body, Cosmetic, Electromagnetic, Handling, Model-Specific, Powertrain, Protection, Sensor, Speed, Weapons

### cost
**Path**: `chummer/mods/mod/cost`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 74
- **Type Patterns**: mixed_numeric, mixed_boolean
- **Numeric Ratio**: 65.0%
- **Boolean Ratio**: 16.2%
- **Length Range**: 1-186 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`

### rating
**Path**: `chummer/mods/mod/rating`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 95.4%
- **Boolean Ratio**: 80.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 10, 1000000, 2, 3, 4, 50, 6, 8, 99, Seats, body, qty

### slots
**Path**: `chummer/mods/mod/slots`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 27
- **Type Patterns**: numeric_string, mixed_boolean
- **Numeric Ratio**: 90.4%
- **Boolean Ratio**: 57.9%
- **Length Range**: 1-68 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`

### control
**Path**: `chummer/vehicles/vehicle/weaponmounts/weaponmount/control`

- **Count**: 104
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-14 characters
- **Examples**:
  - `Manual`
  - `Manual`
  - `Remote`
  - `Remote`
  - `Remote`
- **All Values**: Armored Manual, Manual, Remote

### flexibility
**Path**: `chummer/vehicles/vehicle/weaponmounts/weaponmount/flexibility`

- **Count**: 104
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-8 characters
- **Examples**:
  - `Fixed`
  - `Turret`
  - `Fixed`
  - `Fixed`
  - `Fixed`
- **All Values**: Fixed, Flexible, Turret

### size
**Path**: `chummer/vehicles/vehicle/weaponmounts/weaponmount/size`

- **Count**: 104
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-16 characters
- **Examples**:
  - `Standard`
  - `Standard`
  - `Heavy`
  - `Heavy`
  - `Standard`
- **All Values**: Built-In, Heavy, Heavy (Drone), Heavy [SR5], Huge (Drone), Large (Drone), Light, Mini (Drone), Small (Drone), Standard, Standard (Drone)

### visibility
**Path**: `chummer/vehicles/vehicle/weaponmounts/weaponmount/visibility`

- **Count**: 104
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-9 characters
- **Examples**:
  - `External`
  - `External`
  - `External`
  - `External`
  - `External`
- **All Values**: Concealed, External, Internal

### gear
**Path**: `chummer/vehicles/vehicle/gears/gear`

- **Count**: 83
- **Presence Rate**: 100.0%
- **Unique Values**: 23
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-43 characters
- **Examples**:
  - `[Weapon] Melee Autosoft`
  - `Clearsight Autosoft`
  - `Clearsight Autosoft`
  - `[Weapon] Targeting Autosoft`
  - `Smartsoft`
- **All Values**: Ammo: Taser Dart, Clearsight Autosoft, Electronic Warfare Autosoft, Flashlight, Grenade: Flash-Pak, Grenade: Smoke, Ink Pouch, Jammer, Area, Jammer, Directional, Maersk Shipyards Wavecutter MPAC (Commlink), Medkit, Quicksilver Camera, Radio Signal Scanner, Skill Autosoft, SmartSafety Bracelet, Smartsoft, Tool Kit, Tutorsoft, [Model] Evasion Autosoft, [Model] Maneuvering Autosoft

### modslots
**Path**: `chummer/vehicles/vehicle/modslots`

- **Count**: 68
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 69.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`
  - `1`
  - `1`
  - `1`
- **All Values**: 0, 1, 2, 3, 4, 7

### category
**Path**: `chummer/mods/mod/required/vehicledetails/category`

- **Count**: 37
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Drones`
  - `Drones`
  - `Drones`
  - `Drones`
  - `Drones`

### subsystem
**Path**: `chummer/mods/mod/subsystems/subsystem`

- **Count**: 35
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-21 characters
- **Examples**:
  - `Bodyware`
  - `Headware`
  - `Cosmetic Enhancement`
  - `Cyberlimb`
  - `Cyberlimb Enhancement`
- **All Values**: Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Headware

### name
**Path**: `chummer/mods/mod/required/vehicledetails/name`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: string
- **Length Range**: 13-52 characters
- **Examples**:
  - `Aeroquip M.E.D.-1 'Dustoff' Medical Evacuation Drone`
  - `Reloading Drone`
  - `Avibras-Nissan AN 822`
  - `Ruhrmetall Wolf II`
  - `Maersk Shipyards Wavecutter MPAC`

### id
**Path**: `chummer/weaponmounts/weaponmount/id`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 29
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `ccc4f175-0a93-4a27-a069-29d5ba8375e2`
  - `079a5c61-aee6-4383-81b7-32540f7a0a0b`
  - `a567c5d3-38b8-496a-add8-1e176384e935`
  - `1b44540c-b463-47ed-b288-cf4a8e130eab`
  - `4e9da56b-622c-439f-9718-98ac3a792351`
- **All Values**: 079a5c61-aee6-4383-81b7-32540f7a0a0b, 0c05f936-4826-418f-b798-848dafa4b4a0, 0ec991be-a888-4547-8ca2-ad43d7c7399e, 12342330-446f-4e2f-ad9b-6ccdc4d89a9b, 20e7d5d5-da20-4466-99b7-977a578155e4, 2ab20ea4-441c-482d-977e-a5e90f37cb51, 4a020775-9258-486a-a03f-7a48dd5c3bf9, 4d90a1e3-8602-488e-b837-f155b4549084, 4e9da56b-622c-439f-9718-98ac3a792351, 4fdb0fb3-c987-41a0-b11e-d82fe6ac85b1, 52973ba7-3dbb-49fe-9a4c-8105eb6ab4bc, 5d53c232-c18d-4546-bb50-5325f57eb422, 73f6f721-9732-4773-8ce6-0e3f5222a49f, 741bb6e2-0c6b-4af2-82b0-0c4b14c60367, 9ee5e112-8ced-4266-9141-02ef18e33f43, a567c5d3-38b8-496a-add8-1e176384e935, ad732625-c8bc-4e24-bc84-90c8449e82d5, b7333366-24bf-4f47-bb68-b1cfe8f450fd, be56fb91-88d3-4bfb-8e42-d12929b44fe5, c6939caa-e94d-4db3-94f6-a46fbcc4df07

### name
**Path**: `chummer/weaponmounts/weaponmount/name`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 27
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-16 characters
- **Examples**:
  - `Built-In`
  - `Standard [SR5]`
  - `Heavy [SR5]`
  - `Light`
  - `Standard`
- **All Values**: Armored Manual, Concealed, External, Fixed, Flexible, Flexible [SR5], Heavy (Drone), Heavy [SR5], Huge (Drone), Large (Drone), Light, Manual, Micro (Drone), Mini (Drone), None, Remote, Small (Drone), Standard, Standard (Drone), Standard [SR5]

### page
**Path**: `chummer/weaponmounts/weaponmount/page`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 3.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `0`
  - `461`
  - `461`
  - `163`
  - `163`
- **All Values**: 0, 124, 163, 461

### source
**Path**: `chummer/weaponmounts/weaponmount/source`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `R5`
  - `R5`
- **All Values**: R5, SR5

### avail
**Path**: `chummer/weaponmounts/weaponmount/avail`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 58.6%
- **Boolean Ratio**: 41.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `0`
  - `8F`
  - `14F`
  - `6F`
  - `8F`
- **All Values**: 0, 1, 10F, 12F, 14F, 16F, 2, 20F, 4, 4R, 6, 6F, 8F, 8R

### category
**Path**: `chummer/weaponmounts/weaponmount/category`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-11 characters
- **Examples**:
  - `Size`
  - `Size`
  - `Size`
  - `Size`
  - `Size`
- **All Values**: Control, Flexibility, Size, Visibility

### cost
**Path**: `chummer/weaponmounts/weaponmount/cost`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 34.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-4 characters
- **Examples**:
  - `0`
  - `2500`
  - `5000`
  - `750`
  - `1500`
- **All Values**: 0, 1500, 1600, 2000, 2400, 2500, 3200, 400, 4000, 4800, 500, 5000, 750, 800

### slots
**Path**: `chummer/weaponmounts/weaponmount/slots`

- **Count**: 29
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 55.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `3`
  - `6`
  - `1`
  - `2`
- **All Values**: 0, 1, 2, 3, 4, 5, 6

### name
**Path**: `chummer/vehicles/vehicle/weapons/weapon/name`

- **Count**: 23
- **Presence Rate**: 100.0%
- **Unique Values**: 14
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-38 characters
- **Examples**:
  - `Melee Bite`
  - `Colt Cobra TZ-120`
  - `Defiance EX Shocker`
  - `Micro-Torpedo Launcher`
  - `Jaws`
- **All Values**: Colt Cobra TZ-120, Defiance EX Shocker, GE Vindicator Mini-Gun, GE Vindicator Minigun, Jaws, Krupp Munitions 3E Firefighting Cannon, Melee Bite, Micro-Torpedo Launcher, Riot Shield, Siemens FWD Screamer Sonic Cannon, Stoner-Ares M202, Sword, Underbarrel Grenade Launcher, Yamaha Pulsar

### allowedweapons
**Path**: `chummer/vehicles/vehicle/weaponmounts/weaponmount/allowedweapons`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-38 characters
- **Examples**:
  - `Melee Bite`
  - `Colt Cobra TZ-120`
  - `Defiance EX Shocker`
  - `Micro-Torpedo Launcher`
  - `Jaws`
- **All Values**: Colt Cobra TZ-120, Defiance EX Shocker, GE Vindicator Mini-Gun, Jaws, Krupp Munitions 3E Firefighting Cannon, Melee Bite, Micro-Torpedo Launcher, Riot Shield, Siemens FWD Screamer Sonic Cannon, Stoner-Ares M202, Sword, Underbarrel Grenade Launcher, Yamaha Pulsar

### name
**Path**: `chummer/mods/mod/required/vehicledetails/OR/name`

- **Count**: 21
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: string
- **Length Range**: 12-60 characters
- **Examples**:
  - `Ares Paladin`
  - `CrashCart Medicart (Large)`
  - `Evo Falcon-EX`
  - `BMW Teufelkatze`
  - `BMW Teufelkatze`

### category
**Path**: `chummer/categories/category`

- **Count**: 19
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-23 characters
- **Examples**:
  - `Bikes`
  - `Cars`
  - `Trucks`
  - `Municipal/Construction`
  - `Corpsec/Police/Military`
- **All Values**: Bikes, Boats, Cars, Corpsec/Police/Military, Drones: Anthro, Drones: Huge, Drones: Large, Drones: Medium, Drones: Micro, Drones: Mini, Drones: Missile, Drones: Small, Fixed-Wing Aircraft, LTAV, Municipal/Construction, Rotorcraft, Submarines, Trucks, VTOL/VSTOL

### category
**Path**: `chummer/mods/mod/required/vehicledetails/OR/category`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-23 characters
- **Examples**:
  - `Bikes`
  - `Cars`
  - `Trucks`
  - `Municipal/Construction`
  - `Corpsec/Police/Military`
- **All Values**: Bikes, Boats, Cars, Corpsec/Police/Military, Drones, Fixed-Wing Aircraft, LTAV, Municipal/Construction, Rotorcraft, Submarines, Trucks, VTOL/VSTOL

### weaponcategories
**Path**: `chummer/weaponmounts/weaponmount/weaponcategories`

- **Count**: 12
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: string
- **Length Range**: 19-350 characters
- **Examples**:
  - `Blades,Clubs,Exotic Melee Weapons,Crossbows,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Shotguns,Exotic Ranged Weapons,Flamethrowers,Special Weapons,Sporting Rifles`
  - `Blades,Clubs,Exotic Melee Weapons,Crossbows,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Sniper Rifles,Shotguns,Grenade Launchers,Missile Launchers,Laser Weapons,Light Machine Guns,Medium Machine Guns,Heavy Machine Guns,Assault Cannons,Flamethrowers,Sporting Rifles,Exotic Ranged Weapons`
  - `Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns`
  - `Tasers,Holdouts,Light Pistols,Heavy Pistols,Assault Rifles,Sniper Rifles,Shotguns,Exotic Ranged Weapons,Flamethrowers,Special Weapons`
  - `Tasers,Holdouts,Light Pistols,Heavy Pistols,Assault Rifles,Sniper Rifles,Shotguns,Exotic Ranged Weapons,Flamethrowers,Special Weapons,Light Machine Guns,Medium Machine Guns,Heavy Machine Guns,Assault Cannons,Grenade Launchers,Missile Launchers,Laser Weapons`

### handling
**Path**: `chummer/mods/mod/bonus/handling`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 81.8%
- **Enum Candidate**: Yes
- **Length Range**: 2-7 characters
- **Examples**:
  - `+Rating`
  - `-1`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: +1, +Rating, -1, Rating

### control
**Path**: `chummer/weaponmounts/weaponmount/required/weaponmountdetails/control`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-12 characters
- **Examples**:
  - `Manual [SR5]`
  - `Remote [SR5]`
  - `Manual [SR5]`
  - `Remote [SR5]`
  - `None`
- **All Values**: Manual [SR5], None, Remote [SR5]

### gear
**Path**: `chummer/vehicles/vehicle/gears/gear/gears/gear`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-20 characters
- **Examples**:
  - `Geiger Counter`
  - `Olfactory Scanner`
  - `Atmosphere Sensor`
  - `Camera`
  - `Geiger Counter`
- **All Values**: Atmosphere Sensor, Camera, Geiger Counter, MAD Scanner, Olfactory Scanner, Radio Signal Scanner, Ultrasound, X-Ray

### category
**Path**: `chummer/weaponmounts/weaponmount/required/vehicledetails/category`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Drones`
  - `Drones`
  - `Drones`
  - `Drones`
  - `Drones`

### accel
**Path**: `chummer/mods/mod/bonus/accel`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 77.8%
- **Boolean Ratio**: 11.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `+Rating`
  - `0`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: +Rating, -1, 0, Rating

### offroadaccel
**Path**: `chummer/mods/mod/bonus/offroadaccel`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 77.8%
- **Boolean Ratio**: 11.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `+Rating`
  - `0`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: +Rating, -1, 0, Rating

### offroadspeed
**Path**: `chummer/mods/mod/bonus/offroadspeed`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 77.8%
- **Boolean Ratio**: 11.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `+Rating`
  - `0`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: +Rating, -1, 0, Rating

### speed
**Path**: `chummer/mods/mod/bonus/speed`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 77.8%
- **Boolean Ratio**: 11.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `+Rating`
  - `0`
  - `-1`
  - `-1`
  - `-1`
- **All Values**: +Rating, -1, 0, Rating

### flexibility
**Path**: `chummer/weaponmounts/weaponmount/required/weaponmountdetails/flexibility`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-14 characters
- **Examples**:
  - `Flexible [SR5]`
  - `Flexible [SR5]`
  - `None`
  - `None`
  - `None`
- **All Values**: Flexible [SR5], None

### visibility
**Path**: `chummer/weaponmounts/weaponmount/required/weaponmountdetails/visibility`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-14 characters
- **Examples**:
  - `External [SR5]`
  - `External [SR5]`
  - `None`
  - `None`
  - `None`
- **All Values**: External [SR5], None

### control
**Path**: `chummer/weaponmounts/weaponmount/forbidden/weaponmountdetails/control`

- **Count**: 9
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-12 characters
- **Examples**:
  - `Manual [SR5]`
  - `Remote [SR5]`
  - `None`
  - `Manual [SR5]`
  - `Remote [SR5]`
- **All Values**: Manual [SR5], None, Remote [SR5]

### weaponmountcategories
**Path**: `chummer/mods/mod/weaponmountcategories`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: string
- **Length Range**: 19-350 characters
- **Examples**:
  - `Micro-Drone Weapons`
  - `Tasers,Holdouts,Light Pistols,Grenades,Blades,Clubs`
  - `Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols`
  - `Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Grenade Launchers`
  - `Blades,Clubs,Improvised Weapons,Exotic Melee Weapons,Cyberweapon,Bio-Weapon,Unarmed,Tasers,Holdouts,Light Pistols,Heavy Pistols,Machine Pistols,Submachine Guns,Assault Rifles,Shotguns,Grenade Launchers,Sporting Rifles`

### category
**Path**: `chummer/modcategories/category`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-15 characters
- **Examples**:
  - `Body`
  - `Cosmetic`
  - `Electromagnetic`
  - `Model-Specific`
  - `Powertrain`
- **All Values**: Body, Cosmetic, Electromagnetic, Model-Specific, Powertrain, Protection, Weapons

### id
**Path**: `chummer/vehicles/vehicle/gears/gear/gears/gear/id`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `e140b671-dc22-429d-b12a-dfbf46951049`
  - `ffc069af-d3ec-4201-887c-0178dcdfeef9`
  - `ffc069af-d3ec-4201-887c-0178dcdfeef9`
  - `e140b671-dc22-429d-b12a-dfbf46951049`
  - `d98f419f-7625-4228-9723-0217950d8155`
- **All Values**: c763fac2-8b08-4c61-8dc2-6291d905a2df, d98f419f-7625-4228-9723-0217950d8155, e140b671-dc22-429d-b12a-dfbf46951049, ffc069af-d3ec-4201-887c-0178dcdfeef9

### offroadhandling
**Path**: `chummer/mods/mod/bonus/offroadhandling`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 66.7%
- **Enum Candidate**: Yes
- **Length Range**: 2-7 characters
- **Examples**:
  - `+Rating`
  - `+1`
  - `+1`
  - `-1`
  - `Rating`
- **All Values**: +1, +Rating, -1, Rating

### minrating
**Path**: `chummer/mods/mod/minrating`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 9-16 characters
- **Examples**:
  - `Sensor + 1`
  - `Handling + 1`
  - `Speed + 1`
  - `Acceleration + 1`
  - `Armor + 1`
- **All Values**: Acceleration + 1, Armor + 1, Handling + 1, Sensor + 1, Speed + 1

### name
**Path**: `chummer/mods/mod/forbidden/vehicledetails/OR/name`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 22-24 characters
- **Examples**:
  - `Shiawase Motors Shuriken`
  - `Caterpillar Omniwinder`
  - `Shiawase Motors Shuriken`
  - `Caterpillar Omniwinder`
  - `Shiawase Motors Shuriken`
- **All Values**: Caterpillar Omniwinder, Shiawase Motors Shuriken

### ratinglabel
**Path**: `chummer/mods/mod/ratinglabel`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 12-21 characters
- **Examples**:
  - `String_Hours`
  - `String_UpgradedRating`
  - `String_UpgradedRating`
  - `String_UpgradedRating`
  - `String_UpgradedRating`
- **All Values**: String_Hours, String_UpgradedRating

### flexibility
**Path**: `chummer/weaponmounts/weaponmount/forbidden/weaponmountdetails/flexibility`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-14 characters
- **Examples**:
  - `Flexible [SR5]`
  - `None`
  - `Flexible [SR5]`
  - `None`
  - `Flexible [SR5]`
- **All Values**: Flexible [SR5], None

### visibility
**Path**: `chummer/weaponmounts/weaponmount/forbidden/weaponmountdetails/visibility`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-14 characters
- **Examples**:
  - `External [SR5]`
  - `None`
  - `External [SR5]`
  - `None`
  - `External [SR5]`
- **All Values**: External [SR5], None

### capacity
**Path**: `chummer/mods/mod/capacity`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `15`
  - `15`
  - `15`
  - `20`
  - `20`
- **All Values**: 15, 20

### id
**Path**: `chummer/weaponmountmods/mod/id`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `45d84d77-5461-4441-a529-527aba347334`
  - `dd03dc64-64e1-49a7-8836-d932cd4cb95b`
  - `c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7`
  - `c3f9fa86-b8d4-11e6-80f5-76304dec7eb7`
  - `6741d080-0e40-4941-a7b5-85ab3e1a9cb2`
- **All Values**: 45d84d77-5461-4441-a529-527aba347334, 6741d080-0e40-4941-a7b5-85ab3e1a9cb2, c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7, c3f9fa86-b8d4-11e6-80f5-76304dec7eb7, dd03dc64-64e1-49a7-8836-d932cd4cb95b

### name
**Path**: `chummer/weaponmountmods/mod/name`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: string
- **Length Range**: 8-64 characters
- **Examples**:
  - `Blow-Away Panel Weapon Mount Add-on (Drone)`
  - `Pop-Out Weapon Mount Add-on (Drone)`
  - `Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone)`
  - `Expanded Ammunition Bay (Belt-Feed) Weapon Mount Add-on (Drone)`
  - `Ammo Bin`

### page
**Path**: `chummer/weaponmountmods/mod/page`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `124`
  - `124`
  - `124`
  - `124`
  - `159`
- **All Values**: 124, 159

### source
**Path**: `chummer/weaponmountmods/mod/source`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 2-2 characters
- **Examples**:
  - `R5`
  - `R5`
  - `R5`
  - `R5`
  - `R5`

### avail
**Path**: `chummer/weaponmountmods/mod/avail`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 80.0%
- **Boolean Ratio**: 80.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `6R`
- **All Values**: 0, 6R

### category
**Path**: `chummer/weaponmountmods/mod/category`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-7 characters
- **Examples**:
  - `All`
  - `All`
  - `All`
  - `All`
  - `Weapons`
- **All Values**: All, Weapons

### cost
**Path**: `chummer/weaponmountmods/mod/cost`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 80.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-11 characters
- **Examples**:
  - `25`
  - `Slots * 100`
  - `50`
  - `500`
  - `200`
- **All Values**: 200, 25, 50, 500, Slots * 100

### rating
**Path**: `chummer/weaponmountmods/mod/rating`

- **Count**: 5
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

### slots
**Path**: `chummer/weaponmountmods/mod/slots`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 80.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `1`
  - `1`
  - `2`
  - `1`
- **All Values**: 0, 1, 2

### bodymodslots
**Path**: `chummer/vehicles/vehicle/bodymodslots`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `4`
  - `4`
  - `4`
  - `-7`
- **All Values**: -7, 4

### id
**Path**: `chummer/vehicles/vehicle/gears/gear/gears/gear/gears/gear/id`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `287c6d58-2217-48b2-9e14-6ba23584939a`
  - `f7f74a85-bd3b-4a46-9c3b-80688c72ef51`
  - `287c6d58-2217-48b2-9e14-6ba23584939a`
  - `f7f74a85-bd3b-4a46-9c3b-80688c72ef51`
- **All Values**: 287c6d58-2217-48b2-9e14-6ba23584939a, f7f74a85-bd3b-4a46-9c3b-80688c72ef51

### seats
**Path**: `chummer/mods/mod/bonus/seats`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-12 characters
- **Examples**:
  - `+16`
  - `+Seats * 0.5`
  - `+Seats * 0.5`
  - `+1`
- **All Values**: +1, +16, +Seats * 0.5

### armor
**Path**: `chummer/mods/mod/bonus/armor`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-7 characters
- **Examples**:
  - `+Rating`
  - `+Rating`
  - `Rating`
  - `-3`
- **All Values**: +Rating, -3, Rating

### sensor
**Path**: `chummer/mods/mod/bonus/sensor`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 25.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-6 characters
- **Examples**:
  - `Rating`
  - `Rating`
  - `Rating`
  - `-1`
- **All Values**: -1, Rating

### category
**Path**: `chummer/weaponmountmods/mod/required/vehicledetails/category`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Drones`
  - `Drones`
  - `Drones`
  - `Drones`

### weaponmodslots
**Path**: `chummer/vehicles/vehicle/weaponmodslots`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `3`
  - `4`
  - `-7`
- **All Values**: -7, 3, 4

### mod
**Path**: `chummer/vehicles/vehicle/weaponmounts/weaponmount/mods/mod`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: string
- **Length Range**: 8-64 characters
- **Examples**:
  - `Expanded Ammunition Bay (Second Bin) Weapon Mount Add-on (Drone)`
  - `Ammo Bin`
  - `Ammo Bin`

### conditionmonitor
**Path**: `chummer/mods/mod/conditionmonitor`

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

### name
**Path**: `chummer/vehicles/vehicle/mods/mod/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Drone Arm`
  - `Drone Arm`

### name
**Path**: `chummer/vehicles/vehicle/mods/mod/subsystems/cyberware/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Snake Fingers`
  - `Snake Fingers`

### rating
**Path**: `chummer/vehicles/vehicle/gears/gear/gears/gear/rating`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `4`

### powertrainmodslots
**Path**: `chummer/vehicles/vehicle/powertrainmodslots`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `-14`
  - `-7`
- **All Values**: -14, -7

### protectionmodslots
**Path**: `chummer/vehicles/vehicle/protectionmodslots`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `-14`
  - `-7`
- **All Values**: -14, -7

### pilot
**Path**: `chummer/mods/mod/bonus/pilot`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Rating`
  - `Rating`

### body
**Path**: `chummer/mods/mod/bonus/body`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 50.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-7 characters
- **Examples**:
  - `-Rating`
  - `-1`
- **All Values**: -1, -Rating

### category
**Path**: `chummer/weaponmountcategories/category`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 4-4 characters
- **Examples**:
  - `Size`

### addslots
**Path**: `chummer/vehicles/vehicle/mods/addslots`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`

### qty
**Path**: `chummer/vehicles/vehicle/gears/gear/qty`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `200`

### electromagneticmodslots
**Path**: `chummer/vehicles/vehicle/electromagneticmodslots`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-7`

### cosmeticmodslots
**Path**: `chummer/vehicles/vehicle/cosmeticmodslots`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-3`

### devicerating
**Path**: `chummer/mods/mod/bonus/devicerating`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### body
**Path**: `chummer/mods/mod/required/vehicledetails/body`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `6`

### seats
**Path**: `chummer/mods/mod/required/vehicledetails/seats`

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
**Path**: `chummer/weaponmounts/weaponmount/forbidden/vehicledetails/category`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `Drones`

### weaponfilter
**Path**: `chummer/weaponmounts/weaponmount/weaponfilter`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 55-55 characters
- **Examples**:
  - `((type != "Melee") or (type = "Melee" and reach = "0"))`

### ammobonuspercent
**Path**: `chummer/weaponmountmods/mod/ammobonuspercent`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `100`

### ammoreplace
**Path**: `chummer/weaponmountmods/mod/ammoreplace`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `100(belt)`

### ammobonus
**Path**: `chummer/weaponmountmods/mod/ammobonus`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 3-3 characters
- **Examples**:
  - `250`

## Attributes

### name@rating
**Path**: `chummer/vehicles/vehicle/mods/name@rating`

- **Count**: 116
- **Unique Values**: 8
- **Enum Candidate**: Yes
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `2`
  - `1`
- **All Values**: 1, 10, 2, 25, 3, 4, 6, 8

### gear@rating
**Path**: `chummer/vehicles/vehicle/gears/gear@rating`

- **Count**: 59
- **Unique Values**: 7
- **Enum Candidate**: Yes
- **Examples**:
  - `1`
  - `2`
  - `4`
  - `2`
  - `2`
- **All Values**: 1, 2, 3, 4, 5, 6, 7

### name@select
**Path**: `chummer/vehicles/vehicle/mods/name@select`

- **Count**: 47
- **Unique Values**: 38
- **Enum Candidate**: Yes
- **Examples**:
  - `Skylight`
  - `Integrated Video Displays`
  - `Extended Roof`
  - `Bathroom`
  - `Holding Cell`

### category@operation
**Path**: `chummer/mods/mod/required/vehicledetails/category@operation`

- **Count**: 37
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`
  - `contains`
  - `contains`
  - `contains`

### gear@select
**Path**: `chummer/vehicles/vehicle/gears/gear@select`

- **Count**: 32
- **Unique Values**: 25
- **Enum Candidate**: Yes
- **Examples**:
  - `Melee Bite`
  - `Colt Cobra TZ-120`
  - `Automotive Mechanic`
  - `Automotive Mechanic`
  - `Nautical Mechanic`
- **All Values**: Ammo Drone, Armorer, Avibras-Nissan AN 822, Clubs, Colt Cobra TZ-120, Cooking, Electronic Warfare, First Aid, GE Vindicator Minigun, Industrial Mechanic, Knowledge, Legal Codes, Melee Bite, Nautical Mechanic, Road Engineering, Stoner-Ares M202, Survival, Sword, Unarmed Combat, Yamaha Pulsar

### category@blackmarket
**Path**: `chummer/categories/category@blackmarket`

- **Count**: 19
- **Unique Values**: 1
- **Examples**:
  - `Vehicles`
  - `Vehicles`
  - `Vehicles`
  - `Vehicles`
  - `Vehicles`

### gear@rating
**Path**: `chummer/vehicles/vehicle/gears/gear/gears/gear@rating`

- **Count**: 10
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `6`
  - `8`
  - `8`
  - `8`
  - `8`
- **All Values**: 6, 8

### gear@consumecapacity
**Path**: `chummer/vehicles/vehicle/gears/gear/gears/gear@consumecapacity`

- **Count**: 10
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`
  - `True`
  - `True`
  - `True`

### category@operation
**Path**: `chummer/weaponmounts/weaponmount/required/vehicledetails/category@operation`

- **Count**: 10
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`
  - `contains`
  - `contains`
  - `contains`

### category@blackmarket
**Path**: `chummer/modcategories/category@blackmarket`

- **Count**: 7
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Vehicles`
  - `Vehicles`
  - `Software,Vehicles`
  - `Vehicles`
  - `Vehicles`
- **All Values**: Software,Vehicles, Vehicles

### name@operation
**Path**: `chummer/mods/mod/required/vehicledetails/name@operation`

- **Count**: 4
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`
  - `contains`
  - `contains`

### category@operation
**Path**: `chummer/weaponmountmods/mod/required/vehicledetails/category@operation`

- **Count**: 4
- **Unique Values**: 1
- **Examples**:
  - `contains`
  - `contains`
  - `contains`
  - `contains`

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema vehicles.xsd`

### category@blackmarket
**Path**: `chummer/weaponmountcategories/category@blackmarket`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Vehicles`

### name@cost
**Path**: `chummer/vehicles/vehicle/mods/name@cost`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `0`

### gear@consumecapacity
**Path**: `chummer/vehicles/vehicle/gears/gear@consumecapacity`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

### gear@costfor
**Path**: `chummer/vehicles/vehicle/gears/gear@costfor`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `4`

### body@operation
**Path**: `chummer/mods/mod/required/vehicledetails/body@operation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `lessthanequals`

### selecttext@xml
**Path**: `chummer/mods/mod/bonus/selecttext@xml`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `skills.xml`

### selecttext@xpath
**Path**: `chummer/mods/mod/bonus/selecttext@xpath`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `/chummer/skills/skill/name \| /chummer/knowledgeskills/skill/name`

### selecttext@allowedit
**Path**: `chummer/mods/mod/bonus/selecttext@allowedit`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `True`

### seats@operation
**Path**: `chummer/mods/mod/required/vehicledetails/seats@operation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `greaterthanequals`

### category@operation
**Path**: `chummer/mods/mod/required/vehicledetails/OR/category@operation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `contains`

### category@operation
**Path**: `chummer/weaponmounts/weaponmount/forbidden/vehicledetails/category@operation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `contains`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 19 unique values
  - Values: Bikes, Boats, Cars, Corpsec/Police/Military, Drones: Anthro, Drones: Huge, Drones: Large, Drones: Medium, Drones: Micro, Drones: Mini, Drones: Missile, Drones: Small, Fixed-Wing Aircraft, LTAV, Municipal/Construction, Rotorcraft, Submarines, Trucks, VTOL/VSTOL
- **category** (`chummer/modcategories/category`): 7 unique values
  - Values: Body, Cosmetic, Electromagnetic, Model-Specific, Powertrain, Protection, Weapons
- **source** (`chummer/vehicles/vehicle/source`): 22 unique values
  - Values: 2050, BB, CA, HAMG, HT, KK, NF, NP, R5, SFME, SHB, SHB3, SL, SLG7, SOTG, SR5, SS, TCT, TSG, TVG
- **accel** (`chummer/vehicles/vehicle/accel`): 15 unique values
  - Values: 0, 1, 1/1, 1/2, 1/3, 2, 2/3, 2/4, 3, 3/2, 4, 5, 6, 7, 8
- **armor** (`chummer/vehicles/vehicle/armor`): 22 unique values
  - Values: 0, 1, 10, 12, 13, 14, 15, 16, 2, 20, 24, 25, 27, 3, 4, 5, 6, 7, 8, 9
- **avail** (`chummer/vehicles/vehicle/avail`): 46 unique values
  - Values: 0, 10, 11R, 12, 13F, 14R, 15R, 16, 16F, 16R, 18F, 18R, 20, 21R, 22F, 24R, 28F, 8, 8F, 8R
- **body** (`chummer/vehicles/vehicle/body`): 28 unique values
  - Values: 0, 1, 10, 12, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 27, 30, 6, 8, 9
- **category** (`chummer/vehicles/vehicle/category`): 20 unique values
  - Values: Bikes, Boats, Cars, Corpsec/Police/Military, Drones: Anthro, Drones: Huge, Drones: Large, Drones: Medium, Drones: Micro, Drones: Mini, Drones: Missile, Drones: Small, Fixed-Wing Aircraft, Hovercraft, LTAV, Municipal/Construction, Rotorcraft, Submarines, Trucks, VTOL/VSTOL
- **handling** (`chummer/vehicles/vehicle/handling`): 32 unique values
  - Values: 0, 1, 1/1, 1/3, 2/1, 2/2, 3/1, 3/2, 3/3, 3/4, 3/5, 4/2, 4/5, 5/3, 5/4, 5/5, 6, 6/3, 6/4, 6/5
- **pilot** (`chummer/vehicles/vehicle/pilot`): 7 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6
- **sensor** (`chummer/vehicles/vehicle/sensor`): 9 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8
- **speed** (`chummer/vehicles/vehicle/speed`): 21 unique values
  - Values: 0, 1, 1/1, 1/4, 1/7, 2, 2/3, 2/5, 3, 3/4, 3/6, 4, 4/3, 4/5, 5, 5/3, 6, 7, 8, 9
- **name** (`chummer/vehicles/vehicle/gears/gear/name`): 4 unique values
  - Values: Grenade: Flash-Pak, Holster, Medkit, Sensor Array
- **rating** (`chummer/vehicles/vehicle/gears/gear/rating`): 7 unique values
  - Values: 1, 2, 3, 4, 5, 6, 8
- **maxrating** (`chummer/vehicles/vehicle/gears/gear/maxrating`): 8 unique values
  - Values: 1, 2, 3, 4, 5, 6, 7, 8
- **seats** (`chummer/vehicles/vehicle/seats`): 22 unique values
  - Values: 0, 1, 10, 12, 14, 16, 20, 200, 22, 24, 3, 30, 4, 5, 50, 53, 6, 7, 8, 9
- **control** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/control`): 3 unique values
  - Values: Armored Manual, Manual, Remote
- **flexibility** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/flexibility`): 3 unique values
  - Values: Fixed, Flexible, Turret
- **size** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/size`): 11 unique values
  - Values: Built-In, Heavy, Heavy (Drone), Heavy [SR5], Huge (Drone), Large (Drone), Light, Mini (Drone), Small (Drone), Standard, Standard (Drone)
- **visibility** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/visibility`): 3 unique values
  - Values: Concealed, External, Internal
- **gear** (`chummer/vehicles/vehicle/gears/gear`): 23 unique values
  - Values: Ammo: Taser Dart, Clearsight Autosoft, Electronic Warfare Autosoft, Flashlight, Grenade: Flash-Pak, Grenade: Smoke, Ink Pouch, Jammer, Area, Jammer, Directional, Maersk Shipyards Wavecutter MPAC (Commlink), Medkit, Quicksilver Camera, Radio Signal Scanner, Skill Autosoft, SmartSafety Bracelet, Smartsoft, Tool Kit, Tutorsoft, [Model] Evasion Autosoft, [Model] Maneuvering Autosoft
- **allowedweapons** (`chummer/vehicles/vehicle/weaponmounts/weaponmount/allowedweapons`): 13 unique values
  - Values: Colt Cobra TZ-120, Defiance EX Shocker, GE Vindicator Mini-Gun, Jaws, Krupp Munitions 3E Firefighting Cannon, Melee Bite, Micro-Torpedo Launcher, Riot Shield, Siemens FWD Screamer Sonic Cannon, Stoner-Ares M202, Sword, Underbarrel Grenade Launcher, Yamaha Pulsar
- **name** (`chummer/vehicles/vehicle/weapons/weapon/name`): 14 unique values
  - Values: Colt Cobra TZ-120, Defiance EX Shocker, GE Vindicator Mini-Gun, GE Vindicator Minigun, Jaws, Krupp Munitions 3E Firefighting Cannon, Melee Bite, Micro-Torpedo Launcher, Riot Shield, Siemens FWD Screamer Sonic Cannon, Stoner-Ares M202, Sword, Underbarrel Grenade Launcher, Yamaha Pulsar
- **modslots** (`chummer/vehicles/vehicle/modslots`): 6 unique values
  - Values: 0, 1, 2, 3, 4, 7
- **gear** (`chummer/vehicles/vehicle/gears/gear/gears/gear`): 8 unique values
  - Values: Atmosphere Sensor, Camera, Geiger Counter, MAD Scanner, Olfactory Scanner, Radio Signal Scanner, Ultrasound, X-Ray
- **bodymodslots** (`chummer/vehicles/vehicle/bodymodslots`): 2 unique values
  - Values: -7, 4
- **weaponmodslots** (`chummer/vehicles/vehicle/weaponmodslots`): 3 unique values
  - Values: -7, 3, 4
- **id** (`chummer/vehicles/vehicle/gears/gear/gears/gear/id`): 4 unique values
  - Values: c763fac2-8b08-4c61-8dc2-6291d905a2df, d98f419f-7625-4228-9723-0217950d8155, e140b671-dc22-429d-b12a-dfbf46951049, ffc069af-d3ec-4201-887c-0178dcdfeef9
- **id** (`chummer/vehicles/vehicle/gears/gear/gears/gear/gears/gear/id`): 2 unique values
  - Values: 287c6d58-2217-48b2-9e14-6ba23584939a, f7f74a85-bd3b-4a46-9c3b-80688c72ef51
- **powertrainmodslots** (`chummer/vehicles/vehicle/powertrainmodslots`): 2 unique values
  - Values: -14, -7
- **protectionmodslots** (`chummer/vehicles/vehicle/protectionmodslots`): 2 unique values
  - Values: -14, -7
- **page** (`chummer/mods/mod/page`): 46 unique values
  - Values: 123, 128, 132, 153, 155, 160, 161, 165, 167, 168, 177, 186, 187, 189, 212, 220, 44, 461, 54, 70
- **source** (`chummer/mods/mod/source`): 14 unique values
  - Values: 2050, BB, HT, KK, R5, RF, SAG, SFME, SHB, SHB3, SL, SR5, SS, TCT
- **category** (`chummer/mods/mod/category`): 13 unique values
  - Values: Acceleration, All, Armor, Body, Cosmetic, Electromagnetic, Handling, Model-Specific, Powertrain, Protection, Sensor, Speed, Weapons
- **rating** (`chummer/mods/mod/rating`): 13 unique values
  - Values: 0, 10, 1000000, 2, 3, 4, 50, 6, 8, 99, Seats, body, qty
- **seats** (`chummer/mods/mod/bonus/seats`): 3 unique values
  - Values: +1, +16, +Seats * 0.5
- **accel** (`chummer/mods/mod/bonus/accel`): 4 unique values
  - Values: +Rating, -1, 0, Rating
- **offroadaccel** (`chummer/mods/mod/bonus/offroadaccel`): 4 unique values
  - Values: +Rating, -1, 0, Rating
- **handling** (`chummer/mods/mod/bonus/handling`): 4 unique values
  - Values: +1, +Rating, -1, Rating
- **offroadhandling** (`chummer/mods/mod/bonus/offroadhandling`): 4 unique values
  - Values: +1, +Rating, -1, Rating
- **offroadspeed** (`chummer/mods/mod/bonus/offroadspeed`): 4 unique values
  - Values: +Rating, -1, 0, Rating
- **speed** (`chummer/mods/mod/bonus/speed`): 4 unique values
  - Values: +Rating, -1, 0, Rating
- **armor** (`chummer/mods/mod/bonus/armor`): 3 unique values
  - Values: +Rating, -3, Rating
- **sensor** (`chummer/mods/mod/bonus/sensor`): 2 unique values
  - Values: -1, Rating
- **capacity** (`chummer/mods/mod/capacity`): 2 unique values
  - Values: 15, 20
- **subsystem** (`chummer/mods/mod/subsystems/subsystem`): 7 unique values
  - Values: Bodyware, Cosmetic Enhancement, Cyber Implant Weapon, Cyberlimb, Cyberlimb Accessory, Cyberlimb Enhancement, Headware
- **body** (`chummer/mods/mod/bonus/body`): 2 unique values
  - Values: -1, -Rating
- **minrating** (`chummer/mods/mod/minrating`): 5 unique values
  - Values: Acceleration + 1, Armor + 1, Handling + 1, Sensor + 1, Speed + 1
- **name** (`chummer/mods/mod/forbidden/vehicledetails/OR/name`): 2 unique values
  - Values: Caterpillar Omniwinder, Shiawase Motors Shuriken
- **ratinglabel** (`chummer/mods/mod/ratinglabel`): 2 unique values
  - Values: String_Hours, String_UpgradedRating
- **category** (`chummer/mods/mod/required/vehicledetails/OR/category`): 12 unique values
  - Values: Bikes, Boats, Cars, Corpsec/Police/Military, Drones, Fixed-Wing Aircraft, LTAV, Municipal/Construction, Rotorcraft, Submarines, Trucks, VTOL/VSTOL
- **id** (`chummer/weaponmounts/weaponmount/id`): 29 unique values
  - Values: 079a5c61-aee6-4383-81b7-32540f7a0a0b, 0c05f936-4826-418f-b798-848dafa4b4a0, 0ec991be-a888-4547-8ca2-ad43d7c7399e, 12342330-446f-4e2f-ad9b-6ccdc4d89a9b, 20e7d5d5-da20-4466-99b7-977a578155e4, 2ab20ea4-441c-482d-977e-a5e90f37cb51, 4a020775-9258-486a-a03f-7a48dd5c3bf9, 4d90a1e3-8602-488e-b837-f155b4549084, 4e9da56b-622c-439f-9718-98ac3a792351, 4fdb0fb3-c987-41a0-b11e-d82fe6ac85b1, 52973ba7-3dbb-49fe-9a4c-8105eb6ab4bc, 5d53c232-c18d-4546-bb50-5325f57eb422, 73f6f721-9732-4773-8ce6-0e3f5222a49f, 741bb6e2-0c6b-4af2-82b0-0c4b14c60367, 9ee5e112-8ced-4266-9141-02ef18e33f43, a567c5d3-38b8-496a-add8-1e176384e935, ad732625-c8bc-4e24-bc84-90c8449e82d5, b7333366-24bf-4f47-bb68-b1cfe8f450fd, be56fb91-88d3-4bfb-8e42-d12929b44fe5, c6939caa-e94d-4db3-94f6-a46fbcc4df07
- **name** (`chummer/weaponmounts/weaponmount/name`): 27 unique values
  - Values: Armored Manual, Concealed, External, Fixed, Flexible, Flexible [SR5], Heavy (Drone), Heavy [SR5], Huge (Drone), Large (Drone), Light, Manual, Micro (Drone), Mini (Drone), None, Remote, Small (Drone), Standard, Standard (Drone), Standard [SR5]
- **page** (`chummer/weaponmounts/weaponmount/page`): 4 unique values
  - Values: 0, 124, 163, 461
- **source** (`chummer/weaponmounts/weaponmount/source`): 2 unique values
  - Values: R5, SR5
- **avail** (`chummer/weaponmounts/weaponmount/avail`): 14 unique values
  - Values: 0, 1, 10F, 12F, 14F, 16F, 2, 20F, 4, 4R, 6, 6F, 8F, 8R
- **category** (`chummer/weaponmounts/weaponmount/category`): 4 unique values
  - Values: Control, Flexibility, Size, Visibility
- **cost** (`chummer/weaponmounts/weaponmount/cost`): 14 unique values
  - Values: 0, 1500, 1600, 2000, 2400, 2500, 3200, 400, 4000, 4800, 500, 5000, 750, 800
- **slots** (`chummer/weaponmounts/weaponmount/slots`): 7 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6
- **control** (`chummer/weaponmounts/weaponmount/required/weaponmountdetails/control`): 3 unique values
  - Values: Manual [SR5], None, Remote [SR5]
- **flexibility** (`chummer/weaponmounts/weaponmount/required/weaponmountdetails/flexibility`): 2 unique values
  - Values: Flexible [SR5], None
- **visibility** (`chummer/weaponmounts/weaponmount/required/weaponmountdetails/visibility`): 2 unique values
  - Values: External [SR5], None
- **control** (`chummer/weaponmounts/weaponmount/forbidden/weaponmountdetails/control`): 3 unique values
  - Values: Manual [SR5], None, Remote [SR5]
- **flexibility** (`chummer/weaponmounts/weaponmount/forbidden/weaponmountdetails/flexibility`): 2 unique values
  - Values: Flexible [SR5], None
- **visibility** (`chummer/weaponmounts/weaponmount/forbidden/weaponmountdetails/visibility`): 2 unique values
  - Values: External [SR5], None
- **id** (`chummer/weaponmountmods/mod/id`): 5 unique values
  - Values: 45d84d77-5461-4441-a529-527aba347334, 6741d080-0e40-4941-a7b5-85ab3e1a9cb2, c3f9f5a4-b8d4-11e6-80f5-76304dec7eb7, c3f9fa86-b8d4-11e6-80f5-76304dec7eb7, dd03dc64-64e1-49a7-8836-d932cd4cb95b
- **page** (`chummer/weaponmountmods/mod/page`): 2 unique values
  - Values: 124, 159
- **avail** (`chummer/weaponmountmods/mod/avail`): 2 unique values
  - Values: 0, 6R
- **category** (`chummer/weaponmountmods/mod/category`): 2 unique values
  - Values: All, Weapons
- **cost** (`chummer/weaponmountmods/mod/cost`): 5 unique values
  - Values: 200, 25, 50, 500, Slots * 100
- **slots** (`chummer/weaponmountmods/mod/slots`): 3 unique values
  - Values: 0, 1, 2

### Numeric Type Candidates
- **page** (`chummer/vehicles/vehicle/page`): 100.0% numeric
  - Examples: 462, 41, 42
- **cost** (`chummer/vehicles/vehicle/cost`): 99.7% numeric
  - Examples: 3000, 12000, 4500
- **addslots** (`chummer/vehicles/vehicle/mods/addslots`): 100.0% numeric
  - Examples: 3
- **rating** (`chummer/vehicles/vehicle/gears/gear/gears/gear/rating`): 100.0% numeric
  - Examples: 4, 4
- **qty** (`chummer/vehicles/vehicle/gears/gear/qty`): 100.0% numeric
  - Examples: 200
- **electromagneticmodslots** (`chummer/vehicles/vehicle/electromagneticmodslots`): 100.0% numeric
  - Examples: -7
- **cosmeticmodslots** (`chummer/vehicles/vehicle/cosmeticmodslots`): 100.0% numeric
  - Examples: -3
- **slots** (`chummer/mods/mod/slots`): 90.4% numeric
  - Examples: 0, 0, 0
- **devicerating** (`chummer/mods/mod/bonus/devicerating`): 100.0% numeric
  - Examples: 1
- **body** (`chummer/mods/mod/required/vehicledetails/body`): 100.0% numeric
  - Examples: 6
- **seats** (`chummer/mods/mod/required/vehicledetails/seats`): 100.0% numeric
  - Examples: 1
- **conditionmonitor** (`chummer/mods/mod/conditionmonitor`): 100.0% numeric
  - Examples: 1, 1, 1
- **rating** (`chummer/weaponmountmods/mod/rating`): 100.0% numeric
  - Examples: 0, 0, 0
- **ammobonuspercent** (`chummer/weaponmountmods/mod/ammobonuspercent`): 100.0% numeric
  - Examples: 100
- **ammobonus** (`chummer/weaponmountmods/mod/ammobonus`): 100.0% numeric
  - Examples: 250
