# Data Verification Plan

## Overview

This plan defines a systematic approach for verifying game data in `data/editions/sr5/*.json` against reference documentation in `docs/archive/web_pages/`. The verification process is semi-automated with human review, designed to be re-run after changes to ensure data accuracy.

## Goals

1. **Completeness**: Ensure all items from specified source books are present
2. **Accuracy**: Verify item stats match reference documentation
3. **Consistency**: Check for duplicates, naming conventions, ID patterns
4. **Source Compliance**: Flag items from unspecified sources for review

## Directory Structure

```
data/editions/sr5/              # JSON data files
  core-rulebook.json            # Core rulebook data (source: "Core")
  # Future: run-and-gun.json, chrome-flesh.json, etc.

docs/archive/web_pages/         # Reference documentation (193 files)
  SR5_*.md                      # Source material with item tables

scripts/                        # Verification scripts
  verify-data.ts                # Main verification script

docs/capabilities/plans/        # This plan and outputs
  data-verification.plan.md     # This document
  verification-reports/         # Generated reports
```

## Reference File Mapping

### Weapons (`modules.gear.payload.weapons.*`)

| JSON Path                 | Reference Files                                                                                                                                                                              | Source Filter     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `weapons.melee`           | SR5_Weapons_Blades.md, SR5_Weapons_Clubs.md, SR5_Weapons_Exotic_Melee_Weapons.md, SR5_Weapons_Implant_Melee_Weapons.md, SR5_Weapons_Improvised_Weapons.md, SR5_Weapons_Misc_Melee_Weapons.md | Core, supplements |
| `weapons.pistols`         | SR5_Weapons_Hold-Out_Pistol.md, SR5_Weapons_Light_Pistol.md, SR5_Weapons_Heavy_Pistol.md, SR5_Weapons_Machine_Pistol.md                                                                      | Core, supplements |
| `weapons.smgs`            | SR5_Weapons_Submachine_Gun.md                                                                                                                                                                | Core, supplements |
| `weapons.rifles`          | SR5_Weapons_Assault_Rifle.md, SR5_Weapons_Sporting_Rifle.md                                                                                                                                  | Core, supplements |
| `weapons.shotguns`        | SR5_Weapons_Shotgun.md                                                                                                                                                                       | Core, supplements |
| `weapons.sniperRifles`    | SR5_Weapons_Sniper_Rifle.md                                                                                                                                                                  | Core, supplements |
| `weapons.throwingWeapons` | SR5_Weapons_Throwing_Weapons.md                                                                                                                                                              | Core, supplements |
| `weapons.grenades`        | SR5_Ammo_Grenade.md, SR5_Ammo_Rocket.md                                                                                                                                                      | Core, supplements |

### Weapon Modifications (`modules.modifications.payload.weaponMods`)

| JSON Path    | Reference Files            | Source Filter     |
| ------------ | -------------------------- | ----------------- |
| `weaponMods` | SR5_Firearm_Accessories.md | Core, supplements |

### Armor (`modules.gear.payload.armor`)

| JSON Path | Reference Files                                   | Source Filter     |
| --------- | ------------------------------------------------- | ----------------- |
| `armor`   | SR5_Armor_Clothing.md, SR5_Environmental_Armor.md | Core, supplements |

### Armor Modifications (`modules.modifications.payload.armorMods`)

| JSON Path   | Reference Files  | Source Filter     |
| ----------- | ---------------- | ----------------- |
| `armorMods` | SR5_Armor_Mod.md | Core, supplements |

### Cyberware (`modules.cyberware.payload.catalog`)

| JSON Path                 | Reference Files                                          | Source Filter     |
| ------------------------- | -------------------------------------------------------- | ----------------- |
| `catalog` (headware)      | SR5_Cyberware_Head.md                                    | Core, supplements |
| `catalog` (eyeware)       | SR5_Cyberware_Eye.md                                     | Core, supplements |
| `catalog` (earware)       | SR5_Cyberware_Ear.md                                     | Core, supplements |
| `catalog` (bodyware)      | SR5_Cyberware_Body.md                                    | Core, supplements |
| `catalog` (cyberlimbs)    | SR5_Cyberware_Limb.md, SR5_Cyberware_Limb_Accessories.md | Core, supplements |
| `catalog` (cyber weapons) | SR5_Cyberware_Weapon.md                                  | Core, supplements |
| `catalog` (other)         | SR5_Cyberware_Other.md                                   | Core, supplements |

### Bioware (`modules.bioware.payload.catalog`)

| JSON Path            | Reference Files         | Source Filter     |
| -------------------- | ----------------------- | ----------------- |
| `catalog` (basic)    | SR5_Bioware_Basic.md    | Core, supplements |
| `catalog` (cultured) | SR5_Bioware_Cultured.md | Core, supplements |
| `catalog` (other)    | SR5_Bioware_Other.md    | Core, supplements |

### Vehicles & Drones (`modules.vehicles.payload.*`)

| JSON Path     | Reference Files                                                                                         | Source Filter     |
| ------------- | ------------------------------------------------------------------------------------------------------- | ----------------- |
| `groundcraft` | SR5_Vehicle_Groundcraft.md                                                                              | Core, supplements |
| `watercraft`  | SR5_Vehicle_Watercraft.md                                                                               | Core, supplements |
| `aircraft`    | SR5_Vehicle_Aircraft.md                                                                                 | Core, supplements |
| `drones`      | SR5_Micro_Drones.md, SR5_Mini_Drones.md, SR5_Small_Drones.md, SR5_Medium_Drones.md, SR5_Large_Drones.md | Core, supplements |

### Vehicle Modifications

| JSON Path     | Reference Files                                         | Source Filter     |
| ------------- | ------------------------------------------------------- | ----------------- |
| (to be added) | SR5_Vehicle_Modifications.md, SR5_Vehicle_Mods_Lists.md | Core, supplements |

### Electronics & Gear (`modules.gear.payload.*`)

| JSON Path     | Reference Files                                                             | Source Filter     |
| ------------- | --------------------------------------------------------------------------- | ----------------- |
| `commlinks`   | SR5_Matrix_Basics.md, SR5_Electronics_Commlink_Mod.md                       | Core, supplements |
| `cyberdecks`  | SR5*Cyberdecks*.md, SR5_Matrix_Cyberdecks.md                                | Core, supplements |
| `electronics` | SR5_Gear_Lists_Electronics.md, SR5_Other_Devices_Imaging.md, SR5_Sensors.md | Core, supplements |
| `tools`       | SR5_Gear_Lists_Others.md                                                    | Core, supplements |
| `survival`    | SR5_Survival_Gear.md                                                        | Core, supplements |
| `medical`     | SR5_Gear_Lists_Medical.md, SR5_Health_Gear_DocWagon_Contract.md             | Core, supplements |
| `security`    | SR5*Gear_Lists_Security.md, SR5_Security*\*.md                              | Core, supplements |
| `ammunition`  | SR5_Ammo_Ammunition.md, SR5_Ammo_Arrowhead.md                               | Core, supplements |

### Matrix Programs (`modules.programs.payload.*`)

| JSON Path | Reference Files        | Source Filter     |
| --------- | ---------------------- | ----------------- |
| `common`  | SR5_Matrix_Programs.md | Core, supplements |
| `hacking` | SR5_Matrix_Programs.md | Core, supplements |

### Magic (`modules.magic.payload.*`)

| JSON Path       | Reference Files                                                                                                         | Source Filter     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `traditions`    | SR5_Magic_Traditions.md                                                                                                 | Core, supplements |
| `spells.*`      | SR5_Spells_Combat.md, SR5_Spells_Detection.md, SR5_Spells_Health.md, SR5_Spells_Illusion.md, SR5_Spells_Manipulation.md | Core, supplements |
| `complexForms`  | SR5_Matrix_Complex_Forms.md                                                                                             | Core, supplements |
| `mentorSpirits` | SR5_Mentor_Spirits.md                                                                                                   | Core, supplements |
| `rituals`       | SR5_Ritual_List.md                                                                                                      | Core, supplements |

### Adept Powers (`modules.adeptPowers.payload.powers`)

| JSON Path | Reference Files                               | Source Filter     |
| --------- | --------------------------------------------- | ----------------- |
| `powers`  | SR5_Adept_Powers.md, SR5_Adept_Powers_List.md | Core, supplements |

### Spirits (`modules.spirits.payload.*`)

| JSON Path        | Reference Files                            | Source Filter     |
| ---------------- | ------------------------------------------ | ----------------- |
| `spiritTypes`    | SR5_Spirits_Basic.md, SR5_Magic_Spirits.md | Core, supplements |
| `optionalPowers` | SR5_Critter_Powers.md                      | Core, supplements |

### Qualities (`modules.qualities.payload.*`)

| JSON Path  | Reference Files           | Source Filter     |
| ---------- | ------------------------- | ----------------- |
| `positive` | SR5_Positive_Qualities.md | Core, supplements |
| `negative` | SR5_Negative_Qualities.md | Core, supplements |

### Skills (`modules.skills.payload.*`)

| JSON Path      | Reference Files                                        | Source Filter     |
| -------------- | ------------------------------------------------------ | ----------------- |
| `activeSkills` | SR5_Active_Skills.md, SR5_Skill_Lists_Active_Skills.md | Core, supplements |
| `skillGroups`  | SR5_Skill_List.md                                      | Core, supplements |

## Source Book Codes

The verification script recognizes these source codes from reference files:

| Code       | Book Name           | Status          |
| ---------- | ------------------- | --------------- |
| `Core`     | SR5 Core Rulebook   | Implemented     |
| `SR5:R&G`  | Run & Gun           | Not implemented |
| `SR5:CF`   | Chrome Flesh        | Not implemented |
| `SR5:HT`   | Hard Targets        | Not implemented |
| `SR5:SG`   | Street Grimoire     | Not implemented |
| `SR5:DT`   | Data Trails         | Not implemented |
| `SR5:RG`   | Rigger 5.0          | Not implemented |
| `SR5:CA`   | Cutting Aces        | Not implemented |
| `SR5:SASS` | Stolen Souls        | Not implemented |
| `SR5:GH3`  | Gun Heaven 3        | Not implemented |
| (others)   | Various supplements | Flag for review |

## Verification Checks

### 1. Missing Items (Priority 1)

- Items in reference marked with allowed source but missing from JSON
- Grouped by category for bulk addition

### 2. Data Accuracy (Priority 2)

- Compare numeric fields: cost, availability, damage, AP, etc.
- Compare string fields: name, mode, ammo type
- Flag discrepancies with expected vs actual values

### 3. Duplicate Detection (Priority 3)

- Items with same name but different IDs
- Items with similar IDs (naming convention issues)
- Exact duplicates (same data, different entries)

### 4. Source Compliance (Priority 4)

- Items present in JSON but from non-allowed sources
- Options: remove, move to sourcebook file, or keep with flag

### 5. Naming Consistency (Priority 5)

- ID format: kebab-case, no special characters
- Name format: proper capitalization
- Category/subcategory alignment

## Running Verification

### Command Line Interface

```bash
# Verify all categories against Core only
pnpm verify-data -- --sources Core

# Verify specific categories
pnpm verify-data -- --sources Core --categories weapons,cyberware,bioware

# Verify with all implemented sources
pnpm verify-data -- --sources Core,SR5:R&G

# Generate reports only (no interactive fixes)
pnpm verify-data -- --sources Core --report-only

# Specify output directory
pnpm verify-data -- --sources Core --output ./reports/2024-01-04

# Show help
pnpm verify-data -- --help
```

Note: Use `--` after `pnpm verify-data` to pass arguments to the script.

### Configuration File

Create `verify-data.config.json` in project root:

```json
{
  "edition": "sr5",
  "sources": ["Core"],
  "categories": ["weapons", "cyberware", "bioware", "armor", "gear"],
  "outputDir": "docs/capabilities/plans/verification-reports",
  "checks": {
    "missingItems": true,
    "dataAccuracy": true,
    "duplicates": true,
    "sourceCompliance": true,
    "namingConsistency": true
  }
}
```

## Output Format

### Human-Readable Report (Markdown)

```
verification-report-YYYY-MM-DD.md
```

Contains:

- Summary statistics
- Findings by priority
- Specific items with discrepancies
- Recommended actions

### Machine-Readable Report (JSON)

```
verification-report-YYYY-MM-DD.json
```

Contains:

- Structured findings for automated processing
- Item IDs, paths, expected/actual values
- Action recommendations with confidence scores

## Adding New Categories

1. **Identify reference files** in `docs/archive/web_pages/`
2. **Map to JSON path** in the core-rulebook.json structure
3. **Add to Reference File Mapping** table above
4. **Create parser** for the reference file format (tables vary)
5. **Add category handler** to verification script

## Adding New Source Books

1. **Create book JSON file**: `data/editions/sr5/{book-name}.json`
2. **Add source code** to Source Book Codes table
3. **Update edition.json** to include the book
4. **Run verification** with new source included

## Workflow

### Initial Audit

1. Run verification with `--report-only`
2. Review markdown report for scope
3. Prioritize findings by category
4. Process fixes in batches
5. Commit changes with descriptive messages

### Post-Change Verification

1. Run verification after data changes
2. Compare with previous report
3. Ensure no regressions
4. Document any intentional deviations

### Periodic Maintenance

1. Schedule monthly verification runs
2. Track trends in data quality
3. Update reference files if source material changes
4. Expand coverage to new categories/sources

## File Locations

| Purpose             | Location                                            |
| ------------------- | --------------------------------------------------- |
| This plan           | `docs/capabilities/plans/data-verification.plan.md` |
| Verification script | `scripts/verify-data.ts`                            |
| Configuration       | `verify-data.config.json` (project root)            |
| Reports output      | `docs/capabilities/plans/verification-reports/`     |
| Reference docs      | `docs/archive/web_pages/SR5_*.md`                   |
| Data files          | `data/editions/sr5/*.json`                          |

## Current Status

### Implemented Categories

- [x] Weapons (melee, pistols, SMGs, rifles, shotguns, sniper rifles)
- [x] Weapon Modifications
- [x] Cyberware
- [x] Bioware
- [ ] Armor
- [ ] Electronics/Gear
- [ ] Vehicles/Drones
- [ ] Magic (spells, traditions, rituals)
- [ ] Adept Powers
- [ ] Qualities
- [ ] Skills

### Implemented Sources

- [x] Core Rulebook
- [ ] Run & Gun
- [ ] Chrome Flesh
- [ ] Other supplements
