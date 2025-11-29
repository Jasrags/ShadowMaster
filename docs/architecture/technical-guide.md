# ShadowMaster Technical Architecture Guide

_Last updated: 2025-01-XX_

## 1. High-Level Stack
| Layer | Technology | Notes |
| --- | --- | --- |
| Frontend | React (TypeScript), Vite build, CSS (custom) | Progressive migration from legacy static HTML/JS; components mounted via portals. |
| Backend | Go 1.24.3+, Chi router, layered services | REST API with session cookies and role-based middleware. |
| Storage | JSON files on disk (`data/`) | Repositories read/write via `pkg/storage.JSONStore`; indexes maintained per entity. |
| Auth | HMAC-signed session cookies | `internal/api/session.go` manages creation, retrieval, and role enforcement. |
| Tooling | Go CLI normalizers, npm scripts (Node 20 LTS), Makefile | Chummer data importers under `cmd/tools/`; React smoke tests via `tsx`. |

---

## 2. Runtime Architecture
```
[React UI] ⇄ [REST API] ⇄ [Service Layer] ⇄ [Repositories] ⇄ [JSON Store]
                     │
             [Edition Data Loader]
```
- **Handlers (`internal/api/handlers.go`)** translate HTTP ↔ service DTOs with consistent error handling.
- **Services (`internal/service/…`)** enforce invariants (e.g., campaign edition immutability, creation method validation, Sum-to-Ten/Karma budgets).
- **Repositories (`internal/repository/json/…`)** encapsulate JSON read/write, index management, and migration helpers.
- **Edition Repository** loads per-edition character creation JSON and merges with campaign overrides.
- **Books Repository** exposes normalized source book catalogs with fallback for editions lacking datasets.

### Key Services
| Service | Responsibilities |
| --- | --- |
| `CampaignService` | CRUD + validation, gameplay rule resolution, book validation, creation method normalization. |
| `SessionService` | CRUD enforcing campaign linkage immutability. |
| `SceneService` | CRUD enforcing session linkage immutability. |
| `CharacterService` | Handles character persistence and creation validations (drives React wizard payloads while legacy list views finish migrating). |
| `UserService` | Registration, authentication, password updates, role-filtered user list. |
| `SR5` validators | Sum-to-Ten and Karma budget enforcement (`internal/service/sr5_*.go`). |

---

## 3. API Surface (current)
| Method & Route | Description | Auth |
| --- | --- | --- |
| `POST /api/auth/register` | Register + auto-login first user as admin. | Public |
| `POST /api/auth/login` / `POST /api/auth/logout` | Session management. | Public / Authenticated |
| `GET /api/auth/me` | Current user info. | Public (returns anon) |
| `POST /api/auth/password` | Change password. | Authenticated |
| `GET /api/users?role=` | Filtered user list (admins, GMs). | Admin or GM |
| `GET/POST/PUT/DELETE /api/campaigns` | Campaign CRUD with RBAC overlay. | Read: Auth optional; Write: Admin or GM |
| `GET /api/campaigns/{id}/character-creation` | Merge edition data + campaign overrides for builders. | Public |
| `GET /api/editions/{edition}/character-creation` | Raw edition dataset (used in legacy flows). | Public |
| `GET /api/editions/{edition}/books` | Source book catalog (with fallback). | Public |
| `GET/POST/PUT/DELETE /api/sessions` | Session CRUD. | Similar RBAC as campaigns |
| `GET/POST/PUT/DELETE /api/scenes` | Scene CRUD. | Similar RBAC as campaigns |
| `GET /api/characters` etc. | Legacy character endpoints (under active migration). | Mixed |

Error translation flows through `respondServiceError` for consistent HTTP codes.

---

## 4. Frontend Architecture
- **Entry (`web/ui/src/App.tsx`)** - React application entry point using React Router for navigation
- **Context**
  - `EditionContext`: Loads base edition data, merges campaign overrides, exposes `loadCampaignCharacterCreation`. Cached datasets prevent redundant fetches.
  - `AuthContext`: Manages user authentication state and session management
  - `ToastContext`: Provides cross-component notifications and toasts
- **Key Components**
  - `AuthPanel`: Authentication UI with login/registration
  - `CampaignCreation`: Modal wizard with multipage reducer, book selector, GM roster integration
  - `CampaignTable` + `DataTable`: Reusable table with sort/filter and RBAC-aware actions
  - `CharacterCreationWizard`: Multi-step character creation flow for SR3 and SR5
  - `PriorityAssignment` suite: Handles Priority, Sum-to-Ten, Karma flows using edition context
- **Styling**: Tailwind CSS with React Aria Components for accessible UI elements
- **Build**: Vite for fast development and optimized production builds

---

## 5. Data Pipelines & Assets
- **Chummer Importers (`cmd/tools/chummer*/main.go`)** normalize raw JSON datasets into `data/editions/sr5/<category>/all.json` with metadata, IDs, slugs, and serialized extras.
- **Indexing (`internal/repository/json/index.go`)** keeps maps for campaigns, characters, users to accelerate lookups.
- **Edition Data (`data/editions/sr5/character_creation.json`)** defines gameplay levels, creation methods, resource overrides, and now embeds a pointer to campaign support presets when available.
- **Campaign Support Presets (`data/editions/sr5/campaign_support.json`)** centralize reusable factions/locations surfaced in both the campaign wizard and management drawer. Loaded alongside edition data by `EditionRepository`.
- **Source Books (`data/editions/sr5/books/all.json`)** feed campaign book selector; fallbacks cover missing editions.

To regenerate a dataset: `go run ./cmd/tools/chummer<dataset> -data ./data` (CLI usage documented in respective tool readmes).

---

## 6. Authentication & RBAC
- Sessions stored as signed cookies (`SessionManager`) with configurable TTL.
- Roles enforced by middleware (`RequireRole`) wrapping route groups.
- Campaign-level RBAC also applied in handlers (`canManageCampaign`) to verify GM ownership or admin status on each request.
- First registered user auto-escalated to Administrator for bootstrap.

---

## 7. Testing & Quality
| Area | Tooling | Notes |
| --- | --- | --- |
| Go unit tests | `go test ./...` | Covers services (campaign validation, Sum-to-Ten/Karma logic), API handler integration tests. |
| React unit tests | `npm --prefix web/ui run test` | Vitest + Testing Library suite. Includes coverage for campaign drawer preset picker behaviour. |
| React linting | `npm --prefix web/ui run lint` | ESLint with TypeScript support for code quality checks. |
| Linting | Go formatter (`gofmt`), TypeScript compiler | Formal lint pipeline TBD. |
| Data validation | CLI importers log errors; TODO: add CI check comparing normalized output. |

Future: integrate CI to run Go + React tests, add e2e flows once session dashboards arrive.

---

## 8. Local Development Cheatsheet
```bash
# Backend API
make server               # or go run ./cmd/shadowmaster-server
make run-dev              # runs both API server and frontend dev server

# React development
cd web/ui && npm install
npm run dev               # Vite dev server on port 5173 with hot reload

# React production build
npm run build             # outputs to web/static/

# Run Go tests
go test ./...

# React linting
npm --prefix web/ui run lint

# React unit tests (when available)
npm --prefix web/ui run test

# Regenerate SR5 gear dataset
go run ./cmd/tools/chummergear --data ./data
```

Environment variables: `SESSION_SECRET` recommended for HMAC signing (falls back to default if unset).

---

## 9. Deployment & Scaling Considerations
- JSON storage works for single-node development; multi-user production should migrate to a database (PostgreSQL or similar) with the same repository interfaces.
- Static assets served by Go server (`cmd/shadowmaster-server/main.go`) via Chi.
- When dataset count grows, consider caching edition data in-memory with invalidation on file change.
- Web client still depends on legacy HTML structure; finish React migration before introducing SPA routing.

---

## 10. Roadmap Tie-Ins
- Session/scene React migration will reuse `DataTable` and service routes already in place.
- Character creation wizard completion depends on edition context + campaign defaults; ensure `EditionContext` exposes mutation hooks once characters tie directly to campaigns.
- Edition expansion (SR3/SR6) requires replicating data pipelines and toggling `supportedEditions` in the frontend.

Document owner: Engineering team (`@jrags`, @contributors). Update this guide when introducing new services, data stores, or deployment strategies.
