# Stats Card Pattern

## Overview

Stats cards are used for allocating points within defined ranges during character creation. Unlike purchase cards (which use modals to browse catalogs), stats cards provide inline controls for adjusting numeric values against a budget.

**Purpose:** Cards that allow allocating points from a budget to various stats or items using +/- controls.

**Reference Implementations:**

- `/components/creation/AttributesCard.tsx` - Core and special attribute allocation
- `/components/creation/SkillsCard.tsx` - Skill and skill group allocation
- `/components/creation/knowledge-languages/KnowledgeLanguagesCard.tsx` - Knowledge skills and languages
- `/components/creation/PrioritySelectionCard.tsx` - Drag-and-drop priority assignment

## Pattern Structure

### 1. Budget Indicator(s) at Top

Stats cards display one or more budget indicators showing points spent vs. total available.

```tsx
<BudgetIndicator
  label="Attribute Points"
  spent={pointsSpent}
  total={pointsTotal}
  tooltip="Priority A"
  karmaRequired={overBudget ? karmaRequired : undefined}
  compact
/>
```

**Key Properties:**

- `label` - Descriptive label for the budget
- `spent` / `total` - Progress values
- `tooltip` - Source of the budget (e.g., "Priority A", "Based on INT + LOG")
- `karmaRequired` - Optional karma overflow indicator
- `compact` - Smaller display for cards with multiple budgets

**Multiple Budgets:** Cards like AttributesCard and SkillsCard display two budget bars:

```tsx
<div className="grid gap-3 sm:grid-cols-2">
  <BudgetIndicator label="Skill Points" ... />
  <BudgetIndicator label="Group Points" ... />
</div>
```

### 2. Grouped Sections with Headers

Stats are organized into logical sections with consistent headers:

```tsx
<div>
  <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
    Physical
  </h4>
  <div className="rounded-lg border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-700 dark:bg-zinc-900">
    {/* Stat rows */}
  </div>
</div>
```

**Header Styling:**

- Font: `text-[10px] font-semibold uppercase tracking-wider`
- Color: `text-zinc-500 dark:text-zinc-400`
- Margin: `mb-1` (4px below)

**Section Container:**

- Border: `border border-zinc-200 dark:border-zinc-700`
- Background: `bg-white dark:bg-zinc-900`
- Padding: `px-3 py-1`
- Rounded: `rounded-lg`

### 3. Stat Row with +/- Controls

Each stat row displays the stat name, range, current value, and +/- buttons:

```tsx
<div className="flex items-center justify-between py-1.5">
  {/* Left: Name with optional icon and tooltip */}
  <div className="flex items-center gap-1.5">
    {Icon && <Icon className="h-3.5 w-3.5 text-purple-500" />}
    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{name}</span>
    <Tooltip content={`${name}: ${description}`}>
      <button aria-label={`Info about ${name}`}>
        <Info className="h-3 w-3 cursor-help text-zinc-400" />
      </button>
    </Tooltip>
  </div>

  {/* Right: Range + Controls + MAX badge */}
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
      {min}-{max}
    </span>

    <div className="flex items-center gap-1" role="group" aria-label={`${name} controls`}>
      {/* Decrease button */}
      <button
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label={`Decrease ${name}`}
        className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
          canDecrease
            ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
            : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
        }`}
      >
        <Minus className="h-3 w-3" />
      </button>

      {/* Value display */}
      <div
        className="flex h-7 w-8 items-center justify-center rounded bg-zinc-100 text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
        aria-live="polite"
      >
        {value}
      </div>

      {/* Increase button */}
      <button
        onClick={onIncrease}
        disabled={!canIncrease}
        aria-label={`Increase ${name}`}
        className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
          canIncrease
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
        }`}
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>

    {/* MAX badge */}
    {isAtMax && (
      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
        MAX
      </span>
    )}
  </div>
</div>
```

**Control Button Sizes:**

- Button: `h-6 w-6` (24px)
- Icon: `h-3 w-3` (12px)
- Value display: `h-7 w-8` (28px × 32px)

**Button Colors:**

- Decrease (enabled): `bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200`
- Increase (enabled): `bg-emerald-500 text-white hover:bg-emerald-600`
- Disabled: `bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600`

**Custom Accent Colors:** Special attributes use category-specific colors:

```tsx
const SPECIAL_ATTR_CONFIG = {
  edge: {
    buttonColor: "bg-amber-500 hover:bg-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/50",
  },
  magic: {
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
  },
  resonance: {
    buttonColor: "bg-cyan-500 hover:bg-cyan-600",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/50",
  },
};
```

### 4. Section Headers with Add Buttons (Modal-Based Sections)

For sections that allow adding items via modal (like skills), use the standard section header pattern:

```tsx
<div className="mb-1 flex items-center justify-between">
  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
    Skills
  </h4>
  <button
    onClick={() => setIsModalOpen(true)}
    className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
  >
    <Plus className="h-3.5 w-3.5" />
    Skill
  </button>
</div>
```

### 5. Empty State

When a section has no items, display a dashed border empty state:

```tsx
<div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
  <p className="text-xs text-zinc-400 dark:text-zinc-500">No skills added</p>
</div>
```

### 6. Summary Footer

Display a summary of allocations at the bottom:

```tsx
<div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
  <span className="text-xs text-zinc-500 dark:text-zinc-400">
    {count} skill{count !== 1 ? "s" : ""}
  </span>
  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{pointsSpent} pts</span>
</div>
```

### 7. Locked/Pending States

Display locked states when prerequisites are not met:

```tsx
// Awaiting priority
<div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
  <Lock className="h-5 w-5 text-zinc-400" />
  <p className="text-sm text-zinc-500 dark:text-zinc-400">
    Set priorities to unlock attributes
  </p>
</div>

// Awaiting metatype (informational)
<div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
  <Lock className="h-4 w-4 text-blue-500" />
  <p className="text-sm text-blue-700 dark:text-blue-300">
    Select a metatype to see adjusted attribute ranges
  </p>
</div>
```

## Accessibility Requirements

### Keyboard Navigation

All +/- controls must support keyboard navigation:

```tsx
<div
  role="group"
  aria-label={`${name} controls`}
  onKeyDown={(e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      if (canDecrease) onDecrease();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      if (canIncrease) onIncrease();
    }
  }}
>
```

### ARIA Labels

- Buttons must have `aria-label` describing the action: `aria-label={`Decrease ${name}`}`
- Value display should have `aria-live="polite"` for screen reader announcements
- Groups should have `role="group"` and `aria-label`

### Focus Styles

All interactive elements must have visible focus indicators:

```tsx
className =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1";
```

## Validation Status

Stats cards use the standard `CreationCard` status prop:

| Status    | When Used                              |
| --------- | -------------------------------------- |
| `pending` | No allocations made, waiting for input |
| `warning` | Partial allocations or over budget     |
| `valid`   | All points allocated correctly         |
| `error`   | Conflict or invalid state              |

```tsx
const validationStatus = useMemo(() => {
  if (isOverBudget) return "error";
  if (pointsRemaining === 0) return "valid";
  if (pointsSpent > 0) return "warning";
  return "pending";
}, [isOverBudget, pointsRemaining, pointsSpent]);

<CreationCard title="Attributes" status={validationStatus}>
```

## Anti-Patterns

### 1. Full-Width Add Buttons

**Wrong:**

```tsx
<button className="flex w-full items-center justify-center rounded-lg border-2 border-dashed py-3">
  <Plus /> Add Skill
</button>
```

**Correct:** Use compact amber button in section header (see Section Headers with Add Buttons).

### 2. Missing Budget Indicators

Stats cards must always show budget progress at the top. Don't rely on external budget displays.

### 3. Inconsistent Control Sizing

All +/- buttons must be `h-6 w-6` (24px). Value displays must be `h-7 w-8`.

### 4. Missing Keyboard Support

All stat controls must support Arrow key navigation.

### 5. Missing MAX Badge

When a stat reaches its maximum value, display the MAX badge.

## Audit Checklist

| #   | Requirement                                   | Status |
| --- | --------------------------------------------- | ------ |
| 1   | Budget indicator(s) at top                    | ☐      |
| 2   | Grouped sections with uppercase headers       | ☐      |
| 3   | +/- controls with consistent sizing (h-6 w-6) | ☐      |
| 4   | Emerald increase button, zinc decrease button | ☐      |
| 5   | Value display with h-7 w-8                    | ☐      |
| 6   | MAX badge when at maximum                     | ☐      |
| 7   | Keyboard arrow key navigation                 | ☐      |
| 8   | ARIA labels on all controls                   | ☐      |
| 9   | aria-live on value displays                   | ☐      |
| 10  | Dashed empty state for empty sections         | ☐      |
| 11  | Summary footer with count/total               | ☐      |
| 12  | Locked state when prerequisites not met       | ☐      |
| 13  | Dark mode support                             | ☐      |

## Component Relationships

```
CreationCard (shared)
├── BudgetIndicator (shared) - one or more
├── Section Header
│   └── Add Button (if modal-based)
├── Section Container
│   └── Stat Rows (inline +/- controls)
├── Empty State (if no items)
└── Summary Footer
```

## Related Patterns

- **Purchase Card Pattern** - For catalog-based selection with modals
- **Selection Modal Pattern** - For browsing and selecting from catalogs
- **Configuration Card Pattern** - For single-selection configuration
