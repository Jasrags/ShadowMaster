/**
 * Tests for quality utility functions
 *
 * Tests getQualityDefinition, characterHasQuality, countQualityInstances,
 * and other utility functions.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { Character, Quality, MergedRuleset, QualitySelection } from '@/lib/types';
import {
  getQualityDefinition,
  getAllQualitiesWithDefinitions,
  findQualitySelection,
  characterHasQuality,
  countQualityInstances,
  getAllQualityIds,
} from '../utils';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';
import { createMockCharacter } from '@/__tests__/mocks/storage';

describe('Quality Utility Functions', () => {
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

  describe('getQualityDefinition', () => {
    it('should return quality definition from ruleset', () => {
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

      const result = getQualityDefinition(rulesetWithQuality, 'test-quality');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('test-quality');
      expect(result?.name).toBe('Test Quality');
    });

    it('should return null for quality not in ruleset', () => {
      const result = getQualityDefinition(ruleset, 'unknown-quality');
      expect(result).toBeNull();
    });

    it('should find quality in negative qualities', () => {
      const quality: Quality = {
        id: 'negative-quality',
        name: 'Negative Quality',
        type: 'negative',
        karmaBonus: 5,
        summary: 'A negative quality',
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

      const result = getQualityDefinition(rulesetWithQuality, 'negative-quality');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('negative-quality');
    });
  });

  describe('characterHasQuality', () => {
    it('should return true when character has quality', () => {
      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'test-quality',
            source: 'creation',
          },
        ],
      });

      expect(characterHasQuality(characterWithQuality, 'test-quality')).toBe(true);
    });

    it('should return false when character does not have quality', () => {
      expect(characterHasQuality(character, 'test-quality')).toBe(false);
    });

    it('should check both positive and negative qualities', () => {
      const characterWithBoth = createMockCharacter({
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

      expect(characterHasQuality(characterWithBoth, 'positive-quality')).toBe(true);
      expect(characterHasQuality(characterWithBoth, 'negative-quality')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'test-quality',
            source: 'creation',
          },
        ],
      });

      expect(characterHasQuality(characterWithQuality, 'TEST-QUALITY')).toBe(true);
      expect(characterHasQuality(characterWithQuality, 'Test-Quality')).toBe(true);
    });
  });

  describe('findQualitySelection', () => {
    it('should find quality selection on character', () => {
      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'test-quality',
            source: 'creation',
            rating: 2,
          },
        ],
      });

      const result = findQualitySelection(characterWithQuality, 'test-quality');
      expect(result).not.toBeNull();
      expect(result?.qualityId).toBe('test-quality');
      expect(result?.rating).toBe(2);
    });

    it('should return null when quality not found', () => {
      const result = findQualitySelection(character, 'test-quality');
      expect(result).toBeNull();
    });

    it('should find quality in negative qualities', () => {
      const characterWithQuality = createMockCharacter({
        negativeQualities: [
          {
            qualityId: 'negative-quality',
            source: 'creation',
          },
        ],
      });

      const result = findQualitySelection(characterWithQuality, 'negative-quality');
      expect(result).not.toBeNull();
      expect(result?.qualityId).toBe('negative-quality');
    });

    it('should be case-insensitive', () => {
      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'test-quality',
            source: 'creation',
          },
        ],
      });

      const result = findQualitySelection(characterWithQuality, 'TEST-QUALITY');
      expect(result).not.toBeNull();
    });
  });

  describe('countQualityInstances', () => {
    it('should return 0 when quality not on character', () => {
      const count = countQualityInstances(character, 'test-quality');
      expect(count).toBe(0);
    });

    it('should return 1 when quality taken once', () => {
      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'test-quality',
            source: 'creation',
          },
        ],
      });

      const count = countQualityInstances(characterWithQuality, 'test-quality');
      expect(count).toBe(1);
    });

    it('should count multiple instances of same quality', () => {
      const characterWithMultiple = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'multi-quality',
            source: 'creation',
          },
          {
            qualityId: 'multi-quality',
            source: 'advancement',
          },
        ],
      });

      const count = countQualityInstances(characterWithMultiple, 'multi-quality');
      expect(count).toBe(2);
    });

    it('should be case-insensitive', () => {
      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'test-quality',
            source: 'creation',
          },
        ],
      });

      const count = countQualityInstances(characterWithQuality, 'TEST-QUALITY');
      expect(count).toBe(1);
    });
  });

  describe('getAllQualityIds', () => {
    it('should return empty array for character with no qualities', () => {
      const ids = getAllQualityIds(character);
      expect(ids).toEqual([]);
    });

    it('should return all quality IDs from character', () => {
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
        negativeQualities: [
          {
            qualityId: 'quality-3',
            source: 'creation',
          },
        ],
      });

      const ids = getAllQualityIds(characterWithQualities);
      expect(ids).toHaveLength(3);
      expect(ids).toContain('quality-1');
      expect(ids).toContain('quality-2');
      expect(ids).toContain('quality-3');
    });

    it('should handle legacy id field', () => {
      const characterWithLegacy = createMockCharacter({
        positiveQualities: [
          {
            id: 'legacy-quality', // Legacy field
            source: 'creation',
          } as QualitySelection & { id: string },
        ],
      });

      const ids = getAllQualityIds(characterWithLegacy);
      expect(ids).toContain('legacy-quality');
    });

    it('should filter out undefined/null IDs', () => {
      const characterWithInvalid = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'valid-quality',
            source: 'creation',
          },
          {
            source: 'creation',
          } as unknown as QualitySelection,
        ],
      });

      const ids = getAllQualityIds(characterWithInvalid);
      expect(ids).toEqual(['valid-quality']);
    });
  });

  describe('getAllQualitiesWithDefinitions', () => {
    it('should return selections with definitions', () => {
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

      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'test-quality',
            source: 'creation',
          },
        ],
      });

      const result = getAllQualitiesWithDefinitions(characterWithQuality, rulesetWithQuality);
      expect(result).toHaveLength(1);
      expect(result[0].selection.qualityId).toBe('test-quality');
      expect(result[0].definition).not.toBeNull();
      expect(result[0].definition?.id).toBe('test-quality');
    });

    it('should return null definition when quality not found', () => {
      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'unknown-quality',
            source: 'creation',
          },
        ],
      });

      const result = getAllQualitiesWithDefinitions(characterWithQuality, ruleset);
      expect(result).toHaveLength(1);
      expect(result[0].selection.qualityId).toBe('unknown-quality');
      expect(result[0].definition).toBeNull();
    });

    it('should handle both positive and negative qualities', () => {
      const positiveQuality: Quality = {
        id: 'positive-quality',
        name: 'Positive Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Positive',
      };

      const negativeQuality: Quality = {
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

      const result = getAllQualitiesWithDefinitions(characterWithQualities, rulesetWithQualities);
      expect(result).toHaveLength(2);
    });
  });
});

