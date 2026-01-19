import { describe, it, expect } from "vitest";
import {
  findMark,
  getMarksOnTarget,
  hasRequiredMarks,
  getAllMarks,
  getMarksByType,
  countTotalMarks,
  placeMark,
  placeMarks,
  removeMarks,
  clearAllMarks,
  removeExpiredMarks,
  receiveMarkOnSelf,
  removeReceivedMarks,
  getTotalMarksReceived,
  getAuthorizationLevel,
  formatMarksForDisplay,
  marksNeededForLevel,
  checkActionMarks,
} from "../mark-tracker";
import type { MatrixState, MatrixMark } from "@/lib/types/matrix";
import type { ISODateString } from "@/lib/types";
import { MAX_MARKS, OVERWATCH_THRESHOLD } from "@/lib/types/matrix";

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

function createMockMark(overrides?: Partial<MatrixMark>): MatrixMark {
  return {
    id: `mark-${Date.now()}`,
    targetId: "target-1",
    targetType: "device",
    targetName: "Target Device",
    markCount: 1,
    placedAt: new Date().toISOString() as ISODateString,
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("mark-tracker", () => {
  describe("findMark", () => {
    it("should find an existing mark on target", () => {
      const mark = createMockMark({ targetId: "device-123" });
      const state = createMockMatrixState({ marksHeld: [mark] });

      const result = findMark(state, "device-123");

      expect(result).not.toBeNull();
      expect(result?.targetId).toBe("device-123");
    });

    it("should return null if no mark on target", () => {
      const state = createMockMatrixState({ marksHeld: [] });

      const result = findMark(state, "device-123");

      expect(result).toBeNull();
    });

    it("should return null for wrong target ID", () => {
      const mark = createMockMark({ targetId: "device-123" });
      const state = createMockMatrixState({ marksHeld: [mark] });

      const result = findMark(state, "device-456");

      expect(result).toBeNull();
    });
  });

  describe("getMarksOnTarget", () => {
    it("should return 0 if no marks on target", () => {
      const state = createMockMatrixState();

      expect(getMarksOnTarget(state, "device-123")).toBe(0);
    });

    it("should return correct mark count", () => {
      const mark = createMockMark({ targetId: "device-123", markCount: 2 });
      const state = createMockMatrixState({ marksHeld: [mark] });

      expect(getMarksOnTarget(state, "device-123")).toBe(2);
    });
  });

  describe("hasRequiredMarks", () => {
    it("should return true when enough marks exist", () => {
      const mark = createMockMark({ targetId: "device-123", markCount: 2 });
      const state = createMockMatrixState({ marksHeld: [mark] });

      expect(hasRequiredMarks(state, "device-123", 2)).toBe(true);
      expect(hasRequiredMarks(state, "device-123", 1)).toBe(true);
    });

    it("should return false when not enough marks", () => {
      const mark = createMockMark({ targetId: "device-123", markCount: 1 });
      const state = createMockMatrixState({ marksHeld: [mark] });

      expect(hasRequiredMarks(state, "device-123", 2)).toBe(false);
    });

    it("should return true when required marks is 0 or less", () => {
      const state = createMockMatrixState();

      expect(hasRequiredMarks(state, "device-123", 0)).toBe(true);
      expect(hasRequiredMarks(state, "device-123", -1)).toBe(true);
    });
  });

  describe("getAllMarks", () => {
    it("should return empty array when no marks", () => {
      const state = createMockMatrixState();

      expect(getAllMarks(state)).toEqual([]);
    });

    it("should return all marks", () => {
      const mark1 = createMockMark({ id: "m1", targetId: "t1" });
      const mark2 = createMockMark({ id: "m2", targetId: "t2" });
      const state = createMockMatrixState({ marksHeld: [mark1, mark2] });

      const result = getAllMarks(state);

      expect(result).toHaveLength(2);
    });

    it("should return a copy (not mutate original)", () => {
      const mark = createMockMark();
      const state = createMockMatrixState({ marksHeld: [mark] });

      const result = getAllMarks(state);
      result.push(createMockMark({ id: "new" }));

      expect(state.marksHeld).toHaveLength(1);
    });
  });

  describe("getMarksByType", () => {
    it("should filter marks by target type", () => {
      const deviceMark = createMockMark({ id: "m1", targetType: "device" });
      const hostMark = createMockMark({ id: "m2", targetType: "host" });
      const personaMark = createMockMark({ id: "m3", targetType: "persona" });
      const state = createMockMatrixState({ marksHeld: [deviceMark, hostMark, personaMark] });

      const deviceMarks = getMarksByType(state, "device");
      const hostMarks = getMarksByType(state, "host");

      expect(deviceMarks).toHaveLength(1);
      expect(hostMarks).toHaveLength(1);
    });

    it("should return empty array when no marks of type exist", () => {
      const deviceMark = createMockMark({ targetType: "device" });
      const state = createMockMatrixState({ marksHeld: [deviceMark] });

      expect(getMarksByType(state, "ic")).toEqual([]);
    });
  });

  describe("countTotalMarks", () => {
    it("should return 0 when no marks", () => {
      const state = createMockMatrixState();

      expect(countTotalMarks(state)).toBe(0);
    });

    it("should sum mark counts from all targets", () => {
      const mark1 = createMockMark({ id: "m1", markCount: 2 });
      const mark2 = createMockMark({ id: "m2", markCount: 3 });
      const state = createMockMatrixState({ marksHeld: [mark1, mark2] });

      expect(countTotalMarks(state)).toBe(5);
    });
  });

  describe("placeMark", () => {
    it("should create new mark on target without existing marks", () => {
      const state = createMockMatrixState();

      const { state: newState, result } = placeMark(state, "device-123", "device", "Test Device");

      expect(result.success).toBe(true);
      expect(result.newMarkCount).toBe(1);
      expect(newState.marksHeld).toHaveLength(1);
      expect(newState.marksHeld[0].targetId).toBe("device-123");
    });

    it("should increment existing mark count", () => {
      const existingMark = createMockMark({ targetId: "device-123", markCount: 1 });
      const state = createMockMatrixState({ marksHeld: [existingMark] });

      const { state: newState, result } = placeMark(state, "device-123", "device", "Test Device");

      expect(result.success).toBe(true);
      expect(result.newMarkCount).toBe(2);
      expect(newState.marksHeld).toHaveLength(1);
    });

    it("should fail when at MAX_MARKS (3)", () => {
      const existingMark = createMockMark({ targetId: "device-123", markCount: MAX_MARKS });
      const state = createMockMatrixState({ marksHeld: [existingMark] });

      const { state: newState, result } = placeMark(state, "device-123", "device", "Test Device");

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].code).toBe("MAX_MARKS_REACHED");
      expect(newState.marksHeld[0].markCount).toBe(MAX_MARKS);
    });

    it("should silently cap at MAX_MARKS with silentCap option", () => {
      const existingMark = createMockMark({ targetId: "device-123", markCount: MAX_MARKS });
      const state = createMockMatrixState({ marksHeld: [existingMark] });

      const { state: newState, result } = placeMark(state, "device-123", "device", "Test Device", {
        silentCap: true,
      });

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.newMarkCount).toBe(MAX_MARKS);
    });

    it("should preserve optional expiration time", () => {
      const state = createMockMatrixState();
      const expiration = new Date(Date.now() + 3600000).toISOString() as ISODateString;

      const { state: newState } = placeMark(state, "device-123", "device", "Test Device", {
        expiresAt: expiration,
      });

      expect(newState.marksHeld[0].expiresAt).toBe(expiration);
    });

    it("should not mutate original state", () => {
      const state = createMockMatrixState();
      const originalLength = state.marksHeld.length;

      placeMark(state, "device-123", "device", "Test Device");

      expect(state.marksHeld.length).toBe(originalLength);
    });
  });

  describe("placeMarks", () => {
    it("should place multiple marks at once", () => {
      const state = createMockMatrixState();

      const { state: newState, result } = placeMarks(
        state,
        "device-123",
        "device",
        "Test Device",
        2
      );

      expect(result.success).toBe(true);
      expect(result.newMarkCount).toBe(2);
    });

    it("should cap at MAX_MARKS when placing more", () => {
      const existingMark = createMockMark({ targetId: "device-123", markCount: 2 });
      const state = createMockMatrixState({ marksHeld: [existingMark] });

      const { state: newState, result } = placeMarks(
        state,
        "device-123",
        "device",
        "Test Device",
        3
      );

      expect(result.newMarkCount).toBe(MAX_MARKS);
    });

    it("should work with 0 marks requested", () => {
      const state = createMockMatrixState();

      const { state: newState, result } = placeMarks(
        state,
        "device-123",
        "device",
        "Test Device",
        0
      );

      expect(newState.marksHeld).toHaveLength(0);
    });
  });

  describe("removeMarks", () => {
    it("should remove specific number of marks", () => {
      const existingMark = createMockMark({ targetId: "device-123", markCount: 3 });
      const state = createMockMatrixState({ marksHeld: [existingMark] });

      const { state: newState, result } = removeMarks(state, "device-123", 1);

      expect(result.success).toBe(true);
      expect(result.marksRemoved).toBe(1);
      expect(result.remainingMarks).toBe(2);
    });

    it("should remove all marks when count exceeds current", () => {
      const existingMark = createMockMark({ targetId: "device-123", markCount: 2 });
      const state = createMockMatrixState({ marksHeld: [existingMark] });

      const { state: newState, result } = removeMarks(state, "device-123", 5);

      expect(result.marksRemoved).toBe(2);
      expect(result.remainingMarks).toBe(0);
      expect(newState.marksHeld).toHaveLength(0);
    });

    it("should remove all marks when no count specified", () => {
      const existingMark = createMockMark({ targetId: "device-123", markCount: 3 });
      const state = createMockMatrixState({ marksHeld: [existingMark] });

      const { state: newState, result } = removeMarks(state, "device-123");

      expect(result.marksRemoved).toBe(3);
      expect(result.remainingMarks).toBe(0);
    });

    it("should return failure when no mark exists", () => {
      const state = createMockMatrixState();

      const { result } = removeMarks(state, "device-123");

      expect(result.success).toBe(false);
      expect(result.marksRemoved).toBe(0);
    });
  });

  describe("clearAllMarks", () => {
    it("should clear all marks held", () => {
      const mark1 = createMockMark({ id: "m1" });
      const mark2 = createMockMark({ id: "m2" });
      const state = createMockMatrixState({ marksHeld: [mark1, mark2] });

      const newState = clearAllMarks(state);

      expect(newState.marksHeld).toHaveLength(0);
    });

    it("should clear all marks received", () => {
      const receivedMark = createMockMark();
      const state = createMockMatrixState({ marksReceived: [receivedMark] });

      const newState = clearAllMarks(state);

      expect(newState.marksReceived).toHaveLength(0);
    });

    it("should not mutate original state", () => {
      const mark = createMockMark();
      const state = createMockMatrixState({ marksHeld: [mark] });

      clearAllMarks(state);

      expect(state.marksHeld).toHaveLength(1);
    });
  });

  describe("removeExpiredMarks", () => {
    it("should remove marks with past expiration", () => {
      const expiredMark = createMockMark({
        id: "expired",
        expiresAt: new Date(Date.now() - 3600000).toISOString() as ISODateString,
      });
      const validMark = createMockMark({
        id: "valid",
        expiresAt: new Date(Date.now() + 3600000).toISOString() as ISODateString,
      });
      const state = createMockMatrixState({ marksHeld: [expiredMark, validMark] });

      const newState = removeExpiredMarks(state);

      expect(newState.marksHeld).toHaveLength(1);
      expect(newState.marksHeld[0].id).toBe("valid");
    });

    it("should keep marks without expiration", () => {
      const markWithoutExpiry = createMockMark({ id: "no-expiry" });
      delete markWithoutExpiry.expiresAt;
      const state = createMockMatrixState({ marksHeld: [markWithoutExpiry] });

      const newState = removeExpiredMarks(state);

      expect(newState.marksHeld).toHaveLength(1);
    });

    it("should use provided current time for comparison", () => {
      const mark = createMockMark({
        expiresAt: "2024-01-01T12:00:00.000Z" as ISODateString,
      });
      const state = createMockMatrixState({ marksHeld: [mark] });

      // Before expiration
      const beforeExpiry = removeExpiredMarks(state, new Date("2024-01-01T11:00:00.000Z"));
      expect(beforeExpiry.marksHeld).toHaveLength(1);

      // After expiration
      const afterExpiry = removeExpiredMarks(state, new Date("2024-01-01T13:00:00.000Z"));
      expect(afterExpiry.marksHeld).toHaveLength(0);
    });
  });

  describe("receiveMarkOnSelf", () => {
    it("should add new mark to marksReceived", () => {
      const state = createMockMatrixState();
      const mark = createMockMark({ targetId: "attacker-1" });

      const newState = receiveMarkOnSelf(state, mark);

      expect(newState.marksReceived).toHaveLength(1);
      expect(newState.marksReceived[0].targetId).toBe("attacker-1");
    });

    it("should increment existing mark from same attacker", () => {
      const existingMark = createMockMark({ targetId: "attacker-1", markCount: 1 });
      const state = createMockMatrixState({ marksReceived: [existingMark] });
      const newMark = createMockMark({ targetId: "attacker-1", markCount: 1 });

      const newState = receiveMarkOnSelf(state, newMark);

      expect(newState.marksReceived).toHaveLength(1);
      expect(newState.marksReceived[0].markCount).toBe(2);
    });

    it("should cap at MAX_MARKS", () => {
      const existingMark = createMockMark({ targetId: "attacker-1", markCount: 2 });
      const state = createMockMatrixState({ marksReceived: [existingMark] });
      const newMark = createMockMark({ targetId: "attacker-1", markCount: 5 });

      const newState = receiveMarkOnSelf(state, newMark);

      expect(newState.marksReceived[0].markCount).toBe(MAX_MARKS);
    });
  });

  describe("removeReceivedMarks", () => {
    it("should remove marks from specific attacker", () => {
      const mark1 = createMockMark({ id: "m1", targetId: "attacker-1" });
      const mark2 = createMockMark({ id: "m2", targetId: "attacker-2" });
      const state = createMockMatrixState({ marksReceived: [mark1, mark2] });

      const newState = removeReceivedMarks(state, "attacker-1");

      expect(newState.marksReceived).toHaveLength(1);
      expect(newState.marksReceived[0].targetId).toBe("attacker-2");
    });

    it("should do nothing if attacker has no marks", () => {
      const mark = createMockMark({ targetId: "attacker-1" });
      const state = createMockMatrixState({ marksReceived: [mark] });

      const newState = removeReceivedMarks(state, "attacker-999");

      expect(newState.marksReceived).toHaveLength(1);
    });
  });

  describe("getTotalMarksReceived", () => {
    it("should return 0 when no marks received", () => {
      const state = createMockMatrixState();

      expect(getTotalMarksReceived(state)).toBe(0);
    });

    it("should sum marks from all attackers", () => {
      const mark1 = createMockMark({ markCount: 2 });
      const mark2 = createMockMark({ markCount: 1 });
      const state = createMockMatrixState({ marksReceived: [mark1, mark2] });

      expect(getTotalMarksReceived(state)).toBe(3);
    });
  });

  describe("getAuthorizationLevel", () => {
    it("should return 'Outsider' for 0 marks", () => {
      expect(getAuthorizationLevel(0)).toBe("Outsider");
    });

    it("should return 'User' for 1 mark", () => {
      expect(getAuthorizationLevel(1)).toBe("User");
    });

    it("should return 'Security' for 2 marks", () => {
      expect(getAuthorizationLevel(2)).toBe("Security");
    });

    it("should return 'Admin' for 3 marks", () => {
      expect(getAuthorizationLevel(3)).toBe("Admin");
    });

    it("should return 'Admin' for more than 3 marks", () => {
      expect(getAuthorizationLevel(5)).toBe("Admin");
    });

    it("should return 'Outsider' for negative values", () => {
      expect(getAuthorizationLevel(-1)).toBe("Outsider");
    });
  });

  describe("formatMarksForDisplay", () => {
    it("should format marks with name, count, and level", () => {
      const mark = createMockMark({
        targetName: "Corporate Host",
        markCount: 2,
      });
      const state = createMockMatrixState({ marksHeld: [mark] });

      const result = formatMarksForDisplay(state);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe("Corporate Host: 2 mark(s) [Security]");
    });

    it("should return empty array when no marks", () => {
      const state = createMockMatrixState();

      expect(formatMarksForDisplay(state)).toEqual([]);
    });

    it("should format multiple marks", () => {
      const mark1 = createMockMark({ targetName: "Host A", markCount: 1 });
      const mark2 = createMockMark({ targetName: "Host B", markCount: 3 });
      const state = createMockMatrixState({ marksHeld: [mark1, mark2] });

      const result = formatMarksForDisplay(state);

      expect(result).toHaveLength(2);
      expect(result[0]).toContain("User");
      expect(result[1]).toContain("Admin");
    });
  });

  describe("marksNeededForLevel", () => {
    it("should calculate marks needed for user level", () => {
      expect(marksNeededForLevel(0, "user")).toBe(1);
      expect(marksNeededForLevel(1, "user")).toBe(0);
      expect(marksNeededForLevel(2, "user")).toBe(0);
    });

    it("should calculate marks needed for security level", () => {
      expect(marksNeededForLevel(0, "security")).toBe(2);
      expect(marksNeededForLevel(1, "security")).toBe(1);
      expect(marksNeededForLevel(2, "security")).toBe(0);
    });

    it("should calculate marks needed for admin level", () => {
      expect(marksNeededForLevel(0, "admin")).toBe(3);
      expect(marksNeededForLevel(1, "admin")).toBe(2);
      expect(marksNeededForLevel(2, "admin")).toBe(1);
      expect(marksNeededForLevel(3, "admin")).toBe(0);
    });

    it("should return 0 when already at or above level", () => {
      expect(marksNeededForLevel(3, "user")).toBe(0);
      expect(marksNeededForLevel(3, "security")).toBe(0);
    });
  });

  describe("checkActionMarks", () => {
    it("should return canPerform true with sufficient marks", () => {
      const mark = createMockMark({ targetId: "device-123", markCount: 2 });
      const state = createMockMatrixState({ marksHeld: [mark] });

      const result = checkActionMarks(state, "device-123", 2);

      expect(result.canPerform).toBe(true);
      expect(result.currentMarks).toBe(2);
      expect(result.message).toContain("Sufficient marks");
    });

    it("should return canPerform false with insufficient marks", () => {
      const mark = createMockMark({ targetId: "device-123", markCount: 1 });
      const state = createMockMatrixState({ marksHeld: [mark] });

      const result = checkActionMarks(state, "device-123", 2);

      expect(result.canPerform).toBe(false);
      expect(result.currentMarks).toBe(1);
      expect(result.message).toContain("Need 1 more mark");
    });

    it("should indicate needed marks count in message", () => {
      const state = createMockMatrixState();

      const result = checkActionMarks(state, "device-123", 3);

      expect(result.canPerform).toBe(false);
      expect(result.message).toContain("Need 3 more mark");
    });
  });
});
