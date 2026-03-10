# ShadowMaster Audit Analysis — Prioritization, Dependencies, Unknowns, Decisions

**Date:** 2026-03-10
**Revised:** 2026-03-10 (code-verified — PROJECT_STATE.md claims validated against actual source)
**Input:** `docs/audit/codebase-audit-2026-03-10.md` (raw findings only)
**Scope:** Categorization and dependency mapping — no new findings added, no fixes proposed

---

## 1. Prioritized Findings

### A. Incorrect or Broken Right Now

These will produce wrong results or crash at runtime if the relevant code path is reached.

| ID | Finding | Location | Impact |
|----|---------|----------|--------|
| **B1** | 4 training-time functions throw `Error("not yet implemented")` | `lib/rules/advancement/training.ts:225-241` | Runtime crash if a user attempts spell, complex form, focus, or initiation advancement |
| **B2** | Drain calculation returns hardcoded `"F"` for rituals | `lib/rules/magic/drain-calculator.ts:310` | Wrong drain value for any ritual casting |
| **B3** | Drain application reads condition monitor as hardcoded 0 | `lib/rules/magic/drain-application.ts:197` | Drain damage applied against wrong baseline — overflow/unconsciousness thresholds incorrect |
| **B4** | Cyberlimb racial maximums use hardcoded defaults | `lib/rules/augmentations/cyberlimb.ts:254` | Wrong attribute caps for non-human metatypes (trolls, orks, elves, dwarves) |
| **B5** | Weapon modification capacity hardcoded to 0 | `lib/rules/gear/weapon-customization.ts:409` | Every weapon reports zero capacity used by mods — capacity limits unenforced |
| **B6** | Combat session API has no campaign membership check | `app/api/combat/[sessionId]/route.ts:59` | Any authenticated user can access/modify any combat session they don't own — authorization bypass |
| **B7** | Initiative calculation ignores cyberware/powers in QuickCombatControls | `QuickCombatControls.tsx:46-53` | `calculateInitiativeDice()` returns hardcoded `1` with a TODO. **Note:** `CombatQuickReference.tsx:73-99` correctly integrates wireless bonuses via `calculateWirelessBonuses()` — the two components are inconsistent. The bug is in QuickCombatControls only, not system-wide. |

### B. Incomplete but Not Broken

These are known gaps that don't produce incorrect behavior — the features are either absent or safely gated.

| ID | Finding | Location | Notes |
|----|---------|----------|-------|
| **I1** | Matrix: no interactive gameplay UI | Issue #88 | **Code-verified.** `MatrixSessionContext` is fully implemented and mounted on the character page, but NO component calls its action methods (jackIn, placeMark, etc.). 5 display components render on the character sheet (read-only). No dedicated Matrix page, modal, or action execution UI exists. The context is architecturally ready but orphaned — no consumer. |
| **I2** | Rigging: no dedicated session UI | Issue #89 | **Code-verified.** `RiggingSessionContext` is mounted on the character page. 5 display components (RiggingSummary, DroneNetwork, JumpInControl, AutosoftManager, VehicleActions) render as collapsible cards on the character sheet. These have some interactivity (slaving, jump-in, autosoft sharing). No dedicated rigging session page or modal exists. More functional than Matrix — display components call context actions — but lacks a focused session workflow. |
| ~~**I3**~~ | ~~Augmentation UI integration pending~~ | ~~Issue #91~~ | **RETRACTED — code-verified as COMPLETE.** `AugmentationsDisplay` is fully integrated into the character page (`page.tsx:617-621`). Renders cyberware, bioware, and cyberlimbs with full CRUD when `editable={true}`. Includes install/remove modals, wireless toggles, capacity tracking, essence display, cyberlimb enhancement/accessory modals. **PROJECT_STATE.md was wrong — augmentations are fully integrated.** |
| **I4** | Magic: display-only, no interactive gameplay UI | Issue #92 | **Code-verified — partially wrong.** All 5 magic display components ARE rendered on the character page (MagicSummary, Spells, AdeptPowers, ComplexForms, Foci) with dice roller integration. What's missing is interactive gameplay: no casting UI, no drain tracking UI, no sustained spell management, no spirit summoning/binding, no focus bonding — despite backend APIs existing (`/api/magic/drain`, `/api/characters/[id]/magic`). Display = complete, gameplay = missing. |
| **I5** | Combat: functional but fragmented | Issue #90 | **Code-verified — partially wrong.** Combat IS integrated into the character page: CombatTrackerModal, QuickCombatControls, ActionPanel (with CombatActionFlow), CombatDisplay, QuickNPCPanel all render. CombatSessionContext is active with 5s polling. However: `ActionSelector` and `OpposedTestResolver` components are built but **orphaned** (never imported anywhere). No standalone combat page exists. |
| **I6** | Mentor spirit bonuses/penalties for drain not implemented | `drain-calculator.ts:322` | Returns no bonus — conservative but incorrect for mentor spirit users |
| **I7** | Grunt activity logging deferred | 3 locations in grunt-team routes | Activity types not yet in `CampaignActivityType` enum |
| **I8** | Quality gameplay-integration deprecated, awaiting unified effect pipeline | `qualities/gameplay-integration.ts:94` | Issue #485 — old imperative code still runs, new system not ready |
| **I9** | Location template filtering incomplete | `campaigns/[id]/locations/templates/page.tsx:43` | Client-side filtering needs refinement |
| **I10** | CI pipeline missing type-check, knip, E2E, format-check | `.github/workflows/ci.yml` | Quality gates exist locally (pre-commit hooks) but not in CI |
| **I11** | No E2E test for character creation flow | `e2e/` directory | The most complex user flow has zero end-to-end coverage |
| **I12** | Only SR5 edition data populated | `data/editions/` | Multi-edition architecture exists but only one edition has content |
| **I13** | `data/campaigns/` directory does not exist | `data/` | Campaign feature has never been exercised with persisted data |
| **I14** | 29 Dependabot vulnerabilities on default branch | GitHub security tab | 17 high, 9 moderate, 3 low — not assessed in detail |

### C. Unclear or Ambiguous

These are findings where the audit could not determine intent — the code could be correct, or could be a problem, depending on context only the developer has.

| ID | Finding | Why It's Ambiguous |
|----|---------|-------------------|
| **U1** | File-based storage with no database | Could be intentional for a small-group tool, or a pre-production placeholder. The Playwright single-worker constraint and in-memory rate limiter both depend on this being single-instance. |
| **U2** | No Next.js middleware.ts | Could be deliberate avoidance of middleware complexity, or an oversight. Per-route auth works but doesn't scale with route count. |
| **U3** | Security headers only at Caddy layer, not in Next.js | Works in production (Caddy), but dev/Docker environments have no security headers. Could be acceptable or could mean developers test without headers. |
| **U4** | `sendDefaultPii: true` in all Sentry configs | Could be intentional for debugging, or an oversight with compliance implications. |
| **U5** | `tracesSampleRate: 1` (100% tracing) | Could be acceptable for low-traffic self-hosted app, or a dev-time setting that wasn't adjusted for production. |
| **U6** | `core-rulebook.json.backup` in editions directory | Could be version control for hand-edited data, or accidental leftover. 388KB file committed to git. |
| **U7** | Migration scripts split between `/data/migrations/` and `/lib/migrations/` | Unclear which is the canonical location. `/data/` has one-off scripts, `/lib/` has the framework. |
| **U8** | Combat logic split across 3 directories (`lib/combat/`, `lib/rules/combat/`, `lib/rules/action-resolution/`) | Could be intentional layering (session state / rules / resolution) or organic sprawl. |
| **U9** | PROJECT_STATE.md last updated 2026-01-10 | **Confirmed stale.** Code verification found: augmentations are fully integrated (PROJECT_STATE said pending), combat is partially integrated with modal and controls (PROJECT_STATE said pending), magic display is integrated (PROJECT_STATE said pending). The document materially misrepresents current state. |
| **U10** | Issues #88-92 referenced as blockers | Can't verify status from code alone. Given that PROJECT_STATE.md is confirmed stale, these issue descriptions may also be outdated. What "UI integration" means has shifted — augmentations are done, combat is partially done, magic display is done. |

### D. Merely Rough or Unpolished

These are cosmetic or minor quality issues that don't affect correctness or completeness.

| ID | Finding | Notes |
|----|---------|-------|
| **R1** | `console.error` in auth routes instead of pino structured logging | 6+ locations in `/app/api/auth/`. Functional but inconsistent with the logging infrastructure already in place. |
| **R2** | Sentry DSN hardcoded in source files | Sentry DSNs are not secrets, but moving to env var is standard practice. |
| **R3** | No root-level `error.tsx` or `not-found.tsx` | Users see raw Next.js error pages on unhandled errors or 404s. |
| **R4** | In-memory rate limiter resets on restart | Acceptable for single-instance, but state is lost on every deploy. |
| **R5** | Coverage thresholds set to 30%/25% ("initial/permissive") | Not broken, but actual coverage unknown from code alone. |
| **R6** | E2E tests skip WebKit ("not installed") | 3 of 5 E2E tests have WebKit skips. Safari coverage gap. |
| **R7** | Sparse runtime data (1 character, 0 campaigns, test violations) | Suggests limited manual testing. Not broken — just untested at scale. |

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

U1 (file-based storage) ──constrains──▶ U2 (no middleware), R4 (rate limiter), I10 (CI E2E)
    Storage choice dictates single-instance, which makes middleware less critical
    and rate limiter acceptable, but also means E2E must run single-worker.

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

### Blocking Unknowns (must answer before major work)

| ID | Question | Risk if Unanswered | Why Blocking |
|----|----------|-------------------|--------------|
| **U1** | Is file-based storage the long-term choice? | Medium. If a database migration is planned, significant work on storage-dependent features (campaigns, multiplayer combat, rate limiting) would need to be rearchitected. | Affects whether to invest in fixing R4, scaling campaigns, or adding persistent rate limiting. |
| **U2** | Is the absence of middleware.ts intentional? | Medium. If every new route must manually call `getSession()`, B6-style auth gaps are likely to recur. | Determines whether fixing B6 is a one-off patch or a symptom of a structural gap. |
| **U10** | Are Issues #88-92 still the active work items? | Medium. If these issues are stale or superseded, the integration work (I1-I5) may have different requirements. | Determines the shape of all remaining integration work. |

### Deferrable Unknowns (can proceed without answering)

| ID | Question | Risk if Deferred | Why Deferrable |
|----|----------|-----------------|----------------|
| **U3** | Should security headers exist at the Next.js level? | Low. Production has headers via Caddy. Dev environments lack them, but this is standard for local dev. | Fix anytime. No downstream work depends on this. |
| **U4** | Is `sendDefaultPii: true` intentional? | Low-Medium. Privacy compliance risk exists but is bounded to Sentry data. | Can be flipped to `false` as a one-line change anytime. No code depends on it. |
| **U5** | Is 100% trace sampling intentional? | Low. Cost/performance concern only, no correctness impact. | Tunable at any time via config. |
| **U6** | What is `core-rulebook.json.backup`? | Very low. Takes up git space but has no runtime effect. | Can be gitignored or deleted anytime. |
| **U7** | Where should migration scripts live? | Low. Convention question. Both locations work. | Can be consolidated during any cleanup pass. |
| **U8** | Is the 3-directory combat split intentional? | Low. The code works regardless of organization. | Refactoring can happen independently. |
| **U9** | Is PROJECT_STATE.md still accurate? | Low. Documentation staleness doesn't affect code. | Update at any time. |
| **U12** | What's the actual test coverage? | Low. Code works regardless of measured coverage. | Run `pnpm test:coverage` to answer. |

---

## 4. Decision List

Decisions the developer needs to make before improvement work begins. Ordered by downstream impact.

### High-Impact Decisions (affect the most work)

| # | Decision | Options Observed in Code | What It Unblocks |
|---|----------|-------------------------|------------------|
| **D1** | What is the deployment model? Single-instance forever, or multi-instance eventually? | Code assumes single-instance (file storage, in-memory rate limiter, single-worker E2E). Portainer compose runs one container. | Determines whether to invest in database migration, Redis rate limiting, or middleware centralization. Affects B6, R4, U1, U2. |
| **D2** | Should the live bugs (B4 cyberlimb caps, B5 weapon mod capacity, B6 combat auth) be fixed before new feature work? | Code verification shows these aren't future blockers — they're wrong in production now. B4 shows wrong limits for non-human cyberlimbs. B5 lets users bypass weapon mod capacity. B6 allows unauthorized combat session access. | Determines immediate priority. These were previously categorized as blocking future work, but augmentations and combat are already shipped. |
| **D3** | Should auth be centralized in middleware, or remain per-route? | No middleware.ts exists. Auth is per-route via `getSession()`. | Determines whether B6 (combat auth bypass) gets a point fix or a structural solution. Affects all future routes. |
| **D4** | What is the scope of "interactive gameplay UI" for Matrix, Rigging, and Magic? | Code verification clarified: display components are already integrated for all three. What's missing is interactive session UIs — casting spells, jacking into the Matrix, managing drone operations during play. These are new features, not integration of existing components. | Determines the size of I1, I2, I4. (I3 retracted, I5 partially done.) |

### Medium-Impact Decisions

| # | Decision | What It Affects |
|---|----------|----------------|
| **D5** | Should the CI pipeline match the pre-commit hooks (add type-check, knip, format-check)? | I10. Straightforward to implement, but needs a yes/no. |
| **D6** | Is `sendDefaultPii: true` acceptable, or should it be turned off? | U4. One-line change, but needs a privacy stance. |
| **D7** | Should broken training-time functions (B1) be implemented, or should the advancement paths be gated in the UI to prevent users from reaching them? | B1. Two valid approaches: implement the calculations, or add guards that prevent users from triggering unimplemented paths. |
| **D8** | Should PROJECT_STATE.md be updated or retired? | Confirmed stale — augmentations listed as pending are actually complete, combat listed as pending is partially integrated. If kept, needs full rewrite. If retired, need an alternative source of truth. |
| **D8b** | Are Issues #88-92 still current, or have they been superseded? | Given PROJECT_STATE.md is confirmed wrong, these issue descriptions may also be outdated. If they describe "integrate display components into character page" — that's already done for augmentations, magic, rigging, and combat. Remaining work is interactive gameplay UIs. |

### Low-Impact Decisions (can be made anytime)

| # | Decision | What It Affects |
|---|----------|----------------|
| **D9** | Should `console.error` in auth routes be migrated to pino? | R1. Cosmetic but consistent. |
| **D10** | Should security headers be added at the Next.js level in addition to Caddy? | U3. Defense-in-depth question. |
| **D11** | Should `core-rulebook.json.backup` be removed or gitignored? | U6. Cleanup only. |
| **D12** | Should the migration script convention be formalized (one location)? | U7. Organizational only. |
| **D13** | Is WebKit/Safari E2E support a goal? | R6. Determines whether to install WebKit in CI. |
| **D14** | What Sentry trace sample rate is appropriate for production? | U5. Cost/performance tuning. |

---

## 5. Code Verification Results — PROJECT_STATE.md Corrections

The original audit relied on PROJECT_STATE.md claims for "Missing per PROJECT_STATE.md" items. Code verification against the actual source revealed PROJECT_STATE.md is materially inaccurate:

| Subsystem | PROJECT_STATE.md Said | Code Actually Shows | Verdict |
|-----------|----------------------|---------------------|---------|
| **Augmentations** | "Backend Complete, UI Pending Integration" (Issue #91) | `AugmentationsDisplay` fully integrated into character page with CRUD modals, wireless toggles, cyberlimb management, essence tracking. Editable when character is active. | **PROJECT_STATE wrong.** Augmentations are fully integrated. I3 retracted. |
| **Magic** | "Backend Complete, UI Pending Integration" (Issue #92) | All 5 magic display components render on character page (MagicSummary, Spells, AdeptPowers, ComplexForms, Foci) with dice roller integration. Missing: interactive gameplay (casting, drain tracking, spirit management, focus bonding). | **PROJECT_STATE partially wrong.** Display is done. Interactive gameplay is genuinely missing. |
| **Combat** | "Backend Complete, UI Pending Integration" (Issue #90) | CombatTrackerModal, QuickCombatControls, ActionPanel (CombatActionFlow), CombatDisplay, QuickNPCPanel all render on character page. CombatSessionContext active with polling. Two components (`ActionSelector`, `OpposedTestResolver`) are built but orphaned. | **PROJECT_STATE partially wrong.** Combat is substantially integrated. Orphaned components and no standalone page remain. |
| **Rigging** | "Backend Complete, UI Pending Integration" (Issue #89) | `RiggingSessionContext` mounted. 5 display components render as collapsible cards with some interactivity (slaving, jump-in, autosoft sharing). No dedicated session page. | **PROJECT_STATE partially wrong.** Display with basic interactivity is done. Dedicated session workflow missing. |
| **Matrix** | "Backend Complete, UI Pending Integration" (Issue #88) | `MatrixSessionContext` is implemented and mounted but **no component calls its action methods**. 5 display components render read-only. No interactive Matrix UI exists. | **PROJECT_STATE correct.** Matrix interactive UI is genuinely missing. |
| **Initiative** | "Initiative dice from cyberware/powers not integrated" | `QuickCombatControls.tsx:46-53` has hardcoded `return 1` with TODO. But `CombatQuickReference.tsx:73-99` correctly integrates wireless bonuses via `calculateWirelessBonuses()`. | **Partially wrong.** One component is broken, the other is correct. Inconsistency, not a system-wide gap. |

### Impact on Prioritization

This verification shifts three findings from "future blocker" to "live bug":
- **B4** (cyberlimb caps): Affects the already-integrated AugmentationsDisplay — wrong limits shown now
- **B5** (weapon mod capacity): Affects already-functional weapon customization — limits unenforced now
- **B6** (combat auth): Affects the already-integrated combat modal — exploitable now

And removes one finding entirely:
- **I3** (augmentation integration): Retracted — work is done

---

*End of analysis. This document maps findings — it does not propose solutions.*
