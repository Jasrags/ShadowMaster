/**
 * Tests for Johnson profiles data integrity and loader
 *
 * Validates Mr. Johnson faction profiles, notoriety triggers,
 * run phases, and betrayal types from Run Faster pp. 196-211.
 */

import { describe, it, expect } from "vitest";
import {
  extractJohnsonProfiles,
  extractJohnsonFactions,
  extractNotorietyTriggers,
  extractRunPhases,
  extractBetrayalTypes,
} from "../loader";
import type { LoadedRuleset } from "../loader-types";
import type {
  JohnsonFactionCategory,
  BetrayalSeverity,
  JohnsonProfilesModulePayload,
} from "../module-payloads";

// =============================================================================
// TEST DATA: Load real data from run-faster.json
// =============================================================================

import runFasterData from "../../../data/editions/sr5/run-faster.json";
const payload = runFasterData.modules.johnsonProfiles.payload as JohnsonProfilesModulePayload;

const KEBAB_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const VALID_FACTION_CATEGORIES: JohnsonFactionCategory[] = [
  "megacorporate",
  "syndicate",
  "extremist",
  "amateur",
];

const VALID_BETRAYAL_SEVERITIES: BetrayalSeverity[] = ["moderate", "severe", "lethal"];

// =============================================================================
// FACTION DATA INTEGRITY
// =============================================================================

describe("Johnson Factions Data Integrity", () => {
  it("should have exactly 18 factions", () => {
    expect(payload.factions).toHaveLength(18);
  });

  it("should have unique IDs", () => {
    const ids = payload.factions.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have kebab-case IDs", () => {
    for (const faction of payload.factions) {
      expect(faction.id).toMatch(KEBAB_REGEX);
    }
  });

  it("should have valid categories", () => {
    for (const faction of payload.factions) {
      expect(VALID_FACTION_CATEGORIES).toContain(faction.category);
    }
  });

  it("should have 10 megacorporate factions", () => {
    const mega = payload.factions.filter((f) => f.category === "megacorporate");
    expect(mega).toHaveLength(10);
  });

  it("should have 4 syndicate factions", () => {
    const syndicates = payload.factions.filter((f) => f.category === "syndicate");
    expect(syndicates).toHaveLength(4);
  });

  it("should have 3 extremist factions", () => {
    const extremists = payload.factions.filter((f) => f.category === "extremist");
    expect(extremists).toHaveLength(3);
  });

  it("should have 1 amateur faction", () => {
    const amateurs = payload.factions.filter((f) => f.category === "amateur");
    expect(amateurs).toHaveLength(1);
  });

  it("should have source set to run-faster", () => {
    for (const faction of payload.factions) {
      expect(faction.source).toBe("run-faster");
    }
  });

  it("should have valid page numbers (196-211)", () => {
    for (const faction of payload.factions) {
      expect(faction.page).toBeGreaterThanOrEqual(196);
      expect(faction.page).toBeLessThanOrEqual(211);
    }
  });

  it("should have non-empty descriptions", () => {
    for (const faction of payload.factions) {
      expect(faction.description.length).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// NOTORIETY TRIGGERS DATA INTEGRITY
// =============================================================================

describe("Notoriety Triggers Data Integrity", () => {
  it("should have exactly 4 triggers", () => {
    expect(payload.notorietyTriggers).toHaveLength(4);
  });

  it("should have unique kebab-case IDs", () => {
    const ids = payload.notorietyTriggers.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const trigger of payload.notorietyTriggers) {
      expect(trigger.id).toMatch(KEBAB_REGEX);
    }
  });

  it("should have valid phase references when phase is set", () => {
    const phaseIds = new Set(payload.runPhases.map((p) => p.id));
    for (const trigger of payload.notorietyTriggers) {
      if (trigger.phase !== undefined) {
        expect(phaseIds).toContain(trigger.phase);
      }
    }
  });

  it("should have positive notoriety changes", () => {
    for (const trigger of payload.notorietyTriggers) {
      expect(trigger.notorietyChange).toBeGreaterThan(0);
    }
  });

  it("should have killing-a-paying-johnson as the highest notoriety trigger", () => {
    const killing = payload.notorietyTriggers.find((t) => t.id === "killing-a-paying-johnson");
    expect(killing).toBeDefined();
    expect(killing!.notorietyChange).toBe(3);
  });

  it("should have source set to run-faster", () => {
    for (const trigger of payload.notorietyTriggers) {
      expect(trigger.source).toBe("run-faster");
    }
  });
});

// =============================================================================
// RUN PHASES DATA INTEGRITY
// =============================================================================

describe("Run Phases Data Integrity", () => {
  it("should have exactly 3 phases", () => {
    expect(payload.runPhases).toHaveLength(3);
  });

  it("should have the-meet, the-run, the-handoff", () => {
    const ids = payload.runPhases.map((p) => p.id);
    expect(ids).toContain("the-meet");
    expect(ids).toContain("the-run");
    expect(ids).toContain("the-handoff");
  });

  it("should have kebab-case IDs", () => {
    for (const phase of payload.runPhases) {
      expect(phase.id).toMatch(KEBAB_REGEX);
    }
  });

  it("should have keyConsiderations arrays", () => {
    for (const phase of payload.runPhases) {
      expect(phase.keyConsiderations).toBeDefined();
      expect(phase.keyConsiderations!.length).toBeGreaterThan(0);
    }
  });

  it("should have source set to run-faster", () => {
    for (const phase of payload.runPhases) {
      expect(phase.source).toBe("run-faster");
    }
  });
});

// =============================================================================
// BETRAYAL TYPES DATA INTEGRITY
// =============================================================================

describe("Betrayal Types Data Integrity", () => {
  it("should have exactly 3 betrayal types", () => {
    expect(payload.betrayalTypes).toHaveLength(3);
  });

  it("should have unique kebab-case IDs", () => {
    const ids = payload.betrayalTypes.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const betrayal of payload.betrayalTypes) {
      expect(betrayal.id).toMatch(KEBAB_REGEX);
    }
  });

  it("should have valid severity values", () => {
    for (const betrayal of payload.betrayalTypes) {
      expect(VALID_BETRAYAL_SEVERITIES).toContain(betrayal.severity);
    }
  });

  it("should have warningSignals arrays", () => {
    for (const betrayal of payload.betrayalTypes) {
      expect(betrayal.warningSignals).toBeDefined();
      expect(betrayal.warningSignals!.length).toBeGreaterThan(0);
    }
  });

  it("should have source set to run-faster", () => {
    for (const betrayal of payload.betrayalTypes) {
      expect(betrayal.source).toBe("run-faster");
    }
  });
});

// =============================================================================
// LOADER TESTS
// =============================================================================

function createMockRuleset(johnsonPayload?: Partial<JohnsonProfilesModulePayload>): LoadedRuleset {
  const modules: Record<string, unknown> = {};
  if (johnsonPayload) {
    modules.johnsonProfiles = { payload: johnsonPayload };
  }
  return {
    books: [{ payload: { modules } }],
  } as unknown as LoadedRuleset;
}

describe("extractJohnsonProfiles", () => {
  it("should extract full payload from a ruleset", () => {
    const mockRuleset = createMockRuleset({
      factions: [
        {
          id: "test-corp",
          name: "Test Corp",
          category: "megacorporate",
          description: "A test corporation",
          source: "run-faster",
          page: 198,
        },
      ],
      notorietyTriggers: [],
      runPhases: [],
      betrayalTypes: [],
    });

    const result = extractJohnsonProfiles(mockRuleset);
    expect(result).not.toBeNull();
    expect(result!.factions).toHaveLength(1);
    expect(result!.factions[0].id).toBe("test-corp");
  });

  it("should return null when no johnsonProfiles module", () => {
    const mockRuleset = createMockRuleset();
    const result = extractJohnsonProfiles(mockRuleset);
    expect(result).toBeNull();
  });
});

describe("extractJohnsonFactions", () => {
  it("should extract factions array", () => {
    const mockRuleset = createMockRuleset({
      factions: [
        {
          id: "test-faction",
          name: "Test",
          category: "syndicate",
          description: "Test",
          source: "run-faster",
          page: 205,
        },
      ],
    });
    const result = extractJohnsonFactions(mockRuleset);
    expect(result).toHaveLength(1);
  });

  it("should return empty array when module absent", () => {
    const mockRuleset = createMockRuleset();
    expect(extractJohnsonFactions(mockRuleset)).toEqual([]);
  });
});

describe("extractNotorietyTriggers", () => {
  it("should extract triggers array", () => {
    const mockRuleset = createMockRuleset({
      notorietyTriggers: [
        {
          id: "test-trigger",
          name: "Test",
          description: "Test",
          notorietyChange: 1,
          source: "run-faster",
          page: 196,
        },
      ],
    });
    const result = extractNotorietyTriggers(mockRuleset);
    expect(result).toHaveLength(1);
  });

  it("should return empty array when module absent", () => {
    const mockRuleset = createMockRuleset();
    expect(extractNotorietyTriggers(mockRuleset)).toEqual([]);
  });
});

describe("extractRunPhases", () => {
  it("should extract phases array", () => {
    const mockRuleset = createMockRuleset({
      runPhases: [
        {
          id: "the-meet",
          name: "The Meet",
          description: "Test",
          source: "run-faster",
          page: 196,
        },
      ],
    });
    const result = extractRunPhases(mockRuleset);
    expect(result).toHaveLength(1);
  });

  it("should return empty array when module absent", () => {
    const mockRuleset = createMockRuleset();
    expect(extractRunPhases(mockRuleset)).toEqual([]);
  });
});

describe("extractBetrayalTypes", () => {
  it("should extract betrayal types array", () => {
    const mockRuleset = createMockRuleset({
      betrayalTypes: [
        {
          id: "non-payment",
          name: "Non-Payment",
          description: "Test",
          severity: "moderate",
          source: "run-faster",
          page: 210,
        },
      ],
    });
    const result = extractBetrayalTypes(mockRuleset);
    expect(result).toHaveLength(1);
  });

  it("should return empty array when module absent", () => {
    const mockRuleset = createMockRuleset();
    expect(extractBetrayalTypes(mockRuleset)).toEqual([]);
  });
});
