# UI Component Design Decisions - ShadowMaster

## Overview

This document captures the design decisions, patterns, and reusability approach used in building the ShadowMaster UI components. The component architecture is designed for maximum reusability, consistency, and maintainability across the application.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Component Library**: React Aria Components (accessibility-first)
- **Styling**: Tailwind CSS with custom Shadowrun theme
- **State Management**: React Context API (AuthContext, ToastContext)

## Component Architecture

### 1. Layered Component Structure

The component architecture follows a **hierarchical composition pattern** with clear separation of concerns:

```
Pages (Feature-level)
  ↓
Page Layouts (Structure)
  ↓
Domain Components (Feature-specific)
  ↓
Common Components (Reusable primitives)
  ↓
Utility Functions & Helpers
```

#### Layer Descriptions

**Pages** (`src/pages/`)
- Entry points for routes
- Minimal logic - primarily data fetching and state management
- Use DatabasePageLayout for consistent structure
- Example: `GearPage.tsx`, `WeaponsPage.tsx`

**Page Layouts** (`src/components/database/`, `src/components/layout/`)
- Provide consistent page structure
- Handle loading states, view mode toggles
- Examples: `DatabasePageLayout`, `AppLayout`, `TabNavigation`

**Domain Components** (organized by feature folder)
- Feature-specific implementations using common components
- Examples: `GearTable`, `GearViewModal`, `WeaponsTable`
- Always organized by domain: `gear/`, `weapon/`, `armor/`, etc.

**Common Components** (`src/components/common/`)
- Highly reusable, domain-agnostic components
- Generic and configurable through props
- Examples: `DataTable`, `ViewModal`, `FieldDisplay`

### 2. Key Reusable Components

#### DataTable Component

**Purpose**: Provide a feature-rich, reusable table with search, sort, and pagination

**Design Decisions**:
- **Generic Type Support**: `<T extends object>` for type safety
- **Column Definition Pattern**: Declarative column configuration with accessor functions
- **Built-in Features**: Search (with debouncing), sorting, pagination
- **Flexible Rendering**: Custom render functions for cell content
- **Automatic Search Field Detection**: Uses all string fields if not specified
- **Stable Row Keys**: Intelligent key generation (id → name+category → index fallback)

**Key Props**:
```typescript
interface DataTableProps<T extends object> {
  data: T[];                          // Data array
  columns: ColumnDefinition<T>[];      // Column definitions
  searchFields?: (keyof T)[];          // Fields to search (auto-detected if omitted)
  rowsPerPageOptions?: number[];       // Pagination options
  defaultRowsPerPage?: number;
  defaultSortColumn?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  emptyMessage?: string;
  ariaLabel?: string;
  getRowKey?: (row: T, index: number) => string;  // Custom row key generator
}
```

**Usage Pattern**:
```typescript
const columns: ColumnDefinition<Gear>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true,
    render: (value, row) => (
      <button onClick={() => handleClick(row)}>
        {String(value)}
      </button>
    ),
  },
  // ... more columns
];

<DataTable
  data={filteredItems}
  columns={columns}
  searchFields={['name', 'category']}
  defaultRowsPerPage={50}
/>
```

#### GroupedTable Component

**Purpose**: Display hierarchical data with expandable/collapsible groups

**Design Decisions**:
- **Group Key Abstraction**: Consumer provides grouping logic via `getGroupKey` and `getGroupLabel`
- **Auto-expand on Search**: Automatically expands groups containing search matches
- **Expand/Collapse All**: Bulk operations for user convenience
- **Custom Renderers**: Optional custom group header and item row renderers
- **State Management**: Internal state for expanded groups

**Key Props**:
```typescript
interface GroupedTableProps<T> {
  items: T[];
  getGroupKey: (item: T) => string;           // Define grouping logic
  getGroupLabel: (groupKey: string) => string; // Define group display name
  columns: GroupedTableColumn<T>[];
  searchFields?: (keyof T)[];
  onItemClick?: (item: T) => void;
  renderGroupHeader?: (groupKey: string, count: number, isExpanded: boolean) => ReactNode;
  renderItemRow?: (item: T, index: number) => ReactNode;
  autoExpandOnSearch?: boolean;
  defaultExpanded?: boolean;
}
```

**Advanced Grouping**: Supports multi-level grouping (e.g., Category → Subcategory) via custom implementations like `GearTableGrouped`

#### ViewModal Component

**Purpose**: Standardized modal for displaying item details

**Design Decisions**:
- **Section-Based Layout**: Content organized into collapsible sections
- **Flexible Content**: Supports both section array or custom children
- **Consistent Header/Footer**: Automatic title, subtitle, close button
- **Nested Modal Support**: Can render child modals (for related items)
- **Configurable Width**: Preset size options (sm, md, lg, xl, 2xl, 4xl, full)
- **Conditional Rendering**: Sections with `condition` prop for selective display

**Key Props**:
```typescript
interface ViewModalProps<T extends { name?: string }> {
  item: T | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subtitle?: ReactNode;
  sections?: ViewModalSection[];  // Pre-built section pattern
  children?: ReactNode;           // Or custom content
  showFooter?: boolean;
  footerContent?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  headerContent?: ReactNode;
  nestedModals?: ReactNode;       // For related item modals
}

interface ViewModalSection {
  title: string;
  content: ReactNode;
  condition?: boolean;  // Conditional rendering
}
```

**Usage Pattern**:
```typescript
<ViewModal
  item={gear}
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  maxWidth="4xl"
>
  {/* Custom content using FieldDisplay components */}
  <Section title="Basic Information">
    <FieldGrid columns={2}>
      <LabelValue label="Name" value={gear.name} />
      <LabelValue label="Category" value={gear.category} />
    </FieldGrid>
  </Section>
</ViewModal>
```

#### FieldDisplay Components

**Purpose**: Standardized field display components for modals and detail views

**Components**:
- **`LabelValue`**: Display a label-value pair
- **`FieldGrid`**: Responsive grid layout for fields (1-4 columns)
- **`Section`**: Group related fields with a title
- **`ArrayDisplay`**: Display arrays as chips/tags
- **`NestedObjectDisplay`**: Display nested objects as formatted JSON
- **`ConditionalField`**: Display field only if condition is true
- **`FormattedValue`**: Display formatted values with empty state handling
- **`FormattedArray`**: Display formatted arrays with empty state handling

**Design Decisions**:
- **Composition Pattern**: Small, focused components that compose well
- **Responsive Grid**: Auto-adjusts to mobile (single column) and desktop (multi-column)
- **Consistent Styling**: Shared color scheme, spacing, typography
- **Type Safety**: Strongly typed with TypeScript

**Usage Pattern**:
```typescript
<Section title="Statistics">
  <FieldGrid columns={2}>
    <LabelValue label="Rating" value={item.rating} />
    <LabelValue label="Cost" value={formatCost(item.cost)} />
    <ConditionalField
      condition={item.wireless_bonus !== undefined}
      label="Wireless Bonus"
      value={item.wireless_bonus.description}
    />
  </FieldGrid>
</Section>

<Section title="Categories">
  <ArrayDisplay items={item.categories} />
</Section>
```

#### DatabasePageLayout Component

**Purpose**: Consistent layout for database/catalog pages

**Design Decisions**:
- **Consistent Header**: Title, description, item count
- **View Mode Toggle**: Optional flat/grouped view switching
- **Loading State**: Integrated loading skeleton
- **Header Actions**: Optional custom action buttons

**Key Props**:
```typescript
interface DatabasePageLayoutProps {
  title: string;
  description: string;
  itemCount: number;
  isLoading: boolean;
  children: ReactNode;
  viewMode?: 'flat' | 'grouped';
  onViewModeChange?: (mode: 'flat' | 'grouped') => void;
  headerActions?: ReactNode;
}
```

### 3. Utility Libraries

#### Table Utilities (`lib/tableUtils.ts`)

**Purpose**: Reusable data manipulation functions

**Functions**:
- `filterData<T>()`: Generic filtering with global search + column filters
- `sortData<T>()`: Generic sorting with null-safe comparison
- `paginateData<T>()`: Generic pagination with metadata

**Design Decisions**:
- **Pure Functions**: No side effects, easy to test
- **Type-Safe**: Full TypeScript generics
- **Null-Safe**: Handles null/undefined gracefully

#### View Modal Utilities (`lib/viewModalUtils.ts`)

**Purpose**: Value formatting helpers for modals

**Functions**:
- `formatValue(value: unknown): string` - Format any value for display
- `formatArray(value: unknown): string` - Format arrays with comma separation
- `toReactNode(value: unknown): ReactNode` - Safe conversion to ReactNode

#### Format Utilities (`lib/formatUtils.ts`)

**Purpose**: Domain-specific formatting functions

**Functions**:
- `formatCost()`: Format currency values
- Additional domain-specific formatters

## Design Principles

### 1. Composition Over Configuration

**Approach**: Build complex components by composing simple, focused components

**Example**: `GearViewModal` composes:
- `ViewModal` (structure)
- `Section` (grouping)
- `FieldGrid` (layout)
- `LabelValue` (individual fields)
- `BonusDisplay`, `RequirementsDisplay` (domain-specific)

**Benefits**:
- Easy to understand and maintain
- Flexible - can reorder, omit, or add sections easily
- Reusable - same components used across all view modals

### 2. Declarative Column Definitions

**Approach**: Configure tables through declarative column definitions rather than template code

**Pattern**:
```typescript
const columns: ColumnDefinition<T>[] = useMemo(() => [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true,
    render: (value, row) => /* custom render */,
  },
], [dependencies]);
```

**Benefits**:
- Separation of data structure from presentation
- Type-safe accessor functions
- Easy to add/remove/reorder columns
- Consistent table behavior across app

### 3. Props-Based Customization

**Approach**: Use props for customization rather than subclassing

**Examples**:
- `ViewModal`: `maxWidth`, `showFooter`, `sections` vs `children`
- `DataTable`: `searchFields`, `defaultRowsPerPage`, `emptyMessage`
- `GroupedTable`: `getGroupKey`, `renderGroupHeader`, `autoExpandOnSearch`

**Benefits**:
- No class hierarchies to manage
- Clear API surface
- Easy to understand customization points

### 4. Smart Defaults with Opt-In Overrides

**Approach**: Provide sensible defaults, allow overrides when needed

**Examples**:
- `DataTable` auto-detects search fields from column types
- `DataTable` provides default row key generation (id → name → index)
- `ViewModal` has default header/footer, but allows custom content
- `GroupedTable` has default group header renderer

**Benefits**:
- Minimal boilerplate for common cases
- Full control when needed
- Progressive complexity

### 5. Type Safety Throughout

**Approach**: Leverage TypeScript generics for type-safe reusable components

**Pattern**:
```typescript
export function DataTable<T extends object>({ ... }: DataTableProps<T>) {
  // Full type inference for columns, accessors, render functions
}
```

**Benefits**:
- Catch errors at compile time
- Excellent IDE autocomplete
- Self-documenting APIs

### 6. Domain-Specific Implementations

**Approach**: Create domain-specific components that leverage common components

**Pattern**:
```
Common Components (generic)
  ↓
Domain Components (customized)
  ↓
Pages (composed)
```

**Example**:
- `DataTable` (generic) → `GearTable` (domain) → `GearPage` (page)
- `ViewModal` (generic) → `GearViewModal` (domain) → used in `GearTable`

**Benefits**:
- Common components stay clean and generic
- Domain knowledge encapsulated in domain components
- Pages remain simple and declarative

### 7. Consistent File Organization

**Structure**:
```
src/
├── components/
│   ├── common/           # Generic reusable components
│   │   ├── DataTable.tsx
│   │   ├── ViewModal.tsx
│   │   └── FieldDisplay.tsx
│   ├── database/         # Database page components
│   │   └── DatabasePageLayout.tsx
│   ├── layout/           # Layout components
│   │   └── AppLayout.tsx
│   ├── gear/             # Gear domain components
│   │   ├── GearTable.tsx
│   │   ├── GearTableGrouped.tsx
│   │   ├── GearViewModal.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── categoryUtils.ts
│   ├── weapon/           # Weapon domain components
│   └── ... (other domains)
├── pages/                # Route pages
│   ├── GearPage.tsx
│   └── ...
├── lib/                  # Utilities
│   ├── tableUtils.ts
│   ├── viewModalUtils.ts
│   ├── formatUtils.ts
│   ├── api.ts
│   └── types.ts
└── contexts/             # React contexts
    └── AuthContext.tsx
```

**Benefits**:
- Easy to find components
- Clear domain boundaries
- Common components isolated from domain logic

## Patterns & Best Practices

### State Management Pattern

**Local State First**: Use local state for UI state (expanded, selected, etc.)

```typescript
const [selectedItem, setSelectedItem] = useState<T | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
```

**Context for Global State**: Use React Context for truly global state (auth, toasts)

**Props for Communication**: Pass data and callbacks through props

### Filtering Pattern

**Multi-Stage Filtering**: Apply filters in order: custom filters → search → sort → paginate

```typescript
const filteredData = useMemo(() => {
  let filtered = data;
  
  // 1. Custom filters (category, source, etc.)
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(item => 
      selectedCategories.includes(item.category)
    );
  }
  
  // 2. Global search (done in DataTable)
  // 3. Sort (done in DataTable)
  // 4. Paginate (done in DataTable)
  
  return filtered;
}, [data, selectedCategories]);
```

### Modal Pattern

**Standard Modal Usage**:
1. State for selected item and modal open/close
2. Click handler sets item and opens modal
3. ViewModal handles display and close

```typescript
const [selectedItem, setSelectedItem] = useState<T | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleItemClick = (item: T) => {
  setSelectedItem(item);
  setIsModalOpen(true);
};

// In render:
<ViewModal
  item={selectedItem}
  isOpen={isModalOpen}
  onOpenChange={setIsModalOpen}
>
  {/* Content */}
</ViewModal>
```

### Performance Optimization Patterns

**Memoization**: Use `useMemo` for expensive computations (filtering, grouping, column definitions)

**Callbacks**: Use `useCallback` for event handlers passed to child components

**Component Memoization**: Use `memo()` for expensive components (optional, profile first)

**Debouncing**: Built into DataTable for search (300ms delay)

```typescript
// Column definitions
const columns = useMemo(() => [
  // ... column definitions
], [dependencies]);

// Filtered data
const filteredData = useMemo(() => {
  // ... filtering logic
}, [data, filters]);

// Event handlers
const handleClick = useCallback((item: T) => {
  setSelectedItem(item);
  setIsModalOpen(true);
}, []);
```

### Accessibility Patterns

**ARIA Labels**: Always provide aria-labels for interactive elements

**Keyboard Navigation**: React Aria Components provide built-in keyboard support

**Focus Management**: React Aria handles focus trapping in modals

**Semantic HTML**: Use appropriate semantic elements (button, table, etc.)

**Screen Reader Support**: Provide meaningful labels and descriptions

```typescript
<button
  onClick={handleClick}
  aria-label={`View details for ${item.name}`}
  className="..."
>
  {item.name}
</button>
```

## Styling Approach

### Tailwind CSS with Custom Theme

**Color Palette** (Shadowrun-themed):
- `sr-accent`: Cyan accent color
- `sr-gray`: Base dark gray
- `sr-light-gray`: Lighter gray for borders/hover
- `sr-darker`: Darker background color

**Utility-First**: Use Tailwind utilities directly in components

**Consistent Spacing**: Use Tailwind's spacing scale (px-4, py-3, gap-2, etc.)

**Responsive Design**: Mobile-first with responsive modifiers (md:, lg:)

**Example**:
```typescript
className="px-4 py-3 bg-sr-gray border border-sr-light-gray rounded-md
  text-gray-100 hover:bg-sr-light-gray focus:outline-none 
  focus:ring-2 focus:ring-sr-accent transition-colors"
```

### Common Styling Patterns

**Card/Container**:
```
bg-sr-gray border border-sr-light-gray rounded-lg
```

**Button**:
```
px-4 py-2 bg-sr-gray border border-sr-light-gray rounded-md
text-gray-100 hover:bg-sr-light-gray focus:outline-none
focus:ring-2 focus:ring-sr-accent transition-colors
```

**Input/TextField**:
```
px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md
text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent
focus:border-transparent
```

**Link/Accent Text**:
```
text-sr-accent hover:text-sr-accent/80 hover:underline cursor-pointer
```

## Testing Considerations

### Component Testing Strategy

**Unit Tests**: Test utility functions (tableUtils, formatUtils)

**Component Tests**: Test common components in isolation

**Integration Tests**: Test domain components with common components

**E2E Tests**: Test complete user flows through pages

### Example Test Cases

**DataTable**:
- Renders with data
- Filters correctly
- Sorts ascending/descending
- Paginates correctly
- Handles empty state

**ViewModal**:
- Opens/closes correctly
- Displays item data
- Renders sections conditionally
- Handles nested modals

**GearTable** (domain component):
- Filters by category
- Filters by source
- Opens modal on click
- Displays correct columns

## Common Customization Scenarios

### Adding a New Database Page

1. **Create domain components** (e.g., `src/components/newdomain/`)
   - `NewItemTable.tsx` - extends `DataTable`
   - `NewItemViewModal.tsx` - extends `ViewModal`
   - Optional: `NewItemTableGrouped.tsx` - extends `GroupedTable`

2. **Create page** (e.g., `src/pages/NewItemPage.tsx`)
   - Fetch data
   - Use `DatabasePageLayout`
   - Render domain components

3. **Define columns** in table component:
   ```typescript
   const columns: ColumnDefinition<NewItem>[] = useMemo(() => [
     { id: 'name', header: 'Name', accessor: 'name', sortable: true },
     // ... more columns
   ], []);
   ```

4. **Build modal** in view modal component:
   ```typescript
   <ViewModal item={item} isOpen={isOpen} onOpenChange={setIsOpen}>
     <Section title="Basic Information">
       <FieldGrid columns={2}>
         <LabelValue label="Name" value={item.name} />
         {/* ... more fields */}
       </FieldGrid>
     </Section>
   </ViewModal>
   ```

### Adding Custom Filters

1. **Create filter component** (e.g., `CategoryFilter.tsx`)
2. **Add state** in parent table component:
   ```typescript
   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   ```
3. **Apply filter** before passing to DataTable:
   ```typescript
   const filteredData = useMemo(() => {
     return data.filter(item => 
       selectedCategories.length === 0 || 
       selectedCategories.includes(item.category)
     );
   }, [data, selectedCategories]);
   ```

### Adding Custom Column Renderers

**Approach**: Use `render` function in column definition

```typescript
{
  id: 'name',
  header: 'Name',
  accessor: 'name',
  render: (value, row) => (
    <button onClick={() => handleClick(row)}>
      {String(value)}
    </button>
  ),
}
```

### Adding Nested/Related Modals

**Approach**: Use `nestedModals` prop in ViewModal

```typescript
<ViewModal
  item={gear}
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  nestedModals={
    <RelatedItemModal
      item={relatedItem}
      isOpen={relatedModalOpen}
      onOpenChange={setRelatedModalOpen}
    />
  }
>
  {/* Main modal content */}
</ViewModal>
```

## Migration Guide

### From Custom Table to DataTable

**Before**:
```typescript
// Custom table with manual sorting, filtering, pagination
```

**After**:
```typescript
<DataTable
  data={items}
  columns={columns}
  searchFields={['name', 'category']}
  defaultRowsPerPage={50}
/>
```

### From Custom Modal to ViewModal

**Before**:
```typescript
// Custom modal with repeated structure
```

**After**:
```typescript
<ViewModal item={item} isOpen={isOpen} onOpenChange={setIsOpen}>
  <Section title="Info">
    <FieldGrid columns={2}>
      <LabelValue label="Name" value={item.name} />
    </FieldGrid>
  </Section>
</ViewModal>
```

## Key Takeaways

1. **Composition is King**: Build complex UIs from simple, focused components
2. **Type Safety Matters**: Use TypeScript generics for reusable components
3. **Props Over Subclassing**: Configure through props, not inheritance
4. **Smart Defaults**: Provide good defaults, allow overrides
5. **Consistent Patterns**: Use the same patterns across all similar features
6. **Separation of Concerns**: Keep generic components generic, domain knowledge in domain components
7. **Performance by Default**: Use memoization and callbacks appropriately
8. **Accessibility First**: React Aria Components provide great accessibility foundation

## Future Enhancements

### Potential Improvements

1. **Virtualization**: Add virtual scrolling for very large datasets (react-window)
2. **Export Functionality**: Add CSV/JSON export to DataTable
3. **Column Visibility**: Allow users to show/hide columns
4. **Saved Filters**: Persist user filter preferences
5. **Drag & Drop**: Reorder columns or rows
6. **Inline Editing**: Edit values directly in table
7. **Bulk Actions**: Select multiple items for bulk operations
8. **Advanced Filtering**: Date ranges, numeric ranges, multi-select filters

### Component Library Evolution

As the application grows, consider:
1. **Component Documentation**: Storybook for component showcase
2. **Unit Tests**: Jest + React Testing Library
3. **Visual Regression**: Chromatic or Percy for visual testing
4. **Performance Monitoring**: React DevTools Profiler for optimization
5. **Design Tokens**: Extract colors, spacing, etc. into design tokens

---

## Questions to Ask When Building New Components

1. **Can I use an existing common component?** (Prefer reuse)
2. **Is this component domain-specific or generic?** (Determines location)
3. **What props does it need for flexibility?** (Design API)
4. **What are the smart defaults?** (Reduce boilerplate)
5. **How will it compose with other components?** (Ensure composability)
6. **Is it accessible?** (ARIA labels, keyboard navigation)
7. **Is it type-safe?** (TypeScript generics, props)
8. **Does it follow existing patterns?** (Consistency)

---

*This document serves as a guide for maintaining consistency and quality when building new UI components for ShadowMaster. The patterns established here should be followed for all new development unless there is a compelling reason to deviate.*

