# Weapon Modifications and Mount Points Specification

**Last Updated:** 2025-12-17  
**Status:** Specification  
**Category:** Gear, User Interface, Rules Validation  
**Affected Areas:** Gear selection, weapon customization, character creation wizard, character sheet

---

## Overview

This specification details the implementation of built-in weapon modifications and mount point validation for Shadowrun 5th Edition weapons. It ensures that weapons with integrated features (like the Browning Ultra-Power's laser sight) are correctly represented and that customization follows the mount point and size restrictions defined in the core rules.

**Key Features:**
- **Built-in Modifications**: Automatic installation of non-removable, zero-cost modifications for specific weapons.
- **Mount Point Validation**: Filtering of available modifications based on weapon category and available slots (Top, Under, Side, Barrel, Stock, Internal).
- **Compatibility Filtering**: Validation based on weapon size requirements and specific compatibility/incompatibility lists.
- **Visual Feedback**: UI indicators to distinguish built-in modifications and clear feedback on why modifications are available or restricted.

---

## User Stories

### Player Experience
1. **As a player**, I want built-in modifications to be automatically added when I select a weapon so I don't have to manually track integrated features.
2. **As a player**, I want to see a clear indicator for built-in modifications so I know they are part of the base weapon and cannot be removed.
3. **As a player**, I want the modification selection list to only show accessories that can actually fit on my current weapon so I don't make illegal gear choices.
4. **As a player**, I want to know why certain modifications are not available for my weapon (e.g., "Incompatible with Light Pistols" or "Requires Rifle-size weapon").

### System Logic
5. **As a developer**, I want a centralized way to map weapon subcategories to their available mount points according to SR5 rules.
6. **As a developer**, I want to ensure that built-in modifications do not consume character Nuyen during creation.
7. **As a developer**, I want to prevent the accidental removal of built-in modifications which would break the character state.

---

## Acceptance Criteria

### Phase 1: Data Model & Ruleset
- [ ] **Type Support**: `Weapon` interface in `lib/types/character.ts` includes `subcategory` field.
- [ ] **Extended Interaction Types**: `InstalledWeaponMod` includes `isBuiltIn: boolean` flag.
- [ ] **Catalog Enhancement**: `WeaponData` in ruleset schema supports `builtInModifications` array.
- [ ] **Core Rule Implementation**: `getAvailableMountsForWeaponType` utility correctly maps SR5 mount rules for Hold-outs, Light Pistols, and other categories.

### Phase 2: Built-in Modification Logic
- [ ] **Auto-Installation**: Adding a weapon with `builtInModifications` to a character automatically populates its `modifications` array with the correct items from the catalog.
- [ ] **Cost Validation**: Built-in modifications have an effective cost of 0 Nuyen, regardless of their catalog price.
- [ ] **Mount Reservation**: Built-in modifications correctly occupy their respective mount points, preventing conflicts with manual mods.
- [ ] **Modification Immutability**: The system prevents removal of any modification flagged as `isBuiltIn`.

### Phase 3: Selection UI & Validation
- [ ] **Dynamic Filtering**: The `ModificationModal` only displays modifications compatible with the specific weapon's:
    - Available mount points (based on weapon subcategory).
    - Minimum weapon size requirements.
    - `compatibleWeapons` (allowlist) if present.
    - `incompatibleWeapons` (blocklist) if present.
- [ ] **Mount Occupancy Check**: The modal prevents selecting a modification for a mount point that is already occupied (either by a built-in or manual mod).
- [ ] **Visual Distinction**: Built-in modifications are visually distinguished (e.g., via a badge or distinct background) in both the `GearStep` selection list and the `ReviewStep`.
- [ ] **Action Restriction**: Use of `remove` buttons is disabled/hidden for built-in modifications.

### Phase 4: Content Update
- [ ] **Rulebook Data**: `sr5/core-rulebook.json` is updated with `builtInModifications` for relevant weapons (specifically Browning Ultra-Power with Laser Sight).
- [ ] **Weapon Subcategories**: Ensure all weapons in the catalog have correct `subcategory` tags for mount validation.

---

## SR5 Mechanics Reference

### Mount Points (Core Rules)
Weapon accessories are typically mounted in one of several positions. Availability depends on the weapon's size and type:

| Weapon Subcategory | Available Mount Points |
| :--- | :--- |
| Hold-outs | None |
| Light Pistols | Top, Barrel |
| Heavy Pistols | Top, Under, Barrel |
| SMGs, Rifles, Shotguns, Machine Guns | Top, Under, Side, Barrel, Stock, Internal |

### Modification Requirements
- **Weapon Size**: Some modifications require a minimum weapon size (e.g., "Rifle-sized or larger").
- **Exclusivity**: Only one modification can occupy a specific mount point at a time.
- **Internal vs. External**: Some modifications are internal and do not occupy external mount points.

---

## Data Structures

### Character Types
**File:** `lib/types/character.ts`

```typescript
interface InstalledWeaponMod {
  modificationId: string;
  name: string;
  mount?: WeaponMountType;
  isBuiltIn?: boolean; // New: Flags built-in mods
  cost: number;        // Should be 0 if isBuiltIn is true
}

interface Weapon {
  // ... existing fields
  subcategory: string; // New: Required for compatibility check
}
```

### Catalog Types
**File:** `lib/types/edition.ts`

```typescript
interface WeaponData {
  // ... existing fields
  builtInModifications?: Array<{
    modificationId: string;
    mount?: WeaponMountType;
  }>;
}
```

---

## Component Responsibilities

### 1. GearStep (`app/characters/create/components/steps/GearStep.tsx`)
- **Initialization**: When adding a weapon, check `builtInModifications`.
- **Installation**: Loop through built-in mods, fetch details from catalog, and push to `weapon.modifications`.
- **Restriction**: In the UI, identify built-in mods and disable the "Remove" action.

### 2. ModificationModal (`app/characters/create/components/ModificationModal.tsx`)
- **Filtering Logic**:
    1. Get `availableMounts` for the current weapon's subcategory.
    2. Check if the mod's `mount` type is in `availableMounts`.
    3. Validate `minimumWeaponSize` vs. weapon category.
    4. Check `compatibleWeapons` (allowlist) and `incompatibleWeapons` (blocklist).

### 3. ReviewStep (`app/characters/create/components/steps/ReviewStep.tsx`)
- **Display**: Use the `isBuiltIn` flag to render a visual distinction (badge/shading) for integrated weapon features.

---

## Testing Requirements

### Unit Tests
- **Mount Validation**: `getAvailableMountsForWeaponType("light-pistols")` returns `["top", "barrel"]`.
- **Auto-Install Logic**: Adding a Browning Ultra-Power results in a laser sight being added to the modifications array with `isBuiltIn: true`.
- **Cost Calculation**: Ensure `weapon.modifications.reduce` correctly handles zero-cost built-in mods.

### Integration Tests
- **UI Filtering**: Opening the modification modal for a Light Pistol does NOT show under-barrel accessories.
- **Removal Prevention**: Clicking "Remove" on a built-in modification shows an error or the button is inactive.
- **Workflow**: Create a character, add a weapon with built-in mods, and verify they appear on the final review page.
