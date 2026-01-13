# Gear Location and Loadout System

This document outlines the design for a comprehensive gear location system that models where equipment is during gameplay, along with a loadout system for pre-configuring gear selections for different scenarios.

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Current State](#current-state)
3. [Proposed Gear Location Model](#proposed-gear-location-model)
4. [Loadout System](#loadout-system)
5. [Type Definitions](#type-definitions)
6. [Encumbrance Calculation](#encumbrance-calculation)
7. [Access Time Rules](#access-time-rules)
8. [Concealment Integration](#concealment-integration)
9. [UI/UX Design](#uiux-design)
10. [Migration Path](#migration-path)

---

## Problem Statement

The current equipment state model uses a flat `EquipmentReadiness` type with states: `readied`, `holstered`, `worn`, `stored`. The "stored" state is problematic because it conflates two very different scenarios:

1. **Gear left behind** - At safehouse, in vehicle, at home (not available during run)
2. **Gear in a bag** - On the runner but requires time to access

This distinction matters for:

- **Encumbrance**: Only gear ON the runner should count toward weight limits
- **Access time**: Backpack items take longer to retrieve than holstered items
- **Run planning**: Runners should decide what to bring vs. leave behind
- **Concealment**: Bag contents are hidden, holstered items may be visible

---

## Current State

### Current Type Definition

```typescript
type EquipmentReadiness = "readied" | "holstered" | "worn" | "stored";

interface GearState {
  readiness: EquipmentReadiness;
  wirelessEnabled?: boolean;
}
```

### Current Limitations

1. No distinction between "left at home" and "in my backpack"
2. No concept of stash locations (safehouse, vehicle, etc.)
3. No loadout presets for quick gear configuration
4. Encumbrance calculation includes ALL gear, not just carried gear
5. No "pocketed" state for small quick-access items

---

## Proposed Gear Location Model

### Location Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│  STASH (Not on run - 0 encumbrance)                             │
│  ├── Home         - Primary residence                           │
│  ├── Safehouse    - Secondary secure location                   │
│  ├── Vehicle      - In runner's vehicle (may be accessible)     │
│  └── Storage      - Generic off-site storage                    │
├─────────────────────────────────────────────────────────────────┤
│  CARRIED (On person, slow access - full encumbrance)            │
│  └── Backpack/Bag - Complex Action or more to retrieve          │
├─────────────────────────────────────────────────────────────────┤
│  ON BODY (Accessible - full encumbrance)                        │
│  ├── Holstered    - Simple Action to ready (weapons)            │
│  ├── Worn         - Passive protection (armor, clothing)        │
│  └── Pocketed     - Free Action access (small items)            │
├─────────────────────────────────────────────────────────────────┤
│  ACTIVE (In use - full encumbrance)                             │
│  ├── Readied      - Weapon in hand                              │
│  ├── Running      - Active programs, sustained spells           │
│  └── Bonded       - Active foci                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Location Descriptions

| Location    | Description       | Access Time | Encumbrance | Visibility         |
| ----------- | ----------------- | ----------- | ----------- | ------------------ |
| `stash`     | Not on the run    | N/A         | None        | N/A                |
| `carried`   | In bag/backpack   | Complex+    | Full        | Hidden             |
| `holstered` | In holster/sheath | Simple      | Full        | Depends on holster |
| `worn`      | Armor/clothing    | Passive     | Full        | Visible            |
| `pocketed`  | In pocket         | Free        | Minimal     | Hidden             |
| `readied`   | In hand/active    | Immediate   | Full        | Visible            |

### Stash Sub-Locations

Gear in `stash` can have a sub-location indicating where it's stored:

- **home**: Runner's primary residence
- **safehouse**: Team safehouse or bolt-hole
- **vehicle**: In the runner's vehicle (may be accessible during vehicle scenes)
- **storage**: Rented storage unit or other off-site location
- **custom**: User-defined location name

---

## Loadout System

### Concept

A **loadout** is a saved configuration of gear locations for a specific scenario. Runners can:

1. Create loadouts for different run types
2. Quickly switch between loadouts
3. See a summary of what they're bringing

### Example Loadouts

**"Social Meet"**

- Lined coat (worn)
- Hold-out pistol (holstered, concealed)
- Fake SIN (pocketed)
- Commlink (pocketed)
- Everything else → stash

**"Full Combat"**

- Full body armor (worn)
- Assault rifle (readied)
- Heavy pistol (holstered)
- Combat knife (holstered)
- Medkit (carried)
- Grenades x4 (carried)
- Everything else → stash

**"Infiltration"**

- Chameleon suit (worn)
- Silenced pistol (holstered)
- Lockpick set (pocketed)
- Sequencer (carried)
- Grapple gun (carried)
- Everything else → stash

### Loadout Switching Workflow

1. Runner selects "Prepare for Run" or switches loadout
2. System shows diff: "Moving 5 items to stash, bringing 8 items"
3. Runner confirms
4. All gear locations update to match loadout
5. Encumbrance and availability recalculate

---

## Type Definitions

```typescript
// =============================================================================
// GEAR LOCATION TYPES
// =============================================================================

/**
 * Where gear is located relative to the runner
 */
type GearLocation =
  | "stash" // Not on the run (home, vehicle, safehouse)
  | "carried" // In bag/backpack - Complex Action+ to access
  | "holstered" // On body, quick access - Simple Action to ready
  | "worn" // Actively worn (armor, clothing)
  | "pocketed" // Small items - Free Action access
  | "readied"; // In hand/active use

/**
 * Sub-locations for stashed gear
 */
type StashLocation = "home" | "safehouse" | "vehicle" | "storage" | string; // Custom location

/**
 * Enhanced gear state with location model
 */
interface GearState {
  /** Current location of the gear */
  location: GearLocation;

  /** Where stashed gear is stored (only when location === "stash") */
  stashLocation?: StashLocation;

  /** Whether wireless functionality is enabled */
  wirelessEnabled?: boolean;

  /** Whether item is being concealed */
  concealed?: boolean;

  /** Which hand weapon is in (only for readied weapons) */
  handSlot?: HandSlot; // See weapon-hand-slots.md
}

// =============================================================================
// LOADOUT TYPES
// =============================================================================

/**
 * A saved gear configuration for a specific scenario
 */
interface Loadout {
  id: ID;
  name: string;
  description?: string;

  /** Icon identifier for quick visual recognition */
  icon?: string;

  /** Map of gear ID to desired location */
  gearAssignments: Record<string, GearLocation>;

  /** Default stash location for gear not explicitly assigned */
  defaultStashLocation: StashLocation;

  /** Timestamp of last modification */
  updatedAt: ISODateString;
}

/**
 * Character loadout state
 */
interface CharacterLoadouts {
  /** All saved loadouts */
  loadouts: Loadout[];

  /** Currently active loadout ID (null if manual configuration) */
  activeLoadoutId: string | null;
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

/**
 * Result of validating gear location assignment
 */
interface LocationValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Constraints on what locations are valid for a gear type
 */
interface GearLocationConstraints {
  /** Allowed locations for this gear type */
  allowedLocations: GearLocation[];

  /** Can this item be concealed? */
  concealable: boolean;

  /** Maximum quantity that fits in pockets */
  maxPocketed?: number;
}
```

---

## Encumbrance Calculation

### Current (Incorrect)

```typescript
// Counts ALL gear regardless of location
const totalWeight = character.gear.reduce((sum, g) => sum + (g.weight || 0), 0);
```

### Proposed (Location-Aware)

```typescript
/**
 * Locations that contribute to encumbrance
 */
const ENCUMBERING_LOCATIONS: GearLocation[] = [
  "carried",
  "holstered",
  "worn",
  "pocketed",
  "readied",
];

/**
 * Calculate encumbrance from gear the runner is actually carrying
 */
function calculateEncumbrance(character: Character): EncumbranceResult {
  let totalWeight = 0;
  let itemCount = 0;

  for (const item of character.gear || []) {
    const location = item.state?.location || "stash";

    if (ENCUMBERING_LOCATIONS.includes(location)) {
      totalWeight += (item.weight || 0) * (item.quantity || 1);
      itemCount++;
    }
  }

  const carryCapacity = (character.attributes?.strength || 1) * 10; // STR x 10 kg

  return {
    currentWeight: totalWeight,
    maxWeight: carryCapacity,
    itemCount,
    isOverEncumbered: totalWeight > carryCapacity,
    encumbranceLevel: calculateEncumbranceLevel(totalWeight, carryCapacity),
  };
}

type EncumbranceLevel = "light" | "medium" | "heavy" | "overloaded";

function calculateEncumbranceLevel(current: number, max: number): EncumbranceLevel {
  const ratio = current / max;
  if (ratio <= 0.33) return "light";
  if (ratio <= 0.66) return "medium";
  if (ratio <= 1.0) return "heavy";
  return "overloaded";
}
```

---

## Access Time Rules

Based on SR5 Core Rulebook action economy:

| Location    | Action to Access | Notes                                             |
| ----------- | ---------------- | ------------------------------------------------- |
| `readied`   | None             | Already in use                                    |
| `pocketed`  | Free Action      | Small items only                                  |
| `worn`      | N/A              | Passive (armor provides protection automatically) |
| `holstered` | Simple Action    | Ready Weapon action                               |
| `carried`   | Complex Action   | Retrieve from bag                                 |
| `stash`     | N/A              | Not available during scene                        |

### Vehicle Stash Exception

If gear is stashed in a **vehicle** and the runner is in/near the vehicle:

- Access time: Complex Action + movement to vehicle
- GM discretion on availability during vehicle chases

---

## Concealment Integration

```typescript
interface ConcealmentCheck {
  /** Base concealment modifier from item */
  baseModifier: number;

  /** Location modifier */
  locationModifier: number;

  /** Total modifier to Perception test */
  totalModifier: number;
}

function getConcealmentModifier(item: GearItem): ConcealmentCheck {
  const baseModifier = item.concealability || 0;
  const location = item.state?.location || "stash";

  // Location modifiers
  const locationModifiers: Record<GearLocation, number> = {
    stash: 0, // N/A
    carried: -4, // Hidden in bag
    pocketed: -2, // In pocket
    holstered: 0, // Depends on holster type
    worn: +2, // Visible
    readied: +4, // Obviously visible
  };

  const locationModifier = locationModifiers[location];

  return {
    baseModifier,
    locationModifier,
    totalModifier: baseModifier + locationModifier,
  };
}
```

---

## UI/UX Design

### Inventory Panel Enhancements

1. **Location Grouping**: Group gear by location (On Body, Carried, Stashed)
2. **Drag & Drop**: Move items between locations
3. **Quick Actions**: "Stash All", "Ready for Combat"
4. **Location Indicator**: Badge/icon showing current location

### Loadout Manager

```
┌─────────────────────────────────────────────────────┐
│  LOADOUTS                              [+ New]      │
├─────────────────────────────────────────────────────┤
│  ⚔️  Full Combat           [Active]    [Edit] [Del] │
│  🎭  Social Meet                       [Edit] [Del] │
│  🥷  Infiltration                      [Edit] [Del] │
│  🏥  Medical Support                   [Edit] [Del] │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CURRENT LOADOUT: Full Combat                       │
├─────────────────────────────────────────────────────┤
│  Encumbrance: 18.5 / 40 kg  ████████░░░░░ 46%      │
│  Items Carried: 12                                  │
│  Weapons Ready: 1  Holstered: 2                     │
│  Armor Rating: 15                                   │
└─────────────────────────────────────────────────────┘
```

### "Prepare for Run" Flow

1. Show current loadout summary
2. Option to select different loadout
3. Show what's changing (items being stashed/brought)
4. Confirm and apply
5. Optionally save as new loadout

---

## Migration Path

### Phase 1: Extend GearState Type

- Add `location` field (default from current `readiness`)
- Add `stashLocation` field
- Maintain backward compatibility with `readiness`

### Phase 2: Migration Script

```typescript
function migrateGearState(oldState: OldGearState): GearState {
  // Map old readiness to new location
  const locationMap: Record<EquipmentReadiness, GearLocation> = {
    readied: "readied",
    holstered: "holstered",
    worn: "worn",
    stored: "stash", // Default stored → stash
  };

  return {
    location: locationMap[oldState.readiness] || "stash",
    stashLocation: oldState.readiness === "stored" ? "home" : undefined,
    wirelessEnabled: oldState.wirelessEnabled,
  };
}
```

### Phase 3: UI Updates

- Update InventoryPanel to show locations
- Add location selector dropdown
- Update encumbrance calculation

### Phase 4: Loadout System

- Add loadout management UI
- Implement loadout switching
- Add "Prepare for Run" workflow

---

## Open Questions

1. **Vehicle accessibility**: Should vehicle stash be partially accessible during runs?
2. **Shared stash**: Can team members share a safehouse stash?
3. **Capacity limits**: Should bags/backpacks have weight limits?
4. **Container items**: Model actual backpacks as gear with capacity?
5. **Quick-draw holsters**: Different holster types with different access times?

---

## Related Documents

- [Weapon Hand Slots](./weapon-hand-slots.md) - Weapon wielding mechanics
- [ADR-010: Inventory State Management](../decisions/ADR-010-inventory-state-management.md)
- [Equipment Rating System](./equipment-rating-system.md)
