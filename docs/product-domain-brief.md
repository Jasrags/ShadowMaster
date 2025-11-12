# ShadowMaster Product & Domain Brief

_Last updated: 2025-11-11_

## Mission Snapshot
Deliver a campaign-first console for Shadowrun 5th Edition that keeps GMs and players immersed in narrative while the system automates crunchy mechanics, enforces house rules, and keeps campaign knowledge in one place.

---

## Personas at a Glance
| Persona | Primary Needs | Notes |
| --- | --- | --- |
| **Alex “ZeroFrame” Tanaka (Gamemaster)** | Build & run long campaigns, reuse assets, automate combat bookkeeping without losing control. | Tech-savvy veteran GM balancing story with mechanics; wants scene/NPC dashboards and reusable prep. |
| **Riley “Ghostwire” Chen (Player)** | Optimize characters, stay synced with campaign rules, get transparent automation during sessions. | Power user who values accurate mechanics, readable roll breakdowns, and persistent progression. |
| **Admin / Head GM (Future)** | Manage communities, approve house rules/templates, curate shared data packs. | Not yet formalized; assume overlap with veteran GM persona plus moderation tasks. |

Persona source: `docs/personas/`

---

## Experience Pillars
1. **Campaign-Centric** – Campaigns define edition, creation method, gameplay level, and source books; every workflow hangs on that context.
2. **Transparent Automation** – Automate calculations (priority budgets, initiative, karma spends) but surface reasoning so users trust the results.
3. **Reusable Building Blocks** – Factions, scenes, NPCs, and gear catalogs should be composable across runs; data pipelines keep them consistent.
4. **Live Session Flow** – Prep tools feed directly into “run mode” dashboards (initiative, statuses, notes). No redundant data entry between prep and play.
5. **Progress Capture** – Every session should leave a durable trail (karma, loot, intel) that updates characters and campaign canon.

---

## Core User Stories
- **GM Campaign Onboarding**: “As a GM I configure edition, gameplay level, creation method, and source books so every downstream tool knows the rules I’m using.”
- **GM Prep**: “As a GM I assemble sessions from reusable scenes and NPCs, tagging clues and objectives for quick recall.”
- **Character Creation (PC/NPC)**: “As a user I create characters with Priority, Sum-to-Ten, or Karma workflows constrained by the campaign defaults.”
- **Session Execution**: “As a GM or player I see initiative, actions, and effects update automatically while preserving a transparent audit trail.”
- **Post-Session Wrap**: “As a GM I review outcomes and update campaign state (contacts, factions, outstanding hooks) without duplicating notes.”

---

## Domain Model Overview
| Entity | Key Fields | Relationships | Notes |
| --- | --- | --- | --- |
| **User** | `id`, `email`, `username`, `roles` | Owns characters, can manage campaigns depending on role. | Roles: Administrator, Gamemaster, Player. |
| **Campaign** | `id`, `name`, `edition`, `creation_method`, `gameplay_level`, `enabled_books`, `gm_user_id`, `house_rules` | Has sessions, characters, scenes; references edition data. | Edition & creation_method immutable post-create. |
| **Session** | `id`, `campaign_id`, `name`, `session_date`, `status` | Contains scenes, produces logs. | Must reference existing campaign; campaign immutable. |
| **Scene** | `id`, `session_id`, `name`, `type`, `status` | Holds narrative + mechanical context; links to NPCs/assets. | Session immutable link. |
| **Character** | `id`, `user_id`, `campaign_id`, `is_npc`, `status` | Uses creation rules from campaign edition defaults. | Supports Sum-to-Ten & Karma validation. |
| **Edition Data** | Priorities, metatypes, gameplay levels, creation methods | Loaded per `edition`; merged with campaign overrides. | Stored as JSON under `data/editions/{edition}`. |
| **SourceBook** | `code`, `name`, `matches[]` | Campaign `enabled_books` gate gear/spell availability. | Normalized from Chummer datasets. |

Reference docs: `internal/domain/*.go`, `internal/service/*.go`, `data/editions/sr5/*`

---

## Functional Scope (Current & Planned)
- ✅ Authentication & RBAC (registration, login, session cookies, role-based middleware).
- ✅ Campaign CRUD with React wizard (edition, method, gameplay level, GM selection, source books).
- ✅ SR5 character creation datasets (priorities, gameplay levels, creation methods) with Sum-to-Ten and Karma validation.
- ✅ React campaign table + edit modal with RBAC-aware actions.
- ⚙️ In progress: Character creation wizard migration beyond priorities/metatypes/magic steps.
- 🔜 Session & Scene React migration, automation dashboards, richer SR5 data libraries (gear, spells, NPC templates).

---

## Success Metrics (Initial)
| Metric | Target / Direction | Rationale |
| --- | --- | --- |
| Campaign creation completion rate | 95%+ once a GM starts the wizard | Validates wizard UX + backend validation cohesion. |
| Character builder completion | Increase week-over-week as new steps ship | Gauges adoption of Sum-to-Ten/Karma workflows. |
| Prep-to-play transition time | Reduce manual prep time by 30% vs. spreadsheets | Measures value of reusable scenes/NPCs. |
| Automation trust | <5% of rolls/actions undone due to incorrect automation | Ensures transparency and correctness. |
| Data coverage | 100% of SR5 core gear/spell datasets normalized | Enables limiting availability via campaign books. |

---

## Open Questions & Risks
- **Edition Expansion**: Current UX assumes SR5 but architecture keeps edition pluggable; SR3/SR6 support will require data parity and UI toggles.
- **Session Automation**: Initiative/edge/matrix flows aren’t Reactified yet—key to live play value.
- **Collaboration Features**: Invitations, shared notes, and GM/player permissions beyond RBAC roles remain unspecified.
- **Scale & Persistence**: JSON file storage works for prototypes; eventual multi-tenant hosting may need database migration.

Document owner: `@jrags` (product) with support from engineering and rules specialists.
