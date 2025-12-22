/**
 * Tests for skill advancement
 *
 * Tests the advanceSkill function including validation,
 * karma spending, advancement record creation, and training period creation.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Character, MergedRuleset } from '@/lib/types';
import { advanceSkill } from '../skills';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';
import { createMockCharacter } from '@/__tests__/mocks/storage';

// Mock uuid to get predictable IDs
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

describe('Skill Advancement', () => {
  let ruleset: MergedRuleset;
  let character: Character;

  beforeEach(() => {
    ruleset = createMockMergedRuleset({
      modules: {
        ...createMockMergedRuleset().modules,
        skills: {
          firearms: {
            id: 'firearms',
            name: 'Firearms',
            linkedAttribute: 'agility',
            group: 'combat',
            canDefault: true,
          },
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
      metatype: 'Human',
      status: 'active',
      karmaCurrent: 50,
      skills: {
        firearms: 3,
        pistols: 2,
      },
    });
  });

  describe('advanceSkill', () => {
    it('should successfully advance a skill', () => {
      const result = advanceSkill(character, 'firearms', 4, ruleset);

      // Check advancement record
      expect(result.advancementRecord).toBeDefined();
      expect(result.advancementRecord.type).toBe('skill');
      expect(result.advancementRecord.targetId).toBe('firearms');
      expect(result.advancementRecord.targetName).toBe('Firearms');
      expect(result.advancementRecord.previousValue).toBe(3);
      expect(result.advancementRecord.newValue).toBe(4);
      expect(result.advancementRecord.karmaCost).toBe(8); // 4 * 2
      expect(result.advancementRecord.trainingRequired).toBe(true);
      expect(result.advancementRecord.trainingStatus).toBe('pending');

      // Check training period
      expect(result.trainingPeriod).toBeDefined();
      expect(result.trainingPeriod?.type).toBe('skill');
      expect(result.trainingPeriod?.targetId).toBe('firearms');
      expect(result.trainingPeriod?.requiredTime).toBe(4); // Rating 4: 4 * 1 day
      expect(result.trainingPeriod?.status).toBe('pending');

      // Check character updates
      expect(result.updatedCharacter.karmaCurrent).toBe(42); // 50 - 8
      expect(result.updatedCharacter.advancementHistory).toHaveLength(1);
      expect(result.updatedCharacter.activeTraining).toHaveLength(1);
      
      // Skill should NOT be updated yet (training not complete)
      expect(result.updatedCharacter.skills.firearms).toBe(3);
    });

    it('should calculate correct training time for different skill ratings', () => {
      // Rating 1-4: new rating × 1 day
      const result1 = advanceSkill(character, 'pistols', 3, ruleset);
      expect(result1.trainingPeriod?.requiredTime).toBe(3); // 3 * 1

      // Rating 5-8: new rating × 1 week (7 days)
      const highSkillChar = createMockCharacter({
        ...character,
        skills: { firearms: 4 },
        karmaCurrent: 100,
      });
      const result2 = advanceSkill(highSkillChar, 'firearms', 5, ruleset);
      expect(result2.trainingPeriod?.requiredTime).toBe(35); // 5 * 7

      // Rating 9-13: new rating × 2 weeks (14 days)
      const veryHighSkillChar = createMockCharacter({
        ...character,
        skills: { firearms: 8 },
        karmaCurrent: 200,
      });
      const result3 = advanceSkill(veryHighSkillChar, 'firearms', 9, ruleset);
      expect(result3.trainingPeriod?.requiredTime).toBe(126); // 9 * 14
    });

    it('should spend karma immediately', () => {
      const result = advanceSkill(character, 'firearms', 4, ruleset);
      expect(result.updatedCharacter.karmaCurrent).toBe(42);
      expect(result.advancementRecord.karmaSpentAt).toBeDefined();
    });

    it('should create advancement record with correct structure', () => {
      const result = advanceSkill(character, 'pistols', 3, ruleset);
      const record = result.advancementRecord;

      expect(record.id).toBeDefined();
      expect(record.type).toBe('skill');
      expect(record.targetId).toBe('pistols');
      expect(record.targetName).toBe('Pistols');
      expect(record.previousValue).toBe(2);
      expect(record.newValue).toBe(3);
      expect(record.karmaCost).toBe(6); // 3 * 2
      expect(record.trainingRequired).toBe(true);
      expect(record.trainingStatus).toBe('pending');
      expect(record.createdAt).toBeDefined();
      expect(record.gmApproved).toBe(false);
    });

    it('should create training period with correct structure', () => {
      const result = advanceSkill(character, 'firearms', 4, ruleset);
      const training = result.trainingPeriod;

      expect(training).toBeDefined();
      expect(training?.id).toBeDefined();
      expect(training?.advancementRecordId).toBe(result.advancementRecord.id);
      expect(training?.type).toBe('skill');
      expect(training?.targetId).toBe('firearms');
      expect(training?.targetName).toBe('Firearms');
      expect(training?.requiredTime).toBe(4);
      expect(training?.timeSpent).toBe(0);
      expect(training?.status).toBe('pending');
      expect(training?.startDate).toBeDefined();
      expect(training?.expectedCompletionDate).toBeDefined();
      expect(training?.createdAt).toBeDefined();
    });

    it('should not update character skill until training completes', () => {
      const result = advanceSkill(character, 'firearms', 4, ruleset);
      expect(result.updatedCharacter.skills.firearms).toBe(3); // Still 3, not 4
    });

    it('should apply instructor bonus to training time', () => {
      const result = advanceSkill(character, 'firearms', 4, ruleset, {
        instructorBonus: true,
      });

      // Base time: 4 * 1 = 4 days
      // With instructor: 4 * 0.75 = 3 days (round down)
      expect(result.trainingPeriod?.requiredTime).toBe(3);
      expect(result.trainingPeriod?.instructorBonus).toBe(true);
    });

    it('should apply time modifier to training time', () => {
      const result = advanceSkill(character, 'firearms', 4, ruleset, {
        timeModifier: 50, // +50% time
      });

      // Base time: 4 * 1 = 4 days
      // With +50%: 4 * 1.5 = 6 days
      expect(result.trainingPeriod?.requiredTime).toBe(6);
      expect(result.trainingPeriod?.timeModifier).toBe(50);
    });

    it('should support downtime period linking', () => {
      const downtimeId = 'downtime-123';
      const result = advanceSkill(character, 'firearms', 4, ruleset, {
        downtimePeriodId: downtimeId,
      });

      expect(result.advancementRecord.downtimePeriodId).toBe(downtimeId);
      expect(result.trainingPeriod?.downtimePeriodId).toBe(downtimeId);
    });

    it('should support campaign session linking', () => {
      const sessionId = 'session-456';
      const result = advanceSkill(character, 'firearms', 4, ruleset, {
        campaignSessionId: sessionId,
      });

      expect(result.advancementRecord.campaignSessionId).toBe(sessionId);
    });

    it('should support GM approval flag', () => {
      const result = advanceSkill(character, 'firearms', 4, ruleset, {
        gmApproved: true,
      });

      expect(result.advancementRecord.gmApproved).toBe(true);
    });

    it('should support notes', () => {
      const notes = 'Training at shooting range';
      const result = advanceSkill(character, 'firearms', 4, ruleset, {
        notes,
      });

      expect(result.advancementRecord.notes).toBe(notes);
    });

    it('should throw error for invalid advancement', () => {
      expect(() => {
        advanceSkill(character, 'firearms', 3, ruleset); // Same as current
      }).toThrow('Cannot advance skill');
    });

    it('should throw error for insufficient karma', () => {
      const poorCharacter = createMockCharacter({
        ...character,
        karmaCurrent: 5,
      });

      expect(() => {
        advanceSkill(poorCharacter, 'firearms', 4, ruleset);
      }).toThrow('Not enough karma');
    });

    it('should throw error for rating exceeding maximum', () => {
      const highSkillChar = createMockCharacter({
        ...character,
        skills: { firearms: 12 },
        karmaCurrent: 100,
      });

      expect(() => {
        advanceSkill(highSkillChar, 'firearms', 13, ruleset); // Max is 12
      }).toThrow('Cannot advance skill');
    });

    it('should handle skills starting at 0', () => {
      const newCharacter = createMockCharacter({
        ...character,
        skills: {},
      });

      const result = advanceSkill(newCharacter, 'firearms', 1, ruleset);
      expect(result.advancementRecord.previousValue).toBe(0);
      expect(result.advancementRecord.newValue).toBe(1);
    });

    it('should add to existing advancement history', () => {
      const characterWithHistory = createMockCharacter({
        ...character,
        advancementHistory: [
          {
            id: 'existing-id',
            type: 'attribute',
            targetId: 'body',
            targetName: 'Body',
            newValue: 4,
            karmaCost: 20,
            karmaSpentAt: new Date().toISOString(),
            trainingRequired: true,
            trainingStatus: 'completed',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            gmApproved: false,
          },
        ],
      });

      const result = advanceSkill(characterWithHistory, 'firearms', 4, ruleset);
      expect(result.updatedCharacter.advancementHistory).toHaveLength(2);
    });
  });
});

