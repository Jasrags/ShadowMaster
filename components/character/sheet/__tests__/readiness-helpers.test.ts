/**
 * readiness-helpers Tests
 *
 * Verifies that all 7 readiness states produce correct labels, colors,
 * and that equipment type arrays contain the expected states.
 */

import { describe, it, expect } from "vitest";
import {
  getReadinessLabel,
  getReadinessColor,
  getActionCostLabel,
  getShortActionCostLabel,
  getActionCostColor,
  READINESS_BY_EQUIPMENT,
} from "../readiness-helpers";
import type { EquipmentReadiness, TransitionActionCost } from "@/lib/types/gear-state";
import type { ActionType } from "@/lib/rules/inventory";

// ---------------------------------------------------------------------------
// getReadinessLabel
// ---------------------------------------------------------------------------

describe("getReadinessLabel", () => {
  const cases: [EquipmentReadiness, string][] = [
    ["readied", "Readied"],
    ["holstered", "Holstered"],
    ["worn", "Worn"],
    ["pocketed", "Pocketed"],
    ["carried", "Carried"],
    ["stored", "Stored"],
    ["stashed", "Stashed"],
  ];

  it.each(cases)('returns "%s" → "%s"', (readiness, expected) => {
    expect(getReadinessLabel(readiness)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// getReadinessColor
// ---------------------------------------------------------------------------

describe("getReadinessColor", () => {
  const cases: [EquipmentReadiness, string][] = [
    ["readied", "emerald"],
    ["holstered", "amber"],
    ["worn", "blue"],
    ["pocketed", "cyan"],
    ["carried", "orange"],
    ["stored", "zinc"],
    ["stashed", "violet"],
  ];

  it.each(cases)('returns color containing "%s" for state "%s"', (readiness, colorHint) => {
    expect(getReadinessColor(readiness)).toContain(colorHint);
  });

  it("returns non-empty string for every state", () => {
    const allStates: EquipmentReadiness[] = [
      "readied",
      "holstered",
      "worn",
      "pocketed",
      "carried",
      "stored",
      "stashed",
    ];
    for (const state of allStates) {
      expect(getReadinessColor(state).length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// getActionCostLabel
// ---------------------------------------------------------------------------

describe("getActionCostLabel", () => {
  const cases: [TransitionActionCost, string][] = [
    ["free", "Free Action"],
    ["simple", "Simple Action"],
    ["complex", "Complex Action"],
    ["narrative", "Narrative Time"],
    [null, ""],
  ];

  it.each(cases)('returns "%s" → "%s"', (cost, expected) => {
    expect(getActionCostLabel(cost)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// getShortActionCostLabel
// ---------------------------------------------------------------------------

describe("getShortActionCostLabel", () => {
  const cases: [ActionType, string][] = [
    ["free", "F"],
    ["simple", "S"],
    ["complex", "C"],
    ["narrative", "N"],
    ["none", ""],
  ];

  it.each(cases)('returns "%s" → "%s"', (cost, expected) => {
    expect(getShortActionCostLabel(cost)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// getActionCostColor
// ---------------------------------------------------------------------------

describe("getActionCostColor", () => {
  it("returns emerald for free", () => {
    expect(getActionCostColor("free")).toContain("emerald");
  });

  it("returns blue for simple", () => {
    expect(getActionCostColor("simple")).toContain("blue");
  });

  it("returns violet for complex", () => {
    expect(getActionCostColor("complex")).toContain("violet");
  });

  it("returns zinc for narrative", () => {
    expect(getActionCostColor("narrative")).toContain("zinc");
  });

  it("returns zinc for none", () => {
    expect(getActionCostColor("none")).toContain("zinc");
  });
});

// ---------------------------------------------------------------------------
// READINESS_BY_EQUIPMENT
// ---------------------------------------------------------------------------

describe("READINESS_BY_EQUIPMENT", () => {
  it("has weapon states without worn/pocketed", () => {
    expect(READINESS_BY_EQUIPMENT.weapon).toEqual(["readied", "holstered", "carried", "stashed"]);
  });

  it("has armor states without readied/holstered/pocketed", () => {
    expect(READINESS_BY_EQUIPMENT.armor).toEqual(["worn", "carried", "stashed"]);
  });

  it("has gear states with all body-carry options", () => {
    expect(READINESS_BY_EQUIPMENT.gear).toEqual([
      "worn",
      "holstered",
      "pocketed",
      "carried",
      "stashed",
    ]);
  });

  it("has electronics states without readied/worn", () => {
    expect(READINESS_BY_EQUIPMENT.electronics).toEqual([
      "holstered",
      "pocketed",
      "carried",
      "stashed",
    ]);
  });
});
