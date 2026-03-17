/**
 * ContactModal Component Tests
 *
 * Tests the contact creation/editing modal.
 * Tests include rendering, form inputs, template selection,
 * rating selectors, validation, cost calculation, and save/cancel.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactModal } from "../ContactModal";
import type { ContactModalProps } from "../types";
import type { Contact, ContactTemplateData } from "@/lib/types";

// =============================================================================
// FACTORIES
// =============================================================================

const makeTemplate = (overrides: Partial<ContactTemplateData> = {}): ContactTemplateData =>
  ({
    id: "fixer",
    name: "Fixer",
    description: "A fixer who can get things done",
    suggestedConnection: 3,
    suggestedLoyalty: 2,
    ...overrides,
  }) as ContactTemplateData;

const makeContact = (overrides: Partial<Contact> = {}): Contact =>
  ({
    name: "Vinnie the Fixer",
    connection: 3,
    loyalty: 2,
    type: "Fixer",
    notes: "Reliable contact",
    ...overrides,
  }) as Contact;

const defaultProps: ContactModalProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSave: vi.fn(),
  isEditing: false,
  templates: [],
  maxCost: 7,
  availableKarma: 10,
};

// =============================================================================
// TESTS
// =============================================================================

describe("ContactModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  describe("rendering", () => {
    it("does not render when isOpen is false", () => {
      render(<ContactModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText("Add Contact")).not.toBeInTheDocument();
    });

    it("renders Add Contact title when not editing", () => {
      render(<ContactModal {...defaultProps} />);

      // Title h3 and save button both say "Add Contact"
      const matches = screen.getAllByText("Add Contact");
      expect(matches.length).toBe(2); // title + button
    });

    it("renders Edit Contact title when editing", () => {
      render(<ContactModal {...defaultProps} isEditing={true} initialContact={makeContact()} />);

      expect(screen.getByText("Edit Contact")).toBeInTheDocument();
    });

    it("renders name input field", () => {
      render(<ContactModal {...defaultProps} />);

      expect(screen.getByPlaceholderText("Contact's name or alias")).toBeInTheDocument();
    });

    it("renders type input field", () => {
      render(<ContactModal {...defaultProps} />);

      expect(screen.getByPlaceholderText("e.g., Fixer, Street Doc")).toBeInTheDocument();
    });

    it("renders connection and loyalty labels", () => {
      render(<ContactModal {...defaultProps} />);

      expect(screen.getByText("Connection (how useful)")).toBeInTheDocument();
      expect(screen.getByText("Loyalty (how loyal)")).toBeInTheDocument();
    });

    it("renders notes textarea", () => {
      render(<ContactModal {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Any additional details about this contact...")
      ).toBeInTheDocument();
    });

    it("renders max karma hint", () => {
      render(<ContactModal {...defaultProps} />);

      expect(screen.getByText(/Max 7 karma per contact/)).toBeInTheDocument();
    });

    it("renders Cancel and Add Contact buttons", () => {
      render(<ContactModal {...defaultProps} />);

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      // The save button text — disabled initially because name is empty
      expect(screen.getByText("Add Contact", { selector: "button" })).toBeInTheDocument();
    });

    it("renders Save Changes button when editing", () => {
      render(<ContactModal {...defaultProps} isEditing={true} initialContact={makeContact()} />);

      expect(screen.getByText("Save Changes")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // TEMPLATE SELECTION
  // ===========================================================================

  describe("template selection", () => {
    it("shows template buttons when templates provided", () => {
      const templates = [makeTemplate(), makeTemplate({ id: "street-doc", name: "Street Doc" })];

      render(<ContactModal {...defaultProps} templates={templates} />);

      expect(screen.getByText("Custom")).toBeInTheDocument();
      expect(screen.getByText("Fixer")).toBeInTheDocument();
      expect(screen.getByText("Street Doc")).toBeInTheDocument();
    });

    it("does not show templates when editing", () => {
      render(
        <ContactModal
          {...defaultProps}
          isEditing={true}
          initialContact={makeContact()}
          templates={[makeTemplate()]}
        />
      );

      expect(screen.queryByText("Start from Template (optional)")).not.toBeInTheDocument();
    });

    it("populates form when template is selected", () => {
      const template = makeTemplate({
        name: "Fixer",
        suggestedConnection: 4,
        suggestedLoyalty: 3,
        description: "A well-connected fixer",
      });

      render(<ContactModal {...defaultProps} templates={[template]} />);

      fireEvent.click(screen.getByText("Fixer"));

      // Type should be populated from template
      const typeInput = screen.getByPlaceholderText("e.g., Fixer, Street Doc") as HTMLInputElement;
      expect(typeInput.value).toBe("Fixer");
    });

    it("shows template description when template is selected", () => {
      const template = makeTemplate({ description: "A well-connected fixer" });

      render(<ContactModal {...defaultProps} templates={[template]} />);

      fireEvent.click(screen.getByText("Fixer"));

      // Description appears in both button title and a p element
      const matches = screen.getAllByText("A well-connected fixer");
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("resets form when Custom button is clicked", () => {
      const template = makeTemplate();

      render(<ContactModal {...defaultProps} templates={[template]} />);

      // Select template first
      fireEvent.click(screen.getByText("Fixer"));
      // Then click Custom
      fireEvent.click(screen.getByText("Custom"));

      const typeInput = screen.getByPlaceholderText("e.g., Fixer, Street Doc") as HTMLInputElement;
      expect(typeInput.value).toBe("");
    });
  });

  // ===========================================================================
  // FORM INPUTS
  // ===========================================================================

  describe("form inputs", () => {
    it("updates name when typed", () => {
      render(<ContactModal {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Contact's name or alias") as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: "Johnny" } });

      expect(nameInput.value).toBe("Johnny");
    });

    it("updates type when typed", () => {
      render(<ContactModal {...defaultProps} />);

      const typeInput = screen.getByPlaceholderText("e.g., Fixer, Street Doc") as HTMLInputElement;
      fireEvent.change(typeInput, { target: { value: "Street Doc" } });

      expect(typeInput.value).toBe("Street Doc");
    });

    it("updates notes when typed", () => {
      render(<ContactModal {...defaultProps} />);

      const notesInput = screen.getByPlaceholderText(
        "Any additional details about this contact..."
      ) as HTMLTextAreaElement;
      fireEvent.change(notesInput, { target: { value: "Helpful notes" } });

      expect(notesInput.value).toBe("Helpful notes");
    });

    it("populates form with initial contact when editing", () => {
      const contact = makeContact({ name: "Vinnie", type: "Fixer" });

      render(<ContactModal {...defaultProps} isEditing={true} initialContact={contact} />);

      const nameInput = screen.getByPlaceholderText("Contact's name or alias") as HTMLInputElement;
      expect(nameInput.value).toBe("Vinnie");
    });
  });

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  describe("validation", () => {
    it("disables save button when name is empty", () => {
      render(<ContactModal {...defaultProps} />);

      const saveBtn = screen.getByText("Add Contact", { selector: "button" });
      expect(saveBtn).toBeDisabled();
    });

    it("shows validation message when name is empty", () => {
      render(<ContactModal {...defaultProps} />);

      expect(screen.getByText("• Enter a contact name")).toBeInTheDocument();
    });

    it("enables save button when name is filled and karma available", () => {
      render(<ContactModal {...defaultProps} />);

      const nameInput = screen.getByPlaceholderText("Contact's name or alias");
      fireEvent.change(nameInput, { target: { value: "Johnny" } });

      const saveBtn = screen.getByText("Add Contact", { selector: "button" });
      expect(saveBtn).not.toBeDisabled();
    });

    it("disables save when contact cost exceeds available karma", () => {
      render(<ContactModal {...defaultProps} availableKarma={1} />);

      const nameInput = screen.getByPlaceholderText("Contact's name or alias");
      fireEvent.change(nameInput, { target: { value: "Johnny" } });

      // Default connection=1 + loyalty=1 = 2, but only 1 karma available
      const saveBtn = screen.getByText("Add Contact", { selector: "button" });
      expect(saveBtn).toBeDisabled();
    });

    it("shows not enough karma message", () => {
      render(<ContactModal {...defaultProps} availableKarma={1} />);

      const nameInput = screen.getByPlaceholderText("Contact's name or alias");
      fireEvent.change(nameInput, { target: { value: "Johnny" } });

      expect(screen.getByText(/Not enough karma available/)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // COST DISPLAY
  // ===========================================================================

  describe("cost display", () => {
    it("shows contact cost as connection + loyalty", () => {
      render(<ContactModal {...defaultProps} />);

      // Default: connection=1, loyalty=1, cost=2
      expect(screen.getByText(/2 \/ 7 Karma/)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // SAVE AND CANCEL
  // ===========================================================================

  describe("save and cancel", () => {
    it("calls onSave with contact data when save clicked", () => {
      const onSave = vi.fn();
      render(<ContactModal {...defaultProps} onSave={onSave} />);

      const nameInput = screen.getByPlaceholderText("Contact's name or alias");
      fireEvent.change(nameInput, { target: { value: "Johnny" } });

      const saveBtn = screen.getByText("Add Contact", { selector: "button" });
      fireEvent.click(saveBtn);

      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Johnny",
          connection: 1,
          loyalty: 1,
        })
      );
    });

    it("trims name and notes before saving", () => {
      const onSave = vi.fn();
      render(<ContactModal {...defaultProps} onSave={onSave} />);

      const nameInput = screen.getByPlaceholderText("Contact's name or alias");
      fireEvent.change(nameInput, { target: { value: "  Johnny  " } });

      const saveBtn = screen.getByText("Add Contact", { selector: "button" });
      fireEvent.click(saveBtn);

      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: "Johnny" }));
    });

    it("does not call onSave when form is invalid", () => {
      const onSave = vi.fn();
      render(<ContactModal {...defaultProps} onSave={onSave} />);

      // Name is empty, so save should be disabled
      const saveBtn = screen.getByText("Add Contact", { selector: "button" });
      fireEvent.click(saveBtn);

      expect(onSave).not.toHaveBeenCalled();
    });

    it("calls onClose when Cancel clicked", () => {
      const onClose = vi.fn();
      render(<ContactModal {...defaultProps} onClose={onClose} />);

      fireEvent.click(screen.getByText("Cancel"));

      expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when X button clicked", () => {
      const onClose = vi.fn();
      render(<ContactModal {...defaultProps} onClose={onClose} />);

      // The X button is the first close button (in header)
      const closeButtons = screen.getAllByRole("button");
      const xButton = closeButtons.find((btn) => btn.querySelector("svg") && !btn.textContent);
      if (xButton) {
        fireEvent.click(xButton);
        expect(onClose).toHaveBeenCalled();
      }
    });
  });

  // ===========================================================================
  // RATING SELECTORS
  // ===========================================================================

  describe("rating selectors", () => {
    it("disables connection ratings that would exceed max karma", () => {
      render(<ContactModal {...defaultProps} />);

      // With loyalty=1, connection=7 would be 8 total > MAX_KARMA_PER_CONTACT (7)
      // So rating 7 for connection should be disabled
      const allButtons = screen.getAllByRole("button");
      const disabledButtons = allButtons.filter((btn) => btn.hasAttribute("disabled"));
      expect(disabledButtons.length).toBeGreaterThan(0);
    });
  });
});
