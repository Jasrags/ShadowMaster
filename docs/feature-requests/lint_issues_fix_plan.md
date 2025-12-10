# Lint Issues Fix Plan

Prioritized plan to address lint issues. **Current Status: 71 warnings** (down from 84, 13 fixed ✅)

**Last Updated:** 2025-01-10

## Progress Overview

- **Total Issues:** 71 warnings
- **Fixed:** 13 issues (H1, L2, H3, H2, H4, M2)
- **Remaining:** 58 warnings
- **Completion:** 15.5%

**Quick Stats:**
- ✅ High Priority Fixed: 5/5 (H1, L2, H3, H2, H4) - **ALL HIGH PRIORITY COMPLETE!**
- ✅ Medium Priority Fixed: 1/2 (M2)
- ⏳ Medium Priority Remaining: 1/2 (M1)
- ⏳ Low Priority: 0/2 fixed
- ⏳ Medium Priority: 0/2 fixed
- ⏳ Low Priority: 0/2 fixed

## Issue Summary

| Rule | Count | Severity | Priority | Status |
|------|-------|----------|----------|--------|
| `@typescript-eslint/no-unused-vars` | 39 | Warning | Low | ⏳ Pending |
| `react-hooks/exhaustive-deps` | 20 | Warning | Medium | ⏳ Pending |
| `@next/next/no-assign-module-variable` | 0 | Warning | High | ✅ **FIXED** |
| `react-hooks/preserve-manual-memoization` | 0 | Warning | Medium | ✅ **FIXED** |
| `react-hooks/error-boundaries` | 0 | Warning | High | ✅ **FIXED** |
| `react-hooks/set-state-in-effect` | 0 | Warning | High | ✅ **FIXED** |
| `react/no-unescaped-entities` | 0 | Warning | Low | ✅ **FIXED** |

## High Priority (Recommended First)

### H1. Next.js Module Variable Assignment ✅ **COMPLETED**

**File:** `lib/rules/loader.ts`

**Problem:** Using `module` as a variable name shadows Node's module system.

**Fix:** Rename `module` variable to `ruleModule` or `loadedModule` throughout the file.

**Status:** ✅ Fixed - No more `module =` assignments found in loader.ts  
**Effort:** ~15 min | **Risk:** Low

---

### H2. Error Boundaries Pattern ✅ **COMPLETED**

**File:** `app/users/page.tsx`

**Problem:** JSX constructed inside try/catch blocks - React errors won't be caught.

**Fix:** 
- Moved server-side error handling (auth, data fetching) before JSX construction
- Created `ErrorBoundary` component for client-side React errors
- Wrapped `UserTable` in `ErrorBoundary` to catch rendering errors

**Status:** ✅ Fixed - All 5 error-boundaries issues resolved. Server errors handled before JSX, client errors caught by ErrorBoundary  
**Effort:** ~20 min | **Risk:** Medium

---

### H3. setState in useEffect ✅ **COMPLETED**

**File:** `app/users/UserEditModal.tsx`

**Problem:** Calling setState synchronously in useEffect causes cascading renders.

**Fix:** Removed useEffect entirely, added `key={user.id}` prop to ModalOverlay to trigger remount when user changes.

**Status:** ✅ Fixed - Component now remounts with fresh state when user changes, eliminating need for useEffect  
**Effort:** ~10 min | **Risk:** Low

---

### H4. Configure Next.js Build Cache for CI ✅ **COMPLETED**

**Warning:** No build cache found. Please configure build caching for faster rebuilds.

**Problem:** CI builds don't persist Next.js cache between runs, causing full rebuilds every time.

**Fix:** Add cache step to CI workflow for `.next/cache`:

```yaml
- name: Cache Next.js build
  uses: actions/cache@v4
  with:
    path: .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ hashFiles('**/*.ts', '**/*.tsx') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-
```

**Status:** ✅ Fixed - Cache configuration already present in `.github/workflows/ci.yml` (lines 34-40)  
**Effort:** ~5 min | **Risk:** None

## Medium Priority

### M1. Hook Exhaustive Dependencies (20 issues)

**Files:** Multiple components in `app/characters/create/components/steps/`

**Problem:** Missing or unstable dependencies in `useMemo`/`useCallback` hooks.

**Fix:**
- Add missing dependencies
- Wrap unstable values in `useMemo` before using as dependencies
- Use `useCallback` for function dependencies

**Effort:** ~1-2 hours | **Risk:** Medium (may affect memoization behavior)

---

### M2. Preserve Manual Memoization ✅ **COMPLETED**

**Files:** `RulesetContext.tsx`, `SkillsStep.tsx`

**Problem:** React Compiler can't preserve existing `useMemo` because inferred deps don't match source.

**Fix:** 
- **SkillsStep.tsx:** Changed dependency from `state.priorities?.magic` to `state.priorities` (whole object)
- **RulesetContext.tsx (useCyberware):** Changed from individual `options` properties to `options` (whole object)
- **RulesetContext.tsx (useBioware):** Changed from individual `options` properties to `options` (whole object)

**Status:** ✅ Fixed - All 5 preserve-manual-memoization issues resolved. Dependency arrays now match React Compiler inference.  
**Effort:** ~30 min | **Risk:** Low

**Testing Guide:** See `docs/testing/memoization-fix-testing-guide.md` for comprehensive testing checklist.

## Low Priority (Clean Up)

### L1. Unused Variables (39 issues)

**Files:** Multiple throughout codebase

**Problem:** Defined variables/imports not being used.

**Categories:**
- Unused imports (remove them)
- Unused function parameters (prefix with `_`)
- Unused assigned variables (remove or use)

**Fix:**

```bash
# Many can be auto-fixed
pnpm lint --fix
# For remaining, manually review and remove/prefix.
```

**Effort:** ~30-45 min | **Risk:** Very Low

---

### L2. Unescaped Entities ✅ **COMPLETED**

**File:** `app/signin/page.tsx`

**Problem:** Apostrophe `'` needs escaping in JSX.

**Fix:** Replace `'` with `&apos;` or use template literals.

**Status:** ✅ Fixed - Apostrophe now properly escaped as `&apos;` in signin page  
**Effort:** ~2 min | **Risk:** None

## Recommended Order

1. ✅ **L2** - Unescaped entities (2 min, trivial) - **COMPLETED**
2. ✅ **H4** - Configure build cache for CI (5 min, immediate CI speedup) - **COMPLETED**
3. ✅ **H1** - Module variable rename (15 min, high impact) - **COMPLETED**
4. ✅ **H3** - setState in effect (10 min, fixes anti-pattern) - **COMPLETED**
5. ✅ **H2** - Error boundaries (20 min, proper React patterns) - **COMPLETED**
6. ⏳ **L1** - Run `pnpm lint --fix` for auto-fixable issues - **NEXT**
7. ✅ **M2** - Memoization preservation (30 min) - **COMPLETED**
8. ⏳ **M1** - Hook dependencies (1-2 hours, most complex) - **NEXT**

**Progress Summary:**
- ✅ Completed: 6 issues (H1, L2, H3, H2, H4, M2) - **ALL HIGH PRIORITY + 1 MEDIUM DONE!**
- ⏳ Remaining: 58 warnings
- 📊 Completion: 15.5% (13/84)

## After Fixes

Once all issues are resolved:

1. Remove rule overrides from `eslint.config.mjs`
2. Update CI workflow to `pnpm lint` without `--max-warnings`
3. Enable lint as blocking check

## Quick Win Commands

```bash
# Auto-fix what's possible
pnpm lint --fix

# Find specific issues by rule
pnpm lint 2>&1 | grep "no-unused-vars"

# Check progress
pnpm lint 2>&1 | tail -5
```
