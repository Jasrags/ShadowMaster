/**
 * Tests for advancement validation logic
 *
 * Tests validation functions for karma availability, maximum ratings,
 * prerequisites, downtime limits, and character state checks.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Character, MergedRuleset } from '@/lib/types';
import {
  validateKarmaAvailability,
  getAttributeMaximum,
  validateAttributeAdvancement,
  getSkillMaximum,
  validateSkillAdvancement,
  validateSpecializationAdvancement,
  validateCharacterNotDraft,
  validateAdvancement,
} from '../validation';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';
import { createMockCharacter } from '@/__tests__/mocks/storage';

// Mock the downtime validation function
vi.mock('../downtime', () => ({
  validateDowntimeLimits: vi.fn(() => {
    // Simple mock - return valid for most cases
    return { valid: true };
  }),
}));

describe('Advancement Validation', () => {
  let ruleset: MergedRuleset;
  let character: Character;

  beforeEach(() => {
    ruleset = createMockMergedRuleset({
      modules: {
        ...createMockMergedRuleset().modules,
        metatypes: {
          metatypes: [
            {
              id: 'human',
              name: 'Human',
              attributes: {
                body: { min: 1, max: 6 },
                agility: { min: 1, max: 6 },
                reaction: { min: 1, max: 6 },
                strength: { min: 1, max: 6 },
                willpower: { min: 1, max: 6 },
                logic: { min: 1, max: 6 },
                intuition: { min: 1, max: 6 },
                charisma: { min: 1, max: 6 },
              },
            },
            {
              id: 'elf',
              name: 'Elf',
              attributes: {
                body: { min: 1, max: 6 },
                agility: { min: 1, max: 7 },
                reaction: { min: 1, max: 6 },
                strength: { min: 1, max: 6 },
                willpower: { min: 1, max: 6 },
                logic: { min: 1, max: 6 },
                intuition: { min: 1, max: 6 },
                charisma: { min: 1, max: 8 },
              },
            },
          ],
        },
      },
    });
    character = createMockCharacter({
      metatype: 'Human',
      status: 'active',
      karmaCurrent: 50,
      attributes: {
        body: 3,
        agility: 4,
      },
      skills: {
        firearms: 3,
        pistols: 2,
      },
    });
  });

  describe('validateKarmaAvailability', () => {
    it('should validate sufficient karma', () => {
      const result = validateKarmaAvailability(character, 30);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject insufficient karma', () => {
      const result = validateKarmaAvailability(character, 60);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Not enough karma');
      expect(result.error).toContain('Need 60');
      expect(result.error).toContain('have 50');
    });

    it('should validate exact karma match', () => {
      const result = validateKarmaAvailability(character, 50);
      expect(result.valid).toBe(true);
    });
  });

  describe('getAttributeMaximum', () => {
    it('should return metatype maximum for attribute', () => {
      expect(getAttributeMaximum(character, 'body', ruleset)).toBe(6);
      expect(getAttributeMaximum(character, 'agility', ruleset)).toBe(6);
    });

    it('should return different maximum for different metatypes', () => {
      const elfCharacter = createMockCharacter({
        metatype: 'Elf',
      });
      expect(getAttributeMaximum(elfCharacter, 'agility', ruleset)).toBe(7);
      expect(getAttributeMaximum(elfCharacter, 'charisma', ruleset)).toBe(8);
    });

    it('should default to 6 if metatype not found', () => {
      const unknownCharacter = createMockCharacter({
        metatype: 'Unknown',
      });
      expect(getAttributeMaximum(unknownCharacter, 'body', ruleset)).toBe(6);
    });
  });

  describe('validateAttributeAdvancement', () => {
    it('should validate successful attribute advancement', () => {
      const result = validateAttributeAdvancement(
        character,
        'body',
        4,
        ruleset
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.cost).toBe(20); // 4 * 5
    });

    it('should reject rating not higher than current', () => {
      const result = validateAttributeAdvancement(
        character,
        'body',
        3,
        ruleset
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('must be higher than current'),
          field: 'rating',
        })
      );
    });

    it('should reject rating below 1', () => {
      // Rating 0 will cause cost calculation to throw, so we catch that
      expect(() => {
        validateAttributeAdvancement(character, 'body', 0, ruleset);
      }).toThrow('Attribute rating must be at least 1');
    });

    it('should reject rating exceeding metatype maximum', () => {
      const result = validateAttributeAdvancement(
        character,
        'body',
        7,
        ruleset
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('exceeds maximum'),
          field: 'rating',
        })
      );
    });

    it('should reject insufficient karma', () => {
      const poorCharacter = createMockCharacter({
        ...character,
        karmaCurrent: 5,
      });
      const result = validateAttributeAdvancement(
        poorCharacter,
        'body',
        4,
        ruleset
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('Not enough karma'),
          field: 'karma',
        })
      );
    });

    it('should calculate correct cost', () => {
      const result = validateAttributeAdvancement(
        character,
        'body',
        5,
        ruleset
      );
      expect(result.cost).toBe(25); // 5 * 5
    });
  });

  describe('getSkillMaximum', () => {
    it('should return 12 for skills without Aptitude', () => {
      expect(getSkillMaximum(character, 'firearms', ruleset)).toBe(12);
    });

    it('should return 13 for skills with Aptitude quality', () => {
      const characterWithAptitude = createMockCharacter({
        ...character,
        positiveQualities: [
          {
            qualityId: 'aptitude',
            specification: 'firearms',
            source: 'creation',
            active: true,
          },
        ],
      });
      expect(getSkillMaximum(characterWithAptitude, 'firearms', ruleset)).toBe(13);
    });

    it('should not apply Aptitude if specification does not match', () => {
      const characterWithAptitude = createMockCharacter({
        ...character,
        positiveQualities: [
          {
            qualityId: 'aptitude',
            specification: 'pistols',
            source: 'creation',
            active: true,
          },
        ],
      });
      expect(getSkillMaximum(characterWithAptitude, 'firearms', ruleset)).toBe(12);
    });
  });

  describe('validateSkillAdvancement', () => {
    it('should validate successful skill advancement', () => {
      const result = validateSkillAdvancement(
        character,
        'firearms',
        4,
        ruleset
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.cost).toBe(8); // 4 * 2
    });

    it('should reject rating not higher than current', () => {
      const result = validateSkillAdvancement(
        character,
        'firearms',
        3,
        ruleset
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('must be higher than current'),
          field: 'rating',
        })
      );
    });

    it('should reject rating exceeding maximum', () => {
      const highSkillCharacter = createMockCharacter({
        ...character,
        skills: {
          firearms: 12,
        },
      });
      const result = validateSkillAdvancement(
        highSkillCharacter,
        'firearms',
        13,
        ruleset
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('exceeds maximum'),
          field: 'rating',
        })
      );
    });

    it('should reject insufficient karma', () => {
      const poorCharacter = createMockCharacter({
        ...character,
        karmaCurrent: 1,
      });
      const result = validateSkillAdvancement(
        poorCharacter,
        'firearms',
        4,
        ruleset
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('Not enough karma'),
          field: 'karma',
        })
      );
    });

    it('should calculate correct cost', () => {
      const result = validateSkillAdvancement(
        character,
        'firearms',
        5,
        ruleset
      );
      expect(result.cost).toBe(10); // 5 * 2
    });
  });

  describe('validateSpecializationAdvancement', () => {
    it('should validate successful specialization learning', () => {
      const highSkillCharacter = createMockCharacter({
        ...character,
        skills: {
          firearms: 4,
        },
        karmaCurrent: 10,
      });
      const result = validateSpecializationAdvancement(
        highSkillCharacter,
        'firearms',
        ruleset
      );
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.cost).toBe(7);
    });

    it('should reject if skill rating is below 4', () => {
      const result = validateSpecializationAdvancement(
        character,
        'firearms',
        ruleset
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('must be at least 4'),
          field: 'skillRating',
        })
      );
    });

    it('should reject insufficient karma', () => {
      const highSkillCharacter = createMockCharacter({
        ...character,
        skills: {
          firearms: 4,
        },
        karmaCurrent: 5,
      });
      const result = validateSpecializationAdvancement(
        highSkillCharacter,
        'firearms',
        ruleset
      );
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('Not enough karma'),
          field: 'karma',
        })
      );
    });
  });

  describe('validateCharacterNotDraft', () => {
    it('should validate active character', () => {
      const result = validateCharacterNotDraft(character);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject draft character', () => {
      const draftCharacter = createMockCharacter({
        ...character,
        status: 'draft',
      });
      const result = validateCharacterNotDraft(draftCharacter);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Cannot advance during character creation');
    });
  });

  describe('validateAdvancement', () => {
    it('should validate successful advancement', () => {
      const result = validateAdvancement(character, 'attribute', 20);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.cost).toBe(20);
    });

    it('should reject draft character', () => {
      const draftCharacter = createMockCharacter({
        ...character,
        status: 'draft',
      });
      const result = validateAdvancement(draftCharacter, 'attribute', 20);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('Cannot advance during character creation'),
          field: 'character',
        })
      );
    });

    it('should reject insufficient karma', () => {
      const poorCharacter = createMockCharacter({
        ...character,
        karmaCurrent: 10,
      });
      const result = validateAdvancement(poorCharacter, 'attribute', 20);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('Not enough karma'),
          field: 'karma',
        })
      );
    });

    it('should combine multiple validation errors', () => {
      const draftPoorCharacter = createMockCharacter({
        ...character,
        status: 'draft',
        karmaCurrent: 10,
      });
      const result = validateAdvancement(draftPoorCharacter, 'attribute', 20);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

