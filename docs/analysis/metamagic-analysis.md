# Analysis Report: metamagic.xml

**File**: `data\chummerxml\metamagic.xml`
**Root Element**: `chummer`

---

## Summary

- **Total Elements**: 774
- **Unique Fields**: 29
- **Unique Attributes**: 3
- **Unique Element Types**: 43

## Fields

### id
**Path**: `chummer/metamagics/metamagic/id`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 63
- **Type Patterns**: string
- **Length Range**: 36-36 characters
- **Examples**:
  - `03bdecec-6142-4b24-8aaa-0a0827c3eb78`
  - `e021b9ba-2cbe-4c17-865d-0ebc9a2df4cc`
  - `099af8f9-6d04-4aa5-8645-f7204a8bf9be`
  - `666626f2-3605-4c48-8190-7bcbcdb2e89c`
  - `505d9fe3-852c-459b-8f9e-3e22c1b91b9a`

### name
**Path**: `chummer/metamagics/metamagic/name`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 63
- **Type Patterns**: string
- **Length Range**: 4-29 characters
- **Examples**:
  - `Adept Centering`
  - `Centering`
  - `Fixation`
  - `Flexible Signature`
  - `Masking`

### adept
**Path**: `chummer/metamagics/metamagic/adept`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: boolean_string, enum_candidate
- **Boolean Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 4-5 characters
- **Examples**:
  - `True`
  - `False`
  - `False`
  - `True`
  - `True`
- **All Values**: False, True

### magician
**Path**: `chummer/metamagics/metamagic/magician`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: boolean_string, enum_candidate
- **Boolean Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 4-5 characters
- **Examples**:
  - `False`
  - `True`
  - `True`
  - `True`
  - `True`
- **All Values**: False, True

### source
**Path**: `chummer/metamagics/metamagic/source`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 6
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
  - `SR5`
- **All Values**: DTR, FA, HT, PGG, SG, SR5

### page
**Path**: `chummer/metamagics/metamagic/page`

- **Count**: 63
- **Presence Rate**: 100.0%
- **Unique Values**: 25
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `325`
  - `325`
  - `325`
  - `325`
  - `326`
- **All Values**: 131, 145, 149, 150, 151, 152, 153, 155, 157, 158, 165, 325, 326, 35, 399, 43, 44, 46, 87, 90

### quality
**Path**: `chummer/metamagics/metamagic/required/oneof/quality`

- **Count**: 39
- **Presence Rate**: 100.0%
- **Unique Values**: 29
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 5-29 characters
- **Examples**:
  - `Adept`
  - `Mystic Adept`
  - `Adept`
  - `Mystic Adept`
  - `The Spiritual Way`
- **All Values**: Adept, Infected: Bandersnatch, Infected: Banshee, Infected: Dzoo-Noo-Qua, Infected: Ghoul (Dwarf), Infected: Ghoul (Elf), Infected: Ghoul (Human), Infected: Ghoul (Sasquatch), Infected: Ghoul (Troll), Infected: Goblin, Infected: Harvester, Infected: Loup-Garou, Infected: Nosferatu, Infected: Sukuyan (Non-Human), Infected: Vampire (Non-Human), Mystic Adept, The Beast's Way, The Speaker's Way, The Spiritual Way, The Warrior's Way

### art
**Path**: `chummer/metamagics/metamagic/required/allof/art`

- **Count**: 27
- **Presence Rate**: 100.0%
- **Unique Values**: 15
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-23 characters
- **Examples**:
  - `Centering`
  - `Advanced Alchemy`
  - `Quickening`
  - `Apotropaic Magic`
  - `Advanced Spellcasting`
- **All Values**: Advanced Alchemy, Advanced Ritual Casting, Advanced Spellcasting, Apotropaic Magic, Blood Magic, Centering, Channeling, Cleansing, Divination, Flexible Signature, Geomancy, Invocation, Necromancy, Quickening, Sensing

### id
**Path**: `chummer/arts/art/id`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 18
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 36-36 characters
- **Examples**:
  - `5b922bcf-4114-4c49-a4f3-0f3dcb45dd2f`
  - `fa64531c-5f86-45a0-aaaf-b8425a5b6dd1`
  - `9613228a-6c83-41f4-beaa-20ce6276334f`
  - `dec1323e-c728-45c6-8d24-59725e885dba`
  - `155c3b67-7118-4cd6-90fa-d8d6a3dfe21b`
- **All Values**: 022c5efc-cd66-4e6e-8031-800a614d1cd8, 04e9d62d-3e45-45b5-8743-0fc8c74ee69b, 10071e27-4cdd-4b17-8e8c-1de28713839b, 155c3b67-7118-4cd6-90fa-d8d6a3dfe21b, 1aa93daa-ffee-4e35-9141-a849f739e2b2, 1ea5a816-2d5b-4dd2-86b0-0f780c68872f, 28b078bf-22eb-4ba7-8689-e0d9f357ceb1, 4a1e34dc-38c9-48e8-9808-a0cf9b1009af, 5b922bcf-4114-4c49-a4f3-0f3dcb45dd2f, 8691b2b4-dc2d-4ce4-8b75-931ef61ea874, 9613228a-6c83-41f4-beaa-20ce6276334f, adc0e5e6-29b3-4b9c-83ba-d06f30f597e5, c0fb021c-8dc3-46a5-9a88-7a4e15210d7d, d28fb2f1-e0e6-4ca6-8e26-43d1487d612a, dd8b45f3-054d-4b96-a065-0ca249de60cb, dec1323e-c728-45c6-8d24-59725e885dba, fa4098b8-4075-4656-8c07-35d7dc0e63a8, fa64531c-5f86-45a0-aaaf-b8425a5b6dd1

### name
**Path**: `chummer/arts/art/name`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 18
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-23 characters
- **Examples**:
  - `Geomancy`
  - `Necromancy`
  - `Psychometry`
  - `Divination`
  - `Invocation`
- **All Values**: Advanced Alchemy, Advanced Ritual Casting, Advanced Spellcasting, Apotropaic Magic, Blood Magic, Centering, Channeling, Cleansing, Divination, Exorcism, Flexible Signature, Geomancy, Invocation, Masking, Necromancy, Psychometry, Quickening, Sensing

### source
**Path**: `chummer/arts/art/source`

- **Count**: 18
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
**Path**: `chummer/arts/art/page`

- **Count**: 18
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: numeric_string, enum_candidate
- **Numeric Ratio**: 100.0%
- **Enum Candidate**: Yes
- **Length Range**: 2-3 characters
- **Examples**:
  - `143`
  - `143`
  - `144`
  - `147`
  - `147`
- **All Values**: 143, 144, 147, 148, 149, 150, 152, 153, 154, 155, 89

### metamagic
**Path**: `chummer/metamagics/metamagic/required/allof/metamagic`

- **Count**: 13
- **Presence Rate**: 100.0%
- **Unique Values**: 9
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-20 characters
- **Examples**:
  - `Masking`
  - `Shielding`
  - `Shielding`
  - `Quickening`
  - `Fixation`
- **All Values**: Adept Centering, Cannibalize, Fixation, Harmonious Defense, Improved Astral Form, Masking, Quickening, Sacrifice, Shielding

### spirit
**Path**: `chummer/metamagics/metamagic/bonus/addspirit/spirit`

- **Count**: 11
- **Presence Rate**: 100.0%
- **Unique Values**: 11
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 6-16 characters
- **Examples**:
  - `Guardian Spirit`
  - `Guidance Spirit`
  - `Spirit of Air`
  - `Spirit of Beasts`
  - `Spirit of Earth`
- **All Values**: Guardian Spirit, Guidance Spirit, Plant Spirit, Shedim, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit

### art
**Path**: `chummer/metamagics/metamagic/required/oneof/art`

- **Count**: 8
- **Presence Rate**: 100.0%
- **Unique Values**: 5
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 7-23 characters
- **Examples**:
  - `Flexible Signature`
  - `Masking`
  - `Psychometry`
  - `Psychometry`
  - `Exorcism`
- **All Values**: Advanced Ritual Casting, Exorcism, Flexible Signature, Masking, Psychometry

### metamagic
**Path**: `chummer/metamagics/metamagic/required/oneof/metamagic`

- **Count**: 4
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 10-21 characters
- **Examples**:
  - `Paradigm Shift: Toxic`
  - `Paradigm Shift: Toxic`
  - `Adept Centering`
  - `Channeling`
- **All Values**: Adept Centering, Channeling, Paradigm Shift: Toxic

### quality
**Path**: `chummer/metamagics/metamagic/required/allof/quality`

- **Count**: 3
- **Presence Rate**: 100.0%
- **Unique Values**: 3
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-17 characters
- **Examples**:
  - `The Beast's Way`
  - `The Invisible Way`
  - `Mentor Spirit`
- **All Values**: Mentor Spirit, The Beast's Way, The Invisible Way

### spell
**Path**: `chummer/metamagics/metamagic/required/allof/spell`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 2
- **Type Patterns**: enum_candidate
- **Enum Candidate**: Yes
- **Length Range**: 13-24 characters
- **Examples**:
  - `Attune Animal`
  - `Summon Great Form Spirit`
- **All Values**: Attune Animal, Summon Great Form Spirit

### martialart
**Path**: `chummer/metamagics/metamagic/required/allof/martialart`

- **Count**: 2
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 31-31 characters
- **Examples**:
  - `Way of Unified Mana (Hapsum-Do)`
  - `Way of Unified Mana (Hapsum-Do)`

### limit
**Path**: `chummer/metamagics/metamagic/limit`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: boolean_string
- **Boolean Ratio**: 100.0%
- **Length Range**: 5-5 characters
- **Examples**:
  - `False`

### adeptpowerpoints
**Path**: `chummer/metamagics/metamagic/bonus/adeptpowerpoints`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string, boolean_string
- **Numeric Ratio**: 100.0%
- **Boolean Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `1`

### tradition
**Path**: `chummer/metamagics/metamagic/required/oneof/group/tradition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Elder God`

### initiategrade
**Path**: `chummer/metamagics/metamagic/required/oneof/group/initiategrade`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 1-1 characters
- **Examples**:
  - `3`

### tradition
**Path**: `chummer/metamagics/metamagic/required/oneof/tradition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Elder God`

### power
**Path**: `chummer/metamagics/metamagic/bonus/critterpowers/power`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 8-8 characters
- **Examples**:
  - `Movement`

### drainvalue
**Path**: `chummer/metamagics/metamagic/bonus/drainvalue`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: numeric_string
- **Numeric Ratio**: 100.0%
- **Length Range**: 2-2 characters
- **Examples**:
  - `-1`

### tradition
**Path**: `chummer/metamagics/metamagic/required/allof/tradition`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 5-5 characters
- **Examples**:
  - `Tarot`

### critterpower
**Path**: `chummer/metamagics/metamagic/required/allof/critterpower`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 9-9 characters
- **Examples**:
  - `Mist Form`

### traditionspiritform
**Path**: `chummer/metamagics/metamagic/required/oneof/traditionspiritform`

- **Count**: 1
- **Presence Rate**: 100.0%
- **Unique Values**: 1
- **Type Patterns**: string
- **Length Range**: 10-10 characters
- **Examples**:
  - `Possession`

## Attributes

### XMLSchema-instance}schemaLocation
**Path**: `chummer@{http://www.w3.org/2001/XMLSchema-instance}schemaLocation`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `http://www.w3.org/2001/XMLSchema metamagic.xsd`

### power@select
**Path**: `chummer/metamagics/metamagic/bonus/critterpowers/power@select`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Self-Only × 3`

### quality@extra
**Path**: `chummer/metamagics/metamagic/required/allof/quality@extra`

- **Count**: 1
- **Unique Values**: 1
- **Examples**:
  - `Horse`

## Type Improvement Recommendations

### Enum Candidates
- **adept** (`chummer/metamagics/metamagic/adept`): 2 unique values
  - Values: False, True
- **magician** (`chummer/metamagics/metamagic/magician`): 2 unique values
  - Values: False, True
- **source** (`chummer/metamagics/metamagic/source`): 6 unique values
  - Values: DTR, FA, HT, PGG, SG, SR5
- **page** (`chummer/metamagics/metamagic/page`): 25 unique values
  - Values: 131, 145, 149, 150, 151, 152, 153, 155, 157, 158, 165, 325, 326, 35, 399, 43, 44, 46, 87, 90
- **art** (`chummer/metamagics/metamagic/required/allof/art`): 15 unique values
  - Values: Advanced Alchemy, Advanced Ritual Casting, Advanced Spellcasting, Apotropaic Magic, Blood Magic, Centering, Channeling, Cleansing, Divination, Flexible Signature, Geomancy, Invocation, Necromancy, Quickening, Sensing
- **art** (`chummer/metamagics/metamagic/required/oneof/art`): 5 unique values
  - Values: Advanced Ritual Casting, Exorcism, Flexible Signature, Masking, Psychometry
- **quality** (`chummer/metamagics/metamagic/required/oneof/quality`): 29 unique values
  - Values: Adept, Infected: Bandersnatch, Infected: Banshee, Infected: Dzoo-Noo-Qua, Infected: Ghoul (Dwarf), Infected: Ghoul (Elf), Infected: Ghoul (Human), Infected: Ghoul (Sasquatch), Infected: Ghoul (Troll), Infected: Goblin, Infected: Harvester, Infected: Loup-Garou, Infected: Nosferatu, Infected: Sukuyan (Non-Human), Infected: Vampire (Non-Human), Mystic Adept, The Beast's Way, The Speaker's Way, The Spiritual Way, The Warrior's Way
- **metamagic** (`chummer/metamagics/metamagic/required/oneof/metamagic`): 3 unique values
  - Values: Adept Centering, Channeling, Paradigm Shift: Toxic
- **metamagic** (`chummer/metamagics/metamagic/required/allof/metamagic`): 9 unique values
  - Values: Adept Centering, Cannibalize, Fixation, Harmonious Defense, Improved Astral Form, Masking, Quickening, Sacrifice, Shielding
- **quality** (`chummer/metamagics/metamagic/required/allof/quality`): 3 unique values
  - Values: Mentor Spirit, The Beast's Way, The Invisible Way
- **spell** (`chummer/metamagics/metamagic/required/allof/spell`): 2 unique values
  - Values: Attune Animal, Summon Great Form Spirit
- **spirit** (`chummer/metamagics/metamagic/bonus/addspirit/spirit`): 11 unique values
  - Values: Guardian Spirit, Guidance Spirit, Plant Spirit, Shedim, Spirit of Air, Spirit of Beasts, Spirit of Earth, Spirit of Fire, Spirit of Man, Spirit of Water, Task Spirit
- **id** (`chummer/arts/art/id`): 18 unique values
  - Values: 022c5efc-cd66-4e6e-8031-800a614d1cd8, 04e9d62d-3e45-45b5-8743-0fc8c74ee69b, 10071e27-4cdd-4b17-8e8c-1de28713839b, 155c3b67-7118-4cd6-90fa-d8d6a3dfe21b, 1aa93daa-ffee-4e35-9141-a849f739e2b2, 1ea5a816-2d5b-4dd2-86b0-0f780c68872f, 28b078bf-22eb-4ba7-8689-e0d9f357ceb1, 4a1e34dc-38c9-48e8-9808-a0cf9b1009af, 5b922bcf-4114-4c49-a4f3-0f3dcb45dd2f, 8691b2b4-dc2d-4ce4-8b75-931ef61ea874, 9613228a-6c83-41f4-beaa-20ce6276334f, adc0e5e6-29b3-4b9c-83ba-d06f30f597e5, c0fb021c-8dc3-46a5-9a88-7a4e15210d7d, d28fb2f1-e0e6-4ca6-8e26-43d1487d612a, dd8b45f3-054d-4b96-a065-0ca249de60cb, dec1323e-c728-45c6-8d24-59725e885dba, fa4098b8-4075-4656-8c07-35d7dc0e63a8, fa64531c-5f86-45a0-aaaf-b8425a5b6dd1
- **name** (`chummer/arts/art/name`): 18 unique values
  - Values: Advanced Alchemy, Advanced Ritual Casting, Advanced Spellcasting, Apotropaic Magic, Blood Magic, Centering, Channeling, Cleansing, Divination, Exorcism, Flexible Signature, Geomancy, Invocation, Masking, Necromancy, Psychometry, Quickening, Sensing
- **page** (`chummer/arts/art/page`): 11 unique values
  - Values: 143, 144, 147, 148, 149, 150, 152, 153, 154, 155, 89

### Numeric Type Candidates
- **adeptpowerpoints** (`chummer/metamagics/metamagic/bonus/adeptpowerpoints`): 100.0% numeric
  - Examples: 1
- **initiategrade** (`chummer/metamagics/metamagic/required/oneof/group/initiategrade`): 100.0% numeric
  - Examples: 3
- **drainvalue** (`chummer/metamagics/metamagic/bonus/drainvalue`): 100.0% numeric
  - Examples: -1

### Boolean Type Candidates
- **limit** (`chummer/metamagics/metamagic/limit`): 100.0% boolean
  - Examples: False
