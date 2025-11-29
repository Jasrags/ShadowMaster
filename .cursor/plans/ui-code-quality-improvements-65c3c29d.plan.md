<!-- 65c3c29d-eaed-4a87-af56-b72b4616fc70 161cada9-9f5c-4505-b763-f7ee3e75a0e0 -->
# UI Code Quality Improvements

## Overview

Fix console statements, replace `any` types with proper TypeScript types, resolve React Hook dependency issues, and improve overall code quality across the UI codebase.

## Issues to Address

### 1. Remove/Replace Console Statements

**Files affected:**

- `web/ui/src/components/characters/CharacterTable.tsx:34` - Remove debug `console.log`
- `web/ui/src/components/character/steps/Step3MagicResonance.tsx` - Replace `console.error` with proper error handling
- `web/ui/src/components/character/steps/Step4Qualities.tsx:43,91` - Replace `console.error` and remove `console.log`
- `web/ui/src/components/character/steps/Step5Skills.tsx:45` - Replace `console.error`
- `web/ui/src/components/character/steps/Step1Concept.tsx:43,119,143` - Replace `console.error` calls
- `web/ui/src/components/character/PrioritySelector.tsx:72` - Replace `console.warn`
- `web/ui/src/pages/WeaponsPage.tsx:35` - Replace `console.error`
- `web/ui/src/components/campaigns/CampaignViewModal.tsx:87` - Replace `console.error`
- `web/ui/src/components/campaigns/CampaignEditModal.tsx:185` - Replace `console.error`
- `web/ui/src/components/character/CharacterCreationWizard.tsx:98` - Replace `console.error`

**Action:** Remove debug `console.log` statements. Replace `console.error`/`console.warn` with toast notifications or a logging utility that uses the existing `ToastContext`.

### 2. Replace TypeScript `any` Types

**Files affected:**

- `web/ui/src/components/character/CharacterCreationWizard.tsx:49-50` - `equipment?: any[]` and `karmaSpending?: any`
- `web/ui/src/lib/types.ts:1314,1322-1324` - `gear: any[]`, `focuses: any[]`, `spirits: any[]`, `adept_powers: any[]` in `CharacterSR5` interface
- `web/ui/src/components/character/EquipmentSelector.tsx:5` - `onSelect: (equipment: any) => void`

**Action:**

- Define proper types for equipment items (likely `Gear[]` or a union type)
- Define type for karma spending structure
- Define types for focuses, spirits, and adept powers based on existing type definitions
- Update all usages to use the new types

### 3. Fix React Hook Dependencies

**Files affected:**

- `web/ui/src/components/character/steps/Step3MagicResonance.tsx:164,224,363,431` - 4 `eslint-disable-next-line react-hooks/exhaustive-deps` comments
- `web/ui/src/components/character/steps/Step1Concept.tsx:30` - 1 `eslint-disable-next-line react-hooks/exhaustive-deps` comment

**Action:** Review each `useEffect` hook and either:

- Add missing dependencies to dependency arrays
- Extract functions outside the component or wrap with `useCallback`
- Use refs for values that shouldn't trigger re-renders
- Remove disable comments once dependencies are correct

### 4. Address TODO Comment

**File affected:**

- `web/ui/src/components/characters/CharacterTable.tsx:33` - TODO for character view page navigation

**Action:** Either implement the navigation (if character view page exists) or document the plan in a GitHub issue/ticket and remove the TODO.

### 5. Context Export ESLint Disables

**Files affected:**

- `web/ui/src/contexts/ToastContext.tsx:154` - `react-refresh/only-export-components` disable
- `web/ui/src/contexts/AuthContext.tsx:69` - `react-refresh/only-export-components` disable

**Action:** Review if these disables are necessary. If contexts need to export non-component values, consider restructuring or updating ESLint config to allow these patterns.

## Implementation Order

1. **Phase 1: Type Safety** - Replace `any` types (enables better IDE support and catches errors)
2. **Phase 2: Error Handling** - Replace console statements with proper error handling
3. **Phase 3: React Hooks** - Fix dependency arrays and remove ESLint disables
4. **Phase 4: Cleanup** - Address TODO and review context exports

## Notes

- All error handling should leverage the existing `ToastContext` for user-facing errors
- Type definitions should be added to `web/ui/src/lib/types.ts`
- Test each change to ensure functionality is preserved
- Consider adding ESLint rules to prevent future `any` usage and console statements in production builds

### To-dos

- [ ] Replace all `any` types with proper TypeScript types in CharacterCreationWizard, types.ts, and EquipmentSelector
- [ ] Remove all debug console.log statements from CharacterTable and Step4Qualities
- [ ] Replace console.error and console.warn calls with ToastContext error notifications in all affected files
- [ ] Fix React Hook dependencies in Step3MagicResonance and Step1Concept, remove ESLint disable comments
- [ ] Implement or document character view navigation in CharacterTable
- [ ] Review and potentially fix ESLint disables in ToastContext and AuthContext