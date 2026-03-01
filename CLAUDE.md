# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and Cursor IDE when working with code in this repository.

@docs/claude/reference.md

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
/app                    # Next.js App Router pages + API routes (~146 route files)
/lib                    # Business logic (types, storage ~21 modules, rules, auth, combat, security)
/components/creation    # Character creation cards (~117 components in 19 subfolders)
/data/editions/{code}/  # Edition data (edition.json, core-rulebook.json, grunt-templates/)
/__tests__              # ~353 test files (Vitest)
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
- `/edition-data-author` - Creating catalog items for edition JSON files
- `/archetype-import` - Importing SR5 archetypes from sourcebook stat blocks
- `/shadowrun-aesthetic` - UI styling guidelines
- `/sheet-ui-redesign` - Redesign sheet display components to match creation card aesthetic
