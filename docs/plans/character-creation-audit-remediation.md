# Character Creation Audit Remediation Plan

## Overview

Implementation plan to address findings from the comprehensive code review of the character sheet creation page (`/characters/create/sheet`). This plan prioritizes fixes based on severity and impact, organizing work into 6 phases from critical accessibility fixes to UX enhancements.

**Source Audit:** `docs/audits/character-sheet-creation-code-review-2026-01-09.md`
**Scope:** 48+ components across `/components/creation/` and core page files
**Estimated Effort:** Medium-Large (phased rollout recommended)

---

## Priority Summary

| Priority | Category      | Issues                                 | Impact                            |
| -------- | ------------- | -------------------------------------- | --------------------------------- |
| Critical | Accessibility | Modal focus management, ARIA labels    | WCAG compliance, legal risk       |
| Critical | Stability     | Error boundaries, race conditions      | Data loss prevention              |
| High     | Performance   | Code splitting, modal optimization     | Initial load time, responsiveness |
| High     | Features      | Lifestyle selection                    | Core rulebook completeness        |
| Medium   | Code Quality  | Component consolidation, TypeScript    | Maintainability                   |
| Medium   | UX            | Progressive disclosure, sticky budgets | User experience                   |

---

## Phase 1: Critical Accessibility & Stability

**Goal:** Address WCAG 2.1 Level A failures and prevent data loss scenarios

**Duration:** 3-5 days

### 1.1 Create Accessible Base Modal Component

**Issue:** Raw div modals lack focus trapping, keyboard handling, ARIA attributes

**Files to Create:**

- `components/ui/BaseModal.tsx`

**Tasks:**

- [ ] 1.1.1 Create `BaseModal.tsx` using `react-aria-components` Dialog
- [ ] 1.1.2 Implement focus trapping with `FocusScope`
- [ ] 1.1.3 Add Escape key handling
- [ ] 1.1.4 Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [ ] 1.1.5 Implement focus restoration on close
- [ ] 1.1.6 Add overlay click-to-close with proper event handling

**Implementation:**

```tsx
// components/ui/BaseModal.tsx
import { Dialog, Modal, ModalOverlay, Heading } from "react-aria-components";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function BaseModal({ isOpen, onClose, title, children, size = "lg" }: BaseModalProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Modal className={`max-h-[85vh] w-full ${sizeClasses[size]} ...`}>
        <Dialog className="outline-none">
          <Heading slot="title">{title}</Heading>
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
```

### 1.2 Migrate Existing Modals to BaseModal

**Files to Modify:**

- `components/creation/QualitiesCard.tsx` - `QualitySelectionModal`
- `components/creation/skills/SkillModal.tsx`
- `components/creation/skills/SkillGroupModal.tsx`
- `components/creation/MetatypeCard.tsx` - `MetatypeModal`
- `components/creation/gear/GearPurchaseModal.tsx`
- `components/creation/weapons/WeaponPurchaseModal.tsx`
- `components/creation/armor/ArmorPurchaseModal.tsx`
- `components/creation/augmentations/AugmentationModal.tsx`
- `components/creation/vehicles/VehicleModal.tsx`
- `components/creation/vehicles/DroneModal.tsx`
- `components/creation/foci/FocusModal.tsx`

**Tasks:**

- [ ] 1.2.1 Migrate `QualitySelectionModal` to use `BaseModal`
- [ ] 1.2.2 Migrate `SkillModal` and `SkillGroupModal`
- [ ] 1.2.3 Migrate `MetatypeModal`
- [ ] 1.2.4 Migrate gear-related modals (Gear, Weapon, Armor)
- [ ] 1.2.5 Migrate augmentation modals
- [ ] 1.2.6 Migrate vehicle/drone modals
- [ ] 1.2.7 Migrate foci modal
- [ ] 1.2.8 Test focus management across all modals

### 1.3 Add Error Boundary

**Issue:** No error boundary; component crashes lose unsaved work

**Files to Create:**

- `components/creation/CreationErrorBoundary.tsx`

**Files to Modify:**

- `app/characters/create/sheet/page.tsx`

**Tasks:**

- [ ] 1.3.1 Create `CreationErrorBoundary.tsx` with recovery UI
- [ ] 1.3.2 Implement `componentDidCatch` logging
- [ ] 1.3.3 Add "Try Again" and "Return to Characters" options
- [ ] 1.3.4 Show last-saved timestamp if available
- [ ] 1.3.5 Wrap `SheetCreationContent` in error boundary
- [ ] 1.3.6 Test error scenarios with intentional failures

**Implementation:**

```tsx
// components/creation/CreationErrorBoundary.tsx
class CreationErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Creation error:", error, info);
    // TODO: Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2>Something went wrong</h2>
            <p>Your progress was last saved at {lastSaved}</p>
            <button onClick={() => this.setState({ hasError: false })}>Try Again</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 1.4 Fix Auto-Save Race Condition

**Issue:** Concurrent state changes can cause stale data to overwrite newer data

**Files to Modify:**

- `app/characters/create/sheet/page.tsx`

**Tasks:**

- [ ] 1.4.1 Add `AbortController` ref for in-flight requests
- [ ] 1.4.2 Abort previous request before starting new save
- [ ] 1.4.3 Add save version counter to detect stale responses
- [ ] 1.4.4 Implement retry logic for failed saves
- [ ] 1.4.5 Add visual indicator for save conflicts
- [ ] 1.4.6 Test rapid-fire state changes

**Implementation:**

```tsx
// In page.tsx
const abortControllerRef = useRef<AbortController | null>(null);
const saveVersionRef = useRef(0);

useEffect(() => {
  // ... existing checks ...

  const currentVersion = ++saveVersionRef.current;

  const saveTimeout = setTimeout(async () => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsSaving(true);
    try {
      const res = await fetch(`/api/characters/${characterId}`, {
        method: "PATCH",
        signal: abortControllerRef.current.signal,
        // ...
      });

      // Ignore response if newer save started
      if (currentVersion !== saveVersionRef.current) return;

      // ... handle response ...
    } catch (e) {
      if (e.name === "AbortError") return; // Expected
      console.error("Failed to save draft:", e);
    } finally {
      if (currentVersion === saveVersionRef.current) {
        setIsSaving(false);
      }
    }
  }, 1000);

  return () => clearTimeout(saveTimeout);
}, [creationState, ...]);
```

---

## Phase 2: Accessibility Quick Wins

**Goal:** Achieve WCAG 2.1 AA compliance for interactive elements

**Duration:** 2-3 days

### 2.1 Add ARIA Labels to Icon Buttons

**Files to Modify:** All creation card components with icon-only buttons

**Tasks:**

- [ ] 2.1.1 Audit all icon-only buttons across components
- [ ] 2.1.2 Add `aria-label` to remove/delete buttons
- [ ] 2.1.3 Add `aria-label` to expand/collapse buttons
- [ ] 2.1.4 Add `aria-label` to +/- increment buttons
- [ ] 2.1.5 Add `aria-hidden="true"` to decorative icons
- [ ] 2.1.6 Test with screen reader (VoiceOver/NVDA)

**Pattern:**

```tsx
// Before
<button onClick={onRemove} title="Remove">
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

### 2.2 Add Live Regions for Budget Updates

**Files to Modify:**

- `components/creation/shared/BudgetIndicator.tsx`
- `app/characters/create/sheet/components/SheetCreationLayout.tsx`

**Tasks:**

- [ ] 2.2.1 Add `aria-live="polite"` region for budget changes
- [ ] 2.2.2 Add screen-reader-only text for remaining points
- [ ] 2.2.3 Announce validation errors when they appear
- [ ] 2.2.4 Test announcement timing and verbosity

**Implementation:**

```tsx
<div aria-live="polite" className="sr-only">
  {remaining} {label} remaining
  {isOver && `. Warning: Over budget by ${Math.abs(remaining)}`}
</div>
```

### 2.3 Create Accessible Tooltip Component

**Issue:** Current tooltip is hover-only, inaccessible to keyboard users

**Files to Create:**

- `components/ui/Tooltip.tsx`

**Files to Modify:**

- `components/creation/AttributesCard.tsx` - replace inline Tooltip

**Tasks:**

- [ ] 2.3.1 Create `Tooltip.tsx` using react-aria TooltipTrigger
- [ ] 2.3.2 Support keyboard focus activation
- [ ] 2.3.3 Add proper ARIA attributes
- [ ] 2.3.4 Replace AttributesCard inline tooltip
- [ ] 2.3.5 Audit and replace other inline tooltips

### 2.4 Improve Keyboard Navigation

**Files to Modify:**

- `components/creation/AttributesCard.tsx`
- `components/creation/PrioritySelectionCard.tsx`

**Tasks:**

- [ ] 2.4.1 Add arrow key support for attribute +/- buttons
- [ ] 2.4.2 Improve priority card keyboard reordering
- [ ] 2.4.3 Add visible focus indicators (focus-visible rings)
- [ ] 2.4.4 Ensure logical tab order in all cards
- [ ] 2.4.5 Test full keyboard-only navigation flow

---

## Phase 3: Performance Optimization

**Goal:** Reduce initial bundle size and improve runtime performance

**Duration:** 3-4 days

### 3.1 Implement Code Splitting for Conditional Cards

**Files to Modify:**

- `app/characters/create/sheet/components/SheetCreationLayout.tsx`

**Tasks:**

- [ ] 3.1.1 Create `CardSkeleton.tsx` loading component
- [ ] 3.1.2 Dynamic import `SpellsCard` (magic users only)
- [ ] 3.1.3 Dynamic import `AdeptPowersCard` (adepts only)
- [ ] 3.1.4 Dynamic import `ComplexFormsCard` (technomancers only)
- [ ] 3.1.5 Dynamic import `FociCard` (awakened only)
- [ ] 3.1.6 Measure bundle size reduction

**Implementation:**

```tsx
import dynamic from "next/dynamic";

const SpellsCard = dynamic(() => import("@/components/creation/SpellsCard"), {
  loading: () => <CardSkeleton title="Spells" />,
  ssr: false,
});

// In render:
{
  isMagical && <SpellsCard state={creationState} updateState={updateState} />;
}
```

### 3.2 Extract and Memoize Modal Components

**Issue:** Large modals re-render with parent state changes

**Files to Create:**

- `components/creation/qualities/QualitySelectionModal.tsx` (extract from QualitiesCard)

**Tasks:**

- [ ] 3.2.1 Extract `QualitySelectionModal` to separate file
- [ ] 3.2.2 Wrap with `React.memo` with custom comparison
- [ ] 3.2.3 Memoize `qualitiesByCategory` at module level
- [ ] 3.2.4 Apply same pattern to other large modals
- [ ] 3.2.5 Profile with React DevTools to verify

### 3.3 Implement List Virtualization for Large Catalogs

**Files to Modify:**

- `components/creation/qualities/QualitySelectionModal.tsx`
- `components/creation/gear/GearPurchaseModal.tsx`
- `components/creation/weapons/WeaponPurchaseModal.tsx`

**Tasks:**

- [ ] 3.3.1 Add `@tanstack/react-virtual` dependency
- [ ] 3.3.2 Virtualize quality list (50+ items per category)
- [ ] 3.3.3 Virtualize gear catalog
- [ ] 3.3.4 Maintain search/filter functionality with virtualization
- [ ] 3.3.5 Test scroll performance on mobile

---

## Phase 4: Component Consolidation

**Goal:** Reduce code duplication and improve maintainability

**Duration:** 2-3 days

### 4.1 Consolidate Budget Bar Components

**Issue:** 3+ implementations of budget progress bars

**Files to Modify:**

- `components/creation/shared/BudgetIndicator.tsx` (enhance)
- `components/creation/AttributesCard.tsx` (use shared)
- `components/creation/QualitiesCard.tsx` (use shared)
- `app/characters/create/sheet/components/SheetCreationLayout.tsx` (use shared)

**Tasks:**

- [ ] 4.1.1 Audit all budget bar implementations
- [ ] 4.1.2 Add variants to `BudgetIndicator`: `compact`, `full`, `inline`
- [ ] 4.1.3 Add support for karma warnings (overflow indicator)
- [ ] 4.1.4 Replace `CompactBudgetBar` in AttributesCard
- [ ] 4.1.5 Replace `QualityBudgetBar` in QualitiesCard
- [ ] 4.1.6 Replace inline implementation in SheetCreationLayout
- [ ] 4.1.7 Delete deprecated implementations

### 4.2 Decouple Budget Updates from Components

**Issue:** Cards directly update `state.budgets`, duplicating calculation logic

**Files to Modify:**

- `lib/contexts/CreationBudgetContext.tsx`
- `components/creation/AttributesCard.tsx`
- `components/creation/SkillsCard.tsx`
- `components/creation/QualitiesCard.tsx`

**Tasks:**

- [ ] 4.2.1 Move all budget calculation to `CreationBudgetContext`
- [ ] 4.2.2 Components only update `selections`, not `budgets`
- [ ] 4.2.3 Context derives spent values from selections
- [ ] 4.2.4 Remove budget update code from AttributesCard
- [ ] 4.2.5 Remove budget update code from SkillsCard
- [ ] 4.2.6 Remove budget update code from QualitiesCard
- [ ] 4.2.7 Verify budget calculations still correct

### 4.3 Improve TypeScript Type Safety

**Files to Create:**

- `lib/types/creation-selections.ts`

**Files to Modify:**

- `lib/types/creation.ts`

**Tasks:**

- [ ] 4.3.1 Define typed interfaces for each selection category
- [ ] 4.3.2 Create discriminated union for `CreationState.selections`
- [ ] 4.3.3 Add type guards for selection access
- [ ] 4.3.4 Replace `as` casts with proper types
- [ ] 4.3.5 Enable stricter TypeScript settings

**Implementation:**

```tsx
// lib/types/creation-selections.ts
interface AttributeSelections {
  attributes: Record<CoreAttributeId, number>;
  specialAttributes: Record<SpecialAttributeId, number>;
}

interface SkillSelections {
  skills: Record<string, number>;
  skillGroups: Record<string, number>;
  specializations: Record<string, string[]>;
}

interface CreationSelections {
  metatype?: string;
  "magical-path"?: MagicalPath;
  attributes?: AttributeSelections;
  skills?: SkillSelections;
  // ... etc
}
```

---

## Phase 5: Missing Features

**Goal:** Complete SR5 Core Rulebook coverage

**Duration:** 4-5 days

### 5.1 Implement Lifestyle Selection

**Issue:** Core rulebook requirement missing; affects starting nuyen

**Files to Create:**

- `components/creation/LifestyleCard.tsx`
- `components/creation/lifestyle/LifestyleModal.tsx`

**Files to Modify:**

- `app/characters/create/sheet/components/SheetCreationLayout.tsx`
- `lib/contexts/CreationBudgetContext.tsx`

**Tasks:**

- [ ] 5.1.1 Verify lifestyle data exists in ruleset (`useLifestyles` hook)
- [ ] 5.1.2 Create `LifestyleCard.tsx` with selection UI
- [ ] 5.1.3 Create `LifestyleModal.tsx` for browsing options
- [ ] 5.1.4 Show lifestyle cost, comfort level, description
- [ ] 5.1.5 Allow prepaying months at creation
- [ ] 5.1.6 Add lifestyle cost to nuyen budget
- [ ] 5.1.7 Integrate into SheetCreationLayout Column 3
- [ ] 5.1.8 Test with various resource priorities

### 5.2 Add Mentor Spirit Selection

**Issue:** Magic users should be able to select mentor spirits

**Files to Create:**

- `components/creation/MentorSpiritCard.tsx`
- `components/creation/spirits/MentorSpiritModal.tsx`

**Tasks:**

- [ ] 5.2.1 Verify mentor spirit data in ruleset
- [ ] 5.2.2 Create `MentorSpiritCard.tsx` (conditional on magic path)
- [ ] 5.2.3 Show bonuses and disadvantages
- [ ] 5.2.4 Store selection in `state.selections.mentorSpirit`
- [ ] 5.2.5 Integrate into SheetCreationLayout after MagicPathCard

### 5.3 Add Martial Arts System (Optional)

**Files to Create:**

- `components/creation/MartialArtsCard.tsx`
- `components/creation/martialArts/StyleModal.tsx`
- `components/creation/martialArts/TechniqueModal.tsx`

**Tasks:**

- [ ] 5.3.1 Check if martial arts data exists in ruleset
- [ ] 5.3.2 If missing, add to `core-rulebook.json`
- [ ] 5.3.3 Create style selection UI
- [ ] 5.3.4 Create technique selection UI (karma cost)
- [ ] 5.3.5 Add karma tracking for techniques

---

## Phase 6: UX Enhancements

**Goal:** Improve data density handling and user experience

**Duration:** 3-4 days

### 6.1 Add Collapsible Card Sections

**Files to Modify:**

- `components/creation/shared/CreationCard.tsx`

**Tasks:**

- [ ] 6.1.1 Add `collapsible` prop to CreationCard
- [ ] 6.1.2 Add `defaultCollapsed` prop
- [ ] 6.1.3 Implement expand/collapse animation
- [ ] 6.1.4 Show summary when collapsed
- [ ] 6.1.5 Auto-collapse completed sections option
- [ ] 6.1.6 Persist collapse state in localStorage

**Implementation:**

```tsx
interface CreationCardProps {
  // ... existing props
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsedSummary?: React.ReactNode;
}
```

### 6.2 Implement Sticky Budget Summary

**Files to Modify:**

- `app/characters/create/sheet/components/SheetCreationLayout.tsx`

**Tasks:**

- [ ] 6.2.1 Make Column 1 bottom section sticky
- [ ] 6.2.2 Include BudgetSummaryCard in sticky area
- [ ] 6.2.3 Include ValidationSummary in sticky area
- [ ] 6.2.4 Handle mobile layout (bottom fixed bar?)
- [ ] 6.2.5 Test scroll behavior with long forms

### 6.3 Create Tabbed Gear Section

**Files to Create:**

- `components/creation/GearTabbedCard.tsx`

**Files to Modify:**

- `app/characters/create/sheet/components/SheetCreationLayout.tsx`

**Tasks:**

- [ ] 6.3.1 Create `GearTabbedCard.tsx` container
- [ ] 6.3.2 Add tabs: Weapons, Armor, Gear, Vehicles
- [ ] 6.3.3 Show item counts on each tab
- [ ] 6.3.4 Maintain shared nuyen budget display
- [ ] 6.3.5 Replace 4 separate cards in layout
- [ ] 6.3.6 Test keyboard navigation between tabs

### 6.4 Add Summary Mode for Completed Cards

**Files to Modify:**

- `components/creation/AttributesCard.tsx`
- `components/creation/SkillsCard.tsx`
- `components/creation/QualitiesCard.tsx`

**Tasks:**

- [ ] 6.4.1 Create summary view component for each card
- [ ] 6.4.2 Show compact data display when valid
- [ ] 6.4.3 Add "Edit" button to expand back to full view
- [ ] 6.4.4 Auto-collapse to summary when moving to next section

---

## File Structure Changes

```
components/
├── ui/
│   ├── BaseModal.tsx           # NEW: Accessible modal foundation
│   └── Tooltip.tsx             # NEW: Accessible tooltip
├── creation/
│   ├── CreationErrorBoundary.tsx    # NEW: Error boundary
│   ├── shared/
│   │   ├── CreationCard.tsx         # MODIFIED: Add collapsible
│   │   ├── BudgetIndicator.tsx      # MODIFIED: Add variants
│   │   └── CardSkeleton.tsx         # NEW: Loading skeleton
│   ├── qualities/
│   │   └── QualitySelectionModal.tsx # NEW: Extracted modal
│   ├── LifestyleCard.tsx            # NEW: Lifestyle selection
│   ├── lifestyle/
│   │   └── LifestyleModal.tsx       # NEW: Lifestyle browser
│   ├── MentorSpiritCard.tsx         # NEW: Mentor spirits
│   ├── spirits/
│   │   └── MentorSpiritModal.tsx    # NEW: Spirit browser
│   └── GearTabbedCard.tsx           # NEW: Consolidated gear UI

lib/types/
└── creation-selections.ts           # NEW: Typed selections
```

---

## Testing Requirements

### Unit Tests

- [ ] BaseModal focus management
- [ ] CreationErrorBoundary recovery
- [ ] Budget calculations with decoupled components
- [ ] Type guards for creation selections

### Integration Tests

- [ ] Full creation flow with keyboard-only navigation
- [ ] Auto-save with rapid state changes
- [ ] Modal open/close cycles
- [ ] Code-split component loading

### Accessibility Tests

- [ ] axe-core audit on all modals
- [ ] Screen reader testing (VoiceOver, NVDA)
- [ ] Keyboard navigation flow
- [ ] Color contrast verification

### Performance Tests

- [ ] Bundle size before/after code splitting
- [ ] Modal render time with virtualization
- [ ] Memory usage during extended sessions

---

## Success Metrics

| Metric                   | Current             | Target         |
| ------------------------ | ------------------- | -------------- |
| WCAG 2.1 AA Compliance   | ~45%                | 100%           |
| Lighthouse Accessibility | Unknown             | 90+            |
| Initial Bundle Size      | Unknown             | -20%           |
| Modal Render Time        | Unknown             | <100ms         |
| Auto-save Reliability    | Race condition risk | Zero conflicts |
| SR5 Feature Coverage     | 85%                 | 95%            |

---

## Dependencies

**New packages (if not present):**

- `@tanstack/react-virtual` - List virtualization (Phase 3)

**Existing packages to leverage:**

- `react-aria-components` - Already installed, used in KarmaConversionModal

---

## Rollout Strategy

1. **Phase 1 (Critical)** - Deploy immediately after testing
2. **Phase 2 (A11y Quick Wins)** - Can deploy incrementally per component
3. **Phase 3 (Performance)** - Deploy together, measure impact
4. **Phase 4 (Consolidation)** - Internal refactor, no user-facing changes
5. **Phase 5 (Features)** - Deploy per feature as completed
6. **Phase 6 (UX)** - Consider A/B testing collapsible cards

---

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html)
- [Next.js Dynamic Imports](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
