# Claude Reference: Architecture & Key Files

Detailed reference material for Shadow Master. The root CLAUDE.md imports this file — for subsystem deep-dives, use the `/architecture-reference` skill instead.

## Implemented Features

| Feature                   | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| **Combat Tracking**       | Initiative, actions, damage tracking, condition monitors |
| **Grunt/NPC System**      | Pre-built templates (PR0-PR6) for encounter management   |
| **Contact Network**       | Relationships, loyalty/connection ratings, favor economy |
| **Matrix Operations**     | Full matrix hacking with overwatch, marks, and programs  |
| **Rigging System**        | VCR, RCC, drone networks, jump-in mode, biofeedback      |
| **Augmentations**         | Cyberlimb system with essence tracking and grades        |
| **Campaign Management**   | Sessions, locations, notes, posts, grunt teams           |
| **Character Advancement** | Karma spending for attributes, skills, magic, edge       |
| **Character Lifecycle**   | State machine: draft → active → retired/deceased         |
| **Inventory Management**  | Equipment readiness states, wireless toggles             |
| **Account Security**      | Password changes, lockout management, email verification |
| **Ruleset Snapshots**     | Version control with drift detection and migration       |

## Core Architecture Patterns

### Modular Ruleset System

The ruleset architecture is the heart of the application. It supports multiple Shadowrun editions without code duplication.

**Key Concepts:** Edition → Book → BookPayload → RuleModule → MergedRuleset

**Critical Files:**

- `/lib/rules/loader.ts` - Loads edition metadata and book payloads
- `/lib/rules/merge.ts` - Merges books using merge strategies
- `/lib/types/edition.ts` - Type definitions for edition system

**To add a new edition:** Create `/data/editions/{editionCode}/` with `edition.json` and `core-rulebook.json`. No code changes needed.

### Character Creation Framework

Sheet-based, single-page character creation with all sections visible simultaneously.

**Key Concepts:** CreationMethod, CreationState, CreationBudgetContext, Draft Auto-save

**Critical Files:**

- `/app/characters/create/sheet/page.tsx` - Entry point
- `/components/creation/` - Creation card components
- `/lib/contexts/CreationBudgetContext.tsx` - Budget tracking

### Character Lifecycle System

State machine: draft → active → retired/deceased

**Critical Files:** `/lib/rules/character/state-machine.ts`

### Character Advancement System

Post-creation karma spending for attributes, skills, specializations, edge, magic.

**Critical Files:** `/lib/rules/advancement/` (costs, attributes, skills, validation, approval, ledger)

## Type System

All domain entities in `/lib/types/`. Key files:

- `edition.ts` - Ruleset system types
- `character.ts` - Character and creation types
- `creation-selections.ts` - Character creation tracking
- `action-resolution.ts` - Combat action types
- `gear-state.ts`, `programs.ts`, `rigging.ts`, `vehicles.ts` - Equipment types

## Component Patterns

**Server Components** (default): Pages without interactivity
**Client Components** (`"use client"`): Interactive components, forms

**Custom Hooks:** `useAuth()`, `useRuleset()`, `useMetatypes()`, `useSkills()`, `useRulesetStatus()`, `useSidebar()`

**Context Providers:** AuthProvider, ThemeProvider, RulesetProvider, CombatSessionContext, CreationBudgetContext, SidebarProvider

## Key Files to Understand First

**Core Types & Storage:**

1. `/lib/types/index.ts` - All data structures
2. `/lib/storage/base.ts` - Storage abstraction
3. `/lib/storage/characters.ts` - Character persistence

**Ruleset System:**

4. `/lib/rules/loader.ts` + `merge.ts` - Ruleset core
5. `/lib/rules/RulesetContext.tsx` - Ruleset hooks

**Character Creation:**

6. `/app/characters/create/sheet/page.tsx` - Entry point
7. `/components/creation/` - Creation cards
8. `/lib/contexts/CreationBudgetContext.tsx` - Budget tracking

**Combat & GM Tools:**

9. `/lib/combat/CombatSessionContext.tsx` - Combat state
10. `/lib/rules/grunts.ts` - NPC system

**Authentication:**

11. `/lib/auth/AuthProvider.tsx` - Auth context
12. `/lib/security/rate-limit.ts` - Rate limiting

## MCP Servers

This project uses MCP servers for AI-assisted development. For detailed tool selection guides, use the `/mcp-guide` skill.

| Server   | Purpose                      |
| -------- | ---------------------------- |
| context7 | Library documentation lookup |
| github   | GitHub API (PRs, issues)     |
| knip     | Dead code detection          |
| memory   | Persistent knowledge graph   |
| git      | Local git operations         |

## Documentation

Comprehensive docs in `/docs/`:

- `/architecture/` - Core architecture docs
- `/capabilities/` - Feature documentation
- `/data_tables/` - Game rule reference tables
- `/specifications/` - Feature specs
