# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Shadow Master** is a character management system for the Shadowrun tabletop RPG, supporting all editions (1E-6E plus Anarchy). The application provides multi-edition character creation with edition-specific rules, flexible ruleset system supporting sourcebooks and errata, and character lifecycle management.

**Current Status:** MVP phase focusing on SR5 Priority-based character creation.

## Development Commands

### Essential Commands
- `pnpm dev` - Start development server (http://localhost:3000)
- `pnpm dev:all` - Start dev server with type-check and lint watch
- `pnpm build` - Create production build
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run unit tests (Vitest)
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:e2e` - Run E2E tests (Playwright)

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
- **bcrypt** for password hashing
- **Cookie-based sessions** (httpOnly, 7-day expiration)

### Path Aliases
- `@/*` maps to project root (e.g., `import { Character } from "@/lib/types"`)

### Key Directories

```
/app                    # Next.js App Router pages and API routes
  /api                  # API route handlers
    /characters/[characterId]/advancement  # Advancement API endpoints
  /characters           # Character management pages
    /create             # Character creation wizard
    /[id]               # Character sheet view/edit
    /[id]/advancement   # Character advancement UI
  /campaigns            # Campaign management pages
  /users                # User management (admin)
  /signin, /signup      # Authentication pages
/lib                    # Core business logic
  /types                # TypeScript type definitions
  /storage              # File-based data persistence layer
  /rules                # Ruleset loading and merging system
    /advancement        # Karma advancement logic (attributes, skills, edge)
    /qualities          # Quality effects and validation
  /auth                 # Authentication and session management
/components             # Shared React components
/data                   # JSON file storage (acts as database)
  /users                # User records
  /characters           # Character records (organized by userId)
  /campaigns            # Campaign records
  /editions             # Edition metadata and ruleset data
/docs                   # Architecture documentation
/__tests__              # Test files (Vitest)
/e2e                    # E2E tests (Playwright)
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

Wizard-based, step-driven, budget-constrained character creation.

**Key Concepts:**
- **CreationMethod**: Defines creation steps, budgets, and constraints
- **CreationState**: Tracks wizard progress, selections, and budgets
- **Step Types**: `select`, `priority`, `allocate`, `choose`, `purchase`, `info`, `validate`
- **Draft Auto-save**: Persists state to localStorage on every change

**Critical Files:**
- `/app/characters/create/components/CreationWizard.tsx` - Main orchestrator
- `/app/characters/create/components/steps/` - Individual step components
- `/lib/types/creation.ts` - Creation method and state types

**Character Creation Flow:**
```
EditionSelector
  → RulesetProvider.loadRuleset()
  → CreationWizard renders steps
  → User completes steps (auto-saved to localStorage)
  → POST /api/characters (creates draft)
  → Redirect to character sheet
```

### 3. Character Advancement System

Post-creation karma spending for character progression.

**Key Concepts:**
- **Advancement Types**: Attributes, skills, specializations, edge
- **Karma Costs**: Calculated based on current rating and advancement type
- **Training Time**: Optional downtime tracking for advancement
- **GM Approval**: Workflow for campaign-linked characters
- **Validation**: Ensures advancements follow edition rules

**Critical Files:**
- `/lib/rules/advancement/` - Core advancement logic
  - `costs.ts` - Karma cost calculations
  - `attributes.ts` - Attribute advancement
  - `skills.ts` - Skill advancement
  - `edge.ts` - Edge advancement
  - `training.ts` - Training time calculations
  - `validation.ts` - Rule validation
- `/app/api/characters/[characterId]/advancement/` - API endpoints
- `/app/characters/[id]/advancement/` - UI components

**Advancement Flow:**
```
User requests advancement
  → Validate against rules (karma available, max ratings, etc.)
  → Calculate karma cost
  → Apply advancement to character
  → Record in advancement history
  → (If campaign-linked) Submit for GM approval
```

### 4. Data Management Layers

**Authentication State** (`/lib/auth/AuthProvider.tsx`):
- React Context managing user session globally
- Provides `useAuth()` hook for components
- Session stored in httpOnly cookie

**Ruleset State** (`/lib/rules/RulesetContext.tsx`):
- React Context caching loaded ruleset
- Provides hooks: `useRuleset()`, `useMetatypes()`, `useSkills()`, etc.
- Fetches from `/api/rulesets/[editionCode]`

**Local Storage**:
- Character creation wizard auto-saves drafts
- Draft recovery on page reload

### 4. File-Based Storage Pattern

**Design:** JSON files on disk with atomic writes (temp file + rename pattern)

**Storage Layer** (`/lib/storage/`):
- `base.ts` - Core utilities: `readJsonFile()`, `writeJsonFile()`, `ensureDirectory()`
- `users.ts` - User CRUD operations
- `characters.ts` - Character CRUD + specialized operations (damage, karma, etc.)
- `editions.ts` - Edition and ruleset loading

**Storage Structure:**
```
/data
├── /users/{userId}.json
├── /characters/{userId}/{characterId}.json
└── /editions/{editionCode}/
    ├── edition.json
    ├── core-rulebook.json
    └── {sourcebook}.json
```

**Important:** This is NOT production-scalable. File I/O happens on every request. Future migration to a database is planned.

### 5. API Route Patterns

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
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = getUserById(session.userId)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const characters = getUserCharacters(session.userId)
  return NextResponse.json({ characters })
}
```

## Critical Code Flows

### User Authentication
```
/signin page
  → POST /api/auth/signin
  → Validate email/password (bcrypt)
  → createSession(userId) sets cookie
  → AuthProvider updates context
  → Redirect to /
```

**Files:** `/app/signin/page.tsx`, `/app/api/auth/signin/route.ts`, `/lib/auth/session.ts`, `/lib/auth/password.ts`

### Ruleset Loading and Merging
```
Client: loadRuleset("sr5")
  → GET /api/rulesets/sr5
  → Server: loadRuleset() loads edition + books
  → mergeRuleset() combines with strategies
  → Returns MergedRuleset
  → RulesetContext caches in state
  → UI hooks extract data
```

**Files:** `/lib/rules/loader.ts`, `/lib/rules/merge.ts`, `/app/api/rulesets/[editionCode]/route.ts`

### Character Creation
```
/characters/create
  → EditionSelector picks edition
  → RulesetProvider loads ruleset
  → CreationWizard renders steps
  → Each step updates CreationState
  → Auto-save to localStorage
  → Final step: POST /api/characters
  → createCharacterDraft() saves to /data
  → Redirect to /characters/[id]
```

**Files:** `/app/characters/create/components/CreationWizard.tsx`, `/app/characters/create/components/steps/*`, `/app/api/characters/route.ts`

## Type System

All domain entities have TypeScript interfaces in `/lib/types/`:
- `User`, `Character`, `Edition`, `Book`, `CreationMethod`
- Extensive sub-types for character components (skills, qualities, gear, etc.)
- Single export point: `/lib/types/index.ts`

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
- `RulesetProvider` - Loaded ruleset caching (nested in pages that need it)

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

**New Character Creation Step:**
1. Define step in ruleset JSON (`core-rulebook.json`)
2. Create step component in `/app/characters/create/components/steps/`
3. Import and map in `CreationWizard.tsx`
4. Update `CreationState` type if needed

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
- **Vitest** - Unit and integration tests
- **Playwright** - E2E browser tests
- **Testing Library** - React component testing

**Test Locations:**
```
/__tests__/                           # Root level tests
/lib/auth/__tests__/                  # Auth unit tests
/lib/storage/__tests__/               # Storage layer tests
/lib/rules/__tests__/                 # Rules engine tests
/lib/rules/advancement/__tests__/     # Advancement logic tests
/lib/rules/qualities/__tests__/       # Quality system tests
/app/api/**/__tests__/                # API route tests
/e2e/                                 # Playwright E2E tests
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
2. Test character creation wizard end-to-end
3. Check `/data` directory for persisted JSON
4. Verify authentication by signing out and back in
5. Test draft auto-save by refreshing wizard mid-creation

## Documentation

Comprehensive architecture docs in `/docs/`:
- `architecture-overview.md` - Tech stack and design principles
- `character_creation_framework.md` - Creation method design
- `edition_support_and_ruleset_architecture.md` - Ruleset system details
- `ruleset_architecture_and_source_material_system.md` - Book-based overrides
- `merging_algorithm.md` - Merge strategy details
- `implementation_roadmap.md` - Feature roadmap
- `mvp_gap_analysis.md` - Current vs. target features

**Always consult these docs when making architectural changes.**

## Future Migration Notes

**Known Technical Debt:**
1. **File-based storage** - Plan database migration (PostgreSQL/MongoDB recommended)
2. **Limited error handling** - Some API routes need better error recovery
3. **Session security** - Consider JWT/OAuth for production scale
4. **SR5 only** - Data structures ready for other editions, implementation pending
5. **No concurrent write protection** - File storage needs locking for production

## Key Files to Understand First

1. `/lib/types/index.ts` - All data structures
2. `/lib/rules/loader.ts` + `merge.ts` - Ruleset system core
3. `/lib/rules/advancement/` - Karma advancement system
4. `/lib/storage/base.ts` - Storage abstraction
5. `/app/characters/create/components/CreationWizard.tsx` - Character creation orchestrator
6. `/lib/auth/AuthProvider.tsx` - Authentication context
7. `/lib/rules/RulesetContext.tsx` - Ruleset hooks and context
8. `/docs/architecture/` - Architecture documentation

## MCP Servers

This project has MCP servers configured in `.mcp.json` for enhanced workflow:

### Available Servers

| Server | Purpose | When to Use |
|--------|---------|-------------|
| **memory** | Persistent knowledge graph | Store/recall architectural decisions, patterns, known issues |
| **git** | Git operations | Commits, diffs, branches, history viewing |
| **filesystem** | File operations on project | Read/write any project files |
| **sequentialthinking** | Structured problem-solving | Complex debugging, architecture decisions, multi-step analysis |
| **time** | Timezone utilities | Timestamps (rarely needed) |

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

### Git Server Usage

Prefer MCP git tools over bash for cleaner integration:
- `mcp__git__git_status` - Check working tree
- `mcp__git__git_diff` - View changes
- `mcp__git__git_log` - View history
- `mcp__git__git_commit` - Create commits
- `mcp__git__git_branch` - List branches
