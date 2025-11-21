# Type Improvement Recommendations

This document provides prioritized recommendations for improving type safety in generated structs.

## High Priority

### Boolean String Fields

Fields that are ≥95% boolean values should be converted to bool type.


- **actions** - `chummer/version`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 0

- **actions** - `chummer/actions/action/edgecost`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1, 1

- **armor** - `chummer/armors/armor/wirelessbonus/skillcategory/bonus`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1, 1, 1

- **armor** - `chummer/armors/armor/wirelessbonus/specificskill/bonus`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1, 1, 1

- **armor** - `chummer/armors/armor/bonus/sociallimit`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1

- **armor** - `chummer/armors/armor/bonus/specificskill/bonus`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1, 1

- **armor** - `chummer/mods/mod/wirelessbonus/limitmodifier/value`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1

- **bioware** - `chummer/grades/grade/devicerating`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 0, 0, 0

- **bioware** - `chummer/biowares/bioware/capacity`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 0, 0, 0

- **bioware** - `chummer/biowares/bioware/bonus/physicallimit`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1, 1

- **bioware** - `chummer/biowares/bioware/bonus/selectskill/val`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1, 1, 1

- **bioware** - `chummer/biowares/bioware/bonus/unarmedreach`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1

- **bioware** - `chummer/biowares/bioware/pairbonus/walkmultiplier/val`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1, 1

- **bioware** - `chummer/biowares/bioware/pairbonus/unarmedreach`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1

- **bioware** - `chummer/biowares/bioware/pairbonus/reach`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1, 1, 1

- **bioware** - `chummer/biowares/bioware/pairbonus/unarmeddv`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1, 1

- **bioware** - `chummer/biowares/bioware/bonus/selectskill/applytorating`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: True

- **bioware** - `chummer/biowares/bioware/bonus/composure`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1

- **bioware** - `chummer/biowares/bioware/bonus/judgeintentionsdefense`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1

- **bioware** - `chummer/biowares/bioware/bonus/drainresist`
  - Current: string (boolean_ratio: 100.0%)
  - Recommended: bool
  - Examples: 1

### Numeric String Fields

Fields that are ≥95% numeric should be converted to int/float types.


- **actions** - `chummer/version`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 0

- **actions** - `chummer/actions/action/page`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 168, 186, 179

- **actions** - `chummer/actions/action/initiativecost`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 5, 5, 5

- **actions** - `chummer/actions/action/edgecost`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 1, 1

- **armor** - `chummer/armors/armor/page`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 437, 437, 437

- **armor** - `chummer/armors/armor/bonus/limitmodifier/value`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 2, -1, -1

- **armor** - `chummer/armors/armor/wirelessbonus/skillcategory/bonus`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 1, 1, 1

- **armor** - `chummer/armors/armor/armoroverride`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: +3, +3, +4

- **armor** - `chummer/armors/armor/wirelessbonus/limitmodifier/value`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 1, 1, 1

- **armor** - `chummer/armors/armor/wirelessbonus/specificskill/bonus`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 1, 1, 1

- **armor** - `chummer/armors/armor/bonus/fatigueresist`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: -2

- **armor** - `chummer/armors/armor/rating`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 6, 6, 4

- **armor** - `chummer/armors/armor/gears/usegear/rating`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 2, 2

- **armor** - `chummer/armors/armor/bonus/sociallimit`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 1

- **armor** - `chummer/armors/armor/bonus/specificskill/bonus`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 1, 1

- **armor** - `chummer/mods/mod/armor`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 0, 0, 4

- **armor** - `chummer/mods/mod/maxrating`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 1, 1, 1

- **armor** - `chummer/mods/mod/page`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 437, 437, 437

- **armor** - `chummer/mods/mod/gearcapacity`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 6, 6, 1

- **armor** - `chummer/mods/mod/wirelessbonus/limitmodifier/value`
  - Current: string (numeric_ratio: 100.0%)
  - Recommended: int or float (depending on examples)
  - Examples: 1

## Medium Priority

### Enum Type Conversions

Fields with limited, well-defined value sets should be converted to enums.


#### name
Appears in 133 file(s). Example from actions:

```go
type nameEnum string

const (
    nameINT_DATA_PROCESSING_DEFENSE nameEnum = "INT Data Processing Defense"
    nameINT_FIREWALL_DEFENSE nameEnum = "INT Firewall Defense"
    nameLOG_ATTACK_DEFENSE nameEnum = "LOG Attack Defense"
    nameLOG_DATA_PROCESSING_DEFENSE nameEnum = "LOG Data Processing Defense"
    nameLOG_FIREWALL_DEFENSE nameEnum = "LOG Firewall Defense"
    nameLOG_SLEAZE_DEFENSE nameEnum = "LOG Sleaze Defense"
    nameMELEE_DEFENSE nameEnum = "Melee Defense"
    nameRANGED_DEFENSE nameEnum = "Ranged Defense"
    nameSUPPRESSIVE_FIRE_DEFENSE nameEnum = "Suppressive Fire Defense"
    nameWIL_ATTACK_DEFENSE nameEnum = "WIL Attack Defense"
    nameWIL_DATA_PROCESSING_DEFENSE nameEnum = "WIL Data Processing Defense"
    nameWIL_FIREWALL_DEFENSE nameEnum = "WIL Firewall Defense"
    nameWIL_SLEAZE_DEFENSE nameEnum = "WIL Sleaze Defense"
)
```


#### category
Appears in 73 file(s). Example from armor:

```go
type categoryEnum string

const (
    categoryARMOR categoryEnum = "Armor"
    categoryCLOAKS categoryEnum = "Cloaks"
    categoryCLOTHING categoryEnum = "Clothing"
    categoryHIGH_FASHION_ARMOR_CLOTHING categoryEnum = "High-Fashion Armor Clothing"
    categorySPECIALTY_ARMOR categoryEnum = "Specialty Armor"
)
```


#### source
Appears in 38 file(s). Example from actions:

```go
type sourceEnum string

const (
    sourceDT sourceEnum = "DT"
    sourceKC sourceEnum = "KC"
    sourceR5 sourceEnum = "R5"
    sourceRG sourceEnum = "RG"
    sourceSR5 sourceEnum = "SR5"
)
```


#### val
Appears in 35 file(s). Example from bioware:

```go
type valEnum string

const (
    val1 valEnum = "1"
    valRATING valEnum = "Rating"
)
```


#### page
Appears in 30 file(s). Example from armor:

```go
type pageEnum string

const (
    page138 pageEnum = "138"
    page156 pageEnum = "156"
    page173 pageEnum = "173"
    page185 pageEnum = "185"
    page23 pageEnum = "23"
    page437 pageEnum = "437"
    page438 pageEnum = "438"
    page48 pageEnum = "48"
    page59 pageEnum = "59"
    page62 pageEnum = "62"
    page65 pageEnum = "65"
    page73 pageEnum = "73"
    page84 pageEnum = "84"
    page85 pageEnum = "85"
)
```


#### quality
Appears in 25 file(s). Example from complexforms:

```go
type qualityEnum string

const (
    qualityDISSONANT_STREAM:_APOPHENIAN qualityEnum = "Dissonant Stream: Apophenian"
    qualityDISSONANT_STREAM:_ERISIAN qualityEnum = "Dissonant Stream: Erisian"
    qualityDISSONANT_STREAM:_MORPHINAE qualityEnum = "Dissonant Stream: Morphinae"
    qualityRESONANT_STREAM:_CYBERADEPT qualityEnum = "Resonant Stream: Cyberadept"
    qualityRESONANT_STREAM:_MACHINIST qualityEnum = "Resonant Stream: Machinist"
    qualityRESONANT_STREAM:_SOURCEROR qualityEnum = "Resonant Stream: Sourceror"
    qualityRESONANT_STREAM:_TECHNOSHAMAN qualityEnum = "Resonant Stream: Technoshaman"
)
```


#### id
Appears in 23 file(s). Example from bioware:

```go
type idEnum string

const (
    id0C86E85C_7E3E_4B6F_AA4B_26D8B379A7C9 idEnum = "0c86e85c-7e3e-4b6f-aa4b-26d8b379a7c9"
    id2B599ECD_4E80_4669_A78E_4DB232C80A83 idEnum = "2b599ecd-4e80-4669-a78e-4db232c80a83"
    id9166244C_440B_44A1_8795_4917B53E6101 idEnum = "9166244c-440b-44a1-8795-4917b53e6101"
    id9E24F0CE_B41E_496F_844A_82805FCB65A9 idEnum = "9e24f0ce-b41e-496f-844a-82805fcb65a9"
    idA6FBA72C_9FBE_41DC_8310_CD047B50C81E idEnum = "a6fba72c-9fbe-41dc-8310-cd047b50c81e"
    idC2C6A3CC_C4BF_42C8_9260_868FD44D34CE idEnum = "c2c6a3cc-c4bf-42c8-9260-868fd44d34ce"
    idC4BBFFE4_5818_4055_BC5E_F44562BDE855 idEnum = "c4bbffe4-5818-4055-bc5e-f44562bde855"
    idEE71D4F8_0FD0_4992_8B4E_70EF4DFBCCE1 idEnum = "ee71d4f8-0fd0-4992-8b4e-70ef4dfbcce1"
    idF0A67DC0_6B0A_43FA_B389_A110BA1DD59D idEnum = "f0a67dc0-6b0a-43fa-b389-a110ba1dd59d"
)
```


#### rating
Appears in 22 file(s). Example from armor:

```go
type ratingEnum string

const (
    rating24 ratingEnum = "24"
    rating4 ratingEnum = "4"
    rating6 ratingEnum = "6"
)
```


#### value
Appears in 19 file(s). Example from armor:

```go
type valueEnum string

const (
    value_1 valueEnum = "-1"
    value1 valueEnum = "1"
    value2 valueEnum = "2"
    value3 valueEnum = "3"
)
```


#### limit
Appears in 17 file(s). Example from actions:

```go
type limitEnum string

const (
    limitVARIABLE limitEnum = "Variable"
    limit{ASTRAL} limitEnum = "{Astral}"
    limit{ICON:_ATTACK} limitEnum = "{Icon: Attack}"
    limit{ICON:_DATA_PROCESSING} limitEnum = "{Icon: Data Processing}"
    limit{ICON:_FIREWALL} limitEnum = "{Icon: Firewall}"
    limit{ICON:_SLEAZE} limitEnum = "{Icon: Sleaze}"
    limit{MAX:_{ICON:_SLEAZE}_OR_{ICON:_ATTACK}} limitEnum = "{Max: {Icon: Sleaze} or {Icon: Attack}}"
    limit{MAX:_{WEAPON:_ACCURACY}_OR_{VEHICLE:_SENSOR}} limitEnum = "{Max: {Weapon: Accuracy} or {Vehicle: Sensor}}"
    limit{MENTAL} limitEnum = "{Mental}"
    limit{PHYSICAL} limitEnum = "{Physical}"
    limit{SOCIAL} limitEnum = "{Social}"
    limit{SPELL:_FORCE} limitEnum = "{Spell: Force}"
    limit{SPIRIT:_FORCE} limitEnum = "{Spirit: Force}"
    limit{TARGET:_{ICON:_RATING}} limitEnum = "{Target: {Icon: Rating}}"
    limit{TARGET:_{SPELL:_FORCE}} limitEnum = "{Target: {Spell: Force}}"
    limit{VEHICLE:_HANDLING} limitEnum = "{Vehicle: Handling}"
    limit{VEHICLE:_SENSOR} limitEnum = "{Vehicle: Sensor}"
    limit{WEAPON:_ACCURACY} limitEnum = "{Weapon: Accuracy}"
    limit{WEAPON:_LIMIT} limitEnum = "{Weapon: Limit}"
)
```


#### bonus
Appears in 15 file(s). Example from bioware:

```go
type bonusEnum string

const (
    bonus1 bonusEnum = "1"
    bonus2 bonusEnum = "2"
    bonus3 bonusEnum = "3"
)
```


#### condition
Appears in 11 file(s). Example from armor:

```go
type conditionEnum string

const (
    conditionLIMITCONDITION_BUNKERGEARVISIBLE conditionEnum = "LimitCondition_BunkerGearVisible"
    conditionLIMITCONDITION_CORPORATIONVISIBLE conditionEnum = "LimitCondition_CorporationVisible"
    conditionLIMITCONDITION_EXCLUDEFANSGANGERS conditionEnum = "LimitCondition_ExcludeFansGangers"
    conditionLIMITCONDITION_EXCLUDEINTIMIDATIONVISIBLE conditionEnum = "LimitCondition_ExcludeIntimidationVisible"
    conditionLIMITCONDITION_GANGVISIBLE conditionEnum = "LimitCondition_GangVisible"
    conditionLIMITCONDITION_INTIMIDATIONVISIBLE conditionEnum = "LimitCondition_IntimidationVisible"
    conditionLIMITCONDITION_PUBLICVISIBLE conditionEnum = "LimitCondition_PublicVisible"
    conditionLIMITCONDITION_SHIELDPHYSICALPENALTY conditionEnum = "LimitCondition_ShieldPhysicalPenalty"
    conditionLIMITCONDITION_SKILLSACTIVEGYMNASTICSCLIMBING conditionEnum = "LimitCondition_SkillsActiveGymnasticsClimbing"
    conditionLIMITCONDITION_SKILLSACTIVESNEAKINGVISIBLE conditionEnum = "LimitCondition_SkillsActiveSneakingVisible"
    conditionLIMITCONDITION_SPORTSFANS conditionEnum = "LimitCondition_SportsFans"
    conditionLIMITCONDITION_SPORTSRIVALS conditionEnum = "LimitCondition_SportsRivals"
    conditionLIMITCONDITION_VISIBLE conditionEnum = "LimitCondition_Visible"
)
```


#### armor
Appears in 10 file(s). Example from armor:

```go
type armorEnum string

const (
    armor+1 armorEnum = "+1"
    armor+10 armorEnum = "+10"
    armor+3 armorEnum = "+3"
    armor+4 armorEnum = "+4"
    armor+6 armorEnum = "+6"
    armor0 armorEnum = "0"
    armor1 armorEnum = "1"
    armor10 armorEnum = "10"
    armor12 armorEnum = "12"
    armor13 armorEnum = "13"
    armor14 armorEnum = "14"
    armor15 armorEnum = "15"
    armor16 armorEnum = "16"
    armor20 armorEnum = "20"
    armor3 armorEnum = "3"
    armor4 armorEnum = "4"
    armor6 armorEnum = "6"
    armor8 armorEnum = "8"
    armor9 armorEnum = "9"
    armorRATING armorEnum = "Rating"
)
```


#### power
Appears in 10 file(s). Example from critters:

```go
type powerEnum string

const (
    powerANIMAL_CONTROL powerEnum = "Animal Control"
    powerASTRAL_FORM powerEnum = "Astral Form"
    powerASTRAL_GATEWAY powerEnum = "Astral Gateway"
    powerBANISHING_RESISTANCE powerEnum = "Banishing Resistance"
    powerCOMPULSION powerEnum = "Compulsion"
    powerCONCEALMENT powerEnum = "Concealment"
    powerCONFUSION powerEnum = "Confusion"
    powerELEMENTAL_ATTACK powerEnum = "Elemental Attack"
    powerENERGY_DRAIN powerEnum = "Energy Drain"
    powerFEAR powerEnum = "Fear"
    powerGUARD powerEnum = "Guard"
    powerIMMUNITY powerEnum = "Immunity"
    powerINHABITATION powerEnum = "Inhabitation"
    powerNATURAL_WEAPON powerEnum = "Natural Weapon"
    powerREINFORCEMENT powerEnum = "Reinforcement"
    powerSAPIENCE powerEnum = "Sapience"
    powerSEARCH powerEnum = "Search"
    powerSONIC_PROJECTION powerEnum = "Sonic Projection"
    powerVENOM powerEnum = "Venom"
    powerWEALTH powerEnum = "Wealth"
)
```


#### metatype
Appears in 9 file(s). Example from bioware:

```go
type metatypeEnum string

const (
    metatypeORK metatypeEnum = "Ork"
    metatypeTROLL metatypeEnum = "Troll"
)
```


## Low Priority

### Custom Types for Complex Fields

Consider creating custom types for fields with special formats:


- **Availability**: Format like `6F`, `12R` (number + legality code)

- **Cost**: May contain expressions like `(Rating * 30)`

- **Source/Page**: Sourcebook abbreviations and page numbers

- **Rating**: Mostly numeric but may support expressions


## Breaking Change Assessment

### Impact Analysis

- **Boolean conversions**: Low impact - mostly internal fields

- **Numeric conversions**: Medium impact - may affect API responses

- **Enum conversions**: High impact - requires validation and migration

- **Custom types**: Medium impact - requires new type definitions


## Migration Strategy

1. **Phase 1**: Add new typed fields alongside existing string fields

2. **Phase 2**: Update code to use typed fields

3. **Phase 3**: Deprecate string fields

4. **Phase 4**: Remove string fields in next major version


### Validation Requirements

- Add validation for enum values

- Add parsing for numeric expressions in cost/rating fields

- Add validation for availability format

- Add unit tests for type conversions

