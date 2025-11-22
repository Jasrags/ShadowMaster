<!-- 822ead4f-515f-4e11-ad37-35851ae6ef89 449ae89b-b0f0-4506-9aaf-72e771c119a6 -->
# XSD Data Generation Strategy

## Data Source and Output Strategy

**Important**: Data is sourced from XML files (`data/chummerxml/*.xml`) with XSD schemas (`data/chummerxml/*.xsd`), but the generated Go structs are for runtime use in the application, not for XML processing.

- **Source**: XML files with XSD schema definitions
- **Output**: Go structs with both XML and JSON tags
- XML tags: Required for unmarshaling XML during generation/import (one-time conversion)
- JSON tags: Primary format for runtime API responses and data access
- **Runtime Usage**: Application uses Go structs directly, not XML
- **Generation Process**: XML → Go structs (one-time conversion during build/generation)
- **Guidelines**: Follow `DATA_GENERATION_NORMALIZATION_CLEANUP.md` for all generation work

## Prerequisites and Setup

### Step 0: Backup and Cleanup

Before starting fresh generation, we need to preserve existing work and start clean:

1. **Backup Existing Files**

- Create a tar archive of all `.go` files in `pkg/shadowrun/edition/v5/`
- Command: `tar -czf backup-v5-$(date +%Y%m%d-%H%M%S).tar.gz -C pkg/shadowrun/edition/v5 *.go`
- Store backup in project root or a `backups/` directory
- Verify backup was created successfully

2. **Remove Existing .go Files**

- Delete all `.go` files in `pkg/shadowrun/edition/v5/` to start fresh
- Keep `common/` subdirectory structure intact
- This ensures we're building from scratch with proper dependencies

3. **Preserve Common Package**

- The `pkg/shadowrun/edition/v5/common/` directory should be preserved
- We'll be expanding/creating files in `common/` as part of Phase 1

### Batch Processing Requirement

All data generation scripts MUST implement batch processing to prevent system hangs:

- Process data in batches (e.g., 50-100 items per batch)
- Write to files incrementally with `flush()` after each batch
- Print progress indicators (e.g., "Processed 50/500 items...")
- This prevents IDE stalls and memory issues with large data files
- Reference: `scripts/generate_armor_xml.py` and `scripts/generate_bioware_xml.py` for examples

## Processing Order (Dependency-Based)

### Phase 1: Foundation Schemas (No Dependencies) ✅ COMPLETE

These must be processed first as they are referenced by all other schemas:

1. **SchemaExtensions.xsd** - Defines boolean type (True/False enum) ✅

- Output: `common/schema_extensions.go` ✅
- Types: `Boolean` type handling ✅
- Status: Complete

2. **bonuses.xsd** - Defines `bonusTypes` complexType (1551 lines) ✅

- Output: `common/bonuses.go` ✅
- Types: Complete `BaseBonus` struct with all bonus element types ✅
- Generated: 126 bonus type structs, BaseBonus with 282 fields
- Note: Added missing `Selectweapon` type manually (script didn't catch it)
- Status: Complete

3. **conditions.xsd** - Defines `required` and `forbidden` elements ✅

- Output: `common/conditions.go` ✅
- Types: `Required`, `Forbidden`, `RequirementOneOf`, `RequirementAllOf`, all check types ✅
- Generated: All check types, Checks struct, Details structures
- Note: Renamed conflicting types (Gear → GearCheck, Quality → QualityCheck, Spellcategory → SpellcategoryCheck) to avoid conflicts with gear.go and bonuses.go
- Status: Complete

4. **gear.xsd** - Defines `gear` element structure ✅

- Output: `common/gear.go` ✅
- Types: `Gear`, `Gears`, `UseGear`, `ChooseGear` structures ✅
- Generated: Gear struct, Gears container, UseGear, ChooseGear, nested types (Weaponbonus, Tags, etc.)
- Note: Used by bioware, cyberware, weapons, etc.
- Status: Complete

### Phase 2: Standalone Schemas (No External Dependencies) ✅ COMPLETE

These can be processed independently:

5. **books.xsd** - Book definitions ✅

- Output: `books.go` ✅
- Types: `Book`, `Books`, `Match`, `Matches`, `BooksChummer` ✅
- Status: Complete

6. **skills.xsd** - Standalone skill definitions ✅

- Output: `skills.go` ✅
- Types: `Skill`, `Spec`, `Specs`, `SkillGroupName`, `SkillGroups`, `SkillCategory`, `SkillCategories`, `Skills`, `KnowledgeSkills`, `SkillsChummer` ✅
- Uses: `common.Visibility`, `common.SourceReference` ✅
- Status: Complete

7. **references.xsd** - Reference data ✅

- Output: `references.go` ✅
- Types: `Rule`, `Rules`, `ReferencesChummer` ✅
- Status: Complete

### Phase 3: Simple Dependencies (Only conditions or bonuses) - ✅ COMPLETE

These depend on Phase 1 but not on each other:

8. **lifestyles.xsd** - Includes conditions ✅

- Output: `lifestyles.go` ✅
- Types: `LifestyleItem`, `LifestyleItems`, `LifestyleCategory`, `LifestyleCategories`, `Comfort`, `Entertainment`, `Necessity`, `Neighborhood`, `Security`, `LifestyleQuality`, `LifestyleQualityItems`, `City`, `District`, `Borough`, and related structures ✅
- Uses: `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden` ✅
- Note: Types renamed to avoid conflicts with character.go (`Lifestyle` → `LifestyleItem`, `Lifestyles` → `LifestyleItems`) ✅
- Status: Complete

9. **weapons.xsd** - Includes conditions ✅

- Output: `weapons.go` ✅
- Types: `Weapon`, `WeaponAccessory`, `WeaponMod`, `WirelessWeaponBonus`, `WeaponGears`, and related structures ✅
- Uses: `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden` ✅
- Status: Complete

10. **vehicles.xsd** - Includes conditions ✅

- Output: `vehicles.go` ✅
- Types: `Vehicle`, `VehicleModItem`, `WeaponMountItem`, and related structures ✅
- Uses: `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden` ✅
- Status: Complete

11. **vessels.xsd** - Includes bonuses, conditions ✅

- Output: `vessels.go` ✅
- Types: `VesselMetatype`, `VesselQuality`, `VesselPower`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference` ✅
- Status: Complete

12. **metatypes.xsd** - Includes bonuses ✅

- Output: `metatypes.go` ✅
- Types: `Metatype`, `Metavariant`, `Quality`, `Power`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference` ✅
- Status: Complete

13. **martialarts.xsd** - Includes bonuses ✅

- Output: `martialarts.go` ✅
- Types: `MartialArt`, `Technique`, `TechniqueItem`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference` ✅
- Status: Complete

14. **traditions.xsd** - Includes bonuses ✅

- Output: `traditions.go` ✅
- Types: `Tradition`, `Spirit`, `SpiritBonus`, `SpiritPowers`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility` ✅
- Status: Complete

15. **streams.xsd** - Includes bonuses ✅

- Output: `streams.go` ✅
- Types: `Stream`, `StreamSpiritItem`, `StreamSpiritBonus`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference` ✅
- Status: Complete

16. **paragons.xsd** - Includes bonuses ✅

- Output: `paragons.go` ✅
- Types: `Paragon`, `ParagonChoice`, `ParagonCategories`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference` ✅
- Status: Complete

17. **mentors.xsd** - Includes bonuses ✅

- Output: `mentors.go` ✅
- Types: `Mentor`, `MentorChoice`, `MentorCategories`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference` ✅
- Status: Complete

18. **echoes.xsd** - Includes bonuses, conditions ✅

- Output: `echoes.go` ✅
- Types: `Echo`, `Echoes`, `EchoesChummer` ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden` ✅
- Status: Complete

19. **critters.xsd** - Includes bonuses ✅

- Output: `critters.go` ✅
- Types: `Critter`, `CritterMetavariant`, `CritterQuality`, `CritterPower`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference` ✅
- Status: Complete

### Phase 4: Complex Dependencies (Multiple includes) - ✅ COMPLETE

These depend on Phase 1 and may reference each other:

20. **armor.xsd** - Includes bonuses, conditions ✅

- Output: `armor.go` ✅
- Types: `ArmorItem`, `ArmorItems`, `ArmorCategory`, `ArmorCategories`, `ArmorModCategory`, `ArmorModCategories`, `ArmorModItem`, `ArmorModItems`, `ArmorItemMods`, and related structures ✅
- Uses: `common.Visibility`, `common.SourceReference`, `common.BaseBonus`, `common.Required`, `common.Forbidden` ✅
- Note: Renamed `ArmorMods` → `ArmorItemMods` to avoid conflict with character.go ✅
- Status: Complete

21. **bioware.xsd** - Includes bonuses, conditions, gear ✅

- Output: `bioware.go` ✅
- Types: `BiowareItem`, `BiowareItems`, `BiowareGrade`, `BiowareGrades`, `BiowareCategory`, `BiowareCategories`, `BiowareSubsystems` (recursive), and related structures ✅
- Uses: `common.Visibility`, `common.SourceReference`, `common.BaseBonus`, `common.Required`, `common.Forbidden`, `common.Gears` ✅
- Status: Complete

22. **cyberware.xsd** - Includes bonuses, conditions, gear ✅

- Output: `cyberware.go` ✅
- Types: `Cyberware`, `CyberwareModItem`, `Suite`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden`, `common.Gears`, `common.Grades` ✅
- Status: Complete

23. **qualities.xsd** - Includes bonuses, conditions, SchemaExtensions ✅

- Output: `qualities.go` ✅
- Types: `QualityItem`, `NaturalWeapon`, `AddQualities`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden`, `common.Boolean` ✅
- Status: Complete

24. **spells.xsd** - Includes bonuses, conditions ✅

- Output: `spells.go` ✅
- Types: `Spell`, `SpellCategory`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden` ✅
- Status: Complete

25. **powers.xsd** - Includes bonuses, conditions ✅

- Output: `powers.go` ✅
- Types: `PowerItem`, `PowerItems`, `Enhancement`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.Required`, `common.Forbidden` ✅
- Status: Complete

26. **critterpowers.xsd** - Includes bonuses, conditions ✅

- Output: `critterpowers.go` ✅
- Types: `CritterPowerItem`, `CritterPowerCategory`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden` ✅
- Status: Complete

27. **complexforms.xsd** - Includes bonuses, conditions ✅

- Output: `complexforms.go` ✅
- Types: `ComplexFormItem`, `ComplexFormCategory`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden` ✅
- Status: Complete

28. **programs.xsd** - Includes bonuses, conditions ✅

- Output: `programs.go` ✅
- Types: `ProgramItem`, `Option`, `Tags`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden` ✅
- Status: Complete

29. **metamagic.xsd** - Includes bonuses, conditions ✅

- Output: `metamagic.go` ✅
- Types: `MetamagicItem`, `Art`, and related structures ✅
- Uses: `common.BaseBonus`, `common.Visibility`, `common.SourceReference`, `common.Required`, `common.Forbidden` ✅
- Status: Complete

### Phase 5: Root Schema - ✅ COMPLETE

30. **character.xsd** - Includes bonuses ✅

- Output: `character.go` ✅
- Types: `Character`, `CharacterGear`, `CharacterWeapon`, `CharacterCyberware`, and all nested character structures ✅
- Uses: `common.BaseBonus`, recursive references for gear, weapon, cyberware ✅
- Status: Complete

## Abstraction Opportunities

### High Priority - Move to `common/` Package

1. **Category Structures** - Multiple schemas define similar category types: ✅ COMPLETE

- Pattern: `{Name}Category` with `Name` (string) and optional attributes
- Examples: `ArmorCategory`, `BiowareCategory`, `GearCategory`, `WeaponCategory`, `VehicleCategory`
- Abstraction: `common.Category` with generic attribute support ✅
- Location: `common/categories.go` ✅

2. **Grade Structures** - Bioware and Cyberware have identical grade structures: ✅ COMPLETE

- Pattern: `Grade` with `ID`, `Name`, `Ess`, `Cost`, `DeviceRating`, `Avail`, `Source`, `Page`
- Examples: `BiowareGrade`, `CyberwareGrade` (currently separate)
- Abstraction: `common.Grade` (shared) ✅
- Location: `common/grades.go` ✅

3. **Source/Page Fields** - Present in almost every data structure: ✅ COMPLETE

- Pattern: `Source string`, `Page string`
- Abstraction: Embed `common.SourceReference` struct ✅
- Location: `common/source.go` ✅

4. **Hide/IgnoreSourceDisabled Fields** - Common optional fields: ✅ COMPLETE

- Pattern: `Hide *string`, `IgnoreSourceDisabled *string`
- Abstraction: Embed `common.Visibility` struct ✅
- Location: `common/visibility.go` ✅

5. **Required/Forbidden** - Already partially in common, needs completion: ✅ COMPLETE

- Current: `common.Requirement`, `common.Forbidden` (incomplete)
- Need: Full implementation from `conditions.xsd` ✅
- Location: `common/conditions.go` ✅

6. **Bonus Types** - Already in common but needs expansion: ✅ COMPLETE

- Current: `common.BaseBonus` (partial)
- Need: All bonus types from `bonuses.xsd` (1551 lines) ✅
- Location: `common/bonuses.go` ✅

### Medium Priority - Consider Abstraction

7. **Gear Structures** - Used by multiple schemas: ✅ COMPLETE

- Pattern: `Gears`, `UseGear` structures
- Examples: Used in armor, bioware, cyberware, weapons
- Abstraction: Already defined in `gear.xsd` - move to `common/gear.go` ✅

8. **Rating Fields** - Common pattern for variable-rating items:

- Pattern: `Rating *string` or `Rating string`
- Consider: Generic `Rating` type wrapper

9. **Cost/Availability Fields** - Common economic fields:

- Pattern: `Cost string`, `Avail string`
- Consider: `common.Economic` struct

### Low Priority - Keep Separate

10. **Domain-Specific Structures** - Unique to each schema:

- Weapon-specific: `WeaponAccessory`, `WeaponMount`
- Vehicle-specific: `VehicleMod`, `VehicleWeaponMount`
- Spell-specific: `SpellCategory`, spell descriptors
- Keep these in their respective packages

## Implementation Strategy

### Step 1: Build Foundation (Phase 1) ✅ COMPLETE

1. ✅ Generate `common/schema_extensions.go` from `SchemaExtensions.xsd`
2. ✅ Expand `common/bonuses.go` to include ALL bonus types from `bonuses.xsd`
3. ✅ Create `common/conditions.go` with complete `required`/`forbidden` structures
4. ✅ Create `common/gear.go` from `gear.xsd`

### Step 2: Create Common Abstractions ✅ COMPLETE

1. ✅ Create `common/categories.go` with generic category support
2. ✅ Create `common/grades.go` for shared grade structure
3. ✅ Create `common/source.go` for source/page embedding
4. ✅ Create `common/visibility.go` for hide/ignore fields

### Step 3: Regenerate Existing Files

1. Update `armor.go`, `bioware.go`, `lifestyles.go` to use common abstractions
2. Remove duplicate structures
3. Ensure XML tags are preserved for round-trip compatibility

### Step 4: Process Remaining Schemas

1. ✅ Phase 2: Process standalone schemas (skills.xsd, references.xsd) - COMPLETE
2. ✅ Phase 3: Process simple dependencies - COMPLETE

- ✅ metatypes.xsd, martialarts.xsd, traditions.xsd, streams.xsd, paragons.xsd, mentors.xsd, echoes.xsd, critters.xsd, weapons.xsd, vehicles.xsd, vessels.xsd

3. ✅ Phase 4: Process complex dependencies - COMPLETE

- ✅ cyberware.xsd, qualities.xsd, spells.xsd, powers.xsd, critterpowers.xsd, complexforms.xsd, programs.xsd, metamagic.xsd

4. ✅ Phase 5: Process root schema (character.xsd) - COMPLETE
5. Use common abstractions where applicable
6. Keep domain-specific structures in their packages

## Key Benefits

1. **Type Safety**: Eliminate `interface{}` where possible
2. **DRY Principle**: Single source of truth for shared structures
3. **Consistency**: Uniform handling of common patterns
4. **Maintainability**: Changes to common structures propagate automatically
5. **XML Compatibility**: Proper XML tags ensure round-trip XML handling

## Files to Create/Modify

### New Common Files: ✅ ALL CREATED

- ✅ `pkg/shadowrun/edition/v5/common/schema_extensions.go`
- ✅ `pkg/shadowrun/edition/v5/common/conditions.go`
- ✅ `pkg/shadowrun/edition/v5/common/gear.go`
- ✅ `pkg/shadowrun/edition/v5/common/categories.go`
- ✅ `pkg/shadowrun/edition/v5/common/grades.go`
- ✅ `pkg/shadowrun/edition/v5/common/source.go`
- ✅ `pkg/shadowrun/edition/v5/common/visibility.go`

### Files to Expand: ✅ ALL COMPLETE

- ✅ `pkg/shadowrun/edition/v5/common/bonuses.go` (126 bonus type structs generated)
- ✅ `pkg/shadowrun/edition/v5/common/base_bonus.go` (282 fields generated)

### Files to Refactor: ⏳ PENDING (Phase 3-4)

- ⏳ `pkg/shadowrun/edition/v5/armor.go` (use common abstractions)
- ⏳ `pkg/shadowrun/edition/v5/bioware.go` (use common abstractions)
- ⏳ `pkg/shadowrun/edition/v5/cyberware.go` (use common abstractions when regenerated)

## Progress Notes

### Completed Work (2024-12-XX)

**Phase 1: Foundation Schemas - ✅ COMPLETE**

1. **Generation Scripts Created:**

- ✅ `scripts/generate_conditions_from_xsd.py` - Generates conditions.go
- ✅ `scripts/generate_gear_from_xsd.py` - Generates gear.go
- ✅ `scripts/generate_bonuses_from_xsd.py` - Generates bonuses.go and base_bonus.go

2. **Issues Resolved:**

- ✅ Fixed duplicate type definitions (Gear, Quality, Spellcategory) by renaming check types
- ✅ Added missing `Selectweapon` type to bonuses.go (script didn't generate it)
- ✅ Fixed duplicate fields in gear.go (Noextra appeared twice)
- ✅ Removed duplicate definitions from requirements.go (now in conditions.go)
- ✅ All linter errors resolved

3. **Common Abstractions Created:**

- ✅ `SourceReference` - Embeddable struct for source/page fields
- ✅ `Visibility` - Embeddable struct for hide/ignoresourcedisabled fields
- ✅ `Grade` - Shared grade structure for bioware/cyberware
- ✅ `Category` and `CategoryWithShow` - Generic category support

4. **Statistics:**

- bonuses.go: 126 bonus type structs generated
- base_bonus.go: 282 fields (all top-level bonus elements)
- conditions.go: Complete check types and requirement structures
- gear.go: Full gear hierarchy with nested types

### Notes for Future Work

1. **Type Naming Conflicts:**

- Check types in conditions.go were renamed to avoid conflicts:
- `Gear` → `GearCheck`
- `Quality` → `QualityCheck`
- `Spellcategory` → `SpellcategoryCheck`
- This pattern may need to be applied to other schemas if conflicts arise

2. **Selectweapon Type:**

- The `Selectweapon` type was not generated by the script but exists in bonuses.xsd
- Manually added to bonuses.go - may need to investigate why script missed it
- **TODO**: Review script logic to ensure all complex types with only attributes are captured

3. **Common Abstractions Usage:**

- The common abstractions (SourceReference, Visibility, Grade, Category) are ready to use
- When regenerating existing files (armor.go, bioware.go, etc.), they should embed these structs
- This will reduce duplication and improve consistency
- **TODO**: Update existing files to use common abstractions during Phase 3-4

4. **Next Steps:**

- ✅ Phase 2: Process standalone schemas (skills.xsd, references.xsd) - COMPLETE
- ✅ Phase 3: Process simple dependencies - COMPLETE
- ✅ Phase 4: Process complex dependencies - COMPLETE
- ✅ Phase 5: Process root schema (character.xsd) - COMPLETE

5. **Generation Script Improvements:**

- Consider enhancing scripts to detect and handle type conflicts automatically
- Add validation to ensure all types from XSD are generated
- Consider adding batch processing for very large schemas (as mentioned in plan)
- **TODO**: Review why Selectweapon wasn't generated and fix script if needed

6. **File Status:**

- All Phase 1 files compile without errors
- All linter errors resolved
- Foundation is solid and ready for next phases

## Progress Notes

### Completed Work (2024-12-XX)

**Phase 1: Foundation Schemas - COMPLETE**

1. **Generation Scripts Created:**

- `scripts/generate_conditions_from_xsd.py` - Generates conditions.go
- `scripts/generate_gear_from_xsd.py` - Generates gear.go
- `scripts/generate_bonuses_from_xsd.py` - Generates bonuses.go and base_bonus.go

2. **Issues Resolved:**

- Fixed duplicate type definitions (Gear, Quality, Spellcategory) by renaming check types
- Added missing `Selectweapon` type to bonuses.go (script didn't generate it)
- Fixed duplicate fields in gear.go (Noextra appeared twice)
- Removed duplicate definitions from requirements.go (now in conditions.go)
- All linter errors resolved

3. **Common Abstractions:**

- `SourceReference` - Embeddable struct for source/page fields
- `Visibility` - Embeddable struct for hide/ignoresourcedisabled fields
- `Grade` - Shared grade structure for bioware/cyberware
- `Category` and `CategoryWithShow` - Generic category support

4. **Statistics:**

- bonuses.go: 126 bonus type structs generated
- base_bonus.go: 282 fields (all top-level bonus elements)
- conditions.go: Complete check types and requirement structures
- gear.go: Full gear hierarchy with nested types

### Completed Work (2024-12-XX) - Phase 2

**Phase 2: Standalone Schemas - ✅ COMPLETE**

1. **Generation Scripts Created:**

- ✅ `scripts/generate_skills_from_xsd.py` - Generates skills.go
- ✅ `scripts/generate_references_from_xsd.py` - Generates references.go

2. **Issues Resolved:**

- ✅ Fixed naming conflicts: `Category` → `SkillCategory` to avoid conflict with `common.Category`
- ✅ Fixed naming conflicts: `Chummer` → `SkillsChummer` and `ReferencesChummer` to avoid duplicate type names
- ✅ Fixed import path: Changed from `github.com/jrags/ShadowMaster` to `shadowmaster` (correct module name)
- ✅ All linter errors resolved for Phase 2 files

3. **Generated Files:**

- ✅ `pkg/shadowrun/edition/v5/skills.go` - Complete skill structures with embedded common types
- ✅ `pkg/shadowrun/edition/v5/references.go` - Reference rule structures

4. **Statistics:**

- skills.go: 10 struct types generated (Skill, Spec, Specs, SkillGroupName, SkillGroups, SkillCategory, SkillCategories, Skills, KnowledgeSkills, SkillsChummer)
- references.go: 3 struct types generated (Rule, Rules, ReferencesChummer)
- Both files use common abstractions (Visibility, SourceReference) where applicable

### Completed Work (2024-12-XX) - Phase 3

**Phase 3: Simple Dependencies - ✅ COMPLETE**

1. **Generation Scripts Created:**

- ✅ `scripts/generate_metatypes_from_xsd.py` - Generates metatypes.go
- ✅ `scripts/generate_martialarts_from_xsd.py` - Generates martialarts.go
- ✅ `scripts/generate_traditions_from_xsd.py` - Generates traditions.go
- ✅ `scripts/generate_streams_from_xsd.py` - Generates streams.go
- ✅ `scripts/generate_paragons_from_xsd.py` - Generates paragons.go
- ✅ `scripts/generate_mentors_from_xsd.py` - Generates mentors.go
- ✅ `scripts/generate_echoes_from_xsd.py` - Generates echoes.go
- ✅ `scripts/generate_critters_from_xsd.py` - Generates critters.go
- ✅ `scripts/generate_weapons_from_xsd.py` - Generates weapons.go
- ✅ `scripts/generate_vehicles_from_xsd.py` - Generates vehicles.go
- ✅ `scripts/generate_vessels_from_xsd.py` - Generates vessels.go

2. **Issues Resolved:**

- ✅ Fixed naming conflicts: `Skill` → `MetatypeSkill`, `Skills` → `MetatypeSkills` in metatypes.go
- ✅ Fixed naming conflicts: `OptionalPowers` → `SpiritOptionalPowers` in traditions.go
- ✅ Fixed naming conflicts: `ModName` → `VehicleModName`, `WeaponMountMods` → `VehicleWeaponMountMods` in vehicles.go
- ✅ Fixed naming conflicts: Types prefixed with `Vessel` prefix in vessels.go to avoid conflicts with metatypes.go
- ✅ All generated files use proper import paths (`shadowmaster/pkg/...`)
- ✅ All linter errors resolved for Phase 3 files

3. **Generated Files:**

- ✅ `pkg/shadowrun/edition/v5/metatypes.go` - Complete metatype structures
- ✅ `pkg/shadowrun/edition/v5/martialarts.go` - Martial arts and techniques
- ✅ `pkg/shadowrun/edition/v5/traditions.go` - Traditions and spirits
- ✅ `pkg/shadowrun/edition/v5/streams.go` - Streams and stream spirits
- ✅ `pkg/shadowrun/edition/v5/paragons.go` - Paragons and choices
- ✅ `pkg/shadowrun/edition/v5/mentors.go` - Mentors and choices
- ✅ `pkg/shadowrun/edition/v5/echoes.go` - Echoes with conditions
- ✅ `pkg/shadowrun/edition/v5/critters.go` - Critters and metavariants
- ✅ `pkg/shadowrun/edition/v5/weapons.go` - Weapons, accessories, mods, and gear references
- ✅ `pkg/shadowrun/edition/v5/vehicles.go` - Vehicles, mods, and weapon mounts
- ✅ `pkg/shadowrun/edition/v5/vessels.go` - Vessel metatypes with bonuses and conditions

4. **Statistics:**

- All Phase 3 files use common abstractions (`BaseBonus`, `Visibility`, `SourceReference`, `Required`, `Forbidden`)
- Complex structures properly handle nested types and recursive references
- weapons.go includes comprehensive weapon system with accessories, mods, and wireless bonuses

5. **Phase 3 Completion:**

- ✅ vehicles.xsd - Complex vehicle structures with mods and weapon mounts
- ✅ vessels.xsd - Vessel structures with bonuses and conditions

### Completed Work (2024-12-XX) - Phase 4

**Phase 4: Complex Dependencies - ✅ COMPLETE**

1. **Generation Scripts Created:**

- ✅ `scripts/generate_cyberware_from_xsd.py` - Generates cyberware.go
- ✅ `scripts/generate_qualities_from_xsd.py` - Generates qualities.go
- ✅ `scripts/generate_spells_from_xsd.py` - Generates spells.go
- ✅ `scripts/generate_powers_from_xsd.py` - Generates powers.go
- ✅ `scripts/generate_critterpowers_from_xsd.py` - Generates critterpowers.go
- ✅ `scripts/generate_complexforms_from_xsd.py` - Generates complexforms.go
- ✅ `scripts/generate_programs_from_xsd.py` - Generates programs.go
- ✅ `scripts/generate_metamagic_from_xsd.py` - Generates metamagic.go

2. **Issues Resolved:**

- ✅ Fixed naming conflicts: `AllowGear` → `CyberwareAllowGear` in cyberware.go
- ✅ Fixed naming conflicts: `Cyberware` → `VehicleCyberwareItem` in vehicles.go (cross-file conflict)
- ✅ Fixed naming conflicts: `Quality` → `QualityItem`, `Qualities` → `QualityItems` in qualities.go
- ✅ Fixed naming conflicts: `CritterPowers` → `QualityCritterPowers`, `Powers` → `QualityPowers` in qualities.go
- ✅ Fixed naming conflicts: `IncludeInLimit` → `PowerIncludeInLimit` in powers.go
- ✅ Fixed naming conflicts: `Powers` → `PowerItems` in powers.go to avoid conflict with metatypes.go
- ✅ Fixed naming conflicts: `Category` → `BonusCategory` in common/bonuses.go (cross-file conflict)
- ✅ All generated files use proper import paths (`shadowmaster/pkg/...`)
- ✅ All linter errors resolved for Phase 4 files

3. **Generated Files:**

- ✅ `pkg/shadowrun/edition/v5/cyberware.go` - Cyberware structures with grades, mods, suites, and subsystems
- ✅ `pkg/shadowrun/edition/v5/qualities.go` - Quality structures with natural weapons, critter powers, and bonuses
- ✅ `pkg/shadowrun/edition/v5/spells.go` - Spell structures with categories
- ✅ `pkg/shadowrun/edition/v5/powers.go` - Power structures with enhancements
- ✅ `pkg/shadowrun/edition/v5/critterpowers.go` - Critter power structures
- ✅ `pkg/shadowrun/edition/v5/complexforms.go` - Complex form structures
- ✅ `pkg/shadowrun/edition/v5/programs.go` - Program structures with options
- ✅ `pkg/shadowrun/edition/v5/metamagic.go` - Metamagic and art structures

4. **Statistics:**

- All Phase 4 files use common abstractions (`BaseBonus`, `Visibility`, `SourceReference`, `Required`, `Forbidden`)
- Complex structures properly handle nested types and recursive references
- cyberware.go includes comprehensive cyberware system with grades, mods, suites, and subsystems
- qualities.go includes natural weapons, cost discounts, and quality-related bonuses
- All Phase 4 schemas successfully generated and compiled without errors

5. **Phase 4 Completion:**

- ✅ cyberware.xsd - Complex cyberware structures with grades, mods, suites
- ✅ qualities.xsd - Quality structures with bonuses, conditions, SchemaExtensions
- ✅ spells.xsd - Spell structures with categories and bonuses
- ✅ powers.xsd - Power structures with enhancements
- ✅ critterpowers.xsd - Critter power structures
- ✅ complexforms.xsd - Complex form structures
- ✅ programs.xsd - Program structures with options
- ✅ metamagic.xsd - Metamagic and art structures

### Completed Work (2024-12-XX) - Phase 5

**Phase 5: Root Schema - ✅ COMPLETE**

1. **Generation Script Created:**

- ✅ `scripts/generate_character_from_xsd.py` - Generates character.go

2. **Issues Resolved:**

- ✅ Fixed naming conflicts: All character-specific types prefixed with "Character" to avoid conflicts with existing types
- ✅ Fixed naming conflicts: `SkillGroups` → `CharacterSkillGroups`, `Skills` → `CharacterSkills`, `Spells` → `CharacterSpells`, `Powers` → `CharacterPowers`, `Spirit` → `CharacterSpirit`, `Spirits` → `CharacterSpirits`, `MartialArt` → `CharacterMartialArt`, `MartialArts` → `CharacterMartialArts`, `Weapons` → `CharacterWeapons`, `Cyberwares` → `CharacterCyberwares`, `Qualities` → `CharacterQualities`, `Gears` → `CharacterGears`, `VehicleModBonus` → `CharacterVehicleModBonus`, `VehicleMods` → `CharacterVehicleMods`, `VehicleGears` → `CharacterVehicleGears`, `VehicleWeapons` → `CharacterVehicleWeapons`, `Vehicle` → `CharacterVehicle`, `Vehicles` → `CharacterVehicles`, `CritterPower` → `CharacterCritterPower`, `CritterPowers` → `CharacterCritterPowers`
- ✅ All generated files use proper import paths (`shadowmaster/pkg/...`)
- ✅ All linter errors resolved for Phase 5 files

3. **Generated Files:**

- ✅ `pkg/shadowrun/edition/v5/character.go` - Complete character structures with all nested types, recursive references for gear, weapon, and cyberware

4. **Statistics:**

- character.go: Comprehensive character structure with all nested types including attributes, skills, contacts, spells, powers, spirits, tech programs, martial arts, armor, weapons, cyberware, qualities, lifestyles, gear, vehicles, metamagics, critter powers, initiation grades, improvements, expenses, and calendar
- All Phase 5 schemas successfully generated and compiled without errors

5. **Phase 5 Completion:**

- ✅ character.xsd - Root schema with complete character structure including all nested elements and recursive references

### Completed Work (2024-12-XX) - Missing Files Generation

**Step 1: Generate Missing Go Structs - ✅ COMPLETE**

1. **Generation Scripts Created:**

- ✅ `scripts/generate_books_from_xsd.py` - Generates books.go
- ✅ `scripts/generate_lifestyles_from_xsd.py` - Generates lifestyles.go
- ✅ `scripts/generate_armor_from_xsd.py` - Generates armor.go
- ✅ `scripts/generate_bioware_from_xsd.py` - Generates bioware.go

2. **Issues Resolved:**

- ✅ Fixed naming conflicts in lifestyles.go: `Lifestyle` → `LifestyleItem`, `Lifestyles` → `LifestyleItems`, `LifestyleQualities` → `LifestyleQualityItems` to avoid conflicts with character.go
- ✅ Fixed naming conflicts in armor.go: `ArmorMods` → `ArmorItemMods` to avoid conflict with character.go
- ✅ Removed unused import in books.go
- ✅ All generated files use proper import paths (`shadowmaster/pkg/...`)
- ✅ All linter errors resolved

3. **Generated Files:**

- ✅ `pkg/shadowrun/edition/v5/books.go` - Book structures with language matches
- ✅ `pkg/shadowrun/edition/v5/lifestyles.go` - Lifestyle structures with qualities, comforts, securities, cities, etc.
- ✅ `pkg/shadowrun/edition/v5/armor.go` - Armor and armor mod structures
- ✅ `pkg/shadowrun/edition/v5/bioware.go` - Bioware structures with grades, categories, and recursive subsystems

4. **Statistics:**

- Total Go struct files: 40 (up from 36)
- All 4 files successfully generated and compiled without errors
- All files use common abstractions where appropriate

### Completed Work (2024-12-XX) - Step 2

**Step 2: Missing XSD Files - ✅ COMPLETE**

1. **Generation Scripts Created:**

- ✅ `scripts/generate_drugcomponents_from_xsd.py` - Generates drugcomponents.go
- ✅ `scripts/generate_packs_from_xsd.py` - Generates packs.go
- ✅ `scripts/generate_priorities_from_xsd.py` - Generates priorities.go
- ✅ `scripts/generate_qualitylevels_from_xsd.py` - Generates qualitylevels.go
- ✅ `scripts/generate_ranges_from_xsd.py` - Generates ranges.go

2. **Issues Resolved:**

- ✅ Removed unused import in priorities.go (common package not needed)
- ✅ All generated files use proper import paths (`shadowmaster/pkg/...`)
- ✅ All linter errors resolved

3. **Generated Files:**

- ✅ `pkg/shadowrun/edition/v5/drugcomponents.go` - Drug component structures with grades and effects
- ✅ `pkg/shadowrun/edition/v5/packs.go` - Comprehensive pack structures with all nested types
- ✅ `pkg/shadowrun/edition/v5/priorities.go` - Priority structures with talents and metatypes
- ✅ `pkg/shadowrun/edition/v5/qualitylevels.go` - Quality level structures
- ✅ `pkg/shadowrun/edition/v5/ranges.go` - Range structures with modifiers

4. **Statistics:**

- Total Go struct files: 45 (up from 40)
- All 5 files successfully generated and compiled without errors
- packs.go includes comprehensive pack system with recursive gear structures

### Completed Work (2024-12-XX) - Step 3

**Step 3: XML Files Without XSD Schemas - ✅ COMPLETE**

1. **Generation Scripts Created:**

- ✅ `scripts/generate_actions_from_xml.py` - Generates actions.go
- ✅ `scripts/generate_contacts_from_xml.py` - Generates contacts.go
- ✅ `scripts/generate_improvements_from_xml.py` - Generates improvements.go
- ✅ `scripts/generate_licenses_from_xml.py` - Generates licenses.go
- ✅ `scripts/generate_lifemodules_from_xml.py` - Generates lifemodules.go
- ✅ `scripts/generate_options_from_xml.py` - Generates options.go
- ✅ `scripts/generate_settings_from_xml.py` - Generates settings.go
- ✅ `scripts/generate_sheets_from_xml.py` - Generates sheets.go
- ✅ `scripts/generate_spiritpowers_from_xml.py` - Generates spiritpowers.go
- ✅ `scripts/generate_strings_from_xml.py` - Generates strings.go
- ✅ `scripts/generate_tips_from_xml.py` - Generates tips.go

2. **Issues Resolved:**

- ✅ Fixed naming conflicts: `Contacts` → `ContactTypesList` in contacts.go to avoid conflict with character.go
- ✅ Fixed naming conflicts: `Improvement` → `ImprovementItem`, `Improvements` → `ImprovementItems` in improvements.go to avoid conflict with character.go
- ✅ Fixed naming conflicts: `SpiritPower` → `SpiritPowerItem`, `SpiritPowers` → `SpiritPowerItems` in spiritpowers.go to avoid conflict with traditions.go
- ✅ All generated files use proper import paths (`shadowmaster/pkg/...`)
- ✅ All linter errors resolved

3. **Generated Files:**

- ✅ `pkg/shadowrun/edition/v5/actions.go` - Action structures with tests
- ✅ `pkg/shadowrun/edition/v5/contacts.go` - Contact types and related structures
- ✅ `pkg/shadowrun/edition/v5/improvements.go` - Improvement definitions
- ✅ `pkg/shadowrun/edition/v5/licenses.go` - License types
- ✅ `pkg/shadowrun/edition/v5/lifemodules.go` - Life module system with stages, versions, and bonuses
- ✅ `pkg/shadowrun/edition/v5/options.go` - Configuration options (limb counts, PDF arguments, etc.)
- ✅ `pkg/shadowrun/edition/v5/settings.go` - Game settings with comprehensive field definitions
- ✅ `pkg/shadowrun/edition/v5/sheets.go` - Sheet definitions with language support
- ✅ `pkg/shadowrun/edition/v5/spiritpowers.go` - Spirit power items
- ✅ `pkg/shadowrun/edition/v5/strings.go` - String constants (matrix attributes, elements, etc.)
- ✅ `pkg/shadowrun/edition/v5/tips.go` - Tip structures with required/forbidden conditions

4. **Statistics:**

- Total Go struct files: 56 (up from 45)
- All 11 files successfully generated and compiled without errors
- All files follow established patterns and use common abstractions where applicable
- settings.go includes comprehensive struct with 100+ fields for game configuration
- lifemodules.go includes complex nested structures for life module system

### Remaining Work

**Step 2: Missing XSD Files (Not in Plan) - ✅ COMPLETE**

The following XSD files exist but were never added to the plan:

1. **drugcomponents.xsd** - ✅ COMPLETE

- Output: `drugcomponents.go` ✅
- Types: `DrugGrade`, `DrugGrades`, `DrugEffect`, `DrugEffects`, `DrugComponent`, `DrugComponents`, `DrugComponentsChummer` ✅
- Uses: `common.Visibility`, `common.SourceReference` ✅
- Status: Complete

2. **packs.xsd** - ✅ COMPLETE

- Output: `packs.go` ✅
- Types: `Pack`, `Packs`, `PacksChummer`, and all nested pack structures (qualities, attributes, skills, powers, programs, spells, spirits, cyberwares, biowares, armors, weapons, gears, vehicles, lifestyles) ✅
- Status: Complete

3. **priorities.xsd** - ✅ COMPLETE

- Output: `priorities.go` ✅
- Types: `Priority`, `Priorities`, `PrioritiesChummer`, `PriorityTalent`, `PriorityTalents`, `PriorityMetatype`, `PriorityMetatypes`, `PriorityMetavariant`, `PriorityMetavariants` ✅
- Status: Complete

4. **qualitylevels.xsd** - ✅ COMPLETE

- Output: `qualitylevels.go` ✅
- Types: `QualityLevel`, `QualityLevels`, `QualityGroup`, `QualityGroups`, `QualityLevelsChummer` ✅
- Status: Complete

5. **ranges.xsd** - ✅ COMPLETE

- Output: `ranges.go` ✅
- Types: `RangeModifiers`, `Range`, `Ranges`, `RangesChummer` ✅
- Status: Complete

**Step 3: XML Files Without XSD Schemas - ✅ COMPLETE**

The following XML files have no corresponding XSD schemas and were generated by analyzing XML structure directly:

1. **actions.xml** - ✅ COMPLETE

- Output: `actions.go` ✅
- Types: `Action`, `Actions`, `ActionTest`, `ActionsChummer` ✅
- Status: Complete

2. **contacts.xml** - ✅ COMPLETE

- Output: `contacts.go` ✅
- Types: `ContactTypesList`, `Genders`, `Ages`, `PersonalLives`, `ContactTypes`, `PreferredPayments`, `HobbiesVices`, `ContactsChummer` ✅
- Note: Renamed `Contacts` → `ContactTypesList` to avoid conflict with character.go ✅
- Status: Complete

3. **improvements.xml** - ✅ COMPLETE

- Output: `improvements.go` ✅
- Types: `ImprovementItem`, `ImprovementItems`, `ImprovementFields`, `ImprovementsChummer` ✅
- Note: Renamed `Improvement` → `ImprovementItem`, `Improvements` → `ImprovementItems` to avoid conflict with character.go ✅
- Status: Complete

4. **licenses.xml** - ✅ COMPLETE

- Output: `licenses.go` ✅
- Types: `Licenses`, `LicensesChummer` ✅
- Status: Complete

5. **lifemodules.xml** - ✅ COMPLETE

- Output: `lifemodules.go` ✅
- Types: `LifeModuleStage`, `LifeModuleStages`, `LifeModule`, `LifeModules`, `LifeModuleVersion`, `LifeModuleVersions`, `LifeModuleBonus`, and all nested bonus structures ✅
- Status: Complete

6. **options.xml** - ✅ COMPLETE

- Output: `options.go` ✅
- Types: `Limb`, `LimbCounts`, `PDFArgument`, `PDFArguments`, `PDFAppNames`, `BlackMarketPipelineCategories`, `Avail`, `AvailMap`, `OptionsChummer` ✅
- Status: Complete

7. **settings.xml** - ✅ COMPLETE

- Output: `settings.go` ✅
- Types: `Setting`, `Settings`, `SettingsChummer`, `KarmaCost`, `SettingBooks`, `BannedWareGrades`, `RedlineExclusion` ✅
- Note: Comprehensive struct with all setting fields (100+ fields) ✅
- Status: Complete

8. **sheets.xml** - ✅ COMPLETE

- Output: `sheets.go` ✅
- Types: `Sheet`, `Sheets`, `SheetsChummer` ✅
- Status: Complete

9. **spiritpowers.xml** - ✅ COMPLETE

- Output: `spiritpowers.go` ✅
- Types: `SpiritPowerItem`, `SpiritPowerItems`, `SpiritPowersChummer` ✅
- Note: Renamed `SpiritPower` → `SpiritPowerItem`, `SpiritPowers` → `SpiritPowerItems` to avoid conflict with traditions.go ✅
- Status: Complete

10. **strings.xml** - ✅ COMPLETE

- Output: `strings.go` ✅
- Types: `MatrixAttributes`, `Elements`, `Immunities`, `SpiritCategories`, `StringsChummer` ✅
- Status: Complete

11. **tips.xml** - ✅ COMPLETE

- Output: `tips.go` ✅
- Types: `Tip`, `Tips`, `TipsChummer` ✅
- Uses: `common.Required`, `common.Forbidden` ✅
- Status: Complete

### Notes for Future Work

1. **Type Naming Conflicts:**

- Check types in conditions.go were renamed to avoid conflicts:
- `Gear` → `GearCheck`
- `Quality` → `QualityCheck`
- `Spellcategory` → `SpellcategoryCheck`
- Phase 2: `Category` → `SkillCategory` to avoid conflict with `common.Category`
- This pattern may need to be applied to other schemas if conflicts arise

2. **Selectweapon Type:**

- The `Selectweapon` type was not generated by the script but exists in bonuses.xsd
- Manually added to bonuses.go - may need to investigate why script missed it

3. **Common Abstractions Usage:**

- The common abstractions (SourceReference, Visibility, Grade, Category) are ready to use
- Phase 2 files successfully use `common.Visibility` and `common.SourceReference`
- All newly generated files (books, armor, bioware, lifestyles) use common abstractions where appropriate
- This reduces duplication and improves consistency

4. **Next Steps:**

- ✅ Phase 2: Process standalone schemas (skills.xsd, references.xsd) - COMPLETE
- ✅ Phase 3: Process simple dependencies - COMPLETE
- ✅ Phase 4: Process complex dependencies - COMPLETE
- ✅ Phase 5: Process root schema (character.xsd) - COMPLETE
- ✅ Step 1: Generate missing Go structs (books, armor, bioware, lifestyles) - COMPLETE
- ✅ Step 2: Add and process 5 missing XSD files (drugcomponents, packs, priorities, qualitylevels, ranges) - COMPLETE
- ✅ Step 3: Investigate and handle 11 XML files without XSD schemas - COMPLETE

5. **Generation Script Improvements:**

- Consider enhancing scripts to detect and handle type conflicts automatically
- Add validation to ensure all types from XSD are generated
- Consider adding batch processing for very large schemas (as mentioned in plan)