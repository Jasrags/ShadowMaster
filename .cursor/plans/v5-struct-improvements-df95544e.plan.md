<!-- df95544e-90f8-4bd6-b433-456343d0087a 47775e54-e65d-40f4-9439-ab782ef9417e -->
# V5 Struct Improvements Analysis

## Overview

Analysis of struct definitions in `pkg/shadowrun/edition/v5` identified several areas for improvement across consistency, type safety, validation, and code organization.

## Key Findings

### 1. Incomplete/Stub Structs

- **`Book` struct** (`books.go:4-6`): Empty stub with no fields
- **`LifestyleItem` struct** (`lifestyles.go:4-6`): Empty stub with no fields
- Both have stub functions that return empty data

### 2. Consistency Issues

#### Pointer vs Value Semantics

- Good: Optional nested structs use pointers (`*WirelessBonus`, `*SourceReference`, `*ArmorSpecialProperty`)
- Inconsistent: Some optional fields use pointers, others use zero values with `omitempty`
- Example: `Gear.MechanicalEffects` is `*GearMechanicalEffect` (pointer), but `Gear.Cost` is `int` with `omitempty`

#### Function Naming Patterns

- Most entities have: `GetAll*()`, `GetByName()`, `GetByKey()`, `GetByType/Category()`
- `WeaponAccessory` uses `GetWeaponAccessoriesByMountType()` (plural) vs others use singular
- `Weapon` uses `GetWeaponsByType()` (plural) vs `GetArmorByType()` (singular)

#### Data Organization Structs

- Pattern: `*Data` structs (e.g., `ArmorData`, `GearsData`, `WeaponData`) group items by category
- Repetitive switch statements in `Get*Data()` functions
- Could benefit from generic helper or map-based approach

### 3. Type Safety Improvements

#### String Fields That Could Be Enums

- `Gear.Availability` (string) - could be `Availability` type with validation
- `WeaponAccessory.Availability` (string) - same issue
- `Gear.Cost` (int) vs `WeaponAccessory.Cost` (string) - inconsistent types for cost
- `Gear.CostPerRating` (bool) suggests cost can vary, but `WeaponAccessory.Cost` is string

#### Missing Validation Types

- Rating fields (int) have no min/max validation
- No validation for enum types (e.g., `ArmorType`, `WeaponType`) against valid values

### 4. Code Organization

#### Duplicated Patterns

- Similar `GetAll*()` implementations across files
- Similar `GetByName()` and `GetByKey()` implementations
- Could extract common patterns into generic helpers or interfaces

#### Missing Interfaces

- No common interface for entities (e.g., `Entity` with `GetName()`, `GetSource()`)
- No repository-like interface pattern for data access

### 5. Validation & Methods

#### Missing Validation

- No validation methods on structs (e.g., `Validate()` methods)
- No bounds checking for ratings, costs, etc.
- No validation for required fields

#### Missing Utility Methods

- No `String()` methods for custom types
- No comparison methods
- No helper methods for common operations (e.g., `HasWirelessBonus()`, `GetEffectiveCost()`)

### 6. Documentation

#### Inconsistent Documentation

- Some structs have comprehensive field comments (e.g., `Armor`, `Weapon`)
- Others have minimal comments (e.g., `Book`, `LifestyleItem`)
- Missing package-level documentation explaining the data model

### 7. Specific Struct Issues

#### `QualityBonus` (`qualities.go:187-274`)

- Very large struct with many optional fields
- Could benefit from composition or breaking into smaller structs
- `Ambidextrous []bool` is unusual - likely should be a single bool

#### `Gear` vs `WeaponAccessory` Cost Handling

- `Gear.Cost` is `int` with `CostPerRating bool`
- `WeaponAccessory.Cost` is `string` (supports formulas like "2×Weapon Cost")
- Inconsistent approach to variable costs

#### `SourceReference` (`common.go:4-7`)

- Simple struct, well-defined
- Could add validation method

## Recommended Improvements

### Priority 1: Critical

1. Complete stub structs (`Book`, `LifestyleItem`) or document why they're stubs
2. Standardize function naming (singular vs plural)
3. Add validation for enum types and rating bounds

### Priority 2: Important

4. Create common interfaces for entity operations
5. Add validation methods to structs
6. Standardize cost representation (int vs string)
7. Extract common data access patterns

### Priority 3: Nice to Have

8. Add utility methods (`String()`, comparison methods)
9. Improve documentation consistency
10. Consider refactoring large structs like `QualityBonus`

## Files to Modify

- `books.go` - Complete or document Book struct
- `lifestyles.go` - Complete or document LifestyleItem struct
- `common.go` - Add validation, consider interfaces
- `armor.go`, `gear.go`, `weapons.go`, `weapon_accessories.go`, `qualities.go`, `skills.go` - Standardize patterns, add validation
- Consider new file: `validation.go` or `interfaces.go` for shared code

### To-dos

- [ ] Analyze Book and LifestyleItem stubs - determine if they need completion or should remain stubs with documentation
- [ ] Standardize function naming patterns (singular vs plural) across all entity types
- [ ] Add validation methods for structs, enum types, and rating bounds
- [ ] Standardize cost representation between Gear (int) and WeaponAccessory (string)
- [ ] Create common interfaces for entity operations to reduce duplication
- [ ] Extract common data access patterns into reusable helpers
- [ ] Add utility methods (String(), comparison, helpers) to structs
- [ ] Improve documentation consistency across all structs