/**
 * Tests for action validation logic
 *
 * Tests validation functions for character state, action economy,
 * prerequisites, combat context, and state modifier calculation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type {
  Character,
  ActionDefinition,
  CombatSession,
  CombatParticipant,
  ActionAllocation,
} from '@/lib/types';
import {
  validateCharacterState,
  validateActionEconomy,
  validatePrerequisites,
  validateCombatContext,
  validateAction,
  validateActionEligibility,
  calculateStateModifiers,
  canPerformAction,
  getActionBlockers,
  ValidationErrorCodes,
} from '../action-validator';
import { createMockCharacter } from '@/__tests__/mocks/storage';

// =============================================================================
// TEST HELPERS
// =============================================================================

function createMockActionDefinition(
  overrides?: Partial<ActionDefinition>
): ActionDefinition {
  return {
    id: 'test-action',
    name: 'Test Action',
    description: 'A test action',
    type: 'simple',
    domain: 'general',
    cost: {
      actionType: 'simple',
    },
    prerequisites: [],
    modifiers: [],
    effects: [],
    ...overrides,
  };
}

function createMockCombatSession(
  overrides?: Partial<CombatSession>
): CombatSession {
  return {
    id: 'test-session',
    ownerId: 'test-user',
    editionCode: 'sr5',
    participants: [],
    initiativeOrder: [],
    currentTurn: 0,
    currentPhase: 'action',
    round: 1,
    status: 'active',
    environment: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockParticipant(
  overrides?: Partial<CombatParticipant>
): CombatParticipant {
  return {
    id: 'test-participant',
    type: 'character',
    entityId: 'test-character-id',
    name: 'Test Character',
    initiativeScore: 10,
    actionsRemaining: {
      free: 999,
      simple: 2,
      complex: 1,
      interrupt: true,
    },
    interruptsPending: [],
    status: 'active',
    controlledBy: 'test-user',
    isGMControlled: false,
    woundModifier: 0,
    conditions: [],
    ...overrides,
  };
}

// =============================================================================
// CHARACTER STATE VALIDATION
// =============================================================================

describe('validateCharacterState', () => {
  it('should pass for healthy character', () => {
    const character = createMockCharacter({
      status: 'active',
      condition: {
        physicalDamage: 0,
        stunDamage: 0,
      },
    });

    const result = validateCharacterState(character);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail for deceased character', () => {
    const character = createMockCharacter({
      status: 'deceased',
    });

    const result = validateCharacterState(character);

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.DEAD);
  });

  it('should fail for incapacitated character (physical overflow)', () => {
    const character = createMockCharacter({
      status: 'active',
      derivedStats: {
        physicalConditionMonitor: 10,
      },
      condition: {
        physicalDamage: 10, // At max
        stunDamage: 0,
      },
    });

    const result = validateCharacterState(character);

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.INCAPACITATED);
  });

  it('should fail for unconscious character (stun overflow)', () => {
    const character = createMockCharacter({
      status: 'active',
      derivedStats: {
        stunConditionMonitor: 10,
      },
      condition: {
        physicalDamage: 0,
        stunDamage: 10, // At max
      },
    });

    const result = validateCharacterState(character);

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.UNCONSCIOUS);
  });

  it('should warn about wound penalties', () => {
    const character = createMockCharacter({
      status: 'active',
      derivedStats: {
        physicalConditionMonitor: 10,
        stunConditionMonitor: 10,
      },
      condition: {
        physicalDamage: 3, // -1 wound modifier
        stunDamage: 0,
      },
    });

    const result = validateCharacterState(character);

    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0].code).toBe('WOUNDED');
  });
});

// =============================================================================
// ACTION ECONOMY VALIDATION
// =============================================================================

describe('validateActionEconomy', () => {
  it('should pass for free action with available free actions', () => {
    const actions: ActionAllocation = {
      free: 999,
      simple: 2,
      complex: 1,
      interrupt: true,
    };

    const result = validateActionEconomy(actions, 'free');

    expect(result.valid).toBe(true);
  });

  it('should pass for simple action with available simple actions', () => {
    const actions: ActionAllocation = {
      free: 999,
      simple: 2,
      complex: 1,
      interrupt: true,
    };

    const result = validateActionEconomy(actions, 'simple');

    expect(result.valid).toBe(true);
  });

  it('should fail for simple action with no simple actions remaining', () => {
    const actions: ActionAllocation = {
      free: 999,
      simple: 0,
      complex: 0,
      interrupt: true,
    };

    const result = validateActionEconomy(actions, 'simple');

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.INSUFFICIENT_ACTIONS);
  });

  it('should pass for complex action with available complex action', () => {
    const actions: ActionAllocation = {
      free: 999,
      simple: 2,
      complex: 1,
      interrupt: true,
    };

    const result = validateActionEconomy(actions, 'complex');

    expect(result.valid).toBe(true);
  });

  it('should pass for complex action using two simple actions', () => {
    const actions: ActionAllocation = {
      free: 999,
      simple: 2,
      complex: 0, // No complex, but 2 simple available
      interrupt: true,
    };

    const result = validateActionEconomy(actions, 'complex');

    expect(result.valid).toBe(true);
  });

  it('should fail for complex action with insufficient actions', () => {
    const actions: ActionAllocation = {
      free: 999,
      simple: 1, // Only 1 simple
      complex: 0,
      interrupt: true,
    };

    const result = validateActionEconomy(actions, 'complex');

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.INSUFFICIENT_ACTIONS);
  });

  it('should pass for interrupt action when available', () => {
    const actions: ActionAllocation = {
      free: 999,
      simple: 0,
      complex: 0,
      interrupt: true,
    };

    const result = validateActionEconomy(actions, 'interrupt');

    expect(result.valid).toBe(true);
  });

  it('should fail for interrupt action when already used', () => {
    const actions: ActionAllocation = {
      free: 999,
      simple: 2,
      complex: 1,
      interrupt: false, // Already used
    };

    const result = validateActionEconomy(actions, 'interrupt');

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.INTERRUPT_UNAVAILABLE);
  });
});

// =============================================================================
// PREREQUISITE VALIDATION
// =============================================================================

describe('validatePrerequisites', () => {
  it('should pass with no prerequisites', () => {
    const character = createMockCharacter();
    const result = validatePrerequisites(character, []);

    expect(result.valid).toBe(true);
  });

  it('should pass when skill prerequisite is met', () => {
    const character = createMockCharacter({
      skills: {
        pistols: 4,
      },
    });

    const result = validatePrerequisites(character, [
      { type: 'skill', requirement: 'pistols' },
    ]);

    expect(result.valid).toBe(true);
  });

  it('should fail when skill prerequisite is not met', () => {
    const character = createMockCharacter({
      skills: {},
    });

    const result = validatePrerequisites(character, [
      { type: 'skill', requirement: 'pistols' },
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.MISSING_SKILL);
  });

  it('should pass when skill rating prerequisite is met', () => {
    const character = createMockCharacter({
      skills: {
        pistols: 4,
      },
    });

    const result = validatePrerequisites(character, [
      { type: 'skill_rating', requirement: 'pistols', minimumValue: 3 },
    ]);

    expect(result.valid).toBe(true);
  });

  it('should fail when skill rating is too low', () => {
    const character = createMockCharacter({
      skills: {
        pistols: 2,
      },
    });

    const result = validatePrerequisites(character, [
      { type: 'skill_rating', requirement: 'pistols', minimumValue: 3 },
    ]);

    expect(result.valid).toBe(false);
  });

  it('should pass when attribute prerequisite is met', () => {
    const character = createMockCharacter({
      attributes: {
        agility: 4,
      },
    });

    const result = validatePrerequisites(character, [
      { type: 'attribute', requirement: 'agility' },
    ]);

    expect(result.valid).toBe(true);
  });

  it('should pass when magic prerequisite is met for awakened', () => {
    const character = createMockCharacter({
      attributes: {
        magic: 5,
      },
    });

    const result = validatePrerequisites(character, [
      { type: 'magic', requirement: 'awakened' },
    ]);

    expect(result.valid).toBe(true);
  });

  it('should fail when magic prerequisite is not met for mundane', () => {
    const character = createMockCharacter({
      attributes: {
        magic: 0,
      },
    });

    const result = validatePrerequisites(character, [
      { type: 'magic', requirement: 'awakened' },
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.NOT_AWAKENED);
  });

  it('should handle negated prerequisites', () => {
    const character = createMockCharacter({
      attributes: {
        magic: 0, // Mundane
      },
    });

    // Negated - must NOT have magic
    const result = validatePrerequisites(character, [
      { type: 'magic', requirement: 'awakened', negated: true },
    ]);

    expect(result.valid).toBe(true);
  });
});

// =============================================================================
// COMBAT CONTEXT VALIDATION
// =============================================================================

describe('validateCombatContext', () => {
  it('should pass for active combat with valid participant', () => {
    const participant = createMockParticipant();
    const session = createMockCombatSession({
      status: 'active',
      participants: [participant],
    });

    const result = validateCombatContext(session, participant.id);

    expect(result.valid).toBe(true);
  });

  it('should fail for completed combat', () => {
    const session = createMockCombatSession({
      status: 'completed',
    });

    const result = validateCombatContext(session, 'any-id');

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.NO_COMBAT_SESSION);
  });

  it('should fail for paused combat', () => {
    const session = createMockCombatSession({
      status: 'paused',
    });

    const result = validateCombatContext(session, 'any-id');

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.COMBAT_PAUSED);
  });

  it('should fail for participant not in session', () => {
    const session = createMockCombatSession({
      status: 'active',
      participants: [],
    });

    const result = validateCombatContext(session, 'not-in-session');

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.NOT_IN_COMBAT);
  });

  it('should fail for incapacitated participant', () => {
    const participant = createMockParticipant({
      status: 'out',
    });
    const session = createMockCombatSession({
      status: 'active',
      participants: [participant],
    });

    const result = validateCombatContext(session, participant.id);

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.INCAPACITATED);
  });
});

// =============================================================================
// STATE MODIFIER CALCULATION
// =============================================================================

describe('calculateStateModifiers', () => {
  it('should include wound modifier for damaged character', () => {
    const character = createMockCharacter({
      condition: {
        physicalDamage: 6, // -2 wound modifier
        stunDamage: 0,
      },
    });
    const action = createMockActionDefinition();

    const modifiers = calculateStateModifiers(character, action);

    const woundMod = modifiers.find((m) => m.source === 'wound');
    expect(woundMod).toBeDefined();
    expect(woundMod?.value).toBeLessThan(0);
  });

  it('should include no wound modifier for undamaged character', () => {
    const character = createMockCharacter({
      condition: {
        physicalDamage: 0,
        stunDamage: 0,
      },
    });
    const action = createMockActionDefinition();

    const modifiers = calculateStateModifiers(character, action);

    const woundMod = modifiers.find((m) => m.source === 'wound');
    expect(woundMod).toBeUndefined();
  });

  it('should include condition modifiers from combat session', () => {
    const character = createMockCharacter();
    const action = createMockActionDefinition();
    const participant = createMockParticipant({
      conditions: [
        {
          id: 'prone',
          name: 'Prone',
          description: 'Character is lying on the ground',
          poolModifier: -2,
        },
      ],
    });
    const session = createMockCombatSession({
      participants: [participant],
    });

    const modifiers = calculateStateModifiers(
      character,
      action,
      session,
      participant.id
    );

    const conditionMod = modifiers.find((m) => m.description === 'Prone');
    expect(conditionMod).toBeDefined();
    expect(conditionMod?.value).toBe(-2);
  });

  it('should include visibility modifiers from environment', () => {
    const character = createMockCharacter();
    const action = createMockActionDefinition();
    const session = createMockCombatSession({
      environment: {
        visibility: 'dark',
      },
      participants: [createMockParticipant()],
    });

    const modifiers = calculateStateModifiers(
      character,
      action,
      session,
      'test-participant'
    );

    const visibilityMod = modifiers.find((m) =>
      m.description.includes('Visibility')
    );
    expect(visibilityMod).toBeDefined();
    expect(visibilityMod?.value).toBe(-3); // Dark = -3
  });
});

// =============================================================================
// FULL ACTION VALIDATION
// =============================================================================

describe('validateAction', () => {
  it('should pass for valid action outside combat', () => {
    const character = createMockCharacter({
      status: 'active',
      skills: {
        perception: 4,
      },
      attributes: {
        intuition: 4,
      },
    });
    const action = createMockActionDefinition({
      rollConfig: {
        skill: 'perception',
        attribute: 'intuition',
      },
    });

    const result = validateAction(character, action);

    expect(result.valid).toBe(true);
    expect(result.modifiedPool).toBeDefined();
  });

  it('should fail for action with unmet prerequisites', () => {
    const character = createMockCharacter({
      status: 'active',
      skills: {},
    });
    const action = createMockActionDefinition({
      prerequisites: [
        { type: 'skill', requirement: 'spellcasting' },
        { type: 'magic', requirement: 'awakened' },
      ],
    });

    const result = validateAction(character, action);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should include pool in successful validation', () => {
    const character = createMockCharacter({
      status: 'active',
      skills: {
        pistols: 4,
      },
      attributes: {
        agility: 5,
      },
    });
    const action = createMockActionDefinition({
      rollConfig: {
        skill: 'pistols',
        attribute: 'agility',
      },
    });

    const result = validateAction(character, action);

    expect(result.valid).toBe(true);
    expect(result.modifiedPool).toBeDefined();
    expect(result.modifiedPool?.totalDice).toBe(9); // 4 + 5
  });

  it('should warn about low dice pools', () => {
    const character = createMockCharacter({
      status: 'active',
      skills: {
        pistols: 1,
      },
      attributes: {
        agility: 1,
      },
    });
    const action = createMockActionDefinition({
      rollConfig: {
        skill: 'pistols',
        attribute: 'agility',
      },
    });

    const result = validateAction(character, action);

    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.code === 'LOW_POOL')).toBe(true);
  });
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

describe('canPerformAction', () => {
  it('should return true for valid action', () => {
    const character = createMockCharacter({
      status: 'active',
    });
    const action = createMockActionDefinition();

    const result = canPerformAction(character, action);

    expect(result).toBe(true);
  });

  it('should return false for invalid action', () => {
    const character = createMockCharacter({
      status: 'deceased',
    });
    const action = createMockActionDefinition();

    const result = canPerformAction(character, action);

    expect(result).toBe(false);
  });
});

describe('getActionBlockers', () => {
  it('should return empty array for valid action', () => {
    const character = createMockCharacter({
      status: 'active',
    });
    const action = createMockActionDefinition();

    const blockers = getActionBlockers(character, action);

    expect(blockers).toHaveLength(0);
  });

  it('should return blocker messages for invalid action', () => {
    const character = createMockCharacter({
      status: 'active',
      skills: {},
    });
    const action = createMockActionDefinition({
      prerequisites: [{ type: 'skill', requirement: 'hacking' }],
    });

    const blockers = getActionBlockers(character, action);

    expect(blockers.length).toBeGreaterThan(0);
    expect(blockers[0]).toContain('skill');
  });
});

// =============================================================================
// COMBAT TURN VALIDATION
// =============================================================================

describe('validateActionEligibility with combat context', () => {
  it('should fail when not participants turn for non-interrupt action', () => {
    const character = createMockCharacter({
      status: 'active',
    });
    const participant1 = createMockParticipant({
      id: 'participant-1',
      entityId: 'character-1',
    });
    const participant2 = createMockParticipant({
      id: 'participant-2',
      entityId: 'character-2',
    });
    const session = createMockCombatSession({
      participants: [participant1, participant2],
      initiativeOrder: ['participant-1', 'participant-2'],
      currentTurn: 0, // participant-1's turn
    });
    const action = createMockActionDefinition({
      type: 'simple', // Not an interrupt
    });

    const result = validateActionEligibility(
      character,
      action,
      session,
      'participant-2' // Trying to act when it's participant-1's turn
    );

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe(ValidationErrorCodes.NOT_YOUR_TURN);
  });

  it('should pass for interrupt action when not your turn', () => {
    const character = createMockCharacter({
      status: 'active',
    });
    const participant = createMockParticipant();
    const session = createMockCombatSession({
      participants: [
        createMockParticipant({ id: 'other' }),
        participant,
      ],
      initiativeOrder: ['other', participant.id],
      currentTurn: 0, // other's turn
    });
    const action = createMockActionDefinition({
      type: 'interrupt', // Interrupt can be used out of turn
    });

    const result = validateActionEligibility(
      character,
      action,
      session,
      participant.id
    );

    expect(result.valid).toBe(true);
  });

  it('should pass for free action when not your turn', () => {
    const character = createMockCharacter({
      status: 'active',
    });
    const participant = createMockParticipant();
    const session = createMockCombatSession({
      participants: [
        createMockParticipant({ id: 'other' }),
        participant,
      ],
      initiativeOrder: ['other', participant.id],
      currentTurn: 0,
    });
    const action = createMockActionDefinition({
      type: 'free',
    });

    const result = validateActionEligibility(
      character,
      action,
      session,
      participant.id
    );

    expect(result.valid).toBe(true);
  });
});
