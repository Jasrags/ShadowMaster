/**
 * Tests for quality karma accounting functions
 *
 * Tests karma cost calculations, karma totals, post-creation costs,
 * and karma limit validation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { Character, Quality, MergedRuleset } from '@/lib/types';
import {
  calculateQualityCost,
  calculatePositiveQualityKarma,
  calculateNegativeQualityKarma,
  getAvailableKarma,
  validateKarmaLimits,
} from '../karma';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';
import { createMockCharacter } from '@/__tests__/mocks/storage';

describe('Quality Karma Accounting', () => {
  let ruleset: MergedRuleset;
  let character: Character;

  beforeEach(() => {
    ruleset = createMockMergedRuleset({
      modules: {
        ...createMockMergedRuleset().modules,
        qualities: {
          positive: [],
          negative: [],
        },
      },
    });
    character = createMockCharacter();
  });

  describe('calculateQualityCost', () => {
    it('should calculate base cost for positive quality', () => {
      const quality: Quality = {
        id: 'test-quality',
        name: 'Test Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'A test quality',
      };

      const cost = calculateQualityCost(quality);
      expect(cost).toBe(5);
    });

    it('should calculate base cost for negative quality', () => {
      const quality: Quality = {
        id: 'test-quality',
        name: 'Test Quality',
        type: 'negative',
        karmaBonus: 5,
        summary: 'A test quality',
      };

      const cost = calculateQualityCost(quality);
      expect(cost).toBe(5);
    });

    it('should calculate cost for per-rating quality with levels', () => {
      const quality: Quality = {
        id: 'rated-quality',
        name: 'Rated Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Per-rating quality',
        levels: [
          { level: 1, name: 'Rating 1', karma: 5 },
          { level: 2, name: 'Rating 2', karma: 10 },
          { level: 3, name: 'Rating 3', karma: 15 },
        ],
        maxRating: 3,
      };

      expect(calculateQualityCost(quality, 1)).toBe(5);
      expect(calculateQualityCost(quality, 2)).toBe(10);
      expect(calculateQualityCost(quality, 3)).toBe(15);
    });

    it('should use first level when rating not specified for levels', () => {
      const quality: Quality = {
        id: 'rated-quality',
        name: 'Rated Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Per-rating quality',
        levels: [
          { level: 1, name: 'Rating 1', karma: 5 },
          { level: 2, name: 'Rating 2', karma: 10 },
        ],
        maxRating: 2,
      };

      const cost = calculateQualityCost(quality);
      expect(cost).toBe(5);
    });

    it('should calculate cost for per-rating quality without explicit levels', () => {
      const quality: Quality = {
        id: 'rated-quality',
        name: 'Rated Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Per-rating quality',
        maxRating: 3,
      };

      expect(calculateQualityCost(quality, 1)).toBe(5);
      expect(calculateQualityCost(quality, 2)).toBe(10);
      expect(calculateQualityCost(quality, 3)).toBe(15);
    });

    it('should double cost for post-creation acquisition', () => {
      const quality: Quality = {
        id: 'test-quality',
        name: 'Test Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'A test quality',
      };

      const creationCost = calculateQualityCost(quality, undefined, false);
      const postCreationCost = calculateQualityCost(quality, undefined, true);

      expect(creationCost).toBe(5);
      expect(postCreationCost).toBe(10);
    });

    it('should double cost for post-creation per-rating quality', () => {
      const quality: Quality = {
        id: 'rated-quality',
        name: 'Rated Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Per-rating quality',
        levels: [
          { level: 1, name: 'Rating 1', karma: 5 },
          { level: 2, name: 'Rating 2', karma: 10 },
        ],
        maxRating: 2,
      };

      expect(calculateQualityCost(quality, 1, false)).toBe(5);
      expect(calculateQualityCost(quality, 1, true)).toBe(10);
      expect(calculateQualityCost(quality, 2, false)).toBe(10);
      expect(calculateQualityCost(quality, 2, true)).toBe(20);
    });
  });

  describe('calculatePositiveQualityKarma', () => {
    it('should return 0 for character with no positive qualities', () => {
      const total = calculatePositiveQualityKarma(character, ruleset);
      expect(total).toBe(0);
    });

    it('should calculate total from quality definitions', () => {
      const quality1: Quality = {
        id: 'quality-1',
        name: 'Quality 1',
        type: 'positive',
        karmaCost: 5,
        summary: 'First quality',
      };

      const quality2: Quality = {
        id: 'quality-2',
        name: 'Quality 2',
        type: 'positive',
        karmaCost: 10,
        summary: 'Second quality',
      };

      const rulesetWithQualities = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality1, quality2],
            negative: [],
          },
        },
      });

      const characterWithQualities = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'quality-1',
            source: 'creation',
          },
          {
            qualityId: 'quality-2',
            source: 'creation',
          },
        ],
      });

      const total = calculatePositiveQualityKarma(characterWithQualities, rulesetWithQualities);
      expect(total).toBe(15);
    });

    it('should use originalKarma as fallback when ruleset not provided', () => {
      const characterWithQualities = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'quality-1',
            source: 'creation',
            originalKarma: 5,
          },
          {
            qualityId: 'quality-2',
            source: 'creation',
            originalKarma: 10,
          },
        ],
      });

      const total = calculatePositiveQualityKarma(characterWithQualities);
      expect(total).toBe(15);
    });

    it('should calculate cost for per-rating qualities', () => {
      const quality: Quality = {
        id: 'rated-quality',
        name: 'Rated Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Per-rating quality',
        levels: [
          { level: 1, name: 'Rating 1', karma: 5 },
          { level: 2, name: 'Rating 2', karma: 10 },
        ],
        maxRating: 2,
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'rated-quality',
            rating: 2,
            source: 'creation',
          },
        ],
      });

      const total = calculatePositiveQualityKarma(characterWithQuality, rulesetWithQuality);
      expect(total).toBe(10);
    });

    it('should handle post-creation costs', () => {
      const quality: Quality = {
        id: 'quality-1',
        name: 'Quality 1',
        type: 'positive',
        karmaCost: 5,
        summary: 'A quality',
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'quality-1',
            source: 'advancement',
          },
        ],
      });

      const creationTotal = calculatePositiveQualityKarma(
        characterWithQuality,
        rulesetWithQuality,
        false
      );
      const postCreationTotal = calculatePositiveQualityKarma(
        characterWithQuality,
        rulesetWithQuality,
        true
      );

      expect(creationTotal).toBe(5);
      expect(postCreationTotal).toBe(10);
    });
  });

  describe('calculateNegativeQualityKarma', () => {
    it('should return 0 for character with no negative qualities', () => {
      const total = calculateNegativeQualityKarma(character, ruleset);
      expect(total).toBe(0);
    });

    it('should calculate total from quality definitions', () => {
      const quality1: Quality = {
        id: 'quality-1',
        name: 'Quality 1',
        type: 'negative',
        karmaBonus: 5,
        summary: 'First quality',
      };

      const quality2: Quality = {
        id: 'quality-2',
        name: 'Quality 2',
        type: 'negative',
        karmaBonus: 10,
        summary: 'Second quality',
      };

      const rulesetWithQualities = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [],
            negative: [quality1, quality2],
          },
        },
      });

      const characterWithQualities = createMockCharacter({
        negativeQualities: [
          {
            qualityId: 'quality-1',
            source: 'creation',
          },
          {
            qualityId: 'quality-2',
            source: 'creation',
          },
        ],
      });

      const total = calculateNegativeQualityKarma(characterWithQualities, rulesetWithQualities);
      expect(total).toBe(15);
    });

    it('should use originalKarma as fallback when ruleset not provided', () => {
      const characterWithQualities = createMockCharacter({
        negativeQualities: [
          {
            qualityId: 'quality-1',
            source: 'creation',
            originalKarma: -5,
          },
          {
            qualityId: 'quality-2',
            source: 'creation',
            originalKarma: -10,
          },
        ],
      });

      const total = calculateNegativeQualityKarma(characterWithQualities);
      expect(total).toBe(15); // Absolute value
    });

    it('should handle negative karma values correctly', () => {
      const quality: Quality = {
        id: 'quality-1',
        name: 'Quality 1',
        type: 'negative',
        karmaBonus: 5,
        summary: 'A quality',
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [],
            negative: [quality],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        negativeQualities: [
          {
            qualityId: 'quality-1',
            source: 'creation',
          },
        ],
      });

      const total = calculateNegativeQualityKarma(characterWithQuality, rulesetWithQuality);
      expect(total).toBe(5);
    });
  });

  describe('getAvailableKarma', () => {
    it('should calculate available karma correctly', () => {
      const quality1: Quality = {
        id: 'positive-quality',
        name: 'Positive Quality',
        type: 'positive',
        karmaCost: 10,
        summary: 'Positive',
      };

      const quality2: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Negative',
      };

      const rulesetWithQualities = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality1],
            negative: [quality2],
          },
        },
      });

      const characterWithQualities = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'positive-quality',
            source: 'creation',
          },
        ],
        negativeQualities: [
          {
            qualityId: 'negative-quality',
            source: 'creation',
          },
        ],
      });

      const available = getAvailableKarma(characterWithQualities, 25, rulesetWithQualities);
      // Starting: 25, negative gained: 5, positive spent: 10 = 25 + 5 - 10 = 20
      expect(available).toBe(20);
    });

    it('should handle character with no qualities', () => {
      const available = getAvailableKarma(character, 25, ruleset);
      expect(available).toBe(25);
    });
  });

  describe('validateKarmaLimits', () => {
    it('should pass when within limits', () => {
      const quality: Quality = {
        id: 'quality-1',
        name: 'Quality 1',
        type: 'positive',
        karmaCost: 10,
        summary: 'A quality',
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'quality-1',
            source: 'creation',
          },
        ],
      });

      const result = validateKarmaLimits(characterWithQuality, rulesetWithQuality);
      expect(result.valid).toBe(true);
      expect(result.positiveExceeded).toBe(false);
      expect(result.negativeExceeded).toBe(false);
    });

    it('should fail when positive karma limit exceeded', () => {
      const quality: Quality = {
        id: 'quality-1',
        name: 'Quality 1',
        type: 'positive',
        karmaCost: 30,
        summary: 'A quality',
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [quality],
            negative: [],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'quality-1',
            source: 'creation',
          },
        ],
      });

      const result = validateKarmaLimits(characterWithQuality, rulesetWithQuality);
      expect(result.valid).toBe(false);
      expect(result.positiveExceeded).toBe(true);
      expect(result.negativeExceeded).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('exceed 25 Karma limit');
    });

    it('should fail when negative karma limit exceeded', () => {
      const quality: Quality = {
        id: 'quality-1',
        name: 'Quality 1',
        type: 'negative',
        karmaBonus: 30,
        summary: 'A quality',
      };

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [],
            negative: [quality],
          },
        },
      });

      const characterWithQuality = createMockCharacter({
        negativeQualities: [
          {
            qualityId: 'quality-1',
            source: 'creation',
          },
        ],
      });

      const result = validateKarmaLimits(characterWithQuality, rulesetWithQuality);
      expect(result.valid).toBe(false);
      expect(result.positiveExceeded).toBe(false);
      expect(result.negativeExceeded).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('exceed 25 Karma bonus limit');
    });

    it('should report both limits when both exceeded', () => {
      const positiveQuality: Quality = {
        id: 'positive-quality',
        name: 'Positive Quality',
        type: 'positive',
        karmaCost: 30,
        summary: 'Positive',
      };

      const negativeQuality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 30,
        summary: 'Negative',
      };

      const rulesetWithQualities = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [positiveQuality],
            negative: [negativeQuality],
          },
        },
      });

      const characterWithQualities = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'positive-quality',
            source: 'creation',
          },
        ],
        negativeQualities: [
          {
            qualityId: 'negative-quality',
            source: 'creation',
          },
        ],
      });

      const result = validateKarmaLimits(characterWithQualities, rulesetWithQualities);
      expect(result.valid).toBe(false);
      expect(result.positiveExceeded).toBe(true);
      expect(result.negativeExceeded).toBe(true);
      expect(result.errors.length).toBe(2);
    });

    it('should return correct totals', () => {
      const positiveQuality: Quality = {
        id: 'positive-quality',
        name: 'Positive Quality',
        type: 'positive',
        karmaCost: 15,
        summary: 'Positive',
      };

      const negativeQuality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 10,
        summary: 'Negative',
      };

      const rulesetWithQualities = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [positiveQuality],
            negative: [negativeQuality],
          },
        },
      });

      const characterWithQualities = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'positive-quality',
            source: 'creation',
          },
        ],
        negativeQualities: [
          {
            qualityId: 'negative-quality',
            source: 'creation',
          },
        ],
      });

      const result = validateKarmaLimits(characterWithQualities, rulesetWithQualities);
      expect(result.positiveTotal).toBe(15);
      expect(result.negativeTotal).toBe(10);
    });
  });
});

