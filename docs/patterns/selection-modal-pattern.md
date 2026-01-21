# Selection Modal Pattern

Standard UI/UX pattern for modals that allow browsing and selecting items from a catalog during character creation.

## Overview

This pattern is used for modals where users browse a potentially large catalog of items, view details, and make a purchase/selection. The dual-column layout provides efficient browsing with instant detail preview.

## Applies To

| Component                | Item Type         |
| ------------------------ | ----------------- |
| `WeaponPurchaseModal`    | Weapons           |
| `CommlinkPurchaseModal`  | Commlinks         |
| `CyberdeckPurchaseModal` | Cyberdecks        |
| `ArmorPurchaseModal`     | Armor             |
| `GearPurchaseModal`      | Gear items        |
| `VehicleModal`           | Vehicles          |
| `DroneModal`             | Drones            |
| `AugmentationModal`      | Cyberware/Bioware |

## Required Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  ├─ Title (left)                                           │
│  ├─ Budget info (subtitle)                                 │
│  └─ Close button [X] (right)                               │
├─────────────────────────────────────────────────────────────┤
│  SEARCH BAR                                                 │
│  └─ [🔍 Search {items}...]                                 │
├─────────────────────────────────────────────────────────────┤
│  FILTERS (optional)                                         │
│  └─ [Category Pills]                                       │
├────────────────────────────┬────────────────────────────────┤
│  LEFT COLUMN (50%)         │  RIGHT COLUMN (50%)            │
│                            │                                │
│  Item List (scrollable)    │  Detail Preview                │
│  ┌──────────────────────┐  │  ┌────────────────────────────┐│
│  │ [Item Row]           │  │  │ Item Name                  ││
│  │ [Item Row] ◀ selected│  │  │ Subtitle                   ││
│  │ [Item Row]           │  │  │                            ││
│  │ [Item Row]           │  │  │ Statistics                 ││
│  │ ...                  │  │  │ ┌────────┬────────┐        ││
│  └──────────────────────┘  │  │ │ Stat   │ Value  │        ││
│                            │  │ └────────┴────────┘        ││
│                            │  │                            ││
│                            │  │ [Purchase Button]          ││
│                            │  └────────────────────────────┘│
├────────────────────────────┴────────────────────────────────┤
│  FOOTER                                                     │
│  ├─ Item count / Budget remaining (left)                   │
│  └─ Cancel button (right)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Required Elements

### 1. Modal Container

```tsx
<BaseModalRoot isOpen={isOpen} onClose={handleClose} size="2xl">
  {({ close }) => <div className="flex max-h-[85vh] flex-col overflow-hidden">{/* content */}</div>}
</BaseModalRoot>
```

**Key requirements:**

- Size: `2xl` for dual-column layouts
- Max height: `max-h-[85vh]`
- Flex column layout with overflow hidden

### 2. Header

```tsx
<div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
  <div>
    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
    <p className="text-sm text-zinc-500 dark:text-zinc-400">{budgetInfo}</p>
  </div>
  <button
    onClick={close}
    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
  >
    <X className="h-5 w-5" />
  </button>
</div>
```

**Requirements:**

- Title: `text-lg font-semibold`
- Budget subtitle below title
- Close button with hover states

### 3. Search Bar

```tsx
<div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
    <input
      type="text"
      placeholder="Search {items}..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-{accent}-500 focus:outline-none focus:ring-1 focus:ring-{accent}-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
    />
  </div>
</div>
```

**Requirements:**

- Search icon positioned inside input
- Focus ring with accent color (amber for weapons, cyan for matrix gear, etc.)
- Proper dark mode support

### 4. Split Content Area

```tsx
<div className="flex flex-1 overflow-hidden">
  {/* Left: Item List */}
  <div
    ref={scrollContainerRef}
    className="w-1/2 overflow-y-auto border-r border-zinc-100 p-4 dark:border-zinc-800"
  >
    {/* virtualized list or item rows */}
  </div>

  {/* Right: Detail Preview */}
  <div className="w-1/2 overflow-y-auto p-4">
    {selectedItem ? (
      <DetailPreview item={selectedItem} />
    ) : (
      <EmptyPreview message="Select an item to see details" />
    )}
  </div>
</div>
```

**Requirements:**

- Each column: `w-1/2`
- Border between columns
- Independent scroll for each column
- Empty state when nothing selected

### 5. Item List Row

```tsx
<button
  onClick={onClick}
  disabled={!canAfford}
  className={`w-full rounded-lg border p-2.5 text-left transition-all ${
    isSelected
      ? "border-{accent}-400 bg-{accent}-50 dark:border-{accent}-600 dark:bg-{accent}-900/30"
      : canAfford
        ? "border-zinc-200 bg-white hover:border-{accent}-400 dark:border-zinc-700 dark:bg-zinc-900"
        : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
  }`}
>
  {/* Row content */}
</button>
```

**Requirements:**

- Full width button for accessibility
- Three states: selected, selectable, disabled (can't afford)
- Accent color for selection highlight
- Opacity reduction for disabled items

### 6. Detail Preview

When an item is selected, show:

- **Item name** (`text-lg font-semibold`)
- **Subtitle/type** (`text-sm text-zinc-500`)
- **Statistics section** with label and stat rows
- **Special info boxes** (wireless bonus, legality warnings)
- **Purchase button** (full width, accent colored)

Empty state when nothing selected:

```tsx
<div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-500">
  <p className="text-sm">Select a {itemType} to see details</p>
</div>
```

### 7. Purchase Button (in Detail Preview)

```tsx
<button
  onClick={handlePurchase}
  disabled={!canAfford}
  className={`w-full rounded-lg py-3 text-sm font-medium transition-colors ${
    canAfford
      ? "bg-{accent}-500 text-white hover:bg-{accent}-600"
      : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
  }`}
>
  {canAfford ? `Purchase - ${formatCurrency(cost)}¥` : `Cannot Afford (${formatCurrency(cost)}¥)`}
</button>
```

**Requirements:**

- Full width (`w-full`)
- Accent color when enabled
- Disabled state with zinc colors
- Show cost in button text
- "Cannot Afford" message when disabled

### 8. Footer

```tsx
<div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 dark:border-zinc-700">
  <div className="text-sm text-zinc-500 dark:text-zinc-400">{itemCount} items available</div>
  <button
    onClick={close}
    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
  >
    Cancel
  </button>
</div>
```

**Requirements:**

- Border top separator
- Left: item count or budget info
- Right: Cancel button (text style, no background)

## Accent Colors by Category

| Category                            | Accent Color |
| ----------------------------------- | ------------ |
| Weapons                             | `amber`      |
| Matrix Gear (commlinks, cyberdecks) | `cyan`       |
| Armor                               | `blue`       |
| Vehicles/Drones                     | `emerald`    |
| Augmentations                       | `purple`     |
| General Gear                        | `blue`       |

## Virtualization

For lists with many items (>50), use `@tanstack/react-virtual`:

```tsx
const rowVirtualizer = useVirtualizer({
  count: filteredItems.length,
  getScrollElement: () => scrollContainerRef.current,
  estimateSize: () => 68, // Approximate row height
  overscan: 5,
});
```

## Anti-Patterns (DO NOT USE)

### Single-Column Full List

**Wrong:** Showing all items in a single scrollable column without detail preview.

### Inline Selection Without Modal

**Wrong:** Embedding the full selection UI directly in the card instead of a modal.

### Missing Empty State

**Wrong:** Showing nothing in the right column when no item is selected.

### Non-Disabled Unaffordable Items

**Wrong:** Allowing interaction with items the user can't afford without visual indication.

## Audit Checklist

| Check | Requirement                                        |
| ----- | -------------------------------------------------- |
| ☐     | Uses `BaseModalRoot` with `size="2xl"`             |
| ☐     | Has `max-h-[85vh]` container                       |
| ☐     | Header has title, budget info, close button        |
| ☐     | Search bar with icon inside input                  |
| ☐     | Split content with `w-1/2` columns                 |
| ☐     | Left column has `border-r` separator               |
| ☐     | Both columns have `overflow-y-auto`                |
| ☐     | Item rows have selected/selectable/disabled states |
| ☐     | Detail preview has empty state                     |
| ☐     | Purchase button is full-width with accent color    |
| ☐     | Footer has item count and cancel button            |
| ☐     | All elements have dark mode support                |

## Reference Implementations

- `components/creation/matrix-gear/CommlinkPurchaseModal.tsx` - Simple dual-column
- `components/creation/weapons/WeaponPurchaseModal.tsx` - With category filters
- `components/creation/matrix-gear/CyberdeckPurchaseModal.tsx` - Matrix gear variant

## Related Patterns

- [Purchase Card Pattern](./purchase-card-pattern.md) - Card that opens these modals
- [Form Modal Pattern](./form-modal-pattern.md) - For configuration-based modals
