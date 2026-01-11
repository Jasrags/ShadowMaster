---
name: Draft Resume UX Plan
overview: Implement resume-able draft characters with server-synced creation state and dedicated resume entry via query route.
todos:
  - id: list-ux
    content: Enhance characters list cards for drafts
    status: pending
  - id: resume-route
    content: Add resume query handling for create page
    status: pending
  - id: wizard-hydrate
    content: Hydrate wizard from creationState, remove localStorage
    status: pending
    dependencies:
      - resume-route
  - id: api-support
    content: Ensure GET/PATCH expose and persist creationState
    status: pending
  - id: detail-resume
    content: Add resume button on draft detail page
    status: pending
    dependencies:
      - resume-route
  - id: manual-test
    content: Run manual scenarios for resume flow
    status: pending
    dependencies:
      - wizard-hydrate
      - api-support
---

# Draft Resume Editing Plan

## Goals

- Show draft characters in list with resume affordance and metadata.
- Resume drafts via `/characters/create?resume=[id]`, restoring `creationState` from server.
- Persist creation state to character metadata on every wizard change.

## Implementation Steps

- **List UX**
  - Update `[app/characters/page.tsx](app/characters/page.tsx)` list sorting/filter to surface drafts (default sort by `updatedAt` when draft filter on).
  - In `[app/characters/components/CharacterCard.tsx](app/characters/components/CharacterCard.tsx)` add draft badge, progress indicator (step X/Y if available), and click-through to resume route for `status === "draft"`.

- **Resume Route & Loader**
  - Extend `/characters/create` page to accept `resume` query; if present, fetch character via `GET /api/characters/[id]`, validate `status === "draft"`, and pass `characterId` + `creationState` to wizard.
  - Guard: if missing/invalid draft, fall back to fresh creation with message.

- **Creation Wizard Changes**
  - In `[app/characters/create/components/CreationWizard.tsx](app/characters/create/components/CreationWizard.tsx)` accept optional `characterId` and initial `creationState`; hydrate state instead of initializing defaults when provided; keep ruleset loading unchanged.
  - On any state change, persist to server via `PATCH /api/characters/[id]` with `metadata.creationState` (replace localStorage auto-save). Throttle/debounce writes.

- **API/Storage**
  - Ensure `PATCH /api/characters/[id]` already supports `metadata.creationState`; if not, extend handler in `[app/api/characters/[id]/route.ts](app/api/characters/[id]/route.ts)` and storage util `[lib/storage/characters.ts](lib/storage/characters.ts)` to merge updates atomically.
  - Confirm `GET /api/characters/[id]` returns `metadata.creationState` for drafts; adjust serializer if needed.

- **Character Detail Hooks**
  - On draft character sheet `[app/characters/[id]/page.tsx](app/characters/[id]/page.tsx)`, add "Resume Creation" button linking to `/characters/create?resume=[id]`.

- **Testing Checklist (manual)**
  - Create draft, leave mid-step, reload and resume; verify step/budgets restored.
  - Cross-device/browser resume (simulate new session) shows same state.
  - Multiple drafts show with badges and progress; delete draft works.
  - Finalize draft still works and no resume offered once active.
