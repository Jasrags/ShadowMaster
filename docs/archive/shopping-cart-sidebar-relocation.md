# Feature Request: Shopping Cart Sidebar Relocation
## (Move Shopping Cart to Right Sidebar for Improved Content Space)

## Overview
**Feature Name:** Shopping Cart Sidebar Relocation
**Requested By:** User
**Date:** December 9, 2025
**Priority:** Medium
**Category:** UI/UX, Character Creation
**Affected Editions:** All editions (SR5 initially, architecture supports all)

---

## Problem Statement
**What problem does this solve?**
The Shopping Cart (used in Augmentations, Gear, and potentially other purchase-based creation steps) currently occupies a column within the main content area, reducing the horizontal space available for browsing and selecting items from catalogs. On narrower screens or when browsing complex item tables with many columns (Item, Essence, Cost, Availability, Grade, Action), the layout becomes cramped.

**Who would benefit from this?**
- **Players creating characters:** More screen real estate for browsing gear/augmentation catalogs
- **Users on medium-sized screens (1280-1440px):** Currently lose significant catalog space to the embedded cart
- **GMs reviewing character builds:** Cleaner separation between catalog browsing and selected items

**Current Workaround:**
Users must work within a constrained 2-column catalog area (in a 3-column grid where the cart takes 1 column). The `GearStep` and `AugmentationsStep` both use `lg:grid-cols-3` with the cart/selections panel consuming `lg:col-span-1`.

**Game Impact:**
Makes it harder to compare items side-by-side, especially for augmentations where multiple data columns (Essence, Cost, Availability, Grade) are important for decision-making.

---

## Proposed Solution
**Feature Description:**
Relocate the Shopping Cart component to the right sidebar (currently occupied by `ValidationPanel`), positioning it between the existing Priorities section and the Validation Messages section. The cart section would be:
1. **Contextual:** Only visible when the current step uses a shopping cart (Augmentations, Gear)
2. **Collapsible:** Can be collapsed to save space when not actively managing cart
3. **Scrollable:** Independent scroll for cart items when the list is long
4. **Integrated:** Shares visual style with existing sidebar sections

**User Stories:**
- As a player building a street samurai, I want the augmentation catalog to use the full content width so that I can compare cyberware options more easily
- As a player purchasing gear, I want to see my cart at a glance in the sidebar so that I don't lose context while browsing
- As a user on a laptop, I want my selections to not reduce catalog browsing space so that I can see more items at once

**Key Functionality:**
1. Create a new `ShoppingCartPanel` component for the sidebar
2. Extend `ValidationPanel` (or create a new wrapper) to conditionally render the cart
3. Pass cart data and callbacks from step components to sidebar via props or context
4. Remove embedded cart columns from `GearStep` and `AugmentationsStep`
5. Update grid layouts in affected steps to use full width (`lg:grid-cols-1` or remove grid)

---

## Game Mechanics Integration
**Related Game Rules:**
- SR5 Core Rulebook: Character Creation (Nuyen spending, Augmentation selection)
- Availability limits at character creation (12 max)
- Essence tracking for augmentations
- Karma-to-Nuyen conversion for gear purchasing

**Rules Compliance:**
- Cart must continue to display running totals (Nuyen spent, Essence lost)
- Must maintain validation state (e.g., exceeding budget, availability limits)
- Must integrate with existing budget tracking in `CreationState`

**Edition Considerations:**
- This is a UI change that affects all editions equally
- Cart data structure (`GearItem[]`, `CyberwareItem[]`, `BiowareItem[]`) remains unchanged
- Sidebar cart rendering will use the same format/calculation hooks

---

## User Experience
**User Flow:**
1. User navigates to Augmentations or Gear step
2. Shopping Cart section appears in right sidebar (below Priorities, above Validation)
3. User browses catalog in full-width main content area
4. Clicking "Add" adds item to sidebar cart (with visual feedback)
5. User can remove items from sidebar cart
6. Cart totals update in real-time
7. User proceeds to next step; cart section disappears if not relevant

**UI/UX Considerations:**
- **Visual Hierarchy:** Cart section should be clearly distinguished from Priorities and Resources
- **Animations:** Smooth expand/collapse for cart section; fade in/out items on add/remove
- **Badge Indicators:** Show item count badge on cart header when collapsed
- **Scrolling:** Cart items should scroll independently; max height ~300px before scroll
- **Accessibility:** Announce cart updates to screen readers; keyboard navigation for remove actions

**Character Sheet Integration:**
- No impact on final character sheet display
- Cart is a creation-only feature

**Example/Inspiration:**
- E-commerce sidebar carts (Amazon, etc.) - sticky, always visible, scrollable
- Hero Lab's purchase panels (right-aligned, persistent during equipment selection)
- Current `ValidationPanel` section styling (match existing patterns)

---

## Technical Considerations
**Technical Approach:**

### Option A: Lift Cart State to CreationWizard (Recommended)
1. Add cart-related state and callbacks to `CreationWizard`
2. Pass as props to `ValidationPanel` (renamed to `RightSidebar` or extended)
3. Step components call parent callbacks instead of managing internal cart state

### Option B: React Context for Cart
1. Create `ShoppingCartContext` with cart state and mutations
2. Wrap `CreationWizard` with provider
3. Both steps and sidebar consume from context

**Data Requirements:**
- **Already Available:** `CreationState.selections.gear`, `CreationState.selections.cyberware`, `CreationState.selections.bioware`
- **Budget Values:** `budgetValues["nuyen"]`, essence calculations already computed in steps
- **Step Identification:** `currentStep.id` to determine if cart should be visible

**Current Component Structure:**

```
CreationWizard
├── StepperSidebar (left)
├── Main Content
│   └── Step Components (GearStep, AugmentationsStep, etc.)
│       └── [Embedded Shopping Cart] <-- REMOVE THIS
└── ValidationPanel (right)
    └── [Add ShoppingCart section here]
```

**Proposed Component Structure:**

```
CreationWizard
├── StepperSidebar (left)
├── Main Content
│   └── Step Components (full width catalogs)
└── RightSidebarPanel (right)
    ├── Resources
    ├── Selections
    ├── Priorities
    ├── ShoppingCart <-- NEW (conditional)
    └── Validation
```

**Affected Files:**
- `app/characters/create/components/ValidationPanel.tsx` - Extend or rename to include cart
- `app/characters/create/components/CreationWizard.tsx` - Lift state, pass props
- `app/characters/create/components/steps/GearStep.tsx` - Remove embedded cart, update layout
- `app/characters/create/components/steps/AugmentationsStep.tsx` - Remove embedded cart, update layout
- New: `app/characters/create/components/ShoppingCartSection.tsx` - Extracted cart UI

**Performance:**
- No significant performance impact; cart updates are already real-time
- Removing grid complexity may slightly improve layout calculations
- Consider `useMemo` for cart totals if not already optimized

**Integration Points:**
- Integrate with existing `CreationState` (no new state structure needed)
- Reuse existing `addGearItem`, `removeGearItem`, `addCyberware`, etc. functions
- Budget display in sidebar already exists; cart display complements this

---

## Acceptance Criteria
- [ ] Shopping Cart section appears in right sidebar when on Gear or Augmentations step
- [ ] Cart section does NOT appear when on other steps (Priorities, Attributes, Skills, etc.)
- [ ] `GearStep` catalog uses full content width (no right column for cart)
- [ ] `AugmentationsStep` catalog uses full content width (no right column for cart)
- [ ] Items can be added to cart from step content (Add button still works)
- [ ] Items can be removed from sidebar cart (Remove button works)
- [ ] Cart totals display correctly (Nuyen spent, Essence lost for augmentations)
- [ ] Cart section is scrollable when items exceed max height
- [ ] Sidebar maintains visual consistency with existing sections
- [ ] Cart state persists correctly during step navigation and draft auto-save
- [ ] Responsive behavior: cart section stacks appropriately on mobile (if applicable)

---

## Success Metrics
**How will we measure success?**
- **User feedback:** "More room to browse gear" type positive comments
- **Usability:** Reduced horizontal scrolling in item tables
- **Development:** Cleaner separation of concerns (cart logic vs. catalog logic)

**Target Goals:**
- Catalog content area gains ~288px (current cart column width) on desktop
- Maintain feature parity with current cart functionality
- No regressions in creation workflow

---

## Game Rules Validation
**Test Cases:**
- Add multiple gear items, verify cart shows all with correct quantities and subtotals
- Add augmentations with different grades, verify essence/cost calculations in cart
- Remove items from cart, verify totals update correctly
- Exceed budget in cart, verify validation error appears
- Switch between steps, verify cart persists when returning to Gear/Augmentations
- Complete creation, verify all cart items appear on final character

**Rules Compliance Verification:**
- Compare final character with manually calculated builds
- Verify availability restrictions still enforced
- Verify essence limits still enforced

---

## Alternatives Considered
**Alternative 1: Collapsible Cart in Main Content**
- Description: Keep cart in main content but make it collapsible/expandable
- Why not chosen: Still takes horizontal space when expanded; partial solution

**Alternative 2: Modal Cart**
- Description: Cart appears as a modal overlay when clicking a cart icon
- Why not chosen: Disrupts flow; requires extra click to view cart; less discoverable

**Alternative 3: Bottom Drawer Cart**
- Description: Cart slides up from bottom of content area
- Why not chosen: Takes vertical space; conflicts with footer navigation; unusual pattern

**Alternative 4: Tab-based Interface**
- Description: Main content has tabs: "Catalog" | "Cart"
- Why not chosen: Can't see catalog and cart simultaneously; less convenient

---

## Additional Context
**Related Features:**
- Existing issue: `B8.1.4 - Fix GearStep shopping cart width` in `beta_implementation_plan_v2.md`
- Future consideration: Collapsible left sidebar (would further maximize content space)

**Game System Context:**
- Fits within character creation wizard framework
- Aligns with design goal of maximizing catalog browsing efficiency
- No impact on ruleset architecture or data storage

**Community Feedback:**
- General UX best practice: minimize secondary content intrusion on primary task area
- Similar tools (Chummer, Hero Lab) often use persistent right-panel for selections

**Timeline Considerations:**
- Can be implemented incrementally: start with GearStep, then Augmentations
- No external dependencies; purely frontend work
- Suggest pairing with collapsible sidebar work if planned

---

## Questions
- [ ] Should the cart section be collapsible by default or expanded?
- [ ] Should item additions show a toast/animation, or is sidebar update sufficient feedback?
- [ ] Should the cart show separate sections for Gear/Augmentations on steps that have both, or is this single-purpose per step?
- [ ] Should there be a "Clear Cart" bulk action, or is item-by-item removal sufficient?
- [ ] For future: Should other steps (Contacts? Spells?) also use this sidebar cart pattern?

---

## Implementation Notes

### Current Cart Locations to Refactor

**GearStep.tsx** (Lines 584-641):
```tsx
{/* Right Column: Shopping Cart */}
<div className="lg:col-span-1">
  <div className="sticky top-4 rounded-lg border ...">
    <h3 className="mb-3 text-sm font-medium">Shopping Cart</h3>
    {/* Cart items and totals */}
  </div>
</div>
```

**AugmentationsStep.tsx** (Lines 994-1108):
```tsx
{/* Selected Augmentations Column */}
<div className="lg:col-span-1">
  <div className="sticky top-4 rounded-lg border ...">
    <h3 className="mb-3 text-sm font-medium">Installed Augmentations</h3>
    {/* Cyberware and Bioware sections */}
  </div>
</div>
```

### Sidebar Section Order (Proposed)
1. Resources (existing)
2. Selections Summary (existing)
3. Priorities (existing)
4. **Shopping Cart / Installed Augmentations** (NEW - conditional)
5. Validation Messages (existing)

### Props to Pass to Sidebar
```typescript
interface ShoppingCartSectionProps {
  // Visibility
  isVisible: boolean;
  cartType: 'gear' | 'augmentations' | null;
  
  // Gear cart
  gearItems?: GearItem[];
  onRemoveGear?: (index: number) => void;
  gearTotal?: number;
  
  // Augmentation cart
  cyberwareItems?: CyberwareItem[];
  biowareItems?: BiowareItem[];
  onRemoveCyberware?: (index: number) => void;
  onRemoveBioware?: (index: number) => void;
  augmentationTotal?: number;
  essenceLoss?: number;
  
  // Shared
  lifestyleSelected?: Lifestyle | null;
  lifestyleCost?: number;
}
```

