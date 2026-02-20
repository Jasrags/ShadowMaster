/**
 * ComplexFormsDisplay Component Tests
 *
 * Tests the complex forms display with expandable rows for technomancers.
 * Covers empty state, collapsed row content, expand/collapse behavior,
 * expanded details, fallback rendering, and onSelect isolation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, MOCK_COMPLEX_FORMS } from "./test-helpers";
import type { ComplexFormData } from "@/lib/rules";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

const MOCK_FORM_NO_DESC: ComplexFormData = {
  id: "static-veil",
  name: "Static Veil",
  target: "Persona",
  duration: "Sustained",
  fading: "L+1",
};

let mockCatalog: ComplexFormData[] = MOCK_COMPLEX_FORMS as ComplexFormData[];
vi.mock("@/lib/rules", () => ({
  useComplexForms: () => mockCatalog,
}));

import { ComplexFormsDisplay } from "../ComplexFormsDisplay";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ComplexFormsDisplay", () => {
  beforeEach(() => {
    mockCatalog = MOCK_COMPLEX_FORMS as ComplexFormData[];
  });

  // -------------------------------------------------------------------------
  // Empty state
  // -------------------------------------------------------------------------

  describe("empty state", () => {
    it("returns null when complexForms array is empty", () => {
      const { container } = render(<ComplexFormsDisplay complexForms={[]} />);
      expect(container.innerHTML).toBe("");
    });
  });

  // -------------------------------------------------------------------------
  // Collapsed row
  // -------------------------------------------------------------------------

  describe("collapsed row", () => {
    it("renders form name", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      expect(screen.getByText("Cleaner")).toBeInTheDocument();
    });

    it("renders target badge", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      expect(screen.getByTestId("target-badge")).toHaveTextContent("Persona");
    });

    it("renders fading pill", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      expect(screen.getByTestId("fading-pill")).toHaveTextContent("L+1");
    });

    it("does not show expanded content in collapsed state", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    });

    it("does not show stats row in collapsed state", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      expect(screen.queryByTestId("stats-row")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Expand / collapse
  // -------------------------------------------------------------------------

  describe("expand/collapse", () => {
    it("shows expand chevron (collapsed by default)", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      expect(screen.getByTestId("expand-button")).toBeInTheDocument();
      expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    });

    it("expands on click to show details", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      fireEvent.click(screen.getByTestId("complex-form-row"));
      expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
    });

    it("collapses on second click", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      fireEvent.click(screen.getByTestId("complex-form-row"));
      expect(screen.getByTestId("expanded-content")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("complex-form-row"));
      expect(screen.queryByTestId("expanded-content")).not.toBeInTheDocument();
    });

    it("expands rows independently", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner", "resonance-spike"]} />);
      const rows = screen.getAllByTestId("complex-form-row");

      fireEvent.click(rows[0]);
      expect(screen.getAllByTestId("expanded-content")).toHaveLength(1);

      fireEvent.click(rows[1]);
      expect(screen.getAllByTestId("expanded-content")).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  // Expanded details
  // -------------------------------------------------------------------------

  describe("expanded details", () => {
    it("shows target stat", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      fireEvent.click(screen.getByTestId("complex-form-row"));
      expect(screen.getByTestId("stat-target")).toHaveTextContent("Persona");
    });

    it("shows duration stat", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      fireEvent.click(screen.getByTestId("complex-form-row"));
      expect(screen.getByTestId("stat-duration")).toHaveTextContent("Permanent");
    });

    it("shows description when present", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      fireEvent.click(screen.getByTestId("complex-form-row"));
      expect(screen.getByTestId("form-description")).toHaveTextContent(
        "Removes marks from a persona"
      );
    });

    it("does not show description when absent", () => {
      mockCatalog = [MOCK_FORM_NO_DESC];
      render(<ComplexFormsDisplay complexForms={["static-veil"]} />);
      fireEvent.click(screen.getByTestId("complex-form-row"));
      expect(screen.queryByTestId("form-description")).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Fallback rows
  // -------------------------------------------------------------------------

  describe("fallback rows", () => {
    it("renders kebab-to-space name for unmatched ID", () => {
      render(<ComplexFormsDisplay complexForms={["unknown-form"]} />);
      expect(screen.getByText("unknown form")).toBeInTheDocument();
    });

    it("renders fallback when catalog is empty", () => {
      mockCatalog = [];
      render(<ComplexFormsDisplay complexForms={["cleaner"]} />);
      expect(screen.getByTestId("fallback-row")).toBeInTheDocument();
      expect(screen.getByText("cleaner")).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Multiple forms
  // -------------------------------------------------------------------------

  describe("multiple forms", () => {
    it("renders all forms", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner", "resonance-spike"]} />);
      expect(screen.getByText("Cleaner")).toBeInTheDocument();
      expect(screen.getByText("Resonance Spike")).toBeInTheDocument();
    });

    it("renders correct number of rows", () => {
      render(<ComplexFormsDisplay complexForms={["cleaner", "resonance-spike"]} />);
      expect(screen.getAllByTestId("complex-form-row")).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  // onSelect prop
  // -------------------------------------------------------------------------

  describe("onSelect prop", () => {
    it("does not call onSelect when row is clicked", () => {
      const onSelect = vi.fn();
      render(<ComplexFormsDisplay complexForms={["cleaner"]} onSelect={onSelect} />);
      fireEvent.click(screen.getByTestId("complex-form-row"));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});
