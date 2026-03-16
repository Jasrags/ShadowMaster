/**
 * ContactsCard Component Tests
 *
 * Tests the contacts management card in character creation.
 * Tests include rendering, contact list display, karma budget tracking,
 * validation status, add/remove contacts, and summary footer.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactsCard } from "../ContactsCard";
import type { Contact } from "@/lib/types";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Plus: ({ className }: { className?: string }) => (
    <span data-testid="icon-plus" className={className} />
  ),
  X: ({ className }: { className?: string }) => <span data-testid="icon-x" className={className} />,
  Edit2: ({ className }: { className?: string }) => (
    <span data-testid="icon-edit" className={className} />
  ),
  User: ({ className }: { className?: string }) => (
    <span data-testid="icon-user" className={className} />
  ),
}));

// Mock InfoTooltip
vi.mock("@/components/ui", () => ({
  InfoTooltip: ({ content, label }: { content: string; label: string }) => (
    <span data-testid="info-tooltip" aria-label={label}>
      {content}
    </span>
  ),
}));

// Mock shared CreationCard and SummaryFooter
vi.mock("@/components/creation/shared", () => ({
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
    label,
  }: {
    count: number;
    total: number | string;
    label: string;
  }) => (
    <div data-testid="summary-footer" data-count={count} data-total={total} data-label={label}>
      {count} {label}(s) — {total}
    </div>
  ),
}));

// Mock ContactModal
vi.mock("../ContactModal", () => ({
  ContactModal: ({
    isOpen,
    onSave,
    onClose,
    availableKarma,
  }: {
    isOpen: boolean;
    onSave: (contact: Contact) => void;
    onClose: () => void;
    availableKarma: number;
  }) =>
    isOpen ? (
      <div data-testid="contact-modal" data-available-karma={availableKarma}>
        <button
          data-testid="modal-save"
          onClick={() => onSave({ name: "New Contact", connection: 2, loyalty: 1 })}
        >
          Save
        </button>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

// Mock ContactKarmaConfirmModal
vi.mock("../ContactKarmaConfirmModal", () => ({
  ContactKarmaConfirmModal: ({
    isOpen,
    onConfirm,
    onClose,
    contactName,
    karmaFromGeneral,
  }: {
    isOpen: boolean;
    onConfirm: () => void;
    onClose: () => void;
    contactName: string;
    karmaFromGeneral: number;
  }) =>
    isOpen ? (
      <div
        data-testid="karma-confirm-modal"
        data-contact-name={contactName}
        data-karma-from-general={karmaFromGeneral}
      >
        <button data-testid="karma-confirm" onClick={onConfirm}>
          Confirm
        </button>
        <button data-testid="karma-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    ) : null,
}));

// Mock @/lib/rules hooks
vi.mock("@/lib/rules", () => ({
  useContactTemplates: () => [],
  useMetatypes: () => [
    {
      id: "human",
      name: "Human",
      attributes: {
        charisma: { min: 1, max: 6 },
      },
    },
  ],
  useGameplayLevelModifiers: () => ({
    label: "Street",
    startingKarma: 25,
    maxAvailability: 12,
    contactMultiplier: 3,
    resourcesMultiplier: 1,
  }),
}));

// Mock @/lib/rules/qualities/budget-modifiers
vi.mock("@/lib/rules/qualities/budget-modifiers", () => ({
  FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER: 4,
}));

// Mock @/lib/contexts
const createMockBudgets = (overrides?: {
  karma?: { total: number; spent: number; remaining: number; label: string };
}) => ({
  karma: { total: 25, spent: 0, remaining: 25, label: "Karma" },
  ...overrides,
});

const createMockQualityModifiers = (overrides?: { friendsInHighPlaces?: boolean }) => ({
  friendsInHighPlaces: false,
  karmaToNuyenCap: 10,
  knowledgeCostMultipliers: {},
  languageCostMultiplier: 1,
  jackOfAllTrades: false,
  ...overrides,
});

let currentBudgets = createMockBudgets();
let currentQualityModifiers = createMockQualityModifiers();

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: () => ({
    budgets: currentBudgets,
    qualityModifiers: currentQualityModifiers,
    getBudget: (id: string) => currentBudgets[id as keyof typeof currentBudgets] ?? null,
    errors: [],
    warnings: [],
    isValid: true,
    canFinalize: false,
    updateSpent: vi.fn(),
    resolvedLifeModuleGrants: {
      freeSkills: [],
      freeKnowledgeSkills: [],
      freeQualities: [],
      freeContacts: [],
    },
  }),
}));

// Factory to create test state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  characterId: "test-char-1",
  creationMethodId: "priority",
  currentStep: 7,
  completedSteps: [],
  priorities: {},
  gameplayLevel: "street",
  selections: {
    metatype: "human",
    attributes: { charisma: 3 },
    contacts: [],
    ...overrides.selections,
  },
  budgets: {},
  validation: { errors: [], warnings: [] },
  ...overrides,
});

const makeContact = (overrides: Partial<Contact> = {}): Contact => ({
  name: "Fixer Frank",
  connection: 3,
  loyalty: 2,
  type: "Fixer",
  ...overrides,
});

describe("ContactsCard", () => {
  let mockUpdateState: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();

    // Reset to fresh mock objects
    currentBudgets = createMockBudgets();
    currentQualityModifiers = createMockQualityModifiers();
  });

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Contacts");
    });

    it("renders empty state when no contacts", () => {
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No contacts added")).toBeInTheDocument();
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      const addButton = screen.getByRole("button", { name: /add/i });
      expect(addButton).toBeInTheDocument();
    });

    it("renders contact points bar", () => {
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Contact Points")).toBeInTheDocument();
    });

    it("shows free contact karma based on CHA x multiplier", () => {
      // CHA=3, multiplier=3, so free pool = 9
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("0 / 9")).toBeInTheDocument();
    });
  });

  describe("contact list display", () => {
    it("renders contact names", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [makeContact({ name: "Fixer Frank" })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Fixer Frank")).toBeInTheDocument();
    });

    it("renders contact connection and loyalty ratings", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [makeContact({ connection: 3, loyalty: 2 })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("C: 3")).toBeInTheDocument();
      expect(screen.getByText("L: 2")).toBeInTheDocument();
    });

    it("renders contact type badge", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [makeContact({ type: "Fixer" })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Fixer")).toBeInTheDocument();
    });

    it("renders karma cost badge for paid contacts", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [makeContact({ connection: 3, loyalty: 2 })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      // Cost = connection + loyalty = 5
      expect(screen.getByText("5K")).toBeInTheDocument();
    });

    it("renders multiple contacts", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 5 },
          contacts: [
            makeContact({ name: "Fixer Frank", connection: 3, loyalty: 2 }),
            makeContact({ name: "Street Doc", connection: 2, loyalty: 3 }),
          ],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Fixer Frank")).toBeInTheDocument();
      expect(screen.getByText("Street Doc")).toBeInTheDocument();
    });

    it("renders quality contacts with Quality badge and Free label", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [
            makeContact({
              name: "Made Man Contact",
              connection: 4,
              loyalty: 2,
              sourceQualityId: "made-man",
            }),
          ],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Made Man Contact")).toBeInTheDocument();
      expect(screen.getByText("Quality")).toBeInTheDocument();
      expect(screen.getByText("Free")).toBeInTheDocument();
    });

    it("does not show edit/remove buttons for quality contacts", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [
            makeContact({
              name: "Quality Contact",
              sourceQualityId: "made-man",
            }),
          ],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTitle("Edit contact")).not.toBeInTheDocument();
      expect(screen.queryByTitle("Remove contact")).not.toBeInTheDocument();
    });

    it("shows edit and remove buttons for paid contacts", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [makeContact()],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTitle("Edit contact")).toBeInTheDocument();
      expect(screen.getByTitle("Remove contact")).toBeInTheDocument();
    });
  });

  describe("karma budget tracking", () => {
    it("shows spent contact points correctly", () => {
      // CHA=3, multiplier=3, free pool=9
      // Contact costs: 3+2=5
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [makeContact({ connection: 3, loyalty: 2 })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("5 / 9")).toBeInTheDocument();
    });

    it("shows general karma overflow when exceeding free pool", () => {
      // CHA=1, multiplier=3, free pool=3
      // Contacts cost: 3+2=5, overflow = 2 via karma
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 1 },
          contacts: [makeContact({ connection: 3, loyalty: 2 })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("+2 via karma")).toBeInTheDocument();
    });

    it("does not show karma overflow when within free pool", () => {
      // CHA=3, multiplier=3, free pool=9, contact costs=5
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [makeContact({ connection: 3, loyalty: 2 })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText(/via karma/)).not.toBeInTheDocument();
    });

    it("does not count quality contacts in karma spent", () => {
      // Quality contacts are free and should not be included in cost
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [
            makeContact({
              name: "Quality Contact",
              connection: 4,
              loyalty: 3,
              sourceQualityId: "made-man",
            }),
          ],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      // Free pool should show 0 spent since quality contacts aren't counted
      expect(screen.getByText("0 / 9")).toBeInTheDocument();
    });

    it("disables Add button when no karma available", () => {
      // CHA=1, multiplier=3, free pool=3, karma remaining=0
      // Contact with cost 3 uses all free pool
      currentBudgets = createMockBudgets({
        karma: { total: 25, spent: 25, remaining: 0, label: "Karma" },
      });
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 1 },
          contacts: [makeContact({ connection: 2, loyalty: 1 })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      const addButton = screen.getByRole("button", { name: /add/i });
      expect(addButton).toBeDisabled();
    });
  });

  describe("validation status", () => {
    it("shows pending status when no contacts", () => {
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when contacts exist", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 3 },
          contacts: [makeContact()],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });
  });

  describe("add/remove contacts", () => {
    it("opens modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      const addButton = screen.getByRole("button", { name: /add/i });
      fireEvent.click(addButton);

      expect(screen.getByTestId("contact-modal")).toBeInTheDocument();
    });

    it("adds a contact when modal save is clicked (within free pool)", () => {
      // CHA=3, multiplier=3, free pool=9 -> new contact (2+1=3) fits in free pool
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      // Open modal
      fireEvent.click(screen.getByRole("button", { name: /add/i }));
      // Save contact from modal mock (name: "New Contact", connection: 2, loyalty: 1)
      fireEvent.click(screen.getByTestId("modal-save"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          contacts: [{ name: "New Contact", connection: 2, loyalty: 1 }],
        }),
      });
    });

    it("removes a contact when remove button is clicked", () => {
      const contact1 = makeContact({ name: "Contact A", connection: 2, loyalty: 1 });
      const contact2 = makeContact({ name: "Contact B", connection: 3, loyalty: 2 });
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 5 },
          contacts: [contact1, contact2],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      // Click the first remove button
      const removeButtons = screen.getAllByTitle("Remove contact");
      fireEvent.click(removeButtons[0]);

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          contacts: [contact2],
        }),
      });
    });

    it("closes modal when close button is clicked", () => {
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      // Open modal
      fireEvent.click(screen.getByRole("button", { name: /add/i }));
      expect(screen.getByTestId("contact-modal")).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByTestId("modal-close"));
      expect(screen.queryByTestId("contact-modal")).not.toBeInTheDocument();
    });

    it("shows karma confirmation when adding contact that exceeds free pool", () => {
      // CHA=1, multiplier=3, free pool=3
      // New contact costs 2+1=3 which exactly fits free pool, no confirmation needed
      // But if we already have a contact using 2 pts, new one (2+1=3) overflows by 2
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 1 },
          contacts: [makeContact({ connection: 1, loyalty: 1 })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      // Open and save from modal (adds contact with cost 3)
      fireEvent.click(screen.getByRole("button", { name: /add/i }));
      fireEvent.click(screen.getByTestId("modal-save"));

      // Should show karma confirmation modal
      expect(screen.getByTestId("karma-confirm-modal")).toBeInTheDocument();
    });

    it("adds contact after confirming karma spend", () => {
      // CHA=1, multiplier=3, free pool=3
      // Existing contact costs 2, new contact costs 3 -> overflow = 2
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 1 },
          contacts: [makeContact({ connection: 1, loyalty: 1 })],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      // Open modal and save
      fireEvent.click(screen.getByRole("button", { name: /add/i }));
      fireEvent.click(screen.getByTestId("modal-save"));

      // Confirm karma spend
      fireEvent.click(screen.getByTestId("karma-confirm"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          contacts: expect.arrayContaining([{ name: "New Contact", connection: 2, loyalty: 1 }]),
        }),
      });
    });
  });

  describe("summary footer", () => {
    it("renders summary footer with zero contacts", () => {
      const state = createBaseState();
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "0");
      expect(footer).toHaveAttribute("data-total", "0 pts");
      expect(footer).toHaveAttribute("data-label", "contact");
    });

    it("renders summary footer with contact count and total karma", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 5 },
          contacts: [
            makeContact({ connection: 3, loyalty: 2 }),
            makeContact({ connection: 2, loyalty: 1 }),
          ],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "2");
      // Total = (3+2) + (2+1) = 8 pts (but only paid contacts count)
      expect(footer).toHaveAttribute("data-total", "8 pts");
      expect(footer).toHaveAttribute("data-label", "contact");
    });

    it("includes quality contacts in count but not in total karma", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { charisma: 5 },
          contacts: [
            makeContact({ connection: 3, loyalty: 2 }),
            makeContact({
              name: "Quality Contact",
              connection: 4,
              loyalty: 3,
              sourceQualityId: "made-man",
            }),
          ],
        },
      });
      render(<ContactsCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      // Count includes all contacts
      expect(footer).toHaveAttribute("data-count", "2");
      // Total only includes paid contacts: 3+2=5
      // Wait - SummaryFooter receives totalContactKarmaSpent which only sums paidContacts
      expect(footer).toHaveAttribute("data-total", "5 pts");
    });
  });
});
