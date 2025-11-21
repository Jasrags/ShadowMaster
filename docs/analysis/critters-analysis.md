# Analysis Report: critters.xml

**File**: `data\chummerxml\critters.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 26242
- **Unique Fields**: 138
- **Unique Attributes**: 22
- **Unique Element Types**: 165

## Fields

### power
**Path**: `chummer/metatypes/metatype/powers/power`

- **Count**: 1846
- **Presence Rate**: 100.0%
- **Unique Values**: 133
- **Type Patterns**: string
- **Length Range**: 4-29 characters
- **Examples**:
  - `Domesticated`
  - `Enhanced Senses`
  - `Enhanced Senses`
  - `Natural Weapon`
  - `Natural Weapon`

### skill
**Path**: `chummer/metatypes/metatype/skills/skill`

- **Count**: 1461
- **Presence Rate**: 100.0%
- **Unique Values**: 52
- **Type Patterns**: string
- **Length Range**: 3-20 characters
- **Examples**:
  - `Intimidation`
  - `Perception`
  - `Running`
  - `Tracking`
  - `Unarmed Combat`

### power
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/powers/power`

- **Count**: 792
- **Presence Rate**: 100.0%
- **Unique Values**: 30
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-20 characters
- **Examples**:
  - `Animal Control`
  - `Astral Form`
  - `Elemental Attack`
  - `Guard`
  - `Hive Mind`
- **All Values**: Animal Control, Astral Form, Astral Gateway, Banishing Resistance, Compulsion, Concealment, Confusion, Elemental Attack, Energy Drain, Fear, Guard, Immunity, Inhabitation, Natural Weapon, Reinforcement, Sapience, Search, Sonic Projection, Venom, Wealth

### skill
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/skills/skill`

- **Count**: 447
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-20 characters
- **Examples**:
  - `Assensing`
  - `Astral Combat`
  - `Leadership`
  - `Perception`
  - `Unarmed Combat`
- **All Values**: Assensing, Astral Combat, Con, Counterspelling, Exotic Ranged Weapon, Flight, Gymnastics, Leadership, Negotiation, Perception, Sneaking, Spellcasting, Unarmed Combat

### name
**Path**: `chummer/metatypes/metatype/bonus/enabletab/name`

- **Count**: 308
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-12 characters
- **Examples**:
  - `critter`
  - `critter`
  - `critter`
  - `critter`
  - `critter`
- **All Values**: critter, magician, technomancer

### optionalpower
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/optionalpowers/optionalpower`

- **Count**: 276
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-15 characters
- **Examples**:
  - `Binding`
  - `Confusion`
  - `Enhanced Senses`
  - `Enhanced Senses`
  - `Enhanced Senses`
- **All Values**: Binding, Compulsion, Concealment, Confusion, Enhanced Senses, Essence Drain, Fear, Guard, Magical Guard, Natural Weapon, Noxious Breath, Pestilence, Venom

### id
**Path**: `chummer/metatypes/metatype/id`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 269
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `47428a29-890f-4b3a-9d18-d8c2e581f1b4`
  - `7983859b-5c38-47b7-b127-2649f0c8c1b0`
  - `d4a66987-de45-4bd1-a1f3-c8573ba6d8cf`
  - `a38329e9-cdfb-441f-9594-1ecf5fcdd787`
  - `d6da129f-65b2-4fb4-aae3-a73e6937a2a6`

### name
**Path**: `chummer/metatypes/metatype/name`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 268
- **Type Patterns**: string
- **Length Range**: 3-38 characters
- **Examples**:
  - `Dog`
  - `Great Cat`
  - `Horse`
  - `Shark`
  - `Wolf`

### category
**Path**: `chummer/metatypes/metatype/category`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 18
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-21 characters
- **Examples**:
  - `Mundane Critters`
  - `Mundane Critters`
  - `Mundane Critters`
  - `Mundane Critters`
  - `Mundane Critters`
- **All Values**: Dracoforms, Extraplanar Travelers, Infected, Insect Spirits, Mundane Critters, Mutant Critters, Necro Spirits, Paranormal Critters, Protosapients, Ritual, Shadow Spirits, Shedim, Spirits, Sprites, Technocritters, Toxic Critters, Toxic Spirits, Warforms

### bodmin
**Path**: `chummer/metatypes/metatype/bodmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 30
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 70.3%
- **Boolean Ratio**: 14.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `4`
  - `6`
  - `8`
  - `5`
  - `6`
- **All Values**: 0, 1, 10, 12, 13, 14, 15, 16, 17, 20, 8, 9, F, F+1, F+3, F+4, F+5, F+7, F-2, F-3

### bodmax
**Path**: `chummer/metatypes/metatype/bodmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 31
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 70.3%
- **Boolean Ratio**: 9.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `7`
  - `9`
  - `11`
  - `8`
  - `9`

### bodaug
**Path**: `chummer/metatypes/metatype/bodaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 33
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 70.3%
- **Boolean Ratio**: 7.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `11`
  - `13`
  - `15`
  - `12`
  - `13`

### agimin
**Path**: `chummer/metatypes/metatype/agimin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.9%
- **Boolean Ratio**: 7.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `3`
  - `5`
  - `5`
  - `4`
  - `3`
- **All Values**: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3

### agimax
**Path**: `chummer/metatypes/metatype/agimax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.9%
- **Boolean Ratio**: 6.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `6`
  - `8`
  - `8`
  - `7`
  - `6`
- **All Values**: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3

### agiaug
**Path**: `chummer/metatypes/metatype/agiaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 24
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.9%
- **Boolean Ratio**: 6.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `10`
  - `12`
  - `12`
  - `11`
  - `10`
- **All Values**: 0, 1, 10, 12, 13, 14, 3, 4, 6, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3

### reamin
**Path**: `chummer/metatypes/metatype/reamin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.9%
- **Boolean Ratio**: 7.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `4`
  - `4`
  - `5`
  - `5`
  - `5`
- **All Values**: 0, 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2

### reamax
**Path**: `chummer/metatypes/metatype/reamax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.9%
- **Boolean Ratio**: 7.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `7`
  - `7`
  - `8`
  - `8`
  - `8`
- **All Values**: 0, 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2

### reaaug
**Path**: `chummer/metatypes/metatype/reaaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 24
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.9%
- **Boolean Ratio**: 6.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `11`
  - `11`
  - `12`
  - `12`
  - `12`
- **All Values**: 0, 1, 10, 12, 13, 14, 15, 3, 4, 6, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2

### strmin
**Path**: `chummer/metatypes/metatype/strmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 30
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.9%
- **Boolean Ratio**: 16.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `4`
  - `5`
  - `8`
  - `5`
  - `5`
- **All Values**: 0, 1, 10, 12, 13, 16, 30, 35, 40, 42, 8, 9, F, F+1, F+3, F+4, F+5, F+6, F-2, F-3

### strmax
**Path**: `chummer/metatypes/metatype/strmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 33
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.9%
- **Boolean Ratio**: 10.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `7`
  - `8`
  - `11`
  - `8`
  - `8`

### straug
**Path**: `chummer/metatypes/metatype/straug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 35
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 66.9%
- **Boolean Ratio**: 7.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `11`
  - `12`
  - `15`
  - `12`
  - `12`

### chamin
**Path**: `chummer/metatypes/metatype/chamin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 22.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `3`
  - `3`
  - `4`
  - `1`
  - `3`
- **All Values**: 0, 1, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

### chamax
**Path**: `chummer/metatypes/metatype/chamax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 17
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 17.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `6`
  - `6`
  - `7`
  - `4`
  - `6`
- **All Values**: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

### chaaug
**Path**: `chummer/metatypes/metatype/chaaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 14.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `10`
  - `10`
  - `11`
  - `8`
  - `10`
- **All Values**: 0, 1, 10, 11, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

### intmin
**Path**: `chummer/metatypes/metatype/intmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 6.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `4`
  - `3`
  - `3`
  - `4`
  - `4`
- **All Values**: 1, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F-1, F-2

### intmax
**Path**: `chummer/metatypes/metatype/intmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 5.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `7`
  - `6`
  - `6`
  - `7`
  - `7`
- **All Values**: 1, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F-1, F-2

### intaug
**Path**: `chummer/metatypes/metatype/intaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 19
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 4.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `11`
  - `10`
  - `10`
  - `11`
  - `11`
- **All Values**: 1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F-1, F-2

### logmin
**Path**: `chummer/metatypes/metatype/logmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 17
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 28.3%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `2`
  - `2`
  - `2`
  - `1`
  - `2`
- **All Values**: 0, 1, 10, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

### logmax
**Path**: `chummer/metatypes/metatype/logmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 16
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 13.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `5`
  - `5`
  - `5`
  - `4`
  - `5`
- **All Values**: 1, 10, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

### logaug
**Path**: `chummer/metatypes/metatype/logaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 18
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 11.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `9`
  - `9`
  - `9`
  - `8`
  - `9`
- **All Values**: 1, 10, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2

### wilmin
**Path**: `chummer/metatypes/metatype/wilmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 8.6%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `3`
  - `3`
  - `3`
  - `3`
  - `3`
- **All Values**: 1, 10, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+4, F-1, F-2

### wilmax
**Path**: `chummer/metatypes/metatype/wilmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 17
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 6.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `6`
  - `6`
  - `6`
  - `6`
  - `6`
- **All Values**: 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+4, F-1, F-2

### wilaug
**Path**: `chummer/metatypes/metatype/wilaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 20
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 67.7%
- **Boolean Ratio**: 4.5%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `10`
  - `10`
  - `10`
  - `10`
  - `10`
- **All Values**: 1, 10, 11, 12, 13, 15, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+4, F-1, F-2

### inimin
**Path**: `chummer/metatypes/metatype/inimin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 26
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 63.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `8`
  - `8`
  - `8`
  - `9`
  - `9`
- **All Values**: (F*2), (F*2)+1, (F*2)+2, (F*2)+4, (F*2)+5, (F*2)+6, 10, 12, 13, 14, 15, 16, 3, 4, 6, 8, 9, F, F+1, F-1

### inimax
**Path**: `chummer/metatypes/metatype/inimax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 28
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 63.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `14`
  - `14`
  - `14`
  - `15`
  - `15`
- **All Values**: (F*2), (F*2)+1, (F*2)+2, (F*2)+4, (F*2)+6, 10, 12, 13, 14, 15, 16, 17, 22, 3, 6, 8, 9, F, F+1, F-1

### iniaug
**Path**: `chummer/metatypes/metatype/iniaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 34
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 63.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-7 characters
- **Examples**:
  - `22`
  - `22`
  - `22`
  - `23`
  - `23`

### edgmin
**Path**: `chummer/metatypes/metatype/edgmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 10
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 71.0%
- **Boolean Ratio**: 16.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `3`
  - `3`
  - `2`
  - `2`
  - `3`
- **All Values**: 0, 1, 2, 3, 4, 5, 6, 9, F, F/2

### edgmax
**Path**: `chummer/metatypes/metatype/edgmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 71.0%
- **Boolean Ratio**: 14.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `6`
  - `6`
  - `5`
  - `5`
  - `6`
- **All Values**: 0, 1, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F/2

### edgaug
**Path**: `chummer/metatypes/metatype/edgaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 71.0%
- **Boolean Ratio**: 13.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `6`
  - `6`
  - `5`
  - `5`
  - `6`
- **All Values**: 0, 1, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F/2

### magmin
**Path**: `chummer/metatypes/metatype/magmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 70.3%
- **Boolean Ratio**: 39.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 1, 10, 2, 3, 4, 5, 6, F

### magmax
**Path**: `chummer/metatypes/metatype/magmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 70.3%
- **Boolean Ratio**: 20.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `3`
  - `3`
  - `3`
  - `3`
  - `3`
- **All Values**: 0, 13, 2, 3, 4, 5, 6, 7, 8, 9, F

### magaug
**Path**: `chummer/metatypes/metatype/magaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 70.3%
- **Boolean Ratio**: 20.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `3`
  - `3`
  - `3`
  - `3`
  - `3`
- **All Values**: 0, 10, 13, 3, 4, 5, 6, 7, 8, 9, F

### resmin
**Path**: `chummer/metatypes/metatype/resmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 7
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 97.4%
- **Boolean Ratio**: 85.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 2, 3, 4, 5, 6, F

### resmax
**Path**: `chummer/metatypes/metatype/resmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 97.4%
- **Boolean Ratio**: 46.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `3`
  - `3`
  - `3`
  - `3`
- **All Values**: 0, 3, 5, 6, F

### resaug
**Path**: `chummer/metatypes/metatype/resaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 97.4%
- **Boolean Ratio**: 46.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`
  - `3`
  - `3`
  - `3`
  - `3`
- **All Values**: 0, 3, 5, 6, F

### depmin
**Path**: `chummer/metatypes/metatype/depmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 97.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 2, 3, 4, 5, 6, 7, 8

### depmax
**Path**: `chummer/metatypes/metatype/depmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 97.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 10, 11, 5, 6, 7

### depaug
**Path**: `chummer/metatypes/metatype/depaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 97.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 10, 11, 14, 15, 5, 6, 9

### essmin
**Path**: `chummer/metatypes/metatype/essmin`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 83.6%
- **Boolean Ratio**: 80.7%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `0`
  - `0`
  - `0`
  - `0`
  - `0`
- **All Values**: 0, 2D6, 6, F, F-2

### essmax
**Path**: `chummer/metatypes/metatype/essmax`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 65.8%
- **Boolean Ratio**: 3.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `6`
  - `6`
  - `6`
  - `6`
  - `6`
- **All Values**: 0, 10, 2D6, 3D6, 5, 6, F, F-2

### essaug
**Path**: `chummer/metatypes/metatype/essaug`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 65.8%
- **Boolean Ratio**: 3.0%
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `6`
  - `6`
  - `6`
  - `6`
  - `6`
- **All Values**: 0, 10, 2D6, 3D6, 5, 6, F, F-2

### source
**Path**: `chummer/metatypes/metatype/source`

- **Count**: 269
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
- **All Values**: AET, BTB, DATG, DTR, FA, HS, HT, KC, SG, SOXG, SR5, SW

### page
**Path**: `chummer/metatypes/metatype/page`

- **Count**: 269
- **Presence Rate**: 100.0%
- **Unique Values**: 109
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-3 characters
- **Examples**:
  - `402`
  - `402`
  - `403`
  - `403`
  - `403`

### walk
**Path**: `chummer/metatypes/metatype/walk`

- **Count**: 254
- **Presence Rate**: 100.0%
- **Unique Values**: 26
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 5-11 characters
- **Examples**:
  - `2/1/0`
  - `2/1/0`
  - `3/1/0`
  - `0/3/0`
  - `2/1/0`
- **All Values**: 0/0/0, 0/0/1, 0/2/0, 0/3/0, 1/0/0, 1/1/2, 1/2/0, 1/3/0, 14/0/0, 15/15/15, 16/0/0, 18/0/0, 2/0/0, 2/1/0, 2/1/2, 2/1/3, 2/2/0, 2/2/2, 3/1/0, 3/1/4

### run
**Path**: `chummer/metatypes/metatype/run`

- **Count**: 254
- **Presence Rate**: 100.0%
- **Unique Values**: 34
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 5-11 characters
- **Examples**:
  - `8/0/0`
  - `6/0/0`
  - `10/0/0`
  - `0/8/0`
  - `8/0/0`

### sprint
**Path**: `chummer/metatypes/metatype/sprint`

- **Count**: 254
- **Presence Rate**: 100.0%
- **Unique Values**: 37
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 5-8 characters
- **Examples**:
  - `4/1/0`
  - `4/1/0`
  - `6/1/0`
  - `0/4/0`
  - `4/1/0`

### karma
**Path**: `chummer/metatypes/metatype/karma`

- **Count**: 236
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

### optionalpower
**Path**: `chummer/metatypes/metatype/bonus/optionalpowers/optionalpower`

- **Count**: 165
- **Presence Rate**: 100.0%
- **Unique Values**: 43
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-22 characters
- **Examples**:
  - `Inhabitation`
  - `Possession`
  - `Materialization`
  - `Elemental Attack`
  - `Energy Aura`

### name
**Path**: `chummer/metatypes/metatype/bonus/enableattribute/name`

- **Count**: 161
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-3 characters
- **Examples**:
  - `MAG`
  - `MAG`
  - `MAG`
  - `MAG`
  - `MAG`
- **All Values**: DEP, MAG, RES

### complexform
**Path**: `chummer/metatypes/metatype/complexforms/complexform`

- **Count**: 148
- **Presence Rate**: 100.0%
- **Unique Values**: 13
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-31 characters
- **Examples**:
  - `Diffusion of [Matrix Attribute]`
  - `Infusion of [Matrix Attribute]`
  - `Resonance Spike`
  - `Derezz`
  - `Diffusion of [Matrix Attribute]`
- **All Values**: Derezz, Diffusion of [Matrix Attribute], Editor, Infusion of [Matrix Attribute], Pulse Storm, Puppeteer, Resonance Channel, Resonance Spike, Resonance Veil, Static Bomb, Static Veil, Tattletale, Transcendent Grid

### min
**Path**: `chummer/metatypes/metatype/bonus/enableattribute/min`

- **Count**: 116
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 55.2%
- **Boolean Ratio**: 38.8%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `1`
  - `1`
  - `1`
- **All Values**: 1, 2, 3, 6, 7, F

### max
**Path**: `chummer/metatypes/metatype/bonus/enableattribute/max`

- **Count**: 116
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 55.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `6`
  - `6`
  - `8`
  - `6`
  - `6`
- **All Values**: 13, 2, 3, 5, 6, 7, 8, 9, F

### aug
**Path**: `chummer/metatypes/metatype/bonus/enableattribute/aug`

- **Count**: 116
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: mixed_numeric, enum_candidate
- **Numeric Ratio**: 55.2%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `6`
  - `6`
  - `8`
  - `6`
  - `6`
- **All Values**: 10, 13, 3, 5, 6, 7, 8, 9, F

### val
**Path**: `chummer/metatypes/metatype/bonus/enableattribute/val`

- **Count**: 116
- **Presence Rate**: 100.0%
- **Unique Values**: 8
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 55.2%
- **Boolean Ratio**: 0.9%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `3`
  - `1`
  - `5`
  - `5`
  - `3`
- **All Values**: 1, 10, 2, 3, 4, 5, 6, F

### initiativepass
**Path**: `chummer/metatypes/metatype/bonus/initiativepass`

- **Count**: 107
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: numeric_string, boolean_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 94.4%
- **Enum Candidate**: Yes
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`
  - `1`
  - `2`
  - `1`
  - `1`
- **All Values**: 1, 2

### optionalpower
**Path**: `chummer/metatypes/metatype/optionalpowers/optionalpower`

- **Count**: 104
- **Presence Rate**: 100.0%
- **Unique Values**: 37
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-29 characters
- **Examples**:
  - `Venom`
  - `Secretion/Substance Extrusion`
  - `Fear`
  - `Paralyzing Howl`
  - `Venom`

### id
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/id`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 66
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `fea12a53-9eb1-4e3b-9983-d8f86c7cb773`
  - `e6732218-d09e-4549-82a4-36f987d0f39f`
  - `b23e8914-c760-4bca-b574-aaba629765fd`
  - `01667a1c-152d-4217-9126-eec1af4efc8b`
  - `df8e5ca8-75e9-4ef8-a440-530a68f3dc18`

### name
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/name`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 3-8 characters
- **Examples**:
  - `Ant`
  - `Locust`
  - `Termite`
  - `Wasp`
  - `Beetle`
- **All Values**: Ant, Beetle, Cicada, Firefly, Fly, Locust, Mantid, Mosquito, Roach, Termite, Wasp

### karma
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/karma`

- **Count**: 66
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

### bodmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bodmin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+3, F+5, F-1

### bodmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bodmax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+3, F+5, F-1

### bodaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bodaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+3, F+5, F-1

### agimin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/agimin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
- **All Values**: F, F+1, F+2, F+3

### agimax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/agimax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
- **All Values**: F, F+1, F+2, F+3

### agiaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/agiaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
- **All Values**: F, F+1, F+2, F+3

### reamin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/reamin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
- **All Values**: F, F+1, F+2, F+3, F+4

### reamax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/reamax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
- **All Values**: F, F+1, F+2, F+3, F+4

### reaaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/reaaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
  - `F+1`
- **All Values**: F, F+1, F+2, F+3, F+4

### strmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/strmin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1, F+3, F+5, F-1

### strmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/strmax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1, F+3, F+5, F-1

### straug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/straug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1, F+3, F+5, F-1

### chamin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/chamin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### chamax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/chamax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### chaaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/chaaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### intmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/intmin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1

### intmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/intmax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1

### intaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/intaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1

### logmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/logmin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1

### logmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/logmax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1

### logaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/logaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1

### wilmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/wilmin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1

### wilmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/wilmax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1

### wilaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/wilaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 1-3 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`
- **All Values**: F, F+1

### inimin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/inimin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-7 characters
- **Examples**:
  - `(F*2)+1`
  - `(F*2)+1`
  - `(F*2)+1`
  - `(F*2)+1`
  - `(F*2)+1`
- **All Values**: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4

### inimax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/inimax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-7 characters
- **Examples**:
  - `(F*2)+1`
  - `(F*2)+1`
  - `(F*2)+1`
  - `(F*2)+1`
  - `(F*2)+1`
- **All Values**: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4

### iniaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/iniaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-7 characters
- **Examples**:
  - `(F*2)+1`
  - `(F*2)+1`
  - `(F*2)+1`
  - `(F*2)+1`
  - `(F*2)+1`
- **All Values**: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4

### edgmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/edgmin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `F/2`
  - `F/2`
  - `F/2`
  - `F/2`
  - `F/2`

### edgmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/edgmax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `F/2`
  - `F/2`
  - `F/2`
  - `F/2`
  - `F/2`

### edgaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/edgaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `F/2`
  - `F/2`
  - `F/2`
  - `F/2`
  - `F/2`

### magmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/magmin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### magmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/magmax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### magaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/magaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### resmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/resmin`

- **Count**: 66
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

### resmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/resmax`

- **Count**: 66
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

### resaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/resaug`

- **Count**: 66
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

### depmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/depmin`

- **Count**: 66
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

### depmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/depmax`

- **Count**: 66
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

### depaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/depaug`

- **Count**: 66
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

### essmin
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/essmin`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### essmax
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/essmax`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### essaug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/essaug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### walk
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/walk`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `2/2/2`
  - `2/2/2`
  - `2/2/2`
  - `2/2/2`
  - `2/2/2`

### run
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/run`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `4/4/4`
  - `4/4/4`
  - `4/4/4`
  - `4/4/4`
  - `4/4/4`

### sprint
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/sprint`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `2/2/2`
  - `2/2/2`
  - `2/2/2`
  - `2/2/2`
  - `2/2/2`

### name
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bonus/enableattribute/name`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 3-3 characters
- **Examples**:
  - `MAG`
  - `MAG`
  - `MAG`
  - `MAG`
  - `MAG`

### min
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bonus/enableattribute/min`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### max
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bonus/enableattribute/max`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### aug
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bonus/enableattribute/aug`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### val
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bonus/enableattribute/val`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 1-1 characters
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### name
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bonus/enabletab/name`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `critter`
  - `critter`
  - `critter`
  - `critter`
  - `critter`

### initiativepass
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bonus/initiativepass`

- **Count**: 66
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

### source
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/source`

- **Count**: 66
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
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/page`

- **Count**: 66
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-2 characters
- **Examples**:
  - `95`
  - `95`
  - `95`
  - `96`
  - `96`
- **All Values**: 95, 96, 97, 98

### quality
**Path**: `chummer/metatypes/metatype/qualities/positive/quality`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 18
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-30 characters
- **Examples**:
  - `Magician`
  - `Natural Athlete`
  - `Water Sprite`
  - `Toughness`
  - `Toughness`
- **All Values**: Adept, Agile Defender, Aspected Magician, Corrupter, Easily Exploitable, High Pain Tolerance, Inherent Program, Magician, Munge, Mystic Adept, Natural Athlete, Redundancy, Resistance to Pathogens/Toxins, Shiva Arms (Pair), Snooper, Toughness, Water Sprite, Will to Live

### reach
**Path**: `chummer/metatypes/metatype/bonus/reach`

- **Count**: 41
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: numeric_string, mixed_boolean, enum_candidate
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 34.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-2 characters
- **Examples**:
  - `1`
  - `3`
  - `-1`
  - `2`
  - `2`
- **All Values**: -1, -2, 1, 2, 3, 4

### armor
**Path**: `chummer/metatypes/metatype/armor`

- **Count**: 31
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: mixed_numeric, mixed_boolean, enum_candidate
- **Numeric Ratio**: 71.0%
- **Boolean Ratio**: 58.1%
- **Enum Candidate**: Yes
- **Length Range**: 1-8 characters
- **Examples**:
  - `0`
  - `1`
  - `4`
  - `6`
  - `0`
- **All Values**: (F x 2)H, 0, 1, 10, 12, 12H, 4, 6, 6H, F, F*2

### group
**Path**: `chummer/metatypes/metatype/skills/group`

- **Count**: 27
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-12 characters
- **Examples**:
  - `Athletics`
  - `Athletics`
  - `Conjuring`
  - `Sorcery`
  - `Conjuring`
- **All Values**: Athletics, Close Combat, Conjuring, Influence, Outdoors, Sorcery

### category
**Path**: `chummer/categories/category`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 18
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-21 characters
- **Examples**:
  - `Dracoforms`
  - `Infected`
  - `Insect Spirits`
  - `Mundane Critters`
  - `Mutant Critters`
- **All Values**: Dracoforms, Extraplanar Travelers, Infected, Insect Spirits, Mundane Critters, Mutant Critters, Necro Spirits, Paranormal Critters, Protosapients, Ritual, Shadow Spirits, Shedim, Spirits, Sprites, Technocritters, Toxic Critters, Toxic Spirits, Warforms

### movement
**Path**: `chummer/metatypes/metatype/movement`

- **Count**: 15
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 7-7 characters
- **Examples**:
  - `Special`
  - `Special`
  - `Special`
  - `Special`
  - `Special`

### quality
**Path**: `chummer/metatypes/metatype/qualities/negative/quality`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 4
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 8-25 characters
- **Examples**:
  - `Cold-Blooded`
  - `Carrier (HMHVV Strain II)`
  - `Gremlins`
  - `Gremlins`
  - `Gremlins`
- **All Values**: Carrier (HMHVV Strain II), Cold-Blooded, Gremlins, Real World Naiveté

### bioware
**Path**: `chummer/metatypes/metatype/biowares/bioware`

- **Count**: 10
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-29 characters
- **Examples**:
  - `Bone Density Augmentation`
  - `Synaptic Acceleration`
  - `Cerebral Booster`
  - `Chameleon Skin (Dynamic)`
  - `Neuro Retention Amplification`
- **All Values**: Bone Density Augmentation, Cerebral Booster, Chameleon Skin (Dynamic), Muscle Augmentation, Neo-EPO, Neuro Retention Amplification, Synaptic Acceleration, Tailored Pheromones, Vocal Range Expander

### unlockskills
**Path**: `chummer/metatypes/metatype/bonus/unlockskills`

- **Count**: 7
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 4-8 characters
- **Examples**:
  - `Name`
  - `Magician`
  - `Magician`
  - `Magician`
  - `Magician`
- **All Values**: Magician, Name

### damageresistance
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/bonus/damageresistance`

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

### biowareessmultiplier
**Path**: `chummer/metatypes/metatype/bonus/biowareessmultiplier`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `90`
  - `90`
  - `90`

### genetechcostmultiplier
**Path**: `chummer/metatypes/metatype/bonus/genetechcostmultiplier`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `80`
  - `80`
  - `80`

### genetechessmultiplier
**Path**: `chummer/metatypes/metatype/bonus/genetechessmultiplier`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `90`
  - `90`
  - `90`

### knowledge
**Path**: `chummer/metatypes/metatype/skills/knowledge`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 12-12 characters
- **Examples**:
  - `Animal Calls`
  - `Animal Calls`

### reach
**Path**: `chummer/metatypes/metatype/bonus/enabletab/reach`

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

## Attributes

### skill@rating
**Path**: `chummer/metatypes/metatype/skills/skill@rating`

- **Count**: 1461
- **Unique Values**: 14
- **Enum Candidate**: Yes
- **Examples**:
  - `4`
  - `5`
  - `5`
  - `6`
  - `5`
- **All Values**: 1, 10, 12, 14, 2, 3, 4, 5, 6, 7, 8, 9, F, F/2

### power@select
**Path**: `chummer/metatypes/metatype/powers/power@select`

- **Count**: 657
- **Unique Values**: 266
- **Examples**:
  - `Smell`
  - `Hearing`
  - `Claws/Bite: DV (STR+1)P, AP 0`
  - `Claws/Bite: DV (STR+3)P, AP -1`
  - `Low-light Vision`

### skill@rating
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/skills/skill@rating`

- **Count**: 447
- **Unique Values**: 1
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### power@select
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/powers/power@select`

- **Count**: 227
- **Unique Values**: 11
- **Enum Candidate**: Yes
- **Examples**:
  - `Acid`
  - `Physical Barrier`
  - `Insecticides, Severe`
  - `Physical Barrier`
  - `Insecticides, Severe`
- **All Values**: Acid, DV (Force+2)P, AP -1, Disease, Insecticides, Light, Insecticides, Severe, Light, Mild, Physical Barrier, Smell, Thermographic Vision, Ultrasound, insecticides, Severe

### power@rating
**Path**: `chummer/metatypes/metatype/powers/power@rating`

- **Count**: 158
- **Unique Values**: 18
- **Enum Candidate**: Yes
- **Examples**:
  - `2`
  - `1`
  - `2`
  - `3`
  - `1`
- **All Values**: 1, 10, 12, 14, 15, 16, 17, 18, 2, 20, 3, 4, 5, 6, 7, 8, 9, F

### complexform@select
**Path**: `chummer/metatypes/metatype/complexforms/complexform@select`

- **Count**: 69
- **Unique Values**: 4
- **Enum Candidate**: Yes
- **Examples**:
  - `Firewall`
  - `Attack`
  - `Attack`
  - `Sleaze`
  - `Attack`
- **All Values**: Attack, Data Processing, Firewall, Sleaze

### optionalpower@select
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/optionalpowers/optionalpower@select`

- **Count**: 66
- **Unique Values**: 5
- **Enum Candidate**: Yes
- **Examples**:
  - `Smell`
  - `Thermographic Vision`
  - `Ultrasound`
  - `Smell`
  - `Thermographic Vision`
- **All Values**: DV (Force+3)P, AP -1, DV ForceP, AP 0, Smell, Thermographic Vision, Ultrasound

### skill@spec
**Path**: `chummer/metatypes/metatype/skills/skill@spec`

- **Count**: 58
- **Unique Values**: 18
- **Enum Candidate**: Yes
- **Examples**:
  - `Smell`
  - `Smell`
  - `Smell`
  - `Elemental Attack`
  - `Elemental Attack`
- **All Values**: Climbing, Corrosive Spit, Dodging, Electricity, Elemental Attack, Feathers, Grapple, Harness Updraft, Hearing, Noxious Breath, Sight, Smell, Sonic Projection, Spit, Tail Spikes, Tribal, Underground, Venom Spit

### optionalpowers@count
**Path**: `chummer/metatypes/metatype/bonus/optionalpowers@count`

- **Count**: 29
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `floor({MAG} div 3)`
  - `floor({MAG} div 3)`
  - `floor({MAG} div 3)`
  - `floor({MAG} div 3)`
  - `floor({MAG} div 3)`
- **All Values**: 2, floor({MAG} div 3)

### group@rating
**Path**: `chummer/metatypes/metatype/skills/group@rating`

- **Count**: 27
- **Unique Values**: 8
- **Enum Candidate**: Yes
- **Examples**:
  - `3`
  - `4`
  - `5`
  - `6`
  - `5`
- **All Values**: 12, 14, 3, 4, 5, 6, 7, F

### optionalpower@select
**Path**: `chummer/metatypes/metatype/bonus/optionalpowers/optionalpower@select`

- **Count**: 22
- **Unique Values**: 15
- **Examples**:
  - `Air`
  - `DV ForceP, AP 0`
  - `Earth`
  - `Water`
  - `Any`

### skill@spec
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/skills/skill@spec`

- **Count**: 11
- **Unique Values**: 1
- **Examples**:
  - `Noxious Breath`
  - `Noxious Breath`
  - `Noxious Breath`
  - `Noxious Breath`
  - `Noxious Breath`

### optionalpower@select
**Path**: `chummer/metatypes/metatype/optionalpowers/optionalpower@select`

- **Count**: 9
- **Unique Values**: 8
- **Enum Candidate**: Yes
- **Examples**:
  - `Flammable Oils`
  - `Electricity`
  - `Acid Rain, Pall of Smog`
  - `Smell`
  - `Thermographic Vision`
- **All Values**: Acid Rain, Pall of Smog, DV (Force+3)P, AP -1, DV ForceP, AP 0, Electricity, Flammable Oils, Smell, Thermographic Vision, Ultrasound

### quality@select
**Path**: `chummer/metatypes/metatype/qualities/positive/quality@select`

- **Count**: 8
- **Unique Values**: 6
- **Enum Candidate**: Yes
- **Examples**:
  - `Decryption`
  - `Stealth`
  - `Hammer`
  - `Browse`
  - `Decryption`
- **All Values**: Browse, Decryption, Demolition, Hammer, Stealth, Toolbox

### power@rating
**Path**: `chummer/metatypes/metatype/metavariants/metavariant/powers/power@rating`

- **Count**: 6
- **Unique Values**: 1
- **Examples**:
  - `F`
  - `F`
  - `F`
  - `F`
  - `F`

### bioware@rating
**Path**: `chummer/metatypes/metatype/biowares/bioware@rating`

- **Count**: 5
- **Unique Values**: 3
- **Enum Candidate**: Yes
- **Examples**:
  - `2`
  - `1`
  - `3`
  - `1`
  - `1`
- **All Values**: 1, 2, 3

### knowledge@rating
**Path**: `chummer/metatypes/metatype/skills/knowledge@rating`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `8`
  - `8`

### knowledge@category
**Path**: `chummer/metatypes/metatype/skills/knowledge@category`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `Professional`
  - `Professional`

### knowledge@attribute
**Path**: `chummer/metatypes/metatype/skills/knowledge@attribute`

- **Count**: 2
- **Unique Values**: 1
- **Examples**:
  - `LOG`
  - `LOG`

### skill@select
**Path**: `chummer/metatypes/metatype/skills/skill@select`

- **Count**: 2
- **Unique Values**: 2
- **Enum Candidate**: Yes
- **Examples**:
  - `Thorns`
  - `Noxious Breath`
- **All Values**: Noxious Breath, Thorns

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema critters.xsd`

### unlockskills@name
**Path**: `chummer/metatypes/metatype/bonus/unlockskills@name`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Counterspelling`

## Type Improvement Recommendations

### Enum Candidates
- **category** (`chummer/categories/category`): 18 unique values
  - Values: Dracoforms, Extraplanar Travelers, Infected, Insect Spirits, Mundane Critters, Mutant Critters, Necro Spirits, Paranormal Critters, Protosapients, Ritual, Shadow Spirits, Shedim, Spirits, Sprites, Technocritters, Toxic Critters, Toxic Spirits, Warforms
- **category** (`chummer/metatypes/metatype/category`): 18 unique values
  - Values: Dracoforms, Extraplanar Travelers, Infected, Insect Spirits, Mundane Critters, Mutant Critters, Necro Spirits, Paranormal Critters, Protosapients, Ritual, Shadow Spirits, Shedim, Spirits, Sprites, Technocritters, Toxic Critters, Toxic Spirits, Warforms
- **bodmin** (`chummer/metatypes/metatype/bodmin`): 30 unique values
  - Values: 0, 1, 10, 12, 13, 14, 15, 16, 17, 20, 8, 9, F, F+1, F+3, F+4, F+5, F+7, F-2, F-3
- **bodmax** (`chummer/metatypes/metatype/bodmax`): 31 unique values
  - Values: 0, 1, 10, 12, 13, 15, 16, 17, 20, 24, 8, 9, F, F+1, F+3, F+4, F+5, F+7, F-2, F-3
- **bodaug** (`chummer/metatypes/metatype/bodaug`): 33 unique values
  - Values: 0, 1, 10, 12, 13, 15, 16, 17, 19, 20, 22, 8, 9, F, F+1, F+3, F+4, F+7, F-2, F-3
- **agimin** (`chummer/metatypes/metatype/agimin`): 20 unique values
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3
- **agimax** (`chummer/metatypes/metatype/agimax`): 20 unique values
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3
- **agiaug** (`chummer/metatypes/metatype/agiaug`): 24 unique values
  - Values: 0, 1, 10, 12, 13, 14, 3, 4, 6, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2, F-3
- **reamin** (`chummer/metatypes/metatype/reamin`): 20 unique values
  - Values: 0, 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2
- **reamax** (`chummer/metatypes/metatype/reamax`): 20 unique values
  - Values: 0, 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2
- **reaaug** (`chummer/metatypes/metatype/reaaug`): 24 unique values
  - Values: 0, 1, 10, 12, 13, 14, 15, 3, 4, 6, 8, 9, F, F+1, F+2, F+3, F+4, F+5, F-1, F-2
- **strmin** (`chummer/metatypes/metatype/strmin`): 30 unique values
  - Values: 0, 1, 10, 12, 13, 16, 30, 35, 40, 42, 8, 9, F, F+1, F+3, F+4, F+5, F+6, F-2, F-3
- **strmax** (`chummer/metatypes/metatype/strmax`): 33 unique values
  - Values: 0, 1, 10, 12, 13, 16, 19, 35, 40, 42, 8, 9, F, F+1, F+3, F+4, F+5, F+6, F-2, F-3
- **straug** (`chummer/metatypes/metatype/straug`): 35 unique values
  - Values: 0, 1, 10, 11, 12, 13, 16, 20, 35, 38, 40, 42, 8, 9, F, F+3, F+4, F+6, F-2, F-3
- **chamin** (`chummer/metatypes/metatype/chamin`): 16 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2
- **chamax** (`chummer/metatypes/metatype/chamax`): 17 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2
- **chaaug** (`chummer/metatypes/metatype/chaaug`): 20 unique values
  - Values: 0, 1, 10, 11, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2
- **intmin** (`chummer/metatypes/metatype/intmin`): 15 unique values
  - Values: 1, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F-1, F-2
- **intmax** (`chummer/metatypes/metatype/intmax`): 15 unique values
  - Values: 1, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F-1, F-2
- **intaug** (`chummer/metatypes/metatype/intaug`): 19 unique values
  - Values: 1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F-1, F-2
- **logmin** (`chummer/metatypes/metatype/logmin`): 17 unique values
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2
- **logmax** (`chummer/metatypes/metatype/logmax`): 16 unique values
  - Values: 1, 10, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2
- **logaug** (`chummer/metatypes/metatype/logaug`): 18 unique values
  - Values: 1, 10, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+3, F+4, F-1, F-2
- **wilmin** (`chummer/metatypes/metatype/wilmin`): 15 unique values
  - Values: 1, 10, 2, 3, 4, 5, 6, 8, 9, F, F+1, F+2, F+4, F-1, F-2
- **wilmax** (`chummer/metatypes/metatype/wilmax`): 17 unique values
  - Values: 1, 10, 11, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+4, F-1, F-2
- **wilaug** (`chummer/metatypes/metatype/wilaug`): 20 unique values
  - Values: 1, 10, 11, 12, 13, 15, 2, 3, 4, 5, 6, 7, 8, 9, F, F+1, F+2, F+4, F-1, F-2
- **inimin** (`chummer/metatypes/metatype/inimin`): 26 unique values
  - Values: (F*2), (F*2)+1, (F*2)+2, (F*2)+4, (F*2)+5, (F*2)+6, 10, 12, 13, 14, 15, 16, 3, 4, 6, 8, 9, F, F+1, F-1
- **inimax** (`chummer/metatypes/metatype/inimax`): 28 unique values
  - Values: (F*2), (F*2)+1, (F*2)+2, (F*2)+4, (F*2)+6, 10, 12, 13, 14, 15, 16, 17, 22, 3, 6, 8, 9, F, F+1, F-1
- **iniaug** (`chummer/metatypes/metatype/iniaug`): 34 unique values
  - Values: (F*2), (F*2)+1, (F*2)+2, (F*2)+4, (F*2)+6, 10, 12, 16, 17, 19, 20, 21, 22, 23, 24, 25, 27, 8, 9, F
- **edgmin** (`chummer/metatypes/metatype/edgmin`): 10 unique values
  - Values: 0, 1, 2, 3, 4, 5, 6, 9, F, F/2
- **edgmax** (`chummer/metatypes/metatype/edgmax`): 13 unique values
  - Values: 0, 1, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F/2
- **edgaug** (`chummer/metatypes/metatype/edgaug`): 13 unique values
  - Values: 0, 1, 12, 2, 3, 4, 5, 6, 7, 8, 9, F, F/2
- **magmin** (`chummer/metatypes/metatype/magmin`): 9 unique values
  - Values: 0, 1, 10, 2, 3, 4, 5, 6, F
- **magmax** (`chummer/metatypes/metatype/magmax`): 11 unique values
  - Values: 0, 13, 2, 3, 4, 5, 6, 7, 8, 9, F
- **magaug** (`chummer/metatypes/metatype/magaug`): 11 unique values
  - Values: 0, 10, 13, 3, 4, 5, 6, 7, 8, 9, F
- **resmin** (`chummer/metatypes/metatype/resmin`): 7 unique values
  - Values: 0, 2, 3, 4, 5, 6, F
- **resmax** (`chummer/metatypes/metatype/resmax`): 5 unique values
  - Values: 0, 3, 5, 6, F
- **resaug** (`chummer/metatypes/metatype/resaug`): 5 unique values
  - Values: 0, 3, 5, 6, F
- **depmin** (`chummer/metatypes/metatype/depmin`): 8 unique values
  - Values: 0, 2, 3, 4, 5, 6, 7, 8
- **depmax** (`chummer/metatypes/metatype/depmax`): 6 unique values
  - Values: 0, 10, 11, 5, 6, 7
- **depaug** (`chummer/metatypes/metatype/depaug`): 8 unique values
  - Values: 0, 10, 11, 14, 15, 5, 6, 9
- **essmin** (`chummer/metatypes/metatype/essmin`): 5 unique values
  - Values: 0, 2D6, 6, F, F-2
- **essmax** (`chummer/metatypes/metatype/essmax`): 8 unique values
  - Values: 0, 10, 2D6, 3D6, 5, 6, F, F-2
- **essaug** (`chummer/metatypes/metatype/essaug`): 8 unique values
  - Values: 0, 10, 2D6, 3D6, 5, 6, F, F-2
- **walk** (`chummer/metatypes/metatype/walk`): 26 unique values
  - Values: 0/0/0, 0/0/1, 0/2/0, 0/3/0, 1/0/0, 1/1/2, 1/2/0, 1/3/0, 14/0/0, 15/15/15, 16/0/0, 18/0/0, 2/0/0, 2/1/0, 2/1/2, 2/1/3, 2/2/0, 2/2/2, 3/1/0, 3/1/4
- **run** (`chummer/metatypes/metatype/run`): 34 unique values
  - Values: 0/0/0, 0/0/4, 0/8/0, 18/0/0, 2/0/0, 2/0/4, 2/0/5, 2/2/0, 3/0/4, 3/0/5, 30/30/30, 36/0/0, 4/0/0, 4/0/4, 4/4/4, 5/0/0, 5/0/8, 56/0/0, 6/0/0, 64/0/0
- **sprint** (`chummer/metatypes/metatype/sprint`): 37 unique values
  - Values: 0/2/0, 0/3/0, 1/0/0, 1/1/1, 10/10/10, 2/0/0, 2/1/0, 2/1/2, 2/1/4, 2/2/0, 2/2/2, 4/0/0, 4/1/0, 4/8/1, 5/0/0, 5/1/2, 5/1/7, 5/5/5, 6/1/0, 6/1/2
- **name** (`chummer/metatypes/metatype/bonus/enabletab/name`): 3 unique values
  - Values: critter, magician, technomancer
- **source** (`chummer/metatypes/metatype/source`): 12 unique values
  - Values: AET, BTB, DATG, DTR, FA, HS, HT, KC, SG, SOXG, SR5, SW
- **initiativepass** (`chummer/metatypes/metatype/bonus/initiativepass`): 2 unique values
  - Values: 1, 2
- **name** (`chummer/metatypes/metatype/bonus/enableattribute/name`): 3 unique values
  - Values: DEP, MAG, RES
- **min** (`chummer/metatypes/metatype/bonus/enableattribute/min`): 6 unique values
  - Values: 1, 2, 3, 6, 7, F
- **max** (`chummer/metatypes/metatype/bonus/enableattribute/max`): 9 unique values
  - Values: 13, 2, 3, 5, 6, 7, 8, 9, F
- **aug** (`chummer/metatypes/metatype/bonus/enableattribute/aug`): 9 unique values
  - Values: 10, 13, 3, 5, 6, 7, 8, 9, F
- **val** (`chummer/metatypes/metatype/bonus/enableattribute/val`): 8 unique values
  - Values: 1, 10, 2, 3, 4, 5, 6, F
- **reach** (`chummer/metatypes/metatype/bonus/reach`): 6 unique values
  - Values: -1, -2, 1, 2, 3, 4
- **group** (`chummer/metatypes/metatype/skills/group`): 6 unique values
  - Values: Athletics, Close Combat, Conjuring, Influence, Outdoors, Sorcery
- **quality** (`chummer/metatypes/metatype/qualities/positive/quality`): 18 unique values
  - Values: Adept, Agile Defender, Aspected Magician, Corrupter, Easily Exploitable, High Pain Tolerance, Inherent Program, Magician, Munge, Mystic Adept, Natural Athlete, Redundancy, Resistance to Pathogens/Toxins, Shiva Arms (Pair), Snooper, Toughness, Water Sprite, Will to Live
- **optionalpower** (`chummer/metatypes/metatype/optionalpowers/optionalpower`): 37 unique values
  - Values: Accident, Banishing Resistance, Combat Skill, Compulsion, Concealment, Confusion, Elemental Attack, Fear, Ghost Chain, Guard, Magic Resistance, Natural Weapon, Noxious Breath, Paralyzing Howl, Regeneration, Sapience, Search, Silence, Vehicle Skill, Venom
- **quality** (`chummer/metatypes/metatype/qualities/negative/quality`): 4 unique values
  - Values: Carrier (HMHVV Strain II), Cold-Blooded, Gremlins, Real World Naiveté
- **unlockskills** (`chummer/metatypes/metatype/bonus/unlockskills`): 2 unique values
  - Values: Magician, Name
- **armor** (`chummer/metatypes/metatype/armor`): 11 unique values
  - Values: (F x 2)H, 0, 1, 10, 12, 12H, 4, 6, 6H, F, F*2
- **optionalpower** (`chummer/metatypes/metatype/bonus/optionalpowers/optionalpower`): 43 unique values
  - Values: Accident, Active Analytics, Animal Control, Combat Skill, Concealment, Confusion, Elemental Attack, Energy Aura, Enhance, Fear, Guard, Inhabitation, Natural Weapon, Noxious Breath, Possession, Reinforcement, Resilient Code, Resonance Spooling, Search, Venom
- **name** (`chummer/metatypes/metatype/metavariants/metavariant/name`): 11 unique values
  - Values: Ant, Beetle, Cicada, Firefly, Fly, Locust, Mantid, Mosquito, Roach, Termite, Wasp
- **bodmin** (`chummer/metatypes/metatype/metavariants/metavariant/bodmin`): 4 unique values
  - Values: F, F+3, F+5, F-1
- **bodmax** (`chummer/metatypes/metatype/metavariants/metavariant/bodmax`): 4 unique values
  - Values: F, F+3, F+5, F-1
- **bodaug** (`chummer/metatypes/metatype/metavariants/metavariant/bodaug`): 4 unique values
  - Values: F, F+3, F+5, F-1
- **agimin** (`chummer/metatypes/metatype/metavariants/metavariant/agimin`): 4 unique values
  - Values: F, F+1, F+2, F+3
- **agimax** (`chummer/metatypes/metatype/metavariants/metavariant/agimax`): 4 unique values
  - Values: F, F+1, F+2, F+3
- **agiaug** (`chummer/metatypes/metatype/metavariants/metavariant/agiaug`): 4 unique values
  - Values: F, F+1, F+2, F+3
- **reamin** (`chummer/metatypes/metatype/metavariants/metavariant/reamin`): 5 unique values
  - Values: F, F+1, F+2, F+3, F+4
- **reamax** (`chummer/metatypes/metatype/metavariants/metavariant/reamax`): 5 unique values
  - Values: F, F+1, F+2, F+3, F+4
- **reaaug** (`chummer/metatypes/metatype/metavariants/metavariant/reaaug`): 5 unique values
  - Values: F, F+1, F+2, F+3, F+4
- **strmin** (`chummer/metatypes/metatype/metavariants/metavariant/strmin`): 5 unique values
  - Values: F, F+1, F+3, F+5, F-1
- **strmax** (`chummer/metatypes/metatype/metavariants/metavariant/strmax`): 5 unique values
  - Values: F, F+1, F+3, F+5, F-1
- **straug** (`chummer/metatypes/metatype/metavariants/metavariant/straug`): 5 unique values
  - Values: F, F+1, F+3, F+5, F-1
- **intmin** (`chummer/metatypes/metatype/metavariants/metavariant/intmin`): 2 unique values
  - Values: F, F+1
- **intmax** (`chummer/metatypes/metatype/metavariants/metavariant/intmax`): 2 unique values
  - Values: F, F+1
- **intaug** (`chummer/metatypes/metatype/metavariants/metavariant/intaug`): 2 unique values
  - Values: F, F+1
- **logmin** (`chummer/metatypes/metatype/metavariants/metavariant/logmin`): 2 unique values
  - Values: F, F+1
- **logmax** (`chummer/metatypes/metatype/metavariants/metavariant/logmax`): 2 unique values
  - Values: F, F+1
- **logaug** (`chummer/metatypes/metatype/metavariants/metavariant/logaug`): 2 unique values
  - Values: F, F+1
- **wilmin** (`chummer/metatypes/metatype/metavariants/metavariant/wilmin`): 2 unique values
  - Values: F, F+1
- **wilmax** (`chummer/metatypes/metatype/metavariants/metavariant/wilmax`): 2 unique values
  - Values: F, F+1
- **wilaug** (`chummer/metatypes/metatype/metavariants/metavariant/wilaug`): 2 unique values
  - Values: F, F+1
- **inimin** (`chummer/metatypes/metatype/metavariants/metavariant/inimin`): 4 unique values
  - Values: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4
- **inimax** (`chummer/metatypes/metatype/metavariants/metavariant/inimax`): 4 unique values
  - Values: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4
- **iniaug** (`chummer/metatypes/metatype/metavariants/metavariant/iniaug`): 4 unique values
  - Values: (F*2)+1, (F*2)+2, (F*2)+3, (F*2)+4
- **power** (`chummer/metatypes/metatype/metavariants/metavariant/powers/power`): 30 unique values
  - Values: Animal Control, Astral Form, Astral Gateway, Banishing Resistance, Compulsion, Concealment, Confusion, Elemental Attack, Energy Drain, Fear, Guard, Immunity, Inhabitation, Natural Weapon, Reinforcement, Sapience, Search, Sonic Projection, Venom, Wealth
- **optionalpower** (`chummer/metatypes/metatype/metavariants/metavariant/optionalpowers/optionalpower`): 13 unique values
  - Values: Binding, Compulsion, Concealment, Confusion, Enhanced Senses, Essence Drain, Fear, Guard, Magical Guard, Natural Weapon, Noxious Breath, Pestilence, Venom
- **skill** (`chummer/metatypes/metatype/metavariants/metavariant/skills/skill`): 13 unique values
  - Values: Assensing, Astral Combat, Con, Counterspelling, Exotic Ranged Weapon, Flight, Gymnastics, Leadership, Negotiation, Perception, Sneaking, Spellcasting, Unarmed Combat
- **page** (`chummer/metatypes/metatype/metavariants/metavariant/page`): 4 unique values
  - Values: 95, 96, 97, 98
- **bioware** (`chummer/metatypes/metatype/biowares/bioware`): 9 unique values
  - Values: Bone Density Augmentation, Cerebral Booster, Chameleon Skin (Dynamic), Muscle Augmentation, Neo-EPO, Neuro Retention Amplification, Synaptic Acceleration, Tailored Pheromones, Vocal Range Expander
- **complexform** (`chummer/metatypes/metatype/complexforms/complexform`): 13 unique values
  - Values: Derezz, Diffusion of [Matrix Attribute], Editor, Infusion of [Matrix Attribute], Pulse Storm, Puppeteer, Resonance Channel, Resonance Spike, Resonance Veil, Static Bomb, Static Veil, Tattletale, Transcendent Grid

### Numeric Type Candidates
- **karma** (`chummer/metatypes/metatype/karma`): 100.0% numeric
  - Examples: 0, 0, 0
- **page** (`chummer/metatypes/metatype/page`): 100.0% numeric
  - Examples: 402, 402, 403
- **karma** (`chummer/metatypes/metatype/metavariants/metavariant/karma`): 100.0% numeric
  - Examples: 0, 0, 0
- **resmin** (`chummer/metatypes/metatype/metavariants/metavariant/resmin`): 100.0% numeric
  - Examples: 0, 0, 0
- **resmax** (`chummer/metatypes/metatype/metavariants/metavariant/resmax`): 100.0% numeric
  - Examples: 0, 0, 0
- **resaug** (`chummer/metatypes/metatype/metavariants/metavariant/resaug`): 100.0% numeric
  - Examples: 0, 0, 0
- **depmin** (`chummer/metatypes/metatype/metavariants/metavariant/depmin`): 100.0% numeric
  - Examples: 0, 0, 0
- **depmax** (`chummer/metatypes/metatype/metavariants/metavariant/depmax`): 100.0% numeric
  - Examples: 0, 0, 0
- **depaug** (`chummer/metatypes/metatype/metavariants/metavariant/depaug`): 100.0% numeric
  - Examples: 0, 0, 0
- **walk** (`chummer/metatypes/metatype/metavariants/metavariant/walk`): 100.0% numeric
  - Examples: 2/2/2, 2/2/2, 2/2/2
- **run** (`chummer/metatypes/metatype/metavariants/metavariant/run`): 100.0% numeric
  - Examples: 4/4/4, 4/4/4, 4/4/4
- **sprint** (`chummer/metatypes/metatype/metavariants/metavariant/sprint`): 100.0% numeric
  - Examples: 2/2/2, 2/2/2, 2/2/2
- **initiativepass** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/initiativepass`): 100.0% numeric
  - Examples: 1, 1, 1
- **damageresistance** (`chummer/metatypes/metatype/metavariants/metavariant/bonus/damageresistance`): 100.0% numeric
  - Examples: 2, 2, 2
- **biowareessmultiplier** (`chummer/metatypes/metatype/bonus/biowareessmultiplier`): 100.0% numeric
  - Examples: 90, 90, 90
- **genetechcostmultiplier** (`chummer/metatypes/metatype/bonus/genetechcostmultiplier`): 100.0% numeric
  - Examples: 80, 80, 80
- **genetechessmultiplier** (`chummer/metatypes/metatype/bonus/genetechessmultiplier`): 100.0% numeric
  - Examples: 90, 90, 90
- **reach** (`chummer/metatypes/metatype/bonus/enabletab/reach`): 100.0% numeric
  - Examples: 1, 1
