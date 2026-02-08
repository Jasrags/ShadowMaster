# Creation Components Architecture

This documentation provides visual hierarchy diagrams for all 90 React components (plus 35 supporting TS files) in `/components/creation/`, used during character creation in Shadow Master.

> **Keeping in sync:** Run `pnpm validate-creation-docs` to check for drift between code and documentation.

## Navigation

| Document                                          | Description                                                          |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| [00-layout-overview](./00-layout-overview.md)     | Three-column layout from SheetCreationLayout                         |
| [01-shared-primitives](./01-shared-primitives.md) | CreationCard, BudgetIndicator, ValidationBadge, etc. (12 components) |
| [02-foundation-cards](./02-foundation-cards.md)   | Priority, Metatype, MagicPath, CharacterInfo, DerivedStats           |
| [03-skills-system](./03-skills-system.md)         | Skills (9), KnowledgeLanguages (8)                                   |
| [04-qualities-magic](./04-qualities-magic.md)     | Qualities (7), Spells, AdeptPowers, ComplexForms, Foci (3)           |
| [05-gear-equipment](./05-gear-equipment.md)       | Gear (5), Weapons (5), Armor (5)                                     |
| [06-matrix-vehicles](./06-matrix-vehicles.md)     | MatrixGear (7), Vehicles (9), Augmentations (5)                      |
| [07-social-identity](./07-social-identity.md)     | Contacts (6), Identities (9)                                         |
| [08-context-data-flow](./08-context-data-flow.md) | CreationBudgetContext, RulesetContext, hooks                         |

## Component Count Summary

| Category          | Components           | Files  |
| ----------------- | -------------------- | ------ |
| Shared Primitives | 12                   | 13     |
| Foundation Cards  | 5 cards              | 17     |
| Skills System     | 2 cards              | 17     |
| Qualities & Magic | 5 cards              | 13     |
| Gear & Equipment  | 3 panels             | 15     |
| Matrix & Vehicles | 3 cards              | 19     |
| Social & Identity | 2 cards              | 15     |
| **Total**         | **~32 Cards/Panels** | **94** |

## Color Key

All diagrams use consistent color coding:

```mermaid
graph LR
    subgraph Legend
        Card[Card/Panel Container]
        Modal[Modal Dialog]
        Row[Row/Item Display]
        Shared[Shared Primitive]
        Context[Context Provider]
    end

    style Card fill:#3b82f6,color:#fff
    style Modal fill:#8b5cf6,color:#fff
    style Row fill:#22c55e,color:#fff
    style Shared fill:#6b7280,color:#fff
    style Context fill:#f59e0b,color:#fff
```

| Color  | Hex       | Purpose                                     |
| ------ | --------- | ------------------------------------------- |
| Blue   | `#3b82f6` | Card/Panel containers - main UI surfaces    |
| Purple | `#8b5cf6` | Modal dialogs - selection and configuration |
| Green  | `#22c55e` | Row components - item display (leaf nodes)  |
| Gray   | `#6b7280` | Shared primitives - reusable UI elements    |
| Orange | `#f59e0b` | Context providers - state management        |

## Architecture Pattern

The creation system follows a consistent **Card → Modal → Row** hierarchy:

```
Card (Main Container)
├── Wraps content in CreationCard (styling, collapsing, validation)
├── Renders selected items as Row components
├── Opens Purchase/Selection Modals
└── Opens Modification/Confirmation Modals

Modal (Dialog)
├── Purchase Modal - browse catalogs, select items
├── Modification Modal - install mods, customize
└── Confirmation Modal - karma cost prompts

Row (Item Display)
├── Compact collapsed view (name, cost, actions)
├── Expandable detailed view (stats, capacity, mods)
└── Action buttons (modify, remove)
```

## File Organization

```
/components/creation/
├── index.ts                    # Main exports (organized by phase)
├── *.tsx                       # Root-level card components (15)
├── armor/                      # Armor subsystem (5 files)
├── augmentations/              # Cyberware/bioware (5 files)
├── contacts/                   # Contact management (6 files)
├── foci/                       # Magical foci (3 files)
├── gear/                       # General equipment (5 files)
├── identities/                 # SINs and licenses (9 files)
├── knowledge-languages/        # Knowledge skills (8 files)
├── magic-path/                 # Magic traditions (6 files)
├── matrix-gear/                # Cyberdecks, commlinks (7 files)
├── metatype/                   # Metatype selection (5 files)
├── qualities/                  # Qualities system (7 files)
├── skills/                     # Active skills (9 files)
├── vehicles/                   # Vehicles & drones (9 files)
├── weapons/                    # Weapons & ammo (5 files)
└── shared/                     # Shared primitives (13 files)
```

## Related Documentation

- [Character Creation Overview](/docs/capabilities/character-creation.md)
- [Budget System](/docs/architecture/budget-system.md)
- [Ruleset Context](/docs/architecture/ruleset-context.md)
