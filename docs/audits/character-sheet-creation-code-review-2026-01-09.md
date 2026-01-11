# Comprehensive Code Review: Character Sheet Creation Page

**Date:** 2026-01-09
**Reviewer:** Claude (Senior Frontend Engineer perspective)
**Scope:** `/app/characters/create/sheet/` and related components
**Framework:** Next.js 16 + React 19 + TypeScript 5

---

## Executive Summary

The character sheet creation page is a well-architected, feature-rich implementation of Shadowrun 5E priority-based character creation. The codebase demonstrates strong patterns in state management, data flow, and component composition. However, there are notable gaps in accessibility, some performance optimization opportunities, and areas where the dense UI could benefit from progressive disclosure patterns.

---

## 1. Critical Issues

### 1.1 Accessibility: Modal Focus Management Missing

**Location:** `components/creation/QualitiesCard.tsx:432-750`, and similar modal patterns throughout

**Issue:** Custom modals use raw `<div>` elements with `fixed` positioning but lack:

- Focus trapping (users can tab outside modal)
- Focus restoration on close
- Escape key handling
- `role="dialog"` and `aria-modal="true"`

```tsx
// Current (problematic)
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div className="flex max-h-[85vh] w-full max-w-2xl...">
```

**Risk:** WCAG 2.1 Level A failure (2.1.2 No Keyboard Trap, 2.4.3 Focus Order)

**Recommendation:** Use `react-aria-components` Dialog (already a dependency) consistently, as done in `KarmaConversionModal.tsx`.

### 1.2 Missing Error Boundary

**Location:** `app/characters/create/sheet/page.tsx`

**Issue:** No error boundary wrapping the creation content. A single component failure could crash the entire creation flow, losing unsaved work.

**Risk:** User data loss, poor error recovery UX

### 1.3 Race Condition in Auto-Save

**Location:** `app/characters/create/sheet/page.tsx:109-176`

**Issue:** The auto-save `useEffect` creates a new timeout on every `creationState` change but doesn't abort in-flight requests when state changes again:

```tsx
useEffect(() => {
  const saveTimeout = setTimeout(async () => {
    // If state changes again during this save, stale data could overwrite newer data
    await fetch(`/api/characters/${characterId}`, { ... });
  }, 1000);
  return () => clearTimeout(saveTimeout);
}, [creationState, ...]);
```

**Risk:** Potential data corruption under rapid editing

**Recommendation:** Use `AbortController` to cancel stale requests, or implement optimistic versioning.

---

## 2. High-Priority Improvements

### 2.1 Performance: Large Modal Re-renders

**Location:** `components/creation/QualitiesCard.tsx:244-750`

**Issue:** The `QualitySelectionModal` receives the entire qualities array and re-renders completely when any parent state changes. The `qualitiesByCategory` memo helps but category grouping runs on every render.

**Recommendation:**

- Memoize the modal component with `React.memo`
- Consider virtualization for large lists (50+ qualities per category)
- Extract modal into separate file for code splitting

### 2.2 Missing Keyboard Navigation

**Location:** Multiple components

**Issues found:**

- `PrioritySelectionCard`: Drag-and-drop only; keyboard users rely on small chevron buttons
- `AttributesCard`: +/- buttons lack keyboard shortcuts (e.g., arrow keys)
- `Tooltip` component at `AttributesCard.tsx:110-129` uses hover-only activation; keyboard users can't access tooltip content

### 2.3 Bundle Size: No Code Splitting for Modals

**Location:** `app/characters/create/sheet/components/SheetCreationLayout.tsx`

**Issue:** All 19+ creation cards and their modals are eagerly loaded, including conditional ones (spells, adept powers, complex forms). This inflates initial bundle size.

**Recommendation:**

```tsx
// Use dynamic imports for conditional sections
const SpellsCard = dynamic(() => import("@/components/creation/SpellsCard"), {
  loading: () => <CardSkeleton title="Spells" />,
  ssr: false,
});
```

### 2.4 Form State Not Persisted to URL

**Location:** `app/characters/create/sheet/page.tsx`

**Issue:** Only `characterId` and `campaignId` are in URL params. If a user refreshes before auto-save triggers (within 1 second), their recent changes are lost.

**Recommendation:** Consider URL-based draft state or more aggressive localStorage backup.

---

## 3. Data Density Solutions

The current UI already implements several good patterns. Here are specific recommendations to improve compact data display:

### 3.1 Implement Collapsible Card Sections

**Current:** All cards are always fully expanded
**Recommendation:** Add collapse/expand for completed sections

```tsx
// Suggested pattern for CreationCard
<CreationCard
  title="Attributes"
  status="valid"
  collapsible
  defaultCollapsed={status === "valid"} // Auto-collapse completed sections
>
```

### 3.2 Add Summary-Mode for Completed Cards

When a card reaches "valid" status, show a compact summary instead of full controls:

```tsx
{
  status === "valid" && (
    <div className="flex flex-wrap gap-1 text-xs">
      <span>BOD 4</span> • <span>AGI 5</span> • <span>REA 3</span>...
    </div>
  );
}
```

### 3.3 Sticky Budget Summary

**Location:** `SheetCreationLayout.tsx:140-333`

**Issue:** BudgetSummaryCard scrolls with content; users lose budget visibility while scrolling Column 2/3

**Recommendation:** Make budget summary sticky within Column 1:

```tsx
<div className="sticky top-20 space-y-4">
  <BudgetSummaryCard ... />
  <ValidationSummary ... />
</div>
```

### 3.4 Progressive Disclosure for Equipment

**Current:** Weapons/Armor/Gear show all details inline
**Recommendation:** Two-tier display:

1. **List view:** Name + cost + key stat (e.g., damage for weapons)
2. **Expand/modal:** Full stats, modifications, ammunition

This is partially implemented in `AugmentationsCard` with expandable rows - extend to other gear panels.

### 3.5 Tabbed Gear Section

Consolidate Gear/Weapons/Armor/Vehicles into a single card with tabs to reduce vertical scrolling in Column 3:

```tsx
<GearTabbedCard>
  <TabPanel id="weapons">...</TabPanel>
  <TabPanel id="armor">...</TabPanel>
  <TabPanel id="gear">...</TabPanel>
  <TabPanel id="vehicles">...</TabPanel>
</GearTabbedCard>
```

---

## 4. Medium-Priority Refactoring

### 4.1 Inconsistent Modal Patterns

**Issue:** Some modals use `react-aria-components`, others use raw divs:

- `KarmaConversionModal.tsx` - uses react-aria Dialog
- `QualitiesCard.tsx` - raw div modal
- `SkillModal.tsx` - raw div modal

**Recommendation:** Create a shared `<BaseModal>` component using react-aria and migrate all modals.

### 4.2 Duplicated Budget Bar Components

**Locations:**

- `AttributesCard.tsx:135-195` - `CompactBudgetBar`
- `QualitiesCard.tsx:116-174` - `QualityBudgetBar`
- `SheetCreationLayout.tsx:121-134` - inline budget bar logic
- `shared/BudgetIndicator.tsx` - the actual shared component

**Recommendation:** Consolidate to single `BudgetIndicator` usage with variants.

### 4.3 Tooltip Component Extraction

**Location:** `AttributesCard.tsx:110-129`

**Issue:** Custom `Tooltip` component is defined inline, not reusable, hover-only

**Recommendation:** Create `components/ui/Tooltip.tsx` using react-aria's `Tooltip` for proper accessibility.

### 4.4 Over-Coupling of State Updates

**Location:** `AttributesCard.tsx:543-569`

**Issue:** `handleCoreAttributeChange` updates both `selections` and `budgets` in `CreationState`, requiring the component to understand budget calculation:

```tsx
updateState({
  selections: { ...state.selections, attributes: newAttributes },
  budgets: {
    ...state.budgets,
    "attribute-points-spent": newSpent,
    "attribute-points-total": attributePoints,
  },
});
```

**Recommendation:** Budget calculations should happen entirely in `CreationBudgetContext`; components should only update `selections`.

### 4.5 TypeScript: Excessive Type Assertions

**Location:** Throughout state access patterns

```tsx
const skills = state.selections.skills as Record<string, number>;
const magicPath = state.selections["magical-path"] as string | undefined;
```

**Recommendation:** Define typed selection interfaces per creation step and use discriminated unions.

---

## 5. Best Practices Worth Highlighting

### 5.1 Excellent Memoization Strategy

The codebase shows strong memoization discipline with 474 `useMemo`/`useCallback` usages across 43 files. Key patterns:

```tsx
// Good: Expensive calculations memoized
const corePointsSpent = useMemo(() => {
  let spent = 0;
  [...PHYSICAL_ATTRIBUTES, ...MENTAL_ATTRIBUTES].forEach((attr) => {
    spent += value - limits.min;
  });
  return spent;
}, [getAttributeValue, getAttributeLimits]);
```

### 5.2 Well-Structured Context System

The `CreationBudgetContext` cleanly separates:

- Budget calculation (`calculateBudgetTotals`)
- Spent value extraction (`extractSpentValues`)
- Validation (`validateBudgets`)
- Debounced updates (300ms)

### 5.3 Data-Driven Architecture

The ruleset system allows rule modules to be loaded from JSON without code changes. Qualities, skills, gear are all data-driven:

```tsx
const { positive: positiveQualities, negative: negativeQualities } = useQualities();
```

### 5.4 Consistent Card Wrapper Pattern

`CreationCard` provides uniform:

- Header with title/description
- Validation badge integration
- Status-based border coloring
- Header action slot

### 5.5 Good Conflict Detection

`QualitiesCard.tsx:307-333` detects when selecting "Incompetent" quality would conflict with existing skill selections:

```tsx
const incompetentConflictInfo = useMemo(() => {
  if (selectedQuality?.id !== "incompetent" || !specification) return null;
  // Check for conflicts with existing skills
});
```

---

## 6. Missing Character Creation Elements

Based on SR5 Core Rulebook requirements:

### Currently Missing

| Element                         | Status  | Notes                                   |
| ------------------------------- | ------- | --------------------------------------- |
| **Lifestyle Selection**         | Missing | Required for starting nuyen calculation |
| **Martial Arts Styles**         | Missing | Optional but common                     |
| **Mentor Spirit Selection**     | Partial | Referenced in types, UI not visible     |
| **Initiate Grade / Metamagics** | Missing | Post-creation advancement               |
| **Sprite/Spirit Compilation**   | Missing | For technomancers/summoners             |
| **Custom Ammunition**           | Present | In `AmmunitionModal`                    |
| **Drug/Toxin Selection**        | Missing | Usually part of gear                    |
| **Bound Foci**                  | Partial | FociCard exists, binding logic unclear  |

### Implemented Well

- Priority selection with drag-drop
- Metatype with racial modifiers
- All 8 core + 3 special attributes
- Active skills + skill groups + specializations
- Knowledge skills + languages
- Positive/negative qualities with specifications
- Magic paths (Magician, Adept, Mystic Adept, Aspected, Technomancer)
- Spells, Adept Powers, Complex Forms
- Cyberware + Bioware with essence tracking
- Weapons, Armor, Gear with modifications
- Vehicles, Drones, RCCs, Autosofts
- Contacts with loyalty/connection
- SINs and fake identities

---

## 7. Quick Wins

### 7.1 Add ARIA Labels to Icon Buttons

**Effort:** 5 minutes per component

```tsx
// Before
<button onClick={onRemove} title="Remove quality">
  <X className="h-3 w-3" />
</button>

// After
<button
  onClick={onRemove}
  aria-label="Remove quality"
  title="Remove quality"
>
  <X className="h-3 w-3" aria-hidden="true" />
</button>
```

### 7.2 Add Loading States to Modals

**Effort:** 10 minutes

```tsx
// In modal search
{
  isSearching && <Loader2 className="animate-spin" />;
}
```

### 7.3 Escape Key Handler for Raw Modals

**Effort:** 2 minutes per modal

```tsx
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [onClose]);
```

### 7.4 Add `aria-live` for Budget Changes

**Effort:** 5 minutes

```tsx
<div aria-live="polite" className="sr-only">
  {remaining} attribute points remaining
</div>
```

### 7.5 Mobile Responsiveness: Single Column Layout

**Current:** 3 columns to 1 column works but ordering may not be ideal

**Quick fix:** Add `order` classes for mobile priority:

```tsx
<div className="order-1 lg:order-none">
  <PrioritySelectionCard />
</div>
```

---

## Summary Metrics

| Category               | Score | Notes                                          |
| ---------------------- | ----- | ---------------------------------------------- |
| **Shadowrun Coverage** | 85%   | Missing lifestyle, martial arts                |
| **Performance**        | 75%   | Good memoization, needs code splitting         |
| **Accessibility**      | 45%   | Critical modal issues, limited ARIA            |
| **Code Architecture**  | 90%   | Excellent patterns, minor duplication          |
| **Data Flow**          | 85%   | Clean contexts, minor coupling                 |
| **UX/Data Density**    | 70%   | Good foundations, needs progressive disclosure |
| **Security**           | 90%   | Server-side validation, proper auth checks     |
| **Type Safety**        | 75%   | Excessive assertions, could be stricter        |

---

## Priority Order for Fixes

1. **Modal accessibility** (Critical) - WCAG compliance
2. **Error boundaries** (Critical) - Data loss prevention
3. **Auto-save race condition** (High) - Data integrity
4. **Code splitting for modals** (High) - Performance
5. **Consolidate budget bar components** (Medium) - Maintainability
6. **Add lifestyle selection** (Medium) - Feature completeness
7. **Collapsible completed cards** (Medium) - UX improvement

---

## Files Reviewed

### Core Page Components

- `app/characters/create/sheet/page.tsx`
- `app/characters/create/sheet/components/SheetCreationLayout.tsx`

### Context Providers

- `lib/contexts/CreationBudgetContext.tsx`
- `lib/rules/RulesetContext.tsx`

### Creation Card Components (48+ files)

- `components/creation/shared/CreationCard.tsx`
- `components/creation/AttributesCard.tsx`
- `components/creation/QualitiesCard.tsx`
- `components/creation/SkillsCard.tsx`
- `components/creation/WeaponsPanel.tsx`
- `components/creation/ArmorPanel.tsx`
- `components/creation/AugmentationsCard.tsx`
- `components/creation/VehiclesCard.tsx`
- And 40+ additional component files

### Type Definitions

- `lib/types/creation.ts`
- `lib/types/character.ts`
