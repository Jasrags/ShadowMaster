/**
 * Tests for dynamic quality state management
 *
 * Tests addiction, allergy, dependents state management,
 * state initialization, updates, and persistence.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type { Character, Quality, QualitySelection } from '@/lib/types';
import {
  initializeDynamicState,
  updateDynamicState,
  getDynamicState,
  validateDynamicState,
} from '../dynamic-state';
import {
  checkAddictionCraving,
  makeCravingTest,
  beginWithdrawal,
  recordDose,
} from '../dynamic-state/addiction';
import {
  checkExposure,
  beginExposure,
  endExposure,
  calculateAllergyPenalties,
} from '../dynamic-state/allergy';
import {
  updateDependentStatus,
  calculateLifestyleModifier,
  calculateTotalLifestyleModifier,
  calculateTimeCommitment,
} from '../dynamic-state/dependents';
import { createMockCharacter } from '@/__tests__/mocks/storage';

describe('Dynamic Quality State Management', () => {
  beforeEach(() => {
    // Character instances are created per test as needed
  });

  describe('initializeDynamicState', () => {
    it('should return null for quality without dynamic state', () => {
      const quality: Quality = {
        id: 'simple-quality',
        name: 'Simple Quality',
        type: 'positive',
        karmaCost: 5,
        summary: 'No dynamic state',
      };

      const selection: QualitySelection = {
        qualityId: 'simple-quality',
        source: 'creation',
      };

      const result = initializeDynamicState(quality, selection);
      expect(result).toBeNull();
    });

    it('should initialize addiction state', () => {
      const quality: Quality = {
        id: 'addiction',
        name: 'Addiction',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Addiction quality',
        dynamicState: 'addiction',
      };

      const selection: QualitySelection = {
        qualityId: 'addiction',
        source: 'creation',
        variant: 'moderate',
        specification: 'Cram',
        specificationId: 'both',
      };

      const result = initializeDynamicState(quality, selection);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('addiction');
      if (result?.type === 'addiction') {
        expect(result.state.substance).toBe('Cram');
        expect(result.state.severity).toBe('moderate');
        expect(result.state.originalSeverity).toBe('moderate');
        expect(result.state.cravingActive).toBe(false);
        expect(result.state.withdrawalActive).toBe(false);
        expect(result.state.withdrawalPenalty).toBe(0);
        expect(result.state.daysClean).toBe(0);
        expect(result.state.recoveryAttempts).toBe(0);
      }
    });

    it('should initialize allergy state', () => {
      const quality: Quality = {
        id: 'allergy',
        name: 'Allergy',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Allergy quality',
        dynamicState: 'allergy',
      };

      const selection: QualitySelection = {
        qualityId: 'allergy',
        source: 'creation',
        variant: 'severe',
        specification: 'Pollens',
        specificationId: 'common',
      };

      const result = initializeDynamicState(quality, selection);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('allergy');
      if (result?.type === 'allergy') {
        expect(result.state.allergen).toBe('Pollens');
        expect(result.state.severity).toBe('severe');
        expect(result.state.prevalence).toBe('common');
        expect(result.state.currentlyExposed).toBe(false);
        expect(result.state.damageAccumulated).toBe(0);
      }
    });

    it('should initialize dependents state', () => {
      const quality: Quality = {
        id: 'dependents',
        name: 'Dependents',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Dependents quality',
        dynamicState: 'dependent',
      };

      const selection: QualitySelection = {
        qualityId: 'dependents',
        source: 'creation',
        rating: 2,
        specification: 'John Doe',
        specificationId: 'child',
      };

      const result = initializeDynamicState(quality, selection);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('dependent');
      if (result?.type === 'dependent') {
        expect(result.state.name).toBe('John Doe');
        expect(result.state.relationship).toBe('child');
        expect(result.state.tier).toBe(2);
        expect(result.state.currentStatus).toBe('safe');
        expect(result.state.lifestyleCostModifier).toBe(20); // tier * 10
        expect(result.state.timeCommitmentHours).toBe(10); // tier * 5
      }
    });

    it('should initialize code of honor state', () => {
      const quality: Quality = {
        id: 'code-of-honor',
        name: 'Code of Honor',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Code of Honor quality',
        dynamicState: 'code-of-honor',
      };

      const selection: QualitySelection = {
        qualityId: 'code-of-honor',
        source: 'creation',
        specification: 'Warrior\'s Code',
        notes: 'Never attack from behind',
      };

      const result = initializeDynamicState(quality, selection);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('code-of-honor');
      if (result?.type === 'code-of-honor') {
        expect(result.state.codeName).toBe('Warrior\'s Code');
        expect(result.state.description).toBe('Never attack from behind');
        expect(result.state.violations).toEqual([]);
        expect(result.state.totalKarmaLost).toBe(0);
      }
    });
  });

  describe('updateDynamicState and getDynamicState', () => {
    it('should update and retrieve dynamic state', () => {
      const quality: Quality = {
        id: 'addiction',
        name: 'Addiction',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Addiction quality',
        dynamicState: 'addiction',
      };

      const selection: QualitySelection = {
        qualityId: 'addiction',
        source: 'creation',
        variant: 'mild',
        specification: 'Cram',
      };

      const initialState = initializeDynamicState(quality, selection);
      expect(initialState).not.toBeNull();

      const characterWithQuality = createMockCharacter({
        negativeQualities: [
          {
            ...selection,
            dynamicState: initialState as import("@/lib/types").QualityDynamicState,
          },
        ],
      });

      // Get state
      const retrievedState = getDynamicState(characterWithQuality, 'addiction');
      expect(retrievedState).not.toBeNull();
      expect(retrievedState?.type).toBe('addiction');

      // Update state
      const updatedCharacter = updateDynamicState(characterWithQuality, 'addiction', {
        cravingActive: true,
      });

      const updatedState = getDynamicState(updatedCharacter, 'addiction');
      expect(updatedState).not.toBeNull();
      if (updatedState?.type === 'addiction') {
        expect(updatedState.state.cravingActive).toBe(true);
      }
    });

    it('should return null for quality without dynamic state', () => {
      const characterWithQuality = createMockCharacter({
        positiveQualities: [
          {
            qualityId: 'simple-quality',
            source: 'creation',
          },
        ],
      });

      const state = getDynamicState(characterWithQuality, 'simple-quality');
      expect(state).toBeNull();
    });
  });

  describe('validateDynamicState', () => {
    it('should validate addiction state', () => {
      const quality: Quality = {
        id: 'addiction',
        name: 'Addiction',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Addiction quality',
        dynamicState: 'addiction',
      };

      const validState = {
        type: 'addiction' as const,
        state: {
          substance: 'Cram',
          substanceType: 'both' as const,
          severity: 'moderate' as const,
          originalSeverity: 'moderate' as const,
          lastDose: new Date().toISOString(),
          nextCravingCheck: new Date().toISOString(),
          cravingActive: false,
          withdrawalActive: false,
          withdrawalPenalty: 0,
          daysClean: 0,
          recoveryAttempts: 0,
        },
      };

      const result = validateDynamicState(quality, validState);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid addiction state', () => {
      const quality: Quality = {
        id: 'addiction',
        name: 'Addiction',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Addiction quality',
        dynamicState: 'addiction',
      };

      const invalidState = {
        type: 'addiction' as const,
        state: {
          substance: 'Cram',
          substanceType: 'both' as const,
          severity: 'invalid-severity' as 'mild' | 'moderate' | 'severe' | 'burnout', // Invalid: not a valid severity
          originalSeverity: 'moderate' as const,
          lastDose: new Date().toISOString(),
          nextCravingCheck: new Date().toISOString(),
          cravingActive: false,
          withdrawalActive: false,
          withdrawalPenalty: 10, // Invalid: exceeds max of 6
          daysClean: 0,
          recoveryAttempts: 0,
        },
      };

      const result = validateDynamicState(quality, invalidState);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Addiction State Management', () => {
    let characterWithAddiction: Character;

    beforeEach(() => {
      const quality: Quality = {
        id: 'addiction',
        name: 'Addiction',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Addiction quality',
        dynamicState: 'addiction',
      };

      const selection: QualitySelection = {
        qualityId: 'addiction',
        source: 'creation',
        variant: 'moderate',
        specification: 'Cram',
        dynamicState: initializeDynamicState(quality, {
          qualityId: 'addiction',
          source: 'creation',
          variant: 'moderate',
          specification: 'Cram',
        }) || undefined,
      };

      characterWithAddiction = createMockCharacter({
        negativeQualities: [selection],
      });
    });

    it('should check craving status', () => {
      const hasCraving = checkAddictionCraving(characterWithAddiction, 'addiction');
      expect(typeof hasCraving).toBe('boolean');
    });

    it('should make craving test', () => {
      const resisted = makeCravingTest(characterWithAddiction, 'addiction', 3, 2);
      expect(typeof resisted).toBe('boolean');
    });

    it('should begin withdrawal', () => {
      const updatedCharacter = beginWithdrawal(characterWithAddiction, 'addiction');
      const state = getDynamicState(updatedCharacter, 'addiction');
      expect(state).not.toBeNull();
      if (state?.type === 'addiction') {
        expect(state.state.withdrawalActive).toBe(true);
        expect(state.state.withdrawalPenalty).toBeGreaterThan(0);
      }
    });

    it('should record dose', () => {
      const updatedCharacter = recordDose(characterWithAddiction, 'addiction', new Date().toISOString());
      const state = getDynamicState(updatedCharacter, 'addiction');
      expect(state).not.toBeNull();
      if (state?.type === 'addiction') {
        expect(state.state.withdrawalActive).toBe(false);
      }
    });
  });

  describe('Allergy State Management', () => {
    let characterWithAllergy: Character;

    beforeEach(() => {
      const quality: Quality = {
        id: 'allergy',
        name: 'Allergy',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Allergy quality',
        dynamicState: 'allergy',
      };

      const selection: QualitySelection = {
        qualityId: 'allergy',
        source: 'creation',
        variant: 'severe',
        specification: 'Pollens',
        specificationId: 'common',
        dynamicState: initializeDynamicState(quality, {
          qualityId: 'allergy',
          source: 'creation',
          variant: 'severe',
          specification: 'Pollens',
          specificationId: 'common',
        }) || undefined,
      };

      characterWithAllergy = createMockCharacter({
        negativeQualities: [selection],
      });
    });

    it('should check exposure', () => {
      const isExposed = checkExposure(characterWithAllergy, 'allergy', 'Pollens');
      expect(typeof isExposed).toBe('boolean');
    });

    it('should begin exposure', () => {
      const updatedCharacter = beginExposure(characterWithAllergy, 'allergy');
      const state = getDynamicState(updatedCharacter, 'allergy');
      expect(state).not.toBeNull();
      if (state?.type === 'allergy') {
        expect(state.state.currentlyExposed).toBe(true);
        expect(state.state.exposureStartTime).toBeDefined();
      }
    });

    it('should end exposure', () => {
      const characterAfterExposure = beginExposure(characterWithAllergy, 'allergy');
      const updatedCharacter = endExposure(characterAfterExposure, 'allergy');
      const state = getDynamicState(updatedCharacter, 'allergy');
      expect(state).not.toBeNull();
      if (state?.type === 'allergy') {
        expect(state.state.currentlyExposed).toBe(false);
        expect(state.state.exposureDuration).toBeDefined();
      }
    });

    it('should calculate allergy penalties', () => {
      const characterAfterExposure = beginExposure(characterWithAllergy, 'allergy');
      const penalties = calculateAllergyPenalties(characterAfterExposure, 'allergy');
      expect(typeof penalties).toBe('number');
      expect(penalties).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Dependents State Management', () => {
    let characterWithDependent: Character;

    beforeEach(() => {
      const quality: Quality = {
        id: 'dependents',
        name: 'Dependents',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Dependents quality',
        dynamicState: 'dependent',
      };

      const selection: QualitySelection = {
        qualityId: 'dependents',
        source: 'creation',
        rating: 2,
        specification: 'John Doe',
        specificationId: 'child',
        dynamicState: initializeDynamicState(quality, {
          qualityId: 'dependents',
          source: 'creation',
          rating: 2,
          specification: 'John Doe',
          specificationId: 'child',
        }) || undefined,
      };

      characterWithDependent = createMockCharacter({
        negativeQualities: [selection],
      });
    });

    it('should update dependent status', () => {
      const updatedCharacter = updateDependentStatus(characterWithDependent, 'dependents', 'in-danger');
      const state = getDynamicState(updatedCharacter, 'dependents');
      expect(state).not.toBeNull();
      if (state?.type === 'dependent') {
        expect(state.state.currentStatus).toBe('in-danger');
        expect(state.state.lastCheckedIn).toBeDefined();
      }
    });

    it('should calculate lifestyle modifier', () => {
      const modifier = calculateLifestyleModifier(characterWithDependent, 'dependents');
      expect(modifier).toBe(20); // tier 2 * 10
    });

    it('should calculate total lifestyle modifier for all dependents', () => {
      const quality1: Quality = {
        id: 'dependents-1',
        name: 'Dependents 1',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Dependents quality',
        dynamicState: 'dependent',
      };

      const quality2: Quality = {
        id: 'dependents-2',
        name: 'Dependents 2',
        type: 'negative',
        karmaBonus: 5,
        summary: 'Dependents quality',
        dynamicState: 'dependent',
      };

      const selection1: QualitySelection = {
        qualityId: 'dependents-1',
        source: 'creation',
        rating: 1,
        specification: 'Dependent 1',
        dynamicState: initializeDynamicState(quality1, {
          qualityId: 'dependents-1',
          source: 'creation',
          rating: 1,
          specification: 'Dependent 1',
        }) || undefined,
      };

      const selection2: QualitySelection = {
        qualityId: 'dependents-2',
        source: 'creation',
        rating: 2,
        specification: 'Dependent 2',
        dynamicState: initializeDynamicState(quality2, {
          qualityId: 'dependents-2',
          source: 'creation',
          rating: 2,
          specification: 'Dependent 2',
        }) || undefined,
      };

      const characterWithMultiple = createMockCharacter({
        negativeQualities: [selection1, selection2],
      });

      const totalModifier = calculateTotalLifestyleModifier(characterWithMultiple);
      expect(totalModifier).toBe(30); // 10 + 20
    });

    it('should calculate time commitment', () => {
      const hours = calculateTimeCommitment(characterWithDependent, 'dependents');
      expect(hours).toBe(10); // tier 2 * 5
    });
  });
});

