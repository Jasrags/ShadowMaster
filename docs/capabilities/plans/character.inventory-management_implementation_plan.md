# Implementation Plan: Character Inventory Management

## Goal Description

Implement a complete inventory management system that provides unified equipment state tracking (readied/holstered/worn/stored), per-item wireless control with structured bonus effects, device condition persistence, realistic magazine-based ammunition management, and Strength-based encumbrance calculation.

**Target Capability:** `character.inventory-management.md`

**Related ADR:** `010-gear.inventory-state-management.md`

**Current State:** The codebase has partial infrastructure:

- `ArmorItem.equipped` boolean exists
- `Character.wirelessBonusesEnabled` global toggle exists
- `Weapon.currentAmmo` and `ammoCapacity` fields exist but no UI
- `weapon-handler.ts` has `consumeAmmo()`, `reloadWeapon()` functions
- Cyberdecks track Matrix damage at session level, not device level
- No encumbrance system exists

---

## Architectural Decisions (Approved)

The following architectural decisions have been reviewed and approved per ADR-010:

| Decision             | Approved Choice                            | Rationale                           |
| -------------------- | ------------------------------------------ | ----------------------------------- |
| **State Model**      | Unified GearState interface                | Consistency across all gear types   |
| **Wireless Bonuses** | Structured `wirelessEffects` in catalog    | Machine-calculable, no text parsing |
| **Magazine System**  | Realistic with one included at purchase    | Tactical depth, SR5 authenticity    |
| **Device Condition** | Three-state (functional/bricked/destroyed) | Sufficient for MVP, extensible      |
| **Encumbrance**      | Strength × 10 kg capacity                  | SR5 rules compliant                 |

### Implementation Implications

1. **Type Updates**: All gear interfaces need `state` property added
2. **Catalog Updates**: Items need `weight` and `wirelessEffects` fields
3. **Migration**: Existing characters need state fields initialized
4. **Pool Integration**: `pool-builder.ts` must apply wireless bonuses and encumbrance penalties

---

## Proposed Changes

### Phase 1: Core Type Definitions

#### 1.1 Equipment State Types

**File:** `/lib/types/gear-state.ts` (NEW)

```typescript
/** Readiness state for equipment items */
export type EquipmentReadiness =
  | "readied" // In hand, immediately usable
  | "holstered" // Accessible, Simple Action to ready
  | "worn" // Currently worn (armor, clothing)
  | "stored"; // In bag/vehicle, not readily accessible

/** Condition state for Matrix-capable devices */
export type DeviceCondition =
  | "functional" // Operating normally
  | "bricked" // Disabled, repairable
  | "destroyed"; // Permanently disabled

/** Unified state for all gear items */
export interface GearState {
  readiness: EquipmentReadiness;
  wirelessEnabled: boolean;
  condition?: DeviceCondition; // Only for Matrix-capable devices
}

/** State extension for weapons with ammunition */
export interface WeaponAmmoState {
  loadedAmmoTypeId: string | null; // Catalog ID of loaded ammo
  currentRounds: number;
  magazineCapacity: number;
}

/** Spare magazine as inventory item */
export interface MagazineItem {
  id: string;
  weaponCompatibility: string[]; // Weapon subcategory IDs
  capacity: number;
  loadedAmmoTypeId: string | null;
  currentRounds: number;
  cost: number;
}

/** Ammunition as inventory item */
export interface AmmunitionItem {
  id: string;
  catalogId: string;
  name: string;
  caliber: string; // e.g., "9mm", ".45 ACP", "12 gauge"
  ammoType: string; // e.g., "regular", "apds", "ex-ex"
  quantity: number;
  damageModifier: number; // Added to base weapon damage
  apModifier: number; // Added to base weapon AP
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
}

/** Encumbrance calculation result */
export interface EncumbranceState {
  currentWeight: number; // kg
  maxCapacity: number; // Strength × 10 kg
  overweightPenalty: number; // Pool modifier when over capacity
  isEncumbered: boolean;
}
```

**Satisfies:**

- Requirement: "Every equipment item MUST have an authoritative readiness state"
- Requirement: "Matrix-capable devices MUST track condition state"
- Requirement: "Weapons with ammunition MUST track currently loaded ammunition type"

---

#### 1.2 Wireless Effect Types

**File:** `/lib/types/wireless-effects.ts` (NEW)

```typescript
/** Types of bonuses wireless can provide */
export type WirelessEffectType =
  | "attribute" // Bonus to attribute (e.g., +1 Agility)
  | "initiative" // Bonus to Initiative Score
  | "initiative_dice" // Bonus Initiative Dice
  | "attack_pool" // Bonus to attack dice pools
  | "defense_pool" // Bonus to defense dice pools
  | "damage_resist" // Bonus to damage resistance
  | "armor" // Bonus to armor rating
  | "limit" // Bonus to a limit (Physical, Mental, Social)
  | "recoil" // Recoil compensation bonus
  | "skill" // Bonus to specific skill
  | "special"; // Complex effect requiring custom handling

/** Structured wireless bonus effect */
export interface WirelessEffect {
  type: WirelessEffectType;
  modifier: number;

  // Conditional fields based on type
  attribute?: AttributeKey; // For 'attribute' type
  limit?: "physical" | "mental" | "social"; // For 'limit' type
  skill?: string; // For 'skill' type
  condition?: string; // When this applies (e.g., "ranged_attack")
  description?: string; // For 'special' type
}

/** Catalog item wireless bonus data */
export interface WirelessBonusData {
  wirelessBonus: string; // Human-readable description
  wirelessEffects?: WirelessEffect[]; // Machine-readable effects
}
```

**Satisfies:**

- Guarantee: "Wireless bonus effects MUST be mechanically calculable from structured catalog data"
- ADR-010: Structured wireless effects over text parsing

---

#### 1.3 Update Existing Gear Types

**File:** `/lib/types/character.ts` (MODIFY)

```typescript
// Update Weapon interface
export interface Weapon extends GearItem {
  // ... existing fields ...

  // NEW: State management
  state: GearState;
  ammoState?: WeaponAmmoState;
  spareMagazines?: MagazineItem[];
}

// Update ArmorItem interface
export interface ArmorItem extends GearItem {
  // ... existing fields ...

  // REPLACE: equipped boolean with state
  state: GearState; // was: equipped: boolean
}

// Update CyberwareItem interface
export interface CyberwareItem {
  // ... existing fields ...

  // NEW: Wireless control
  wirelessEnabled: boolean; // Default: true
}

// Update CharacterCyberdeck interface
export interface CharacterCyberdeck {
  // ... existing fields ...

  // NEW: Device condition
  condition: DeviceCondition;
}

// Update CharacterCommlink interface
export interface CharacterCommlink {
  // ... existing fields ...

  // NEW: Device condition
  condition: DeviceCondition;
}

// Update Character interface
export interface Character {
  // ... existing fields ...

  // NEW: Ammunition inventory
  ammunition?: AmmunitionItem[];

  // NEW: Encumbrance (calculated, cached)
  encumbrance?: EncumbranceState;
}
```

**Satisfies:**

- Guarantee: "Equipment state MUST be persistent"
- Requirement: "Every wireless-capable item MUST have an independent wireless state"

---

### Phase 2: Catalog Data Updates

#### 2.1 Add Weight to Gear Catalog Items

**File:** `/data/editions/sr5/core-rulebook.json` (MODIFY)

Add `weight` field to all gear catalog items:

```json
{
  "id": "ares-predator-v",
  "name": "Ares Predator V",
  "weight": 1.5
  // ... existing fields ...
}
```

**Weight Categories (SR5 reference):**

- Holdout Pistol: 0.25 kg
- Light Pistol: 0.5 kg
- Heavy Pistol: 1.5 kg
- Machine Pistol: 1.0 kg
- SMG: 2.5 kg
- Assault Rifle: 4.0 kg
- Sniper Rifle: 5.0 kg
- Shotgun: 4.0 kg
- Armor Jacket: 2.0 kg
- Full Body Armor: 8.0 kg

---

#### 2.2 Add Wireless Effects to Augmentations

**File:** `/data/editions/sr5/core-rulebook.json` (MODIFY)

Add `wirelessEffects` to items with wireless bonuses:

```json
{
  "id": "wired-reflexes-1",
  "name": "Wired Reflexes (Rating 1)",
  "wirelessBonus": "Gain +1 to your Initiative Score.",
  "wirelessEffects": [{ "type": "initiative", "modifier": 1 }]
}
```

```json
{
  "id": "smartgun-system-internal",
  "name": "Smartgun System (Internal)",
  "wirelessBonus": "You gain a +2 dice pool bonus...",
  "wirelessEffects": [{ "type": "attack_pool", "modifier": 2, "condition": "ranged_weapon" }]
}
```

```json
{
  "id": "muscle-toner-2",
  "name": "Muscle Toner (Rating 2)",
  "wirelessBonus": "Gain +1 Agility.",
  "wirelessEffects": [{ "type": "attribute", "attribute": "agility", "modifier": 1 }]
}
```

**Priority Items (high-impact wireless bonuses):**

1. Wired Reflexes (1-3) - Initiative
2. Smartgun System - Attack pool +2
3. Muscle Toner - Agility
4. Muscle Augmentation - Strength
5. Synaptic Booster - Initiative + dice
6. Reaction Enhancers - Reaction
7. Cybereyes/ears with enhancements - Various
8. Vehicle Sensor arrays - Various

---

#### 2.3 Add Ammunition Catalog Data

**File:** `/data/editions/sr5/core-rulebook.json` (MODIFY)

Expand ammunition module with structured data:

```json
{
  "ammunition": {
    "9mm": [
      {
        "id": "9mm-regular",
        "name": "Regular Rounds",
        "caliber": "9mm",
        "ammoType": "regular",
        "damageModifier": 0,
        "apModifier": 0,
        "costPer10": 20,
        "availability": 2
      },
      {
        "id": "9mm-apds",
        "name": "APDS",
        "caliber": "9mm",
        "ammoType": "apds",
        "damageModifier": 0,
        "apModifier": -4,
        "costPer10": 120,
        "availability": 12,
        "forbidden": true
      },
      {
        "id": "9mm-explosive",
        "name": "Explosive Rounds",
        "caliber": "9mm",
        "ammoType": "explosive",
        "damageModifier": 1,
        "apModifier": 1,
        "costPer10": 80,
        "availability": 9,
        "forbidden": true
      }
    ]
  }
}
```

---

### Phase 3: Core Logic Implementation

#### 3.1 Encumbrance Calculator

**File:** `/lib/rules/encumbrance/calculator.ts` (NEW)

```typescript
export function calculateEncumbrance(
  character: Character,
  ruleset: MergedRuleset
): EncumbranceState;

export function getItemWeight(item: GearItem, catalog: GearCatalog): number;

export function calculateEncumbrancePenalty(encumbrance: EncumbranceState): number;

export function isItemCarried(item: { state: GearState }): boolean;
```

**Satisfies:**

- Requirement: "Carrying capacity MUST be derived from character Strength"
- Requirement: "Exceeding carrying capacity MUST apply pool penalties"

---

#### 3.2 Wireless Bonus Calculator

**File:** `/lib/rules/wireless/bonus-calculator.ts` (NEW)

```typescript
export interface ActiveWirelessBonuses {
  initiative: number;
  initiativeDice: number;
  attributes: Partial<Record<AttributeKey, number>>;
  attackPool: number;
  defensePool: number;
  damageResist: number;
  armor: number;
  recoil: number;
  limits: { physical: number; mental: number; social: number };
  skills: Record<string, number>;
}

export function calculateWirelessBonuses(
  character: Character,
  ruleset: MergedRuleset
): ActiveWirelessBonuses;

export function isItemWirelessActive(
  item: { wirelessEnabled?: boolean; state?: GearState },
  character: Character
): boolean;

export function getWirelessEffects(catalogItem: WirelessBonusData): WirelessEffect[];
```

**Satisfies:**

- Guarantee: "Wireless bonus effects MUST be mechanically calculable"
- Requirement: "The system MUST calculate and apply wireless bonuses to relevant pools"

---

#### 3.3 Ammunition Manager

**File:** `/lib/rules/combat/ammunition-manager.ts` (NEW)

```typescript
export function loadWeapon(
  weapon: Weapon,
  ammoItem: AmmunitionItem,
  quantity?: number
): { weapon: Weapon; ammoItem: AmmunitionItem };

export function unloadWeapon(
  weapon: Weapon,
  returnToInventory: AmmunitionItem[]
): { weapon: Weapon; returnedAmmo: AmmunitionItem };

export function swapMagazine(
  weapon: Weapon,
  newMagazine: MagazineItem,
  oldMagazineStorage: MagazineItem[]
): { weapon: Weapon; magazines: MagazineItem[] };

export function consumeAmmo(
  weapon: Weapon,
  firingMode: FiringMode
): { weapon: Weapon; consumed: number; remaining: number };

export function canFire(
  weapon: Weapon,
  firingMode: FiringMode
): { canFire: boolean; reason?: string };

export function getAmmoDamageModifiers(
  weapon: Weapon,
  ruleset: MergedRuleset
): { damageModifier: number; apModifier: number };
```

**Satisfies:**

- Requirement: "Ammunition consumption MUST be enforced based on firing mode"
- Requirement: "The system MUST validate ammunition compatibility"

---

#### 3.4 Equipment State Manager

**File:** `/lib/rules/inventory/state-manager.ts` (NEW)

```typescript
export interface StateTransitionResult {
  success: boolean;
  item: GearItem;
  actionCost?: ActionType;
  error?: string;
}

export function setEquipmentReadiness(
  item: Weapon | ArmorItem | GearItem,
  newState: EquipmentReadiness,
  inCombat: boolean
): StateTransitionResult;

export function toggleWireless(item: { wirelessEnabled: boolean }, enabled: boolean): void;

export function setDeviceCondition(
  device: CharacterCyberdeck | CharacterCommlink,
  condition: DeviceCondition
): void;

export function getValidTransitions(
  item: GearItem,
  currentState: EquipmentReadiness
): EquipmentReadiness[];

export function getTransitionActionCost(
  from: EquipmentReadiness,
  to: EquipmentReadiness
): ActionType | null;
```

**Satisfies:**

- Requirement: "The system MUST enforce state transition rules"
- Constraint: "Equipment state changes MUST NOT bypass action economy"

---

#### 3.5 Pool Builder Integration

**File:** `/lib/rules/action-resolution/pool-builder.ts` (MODIFY)

Update to include wireless bonuses and encumbrance:

```typescript
// Add to buildActionPool() or relevant function
function applyWirelessBonuses(
  pool: ActionPool,
  wirelessBonuses: ActiveWirelessBonuses,
  actionType: string
): ActionPool;

function applyEncumbrancePenalty(pool: ActionPool, encumbrance: EncumbranceState): ActionPool;
```

**Satisfies:**

- Requirement: "The system MUST calculate and apply wireless bonuses to relevant pools"
- Requirement: "Exceeding carrying capacity MUST apply pool penalties to physical actions"

---

### Phase 4: API Endpoints

#### 4.1 Inventory State API

**File:** `/app/api/characters/[characterId]/inventory/route.ts` (NEW)

```typescript
// GET: Get full inventory state
// Returns all gear with current states, ammunition, encumbrance

// PATCH: Update inventory item state
// Body: { itemId, itemType, updates: { readiness?, wirelessEnabled? } }
```

#### 4.2 Ammunition API

**File:** `/app/api/characters/[characterId]/weapons/[weaponId]/ammo/route.ts` (NEW)

```typescript
// GET: Get weapon ammo state
// POST: Load weapon with ammo
// DELETE: Unload weapon
// PATCH: Swap magazine
```

#### 4.3 Wireless Toggle API

**File:** `/app/api/characters/[characterId]/wireless/route.ts` (NEW)

```typescript
// GET: Get all wireless states
// PATCH: Toggle individual item wireless
// POST: Toggle all wireless (respects global flag)
```

---

### Phase 5: UI Components

#### 5.1 Inventory Panel

**File:** `/app/characters/[id]/components/InventoryPanel.tsx` (NEW)

Main inventory management interface with:

- Tab navigation: Weapons | Armor | Augmentations | Electronics | Gear | Ammo
- Per-item state controls (equip/holster/store)
- Wireless toggle per item
- Encumbrance bar display
- Quick action buttons

#### 5.2 Weapon Ammo Display

**File:** `/app/characters/[id]/components/WeaponAmmoDisplay.tsx` (NEW)

- Current ammo count / capacity
- Loaded ammo type with effects
- Reload button
- Spare magazine selector

#### 5.3 Wireless Status Indicator

**File:** `/app/characters/[id]/components/WirelessIndicator.tsx` (NEW)

- Per-item wireless toggle
- Active bonus display on hover
- Bricked status indicator

#### 5.4 Encumbrance Bar

**File:** `/app/characters/[id]/components/EncumbranceBar.tsx` (NEW)

- Current weight / max capacity
- Color-coded status (green/yellow/red)
- Penalty display when encumbered

---

### Phase 6: Character Sheet Integration

#### 6.1 Update Weapon Table

**File:** `/app/characters/[id]/page.tsx` (MODIFY)

Add to weapon display:

- Ammo column: "15/15 APDS"
- Ready state indicator
- Wireless status icon
- Quick reload action

#### 6.2 Update Combat Quick Reference

**File:** `/app/characters/[id]/components/CombatQuickReference.tsx` (MODIFY)

Include wireless bonuses in:

- Initiative display
- Attack pool calculations
- Defense pool calculations

#### 6.3 Add Inventory Tab/Panel

**File:** `/app/characters/[id]/page.tsx` (MODIFY)

Add inventory management as either:

- New tab in character sheet
- Slide-out panel
- Modal interface

---

### Phase 7: Character Migration

#### 7.1 Migration Script

**File:** `/lib/migrations/add-gear-state.ts` (NEW)

```typescript
export function migrateCharacterGearState(character: Character): Character;

// Default state initialization:
// - Weapons: readiness = 'holstered', wirelessEnabled = true
// - Armor: readiness = equipped ? 'worn' : 'stored'
// - Cyberware: wirelessEnabled = true
// - Cyberdecks/Commlinks: condition = 'functional'
// - All ammo fields: initialized from existing currentAmmo/ammoCapacity
```

#### 7.2 Migration API

**File:** `/app/api/admin/migrate/gear-state/route.ts` (NEW)

Batch migration endpoint for existing characters.

---

## Verification Plan

### Automated Tests

#### Unit Tests

**File:** `/lib/rules/encumbrance/__tests__/calculator.test.ts`

| Test Case                                 | Capability Reference                          |
| ----------------------------------------- | --------------------------------------------- |
| Calculate encumbrance from carried items  | Requirement: "calculate total carried weight" |
| Apply correct capacity formula            | Requirement: "Strength × 10 kg base"          |
| Return correct penalty when over capacity | Requirement: "apply pool penalties"           |
| Exclude stored items from weight          | Requirement: "non-stored equipment"           |

**File:** `/lib/rules/wireless/__tests__/bonus-calculator.test.ts`

| Test Case                                 | Capability Reference                       |
| ----------------------------------------- | ------------------------------------------ |
| Calculate bonuses from wirelessEffects    | Guarantee: "mechanically calculable"       |
| Respect item wireless toggle              | Requirement: "independent wireless state"  |
| Respect global wireless toggle            | Requirement: "global toggle MUST override" |
| Handle missing wirelessEffects gracefully | Robustness                                 |

**File:** `/lib/rules/combat/__tests__/ammunition-manager.test.ts`

| Test Case                             | Capability Reference                                |
| ------------------------------------- | --------------------------------------------------- |
| Load weapon with compatible ammo      | Requirement: "validate ammunition compatibility"    |
| Reject incompatible ammo caliber      | Constraint: robustness                              |
| Consume correct ammo per firing mode  | Requirement: "SS: 1, SA: 1, BF: 3, FA: 6+"          |
| Prevent firing with insufficient ammo | Constraint: "MUST NOT be consumed beyond available" |
| Apply ammo damage modifiers correctly | Implicit from ammo tracking                         |

**File:** `/lib/rules/inventory/__tests__/state-manager.test.ts`

| Test Case                                 | Capability Reference                  |
| ----------------------------------------- | ------------------------------------- |
| Transition weapon readied → holstered     | Requirement: "state transition rules" |
| Return correct action cost for transition | Requirement: "Simple Action to ready" |
| Prevent invalid state transitions         | Constraint: robustness                |
| Toggle wireless state                     | Requirement: "Free Action"            |

---

#### Integration Tests

**File:** `/lib/rules/__tests__/inventory-combat-integration.test.ts`

| Test Case                                       | Capability Reference                                 |
| ----------------------------------------------- | ---------------------------------------------------- |
| Wireless bonuses applied to attack pool         | Integration with pool-builder                        |
| Encumbrance penalty applied to physical actions | Integration with pool-builder                        |
| Only readied weapons can fire                   | Requirement: "directly influence action eligibility" |
| Ammo consumed during combat action              | Integration with combat system                       |

---

### Manual Verification Checklist

1. **Equipment State**
   - [ ] Equip weapon from inventory panel
   - [ ] Verify weapon shows as "readied" in combat view
   - [ ] Holster weapon, verify state change
   - [ ] Store armor, verify it no longer provides protection

2. **Wireless Control**
   - [ ] Toggle wireless on individual augmentation
   - [ ] Verify bonus no longer applied when disabled
   - [ ] Disable global wireless, verify all items disabled
   - [ ] Re-enable global, verify individual states restored

3. **Ammunition**
   - [ ] Load weapon with ammo from inventory
   - [ ] Fire weapon, verify ammo count decreases
   - [ ] Attempt to fire with empty weapon, verify blocked
   - [ ] Reload weapon, verify ammo transferred from inventory

4. **Encumbrance**
   - [ ] Add gear until over capacity
   - [ ] Verify encumbrance bar shows warning
   - [ ] Verify pool penalty displayed
   - [ ] Store items, verify weight decreases

5. **Device Condition**
   - [ ] Brick cyberdeck via Matrix combat
   - [ ] Verify device shows bricked status
   - [ ] Verify device bonuses no longer apply
   - [ ] Persist and reload character, verify condition saved

---

## Implementation Order

```
Phase 1: Core Type Definitions
├── 1.1 Equipment State Types (NEW)
├── 1.2 Wireless Effect Types (NEW)
└── 1.3 Update Existing Gear Types (MODIFY)

Phase 2: Catalog Data Updates
├── 2.1 Add Weight to Gear Catalog
├── 2.2 Add Wireless Effects to Augmentations
└── 2.3 Add Ammunition Catalog Data

Phase 3: Core Logic Implementation
├── 3.1 Encumbrance Calculator
├── 3.2 Wireless Bonus Calculator
├── 3.3 Ammunition Manager
├── 3.4 Equipment State Manager
└── 3.5 Pool Builder Integration

Phase 4: API Endpoints
├── 4.1 Inventory State API
├── 4.2 Ammunition API
└── 4.3 Wireless Toggle API

Phase 5: UI Components
├── 5.1 Inventory Panel
├── 5.2 Weapon Ammo Display
├── 5.3 Wireless Status Indicator
└── 5.4 Encumbrance Bar

Phase 6: Character Sheet Integration
├── 6.1 Update Weapon Table
├── 6.2 Update Combat Quick Reference
└── 6.3 Add Inventory Tab/Panel

Phase 7: Character Migration
├── 7.1 Migration Script
└── 7.2 Migration API
```

---

## Dependencies

**Existing Infrastructure:**

- `/lib/rules/action-resolution/pool-builder.ts` - Pool calculations
- `/lib/rules/action-resolution/combat/weapon-handler.ts` - Weapon attack logic
- `/lib/storage/characters.ts` - Character persistence
- `/lib/types/character.ts` - Character type definitions
- `/lib/types/edition.ts` - Catalog type definitions
- `/data/editions/sr5/core-rulebook.json` - Ruleset data

**Required Before Implementation:**

- Catalog items with accurate weight values
- Priority wireless effects identified and structured

---

## ADR References

- **ADR-010**: Inventory State Management (unified state model, structured wireless, magazine system)
- **ADR-005**: Modular Step Wizard (gear selection during creation)
- **ADR-006**: File-Based Persistence (character storage pattern)

---

## Risk Assessment

| Risk                                        | Mitigation                                                |
| ------------------------------------------- | --------------------------------------------------------- |
| Large catalog update effort                 | Start with priority items (weapons, common augmentations) |
| Migration breaks existing characters        | Defensive migration with sensible defaults                |
| Performance with encumbrance recalculation  | Cache encumbrance, recalculate on gear change only        |
| Complex UI for inventory management         | Start with essential actions, enhance iteratively         |
| Fire mode ammo consumption varies by weapon | Use constants, allow weapon-specific overrides            |

---

## Success Criteria

1. All capability guarantees verified by automated tests
2. Equipment state persists across sessions
3. Wireless bonuses correctly applied to pools when enabled
4. Ammunition consumption tracked during combat
5. Encumbrance calculated and penalties applied
6. Inventory UI provides clear state visualization and quick actions
7. Existing characters migrated without data loss
