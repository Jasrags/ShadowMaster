import { describe, it, expect } from "vitest";
import { flattenModulesForSearch, BROWSABLE_CATEGORIES } from "@/lib/rules/search-index";

const SOURCE = "SR5 Core Rulebook";

function makeModule(payload: Record<string, unknown>) {
  return { payload };
}

describe("flattenModulesForSearch", () => {
  describe("metatypes", () => {
    it("extracts metatypes array", () => {
      const modules = {
        metatypes: makeModule({
          metatypes: [
            { id: "human", name: "Human", description: "The baseline metatype" },
            { id: "elf", name: "Elf", description: "Graceful and charismatic" },
          ],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({
        id: "human",
        name: "Human",
        category: "metatypes",
        source: SOURCE,
        summary: "The baseline metatype",
      });
      expect(items[0].subcategory).toBeUndefined();
    });
  });

  describe("skills", () => {
    it("extracts active skills with linked attribute summary", () => {
      const modules = {
        skills: makeModule({
          activeSkills: [
            { id: "firearms", name: "Firearms", linkedAttribute: "Agility" },
            { id: "running", name: "Running" },
          ],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0].summary).toBe("Linked to Agility");
      expect(items[1].summary).toBeUndefined();
    });
  });

  describe("qualities", () => {
    it("extracts positive and negative qualities with subcategories", () => {
      const modules = {
        qualities: makeModule({
          positive: [{ id: "toughness", name: "Toughness" }],
          negative: [{ id: "allergy", name: "Allergy" }],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({ name: "Toughness", subcategory: "Positive" });
      expect(items[1]).toMatchObject({ name: "Allergy", subcategory: "Negative" });
    });
  });

  describe("gear", () => {
    it("extracts weapons from nested object", () => {
      const modules = {
        gear: makeModule({
          weapons: {
            pistols: [{ id: "ares-predator-v", name: "Ares Predator V", damage: "8P" }],
            melee: [{ id: "combat-knife", name: "Combat Knife", damage: "6P" }],
          },
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({
        name: "Ares Predator V",
        category: "gear",
        subcategory: "Pistols",
        summary: "8P",
      });
      expect(items[1]).toMatchObject({
        name: "Combat Knife",
        subcategory: "Melee",
      });
    });

    it("extracts armor as array", () => {
      const modules = {
        gear: makeModule({
          armor: [{ id: "armor-jacket", name: "Armor Jacket", armorRating: 12 }],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        name: "Armor Jacket",
        subcategory: "Armor",
        summary: "Armor: 12",
      });
    });

    it("extracts gear sub-arrays", () => {
      const modules = {
        gear: makeModule({
          commlinks: [{ id: "meta-link", name: "Meta Link" }],
          drugs: [{ id: "jazz", name: "Jazz" }],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({ name: "Meta Link", subcategory: "Commlinks" });
      expect(items[1]).toMatchObject({ name: "Jazz", subcategory: "Drugs" });
    });
  });

  describe("magic", () => {
    it("extracts spells from nested schools", () => {
      const modules = {
        magic: makeModule({
          spells: {
            combat: [{ id: "fireball", name: "Fireball" }],
            detection: [{ id: "detect-life", name: "Detect Life" }],
          },
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({ name: "Fireball", subcategory: "Combat Spells" });
      expect(items[1]).toMatchObject({ name: "Detect Life", subcategory: "Detection Spells" });
    });

    it("extracts complex forms and traditions", () => {
      const modules = {
        magic: makeModule({
          complexForms: [{ id: "resonance-spike", name: "Resonance Spike" }],
          traditions: [{ id: "hermetic", name: "Hermetic" }],
          mentorSpirits: [{ id: "bear", name: "Bear" }],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(3);
      expect(items[0]).toMatchObject({ subcategory: "Complex Forms" });
      expect(items[1]).toMatchObject({ subcategory: "Traditions" });
      expect(items[2]).toMatchObject({ subcategory: "Mentor Spirits" });
    });
  });

  describe("cyberware and bioware", () => {
    it("extracts catalog items with category as summary", () => {
      const modules = {
        cyberware: makeModule({
          catalog: [{ id: "datajack", name: "Datajack", category: "headware" }],
        }),
        bioware: makeModule({
          catalog: [{ id: "muscle-toner", name: "Muscle Toner", category: "cultured-bioware" }],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({
        name: "Datajack",
        category: "cyberware",
        summary: "Headware",
      });
      expect(items[1]).toMatchObject({
        name: "Muscle Toner",
        category: "bioware",
        summary: "Cultured Bioware",
      });
    });
  });

  describe("vehicles", () => {
    it("extracts vehicle types with subcategories", () => {
      const modules = {
        vehicles: makeModule({
          groundcraft: [{ id: "dodge-scoot", name: "Dodge Scoot" }],
          drones: [{ id: "fly-spy", name: "Fly-Spy" }],
          autosofts: [{ id: "targeting", name: "Targeting" }],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(3);
      expect(items[0]).toMatchObject({ subcategory: "Groundcraft", category: "vehicles" });
      expect(items[1]).toMatchObject({ subcategory: "Drones" });
      expect(items[2]).toMatchObject({ subcategory: "Autosofts" });
    });
  });

  describe("programs", () => {
    it("extracts program types", () => {
      const modules = {
        programs: makeModule({
          common: [{ id: "browse", name: "Browse" }],
          hacking: [{ id: "exploit", name: "Exploit" }],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({ subcategory: "Common", category: "programs" });
      expect(items[1]).toMatchObject({ subcategory: "Hacking" });
    });
  });

  describe("actions", () => {
    it("extracts action categories", () => {
      const modules = {
        actions: makeModule({
          combat: [{ id: "attack", name: "Attack" }],
          matrix: [{ id: "hack-on-the-fly", name: "Hack on the Fly" }],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({ subcategory: "Combat", category: "actions" });
      expect(items[1]).toMatchObject({ subcategory: "Matrix" });
    });
  });

  describe("modifications", () => {
    it("extracts mod types", () => {
      const modules = {
        modifications: makeModule({
          weaponMods: [{ id: "silencer", name: "Silencer" }],
          armorMods: [{ id: "fire-resistance", name: "Fire Resistance" }],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({ subcategory: "Weapon Mods", category: "modifications" });
      expect(items[1]).toMatchObject({ subcategory: "Armor Mods" });
    });
  });

  describe("simple modules", () => {
    it("extracts foci", () => {
      const modules = {
        foci: makeModule({ foci: [{ id: "power-focus", name: "Power Focus" }] }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ name: "Power Focus", category: "foci" });
    });

    it("extracts adept powers", () => {
      const modules = {
        adeptPowers: makeModule({ powers: [{ id: "killing-hands", name: "Killing Hands" }] }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ category: "adeptPowers" });
    });

    it("extracts spirits", () => {
      const modules = {
        spirits: makeModule({ spiritTypes: [{ id: "fire", name: "Fire Spirit" }] }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ category: "spirits" });
    });

    it("extracts critter powers and weaknesses", () => {
      const modules = {
        critterPowers: makeModule({ powers: [{ id: "fear", name: "Fear" }] }),
        critterWeaknesses: makeModule({
          weaknesses: [{ id: "allergy-sunlight", name: "Allergy (Sunlight)" }],
        }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
    });

    it("extracts critters", () => {
      const modules = {
        critters: makeModule({ critters: [{ id: "barghest", name: "Barghest" }] }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(1);
    });

    it("extracts lifestyle", () => {
      const modules = {
        lifestyle: makeModule({ lifestyles: [{ id: "low", name: "Low" }] }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ category: "lifestyle" });
    });

    it("extracts contact archetypes and templates", () => {
      const modules = {
        contactArchetypes: makeModule({ archetypes: [{ id: "fixer", name: "Fixer" }] }),
        contactTemplates: makeModule({
          templates: [{ id: "johnsons-fixer", name: "Johnson's Fixer" }],
        }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(2);
    });

    it("extracts favor services", () => {
      const modules = {
        favorServices: makeModule({ services: [{ id: "legwork", name: "Legwork" }] }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({ category: "favorServices" });
    });
  });

  describe("edge cases", () => {
    it("skips non-browsable modules", () => {
      const modules = {
        advancement: makeModule({ allowInstantAdvancement: true }),
        diceRules: makeModule({ hitThreshold: 5 }),
        priorities: makeModule({ categories: [] }),
        attributes: makeModule({ primaryAttributes: [] }),
        creationMethods: makeModule({ creationMethods: [] }),
        categoryModificationDefaults: makeModule({}),
        socialModifiers: makeModule({}),
        gameplayLevels: makeModule({}),
      };
      const items = flattenModulesForSearch(
        modules as Record<string, { payload?: unknown }>,
        SOURCE
      );
      expect(items).toHaveLength(0);
    });

    it("handles empty arrays", () => {
      const modules = {
        metatypes: makeModule({ metatypes: [] }),
        skills: makeModule({ activeSkills: [] }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(0);
    });

    it("handles missing payload", () => {
      const modules = {
        metatypes: { payload: undefined },
      };
      const items = flattenModulesForSearch(
        modules as unknown as Record<string, { payload?: unknown }>,
        SOURCE
      );
      expect(items).toHaveLength(0);
    });

    it("skips items without names", () => {
      const modules = {
        metatypes: makeModule({
          metatypes: [{ id: "valid", name: "Valid" }, { id: "no-name" }],
        }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(1);
    });

    it("generates id from name when id is missing", () => {
      const modules = {
        metatypes: makeModule({
          metatypes: [{ name: "Wild Card Troll" }],
        }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items[0].id).toBe("wild-card-troll");
    });

    it("handles unknown modules gracefully", () => {
      const modules = {
        unknownModule: makeModule({ stuff: [{ id: "a", name: "A" }] }),
      };
      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(0);
    });
  });

  describe("multi-module integration", () => {
    it("flattens multiple modules together", () => {
      const modules = {
        metatypes: makeModule({
          metatypes: [{ id: "human", name: "Human" }],
        }),
        skills: makeModule({
          activeSkills: [{ id: "firearms", name: "Firearms", linkedAttribute: "Agility" }],
        }),
        gear: makeModule({
          weapons: {
            pistols: [{ id: "predator", name: "Ares Predator V" }],
          },
        }),
        magic: makeModule({
          spells: {
            combat: [{ id: "fireball", name: "Fireball" }],
          },
        }),
        advancement: makeModule({ allowInstantAdvancement: true }),
      };

      const items = flattenModulesForSearch(
        modules as Record<string, { payload?: unknown }>,
        SOURCE
      );
      expect(items).toHaveLength(4);
      expect(items.map((i) => i.category)).toEqual(["metatypes", "skills", "gear", "magic"]);
    });
  });

  describe("BROWSABLE_CATEGORIES", () => {
    it("includes all expected categories", () => {
      expect(BROWSABLE_CATEGORIES).toContain("metatypes");
      expect(BROWSABLE_CATEGORIES).toContain("skills");
      expect(BROWSABLE_CATEGORIES).toContain("qualities");
      expect(BROWSABLE_CATEGORIES).toContain("gear");
      expect(BROWSABLE_CATEGORIES).toContain("magic");
      expect(BROWSABLE_CATEGORIES).toContain("cyberware");
      expect(BROWSABLE_CATEGORIES).toContain("bioware");
      expect(BROWSABLE_CATEGORIES).toContain("vehicles");
      expect(BROWSABLE_CATEGORIES).toContain("programs");
      expect(BROWSABLE_CATEGORIES).toContain("foci");
      expect(BROWSABLE_CATEGORIES).toContain("adeptPowers");
      expect(BROWSABLE_CATEGORIES).toContain("spirits");
      expect(BROWSABLE_CATEGORIES).toContain("actions");
      expect(BROWSABLE_CATEGORIES).toContain("modifications");
      expect(BROWSABLE_CATEGORIES).toContain("lifestyle");
    });

    it("does not include skipped modules", () => {
      expect(BROWSABLE_CATEGORIES).not.toContain("advancement");
      expect(BROWSABLE_CATEGORIES).not.toContain("diceRules");
      expect(BROWSABLE_CATEGORIES).not.toContain("priorities");
    });
  });

  describe("gear gearArrayKeys completeness", () => {
    it("indexes explosives subcategory", () => {
      const modules = {
        gear: makeModule({
          explosives: [
            { id: "plastic-explosives", name: "Plastic Explosives", description: "Moldable" },
          ],
        }),
      };

      const items = flattenModulesForSearch(modules, SOURCE);
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        id: "plastic-explosives",
        name: "Plastic Explosives",
        category: "gear",
        subcategory: "Explosives",
      });
    });

    it("indexes all GearCatalogData sub-array keys", () => {
      // Every non-weapon, non-armor, non-sensor sub-array key from GearCatalogData
      // must be present in gearArrayKeys so items are discoverable via search.
      const expectedKeys = [
        "commlinks",
        "cyberdecks",
        "electronics",
        "explosives",
        "ammunition",
        "accessories",
        "armorModifications",
        "audioEnhancements",
        "industrialChemicals",
        "medical",
        "miscellaneous",
        "restraints",
        "rfidTags",
        "security",
        "securityDevices",
        "survival",
        "tools",
        "visionEnhancements",
        "toxins",
        "drugs",
      ];

      // Build a payload with one item per key
      const payload: Record<string, unknown[]> = {};
      for (const key of expectedKeys) {
        payload[key] = [{ id: `test-${key}`, name: `Test ${key}` }];
      }

      const modules = { gear: makeModule(payload) };
      const items = flattenModulesForSearch(modules, SOURCE);

      // Every key should have produced exactly one search result
      const foundSubcategories = items.map((i) => i.subcategory);
      for (const key of expectedKeys) {
        const found = items.find((i) => i.id === `test-${key}`);
        expect(found).toBeDefined();
      }

      expect(items).toHaveLength(expectedKeys.length);
    });
  });
});
