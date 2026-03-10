# ShadowMaster Audit Analysis — Prioritization, Dependencies, Unknowns, Decisions

**Date:** 2026-03-10
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
| **B7** | Initiative calculation ignores cyberware/powers/spells | `app/api/combat/quick-start/route.ts:140`, `QuickCombatControls.tsx:51` | Augmented characters get wrong initiative values |

### B. Incomplete but Not Broken

These are known gaps that don't produce incorrect behavior — the features are either absent or safely gated.

| ID | Finding | Location | Notes |
|----|---------|----------|-------|
| **I1** | Matrix UI integration pending | Issue #88 | Backend + sheet displays exist; dedicated interactive UI missing |
| **I2** | Rigging UI integration pending | Issue #89 | Same pattern as Matrix |
| **I3** | Augmentation UI integration pending | Issue #91 | Same pattern as Matrix |
| **I4** | Magic/Technomancer UI integration pending | Issue #92 | Same pattern as Matrix |
| **I5** | Combat tracker page integration pending | Issue #90 | UI components exist but not wired into a dedicated page |
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
| **U9** | PROJECT_STATE.md last updated 2026-01-10 | 2 months stale. Unclear if declared feature states still match reality. |
| **U10** | Issues #88-92 referenced as blockers | Can't verify status from code alone. Could be closed, could be stale. |

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
B1 (training throws) ──blocks──▶ I4 (magic UI integration)
    Training time calculations crash for spell/complex-form/focus/initiation.
    Can't ship magic advancement UI if these paths throw.

B2, B3 (drain stubs) ──blocks──▶ I4 (magic UI integration)
    Drain values are wrong. Any magic UI exposing drain would show incorrect data.

B4 (cyberlimb maximums) ──blocks──▶ I3 (augmentation UI integration)
    Cyberlimb attribute caps are wrong for non-humans. UI would enforce wrong limits.

B5 (weapon mod capacity) ──blocks──▶ Full weapon customization use
    Not tied to a specific integration issue, but mod capacity is unenforced.

B6 (combat auth bypass) ──blocks──▶ I5 (combat page integration)
    Should not ship a dedicated combat page with an authorization hole.

B7 (initiative ignores augments) ──blocks──▶ I5 (combat page integration)
    Combat tracker would show wrong initiative for augmented characters.

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

### Critical Chain

The longest dependency chain that blocks the most downstream work:

```
B1/B2/B3 (broken magic/training) ──▶ I4 (magic UI) ──▶ full gameplay loop
B4 (cyberlimb caps) ──▶ I3 (augmentation UI) ──▶ full gameplay loop
B6 + B7 (combat auth + initiative) ──▶ I5 (combat page) ──▶ full gameplay loop
```

All four "backend complete, UI pending" integrations (I1-I4) and combat (I5) are blocked by broken calculations in category A.

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
| **D2** | Are the "backend complete, UI pending" features (Matrix, Rigging, Augmentations, Magic) next, or are there higher priorities? | Issues #88-92 exist. PROJECT_STATE.md lists these as the next integration phase. | Determines whether the A-category bugs (B1-B5) are urgent (block upcoming UI work) or dormant (features not being integrated yet). |
| **D3** | Should auth be centralized in middleware, or remain per-route? | No middleware.ts exists. Auth is per-route via `getSession()`. | Determines whether B6 (combat auth bypass) gets a point fix or a structural solution. Affects all future routes. |
| **D4** | What is the scope of "UI integration" for each pending subsystem? | Sheet display components exist. What's missing could be: dedicated pages, modal workflows, interactive session UIs, or just wiring existing components to the character page. | Determines the size and shape of I1-I5. |

### Medium-Impact Decisions

| # | Decision | What It Affects |
|---|----------|----------------|
| **D5** | Should the CI pipeline match the pre-commit hooks (add type-check, knip, format-check)? | I10. Straightforward to implement, but needs a yes/no. |
| **D6** | Is `sendDefaultPii: true` acceptable, or should it be turned off? | U4. One-line change, but needs a privacy stance. |
| **D7** | Should broken training-time functions (B1) be implemented, or should the advancement paths be gated in the UI to prevent users from reaching them? | B1. Two valid approaches: implement the calculations, or add guards that prevent users from triggering unimplemented paths. |
| **D8** | Are Issues #88-92 still current, or have they been superseded? | U10, I1-I5. If superseded, the integration work may look different. |

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

*End of analysis. This document maps findings — it does not propose solutions.*
