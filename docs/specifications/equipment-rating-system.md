# Equipment Rating System

This document outlines the design and implementation plan for a unified equipment rating system in Shadow Master. The goal is to standardize how equipment ratings are handled across character creation and gameplay.

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Current State Analysis](#current-state-analysis)
3. [Rating vs Capacity Distinction](#rating-vs-capacity-distinction)
4. [Proposed Architecture](#proposed-architecture)
5. [Type Definitions](#type-definitions)
6. [Rating Calculator Utilities](#rating-calculator-utilities)
7. [Data Format Standardization](#data-format-standardization)
8. [Validation Integration](#validation-integration)
9. [Character Creation Integration](#character-creation-integration)
10. [Gameplay Support](#gameplay-support)
11. [Migration Path](#migration-path)

---

## Problem Statement

Equipment ratings in Shadowrun 5E are currently handled **inconsistently across three different patterns** in the codebase, with no unified type system or validation. This creates issues for:

- **Character Creation**: Calculating costs, availability, and essence costs at different ratings
- **Gameplay**: Applying rating-based effects, validating equipment, wireless bonuses
- **Data Integrity**: No validation that ratings are within allowed ranges

---

## Current State Analysis

### Pattern A: Declarative Rating (Most Common - Preferred)

```json
{
  "id": "binoculars",
  "name": "Binoculars",
  "hasRating": true,
  "maxRating": 3,
  "costPerRating": true,
  "cost": 50
}
```

**Used by:** Audio devices, optical devices, sensors, vision enhancements, fake SINs/licenses

**Pros:**

- Single catalog item represents all rating levels
- Cost/availability calculated dynamically
- Efficient storage

**Cons:**

- Requires calculation logic
- Current implementation missing some scaling fields (e.g., `availabilityPerRating`)

### Pattern B: Fixed Rating (Single Value)

```json
{
  "id": "bug-scanner",
  "name": "Bug Scanner",
  "rating": 6,
  "cost": 400
}
```

**Used by:** Some security tools, medkits, lockpicking tools

**Pros:**

- Simple - no calculation needed
- Clear what the item's rating is

**Cons:**

- If rating should be selectable, this pattern doesn't support it
- Ambiguous whether rating is fixed or just a default

### Pattern C: Separate Catalog Items Per Rating

```json
{
  "id": "cybereyes-1",
  "name": "Cybereyes (Rating 1)",
  "essenceCost": 0.2,
  "capacity": 4
},
{
  "id": "cybereyes-2",
  "name": "Cybereyes (Rating 2)",
  "essenceCost": 0.3,
  "capacity": 8
}
```

**Used by:** Cybereyes, cyberears, dermal plating, some cyberware

**Pros:**

- Each rating level can have unique properties (non-linear scaling)
- No calculation needed at runtime

**Cons:**

- Data duplication
- Harder to maintain
- Updates require changing multiple entries

### Current Type Definitions (Issues Found)

From `/lib/types/character.ts`:

```typescript
// Too loose - just optional number with no constraints
interface GearItem {
  rating?: number; // No min/max enforcement
}

// Mixed terminology across equipment types
interface CharacterRCC {
  deviceRating: number; // Uses "deviceRating"
}

interface FocusItem {
  force: number; // Uses "force" for same concept as rating
}
```

From `/lib/types/edition.ts`:

```typescript
interface CyberwareCatalogItem {
  hasRating?: boolean;
  maxRating?: number;
  essencePerRating?: boolean;
  costPerRating?: boolean;
  capacityPerRating?: boolean;
  // Missing: minRating, availabilityPerRating
}
```

---

## Rating vs Capacity Distinction

The SR5 rules make an important semantic distinction:

| Term              | Meaning                | Affects                                           | Examples                                                  |
| ----------------- | ---------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| **Rating**        | Quality/power level    | Dice pools, effect strength, detection difficulty | Fake SINs (1-6), Vision Enhancement (1-3), Agent programs |
| **Capacity**      | Enhancement slot count | How many mods can be installed                    | Goggles (1-6 slots), Cybereyes (4-16 slots), Headphones   |
| **Device Rating** | Matrix capability      | Matrix actions, defense                           | Commlinks (1-6), Cyberdecks, RCCs                         |
| **Force**         | Magical potency        | Spell/focus power, bonding karma                  | Foci (1-6+), Spirits, Barriers                            |

Some items have **both**:

- **Cybereyes Rating 2** has capacity 8 (rating determines capacity)
- **Vision Enhancement Rating 3** uses 3 capacity slots (enhancement with rating)

### Recommendation

Keep these as semantically distinct but use a unified underlying system:

```typescript
type RatingType = "rating" | "capacity" | "deviceRating" | "force";
```

---

## Proposed Architecture

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Type Layer                               │
│  /lib/types/ratings.ts - RatingConfig, RatingScalingConfig  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Utility Layer                              │
│  /lib/rules/ratings.ts - calculateRatedValue, validateRating│
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Validation    │ │    Creation     │ │    Gameplay     │
│ validateEquip-  │ │ RatingSelector  │ │ getEffective-   │
│ mentRatings()   │ │ component       │ │ Rating()        │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Type Definitions

Create new file: `/lib/types/ratings.ts`

```typescript
/**
 * Equipment Rating System Types
 *
 * Provides unified type definitions for handling equipment ratings
 * across character creation and gameplay.
 */

// =============================================================================
// RATING CONFIGURATION (Catalog Items)
// =============================================================================

/**
 * Semantic type of rating for display and rule purposes
 */
export type RatingSemanticType =
  | "rating" // Standard equipment rating
  | "capacity" // Enhancement slot capacity
  | "deviceRating" // Matrix device rating
  | "force"; // Magical force rating

/**
 * Base configuration for any rated item in the catalog
 */
export interface RatingConfig {
  /** Whether this item has a selectable rating */
  hasRating: boolean;

  /** Semantic type of this rating (for display/rules) */
  semanticType?: RatingSemanticType;

  /** Minimum rating (defaults to 1) */
  minRating?: number;

  /** Maximum rating (required if hasRating is true) */
  maxRating: number;

  /** Default rating if not specified */
  defaultRating?: number;

  /** Whether rating must be whole numbers (default true) */
  integerOnly?: boolean;
}

/**
 * Scaling type for how values change with rating
 */
export type ScalingType =
  | "linear" // value = base × rating
  | "squared" // value = base × rating²
  | "flat" // value = base (no scaling)
  | "table" // value = lookup[rating] (for non-linear)
  | "formula"; // value = custom formula

/**
 * Configuration for how a value scales with rating
 */
export interface RatingScalingConfig {
  /** Base value before rating multiplier */
  baseValue: number;

  /** Whether value scales with rating */
  perRating: boolean;

  /** How the value scales (default: 'linear') */
  scalingType?: ScalingType;

  /** For 'table' scaling: rating -> value mapping */
  valueLookup?: Record<number, number>;

  /** For 'formula' scaling: formula string (future use) */
  formula?: string;

  /** Minimum value after scaling */
  minValue?: number;

  /** Maximum value after scaling */
  maxValue?: number;
}

/**
 * Complete rating specification for catalog items
 * Extend this interface for specific equipment types
 */
export interface CatalogItemRatingSpec {
  /** Rating configuration (if item supports ratings) */
  rating?: RatingConfig;

  /** How cost scales with rating */
  costScaling?: RatingScalingConfig;

  /** How availability scales with rating */
  availabilityScaling?: RatingScalingConfig;

  /** How essence scales with rating (cyberware/bioware) */
  essenceScaling?: RatingScalingConfig;

  /** How capacity provided scales with rating (containers) */
  capacityScaling?: RatingScalingConfig;

  /** How capacity cost scales with rating (enhancements) */
  capacityCostScaling?: RatingScalingConfig;

  /** How attribute bonuses scale with rating */
  attributeBonusScaling?: Record<string, RatingScalingConfig>;

  /** How karma cost scales with rating (foci bonding) */
  karmaScaling?: RatingScalingConfig;
}

// =============================================================================
// OWNED ITEM RATINGS (Character Items)
// =============================================================================

/**
 * Rating information for an owned/installed item
 */
export interface OwnedItemRating {
  /** Selected rating value */
  value: number;

  /** Calculated cost at this rating */
  calculatedCost: number;

  /** Calculated availability at this rating */
  calculatedAvailability: number;

  /** Calculated essence cost at this rating (if applicable) */
  calculatedEssence?: number;

  /** Calculated capacity at this rating (if applicable) */
  calculatedCapacity?: number;

  /** Calculated capacity cost at this rating (if applicable) */
  calculatedCapacityCost?: number;
}

/**
 * Result of rating calculation with all derived values
 */
export interface RatingCalculationResult {
  /** The rating value used for calculation */
  rating: number;

  /** Cost at this rating */
  cost: number;

  /** Availability at this rating */
  availability: number;

  /** Essence cost at this rating (cyberware/bioware) */
  essence?: number;

  /** Capacity provided at this rating (containers) */
  capacity?: number;

  /** Capacity cost at this rating (enhancements) */
  capacityCost?: number;

  /** Attribute bonuses at this rating */
  attributeBonuses?: Record<string, number>;

  /** Karma cost at this rating (foci bonding) */
  karmaCost?: number;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Result of rating validation
 */
export interface RatingValidationResult {
  valid: boolean;
  error?: string;
  suggestedValue?: number;
}

/**
 * Context for rating validation during character creation
 */
export interface RatingValidationContext {
  /** Maximum availability allowed (typically 12 at creation) */
  maxAvailability?: number;

  /** Maximum rating allowed for this item type */
  maxRatingOverride?: number;

  /** Whether forbidden items are allowed */
  allowForbidden?: boolean;

  /** Whether restricted items are allowed */
  allowRestricted?: boolean;
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

/**
 * Options for formatting rating for display
 */
export interface RatingDisplayOptions {
  /** Show the semantic type label (e.g., "Force 3" vs "Rating 3") */
  showLabel?: boolean;

  /** Show the range (e.g., "Rating 3 (1-6)") */
  showRange?: boolean;

  /** Show calculated cost */
  showCost?: boolean;

  /** Custom label override */
  customLabel?: string;
}
```

---

## Rating Calculator Utilities

Create new file: `/lib/rules/ratings.ts`

```typescript
/**
 * Equipment Rating Calculator Utilities
 *
 * Centralized functions for calculating rating-dependent values
 * for equipment across the application.
 */

import type {
  RatingConfig,
  RatingScalingConfig,
  CatalogItemRatingSpec,
  RatingCalculationResult,
  RatingValidationResult,
  RatingValidationContext,
  RatingDisplayOptions,
  RatingSemanticType,
} from "../types/ratings";

// =============================================================================
// CORE CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculate a scaled value based on rating
 */
export function calculateRatedValue(scaling: RatingScalingConfig, rating: number): number {
  // If not scaling with rating, return base value
  if (!scaling.perRating) {
    return scaling.baseValue;
  }

  let value: number;

  switch (scaling.scalingType) {
    case "squared":
      value = scaling.baseValue * rating * rating;
      break;

    case "flat":
      value = scaling.baseValue;
      break;

    case "table":
      if (scaling.valueLookup && scaling.valueLookup[rating] !== undefined) {
        value = scaling.valueLookup[rating];
      } else {
        // Fallback to linear if rating not in table
        value = scaling.baseValue * rating;
      }
      break;

    case "formula":
      // Future: implement formula parser
      // For now, fall through to linear
      value = scaling.baseValue * rating;
      break;

    case "linear":
    default:
      value = scaling.baseValue * rating;
      break;
  }

  // Apply min/max bounds
  if (scaling.minValue !== undefined && value < scaling.minValue) {
    value = scaling.minValue;
  }
  if (scaling.maxValue !== undefined && value > scaling.maxValue) {
    value = scaling.maxValue;
  }

  return value;
}

/**
 * Calculate all derived values for a rated item at a specific rating
 */
export function calculateRatedItemValues(
  spec: CatalogItemRatingSpec,
  rating: number
): RatingCalculationResult {
  const result: RatingCalculationResult = {
    rating,
    cost: 0,
    availability: 0,
  };

  // Calculate cost
  if (spec.costScaling) {
    result.cost = calculateRatedValue(spec.costScaling, rating);
  }

  // Calculate availability
  if (spec.availabilityScaling) {
    result.availability = calculateRatedValue(spec.availabilityScaling, rating);
  }

  // Calculate essence (cyberware/bioware)
  if (spec.essenceScaling) {
    result.essence = calculateRatedValue(spec.essenceScaling, rating);
  }

  // Calculate capacity provided (containers like cybereyes)
  if (spec.capacityScaling) {
    result.capacity = calculateRatedValue(spec.capacityScaling, rating);
  }

  // Calculate capacity cost (enhancements)
  if (spec.capacityCostScaling) {
    result.capacityCost = calculateRatedValue(spec.capacityCostScaling, rating);
  }

  // Calculate attribute bonuses
  if (spec.attributeBonusScaling) {
    result.attributeBonuses = {};
    for (const [attr, scaling] of Object.entries(spec.attributeBonusScaling)) {
      result.attributeBonuses[attr] = calculateRatedValue(scaling, rating);
    }
  }

  // Calculate karma cost (foci bonding)
  if (spec.karmaScaling) {
    result.karmaCost = calculateRatedValue(spec.karmaScaling, rating);
  }

  return result;
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate that a rating is within allowed range
 */
export function validateRating(
  rating: number,
  ratingConfig: RatingConfig,
  context?: RatingValidationContext
): RatingValidationResult {
  // Check if item supports ratings
  if (!ratingConfig.hasRating) {
    return {
      valid: false,
      error: "Item does not support ratings",
    };
  }

  const min = ratingConfig.minRating ?? 1;
  const max = context?.maxRatingOverride ?? ratingConfig.maxRating;

  // Check minimum
  if (rating < min) {
    return {
      valid: false,
      error: `Rating must be at least ${min}`,
      suggestedValue: min,
    };
  }

  // Check maximum
  if (rating > max) {
    return {
      valid: false,
      error: `Rating cannot exceed ${max}`,
      suggestedValue: max,
    };
  }

  // Check integer constraint
  if (ratingConfig.integerOnly !== false && !Number.isInteger(rating)) {
    return {
      valid: false,
      error: "Rating must be a whole number",
      suggestedValue: Math.round(rating),
    };
  }

  return { valid: true };
}

/**
 * Validate rating against availability constraints (character creation)
 */
export function validateRatingAvailability(
  spec: CatalogItemRatingSpec,
  rating: number,
  context: RatingValidationContext
): RatingValidationResult {
  if (!spec.availabilityScaling || context.maxAvailability === undefined) {
    return { valid: true };
  }

  const availability = calculateRatedValue(spec.availabilityScaling, rating);

  if (availability > context.maxAvailability) {
    // Find the maximum rating that meets availability constraint
    const maxRating = spec.rating?.maxRating ?? 6;
    let suggestedRating = rating;

    for (let r = rating - 1; r >= (spec.rating?.minRating ?? 1); r--) {
      const avail = calculateRatedValue(spec.availabilityScaling, r);
      if (avail <= context.maxAvailability) {
        suggestedRating = r;
        break;
      }
    }

    return {
      valid: false,
      error: `Rating ${rating} has availability ${availability}, which exceeds maximum ${context.maxAvailability}`,
      suggestedValue: suggestedRating,
    };
  }

  return { valid: true };
}

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

/**
 * Get the display label for a rating semantic type
 */
export function getRatingLabel(semanticType?: RatingSemanticType): string {
  switch (semanticType) {
    case "force":
      return "Force";
    case "deviceRating":
      return "Device Rating";
    case "capacity":
      return "Capacity";
    case "rating":
    default:
      return "Rating";
  }
}

/**
 * Format a rating value for display
 */
export function formatRating(
  rating: number,
  config?: RatingConfig,
  options?: RatingDisplayOptions
): string {
  const label = options?.customLabel ?? getRatingLabel(config?.semanticType);

  let result = "";

  if (options?.showLabel !== false) {
    result = `${label} ${rating}`;
  } else {
    result = String(rating);
  }

  if (options?.showRange && config) {
    const min = config.minRating ?? 1;
    const max = config.maxRating;
    result += ` (${min}-${max})`;
  }

  return result;
}

/**
 * Format rating with cost for selection UI
 */
export function formatRatingWithCost(
  rating: number,
  spec: CatalogItemRatingSpec,
  options?: { showAvailability?: boolean }
): string {
  const values = calculateRatedItemValues(spec, rating);
  const label = getRatingLabel(spec.rating?.semanticType);

  let result = `${label} ${rating}: ${values.cost.toLocaleString()}¥`;

  if (options?.showAvailability) {
    result += ` (Avail ${values.availability})`;
  }

  return result;
}

// =============================================================================
// CONVERSION HELPERS (for migration)
// =============================================================================

/**
 * Convert legacy flat rating properties to CatalogItemRatingSpec
 * Used for migrating existing data format
 */
export function convertLegacyRatingSpec(legacy: {
  hasRating?: boolean;
  maxRating?: number;
  minRating?: number;
  cost?: number;
  costPerRating?: boolean;
  availability?: number;
  availabilityPerRating?: boolean;
  essenceCost?: number;
  essencePerRating?: boolean;
  capacityCost?: number;
  capacityPerRating?: boolean;
}): CatalogItemRatingSpec {
  const spec: CatalogItemRatingSpec = {};

  // Rating config
  if (legacy.hasRating) {
    spec.rating = {
      hasRating: true,
      minRating: legacy.minRating ?? 1,
      maxRating: legacy.maxRating ?? 6,
    };
  }

  // Cost scaling
  if (legacy.cost !== undefined) {
    spec.costScaling = {
      baseValue: legacy.cost,
      perRating: legacy.costPerRating ?? false,
    };
  }

  // Availability scaling
  if (legacy.availability !== undefined) {
    spec.availabilityScaling = {
      baseValue: legacy.availability,
      perRating: legacy.availabilityPerRating ?? false,
    };
  }

  // Essence scaling
  if (legacy.essenceCost !== undefined) {
    spec.essenceScaling = {
      baseValue: legacy.essenceCost,
      perRating: legacy.essencePerRating ?? false,
    };
  }

  // Capacity cost scaling
  if (legacy.capacityCost !== undefined) {
    spec.capacityCostScaling = {
      baseValue: legacy.capacityCost,
      perRating: legacy.capacityPerRating ?? false,
    };
  }

  return spec;
}

// =============================================================================
// RANGE HELPERS
// =============================================================================

/**
 * Get array of valid rating values for an item
 */
export function getRatingRange(config: RatingConfig): number[] {
  const min = config.minRating ?? 1;
  const max = config.maxRating;
  const range: number[] = [];

  for (let r = min; r <= max; r++) {
    range.push(r);
  }

  return range;
}

/**
 * Get rating options with calculated values for UI selection
 */
export function getRatingOptions(
  spec: CatalogItemRatingSpec,
  context?: RatingValidationContext
): Array<{
  rating: number;
  values: RatingCalculationResult;
  valid: boolean;
  error?: string;
}> {
  if (!spec.rating?.hasRating) {
    return [];
  }

  const range = getRatingRange(spec.rating);

  return range.map((rating) => {
    const values = calculateRatedItemValues(spec, rating);
    const validation = validateRatingAvailability(spec, rating, context ?? {});

    return {
      rating,
      values,
      valid: validation.valid,
      error: validation.error,
    };
  });
}
```

---

## Data Format Standardization

### Recommended JSON Format

Convert existing data to this unified format:

**Before (current inconsistent format):**

```json
{
  "id": "fake-sin",
  "name": "Fake SIN",
  "hasRating": true,
  "maxRating": 6,
  "cost": 2500,
  "costPerRating": true,
  "availability": 3,
  "restricted": false,
  "forbidden": true
}
```

**After (standardized nested format):**

```json
{
  "id": "fake-sin",
  "name": "Fake SIN",
  "rating": {
    "hasRating": true,
    "minRating": 1,
    "maxRating": 6,
    "semanticType": "rating"
  },
  "costScaling": {
    "baseValue": 2500,
    "perRating": true,
    "scalingType": "linear"
  },
  "availabilityScaling": {
    "baseValue": 3,
    "perRating": true,
    "scalingType": "linear"
  },
  "forbidden": true
}
```

### Backward Compatibility

During migration, support both formats using the `convertLegacyRatingSpec()` function. The loader can detect format version and convert automatically.

### Equipment-Specific Examples

#### Cyberware with Attribute Bonuses

```json
{
  "id": "wired-reflexes",
  "name": "Wired Reflexes",
  "category": "bodyware",
  "rating": {
    "hasRating": true,
    "minRating": 1,
    "maxRating": 3
  },
  "costScaling": {
    "baseValue": 0,
    "perRating": false,
    "scalingType": "table",
    "valueLookup": { "1": 39000, "2": 149000, "3": 217000 }
  },
  "essenceScaling": {
    "baseValue": 0,
    "perRating": false,
    "scalingType": "table",
    "valueLookup": { "1": 2.0, "2": 3.0, "3": 5.0 }
  },
  "attributeBonusScaling": {
    "reaction": {
      "baseValue": 1,
      "perRating": true,
      "scalingType": "linear"
    }
  }
}
```

#### Focus with Force

```json
{
  "id": "power-focus",
  "name": "Power Focus",
  "type": "power",
  "rating": {
    "hasRating": true,
    "minRating": 1,
    "maxRating": 6,
    "semanticType": "force"
  },
  "costScaling": {
    "baseValue": 18000,
    "perRating": true,
    "scalingType": "linear"
  },
  "karmaScaling": {
    "baseValue": 6,
    "perRating": true,
    "scalingType": "linear"
  }
}
```

#### Device with Device Rating

```json
{
  "id": "erika-elite",
  "name": "Erika Elite",
  "rating": {
    "hasRating": false,
    "maxRating": 4,
    "semanticType": "deviceRating"
  },
  "costScaling": {
    "baseValue": 2500,
    "perRating": false
  },
  "fixedValues": {
    "deviceRating": 4,
    "dataProcessing": 4,
    "firewall": 4
  }
}
```

---

## Validation Integration

Add to `/lib/rules/validation.ts`:

```typescript
import {
  validateRating,
  validateRatingAvailability,
  calculateRatedItemValues,
  convertLegacyRatingSpec,
} from "./ratings";

/**
 * Validate equipment ratings on character gear
 */
export function validateEquipmentRatings(context: ValidationContext): ValidationError[] {
  const errors: ValidationError[] = [];
  const { character, ruleset, creationState } = context;

  // Determine if we're in creation (stricter availability rules)
  const isCreation = character.status === "draft";
  const maxAvailability = isCreation ? 12 : undefined;

  const validationContext: RatingValidationContext = {
    maxAvailability,
    allowForbidden: !isCreation,
    allowRestricted: true,
  };

  // Validate gear ratings
  for (const item of character.gear || []) {
    if (item.rating !== undefined) {
      const catalogItem = findGearCatalogItem(ruleset, item.catalogId || item.name);

      if (catalogItem) {
        const spec = convertLegacyRatingSpec(catalogItem);

        if (spec.rating) {
          // Validate rating is in range
          const ratingValidation = validateRating(item.rating, spec.rating, validationContext);
          if (!ratingValidation.valid) {
            errors.push({
              constraintId: "equipment-rating-range",
              field: `gear.${item.id || item.name}`,
              message: `${item.name}: ${ratingValidation.error}`,
              severity: "error",
            });
          }

          // Validate availability at creation
          if (isCreation) {
            const availValidation = validateRatingAvailability(
              spec,
              item.rating,
              validationContext
            );
            if (!availValidation.valid) {
              errors.push({
                constraintId: "equipment-rating-availability",
                field: `gear.${item.id || item.name}`,
                message: `${item.name}: ${availValidation.error}`,
                severity: "error",
              });
            }
          }
        }
      }
    }
  }

  // Validate cyberware ratings
  for (const item of character.cyberware || []) {
    if (item.rating !== undefined) {
      const catalogItem = findCyberwareCatalogItem(ruleset, item.catalogId);

      if (catalogItem) {
        const spec = convertLegacyRatingSpec(catalogItem);

        if (spec.rating) {
          const ratingValidation = validateRating(item.rating, spec.rating, validationContext);
          if (!ratingValidation.valid) {
            errors.push({
              constraintId: "cyberware-rating-range",
              field: `cyberware.${item.id || item.name}`,
              message: `${item.name}: ${ratingValidation.error}`,
              severity: "error",
            });
          }
        }
      }
    }
  }

  // Validate focus force ratings
  for (const focus of character.foci || []) {
    // Force 1-6 for starting characters
    if (isCreation && focus.force > 6) {
      errors.push({
        constraintId: "focus-force-creation",
        field: `foci.${focus.id || focus.name}`,
        message: `${focus.name}: Force cannot exceed 6 at character creation`,
        severity: "error",
      });
    }

    if (focus.force < 1) {
      errors.push({
        constraintId: "focus-force-minimum",
        field: `foci.${focus.id || focus.name}`,
        message: `${focus.name}: Force must be at least 1`,
        severity: "error",
      });
    }
  }

  return errors;
}

// Add to constraintValidators registry
constraintValidators["equipment-rating"] = (constraint, context) => {
  const errors = validateEquipmentRatings(context);
  return errors.length > 0 ? errors[0] : null;
};
```

---

## Character Creation Integration

### Rating Selector Component

Create `/app/characters/create/components/RatingSelector.tsx`:

```typescript
'use client';

import { useState, useMemo } from 'react';
import {
  getRatingOptions,
  formatRating,
  type CatalogItemRatingSpec,
  type RatingValidationContext
} from '@/lib/rules/ratings';

interface RatingSelectorProps {
  /** Item specification with rating config */
  itemSpec: CatalogItemRatingSpec;

  /** Currently selected rating */
  selectedRating: number;

  /** Callback when rating changes */
  onRatingChange: (rating: number) => void;

  /** Validation context (e.g., max availability) */
  validationContext?: RatingValidationContext;

  /** Whether to show calculated cost */
  showCost?: boolean;

  /** Whether to show availability */
  showAvailability?: boolean;

  /** Whether selector is disabled */
  disabled?: boolean;

  /** Custom label for the rating */
  label?: string;
}

export function RatingSelector({
  itemSpec,
  selectedRating,
  onRatingChange,
  validationContext,
  showCost = true,
  showAvailability = true,
  disabled = false,
  label,
}: RatingSelectorProps) {
  const options = useMemo(() =>
    getRatingOptions(itemSpec, validationContext),
    [itemSpec, validationContext]
  );

  if (!itemSpec.rating?.hasRating) {
    return null;
  }

  const ratingLabel = label ?? formatRating(0, itemSpec.rating, { showLabel: true }).split(' ')[0];

  return (
    <div className="rating-selector">
      <label className="text-sm font-medium text-gray-200">
        {ratingLabel}
      </label>

      <div className="flex gap-2 mt-1">
        {options.map(({ rating, values, valid, error }) => (
          <button
            key={rating}
            type="button"
            disabled={disabled || !valid}
            onClick={() => onRatingChange(rating)}
            className={`
              px-3 py-2 rounded border text-sm
              ${selectedRating === rating
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-200'}
              ${!valid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}
            `}
            title={error}
          >
            <div className="font-medium">{rating}</div>
            {showCost && (
              <div className="text-xs text-gray-400">
                {values.cost.toLocaleString()}¥
              </div>
            )}
            {showAvailability && (
              <div className="text-xs text-gray-400">
                Avail {values.availability}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Usage in Gear Step

```typescript
// In GearStep.tsx or similar
import { RatingSelector } from './RatingSelector';
import { convertLegacyRatingSpec } from '@/lib/rules/ratings';

function GearItemRow({ item, onUpdate }) {
  const spec = convertLegacyRatingSpec(item);

  return (
    <div className="gear-item-row">
      <span>{item.name}</span>

      {spec.rating?.hasRating && (
        <RatingSelector
          itemSpec={spec}
          selectedRating={item.selectedRating ?? spec.rating.minRating ?? 1}
          onRatingChange={(rating) => onUpdate({ ...item, selectedRating: rating })}
          validationContext={{ maxAvailability: 12 }}
        />
      )}
    </div>
  );
}
```

---

## Gameplay Support

### Effective Rating Calculator

Add to `/lib/rules/gameplay.ts`:

```typescript
/**
 * Calculate effective rating for an item during gameplay
 * Considers wireless bonuses, damage, environmental factors
 */
export function getEffectiveRating(
  item: { rating?: number; wirelessBonus?: string },
  context: {
    wirelessEnabled?: boolean;
    matrixDamage?: number;
    environmentalModifier?: number;
  }
): number {
  let rating = item.rating ?? 0;

  // Apply wireless bonus if enabled and applicable
  if (context.wirelessEnabled && item.wirelessBonus) {
    // Parse wireless bonus - typically adds to rating or provides special effect
    // This is item-specific, may need lookup table
    rating += parseWirelessBonus(item.wirelessBonus);
  }

  // Reduce rating if item has Matrix damage (optional rule)
  if (context.matrixDamage) {
    rating = Math.max(0, rating - Math.floor(context.matrixDamage / 3));
  }

  // Apply environmental modifiers
  if (context.environmentalModifier) {
    rating = Math.max(0, rating + context.environmentalModifier);
  }

  return rating;
}

/**
 * Get dice pool bonus from rated equipment
 */
export function getRatingDiceBonus(
  item: { rating?: number },
  bonusType: "perception" | "defense" | "attack" | "limit"
): number {
  const rating = item.rating ?? 0;

  // Most rated equipment adds its rating to relevant dice pools
  // Specific items may have different formulas
  return rating;
}

/**
 * Calculate test threshold based on item rating
 * Used for detection tests, hacking attempts, etc.
 */
export function getRatingThreshold(
  item: { rating?: number },
  testType: "detect" | "analyze" | "bypass"
): number {
  const rating = item.rating ?? 0;

  switch (testType) {
    case "detect":
      return rating; // Threshold equals rating
    case "analyze":
      return rating * 2; // Extended test, rating × 2 hits needed
    case "bypass":
      return rating + 2; // Rating + 2 to bypass
    default:
      return rating;
  }
}
```

---

## Migration Path

### Phase 1: Add New Types (Non-Breaking)

- Create `/lib/types/ratings.ts` with new type definitions
- Export from `/lib/types/index.ts`
- No changes to existing code

### Phase 2: Add Rating Utilities

- Create `/lib/rules/ratings.ts` with calculator functions
- Add `convertLegacyRatingSpec()` for backward compatibility
- Begin using in new code

### Phase 3: Update Catalog Type Definitions

- Extend `CyberwareCatalogItem`, `GearCatalogItem`, etc. with `CatalogItemRatingSpec`
- Keep existing properties for backward compatibility
- Add JSDoc deprecation notices to old properties

### Phase 4: Add Validation

- Add `validateEquipmentRatings()` to validation engine
- Register new constraint type
- Test with existing character data

### Phase 5: Migrate JSON Data

- Create migration script to convert existing format
- Run against `/data/editions/sr5/core-rulebook.json`
- Validate migrated data

### Phase 6: Update Character Creation UI

- Create `RatingSelector` component
- Update gear/cyberware/focus selection steps
- Add rating validation feedback

### Phase 7: Add Gameplay Support

- Create `/lib/rules/gameplay.ts`
- Add effective rating calculations
- Integrate with character sheet display

---

## Summary

| Aspect                 | Current State                     | Proposed State                                     |
| ---------------------- | --------------------------------- | -------------------------------------------------- |
| **Type Safety**        | Loose `rating?: number`           | Structured `RatingConfig` with min/max             |
| **Cost Calculation**   | Ad-hoc in multiple places         | Centralized `calculateRatedValue()`                |
| **Validation**         | None                              | `validateRating()` + validation engine integration |
| **Data Format**        | 3 inconsistent patterns           | Single unified nested format                       |
| **Terminology**        | Mixed (rating/force/deviceRating) | Standardized with `semanticType`                   |
| **Character Creation** | Manual calculations               | Reusable `RatingSelector` component                |
| **Gameplay**           | Not implemented                   | `getEffectiveRating()` helper                      |

---

## Related Documents

- [Architecture Overview](../architecture-overview.md)
- [Character Creation Framework](../character_creation_framework.md)
- [Ruleset Architecture](../ruleset_architecture_and_source_material_system.md)

## References

- SR5 Core Rulebook: Equipment chapters
- [Device Ratings Table](../data_tables/equipment/device_ratings.md)
- [Device Ratings Street Gear](../data_tables/equipment/device_ratings_street_gear.md)
