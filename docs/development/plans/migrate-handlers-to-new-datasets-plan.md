# Migrate Handlers to Use New Dataset Functions

**Status**: ✅ Phase 1 Complete, Phase 2 Pending Data Files  
**Created**: 2024  
**Last Updated**: 2024

## Overview
Migrate existing API handlers from direct package-level variables (e.g., `sr5.DataBooks`) to the new dataset getter functions (e.g., `sr5.GetAllBooks()`) that were created during the data migration.

## Current Status

### ✅ Completed Migrations

1. **Books** (Simplest)
   - **Handler**: `GetBooks` at line 587
   - **Status**: ✅ Complete
   - **Implementation**: Uses `sr5.GetAllBooks()` helper function
   - **File**: `internal/api/handlers.go:587-593`

2. **Skills**
   - **Handler**: `GetSkills` at line 499
   - **Status**: ✅ Complete
   - **Implementation**: Uses `sr5.GetSkillsData()` and merges both Skills and KnowledgeSkills arrays
   - **File**: `internal/api/handlers.go:499-517`

3. **Weapons**
   - **Handler**: `GetWeapons` at line 520
   - **Status**: ✅ Complete
   - **Implementation**: Uses `sr5.GetWeaponsData()` and extracts weapons from Weapons groups
   - **File**: `internal/api/handlers.go:520-533`

4. **Armor**
   - **Handler**: `GetArmor` at line 536
   - **Status**: ✅ Complete
   - **Implementation**: Uses `sr5.GetAllArmor()` helper function
   - **File**: `internal/api/handlers.go:536-542`

### 🔄 Placeholder Implementations (Waiting for Data Files)

5. **Lifestyles**
   - **Handler**: `GetLifestyles` at line 596
   - **Status**: ⏳ Placeholder (returns empty array)
   - **Blocking**: `lifestyles.xml` data file not yet generated
   - **Structure**: `LifestylesChummer.Lifestyles.Lifestyle` contains `[]LifestyleItem`
   - **Ready Code**: TODO comments include implementation to uncomment once data file exists
   - **File**: `internal/api/handlers.go:596-609`

6. **Qualities**
   - **Handler**: `GetQualities` at line 570
   - **Status**: ⏳ Placeholder (returns empty array)
   - **Blocking**: `qualities_data.go` file not yet generated due to XML parsing error
   - **Structure**: `QualitiesChummer.Qualities` contains `[]QualityItems`, each with `[]QualityItem`
   - **Ready Code**: TODO comments include implementation to uncomment once data file exists
   - **File**: `internal/api/handlers.go:570-584`
   - **Generator Tool**: `cmd/tools/generate-qualities-data/main.go` exists and is ready
   - **XML File**: `data/chummerxml/qualities.xml` exists
   - **Error**: `strconv.ParseBool: parsing "10": invalid syntax` - The `AddQuality.ContributeToBP` field is defined as `*bool` but the XML contains a value "10" which cannot be parsed as a boolean. This field needs to be either:
     - Fixed in the XML (change "10" to "True" or "False")
     - Or the struct field type needs to be changed to handle numeric strings (e.g., use `*string` or custom unmarshaller)

7. **Gears**
   - **Handler**: `GetGears` at line 553
   - **Status**: ⏳ Placeholder (returns empty array)
   - **Blocking**: `gear.xml` data file not yet generated (XML parsing errors need resolution)
   - **Structure**: `GearsChummer.Gears` contains `[]common.Gears`, each with `[]Gear`
   - **Ready Code**: TODO comments include implementation to uncomment once data file exists
   - **File**: `internal/api/handlers.go:553-567`
   - **Note**: According to `docs/analysis/xml-data-batch-plan.md`, gear.xml has parsing errors that need fixing

## Implementation Details

### Pattern Used

**For datasets with helper functions:**
```go
// Example: Books, Armor
data := sr5.GetAllBooks()  // or sr5.GetAllArmor()
respondJSON(w, http.StatusOK, map[string]interface{}{
    "books": data,
})
```

**For datasets with Get*Data() functions:**
```go
// Example: Skills, Weapons
data := sr5.GetSkillsData()
skillList := make([]sr5.Skill, 0)

for _, skillsGroup := range data.Skills {
    skillList = append(skillList, skillsGroup.Skill...)
}
// Merge multiple types if needed...

respondJSON(w, http.StatusOK, map[string]interface{}{
    "skills": skillList,
})
```

## Next Steps

### Immediate (Phase 2)

1. **Generate Lifestyles Data File**
   - Generate `pkg/shadowrun/edition/v5/lifestyles_data.go` from `lifestyles.xml`
   - Add `GetLifestylesData()` function returning `*LifestylesChummer`
   - Uncomment implementation in `GetLifestyles` handler
   - Test endpoint: `GET /api/equipment/lifestyles`

2. **Fix and Generate Qualities Data File**
   - Resolve XML parsing errors in `qualities.xml` (see `docs/analysis/xml-data-batch-plan.md`)
   - Generate `pkg/shadowrun/edition/v5/qualities_data.go` from `qualities.xml`
   - Add `GetQualitiesData()` function returning `*QualitiesChummer`
   - Uncomment implementation in `GetQualities` handler
   - Test endpoint: `GET /api/equipment/qualities`

3. **Fix and Generate Gears Data File**
   - Resolve XML parsing errors in `gear.xml` (see `docs/analysis/xml-data-batch-plan.md`)
   - Generate `pkg/shadowrun/edition/v5/gear_data.go` from `gear.xml`
   - Add `GetGearsData()` function returning `*GearsChummer`
   - Uncomment implementation in `GetGears` handler
   - Test endpoint: `GET /api/equipment/gear`

### Future Enhancements

- Consider adding helper functions (like `GetAllLifestyles()`, `GetAllQualities()`, `GetAllGears()`) for consistency
- Add filtering by enabled books from campaign settings
- Consider edition-aware endpoints (e.g., `/api/editions/{edition}/equipment/...`)
- Add pagination for large datasets

## Testing

Each handler should be tested to ensure:
- ✅ Returns correct data structure
- ✅ Maintains backward compatibility with frontend
- ✅ Response times are acceptable
- ✅ JSON structure matches expected format

## Related Documentation

- `docs/analysis/xml-data-batch-plan.md` - Details on XML data generation batch plan and status
- `internal/api/handlers.go` - Implementation file
- `pkg/shadowrun/edition/v5/` - Dataset structures and helper functions

## Notes

- All migrated handlers maintain the same JSON response format for backward compatibility
- The three placeholder handlers return empty arrays but are ready to activate once data files exist
- Type compatibility: Some handlers use slightly different types (e.g., `ArmorItem` vs old `Armor`, `LifestyleItem` vs old `Lifestyle`), but this should be transparent to the API consumers

