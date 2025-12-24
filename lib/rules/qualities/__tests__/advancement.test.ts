/**
 * Tests for post-creation quality advancement
 *
 * Tests quality acquisition validation, removal validation,
 * karma cost calculations, and karma transaction logging.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { Character, Quality, MergedRuleset } from '@/lib/types';
import {
  validateQualityAcquisition,
  acquireQuality,
  validateQualityRemoval,
  removeQuality,
  calculatePostCreationCost,
  calculateBuyOffCost,
} from '../advancement';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';
import { createMockCharacter } from '@/__tests__/mocks/storage';

describe('Quality Advancement', () => {
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
    character = createMockCharacter({
      karmaCurrent: 50,
    });
  });

  describe('calculatePostCreationCost', () => {
    it('should calculate 2× cost for post-creation acquisition', () => {
      const quality: Quality = {
        id: 'test-quality',
        name: 'Test Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'A test quality',
      };

      const cost = calculatePostCreationCost(quality);
      expect(cost).toBe(10); // 5 * 2
    });

    it('should calculate 2× cost for per-rating quality', () => {
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

      expect(calculatePostCreationCost(quality, 1)).toBe(10); // 5 * 2
      expect(calculatePostCreationCost(quality, 2)).toBe(20); // 10 * 2
    });
  });

  describe('calculateBuyOffCost', () => {
    it('should calculate 2× original karma bonus for buy-off', () => {
      const quality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 5,
        summary: 'A negative quality',
      };

      const buyOffCost = calculateBuyOffCost(quality, 5);
      expect(buyOffCost).toBe(10); // 5 * 2
    });

    it('should handle negative karma values', () => {
      const quality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 5,
        summary: 'A negative quality',
      };

      const buyOffCost = calculateBuyOffCost(quality, -5);
      expect(buyOffCost).toBe(10); // abs(-5) * 2
    });

    it('should use quality definition when originalKarma not provided', () => {
      const quality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 5,
        summary: 'A negative quality',
      };

      const buyOffCost = calculateBuyOffCost(quality);
      expect(buyOffCost).toBe(10); // 5 * 2
    });
  });

  describe('validateQualityAcquisition', () => {
    it('should validate successful acquisition', () => {
      const quality: Quality = {
        id: 'test-quality',
        name: 'Test Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'A test quality',
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

      const result = validateQualityAcquisition(character, 'test-quality', rulesetWithQuality);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.cost).toBe(10); // 2× cost
    });

    it('should fail when quality not found', () => {
      const result = validateQualityAcquisition(character, 'unknown-quality', ruleset);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('not found');
    });

    it('should fail when prerequisites not met', () => {
      const quality: Quality = {
        id: 'magic-quality',
        name: 'Magic Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires magic',
        prerequisites: {
          hasMagic: true,
        },
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

      const result = validateQualityAcquisition(character, 'magic-quality', rulesetWithQuality);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail when not enough karma', () => {
      const quality: Quality = {
        id: 'expensive-quality',
        name: 'Expensive Quality',
        type: 'positive',
        karmaCost: 30,
        summary: 'Expensive quality',
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

      const poorCharacter = createMockCharacter({
        karmaCurrent: 10,
      });

      const result = validateQualityAcquisition(poorCharacter, 'expensive-quality', rulesetWithQuality);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Not enough karma'))).toBe(true);
    });

    it('should validate rating for per-rating qualities', () => {
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

      // Missing rating should fail
      const result1 = validateQualityAcquisition(character, 'rated-quality', rulesetWithQuality);
      expect(result1.valid).toBe(false);

      // Valid rating should pass
      const result2 = validateQualityAcquisition(character, 'rated-quality', rulesetWithQuality, {
        rating: 1,
      });
      expect(result2.valid).toBe(true);
    });
  });

  describe('acquireQuality', () => {
    it('should acquire quality successfully', () => {
      const quality: Quality = {
        id: 'test-quality',
        name: 'Test Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'A test quality',
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

      const result = acquireQuality(character, 'test-quality', rulesetWithQuality);
      expect(result.selection.qualityId).toBe('test-quality');
      expect(result.selection.source).toBe('advancement');
      expect(result.selection.originalKarma).toBe(10); // 2× cost
      expect(result.cost).toBe(10);
      expect(result.updatedCharacter.positiveQualities?.length).toBe(1);
    });

    it('should throw error when validation fails', () => {
      const quality: Quality = {
        id: 'magic-quality',
        name: 'Magic Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires magic',
        prerequisites: {
          hasMagic: true,
        },
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

      expect(() => {
        acquireQuality(character, 'magic-quality', rulesetWithQuality);
      }).toThrow();
    });

    it('should throw error when not enough karma', () => {
      const quality: Quality = {
        id: 'expensive-quality',
        name: 'Expensive Quality',
        type: 'positive',
        karmaCost: 30,
        summary: 'Expensive quality',
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

      const poorCharacter = createMockCharacter({
        karmaCurrent: 10,
      });

      expect(() => {
        acquireQuality(poorCharacter, 'expensive-quality', rulesetWithQuality);
      }).toThrow('Not enough karma');
    });

    it('should initialize dynamic state for dynamic qualities', () => {
      const quality: Quality = {
        id: 'addiction',
        name: 'Addiction',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Addiction quality',
        dynamicState: 'addiction',
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

      const result = acquireQuality(character, 'addiction', rulesetWithQuality, {
        variant: 'moderate',
        specification: 'Cram',
      });

      expect(result.selection.dynamicState).not.toBeNull();
      expect(result.selection.dynamicState?.type).toBe('addiction');
    });
  });

  describe('validateQualityRemoval', () => {
    it('should validate successful removal', () => {
      const quality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 5,
        summary: 'A negative quality',
      };

      const characterWithQuality = createMockCharacter({
        negativeQualities: [
          {
            qualityId: 'negative-quality',
            source: 'creation',
            originalKarma: -5,
          },
        ],
        karmaCurrent: 50,
      });

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [],
            negative: [quality],
          },
        },
      });

      const result = validateQualityRemoval(characterWithQuality, 'negative-quality', rulesetWithQuality);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.cost).toBe(10); // 2× original bonus
    });

    it('should fail when quality not found on character', () => {
      const result = validateQualityRemoval(character, 'unknown-quality', ruleset);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('not found');
    });

    it('should fail when not enough karma for buy-off', () => {
      const quality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 20,
        summary: 'A negative quality',
      };

      const characterWithQuality = createMockCharacter({
        negativeQualities: [
          {
            qualityId: 'negative-quality',
            source: 'creation',
            originalKarma: -20,
          },
        ],
        karmaCurrent: 10, // Not enough for 40 karma buy-off
      });

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [],
            negative: [quality],
          },
        },
      });

      const result = validateQualityRemoval(characterWithQuality, 'negative-quality', rulesetWithQuality);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Not enough karma'))).toBe(true);
    });
  });

  describe('removeQuality', () => {
    it('should remove quality successfully', () => {
      const quality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 5,
        summary: 'A negative quality',
      };

      const characterWithQuality = createMockCharacter({
        negativeQualities: [
          {
            qualityId: 'negative-quality',
            source: 'creation',
            originalKarma: -5,
          },
        ],
        karmaCurrent: 50,
      });

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [],
            negative: [quality],
          },
        },
      });

      const result = removeQuality(characterWithQuality, 'negative-quality', rulesetWithQuality, 'Story development');

      expect(result.updatedCharacter.negativeQualities?.length).toBe(0);
      expect(result.cost).toBe(10); // 2× original bonus
    });

    it('should throw error when validation fails', () => {
      expect(() => {
        removeQuality(character, 'unknown-quality', ruleset);
      }).toThrow();
    });

    it('should throw error when not enough karma', () => {
      const quality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 20,
        summary: 'A negative quality',
      };

      const characterWithQuality = createMockCharacter({
        negativeQualities: [
          {
            qualityId: 'negative-quality',
            source: 'creation',
            originalKarma: -20,
          },
        ],
        karmaCurrent: 10,
      });

      const rulesetWithQuality = createMockMergedRuleset({
        modules: {
          ...createMockMergedRuleset().modules,
          qualities: {
            positive: [],
            negative: [quality],
          },
        },
      });

      expect(() => {
        removeQuality(characterWithQuality, 'negative-quality', rulesetWithQuality);
      }).toThrow('Not enough karma');
    });
  });
});

