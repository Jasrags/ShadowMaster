# Testing Guide: Memoization Fixes (M2)

## Overview
This guide helps you verify that memoization fixes haven't broken functionality or caused performance regressions.

## What Was Fixed

### 1. SkillsStep.tsx - `availableFreeSkills` useMemo
**Change:** Dependency array changed from `[priorityTable, state.priorities?.magic, magicPath]` to `[priorityTable, state.priorities, magicPath]`

**Why:** React Compiler infers `state.priorities` (the whole object) rather than the specific property `state.priorities?.magic`.

### 2. RulesetContext.tsx - `useCyberware` hook
**Change:** Dependency array changed from individual `options` properties to `[data.cyberware, options]`

**Why:** React Compiler infers `options` (the whole object) rather than individual properties.

### 3. RulesetContext.tsx - `useBioware` hook
**Change:** Dependency array changed from individual `options` properties to `[data.bioware, options]`

**Why:** Same as useCyberware - compiler infers the whole `options` object.

## Testing Checklist

### 1. Build Verification
```bash
# Ensure the app still builds
pnpm build

# Check for TypeScript errors
pnpm type-check  # if available, or check build output
```

### 2. Lint Verification
```bash
# Verify the preserve-manual-memoization warnings are gone
pnpm lint 2>&1 | grep "preserve-manual-memoization"
# Should return 0 results
```

### 3. Functional Testing - Skills Step

**Test Case 1: Free Skills Calculation**
1. Navigate to `/characters/create`
2. Select SR5 edition
3. Complete Priority step:
   - Set Magic priority (e.g., Priority A for Magician)
   - Select a magical path (e.g., "Magician")
4. Navigate to Skills step
5. **Verify:** Free skills from priority table are correctly displayed
6. **Verify:** Free skill allocations work correctly
7. Change magic priority or path
8. **Verify:** Free skills update correctly

**Test Case 2: Priority Changes**
1. In Skills step, note the available free skills
2. Go back to Priority step
3. Change Magic priority (e.g., from A to B)
4. Return to Skills step
5. **Verify:** Free skills update to match new priority
6. **Verify:** Previously allocated free skills are cleared/reset appropriately

**Test Case 3: Path Changes**
1. In Skills step with a magical character
2. Go back to Magic step
3. Change magical path (e.g., from Magician to Mystic Adept)
4. Return to Skills step
5. **Verify:** Free skills update to match new path

### 4. Functional Testing - Cyberware/Bioware Hooks

**Test Case 1: Cyberware Filtering**
1. Navigate to `/characters/create`
2. Complete steps to reach Augmentations step
3. **Verify:** Cyberware catalog loads correctly
4. Filter by category (e.g., "headware")
5. **Verify:** Only items in that category are shown
6. Change max availability filter
7. **Verify:** Filter updates correctly
8. Toggle "Exclude Forbidden" or "Exclude Restricted"
9. **Verify:** Filtering works correctly

**Test Case 2: Bioware Filtering**
1. In Augmentations step, switch to Bioware tab
2. **Verify:** Bioware catalog loads correctly
3. Apply same filters as cyberware test
4. **Verify:** All filters work correctly

**Test Case 3: Options Object Stability**
1. In Augmentations step, apply filters
2. Navigate away and back
3. **Verify:** Filters persist correctly
4. **Verify:** No unnecessary re-renders (check React DevTools Profiler)

### 5. Performance Testing

**Using React DevTools Profiler:**

1. Open React DevTools → Profiler tab
2. Start recording
3. Perform actions that trigger the memoized hooks:
   - Change priorities in Skills step
   - Filter cyberware/bioware
   - Navigate between steps
4. Stop recording
5. **Verify:** 
   - `availableFreeSkills` only recalculates when `priorityTable`, `state.priorities`, or `magicPath` change
   - `useCyberware`/`useBioware` only recalculate when `data.cyberware`/`data.bioware` or `options` change
   - No unnecessary re-renders of child components

**Manual Performance Check:**
1. Open browser DevTools → Console
2. Add temporary logging to memoized functions:
   ```typescript
   console.log('availableFreeSkills recalculated', { priorityTable, priorities: state.priorities, magicPath });
   ```
3. Perform actions and verify logs only appear when dependencies actually change

### 6. Edge Cases

**Test Case 1: Missing Priorities**
1. Start character creation
2. Skip Priority step (if possible) or use incomplete priorities
3. Navigate to Skills step
4. **Verify:** No errors, free skills show empty array correctly

**Test Case 2: Null/Undefined Options**
1. In Augmentations step
2. Use hooks without options: `useCyberware()` and `useBioware()`
3. **Verify:** Full catalogs are returned (no filtering)
4. **Verify:** No errors or warnings

**Test Case 3: Rapid Changes**
1. Quickly change priorities multiple times
2. Quickly toggle filters in Augmentations step
3. **Verify:** No race conditions or stale data
4. **Verify:** Final state is correct

### 7. Integration Testing

**Full Character Creation Flow:**
1. Create a new character from start to finish
2. Use all affected features:
   - Set priorities with magic
   - Allocate free skills
   - Filter and select cyberware
   - Filter and select bioware
3. **Verify:** Character saves correctly
4. **Verify:** Character sheet displays correctly
5. **Verify:** All data is accurate

## Red Flags to Watch For

### Performance Issues
- **Symptom:** UI feels sluggish, especially when changing priorities or filters
- **Check:** React DevTools Profiler for excessive re-renders
- **Fix:** May need to memoize `options` object in parent components

### Stale Data
- **Symptom:** Free skills or filtered items don't update when dependencies change
- **Check:** Verify dependency arrays include all used values
- **Fix:** May need to add missing dependencies

### Type Errors
- **Symptom:** TypeScript errors about undefined/null access
- **Check:** Ensure optional chaining (`?.`) is used correctly
- **Fix:** Add proper null checks

### Incorrect Filtering
- **Symptom:** Cyberware/Bioware filters don't work correctly
- **Check:** Verify `options` object is being compared correctly
- **Fix:** May need to use deep equality check or normalize options

## Quick Verification Commands

```bash
# Check lint status
pnpm lint 2>&1 | grep -E "(preserve-manual-memoization|error)" | head -20

# Build check
pnpm build 2>&1 | tail -10

# Type check (if available)
pnpm type-check 2>&1 | tail -10
```

## Success Criteria

✅ All lint warnings for `preserve-manual-memoization` are resolved  
✅ App builds without errors  
✅ Free skills calculation works correctly  
✅ Cyberware/Bioware filtering works correctly  
✅ No performance regressions (no excessive re-renders)  
✅ Full character creation flow works end-to-end  
✅ No console errors or warnings in browser DevTools

## If Something Breaks

1. **Revert the change** to the specific hook
2. **Check React DevTools** to see what dependencies are actually changing
3. **Add console.log** to see when memoized values recalculate
4. **Consider using `useMemo` for the options object** in parent components if it's being recreated on every render
5. **Use React DevTools Profiler** to identify performance issues

## Notes

- The dependency array changes align with React Compiler's inference, which should improve optimization
- Using the whole `options` object instead of individual properties is safe because:
  - Options are typically passed as stable object references from parent components
  - If options change, we want to recalculate anyway
  - This matches React Compiler's optimization strategy

