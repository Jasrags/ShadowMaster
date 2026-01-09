# Implementation Plan: Full Cyberlimb System for SR5

**Created:** 2026-01-08
**Status:** Draft - Awaiting User Approval
**Target Feature:** Complete Cyberlimb System Implementation

---

## Goal Description

Implement a complete cyberlimb system for Shadowrun 5th Edition that supports:

1. **All cyberlimb types** (full limbs, partial limbs, torso, skull) in both obvious and synthetic variants
2. **Cyberlimb-specific attributes** (base STR 3, AGI 3) with customization and enhancement systems
3. **Capacity management** for cyberlimb enhancements, accessories, and implant weapons
4. **Location tracking** with hierarchical replacement rules
5. **Physical Condition Monitor bonuses** from installed cyberlimbs
6. **Effective attribute calculation** for actions involving cyberlimbs (single limb, averaging, weakest limb)
7. **Per-limb wireless state tracking** with structured effects per ADR-010
8. **Integration with character creation and sheet-driven creation** per ADR-011

---

## Architectural Decisions (Resolved)

### 1. Type Structure: Dedicated `CyberlimbItem` Interface ✅

**Decision:** Create a dedicated `CyberlimbItem` interface that extends `CyberwareItem` with cyberlimb-specific fields.

**Rationale:** Cyberlimbs have fundamentally different mechanics (location, attributes, capacity budget) that warrant a distinct type. This provides better type safety and clearer code. Character will have separate `cyberware[]` and `cyberlimbs[]` arrays.

### 2. Location Enforcement: Auto-Remove with Confirmation ✅

**Decision:** Enforce hierarchical location rules. When installing a higher-level limb, automatically remove lower-level limbs with user confirmation. Block installing lower-level limbs when higher-level exists.

**Rationale:** Prevents invalid game states, matches physical reality, provides clear user feedback.

### 3. Customization Mutability: Strict RAW (Immutable) ✅

**Decision:** Customization is set at purchase and cannot be changed afterward, per SR5 RAW. Users must remove and re-purchase to change customization values.

**Rationale:** Matches source material, creates meaningful purchase decisions. UX safeguards (confirmation dialogs, previews) will prevent user mistakes.

---

## Proposed Changes

### Phase 1: Data Corrections and Catalog Updates

#### 1.1 Fix Existing Cyberlimb Data (`data/editions/sr5/core-rulebook.json`)

**Capability Reference:** `character.augmentation-systems` - Augmentation Governance (catalog-driven selection)

| Item ID | Field | Current | Correct | Source |
|---------|-------|---------|---------|--------|
| `cyberlimb-arm` | capacity | 10 | 15 | SR5 Core p.456 |
| `cyberlimb-leg` | capacity | 12 | 20 | SR5 Core p.456 |
| `cyberlimb-hand` | capacity | 2 | 4 | SR5 Core p.456 |
| `cyberlimb-foot` | capacity | 2 | 4 | SR5 Core p.456 |
| `cyberlimb-lower-arm` | capacity | 5 | 10 | SR5 Core p.456 |
| `cyberlimb-lower-leg` | capacity | 6 | 12 | SR5 Core p.456 |
| `cyberlimb-arm-synthetic` | capacity | 5 | 8 | SR5 Core p.456 |
| `cyberlimb-leg-synthetic` | capacity | 6 | 10 | SR5 Core p.456 |
| `cyberlimb-torso` | availability | 6 | 12 | SR5 Core p.456 |
| `cyberlimb-skull` | availability | 4 | 16 | SR5 Core p.456 |
| `cyberlimb-agility` | cost | 3000 | 6500 | SR5 Core p.457 |
| `cyberlimb-strength` | cost | 3000 | 6500 | SR5 Core p.457 |
| `cyberlimb-agility` | availability | 8 | `(Rating × 3)R` | SR5 Core p.457 |
| `cyberlimb-strength` | availability | 8 | `(Rating × 3)R` | SR5 Core p.457 |
| `cyberlimb-armor` | availability | 8 | `Rating × 5` | SR5 Core p.457 |

#### 1.2 Add Missing Cyberlimb Catalog Items

**ADR Reference:** ADR-010 (Inventory State Management) - structured wireless effects

**Missing Synthetic Limbs:**
- `cyberlimb-hand-synthetic` (Essence: 0.25, Capacity: 2, Cost: 6,000¥)
- `cyberlimb-foot-synthetic` (Essence: 0.25, Capacity: 2, Cost: 6,000¥)
- `cyberlimb-lower-arm-synthetic` (Essence: 0.45, Capacity: 5, Cost: 12,000¥)
- `cyberlimb-lower-leg-synthetic` (Essence: 0.45, Capacity: 6, Cost: 12,000¥)
- `cyberlimb-torso-synthetic` (Essence: 1.5, Capacity: 5, Cost: 25,000¥, Avail: 12)
- `cyberlimb-skull-synthetic` (Essence: 0.75, Capacity: 2, Cost: 15,000¥, Avail: 16)

**Missing Accessories:**
- `cyberlimb-hydraulic-jacks` (Rating 1-6, Capacity: [Rating], Cost: Rating × 2,500¥, Avail: 9)
  - `wirelessEffects: [{ type: "dice_pool", skills: ["jumping", "sprinting", "lifting"], modifier: 1 }]`
- `cyberlimb-large-smuggling-compartment` (Capacity: [5], Cost: 8,000¥, Avail: 6)
  - `wirelessEffects: [{ type: "action_economy", action: "access_compartment", from: "complex", to: "simple" }]`

**Update Existing with Wireless Effects:**
- `cyberlimb-gyromount`:
  - `wirelessEffects: [{ type: "action_economy", action: "toggle_gyromount", from: "simple", to: "free" }]`
- `cyberlimb-holster`:
  - `wirelessEffects: [{ type: "action_economy", action: "ready_from_holster", from: "simple", to: "free" }]`

#### 1.3 Add Cyberlimb-Specific Catalog Fields

Each cyberlimb catalog item needs:
```json
{
  "limbType": "full-arm" | "lower-arm" | "hand" | "full-leg" | "lower-leg" | "foot" | "torso" | "skull",
  "appearance": "obvious" | "synthetic",
  "baseStrength": 3,
  "baseAgility": 3,
  "physicalCMBonus": 1 | 0.5 | 0
}
```

---

### Phase 2: Type System Updates

#### 2.1 Create Cyberlimb Types (`lib/types/cyberlimb.ts`)

**Capability Reference:** `character.augmentation-systems` - Persistent and auditable record

```typescript
// New file: lib/types/cyberlimb.ts

import type { ID, ISODateString, ItemLegality } from "./core";
import type { CyberwareGrade, CyberwareItem } from "./character";
import type { WirelessEffect } from "./wireless-effects";

/**
 * Location slots for cyberlimbs
 */
export type CyberlimbLocation =
  | "left-arm" | "right-arm"
  | "left-leg" | "right-leg"
  | "left-hand" | "right-hand"
  | "left-foot" | "right-foot"
  | "left-lower-arm" | "right-lower-arm"
  | "left-lower-leg" | "right-lower-leg"
  | "torso"
  | "skull";

/**
 * Cyberlimb type classification
 */
export type CyberlimbType =
  | "full-arm" | "lower-arm" | "hand"
  | "full-leg" | "lower-leg" | "foot"
  | "torso" | "skull";

/**
 * Appearance classification for cyberlimbs
 */
export type CyberlimbAppearance = "obvious" | "synthetic";

/**
 * Modification history entry for audit trail
 * Satisfies: character.augmentation-systems - persistent and auditable record
 */
export interface CyberlimbModificationEntry {
  id: ID;
  timestamp: ISODateString;
  action: "installed" | "enhancement_added" | "enhancement_removed" | "enhancement_replaced" | "wireless_toggled";
  targetId?: string;
  previousValue?: unknown;
  newValue?: unknown;
  notes?: string;
}

/**
 * Enhancement installed in a cyberlimb
 */
export interface CyberlimbEnhancement {
  id: ID;
  catalogId: string;
  name: string;
  rating?: number;
  capacityUsed: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  /** For attribute enhancements (agility, strength, armor) */
  attributeType?: "agility" | "strength" | "armor";
  wirelessEnabled?: boolean;
  wirelessEffects?: WirelessEffect[];
}

/**
 * Accessory installed in a cyberlimb
 */
export interface CyberlimbAccessory {
  id: ID;
  catalogId: string;
  name: string;
  rating?: number;
  capacityUsed: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  wirelessEnabled?: boolean;
  wirelessEffects?: WirelessEffect[];
}

/**
 * Cyber implant weapon installed in a cyberlimb or meat
 */
export interface CyberImplantWeapon {
  id: ID;
  catalogId: string;
  name: string;
  capacityUsed: number;
  essenceCost: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  /** Weapon stats for combat */
  damage: string;
  ap: number;
  mode?: string[];
  ammoCapacity?: number;
  currentAmmo?: number;
  /** Location: in cyberlimb or "meat" */
  installedIn: "cyberlimb" | "meat";
  parentLimbId?: ID;
}

/**
 * Cyberlimb item installed on a character
 * Extends CyberwareItem with cyberlimb-specific properties
 *
 * Satisfies:
 * - character.augmentation-systems: Essence tracking, capacity management, attribute bonuses
 * - ADR-010: Wireless state, device condition
 * - ADR-011: Sheet-driven creation support
 */
export interface CyberlimbItem extends Omit<CyberwareItem, 'enhancements'> {
  // Location & Type
  location: CyberlimbLocation;
  limbType: CyberlimbType;
  appearance: CyberlimbAppearance;

  // Base Attributes (always 3)
  baseStrength: 3;
  baseAgility: 3;

  // Customization (set at purchase, immutable)
  /** STR customization above base 3 (0 to racial max - 3) */
  customStrength: number;
  /** AGI customization above base 3 (0 to racial max - 3) */
  customAgility: number;

  // Capacity
  baseCapacity: number;
  /** Total capacity used by enhancements, accessories, and weapons */
  capacityUsed: number;

  // Installed Items
  enhancements: CyberlimbEnhancement[];
  accessories: CyberlimbAccessory[];
  weapons: CyberImplantWeapon[];

  // State (per ADR-010)
  wirelessEnabled: boolean;
  condition: "working" | "bricked" | "permanently_bricked";

  // Audit Trail
  installedAt: ISODateString;
  modificationHistory: CyberlimbModificationEntry[];
}

/**
 * Limb hierarchy for replacement rules
 * When a higher-level limb is installed, lower-level limbs are removed
 */
export const LIMB_HIERARCHY: Record<CyberlimbType, CyberlimbType[]> = {
  "full-arm": ["lower-arm", "hand"],
  "lower-arm": ["hand"],
  "hand": [],
  "full-leg": ["lower-leg", "foot"],
  "lower-leg": ["foot"],
  "foot": [],
  "torso": [],
  "skull": [],
};

/**
 * Physical Condition Monitor bonus per limb type
 */
export const LIMB_CM_BONUS: Record<CyberlimbType, number> = {
  "full-arm": 1,
  "full-leg": 1,
  "torso": 1,
  "skull": 1,
  "lower-arm": 0.5,
  "lower-leg": 0.5,
  "hand": 0,
  "foot": 0,
};
```

#### 2.2 Update Character Interface (`lib/types/character.ts`)

Add to Character interface:
```typescript
/**
 * Cyberlimbs installed on the character
 * Tracked separately from general cyberware due to unique mechanics
 */
cyberlimbs?: CyberlimbItem[];

/**
 * Cyber implant weapons installed directly in meat (not in cyberlimbs)
 */
cyberImplantWeapons?: CyberImplantWeapon[];
```

#### 2.3 Create Cyberlimb Catalog Types (`lib/types/edition.ts`)

Add to edition.ts:
```typescript
/**
 * Cyberlimb catalog item in ruleset data
 */
export interface CyberlimbCatalogItem extends CyberwareCatalogItem {
  limbType: CyberlimbType;
  appearance: CyberlimbAppearance;
  baseStrength: 3;
  baseAgility: 3;
  /** Physical CM bonus (1, 0.5, or 0) */
  physicalCMBonus: number;
  /** Base capacity for this limb type */
  baseCapacity: number;
}

/**
 * Cyberlimb enhancement catalog item
 */
export interface CyberlimbEnhancementCatalogItem extends CyberwareCatalogItem {
  /** Enhancement type for stacking validation */
  enhancementType: "agility" | "strength" | "armor";
  /** Parent limb types this can be installed in */
  compatibleLimbs: CyberlimbType[];
}

/**
 * Cyberlimb accessory catalog item
 */
export interface CyberlimbAccessoryCatalogItem extends CyberwareCatalogItem {
  /** Parent limb types this can be installed in */
  compatibleLimbs: CyberlimbType[];
  /** For accessories requiring pairs (hydraulic jacks) */
  requiresPair?: boolean;
  pairLocation?: "legs"; // e.g., hydraulic jacks need both legs
}
```

---

### Phase 3: Business Logic Implementation

#### 3.1 Cyberlimb Validation (`lib/rules/cyberlimbs/validation.ts`)

**Capability Reference:** `character.augmentation-systems` - Constraints (max limits, availability, exclusivity)

```typescript
// Primary exports:
export function validateCyberlimbInstallation(
  character: Character,
  catalogItem: CyberlimbCatalogItem,
  location: CyberlimbLocation,
  customization: { strength: number; agility: number },
  grade: CyberwareGrade
): ValidationResult;

export function validateEnhancementInstallation(
  cyberlimb: CyberlimbItem,
  enhancement: CyberlimbEnhancementCatalogItem,
  rating: number
): ValidationResult;

export function validateAccessoryInstallation(
  cyberlimb: CyberlimbItem,
  accessory: CyberlimbAccessoryCatalogItem
): ValidationResult;

// Validation rules:
// - Availability limit (≤12 at creation)
// - Essence minimum (>0.01 after installation)
// - Customization cap (≤ racial natural max)
// - Capacity budget (cannot exceed)
// - Location conflicts (hierarchy rules)
// - Enhancement stacking (one per type per limb)
// - Pair requirements (hydraulic jacks)
```

#### 3.2 Cyberlimb Attribute Calculations (`lib/rules/cyberlimbs/attributes.ts`)

**Capability Reference:** `character.augmentation-systems` - Functional Integration (attribute propagation)

```typescript
// Calculate effective limb attributes
export function getLimbStrength(limb: CyberlimbItem): number;
export function getLimbAgility(limb: CyberlimbItem): number;

// Calculate effective attribute for actions involving cyberlimbs
export function getEffectiveAttribute(
  character: Character,
  attributeCode: "str" | "agi",
  involvedLimbs: CyberlimbLocation[],
  mode: "single" | "average" | "weakest"
): number;

// Calculate Physical CM bonus from all cyberlimbs
export function getCyberlimbCMBonus(character: Character): number;
```

#### 3.3 Cyberlimb Essence Calculations (`lib/rules/cyberlimbs/essence.ts`)

**Capability Reference:** `character.augmentation-systems` - Essence and Metaphysical Integrity

```typescript
// Calculate essence cost for cyberlimb with grade
export function calculateCyberlimbEssenceCost(
  catalogItem: CyberlimbCatalogItem,
  grade: CyberwareGrade
): number;

// Note: Customization does NOT affect essence cost
// Enhancements and accessories installed in limb have 0 essence cost
```

#### 3.4 Cyberlimb Cost Calculations (`lib/rules/cyberlimbs/costs.ts`)

```typescript
// Calculate total cost for cyberlimb
export function calculateCyberlimbCost(
  catalogItem: CyberlimbCatalogItem,
  grade: CyberwareGrade,
  customization: { strength: number; agility: number }
): number;
// Formula: (baseCost × gradeMultiplier) + (customPoints × 5000)

// Calculate availability
export function calculateCyberlimbAvailability(
  catalogItem: CyberlimbCatalogItem,
  grade: CyberwareGrade,
  customization: { strength: number; agility: number }
): number;
// Formula: baseAvail + gradeModifier + customPoints
```

#### 3.5 Cyberlimb Capacity Management (`lib/rules/cyberlimbs/capacity.ts`)

**Capability Reference:** `character.augmentation-systems` - Augmentation Governance (internal capacity constraints)

```typescript
export function getAvailableCapacity(limb: CyberlimbItem): number;
export function canInstallItem(limb: CyberlimbItem, capacityCost: number): boolean;
export function recalculateCapacityUsed(limb: CyberlimbItem): number;
```

---

### Phase 4: API Endpoints

#### 4.1 Cyberlimb Management API (`app/api/characters/[characterId]/cyberlimbs/route.ts`)

```typescript
// POST - Install new cyberlimb
// GET - List installed cyberlimbs
```

#### 4.2 Cyberlimb Operations API (`app/api/characters/[characterId]/cyberlimbs/[limbId]/route.ts`)

```typescript
// GET - Get cyberlimb details
// DELETE - Remove cyberlimb
// PATCH - Update wireless state, add/remove enhancements
```

#### 4.3 Enhancement Management API (`app/api/characters/[characterId]/cyberlimbs/[limbId]/enhancements/route.ts`)

```typescript
// POST - Install enhancement
// DELETE - Remove enhancement
```

---

### Phase 5: UI Components

#### 5.1 CyberlimbSelector Component

**ADR Reference:** ADR-011 (Sheet-Driven Creation) - editable component for creation and viewing

**Location:** `app/characters/create/components/CyberlimbSelector.tsx`

**Props:**
```typescript
interface CyberlimbSelectorProps {
  catalog: CyberlimbCatalogItem[];
  character: Character;
  mode: "creation" | "advancement" | "view";
  onInstall: (limb: CyberlimbItem) => void;
  maxAvailability?: number;
  remainingEssence: number;
}
```

**Features:**
- Location picker (visual body diagram)
- Limb type/appearance selector
- Grade selector with cost/essence preview
- Customization sliders (STR/AGI)
- Racial maximum enforcement
- Availability/essence warnings

#### 5.2 CyberlimbCustomizer Component

**Location:** `app/characters/create/components/CyberlimbCustomizer.tsx`

**Props:**
```typescript
interface CyberlimbCustomizerProps {
  limb: CyberlimbItem;
  enhancementCatalog: CyberlimbEnhancementCatalogItem[];
  accessoryCatalog: CyberlimbAccessoryCatalogItem[];
  weaponCatalog: CyberImplantWeaponCatalogItem[];
  onUpdate: (limb: CyberlimbItem) => void;
  onClose: () => void;
}
```

**Features:**
- Current limb stats display (STR, AGI, capacity)
- Enhancement browser with capacity cost preview
- Installed enhancements list with remove option
- Accessory browser and installation
- Weapon installation (with capacity cost)
- Wireless toggle per item

#### 5.3 CyberlimbCard Component

**Location:** `components/CyberlimbCard.tsx`

**Purpose:** Display installed cyberlimb in character sheet

**Features:**
- Limb location and type display
- Final STR/AGI values
- Capacity bar (used/total)
- Nested enhancement/accessory list
- Wireless status indicator
- Expand/collapse for details

#### 5.4 BodyDiagram Component

**Location:** `components/BodyDiagram.tsx`

**Purpose:** Visual representation of cyberlimb locations

**Features:**
- SVG body silhouette
- Click to select location
- Color-coded installed limbs
- Tooltip on hover showing limb details

---

### Phase 6: Integration

#### 6.1 Update AugmentationsStep

Integrate cyberlimb selector into existing augmentations step:
- Add "Cyberlimbs" tab alongside Cyberware/Bioware
- Handle essence budget across all augmentation types

#### 6.2 Update Character Sheet

Add cyberlimbs section to character sheet:
- Display in augmentations panel
- Show CM bonus from cyberlimbs
- Integrate with derived stats (effective STR/AGI)

#### 6.3 Update Derived Stats Calculation

Modify derived stats to consider cyberlimbs:
- Physical Condition Monitor: `8 + ceil(BOD/2) + cyberlimbCMBonus`
- Physical Limit: Consider cyberlimb attributes when applicable
- Unarmed damage: Use limb STR for cyberlimb attacks

---

## Verification Plan

### Automated Tests

#### Unit Tests (`lib/rules/cyberlimbs/__tests__/`)

**Validation Tests:**
- [ ] Reject installation when essence would drop below 0.01
- [ ] Reject installation when availability exceeds 12 (creation)
- [ ] Reject customization exceeding racial maximum
- [ ] Reject enhancement when capacity exceeded
- [ ] Reject duplicate enhancement type in same limb
- [ ] Allow replacement of same enhancement type
- [ ] Enforce hierarchical location rules (full arm blocks hand)
- [ ] Require paired accessories (hydraulic jacks)

**Attribute Calculation Tests:**
- [ ] Correct limb STR = base(3) + custom + enhancement
- [ ] Correct limb AGI = base(3) + custom + enhancement
- [ ] Single limb action uses limb attribute
- [ ] Multiple limb action uses average (rounded down)
- [ ] Coordinated action uses weakest limb
- [ ] Partial limbs only apply to direct tests

**Essence/Cost Calculation Tests:**
- [ ] Essence cost = base × grade multiplier
- [ ] Customization does not affect essence
- [ ] Enhancements have 0 essence cost
- [ ] Cost = (base × grade) + (custom × 5000)
- [ ] Enhancement costs scale with rating

**Physical CM Bonus Tests:**
- [ ] Full limbs add +1 CM
- [ ] Partial limbs add +0.5 CM
- [ ] Hands/feet add +0 CM
- [ ] Total bonus is floored

#### Integration Tests (`lib/rules/cyberlimbs/__tests__/integration/`)

- [ ] Full character creation with cyberlimbs
- [ ] Cyberlimb with enhancements saves/loads correctly
- [ ] Removing cyberlimb restores essence
- [ ] Wireless toggle persists
- [ ] Modification history records all changes

### Manual Testing

1. **Character Creation Flow:**
   - Create character with Priority A Resources
   - Purchase obvious cyberarm with +2 STR customization
   - Add STR Enhancement 3 to cyberarm
   - Verify total STR = 8 (3 base + 2 custom + 3 enhancement)
   - Add gyromount (8 capacity)
   - Verify capacity remaining = 4 (15 - 8 - 3)
   - Save character and reload
   - Verify all values persist

2. **Essence Tracking:**
   - Install Alpha grade cyberarm (0.8 essence)
   - Verify essence drops to 5.2
   - Install enhancement (verify no additional essence cost)
   - Remove cyberarm
   - Verify essence returns to 6.0

3. **Validation Edge Cases:**
   - Attempt to install hand when full arm exists (should fail)
   - Attempt enhancement rating 4 (should fail, max 3)
   - Attempt STR customization of 6 on human (should fail, exceeds natural max)
   - Attempt gyromount + large smuggling compartment in hand (should fail, exceeds capacity 4)

4. **Wireless Integration:**
   - Install gyromount with wireless enabled
   - Verify action economy benefit displays
   - Toggle wireless off
   - Verify benefit no longer applies
   - Toggle global wireless off
   - Verify all cyberlimb wireless effects disabled

---

## Dependency Order

```
Phase 1 (Data) ─────────────────────────────────────────────────►
      │
      ▼
Phase 2 (Types) ────────────────────────────────────────────────►
      │
      ├──► Phase 3.1 (Validation)
      │         │
      │         ├──► Phase 3.2 (Attributes)
      │         │
      │         ├──► Phase 3.3 (Essence)
      │         │
      │         ├──► Phase 3.4 (Costs)
      │         │
      │         └──► Phase 3.5 (Capacity)
      │
      └──► Phase 4 (API) ◄── requires Phase 3
                │
                ▼
          Phase 5 (UI) ◄── requires Phase 4
                │
                ▼
          Phase 6 (Integration)
```

---

## Open Questions for User

1. **Customization immutability:** Should we strictly enforce that customization cannot be changed after purchase, or allow a "refit" option with cost/time penalty?

2. **Cyberlimb damage tracking:** Should individual cyberlimbs have their own condition (damaged/destroyed), or rely on overall character condition?

3. **Full body replacement:** Should we support full body conversion (cyberskull + cybertorso + 4 limbs) with special rules, or treat as standard multiple installations?

4. **Cyber melee weapon STR:** When calculating damage for spurs/blades installed in a cyberlimb, should we always use the limb's STR, or allow character to choose natural vs limb STR?

---

## Files to Create/Modify

### New Files
- `lib/types/cyberlimb.ts` - Cyberlimb type definitions
- `lib/rules/cyberlimbs/validation.ts` - Validation logic
- `lib/rules/cyberlimbs/attributes.ts` - Attribute calculations
- `lib/rules/cyberlimbs/essence.ts` - Essence calculations
- `lib/rules/cyberlimbs/costs.ts` - Cost calculations
- `lib/rules/cyberlimbs/capacity.ts` - Capacity management
- `lib/rules/cyberlimbs/index.ts` - Module exports
- `lib/rules/cyberlimbs/__tests__/*.test.ts` - Unit tests
- `app/api/characters/[characterId]/cyberlimbs/route.ts` - API endpoint
- `app/api/characters/[characterId]/cyberlimbs/[limbId]/route.ts` - API endpoint
- `app/api/characters/[characterId]/cyberlimbs/[limbId]/enhancements/route.ts` - API endpoint
- `app/characters/create/components/CyberlimbSelector.tsx` - Selection component
- `app/characters/create/components/CyberlimbCustomizer.tsx` - Customization component
- `components/CyberlimbCard.tsx` - Display component
- `components/BodyDiagram.tsx` - Visual location selector

### Modified Files
- `data/editions/sr5/core-rulebook.json` - Data corrections and additions
- `lib/types/character.ts` - Add cyberlimbs field to Character
- `lib/types/edition.ts` - Add catalog types
- `lib/types/index.ts` - Export new types
- `app/characters/create/components/steps/AugmentationsStep.tsx` - Integrate cyberlimbs
- `app/characters/[id]/page.tsx` - Display cyberlimbs on sheet
- `lib/rules/calculations/derivedStats.ts` - CM bonus from cyberlimbs (if exists)

---

## Estimated Scope

- **Phase 1:** ~2-3 hours (data corrections)
- **Phase 2:** ~2-3 hours (type definitions)
- **Phase 3:** ~4-6 hours (business logic)
- **Phase 4:** ~2-3 hours (API endpoints)
- **Phase 5:** ~6-8 hours (UI components)
- **Phase 6:** ~2-3 hours (integration)
- **Testing:** ~4-6 hours (unit + manual)

**Total estimated effort:** ~22-32 hours of development time
