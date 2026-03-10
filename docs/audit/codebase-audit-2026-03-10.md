# ShadowMaster Codebase Audit — Raw Findings

**Date:** 2026-03-10
**Scope:** Full codebase exploration — code only, no planning documents referenced
**Method:** Systematic directory traversal, file reading, pattern searching

---

## 1. What Exists

### Project Identity

- **Name:** Shadow Master
- **Version:** 0.1.0 (MVP phase)
- **Stack:** Next.js 16.1.6, React 19.2.4, TypeScript 5 (strict), Tailwind CSS 4, file-based JSON storage
- **Package manager:** pnpm 10.26.1
- **Runtime:** Node 22 (Docker), Node 20 (CI)
- **Edition focus:** Shadowrun 5th Edition only (SR5)

### Directory Map

```
/app                          # Next.js App Router — 31 pages, 90+ API endpoints, 5 layouts
├── api/                      # REST API (~90 route handlers)
│   ├── auth/                 # 10 auth endpoints (signin, signup, signout, magic-link, forgot/reset password, verify-email)
│   ├── characters/           # ~50 endpoints (CRUD, advancement, contacts, augmentations, combat, inventory, matrix, rigging, magic, modifiers, loadouts, sync)
│   ├── campaigns/            # ~30 endpoints (CRUD, sessions, notes, posts, locations, grunt-teams, advancements, player management)
│   ├── account/              # 5 endpoints (preferences, password, export, import, delete)
│   ├── admin/                # Migration utilities
│   ├── audit/                # Audit log access
│   ├── combat/               # Quick-start, session management
│   └── grunt-teams/          # Standalone grunt team management
├── characters/               # Character pages (list, create/sheet, [id] view, edit, advancement, contacts)
├── campaigns/                # Campaign pages (list, create, discover, [id] hub with locations/grunt-teams/settings)
├── rulesets/                 # Edition browser (server component)
├── settings/                 # User settings (account, security, preferences, communications, data, privacy)
├── signin/, signup/, forgot-password/, reset-password/  # Auth pages
├── users/                    # Admin-only user management
├── layout.tsx                # Root layout with fonts, theme, Providers
├── providers.tsx             # ThemeProvider → I18nProvider → AuthProvider → SidebarProvider
└── page.tsx                  # Dual-mode home (marketing landing vs. authenticated dashboard)

/lib                          # Business logic — 247 source files
├── types/                    # 29 type definition files — all domain entities strongly typed
├── storage/                  # 22 modules — file-based JSON persistence with atomic writes
│   └── base.ts              # Core I/O: readJsonFile, writeJsonFile (atomic), ensureDirectory, etc.
├── rules/                    # 41 modules — game mechanics engine
│   ├── loader.ts + merge.ts # Edition → Book → RuleModule → MergedRuleset with merge strategies
│   ├── RulesetContext.tsx    # 40+ hooks for ruleset data access
│   ├── character/            # State machine (draft → active → retired/deceased)
│   ├── advancement/          # 13 files: karma costs, training, attributes, skills, edge, magic, approval, ledger
│   ├── action-resolution/    # 6 files: dice engine, pool builder, action executor, edge actions
│   ├── augmentations/        # 9 files: essence, cyberlimb, grades, management, validation
│   ├── magic/                # 7 files: spells, traditions, complex forms, drain, essence-magic link
│   ├── matrix/               # 9 files: cyberdecks, programs, marks, overwatch, dice pools
│   ├── rigging/              # 10 files: VCR, RCC, drones, noise, biofeedback, jump-in
│   ├── gear/                 # Weapon customization, validation
│   ├── inventory/            # State management, loadouts, concealment, containers
│   ├── skills/               # Free skills, group utilities
│   ├── qualities/            # Effects, advancement, dynamic state
│   ├── validation/           # Character, budget, constraint validation
│   ├── sync/                 # Ruleset versioning, drift detection, migration
│   ├── effects/              # Unified effect resolution
│   ├── modifiers/            # Duration, templates, validation
│   ├── encumbrance/          # Weight and encumbrance penalties
│   └── wireless/             # Wireless bonus calculation
├── auth/                     # 10 files: session, password, magic-link, email verification, authorization
├── combat/                   # 5 files: CombatSessionContext, readiness hooks
├── contexts/                 # CreationBudgetContext, RuleReferenceContext, SidebarContext
├── security/                 # Rate limiter, audit logger
├── email/                    # 17 files: service, config, 4 transports (SMTP, Resend, file, mock), templates
├── logging/                  # 7 files: pino logger, middleware, child loggers, sanitization
├── matrix/                   # MatrixSessionContext
├── rigging/                  # RiggingSessionContext
├── migrations/               # Data migration utilities
├── constants/                # Game constants (attributes, magic)
├── env/                      # Environment detection, build metadata
├── themes.ts                 # Theme system (neon-rain, modern-card)
└── utils.ts                  # cn() classnames utility, JSON download

/components                   # UI layer — 248 .tsx files
├── creation/                 # 117+ files in 19 subdirectories — sheet-based character creation
│   ├── shared/               # 15 files: BaseCard, CreationCard, BudgetIndicator, KarmaConversion, Stepper, Validation
│   ├── metatype/             # MetatypeCard + MetatypeModal
│   ├── attributes/           # Attribute cards
│   ├── skills/               # 13 files: SkillsCard, specializations, group breaking
│   ├── qualities/            # Quality selection
│   ├── magic-path/           # Magic path selection
│   ├── spells/               # Spell selection
│   ├── adept-powers/         # Adept power selection
│   ├── augmentations/        # 9 files: augmentation + cyberlimb + enhancement selection
│   ├── gear/                 # General equipment with mods
│   ├── weapons/              # Weapon selection + mods + ammo
│   ├── armor/                # Armor selection + mods
│   ├── vehicles/             # 8 files: vehicles, drones, RCCs, autosofts
│   ├── contacts/             # Contact network
│   ├── identities/           # 6 files: SINs, licenses, lifestyles
│   ├── knowledge-languages/  # 5 files: knowledge skills, languages
│   ├── matrix-gear/          # 5 files: cyberdecks, programs
│   ├── foci/                 # Focus selection
│   └── drugs-toxins/         # Drug/toxin selection
├── character/sheet/          # 49+ display components — read-only character sheet
│   ├── DisplayCard.tsx       # Thin wrapper around BaseCard (no validation)
│   ├── AttributesDisplay, SkillsDisplay, QualitiesDisplay, ArmorDisplay, WeaponsDisplay, GearDisplay
│   ├── MatrixSummaryDisplay, MatrixDevicesDisplay, MatrixMarksDisplay, CyberdeckConfigDisplay, ProgramManagerDisplay
│   ├── RiggingSummaryDisplay, DroneNetworkDisplay, JumpInControlDisplay, AutosoftManagerDisplay
│   ├── SpellsDisplay, AdeptPowersDisplay, ComplexFormsDisplay, FociDisplay, MagicSummaryDisplay
│   ├── ContactsDisplay, IdentitiesDisplay, LifestylesDisplay, DrugsDisplay
│   ├── LoadoutDisplay, EncumbranceDisplay, WirelessDisplay, ConditionDisplay
│   ├── DerivedStatsDisplay, CharacterInfoDisplay, CombatDisplay, ActiveModifiersPanel, EffectsSummaryDisplay
│   └── 37 test files
├── combat/                   # CombatTracker, ActionSelector, ConditionMonitor, OpposedTestResolver
├── action-resolution/        # ActionPoolBuilder, EdgeActionSelector, EdgeTracker, ActionHistory
├── cyberlimbs/               # 6 files: CyberlimbList, Card, InstallModal, DetailPanel, Enhancement/Accessory modals
├── rule-reference/           # 7 files: command palette, search, table, list, card, category tabs, trigger
├── sync/                     # StabilityShield, MigrationWizard
├── auth/                     # EmailVerificationBanner
├── ui/                       # BaseModal, Tooltip (React Aria)
├── DiceRoller.tsx            # Dice pool rolling with hit/glitch
├── EssenceDisplay.tsx        # Essence visualization
├── AugmentationCard.tsx      # Augmentation display (grades, wireless, enhancements)
├── NotificationBell.tsx      # Campaign notification dropdown
└── EnvironmentBadge.tsx      # Environment indicator

/data                         # Static and runtime data
├── editions/sr5/             # The only edition implemented
│   ├── edition.json          # Edition metadata (id: "sr5", version 1.0.0)
│   ├── core-rulebook.json    # 24,421 lines — complete rules payload
│   ├── core-errata-2014-02-09.json  # Errata patch
│   ├── rule-reference.json   # Quick reference tables
│   ├── archetypes/           # 7 templates (adept, combat-mage, decker, face, rigger, street-samurai, technomancer)
│   ├── grunt-templates/      # 7 NPC tiers (PR0 street-rabble through PR6 dragon-guard)
│   ├── sample-contacts/      # 8 contacts (fixer, street-doc, beat-cop, etc.)
│   └── example-characters/   # 16 full character builds + README
├── characters/               # 1 user, 1 character (Whisper, elf adept, active)
├── combat/                   # 9 completed combat sessions (test data)
├── campaigns/                # Directory does not exist
├── migrations/               # 2 TypeScript migration scripts (gear weights)
├── emails/                   # Empty (.gitkeep only)
├── notifications/            # Empty (.gitkeep only)
└── violations/               # 52 test violation records (dated 2025-12-24)

/__tests__                    # 413 Vitest test files
├── lib/                      # 151 library/business logic tests
├── app/                      # 162 API route tests
├── components/               # 60 component tests
├── data/                     # 1 data validation test
├── mocks/                    # Test mock utilities
├── setup.ts                  # Mock Next.js modules, jest-dom
└── test-utils.tsx            # Custom render with providers

/e2e                          # 5 Playwright E2E tests
├── auth.spec.ts              # Auth flows
├── character-approval.spec.ts # Campaign character approval
├── lifestyles-display.spec.ts # Lifestyle system
├── rigging-system.spec.ts    # Rigging mechanics
└── magic-resonance-reduction.spec.ts # Magic/resonance

/docs                         # 262 documentation files
├── architecture/             # 28 files (system design, component hierarchies, creation flow)
├── specifications/           # 22 feature specs
├── capabilities/             # 53 feature capability docs
├── data_tables/              # 159 game reference tables
├── rules/5e/                 # SR5-specific rules docs
├── reviews/, patterns/, decisions/, deployment/, personas/, plans/, prompts/

/scripts                      # CLI utilities
├── verify-data.ts, verify-naming-conventions.ts, validate-claude-md.ts
├── validate-creation-docs.ts, validate-example-characters.ts
├── seed-data.ts, health-check.ts, backup.ts, user-admin.ts
├── check-test-coverage.ts, generate-component-diagrams.ts
└── audit/                    # Audit scripts

/.github/workflows            # CI/CD
├── ci.yml                    # Lint + Unit test + Build (Node 20, pnpm cache)
├── cd.yml                    # Continuous deployment
├── codeql.yml                # Security analysis
└── docker-build.yml          # Docker image building

Configuration files:
├── next.config.ts            # Standalone output, Sentry, Turbopack, build metadata
├── vitest.config.ts          # jsdom, 5s timeout, v8 coverage (30% thresholds)
├── playwright.config.ts      # Single worker (file-based storage), 3 browsers, retries on CI
├── knip.config.ts            # Dead code detection
├── eslint.config.mjs         # Next.js + TypeScript rules
├── Dockerfile                # Multi-stage, non-root (nextjs:1001), alpine, health check
├── docker-compose.yml        # App + Mailpit (dev)
├── docker-compose.portainer.yml # Caddy + App + Watchtower (production)
└── .mcp.json                 # 10 MCP server configs
```

---

## 2. Feature Area Status

### Character Creation — WORKING
- Sheet-based single-page creation with all sections visible
- SR5 Priority system fully implemented
- 19 creation card categories covering: metatype, attributes, skills, qualities, magic, augmentations, gear, weapons, armor, vehicles, contacts, identities, knowledge/languages, matrix gear, foci, drugs/toxins, adept powers, spells
- Budget tracking via `CreationBudgetContext` with karma, nuyen, attribute points, skill points
- localStorage draft backup with 24-hour expiry
- Auto-save with debounce and abort controller race-condition protection
- Finalization with server-side validation
- Campaign-aware creation (inherits editionCode, gameplayLevel)
- Archetype quick-start templates (7 archetypes)

### Character Sheet — WORKING
- 49+ display components for read-only character viewing
- Covers all subsystems: attributes, skills, qualities, augmentations, weapons, armor, gear, vehicles, matrix, rigging, magic, contacts, identities, conditions, modifiers, effects, loadouts, encumbrance, wireless
- DiceRoller integration for action resolution
- Action panel and combat tracker modal on character page
- QuickNPC panel for GM use

### Character Advancement — WORKING
- Karma spending for attributes, skills, specializations, edge, magic
- Training time calculations (with some unimplemented paths — see below)
- GM approval workflow for campaign characters
- Training interruption and resumption
- Downtime integration for campaigns
- Advancement ledger and history

### Campaign Management — WORKING
- CRUD operations with join codes
- Public campaign discovery
- Tabbed hub: Overview, Characters, Notes, Roster, Posts, Calendar, Locations, Advancements, Approvals, Grunt Teams
- Session management with karma/nuyen awards and edge refresh
- Location system with templates, import/export, and connections
- Grunt/NPC teams with PR0-PR6 templates
- Player management and character approval gates
- Campaign activity feed and event timeline
- Campaign templates and validation

### Authentication & Security — WORKING
- Two auth methods: email/password and magic link
- Password reset via email token
- Email verification flow
- Session-based auth: 256-bit cryptographic secrets, SHA-256 hashed, httpOnly cookies, sameSite: lax
- Account lockout after failed attempts (15 min)
- Rate limiting on all auth endpoints (in-memory)
- bcrypt (12 rounds) for passwords, timing-safe comparison
- Role-based authorization (admin, gm, owner, system)
- Audit logging for security events
- User enumeration prevention on all sensitive endpoints

### Combat System — PARTIAL
- `CombatSessionContext` provides session state, participants, turn tracking
- CombatTracker UI built (initiative, actions, conditions)
- ActionSelector for action point allocation
- OpposedTestResolver for dice-vs-dice
- QuickCombatControls on character page
- 9 completed test combat sessions in data
- **Missing:** Initiative dice from cyberware/powers not integrated, campaign membership check for multiplayer not implemented

### Action Resolution — WORKING
- Dice engine with critical hit calculation
- Pool builder with modifier stacking
- Action executor for outcome resolution
- Edge action spending mechanics
- React hooks for UI integration
- Action history tracking

### Matrix Operations — BACKEND COMPLETE, UI PARTIAL
- Cyberdeck validation, program installation limits
- Matrix dice pool calculator
- Action validator and action mapper
- Mark tracking with escalation
- Overwatch scoring and session tracking
- `MatrixSessionContext` for session awareness
- Character sheet displays: MatrixSummary, Devices, Marks, Actions, CyberdeckConfig, ProgramManager
- **Missing per PROJECT_STATE.md:** Dedicated Matrix UI page/integration (#88)

### Rigging System — BACKEND COMPLETE, UI PARTIAL
- VCR and RCC validation
- Drone network and slave limits
- Drone condition tracking
- Jump-in initiative and modifiers
- Noise calculator (signal/distance)
- Biofeedback/dumpshock handler
- Vehicle dice pool calculator and action validator
- `RiggingSessionContext` for session awareness
- Character sheet displays: RiggingSummary, DroneNetwork, JumpInControl, AutosoftManager, VehicleActions
- **Missing per PROJECT_STATE.md:** Dedicated Rigging UI page/integration (#89)

### Augmentations — BACKEND COMPLETE, UI PARTIAL
- Essence tracking and loss calculation
- Cyberlimb system with capacity and enhancements
- Grade system (standard/alpha/beta/delta)
- Add/remove augmentation management
- Essence hole modeling
- Cyberlimb React hooks
- Validation for legality and installation
- Character sheet: AugmentationsDisplay, CyberlimbList, CyberlimbCard, Install/Enhancement/Accessory modals
- **Missing per PROJECT_STATE.md:** Full integration into character page (#91)

### Magic System — BACKEND COMPLETE, UI PARTIAL
- Spell validation with prerequisites
- Tradition and spirit type validation
- Complex form validation (technomancer)
- Drain calculation and application
- Essence-magic link rules
- Character sheet: SpellsDisplay, AdeptPowersDisplay, ComplexFormsDisplay, FociDisplay, MagicSummaryDisplay
- **Missing per PROJECT_STATE.md:** Full integration (#92)

### Contact Network — WORKING
- Contact management with loyalty/connection ratings
- Favor economy and favor ledger
- Social capital metrics
- Social action resolution (networking)
- Contact state management
- Sample contact templates (8)

### Inventory & Loadouts — WORKING
- Equipment readiness states
- Wireless toggles and bonus calculation
- Container system
- Loadout templates with apply/diff
- Encumbrance calculator
- Gear location tracking
- Concealment rules

### Qualities System — WORKING
- Positive and negative quality selection
- Quality effects and advancement
- Dynamic state management
- Gameplay integration (withdrawal, allergy)

### Ruleset System — WORKING
- Edition → Book → RuleModule → MergedRuleset pipeline
- Merge strategies: replace, merge, append, remove
- Deep merge with ID-based array merging
- 40+ React hooks for data access
- Errata support (core-errata-2014-02-09)
- Rule reference with command palette search

### Sync & Migration — WORKING
- Ruleset versioning with drift detection
- Character sync endpoints (GET/PUT)
- Migration engine for edition changes
- Shield/protect mechanism
- StabilityShield indicator and MigrationWizard UI

### Email System — WORKING
- 4 transports: SMTP (Mailpit dev), Resend (production), file (fallback), mock (testing)
- Templates: verification, password reset, magic link, security alerts
- Security alerts: lockout, password change, email change
- Admin notifications: new user, lockout
- Email preferences

### Admin Features — WORKING
- User management dashboard (admin-only)
- Character state transitions (admin)
- Audit log access
- Data migration endpoints

### Settings — WORKING
- Account profile management
- Password change
- Theme preferences
- Communications preferences
- Data export/import
- Account deletion (with password confirmation)

---

## 3. What Stands Out as Risky, Incomplete, or Unclear

### Explicit Code Gaps (TODOs that throw errors)

1. **Training time calculations** — 4 functions in `lib/rules/advancement/training.ts` (lines 225-241) throw `Error("...not yet implemented")` for:
   - Spell/ritual training time
   - Complex form training time
   - Focus bonding training time
   - Initiation training time

   These will crash at runtime if a user attempts these advancement paths.

2. **Drain calculation stubs** — `lib/rules/magic/drain-calculator.ts`:
   - Line 310: Ritual drain returns hardcoded `"F"` instead of looking up ruleset
   - Line 322: Mentor spirit bonuses/penalties not implemented

3. **Condition monitor state** — `lib/rules/magic/drain-application.ts:197`: Hardcoded to 0 instead of reading character's current condition monitor

4. **Cyberlimb racial maximums** — `lib/rules/augmentations/cyberlimb.ts:254`: Uses hardcoded defaults instead of metatype data

5. **Weapon modification capacity** — `lib/rules/gear/weapon-customization.ts:409`: Capacity calculation hardcoded to 0

### Security Concerns

6. **Sentry DSN hardcoded in source** — Three files (`instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`) contain the full Sentry DSN string. While DSNs aren't secret per Sentry docs, this allows anyone to submit fake error events to the project. Should be an environment variable.

7. **`sendDefaultPii: true`** in all three Sentry configs — Sends user PII (emails, IPs, session data) to Sentry's third-party servers. This is a privacy/compliance concern.

8. **`tracesSampleRate: 1`** in production — 100% of all requests are traced. This is a performance and cost concern for production load.

9. **No Next.js middleware.ts** — There is no root-level middleware for centralized auth checks, security headers, or request logging. Auth is enforced per-route via `getSession()` calls, which means every new route must remember to add it.

10. **Missing security headers in Next.js config** — No CSP, X-Frame-Options, X-Content-Type-Options, or HSTS defined at the Next.js level. These ARE configured at the Caddy reverse proxy layer in production (`docker-compose.portainer.yml`), but the app itself has none — meaning local/Docker dev environments have no security headers.

11. **In-memory rate limiter** — `lib/security/rate-limit.ts` stores state in process memory. This works for single-server deployments but would fail in multi-instance/replicated environments. Currently acceptable since the app runs single-instance.

12. **`console.error` in auth routes** — Multiple API routes use `console.error` instead of the project's structured pino logging system. Auth errors could leak into unstructured logs.

### CI/CD Gaps

13. **CI pipeline missing quality gates** — `.github/workflows/ci.yml` only runs lint + test + build. Missing:
    - `pnpm type-check` (TypeScript verification)
    - `pnpm knip` (dead code detection)
    - E2E tests
    - Format checking

    Despite `CLAUDE.md` listing `pnpm check` as the combined command and the pre-commit hooks running type-check.

### Multiplayer/Combat Gaps

14. **Combat session lacks campaign membership check** — `app/api/combat/[sessionId]/route.ts:59`: Only checks ownership, not campaign membership. Multiplayer combat would allow unauthorized access.

15. **Initiative dice from cyberware/powers not integrated** — Both `app/api/combat/quick-start/route.ts:140` and `app/characters/[id]/components/QuickCombatControls.tsx:51` note this as TODO. Initiative calculations are incomplete for augmented characters.

### Data State

16. **Only SR5 edition exists** — The system supports multiple editions architecturally, but only `data/editions/sr5/` is populated. No SR1-4, SR6, or Anarchy data exists.

17. **Campaigns directory doesn't exist** — `data/campaigns/` is missing entirely, meaning no campaign has ever been created in this installation. Campaign features are untested with real data.

18. **Sparse runtime data** — Only 1 character, 9 combat sessions (test data), empty emails and notifications directories. The violation log contains test data from December 2025.

19. **PROJECT_STATE.md is stale** — Last updated 2026-01-10 (2 months ago). May not reflect current feature state.

### Quality-of-Life Gaps

20. **No root-level error.tsx or not-found.tsx** — Next.js App Router supports these for global error/404 handling. Their absence means unhandled errors may show raw Next.js error pages.

21. **Grunt activity logging deferred** — Three locations (`app/api/campaigns/[id]/grunt-teams/route.ts:157`, `app/api/grunt-teams/[teamId]/route.ts:159,208`) await `CampaignActivityType` support for grunt operations.

22. **Location template filtering incomplete** — `app/campaigns/[id]/locations/templates/page.tsx:43`: Client-side filtering for templates needs refinement.

23. **Quality gameplay integration deprecated** — `lib/rules/qualities/gameplay-integration.ts:94`: Imperative withdrawal/allergy penalties marked deprecated, awaiting unified effect pipeline (Issue #485).

---

## 4. Questions the Code Raises

### Architecture Questions

1. **Why file-based storage instead of a database?** The entire persistence layer uses JSON files in `/data`. This limits concurrent access (Playwright uses single worker), prevents efficient queries, and makes backup/migration manual. Is this intentional for the target deployment (single user/small group), or is a database migration planned?

2. **What's the actual deployment model?** The Portainer compose suggests a single-server deployment with Caddy. Is this always single-instance? The in-memory rate limiter and file-based storage both assume single-process.

3. **What happened to the other editions?** The type system and loader support multiple editions, but only SR5 exists. Is this abandoned scope or future work? The edition.json references `bookIds` and `creationMethodIds` suggesting the architecture was designed for expansion.

4. **Why no Next.js middleware.ts?** Auth is enforced per-route. Was this a deliberate choice to avoid middleware complexity, or an oversight? Every new API route must independently remember to call `getSession()`.

### Feature Questions

5. **What's the status of Issues #88-92?** PROJECT_STATE.md references these issues for Matrix, Rigging, Combat, Augmentations, and Magic UI integration. Are these still the current blockers?

6. **Is character creation actually tested end-to-end?** There's no E2E test for the character creation flow. The 5 E2E tests cover auth, approval, lifestyles, rigging display, and magic — but not the core creation sheet. How is this validated?

7. **What's the intended user count?** File-based storage with single-worker E2E suggests this is for small groups. But campaign features (public discovery, join codes, player management) suggest a multi-tenant platform. Which is it?

8. **Are the 9 combat sessions in `/data/combat/` real or test artifacts?** They all appear to be completed sessions. Were these from manual testing or from actual play?

9. **Why are some features "backend complete, UI partial"?** Matrix, Rigging, Augmentations, and Magic all have full backend logic and sheet display components, but are listed as needing "UI integration." What specific UI is missing — dedicated pages, modal workflows, or something else?

### Security Questions

10. **Is the Sentry DSN intended to be public?** It's hardcoded in client-side code (`instrumentation-client.ts`). Sentry DSNs in client bundles are technically public, but should the server-side DSN also be hardcoded?

11. **What's the compliance posture for PII?** `sendDefaultPii: true` sends user data to Sentry. Is there a privacy policy? Is this GDPR-relevant?

12. **Are the security headers in Caddy sufficient?** The Caddyfile in `docker-compose.portainer.yml` sets HSTS, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy. But there's no Content-Security-Policy (CSP). Is this intentional?

### Code Quality Questions

13. **What's the actual test pass rate?** 413 unit tests exist, but the coverage thresholds are set to 30% (lines/functions/statements) and 25% (branches). These are described as "initial/permissive." What's the actual coverage?

14. **Why do E2E tests skip WebKit?** Three of five E2E tests skip WebKit with "WebKit not installed." Is Safari/WebKit support a goal?

15. **What's the relationship between `/lib/combat/` and `/lib/rules/combat/` and `/lib/rules/action-resolution/`?** Combat logic is spread across three directories. Is this intentional separation (session state vs. rules vs. resolution), or organic growth?

16. **Is the `core-rulebook.json.backup` file intentional?** There's a 388KB backup of the 832KB core-rulebook in the same directory. Is this versioned? Manual? Should it be in `.gitignore`?

17. **Why are data migrations TypeScript files in `/data/migrations/` instead of in `/lib/migrations/`?** Both directories exist. The `/data/` ones are large (20KB, 8KB) and seem to be one-off scripts. The `/lib/` ones seem to be the migration framework. Is there a convention?

---

*End of raw findings. No recommendations or categorization applied — these are observations only.*
