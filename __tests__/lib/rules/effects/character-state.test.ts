/**
 * Tests for buildCharacterStateFlags utility.
 *
 * @see Issue #485
 */

import { describe, it, expect } from "vitest";
import { buildCharacterStateFlags } from "@/lib/rules/effects/character-state";
import { createMockCharacter } from "@/__tests__/mocks/storage";

describe("buildCharacterStateFlags", () => {
  it("returns empty flags for character without dynamic state", () => {
    const character = createMockCharacter();
    const flags = buildCharacterStateFlags(character);
    expect(flags).toEqual({});
  });

  it("returns empty flags for character with no qualities", () => {
    const character = createMockCharacter({
      positiveQualities: [],
      negativeQualities: [],
    });
    const flags = buildCharacterStateFlags(character);
    expect(flags).toEqual({});
  });

  it("detects active withdrawal from addiction quality", () => {
    const character = createMockCharacter({
      negativeQualities: [
        {
          qualityId: "addiction",
          source: "creation" as const,
          dynamicState: {
            type: "addiction",
            state: {
              substance: "Novacoke",
              substanceType: "physiological",
              severity: "moderate",
              originalSeverity: "moderate",
              lastDose: new Date().toISOString(),
              nextCravingCheck: new Date().toISOString(),
              cravingActive: false,
              withdrawalActive: true,
              withdrawalPenalty: 2,
              daysClean: 0,
              recoveryAttempts: 0,
            },
          },
        },
      ],
    });
    const flags = buildCharacterStateFlags(character);
    expect(flags.withdrawalActive).toBe(true);
    expect(flags.exposureActive).toBeUndefined();
  });

  it("does not flag withdrawal when withdrawalActive is false", () => {
    const character = createMockCharacter({
      negativeQualities: [
        {
          qualityId: "addiction",
          source: "creation" as const,
          dynamicState: {
            type: "addiction",
            state: {
              substance: "Novacoke",
              substanceType: "physiological",
              severity: "moderate",
              originalSeverity: "moderate",
              lastDose: new Date().toISOString(),
              nextCravingCheck: new Date().toISOString(),
              cravingActive: false,
              withdrawalActive: false,
              withdrawalPenalty: 0,
              daysClean: 0,
              recoveryAttempts: 0,
            },
          },
        },
      ],
    });
    const flags = buildCharacterStateFlags(character);
    expect(flags.withdrawalActive).toBeUndefined();
  });

  it("detects active exposure from allergy quality", () => {
    const character = createMockCharacter({
      negativeQualities: [
        {
          qualityId: "allergy-common-mild",
          source: "creation" as const,
          dynamicState: {
            type: "allergy",
            state: {
              allergen: "Pollutants",
              prevalence: "common",
              severity: "mild",
              currentlyExposed: true,
              damageAccumulated: 0,
            },
          },
        },
      ],
    });
    const flags = buildCharacterStateFlags(character);
    expect(flags.exposureActive).toBe(true);
    expect(flags.withdrawalActive).toBeUndefined();
  });

  it("detects both withdrawal and exposure simultaneously", () => {
    const character = createMockCharacter({
      negativeQualities: [
        {
          qualityId: "addiction",
          source: "creation" as const,
          dynamicState: {
            type: "addiction",
            state: {
              substance: "Novacoke",
              substanceType: "physiological",
              severity: "moderate",
              originalSeverity: "moderate",
              lastDose: new Date().toISOString(),
              nextCravingCheck: new Date().toISOString(),
              cravingActive: false,
              withdrawalActive: true,
              withdrawalPenalty: 2,
              daysClean: 0,
              recoveryAttempts: 0,
            },
          },
        },
        {
          qualityId: "allergy-common-mild",
          source: "creation" as const,
          dynamicState: {
            type: "allergy",
            state: {
              allergen: "Pollutants",
              prevalence: "common",
              severity: "mild",
              currentlyExposed: true,
              damageAccumulated: 0,
            },
          },
        },
      ],
    });
    const flags = buildCharacterStateFlags(character);
    expect(flags.withdrawalActive).toBe(true);
    expect(flags.exposureActive).toBe(true);
  });

  it("ignores non-addiction/allergy dynamic states", () => {
    const character = createMockCharacter({
      negativeQualities: [
        {
          qualityId: "code-of-honor",
          source: "creation" as const,
          dynamicState: {
            type: "code-of-honor",
            state: {
              codeName: "Bushido",
              description: "Follow the warrior code",
              violations: [],
              totalKarmaLost: 0,
            },
          },
        },
      ],
    });
    const flags = buildCharacterStateFlags(character);
    expect(flags).toEqual({});
  });
});
