# Implementation Plan: Full Cyberlimb System for SR5

**Created:** 2026-01-08
**Status:** Draft - Awaiting Review
**Target Feature:** Complete Cyberlimb System Implementation for SR5

---

## Goal Description

Implement a complete cyberlimb system for Shadowrun 5th Edition that satisfies all guarantees from `character.augmentation-systems` capability, adheres to ADR-010 (Inventory State Management) and ADR-011 (Sheet-Driven Creation), and accurately represents the SR5 Core Rulebook cyberlimb rules.

**Key Outcomes:**

1. Characters can install cyberlimbs with proper location tracking and hierarchy
2. Cyberlimbs have independent STR/AGI attributes with customization and enhancement support
3. Capacity system tracks enhancements, accessories, and weapons within limbs
4. Physical Condition Monitor bonus calculated from installed limbs
5. Attribute averaging/selection works correctly for tests involving cyberlimbs
6. All data in `core-rulebook.json` matches source material tables
7. UI supports cyberlimb selection during creation and post-creation management

---

## User Review Required

### Critical Architectural Decisions

1. **CyberlimbItem as Specialized Interface**
   - Proposal: Create `CyberlimbItem` extending `CyberwareItem` with cyberlimb-specific fields rather than adding nullable fields to base interface
   - Rationale: Clean separation, type safety, avoids polluting general cyberware with limb-specific concerns
   - Alternative: Add all fields to `CyberwareItem` with `category === 'cyberlimb'` guards

2. **Limb Location Enum vs String Union**
   - Proposal: Use TypeScript string union type `CyberlimbLocation` for type safety
   - Considerations: May need to add body locations for non-standard limbs in sourcebooks

3. **Attribute Calculation Engine Scope**
   - Proposal: Implement calculation functions in `lib/rules/cyberlimbs/` as pure functions
   - Question: Should this live alongside advancement rules or in a new domain folder?

4. **Data Corrections Timing**
   - Proposal: Correct `core-rulebook.json` values as first implementation step (breaking change for existing test characters)
   - Question: Do any existing test characters rely on current (incorrect) values?

---

## Proposed Changes

### Phase 1: Type System Foundation

#### 1.1 New Type Definitions

**File:** `lib/types/cyberlimbs.ts` (NEW)

```typescript
/**
 * Cyberlimb-specific types extending the base cyberware system.
 * @see Capability: character.augmentation-systems
 * @see ADR-010: Inventory State Management
 */

// Location tracking for installed limbs
export type CyberlimbLocation =
  | "left-arm"
  | "right-arm"
  | "left-leg"
  | "right-leg"
  | "left-hand"
  | "right-hand"
  | "left-foot"
  | "right-foot"
  | "left-lower-arm"
  | "right-lower-arm"
  | "left-lower-leg"
  | "right-lower-leg"
  | "torso"
  | "skull";

// Limb type determines base capacity and CM bonus
export type CyberlimbType =
  | "full-arm"
  | "full-leg"
  | "lower-arm"
  | "lower-leg"
  | "hand"
  | "foot"
  | "torso"
  | "skull";

// Appearance affects capacity and concealment
export type CyberlimbAppearance = "obvious" | "synthetic";

// Extended interface for installed cyberlimbs
export interface CyberlimbItem extends Omit<CyberwareItem, "category"> {
  category: "cyberlimb";

  // Location tracking
  location: CyberlimbLocation;
  limbType: CyberlimbType;
  appearance: CyberlimbAppearance;

  // Cyberlimb attributes (always start at 3)
  baseStrength: 3;
  baseAgility: 3;

  // Customization (set at purchase, immutable)
  customStrength: number; // 0 to (racial max - 3)
  customAgility: number; // 0 to (racial max - 3)

  // Capacity tracking
  baseCapacity: number;
  capacityUsed: number;

  // Installed items (use capacity)
  enhancements: CyberlimbEnhancement[];
  accessories: CyberlimbAccessory[];
  weapons: CyberImplantWeapon[];

  // State (per ADR-010)
  condition: "working" | "bricked" | "permanently_bricked";

  // Audit trail
  installedAt: ISODateString;
  modificationHistory?: CyberlimbModificationEntry[];
}

// Enhancement installed in a cyberlimb
export interface CyberlimbEnhancement {
  id: string;
  catalogId: string;
  name: string;
  type: "agility" | "strength" | "armor";
  rating: number; // 1-3
  capacityCost: number; // Equals rating
  cost: number; // After grade multiplier
  availability: number;
  legality?: ItemLegality;
}

// Accessory installed in a cyberlimb
export interface CyberlimbAccessory {
  id: string;
  catalogId: string;
  name: string;
  capacityCost: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  wirelessEnabled?: boolean;
  wirelessEffects?: WirelessEffect[];
  // For items like Hydraulic Jacks that require paired installation
  pairedLimbId?: string;
}

// Weapon installed in cyberlimb or meat
export interface CyberImplantWeapon {
  id: string;
  catalogId: string;
  name: string;
  weaponType: "melee" | "ranged";
  capacityCost: number; // For limb installation
  essenceCost: number; // For meat installation
  damage: string;
  ap: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  // Ranged weapon fields
  ammoCapacity?: number;
  currentAmmo?: number;
  firingModes?: string[];
}

// Modification history entry
export interface CyberlimbModificationEntry {
  timestamp: ISODateString;
  action: "install" | "remove" | "upgrade" | "replace";
  itemType: "enhancement" | "accessory" | "weapon";
  itemId: string;
  itemName: string;
  previousState?: unknown;
  newState?: unknown;
}

// Limb hierarchy for replacement rules
export const LIMB_HIERARCHY: Record<CyberlimbType, CyberlimbType[]> = {
  "full-arm": ["lower-arm", "hand"],
  "full-leg": ["lower-leg", "foot"],
  "lower-arm": ["hand"],
  "lower-leg": ["foot"],
  hand: [],
  foot: [],
  torso: [],
  skull: [],
};

// Physical CM bonus per limb type
export const LIMB_CM_BONUS: Record<CyberlimbType, number> = {
  "full-arm": 1,
  "full-leg": 1,
  torso: 1,
  skull: 1,
  "lower-arm": 0.5,
  "lower-leg": 0.5,
  hand: 0,
  foot: 0,
};
```

**Capability Requirement Satisfied:**

- REQ: "Cybernetic limbs MUST manage internal capacity constraints for secondary enhancements and specialized accessories"
- REQ: "The system MUST maintain a persistent and auditable record of all installed modifications"

---

#### 1.2 Update Character Type

**File:** `lib/types/character.ts`

**Change:** Add `cyberlimbs` array to Character interface alongside `cyberware`

```typescript
// After existing cyberware field
/** Installed cyberlimbs (specialized cyberware with capacity) */
cyberlimbs?: CyberlimbItem[];
```

**Rationale (ADR-011):** Separating cyberlimbs allows UI components to handle them distinctly without filtering the cyberware array.

---

#### 1.3 Update Export Index

**File:** `lib/types/index.ts`

**Change:** Re-export all new cyberlimb types

```typescript
export * from "./cyberlimbs";
```

---

### Phase 2: Catalog Data Corrections

#### 2.1 Fix Cyberlimb Capacity Values

**File:** `data/editions/sr5/core-rulebook.json`

**Changes per Reference Material (docs/rules/5e/game-mechanics/cyberlimbs.md):**

| Item ID                   | Field        | Current | Correct | Source         |
| ------------------------- | ------------ | ------- | ------- | -------------- |
| `cyberlimb-arm`           | capacity     | 10      | 15      | SR5 Core p.458 |
| `cyberlimb-leg`           | capacity     | 12      | 20      | SR5 Core p.458 |
| `cyberlimb-hand`          | capacity     | 2       | 4       | SR5 Core p.458 |
| `cyberlimb-foot`          | capacity     | 2       | 4       | SR5 Core p.458 |
| `cyberlimb-lower-arm`     | capacity     | 5       | 10      | SR5 Core p.458 |
| `cyberlimb-lower-leg`     | capacity     | 6       | 12      | SR5 Core p.458 |
| `cyberlimb-arm-synthetic` | capacity     | 5       | 8       | SR5 Core p.458 |
| `cyberlimb-leg-synthetic` | capacity     | 6       | 10      | SR5 Core p.458 |
| `cyberlimb-torso`         | availability | 6       | 12      | SR5 Core p.458 |
| `cyberlimb-skull`         | availability | 4       | 16      | SR5 Core p.458 |

---

#### 2.2 Fix Enhancement Values

**File:** `data/editions/sr5/core-rulebook.json`

**Changes:**

| Item ID              | Field        | Current | Correct         | Source         |
| -------------------- | ------------ | ------- | --------------- | -------------- |
| `cyberlimb-agility`  | cost         | 3000    | 6500            | SR5 Core p.458 |
| `cyberlimb-strength` | cost         | 3000    | 6500            | SR5 Core p.458 |
| `cyberlimb-agility`  | availability | 8       | `(Rating x 3)R` | SR5 Core p.458 |
| `cyberlimb-strength` | availability | 8       | `(Rating x 3)R` | SR5 Core p.458 |
| `cyberlimb-armor`    | availability | 8       | `Rating x 5`    | SR5 Core p.458 |

**Implementation Note:** Update `ratingSpec` structure to use per-rating availability calculation.

---

#### 2.3 Add Missing Items

**File:** `data/editions/sr5/core-rulebook.json`

**New entries required:**

1. **Synthetic Partial Limbs:**
   - `cyberlimb-hand-synthetic` (Essence 0.25, Capacity 2, Cost 6000)
   - `cyberlimb-foot-synthetic` (Essence 0.25, Capacity 2, Cost 6000)
   - `cyberlimb-lower-arm-synthetic` (Essence 0.45, Capacity 5, Cost 12000)
   - `cyberlimb-lower-leg-synthetic` (Essence 0.45, Capacity 6, Cost 12000)
   - `cyberlimb-torso-synthetic` (Essence 1.5, Capacity 5, Cost 25000, Avail 12)
   - `cyberlimb-skull-synthetic` (Essence 0.75, Capacity 2, Cost 15000, Avail 16)

2. **Accessories:**
   - `hydraulic-jacks` (Rating 1-6, Capacity [Rating], Avail 9, Cost Rating x 2500)
   - `large-smuggling-compartment` (Capacity [5], Avail 6, Cost 8000)

3. **Cyber Implant Weapons:**
   - Cyberguns (hold-out through grenade launcher)
   - Cyber melee weapons (hand blade, hand razors, spurs, shock hand)

**Capability Requirement Satisfied:**

- REQ: "The system MUST provide a catalog-driven selection process for various augmentation categories including headware, cyberlimbs, and bioware"

---

#### 2.4 Add Cyberlimb-Specific Catalog Fields

**File:** `lib/types/edition.ts`

**Change:** Extend `CyberwareCatalogItem` with cyberlimb-specific optional fields:

```typescript
// Add to CyberwareCatalogItem interface
/** For cyberlimbs: limb type */
limbType?: CyberlimbType;
/** For cyberlimbs: appearance options */
appearanceOptions?: CyberlimbAppearance[];
/** For cyberlimbs: base STR/AGI (always 3) */
baseAttributes?: { strength: number; agility: number };
/** For accessories: required limb types */
requiredLimbTypes?: CyberlimbType[];
/** For accessories: requires paired installation */
requiresPair?: boolean;
```

---

### Phase 3: Calculation Engine

#### 3.1 Core Calculation Functions

**File:** `lib/rules/cyberlimbs/calculations.ts` (NEW)

```typescript
/**
 * Cyberlimb attribute and capacity calculation functions.
 * Pure functions with no side effects.
 * @see Capability: character.augmentation-systems
 */

/**
 * Calculate effective attribute for a single cyberlimb.
 * Formula: Base (3) + Customization + Enhancement
 */
export function calculateLimbAttribute(
  limb: CyberlimbItem,
  attribute: "strength" | "agility"
): number;

/**
 * Calculate effective attribute when multiple limbs involved.
 * Returns average of all involved limbs (natural + cyber).
 * Natural limbs use character's base racial attribute.
 */
export function calculateAveragedAttribute(
  character: Character,
  involvedLocations: CyberlimbLocation[],
  attribute: "strength" | "agility"
): number;

/**
 * Get the weakest limb's attribute value.
 * Used for coordinated actions requiring precision.
 */
export function getWeakestLimbAttribute(
  character: Character,
  involvedLocations: CyberlimbLocation[],
  attribute: "strength" | "agility"
): number;

/**
 * Calculate Physical Condition Monitor bonus from cyberlimbs.
 * Returns floor(sum of all limb bonuses).
 */
export function calculateCyberlimbCMBonus(cyberlimbs: CyberlimbItem[]): number;

/**
 * Calculate remaining capacity in a cyberlimb.
 */
export function calculateRemainingCapacity(limb: CyberlimbItem): number;

/**
 * Calculate total limb cost including customization.
 * Formula: (Base × Grade) + (Custom Points × 5000) + Sum(Enhancement Costs)
 */
export function calculateLimbTotalCost(limb: CyberlimbItem, gradeMultiplier: number): number;

/**
 * Calculate customization availability modifier.
 * Each point above base adds +1 to availability.
 */
export function calculateCustomizationAvailability(
  customStrength: number,
  customAgility: number
): number;
```

**Capability Requirement Satisfied:**

- REQ: "Bonuses from installed augmentations MUST be automatically propagated to the character's primary and derived statistics"

---

#### 3.2 Validation Functions

**File:** `lib/rules/cyberlimbs/validation.ts` (NEW)

```typescript
/**
 * Cyberlimb validation for creation and post-creation.
 * @see Capability: character.augmentation-systems (Constraints section)
 */

/**
 * Validate a cyberlimb can be installed at the given location.
 * Checks: no duplicates, limb hierarchy (full replaces partial).
 */
export function validateLimbInstallation(
  character: Character,
  newLimb: Partial<CyberlimbItem>
): ValidationResult;

/**
 * Validate customization is within racial limits.
 * Cannot exceed natural racial maximum.
 */
export function validateCustomization(customValue: number, racialMaximum: number): ValidationResult;

/**
 * Validate enhancement fits within capacity.
 */
export function validateEnhancementCapacity(
  limb: CyberlimbItem,
  enhancement: CyberlimbEnhancement
): ValidationResult;

/**
 * Validate availability for character creation (max 12).
 */
export function validateCreationAvailability(finalAvailability: number): ValidationResult;

/**
 * Check if enhancement of same type already exists.
 * Only one of each type allowed per limb.
 */
export function checkEnhancementDuplicate(
  limb: CyberlimbItem,
  enhancementType: "agility" | "strength" | "armor"
): boolean;

/**
 * Validate paired installation requirements.
 * e.g., Hydraulic Jacks require matching jacks in both legs.
 */
export function validatePairedInstallation(
  character: Character,
  accessory: CyberlimbAccessory,
  targetLocation: CyberlimbLocation
): ValidationResult;

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
```

**Capability Requirement Satisfied:**

- REQ: "Augmented improvements MUST NOT exceed ruleset-defined maximums relative to the character's natural racial limits"
- REQ: "Mutually exclusive augmentations MUST be identified and prevented by the system"

---

#### 3.3 Limb Hierarchy Logic

**File:** `lib/rules/cyberlimbs/hierarchy.ts` (NEW)

```typescript
/**
 * Limb hierarchy and replacement logic.
 * Full limbs replace partial limbs at the same location.
 */

/**
 * Get all locations that would be replaced by installing a limb.
 */
export function getReplacedLocations(
  limbType: CyberlimbType,
  side: "left" | "right"
): CyberlimbLocation[];

/**
 * Get the parent limb for a partial limb location.
 */
export function getParentLimb(location: CyberlimbLocation): CyberlimbLocation | null;

/**
 * Check if a location is occupied by a full limb.
 */
export function isLocationOccupiedByFullLimb(
  cyberlimbs: CyberlimbItem[],
  location: CyberlimbLocation
): boolean;

/**
 * Map catalog limb type to location based on side selection.
 */
export function mapLimbTypeToLocation(
  limbType: CyberlimbType,
  side?: "left" | "right"
): CyberlimbLocation;
```

---

### Phase 4: Integration with Existing Systems

#### 4.1 Derived Stats Integration

**File:** `lib/rules/derivedStats.ts` (MODIFY)

**Change:** Update Physical CM calculation to include cyberlimb bonus

```typescript
// In calculatePhysicalConditionMonitor function
const cyberlimbBonus = calculateCyberlimbCMBonus(character.cyberlimbs || []);
const baseCM = Math.ceil(character.attributes.body / 2) + 8;
return baseCM + cyberlimbBonus;
```

**Capability Requirement Satisfied:**

- REQ: "Bonuses from installed augmentations MUST be automatically propagated to the character's primary and derived statistics"

---

#### 4.2 Essence Tracking Integration

**File:** `lib/rules/essence.ts` (MODIFY if exists, or NEW)

**Change:** Ensure cyberlimbs are included in total Essence calculation

```typescript
export function calculateTotalEssenceCost(character: Character): number {
  const cyberwareEssence = (character.cyberware || []).reduce(
    (sum, item) => sum + item.essenceCost,
    0
  );

  const cyberlimbEssence = (character.cyberlimbs || []).reduce(
    (sum, limb) => sum + limb.essenceCost,
    0
  );

  const biowareEssence = (character.bioware || []).reduce((sum, item) => sum + item.essenceCost, 0);

  return cyberwareEssence + cyberlimbEssence + biowareEssence;
}
```

**Capability Requirement Satisfied:**

- REQ: "Every augmentation MUST result in a verifiable reduction in the character's Essence according to ruleset-defined multipliers"

---

#### 4.3 Wireless State Integration

**File:** `lib/rules/wireless.ts` (MODIFY if exists)

**Change:** Include cyberlimb accessories in wireless effect aggregation

Per ADR-010, cyberlimb accessories with wireless bonuses need structured effects:

| Accessory                   | Wireless Effect                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| Gyromount                   | `{ "type": "action_economy", "action": "toggle_gyromount", "from": "simple", "to": "free" }`      |
| Cyber holster               | `{ "type": "action_economy", "action": "ready_from_holster", "from": "simple", "to": "free" }`    |
| Hydraulic jacks             | `{ "type": "dice_pool", "skills": ["jumping", "sprinting", "lifting"], "modifier": 1 }`           |
| Large smuggling compartment | `{ "type": "action_economy", "action": "access_compartment", "from": "complex", "to": "simple" }` |

---

### Phase 5: UI Components

#### 5.1 Cyberlimb Location Picker

**File:** `components/CyberlimbLocationPicker.tsx` (NEW)

**Purpose:** Visual body diagram for selecting limb installation location

**Props:**

```typescript
interface CyberlimbLocationPickerProps {
  occupiedLocations: CyberlimbLocation[];
  onSelectLocation: (location: CyberlimbLocation) => void;
  allowedLocations?: CyberlimbLocation[]; // For partial limbs
  disabled?: boolean;
}
```

**ADR-011 Compliance:** Works in both creation and viewing modes via `disabled` prop.

---

#### 5.2 Cyberlimb Customizer Modal

**File:** `components/CyberlimbCustomizer.tsx` (NEW)

**Purpose:** Configure a cyberlimb's customization and enhancements

**Props:**

```typescript
interface CyberlimbCustomizerProps {
  limb: CyberlimbItem;
  racialMaximums: { strength: number; agility: number };
  availableEnhancements: CyberwareCatalogItem[];
  availableAccessories: CyberwareCatalogItem[];
  mode: "creation" | "advancement" | "view";
  onSave: (updatedLimb: CyberlimbItem) => void;
  onCancel: () => void;
}
```

**Sections:**

1. Base Info (name, location, grade, appearance)
2. Attribute Customization (STR/AGI sliders up to racial max)
3. Capacity Display (bar showing used/available)
4. Enhancement Slots (AGI, STR, Armor - one each max)
5. Accessory List (items using remaining capacity)
6. Cost/Availability Summary

---

#### 5.3 Cyberlimb Card Component

**File:** `components/CyberlimbCard.tsx` (NEW)

**Purpose:** Display installed cyberlimb in character sheet/creation

**Props:**

```typescript
interface CyberlimbCardProps {
  limb: CyberlimbItem;
  onEdit?: () => void;
  onRemove?: () => void;
  compact?: boolean;
}
```

**Display:**

- Location icon and limb name
- Grade badge
- Final STR/AGI values
- Capacity bar (used/total)
- Installed items list (collapsible)
- Wireless status indicator

---

#### 5.4 Integration with GearStep

**File:** `app/characters/create/components/steps/GearStep.tsx` (MODIFY)

**Change:** Add cyberlimb browser section with:

- Category filter for cyberlimbs
- Location selection flow
- Customization modal trigger
- Capacity preview before adding

---

### Phase 6: API Endpoints

#### 6.1 Cyberlimb Management Endpoints

**File:** `app/api/characters/[characterId]/cyberlimbs/route.ts` (NEW)

```typescript
// POST: Install new cyberlimb
// Body: { catalogId, grade, location, customStrength, customAgility }
// Returns: Updated character with new cyberlimb

// DELETE /[limbId]: Remove cyberlimb
// Returns: Updated character, essence recovered
```

**File:** `app/api/characters/[characterId]/cyberlimbs/[limbId]/enhancements/route.ts` (NEW)

```typescript
// POST: Add enhancement to cyberlimb
// Body: { catalogId, rating }
// Returns: Updated limb with enhancement

// DELETE /[enhancementId]: Remove enhancement
// Returns: Updated limb with capacity freed
```

---

## Verification Plan

### Automated Tests

#### Unit Tests

**File:** `lib/rules/cyberlimbs/__tests__/calculations.test.ts`

| Test Case                               | Description                           | Capability Reference |
| --------------------------------------- | ------------------------------------- | -------------------- |
| `calculateLimbAttribute.basic`          | Base 3 + custom 2 + enhancement 3 = 8 | Measurable bonuses   |
| `calculateLimbAttribute.noEnhancement`  | Base 3 + custom 0 = 3                 | Base attribute       |
| `calculateAveragedAttribute.mixedLimbs` | (Natural 5 + Cyber 6) / 2 = 5 (floor) | Attribute averaging  |
| `getWeakestLimbAttribute.coordination`  | Returns lowest of all involved limbs  | Coordinated actions  |
| `calculateCyberlimbCMBonus.fullSet`     | 2 arms + 2 legs = 4 CM                | CM bonus calculation |
| `calculateCyberlimbCMBonus.partial`     | 1 full arm + 2 lower legs = 2 CM      | Partial limb bonus   |
| `calculateRemainingCapacity.withItems`  | 15 - 8 - 3 = 4 remaining              | Capacity management  |

**File:** `lib/rules/cyberlimbs/__tests__/validation.test.ts`

| Test Case                                      | Description                                 | Constraint Reference  |
| ---------------------------------------------- | ------------------------------------------- | --------------------- |
| `validateLimbInstallation.noDuplicates`        | Cannot install two left arms                | No duplicates         |
| `validateLimbInstallation.fullReplacesPartial` | Full arm removes lower-arm and hand         | Limb hierarchy        |
| `validateCustomization.exceedsMax`             | Custom 5 with racial max 6 = invalid        | Racial maximum        |
| `validateEnhancementCapacity.exceeds`          | Rating 3 in limb with 2 capacity = invalid  | Capacity budget       |
| `validateCreationAvailability.over12`          | Avail 14 at creation = invalid              | Creation availability |
| `checkEnhancementDuplicate.blocked`            | Two STR enhancements = duplicate            | One per type          |
| `validatePairedInstallation.missingPair`       | Left hydraulic jack without right = invalid | Paired requirement    |

**File:** `lib/rules/cyberlimbs/__tests__/hierarchy.test.ts`

| Test Case                           | Description                             |
| ----------------------------------- | --------------------------------------- |
| `getReplacedLocations.fullArm`      | Returns [lower-arm, hand] for same side |
| `getReplacedLocations.lowerLeg`     | Returns [foot] for same side            |
| `getParentLimb.hand`                | Returns lower-arm or full-arm           |
| `isLocationOccupiedByFullLimb.true` | Left-hand occupied by left-full-arm     |

#### Integration Tests

**File:** `app/api/characters/[characterId]/cyberlimbs/__tests__/route.test.ts`

| Test Case                              | Description                                      |
| -------------------------------------- | ------------------------------------------------ |
| `POST.installCyberlimb`                | Creates limb, reduces essence, updates character |
| `POST.installWithCustomization`        | Validates custom values, calculates costs        |
| `DELETE.removeCyberlimb`               | Removes limb, recovers essence                   |
| `POST.addEnhancement`                  | Validates capacity, updates limb                 |
| `POST.addEnhancement.capacityExceeded` | Returns 400 with error message                   |

### Manual Testing Checklist

#### Character Creation Flow

- [ ] Select cyberlimb from gear browser
- [ ] Location picker shows available slots
- [ ] Full limb installation removes partial limbs
- [ ] Customization sliders respect racial maximum
- [ ] Capacity bar updates as enhancements added
- [ ] Total essence cost displayed accurately
- [ ] Availability warning for > 12
- [ ] Save persists cyberlimb to character

#### Character Sheet Display

- [ ] Cyberlimbs section shows all installed limbs
- [ ] Clicking limb opens customizer in view mode
- [ ] STR/AGI values reflect customization + enhancement
- [ ] Capacity used/total displayed
- [ ] Wireless toggle functional
- [ ] CM bonus reflected in derived stats

#### Edge Cases

- [ ] Installing full arm when lower arm exists
- [ ] Synthetic vs obvious capacity differences
- [ ] Hydraulic jacks require paired installation
- [ ] Grade upgrade preserves customization
- [ ] Enhancement replacement (same type)

---

## Dependency Order

```
Phase 1: Types (no dependencies)
    ↓
Phase 2: Data Corrections (depends on Phase 1 types for validation)
    ↓
Phase 3: Calculation Engine (depends on Phase 1 types)
    ↓
Phase 4: System Integration (depends on Phase 3 calculations)
    ↓
Phase 5: UI Components (depends on Phases 1-4)
    ↓
Phase 6: API Endpoints (depends on all previous phases)
```

**Estimated Files to Create:** 8
**Estimated Files to Modify:** 6
**Estimated JSON Data Entries:** 20+ (corrections + new items)

---

## Open Questions for User Review

1. **Character Migration:** Should we add a migration script for existing test characters with cyberlimbs, or is manual recreation acceptable?

2. **Cyber Implant Weapons Scope:** The reference material includes cyberguns and cyber melee weapons. Should these be included in this implementation or deferred to a separate plan?

3. **UI Placement:** Should the cyberlimb customizer be a modal, slide-out panel, or full-page component?

4. **Appearance Selection:** Should appearance (obvious/synthetic) be selectable at purchase, or should they be separate catalog items (current approach)?

---

## References

- **Capability:** `docs/capabilities/character.augmentation-systems.md`
- **Specification:** `docs/specifications/cyberware_bioware_specification.md`
- **ADR-010:** `docs/decisions/010-gear.inventory-state-management.md`
- **ADR-011:** `docs/decisions/011-character.sheet-driven-creation.md`
- **Rules Reference:** `docs/rules/5e/game-mechanics/cyberlimbs.md`
