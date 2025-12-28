/**
 * Drain Application Tests
 */

import { describe, it, expect } from "vitest";
import {
  applyDrain,
  checkBurnoutRisk,
  wouldIncapacitate,
  createDrainSession,
  recordDrainEvent,
  getDrainSessionSummary,
  estimateResistanceHits,
  formatDamageCondition,
} from "../drain-application";
import type { Character } from "@/lib/types/character";
import type { DrainResult } from "@/lib/types/magic";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockCharacter(
  overrides: Partial<Character> = {}
): Partial<Character> {
  return {
    id: "test-character",
    name: "Test Character",
    attributes: {
      body: 4,       // Physical track = 10
      agility: 4,
      reaction: 3,
      strength: 2,
      willpower: 4,  // Stun track = 10
      logic: 5,
      intuition: 3,
      charisma: 3,
    },
    ...overrides,
  };
}

function createMockDrainResult(overrides: Partial<DrainResult> = {}): DrainResult {
  return {
    drainValue: 5,
    drainType: "stun",
    resistancePool: 9,
    drainFormula: "F-1",
    ...overrides,
  };
}

// =============================================================================
// APPLY DRAIN
// =============================================================================

describe("applyDrain", () => {
  it("should apply stun drain correctly", () => {
    const character = createMockCharacter();
    const drainResult = createMockDrainResult({
      drainValue: 5,
      drainType: "stun",
    });

    const result = applyDrain(character, drainResult, 2);

    // Net drain = 5 - 2 = 3
    expect(result.damageApplied).toBe(3);
    expect(result.damageType).toBe("stun");
    expect(result.characterCondition.stunDamage).toBe(3);
    expect(result.characterCondition.physicalDamage).toBe(0);
  });

  it("should apply physical drain correctly", () => {
    const character = createMockCharacter();
    const drainResult = createMockDrainResult({
      drainValue: 7,
      drainType: "physical",
    });

    const result = applyDrain(character, drainResult, 3);

    // Net drain = 7 - 3 = 4
    expect(result.damageApplied).toBe(4);
    expect(result.damageType).toBe("physical");
    expect(result.characterCondition.physicalDamage).toBe(4);
  });

  it("should apply no damage if resistance >= drain", () => {
    const character = createMockCharacter();
    const drainResult = createMockDrainResult({
      drainValue: 3,
      drainType: "stun",
    });

    const result = applyDrain(character, drainResult, 5);

    expect(result.damageApplied).toBe(0);
    expect(result.characterCondition.stunDamage).toBe(0);
  });

  it("should calculate wound modifier correctly", () => {
    const character = createMockCharacter();
    const drainResult = createMockDrainResult({
      drainValue: 6,
      drainType: "stun",
    });

    const result = applyDrain(character, drainResult, 0);

    // 6 damage -> -2 wound modifier (6/3 = 2)
    expect(result.characterCondition.woundModifier).toBe(-2);
  });

  it("should handle stun overflow to physical", () => {
    const character = createMockCharacter();
    const drainResult = createMockDrainResult({
      drainValue: 15,
      drainType: "stun",
    });

    // Start with 8 stun damage already
    const result = applyDrain(character, drainResult, 0, { stun: 8, physical: 0 });

    // 15 more stun on top of 8 = 23 stun
    // Stun track is 10, overflow of 13 goes to physical
    expect(result.characterCondition.stunDamage).toBe(10);
    expect(result.characterCondition.physicalDamage).toBe(13);
    expect(result.unconscious).toBe(true);
  });

  it("should detect dying condition", () => {
    const character = createMockCharacter();
    const drainResult = createMockDrainResult({
      drainValue: 15,
      drainType: "physical",
    });

    const result = applyDrain(character, drainResult, 0, { stun: 0, physical: 0 });

    // Physical track is 10, 15 damage causes overflow
    expect(result.dying).toBe(true);
    expect(result.overflowDamage).toBe(5);
  });

  it("should set burnout warning when close to incapacitation", () => {
    const character = createMockCharacter();
    const drainResult = createMockDrainResult({
      drainValue: 3,
      drainType: "stun",
    });

    // Start with 6 stun (only 4 remaining)
    const result = applyDrain(character, drainResult, 0, { stun: 6, physical: 0 });

    // After 3 more: 9 stun (only 1 remaining) -> within 3 of track
    expect(result.burnoutWarning).toBe(true);
  });
});

// =============================================================================
// CHECK BURNOUT RISK
// =============================================================================

describe("checkBurnoutRisk", () => {
  it("should return true when close to stun incapacitation", () => {
    const result = checkBurnoutRisk(
      { stun: 8, physical: 0 },
      { stunTrack: 10, physicalTrack: 10 }
    );
    expect(result).toBe(true);
  });

  it("should return true when close to physical incapacitation", () => {
    const result = checkBurnoutRisk(
      { stun: 0, physical: 8 },
      { stunTrack: 10, physicalTrack: 10 }
    );
    expect(result).toBe(true);
  });

  it("should return false when plenty of track remaining", () => {
    const result = checkBurnoutRisk(
      { stun: 3, physical: 2 },
      { stunTrack: 10, physicalTrack: 10 }
    );
    expect(result).toBe(false);
  });
});

// =============================================================================
// WOULD INCAPACITATE
// =============================================================================

describe("wouldIncapacitate", () => {
  it("should predict stun incapacitation", () => {
    const character = createMockCharacter();
    // Stun track = 10, pending 12 stun with expected 0 resistance
    const result = wouldIncapacitate(character, 12, "stun", 0);
    expect(result).toBe(true);
  });

  it("should account for expected resistance", () => {
    const character = createMockCharacter();
    // Stun track = 10, pending 12 with expected 3 resistance = 9 net
    const result = wouldIncapacitate(character, 12, "stun", 3);
    expect(result).toBe(false);
  });
});

// =============================================================================
// DRAIN SESSION MANAGEMENT
// =============================================================================

describe("createDrainSession", () => {
  it("should create a new session", () => {
    const session = createDrainSession("session-1", "char-1");

    expect(session.sessionId).toBe("session-1");
    expect(session.characterId).toBe("char-1");
    expect(session.drainHistory).toHaveLength(0);
    expect(session.totalDrainTaken).toBe(0);
  });
});

describe("recordDrainEvent", () => {
  it("should add event to session", () => {
    let session = createDrainSession("session-1", "char-1");
    
    session = recordDrainEvent(session, {
      action: "spellcasting",
      drainValue: 5,
      drainType: "stun",
      resistanceHits: 2,
      damageApplied: 3,
      spellId: "fireball",
      force: 5,
    });

    expect(session.drainHistory).toHaveLength(1);
    expect(session.totalDrainTaken).toBe(3);
    expect(session.drainHistory[0].action).toBe("spellcasting");
  });

  it("should accumulate drain across events", () => {
    let session = createDrainSession("session-1", "char-1");
    
    session = recordDrainEvent(session, {
      action: "spellcasting",
      drainValue: 5,
      drainType: "stun",
      resistanceHits: 2,
      damageApplied: 3,
    });
    
    session = recordDrainEvent(session, {
      action: "summoning",
      drainValue: 4,
      drainType: "stun",
      resistanceHits: 2,
      damageApplied: 2,
    });

    expect(session.totalDrainTaken).toBe(5);
    expect(session.drainHistory).toHaveLength(2);
  });
});

describe("getDrainSessionSummary", () => {
  it("should summarize session statistics", () => {
    let session = createDrainSession("session-1", "char-1");
    
    session = recordDrainEvent(session, {
      action: "spellcasting",
      drainValue: 5,
      drainType: "stun",
      resistanceHits: 2,
      damageApplied: 3,
    });
    
    session = recordDrainEvent(session, {
      action: "summoning",
      drainValue: 8,
      drainType: "physical",
      resistanceHits: 3,
      damageApplied: 5,
    });

    const summary = getDrainSessionSummary(session);

    expect(summary.totalDrainTaken).toBe(8);
    expect(summary.stunDrainTaken).toBe(3);
    expect(summary.physicalDrainTaken).toBe(5);
    expect(summary.drainEvents).toBe(2);
    expect(summary.averageDrainPerEvent).toBe(4);
  });
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

describe("estimateResistanceHits", () => {
  it("should estimate hits as pool / 3", () => {
    expect(estimateResistanceHits(9)).toBe(3);
    expect(estimateResistanceHits(12)).toBe(4);
    expect(estimateResistanceHits(5)).toBe(1);
  });
});

describe("formatDamageCondition", () => {
  it("should format healthy condition", () => {
    const result = formatDamageCondition({
      stunDamage: 0,
      physicalDamage: 0,
      woundModifier: 0,
    });
    expect(result).toBe("Healthy");
  });

  it("should format stun damage", () => {
    const result = formatDamageCondition({
      stunDamage: 3,
      physicalDamage: 0,
      woundModifier: -1,
    });
    expect(result).toBe("3S, -1 WM");
  });

  it("should format physical damage", () => {
    const result = formatDamageCondition({
      stunDamage: 0,
      physicalDamage: 5,
      woundModifier: -1,
    });
    expect(result).toBe("5P, -1 WM");
  });

  it("should format combined damage", () => {
    const result = formatDamageCondition({
      stunDamage: 4,
      physicalDamage: 3,
      woundModifier: -2,
    });
    expect(result).toBe("4S, 3P, -2 WM");
  });
});
