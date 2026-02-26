/**
 * Action Mapper Tests
 *
 * Tests conversion from ActionDefinition (ruleset format)
 * to MatrixAction (rule engine format).
 */

import { describe, it, expect } from "vitest";
import type { ActionDefinition } from "@/lib/types/action-definitions";
import {
  actionDefinitionToMatrixAction,
  subcategoryToMatrixCategory,
  limitTypeToAttribute,
} from "../action-mapper";

// =============================================================================
// subcategoryToMatrixCategory
// =============================================================================

describe("subcategoryToMatrixCategory", () => {
  it("maps hacking to sleaze", () => {
    expect(subcategoryToMatrixCategory("hacking")).toBe("sleaze");
  });

  it("maps cybercombat to attack", () => {
    expect(subcategoryToMatrixCategory("cybercombat")).toBe("attack");
  });

  it("maps electronic-warfare to device", () => {
    expect(subcategoryToMatrixCategory("electronic-warfare")).toBe("device");
  });

  it("maps technomancer to persona", () => {
    expect(subcategoryToMatrixCategory("technomancer")).toBe("persona");
  });

  it("defaults to persona for unknown subcategory", () => {
    expect(subcategoryToMatrixCategory(undefined)).toBe("persona");
  });
});

// =============================================================================
// limitTypeToAttribute
// =============================================================================

describe("limitTypeToAttribute", () => {
  it("maps Attack to attack", () => {
    expect(limitTypeToAttribute("Attack")).toBe("attack");
  });

  it("maps Sleaze to sleaze", () => {
    expect(limitTypeToAttribute("Sleaze")).toBe("sleaze");
  });

  it("maps Data Processing to dataProcessing", () => {
    expect(limitTypeToAttribute("Data Processing")).toBe("dataProcessing");
  });

  it("maps Firewall to firewall", () => {
    expect(limitTypeToAttribute("Firewall")).toBe("firewall");
  });

  it("defaults to dataProcessing for unknown", () => {
    expect(limitTypeToAttribute(undefined)).toBe("dataProcessing");
    expect(limitTypeToAttribute("something-else")).toBe("dataProcessing");
  });
});

// =============================================================================
// actionDefinitionToMatrixAction
// =============================================================================

describe("actionDefinitionToMatrixAction", () => {
  const hackOnTheFly: ActionDefinition = {
    id: "hack-on-the-fly",
    name: "Hack on the Fly",
    description: "Gain a mark on a target without being noticed.",
    type: "complex",
    domain: "matrix",
    subcategory: "hacking",
    cost: { actionType: "complex" },
    prerequisites: [],
    modifiers: [],
    effects: [],
    tags: ["illegal"],
    rollConfig: {
      skill: "hacking",
      attribute: "logic",
      limitType: "Sleaze",
    },
  };

  it("maps basic fields correctly", () => {
    const result = actionDefinitionToMatrixAction(hackOnTheFly);
    expect(result).not.toBeNull();
    expect(result!.id).toBe("hack-on-the-fly");
    expect(result!.name).toBe("Hack on the Fly");
    expect(result!.description).toBe("Gain a mark on a target without being noticed.");
    expect(result!.skill).toBe("hacking");
    expect(result!.attribute).toBe("logic");
  });

  it("maps illegal tag to legality", () => {
    const result = actionDefinitionToMatrixAction(hackOnTheFly);
    expect(result!.legality).toBe("illegal");
  });

  it("maps legal action correctly", () => {
    const matrixPerception: ActionDefinition = {
      ...hackOnTheFly,
      id: "matrix-perception",
      name: "Matrix Perception",
      subcategory: "electronic-warfare",
      tags: [],
      rollConfig: { skill: "computer", attribute: "intuition", limitType: "Data Processing" },
    };
    const result = actionDefinitionToMatrixAction(matrixPerception);
    expect(result!.legality).toBe("legal");
  });

  it("extracts mark requirement from prerequisites", () => {
    const editFile: ActionDefinition = {
      ...hackOnTheFly,
      id: "edit-file",
      prerequisites: [{ type: "resource", requirement: "marks", minimumValue: 1 }],
    };
    const result = actionDefinitionToMatrixAction(editFile);
    expect(result!.marksRequired).toBe(1);
  });

  it("defaults to 0 marks when no mark prerequisite", () => {
    const result = actionDefinitionToMatrixAction(hackOnTheFly);
    expect(result!.marksRequired).toBe(0);
  });

  it("maps limitType to limitAttribute", () => {
    const result = actionDefinitionToMatrixAction(hackOnTheFly);
    expect(result!.limitAttribute).toBe("sleaze");
  });

  it("maps subcategory to category", () => {
    const result = actionDefinitionToMatrixAction(hackOnTheFly);
    expect(result!.category).toBe("sleaze"); // hacking → sleaze
  });

  it("returns null for actions without rollConfig", () => {
    const sendMessage: ActionDefinition = {
      ...hackOnTheFly,
      id: "send-message",
      rollConfig: undefined,
    };
    expect(actionDefinitionToMatrixAction(sendMessage)).toBeNull();
  });

  it("returns null for actions without skill in rollConfig", () => {
    const noSkill: ActionDefinition = {
      ...hackOnTheFly,
      id: "no-skill",
      rollConfig: { attribute: "logic" },
    };
    expect(actionDefinitionToMatrixAction(noSkill)).toBeNull();
  });

  it("returns null for actions without attribute in rollConfig", () => {
    const noAttr: ActionDefinition = {
      ...hackOnTheFly,
      id: "no-attr",
      rollConfig: { skill: "hacking" },
    };
    expect(actionDefinitionToMatrixAction(noAttr)).toBeNull();
  });

  it("handles high mark requirements (3 marks)", () => {
    const formatDevice: ActionDefinition = {
      ...hackOnTheFly,
      id: "format-device",
      prerequisites: [{ type: "resource", requirement: "marks", minimumValue: 3 }],
    };
    const result = actionDefinitionToMatrixAction(formatDevice);
    expect(result!.marksRequired).toBe(3);
  });
});
