# Implementation Plan: Unified Ratings Tables Migration

## Goal Description

Migrate all rated items in the character creation system to a unified ratings table structure, eliminating the current hybrid approach of formulas, level arrays, and duplicated entries.

**Current State:** The codebase has three different patterns for handling rated items:
1. **Gear with `ratingSpec`** - Linear formula-based (36 items)
2. **Qualities with `levels[]`** - Explicit level arrays (14 items)
3. **Augmentations with `(Rating X)` names** - Duplicated entries (99 entries representing 25 unique items)

**Target State:** Single unified `ratings` object structure across all rated items:
- Consistent data model for all rated items
- Single code path in UI components
- Data matches source books exactly (explicit values, not computed)
- Simplified validation and selection logic

---

## Architectural Decisions (Proposed)

1. **Data Structure Strategy**
   - **Decision:** Use explicit `ratings` object with per-rating values
   - **Rationale:** Source books print tables, not formulas; explicit values are authoritative

2. **Backward Compatibility**
   - **Decision:** Migrate data in-place, no dual-system support period
   - **Rationale:** Clean break reduces complexity; migration script handles conversion

3. **Qualities Handling**
   - **Decision:** Migrate `levels[]` to `ratings` structure
   - **Rationale:** Consistency across all item types outweighs minor data shape difference

4. **Non-Rated Items**
   - **Decision:** Items without ratings remain unchanged (no `ratings` field)
   - **Rationale:** Only add structure where rating selection applies

---

## Data Structure Specification

### Unified Rating Structure

```typescript
interface RatingValue {
  cost: number;
  availability: number;
  availabilitySuffix?: "R" | "F";  // Restricted/Forbidden

  // Augmentation-specific
  essenceCost?: number;
  capacity?: number;

  // Effect modifiers (attribute bonuses, initiative dice, etc.)
  effects?: {
    attributeBonuses?: Record<string, number>;
    initiativeDice?: number;
    limitBonus?: number;
    [key: string]: unknown;
  };

  // Adept power specific
  powerPointCost?: number;

  // Quality specific
  karmaCost?: number;
}

interface RatedItem {
  id: string;
  name: string;  // Base name without "(Rating X)" suffix
  // ... other common fields ...

  // Rating configuration
  hasRating: true;
  minRating: number;
  maxRating: number;
  ratings: {
    [rating: number]: RatingValue;
  };
}

// Non-rated items simply omit hasRating and ratings fields
interface NonRatedItem {
  id: string;
  name: string;
  // ... no hasRating or ratings fields ...
}
```

### Example: Cybereyes (Current vs. New)

**Current (4 separate entries):**
```json
[
  { "id": "cybereyes-1", "name": "Cybereyes (Rating 1)", "essenceCost": 0.2, "cost": 4000, "availability": 3, "capacity": 4 },
  { "id": "cybereyes-2", "name": "Cybereyes (Rating 2)", "essenceCost": 0.3, "cost": 6000, "availability": 6, "capacity": 8 },
  { "id": "cybereyes-3", "name": "Cybereyes (Rating 3)", "essenceCost": 0.4, "cost": 10000, "availability": 9, "capacity": 12 },
  { "id": "cybereyes-4", "name": "Cybereyes (Rating 4)", "essenceCost": 0.5, "cost": 14000, "availability": 12, "capacity": 16 }
]
```

**New (single entry with ratings table):**
```json
{
  "id": "cybereyes",
  "name": "Cybereyes",
  "category": "eyeware",
  "hasRating": true,
  "minRating": 1,
  "maxRating": 4,
  "ratings": {
    "1": { "essenceCost": 0.2, "cost": 4000, "availability": 3, "capacity": 4 },
    "2": { "essenceCost": 0.3, "cost": 6000, "availability": 6, "capacity": 8 },
    "3": { "essenceCost": 0.4, "cost": 10000, "availability": 9, "capacity": 12 },
    "4": { "essenceCost": 0.5, "cost": 14000, "availability": 12, "capacity": 16 }
  },
  "description": "Replacement cybernetic eyes with capacity for upgrades.",
  "wirelessBonus": "When wirelessly enabled, gives +[Rating] limit to Perception tests.",
  "page": 453
}
```

### Example: Area Jammer (Current Linear vs. New)

**Current (formula-based):**
```json
{
  "id": "area-jammer",
  "name": "Area Jammer",
  "cost": 200,
  "availability": 3,
  "hasRating": true,
  "maxRating": 6,
  "costPerRating": true,
  "ratingSpec": {
    "rating": { "hasRating": true, "minRating": 1, "maxRating": 6 },
    "costScaling": { "baseValue": 200, "perRating": true },
    "availabilityScaling": { "baseValue": 3, "perRating": true }
  }
}
```

**New (explicit values):**
```json
{
  "id": "area-jammer",
  "name": "Area Jammer",
  "category": "electronics",
  "hasRating": true,
  "minRating": 1,
  "maxRating": 6,
  "ratings": {
    "1": { "cost": 200, "availability": 1 },
    "2": { "cost": 400, "availability": 2 },
    "3": { "cost": 600, "availability": 3 },
    "4": { "cost": 800, "availability": 4 },
    "5": { "cost": 1000, "availability": 5 },
    "6": { "cost": 1200, "availability": 6 }
  },
  "description": "Jams wireless signals in an area.",
  "legality": "forbidden"
}
```

---

## Proposed Changes

### Phase 1: Type Definitions

#### 1.1 Create Unified Rating Types
**File:** `/lib/types/ratings.ts` (NEW)

```typescript
export interface RatingValue {
  cost: number;
  availability: number;
  availabilitySuffix?: "R" | "F";
  essenceCost?: number;
  capacity?: number;
  capacityCost?: number;
  karmaCost?: number;
  powerPointCost?: number;
  effects?: {
    attributeBonuses?: Record<string, number>;
    initiativeDice?: number;
    limitBonus?: number;
    armorBonus?: number;
    damageResist?: number;
    [key: string]: unknown;
  };
}

export interface RatingConfig {
  hasRating: true;
  minRating: number;
  maxRating: number;
  ratings: Record<number, RatingValue>;
}

// Type guard
export function hasRatings(item: unknown): item is RatingConfig {
  return typeof item === "object" && item !== null && "ratings" in item;
}

// Utility to get rating value
export function getRatingValue(item: RatingConfig, rating: number): RatingValue | undefined {
  return item.ratings[rating];
}
```

#### 1.2 Update Augmentation Types
**File:** `/lib/types/augmentation.ts`

Remove:
- `costPerRating`, `ratingSpec` fields from gear
- `(Rating X)` naming convention expectation

Add:
- Import and extend `RatingConfig` for rated augmentations
- Union type for rated vs non-rated augmentations

#### 1.3 Update Gear Types
**File:** `/lib/types/gear.ts`

Remove:
- `ratingSpec`, `costPerRating`, `costScaling`, `availabilityScaling` interfaces

Add:
- Import `RatingConfig` for rated gear items

#### 1.4 Update Quality Types
**File:** `/lib/types/quality.ts`

Remove:
- `levels[]` array structure

Add:
- `ratings` structure for leveled qualities

#### 1.5 Update Adept Power Types
**File:** `/lib/types/adeptPower.ts`

Remove:
- `costType: "perLevel"`, `maxLevel` pattern

Add:
- `ratings` structure for leveled powers

---

### Phase 2: Migration Script

#### 2.1 Create Data Migration Script
**File:** `/scripts/migrate-to-unified-ratings.ts` (NEW)

Purpose: Transform existing data to new structure

```typescript
// Migration functions:
function migrateAugmentationCatalog(catalog: OldAugmentation[]): NewAugmentation[];
function migrateGearWithRatingSpec(gear: OldGear[]): NewGear[];
function migrateQualitiesWithLevels(qualities: OldQuality[]): NewQuality[];
function migrateAdeptPowersWithLevels(powers: OldAdeptPower[]): NewAdeptPower[];

// Main migration
async function migrateEditionData(editionCode: string): Promise<void>;
```

Key transformations:
1. **Augmentations:** Group by base name, extract rating from `(Rating X)`, build `ratings` object
2. **Gear:** Compute explicit values from `ratingSpec` formulas
3. **Qualities:** Convert `levels[]` array to `ratings` object
4. **Adept Powers:** Convert `maxLevel` + `cost` to `ratings` object

#### 2.2 Create Migration Validation Script
**File:** `/scripts/validate-ratings-migration.ts` (NEW)

Purpose: Verify migrated data matches original computed values

```typescript
// Validation functions:
function validateAugmentationMigration(original: OldAugmentation[], migrated: NewAugmentation[]): ValidationResult;
function validateGearMigration(original: OldGear[], migrated: NewGear[]): ValidationResult;
function validateTotalItemCounts(original: RulesetData, migrated: RulesetData): ValidationResult;
```

---

### Phase 3: Data Migration Execution

#### 3.1 Migrate SR5 Core Rulebook
**File:** `/data/editions/sr5/core-rulebook.json`

Changes:
- Cyberware catalog: 104 → ~77 items (37 rating entries consolidated to 10)
- Bioware catalog: 70 → ~23 items (62 rating entries consolidated to 15)
- Gear: Update 36 items from `ratingSpec` to `ratings`
- Qualities: Update 14 items from `levels[]` to `ratings`
- Adept Powers: Update 18 items from `maxLevel` to `ratings`

#### 3.2 Update Grunt Templates
**Files:** `/data/editions/sr5/grunt-templates/*.json`

Update any character templates that reference rated items:
- Change `"name": "Cybereyes (Rating 4)"` references
- Add explicit `rating` field to item references

---

### Phase 4: Ruleset System Updates

#### 4.1 Update Ruleset Loader
**File:** `/lib/rules/loader.ts`

Changes:
- Remove formula computation for `ratingSpec`
- Simplify item loading to direct object mapping
- Add validation for `ratings` structure

#### 4.2 Update Ruleset Merge Logic
**File:** `/lib/rules/merge.ts`

Changes:
- Handle `ratings` object merging (sourcebook overrides specific ratings)
- Remove `ratingSpec` merge handling

#### 4.3 Create Rating Utility Functions
**File:** `/lib/rules/ratings.ts` (NEW)

```typescript
export function getItemCostAtRating(item: RatedItem, rating: number): number;
export function getItemEssenceAtRating(item: RatedItem, rating: number): number;
export function getItemAvailabilityAtRating(item: RatedItem, rating: number): { value: number; suffix?: string };
export function getAvailableRatings(item: RatedItem): number[];
export function isRatingValid(item: RatedItem, rating: number): boolean;
```

---

### Phase 5: UI Component Updates

#### 5.1 Create Rating Selector Component
**File:** `/components/creation/RatingSelector.tsx` (NEW)

```typescript
interface RatingSelectorProps {
  item: RatedItem;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
  showCostPreview?: boolean;
  disabled?: boolean;
}
```

Features:
- Dropdown or stepper for rating selection
- Display cost/essence/availability for selected rating
- Validate against min/max rating

#### 5.2 Update Augmentation Selection Components
**Files:**
- `/app/characters/create/components/steps/AugmentationsStep.tsx`
- `/components/creation/AugmentationCard.tsx`

Changes:
- Replace item list with base items + rating selector
- Update selection state to store `{ itemId, rating }`
- Calculate totals using rating utility functions

#### 5.3 Update Gear Selection Components
**Files:**
- `/app/characters/create/components/steps/GearStep.tsx`
- `/components/creation/GearCard.tsx`

Changes:
- Add rating selector for `hasRating` items
- Remove formula computation display
- Use `ratings[selectedRating]` for display values

#### 5.4 Update Quality Selection Components
**Files:**
- `/app/characters/create/components/steps/QualitiesStep.tsx`
- `/components/creation/QualityCard.tsx`

Changes:
- Replace level dropdown with rating selector
- Update karma calculation to use `ratings[selectedRating].karmaCost`

#### 5.5 Update Adept Power Selection Components
**Files:**
- `/app/characters/create/components/steps/AdeptPowersStep.tsx`
- `/components/creation/AdeptPowerCard.tsx`

Changes:
- Add rating selector for powers with `hasRating`
- Calculate power point cost from `ratings[selectedRating].powerPointCost`

---

### Phase 6: Character Data Model Updates

#### 6.1 Update Character Augmentation Storage
**File:** `/lib/types/character.ts`

Change selected augmentation format:
```typescript
// Old
selectedAugmentations: string[];  // ["cybereyes-3", "wired-reflexes-2"]

// New
selectedAugmentations: Array<{
  itemId: string;
  rating: number;
  grade?: string;  // standard, alpha, beta, delta
}>;
```

#### 6.2 Update Character Gear Storage
**File:** `/lib/types/character.ts`

Change selected gear format for rated items:
```typescript
// Old (implied from name or separate field)
selectedGear: string[];

// New
selectedGear: Array<{
  itemId: string;
  rating?: number;  // Only for hasRating items
  quantity?: number;
}>;
```

#### 6.3 Update Character Sheet Calculations
**File:** `/lib/character/calculations.ts`

Update functions:
- `calculateTotalEssenceLoss()` - use rating lookup
- `calculateTotalGearCost()` - use rating lookup
- `calculateTotalKarmaCost()` - use rating lookup for qualities

---

### Phase 7: Validation and Testing

#### 7.1 Unit Tests for Rating Utilities
**File:** `/__tests__/lib/rules/ratings.test.ts` (NEW)

| Test Case | Description |
|-----------|-------------|
| `getItemCostAtRating` returns correct value | Verify lookup works |
| `getItemCostAtRating` throws for invalid rating | Error handling |
| `isRatingValid` returns true for valid ratings | Boundary check |
| `isRatingValid` returns false for out-of-range | Boundary check |
| `getAvailableRatings` returns correct array | List generation |

#### 7.2 Migration Validation Tests
**File:** `/__tests__/scripts/migration-validation.test.ts` (NEW)

| Test Case | Description |
|-----------|-------------|
| Migrated augmentation count matches unique items | Data integrity |
| Migrated gear values match computed formulas | Formula accuracy |
| All original item IDs are accessible | No data loss |
| Rating values match source book tables | Accuracy check |

#### 7.3 Integration Tests
**File:** `/__tests__/integration/rating-selection.test.ts` (NEW)

| Test Case | Description |
|-----------|-------------|
| Select augmentation with rating updates essence correctly | End-to-end |
| Change rating updates cost display | UI reactivity |
| Character save includes rating in augmentation data | Persistence |
| Character load restores correct rating selection | Data recovery |

---

## Verification Plan

### Automated Verification

1. **Run migration script in dry-run mode**
   ```bash
   pnpm run migrate:ratings --dry-run --edition sr5
   ```

2. **Run validation script**
   ```bash
   pnpm run validate:ratings --edition sr5
   ```

3. **Run full test suite**
   ```bash
   pnpm test
   ```

### Manual Verification Steps

1. **Data Integrity**
   - [ ] Verify Cybereyes Rating 3 costs 10,000 nuyen (spot check)
   - [ ] Verify Wired Reflexes Rating 2 costs 149,000 nuyen and 3 Essence
   - [ ] Verify total item counts: ~398 items (reduced from ~473 with duplicates)

2. **UI Functionality**
   - [ ] Create new character, select Cybereyes, verify rating dropdown appears
   - [ ] Change rating, verify cost/essence updates in real-time
   - [ ] Complete character creation with rated augmentation
   - [ ] View character sheet, verify augmentation shows correct rating

3. **Character Data**
   - [ ] Save character with Rating 3 Cybereyes
   - [ ] Reload character, verify Rating 3 is preserved
   - [ ] Export character JSON, verify data structure

---

## Dependency Ordering

```
Phase 1 (Types)
    ↓
Phase 2 (Migration Script)
    ↓
Phase 3 (Data Migration) ←── Run validation
    ↓
Phase 4 (Ruleset System)
    ↓
Phase 5 (UI Components)
    ↓
Phase 6 (Character Model)
    ↓
Phase 7 (Testing)
```

**Critical Path:** Types → Migration Script → Data Migration → Ruleset Updates

UI and Character Model updates can proceed in parallel after Phase 4.

---

## File Summary

### New Files

| File | Purpose |
|------|---------|
| `/lib/types/ratings.ts` | Unified rating type definitions |
| `/lib/rules/ratings.ts` | Rating utility functions |
| `/scripts/migrate-to-unified-ratings.ts` | Data migration script |
| `/scripts/validate-ratings-migration.ts` | Migration validation script |
| `/components/creation/RatingSelector.tsx` | Reusable rating selection UI |
| `/__tests__/lib/rules/ratings.test.ts` | Rating utility tests |
| `/__tests__/scripts/migration-validation.test.ts` | Migration tests |
| `/__tests__/integration/rating-selection.test.ts` | Integration tests |

### Modified Files

| File | Changes |
|------|---------|
| `/lib/types/augmentation.ts` | Remove ratingSpec, add RatingConfig |
| `/lib/types/gear.ts` | Remove ratingSpec, add RatingConfig |
| `/lib/types/quality.ts` | Remove levels[], add ratings |
| `/lib/types/adeptPower.ts` | Remove maxLevel pattern, add ratings |
| `/lib/types/character.ts` | Update selected item format to include rating |
| `/lib/rules/loader.ts` | Remove formula computation |
| `/lib/rules/merge.ts` | Update merge logic for ratings |
| `/data/editions/sr5/core-rulebook.json` | Migrate all rated items |
| `/app/characters/create/components/steps/AugmentationsStep.tsx` | Add rating selection |
| `/app/characters/create/components/steps/GearStep.tsx` | Add rating selection |
| `/app/characters/create/components/steps/QualitiesStep.tsx` | Update level selection |
| `/components/creation/AugmentationCard.tsx` | Display rating selector |
| `/components/creation/GearCard.tsx` | Display rating selector |

### Deleted Files (Post-Migration Cleanup)

| File | Reason |
|------|--------|
| N/A | No files deleted; old types removed inline |

---

## Risk Mitigation

### Risk: Data Loss During Migration
**Mitigation:**
- Backup `core-rulebook.json` before migration
- Validation script compares item counts and spot-checks values
- Dry-run mode for migration script

### Risk: Breaking Existing Characters
**Mitigation:**
- Character data migration function to update saved characters
- Version field in character JSON to detect old format
- Graceful fallback for legacy data during transition

### Risk: Sourcebook Compatibility
**Mitigation:**
- Document new data format for future sourcebook additions
- Migration script handles sourcebook files as well as core

---

## Success Criteria

1. **Data Accuracy:** All migrated values match original computed/explicit values
2. **Item Count Reduction:** ~75 fewer duplicate entries in core-rulebook.json
3. **Single Code Path:** No branching logic for formula vs. table lookup in UI
4. **Test Coverage:** All rating utility functions have unit tests
5. **UI Functionality:** Rating selection works for all item types in character creation
