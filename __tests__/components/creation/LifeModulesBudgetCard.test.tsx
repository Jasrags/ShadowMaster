import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LifeModulesBudgetCard } from "@/components/creation/LifeModulesBudgetCard";
import type { CreationState } from "@/lib/types";

// Mock lucide-react icons
vi.mock("lucide-react", () => {
  const createIcon = (name: string) => {
    const Icon = (props: Record<string, unknown>) => (
      <span data-testid={`icon-${name}`} {...props} />
    );
    Icon.displayName = name;
    return Icon;
  };
  return {
    Route: createIcon("Route"),
  };
});

// Mock shared components
vi.mock("@/components/creation/shared", () => ({
  CreationCard: ({
    title,
    description,
    status,
    headerAction,
    children,
  }: {
    title: string;
    description: string;
    status: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <h2>{title}</h2>
      <p>{description}</p>
      {headerAction}
      {children}
    </div>
  ),
  BudgetIndicator: ({ label, spent, total }: { label: string; spent: number; total: number }) => (
    <div data-testid={`budget-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      {label}: {spent}/{total}
    </div>
  ),
}));

function makeState(overrides: Partial<CreationState> = {}): CreationState {
  return {
    editionId: "sr5",
    creationMethodId: "life-modules",
    step: 1,
    maxStepReached: 1,
    selections: {},
    budgets: {},
    validationErrors: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as CreationState;
}

describe("LifeModulesBudgetCard", () => {
  it("renders with pending status when no spending", () => {
    render(<LifeModulesBudgetCard state={makeState()} />);

    expect(screen.getByText("Karma Budget")).toBeInTheDocument();
    expect(screen.getByText(/750 Karma/)).toBeInTheDocument();
    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    expect(
      screen.getByText("Select life modules to see your karma spending breakdown.")
    ).toBeInTheDocument();
  });

  it("shows remaining karma in header", () => {
    render(<LifeModulesBudgetCard state={makeState()} />);

    expect(screen.getByText("750 remaining")).toBeInTheDocument();
  });

  it("shows life module selections in breakdown", () => {
    const state = makeState({
      selections: {
        lifeModules: [
          { moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 },
          { moduleId: "corporate", phase: "formative" as const, karmaCost: 40 },
        ],
      },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByText("Life Modules")).toBeInTheDocument();
    expect(screen.getByText("(2 modules)")).toBeInTheDocument();
    expect(screen.getByText("55")).toBeInTheDocument(); // 15 + 40
  });

  it("shows attribute karma spending", () => {
    const state = makeState({
      budgets: { "karma-spent-attributes": 100 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByText("Attributes")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("shows skill karma spending", () => {
    const state = makeState({
      budgets: { "karma-spent-skills": 50 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("shows positive quality karma as cost", () => {
    const state = makeState({
      budgets: { "positive-quality-karma-spent": 30 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByText("Positive Qualities")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("shows negative quality karma as refund with + prefix", () => {
    const state = makeState({
      budgets: { "negative-quality-karma-gained": 20 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByText("Negative Qualities")).toBeInTheDocument();
    // Negative qualities show as "+20" (refund)
    const refundEl = screen.getByText("+20");
    expect(refundEl).toBeInTheDocument();
    expect(refundEl).toHaveClass("text-emerald-600");
  });

  it("shows gear karma with nuyen conversion", () => {
    const state = makeState({
      budgets: { "karma-spent-gear": 50 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByText("Gear")).toBeInTheDocument();
    expect(screen.getByText("(100,000¥)")).toBeInTheDocument(); // 50 * 2000
  });

  it("shows contact karma spending", () => {
    const state = makeState({
      budgets: { "karma-spent-contacts": 15 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByText("Contacts")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("shows spell and power point karma", () => {
    const state = makeState({
      budgets: { "karma-spent-spells": 25, "karma-spent-power-points": 10 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByText("Spells")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Power Points")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("calculates total and remaining correctly", () => {
    const state = makeState({
      selections: {
        lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 }],
      },
      budgets: {
        "karma-spent-attributes": 100,
        "karma-spent-skills": 50,
      },
    });

    render(<LifeModulesBudgetCard state={state} />);

    // Total: 15 + 100 + 50 = 165
    expect(screen.getByText("165 / 750")).toBeInTheDocument();
    expect(screen.getByText("585 remaining")).toBeInTheDocument();
  });

  it("shows warning status when partially spent", () => {
    const state = makeState({
      budgets: { "karma-spent-attributes": 100 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    expect(screen.getByText(/Karma remaining/)).toBeInTheDocument();
  });

  it("shows valid status when all karma spent", () => {
    const state = makeState({
      selections: {
        lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 750 }],
      },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
  });

  it("shows error status when over budget", () => {
    const state = makeState({
      selections: {
        lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 800 }],
      },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    expect(screen.getByText(/Over budget by 50 Karma/)).toBeInTheDocument();
  });

  it("shows error when gear karma exceeds cap", () => {
    const state = makeState({
      budgets: { "karma-spent-gear": 210 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    expect(screen.getByText(/Gear karma cap exceeded/)).toBeInTheDocument();
  });

  it("shows error when negative quality karma exceeds cap", () => {
    const state = makeState({
      budgets: { "negative-quality-karma-gained": 30 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    expect(screen.getByText(/Negative quality karma exceeded/)).toBeInTheDocument();
  });

  it("renders gear sub-budget indicator when gear karma exists", () => {
    const state = makeState({
      budgets: { "karma-spent-gear": 50 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByTestId("budget-gear-karma")).toBeInTheDocument();
    expect(screen.getByText("Gear Karma: 50/200")).toBeInTheDocument();
  });

  it("renders negative quality sub-budget indicator when negatives exist", () => {
    const state = makeState({
      budgets: { "negative-quality-karma-gained": 15 },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByTestId("budget-negative-qualities")).toBeInTheDocument();
    expect(screen.getByText("Negative Qualities: 15/25")).toBeInTheDocument();
  });

  it("uses singular 'module' for single selection", () => {
    const state = makeState({
      selections: {
        lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 }],
      },
    });

    render(<LifeModulesBudgetCard state={state} />);

    expect(screen.getByText("(1 module)")).toBeInTheDocument();
  });

  it("accounts for negative quality refunds in total", () => {
    const state = makeState({
      selections: {
        lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 100 }],
      },
      budgets: {
        "negative-quality-karma-gained": 20,
      },
    });

    render(<LifeModulesBudgetCard state={state} />);

    // Total: 100 - 20 = 80
    expect(screen.getByText("80 / 750")).toBeInTheDocument();
    expect(screen.getByText("670 remaining")).toBeInTheDocument();
  });
});
