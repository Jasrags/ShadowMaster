import { describe, it, expect } from "vitest";
import {
  isIllegalAction,
  getMarkRequirement,
  getActionLimitAttribute,
  isActionSupportedByDevice,
  requiresVRMode,
  getMarksOnTarget,
  hasRequiredMarks,
  getRelevantPrograms,
  isProgramLoaded,
  getLoadedRelevantPrograms,
  validateMatrixAction,
  getAvailableActions,
  categorizeActions,
  getActionRequirementsSummary,
} from "../action-validator";
import type { MatrixAction, MatrixState, MatrixDeviceType } from "@/lib/types/matrix";
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

function createCharacterWithCyberdeck(): ReturnType<typeof createMockCharacter> {
  return createMockCharacter({
    cyberdecks: [
      {
        id: "deck-1",
        catalogId: "erika-mcd-1",
        name: "Erika MCD-1",
        deviceRating: 4,
        attributeArray: [5, 4, 3, 2],
        currentConfig: {
          attack: 5,
          sleaze: 4,
          dataProcessing: 3,
          firewall: 2,
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

describe("action-validator", () => {
  describe("isIllegalAction", () => {
    it("should return true for illegal actions", () => {
      const action = createMockMatrixAction({ legality: "illegal" });
      expect(isIllegalAction(action)).toBe(true);
    });

    it("should return false for legal actions", () => {
      const action = createMockMatrixAction({ legality: "legal" });
      expect(isIllegalAction(action)).toBe(false);
    });
  });

  describe("getMarkRequirement", () => {
    it("should return marks required for action", () => {
      const action0 = createMockMatrixAction({ marksRequired: 0 });
      const action1 = createMockMatrixAction({ marksRequired: 1 });
      const action2 = createMockMatrixAction({ marksRequired: 2 });
      const action3 = createMockMatrixAction({ marksRequired: 3 });

      expect(getMarkRequirement(action0)).toBe(0);
      expect(getMarkRequirement(action1)).toBe(1);
      expect(getMarkRequirement(action2)).toBe(2);
      expect(getMarkRequirement(action3)).toBe(3);
    });
  });

  describe("getActionLimitAttribute", () => {
    it("should return the limit attribute", () => {
      const attackAction = createMockMatrixAction({ limitAttribute: "attack" });
      const sleazeAction = createMockMatrixAction({ limitAttribute: "sleaze" });
      const dpAction = createMockMatrixAction({ limitAttribute: "dataProcessing" });
      const fwAction = createMockMatrixAction({ limitAttribute: "firewall" });

      expect(getActionLimitAttribute(attackAction)).toBe("attack");
      expect(getActionLimitAttribute(sleazeAction)).toBe("sleaze");
      expect(getActionLimitAttribute(dpAction)).toBe("dataProcessing");
      expect(getActionLimitAttribute(fwAction)).toBe("firewall");
    });
  });

  describe("isActionSupportedByDevice", () => {
    it("should allow all actions on cyberdeck", () => {
      const illegalAction = createMockMatrixAction({ legality: "illegal", category: "attack" });
      const legalAction = createMockMatrixAction({ legality: "legal", category: "persona" });

      expect(isActionSupportedByDevice(illegalAction, "cyberdeck")).toBe(true);
      expect(isActionSupportedByDevice(legalAction, "cyberdeck")).toBe(true);
    });

    it("should only allow legal non-attack actions on commlink", () => {
      const legalPersona = createMockMatrixAction({ legality: "legal", category: "persona" });
      const illegalAction = createMockMatrixAction({ legality: "illegal", category: "sleaze" });
      const legalAttack = createMockMatrixAction({ legality: "legal", category: "attack" });

      expect(isActionSupportedByDevice(legalPersona, "commlink")).toBe(true);
      expect(isActionSupportedByDevice(illegalAction, "commlink")).toBe(false);
      expect(isActionSupportedByDevice(legalAttack, "commlink")).toBe(false);
    });

    it("should only allow device/persona actions on RCC", () => {
      const deviceAction = createMockMatrixAction({ category: "device" });
      const personaAction = createMockMatrixAction({ category: "persona" });
      const attackAction = createMockMatrixAction({ category: "attack" });

      expect(isActionSupportedByDevice(deviceAction, "rcc")).toBe(true);
      expect(isActionSupportedByDevice(personaAction, "rcc")).toBe(true);
      expect(isActionSupportedByDevice(attackAction, "rcc")).toBe(false);
    });

    it("should not allow complex_form category on technomancer living persona", () => {
      const complexForm = createMockMatrixAction({ category: "complex_form" });
      const regularAction = createMockMatrixAction({ category: "persona" });

      expect(isActionSupportedByDevice(complexForm, "technomancer-living-persona")).toBe(false);
      expect(isActionSupportedByDevice(regularAction, "technomancer-living-persona")).toBe(true);
    });
  });

  describe("requiresVRMode", () => {
    it("should return false (no actions strictly require VR in SR5)", () => {
      const action = createMockMatrixAction();
      expect(requiresVRMode(action)).toBe(false);
    });
  });

  describe("getMarksOnTarget", () => {
    it("should return 0 when no marks on target", () => {
      const state = createMockMatrixState();
      expect(getMarksOnTarget(state, "target-1")).toBe(0);
    });

    it("should return mark count for target", () => {
      const state = createMockMatrixState({
        marksHeld: [
          {
            id: "mark-1",
            targetId: "target-1",
            targetType: "device",
            targetName: "Target Device",
            markCount: 2,
            placedAt: new Date().toISOString() as ISODateString,
          },
        ],
      });

      expect(getMarksOnTarget(state, "target-1")).toBe(2);
    });
  });

  describe("hasRequiredMarks", () => {
    it("should return true when 0 marks required", () => {
      const state = createMockMatrixState();
      expect(hasRequiredMarks(state, "target-1", 0)).toBe(true);
    });

    it("should return true when sufficient marks exist", () => {
      const state = createMockMatrixState({
        marksHeld: [
          {
            id: "mark-1",
            targetId: "target-1",
            targetType: "device",
            targetName: "Target",
            markCount: 2,
            placedAt: new Date().toISOString() as ISODateString,
          },
        ],
      });

      expect(hasRequiredMarks(state, "target-1", 2)).toBe(true);
      expect(hasRequiredMarks(state, "target-1", 1)).toBe(true);
    });

    it("should return false when insufficient marks", () => {
      const state = createMockMatrixState({
        marksHeld: [
          {
            id: "mark-1",
            targetId: "target-1",
            targetType: "device",
            targetName: "Target",
            markCount: 1,
            placedAt: new Date().toISOString() as ISODateString,
          },
        ],
      });

      expect(hasRequiredMarks(state, "target-1", 2)).toBe(false);
    });
  });

  describe("getRelevantPrograms", () => {
    it("should return relevant programs for action", () => {
      const action = createMockMatrixAction({
        relevantPrograms: ["exploit", "stealth"],
      });

      expect(getRelevantPrograms(action)).toEqual(["exploit", "stealth"]);
    });

    it("should return empty array when no relevant programs", () => {
      const action = createMockMatrixAction({ relevantPrograms: undefined });

      expect(getRelevantPrograms(action)).toEqual([]);
    });
  });

  describe("isProgramLoaded", () => {
    it("should return true for loaded and running program", () => {
      const state = createMockMatrixState({
        loadedPrograms: [
          {
            programId: "prog-1",
            catalogId: "exploit",
            name: "Exploit",
            category: "hacking",
            isRunning: true,
          },
        ],
      });

      expect(isProgramLoaded(state, "exploit")).toBe(true);
    });

    it("should return false for loaded but not running program", () => {
      const state = createMockMatrixState({
        loadedPrograms: [
          {
            programId: "prog-1",
            catalogId: "exploit",
            name: "Exploit",
            category: "hacking",
            isRunning: false,
          },
        ],
      });

      expect(isProgramLoaded(state, "exploit")).toBe(false);
    });

    it("should return false for unloaded program", () => {
      const state = createMockMatrixState();
      expect(isProgramLoaded(state, "exploit")).toBe(false);
    });

    it("should match by programId or catalogId", () => {
      const state = createMockMatrixState({
        loadedPrograms: [
          {
            programId: "my-exploit",
            catalogId: "exploit",
            name: "Exploit",
            category: "hacking",
            isRunning: true,
          },
        ],
      });

      expect(isProgramLoaded(state, "exploit")).toBe(true);
      expect(isProgramLoaded(state, "my-exploit")).toBe(true);
    });
  });

  describe("getLoadedRelevantPrograms", () => {
    it("should return only loaded relevant programs", () => {
      const action = createMockMatrixAction({
        relevantPrograms: ["exploit", "stealth", "armor"],
      });
      const state = createMockMatrixState({
        loadedPrograms: [
          {
            programId: "p1",
            catalogId: "exploit",
            name: "Exploit",
            category: "hacking",
            isRunning: true,
          },
          {
            programId: "p2",
            catalogId: "browse",
            name: "Browse",
            category: "common",
            isRunning: true,
          },
          {
            programId: "p3",
            catalogId: "stealth",
            name: "Stealth",
            category: "hacking",
            isRunning: false,
          },
        ],
      });

      const result = getLoadedRelevantPrograms(action, state);

      expect(result).toEqual(["exploit"]);
    });

    it("should return empty array when no relevant programs loaded", () => {
      const action = createMockMatrixAction({ relevantPrograms: ["exploit"] });
      const state = createMockMatrixState();

      expect(getLoadedRelevantPrograms(action, state)).toEqual([]);
    });
  });

  describe("validateMatrixAction", () => {
    it("should validate successful action with hardware and connection", () => {
      const character = createCharacterWithCyberdeck();
      const state = createMockMatrixState();
      const action = createMockMatrixAction({ legality: "legal", marksRequired: 0 });

      const result = validateMatrixAction(character, state, action);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.hasRequiredHardware).toBe(true);
      expect(result.isConnected).toBe(true);
    });

    it("should fail when not connected", () => {
      const character = createCharacterWithCyberdeck();
      const state = createMockMatrixState({ isConnected: false });
      const action = createMockMatrixAction();

      const result = validateMatrixAction(character, state, action);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "NOT_CONNECTED")).toBe(true);
    });

    it("should fail when no matrix hardware", () => {
      const character = createMockCharacter({ commlinks: [], cyberdecks: [] });
      const state = createMockMatrixState();
      const action = createMockMatrixAction();

      const result = validateMatrixAction(character, state, action);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "NO_MATRIX_HARDWARE")).toBe(true);
    });

    it("should fail when device incompatible with action", () => {
      const character = createMockCharacter({
        commlinks: [
          {
            id: "link-1",
            catalogId: "meta-link",
            name: "Meta Link",
            deviceRating: 1,
            dataProcessing: 1,
            firewall: 1,
            cost: 100,
            availability: 2,
          },
        ],
      });
      const state = createMockMatrixState({ activeDeviceType: "commlink" });
      const action = createMockMatrixAction({ legality: "illegal", category: "attack" });

      const result = validateMatrixAction(character, state, action);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "DEVICE_INCOMPATIBLE")).toBe(true);
    });

    it("should fail when insufficient marks on target", () => {
      const character = createCharacterWithCyberdeck();
      const state = createMockMatrixState();
      const action = createMockMatrixAction({ marksRequired: 2 });

      const result = validateMatrixAction(character, state, action, "target-1");

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "INSUFFICIENT_MARKS")).toBe(true);
    });

    it("should warn when no target specified for marks", () => {
      const character = createCharacterWithCyberdeck();
      const state = createMockMatrixState();
      const action = createMockMatrixAction({ marksRequired: 1 });

      const result = validateMatrixAction(character, state, action);

      expect(result.warnings.some((w) => w.code === "NO_TARGET_SPECIFIED")).toBe(true);
    });

    it("should warn about overwatch risk for illegal actions", () => {
      const character = createCharacterWithCyberdeck();
      const state = createMockMatrixState({ overwatchScore: 10 });
      const action = createMockMatrixAction({ legality: "illegal" });

      const result = validateMatrixAction(character, state, action);

      expect(result.warnings.some((w) => w.code === "OVERWATCH_RISK")).toBe(true);
      expect(result.overwatchRisk).toBe(true);
    });

    it("should warn about imminent convergence", () => {
      const character = createCharacterWithCyberdeck();
      const state = createMockMatrixState({ overwatchScore: 30 }); // <= 14 points from threshold
      const action = createMockMatrixAction({ legality: "illegal" });

      const result = validateMatrixAction(character, state, action);

      expect(result.warnings.some((w) => w.code === "CONVERGENCE_IMMINENT")).toBe(true);
    });

    it("should warn about missing relevant programs", () => {
      const character = createCharacterWithCyberdeck();
      const state = createMockMatrixState();
      const action = createMockMatrixAction({ relevantPrograms: ["exploit", "stealth"] });

      const result = validateMatrixAction(character, state, action);

      expect(result.warnings.some((w) => w.code === "NO_RELEVANT_PROGRAMS")).toBe(true);
    });

    it("should fail when illegal action attempted without hacking hardware", () => {
      const character = createMockCharacter({
        commlinks: [
          {
            id: "link-1",
            catalogId: "meta-link",
            name: "Meta Link",
            deviceRating: 1,
            dataProcessing: 1,
            firewall: 1,
            cost: 100,
            availability: 2,
          },
        ],
      });
      const state = createMockMatrixState({ activeDeviceType: "commlink" });
      const action = createMockMatrixAction({ legality: "illegal" });

      const result = validateMatrixAction(character, state, action);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "NO_HACKING_HARDWARE")).toBe(true);
    });
  });

  describe("getAvailableActions", () => {
    it("should return empty array when not connected", () => {
      const state = createMockMatrixState({ isConnected: false });
      const actions = [createMockMatrixAction()];

      expect(getAvailableActions(state, actions)).toEqual([]);
    });

    it("should return empty array when no active device type", () => {
      const state = createMockMatrixState({ activeDeviceType: undefined });
      const actions = [createMockMatrixAction()];

      expect(getAvailableActions(state, actions)).toEqual([]);
    });

    it("should filter actions by device compatibility", () => {
      const state = createMockMatrixState({ activeDeviceType: "commlink" });
      const actions = [
        createMockMatrixAction({ id: "legal-persona", legality: "legal", category: "persona" }),
        createMockMatrixAction({ id: "illegal-attack", legality: "illegal", category: "attack" }),
      ];

      const available = getAvailableActions(state, actions);

      expect(available).toHaveLength(1);
      expect(available[0].id).toBe("legal-persona");
    });
  });

  describe("categorizeActions", () => {
    it("should group actions by category", () => {
      const actions = [
        createMockMatrixAction({ id: "a1", category: "attack" }),
        createMockMatrixAction({ id: "a2", category: "attack" }),
        createMockMatrixAction({ id: "s1", category: "sleaze" }),
        createMockMatrixAction({ id: "p1", category: "persona" }),
      ];

      const categories = categorizeActions(actions);

      expect(categories["attack"]).toHaveLength(2);
      expect(categories["sleaze"]).toHaveLength(1);
      expect(categories["persona"]).toHaveLength(1);
    });

    it("should return empty object for empty array", () => {
      expect(categorizeActions([])).toEqual({});
    });
  });

  describe("getActionRequirementsSummary", () => {
    it("should include marks requirement", () => {
      const action = createMockMatrixAction({ marksRequired: 2 });

      const summary = getActionRequirementsSummary(action);

      expect(summary).toContain("2 marks");
    });

    it("should include illegal status", () => {
      const action = createMockMatrixAction({ legality: "illegal" });

      const summary = getActionRequirementsSummary(action);

      expect(summary).toContain("Illegal");
      expect(summary).toContain("OS risk");
    });

    it("should include relevant programs", () => {
      const action = createMockMatrixAction({ relevantPrograms: ["exploit", "stealth"] });

      const summary = getActionRequirementsSummary(action);

      expect(summary).toContain("Programs:");
      expect(summary).toContain("exploit");
      expect(summary).toContain("stealth");
    });

    it("should return 'No special requirements' for basic action", () => {
      const action = createMockMatrixAction({
        legality: "legal",
        marksRequired: 0,
        relevantPrograms: undefined,
      });

      expect(getActionRequirementsSummary(action)).toBe("No special requirements");
    });

    it("should handle singular mark", () => {
      const action = createMockMatrixAction({ marksRequired: 1 });

      const summary = getActionRequirementsSummary(action);

      expect(summary).toContain("1 mark");
      expect(summary).not.toContain("1 marks");
    });
  });
});
