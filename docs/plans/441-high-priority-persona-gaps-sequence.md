# Epic #441: HIGH Priority Persona Gaps — Implementation Sequence

## Status Overview

| #   | Issue                                                              | Status               | Persona       | Complexity |
| --- | ------------------------------------------------------------------ | -------------------- | ------------- | ---------- |
| 1   | #446 — GM party overview / character roster summary                | **CLOSED**           | Marcus        | —          |
| 2   | #447 — Specialization +2 dice bonus applied to pools               | **CLOSED**           | Marcus        | —          |
| 3   | #448 — Downstream effect preview for qualities/augmentations       | **CLOSED**           | Priya         | —          |
| 4   | #485 — Dynamic state activation for quality effects                | **CLOSED** (PR #488) | Priya         | —          |
| 5   | #487 — Gate effect gathering by equipment readiness state          | **CLOSED** (PR #495) | Priya, Marcus | —          |
| 6   | #486 — Group Active Effects by source item with parent attribution | **CLOSED** (PR #496) | Priya         | —          |
| 7   | #452 — Edge spending integration in combat UI                      | **CLOSED** (PR #497) | Priya         | —          |
| 8   | #461 — Enforce gameplayLevel on character creation budgets         | **CLOSED** (PR #498) | Marcus, Priya | —          |
| 9   | #451 — Sourcebook configuration UI                                 | **CLOSED** (PR #499) | Marcus        | Medium     |
| 10  | #449 — Archetype / quick-build character creation                  | **CLOSED** (PR #500) | Marcus        | Large      |
| 11  | #450 — In-app rule quick-reference                                 | **CLOSED** (PR #501) | Marcus, Priya | Large      |

---

## Recommended Implementation Order

### ~~1. #485 — Dynamic State Activation for Quality Effects~~ DONE

Closed via PR #488. Skill category matching, firstMeeting state lifting, withdrawal/exposure toggles all working.

---

### ~~1. #487 — Gate Effect Gathering by Equipment Readiness State~~ DONE

Closed via PR #495. Added `EFFECT_ACTIVE_READINESS` mapping and `isReadinessActive()` helper with `normalizeReadiness()` support. Gates 5 gather functions (gear, weapons, armor, gear mods, weapon mods). 22 new tests covering all readiness combinations and backward compatibility.

---

### ~~2. #486 — Group Active Effects by Source Item with Parent Attribution~~ DONE

Closed via PR #496. Added `parentName`/`parentId` to `EffectSource`, set parent fields in mod gathering functions, rewrote `EffectsSummaryDisplay` to sub-group by `source.id` with `formatEffectBadge()` colored badge pills and parent attribution suffix. 14 tests.

---

### ~~3. #452 — Edge Spending Integration in Combat UI~~ DONE

Closed via PR #497. Created shared `EdgeActionSelector` component with pre-roll, post-roll, and non-roll timing modes. Extracted combat tab into `CombatActionFlow` with 4-step flow (select → target → confirm → result). All 6 Edge actions supported (Push the Limit, Second Chance, Close Call, Seize the Initiative, Blitz, Dead Man's Trigger). Wired `executeRoll` pipeline for persistent history alongside visual dice roller. Edge state synced after rolls. ActionPanel slimmed from ~1093 to ~310 lines. 30 new tests.

---

### ~~4. #461 — Enforce gameplayLevel on Character Creation Budgets~~ DONE

Closed via PR #498. Added data-driven `gameplayLevels` rule module to SR5 core-rulebook.json with three levels (street, experienced, prime-runner). Each level defines `startingKarma`, `maxAvailability`, `contactMultiplier`, and `resourcesMultiplier`. New `CreationSetup` component provides gameplay level selection for standalone characters (three-card selector with amber/emerald/violet theming). Campaign characters auto-inherit gameplay level. Budget calculations in `CreationBudgetContext` now parameterized by gameplay level modifiers (karma 13/25/35, contacts CHA×2/3/5, nuyen ×1.0/1.0/1.5, availability cap 6/12/18). Server-side validation updated with `getKarmaBudget()` and `getContactMultiplier()` helpers. `materialize.ts` copies `gameplayLevel` to character record. Three new ruleset hooks: `useGameplayLevelModifiers`, `useGameplayLevels`, `useMaxAvailability`. Gear validation parameterized via `getCreationConstraints(maxAvailability)`. All 390 test files (8467 tests) pass.

**Key files changed (18):**

- `data/editions/sr5/core-rulebook.json` — gameplayLevels module
- `lib/types/edition.ts` — GameplayLevelModifiers interface, RuleModuleType
- `lib/types/character.ts`, `lib/types/creation.ts` — gameplayLevel field
- `lib/rules/RulesetContext.tsx` — 3 new hooks
- `components/creation/CreationSetup.tsx` — new pre-sheet setup component
- `app/characters/create/sheet/page.tsx` — setup step, campaign auto-inherit
- `lib/contexts/CreationBudgetContext.tsx` — parameterized budgets
- `lib/rules/gear/validation.ts` — getCreationConstraints()
- `lib/rules/validation/budget-calculator.ts` — getKarmaBudget(), getContactMultiplier()
- `lib/rules/validation/character-validator.ts` — gameplay level enforcement
- `lib/rules/validation/materialize.ts` — gameplayLevel materialization
- `app/api/characters/route.ts` — accept gameplayLevel in POST

---

### ~~5. #451 — Sourcebook Configuration UI~~ DONE

Closed via PR #499. Added book metadata (abbreviation, summary, contentBadges) to edition.json. Campaign settings page shows toggle cards for each book with metadata and content badges. Edition API endpoint enriched with book metadata.

---

### ~~6. #449 — Archetype / Quick-Build Character Creation~~ DONE

Closed via PR #500. Added complete archetype system with 7 core SR5 archetypes (Street Samurai, Face, Combat Mage, Decker, Technomancer, Rigger, Adept). New `CharacterArchetype` type, storage layer mirroring grunt-templates, GET API endpoint with category/search filters, and `ArchetypeSelector` UI with card grid, category filtering, and difficulty badges. Integrated into creation flow between edition selection and gameplay level setup. Pre-fills priorities, attributes, and skills — all fully editable. "Custom Build" option preserves existing blank-sheet workflow.

---

### ~~7. #450 — In-App Rule Quick-Reference~~ DONE

Closed via PR #501. Searchable rule reference with Cmd+K palette, category tabs, table/card views, and keyboard shortcut access from any page. Data sourced from structured JSON in `data/editions/sr5/rule-reference.json`. Covers action types, combat modifiers, range bands, environmental modifiers, and more.

---

## Phase 2: Dynamic State Polish + GM Approval

The original epic #441 issues are all closed. The following issues were identified during implementation and form a natural follow-up sequence — dynamic state bugs/polish (#489-494) plus the BLOCKER GM approval workflow (#445 from epic #440).

### New Issues

| #   | Issue                                                                       | Type        | Priority                        | Complexity | Dependencies |
| --- | --------------------------------------------------------------------------- | ----------- | ------------------------------- | ---------- | ------------ |
| 1   | #491 — Inconsistent API shape between toggle pill and DynamicStateModal     | bug         | ~~**Critical**~~ DONE (PR #502) | Small      | None         |
| 2   | #489 — AddictionTracker 'Craving Test' button is a no-op                    | bug         | ~~**High**~~ DONE (PR #503)     | Small      | None         |
| 3   | #494 — Add dynamicState catalog definitions for Dependent and Code of Honor | enhancement | **High**                        | Small      | None         |
| 4   | #490 — Allow opening DynamicStateModal before state is initialized          | enhancement | **High**                        | Medium     | #494         |
| 5   | #493 — Add visual feedback for successful state updates                     | enhancement | **Medium**                      | Small      | #491         |
| 6   | #492 — Show active effect preview inside DynamicStateModal                  | enhancement | **Medium**                      | Medium     | #490         |
| 7   | #445 — GM character creation approval workflow                              | persona-gap | **BLOCKER**                     | Large      | None         |
| 8   | #444 — Live dice pool display during character creation                     | feat        | **High**                        | Medium     | None         |

### Recommended Order

#### Batch A: Bug Fixes (1 session)

~~**#491 — Fix inconsistent API shape**~~ DONE (PR #502)
Standardized on direct `{ field: value }` format. Removed `{ updates }` wrapper from DynamicStateModal and `data.updates || data` fallback from API handler.

~~**#489 — Fix AddictionTracker craving test no-op**~~ DONE (PR #503)
Wired onClick to roll Body + Willpower vs severity threshold using `executeRoll()`. Displays inline pass/fail result banner. Passes `character` from DynamicStateModal to all trackers.

#### Batch B: Enable Dead Code (1 session)

**#494 — Add dynamicState for Dependent and Code of Honor** (High, Small)
Tracker components exist but are unreachable because catalog entries lack `dynamicState` field. Add definitions and `initializeDynamicState()` handling.

- `data/editions/sr5/core-rulebook.json`
- `lib/rules/qualities/dynamic-state.ts`
- `lib/types/qualities.ts`

**#490 — Allow opening DynamicStateModal before state init** (High, Medium)
Settings gear only renders when `dynamicState` already exists — chicken-and-egg problem. Show gear for any quality with a catalog `dynamicState` field, auto-initialize on open.

- `components/character/sheet/QualitiesDisplay.tsx`
- `app/characters/[id]/components/DynamicStateModal.tsx`
- `lib/rules/qualities/dynamic-state.ts`

#### Batch C: UX Polish (1 session)

**#493 — Visual feedback for state updates** (Medium, Small)
Success is silent, errors are swallowed. Add pulse animation on toggle success, surface errors to user.

- `components/character/sheet/QualitiesDisplay.tsx`
- `app/characters/[id]/components/DynamicStateModal.tsx`

**#492 — Effect preview inside DynamicStateModal** (Medium, Medium)
Show active effect badges inside modal trackers so users see penalties without closing the modal.

- `app/characters/[id]/components/trackers/AddictionTracker.tsx`
- `app/characters/[id]/components/trackers/AllergyTracker.tsx`
- `lib/rules/effects/`

#### Batch D: GM Approval Workflow (2-3 sessions)

**#445 — GM character creation approval workflow** (BLOCKER, Large)
From epic #440. New `pending-review` lifecycle state between draft and active. GM can approve or reject with feedback notes. Requires state machine update, campaign UI, and player-facing status.

- `lib/rules/character/state-machine.ts`
- Campaign management UI
- Character finalization flow

#### Batch E: Creation UX

**#444 — Live dice pool display during character creation** (High, Medium)
Show calculated dice pools in real-time as players assign attributes and skills during character creation. Helps new players understand the impact of their choices.

---

## Dependency Graph

```
Phase 1 (ALL DONE):
#485 ✅ → #487 ✅ → #486 ✅
#452 ✅ (Edge spending)
#461 ✅ → #451 ✅ → #449 ✅
#450 ✅ (rule reference)

Phase 2:
#491 (API shape fix)
  ↓
#493 (visual feedback)

#494 (catalog definitions)
  ↓
#490 (modal before init)
  ↓
#492 (effect preview)

#489 ✅ (craving test fix)

#445 (GM approval) — independent, large

#444 (live dice pools) — independent
```

## Session Planning

| Session | Issues         | Notes                                        |
| ------- | -------------- | -------------------------------------------- |
| ~~1~~   | ~~#487~~       | ~~Readiness gating for effect gathering~~ ✅ |
| ~~2~~   | ~~#486~~       | ~~Effects grouping UI~~ ✅                   |
| ~~3~~   | ~~#452~~       | ~~Edge spending in combat~~ ✅               |
| ~~4~~   | ~~#461~~       | ~~Gameplay level enforcement~~ ✅            |
| ~~5~~   | ~~#451~~       | ~~Sourcebook configuration UI~~ ✅           |
| ~~6~~   | ~~#449~~       | ~~Archetype system~~ ✅                      |
| ~~7~~   | ~~#450~~       | ~~Rule quick-reference~~ ✅                  |
| ~~8~~   | ~~#491, #489~~ | ~~Bug fixes (API shape + craving test)~~ ✅  |
| 9       | #494, #490     | Enable Dependent/Code of Honor trackers      |
| 10      | #493, #492     | UX polish (feedback + effect preview)        |
| 11-13   | #445           | GM approval workflow (2-3 sessions)          |
| 14      | #444           | Live dice pool display during creation       |

**Estimated total:** 6-7 sessions for 7 remaining issues.
