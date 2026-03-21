# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and Cursor IDE when working with code in this repository.

For detailed architecture reference, use the `/architecture-reference` skill (loaded on demand to save context).

## Project Overview

**Shadow Master** is a character management system for the Shadowrun tabletop RPG, supporting all editions (1E-6E plus Anarchy). Post-MVP with full SR5 support including character creation, advancement, combat tracking, campaign management, and GM tools.

## Development Commands

```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm test             # Run unit tests (Vitest)
pnpm test:e2e         # Run E2E tests (Playwright)
pnpm lint             # ESLint
pnpm type-check       # TypeScript checking
pnpm check            # Combined lint + type-check + knip
pnpm format           # Prettier formatting
pnpm knip             # Dead code detection
pnpm verify-data      # Validate JSON data files
pnpm verify-reference # Compare reference extractions against edition data
pnpm docker:dev       # Build and start Docker containers
```

**Environments:** `local` (pnpm dev), `docker` (pnpm docker:dev), `staging` (Portainer), `production` (hidden badge)

**Git Hooks:** pre-commit (lint-staged, type-check), pre-push (knip, CLAUDE.md validation)

## Tech Stack

- **Next.js 16.1.6** with App Router (React Server Components), **React 19.2.4** with React Aria Components
- **TypeScript 5** strict mode, **Tailwind CSS 4** dark mode, **Path alias:** `@/*` maps to project root
- **File-based storage** (JSON in `/data` - no database), **bcryptjs** passwords, **cookie-based sessions** (httpOnly, 7-day)

## Key Directories

```
/app                    # Next.js App Router pages + API routes (~162 route files)
/lib                    # Business logic (types, storage ~22 modules, rules, auth, combat, security)
/components/creation    # Character creation cards (~142 components in 21 subfolders)
/data/editions/{code}/  # Edition data (edition.json, core-rulebook.json, grunt-templates/)
/docs/pdfs/             # Sourcebook PDFs for rule reference (Core Rulebook, Run Faster, Run & Gun, Errata)
/__tests__              # ~493 test files (Vitest)
/e2e                    # E2E tests (Playwright)
```

## Git Workflow

IMPORTANT: Always create a feature branch BEFORE making any commits. Never commit directly to main. Use: `git checkout -b feature/<issue-number>-<short-description>`

## Pre-Commit Checklist

IMPORTANT: After implementing any feature, always run `pnpm type-check` and `pnpm test` before committing. Fix all TypeScript errors and test failures before creating a commit.

## Common Pitfalls

1. **Don't mutate state directly** - Use `setState()` with new objects
2. **Don't skip authentication** - All protected routes must call `getSession()`
3. **Don't assume ruleset is loaded** - Check `useRulesetStatus()` for errors
4. **Don't create new files unnecessarily** - Prefer editing existing files
5. **Don't use `cd` in bash** - Use absolute paths

## Naming Conventions

- **Data identifiers** (`id`, `category`, `subcategory` values in JSON): `kebab-case` — regex: `/^[a-z0-9]+(-[a-z0-9]+)*$/`
- **TypeScript object keys**: `camelCase`
- IMPORTANT: **Always import from `@/lib/types`**
- Run `pnpm verify-naming` to validate naming conventions in data files

## File Operations

Always use TypeScript storage layer (`readJsonFile()`, `writeJsonFile()`) instead of bash commands.

## Implementation Guidelines

When implementing validators or features that follow existing patterns, read at least one existing implementation first and match its patterns exactly (enum usage, type narrowing approach, mock structure in tests).

## Workflow Patterns

When working on GitHub issues, split into TWO separate sessions: (1) exploration + plan creation, (2) implementation + PR. Do not try to explore AND implement in one session — start implementation immediately if a plan already exists.

## Project Conventions

This is a TypeScript project. All source files use `.ts` and `.tsx` extensions. When writing grep/search patterns, always include both extensions. Use extended regex (`grep -E`) when using alternation patterns.

## Tools & Preferences

Use `gh` CLI for all GitHub operations (issue creation, PR creation, etc.) instead of MCP GitHub tools. Example: `gh pr create --title 'feat: ...' --body '...'`

## Keeping Documentation in Sync

When modifying files in `/components/creation/`:

- Update hierarchy diagrams in `/docs/architecture/creation-components/`
- Run `pnpm validate-creation-docs` to check for drift
- Run `pnpm validate-docs` to validate CLAUDE.md counts

## Skills Reference

Use skills for detailed domain knowledge (loaded on demand, not every session):

- `/architecture-reference` - Detailed subsystem docs (Combat, Matrix, Rigging, Inventory, Contacts, Sync, Security)
- `/component-patterns` - Component organization guidelines (subfolder vs single file)
- `/testing` - Test infrastructure, patterns, and file locations
- `/mcp-guide` - MCP server selection and usage
- `/github-issues` - GitHub issue management (epics, sub-issues, milestones)
- `/extract-rulebook` - Extract entire sourcebooks into structured reference material (TOC discovery, manifest, sequential extraction)
- `/verify-reference` - Compare extracted reference data against edition JSON files (structural + semantic gap analysis)
- `/edition-data-author` - Creating catalog items for edition JSON files
- `/archetype-import` - Importing SR5 archetypes from sourcebook stat blocks
- `/shadowrun-aesthetic` - UI styling guidelines
- `/sheet-ui-redesign` - Redesign sheet display components to match creation card aesthetic
- `/plan` - Create implementation plans from GitHub issues
- `/ship` - Ship current work (type-check, test, commit, push, create PR)

## Forbidden Patterns

These patterns are never acceptable — do not introduce them, do not approve them in reviews:

- `any` — use `unknown` with a type guard, or define the correct type
- `@ts-ignore` / `@ts-expect-error` — fix the type error; suppress only if third-party library issue, with a comment explaining why
- `useEffect` for derived state — compute derived values inline or with `useMemo`
- Raw HTML interactive elements (`<button>`, `<input>`, `<select>`) — use React Aria Components equivalents
- Inline styles (`style={{}}`) — use Tailwind utility classes; if a value isn't in Tailwind's scale, add a comment justifying it
- Default exports from non-page/layout files — named exports only in `lib/`, `components/`, `hooks/`
- Direct DB calls from components — all data access goes through API routes or server actions

## JSON Data Schemas

### edition.json (top-level manifest)

{
"id": "string — kebab-case edition identifier",
"name": "string — display name",
"version": "string — edition version",
"rulebooks": ["array of rulebook id strings"]
}

### core-rulebook.json (catalog entries)

{
"id": "string — kebab-case",
"name": "string — display name",
"page": "number",
"section": "string — parent section id or null",
"entries": ["optional array of child entry ids"]
}

## Environment Variables

Required:

- `NEXT_PUBLIC_APP_URL` — canonical app URL (defaults to `http://localhost:3000`)

Email (required for email features):

- `EMAIL_TRANSPORT` — transport type: `smtp`, `resend`, `file`, or `mock`
- `EMAIL_FROM` — sender email address
- `EMAIL_FROM_NAME` — sender display name
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` — SMTP config (when `EMAIL_TRANSPORT=smtp`)
- `RESEND_API_KEY` — Resend API key (when `EMAIL_TRANSPORT=resend`)
- `ADMIN_NOTIFICATION_EMAIL` — admin notification recipient

Optional:

- `NEXT_PUBLIC_GIT_SHA` — git SHA displayed in UI (set by CI)
- `E2E_BYPASS_SECRET` — bypasses signup restrictions in non-production E2E tests
- `LOG_LEVEL` — logging level override (default: info)
- `NODE_ENV` — defaults to `development`
- `GITHUB_PERSONAL_ACCESS_TOKEN` — enables GitHub MCP server if re-enabled

## Test Conventions

- Test files live in `__tests__/` directories mirroring their source: `lib/rules/foo.ts` → `lib/rules/__tests__/foo.test.ts`
- Component tests live adjacent to components: `components/creation/Foo.tsx` → `components/creation/__tests__/Foo.test.tsx`
- Test naming: `describe('FunctionOrComponentName')` → `it('does X when Y')`
- No test file should import from another test file
- Prefer `userEvent` over `fireEvent` in component tests
