import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  rollOverwatchIncrease,
  calculateOverwatchIncrease,
  addOverwatchScore,
  checkConvergence,
  getOverwatchWarningLevel,
  calculateDumpshockDamage,
  handleConvergence,
  calculateTimeUntilAutoIncrease,
  shouldAutoIncreaseOS,
  getOverwatchStatusDescription,
} from "../overwatch-calculator";
import type { MatrixAction, MatrixState, MatrixMode } from "@/lib/types/matrix";
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
      attack: 5,
      sleaze: 4,
      dataProcessing: 3,
      firewall: 2,
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

// =============================================================================
// TESTS
// =============================================================================

describe("overwatch-calculator", () => {
  describe("rollOverwatchIncrease", () => {
    it("should return a value between 2 and 12 (2d6 range)", () => {
      // Run multiple times to verify range
      for (let i = 0; i < 100; i++) {
        const result = rollOverwatchIncrease();
        expect(result).toBeGreaterThanOrEqual(2);
        expect(result).toBeLessThanOrEqual(12);
      }
    });

    it("should produce varied results (not always same value)", () => {
      const results = new Set<number>();
      for (let i = 0; i < 100; i++) {
        results.add(rollOverwatchIncrease());
      }
      // With 100 rolls, we should get multiple different values
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe("calculateOverwatchIncrease", () => {
    it("should return 0 increase for legal actions", () => {
      const legalAction = createMockMatrixAction({ legality: "legal" });

      const result = calculateOverwatchIncrease(legalAction, "success", 10);

      expect(result.previousScore).toBe(10);
      expect(result.scoreAdded).toBe(0);
      expect(result.newScore).toBe(10);
      expect(result.convergenceTriggered).toBe(false);
    });

    it("should add OS for illegal actions (2-12 range)", () => {
      const illegalAction = createMockMatrixAction({ legality: "illegal" });

      const result = calculateOverwatchIncrease(illegalAction, "success", 0);

      expect(result.scoreAdded).toBeGreaterThanOrEqual(2);
      expect(result.scoreAdded).toBeLessThanOrEqual(12);
      expect(result.newScore).toBe(result.scoreAdded);
    });

    it("should add extra OS for critical glitches", () => {
      const illegalAction = createMockMatrixAction({ legality: "illegal" });

      // Run multiple times to get a sense of the range
      const results: number[] = [];
      for (let i = 0; i < 50; i++) {
        const result = calculateOverwatchIncrease(illegalAction, "critical_glitch", 0);
        results.push(result.scoreAdded);
      }

      // Critical glitch should add 2d6 + 2d6 = 4-24 range
      const min = Math.min(...results);
      const max = Math.max(...results);
      expect(min).toBeGreaterThanOrEqual(4); // 2+2 minimum
      expect(max).toBeLessThanOrEqual(24); // 12+12 maximum
    });

    it("should trigger convergence when reaching threshold", () => {
      const illegalAction = createMockMatrixAction({ legality: "illegal" });

      // Set OS to just below threshold
      const result = calculateOverwatchIncrease(illegalAction, "success", 38);

      // Even minimum roll of 2 would trigger convergence
      expect(result.convergenceTriggered).toBe(true);
      expect(result.newScore).toBeGreaterThanOrEqual(OVERWATCH_THRESHOLD);
    });

    it("should calculate correct convergence progress", () => {
      const legalAction = createMockMatrixAction({ legality: "legal" });

      const result = calculateOverwatchIncrease(legalAction, "success", 20);

      expect(result.convergenceProgress).toBe(50); // 20/40 * 100
    });

    it("should calculate convergence progress over 100% when OS exceeds threshold", () => {
      const legalAction = createMockMatrixAction({ legality: "legal" });

      // Note: For legal actions, the function calculates raw percentage
      // For illegal actions, it caps at 100% via addOverwatchScore internally
      const result = calculateOverwatchIncrease(legalAction, "success", 50);

      // 50/40 * 100 = 125%
      expect(result.convergenceProgress).toBe(125);
    });
  });

  describe("addOverwatchScore", () => {
    it("should add fixed score to current OS", () => {
      const result = addOverwatchScore(10, 5);

      expect(result.previousScore).toBe(10);
      expect(result.scoreAdded).toBe(5);
      expect(result.newScore).toBe(15);
    });

    it("should trigger convergence at threshold", () => {
      const result = addOverwatchScore(35, 5);

      expect(result.convergenceTriggered).toBe(true);
      expect(result.newScore).toBe(40);
    });

    it("should not trigger convergence below threshold", () => {
      const result = addOverwatchScore(30, 5);

      expect(result.convergenceTriggered).toBe(false);
      expect(result.newScore).toBe(35);
    });

    it("should calculate correct convergence progress", () => {
      const result = addOverwatchScore(0, 10);

      expect(result.convergenceProgress).toBe(25); // 10/40 * 100
    });
  });

  describe("checkConvergence", () => {
    it("should return true at default threshold (40)", () => {
      expect(checkConvergence(40)).toBe(true);
      expect(checkConvergence(45)).toBe(true);
    });

    it("should return false below default threshold", () => {
      expect(checkConvergence(39)).toBe(false);
      expect(checkConvergence(0)).toBe(false);
    });

    it("should respect custom threshold", () => {
      expect(checkConvergence(30, 30)).toBe(true);
      expect(checkConvergence(29, 30)).toBe(false);
      expect(checkConvergence(50, 60)).toBe(false);
      expect(checkConvergence(60, 60)).toBe(true);
    });
  });

  describe("getOverwatchWarningLevel", () => {
    it("should return 'safe' below 25%", () => {
      expect(getOverwatchWarningLevel(0)).toBe("safe");
      expect(getOverwatchWarningLevel(9)).toBe("safe");
    });

    it("should return 'caution' at 25-49%", () => {
      expect(getOverwatchWarningLevel(10)).toBe("caution");
      expect(getOverwatchWarningLevel(19)).toBe("caution");
    });

    it("should return 'warning' at 50-74%", () => {
      expect(getOverwatchWarningLevel(20)).toBe("warning");
      expect(getOverwatchWarningLevel(29)).toBe("warning");
    });

    it("should return 'danger' at 75-99%", () => {
      expect(getOverwatchWarningLevel(30)).toBe("danger");
      expect(getOverwatchWarningLevel(39)).toBe("danger");
    });

    it("should return 'critical' at 100%+", () => {
      expect(getOverwatchWarningLevel(40)).toBe("critical");
      expect(getOverwatchWarningLevel(50)).toBe("critical");
    });
  });

  describe("calculateDumpshockDamage", () => {
    it("should return no damage for AR mode", () => {
      const result = calculateDumpshockDamage("ar", 4);

      expect(result.amount).toBe(0);
      expect(result.type).toBeNull();
    });

    it("should return stun damage equal to device rating for cold-sim VR", () => {
      const result = calculateDumpshockDamage("cold-sim-vr", 4);

      expect(result.amount).toBe(4);
      expect(result.type).toBe("stun");
    });

    it("should return physical damage equal to device rating for hot-sim VR", () => {
      const result = calculateDumpshockDamage("hot-sim-vr", 4);

      expect(result.amount).toBe(4);
      expect(result.type).toBe("physical");
    });

    it("should scale damage with device rating", () => {
      expect(calculateDumpshockDamage("hot-sim-vr", 2).amount).toBe(2);
      expect(calculateDumpshockDamage("hot-sim-vr", 6).amount).toBe(6);
    });
  });

  describe("handleConvergence", () => {
    it("should return dumpshock for cold-sim VR", () => {
      const character = createMockCharacter();
      const matrixState = createMockMatrixState({
        connectionMode: "cold-sim-vr",
        overwatchScore: 45,
      });

      const result = handleConvergence(character, matrixState);

      expect(result.osReset).toBe(true);
      expect(result.personaDestroyed).toBe(true);
      expect(result.dumpshockTriggered).toBe(true);
      expect(result.damageType).toBe("stun");
      expect(result.damageDealt).toBe(4); // device rating
    });

    it("should return physical damage for hot-sim VR", () => {
      const character = createMockCharacter();
      const matrixState = createMockMatrixState({
        connectionMode: "hot-sim-vr",
        overwatchScore: 45,
      });

      const result = handleConvergence(character, matrixState);

      expect(result.dumpshockTriggered).toBe(true);
      expect(result.damageType).toBe("physical");
    });

    it("should not trigger dumpshock for AR", () => {
      const character = createMockCharacter();
      const matrixState = createMockMatrixState({
        connectionMode: "ar",
        overwatchScore: 45,
      });

      const result = handleConvergence(character, matrixState);

      expect(result.dumpshockTriggered).toBe(false);
      expect(result.damageDealt).toBeUndefined();
      expect(result.damageType).toBeUndefined();
    });

    it("should dispatch Patrol IC at base convergence (40)", () => {
      const character = createMockCharacter();
      const matrixState = createMockMatrixState({ overwatchScore: 40 });

      const result = handleConvergence(character, matrixState);

      expect(result.icDispatched.length).toBe(1);
      expect(result.icDispatched[0].icType).toBe("Patrol IC");
      expect(result.icDispatched[0].rating).toBe(4);
    });

    it("should dispatch additional IC at higher OS", () => {
      const character = createMockCharacter();
      const matrixState50 = createMockMatrixState({ overwatchScore: 50 });
      const matrixState60 = createMockMatrixState({ overwatchScore: 60 });
      const matrixState70 = createMockMatrixState({ overwatchScore: 70 });

      const result50 = handleConvergence(character, matrixState50);
      const result60 = handleConvergence(character, matrixState60);
      const result70 = handleConvergence(character, matrixState70);

      expect(result50.icDispatched.length).toBe(2); // Patrol + Probe
      expect(result60.icDispatched.length).toBe(3); // + Track
      expect(result70.icDispatched.length).toBe(4); // + Black IC
    });

    it("should dispatch Black IC at very high OS (70+)", () => {
      const character = createMockCharacter();
      const matrixState = createMockMatrixState({ overwatchScore: 70 });

      const result = handleConvergence(character, matrixState);

      const blackIC = result.icDispatched.find((ic) => ic.icType === "Black IC");
      expect(blackIC).toBeDefined();
      expect(blackIC?.rating).toBe(6);
    });
  });

  describe("calculateTimeUntilAutoIncrease", () => {
    it("should return 15 minutes at session start", () => {
      const sessionStart = new Date();
      const result = calculateTimeUntilAutoIncrease(sessionStart, sessionStart);

      expect(result).toBe(15);
    });

    it("should return correct time after some minutes", () => {
      const sessionStart = new Date("2024-01-01T10:00:00");
      const currentTime = new Date("2024-01-01T10:05:00"); // 5 minutes later

      const result = calculateTimeUntilAutoIncrease(sessionStart, currentTime);

      expect(result).toBe(10); // 15 - 5 = 10
    });

    it("should reset after 15 minute intervals", () => {
      const sessionStart = new Date("2024-01-01T10:00:00");
      const currentTime = new Date("2024-01-01T10:15:00"); // Exactly 15 minutes

      const result = calculateTimeUntilAutoIncrease(sessionStart, currentTime);

      expect(result).toBe(15); // Resets to 15
    });

    it("should handle partial intervals correctly", () => {
      const sessionStart = new Date("2024-01-01T10:00:00");
      const currentTime = new Date("2024-01-01T10:20:00"); // 20 minutes (15 + 5)

      const result = calculateTimeUntilAutoIncrease(sessionStart, currentTime);

      expect(result).toBe(10); // 15 - 5 = 10
    });
  });

  describe("shouldAutoIncreaseOS", () => {
    it("should return false before 15 minutes", () => {
      const sessionStart = new Date("2024-01-01T10:00:00");
      const currentTime = new Date("2024-01-01T10:14:59"); // Just before 15 min

      const result = shouldAutoIncreaseOS(sessionStart, null, currentTime);

      expect(result).toBe(false);
    });

    it("should return true at 15 minutes", () => {
      const sessionStart = new Date("2024-01-01T10:00:00");
      const currentTime = new Date("2024-01-01T10:15:00");

      const result = shouldAutoIncreaseOS(sessionStart, null, currentTime);

      expect(result).toBe(true);
    });

    it("should use lastAutoIncreaseTime when provided", () => {
      const sessionStart = new Date("2024-01-01T10:00:00");
      const lastIncrease = new Date("2024-01-01T10:15:00");
      const currentTime = new Date("2024-01-01T10:20:00"); // 5 min after last increase

      const result = shouldAutoIncreaseOS(sessionStart, lastIncrease, currentTime);

      expect(result).toBe(false); // Only 5 min since last increase
    });

    it("should return true 15 minutes after last increase", () => {
      const sessionStart = new Date("2024-01-01T10:00:00");
      const lastIncrease = new Date("2024-01-01T10:15:00");
      const currentTime = new Date("2024-01-01T10:30:00"); // 15 min after last increase

      const result = shouldAutoIncreaseOS(sessionStart, lastIncrease, currentTime);

      expect(result).toBe(true);
    });
  });

  describe("getOverwatchStatusDescription", () => {
    it("should return 'Clean' at 0", () => {
      expect(getOverwatchStatusDescription(0)).toBe("Clean - No GOD attention");
    });

    it("should return 'Low profile' for 1-9", () => {
      expect(getOverwatchStatusDescription(1)).toBe("Low profile - Minor GOD interest");
      expect(getOverwatchStatusDescription(9)).toBe("Low profile - Minor GOD interest");
    });

    it("should return 'On the radar' for 10-19", () => {
      expect(getOverwatchStatusDescription(10)).toBe("On the radar - GOD tracking initiated");
      expect(getOverwatchStatusDescription(19)).toBe("On the radar - GOD tracking initiated");
    });

    it("should return 'Hot pursuit' for 20-29", () => {
      expect(getOverwatchStatusDescription(20)).toBe("Hot pursuit - GOD actively hunting");
      expect(getOverwatchStatusDescription(29)).toBe("Hot pursuit - GOD actively hunting");
    });

    it("should return 'Critical' for 30-39", () => {
      expect(getOverwatchStatusDescription(30)).toBe("Critical - Convergence imminent!");
      expect(getOverwatchStatusDescription(39)).toBe("Critical - Convergence imminent!");
    });

    it("should return 'CONVERGED' at 40+", () => {
      expect(getOverwatchStatusDescription(40)).toBe("CONVERGED - GOD has found you!");
      expect(getOverwatchStatusDescription(50)).toBe("CONVERGED - GOD has found you!");
    });
  });
});
