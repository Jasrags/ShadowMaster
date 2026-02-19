/**
 * DerivedStatsDisplay Component Tests
 *
 * Tests the derived stats panel (limits, initiative, condition monitors,
 * pools, movement, armor). Accepts a Character object and computes
 * all derived values internally with formula breakdown tooltips.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { setupDisplayCardMock, setupReactAriaMock, LUCIDE_MOCK } from "./test-helpers";

setupDisplayCardMock();
setupReactAriaMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);
vi.mock("@/components/ui", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { DerivedStatsDisplay } from "../DerivedStatsDisplay";
import type { Character } from "@/lib/types";
import { createSheetCharacter } from "./test-helpers";

// Base character with known attribute values for predictable derived stats
// BOD=5 AGI=6 REA=5 STR=4 WIL=3 LOG=3 INT=4 CHA=2 ESS=4.2
const baseCharacter: Character = createSheetCharacter({
  attributes: {
    body: 5,
    agility: 6,
    reaction: 5,
    strength: 4,
    willpower: 3,
    logic: 3,
    intuition: 4,
    charisma: 2,
  },
  specialAttributes: {
    edge: 3,
    essence: 4.2,
  },
});

describe("DerivedStatsDisplay", () => {
  describe("initiative", () => {
    it("renders initiative with dice notation", () => {
      render(<DerivedStatsDisplay character={baseCharacter} />);
      // initiative = REA(5) + INT(4) = 9
      expect(screen.getByText("9+1d6")).toBeInTheDocument();
    });

    it("renders section headers", () => {
      render(<DerivedStatsDisplay character={baseCharacter} />);
      // "Initiative" appears both as a section header and a stat label
      expect(screen.getAllByText("Initiative").length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("limits", () => {
    it("renders all three limit labels", () => {
      render(<DerivedStatsDisplay character={baseCharacter} />);
      expect(screen.getByText("Limits")).toBeInTheDocument();
      expect(screen.getByText("Physical")).toBeInTheDocument();
      expect(screen.getByText("Mental")).toBeInTheDocument();
      expect(screen.getByText("Social")).toBeInTheDocument();
    });

    it("computes correct limit values from attributes", () => {
      render(<DerivedStatsDisplay character={baseCharacter} />);
      // physicalLimit = ceil((4*2 + 5 + 5) / 3) = ceil(18/3) = 6
      // mentalLimit = ceil((3*2 + 4 + 3) / 3) = ceil(13/3) = 5
      // socialLimit = ceil((2*2 + 3 + ceil(4.2)) / 3) = ceil(12/3) = 4
      // Values 6, 5, 4 may appear multiple times; check they exist
      expect(screen.getAllByText("6").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("condition monitors", () => {
    it("renders condition monitors section", () => {
      render(<DerivedStatsDisplay character={baseCharacter} />);
      expect(screen.getByText("Condition Monitors")).toBeInTheDocument();
      expect(screen.getByText("Physical CM")).toBeInTheDocument();
      expect(screen.getByText("Stun CM")).toBeInTheDocument();
      expect(screen.getByText("Overflow")).toBeInTheDocument();
    });

    it("computes correct condition monitor values", () => {
      render(<DerivedStatsDisplay character={baseCharacter} />);
      // physicalCM = ceil(5/2) + 8 = 11
      expect(screen.getByText("11")).toBeInTheDocument();
      // stunCM = ceil(3/2) + 8 = 10
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("pools", () => {
    it("renders all secondary pools", () => {
      render(<DerivedStatsDisplay character={baseCharacter} />);
      expect(screen.getByText("Pools")).toBeInTheDocument();
      expect(screen.getByText("Composure")).toBeInTheDocument();
      expect(screen.getByText("Judge Intentions")).toBeInTheDocument();
      expect(screen.getByText("Memory")).toBeInTheDocument();
      // liftCarry = BOD(5) + STR(4) = 9 kg
      expect(screen.getByText("9 kg")).toBeInTheDocument();
    });
  });

  describe("movement", () => {
    it("renders walk and run speeds", () => {
      render(<DerivedStatsDisplay character={baseCharacter} />);
      expect(screen.getByText("Movement")).toBeInTheDocument();
      // walk = AGI(6) * 2 = 12
      expect(screen.getByText("12m")).toBeInTheDocument();
      // run = AGI(6) * 4 = 24
      expect(screen.getByText("24m")).toBeInTheDocument();
    });
  });

  describe("armor", () => {
    it("does not render armor section when character has no armor", () => {
      render(<DerivedStatsDisplay character={baseCharacter} />);
      const armorHeaders = screen.queryAllByText("Armor");
      expect(armorHeaders.length).toBe(0);
    });

    it("renders armor total from equipped armor", () => {
      const charWithArmor = createSheetCharacter({
        ...baseCharacter,
        armor: [
          {
            name: "Armor Jacket",
            category: "armor",
            subcategory: "armor",
            armorRating: 12,
            equipped: true,
            cost: 1000,
            quantity: 1,
          },
          {
            name: "Lined Coat",
            category: "armor",
            subcategory: "armor",
            armorRating: 9,
            equipped: false,
            cost: 900,
            quantity: 1,
          },
        ],
      });
      render(<DerivedStatsDisplay character={charWithArmor} />);
      expect(screen.getByText("Total")).toBeInTheDocument();
      // Only equipped armor counts: 12
      expect(screen.getByText("12")).toBeInTheDocument();
    });
  });
});
