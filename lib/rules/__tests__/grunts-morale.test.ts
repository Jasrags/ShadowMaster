/**
 * Unit tests for checkMorale in grunts.ts
 *
 * Verifies morale state transitions based on casualty percentage
 * and moraleBroken flag.
 */

import { describe, it, expect } from "vitest";
import type { GruntTeam, ProfessionalRating } from "@/lib/types";

import { checkMorale } from "../grunts";

/**
 * Build a minimal GruntTeam for morale testing.
 *
 * Defaults: PR 3 (breakThreshold 50%), team of 10, no lieutenant.
 */
function buildTeam(overrides: {
  professionalRating?: ProfessionalRating;
  initialSize?: number;
  casualties?: number;
  moraleBroken?: boolean;
  moraleState?: "steady" | "shaken" | "broken" | "routed";
  hasLieutenant?: boolean;
}): GruntTeam {
  const {
    professionalRating = 3,
    initialSize = 10,
    casualties = 0,
    moraleBroken = false,
    moraleState,
    hasLieutenant = false,
  } = overrides;

  return {
    id: "test-team",
    campaignId: "test-campaign",
    name: "Test Team",
    professionalRating,
    groupEdge: professionalRating,
    groupEdgeMax: professionalRating,
    baseGrunts: {
      attributes: {
        body: 4,
        agility: 4,
        reaction: 4,
        strength: 4,
        willpower: 4,
        logic: 3,
        intuition: 3,
        charisma: 3,
      },
      essence: 6,
      skills: {},
      gear: [],
      weapons: [],
      armor: [],
      conditionMonitorSize: 10,
    },
    initialSize,
    ...(hasLieutenant
      ? {
          lieutenant: {
            attributes: {
              body: 5,
              agility: 5,
              reaction: 5,
              strength: 5,
              willpower: 5,
              logic: 4,
              intuition: 4,
              charisma: 4,
            },
            essence: 6,
            skills: {},
            gear: [],
            weapons: [],
            armor: [],
            conditionMonitorSize: 11,
            canBoostProfessionalRating: false,
            usesIndividualInitiative: true,
          },
        }
      : {}),
    state: {
      activeCount: initialSize - casualties,
      casualties,
      moraleBroken,
      ...(moraleState !== undefined ? { moraleState } : {}),
    },
    createdAt: "2024-01-01T00:00:00Z",
  } as GruntTeam;
}

describe("checkMorale", () => {
  it('returns "steady" when casualties are below shaken threshold', () => {
    // PR 3 -> breakThreshold 50%, shakenThreshold 25%
    // 1/10 = 10% -> below 25% -> steady
    const team = buildTeam({ casualties: 1 });
    expect(checkMorale(team)).toBe("steady");
  });

  it('returns "shaken" when casualties are between shaken and break thresholds', () => {
    // PR 3 -> breakThreshold 50%, shakenThreshold 25%
    // 3/10 = 30% -> between 25% and 50% -> shaken
    const team = buildTeam({ casualties: 3 });
    expect(checkMorale(team)).toBe("shaken");
  });

  it('returns "broken" when casualties reach break threshold and moraleBroken is false', () => {
    // PR 3 -> breakThreshold 50%
    // 5/10 = 50% -> at threshold, moraleBroken=false -> broken
    const team = buildTeam({ casualties: 5, moraleBroken: false });
    expect(checkMorale(team)).toBe("broken");
  });

  it('returns "routed" when casualties reach break threshold and moraleBroken is true', () => {
    // PR 3 -> breakThreshold 50%
    // 5/10 = 50% -> at threshold, moraleBroken=true -> routed
    const team = buildTeam({ casualties: 5, moraleBroken: true });
    expect(checkMorale(team)).toBe("routed");
  });

  it('returns "routed" when moraleState is already "routed"', () => {
    const team = buildTeam({ casualties: 0, moraleState: "routed" });
    expect(checkMorale(team)).toBe("routed");
  });
});
