/**
 * Tests for quality validation functions
 *
 * Tests prerequisite validation, incompatibility checking, karma limits,
 * and quality selection validation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { Character, Quality, MergedRuleset, QualitySelection } from '@/lib/types';
import {
  validatePrerequisites,
  checkIncompatibilities,
  canTakeQuality,
  validateQualitySelection,
  validateAllQualities,
} from '../validation';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';
import { createMockCharacter } from '@/__tests__/mocks/storage';

describe('Quality Validation', () => {
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

  describe('validatePrerequisites', () => {
    it('should allow quality with no prerequisites', () => {
      const quality: Quality = {
        id: 'test-quality',
        name: 'Test Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'A test quality',
      };

      const result = validatePrerequisites(quality, character, ruleset);
      expect(result.allowed).toBe(true);
    });

    it('should validate metatype requirements', () => {
      const quality: Quality = {
        id: 'elf-only',
        name: 'Elf Only',
        type: 'positive',
        karmaCost: 5,
        summary: 'Elf-only quality',
        prerequisites: {
          metatypes: ['Elf'],
        },
      };

      // Human character should fail
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toContain('Requires metatype: Elf');

      // Elf character should pass
      const elfCharacter = createMockCharacter({ metatype: 'Elf' });
      const result2 = validatePrerequisites(quality, elfCharacter, ruleset);
      expect(result2.allowed).toBe(true);
    });

    it('should validate excluded metatypes', () => {
      const quality: Quality = {
        id: 'no-elf',
        name: 'No Elf',
        type: 'positive',
        karmaCost: 5,
        summary: 'Not for elves',
        prerequisites: {
          metatypesExcluded: ['Elf'],
        },
      };

      // Human character should pass
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(true);

      // Elf character should fail
      const elfCharacter = createMockCharacter({ metatype: 'Elf' });
      const result2 = validatePrerequisites(quality, elfCharacter, ruleset);
      expect(result2.allowed).toBe(false);
      expect(result2.reason).toContain('Not available to Elf');
    });

    it('should validate magic requirements', () => {
      const quality: Quality = {
        id: 'magic-required',
        name: 'Magic Required',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires magic',
        prerequisites: {
          hasMagic: true,
        },
      };

      // Mundane character should fail
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toContain('Requires Magic attribute');

      // Awakened character should pass
      const awakenedCharacter = createMockCharacter({
        specialAttributes: {
          edge: 1,
          essence: 6,
          magic: 3,
        },
      });
      const result2 = validatePrerequisites(quality, awakenedCharacter, ruleset);
      expect(result2.allowed).toBe(true);
    });

    it('should validate resonance requirements', () => {
      const quality: Quality = {
        id: 'resonance-required',
        name: 'Resonance Required',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires resonance',
        prerequisites: {
          hasResonance: true,
        },
      };

      // Mundane character should fail
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toContain('Requires Resonance attribute');

      // Technomancer character should pass
      const technomancerCharacter = createMockCharacter({
        specialAttributes: {
          edge: 1,
          essence: 6,
          resonance: 3,
        },
      });
      const result2 = validatePrerequisites(quality, technomancerCharacter, ruleset);
      expect(result2.allowed).toBe(true);
    });

    it('should validate attribute requirements', () => {
      const quality: Quality = {
        id: 'high-willpower',
        name: 'High Willpower',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires high willpower',
        prerequisites: {
          attributes: {
            willpower: { min: 4 },
          },
        },
      };

      // Low willpower should fail
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toContain('Requires willpower 4+');

      // High willpower should pass
      const highWillCharacter = createMockCharacter({
        attributes: {
          willpower: 5,
        },
      });
      const result2 = validatePrerequisites(quality, highWillCharacter, ruleset);
      expect(result2.allowed).toBe(true);
    });

    it('should validate attribute maximum requirements', () => {
      const quality: Quality = {
        id: 'low-agility',
        name: 'Low Agility',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires low agility',
        prerequisites: {
          attributes: {
            agility: { max: 3 },
          },
        },
      };

      // High agility should fail
      const highAgilityCharacter = createMockCharacter({
        attributes: {
          agility: 6,
        },
      });
      const result1 = validatePrerequisites(quality, highAgilityCharacter, ruleset);
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toContain('Requires agility ≤3');

      // Low agility should pass
      const lowAgilityCharacter = createMockCharacter({
        attributes: {
          agility: 2,
        },
      });
      const result2 = validatePrerequisites(quality, lowAgilityCharacter, ruleset);
      expect(result2.allowed).toBe(true);
    });

    it('should validate skill requirements', () => {
      const quality: Quality = {
        id: 'skilled',
        name: 'Skilled',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires high skill',
        prerequisites: {
          skills: {
            firearms: { min: 4 },
          },
        },
      };

      // Low skill should fail
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toContain('Requires firearms skill 4+');

      // High skill should pass
      const skilledCharacter = createMockCharacter({
        skills: {
          firearms: 5,
        },
      });
      const result2 = validatePrerequisites(quality, skilledCharacter, ruleset);
      expect(result2.allowed).toBe(true);
    });

    it('should validate magical path requirements', () => {
      const quality: Quality = {
        id: 'mage-only',
        name: 'Mage Only',
        type: 'positive',
        karmaCost: 5,
        summary: 'Mage only',
        prerequisites: {
          magicalPaths: ['mage'],
        },
      };

      // Mundane should fail
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toContain('Requires magical path: mage');

      // Mage should pass
      const mageCharacter = createMockCharacter({
        magicalPath: 'mage',
        specialAttributes: {
          edge: 1,
          essence: 6,
          magic: 3,
        },
      });
      const result2 = validatePrerequisites(quality, mageCharacter, ruleset);
      expect(result2.allowed).toBe(true);
    });

    it('should validate excluded magical paths', () => {
      const quality: Quality = {
        id: 'no-adept',
        name: 'No Adept',
        type: 'positive',
        karmaCost: 5,
        summary: 'Not for adepts',
        prerequisites: {
          magicalPathsExcluded: ['adept'],
        },
      };

      // Mundane should pass
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(true);

      // Adept should fail
      const adeptCharacter = createMockCharacter({
        magicalPath: 'adept',
        specialAttributes: {
          edge: 1,
          essence: 6,
          magic: 3,
        },
      });
      const result2 = validatePrerequisites(quality, adeptCharacter, ruleset);
      expect(result2.allowed).toBe(false);
      expect(result2.reason).toContain('Not available to adept');
    });

    it('should validate required qualities (all)', () => {
      const quality: Quality = {
        id: 'advanced-quality',
        name: 'Advanced Quality',
        type: 'positive',
        karmaCost: 10,
        summary: 'Requires base quality',
        prerequisites: {
          requiredQualities: ['base-quality'],
        },
      };

      // Without base quality should fail
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toContain('Requires quality: base-quality');

      // With base quality should pass
      const withBaseCharacter = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'base-quality',
            source: 'creation',
          },
        ],
      });
      const result2 = validatePrerequisites(quality, withBaseCharacter, ruleset);
      expect(result2.allowed).toBe(true);
    });

    it('should validate required any qualities (at least one)', () => {
      const quality: Quality = {
        id: 'flexible-quality',
        name: 'Flexible Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires one of several qualities',
        prerequisites: {
          requiredAnyQualities: ['quality-a', 'quality-b'],
        },
      };

      // Without any should fail
      const result1 = validatePrerequisites(quality, character, ruleset);
      expect(result1.allowed).toBe(false);
      expect(result1.reason).toContain('Requires at least one of: quality-a, quality-b');

      // With one should pass
      const withOneCharacter = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'quality-a',
            source: 'creation',
          },
        ],
      });
      const result2 = validatePrerequisites(quality, withOneCharacter, ruleset);
      expect(result2.allowed).toBe(true);
    });
  });

  describe('checkIncompatibilities', () => {
    it('should allow quality with no incompatibilities', () => {
      const quality: Quality = {
        id: 'test-quality',
        name: 'Test Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'A test quality',
      };

      const result = checkIncompatibilities(quality, character);
      expect(result.allowed).toBe(true);
    });

    it('should detect incompatible qualities', () => {
      const quality: Quality = {
        id: 'quality-a',
        name: 'Quality A',
        type: 'positive',
        karmaCost: 5,
        summary: 'Incompatible with B',
        incompatibilities: ['quality-b'],
      };

      // Without incompatible quality should pass
      const result1 = checkIncompatibilities(quality, character);
      expect(result1.allowed).toBe(true);

      // With incompatible quality should fail
      const withIncompatibleCharacter = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'quality-b',
            source: 'creation',
          },
        ],
      });
      const result2 = checkIncompatibilities(quality, withIncompatibleCharacter);
      expect(result2.allowed).toBe(false);
      expect(result2.reason).toContain('Incompatible with: quality-b');
    });

    it('should check incompatibilities case-insensitively', () => {
      const quality: Quality = {
        id: 'quality-a',
        name: 'Quality A',
        type: 'positive',
        karmaCost: 5,
        summary: 'Incompatible with B',
        incompatibilities: ['Quality-B'],
      };

      const withIncompatibleCharacter = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'quality-b',
            source: 'creation',
          },
        ],
      });
      const result = checkIncompatibilities(quality, withIncompatibleCharacter);
      expect(result.allowed).toBe(false);
    });
  });

  describe('canTakeQuality', () => {
    it('should allow quality when all checks pass', () => {
      const quality: Quality = {
        id: 'test-quality',
        name: 'Test Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'A test quality',
      };

      const result = canTakeQuality(quality, character, ruleset);
      expect(result.allowed).toBe(true);
    });

    it('should fail when prerequisites not met', () => {
      const quality: Quality = {
        id: 'magic-required',
        name: 'Magic Required',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires magic',
        prerequisites: {
          hasMagic: true,
        },
      };

      const result = canTakeQuality(quality, character, ruleset);
      expect(result.allowed).toBe(false);
    });

    it('should fail when incompatibility exists', () => {
      const quality: Quality = {
        id: 'quality-a',
        name: 'Quality A',
        type: 'positive',
        karmaCost: 5,
        summary: 'Incompatible with B',
        incompatibilities: ['quality-b'],
      };

      const withIncompatibleCharacter = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'quality-b',
            source: 'creation',
          },
        ],
      });

      const result = canTakeQuality(quality, withIncompatibleCharacter, ruleset);
      expect(result.allowed).toBe(false);
    });

    it('should fail when quality limit exceeded', () => {
      const quality: Quality = {
        id: 'limited-quality',
        name: 'Limited Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Can only take once',
        limit: 1,
      };

      const withQualityCharacter = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'limited-quality',
            source: 'creation',
          },
        ],
      });

      const result = canTakeQuality(quality, withQualityCharacter, ruleset);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Already have maximum instances');
    });

    it('should allow when limit not exceeded', () => {
      const quality: Quality = {
        id: 'multi-quality',
        name: 'Multi Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Can take multiple times',
        limit: 3,
      };

      const withOneInstanceCharacter = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'multi-quality',
            source: 'creation',
          },
        ],
      });

      const result = canTakeQuality(quality, withOneInstanceCharacter, ruleset);
      expect(result.allowed).toBe(true);
    });

    it('should skip limit check when option provided', () => {
      const quality: Quality = {
        id: 'limited-quality',
        name: 'Limited Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Can only take once',
        limit: 1,
      };

      const withQualityCharacter = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'limited-quality',
            source: 'creation',
          },
        ],
      });

      const result = canTakeQuality(quality, withQualityCharacter, ruleset, {
        skipLimitCheck: true,
      });
      expect(result.allowed).toBe(true);
    });
  });

  describe('validateQualitySelection', () => {
    it('should validate selection with no requirements', () => {
      const quality: Quality = {
        id: 'simple-quality',
        name: 'Simple Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Simple quality',
      };

      const selection: QualitySelection = {
        qualityId: 'simple-quality',
        source: 'creation',
      };

      const result = validateQualitySelection(selection, quality, character);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require rating for per-rating qualities', () => {
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

      // Missing rating should fail
      const selection1: QualitySelection = {
        qualityId: 'rated-quality',
        source: 'creation',
      };

      const result1 = validateQualitySelection(selection1, quality, character);
      expect(result1.valid).toBe(false);
      expect(result1.errors).toHaveLength(1);
      expect(result1.errors[0].field).toBe('rating');

      // Valid rating should pass
      const selection2: QualitySelection = {
        qualityId: 'rated-quality',
        rating: 2,
        source: 'creation',
      };

      const result2 = validateQualitySelection(selection2, quality, character);
      expect(result2.valid).toBe(true);
    });

    it('should validate rating range', () => {
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

      // Rating too low should fail
      const selection1: QualitySelection = {
        qualityId: 'rated-quality',
        rating: 0,
        source: 'creation',
      };

      const result1 = validateQualitySelection(selection1, quality, character);
      expect(result1.valid).toBe(false);
      expect(result1.errors[0].message).toContain('rating must be 1-2');

      // Rating too high should fail
      const selection2: QualitySelection = {
        qualityId: 'rated-quality',
        rating: 3,
        source: 'creation',
      };

      const result2 = validateQualitySelection(selection2, quality, character);
      expect(result2.valid).toBe(false);

      // Valid rating should pass
      const selection3: QualitySelection = {
        qualityId: 'rated-quality',
        rating: 1,
        source: 'creation',
      };

      const result3 = validateQualitySelection(selection3, quality, character);
      expect(result3.valid).toBe(true);
    });

    it('should require specification when needed', () => {
      const quality: Quality = {
        id: 'spec-quality',
        name: 'Spec Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Requires specification',
        requiresSpecification: true,
      };

      // Missing specification should fail
      const selection1: QualitySelection = {
        qualityId: 'spec-quality',
        source: 'creation',
      };

      const result1 = validateQualitySelection(selection1, quality, character);
      expect(result1.valid).toBe(false);
      expect(result1.errors[0].field).toBe('specification');

      // With specification should pass
      const selection2: QualitySelection = {
        qualityId: 'spec-quality',
        specification: 'Test Spec',
        source: 'creation',
      };

      const result2 = validateQualitySelection(selection2, quality, character);
      expect(result2.valid).toBe(true);
    });

    it('should validate specification against options', () => {
      const quality: Quality = {
        id: 'option-quality',
        name: 'Option Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Has options',
        specificationOptions: ['option-a', 'option-b'],
      };

      // Invalid option should fail
      const selection1: QualitySelection = {
        qualityId: 'option-quality',
        specification: 'invalid-option',
        source: 'creation',
      };

      const result1 = validateQualitySelection(selection1, quality, character);
      expect(result1.valid).toBe(false);
      expect(result1.errors[0].message).toContain('must be one of: option-a, option-b');

      // Valid option should pass
      const selection2: QualitySelection = {
        qualityId: 'option-quality',
        specification: 'option-a',
        source: 'creation',
      };

      const result2 = validateQualitySelection(selection2, quality, character);
      expect(result2.valid).toBe(true);
    });
  });

  describe('validateAllQualities', () => {
    it('should validate all qualities on character', () => {
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
        karmaCost: 5,
        summary: 'Second quality',
        prerequisites: {
          hasMagic: true,
        },
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

      const result = validateAllQualities(characterWithQualities, rulesetWithQualities);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.qualityId === 'quality-2')).toBe(true);
    });

    it('should report missing quality definitions', () => {
      const characterWithUnknownQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'unknown-quality',
            source: 'creation',
          },
        ],
      });

      const result = validateAllQualities(characterWithUnknownQuality, ruleset);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('not found'))).toBe(true);
    });

    it('should return valid when all qualities are valid', () => {
      const quality: Quality = {
        id: 'valid-quality',
        name: 'Valid Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'Valid quality',
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
            qualityId: 'valid-quality',
            source: 'creation',
          },
        ],
      });

      const result = validateAllQualities(characterWithQuality, rulesetWithQuality);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

