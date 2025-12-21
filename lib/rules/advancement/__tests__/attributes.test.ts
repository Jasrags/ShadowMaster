/**
 * Tests for attribute advancement
 *
 * Tests the advanceAttribute function including validation,
 * karma spending, advancement record creation, and training period creation.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Character, MergedRuleset } from '@/lib/types';
import { advanceAttribute } from '../attributes';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';
import { createMockCharacter } from '@/__tests__/mocks/storage';

// Mock uuid to get predictable IDs
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

describe('Attribute Advancement', () => {
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
    });
  });

  describe('advanceAttribute', () => {
    it('should successfully advance an attribute', () => {
      const result = advanceAttribute(character, 'body', 4, ruleset);

      // Check advancement record
      expect(result.advancementRecord).toBeDefined();
      expect(result.advancementRecord.type).toBe('attribute');
      expect(result.advancementRecord.targetId).toBe('body');
      expect(result.advancementRecord.targetName).toBe('Body');
      expect(result.advancementRecord.previousValue).toBe(3);
      expect(result.advancementRecord.newValue).toBe(4);
      expect(result.advancementRecord.karmaCost).toBe(20); // 4 * 5
      expect(result.advancementRecord.trainingRequired).toBe(true);
      expect(result.advancementRecord.trainingStatus).toBe('pending');

      // Check training period
      expect(result.trainingPeriod).toBeDefined();
      expect(result.trainingPeriod?.type).toBe('attribute');
      expect(result.trainingPeriod?.targetId).toBe('body');
      expect(result.trainingPeriod?.requiredTime).toBe(28); // 4 * 7 days
      expect(result.trainingPeriod?.status).toBe('pending');

      // Check character updates
      expect(result.updatedCharacter.karmaCurrent).toBe(30); // 50 - 20
      expect(result.updatedCharacter.advancementHistory).toHaveLength(1);
      expect(result.updatedCharacter.activeTraining).toHaveLength(1);
      
      // Attribute should NOT be updated yet (training not complete)
      expect(result.updatedCharacter.attributes.body).toBe(3);
    });

    it('should spend karma immediately', () => {
      const result = advanceAttribute(character, 'body', 4, ruleset);
      expect(result.updatedCharacter.karmaCurrent).toBe(30);
      expect(result.advancementRecord.karmaSpentAt).toBeDefined();
    });

    it('should create advancement record with correct structure', () => {
      const result = advanceAttribute(character, 'agility', 5, ruleset);
      const record = result.advancementRecord;

      expect(record.id).toBeDefined();
      expect(record.type).toBe('attribute');
      expect(record.targetId).toBe('agility');
      expect(record.targetName).toBe('Agility');
      expect(record.previousValue).toBe(4);
      expect(record.newValue).toBe(5);
      expect(record.karmaCost).toBe(25);
      expect(record.trainingRequired).toBe(true);
      expect(record.trainingStatus).toBe('pending');
      expect(record.createdAt).toBeDefined();
      expect(record.gmApproved).toBe(false);
    });

    it('should create training period with correct structure', () => {
      const result = advanceAttribute(character, 'body', 4, ruleset);
      const training = result.trainingPeriod;

      expect(training).toBeDefined();
      expect(training?.id).toBeDefined();
      expect(training?.advancementRecordId).toBe(result.advancementRecord.id);
      expect(training?.type).toBe('attribute');
      expect(training?.targetId).toBe('body');
      expect(training?.targetName).toBe('Body');
      expect(training?.requiredTime).toBe(28); // 4 * 7
      expect(training?.timeSpent).toBe(0);
      expect(training?.status).toBe('pending');
      expect(training?.startDate).toBeDefined();
      expect(training?.expectedCompletionDate).toBeDefined();
      expect(training?.createdAt).toBeDefined();
    });

    it('should link training period to advancement record', () => {
      const result = advanceAttribute(character, 'body', 4, ruleset);
      expect(result.advancementRecord.trainingPeriodId).toBe(result.trainingPeriod?.id);
    });

    it('should not update character attribute until training completes', () => {
      const result = advanceAttribute(character, 'body', 4, ruleset);
      expect(result.updatedCharacter.attributes.body).toBe(3); // Still 3, not 4
    });

    it('should add to existing advancement history', () => {
      const characterWithHistory = createMockCharacter({
        ...character,
        advancementHistory: [
          {
            id: 'existing-id',
            type: 'skill',
            targetId: 'firearms',
            targetName: 'Firearms',
            newValue: 3,
            karmaCost: 6,
            karmaSpentAt: new Date().toISOString(),
            trainingRequired: true,
            trainingStatus: 'completed',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            gmApproved: false,
          },
        ],
      });

      const result = advanceAttribute(characterWithHistory, 'body', 4, ruleset);
      expect(result.updatedCharacter.advancementHistory).toHaveLength(2);
    });

    it('should add to existing active training', () => {
      const characterWithTraining = createMockCharacter({
        ...character,
        activeTraining: [
          {
            id: 'existing-training-id',
            advancementRecordId: 'existing-id',
            type: 'skill',
            targetId: 'firearms',
            targetName: 'Firearms',
            requiredTime: 10,
            timeSpent: 5,
            startDate: new Date().toISOString(),
            status: 'in-progress',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const result = advanceAttribute(characterWithTraining, 'body', 4, ruleset);
      expect(result.updatedCharacter.activeTraining).toHaveLength(2);
    });

    it('should apply instructor bonus to training time', () => {
      const result = advanceAttribute(character, 'body', 4, ruleset, {
        instructorBonus: true,
      });

      // Base time: 4 * 7 = 28 days
      // With instructor: 28 * 0.75 = 21 days (round down)
      expect(result.trainingPeriod?.requiredTime).toBe(21);
      expect(result.trainingPeriod?.instructorBonus).toBe(true);
    });

    it('should apply time modifier to training time', () => {
      const result = advanceAttribute(character, 'body', 4, ruleset, {
        timeModifier: 50, // +50% time
      });

      // Base time: 4 * 7 = 28 days
      // With +50%: 28 * 1.5 = 42 days
      expect(result.trainingPeriod?.requiredTime).toBe(42);
      expect(result.trainingPeriod?.timeModifier).toBe(50);
    });

    it('should apply both instructor bonus and time modifier', () => {
      const result = advanceAttribute(character, 'body', 4, ruleset, {
        instructorBonus: true,
        timeModifier: 50,
      });

      // Base time: 4 * 7 = 28 days
      // Instructor: 28 * 0.75 = 21 days
      // +50%: 21 * 1.5 = 31.5, round = 32 days
      expect(result.trainingPeriod?.requiredTime).toBe(32);
    });

    it('should support downtime period linking', () => {
      const downtimeId = 'downtime-123';
      const result = advanceAttribute(character, 'body', 4, ruleset, {
        downtimePeriodId: downtimeId,
      });

      expect(result.advancementRecord.downtimePeriodId).toBe(downtimeId);
      expect(result.trainingPeriod?.downtimePeriodId).toBe(downtimeId);
    });

    it('should support campaign session linking', () => {
      const sessionId = 'session-456';
      const result = advanceAttribute(character, 'body', 4, ruleset, {
        campaignSessionId: sessionId,
      });

      expect(result.advancementRecord.campaignSessionId).toBe(sessionId);
    });

    it('should support GM approval flag', () => {
      const result = advanceAttribute(character, 'body', 4, ruleset, {
        gmApproved: true,
      });

      expect(result.advancementRecord.gmApproved).toBe(true);
    });

    it('should support notes', () => {
      const notes = 'Training with personal trainer';
      const result = advanceAttribute(character, 'body', 4, ruleset, {
        notes,
      });

      expect(result.advancementRecord.notes).toBe(notes);
    });

    it('should throw error for invalid advancement', () => {
      expect(() => {
        advanceAttribute(character, 'body', 3, ruleset); // Same as current
      }).toThrow('Cannot advance attribute');
    });

    it('should throw error for insufficient karma', () => {
      const poorCharacter = createMockCharacter({
        ...character,
        karmaCurrent: 5,
      });

      expect(() => {
        advanceAttribute(poorCharacter, 'body', 4, ruleset);
      }).toThrow('Not enough karma');
    });

    it('should throw error for rating exceeding maximum', () => {
      expect(() => {
        advanceAttribute(character, 'body', 7, ruleset); // Max is 6
      }).toThrow('Cannot advance attribute');
    });

    it('should handle attributes starting at 0', () => {
      const newCharacter = createMockCharacter({
        ...character,
        attributes: {},
      });

      const result = advanceAttribute(newCharacter, 'body', 1, ruleset);
      expect(result.advancementRecord.previousValue).toBe(0);
      expect(result.advancementRecord.newValue).toBe(1);
    });
  });
});

