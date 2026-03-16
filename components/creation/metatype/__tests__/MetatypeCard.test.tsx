/**
 * MetatypeCard Component Tests
 *
 * Tests the metatype selection card in character creation.
 * Covers locked state, priority-based selection, point-buy mode,
 * selected display, and state updates.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MetatypeCard } from "../MetatypeCard";

// Mock dependencies
vi.mock("@/lib/rules", () => ({
  useMetatypes: vi.fn(),
  usePriorityTable: vi.fn(),
}));

vi.mock("@/lib/rules/RulesetContext", () => ({
  useCreationMethod: vi.fn(),
}));

vi.mock("@/lib/rules/point-buy-validation", () => ({
  POINT_BUY_METATYPE_COSTS: { human: 0, elf: 40, dwarf: 25, ork: 25, troll: 40 },
}));

vi.mock("@/lib/rules/shapeshifter", () => ({
  isShapeshifterMetatype: vi.fn(() => false),
}));

// Mock child components
vi.mock("../MetatypeModal", () => ({
  MetatypeModal: ({
    isOpen,
    onConfirm,
    onClose,
  }: {
    isOpen: boolean;
    onConfirm: (id: string) => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="metatype-modal">
        <button data-testid="select-elf" onClick={() => onConfirm("elf")}>
          Select Elf
        </button>
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock("../ShapeshifterMetahumanFormSelector", () => ({
  ShapeshifterMetahumanFormSelector: () => (
    <div data-testid="shapeshifter-selector">Shapeshifter Form</div>
  ),
}));

vi.mock("../../shared", () => ({
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

import { useMetatypes, usePriorityTable } from "@/lib/rules";
import { useCreationMethod } from "@/lib/rules/RulesetContext";

const mockMetatypes = [
  {
    id: "human",
    name: "Human",
    description: "Standard human",
    racialTraits: [],
    attributes: { body: { min: 1, max: 6 } },
  },
  {
    id: "elf",
    name: "Elf",
    description: "Pointed ears, agile",
    racialTraits: ["Low-Light Vision", "Agile"],
    attributes: { body: { min: 1, max: 6 }, agility: { min: 2, max: 7 } },
  },
];

const mockPriorityTable = {
  table: {
    A: { metatype: { available: ["human", "elf"], specialAttributePoints: { human: 9, elf: 8 } } },
    B: { metatype: { available: ["human", "elf"], specialAttributePoints: { human: 7, elf: 6 } } },
    C: { metatype: { available: ["human"], specialAttributePoints: { human: 5 } } },
    D: { metatype: { available: ["human"], specialAttributePoints: { human: 3 } } },
    E: { metatype: { available: ["human"], specialAttributePoints: { human: 1 } } },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 2,
  creationMethodId: "priority",
  priorities: { metatype: "A", ...overrides.priorities },
  selections: { ...overrides.selections },
  budgets: {},
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("MetatypeCard", () => {
  let mockUpdateState: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();
    vi.mocked(useMetatypes).mockReturnValue(mockMetatypes as never);
    vi.mocked(usePriorityTable).mockReturnValue(mockPriorityTable as never);
    vi.mocked(useCreationMethod).mockReturnValue({ type: "priority" } as never);
  });

  describe("locked state", () => {
    it("shows locked message when no metatype priority is set", () => {
      const state = createBaseState({ priorities: {} });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Set Metatype priority first")).toBeInTheDocument();
    });

    it("has pending status when locked", () => {
      const state = createBaseState({ priorities: {} });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });
  });

  describe("rendering with priority", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Metatype");
    });

    it("shows option count in description", () => {
      const state = createBaseState();
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent("Priority A");
      expect(screen.getByTestId("card-description")).toHaveTextContent("2 options");
    });

    it("shows Select button when no metatype selected", () => {
      const state = createBaseState();
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Choose metatype...")).toBeInTheDocument();
      expect(screen.getByText("Select")).toBeInTheDocument();
    });

    it("has warning status when unlocked but no selection", () => {
      const state = createBaseState();
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });
  });

  describe("selected state", () => {
    it("shows selected metatype name", () => {
      const state = createBaseState({ selections: { metatype: "elf" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Elf")).toBeInTheDocument();
    });

    it("shows Change button when metatype is selected", () => {
      const state = createBaseState({ selections: { metatype: "elf" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Change")).toBeInTheDocument();
    });

    it("shows special attribute points for priority-based", () => {
      const state = createBaseState({ selections: { metatype: "elf" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Special Attribute Points:")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("shows racial traits when present", () => {
      const state = createBaseState({ selections: { metatype: "elf" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Racial Traits")).toBeInTheDocument();
      expect(screen.getByText("Low-Light Vision")).toBeInTheDocument();
      expect(screen.getByText("Agile")).toBeInTheDocument();
    });

    it("has valid status when metatype selected", () => {
      const state = createBaseState({ selections: { metatype: "elf" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows description with metatype name and SAP", () => {
      const state = createBaseState({ selections: { metatype: "elf" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent("Elf");
      expect(screen.getByTestId("card-description")).toHaveTextContent("8 SAP");
    });
  });

  describe("point buy mode", () => {
    beforeEach(() => {
      vi.mocked(useCreationMethod).mockReturnValue({ type: "point-buy" } as never);
    });

    it("does not require priority in point-buy mode", () => {
      const state = createBaseState({ priorities: {} });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      // Should NOT show locked message
      expect(screen.queryByText("Set Metatype priority first")).not.toBeInTheDocument();
    });

    it("shows karma cost instead of SAP", () => {
      const state = createBaseState({ priorities: {}, selections: { metatype: "elf" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Karma Cost:")).toBeInTheDocument();
      expect(screen.getByText("40")).toBeInTheDocument();
    });

    it("shows Karma in description for selected metatype", () => {
      const state = createBaseState({ priorities: {}, selections: { metatype: "elf" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent("Elf");
      expect(screen.getByTestId("card-description")).toHaveTextContent("40 Karma");
    });
  });

  describe("modal interaction", () => {
    it("opens modal when Select button is clicked", () => {
      const state = createBaseState();
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("metatype-modal")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("Select"));

      expect(screen.getByTestId("metatype-modal")).toBeInTheDocument();
    });

    it("opens modal when Change button is clicked", () => {
      const state = createBaseState({ selections: { metatype: "elf" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Change"));

      expect(screen.getByTestId("metatype-modal")).toBeInTheDocument();
    });

    it("updates state when metatype is selected from modal", () => {
      const state = createBaseState();
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Select"));
      fireEvent.click(screen.getByTestId("select-elf"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({ metatype: "elf" }),
      });
    });
  });

  describe("unavailable metatypes hint", () => {
    it("shows higher priority hint when some metatypes are unavailable", () => {
      const state = createBaseState({ priorities: { metatype: "C" } });
      render(<MetatypeCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Higher priority needed:")).toBeInTheDocument();
      expect(screen.getByText(/Elf/)).toBeInTheDocument();
    });
  });
});
