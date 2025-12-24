> [!NOTE]
> This implementation guide is governed by the [Capability (TBD)](file:///Users/jrags/Code/Jasrags/shadow-master/docs/capabilities/TBD).

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
