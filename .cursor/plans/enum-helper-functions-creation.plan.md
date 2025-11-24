# Enum Helper Functions Creation Plan

## Overview

Create helper functions (`GetAll[EnumName]Values()` and `GetAll[EnumName]Strings()`) for all enum types in `pkg/shadowrun/edition/v5` to enable easy listing of enum values for UI dropdowns and API responses.

## Strategy

- Identify all enum types (types with const blocks)
- Identify enum candidates (string types with limited, well-defined values)
- Create helper functions following consistent pattern
- Group related enums by file/domain

---

## Phase 1: Existing Enum Types with Const Blocks ✅ COMPLETED

### Files: `common/enums.go`, `common/conditions.go`, `common/schema_extensions.go`

- [x] PersonalLife (7 values)
- [x] DamageType (2 values)
- [x] UseRange (2 values)
- [x] SpellElement (5 values)
- [x] Language (6 values)
- [x] AttributeName (10 values)
- [x] CanFormPersona (2 values)
- [x] ConditionType (2 values)
- [x] Boolean (2 values)

**Status**: ✅ All existing enum types with const blocks now have helper functions.

---

## Phase 2: New Enum Types from Enum Candidates ✅ COMPLETED

### File: `common/enums.go`

- [x] BuildMethod (4 values: Karma, LifeModule, Priority, SumtoTen)
- [x] DrugEffectAttributeType (3 values: Mental, Physical, Social)
- [x] AddWeapon (4 values: shield types)
- [x] SynthlinkType (2 values: External, Internal)
- [x] PriorityCategory (5 values: Attributes, Heritage, Resources, Skills, Talent)
- [x] KnowledgeSkillCategory (5 values: Academic, Interest, Language, Professional, Street)

**Status**: ✅ Created 6 new enum types with helper functions.

---

## Phase 3: Weapon & Combat Related Enums ✅ COMPLETED

### Files: `weapons.go`, `armor.go`, `ranges.go`

- [x] WeaponCategory (9 values: Assault Cannons, Grenade Launchers, Heavy Machine Guns, Light Machine Guns, Medium Machine Guns, Missile Launchers, Shotguns, Sniper Rifles, Sporting Rifles)
- [x] ActiveSkillGroup (15 values: Acting, Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery, Stealth, Tasking)
- [ ] WeaponType (if exists - skipped, not found)
- [ ] AmmoCategory (if exists - skipped, not found)
- [ ] RangeCategory (from ranges.go - skipped, values are formulas not enums)

**Status**: ✅ Phase 3 completed - Added 2 enum types

---

## Phase 4: Skill Related Enums ✅ COMPLETED

### Files: `skills.go`, `lifemodules.go`

- [x] ActiveSkillGroup (15 values: Acting, Athletics, Biotech, Close Combat, Conjuring, Cracking, Electronics, Enchanting, Engineering, Firearms, Influence, Outdoors, Sorcery, Stealth, Tasking) - Added in Phase 3
- [x] KnowledgeSkillCategory (5 values: Academic, Interest, Language, Professional, Street) - Added in Phase 2
- [x] LifeModuleSkillGroup (alias to ActiveSkillGroup for domain clarity)

**Status**: ✅ Phase 4 completed - All skill-related enums covered

---

## Phase 5: Magic & Matrix Related Enums ✅ COMPLETED

### Files: `spells.go`, `traditions.go`, `complexforms.go`, `programs.go`, `streams.go`

- [x] SpellCategory (7 values: Combat, Detection, Enchantments, Health, Illusion, Manipulation, Rituals)
- [x] SpellRange (7 values: LOS, LOS (A), S, S (A), Special, T, T (A))
- [x] ComplexFormTarget (9 values: Cyberware, Device, File, Host, IC, Icon, Persona, Self, Sprite)
- [x] ProgramCategory (5 values: Advanced Programs, Autosofts, Common Programs, Hacking Programs, Software)
- [x] SpriteType (7 values: Companion Sprite, Courier Sprite, Crack Sprite, Data Sprite, Fault Sprite, Generalist Sprite, Machine Sprite)
- [ ] SpellType (skipped - too generic: I, P, S, Special - conflicts with other duration types)
- [ ] ComplexFormDuration (skipped - formulas like L, L+0, L+1, etc. are not clean enums)
- [ ] TraditionSpiritType (skipped - varies by tradition and spell category, too complex)

**Status**: ✅ Phase 5 completed - Added 5 enum types

---

## Phase 6: Character Creation & Advancement Enums ✅ COMPLETED

### Files: `priorities.go`, `metatypes.go`, `qualities.go`, `paragons.go`

- [x] ParagonWeaponType (12 values: Archery, Automatics, Blades, Clubs, Exotic Melee Weapon, Exotic Ranged Weapon, Gunnery, Heavy Weapons, Longarms, Pistols, Throwing Weapons, Unarmed Combat)
- [ ] QualityType (skipped - not found as enum, qualities use separate Positive/Negative structs)
- [ ] MetatypeCategory (skipped - not found as enum)

**Status**: ✅ Phase 6 completed - Added 1 enum type

---

## Phase 7: Vehicle & Equipment Enums ✅ COMPLETED

### Files: `vehicles.go`, `vessels.go`, `packs.go`

- [x] VehicleControlType (3 values: Manual [SR5], None, Remote [SR5])
- [x] VehicleMountFlexibility (2 values: Flexible [SR5], None)
- [x] VehicleMountSize (11 values: Built-In, Heavy, Heavy (Drone), Heavy [SR5], Huge (Drone), Large (Drone), Light, Mini (Drone), Small (Drone), Standard, Standard (Drone))
- [x] VehicleMountVisibility (2 values: External [SR5], None)
- [x] VesselMaterialType (9 values: Armored/Reinforced Material, Average Material, Cheap Material, Fragile Material, Hardened Material, Heavy Material, Heavy Structural Material, Reinforced Material, Structural Material)
- [x] PackEnhancementType (2 values: Audio Enhancements, Vision Enhancements) - Added in Phase 10

**Status**: ✅ Phase 7 completed - Added 5 enum types

---

## Phase 8: Critter & Power Related Enums ✅ COMPLETED

### Files: `critters.go`, `critterpowers.go`, `powers.go`, `paragons.go`

- [x] CritterPowerAction (7 values: As ritual, Auto, Complex, Free, None, Simple, Special)
- [x] PowerActionType (5 values: Complex, Free, Interrupt, Simple, Special)
- [x] ParagonWeaponType (12 values: Archery, Automatics, Blades, Clubs, etc.) - Added in Phase 6
- [ ] CritterPowerAttribute (skipped - duplicates AttributeName enum)
- [ ] CritterPowerRange (skipped - too many formula-based values)
- [ ] CritterPowerDuration (skipped - too many formula-based values)

**Status**: ✅ Phase 8 completed - Added 1 enum type (2 already added in Phase 6)

---

## Phase 9: Settings & Options Enums ✅ COMPLETED

### Files: `settings.go`, `options.go`, `mentors.go`

- [x] EquipmentCategory (11 values: Armor, Bioware, Cyberware, Drugs, Electronics, Geneware, Magic, Nanoware, Software, Vehicles, Weapons)
- [x] MentorSkillCategory (4 values: Physical Active, Social Active, Technical Active, Vehicle Active)
- [ ] PDFViewerType (skipped - too specific to PDF viewer implementation, not core game data)

**Status**: ✅ Phase 9 completed - Added 2 enum types

---

## Phase 10: Remaining Miscellaneous Enums ✅ COMPLETED

### Files: Various

- [x] EchoAttributeType (2 values: LOG, WIL)
- [x] BiowareAttributeType (2 values: INT, LOG)
- [x] PackEnhancementType (2 values: Audio Enhancements, Vision Enhancements)

**Status**: ✅ Phase 10 completed - Added 3 enum types

---

## Summary

- **Total Phases**: 10
- **Completed**: 10 phases (ALL PHASES COMPLETE!) ✅✅✅
- **In Progress**: 0 phases
- **Pending**: 0 phases

### Progress Statistics

- **Total Enum Types Created**: 33
- **Total Helper Functions**: 66 (2 per enum type)
- **Files Modified**: 
- `pkg/shadowrun/edition/v5/common/enums.go` (main enum definitions)
- `pkg/shadowrun/edition/v5/common/conditions.go` (ConditionType)
- `pkg/shadowrun/edition/v5/common/schema_extensions.go` (Boolean)

## Notes

- All helper functions follow the pattern:
- `GetAll[EnumName]Values() []EnumType` - returns typed enum values
- `GetAll[EnumName]Strings() []string` - returns string values for JSON/UI
- Enum types are added to `common/enums.go` unless they're domain-specific
- Focus on enums with clear, limited values (typically 2-10 values)
- Skip enums with too many values or values that are too dynamic