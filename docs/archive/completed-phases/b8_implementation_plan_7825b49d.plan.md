---
name: B8 Implementation Plan
overview: "Implement B8 phase: UI/UX improvements including collapsible sidebar, mobile optimization, and responsive design enhancements across all application areas."
todos:
  - id: b8-1-stepper-collapse
    content: Make StepperSidebar collapsible with icon-only mode (~64px) when collapsed, 256px when expanded
    status: pending
  - id: b8-2-toggle-button
    content: Add collapse/expand toggle button to StepperSidebar with chevron icon
    status: pending
    dependencies:
      - b8-1-stepper-collapse
  - id: b8-3-persist-state
    content: "Persist StepperSidebar collapse state in localStorage (key: shadow-master:creation-wizard-sidebar-collapsed)"
    status: pending
    dependencies:
      - b8-2-toggle-button
  - id: b8-4-main-sidebars
    content: Make main app sidebars collapsible (app/page.tsx and AuthenticatedLayout.tsx) with same functionality
    status: pending
    dependencies:
      - b8-1-stepper-collapse
      - b8-2-toggle-button
      - b8-3-persist-state
  - id: b8-5-mobile-wizard
    content: Test and fix creation wizard steps on mobile (responsive layouts, touch targets 44x44px, collapsible sections)
    status: pending
  - id: b8-6-mobile-character-sheet
    content: Test and fix character sheet on mobile (responsive layouts, touch targets, no horizontal scroll)
    status: pending
  - id: b8-7-mobile-combat
    content: Test and fix combat tracker on mobile (depends on B4 completion)
    status: pending
  - id: b8-8-mobile-inventory
    content: Test and fix inventory management on mobile (depends on B3 completion)
    status: pending
  - id: b8-9-mobile-enhancements
    content: Add mobile-specific enhancements (swipe gestures, bottom navigation, touch-optimized dice roller)
    status: pending
    dependencies:
      - b8-5-mobile-wizard
      - b8-6-mobile-character-sheet
---

# B8 Implementation Plan: UI/UX Improvements

## Overview

This plan implements Phase B8 from the beta implementation plan, focusing on UI/UX improvements including collapsible sidebar functionality and comprehensive mobile optimization. The implementation addresses desktop layout issues and ensures all features work well on mobile devices.

## Current State Analysis

- **StepperSidebar**: Fixed width (w-64 = 256px) in CreationWizard, no collapse functionality
- **Main App Sidebars**: Fixed width (w-60 = 240px) in app/page.tsx and AuthenticatedLayout.tsx, no collapse functionality
- **GearStep Layout**: Already improved (B8.1.4-6 complete) - side-by-side layout on desktop, stacked on mobile
- **Mobile**: Sidebars hidden behind hamburger menu on mobile, but no desktop collapse option
- **DiceRoller**: Exists but may need touch optimization for mobile

## Implementation Tasks

### Task 1: Make StepperSidebar Collapsible (B8.1.1)

**Files**:

- [`app/characters/create/components/StepperSidebar.tsx`](app/characters/create/components/StepperSidebar.tsx) - Add collapse state
- [`app/characters/create/components/CreationWizard.tsx`](app/characters/create/components/CreationWizard.tsx) - Manage collapse state

**Changes needed**:

1. **Add collapse state**:

- Add `isCollapsed` state (default: false)
- When collapsed: width ~64px (icon-only mode)
- When expanded: width 256px (current width)
- Smooth transition animation

2. **Collapsed mode UI**:

- Show only step number/check icon (no text)
- Show tooltip on hover with step title
- Maintain step indicators (completed check, current step highlight)
- Keep navigation functional

3. **Layout updates**:

- Main content area expands when sidebar collapsed
- Use CSS transitions for smooth width changes
- Ensure content doesn't overflow

### Task 2: Add Collapse/Expand Toggle Button (B8.1.2)

**File**: [`app/characters/create/components/StepperSidebar.tsx`](app/characters/create/components/StepperSidebar.tsx)

**Changes needed**:

1. **Toggle button**:

- Add button at bottom of sidebar (or top)
- Icon: chevron-left (collapsed) / chevron-right (expanded)
- Accessible label: "Collapse sidebar" / "Expand sidebar"
- Position: fixed at bottom of sidebar nav area

2. **Button styling**:

- Subtle styling that doesn't distract
- Hover state for better UX
- Works in both collapsed and expanded states

### Task 3: Persist Sidebar Collapse State (B8.1.3)

**File**: [`app/characters/create/components/StepperSidebar.tsx`](app/characters/create/components/StepperSidebar.tsx)

**Changes needed**:

1. **localStorage persistence**:

- Save collapse state to localStorage on toggle
- Key: `shadow-master:creation-wizard-sidebar-collapsed`
- Load state on component mount
- Default to expanded if no saved state

2. **State management**:

- Use `useState` with `useEffect` to sync with localStorage
- Ensure state persists across page navigation within wizard
- Handle localStorage errors gracefully (fallback to expanded)

### Task 4: Make Main App Sidebars Collapsible (B8.1.1 extension)

**Files**:

- [`app/page.tsx`](app/page.tsx) - Homepage sidebar
- [`app/users/AuthenticatedLayout.tsx`](app/users/AuthenticatedLayout.tsx) - Authenticated layout sidebar

**Changes needed**:

1. **Apply same collapse functionality**:

- Add collapse state management
- Add toggle button
- Add localStorage persistence
- Icon-only mode when collapsed

2. **Consistent behavior**:

- Same collapse width (~64px)
- Same toggle button placement
- Same localStorage key pattern: `shadow-master:sidebar-collapsed`

**Note**: These sidebars are different from StepperSidebar but should have similar collapse behavior.

### Task 5: Mobile Optimization - Creation Wizard (B8.2.1)

**Files**:

- [`app/characters/create/components/CreationWizard.tsx`](app/characters/create/components/CreationWizard.tsx)
- [`app/characters/create/components/steps/*.tsx`](app/characters/create/components/steps/) - All step components

**Changes needed**:

1. **Test on mobile viewport (375px)**:

- Check all wizard steps render correctly
- Verify touch targets are at least 44x44px (accessibility guideline)
- Ensure no horizontal scrolling
- Verify text is readable without zooming

2. **Responsive layout fixes**:

- Ensure step content stacks properly on mobile
- Fix any grid layouts that break on small screens
- Ensure buttons and inputs are touch-friendly
- Add collapsible sections for long content

3. **Touch target improvements**:

- Increase button padding on mobile
- Ensure form inputs are large enough
- Verify checkbox/radio button sizes
- Test navigation buttons

### Task 6: Mobile Optimization - Character Sheet (B8.2.2)

**File**: [`app/characters/[id]/page.tsx`](app/characters/[id]/page.tsx)

**Changes needed**:

1. **Test on mobile viewport**:

- Verify character sheet displays correctly
- Check attribute displays
- Verify skill lists are readable
- Ensure gear/inventory sections work

2. **Responsive fixes**:

- Stack attribute cards on mobile
- Make skill lists scrollable if needed
- Ensure tables are responsive (horizontal scroll or stacked)
- Fix any overflow issues

### Task 7: Mobile Optimization - Combat Tracker (B8.2.3)

**Files**:

- [`app/combat/[sessionId]/page.tsx`](app/combat/[sessionId]/page.tsx) - When created
- [`components/combat/*.tsx`](components/combat/) - When created

**Dependencies**: Requires B4 (Combat Tracker) to be implemented first

**Changes needed**:

1. **Test on mobile viewport**:

- Verify initiative tracker displays correctly
- Check combatant cards are readable
- Ensure action buttons are touch-friendly
- Verify damage modal works on mobile

2. **Responsive fixes**:

- Stack initiative list on mobile
- Make combatant cards scrollable
- Ensure action buttons are large enough
- Fix modal sizing for mobile

### Task 8: Mobile Optimization - Inventory Management (B8.2.4)

**Files**:

- [`app/characters/[characterId]/inventory/page.tsx`](app/characters/[characterId]/inventory/page.tsx) - When created
- [`components/inventory/*.tsx`](components/inventory/) - When created

**Dependencies**: Requires B3 (Inventory Management) to be implemented first

**Changes needed**:

1. **Test on mobile viewport**:

- Verify inventory list displays correctly
- Check item cards are readable
- Ensure add/edit modals work on mobile
- Verify ammo tracker is usable

2. **Responsive fixes**:

- Stack item cards on mobile
- Make modals full-screen on mobile
- Ensure touch targets are adequate
- Fix any overflow issues

### Task 9: Mobile-Specific Enhancements (B8.2.5)

**Files**:

- [`app/characters/create/components/CreationWizard.tsx`](app/characters/create/components/CreationWizard.tsx)
- [`app/combat/[sessionId]/page.tsx`](app/combat/[sessionId]/page.tsx) - When created
- [`components/DiceRoller.tsx`](components/DiceRoller.tsx)

**Changes needed**:

1. **Swipe gestures** (optional enhancement):

- Swipe left/right to navigate wizard steps (mobile only)
- Swipe to dismiss modals
- Use touch event handlers or gesture library

2. **Bottom navigation** (mobile only):

- Add bottom navigation bar for mobile
- Quick access to common actions
- Hide on desktop (use existing sidebar)

3. **Touch-optimized dice roller**:

- Larger touch targets for dice pool controls
- Larger roll button on mobile
- Swipe to roll gesture (optional)
- Better spacing for touch interaction

## Implementation Order

1. **Phase 1: Sidebar Collapse** (Tasks 1, 2, 3, 4)

- Make StepperSidebar collapsible
- Add toggle button
- Add persistence
- Apply to main app sidebars

2. **Phase 2: Mobile Testing & Fixes** (Tasks 5, 6)

- Test and fix creation wizard
- Test and fix character sheet

3. **Phase 3: Future Mobile Optimization** (Tasks 7, 8)

- Combat tracker (after B4)
- Inventory management (after B3)

4. **Phase 4: Mobile Enhancements** (Task 9)

- Add mobile-specific features
- Touch optimizations

## Testing Checklist

- [ ] StepperSidebar can be collapsed/expanded
- [ ] Sidebar collapse state persists in localStorage
- [ ] Collapsed sidebar shows icons only with tooltips
- [ ] Main content expands when sidebar collapsed
- [ ] Main app sidebars can be collapsed/expanded
- [ ] All pages usable on 375px viewport
- [ ] Touch targets meet 44x44px minimum
- [ ] No horizontal scrolling on mobile
- [ ] Text readable without zooming (minimum 16px)
- [ ] Creation wizard steps work on mobile
- [ ] Character sheet displays correctly on mobile
- [ ] Dice roller is touch-friendly
- [ ] Forms and inputs are mobile-friendly

## Acceptance Criteria (from beta_implementation_plan_v2.md)

- **B8.3.AC.1** [ ] Sidebar can be collapsed/expanded
- **B8.3.AC.2** [ ] Sidebar state persists across page navigation
- **B8.3.AC.3** [ ] Gear catalog has adequate width for browsing
- **B8.3.AC.4** [ ] All pages usable on 375px viewport
- **B8.3.AC.5** [ ] Touch targets meet accessibility guidelines
- **B8.3.AC.6** [ ] No horizontal scrolling on mobile
- **B8.3.AC.7** [ ] Text readable without zooming

## Notes

- **Sidebar Widths**: 
- Expanded: 256px (StepperSidebar) or 240px (main app sidebars)
- Collapsed: ~64px (icon-only mode)

- **localStorage Keys**:
- Creation wizard: `shadow-master:creation-wizard-sidebar-collapsed`
- Main app: `shadow-master:sidebar-collapsed`

- **Mobile Breakpoints**: Use Tailwind's responsive breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- Mobile-first approach: design for mobile, enhance for desktop

- **Touch Targets**: Minimum 44x44px per WCAG 2.1 guidelines for mobile accessibility

- **Text Sizing**: Minimum 16px font size on mobile to prevent auto-zoom on iOS

- **GearStep Improvements**: Already complete (B8.1.4-6), verify they work correctly

- **Dependencies**: 
- B8.2.3 depends on B4 (Combat Tracker)
- B8.2.4 depends on B3 (Inventory Management)
- These can be implemented when those phases are complete

- **Progressive Enhancement**: Mobile optimizations should enhance the experience without breaking desktop functionality