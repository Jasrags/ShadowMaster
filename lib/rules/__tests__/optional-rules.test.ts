import { describe, it, expect, beforeEach } from "vitest";
import {
  extractOptionalRules,
  resolveOptionalRules,
  getActiveOptionalRules,
  isOptionalRuleActive,
  validateOptionalRuleAccess,
  createEmptyOptionalRulesState,
  createDefaultOptionalRulesState,
  enableOptionalRule,
  disableOptionalRule,
  resetOptionalRule,
  type OptionalRule,
  type OptionalRulesState,
} from "../optional-rules";
import type { LoadedRuleset } from "../loader-types";

describe("optional-rules", () => {
  // Test data
  const mockOptionalRules: OptionalRule[] = [
    {
      id: "wireless-bonuses",
      name: "Wireless Bonuses",
      description: "Enable wireless bonuses for gear",
      sourceBookId: "core",
      defaultEnabled: true,
      affectedModules: ["gear", "cyberware"],
    },
    {
      id: "called-shots",
      name: "Called Shots",
      description: "Enable called shot rules",
      sourceBookId: "run-and-gun",
      defaultEnabled: true,
      affectedModules: ["combat"],
    },
    {
      id: "martial-arts",
      name: "Martial Arts",
      description: "Enable martial arts subsystem",
      sourceBookId: "run-and-gun",
      defaultEnabled: false,
      affectedModules: ["combat"],
    },
  ];

  describe("resolveOptionalRules", () => {
    it("should use defaults when no state provided", () => {
      const result = resolveOptionalRules(mockOptionalRules, undefined);

      expect(result.allRules).toHaveLength(3);
      expect(result.activeRules).toHaveLength(2); // wireless-bonuses and called-shots
      expect(result.inactiveRules).toHaveLength(1); // martial-arts
    });

    it("should use defaults with empty state", () => {
      const state = createEmptyOptionalRulesState();
      const result = resolveOptionalRules(mockOptionalRules, state);

      expect(result.activeRules).toHaveLength(2);
      expect(result.inactiveRules).toHaveLength(1);
    });

    it("should enable a disabled rule when in enabledRuleIds", () => {
      const state: OptionalRulesState = {
        enabledRuleIds: ["martial-arts"],
        disabledRuleIds: [],
      };
      const result = resolveOptionalRules(mockOptionalRules, state);

      expect(result.activeRules).toHaveLength(3);
      expect(result.activeRules.map((r) => r.id)).toContain("martial-arts");
    });

    it("should disable an enabled rule when in disabledRuleIds", () => {
      const state: OptionalRulesState = {
        enabledRuleIds: [],
        disabledRuleIds: ["wireless-bonuses"],
      };
      const result = resolveOptionalRules(mockOptionalRules, state);

      expect(result.activeRules).toHaveLength(1);
      expect(result.inactiveRules).toHaveLength(2);
      expect(result.inactiveRules.map((r) => r.id)).toContain("wireless-bonuses");
    });

    it("should give disabledRuleIds precedence over enabledRuleIds", () => {
      const state: OptionalRulesState = {
        enabledRuleIds: ["martial-arts"],
        disabledRuleIds: ["martial-arts"], // Both! Disabled wins
      };
      const result = resolveOptionalRules(mockOptionalRules, state);

      expect(result.activeRules.map((r) => r.id)).not.toContain("martial-arts");
      expect(result.inactiveRules.map((r) => r.id)).toContain("martial-arts");
    });
  });

  describe("isOptionalRuleActive", () => {
    it("should return true for active rule", () => {
      const state = createEmptyOptionalRulesState();
      expect(isOptionalRuleActive("wireless-bonuses", mockOptionalRules, state)).toBe(true);
    });

    it("should return false for inactive rule", () => {
      const state = createEmptyOptionalRulesState();
      expect(isOptionalRuleActive("martial-arts", mockOptionalRules, state)).toBe(false);
    });

    it("should return false for non-existent rule", () => {
      const state = createEmptyOptionalRulesState();
      expect(isOptionalRuleActive("fake-rule", mockOptionalRules, state)).toBe(false);
    });
  });

  describe("validateOptionalRuleAccess", () => {
    it("should return null for active rule", () => {
      const state = createEmptyOptionalRulesState();
      const error = validateOptionalRuleAccess("wireless-bonuses", mockOptionalRules, state);
      expect(error).toBeNull();
    });

    it("should return error for inactive rule", () => {
      const state = createEmptyOptionalRulesState();
      const error = validateOptionalRuleAccess("martial-arts", mockOptionalRules, state);
      expect(error).toContain("disabled");
    });

    it("should return error for non-existent rule", () => {
      const state = createEmptyOptionalRulesState();
      const error = validateOptionalRuleAccess("fake-rule", mockOptionalRules, state);
      expect(error).toContain("not found");
    });
  });

  describe("mutation helpers", () => {
    let state: OptionalRulesState;

    beforeEach(() => {
      state = createEmptyOptionalRulesState();
    });

    describe("enableOptionalRule", () => {
      it("should add rule to enabledRuleIds", () => {
        const newState = enableOptionalRule(state, "martial-arts");
        expect(newState.enabledRuleIds).toContain("martial-arts");
      });

      it("should remove rule from disabledRuleIds if present", () => {
        state = { enabledRuleIds: [], disabledRuleIds: ["martial-arts"] };
        const newState = enableOptionalRule(state, "martial-arts");
        expect(newState.disabledRuleIds).not.toContain("martial-arts");
        expect(newState.enabledRuleIds).toContain("martial-arts");
      });

      it("should not duplicate if already enabled", () => {
        state = { enabledRuleIds: ["martial-arts"], disabledRuleIds: [] };
        const newState = enableOptionalRule(state, "martial-arts");
        expect(newState.enabledRuleIds.filter((id) => id === "martial-arts")).toHaveLength(1);
      });
    });

    describe("disableOptionalRule", () => {
      it("should add rule to disabledRuleIds", () => {
        const newState = disableOptionalRule(state, "wireless-bonuses");
        expect(newState.disabledRuleIds).toContain("wireless-bonuses");
      });

      it("should remove rule from enabledRuleIds if present", () => {
        state = { enabledRuleIds: ["wireless-bonuses"], disabledRuleIds: [] };
        const newState = disableOptionalRule(state, "wireless-bonuses");
        expect(newState.enabledRuleIds).not.toContain("wireless-bonuses");
        expect(newState.disabledRuleIds).toContain("wireless-bonuses");
      });
    });

    describe("resetOptionalRule", () => {
      it("should remove rule from both lists", () => {
        state = { enabledRuleIds: ["rule-a"], disabledRuleIds: ["rule-b"] };

        let newState = resetOptionalRule(state, "rule-a");
        expect(newState.enabledRuleIds).not.toContain("rule-a");

        newState = resetOptionalRule(state, "rule-b");
        expect(newState.disabledRuleIds).not.toContain("rule-b");
      });
    });
  });

  describe("createDefaultOptionalRulesState", () => {
    it("should return empty state", () => {
      const state = createDefaultOptionalRulesState(mockOptionalRules);
      expect(state.enabledRuleIds).toHaveLength(0);
      expect(state.disabledRuleIds).toHaveLength(0);
    });
  });
});
