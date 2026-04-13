# Contributing to Shadow Master

## Prerequisites

- **Node.js** 18+
- **pnpm** (package manager)
- **Docker** (optional, for containerized dev)

## Setup

```bash
git clone <repo-url>
cd ShadowMaster
pnpm install
cp .env.example .env.local   # Configure environment
pnpm dev                      # http://localhost:3000
```

## Git Workflow

1. Create a feature branch: `git checkout -b feature/<issue-number>-<short-description>`
2. Never commit directly to `main`
3. Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`

## Pre-commit Hooks

Hooks run automatically via Husky:

- **Pre-commit**: lint-staged, type-check
- **Pre-push**: knip (dead code), CLAUDE.md validation

<!-- AUTO-GENERATED:SCRIPTS:START -->

## Available Scripts

### Development

| Command         | Description                                        |
| --------------- | -------------------------------------------------- |
| `pnpm dev`      | Start dev server (Next.js)                         |
| `pnpm dev:all`  | Dev server + type-check + lint (concurrent)        |
| `pnpm dev:full` | Dev server + type-check + lint + knip (concurrent) |
| `pnpm build`    | Production build                                   |
| `pnpm start`    | Start production server                            |

### Quality Checks

| Command             | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `pnpm lint`         | ESLint with cache                                        |
| `pnpm type-check`   | TypeScript strict check                                  |
| `pnpm check`        | Combined lint + type-check + knip                        |
| `pnpm check:ci`     | Full CI check (format + lint + type-check + test + knip) |
| `pnpm format`       | Prettier formatting                                      |
| `pnpm format:check` | Check formatting without writing                         |
| `pnpm knip`         | Dead code detection                                      |

### Testing

| Command              | Description                |
| -------------------- | -------------------------- |
| `pnpm test`          | Run unit tests (Vitest)    |
| `pnpm test:watch`    | Tests in watch mode        |
| `pnpm test:ci`       | Tests for CI (single run)  |
| `pnpm test:coverage` | Tests with coverage report |
| `pnpm test:e2e`      | Playwright E2E tests       |
| `pnpm test:e2e:ui`   | Playwright with UI mode    |

### Data Validation

| Command                       | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| `pnpm verify-data`            | Validate JSON data files                           |
| `pnpm verify-naming`          | Check kebab-case naming conventions                |
| `pnpm verify-reference`       | Compare reference extractions against edition data |
| `pnpm validate-characters`    | Validate example character files                   |
| `pnpm validate-docs`          | Validate CLAUDE.md counts                          |
| `pnpm validate-creation-docs` | Check creation component doc drift                 |

### Utilities

| Command                  | Description                           |
| ------------------------ | ------------------------------------- |
| `pnpm backup`            | Backup data files                     |
| `pnpm health-check`      | Run health check script               |
| `pnpm seed-data`         | Seed development data                 |
| `pnpm user-admin`        | User administration CLI               |
| `pnpm check-tests`       | Check test coverage gaps              |
| `pnpm generate-diagrams` | Generate component hierarchy diagrams |

### Docker

| Command                   | Description                       |
| ------------------------- | --------------------------------- |
| `pnpm docker:dev`         | Build and start Docker containers |
| `pnpm docker:build`       | Build Docker image                |
| `pnpm docker:build:fresh` | Build without cache               |
| `pnpm docker:up`          | Start containers                  |
| `pnpm docker:down`        | Stop containers                   |
| `pnpm docker:logs`        | Tail container logs               |

### Auditing

| Command                       | Description                      |
| ----------------------------- | -------------------------------- |
| `pnpm audit:creation`         | Creation UX audit                |
| `pnpm audit:creation:strict`  | Strict creation audit            |
| `pnpm audit:creation:verbose` | Verbose creation audit           |
| `pnpm audit:creation:report`  | Creation audit (markdown output) |

<!-- AUTO-GENERATED:SCRIPTS:END -->

## Testing

- Test files live in `__tests__/` directories mirroring source: `lib/rules/foo.ts` -> `lib/rules/__tests__/foo.test.ts`
- Component tests adjacent: `components/creation/Foo.tsx` -> `components/creation/__tests__/Foo.test.tsx`
- Naming: `describe('FunctionName')` -> `it('does X when Y')`
- Prefer `userEvent` over `fireEvent` in component tests
- No test file should import from another test file

## Code Style

- **TypeScript strict mode** — no `any`, no `@ts-ignore`
- **React Aria Components** — no raw `<button>`, `<input>`, `<select>`
- **Tailwind CSS** — no inline styles
- **Named exports** from non-page files
- **Immutable updates** — never mutate state directly
- **Data identifiers** in JSON: `kebab-case`
- **TypeScript keys**: `camelCase`
- Always import types from `@/lib/types`

## PR Checklist

- [ ] `pnpm type-check` passes
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes
- [ ] No `any` types introduced
- [ ] No `@ts-ignore` / `@ts-expect-error`
- [ ] Authentication checked on protected routes
- [ ] No hardcoded secrets
