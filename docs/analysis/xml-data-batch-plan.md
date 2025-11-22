# XML Data Generation Batch Plan

This document outlines the batching strategy for generating `_data.go` files from XML data.

## 🎯 Current Status (Last Updated - End of Session)

**Overall: 35/54 files completed (64.8%) - 35 `_data.go` files generated**

### ✅ Completed Today
- **Critters.xml**: Fixed 4 fields in `BaseBonus` (`Reach`, `Biowareessmultiplier`, `Genetechessmultiplier`, `Genetechcostmultiplier`) and successfully generated `critters_data.go` (18 categories, 269 critters)
- **Qualities.xml (Partial)**: Fixed 5 fields in `BaseBonus`:
  - `Selecttext`: Changed from `[]bool` to `[]Selecttext` struct (with `xml`, `xpath`, `allowedit` attributes)
  - `Skillgroupcategorydisable`: Changed from `[]bool` to `[]string` (receives "Social Active")
  - `Publicawareness`: Changed from `[]bool` to `[]string` (receives numeric values like "2", "3", "5", "8")
  - `Prototypetranshuman`: Changed from `[]bool` to `[]string` (receives "1")
  - Previously fixed: `Notoriety`, `Martialart`, `Blockspelldescriptor`
- **Generated Files**: Updated all existing `_data.go` files to use `Selecttext: nil` instead of `[]bool{}` to match new struct type

### ⚠️ Current Blockers
1. **Qualities.xml**: Still has parsing error `strconv.ParseBool: parsing "10": invalid syntax`
   - Field receiving "10" not yet identified
   - Not found as element content in bonus sections
   - May be in nested structure or field we haven't checked yet
   - **Next**: Search for "10" in nested structures or check all remaining `[]bool` fields

2. **Gear.xml**: Has parsing error `strconv.ParseInt: parsing "[0]": invalid syntax`
   - Integer field receiving bracket notation like "[0]" or "[Rating]"
   - Likely `Capacity` or `Armorcapacity` in `common.Gear` or `common.UseGear` structs
   - **Next**: Check and change these fields from `*int` to `*string`

3. **Lifestyles.xml**: Generator exists but `lifestyles_data.go` not generated
   - Generator has unused import error (`"shadowmaster/pkg/shadowrun/edition/v5/common" imported and not used`)
   - **Next**: Fix import and run generator

4. **Other Parsing Errors** (from previous batches):
   - `mentors.xml` - "2" parsing error (Batch 3)
   - `cyberware.xml` - "2" parsing error (Batch 4)

### 📋 Next Steps (Priority Order)
1. **Fix Qualities.xml "10" error**: 
   - Search for "10" in nested structures (e.g., `Penaltyfreesustain`, `Skillcategory`)
   - Check all remaining `[]bool` fields in `BaseBonus` that might receive numeric values
   - Consider adding detailed error logging to pinpoint exact field

2. **Fix Gear.xml "[0]" error**:
   - Check `Capacity` and `Armorcapacity` fields in `common/gear.go`
   - Change from `*int` to `*string` if they receive bracket notation

3. **Generate Lifestyles.xml**:
   - Fix unused import in `cmd/tools/generate-lifestyles-data/main.go`
   - Run generator to create `lifestyles_data.go`

4. **Continue with remaining parsing errors**:
   - `mentors.xml` - "2" parsing error
   - `cyberware.xml` - "2" parsing error

### 📝 Key Files Modified Today
- `pkg/shadowrun/edition/v5/common/base_bonus.go` - Fixed 9 fields total (4 for critters, 5 for qualities)
- `pkg/shadowrun/edition/v5/common/bonuses.go` - Added `Selecttext` struct definition
- All `*_data.go` files - Updated `Selecttext` references from `[]bool{}` to `nil`
- `pkg/shadowrun/edition/v5/critters_data.go` - Generated successfully

---

## Progress Summary

**Overall: 35/54 files completed (64.8%) - 35 `_data.go` files generated**

### ✅ Completed Today
- **Critters.xml**: Fixed 4 fields in `BaseBonus` (`Reach`, `Biowareessmultiplier`, `Genetechessmultiplier`, `Genetechcostmultiplier`) and successfully generated `critters_data.go` (18 categories, 269 critters)
- **Qualities.xml (Partial)**: Fixed 5 fields in `BaseBonus`:
  - `Selecttext`: Changed from `[]bool` to `[]Selecttext` struct (with `xml`, `xpath`, `allowedit` attributes)
  - `Skillgroupcategorydisable`: Changed from `[]bool` to `[]string`
  - `Publicawareness`: Changed from `[]bool` to `[]string`
  - `Prototypetranshuman`: Changed from `[]bool` to `[]string`
  - Previously fixed: `Notoriety`, `Martialart`, `Blockspelldescriptor`
- **Generated Files**: Updated all existing `_data.go` files to use `Selecttext: nil` instead of `[]bool{}` to match new struct type

### ⚠️ Current Blockers
1. **Qualities.xml**: Still has parsing error `strconv.ParseBool: parsing "10": invalid syntax`
   - Field receiving "10" not yet identified
   - Not found as element content in bonus sections
   - May be in nested structure or field we haven't checked yet

2. **Gear.xml**: Has parsing error `strconv.ParseInt: parsing "[0]": invalid syntax`
   - Integer field receiving bracket notation like "[0]" or "[Rating]"
   - Likely `Capacity` or `Armorcapacity` in `common.Gear` or `common.UseGear` structs

3. **Lifestyles.xml**: Generator exists but `lifestyles_data.go` not generated
   - Generator has unused import error that needs fixing
   - Should be straightforward to generate once fixed

### 📋 Next Steps (Priority Order)
1. **Fix Qualities.xml "10" error**: 
   - Search for "10" in nested structures (e.g., `Penaltyfreesustain`, `Skillcategory`)
   - Check all remaining `[]bool` fields in `BaseBonus` that might receive numeric values
   - Consider adding detailed error logging to pinpoint exact field

2. **Fix Gear.xml "[0]" error**:
   - Check `Capacity` and `Armorcapacity` fields in `common/gear.go`
   - Change from `*int` to `*string` if they receive bracket notation

3. **Generate Lifestyles.xml**:
   - Fix unused import in generator
   - Run generator to create `lifestyles_data.go`

4. **Continue with remaining parsing errors**:
   - `mentors.xml` - "2" parsing error
   - `cyberware.xml` - "2" parsing error

### 📝 Key Files Modified Today
- `pkg/shadowrun/edition/v5/common/base_bonus.go` - Fixed 9 fields total (4 for critters, 5 for qualities)
- `pkg/shadowrun/edition/v5/common/bonuses.go` - Added `Selecttext` struct definition
- All `*_data.go` files - Updated `Selecttext` references from `[]bool{}` to `nil`
- `pkg/shadowrun/edition/v5/critters_data.go` - Generated successfully
- `docs/analysis/xml-data-batch-plan.md` - Updated documentation

---

## Progress Summary

**Overall Progress: 35/54 files completed (64.8%) - 35 `_data.go` files generated**

- ✅ **Batch 1: COMPLETE** - 14 small files (< 500 lines)
- ✅ **Batch 2: COMPLETE** - 7 medium files (500-2000 lines)
- 🔄 **Batch 3: IN PROGRESS** - 8 medium-large files (2000-5000 lines)
  - ✅ Generators created for all 8 files
  - ✅ 6 files successfully generated
  - ⚠️ 1 file has XML parsing error to resolve (`mentors.xml`)
  - ⚠️ 1 file generator exists but data file not generated (`lifestyles.xml`)
- 🔄 **Batch 4: NEARLY COMPLETE** - 6 large files (5000-10000 lines)
  - ✅ 5 files successfully generated
  - ⚠️ 1 file has XML parsing error to resolve (`cyberware.xml`)
- ⏳ **Batch 5: PENDING** - 7 very large files (> 10000 lines)

**Total Generated: ~40,000+ lines of Go code across 35 `_data.go` files**

### Recent Fixes
- **Batch 5 - Critters.xml**: Fixed 4 fields in `BaseBonus` from `[]bool` to `[]string`:
  - `Reach` (receives numeric values like "1", "2", "3", "4", "-1")
  - `Biowareessmultiplier` (receives "90")
  - `Genetechessmultiplier` (receives "90")
  - `Genetechcostmultiplier` (receives "80")
- **Batch 5 - Qualities.xml (In Progress)**: Fixed 5 fields in `BaseBonus`:
  - `Selecttext`: Changed from `[]bool` to `[]Selecttext` struct (with `xml`, `xpath`, `allowedit` attributes)
  - `Skillgroupcategorydisable`: Changed from `[]bool` to `[]string` (receives "Social Active")
  - `Publicawareness`: Changed from `[]bool` to `[]string` (receives numeric values like "2", "3", "5", "8")
  - `Prototypetranshuman`: Changed from `[]bool` to `[]string` (receives "1")
  - Previously fixed: `Notoriety`, `Martialart`, `Blockspelldescriptor`
- Fixed `powers.xml` struct issues: Updated 27 fields in `BaseBonus` from `[]bool` to `[]string` to handle "Rating" values
- Fixed `Selectskill` struct: Added missing `Val`, `Applytorating`, and `Minimumrating` fields
- **Batch 3 XML Parsing Fixes**: Fixed 14 fields in `BaseBonus` struct from `[]bool` to `[]string` to handle non-boolean values:
  - `Damageresistance`, `Disablebiowaregrade`, `Disablecyberwaregrade`
  - `Cyberwaretotalessmultiplier`, `Unarmeddv`, `Skillgroupdisable`
  - `Skilldisable`, `Drainresist`, `Memory`, `Electricityarmor`
  - `Physiologicaladdictionfirsttime`, `Psychologicaladdictionfirsttime`
  - `Physiologicaladdictionalreadyaddicted`, `Psychologicaladdictionalreadyaddicted`

## Completed Files

### Batch 1: Small Files (< 500 lines) - ✅ COMPLETE
**Status: ✅ All 12 files completed**

1. ✅ `actions.xml` → `actions_data.go` (3,309 lines, 260 actions)
2. ✅ `books.xml` → `books_data.go` (916 lines, 63 books)
3. ✅ `qualitylevels.xml` → `qualitylevels_data.go` (29 lines, 1 quality group)
4. ✅ `strings.xml` → `strings_data.go` (43 lines)
5. ✅ `licenses.xml` → `licenses_data.go` (55 lines, 36 licenses)
6. ✅ `options.xml` → `options_data.go` (152 lines)
7. ✅ `contacts.xml` → `contacts_data.go` (169 lines)
8. ✅ `paragons.xml` → `paragons_data.go` (200 lines) - ⚠️ Note: XML structure mismatch (uses `<mentors>` instead of `<paragons>`)
9. ✅ `streams.xml` → `streams_data.go` (212 lines, 1 tradition, 7 spirits)
10. ✅ `echoes.xml` → `echoes_data.go` (269 lines, 29 echoes)
11. ✅ `ranges.xml` → `ranges_data.go` (274 lines, 31 ranges)
12. ✅ `tips.xml` → `tips_data.go` (381 lines)
13. ✅ `complexforms.xml` → `complexforms_data.go` (405 lines, 38 complex forms)
14. ✅ `spiritpowers.xml` → `spiritpowers_data.go` (450 lines, 85 spirit powers)

**Total: 14 files, ~2,500 lines of XML combined, ~6,800 lines of generated Go code**

### Batch 2: Medium Files (500-2000 lines) - ✅ COMPLETE
**Status: ✅ All 7 files completed**

1. ✅ `vessels.xml` → `vessels_data.go` (509 lines, 9 metatypes)
2. ✅ `sheets.xml` → `sheets_data.go` (629 lines, 120 sheets)
3. ✅ `programs.xml` → `programs_data.go` (810 lines, 71 programs)
4. ✅ `improvements.xml` → `improvements_data.go` (888 lines, 86 improvements)
5. ✅ `metamagic.xml` → `metamagic_data.go` (1,007 lines, 63 metamagics)
6. ✅ `drugcomponents.xml` → `drugcomponents_data.go` (1,821 lines, 4 grades, 22 components)
7. ✅ `powers.xml` → `powers_data.go` (1,993 lines, 109 powers)

**Total: 7 files, ~7,200 lines of XML combined**

## Batch 3: Medium-Large Files (2000-5000 lines)
**Status: 🔄 IN PROGRESS - Generators created, resolving XML parsing errors**

More complex structures, may need struct validation:

1. ✅ `martialarts.xml` (2,485 lines) → `martialarts_data.go` - **COMPLETE**
2. ⚠️ `lifestyles.xml` (2,596 lines) - Generator created, **NOT YET GENERATED** (generator exists but `lifestyles_data.go` file not created)
3. ⚠️ `mentors.xml` (3,233 lines) - Generator created, **XML parsing error**: `strconv.ParseBool: parsing "2"` (investigating)
4. ✅ `packs.xml` (3,366 lines) → `packs_data.go` - **COMPLETE**
5. ✅ `traditions.xml` (3,705 lines) → `traditions_data.go` - **COMPLETE** (74 traditions, 57 spirits, 5 drain attributes)
6. ✅ `bioware.xml` (3,916 lines) → `bioware_data.go` - **COMPLETE** (9 grades, 16 categories, 213 bioware items)
7. ✅ `critterpowers.xml` (4,293 lines) → `critterpowers_data.go` - **COMPLETE** (291 critter powers)
8. ✅ `armor.xml` (4,435 lines) → `armor_data.go` - **COMPLETE** (5 categories, 12 mod categories, 202 armor items, 70 mods)

**Total: 8 files, ~28,000 lines combined**
**Completed: 6/8 files (75.0%)**
**Generators Created: 8/8 files (100%)**

### Batch 3 Generator Fixes Applied

**Common Issues Fixed**:
1. ✅ **SourceReference handling**: Fixed generators to use `common.SourceReference{Source: ..., Page: ...}` instead of direct fields, since `SourceReference` is an embedded struct
2. ✅ **Page field type**: Corrected `Page` field from `int` to `string` in generators (matches `SourceReference` struct)
3. ✅ **Helper function removal**: Removed redundant `stringPtr` and `uint8Ptr` helper functions from generated files (already declared in other `_data.go` files)
4. ✅ **Category Hide field**: Removed references to `cat.Hide` for category types that don't have a `Hide` field (e.g., `BiowareCategory`, `ArmorCategory`)

**Files Fixed**:
- `generate-martialarts-data/main.go` - Fixed SourceReference and Page type
- `generate-mentors-data/main.go` - Fixed SourceReference and Page type
- `generate-critterpowers-data/main.go` - Fixed SourceReference and Page type
- `generate-traditions-data/main.go` - Fixed SourceReference, Page type, and removed helper functions
- `generate-bioware-data/main.go` - Removed `cat.Hide` references
- `generate-armor-data/main.go` - Removed `cat.Hide` references
- `generate-lifestyles-data/main.go` - Fixed syntax error in generated code

### Batch 3 Issues to Address

#### XML Parsing Errors - BaseBonus Struct Type Mismatches

**Root Cause**: Several fields in `pkg/shadowrun/edition/v5/common/base_bonus.go` are defined as `[]bool` but receive string or numeric values in the XML data.

**Fixed Fields** (15 total):
- ✅ `Damageresistance` - receives "Rating" and numeric values
- ✅ `Disablebiowaregrade` - receives "Standard", "Used", "Alphaware", etc.
- ✅ `Disablecyberwaregrade` - receives "Standard", "Used", "Alphaware", etc.
- ✅ `Cyberwaretotalessmultiplier` - receives numeric values like "200"
- ✅ `Unarmeddv` - receives "Rating-1" and numeric values
- ✅ `Skillgroupdisable` - receives "Enchanting" and other skill group names
- ✅ `Skilldisable` - receives "Binding" and other skill names
- ✅ `Drainresist` - receives numeric values like "-2"
- ✅ `Memory` - receives "Rating" values
- ✅ `Electricityarmor` - receives numeric values like "2"
- ✅ `Physiologicaladdictionfirsttime` - receives "Rating" values
- ✅ `Psychologicaladdictionfirsttime` - receives "Rating" values
- ✅ `Physiologicaladdictionalreadyaddicted` - receives "Rating" values
- ✅ `Psychologicaladdictionalreadyaddicted` - receives "Rating" values
- ✅ `Radiationresist` - receives "Rating" values

**Batch 4 Fixes Applied**:
- ✅ **priorities.xml**: Changed `Karma` field from `byte` to `int8` in `PriorityMetavariant` and `PriorityMetatype` structs to handle negative karma values (e.g., "-4")

**Remaining Issues**:

1. **`mentors.xml`** - Error: `strconv.ParseBool: parsing "2"` ⚠️ **KNOWN ISSUE**
   - Status: `Damageresistance` already fixed to `[]string`, but error persists
   - Investigation completed:
     - First bonus section contains `<damageresistance>2</damageresistance>` at line 30
     - `Damageresistance` field confirmed as `[]string` in `base_bonus.go` line 155
     - Error persists after clean build and rebuild, suggesting another field may be causing the issue
     - XML decoder processes fields in struct order, not XML order
     - Checked all `[]bool` fields appearing before `Damageresistance` in struct (lines 119-154) - none appear in mentors.xml
     - Checked nested structs (`Spellcategory`, `Specificskill`) - all have correct types
     - No other fields with "damageresistance" tag found in struct
   - **Possible causes**:
     - Field processed before `Damageresistance` in struct order that we haven't identified
     - XML decoder matching issue or field order processing bug
     - Cached struct definition (unlikely after clean build)
   - **Next steps for resolution**:
     - Add detailed error logging to identify exact field causing the issue
     - Consider using a custom XML unmarshaler to debug field processing order
     - Check if error occurs at a different location in the XML file
     - May need to temporarily comment out fields to isolate the issue

**Investigation Strategy**:
- XML decoder processes fields in the order they appear in the struct definition
- Fields that appear earlier in `BaseBonus` struct may be processed before the fixed ones
- Need to check all `[]bool` fields alphabetically before the fixed ones
- May need to check nested structs (e.g., `Conditionmonitor`, `Specificattribute`) for boolean fields receiving non-boolean values

## Batch 4: Large Files (5000-10000 lines)
**Status: 🔄 NEARLY COMPLETE - 5/6 files completed (83.3%)**

Complex structures, likely need struct review:

1. ✅ `skills.xml` (5,137 lines) → `skills_data.go` - **COMPLETE** (15 skill groups, 13 categories, 76 skills, 195 knowledge skills)
2. ✅ `priorities.xml` (5,140 lines) → `priorities_data.go` - **COMPLETE** (5 categories, 35 priorities)
   - **Fix applied**: Changed `Karma` field from `byte` to `int8` in `PriorityMetavariant` and `PriorityMetatype` to handle negative values
3. ✅ `spells.xml` (5,305 lines) → `spells_data.go` - **COMPLETE** (7 categories, 363 spells)
4. ✅ `references.xml` (5,545 lines) → `references_data.go` - **COMPLETE** (921 rules)
5. ✅ `settings.xml` (6,641 lines) → `settings_data.go` - **COMPLETE** (34 settings)
6. ⚠️ `cyberware.xml` (8,747 lines) - Generator created, XML parsing error: `strconv.ParseBool: parsing "2"`
   - **Issue**: A BaseBonus field (likely in nested SpecificSkill structure) is receiving numeric value "2" but is typed as `[]bool`
   - **Status**: Needs investigation to identify the specific field

**Total: 6 files, ~36,500 lines combined**
**Completed: 5/6 files (83.3%)**

## Batch 5: Very Large Files (> 10000 lines)
**Status: 🔄 IN PROGRESS - 5/7 files completed (71.4%), 7/7 generators created (100%)**

Most complex, will need careful struct validation and testing:

1. ✅ `lifemodules.xml` (13,146 lines) → `lifemodules_data.go` - **COMPLETE** (5 stages, 165 modules)
2. ✅ `vehicles.xml` (14,966 lines) → `vehicles_data.go` - **COMPLETE** (19 categories, 7 mod categories, 1 weapon mount category, 380 vehicles, 29 weapon mounts)
   - **Note**: Vehicles structure simplified (omitted complex nested mod structures)
3. ⚠️ `qualities.xml` (19,428 lines) - Generator created, XML parsing error: `strconv.ParseBool: parsing "10": invalid syntax`
   - **Fixes applied**:
     - Changed `Notoriety`, `Martialart`, and `Blockspelldescriptor` from `[]bool` to `[]string` in BaseBonus
     - Changed `Selecttext` from `[]bool` to `[]Selecttext` (struct with `xml`, `xpath`, `allowedit` attributes)
     - Changed `Skillgroupcategorydisable` from `[]bool` to `[]string` (receives "Social Active")
     - Changed `Publicawareness` from `[]bool` to `[]string` (receives numeric values like "2", "3", "5", "8")
     - Changed `Prototypetranshuman` from `[]bool` to `[]string` (receives "1")
   - **Current error**: A boolean field is receiving "10" (not found as element content in bonus sections)
   - **Investigation needed**: Check nested structures or fields that might receive "10" as a numeric value
4. ✅ `weapons.xml` (19,572 lines) → `weapons_data.go` - **COMPLETE** (31 categories, 632 weapons, 152 accessories, 0 mods)
   - **Note**: Weapons structure simplified (omitted complex nested weapon structures)
5. ⚠️ `gear.xml` (22,338 lines) - Generator created, XML parsing error: `strconv.ParseInt: parsing "[0]": invalid syntax`
   - **Issue**: An integer field in the Gear struct is receiving bracket notation like "[0]" or "[Rating]"
   - **Status**: Generator created but cannot load XML due to type mismatch
   - **Investigation needed**: Check which integer field (possibly in UseGear or nested structures) needs to be changed to string
6. ✅ `metatypes.xml` (24,517 lines) → `metatypes_data.go` - **COMPLETE** (4 categories, 21 metatypes)
   - **Note**: Metatypes structure simplified (omitted complex nested structures)
7. ✅ `critters.xml` (28,462 lines) → `critters_data.go` - **COMPLETE** (18 categories, 269 critters)
   - **Fixes applied**: Changed `Reach`, `Biowareessmultiplier`, `Genetechessmultiplier`, and `Genetechcostmultiplier` from `[]bool` to `[]string` in BaseBonus
   - **Note**: Critters structure simplified (omitted complex nested structures)

**Total: 7 files, ~142,000 lines combined**
**Completed: 5/7 files (71.4%)**
**Generators Created: 7/7 files (100%)**
**XML Parsing Errors: 2 files need struct fixes (qualities.xml, gear.xml)**

## Recommended Processing Order

### Phase 1: Quick Wins (Batch 1)
Process all small files to establish patterns and build momentum.

### Phase 2: Core Game Data (Batch 2 + selected from Batch 3)
Focus on files that are commonly used:
- `powers.xml` (magic powers)
- `spells.xml` (from Batch 4, but important)
- `skills.xml` (from Batch 4, but important)
- `armor.xml`
- `bioware.xml`
- `cyberware.xml` (from Batch 4)

### Phase 3: Remaining Medium Files (Batch 3)
Complete the medium-large files.

### Phase 4: Large Files (Batch 4)
Process the large files with complex structures.

### Phase 5: Very Large Files (Batch 5)
Process the largest files last, as they may require optimization.

## Current Status & Next Steps

### Immediate Next Steps
1. **Resolve remaining XML parsing error in Batch 3**:
   - ✅ `armor.xml` - FIXED (was `Radiationresist` field)
   - ✅ `bioware.xml` - FIXED (was multiple fields including addiction fields)
   - ⚠️ `mentors.xml` - Continue investigation (error persists despite `Damageresistance` fix)

2. **Investigation approach**:
   - Check all `[]bool` fields in `BaseBonus` that appear before fixed ones in struct order
   - Verify XML decoder processes fields in struct order, not XML order
   - Check nested structs for boolean fields receiving non-boolean values
   - Consider adding more detailed error logging to identify exact field causing issues

3. **After Batch 3 completion**:
   - Move to Batch 4 (large files)
   - Apply lessons learned from Batch 3 struct fixes

### Known Patterns
- Many `BaseBonus` fields incorrectly typed as `[]bool` when they should be `[]string`
- Fields receiving "Rating", numeric values, or enum strings should typically be `[]string`
- Some fields like `Selecttext` are complex structs with attributes (`xml`, `xpath`, `allowedit`), not simple booleans
- Fields that receive category names, skill names, or other text values should be `[]string`, not `[]bool`
- XML decoder processes fields in struct definition order, not XML order
- Nested structs (e.g., `Conditionmonitor`, `Specificattribute`) may also have type mismatches
- When fixing type mismatches, also update all generated `_data.go` files that reference the changed fields

## Notes

- Each file should follow the same pattern:
  1. Examine the struct definition
  2. Verify it matches the XML structure
  3. Create/update generator if needed
  4. Generate `_data.go` file
  5. Test and verify

- For very large files, consider:
  - Testing generation time
  - Verifying generated file compiles
  - Checking for any memory issues during generation

- All generators should be placed in `cmd/tools/generate-{name}-data/`

- **Important**: When fixing struct type mismatches, update `pkg/shadowrun/edition/v5/common/base_bonus.go` and rebuild the package before testing generators

