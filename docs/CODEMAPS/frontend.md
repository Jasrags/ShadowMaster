<!-- Generated: 2026-04-13 | Files scanned: ~240 components | Token estimate: ~700 -->

# Frontend Architecture

## Page Tree (31 routes)

```
/                                          Landing/Dashboard
├── /signin, /signup, /forgot-password     Auth flows
├── /reset-password/[token]                Password reset
├── /characters
│   ├── /create                            Wizard-based creation
│   ├── /create/sheet                      Sheet-driven creation (ADR-011)
│   ├── /[id]                              Character sheet view
│   ├── /[id]/edit                         Resume draft editing
│   ├── /[id]/advancement                  XP/advancement
│   └── /[id]/contacts(/[contactId])       Contact management
├── /campaigns
│   ├── /create, /discover                 Campaign setup/browse
│   ├── /[id]                              Campaign dashboard
│   ├── /[id]/settings                     Config (GM only)
│   ├── /[id]/advancement                  Group advancement
│   ├── /[id]/grunt-teams(/create/[id])    NPC team management
│   └── /[id]/locations(/create/[id])      Location database
├── /rulesets                              Edition selector
├── /settings                              User preferences
└── /users                                 Admin user management
```

## Component Hierarchy (~240 components)

| Directory            | Count | Purpose                                                                                                                                                                                                                                                                      |
| -------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `creation/`          | 118   | Character creation cards (21 subfolders: archetype, priority, attributes, skills, augmentations, spells, qualities, gear, vehicles, contacts, adept-powers, matrix, foci, armor, weapons, identities, knowledge-languages, drugs-toxins, life-modules, magic-path, metatype) |
| `character/sheet/`   | 49    | Sheet display (attributes, armor, augmentations, combat, conditions, contacts, drones, equipment, skills, spells, vehicles, weapons)                                                                                                                                         |
| `rule-reference/`    | 7     | Rules lookup: category tabs, search, palette, table                                                                                                                                                                                                                          |
| `cyberlimbs/`        | 6     | Cyberlimb management: cards, detail, install/enhance modals                                                                                                                                                                                                                  |
| `action-resolution/` | 4     | Action pool builder, edge selector, history                                                                                                                                                                                                                                  |
| `combat/`            | 4     | Combat tracker, condition monitor, opposed tests                                                                                                                                                                                                                             |
| `ui/`                | 4     | Base primitives: modal, tooltip, dice roller, faction card                                                                                                                                                                                                                   |
| `sync/`              | 2     | Migration wizard, stability shield                                                                                                                                                                                                                                           |
| Root-level           | ~51   | AugmentationCard, DiceRoller, EssenceDisplay, NotificationBell, ThemeProvider, etc.                                                                                                                                                                                          |

## State Management

### Context Providers (app/providers.tsx)

```
ThemeProvider → I18nProvider → AuthProvider → SidebarProvider
```

### Domain Contexts

```
RulesetContext      (lib/rules/)        → Edition, priorities, metatypes, creation methods
CreationBudgetContext (lib/contexts/)   → Karma, nuyen, attribute/skill points, spells, powers
SidebarContext      (lib/contexts/)     → Mobile drawer + desktop collapse (localStorage)
RuleReferenceContext (lib/contexts/)    → Rules panel open/close + category
MatrixSessionContext (lib/matrix/)      → Hacking session state
RiggingSessionContext (lib/rigging/)    → Drone piloting state
CombatSessionProvider (lib/combat/)    → Combat encounter state
```

### Provider Tree

```
RulesetProvider → CombatSessionProvider → MatrixSessionProvider → RiggingSessionProvider
```

## Creation Flow (Dual Path)

```
Wizard Path:  Edition → Archetype → Priority → Attributes → Skills → Gear → Finalize
Sheet Path:   Edition → Sheet view with inline editing (ADR-011)

Both constrained by: CreationBudgetContext (karma, nuyen, points)
```

## UI Patterns

- **React Aria Components** for accessibility (no raw HTML interactive elements)
- **Card-based UI** for creation steps and sheet sections
- **Dark/light theme** with localStorage persistence
- **Modals** for complex interactions (cyberlimb install, enhancement, accessories)
