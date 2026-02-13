# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and Cursor IDE when working with code in this repository.

## Project Overview

**Shadow Master** is a character management system for the Shadowrun tabletop RPG, supporting all editions (1E-6E plus Anarchy). The application provides multi-edition character creation with edition-specific rules, flexible ruleset system supporting sourcebooks and errata, and character lifecycle management.

**Current Status:** Post-MVP with full SR5 support including character creation, advancement, combat tracking, campaign management, and GM tools.

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

## Git Workflow

Always create a feature branch BEFORE making any commits. Never commit directly to main. Use the pattern: `git checkout -b feature/<issue-number>-<short-description>` before any code changes.

## Development Commands

```bash
# Essential
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm test             # Run unit tests (Vitest)
pnpm test:e2e         # Run E2E tests (Playwright)
pnpm lint             # ESLint
pnpm type-check       # TypeScript checking
pnpm check            # Combined lint + type-check + knip

# Docker (local development)
pnpm docker:dev       # Build and start containers
pnpm docker:build     # Build image with git SHA
pnpm docker:up        # Start containers
pnpm docker:down      # Stop containers
pnpm docker:logs      # Follow container logs

# Code Quality
pnpm format           # Prettier formatting
pnpm knip             # Dead code detection
pnpm verify-data      # Validate JSON data files

# Documentation & Testing
pnpm validate-docs    # Validate CLAUDE.md against codebase
pnpm check-tests      # Check for missing tests (non-blocking)
```

**Environments:** `local` (pnpm dev), `docker` (pnpm docker:dev), `staging` (Portainer), `production` (hidden badge)

**Git Hooks:** pre-commit (lint-staged, type-check), pre-push (knip, CLAUDE.md validation)

## Tech Stack

- **Next.js 16.1.6** with App Router (React Server Components)
- **React 19.2.4** with React Aria Components for accessibility
- **TypeScript 5** with strict mode
- **Tailwind CSS 4** with dark mode
- **File-based storage** (JSON in `/data` - no database)
- **bcryptjs** for passwords, **cookie-based sessions** (httpOnly, 7-day)

**Path Alias:** `@/*` maps to project root

## Key Directories

```
/app                    # Next.js App Router pages and API routes
  /api                  # API route handlers (~144 route files)
  /characters           # Character pages (create, view, edit, advancement)
  /campaigns            # Campaign management pages
/lib                    # Core business logic
  /types                # TypeScript type definitions
  /storage              # File-based data persistence (~21 modules)
  /rules                # Ruleset and game mechanics
    /action-resolution  # Action execution framework
    /advancement        # Karma advancement system
    /augmentations      # Cyberlimb and augmentation systems
    /character          # Character state machine
    /matrix             # Matrix operations
    /rigging            # Vehicle/drone control
    /sync               # Drift detection, migration
  /auth                 # Authentication and sessions
  /combat               # Combat session management
  /security             # Rate limiting, audit logging
/components             # Shared React components
  /creation             # Character creation cards (~97 components in 19 subfolders)
  /combat               # Combat UI components
/data                   # JSON file storage (acts as database)
  /editions/{code}/     # Edition data (edition.json, core-rulebook.json, grunt-templates/)
/__tests__              # Test files (Vitest)
/e2e                    # E2E tests (Playwright)
/docs                   # Architecture and feature documentation
```

## Core Architecture Patterns

### 1. Modular Ruleset System

The ruleset architecture is the heart of the application. It supports multiple Shadowrun editions without code duplication.

**Key Concepts:** Edition → Book → BookPayload → RuleModule → MergedRuleset

**Critical Files:**

- `/lib/rules/loader.ts` - Loads edition metadata and book payloads
- `/lib/rules/merge.ts` - Merges books using merge strategies
- `/lib/types/edition.ts` - Type definitions for edition system

**To add a new edition:** Create `/data/editions/{editionCode}/` with `edition.json` and `core-rulebook.json`. No code changes needed.

### 2. Character Creation Framework

Sheet-based, single-page character creation with all sections visible simultaneously.

**Key Concepts:** CreationMethod, CreationState, CreationBudgetContext, Draft Auto-save

**Critical Files:**

- `/app/characters/create/sheet/page.tsx` - Entry point
- `/components/creation/` - Creation card components (~97)
- `/lib/contexts/CreationBudgetContext.tsx` - Budget tracking

### 3. Character Lifecycle System

State machine: draft → active → retired/deceased

**Critical Files:** `/lib/rules/character/state-machine.ts`

### 4. Character Advancement System

Post-creation karma spending for attributes, skills, specializations, edge, magic.

**Critical Files:** `/lib/rules/advancement/` (costs, attributes, skills, validation, approval, ledger)

### Additional Subsystems

For detailed documentation on Combat, Matrix, Rigging, Inventory, Contacts, Sync, Security, and Storage patterns, use the `/architecture-reference` skill.

## Type System

All domain entities in `/lib/types/`. Key files:

- `edition.ts` - Ruleset system types
- `character.ts` - Character and creation types
- `creation-selections.ts` - Character creation tracking
- `action-resolution.ts` - Combat action types
- `gear-state.ts`, `programs.ts`, `rigging.ts`, `vehicles.ts` - Equipment types

**Always import from `@/lib/types`**

## Component Patterns

**Server Components** (default): Pages without interactivity
**Client Components** (`"use client"`): Interactive components, forms

**Custom Hooks:** `useAuth()`, `useRuleset()`, `useMetatypes()`, `useSkills()`, `useRulesetStatus()`, `useSidebar()`

**Context Providers:** AuthProvider, ThemeProvider, RulesetProvider, CombatSessionContext, CreationBudgetContext, SidebarProvider

For component organization guidelines (subfolder vs single file decisions), use the `/component-patterns` skill.

## Development Guidelines

### Common Pitfalls

1. **Don't mutate state directly** - Use `setState()` with new objects
2. **Don't skip authentication** - All protected routes must call `getSession()`
3. **Don't assume ruleset is loaded** - Check `useRulesetStatus()` for errors
4. **Don't create new files unnecessarily** - Prefer editing existing files
5. **Don't use `cd` in bash** - Use absolute paths

### File Operations

Always use TypeScript storage layer (`readJsonFile()`, `writeJsonFile()`) instead of bash commands.

### Naming Conventions

- **Data identifiers** (`id`, `category`, `subcategory` values in JSON): `kebab-case`
  - Examples: `push-the-limit`, `throwing-weapons`, `armor-modification`
  - Validation regex: `/^[a-z0-9]+(-[a-z0-9]+)*$/`
- **TypeScript object keys**: `camelCase`
- Run `pnpm verify-naming` to validate naming conventions in data files

### Pre-Commit Checklist

After implementing any feature, always run `pnpm type-check` and `pnpm test` before committing. Fix all TypeScript errors and test failures before creating a commit.

### Keeping Documentation in Sync

When modifying files in `/components/creation/`:

- Update the hierarchy diagrams in `/docs/architecture/creation-components/` if adding, removing, or reorganizing components
- Run `pnpm validate-creation-docs` to check for drift between code and documentation
- Key files to update: `README.md` (component counts), feature-specific docs (hierarchy diagrams)

## Workflow Patterns

When working on GitHub issues, split into TWO separate sessions: (1) exploration + plan creation, (2) implementation + PR. Do not try to explore AND implement in one session — start implementation immediately if a plan already exists.

## Tools & Preferences

Use `gh` CLI for all GitHub operations (issue creation, PR creation, etc.) instead of MCP GitHub tools. Example: `gh pr create --title 'feat: ...' --body '...'`

## Project Conventions

This is a TypeScript project. All source files use `.ts` and `.tsx` extensions. When writing grep/search patterns, always include both `.ts` and `.tsx` extensions. Use extended regex (`grep -E`) when using alternation patterns.

## Implementation Guidelines

When implementing validators or features that follow existing patterns in the codebase, read at least one existing implementation first and match its patterns exactly (enum usage, type narrowing approach, mock structure in tests).

## Testing

```bash
pnpm test          # Unit tests (~300 test files)
pnpm test:e2e      # E2E tests
```

For detailed test file locations, patterns, and manual testing workflow, use the `/testing` skill.

## Documentation

Comprehensive docs in `/docs/`:

- `/architecture/` - Core architecture docs
- `/capabilities/` - Feature documentation
- `/data_tables/` - Game rule reference tables
- `/specifications/` - Feature specs

## Key Files to Understand First

**Core Types & Storage:**

1. `/lib/types/index.ts` - All data structures
2. `/lib/storage/base.ts` - Storage abstraction
3. `/lib/storage/characters.ts` - Character persistence

**Ruleset System:** 4. `/lib/rules/loader.ts` + `merge.ts` - Ruleset core 5. `/lib/rules/RulesetContext.tsx` - Ruleset hooks

**Character Creation:** 6. `/app/characters/create/sheet/page.tsx` - Entry point 7. `/components/creation/` - Creation cards (~97) 8. `/lib/contexts/CreationBudgetContext.tsx` - Budget tracking

**Combat & GM Tools:** 9. `/lib/combat/CombatSessionContext.tsx` - Combat state 10. `/lib/rules/grunts.ts` - NPC system

**Authentication:** 11. `/lib/auth/AuthProvider.tsx` - Auth context 12. `/lib/security/rate-limit.ts` - Rate limiting

## MCP Servers

This project uses MCP servers for AI-assisted development. For detailed tool selection guides (Git vs GitHub MCP, Context7, Knip, Memory, Sequential Thinking), use the `/mcp-guide` skill.

**Quick Reference:**
| Server | Purpose |
| ------------ | ---------------------------- |
| context7 | Library documentation lookup |
| github | GitHub API (PRs, issues) |
| knip | Dead code detection |
| memory | Persistent knowledge graph |
| git | Local git operations |

## Skills Reference

Available skills for detailed guidance:

- `/mcp-guide` - MCP server selection and usage
- `/github-issues` - GitHub issue management including epics, sub-issues, milestones, and relationships
- `/architecture-reference` - Detailed subsystem documentation
- `/component-patterns` - Component organization guidelines
- `/testing` - Test infrastructure and patterns
- `/edition-data-author` - Creating catalog items for edition JSON files
- `/archetype-import` - Importing SR5 archetypes from sourcebook stat blocks
- `/shadowrun-aesthetic` - UI styling guidelines
- `/sheet-ui-redesign` - Redesign sheet display components to match creation card aesthetic
