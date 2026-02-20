/**
 * SpellsDisplay Component Tests
 *
 * Tests the spells display with expandable rows grouped by category.
 * Covers empty state, category grouping, collapsed/expanded row content,
 * input formats, and onSelect isolation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, MOCK_SPELLS_CATALOG } from "./test-helpers";
import type { SpellsCatalogData } from "@/lib/rules";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

let mockSpellsCatalog: SpellsCatalogData = MOCK_SPELLS_CATALOG as SpellsCatalogData;
vi.mock("@/lib/rules", () => ({
  useSpells: () => mockSpellsCatalog,
}));

import { SpellsDisplay } from "../SpellsDisplay";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SpellsDisplay", () => {
  beforeEach(() => {
    mockSpellsCatalog = MOCK_SPELLS_CATALOG as SpellsCatalogData;
  });

  // -------------------------------------------------------------------------
  // Empty state
  // -------------------------------------------------------------------------

  describe("empty state", () => {
    it("returns null when spells array is empty", () => {
      const { container } = render(<SpellsDisplay spells={[]} />);
      expect(container.innerHTML).toBe("");
    });

    it("returns null when spells is undefined", () => {
      const { container } = render(<SpellsDisplay spells={undefined as unknown as string[]} />);
      expect(container.innerHTML).toBe("");
    });
  });

  // -------------------------------------------------------------------------
  // Category grouping
  // -------------------------------------------------------------------------

  describe("category grouping", () => {
    it("renders section labels for populated categories", () => {
      render(<SpellsDisplay spells={["manabolt", "heal", "invisibility"]} />);
      expect(screen.getByTestId("section-label-combat")).toHaveTextContent("Combat");
      expect(screen.getByTestId("section-label-health")).toHaveTextContent("Health");
      expect(screen.getByTestId("section-label-illusion")).toHaveTextContent("Illusion");
    });

    it("does not render section labels for empty categories", () => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      expect(screen.getByTestId("section-label-combat")).toBeInTheDocument();
      expect(screen.queryByTestId("section-label-detection")).not.toBeInTheDocument();
      expect(screen.queryByTestId("section-label-health")).not.toBeInTheDocument();
      expect(screen.queryByTestId("section-label-illusion")).not.toBeInTheDocument();
      expect(screen.queryByTestId("section-label-manipulation")).not.toBeInTheDocument();
    });

    it("groups spells into correct categories", () => {
      render(<SpellsDisplay spells={["manabolt", "powerbolt", "heal"]} />);
      // Two combat spells + one health spell = 3 rows
      expect(screen.getAllByTestId("spell-row")).toHaveLength(3);
      expect(screen.getByText("Manabolt")).toBeInTheDocument();
      expect(screen.getByText("Powerbolt")).toBeInTheDocument();
      expect(screen.getByText("Heal")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Collapsed row
  // -------------------------------------------------------------------------

  describe("collapsed row", () => {
    it("renders spell name", () => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      expect(screen.getByText("Manabolt")).toBeInTheDocument();
    });

    it("renders drain pill", () => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      expect(screen.getByTestId("drain-pill")).toHaveTextContent("F-3");
    });

    it("does not show description in collapsed state", () => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      expect(screen.queryByTestId("spell-description")).not.toBeInTheDocument();
    });

    it("does not show stats row in collapsed state", () => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      expect(screen.queryByTestId("stats-row")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Expand / collapse
  // -------------------------------------------------------------------------

  describe("expand/collapse", () => {
    it("shows expand chevron (collapsed by default)", () => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      expect(screen.getByTestId("expand-button")).toBeInTheDocument();
      expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    });

    it("expands on click to show details", () => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      fireEvent.click(screen.getByTestId("spell-row"));
      expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    });

    it("collapses on second click", () => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      fireEvent.click(screen.getByTestId("spell-row"));
      expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("spell-row"));
      expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    });

    it("expands rows independently", () => {
      render(<SpellsDisplay spells={["manabolt", "powerbolt"]} />);
      const rows = screen.getAllByTestId("spell-row");

      // Expand first row
      fireEvent.click(rows[0]);
      expect(screen.getAllByTestId("expanded-content")).toHaveLength(1);

      // Expand second row too
      fireEvent.click(rows[1]);
      expect(screen.getAllByTestId("expanded-content")).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  // Expanded details
  // -------------------------------------------------------------------------

  describe("expanded details", () => {
    beforeEach(() => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      fireEvent.click(screen.getByTestId("spell-row"));
    });

    it("shows catalog description", () => {
      expect(screen.getByTestId("spell-description")).toHaveTextContent("A bolt of mana energy");
    });

    it("shows type stat in title case", () => {
      expect(screen.getByTestId("stat-type")).toHaveTextContent("Mana");
    });

    it("shows range stat", () => {
      expect(screen.getByTestId("stat-range")).toHaveTextContent("LOS");
    });

    it("shows duration stat", () => {
      expect(screen.getByTestId("stat-duration")).toHaveTextContent("Instant");
    });

    it("shows damage when present", () => {
      const { unmount } = render(<SpellsDisplay spells={["powerbolt"]} />);
      const rows = screen.getAllByTestId("spell-row");
      fireEvent.click(rows[rows.length - 1]);
      expect(screen.getByTestId("stat-damage")).toHaveTextContent("Physical");
      unmount();
    });

    it("does not show damage when absent", () => {
      // manabolt is already expanded and has no damage field
      expect(screen.queryByTestId("stat-damage")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Input formats
  // -------------------------------------------------------------------------

  describe("input formats", () => {
    it("handles string spell IDs", () => {
      render(<SpellsDisplay spells={["manabolt"]} />);
      expect(screen.getByText("Manabolt")).toBeInTheDocument();
    });

    it("handles object-format spell entries", () => {
      render(<SpellsDisplay spells={[{ id: "manabolt" }]} />);
      expect(screen.getByText("Manabolt")).toBeInTheDocument();
    });

    it("skips unmatched spell IDs", () => {
      render(<SpellsDisplay spells={["nonexistent-spell", "manabolt"]} />);
      expect(screen.getAllByTestId("spell-row")).toHaveLength(1);
      expect(screen.getByText("Manabolt")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // onSelect prop
  // -------------------------------------------------------------------------

  describe("onSelect prop", () => {
    it("does not call onSelect when row is clicked", () => {
      const onSelect = vi.fn();
      render(<SpellsDisplay spells={["manabolt"]} onSelect={onSelect} />);
      fireEvent.click(screen.getByTestId("spell-row"));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});
