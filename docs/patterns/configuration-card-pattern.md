# Configuration Card Pattern

## Overview

Configuration cards are used for single-selection or small list configuration during character creation. Unlike purchase cards (which browse catalogs with nuyen budgets), configuration cards handle selections that define core character identity or relationships.

**Purpose:** Cards that allow selecting or configuring a single option (or small list) from available choices, often with prerequisites.

**Reference Implementations:**

- `/components/creation/metatype/MetatypeCard.tsx` - Single selection with modal
- `/components/creation/magic-path/MagicPathCard.tsx` - Single selection with inline sub-configuration
- `/components/creation/contacts/ContactsCard.tsx` - List configuration with form modal

## Pattern Variants

### Variant 1: Single Selection Configuration

Used when the user selects exactly one option from a list (e.g., Metatype, Magic Path).

### Variant 2: List Configuration

Used when the user builds a list of configured items (e.g., Contacts, Identities).

## Pattern Structure

### 1. Locked State (Prerequisites Not Met)

When a prerequisite (like priority assignment) is not met, show a locked state:

```tsx
if (!prerequisiteMet) {
  return (
    <CreationCard title="Metatype" description="Select your character's species" status="pending">
      <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
        <Lock className="h-5 w-5 text-zinc-400" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Set Metatype priority first</p>
      </div>
    </CreationCard>
  );
}
```

### 2. Empty State (No Selection)

When no selection has been made, show a dashed border trigger button:

```tsx
<button
  onClick={() => setIsModalOpen(true)}
  className="flex w-full items-center justify-between rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
>
  <span className="text-zinc-500 dark:text-zinc-400">Choose metatype...</span>
  <span className="flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
    Select
    <ChevronRight className="h-4 w-4" />
  </span>
</button>
```

### 3. Selected State (Single Selection)

When an option is selected, show a colored bordered button with "Change" action:

```tsx
<button
  onClick={() => setIsModalOpen(true)}
  className="flex w-full items-center justify-between rounded-lg border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30"
>
  <span className="font-semibold uppercase text-emerald-900 dark:text-emerald-100">
    {selectedOption.name}
  </span>
  <span className="text-sm text-emerald-600 dark:text-emerald-400">Change</span>
</button>
```

**Color Coding:**
| Selection Type | Border/Background |
|----------------|-------------------|
| Default/Metatype | `emerald` |
| Magic (Awakened) | `purple` |
| Resonance | `cyan` |
| Mundane | `emerald` |

### 4. Selected State Details

Below the selection button, display relevant details using tree formatting:

```tsx
<div className="text-sm">
  <span className="font-medium text-zinc-900 dark:text-zinc-100">Abilities</span>
  <ul className="mt-1 space-y-0.5">
    {features.map((feature, index) => (
      <li key={index} className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
        <span className="text-zinc-400">{index === features.length - 1 ? "└─" : "├─"}</span>
        {feature}
      </li>
    ))}
  </ul>
</div>
```

### 5. Inline Sub-Configuration

For selections that require additional configuration (like Tradition or Mentor Spirit), use expandable inline selectors:

```tsx
<button
  onClick={() => setShowOptions(!showOptions)}
  className="flex w-full items-center justify-between rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-left dark:border-purple-800 dark:bg-purple-900/20"
>
  <div>
    <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
      Tradition {!selectedTradition && "(required)"}
    </div>
    <div className="text-sm text-purple-900 dark:text-purple-100">
      {selectedTraditionData?.name || "Select tradition..."}
    </div>
  </div>
  <ChevronDown
    className={`h-4 w-4 text-purple-500 transition-transform ${showOptions ? "rotate-180" : ""}`}
  />
</button>;

{
  showOptions && (
    <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
            selectedOption === option.id
              ? "bg-purple-100 dark:bg-purple-900/30"
              : "hover:outline hover:outline-1 hover:outline-purple-400"
          }`}
        >
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{option.name}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{option.description}</div>
        </button>
      ))}
    </div>
  );
}
```

### 6. List Configuration (Contacts Pattern)

For list-based configuration, use the header action pattern with item list:

```tsx
<CreationCard
  title="Contacts"
  status={items.length > 0 ? "valid" : "pending"}
  headerAction={
    <button
      onClick={handleOpenAddModal}
      disabled={!canAdd}
      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        canAdd
          ? "bg-amber-500 text-white hover:bg-amber-600"
          : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
      }`}
    >
      <Plus className="h-4 w-4" />
      Contact
    </button>
  }
>
```

**Item Row Pattern:**

```tsx
<div className="flex items-center justify-between rounded-md border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800/50">
  <div className="min-w-0 flex-1">
    <div className="flex items-center gap-2">
      <User className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
      <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {item.name}
      </span>
      {item.type && (
        <span className="flex-shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
          {item.type}
        </span>
      )}
    </div>
  </div>

  <div className="flex items-center gap-1">
    <button
      onClick={() => handleEdit(index)}
      className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
    >
      <Edit2 className="h-3.5 w-3.5" />
    </button>
    <div className="mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
    <button
      onClick={() => handleRemove(index)}
      className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  </div>
</div>
```

### 7. Budget Indicator (For Point-Based Configuration)

For configurations with point budgets (like Contacts), display a compact progress bar:

```tsx
<div className="space-y-1">
  <div className="flex items-center justify-between text-xs">
    <span className="flex cursor-help items-center gap-1 text-zinc-600 dark:text-zinc-400">
      Contact Points
      <Info className="h-3 w-3 text-zinc-400" />
    </span>
    <span className={`font-medium ${remaining === 0 ? "text-emerald-600" : "text-zinc-900"}`}>
      {spent} / {total}
    </span>
  </div>
  <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
    <div
      className={`h-full transition-all ${remaining === 0 ? "bg-emerald-500" : "bg-indigo-500"}`}
      style={{ width: `${Math.min(100, (spent / total) * 100)}%` }}
    />
  </div>
</div>
```

### 8. Empty State (List Configuration)

```tsx
{
  items.length === 0 && (
    <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
      <p className="text-xs text-zinc-400 dark:text-zinc-500">No contacts added</p>
    </div>
  );
}
```

### 9. Summary Footer

```tsx
{
  items.length > 0 && (
    <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        Total: {items.length} contact{items.length !== 1 ? "s" : ""}
      </span>
      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{totalPoints} pts</span>
    </div>
  );
}
```

## Collapsible Behavior

Configuration cards can auto-collapse when valid:

```tsx
<CreationCard
  title="Metatype"
  status={validationStatus}
  collapsible={!!selectedOption}
  collapsedSummary={<span>Human • 5 SAP • 2 traits</span>}
  autoCollapseOnValid
>
```

## Modal Pattern

Configuration modals are simpler than selection modals (no split-pane layout):

```tsx
<ConfigModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onConfirm={handleSelect}
  options={availableOptions}
  currentSelection={selectedOption}
/>
```

Modal features:

- List of selectable options
- Current selection highlighted
- Confirm/Cancel buttons
- Option details on selection

## Validation Status

| Status    | When Used                                                    |
| --------- | ------------------------------------------------------------ |
| `pending` | Prerequisite not met or no selection                         |
| `warning` | Partial configuration (e.g., path selected but no tradition) |
| `valid`   | All required selections made                                 |
| `error`   | Invalid configuration                                        |

```tsx
const validationStatus = useMemo(() => {
  if (!prerequisiteMet) return "pending";
  if (!selectedOption) return "warning";
  if (requiresSubConfig && !subConfigComplete) return "warning";
  return "valid";
}, [prerequisiteMet, selectedOption, requiresSubConfig, subConfigComplete]);
```

## Anti-Patterns

### 1. Using Purchase Modal for Configuration

Configuration doesn't need split-pane layouts or nuyen tracking. Use simpler single-column modals.

### 2. Missing Locked State

Always show locked state when prerequisites are not met.

### 3. Inconsistent "Select" / "Change" Buttons

Empty state should show "Select" with dashed border. Selected state should show "Change" with solid colored border.

### 4. No Tree Formatting for Details

Use `├─` and `└─` prefixes for feature/trait lists to maintain visual hierarchy.

### 5. Missing Auto-Collapse

Single-selection configuration cards should auto-collapse when valid to reduce visual clutter.

## Audit Checklist

| #   | Requirement                                   | Status |
| --- | --------------------------------------------- | ------ |
| 1   | Locked state when prerequisite not met        | ☐      |
| 2   | Dashed border "Select" button when empty      | ☐      |
| 3   | Colored border "Change" button when selected  | ☐      |
| 4   | Selected option details with tree formatting  | ☐      |
| 5   | Inline sub-configuration with expand/collapse | ☐      |
| 6   | Budget indicator (if point-based)             | ☐      |
| 7   | Edit and Remove buttons (if list-based)       | ☐      |
| 8   | Dashed empty state for empty lists            | ☐      |
| 9   | Summary footer with count/total               | ☐      |
| 10  | Auto-collapse on valid (single selection)     | ☐      |
| 11  | Validation status reflects completeness       | ☐      |
| 12  | Dark mode support                             | ☐      |

## Component Relationships

```
CreationCard (shared)
├── Locked State (if prerequisite not met)
│   └── Lock icon + message
├── Selection Trigger (if not selected)
│   └── Dashed "Select" button
├── Selected State (if selected)
│   ├── Colored "Change" button
│   ├── Selection details (tree formatting)
│   └── Inline sub-configuration (expandable)
├── Item List (list configuration only)
│   └── Item rows with Edit/Remove
├── Empty State (if no items)
└── Summary Footer

ConfigModal (component-specific)
├── Option list
├── Current selection highlight
└── Confirm/Cancel buttons
```

## Related Patterns

- **Purchase Card Pattern** - For catalog-based purchases with nuyen budgets
- **Selection Modal Pattern** - For browsing large catalogs
- **Stats Card Pattern** - For allocating points with +/- controls
- **Display Card Pattern** - For read-only information display
