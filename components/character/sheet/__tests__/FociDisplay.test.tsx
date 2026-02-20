/**
 * FociDisplay Component Tests
 *
 * Tests the magical foci display with expandable rows showing name,
 * type badge, bonded status, and force pill in collapsed state, with
 * catalog details (description, availability, cost, karma to bond,
 * notes, source reference) revealed on expand.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK } from "./test-helpers";
import type { FocusItem } from "@/lib/types";
import { FocusType } from "@/lib/types/edition";
import type { FocusCatalogItemData } from "@/lib/rules/RulesetContext";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

let mockFociCatalog: FocusCatalogItemData[] = [];
vi.mock("@/lib/rules", () => ({
  useFoci: () => mockFociCatalog,
}));

import { FociDisplay } from "../FociDisplay";

// ---------------------------------------------------------------------------
// Mock catalog data
// ---------------------------------------------------------------------------

const MOCK_FOCI_CATALOG: FocusCatalogItemData[] = [
  {
    id: "power-focus",
    name: "Power Focus",
    type: "power",
    costMultiplier: 18000,
    bondingKarmaMultiplier: 8,
    availability: 0,
    legality: "restricted",
    description: "Increases the wielder's Magic attribute.",
    page: 318,
    source: "SR5",
  },
  {
    id: "weapon-focus",
    name: "Weapon Focus",
    type: "weapon",
    costMultiplier: 7000,
    bondingKarmaMultiplier: 3,
    availability: 0,
    legality: "restricted",
    description: "A weapon enchanted to serve as a magical focus.",
    page: 318,
    source: "SR5",
  },
];

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const baseFocus: FocusItem = {
  catalogId: "power-focus",
  name: "Power Focus",
  type: FocusType.Power,
  force: 3,
  bonded: true,
  karmaToBond: 24,
  cost: 54000,
  availability: 9,
  legality: "restricted",
};

const unbondedFocus: FocusItem = {
  catalogId: "weapon-focus",
  name: "Weapon Focus",
  type: FocusType.Weapon,
  force: 2,
  bonded: false,
  karmaToBond: 6,
  cost: 14000,
  availability: 6,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FociDisplay", () => {
  beforeEach(() => {
    mockFociCatalog = MOCK_FOCI_CATALOG;
  });

  // -------------------------------------------------------------------------
  // Empty state
  // -------------------------------------------------------------------------

  describe("empty state", () => {
    it("returns null when foci array is empty", () => {
      const { container } = render(<FociDisplay foci={[]} />);
      expect(container.innerHTML).toBe("");
    });
  });

  // -------------------------------------------------------------------------
  // Collapsed row
  // -------------------------------------------------------------------------

  describe("collapsed row", () => {
    it("renders focus name", () => {
      render(<FociDisplay foci={[baseFocus]} />);
      expect(screen.getByText("Power Focus")).toBeInTheDocument();
    });

    it("renders force pill", () => {
      render(<FociDisplay foci={[baseFocus]} />);
      const pill = screen.getByTestId("force-pill");
      expect(pill).toHaveTextContent("F3");
    });

    it("renders bonded badge when bonded", () => {
      render(<FociDisplay foci={[baseFocus]} />);
      expect(screen.getByTestId("bonded-badge")).toHaveTextContent("Bonded");
    });

    it("does not render bonded badge when not bonded", () => {
      render(<FociDisplay foci={[unbondedFocus]} />);
      expect(screen.queryByTestId("bonded-badge")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Expand / collapse
  // -------------------------------------------------------------------------

  describe("expand/collapse", () => {
    it("shows expand chevron (collapsed by default)", () => {
      render(<FociDisplay foci={[baseFocus]} />);
      expect(screen.getByTestId("expand-button")).toBeInTheDocument();
      expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    });

    it("expands on click to show details", () => {
      render(<FociDisplay foci={[baseFocus]} />);
      fireEvent.click(screen.getByTestId("focus-row"));
      expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    });

    it("collapses on second click", () => {
      render(<FociDisplay foci={[baseFocus]} />);
      fireEvent.click(screen.getByTestId("focus-row"));
      expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("focus-row"));
      expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Expanded details
  // -------------------------------------------------------------------------

  describe("expanded details", () => {
    beforeEach(() => {
      render(<FociDisplay foci={[baseFocus]} />);
      fireEvent.click(screen.getByTestId("focus-row"));
    });

    it("shows catalog description", () => {
      expect(screen.getByTestId("focus-description")).toHaveTextContent(
        "Increases the wielder's Magic attribute."
      );
    });

    it("shows availability with legality suffix", () => {
      expect(screen.getByTestId("stat-availability")).toHaveTextContent("9R");
    });

    it("shows cost", () => {
      expect(screen.getByTestId("stat-cost")).toHaveTextContent("¥54,000");
    });

    it("shows karma to bond", () => {
      expect(screen.getByTestId("stat-karma")).toHaveTextContent("24 karma");
    });

    it("shows source reference", () => {
      expect(screen.getByTestId("source-reference")).toHaveTextContent("SR5 p.318");
    });

    it("shows notes when present", () => {
      const focusWithNotes: FocusItem = {
        ...baseFocus,
        notes: "Astral signature suppressed",
      };
      const { unmount } = render(<FociDisplay foci={[focusWithNotes]} />);
      // Need to expand the newly rendered row
      const rows = screen.getAllByTestId("focus-row");
      fireEvent.click(rows[rows.length - 1]);
      expect(screen.getByTestId("focus-notes")).toHaveTextContent("Astral signature suppressed");
      unmount();
    });
  });

  // -------------------------------------------------------------------------
  // Catalog fallback
  // -------------------------------------------------------------------------

  describe("catalog fallback", () => {
    it("renders gracefully when catalog item not found", () => {
      const orphanFocus: FocusItem = {
        catalogId: "nonexistent-focus",
        name: "Mystery Focus",
        type: FocusType.Spell,
        force: 1,
        bonded: false,
        karmaToBond: 2,
        cost: 5000,
        availability: 4,
      };
      render(<FociDisplay foci={[orphanFocus]} />);
      expect(screen.getByText("Mystery Focus")).toBeInTheDocument();
      expect(screen.getByTestId("force-pill")).toHaveTextContent("F1");

      // Expand — should still show stats from character item
      fireEvent.click(screen.getByTestId("focus-row"));
      expect(screen.getByTestId("stat-availability")).toHaveTextContent("4");
      expect(screen.getByTestId("stat-cost")).toHaveTextContent("¥5,000");
      // No description or source reference
      expect(screen.queryByTestId("focus-description")).not.toBeInTheDocument();
      expect(screen.queryByTestId("source-reference")).not.toBeInTheDocument();
    });

    it("renders when catalog is empty", () => {
      mockFociCatalog = [];
      render(<FociDisplay foci={[baseFocus]} />);
      expect(screen.getByText("Power Focus")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Multiple foci
  // -------------------------------------------------------------------------

  describe("multiple foci", () => {
    it("renders all foci", () => {
      render(<FociDisplay foci={[baseFocus, unbondedFocus]} />);
      expect(screen.getByText("Power Focus")).toBeInTheDocument();
      expect(screen.getByText("Weapon Focus")).toBeInTheDocument();
      expect(screen.getAllByTestId("focus-row")).toHaveLength(2);
    });

    it("each row expands independently", () => {
      render(<FociDisplay foci={[baseFocus, unbondedFocus]} />);
      const rows = screen.getAllByTestId("focus-row");

      // Expand first row
      fireEvent.click(rows[0]);
      expect(screen.getAllByTestId("expanded-content")).toHaveLength(1);

      // Expand second row too
      fireEvent.click(rows[1]);
      expect(screen.getAllByTestId("expanded-content")).toHaveLength(2);
    });
  });
});
