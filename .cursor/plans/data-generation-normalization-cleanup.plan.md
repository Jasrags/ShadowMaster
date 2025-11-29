# Data Generation, Normalization, and Cleanup Prompt

Use this prompt to guide data generation, normalization, and cleanup work across data sets in the ShadowMaster project.

## Context

This document covers three main areas of data management:
1. **Data Generation**: Creating and updating Go data files from JSON/XML source data
2. **Normalization**: Ensuring consistent data formats, structures, and patterns across data sets
3. **Cleanup**: Improving code quality, type safety, and maintainability (including type safety refactoring)

All three areas work together to maintain high-quality, consistent, and type-safe data structures throughout the project.

### Source Data Types

The project uses two primary source data formats:
- **JSON files** (`data/chummer/*.json`): Legacy format, no schema definition
- **XML files with XSD schemas** (`data/chummerxml/*.xml` and `*.xsd`): Schema-defined format

**Key Principle**: When XSD schemas are available, use them as the primary guide for struct creation. When no XSD exists, examine the data and derive structs with a **bias against using `interface{}`** - prefer concrete types even if it requires handling edge cases.

## Process Overview

### Data Generation Workflow

1. **Source Data Analysis**
   - **If XSD schema exists** (e.g., `data/chummerxml/*.xsd`):
     - Use the XSD schema as the primary guide for struct creation
     - XSD defines element types, cardinality (required/optional, min/max occurrences), and data types
     - Map XSD types to Go types (e.g., `xs:string` → `string`, `xs:int` → `int`, `xs:boolean` → `bool`)
     - Use XSD cardinality to determine if fields should be pointers (optional) or slices (multiple occurrences)
   - **If no XSD schema exists**:
     - Examine JSON/XML source files to understand data structures
     - Identify data patterns, types, and variations
     - **Bias against using `interface{}`**: Prefer concrete types even if it requires examining multiple examples
     - Document field usage and examples
   - For both approaches: Validate struct definitions against actual data to ensure accuracy

2. **Struct Definition**
   - **When XSD is available**:
     - Follow XSD element definitions closely for field names and types
     - Use XSD `minOccurs="0"` to determine if fields should be pointers (optional) or required
     - Use XSD `maxOccurs="unbounded"` or `maxOccurs > 1` to determine if fields should be slices
     - Map XSD complex types to Go structs
     - Add both XML and JSON tags for compatibility (e.g., `xml:"fieldname" json:"fieldname"`)
   - **When no XSD is available**:
     - Examine actual data to derive struct definitions
     - **Avoid `interface{}`**: Prefer concrete types based on observed data patterns
     - If a field can be multiple types, create a union type or use the most common type with proper handling
     - Only use `interface{}` as a last resort when types are truly unknown or highly variable
   - Add JSON/XML tags and comments documenting data types
   - Use `common` package for shared types across editions

3. **Generation Script Development/Updates**
   - Create or update Python/Go scripts to generate data files
   - Handle edge cases, null values, and type conversions
   - Ensure scripts output idiomatic Go code

4. **Data File Generation**
   - Run generation scripts to create `*_data.go` files
   - Review generated output for correctness
   - Verify all data is properly converted

### Normalization Workflow

1. **Pattern Identification**
   - Review data files to identify inconsistencies
   - Find redundant type annotations, formatting issues
   - Identify fields that should use consistent types

2. **Standardization Rules**
   - Define patterns to follow (e.g., slice types, pointer usage)
   - Document normalization rules in this file
   - Update generation scripts to enforce rules

3. **Apply Normalization**
   - Fix redundant composite literal types
   - Standardize boolean field usage (`bool` vs `*bool`)
   - Normalize array/slice handling
   - Clean up formatting and naming

### Cleanup Workflow

1. **Documentation** - Document all fields with JSON data types
   - Add comments to ALL fields showing JSON data type and examples
   - Document `interface{}` fields with actual usage patterns
   - Note when fields can be null or have mixed types

2. **Type Safety Refactoring**
   - **If XSD exists**: Review XSD schema to see if `interface{}` fields can be replaced with XSD-defined types
   - **If no XSD**: Identify `interface{}` fields that can be typed by examining actual data
   - Examine JSON/XML data to understand actual data structures and patterns
   - **Bias against `interface{}`**: Prefer concrete types even if it requires handling edge cases
   - Define new struct types in the `common` package if needed for shared types
   - Update Go struct definitions to use concrete types
   - Regenerate or update data files to match new types

3. **Code Quality**
   - Remove redundant code and patterns
   - Fix linter warnings and style issues
   - Improve code organization and maintainability

4. **Verification**
   - Verify compilation
   - Run tests
   - Check linter
   - Update this document to reflect progress

## Data Generation Best Practices

### Struct Definition Strategy

**Priority: Use XSD when available, avoid `interface{}` when not**

1. **XSD-Based Struct Creation** (Preferred when XSD exists)
   - Parse XSD schema to understand element structure, types, and cardinality
   - Map XSD types directly to Go types:
     - `xs:string` → `string`
     - `xs:int`, `xs:integer` → `int`
     - `xs:boolean` → `bool`
     - `xs:decimal`, `xs:double`, `xs:float` → `float64`
   - Use XSD cardinality for field design:
     - `minOccurs="0"` → pointer type (`*Type`) or omit if truly optional
     - `maxOccurs="unbounded"` or `maxOccurs > 1` → slice type (`[]Type`)
     - `minOccurs="1"` and `maxOccurs="1"` → required field (non-pointer)
   - Generate structs with both XML and JSON tags for dual compatibility
   - Example: `books.xsd` → `books.go` with proper type mapping

2. **Data-Driven Struct Creation** (When no XSD)
   - Examine multiple examples from the data file to understand patterns
   - **Bias against `interface{}`**: Always prefer concrete types
   - If a field appears as different types, analyze frequency:
     - If 90%+ are one type, use that type and handle edge cases
     - If truly mixed, consider union types or wrapper structs
   - Use observed patterns to determine:
     - Single value → direct type or pointer if optional
     - Multiple values → slice type
     - Object → struct type
   - Only use `interface{}` when:
     - Types are genuinely unknown or highly variable
     - After attempting concrete types proves too restrictive
     - Document why `interface{}` is necessary

### Script Development

1. **Use Python or Go** for generation scripts
   - Python is good for JSON/XML parsing, XSD parsing, and complex transformations
   - Go scripts can be compiled and distributed with the project
   - Choose based on complexity and team familiarity
   - For XSD-based generation, Python's `xml.etree.ElementTree` or `lxml` work well

2. **Output Idiomatic Go**
   - Use proper Go formatting (gofmt-compatible)
   - Include type declarations where needed
   - Add appropriate comments for complex structures
   - Follow Go naming conventions

3. **Handle Edge Cases**
   - Null/empty values → `nil` for pointers, empty slices for arrays
   - Missing fields → omit from struct initialization
   - Mixed types → document and handle appropriately
   - Special JSON attributes (e.g., `+content`, `+@group`)

4. **Code Quality in Generated Files**
   - Remove redundant type annotations in slice literals
   - Use plain `bool` instead of `*bool` where appropriate
   - Avoid patterns like `&[]bool{true}[0]`
   - Ensure proper indentation and formatting

### Normalization Standards

When generating or normalizing data files, enforce these standards:

1. **Slice Literals**: Remove redundant type annotations
   - ❌ `[]Type{Type{...}, Type{...}}`
   - ✅ `[]Type{{...}, {...}}`

2. **Boolean Fields**: Prefer plain `bool` over `*bool`
   - ❌ `Field: &[]bool{true}[0]`
   - ✅ `Field: true`

3. **Pointer Fields**: Use `nil` for empty/missing values
   - ❌ `Field: &Type{...}` (empty struct)
   - ✅ `Field: nil` (if field is omitted)

4. **Array Handling**: Always use slices, even for single values
   - Wrap single values in slices when the field is `[]Type`

## Type Safety Refactoring

### Incremental Approach (Preferred)

**Always use an incremental approach when converting `interface{}` fields:**

1. **Start with simplest fields first** (single pointers, plain strings, etc.)
2. **Convert one or two fields at a time** to establish patterns
3. **Test after each small batch** to catch issues early
4. **Defer complex conversions** (arrays, mixed types) until after simpler ones are done
5. **Revert if needed** - if a conversion becomes too complex, revert and try a different approach
6. **Build confidence** - successful simple conversions help establish patterns for complex ones

**Why incremental?**
- Easier to debug and fix issues
- Maintains code compilability
- Reduces risk of breaking large data files
- Establishes patterns that can be reused
- Allows for course correction early

## Key Patterns to Look For

### Single Value → Pointer
- JSON: `"field": "value"` or `"field": {...}`
- Go: `Field *Type` (use `nil` for empty/missing)

### Array of Values → Slice
- JSON: `"field": ["value1", "value2"]` or `"field": ["value1"]` or `"field": "value1"`
- Go: `Field []Type` (always a slice, wrap single values)

### Boolean Pointers → Plain Boolean
- JSON: `"field": true` or `"field": false`
- Go: `Field bool` (default to `false`, not `*bool`)

### Mixed Types → Extract Content
- JSON: `"field": [...]` containing strings and objects
- Go: Extract relevant data (e.g., `Content` from `ModNameEntry`) and flatten to `[]string`

## Specific Transformations We've Done

### 1. Qualities (`pkg/shadowrun/edition/v5/qualities.go`)
- `LimitModifier`: `interface{}` → `*common.LimitModifier`
- `SkillCategory`: `interface{}` → `*BiowareSkillCategoryBonus`
- `ConditionMonitor`: `interface{}` → `*common.ConditionMonitorBonus`
- `Initiative`: `interface{}` → `*common.InitiativeBonus`
- `SpecificAttribute`: `interface{}` → `[]*common.SpecificAttributeBonus`
- `ArmorBonus.Group`: Removed redundant field (always "0")
- Note: Some fields remain `interface{}` due to genuinely mixed usage patterns

### 2. Armor (`pkg/shadowrun/edition/v5/armor.go`)
- `Bonus.LimitModifier`: `interface{}` → `[]LimitModifier`
- `Bonus.SkillCategory`: `interface{}` → `[]SkillCategoryBonus`
- `Bonus.SpecificSkill`: `interface{}` → `[]SpecificSkillBonus`
- `Mods.Name`: `interface{}` → `[]string` (extract from strings and `ModNameEntry.Content`)
- `ArmorMod.Hide`: `*bool` → `bool`
- `Bonus.*Immune` fields: `*bool` → `bool`
- `Bonus.SelectArmor`: `*bool` → `bool`
- `Bonus.SelectText`: `*bool` → `bool`

### 3. Gear (`pkg/shadowrun/edition/v5/gear.go`)
- `SelectTradition`: `interface{}` → `[]string`
- `SelectRestricted`: `interface{}` → `[]string`
- `SelectWeapon`: `interface{}` → `*common.WeaponDetails`
- `SelectPowers`: `interface{}` → `*common.SelectPowersBonus`
- `SpellCategory`: `interface{}` → `*common.SpellCategoryBonus`
- `SmartLink`: `interface{}` → `string`
- `WeaponSpecificDice`: `interface{}` → `*common.WeaponSpecificDiceBonus`

## Data File Updates

### Manual Updates
- Convert single values to slices when needed
- Replace `&[]bool{true}[0]` with `true`
- Replace empty strings with `nil` for pointer types
- Add `common.` prefix for types from common package
- Fix redundant type annotations in slice literals

### Regeneration (Preferred)
- Update generation scripts to output correct types
- Use scripts for large-scale transformations
- Verify output before replacing files

## Generation Script Guidelines

When creating or updating generation scripts:

### Type Handling
1. **Slices**: Always output slices for array fields (wrap single values when needed)
2. **Booleans**: Use plain `bool` instead of `*bool` (avoid `&[]bool{true}[0]`)
3. **Pointers**: Use `nil` for empty/missing pointer fields
4. **Naming**: Capitalize field names correctly (`Limit`, `Value`, not `limit`, `value`)

### Code Quality
1. **Redundant Types**: Don't include redundant type annotations in slice literals
   - Output: `[]Type{{...}, {...}}` not `[]Type{Type{...}, Type{...}}`
2. **Formatting**: Ensure output is gofmt-compatible
3. **Type Declarations**: Include type declarations for composite literals (`&Mods{` not `Mods{`)

### Data Extraction
1. **XSD-Based Extraction** (when XSD available):
   - Parse XSD to understand element structure and types
   - Use XSD type definitions to guide data extraction
   - Handle XSD optional elements as pointers or omit if not present
   - Handle XSD repeating elements as slices
2. **Data-Driven Extraction** (when no XSD):
   - **Bias against interface{}**: Extract concrete types based on observed patterns
   - Prefer the most common type if variations exist
3. **Flattening**: Extract `Content` from nested objects when flattening to strings
4. **Special Attributes**: Handle XML/JSON attributes (e.g., `+content`, `+@group`) correctly
5. **Null Handling**: Convert `null` to `nil` for pointers, omit for omitted fields

### Pattern Examples

**Good Output:**
```go
SpecificSkill: []common.SpecificSkillBonus{{
    Name: "Sneaking", Bonus: 2,
}, {
    Name: "Running", Bonus: 2,
}}

Ambidextrous: true,
```

**Bad Output:**
```go
SpecificSkill: []common.SpecificSkillBonus{common.SpecificSkillBonus{
    Name: "Sneaking", Bonus: 2,
}, common.SpecificSkillBonus{
    Name: "Running", Bonus: 2,
}}

Ambidextrous: &[]bool{true}[0],
```

## Verification and Quality Checklist

After any data generation, normalization, or cleanup work:

### Compilation and Testing
- [ ] **Compile**: `go build ./pkg/shadowrun/edition/v5/...`
- [ ] **Run tests**: `go test ./pkg/shadowrun/edition/v5/...`
- [ ] **Check linter**: Fix any style issues reported by linter

### Code Quality
- [ ] **No redundant types**: Slice literals don't repeat element types
- [ ] **Boolean usage**: Plain `bool` used instead of `*bool` where appropriate
- [ ] **Proper formatting**: Code follows gofmt standards
- [ ] **Nil handling**: Empty pointer fields use `nil`, not empty structs

### Documentation
- [ ] **Field comments**: All fields have JSON data type comments
- [ ] **Examples included**: Comments show example values from JSON
- [ ] **Null/mixed types**: Comments note when fields can be null or mixed types
- [ ] **Interface{} documented**: `interface{}` fields document actual usage patterns

### Data Accuracy
- [ ] **Types match JSON**: Go types accurately reflect JSON data patterns
- [ ] **All data converted**: All JSON entries properly converted to Go
- [ ] **No data loss**: No information lost in conversion process

### Progress Tracking
- [ ] **Update this document**: Reflect completed work and remaining tasks
- [ ] **Note patterns**: Document any new patterns or approaches learned
- [ ] **Update scripts**: Ensure generation scripts match current standards

## Documentation Standards

**Before any cleanup or type conversion, document all fields with JSON data patterns:**

For each data set, add comments to ALL fields (not just `interface{}` fields) showing:
- JSON data type (string, boolean, object, array, null, etc.)
- Example values from the actual JSON file
- Brief context about the field's purpose

**Example format:**
```go
Name     string `json:"name"`     // JSON: string (e.g., "Ambidextrous", "Analytical Mind")
Karma    string `json:"karma"`    // JSON: string (e.g., "4", "5", "-7") - can be negative for negative qualities
Mutant   string `json:"mutant,omitempty"` // JSON: string (e.g., "True") or null - mutant flag
```

**Why document?**
- Helps understand actual data patterns before making type decisions
- Makes it clear which fields can be safely converted
- Provides examples for future reference
- Helps identify fields that should remain `interface{}` due to mixed types
- Enables better code generation scripts

**Process:**
1. Use `grep` to find field usage in JSON file using JSON tag names
2. Read examples from JSON to understand data patterns
3. Add concise comments showing type and examples
4. This documentation guides generation script updates, normalization, and type conversion decisions

## Example Prompts

### For Data Generation

```
I need to generate or regenerate the [WEAPONS/SPELLS/etc] data files in the ShadowMaster project.

Current situation:
- Source data: `data/chummer/[type].json` or `data/chummerxml/[type].xml`
- XSD schema: `data/chummerxml/[type].xsd` (if available)
- Struct definition: `pkg/shadowrun/edition/v5/[type].go`
- Target file: `pkg/shadowrun/edition/v5/[type]_data.go`
- Generation script: `scripts/generate_[type]_data.py` (if exists)

Please:
1. **Check for XSD**: If `data/chummerxml/[type].xsd` exists:
   - Use XSD schema as primary guide for struct creation
   - Map XSD types to Go types (xs:string → string, xs:int → int, etc.)
   - Use XSD cardinality (minOccurs/maxOccurs) to determine pointers vs slices
   - Add both XML and JSON tags for compatibility
2. **If no XSD, examine data**: Review source data to understand patterns
   - **Bias against interface{}**: Prefer concrete types based on observed patterns
   - Document field usage and examples
3. **Document the struct**: Add comments to ALL fields showing data types and examples
4. **Create/update generation script**: Ensure script handles:
   - All field types correctly (prefer concrete types over interface{})
   - Null/empty values properly
   - Redundant type annotations removal
   - Proper Go formatting
   - XSD parsing if XSD is available
5. **Generate data file**: Run script and verify output
6. **Normalize output**: Fix any normalization issues (redundant types, formatting)
7. **Verify**: Ensure code compiles and tests pass
8. **Update this document**: Note completion and any patterns learned
```

### For Type Safety Cleanup

```
I need to refactor the [WEAPONS/SPELLS/etc] data structures in the ShadowMaster project to improve type safety.

Current situation:
- File: `pkg/shadowrun/edition/v5/[type].go` contains structs with `interface{}` fields
- File: `pkg/shadowrun/edition/v5/[type]_data.go` contains the data
- Source data: `data/chummer/[type].json` or `data/chummerxml/[type].xml`
- XSD schema: `data/chummerxml/[type].xsd` (if available)

Please:
1. **Check for XSD**: If XSD exists, review it to see if `interface{}` fields can be replaced with XSD-defined types
2. **Document fields** (if not done): Add comments to ALL fields showing data types and examples
3. **Examine `interface{}` fields**: Identify which can be typed
4. **Check source data**: Understand actual data structures and patterns
   - **Bias against interface{}**: Prefer concrete types even if it requires handling edge cases
5. **Convert `interface{}` fields**: Use incremental approach:
   - Single values → pointer types (use `nil` for empty)
   - Arrays or potentially arrays → slices
   - Booleans → plain `bool` (not `*bool`)
   - Use XSD types if XSD is available
6. **Update struct definitions**: Change field types (avoid interface{} when possible)
7. **Update/regenerate data file**: Match new types (update script if needed)
8. **Normalize**: Fix redundant types, formatting issues
9. **Verify**: Compile, test, check linter
10. **Update this document**: Mark progress and remaining work

Follow the same patterns we used for qualities, armor, and gear.
```

### For Normalization

```
I need to normalize the [WEAPONS/SPELLS/etc] data files in the ShadowMaster project.

Current situation:
- Data file: `pkg/shadowrun/edition/v5/[type]_data.go`
- May have redundant type annotations, formatting issues, or inconsistencies

Please:
1. **Identify issues**: Check for redundant composite literal types, formatting problems
2. **Apply normalization standards**:
   - Remove redundant type annotations: `[]Type{Type{...}}` → `[]Type{{...}}`
   - Fix boolean patterns: `&[]bool{true}[0]` → `true`
   - Normalize empty values: Use `nil` for pointers, empty slices for arrays
3. **Update generation script** (if exists): Ensure it outputs normalized code
4. **Verify**: Ensure code still compiles and tests pass
5. **Update this document**: Note normalization patterns applied
```

## Common Issues and Solutions

### Generation Issues

**Issue: Unclosed braces in generated files**
- **Solution**: Regenerate the entire file using the updated script rather than manual fixes
- **Prevention**: Test script output formatting before large-scale generation

**Issue: Field name capitalization**
- **Solution**: Ensure generation script uses proper Go naming (capitalize exported fields)
- **Prevention**: Validate field names match struct definitions

**Issue: Incorrect type handling**
- **Solution**: Review JSON patterns first, then update script type conversion logic
- **Prevention**: Document field types before generation

### Normalization Issues

**Issue: Redundant type annotations**
- **Solution**: Remove type names inside slice literals: `[]*Type{&Type{...}}` → `[]*Type{{...}}`
- **Prevention**: Update generation script to not output redundant types

**Issue: Boolean pointer syntax**
- **Solution**: Replace `&[]bool{true}[0]` with `true` in data files
- **Prevention**: Update generation script to output plain `bool`

**Issue: Inconsistent empty value handling**
- **Solution**: Standardize to `nil` for pointers, empty slices for arrays
- **Prevention**: Define normalization rules in generation script

### Type Conversion Issues

**Issue: Mixed type arrays**
- **Solution**: Extract the relevant data (usually `Content` field) and flatten to strings
- **Alternative**: Keep as `interface{}` if truly mixed, but document thoroughly

**Issue: Type mismatch after conversion**
- **Solution**: Verify JSON patterns match Go types, regenerate if needed
- **Prevention**: Document all fields before conversion, test incrementally

**Issue: Compilation errors after changes**
- **Solution**: Fix type mismatches, ensure all fields match struct definitions
- **Prevention**: Test compilation after each small batch of changes

## Work Completed

### Data Generation
- ✅ **Qualities**: Generation script exists (`scripts/generate_qualities_data.py`)
- ✅ **Multiple data sets**: Generation scripts created for various data types
- 🔄 **Script improvements**: Ongoing updates to ensure normalized output

### Normalization
- ✅ **Redundant types**: Fixed redundant composite literal types across data files (64 instances fixed in qualities_data.go)
- ✅ **Boolean fields**: Standardized boolean usage (removed `*bool` patterns)
- ✅ **Slice literals**: Normalized to remove redundant type annotations (e.g., `[]Type{Type{...}}` → `[]Type{{...}}`)
- ✅ **ArmorBonus.Group**: Removed redundant `Group` field (always "0") - removed from struct and all usages

### Type Safety Cleanup
## Current Progress

### ✅ Completed (100%)
1. **Armor** (`pkg/shadowrun/edition/v5/armor.go`)
   - All `interface{}` fields converted to concrete types
   - `Mods.Name`: `interface{}` → `[]string`
   - `Bonus.LimitModifier`: `interface{}` → `[]LimitModifier`
   - `Bonus.SkillCategory`: `interface{}` → `[]SkillCategoryBonus`
   - `Bonus.SpecificSkill`: `interface{}` → `[]SpecificSkillBonus`
   - All boolean fields: `*bool` → `bool`
   - Status: **Complete** - 0 `interface{}` fields remaining

### ✅ Mostly Complete (~99%)
2. **Gear** (`pkg/shadowrun/edition/v5/gear.go`)
   - Core fields converted to concrete types
   - `SelectTradition`: `interface{}` → `[]string`
   - `SelectRestricted`: `interface{}` → `[]string`
   - `SelectWeapon`, `SelectPowers`, `SpellCategory`, etc.: converted
   - `AddonCategory`: `interface{}` → `[]string` (converted single strings to slices)
   - Remaining: 1 `interface{}` field:
     - `GearDetails`: Intentionally complex (documented - can be `*GearDetailsRequirement` for simple cases or `map[string]interface{}` for complex attribute-based requirements)
   - Status: **~99% complete** - 1 `interface{}` field remaining (intentionally mixed types)

### 🟡 Partially Complete (~35%)
3. **Qualities** (`pkg/shadowrun/edition/v5/qualities.go`)
   - ✅ **Documentation Complete**: All fields now have JSON data type comments with examples
   - Core bonus fields converted:
     - `LimitModifier`: `interface{}` → `*common.LimitModifier`
     - `ConditionMonitor`: `interface{}` → `*common.ConditionMonitorBonus`
     - `Initiative`: `interface{}` → `*common.InitiativeBonus`
     - `InitiativePass`: `interface{}` → `*common.InitiativePassBonus`
   - Simple fields (Batch 2 - COMPLETED):
     - `ActionDicePool`: `interface{}` → `*ActionDicePool` (pointer)
     - `SelectText`: `interface{}` → `*common.SelectTextBonus` (104 instances: 95 pointers, 9 nil)
     - `SelectExpertise`: `interface{}` → `string` (simple string field)
   - Type conversions (Batch 3 - COMPLETED):
     - `SpecificAttribute`: `interface{}` → `[]*common.SpecificAttributeBonus`
     - `ArmorBonus.Group`: Removed redundant field (always "0")
   - Remaining: ~58 `interface{}` fields (many documented as intentionally mixed/complex)
   - Status: **~36% complete** - Using incremental approach, converting simple fields first
   - Next: Continue with more simple fields (strings, single pointers) before tackling arrays

## Remaining Data Sets to Process

Based on analysis, there are approximately **181 `interface{}` fields** remaining across **30 files**. Here are the data sets that need cleanup:

### High Priority (Similar to armor/gear)
1. **Weapons** (`weapons.go`) - 5 `interface{}` fields
2. **Cyberware** (`cyberware.go`) - 13 `interface{}` fields
3. **Bioware** (`bioware.go`) - 1 `interface{}` field
4. **Vehicles** (`vehicles.go`) - 6 `interface{}` fields
5. **Vessels** (`vessels.go`) - 1 `interface{}` field

### Medium Priority
6. **Spells** (`spells.go`) - 2 `interface{}` fields
7. **Powers** (`powers.go`) - 6 `interface{}` fields
8. **Critters** (`critters.go`) - 3 `interface{}` fields
9. **CritterPowers** (`critterpowers.go`) - 1 `interface{}` field
10. **Traditions** (if applicable) - check file

### Lower Priority (Complex/Mixed)
11. **Tips** (`tips.go`) - 5 `interface{}` fields
12. **Streams** (`streams.go`) - 4 `interface{}` fields
13. **Settings** (`settings.go`) - 4 `interface{}` fields
14. **Priorities** (`priorities.go`) - 6 `interface{}` fields
15. **Paragons** (`paragons.go`) - 4 `interface{}` fields
16. **Packs** (`packs.go`) - 5 `interface{}` fields
17. **Metatypes** (`metatypes.go`) - 5 `interface{}` fields
18. **Metamagic** (`metamagic.go`) - 6 `interface{}` fields
19. **Mentors** (`mentors.go`) - 4 `interface{}` fields
20. **MartialArts** (`martialarts.go`) - 2 `interface{}` fields
21. **Lifestyles** (`lifestyles.go`) - 1 `interface{}` field
22. **LifeModules** (`lifemodules.go`) - 9 `interface{}` fields
23. **Improvements** (`improvements.go`) - 1 `interface{}` field
24. **Echoes** (`echoes.go`) - 5 `interface{}` fields
25. **DrugComponents** (`drugcomponents.go`) - 8 `interface{}` fields
26. **Books** (`books.go`) - 1 `interface{}` field

### Common Package
27. **common/bonuses.go** - 3 `interface{}` fields (may need shared type definitions)
28. **common/base_bonus.go** - 6 `interface{}` fields
29. **common/requirements.go** - 1 `interface{}` field
30. **common/wrappers.go** - check for `interface{}` usage

## Recommended Order

1. **Finish Gear cleanup**: Convert remaining 1 field (GearDetails intentionally complex)
2. **Continue Qualities cleanup**: Using incremental approach:
   - ✅ **Batch 2 Complete**: Simple pointer fields (ActionDicePool, SelectText)
   - 🔄 **In Progress**: Continue with simple fields (strings, single pointers)
   - ⏳ **Deferred**: Complex fields (arrays, mixed types) until patterns are established
3. **High-priority similar structures**:
   - Weapons (similar to armor/gear patterns)
   - Cyberware (may share patterns with bioware)
   - Bioware (small, good starting point)
4. **Medium priority**: Spells, Powers, Vehicles
5. **Lower priority**: Complex structures with mixed types

## Incremental Conversion Strategy

**For Qualities and other complex data sets:**

1. **Phase 1: Simple Fields** (Start here)
   - Single pointer types (e.g., `*ActionDicePool`, `*common.SelectTextBonus`)
   - Plain strings (e.g., `SelectExpertise: ""`)
   - Simple booleans

2. **Phase 2: Simple Arrays** (After Phase 1)
   - String slices that are consistently arrays
   - Single-value fields that should be arrays

3. **Phase 3: Complex Fields** (After Phases 1-2)
   - Mixed type arrays
   - Fields with conditional types
   - Fields requiring custom extraction logic

**Benefits:**
- Each phase builds on previous work
- Compiles and tests pass after each phase
- Patterns established early help with complex cases

## Best Practices Summary

### Data Generation
- **Use XSD when available**: Parse XSD schemas to guide struct creation, type mapping, and cardinality
- **Bias against interface{}**: When no XSD exists, examine data and prefer concrete types
- Always document field types before generation
- Use generation scripts for large data files
- Output normalized, idiomatic Go code
- Test script output before large-scale generation

### Normalization
- Apply standards consistently across all data files
- Update generation scripts to prevent future issues
- Fix issues as they're found, don't let them accumulate

### Type Safety
- Use incremental approach - convert simple fields first
- Document `interface{}` fields thoroughly if they must remain
- Use `common` package for shared types across editions
- Test compilation after each batch of changes

### General
- Keep some fields as `interface{}` if they truly have mixed/unknown types
- Document decisions and patterns in this file
- Prefer regeneration over manual fixes for consistency
- Test thoroughly after each set of changes
- Update this document to track progress and patterns learned

