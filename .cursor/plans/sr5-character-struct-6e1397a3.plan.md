<!-- 6e1397a3-741c-49d9-97ac-5a4e6378139b 3dd74b69-e09b-42fa-b163-9714b1b300ef -->
# Shadowrun 5th Edition Character Struct Implementation

## Overview

Create a complete `CharacterSR5` domain model that tracks all aspects of a Shadowrun 5th Edition character, following the pattern established by `CharacterSR3` but with SR5-specific attributes, systems, and mechanics.

## Key Differences from SR3

- **Attributes**: Agility/Reaction/Logic/Intuition replace Quickness/Intelligence; Edge and Resonance added
- **Contacts**: Connection/Loyalty (1+) instead of Level/Loyalty (1-3)
- **Qualities**: Positive/negative quality system with karma costs
- **Technomancers**: Resonance attribute, Complex Forms, Living Persona
- **Limits**: Physical, Mental, Social limits (derived from attributes)
- **Reputation**: Three separate scores (Street Cred, Notoriety, Public Awareness)

## Missing Data Structures Analysis

### What Exists in Current v5 Package

✅ **Complete:**

- Qualities (`qualities.go`, `qualities_data.go`)
- Skills (`skills.go`, `active_skills_data.go`, `knowledge_skills_data.go`, `language_skills_data.go`)
- Weapons (`weapons.go`, `weapons_data.go`)
- Armor (`armor.go`, `armor_data.go`)
- Gear (`gear.go`, `gear_data.go`) - includes commlinks/cyberdecks as gear items
- Augmentations (`augmentations.go`, `augmentations_data.go`) - Cyberware & Bioware
- Contacts (`contacts.go`, `contacts_data.go`)
- Lifestyles (`lifestyles.go`, `lifestyles_data.go`)
- Books (`books.go`, `books_data.go`)

### What's Missing in v5 Package (Needs Creation)

❌ **Missing - Must Create:**

1. **Spells** (`spells.go`, `spells_data.go`) - Spell catalog with drain codes, categories, descriptors

- Reference: `v5old/spells.go` for structure (but create new implementation)
- JSON data exists in `data/editions/sr5/spells.json`

2. **Complex Forms** (`complexforms.go`, `complexforms_data.go`) - Technomancer complex forms with fading codes

- Reference: `v5old/complexforms.go` for structure (but create new implementation)
- JSON data exists in `data/editions/sr5/complexforms.json`

3. **Adept Powers** (`powers.go`, `powers_data.go`) - Power points, costs, requirements, levels

- Reference: `v5old/powers.go` for structure (but create new implementation)
- JSON data exists in `data/editions/sr5/powers.json`

4. **Traditions** (`traditions.go`, `traditions_data.go`) - Magical traditions with spirit types, drain attributes

- Reference: `v5old/traditions.go` for structure (but create new implementation)
- JSON data exists in `data/editions/sr5/traditions.json`

5. **Metatypes** (`metatypes.go`, `metatypes_data.go`) - Metatype data with attribute modifiers, special abilities, karma costs

- Reference: `v5old/metatypes.go` for structure (but create new implementation)
- Note: `metatypes.txt` exists but is just descriptive text, not structured data
- JSON data exists in `data/editions/sr5/metatypes.json`

6. **Priorities** (`priorities.go`, `priorities_data.go`) - Priority table values for all categories (Attributes, Skills, Resources, Heritage, Talent)

- Reference: `v5old/priorities.go` for structure (but create new implementation)
- JSON data exists in `data/editions/sr5/priorities.json`

7. **Vehicles** (`vehicles.go`, `vehicles_data.go`) - Vehicles and drones with stats (Handling, Speed, Body, Armor, etc.)

- Reference: `v5old/vehicles.go` for structure (but create new implementation)
- JSON data exists in `data/editions/sr5/vehicles.json`

8. **Programs** (`programs.go`, `programs_data.go`) - Matrix programs for deckers (Attack, Sleaze, Data Processing, Firewall)

- Reference: `v5old/programs.go` for structure (but create new implementation)
- JSON data exists in `data/editions/sr5/programs.json`

9. **Mentor Spirits** (`mentors.go`, `mentors_data.go`) - Mentor spirit bonuses, requirements, and restrictions

- Reference: `v5old/mentors.go` for structure (but create new implementation)
- JSON data may exist in `data/editions/sr5/mentors.json`

### What's Missing or Needs Clarification

⚠️ **Needs Clarification:**

1. **Rituals** - May be part of spells (need to verify if separate structure needed or if handled as spell category)
2. **Commlinks/Cyberdecks** - Exist as gear items, but may need dedicated character tracking structures for device ratings, matrix attributes
3. **Drones** - Part of vehicles, but may need separate character inventory structure for drone-specific properties (autopilot, sensor arrays, etc.)

### Data Creation Strategy

**Phase 0: Data Structure Creation** (Before CharacterSR5 implementation)

**Note:** We are NOT migrating from v5old. Instead, we need to CREATE new implementations in v5 package following the existing v5 patterns.

**Two-Step Approach:**

**Step 1: Create Stub Files**

1. Create struct definitions in `.go` files (e.g., `spells.go`) with minimal struct definitions
2. Create corresponding `_data.go` files with empty data maps and placeholder loader functions
3. This allows CharacterSR5 to reference the types immediately without waiting for data implementation

**Step 2: Fill in Data Loaders**

1. Review JSON data in `data/editions/sr5/` to understand the data schema
2. Complete struct definitions to match the JSON schema
3. Implement data loader functions similar to existing v5 patterns (e.g., `GetAllQualities()`, `GetQualityByName()`)
4. Populate data maps from JSON files
5. Ensure consistency with current v5 code style and structure
6. Reference v5old structures only for understanding the domain model, not for code migration

## Implementation Plan

### Phase 0: Data Structure Creation (Prerequisite)

Before implementing CharacterSR5, create missing data structures in v5 package. This is a two-step process:

**Step 1: Create Stub Files with Struct Definitions**

Create stub files with struct definitions and empty data maps. This allows CharacterSR5 to reference the types immediately:

- [ ] Create `spells.go` stub with `Spell` struct definition
- [ ] Create `spells_data.go` stub with empty `dataSpells` map and placeholder loader functions
- [ ] Create `complexforms.go` stub with `ComplexForm` struct definition
- [ ] Create `complexforms_data.go` stub with empty `dataComplexForms` map and placeholder loader functions
- [ ] Create `powers.go` stub with `Power` struct definition (Adept Powers)
- [ ] Create `powers_data.go` stub with empty `dataPowers` map and placeholder loader functions
- [ ] Create `traditions.go` stub with `Tradition` struct definition
- [ ] Create `traditions_data.go` stub with empty `dataTraditions` map and placeholder loader functions
- [ ] Create `metatypes.go` stub with `Metatype` struct definition
- [ ] Create `metatypes_data.go` stub with empty `dataMetatypes` map and placeholder loader functions
- [ ] Create `priorities.go` stub with `Priority` struct definition
- [ ] Create `priorities_data.go` stub with empty `dataPriorities` map and placeholder loader functions
- [ ] Create `vehicles.go` stub with `Vehicle` struct definition
- [ ] Create `vehicles_data.go` stub with empty `dataVehicles` map and placeholder loader functions
- [ ] Create `programs.go` stub with `Program` struct definition
- [ ] Create `programs_data.go` stub with empty `dataPrograms` map and placeholder loader functions
- [ ] Create `mentors.go` stub with `Mentor` struct definition
- [ ] Create `mentors_data.go` stub with empty `dataMentors` map and placeholder loader functions

**Step 2: Fill in Data Loaders**

After stubs are created, implement data loading from JSON files:

- [ ] Implement data loading in `spells_data.go` from `data/editions/sr5/spells.json`
- Follow pattern from `qualities.go` and `qualities_data.go`

- [ ] Implement data loading in `complexforms_data.go` from `data/editions/sr5/complexforms.json`
- Follow pattern from existing v5 data loaders

- [ ] Implement data loading in `powers_data.go` from `data/editions/sr5/powers.json`
- Follow pattern from existing v5 data loaders

- [ ] Implement data loading in `traditions_data.go` from `data/editions/sr5/traditions.json`
- Follow pattern from existing v5 data loaders

- [ ] Implement data loading in `metatypes_data.go` from `data/editions/sr5/metatypes.json`
- Follow pattern from existing v5 data loaders

- [ ] Implement data loading in `priorities_data.go` from `data/editions/sr5/priorities.json`
- Follow pattern from existing v5 data loaders

- [ ] Implement data loading in `vehicles_data.go` from `data/editions/sr5/vehicles.json`
- Follow pattern from existing v5 data loaders

- [ ] Implement data loading in `programs_data.go` from `data/editions/sr5/programs.json`
- Follow pattern from existing v5 data loaders

- [ ] Implement data loading in `mentors_data.go` from `data/editions/sr5/mentors.json` (if exists)
- Follow pattern from existing v5 data loaders

**Dependencies:**

- CharacterSR5 struct can reference types once stubs are created (e.g., `v5.Spell`, `v5.ComplexForm`)
- Stub files allow CharacterSR5 implementation to proceed without waiting for data loaders
- Data loaders can be implemented incrementally after CharacterSR5 struct is defined
- Reference v5old structures only for domain understanding, not code migration

### Phase 1: Core Domain Model (Initial Implementation)

Create the complete `CharacterSR5` struct definition in `internal/domain/character.go` with all fields designed, but focus initial implementation on core attributes and basic structure.

**Core Structure:**

- Physical Attributes: Body, Agility, Reaction, Strength
- Mental Attributes: Logic, Intuition, Willpower, Charisma  
- Special Attributes: Edge, Magic, Resonance
- Derived Attributes: Essence, Initiative, Limits, Condition Monitors
- Metatype and Priority System
- Basic Skills structure (Active, Knowledge, Language)
- Basic Equipment structure (Weapons, Armor, Gear)
- Resources (Nuyen, Karma)

**Supporting Types to Define:**

- `PriorityAssignmentsSR5` - SR5 priority selections
- `QualitySelection` - Selected qualities with karma values
- `ContactSR5` - Connection/Loyalty contact system
- `ReputationSR5` - Three-score reputation system
- `LifestyleSR5` - Lifestyle with modifiers
- Equipment types (WeaponSR5, ArmorSR5, etc.)
- Magic/Resonance types (SpellSR5, ComplexFormSR5, AdeptPowerSR5, etc.)

### Phase 2: Type Safety & Helpers

- Update `GetSR5Data()` and `SetSR5Data()` methods in `Character` to use `*CharacterSR5`
- Add validation helpers for SR5-specific rules
- Ensure JSON serialization/deserialization works correctly

### Phase 3: Integration Points

- Repository layer will handle SR5 characters (already supports `interface{}`)
- Service layer will use SR5 struct for validation and business logic
- API layer will expose SR5 character data

## File Changes

**Primary File:**

- `internal/domain/character.go` - Add `CharacterSR5` struct and supporting types

**Key Design Decisions:**

1. **No Play State**: Following user preference, exclude current damage, temporary modifiers, and current Edge from the struct
2. **Phased Approach**: Define complete structure but implement incrementally
3. **Follow SR3 Pattern**: Use similar field organization and naming conventions
4. **Leverage Existing Data**: Reference `pkg/shadowrun/edition/v5` data structures (Qualities, Skills, Weapons, etc.)

## Struct Design Highlights

The `CharacterSR5` struct will include:

- All 11 attributes (8 physical/mental + 3 special)
- Derived stats (calculated but stored for quick access)
- Priority system tracking
- Qualities arrays (positive/negative)
- Skills maps (Active, Knowledge, Language)
- Magic/Resonance systems (spells, complex forms, adept powers, etc.)
- Augmentations (cyberware/bioware with Essence tracking)
- Equipment (weapons, armor, gear, vehicles, drones, commlinks, cyberdecks)
- Social systems (contacts, lifestyle, reputation)
- Resources and advancement tracking
- Narrative fields (concept, backstory, notes)

## Validation Considerations

- Metatype attribute limits
- Only one attribute at natural maximum during creation
- Special attribute caps (Edge max 7 for humans, 6 otherwise)
- Qualities karma limits (±25 karma at creation)
- Skill rating caps (6 at creation, 7 with Aptitude)
- Availability 12 and Device Rating 6 limits at creation
- Augmentation attribute caps (+4 over natural)

## Next Steps After Phase 1

- Phase 2: Derived stats calculation service
- Phase 3: Repository integration and persistence
- Phase 4: Service layer business logic
- Phase 5: API and frontend integration
- Phase 6: Advanced features (qualities effects, technomancer support, etc.)