# ShadowMaster Unified Roadmap

_Last updated: 2025-11-10_

This roadmap consolidates prior plans (`application-architecture-plan.md`, `auth-roadmap.md`, `frontend/react-migration.md`, `plans/expose-campaign-defaults-plan.md`, and the former `multi-edition-support` plan) into one living source. It tracks what is done, what is in flight, and what is queued next so we can prioritize work without hopping between documents.

---

## 1. Outcome Map

| Stream | Goal | Status | Notes |
| --- | --- | --- | --- |
| **Authentication & RBAC** | Users can register, sign in, and act with role-scoped permissions. | ✅ Done | Backend + React UI shipped, tests in place. |
| **Data & Domain Alignment** | Campaigns/characters/sessions/scenes share immutable edition + creation context. | ✅ Done | Domain structs, JSON indexes, migrations completed. |
| **API & RBAC Hardening** | Service layer + REST endpoints enforce invariants and roles. | ✅ Done | Campaign/session/scene services live; middleware applied. |
| **Edition & Creation Methods** | SR5 gameplay levels and creation method variants exposed end-to-end. | ⚙️ In progress | Gameplay defaults surfaced; Sum-to-Ten/Karma still stubbed. |
| **React Migration** | Modern UI for navigation, auth, campaigns, sessions, and character flows. | ⚙️ In progress | Auth, nav, campaign table/wizard migrated; character wizard + sessions/scenes outstanding. |
| **Quality & Documentation** | Confidence via tests, docs, and data migration guidance. | ⚙️ In progress | Go + React tests added; unified roadmap is new; remaining doc refreshes tracked below. |

Legend: ✅ Complete • ⚙️ In Progress • 🔜 Planned • 🛑 Blocked

---

## 2. Priority Queue (Next Up)

1. **Edition & Creation Method Support (Phase 3 finish)**
   - [x] Extend SR5 edition JSON and campaign validation to expose Sum-to-Ten and Karma methods.
   - [x] Deliver SR5 Sum-to-Ten validation plus React priority-step budget workflow.
   - [x] Implement SR5 Karma pipeline (service + UI scaffolding).
   - [ ] Define SR5 advancement/karma costs and integrate with gameplay levels.
   - [x] Expand tests covering alternative creation math.
   - [ ] Document campaign setup implications for non-Priority methods.

2. **Character Creation Wizard Conversion**
   - [ ] Reactify remaining steps (Attributes, Skills, Gear preview).
   - [ ] Ensure campaign defaults (karma, resources, restrictions) flow through every step.
   - [ ] Provide validation summaries before character save.

3. **Session & Scene React Migration**
   - [ ] Build reusable table/detail views for sessions and scenes with RBAC-aware actions.
   - [ ] Hook React flows into legacy bridge until full replacement.
   - [ ] Surface session scheduling and scene participant management.

4. **Data Integrity & Tooling**
   - [ ] Add automated migrations/backfill scripts for legacy campaign data (edition/method defaults).
   - [ ] Formalize data seeding for demo/test environments (users, campaigns, characters).

5. **Campaign Management Enhancements**
   - [ ] Introduce a read-only campaign detail view accessible from the campaign table.
   - [ ] Provide a shareable campaign summary layout separate from editing controls.
   - [ ] Expand preset libraries (contacts, safehouses, session hooks) once core UX lands.

---

## 3. Edition Strategy & SR5 Rollout

- **Ruleset Architecture**
  - ✅ Adopt shared `Ruleset` interface (metadata, priorities, metatypes, attributes, skills, magic, validation, derived stats).
  - [ ] Implement `SR5Ruleset` end-to-end; reuse existing SR3 logic via `SR3Ruleset` wrapper once SR5 flow is stable.
  - [ ] Propagate ruleset selection across backend services and React context (campaign-driven).

- **Data Separation**
  - ✅ Store edition JSON under `data/editions/{edition}` (character creation, gameplay levels).
  - [ ] Backfill remaining SR5 datasets (skills, gear, combat modifiers, spells, augmentations) and version them.
  - [ ] Add transformation scripts to regenerate JSON from markdown tables and prevent drift.

- **React Migration Milestones**
  - ✅ React root + `EditionContext` scaffolding.
  - ✅ Wizard steps migrated: Priorities, Metatypes, Magical Abilities.
  - [ ] Migrate Attributes, Skills, Gear/Lifestyle, and summary/validation steps.
  - [ ] Replace character roster cards with shared `DataTable`; connect to campaign defaults.

- **Testing & Fixtures**
  - [ ] Create fixture characters for SR5 (priority, Sum-to-Ten, Karma) to validate derived stats.
  - [ ] Add integration tests covering SR5 wizard happy path and failure scenarios.

- **Documentation**
  - [ ] Author `docs/editions.md` summarizing ruleset architecture, data locations, and how to extend editions.
  - [ ] Update SR3 documentation to reflect migration to shared ruleset once refactored.

---

## 4. In-Flight / Active Work

- React campaign management is live; follow-up tasks include:
  - [ ] Finish documentation updates (see Section 5).
  - [ ] Extend reusable `DataTable` to sessions/scenes.
- Edition context now merges campaign overrides; next iteration:
  - [ ] Cache preloaded edition data client-side for faster tab switches.
  - [ ] Normalize legacy characters against campaign gameplay rules.

---

## 5. Completed Milestones (Historical Reference)

- ✅ **Authentication Roadmap**
  - User repository + service, bcrypt hashing, session middleware, `RequireRole` guards.
  - React Auth Panel, now embedded in header with dropdown menu.
  - Go and React smoke tests covering auth lifecycle.

- ✅ **Data & Domain Alignment**
  - Character and campaign structs gain `user_id`, `campaign_id`, `is_npc`, `creation_method`, `gameplay_level`, etc.
  - JSON repositories maintain indexes for campaign→characters and user→characters.
  - Services enforce immutable campaign edition/method and session/scene parent linkage.

- ✅ **API & RBAC Hardening**
  - Campaign/session/scene CRUD backed by service layer validations.
  - `SessionManager` produces signed cookies; `RequireAuth`/`RequireRole` wrap protected routes.
  - Campaign character-creation endpoint merges edition JSON with gameplay overrides.

- ✅ **React Campaign Experience**
  - Navigation tabs reworked in React.
  - Campaign creation wizard with edition/method/level dropdowns and GM selector.
  - Campaign table leveraging reusable `DataTable`, including edit/delete modals tied to RBAC.
  - Legacy campaign modal fully retired.
  - SR5 preset libraries (factions, locations, placeholders, session seeds) hooked into wizard + drawer.

---

## 6. Documentation & Testing To-Do

- [ ] Update `application-architecture-plan.md` to link back to this roadmap and trim redundant sections.
- [ ] Refresh `frontend/react-migration.md` to summarize remaining React deliverables (sessions/scenes, character wizard).
- [ ] Capture edition-specific creation math (Priority, Sum-to-Ten, Karma) in a shared reference once implementation lands.
- [ ] Expand Go test coverage for scenes/sessions once React CRUD is introduced.
- [ ] Add end-to-end smoke test covering campaign creation + character wizard path with campaign defaults.
- **React test coverage plan**
  - Audit components and prioritize critical flows (campaign creation, management drawers, shared inputs) for first-wave coverage.
  - Expand Vitest + Testing Library suites to lock rendering behaviour and side-effects.
  - Strengthen integration smoke tests that exercise multi-step flows (wizard validation, preset add/remove loops).
  - Evaluate Storybook and visual regression tooling once baseline unit coverage lands.

---

## 7. Backlog / Future Considerations

- **User Settings & Profile**
  - Settings panel (themes, password, email notifications).
  - Character ownership transfer and invitations.

- **Campaign Enhancements**
  - Session attendance tracking and XP/karma allocation tooling.
  - Scene templates (combat/matrix/social) with quick-add NPCs.

- **Infrastructure**
  - CI pipeline for Go + React tests.
  - Packaging strategy for edition data updates (hot reload vs. build-time).

---

## 8. Maintenance Notes

- Treat this file as the single roadmap of record. When milestones complete, check them off here and optionally prune detailed breakdowns from legacy docs.
- Keep status indicators aligned with TODO tracking or issue tracker milestones.
- Contributors should append dated updates when scope shifts or new priorities surface.


