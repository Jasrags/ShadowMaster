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

## Notes

- Keep some fields as `interface{}` if they truly have mixed/unknown types
- Document why fields remain `interface{}` with comments
- Use the `common` package for shared types across editions
- Prefer regeneration scripts for large data files
- Test thoroughly after each set of changes

