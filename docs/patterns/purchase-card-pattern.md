# Purchase Card Pattern

Standard UI/UX pattern for character creation cards that allow purchasing or selecting items with budgets.

## Overview

This pattern ensures consistent user experience across all creation components that:

- Allow selecting/purchasing items (gear, spells, foci, etc.)
- Track spending against a budget (nuyen, karma, free slots)
- Display lists of selected items with remove functionality

## Applies To

| Component           | Category | Budget Type           |
| ------------------- | -------- | --------------------- |
| `WeaponsPanel`      | Gear     | Nuyen                 |
| `ArmorCard`         | Gear     | Nuyen                 |
| `GearCard`          | Gear     | Nuyen                 |
| `MatrixGearCard`    | Gear     | Nuyen                 |
| `VehiclesCard`      | Gear     | Nuyen                 |
| `AugmentationsCard` | Gear     | Nuyen + Essence       |
| `SpellsCard`        | Magic    | Free Spells + Karma   |
| `FociCard`          | Magic    | Nuyen + Bonding Karma |
| `AdeptPowersCard`   | Magic    | Power Points          |
| `ComplexFormsCard`  | Matrix   | Free Forms + Karma    |

## Required Elements

### 1. Budget Bar (Top of Card)

Shows spent/total with a progress bar indicator.

```
┌─────────────────────────────────────────────────────────────┐
│  Nuyen                              45,000 / 50,000         │
│  [████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  │
└─────────────────────────────────────────────────────────────┘
```

**Required classes:**

```tsx
// Progress bar container
className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"

// Progress bar fill
className="h-full transition-all bg-blue-500" // or bg-red-500 if over budget
style={{ width: `${Math.min(100, (spent / total) * 100)}%` }}
```

### 2. Category Section Header

Header row with collapse toggle, icon, title, count badge, and add button.

```
▼ [Icon] CATEGORY NAME (3)                          [+ Add]
```

**Structure:**

```tsx
<div className="mb-2 flex items-center justify-between">
  {/* Left side: collapse + icon + title + count */}
  <button className="flex items-center gap-2 hover:opacity-80">
    <div className="text-zinc-400">
      {isCollapsed ? (
        <ChevronRight className="h-3.5 w-3.5" />
      ) : (
        <ChevronDown className="h-3.5 w-3.5" />
      )}
    </div>
    <Icon className="h-3.5 w-3.5 {iconColor}" />
    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      {title}
    </span>
    {count > 0 && (
      <span className="rounded-full px-1.5 py-0.5 text-[10px] font-medium {badgeColor}">
        {count}
      </span>
    )}
  </button>

  {/* Right side: Add button */}
  <button className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600">
    <Plus className="h-3 w-3" />
    Add
  </button>
</div>
```

### 3. Add Button Styling (REQUIRED)

All "Add" buttons must use amber styling:

```tsx
className =
  "flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600";
```

**Key properties:**

- Background: `bg-amber-500` with `hover:bg-amber-600`
- Text: `text-white`
- Size: `px-2 py-1 text-xs` (compact)
- Icon: `Plus` at `h-3 w-3`

### 4. Empty State

When no items are selected, show a simple dashed border box with descriptive text.

```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│      No {items} purchased            │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

**Required classes:**

```tsx
// Container
className =
  "rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700";

// Text
className = "text-xs text-zinc-400 dark:text-zinc-500";
```

**Text format:** "No {items} purchased" or "No {items} selected"

### 5. Item List Container

When items are present, display them in a bordered container with dividers.

```tsx
className =
  "rounded-lg border border-zinc-200 bg-white px-3 divide-y divide-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:divide-zinc-800";
```

### 6. Item Row

Each item row should have:

- Icon (category-appropriate color)
- Name with badges (rating, type, etc.)
- Cost on the right
- Remove button (X icon)

```tsx
<div className="flex items-center gap-2 py-2">
  <Icon className="h-4 w-4 shrink-0 text-{color}-500" />
  <div className="min-w-0 flex-1">
    <div className="flex items-center gap-1.5">
      <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{name}</span>
      <span className="rounded bg-{color}-100 px-1.5 py-0.5 text-[10px] font-medium text-{color}-700 dark:bg-{color}-900/40 dark:text-{color}-400">
        {badge}
      </span>
    </div>
  </div>
  <span className="shrink-0 text-xs font-medium text-zinc-600 dark:text-zinc-400">{cost}¥</span>
  <button className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800">
    <X className="h-3.5 w-3.5" />
  </button>
</div>
```

### 7. Footer Summary

Bottom of card showing total count and cost.

```tsx
<div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-700">
  <span className="text-xs text-zinc-500 dark:text-zinc-400">
    Total: {count} item{count !== 1 ? "s" : ""}
  </span>
  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
    {formatCurrency(total)}¥
  </span>
</div>
```

## Anti-Patterns (DO NOT USE)

### Full-Width Dashed Add Buttons

**Wrong:**

```tsx
// DO NOT use full-width dashed buttons for add actions
<button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 py-3 ...">
  <Plus className="h-4 w-4" />
  Add Spell
</button>
```

**Correct:** Use the category section header pattern with compact amber button.

### Color-Themed Add Buttons

**Wrong:**

```tsx
// DO NOT use category-specific colors for add buttons
<button className="... border-purple-300 bg-purple-50 text-purple-700 ...">
  <Plus /> Add Focus
</button>
```

**Correct:** All add buttons use amber: `bg-amber-500 text-white`

### Empty State as Button

**Wrong:**

```tsx
// DO NOT make empty state clickable
<button onClick={openModal} className="border-dashed ...">
  Click to add items
</button>
```

**Correct:** Empty state is purely informational; add button is in the header.

## Audit Checklist

Use this checklist when reviewing purchase card components:

| Check | Requirement                                                 |
| ----- | ----------------------------------------------------------- |
| ☐     | Budget bar at top with progress indicator                   |
| ☐     | Category section header pattern used                        |
| ☐     | Add button uses amber styling (`bg-amber-500`)              |
| ☐     | Add button is compact (`px-2 py-1 text-xs`)                 |
| ☐     | Add button positioned in header (right-aligned)             |
| ☐     | Empty state uses dashed border box                          |
| ☐     | Empty state text is descriptive ("No X purchased/selected") |
| ☐     | No full-width dashed buttons for add actions                |
| ☐     | Item rows have consistent remove button                     |
| ☐     | Footer shows count and total                                |
| ☐     | All elements have dark mode support                         |

## Reference Implementation

See `components/creation/matrix-gear/MatrixGearCard.tsx` for the canonical implementation of this pattern.

## Related Patterns

- [Card Pattern](./card-pattern.md) - Base card structure
- [Modal Pattern](./modal-pattern.md) - Selection modal design
- [Budget Indicator](./budget-indicator.md) - Budget display component
