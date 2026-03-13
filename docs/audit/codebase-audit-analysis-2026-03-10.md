# ShadowMaster Audit Analysis — Prioritization, Dependencies, Unknowns, Decisions

**Date:** 2026-03-10
**Revised:** 2026-03-10 (code-verified — PROJECT_STATE.md claims validated against actual source)
**Input:** `docs/audit/codebase-audit-2026-03-10.md` (raw findings only)
**Scope:** Categorization and dependency mapping — no new findings added, no fixes proposed

---

## 1. Prioritized Findings

### A. Incorrect or Broken Right Now

These will produce wrong results or crash at runtime if the relevant code path is reached.

| ID     | Finding                                                                | Location                                     | Impact                                                                                                                                                                                                                                                                           |
| ------ | ---------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **B1** | 4 training-time functions throw `Error("not yet implemented")`         | `lib/rules/advancement/training.ts:225-241`  | Runtime crash if a user attempts spell, complex form, focus, or initiation advancement                                                                                                                                                                                           |
| **B2** | Drain calculation returns hardcoded `"F"` for rituals                  | `lib/rules/magic/drain-calculator.ts:310`    | Wrong drain value for any ritual casting                                                                                                                                                                                                                                         |
| **B3** | Drain application reads condition monitor as hardcoded 0               | `lib/rules/magic/drain-application.ts:197`   | Drain damage applied against wrong baseline — overflow/unconsciousness thresholds incorrect                                                                                                                                                                                      |
| **B4** | Cyberlimb racial maximums use hardcoded defaults                       | `lib/rules/augmentations/cyberlimb.ts:254`   | Wrong attribute caps for non-human metatypes (trolls, orks, elves, dwarves)                                                                                                                                                                                                      |
| **B5** | Weapon modification capacity hardcoded to 0                            | `lib/rules/gear/weapon-customization.ts:409` | Every weapon reports zero capacity used by mods — capacity limits unenforced                                                                                                                                                                                                     |
| **B6** | Combat session API has no campaign membership check                    | `app/api/combat/[sessionId]/route.ts:59`     | Any authenticated user can access/modify any combat session they don't own — authorization bypass                                                                                                                                                                                |
| **B7** | Initiative calculation ignores cyberware/powers in QuickCombatControls | `QuickCombatControls.tsx:46-53`              | `calculateInitiativeDice()` returns hardcoded `1` with a TODO. **Note:** `CombatQuickReference.tsx:73-99` correctly integrates wireless bonuses via `calculateWirelessBonuses()` — the two components are inconsistent. The bug is in QuickCombatControls only, not system-wide. |

### B. Incomplete but Not Broken

These are known gaps that don't produce incorrect behavior — the features are either absent or safely gated.

| ID         | Finding                                                                   | Location                                         | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I1**     | Matrix: no interactive gameplay UI                                        | Issue #88                                        | **Code-verified.** `MatrixSessionContext` is fully implemented and mounted on the character page, but NO component calls its action methods (jackIn, placeMark, etc.). 5 display components render on the character sheet (read-only). No dedicated Matrix page, modal, or action execution UI exists. The context is architecturally ready but orphaned — no consumer.                                                                                                            |
| **I2**     | Rigging: no dedicated session UI                                          | Issue #89                                        | **Code-verified.** `RiggingSessionContext` is mounted on the character page. 5 display components (RiggingSummary, DroneNetwork, JumpInControl, AutosoftManager, VehicleActions) render as collapsible cards on the character sheet. These have some interactivity (slaving, jump-in, autosoft sharing). No dedicated rigging session page or modal exists. More functional than Matrix — display components call context actions — but lacks a focused session workflow.          |
| ~~**I3**~~ | ~~Augmentation UI integration pending~~                                   | ~~Issue #91~~                                    | **RETRACTED — code-verified as COMPLETE.** `AugmentationsDisplay` is fully integrated into the character page (`page.tsx:617-621`). Renders cyberware, bioware, and cyberlimbs with full CRUD when `editable={true}`. Includes install/remove modals, wireless toggles, capacity tracking, essence display, cyberlimb enhancement/accessory modals. **PROJECT_STATE.md was wrong — augmentations are fully integrated.**                                                           |
| **I4**     | Magic: display-only, no interactive gameplay UI                           | Issue #92                                        | **Code-verified — partially wrong.** All 5 magic display components ARE rendered on the character page (MagicSummary, Spells, AdeptPowers, ComplexForms, Foci) with dice roller integration. What's missing is interactive gameplay: no casting UI, no drain tracking UI, no sustained spell management, no spirit summoning/binding, no focus bonding — despite backend APIs existing (`/api/magic/drain`, `/api/characters/[id]/magic`). Display = complete, gameplay = missing. |
| **I5**     | Combat: functional but fragmented                                         | Issue #90                                        | **Code-verified — partially wrong.** Combat IS integrated into the character page: CombatTrackerModal, QuickCombatControls, ActionPanel (with CombatActionFlow), CombatDisplay, QuickNPCPanel all render. CombatSessionContext is active with 5s polling. However: `ActionSelector` and `OpposedTestResolver` components are built but **orphaned** (never imported anywhere). No standalone combat page exists.                                                                   |
| **I6**     | Mentor spirit bonuses/penalties for drain not implemented                 | `drain-calculator.ts:322`                        | Returns no bonus — conservative but incorrect for mentor spirit users                                                                                                                                                                                                                                                                                                                                                                                                              |
| **I7**     | Grunt activity logging deferred                                           | 3 locations in grunt-team routes                 | Activity types not yet in `CampaignActivityType` enum                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **I8**     | Quality gameplay-integration deprecated, awaiting unified effect pipeline | `qualities/gameplay-integration.ts:94`           | Issue #485 — old imperative code still runs, new system not ready                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **I9**     | Location template filtering incomplete                                    | `campaigns/[id]/locations/templates/page.tsx:43` | Client-side filtering needs refinement                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **I10**    | CI pipeline missing type-check, knip, E2E, format-check                   | `.github/workflows/ci.yml`                       | Quality gates exist locally (pre-commit hooks) but not in CI                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **I11**    | No E2E test for character creation flow                                   | `e2e/` directory                                 | The most complex user flow has zero end-to-end coverage                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **I12**    | Only SR5 edition data populated                                           | `data/editions/`                                 | Multi-edition architecture exists but only one edition has content                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **I13**    | `data/campaigns/` directory does not exist                                | `data/`                                          | Campaign feature has never been exercised with persisted data                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **I14**    | 29 Dependabot vulnerabilities on default branch                           | GitHub security tab                              | 17 high, 9 moderate, 3 low — not assessed in detail                                                                                                                                                                                                                                                                                                                                                                                                                                |

### C. Unclear or Ambiguous

These are findings where the audit could not determine intent — the code could be correct, or could be a problem, depending on context only the developer has.

| ID          | Finding                                               | Why It's Ambiguous                                                                                                  |
| ----------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ~~**U1**~~  | ~~File-based storage with no database~~               | **RESOLVED:** File-based storage is the permanent, intentional design for a small-group/self-hosted tool.           |
| ~~**U2**~~  | ~~No Next.js middleware.ts~~                          | **RESOLVED:** This was an oversight. Middleware should be added for centralized auth. B6 is a symptom of this gap.  |
| ~~**U3**~~  | ~~Security headers only at Caddy layer~~              | **RESOLVED:** Add headers at Next.js level too, for defense-in-depth.                                               |
| ~~**U4**~~  | ~~`sendDefaultPii: true` in all Sentry configs~~      | **RESOLVED:** Intentional. Keep it.                                                                                 |
| ~~**U5**~~  | ~~`tracesSampleRate: 1` (100% tracing)~~              | **RESOLVED:** Dev-time setting. Reduce for production.                                                              |
| ~~**U6**~~  | ~~`core-rulebook.json.backup` in editions directory~~ | **RESOLVED:** Intentional backup. Add to .gitignore.                                                                |
| ~~**U7**~~  | ~~Migration scripts split between two directories~~   | **RESOLVED:** Both locations are intentional. `/data/` = one-off scripts, `/lib/` = framework.                      |
| ~~**U8**~~  | ~~Combat logic split across 3 directories~~           | **RESOLVED:** Intentional layering. Session state / rules / resolution.                                             |
| ~~**U9**~~  | ~~PROJECT_STATE.md last updated 2026-01-10~~          | **RESOLVED:** Confirmed stale. Retire and delete the file.                                                          |
| ~~**U10**~~ | ~~Issues #88-92 referenced as blockers~~              | **RESOLVED:** All five issues are closed. References to these issues throughout the audit are no longer actionable. |

### D. Merely Rough or Unpolished

These are cosmetic or minor quality issues that don't affect correctness or completeness.

| ID     | Finding                                                           | Notes                                                                                                           |
| ------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **R1** | `console.error` in auth routes instead of pino structured logging | 6+ locations in `/app/api/auth/`. Functional but inconsistent with the logging infrastructure already in place. |
| **R2** | Sentry DSN hardcoded in source files                              | Sentry DSNs are not secrets, but moving to env var is standard practice.                                        |
| **R3** | No root-level `error.tsx` or `not-found.tsx`                      | Users see raw Next.js error pages on unhandled errors or 404s.                                                  |
| **R4** | In-memory rate limiter resets on restart                          | Acceptable for single-instance, but state is lost on every deploy.                                              |
| **R5** | Coverage thresholds set to 30%/25% ("initial/permissive")         | Not broken, but actual coverage unknown from code alone.                                                        |
| **R6** | E2E tests skip WebKit ("not installed")                           | 3 of 5 E2E tests have WebKit skips. Safari coverage gap.                                                        |
| **R7** | Sparse runtime data (1 character, 0 campaigns, test violations)   | Suggests limited manual testing. Not broken — just untested at scale.                                           |

---

## 2. Dependency Map

Findings where one must be resolved before another can be meaningfully addressed.

```
B1 (training throws) ──blocks──▶ I4 (magic gameplay UI)
    Training time calculations crash for spell/complex-form/focus/initiation.
    Can't ship interactive magic advancement if these paths throw.

B2, B3 (drain stubs) ──blocks──▶ I4 (magic gameplay UI)
    Drain values are wrong. Any casting/drain UI would show incorrect data.
    NOTE: Magic display components already render and are unaffected by this —
    drain bugs only matter when interactive casting is implemented.

B4 (cyberlimb maximums) ──affects──▶ Augmentation display (already integrated)
    Cyberlimb attribute caps are wrong for non-humans. The existing
    AugmentationsDisplay on the character page enforces wrong limits.
    This is a LIVE bug, not a future-blocked one — it's wrong right now
    for any non-human character viewing their cyberlimbs.
    (I3 retracted — augmentations are fully integrated.)

B5 (weapon mod capacity) ──affects──▶ Weapon customization (already integrated)
    Mod capacity is unenforced. This is a live bug in the creation
    and display flows, not a future concern.

B6 (combat auth bypass) ──affects──▶ Combat (already partially integrated)
    Combat modal and controls are live on the character page.
    The auth bypass is exploitable NOW, not just in a future page.

B7 (initiative in QuickCombatControls) ──independent fix──
    QuickCombatControls uses wrong calc. CombatQuickReference uses
    correct calc. Fix is to align QuickCombatControls with the
    existing correct implementation. No dependency chain.

I8 (deprecated quality integration) ──blocks──▶ Issue #485 (unified effect pipeline)
    Old code is marked deprecated but still runs. Can't remove until replacement is ready.

I7 (grunt activity logging) ──blocked-by──▶ CampaignActivityType enum extension
    Code explicitly defers to enum addition.

U1 (file-based storage — RESOLVED: permanent) ──constrains──▶ R4 (rate limiter), I10 (CI E2E)
    Single-instance is confirmed. R4 (in-memory rate limiter) is acceptable.
    E2E must remain single-worker. No database work needed.
    NOTE: Middleware (U2) is confirmed as needed regardless — for auth, not storage.

I10 (CI quality gates) ──independent──
    Can be fixed anytime. No dependencies.

I11 (creation E2E test) ──independent──
    Can be added anytime. No dependencies.

I13 (no campaigns directory) ──independent──
    Created automatically on first campaign. But means feature is untested.
```

### Critical Chain — Revised

Code verification changes the picture significantly. Three findings are **live bugs**, not future blockers:

```
B4 (cyberlimb caps)  ──▶  LIVE: wrong limits shown NOW in AugmentationsDisplay
B5 (weapon mod cap)  ──▶  LIVE: capacity unenforced NOW in weapon customization
B6 (combat auth)     ──▶  LIVE: authorization bypass in existing combat API
```

The remaining dependency chains block **new interactive UI**, not existing features:

```
B1/B2/B3 (broken magic calcs)  ──▶  I4 (interactive magic gameplay UI — not yet built)
I1 (Matrix interactive UI)     ──▶  no blockers, just not built yet
I2 (Rigging session UI)        ──▶  no blockers, just not built yet
```

**Key shift:** The audit originally framed B4/B5/B6 as blocking future integration. Code verification shows augmentations and combat are already integrated — making these bugs **active in production**, not theoretical.

---

## 3. Unknowns — Risk Assessment

### Blocking Unknowns — RESOLVED

| ID      | Question                                       | Resolution                                                                                                   | Impact on Analysis                                                                                                                                                                                                         |
| ------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **U1**  | Is file-based storage the long-term choice?    | **Yes — file-based is permanent.** This is a small-group/self-hosted tool by design.                         | In-memory rate limiter (R4) is acceptable. Single-worker E2E is fine. No database migration work needed. D1 resolved — single-instance is the model.                                                                       |
| **U2**  | Is the absence of middleware.ts intentional?   | **No — oversight. Middleware should be added.** B6 (combat auth bypass) is a symptom of this structural gap. | B6 needs a structural fix (middleware), not just a point patch. D3 resolved — centralize auth in middleware. All future routes will be protected by default.                                                               |
| **U10** | Are Issues #88-92 still the active work items? | **No — all five issues have been closed.**                                                                   | These are no longer blockers or references. D8b resolved. The "incomplete" findings I1, I2, I4, I5 need reassessment — the issues tracking them are closed, so either the work is considered done or it was deprioritized. |

### Deferrable Unknowns — RESOLVED

| ID      | Question                                            | Resolution                                                                                                                                      | Impact                                                             |
| ------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **U3**  | Should security headers exist at the Next.js level? | **Yes — add to Next.js too.** Defense-in-depth; protects dev/Docker and acts as safety net for Caddy.                                           | D10 resolved. Low-effort config addition.                          |
| **U4**  | Is `sendDefaultPii: true` intentional?              | **Yes — keep it.** Full debugging data to Sentry is acceptable.                                                                                 | D6 resolved. No change needed.                                     |
| **U5**  | Is 100% trace sampling intentional?                 | **No — reduce for production.** Dev-time setting that wasn't adjusted.                                                                          | D14 resolved. Needs a production-appropriate rate (e.g., 0.1-0.2). |
| **U6**  | What is `core-rulebook.json.backup`?                | **Intentional manual backup. Add to .gitignore.**                                                                                               | D11 resolved. Keep file, stop tracking in git.                     |
| **U7**  | Where should migration scripts live?                | **Both locations are intentional.** `/data/migrations/` = one-off scripts, `/lib/migrations/` = framework. Different purposes.                  | D12 resolved. No consolidation needed.                             |
| **U8**  | Is the 3-directory combat split intentional?        | **Yes — intentional layering.** `/lib/combat/` = session state, `/lib/rules/combat/` = rules, `/lib/rules/action-resolution/` = dice/execution. | No action needed. Architecture is by design.                       |
| **U9**  | Is PROJECT_STATE.md still accurate?                 | **Retire it.** GitHub issues and the codebase are the source of truth.                                                                          | D8 resolved. Delete the file.                                      |
| **U12** | What's the actual test coverage?                    | **Measure and raise thresholds.** Current 30%/25% are too permissive.                                                                           | Run coverage, set thresholds to match or slightly below actual.    |

---

## 4. Decision List

Decisions the developer needs to make before improvement work begins. Ordered by downstream impact.

### High-Impact Decisions (affect the most work)

| #          | Decision                                                                                                           | Options Observed in Code                                                                                                                                                                                                                                                                                                                                                   | What It Unblocks                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~**D1**~~ | ~~What is the deployment model?~~                                                                                  | **RESOLVED:** Single-instance, file-based storage is permanent.                                                                                                                                                                                                                                                                                                            | No database migration, Redis, or multi-instance concerns. R4 (in-memory rate limiter) is acceptable as-is.                                  |
| **D2**     | Should the live bugs (B4 cyberlimb caps, B5 weapon mod capacity, B6 combat auth) be fixed before new feature work? | Code verification shows these aren't future blockers — they're wrong in production now. B4 shows wrong limits for non-human cyberlimbs. B5 lets users bypass weapon mod capacity. B6 allows unauthorized combat session access.                                                                                                                                            | Determines immediate priority. These were previously categorized as blocking future work, but augmentations and combat are already shipped. |
| ~~**D3**~~ | ~~Should auth be centralized in middleware, or remain per-route?~~                                                 | **RESOLVED:** Add middleware. Per-route auth was an oversight, not a design choice.                                                                                                                                                                                                                                                                                        | B6 fix should be a middleware implementation, not a point patch. All future routes automatically protected.                                 |
| **D4**     | What is the scope of "interactive gameplay UI" for Matrix, Rigging, and Magic?                                     | Code verification clarified: display components are already integrated for all three. What's missing is interactive session UIs — casting spells, jacking into the Matrix, managing drone operations during play. These are new features, not integration of existing components. Issues #88-92 are all closed — so either this work was considered done or deprioritized. | Determines whether I1, I2, I4 are still desired.                                                                                            |

### Medium-Impact Decisions

| #           | Decision                                                                                                                                           | What It Affects                                                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **D5**      | Should the CI pipeline match the pre-commit hooks (add type-check, knip, format-check)?                                                            | I10. Straightforward to implement, but needs a yes/no.                                                                      |
| ~~**D6**~~  | ~~Is `sendDefaultPii: true` acceptable?~~                                                                                                          | **RESOLVED:** Keep it. Full debugging data is acceptable.                                                                   |
| **D7**      | Should broken training-time functions (B1) be implemented, or should the advancement paths be gated in the UI to prevent users from reaching them? | B1. Two valid approaches: implement the calculations, or add guards that prevent users from triggering unimplemented paths. |
| ~~**D8**~~  | ~~Should PROJECT_STATE.md be updated or retired?~~                                                                                                 | **RESOLVED:** Retire it. Delete the file. GitHub issues and codebase are the source of truth.                               |
| ~~**D8b**~~ | ~~Are Issues #88-92 still current?~~                                                                                                               | **RESOLVED:** All five issues are closed. No longer actionable references.                                                  |

### Low-Impact Decisions (can be made anytime)

| #           | Decision                                                         | What It Affects                                                      |
| ----------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| **D9**      | Should `console.error` in auth routes be migrated to pino?       | R1. Cosmetic but consistent.                                         |
| ~~**D10**~~ | ~~Should security headers be added at the Next.js level?~~       | **RESOLVED:** Yes, add them. Defense-in-depth.                       |
| ~~**D11**~~ | ~~Should `core-rulebook.json.backup` be removed or gitignored?~~ | **RESOLVED:** Keep file, add to .gitignore.                          |
| ~~**D12**~~ | ~~Should the migration script convention be formalized?~~        | **RESOLVED:** Both locations are intentional. No change needed.      |
| **D13**     | Is WebKit/Safari E2E support a goal?                             | R6. Determines whether to install WebKit in CI.                      |
| ~~**D14**~~ | ~~What Sentry trace sample rate is appropriate for production?~~ | **RESOLVED:** Reduce from 1.0. Needs a production-appropriate value. |

---

## 5. Code Verification Results — PROJECT_STATE.md Corrections

The original audit relied on PROJECT_STATE.md claims for "Missing per PROJECT_STATE.md" items. Code verification against the actual source revealed PROJECT_STATE.md is materially inaccurate:

| Subsystem         | PROJECT_STATE.md Said                                  | Code Actually Shows                                                                                                                                                                                                                                            | Verdict                                                                                                                   |
| ----------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Augmentations** | "Backend Complete, UI Pending Integration" (Issue #91) | `AugmentationsDisplay` fully integrated into character page with CRUD modals, wireless toggles, cyberlimb management, essence tracking. Editable when character is active.                                                                                     | **PROJECT_STATE wrong.** Augmentations are fully integrated. I3 retracted.                                                |
| **Magic**         | "Backend Complete, UI Pending Integration" (Issue #92) | All 5 magic display components render on character page (MagicSummary, Spells, AdeptPowers, ComplexForms, Foci) with dice roller integration. Missing: interactive gameplay (casting, drain tracking, spirit management, focus bonding).                       | **PROJECT_STATE partially wrong.** Display is done. Interactive gameplay is genuinely missing.                            |
| **Combat**        | "Backend Complete, UI Pending Integration" (Issue #90) | CombatTrackerModal, QuickCombatControls, ActionPanel (CombatActionFlow), CombatDisplay, QuickNPCPanel all render on character page. CombatSessionContext active with polling. Two components (`ActionSelector`, `OpposedTestResolver`) are built but orphaned. | **PROJECT_STATE partially wrong.** Combat is substantially integrated. Orphaned components and no standalone page remain. |
| **Rigging**       | "Backend Complete, UI Pending Integration" (Issue #89) | `RiggingSessionContext` mounted. 5 display components render as collapsible cards with some interactivity (slaving, jump-in, autosoft sharing). No dedicated session page.                                                                                     | **PROJECT_STATE partially wrong.** Display with basic interactivity is done. Dedicated session workflow missing.          |
| **Matrix**        | "Backend Complete, UI Pending Integration" (Issue #88) | `MatrixSessionContext` is implemented and mounted but **no component calls its action methods**. 5 display components render read-only. No interactive Matrix UI exists.                                                                                       | **PROJECT_STATE correct.** Matrix interactive UI is genuinely missing.                                                    |
| **Initiative**    | "Initiative dice from cyberware/powers not integrated" | `QuickCombatControls.tsx:46-53` has hardcoded `return 1` with TODO. But `CombatQuickReference.tsx:73-99` correctly integrates wireless bonuses via `calculateWirelessBonuses()`.                                                                               | **Partially wrong.** One component is broken, the other is correct. Inconsistency, not a system-wide gap.                 |

### Impact on Prioritization

This verification shifts three findings from "future blocker" to "live bug":

- **B4** (cyberlimb caps): Affects the already-integrated AugmentationsDisplay — wrong limits shown now
- **B5** (weapon mod capacity): Affects already-functional weapon customization — limits unenforced now
- **B6** (combat auth): Affects the already-integrated combat modal — exploitable now

And removes one finding entirely:

- **I3** (augmentation integration): Retracted — work is done

---

_End of analysis. This document maps findings — it does not propose solutions._
