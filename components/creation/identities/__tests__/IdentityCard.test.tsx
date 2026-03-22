/**
 * IdentityCard Component Tests
 *
 * Tests the identity display card within the identities section.
 * Tests include rendering identity info, licenses, subscriptions,
 * lifestyles, and action button callbacks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IdentityCard } from "../IdentityCard";
import type { Identity, Lifestyle, LifestyleSubscription } from "@/lib/types";
import { SinnerQuality } from "@/lib/types/character";

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

const makeIdentity = (overrides: Partial<Identity> = {}): Identity =>
  ({
    id: "identity-1",
    name: "John Smith",
    sin: { type: "fake", rating: 4 },
    licenses: [],
    subscriptions: [],
    ...overrides,
  }) as Identity;

const makeLifestyle = (overrides: Partial<Lifestyle> = {}): Lifestyle =>
  ({
    id: "lifestyle-1",
    type: "middle",
    monthlyCost: 5000,
    associatedIdentityId: "identity-1",
    ...overrides,
  }) as Lifestyle;

const defaultProps = {
  identity: makeIdentity(),
  lifestyles: [] as Lifestyle[],
  onEdit: vi.fn(),
  onRemove: vi.fn(),
  onAddLicense: vi.fn(),
  onEditLicense: vi.fn(),
  onRemoveLicense: vi.fn(),
  onAddSubscription: vi.fn(),
  onRemoveSubscription: vi.fn(),
  onAddLifestyle: vi.fn(),
  onEditLifestyle: vi.fn(),
  onRemoveLifestyle: vi.fn(),
  lifestyleCatalog: [
    { id: "street", name: "Street", monthlyCost: 0, startingNuyen: "1d6 × 20" },
    { id: "squatter", name: "Squatter", monthlyCost: 500, startingNuyen: "2d6 × 20" },
    { id: "low", name: "Low", monthlyCost: 2000, startingNuyen: "3d6 × 60" },
    { id: "medium", name: "Medium", monthlyCost: 5000, startingNuyen: "4d6 × 100" },
    { id: "high", name: "High", monthlyCost: 10000, startingNuyen: "4d6 × 500" },
    { id: "luxury", name: "Luxury", monthlyCost: 100000, startingNuyen: "6d6 × 1000" },
  ],
};

// =============================================================================
// TESTS
// =============================================================================

describe("IdentityCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  describe("rendering", () => {
    it("renders identity name", () => {
      render(<IdentityCard {...defaultProps} />);

      expect(screen.getByText("John Smith")).toBeInTheDocument();
    });

    it("renders Fake badge for fake SIN", () => {
      render(<IdentityCard {...defaultProps} />);

      expect(screen.getByText("Fake")).toBeInTheDocument();
      expect(screen.getByText("R4")).toBeInTheDocument();
    });

    it("renders Real badge for real SIN", () => {
      const identity = makeIdentity({
        sin: { type: "real", sinnerQuality: SinnerQuality.National },
      });

      render(<IdentityCard {...defaultProps} identity={identity} />);

      expect(screen.getByText("Real")).toBeInTheDocument();
      expect(screen.getByText("National")).toBeInTheDocument();
    });

    it("renders edit and remove buttons", () => {
      render(<IdentityCard {...defaultProps} />);

      expect(screen.getByTitle("Edit identity")).toBeInTheDocument();
      expect(screen.getByTitle("Remove identity")).toBeInTheDocument();
    });

    it("renders Licenses section header", () => {
      render(<IdentityCard {...defaultProps} />);

      expect(screen.getByText("Licenses")).toBeInTheDocument();
    });

    it("renders Subscriptions section header", () => {
      render(<IdentityCard {...defaultProps} />);

      expect(screen.getByText("Subscriptions")).toBeInTheDocument();
    });

    it("renders Lifestyles section header", () => {
      render(<IdentityCard {...defaultProps} />);

      expect(screen.getByText("Lifestyles")).toBeInTheDocument();
    });

    it("shows empty state for licenses when none added", () => {
      render(<IdentityCard {...defaultProps} />);

      expect(screen.getByText("No licenses added yet.")).toBeInTheDocument();
    });

    it("shows empty state for subscriptions when none added", () => {
      render(<IdentityCard {...defaultProps} />);

      expect(screen.getByText("No subscriptions added yet.")).toBeInTheDocument();
    });

    it("shows empty state for lifestyles when none added", () => {
      render(<IdentityCard {...defaultProps} />);

      expect(screen.getByText("No lifestyles added yet.")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // LICENSES
  // ===========================================================================

  describe("licenses", () => {
    it("renders license items", () => {
      const identity = makeIdentity({
        sin: { type: "fake", rating: 3 }, // Use different rating than license
        licenses: [{ id: "lic-1", name: "Firearms License", type: "fake", rating: 4 }],
      });

      render(<IdentityCard {...defaultProps} identity={identity} />);

      expect(screen.getByText("Firearms License")).toBeInTheDocument();
      // R4 for license, R3 for SIN - both visible
      expect(screen.getByText("R4")).toBeInTheDocument();
    });

    it("shows license count in section header", () => {
      const identity = makeIdentity({
        licenses: [
          { id: "lic-1", name: "Firearms License", type: "fake", rating: 4 },
          { id: "lic-2", name: "Magic License", type: "fake", rating: 3 },
        ],
      });

      render(<IdentityCard {...defaultProps} identity={identity} />);

      expect(screen.getByText("Licenses (2)")).toBeInTheDocument();
    });

    it("calls onAddLicense when add button is clicked", () => {
      const onAddLicense = vi.fn();
      render(<IdentityCard {...defaultProps} onAddLicense={onAddLicense} />);

      // The "+ Add" button in the licenses section
      const addButtons = screen.getAllByText("+ Add");
      fireEvent.click(addButtons[0]); // First "+ Add" is for licenses

      expect(onAddLicense).toHaveBeenCalled();
    });

    it("calls onEditLicense with index when edit clicked", () => {
      const onEditLicense = vi.fn();
      const identity = makeIdentity({
        licenses: [{ id: "lic-1", name: "Firearms License", type: "fake", rating: 4 }],
      });

      render(<IdentityCard {...defaultProps} identity={identity} onEditLicense={onEditLicense} />);

      fireEvent.click(screen.getByTitle("Edit license"));

      expect(onEditLicense).toHaveBeenCalledWith(0);
    });

    it("calls onRemoveLicense with index when remove clicked", () => {
      const onRemoveLicense = vi.fn();
      const identity = makeIdentity({
        licenses: [{ id: "lic-1", name: "Firearms License", type: "fake", rating: 4 }],
      });

      render(
        <IdentityCard {...defaultProps} identity={identity} onRemoveLicense={onRemoveLicense} />
      );

      fireEvent.click(screen.getByTitle("Remove license"));

      expect(onRemoveLicense).toHaveBeenCalledWith(0);
    });
  });

  // ===========================================================================
  // SUBSCRIPTIONS
  // ===========================================================================

  describe("subscriptions", () => {
    it("renders subscription items", () => {
      const identity = makeIdentity({
        subscriptions: [
          {
            id: "sub-1",
            catalogId: "docwagon-basic",
            name: "DocWagon Basic",
            monthlyCost: 5000,
          },
        ],
      });

      render(<IdentityCard {...defaultProps} identity={identity} />);

      expect(screen.getByText("DocWagon Basic")).toBeInTheDocument();
      expect(screen.getByText("5,000/mo")).toBeInTheDocument();
    });

    it("shows subscription count in section header", () => {
      const identity = makeIdentity({
        subscriptions: [{ id: "sub-1", catalogId: "dw", name: "DocWagon", monthlyCost: 5000 }],
      });

      render(<IdentityCard {...defaultProps} identity={identity} />);

      expect(screen.getByText("Subscriptions (1)")).toBeInTheDocument();
    });

    it("renders subscription level badge when present", () => {
      const identity = makeIdentity({
        subscriptions: [
          {
            id: "sub-1",
            catalogId: "dw",
            name: "DocWagon",
            monthlyCost: 5000,
            level: "Gold",
          },
        ],
      });

      render(<IdentityCard {...defaultProps} identity={identity} />);

      expect(screen.getByText("Gold")).toBeInTheDocument();
    });

    it("calls onRemoveSubscription with index when remove clicked", () => {
      const onRemoveSubscription = vi.fn();
      const identity = makeIdentity({
        subscriptions: [{ id: "sub-1", catalogId: "dw", name: "DocWagon", monthlyCost: 5000 }],
      });

      render(
        <IdentityCard
          {...defaultProps}
          identity={identity}
          onRemoveSubscription={onRemoveSubscription}
        />
      );

      fireEvent.click(screen.getByTitle("Remove subscription"));

      expect(onRemoveSubscription).toHaveBeenCalledWith(0);
    });
  });

  // ===========================================================================
  // LIFESTYLES
  // ===========================================================================

  describe("lifestyles", () => {
    it("renders associated lifestyles", () => {
      const lifestyles = [makeLifestyle()];

      render(<IdentityCard {...defaultProps} lifestyles={lifestyles} />);

      expect(screen.getByText("5,000/mo")).toBeInTheDocument();
    });

    it("shows lifestyle count in section header", () => {
      const lifestyles = [makeLifestyle()];

      render(<IdentityCard {...defaultProps} lifestyles={lifestyles} />);

      expect(screen.getByText("Lifestyles (1)")).toBeInTheDocument();
    });

    it("shows lifestyle location when present", () => {
      const lifestyles = [makeLifestyle({ location: "Downtown Seattle" })];

      render(<IdentityCard {...defaultProps} lifestyles={lifestyles} />);

      expect(screen.getByText("(Downtown Seattle)")).toBeInTheDocument();
    });

    it("calls onAddLifestyle when add button clicked", () => {
      const onAddLifestyle = vi.fn();
      render(<IdentityCard {...defaultProps} onAddLifestyle={onAddLifestyle} />);

      // Second "+ Add" button is for lifestyles (first is licenses)
      const addButtons = screen.getAllByText("+ Add");
      // Lifestyles add button
      fireEvent.click(addButtons[addButtons.length - 1]);

      expect(onAddLifestyle).toHaveBeenCalled();
    });

    it("calls onEditLifestyle with id when edit clicked", () => {
      const onEditLifestyle = vi.fn();
      const lifestyles = [makeLifestyle({ id: "lifestyle-1" })];

      render(
        <IdentityCard {...defaultProps} lifestyles={lifestyles} onEditLifestyle={onEditLifestyle} />
      );

      fireEvent.click(screen.getByTitle("Edit lifestyle"));

      expect(onEditLifestyle).toHaveBeenCalledWith("lifestyle-1");
    });

    it("calls onRemoveLifestyle with id when remove clicked", () => {
      const onRemoveLifestyle = vi.fn();
      const lifestyles = [makeLifestyle({ id: "lifestyle-1" })];

      render(
        <IdentityCard
          {...defaultProps}
          lifestyles={lifestyles}
          onRemoveLifestyle={onRemoveLifestyle}
        />
      );

      fireEvent.click(screen.getByTitle("Remove lifestyle"));

      expect(onRemoveLifestyle).toHaveBeenCalledWith("lifestyle-1");
    });
  });

  // ===========================================================================
  // IDENTITY ACTIONS
  // ===========================================================================

  describe("identity actions", () => {
    it("calls onEdit when edit button clicked", () => {
      const onEdit = vi.fn();
      render(<IdentityCard {...defaultProps} onEdit={onEdit} />);

      fireEvent.click(screen.getByTitle("Edit identity"));

      expect(onEdit).toHaveBeenCalled();
    });

    it("calls onRemove when remove button clicked", () => {
      const onRemove = vi.fn();
      render(<IdentityCard {...defaultProps} onRemove={onRemove} />);

      fireEvent.click(screen.getByTitle("Remove identity"));

      expect(onRemove).toHaveBeenCalled();
    });
  });
});
