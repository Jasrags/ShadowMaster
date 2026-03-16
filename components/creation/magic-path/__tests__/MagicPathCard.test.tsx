/**
 * MagicPathCard Component Tests
 *
 * Tests the magic/resonance path selection card in character creation.
 * Tests include rendering, locked states, path selection, tradition selection,
 * aspected mage group selection, mentor spirit selection, and validation.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MagicPathCard } from "../MagicPathCard";
import type { CreationState } from "@/lib/types";

// Mock hooks
vi.mock("@/lib/rules", () => ({
  useMagicPaths: vi.fn(),
  usePriorityTable: vi.fn(),
  useTraditions: vi.fn(),
  useMentorSpirits: vi.fn(),
  useQualities: vi.fn(),
}));

vi.mock("@/lib/rules/RulesetContext", () => ({
  useCreationMethod: vi.fn(),
}));

vi.mock("@/lib/rules/shapeshifter", () => ({
  isShapeshifterMetatype: vi.fn(() => false),
}));

// Mock shared components
vi.mock("../../shared", () => ({
  CreationCard: ({
    title,
    description,
    status,
    children,
  }: {
    title: string;
    description?: string;
    status: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      {description && <div data-testid="card-description">{description}</div>}
      {children}
    </div>
  ),
}));

// Mock MagicPathModal
vi.mock("../MagicPathModal", () => ({
  MagicPathModal: ({
    isOpen,
    onClose,
    onConfirm,
    availableOptions,
    priorityLevel,
    currentSelection,
    magicPaths,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (pathId: string) => void;
    availableOptions: Array<{ path: string }>;
    priorityLevel?: string;
    currentSelection: string | null;
    magicPaths: Array<{ id: string; name: string }>;
  }) =>
    isOpen ? (
      <div
        data-testid="magic-path-modal"
        data-priority={priorityLevel}
        data-current={currentSelection}
        data-options={availableOptions?.length}
        data-paths={magicPaths?.length}
      >
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
        <button data-testid="modal-select-magician" onClick={() => onConfirm("magician")}>
          Select Magician
        </button>
        <button data-testid="modal-select-adept" onClick={() => onConfirm("adept")}>
          Select Adept
        </button>
        <button data-testid="modal-select-aspected-mage" onClick={() => onConfirm("aspected-mage")}>
          Select Aspected Mage
        </button>
        <button data-testid="modal-select-technomancer" onClick={() => onConfirm("technomancer")}>
          Select Technomancer
        </button>
        <button data-testid="modal-select-mundane" onClick={() => onConfirm("mundane")}>
          Select Mundane
        </button>
        <button data-testid="modal-select-mystic-adept" onClick={() => onConfirm("mystic-adept")}>
          Select Mystic Adept
        </button>
      </div>
    ) : null,
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Lock: ({ className }: { className?: string }) => (
    <span data-testid="icon-lock" className={className} />
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="icon-chevron-right" className={className} />
  ),
  ChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="icon-chevron-down" className={className} />
  ),
}));

import {
  useMagicPaths,
  usePriorityTable,
  useTraditions,
  useMentorSpirits,
  useQualities,
} from "@/lib/rules";
import { useCreationMethod } from "@/lib/rules/RulesetContext";

// Mock data
const mockMagicPaths = [
  { id: "magician", name: "Magician", hasMagic: true, hasResonance: false },
  { id: "mystic-adept", name: "Mystic Adept", hasMagic: true, hasResonance: false },
  { id: "adept", name: "Adept", hasMagic: true, hasResonance: false },
  { id: "aspected-mage", name: "Aspected Mage", hasMagic: true, hasResonance: false },
  { id: "technomancer", name: "Technomancer", hasMagic: false, hasResonance: true },
];

const mockTraditions = [
  { id: "hermetic", name: "Hermetic", drainAttributes: ["LOG", "WIL"] },
  { id: "shamanic", name: "Shamanic", drainAttributes: ["CHA", "WIL"] },
];

const mockMentorSpirits = [
  { id: "bear", name: "Bear", description: "Guardian protector" },
  { id: "cat", name: "Cat", description: "Stealthy and curious" },
];

const mockPriorityTable = {
  table: {
    A: {
      magic: {
        options: [
          { path: "magician", magicRating: 6, spells: 10 },
          { path: "mystic-adept", magicRating: 6, spells: 10 },
        ],
      },
    },
    B: {
      magic: {
        options: [
          { path: "adept", magicRating: 6 },
          { path: "aspected-mage", magicRating: 5 },
        ],
      },
    },
    C: {
      magic: {
        options: [{ path: "magician", magicRating: 3, spells: 5 }],
      },
    },
    D: {
      magic: {
        options: [{ path: "adept", magicRating: 2 }],
      },
    },
    E: {
      magic: {
        options: [],
      },
    },
  },
};

// Factory to create test state — uses partial shape cast to CreationState
const createBaseState = (overrides: Record<string, unknown> = {}) =>
  ({
    currentStep: 1,
    priorities: { magic: "A" },
    selections: {
      metatype: "human",
      positiveQualities: [],
      qualitySpecifications: {},
      qualityLevels: {},
      ...(overrides.selections as Record<string, unknown>),
    },
    budgets: {
      "karma-spent-positive": 0,
      "karma-gained-negative": 0,
      ...(overrides.budgets as Record<string, unknown>),
    },
    validation: { errors: [], warnings: [] },
    ...overrides,
  }) as unknown as CreationState;

describe("MagicPathCard", () => {
  let mockUpdateState: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();

    (useMagicPaths as Mock).mockReturnValue(mockMagicPaths);
    (usePriorityTable as Mock).mockReturnValue(mockPriorityTable);
    (useTraditions as Mock).mockReturnValue(mockTraditions);
    (useMentorSpirits as Mock).mockReturnValue(mockMentorSpirits);
    (useQualities as Mock).mockReturnValue({ positive: [], negative: [] });
    (useCreationMethod as Mock).mockReturnValue({ type: "priority" });
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Magic / Resonance");
    });

    it("shows lock message when no magic priority set", () => {
      const state = createBaseState({ priorities: {} });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Set Magic priority first")).toBeInTheDocument();
      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows mundane auto-select for Priority E", () => {
      const state = createBaseState({ priorities: { magic: "E" } });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Mundane")).toBeInTheDocument();
      expect(screen.getByText("(auto)")).toBeInTheDocument();
      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows path selection prompt when no path selected", () => {
      const state = createBaseState();
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Choose path...")).toBeInTheDocument();
    });

    it("shows selected path name when path is chosen", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Magician")).toBeInTheDocument();
    });

    it("shows magic rating for selected awakened path", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Magic Rating:/)).toBeInTheDocument();
    });

    it("shows Change button when path is selected", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Change")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  describe("validation status", () => {
    it("returns pending when no magic priority", () => {
      const state = createBaseState({ priorities: {} });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("returns warning when priority set but no path selected", () => {
      const state = createBaseState();
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("returns valid when path is selected", () => {
      const state = createBaseState({
        selections: { "magical-path": "adept", positiveQualities: [] },
        priorities: { magic: "B" },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("returns warning when aspected mage has no group selected", () => {
      const state = createBaseState({
        selections: { "magical-path": "aspected-mage", positiveQualities: [] },
        priorities: { magic: "B" },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("returns warning when magician has no tradition", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("returns valid when magician has tradition selected", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          tradition: "hermetic",
          positiveQualities: [],
        },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });
  });

  // ===========================================================================
  // PATH SELECTION
  // ===========================================================================

  describe("path selection", () => {
    it("opens modal when choose path button clicked", () => {
      const state = createBaseState();
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("magic-path-modal")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("Choose path..."));

      expect(screen.getByTestId("magic-path-modal")).toBeInTheDocument();
    });

    it("closes modal when close button clicked", () => {
      const state = createBaseState();
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Choose path..."));
      expect(screen.getByTestId("magic-path-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("modal-close"));
      expect(screen.queryByTestId("magic-path-modal")).not.toBeInTheDocument();
    });

    it("opens modal when Change button clicked on selected path", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Change"));

      expect(screen.getByTestId("magic-path-modal")).toBeInTheDocument();
    });

    it("updates state when path selected from modal", () => {
      const state = createBaseState();
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Choose path..."));
      fireEvent.click(screen.getByTestId("modal-select-magician"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          "magical-path": "magician",
        }),
      });
    });

    it("clears tradition when switching to non-tradition path", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          tradition: "hermetic",
          positiveQualities: [],
        },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Change"));
      fireEvent.click(screen.getByTestId("modal-select-adept"));

      const updateCall = mockUpdateState.mock.calls[0][0];
      expect(updateCall.selections.tradition).toBeUndefined();

      // Verify original state was not mutated
      expect(
        (state as unknown as Record<string, Record<string, unknown>>).selections.tradition
      ).toBe("hermetic");
    });

    it("clears aspected group when switching away from aspected mage", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "aspected-mage",
          "aspected-mage-group": "sorcery",
          positiveQualities: [],
        },
        priorities: { magic: "B" },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Change"));
      fireEvent.click(screen.getByTestId("modal-select-magician"));

      const updateCall = mockUpdateState.mock.calls[0][0];
      expect(updateCall.selections["aspected-mage-group"]).toBeUndefined();
    });
  });

  // ===========================================================================
  // ASPECTED MAGE GROUP
  // ===========================================================================

  describe("aspected mage group selection", () => {
    it("shows group selection buttons for aspected mage", () => {
      const state = createBaseState({
        selections: { "magical-path": "aspected-mage", positiveQualities: [] },
        priorities: { magic: "B" },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Sorcery")).toBeInTheDocument();
      expect(screen.getByText("Conjuring")).toBeInTheDocument();
      expect(screen.getByText("Enchanting")).toBeInTheDocument();
    });

    it("does not show group selection for non-aspected paths", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Sorcery")).not.toBeInTheDocument();
    });

    it("updates state when aspected group selected", () => {
      const state = createBaseState({
        selections: { "magical-path": "aspected-mage", positiveQualities: [] },
        priorities: { magic: "B" },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Sorcery"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          "aspected-mage-group": "sorcery",
        }),
      });
    });
  });

  // ===========================================================================
  // TRADITION SELECTION
  // ===========================================================================

  describe("tradition selection", () => {
    it("shows tradition dropdown for magician", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Select tradition...")).toBeInTheDocument();
    });

    it("does not show tradition for adept", () => {
      const state = createBaseState({
        selections: { "magical-path": "adept", positiveQualities: [] },
        priorities: { magic: "B" },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Select tradition...")).not.toBeInTheDocument();
    });

    it("shows tradition options when dropdown clicked", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Select tradition..."));

      expect(screen.getByText("Hermetic")).toBeInTheDocument();
      expect(screen.getByText("Shamanic")).toBeInTheDocument();
    });

    it("updates state when tradition selected", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Select tradition..."));
      fireEvent.click(screen.getByText("Hermetic"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          tradition: "hermetic",
        }),
      });
    });

    it("shows selected tradition name", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          tradition: "hermetic",
          positiveQualities: [],
        },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Hermetic")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // MENTOR SPIRIT
  // ===========================================================================

  describe("mentor spirit selection", () => {
    it("shows mentor spirit section for magician", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Mentor Spirit")).toBeInTheDocument();
    });

    it("shows mentor spirit section for adept", () => {
      const state = createBaseState({
        selections: { "magical-path": "adept", positiveQualities: [] },
        priorities: { magic: "B" },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Mentor Spirit")).toBeInTheDocument();
    });

    it("does not show mentor spirit for technomancer", () => {
      (usePriorityTable as Mock).mockReturnValue({
        table: {
          A: {
            magic: {
              options: [{ path: "technomancer", resonanceRating: 6, complexForms: 5 }],
            },
          },
        },
      });
      const state = createBaseState({
        selections: { "magical-path": "technomancer", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Mentor Spirit")).not.toBeInTheDocument();
    });

    it("shows mentor spirit options when dropdown clicked", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("None"));

      expect(screen.getByText("Bear")).toBeInTheDocument();
      expect(screen.getByText("Cat")).toBeInTheDocument();
      expect(screen.getByText("No Mentor Spirit")).toBeInTheDocument();
    });

    it("updates state when mentor spirit selected", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("None"));
      fireEvent.click(screen.getByText("Bear"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          "mentor-spirit": "bear",
          positiveQualities: expect.arrayContaining([
            expect.objectContaining({
              id: "mentor-spirit",
              specification: "Bear",
              karma: 5,
            }),
          ]),
        }),
        budgets: expect.any(Object),
      });
    });

    it("removes mentor spirit when None selected", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          "mentor-spirit": "bear",
          positiveQualities: [{ id: "mentor-spirit", specification: "Bear", karma: 5 }],
          qualitySpecifications: { "mentor-spirit": "Bear" },
        },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Bear"));
      fireEvent.click(screen.getByText("No Mentor Spirit"));

      const updateCall = mockUpdateState.mock.calls[0][0];
      expect(updateCall.selections["mentor-spirit"]).toBeUndefined();
      const positiveQualities = updateCall.selections.positiveQualities as Array<{
        id: string;
      }>;
      expect(positiveQualities.some((q) => q.id === "mentor-spirit")).toBe(false);
    });
  });

  // ===========================================================================
  // SUMMARY FOOTER
  // ===========================================================================

  describe("summary footer", () => {
    it("shows description with priority and option count", () => {
      const state = createBaseState();
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent(/Priority A/);
    });

    it("shows selected path in description", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", positiveQualities: [] },
      });
      render(<MagicPathCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent(/Magician/);
    });
  });
});
