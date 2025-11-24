<!-- 8edfef72-9db3-4fdf-ab3d-68998d4fa65e a14a8493-f140-4962-b611-a9c7baf1332d -->
# Database UI Optimization Plan

## Overview

The Database UI consists of 8 pages (Gear, Armor, Weapons, Weapon Accessories, Skills, Qualities, Books, Lifestyles) under a nested tab navigation. Analysis reveals several optimization opportunities.

## Issues Identified

### Performance Issues

1. **DataTable uses `rowIndex` as key** (`DataTable.tsx:206`) - React reconciliation issues when data changes
2. **No data caching** - Data refetches on every page navigation
3. **No search debouncing** - Search triggers on every keystroke
4. **Missing React.memo** - Table components re-render unnecessarily
5. **Expensive computations in render** - Grouping/filtering recalculates on every render

### Code Duplication

1. **Page components are nearly identical** - All 8 pages follow same pattern with duplicated code
2. **View mode toggle buttons duplicated** - Same button code in 6 pages
3. **Loading states duplicated** - Same loading UI across all pages
4. **Error handling duplicated** - Same error handling pattern repeated

### UX Inconsistencies

1. **Books and Lifestyles pages missing view mode toggle** - Inconsistent with other pages
2. **No error retry mechanism** - Users must refresh page on errors
3. **No loading skeleton** - Just text "Loading..." instead of skeleton UI

### Code Quality

1. **Missing unique keys** - Some data types lack unique identifiers for React keys
2. **No shared page layout component** - Could extract common structure

## Implementation Plan

### Phase 1: Performance Optimizations

1. **Fix DataTable key generation** (`web/ui/src/components/common/DataTable.tsx`)

- Generate stable keys from row data (use name + category or create composite key)
- For items with IDs (Book, Lifestyle), use ID
- For items without IDs, create stable composite key

2. **Add search debouncing** (`web/ui/src/components/common/DataTable.tsx`)

- Debounce search input (300ms delay)
- Use `useDeferredValue` or custom debounce hook

3. **Memoize table components**

- Wrap `GearTable`, `ArmorTable`, etc. with `React.memo`
- Memoize column definitions in table components

4. **Optimize grouped table computations**

- Ensure `useMemo` dependencies are correct
- Consider virtual scrolling for large datasets

### Phase 2: Code Deduplication

1. **Create shared DatabasePageLayout component** (`web/ui/src/components/database/DatabasePageLayout.tsx`)

- Extract common page structure (header, view mode toggle, loading state)
- Accept props: title, description, data, viewMode, onViewModeChange, children
- Handle loading and error states

2. **Create shared ViewModeToggle component** (`web/ui/src/components/database/ViewModeToggle.tsx`)

- Extract view mode toggle buttons
- Reusable across all database pages

3. **Refactor all database pages** to use shared components

- Update: `GearPage.tsx`, `ArmorPage.tsx`, `WeaponsPage.tsx`, `SkillsPage.tsx`, `QualitiesPage.tsx`
- Add view mode to: `BooksPage.tsx`, `LifestylesPage.tsx` (if applicable)

### Phase 3: Data Management

1. **Add data caching context** (`web/ui/src/contexts/DatabaseContext.tsx`)

- Cache fetched data in context/state management
- Prevent refetching on navigation
- Optional: Use React Query if adding dependency is acceptable

2. **Add error retry mechanism**

- Add retry button to error states
- Implement exponential backoff for retries

### Phase 4: UX Improvements

1. **Add loading skeletons**

- Replace "Loading..." text with skeleton UI
- Match table structure for better perceived performance

2. **Consistent view modes**

- Add view mode toggle to Books and Lifestyles if they have grouped views
- Or remove from pages that don't need it

3. **Improve empty states**

- Better messaging and visual design
- Add helpful actions (clear filters, etc.)

## Files to Modify

### Core Components

- `web/ui/src/components/common/DataTable.tsx` - Key generation, debouncing
- `web/ui/src/components/database/DatabasePageLayout.tsx` - NEW shared layout
- `web/ui/src/components/database/ViewModeToggle.tsx` - NEW shared toggle

### Pages (Refactor to use shared components)

- `web/ui/src/pages/GearPage.tsx`
- `web/ui/src/pages/ArmorPage.tsx`
- `web/ui/src/pages/WeaponsPage.tsx`
- `web/ui/src/pages/WeaponAccessoriesPage.tsx`
- `web/ui/src/pages/SkillsPage.tsx`
- `web/ui/src/pages/QualitiesPage.tsx`
- `web/ui/src/pages/BooksPage.tsx`
- `web/ui/src/pages/LifestylesPage.tsx`

### Optional Enhancements

- `web/ui/src/contexts/DatabaseContext.tsx` - NEW data caching context
- `web/ui/src/components/common/LoadingSkeleton.tsx` - NEW skeleton component

## Priority Order

1. **High Priority**: Fix DataTable keys, add debouncing, create shared layout component
2. **Medium Priority**: Memoize components, add view mode to missing pages, improve loading states
3. **Low Priority**: Data caching context, error retry, loading skeletons

## Testing Considerations

- Verify table sorting/filtering still works after key changes
- Test search debouncing doesn't break UX
- Ensure shared components work across all page types
- Verify no performance regressions with memoization

### To-dos

- [ ] Fix DataTable to use stable keys instead of rowIndex - generate composite keys from row data
- [ ] Add debouncing to search input in DataTable (300ms delay)
- [ ] Create shared DatabasePageLayout component to eliminate code duplication
- [ ] Create shared ViewModeToggle component for consistent UI
- [ ] Refactor all 8 database pages to use shared layout and toggle components
- [ ] Add React.memo to table components and memoize column definitions
- [ ] Add view mode toggle to Books and Lifestyles pages for consistency (if applicable)
- [ ] Replace loading text with skeleton UI components