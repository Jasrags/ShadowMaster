# Campaign Creation Flow (GM Onboarding)

_Last updated: 2025-11-10_

This document translates the GM onboarding flow into concrete UI, data, and integration tasks that extend the existing React campaign wizard. It focuses on delivering a fast “skeleton first” experience that Alex “ZeroFrame” Tanaka can build upon, while keeping room for future automation modules.

---

## 1. Goals & Success Criteria

- **Reduce friction**: Creating a campaign should take < 5 minutes for essential fields.
- **Structured skeleton**: Always land the GM on a usable dashboard with starter assets (session seed, NPC roster slots).
- **Progressive enhancement**: Subsequent configuration (factions, house rules, automation toggles) stacks onto the initial flow without forcing immediate deep data entry.
- **Automatable later**: All selections map cleanly to backend models so live-session automation can pick them up when implemented.

### KPIs
- Time-to-first-session seed (target < 2 minutes after campaign creation).
- Completion rate of wizard (no more than 1 validation failure on average).
- Reduction in manual follow-up edits (track via future analytics).

---

## 2. Flow Overview

1. **Campaign Essentials**  
   - Name, edition, gameplay level, creation method (existing form).  
   - Optional: tone/theme text, default house rule toggles (stored in `campaign.house_rules` JSON stub for now).

2. **Roster & Roles**  
   - Attach existing PCs (multi-select) or create placeholders (name, status).  
   - Invite co-GMs (future-proof: collect emails but mark feature as “coming soon”).  
   - Generate quick NPC roster stubs (Fixer, Johnson, Opposition) for fast linking later.

3. **World Backbone**  
   - Add first faction and location (lightweight forms with name, tag, short description).  
   - Provide skip option; default to sample placeholders if skipped.

4. **Automation & House Rules**  
   - Switches for planned modules (initiative automation, recoil tracking, matrix trace).  
   - Persist settings under `campaign.house_rules` until dedicated fields exist.

5. **Session Seed**  
   - Prompt to create Session 0:  
     - Title, date placeholder, optional objectives.  
     - Add initial scene from template (blank, social meetup, astral recon, matrix scoping) with ability to skip.

6. **Review & Launch**  
   - Summary card listing entered data.  
   - CTAs: `Open Campaign Dashboard`, `Add another session`, `Invite players (placeholder)`.

---

## 3. UX Breakdown

### 3.1 Wizard Structure
| Step | Title | Primary Inputs | Validation |
| --- | --- | --- | --- |
| 1 | Campaign Essentials | Name, edition, gameplay level, creation method, theme blurb | Name required; edition/method validated server-side |
| 2 | Roster & Roles | PC selector, placeholder creation, GM collaborators (optional) | At least one PC or placeholder recommended (warning) |
| 3 | World Backbone | Faction (name + tag), Location (name + descriptor) | Optional; auto-create sample if skipped |
| 4 | Automation | Toggle list, freeform notes | None |
| 5 | Session Seed | Session title, objective, scene template | Title required if not skipped |
| 6 | Review | Summary cards with edit links | — |

### 3.2 Interaction Notes
- Allow back/next navigation with state preservation.
- Provide “Skip for now” on all optional sections; skipped entries auto-fill with template data.
- Use status indicator (e.g., steps list with check marks) to reflect progress.
- On completion, navigate to new `Campaign Dashboard` route with welcome toast.

---

## 4. Data & API Requirements

### 4.1 REST Endpoints
- `POST /api/campaigns` (existing): extend payload to include `theme`, `house_rules` (JSON blob).
- `POST /api/campaigns/{id}/sessions` (planned): create Session 0.
- `POST /api/campaigns/{id}/factions`, `/locations` (future; stub responses until routes exist).
- `POST /api/characters` for placeholders (call existing character endpoint with `is_npc` + `campaign_id` flag).

### 4.2 Client State
- Store wizard draft in local component state; optionally persist to `sessionStorage` for refresh resilience.
- After creation, invalidate campaign list cache (`EditionContext` refresh).
- Provide context hook to share default references (faction templates, scene templates).

---

## 5. Implementation Plan

### Milestone A — Extend Existing Wizard
1. **Component scaffolding**: convert `CampaignCreation` into multi-step layout with state machine (e.g., `useReducer` or step-specific contexts).  
2. **Roster panel**: create `RosterStep` component to fetch PCs (`/api/characters`) and allow placeholder creation.  
3. **World panel**: `WorldStep` capturing faction/location (store locally; API integration optional in first pass).  
4. **Automation panel**: `AutomationStep` mapping toggles to `house_rules`.
5. **Session seed**: `SessionSeedStep` constructing payload for future session endpoint; until endpoint exists, store in local state to show on review summary.  
6. **Review**: `ReviewStep` summarizing entries; on submit, perform API calls in sequence (campaign → placeholders → factions/locations → session (when available)).  
7. **Landing**: redirect to campaign dashboard (existing list screen for now; future dedicated route).

### Milestone B — Backend Support
1. Update `CampaignCreateInput` to accept theme/house rules; ensure `json` repository persists.  
2. Add placeholder support in `CharacterRepository` for `IsNPC` + `CampaignID`.  
3. Plan new endpoints for factions/locations (stub path returning 501 until implemented).  
4. Ensure session creation respects `CampaignID` and default status.

### Milestone C — Dashboard Integration (Future Iteration)
1. Create campaign overview page with summary cards pulling from newly created data.  
2. Add quick actions for scene/session creation.  
3. Display automation toggles and allow edits post-creation.

---

## 6. Open Questions
- **Placeholder Characters:** Should placeholders create actual character records or just reserved slots? (Current approach: create NPC record with `Status="Placeholder"`.)  
- **Collaborators:** Determine auth model for multiple GMs; for wizard, capture list but mark feature as “coming soon”.  
- **Factions/Locations API:** confirm modeling in backend before hooking up; initial release can store data client-side and prompt user to manually fill later.

---

## 7. Next Steps & Owners

| Task | Owner | Status |
| --- | --- | --- |
| Wizard refactor with multi-step navigation | Frontend | Pending |
| Extend campaign API to store theme/house rules | Backend | Pending |
| Design faction/location data model | Backend | Pending |
| Draft session creation endpoint | Backend | Pending |
| Build campaign dashboard skeleton | Frontend | Pending |

---

### References
- Persona notes: `docs/personas/gamemaster_persona_shadowrun.md`
- Existing wizard source: `web/app/src/components/CampaignCreation.tsx`
- Roadmap: `docs/project-roadmap.md`


