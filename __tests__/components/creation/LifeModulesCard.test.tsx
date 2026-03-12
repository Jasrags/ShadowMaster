import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LifeModulesCard } from "@/components/creation/life-modules/LifeModulesCard";
import type { CreationState } from "@/lib/types";
import type { LifeModulesCatalog } from "@/lib/types";

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
    Plus: createIcon("Plus"),
    Route: createIcon("Route"),
    Trash2: createIcon("Trash2"),
    Search: createIcon("Search"),
    X: createIcon("X"),
    ChevronRight: createIcon("ChevronRight"),
    Check: createIcon("Check"),
    ArrowRightLeft: createIcon("ArrowRightLeft"),
  };
});

// Mock shared components
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
      <h2>{title}</h2>
      {headerAction}
      {children}
    </div>
  ),
}));

// Mock catalog
const mockCatalog: LifeModulesCatalog = {
  nationality: [
    {
      id: "ucas-seattle",
      name: "UCAS — Seattle",
      phase: "nationality" as const,
      karmaCost: 15,
      description: "Born in the Seattle Metroplex",
      activeSkills: { etiquette: 1 },
      languages: { english: 0 },
    },
  ],
  formative: [
    {
      id: "corporate",
      name: "Corp Drone",
      phase: "formative" as const,
      karmaCost: 40,
      yearsAdded: 10,
      attributeModifiers: { logic: 1 },
    },
  ],
  teen: [
    {
      id: "high-school",
      name: "High School",
      phase: "teen" as const,
      karmaCost: 50,
      yearsAdded: 7,
    },
  ],
  education: [
    {
      id: "state-university",
      name: "State University",
      phase: "education" as const,
      karmaCost: 65,
      yearsAdded: 4,
      requiresSubModuleSelection: true,
      subModules: [
        {
          id: "computer-science",
          name: "Computer Science",
          phase: "education" as const,
          karmaCost: 65,
          activeSkills: { computer: 3 },
        },
        {
          id: "law",
          name: "Law",
          phase: "education" as const,
          karmaCost: 65,
          activeSkills: { negotiation: 2 },
        },
      ],
    },
  ],
  career: [],
  tour: [],
};

vi.mock("@/lib/rules/RulesetContext", () => ({
  useLifeModules: () => mockCatalog,
  useQualities: () => ({ positive: [], negative: [] }),
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

describe("LifeModulesCard", () => {
  const mockUpdateState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with pending status when no modules selected", () => {
    render(<LifeModulesCard state={makeState()} updateState={mockUpdateState} />);

    expect(screen.getByText("Life Path Modules")).toBeInTheDocument();
    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    expect(screen.getByText(/No modules selected/)).toBeInTheDocument();
  });

  it("shows phase checklist when empty", () => {
    render(<LifeModulesCard state={makeState()} updateState={mockUpdateState} />);

    expect(screen.getByText("Nationality")).toBeInTheDocument();
    expect(screen.getByText("Formative Years")).toBeInTheDocument();
    expect(screen.getByText("Teen Years")).toBeInTheDocument();
    expect(screen.getByText(/Further Education.*optional/)).toBeInTheDocument();
  });

  it("displays selected modules by phase", () => {
    const state = makeState({
      selections: {
        lifeModules: [
          { moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 },
          { moduleId: "corporate", phase: "formative" as const, karmaCost: 40 },
        ],
      },
    });

    render(<LifeModulesCard state={state} updateState={mockUpdateState} />);

    expect(screen.getByText("UCAS — Seattle")).toBeInTheDocument();
    expect(screen.getByText("Corp Drone")).toBeInTheDocument();
    expect(screen.getByText("15K")).toBeInTheDocument();
    expect(screen.getByText("40K")).toBeInTheDocument();
  });

  it("shows module count and total karma in summary", () => {
    const state = makeState({
      selections: {
        lifeModules: [
          { moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 },
          { moduleId: "corporate", phase: "formative" as const, karmaCost: 40 },
        ],
      },
    });

    render(<LifeModulesCard state={state} updateState={mockUpdateState} />);

    expect(screen.getByText("2 modules")).toBeInTheDocument();
    expect(screen.getByText("55 Karma")).toBeInTheDocument();
  });

  it("shows warning when required phases are missing", () => {
    const state = makeState({
      selections: {
        lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 }],
      },
    });

    render(<LifeModulesCard state={state} updateState={mockUpdateState} />);

    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    expect(screen.getByText(/Formative Years/)).toBeInTheDocument();
    expect(screen.getByText(/Teen Years/)).toBeInTheDocument();
  });

  it("shows valid status when all required phases are filled", () => {
    const state = makeState({
      selections: {
        lifeModules: [
          { moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 },
          { moduleId: "corporate", phase: "formative" as const, karmaCost: 40 },
          { moduleId: "high-school", phase: "teen" as const, karmaCost: 50 },
        ],
      },
    });

    render(<LifeModulesCard state={state} updateState={mockUpdateState} />);

    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
  });

  it("removes module when trash button is clicked", () => {
    const state = makeState({
      selections: {
        lifeModules: [
          { moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 },
          { moduleId: "corporate", phase: "formative" as const, karmaCost: 40 },
        ],
      },
    });

    render(<LifeModulesCard state={state} updateState={mockUpdateState} />);

    // Click first remove button
    const removeButtons = screen.getAllByTitle("Remove module");
    fireEvent.click(removeButtons[0]);

    expect(mockUpdateState).toHaveBeenCalledWith(
      expect.objectContaining({
        selections: expect.objectContaining({
          lifeModules: [{ moduleId: "corporate", phase: "formative", karmaCost: 40 }],
        }),
      })
    );
  });

  it("displays sub-module name when present", () => {
    const state = makeState({
      selections: {
        lifeModules: [
          {
            moduleId: "state-university",
            subModuleId: "computer-science",
            phase: "education" as const,
            karmaCost: 65,
          },
        ],
      },
    });

    render(<LifeModulesCard state={state} updateState={mockUpdateState} />);

    expect(screen.getByText("State University — Computer Science")).toBeInTheDocument();
  });

  it("calculates age from module yearsAdded", () => {
    const state = makeState({
      selections: {
        lifeModules: [
          { moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 },
          { moduleId: "corporate", phase: "formative" as const, karmaCost: 40 },
          { moduleId: "high-school", phase: "teen" as const, karmaCost: 50 },
        ],
      },
    });

    render(<LifeModulesCard state={state} updateState={mockUpdateState} />);

    // corporate: 10 years + high-school: 7 years = 17
    expect(screen.getByText(/Age 17/)).toBeInTheDocument();
  });

  it("shows Add button in header", () => {
    render(<LifeModulesCard state={makeState()} updateState={mockUpdateState} />);

    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("shows error status when over karma budget", () => {
    const state = makeState({
      selections: {
        lifeModules: [
          { moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 400 },
          { moduleId: "corporate", phase: "formative" as const, karmaCost: 200 },
          { moduleId: "high-school", phase: "teen" as const, karmaCost: 200 },
        ],
      },
    });

    render(<LifeModulesCard state={state} updateState={mockUpdateState} />);

    expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
  });

  it("uses singular 'module' for single selection", () => {
    const state = makeState({
      selections: {
        lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality" as const, karmaCost: 15 }],
      },
    });

    render(<LifeModulesCard state={state} updateState={mockUpdateState} />);

    expect(screen.getByText("1 module")).toBeInTheDocument();
  });
});
