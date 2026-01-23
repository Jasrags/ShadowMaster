# Display Card Pattern

## Overview

Display cards present static, computed, or user-entered text information during character creation. Unlike other card patterns, display cards focus on information presentation rather than catalog selection or point allocation.

**Purpose:** Cards that display computed values, accept text input, or show read-only information.

**Reference Implementations:**

- `/components/creation/CharacterInfoCard.tsx` - Text input form
- `/components/creation/DerivedStatsCard.tsx` - Computed statistics display
- `/components/creation/EditionSelector.tsx` - Selection grid (flow step)

## Pattern Variants

### Variant 1: Text Input Form

Used for biographical or descriptive text input (e.g., Character Info).

### Variant 2: Computed Statistics Display

Used for calculated values that auto-update based on other selections (e.g., Derived Stats).

### Variant 3: Selection Grid

Used for initial flow steps with card-based selection (e.g., Edition Selector).

## Pattern Structure

### 1. Text Input Form (CharacterInfoCard Pattern)

#### Form Field Structure

```tsx
<div>
  <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
    Street Name <span className="text-zinc-400">(Required)</span>
  </label>
  <input
    type="text"
    value={value}
    onChange={(e) => handleUpdate(field, e.target.value)}
    className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
    placeholder="Your runner handle"
  />
</div>
```

**Label Styling:**

- Font: `text-xs font-medium`
- Color: `text-zinc-700 dark:text-zinc-300`
- Margin: `mb-1`
- Required/Optional indicator: `<span className="text-zinc-400">(Required)</span>`

**Input Styling:**

- Width: `w-full`
- Padding: `px-2 py-1.5`
- Border: `border border-zinc-300 dark:border-zinc-600`
- Background: `bg-white dark:bg-zinc-800`
- Focus: `focus:border-blue-500 focus:outline-none`
- Text: `text-sm dark:text-zinc-100`
- Rounded: `rounded`

#### Textarea Fields

```tsx
<textarea
  value={value}
  onChange={(e) => handleUpdate(field, e.target.value)}
  rows={2}
  className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
  placeholder="Height, build, distinguishing features..."
/>
```

**Row Guidelines:**

- Short descriptions: `rows={2}`
- Longer content (background): `rows={3}`

#### Word Count Display

```tsx
<div className="flex justify-between text-xs text-zinc-400">
  <span>
    Description: {text.length > 0 ? `${text.split(/\s+/).filter(Boolean).length} words` : "—"}
  </span>
  <span>
    Background:{" "}
    {background.length > 0 ? `${background.split(/\s+/).filter(Boolean).length} words` : "—"}
  </span>
</div>
```

### 2. Computed Statistics Display (DerivedStatsCard Pattern)

#### Stat Block Component

```tsx
function StatBlock({
  label,
  value,
  tooltip,
  colorClass = "bg-zinc-100 dark:bg-zinc-700",
  textColorClass = "text-zinc-900 dark:text-zinc-100",
  labelColorClass = "text-zinc-500 dark:text-zinc-400",
}: {
  label: string;
  value: string | number;
  tooltip?: string;
  colorClass?: string;
  textColorClass?: string;
  labelColorClass?: string;
}) {
  return (
    <div
      className={`rounded p-2 text-center ${tooltip ? "cursor-help" : ""} ${colorClass}`}
      title={tooltip}
    >
      <div className={`text-[10px] font-medium ${labelColorClass}`}>{label}</div>
      <div className={`font-bold ${textColorClass}`}>{value}</div>
    </div>
  );
}
```

**Default Colors:**

- Background: `bg-zinc-100 dark:bg-zinc-700`
- Value text: `text-zinc-900 dark:text-zinc-100`
- Label text: `text-zinc-500 dark:text-zinc-400`

**Color Variants by Category:**
| Category | Background | Text |
|----------|------------|------|
| Initiative | `bg-blue-50 dark:bg-blue-900/20` | `text-blue-700 dark:text-blue-300` |
| Physical CM | `bg-red-50 dark:bg-red-900/20` | `text-red-700 dark:text-red-300` |
| Stun CM | `bg-amber-50 dark:bg-amber-900/20` | `text-amber-700 dark:text-amber-300` |
| Essence | `bg-amber-50 border-amber-200` | `text-amber-700 dark:text-amber-300` |
| Augmented | Add `ring-1 ring-{color}-300` | — |

#### Section Header

```tsx
<div className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
  <Activity className="h-3.5 w-3.5" />
  Initiative
</div>
```

**Section Icons by Category:**
| Category | Icon |
|----------|------|
| Initiative | `Activity` |
| Limits | `Shield` |
| Condition Monitors | `Heart` |
| Secondary Stats | `Brain` |
| Movement | `Footprints` |

#### Grid Layouts

```tsx
{
  /* 3-column for limits, condition monitors */
}
<div className="grid grid-cols-3 gap-2">
  <StatBlock label="Physical" value={physicalLimit} />
  <StatBlock label="Mental" value={mentalLimit} />
  <StatBlock label="Social" value={socialLimit} />
</div>;

{
  /* 2-column for secondary stats, movement */
}
<div className="grid grid-cols-2 gap-2">
  <StatBlock label="Walk" value={`${walkSpeed}m`} />
  <StatBlock label="Run" value={`${runSpeed}m`} />
</div>;

{
  /* 1-column for single prominent stat */
}
<div className="grid grid-cols-1 gap-2">
  <StatBlock label="Initiative" value={`${initiative} + ${dice}d6`} />
</div>;
```

#### Augmentation Indicator

When stats are modified by augmentations, add a ring indicator:

```tsx
colorClass={
  augmentationEffects.initiativeDiceBonus > 0
    ? "bg-blue-100 ring-1 ring-blue-300 dark:bg-blue-900/30 dark:ring-blue-700"
    : "bg-blue-50 dark:bg-blue-900/20"
}
```

#### Essence Warning Panel

```tsx
{
  augmentationEffects.essenceLoss > 0 && (
    <div className="rounded border border-amber-200 bg-amber-50 p-2 text-center dark:border-amber-800 dark:bg-amber-900/20">
      <div className="text-xs font-medium text-amber-600 dark:text-amber-400">Essence</div>
      <div className="font-bold text-amber-700 dark:text-amber-300">{essence.toFixed(2)}</div>
      <div className="text-[10px] text-amber-500">Lost: {essenceLoss.toFixed(2)}</div>
    </div>
  );
}
```

### 3. Selection Grid (EditionSelector Pattern)

For flow steps with multiple options presented as cards:

```tsx
<div className="grid gap-4 sm:grid-cols-2">
  {options.map((option) => (
    <button
      key={option.code}
      onClick={() => onSelect(option.code)}
      className={`relative rounded-xl border-2 p-4 text-left transition-all ${
        option.available
          ? "border-zinc-200 bg-white hover:border-emerald-500 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          : "cursor-not-allowed border-zinc-100 bg-zinc-50 opacity-60"
      }`}
    >
      {/* Badge */}
      <div className="flex items-start justify-between">
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
          {option.year}
        </span>
        {!option.available && (
          <span className="text-xs font-medium text-zinc-400">Coming Soon</span>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{option.name}</h3>

      {/* Description */}
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{option.description}</p>
    </button>
  ))}
</div>
```

## Validation Status

Display cards use validation based on content completion:

```tsx
const validationStatus = useMemo(() => {
  // Text input form
  const hasRequiredField = requiredValue.trim().length > 0;
  const hasOptionalContent = optionalFields.some((f) => f.trim().length > 0);

  if (hasRequiredField) return "valid";
  if (hasOptionalContent) return "warning";
  return "pending";
}, [requiredValue, optionalFields]);

// Computed stats
const validationStatus = hasSourceData ? "valid" : "pending";
```

| Status    | When Used                                     |
| --------- | --------------------------------------------- |
| `pending` | No data entered / no source data              |
| `warning` | Optional data entered but required missing    |
| `valid`   | Required data present / source data available |

## Description Property

Use the card description to show key info or status:

```tsx
// Text input - show entered name or prompt
description={hasName ? characterName : "Name your runner"}

// Computed stats - show key values
description={hasAttributes
  ? `Initiative ${initiative}+${dice}d6 • Limits ${phys}/${ment}/${soc}`
  : "Select attributes to see stats"
}
```

## Tooltips for Computed Values

Add tooltips with formulas for computed statistics:

```tsx
<StatBlock
  label="Physical Limit"
  value={physicalLimit}
  tooltip="Physical Limit: ⌈((STR × 2) + BOD + REA) / 3⌉"
/>
```

**Tooltip Guidelines:**

- Include the formula with abbreviations
- Use mathematical notation (⌈ ⌉ for ceiling)
- Explain what the stat is used for

## Anti-Patterns

### 1. Missing Tooltips on Computed Values

All computed statistics should have tooltips explaining the formula.

### 2. Inconsistent Input Styling

All text inputs must use the same border, padding, and focus styles.

### 3. No Visual Feedback for Augmentation Effects

When augmentations modify stats, show a visual indicator (ring).

### 4. Missing Word Counts

Long text fields should show word counts for user reference.

### 5. No Pending State

Cards should show meaningful descriptions when awaiting data.

## Audit Checklist

| #   | Requirement                                 | Status |
| --- | ------------------------------------------- | ------ |
| 1   | Text inputs have consistent styling         | ☐      |
| 2   | Labels show required/optional indicators    | ☐      |
| 3   | Textareas have appropriate row counts       | ☐      |
| 4   | Word counts displayed for long text fields  | ☐      |
| 5   | Stat blocks use consistent sizing           | ☐      |
| 6   | Section headers have icons                  | ☐      |
| 7   | Grid layouts appropriate for content        | ☐      |
| 8   | Tooltips on computed values                 | ☐      |
| 9   | Augmentation effects visually indicated     | ☐      |
| 10  | Description shows key info or pending state | ☐      |
| 11  | Validation status reflects completion       | ☐      |
| 12  | Dark mode support                           | ☐      |

## Component Relationships

```
CreationCard (shared)
├── Text Input Form
│   ├── Label + Required/Optional indicator
│   ├── Input / Textarea
│   └── Word count display
├── Computed Stats Display
│   ├── Section Header (icon + label)
│   ├── Grid of StatBlocks
│   │   └── StatBlock (label, value, tooltip, colors)
│   └── Special indicators (essence warning)
└── Selection Grid
    └── Option cards with enabled/disabled states
```

## Related Patterns

- **Stats Card Pattern** - For allocating points with +/- controls
- **Configuration Card Pattern** - For single-selection configuration
- **Purchase Card Pattern** - For catalog-based purchases
