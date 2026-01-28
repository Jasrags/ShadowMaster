# Character Creation Reference Tables

This folder contains reference tables and examples for SR5 character creation using the Priority System.

## Contents

### Reference Tables

- **priority_table.md** - Priority assignments (A-E) for Metatype, Attributes, Magic, Skills, and Resources
- **metatype_attribute_table.md** - Attribute ranges and special attribute points by metatype
- **metatype_attribute_modifiers.md** - Racial attribute modifiers
- **metahuman_characteristics_table.md** - Physical characteristics by metatype
- **positive_qualities.md** - Available positive qualities with karma costs
- **negative_qualities.md** - Available negative qualities with karma rewards
- **skill_groups_individual_skills.md** - Skill groups and their component skills
- **knowledge_category_examples.md** - Knowledge skill categories with examples
- **lifestyle_costs_table.md** - Lifestyle tiers and monthly costs
- **starting_nuyen_table.md** - Starting nuyen by lifestyle
- **character_improvement_table.md** - Karma costs for advancement
- **karma_advancement_attributes.md** - Karma costs for attribute increases
- **karma_advancement_skills.md** - Karma costs for skill increases
- **initiation_submersion_costs.md** - Initiation and submersion grade costs with discounts
- **training_rate_table.md** - Training time requirements
- **final_calculations_table.md** - Derived stat formulas
- **additional_purchases_restrictions.md** - Availability and purchase limits at creation

### Example Characters

- **example-character-street-samurai-ork.md** - Ork Street Samurai (combat/cyberware focused)

## Adding New Example Characters

When converting character sheet images to markdown, use this prompt template:

```
Convert this character sheet image into a markdown document following the SR5 character creation sections format. Save the file to docs/data_tables/creation/example-character-[archetype]-[metatype].md

Include these sections in order:

1. **Title & Introduction** - Character archetype and brief description
2. **Priority Selection** - Analyze and determine the most likely priority assignments (A-E) for Metatype, Attributes, Magic, Skills, and Resources. Show as a table with Priority, Category, and Allocation columns.
3. **Metatype** - Selected metatype
4. **Attributes** - Core attributes table (B, A, R, S, W, L, I, C) with modified values noted, plus Special Attributes (Essence, Edge, Magic/Resonance if applicable)
5. **Magic/Resonance** - Magical path, tradition, spells, adept powers, complex forms as applicable
6. **Skills** - Active Skills (with specializations/bonuses), Knowledge Skills (with categories), Languages
7. **Qualities** - Positive and Negative qualities with karma costs and notes
8. **Augmentations** - Cyberware and Bioware with grade, essence cost, and effects
9. **Contacts** - Name, type, Connection, and Loyalty ratings
10. **Gear** - General gear, armor, lifestyle, commlinks, etc.
11. **Weapons** - Melee weapons table (Reach, Acc, DV, AP) and Ranged weapons table (Type, Acc, DV, AP, Mode, RC, Ammo, Notes)
12. **Vehicles & Drones** - With full stat blocks (Hand, Speed, Accel, Body, Armor, Pilot, Sensor)
13. **Derived Stats** - Limits, Initiative, Condition Monitors, Armor rating
14. **Starting Nuyen** - Remaining funds

Use proper markdown tables. Note any modified values with asterisks and explain the source (e.g., augmentations, qualities). For the priority analysis, calculate attribute points spent from racial minimums and verify skill point totals match a priority level.
```

### Naming Convention

Example character files should follow this pattern:

```
example-character-[archetype]-[metatype].md
```

Examples:

- `example-character-street-samurai-ork.md`
- `example-character-decker-human.md`
- `example-character-mage-elf.md`
- `example-character-rigger-dwarf.md`
- `example-character-face-human.md`
- `example-character-adept-troll.md`

## Purpose

These tables and examples serve as:

1. **Development Reference** - Validate character creation wizard implementations against official rules
2. **Test Data** - Provide known-good character builds for testing
3. **Documentation** - Help developers understand SR5 character creation mechanics
4. **User Examples** - Show players what completed characters look like
