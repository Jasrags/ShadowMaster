/**
 * Tests for karma cost calculations
 *
 * Tests all advancement cost calculation functions to ensure
 * they follow Shadowrun 5e rules correctly.
 */

import { describe, it, expect } from 'vitest';
import type { AdvancementType } from '@/lib/types';
import {
  calculateAttributeCost,
  calculateActiveSkillCost,
  calculateKnowledgeSkillCost,
  calculateSkillGroupCost,
  calculateSpecializationCost,
  calculateEdgeCost,
  calculateNewKnowledgeSkillCost,
  calculateSpellCost,
  calculateComplexFormCost,
  calculateAdvancementCost,
} from '../costs';

describe('Karma Cost Calculations', () => {
  describe('calculateAttributeCost', () => {
    it('should calculate cost as new rating × 5', () => {
      expect(calculateAttributeCost(1)).toBe(5);
      expect(calculateAttributeCost(2)).toBe(10);
      expect(calculateAttributeCost(3)).toBe(15);
      expect(calculateAttributeCost(4)).toBe(20);
      expect(calculateAttributeCost(5)).toBe(25);
      expect(calculateAttributeCost(6)).toBe(30);
    });

    it('should throw error for invalid rating', () => {
      expect(() => calculateAttributeCost(0)).toThrow('Attribute rating must be at least 1');
      expect(() => calculateAttributeCost(-1)).toThrow('Attribute rating must be at least 1');
    });
  });

  describe('calculateActiveSkillCost', () => {
    it('should calculate cost as new rating × 2', () => {
      expect(calculateActiveSkillCost(1)).toBe(2);
      expect(calculateActiveSkillCost(2)).toBe(4);
      expect(calculateActiveSkillCost(3)).toBe(6);
      expect(calculateActiveSkillCost(4)).toBe(8);
      expect(calculateActiveSkillCost(5)).toBe(10);
      expect(calculateActiveSkillCost(6)).toBe(12);
    });

    it('should throw error for invalid rating', () => {
      expect(() => calculateActiveSkillCost(0)).toThrow('Skill rating must be at least 1');
      expect(() => calculateActiveSkillCost(-1)).toThrow('Skill rating must be at least 1');
    });
  });

  describe('calculateKnowledgeSkillCost', () => {
    it('should calculate cost as new rating × 1', () => {
      expect(calculateKnowledgeSkillCost(1)).toBe(1);
      expect(calculateKnowledgeSkillCost(2)).toBe(2);
      expect(calculateKnowledgeSkillCost(3)).toBe(3);
      expect(calculateKnowledgeSkillCost(4)).toBe(4);
      expect(calculateKnowledgeSkillCost(5)).toBe(5);
      expect(calculateKnowledgeSkillCost(6)).toBe(6);
    });

    it('should throw error for invalid rating', () => {
      expect(() => calculateKnowledgeSkillCost(0)).toThrow('Skill rating must be at least 1');
      expect(() => calculateKnowledgeSkillCost(-1)).toThrow('Skill rating must be at least 1');
    });
  });

  describe('calculateSkillGroupCost', () => {
    it('should calculate cost as new rating × 5', () => {
      expect(calculateSkillGroupCost(1)).toBe(5);
      expect(calculateSkillGroupCost(2)).toBe(10);
      expect(calculateSkillGroupCost(3)).toBe(15);
      expect(calculateSkillGroupCost(4)).toBe(20);
      expect(calculateSkillGroupCost(5)).toBe(25);
      expect(calculateSkillGroupCost(6)).toBe(30);
    });

    it('should throw error for invalid rating', () => {
      expect(() => calculateSkillGroupCost(0)).toThrow('Skill group rating must be at least 1');
      expect(() => calculateSkillGroupCost(-1)).toThrow('Skill group rating must be at least 1');
    });
  });

  describe('calculateSpecializationCost', () => {
    it('should return fixed cost of 7 karma', () => {
      expect(calculateSpecializationCost()).toBe(7);
    });
  });

  describe('calculateEdgeCost', () => {
    it('should calculate cost as new rating × 5 (same as attributes)', () => {
      expect(calculateEdgeCost(1)).toBe(5);
      expect(calculateEdgeCost(2)).toBe(10);
      expect(calculateEdgeCost(3)).toBe(15);
      expect(calculateEdgeCost(4)).toBe(20);
      expect(calculateEdgeCost(5)).toBe(25);
      expect(calculateEdgeCost(6)).toBe(30);
      expect(calculateEdgeCost(7)).toBe(35);
    });

    it('should throw error for invalid rating', () => {
      expect(() => calculateEdgeCost(0)).toThrow('Edge rating must be at least 1');
      expect(() => calculateEdgeCost(-1)).toThrow('Edge rating must be at least 1');
    });
  });

  describe('calculateNewKnowledgeSkillCost', () => {
    it('should return fixed cost of 1 karma', () => {
      expect(calculateNewKnowledgeSkillCost()).toBe(1);
    });
  });

  describe('calculateSpellCost', () => {
    it('should return fixed cost of 5 karma', () => {
      expect(calculateSpellCost()).toBe(5);
    });
  });

  describe('calculateComplexFormCost', () => {
    it('should return fixed cost of 4 karma', () => {
      expect(calculateComplexFormCost()).toBe(4);
    });
  });

  describe('calculateAdvancementCost', () => {
    it('should calculate attribute cost', () => {
      expect(calculateAdvancementCost('attribute', 3)).toBe(15);
      expect(calculateAdvancementCost('attribute', 5)).toBe(25);
    });

    it('should calculate edge cost', () => {
      expect(calculateAdvancementCost('edge', 2)).toBe(10);
      expect(calculateAdvancementCost('edge', 4)).toBe(20);
    });

    it('should calculate active skill cost', () => {
      expect(calculateAdvancementCost('skill', 3)).toBe(6);
      expect(calculateAdvancementCost('skill', 5)).toBe(10);
    });

    it('should calculate skill group cost', () => {
      expect(calculateAdvancementCost('skillGroup', 2)).toBe(10);
      expect(calculateAdvancementCost('skillGroup', 4)).toBe(20);
    });

    it('should calculate knowledge skill cost', () => {
      expect(calculateAdvancementCost('knowledgeSkill', 3)).toBe(3);
      expect(calculateAdvancementCost('knowledgeSkill', 5)).toBe(5);
    });

    it('should calculate language skill cost', () => {
      expect(calculateAdvancementCost('languageSkill', 2)).toBe(2);
      expect(calculateAdvancementCost('languageSkill', 4)).toBe(4);
    });

    it('should calculate specialization cost', () => {
      expect(calculateAdvancementCost('specialization')).toBe(7);
    });

    it('should calculate spell cost', () => {
      expect(calculateAdvancementCost('spell')).toBe(5);
    });

    it('should calculate ritual cost', () => {
      expect(calculateAdvancementCost('ritual')).toBe(5);
    });

    it('should calculate complex form cost', () => {
      expect(calculateAdvancementCost('complexForm')).toBe(4);
    });

    it('should throw error when rating required but not provided', () => {
      expect(() => calculateAdvancementCost('attribute')).toThrow('Rating required for attribute/edge advancement');
      expect(() => calculateAdvancementCost('skill')).toThrow('Rating required for skill advancement');
      expect(() => calculateAdvancementCost('skillGroup')).toThrow('Rating required for skill group advancement');
      expect(() => calculateAdvancementCost('knowledgeSkill')).toThrow('Rating required for knowledge/language skill advancement');
    });

    it('should throw error for unsupported advancement types', () => {
      expect(() => calculateAdvancementCost('focus' as AdvancementType)).toThrow('Focus bonding cost calculation requires focus type');
      expect(() => calculateAdvancementCost('initiation' as AdvancementType)).toThrow('Initiation cost calculation requires grade');
      expect(() => calculateAdvancementCost('quality' as AdvancementType)).toThrow('Quality costs are handled by quality advancement module');
      // Test with invalid type - need to cast to bypass type checking for this test
      expect(() => calculateAdvancementCost('unknown' as AdvancementType)).toThrow('Unknown advancement type: unknown');
    });
  });
});

