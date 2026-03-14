import { describe, expectTypeOf, it } from "vitest";

import type { CombatSession, EditionCode, FavorCostTable, RuleReferenceData } from "@/lib/types";

describe("EditionCode type constraints", () => {
  it("CombatSession.editionCode is EditionCode", () => {
    expectTypeOf<CombatSession["editionCode"]>().toEqualTypeOf<EditionCode>();
  });

  it("FavorCostTable.editionCode is EditionCode", () => {
    expectTypeOf<FavorCostTable["editionCode"]>().toEqualTypeOf<EditionCode>();
  });

  it("RuleReferenceData.editionCode is EditionCode", () => {
    expectTypeOf<RuleReferenceData["editionCode"]>().toEqualTypeOf<EditionCode>();
  });
});
