/**
 * Tests for Life Modules types and constants
 */
import { describe, expect, it } from "vitest";
import {
  LIFE_MODULES_KARMA_BUDGET,
  LIFE_MODULES_MAX_ACTIVE_SKILL,
  LIFE_MODULES_MAX_KNOWLEDGE_SKILL,
  LIFE_MODULES_MAX_GEAR_KARMA,
  LIFE_MODULES_NUYEN_PER_KARMA,
  LIFE_MODULES_MAX_NEGATIVE_QUALITIES,
  NATIONALITY_KARMA_COST,
  FORMATIVE_KARMA_COST,
  TEEN_KARMA_COST,
  CAREER_KARMA_COST,
  CAREER_YEARS_ADDED,
  TOUR_KARMA_COST,
  TOUR_YEARS_ADDED,
} from "@/lib/types";
import type {
  LifeModule,
  LifeModulePhase,
  LifeModulesCatalog,
  LifeModuleSelection,
  LifeModuleQualityGrant,
  LifeModuleContactGrant,
  QualityReplacement,
  NationalityModule,
} from "@/lib/types";

describe("Life Modules Constants", () => {
  it("has correct karma budget (Run Faster p. 65)", () => {
    expect(LIFE_MODULES_KARMA_BUDGET).toBe(750);
  });

  it("has correct active skill max", () => {
    expect(LIFE_MODULES_MAX_ACTIVE_SKILL).toBe(7);
  });

  it("has correct knowledge skill max", () => {
    expect(LIFE_MODULES_MAX_KNOWLEDGE_SKILL).toBe(9);
  });

  it("has correct gear karma limits", () => {
    expect(LIFE_MODULES_MAX_GEAR_KARMA).toBe(200);
    expect(LIFE_MODULES_NUYEN_PER_KARMA).toBe(2000);
  });

  it("has correct negative quality cap", () => {
    expect(LIFE_MODULES_MAX_NEGATIVE_QUALITIES).toBe(25);
  });

  it("has correct phase-specific karma costs", () => {
    expect(NATIONALITY_KARMA_COST).toBe(15);
    expect(FORMATIVE_KARMA_COST).toBe(40);
    expect(TEEN_KARMA_COST).toBe(50);
    expect(CAREER_KARMA_COST).toBe(100);
    expect(TOUR_KARMA_COST).toBe(100);
  });

  it("has correct phase-specific years", () => {
    expect(CAREER_YEARS_ADDED).toBe(4);
    expect(TOUR_YEARS_ADDED).toBe(5);
  });
});

describe("Life Module type structure", () => {
  it("supports a basic nationality module", () => {
    const module: NationalityModule = {
      id: "ucas-seattle",
      name: "UCAS - Seattle",
      phase: "nationality",
      karmaCost: 15,
      nation: "UCAS",
      primaryLanguage: "english",
      activeSkills: { "area-knowledge": 2 },
      knowledgeSkills: { "seattle-gangs": 2 },
      qualities: [{ id: "sinner-national", type: "negative" }],
    };

    expect(module.phase).toBe("nationality");
    expect(module.nation).toBe("UCAS");
    expect(module.primaryLanguage).toBe("english");
    expect(module.karmaCost).toBe(15);
  });

  it("supports a formative years module with attributes and qualities", () => {
    const module: LifeModule = {
      id: "street-urchin",
      name: "Street Urchin",
      phase: "formative",
      karmaCost: 40,
      yearsAdded: 10,
      attributeModifiers: { agility: 1, intuition: 1 },
      activeSkills: { palming: 1, sneaking: 1 },
      qualities: [
        { id: "toughness", type: "positive" },
        { id: "poor-self-control-thrill-seeker", type: "negative" },
      ],
    };

    expect(module.attributeModifiers).toEqual({ agility: 1, intuition: 1 });
    expect(module.qualities).toHaveLength(2);
  });

  it("supports education modules with sub-module disciplines", () => {
    const module: LifeModule = {
      id: "state-university",
      name: "State University",
      phase: "education",
      karmaCost: 65,
      yearsAdded: 4,
      requiresSubModuleSelection: true,
      subModules: [
        {
          id: "state-university-computer-science",
          name: "Computer Science",
          phase: "education",
          karmaCost: 0,
          activeSkills: { computer: 3, software: 2 },
          knowledgeSkills: { "computer-science": 4 },
        },
        {
          id: "state-university-medicine",
          name: "Medicine",
          phase: "education",
          karmaCost: 0,
          activeSkills: { medicine: 3, "first-aid": 2 },
          knowledgeSkills: { medicine: 4 },
        },
      ],
    };

    expect(module.subModules).toHaveLength(2);
    expect(module.requiresSubModuleSelection).toBe(true);
  });

  it("supports career modules with prerequisites", () => {
    const module: LifeModule = {
      id: "private-investigator",
      name: "Private Investigator",
      phase: "career",
      karmaCost: 100,
      yearsAdded: 4,
      prerequisites: ["law-enforcement", "shadow-work"],
      activeSkills: { perception: 3, tracking: 2, pistols: 1 },
      contacts: [{ archetype: "Lawyer", connection: 3, loyalty: 2 }],
    };

    expect(module.prerequisites).toContain("law-enforcement");
    expect(module.contacts).toHaveLength(1);
  });

  it("supports tour of duty modules", () => {
    const module: LifeModule = {
      id: "ucas-army",
      name: "UCAS Army",
      phase: "tour",
      karmaCost: 100,
      yearsAdded: 5,
      attributeModifiers: { body: 1, agility: 1 },
      activeSkills: { automatics: 2, leadership: 1 },
      qualities: [{ id: "toughness", type: "positive" }],
    };

    expect(module.phase).toBe("tour");
    expect(module.yearsAdded).toBe(5);
  });
});

describe("Life Modules catalog structure", () => {
  it("can be constructed with all phases", () => {
    const catalog: LifeModulesCatalog = {
      nationality: [
        {
          id: "ucas-general",
          name: "UCAS - General",
          phase: "nationality",
          karmaCost: 15,
        },
      ],
      formative: [
        {
          id: "street-urchin",
          name: "Street Urchin",
          phase: "formative",
          karmaCost: 40,
        },
      ],
      teen: [
        {
          id: "gang-warfare",
          name: "Gang Warfare",
          phase: "teen",
          karmaCost: 50,
        },
      ],
      education: [],
      career: [],
      tour: [],
    };

    expect(catalog.nationality).toHaveLength(1);
    expect(catalog.formative).toHaveLength(1);
    expect(catalog.teen).toHaveLength(1);
    expect(catalog.education).toHaveLength(0);
  });
});

describe("Life Module selection tracking", () => {
  it("tracks a selected module with karma cost", () => {
    const selection: LifeModuleSelection = {
      moduleId: "ucas-seattle",
      phase: "nationality",
      karmaCost: 15,
    };

    expect(selection.karmaCost).toBe(15);
    expect(selection.subModuleId).toBeUndefined();
  });

  it("tracks sub-module selection for education", () => {
    const selection: LifeModuleSelection = {
      moduleId: "state-university",
      subModuleId: "state-university-computer-science",
      phase: "education",
      karmaCost: 65,
    };

    expect(selection.subModuleId).toBe("state-university-computer-science");
  });

  it("tracks quality replacements for duplicates", () => {
    const replacement: QualityReplacement = {
      originalQualityId: "toughness",
      replacementQualityId: "will-to-live-1",
    };

    const selection: LifeModuleSelection = {
      moduleId: "ucas-army",
      phase: "tour",
      karmaCost: 100,
      qualityReplacements: [replacement],
    };

    expect(selection.qualityReplacements).toHaveLength(1);
    expect(selection.qualityReplacements![0].originalQualityId).toBe("toughness");
  });

  it("calculates total karma from a sequence of modules", () => {
    const selections: readonly LifeModuleSelection[] = [
      { moduleId: "ucas-seattle", phase: "nationality", karmaCost: 15 },
      { moduleId: "street-urchin", phase: "formative", karmaCost: 40 },
      { moduleId: "gang-warfare", phase: "teen", karmaCost: 50 },
      { moduleId: "shadow-work", phase: "career", karmaCost: 100 },
    ];

    const totalKarma = selections.reduce((sum, s) => sum + s.karmaCost, 0);
    expect(totalKarma).toBe(205);
    expect(totalKarma).toBeLessThan(LIFE_MODULES_KARMA_BUDGET);
  });
});

describe("Life Module phases", () => {
  it("covers all valid phases", () => {
    const phases: LifeModulePhase[] = [
      "nationality",
      "formative",
      "teen",
      "education",
      "career",
      "tour",
    ];
    expect(phases).toHaveLength(6);
  });
});

describe("LifeModuleQualityGrant", () => {
  it("supports positive quality with level", () => {
    const grant: LifeModuleQualityGrant = {
      id: "toughness",
      type: "positive",
    };
    expect(grant.type).toBe("positive");
  });

  it("supports negative quality with specification", () => {
    const grant: LifeModuleQualityGrant = {
      id: "prejudice",
      type: "negative",
      level: 2,
      specification: "Specific (Biased)",
    };
    expect(grant.level).toBe(2);
    expect(grant.specification).toBe("Specific (Biased)");
  });
});

describe("LifeModuleContactGrant", () => {
  it("stores contact archetype with ratings", () => {
    const contact: LifeModuleContactGrant = {
      archetype: "Fixer",
      connection: 4,
      loyalty: 3,
    };
    expect(contact.connection).toBe(4);
    expect(contact.loyalty).toBe(3);
  });
});
