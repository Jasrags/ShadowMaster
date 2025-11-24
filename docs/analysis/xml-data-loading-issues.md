# XML Data Loading Issues Documentation

This document tracks data quality issues found during XML file analysis and loading.

## Overview

This document categorizes issues found when loading XML files from `data/chummerxml/` into Go structs.

## Issue Categories

### Critical Issues
Issues that prevent data from loading or cause data loss.

### Warnings
Issues that may cause problems but don't prevent loading.

### Info
Informational issues that don't affect functionality but may indicate data quality concerns.

## File-by-File Issues

### Small Files

#### actions.xml
- Status: ✅ Analysis Complete
- **Total Records**: 260 actions
- **File Size**: ~50 KB
- **Well Formed**: Yes
- **Issues Found**: 
  - **Critical (12)**: Empty dice field in test element for 12 defensive/interrupt actions:
    - Block (Interrupt)
    - Dodge (Interrupt)
    - Parry (Interrupt)
    - Full Defense (Interrupt)
    - Full Matrix Defense (Interrupt)
    - Pre-Emptive Block (Free)
    - Pre-Emptive Dodge (Free)
    - Pre-Emptive Parry (Free)
    - Acrobatic Defender (Interrupt)
    - Agile Defender (Interrupt)
    - Perceptive Defender (Interrupt)
    - Too Pretty to Hit (Interrupt)
  - **Root Cause**: The struct definition has `Test ActionTest` as a required field (not a pointer), but 12 actions don't have a `<test>` element in the XML. These actions use `<boosts>` instead. The struct needs to be updated to make `Test *ActionTest` (optional pointer).
  - **Affected Actions**: All are defensive/interrupt actions that use boost mechanics rather than dice tests.
  - **Fix Required**: Update `pkg/shadowrun/edition/v5/actions.go` to make `Test` field optional: `Test *ActionTest \`xml:"test,omitempty"\``
- **Action Types Distribution**:
  - No: 29
  - Free: 13
  - Simple: 68
  - Complex: 123
  - Interrupt: 26
  - Extended: 1
- **Source Books**: SR5 (197), RG (44), R5 (5), DT (2), KC (12)
- **ID Validation**: All IDs are valid UUIDs, no duplicates found

#### books.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### contacts.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### echoes.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### improvements.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### licenses.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### mentors.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### metamagic.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### options.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### paragons.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### priorities.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### qualitylevels.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### ranges.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### references.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### settings.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### sheets.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### spiritpowers.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### strings.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### tips.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

### Medium Files

#### armor.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### bioware.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### complexforms.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### critterpowers.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### critters.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### cyberware.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### drugcomponents.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### lifemodules.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### lifestyles.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### martialarts.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### metatypes.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### packs.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### powers.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### programs.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### qualities.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### skills.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### spells.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### streams.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### traditions.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### vessels.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

### Large Files

#### gear.xml
- Status: ⏳ Pending Analysis
- Issues: TBD
- Notes: Very large file (22k+ lines), may require streaming for optimal performance

#### vehicles.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

#### weapons.xml
- Status: ⏳ Pending Analysis
- Issues: TBD

## Common Issue Patterns

### ID Issues
- Duplicate IDs
- Missing IDs
- Invalid UUID format

### Enum Issues
- Values not matching enum definitions
- Case sensitivity mismatches
- Missing enum values in data

### Reference Issues
- Broken references to other entities
- Missing source book references
- Invalid page numbers

### Type Issues
- Numeric fields with text
- Boolean fields with non-boolean values
- Date fields with invalid formats

### Formula Issues
- Malformed expressions
- Invalid variable references
- Syntax errors in formulas

### Structure Issues
- Missing required fields
- Unexpected nested structures
- Array vs single value mismatches

## Testing Status

- [ ] All small files tested
- [ ] All medium files tested
- [ ] All large files tested
- [ ] Validation tests passing
- [ ] Performance benchmarks completed

## Next Steps

1. Run analysis on all files
2. Document specific issues found
3. Prioritize fixes
4. Implement fixes
5. Re-test after fixes

