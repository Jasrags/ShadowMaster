/**
 * Tests for augmentation grade creation restrictions
 *
 * Tests the helper functions that determine which grades are available
 * during character creation (max: alpha, beta/delta unavailable).
 */

import { describe, it, expect } from "vitest";
import {
  isGradeAvailableAtCreation,
  getCreationAvailableCyberwareGrades,
  getCreationAvailableBiowareGrades,
  CREATION_MAX_GRADE,
} from "../grades";

describe("Grade Creation Restrictions", () => {
  describe("CREATION_MAX_GRADE constant", () => {
    it("should be set to alpha grade index (2)", () => {
      expect(CREATION_MAX_GRADE).toBe(2);
    });
  });

  describe("isGradeAvailableAtCreation", () => {
    it("returns true for used grade", () => {
      expect(isGradeAvailableAtCreation("used")).toBe(true);
    });

    it("returns true for standard grade", () => {
      expect(isGradeAvailableAtCreation("standard")).toBe(true);
    });

    it("returns true for alpha grade", () => {
      expect(isGradeAvailableAtCreation("alpha")).toBe(true);
    });

    it("returns false for beta grade", () => {
      expect(isGradeAvailableAtCreation("beta")).toBe(false);
    });

    it("returns false for delta grade", () => {
      expect(isGradeAvailableAtCreation("delta")).toBe(false);
    });
  });

  describe("getCreationAvailableCyberwareGrades", () => {
    it("returns used, standard, and alpha grades", () => {
      const grades = getCreationAvailableCyberwareGrades();
      expect(grades).toEqual(["used", "standard", "alpha"]);
    });

    it("excludes beta grade", () => {
      const grades = getCreationAvailableCyberwareGrades();
      expect(grades).not.toContain("beta");
    });

    it("excludes delta grade", () => {
      const grades = getCreationAvailableCyberwareGrades();
      expect(grades).not.toContain("delta");
    });

    it("returns exactly 3 grades", () => {
      const grades = getCreationAvailableCyberwareGrades();
      expect(grades).toHaveLength(3);
    });
  });

  describe("getCreationAvailableBiowareGrades", () => {
    it("returns standard and alpha grades", () => {
      const grades = getCreationAvailableBiowareGrades();
      expect(grades).toEqual(["standard", "alpha"]);
    });

    it("excludes used grade (bioware cannot be used)", () => {
      const grades = getCreationAvailableBiowareGrades();
      expect(grades).not.toContain("used");
    });

    it("excludes beta grade", () => {
      const grades = getCreationAvailableBiowareGrades();
      expect(grades).not.toContain("beta");
    });

    it("excludes delta grade", () => {
      const grades = getCreationAvailableBiowareGrades();
      expect(grades).not.toContain("delta");
    });

    it("returns exactly 2 grades", () => {
      const grades = getCreationAvailableBiowareGrades();
      expect(grades).toHaveLength(2);
    });
  });
});
