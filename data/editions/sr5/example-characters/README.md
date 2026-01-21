# SR5 Example Character Fixtures

This directory contains JSON fixture files for all 16 example characters from the Shadowrun 5th Edition Core Rulebook. These fixtures serve as:

1. **Reference implementations** - Demonstrate correct character structure
2. **Test data** - Used in unit tests and validation
3. **Recreation validation** - Verify UI can recreate rulebook characters

## Character List

| File                        | Archetype      | Metatype | Magical Path | Priority Focus                     |
| --------------------------- | -------------- | -------- | ------------ | ---------------------------------- |
| `face-elf.json`             | Face           | Elf      | Mundane      | Social skills                      |
| `gang-leader-ork.json`      | Gang Leader    | Ork      | Mundane      | Leadership + cyberarm              |
| `bounty-hunter-troll.json`  | Bounty Hunter  | Troll    | Mundane      | Tracking + legal SIN               |
| `infiltrator-dwarf.json`    | Infiltrator    | Dwarf    | Mundane      | B&E + stealth cyberware            |
| `mercenary-human.json`      | Mercenary      | Human    | Mundane      | Heavy weapons + vehicles           |
| `street-samurai-ork.json`   | Street Samurai | Ork      | Mundane      | Heavy cyberware (0.88 essence)     |
| `combat-mage-human.json`    | Combat Mage    | Human    | Magician     | Hermetic tradition, combat spells  |
| `shaman-elf.json`           | Shaman         | Elf      | Magician     | Shamanic tradition, Bear mentor    |
| `alchemist-human.json`      | Alchemist      | Human    | Magician     | Alchemy focus, Snake mentor        |
| `decker-dwarf.json`         | Decker         | Dwarf    | Mundane      | Matrix specialist + cyberdeck      |
| `technomancer-human.json`   | Technomancer   | Human    | Technomancer | Living Persona + complex forms     |
| `drone-rigger-ork.json`     | Drone Rigger   | Ork      | Mundane      | Control Rig 2 + drone fleet        |
| `rigger-troll.json`         | Rigger         | Troll    | Mundane      | Vehicle specialist + armed fleet   |
| `tribal-warrior-troll.json` | Tribal Warrior | Troll    | Mundane      | Archery + heavy cyberware          |
| `martial-artist-human.json` | Martial Artist | Human    | Adept        | Unarmed combat adept powers        |
| `assassin-elf.json`         | Assassin       | Elf      | Adept        | Firearms adept + enhanced reflexes |

## Character Categories

### Tier 1 - Mundane (No Magic/Minimal Augmentation)

- Face, Gang Leader, Bounty Hunter

### Tier 2 - Augmented (Cyberware/Bioware Focus)

- Street Samurai, Infiltrator, Mercenary, Tribal Warrior

### Tier 3 - Matrix Specialists

- Decker, Technomancer

### Tier 4 - Riggers

- Drone Rigger, Rigger

### Tier 5 - Full Mages

- Combat Mage, Shaman, Alchemist

### Tier 6 - Physical Adepts

- Martial Artist, Assassin

## Fixture Structure

Each fixture follows the `Character` type from `/lib/types/character.ts`:

```json
{
  "id": "example-{archetype}-{metatype}",
  "ownerId": "system",
  "editionId": "sr5",
  "editionCode": "sr5",
  "name": "{Archetype} (Example)",
  "metatype": "{metatype}",
  "status": "draft",
  "attributes": { ... },
  "specialAttributes": { ... },
  "magicalPath": "{mundane|magician|adept|technomancer}",
  "skills": { ... },
  "derivedStats": { ... },
  "metadata": {
    "source": "SR5 Core Rulebook Example Character",
    "archetype": "{Archetype Description}",
    "notes": "Priority selection and key features"
  }
}
```

## Validation

### Script Validation

Run the validation script to check all fixtures:

```bash
pnpm dlx tsx scripts/validate-example-characters.ts
```

Options:

- `--verbose` - Show detailed warnings
- `--help` - Show help

### Unit Tests

Run the fixture unit tests:

```bash
pnpm test -- __tests__/example-characters.test.ts
```

Tests verify:

- All 16 files exist with valid JSON
- Required fields present
- Valid metatypes, magical paths, statuses
- Reasonable attribute ranges
- Derived stats calculations (with tolerance for augmentations)
- Magical characters have appropriate spells/powers/complex forms

## Reference Documentation

Source documentation for each character in `/docs/data_tables/creation/`:

- `example-character-face-elf.md`
- `example-character-gang-leader-ork.md`
- etc.

## Usage

### In Tests

```typescript
import * as fs from "fs";
import * as path from "path";

const EXAMPLE_CHARS_DIR = "data/editions/sr5/example-characters";
const decker = JSON.parse(
  fs.readFileSync(path.join(EXAMPLE_CHARS_DIR, "decker-dwarf.json"), "utf-8")
);
```

### For UI Validation

Load fixtures and compare with characters created through the UI to verify:

- Attribute allocation matches
- Skill selections correct
- Equipment properly configured
- Derived stats calculate correctly

## Notes

- All fixtures use `status: "draft"` as reference data
- Owner is `system` for system-owned reference data
- Karma total is 25 (SR5 default starting karma)
- Derived stats may vary slightly from raw calculations due to augmentations/qualities
- Catalog IDs reference items in `/data/editions/sr5/core-rulebook.json`
