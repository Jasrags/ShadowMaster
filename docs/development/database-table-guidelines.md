# Database Table UI Guidelines

This document provides guidelines and a prompt template for building new data tables in the ShadowMaster UI. Follow these patterns to ensure consistency, performance, and maintainability.

## Quick Reference Prompt

When building a new data table, use this prompt:

```
Create a new database table page following our established UI patterns:

1. **Page Component** (`web/ui/src/pages/[Entity]Page.tsx`):
   - Use `DatabasePageLayout` wrapper component
   - Implement data fetching with `useCallback` and `useEffect`
   - Use `useToast` for error handling
   - Include view mode state if table has grouped/flat views
   - Pass all required props to `DatabasePageLayout`

2. **Table Component** (`web/ui/src/components/[entity]/[Entity]Table.tsx`):
   - Wrap component with `React.memo`
   - Memoize column definitions with `useMemo`
   - Use `useCallback` for event handlers (e.g., `handleNameClick`)
   - Use `DataTable` component from `../common/DataTable`
   - Include filters above the table if applicable
   - Include view modal for item details

3. **Performance Requirements**:
   - All table components must be memoized with `React.memo`
   - Column definitions must be wrapped in `useMemo`
   - Event handlers must use `useCallback`
   - Filtered data must use `useMemo` with proper dependencies

4. **DataTable Configuration**:
   - Provide `searchFields` array for searchable columns
   - Set appropriate `rowsPerPageOptions` (typically [25, 50, 100, 200])
   - Set `defaultRowsPerPage` to 50
   - Set `defaultSortColumn` to 'name' (or primary identifier)
   - Provide descriptive `searchPlaceholder`, `emptyMessage`, and `emptySearchMessage`
   - Include `ariaLabel` for accessibility

5. **Key Generation**:
   - DataTable automatically generates stable keys from row data
   - For items with `id` field, it will use the ID
   - For items without IDs, it creates composite keys from name + category
   - No need to manually specify `getRowKey` unless you have special requirements

6. **Loading States**:
   - Loading is handled automatically by `DatabasePageLayout`
   - Uses `LoadingSkeleton` component for better UX
   - No need to manually implement loading UI

7. **View Modes** (if applicable):
   - If table has both flat and grouped views, include view mode toggle
   - Pass `viewMode` and `onViewModeChange` to `DatabasePageLayout`
   - Conditionally render `[Entity]Table` vs `[Entity]TableGrouped` based on view mode

8. **File Structure**:
   - Page: `web/ui/src/pages/[Entity]Page.tsx`
   - Table: `web/ui/src/components/[entity]/[Entity]Table.tsx`
   - Grouped Table (if needed): `web/ui/src/components/[entity]/[Entity]TableGrouped.tsx`
   - View Modal: `web/ui/src/components/[entity]/[Entity]ViewModal.tsx`
   - Filters: `web/ui/src/components/[entity]/[Entity]CategoryFilter.tsx`, etc.

Entity: [Your entity name here]
API endpoint: [Your API endpoint]
Type definition: [Your TypeScript type]
```

## Detailed Guidelines

### 1. Page Component Structure

Every database page should follow this structure:

```typescript
import { useEffect, useState, useCallback } from 'react';
import { [entity]Api } from '../lib/api';
import type { [Entity] } from '../lib/types';
import { useToast } from '../contexts/ToastContext';
import { [Entity]Table } from '../components/[entity]/[Entity]Table';
import { [Entity]TableGrouped } from '../components/[entity]/[Entity]TableGrouped'; // if applicable
import { DatabasePageLayout } from '../components/database/DatabasePageLayout';

export function [Entity]Page() {
  const { showError } = useToast();
  const [[entity], set[Entity]] = useState<[Entity][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped'); // if applicable

  const load[Entity] = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await [entity]Api.get[Entity]();
      set[Entity](data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to load [entity]`;
      showError(`Failed to load [entity]`, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    load[Entity]();
  }, [load[Entity]]);

  return (
    <DatabasePageLayout
      title="[Entity] Database"
      description="View and search all available [entity] from Shadowrun 5th Edition"
      itemCount={[entity].length}
      isLoading={isLoading}
      viewMode={viewMode} // if applicable
      onViewModeChange={setViewMode} // if applicable
    >
      {viewMode === 'grouped' ? ( // if applicable
        <[Entity]TableGrouped [entity]={[entity]} />
      ) : (
        <[Entity]Table [entity]={[entity]} />
      )}
    </DatabasePageLayout>
  );
}
```

### 2. Table Component Structure

Every table component should follow this structure:

```typescript
import { useState, useMemo, memo, useCallback } from 'react';
import { DataTable, ColumnDefinition } from '../common/DataTable';
import type { [Entity] } from '../../lib/types';
import { [Entity]ViewModal } from './[Entity]ViewModal';
// Import filters as needed

interface [Entity]TableProps {
  [entity]: [Entity][];
  // Additional props like maps, etc. if needed
}

export const [Entity]Table = memo(function [Entity]Table({ [entity] }: [Entity]TableProps) {
  const [selected[Entity], setSelected[Entity]] = useState<[Entity] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['SR5']);

  // Memoize filtered data
  const filtered[Entity] = useMemo(() => {
    let filtered = [entity];
    // Apply filters
    return filtered;
  }, [[entity], selectedCategories, selectedSources]);

  // Memoize event handlers
  const handleNameClick = useCallback((item: [Entity]) => {
    setSelected[Entity](item);
    setIsModalOpen(true);
  }, []);

  // Memoize column definitions
  const columns: ColumnDefinition<[Entity]>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (value: unknown, row: [Entity]) => (
        <button
          onClick={() => handleNameClick(row)}
          className="text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer text-left"
        >
          {String(value || '')}
        </button>
      ),
    },
    // Add more columns...
  ], [handleNameClick]);

  return (
    <>
      {/* Filters */}
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-start gap-4">
          {/* Filter components */}
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={filtered[Entity]}
        columns={columns}
        searchFields={['name', 'category', 'source']}
        searchPlaceholder="Search [entity] by name, category, or source..."
        rowsPerPageOptions={[25, 50, 100, 200]}
        defaultRowsPerPage={50}
        defaultSortColumn="name"
        defaultSortDirection="asc"
        emptyMessage="No [entity] available"
        emptySearchMessage="No [entity] found matching your search criteria."
        ariaLabel="[Entity] data table"
      />

      {/* View Modal */}
      <[Entity]ViewModal
        [entity]={selected[Entity]}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
});
```

### 3. Performance Best Practices

#### Memoization Requirements

1. **Component Memoization**: Always wrap table components with `React.memo`
   ```typescript
   export const [Entity]Table = memo(function [Entity]Table({ ... }) { ... });
   ```

2. **Column Definitions**: Always memoize column arrays
   ```typescript
   const columns = useMemo(() => [...], [dependencies]);
   ```

3. **Event Handlers**: Always use `useCallback` for handlers passed to columns
   ```typescript
   const handleNameClick = useCallback((item) => { ... }, []);
   ```

4. **Filtered Data**: Always memoize filtered/computed data
   ```typescript
   const filteredData = useMemo(() => { ... }, [data, filters]);
   ```

#### Dependencies

- Include all dependencies in `useMemo` and `useCallback` dependency arrays
- Be careful with object/array dependencies - they should be stable references

### 4. DataTable Configuration

#### Required Props

- `data`: The filtered data array
- `columns`: Memoized column definitions
- `searchFields`: Array of field names to search
- `searchPlaceholder`: Descriptive placeholder text
- `rowsPerPageOptions`: Array of page size options
- `defaultRowsPerPage`: Default page size (typically 50)
- `defaultSortColumn`: Column to sort by default (typically 'name')
- `defaultSortDirection`: 'asc' or 'desc' (typically 'asc')
- `emptyMessage`: Message when no data available
- `emptySearchMessage`: Message when search returns no results
- `ariaLabel`: Accessibility label for the table

#### Optional Props

- `getRowKey`: Custom key generator (usually not needed - DataTable handles this automatically)

### 5. Key Generation

The `DataTable` component automatically generates stable keys:

1. **Items with `id` field**: Uses the ID directly
2. **Items without IDs**: Creates composite key from `name::category`
3. **Fallback**: Uses index-based key (rare)

You typically don't need to provide `getRowKey` unless you have special requirements.

### 6. Loading States

Loading is handled automatically by `DatabasePageLayout`:

- Shows `LoadingSkeleton` during data fetch
- Displays title and description even while loading
- Shows view mode toggle if applicable
- No manual loading UI needed in page component

### 7. View Modes

If your table supports both flat and grouped views:

1. Add `viewMode` state to page component
2. Pass `viewMode` and `onViewModeChange` to `DatabasePageLayout`
3. Conditionally render table components based on view mode
4. Create `[Entity]TableGrouped` component following same patterns

If your table only has one view, omit the view mode props.

### 8. Filters

Common filter patterns:

- **Category Filter**: Filter by item category
- **Source Filter**: Filter by source book
- **Custom Filters**: Add as needed

Filters should:
- Be placed above the DataTable in a flex container
- Use consistent styling and spacing
- Update filtered data through memoized computations

### 9. Column Definitions

#### Standard Column Pattern

```typescript
{
  id: 'fieldName',
  header: 'Display Name',
  accessor: 'fieldName', // or function: (row) => row.fieldName
  sortable: true,
  render: (value, row) => { /* optional custom render */ }
}
```

#### Common Column Types

1. **Name Column** (clickable, opens modal):
   ```typescript
   {
     id: 'name',
     header: 'Name',
     accessor: 'name',
     sortable: true,
     render: (value, row) => (
       <button onClick={() => handleNameClick(row)} className="...">
         {String(value || '')}
       </button>
     ),
   }
   ```

2. **Simple Field Column**:
   ```typescript
   {
     id: 'field',
     header: 'Field',
     accessor: 'field',
     sortable: true,
   }
   ```

3. **Computed/Formatted Column**:
   ```typescript
   {
     id: 'computed',
     header: 'Computed',
     accessor: (row) => computeValue(row),
     sortable: true,
   }
   ```

4. **Nullable Field Column**:
   ```typescript
   {
     id: 'optional',
     header: 'Optional',
     accessor: (row) => row.optional || '-',
     sortable: true,
   }
   ```

### 10. Error Handling

Use `useToast` for error handling:

```typescript
const { showError } = useToast();

try {
  // ... fetch data
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
  showError('Failed to load [entity]', errorMessage);
}
```

### 11. Type Safety

- Always import and use proper TypeScript types
- Type all props interfaces
- Use type assertions carefully (prefer type guards)
- Ensure API response types match component expectations

### 12. Accessibility

- Always provide `ariaLabel` for DataTable
- Use semantic HTML elements
- Ensure keyboard navigation works
- Test with screen readers

## Example: Complete Implementation

See these files for reference implementations:

- **Page**: `web/ui/src/pages/GearPage.tsx`
- **Table**: `web/ui/src/components/gear/GearTable.tsx`
- **Grouped Table**: `web/ui/src/components/gear/GearTableGrouped.tsx`
- **Simple Table** (no view modes): `web/ui/src/pages/BooksPage.tsx`
- **Table with Maps**: `web/ui/src/pages/ArmorPage.tsx` (uses gearMap)

## Checklist

When creating a new data table, ensure:

- [ ] Page component uses `DatabasePageLayout`
- [ ] Table component wrapped with `React.memo`
- [ ] Column definitions memoized with `useMemo`
- [ ] Event handlers use `useCallback`
- [ ] Filtered data memoized with `useMemo`
- [ ] Proper error handling with `useToast`
- [ ] Loading states handled by `DatabasePageLayout`
- [ ] View mode toggle included if applicable
- [ ] All DataTable props properly configured
- [ ] Accessibility labels provided
- [ ] TypeScript types properly defined
- [ ] File structure follows conventions
- [ ] Code follows existing patterns

## Common Pitfalls to Avoid

1. **Forgetting memoization**: Always memoize components, columns, and handlers
2. **Missing dependencies**: Include all dependencies in memoization hooks
3. **Manual loading UI**: Don't create custom loading states - use `DatabasePageLayout`
4. **Unstable keys**: Don't use index-based keys - DataTable handles this
5. **Not using shared components**: Always use `DatabasePageLayout` and `ViewModeToggle`
6. **Inconsistent styling**: Follow existing patterns for buttons, filters, etc.
7. **Missing error handling**: Always wrap API calls in try/catch with toast notifications

## Questions?

If you're unsure about any pattern, refer to existing implementations:
- `GearPage` / `GearTable` - Full featured example with filters and view modes
- `BooksPage` / `BooksTable` - Simple example without view modes
- `ArmorPage` / `ArmorTable` - Example with additional data dependencies (gearMap)

