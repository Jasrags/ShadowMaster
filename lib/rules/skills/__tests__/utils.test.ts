import { describe, it, expect } from "vitest";
import { buildSkillCategoriesMap } from "../utils";

describe("buildSkillCategoriesMap", () => {
  it("builds a map of skill ID to category", () => {
    const skills = [
      { id: "firearms", category: "combat" },
      { id: "perception", category: "technical" },
      { id: "athletics", category: "physical" },
    ];

    const result = buildSkillCategoriesMap(skills);

    expect(result).toEqual({
      firearms: "combat",
      perception: "technical",
      athletics: "physical",
    });
  });

  it("returns undefined for skills without a category", () => {
    const skills = [{ id: "firearms", category: "combat" }, { id: "perception" }];

    const result = buildSkillCategoriesMap(skills);

    expect(result).toEqual({
      firearms: "combat",
      perception: undefined,
    });
  });

  it("converts null category to undefined", () => {
    const skills = [{ id: "firearms", category: null }];

    const result = buildSkillCategoriesMap(skills);

    expect(result).toEqual({ firearms: undefined });
  });

  it("returns an empty object for an empty array", () => {
    const result = buildSkillCategoriesMap([]);

    expect(result).toEqual({});
  });
});
