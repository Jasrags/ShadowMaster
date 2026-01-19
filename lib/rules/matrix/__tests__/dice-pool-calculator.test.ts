import { describe, it, expect } from "vitest";
import {
  getPersonaAttribute,
  calculateMatrixLimit,
  calculateProgramBonus,
  calculateNoiseModifier,
  calculateRunningSilentModifier,
  calculateHotSimBonus,
  calculateMatrixDicePool,
  buildHackOnTheFlyPool,
  buildBruteForcePool,
  buildMatrixPerceptionPool,
  buildDataSpikePool,
  buildEditFilePool,
  buildSnoopPool,
  buildMatrixDefensePool,
  buildMatrixResistancePool,
} from "../dice-pool-calculator";
import type { MatrixAction, MatrixState, LoadedProgram } from "@/lib/types/matrix";
import type { ISODateString } from "@/lib/types";
import { OVERWATCH_THRESHOLD } from "@/lib/types/matrix";
import { createMockCharacter } from "@/__tests__/mocks/storage";

// =============================================================================
// MOCK HELPERS
// =============================================================================

function createMockMatrixState(overrides?: Partial<MatrixState>): MatrixState {
  return {
    isConnected: true,
    connectionMode: "cold-sim-vr",
    activeDeviceId: "deck-1",
    activeDeviceType: "cyberdeck",
    persona: {
      personaId: "persona-1",
      attack: 6,
      sleaze: 5,
      dataProcessing: 4,
      firewall: 3,
      deviceRating: 4,
    },
    loadedPrograms: [],
    programSlotsUsed: 0,
    programSlotsMax: 5,
    matrixConditionMonitor: 12,
    matrixDamageTaken: 0,
    overwatchScore: 0,
    overwatchThreshold: OVERWATCH_THRESHOLD,
    overwatchConverged: false,
    marksHeld: [],
    marksReceived: [],
    ...overrides,
  };
}

function createMockMatrixAction(overrides?: Partial<MatrixAction>): MatrixAction {
  return {
    id: "test-action",
    name: "Test Action",
    category: "attack",
    legality: "illegal",
    marksRequired: 0,
    limitAttribute: "attack",
    skill: "hacking",
    attribute: "logic",
    ...overrides,
  };
}

function createMockLoadedProgram(overrides?: Partial<LoadedProgram>): LoadedProgram {
  return {
    programId: "prog-1",
    catalogId: "exploit",
    name: "Exploit",
    category: "hacking",
    isRunning: true,
    ...overrides,
  };
}

function createCharacterWithSkills() {
  return createMockCharacter({
    attributes: {
      logic: 5,
      intuition: 4,
      willpower: 4,
    },
    skills: {
      hacking: 6,
      cybercombat: 5,
      computer: 4,
      "electronic-warfare": 3,
    },
    cyberdecks: [
      {
        id: "deck-1",
        catalogId: "erika-mcd-1",
        name: "Erika MCD-1",
        deviceRating: 4,
        attributeArray: [6, 5, 4, 3],
        currentConfig: {
          attack: 6,
          sleaze: 5,
          dataProcessing: 4,
          firewall: 3,
        },
        programSlots: 5,
        loadedPrograms: [],
        cost: 49500,
        availability: 6,
      },
    ],
  });
}

// =============================================================================
// TESTS
// =============================================================================

describe("dice-pool-calculator", () => {
  describe("getPersonaAttribute", () => {
    it("should return attack attribute", () => {
      const state = createMockMatrixState({
        persona: { ...createMockMatrixState().persona, attack: 7 },
      });
      expect(getPersonaAttribute(state, "attack")).toBe(7);
    });

    it("should return sleaze attribute", () => {
      const state = createMockMatrixState({
        persona: { ...createMockMatrixState().persona, sleaze: 6 },
      });
      expect(getPersonaAttribute(state, "sleaze")).toBe(6);
    });

    it("should return dataProcessing attribute", () => {
      const state = createMockMatrixState({
        persona: { ...createMockMatrixState().persona, dataProcessing: 5 },
      });
      expect(getPersonaAttribute(state, "dataProcessing")).toBe(5);
    });

    it("should return firewall attribute", () => {
      const state = createMockMatrixState({
        persona: { ...createMockMatrixState().persona, firewall: 4 },
      });
      expect(getPersonaAttribute(state, "firewall")).toBe(4);
    });
  });

  describe("calculateMatrixLimit", () => {
    it("should return correct limit based on action limit attribute", () => {
      const state = createMockMatrixState({
        persona: {
          personaId: "p1",
          attack: 7,
          sleaze: 6,
          dataProcessing: 5,
          firewall: 4,
          deviceRating: 4,
        },
      });

      const attackAction = createMockMatrixAction({ limitAttribute: "attack" });
      const sleazeAction = createMockMatrixAction({ limitAttribute: "sleaze" });
      const dpAction = createMockMatrixAction({ limitAttribute: "dataProcessing" });
      const fwAction = createMockMatrixAction({ limitAttribute: "firewall" });

      expect(calculateMatrixLimit(attackAction, state)).toBe(7);
      expect(calculateMatrixLimit(sleazeAction, state)).toBe(6);
      expect(calculateMatrixLimit(dpAction, state)).toBe(5);
      expect(calculateMatrixLimit(fwAction, state)).toBe(4);
    });
  });

  describe("calculateProgramBonus", () => {
    it("should return null when no relevant programs", () => {
      const action = createMockMatrixAction({ relevantPrograms: undefined });
      const state = createMockMatrixState();

      expect(calculateProgramBonus(action, state)).toBeNull();
    });

    it("should return null when relevant programs not loaded", () => {
      const action = createMockMatrixAction({ relevantPrograms: ["exploit", "stealth"] });
      const state = createMockMatrixState();

      expect(calculateProgramBonus(action, state)).toBeNull();
    });

    it("should return +2 bonus for standard loaded program", () => {
      const action = createMockMatrixAction({ relevantPrograms: ["exploit"] });
      const state = createMockMatrixState({
        loadedPrograms: [createMockLoadedProgram({ catalogId: "exploit", isRunning: true })],
      });

      const bonus = calculateProgramBonus(action, state);

      expect(bonus).not.toBeNull();
      expect(bonus!.value).toBe(2);
      expect(bonus!.description).toContain("Exploit");
    });

    it("should return rating bonus for agent programs", () => {
      const action = createMockMatrixAction({ relevantPrograms: ["agent-helper"] });
      const state = createMockMatrixState({
        loadedPrograms: [
          createMockLoadedProgram({
            catalogId: "agent-helper",
            name: "Agent Helper",
            category: "agent",
            rating: 5,
            isRunning: true,
          }),
        ],
      });

      const bonus = calculateProgramBonus(action, state);

      expect(bonus!.value).toBe(5);
    });

    it("should not count programs that are not running", () => {
      const action = createMockMatrixAction({ relevantPrograms: ["exploit"] });
      const state = createMockMatrixState({
        loadedPrograms: [createMockLoadedProgram({ catalogId: "exploit", isRunning: false })],
      });

      expect(calculateProgramBonus(action, state)).toBeNull();
    });

    it("should stack bonuses from multiple relevant programs", () => {
      const action = createMockMatrixAction({ relevantPrograms: ["exploit", "stealth"] });
      const state = createMockMatrixState({
        loadedPrograms: [
          createMockLoadedProgram({ catalogId: "exploit", name: "Exploit", isRunning: true }),
          createMockLoadedProgram({ catalogId: "stealth", name: "Stealth", isRunning: true }),
        ],
      });

      const bonus = calculateProgramBonus(action, state);

      expect(bonus!.value).toBe(4); // 2 + 2
    });
  });

  describe("calculateNoiseModifier", () => {
    it("should return null when noise is 0", () => {
      expect(calculateNoiseModifier(0)).toBeNull();
    });

    it("should return null when noise is negative", () => {
      expect(calculateNoiseModifier(-1)).toBeNull();
    });

    it("should return negative modifier equal to noise rating", () => {
      const mod = calculateNoiseModifier(3);

      expect(mod).not.toBeNull();
      expect(mod!.value).toBe(-3);
      expect(mod!.source).toBe("environmental");
    });
  });

  describe("calculateRunningSilentModifier", () => {
    it("should return null when not running silent", () => {
      expect(calculateRunningSilentModifier(false)).toBeNull();
    });

    it("should return -2 when running silent", () => {
      const mod = calculateRunningSilentModifier(true);

      expect(mod).not.toBeNull();
      expect(mod!.value).toBe(-2);
      expect(mod!.description).toContain("Running Silent");
    });
  });

  describe("calculateHotSimBonus", () => {
    it("should return null for AR mode", () => {
      const state = createMockMatrixState({ connectionMode: "ar" });
      expect(calculateHotSimBonus(state)).toBeNull();
    });

    it("should return null for cold-sim VR", () => {
      const state = createMockMatrixState({ connectionMode: "cold-sim-vr" });
      expect(calculateHotSimBonus(state)).toBeNull();
    });

    it("should return +2 for hot-sim VR", () => {
      const state = createMockMatrixState({ connectionMode: "hot-sim-vr" });

      const bonus = calculateHotSimBonus(state);

      expect(bonus).not.toBeNull();
      expect(bonus!.value).toBe(2);
      expect(bonus!.description).toContain("Hot-Sim");
    });
  });

  describe("calculateMatrixDicePool", () => {
    it("should calculate base pool from skill and attribute", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();
      const action = createMockMatrixAction({
        skill: "hacking",
        attribute: "logic",
        limitAttribute: "attack",
      });

      const result = calculateMatrixDicePool(character, state, action);

      // Hacking 6 + Logic 5 = 11
      expect(result.pool.basePool).toBe(11);
      expect(result.breakdown.some((b) => b.attribute === "logic")).toBe(true);
      expect(result.breakdown.some((b) => b.skill === "hacking")).toBe(true);
    });

    it("should apply ASDF limit", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();
      const action = createMockMatrixAction({ limitAttribute: "sleaze" });

      const result = calculateMatrixDicePool(character, state, action);

      expect(result.limit).toBe(5); // Sleaze from state
      expect(result.limitType).toBe("sleaze");
      expect(result.limitSource).toBe("Sleaze");
    });

    it("should include hot-sim bonus", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState({ connectionMode: "hot-sim-vr" });
      const action = createMockMatrixAction();

      const result = calculateMatrixDicePool(character, state, action);

      expect(result.pool.modifiers.some((m) => m.description === "Hot-Sim VR")).toBe(true);
      expect(result.breakdown.some((b) => b.source === "Hot-Sim VR")).toBe(true);
    });

    it("should apply noise penalty", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();
      const action = createMockMatrixAction();

      const result = calculateMatrixDicePool(character, state, action, { noiseRating: 3 });

      expect(result.pool.modifiers.some((m) => m.value === -3)).toBe(true);
      expect(result.breakdown.some((b) => b.source === "Noise")).toBe(true);
    });

    it("should apply running silent penalty", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();
      const action = createMockMatrixAction();

      const result = calculateMatrixDicePool(character, state, action, { isRunningSilent: true });

      expect(result.pool.modifiers.some((m) => m.value === -2)).toBe(true);
      expect(result.breakdown.some((b) => b.source === "Running Silent")).toBe(true);
    });

    it("should include program bonuses", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState({
        loadedPrograms: [createMockLoadedProgram({ catalogId: "exploit" })],
      });
      const action = createMockMatrixAction({ relevantPrograms: ["exploit"] });

      const result = calculateMatrixDicePool(character, state, action);

      expect(result.pool.modifiers.some((m) => m.description?.includes("Programs"))).toBe(true);
      expect(result.breakdown.some((b) => b.source === "Programs")).toBe(true);
    });

    it("should generate formula string", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();
      const action = createMockMatrixAction({
        skill: "hacking",
        attribute: "logic",
      });

      const result = calculateMatrixDicePool(character, state, action);

      expect(result.formula).toContain("logic");
      expect(result.formula).toContain("hacking");
    });
  });

  describe("buildHackOnTheFlyPool", () => {
    it("should use hacking + logic with sleaze limit", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();

      const result = buildHackOnTheFlyPool(character, state);

      expect(result.limitType).toBe("sleaze");
      expect(result.formula).toContain("hacking");
      expect(result.formula).toContain("logic");
    });
  });

  describe("buildBruteForcePool", () => {
    it("should use cybercombat + logic with attack limit", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();

      const result = buildBruteForcePool(character, state);

      expect(result.limitType).toBe("attack");
      expect(result.formula).toContain("cybercombat");
      expect(result.formula).toContain("logic");
    });
  });

  describe("buildMatrixPerceptionPool", () => {
    it("should use computer + intuition with dataProcessing limit", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();

      const result = buildMatrixPerceptionPool(character, state);

      expect(result.limitType).toBe("dataProcessing");
      expect(result.formula).toContain("computer");
      expect(result.formula).toContain("intuition");
    });
  });

  describe("buildDataSpikePool", () => {
    it("should use cybercombat + logic with attack limit", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();

      const result = buildDataSpikePool(character, state);

      expect(result.limitType).toBe("attack");
      expect(result.formula).toContain("cybercombat");
    });
  });

  describe("buildEditFilePool", () => {
    it("should use computer + logic with dataProcessing limit", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();

      const result = buildEditFilePool(character, state);

      expect(result.limitType).toBe("dataProcessing");
      expect(result.formula).toContain("computer");
      expect(result.formula).toContain("logic");
    });
  });

  describe("buildSnoopPool", () => {
    it("should use electronic-warfare + intuition with sleaze limit", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState();

      const result = buildSnoopPool(character, state);

      expect(result.limitType).toBe("sleaze");
      expect(result.formula).toContain("electronic-warfare");
      expect(result.formula).toContain("intuition");
    });
  });

  describe("buildMatrixDefensePool", () => {
    it("should use willpower + firewall", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState({
        persona: {
          personaId: "p1",
          attack: 6,
          sleaze: 5,
          dataProcessing: 4,
          firewall: 3,
          deviceRating: 4,
        },
      });

      const pool = buildMatrixDefensePool(character, state);

      // Willpower 4 + Firewall 3 = 7
      expect(pool.basePool).toBe(7);
      expect(pool.attribute).toBe("willpower");
    });
  });

  describe("buildMatrixResistancePool", () => {
    it("should use willpower + firewall for persona", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState({
        persona: {
          personaId: "p1",
          attack: 6,
          sleaze: 5,
          dataProcessing: 4,
          firewall: 3,
          deviceRating: 4,
        },
      });

      const pool = buildMatrixResistancePool(character, state, false);

      // Willpower 4 + Firewall 3 = 7
      expect(pool.basePool).toBe(7);
    });

    it("should use device rating x2 for device resistance", () => {
      const character = createCharacterWithSkills();
      const state = createMockMatrixState({
        persona: {
          personaId: "p1",
          attack: 6,
          sleaze: 5,
          dataProcessing: 4,
          firewall: 3,
          deviceRating: 4,
        },
      });

      const pool = buildMatrixResistancePool(character, state, true);

      // Device Rating 4 * 2 = 8
      expect(pool.basePool).toBe(8);
    });
  });
});
