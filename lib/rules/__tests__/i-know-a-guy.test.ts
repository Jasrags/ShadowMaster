/**
 * Tests for "I Know a Guy" Edge-based contact acquisition (Run Faster p. 178)
 *
 * Characters can spend Edge to pull a contact from their past mid-session.
 * The contact starts at Loyalty 1 and must be confirmed with Karma after
 * the mission to become permanent.
 */

import { describe, it, expect } from "vitest";
import {
  calculateEdgeCost,
  validateIKnowAGuy,
  createEdgeContactSpec,
  calculateConfirmationKarmaCost,
  canConfirmEdgeContact,
} from "../i-know-a-guy";

// =============================================================================
// EDGE COST CALCULATION
// =============================================================================

describe("calculateEdgeCost", () => {
  it("should cost 2× the desired Connection Rating", () => {
    expect(calculateEdgeCost(1)).toBe(2);
    expect(calculateEdgeCost(3)).toBe(6);
    expect(calculateEdgeCost(6)).toBe(12);
  });

  it("should handle Connection 0 (edge case)", () => {
    expect(calculateEdgeCost(0)).toBe(0);
  });

  it("should handle high Connection ratings", () => {
    expect(calculateEdgeCost(12)).toBe(24);
  });
});

// =============================================================================
// VALIDATION
// =============================================================================

describe("validateIKnowAGuy", () => {
  it("should allow when character has sufficient Edge", () => {
    const result = validateIKnowAGuy({
      currentEdge: 6,
      desiredConnection: 3,
    });

    expect(result.allowed).toBe(true);
    expect(result.edgeCost).toBe(6);
  });

  it("should reject when character has insufficient Edge", () => {
    const result = validateIKnowAGuy({
      currentEdge: 4,
      desiredConnection: 3,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Insufficient Edge");
  });

  it("should allow when Edge exactly matches cost", () => {
    const result = validateIKnowAGuy({
      currentEdge: 6,
      desiredConnection: 3,
    });

    expect(result.allowed).toBe(true);
  });

  it("should reject Connection < 1", () => {
    const result = validateIKnowAGuy({
      currentEdge: 10,
      desiredConnection: 0,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Connection");
  });

  it("should reject Connection > 12", () => {
    const result = validateIKnowAGuy({
      currentEdge: 100,
      desiredConnection: 13,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Connection");
  });

  it("should reject negative Edge", () => {
    const result = validateIKnowAGuy({
      currentEdge: -1,
      desiredConnection: 1,
    });

    expect(result.allowed).toBe(false);
  });
});

// =============================================================================
// EDGE CONTACT SPEC CREATION
// =============================================================================

describe("createEdgeContactSpec", () => {
  it("should create spec with Loyalty 1", () => {
    const spec = createEdgeContactSpec({
      desiredConnection: 4,
      archetype: "Fixer",
      name: "Old Buddy",
    });

    expect(spec.loyalty).toBe(1);
  });

  it("should use the desired Connection", () => {
    const spec = createEdgeContactSpec({
      desiredConnection: 5,
      archetype: "Street Doc",
      name: "Doc Martinez",
    });

    expect(spec.connection).toBe(5);
  });

  it("should set acquisitionMethod to 'edge'", () => {
    const spec = createEdgeContactSpec({
      desiredConnection: 3,
      archetype: "Fixer",
      name: "Old Contact",
    });

    expect(spec.acquisitionMethod).toBe("edge");
  });

  it("should flag as pending karma confirmation", () => {
    const spec = createEdgeContactSpec({
      desiredConnection: 3,
      archetype: "Fixer",
      name: "Someone",
    });

    expect(spec.pendingKarmaConfirmation).toBe(true);
  });

  it("should include the archetype and name", () => {
    const spec = createEdgeContactSpec({
      desiredConnection: 2,
      archetype: "Street Samurai",
      name: "Razor",
    });

    expect(spec.archetype).toBe("Street Samurai");
    expect(spec.name).toBe("Razor");
  });

  it("should include optional description", () => {
    const spec = createEdgeContactSpec({
      desiredConnection: 2,
      archetype: "Fixer",
      name: "Test",
      description: "An old army buddy",
    });

    expect(spec.description).toBe("An old army buddy");
  });
});

// =============================================================================
// KARMA CONFIRMATION
// =============================================================================

describe("calculateConfirmationKarmaCost", () => {
  it("should cost Connection + Loyalty (which is always 1)", () => {
    // Connection 3 + Loyalty 1 = 4 karma
    expect(calculateConfirmationKarmaCost(3)).toBe(4);
  });

  it("should scale with Connection", () => {
    expect(calculateConfirmationKarmaCost(1)).toBe(2); // 1 + 1
    expect(calculateConfirmationKarmaCost(6)).toBe(7); // 6 + 1
    expect(calculateConfirmationKarmaCost(12)).toBe(13); // 12 + 1
  });
});

describe("canConfirmEdgeContact", () => {
  it("should allow when character has sufficient Karma", () => {
    const result = canConfirmEdgeContact({
      connectionRating: 4,
      currentKarma: 10,
    });

    expect(result.allowed).toBe(true);
    expect(result.karmaCost).toBe(5); // 4 + 1
  });

  it("should reject when character has insufficient Karma", () => {
    const result = canConfirmEdgeContact({
      connectionRating: 6,
      currentKarma: 3,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Insufficient karma");
    expect(result.karmaCost).toBe(7); // 6 + 1
  });

  it("should allow when Karma exactly matches cost", () => {
    const result = canConfirmEdgeContact({
      connectionRating: 4,
      currentKarma: 5,
    });

    expect(result.allowed).toBe(true);
  });
});
