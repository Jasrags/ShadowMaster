# Verify Reference Data

Run the hybrid verification pipeline to compare extracted reference material against edition data files.

## Usage

```
/verify-reference                          # Run all mapping configs
/verify-reference street-gear-weapons-armor # Run specific mapping by name
/verify-reference --fix                    # Run and attempt semantic fixes
```

## Phase 1 — Structural Verification (Script)

Run `pnpm verify-reference` to execute structural checks:

```bash
# All mappings
pnpm verify-reference

# Specific mapping
pnpm verify-reference --mapping docs/references/sr5-core-rulebook/mappings/street-gear-weapons-armor.json

# System domain aggregation — verify all mappings targeting a domain across all books
pnpm verify-reference --system gear
pnpm verify-reference --system qualities
pnpm verify-reference --system magic

# List available system domains
pnpm verify-reference --list-systems

# JSON output for programmatic analysis
pnpm verify-reference --json
pnpm verify-reference --system gear --json
```

### System Domains

The `--system` flag aggregates mappings by data path domain, scanning all books. The registry is at `docs/references/systems.json`. Available systems: gear, matrix, vehicles, magic, combat, qualities, skills, cyberware, critters, character.

The script compares reference JSON tables against edition data files using mapping configs
in `docs/references/*/mappings/*.json`. It reports:

- **Missing items** (error): Reference item not found in data
- **Value mismatches** (error): Field values differ between reference and data
- **Missing categories** (error): Data path doesn't exist
- **Missing fields** (warning): Required field absent from data item

## Phase 2 — Semantic Analysis (Manual)

After reviewing the script output, analyze findings to determine:

1. **Real data bugs** — Wrong values that need fixing in edition JSON
2. **Format normalization gaps** — Add handling to `valuesMatch()` in `scripts/verify-reference.ts`
3. **Mapping config issues** — Wrong data path, missing field maps, name mismatches
4. **Reference extraction errors** — Incorrect values in `docs/references/` JSON files

### Triage Process

For each value-mismatch error:

1. Check the reference JSON against the source PDF
2. Check the data JSON for the actual stored value
3. Determine if the reference or data is wrong
4. If both are correct but formats differ, add normalization to `valuesMatch()`

For missing items:

1. Check if the item exists under a different name (naming convention mismatch)
2. Check if the item is in a different data category
3. If truly missing, file a GitHub issue under milestone v1.7

## Phase 3 — Fix and Re-verify

After making fixes:

1. Run `pnpm verify-reference` again to confirm reduction in findings
2. Commit the fixes with descriptive messages
3. Update GitHub issues if gaps were resolved

## Mapping Config Format

```json
{
  "referenceFile": "docs/references/{book-slug}/{section-slug}.json",
  "dataFile": "data/editions/sr5/{book-slug}.json",
  "description": "Human-readable description",
  "mappings": [
    {
      "referenceTable": "table-key-in-json",
      "dataPath": ["modules", "category", "payload", "subcategory"],
      "matchField": "name",
      "fieldMap": {
        "referenceColumn": "dataFieldName"
      },
      "requiredDataFields": ["field1", "field2"]
    }
  ]
}
```

## Creating New Mapping Configs

1. Read the reference JSON to identify tables and their columns
2. Read the data JSON to find the corresponding data path and field names
3. Create field mappings between reference columns and data fields
4. List required data fields that should exist on every matched item
5. Place the config in `docs/references/{book-slug}/mappings/{section-slug}.json`
6. Run `pnpm verify-reference` to test

## Current Coverage

Mapping configs exist for:

- `sr5-core-rulebook/creating-a-shadowrunner` — 4 tables (qualities, metatypes, lifestyles)
- `sr5-core-rulebook/skills` — 2 tables (active skills, skill groups)
- `sr5-core-rulebook/magic` — 3 tables (foci bonding, magical goods, mentor spirits)
- `sr5-core-rulebook/the-matrix` — 4 tables (programs common/hacking, complex forms, cyberdecks)
- `sr5-core-rulebook/riggers` — 2 tables (RCCs, autosofts)
- `sr5-core-rulebook/street-gear-weapons-armor` — 18 tables (melee, firearms, ammo, grenades, armor)
- `sr5-core-rulebook/street-gear-electronics-cyber` — 30 tables (commlinks, cyberdecks, cyber/bioware)
- `sr5-core-rulebook/street-gear-vehicles-drones` — 5 tables (ground, water, air, drones, mods)
- `sr5-core-rulebook/helps-and-hindrances` — 9 tables (critters, toxins, drugs)
- `sr5-run-faster/positive-qualities` — 1 table (35 qualities)
- `sr5-run-faster/negative-qualities` — 1 table (47 qualities)
