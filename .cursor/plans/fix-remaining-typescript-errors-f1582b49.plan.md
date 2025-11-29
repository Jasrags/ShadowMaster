<!-- f1582b49-28cf-4b38-803c-bb933122ddab 13cf61ec-03da-4899-bc7b-07d79b828f82 -->
# Fix Remaining TypeScript Errors

## Overview

Fix all remaining TypeScript compilation errors to enable successful builds. Errors are categorized and will be addressed systematically.

## Error Categories

### 1. ReactNode Type Errors (TS2322)

**Files affected:**

- `web/ui/src/components/armor/ArmorViewModal.tsx` (lines 137, 162, 175, 188, 193, 205, 211, 217, 223, 438, 463)
- `web/ui/src/components/weapon/WeaponAccessoryViewModal.tsx` (lines 614, 650, 739, 740)

**Issues:**

- Remaining `String()` calls in JSX that return `unknown` type
- Conditional expressions with `unknown` values that TypeScript can't infer as ReactNode

**Fix approach:**

- Replace remaining `String()` calls with `toReactNode()` helper
- Change `&&` conditionals to `!= null` checks for better type inference
- Ensure all JSX expressions return proper ReactNode types

### 2. Unused Variables/Parameters (TS6133, TS6196, TS6198)

**Files affected:**

- `web/ui/src/components/character/QualitySelector.tsx` - unused props
- `web/ui/src/components/character/SkillAllocator.tsx` - unused parameter
- `web/ui/src/components/character/steps/Step3MagicResonance.tsx` - unused constant
- `web/ui/src/components/character/steps/Step4Qualities.tsx` - multiple unused imports/variables
- `web/ui/src/components/character/steps/Step5Skills.tsx` - unused imports/variables
- `web/ui/src/components/character/steps/Step6Resources.tsx` - unused imports/variables
- `web/ui/src/components/character/steps/Step7KarmaSpending.tsx` - unused destructured elements
- `web/ui/src/components/character/steps/Step8FinalCalculations.tsx` - unused variables
- `web/ui/src/components/character/steps/Step9FinalTouches.tsx` - unused variables
- `web/ui/src/components/characters/CharacterTable.tsx` - unused variables
- `web/ui/src/components/common/DataTable.tsx` - unused import
- `web/ui/src/components/gear/GearTableGrouped.tsx` - unused interface
- `web/ui/src/components/lifestyle/LifestylesTableGrouped.tsx` - unused interface
- `web/ui/src/components/quality/QualitiesTableGrouped.tsx` - unused interface
- `web/ui/src/components/skill/SkillViewModal.tsx` - unused function
- `web/ui/src/components/weapon-consumable/WeaponConsumablesTableGrouped.tsx` - unused interface
- `web/ui/src/components/weapon/WeaponAccessoryTable.tsx` - unused variable
- `web/ui/src/components/weapon/WeaponTableGrouped.tsx` - unused interface

**Fix approach:**

- Prefix unused parameters with underscore (e.g., `onSelect: _onSelect`)
- Remove unused imports
- Remove or comment unused interfaces/types if truly not needed
- For destructured elements, use `_` prefix or rest operator

### 3. Index Signature Errors (TS7053)

**Files affected:**

- `web/ui/src/components/character/SumToTenSelector.tsx` (line 36)
- `web/ui/src/components/character/steps/Step2MetatypeAttributes.tsx` (line 280)

**Issue:**

- Accessing `creationData.priorities[category] `where `category` is a string, but TypeScript doesn't allow string indexing on the priorities object type

**Fix approach:**

- Add type assertion: `(creationData.priorities as Record<string, Record<string, PriorityOption>>)[category]`
- Or create a type guard/helper function to safely access nested properties

### 4. Type Mismatch Errors

#### 4a. Quality Category Property (TS2339, TS2345, TS2322)

**Files affected:**

- `web/ui/src/components/quality/QualitiesTable.tsx` (lines 24, 29, 40, 100)
- `web/ui/src/components/quality/QualityCategoryFilter.tsx` (line 42)

**Issue:**

- Code references `quality.category` but `Quality` interface doesn't have a `category` property
- Column definition uses `"category"` as accessor but it's not a valid key

**Fix approach:**

- Check if `category` should be added to `Quality` interface in `types.ts`
- Or remove category-related code if it's not part of the data model
- Update column definitions to use valid properties or function accessors

#### 4b. Spell Array Type Mismatch (TS2322)

**File:** `web/ui/src/components/character/steps/Step3MagicResonance.tsx` (line 553)

**Issue:**

- Array contains mixed types: `{ name: string; category?: string }` and `Spell & { _sourceTemplate?: string }`
- `Spell.name` is `string | undefined` but expected `string`

**Fix approach:**

- Filter out spells with undefined names
- Map to consistent type structure
- Add type guards to ensure `name` is always defined

#### 4c. DataTable Generic Type (TS2322)

**File:** `web/ui/src/components/common/DataTable.tsx` (lines 97, 101, 102)

**Issue:**

- Generic type `T` is not constrained, but code assumes it extends `object`
- `Object.keys()` and spread operator require object type

**Fix approach:**

- Add constraint: `T extends Record<string, unknown>` or `T extends object`
- Update function signatures to reflect the constraint

### 5. Type Declaration Conflicts (TS2687, TS2717)

**File:** `web/ui/src/lib/types.ts` (lines 832-833, 1072-1073)

**Issue:**

- `AttributeRange` interface is declared twice with conflicting property optionality:
- First: `min?: number; max?: number;` (optional)
- Second: `min: number; max: number;` (required)

**Fix approach:**

- Remove duplicate declaration
- Determine which version is correct based on usage
- Update all usages to match the chosen definition
- If both are needed, rename one (e.g., `AttributeRangeRequired`)

## Implementation Order

1. **Fix type declaration conflicts first** - These affect other type checking
2. **Fix ReactNode errors** - Critical for rendering
3. **Fix index signature errors** - Affects runtime behavior
4. **Fix type mismatches** - Quality, Spell, DataTable issues
5. **Clean up unused variables** - Non-blocking but improves code quality

## Testing Strategy

After each category:

1. Run `npm run build` in `web/ui` directory
2. Verify error count decreases
3. Check that no new errors are introduced
4. Test affected components in browser if possible

## Notes

- Some unused variables may be placeholders for future features - verify before removing
- Quality category property may need to be added to the data model if it's used in the UI
- Consider creating shared type utilities for common patterns (e.g., safe property access)

### Progress Update

**Completed:**

- ✅ Removed duplicate `AttributeRange` interface (kept optional version at line 831, removed required version at line 1071)
- ✅ Updated `WirelessBonusDisplay` and `SpecialPropertiesDisplay` to return `ReactNode` instead of `JSX.Element[]`
- ✅ Changed conditional checks from `&&` to `!= null` for better type inference
- ✅ Added Plans section to README.md with comprehensive list of all plan files and their status

**In Progress:**

- ReactNode errors on lines 438 and 463 in ArmorViewModal.tsx - these appear to be related to conditional rendering but TypeScript is still reporting errors. May need to investigate TypeScript configuration or use explicit type assertions.

**Remaining:**

- ~30 unused variable/parameter warnings
- 2 index signature errors
- 1 Spell array type mismatch
- 1 DataTable generic constraint issue
- Quality category property errors (if still present)

### To-dos

- [x] Fix duplicate AttributeRange interface declarations in types.ts - remove duplicate and standardize on one definition (removed second definition, kept optional version)
- [ ] Fix remaining ReactNode errors in ArmorViewModal.tsx (lines 438, 463) - TypeScript still reporting errors, may need deeper investigation into conditional rendering or type inference
- [ ] Fix remaining ReactNode errors in WeaponAccessoryViewModal.tsx - replace String() calls and fix conditional expressions
- [ ] Fix index signature errors in SumToTenSelector.tsx and Step2MetatypeAttributes.tsx - add type assertions for priorities access
- [ ] Fix Quality category property errors - either add category to Quality interface or remove category-related code
- [ ] Fix Spell array type mismatch in Step3MagicResonance.tsx - filter undefined names and ensure consistent types
- [ ] Fix DataTable generic type constraint - add object/Record constraint to generic type T
- [ ] Fix all unused variable/parameter errors - prefix with underscore or remove unused code
- [ ] Run npm run build to verify all TypeScript errors are resolved