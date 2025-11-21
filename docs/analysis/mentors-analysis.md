# Analysis Report: mentors.xml

**File**: `data\chummerxml\mentors.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 2261
- **Unique Fields**: 56
- **Unique Attributes**: 12
- **Unique Element Types**: 86

## Fields

### name
**Path**: `chummer/mentors/mentor/choices/choice/name`

- **Count**: 197
- **Presence Rate**: 100.0%
- **Unique Values**: 168
- **Type Patterns**: string
- **Length Range**: 14-152 characters
- **Examples**:
  - `Magician: +2 dice for Health spells`
  - `Adept: 1 free level of Rapid Healing`
  - `+2 dice on Gymnastics Tests`
  - `+2 dice on Sneaking Tests`
  - `Magician: +2 dice for Illusion spells`

### name
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificpower/name`

- **Count**: 87
- **Presence Rate**: 100.0%
- **Unique Values**: 41
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-33 characters
- **Examples**:
  - `Rapid Healing`
  - `Light Body`
  - `Improved Sense`
  - `Improved Sense`
  - `Enhanced Accuracy (skill)`

### id
**Path**: `chummer/mentors/mentor/id`

- **Count**: 81
- **Presence Rate**: 100.0%
- **Unique Values**: 81
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `136a3dc5-d9c4-45ad-bc24-705f54692590`
  - `f32b8b69-0f6b-417d-bd06-6a85e1076a36`
  - `98785f59-5739-4998-b334-ec4501c75cf8`
  - `dc7ce567-18c7-4101-b16c-0d4930f3af81`
  - `9e38a8c0-f11c-461d-a489-ba1432f4551f`

### name
**Path**: `chummer/mentors/mentor/name`

- **Count**: 81
- **Presence Rate**: 100.0%
- **Unique Values**: 81
- **Type Patterns**: string
- **Length Range**: 3-22 characters
- **Examples**:
  - `Bear`
  - `Cat`
  - `Dog`
  - `Dragonslayer`
  - `Eagle`

### advantage
**Path**: `chummer/mentors/mentor/advantage`

- **Count**: 81
- **Presence Rate**: 100.0%
- **Unique Values**: 81
- **Type Patterns**: string
- **Length Range**: 22-130 characters
- **Examples**:
  - `All: +2 dice for tests to resist damage (not including drain).`
  - `All: +2 dice to either Gymnastics or Sneaking Tests (choose one).`
  - `All: +2 dice for Tracking tests.`
  - `All: +2 dice pool modifier for one social skill of choice.`
  - `All: +2 dice to Perception Tests.`

### disadvantage
**Path**: `chummer/mentors/mentor/disadvantage`

- **Count**: 81
- **Presence Rate**: 100.0%
- **Unique Values**: 81
- **Type Patterns**: string
- **Length Range**: 44-680 characters
- **Examples**:
  - `You might go berserk when you take Physical damage in combat or if someone under your care is badly injured. Make a Simple Charisma + Willpower Test (wound modifiers apply). You go berserk for 3 turns minus 1 turn per hit, so 3 or more hits averts the berserk rage entirely. If you're already going berserk, increase the duration. When you're berserk, you go after your attacker(s) without regard for your own safety. If you incapacitate the target(s) before the time is up, the berserk fury dissipates.`
  - `Cat magicians toy with their prey. Unless you succeed in a Charisma + Willpower (3) Test at the start of combat, you cannot make an attack that incapacitates your target. If you take any Physical damage, all this playing around stops.`
  - `A Dog magician is stubbornly loyal. You can never leave someone behind, betray your comrades, or let another sacrifice themselves in your place without making a successful Charisma + Willpower (3) Test.`
  - `If you break a promise, whether by choice or by accident, you take a –1 dice pool modifier to all actions until you make good on your promise.`
  - `You get the Allergy (pollutants, mild) quality (p. 322; no bonus Karma for this negative quality).`

### source
**Path**: `chummer/mentors/mentor/source`

- **Count**: 81
- **Presence Rate**: 100.0%
- **Unique Values**: 12
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-4 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: BOTL, BTB, FA, HS, HT, SAG, SASS, SFCC, SG, SHB2, SOTG, SR5

### page
**Path**: `chummer/mentors/mentor/page`

- **Count**: 81
- **Presence Rate**: 100.0%
- **Unique Values**: 34
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `321`
  - `321`
  - `321`
  - `321`
  - `322`

### val
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificpower/val`

- **Count**: 64
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 45.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `2`
  - `1`
  - `1`
  - `1`
- **All Values**: 1, 2, 3

### name
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificskill/name`

- **Count**: 61
- **Presence Rate**: 100.0%
- **Unique Values**: 22
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-19 characters
- **Examples**:
  - `Gymnastics`
  - `Sneaking`
  - `Summoning`
  - `Artisan`
  - `Alchemy`
- **All Values**: Alchemy, Artisan, Assensing, Banishing, Counterspelling, Demolitions, First Aid, Gymnastics, Instruction, Intimidation, Leadership, Medicine, Pilot Ground Craft, Pilot Watercraft, Ritual Spellcasting, Running, Sneaking, Spellcasting, Summoning, Swimming

### bonus
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificskill/bonus`

- **Count**: 60
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 1.7%
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
**Path**: `chummer/mentors/mentor/bonus/specificskill/name`

- **Count**: 58
- **Presence Rate**: 100.0%
- **Unique Values**: 24
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-19 characters
- **Examples**:
  - `Tracking`
  - `Perception`
  - `Survival`
  - `Sneaking`
  - `Con`
- **All Values**: Arcana, Artisan, Blades, Computer, Con, Demolitions, Etiquette, First Aid, Gymnastics, Locksmith, Negotiation, Palming, Perception, Ritual Spellcasting, Running, Sneaking, Survival, Swimming, Tracking, Unarmed Combat

### bonus
**Path**: `chummer/mentors/mentor/bonus/specificskill/bonus`

- **Count**: 58
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 34.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`
  - `2`
- **All Values**: -1, 1, 2

### name
**Path**: `chummer/mentors/mentor/choices/choice/bonus/spellcategory/name`

- **Count**: 54
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-12 characters
- **Examples**:
  - `Health`
  - `Illusion`
  - `Detection`
  - `Combat`
  - `Manipulation`
- **All Values**: Combat, Detection, Health, Illusion, Manipulation

### val
**Path**: `chummer/mentors/mentor/choices/choice/bonus/spellcategory/val`

- **Count**: 54
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`
  - `2`
- **All Values**: 1, 2

### condition
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificskill/condition`

- **Count**: 36
- **Presence Rate**: 100.0%
- **Unique Values**: 17
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-28 characters
- **Examples**:
  - `Spirits of Air`
  - `Spirits of Water`
  - `Spirits of Air`
  - `Physical Combat`
  - `Physical Combat`
- **All Values**: Contractual, Fire, Guardian Spirit, Physical Combat, Plague Spirit, Plant Spirit, Spirits of Air, Spirits of Beasts, Spirits of Earth, Spirits of Earth (Low Tide), Spirits of Fire, Spirits of Man, Spirits of Water, Spirits of Water (High Tide), Sun, Task Spirit, Toxic Spirits

### val
**Path**: `chummer/mentors/mentor/bonus/selectskill/val`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 9.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`
  - `2`
- **All Values**: 1, 2, 4

### val
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectskill/val`

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

### id
**Path**: `chummer/mentors/mentor/choices/choice/bonus/spelldicepool/id`

- **Count**: 6
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `9baed162-5e84-4f19-9b94-d543a560c067`
  - `85c12bae-3954-483c-a211-d8ee43a1c65e`
  - `d866f612-7160-41d2-8ce9-b64262327559`
  - `894e4bea-883e-421b-8a6f-6ca61274cca3`
  - `50f1bfce-a64d-4fac-b25d-d870e7ff312f`
- **All Values**: 06d5a10b-b353-44bc-936a-4d6c08ebeaf8, 50f1bfce-a64d-4fac-b25d-d870e7ff312f, 85c12bae-3954-483c-a211-d8ee43a1c65e, 894e4bea-883e-421b-8a6f-6ca61274cca3, 9baed162-5e84-4f19-9b94-d543a560c067, d866f612-7160-41d2-8ce9-b64262327559

### val
**Path**: `chummer/mentors/mentor/choices/choice/bonus/spelldicepool/val`

- **Count**: 6
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
  - `2`

### addquality
**Path**: `chummer/mentors/mentor/bonus/addqualities/addquality`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-22 characters
- **Examples**:
  - `Allergy (Common, Mild)`
  - `Distinctive Style`
  - `Driven`
  - `Perceptive`
  - `Perceptive`
- **All Values**: Allergy (Common, Mild), Distinctive Style, Driven, Perceptive

### condition
**Path**: `chummer/mentors/mentor/bonus/specificskill/condition`

- **Count**: 5
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-13 characters
- **Examples**:
  - `Climbing`
  - `Balance`
  - `Climbing`
  - `Jumping`
  - `Unknown Areas`
- **All Values**: Balance, Climbing, Jumping, Unknown Areas

### name
**Path**: `chummer/mentors/mentor/bonus/skillcategory/name`

- **Count**: 5
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
**Path**: `chummer/mentors/mentor/bonus/skillcategory/bonus`

- **Count**: 5
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
  - `2`

### category
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectskill/skillcategories/category`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-16 characters
- **Examples**:
  - `Physical Active`
  - `Social Active`
  - `Technical Active`
  - `Vehicle Active`
- **All Values**: Physical Active, Social Active, Technical Active, Vehicle Active

### quality
**Path**: `chummer/mentors/mentor/required/allof/quality`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 15-15 characters
- **Examples**:
  - `The Twisted Way`
  - `The Twisted Way`
  - `The Twisted Way`
  - `The Twisted Way`

### attribute
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectattribute/attribute`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `AGI`
  - `STR`
  - `REA`
- **All Values**: AGI, REA, STR

### val
**Path**: `chummer/mentors/mentor/choices/choice/bonus/selectpowers/selectpower/val`

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

### addquality
**Path**: `chummer/mentors/mentor/choices/choice/bonus/addqualities/addquality`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-15 characters
- **Examples**:
  - `Home Ground`
  - `Witness My Hate`
  - `Linguist`
- **All Values**: Home Ground, Linguist, Witness My Hate

### damageresistance
**Path**: `chummer/mentors/mentor/bonus/damageresistance`

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

### applytorating
**Path**: `chummer/mentors/mentor/bonus/selectskill/applytorating`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`
  - `True`

### name
**Path**: `chummer/mentors/mentor/required/allof/attribute/name`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `BOD`
  - `STR`
- **All Values**: BOD, STR

### total
**Path**: `chummer/mentors/mentor/required/allof/attribute/total`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `4`
  - `4`

### composure
**Path**: `chummer/mentors/mentor/bonus/composure`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### ignorerating
**Path**: `chummer/mentors/mentor/choices/choice/bonus/selectpowers/selectpower/ignorerating`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 4-4 characters
- **Examples**:
  - `True`

### val
**Path**: `chummer/mentors/mentor/choices/choice/bonus/selectskill/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### toxincontactresist
**Path**: `chummer/mentors/mentor/bonus/toxincontactresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### toxiningestionresist
**Path**: `chummer/mentors/mentor/bonus/toxiningestionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### toxininhalationresist
**Path**: `chummer/mentors/mentor/bonus/toxininhalationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### toxininjectionresist
**Path**: `chummer/mentors/mentor/bonus/toxininjectionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### pathogencontactresist
**Path**: `chummer/mentors/mentor/bonus/pathogencontactresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### pathogeningestionresist
**Path**: `chummer/mentors/mentor/bonus/pathogeningestionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### pathogeninhalationresist
**Path**: `chummer/mentors/mentor/bonus/pathogeninhalationresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### pathogeninjectionresist
**Path**: `chummer/mentors/mentor/bonus/pathogeninjectionresist`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### memory
**Path**: `chummer/mentors/mentor/bonus/memory`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### judgeintentions
**Path**: `chummer/mentors/mentor/choices/choice/bonus/judgeintentions`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### name
**Path**: `chummer/mentors/mentor/bonus/skillcategorykarmacost/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 13-13 characters
- **Examples**:
  - `Combat Active`

### val
**Path**: `chummer/mentors/mentor/bonus/skillcategorykarmacost/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### min
**Path**: `chummer/mentors/mentor/bonus/skillcategorykarmacost/min`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`

### condition
**Path**: `chummer/mentors/mentor/bonus/skillcategorykarmacost/condition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 6-6 characters
- **Examples**:
  - `career`

### name
**Path**: `chummer/mentors/mentor/bonus/skillgroup/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `Stealth`

### bonus
**Path**: `chummer/mentors/mentor/bonus/skillgroup/bonus`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### name
**Path**: `chummer/mentors/mentor/bonus/skillgrouplevel/name`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 11-11 characters
- **Examples**:
  - `Engineering`

### val
**Path**: `chummer/mentors/mentor/bonus/skillgrouplevel/val`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### judgeintentions
**Path**: `chummer/mentors/mentor/bonus/judgeintentions`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `2`

### val
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificskill/val`

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

### choice@set
**Path**: `chummer/mentors/mentor/choices/choice@set`

- **Count**: 23
- **Unique Values**: 1
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `2`
  - `2`

### selectskill@limittoskill
**Path**: `chummer/mentors/mentor/bonus/selectskill@limittoskill`

- **Count**: 7
- **Unique Values**: 7
- **Enum Candidate**: Yes
- **Examples**:
  - `Artisan,Forgery`
  - `Artisan,Alchemy`
  - `Palming,Etiquette`
  - `Survival,Running,Tracking`
  - `Anatomy,Disease,Infected,Undead`
- **All Values**: Anatomy,Disease,Infected,Undead, Artisan,Alchemy, Artisan,Forgery, Blades,Clubs,Exotic Melee Weapon,Unarmed Combat, Demolitions,Intimidation, Palming,Etiquette, Survival,Running,Tracking

### selectskill@minimumrating
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectskill@minimumrating`

- **Count**: 6
- **Unique Values**: 1
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`

### selectskill@skillcategory
**Path**: `chummer/mentors/mentor/bonus/selectskill@skillcategory`

- **Count**: 3
- **Unique Values**: 3
- **Enum Candidate**: Yes
- **Examples**:
  - `Social Active`
  - `Physical Active`
  - `Combat Active`
- **All Values**: Combat Active, Physical Active, Social Active

### selectpower@limittopowers
**Path**: `chummer/mentors/mentor/choices/choice/bonus/selectpowers/selectpower@limittopowers`

- **Count**: 3
- **Unique Values**: 2
- **Examples**:
  - `Improved Potential (Social),Improved Potential (Physical),Improved Potential (Mental)`
  - `Improved Potential (Social),Improved Potential (Physical),Improved Potential (Mental)`
  - `Mystic Armor,Empathic Healing`

### selectskill@skillcategory
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectskill@skillcategory`

- **Count**: 2
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Physical Active`
  - `Combat Active`
- **All Values**: Combat Active, Physical Active

### selectskill@knowledgeskills
**Path**: `chummer/mentors/mentor/bonus/selectskill@knowledgeskills`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `True`
  - `True`

### selectskill@limittoskill
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectskill@limittoskill`

- **Count**: 2
- **Unique Values**: 2
- **Examples**:
  - `Artisan,Aeronautics Mechanic,Automotive Mechanic,Industrial Mechanic,Nautical Mechanic`
  - `Con,Impersonation,Performance,Etiquette,Leadership,Negotiation`

### addquality@select
**Path**: `chummer/mentors/mentor/bonus/addqualities/addquality@select`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Pollutants`

### selectskill@skillgroup
**Path**: `chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectskill@skillgroup`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Acting,Influence`

### selectskill@skillcategory
**Path**: `chummer/mentors/mentor/choices/choice/bonus/selectskill@skillcategory`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Combat Active`

### selectskill@prompt
**Path**: `chummer/mentors/mentor/bonus/selectskill@prompt`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Holy Text`

## Type Improvement Recommendations

### Enum Candidates
- **damageresistance** (`chummer/mentors/mentor/bonus/damageresistance`): 2 unique values
  - Values: 1, 2
- **name** (`chummer/mentors/mentor/choices/choice/bonus/spellcategory/name`): 5 unique values
  - Values: Combat, Detection, Health, Illusion, Manipulation
- **val** (`chummer/mentors/mentor/choices/choice/bonus/spellcategory/val`): 2 unique values
  - Values: 1, 2
- **name** (`chummer/mentors/mentor/choices/choice/bonus/specificpower/name`): 41 unique values
  - Values: Analytics, Astral Perception, Berserk, Critical Strike, Enhanced Accuracy (skill), Improved Sense, Inertia Strike, Iron Will, Light Body, Motion Sense, Natural Immunity, Pain Resistance, Rapid Healing, Spirit Claw, Spirit Ram, Stillness, Temperature Tolerance, Three-Dimensional Memory, Toxic Strike, Traceless Walk
- **val** (`chummer/mentors/mentor/choices/choice/bonus/specificpower/val`): 3 unique values
  - Values: 1, 2, 3
- **source** (`chummer/mentors/mentor/source`): 12 unique values
  - Values: BOTL, BTB, FA, HS, HT, SAG, SASS, SFCC, SG, SHB2, SOTG, SR5
- **page** (`chummer/mentors/mentor/page`): 34 unique values
  - Values: 120, 122, 123, 129, 132, 137, 179, 200, 24, 29, 322, 41, 42, 43, 46, 86, 94, 95, 96, 99
- **name** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/name`): 22 unique values
  - Values: Alchemy, Artisan, Assensing, Banishing, Counterspelling, Demolitions, First Aid, Gymnastics, Instruction, Intimidation, Leadership, Medicine, Pilot Ground Craft, Pilot Watercraft, Ritual Spellcasting, Running, Sneaking, Spellcasting, Summoning, Swimming
- **bonus** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/bonus`): 2 unique values
  - Values: 1, 2
- **name** (`chummer/mentors/mentor/bonus/specificskill/name`): 24 unique values
  - Values: Arcana, Artisan, Blades, Computer, Con, Demolitions, Etiquette, First Aid, Gymnastics, Locksmith, Negotiation, Palming, Perception, Ritual Spellcasting, Running, Sneaking, Survival, Swimming, Tracking, Unarmed Combat
- **bonus** (`chummer/mentors/mentor/bonus/specificskill/bonus`): 3 unique values
  - Values: -1, 1, 2
- **val** (`chummer/mentors/mentor/bonus/selectskill/val`): 3 unique values
  - Values: 1, 2, 4
- **addquality** (`chummer/mentors/mentor/bonus/addqualities/addquality`): 4 unique values
  - Values: Allergy (Common, Mild), Distinctive Style, Driven, Perceptive
- **condition** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/condition`): 17 unique values
  - Values: Contractual, Fire, Guardian Spirit, Physical Combat, Plague Spirit, Plant Spirit, Spirits of Air, Spirits of Beasts, Spirits of Earth, Spirits of Earth (Low Tide), Spirits of Fire, Spirits of Man, Spirits of Water, Spirits of Water (High Tide), Sun, Task Spirit, Toxic Spirits
- **category** (`chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectskill/skillcategories/category`): 4 unique values
  - Values: Physical Active, Social Active, Technical Active, Vehicle Active
- **attribute** (`chummer/mentors/mentor/choices/choice/bonus/specificpower/bonusoverride/selectattribute/attribute`): 3 unique values
  - Values: AGI, REA, STR
- **condition** (`chummer/mentors/mentor/bonus/specificskill/condition`): 4 unique values
  - Values: Balance, Climbing, Jumping, Unknown Areas
- **addquality** (`chummer/mentors/mentor/choices/choice/bonus/addqualities/addquality`): 3 unique values
  - Values: Home Ground, Linguist, Witness My Hate
- **name** (`chummer/mentors/mentor/bonus/skillcategory/name`): 5 unique values
  - Values: Academic, Interest, Language, Professional, Street
- **id** (`chummer/mentors/mentor/choices/choice/bonus/spelldicepool/id`): 6 unique values
  - Values: 06d5a10b-b353-44bc-936a-4d6c08ebeaf8, 50f1bfce-a64d-4fac-b25d-d870e7ff312f, 85c12bae-3954-483c-a211-d8ee43a1c65e, 894e4bea-883e-421b-8a6f-6ca61274cca3, 9baed162-5e84-4f19-9b94-d543a560c067, d866f612-7160-41d2-8ce9-b64262327559
- **name** (`chummer/mentors/mentor/required/allof/attribute/name`): 2 unique values
  - Values: BOD, STR

### Numeric Type Candidates
- **composure** (`chummer/mentors/mentor/bonus/composure`): 100.0% numeric
  - Examples: 2
- **val** (`chummer/mentors/mentor/choices/choice/bonus/selectpowers/selectpower/val`): 100.0% numeric
  - Examples: 1, 1, 1
- **val** (`chummer/mentors/mentor/choices/choice/bonus/selectskill/val`): 100.0% numeric
  - Examples: 2
- **toxincontactresist** (`chummer/mentors/mentor/bonus/toxincontactresist`): 100.0% numeric
  - Examples: 2
- **toxiningestionresist** (`chummer/mentors/mentor/bonus/toxiningestionresist`): 100.0% numeric
  - Examples: 2
- **toxininhalationresist** (`chummer/mentors/mentor/bonus/toxininhalationresist`): 100.0% numeric
  - Examples: 2
- **toxininjectionresist** (`chummer/mentors/mentor/bonus/toxininjectionresist`): 100.0% numeric
  - Examples: 2
- **pathogencontactresist** (`chummer/mentors/mentor/bonus/pathogencontactresist`): 100.0% numeric
  - Examples: 2
- **pathogeningestionresist** (`chummer/mentors/mentor/bonus/pathogeningestionresist`): 100.0% numeric
  - Examples: 2
- **pathogeninhalationresist** (`chummer/mentors/mentor/bonus/pathogeninhalationresist`): 100.0% numeric
  - Examples: 2
- **pathogeninjectionresist** (`chummer/mentors/mentor/bonus/pathogeninjectionresist`): 100.0% numeric
  - Examples: 2
- **memory** (`chummer/mentors/mentor/bonus/memory`): 100.0% numeric
  - Examples: 2
- **judgeintentions** (`chummer/mentors/mentor/choices/choice/bonus/judgeintentions`): 100.0% numeric
  - Examples: 2
- **bonus** (`chummer/mentors/mentor/bonus/skillcategory/bonus`): 100.0% numeric
  - Examples: 2, 2, 2
- **val** (`chummer/mentors/mentor/choices/choice/bonus/spelldicepool/val`): 100.0% numeric
  - Examples: 2, 2, 2
- **val** (`chummer/mentors/mentor/bonus/skillcategorykarmacost/val`): 100.0% numeric
  - Examples: -1
- **min** (`chummer/mentors/mentor/bonus/skillcategorykarmacost/min`): 100.0% numeric
  - Examples: 3
- **total** (`chummer/mentors/mentor/required/allof/attribute/total`): 100.0% numeric
  - Examples: 4, 4
- **bonus** (`chummer/mentors/mentor/bonus/skillgroup/bonus`): 100.0% numeric
  - Examples: 2
- **val** (`chummer/mentors/mentor/bonus/skillgrouplevel/val`): 100.0% numeric
  - Examples: 1
- **judgeintentions** (`chummer/mentors/mentor/bonus/judgeintentions`): 100.0% numeric
  - Examples: 2
- **val** (`chummer/mentors/mentor/choices/choice/bonus/specificskill/val`): 100.0% numeric
  - Examples: 1

### Boolean Type Candidates
- **ignorerating** (`chummer/mentors/mentor/choices/choice/bonus/selectpowers/selectpower/ignorerating`): 100.0% boolean
  - Examples: True
- **applytorating** (`chummer/mentors/mentor/bonus/selectskill/applytorating`): 100.0% boolean
  - Examples: True, True
