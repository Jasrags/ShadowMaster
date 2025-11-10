# ShadowMaster Application Architecture Plan

## 1. Concept Overview

### 1.1 Core Domain Concepts
- **Users**  
  - Authenticated actors that sign in via email/password.  
  - Carry RBAC roles (`administrator`, `gamemaster`, `player`).  
  - May control multiple Player Characters (PCs); Gamemasters administer NPCs and campaign assets.

- **Characters**  
  - **Player Characters (PCs):**  
    - Owned by a single `User`.  
    - Belong to exactly one `Campaign`.  
    - Created using the campaign’s character-creation method and inherit the campaign’s edition ruleset.  
  - **Non-Player Characters (NPCs):**  
    - Not linked to a `User`; managed by the Gamemaster.  
    - Associated with a `Campaign` and optionally attached to specific `Sessions`/`Scenes` for encounter planning.  
    - Support both reusable cast members and per-session adversaries.

- **Campaigns**  
  - Narrative containers that group PCs, NPCs, sessions, and scene prep.  
  - Persist the chosen **edition** (`sr3`, `sr5`, etc.) and **character creation method** (e.g., SR5 Priority, Sum-to-Ten, Karma).  
  - For SR5, store **gameplay level** (Street, Experienced, Prime) to adjust resource/karma allowances.  
  - **Immutable setup rule:** edition and character creation method must be selected during campaign creation and cannot be changed afterward.

- **Sessions**  
  - Represent a single play meeting within a campaign.  
  - Track scheduling info, objectives, linked scenes, and recap notes.  
  - Provide hooks for attendance tracking and post-session adjustments (karma, nuyen).

- **Scenes**  
  - Focused encounters nested under sessions.  
  - Store scene type (combat, social, matrix, etc.), description, initiative data, and participating characters.  
  - Support quick status updates (planned, active, completed) to coordinate live play.

### 1.2 Relationships & Flow
- **User → Character:**  
  - One-to-many. Only PCs carry a `user_id`; NPCs leave it empty.  
  - Enables per-player dashboards and permissions while keeping NPC tooling GM-centric.

- **Campaign → Character / Session:**  
  - One-to-many in both cases. Campaign metadata determines edition-specific logic and validation.  
  - PC rosters, session calendars, and prep assets all anchor to the chosen campaign.

- **Session → Scene:**  
  - Sessions aggregate multiple scenes, allowing structured agendas and post-session summaries.  
  - Scenes reference session IDs for chronological ordering.

- **Scene ↔ Character:**  
  - Scenes track participating PCs/NPCs for initiative, roleplay prompts, and mechanical effects.  
  - Characters can appear in multiple scenes within the same session.

- **Edition & Creation Method Propagation:**  
  - Campaigns expose edition/configuration to both backend services and frontend UI via the edition context.  
  - Character creation flows consult the campaign to determine allowable rules (e.g., SR3 priority tiers vs. SR5 gameplay levels).  
  - Immutable campaign setup guarantees that all roster changes remain internally consistent over time.

### 1.3 Cross-Edition Considerations
- Edition-specific data (priority tables, attribute caps, magic traditions) lives in JSON modules under `data/editions/{edition}`.  
- Campaigns select the module; characters and sessions resolve rules via that context.  
- Future editions can plug in by supplying new JSON + UI bindings without altering core relationships.

---

## 2. Current Coverage Assessment

### 2.1 Backend (Go)
- **Domain Models**  
  - `internal/domain/character.go` holds SR3-centric fields but lacks `user_id`, campaign linkage, and NPC/PC differentiation.  
  - `internal/domain/campaign.go` supplies `Campaign`, `Session`, and `Scene` structs, yet campaigns only persist `Edition` and `Status`; they do **not** track gameplay level or character-creation method.  
  - `internal/domain/user.go` models authentication roles but there is no association to characters or campaigns.
- **Repositories**  
  - JSON repositories exist for characters, campaigns, sessions, scenes, groups, and users.  
  - No repository-yet for linking characters to campaigns/users (e.g., join tables or indexes). Index.json lacks cross-entity maps (character→campaign, character→user).  
  - Edition repository exposes character-creation JSON per edition.
- **Services**  
  - `CharacterService` focuses on SR3 priority logic; no equivalent services for campaigns, sessions, scenes, or cross-edition creation methods.  
  - `UserService` handles auth but does not provision campaign roles or linkages.  
  - Missing orchestration layers for campaign configuration (fixing edition + creation method) and for session/scene lifecycle.
- **API Layer**  
  - REST handlers exist for CRUD on characters/campaigns/sessions/scenes, but they work with legacy schemas.  
  - No endpoints enforce immutable campaign setup or expose gameplay level / creation methods.  
  - RBAC middleware is present but not yet applied to campaign/session routes.

### 2.2 Frontend
- **React Shell Migration**  
  - Characters: Priority, Metatype, and Magical Abilities steps run via React portals; attributes and later steps remain legacy.  
  - Campaigns/Sessions: Entirely legacy HTML/JS; React has not been introduced.  
  - Auth: React panel implemented for registration/login/logout.
- **Navigation & State**  
  - New React-powered tab navigation controls `#characters`, `#campaigns`, `#sessions`, but campaigns/sessions content still relies on legacy rendering.  
  - `EditionContext` feeds SR3/SR5 JSON to wizard components but campaigns do not yet load edition data.
- **UX Gaps**  
  - No campaign creation wizard to capture immutable edition + method choices.  
  - Sessions/scenes lack modern UI for linking characters or managing lifecycle.

### 2.3 Data & Rules
- SR3 and SR5 priority/generation data live under `data/editions/{edition}/character_creation.json`.  
- No structured storage for SR5 gameplay levels, alternative creation methods (Sum-to-Ten, Karma), or derived campaign defaults.  
- Lifestyle, gear, skills documentation exists in `/docs/5e`, but backend ingestion has not been wired.

### 2.4 Documentation Footprint
- Auth roadmap (`docs/auth-roadmap.md`) and multi-edition plan exist.  
- No consolidated architecture overview prior to this document; campaign/session/scenes guidance is scattered in edition docs and legacy notes.

## 3. Target Architecture Decisions

### 3.1 Backend
- **Domain Model Enhancements**  
  - Add `UserID`, `CampaignID`, and `IsNPC` fields to characters.  
  - Extend campaigns with `CreationMethod`, `GameplayLevel` (SR5), `HouseRules`, and timestamps for immutable setup metadata.  
  - Introduce lightweight join indexes (e.g., campaign→character IDs, user→character IDs) to `index.json`.
- **Repository & Service Layers**  
  - Provide dedicated services for campaigns, sessions, and scenes to encapsulate validation (immutable edition/method), role checks, and business rules (e.g., gameplay level defaults).  
  - Character service becomes edition-aware, deferring to campaign config for creation logic.  
  - Session/scene services manage participant lists, initiative snapshots, and status transitions.
- **RBAC Integration**  
  - Reuse session manager middleware with `RequireRole` guardrails.  
  - Apply route-level RBAC: campaign/session mutation requires `gamemaster` or `administrator`, character creation requires owning user, etc.  
  - Provide service helpers to evaluate permissions based on campaign membership and roles.
- **Edition Module Strategy**  
  - Keep edition data in JSON modules but expose typed Go facades for validation (priority tables, gameplay levels, etc.).  
  - Support hot-loading of edition data via repository interface so new editions can be deployed without code churn.

### 3.2 Frontend
- **React-First UI**  
  - Continue migrating major flows (campaign setup, session/scene management, character sheets) into React, leveraging portals until full SPA transition.  
  - Centralize edition context to share campaign-level configuration with character and session tooling.  
  - Implement React-driven forms that respect immutable campaign choices and surface RBAC state (e.g., disable GM-only actions).
- **State Synchronization**  
  - Maintain legacy bridge for incremental migration but favor React state as source of truth; legacy DOM will subscribe to global events until retired.  
  - Use fetch utilities with credentialed requests to hit new campaign/session endpoints.

### 3.3 Data & Documentation
- Establish canonical definitions for creation methods and gameplay levels in `/data/editions`.  
- Document RBAC matrix (role × action) alongside API reference.  
- Keep architecture plan and edition docs in sync to avoid divergent rules.

## 4. Implementation Roadmap

### Phase 1 – Data & Domain Alignment
- Extend domain structs (character, campaign) with user/campaign linkage, creation method, gameplay level.  
- Migrate JSON repositories & indexes to persist new fields; add backfill routine/migration script.  
- Author Go service validation for immutable campaign setup and character ownership.

### Phase 2 – API & RBAC Hardening
- Introduce campaign/session/scene service layers and expose REST endpoints for create/update/delete with role checks. *(Completed)*  
- Apply `RequireRole` middleware and fine-grained authorization helpers. *(Completed)*  
- Return edition + creation method metadata from campaign endpoints to drive frontend. *(Completed)*

### Phase 3 – Edition & Creation Method Support
- Model SR5 gameplay levels and alternative creation methods in `data/editions`.  
- Wire campaign creation UI/API to enforce allowed combinations; ensure characters created afterward respect campaign defaults. *(In progress)*  
- Surface campaign gameplay overrides (priority resources, karma limits) to character creation UI/legacy bridge. *(Completed)*  
- Add validation harnesses/unit tests for creation pipelines across SR3/SR5.

### Phase 4 – Frontend Migration
- Build React campaign management UI (wizard, list, actions) with reusable primitives:
  - Campaign creation wizard (name, edition, gameplay level, creation method, GM selector, optional group picker)
  - Shared table component (sortable columns, filters, action column) for campaigns/sessions/scenes
- Implement session and scene management panels with participant linking and initiative helpers.  
- Retire equivalent legacy DOM paths, leaving React as the authoritative UI.

### Phase 5 – Quality & Documentation
- Expand automated tests: service unit tests, API smoke tests, frontend smoke/e2e paths for campaign flows.  
- Update README, auth roadmap, and edition docs to reflect new architecture and RBAC controls.  
- Capture migration checklist for existing data (e.g., how to set creation method on legacy campaigns).

## 5. Deliverables & Next Steps

### Immediate Deliverables
- Updated domain & repository schemas aligning with immutable campaign configuration.  
- Campaign/session/scene service layers with RBAC-enforced REST endpoints.  
- React campaign creation wizard plus session/scene management UI.  
- Extended edition data (SR5 gameplay levels, additional creation methods) + validation tests.  
- Documentation refresh (README, auth roadmap, edition guides) and migration notes.

### Near-Term Next Steps
1. Draft detailed technical design for domain/repository migrations (include data backfill strategy).  
2. Prototype campaign creation API + React form, validating immutable edition/method rule.  
3. Layer RBAC checks onto existing campaign/session routes and add regression tests.  
4. Schedule follow-up review once Phase 2 (API & RBAC hardening) milestones are complete.

### Tracking
- Progress for each phase will be tracked via project TODOs and linked PRs.  
- This document should be updated when major milestones close or when scope changes (e.g., introducing SR4).

