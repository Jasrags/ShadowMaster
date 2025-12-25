/**
 * Tests for Edge advancement
 *
 * Tests the advanceEdge function including validation,
 * karma spending, advancement record creation, and immediate Edge update.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Character, MergedRuleset } from '@/lib/types';
import { advanceEdge } from '../edge';
import { createMockMergedRuleset } from '@/__tests__/mocks/rulesets';
import { createMockCharacter } from '@/__tests__/mocks/storage';

// Mock uuid to get predictable IDs
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

describe('Edge Advancement', () => {
  let ruleset: MergedRuleset;
  let character: Character;

  beforeEach(() => {
    ruleset = createMockMergedRuleset();
    character = createMockCharacter({
      status: 'active',
      karmaCurrent: 50,
      specialAttributes: {
        edge: 2,
        essence: 6,
      },
    });
  });

  describe('advanceEdge', () => {
    it('should successfully advance Edge', () => {
      const result = advanceEdge(character, 3, ruleset);

      // Check advancement record
      expect(result.advancementRecord).toBeDefined();
      expect(result.advancementRecord.type).toBe('edge');
      expect(result.advancementRecord.targetId).toBe('edge');
      expect(result.advancementRecord.targetName).toBe('Edge');
      expect(result.advancementRecord.previousValue).toBe(2);
      expect(result.advancementRecord.newValue).toBe(3);
      expect(result.advancementRecord.karmaCost).toBe(15); // 3 * 5
      expect(result.advancementRecord.trainingRequired).toBe(false);
      expect(result.advancementRecord.trainingStatus).toBe('completed');
      expect(result.advancementRecord.completedAt).toBeDefined();

      // Edge has no training period

      // Check character updates
      expect(result.updatedCharacter.karmaCurrent).toBe(50 - 15); // 35
      expect(result.updatedCharacter.specialAttributes?.edge).toBe(3); // Updated immediately
      expect(result.updatedCharacter.advancementHistory).toHaveLength(1);
      expect(result.updatedCharacter.advancementHistory?.[0]).toEqual(result.advancementRecord);
    });

    it('should update Edge immediately (no training)', () => {
      const initialEdge = character.specialAttributes?.edge || 0;
      const result = advanceEdge(character, 4, ruleset);
      
      expect(result.updatedCharacter.specialAttributes?.edge).toBe(4);
      expect(result.updatedCharacter.specialAttributes?.edge).not.toBe(initialEdge);
      expect(result.advancementRecord.completedAt).toBeDefined();
    });

    it('should spend karma immediately', () => {
      const initialKarma = character.karmaCurrent;
      const result = advanceEdge(character, 3, ruleset);
      
      expect(result.updatedCharacter.karmaCurrent).toBe(initialKarma - 15);
    });

    it('should create advancement record with correct structure', () => {
      const result = advanceEdge(character, 3, ruleset);
      
      expect(result.advancementRecord.id).toBeDefined();
      expect(result.advancementRecord.karmaSpentAt).toBeDefined();
      expect(result.advancementRecord.createdAt).toBeDefined();
      expect(result.advancementRecord.completedAt).toBeDefined();
      expect(result.advancementRecord.gmApproved).toBe(false);
    });

    it('should handle options (campaignSessionId, gmApproved, notes)', () => {
      const result = advanceEdge(character, 3, ruleset, {
        campaignSessionId: 'session-123',
        gmApproved: true,
        notes: 'GM approved Edge advancement',
      });

      expect(result.advancementRecord.campaignSessionId).toBe('session-123');
      expect(result.advancementRecord.gmApproved).toBe(true);
      expect(result.advancementRecord.notes).toBe('GM approved Edge advancement');
    });

    it('should throw error if rating is less than 1', () => {
      expect(() => advanceEdge(character, 0, ruleset)).toThrow(/Edge rating must be at least 1/);
      expect(() => advanceEdge(character, -1, ruleset)).toThrow(/Edge rating must be at least 1/);
    });

    it('should throw error if new rating is not higher than current', () => {
      character.specialAttributes = { edge: 3, essence: 6 };
      
      expect(() => advanceEdge(character, 3, ruleset)).toThrow(/must be higher than current/);
      expect(() => advanceEdge(character, 2, ruleset)).toThrow(/must be higher than current/);
    });

    it('should throw error if rating exceeds maximum (7)', () => {
      expect(() => advanceEdge(character, 8, ruleset)).toThrow(/exceeds maximum/);
      expect(() => advanceEdge(character, 10, ruleset)).toThrow(/exceeds maximum/);
    });

    it('should throw error if insufficient karma', () => {
      character.karmaCurrent = 10;
      
      expect(() => advanceEdge(character, 3, ruleset)).toThrow('Not enough karma');
    });

    it('should handle Edge advancement from 0 (new character)', () => {
      character.specialAttributes = { edge: 0, essence: 6 };
      const result = advanceEdge(character, 1, ruleset);
      
      expect(result.updatedCharacter.specialAttributes?.edge).toBe(1);
      expect(result.advancementRecord.previousValue).toBe(0);
      expect(result.advancementRecord.newValue).toBe(1);
      expect(result.advancementRecord.karmaCost).toBe(5); // 1 * 5
    });

    it('should handle multiple Edge advancements', () => {
      // First advancement
      const result1 = advanceEdge(character, 3, ruleset);
      expect(result1.updatedCharacter.specialAttributes?.edge).toBe(3);
      expect(result1.updatedCharacter.advancementHistory).toHaveLength(1);

      // Second advancement
      const result2 = advanceEdge(result1.updatedCharacter, 4, ruleset);
      expect(result2.updatedCharacter.specialAttributes?.edge).toBe(4);
      expect(result2.updatedCharacter.advancementHistory).toHaveLength(2);
      expect(result2.updatedCharacter.karmaCurrent).toBe(50 - 15 - 20); // 15
    });

    it('should calculate correct karma cost for different ratings', () => {
      // Start with Edge 0
      character.specialAttributes = { edge: 0, essence: 6 };
      character.karmaCurrent = 100;
      
      const result1 = advanceEdge(character, 1, ruleset);
      expect(result1.advancementRecord.karmaCost).toBe(5); // 1 * 5

      const result2 = advanceEdge(result1.updatedCharacter, 5, ruleset);
      expect(result2.advancementRecord.karmaCost).toBe(25); // 5 * 5

      const result3 = advanceEdge(result2.updatedCharacter, 7, ruleset);
      expect(result3.advancementRecord.karmaCost).toBe(35); // 7 * 5
    });
  });
});

