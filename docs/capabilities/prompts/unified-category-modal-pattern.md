# Unified Category Modal Pattern

**Extends:** [Two-Column Selection Modal Pattern](./two-column-modal-pattern.md)

Convert modals that span multiple distinct types (e.g., cyberware/bioware, ranged/melee weapons) into a unified modal with type toggle buttons, category filters with counts, and sticky category headers.

> **Prerequisites:** This pattern builds on the two-column modal pattern. Ensure you understand the base pattern's state management, reset functions, and split-pane layout before applying these extensions.

## Reference Implementation

- `components/creation/augmentations/AugmentationModal.tsx` - Primary reference
- `components/creation/armor/ArmorPurchaseModal.tsx` - Category counts reference

## When to Use This Pattern

Use this pattern **instead of** the base two-column pattern when:

- A card manages multiple related but distinct item types (e.g., cyberware + bioware)
- Items within each type have subcategories (e.g., headware, eyeware, bodyware)
- You want a single "Add" button instead of multiple type-specific buttons
- The modal should let users browse all types without closing and reopening

## Visual Structure

```
┌─ Add [Item] ─────────────────────────────── [X]─┐
│ [Type A Button] [Type B Button]                 │  ← Type Toggle (NEW)
├─────────────────────────────────────────────────┤
│ [🔍 Search...]                                  │
│ [All(47)] [Cat1(8)] [Cat2(12)] [Cat3(6)] ...   │  ← Counts (NEW)
│ Grade: [Standard ▾]                             │
├─────────────────────────────────────────────────┤
│ ═══ CATEGORY 1 ═══  │ Item Details              │
│ Item A              │                           │
│ Item B              │ Selected Item Name        │
│ ═══ CATEGORY 2 ═══  │ Description text...       │
│ Item C              │                           │
├─────────────────────────────────────────────────┤
│ 2 added | Budget: ¥48,000    [Done] [Add Type]  │
└─────────────────────────────────────────────────┘
```

---

## State Extensions

Add these to the base pattern's state:

```tsx
// Internal type state - allows switching within modal
const [activeType, setActiveType] = useState<ItemType>(initialType);
```

### Type Change Handler

```tsx
// Reset relevant state when switching types
const handleTypeChange = useCallback((newType: ItemType) => {
  setActiveType(newType);
  setCategory("all"); // Reset to show all categories
  setSelectedItemId(null); // Clear selection
  setSelectedRating(1); // Reset item-specific state
}, []);
```

### Extended Reset Function

```tsx
// Add to resetState from base pattern:
const resetState = useCallback(() => {
  // ... base pattern resets ...
  setActiveType(initialType); // Reset to initial type
}, [initialType]);
```

### Sync Type on Modal Open

```tsx
useEffect(() => {
  if (isOpen) {
    setActiveType(initialType);
    setCategory("all");
    setSelectedItemId(null);
  }
}, [isOpen, initialType]);
```

---

## Type Toggle UI

Add below header, above search:

```tsx
<div className="flex gap-2 border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
  <button
    onClick={() => handleTypeChange("typeA")}
    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      activeType === "typeA"
        ? "bg-cyan-500 text-white"
        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
    }`}
  >
    <TypeAIcon className="h-4 w-4" />
    Type A
  </button>
  <button
    onClick={() => handleTypeChange("typeB")}
    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      activeType === "typeB"
        ? "bg-pink-500 text-white"
        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
    }`}
  >
    <TypeBIcon className="h-4 w-4" />
    Type B
  </button>
</div>
```

---

## Category Counts

### Calculation

```tsx
const categoryCounts = useMemo(() => {
  const catalog = activeType === "typeA" ? typeACatalog : typeBCatalog;
  const counts: Record<string, number> = { all: 0 };

  for (const cat of categories) {
    counts[cat.id] = 0;
  }

  catalog?.forEach((item) => {
    if (item.legality === "forbidden") return;
    if ((item.availability ?? 0) > maxAvailability) return;

    counts.all++;
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
  });

  return counts;
}, [activeType, typeACatalog, typeBCatalog, categories, maxAvailability]);
```

### Display in Tabs

```tsx
<button
  key={cat.id}
  onClick={() => setCategory(cat.id)}
  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
    category === cat.id
      ? activeType === "typeA"
        ? "bg-cyan-500 text-white"
        : "bg-pink-500 text-white"
      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
  }`}
>
  {cat.name}
  {categoryCounts[cat.id] > 0 && (
    <span className="ml-1 opacity-70">({categoryCounts[cat.id]})</span>
  )}
</button>
```

---

## Add Handler Extension

Use `activeType` instead of the prop:

```tsx
const handleAdd = useCallback(() => {
  if (!selectedItem || !canAdd) return;

  const selection = {
    type: activeType, // Use internal state, not prop
    catalogId: selectedItem.id,
    name: selectedItem.name,
    // ... other fields
  };

  onAdd(selection);
  setAddedThisSession((prev) => prev + 1);
  resetForNextItem();
}, [selectedItem, canAdd, activeType, onAdd, resetForNextItem]);
```

---

## Card Integration

### Single Add Button

Replace multiple type-specific Add buttons with one in the header:

```tsx
<CreationCard
  title="Items"
  status={validationStatus}
  headerAction={
    selectedItems.length > 0 ? (
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
      >
        <Plus className="h-3 w-3" />
        Add
      </button>
    ) : undefined
  }
>
```

### Single Modal Instance

```tsx
<ItemModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onAdd={handleAddItem}
  initialType="typeA" // Default type, user can switch inside
  // ... other props
/>
```

### Grouped Display with Type Icons

```tsx
const DISPLAY_CATEGORIES = [
  { id: "cyberlimb", label: "Cyberlimbs", type: "cyberware" },
  { id: "headware", label: "Headware", type: "cyberware" },
  { id: "basic", label: "Basic Bioware", type: "bioware" },
  // ... all categories in display order
] as const;

{
  DISPLAY_CATEGORIES.map((cat) => {
    const items = itemsByCategory[cat.id];
    if (!items || items.length === 0) return null;

    return (
      <div key={cat.id}>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-2">
          {cat.type === "typeA" ? (
            <TypeAIcon className="h-3.5 w-3.5 text-cyan-500" />
          ) : (
            <TypeBIcon className="h-3.5 w-3.5 text-pink-500" />
          )}
          <span className="uppercase tracking-wider">{cat.label}</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
              cat.type === "typeA"
                ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300"
                : "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
            }`}
          >
            {items.length}
          </span>
        </div>
        <div className="rounded-lg border ...">{items.map(renderItem)}</div>
      </div>
    );
  });
}
```

---

## Color Themes

| Type      | Active Button   | Category Tab    | Badge               |
| --------- | --------------- | --------------- | ------------------- |
| Cyberware | `bg-cyan-500`   | `bg-cyan-500`   | `bg-cyan-100/900`   |
| Bioware   | `bg-pink-500`   | `bg-pink-500`   | `bg-pink-100/900`   |
| Ranged    | `bg-blue-500`   | `bg-blue-500`   | `bg-blue-100/900`   |
| Melee     | `bg-red-500`    | `bg-red-500`    | `bg-red-100/900`    |
| Magic     | `bg-purple-500` | `bg-purple-500` | `bg-purple-100/900` |

---

## Implementation Checklist

### Modal Extensions (on top of base pattern)

- [ ] Add `activeType` state
- [ ] Add `handleTypeChange` callback
- [ ] Add type toggle UI below header
- [ ] Add `categoryCounts` memo
- [ ] Update category tabs to show counts
- [ ] Update add handler to use `activeType`
- [ ] Add `useEffect` to sync type on modal open

### Card Changes

- [ ] Add `DISPLAY_CATEGORIES` constant
- [ ] Add `allItems` memo combining all types
- [ ] Add `itemsByCategory` memo for card display
- [ ] Replace multiple Add buttons with single header action
- [ ] Replace type-specific sections with unified grouped display
- [ ] Add empty state with centered Add button

---

## Existing Implementations

| Component         | Modal                   | Types              |
| ----------------- | ----------------------- | ------------------ |
| AugmentationsCard | `AugmentationModal.tsx` | Cyberware, Bioware |

---

## Placeholders

| Placeholder     | Description                | Example                          |
| --------------- | -------------------------- | -------------------------------- |
| `[Item]`        | Item type (singular)       | `Augmentation`, `Weapon`         |
| `typeA`/`typeB` | Type identifiers           | `cyberware`/`bioware`            |
| `TypeAIcon`     | Lucide icon for type A     | `Cpu`, `Target`                  |
| `TypeBIcon`     | Lucide icon for type B     | `Heart`, `Sword`                 |
| `initialType`   | Prop name for default type | `augmentationType`, `weaponType` |
