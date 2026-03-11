/**
 * Tests for creation method filtering by campaign settings
 */

import { describe, it, expect } from "vitest";
import {
  getAvailableCreationMethods,
  validateCreationMethodForCampaign,
} from "@/lib/rules/creation-method-filter";
import type { CreationMethod, ID } from "@/lib/types";
import type { Campaign } from "@/lib/types/campaign";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function makeMethod(id: string, name: string): CreationMethod {
  return {
    id,
    editionId: "sr5",
    editionCode: "sr5",
    name,
    type: "priority",
    steps: [],
    budgets: [],
    constraints: [],
    version: "1.0.0",
    createdAt: "2026-01-01T00:00:00Z",
  } as CreationMethod;
}

const priorityMethod = makeMethod("sr5-priority", "Priority");
const sumToTenMethod = makeMethod("sr5-sum-to-ten", "Sum to Ten");
const pointBuyMethod = makeMethod("sr5-point-buy", "Point Buy");
const allMethods = [priorityMethod, sumToTenMethod, pointBuyMethod];

function makeCampaign(enabledCreationMethodIds: ID[]): Campaign {
  return {
    id: "campaign-1",
    gmId: "gm-1",
    title: "Test Campaign",
    status: "active",
    editionId: "sr5",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds,
    gameplayLevel: "street",
    advancementSettings: {
      trainingTimeMultiplier: 1,
      attributeKarmaMultiplier: 5,
      skillKarmaMultiplier: 2,
      skillGroupKarmaMultiplier: 5,
      knowledgeSkillKarmaMultiplier: 1,
      specializationKarmaCost: 7,
      spellKarmaCost: 5,
      complexFormKarmaCost: 4,
      attributeRatingCap: 10,
      skillRatingCap: 13,
      allowInstantAdvancement: false,
      requireApproval: true,
    },
    playerIds: [],
    visibility: "private",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  } as Campaign;
}

// =============================================================================
// getAvailableCreationMethods
// =============================================================================

describe("getAvailableCreationMethods", () => {
  describe("standalone creation (no campaign)", () => {
    it("returns all methods when no campaign is provided", () => {
      const result = getAvailableCreationMethods(allMethods, null, "sr5-priority");
      expect(result.availableMethods).toEqual(allMethods);
      expect(result.isCurrentMethodValid).toBe(true);
      expect(result.hasNoMethods).toBe(false);
    });

    it("returns all methods when campaign is undefined", () => {
      const result = getAvailableCreationMethods(allMethods, undefined, "sr5-priority");
      expect(result.availableMethods).toEqual(allMethods);
    });

    it("marks invalid current method and suggests first", () => {
      const result = getAvailableCreationMethods(allMethods, null, "nonexistent");
      expect(result.isCurrentMethodValid).toBe(false);
      expect(result.suggestedMethodId).toBe("sr5-priority");
    });

    it("handles empty methods list", () => {
      const result = getAvailableCreationMethods([], null, "sr5-priority");
      expect(result.availableMethods).toEqual([]);
      expect(result.hasNoMethods).toBe(true);
      expect(result.suggestedMethodId).toBeNull();
    });
  });

  describe("campaign with restrictions", () => {
    it("filters to only enabled methods", () => {
      const campaign = makeCampaign(["sr5-priority"]);
      const result = getAvailableCreationMethods(allMethods, campaign, "sr5-priority");
      expect(result.availableMethods).toEqual([priorityMethod]);
      expect(result.isCurrentMethodValid).toBe(true);
      expect(result.hasNoMethods).toBe(false);
    });

    it("filters to multiple enabled methods", () => {
      const campaign = makeCampaign(["sr5-priority", "sr5-sum-to-ten"]);
      const result = getAvailableCreationMethods(allMethods, campaign, "sr5-priority");
      expect(result.availableMethods).toEqual([priorityMethod, sumToTenMethod]);
    });

    it("marks current method invalid if not in enabled list", () => {
      const campaign = makeCampaign(["sr5-sum-to-ten"]);
      const result = getAvailableCreationMethods(allMethods, campaign, "sr5-priority");
      expect(result.isCurrentMethodValid).toBe(false);
      expect(result.suggestedMethodId).toBe("sr5-sum-to-ten");
    });

    it("returns empty when enabled IDs match no methods", () => {
      const campaign = makeCampaign(["nonexistent-method"]);
      const result = getAvailableCreationMethods(allMethods, campaign, "sr5-priority");
      expect(result.availableMethods).toEqual([]);
      expect(result.hasNoMethods).toBe(true);
      expect(result.suggestedMethodId).toBeNull();
    });
  });

  describe("campaign with no restrictions", () => {
    it("returns all methods when enabledCreationMethodIds is empty", () => {
      const campaign = makeCampaign([]);
      const result = getAvailableCreationMethods(allMethods, campaign, "sr5-priority");
      expect(result.availableMethods).toEqual(allMethods);
    });
  });

  describe("null/undefined currentMethodId", () => {
    it("handles null currentMethodId", () => {
      const result = getAvailableCreationMethods(allMethods, null, null);
      expect(result.isCurrentMethodValid).toBe(false);
      expect(result.suggestedMethodId).toBe("sr5-priority");
    });

    it("handles undefined currentMethodId", () => {
      const result = getAvailableCreationMethods(allMethods, null, undefined);
      expect(result.isCurrentMethodValid).toBe(false);
      expect(result.suggestedMethodId).toBe("sr5-priority");
    });
  });
});

// =============================================================================
// validateCreationMethodForCampaign
// =============================================================================

describe("validateCreationMethodForCampaign", () => {
  it("returns null for standalone creation (no campaign)", () => {
    expect(validateCreationMethodForCampaign("sr5-priority", null)).toBeNull();
  });

  it("returns null for campaign with no restrictions", () => {
    const campaign = makeCampaign([]);
    expect(validateCreationMethodForCampaign("sr5-priority", campaign)).toBeNull();
  });

  it("returns null for allowed method", () => {
    const campaign = makeCampaign(["sr5-priority", "sr5-sum-to-ten"]);
    expect(validateCreationMethodForCampaign("sr5-priority", campaign)).toBeNull();
  });

  it("returns error for disallowed method", () => {
    const campaign = makeCampaign(["sr5-sum-to-ten"]);
    const result = validateCreationMethodForCampaign("sr5-priority", campaign);
    expect(result).not.toBeNull();
    expect(result).toContain("sr5-priority");
    expect(result).toContain("not allowed");
  });

  it("returns null for undefined campaign", () => {
    expect(validateCreationMethodForCampaign("sr5-priority", undefined)).toBeNull();
  });
});
