<!-- v5-common-helpers-and-data-refinement-2024 -->

# V5 Common Struct Helpers & Data Refinement Plan

## Overview

This plan addresses opportunities to consolidate common helper functions, standardize field naming, and refine data structures across the `pkg/shadowrun/edition/v5` package. This builds on previous standardization work and focuses on practical improvements that reduce duplication and improve consistency.

## Analysis Summary

### Key Findings

1. **Pointer Helper Functions Duplication** (High Priority)

- `intPtr` defined in `complexforms_data.go`
- `floatPtr` defined in `powers_data.go`
- Should be centralized in `common.go` or `utilities.go`

2. **Inconsistent Cost Formula Field Names** (High Priority)

- `Cyberware`/`Bioware`: `CostFormula *CostFormula` ✅
- `Gear`: `CostFormulaStruct *CostFormula` ❌ (inconsistent)
- `VehicleModification`: `Cost CostFormula` ✅ (embedded, not pointer)

3. **Common Struct Field Patterns** (Medium Priority)

- Many structs share: `Name`, `Description`, `Source *SourceReference`, `WirelessBonus *WirelessBonus`
- Opportunity for base struct or documentation of pattern

4. **Interface Implementation Gaps** (Medium Priority)

- Interfaces exist: `SourceReferenced`, `Costed`, `Ratable`, `Validator`
- Not all relevant structs implement these consistently

5. **Common Validation Patterns** (Low Priority)

- Many `Validate()` methods check: name not empty, type/category not empty, rating bounds
- Opportunity to extract common validation helpers

## Implementation Plan

### Phase 1: Consolidate Pointer Helpers (High Priority)

**Goal**: Move `intPtr` and `floatPtr` to a common location for reuse across all data files.

#### 1.1 Add Pointer Helpers to `common.go`

**File**: `pkg/shadowrun/edition/v5/common.go`

Add after `NewSourceReferenceFromString` function:

// intPtr returns a pointer to an int.
// This helper is useful for creating pointer values for optional int fields.
func intPtr(i int) *int {
return &i
}

// floatPtr returns a pointer to a float64.
// This helper is useful for creating pointer values for optional float64 fields.
func floatPtr(f float64) *float64 {
return &f
}

#### 1.2 Remove Duplicate Definitions

**Files to modify**:

- `pkg/shadowrun/edition/v5/complexforms_data.go` - Remove `intPtr` function (line ~148)
- `pkg/shadowrun/edition/v5/powers_data.go` - Remove `floatPtr` function (line ~283)

**Action**: Delete the function definitions, imports remain the same.

#### 1.3 Verify All Data Files Can Access Helpers

**Files that use these helpers** (verify they work after move):

- `augmentations_data.go` - Uses `intPtr` and `floatPtr`
- `complexforms_data.go` - Uses `intPtr`
- `powers_data.go` - Uses `floatPtr`
- `vehicle_modifications_data.go` - Uses `intPtr`
- `vehicles_data.go` - Uses `intPtr`

**Testing**: Run tests to ensure all data files compile and work correctly.

**Estimated Effort**: 30 minutes

---

### Phase 2: Standardize Cost Formula Field Names (High Priority)

**Goal**: Rename `CostFormulaStruct` to `CostFormula` in `Gear` struct for consistency.

#### 2.1 Update Gear Struct Definition

**File**: `pkg/shadowrun/edition/v5/gear.go`

**Change**:
// OLD:
CostFormulaStruct *CostFormula `json:"cost_formula_struct,omitempty"`

// NEW:
CostFormula *CostFormula `json:"cost_formula,omitempty"`**Note**: The JSON tag changes from `cost_formula_struct` to `cost_formula`. This is a breaking change for JSON API consumers, but the field name is more consistent.

#### 2.2 Update Gear Validation Method

**File**: `pkg/shadowrun/edition/v5/gear.go`

**Change** in `Validate()` method:
// OLD:
if g.CostFormulaStruct != nil && !g.CostFormulaStruct.IsValid() {

// NEW:
if g.CostFormula != nil && !g.CostFormula.IsValid() {#### 2.3 Update Gear Data File

**File**: `pkg/shadowrun/edition/v5/gear_data.go`

**Action**: Search and replace all instances of `CostFormulaStruct:` with `CostFormula:` in the data definitions.

**Testing**:

- Verify all gear items still load correctly
- Verify JSON serialization/deserialization works
- Update any API consumers if needed

**Estimated Effort**: 1 hour (including testing and API updates)

---

### Phase 3: Document Common Struct Patterns (Medium Priority)

**Goal**: Document the common field patterns used across structs to guide future development.

#### 3.1 Add Pattern Documentation to `common.go`

**File**: `pkg/shadowrun/edition/v5/common.go`

Add documentation section at the top of the file (after package comment):

// Common Struct Patterns
//
// Many entity structs in this package follow common patterns:
//
// Base Fields (commonly used):
//   - Name string - The entity name (required)
//   - Description string - Full text description (optional)
//   - Source *SourceReference - Source book reference (optional)
//   - WirelessBonus *WirelessBonus - Wireless-enabled functionality (optional)
//
// Cost Fields (varies by entity):
//   - Cost int - Fixed cost (deprecated in favor of CostFormula)
//   - CostFormula *CostFormula - Structured cost formula (preferred)
//   - Cost string - String-based cost formula (deprecated, legacy support)
//
// Rating Fields (for ratable entities):
//   - Rating int - Current rating value
//   - MaxRating int - Maximum allowed rating
//   - Rating RatingStructure - Structured rating info (HasRating, MaxRating)
//
// Validation:
//   - All entities should implement Validate() error method
//   - Validation should check: required fields, formula validity, rating bounds
//
// Data Access:
//   - GetAll*() []Type - Returns all entities
//   - Get*ByName(name string) *Type - Find by name
//   - Get*ByKey(key string) *Type - Find by map key
//   - Get*ByType/Category(...) []Type - Filter by type/category#### 3.2 Consider Base Entity Struct (Optional)

**Decision Point**: Evaluate if a base struct would be beneficial:

// BaseEntity contains common fields shared by many entity types.
// This can be embedded in entity structs to reduce duplication.
type BaseEntity struct {
Name         string           `json:"name,omitempty"`
Description  string           `json:"description,omitempty"`
Source       *SourceReference `json:"source,omitempty"`
WirelessBonus *WirelessBonus  `json:"wireless_bonus,omitempty"`
}**Pros**: Reduces duplication, ensures consistency
**Cons**: Adds indirection, may not fit all entities, Go embedding can be awkward

**Recommendation**: Document the pattern first, consider embedding later if duplication becomes problematic.

**Estimated Effort**: 30 minutes

---

### Phase 4: Ensure Interface Implementation (Medium Priority)

**Goal**: Verify and implement common interfaces where appropriate.

#### 4.1 Audit Current Interface Implementation

**Interfaces to check**:

- `SourceReferenced` - `GetSource() *SourceReference`, `SetSource(*SourceReference)`
- `Costed` - `GetCost() CostFormula`, `CalculateCost(rating int) (int, error)`
- `Ratable` - `RequiresRating() bool`, `CalculateWithRating(rating int) error`
- `Validator` - `Validate() error`

**Current Status**:

- ✅ `Validator` - Implemented on: Cyberware, Bioware, Weapon, Armor, Vehicle, Gear, Power, Program
- ❌ `SourceReferenced` - Not consistently implemented
- ❌ `Costed` - Not consistently implemented
- ❌ `Ratable` - Not consistently implemented

#### 4.2 Implement SourceReferenced Interface

**Target Structs**: All structs with `Source *SourceReference` field

**Example Implementation**:
// GetSource returns the source reference
func (c *Cyberware) GetSource() *SourceReference {
return c.Source
}

// SetSource sets the source reference
func (c *Cyberware) SetSource(src *SourceReference) {
c.Source = src
}**Priority Structs** (have Source field):

- Cyberware, Bioware
- Weapon, Armor, Gear
- Vehicle, VehicleModification
- Spell, ComplexForm, Program, Power
- Quality, Metatype
- Action, Contact, Lifestyle, Tradition, Mentor

**Estimated Effort**: 2-3 hours (implement on key structs, others as needed)

#### 4.3 Implement Costed Interface (Selective)

**Target Structs**: Only structs with `CostFormula *CostFormula` field

**Structs with CostFormula**:

- Cyberware, Bioware (have `CostFormula *CostFormula`)
- Gear (after Phase 2 rename)
- VehicleModification (has `Cost CostFormula` - embedded)

**Example Implementation**:
// GetCost returns the cost formula
func (c *Cyberware) GetCost() CostFormula {
if c.CostFormula != nil {
return *c.CostFormula
}
// Fallback to deprecated string-based cost
return CostFormula{Formula: c.Cost, IsVariable: true}
}

// CalculateCost calculates the cost for a given rating
func (c *Cyberware) CalculateCost(rating int) (int, error) {
if c.CostFormula != nil {
return c.CostFormula.Calculate(rating)
}
// Fallback to string-based calculation
return CalculateCostFormula(c.Cost, rating)
}**Estimated Effort**: 1-2 hours

#### 4.4 Implement Ratable Interface (Selective)

**Target Structs**: Only structs with rating-based formulas

**Structs that are ratable**:

- Cyberware, Bioware (have `RequiresRating()` already)
- Gear (has Rating field)
- Power (has level-based costs)
- Program (agents have ratings)

**Note**: Some structs already have `RequiresRating()` methods but don't implement the interface.

**Estimated Effort**: 1 hour

---

### Phase 5: Extract Common Validation Helpers (Low Priority)

**Goal**: Reduce duplication in `Validate()` methods by extracting common checks.

#### 5.1 Create Validation Helpers in `utilities.go`

**File**: `pkg/shadowrun/edition/v5/utilities.go`

Add common validation helpers:

// ValidateRequiredString checks if a required string field is not empty.
// Returns an error with the field name if empty.
func ValidateRequiredString(fieldName string, value string) error {
if value == "" {
return fmt.Errorf("%s is required", fieldName)
}
return nil
}

// ValidateRatingBounds checks if a rating is within valid bounds.
// Returns an error if rating exceeds max or is below min.
func ValidateRatingBounds(rating int, maxRating int, minRating int) error {
if maxRating > 0 && rating > maxRating {
return fmt.Errorf("rating %d exceeds maximum rating %d", rating, maxRating)
}
if minRating > 0 && rating < minRating {
return fmt.Errorf("rating %d is below minimum rating %d", rating, minRating)
}
if rating < 0 {
return fmt.Errorf("rating cannot be negative")
}
return nil
}

// ValidateCostFormula checks if a cost formula is valid.
// Returns an error if the formula is invalid.
func ValidateCostFormula(cf *CostFormula) error {
if cf == nil {
return nil // Optional field
}
if !cf.IsValid() {
return fmt.Errorf("invalid cost formula")
}
return nil
}#### 5.2 Refactor Existing Validate() Methods

**Example Refactoring** (Gear.Validate):

// OLD:
func (g *Gear) Validate() error {
if g.Name == "" {
return fmt.Errorf("gear name is required")
}
if g.Category == "" {
return fmt.Errorf("gear category is required")
}
// ... more checks
}

// NEW:
func (g *Gear) Validate() error {
if err := ValidateRequiredString("gear name", g.Name); err != nil {
return err
}
if err := ValidateRequiredString("gear category", string(g.Category)); err != nil {
return err
}
// ... more checks using helpers
}**Target Structs for Refactoring**:

- Gear, Armor, Weapon, Vehicle (already have Validate methods)

**Estimated Effort**: 2 hours

---

## Implementation Checklist

### Phase 1: Pointer Helpers ✅

- [x] Add `intPtr` and `floatPtr` to `common.go` ✅ **COMPLETE** - Functions are defined at lines 302-312
- [x] Remove `intPtr` from `complexforms_data.go` ✅ **COMPLETE** - No duplicate found
- [x] Remove `floatPtr` from `powers_data.go` ✅ **COMPLETE** - No duplicate found
- [x] Verify all data files compile ✅ **COMPLETE** - All files compile successfully
- [x] Run tests to ensure no regressions ✅ **COMPLETE** - All tests pass

### Phase 2: Cost Formula Naming ✅

- [ ] Rename `CostFormulaStruct` to `CostFormula` in `gear.go`
- [ ] Update `Validate()` method in `gear.go`
- [ ] Update all references in `gear_data.go`
- [ ] Update JSON tag from `cost_formula_struct` to `cost_formula`
- [ ] Test JSON serialization/deserialization
- [ ] Update API consumers if needed
- [ ] Update any documentation referencing the old field name

### Phase 3: Pattern Documentation ✅

- [ ] Add pattern documentation to `common.go`
- [ ] Document common field patterns
- [ ] Document validation patterns
- [ ] Document data access patterns
- [ ] Consider base struct (optional, document decision)

### Phase 4: Interface Implementation ✅

- [ ] Audit current interface implementation status
- [ ] Implement `SourceReferenced` on key structs (10-15 structs)
- [ ] Implement `Costed` on structs with CostFormula (3-4 structs)
- [ ] Implement `Ratable` on structs with ratings (4-5 structs)
- [ ] Verify `Validator` is implemented where needed
- [ ] Add tests for interface implementations

### Phase 5: Validation Helpers ✅

- [ ] Add validation helpers to `utilities.go`
- [ ] Refactor `Gear.Validate()` to use helpers
- [ ] Refactor `Armor.Validate()` to use helpers
- [ ] Refactor `Weapon.Validate()` to use helpers
- [ ] Refactor `Vehicle.Validate()` to use helpers
- [ ] Add tests for validation helpers

---

## Files to Modify

### High Priority

1. `pkg/shadowrun/edition/v5/common.go` - Add pointer helpers, add pattern documentation
2. `pkg/shadowrun/edition/v5/gear.go` - Rename CostFormulaStruct to CostFormula
3. `pkg/shadowrun/edition/v5/gear_data.go` - Update field references
4. `pkg/shadowrun/edition/v5/complexforms_data.go` - Remove intPtr
5. `pkg/shadowrun/edition/v5/powers_data.go` - Remove floatPtr

### Medium Priority

6. `pkg/shadowrun/edition/v5/augmentations.go` - Implement interfaces
7. `pkg/shadowrun/edition/v5/weapons.go` - Implement interfaces
8. `pkg/shadowrun/edition/v5/armor.go` - Implement interfaces
9. `pkg/shadowrun/edition/v5/vehicles.go` - Implement interfaces
10. `pkg/shadowrun/edition/v5/vehical_modifications.go` - Implement interfaces

### Low Priority

11. `pkg/shadowrun/edition/v5/utilities.go` - Add validation helpers
12. Various entity files - Refactor Validate() methods to use helpers

---

## Testing Strategy

### Unit Tests

- Test pointer helpers (`intPtr`, `floatPtr`)
- Test validation helpers
- Test interface implementations
- Test CostFormula field rename (JSON serialization)

### Integration Tests

- Verify all data files load correctly after pointer helper move
- Verify gear data loads correctly after field rename
- Verify interface implementations work with existing code

### Regression Tests

- Run existing test suite
- Verify no breaking changes to API
- Verify JSON compatibility (may need migration for CostFormula rename)

---

## Success Criteria

1. ✅ **Pointer helpers centralized**: `intPtr` and `floatPtr` available in `common.go`
2. ✅ **Field naming consistent**: All structs use `CostFormula` (not `CostFormulaStruct`)
3. ✅ **Patterns documented**: Common struct patterns documented in `common.go`
4. ✅ **Interfaces implemented**: Key structs implement relevant interfaces
5. ✅ **Validation helpers**: Common validation logic extracted to utilities
6. ✅ **No breaking changes**: All existing code continues to work
7. ✅ **Tests pass**: All tests pass, new tests added for helpers

---

## Estimated Total Effort

- **Phase 1**: 30 minutes
- **Phase 2**: 1 hour
- **Phase 3**: 30 minutes
- **Phase 4**: 4-6 hours
- **Phase 5**: 2 hours

**Total**: ~8-10 hours

---

## Notes

- **Backward Compatibility**: Phase 2 (CostFormula rename) may break JSON API consumers. Consider versioning or migration strategy.
- **Interface Implementation**: Not all structs need all interfaces. Implement selectively based on actual usage.
- **Validation Helpers**: Start with most common patterns, expand as needed.
- **Base Struct**: Defer decision on base struct until after pattern documentation is in place.

---

## Future Enhancements (Out of Scope)

- Generic data access helpers (Go generics)
- Base entity struct with embedding
- Comprehensive interface implementation audit
- Formula parsing improvements
- Additional validation helpers as patterns emerge