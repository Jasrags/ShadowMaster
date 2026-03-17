/**
 * LifestyleModal Component Tests
 *
 * Tests the lifestyle creation/editing modal.
 * Tests include rendering, form inputs, lifestyle type selection,
 * cost calculation, modifications, subscriptions, validation, and save/cancel.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LifestyleModal } from "../LifestyleModal";
import type { LifestyleModalProps, NewLifestyleState } from "../types";
import type { LifestyleModification, LifestyleSubscription } from "@/lib/types";

// Mock the Modal wrapper
vi.mock("../Modal", () => ({
  Modal: ({
    isOpen,
    title,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        {children}
      </div>
    ) : null,
}));

// Mock LifestyleModificationSelector
vi.mock("../../shared/LifestyleModificationSelector", () => ({
  LifestyleModificationSelector: ({ onAdd }: { onAdd: (mod: LifestyleModification) => void }) => (
    <button
      data-testid="add-modification-btn"
      onClick={() =>
        onAdd({
          catalogId: "garage",
          name: "Garage",
          type: "positive",
          modifier: 10,
          modifierType: "percentage",
        } as LifestyleModification)
      }
    >
      + Add Modification
    </button>
  ),
}));

// Mock LifestyleSubscriptionSelector
vi.mock("../../shared/LifestyleSubscriptionSelector", () => ({
  LifestyleSubscriptionSelector: ({ onAdd }: { onAdd: (sub: LifestyleSubscription) => void }) => (
    <button
      data-testid="add-subscription-btn"
      onClick={() =>
        onAdd({
          id: "docwagon-1",
          catalogId: "docwagon-basic",
          name: "DocWagon Basic",
          monthlyCost: 5000,
        } as LifestyleSubscription)
      }
    >
      + Add
    </button>
  ),
}));

// =============================================================================
// FACTORIES
// =============================================================================

const defaultProps: LifestyleModalProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSave: vi.fn(),
  nuyenRemaining: 50000,
};

// =============================================================================
// TESTS
// =============================================================================

describe("LifestyleModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  describe("rendering", () => {
    it("does not render when isOpen is false", () => {
      render(<LifestyleModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("renders New Lifestyle title when not editing", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.getByTestId("modal-title")).toHaveTextContent("New Lifestyle");
    });

    it("renders Edit Lifestyle title when editing", () => {
      const initialData: NewLifestyleState = {
        type: "medium",
        location: "",
        customExpenses: 0,
        customIncome: 0,
        notes: "",
        modifications: [],
      };

      render(<LifestyleModal {...defaultProps} isEditMode={true} initialData={initialData} />);

      expect(screen.getByTestId("modal-title")).toHaveTextContent("Edit Lifestyle");
    });

    it("renders lifestyle type selector", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.getByText("Lifestyle Type *")).toBeInTheDocument();
      expect(screen.getByText("Select a lifestyle...")).toBeInTheDocument();
    });

    it("renders lifestyle type options", () => {
      render(<LifestyleModal {...defaultProps} />);

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });

    it("renders location input", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("e.g., Downtown Seattle, Redmond Barrens")
      ).toBeInTheDocument();
    });

    it("renders modifications section", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.getByText("Modifications")).toBeInTheDocument();
    });

    it("renders subscriptions section", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.getByText("Subscriptions")).toBeInTheDocument();
    });

    it("renders prepaid months input", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.getByText("Prepaid Months (Optional)")).toBeInTheDocument();
    });

    it("renders custom expenses and income inputs", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.getByText("Custom Expenses (/month)")).toBeInTheDocument();
      expect(screen.getByText("Custom Income (/month)")).toBeInTheDocument();
    });

    it("renders Cancel and Save buttons", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save Lifestyle")).toBeInTheDocument();
    });

    it("renders Save Changes button when editing", () => {
      render(
        <LifestyleModal
          {...defaultProps}
          isEditMode={true}
          initialData={{
            type: "medium",
            location: "",
            customExpenses: 0,
            customIncome: 0,
            notes: "",
            modifications: [],
          }}
        />
      );

      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // FORM INPUTS
  // ===========================================================================

  describe("form inputs", () => {
    it("updates location when typed", () => {
      render(<LifestyleModal {...defaultProps} />);

      const locationInput = screen.getByPlaceholderText(
        "e.g., Downtown Seattle, Redmond Barrens"
      ) as HTMLInputElement;
      fireEvent.change(locationInput, { target: { value: "Downtown Seattle" } });

      expect(locationInput.value).toBe("Downtown Seattle");
    });

    it("updates notes when typed", () => {
      render(<LifestyleModal {...defaultProps} />);

      const notesInput = screen.getByPlaceholderText(
        "Additional notes about this lifestyle..."
      ) as HTMLTextAreaElement;
      fireEvent.change(notesInput, { target: { value: "Corner apartment" } });

      expect(notesInput.value).toBe("Corner apartment");
    });

    it("selects lifestyle type from dropdown", () => {
      render(<LifestyleModal {...defaultProps} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "medium" } });

      expect((select as HTMLSelectElement).value).toBe("medium");
    });
  });

  // ===========================================================================
  // COST CALCULATION
  // ===========================================================================

  describe("cost calculation", () => {
    it("shows cost summary when lifestyle type is selected", () => {
      render(<LifestyleModal {...defaultProps} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "medium" } });

      expect(screen.getByText("Monthly Cost Summary")).toBeInTheDocument();
    });

    it("does not show cost summary when no type selected", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.queryByText("Monthly Cost Summary")).not.toBeInTheDocument();
    });

    it("shows base cost for selected lifestyle", () => {
      render(<LifestyleModal {...defaultProps} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "medium" } });

      // Cost summary shows "Base (Medium)" label and the cost
      expect(screen.getByText("5,000")).toBeInTheDocument();
    });

    it("shows affordability warning when cost exceeds budget", () => {
      render(<LifestyleModal {...defaultProps} nuyenRemaining={100} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "medium" } });

      expect(screen.getByText(/Exceeds available budget/)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // MODIFICATIONS
  // ===========================================================================

  describe("modifications", () => {
    it("shows empty modifications message initially", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.getByText(/No modifications added/)).toBeInTheDocument();
    });

    it("adds modification when add button clicked", () => {
      render(<LifestyleModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("add-modification-btn"));

      expect(screen.getByText("Garage")).toBeInTheDocument();
      expect(screen.getByText("+10%")).toBeInTheDocument();
    });

    it("removes modification when remove button clicked", () => {
      render(<LifestyleModal {...defaultProps} />);

      // Add a modification first
      fireEvent.click(screen.getByTestId("add-modification-btn"));
      expect(screen.getByText("Garage")).toBeInTheDocument();

      // Remove it - find the X button next to the mod
      const removeButtons = screen
        .getAllByRole("button")
        .filter((btn) => btn.querySelector("svg") && btn.closest("[class*='justify-between']"));
      // Click the last remove button (the modification's remove)
      if (removeButtons.length > 0) {
        fireEvent.click(removeButtons[removeButtons.length - 1]);
      }

      expect(screen.getByText(/No modifications added/)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // SUBSCRIPTIONS
  // ===========================================================================

  describe("subscriptions", () => {
    it("shows empty subscriptions message initially", () => {
      render(<LifestyleModal {...defaultProps} />);

      expect(screen.getByText(/No subscriptions added/)).toBeInTheDocument();
    });

    it("adds subscription when add button clicked", () => {
      render(<LifestyleModal {...defaultProps} />);

      fireEvent.click(screen.getByTestId("add-subscription-btn"));

      expect(screen.getByText("DocWagon Basic")).toBeInTheDocument();
      expect(screen.getByText("5,000/mo")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  describe("validation", () => {
    it("disables save when no lifestyle type selected", () => {
      render(<LifestyleModal {...defaultProps} />);

      const saveBtn = screen.getByText("Save Lifestyle");
      expect(saveBtn).toBeDisabled();
    });

    it("enables save when lifestyle type selected and affordable", () => {
      render(<LifestyleModal {...defaultProps} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "street" } });

      const saveBtn = screen.getByText("Save Lifestyle");
      expect(saveBtn).not.toBeDisabled();
    });

    it("disables save when cost exceeds budget", () => {
      render(<LifestyleModal {...defaultProps} nuyenRemaining={100} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "medium" } });

      const saveBtn = screen.getByText("Save Lifestyle");
      expect(saveBtn).toBeDisabled();
    });
  });

  // ===========================================================================
  // SAVE AND CANCEL
  // ===========================================================================

  describe("save and cancel", () => {
    it("calls onSave with form data when save clicked", () => {
      const onSave = vi.fn();
      render(<LifestyleModal {...defaultProps} onSave={onSave} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "street" } });

      const saveBtn = screen.getByText("Save Lifestyle");
      fireEvent.click(saveBtn);

      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "street",
        })
      );
    });

    it("calls onClose and resets form when save clicked", () => {
      const onClose = vi.fn();
      render(<LifestyleModal {...defaultProps} onClose={onClose} />);

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "street" } });

      fireEvent.click(screen.getByText("Save Lifestyle"));

      expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when Cancel clicked", () => {
      const onClose = vi.fn();
      render(<LifestyleModal {...defaultProps} onClose={onClose} />);

      fireEvent.click(screen.getByText("Cancel"));

      expect(onClose).toHaveBeenCalled();
    });

    it("does not call onSave when form is invalid", () => {
      const onSave = vi.fn();
      render(<LifestyleModal {...defaultProps} onSave={onSave} />);

      // No type selected, so save should be disabled
      fireEvent.click(screen.getByText("Save Lifestyle"));

      expect(onSave).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // EDIT MODE
  // ===========================================================================

  describe("edit mode", () => {
    it("populates form with initial data", () => {
      const initialData: NewLifestyleState = {
        type: "medium",
        location: "Downtown Seattle",
        customExpenses: 500,
        customIncome: 200,
        notes: "Nice place",
        modifications: [],
      };

      render(<LifestyleModal {...defaultProps} isEditMode={true} initialData={initialData} />);

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("medium");

      const locationInput = screen.getByPlaceholderText(
        "e.g., Downtown Seattle, Redmond Barrens"
      ) as HTMLInputElement;
      expect(locationInput.value).toBe("Downtown Seattle");
    });
  });
});
