# Data Cleanup Prompt for Type Safety Refactoring

Use this prompt to continue type safety improvements across other data sets in the ShadowMaster project.

## Context

We're refactoring Go structs to improve type safety by replacing `interface{}` fields with concrete types or slices of concrete types, based on the data patterns observed in corresponding JSON files.

## Process Overview

1. **Identify `interface{}` fields** in Go structs that should be typed
2. **Examine JSON data** to understand actual data structures
3. **Define new struct types** in the `common` package if needed
4. **Update Go struct definitions** to use concrete types
5. **Regenerate or update data files** (`*_data.go`) to match new struct definitions
6. **Verify compilation** and fix any issues
7. **Run tests** to ensure correctness
8. **Update `DATA_CLEANUP_PROMPT.md`** to reflect completed progress

## Incremental Approach (Preferred)

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

## Script Generation Tips

When updating generation scripts:
1. Always output slices for array fields (wrap single values)
2. Use plain `bool` instead of `*bool` (or `&[]bool{true}[0]`)
3. Capitalize field names correctly (`Limit`, `Value`, not `limit`, `value`)
4. Extract `Content` from nested objects when flattening
5. Include type declarations in composite literals (`&Mods{` not `Mods{`)

## Verification Steps

After making changes:
1. **Compile**: `go build ./pkg/shadowrun/edition/v5/...`
2. **Run tests**: `go test ./pkg/shadowrun/edition/v5/...`
3. **Check linter**: Fix any style issues
4. **Review changes**: Ensure types match actual JSON data patterns
5. **Update progress**: Update `DATA_CLEANUP_PROMPT.md` to reflect completed work and remaining tasks

## Example Prompt for Next Data Set

```
I need to refactor the [WEAPONS/SPELLS/etc] data structures in the ShadowMaster project to improve type safety.

Current situation:
- File: `pkg/shadowrun/edition/v5/[type].go` contains structs with `interface{}` fields
- File: `pkg/shadowrun/edition/v5/[type]_data.go` contains the data
- JSON source: `data/chummer/[type].json`

Please:
1. Examine the `interface{}` fields in `[type].go` (lines X-Y)
2. Check the corresponding JSON data to understand actual data structures
3. Convert `interface{}` fields to concrete types or slices:
   - Single values → pointer types (use `nil` for empty)
   - Arrays or potentially arrays → slices
   - Booleans → plain `bool` (not `*bool`)
4. Update the struct definitions
5. Update the data file to match new types
6. Ensure the code compiles and tests pass
7. Update `DATA_CLEANUP_PROMPT.md` to reflect completed progress (mark data set as complete/partial, update remaining fields count)

Follow the same patterns we used for qualities, armor, and gear.
```

## Common Issues and Solutions

### Issue: Unclosed braces in generated files
**Solution**: Regenerate the entire file using the updated script rather than manual fixes

### Issue: Field name capitalization
**Solution**: Ensure generation script uses proper Go naming (capitalize exported fields)

### Issue: Mixed type arrays
**Solution**: Extract the relevant data (usually `Content` field) and flatten to strings

### Issue: Boolean pointer syntax
**Solution**: Replace `&[]bool{true}[0]` with `true` in data files

### Issue: Redundant type annotations
**Solution**: Remove type names inside slice literals: `[]*Type{&Type{...}}` → `[]*Type{{...}}`

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
   - Core bonus fields converted:
     - `LimitModifier`: `interface{}` → `*common.LimitModifier`
     - `ConditionMonitor`: `interface{}` → `*common.ConditionMonitorBonus`
     - `Initiative`: `interface{}` → `*common.InitiativeBonus`
     - `InitiativePass`: `interface{}` → `*common.InitiativePassBonus`
   - Simple fields (Batch 2 - COMPLETED):
     - `ActionDicePool`: `interface{}` → `*ActionDicePool` (pointer)
     - `SelectText`: `interface{}` → `*common.SelectTextBonus` (104 instances: 95 pointers, 9 nil)
     - `SelectExpertise`: `interface{}` → `string` (simple string field)
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

## Notes

- Keep some fields as `interface{}` if they truly have mixed/unknown types
- Document why fields remain `interface{}` with comments
- Use the `common` package for shared types across editions
- Prefer regeneration scripts for large data files
- Test thoroughly after each set of changes

