# Cart-Based Mod Selection Migration Plan

## Overview

This plan outlines the migration of modification modals from single-add to cart-based multi-select pattern, following the implementation in `CyberwareEnhancementModal.tsx`.

## Current State

| Component                 | Item Type              | Modal? | Capacity?   | Current Pattern | Cart?   | Priority  |
| ------------------------- | ---------------------- | ------ | ----------- | --------------- | ------- | --------- |
| CyberwareEnhancementModal | Cyberware Enhancements | Yes    | Yes         | Batch Add       | **YES** | Reference |
| GearModificationModal     | Gear Mods              | Yes    | Yes         | Single Add      | NO      | HIGH      |
| ArmorModificationModal    | Armor Mods             | Yes    | Yes         | Single Add      | NO      | HIGH      |
| WeaponModificationModal   | Weapon Mods            | Yes    | Mount-based | Single Add      | NO      | MEDIUM    |

## Reference Implementation

The `CyberwareEnhancementModal` serves as the template. Key patterns:

```typescript
// 1. Cart state
const [cart, setCart] = useState<EnhancementSelection[]>([]);

// 2. Cart totals computation
const cartTotals = useMemo(() => {
  return cart.reduce(
    (acc, item) => ({
      capacity: acc.capacity + item.capacityCost,
      cost: acc.cost + item.cost,
    }),
    { capacity: 0, cost: 0 }
  );
}, [cart]);

// 3. Effective remaining (accounts for cart)
const effectiveRemainingCapacity = remainingCapacity - cartTotals.capacity;
const effectiveRemainingNuyen = remainingNuyen - cartTotals.cost;

// 4. Cart operations
const handleAddToCart = () => { setCart([...cart, item]); };
const handleRemoveFromCart = (index) => { setCart(prev => prev.filter((_, i) => i !== index)); };
const handleInstallAll = () => { onAdd(cart); resetState(); onClose(); };

// 5. Updated prop signature
onAdd: (items: Selection[]) => void  // Changed from single item
```

## Implementation Tasks

### Phase 1: GearModificationModal (HIGH PRIORITY)

**File:** `/components/creation/gear/GearModificationModal.tsx`

#### 1.1 Update Modal State

- [ ] Add `cart` state for selected mods
- [ ] Add `cartTotals` memo for capacity/cost tracking
- [ ] Compute `effectiveRemainingCapacity` and `effectiveRemainingNuyen`

#### 1.2 Update Modal UI

- [ ] Change "Install" button to "Add to Cart"
- [ ] Add cart section at bottom with:
  - Cart count and totals display
  - Individual items as removable chips
  - "Clear all" button
- [ ] Add "Install All" button in footer
- [ ] Add "Cancel" button alongside
- [ ] Show "X in cart" badge on items already in cart
- [ ] Update header to show effective remaining capacity

#### 1.3 Update Selection Logic

- [ ] Update validation to check against effective remaining (after cart)
- [ ] Clear selected item after adding to cart (not close modal)
- [ ] Reset cart on modal close

#### 1.4 Update Type Signature

- [ ] Change `onInstall: (mod, rating) => void` to `onInstall: (mods: GearModSelection[]) => void`

#### 1.5 Update Parent Component

**File:** `/components/creation/gear/GearPanel.tsx`

- [ ] Update `handleAddModToGear` to accept array of mods
- [ ] Process all mods in single state update
- [ ] Calculate total capacity cost from all mods

#### 1.6 Update GearRow Component

**File:** `/components/creation/gear/GearRow.tsx`

- [ ] Ensure `onAddMod` callback signature is compatible

---

### Phase 2: ArmorModificationModal (HIGH PRIORITY)

**File:** `/components/creation/armor/ArmorModificationModal.tsx`

#### 2.1 Update Modal State

- [ ] Add `cart` state for selected mods
- [ ] Add `cartTotals` memo
- [ ] Compute effective remaining values

#### 2.2 Update Modal UI

- [ ] Change "Install" to "Add to Cart"
- [ ] Add cart section (same pattern as gear)
- [ ] Add "Install All" / "Cancel" footer buttons
- [ ] Show cart count badges on items
- [ ] Update header with effective capacity

#### 2.3 Update Selection Logic

- [ ] Validate against effective remaining
- [ ] Clear selection after add to cart
- [ ] Reset on close

#### 2.4 Update Type Signature

- [ ] Change `onInstall` to accept array

#### 2.5 Update Parent Component

**File:** `/components/creation/armor/ArmorPanel.tsx`

- [ ] Update `handleAddModToArmor` to accept array
- [ ] Single state update for batch install

#### 2.6 Update ArmorRow Component

**File:** `/components/creation/armor/ArmorRow.tsx`

- [ ] Ensure callback compatibility

---

### Phase 3: WeaponModificationModal (MEDIUM PRIORITY)

**File:** `/components/creation/weapons/WeaponModificationModal.tsx`

This component has a **different constraint model** - mount-based instead of capacity-based.

#### 3.1 Special Considerations

- Weapons have mount slots: top, under, side, barrel, stock, internal
- Each mount can only hold one mod
- Need to track which mounts are occupied in cart
- Must prevent adding two mods to same mount in one cart session

#### 3.2 Update Modal State

- [ ] Add `cart` state
- [ ] Track occupied mounts in cart (not just capacity)
- [ ] Compute which mounts are available (existing + cart)

#### 3.3 Update Modal UI

- [ ] Add cart section showing mods by mount
- [ ] Disable mount options already in cart
- [ ] Show mount conflicts clearly
- [ ] Add Install All / Cancel footer

#### 3.4 Update Validation

- [ ] Check mount availability including cart items
- [ ] Prevent duplicate mount selections

#### 3.5 Update Parent Component

**File:** `/components/creation/WeaponsPanel.tsx`

- [ ] Update handler to accept array of mods
- [ ] Process all mods in single state update

---

## Selection Type Definitions

### GearModSelection (to create)

```typescript
interface GearModSelection {
  catalogId: string;
  name: string;
  category: string;
  capacityCost: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  rating?: number;
}
```

### ArmorModSelection (to create)

```typescript
interface ArmorModSelection {
  catalogId: string;
  name: string;
  capacityCost: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  rating?: number;
}
```

### WeaponModSelection (to create)

```typescript
interface WeaponModSelection {
  catalogId: string;
  name: string;
  mount: WeaponMount; // Special: mount location
  cost: number;
  availability: number;
  legality?: ItemLegality;
  rating?: number;
}
```

---

## UI Pattern Reference

### Cart Section Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Cart (3)  — [5] capacity, 2,500¥                Clear all  │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│ │ Mod Name [2] ✕   │ │ Other Mod [1] ✕  │ │ Third [2] ✕  │ │
│ └──────────────────┘ └──────────────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│              [ Cancel ]        [ Install All (3) ]          │
└─────────────────────────────────────────────────────────────┘
```

### Item Badge

```
┌─────────────────────────────────────┐
│ Mod Name              ┌──────────┐ │
│ [2] 500¥              │ 1 in cart│ │
└─────────────────────────────────────┘
```

---

## Testing Checklist

### For Each Modal:

- [ ] Can add single item to cart
- [ ] Can add multiple items to cart
- [ ] Cart totals update correctly
- [ ] Can remove items from cart
- [ ] "Clear all" empties cart
- [ ] Capacity validation accounts for cart items
- [ ] Cost validation accounts for cart items
- [ ] Items show "in cart" badge
- [ ] Install All processes all items
- [ ] Single state update (no flicker)
- [ ] Modal resets on close
- [ ] Karma conversion prompt shows combined total

### Edge Cases:

- [ ] Adding item that exactly fills remaining capacity
- [ ] Removing item frees up capacity for others
- [ ] Empty cart disables Install All button
- [ ] Cancel discards cart without installing

---

## Estimated Effort

| Phase | Component                              | Effort                        |
| ----- | -------------------------------------- | ----------------------------- |
| 1     | GearModificationModal + GearPanel      | ~1-2 hours                    |
| 2     | ArmorModificationModal + ArmorPanel    | ~1-2 hours                    |
| 3     | WeaponModificationModal + WeaponsPanel | ~2-3 hours (mount complexity) |

**Total:** ~4-7 hours

---

## Files to Modify

### Phase 1 (Gear)

- `components/creation/gear/GearModificationModal.tsx`
- `components/creation/gear/GearPanel.tsx`
- `components/creation/gear/GearRow.tsx` (if needed)

### Phase 2 (Armor)

- `components/creation/armor/ArmorModificationModal.tsx`
- `components/creation/armor/ArmorPanel.tsx`
- `components/creation/armor/ArmorRow.tsx` (if needed)

### Phase 3 (Weapons)

- `components/creation/weapons/WeaponModificationModal.tsx`
- `components/creation/WeaponsPanel.tsx`
- `components/creation/weapons/WeaponRow.tsx` (if needed)

---

## Notes

- The CyberwareEnhancementModal implementation is the canonical reference
- All three modals follow similar split-pane designs, making the pattern portable
- Weapon mods need special handling due to mount-based constraints
- Consider extracting shared cart components if patterns are identical
