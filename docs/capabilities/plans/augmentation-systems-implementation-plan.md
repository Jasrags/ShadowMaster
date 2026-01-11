# Augmentation Systems Implementation Plan

## Goal Description

Implement a complete augmentation system that enables characters to install, manage, and track cyberware and bioware modifications. The system must maintain Essence integrity, enforce grade-based cost calculations, support cyberlimb capacity management, and automatically propagate bonuses to character statistics.

**Target Feature:** Full lifecycle management of character augmentations from creation through active play, including essence tracking, magic/resonance impact, and post-creation modification support.

## Architectural Decisions (APPROVED)

The following architectural decisions have been confirmed:

| Decision                          | Choice                                  | Rationale                                                                                                                                                                   |
| --------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Essence Precision Model**       | Floating-point with 2 decimal precision | Standard approach matching rulebook notation (e.g., 5.73). All essence calculations will use `toFixed(2)` for display and rounding.                                         |
| **Cyberlimb Customization Scope** | Full customization in Phase 1           | Include complete STR/AGI per-limb customization from the start to avoid later refactoring.                                                                                  |
| **Wireless Bonus Toggle**         | Global toggle                           | Single character-level `wirelessBonusesEnabled: boolean` flag. Simplifies UI and matches common gameplay patterns. Per-augmentation control deferred to future enhancement. |

### Implementation Notes from Decisions

**Essence Precision:**

- Store as `number` type (JavaScript float)
- Round to 2 decimal places on all calculations: `Math.round(value * 100) / 100`
- Display using `toFixed(2)` for consistent formatting
- Minimum viable essence threshold: `0.01`

**Cyberlimb Customization:**

- Each cyberlimb tracks individual `strength` and `agility` attributes
- Base values equal to character's natural attributes
- Customization points can increase attributes up to racial maximum + 3
- Customization costs capacity (1 capacity per +1 attribute point)

**Global Wireless:**

- Add `wirelessBonusesEnabled: boolean` to Character type
- When enabled, all wireless bonuses from augmentations apply
- When disabled, no wireless bonuses apply (but augmentations still function)
- Default: `true` (enabled)

## Current State Analysis

### Already Implemented

| Component                               | Location                                 | Status   |
| --------------------------------------- | ---------------------------------------- | -------- |
| CyberwareItem/BiowareItem types         | `/lib/types/character.ts`                | Complete |
| CyberwareCatalogItem/BiowareCatalogItem | `/lib/types/edition.ts`                  | Complete |
| Grade multiplier constants              | `/lib/types/character.ts`                | Complete |
| EssenceHole interface                   | `/lib/types/character.ts`                | Complete |
| Essence-magic link calculations         | `/lib/rules/magic/essence-magic-link.ts` | Partial  |
| Cyberware/Bioware catalogs              | `/data/editions/sr5/core-rulebook.json`  | Complete |
| Character storage fields                | `/lib/storage/characters.ts`             | Basic    |

### Needs Implementation

- Augmentation validation engine
- Essence calculation utilities
- Grade cost/availability application
- Cyberlimb capacity management
- Post-creation API endpoints
- Character creation step (AugmentationsStep)
- Character sheet augmentation display
- Derived stats integration

## Proposed Changes

### Phase 1: Core Calculation Engine

#### 1.1 Essence Calculation Utilities

**File:** `/lib/rules/augmentations/essence.ts` (new)

**Satisfies:** Capability Guarantee #1 (verifiable Essence reduction), Requirement "Essence and Metaphysical Integrity"

```typescript
// Precision constant
const ESSENCE_PRECISION = 2;
const ESSENCE_MIN_VIABLE = 0.01;

// Utility for consistent rounding
function roundEssence(value: number): number {
  return Math.round(value * 100) / 100;
}

// Primary interfaces
interface EssenceCalculation {
  baseEssenceCost: number;
  gradeMultiplier: number;
  finalEssenceCost: number;  // Rounded to 2 decimals
  currentEssence: number;    // Rounded to 2 decimals
  newEssence: number;        // Rounded to 2 decimals
  isViable: boolean;         // newEssence >= 0.01
}

// Functions to implement (all return values rounded to 2 decimal places)
calculateCyberwareEssence(item: CyberwareCatalogItem, grade: CyberwareGrade, rating?: number): number
calculateBiowareEssence(item: BiowareCatalogItem, grade: BiowareGrade, rating?: number): number
calculateTotalEssenceLoss(cyberware: CyberwareItem[], bioware: BiowareItem[]): number
calculateRemainingEssence(baseEssence: number, essenceLoss: number): number
validateEssenceViability(newEssence: number): ValidationResult
formatEssence(value: number): string  // Returns value.toFixed(2)
```

#### 1.2 Grade Application Utilities

**File:** `/lib/rules/augmentations/grades.ts` (new)

**Satisfies:** Requirement "Essence expenditures MUST be calculated based on authoritative grade definitions"

```typescript
// Functions to implement
applyGradeToEssence(baseCost: number, grade: CyberwareGrade | BiowareGrade): number
applyGradeToCost(baseCost: number, grade: CyberwareGrade | BiowareGrade): number
applyGradeToAvailability(baseAvail: number, grade: CyberwareGrade): number
getGradeMultipliers(grade: CyberwareGrade | BiowareGrade): GradeMultipliers
```

#### 1.3 Essence Hole Management

**File:** `/lib/rules/augmentations/essence-hole.ts` (new)

**Satisfies:** Requirement "Essence hole mechanism for characters with magical or resonance paths"

```typescript
// Functions to implement
calculateEssenceHole(peakLoss: number, currentLoss: number): number
updateEssenceHoleOnInstall(current: EssenceHole, newEssenceLoss: number): EssenceHole
updateEssenceHoleOnRemoval(current: EssenceHole, removedEssenceCost: number): EssenceHole
calculateMagicLoss(essenceHole: EssenceHole, formula: MagicReductionFormula): number
shouldTrackEssenceHole(character: Character): boolean
```

---

### Phase 2: Validation Engine

#### 2.1 Augmentation Validators

**File:** `/lib/rules/augmentations/validation.ts` (new)

**Satisfies:** Constraints (max limits, availability, mutual exclusivity)

```typescript
// Validation interfaces
interface AugmentationValidationResult {
  valid: boolean;
  errors: AugmentationValidationError[];
  warnings: AugmentationValidationWarning[];
}

interface AugmentationValidationError {
  code: string;
  message: string;
  field?: string;
  augmentationId?: string;
}

// Functions to implement
validateAugmentationInstall(
  character: Character,
  augmentation: CyberwareCatalogItem | BiowareCatalogItem,
  grade: CyberwareGrade | BiowareGrade,
  rating?: number,
  rules: AugmentationRules
): AugmentationValidationResult

validateMutualExclusion(
  existing: (CyberwareItem | BiowareItem)[],
  newItem: CyberwareCatalogItem | BiowareCatalogItem
): ValidationResult

validateAvailabilityConstraint(
  availability: number,
  lifecycleStage: 'creation' | 'active',
  maxAtCreation: number
): ValidationResult

validateAttributeBonusLimit(
  currentBonuses: Record<string, number>,
  newBonuses: Record<string, number>,
  maxBonus: number,
  racialLimits: Record<string, number>
): ValidationResult
```

#### 2.2 Cyberlimb Capacity and Customization

**File:** `/lib/rules/augmentations/cyberlimb.ts` (new)

**Satisfies:** Requirement "Cybernetic limbs MUST manage internal capacity constraints"

```typescript
// Cyberlimb attribute customization interface
interface CyberlimbCustomization {
  strength: number;      // Current STR value for this limb
  agility: number;       // Current AGI value for this limb
  baseStrength: number;  // Character's natural STR (starting point)
  baseAgility: number;   // Character's natural AGI (starting point)
  strengthBonus: number; // Additional STR purchased (costs capacity)
  agilityBonus: number;  // Additional AGI purchased (costs capacity)
  maxStrength: number;   // Racial max + 3
  maxAgility: number;    // Racial max + 3
}

interface CyberlimbCapacityBreakdown {
  totalCapacity: number;
  usedByEnhancements: number;
  usedByCustomization: number;  // 1 capacity per +1 to STR or AGI
  remainingCapacity: number;
}

// Capacity functions
calculateCyberlimbCapacity(limb: CyberwareItem): number
calculateUsedCapacity(limb: CyberwareItem): CyberlimbCapacityBreakdown
validateEnhancementFits(limb: CyberwareItem, enhancement: CyberwareCatalogItem): ValidationResult
addEnhancementToLimb(limb: CyberwareItem, enhancement: CyberwareCatalogItem, rating?: number): CyberwareItem
removeEnhancementFromLimb(limb: CyberwareItem, enhancementId: string): CyberwareItem

// Customization functions (full STR/AGI per-limb support)
getCyberlimbCustomizationLimits(limb: CyberwareItem, character: Character): CyberlimbCustomization
setCyberlimbAttribute(limb: CyberwareItem, attribute: 'strength' | 'agility', value: number): CyberwareItem
validateCyberlimbCustomization(limb: CyberwareItem, character: Character): ValidationResult
calculateCustomizationCapacityCost(limb: CyberwareItem): number  // 1 per point above base
getCyberlimbEffectiveAttributes(limb: CyberwareItem): { strength: number; agility: number }
```

---

### Phase 3: Character Integration

#### 3.1 Derived Stats Integration

**File:** `/lib/rules/derived-stats.ts` (modify existing)

**Satisfies:** Requirement "Bonuses from installed augmentations MUST be automatically propagated"

```typescript
// Add to existing derived stats calculation
aggregateAugmentationBonuses(character: Character): AugmentationBonuses
applyAugmentationBonusesToStats(baseStats: DerivedStats, bonuses: AugmentationBonuses): DerivedStats

// New interface
interface AugmentationBonuses {
  attributes: Record<string, number>;
  initiativeDice: number;
  limits: Record<string, number>;
  armorBonus: number;
  specialBonuses: Record<string, any>;
}
```

#### 3.2 Augmentation Management Functions

**File:** `/lib/rules/augmentations/management.ts` (new)

**Satisfies:** Requirement "Post-creation management MUST support addition, removal, and grade-level upgrading"

```typescript
// Functions to implement
installCyberware(
  character: Character,
  catalogItem: CyberwareCatalogItem,
  grade: CyberwareGrade,
  rating?: number
): { character: Character; installedItem: CyberwareItem }

installBioware(
  character: Character,
  catalogItem: BiowareCatalogItem,
  grade: BiowareGrade,
  rating?: number
): { character: Character; installedItem: BiowareItem }

removeCyberware(character: Character, itemId: string): Character
removeBioware(character: Character, itemId: string): Character

upgradeAugmentationGrade(
  character: Character,
  itemId: string,
  newGrade: CyberwareGrade | BiowareGrade
): Character

// Global wireless toggle (character-level, not per-augmentation)
toggleGlobalWirelessBonus(character: Character, enabled: boolean): Character
getWirelessBonusState(character: Character): boolean
aggregateActiveWirelessBonuses(character: Character): WirelessBonusAggregate  // Only when enabled
```

---

### Phase 4: API Layer

#### 4.1 Augmentation API Endpoints

**File:** `/app/api/characters/[characterId]/augmentations/route.ts` (new)

**Satisfies:** Guarantee #4 (auditable record of modifications)

```typescript
// GET - List installed augmentations
// POST - Install new augmentation
// Request body: { type: 'cyberware' | 'bioware', catalogId: string, grade: string, rating?: number }

// Response includes:
// - Updated character
// - Essence change details
// - Validation warnings
```

**File:** `/app/api/characters/[characterId]/augmentations/[augmentationId]/route.ts` (new)

```typescript
// GET - Get specific augmentation details
// PUT - Update augmentation (grade upgrade, wireless toggle)
// DELETE - Remove augmentation
```

**File:** `/app/api/characters/[characterId]/augmentations/validate/route.ts` (new)

```typescript
// POST - Validate potential installation without committing
// Returns: validation result, projected essence, projected stats
```

---

### Phase 5: Character Creation Integration

#### 5.1 Augmentations Step Component

**File:** `/app/characters/create/components/steps/AugmentationsStep.tsx` (new)

**Satisfies:** Requirement "catalog-driven selection process"

```typescript
// Component responsibilities:
// - Display cyberware/bioware catalog organized by category
// - Grade selection with cost/essence preview
// - Rating selection for rated items
// - Real-time essence tracking display
// - Magic/Resonance impact warning for awakened characters
// - Budget tracking integration with creation state
// - Cyberlimb capacity visualization
```

#### 5.2 Augmentation Selection Modal

**File:** `/app/characters/create/components/AugmentationModal.tsx` (new)

```typescript
// Subcomponents:
// - CategoryFilter (headware, bodyware, cyberlimb, etc.)
// - GradeSelector with cost/essence preview
// - RatingSelector (for rated items)
// - AugmentationDetails (description, wireless bonus, page ref)
// - InstallPreview (essence cost, final stats impact)
```

#### 5.3 Essence Display Component

**File:** `/components/EssenceDisplay.tsx` (new)

```typescript
// Reusable essence visualization:
// - Current essence bar (0-6 scale)
// - Essence hole indicator (for magic users)
// - Magic/Resonance reduction display
// - Projected essence on hover (during selection)
```

---

### Phase 6: Character Sheet Integration

#### 6.1 Augmentations Panel

**File:** `/app/characters/[id]/components/AugmentationsPanel.tsx` (new)

```typescript
// Display components:
// - Installed cyberware list with grades
// - Installed bioware list with grades
// - Cyberlimb detail view with capacity/enhancements and STR/AGI customization
// - Global wireless bonus toggle (single switch for all augmentations)
// - Wireless bonus summary (shows active bonuses when enabled)
// - Essence summary with magic impact
```

#### 6.2 Augmentation Card Component

**File:** `/components/AugmentationCard.tsx` (new)

```typescript
// Individual augmentation display:
// - Name, grade, essence cost
// - Attribute bonuses visualization
// - Wireless status indicator
// - Enhancement slots (for cyberlimbs)
// - Remove/upgrade actions (post-creation)
```

---

### Phase 7: Ruleset Hooks

#### 7.1 Augmentation Hooks

**File:** `/lib/rules/RulesetContext.tsx` (modify existing)

```typescript
// Add new hooks:
useCyberwareCatalog(): CyberwareCatalogItem[]
useBiowareCatalog(): BiowareCatalogItem[]
useCyberwareGrades(): CyberwareGrade[]
useBiowareGrades(): BiowareGrade[]
useAugmentationRules(): AugmentationRules
useCyberwareByCategory(category: CyberwareCategory): CyberwareCatalogItem[]
useBiowareByCategory(category: BiowareCategory): BiowareCatalogItem[]
```

---

## Dependency Order

```
Phase 1 (Core Calculations)
    ├── 1.1 essence.ts
    ├── 1.2 grades.ts
    └── 1.3 essence-hole.ts
           │
           ▼
Phase 2 (Validation)
    ├── 2.1 validation.ts (depends on 1.1, 1.2)
    └── 2.2 cyberlimb.ts (depends on 1.1)
           │
           ▼
Phase 3 (Character Integration)
    ├── 3.1 derived-stats.ts modifications
    └── 3.2 management.ts (depends on 2.1, 2.2)
           │
           ▼
Phase 4 (API Layer)
    └── All endpoints (depend on 3.2)
           │
           ▼
Phase 5 (Creation UI)           Phase 6 (Sheet UI)
    ├── 5.1 AugmentationsStep      ├── 6.1 AugmentationsPanel
    ├── 5.2 AugmentationModal      └── 6.2 AugmentationCard
    └── 5.3 EssenceDisplay
           │
           ▼
Phase 7 (Ruleset Hooks)
    └── RulesetContext additions
```

## Verification Plan

### Automated Tests

#### Unit Tests

**File:** `/lib/rules/augmentations/__tests__/essence.test.ts`

| Test Case                                                            | Validates                      |
| -------------------------------------------------------------------- | ------------------------------ |
| `calculateCyberwareEssence` returns correct value for standard grade | Guarantee #1                   |
| `calculateCyberwareEssence` applies grade multipliers correctly      | Requirement: grade definitions |
| `calculateRemainingEssence` enforces minimum 0.01 threshold          | Requirement: minimum threshold |
| Rated augmentations scale essence correctly                          | Requirement: rating formulas   |
| All essence values rounded to exactly 2 decimal places               | Precision decision             |
| `roundEssence(0.125)` returns 0.13 (proper rounding)                 | Precision implementation       |
| `formatEssence(5.7)` returns "5.70" (display formatting)             | Precision display              |
| Essence calculations avoid floating-point accumulation errors        | Precision robustness           |

**File:** `/lib/rules/augmentations/__tests__/essence-hole.test.ts`

| Test Case                                           | Validates                           |
| --------------------------------------------------- | ----------------------------------- |
| Essence hole increases on augmentation install      | Requirement: essence hole mechanism |
| Essence hole persists after augmentation removal    | Guarantee #2: permanent magic loss  |
| Magic loss calculated correctly per edition formula | Guarantee #2                        |
| Essence hole only tracked for awakened/emerged      | Edge case                           |

**File:** `/lib/rules/augmentations/__tests__/validation.test.ts`

| Test Case                                    | Validates                      |
| -------------------------------------------- | ------------------------------ |
| Rejects installation when essence < 0        | Constraint: minimum threshold  |
| Rejects augmentation exceeding attribute max | Constraint: ruleset maximums   |
| Rejects forbidden items at creation          | Constraint: availability       |
| Identifies mutually exclusive augmentations  | Constraint: mutual exclusivity |
| Allows restricted items in active play       | Lifecycle stage handling       |

**File:** `/lib/rules/augmentations/__tests__/cyberlimb.test.ts`

| Test Case                                                         | Validates                          |
| ----------------------------------------------------------------- | ---------------------------------- |
| Calculates cyberlimb capacity correctly                           | Requirement: capacity constraints  |
| Rejects enhancement exceeding capacity                            | Requirement: capacity constraints  |
| Enhancement removal frees capacity                                | Post-creation management           |
| Cyberlimb STR customization within racial max + 3                 | Full customization decision        |
| Cyberlimb AGI customization within racial max + 3                 | Full customization decision        |
| Customization costs 1 capacity per +1 attribute                   | Customization capacity cost        |
| Rejects customization when insufficient capacity                  | Capacity vs customization conflict |
| Base attributes match character's natural values                  | Customization initialization       |
| Capacity breakdown shows enhancements vs customization separately | Capacity accounting                |

**File:** `/lib/rules/augmentations/__tests__/management.test.ts`

| Test Case                                                         | Validates                         |
| ----------------------------------------------------------------- | --------------------------------- |
| Install updates character essence correctly (2 decimal precision) | Guarantee #1 + precision decision |
| Install adds item to character arrays                             | Guarantee #4: auditable record    |
| Remove restores essence correctly                                 | Post-creation management          |
| Grade upgrade recalculates essence                                | Post-creation management          |
| Global wireless toggle enables all wireless bonuses               | Global wireless decision          |
| Global wireless toggle disables all wireless bonuses              | Global wireless decision          |
| Wireless bonus aggregation only when globally enabled             | Functional integration            |

#### Integration Tests

**File:** `/app/api/characters/[characterId]/augmentations/__tests__/route.test.ts`

| Test Case                                       | Validates              |
| ----------------------------------------------- | ---------------------- |
| POST creates augmentation with correct essence  | API correctness        |
| POST validates before installation              | Validation enforcement |
| DELETE removes augmentation and updates essence | API correctness        |
| PUT grade upgrade recalculates costs            | API correctness        |
| Unauthorized access returns 401                 | Security               |

#### E2E Tests

**File:** `/e2e/augmentations.spec.ts`

| Test Case                                     | Validates         |
| --------------------------------------------- | ----------------- |
| Complete cyberware installation flow          | Full user journey |
| Essence display updates in real-time          | UI responsiveness |
| Magic user sees magic reduction warning       | UX for awakened   |
| Cyberlimb enhancement installation            | Capacity system   |
| Character sheet shows installed augmentations | Data persistence  |

### Manual Verification Steps

1. **Essence Calculation Accuracy**
   - Install Datajack (0.1 essence) with Standard grade → verify 5.9 essence
   - Install Wired Reflexes 2 (3.0 essence) with Alpha grade → verify 3.5 essence remaining
   - Remove Datajack → verify 5.9 essence (essence hole persists for mages)

2. **Magic Impact Verification**
   - Create Mage with Magic 6
   - Install 1.5 essence of cyberware → verify Magic reduced to 5
   - Remove cyberware → verify Magic stays at 5 (essence hole)

3. **Cyberlimb Capacity**
   - Install Cyberarm (capacity 15)
   - Add Cyberarm Gyromount (capacity 8) → verify fits
   - Attempt to add another 8-capacity item → verify rejection

4. **Availability Enforcement**
   - At creation, attempt to install 14-availability item → verify rejection
   - In active play, verify same item can be installed

5. **Attribute Bonus Limits**
   - Install augmentations totaling +5 STR bonus
   - Verify system rejects (max +4 per ruleset)

## Capability Reference Matrix

| Capability Requirement          | Implementation Location                            | Test File              |
| ------------------------------- | -------------------------------------------------- | ---------------------- |
| Verifiable Essence reduction    | `essence.ts:calculateCyberwareEssence`             | `essence.test.ts`      |
| Permanent Magic/Resonance link  | `essence-hole.ts:calculateMagicLoss`               | `essence-hole.test.ts` |
| Measurable bonuses by grade     | `grades.ts:applyGradeToEssence`                    | `grades.test.ts`       |
| Auditable modification record   | `management.ts:installCyberware`                   | `management.test.ts`   |
| High-precision Essence tracking | `essence.ts` (all functions)                       | `essence.test.ts`      |
| Catalog-driven selection        | `RulesetContext.tsx:useCyberwareCatalog`           | Integration tests      |
| Rating-based scaling            | `essence.ts:calculateCyberwareEssence`             | `essence.test.ts`      |
| Cyberlimb capacity constraints  | `cyberlimb.ts`                                     | `cyberlimb.test.ts`    |
| Automatic bonus propagation     | `derived-stats.ts:applyAugmentationBonusesToStats` | Integration tests      |
| Wireless bonus tracking         | `management.ts:toggleGlobalWirelessBonus`          | `management.test.ts`   |
| Availability constraints        | `validation.ts:validateAvailabilityConstraint`     | `validation.test.ts`   |
| Mutual exclusivity enforcement  | `validation.ts:validateMutualExclusion`            | `validation.test.ts`   |

## Risk Assessment

| Risk                                          | Likelihood | Impact | Mitigation                                                                      |
| --------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------- |
| Essence floating-point rounding errors        | Low        | Medium | Consistent use of `roundEssence()` utility, comprehensive edge case tests       |
| Cyberlimb capacity + customization edge cases | Medium     | Medium | Document all edge cases, add validation for capacity vs customization conflicts |
| Magic reduction formula inconsistency         | Low        | High   | Test against official rulebook examples                                         |
| Cyberlimb attribute averaging complexity      | Medium     | Medium | Clear documentation of when averaging applies (multiple limbs)                  |
| Performance with many augmentations           | Low        | Low    | Optimize aggregation functions if needed                                        |

## Open Questions

1. Should cyberware/bioware be combined in a single step or separate steps in character creation?
2. How should grade upgrades interact with essence holes?
3. Should we support "used" grade bioware (not in core rules but in some sourcebooks)?

## Resolved Questions

| Question                      | Decision                                | Date       |
| ----------------------------- | --------------------------------------- | ---------- |
| Essence precision model       | Floating-point with 2 decimal precision | 2025-12-30 |
| Cyberlimb customization scope | Full STR/AGI per-limb in Phase 1        | 2025-12-30 |
| Wireless bonus granularity    | Global character-level toggle           | 2025-12-30 |

---

_Generated following capability specification: `/docs/capabilities/character.augmentation-systems.md`_
