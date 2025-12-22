/**
 * Tests for specialization advancement
 *
 * Tests the advanceSpecialization function including validation,
 * karma spending, advancement record creation, and training period creation.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Character, MergedRuleset } from '@/lib/types';
import { advanceSpecialization } from '../specializations';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';
import { createMockCharacter } from '@/__tests__/mocks/storage';

// Mock uuid to get predictable IDs
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

describe('Specialization Advancement', () => {
  let ruleset: MergedRuleset;
  let character: Character;

  beforeEach(() => {
    ruleset = createMockMergedRuleset({
      modules: {
        ...createMockMergedRuleset().modules,
        skills: {
          pistols: {
            id: 'pistols',
            name: 'Pistols',
            linkedAttribute: 'agility',
            group: 'combat',
            canDefault: true,
          },
        },
      },
    });
    character = createMockCharacter({
      status: 'active',
      karmaCurrent: 50,
      skills: {
        pistols: 4, // Minimum rating for specializations
      },
    });
  });

  describe('advanceSpecialization', () => {
    it('should successfully learn a specialization', () => {
      const result = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset);

      // Check advancement record
      expect(result.advancementRecord).toBeDefined();
      expect(result.advancementRecord.type).toBe('specialization');
      expect(result.advancementRecord.targetId).toBe('pistols');
      expect(result.advancementRecord.targetName).toContain('Pistols');
      expect(result.advancementRecord.targetName).toContain('Semi-Automatics');
      expect(result.advancementRecord.previousValue).toBe(4);
      expect(result.advancementRecord.newValue).toBe(4); // Skill rating doesn't change
      expect(result.advancementRecord.karmaCost).toBe(7);
      expect(result.advancementRecord.trainingRequired).toBe(true);
      expect(result.advancementRecord.trainingStatus).toBe('pending');
      expect(result.advancementRecord.notes).toContain('Semi-Automatics');

      // Check training period
      expect(result.trainingPeriod).toBeDefined();
      expect(result.trainingPeriod?.type).toBe('specialization');
      expect(result.trainingPeriod?.targetId).toBe('pistols');
      expect(result.trainingPeriod?.requiredTime).toBe(30); // 1 month = 30 days
      expect(result.trainingPeriod?.status).toBe('pending');

      // Check character updates
      expect(result.updatedCharacter.karmaCurrent).toBe(50 - 7);
      expect(result.updatedCharacter.advancementHistory).toHaveLength(1);
      expect(result.updatedCharacter.activeTraining).toHaveLength(1);
    });

    it('should not update character specialization until training completes', () => {
      const initialSpecializations = character.skillSpecializations?.['pistols'];
      const result = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset);
      
      // Specialization should not be added yet (training not completed)
      expect(result.updatedCharacter.skillSpecializations?.['pistols']).toBeUndefined();
      expect(result.updatedCharacter.skillSpecializations?.['pistols']).toEqual(initialSpecializations);
    });

    it('should spend karma immediately', () => {
      const initialKarma = character.karmaCurrent;
      const result = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset);
      
      expect(result.updatedCharacter.karmaCurrent).toBe(initialKarma - 7);
    });

    it('should create advancement record with correct structure', () => {
      const result = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset);
      
      expect(result.advancementRecord.id).toBeDefined();
      expect(result.advancementRecord.karmaSpentAt).toBeDefined();
      expect(result.advancementRecord.createdAt).toBeDefined();
      expect(result.advancementRecord.gmApproved).toBe(false);
      expect(result.advancementRecord.notes).toBe('Specialization: Semi-Automatics');
    });

    it('should handle options (downtimePeriodId, campaignSessionId, gmApproved, notes)', () => {
      const result = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset, {
        downtimePeriodId: 'downtime-123',
        campaignSessionId: 'session-123',
        gmApproved: true,
        notes: 'Custom note',
      });

      expect(result.advancementRecord.downtimePeriodId).toBe('downtime-123');
      expect(result.advancementRecord.campaignSessionId).toBe('session-123');
      expect(result.advancementRecord.gmApproved).toBe(true);
      expect(result.advancementRecord.notes).toBe('Custom note');
      expect(result.trainingPeriod?.downtimePeriodId).toBe('downtime-123');
    });

    it('should throw error if skill rating is less than 4', () => {
      character.skills = { pistols: 3 };
      
      expect(() => advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset))
        .toThrow('Skill rating must be at least 4');
    });

    it('should throw error if specialization already exists', () => {
      character.skillSpecializations = {
        pistols: ['Semi-Automatics'],
      };
      
      expect(() => advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset))
        .toThrow('already knows the specialization');
    });

    it('should throw error if insufficient karma', () => {
      character.karmaCurrent = 5;
      
      expect(() => advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset))
        .toThrow('Not enough karma');
    });

    it('should handle instructor bonus (25% time reduction)', () => {
      const result = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset, {
        instructorBonus: true,
      });

      expect(result.trainingPeriod?.instructorBonus).toBe(true);
      expect(result.trainingPeriod?.requiredTime).toBe(22); // 30 * 0.75 = 22.5 -> 22 (round down)
    });

    it('should handle time modifier (e.g., Dependents quality +50%)', () => {
      const result = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset, {
        timeModifier: 50, // +50% time
      });

      expect(result.trainingPeriod?.timeModifier).toBe(50);
      expect(result.trainingPeriod?.requiredTime).toBe(45); // 30 * 1.5 = 45
    });

    it('should handle combined modifiers (instructor + time modifier)', () => {
      const result = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset, {
        instructorBonus: true,
        timeModifier: 50,
      });

      // Instructor bonus applied first: 30 * 0.75 = 22.5 -> 22
      // Then time modifier: 22 * 1.5 = 33
      expect(result.trainingPeriod?.requiredTime).toBe(33);
    });

    it('should allow learning multiple specializations for the same skill', () => {
      // First specialization
      const result1 = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset);
      expect(result1.updatedCharacter.advancementHistory).toHaveLength(1);

      // Second specialization (on updated character after first training completes)
      // Note: In real usage, you'd complete training first, but for testing we can advance again
      // This will fail validation because specialization isn't added yet, but that's expected
      // Let's test that we can learn a different specialization
      character.skillSpecializations = {
        pistols: ['Semi-Automatics'], // Simulate first specialization completed
      };
      
      const result2 = advanceSpecialization(character, 'pistols', 'Revolvers', ruleset);
      expect(result2.updatedCharacter.advancementHistory).toHaveLength(1); // New record
    });

    it('should calculate correct training time (30 days base)', () => {
      const result = advanceSpecialization(character, 'pistols', 'Semi-Automatics', ruleset);
      
      expect(result.trainingPeriod?.requiredTime).toBe(30);
    });
  });
});

