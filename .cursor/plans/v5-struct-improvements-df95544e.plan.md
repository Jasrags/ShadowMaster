<!-- df95544e-90f8-4bd6-b433-456343d0087a 47775e54-e65d-40f4-9439-ab782ef9417e -->
# V5 Struct Improvements Analysis (Updated - Complete Rescan)

## Overview

Comprehensive analysis of struct definitions in `pkg/shadowrun/edition/v5` after significant expansion. The codebase now includes 24+ entity types with data files, showing both improvements and areas for further enhancement.

## Current State Summary

### Entity Types (24+ Total)

**Core Game Entities:**
1. **Actions** (`actions.go`) - Combat action definitions with ActionType enum
2. **Augmentations** (`augmentations.go`) - Cyberware and Bioware with formula parsing
3. **ComplexForms** (`complexforms.go`) - Matrix complex forms with nested structs
4. **Metatypes** (`metatypes.go`) - Metatype definitions with AttributeRange, InitiativeCalculation
5. **Powers** (`powers.go`) - Adept/mystic powers with PowerCostFormula
6. **Programs** (`programs.go`) - Matrix programs with AgentRatingRange, ProgramEffect
7. **Spells** (`spells.go`) - Spell definitions with DrainFormula, SpellEffect
8. **Traditions** (`traditions.go`) - Magical tradition definitions
9. **Vehicles** (`vehicles.go`) - Vehicle/drone definitions with nested rating structs
10. **VehicleModifications** (`vehical_modifications.go`) - Vehicle mods with formula structs
11. **Mentors** (`mentors.go`) - Mentor spirit definitions

**Equipment & Gear:**
12. **Armor** (`armor.go`) - Armor, clothing, modifications, helmets, shields
13. **Gear** (`gear.go`) - General gear items with categories
14. **Weapons** (`weapons.go`) - Weapon definitions with WeaponType, WeaponSkill enums
15. **WeaponAccessories** (`weapon_accessories.go`) - Weapon accessories and modifications
16. **WeaponConsumables** (`weapon_consumables.go`) - Ammunition and consumables

**Character Elements:**
17. **Qualities** (`qualities.go`) - Positive and negative qualities with complex bonus structures
18. **Skills** (`skills.go`) - Active, knowledge, and language skills
19. **Contacts** (`contacts.go`) - Contact type definitions
20. **Lifestyles** (`lifestyles.go`) - Lifestyle and lifestyle option definitions
21. **Books** (`books.go`) - Source book definitions (ID, Name, Code)

**Legacy/Support:**
22. **LifestyleItem** (`lifestyles.go:42`) - Legacy struct for backward compatibility (intentionally empty)

## Key Findings

### 1. Struct Completeness ✅

**All structs are complete and functional:**
- ✅ **`Book` struct** (`books.go:4-11`): Fully defined with ID, Name, Code fields, populated with 60+ books
- ✅ **`Lifestyle` struct** (`lifestyles.go:4-15`): Fully defined with ID, Name, Description, Cost, Source
- ✅ **`LifestyleOption` struct** (`lifestyles.go:18-29`): Fully defined with ID, Name, Description, Cost, Source
- ⚠️ **`LifestyleItem` struct** (`lifestyles.go:42-44`): Intentionally empty legacy struct for backward compatibility - documented as such

### 2. Consistency Improvements (Excellent Progress)

#### Function Naming Patterns (Well Standardized)

- ✅ **Consistent**: All entities follow `GetAll*()`, `GetByName()`, `GetByKey()`, `GetByType/Category()` pattern
- ✅ **Good examples**: Actions, ComplexForms, Metatypes, Programs, Spells, Vehicles all follow consistent patterns
- ✅ **Minor variations acceptable**: `GetWeaponAccessoriesByMountType()` uses plural for clarity (acceptable)
- ✅ **Consistent plural usage**: Most `Get*ByType()` functions use plural (e.g., `GetWeaponsByType()`, `GetVehiclesByType()`)

#### Data Organization Structs (Excellent Implementation)

- ✅ **Well-implemented**: `*Data` structs organize items by category:
  - `ActionData` (by ActionType)
  - `MetatypeData` (by MetatypeCategory)
  - `ProgramData` (by ProgramType)
  - `SpellData` (by SpellCategory)
  - `VehicleData` (by VehicleType and VehicleSubtype - nested structure)
  - `VehicleModificationData` (by VehicleModificationType)
  - `ArmorData` (by ArmorType)
  - `WeaponData` (by WeaponType)
  - `GearsData` (by GearCategory)
- ✅ **Consistent**: All use switch statements in `Get*Data()` functions
- ⚠️ **Opportunity**: Could benefit from generic helper or map-based approach to reduce repetition (Go 1.18+ generics)

### 3. Type Safety Improvements Needed

#### Formula Handling Inconsistency (Critical Priority)

**String-based formulas** (used in):
- `Cyberware`: Essence, Capacity, Availability, Cost (all strings with "Rating * X" formulas)
- `Bioware`: Essence, Availability, Cost (all strings with "Rating * X" formulas)
- `Gear.CostFormula`: String formula (e.g., "Capacity*50", "Rating*100")

**Structured formula types** (used in):
- `PowerCostFormula` (Power): Structured with BaseCost, CostPerLevel, MaxLevel, etc.
- `CostFormula` (VehicleModification): Structured with BaseCost, Formula, IsVariable
- `DrainFormula` (Spell): Structured with BaseModifier, Formula, MinimumDrain
- `FadingFormula` (ComplexForm): Structured with BaseModifier, Formula, HasFading
- `SlotsFormula` (VehicleModification): Structured with FixedSlots, RatingBased, IsVariable
- `ThresholdFormula` (VehicleModification): Structured with FixedThreshold, Formula, IsVariable
- `AgentCostFormula` (Program): Structured with CostPerRating, Formula
- `AgentAvailabilityFormula` (Program): Structured with AvailabilityPerRating, Formula

**Recommendation**: Standardize formula handling - either:
1. Convert Cyberware/Bioware to structured formula types (preferred), OR
2. Create a common `Formula` interface/type that both approaches can use

#### String Fields That Could Be Enums

- `Cyberware.Part` (string) - could be `CyberwarePart` enum ("Head", "Eye", "Ear", "Body", "Limb", "Limb Accessories", "Weapon")
- `Cyberware.Availability` (string) - could be `Availability` type with validation
- `Bioware.Type` (string) - could be `BiowareType` enum ("Basic", "Cultured", "Other")
- `WeaponAccessory.Availability` (string) - same issue
- `Gear.Availability` (string) - same issue
- `Lifestyle.Cost` (string) - could be structured type for cost formulas
- `LifestyleOption.Cost` (string) - same issue

#### Cost Type Inconsistency (Still Present)

- `Gear.Cost` (int) with `CostPerRating bool` and `CostFormula string` - mixed approach
- `WeaponAccessory.Cost` (string) - supports formulas like "2×Weapon Cost"
- `Cyberware.Cost` (string) - supports formulas like "Rating * 20,000"
- `Bioware.Cost` (string) - supports formulas like "Rating * 55,000"
- `Vehicle.Cost` (int) - fixed cost
- `VehicleModification.Cost` (CostFormula struct) - structured formula
- `Lifestyle.Cost` (string) - descriptive cost like "10,000 nuyen a month"
- `LifestyleOption.Cost` (string) - modifier like "+1,000 nuyen a month"

**Recommendation**: Create unified `Cost` type that handles:
- Fixed costs (int)
- Rating-based formulas (string or struct)
- Percentage modifiers (string)
- Descriptive costs (string for lifestyles)

### 4. Code Organization

#### Duplicated Patterns (Opportunity for Improvement)

- ✅ **Good**: Similar `GetAll*()` implementations are consistent across all entities
- ✅ **Good**: Similar `GetByName()` and `GetByKey()` implementations are consistent
- ⚠️ **Opportunity**: Could extract common patterns into generic helpers (Go 1.18+ generics)
- ⚠️ **Opportunity**: Could create repository-like interface pattern for data access

#### Missing Interfaces

- No common interface for entities (e.g., `Entity` with `GetName()`, `GetSource()`)
- No repository-like interface pattern for data access
- Could benefit from `Entity` interface: `Name() string`, `Source() *SourceReference`, `Key() string`

#### Helper Methods (Inconsistent)

- ✅ **Excellent**: `Cyberware` and `Bioware` have comprehensive calculation methods:
  - `RequiresRating() bool`
  - `CalculateAvailability(rating int) string`
  - `CalculateCost(rating int) string`
  - `CalculateEssence(rating int) string`
  - `CalculateCapacity(rating int) string` (Cyberware only)
  - `NormalizeFormula(formula string) string` (package-level helper)
- ✅ **Good**: `Tradition.GetElementForCategory(category SpellCategory) string` - useful helper method
- ❌ **Missing**: Other entities with formulas don't have calculation helpers:
  - `VehicleModification` has formulas but no calculation methods
  - `Power` has `PowerCostFormula` but no calculation methods
  - `Program` has `AgentCostFormula` and `AgentAvailabilityFormula` but no calculation methods
  - `Spell` has `DrainFormula` but no calculation methods
  - `ComplexForm` has `FadingFormula` but no calculation methods

### 5. Validation & Methods

#### Missing Validation (Still an Issue)

- No validation methods on structs (e.g., `Validate()` methods)
- No bounds checking for ratings, costs, etc.
- No validation for required fields
- No validation for enum types against valid values
- No validation that formulas are well-formed

#### Missing Utility Methods

- ✅ **Good**: `Tradition.GetElementForCategory()` - example of useful helper method
- ❌ **Missing**: No `String()` methods for custom types (enums, structs)
- ❌ **Missing**: No comparison methods
- ❌ **Missing**: Helper methods for common operations (e.g., `HasWirelessBonus()`, `GetEffectiveCost()`)

### 6. Documentation

#### Documentation Status

- ✅ **Excellent**: Most structs have comprehensive field comments
- ✅ **Excellent**: Enum types have clear constant definitions with comments
- ✅ **Good**: Nested structs are well-documented
- ⚠️ **Inconsistent**: Some older structs have minimal comments
- ❌ **Missing**: Package-level documentation explaining the data model
- ❌ **Missing**: Documentation for formula parsing and calculation methods in `augmentations.go`

### 7. Specific Struct Issues

#### `QualityBonus` (`qualities.go:187-274`)

- Very large struct with many optional fields (70+ fields)
- Could benefit from composition or breaking into smaller structs
- `Ambidextrous []bool` is unusual - likely should be a single bool (or remove if always true when present)

#### Formula Parsing in `augmentations.go`

- ✅ **Good**: Has `NormalizeFormula()`, `calculateRatingFormula()` helpers
- ✅ **Good**: Has `RequiresRating()` and calculation methods
- ⚠️ **Issue**: Formula parsing is string-based and fragile
- ⚠️ **Issue**: No validation that formulas are well-formed
- ⚠️ **Issue**: Regex-based parsing could fail on edge cases
- ⚠️ **Issue**: Handles both "Rating * X" and "Rating*X" formats, but inconsistent

#### Nested Struct Patterns (Excellent Examples)

- ✅ **Excellent**: `Vehicle` uses `HandlingRating`, `SpeedRating`, `BodyRating`, `AvailabilityRating`
- ✅ **Excellent**: `VehicleModification` uses `CostFormula`, `SlotsFormula`, `ThresholdFormula`, `AvailabilityModifier`
- ✅ **Excellent**: `Spell` uses `DrainFormula`, `SpellEffect`
- ✅ **Excellent**: `ComplexForm` uses `FadingFormula`, `ComplexFormDuration`
- ✅ **Excellent**: `Power` uses `PowerCostFormula`
- ✅ **Excellent**: `Metatype` uses `AttributeRange`, `InitiativeCalculation`, `RacialTrait`
- ✅ **Excellent**: `Program` uses `AgentRatingRange`, `AgentCostFormula`, `AgentAvailabilityFormula`, `ProgramEffect`
- ✅ **Excellent**: `Armor` uses `ArmorModificationEffect`, `ArmorSpecialProperty`
- ✅ **Excellent**: `Gear` uses `GearMechanicalEffect`, `GearSpecialProperty`
- ✅ **Excellent**: `Weapon` uses `WeaponSpecialProperty`, `MeleeMode`
- ✅ **Excellent**: `Quality` uses many nested modifier structs (`CostStructure`, `SkillDicePoolBonus`, `AddictionModifier`, etc.)

**Recommendation**: Apply this pattern to `Cyberware` and `Bioware` formula fields

### 8. New Patterns Identified

#### ID Field Pattern

- `Cyberware`, `Bioware`, `Contact`, `Lifestyle`, `LifestyleOption`, `Book` have `ID` field that's set dynamically in `GetAll*()` functions
- Other entities don't have this pattern (they use map keys directly)
- Could standardize: either all have ID, or none do (or document the pattern)

#### Source Reference Pattern

- ✅ **Consistent**: All entities use `*SourceReference` (pointer) for optional source
- ✅ **Exception**: `Cyberware`, `Bioware`, `Lifestyle`, `LifestyleOption`, `Contact`, `Book` use `string` for Source instead of `*SourceReference`
- ⚠️ **Inconsistency**: Should standardize - either all use `*SourceReference` or document why some use `string`

#### Data Map Pattern

- ✅ **Consistent**: All entities use `data[EntityName] map[string][EntityName]` pattern
- ✅ **Good**: All declared in `*_data.go` files, referenced in main `*.go` files
- ✅ **Good**: Clear separation of concerns

#### Enum Type Patterns

- ✅ **Excellent**: Most entities use typed enums (e.g., `ActionType`, `SpellCategory`, `VehicleType`)
- ✅ **Good**: Enums are well-defined with constants
- ⚠️ **Missing**: Some string fields could be enums (see above)

## Recommended Improvements

### Priority 1: Critical

1. **Standardize Formula Handling**
   - Create common `Formula` interface or base type
   - Convert `Cyberware`/`Bioware` string formulas to structured types (like `PowerCostFormula`, `DrainFormula`)
   - Add calculation methods to all entities with formulas (`VehicleModification`, `Power`, `Program`, `Spell`, `ComplexForm`)
   - Add validation that formulas are well-formed

2. **Standardize Source Reference**
   - Convert `Cyberware`, `Bioware`, `Lifestyle`, `LifestyleOption`, `Contact`, `Book` to use `*SourceReference` instead of `string`
   - OR document why these use `string` instead of `*SourceReference`

3. **Add Validation**
   - Add `Validate()` methods to all structs
   - Add bounds checking for ratings, costs, etc.
   - Add validation for enum types against valid values
   - Add validation for formula syntax

### Priority 2: Important

4. **Standardize Cost Representation**
   - Create unified `Cost` type that handles fixed costs, formulas, percentages, and descriptive costs
   - Apply consistently across all entities
   - Consider `Cost` interface/type that handles all cases

5. **Add Calculation Helpers**
   - Add calculation methods to `VehicleModification` (for formulas)
   - Add calculation methods to `Power` (for PowerCostFormula)
   - Add calculation methods to `Program` (for AgentCostFormula, AgentAvailabilityFormula)
   - Add calculation methods to `Spell` (for DrainFormula)
   - Add calculation methods to `ComplexForm` (for FadingFormula)
   - Consider generic formula calculation helpers

6. **Create Common Interfaces**
   - Create `Entity` interface with `Name()`, `Source()`, `Key()` methods
   - Create repository-like interface for data access patterns
   - Use interfaces to reduce duplication

7. **Add Enum Types**
   - Convert `Cyberware.Part` to `CyberwarePart` enum
   - Convert `Bioware.Type` to `BiowareType` enum
   - Add `Availability` type with validation

### Priority 3: Nice to Have

8. **Extract Common Patterns**
   - Create generic helpers for `GetAll*()`, `GetByName()`, `GetByKey()` using Go generics (1.18+)
   - Reduce switch statement duplication in `Get*Data()` functions
   - Create map-based approach for data organization

9. **Add Utility Methods**
   - Add `String()` methods for custom types (enums, structs)
   - Add comparison methods where useful
   - Add helper methods for common operations

10. **Improve Documentation**
    - Add package-level documentation explaining the data model
    - Document formula parsing and calculation methods
    - Ensure all structs have comprehensive field comments

11. **Refactor Large Structs**
    - Consider breaking `QualityBonus` into smaller composed structs
    - Review other large structs for composition opportunities

12. **Standardize ID Pattern**
    - Either add ID field to all entities, or remove from those that have it
    - Document the pattern clearly

## Files to Modify

### High Priority
- `augmentations.go` - Convert string formulas to structured types, add validation, standardize Source
- `vehical_modifications.go` - Add calculation methods for formulas
- `powers.go` - Add calculation methods for PowerCostFormula
- `programs.go` - Add calculation methods for AgentCostFormula, AgentAvailabilityFormula
- `spells.go` - Add calculation methods for DrainFormula
- `complexforms.go` - Add calculation methods for FadingFormula
- `common.go` - Add validation, consider interfaces, add Formula types

### Medium Priority
- `armor.go`, `gear.go`, `weapons.go`, `weapon_accessories.go` - Standardize cost types, add validation
- `qualities.go` - Refactor QualityBonus, add validation
- `lifestyles.go`, `contacts.go`, `books.go` - Standardize Source to use *SourceReference
- All entity files - Add Validate() methods, add String() methods

### Low Priority
- Consider new file: `validation.go` for shared validation code
- Consider new file: `interfaces.go` for common interfaces
- Consider new file: `formulas.go` for formula types and calculation helpers
- Consider new file: `helpers.go` for generic data access helpers

## Statistics

- **Total Entity Types**: 24+
- **Structs with Formulas**: 6 (Cyberware, Bioware, Power, VehicleModification, Spell, ComplexForm)
- **Structs with *Data Organization**: 9 (Action, Metatype, Program, Spell, Vehicle, VehicleModification, Armor, Weapon, Gear)
- **Structs with Calculation Methods**: 2 (Cyberware, Bioware)
- **Structs with Helper Methods**: 3 (Cyberware, Bioware, Tradition)
- **Structs Using *SourceReference**: 18+
- **Structs Using string Source**: 6 (Cyberware, Bioware, Lifestyle, LifestyleOption, Contact, Book)
- **Structs with ID Field**: 6 (Cyberware, Bioware, Contact, Lifestyle, LifestyleOption, Book)
- **Structs with Enum Types**: 15+ (Action, ComplexForm, Metatype, Power, Program, Spell, Tradition, Vehicle, VehicleModification, Armor, Gear, Weapon, Quality, Skill, etc.)

## To-dos

- [ ] Standardize formula handling across all entities (string vs structured types)
- [ ] Add calculation methods to all entities with formulas (VehicleModification, Power, Program, Spell, ComplexForm)
- [ ] Standardize Source field (use *SourceReference consistently or document exceptions)
- [ ] Add validation methods for structs, enum types, and rating bounds
- [ ] Standardize cost representation between entities (int vs string vs struct)
- [ ] Create common interfaces for entity operations to reduce duplication
- [ ] Extract common data access patterns into reusable helpers (consider Go generics)
- [ ] Add utility methods (String(), comparison, helpers) to structs
- [ ] Improve documentation consistency across all structs
- [ ] Convert string fields to enums where appropriate (Cyberware.Part, Bioware.Type, etc.)
- [ ] Add package-level documentation explaining the data model
- [ ] Consider refactoring large structs like QualityBonus into composed structs
- [ ] Standardize ID field pattern (add to all or remove from some)
- [ ] Fix QualityBonus.Ambidextrous []bool - should likely be bool
