# WeaponsPanel Implementation Plan

## Overview

Build a new `WeaponsPanel` component for the sheet-driven character creation (`/characters/create/sheet`) that provides an enhanced weapon purchasing experience with expandable detail flyouts, modification management, and ammunition tracking.

**Integration:** Separate card below `GearCard` in `SheetCreationLayout.tsx`
**Budget:** Shared with existing gear (same `state.selections.weapons` and nuyen budget)
**Accessories:** Treated as weapon modifications (under `weaponMods`)
**Ammo Tracking:** Per-weapon
**Weight:** Deprioritized for now

---

## Data Availability (Verified)

| Data | Status | Location |
|------|--------|----------|
| Weapons catalog | ✅ Complete | `core-rulebook.json` → weapons section |
| Weapon modifications | ✅ 18+ mods | `core-rulebook.json` → modifications.weaponMods |
| Ammunition | ✅ 15+ types | `core-rulebook.json` → gear.ammunition |
| Holsters/Accessories | ✅ In weaponMods | concealable-holster, quick-draw-holster, hidden-arm-slide |
| Mount points | ✅ Defined | top, barrel, under, stock, internal |
| Concealability | ⚠️ On mods only | Need to add base conceal to weapons |

---

## Phase 1: Core Weapons Component

**Goal:** Basic weapon browsing and purchasing with the new UI pattern

### Tasks

- [ ] 1.1 Create `WeaponsPanel.tsx` component shell with collapsible card layout
- [ ] 1.2 Add header with budget display (total, spent, remaining) and `[+ Weapon]` button
- [ ] 1.3 Create `WeaponRow.tsx` - collapsed view showing name, cost, conceal, wireless icon
- [ ] 1.4 Create `WeaponPurchaseModal.tsx` - split-pane modal with category list and detail preview
- [ ] 1.5 Add search and filters (category, availability, price range)
- [ ] 1.6 Wire up weapon purchasing - add to `state.selections.weapons`, update budget
- [ ] 1.7 Add remove weapon functionality
- [ ] 1.8 Integrate into `SheetCreationLayout.tsx` below `GearCard`

### Files Created
- `components/creation/WeaponsPanel.tsx`
- `components/creation/weapons/WeaponRow.tsx`
- `components/creation/weapons/WeaponPurchaseModal.tsx`

---

## Phase 2: Expandable Detail Flyout

**Goal:** Expand purchased weapons to show full stats, wireless bonus, and prepare for mods/ammo

### Tasks

- [ ] 2.1 Add expand/collapse toggle to `WeaponRow.tsx`
- [ ] 2.2 Create `WeaponDetailFlyout.tsx` - expanded view with stats grid, wireless bonus
- [ ] 2.3 Add stats display: Damage, AP, Mode, RC, Ammo capacity, Accuracy, Availability, Conceal
- [ ] 2.4 Add wireless bonus display with hacking warning
- [ ] 2.5 Add placeholder sections for Modifications and Ammunition

### Files Created
- `components/creation/weapons/WeaponDetailFlyout.tsx`

---

## Phase 3: Weapon Modifications

**Goal:** Add modifications to purchased weapons with mount point tracking

### Tasks

- [ ] 3.1 Create `useWeaponModifications()` hook to extract mods from ruleset
- [ ] 3.2 Create `WeaponModificationModal.tsx` - context-aware modal showing compatible mods
- [ ] 3.3 Add mount point indicators (Top, Barrel, Under, Stock, Internal) with status
- [ ] 3.4 Implement `handleInstallMod()` - adds mod, updates occupiedMounts, adds cost
- [ ] 3.5 Display installed mods in flyout with remove button (protect built-in mods)
- [ ] 3.6 Implement `handleRemoveMod()` - removes mod, frees mount, refunds cost
- [ ] 3.7 Add modification cost to budget calculations

### Files Created
- `lib/rules/hooks/useWeaponModifications.ts`
- `components/creation/weapons/WeaponModificationModal.tsx`

---

## Phase 4: Ammunition System

**Goal:** Add ammunition purchasing tied to weapon caliber

### Tasks

- [ ] 4.1 Create `useAmmunition()` hook to extract ammo types from ruleset
- [ ] 4.2 Create `AmmunitionModal.tsx` - shows compatible ammo for weapon's caliber
- [ ] 4.3 Add ammo detail preview (damage modifier, AP modifier, effects)
- [ ] 4.4 Add quantity selector with price update
- [ ] 4.5 Implement ammo tracking per weapon
- [ ] 4.6 Display purchased ammo in flyout with quantity
- [ ] 4.7 Add ammo cost to budget calculations

### Files Created
- `lib/rules/hooks/useAmmunition.ts`
- `components/creation/weapons/AmmunitionModal.tsx`

---

## Phase 5: Polish & Integration

**Goal:** Finalize UX, ensure parity with existing system

### Tasks

- [ ] 5.1 Add empty state messaging ("No weapons purchased")
- [ ] 5.2 Add availability warnings (R/F indicators with tooltips)
- [ ] 5.3 Ensure mobile responsiveness
- [ ] 5.4 Add keyboard navigation for modals
- [ ] 5.5 Write unit tests for hooks and budget calculations
- [ ] 5.6 Remove weapons tab from `GearCard` or mark deprecated

---

## File Structure

```
components/creation/
├── WeaponsPanel.tsx                    # Main component
└── weapons/
    ├── WeaponRow.tsx                   # Collapsed weapon display
    ├── WeaponDetailFlyout.tsx          # Expanded detail view
    ├── WeaponPurchaseModal.tsx         # Browse & buy weapons
    ├── WeaponModificationModal.tsx     # Add mods to weapon
    └── AmmunitionModal.tsx             # Buy ammo for weapon

lib/rules/hooks/
├── useWeaponModifications.ts           # Extract weapon mods from ruleset
└── useAmmunition.ts                    # Extract ammo from ruleset
```

---

## Integration Point

In `SheetCreationLayout.tsx` (around line 455):

```tsx
{/* Gear - Phase 4 */}
<GearCard state={creationState} updateState={updateState} />

{/* NEW: Weapons Panel */}
<WeaponsPanel state={creationState} updateState={updateState} />

{/* Augmentations - Phase 4 */}
<AugmentationsCard state={creationState} updateState={updateState} />
```
