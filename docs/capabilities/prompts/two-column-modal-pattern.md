# Two-Column Selection Modal Pattern

Convert existing single-pane selection modals to a two-column layout following the SkillModal/SpellModal pattern.

## Reference Files

- `components/creation/skills/SkillModal.tsx` - Primary reference for the pattern
- `components/creation/spells/SpellModal.tsx` - Secondary reference
- `components/ui/BaseModal.tsx` - Modal foundation components

## Structure

### Modal Container

- Use `BaseModalRoot` with `size="full"` and `className="max-w-4xl"`
- Set `<ModalBody scrollable={false}>` to enable independent scroll regions

### Header Section (Fixed)

- `<ModalHeader>` with title and icon
- Search input with `Search` icon
- Category/filter pills (toggleable buttons)
- Optional: warning banners for conflicts/restrictions

### Main Content (Split Pane)

```tsx
<ModalBody scrollable={false}>
  <div className="flex flex-1 overflow-hidden">
    {/* Left Pane - Item List */}
    <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
      {/* Grouped items with sticky category headers */}
    </div>

    {/* Right Pane - Item Details */}
    <div className="w-1/2 overflow-y-auto p-6">
      {selectedItem ? <ItemDetails /> : <EmptyState />}
    </div>
  </div>
</ModalBody>
```

### Footer (Fixed)

- Running count display (left side)
- "Done" button - closes modal
- "Add [Item]" button - adds item, keeps modal open for bulk adding

## State Management

### Required State

```tsx
const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState("");
const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
const [addedThisSession, setAddedThisSession] = useState(0);
// Item-specific configuration state (rating, specs, attributes, etc.)
```

### Two Reset Functions

```tsx
// Full reset on close
const resetState = useCallback(() => {
  setSelectedItemId(null);
  setSearchQuery("");
  setActiveCategory("all");
  setAddedThisSession(0);
  // Reset all item-specific state
}, []);

// Partial reset after adding (preserves search/filters)
const resetForNextItem = useCallback(() => {
  setSelectedItemId(null);
  // Reset only item-specific configuration state
  // PRESERVE: searchQuery, activeCategory
}, []);
```

### Add Handler Pattern

```tsx
const handleAdd = useCallback(
  () => {
    if (!selectedItemId || !canAfford) return;
    onAdd(selectedItemId /* item-specific config */);
    setAddedThisSession((prev) => prev + 1);
    resetForNextItem(); // Keep modal open for bulk adding
  },
  [
    /* deps */
  ]
);
```

## Visual States for List Items

| State         | Style                                                        | Indicator            |
| ------------- | ------------------------------------------------------------ | -------------------- |
| Available     | Default styling                                              | -                    |
| Selected      | `bg-[color]-50 text-[color]-700 dark:bg-[color]-900/30`      | -                    |
| Already Added | `cursor-not-allowed bg-zinc-50 text-zinc-400` + line-through | `<Check />` icon     |
| Unavailable   | `cursor-not-allowed` + reason styling                        | Warning icon + label |

## Left Pane Item Rendering

```tsx
<button
  onClick={() => !isDisabled && setSelectedItemId(item.id)}
  disabled={isDisabled}
  className={cn(
    "flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors",
    isSelected
      ? "bg-[color]-50 text-[color]-700 dark:bg-[color]-900/30 dark:text-[color]-300"
      : isAlreadyAdded
        ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
        : "rounded-md text-zinc-700 hover:outline hover:outline-1 hover:outline-[color]-400 dark:text-zinc-300"
  )}
>
  <span className={isAlreadyAdded ? "line-through" : ""}>{item.name}</span>
  {isAlreadyAdded && <Check className="h-4 w-4 text-emerald-500" />}
</button>
```

## Category Headers (Sticky)

```tsx
<div className="sticky top-0 z-10 bg-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
  {categoryName}
</div>
```

## Right Pane Empty State

```tsx
<div className="flex h-full flex-col items-center justify-center text-zinc-400">
  <[Icon] className="h-12 w-12" />
  <p className="mt-4 text-sm">Select a [item] from the list</p>
</div>
```

## Cost Indicator Pattern

```tsx
<div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Cost</span>
    {isFree ? (
      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
        FREE <span className="text-xs font-normal text-zinc-500">({freeRemaining} remaining)</span>
      </span>
    ) : (
      <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
        <Sparkles className="h-3.5 w-3.5" />
        {cost} karma
      </span>
    )}
  </div>
</div>
```

## Footer Pattern

```tsx
<ModalFooter>
  <div className="text-sm text-zinc-500 dark:text-zinc-400">
    {addedThisSession > 0 && (
      <span className="mr-2 text-emerald-600 dark:text-emerald-400">{addedThisSession} added</span>
    )}
    <span>{budgetInfo}</span>
  </div>
  <div className="flex gap-3">
    <button onClick={close} className="...">
      Done
    </button>
    <button onClick={handleAdd} disabled={!canAdd} className="...">
      Add [Item]
    </button>
  </div>
</ModalFooter>
```

## File Structure

```
components/creation/[items]/
├── [Item]Modal.tsx    # New two-column modal
└── index.ts           # Barrel export
```

## Props Interface

```tsx
interface [Item]ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (itemId: string, /* item-specific config */) => void;
  allItems: [ItemData][];
  existingSelections: [ItemSelection][];
  freeCount: number;           // From priority/budget
  karmaRemaining: number;
  // Item-specific restrictions...
}
```

## Implementation Checklist

- [ ] Create `[items]/[Item]Modal.tsx` with two-column layout
- [ ] Create `[items]/index.ts` barrel export
- [ ] Update parent card to import and use new modal
- [ ] Remove inline modal code from parent card
- [ ] Add `onAdd` callback that handles item-specific config
- [ ] Verify type checking passes
- [ ] Test multi-add workflow
- [ ] Test search preservation after add
- [ ] Test item-specific configuration (if applicable)

---

## Placeholders to Replace

| Placeholder        | Description                  | Example                         |
| ------------------ | ---------------------------- | ------------------------------- |
| `[COMPONENT_NAME]` | Parent card component        | `QualitiesCard`                 |
| `[Item]`           | Item type (PascalCase)       | `Quality`, `Power`, `Gear`      |
| `[items]`          | Item type (lowercase plural) | `qualities`, `powers`, `gear`   |
| `[ItemData]`       | Data type from ruleset       | `QualityData`, `AdeptPowerData` |
| `[ItemSelection]`  | Selection type               | `QualitySelection`, `string`    |
| `[color]`          | Theme color                  | `emerald`, `blue`, `amber`      |
| `[Icon]`           | Lucide icon                  | `Sparkles`, `Shield`, `Zap`     |

## Existing Implementations

| Component  | Modal                   | Color Theme |
| ---------- | ----------------------- | ----------- |
| SkillsCard | `skills/SkillModal.tsx` | blue        |
| SpellsCard | `spells/SpellModal.tsx` | emerald     |
