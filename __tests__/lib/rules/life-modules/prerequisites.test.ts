import { describe, it, expect } from "vitest";
import {
  checkPrerequisites,
  getUnmetPrerequisiteNames,
  type PrerequisiteResult,
} from "@/lib/rules/life-modules/prerequisites";
import type { LifeModule, LifeModulesCatalog, LifeModuleSelection } from "@/lib/types/life-modules";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const makeModule = (overrides: Partial<LifeModule> & { id: string }): LifeModule => ({
  name: overrides.id,
  phase: "career",
  karmaCost: 100,
  ...overrides,
});

const makeTourModule = (overrides: Partial<LifeModule> & { id: string }): LifeModule => ({
  name: overrides.id,
  phase: "tour",
  karmaCost: 100,
  yearsAdded: 5,
  ...overrides,
});

const makeSelection = (
  moduleId: string,
  phase: LifeModule["phase"] = "career",
  subModuleId?: string
): LifeModuleSelection => ({
  moduleId,
  phase,
  karmaCost: 100,
  ...(subModuleId ? { subModuleId } : {}),
});

const piModule = makeModule({
  id: "private-investigator",
  name: "Private Investigator/Detective",
  prerequisites: [
    "tour-of-duty",
    "law-enforcement",
    "covert-operations",
    "shadow-work",
    "corporate",
  ],
});

const tourMercenary = makeTourModule({
  id: "tour-mercenary",
  name: "Mercenary",
  prerequisites: [
    "tour-nan",
    "tour-tir-tairngire",
    "tour-ucas-cas-cfs",
    "corporate",
    "shadow-work",
  ],
});

const medicalCorpsSub: LifeModule = {
  id: "ucas-cas-cfs-medical-corps",
  name: "Medical Corps",
  phase: "tour",
  karmaCost: 100,
  prerequisites: ["ts-nurse", "cc-medicine", "su-medicine", "ivy-medicine", "ma-medicine"],
};

const tourUcas = makeTourModule({
  id: "tour-ucas-cas-cfs",
  name: "UCAS/CAS/CFS Military",
  subModules: [medicalCorpsSub],
  requiresSubModuleSelection: true,
});

const bountyHunter = makeModule({
  id: "bounty-hunter",
  name: "Bounty Hunter",
  // no prerequisites
});

const lawEnforcement = makeModule({
  id: "law-enforcement",
  name: "Law Enforcement",
});

const shadowWork = makeModule({
  id: "shadow-work",
  name: "Shadow Work",
});

const corporate = makeModule({
  id: "corporate",
  name: "Corporate",
  subModules: [
    makeModule({ id: "corporate-company-man", name: "Company Man" }),
    makeModule({ id: "corporate-hacker-decker", name: "Hacker/Decker" }),
  ],
});

const tourNan = makeTourModule({
  id: "tour-nan",
  name: "NAN Military",
});

const tourTir = makeTourModule({
  id: "tour-tir-tairngire",
  name: "Tir Tairngire Military",
});

const minimalCatalog: LifeModulesCatalog = {
  nationality: [],
  formative: [],
  teen: [],
  education: [],
  career: [bountyHunter, lawEnforcement, shadowWork, corporate, piModule],
  tour: [tourMercenary, tourNan, tourTir, tourUcas],
};

// =============================================================================
// checkPrerequisites
// =============================================================================

describe("checkPrerequisites", () => {
  it("returns met=true for a module with no prerequisites", () => {
    const result = checkPrerequisites(bountyHunter, [], minimalCatalog);
    expect(result.met).toBe(true);
    expect(result.missingPrerequisiteIds).toEqual([]);
  });

  it("returns met=true when prerequisites is undefined", () => {
    const noPrereqs = makeModule({ id: "test" });
    const result = checkPrerequisites(noPrereqs, [], minimalCatalog);
    expect(result.met).toBe(true);
    expect(result.missingPrerequisiteIds).toEqual([]);
  });

  it("returns met=true when prerequisites is empty array", () => {
    const emptyPrereqs = makeModule({ id: "test", prerequisites: [] });
    const result = checkPrerequisites(emptyPrereqs, [], minimalCatalog);
    expect(result.met).toBe(true);
    expect(result.missingPrerequisiteIds).toEqual([]);
  });

  it("returns met=false when no prerequisite modules are selected", () => {
    const result = checkPrerequisites(piModule, [], minimalCatalog);
    expect(result.met).toBe(false);
    expect(result.missingPrerequisiteIds).toEqual([
      "tour-of-duty",
      "law-enforcement",
      "covert-operations",
      "shadow-work",
      "corporate",
    ]);
  });

  it("returns met=true when any one prerequisite module is selected (OR logic)", () => {
    const selections = [makeSelection("law-enforcement")];
    const result = checkPrerequisites(piModule, selections, minimalCatalog);
    expect(result.met).toBe(true);
    expect(result.missingPrerequisiteIds).toEqual([]);
  });

  it("returns met=true when shadow-work prerequisite is satisfied", () => {
    const selections = [makeSelection("shadow-work")];
    const result = checkPrerequisites(piModule, selections, minimalCatalog);
    expect(result.met).toBe(true);
  });

  it("returns met=true when corporate prerequisite is satisfied", () => {
    const selections = [makeSelection("corporate", "career", "corporate-company-man")];
    const result = checkPrerequisites(piModule, selections, minimalCatalog);
    expect(result.met).toBe(true);
  });

  it("handles tour-of-duty phase alias - matches any tour module", () => {
    const selections = [makeSelection("tour-nan", "tour")];
    const result = checkPrerequisites(piModule, selections, minimalCatalog);
    expect(result.met).toBe(true);
  });

  it("handles tour-of-duty phase alias - matches another tour module", () => {
    const selections = [makeSelection("tour-ucas-cas-cfs", "tour")];
    const result = checkPrerequisites(piModule, selections, minimalCatalog);
    expect(result.met).toBe(true);
  });

  it("returns met=false when only unrelated modules are selected", () => {
    const selections = [makeSelection("bounty-hunter")];
    const result = checkPrerequisites(piModule, selections, minimalCatalog);
    expect(result.met).toBe(false);
  });

  // Tour: Mercenary prerequisites
  it("returns met=true for mercenary when another tour is selected", () => {
    const selections = [makeSelection("tour-nan", "tour")];
    const result = checkPrerequisites(tourMercenary, selections, minimalCatalog);
    expect(result.met).toBe(true);
  });

  it("returns met=true for mercenary when shadow-work is selected", () => {
    const selections = [makeSelection("shadow-work")];
    const result = checkPrerequisites(tourMercenary, selections, minimalCatalog);
    expect(result.met).toBe(true);
  });

  it("returns met=true for mercenary when corporate is selected", () => {
    const selections = [makeSelection("corporate", "career", "corporate-company-man")];
    const result = checkPrerequisites(tourMercenary, selections, minimalCatalog);
    expect(result.met).toBe(true);
  });

  it("returns met=false for mercenary with no prior selections", () => {
    const result = checkPrerequisites(tourMercenary, [], minimalCatalog);
    expect(result.met).toBe(false);
  });

  // Sub-module prerequisites (Medical Corps)
  it("checks sub-module prerequisites against existing education selections", () => {
    const result = checkPrerequisites(medicalCorpsSub, [], minimalCatalog);
    expect(result.met).toBe(false);
    expect(result.missingPrerequisiteIds.length).toBeGreaterThan(0);
  });

  it("returns met=true for sub-module when education sub-module was selected", () => {
    // Player selected trade school nurse sub-module
    const selections = [makeSelection("trade-school", "education", "ts-nurse")];
    const result = checkPrerequisites(medicalCorpsSub, selections, minimalCatalog);
    expect(result.met).toBe(true);
  });

  it("matches prerequisites against both moduleId and subModuleId", () => {
    // Player selected community college medicine sub-module
    const selections = [makeSelection("community-college", "education", "cc-medicine")];
    const result = checkPrerequisites(medicalCorpsSub, selections, minimalCatalog);
    expect(result.met).toBe(true);
  });

  it("does not mutate inputs", () => {
    const selections: LifeModuleSelection[] = [makeSelection("bounty-hunter")];
    const originalSelections = [...selections];
    checkPrerequisites(piModule, selections, minimalCatalog);
    expect(selections).toEqual(originalSelections);
  });
});

// =============================================================================
// getUnmetPrerequisiteNames
// =============================================================================

describe("getUnmetPrerequisiteNames", () => {
  it("returns empty array when prerequisites are met", () => {
    const selections = [makeSelection("law-enforcement")];
    const result = checkPrerequisites(piModule, selections, minimalCatalog);
    const names = getUnmetPrerequisiteNames(result, minimalCatalog);
    expect(names).toEqual([]);
  });

  it("returns human-readable names for unmet prerequisites", () => {
    const result = checkPrerequisites(piModule, [], minimalCatalog);
    const names = getUnmetPrerequisiteNames(result, minimalCatalog);
    // Should include names from the catalog, not raw IDs
    expect(names).toContain("Law Enforcement");
    expect(names).toContain("Shadow Work");
    expect(names).toContain("Corporate");
  });

  it("uses 'Any Tour of Duty' for tour-of-duty phase alias", () => {
    const result = checkPrerequisites(piModule, [], minimalCatalog);
    const names = getUnmetPrerequisiteNames(result, minimalCatalog);
    expect(names).toContain("Any Tour of Duty");
  });

  it("falls back to ID when module not found in catalog", () => {
    const moduleWithUnknown = makeModule({
      id: "test",
      prerequisites: ["nonexistent-module"],
    });
    const result = checkPrerequisites(moduleWithUnknown, [], minimalCatalog);
    const names = getUnmetPrerequisiteNames(result, minimalCatalog);
    expect(names).toContain("nonexistent-module");
  });
});
