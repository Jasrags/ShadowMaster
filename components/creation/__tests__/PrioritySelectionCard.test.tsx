/**
 * PrioritySelectionCard Component Tests
 *
 * Tests the priority assignment card in character creation.
 * Tests include rendering, priority reordering via arrow buttons,
 * description display, validation status, and default initialization.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PrioritySelectionCard } from "../PrioritySelectionCard";

// Mock the hooks used by PrioritySelectionCard
vi.mock("@/lib/rules", () => ({
  usePriorityTable: vi.fn(),
}));

import { usePriorityTable } from "@/lib/rules";

// Mock the shared CreationCard wrapper
vi.mock("../shared", () => ({
  CreationCard: ({
    title,
    description,
    status,
    children,
  }: {
    title: string;
    description: string;
    status: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      <div data-testid="card-description">{description}</div>
      {children}
    </div>
  ),
}));

// Priority table mock matching the shape PrioritySelectionCard expects
const mockPriorityTable = {
  table: {
    A: {
      metatype: {
        available: ["human", "elf", "dwarf", "ork", "troll"],
        specialAttributePoints: { human: 7, elf: 6, dwarf: 7, ork: 7, troll: 5 },
      },
      attributes: 24,
      magic: {
        options: [
          { path: "magician", magicRating: 6 },
          { path: "mystic-adept", magicRating: 6 },
        ],
      },
      skills: { skillPoints: 46, skillGroupPoints: 10 },
      resources: 450000,
    },
    B: {
      metatype: {
        available: ["human", "elf", "dwarf", "ork", "troll"],
        specialAttributePoints: { human: 4, elf: 3, dwarf: 4, ork: 4, troll: 3 },
      },
      attributes: 20,
      magic: {
        options: [
          { path: "magician", magicRating: 4 },
          { path: "technomancer", resonance: 4 },
        ],
      },
      skills: { skillPoints: 36, skillGroupPoints: 5 },
      resources: 275000,
    },
    C: {
      metatype: {
        available: ["human", "elf", "dwarf", "ork"],
        specialAttributePoints: { human: 3, elf: 2, dwarf: 3, ork: 3 },
      },
      attributes: 16,
      magic: { options: [] },
      skills: { skillPoints: 28, skillGroupPoints: 2 },
      resources: 140000,
    },
    D: {
      metatype: {
        available: ["human", "elf"],
        specialAttributePoints: { human: 2, elf: 1 },
      },
      attributes: 14,
      magic: { options: [] },
      skills: { skillPoints: 22, skillGroupPoints: 0 },
      resources: 50000,
    },
    E: {
      metatype: {
        available: ["human"],
        specialAttributePoints: { human: 1 },
      },
      attributes: 12,
      magic: { options: [] },
      skills: { skillPoints: 18, skillGroupPoints: 0 },
      resources: 6000,
    },
  },
};

// Factory to create test state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 1,
  priorities: {
    metatype: "A",
    attributes: "B",
    magic: "C",
    skills: "D",
    resources: "E",
  },
  selections: {
    metatype: "human",
    "magical-path": undefined,
    ...overrides.selections,
  },
  budgets: {},
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("PrioritySelectionCard", () => {
  let mockUpdateState: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();

    vi.mocked(usePriorityTable).mockReturnValue(
      mockPriorityTable as unknown as ReturnType<typeof usePriorityTable>
    );
  });

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Priorities");
    });

    it("renders all 5 priority category rows", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("METATYPE")).toBeInTheDocument();
      expect(screen.getByText("ATTRIBUTES")).toBeInTheDocument();
      expect(screen.getByText("MAGIC / RESONANCE")).toBeInTheDocument();
      expect(screen.getByText("SKILLS")).toBeInTheDocument();
      expect(screen.getByText("RESOURCES")).toBeInTheDocument();
    });

    it("renders priority level badges A through E", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("B")).toBeInTheDocument();
      expect(screen.getByText("C")).toBeInTheDocument();
      expect(screen.getByText("D")).toBeInTheDocument();
      expect(screen.getByText("E")).toBeInTheDocument();
    });

    it("renders rows as a list for accessibility", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      const list = screen.getByRole("list", { name: "Priority categories" });
      expect(list).toBeInTheDocument();

      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(5);
    });
  });

  describe("descriptions", () => {
    it("shows attribute points for attributes priority", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("20 points to distribute")).toBeInTheDocument();
    });

    it("shows skill points for skills priority", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("22 skill pts • 0 group pts")).toBeInTheDocument();
    });

    it("shows nuyen for resources priority", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("6,000¥ starting nuyen")).toBeInTheDocument();
    });

    it("shows Mundane only for magic at priority with no options", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      // Magic is at C which has no magic options
      expect(screen.getByText("Mundane only")).toBeInTheDocument();
    });

    it("shows metatype count and special attribute points range", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      // Metatype at A has 5 metatypes; SAP range 5-7
      expect(screen.getByText(/5 metatypes available/)).toBeInTheDocument();
      expect(screen.getByText(/5-7 special attribute pts/)).toBeInTheDocument();
    });
  });

  describe("priority reordering via arrow buttons", () => {
    it("swaps priorities when move down button is clicked", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      // Move metatype (A) down — should swap with attributes (B)
      const moveDownButton = screen.getByRole("button", {
        name: "Move METATYPE priority down",
      });
      fireEvent.click(moveDownButton);

      expect(mockUpdateState).toHaveBeenCalledWith({
        priorities: expect.objectContaining({
          metatype: "B",
          attributes: "A",
        }),
      });
    });

    it("swaps priorities when move up button is clicked", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      // Move attributes (B) up — should swap with metatype (A)
      const moveUpButton = screen.getByRole("button", {
        name: "Move ATTRIBUTES priority up",
      });
      fireEvent.click(moveUpButton);

      expect(mockUpdateState).toHaveBeenCalledWith({
        priorities: expect.objectContaining({
          metatype: "B",
          attributes: "A",
        }),
      });
    });

    it("disables move up on the first row", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      const moveUpButton = screen.getByRole("button", {
        name: "Move METATYPE priority up",
      });
      expect(moveUpButton).toBeDisabled();
    });

    it("disables move down on the last row", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      const moveDownButton = screen.getByRole("button", {
        name: "Move RESOURCES priority down",
      });
      expect(moveDownButton).toBeDisabled();
    });
  });

  describe("default priority initialization", () => {
    it("calls updateState with defaults when priorities are empty", () => {
      const state = createBaseState({ priorities: {} });
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(mockUpdateState).toHaveBeenCalledWith({
        priorities: {
          metatype: "A",
          attributes: "B",
          magic: "C",
          skills: "D",
          resources: "E",
        },
      });
    });

    it("does not re-initialize when priorities already set", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      // Should not call updateState for initialization
      expect(mockUpdateState).not.toHaveBeenCalled();
    });
  });

  describe("validation status", () => {
    it("shows valid status when all categories complete", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          "magical-path": "mundane",
        },
      });

      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      // Magic at C (no options) is auto-complete, metatype selected => all complete
      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows warning status when metatype not selected", () => {
      const state = createBaseState({
        selections: {
          metatype: undefined,
          "magical-path": undefined,
        },
      });

      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("shows All priorities set when complete", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          "magical-path": "mundane",
        },
      });

      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent("All priorities set");
    });

    it("shows selections needed count when incomplete", () => {
      const state = createBaseState({
        selections: {
          metatype: undefined,
          "magical-path": undefined,
        },
        priorities: {
          metatype: "A",
          attributes: "B",
          magic: "A", // A has magic options, so needs selection
          skills: "D",
          resources: "E",
        },
      });

      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent(/selection.*needed/);
    });

    it("treats magic at priority E as complete without selection", () => {
      const state = createBaseState({
        priorities: {
          metatype: "A",
          attributes: "B",
          magic: "E",
          skills: "C",
          resources: "D",
        },
        selections: {
          metatype: "human",
        },
      });

      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      // Magic E = Mundane only, auto-complete
      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });
  });

  describe("help text", () => {
    it("shows help text when selections are incomplete", () => {
      const state = createBaseState({
        selections: {
          metatype: undefined,
        },
      });

      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Select metatype and magic path below.")).toBeInTheDocument();
    });

    it("hides help text when all selections complete", () => {
      const state = createBaseState({
        priorities: {
          metatype: "A",
          attributes: "B",
          magic: "E",
          skills: "C",
          resources: "D",
        },
        selections: {
          metatype: "human",
        },
      });

      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Select metatype and magic path below.")).not.toBeInTheDocument();
    });
  });

  describe("keyboard navigation", () => {
    it("moves category up with ArrowUp key", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      // Get the second list item (attributes at B)
      const items = screen.getAllByRole("listitem");
      fireEvent.keyDown(items[1], { key: "ArrowUp" });

      expect(mockUpdateState).toHaveBeenCalledWith({
        priorities: expect.objectContaining({
          metatype: "B",
          attributes: "A",
        }),
      });
    });

    it("moves category down with ArrowDown key", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      // Get the first list item (metatype at A)
      const items = screen.getAllByRole("listitem");
      fireEvent.keyDown(items[0], { key: "ArrowDown" });

      expect(mockUpdateState).toHaveBeenCalledWith({
        priorities: expect.objectContaining({
          metatype: "B",
          attributes: "A",
        }),
      });
    });

    it("does not move first item up on ArrowUp", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      const items = screen.getAllByRole("listitem");
      fireEvent.keyDown(items[0], { key: "ArrowUp" });

      expect(mockUpdateState).not.toHaveBeenCalled();
    });

    it("does not move last item down on ArrowDown", () => {
      const state = createBaseState();
      render(<PrioritySelectionCard state={state} updateState={mockUpdateState} />);

      const items = screen.getAllByRole("listitem");
      fireEvent.keyDown(items[4], { key: "ArrowDown" });

      expect(mockUpdateState).not.toHaveBeenCalled();
    });
  });
});
