/**
 * Tests for rating utilities
 *
 * Comprehensive unit tests for the equipment rating system utilities.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateRatedValue,
  calculateRatedItemValues,
  validateRating,
  validateRatingAvailability,
  convertLegacyRatingSpec,
  getRatingLabel,
  formatRating,
  formatRatingWithCost,
  getRatingRange,
  getRatingOptions,
} from '../ratings';
import type {
  RatingConfig,
  RatingScalingConfig,
  CatalogItemRatingSpec,
  RatingValidationContext,
} from '@/lib/types/ratings';

// =============================================================================
// CORE CALCULATION FUNCTIONS
// =============================================================================

describe('calculateRatedValue', () => {
  describe('scaling types', () => {
    it('should calculate linear scaling', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 100,
        perRating: true,
        scalingType: 'linear',
      };

      expect(calculateRatedValue(scaling, 1)).toBe(100);
      expect(calculateRatedValue(scaling, 2)).toBe(200);
      expect(calculateRatedValue(scaling, 3)).toBe(300);
      expect(calculateRatedValue(scaling, 5)).toBe(500);
    });

    it('should calculate squared scaling', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 10,
        perRating: true,
        scalingType: 'squared',
      };

      expect(calculateRatedValue(scaling, 1)).toBe(10);
      expect(calculateRatedValue(scaling, 2)).toBe(40); // 10 * 2^2
      expect(calculateRatedValue(scaling, 3)).toBe(90); // 10 * 3^2
    });

    it('should calculate flat scaling (no scaling)', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 500,
        perRating: true,
        scalingType: 'flat',
      };

      expect(calculateRatedValue(scaling, 1)).toBe(500);
      expect(calculateRatedValue(scaling, 5)).toBe(500);
      expect(calculateRatedValue(scaling, 10)).toBe(500);
    });

    it('should calculate table scaling', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 100,
        perRating: true,
        scalingType: 'table',
        valueLookup: {
          1: 1000,
          2: 2500,
          3: 4500,
          4: 7000,
        },
      };

      expect(calculateRatedValue(scaling, 1)).toBe(1000);
      expect(calculateRatedValue(scaling, 2)).toBe(2500);
      expect(calculateRatedValue(scaling, 3)).toBe(4500);
      expect(calculateRatedValue(scaling, 4)).toBe(7000);
    });

    it('should fallback to linear for table scaling with missing rating', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 100,
        perRating: true,
        scalingType: 'table',
        valueLookup: {
          1: 1000,
          3: 3000,
        },
      };

      // Rating 2 not in table, should fallback to linear
      expect(calculateRatedValue(scaling, 2)).toBe(200); // 100 * 2
    });

    it('should use linear as default scaling type', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 50,
        perRating: true,
        // scalingType omitted, should default to linear
      };

      expect(calculateRatedValue(scaling, 2)).toBe(100);
      expect(calculateRatedValue(scaling, 4)).toBe(200);
    });

    it('should handle formula scaling (fallback to linear for now)', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 100,
        perRating: true,
        scalingType: 'formula',
      };

      // Currently falls through to linear
      expect(calculateRatedValue(scaling, 3)).toBe(300);
    });

    it('should return base value when perRating is false', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 2500,
        perRating: false,
        scalingType: 'linear',
      };

      expect(calculateRatedValue(scaling, 1)).toBe(2500);
      expect(calculateRatedValue(scaling, 5)).toBe(2500);
      expect(calculateRatedValue(scaling, 10)).toBe(2500);
    });
  });

  describe('min/max bounds', () => {
    it('should enforce minimum value', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 10,
        perRating: true,
        scalingType: 'linear',
        minValue: 50,
      };

      expect(calculateRatedValue(scaling, 1)).toBe(50); // Clamped to min
      expect(calculateRatedValue(scaling, 5)).toBe(50); // Clamped to min
      expect(calculateRatedValue(scaling, 10)).toBe(100); // Above min
    });

    it('should enforce maximum value', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 100,
        perRating: true,
        scalingType: 'linear',
        maxValue: 400,
      };

      expect(calculateRatedValue(scaling, 2)).toBe(200); // Below max
      expect(calculateRatedValue(scaling, 5)).toBe(400); // Clamped to max
      expect(calculateRatedValue(scaling, 10)).toBe(400); // Clamped to max
    });

    it('should enforce both min and max values', () => {
      const scaling: RatingScalingConfig = {
        baseValue: 50,
        perRating: true,
        scalingType: 'linear',
        minValue: 100,
        maxValue: 300,
      };

      expect(calculateRatedValue(scaling, 1)).toBe(100); // Clamped to min
      expect(calculateRatedValue(scaling, 5)).toBe(250); // Within range
      expect(calculateRatedValue(scaling, 10)).toBe(300); // Clamped to max
    });
  });
});

describe('calculateRatedItemValues', () => {
  it('should calculate all values for an item with multiple scaling types', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
      costScaling: {
        baseValue: 2500,
        perRating: true,
        scalingType: 'linear',
      },
      availabilityScaling: {
        baseValue: 3,
        perRating: true,
        scalingType: 'linear',
      },
      essenceScaling: {
        baseValue: 0.2,
        perRating: false,
        scalingType: 'flat',
      },
    };

    const result = calculateRatedItemValues(spec, 3);

    expect(result.rating).toBe(3);
    expect(result.cost).toBe(7500); // 2500 * 3
    expect(result.availability).toBe(9); // 3 * 3
    expect(result.essence).toBe(0.2); // Flat, not per rating
  });

  it('should calculate capacity scaling', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 4,
      },
      capacityScaling: {
        baseValue: 4,
        perRating: true,
        scalingType: 'linear',
      },
    };

    const result = calculateRatedItemValues(spec, 2);
    expect(result.capacity).toBe(8); // 4 * 2
  });

  it('should calculate capacity cost scaling', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
      capacityCostScaling: {
        baseValue: 1,
        perRating: true,
        scalingType: 'linear',
      },
    };

    const result = calculateRatedItemValues(spec, 3);
    expect(result.capacityCost).toBe(3); // 1 * 3
  });

  it('should calculate attribute bonus scaling', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 3,
      },
      attributeBonusScaling: {
        reaction: {
          baseValue: 1,
          perRating: true,
          scalingType: 'linear',
        },
      },
    };

    const result = calculateRatedItemValues(spec, 2);
    expect(result.attributeBonuses).toEqual({ reaction: 2 });
  });

  it('should calculate karma cost scaling', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
      karmaScaling: {
        baseValue: 6,
        perRating: true,
        scalingType: 'linear',
      },
    };

    const result = calculateRatedItemValues(spec, 4);
    expect(result.karmaCost).toBe(24); // 6 * 4
  });

  it('should return zero cost and availability when scaling not specified', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
    };

    const result = calculateRatedItemValues(spec, 3);
    expect(result.cost).toBe(0);
    expect(result.availability).toBe(0);
  });
});

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

describe('validateRating', () => {
  const baseConfig: RatingConfig = {
    hasRating: true,
    maxRating: 6,
  };

  it('should validate rating within range', () => {
    const result = validateRating(3, baseConfig);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject rating below minimum', () => {
    const config: RatingConfig = {
      hasRating: true,
      minRating: 2,
      maxRating: 6,
    };

    const result = validateRating(1, config);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 2');
    expect(result.suggestedValue).toBe(2);
  });

  it('should reject rating above maximum', () => {
    const result = validateRating(7, baseConfig);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('cannot exceed 6');
    expect(result.suggestedValue).toBe(6);
  });

  it('should use context maxRatingOverride', () => {
    const context: RatingValidationContext = {
      maxRatingOverride: 4,
    };

    const result = validateRating(5, baseConfig, context);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('cannot exceed 4');
    expect(result.suggestedValue).toBe(4);
  });

  it('should default minimum to 1', () => {
    const result = validateRating(0, baseConfig);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 1');
    expect(result.suggestedValue).toBe(1);
  });

  it('should validate integer constraint', () => {
    const result = validateRating(3.5, baseConfig);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('whole number');
    expect(result.suggestedValue).toBe(4);
  });

  it('should allow fractional ratings when integerOnly is false', () => {
    const config: RatingConfig = {
      hasRating: true,
      maxRating: 6,
      integerOnly: false,
    };

    const result = validateRating(3.5, config);
    expect(result.valid).toBe(true);
  });

  it('should reject item that does not support ratings', () => {
    const config: RatingConfig = {
      hasRating: false,
      maxRating: 0,
    };

    const result = validateRating(1, config);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('does not support ratings');
  });
});

describe('validateRatingAvailability', () => {
  it('should validate rating within availability limit', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
      availabilityScaling: {
        baseValue: 2,
        perRating: true,
        scalingType: 'linear',
      },
    };

    const context: RatingValidationContext = {
      maxAvailability: 12,
    };

    const result = validateRatingAvailability(spec, 5, context); // 2 * 5 = 10
    expect(result.valid).toBe(true);
  });

  it('should reject rating that exceeds availability', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
      availabilityScaling: {
        baseValue: 3,
        perRating: true,
        scalingType: 'linear',
      },
    };

    const context: RatingValidationContext = {
      maxAvailability: 12,
    };

    const result = validateRatingAvailability(spec, 5, context); // 3 * 5 = 15
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum');
    expect(result.suggestedValue).toBe(4); // 3 * 4 = 12
  });

  it('should return valid when maxAvailability not specified', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
      availabilityScaling: {
        baseValue: 10,
        perRating: true,
      },
    };

    const result = validateRatingAvailability(spec, 5, {});
    expect(result.valid).toBe(true);
  });

  it('should return valid when availabilityScaling not specified', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
    };

    const context: RatingValidationContext = {
      maxAvailability: 12,
    };

    const result = validateRatingAvailability(spec, 5, context);
    expect(result.valid).toBe(true);
  });
});

// =============================================================================
// CONVERSION HELPERS
// =============================================================================

describe('convertLegacyRatingSpec', () => {
  it('should convert legacy format with all properties', () => {
    const legacy = {
      hasRating: true,
      maxRating: 6,
      minRating: 1,
      cost: 2500,
      costPerRating: true,
      availability: 3,
      availabilityPerRating: true,
      essenceCost: 0.2,
      essencePerRating: false,
      capacityCost: 1,
      capacityPerRating: true,
    };

    const spec = convertLegacyRatingSpec(legacy);

    expect(spec.rating).toEqual({
      hasRating: true,
      minRating: 1,
      maxRating: 6,
    });
    expect(spec.costScaling).toEqual({
      baseValue: 2500,
      perRating: true,
    });
    expect(spec.availabilityScaling).toEqual({
      baseValue: 3,
      perRating: true,
    });
    expect(spec.essenceScaling).toEqual({
      baseValue: 0.2,
      perRating: false,
    });
    expect(spec.capacityCostScaling).toEqual({
      baseValue: 1,
      perRating: true,
    });
  });

  it('should convert with missing optional fields', () => {
    const legacy = {
      hasRating: true,
      maxRating: 6,
      cost: 100,
      costPerRating: true,
    };

    const spec = convertLegacyRatingSpec(legacy);

    expect(spec.rating).toEqual({
      hasRating: true,
      minRating: 1, // Default
      maxRating: 6,
    });
    expect(spec.costScaling).toEqual({
      baseValue: 100,
      perRating: true,
    });
    expect(spec.availabilityScaling).toBeUndefined();
  });

  it('should default minRating to 1', () => {
    const legacy = {
      hasRating: true,
      maxRating: 6,
    };

    const spec = convertLegacyRatingSpec(legacy);
    expect(spec.rating?.minRating).toBe(1);
  });

  it('should default maxRating to 6 when not provided', () => {
    const legacy = {
      hasRating: true,
    };

    const spec = convertLegacyRatingSpec(legacy);
    expect(spec.rating?.maxRating).toBe(6);
  });

  it('should handle item without rating', () => {
    const legacy = {
      cost: 500,
    };

    const spec = convertLegacyRatingSpec(legacy);
    expect(spec.rating).toBeUndefined();
    expect(spec.costScaling).toEqual({
      baseValue: 500,
      perRating: false,
    });
  });

  it('should default costPerRating to false', () => {
    const legacy = {
      cost: 1000,
    };

    const spec = convertLegacyRatingSpec(legacy);
    expect(spec.costScaling?.perRating).toBe(false);
  });
});

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

describe('getRatingLabel', () => {
  it('should return "Rating" for default semantic type', () => {
    expect(getRatingLabel()).toBe('Rating');
    expect(getRatingLabel('rating')).toBe('Rating');
  });

  it('should return "Force" for force semantic type', () => {
    expect(getRatingLabel('force')).toBe('Force');
  });

  it('should return "Device Rating" for deviceRating semantic type', () => {
    expect(getRatingLabel('deviceRating')).toBe('Device Rating');
  });

  it('should return "Capacity" for capacity semantic type', () => {
    expect(getRatingLabel('capacity')).toBe('Capacity');
  });
});

describe('formatRating', () => {
  const config: RatingConfig = {
    hasRating: true,
    minRating: 1,
    maxRating: 6,
    semanticType: 'rating',
  };

  it('should format rating with label', () => {
    expect(formatRating(3, config)).toBe('Rating 3');
  });

  it('should format without label when showLabel is false', () => {
    expect(formatRating(3, config, { showLabel: false })).toBe('3');
  });

  it('should show range when requested', () => {
    expect(formatRating(3, config, { showRange: true })).toBe('Rating 3 (1-6)');
  });

  it('should use custom label', () => {
    expect(formatRating(3, config, { customLabel: 'Level' })).toBe('Level 3');
  });

  it('should handle missing config', () => {
    expect(formatRating(3)).toBe('Rating 3');
  });
});

describe('formatRatingWithCost', () => {
  it('should format rating with cost', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
      costScaling: {
        baseValue: 2500,
        perRating: true,
      },
      availabilityScaling: {
        baseValue: 3,
        perRating: true,
      },
    };

    const result = formatRatingWithCost(3, spec);
    expect(result).toContain('Rating 3');
    expect(result).toContain('7,500¥');
    expect(result).not.toContain('Avail');
  });

  it('should include availability when requested', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        maxRating: 6,
      },
      costScaling: {
        baseValue: 2500,
        perRating: true,
      },
      availabilityScaling: {
        baseValue: 3,
        perRating: true,
      },
    };

    const result = formatRatingWithCost(3, spec, { showAvailability: true });
    expect(result).toContain('Avail 9');
  });
});

// =============================================================================
// RANGE HELPERS
// =============================================================================

describe('getRatingRange', () => {
  it('should return array of rating values', () => {
    const config: RatingConfig = {
      hasRating: true,
      minRating: 1,
      maxRating: 6,
    };

    expect(getRatingRange(config)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should use default minRating of 1', () => {
    const config: RatingConfig = {
      hasRating: true,
      maxRating: 4,
    };

    expect(getRatingRange(config)).toEqual([1, 2, 3, 4]);
  });

  it('should handle custom minRating', () => {
    const config: RatingConfig = {
      hasRating: true,
      minRating: 2,
      maxRating: 5,
    };

    expect(getRatingRange(config)).toEqual([2, 3, 4, 5]);
  });

  it('should handle single rating value', () => {
    const config: RatingConfig = {
      hasRating: true,
      minRating: 3,
      maxRating: 3,
    };

    expect(getRatingRange(config)).toEqual([3]);
  });
});

describe('getRatingOptions', () => {
  it('should return options with calculated values', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        minRating: 1,
        maxRating: 3,
      },
      costScaling: {
        baseValue: 1000,
        perRating: true,
      },
      availabilityScaling: {
        baseValue: 2,
        perRating: true,
      },
    };

    const options = getRatingOptions(spec);

    expect(options).toHaveLength(3);
    expect(options[0]).toEqual({
      rating: 1,
      values: expect.objectContaining({
        rating: 1,
        cost: 1000,
        availability: 2,
      }),
      valid: true,
    });
    expect(options[2]).toEqual({
      rating: 3,
      values: expect.objectContaining({
        rating: 3,
        cost: 3000,
        availability: 6,
      }),
      valid: true,
    });
  });

  it('should mark options as invalid when availability exceeded', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: true,
        minRating: 1,
        maxRating: 6,
      },
      availabilityScaling: {
        baseValue: 3,
        perRating: true,
      },
    };

    const context: RatingValidationContext = {
      maxAvailability: 12,
    };

    const options = getRatingOptions(spec, context);

    // Rating 4: 3 * 4 = 12 (valid)
    expect(options[3].valid).toBe(true);
    // Rating 5: 3 * 5 = 15 (invalid)
    expect(options[4].valid).toBe(false);
    expect(options[4].error).toBeDefined();
  });

  it('should return empty array for item without rating', () => {
    const spec: CatalogItemRatingSpec = {};

    const options = getRatingOptions(spec);
    expect(options).toEqual([]);
  });

  it('should return empty array when hasRating is false', () => {
    const spec: CatalogItemRatingSpec = {
      rating: {
        hasRating: false,
        maxRating: 0,
      },
    };

    const options = getRatingOptions(spec);
    expect(options).toEqual([]);
  });
});

