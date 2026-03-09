import { describe, it, expect } from "vitest";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { getBookSummary } from "@/lib/storage/editions";

describe("SR5 errata multi-book merge", () => {
  it("loads both core-rulebook and errata books", async () => {
    const result = await loadAndMergeRuleset("sr5");
    expect(result.success).toBe(true);
    expect(result.ruleset).toBeDefined();
    expect(result.ruleset!.bookIds).toContain("core-rulebook");
    expect(result.ruleset!.bookIds).toContain("core-errata-2014-02-09");
  });

  describe("skills module — biotechnology group fix", () => {
    it("assigns biotechnology to the biotech group", async () => {
      const result = await loadAndMergeRuleset("sr5");
      expect(result.success).toBe(true);

      const skills = result.ruleset!.modules.skills as {
        activeSkills: Array<{ id: string; group: string | null }>;
      };
      const biotech = skills.activeSkills.find((s) => s.id === "biotechnology");
      expect(biotech).toBeDefined();
      expect(biotech!.group).toBe("biotech");
    });

    it("includes biotechnology in the biotech skill group skills array", async () => {
      const result = await loadAndMergeRuleset("sr5");
      expect(result.success).toBe(true);

      const skills = result.ruleset!.modules.skills as {
        skillGroups: Array<{ id: string; skills: string[] }>;
      };
      const biotechGroup = skills.skillGroups.find((g) => g.id === "biotech");
      expect(biotechGroup).toBeDefined();
      expect(biotechGroup!.skills).toContain("biotechnology");
      // Original skills should still be present
      expect(biotechGroup!.skills).toContain("cybertechnology");
      expect(biotechGroup!.skills).toContain("first-aid");
      expect(biotechGroup!.skills).toContain("medicine");
      expect(biotechGroup!.skills).toHaveLength(4);
    });
  });

  describe("adeptPowers module — combat sense activation fix", () => {
    it("sets combat-sense activation to passive", async () => {
      const result = await loadAndMergeRuleset("sr5");
      expect(result.success).toBe(true);

      const adeptPowers = result.ruleset!.modules.adeptPowers as {
        powers: Array<{ id: string; activation?: string; name?: string }>;
      };
      const combatSense = adeptPowers.powers.find((p) => p.id === "combat-sense");
      expect(combatSense).toBeDefined();
      expect(combatSense!.activation).toBe("passive");
    });

    it("preserves original combat-sense fields after merge", async () => {
      const result = await loadAndMergeRuleset("sr5");
      expect(result.success).toBe(true);

      const adeptPowers = result.ruleset!.modules.adeptPowers as {
        powers: Array<{
          id: string;
          name: string;
          description: string;
          hasRating: boolean;
        }>;
      };
      const combatSense = adeptPowers.powers.find((p) => p.id === "combat-sense");
      expect(combatSense).toBeDefined();
      expect(combatSense!.name).toBe("Combat Sense");
      expect(combatSense!.description).toBeTruthy();
      expect(combatSense!.hasRating).toBe(true);
    });
  });

  describe("book summary", () => {
    it("returns errata-specific role in book summary", async () => {
      const summary = await getBookSummary("sr5", "core-errata-2014-02-09");
      expect(summary).toBeDefined();
      expect(summary!.category).toBe("errata");
      expect(summary!.role).toBe("Official corrections and clarifications");
    });
  });

  describe("core-only baseline", () => {
    it("shows original values when loading only core-rulebook", async () => {
      const result = await loadAndMergeRuleset("sr5", ["core-rulebook"]);
      expect(result.success).toBe(true);
      expect(result.ruleset!.bookIds).toEqual(["core-rulebook"]);

      // biotechnology.group should be null in core-only
      const skills = result.ruleset!.modules.skills as {
        activeSkills: Array<{ id: string; group: string | null }>;
        skillGroups: Array<{ id: string; skills: string[] }>;
      };
      const biotech = skills.activeSkills.find((s) => s.id === "biotechnology");
      expect(biotech!.group).toBeNull();

      // biotech group should only have 3 skills
      const biotechGroup = skills.skillGroups.find((g) => g.id === "biotech");
      expect(biotechGroup!.skills).toHaveLength(3);
      expect(biotechGroup!.skills).not.toContain("biotechnology");

      // combat-sense should not have activation field
      const adeptPowers = result.ruleset!.modules.adeptPowers as {
        powers: Array<{ id: string; activation?: string }>;
      };
      const combatSense = adeptPowers.powers.find((p) => p.id === "combat-sense");
      expect(combatSense!.activation).toBeUndefined();
    });
  });
});
