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
   - [x] Reactify shell + modal (CharacterWizard, WizardContext) and retire legacy modal markup.
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
  - ✅ Replace character roster cards with shared `DataTable`; connect to campaign defaults.

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
- **Recent**: Characters tab migrated to React `DataTable`; legacy list now suppressed. React CharacterWizard is the sole flow (legacy JS trimmed to minimal loaders for nav fallbacks).

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
  - Legacy character wizard JS removed; React wizard drives creation end-to-end (legacy JS only refreshes lists for nav fallbacks).
  - SR5 preset libraries (factions, locations, placeholders, session seeds) hooked into wizard + drawer.

---

## 6. Documentation & Testing To-Do

- [ ] Update `application-architecture-plan.md` to link back to this roadmap and trim redundant sections.
- [ ] Refresh `frontend/react-migration.md` to summarize remaining React deliverables (sessions/scenes, character wizard).
- [ ] Capture edition-specific creation math (Priority, Sum-to-Ten, Karma) in a shared reference once implementation lands.
- [ ] Expand Go test coverage for scenes/sessions once React CRUD is introduced.
- [ ] Add end-to-end smoke test covering campaign creation + character wizard path with campaign defaults.
- [ ] Add Go unit tests for `pkg/storage` helpers and remaining `internal/repository/json` packages (characters, groups, sessions, scenes, users) to reach consistent coverage.
- [ ] Expand Go API handler tests beyond campaigns (auth flows, groups, sessions/scenes CRUD, equipment/skills endpoints) to lock HTTP responses.
- [ ] Introduce integration tests verifying edition/book repositories load mixed data from disk.
- **React test coverage plan**
  - Audit components and prioritize critical flows (campaign creation, management drawers, shared inputs) for first-wave coverage.
  - Expand Vitest + Testing Library suites to lock rendering behaviour and side-effects.
  - Strengthen integration smoke tests that exercise multi-step flows (wizard validation, preset add/remove loops).
  - Evaluate Storybook and visual regression tooling once baseline unit coverage lands.

---

## 7. Chummer Data Processing - Deferred Items

During the migration of Chummer JSON data files into Go structs (`pkg/shadowrun/edition/v5/`), several complex structures and fields were deferred for later implementation. These items are documented here for future work.

### 7.1 Incomplete Data Files

- **`critters.json`**: The `DataCritters` map was intentionally left empty due to the extreme complexity of critter data structures. The structs are defined (`Critter`, `CritterPower`, `CritterSkill`, etc.) but the data map needs to be populated with proper handling of:
  - Complex `powers` field (can be strings, objects, or arrays)
  - Complex `skills` field (can be single or arrays)
  - Complex `bonus` structures with various nested types

### 7.2 Complex Bonus Structures (Set to `nil` or `interface{}`)

Many bonus fields across multiple data types are currently set to `nil` or use `interface{}` and need proper struct definitions:

#### Paragons (`paragons.go`)
- `ParagonBonus.SpecificSkill` - Can be single or list of skill bonuses
- `ParagonBonus.ActionDicePool` - Complex action dice pool structure
- `ParagonBonus.LivingPersona` - Complex living persona bonuses
- `ParagonBonus.WeaponSkillAccuracy` - Can be single or list

#### Powers (`powers.go`)
- `PowerBonus.SpecificSkill` - Can be single or list
- `PowerBonus.SpecificPower` - Can be single or list
- `PowerBonus.WeaponCategoryDV` - Complex weapon category DV structure
- Many other bonus types are set to `nil` with TODOs

#### Critter Powers (`critterpowers.go`)
- `CritterPowerDefinitionBonus.UnlockSkills` - Complex unlock skills structure

#### Echoes (`echoes.go`)
- `EchoBonus.LivingPersona` - Complex living persona bonuses
- `EchoBonus.SelectText` - Complex selectable text structure
- `EchoBonus.LimitModifier` - Complex limit modifier structure
- `EchoBonus.SpecificAttribute` - Complex specific attribute structure
- `EchoBonus.PenaltyFreeSustain` - Complex penalty-free sustain structure

#### Life Modules (`lifemodules.go`)
- `LifeModuleBonus.AttributeLevel` - Complex attribute level structure
- `LifeModuleBonus.SkillLevel` - Can be single or list
- `LifeModuleBonus.KnowledgeSkillLevel` - Can be single or list
- `LifeModuleBonus.AddQualities` - Complex add qualities structure
- `LifeModuleVersion.SkillLevel` - Can be single or list
- `LifeModuleVersion.KnowledgeSkillLevel` - Can be single or list
- `LifeModuleVersion.AttributeLevel` - Complex attribute level structure
- `LifeModuleVersion.AddQualities` - Complex add qualities structure

#### Drug Components (`drugcomponents.go`)
- `DrugComponentBonus.Attribute` - Can be single or list
- `DrugComponentBonus.Quality` - Complex quality structure
- `DrugComponentBonus.Limit` - Can be single or list
- `DrugComponentEffect.Attribute` - Can be single or list
- `DrugComponentEffect.Limit` - Can be single or list
- `DrugComponentEffect.Quality` - Complex quality structure
- `DrugComponentEffect.SpecificSkill` - Complex specific skill structure

#### Mentors (`mentors.go`)
- `MentorBonus.SpecificSkill` - Can be single or list
- `MentorBonus.SpecificPower` - Can be single or list
- `MentorBonus.AddQualities` - Complex add qualities structure

#### Packs (`packs.go`)
- `PackGear.Name` - Can be string or complex object with `+content` and `+@select` fields
- Various collection fields (`Gear`, `Armor`, `Accessory`, `Weapon`) can be single items or arrays

### 7.3 Complex Required Structures

Several `Required` fields are set to `nil` with TODOs:

#### Cyberware (`cyberware.go`)
- `Cyberware.Required` - Complex required structures (multiple instances have `Required: nil, // TODO: Handle complex required`)
- `CyberwareRequired.ParentDetails` - Complex parent details structure (set to empty string with TODO)

#### Weapons (`weapons.go`)
- `Weapon.Required` - Complex required structures (set to `nil` with TODOs in generation script)
- `WeaponAccessory.Required` - Complex required structures

#### Vehicles (`vehicles.go`)
- `VehicleModification.Required` - Complex required structures (set to `nil` with TODOs)

### 7.4 Formula-Based Fields

Some fields contain formulas that need evaluation logic:

#### Cyberware (`cyberware_data.go`)
- Rating fields with formulas like `"{STRMaximum}"` or `"{AGIMaximum}"` are set to `0` with TODOs
- Bonus values with formulas like `"Rating"` are set to `0` with TODOs (e.g., Impersonation, Intimidation bonuses)

### 7.5 Complex Nested Structures

#### Priorities (`priorities.go`)
- `PriorityTalent.SkillType` - Can be string or complex object
- `TalentForbidden.OneOf` - Complex one-of requirement structure (set to `nil` in some cases)
- `TalentQualities.Quality` - Set to `nil` in some cases, needs proper handling

#### Metamagic (`metamagic.go`)
- `MetamagicRequired.Group` - Can be complex structure
- `MetamagicRequiredOneOf.Group` - Can be complex structure
- `Metamagic.QuickeningMetamagic` - Can be null or complex structure

### 7.6 Single vs. Array Handling

Many fields can be either a single value or an array, currently handled with `interface{}`:
- Various `*Bonus` fields with `SpecificSkill`, `SpecificPower`, etc.
- Collection fields in packs, life modules, and other structures
- `Metavariants` in metatypes (handled but could be improved)

### 7.7 Action Type Handling

In `powers.go` and `critterpowers.go`, the `Action` field uses a workaround:
- `Action: &[]string{"Complex"}[0]` - This is a workaround for pointer string fields
- Should be refactored to use a proper helper function or constant

### 7.8 Priority Items for Implementation

1. **High Priority**:
   - Implement proper struct definitions for commonly used bonus types (SpecificSkill, SpecificPower, AddQualities)
   - Handle formula evaluation for rating and bonus fields
   - Populate `DataCritters` map with proper handling of complex structures

2. **Medium Priority**:
   - Refactor `interface{}` fields to use proper union types or discriminated unions
   - Implement proper handling of single vs. array fields
   - Complete `Required` structure implementations

3. **Low Priority**:
   - Refactor action type handling to use constants/helpers
   - Improve type safety across all bonus structures
   - Add validation logic for complex nested structures

---

## 8. Backlog / Future Considerations

- **User Settings & Profile**
  - Settings panel (themes, password, email notifications).
  - Character ownership transfer and invitations.

- **Campaign Enhancements**
  - Session attendance tracking and XP/karma allocation tooling.
  - Scene templates (combat/matrix/social) with quick-add NPCs.
  - **SR5 Character Model**: Complete `CharacterSR5` domain model implementation. See `docs/development/plans/sr5-character-model-plan.md` for detailed design. **Required before NPC library.**
  - **NPC Library**: Reusable NPC creation, management, and library system for GMs. See `docs/development/plans/npc-library-plan.md` for detailed design. **Depends on SR5 character model completion.**

- **Infrastructure**
  - CI pipeline for Go + React tests.
  - Packaging strategy for edition data updates (hot reload vs. build-time).
  - Plan API versioning/feature-flag strategy to guard future schema changes.
  - **Live Reload for Go API Server**: Implement automatic rebuild and restart of the Go server on file changes. Consider using [Air](https://github.com/cosmtrek/air) or similar tool. Should work cross-platform (Windows, Linux, macOS). Frontend already has live reload via Vite HMR.
- **Testing & QA**
  - Investigate Playwright/Cypress smoke tests for React flows (campaign creation, character wizard) to supplement Vitest coverage.

---

## 9. Maintenance Notes

- Treat this file as the single roadmap of record. When milestones complete, check them off here and optionally prune detailed breakdowns from legacy docs.
- Keep status indicators aligned with TODO tracking or issue tracker milestones.
- Contributors should append dated updates when scope shifts or new priorities surface.


