/**
 * IdentitiesCard Component Tests
 *
 * Tests the identities/SINs management card in character creation.
 * Tests include rendering, identity list display, nuyen budget tracking,
 * validation status, add/remove interactions, and summary footer.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { IdentitiesCard } from "../IdentitiesCard";
import { SinnerQuality, type Identity, type Lifestyle } from "@/lib/types";

// Mock useCreationBudgets from contexts
const mockBudgets: Record<string, { remaining: number }> = {
  nuyen: { remaining: 50000 },
};

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: () => ({ budgets: mockBudgets }),
}));

// Mock shared CreationCard and SummaryFooter
vi.mock("../../shared", () => ({
  CreationCard: ({
    title,
    status,
    headerAction,
    children,
  }: {
    title: string;
    status: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      <div data-testid="header-action">{headerAction}</div>
      {children}
    </div>
  ),
  SummaryFooter: ({
    count,
    total,
    format,
    label,
  }: {
    count: number;
    total: number;
    format?: string;
    label?: string;
  }) => (
    <div
      data-testid="summary-footer"
      data-count={count}
      data-total={total}
      data-format={format}
      data-label={label}
    >
      Total: {count} {label || "item"}(s) - {total}
    </div>
  ),
}));

// Mock child components
vi.mock("../IdentityCard", () => ({
  IdentityCard: ({
    identity,
    onRemove,
    onEdit,
  }: {
    identity: Identity;
    onRemove: () => void;
    onEdit: () => void;
  }) => (
    <div data-testid="identity-card" data-identity-name={identity.name}>
      <span>{identity.name}</span>
      <span data-testid="sin-type">{identity.sin.type}</span>
      <button data-testid={`remove-identity-${identity.name}`} onClick={onRemove}>
        Remove
      </button>
      <button data-testid={`edit-identity-${identity.name}`} onClick={onEdit}>
        Edit
      </button>
    </div>
  ),
}));

vi.mock("../IdentityModal", () => ({
  IdentityModal: ({
    isOpen,
    onSave,
    onClose,
  }: {
    isOpen: boolean;
    onSave: (data: { name: string; sinType: string; sinRating: number }) => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="identity-modal">
        <button
          data-testid="save-identity"
          onClick={() => onSave({ name: "New Identity", sinType: "fake", sinRating: 4 })}
        >
          Save
        </button>
        <button data-testid="close-identity-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock("../LicenseModal", () => ({
  LicenseModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="license-modal" /> : null,
}));

vi.mock("../LifestyleModal", () => ({
  LifestyleModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="lifestyle-modal" /> : null,
}));

// Factory to create test state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 1,
  priorities: {},
  selections: {
    identities: [],
    lifestyles: [],
    negativeQualities: [],
    qualityLevels: {},
    ...overrides.selections,
  },
  budgets: {},
  validation: { errors: [], warnings: [] },
  ...overrides,
});

const createFakeIdentity = (name: string, rating: number = 4): Identity => ({
  id: `identity-${name}`,
  name,
  sin: { type: "fake", rating },
  licenses: [],
});

const createRealIdentity = (name: string): Identity => ({
  id: `identity-${name}`,
  name,
  sin: { type: "real", sinnerQuality: SinnerQuality.National },
  licenses: [],
});

const createLifestyle = (
  id: string,
  type: string,
  monthlyCost: number,
  identityId?: string
): Lifestyle => ({
  id,
  type,
  monthlyCost,
  prepaidMonths: 1,
  associatedIdentityId: identityId,
});

describe("IdentitiesCard", () => {
  let mockUpdateState: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();
    // Reset budgets to default
    mockBudgets.nuyen = { remaining: 50000 };
  });

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Identities & SINs");
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const headerAction = screen.getByTestId("header-action");
      expect(headerAction.querySelector("button")).toBeInTheDocument();
      expect(headerAction).toHaveTextContent("Add");
    });

    it("shows empty state when no identities", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No identities added")).toBeInTheDocument();
      expect(
        screen.getByText("Every runner needs at least one identity with a SIN.")
      ).toBeInTheDocument();
    });

    it("does not show empty state when identities exist", () => {
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Street Sam")],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("No identities added")).not.toBeInTheDocument();
    });
  });

  describe("identity list display", () => {
    it("renders identity cards for each identity", () => {
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Street Sam"), createFakeIdentity("Mr. Johnson")],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const cards = screen.getAllByTestId("identity-card");
      expect(cards).toHaveLength(2);
      expect(cards[0]).toHaveAttribute("data-identity-name", "Street Sam");
      expect(cards[1]).toHaveAttribute("data-identity-name", "Mr. Johnson");
    });

    it("renders identity with fake SIN", () => {
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Razor", 4)],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("sin-type")).toHaveTextContent("fake");
    });

    it("renders identity with real SIN", () => {
      const state = createBaseState({
        selections: {
          identities: [createRealIdentity("John Smith")],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("sin-type")).toHaveTextContent("real");
    });
  });

  describe("nuyen budget tracking", () => {
    it("shows total cost of 0 when no identities", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-total", "0");
    });

    it("calculates fake SIN costs correctly", () => {
      // Rating 4 fake SIN = 4 * 2500 = 10000
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Razor", 4)],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-total", "10000");
    });

    it("calculates costs for multiple identities", () => {
      // Rating 4 = 10000, Rating 2 = 5000. Total = 15000
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Razor", 4), createFakeIdentity("Ghost", 2)],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-total", "15000");
    });

    it("includes license costs in total", () => {
      // SIN rating 4 = 10000, License rating 3 = 600. Total = 10600
      const identity: Identity = {
        ...createFakeIdentity("Razor", 4),
        licenses: [{ id: "lic-1", type: "fake", name: "Firearms License", rating: 3 }],
      };
      const state = createBaseState({
        selections: { identities: [identity] },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-total", "10600");
    });

    it("includes lifestyle costs in total", () => {
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Razor", 4)],
          lifestyles: [createLifestyle("ls-1", "medium", 5000, "identity-Razor")],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      // SIN: 10000, Lifestyle: 5000 * 1 month = 5000. Total = 15000
      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-total", "15000");
    });

    it("does not count real SIN costs", () => {
      const state = createBaseState({
        selections: {
          identities: [createRealIdentity("John Smith")],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-total", "0");
    });

    it("includes subscription costs in total", () => {
      const identity: Identity = {
        ...createFakeIdentity("Razor", 4),
        subscriptions: [{ id: "sub-1", name: "GridGuide", monthlyCost: 100 }],
      };
      const state = createBaseState({
        selections: { identities: [identity] },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      // SIN: 10000, Subscription: 100. Total = 10100
      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-total", "10100");
    });
  });

  describe("validation status", () => {
    it("shows warning status when no identities exist", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("shows valid status when identities exist", () => {
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Razor")],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows error status when SINner quality present but no real SIN", () => {
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Razor")],
          negativeQualities: ["sinner"],
          qualityLevels: { sinner: 1 },
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });

    it("shows valid status when SINner quality present with real SIN", () => {
      const state = createBaseState({
        selections: {
          identities: [createRealIdentity("John Smith")],
          negativeQualities: ["sinner"],
          qualityLevels: { sinner: 1 },
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows SINner quality warning message when real SIN needed", () => {
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Razor")],
          negativeQualities: ["sinner"],
          qualityLevels: { sinner: 1 },
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(
        screen.getByText(/SINner quality requires at least one identity with a real SIN/)
      ).toBeInTheDocument();
    });

    it("does not show SINner warning when no SINner quality", () => {
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Razor")],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText(/SINner quality requires/)).not.toBeInTheDocument();
    });

    it("shows correct SINner level label for Criminal", () => {
      const state = createBaseState({
        selections: {
          identities: [],
          negativeQualities: ["sinner"],
          qualityLevels: { sinner: 2 },
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Criminal/)).toBeInTheDocument();
    });
  });

  describe("add/remove interactions", () => {
    it("opens identity modal when Add button clicked", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("identity-modal")).not.toBeInTheDocument();

      const addButton = within(screen.getByTestId("header-action")).getByRole("button");
      fireEvent.click(addButton);

      expect(screen.getByTestId("identity-modal")).toBeInTheDocument();
    });

    it("adds identity when modal save is triggered", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      // Open modal
      const addButton = within(screen.getByTestId("header-action")).getByRole("button");
      fireEvent.click(addButton);

      // Save
      fireEvent.click(screen.getByTestId("save-identity"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          identities: expect.arrayContaining([
            expect.objectContaining({
              name: "New Identity",
              sin: expect.objectContaining({ type: "fake", rating: 4 }),
            }),
          ]),
        }),
      });
    });

    it("removes identity when remove is triggered", () => {
      const state = createBaseState({
        selections: {
          identities: [createFakeIdentity("Razor"), createFakeIdentity("Ghost")],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("remove-identity-Razor"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          identities: [expect.objectContaining({ name: "Ghost" })],
        }),
      });
    });

    it("closes modal on close button click", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      // Open modal
      const addButton = within(screen.getByTestId("header-action")).getByRole("button");
      fireEvent.click(addButton);
      expect(screen.getByTestId("identity-modal")).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByTestId("close-identity-modal"));
      expect(screen.queryByTestId("identity-modal")).not.toBeInTheDocument();
    });
  });

  describe("summary footer", () => {
    it("shows 0 count when no identities", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "0");
    });

    it("shows correct count for multiple identities", () => {
      const state = createBaseState({
        selections: {
          identities: [
            createFakeIdentity("Razor"),
            createFakeIdentity("Ghost"),
            createRealIdentity("John"),
          ],
        },
      });

      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "3");
    });

    it("uses currency format", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-format", "currency");
    });

    it("uses identity label", () => {
      const state = createBaseState();
      render(<IdentitiesCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-label", "identity");
    });
  });
});
