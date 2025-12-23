# GEMINI.md

This file provides guidance to Antigravity (Gemini) when working with code in this repository.

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

- **Next.js 16.0.7** with App Router
- **React 19.2.0** with React Aria Components
- **TypeScript 5** with strict mode
- **Tailwind CSS 4** for styling
- **File-based storage** (JSON files in `/data` directory)
- **bcrypt** for password hashing
- **Cookie-based sessions** (httpOnly, 7-day expiration)

### Path Aliases

- `@/*` maps to project root

### Key Directories

- `/app` - Next.js App Router pages and API routes
- `/lib` - Core business logic (types, storage, rules, auth)
- `/components` - Shared React components
- `/data` - JSON file storage (users, characters, campaigns, editions)
- `/docs` - Architecture documentation
- `/__tests__` - Vitest unit/integration tests
- `/e2e` - Playwright E2E tests

## Core Architecture Patterns

### 1. Modular Ruleset System

Data-driven ruleset loading and merging.

- `/lib/rules/loader.ts` - Loads edition metadata and book payloads
- `/lib/rules/merge.ts` - Merges books using merge strategies
- `/data/editions/{editionCode}/` - Edition data files

### 2. Character Creation Framework

Step-driven wizard persisting state to localStorage and `/data`.

- `/app/characters/create/components/CreationWizard.tsx` - Main orchestrator
- `/app/characters/create/components/steps/` - Individual step components

### 3. Character Advancement System

Karma-based progression logic.

- `/lib/rules/advancement/` - Core karma cost and validation logic
- `/app/characters/[id]/advancement/` - Advancement UI

### 4. File-Based Storage Pattern

Atomic JSON writes to disk.

- `/lib/storage/` - Persistence layer abstraction
- `/data/` - Storage root

## Development Guidelines

### File Operations

- Use the storage layer (`/lib/storage/`) instead of raw file system calls when possible.
- Atomic writes are handled by the storage layer services.

### API Routes

- Follow the authentication pattern: `getSession()` -> `getUserById()` -> authorize -> process -> return JSON.

### Common Pitfalls

- **State Mutation:** Never mutate state directly; always use functional updates or new objects.
- **Authentication:** All protected routes must verify the session.
- **Ruleset Loading:** Verify ruleset status before accessing ruleset data.

## Documentation

Refer to `/docs/` for detailed architecture, roadmap, and gap analysis.
