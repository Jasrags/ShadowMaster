# Quality Data Structure

This directory contains the new quality data structure for Shadowrun 5th Edition qualities, designed to be simpler and more maintainable than the XML-based structure.

## Structure Overview

The `Quality` struct provides a clean, type-safe representation of Shadowrun qualities with the following key features:

- **Type Safety**: Avoids `map[string]interface{}` where possible
- **Clear Organization**: Separates cost, description, bonuses, and requirements
- **Local Structs**: Creates common structs (like `QualityBonus`, `SourceReference`) as needed within the package
- **Flexible Cost Structure**: Supports both fixed costs and per-rating costs with maximums

## Example: Ambidextrous

The `Ambidextrous` quality demonstrates a simple positive quality:

```go
Ambidextrous = Quality{
    Name: "Ambidextrous",
    Type: QualityTypePositive,
    Cost: CostStructure{
        BaseCost: 4,
        PerRating: false,
        MaxRating: 0,
    },
    Description: "The Ambidextrous character can handle objects equally well with either hand...",
    Bonus: &QualityBonus{
        Ambidextrous: []bool{true},
    },
}
```

## Key Types

### Quality
The main quality structure containing:
- `Name`: Quality name (e.g., "Ambidextrous")
- `Type`: Positive or negative quality
- `Cost`: Karma cost structure
- `Description`: Full text description
- `Bonus`: Mechanical bonuses/effects (uses `QualityBonus` - local struct that grows as we add more qualities)
- `Requirements`: Prerequisites and restrictions
- `Source`: Source book reference

### CostStructure
Defines how karma cost works:
- `BaseCost`: Base karma cost (required)
- `PerRating`: Whether cost is per rating level
- `MaxRating`: Maximum rating if per-rating (0 = no max)

### QualityRequirements
Handles prerequisites:
- `MetatypeRestrictions`: Allowed metatypes
- `MagicRequired`: Requires Magic rating
- `ResonanceRequired`: Requires Resonance
- `ChargenOnly`: Character creation only
- `MaxTimes`: How many times it can be taken
- `OtherRestrictions`: Free-form restrictions

## Next Steps

1. Parse the full `qualtites.txt` file
2. Generate all quality definitions
3. Create a code generator similar to `generate-weapons-data`
4. Generate `qualities_data.go` with all qualities

