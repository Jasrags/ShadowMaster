# Plan: Expand Creation Component Test Coverage (#302)

## Problem

Only 3/97 creation components have tests (3.1%). Need to add tests for Tier 1 core cards.

## Existing Test Pattern (from `AttributesCard.test.tsx`)

1. Mock hooks at module level with `vi.mock()`
2. Mock sub-components as simple stubs (see `SkillsCard.test.tsx` for pattern)
3. `createBaseState()` factory with `CreationState`-shaped overrides
4. `beforeEach` resets mocks and configures return values
5. Test groups: rendering, interactions, edge cases
6. Props pattern: `state: CreationState` + `updateState: (updates) => void`

## Scope — Tier 1 Cards (7 components, multi-PR)

### PR 1: Simple cards (low mock complexity)

- [ ] `CharacterInfoCard.test.tsx` (~170 LOC source, no hooks to mock beyond shared `CreationCard`)
  - Mocks: `./shared` (CreationCard stub)
  - Tests: renders inputs, name length limit, updates state on change, empty state
- [ ] `PrioritySelectionCard.test.tsx` (~467 LOC source)
  - Mocks: `@/lib/rules` (usePriorityTable), `./shared` (CreationCard stub)
  - Tests: renders 5 priority rows, swap via arrow buttons, default order, budget summaries per row

### PR 2: Magic-dependent cards

- [ ] `SpellsCard.test.tsx` (~463 LOC source)
  - Mocks: `@/lib/rules` (useSpells, usePriorityTable), `@/lib/contexts` (useCreationBudgets), `./spells` (SpellModal, SpellListItem stubs)
  - Tests: locked when not magician, renders spell list, add/remove spells, karma overflow, grouped by category
- [ ] `ComplexFormsCard.test.tsx` (~337 LOC source)
  - Mocks: `@/lib/rules` (useComplexForms, usePriorityTable), `@/lib/contexts` (useCreationBudgets)
  - Tests: locked when not technomancer, renders form list, search filter, add/remove forms, karma cost

### PR 3: Equipment cards (high complexity)

- [ ] `AugmentationsCard.test.tsx` (~1053 LOC source)
  - Mocks: `@/lib/rules/RulesetContext` (useAugmentationRules, calculateMagicLoss), `@/lib/contexts` (useCreationBudgets), `./augmentations` (AugmentationModal + item components as stubs), `@/lib/rules/augmentations/grades`, `@/lib/types/cyberlimb`
  - Tests: locked state, renders essence bar, add/remove augmentation, magic loss warning, cyberware vs bioware toggle, grade effects
- [ ] `VehiclesCard.test.tsx` (~735 LOC source)
  - Mocks: `@/lib/contexts` (useCreationBudgets), `./vehicles` (VehicleSystemModal stub), `./shared` (CreationCard, SummaryFooter, etc.)
  - Tests: locked state, renders vehicle/drone/RCC sections, add/remove items, budget tracking, legality warnings
- [ ] `WeaponsPanel.test.tsx` (~755 LOC source)
  - Mocks: `@/lib/rules/RulesetContext` (useGear, useWeaponModifications, useRuleset), `@/lib/rules/gear/weapon-customization`, `@/lib/contexts` (useCreationBudgets), `./weapons` (WeaponRow, modals as stubs)
  - Tests: locked state, renders weapon list grouped by category, add/remove weapon, modification flow, ammunition, karma-to-nuyen

## Files to Create

| File                             | Location                         |
| -------------------------------- | -------------------------------- |
| `CharacterInfoCard.test.tsx`     | `components/creation/__tests__/` |
| `PrioritySelectionCard.test.tsx` | `components/creation/__tests__/` |
| `SpellsCard.test.tsx`            | `components/creation/__tests__/` |
| `ComplexFormsCard.test.tsx`      | `components/creation/__tests__/` |
| `AugmentationsCard.test.tsx`     | `components/creation/__tests__/` |
| `VehiclesCard.test.tsx`          | `components/creation/__tests__/` |
| `WeaponsPanel.test.tsx`          | `components/creation/__tests__/` |

## Files to Read (reference patterns)

- `components/creation/__tests__/AttributesCard.test.tsx` — primary mock pattern
- `components/creation/__tests__/SkillsCard.test.tsx` — sub-component mocking pattern

## Estimated Scope

- ~7 new test files, ~500-700 lines each
- 3 PRs to keep reviews manageable
- Each PR should pass `pnpm test` independently
