# Implementation Plan: Grunt Team UI Builder (#456)

## Context

Extensive grunt team UI already exists — list page, 6-step create wizard, detail page with stats/combat/settings tabs, full API routes, and storage layer. This issue is about filling the remaining gaps to make the builder fully functional.

## What Already Exists

| Component                                                                     | Status   |
| ----------------------------------------------------------------------------- | -------- |
| Grunt teams list page (`/campaigns/[id]/grunt-teams/page.tsx`)                | Complete |
| Create wizard (basics, template, lieutenant, specialists, visibility, review) | Complete |
| Detail page with Stats/Combat tabs                                            | Complete |
| API routes (CRUD, damage, Edge, initiative, templates)                        | Complete |
| Storage layer (`lib/storage/grunts.ts`, `grunt-templates.ts`)                 | Complete |
| PR0-PR6 template data files                                                   | Complete |
| Campaign overview quick-link to grunt teams                                   | Complete |

## Identified Gaps

### Gap 1: Edit Page (MISSING)

The detail page links to `/grunt-teams/[teamId]/edit` but this page doesn't exist. GMs cannot modify teams after creation.

### Gap 2: Stat Customization After Template Selection

The create wizard selects a template but provides no UI to tweak individual attributes, skills, weapons, armor, or gear. The `baseGrunts` field gets set from template but isn't editable.

### Gap 3: Quick-Deploy to Combat Sessions

No integration between grunt teams and the combat session context (`/lib/combat/`). GMs can't add a grunt team to an active combat encounter from the grunt teams UI.

### Gap 4: Campaign Tabs Integration

"Grunt Teams" doesn't appear in `CampaignTabs.tsx`. Only accessible via the overview quick-link card.

### Gap 5: Settings Tab (Placeholder)

The settings tab on the detail page shows placeholder text with no actual editing capability.

### Gap 6: Team Size Management During Play

Initial size is set at creation but there's no UI to add/remove individual grunts from the detail page during a session.

## Implementation Checklist

### Phase 1: Campaign Tab + Edit Page (Core Navigation)

- [ ] **Add Grunt Teams tab to `CampaignTabs.tsx`**
  - Add "Grunt Teams" with Users icon between existing tabs
  - Only visible to GMs (or all if team has `showToPlayers` teams)
  - File: `app/campaigns/[id]/components/CampaignTabs.tsx`

- [ ] **Create edit page at `app/campaigns/[id]/grunt-teams/[teamId]/edit/page.tsx`**
  - Reuse form components from create wizard
  - Pre-populate from existing team data
  - PUT to `/api/grunt-teams/[teamId]`
  - File: new `app/campaigns/[id]/grunt-teams/[teamId]/edit/page.tsx`

### Phase 2: Stat Customization UI

- [ ] **Add stat editor component for grunt attributes**
  - Editable number inputs for all 8 attributes (BOD, AGI, REA, STR, WIL, LOG, INT, CHA)
  - Show template defaults with ability to override
  - File: new `app/campaigns/[id]/grunt-teams/components/GruntStatsEditor.tsx`

- [ ] **Add skills editor**
  - Add/remove skills with name + rating
  - Pre-populated from template
  - Part of `GruntStatsEditor.tsx` or separate component

- [ ] **Add equipment editor (weapons, armor, gear)**
  - Simple text-based list for weapons/armor/gear
  - Add/remove items with name fields
  - Part of stat editor component

- [ ] **Integrate stat editor into create wizard's template step**
  - After template selection, show expandable "Customize Stats" section
  - File: `app/campaigns/[id]/grunt-teams/create/page.tsx`

### Phase 3: Team Size Management

- [ ] **Add team size controls to detail page**
  - "Add Grunt" / "Remove Grunt" buttons on the stats or combat tab
  - Update `initialSize` and `state.activeCount` via API
  - Show current active vs initial count
  - File: `app/campaigns/[id]/grunt-teams/[teamId]/components/GruntTeamStatsTab.tsx`

### Phase 4: Settings Tab

- [ ] **Implement settings tab with inline editing**
  - Edit team name, description, PR, visibility, combat options
  - Save via PUT `/api/grunt-teams/[teamId]`
  - File: replace placeholder in `app/campaigns/[id]/grunt-teams/[teamId]/page.tsx` or new `GruntTeamSettingsTab.tsx`

### Phase 5: Quick-Deploy to Combat

- [ ] **Add "Deploy to Combat" button on grunt team detail**
  - Button visible when a combat session is active for the campaign
  - Needs API check for active combat session
  - File: `app/campaigns/[id]/grunt-teams/[teamId]/page.tsx`

- [ ] **Wire grunt team into CombatSessionContext**
  - Add grunt team participants to combat initiative tracker
  - Use existing `rollGroupInitiative()` from `lib/rules/grunts.ts`
  - File: `lib/combat/CombatSessionContext.tsx` (add grunt team support)

### Phase 6: Tests

- [ ] Unit tests for stat editor component
- [ ] Unit tests for settings tab
- [ ] Unit tests for team size management
- [ ] Integration test for edit page API flow

## Files to Modify

| File                                                                       | Change                           |
| -------------------------------------------------------------------------- | -------------------------------- |
| `app/campaigns/[id]/components/CampaignTabs.tsx`                           | Add Grunt Teams tab              |
| `app/campaigns/[id]/grunt-teams/create/page.tsx`                           | Add stat customization section   |
| `app/campaigns/[id]/grunt-teams/[teamId]/page.tsx`                         | Wire settings tab, deploy button |
| `app/campaigns/[id]/grunt-teams/[teamId]/components/GruntTeamStatsTab.tsx` | Team size controls               |

## New Files

| File                                                                          | Purpose                         |
| ----------------------------------------------------------------------------- | ------------------------------- |
| `app/campaigns/[id]/grunt-teams/[teamId]/edit/page.tsx`                       | Edit grunt team page            |
| `app/campaigns/[id]/grunt-teams/components/GruntStatsEditor.tsx`              | Reusable stat/skill/gear editor |
| `app/campaigns/[id]/grunt-teams/[teamId]/components/GruntTeamSettingsTab.tsx` | Settings tab content            |

## Estimated Scope

- **Size:** Large (6 phases, ~8-10 files)
- **Risk:** Low — all APIs and storage already exist, this is UI-only work
- **Dependencies:** Combat deploy (Phase 5) depends on understanding CombatSessionContext
