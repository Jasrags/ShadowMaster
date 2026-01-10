/**
 * Tests for quality effects resolution system
 *
 * Tests effect resolution, trigger matching, condition checking,
 * template variable substitution, and effect filtering.
 */

import { describe, it, expect, beforeEach } from "vitest";
import type {
  Quality,
  QualitySelection,
  QualityEffect,
  EffectTrigger,
  EffectTarget,
  EffectCondition,
} from "@/lib/types";
import type { TestContext, CombatContext, MagicContext, MatrixContext } from "@/lib/types/gameplay";
import {
  resolveTemplateVariable,
  resolveEffectValue,
  resolveEffectTarget,
  matchesCondition,
  matchesTrigger,
  shouldApplyEffect,
  getActiveEffects,
  filterEffectsByTrigger,
  filterEffectsByTarget,
} from "../effects";
import { createMockCharacter } from "@/__tests__/mocks/storage";

describe("Quality Effects Resolution", () => {
  let quality: Quality;
  let selection: QualitySelection;

  beforeEach(() => {
    quality = {
      id: "test-quality",
      name: "Test Quality",
      type: "positive",
      karmaCost: 5,
      summary: "A test quality",
    };

    selection = {
      qualityId: "test-quality",
      source: "creation",
    };
  });

  describe("resolveTemplateVariable", () => {
    it("should return number as-is", () => {
      const result = resolveTemplateVariable(42, quality, selection);
      expect(result).toBe(42);
    });

    it("should replace {{rating}} template variable", () => {
      const selectionWithRating: QualitySelection = {
        ...selection,
        rating: 3,
      };

      const result = resolveTemplateVariable("{{rating}}", quality, selectionWithRating);
      expect(result).toBe(3);
    });

    it("should use 1 as default rating when rating not specified", () => {
      const result = resolveTemplateVariable("{{rating}}", quality, selection);
      expect(result).toBe(1);
    });

    it("should replace {{specification}} template variable", () => {
      const selectionWithSpec: QualitySelection = {
        ...selection,
        specification: "Firearms",
      };

      const result = resolveTemplateVariable("{{specification}}", quality, selectionWithSpec);
      expect(result).toBe("Firearms");
    });

    it("should replace {{specificationId}} template variable", () => {
      const selectionWithSpecId: QualitySelection = {
        ...selection,
        specificationId: "firearms",
      };

      const result = resolveTemplateVariable("{{specificationId}}", quality, selectionWithSpecId);
      expect(result).toBe("firearms");
    });

    it("should replace multiple template variables", () => {
      const selectionWithBoth: QualitySelection = {
        ...selection,
        rating: 2,
        specification: "Firearms",
      };

      const result = resolveTemplateVariable(
        "Rating {{rating}} for {{specification}}",
        quality,
        selectionWithBoth
      );
      expect(result).toBe("Rating 2 for Firearms");
    });

    it("should parse numeric result as number", () => {
      const selectionWithRating: QualitySelection = {
        ...selection,
        rating: 3,
      };

      const result = resolveTemplateVariable("{{rating}}", quality, selectionWithRating);
      expect(typeof result).toBe("number");
      expect(result).toBe(3);
    });

    it("should return string for non-numeric results", () => {
      const selectionWithSpec: QualitySelection = {
        ...selection,
        specification: "Firearms",
      };

      const result = resolveTemplateVariable("{{specification}}", quality, selectionWithSpec);
      expect(typeof result).toBe("string");
      expect(result).toBe("Firearms");
    });
  });

  describe("resolveEffectValue", () => {
    it("should return numeric value as-is", () => {
      const effect: QualityEffect = {
        id: "test-effect",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: 2,
      };

      const result = resolveEffectValue(effect, quality, selection);
      expect(result).toBe(2);
    });

    it("should resolve template variable in value", () => {
      const effect: QualityEffect = {
        id: "test-effect",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: "{{rating}}",
      };

      const selectionWithRating: QualitySelection = {
        ...selection,
        rating: 3,
      };

      const result = resolveEffectValue(effect, quality, selectionWithRating);
      expect(result).toBe(3);
    });

    it("should handle negative template expressions", () => {
      const effect: QualityEffect = {
        id: "test-effect",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: "-{{rating}}",
      };

      const selectionWithRating: QualitySelection = {
        ...selection,
        rating: 2,
      };

      const result = resolveEffectValue(effect, quality, selectionWithRating);
      expect(result).toBe(-2);
    });

    it("should return 0 for unresolvable values", () => {
      const effect: QualityEffect = {
        id: "test-effect",
        type: "dice-pool-modifier",
        trigger: "always",
        target: {},
        value: "invalid-expression",
      };

      const result = resolveEffectValue(effect, quality, selection);
      expect(result).toBe(0);
    });
  });

  describe("resolveEffectTarget", () => {
    it("should return target as-is when no template variables", () => {
      const target: EffectTarget = {
        skill: "firearms",
      };

      const result = resolveEffectTarget(target, quality, selection);
      expect(result).toEqual(target);
    });

    it("should resolve template variable in skill target", () => {
      const target: EffectTarget = {
        skill: "{{specification}}",
      };

      const selectionWithSpec: QualitySelection = {
        ...selection,
        specification: "firearms",
      };

      const result = resolveEffectTarget(target, quality, selectionWithSpec);
      expect(result.skill).toBe("firearms");
    });

    it("should resolve template variable in limit target", () => {
      const target: EffectTarget = {
        limit: "{{specification}}" as "physical" | "mental" | "social" | "astral",
      };

      const selectionWithSpec: QualitySelection = {
        ...selection,
        specification: "physical",
      };

      const result = resolveEffectTarget(target, quality, selectionWithSpec);
      expect(result.limit).toBe("physical");
    });

    it("should resolve template variable in attribute target", () => {
      const target: EffectTarget = {
        attribute: "{{specification}}",
      };

      const selectionWithSpec: QualitySelection = {
        ...selection,
        specification: "agility",
      };

      const result = resolveEffectTarget(target, quality, selectionWithSpec);
      expect(result.attribute).toBe("agility");
    });
  });

  describe("matchesCondition", () => {
    it("should return true when no condition specified", () => {
      const context: TestContext = {
        skill: "firearms",
      };

      const result = matchesCondition(undefined, context);
      expect(result).toBe(true);
    });

    it("should match environment condition", () => {
      const condition: EffectCondition = {
        environment: ["dim-light", "darkness"],
      };

      const context1: TestContext = {
        skill: "firearms",
        environment: ["dim-light"],
      };

      const context2: TestContext = {
        skill: "firearms",
        environment: ["bright-light"],
      };

      expect(matchesCondition(condition, context1)).toBe(true);
      expect(matchesCondition(condition, context2)).toBe(false);
    });

    it("should match target type condition", () => {
      const condition: EffectCondition = {
        targetType: ["spirit", "awakened"],
      };

      const context1: TestContext = {
        skill: "firearms",
        targetType: ["spirit"],
      };

      const context2: TestContext = {
        skill: "firearms",
        targetType: ["mundane"],
      };

      expect(matchesCondition(condition, context1)).toBe(true);
      expect(matchesCondition(condition, context2)).toBe(false);
    });

    it("should match character state condition", () => {
      const condition: EffectCondition = {
        characterState: ["astrally-projecting"],
      };

      const context1: TestContext = {
        skill: "firearms",
        characterState: ["astrally-projecting"],
      };

      const context2: TestContext = {
        skill: "firearms",
        characterState: ["in-combat"],
      };

      expect(matchesCondition(condition, context1)).toBe(true);
      expect(matchesCondition(condition, context2)).toBe(false);
    });

    it("should match opposed by condition", () => {
      const condition: EffectCondition = {
        opposedBy: "assensing",
      };

      const context1: TestContext = {
        skill: "firearms",
        opposedBy: "assensing",
      };

      const context2: TestContext = {
        skill: "firearms",
        opposedBy: "perception",
      };

      expect(matchesCondition(condition, context1)).toBe(true);
      expect(matchesCondition(condition, context2)).toBe(false);
    });

    it("should match multiple conditions", () => {
      const condition: EffectCondition = {
        environment: ["dim-light"],
        targetType: ["spirit"],
      };

      const context1: TestContext = {
        skill: "firearms",
        environment: ["dim-light"],
        targetType: ["spirit"],
      };

      const context2: TestContext = {
        skill: "firearms",
        environment: ["dim-light"],
        targetType: ["mundane"],
      };

      expect(matchesCondition(condition, context1)).toBe(true);
      expect(matchesCondition(condition, context2)).toBe(false);
    });
  });

  describe("matchesTrigger", () => {
    it('should always match "always" trigger', () => {
      const context: TestContext = {
        skill: "firearms",
      };

      expect(matchesTrigger("always", context)).toBe(true);
    });

    it("should match skill-test trigger", () => {
      const context1: TestContext = {
        skill: "firearms",
      };

      const context2: TestContext = {
        skillGroup: "combat",
      };

      const context3: TestContext = {
        testCategory: "combat",
      };

      const context4: TestContext = {
        attribute: "agility",
      };

      expect(matchesTrigger("skill-test", context1)).toBe(true);
      expect(matchesTrigger("skill-test", context2)).toBe(true);
      expect(matchesTrigger("skill-test", context3)).toBe(true);
      expect(matchesTrigger("skill-test", context4)).toBe(false);
    });

    it("should match attribute-test trigger", () => {
      const context1: TestContext = {
        attribute: "agility",
      };

      const context2: TestContext = {
        skill: "firearms",
      };

      expect(matchesTrigger("attribute-test", context1)).toBe(true);
      expect(matchesTrigger("attribute-test", context2)).toBe(false);
    });

    it("should match combat-action trigger", () => {
      const context1: CombatContext = {
        actionType: "melee-attack",
      };

      const context2: CombatContext = {
        isAttacking: true,
      };

      const context3: CombatContext = {
        isDefending: true,
      };

      const context4: TestContext = {
        skill: "firearms",
      };

      expect(matchesTrigger("combat-action", context1)).toBe(true);
      expect(matchesTrigger("combat-action", context2)).toBe(true);
      expect(matchesTrigger("combat-action", context3)).toBe(true);
      expect(matchesTrigger("combat-action", context4)).toBe(false);
    });

    it("should match defense-test trigger", () => {
      const context1: TestContext = {
        isDefenseTest: true,
      };

      const context2: TestContext = {
        isDefenseTest: false,
      };

      expect(matchesTrigger("defense-test", context1)).toBe(true);
      expect(matchesTrigger("defense-test", context2)).toBe(false);
    });

    it("should match resistance-test trigger", () => {
      const context1: TestContext = {
        isResistanceTest: true,
      };

      const context2: TestContext = {
        isResistanceTest: false,
      };

      expect(matchesTrigger("resistance-test", context1)).toBe(true);
      expect(matchesTrigger("resistance-test", context2)).toBe(false);
    });

    it("should match social-test trigger", () => {
      const context1: TestContext = {
        testCategory: "social",
      };

      const context2: TestContext = {
        testCategory: "combat",
      };

      expect(matchesTrigger("social-test", context1)).toBe(true);
      expect(matchesTrigger("social-test", context2)).toBe(false);
    });

    it("should match magic-use trigger", () => {
      const context1: MagicContext = {
        actionType: "casting",
      };

      const context2: MagicContext = {
        actionType: "summoning",
      };

      const context3: TestContext = {
        skill: "firearms",
      };

      expect(matchesTrigger("magic-use", context1)).toBe(true);
      expect(matchesTrigger("magic-use", context2)).toBe(true);
      expect(matchesTrigger("magic-use", context3)).toBe(false);
    });

    it("should match matrix-action trigger", () => {
      const context1: MatrixContext = {
        matrixAction: "hack",
      };

      const context2: MatrixContext = {
        matrixMode: "vr-hot",
      };

      const context3: TestContext = {
        skill: "firearms",
      };

      expect(matchesTrigger("matrix-action", context1)).toBe(true);
      expect(matchesTrigger("matrix-action", context2)).toBe(true);
      expect(matchesTrigger("matrix-action", context3)).toBe(false);
    });
  });

  describe("shouldApplyEffect", () => {
    it("should apply effect when trigger and condition match", () => {
      const effect: QualityEffect = {
        id: "test-effect",
        type: "dice-pool-modifier",
        trigger: "skill-test",
        target: { skill: "firearms" },
        condition: {
          environment: ["dim-light"],
        },
        value: 1,
      };

      const context: TestContext = {
        skill: "firearms",
        environment: ["dim-light"],
      };

      expect(shouldApplyEffect(effect, context)).toBe(true);
    });

    it("should not apply when trigger does not match", () => {
      const effect: QualityEffect = {
        id: "test-effect",
        type: "dice-pool-modifier",
        trigger: "skill-test",
        target: { skill: "firearms" },
        value: 1,
      };

      const context: TestContext = {
        attribute: "agility",
      };

      expect(shouldApplyEffect(effect, context)).toBe(false);
    });

    it("should not apply when condition does not match", () => {
      const effect: QualityEffect = {
        id: "test-effect",
        type: "dice-pool-modifier",
        trigger: "skill-test",
        target: { skill: "firearms" },
        condition: {
          environment: ["dim-light"],
        },
        value: 1,
      };

      const context: TestContext = {
        skill: "firearms",
        environment: ["bright-light"],
      };

      expect(shouldApplyEffect(effect, context)).toBe(false);
    });
  });

  describe("getActiveEffects", () => {
    it("should return empty array for inactive quality", () => {
      const inactiveSelection: QualitySelection = {
        ...selection,
        active: false,
      };

      const qualityWithEffect: Quality = {
        ...quality,
        effects: [
          {
            id: "test-effect",
            type: "dice-pool-modifier",
            trigger: "always",
            target: {},
            value: 2,
          },
        ],
      };

      const context: TestContext = {
        skill: "firearms",
      };

      const result = getActiveEffects(
        createMockCharacter(),
        qualityWithEffect,
        inactiveSelection,
        context
      );
      expect(result).toHaveLength(0);
    });

    it("should return active effects that match context", () => {
      const qualityWithEffects: Quality = {
        ...quality,
        effects: [
          {
            id: "effect-1",
            type: "dice-pool-modifier",
            trigger: "skill-test",
            target: { skill: "firearms" },
            value: 2,
          },
          {
            id: "effect-2",
            type: "dice-pool-modifier",
            trigger: "skill-test",
            target: { skill: "stealth" },
            value: 1,
          },
        ],
      };

      const context: TestContext = {
        skill: "firearms",
        testCategory: "combat",
      };

      const result = getActiveEffects(
        createMockCharacter(),
        qualityWithEffects,
        selection,
        context
      );
      // Should only return effect-1 since it targets firearms
      const firearmsEffects = result.filter((e) => e.effect.id === "effect-1");
      expect(firearmsEffects).toHaveLength(1);
      expect(firearmsEffects[0].value).toBe(2);
    });

    it("should use level-specific effects when rating specified", () => {
      const qualityWithLevels: Quality = {
        ...quality,
        levels: [
          {
            level: 1,
            name: "Rating 1",
            karma: 5,
            effects: [
              {
                id: "level-1-effect",
                type: "dice-pool-modifier",
                trigger: "always",
                target: {},
                value: 1,
              },
            ],
          },
          {
            level: 2,
            name: "Rating 2",
            karma: 10,
            effects: [
              {
                id: "level-2-effect",
                type: "dice-pool-modifier",
                trigger: "always",
                target: {},
                value: 2,
              },
            ],
          },
        ],
        maxRating: 2,
      };

      const selectionWithRating: QualitySelection = {
        ...selection,
        rating: 2,
      };

      const context: TestContext = {
        skill: "firearms",
      };

      const result = getActiveEffects(
        createMockCharacter(),
        qualityWithLevels,
        selectionWithRating,
        context
      );
      expect(result).toHaveLength(1);
      expect(result[0].effect.id).toBe("level-2-effect");
      expect(result[0].value).toBe(2);
    });

    it("should resolve template variables in effects", () => {
      const qualityWithTemplate: Quality = {
        ...quality,
        effects: [
          {
            id: "template-effect",
            type: "dice-pool-modifier",
            trigger: "always",
            target: { skill: "{{specification}}" },
            value: "{{rating}}",
          },
        ],
      };

      const selectionWithData: QualitySelection = {
        ...selection,
        rating: 3,
        specification: "firearms",
      };

      const context: TestContext = {
        skill: "firearms",
      };

      const result = getActiveEffects(
        createMockCharacter(),
        qualityWithTemplate,
        selectionWithData,
        context
      );
      expect(result).toHaveLength(1);
      expect(result[0].value).toBe(3);
      expect(result[0].target.skill).toBe("firearms");
    });
  });

  describe("filterEffectsByTrigger", () => {
    it("should filter effects by trigger type", () => {
      const effects = [
        {
          effect: {
            id: "effect-1",
            type: "dice-pool-modifier" as const,
            trigger: "always" as EffectTrigger,
            target: {},
            value: 1,
          },
          value: 1,
          target: {},
          quality,
          selection,
        },
        {
          effect: {
            id: "effect-2",
            type: "dice-pool-modifier" as const,
            trigger: "skill-test" as EffectTrigger,
            target: {},
            value: 2,
          },
          value: 2,
          target: {},
          quality,
          selection,
        },
      ];

      const filtered = filterEffectsByTrigger(effects, "always");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].effect.id).toBe("effect-1");
    });
  });

  describe("filterEffectsByTarget", () => {
    it("should filter effects by target matcher", () => {
      const effects = [
        {
          effect: {
            id: "effect-1",
            type: "dice-pool-modifier" as const,
            trigger: "always" as EffectTrigger,
            target: { skill: "firearms" },
            value: 1,
          },
          value: 1,
          target: { skill: "firearms" },
          quality,
          selection,
        },
        {
          effect: {
            id: "effect-2",
            type: "dice-pool-modifier" as const,
            trigger: "always" as EffectTrigger,
            target: { skill: "stealth" },
            value: 2,
          },
          value: 2,
          target: { skill: "stealth" },
          quality,
          selection,
        },
      ];

      const filtered = filterEffectsByTarget(effects, (target) => target.skill === "firearms");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].effect.id).toBe("effect-1");
    });
  });
});
