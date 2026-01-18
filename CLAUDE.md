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
| **Account Security**      | Password changes, import/export, account deletion        |
| **Activity Feed**         | User action logging and tracking                         |
| **Character Cloning**     | Duplicate characters for templates/backups               |
| **Ruleset Snapshots**     | Version control with drift detection and migration       |
| **Audit Trail**           | Full audit logging for compliance                        |
| **Optional Rules**        | Campaign-level rule customization                        |

## Development Commands

### Essential Commands

- `pnpm dev` - Start development server (http://localhost:3000)
- `pnpm dev:all` - Start dev server with type-check and lint watch
- `pnpm dev:full` - Full dev mode with knip watch for dead code detection
- `pnpm build` - Create production build
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm check` - Combined linting, type-check, and knip analysis
- `pnpm check:ci` - CI pipeline script with tests
- `pnpm test` - Run unit tests (Vitest)
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ci` - Run tests in CI mode (no watch)
- `pnpm test:e2e` - Run E2E tests (Playwright)
- `pnpm test:e2e:ui` - E2E with visual UI

### Code Quality Commands

- `pnpm format` - Format code with Prettier (ts, tsx, json, md, yml, yaml)
- `pnpm format:check` - Check formatting without applying changes
- `pnpm knip` - Dead code detection
- `pnpm knip:watch` - Watch mode for dead code
- `pnpm knip:production` - Knip in production mode
- `pnpm knip:report` - Alias for knip (dead code report)
- `pnpm verify-data` - Validate JSON data files

### Utility Scripts

- `pnpm backup` - Run data backup utility (`scripts/backup.ts`)
- `pnpm health-check` - System health validation (`scripts/health-check.ts`)
- `pnpm seed-data` - Populate test data (`scripts/seed-data.ts`)
- `pnpm user-admin` - User management CLI (`scripts/user-admin.ts`)

### Documentation & Test Enforcement

- `pnpm validate-docs` - Validate CLAUDE.md against codebase (component counts, directories, etc.)
- `pnpm check-tests` - Check staged files for missing tests (non-blocking)
- `pnpm check-tests:all` - Check all source files for missing tests
- `pnpm check-tests:strict` - Strict mode (fails if tests are missing)

**Git Hooks (via Husky):**

- **pre-commit**: lint-staged, type-check, test coverage check (warning)
- **pre-push**: knip analysis, CLAUDE.md validation (warning)

### Development Workflow

1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev` (or `pnpm dev:all` for full checks)
3. Create test user via `/signup` in browser
4. Test character creation at `/characters/create`
5. Run tests: `pnpm test`

## Architecture Overview

### Tech Stack

- **Next.js 16.0.7** with App Router (file-based routing, React Server Components)
- **React 19.2.0** with React Aria Components for accessibility
- **TypeScript 5** with strict mode enabled
- **Tailwind CSS 4** for styling with dark mode support
- **File-based storage** (JSON files in `/data` directory - no database)
- **bcryptjs** for password hashing
- **Cookie-based sessions** (httpOnly, 7-day expiration)

### Path Aliases

- `@/*` maps to project root (e.g., `import { Character } from "@/lib/types"`)

### Key Directories

```
/app                    # Next.js App Router pages and API routes
  /api                  # API route handlers (~133 route files)
    /account            # Account management (delete, import/export, preferences)
    /audit              # Audit logging endpoints
    /combat             # Combat session management
    /characters/[characterId]
      /advancement      # Karma advancement endpoints
      /actions          # Action execution with reroll support
      /augmentations    # Cyberlimb and augmentation management
      /contacts         # Contact management with favor calls
      /inventory        # Equipment state management
      /matrix           # Matrix operations
      /rigging          # Drone and vehicle control
      /training         # Training tracking
      /weapons          # Weapon management
      /wireless         # Wireless operations
    /campaigns/[id]
      /grunt-teams      # NPC grunt team management
      /locations        # Location management with connections
      /notes            # Campaign notes
      /posts            # Campaign posts
      /sessions         # Session management
      /advancements     # GM approval workflows
    /editions/[editionCode]
      /grunt-templates  # Grunt template data
      /content          # Dynamic content loading
    /magic              # Drain calculations, validation
    /matrix             # Overwatch, validation
    /rigging            # Drone rigging validation
  /characters           # Character management pages
    /create             # Character creation (redirects to sheet)
    /create/sheet       # Sheet-based character creation
    /[id]               # Character sheet view/edit
    /[id]/edit          # Character editing interface
    /[id]/advancement   # Character advancement UI
  /campaigns            # Campaign management pages
    /discover           # Campaign discovery
    /[id]/grunt-teams   # Grunt team management UI
  /users                # User management (admin)
  /signin, /signup      # Authentication pages
/lib                    # Core business logic
  /types                # TypeScript type definitions
  /storage              # File-based data persistence (~25 modules)
  /rules                # Ruleset and game mechanics
    /action-resolution  # Action execution framework
    /advancement        # Karma advancement (attributes, skills, edge, magic)
    /augmentations      # Cyberlimb and augmentation systems
    /character          # Character state machine and lifecycle
    /encumbrance        # Weight/carry limits
    /gear               # Gear validation and weapon customization
    /inventory          # Equipment state management
    /magic              # Magic system and drain
    /matrix             # Full matrix operations (overwatch, marks, programs)
    /qualities          # Quality effects, validation, dynamic state
    /rigging            # Vehicle/drone control, VCR, RCC, jump-in mode
    /skills             # Skill system utilities
    /sync               # Drift detection, migration, legality validation
    /validation         # Character validation framework
    /wireless           # Matrix/wireless rules
  /auth                 # Authentication and session management
  /combat               # Combat session management
  /contexts             # React contexts (CreationBudget, etc.)
  /security             # Rate limiting, audit logging
  /migrations           # Data migration framework
  /themes.ts            # Theming system (neon-rain, modern-card)
/components             # Shared React components
  /combat               # Combat UI components
  /creation             # Character creation cards (89 components)
  /cyberlimbs           # Cyberlimb-specific UI
  /sync                 # Character sync components
  /ThemeProvider.tsx    # Global theming
/data                   # JSON file storage (acts as database)
  /users                # User records
  /characters           # Character records (organized by userId)
  /campaigns            # Campaign records
  /editions             # Edition metadata and ruleset data
    /{editionCode}/grunt-templates  # Pre-built NPC templates (PR0-PR6)
/docs                   # Architecture documentation
  /architecture         # Core architecture docs
  /archive              # Completed phases
  /capabilities         # Feature documentation
  /data_tables          # Game rule reference tables
  /specifications       # Feature specs
  /features             # Feature documentation
  /decisions            # Architecture decisions
  /audits               # Audit documentation
/__tests__              # Test files (Vitest)
/e2e                    # E2E tests (Playwright)
/scripts                # Utility scripts (backup, health-check, seed-data, user-admin)
```

## Core Architecture Patterns

### 1. Modular Ruleset System

The ruleset architecture is the heart of the application. It allows supporting multiple Shadowrun editions without code duplication.

**Key Concepts:**

- **Edition**: Top-level ruleset container (e.g., `sr5`, `sr6`)
- **Book**: Physical/digital publication with rules (core rulebook, sourcebooks)
- **BookPayload**: JSON file containing rule modules for a book
- **RuleModule**: Domain-specific rules (metatypes, skills, qualities, magic, etc.)
- **Merge Strategies**: How to combine base rules with overrides (`merge`, `replace`, `append`, `remove`)
- **MergedRuleset**: Final immutable ruleset after merging all books

**Critical Files:**

- `/lib/rules/loader.ts` - Loads edition metadata and book payloads
- `/lib/rules/merge.ts` - Merges books using merge strategies
- `/lib/types/edition.ts` - Type definitions for edition system
- `/data/editions/{editionCode}/` - Edition data files

**Ruleset Loading Flow:**

```
loadRuleset(editionCode)
  → Load edition.json
  → Load core-rulebook.json
  → Load sourcebook JSONs (if any)
  → mergeRuleset() applies merge strategies
  → Returns MergedRuleset with all combined rules
```

**To add a new edition or sourcebook:**

1. Create `/data/editions/{editionCode}/` directory
2. Add `edition.json` with metadata
3. Add `core-rulebook.json` with base rules
4. (Optional) Add sourcebook JSON files
5. No code changes needed - data-driven system

### 2. Character Creation Framework

Sheet-based, single-page character creation with all sections visible simultaneously.

**Key Concepts:**

- **CreationMethod**: Defines creation budgets and constraints
- **CreationState**: Tracks selections and budget allocations
- **CreationBudgetContext**: Real-time budget tracking and validation
- **Draft Auto-save**: Debounced auto-save to server (1 second delay)

**Critical Files:**

- `/app/characters/create/sheet/page.tsx` - Entry point
- `/app/characters/create/sheet/components/SheetCreationLayout.tsx` - Main layout
- `/components/creation/` - Creation card components (89 components in 15 subfolders)
- `/lib/types/creation.ts` - Creation method and state types
- `/lib/contexts/CreationBudgetContext.tsx` - Budget tracking context

**Character Creation Flow:**

```
/characters/create → Redirect to /characters/create/sheet
  → EditionSelector picks edition
  → RulesetProvider loads ruleset
  → SheetCreationLayout renders all sections
  → User fills out character (auto-saved to server)
  → POST /api/characters/{id}/finalize
  → Redirect to /characters/[id]
```

### 3. Character Lifecycle System

State machine managing character status from creation through retirement.

**Key Concepts:**

- **Character States**: draft → active → retired/deceased
- **Role-Based Transitions**: Owner, GM, and admin permissions for different transitions
- **Completion Validation**: Ensures character is complete before finalization
- **Audit Integration**: All transitions logged for compliance

**Critical Files:**

- `/lib/rules/character/state-machine.ts` - State transitions and validation
- `/lib/types/character.ts` - Character type definitions

### 4. Character Advancement System

Post-creation karma spending for character progression.

**Key Concepts:**

- **Advancement Types**: Attributes, skills, specializations, edge, magic
- **Karma Costs**: Calculated based on current rating and advancement type
- **Training Time**: Optional downtime tracking for advancement
- **GM Approval**: Workflow for campaign-linked characters
- **Validation**: Ensures advancements follow edition rules

**Critical Files:**

- `/lib/rules/advancement/` - Core advancement logic
  - `costs.ts` - Karma cost calculations
  - `attributes.ts` - Attribute advancement
  - `skills.ts` - Skill advancement
  - `specializations.ts` - Specialization advancement
  - `edge.ts` - Edge advancement
  - `magic-advancement.ts` - Magic path advancement
  - `training.ts` - Training time calculations
  - `validation.ts` - Rule validation
  - `approval.ts` - GM approval workflows
  - `ledger.ts` - Advancement history tracking
- `/app/api/characters/[characterId]/advancement/` - API endpoints
- `/app/characters/[id]/advancement/` - UI components

### 5. Combat System

Full combat tracking with initiative, actions, and damage resolution.

**Key Concepts:**

- **Combat Session**: Tracks all combatants, turn order, and combat state
- **Action Resolution**: Executes and validates combat actions
- **Initiative Tracking**: Automatic turn management with initiative passes
- **Damage Tracking**: Condition monitor integration

**Critical Files:**

- `/lib/combat/CombatSessionContext.tsx` - Combat state management
- `/lib/rules/action-resolution/` - Action execution framework
  - `action-executor.ts` - Core execution logic
  - `action-validator.ts` - Action validation
  - `dice-engine.ts` - Dice rolling engine
  - `pool-builder.ts` - Dice pool construction
  - `edge-actions.ts` - Edge spending actions
  - `combat/` - Combat-specific handlers (damage, weapons)
- `/app/api/combat/` - Combat session API endpoints
- `/components/combat/` - Combat UI (tracker, dice pools, quick reference)

### 6. Matrix Operations System

Full matrix hacking with overwatch, marks, and program management.

**Key Concepts:**

- **Cyberdecks**: Hardware validation and configuration
- **Programs**: Slot management and allocation
- **Overwatch Score**: OS tracking and convergence handling
- **Marks**: Mark placement and tracking system
- **Matrix Actions**: Action validation with mark requirements

**Critical Files:**

- `/lib/rules/matrix/` - Matrix operations
  - `cyberdeck-validator.ts` - Hardware validation
  - `program-validator.ts` - Program allocation
  - `overwatch-calculator.ts` - OS calculation
  - `overwatch-tracker.ts` - Session tracking
  - `mark-tracker.ts` - Mark management
  - `action-validator.ts` - Matrix action validation
  - `dice-pool-calculator.ts` - Matrix dice pools

### 7. Rigging Control System

Vehicle and drone control for riggers.

**Key Concepts:**

- **VCR (Vehicle Control Rig)**: Validation and bonuses
- **RCC (Rigger Command Console)**: Drone slaving and command execution
- **Drone Networks**: Network management and noise handling
- **Jump-In Mode**: VR mode management for direct control
- **Biofeedback**: Damage and dumpshock handling

**Critical Files:**

- `/lib/rules/rigging/` - Rigging mechanics
  - `vcr-validator.ts` - VCR validation
  - `rcc-validator.ts` - RCC validation and slaving
  - `drone-network.ts` - Network management
  - `drone-condition.ts` - Drone damage tracking
  - `jumped-in-manager.ts` - Jump-in mode
  - `biofeedback-handler.ts` - Biofeedback damage
  - `noise-calculator.ts` - Signal noise calculations
  - `action-validator.ts` - Rigging action validation
  - `dice-pool-calculator.ts` - Vehicle/drone dice pools

### 8. Inventory and Equipment System

Equipment state management for gear, weapons, and devices.

**Key Concepts:**

- **Readiness States**: ready, holstered, stored, etc.
- **Wireless Toggles**: Enable/disable for augmentations and devices
- **Device Condition**: functional, bricked, repaired
- **Gear Validation**: Availability and rating validation

**Critical Files:**

- `/lib/rules/inventory/state-manager.ts` - Equipment state management
- `/lib/rules/gear/validation.ts` - Gear availability validation
- `/lib/rules/gear/weapon-customization.ts` - Weapon modifications

### 9. Gameplay Utilities

Runtime calculations for combat and tests.

**Key Concepts:**

- **Effective Ratings**: Wireless bonuses and matrix damage effects
- **Dice Pool Bonuses**: Equipment rating bonuses
- **Test Thresholds**: Detect, analyze, bypass calculations
- **Armor Stacking**: SR5 Core p.169-170 rules with accessories and encumbrance
- **Wound Modifiers**: High/Low Pain Tolerance support

**Critical Files:**

- `/lib/rules/gameplay.ts` - Core gameplay calculations
- `/lib/rules/constraint-validation.ts` - Creation constraint validation

### 10. Grunt/NPC System

Pre-built NPC templates for GMs with professional rating tiers.

**Key Concepts:**

- **Professional Rating (PR)**: PR0 (street rabble) to PR6 (dragon guard)
- **Grunt Templates**: Pre-configured NPCs with stats, gear, and skills
- **Grunt Teams**: Groups of NPCs for encounter management

**Critical Files:**

- `/lib/rules/grunts.ts` - Grunt mechanics and validation
- `/lib/storage/grunt-templates.ts` - Template persistence
- `/data/editions/{editionCode}/grunt-templates/` - PR0-PR6 template files
- `/app/campaigns/[id]/grunt-teams/` - Team management UI
- `/app/api/campaigns/[id]/grunt-teams/` - Grunt team API

### 11. Contact Network System

Contact relationships and favor economy for social gameplay.

**Key Concepts:**

- **Contact Network**: Relationships with NPCs and their loyalty/connection ratings
- **Favor Economy**: Tracking favors owed and earned
- **Social Capital**: Reputation and influence mechanics

**Critical Files:**

- `/lib/rules/contact-network.ts` - Contact relationship logic
- `/lib/rules/favors.ts` - Favor economy system
- `/lib/rules/social-actions.ts` - Social interaction mechanics
- `/lib/storage/contacts.ts` - Contact persistence
- `/lib/storage/favor-ledger.ts` - Favor tracking
- `/app/api/characters/[characterId]/contacts/` - Contact API

### 12. System Synchronization

Character-ruleset drift detection and migration.

**Key Concepts:**

- **Drift Analysis**: Detect metatype, skill, quality changes between rulesets
- **Legality Validation**: Quick sync status checks
- **Migration Engine**: Generate and execute migration plans
- **Sync Audit**: Trail of synchronization events

**Critical Files:**

- `/lib/rules/sync/` - Synchronization system
  - `drift-analyzer.ts` - Change detection
  - `legality-validator.ts` - Rule compliance checking
  - `migration-engine.ts` - Migration planning and execution
  - `sync-audit.ts` - Audit trail
  - `hooks.ts` - React hooks for client-side sync

### 13. Optional Rules System

Campaign-level rule customization.

**Key Concepts:**

- **Campaign Configuration**: Enable/disable optional rules per campaign
- **GM Control**: Default override support
- **Rule Extraction**: Pull optional rules from loaded rulesets
- **Content Access**: Validate content against enabled rules

**Critical Files:**

- `/lib/rules/optional-rules.ts` - Optional rule management

### 14. Data Management Layers

**Authentication State** (`/lib/auth/AuthProvider.tsx`):

- React Context managing user session globally
- Provides `useAuth()` hook for components
- Session stored in httpOnly cookie

**Ruleset State** (`/lib/rules/RulesetContext.tsx`):

- React Context caching loaded ruleset
- Provides hooks: `useRuleset()`, `useMetatypes()`, `useSkills()`, etc.
- Fetches from `/api/rulesets/[editionCode]`

**Local Storage**:

- User preferences and UI state
- Draft recovery handled server-side via auto-save

### 15. File-Based Storage Pattern

**Design:** JSON files on disk with atomic writes (temp file + rename pattern)

**Storage Layer** (`/lib/storage/`):

Core modules:

- `base.ts` - Core utilities: `readJsonFile()`, `writeJsonFile()`, `ensureDirectory()`
- `users.ts` - User CRUD operations
- `characters.ts` - Character CRUD + specialized operations (damage, karma, etc.)
- `campaigns.ts` - Campaign CRUD operations
- `editions.ts` - Edition and ruleset loading

Extended modules:

- `contacts.ts`, `favor-ledger.ts` - Contact system persistence
- `combat.ts`, `action-history.ts` - Combat session storage
- `grunt-templates.ts`, `grunts.ts` - NPC system storage
- `notifications.ts`, `activity.ts` - User activity tracking
- `audit.ts`, `user-audit.ts` - Audit trail logging
- `ruleset-snapshots.ts`, `snapshot-cache.ts` - Ruleset versioning
- `locations.ts`, `locations_connections.ts` - Campaign location storage
- `social-capital.ts` - Social capital tracking
- `violation-record.ts` - Rule violation tracking

**Storage Structure:**

```
/data
├── /users/{userId}.json
├── /characters/{userId}/{characterId}.json
├── /campaigns/{campaignId}.json
└── /editions/{editionCode}/
    ├── edition.json
    ├── core-rulebook.json
    ├── {sourcebook}.json
    └── /grunt-templates/
        └── pr{0-6}-{name}.json
```

**Important:** This is NOT production-scalable. File I/O happens on every request. Future migration to a database is planned.

### 16. Security Infrastructure

**Rate Limiting** (`/lib/security/rate-limit.ts`):

- DDoS protection for API endpoints
- Configurable limits per endpoint

**Audit Logging** (`/lib/security/audit-logger.ts`):

- Full audit trail for user actions
- Security event tracking
- Stored via `/lib/storage/audit.ts`

**Character Authorization** (`/lib/auth/character-authorization.ts`):

- Granular character access control
- Owner, campaign GM, and viewer permissions

**Additional Auth Modules** (`/lib/auth/`):

- `validation.ts` - Auth validation logic
- `middleware.ts` - Auth middleware
- `campaign.ts` - Campaign-specific authorization

### 17. API Route Patterns

All API routes follow this pattern:

1. Extract session from cookie via `getSession()`
2. Validate user exists via `getUserById()`
3. Return 401 if unauthenticated
4. Perform user-scoped operation
5. Return JSON response

**Example:**

```typescript
// /app/api/characters/route.ts
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const characters = getUserCharacters(session.userId);
  return NextResponse.json({ characters });
}
```

## Type System

All domain entities have TypeScript interfaces in `/lib/types/`:

- `User`, `Character`, `Edition`, `Book`, `CreationMethod`
- Extensive sub-types for character components (skills, qualities, gear, etc.)
- Single export point: `/lib/types/index.ts`

Key type files:

- `action-definitions.ts` - Action definitions and categorization
- `action-resolution.ts` - Action resolution types
- `creation-selections.ts` - Character creation selection tracking
- `gear-state.ts` - Equipment state types (readiness, condition)
- `programs.ts` - Matrix program types
- `rigging.ts` - Rigging system types
- `synchronization.ts` - Character sync types
- `vehicles.ts` - Vehicle/drone types
- `wireless-effects.ts` - Wireless bonus effect types

**Always import types from `@/lib/types`** to maintain consistency.

## Component Patterns

### Server vs Client Components

- **Server Components** (default): Pages that don't need interactivity
- **Client Components** (`"use client"`): Interactive components, forms, wizards

### Custom Hooks for Logic Reuse

- `useAuth()` - Access current user + auth functions
- `useRuleset()` - Access loaded ruleset
- `useMetatypes()`, `useSkills()`, `usePriorityTable()` - Extract specific data
- `useRulesetStatus()` - Get loading/error state

### Context Providers

Wrapped in `/app/providers.tsx` and applied in `/app/layout.tsx`:

- `AuthProvider` - User session management
- `ThemeProvider` - Global Shadowrun theming (neon-rain, modern-card themes)
- `I18nProvider` - Internationalization via react-aria-components
- `RulesetProvider` - Loaded ruleset caching (nested in pages that need it)
- `CombatSessionContext` - Combat state management (in combat pages)
- `CreationBudgetContext` - Real-time budget tracking during character creation

### Component File Organization

Use a **hybrid approach** based on component complexity:

**Use a subfolder when:**

- Component has one or more **modals** (selection dialogs, forms, etc.)
- Component has **reusable row/list item** components used in multiple places
- Component exceeds ~600 lines with clear separable concerns
- Component has distinct UI pieces that could be tested independently

**Keep as a single file when:**

- Component is self-contained with only **internal helper components**
- Internal components are tightly coupled and only make sense within the parent
- Component is under ~400 lines with straightforward structure
- No modals or independently reusable pieces

**Subfolder structure:**

```
/components/creation/qualities/
├── QualitiesCard.tsx        # Main card component
├── QualityModal.tsx         # Selection/edit modal
├── QualityRow.tsx           # Optional: if row is complex/reusable
├── index.ts                 # Re-exports public components
```

**Index file pattern:**

```typescript
// index.ts - export only public API
export { QualitiesCard } from "./QualitiesCard";
export { QualityModal } from "./QualityModal"; // Only if used externally
```

**Creation component subfolders (15 directories, 89 total components):**

| Folder                 | Components | Pattern                                |
| ---------------------- | ---------- | -------------------------------------- |
| `/armor`               | 4          | Panel + Row + PurchaseModal + ModModal |
| `/augmentations`       | 4          | 4 specialized modals                   |
| `/contacts`            | 2          | Card + Modal + support files           |
| `/foci`                | 2          | Card + Modal                           |
| `/gear`                | 4          | Panel + Row + 2 Modals                 |
| `/identities`          | 6          | Card + 3 modal types                   |
| `/knowledge-languages` | 5          | Card + 2 Row types + 2 Modals          |
| `/magic-path`          | 2          | Card + Modal + utilities               |
| `/matrix-gear`         | 3          | Card + 2 specialized modals            |
| `/metatype`            | 2          | Card + Modal + support files           |
| `/qualities`           | 3          | Card + SelectionModal + DetailCard     |
| `/shared`              | 10         | Reusable utilities and hooks           |
| `/skills`              | 5          | 5 specialized modals                   |
| `/vehicles`            | 4          | 4 specialized modals                   |
| `/weapons`             | 4          | Row + 3 Modals                         |

**Decision flowchart:**

```
Does the component have modals?
├─ Yes → Create subfolder, extract modals
└─ No → Does it have reusable Row/ListItem components?
        ├─ Yes, used elsewhere → Create subfolder
        └─ No → Keep as single file with internal helpers
```

## Development Guidelines

### File Operations

- Never use bash commands for file operations
- Always use TypeScript storage layer: `readJsonFile()`, `writeJsonFile()`
- Atomic writes are automatic (temp file + rename pattern)

### Adding New Features

**New API Endpoint:**

1. Create `/app/api/{path}/route.ts`
2. Export HTTP method handlers (GET, POST, PUT, DELETE)
3. Follow authentication pattern (getSession → validate user)
4. Call storage layer functions
5. Return JSON responses

**New Character Creation Card:**

1. Determine if card needs subfolder (see "Component File Organization" above)
   - Has modals? → Create subfolder with `index.ts`
   - Simple with internal helpers? → Single file is fine
2. Create card component in `/components/creation/` or `/components/creation/{feature}/`
3. Follow the `CreationCard` wrapper pattern from `/components/creation/shared/`
4. Add to `SheetCreationLayout.tsx` in the appropriate column
5. Update `CreationState` type in `/lib/types/creation.ts` if needed
6. Export from `/components/creation/index.ts`

**New Ruleset Module:**

1. Define module type in `/lib/types/edition.ts`
2. Add module to book payload in `/data/editions/{editionCode}/`
3. Update merge logic in `/lib/rules/merge.ts` if special handling needed
4. Create hook in `RulesetContext.tsx` for easy access

### Common Pitfalls

1. **Don't mutate state directly** - Always use `setState()` with new objects
2. **Don't skip authentication** - All protected routes must call `getSession()`
3. **Don't assume ruleset is loaded** - Check `useRulesetStatus()` for errors
4. **Don't create new files unnecessarily** - Prefer editing existing files
5. **Don't use `cd` in bash commands** - Use absolute paths instead
6. **File storage is synchronous** - No concurrent write protection (future: add locks)

## Testing Approach

**Test Infrastructure:**

- **Vitest** - Unit and integration tests (~85 test files)
- **Playwright** - E2E browser tests
- **Testing Library** - React component testing

**Test Locations:**

```
/__tests__/                                    # Root level tests
/lib/auth/__tests__/                           # Auth unit tests (3 files)
/lib/storage/__tests__/                        # Storage layer tests (10 files)
/lib/security/__tests__/                       # Security tests (1 file)
/lib/rules/__tests__/                          # Core rules tests (8 files)
/lib/rules/action-resolution/__tests__/        # Action resolution tests (2 files)
/lib/rules/action-resolution/combat/__tests__/ # Combat handler tests (2 files)
/lib/rules/advancement/__tests__/              # Advancement logic tests (8 files)
/lib/rules/augmentations/__tests__/            # Augmentation tests (6 files)
/lib/rules/character/__tests__/                # Character state machine tests (1 file)
/lib/rules/encumbrance/__tests__/              # Encumbrance tests (1 file)
/lib/rules/gear/__tests__/                     # Gear validation tests (2 files)
/lib/rules/inventory/__tests__/                # Inventory tests (1 file)
/lib/rules/magic/__tests__/                    # Magic system tests (5 files)
/lib/rules/matrix/__tests__/                   # Matrix tests (1 file)
/lib/rules/qualities/__tests__/                # Quality system tests (7 files)
/lib/rules/rigging/__tests__/                  # Rigging tests (2 files)
/app/api/**/__tests__/                         # API route tests (~25 files)
/e2e/                                          # Playwright E2E tests
```

**Running Tests:**

```bash
pnpm test              # Run all unit tests
pnpm test:watch        # Watch mode
pnpm test:ci           # CI mode (no watch)
pnpm test:e2e          # Run Playwright E2E tests
pnpm test:e2e:ui       # E2E with visual UI
```

**Manual Testing:**

1. Create test user via `/signup`
2. Test character creation via `/characters/create/sheet` end-to-end
3. Check `/data` directory for persisted JSON
4. Verify authentication by signing out and back in
5. Test draft auto-save by refreshing page mid-creation (drafts persist server-side)

## Documentation

Comprehensive documentation in `/docs/`:

```
/docs/
├── /architecture/      # Core architecture docs
│   ├── architecture-overview.md
│   ├── character_creation_framework.md
│   ├── edition_support_and_ruleset_architecture.md
│   ├── ruleset_architecture_and_source_material_system.md
│   └── merging_algorithm.md
├── /archive/           # Completed phases and historical docs
├── /capabilities/      # Feature documentation
│   ├── campaign.*.md   # Campaign system docs
│   ├── character.*.md  # Character system docs
│   ├── mechanics.*.md  # Game mechanics docs
│   ├── security.*.md   # Security documentation
│   ├── /plans/         # Implementation plans
│   ├── /walkthroughs/  # Feature guides
│   └── /prompts/       # AI prompt templates
├── /data_tables/       # Game rule reference tables
│   ├── combat/, creation/, magic/, matrix/
│   └── equipment/, environment/, etc.
├── /specifications/    # Feature specifications
├── /features/          # Feature documentation
├── /decisions/         # Architecture decision records
└── /audits/            # Audit documentation
```

**Always consult these docs when making architectural changes.**

## Future Migration Notes

**Known Technical Debt:**

1. **File-based storage** - Plan database migration (PostgreSQL/MongoDB recommended)
2. **Limited error handling** - Some API routes need better error recovery
3. **Session security** - Consider JWT/OAuth for production scale
4. **SR5 only** - Data structures ready for other editions, implementation pending
5. **No concurrent write protection** - File storage needs locking for production

## Key Files to Understand First

**Core Types & Storage:**

1. `/lib/types/index.ts` - All data structures
2. `/lib/storage/base.ts` - Storage abstraction
3. `/lib/storage/characters.ts` - Character persistence

**Ruleset System:**

4. `/lib/rules/loader.ts` + `merge.ts` - Ruleset system core
5. `/lib/rules/RulesetContext.tsx` - Ruleset hooks and context
6. `/lib/rules/advancement/` - Karma advancement system
7. `/lib/rules/gameplay.ts` - Runtime calculations

**Character Creation:**

8. `/app/characters/create/sheet/page.tsx` - Character creation entry point
9. `/components/creation/` - Character creation card components (89)
10. `/lib/contexts/CreationBudgetContext.tsx` - Budget tracking

**Combat & GM Tools:**

11. `/lib/combat/CombatSessionContext.tsx` - Combat state management
12. `/lib/rules/grunts.ts` - NPC/grunt system
13. `/lib/rules/action-resolution/` - Action execution

**Matrix & Rigging:**

14. `/lib/rules/matrix/` - Full matrix operations
15. `/lib/rules/rigging/` - Vehicle/drone control

**Character Lifecycle:**

16. `/lib/rules/character/state-machine.ts` - Character states
17. `/lib/rules/sync/` - Drift detection and migration

**Authentication & Security:**

18. `/lib/auth/AuthProvider.tsx` - Authentication context
19. `/lib/security/rate-limit.ts` - Rate limiting
20. `/lib/security/audit-logger.ts` - Audit logging

**Documentation:**

21. `/docs/architecture/` - Architecture documentation
22. `/docs/capabilities/` - Feature documentation

## MCP Servers

This project has MCP servers configured in the workspace `.mcp.json` file. These tools form the **AI Project Management Additions** to assist with automated linting, state tracking, and development.

### Available Servers

| Server                 | Purpose                      | When to Use                                                           |
| ---------------------- | ---------------------------- | --------------------------------------------------------------------- |
| **context7**           | Library documentation lookup | Query up-to-date docs for libraries/frameworks (React, Next.js, etc.) |
| **github**             | GitHub API operations        | PRs, issues, repos, commits, code search via GitHub API               |
| **knip**               | Dead code detection          | Find unused exports, dependencies, and files in the codebase          |
| **spec-lint**          | Enforce spec immutability    | Automatically run to ensure no progress leaks into specs              |
| **next-devtools**      | Next.js inspection           | Debugging React components and Next.js state                          |
| **memory**             | Persistent knowledge graph   | Store/recall architectural decisions, patterns, known issues          |
| **git**                | Git operations               | Commits, diffs, branches, history viewing                             |
| **filesystem**         | File operations              | Read/write project files                                              |
| **sequentialthinking** | Structured reasoning         | Complex debugging, architecture decisions                             |
| **time**               | Timezone utilities           | Timestamps (rarely needed)                                            |

### Context7 Usage

Use Context7 to fetch up-to-date documentation for libraries and frameworks:

```
# Get documentation for a library
resolve-library-id: "react"
get-library-docs: { libraryId: "/react/react", topic: "hooks" }
```

Best for:

- Checking current API signatures
- Understanding library-specific patterns
- Verifying framework best practices

### Knip Usage

Use Knip to detect dead code and unused dependencies:

```
# Run knip analysis
run_knip: { cwd: "/path/to/project" }

# Get knip documentation
get_knip_docs: { topic: "configuration" }
```

Best for:

- Finding unused exports before refactoring
- Identifying dead code after feature removal
- Cleaning up unused dependencies

### Memory Server Usage

The memory server maintains project knowledge across sessions. Use it to:

**Query existing knowledge:**

```
mcp__memory__search_nodes("ruleset")     # Find ruleset architecture info
mcp__memory__search_nodes("technical")   # Find known technical debt
mcp__memory__open_nodes(["KeyFiles"])    # Get key file locations
```

**Store new knowledge:**

```
mcp__memory__create_entities([...])      # Add new architectural concepts
mcp__memory__add_observations([...])     # Add details to existing entities
mcp__memory__create_relations([...])     # Link concepts together
```

**When to update memory:**

- After making significant architectural decisions
- When discovering important patterns or gotchas
- After resolving tricky bugs (document the solution)
- When adding new major features

### Sequential Thinking Usage

Use `mcp__sequentialthinking__sequentialthinking` for:

- Debugging complex ruleset merge issues
- Planning multi-step refactors
- Working through character creation edge cases
- Designing new edition support
- Any problem requiring step-by-step reasoning with revision

### Git & GitHub Tool Selection Guide

Three tools available for version control and GitHub operations. Choose based on the task:

| Task                   | Use This            | Why                       |
| ---------------------- | ------------------- | ------------------------- |
| View status, diff, log | **Git MCP**         | Clean structured output   |
| Create commits         | **Git MCP**         | Proper message formatting |
| List/switch branches   | **Git MCP**         | Simple operations         |
| Push to remote         | **Bash `git push`** | MCP doesn't support push  |
| Create PRs             | **GitHub MCP**      | Rich API integration      |
| Create/update issues   | **GitHub MCP**      | Full issue management     |
| Add issue comments     | **GitHub MCP**      | Direct API access         |
| Search code on GitHub  | **GitHub MCP**      | Cross-repo search         |
| List/manage milestones | **Bash `gh api`**   | No MCP milestone support  |
| Complex git operations | **Bash `git`**      | Rebase, cherry-pick, etc. |

### Git MCP Server

Use for local repository operations:

```
mcp__git__git_status      # Working tree status
mcp__git__git_diff        # View changes (staged/unstaged)
mcp__git__git_log         # Commit history
mcp__git__git_commit      # Create commits
mcp__git__git_branch      # List branches
mcp__git__git_checkout    # Switch branches
mcp__git__git_add         # Stage files
```

**Limitations:** Cannot push, pull, fetch, or perform remote operations.

### GitHub MCP Server

Use for GitHub API operations (requires `GITHUB_PERSONAL_ACCESS_TOKEN`):

```
mcp__github__create_issue           # Create new issues
mcp__github__update_issue           # Update issue state/labels/milestone
mcp__github__add_issue_comment      # Add comments to issues
mcp__github__list_issues            # List/filter issues
mcp__github__create_pull_request    # Create PRs
mcp__github__get_pull_request       # Get PR details
mcp__github__search_code            # Search code across repos
mcp__github__get_file_contents      # Read files from remote
```

**Limitations:** No milestone CRUD (use `gh api` for milestones).

### Bash git/gh CLI

Use when MCP tools don't support the operation:

```bash
# Remote operations (not in Git MCP)
git push origin branch-name
git pull origin main
git fetch --all

# Milestone management (not in GitHub MCP)
gh api repos/OWNER/REPO/milestones -X POST -f title="v1.0"
gh api repos/OWNER/REPO/milestones --jq '.[] | ...'

# Complex git operations
git rebase -i HEAD~3
git cherry-pick abc123
git stash push -m "message"
```

### Decision Flowchart

```
Is it a GitHub.com operation (issues, PRs, remote files)?
├─ Yes → Use GitHub MCP
│        └─ Unless it's milestones → Use `gh api`
└─ No → Is it a local git operation?
        ├─ Yes → Use Git MCP
        │        └─ Unless it's push/pull/fetch → Use `git` in Bash
        └─ No → Use Bash
```
