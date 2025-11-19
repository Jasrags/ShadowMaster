# V5 Package Structure Review & Improvement Recommendations

_Last updated: 2025-01-27_

## Executive Summary

The `pkg/shadowrun/edition/v5` package contains 41 data files processed from Chummer JSON, totaling ~130k lines of code across 123 Go files. The codebase successfully models Shadowrun 5th Edition data but has several structural issues that impact maintainability, type safety, and developer experience.

## Current State Assessment

### Strengths
- **Complete Coverage**: All 41 Chummer JSON files have been processed
- **Consistent File Organization**: Each data type follows `{type}.go`, `{type}_data.go`, `{type}_test.go` pattern
- **Good Test Coverage**: All files have corresponding test files using `testify/assert`
- **Embedded Data**: All data is embedded in Go code for performance and reliability
- **Documentation**: Good inline comments explaining field purposes

### Key Issues Identified

1. **Type Safety**: 1,432 instances of `interface{}` used for flexible fields
2. **Code Duplication**: Similar bonus structures duplicated across 20+ files
3. **Inconsistent Patterns**: Mixed approaches for single/array handling
4. **Complex Deferred Items**: Many complex structures left as `nil` with TODOs
5. **No Shared Types Package**: Common structures duplicated rather than shared

## Detailed Analysis

### 1. Type Safety Issues

**Problem**: Heavy use of `interface{}` reduces compile-time type checking and makes code harder to maintain.

**Examples**:
- `BiowareBonus.SkillCategory interface{}` - Can be single or array
- `Weapon.AddWeapon interface{}` - Can be string or []string
- `CritterPowers.Power interface{}` - Can be string, []string, CritterPower, or []CritterPower

**Impact**: 
- Runtime type assertions required everywhere
- No compile-time guarantees
- Difficult to refactor
- Poor IDE autocomplete support

### 2. Code Duplication

**Problem**: Similar bonus structures exist across multiple files with slight variations.

**Examples**:
- `BiowareBonus` (164 lines) vs `CyberwareBonus` (196 lines) - ~80% overlap
- `QualityBonus` (260+ lines) - Contains many fields similar to BiowareBonus
- `PowerBonus`, `MentorBonus`, `EchoBonus`, etc. - All have similar patterns

**Impact**:
- Changes must be made in multiple places
- Inconsistent field names/types across similar structures
- Increased maintenance burden

### 3. Inconsistent Patterns

**Problem**: Different approaches used for handling single vs. array fields.

**Pattern A - Wrapper Structs**:
```go
type WeaponAccessories struct {
    Accessory interface{} `json:"accessory,omitempty"`
}
```

**Pattern B - Direct interface{}**:
```go
type Weapon struct {
    AddWeapon interface{} `json:"addweapon,omitempty"`
}
```

**Pattern C - Explicit Single/Array**:
```go
type CritterPowers struct {
    Power interface{} `json:"power,omitempty"` // Comment says can be multiple types
}
```

**Impact**: Developers must remember which pattern applies where, increasing cognitive load.

### 4. Shared Types Reuse

**Current State**: Some types are reused via dot imports:
```go
import . "shadowmaster/pkg/shadowrun/edition/v5/bioware"
```

**Examples of Reused Types**:
- `SelectSkill` - Used in bioware, cyberware, powers, mentors, critterpowers
- `AddQualities` - Used in bioware, qualities, traditions, mentors
- `SpecificSkillBonus` - Used in armor, bioware, cyberware
- `BannedGrades`, `Forbidden`, `PairBonus` - Used in bioware and cyberware

**Problem**: Dot imports are discouraged in Go, and types are scattered across files.

### 5. Formula Evaluation

**Problem**: Many fields contain formula strings that need evaluation:
- `Ess: "Rating * 0.75"`
- `Cost: "Rating * 55000"`
- `Avail: "(Rating * 6)F"`

**Current State**: Formulas stored as strings with no evaluation system.

**Impact**: Cannot calculate actual values without manual parsing.

### 6. Complex Deferred Structures

**Problem**: Many complex nested structures set to `nil` with TODOs:
- `CyberwareRequired` - Complex parent details, one-of/all-of logic
- `WeaponRequired` - Complex weapon details requirements
- `Critters` - DataCritters map is empty due to complexity
- Various bonus fields marked as `interface{}` with TODOs

## Improvement Recommendations

### Priority 1: Create Shared Types Package (High Impact)

**Action**: Create `pkg/shadowrun/edition/v5/common/` package for shared types.

**Benefits**:
- Eliminate code duplication
- Single source of truth for common structures
- Better type safety
- Easier maintenance

**Structure**:
```
pkg/shadowrun/edition/v5/common/
  - bonuses.go       (shared bonus types)
  - requirements.go  (shared requirement types)
  - wrappers.go      (single/array wrapper types)
  - formulas.go      (formula evaluation types)
```

**Key Types to Extract**:
- `SelectSkill`, `SelectAttribute`, `SelectTextBonus`
- `SpecificSkillBonus`, `SkillCategoryBonus`, `SkillGroupBonus`
- `SpecificAttributeBonus`, `AttributeKarmaCostBonus`
- `AddQualities`, `BannedGrades`, `Forbidden`
- `PairBonus`, `PairInclude`
- `ConditionMonitorBonus`, `InitiativeBonus`, `InitiativePassBonus`
- `LimitModifier`, `ArmorBonus`, `WeaponAccuracyBonus`

### Priority 2: Type-Safe Single/Array Handling (High Impact)

**Action**: Create generic wrapper types for single/array fields.

**Proposed Types**:
```go
// common/wrappers.go
type SingleOrArray[T any] struct {
    value T
    isArray bool
}

// Or use a union type approach:
type SingleOrSlice[T any] interface {
    Single() T
    Slice() []T
    IsSingle() bool
}
```

**Alternative (Simpler)**: Use helper functions:
```go
// common/helpers.go
func AsSlice[T any](v interface{}) []T
func AsSingle[T any](v interface{}) T
func IsSlice(v interface{}) bool
```

**Migration Strategy**: Gradually replace `interface{}` fields with typed wrappers.

### Priority 3: Unified Bonus Structure (Medium Impact)

**Action**: Create a base `Bonus` struct with embedded optional fields.

**Proposed Structure**:
```go
// common/bonuses.go
type BaseBonus struct {
    // Limit modifiers
    LimitModifier *LimitModifierList
    
    // Skill bonuses
    SkillCategory *SkillCategoryBonusList
    SpecificSkill *SpecificSkillBonusList
    // ... etc
}

// Then embed in specific types:
type BiowareBonus struct {
    BaseBonus
    // Bioware-specific fields
}
```

**Benefits**: 
- Consistent structure across all bonus types
- Shared validation logic
- Easier to extend

### Priority 4: Formula Evaluation System (Medium Impact)

**Action**: Create formula parser and evaluator.

**Proposed Structure**:
```go
// common/formulas.go
type Formula struct {
    Expression string
    Variables  map[string]interface{}
}

func (f *Formula) Evaluate(vars map[string]interface{}) (interface{}, error)
```

**Use Cases**:
- Essence cost calculation: `"Rating * 0.75"` with `Rating: 4`
- Cost calculation: `"Rating * 55000"` with `Rating: 3`
- Availability parsing: `"(Rating * 6)F"` → `{Value: 18, Restricted: true}`

**Benefits**:
- Type-safe formula evaluation
- Reusable across all data types
- Validation at parse time

### Priority 5: Consistent Required/Forbidden Patterns (Medium Impact)

**Action**: Standardize requirement structures.

**Current State**: Multiple similar but different structures:
- `BiowareRequired` (OneOf, AllOf)
- `CyberwareRequired` (OneOf, AllOf, ParentDetails)
- `WeaponRequired` (WeaponDetails)
- `QualityRequired` (OneOf, AllOf, Metatype, etc.)

**Proposed Unified Structure**:
```go
// common/requirements.go
type Requirement struct {
    OneOf    *RequirementOneOf
    AllOf    *RequirementAllOf
    Parent   *ParentRequirement
    // ... extensible
}

type RequirementOneOf struct {
    Items []RequirementItem
}

type RequirementItem struct {
    Type  string // "cyberware", "bioware", "quality", etc.
    Value interface{} // Name or list of names
}
```

### Priority 6: Complete Deferred Structures (Low Priority)

**Action**: Gradually implement complex structures currently set to `nil`.

**Focus Areas**:
1. `DataCritters` - Populate with proper handling of complex powers/skills
2. `CyberwareRequired` - Implement parent details logic
3. `WeaponRequired` - Implement weapon details requirements
4. Complex bonus fields - Replace `interface{}` with proper structs

**Strategy**: Implement as needed when features require them.

### Priority 7: Code Organization Improvements (Low Priority)

**Actions**:
1. **Group Related Files**: Consider subdirectories for large categories:
   ```
   v5/
     equipment/
       armor.go, weapons.go, gear.go
     augmentation/
       bioware.go, cyberware.go
     magic/
       spells.go, powers.go, traditions.go
   ```

2. **Extract Constants**: Move magic strings to constants:
   ```go
   // common/constants.go
   const (
       CategoryPositive = "Positive"
       CategoryNegative = "Negative"
       // ...
   )
   ```

3. **Validation Helpers**: Create shared validation functions:
   ```go
   // common/validation.go
   func ValidateRating(rating int, min, max int) error
   func ValidateAvailability(avail string) error
   ```

## Implementation Strategy

### Phase 1: Foundation (Week 1-2)
1. Create `common/` package structure
2. Extract most-used shared types (SelectSkill, AddQualities, etc.)
3. Update imports across all files
4. Run tests to ensure no regressions

### Phase 2: Type Safety (Week 3-4)
1. Create wrapper types for single/array handling
2. Add helper functions for type conversion
3. Begin migrating high-traffic fields
4. Add validation helpers

### Phase 3: Unification (Week 5-6)
1. Create unified bonus structure
2. Migrate bonus types to use base structure
3. Standardize requirement patterns
4. Update all data files

### Phase 4: Advanced Features (Week 7+)
1. Implement formula evaluation system
2. Complete deferred structures as needed
3. Add comprehensive validation
4. Performance optimization

## Metrics for Success

- **Type Safety**: Reduce `interface{}` usage by 70%+
- **Code Duplication**: Eliminate duplicate bonus structures
- **Maintainability**: Single source of truth for shared types
- **Developer Experience**: Better IDE autocomplete, fewer runtime errors
- **Test Coverage**: Maintain 100% test coverage through refactoring

## Risks & Mitigation

**Risk**: Breaking changes during refactoring
- **Mitigation**: Incremental migration, comprehensive tests, feature flags

**Risk**: Performance impact from type conversions
- **Mitigation**: Benchmark before/after, optimize hot paths

**Risk**: Scope creep
- **Mitigation**: Strict prioritization, phase-based approach

## Conclusion

The v5 package is functionally complete but would benefit significantly from structural improvements. The recommended changes will improve type safety, reduce duplication, and make the codebase more maintainable. The phased approach allows for incremental improvements without disrupting existing functionality.

