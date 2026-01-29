# Code Coverage Gap Analysis

**Generated:** 2026-01-29
**Coverage Tool:** Vitest 4.0.18 with @vitest/coverage-v8

---

## Executive Summary

| Metric     | Current | Target | Status |
| ---------- | ------- | ------ | ------ |
| Statements | 55.28%  | 60%    | Below  |
| Branches   | 41.53%  | 50%    | Below  |
| Functions  | 43.18%  | 50%    | Below  |
| Lines      | 56.77%  | 60%    | Below  |

**Total Files Analyzed:** 249 test files covering the codebase

---

## Coverage by Directory

### High Coverage (>80%) - Well Tested

| Directory                     | Statements | Branches | Functions | Lines  |
| ----------------------------- | ---------- | -------- | --------- | ------ |
| `lib/rules/matrix`            | 96.77%     | 88.88%   | 99.26%    | 96.60% |
| `lib/security`                | 96.77%     | 90.00%   | 85.71%    | 96.77% |
| `lib/email`                   | 95.04%     | 90.00%   | 100%      | 94.84% |
| `lib/rules/advancement`       | 93.15%     | 83.27%   | 97.95%    | 93.12% |
| `lib/rules/sync`              | 93.17%     | 84.00%   | 98.21%    | 93.44% |
| `lib/rules/rigging`           | 92.97%     | 78.46%   | 98.91%    | 92.71% |
| `lib/rules/character`         | 93.93%     | 87.20%   | 100%      | 96.49% |
| `lib/rules/inventory`         | 98.97%     | 75.64%   | 100%      | 98.90% |
| `lib/rules/encumbrance`       | 91.11%     | 73.91%   | 87.50%    | 90.69% |
| `lib/rules/magic`             | 87.52%     | 72.59%   | 93.54%    | 87.35% |
| `lib/rules/gear`              | 86.34%     | 80.31%   | 79.41%    | 89.07% |
| `lib/rules/action-resolution` | 84.74%     | 67.53%   | 93.52%    | 84.65% |
| `lib/rules/qualities`         | 83.59%     | 70.42%   | 97.18%    | 84.27% |
| `lib/rules/augmentations`     | 81.12%     | 60.18%   | 82.63%    | 81.67% |
| `lib/rules/skills`            | 100%       | 100%     | 100%      | 100%   |
| `lib/rules/wireless`          | 100%       | 90.76%   | 100%      | 100%   |
| `lib/rules/modifications`     | 100%       | 94.64%   | 100%      | 100%   |

### Moderate Coverage (50-80%) - Needs Improvement

| Directory                            | Statements | Branches | Functions | Lines  |
| ------------------------------------ | ---------- | -------- | --------- | ------ |
| `lib/storage`                        | 72.04%     | 59.67%   | 77.27%    | 73.12% |
| `lib/auth`                           | 70.83%     | 62.74%   | 68.51%    | 70.68% |
| `lib/logging`                        | 65.00%     | 40.00%   | 55.55%    | 64.10% |
| `lib/combat`                         | 56.65%     | 41.66%   | 58.82%    | 55.72% |
| `lib/rules/action-resolution/combat` | 76.62%     | 73.92%   | 76.00%    | 76.66% |

### Low Coverage (<50%) - Critical Gaps

| Directory                           | Statements | Branches | Functions | Lines  |
| ----------------------------------- | ---------- | -------- | --------- | ------ |
| `lib/contexts`                      | 35.89%     | 37.19%   | 9.33%     | 38.32% |
| `lib/rules` (root)                  | 19.38%     | 17.25%   | 16.66%    | 20.48% |
| `lib/env`                           | 17.24%     | 45.00%   | 33.33%    | 17.24% |
| `lib/migrations`                    | 0%         | 0%       | 0%        | 0%     |
| `components/*`                      | 0%         | 0%       | 0%        | 0%     |
| `lib/rules/qualities/dynamic-state` | 54.67%     | 34.14%   | 77.77%    | 54.67% |

### API Routes

| Directory           | Statements | Branches | Functions | Lines  |
| ------------------- | ---------- | -------- | --------- | ------ |
| `app/api/auth/me`   | 100%       | 100%     | 100%      | 100%   |
| `app/api/campaigns` | 100%       | 96.96%   | 100%      | 100%   |
| `app/api/combat`    | 100%       | 100%     | 100%      | 100%   |
| `app/api/editions`  | 100%       | 100%     | 100%      | 100%   |
| `app/api/health`    | 100%       | 100%     | 100%      | 100%   |
| `app/api/users`     | 84.78%     | 66.66%   | 100%      | 84.78% |

---

## Zero Coverage Files (Critical)

### API Routes (Missing Tests)

| File                                            | Lines |
| ----------------------------------------------- | ----- |
| `app/api/auth/forgot-password/route.ts`         | 18-95 |
| `app/api/auth/reset-password/route.ts`          | 24-91 |
| `app/api/auth/reset-password/validate/route.ts` | 21-46 |

### Core Library Files

| File                                | Lines    | Impact                 |
| ----------------------------------- | -------- | ---------------------- |
| `lib/migrations/gear-state.ts`      | 61-426   | Data migration         |
| `lib/rules/RulesetContext.tsx`      | 654-2524 | Core ruleset provider  |
| `lib/rules/character-validation.ts` | 75-1053  | Character validation   |
| `lib/rules/contact-network.ts`      | 47-487   | Contact system         |
| `lib/rules/contacts.ts`             | 31-574   | Contact management     |
| `lib/rules/favors.ts`               | 47-495   | Favor economy          |
| `lib/rules/grunts.ts`               | 55-807   | NPC/grunt system       |
| `lib/rules/special-actions.ts`      | 30-605   | Special combat actions |
| `lib/contexts/SidebarContext.tsx`   | 38-157   | UI context             |

### Email Transports

| File                             | Lines  | Impact           |
| -------------------------------- | ------ | ---------------- |
| `lib/email/transports/resend.ts` | 21-143 | Production email |
| `lib/email/transports/smtp.ts`   | 17-119 | SMTP fallback    |

### Components (All Zero Coverage)

The entire `components/` directory has no test coverage. Key untested areas:

**Character Creation Cards:**

- `AttributesCard.tsx`, `SkillsCard.tsx`, `SpellsCard.tsx`
- `AugmentationsCard.tsx`, `VehiclesCard.tsx`, `WeaponsPanel.tsx`
- `ComplexFormsCard.tsx`, `AdeptPowersCard.tsx`, `GearTabsCard.tsx`

**Character Display:**

- `MatrixSummary.tsx`, `RiggingSummary.tsx`, `MagicSummary.tsx`
- `Spellbook.tsx`, `AdeptPowerList.tsx`, `ProgramManager.tsx`

**Combat/Actions:**

- `ActionPoolBuilder.tsx`, `ActionHistory.tsx`, `EdgeTracker.tsx`
- `DiceRoller.tsx`, `EssenceDisplay.tsx`

**UI Infrastructure:**

- `NotificationBell.tsx`, `ThemeProvider.tsx`, `ErrorBoundary.tsx`
- `EmailVerificationBanner.tsx`

---

## Storage Layer Analysis

| File                     | Statements | Priority         |
| ------------------------ | ---------- | ---------------- |
| `characters.ts`          | 39.70%     | High - Core data |
| `users.ts`               | 45.63%     | High - Auth data |
| `locations.ts`           | 50.69%     | Medium           |
| `verification-record.ts` | 46.15%     | Medium           |
| `contacts.ts`            | 71.04%     | Low              |
| `campaigns.ts`           | 75.71%     | Low              |
| `combat.ts`              | 91.24%     | Good             |
| `editions.ts`            | 90.00%     | Good             |
| `audit.ts`               | 97.87%     | Excellent        |
| `favor-ledger.ts`        | 98.26%     | Excellent        |

---

## Priority Recommendations

### Tier 1: Security Critical (Target: 90%+)

1. **`lib/security/`** - Already at 96.77%, maintain
2. **`lib/auth/`** - Currently 70.83%, increase to 90%+
   - Focus on password reset flows
   - Magic link verification paths
   - Session management edge cases

### Tier 2: Data Integrity (Target: 80%+)

1. **`lib/storage/characters.ts`** - 39.70% → 80%
   - Character CRUD operations
   - Draft management
   - State transitions
2. **`lib/storage/users.ts`** - 45.63% → 80%
   - User lifecycle
   - Account lockout scenarios
3. **`lib/migrations/`** - 0% → 70%
   - Critical for data upgrades

### Tier 3: Core Game Logic (Target: 70%+)

1. **`lib/rules/grunts.ts`** - 0% → 70%
   - NPC generation
   - Template application
2. **`lib/rules/contacts.ts`** - 0% → 70%
   - Contact management
   - Network calculations
3. **`lib/rules/favors.ts`** - 0% → 70%
   - Favor economy
   - Balance tracking
4. **`lib/rules/character-validation.ts`** - 0% → 70%
   - Validation rules
   - Error messaging

### Tier 4: API Routes (Target: 80%+)

1. **Password reset routes** - 0% → 80%
   - `forgot-password/route.ts`
   - `reset-password/route.ts`
   - `reset-password/validate/route.ts`

### Tier 5: Components (Target: 30%+)

Components have 0% coverage. Focus on:

1. **Error boundaries** - User-facing error handling
2. **Form validation** - Input validation logic
3. **State management hooks** - Complex state logic

---

## Test File Gaps

Files in `lib/` without corresponding test files:

```
lib/contexts/SidebarContext.tsx
lib/migrations/gear-state.ts
lib/rules/contact-network.ts
lib/rules/contacts.ts
lib/rules/favors.ts
lib/rules/grunts.ts
lib/rules/special-actions.ts
lib/rules/character-validation.ts
lib/email/transports/resend.ts
lib/email/transports/smtp.ts
```

---

## Coverage Configuration

Current thresholds in `vitest.config.ts`:

```typescript
thresholds: {
  lines: 30,
  functions: 30,
  branches: 25,
  statements: 30,
}
```

**Recommended progression:**

| Phase        | Lines | Functions | Branches | Statements |
| ------------ | ----- | --------- | -------- | ---------- |
| Current      | 30%   | 30%       | 25%      | 30%        |
| Phase 1 (Q1) | 50%   | 45%       | 40%      | 50%        |
| Phase 2 (Q2) | 60%   | 55%       | 50%      | 60%        |
| Phase 3 (Q3) | 70%   | 65%       | 60%      | 70%        |

---

## Next Steps

1. **Immediate:** Add tests for password reset API routes
2. **Short-term:** Increase `lib/storage/characters.ts` coverage
3. **Medium-term:** Add test files for zero-coverage lib modules
4. **Long-term:** Establish component testing infrastructure

---

## Commands

```bash
# Run coverage
pnpm test:coverage

# Watch mode with coverage
pnpm test:coverage:watch

# Interactive UI
pnpm test:coverage:ui

# View HTML report
open coverage/index.html
```
