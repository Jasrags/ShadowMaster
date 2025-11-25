<!-- c4059700-aa04-4dcd-9188-26ef07a2e515 e3eac5a4-b05c-4e6d-a2f6-f1a971f15c87 -->
# SR5 Character Creation Implementation Plan

## Overview

This plan implements a complete Shadowrun 5th Edition character creation system that supports all three creation methods (Priority, Sum-to-Ten, Karma Point-Buy) and all 9 steps from the character creation guide.

## Architecture

The implementation follows the existing SR3 pattern:

- **Edition Handler**: `pkg/shadowrun/edition/v5/handler.go` - Implements `EditionHandler` interface
- **Domain Model**: `internal/domain/character.go` - Add `CharacterSR5` struct
- **Creation Data**: Leverage existing `data/editions/sr5/character_creation.json`
- **Validation**: Implement all SR5-specific validation rules
- **Calculations**: Implement derived attribute calculations (Initiative, Limits, Condition Monitors)

## Key Files to Create/Modify

### New Files

- `pkg/shadowrun/edition/v5/handler.go` - Main SR5 edition handler
- `pkg/shadowrun/edition/v5/character.go` - SR5 character creation logic
- `pkg/shadowrun/edition/v5/priorities.go` - Priority system implementation
- `pkg/shadowrun/edition/v5/validation.go` - SR5 validation rules
- `pkg/shadowrun/edition/v5/calculations.go` - Derived attribute calculations
- `pkg/shadowrun/edition/v5/karma_build.go` - Karma Point-Buy method
- `pkg/shadowrun/edition/v5/sum_to_ten.go` - Sum-to-Ten method

### Modified Files

- `internal/domain/character.go` - Add `CharacterSR5` struct and helper methods
- `cmd/shadowmaster-server/main.go` - Register SR5 handler

## Implementation Details

### Step 1: Domain Model (CharacterSR5)

Create `CharacterSR5` struct in `internal/domain/character.go` with:

- **Attributes**: Body, Agility, Reaction, Strength, Willpower, Logic, Intuition, Charisma, Edge
- **Special Attributes**: Magic, Resonance (mutually exclusive)
- **Priority System**: Metatype, Attributes, Magic/Resonance, Skills, Resources priorities
- **Metatype**: Selected metatype with special attribute points
- **Skills**: Active, Knowledge, Language skills (maps)
- **Qualities**: Positive and Negative qualities
- **Equipment**: Weapons, Armor, Cyberware, Bioware, Gear, Vehicles
- **Magic**: Spells, Complex Forms, Foci, Spirits, Adept Powers, Power Points
- **Social**: Contacts, Reputation, Lifestyle
- **Resources**: Karma, Nuyen, Essence
- **Derived**: Initiative, Inherent Limits, Condition Monitors

### Step 2: Edition Handler

Implement `SR5Handler` in `pkg/shadowrun/edition/v5/handler.go`:

- `Edition()` returns "sr5"
- `CreateCharacter()` handles all three creation methods
- `ValidateCharacter()` implements SR5 validation rules
- `GetCharacterCreationData()` loads from JSON repository

### Step 3: Priority System Implementation

Create priority system in `pkg/shadowrun/edition/v5/priorities.go`:

- Parse priority table from guide (A-E for each category)
- Apply metatype selection with special attribute points
- Apply attribute points (24/20/16/14/12 based on priority)
- Apply magic/resonance benefits (spells, skills, complex forms)
- Apply skill points (individual + group points)
- Apply resource allocation (nuyen)

### Step 4: Sum-to-Ten Method

Create `pkg/shadowrun/edition/v5/sum_to_ten.go`:

- Validate 10-point budget allocation
- Map point costs (A=4, B=3, C=2, D=1, E=0)
- Reuse priority table logic
- Support multiple A priorities if allowed

### Step 5: Karma Point-Buy Method

Create `pkg/shadowrun/edition/v5/karma_build.go`:

- Start with 800 karma budget
- Metatype costs (Human=0, Dwarf=50, Elf=40, Ork=50, Troll=90)
- Magic quality costs (Adept=20, Aspected=15, Magician=30, Mystic Adept=35, Technomancer=15)
- Attribute advancement costs (New Rating × 5)
- Skill advancement costs (Active: Rating × 2, Knowledge: Rating × 1)
- Karma→Nuyen conversion (1 karma = 2,000¥, max 200 karma for gear)
- Max 5,000¥ carryover

### Step 6: Character Creation Steps

Implement all 9 steps in `pkg/shadowrun/edition/v5/character.go`:

**Step 1: Choose Concept** - Validation only (no mechanical changes)

**Step 2: Metatype & Special Attributes**

- Select metatype based on priority
- Apply base attributes from metatype table
- Allocate special attribute points (Edge, Magic, Resonance)
- Apply racial abilities (vision, armor, reach, etc.)

**Step 3: Magic or Resonance**

- Apply magic/resonance benefits from priority
- Assign free spells/complex forms/skills
- Handle Adept Power Points
- Handle Mystic Adept special rules

**Step 4: Purchase Qualities**

- Load qualities from data
- Apply positive quality bonuses
- Apply negative quality penalties
- Track karma spent (max 25 positive, max 25 negative)

**Step 5: Purchase Skills**

- Allocate individual skill points
- Allocate skill group points
- Apply specializations (1 point each, +2 dice)
- Calculate free knowledge points: (Intuition + Logic) × 2
- Apply native language (rating 6, free)

**Step 6: Spend Resources**

- Purchase gear from equipment databases
- Apply availability restrictions (max 12, gameplay-level dependent)
- Apply device rating restrictions (max 6, gameplay-level dependent)
- Calculate Essence loss from augmentations
- Apply Essence→Magic/Resonance reduction
- Select Lifestyle
- Calculate starting nuyen

**Step 7: Spending Karma**

- Purchase additional spells/complex forms
- Register sprites (Technomancers)
- Bind spirits (Magicians)
- Bond foci
- Purchase contacts (Charisma × 3 karma free)
- Improve skills/attributes (with restrictions)
- Max 7 karma carryover

**Step 8: Final Calculations**

- Calculate Initiative (Physical, Astral, Matrix AR/VR)
- Calculate Inherent Limits (Mental, Physical, Social)
- Calculate Condition Monitors (Physical, Stun, Overflow)
- Calculate Living Persona (Technomancers)

**Step 9: Final Touches**

- Background development (no mechanical changes)
- GM approval workflow (validation only)

### Step 7: Validation Rules

Implement in `pkg/shadowrun/edition/v5/validation.go`:

- Each Priority Level (A-E) used exactly once (Priority method)
- Sum-to-Ten: Total points = 10
- Only one Physical or Mental attribute at natural maximum
- Maximum 25 karma in Positive Qualities
- Maximum 25 karma in Negative Qualities
- Maximum 7 karma carryover
- Maximum 5,000¥ carryover
- All attribute points spent
- All skill points spent
- Gear Availability ≤ 12 (or gameplay-level dependent)
- Gear Device Rating ≤ 6 (or gameplay-level dependent)
- Augmentation bonus ≤ +4 per attribute
- Maximum bound spirits = Charisma
- Maximum registered sprites = Charisma
- Maximum complex forms = Logic
- Maximum spells = Magic Rating × 2
- Maximum foci Force = Magic Rating × 2
- Essence ≥ 0 (burnout if Magic/Resonance reaches 0)

### Step 8: Derived Calculations

Implement in `pkg/shadowrun/edition/v5/calculations.go`:

- **Initiative**: Physical (Intuition + Reaction + 1D6), Astral (Intuition × 2 + 2D6), Matrix AR (Intuition + Reaction + 1D6), Matrix VR Cold (Data Processing + Intuition + 3D6), Matrix VR Hot (Data Processing + Intuition + 4D6)
- **Mental Limit**: [(Logic × 2) + Intuition + Willpower] / 3 (round up)
- **Physical Limit**: [(Strength × 2) + Body + Reaction] / 3 (round up) - add augmentation bonuses to Body
- **Social Limit**: [(Charisma × 2) + Willpower + Essence] / 3 (round up) - round Essence up first
- **Physical Condition Monitor**: [Body / 2] + 8 (add augmentation bonuses)
- **Stun Condition Monitor**: [Willpower / 2] + 8 (add augmentation bonuses)
- **Overflow**: Body + Augmentation bonuses
- **Living Persona**: Attack=Charisma, Data Processing=Logic, Device Rating=Resonance, Firewall=Willpower, Sleaze=Intuition

### Step 9: Integration

- Register SR5 handler in `cmd/shadowmaster-server/main.go`
- Load character creation data from `data/editions/sr5/character_creation.json`
- Integrate with existing equipment databases (weapons, armor, cyberware, etc.)
- Ensure API endpoints work with SR5 characters

## Data Dependencies

The implementation will use existing data files:

- `data/editions/sr5/character_creation.json` - Priority tables, metatypes, gameplay levels
- `data/editions/sr5/metatypes/all.json` - Metatype definitions
- `data/editions/sr5/qualities/all.json` - Positive and negative qualities
- `data/editions/sr5/skills/all.json` - Active, knowledge, language skills
- `data/editions/sr5/spells/all.json` - Spells database
- `data/editions/sr5/complexforms/all.json` - Complex forms database
- Equipment databases (weapons, armor, cyberware, bioware, gear, vehicles)

## Testing Considerations

- Unit tests for each creation method
- Validation rule tests
- Calculation accuracy tests
- Edge cases (burnout, max attributes, etc.)
- Integration tests with API endpoints

## Notes

- SR5 uses different attributes than SR3 (Agility instead of Quickness, separate Reaction)
- Magic and Resonance are mutually exclusive
- Essence loss reduces Magic/Resonance (1 point per whole Essence lost)
- Special attribute points can only be spent on Edge, Magic, or Resonance
- Knowledge skills use (Intuition + Logic) × 2 free points
- Contacts cost 1 karma per Connection + 1 karma per Loyalty (min 2, max 7 per contact)
- Free contact karma = Charisma × 3 (or × 6 for Prime Runner)

### To-dos

- [ ] Create CharacterSR5 struct in internal/domain/character.go with all SR5-specific fields (attributes, skills, equipment, magic, etc.) and helper methods (GetSR5Data, SetSR5Data)
- [ ] Create SR5Handler in pkg/shadowrun/edition/v5/handler.go implementing EditionHandler interface with Edition(), CreateCharacter(), ValidateCharacter(), and GetCharacterCreationData() methods
- [ ] Implement Priority system in pkg/shadowrun/edition/v5/priorities.go - parse priority table, apply metatype selection, attribute points, magic/resonance benefits, skill points, and resources
- [ ] Implement Sum-to-Ten creation method in pkg/shadowrun/edition/v5/sum_to_ten.go with 10-point budget validation and priority cost mapping
- [ ] Implement Karma Point-Buy method in pkg/shadowrun/edition/v5/karma_build.go with 800 karma budget, metatype costs, magic quality costs, and karma→nuyen conversion
- [ ] Implement all 9 character creation steps in pkg/shadowrun/edition/v5/character.go: Concept, Metatype/Attributes, Magic/Resonance, Qualities, Skills, Resources, Karma Spending, Final Calculations, Final Touches
- [ ] Implement comprehensive validation in pkg/shadowrun/edition/v5/validation.go covering priority uniqueness, attribute limits, karma/quality limits, gear restrictions, essence rules, and all SR5-specific constraints
- [ ] Implement derived attribute calculations in pkg/shadowrun/edition/v5/calculations.go: Initiative (Physical/Astral/Matrix), Inherent Limits (Mental/Physical/Social), Condition Monitors, Living Persona
- [ ] Register SR5 handler in cmd/shadowmaster-server/main.go and ensure character creation data loads from JSON repository