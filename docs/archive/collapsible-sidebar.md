# Feature Request: Collapsible Sidebar

## Overview
**Feature Name:** Collapsible Sidebar with Icon-Only Mode
**Requested By:** Development Team
**Date:** December 7, 2025
**Priority:** Medium
**Category:** UI/UX
**Affected Editions:** All editions

---

## Problem Statement
**What problem does this solve?**
The current sidebar navigation takes up a fixed 240px (w-60) width on desktop, reducing the available horizontal space for main content. Users who are familiar with the navigation items may prefer a more compact view to maximize workspace.

**Who would benefit from this?**
- Players working on complex character sheets who need more screen real estate
- Users on smaller desktop/laptop screens
- Power users who prefer keyboard shortcuts and icon-based navigation

**Current Workaround:**
On mobile, the sidebar is hidden behind a hamburger menu. However, on desktop (lg+ breakpoint), the sidebar is always fully expanded with no option to collapse.

**Game Impact:**
More screen space for character sheets, creation wizards, and data-heavy views improves the overall user experience when managing characters.

---

## Proposed Solution
**Feature Description:**
Add a toggle button to collapse the sidebar to an icon-only mode (approximately 60-64px width). When collapsed, hovering over navigation items displays a tooltip with the full label. The collapsed/expanded state should persist across sessions.

**User Stories:**
- As a player, I want to collapse the sidebar so that I have more space to view my character sheet
- As a user, I want to see tooltips when hovering over collapsed sidebar icons so that I know what each icon represents
- As a returning user, I want my sidebar preference to be remembered so that I don't have to collapse it every time I visit
- As a player creating a character, I want to collapse the stepper sidebar so that I have more room for the creation form

**Key Functionality:**
1. Add a collapse/expand toggle button at the bottom of the sidebar
2. Animate the sidebar width transition smoothly (expanded: 240px, collapsed: ~64px)
3. Hide text labels when collapsed, showing only icons
4. Display tooltips on hover when in collapsed mode
5. Persist collapsed state in localStorage
6. Adjust main content margin to match sidebar state
7. Apply same pattern to StepperSidebar in character creation (show step numbers, tooltip shows title)

---

## User Experience
**User Flow:**
1. User clicks the collapse toggle button at the bottom of the sidebar
2. Sidebar animates from 240px to 64px width
3. Text labels fade out, icons remain centered
4. Main content area expands to fill available space
5. Hovering over any nav item shows a tooltip with the label
6. Clicking toggle again expands sidebar back to full width

**UI/UX Considerations:**
- Collapse button should use a chevron icon (« when expanded, » when collapsed)
- Smooth CSS transition (300ms recommended)
- Tooltips should appear on the right side of the sidebar using React Aria's TooltipTrigger
- Active state indicator should still be visible in collapsed mode
- Disabled items ("Coming Soon") should show both label and status in tooltip
- Badge counts should be visible in collapsed mode (small indicator on icon)

**Collapsed State Layout:**
```
┌──────┐
│  🏠  │  ← Icon centered, tooltip: "Home"
├──────┤
│  👤  │  ← Icon centered, tooltip: "Characters"
├──────┤
│  📖  │  ← Icon centered, tooltip: "Rulesets (Coming Soon)"
├──────┤
│  ⚙️  │  ← Icon centered, tooltip: "Settings (Coming Soon)"
├──────┤
│      │
│  «   │  ← Collapse toggle at bottom
└──────┘
```

**Example/Inspiration:**
- VS Code's activity bar (collapsible with tooltips)
- GitHub's sidebar collapse behavior
- Discord's server sidebar (icon-only with tooltips)

---

## Technical Considerations
**Technical Approach:**
Implement using React state with localStorage persistence. Use Tailwind CSS for responsive width transitions and React Aria Components for accessible tooltips.

**Affected Components:**
- `app/users/AuthenticatedLayout.tsx` - Main sidebar component
- `app/page.tsx` - AuthenticatedHomepage contains duplicate sidebar code
- `app/characters/create/components/StepperSidebar.tsx` - Character creation stepper (in scope)

**Implementation Details:**
1. Create a `useSidebarCollapse` hook for state management with localStorage sync
2. Add `isCollapsed` state to sidebar components
3. Use conditional Tailwind classes for width: `${isCollapsed ? 'w-16' : 'w-60'}`
4. Wrap nav items with `TooltipTrigger` from react-aria-components
5. Add CSS transition: `transition-[width] duration-300 ease-in-out`
6. Adjust main content margin: `${isCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`

**Data Requirements:**
- localStorage key: `sidebar-collapsed` (boolean)
- No server-side storage needed

**Performance:**
- CSS transitions are GPU-accelerated
- localStorage reads are synchronous but fast
- No additional API calls required

**Integration Points:**
- Must coordinate with mobile sidebar toggle (hamburger menu)
- Should not affect mobile behavior (mobile still uses slide-in drawer)
- StepperSidebar in character creation will support same collapse pattern
- Consider shared `useSidebarCollapse` hook with configurable localStorage key

---

## Acceptance Criteria
- [ ] Toggle button visible at bottom of sidebar on desktop (lg+ breakpoint)
- [ ] Clicking toggle collapses sidebar to icon-only mode (~64px width)
- [ ] Text labels hidden when collapsed
- [ ] Tooltips appear on hover for all nav items when collapsed
- [ ] Tooltip shows full label and status (e.g., "Rulesets (Coming Soon)")
- [ ] Smooth animation transition between states (300ms)
- [ ] Main content area adjusts width accordingly
- [ ] Collapsed state persists in localStorage
- [ ] State restored on page load/refresh
- [ ] Active nav item still visually indicated when collapsed
- [ ] Mobile behavior unchanged (hamburger menu still works)
- [ ] Keyboard accessible (Enter/Space to toggle)
- [ ] Screen reader announces state change
- [ ] StepperSidebar in character creation supports same collapse behavior
- [ ] StepperSidebar shows step numbers only when collapsed (tooltip shows step title)
- [ ] StepperSidebar collapse state stored separately from main nav sidebar

---

## Success Metrics
**How will we measure success?**
- User adoption: Track % of users who use the collapse feature
- Usability: No increase in navigation-related support issues
- Performance: No perceptible lag during collapse/expand animation

**Target Goals:**
- Feature is discoverable without documentation
- Animation completes in under 300ms
- Works correctly across Chrome, Firefox, Safari, Edge

---

## Alternatives Considered
**Alternative 1: Floating sidebar overlay**
- Description: Sidebar overlays content instead of pushing it
- Why not chosen: Inconsistent with current layout; obscures content

**Alternative 2: Sidebar tabs (icons always visible)**
- Description: Keep icons always visible in a thin strip, expand on hover
- Why not chosen: Accidental expansion on mouse movement; less intentional UX

**Alternative 3: No collapse, improve responsive behavior**
- Description: Just optimize existing responsive breakpoints
- Why not chosen: Doesn't address the desktop screen real estate concern

---

## Additional Context
**Related Features:**
- Mobile hamburger menu toggle (already implemented)
- Future: User preferences/settings page could include sidebar default state

**Technical Debt:**
- `AuthenticatedLayout.tsx` and `page.tsx` have duplicate sidebar code - consider extracting to shared component during this implementation

**Community Feedback:**
- Common pattern in modern web apps; users expect this functionality

---

## Questions
- [x] Should the StepperSidebar in character creation also support collapsing? **Yes** - Include in scope
- [ ] Should collapse state be per-user (stored on server) or per-device (localStorage)? **Deferred** - Use localStorage for now, revisit when user preferences system is built
- [ ] Should there be a keyboard shortcut to toggle collapse (e.g., Cmd/Ctrl + B)? **Deferred** - Can be added as enhancement later
- [ ] Should the logo/brand in header change when sidebar is collapsed?
