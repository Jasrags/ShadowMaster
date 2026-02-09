/**
 * VehiclesCard Component Tests
 *
 * Tests the vehicle and drone purchasing card in character creation.
 * Tests include locked state, section display (vehicles, drones, RCCs, autosofts),
 * add/remove items, nuyen budget tracking, and validation status.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VehiclesCard } from "../VehiclesCard";

// Mock hooks
vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

// Mock shared components
vi.mock("../shared", () => ({
  CreationCard: ({
    title,
    status,
    children,
    headerAction,
  }: {
    title: string;
    status: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      {headerAction && <div data-testid="header-action">{headerAction}</div>}
      {children}
    </div>
  ),
  SummaryFooter: ({ count, total, label }: { count: number; total: number; label?: string }) => (
    <div data-testid="summary-footer">
      {count} {label}(s) — {total}
    </div>
  ),
  KarmaConversionModal: () => null,
  useKarmaConversionPrompt: () => ({
    checkPurchase: vi.fn(() => null),
    promptConversion: vi.fn(),
    modalState: { isOpen: false, itemName: "", itemCost: 0, karmaToConvert: 0 },
    closeModal: vi.fn(),
    confirmConversion: vi.fn(),
    currentRemaining: 0,
    karmaAvailable: 0,
    currentKarmaConversion: 0,
    maxKarmaConversion: 10,
  }),
  LegalityWarnings: ({ items }: { items: unknown[] }) =>
    items.length > 0 ? <div data-testid="legality-warnings">{items.length} warnings</div> : null,
  LegalityBadge: () => null,
}));

// Mock vehicle sub-components
vi.mock("../vehicles", () => ({
  VehicleSystemModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="vehicle-modal">Modal Open</div> : null,
}));

// Mock UI components
vi.mock("@/components/ui", () => ({
  InfoTooltip: () => null,
}));

import { useCreationBudgets } from "@/lib/contexts";

const makeVehicle = (overrides = {}) => ({
  id: "v1",
  catalogId: "ford-americar",
  name: "Ford Americar",
  category: "sedan",
  cost: 16000,
  availability: 4,
  ...overrides,
});

const makeDrone = (overrides = {}) => ({
  id: "d1",
  catalogId: "mct-fly-spy",
  name: "MCT Fly-Spy",
  size: "mini",
  handling: 4,
  speed: 3,
  acceleration: 3,
  body: 1,
  armor: 0,
  pilot: 3,
  sensor: 3,
  cost: 2000,
  availability: 4,
  ...overrides,
});

const makeRCC = (overrides = {}) => ({
  id: "r1",
  catalogId: "rcc-standard",
  name: "RCC-4",
  deviceRating: 4,
  dataProcessing: 3,
  firewall: 3,
  cost: 5000,
  availability: 6,
  ...overrides,
});

const makeAutosoft = (overrides = {}) => ({
  id: "a1",
  catalogId: "targeting-autosoft",
  name: "Targeting",
  category: "offensive",
  rating: 3,
  cost: 750,
  availability: 4,
  ...overrides,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 4,
  priorities: {
    metatype: "A",
    attributes: "B",
    magic: "C",
    skills: "D",
    resources: "E",
    ...overrides.priorities,
  },
  selections: {
    metatype: "human",
    vehicles: [],
    drones: [],
    rccs: [],
    autosofts: [],
    ...overrides.selections,
  },
  budgets: {
    ...overrides.budgets,
  },
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("VehiclesCard", () => {
  let mockUpdateState: Mock;
  let mockGetBudget: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();
    mockGetBudget = vi.fn((budgetId: string) => {
      if (budgetId === "nuyen")
        return { total: 450000, spent: 0, remaining: 450000, label: "Nuyen" };
      if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
      return null;
    });

    vi.mocked(useCreationBudgets).mockReturnValue({
      getBudget: mockGetBudget,
      budgets: {},
      updateSpent: vi.fn(),
      errors: [],
      warnings: [],
      isComplete: false,
    } as unknown as ReturnType<typeof useCreationBudgets>);
  });

  describe("locked state", () => {
    it("shows locked state when priorities not set", () => {
      const state = createBaseState({ priorities: {} });
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Set priorities first")).toBeInTheDocument();
    });

    it("shows pending status when locked", () => {
      const state = createBaseState({ priorities: {} });
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });
  });

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Vehicles & Drones");
    });

    it("shows empty state when no items", () => {
      const state = createBaseState();
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No vehicles or drones selected")).toBeInTheDocument();
    });

    it("renders nuyen bar", () => {
      const state = createBaseState();
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Nuyen")).toBeInTheDocument();
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByRole("button", { name: /Add/ })).toBeInTheDocument();
    });

    it("renders footer summary", () => {
      const state = createBaseState();
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("summary-footer")).toBeInTheDocument();
    });

    it("opens vehicle modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("vehicle-modal")).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      expect(screen.getByTestId("vehicle-modal")).toBeInTheDocument();
    });
  });

  describe("vehicles section", () => {
    it("renders vehicles section with items", () => {
      const state = createBaseState({
        selections: { vehicles: [makeVehicle()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Vehicles")).toBeInTheDocument();
      expect(screen.getByText("Ford Americar")).toBeInTheDocument();
    });

    it("shows vehicle cost", () => {
      const state = createBaseState({
        selections: { vehicles: [makeVehicle()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("¥16,000")).toBeInTheDocument();
    });

    it("shows vehicle count badge", () => {
      const state = createBaseState({
        selections: { vehicles: [makeVehicle(), makeVehicle({ id: "v2", name: "Shin-Hyung" })] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      // Count badge in section header
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  describe("drones section", () => {
    it("renders drones section with items", () => {
      const state = createBaseState({
        selections: { drones: [makeDrone()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Drones")).toBeInTheDocument();
      expect(screen.getByText("MCT Fly-Spy")).toBeInTheDocument();
    });

    it("shows drone cost", () => {
      const state = createBaseState({
        selections: { drones: [makeDrone()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("¥2,000")).toBeInTheDocument();
    });
  });

  describe("RCC section", () => {
    it("renders RCC section with items", () => {
      const state = createBaseState({
        selections: { rccs: [makeRCC()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("RCCs")).toBeInTheDocument();
      expect(screen.getByText("RCC-4")).toBeInTheDocument();
    });
  });

  describe("autosofts section", () => {
    it("renders autosoft section with name and rating", () => {
      const state = createBaseState({
        selections: { autosofts: [makeAutosoft()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Autosofts")).toBeInTheDocument();
      expect(screen.getByText("Targeting R3")).toBeInTheDocument();
    });
  });

  describe("remove items", () => {
    it("removes vehicle when remove button is clicked", () => {
      const state = createBaseState({
        selections: { vehicles: [makeVehicle()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);
      fireEvent.click(screen.getByTitle("Remove vehicle"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          vehicles: [],
        }),
      });
    });

    it("removes drone when remove button is clicked", () => {
      const state = createBaseState({
        selections: { drones: [makeDrone()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);
      fireEvent.click(screen.getByTitle("Remove drone"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          drones: [],
        }),
      });
    });

    it("removes RCC when remove button is clicked", () => {
      const state = createBaseState({
        selections: { rccs: [makeRCC()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);
      fireEvent.click(screen.getByTitle("Remove RCC"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          rccs: [],
        }),
      });
    });

    it("removes autosoft when remove button is clicked", () => {
      const state = createBaseState({
        selections: { autosofts: [makeAutosoft()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);
      fireEvent.click(screen.getByTitle("Remove autosoft"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          autosofts: [],
        }),
      });
    });
  });

  describe("validation status", () => {
    it("shows pending status when no items", () => {
      const state = createBaseState();
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when items present", () => {
      const state = createBaseState({
        selections: { vehicles: [makeVehicle()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows error status when over budget", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen")
          return { total: 6000, spent: 20000, remaining: -14000, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      const state = createBaseState({
        selections: { vehicles: [makeVehicle()] },
      });

      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });
  });

  describe("nuyen budget", () => {
    it("shows nuyen spent and total", () => {
      const state = createBaseState();
      render(<VehiclesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("0 / 450,000")).toBeInTheDocument();
    });
  });
});
